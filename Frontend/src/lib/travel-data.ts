import type {
  TravelAddOn,
  TravelBookingConfirmation,
  TravelOffer,
  TravelSearchParams,
  TravelSearchResult,
} from '@/src/types';

type TravelPreset = {
  aiTip: string;
  priceInsight: TravelSearchResult['priceInsight'];
  offers: TravelOffer[];
};

const sharedAddOns: TravelAddOn[] = [
  {
    id: 'gozy-protect',
    title: 'Gozy Protect',
    subtitle: 'Free date change plus instant support if your plan shifts.',
    price: 699,
  },
  {
    id: 'priority',
    title: 'Priority boarding',
    subtitle: 'Board early and secure cabin luggage space.',
    price: 349,
  },
  {
    id: 'seat-plus',
    title: 'Window seat bundle',
    subtitle: 'Seat selection and fast web check-in in one add-on.',
    price: 499,
  },
];

const travelPresets: Record<string, TravelPreset> = {
  'BLR-GOI': {
    aiTip:
      'Gozy AI recommends the early morning non-stop bank for Goa. It lands before hotel check-in traffic and usually protects more beach time for the same budget.',
    priceInsight: {
      confidenceLabel: 'High confidence',
      trendLabel: 'Fare stable for the next 18 hours',
      averageFare: 5420,
    },
    offers: [
      {
        id: 'offer-blr-goi-1',
        airline: 'IndiGo',
        airlineCode: '6E',
        flightNumber: '6E 2413',
        departTime: '06:20',
        arriveTime: '07:35',
        duration: '1h 15m',
        stops: 'Non-stop',
        fromTerminal: 'BLR T1',
        toTerminal: 'GOI T2',
        badge: 'Cheapest',
        price: 4899,
        originalPrice: 5620,
        seatsLeft: 5,
        cabinBag: '7 kg cabin',
        checkInBag: '15 kg check-in',
        refundLabel: 'Zero cancellation available',
        onTimeLabel: '89% on-time',
        emissionsLabel: '11% lower CO2',
        tags: ['Fastest morning slot', 'Meal add-on available'],
      },
      {
        id: 'offer-blr-goi-2',
        airline: 'Air India Express',
        airlineCode: 'IX',
        flightNumber: 'IX 1842',
        departTime: '09:10',
        arriveTime: '10:35',
        duration: '1h 25m',
        stops: 'Non-stop',
        fromTerminal: 'BLR T2',
        toTerminal: 'GOI T1',
        badge: 'Most booked',
        price: 5299,
        originalPrice: 5980,
        seatsLeft: 3,
        cabinBag: '7 kg cabin',
        checkInBag: '20 kg check-in',
        refundLabel: 'Flexi fare upgrade',
        onTimeLabel: '84% on-time',
        emissionsLabel: 'Smart leisure pick',
        tags: ['Better baggage', 'Popular for weekend trips'],
      },
      {
        id: 'offer-blr-goi-3',
        airline: 'Akasa Air',
        airlineCode: 'QP',
        flightNumber: 'QP 1732',
        departTime: '17:45',
        arriveTime: '19:05',
        duration: '1h 20m',
        stops: 'Non-stop',
        fromTerminal: 'BLR T1',
        toTerminal: 'GOI T2',
        badge: 'Evening favorite',
        price: 5740,
        originalPrice: 6400,
        seatsLeft: 7,
        cabinBag: '7 kg cabin',
        checkInBag: '15 kg check-in',
        refundLabel: 'Partial refund available',
        onTimeLabel: '91% on-time',
        emissionsLabel: 'Sunset arrival',
        tags: ['Good for post-work departures', 'Gozy AI pick'],
      },
    ],
  },
  'BOM-DXB': {
    aiTip:
      'The best value on this route is the late-night bank. It usually avoids surge pricing while still landing in time for hotel transfers and morning meetings.',
    priceInsight: {
      confidenceLabel: 'Medium confidence',
      trendLabel: 'Prices may rise after tonight',
      averageFare: 17840,
    },
    offers: [
      {
        id: 'offer-bom-dxb-1',
        airline: 'Emirates',
        airlineCode: 'EK',
        flightNumber: 'EK 507',
        departTime: '04:15',
        arriveTime: '05:55',
        duration: '3h 10m',
        stops: 'Non-stop',
        fromTerminal: 'BOM T2',
        toTerminal: 'DXB T3',
        badge: 'Premium value',
        price: 18250,
        originalPrice: 20990,
        seatsLeft: 4,
        cabinBag: '7 kg cabin',
        checkInBag: '25 kg check-in',
        refundLabel: 'Date change on select fares',
        onTimeLabel: '93% on-time',
        emissionsLabel: 'Smoothest connection-free option',
        tags: ['Best cabin experience', 'Airport lounge offer'],
      },
      {
        id: 'offer-bom-dxb-2',
        airline: 'IndiGo',
        airlineCode: '6E',
        flightNumber: '6E 1519',
        departTime: '23:40',
        arriveTime: '01:25',
        duration: '3h 15m',
        stops: 'Non-stop',
        fromTerminal: 'BOM T1',
        toTerminal: 'DXB T1',
        badge: 'Lowest today',
        price: 16990,
        originalPrice: 18940,
        seatsLeft: 6,
        cabinBag: '7 kg cabin',
        checkInBag: '20 kg check-in',
        refundLabel: 'Flexi add-on available',
        onTimeLabel: '87% on-time',
        emissionsLabel: 'Efficient overnight pick',
        tags: ['Late-night arrival', 'Good for short trips'],
      },
    ],
  },
  'DEL-BKK': {
    aiTip:
      'Bangkok works best when you land before noon. That keeps transfer time low and unlocks same-day city plans without burning the first day.',
    priceInsight: {
      confidenceLabel: 'High confidence',
      trendLabel: 'Cheapest this week',
      averageFare: 21480,
    },
    offers: [
      {
        id: 'offer-del-bkk-1',
        airline: 'Thai Airways',
        airlineCode: 'TG',
        flightNumber: 'TG 324',
        departTime: '01:10',
        arriveTime: '06:55',
        duration: '4h 15m',
        stops: 'Non-stop',
        fromTerminal: 'DEL T3',
        toTerminal: 'BKK T1',
        badge: 'Best overall',
        price: 21240,
        originalPrice: 23800,
        seatsLeft: 2,
        cabinBag: '7 kg cabin',
        checkInBag: '25 kg check-in',
        refundLabel: 'Flexi refund option',
        onTimeLabel: '92% on-time',
        emissionsLabel: 'Gozy recommended',
        tags: ['Strong baggage allowance', 'Smooth arrival timing'],
      },
      {
        id: 'offer-del-bkk-2',
        airline: 'AirAsia',
        airlineCode: 'AK',
        flightNumber: 'AK 882',
        departTime: '22:05',
        arriveTime: '03:40',
        duration: '4h 05m',
        stops: 'Non-stop',
        fromTerminal: 'DEL T3',
        toTerminal: 'BKK T2',
        badge: 'Budget',
        price: 19880,
        originalPrice: 22410,
        seatsLeft: 8,
        cabinBag: '7 kg cabin',
        checkInBag: '20 kg check-in',
        refundLabel: 'Gozy Protect recommended',
        onTimeLabel: '86% on-time',
        emissionsLabel: 'Budget-friendly',
        tags: ['Cheapest international pick', 'Late night departure'],
      },
    ],
  },
};

