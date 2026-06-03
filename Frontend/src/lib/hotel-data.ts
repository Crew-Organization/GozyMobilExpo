import type { HotelOffer, HotelSearchParams, HotelRoom, HotelRules, HotelBookingPayload, HotelBookingConfirmation } from '@/src/types';

export const defaultHotelSearch: HotelSearchParams = {
  searchType: 'regular',
  city: 'Hyderabad',
  checkInDate: '2026-04-11',
  checkOutDate: '2026-04-12',
  guests: 2,
  rooms: 1,
};

const defaultRules: HotelRules = {
  checkInTime: '12:00 PM',
  checkOutTime: '11:00 AM',
  unmarriedCouplesAllowed: true,
  maleGroupsAllowed: true,
  idProofs: ['Aadhar Card', 'Passport', 'Driving License'],
  outsideFoodAllowed: true,
  petsAllowed: false,
  smokingAllowed: false,
  childPolicy: 'Children under 5 stay free using existing beds.',
  mustRead: [
    'Guests are required to present a valid photo ID upon check-in.',
    'Primary guest must be at least 18 years old to check-in.',
    'Unmarried couples are welcome (except where local restrictions apply).',
  ],
};

const makeMockRooms = (basePrice: number): HotelRoom[] => [
  {
    id: 'room-std',
    name: 'Standard Room',
    description: 'Comfortable stay with modern amenities, standard bed, and workstation.',
    price: basePrice,
    image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=500&auto=format&fit=crop&q=60',
    amenities: ['Free WiFi', 'Air Conditioning', 'Flat-screen TV', 'Electric Kettle', '24/7 Room Service'],
    capacity: 2,
    sizeSqFt: 144,
    bedType: 'Queen Bed',
    bathroomCount: 1,
  },
  {
    id: 'room-studio',
    name: 'Studio Room',
    description: 'Spacious studio setup with kitchenette, lounge chairs, and views.',
    price: Math.round(basePrice * 1.4),
    image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=500&auto=format&fit=crop&q=60',
    amenities: ['Free WiFi', 'Air Conditioning', 'Kitchenette', 'Mini Fridge', 'Living Area', 'Balcony'],
    capacity: 3,
    sizeSqFt: 220,
    bedType: 'King Bed',
    bathroomCount: 1,
  },
];

