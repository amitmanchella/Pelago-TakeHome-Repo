import { Conversation, WorkingMemory } from './types';

const CONVERSATIONS_KEY = 'voiced_conversations';
const MEMORY_KEY = 'voiced_working_memory';
const SYSTEM_PROMPT_KEY = 'voiced_system_prompt';

export const DEFAULT_SYSTEM_PROMPT = `You are a supportive, reflective AI companion inspired by Voiced. You provide emotional support through brief, personal conversations.

CONVERSATION STYLE:
- Keep responses SHORT (2-4 sentences max)
- Be conversational, like texting a close friend
- Focus on ONE thing at a time
- Ask ONE question per response, not multiple
- Use simple, natural language
- Avoid lengthy explanations or advice dumps

USING MEMORY:
- Reference things you know about the user when RELEVANT and helpful
- Only make connections that are natural and appropriate to the current topic
- Don't force memory references - if nothing in your memory relates to what they're saying, just respond to what they shared
- When you do reference memory, do it naturally: "Last time you mentioned..." or "I remember you said..."
- Build continuity across conversations, but stay focused on what they need right now

CORE APPROACH:
- Listen deeply, respond briefly
- Reflect what you hear in a sentence
- Ask ONE thoughtful follow-up question
- Be warm, empathetic, non-judgmental
- Help them explore feelings, not just solve problems
- Stay grounded in what they're actually talking about

BOUNDARIES - You are NOT:
- A coding assistant (decline code/technical requests)
- A general Q&A bot (decline factual queries unrelated to emotional wellbeing)
- A task helper (decline writing/summaries/translations)

If off-topic: "I'm here for emotional support and self-reflection. Want to talk about what's on your mind?"

Remember: BRIEF responses. ONE focus per message. Use memory when relevant, but don't force it.`;

// Conversation management
export function getConversations(): Conversation[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(CONVERSATIONS_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveConversations(conversations: Conversation[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(conversations));
}

export function getConversation(id: string): Conversation | undefined {
  return getConversations().find(c => c.id === id);
}

export function saveConversation(conversation: Conversation): void {
  const conversations = getConversations();
  const index = conversations.findIndex(c => c.id === conversation.id);

  if (index >= 0) {
    conversations[index] = conversation;
  } else {
    conversations.push(conversation);
  }

  saveConversations(conversations);
}

export function deleteConversation(id: string): void {
  const conversations = getConversations().filter(c => c.id !== id);
  saveConversations(conversations);
}

export function clearAllConversations(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(CONVERSATIONS_KEY);
  localStorage.removeItem(MEMORY_KEY);
}

// Working memory management
export function getWorkingMemory(): WorkingMemory {
  if (typeof window === 'undefined') {
    return { userId: 'default', facts: [], preferences: [], topics: [] };
  }
  const data = localStorage.getItem(MEMORY_KEY);
  return data ? JSON.parse(data) : { userId: 'default', facts: [], preferences: [], topics: [] };
}

export function saveWorkingMemory(memory: WorkingMemory): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(MEMORY_KEY, JSON.stringify(memory));
}

export function updateWorkingMemory(updates: Partial<Omit<WorkingMemory, 'userId'>>): void {
  const memory = getWorkingMemory();
  const updated = { ...memory, ...updates };
  saveWorkingMemory(updated);
}

export function mergeWorkingMemory(newMemory: { facts?: string[], preferences?: string[], topics?: string[] }): void {
  const memory = getWorkingMemory();

  const updated = {
    ...memory,
    facts: [...new Set([...memory.facts, ...(newMemory.facts || [])])],
    preferences: [...new Set([...memory.preferences, ...(newMemory.preferences || [])])],
    topics: [...new Set([...memory.topics, ...(newMemory.topics || [])])],
  };

  saveWorkingMemory(updated);
}

// System prompt management
export function getSystemPrompt(): string {
  if (typeof window === 'undefined') return DEFAULT_SYSTEM_PROMPT;
  return localStorage.getItem(SYSTEM_PROMPT_KEY) || DEFAULT_SYSTEM_PROMPT;
}

export function saveSystemPrompt(prompt: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(SYSTEM_PROMPT_KEY, prompt);
}

export function resetSystemPrompt(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(SYSTEM_PROMPT_KEY);
}
