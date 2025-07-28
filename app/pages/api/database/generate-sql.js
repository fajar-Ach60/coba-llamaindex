// pages/api/database/generate-sql.js
import { OpenAI } from 'llamaindex';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { query, schema } = req.body;

    if (!query) {
      return res.status(400).json({ 
        success: false, 
        error: 'Query is required' 
      });
    }

    if (!schema || !schema.tables) {
      return res.status(400).json({ 
        success: false, 
        error: 'Database schema is required' 
      });
    }

    // Create schema context for LLM
    const schemaContext = createSchemaContext(schema);
    
    // Generate SQL using LLM
    const llm = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      model: "gpt-3.5-turbo"
    });

    const prompt = `
Given the following database schema:

${schemaContext}

Convert this natural language query to SQL:
"${query}"

Rules:
1. Return only valid SQL
2. Use proper table and column names from the schema
3. Add appropriate WHERE clauses for safety
4. Limit results to 100 rows max
5. Use proper JOIN syntax when needed

SQL Query:`;

    const response = await llm.complete(prompt);
    const sqlQuery = response.text.trim();

    // Basic SQL injection prevention
    if (containsSuspiciousSQL(sqlQuery)) {
      throw new Error('Generated query contains potentially unsafe operations');
    }

    res.json({
      success: true,
      sql: sqlQuery,
      naturalLanguage: query,
      explanation: `This query ${getQueryExplanation(sqlQuery)}`
    });

  } catch (error) {
    console.error('SQL generation error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate SQL'
    });
  }
}

function createSchemaContext(schema) {
  return schema.tables.map(table => {
    const columns = table.columns.map(col => 
      `${col.name} (${col.dataType}${col.isPrimary ? ', PRIMARY KEY' : ''}${col.isForeign ? ', FOREIGN KEY' : ''})`
    ).join(', ');
    
    return `Table: ${table.name}\nColumns: ${columns}\nRow count: ~${table.rowCount || 0}`;
  }).join('\n\n');
}

function containsSuspiciousSQL(sql) {
  const suspiciousPatterns = [
    /DROP\s+TABLE/i,
    /DELETE\s+FROM/i,
    /TRUNCATE/i,
    /ALTER\s+TABLE/i,
    /INSERT\s+INTO/i,
    /UPDATE\s+.*\s+SET/i,
    /CREATE\s+TABLE/i,
    /GRANT\s+/i,
    /REVOKE\s+/i
  ];
  
  return suspiciousPatterns.some(pattern => pattern.test(sql));
}

function getQueryExplanation(sql) {
  if (sql.toLowerCase().includes('select')) {
    return 'retrieves data from the database tables';
  }
  return 'performs a database operation';
}