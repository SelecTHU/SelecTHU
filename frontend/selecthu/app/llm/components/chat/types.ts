// frontend/selecthu/app/llm/components/chat/types.ts

export interface Message {
    id: string;
    content: string;
    type: 'user' | 'ai';
    timestamp: Date;
  }
  
  export interface ChatSession {
    id: string;
    name: string;
    messages: Message[];
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface PromptTemplate {
    id: string;
    title: string;
    content: string;
    category: 'recommendation' | 'inquiry' | 'strategy' | 'combination';
  }