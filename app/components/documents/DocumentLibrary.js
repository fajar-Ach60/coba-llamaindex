// components/documents/DocumentLibrary.js
import { FileText, Upload, CheckCircle, AlertCircle, Trash2 } from 'lucide-react';
import DocumentCard from './DocumentCard';
import FileUpload from './FileUpload';

export default function DocumentLibrary({ 
  documents, 
  isIndexing, 
  indexStatus, 
  uploadDocuments,
  deleteDocument 
}) {
  return (
    <div className="bg-black/20 backdrop-blur-md rounded-xl border border-purple-500/20 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center">
          <FileText className="w-6 h-6 mr-3" />
          Document Library
        </h2>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${
              indexStatus.includes('Error') ? 'bg-red-400' : 
              indexStatus.includes('Not') ? 'bg-gray-400' : 'bg-green-400'
            }`}></div>
            <span className="text-purple-300 text-sm">{indexStatus}</span>
          </div>
          <span className="text-purple-300 text-sm">
            {documents.length} documents indexed
          </span>
        </div>
      </div>

      {/* Upload Area */}
      <div className="mb-6">
        <FileUpload 
          onUpload={uploadDocuments}
          isLoading={isIndexing}
          compact={true}
        />
      </div>

      {/* Documents Grid */}
      {documents.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="w-16 h-16 mx-auto text-purple-400 mb-4" />
          <p className="text-purple-300 text-lg mb-2">No documents uploaded yet</p>
          <p className="text-purple-400 text-sm">Upload your first document to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {documents.map(doc => (
            <DocumentCard 
              key={doc.id} 
              document={doc} 
              onDelete={deleteDocument}
            />
          ))}
        </div>
      )}

      {/* Processing Indicator */}
      {isIndexing && (
        <div className="mt-6 bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-400"></div>
            <span className="text-blue-300">Processing documents...</span>
          </div>
        </div>
      )}
    </div>
  );
}