export const defaultTravelSearch: TravelSearchParams = {
  module: 'Flights',
  tripType: 'round-trip',
  originCity: 'Bengaluru',
  originCode: 'BLR',
  destinationCity: 'Goa',
  destinationCode: 'GOI',
  departureDate: '2026-04-11',
  returnDate: '2026-04-14',
  travellers: 2,
  cabinClass: 'Economy',
  nonStop: true,
};

export const travelQuickModules = [
  { id: 'Flights', label: 'Flights', caption: 'Cheapest fares', icon: 'airplane' },
  { id: 'Hotels', label: 'Hotels', caption: 'Premium stays', icon: 'bed-outline' },
  { id: 'Packages', label: 'Packages', caption: 'AI itineraries', icon: 'briefcase-outline' },
  { id: 'Bus', label: 'Bus', caption: 'Last-minute rides', icon: 'bus' },
] as const;

export const travelRoutePresets = [
  {
    label: 'Weekend Goa',
    search: defaultTravelSearch,
  },
  {
    label: 'Dubai work trip',
    search: {
      module: 'Flights',
      tripType: 'round-trip',
      originCity: 'Mumbai',
      originCode: 'BOM',
      destinationCity: 'Dubai',
      destinationCode: 'DXB',
      departureDate: '2026-04-18',
      returnDate: '2026-04-22',
      travellers: 1,
      cabinClass: 'Economy',
      nonStop: true,
    } as TravelSearchParams,
  },
  {
    label: 'Bangkok city break',
    search: {
      module: 'Flights',
      tripType: 'round-trip',
      originCity: 'Delhi',
      originCode: 'DEL',
      destinationCity: 'Bangkok',
      destinationCode: 'BKK',
      departureDate: '2026-05-02',
      returnDate: '2026-05-07',
      travellers: 2,
      cabinClass: 'Economy',
      nonStop: true,
    } as TravelSearchParams,
  },
];

