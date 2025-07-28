// components/database/SchemaViewer.js
import { useState } from 'react';
import { Database, Table, Key, Hash, Type, ChevronDown, ChevronRight, AlertCircle } from 'lucide-react';

export default function SchemaViewer({ schema, connectionStatus }) {
  const [expandedTables, setExpandedTables] = useState(new Set());

  const toggleTable = (tableName) => {
    setExpandedTables(prev => {
      const newSet = new Set(prev);
      if (newSet.has(tableName)) {
        newSet.delete(tableName);
      } else {
        newSet.add(tableName);
      }
      return newSet;
    });
  };

  const getColumnIcon = (column) => {
    if (column.isPrimary) return <Key className="w-3 h-3 text-yellow-400" />;
    if (column.isForeign) return <Hash className="w-3 h-3 text-blue-400" />;
    return <Type className="w-3 h-3 text-purple-400" />;
  };

  const getDataTypeColor = (dataType) => {
    const type = dataType.toLowerCase();
    if (type.includes('varchar') || type.includes('text') || type.includes('char')) {
      return 'text-green-400';
    }
    if (type.includes('int') || type.includes('decimal') || type.includes('float')) {
      return 'text-blue-400';
    }
    if (type.includes('date') || type.includes('time')) {
      return 'text-yellow-400';
    }
    if (type.includes('bool')) {
      return 'text-red-400';
    }
    return 'text-purple-400';
  };

  if (connectionStatus !== 'connected') {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Database Schema</h3>
        <div className="bg-white/5 rounded-lg p-8 min-h-64 flex flex-col items-center justify-center">
          <AlertCircle className="w-12 h-12 text-purple-400 mb-4" />
          <div className="text-center">
            <p className="text-purple-300 mb-2">No database connected</p>
            <p className="text-purple-400 text-sm">
              Connect to a database to view schema information
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!schema || !schema.tables || schema.tables.length === 0) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Database Schema</h3>
        <div className="bg-white/5 rounded-lg p-8 min-h-64 flex flex-col items-center justify-center">
          <Database className="w-12 h-12 text-purple-400 mb-4" />
          <div className="text-center">
            <p className="text-purple-300 mb-2">No tables found</p>
            <p className="text-purple-400 text-sm">
              This database appears to be empty or you dont have permission to view tables.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Database Schema</h3>
        <div className="flex items-center space-x-2 text-sm text-purple-300">
          <Database className="w-4 h-4" />
          <span>{schema.tables.length} tables</span>
        </div>
      </div>

      <div className="bg-white/5 rounded-lg max-h-96 overflow-y-auto">
        <div className="space-y-1 p-2">
          {schema.tables.map((table) => {
            const isExpanded = expandedTables.has(table.name);
            
            return (
              <div key={table.name} className="border border-purple-500/20 rounded-lg overflow-hidden">
                {/* Table Header */}
                <button
                  onClick={() => toggleTable(table.name)}
                  className="w-full flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4 text-purple-400" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-purple-400" />
                    )}
                    <Table className="w-5 h-5 text-purple-400" />
                    <div className="text-left">
                      <p className="text-white font-medium">{table.name}</p>
                      <p className="text-purple-300 text-xs">
                        {table.columns?.length || 0} columns
                        {table.rowCount && ` • ${table.rowCount.toLocaleString()} rows`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {table.primaryKeys && table.primaryKeys.length > 0 && (
                      <div className="flex items-center space-x-1 text-xs text-yellow-400">
                        <Key className="w-3 h-3" />
                        <span>{table.primaryKeys.length}</span>
                      </div>
                    )}
                    {table.foreignKeys && table.foreignKeys.length > 0 && (
                      <div className="flex items-center space-x-1 text-xs text-blue-400">
                        <Hash className="w-3 h-3" />
                        <span>{table.foreignKeys.length}</span>
                      </div>
                    )}
                  </div>
                </button>

                {/* Table Columns */}
                {isExpanded && (
                  <div className="border-t border-purple-500/20">
                    {table.columns && table.columns.length > 0 ? (
                      <div className="p-2 space-y-1">
                        {table.columns.map((column, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-2 bg-white/5 rounded hover:bg-white/10 transition-colors"
                          >
                            <div className="flex items-center space-x-3">
                              {getColumnIcon(column)}
                              <div>
                                <p className="text-white text-sm font-medium">
                                  {column.name}
                                </p>
                                <div className="flex items-center space-x-2 text-xs">
                                  <span className={getDataTypeColor(column.dataType)}>
                                    {column.dataType}
                                  </span>
                                  {column.maxLength && (
                                    <span className="text-purple-400">
                                      ({column.maxLength})
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2 text-xs">
                              {column.isNullable === false && (
                                <span className="bg-red-500/20 text-red-300 px-2 py-1 rounded">
                                  NOT NULL
                                </span>
                              )}
                              {column.isPrimary && (
                                <span className="bg-yellow-500/20 text-yellow-300 px-2 py-1 rounded">
                                  PK
                                </span>
                              )}
                              {column.isForeign && (
                                <span className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded">
                                  FK
                                </span>
                              )}
                              {column.isUnique && (
                                <span className="bg-purple-500/20 text-purple-300 px-2 py-1 rounded">
                                  UNIQUE
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-4 text-center text-purple-400 text-sm">
                        No column information available
                      </div>
                    )}

                    {/* Sample Data Preview */}
                    {table.sampleData && table.sampleData.length > 0 && (
                      <div className="border-t border-purple-500/20 p-2">
                        <p className="text-purple-300 text-xs mb-2">Sample Data:</p>
                        <div className="bg-black/20 rounded p-2 text-xs text-purple-200 font-mono overflow-x-auto">
                          <pre>{JSON.stringify(table.sampleData[0], null, 2)}</pre>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Schema Statistics */}
      <div className="grid grid-cols-2 gap-4 text-xs">
        <div className="bg-white/5 rounded-lg p-3">
          <div className="flex items-center space-x-2 text-purple-300">
            <Database className="w-4 h-4" />
            <span>Database Info</span>
          </div>
          <div className="mt-2 space-y-1 text-purple-200">
            <p>Engine: {schema.engine || 'Unknown'}</p>
            <p>Version: {schema.version || 'Unknown'}</p>
            <p>Charset: {schema.charset || 'Unknown'}</p>
          </div>
        </div>
        
        <div className="bg-white/5 rounded-lg p-3">
          <div className="flex items-center space-x-2 text-purple-300">
            <Type className="w-4 h-4" />
            <span>Schema Stats</span>
          </div>
          <div className="mt-2 space-y-1 text-purple-200">
            <p>Tables: {schema.tables.length}</p>
            <p>Total Columns: {schema.tables.reduce((acc, table) => acc + (table.columns?.length || 0), 0)}</p>
            <p>Relationships: {schema.relationships?.length || 0}</p>
          </div>
        </div>
      </div>
    </div>
  );
}