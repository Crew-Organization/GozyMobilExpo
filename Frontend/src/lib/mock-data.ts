import type {
  AppNotification,
  AssistantMessage,
  Booking,
  BootstrapPayload,
  Conversation,
  DashboardMetrics,
  EventListing,
  Experience,
  LifestyleSection,
  Product,
  MatchProfile,
  Restaurant,
  Session,
  TravelItem,
  WalletTransaction,
} from '@/src/types';

const now = new Date('2026-03-27T09:30:00+05:30');

const iso = (offsetHours: number) =>
  new Date(now.getTime() + offsetHours * 60 * 60 * 1000).toISOString();

export const mockFeed: Experience[] = [
  {
    id: 'exp-travel-gokarna',
    category: 'Travel',
    title: 'Sunrise scooter loop in Gokarna',
    subtitle: 'MakeMyTrip meets Snapchat energy',
    location: 'Gokarna, Karnataka',
    description:
      'Cliff viewpoints, hidden beach cafes, and an AI route that optimizes surf stops, fuel, and golden-hour timing.',
    posterUrl:
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-driving-through-a-beautiful-jungle-road-15180-large.mp4',
    tags: ['Beach escape', 'Solo friendly', '2 nights'],
    priceLabel: 'from Rs 7,900',
    rating: 4.9,
    distanceKm: 5.8,
    vibe: 'Scenic, social, low-effort',
    duration: '48 sec reel',
    brandCue: 'Trip planner + social discover',
    cta: 'Book trip',
  },
  {
    id: 'exp-food-indiranagar',
    category: 'Food',
    title: 'Late-night chef table in Indiranagar',
    subtitle: 'Zomato x Swiggy x Instagram in one flow',
    location: 'Bengaluru, India',
    description:
      'Short tasting menu clips, live table availability, delivery fallback, and group split-pay checkout inside the same card.',
    posterUrl:
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-cooking-in-a-pan-42926-large.mp4',
    tags: ['Chef special', 'Instant table', 'Pay with wallet'],
    priceLabel: 'avg Rs 1,450',
    rating: 4.8,
    distanceKm: 2.2,
    vibe: 'Fast, premium, shareable',
    duration: '31 sec reel',
    brandCue: 'Food booking + social proof',
    cta: 'Reserve table',
  },
  {
    id: 'exp-shopping-ubcity',
    category: 'Shopping',
    title: 'Curated streetwear drop at UB City',
    subtitle: 'Amazon speed + Myntra styling + Flipkart deals',
    location: 'Bengaluru, India',
    description:
      'Swipe through the outfit reel, compare variants, save to your wardrobe board, and unlock cashback for same-day pickup.',
    posterUrl:
      'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=1200&q=80',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-woman-with-shopping-bags-walking-in-the-city-4571-large.mp4',
    tags: ['Drop alert', 'Try before buy', 'Cashback 8%'],
    priceLabel: 'from Rs 2,299',
    rating: 4.7,
    distanceKm: 3.1,
    vibe: 'Trendy, efficient, reward-driven',
    duration: '22 sec reel',
    brandCue: 'Style board + instant checkout',
    cta: 'Unlock deal',
  },
  {
    id: 'exp-entertainment-orion',
    category: 'Entertainment',
    title: 'Premium IMAX night with post-show hangout',
    subtitle: 'District x Bookings x Gozy social layer',
    location: 'Orion Mall, Bengaluru',
    description:
      'Buy movie tickets, find nearby dessert stops, and invite friends or matched travelers into the same evening plan.',
    posterUrl:
      'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1200&q=80',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-people-in-a-movie-theater-4427-large.mp4',
    tags: ['IMAX', 'Group plan', 'After-party'],
    priceLabel: 'tickets from Rs 380',
    rating: 4.6,
    distanceKm: 8.4,
    vibe: 'High energy, date-night ready',
    duration: '27 sec reel',
    brandCue: 'Entertainment + social planning',
    cta: 'Hold seats',
  },
];

