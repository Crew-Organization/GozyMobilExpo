import {
  createContext,
  startTransition,
  useContext,
  useEffect,
  useRef,
  useState,
  type PropsWithChildren,
} from 'react';
import { io, type Socket } from 'socket.io-client';

import { api } from '@/src/lib/api';
import { mockBootstrap } from '@/src/lib/mock-data';
import { configureNotifications, sendLocalNotification } from '@/src/lib/notifications';
import { useInitializeAppData } from '@/src/hooks/useInitializeAppData';
import type {
  AppNotification,
  AssistantMessage,
  AuthChannel,
  AuthProvider,
  Booking,
  BootstrapPayload,
  Category,
  Conversation,
  DashboardMetrics,
  EventListing,
  Experience,
  LifestyleSection,
  MatchProfile,
  Product,
  Restaurant,
  Session,
  SwipeDirection,
  TravelBookingConfirmation,
  TravelBookingPayload,
  TravelItem,
  UserProfile,
  WalletTransaction,
  HotelBookingConfirmation,
  HotelBookingPayload,
} from '@/src/types';

type ProfileInput = {
  name: string;
  city: string;
  budget: string;
  interests: string[];
  preferredCategories: Category[];
};

type AppContextValue = {
  isHydrating: boolean;
  session: Session | null;
  onboarded: boolean;
  otpRequestedFor: string | null;
  otpChannel: AuthChannel | null;
  feed: Experience[];
  matches: MatchProfile[];
  conversations: Conversation[];
  walletBalance: number;
  transactions: WalletTransaction[];
  bookings: Booking[];
  dashboard: DashboardMetrics;
  notifications: AppNotification[];
  recommendations: string[];
  sections: LifestyleSection[];
  travel: TravelItem[];
  restaurants: Restaurant[];
  products: Product[];
  events: EventListing[];
  assistantMessages: AssistantMessage[];
  requestOtp: (identifier: string, channel: AuthChannel) => Promise<string>;
  verifyOtp: (code: string) => Promise<Session>;
  continueWithProvider: (provider: AuthProvider, mode: 'signin' | 'signup') => Promise<Session>;
  continueAsDemo: () => Promise<Session>;
  completeProfile: (profile: ProfileInput) => Promise<void>;
  handleFeedSwipe: (experienceId: string, direction: SwipeDirection) => Promise<void>;
  likeMatch: (matchId: string) => Promise<void>;
  sendChatMessage: (conversationId: string, text: string) => Promise<void>;
  addMoney: (amount: number) => Promise<void>;
  bookExperience: (experience: Experience) => Promise<void>;
  createTravelBooking: (payload: TravelBookingPayload) => Promise<TravelBookingConfirmation>;
  createHotelBooking: (payload: HotelBookingPayload) => Promise<HotelBookingConfirmation>;
  refreshApp: () => Promise<void>;
  markNotificationRead: (notificationId: string) => Promise<void>;
  markConversationRead: (conversationId: string) => void;
  askAssistant: (prompt: string) => Promise<void>;
  logout: () => void;
};

const initialDashboard = mockBootstrap.dashboard;

const AppContext = createContext<AppContextValue | null>(null);

