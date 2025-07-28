// pages/api/database/schema.js
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    if (!globalConnection || !connectionConfig) {
      return res.status(400).json({
        success: false,
        error: 'No database connection available'
      });
    }

    const schema = await extractSchema(globalConnection, connectionConfig);

    res.json({
      success: true,
      schema: schema
    });

  } catch (error) {
    console.error('Schema extraction error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to extract schema'
    });
  }
}

async function extractSchema(connection, config) {
  let tables = [];

  switch (config.type) {
    case 'mysql':
      // Get tables
      const [tablesResult] = await connection.execute(`
        SELECT TABLE_NAME, TABLE_ROWS, TABLE_COMMENT
        FROM information_schema.TABLES 
        WHERE TABLE_SCHEMA = ?
      `, [config.database]);

      for (table of tablesResult) {
        // Get columns for each table
        const [columnsResult] = await connection.execute(`
          SELECT 
            COLUMN_NAME as name,
            DATA_TYPE as dataType,
            CHARACTER_MAXIMUM_LENGTH as maxLength,
            IS_NULLABLE as isNullable,
            COLUMN_KEY as columnKey,
            COLUMN_DEFAULT as defaultValue,
            EXTRA as extra
          FROM information_schema.COLUMNS 
          WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?
          ORDER BY ORDINAL_POSITION
        `, [config.database, table.TABLE_NAME]);

        const columns = columnsResult.map(col => ({
          name: col.name,
          dataType: col.dataType,
          maxLength: col.maxLength,
          isNullable: col.isNullable === 'YES',
          isPrimary: col.columnKey === 'PRI',
          isForeign: col.columnKey === 'MUL',
          isUnique: col.columnKey === 'UNI',
          defaultValue: col.defaultValue,
          isAutoIncrement: col.extra.includes('auto_increment')
        }));

        // Get sample data
        const [sampleResult] = await connection.execute(`
          SELECT * FROM \`${table.TABLE_NAME}\` LIMIT 3
        `);

        tables.push({
          name: table.TABLE_NAME,
          rowCount: table.TABLE_ROWS,
          comment: table.TABLE_COMMENT,
          columns: columns,
          sampleData: sampleResult
        });
      }
      break;

    case 'postgresql':
      // Similar implementation for PostgreSQL
      const tablesQuery = `
        SELECT table_name, 
               (SELECT reltuples::bigint FROM pg_class WHERE relname = table_name) as row_count
        FROM information_schema.tables 
        WHERE table_schema = 'public'
      `;
      
      const pgTablesResult = await connection.query(tablesQuery);
      
      // Implementation for PostgreSQL columns...
      break;
  }

  return {
    tables: tables,
    engine: config.type,
    version: '8.0', // You'd get this from actual DB
    charset: 'utf8mb4'
  };
}