export const mockMatches: MatchProfile[] = [
  {
    id: 'match-aarya',
    name: 'Aarya',
    age: 27,
    avatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
    destination: 'Kasol trek and cafe circuit',
    location: 'Bengaluru',
    budget: 'Rs 18k - 25k',
    interests: ['Trekking', 'Street food', 'Photography'],
    bio: 'Likes sunrise hikes, hostel socials, and overplanning the coffee stops.',
    nextTrip: 'Leaves in 5 days',
    compatibility: 94,
    travelStyle: 'Backpack plus comfort',
  },
  {
    id: 'match-rahul',
    name: 'Rahul',
    age: 29,
    avatar:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    destination: 'Pondicherry workcation',
    location: 'Chennai',
    budget: 'Rs 12k - 18k',
    interests: ['Remote work', 'Food walks', 'Beach stays'],
    bio: 'Split days between co-working cafes and sunset drives.',
    nextTrip: 'Leaves tomorrow',
    compatibility: 89,
    travelStyle: 'Flexible and easygoing',
  },
  {
    id: 'match-meera',
    name: 'Meera',
    age: 25,
    avatar:
      'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=400&q=80',
    destination: 'Jaipur shopping sprint',
    location: 'Hyderabad',
    budget: 'Rs 20k - 28k',
    interests: ['Boutique shopping', 'Cafes', 'Reels'],
    bio: 'Looking for a travel buddy who can balance shopping lists with chill dinner plans.',
    nextTrip: 'Leaves in 2 weeks',
    compatibility: 91,
    travelStyle: 'City explorer',
  },
];

export const mockConversations: Conversation[] = [
  {
    id: 'chat-aarya',
    participantName: 'Aarya',
    participantId: 'match-aarya',
    avatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
    online: true,
    typing: false,
    lastActive: 'online now',
    destination: 'Kasol trek',
    unreadCount: 2,
    lastMessage: 'I found a riverside stay with a shared cab pickup.',
    messages: [
      {
        id: 'msg-a1',
        senderId: 'match-aarya',
        text: 'You still thinking of doing the Kasol route next weekend?',
        kind: 'text',
        createdAt: iso(-12),
      },
      {
        id: 'msg-a2',
        senderId: 'user-gozy',
        text: 'Yes, especially if we can keep the total under 20k.',
        kind: 'text',
        createdAt: iso(-11),
      },
      {
        id: 'msg-a3',
        senderId: 'match-aarya',
        text: 'I found a riverside stay with a shared cab pickup.',
        kind: 'text',
        createdAt: iso(-1),
      },
    ],
  },
  {
    id: 'chat-rahul',
    participantName: 'Rahul',
    participantId: 'match-rahul',
    avatar:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    online: false,
    typing: true,
    lastActive: 'last seen 12m ago',
    destination: 'Pondicherry',
    unreadCount: 0,
    lastMessage: 'typing...',
    messages: [
      {
        id: 'msg-r1',
        senderId: 'match-rahul',
        text: 'I can drive from Chennai if you are okay splitting fuel.',
        kind: 'text',
        createdAt: iso(-8),
      },
      {
        id: 'msg-r2',
        senderId: 'user-gozy',
        text: 'That works. Let us also shortlist a cafe with strong Wi-Fi.',
        kind: 'text',
        createdAt: iso(-7.5),
      },
    ],
  },
];

export const mockTransactions: WalletTransaction[] = [
  {
    id: 'txn-1',
    title: 'Added via UPI',
    amount: 3000,
    createdAt: iso(-48),
    status: 'completed',
    type: 'credit',
    category: 'wallet',
  },
  {
    id: 'txn-2',
    title: 'Cashback from UB City drop',
    amount: 240,
    createdAt: iso(-24),
    status: 'completed',
    type: 'credit',
    category: 'cashback',
  },
  {
    id: 'txn-3',
    title: 'Indiranagar chef table',
    amount: 1450,
    createdAt: iso(-6),
    status: 'completed',
    type: 'debit',
    category: 'booking',
  },
];

export const mockBookings: Booking[] = [
  {
    id: 'booking-1',
    experienceId: 'exp-food-indiranagar',
    title: 'Indiranagar chef table',
    category: 'Food',
    location: 'Bengaluru',
    date: 'Tonight, 8:30 PM',
    guests: 2,
    total: 1450,
    status: 'upcoming',
  },
  {
    id: 'booking-2',
    experienceId: 'exp-entertainment-orion',
    title: 'IMAX seats for Dune night',
    category: 'Entertainment',
    location: 'Orion Mall',
    date: 'Sunday, 7:00 PM',
    guests: 3,
    total: 1140,
    status: 'upcoming',
  },
];

export const mockDashboard: DashboardMetrics = {
  savedCount: 18,
  tripCount: 4,
  walletBalance: 1790,
  monthlySpend: 12840,
  streakDays: 12,
  aiScore: 91,
  budgetUsedPercent: 68,
  savedPlaces: ['Gokarna cliff cafe', 'Cubbon brunch loop', 'Forum sneaker capsule'],
  recentActivity: [
    'Saved 3 travel reels from Goa and Gokarna',
    'Matched with 2 travelers for Kasol',
    'Booked an IMAX night and dinner combo',
  ],
};

