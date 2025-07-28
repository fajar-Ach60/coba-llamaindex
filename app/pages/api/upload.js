// pages/api/upload.js
import { IncomingForm } from 'formidable';
import { VectorStoreIndex, Document, PDFReader, DocxReader } from 'llamaindex';
import fs from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: false, // Disable body parsing for file uploads
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const form = new IncomingForm({
      uploadDir: './uploads',
      keepExtensions: true,
      maxFileSize: 10 * 1024 * 1024, // 10MB
    });

    // Ensure upload directory exists
    if (!fs.existsSync('./uploads')) {
      fs.mkdirSync('./uploads', { recursive: true });
    }

    const [fields, files] = await form.parse(req);
    const uploadedFiles = Array.isArray(files.files) ? files.files : [files.files];
    
    const processedDocuments = [];
    const documentInfo = [];

    for (const file of uploadedFiles) {
      if (!file) continue;

      try {
        let documents = [];
        const fileExtension = path.extname(file.originalFilename).toLowerCase();

        // Process different file types
        switch (fileExtension) {
          case '.pdf':
            const pdfReader = new PDFReader();
            documents = await pdfReader.loadData(file.filepath);
            break;
          
          case '.docx':
          case '.doc':
            const docxReader = new DocxReader();
            documents = await docxReader.loadData(file.filepath);
            break;
          
          case '.txt':
            const content = fs.readFileSync(file.filepath, 'utf8');
            documents = [new Document({ 
              text: content,
              metadata: { 
                filename: file.originalFilename,
                fileType: 'text',
                uploadDate: new Date().toISOString()
              }
            })];
            break;
          
          default:
            throw new Error(`Unsupported file type: ${fileExtension}`);
        }

        // Add to processed documents
        processedDocuments.push(...documents);
        
        // Store document info
        documentInfo.push({
          id: Date.now() + Math.random(),
          name: file.originalFilename,
          size: file.size,
          type: file.mimetype,
          status: 'indexed',
          uploadedAt: new Date().toISOString(),
          metadata: {
            pages: documents.length,
            wordCount: documents.reduce((acc, doc) => acc + doc.text.split(' ').length, 0)
          }
        });

        // Clean up uploaded file
        fs.unlinkSync(file.filepath);

      } catch (fileError) {
        console.error(`Error processing file ${file.originalFilename}:`, fileError);
        
        documentInfo.push({
          id: Date.now() + Math.random(),
          name: file.originalFilename,
          size: file.size,
          type: file.mimetype,
          status: 'error',
          error: fileError.message
        });
      }
    }

    // Create or update global index
    if (processedDocuments.length > 0) {
      // In production, you'd want to:
      // 1. Store documents in a database
      // 2. Update vector index incrementally
      // 3. Use persistent storage for the index
      
      globalIndex = await VectorStoreIndex.fromDocuments(processedDocuments);
    }

    res.json({
      success: true,
      message: `Processed ${processedDocuments.length} documents`,
      documents: documentInfo
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Upload failed'
    });
  }
}