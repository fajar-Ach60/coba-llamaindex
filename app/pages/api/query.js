// pages/api/query.js
import { VectorStoreIndex, Document, OpenAI } from 'llamaindex';

// Global variable to store index (in production, use Redis or database)
let globalIndex = null;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({ error: 'Question is required' });
    }

    // Initialize or use existing index
    if (!globalIndex) {
      // Load from storage or create empty index
      const documents = [
        new Document({ text: "Default knowledge base content" })
      ];
      globalIndex = await VectorStoreIndex.fromDocuments(documents);
    }

    // Query the index
    const queryEngine = globalIndex.asQueryEngine();
    const response = await queryEngine.query(question);

    res.json({
      success: true,
      answer: response.toString(),
      sources: response.sourceNodes?.map(node => ({
        content: node.node.text.substring(0, 200) + '...',
        metadata: node.node.metadata
      })) || []
    });

  } catch (error) {
    console.error('Query error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Internal server error'
    });
  }
}