// hooks/useDatabase.js
import { useState, useCallback } from 'react';

export function useDatabase() {
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [connectionConfig, setConnectionConfig] = useState({
    type: 'mysql',
    host: 'localhost',
    port: '3306',
    database: '',
    username: '',
    password: '',
    ssl: false
  });
  const [schema, setSchema] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);

  const connect = useCallback(async (config) => {
    setIsConnecting(true);
    setConnectionStatus('connecting');
    setError(null);

    try {
      const response = await fetch('/api/database/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      });

      const data = await response.json();

      if (data.success) {
        setConnectionConfig(config);
        setConnectionStatus('connected');
        
        // Load schema after successful connection
        await loadSchema();
      } else {
        throw new Error(data.error || 'Connection failed');
      }
    } catch (err) {
      setConnectionStatus('error');
      setError(err.message);
      throw err;
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const disconnect = useCallback(async () => {
    try {
      await fetch('/api/database/disconnect', { method: 'POST' });
      setConnectionStatus('disconnected');
      setSchema(null);
      setError(null);
    } catch (err) {
      console.error('Disconnect error:', err);
    }
  }, []);

  const testConnection = useCallback(async (config) => {
    const response = await fetch('/api/database/test', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config)
    });

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Connection test failed');
    }

    return data;
  }, []);

  const loadSchema = useCallback(async () => {
    try {
      const response = await fetch('/api/database/schema');
      const data = await response.json();

      if (data.success) {
        setSchema(data.schema);
      } else {
        throw new Error(data.error || 'Failed to load schema');
      }
    } catch (err) {
      console.error('Schema loading error:', err);
      setError(err.message);
    }
  }, []);

  const executeQuery = useCallback(async (query) => {
    if (connectionStatus !== 'connected') {
      throw new Error('Database not connected');
    }

    const response = await fetch('/api/database/query', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query })
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || 'Query execution failed');
    }

    return data.result;
  }, [connectionStatus]);

  const generateSQL = useCallback(async (naturalLanguageQuery) => {
    if (connectionStatus !== 'connected') {
      throw new Error('Database not connected');
    }

    const response = await fetch('/api/database/generate-sql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        query: naturalLanguageQuery,
        schema: schema 
      })
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || 'SQL generation failed');
    }

    return data;
  }, [connectionStatus, schema]);

  return {
    // State
    connectionStatus,
    connectionConfig,
    schema,
    isConnecting,
    error,

    // Actions
    connect,
    disconnect,
    testConnection,
    loadSchema,
    executeQuery,
    generateSQL
  };
}