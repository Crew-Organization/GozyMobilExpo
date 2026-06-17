import { GOVT_BUS_OPERATORS, getGovtBusOperator, type GovtBusOperator } from '@/src/lib/govt-bus-operators';
import type { BusListing } from '@/src/lib/bus-search-data';
import { filterBusListings, sortBusListings, type BusFilterOption, type BusSortOption } from '@/src/lib/bus-search-data';

export type { BusFilterOption, BusSortOption };
export { filterBusListings, sortBusListings, formatBusFare } from '@/src/lib/bus-search-data';

export type GovtBusListing = BusListing & {
  operatorId: string;
  state: string;
  isGovt: true;
};

const GOVT_BUS_TYPES = [
  { label: 'Garuda / Rajdhani AC Seater', ac: true, sleeper: false },
  { label: 'Ultra Deluxe AC', ac: true, sleeper: false },
  { label: 'AC Sleeper (2+1)', ac: true, sleeper: true },
  { label: 'Super Express Non-AC', ac: false, sleeper: false },
  { label: 'Ordinary Express', ac: false, sleeper: false },
  { label: 'Volvo Multi-Axle AC', ac: true, sleeper: false },
] as const;

const GOVT_AMENITIES = [
  'Live Tracking',
  'Concession eligible',
  'Official RTC',
  'CCTV',
  'Rest stop',
  'Reserved seating',
];

const GOVT_TAGS = ['State Govt', 'Official RTC', 'Child concession', 'Senior concession', 'On Time'];

function hashRoute(from: string, to: string, dateKey: string, scope: string): number {
  const raw = `govt|${scope}|${from}|${to}|${dateKey}`;
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

function pickOperators(operatorId?: string): GovtBusOperator[] {
  if (operatorId) {
    const operator = getGovtBusOperator(operatorId);
    return operator ? [operator] : [];
  }
  return GOVT_BUS_OPERATORS;
}

function buildListing(
  seed: number,
  index: number,
  operator: GovtBusOperator,
): GovtBusListing {
  const type = GOVT_BUS_TYPES[(seed + index * 2) % GOVT_BUS_TYPES.length];
  const departMinutes = 280 + Math.floor(pseudoRandom(seed, index) * 1100);
  const tripMinutes = 200 + Math.floor(pseudoRandom(seed, index + 40) * 520);
  const arriveMinutes = departMinutes + tripMinutes;
  const baseFare = 180 + Math.floor(pseudoRandom(seed, index + 80) * 1400);
  const discount = Math.floor(pseudoRandom(seed, index + 120) * 120);
  const seatsLeft = 4 + Math.floor(pseudoRandom(seed, index + 160) * 32);
  const rating = Math.min(4.9, operator.rating + pseudoRandom(seed, index + 200) * 0.35 - 0.12);
  const reviews = 120 + Math.floor(pseudoRandom(seed, index + 240) * 2800);

  const amenityCount = 3 + Math.floor(pseudoRandom(seed, index + 280) * 3);
  const amenities = GOVT_AMENITIES.slice(0, amenityCount);
  const tags = ['State Govt', GOVT_TAGS[(seed + index) % GOVT_TAGS.length]];
  if (pseudoRandom(seed, index + 320) > 0.5) tags.push('Official RTC');

  return {
    id: `govt-${operator.id}-${seed}-${index}`,
    operator: operator.name,
    operatorId: operator.id,
    state: operator.state,
    isGovt: true,
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
    tags: [...new Set(tags)],
    boardingPoints: 2 + Math.floor(pseudoRandom(seed, index + 360) * 4),
    droppingPoints: 2 + Math.floor(pseudoRandom(seed, index + 400) * 3),
  };
}

/** Government / state RTC buses only — never private operators. */
export function searchGovtBusListings(
  from: string,
  to: string,
  date: Date,
  operatorId?: string,
): GovtBusListing[] {
  const operators = pickOperators(operatorId);
  if (!operators.length) return [];

  const dateKey = date.toISOString().slice(0, 10);
  const scope = operatorId ?? 'all-govt';
  const seed = hashRoute(from, to, dateKey, scope);
  const listings: GovtBusListing[] = [];

  if (operatorId) {
    const operator = operators[0];
    const count = 6 + (seed % 3);
    for (let i = 0; i < count; i++) {
      listings.push(buildListing(seed, i, operator));
    }
  } else {
    const operatorCount = 8 + (seed % 4);
    for (let i = 0; i < operatorCount; i++) {
      const operator = operators[(seed + i) % operators.length];
      listings.push(buildListing(seed, i, operator));
    }
  }

  return listings.sort((a, b) => a.departureMinutes - b.departureMinutes);
}
