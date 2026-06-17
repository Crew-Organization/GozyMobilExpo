export type BusSortOption = 'departure' | 'fare' | 'rating' | 'duration';

export type BusFilterOption = 'all' | 'ac' | 'sleeper' | 'seater' | 'morning' | 'evening';

export type BusListing = {
  id: string;
  operator: string;
  operatorId?: string | null;
  isGovt?: boolean;
  busType: string;
  isAc: boolean;
  isSleeper: boolean;
  departureMinutes: number;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  rating: number;
  reviews: number;
  seatsLeft: number;
  price: number;
  originalPrice: number;
  amenities: string[];
  tags: string[];
  boardingPoints: number;
  droppingPoints: number;
  singleSeatsLeft?: number;
  isTripAssured?: boolean;
  hasFreeCancellation?: boolean;
};

const OPERATORS = [
  'VRL Travels',
  'SRS Travels',
  'Orange Tours',
  'Kallada Travels',
  'Parveen Travels',
  'Neeta Tours',
  'Jabbar Travels',
  'IntrCity SmartBus',
  'zingbus',
  'RedBus Express',
] as const;

const BUS_TYPES = [
  { label: 'AC Sleeper (2+1)', ac: true, sleeper: true },
  { label: 'AC Seater / Sleeper', ac: true, sleeper: true },
  { label: 'Volvo Multi-Axle AC', ac: true, sleeper: false },
  { label: 'AC Seater (2+2)', ac: true, sleeper: false },
  { label: 'Non-AC Sleeper', ac: false, sleeper: true },
  { label: 'Non-AC Seater', ac: false, sleeper: false },
] as const;

const AMENITY_POOL = ['WiFi', 'USB Charging', 'Water Bottle', 'Blanket', 'Live Tracking', 'CCTV'];

const TAG_POOL = ['Women Friendly', 'Flash Deal', 'Best Price', 'On Time', 'New Bus'];

function hashRoute(from: string, to: string, dateKey: string): number {
  const raw = `${from}|${to}|${dateKey}`;
  let hash = 0;
  for (let i = 0; i < raw.length; i++) {
    hash = (hash << 5) - hash + raw.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function pseudoRandom(seed: number, index: number): number {
  const x = Math.sin(seed * 9999 + index * 7919) * 10000;
  return x - Math.floor(x);
}

function minutesToTime(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60) % 24;
  const minutes = totalMinutes % 60;
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHour = hours % 12 === 0 ? 12 : hours % 12;
  return `${displayHour}:${minutes.toString().padStart(2, '0')} ${period}`;
}

function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
}

export function searchBusListings(from: string, to: string, date: Date): BusListing[] {
  const dateKey = date.toISOString().slice(0, 10);
  const seed = hashRoute(from, to, dateKey);
  const count = 10 + (seed % 4);

  const listings: BusListing[] = [];

  for (let i = 0; i < count; i++) {
    const operator = OPERATORS[(seed + i) % OPERATORS.length];
    const type = BUS_TYPES[(seed + i * 3) % BUS_TYPES.length];
    const departMinutes = 300 + Math.floor(pseudoRandom(seed, i) * 1080);
    const tripMinutes = 240 + Math.floor(pseudoRandom(seed, i + 50) * 600);
    const arriveMinutes = departMinutes + tripMinutes;
    const baseFare = 450 + Math.floor(pseudoRandom(seed, i + 100) * 2200);
    const discount = Math.floor(pseudoRandom(seed, i + 200) * 280);
    const seatsLeft = 3 + Math.floor(pseudoRandom(seed, i + 300) * 28);
    const rating = 3.6 + pseudoRandom(seed, i + 400) * 1.3;
    const reviews = 80 + Math.floor(pseudoRandom(seed, i + 500) * 4200);

    const amenityCount = 3 + Math.floor(pseudoRandom(seed, i + 600) * 3);
    const amenities = AMENITY_POOL.slice(0, amenityCount);
    const tags: string[] = [];
    if (pseudoRandom(seed, i + 700) > 0.55) tags.push(TAG_POOL[(seed + i) % TAG_POOL.length]);
    if (type.ac && pseudoRandom(seed, i + 800) > 0.6) tags.push('AC');

    listings.push({
      id: `${seed}-${i}`,
      operator,
      busType: type.label,
      isAc: type.ac,
      isSleeper: type.sleeper,
      departureMinutes: departMinutes,
      departureTime: minutesToTime(departMinutes),
      arrivalTime: minutesToTime(arriveMinutes),
      duration: formatDuration(tripMinutes),
      rating: Math.round(rating * 10) / 10,
      reviews,
      seatsLeft,
      price: baseFare - discount,
      originalPrice: baseFare,
      amenities,
      tags,
      boardingPoints: 2 + Math.floor(pseudoRandom(seed, i + 900) * 5),
      droppingPoints: 2 + Math.floor(pseudoRandom(seed, i + 1000) * 4),
      singleSeatsLeft: Math.floor(pseudoRandom(seed, i + 1100) * 8),
      isTripAssured: pseudoRandom(seed, i + 1200) > 0.5,
      hasFreeCancellation: pseudoRandom(seed, i + 1300) > 0.5,
    });
  }

  return listings.sort((a, b) => a.departureMinutes - b.departureMinutes);
}

export function sortBusListings(listings: BusListing[], sortBy: BusSortOption): BusListing[] {
  const sorted = [...listings];
  if (sortBy === 'fare') sorted.sort((a, b) => a.price - b.price);
  else if (sortBy === 'rating') sorted.sort((a, b) => b.rating - a.rating);
  else if (sortBy === 'duration') {
    sorted.sort((a, b) => {
      const parse = (value: string) => {
        const match = value.match(/(\d+)h?\s*(\d+)?m?/);
        if (!match) return 0;
        return Number(match[1]) * 60 + Number(match[2] ?? 0);
      };
      return parse(a.duration) - parse(b.duration);
    });
  } else {
    sorted.sort((a, b) => a.departureMinutes - b.departureMinutes);
  }
  return sorted;
}

export function filterBusListings(listings: BusListing[], filter: BusFilterOption): BusListing[] {
  if (filter === 'all') return listings;
  if (filter === 'ac') return listings.filter((bus) => bus.isAc);
  if (filter === 'sleeper') return listings.filter((bus) => bus.isSleeper);
  if (filter === 'seater') return listings.filter((bus) => !bus.isSleeper);
  if (filter === 'morning') return listings.filter((bus) => bus.departureMinutes < 720);
  return listings.filter((bus) => bus.departureMinutes >= 720);
}

export function formatBusFare(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`;
}
