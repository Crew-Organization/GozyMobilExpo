import { create } from 'zustand';

import { defaultTravelSearch } from '@/src/lib/travel-data';
import type {
  CartItem,
  CommercePaymentMethod,
  EntertainmentBookingConfirmation,
  FoodOrderConfirmation,
  Product,
  Restaurant,
  ShoppingOrderConfirmation,
  TravelBookingConfirmation,
  TravelContact,
  TravelOffer,
  TravelPaymentMethod,
  TravelSearchParams,
  TravelSearchResult,
  TravelTraveler,
} from '@/src/types';

type SuperAppState = {
  foodCart: CartItem[];
  shoppingCart: CartItem[];
  wishlist: Product[];
  selectedRestaurantId: string | null;
  selectedProductId: string | null;
  selectedEventId: string | null;
  selectedAddressId: string;
  commercePaymentMethod: CommercePaymentMethod;
  foodOrderConfirmation: FoodOrderConfirmation | null;
  shoppingOrderConfirmation: ShoppingOrderConfirmation | null;
  entertainmentConfirmation: EntertainmentBookingConfirmation | null;
  selectedSeats: string[];
  travelSearch: TravelSearchParams;
  travelResults: TravelSearchResult | null;
  selectedTravelOffer: TravelOffer | null;
  travelTravelers: TravelTraveler[];
  travelContact: TravelContact;
  travelAddOnIds: string[];
  travelPaymentMethod: TravelPaymentMethod;
  travelConfirmation: TravelBookingConfirmation | null;
  addRestaurantItem: (restaurant: Restaurant, item: Restaurant['menu'][number]) => void;
  addProduct: (product: Product) => void;
  updateQuantity: (kind: 'food' | 'shopping', itemId: string, quantity: number) => void;
  toggleWishlist: (product: Product) => void;
  clearCart: (kind: 'food' | 'shopping') => void;
  setSelectedRestaurant: (restaurantId: string | null) => void;
  setSelectedProduct: (productId: string | null) => void;
  setSelectedEvent: (eventId: string | null) => void;
  setSelectedAddress: (addressId: string) => void;
  setCommercePaymentMethod: (method: CommercePaymentMethod) => void;
  setFoodOrderConfirmation: (confirmation: FoodOrderConfirmation | null) => void;
  setShoppingOrderConfirmation: (confirmation: ShoppingOrderConfirmation | null) => void;
  setEntertainmentConfirmation: (confirmation: EntertainmentBookingConfirmation | null) => void;
  toggleSeat: (seatId: string) => void;
  resetEntertainmentSelection: () => void;
  setTravelSearch: (search: TravelSearchParams) => void;
  setTravelResults: (results: TravelSearchResult) => void;
  selectTravelOffer: (offer: TravelOffer) => void;
  updateTravelTraveler: (index: number, field: keyof TravelTraveler, value: string) => void;
  setTravelContactField: (field: keyof TravelContact, value: string) => void;
  seedTravelContact: (contact: Partial<TravelContact>) => void;
  toggleTravelAddOn: (id: string) => void;
  setTravelPaymentMethod: (method: TravelPaymentMethod) => void;
  setTravelConfirmation: (confirmation: TravelBookingConfirmation | null) => void;
  resetTravelFlow: () => void;
};

const upsertCartItem = (items: CartItem[], nextItem: CartItem) => {
  const existing = items.find((item) => item.sourceId === nextItem.sourceId);
  if (!existing) {
    return [...items, nextItem];
  }

  return items.map((item) =>
    item.sourceId === nextItem.sourceId ? { ...item, quantity: item.quantity + 1 } : item,
  );
};

const makeTravelers = (count: number): TravelTraveler[] =>
  Array.from({ length: count }, (_, index) => ({
    fullName: index === 0 ? 'Gozy Traveller' : '',
    age: index === 0 ? '27' : '',
    gender: index === 0 ? 'Male' : 'Female',
  }));

