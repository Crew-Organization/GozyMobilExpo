export type Category = 'Travel' | 'Food' | 'Shopping' | 'Entertainment';

export type SwipeDirection = 'left' | 'right';

export type Experience = {
  id: string;
  category: Category;
  title: string;
  subtitle: string;
  location: string;
  description: string;
  posterUrl: string;
  videoUrl: string;
  tags: string[];
  priceLabel: string;
  rating: number;
  distanceKm: number;
  vibe: string;
  duration: string;
  brandCue: string;
  cta: string;
};

export type TravelItem = {
  id: string;
  type: 'flight' | 'hotel' | 'trip';
  title: string;
  subtitle: string;
  location: string;
  image: string;
  price: number;
  rating: number;
  duration: string;
  tags: string[];
};

export type TravelModule = 'Flights' | 'Hotels' | 'Packages' | 'Bus';

export type TravelTripType = 'one-way' | 'round-trip';

export type TravelCabinClass = 'Economy' | 'Premium Economy' | 'Business';

export type TravelSearchParams = {
  module: TravelModule;
  tripType: TravelTripType;
  originCity: string;
  originCode: string;
  destinationCity: string;
  destinationCode: string;
  departureDate: string;
  returnDate?: string;
  travellers: number;
  cabinClass: TravelCabinClass;
  nonStop: boolean;
};

export type TravelOffer = {
  id: string;
  airline: string;
  airlineCode: string;
  flightNumber: string;
  departTime: string;
  arriveTime: string;
  duration: string;
  stops: string;
  fromTerminal?: string;
  toTerminal?: string;
  badge?: string;
  price: number;
  originalPrice: number;
  seatsLeft: number;
  cabinBag: string;
  checkInBag: string;
  refundLabel: string;
  onTimeLabel: string;
  emissionsLabel: string;
  tags: string[];
};

export type TravelAddOn = {
  id: string;
  title: string;
  subtitle: string;
  price: number;
};

export type TravelPriceInsight = {
  confidenceLabel: string;
  trendLabel: string;
  averageFare: number;
};

export type TravelSearchResult = {
  searchId: string;
  routeLabel: string;
  summary: string;
  aiTip: string;
  priceInsight: TravelPriceInsight;
  addOns: TravelAddOn[];
  offers: TravelOffer[];
};

export type TravelTraveler = {
  fullName: string;
  age: string;
  gender: 'Male' | 'Female' | 'Other';
};

export type TravelContact = {
  phone: string;
  email: string;
};

export type TravelPaymentMethod = 'wallet' | 'upi' | 'card';

export type TravelBookingPayload = {
  search: TravelSearchParams;
  offerId: string;
  travelers: TravelTraveler[];
  contact: TravelContact;
  addOnIds: string[];
  paymentMethod: TravelPaymentMethod;
};

export type TravelBookingConfirmation = {
  bookingId: string;
  pnr: string;
  title: string;
  route: string;
  departureDate: string;
  amountPaid: number;
  paymentMethod: TravelPaymentMethod;
  travelers: number;
  status: 'confirmed';
  walletBalance: number;
  summaryChips: string[];
  supportMessage: string;
};

export type Address = {
  id: string;
  label: string;
  line1: string;
  line2: string;
  etaHint?: string;
};

export type OrderTrackingStep = {
  id: string;
  label: string;
  detail: string;
  state: 'done' | 'active' | 'pending';
};

export type CommercePaymentMethod = 'wallet' | 'upi' | 'card';

export type FoodOrderPayload = {
  restaurantId: string;
  items: CartItem[];
  address: Address;
  paymentMethod: CommercePaymentMethod;
  instructions?: string;
};

export type FoodOrderConfirmation = {
  orderId: string;
  restaurantName: string;
  eta: string;
  amountPaid: number;
  paymentMethod: CommercePaymentMethod;
  addressLabel: string;
  status: 'confirmed' | 'preparing' | 'out-for-delivery';
  trackingSteps: OrderTrackingStep[];
  supportMessage: string;
};

export type ShoppingOrderPayload = {
  items: CartItem[];
  address: Address;
  paymentMethod: CommercePaymentMethod;
};

