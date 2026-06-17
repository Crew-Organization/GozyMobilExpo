export interface HotelRoom {
  id: string;
  name: string;
  price: number;
  sizeSqFt: number;
  bedType: string;
  image: string;
  bathroomCount?: number;
  capacity?: number;
  amenities?: string[];
}

export interface HotelOffer {
  id: string;
  name: string;
  location: string;
  area: string;
  description: string;
  rating: number;
  ratingLabel: string;
  reviewCount: number;
  starRating: number;
  price: number;
  taxes: number;
  isLuxe: boolean;
  images: string[];
  amenities: string[];
  rooms: HotelRoom[];
  image?: string;
  isSponsored?: boolean;
  badge?: string;
  apartmentType?: string;
  highlights?: string[];
  originalPrice?: number;
}

export const mockHotels: HotelOffer[] = [
  {
    id: 'hotel-1',
    name: 'The Grand Gozy Resort & Spa',
    location: 'Banjara Hills',
    area: 'Road No. 1',
    description: 'A luxurious resort offering world-class amenities, premium spa treatments, and state-of-the-art rooms overlooking the city skyline. Perfect for business and leisure travelers alike.',
    rating: 4.8,
    ratingLabel: 'Excellent',
    reviewCount: 1240,
    starRating: 5,
    price: 5499,
    originalPrice: 7999,
    taxes: 825,
    isLuxe: true,
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80',
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=80',
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80',
    ],
    amenities: ['Free WiFi', 'Air Conditioning', 'Swimming Pool', 'Spa', 'Gym', 'Restaurant', '24/7 Room Service', 'Couple Friendly'],
    isSponsored: true,
    badge: 'Trending',
    apartmentType: 'Resort',
    highlights: ['Spa & Salon', 'Infinity Pool', 'Fine Dining'],
    rooms: [
      {
        id: 'room-1-1',
        name: 'Deluxe King Room',
        price: 5499,
        sizeSqFt: 350,
        bedType: 'King Bed',
        image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=500&q=80',
        bathroomCount: 1,
        capacity: 2,
        amenities: ['TV', 'Mini Bar', 'Bathtub'],
      },
      {
        id: 'room-1-2',
        name: 'Club Executive Suite',
        price: 8999,
        sizeSqFt: 550,
        bedType: 'Super King Bed',
        image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=500&q=80',
        bathroomCount: 2,
        capacity: 3,
        amenities: ['TV', 'Jacuzzi', 'Espresso Maker'],
      },
    ],
  },
  {
    id: 'hotel-2',
    name: 'Park View Boutique Hotel',
    location: 'Gachibowli',
    area: 'IT Corridor',
    description: 'Modern boutique hotel with elegant decor, cozy ambiance, and located near major IT parks. Features high-speed internet and complimentary continental breakfast.',
    rating: 4.3,
    ratingLabel: 'Very Good',
    reviewCount: 850,
    starRating: 4,
    price: 3299,
    originalPrice: 4999,
    taxes: 495,
    isLuxe: false,
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80',
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=80',
    ],
    amenities: ['Free WiFi', 'Air Conditioning', 'Gym', 'Restaurant', 'Lift', 'Doctor on Call'],
    isSponsored: false,
    badge: 'Popular',
    apartmentType: 'Boutique Hotel',
    highlights: ['IT Hub Proximity', 'Gym Access'],
    rooms: [
      {
        id: 'room-2-1',
        name: 'Standard Queen Room',
        price: 3299,
        sizeSqFt: 280,
        bedType: 'Queen Bed',
        image: 'https://images.unsplash.com/photo-1591088398332-8a7791972843?w=500&q=80',
        bathroomCount: 1,
        capacity: 2,
        amenities: ['TV', 'Work Desk'],
      },
    ],
  },
  {
    id: 'hotel-3',
    name: 'The Monsoon Inn',
    location: 'Secunderabad',
    area: 'Near Junction',
    description: 'Comfortable and affordable lodging with basic amenities, clean sheets, and friendly customer service. Easy accessibility to transit points.',
    rating: 3.9,
    ratingLabel: 'Good',
    reviewCount: 420,
    starRating: 3,
    price: 1899,
    originalPrice: 2499,
    taxes: 285,
    isLuxe: false,
    image: 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800&q=80',
    ],
    amenities: ['Free WiFi', 'Air Conditioning', 'Lift', '24/7 Room Service', 'CCTV'],
    isSponsored: false,
    badge: 'Value',
    apartmentType: 'Budget Hotel',
    highlights: ['Near Station', 'Free Cancellation'],
    rooms: [
      {
        id: 'room-3-1',
        name: 'Standard Single Room',
        price: 1899,
        sizeSqFt: 200,
        bedType: 'Single Bed',
        image: 'https://images.unsplash.com/photo-1611048267451-e6ed903d4a38?w=500&q=80',
        bathroomCount: 1,
        capacity: 1,
        amenities: ['TV'],
      },
    ],
  },
];

export const coupons = [
  { code: 'GOZYWELCOME', amount: 500, description: 'Flat ₹500 off on your first hotel booking.' },
  { code: 'EORSHOTEL', amount: 800, description: 'Exclusive End Of Reason Sale discount of ₹800.' },
  { code: 'MONSOONGETAWAY', amount: 1000, description: 'Monsoon special: ₹1000 off on selected resorts.' },
];

export const offers = [
  { code: 'GOZYWELCOME', title: 'Welcome Offer', subtitle: 'Flat ₹500 off on your first booking' },
];

export const getaways = [
  { id: 'get-1', title: 'Ananthagiri Hills', subtitle: 'Lush greenery & forest treks', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=80' },
  { id: 'get-2', title: 'Pocharam Dam', subtitle: 'Bird watching & scenic lake view', image: 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?w=400&q=80' },
];

export const inlineCollections = [
  { title: 'Couple Friendly Stays', description: 'Handpicked romantic getaways' },
  { title: 'IT District Top Rated', description: 'Convenient business hotels with high speed WiFi' },
];

export function formatHotelDate(dateKey: string | Date): string {
  if (!dateKey) return '';
  const date = typeof dateKey === 'string' ? new Date(dateKey) : dateKey;
  if (isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}
