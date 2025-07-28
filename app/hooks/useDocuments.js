import { useState } from 'react';

export function useDocuments() {
  const [documents, setDocuments] = useState([]);
  const [isIndexing, setIsIndexing] = useState(false);
  const [indexStatus, setIndexStatus] = useState('Not initialized');

  const uploadDocuments = async (files) => {
    setIsIndexing(true);
    setIndexStatus('Indexing documents...');

    try {
      const formData = new FormData();
      Array.from(files).forEach(file => {
        formData.append('files', file);
      });

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      
      if (data.success) {
        setDocuments(prev => [...prev, ...data.documents]);
        setIndexStatus(`Indexed ${documents.length + data.documents.length} documents`);
      }
    } catch (error) {
      console.error('Upload error:', error);
      setIndexStatus('Error indexing documents');
    } finally {
      setIsIndexing(false);
    }
  };

  return {
    documents,
    isIndexing,
    indexStatus,
    uploadDocuments
  };
}