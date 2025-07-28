import { Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function MessageBubble({ message }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (message.type === 'loading') {
    return (
      <div className="flex justify-start">
        <div className="bg-white/10 text-purple-100 border border-purple-500/30 px-4 py-2 rounded-lg flex items-center space-x-2">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-sm">Thinking...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
          message.type === 'user'
            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
            : message.type === 'error'
            ? 'bg-red-500/20 text-red-300 border border-red-500/30'
            : 'bg-white/10 text-purple-100 border border-purple-500/30'
        }`}
      >
        <p className="text-sm">{message.content}</p>
        {/* Only show timestamp on client side to avoid hydration mismatch */}
        {isClient && message.timestamp && (
          <p className="text-xs opacity-70 mt-1">{message.timestamp}</p>
        )}
      </div>
    </div>
  );
}