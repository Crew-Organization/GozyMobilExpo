import { create } from 'zustand';

export type Deck = 'lower' | 'upper';
export type SeatStatus = 'booked' | 'male' | 'ladies' | 'blocked' | 'available';

export interface Seat {
  id: string;
  row: number;
  col: number;
  deck: Deck;
  status: SeatStatus;
  type: string;
  price: number;
}

export interface BoardingPoint {
  id: string;
  name: string;
  time: string;
  address: string;
  landmark?: string;
}

export type DroppingPoint = BoardingPoint;

interface BookingState {
  // Add any necessary state here
  dummy: string;
}

export const useBookingStore = create<BookingState>((set) => ({
  dummy: 'hello'
}));
