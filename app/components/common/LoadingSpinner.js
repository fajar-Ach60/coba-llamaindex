// components/common/LoadingSpinner.js
import { Loader2, Brain, Database, FileText } from 'lucide-react';

export default function LoadingSpinner({ 
  size = 'md', 
  type = 'default', 
  message = 'Loading...', 
  overlay = false,
  progress = null 
}) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };

  const getIcon = () => {
    switch (type) {
      case 'ai':
        return <Brain className={`${sizeClasses[size]} animate-pulse text-purple-400`} />;
      case 'database':
        return <Database className={`${sizeClasses[size]} animate-pulse text-blue-400`} />;
      case 'document':
        return <FileText className={`${sizeClasses[size]} animate-pulse text-green-400`} />;
      default:
        return <Loader2 className={`${sizeClasses[size]} animate-spin text-purple-400`} />;
    }
  };

  const spinner = (
    <div className="flex flex-col items-center space-y-3">
      {getIcon()}
      {message && (
        <p className="text-purple-300 text-sm font-medium">{message}</p>
      )}
      {progress !== null && (
        <div className="w-48 bg-purple-900/30 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
          ></div>
        </div>
      )}
    </div>
  );

  if (overlay) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-black/80 backdrop-blur-md border border-purple-500/30 rounded-xl p-8">
          {spinner}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-8">
      {spinner}
    </div>
  );
}

// Specialized loading components
export const ChatLoadingSpinner = ({ message = "AI is thinking..." }) => (
  <LoadingSpinner type="ai" message={message} />
);

export const DatabaseLoadingSpinner = ({ message = "Connecting to database..." }) => (
  <LoadingSpinner type="database" message={message} />
);

export const DocumentLoadingSpinner = ({ message = "Processing documents...", progress }) => (
  <LoadingSpinner type="document" message={message} progress={progress} />
);

export const OverlayLoader = ({ message = "Please wait...", progress }) => (
  <LoadingSpinner overlay={true} message={message} progress={progress} />
);