import { create } from 'zustand';

export type PaymentMethod = 'upi' | 'card' | 'netbanking' | 'emi' | 'wallet' | 'gpay' | 'phonepe';

export interface Addon {
  id: string;
  name: string;
  description: string;
  price: number;
  selected: boolean;
  icon: string;
}

interface PaymentState {
  upiId: string;
  setUpiId: (id: string) => void;
  addons: Addon[];
  toggleAddon: (id: string) => void;
  resetPaymentFlow: () => void;
}

export const usePaymentStore = create<PaymentState>((set) => ({
  upiId: '',
  setUpiId: (id) => set({ upiId: id }),
  addons: [
    {
      id: 'gozy-protect',
      name: 'GozyProtect',
      description: 'Get 100% refund on cancellations, free trip rescheduling, and zero convenience fees.',
      price: 49,
      selected: false,
      icon: 'shield-check'
    },
    {
      id: 'travel-insurance',
      name: 'Travel Insurance',
      description: 'Coverage up to ₹1,00,000 for medical emergencies, accidents, and baggage loss.',
      price: 15,
      selected: false,
      icon: 'hospital-box'
    }
  ],
  toggleAddon: (id) => set((state) => ({
    addons: state.addons.map(a => a.id === id ? { ...a, selected: !a.selected } : a)
  })),
  resetPaymentFlow: () => set({
    upiId: '',
    addons: [
      {
        id: 'gozy-protect',
        name: 'GozyProtect',
        description: 'Get 100% refund on cancellations, free trip rescheduling, and zero convenience fees.',
        price: 49,
        selected: false,
        icon: 'shield-check'
      },
      {
        id: 'travel-insurance',
        name: 'Travel Insurance',
        description: 'Coverage up to ₹1,00,000 for medical emergencies, accidents, and baggage loss.',
        price: 15,
        selected: false,
        icon: 'hospital-box'
      }
    ]
  })
}));