const makeId = (prefix: string) => `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

function applyBootstrap(
  payload: BootstrapPayload,
  setters: {
    setFeed: (value: Experience[]) => void;
    setMatches: (value: MatchProfile[]) => void;
    setConversations: (value: Conversation[]) => void;
    setWalletBalance: (value: number) => void;
    setTransactions: (value: WalletTransaction[]) => void;
    setBookings: (value: Booking[]) => void;
    setDashboard: (value: DashboardMetrics) => void;
    setNotifications: (value: AppNotification[]) => void;
    setRecommendations: (value: string[]) => void;
    setSections: (value: LifestyleSection[]) => void;
    setTravel: (value: TravelItem[]) => void;
    setRestaurants: (value: Restaurant[]) => void;
    setProducts: (value: Product[]) => void;
    setEvents: (value: EventListing[]) => void;
    setAssistantMessages: (value: AssistantMessage[]) => void;
  },
) {
  startTransition(() => {
    setters.setFeed(payload.feed);
    setters.setMatches(payload.matches);
    setters.setConversations(payload.conversations);
    setters.setWalletBalance(payload.walletBalance);
    setters.setTransactions(payload.transactions);
    setters.setBookings(payload.bookings);
    setters.setDashboard(payload.dashboard);
    setters.setNotifications(payload.notifications);
    setters.setRecommendations(payload.recommendations);
    setters.setSections(payload.sections);
    setters.setTravel(payload.travel);
    setters.setRestaurants(payload.restaurants);
    setters.setProducts(payload.products);
    setters.setEvents(payload.events);
    setters.setAssistantMessages(payload.assistantMessages);
  });
}

export function AppProvider({ children }: PropsWithChildren) {
  const [isHydrating, setIsHydrating] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [onboarded, setOnboarded] = useState(false);
  const [otpRequestedFor, setOtpRequestedFor] = useState<string | null>(null);
  const [otpChannel, setOtpChannel] = useState<AuthChannel | null>(null);
  const [feed, setFeed] = useState<Experience[]>(mockBootstrap.feed);
  const [matches, setMatches] = useState<MatchProfile[]>(mockBootstrap.matches);
  const [conversations, setConversations] = useState<Conversation[]>(mockBootstrap.conversations);
  const [walletBalance, setWalletBalance] = useState(mockBootstrap.walletBalance);
  const [transactions, setTransactions] = useState<WalletTransaction[]>(mockBootstrap.transactions);
  const [bookings, setBookings] = useState<Booking[]>(mockBootstrap.bookings);
  const [dashboard, setDashboard] = useState<DashboardMetrics>(initialDashboard);
  const [notifications, setNotifications] = useState<AppNotification[]>(mockBootstrap.notifications);
  const [recommendations, setRecommendations] = useState<string[]>(mockBootstrap.recommendations);
  const [sections, setSections] = useState<LifestyleSection[]>(mockBootstrap.sections);
  const [travel, setTravel] = useState<TravelItem[]>(mockBootstrap.travel);
  const [restaurants, setRestaurants] = useState<Restaurant[]>(mockBootstrap.restaurants);
  const [products, setProducts] = useState<Product[]>(mockBootstrap.products);
  const [events, setEvents] = useState<EventListing[]>(mockBootstrap.events);
  const [assistantMessages, setAssistantMessages] = useState<AssistantMessage[]>(
    mockBootstrap.assistantMessages,
  );
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    configureNotifications();
  }, []);

  // Initialize chat and reels data
  useInitializeAppData();

  useEffect(() => {
    if (!session) {
      socketRef.current?.disconnect();
      socketRef.current = null;
      return;
    }

    const socket = io(api.socketBaseUrl, {
      autoConnect: true,
      transports: ['websocket'],
      timeout: 2500,
    });

    socket.on('connect', () => {
      socket.emit('user:join', { userId: session.user.id });
    });

    socket.on('chat:new', (payload: { conversationId: string; message: string; senderName: string }) => {
      setConversations((current) =>
        current.map((conversation) => {
          if (conversation.id !== payload.conversationId) {
            return conversation;
          }

          return {
            ...conversation,
            unreadCount: conversation.unreadCount + 1,
            lastMessage: payload.message,
            messages: [
              ...conversation.messages,
              {
                id: makeId('socket'),
                senderId: conversation.participantId,
                text: payload.message,
                kind: 'text',
                createdAt: new Date().toISOString(),
              },
            ],
          };
        }),
      );

      const notification: AppNotification = {
        id: makeId('notif'),
        title: `${payload.senderName} sent a message`,
        body: payload.message,
        kind: 'chat',
        createdAt: new Date().toISOString(),
        read: false,
      };
      setNotifications((current) => [notification, ...current]);
      sendLocalNotification(notification.title, notification.body);
    });

    socketRef.current = socket;
    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [session]);

  const hydrateApp = async () => {
    setIsHydrating(true);
    try {
      const payload = await api.getBootstrap();
      applyBootstrap(payload, {
        setFeed,
        setMatches,
        setConversations,
        setWalletBalance,
        setTransactions,
        setBookings,
        setDashboard,
        setNotifications,
        setRecommendations,
        setSections,
        setTravel,
        setRestaurants,
        setProducts,
        setEvents,
        setAssistantMessages,
      });
    } finally {
      setIsHydrating(false);
    }
  };

  const requestOtp = async (identifier: string, channel: AuthChannel) => {
    const response = await api.requestOtp(identifier, channel);
    setOtpRequestedFor(identifier);
    setOtpChannel(channel);
    return response.otpHint;
  };

  const verifyOtp = async (code: string) => {
    if (!otpRequestedFor) {
      throw new Error('OTP requested email missing');
    }

    const nextSession = await api.verifyOtp(otpRequestedFor, otpChannel ?? 'email', code);
    setSession(nextSession);
    setOnboarded(Boolean(nextSession.user.name));
    await hydrateApp();
    return nextSession;
  };

  const continueWithProvider = async (
    provider: AuthProvider,
    mode: 'signin' | 'signup',
  ) => {
    const nextSession = await api.continueWithProvider(provider, mode);
    setSession(nextSession);
    setOnboarded(Boolean(nextSession.user.name));
    await hydrateApp();
    return nextSession;
  };

  const continueAsDemo = async () => {
    const nextSession = await api.continueAsDemo();
    setSession(nextSession);
    setOnboarded(true);
    await hydrateApp();
    return nextSession;
  };

  const completeProfile = async (profile: ProfileInput) => {
    if (!session) {
      return;
    }

    const updatedUser = await api.updateProfile(profile as Partial<UserProfile>);
    setSession({
      ...session,
      user: {
        ...session.user,
        ...updatedUser,
      },
    });
    setOnboarded(true);
  };

  const handleFeedSwipe = async (experienceId: string, direction: SwipeDirection) => {
    await api.swipeExperience(experienceId, direction);
    const swiped = feed.find((item) => item.id === experienceId);
    if (!swiped) {
      return;
    }

    if (direction === 'right') {
      const notification: AppNotification = {
        id: makeId('notif'),
        title: `Saved ${swiped.title}`,
        body: `${swiped.category} has been added to your Gozy board.`,
        kind: 'recommendation',
        createdAt: new Date().toISOString(),
        read: false,
      };

      setNotifications((current) => [notification, ...current]);
      setDashboard((current) => ({
        ...current,
        savedCount: current.savedCount + 1,
        recentActivity: [`Saved ${swiped.title}`, ...current.recentActivity].slice(0, 3),
      }));
      setRecommendations((current) => [
        `Because you saved ${swiped.title}, Gozy is surfacing more ${swiped.category.toLowerCase()} picks nearby.`,
        ...current,
      ].slice(0, 3));
    }
  };

  const likeMatch = async (matchId: string) => {
    await api.likeMatch(matchId);
    const currentMatch = matches.find((match) => match.id === matchId);
    if (!currentMatch) {
      return;
    }

    const notification: AppNotification = {
      id: makeId('notif'),
      title: `You matched with ${currentMatch.name}`,
      body: `Shared interests: ${currentMatch.interests.slice(0, 2).join(', ')}.`,
      kind: 'match',
      createdAt: new Date().toISOString(),
      read: false,
    };

    setNotifications((current) => [notification, ...current]);
    sendLocalNotification(notification.title, notification.body);
  };

  const sendChatMessage = async (conversationId: string, text: string) => {
    if (!session || !text.trim()) {
      return;
    }

    const optimisticId = makeId('msg');
    setConversations((current) =>
      current.map((conversation) => {
        if (conversation.id !== conversationId) {
          return conversation;
        }

        return {
          ...conversation,
          lastMessage: text,
          messages: [
            ...conversation.messages,
            {
              id: optimisticId,
              senderId: session.user.id,
              text,
              kind: 'text',
              createdAt: new Date().toISOString(),
              pending: true,
            },
          ],
        };
      }),
    );

    socketRef.current?.emit('chat:send', {
      conversationId,
      senderId: session.user.id,
      text,
    });

    await api.sendMessage(conversationId, text);

    setConversations((current) =>
      current.map((conversation) => {
        if (conversation.id !== conversationId) {
          return conversation;
        }

        return {
          ...conversation,
          messages: conversation.messages.map((message) =>
            message.id === optimisticId ? { ...message, pending: false } : message,
          ),
        };
      }),
    );
  };

  const addMoney = async (amount: number) => {
    await api.addMoney(amount);

    const transaction: WalletTransaction = {
      id: makeId('txn'),
      title: 'Added via mock payment',
      amount,
      createdAt: new Date().toISOString(),
      status: 'completed',
      type: 'credit',
      category: 'wallet',
    };

    setWalletBalance((current) => current + amount);
    setTransactions((current) => [transaction, ...current]);
    setDashboard((current) => ({
      ...current,
      walletBalance: current.walletBalance + amount,
    }));
  };

  const bookExperience = async (experience: Experience) => {
    await api.createBooking(experience);

    const booking: Booking = {
      id: makeId('booking'),
      experienceId: experience.id,
      title: experience.title,
      category: experience.category,
      location: experience.location,
      date: 'Friday, 8:00 PM',
      guests: 2,
      total: Math.max(399, Math.round(experience.rating * 400)),
      status: 'upcoming',
    };

    setBookings((current) => [booking, ...current]);

    const notification: AppNotification = {
      id: makeId('notif'),
      title: 'Booking confirmed',
      body: `${experience.title} has been added to your plans.`,
      kind: 'booking',
      createdAt: new Date().toISOString(),
      read: false,
    };

    setNotifications((current) => [notification, ...current]);
    sendLocalNotification(notification.title, notification.body);
  };

  const createTravelBooking = async (payload: TravelBookingPayload) => {
    const confirmation = await api.createTravelBooking(payload);
    await hydrateApp();
    sendLocalNotification(
      'Flight booking confirmed',
      `${confirmation.route} is now available in your Gozy bookings.`,
    );
    return confirmation;
  };

  const createHotelBooking = async (payload: HotelBookingPayload) => {
    const confirmation = await api.createHotelBooking(payload);
    await hydrateApp();
    sendLocalNotification(
      'Hotel booking confirmed',
      `${confirmation.hotelName} is now available in your Gozy bookings.`,
    );
    return confirmation;
  };

  const markNotificationRead = async (notificationId: string) => {
    await api.markNotificationRead(notificationId);
    setNotifications((current) =>
      current.map((notification) =>
        notification.id === notificationId ? { ...notification, read: true } : notification,
      ),
    );
  };

  const markConversationRead = (conversationId: string) => {
    setConversations((current) =>
      current.map((conversation) =>
        conversation.id === conversationId ? { ...conversation, unreadCount: 0 } : conversation,
      ),
    );
  };

  const askAssistant = async (prompt: string) => {
    const userMessage: AssistantMessage = {
      id: makeId('assistant-user'),
      role: 'user',
      text: prompt,
      createdAt: new Date().toISOString(),
    };

    setAssistantMessages((current) => [...current, userMessage]);

    const response = await api.askAssistant(prompt);

    const assistantMessage: AssistantMessage = {
      id: makeId('assistant-reply'),
      role: 'assistant',
      text: response.reply,
      chips: response.chips,
      createdAt: new Date().toISOString(),
    };

    setAssistantMessages((current) => [...current, assistantMessage]);
  };

  const logout = () => {
    setSession(null);
    setOnboarded(false);
    setOtpRequestedFor(null);
    setOtpChannel(null);
    applyBootstrap(mockBootstrap, {
      setFeed,
      setMatches,
      setConversations,
      setWalletBalance,
      setTransactions,
      setBookings,
      setDashboard,
      setNotifications,
      setRecommendations,
      setSections,
      setTravel,
      setRestaurants,
      setProducts,
      setEvents,
      setAssistantMessages,
    });
  };

  const refreshApp = async () => {
    await hydrateApp();
  };

  const value: AppContextValue = {
    isHydrating,
    session,
    onboarded,
    otpRequestedFor,
    otpChannel,
    feed,
    matches,
    conversations,
    walletBalance,
    transactions,
    bookings,
    dashboard,
    notifications,
    recommendations,
    sections,
    travel,
    restaurants,
    products,
    events,
    assistantMessages,
    requestOtp,
    verifyOtp,
    continueWithProvider,
    continueAsDemo,
    completeProfile,
    handleFeedSwipe,
    likeMatch,
    sendChatMessage,
    addMoney,
    bookExperience,
    createTravelBooking,
    createHotelBooking,
    refreshApp,
    markNotificationRead,
    markConversationRead,
    askAssistant,
    logout,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used inside AppProvider');
  }

  return context;
}
