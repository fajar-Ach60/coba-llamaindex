// components/documents/DocumentCard.js
import { FileText, CheckCircle, AlertCircle, Trash2, Download, Eye } from 'lucide-react';
import { useState } from 'react';

export default function DocumentCard({ document, onDelete }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete "${document.name}"?`)) {
      setIsDeleting(true);
      try {
        await onDelete(document.id);
      } catch (error) {
        console.error('Error deleting document:', error);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const getFileIcon = (type) => {
    if (type.includes('pdf')) return '📄';
    if (type.includes('word') || type.includes('docx')) return '📝';
    if (type.includes('text')) return '📋';
    return '📄';
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'indexed': return 'text-green-400';
      case 'processing': return 'text-yellow-400';
      case 'error': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'indexed': return <CheckCircle className="w-4 h-4" />;
      case 'processing': return <div className="w-4 h-4 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />;
      case 'error': return <AlertCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className="bg-white/10 rounded-lg p-4 border border-purple-500/30 hover:border-purple-400/50 transition-all group">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          <span className="text-2xl">{getFileIcon(document.type)}</span>
          <FileText className="w-6 h-6 text-purple-400" />
        </div>
        <div className="flex items-center space-x-2">
          <div className={`flex items-center space-x-1 ${getStatusColor(document.status)}`}>
            {getStatusIcon(document.status)}
            <span className="text-xs capitalize">{document.status}</span>
          </div>
        </div>
      </div>

      {/* Document Info */}
      <div className="mb-4">
        <h3 className="text-white font-medium mb-2 truncate" title={document.name}>
          {document.name}
        </h3>
        <div className="text-sm text-purple-300 space-y-1">
          <p>Size: {formatFileSize(document.size)}</p>
          <p>Type: {document.type.split('/')[1]?.toUpperCase() || 'Unknown'}</p>
          {document.uploadedAt && (
            <p>Added: {new Date(document.uploadedAt).toLocaleDateString()}</p>
          )}
        </div>
      </div>

      {/* Metadata */}
      {document.metadata && (
        <div className="mb-4">
          <div className="text-xs text-purple-400 space-y-1">
            {document.metadata.pages && (
              <p>Pages: {document.metadata.pages}</p>
            )}
            {document.metadata.wordCount && (
              <p>Words: {document.metadata.wordCount.toLocaleString()}</p>
            )}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-3 border-t border-purple-500/20">
        <div className="flex items-center space-x-2">
          <button
            className="p-2 text-purple-400 hover:text-white hover:bg-white/10 rounded-md transition-colors"
            title="Preview"
            onClick={() => {/* TODO: Implement preview */}}
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            className="p-2 text-purple-400 hover:text-white hover:bg-white/10 rounded-md transition-colors"
            title="Download"
            onClick={() => {/* TODO: Implement download */}}
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
        
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-md transition-colors disabled:opacity-50"
          title="Delete"
        >
          {isDeleting ? (
            <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
          ) : (
            <Trash2 className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Progress Bar for Processing */}
      {document.status === 'processing' && (
        <div className="mt-3">
          <div className="w-full bg-gray-600 rounded-full h-1">
            <div className="bg-yellow-400 h-1 rounded-full animate-pulse" style={{width: '60%'}}></div>
          </div>
        </div>
      )}
    </div>
  );
}