export const mockNotifications: AppNotification[] = [
  {
    id: 'notif-1',
    title: 'Aarya liked your Kasol plan',
    body: 'You both match on budget, trek pace, and cafe stops.',
    kind: 'match',
    createdAt: iso(-2),
    read: false,
  },
  {
    id: 'notif-2',
    title: 'Wallet cashback unlocked',
    body: 'Rs 240 has been added for your shopping pickup.',
    kind: 'wallet',
    createdAt: iso(-4),
    read: false,
  },
  {
    id: 'notif-3',
    title: 'AI found a better beach circuit',
    body: 'Your saved Gokarna stops now fit inside a 2-day budget.',
    kind: 'recommendation',
    createdAt: iso(-10),
    read: true,
  },
];

export const mockRecommendations = [
  'Prioritize coastal escapes with hostel social nights and scooter rentals.',
  'You respond best to compact food plans with instant booking and split pay.',
  'Your strongest conversion category is Shopping after 7 PM with cashback.',
];

export const mockSections: LifestyleSection[] = [
  {
    id: 'section-travel',
    kind: 'travel',
    title: 'Travel stack',
    summary: 'Flight-first planning, fare confidence, stay discovery, and itinerary cards in one compact surface.',
    heroMetric: '72%',
    heroLabel: 'trip conversion after save',
    accent: '#3390EC',
    inspirations: ['MakeMyTrip', 'Instagram Reels', 'Snapchat maps'],
    actions: [
      { id: 'travel-flights', label: 'Flights', caption: 'Flexible fares', icon: 'airplane' },
      { id: 'travel-hotels', label: 'Hotels', caption: 'Shortlist stays', icon: 'bed-outline' },
      { id: 'travel-fare', label: 'Fare watch', caption: 'Price alerts', icon: 'chart-line', badge: 'AI' },
      { id: 'travel-buddies', label: 'Trip squads', caption: 'Match partners', icon: 'account-group-outline' },
    ],
    highlights: ['Tap-in itinerary cards', 'Budget-aware route suggestions', 'Trip chat and live plan sharing'],
  },
  {
    id: 'section-food',
    kind: 'food',
    title: 'Food stack',
    summary: 'Delivery urgency, dine-out confidence, live status, and split-pay flows tuned for fast decisions.',
    heroMetric: '11 min',
    heroLabel: 'median reorder time',
    accent: '#FF8268',
    inspirations: ['Zomato', 'Swiggy', 'Instagram Stories'],
    actions: [
      { id: 'food-delivery', label: 'Delivery', caption: 'Quick reorder', icon: 'bike-fast' },
      { id: 'food-dineout', label: 'Dine out', caption: 'Instant tables', icon: 'silverware-fork-knife' },
      { id: 'food-group', label: 'Group order', caption: 'Split bill', icon: 'account-multiple-outline' },
      { id: 'food-live', label: 'Live status', caption: 'Track prep', icon: 'progress-clock', badge: 'Now' },
    ],
    highlights: ['Restaurant reels', 'Menu-to-booking in one flow', 'Wallet-backed offers and cashback'],
  },
  {
    id: 'section-shopping',
    kind: 'shopping',
    title: 'Shopping stack',
    summary: 'Trend-led browsing, quick deal comparison, saved wardrobes, and reward loops for fashion and electronics.',
    heroMetric: '4.8x',
    heroLabel: 'save to purchase uplift',
    accent: '#54C8FF',
    inspirations: ['Amazon', 'Myntra', 'Flipkart'],
    actions: [
      { id: 'shopping-fashion', label: 'Fashion', caption: 'Styled drops', icon: 'hanger' },
      { id: 'shopping-tech', label: 'Tech', caption: 'Fast compare', icon: 'cellphone' },
      { id: 'shopping-wishlist', label: 'Wishlist', caption: 'Board and share', icon: 'heart-outline' },
      { id: 'shopping-flash', label: 'Flash sale', caption: 'Live deals', icon: 'lightning-bolt-outline', badge: 'Hot' },
    ],
    highlights: ['Outfit-first discovery', 'Deal-led cards', 'Pickup and cashback flows'],
  },
  {
    id: 'section-entertainment',
    kind: 'entertainment',
    title: 'Entertainment stack',
    summary: 'Movies, events, post-show plans, and ticket inventory merged into one social night-out layer.',
    heroMetric: '38k',
    heroLabel: 'seat views this week',
    accent: '#F8B84E',
    inspirations: ['District', 'Bookings apps', 'Snap-style moments'],
    actions: [
      { id: 'ent-movies', label: 'Movies', caption: 'Premium seats', icon: 'movie-open-outline' },
      { id: 'ent-events', label: 'Events', caption: 'Live tonight', icon: 'ticket-confirmation-outline' },
      { id: 'ent-night', label: 'Night plans', caption: 'After spots', icon: 'glass-cocktail' },
      { id: 'ent-social', label: 'Invite crew', caption: 'Share plans', icon: 'send-outline' },
    ],
    highlights: ['Seat-map style booking', 'Night itinerary chaining', 'Fast invite and group wallet split'],
  },
  {
    id: 'section-social',
    kind: 'social',
    title: 'Social stack',
    summary: 'Private chat, expressive updates, location-aware groups, and trip channels designed for planning together.',
    heroMetric: '96%',
    heroLabel: 'message delivery confidence',
    accent: '#4CD4B0',
    inspirations: ['Telegram', 'WhatsApp', 'Instagram', 'Snapchat'],
    actions: [
      { id: 'social-chat', label: 'Quick chat', caption: '1:1 plans', icon: 'message-text-outline' },
      { id: 'social-status', label: 'Moments', caption: 'Status cards', icon: 'circle-slice-8' },
      { id: 'social-groups', label: 'Trip rooms', caption: 'Mini communities', icon: 'account-group' },
      { id: 'social-live', label: 'Live share', caption: 'Location and ETA', icon: 'map-marker-radius-outline', badge: 'Live' },
    ],
    highlights: ['Compact inbox design', 'Story-like presence layer', 'Trip-specific coordination threads'],
  },
];

