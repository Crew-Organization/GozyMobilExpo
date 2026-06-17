import type { ComponentProps } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export type CabTabId = 'outstation' | 'airport' | 'hourly' | 'railway';

export type CabTab = {
  id: CabTabId;
  label: string;
  icon: ComponentProps<typeof MaterialCommunityIcons>['name'];
};

export type CabRide = {
  id: string;
  name: string;
  model: string;
  rating: string;
  seats: string;
  fuel: 'Petrol' | 'Electric' | 'Diesel';
  vehicleIcon: ComponentProps<typeof MaterialCommunityIcons>['name'];
  price: string;
  tax: string;
  discount?: string;
  strikePrice?: string;
};

export const cabTabs: CabTab[] = [
  { id: 'outstation', label: 'Outstation\ntrips', icon: 'bag-suitcase-outline' },
  { id: 'airport', label: 'Airport\nTransfer', icon: 'airplane-takeoff' },
  { id: 'hourly', label: 'Hourly\nRentals', icon: 'car-clock' },
  { id: 'railway', label: 'Railway\nTransfers', icon: 'train-car' },
];

export const cabRides: CabRide[] = [
  {
    id: 'swift',
    name: 'Maruti Suzuki Swift',
    model: 'exact model',
    rating: '4.2/5',
    seats: '4 Seats',
    fuel: 'Petrol',
    vehicleIcon: 'car-hatchback',
    price: '735',
    tax: '428',
  },
  {
    id: 'tigor',
    name: 'Tata Tigor',
    model: 'exact model',
    rating: '4.5/5',
    seats: '4 Seats',
    fuel: 'Electric',
    vehicleIcon: 'car',
    price: '702',
    tax: '479',
    discount: '14% off',
    strikePrice: '820',
  },
  {
    id: 'mg-zs',
    name: 'MG ZS',
    model: 'exact model',
    rating: '4.8/5',
    seats: '4 Seats',
    fuel: 'Electric',
    vehicleIcon: 'car-hatchback',
    price: '1,002',
    tax: '467',
  },
  {
    id: 'byd',
    name: 'BYD eMAX 7',
    model: 'exact model',
    rating: '4.6/5',
    seats: '6 Seats',
    fuel: 'Electric',
    vehicleIcon: 'car-estate',
    price: '1,285',
    tax: '520',
    discount: '12% off',
    strikePrice: '1,465',
  },
  {
    id: 'innova',
    name: 'Toyota Innova...',
    model: 'exact model',
    rating: '5/5',
    seats: '6 Seats',
    fuel: 'Petrol',
    vehicleIcon: 'car-estate',
    price: '3,090',
    tax: '155',
  },
  {
    id: 'mercedes',
    name: 'Mercedes Ben...',
    model: 'exact model',
    rating: '4/5',
    seats: '4 Seats',
    fuel: 'Diesel',
    vehicleIcon: 'car-sports',
    price: '5,652',
    tax: '283',
  },
];

export const cabPartners = ['Quick Ride', 'MERU', 'MegaCabs', 'transferz.com', 'GOZO', 'SAVAARI', 'WTicabs', 'AVIS'];
