import type {
  Address,
  CommercePaymentMethod,
  EntertainmentBookingConfirmation,
  EventListing,
  FoodOrderConfirmation,
  OrderTrackingStep,
  Product,
  Restaurant,
  ShoppingOrderConfirmation,
} from '@/src/types';

export const savedAddresses: Address[] = [
  {
    id: 'addr-home',
    label: 'Home',
    line1: '12, Palm Residency',
    line2: 'Indiranagar, Bengaluru 560038',
    etaHint: 'Delivery-friendly gate access',
  },
  {
    id: 'addr-work',
    label: 'Work',
    line1: 'Aurora Tech Park',
    line2: 'MG Road, Bengaluru 560001',
    etaHint: 'Best for lunch and same-day parcels',
  },
];

export const paymentMethods: {
  id: CommercePaymentMethod;
  label: string;
  subtitle: string;
}[] = [
  {
    id: 'wallet',
    label: 'Gozy wallet',
    subtitle: 'Fastest checkout with in-app balance',
  },
  {
    id: 'upi',
    label: 'UPI',
    subtitle: 'Instant mock payment approval',
  },
  {
    id: 'card',
    label: 'Card',
    subtitle: 'Credit or debit card checkout',
  },
];

export const homeHeroBanners = [
  {
    id: 'hero-goa',
    eyebrow: 'Travel deal',
    title: 'Goa return fares + stay bundles',
    body: 'Early weekend departures, free date change, and AI-planned beach itineraries.',
    cta: 'Book getaway',
    route: '/travel',
    image:
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'hero-food',
    eyebrow: 'Food picks',
    title: 'Top-rated dinner spots near you',
    body: 'Compact menus, delivery confidence, and one-tap checkout built for fast decisions.',
    cta: 'Order food',
    route: '/food',
    image:
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'hero-fashion',
    eyebrow: 'Shopping drop',
    title: 'New fashion and tech deals tonight',
    body: 'Amazon-like browse speed with Myntra-style styling and Flipkart-style deal surfacing.',
    cta: 'Shop now',
    route: '/shopping',
    image:
      'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=1200&q=80',
  },
];

export const homeCarouselLabels = ['Trending', 'Recommended', 'Near You', 'Deals'] as const;

export const foodCuisines = ['All', 'Biryani', 'Bowls', 'Burgers', 'Desserts'] as const;

export const shoppingCategories = ['All', 'Fashion', 'Electronics', 'Beauty'] as const;

export const entertainmentFilters = ['Movies', 'Comedy', 'Concerts', 'Nightlife'] as const;

export const seatLayout = [
  ['A1', 'A2', 'A3', 'A4', 'A5', 'A6'],
  ['B1', 'B2', 'B3', 'B4', 'B5', 'B6'],
  ['C1', 'C2', 'C3', 'C4', 'C5', 'C6'],
];

const foodTracking = (eta: string): OrderTrackingStep[] => [
  { id: 'placed', label: 'Order placed', detail: 'Restaurant accepted your order', state: 'done' },
  { id: 'prep', label: 'Preparing', detail: 'Fresh batch on the line', state: 'active' },
  { id: 'rider', label: 'Rider assigned', detail: `Expected in ${eta}`, state: 'pending' },
];

const shoppingTracking = (date: string): OrderTrackingStep[] => [
  { id: 'confirmed', label: 'Order confirmed', detail: 'Seller accepted your order', state: 'done' },
  { id: 'packed', label: 'Packed', detail: 'Warehouse picked your items', state: 'active' },
  { id: 'ship', label: 'Out for delivery', detail: `Expected by ${date}`, state: 'pending' },
];

export function buildFoodFallbackConfirmation(
  restaurant: Restaurant,
  amountPaid: number,
  paymentMethod: CommercePaymentMethod,
  addressLabel: string,
): FoodOrderConfirmation {
  return {
    orderId: `food-order-${Date.now()}`,
    restaurantName: restaurant.name,
    eta: restaurant.eta,
    amountPaid,
    paymentMethod,
    addressLabel,
    status: 'preparing',
    trackingSteps: foodTracking(restaurant.eta),
    supportMessage: 'Your food order is live. Track prep, rider assignment, and ETA inside Gozy.',
  };
}

export function buildShoppingFallbackConfirmation(
  itemCount: number,
  amountPaid: number,
  paymentMethod: CommercePaymentMethod,
  addressLabel: string,
): ShoppingOrderConfirmation {
  const deliveryDate = 'Tue, 31 Mar';
  return {
    orderId: `shop-order-${Date.now()}`,
    itemCount,
    amountPaid,
    paymentMethod,
    addressLabel,
    deliveryDate,
    status: 'packed',
    trackingSteps: shoppingTracking(deliveryDate),
    supportMessage: 'Your order is packed and progressing through the delivery timeline.',
  };
}

export function buildEntertainmentFallbackConfirmation(
  event: EventListing,
  seats: string[],
  paymentMethod: CommercePaymentMethod,
): EntertainmentBookingConfirmation {
  return {
    bookingId: `event-booking-${Date.now()}`,
    eventTitle: event.title,
    venue: event.venue,
    date: event.date,
    seats,
    amountPaid: event.price * seats.length,
    paymentMethod,
    status: 'confirmed',
    supportMessage: 'Your seats are locked. QR entry and event reminders are now in Gozy.',
  };
}

export function buildProductPriceLabel(product: Product) {
  return `Rs ${product.price.toLocaleString('en-IN')}`;
}
