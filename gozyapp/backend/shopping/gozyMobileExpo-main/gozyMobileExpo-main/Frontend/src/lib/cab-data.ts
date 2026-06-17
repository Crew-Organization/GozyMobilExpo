import type {
  CabOffer,
  CabPartner,
  CabPolicyGroup,
  CabRecentSearch,
  CabSearchParams,
  CabSearchResult,
  CabTraveler,
  CabTripMode,
} from '@/src/types';

export const cabPartners: CabPartner[] = [
  { id: 'quick-ride', name: 'Quick Ride', accent: '#F6B73C' },
  { id: 'meru', name: 'MERU', accent: '#F4B400' },
  { id: 'megacabs', name: 'MegaCabs', accent: '#3760B8' },
  { id: 'transferz', name: 'transferz', accent: '#111827' },
  { id: 'gozo', name: 'GOZO', accent: '#F97316' },
  { id: 'savaari', name: 'SAVAARI', accent: '#0EA5E9' },
  { id: 'wti', name: 'WTi cabs', accent: '#2B3A8E' },
  { id: 'avis', name: 'AVIS', accent: '#D90429' },
];

export const cabModeTabs: {
  id: CabTripMode;
  label: string;
  icon: string;
}[] = [
  { id: 'outstation', label: 'Outstation\ntrips', icon: 'bag-suitcase-outline' },
  { id: 'airport', label: 'Airport\nTransfer', icon: 'airplane' },
  { id: 'hourly', label: 'Hourly\nRentals', icon: 'clock-outline' },
  { id: 'rail', label: 'Railway\nTransfers', icon: 'train' },
];

export const cabHeroPromos: Record<
  CabTripMode,
  {
    title: string;
    body: string;
    icon: string;
    tint: string;
  }
> = {
  outstation: {
    title: 'Clean and Quality cabs',
    body: 'Hygienic and sanitized rides from our trusted operators',
    icon: 'shield-check-outline',
    tint: '#DFF1FF',
  },
  airport: {
    title: 'Flight tracked pickup support',
    body: 'Cab waits smarter when your arrival time changes',
    icon: 'airplane-clock',
    tint: '#E9F7FF',
  },
  hourly: {
    title: 'Flexible city rentals',
    body: 'Keep the cab with you for errands, meetings, and local plans',
    icon: 'clock-time-eight-outline',
    tint: '#EEF8FF',
  },
  rail: {
    title: 'Railway transfer experts',
    body: 'Platform pickup ready with on-time city drop support',
    icon: 'train-car',
    tint: '#EAF5FF',
  },
};

export const cabRecentSearchesDefault: CabRecentSearch[] = [
  {
    id: 'recent-1',
    from: 'Andhra Pradesh',
    to: 'Kalyan, Maharashtra',
    dateLabel: '23 Apr 26',
  },
  {
    id: 'recent-2',
    from: 'Rajiv Gandhi International Airport',
    to: 'B.N Reddy Nagar',
    dateLabel: '23 Apr 26',
  },
];

export const cabOffersFeed = [
  {
    id: 'summer-sale',
    title: 'Grab Up to 40% OFF*',
    body: 'Save on summer trips across cabs, trains, stays and more.',
    cta: 'BOOK NOW',
    palette: ['#FFDFA8', '#FFFAEF'] as [string, string],
  },
  {
    id: 'premium-bank',
    title: 'Premium bank offers on rides',
    body: 'Extra cashback and lounge-style perks on selected cards.',
    cta: 'VIEW OFFER',
    palette: ['#D7F0FF', '#F7FCFF'] as [string, string],
  },
];

export const cabFaqs = [
  {
    id: 'faq-1',
    question: 'How can I book cheap cabs online?',
    answer:
      'Compare categories, review inclusions, and use the available coupon before payment to lower your total fare.',
  },
  {
    id: 'faq-2',
    question: 'Can I change my pickup after booking?',
    answer:
      'Yes, you can edit your route before payment in this prototype flow and review the revised fare details.',
  },
];

export const cabSortOptions = [
  'Price (Low to High)',
  'Price (High to Low)',
  'Ratings (Highest)',
];

export const cabPaymentOptions = [
  {
    id: 'upi',
    title: 'UPI Options',
    subtitle: 'Pay directly from your bank account',
    icon: 'cellphone-wireless',
  },
  {
    id: 'card',
    title: 'Credit and Debit Cards',
    subtitle: 'Visa, Mastercard, Amex, Rupay and more',
    icon: 'credit-card-outline',
  },
  {
    id: 'netbanking',
    title: 'Net Banking',
    subtitle: '40+ banks available',
    icon: 'bank-outline',
    badge: 'Fingerprint / Face ID',
  },
  {
    id: 'emi',
    title: 'EMI',
    subtitle: 'Credit, debit card and cardless EMI available',
    icon: 'cash-clock',
    badge: 'NO COST EMI',
  },
  {
    id: 'wallets',
    title: 'Gift Cards and e-wallets',
    subtitle: 'MMT gift cards and Amazon Pay',
    icon: 'wallet-giftcard',
  },
  {
    id: 'gpay',
    title: 'GooglePay',
    subtitle: 'Pay with GooglePay',
    icon: 'google',
  },
  {
    id: 'phonepe',
    title: 'PhonePe',
    subtitle: 'Pay with PhonePe',
    icon: 'alpha-p-circle',
  },
];

export const cabTestimonials = [
  {
    id: 'review-1',
    name: 'Ashok Kharbe',
    date: '23 Mar 2026',
    rating: '5.0',
    body: 'Cab driver Durki was professional, calm, and made the long route feel easy.',
  },
  {
    id: 'review-2',
    name: 'Anonymous',
    date: '01 Mar 2026',
    rating: '4.8',
    body: 'Smooth pickup coordination and enough luggage support for the whole family.',
  },
];