export const mockHotels: HotelOffer[] = [
  {
    id: 'hotel-taj-deccan',
    name: 'Taj Deccan, Hyderabad',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&auto=format&fit=crop&q=60',
    images: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=500&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=500&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=500&auto=format&fit=crop&q=60',
    ],
    starRating: 5,
    rating: 4.5,
    ratingLabel: 'Excellent',
    reviewCount: 4120,
    location: 'Banjara Hills',
    area: 'Banjara Hills',
    price: 8490,
    taxes: 1528,
    originalPrice: 11000,
    highlights: ['10% Discount on Food', 'Spa & Steam', 'Near Hyderabad Central'],
    tags: ['Taj safety assurance', 'Premium Vibe', 'Couple Friendly'],
    amenities: ['Swimming Pool', 'Luxury Spa', 'Fitness Centre', 'Free Wi-Fi', 'Valet Parking', 'Bar', 'Fine Dining'],
    description: 'A stylish 5-star property offering rooms with panoramic city views, landscaped lawns, and unparalleled warm hospitality in the heart of Hyderabad.',
    rooms: makeMockRooms(8490),
    isLuxe: true,
    rules: {
      ...defaultRules,
      checkInTime: '2:00 PM',
      checkOutTime: '12:00 PM',
      petsAllowed: false,
    },
  },
  {
    id: 'hotel-the-park',
    name: 'The Park Hyderabad',
    image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=500&auto=format&fit=crop&q=60',
    images: [
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=500&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=500&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1611891404779-49615666a4f8?w=500&auto=format&fit=crop&q=60',
    ],
    starRating: 5,
    rating: 4.0,
    ratingLabel: 'Very Good',
    reviewCount: 3820,
    location: 'Somajiguda',
    area: 'Somajiguda',
    price: 7842,
    taxes: 2125,
    originalPrice: 9900,
    highlights: ['Lake view', 'Local cuisine', 'Infinity Pool'],
    tags: ['Scenic View', 'Art Deco Design', 'Nightlife Spot'],
    amenities: ['Infinity Pool', 'Spa', 'Nightclub', 'Lake View Rooms', 'Restaurant', 'Gym', 'Free Wi-Fi'],
    description: 'An iconic design hotel overlooking the scenic Hussain Sagar Lake, offering modern boutique luxury, signature dining, and vibrant nightlife.',
    rooms: makeMockRooms(7842),
    rules: {
      ...defaultRules,
      checkInTime: '2:00 PM',
      checkOutTime: '12:00 PM',
    },
  },
  {
    id: 'hotel-lemon-tree',
    name: 'Lemon Tree Hotel, Banjara Hills',
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=500&auto=format&fit=crop&q=60',
    images: [
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=500&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1568495248636-6432b97bd949?w=500&auto=format&fit=crop&q=60',
    ],
    starRating: 4,
    rating: 4.3,
    ratingLabel: 'Excellent',
    reviewCount: 2200,
    location: 'Banjara Hills',
    area: 'Banjara Hills',
    price: 4759,
    taxes: 1249,
    originalPrice: 6500,
    highlights: ['Citrus Cafe', 'Business Centre', 'Close to Mall'],
    tags: ['Business Travel', 'Clean Rooms', 'Fast Check-in'],
    amenities: ['Citrus Cafe', 'Fitness Centre', 'Meeting Rooms', 'Free Wi-Fi', 'Room Service'],
    description: 'A vibrant midscale business hotel designed for comfort and efficiency, strategically located close to commercial hotspots and shopping complexes.',
    rooms: makeMockRooms(4759),
    rules: defaultRules,
  },
  {
    id: 'hotel-oak-business',
    name: 'Oak Business Hotel',
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=500&auto=format&fit=crop&q=60',
    images: [
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=500&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=500&auto=format&fit=crop&q=60',
    ],
    starRating: 4,
    rating: 4.9,
    ratingLabel: 'Excellent',
    reviewCount: 920,
    location: 'Kondapur',
    area: 'Kondapur',
    price: 2697,
    taxes: 357,
    originalPrice: 3500,
    highlights: ['Near HITEC City', 'Complimentary Breakfast', 'Highly Rated Cleanliness'],
    tags: ['Tech Hub Proximity', 'Top Rated', 'Value Deal'],
    amenities: ['Complimentary Breakfast', 'Free Wi-Fi', 'Free Parking', 'Doctor on Call', 'Smart TV'],
    description: 'Exceptional service and contemporary rooms make this the preferred choice for business travelers visiting IT parks in HITEC City and Gachibowli.',
    rooms: makeMockRooms(2697),
    rules: defaultRules,
  },
  {
    id: 'hotel-radisson-blu',
    name: 'Radisson Blu Plaza Hotel',
    image: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=500&auto=format&fit=crop&q=60',
    images: [
      'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=500&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=500&auto=format&fit=crop&q=60',
    ],
    starRating: 5,
    rating: 4.2,
    ratingLabel: 'Very Good',
    reviewCount: 3100,
    location: 'Banjara Hills',
    area: 'Banjara Hills',
    price: 7250,
    taxes: 790,
    originalPrice: 9500,
    highlights: ['Multi-cuisine Buffet', 'Dilkusha Grill', 'Excellent Location'],
    tags: ['Premium Spa', 'Couple Choice', 'Luxury Bedding'],
    amenities: ['Outdoor Pool', 'O2 Spa', 'Gym', 'Bar & Lounge', 'Business Lounge', 'Free Wi-Fi'],
    description: 'Nestled in upscale Banjara Hills, this hotel features sophisticated accommodations, superb dining choices, and a state-of-the-art spa.',
    rooms: makeMockRooms(7250),
    isLuxe: true,
    rules: defaultRules,
  },
  {
    id: 'hotel-celebrity-resort',
    name: 'Celebrity Resort',
    image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=500&auto=format&fit=crop&q=60',
    images: [
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=500&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=500&auto=format&fit=crop&q=60',
    ],
    starRating: 3,
    rating: 3.6,
    ratingLabel: 'Very Good',
    reviewCount: 780,
    location: 'Shamirpet',
    area: 'Shamirpet',
    price: 4844,
    taxes: 242,
    originalPrice: 6200,
    highlights: ['Huge Theme Resort', 'Bowling Alley & Games', 'Lush Green Gardens'],
    tags: ['Weekend Gateway', 'Family Resort', 'Lush Lawns'],
    amenities: ['Large Swimming Pool', 'Indoor & Outdoor Games', 'Bar', 'Banquet Hall', 'Restaurant', 'Free Parking'],
    description: 'A sprawling themed resort in Shamirpet ideal for families, corporate retreats, and couples looking to escape the city noise.',
    rooms: makeMockRooms(4844),
    isSponsored: true,
    rules: {
      ...defaultRules,
      outsideFoodAllowed: false,
    },
  },
  {
    id: 'hotel-sid-royale',
    name: 'SID Royale',
    image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=500&auto=format&fit=crop&q=60',
    images: [
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=500&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=500&auto=format&fit=crop&q=60',
    ],
    starRating: 4,
    rating: 4.3,
    ratingLabel: 'Excellent',
    reviewCount: 540,
    location: 'Gachibowli',
    area: 'Gachibowli',
    price: 1802,
    taxes: 251,
    originalPrice: 2400,
    highlights: ['Free cancellation & breakfast', 'RUSH DEAL', 'Fibre Internet'],
    tags: ['Co-living Space', 'Tech Park Access', 'Budget Choice'],
    amenities: ['High-speed Wi-Fi', 'Complimentary Breakfast', 'Common Kitchenette', 'Laundry Service', '24/7 Security'],
    description: 'A modern co-living private suite catering to techies and digital nomads, situated right in Gachibowli with quick access to Outer Ring Road.',
    rooms: makeMockRooms(1802),
    apartmentType: 'Private Room in a Serviced Apartment',
    rules: defaultRules,
  },
  {
    id: 'hotel-kove-stays',
    name: 'Kove Stays',
    image: 'https://images.unsplash.com/photo-1611891404779-49615666a4f8?w=500&auto=format&fit=crop&q=60',
    images: [
      'https://images.unsplash.com/photo-1611891404779-49615666a4f8?w=500&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=500&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=500&auto=format&fit=crop&q=60',
    ],
    starRating: 4,
    rating: 3.9,
    ratingLabel: 'Very Good',
    reviewCount: 310,
    location: 'Gachibowli',
    area: 'Gachibowli',
    price: 1410,
    taxes: 205,
    originalPrice: 2790,
    highlights: ['Price is 9% lower than usual', 'Near University of Hyderabad', 'Homely Atmosphere'],
    tags: ['Student Friendly', 'Quiet Locality', 'Clean Restrooms'],
    amenities: ['Free Wi-Fi', 'Smart TV', 'Hot Water Geyser', 'Homely Meals On Request', 'Common Lounge'],
    description: 'A cozy boutique guest stay offering modern bedrooms and warm services, located in a green and serene locality near UoH Gachibowli.',
    rooms: makeMockRooms(1410),
    rules: defaultRules,
  },
];

