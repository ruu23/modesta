import { useState, useEffect, useCallback } from 'react';
import { ChatMessage, Conversation } from '@/types/chat';

const STORAGE_KEY = 'fashion-chat-conversations';

const generateId = () => crypto.randomUUID();

const mockAIResponses = [
  {
    type: 'text' as const,
    content: "I'd love to help you with that! Based on your closet, I have some great suggestions. Let me show you a few options that would work perfectly.",
    quickReplies: ['Show me more', 'Something different', 'Add to favorites'],
  },
  {
    type: 'outfit' as const,
    content: "Here's an outfit I put together for you! It combines elegance with comfort, perfect for your occasion.",
    outfitData: {
      name: 'Elegant Evening Look',
      image: 'https://images.unsplash.com/photo-1590736969955-71cc94801759?w=400&h=500&fit=crop',
      items: [
        { name: 'Silk Hijab', image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=100&h=100&fit=crop' },
        { name: 'Black Abaya', image: 'https://images.unsplash.com/photo-1590736969955-71cc94801759?w=100&h=100&fit=crop' },
        { name: 'Gold Earrings', image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=100&h=100&fit=crop' },
      ],
    },
  },
  {
    type: 'items' as const,
    content: "I found some pieces that would complement your wardrobe beautifully! These are trending right now:",
    itemsData: [
      { name: 'Cream Knit Sweater', image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=200&h=200&fit=crop', price: '$65', link: '#' },
      { name: 'Wide Leg Trousers', image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=200&h=200&fit=crop', price: '$88', link: '#' },
      { name: 'Pearl Earrings', image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=200&h=200&fit=crop', price: '$78', link: '#' },
    ],
  },
  {
    type: 'text' as const,
    content: "Great color harmony! 💚 The navy and beige combination you're thinking about is very sophisticated. For a pop of color, you could add a rose gold accessory or a burgundy hijab. Would you like me to show you some options?",
    quickReplies: ['Show rose gold options', 'Show burgundy hijabs', 'Keep it neutral'],
  },
  {
    type: 'calendar' as const,
    content: "I've prepared your outfit for the interview! Here's what I suggest - shall I add it to your calendar?",
    calendarEvent: {
      title: 'Job Interview - Professional Look',
      date: 'Tomorrow at 9:00 AM',
      outfit: 'Navy Blazer + Cream Blouse + Tailored Trousers',
    },
  },
];

export function useChat() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);

  // Load from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      setConversations(parsed);
      if (parsed.length > 0) {
        setActiveConversationId(parsed[0].id);
      }
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (conversations.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
    }
  }, [conversations]);

  const activeConversation = conversations.find(c => c.id === activeConversationId);

  const createNewConversation = useCallback(() => {
    const newConv: Conversation = {
      id: generateId(),
      name: 'New Conversation',
      lastMessage: '',
      timestamp: new Date().toISOString(),
      messages: [],
    };
    setConversations(prev => [newConv, ...prev]);
    setActiveConversationId(newConv.id);
    return newConv.id;
  }, []);

  const deleteConversation = useCallback((id: string) => {
    setConversations(prev => prev.filter(c => c.id !== id));
    if (activeConversationId === id) {
      setActiveConversationId(conversations[0]?.id || null);
    }
  }, [activeConversationId, conversations]);

  const sendMessage = useCallback(async (content: string) => {
    let convId = activeConversationId;
    
    // Create new conversation if none exists
    if (!convId) {
      convId = createNewConversation();
    }

    const userMessage: ChatMessage = {
      id: generateId(),
      role: 'user',
      content,
      timestamp: new Date().toISOString(),
      type: 'text',
    };

    // Add user message
    setConversations(prev => prev.map(conv => {
      if (conv.id === convId) {
        const isFirst = conv.messages.length === 0;
        return {
          ...conv,
          name: isFirst ? content.slice(0, 30) + (content.length > 30 ? '...' : '') : conv.name,
          lastMessage: content,
          timestamp: new Date().toISOString(),
          messages: [...conv.messages, userMessage],
        };
      }
      return conv;
    }));

    // Simulate AI response
    setIsTyping(true);
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));

    const mockResponse = mockAIResponses[Math.floor(Math.random() * mockAIResponses.length)];
    const aiMessage: ChatMessage = {
      id: generateId(),
      role: 'assistant',
      content: mockResponse.content,
      timestamp: new Date().toISOString(),
      type: mockResponse.type,
      outfitData: mockResponse.outfitData,
      itemsData: mockResponse.itemsData,
      quickReplies: mockResponse.quickReplies,
      calendarEvent: mockResponse.calendarEvent,
      feedback: null,
    };

    setConversations(prev => prev.map(conv => {
      if (conv.id === convId) {
        return {
          ...conv,
          lastMessage: mockResponse.content.slice(0, 50) + '...',
          messages: [...conv.messages, aiMessage],
        };
      }
      return conv;
    }));

    setIsTyping(false);
  }, [activeConversationId, createNewConversation]);

  const setMessageFeedback = useCallback((messageId: string, feedback: 'up' | 'down') => {
    setConversations(prev => prev.map(conv => ({
      ...conv,
      messages: conv.messages.map(msg => 
        msg.id === messageId ? { ...msg, feedback } : msg
      ),
    })));
  }, []);

  const regenerateResponse = useCallback(async (messageId: string) => {
    if (!activeConversationId) return;

    // Find the message and remove it
    const conv = conversations.find(c => c.id === activeConversationId);
    if (!conv) return;

    const messageIndex = conv.messages.findIndex(m => m.id === messageId);
    if (messageIndex === -1) return;

    // Remove the AI message
    setConversations(prev => prev.map(c => {
      if (c.id === activeConversationId) {
        return {
          ...c,
          messages: c.messages.filter(m => m.id !== messageId),
        };
      }
      return c;
    }));

    // Generate new response
    setIsTyping(true);
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));

    const mockResponse = mockAIResponses[Math.floor(Math.random() * mockAIResponses.length)];
    const aiMessage: ChatMessage = {
      id: generateId(),
      role: 'assistant',
      content: mockResponse.content,
      timestamp: new Date().toISOString(),
      type: mockResponse.type,
      outfitData: mockResponse.outfitData,
      itemsData: mockResponse.itemsData,
      quickReplies: mockResponse.quickReplies,
      calendarEvent: mockResponse.calendarEvent,
      feedback: null,
    };

    setConversations(prev => prev.map(conv => {
      if (conv.id === activeConversationId) {
        const messages = [...conv.messages];
        messages.splice(messageIndex, 0, aiMessage);
        return {
          ...conv,
          lastMessage: mockResponse.content.slice(0, 50) + '...',
          messages,
        };
      }
      return conv;
    }));

    setIsTyping(false);
  }, [activeConversationId, conversations]);

  return {
    conversations,
    activeConversation,
    activeConversationId,
    setActiveConversationId,
    isTyping,
    createNewConversation,
    deleteConversation,
    sendMessage,
    setMessageFeedback,
    regenerateResponse,
  };
}
