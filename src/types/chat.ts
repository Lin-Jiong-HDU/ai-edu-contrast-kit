export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  isStreaming?: boolean;
}

export interface ChatSession {
  id: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

export type UserType = 'teacher' | 'student';

export interface ChatState {
  currentSession: ChatSession | null;
  sessions: ChatSession[];
  isLoading: boolean;
  isStreaming: boolean;
  error: string | null;
  userType: UserType;
}

export interface StreamChunk {
  content: string;
  isComplete: boolean;
}