export const getaways = [
  { id: 'games', title: 'Games and Fun', subtitle: 'Resorts with activities', image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=300&auto=format&fit=crop&q=60' },
  { id: 'spa', title: 'Spa Serenity', subtitle: 'Relaxing wellness stays', image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=300&auto=format&fit=crop&q=60' },
  { id: 'steam', title: 'Steam Relaxation', subtitle: 'Sauna & wellness retreats', image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=300&auto=format&fit=crop&q=60' },
  { id: 'sky', title: 'Sky High Escape', subtitle: 'Penthouse & high-rise views', image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=300&auto=format&fit=crop&q=60' },
  { id: 'pool', title: 'Private Pool Villas', subtitle: 'Exclusive pool staycations', image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=300&auto=format&fit=crop&q=60' },
];

export const offers = [
  { id: 'offer-1', title: 'SAVE ON SUMMER TRIPS', subtitle: 'Grab Up to 40% OFF* on premium hotels across India.', code: 'MMTSMARTDEAL' },
  { id: 'offer-2', title: 'FIRST HOTEL OFFER', subtitle: 'Use WELCOMETRIP and get up to ₹1,000 flat cashback in wallet.', code: 'WELCOMETRIP' },
];

export const inlineCollections = [
  {
    title: 'Pet-Friendly Stays',
    description: 'Vacation spaces where your furry friends are welcome',
    items: ['hotel-taj-deccan', 'hotel-sid-royale'],
  },
  {
    title: 'Family Getaways',
    description: 'Resorts and stays packed with pools & child areas',
    items: ['hotel-celebrity-resort', 'hotel-the-park'],
  },
  {
    title: 'Heritage Stays',
    description: 'Elegant properties preserving architectural history',
    items: ['hotel-taj-deccan', 'hotel-the-park'],
  },
];

export const coupons = [
  { code: 'MMTSMARTDEAL', description: '₹297 Off on using MMTSMARTDEAL payment coupon code', amount: 297 },
  { code: 'WELCOMETRIP', description: '₹431 Off with New User welcome coupon', amount: 431 },
];

export function formatHotelDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    weekday: 'short',
  });
}

export function buildFallbackHotelConfirmation(
  payload: HotelBookingPayload,
  hotel: HotelOffer,
  room: HotelRoom,
  walletBalance: number,
): HotelBookingConfirmation {
  let discount = 0;
  if (payload.couponCode === 'MMTSMARTDEAL') {
    discount = 297;
  } else if (payload.couponCode === 'WELCOMETRIP') {
    discount = 431;
  }
  const insuranceCost = payload.tripSecure ? 29 * payload.guests : 0;
  const roomPrice = room.price;
  const roomTax = hotel.taxes;
  const total = roomPrice + roomTax + insuranceCost - discount;

  return {
    bookingId: `hotel-booking-${Date.now()}`,
    pnr: `HZ${Math.floor(100000 + Math.random() * 900000)}`,
    hotelName: hotel.name,
    roomName: room.name,
    checkIn: payload.checkIn,
    checkOut: payload.checkOut,
    guests: payload.guests,
    rooms: payload.rooms,
    amountPaid: total,
    savings: discount,
    paymentMethod: payload.paymentMethod,
    status: 'confirmed',
    walletBalance: payload.paymentMethod === 'wallet' ? Math.max(0, walletBalance - total) : walletBalance,
    summaryChips: [
      `${payload.rooms} Room`,
      `${payload.guests} Guests`,
      payload.tripSecure ? 'Trip Secured' : 'No Insurance',
    ],
    supportMessage: 'Your stay voucher, check-in instructions, and support are now available inside Gozy bookings.',
  };
}