export const useSuperAppStore = create<SuperAppState>((set) => ({
  foodCart: [],
  shoppingCart: [],
  wishlist: [],
  selectedRestaurantId: null,
  selectedProductId: null,
  selectedEventId: null,
  selectedAddressId: 'addr-home',
  commercePaymentMethod: 'wallet',
  foodOrderConfirmation: null,
  shoppingOrderConfirmation: null,
  entertainmentConfirmation: null,
  selectedSeats: [],
  travelSearch: defaultTravelSearch,
  travelResults: null,
  selectedTravelOffer: null,
  travelTravelers: makeTravelers(defaultTravelSearch.travellers),
  travelContact: {
    phone: '',
    email: '',
  },
  travelAddOnIds: ['gozy-protect'],
  travelPaymentMethod: 'wallet',
  travelConfirmation: null,
  addRestaurantItem: (restaurant, item) =>
    set((state) => ({
      foodCart: upsertCartItem(state.foodCart, {
        id: `food-${item.id}`,
        sourceId: item.id,
        kind: 'food',
        title: item.name,
        subtitle: restaurant.name,
        price: item.price,
        quantity: 1,
        image: restaurant.image,
      }),
    })),
  addProduct: (product) =>
    set((state) => ({
      shoppingCart: upsertCartItem(state.shoppingCart, {
        id: `product-${product.id}`,
        sourceId: product.id,
        kind: 'shopping',
        title: product.name,
        subtitle: product.brand,
        price: product.price,
        quantity: 1,
        image: product.image,
      }),
    })),
  updateQuantity: (kind, itemId, quantity) =>
    set((state) => {
      const key = kind === 'food' ? 'foodCart' : 'shoppingCart';
      return {
        [key]: state[key]
          .map((item) => (item.id === itemId ? { ...item, quantity } : item))
          .filter((item) => item.quantity > 0),
      } as Pick<SuperAppState, typeof key>;
    }),
  toggleWishlist: (product) =>
    set((state) => ({
      wishlist: state.wishlist.some((item) => item.id === product.id)
        ? state.wishlist.filter((item) => item.id !== product.id)
        : [...state.wishlist, product],
    })),
  clearCart: (kind) =>
    set(() =>
      kind === 'food'
        ? { foodCart: [] }
        : {
            shoppingCart: [],
          },
    ),
  setSelectedRestaurant: (selectedRestaurantId) =>
    set(() => ({
      selectedRestaurantId,
    })),
  setSelectedProduct: (selectedProductId) =>
    set(() => ({
      selectedProductId,
    })),
  setSelectedEvent: (selectedEventId) =>
    set(() => ({
      selectedEventId,
    })),
  setSelectedAddress: (selectedAddressId) =>
    set(() => ({
      selectedAddressId,
    })),
  setCommercePaymentMethod: (commercePaymentMethod) =>
    set(() => ({
      commercePaymentMethod,
    })),
  setFoodOrderConfirmation: (foodOrderConfirmation) =>
    set(() => ({
      foodOrderConfirmation,
    })),
  setShoppingOrderConfirmation: (shoppingOrderConfirmation) =>
    set(() => ({
      shoppingOrderConfirmation,
    })),
  setEntertainmentConfirmation: (entertainmentConfirmation) =>
    set(() => ({
      entertainmentConfirmation,
    })),
  toggleSeat: (seatId) =>
    set((state) => ({
      selectedSeats: state.selectedSeats.includes(seatId)
        ? state.selectedSeats.filter((item) => item !== seatId)
        : [...state.selectedSeats, seatId],
    })),
  resetEntertainmentSelection: () =>
    set(() => ({
      selectedEventId: null,
      selectedSeats: [],
      entertainmentConfirmation: null,
    })),
  setTravelSearch: (search) =>
    set(() => ({
      travelSearch: search,
      travelResults: null,
      selectedTravelOffer: null,
      travelConfirmation: null,
      travelAddOnIds: ['gozy-protect'],
      travelPaymentMethod: 'wallet',
      travelTravelers: makeTravelers(search.travellers),
    })),
  setTravelResults: (travelResults) =>
    set(() => ({
      travelResults,
      selectedTravelOffer: travelResults.offers[0] ?? null,
    })),
  selectTravelOffer: (offer) =>
    set(() => ({
      selectedTravelOffer: offer,
      travelConfirmation: null,
    })),
  updateTravelTraveler: (index, field, value) =>
    set((state) => ({
      travelTravelers: state.travelTravelers.map((traveler, travelerIndex) =>
        travelerIndex === index ? { ...traveler, [field]: value } : traveler,
      ),
    })),
  setTravelContactField: (field, value) =>
    set((state) => ({
      travelContact: {
        ...state.travelContact,
        [field]: value,
      },
    })),
  seedTravelContact: (contact) =>
    set((state) => ({
      travelContact: {
        ...state.travelContact,
        ...contact,
      },
    })),
  toggleTravelAddOn: (id) =>
    set((state) => ({
      travelAddOnIds: state.travelAddOnIds.includes(id)
        ? state.travelAddOnIds.filter((item) => item !== id)
        : [...state.travelAddOnIds, id],
    })),
  setTravelPaymentMethod: (travelPaymentMethod) =>
    set(() => ({
      travelPaymentMethod,
    })),
  setTravelConfirmation: (travelConfirmation) =>
    set(() => ({
      travelConfirmation,
    })),
  resetTravelFlow: () =>
    set(() => ({
      travelResults: null,
      selectedTravelOffer: null,
      travelAddOnIds: ['gozy-protect'],
      travelPaymentMethod: 'wallet',
      travelConfirmation: null,
      travelTravelers: makeTravelers(defaultTravelSearch.travellers),
      travelContact: {
        phone: '',
        email: '',
      },
    })),
}));
