// components/documents/FileUpload.js
import { Upload, Loader2, X, FileText } from 'lucide-react';
import { useState, useCallback } from 'react';

export default function FileUpload({ 
  onUpload, 
  isLoading = false, 
  compact = false,
  maxFiles = 10,
  maxFileSize = 10 * 1024 * 1024, // 10MB
  acceptedTypes = ['.pdf', '.docx', '.txt', '.doc']
}) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  }, []);

  const handleFileInput = (e) => {
    const files = Array.from(e.target.files);
    handleFiles(files);
  };

  const handleFiles = (files) => {
    // Filter and validate files
    const validFiles = files.filter(file => {
      // Check file type
      const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
      if (!acceptedTypes.includes(fileExtension)) {
        alert(`File type ${fileExtension} is not supported. Supported types: ${acceptedTypes.join(', ')}`);
        return false;
      }

      // Check file size
      if (file.size > maxFileSize) {
        alert(`File ${file.name} is too large. Maximum size is ${maxFileSize / (1024 * 1024)}MB`);
        return false;
      }

      return true;
    });

    // Check max files limit
    if (selectedFiles.length + validFiles.length > maxFiles) {
      alert(`Cannot upload more than ${maxFiles} files at once`);
      return;
    }

    const newFiles = validFiles.map(file => ({
      file,
      id: Date.now() + Math.random(),
      name: file.name,
      size: file.size,
      type: file.type,
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null
    }));

    setSelectedFiles(prev => [...prev, ...newFiles]);
  };

  const removeFile = (fileId) => {
    setSelectedFiles(prev => {
      const fileToRemove = prev.find(f => f.id === fileId);
      if (fileToRemove && fileToRemove.preview) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      return prev.filter(f => f.id !== fileId);
    });
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;
    
    const files = selectedFiles.map(f => f.file);
    await onUpload(files);
    setSelectedFiles([]);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (compact) {
    return (
      <div className="bg-black/20 backdrop-blur-md rounded-xl border border-purple-500/20 p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-white flex items-center">
            <Upload className="w-5 h-5 mr-2" />
            Upload Documents
          </h3>
          {selectedFiles.length > 0 && (
            <span className="text-sm text-purple-300">
              {selectedFiles.length} file{selectedFiles.length > 1 ? 's' : ''} selected
            </span>
          )}
        </div>
        
        <div
          className={`relative border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
            dragActive 
              ? 'border-purple-400 bg-purple-500/10' 
              : 'border-purple-500/30 bg-purple-500/5 hover:bg-purple-500/10'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            multiple
            accept={acceptedTypes.join(',')}
            onChange={handleFileInput}
            disabled={isLoading}
          />
          <div className="flex flex-col items-center justify-center py-6">
            <Upload className="w-8 h-8 mb-2 text-purple-400" />
            <p className="text-sm text-purple-300">Drop files or click to upload</p>
            <p className="text-xs text-purple-400 mt-1">
              {acceptedTypes.join(', ')} • Max {maxFileSize / (1024 * 1024)}MB
            </p>
          </div>
        </div>

        {selectedFiles.length > 0 && (
          <div className="mt-4 space-y-2 max-h-32 overflow-y-auto">
            {selectedFiles.map(file => (
              <div key={file.id} className="flex items-center justify-between bg-white/5 rounded-lg p-2">
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-purple-400" />
                  <div>
                    <p className="text-sm text-white truncate max-w-40">{file.name}</p>
                    <p className="text-xs text-purple-400">{formatFileSize(file.size)}</p>
                  </div>
                </div>
                <button
                  onClick={() => removeFile(file.id)}
                  className="p-1 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded"
                  disabled={isLoading}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {selectedFiles.length > 0 && (
          <button
            onClick={handleUpload}
            disabled={isLoading}
            className="w-full mt-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                <span>Upload {selectedFiles.length} file{selectedFiles.length > 1 ? 's' : ''}</span>
              </>
            )}
          </button>
        )}
      </div>
    );
  }
  }

  // Full version for sidebar
  return (
    <div className="bg-black/20 backdrop-blur-md rounded-xl border border-purple-500/20 p-6">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
        <Upload className="w-5 h-5 mr-2" />
        Upload Documents
      </h3>
      
      <div className="space-y-4">
        {/* Drop Zone */}
        <div
          className={`relative border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
            dragActive 
              ? 'border-purple-400 bg-purple-500/10' 
              : 'border-purple-500/30 bg-purple-500/5 hover:bg-purple-500/10'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            multiple
            accept={acceptedTypes.join(',')}
            onChange={handleFileInput}
            disabled={isLoading}
          />
          <div className="flex flex-col items-center justify-center py-8">
            <Upload className="w-12 h-12 mb-4 text-purple-400" />
            <p className="text-sm text-purple-300 mb-2">
              {dragActive ? 'Drop files here' : 'Drop files or click to upload'}
            </p>
            <p className="text-xs text-purple-400">
              Supported: {acceptedTypes.join(', ')}
            </p>
            <p className="text-xs text-purple-400">
              Max file size: {maxFileSize / (1024 * 1024)}MB
            </p>
          </div>
        </div>

        {/* Selected Files */}
        {selectedFiles.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-white">
              Selected Files ({selectedFiles.length})
            </h4>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {selectedFiles.map(file => (
                <div key={file.id} className="flex items-center justify-between bg-white/5 rounded-lg p-3">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-5 h-5 text-purple-400" />
                    <div>
                      <p className="text-sm text-white truncate max-w-32">{file.name}</p>
                      <p className="text-xs text-purple-400">{formatFileSize(file.size)}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFile(file.id)}
                    className="p-1 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded"
                    disabled={isLoading}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upload Button */}
        {selectedFiles.length > 0 && (
          <button
            onClick={handleUpload}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Processing documents...</span>
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                <span>Upload {selectedFiles.length} file{selectedFiles.length > 1 ? 's' : ''}</span>
              </>
            )}
          </button>
        )}

        {/* Processing Status */}
        {isLoading && (
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
              <span className="text-blue-300 text-sm">Processing documents...</span>
            </div>
            <div className="mt-2 w-full bg-blue-900/30 rounded-full h-1">
              <div className="bg-blue-400 h-1 rounded-full animate-pulse" style={{width: '60%'}}></div>
            </div>
          </div>
        )}

        {/* Upload Tips */}
        <div className="text-xs text-purple-400 space-y-1">
          <p>💡 Tips:</p>
          <p>• Drag and drop multiple files at once</p>
          <p>• Supported formats: PDF, DOCX, TXT, DOC</p>
          <p>• Files are automatically indexed for search</p>
          <p>• Maximum {maxFiles} files per upload</p>
        </div>
      </div>
    </div>
  );