export const mockTravel: TravelItem[] = [
  {
    id: 'travel-1',
    type: 'flight',
    title: 'Bengaluru to Goa',
    subtitle: 'Early fare with cabin bag included',
    location: 'GOI',
    image:
      'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1200&q=80',
    price: 4899,
    rating: 4.6,
    duration: '1h 20m',
    tags: ['Best fare', 'Weekend escape'],
  },
  {
    id: 'travel-2',
    type: 'hotel',
    title: 'Arossim beach stay',
    subtitle: 'Breakfast, pool, airport transfer',
    location: 'South Goa',
    image:
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
    price: 7200,
    rating: 4.8,
    duration: 'per night',
    tags: ['4-star', 'Beachfront'],
  },
  {
    id: 'travel-3',
    type: 'trip',
    title: 'AI Goa itinerary',
    subtitle: 'Flights, stay, cafes, and nightlife bundled',
    location: 'Goa',
    image:
      'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1200&q=80',
    price: 16900,
    rating: 4.9,
    duration: '3 days',
    tags: ['Planned by Gozy AI', 'Group friendly'],
  },
];

export const mockRestaurants: Restaurant[] = [
  {
    id: 'rest-1',
    name: 'The Bowl Theory',
    cuisine: 'Healthy bowls, Asian',
    image:
      'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80',
    eta: '24 mins',
    rating: 4.7,
    distance: '2.1 km',
    priceForTwo: 'Rs 600 for two',
    offer: '40% off up to Rs 120',
    reviews: ['Fast delivery and fresh ingredients', 'Great for quick office lunches'],
    menu: [
      {
        id: 'menu-1',
        name: 'Korean paneer bowl',
        description: 'Sticky rice, gochujang paneer, pickled veg, sesame crunch.',
        price: 329,
        isVeg: true,
        popular: true,
      },
      {
        id: 'menu-2',
        name: 'Teriyaki chicken bowl',
        description: 'Charred chicken, steamed greens, egg, and teriyaki drizzle.',
        price: 369,
        isVeg: false,
      },
    ],
  },
  {
    id: 'rest-2',
    name: 'Biryani Social Club',
    cuisine: 'Biryani, kebabs',
    image:
      'https://images.unsplash.com/photo-1563379091339-03246963d29a?auto=format&fit=crop&w=1200&q=80',
    eta: '31 mins',
    rating: 4.5,
    distance: '3.8 km',
    priceForTwo: 'Rs 800 for two',
    offer: 'Free dessert on orders above Rs 699',
    reviews: ['Strong portions', 'The kebab combo is always reliable'],
    menu: [
      {
        id: 'menu-3',
        name: 'Hyderabadi chicken biryani',
        description: 'Long-grain rice, saffron masala, boiled egg, and salan.',
        price: 349,
        isVeg: false,
        popular: true,
      },
      {
        id: 'menu-4',
        name: 'Veg biryani family pack',
        description: 'Serves three with raita and mirchi ka salan.',
        price: 429,
        isVeg: true,
      },
    ],
  },
  {
    id: 'rest-3',
    name: 'Midnight Burger Lab',
    cuisine: 'Burgers, Desserts',
    image:
      'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1200&q=80',
    eta: '29 mins',
    rating: 4.6,
    distance: '1.8 km',
    priceForTwo: 'Rs 700 for two',
    offer: 'Free fries above Rs 499',
    reviews: ['Crispy fries and solid shakes', 'Reliable late-night delivery'],
    menu: [
      {
        id: 'menu-5',
        name: 'Double smash burger',
        description: 'Two patties, cheddar melt, house sauce, and potato bun.',
        price: 389,
        isVeg: false,
        popular: true,
      },
      {
        id: 'menu-6',
        name: 'Lotus biscoff shake',
        description: 'Cold thick shake with biscoff crumble and cream.',
        price: 229,
        isVeg: true,
      },
    ],
  },
];

