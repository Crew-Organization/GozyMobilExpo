const GOVT_OPERATORS = [
  'APSRTC', 'KSRTC', 'MSRTC', 'TNSTC', 'UPSRTC', 'GSRTC', 'RSRTC', 'TSGTC',
  'HRTC', 'OSRTC', 'WBTC', 'DTC', 'PRTC', 'JSRTC', 'ASTC', 'UTC',
];

const PRIVATE_OPERATORS = [
  'VRL Travels', 'SRS Travels', 'Orange Tours', 'Kallada Travels', 'Parveen Travels',
  'Neeta Tours', 'Jabbar Travels', 'IntrCity SmartBus', 'zingbus', 'RedBus Express',
];

const BUS_TYPES = [
  { label: 'AC Sleeper (2+1)', ac: true, sleeper: true },
  { label: 'AC Seater / Sleeper', ac: true, sleeper: true },
  { label: 'Volvo Multi-Axle AC', ac: true, sleeper: false },
  { label: 'AC Seater (2+2)', ac: true, sleeper: false },
  { label: 'Non-AC Sleeper', ac: false, sleeper: true },
  { label: 'Non-AC Seater', ac: false, sleeper: false },
];

const GOVT_BUS_TYPES = [
  { label: 'Garuda / Rajdhani AC Seater', ac: true, sleeper: false },
  { label: 'Ultra Deluxe AC', ac: true, sleeper: true },
  { label: 'Super Express Non-AC', ac: false, sleeper: false },
  { label: 'Ordinary Express', ac: false, sleeper: false },
];

