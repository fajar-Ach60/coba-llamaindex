import { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import TabNavigation from '../components/common/TabNavigation';
import ChatInterface from '../components/chat/ChatInterface';
import DocumentLibrary from '../components/documents/DocumentLibrary';
import DatabasePanel from '../components/database/DatabasePanel';
import { useChat } from '../hooks/useChat';
import { useDocuments } from '../hooks/useDocuments';
import { useDatabase } from '../hooks/useDatabase';

export default function Home() {
  const [activeTab, setActiveTab] = useState('chat');
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);
  const chatState = useChat();
  const documentsState = useDocuments();
  const databaseState = useDatabase();

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'chat':
        return <ChatInterface {...chatState} documentsState={documentsState} />;
      case 'documents':
        return <DocumentLibrary {...documentsState} />;
      case 'database':
        return <DatabasePanel {...databaseState} />;
      default:
        return <ChatInterface {...chatState} documentsState={documentsState} />;
    }
  };
if (!isMounted) {
    return null; // or a loading state
  }
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <TabNavigation 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
        />
        {renderActiveTab()}
      </div>
    </Layout>
  );
}