import { create } from 'zustand';

import { popularTrainStations, type TrainStation } from '@/src/lib/train-stations';
import type { TrainSearchResult, TrainAvailability } from '@/src/lib/train-search-results';

export type SavedPassenger = {
  id: string;
  name: string;
  age: string;
  gender: string;
  berth: string;
};

export type BookingSelection = {
  journeyDate: string;
  routeTitle: string;
  slot: TrainAvailability;
  train: TrainSearchResult;
};

export type ReviewBookingDraft = {
  id: string;
  irctcUsername: string;
  routeTitle: string;
  journeyDate: string;
  email: string;
  phone: string;
  train: TrainSearchResult;
  slot: TrainAvailability;
  passengers: SavedPassenger[];
  baseFare: number;
  tripGuaranteeFee: number;
  freeCancellationFee: number;
  cancellationFee: number;
  discountAmt: number;
  totalPrice: number;
  refundOption: 'zero' | 'pay';
  addFreeCancel3x: boolean;
  add3xRefund: boolean;
  selectedPaymentMethod?: 'BHIM' | 'PhonePe' | 'GooglePay' | null;
};

export type RecentBooking = {
  id: string;
  bookingId: string;
  pnr: string;
  trainName: string;
  trainNumber: string;
  routeText: string;
  dateText: string;
  priceText: string;
  freeCancellation: boolean;
  passengerNames: string[];
  email: string;
  phone: string;
  classCode: string;
  tripGuarantee: boolean;
  departureTime: string;
  arrivalTime: string;
  departureStation: string;
  arrivalStation: string;
  duration: string;
  cancelled?: boolean;
};

export type RecentSearch = {
  id: string;
  fromCode: string;
  fromCity: string;
  toCode: string;
  toCity: string;
  dateText: string;
};

type TrainSearchState = {
  from: TrainStation | null;
  to: TrainStation | null;
  bookingSelection: BookingSelection | null;
  reviewBookingDraft: ReviewBookingDraft | null;
  recentBookings: RecentBooking[];
  recentSearches: RecentSearch[];
  savedPassengers: SavedPassenger[];
  setFrom: (station: TrainStation) => void;
  setTo: (station: TrainStation) => void;
  setBookingSelection: (selection: BookingSelection | null) => void;
  setReviewBookingDraft: (draft: ReviewBookingDraft | null) => void;
  swapStations: () => void;
  addRecentBooking: (booking: RecentBooking) => void;
  addRecentSearch: (search: RecentSearch) => void;
  addSavedPassenger: (passenger: SavedPassenger) => void;
  removeSavedPassenger: (passengerId: string) => void;
};

export const useTrainSearchStore = create<TrainSearchState>((set) => ({
  from: popularTrainStations[0], // NDLS
  to: popularTrainStations[5],   // SBC (Bangalore)
  bookingSelection: null,
  reviewBookingDraft: null,
  
  // Set to empty array on start so no booking strip shows by default
  recentBookings: [],

  // Default mock recent searches
  recentSearches: [],
  savedPassengers: [],

  setFrom: (station) => set({ from: station }),
  setTo: (station) => set({ to: station }),
  setBookingSelection: (selection) => set({ bookingSelection: selection }),
  setReviewBookingDraft: (draft) => set({ reviewBookingDraft: draft }),
  swapStations: () =>
    set((state) => ({
      from: state.to,
      to: state.from,
    })),
  
  addRecentBooking: (booking) =>
    set((state) => ({
      recentBookings: [booking, ...state.recentBookings],
    })),

  addRecentSearch: (search) =>
    set((state) => {
      const filtered = state.recentSearches.filter(
        (item) => !(item.fromCode === search.fromCode && item.toCode === search.toCode)
      );
      return {
        recentSearches: [search, ...filtered].slice(0, 5),
      };
    }),
  addSavedPassenger: (passenger) =>
    set((state) => {
      const duplicateIndex = state.savedPassengers.findIndex(
        (item) =>
          item.name.trim().toLowerCase() === passenger.name.trim().toLowerCase() &&
          item.age === passenger.age &&
          item.gender === passenger.gender
      );

      if (duplicateIndex >= 0) {
        const nextPassengers = [...state.savedPassengers];
        nextPassengers[duplicateIndex] = passenger;
        return { savedPassengers: nextPassengers };
      }

      return {
        savedPassengers: [passenger, ...state.savedPassengers],
      };
    }),
  removeSavedPassenger: (passengerId) =>
    set((state) => ({
      savedPassengers: state.savedPassengers.filter((passenger) => passenger.id !== passengerId),
    })),
}));