export const travelBenefits = [
  {
    title: 'Zero convenience fee',
    body: 'Applied on your first Gozy flight booking this week.',
  },
  {
    title: 'AI fare watch',
    body: 'Gozy alerts you before likely price spikes on saved routes.',
  },
  {
    title: 'Trip protect',
    body: 'Keep flexible date changes and instant support inside the same flow.',
  },
];

export const travelMoments = [
  {
    title: 'South Goa beach stays',
    subtitle: 'Breakfast, pool, and airport transfer',
    priceLabel: 'from Rs 7,200',
  },
  {
    title: 'Quick visa-ready city breaks',
    subtitle: 'Compact international picks for long weekends',
    priceLabel: 'from Rs 19,880',
  },
  {
    title: 'AI-planned group escapes',
    subtitle: 'Flights, stays, and cafes in one trip card',
    priceLabel: 'from Rs 16,900',
  },
];

export function formatTravelDate(date: string) {
  return new Date(date).toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
}

export function formatCurrency(amount: number) {
  return `Rs ${amount.toLocaleString('en-IN')}`;
}

export function buildTravelSearchResult(search: TravelSearchParams): TravelSearchResult {
  const key = `${search.originCode}-${search.destinationCode}`;
  const preset = travelPresets[key] ?? travelPresets['BLR-GOI'];

  return {
    searchId: `travel-search-${key.toLowerCase()}`,
    routeLabel: `${search.originCode} -> ${search.destinationCode}`,
    summary: `${preset.offers.length} flights for ${search.originCity} to ${search.destinationCity}`,
    aiTip: preset.aiTip,
    priceInsight: preset.priceInsight,
    addOns: sharedAddOns,
    offers: preset.offers,
  };
}

export function buildFallbackTravelConfirmation(
  search: TravelSearchParams,
  offer: TravelOffer,
  addOnIds: string[],
  paymentMethod: TravelBookingConfirmation['paymentMethod'],
  walletBalance: number,
) {
  const addOnTotal = sharedAddOns
    .filter((item) => addOnIds.includes(item.id))
    .reduce((sum, item) => sum + item.price, 0);
  const total = offer.price + addOnTotal;

  return {
    bookingId: `booking-${Date.now()}`,
    pnr: `GZ${Math.floor(100000 + Math.random() * 900000)}`,
    title: `${offer.airline} ${offer.flightNumber}`,
    route: `${search.originCity} to ${search.destinationCity}`,
    departureDate: search.departureDate,
    amountPaid: total,
    paymentMethod,
    travelers: search.travellers,
    status: 'confirmed' as const,
    walletBalance: paymentMethod === 'wallet' ? Math.max(0, walletBalance - total) : walletBalance,
    summaryChips: [offer.stops, offer.cabinBag, `${search.travellers} travellers`],
    supportMessage: 'Your e-ticket, live status, and support are now available inside Gozy bookings.',
  };
}
