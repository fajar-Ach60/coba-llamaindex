// components/database/DatabasePanel.js
import { Database } from 'lucide-react';
import ConnectionForm from './ConnectionForm';
import SchemaViewer from './SchemaViewer';
import QueryExamples from './QueryExamples';

export default function DatabasePanel({ 
  connectionStatus,
  connectionConfig,
  schema,
  isConnecting,
  onConnect,
  onDisconnect,
  onTestConnection,
  setActiveTab
}) {
  return (
    <div className="bg-black/20 backdrop-blur-md rounded-xl border border-purple-500/20 p-6">
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
        <Database className="w-6 h-6 mr-3" />
        Database Integration
      </h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Connection Settings */}
        <div className="space-y-6">
          <ConnectionForm
            connectionConfig={connectionConfig}
            connectionStatus={connectionStatus}
            isConnecting={isConnecting}
            onConnect={onConnect}
            onDisconnect={onDisconnect}
            onTestConnection={onTestConnection}
          />
        </div>

        {/* Schema Viewer */}
        <div className="space-y-6">
          <SchemaViewer
            schema={schema}
            connectionStatus={connectionStatus}
          />
        </div>
      </div>

      {/* Query Examples */}
      <div className="mt-8">
        <QueryExamples 
          connectionStatus={connectionStatus}
          onQuerySelect={(query) => {
            setActiveTab('chat');
            // This would be handled by the parent component
          }}
        />
      </div>

      {/* Connection Statistics */}
      {connectionStatus === 'connected' && schema && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-300 text-sm">Tables</p>
                <p className="text-green-100 text-2xl font-bold">
                  {schema?.tables?.length || 0}
                </p>
              </div>
              <Database className="w-8 h-8 text-green-400" />
            </div>
          </div>
          
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-300 text-sm">Total Columns</p>
                <p className="text-blue-100 text-2xl font-bold">
                  {schema?.tables?.reduce((acc, table) => acc + (table.columns?.length || 0), 0) || 0}
                </p>
              </div>
              <div className="text-2xl">📊</div>
            </div>
          </div>
          
          <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-300 text-sm">Relationships</p>
                <p className="text-purple-100 text-2xl font-bold">
                  {schema?.relationships?.length || 0}
                </p>
              </div>
              <div className="text-2xl">🔗</div>
            </div>
          </div>
          
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-300 text-sm">Indexes</p>
                <p className="text-yellow-100 text-2xl font-bold">
                  {schema?.indexes?.length || 0}
                </p>
              </div>
              <div className="text-2xl">⚡</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}