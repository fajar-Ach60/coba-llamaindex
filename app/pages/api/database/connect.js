// pages/api/database/connect.js
import mysql from 'mysql2/promise';
import { Pool } from 'pg';

// Global connection storage (use Redis/database in production)
let globalConnection = null;
let connectionConfig = null;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const config = req.body;
    
    // Validate required fields
    if (!config.type || !config.database) {
      return res.status(400).json({ 
        success: false, 
        error: 'Database type and name are required' 
      });
    }

    // Close existing connection
    if (globalConnection) {
      try {
        if (config.type === 'mysql') {
          await globalConnection.end();
        } else if (config.type === 'postgresql') {
          await globalConnection.end();
        }
      } catch (e) {
        console.warn('Error closing existing connection:', e);
      }
    }

    // Create new connection based on database type
    switch (config.type) {
      case 'mysql':
        globalConnection = await mysql.createConnection({
          host: config.host || 'localhost',
          port: config.port || 3306,
          user: config.username,
          password: config.password,
          database: config.database,
          ssl: config.ssl
        });
        break;

      case 'postgresql':
        globalConnection = new Pool({
          host: config.host || 'localhost',
          port: config.port || 5432,
          user: config.username,
          password: config.password,
          database: config.database,
          ssl: config.ssl
        });
        break;

      default:
        throw new Error(`Unsupported database type: ${config.type}`);
    }

    // Test the connection
    await testConnection(globalConnection, config.type);
    
    connectionConfig = config;

    res.json({
      success: true,
      message: 'Database connected successfully',
      type: config.type,
      database: config.database
    });

  } catch (error) {
    console.error('Database connection error:', error);
    globalConnection = null;
    connectionConfig = null;
    
    res.status(500).json({
      success: false,
      error: error.message || 'Connection failed'
    });
  }
}

async function testConnection(connection, type) {
  switch (type) {
    case 'mysql':
      await connection.execute('SELECT 1');
      break;
    case 'postgresql':
      await connection.query('SELECT 1');
      break;
  }
}