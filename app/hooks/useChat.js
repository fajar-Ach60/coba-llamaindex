import { useState, useRef, useEffect, useCallback } from 'react';

export function useChat() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const messageIdCounter = useRef(0);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Generate consistent ID
  const generateMessageId = useCallback(() => {
    messageIdCounter.current += 1;
    return `msg-${messageIdCounter.current}`;
  }, []);

  // Get timestamp only on client side
  const getTimestamp = useCallback(() => {
    if (typeof window !== 'undefined') {
      return new Date().toLocaleTimeString();
    }
    return '';
  }, []);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: generateMessageId(),
      type: 'user',
      content: inputMessage,
      timestamp: getTimestamp()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputMessage;
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: currentInput })
      });

      const data = await response.json();
      
      const aiMessage = {
        id: generateMessageId(),
        type: 'ai',
        content: data.answer || 'Sorry, I could not process your request.',
        timestamp: getTimestamp(),
        sources: data.sources || []
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage = {
        id: generateMessageId(),
        type: 'error',
        content: 'Sorry, there was an error processing your request.',
        timestamp: getTimestamp()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    messages,
    inputMessage,
    setInputMessage,
    isLoading,
    sendMessage,
    messagesEndRef
  };
}