function hashRoute(from, to, dateKey, scope) {
  const raw = `${scope}|${from}|${to}|${dateKey}`;
  let hash = 0;
  for (let i = 0; i < raw.length; i++) {
    hash = (hash << 5) - hash + raw.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function hashSeed(input) {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function pseudoRandom(seed, index) {
  const x = Math.sin(seed * 9999 + index * 7919) * 10000;
  return x - Math.floor(x);
}

function minutesToTime(totalMinutes) {
  const hours = Math.floor(totalMinutes / 60) % 24;
  const minutes = totalMinutes % 60;
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHour = hours % 12 === 0 ? 12 : hours % 12;
  return `${displayHour}:${minutes.toString().padStart(2, '0')} ${period}`;
}

function formatDuration(minutes) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
}

function buildListing(seed, index, operator, types, isGovt, operatorId) {
  const type = types[(seed + index * 3) % types.length];
  const departMinutes = 300 + Math.floor(pseudoRandom(seed, index) * 1080);
  const tripMinutes = 240 + Math.floor(pseudoRandom(seed, index + 50) * 600);
  const baseFare = (isGovt ? 180 : 450) + Math.floor(pseudoRandom(seed, index + 100) * (isGovt ? 1400 : 2200));
  const discount = Math.floor(pseudoRandom(seed, index + 200) * (isGovt ? 120 : 280));
  const seatsLeft = 3 + Math.floor(pseudoRandom(seed, index + 300) * 28);
  const rating = 3.6 + pseudoRandom(seed, index + 400) * 1.3;

  return {
    id: `${isGovt ? 'govt' : 'bus'}-${seed}-${index}`,
    operator,
    operatorId: operatorId || null,
    busType: type.label,
    isAc: type.ac,
    isSleeper: type.sleeper,
    isGovt,
    departureMinutes: departMinutes,
    departureTime: minutesToTime(departMinutes),
    arrivalTime: minutesToTime(departMinutes + tripMinutes),
    duration: formatDuration(tripMinutes),
    rating: Math.round(rating * 10) / 10,
    reviews: 80 + Math.floor(pseudoRandom(seed, index + 500) * 4200),
    seatsLeft,
    price: baseFare - discount,
    originalPrice: baseFare,
    amenities: ['Live Tracking', 'USB Charging', 'Water Bottle'].slice(0, 3 + (index % 3)),
    tags: isGovt ? ['State Govt', 'Official RTC'] : ['Women Friendly', 'On Time'].slice(0, 1 + (index % 2)),
    boardingPoints: 2 + Math.floor(pseudoRandom(seed, index + 900) * 5),
    droppingPoints: 2 + Math.floor(pseudoRandom(seed, index + 1000) * 4),
  };
}

function searchBusInventory({ from, to, date, scope = 'all', operatorId }) {
  const dateKey = date.slice(0, 10);
  const isGovt = scope === 'govt';
  const seed = hashRoute(from, to, dateKey, operatorId || scope);
  const types = isGovt ? GOVT_BUS_TYPES : BUS_TYPES;
  const listings = [];

  if (isGovt && operatorId) {
    const operator =
      GOVT_OPERATORS.find((name) => name.toLowerCase().startsWith(operatorId.slice(0, 3))) ||
      operatorId.toUpperCase();
    const count = 6 + (seed % 3);
    for (let i = 0; i < count; i++) {
      listings.push(buildListing(seed, i, operator, types, true, operatorId));
    }
  } else if (isGovt) {
    const count = 8 + (seed % 4);
    for (let i = 0; i < count; i++) {
      listings.push(
        buildListing(seed, i, GOVT_OPERATORS[(seed + i) % GOVT_OPERATORS.length], types, true, null),
      );
    }
  } else {
    const count = 10 + (seed % 4);
    for (let i = 0; i < count; i++) {
      listings.push(
        buildListing(
          seed,
          i,
          PRIVATE_OPERATORS[(seed + i) % PRIVATE_OPERATORS.length],
          types,
          false,
          null,
        ),
      );
    }
  }

  listings.sort((a, b) => a.departureMinutes - b.departureMinutes);

  return {
    from,
    to,
    date: dateKey,
    scope,
    fetchedAt: new Date().toISOString(),
    listings,
  };
}

function seatStatus(seed, key, minuteBucket) {
  const value = pseudoRandom(
    seed + minuteBucket,
    key.split('').reduce((s, c) => s + c.charCodeAt(0), 0),
  );
  if (value > 0.88) return 'booked';
  if (value > 0.84) return value > 0.86 ? 'male_booked' : 'ladies_booked';
  if (value > 0.78) return 'ladies';
  if (value > 0.74) return 'male';
  return 'available';
}

function priceForRow(base, row, column) {
  const colAdd = column === 'A' ? 0 : column === 'C' ? 80 : 120;
  return base + row * 35 + colAdd + Math.floor(pseudoRandom(base, row) * 200);
}

function generateSeatLayout(busId, from, to, date, isSleeper, minuteBucket) {
  const seed = hashSeed(`${busId}|${from}|${to}|${date}`);
  const rows = isSleeper ? 5 : 8;
  const decks = isSleeper ? ['lower', 'upper'] : ['lower'];
  const basePrice = 1200 + (seed % 400);
  const seats = [];

  decks.forEach((deck) => {
    for (let row = 1; row <= rows; row++) {
      ['A', 'C', 'D'].forEach((column) => {
        const id = `${deck[0]}${row}${column}`;
        const key = `${deck}-${row}-${column}`;
        seats.push({
          id,
          row,
          column,
          deck,
          type: isSleeper ? 'sleeper' : 'seater',
          status: seatStatus(seed, key, minuteBucket),
          price: priceForRow(basePrice, row, column),
        });
      });
    }
  });

  const availableSeats = seats.filter(
    (s) => s.status === 'available' || s.status === 'ladies' || s.status === 'male',
  ).length;

  return {
    decks,
    seats,
    layout: isSleeper ? 'sleeper' : 'seater',
    availableSeats,
  };
}

function getBusSeatLayout({ busId, from, to, date, isSleeper = false, operator }) {
  const { getOperatorBusPhotos } = require('./operator-bus-media');
  const minuteBucket = Math.floor(Date.now() / 60000);
  const layout = generateSeatLayout(busId, from, to, date.slice(0, 10), isSleeper, minuteBucket);
  const media = operator ? getOperatorBusPhotos({ operator, busId }) : null;

  return {
    busId,
    from,
    to,
    date: date.slice(0, 10),
    fetchedAt: new Date().toISOString(),
    availableSeats: layout.availableSeats,
    decks: layout.decks,
    layout: layout.layout,
    seats: layout.seats,
    operatorPhotos: media?.photos ?? [],
    operatorMediaFetchedAt: media?.fetchedAt ?? null,
  };
}

module.exports = {
  searchBusInventory,
  getBusSeatLayout,
};
