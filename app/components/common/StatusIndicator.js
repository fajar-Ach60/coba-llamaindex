import { useState, useEffect } from 'react';
import { Wifi, WifiOff, Database, FileText, Loader2 } from 'lucide-react';

export default function StatusIndicator({ 
  documentsCount = 0, 
  databaseStatus = 'disconnected',
  indexStatus = 'Not initialized' 
}) {
  const [systemStatus, setSystemStatus] = useState('online');
  const [isClient, setIsClient] = useState(false);
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    setIsClient(true);
    setCurrentTime(new Date().toLocaleTimeString());
    
    // Update time every minute
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 60000);

    // Check system connectivity
    const checkStatus = () => {
      setSystemStatus(navigator.onLine ? 'online' : 'offline');
    };

    window.addEventListener('online', checkStatus);
    window.addEventListener('offline', checkStatus);
    checkStatus();

    return () => {
      clearInterval(timeInterval);
      window.removeEventListener('online', checkStatus);
      window.removeEventListener('offline', checkStatus);
    };
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'connected':
      case 'online':
      case 'ready':
        return 'bg-green-400';
      case 'connecting':
      case 'processing':
        return 'bg-yellow-400';
      case 'disconnected':
      case 'offline':
      case 'error':
        return 'bg-red-400';
      default:
        return 'bg-gray-400';
    }
  };

  const getMainStatus = () => {
    if (!isClient) return 'Loading...';
    if (systemStatus === 'offline') return 'System Offline';
    if (databaseStatus === 'connected' && documentsCount > 0) return 'Ready';
    if (databaseStatus === 'connected') return 'Database Connected';
    if (documentsCount > 0) return 'Documents Indexed';
    return 'Not Ready';
  };

  const getMainStatusColor = () => {
    if (!isClient) return 'bg-gray-400';
    if (systemStatus === 'offline') return 'bg-red-400';
    if (databaseStatus === 'connected' && documentsCount > 0) return 'bg-green-400';
    if (databaseStatus === 'connected' || documentsCount > 0) return 'bg-yellow-400';
    return 'bg-gray-400';
  };

  return (
    <div className="flex items-center space-x-4">
      {/* Main Status */}
      <div className="flex items-center space-x-2 text-sm">
        <div className={`w-2 h-2 rounded-full ${getMainStatusColor()}`}>
          {(databaseStatus === 'connecting' || indexStatus.includes('Indexing')) && (
            <div className="w-2 h-2 rounded-full bg-current animate-pulse"></div>
          )}
        </div>
        <span className="text-purple-300">{getMainStatus()}</span>
      </div>

      {/* Detailed Status Dropdown */}
      <div className="relative group">
        <button className="text-purple-400 hover:text-purple-300 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Dropdown Menu */}
        <div className="absolute right-0 top-full mt-2 w-72 bg-black/90 backdrop-blur-md border border-purple-500/30 rounded-lg p-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
          <h4 className="text-white font-medium mb-3">System Status</h4>
          
          <div className="space-y-3">
            {/* Network Status */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {isClient && systemStatus === 'online' ? (
                  <Wifi className="w-4 h-4 text-green-400" />
                ) : (
                  <WifiOff className="w-4 h-4 text-red-400" />
                )}
                <span className="text-purple-300 text-sm">Network</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${getStatusColor(systemStatus)}`}></div>
                <span className="text-purple-200 text-xs capitalize">{systemStatus}</span>
              </div>
            </div>

            {/* Database Status */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Database className="w-4 h-4 text-purple-400" />
                <span className="text-purple-300 text-sm">Database</span>
              </div>
              <div className="flex items-center space-x-2">
                {databaseStatus === 'connecting' ? (
                  <Loader2 className="w-3 h-3 text-yellow-400 animate-spin" />
                ) : (
                  <div className={`w-2 h-2 rounded-full ${getStatusColor(databaseStatus)}`}></div>
                )}
                <span className="text-purple-200 text-xs capitalize">{databaseStatus}</span>
              </div>
            </div>

            {/* Documents Status */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-purple-400" />
                <span className="text-purple-300 text-sm">Documents</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${documentsCount > 0 ? 'bg-green-400' : 'bg-gray-400'}`}></div>
                <span className="text-purple-200 text-xs">
                  {documentsCount} indexed
                </span>
              </div>
            </div>

            {/* Index Status */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
                <span className="text-purple-300 text-sm">Index</span>
              </div>
              <div className="flex items-center space-x-2">
                {indexStatus.includes('Indexing') ? (
                  <Loader2 className="w-3 h-3 text-yellow-400 animate-spin" />
                ) : (
                  <div className={`w-2 h-2 rounded-full ${
                    indexStatus.includes('Not') ? 'bg-gray-400' : 
                    indexStatus.includes('Error') ? 'bg-red-400' : 'bg-green-400'
                  }`}></div>
                )}
                <span className="text-purple-200 text-xs">
                  {indexStatus.includes('documents') ? 
                    indexStatus.match(/\d+/)?.[0] || '0' : 
                    indexStatus.includes('Not') ? 'Empty' : 'Ready'
                  }
                </span>
              </div>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="mt-4 pt-3 border-t border-purple-500/20">
            <h5 className="text-purple-300 text-xs font-medium mb-2">Performance</h5>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-white/5 rounded p-2">
                <p className="text-purple-400">Response Time</p>
                <p className="text-purple-200">~1.2s avg</p>
              </div>
              <div className="bg-white/5 rounded p-2">
                <p className="text-purple-400">Memory Usage</p>
                <p className="text-purple-200">45MB</p>
              </div>
            </div>
          </div>

          {/* Last Updated */}
          <div className="mt-3 pt-2 border-t border-purple-500/20">
            <p className="text-purple-400 text-xs">
              Last updated: {isClient ? currentTime : 'Loading...'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}