const cabPolicies: CabPolicyGroup[] = [
  {
    id: 'important-info',
    title: 'Important info',
    items: [
      {
        heading: 'Waiting Charges',
        body: 'Driver waits up to 20 minutes from your scheduled pickup time. After that, waiting charges may apply on mutual agreement.',
      },
      {
        heading: 'Driver Details',
        body: 'Driver and cab details are shared before departure. Contact support if a different vehicle arrives.',
      },
      {
        heading: 'Luggage Policy',
        body: 'Baggage capacity varies by vehicle type. Add a roof carrier if you need extra space on long routes.',
      },
    ],
  },
  {
    id: 'cancellation',
    title: 'Cancellation',
    items: [
      {
        heading: 'Penalty',
        body: 'Free cancellation up to 1 hour before departure. Later cancellations are non-refundable.',
      },
      {
        heading: 'Support',
        body: 'Use your trips section or the booking message link to request cancellation support.',
      },
    ],
  },
];

const baseCabOffers: CabOffer[] = [
  {
    id: 'wagonr',
    vehicleName: 'WagonR, Swift',
    similarLabel: 'or similar',
    vehicleType: 'Hatchback',
    energyType: 'Diesel',
    seats: 4,
    bags: 2,
    ac: true,
    rating: 4.3,
    price: 17664,
    originalPrice: 20446,
    taxesAndCharges: 979,
    partnerId: 'savaari',
    cancellationLabel: 'Free cancellation till 1 hr of departure',
    inclusions: [
      '872 Km included. Extra charges apply after included kms.',
      'Toll, state tax, parking charges and driver allowance included.',
      'Fuel cost for the trip is included in the fare.',
    ],
  },
  {
    id: 'dzire',
    vehicleName: 'Dzire, Etios',
    similarLabel: 'or similar',
    vehicleType: 'Sedan',
    energyType: 'Diesel',
    seats: 4,
    bags: 3,
    ac: true,
    rating: 4.5,
    price: 18024,
    originalPrice: 20862,
    taxesAndCharges: 997,
    partnerId: 'gozo',
    cancellationLabel: 'Free cancellation till 1 hr of departure',
    inclusions: [
      '872 Km included. Extra charges apply after included kms.',
      'Tax, toll and parking included.',
      'AC sedan with cleaner cabin and luggage support.',
    ],
  },
  {
    id: 'ertiga',
    vehicleName: 'Xylo, Ertiga',
    similarLabel: 'or similar',
    vehicleType: 'SUV',
    energyType: 'Diesel',
    seats: 6,
    bags: 3,
    ac: true,
    rating: 4.7,
    price: 31408,
    originalPrice: 35240,
    taxesAndCharges: 0,
    partnerId: 'savaari',
    cancellationLabel: 'Free cancellation till 1 hr of departure',
    inclusions: [
      '872 Km included. Rs 30.0/km will apply beyond included kms.',
      'Toll, tax and other charges are included.',
      'Driver allowance and fuel charges are included.',
    ],
  },
  {
    id: 'innova',
    vehicleName: 'Innova Crysta',
    similarLabel: 'or similar',
    vehicleType: 'SUV',
    energyType: 'Diesel',
    seats: 6,
    bags: 4,
    ac: true,
    rating: 4.9,
    price: 45401,
    originalPrice: 48990,
    taxesAndCharges: 0,
    partnerId: 'avis',
    cancellationLabel: 'Spacious family ride',
    inclusions: [
      'Premium SUV with generous luggage room.',
      'Intercity taxes and driver allowance included.',
      'Best for larger groups and long road trips.',
    ],
  },
];

export const defaultCabSearch: CabSearchParams = {
  tripMode: 'outstation',
  rideKind: 'round-trip',
  pickupLabel: 'Gugudu, Andhra Pradesh',
  dropLabel: 'Kalyan, Maharashtra',
  pickupDateTime: '2026-04-23T10:00:00',
  returnDateTime: '2026-04-24T10:00:00',
  distanceKm: 872,
  durationLabel: '18 hr(s) approx time',
};

export const defaultCabTraveler: CabTraveler = {
  fullName: 'Nikshitha',
  mobile: '9347556415',
  email: 'nikshithavadthyavath@gmail.com',
  gender: 'Female',
  usePickupAsBilling: true,
  flightNumber: '',
};

export function buildCabSearchResult(search: CabSearchParams): CabSearchResult {
  const offers =
    search.tripMode === 'airport'
      ? baseCabOffers.map((offer) =>
          offer.vehicleType === 'Premium'
            ? offer
            : {
                ...offer,
                price: Math.max(offer.price / 10, 1100),
                taxesAndCharges: Math.round(offer.taxesAndCharges / 2),
              },
        )
      : baseCabOffers;

  return {
    searchId: `cab-${search.pickupLabel.toLowerCase().replace(/\s+/g, '-')}`,
    partnerIds: cabPartners.map((partner) => partner.id),
    offers,
    coupon: {
      id: 'mmtdeal',
      code: 'MMTDEAL',
      description: 'Get flat Rs. 450 off on your cab booking.',
      savings: 450,
    },
    policyGroups: cabPolicies,
  };
}

export function formatCabCurrency(amount: number) {
  return `Rs ${amount.toLocaleString('en-IN')}`;
}

export function formatCabDateTime(dateTime: string) {
  const date = new Date(dateTime);
  return {
    day: date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }),
    time: date.toLocaleTimeString('en-IN', {
      hour: 'numeric',
      minute: '2-digit',
    }),
    weekday: date.toLocaleDateString('en-IN', { weekday: 'long' }),
    compact: date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
    }),
  };
}
