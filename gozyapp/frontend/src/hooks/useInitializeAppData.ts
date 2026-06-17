import { useEffect } from 'react';
import { useChatStore } from '@/src/store/chat-store';
import { useReelsStore } from '@/src/store/reels-store';
import type { Conversation, Contact, Message } from '@/src/types/chat';
import type { Reel, Creator } from '@/src/types/reels';

export function useInitializeAppData() {
  const { setConversations, setContacts, addMessage } = useChatStore();
  const { setForYouReels, setFollowingReels } = useReelsStore();

  useEffect(() => {
    // Initialize mock conversations
    const mockConversations: Conversation[] = [
      {
        id: 'conv-1',
        participantIds: ['user-2'],
        lastMessage: {
          id: 'msg-1',
          senderId: 'user-2',
          text: "Hey! How's your day going?",
          reactions: {},
          readBy: ['user-1'],
          timestamp: new Date(Date.now() - 3600000),
          status: 'read',
        },
        unreadCount: 0,
        updatedAt: new Date(Date.now() - 3600000),
        isPinned: true,
      },
      {
        id: 'conv-2',
        participantIds: ['user-3'],
        lastMessage: {
          id: 'msg-2',
          senderId: 'user-1',
          text: 'See you soon! 👋',
          reactions: {},
          readBy: ['user-1', 'user-3'],
          timestamp: new Date(Date.now() - 7200000),
          status: 'read',
        },
        unreadCount: 0,
        updatedAt: new Date(Date.now() - 7200000),
        isPinned: false,
      },
    ];

    // Initialize mock messages for conversations
    const mockMessages: Record<string, Message[]> = {
      'conv-1': [
        {
          id: 'msg-1',
          senderId: 'user-2',
          text: "Hey! How's your day going?",
          reactions: {},
          readBy: ['user-1'],
          timestamp: new Date(Date.now() - 3600000),
          status: 'read',
        },
        {
          id: 'msg-2',
          senderId: 'user-1',
          text: 'Pretty good! Just finished a workout 💪',
          reactions: { '👍': ['user-2'] },
          readBy: ['user-1', 'user-2'],
          timestamp: new Date(Date.now() - 3500000),
          status: 'read',
        },
      ],
      'conv-2': [
        {
          id: 'msg-3',
          senderId: 'user-1',
          text: 'The project looks amazing!',
          reactions: {},
          readBy: ['user-1', 'user-3'],
          timestamp: new Date(Date.now() - 7200000),
          status: 'read',
        },
        {
          id: 'msg-4',
          senderId: 'user-1',
          text: 'See you soon! 👋',
          reactions: {},
          readBy: ['user-1', 'user-3'],
          timestamp: new Date(Date.now() - 7100000),
          status: 'read',
        },
      ],
    };

    // Initialize mock contacts
    const mockContacts: Contact[] = [
      {
        id: 'user-1',
        name: 'Sarah Anderson',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
        username: 'sarahfitness',
        isOnline: true,
        verified: true,
        conversationId: 'conv-1',
      },
      {
        id: 'user-2',
        name: 'Alex Chen',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex',
        username: 'alexcooks',
        isOnline: false,
        verified: true,
        lastSeen: new Date(Date.now() - 600000),
        conversationId: 'conv-2',
      },
      {
        id: 'user-3',
        name: 'Maya Patel',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=maya',
        username: 'mayaphotography',
        isOnline: true,
        verified: false,
      },
      {
        id: 'user-4',
        name: 'James Wilson',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=james',
        username: 'jamestravel',
        isOnline: false,
        verified: true,
        lastSeen: new Date(Date.now() - 3600000),
      },
      {
        id: 'user-5',
        name: 'Emma Thompson',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emma',
        username: 'emmastyle',
        isOnline: true,
        verified: false,
      },
    ];

    // Initialize mock reels
    const mockCreators: Creator[] = [
      {
        id: 'creator-1',
        name: 'Travel Vlogger',
        username: '@travelvlogger',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=traveler',
        verified: true,
        isFollowing: false,
        followerCount: 1200000,
      },
      {
        id: 'creator-2',
        name: 'Fitness Coach',
        username: '@fitcoach',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=fitness',
        verified: true,
        isFollowing: true,
        followerCount: 850000,
      },
    ];

    const mockReels: Reel[] = [
      {
        id: 'reel-1',
        creatorId: 'creator-1',
        creator: mockCreators[0],
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-library/sample/forbiggerblaze.mp4',
        thumbnail: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=600&fit=crop',
        caption: 'Amazing beach sunset in Maldives! 🌅 Who else loves tropical sunsets? #travel #maldives #sunset',
        hashtags: ['#travel', '#maldives', '#sunset'],
        duration: 30,
        likeCount: 245000,
        commentCount: 12500,
        shareCount: 8900,
        isLiked: false,
        isBookmarked: false,
        createdAt: new Date(Date.now() - 86400000),
        views: 5200000,
      },
      {
        id: 'reel-2',
        creatorId: 'creator-2',
        creator: mockCreators[1],
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-library/sample/bigbuckbunny.mp4',
        thumbnail: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=600&fit=crop',
        caption: 'Home workout routine - 15 mins to full body burn! 💪 No equipment needed. #fitness #workout #homegym',
        hashtags: ['#fitness', '#workout', '#homegym'],
        duration: 45,
        likeCount: 567000,
        commentCount: 28900,
        shareCount: 15600,
        isLiked: false,
        isBookmarked: false,
        createdAt: new Date(Date.now() - 172800000),
        views: 8100000,
      },
    ];

    setConversations(mockConversations);
    setContacts(mockContacts);
    setForYouReels(mockReels);
    setFollowingReels(mockReels);

    // Initialize messages in store
    Object.entries(mockMessages).forEach(([conversationId, msgs]) => {
      msgs.forEach((msg) => {
        addMessage(conversationId, msg);
      });
    });
  }, [setConversations, setContacts, setForYouReels, setFollowingReels, addMessage]);
}
