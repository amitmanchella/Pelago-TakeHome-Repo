export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
  endScreen?: EndOfConversationScreen;
}

export interface WorkingMemory {
  userId: string;
  facts: string[];
  preferences: string[];
  topics: string[];
}

export interface EndOfConversationScreen {
  validation: string;
  reflection: string;
  themes: string[];
  encouragement: string;
  keyMoment?: string;
  emotionalTone: string;
  suggestedNextStep?: string;
}

export type LLMModel = 'GPT 5.2' | 'Claude Sonnet';

export const LLM_MODELS: LLMModel[] = ['GPT 5.2', 'Claude Sonnet'];
