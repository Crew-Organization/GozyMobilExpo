import { create } from 'zustand';
import type { Message, Conversation, Contact, TypingIndicator } from '@/src/types/chat';

interface ChatStore {
  // Data
  conversations: Conversation[];
  contacts: Contact[];
  currentConversationId: string | null;
  messages: Record<string, Message[]>; // conversationId -> messages
  typingUsers: TypingIndicator[];
  currentUserId: string;

  // Actions
  setConversations: (conversations: Conversation[]) => void;
  setContacts: (contacts: Contact[]) => void;
  setCurrentConversation: (conversationId: string) => void;
  addMessage: (conversationId: string, message: Message) => void;
  updateMessageStatus: (conversationId: string, messageId: string, status: Message['status']) => void;
  addReaction: (conversationId: string, messageId: string, emoji: string, userId: string) => void;
  removeReaction: (conversationId: string, messageId: string, emoji: string, userId: string) => void;
  markMessagesAsRead: (conversationId: string, messageIds: string[]) => void;
  setTypingUsers: (users: TypingIndicator[]) => void;
  searchContacts: (query: string) => Contact[];
  getConversation: (conversationId: string) => Conversation | undefined;
  getMessages: (conversationId: string) => Message[];
  deleteMessage: (conversationId: string, messageId: string) => void;
  archiveConversation: (conversationId: string) => void;
  unarchiveConversation: (conversationId: string) => void;
  muteConversation: (conversationId: string, durationMs: number) => void;
  pinConversation: (conversationId: string) => void;
  unpinConversation: (conversationId: string) => void;
  clearCurrentConversation: () => void;
}

export const useChatStore = create<ChatStore>((set, get) => ({
    conversations: [],
    contacts: [],
    currentConversationId: null,
    messages: {},
    typingUsers: [],
    currentUserId: 'user-1', // Replace with actual user

    setConversations: (conversations) => set({ conversations }),

    setContacts: (contacts) => set({ contacts }),

    setCurrentConversation: (conversationId) => set({ currentConversationId: conversationId }),

    clearCurrentConversation: () => set({ currentConversationId: null }),

    addMessage: (conversationId, message) =>
      set((state) => ({
        messages: {
          ...state.messages,
          [conversationId]: [...(state.messages[conversationId] || []), message],
        },
        conversations: state.conversations.map((conv) =>
          conv.id === conversationId
            ? {
                ...conv,
                lastMessage: message,
                updatedAt: message.timestamp,
              }
            : conv,
        ),
      })),

    updateMessageStatus: (conversationId, messageId, status) =>
      set((state) => ({
        messages: {
          ...state.messages,
          [conversationId]: (state.messages[conversationId] || []).map((msg) =>
            msg.id === messageId ? { ...msg, status } : msg,
          ),
        },
      })),

    addReaction: (conversationId, messageId, emoji, userId) =>
      set((state) => ({
        messages: {
          ...state.messages,
          [conversationId]: (state.messages[conversationId] || []).map((msg) =>
            msg.id === messageId
              ? {
                  ...msg,
                  reactions: {
                    ...msg.reactions,
                    [emoji]: [...(msg.reactions[emoji] || []), userId],
                  },
                }
              : msg,
          ),
        },
      })),

    removeReaction: (conversationId, messageId, emoji, userId) =>
      set((state) => ({
        messages: {
          ...state.messages,
          [conversationId]: (state.messages[conversationId] || []).map((msg) =>
            msg.id === messageId
              ? {
                  ...msg,
                  reactions: {
                    ...msg.reactions,
                    [emoji]: (msg.reactions[emoji] || []).filter((id) => id !== userId),
                  },
                }
              : msg,
          ),
        },
      })),

    markMessagesAsRead: (conversationId, messageIds) =>
      set((state) => ({
        messages: {
          ...state.messages,
          [conversationId]: (state.messages[conversationId] || []).map((msg) =>
            messageIds.includes(msg.id)
              ? { ...msg, readBy: [...new Set([...msg.readBy, get().currentUserId])] }
              : msg,
          ),
        },
      })),

    setTypingUsers: (users) => set({ typingUsers: users }),

    searchContacts: (query) => {
      const { contacts } = get();
      if (!query.trim()) return contacts;
      const lowerQuery = query.toLowerCase();
      return contacts.filter(
        (contact) =>
          contact.name.toLowerCase().includes(lowerQuery) ||
          contact.username.toLowerCase().includes(lowerQuery),
      );
    },

    getConversation: (conversationId) => {
      const { conversations } = get();
      return conversations.find((c) => c.id === conversationId);
    },

    getMessages: (conversationId) => get().messages[conversationId] || [],

    deleteMessage: (conversationId, messageId) =>
      set((state) => ({
        messages: {
          ...state.messages,
          [conversationId]: (state.messages[conversationId] || []).filter((m) => m.id !== messageId),
        },
      })),

    archiveConversation: (conversationId) =>
      set((state) => ({
        conversations: state.conversations.map((conv) =>
          conv.id === conversationId
            ? { ...conv, archivedAt: new Date() }
            : conv,
        ),
      })),

    unarchiveConversation: (conversationId) =>
      set((state) => ({
        conversations: state.conversations.map((conv) =>
          conv.id === conversationId
            ? { ...conv, archivedAt: undefined }
            : conv,
        ),
      })),

    muteConversation: (conversationId, durationMs) =>
      set((state) => ({
        conversations: state.conversations.map((conv) =>
          conv.id === conversationId
            ? { ...conv, mutedUntil: new Date(Date.now() + durationMs) }
            : conv,
        ),
      })),

    pinConversation: (conversationId) =>
      set((state) => ({
        conversations: state.conversations.map((conv) =>
          conv.id === conversationId
            ? { ...conv, isPinned: true }
            : conv,
        ),
      })),

    unpinConversation: (conversationId) =>
      set((state) => ({
        conversations: state.conversations.map((conv) =>
          conv.id === conversationId
            ? { ...conv, isPinned: false }
            : conv,
        ),
      })),
  }),
);
