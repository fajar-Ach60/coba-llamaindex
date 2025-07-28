// components/database/ConnectionForm.js
import { useState } from 'react';
import { Database, Check, AlertCircle, Loader2, Eye, EyeOff } from 'lucide-react';

const DATABASE_TYPES = [
  { value: 'mysql', label: 'MySQL', port: '3306' },
  { value: 'postgresql', label: 'PostgreSQL', port: '5432' },
  { value: 'sqlite', label: 'SQLite', port: '' },
  { value: 'mssql', label: 'SQL Server', port: '1433' },
  { value: 'oracle', label: 'Oracle', port: '1521' }
];

export default function ConnectionForm({
  connectionConfig = {},
  connectionStatus = 'disconnected',
  isConnecting = false,
  onConnect,
  onDisconnect,
  onTestConnection
}) {
  const [config, setConfig] = useState({
    type: 'mysql',
    host: 'localhost',
    port: '3306',
    database: '',
    username: '',
    password: '',
    ssl: false,
    ...connectionConfig
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [testResult, setTestResult] = useState(null);

  const handleInputChange = (field, value) => {
    setConfig(prev => {
      const newConfig = { ...prev, [field]: value };
      
      // Auto-update port when database type changes
      if (field === 'type') {
        const dbType = DATABASE_TYPES.find(db => db.value === value);
        if (dbType && dbType.port) {
          newConfig.port = dbType.port;
        }
      }
      
      return newConfig;
    });
  };

  const handleConnect = async () => {
    try {
      await onConnect(config);
    } catch (error) {
      console.error('Connection failed:', error);
    }
  };

  const handleTestConnection = async () => {
    setTestResult({ status: 'testing' });
    try {
      const result = await onTestConnection(config);
      setTestResult({ 
        status: 'success', 
        message: 'Connection successful!' 
      });
    } catch (error) {
      setTestResult({ 
        status: 'error', 
        message: error.message || 'Connection failed' 
      });
    }
  };

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return 'text-green-400';
      case 'connecting': return 'text-yellow-400';
      case 'error': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = () => {
    switch (connectionStatus) {
      case 'connected': return <Check className="w-4 h-4" />;
      case 'connecting': return <Loader2 className="w-4 h-4 animate-spin" />;
      case 'error': return <AlertCircle className="w-4 h-4" />;
      default: return <Database className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Database Connection</h3>
        <div className={`flex items-center space-x-2 ${getStatusColor()}`}>
          {getStatusIcon()}
          <span className="text-sm capitalize">{connectionStatus}</span>
        </div>
      </div>

      <div className="space-y-4">
        {/* Database Type */}
        <div>
          <label className="block text-sm font-medium text-purple-300 mb-2">
            Database Type
          </label>
          <select 
            value={config.type}
            onChange={(e) => handleInputChange('type', e.target.value)}
            className="w-full bg-white/10 text-white border border-purple-500/30 rounded-lg px-3 py-2 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20"
            disabled={connectionStatus === 'connected'}
          >
            {DATABASE_TYPES.map(db => (
              <option key={db.value} value={db.value} className="bg-gray-800">
                {db.label}
              </option>
            ))}
          </select>
        </div>

        {/* Host and Port */}
        {config.type !== 'sqlite' && (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-purple-300 mb-2">
                Host
              </label>
              <input
                type="text"
                value={config.host}
                onChange={(e) => handleInputChange('host', e.target.value)}
                placeholder="localhost"
                className="w-full bg-white/10 text-white placeholder-purple-400 border border-purple-500/30 rounded-lg px-3 py-2 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20"
                disabled={connectionStatus === 'connected'}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-purple-300 mb-2">
                Port
              </label>
              <input
                type="text"
                value={config.port}
                onChange={(e) => handleInputChange('port', e.target.value)}
                placeholder="3306"
                className="w-full bg-white/10 text-white placeholder-purple-400 border border-purple-500/30 rounded-lg px-3 py-2 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20"
                disabled={connectionStatus === 'connected'}
              />
            </div>
          </div>
        )}

        {/* Database Name */}
        <div>
          <label className="block text-sm font-medium text-purple-300 mb-2">
            {config.type === 'sqlite' ? 'Database File Path' : 'Database Name'}
          </label>
          <input
            type="text"
            value={config.database}
            onChange={(e) => handleInputChange('database', e.target.value)}
            placeholder={config.type === 'sqlite' ? '/path/to/database.db' : 'database_name'}
            className="w-full bg-white/10 text-white placeholder-purple-400 border border-purple-500/30 rounded-lg px-3 py-2 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20"
            disabled={connectionStatus === 'connected'}
          />
        </div>

        {/* Username and Password */}
        {config.type !== 'sqlite' && (
          <>
            <div>
              <label className="block text-sm font-medium text-purple-300 mb-2">
                Username
              </label>
              <input
                type="text"
                value={config.username}
                onChange={(e) => handleInputChange('username', e.target.value)}
                placeholder="username"
                className="w-full bg-white/10 text-white placeholder-purple-400 border border-purple-500/30 rounded-lg px-3 py-2 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20"
                disabled={connectionStatus === 'connected'}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-purple-300 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={config.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="password"
                  className="w-full bg-white/10 text-white placeholder-purple-400 border border-purple-500/30 rounded-lg px-3 py-2 pr-10 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20"
                  disabled={connectionStatus === 'connected'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-purple-400 hover:text-purple-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </>
        )}

        {/* SSL Option */}
        {config.type !== 'sqlite' && (
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="ssl"
              checked={config.ssl}
              onChange={(e) => handleInputChange('ssl', e.target.checked)}
              className="rounded border-purple-500/30 bg-white/10 text-purple-500 focus:ring-purple-400/20"
              disabled={connectionStatus === 'connected'}
            />
            <label htmlFor="ssl" className="text-sm text-purple-300">
              Use SSL Connection
            </label>
          </div>
        )}

        {/* Test Result */}
        {testResult && (
          <div className={`p-3 rounded-lg ${
            testResult.status === 'success' ? 'bg-green-500/10 border border-green-500/30' :
            testResult.status === 'error' ? 'bg-red-500/10 border border-red-500/30' :
            'bg-yellow-500/10 border border-yellow-500/30'
          }`}>
            <div className="flex items-center space-x-2">
              {testResult.status === 'testing' ? (
                <Loader2 className="w-4 h-4 animate-spin text-yellow-400" />
              ) : testResult.status === 'success' ? (
                <Check className="w-4 h-4 text-green-400" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-400" />
              )}
              <span className={`text-sm ${
                testResult.status === 'success' ? 'text-green-300' :
                testResult.status === 'error' ? 'text-red-300' :
                'text-yellow-300'
              }`}>
                {testResult.message}
              </span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-3">
          {connectionStatus === 'connected' ? (
            <button
              onClick={onDisconnect}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
              <Database className="w-4 h-4" />
              <span>Disconnect</span>
            </button>
          ) : (
            <>
              <button
                onClick={handleTestConnection}
                disabled={isConnecting || !config.database}
                className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {testResult?.status === 'testing' ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Check className="w-4 h-4" />
                )}
                <span>Test Connection</span>
              </button>
              <button
                onClick={handleConnect}
                disabled={isConnecting || !config.database}
                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isConnecting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Database className="w-4 h-4" />
                )}
                <span>{isConnecting ? 'Connecting...' : 'Connect'}</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}