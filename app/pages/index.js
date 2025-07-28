import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Layout from '../components/layout/Layout';

// Lazy load komponen yang menyebabkan hydration mismatch
const TabNavigation = dynamic(() => import('../components/common/TabNavigation'), {
  ssr: false,
  loading: () => (
    <div className="flex space-x-1 bg-black/20 backdrop-blur-md rounded-lg p-1 mb-8">
      <div className="h-10 bg-gray-700 rounded-md animate-pulse flex-1"></div>
      <div className="h-10 bg-gray-700 rounded-md animate-pulse flex-1"></div>
      <div className="h-10 bg-gray-700 rounded-md animate-pulse flex-1"></div>
    </div>
  )
});

const ChatInterface = dynamic(() => import('../components/chat/ChatInterface'), {
  ssr: false,
  loading: () => (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      <div className="lg:col-span-3 bg-black/20 backdrop-blur-md rounded-xl border border-purple-500/20 h-96 animate-pulse"></div>
      <div className="space-y-6">
        <div className="bg-black/20 backdrop-blur-md rounded-xl border border-purple-500/20 h-48 animate-pulse"></div>
        <div className="bg-black/20 backdrop-blur-md rounded-xl border border-purple-500/20 h-32 animate-pulse"></div>
      </div>
    </div>
  )
});

const DocumentLibrary = dynamic(() => import('../components/documents/DocumentLibrary'), {
  ssr: false,
  loading: () => (
    <div className="bg-black/20 backdrop-blur-md rounded-xl border border-purple-500/20 p-6 animate-pulse">
      <div className="h-8 bg-gray-700 rounded mb-6"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white/10 rounded-lg p-4 h-48"></div>
        ))}
      </div>
    </div>
  )
});

const DatabasePanel = dynamic(() => import('../components/database/DatabasePanel'), {
  ssr: false,
  loading: () => (
    <div className="bg-black/20 backdrop-blur-md rounded-xl border border-purple-500/20 p-6 animate-pulse">
      <div className="h-8 bg-gray-700 rounded mb-6"></div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="h-64 bg-white/10 rounded-lg"></div>
        <div className="h-64 bg-white/10 rounded-lg"></div>
      </div>
    </div>
  )
});

import { useChat } from '../hooks/useChat';
import { useDocuments } from '../hooks/useDocuments';
import { useDatabase } from '../hooks/useDatabase';

export default function Home() {
  const [activeTab, setActiveTab] = useState('chat');
  const [isClient, setIsClient] = useState(false);
  
  const chatState = useChat();
  const documentsState = useDocuments();
  const databaseState = useDatabase();

  // Proper client-side mounting check
  useEffect(() => {
    setIsClient(true);
  }, []);

  const renderActiveTab = () => {
    if (!isClient) {
      // Return consistent loading state for all tabs
      return (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3 bg-black/20 backdrop-blur-md rounded-xl border border-purple-500/20 h-96 animate-pulse"></div>
          <div className="space-y-6">
            <div className="bg-black/20 backdrop-blur-md rounded-xl border border-purple-500/20 h-48 animate-pulse"></div>
            <div className="bg-black/20 backdrop-blur-md rounded-xl border border-purple-500/20 h-32 animate-pulse"></div>
          </div>
        </div>
      );
    }

    switch (activeTab) {
      case 'chat':
        return <ChatInterface {...chatState} documentsState={documentsState} />;
      case 'documents':
        return <DocumentLibrary {...documentsState} />;
      case 'database':
        return <DatabasePanel {...databaseState} setActiveTab={setActiveTab} />;
      default:
        return <ChatInterface {...chatState} documentsState={documentsState} />;
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isClient ? (
          <TabNavigation 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
          />
        ) : (
          <div className="flex space-x-1 bg-black/20 backdrop-blur-md rounded-lg p-1 mb-8">
            <div className="h-10 bg-gray-700 rounded-md animate-pulse flex-1"></div>
            <div className="h-10 bg-gray-700 rounded-md animate-pulse flex-1"></div>
            <div className="h-10 bg-gray-700 rounded-md animate-pulse flex-1"></div>
          </div>
        )}
        {renderActiveTab()}
      </div>
    </Layout>
  );
}