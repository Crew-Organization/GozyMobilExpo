export interface User {
  id: string;
  name: string;
  avatar: string;
  username: string;
  isOnline: boolean;
  lastSeen?: Date;
  verified?: boolean;
}

export interface Message {
  id: string;
  senderId: string;
  text?: string;
  image?: string;
  voiceUrl?: string;
  voiceDuration?: number;
  replyTo?: Message;
  reactions: Record<string, string[]>; // emoji -> userIds
  readBy: string[]; // userIds who have read
  timestamp: Date;
  status: 'sending' | 'sent' | 'delivered' | 'read';
}

export interface Conversation {
  id: string;
  participantIds: string[];
  lastMessage?: Message;
  unreadCount: number;
  updatedAt: Date;
  archivedAt?: Date;
  mutedUntil?: Date;
  isPinned: boolean;
}

export interface Contact {
  id: string;
  name: string;
  avatar: string;
  username: string;
  phone?: string;
  isOnline: boolean;
  lastSeen?: Date;
  verified?: boolean;
  conversationId?: string;
}

export interface TypingIndicator {
  userId: string;
  conversationId: string;
}