export type ShoppingOrderConfirmation = {
  orderId: string;
  itemCount: number;
  amountPaid: number;
  paymentMethod: CommercePaymentMethod;
  addressLabel: string;
  deliveryDate: string;
  status: 'confirmed' | 'packed' | 'out-for-delivery';
  trackingSteps: OrderTrackingStep[];
  supportMessage: string;
};

export type EntertainmentBookingPayload = {
  eventId: string;
  seats: string[];
  paymentMethod: CommercePaymentMethod;
};

export type EntertainmentBookingConfirmation = {
  bookingId: string;
  eventTitle: string;
  venue: string;
  date: string;
  seats: string[];
  amountPaid: number;
  paymentMethod: CommercePaymentMethod;
  status: 'confirmed';
  supportMessage: string;
};

export type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  isVeg: boolean;
  popular?: boolean;
};

export type Restaurant = {
  id: string;
  name: string;
  cuisine: string;
  image: string;
  eta: string;
  rating: number;
  distance: string;
  priceForTwo: string;
  offer: string;
  reviews: string[];
  menu: MenuItem[];
};

export type Product = {
  id: string;
  name: string;
  brand: string;
  category: string;
  image: string;
  price: number;
  originalPrice: number;
  rating: number;
  badge?: string;
  sizes?: string[];
};

export type EventListing = {
  id: string;
  title: string;
  venue: string;
  date: string;
  genre: string;
  image: string;
  rating: number;
  price: number;
};

export type MatchProfile = {
  id: string;
  name: string;
  age: number;
  avatar: string;
  destination: string;
  location: string;
  budget: string;
  interests: string[];
  bio: string;
  nextTrip: string;
  compatibility: number;
  travelStyle: string;
};

export type Message = {
  id: string;
  senderId: string;
  text: string;
  kind: 'text';
  createdAt: string;
  pending?: boolean;
};

export type Conversation = {
  id: string;
  participantName: string;
  participantId: string;
  avatar: string;
  online: boolean;
  typing: boolean;
  lastActive: string;
  destination: string;
  unreadCount: number;
  lastMessage: string;
  messages: Message[];
};

export type WalletTransaction = {
  id: string;
  title: string;
  amount: number;
  createdAt: string;
  status: 'completed' | 'pending';
  type: 'credit' | 'debit';
  category: 'wallet' | 'booking' | 'cashback';
};

export type Booking = {
  id: string;
  experienceId: string;
  title: string;
  category: Category;
  location: string;
  date: string;
  guests: number;
  total: number;
  status: 'upcoming' | 'completed' | 'confirmed' | 'preparing' | 'packed' | 'out-for-delivery';
};

export type DashboardMetrics = {
  savedCount: number;
  tripCount: number;
  walletBalance: number;
  monthlySpend: number;
  streakDays: number;
  aiScore: number;
  budgetUsedPercent: number;
  savedPlaces: string[];
  recentActivity: string[];
};

export type UserProfile = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar: string;
  city: string;
  interests: string[];
  budget: string;
  homeAirport: string;
  preferredCategories: Category[];
};

export type AuthChannel = 'email' | 'phone';

export type AuthProvider = 'google' | 'microsoft' | 'apple';

export type AppNotification = {
  id: string;
  title: string;
  body: string;
  kind: 'chat' | 'booking' | 'match' | 'wallet' | 'recommendation';
  createdAt: string;
  read: boolean;
};

export type Session = {
  token: string;
  user: UserProfile;
};

export type CartItem = {
  id: string;
  sourceId: string;
  kind: 'food' | 'shopping';
  title: string;
  subtitle: string;
  image?: string;
  price: number;
  quantity: number;
};

export type AssistantMessage = {
  id: string;
  role: 'assistant' | 'user';
  text: string;
  chips?: string[];
  createdAt: string;
};

export type SectionAction = {
  id: string;
  label: string;
  caption: string;
  icon: string;
  badge?: string;
};

export type LifestyleSection = {
  id: string;
  kind: 'travel' | 'food' | 'shopping' | 'entertainment' | 'social';
  title: string;
  summary: string;
  heroMetric: string;
  heroLabel: string;
  accent: string;
  inspirations: string[];
  actions: SectionAction[];
  highlights: string[];
};

export type BootstrapPayload = {
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
};
