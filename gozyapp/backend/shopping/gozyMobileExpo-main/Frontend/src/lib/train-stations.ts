export type TrainStation = {
  code: string;
  name: string;
  city: string;
  state: string;
};

type RemoteTrainStation = {
  station_code: string;
  station_name: string;
  region_code: string;
};

const REMOTE_STATION_DATA_URL =
  'https://raw.githubusercontent.com/vstflugel/indian-railway-dataset/main/list_of_stations.json';

let stationCache: TrainStation[] | null = null;

function normalizeLabel(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function deriveStationCity(stationName: string) {
  const cleanedName = stationName
    .toUpperCase()
    .replace(/\b(RAILWAY\s+STATION|JUNCTION|JN|TERMINUS|TERMINAL|HALT|STATION|CANTT\.?|CANTONMENT|CENTRAL|CITY|ROAD|GATE|COURT|BAZAAR|BZR|TOWN)\b/g, ' ')
    .replace(/[(),.\-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (!cleanedName) {
    return stationName.toUpperCase();
  }

  return cleanedName;
}

function mapRemoteStation(record: RemoteTrainStation): TrainStation {
  const normalizedName = record.station_name.trim();
  return {
    code: record.station_code.trim(),
    name: normalizedName,
    city: deriveStationCity(normalizedName),
    state: record.region_code.trim(),
  };
}

function dedupeStations(stations: TrainStation[]) {
  const seen = new Map<string, TrainStation>();

  for (const station of stations) {
    const key = normalizeLabel(`${station.code}-${station.name}`);
    if (!seen.has(key)) {
      seen.set(key, station);
    }
  }

  return Array.from(seen.values()).sort((left, right) =>
    left.city.localeCompare(right.city) || left.name.localeCompare(right.name) || left.code.localeCompare(right.code),
  );
}

export const popularTrainStations: TrainStation[] = [
  { code: 'NDLS', name: 'New Delhi Railway Station', city: 'Delhi', state: 'Delhi' },
  { code: 'HWH', name: 'Kolkata Howrah Junction', city: 'Kolkata', state: 'West Bengal' },
  { code: 'KYN', name: 'Kalyan Junction', city: 'Mumbai', state: 'Maharashtra' },
  { code: 'MAS', name: 'Chennai Central Railway Station', city: 'Chennai', state: 'Tamil Nadu' },
  { code: 'SC', name: 'Secunderabad Junction', city: 'Hyderabad', state: 'Telangana' },
  { code: 'SBC', name: 'Bangalore City Junction', city: 'Bangalore', state: 'Karnataka' },
  { code: 'PUNE', name: 'Pune Junction', city: 'Pune', state: 'Maharashtra' },
  { code: 'ADI', name: 'Ahmedabad Junction', city: 'Ahmedabad', state: 'Gujarat' },
  { code: 'PNBE', name: 'Patna Junction', city: 'Patna', state: 'Bihar' },
  { code: 'JP', name: 'Jaipur Railway Junction', city: 'Jaipur', state: 'Rajasthan' },
  { code: 'BCT', name: 'Mumbai Central', city: 'Mumbai', state: 'Maharashtra' },
  { code: 'CSMT', name: 'Chhatrapati Shivaji Terminus', city: 'Mumbai', state: 'Maharashtra' },
  { code: 'LKO', name: 'Lucknow Junction', city: 'Lucknow', state: 'Uttar Pradesh' },
  { code: 'AGC', name: 'Agra Cantt', city: 'Agra', state: 'Uttar Pradesh' },
];

export async function loadTrainStations() {
  if (stationCache) {
    return stationCache;
  }

  try {
    const response = await fetch(REMOTE_STATION_DATA_URL);
    if (!response.ok) {
      throw new Error('Station data request failed');
    }

    const payload = (await response.json()) as RemoteTrainStation[];
    const remoteStations = Array.isArray(payload) ? payload.map(mapRemoteStation) : [];
    stationCache = dedupeStations([...popularTrainStations, ...remoteStations]);
    return stationCache;
  } catch {
    stationCache = dedupeStations(popularTrainStations);
    return stationCache;
  }
}

export function stationCityLine(station: TrainStation) {
  if (!station.state) {
    return station.city;
  }

  return `${station.city}, ${station.state}`;
}

export function stationTitleLine(station: TrainStation) {
  return `${station.city} ${station.code}`;
}

export function filterStations(query: string, list = popularTrainStations) {
  const q = query.trim().toLowerCase();
  if (!q) return popularTrainStations;

  return list
    .filter((station) => {
      const searchable = [station.code, station.city, station.state, station.name]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return searchable.includes(q);
    })
    .sort((left, right) => {
      const leftScore = scoreStation(left, q);
      const rightScore = scoreStation(right, q);
      return leftScore - rightScore || left.city.localeCompare(right.city);
    });
}

export function findStationForLocation(location: string, list: TrainStation[] = popularTrainStations) {
  const target = normalizeLabel(location);
  if (!target) {
    return null;
  }

  return (
    list.find((station) => {
      const searchable = [station.city, station.name, station.code, station.state]
        .filter(Boolean)
        .map(normalizeLabel);

      return searchable.some((value) => value === target || value.includes(target) || target.includes(value));
    }) ?? null
  );
}

function scoreStation(station: TrainStation, query: string) {
  const code = station.code.toLowerCase();
  const city = station.city.toLowerCase();
  const state = station.state.toLowerCase();
  const name = station.name.toLowerCase();

  if (code === query) return 0;
  if (city === query) return 1;
  if (name === query) return 2;
  if (code.startsWith(query)) return 3;
  if (city.startsWith(query)) return 4;
  if (name.startsWith(query)) return 5;
  if (state.includes(query)) return 6;
  return 7;
}
