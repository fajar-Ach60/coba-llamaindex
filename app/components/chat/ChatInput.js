import { Send } from 'lucide-react';

export default function ChatInput({ 
  inputMessage, 
  setInputMessage, 
  onSendMessage, 
  isLoading 
}) {
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
  };

  return (
    <div className="p-6 border-t border-purple-500/20">
      <div className="flex space-x-3">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask anything about your documents..."
          className="flex-1 bg-white/10 text-white placeholder-purple-300 border border-purple-500/30 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20"
          disabled={isLoading}
        />
        <button
          onClick={onSendMessage}
          disabled={!inputMessage.trim() || isLoading}
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-2 rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}