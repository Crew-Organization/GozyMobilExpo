import { create } from 'zustand';

export type Gender = 'Male' | 'Female' | 'Other';

export interface Passenger {
  id: string;
  name: string;
  age: string;
  gender: Gender | '';
}

export interface EmergencyContact {
  name: string;
  phone: string;
}

export interface GstDetails {
  companyName: string;
  gstin: string;
}

interface PassengerState {
  passengers: Passenger[];
  emergencyContact: EmergencyContact;
  gstDetails: GstDetails;
  errors: Record<string, string>;
  addPassenger: () => void;
  removePassenger: (id: string) => void;
  updatePassenger: (id: string, field: keyof Passenger, value: string) => void;
  setEmergencyContact: (field: keyof EmergencyContact, value: string) => void;
  setGstDetails: (field: keyof GstDetails, value: string) => void;
  validatePassengers: () => boolean;
}

export const usePassengerStore = create<PassengerState>((set, get) => ({
  passengers: [{ id: '1', name: '', age: '', gender: '' }],
  emergencyContact: { name: '', phone: '' },
  gstDetails: { companyName: '', gstin: '' },
  errors: {},

  addPassenger: () => set((state) => ({
    passengers: [...state.passengers, { id: Math.random().toString(), name: '', age: '', gender: '' }]
  })),

  removePassenger: (id) => set((state) => ({
    passengers: state.passengers.filter(p => p.id !== id)
  })),

  updatePassenger: (id, field, value) => set((state) => ({
    passengers: state.passengers.map(p => p.id === id ? { ...p, [field]: value } : p),
    errors: { ...state.errors, [`${id}-${field}`]: '' }
  })),

  setEmergencyContact: (field, value) => set((state) => ({
    emergencyContact: { ...state.emergencyContact, [field]: value }
  })),

  setGstDetails: (field, value) => set((state) => ({
    gstDetails: { ...state.gstDetails, [field]: value }
  })),

  validatePassengers: () => {
    const { passengers } = get();
    let isValid = true;
    const newErrors: Record<string, string> = {};

    passengers.forEach(p => {
      if (!p.name.trim()) {
        newErrors[`${p.id}-name`] = 'Name is required';
        isValid = false;
      }
      if (!p.age || isNaN(Number(p.age))) {
        newErrors[`${p.id}-age`] = 'Valid age is required';
        isValid = false;
      }
      if (!p.gender) {
        newErrors[`${p.id}-gender`] = 'Gender is required';
        isValid = false;
      }
    });

    set({ errors: newErrors });
    return isValid;
  }
}));