export const mockProducts: Product[] = [
  {
    id: 'prod-1',
    name: 'Oversized utility shirt',
    brand: 'Gozy Studio',
    category: 'Fashion',
    image:
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80',
    price: 1899,
    originalPrice: 2599,
    rating: 4.6,
    badge: 'Trending',
    sizes: ['S', 'M', 'L', 'XL'],
  },
  {
    id: 'prod-2',
    name: 'Noise-cancel earbuds',
    brand: 'Waveform',
    category: 'Electronics',
    image:
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80',
    price: 3299,
    originalPrice: 4999,
    rating: 4.4,
    badge: 'Deal',
  },
  {
    id: 'prod-3',
    name: 'Clean runner sneakers',
    brand: 'Axis',
    category: 'Fashion',
    image:
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80',
    price: 2799,
    originalPrice: 3599,
    rating: 4.7,
    badge: 'Fast moving',
    sizes: ['7', '8', '9', '10'],
  },
  {
    id: 'prod-4',
    name: 'Barrier repair serum kit',
    brand: 'Luma Skin',
    category: 'Beauty',
    image:
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=1200&q=80',
    price: 1499,
    originalPrice: 2199,
    rating: 4.5,
    badge: 'Deal',
  },
];

export const mockEvents: EventListing[] = [
  {
    id: 'event-1',
    title: 'IMAX sci-fi premiere',
    venue: 'PVR IMAX Orion',
    date: 'Fri, 7:30 PM',
    genre: 'Movie',
    image:
      'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=80',
    rating: 4.8,
    price: 420,
  },
  {
    id: 'event-2',
    title: 'Sunset rooftop comedy set',
    venue: 'Indiranagar Social',
    date: 'Sat, 8:00 PM',
    genre: 'Live event',
    image:
      'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1200&q=80',
    rating: 4.5,
    price: 799,
  },
  {
    id: 'event-3',
    title: 'Indie synth live night',
    venue: 'Phoenix Arena',
    date: 'Sat, 9:00 PM',
    genre: 'Concert',
    image:
      'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1200&q=80',
    rating: 4.7,
    price: 1199,
  },
];

export const mockAssistantMessages: AssistantMessage[] = [
  {
    id: 'assistant-1',
    role: 'assistant',
    text: 'I can help you plan a Goa trip, find good food nearby, compare shopping deals, or build a Friday night plan.',
    chips: ['Plan my Goa trip', 'Best food near me', 'Weekend shopping deals'],
    createdAt: iso(-1),
  },
];

export const mockBootstrap: BootstrapPayload = {
  feed: mockFeed,
  matches: mockMatches,
  conversations: mockConversations,
  walletBalance: mockDashboard.walletBalance,
  transactions: mockTransactions,
  bookings: mockBookings,
  dashboard: mockDashboard,
  notifications: mockNotifications,
  recommendations: mockRecommendations,
  sections: mockSections,
  travel: mockTravel,
  restaurants: mockRestaurants,
  products: mockProducts,
  events: mockEvents,
  assistantMessages: mockAssistantMessages,
};

export const mockSession: Session = {
  token: 'gozy-dev-token',
  user: {
    id: 'user-gozy',
    name: 'Gozy Demo',
    email: 'demo@gozy.app',
    phone: '+91 9876543210',
    avatar:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    city: 'Bengaluru',
    interests: ['Travel', 'Food', 'Shopping'],
    budget: 'Rs 15k - 25k',
    homeAirport: 'BLR',
    preferredCategories: ['Travel', 'Food', 'Shopping'],
  },
};
