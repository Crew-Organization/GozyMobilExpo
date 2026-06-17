export type BusCity = {
  name: string;
  state: string;
};

export const BUS_CITIES: BusCity[] = [
  { name: 'Bangalore', state: 'Karnataka' },
  { name: 'Hyderabad', state: 'Telangana' },
  { name: 'Chennai', state: 'Tamil Nadu' },
  { name: 'Pune', state: 'Maharashtra' },
  { name: 'Mumbai', state: 'Maharashtra' },
  { name: 'Delhi', state: 'Delhi' },
  { name: 'New Delhi', state: 'Delhi' },
  { name: 'Goa', state: 'Goa' },
  { name: 'Ahmedabad', state: 'Gujarat' },
  { name: 'Jaipur', state: 'Rajasthan' },
  { name: 'Kolkata', state: 'West Bengal' },
  { name: 'Lucknow', state: 'Uttar Pradesh' },
  { name: 'Indore', state: 'Madhya Pradesh' },
  { name: 'Bhopal', state: 'Madhya Pradesh' },
  { name: 'Nagpur', state: 'Maharashtra' },
  { name: 'Surat', state: 'Gujarat' },
  { name: 'Vadodara', state: 'Gujarat' },
  { name: 'Kochi', state: 'Kerala' },
  { name: 'Thiruvananthapuram', state: 'Kerala' },
  { name: 'Coimbatore', state: 'Tamil Nadu' },
  { name: 'Madurai', state: 'Tamil Nadu' },
  { name: 'Visakhapatnam', state: 'Andhra Pradesh' },
  { name: 'Vijayawada', state: 'Andhra Pradesh' },
  { name: 'Patna', state: 'Bihar' },
  { name: 'Chandigarh', state: 'Chandigarh' },
  { name: 'Dehradun', state: 'Uttarakhand' },
  { name: 'Shimla', state: 'Himachal Pradesh' },
  { name: 'Guwahati', state: 'Assam' },
  { name: 'Bhubaneswar', state: 'Odisha' },
  { name: 'Ranchi', state: 'Jharkhand' },
  { name: 'Raipur', state: 'Chhattisgarh' },
  { name: 'Mysuru', state: 'Karnataka' },
  { name: 'Mangalore', state: 'Karnataka' },
  { name: 'Hubli', state: 'Karnataka' },
  { name: 'Tirupati', state: 'Andhra Pradesh' },
  { name: 'Agra', state: 'Uttar Pradesh' },
  { name: 'Varanasi', state: 'Uttar Pradesh' },
  { name: 'Amritsar', state: 'Punjab' },
  { name: 'Jodhpur', state: 'Rajasthan' },
  { name: 'Udaipur', state: 'Rajasthan' },
];

export const POPULAR_BUS_CITY_NAMES = [
  'Bangalore',
  'Hyderabad',
  'Chennai',
  'Mumbai',
  'Delhi',
  'Pune',
  'Goa',
  'Ahmedabad',
];

export function filterBusCities(query: string, cities: BusCity[] = BUS_CITIES): BusCity[] {
  const q = query.trim().toLowerCase();
  if (!q) return cities;
  return cities.filter(
    (city) =>
      city.name.toLowerCase().includes(q) ||
      city.state.toLowerCase().includes(q) ||
      `${city.name} ${city.state}`.toLowerCase().includes(q),
  );
}

export function resolveBusCityName(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const match = BUS_CITIES.find((city) => city.name.toLowerCase() === trimmed.toLowerCase());
  return match?.name ?? null;
}

export function getBusCityNames(): string[] {
  return BUS_CITIES.map((city) => city.name);
}
