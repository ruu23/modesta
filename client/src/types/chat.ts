export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  type: 'text' | 'outfit' | 'items' | 'quickReplies' | 'calendar';
  outfitData?: {
    name: string;
    image: string;
    items: { name: string; image: string }[];
  };
  itemsData?: {
    name: string;
    image: string;
    price: string;
    link: string;
  }[];
  quickReplies?: string[];
  calendarEvent?: {
    title: string;
    date: string;
    outfit: string;
  };
  feedback?: 'up' | 'down' | null;
}

export interface Conversation {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: string;
  messages: ChatMessage[];
}

export const SUGGESTED_PROMPTS = [
  { icon: '💒', text: "What should I wear to a wedding?" },
  { icon: '🧕', text: "Suggest hijab colors for this outfit" },
  { icon: '🌙', text: "Help me plan outfits for Ramadan" },
  { icon: '💼', text: "I have a job interview tomorrow" },
  { icon: '☀️', text: "Summer vacation outfit ideas" },
  { icon: '🎉', text: "Birthday party look suggestions" },
];
