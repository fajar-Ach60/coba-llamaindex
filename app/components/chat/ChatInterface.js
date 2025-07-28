import MessageBubble from './MessageBubble';
import ChatInput from './ChatInput';
import QuickActions from './QuickActions';
import FileUpload from '../documents/FileUpload';
import { Brain } from 'lucide-react';

export default function ChatInterface({ 
  messages, 
  isLoading, 
  sendMessage, 
  setInputMessage, 
  inputMessage,
  documentsState 
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Chat Area */}
      <div className="lg:col-span-3">
        <div className="bg-black/20 backdrop-blur-md rounded-xl border border-purple-500/20 h-96 flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.length === 0 ? (
              <div className="text-center text-purple-300 py-12">
                <Brain className="w-12 h-12 mx-auto mb-4 text-purple-400" />
                <p className="text-lg mb-2">Welcome to LlamaIndex AI</p>
                <p className="text-sm">Upload documents and start asking questions!</p>
              </div>
            ) : (
              messages.map(message => (
                <MessageBubble key={message.id} message={message} />
              ))
            )}
            {isLoading && <MessageBubble message={{ type: 'loading' }} />}
          </div>

          <ChatInput 
            inputMessage={inputMessage}
            setInputMessage={setInputMessage}
            onSendMessage={sendMessage}
            isLoading={isLoading}
          />
        </div>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        <FileUpload {...documentsState} />
        <QuickActions setInputMessage={setInputMessage} />
      </div>
    </div>
  );
}