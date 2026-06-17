import { create } from 'zustand';

import { defaultTravelSearch } from '@/src/lib/travel-data';
import { defaultHotelSearch } from '@/src/lib/hotel-data';
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
  HotelBookingConfirmation,
  HotelPaymentMethod,
  HotelOffer,
  HotelRoom,
  HotelSearchParams,
  HotelTraveler,
  Address,
} from '@/src/types';

type SuperAppState = {
  foodCart: CartItem[];
  shoppingCart: CartItem[];
  customAddresses: Address[];
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

  // Hotel booking state
  hotelSearch: HotelSearchParams;
  selectedHotel: HotelOffer | null;
  selectedRoom: HotelRoom | null;
  hotelTravelers: HotelTraveler[];
  hotelContact: TravelContact;
  hotelTripSecure: boolean;
  hotelCouponCode: string | null;
  hotelPaymentMethod: HotelPaymentMethod;
  hotelConfirmation: HotelBookingConfirmation | null;

  addCustomAddress: (address: Address) => void;
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

  // Hotel actions
  setHotelSearch: (search: HotelSearchParams) => void;
  setSelectedHotel: (hotel: HotelOffer | null) => void;
  setSelectedRoom: (room: HotelRoom | null) => void;
  updateHotelTraveler: (index: number, field: keyof HotelTraveler, value: string) => void;
  setHotelContactField: (field: keyof TravelContact, value: string) => void;
  seedHotelContact: (contact: Partial<TravelContact>) => void;
  toggleHotelTripSecure: () => void;
  setHotelCouponCode: (code: string | null) => void;
  setHotelPaymentMethod: (method: HotelPaymentMethod) => void;
  setHotelConfirmation: (confirmation: HotelBookingConfirmation | null) => void;
  resetHotelFlow: () => void;
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

const makeHotelTravelers = (count: number): HotelTraveler[] =>
  Array.from({ length: count }, (_, index) => ({
    title: 'Mr',
    firstName: index === 0 ? 'Sankar' : '',
    lastName: index === 0 ? 'Gozy' : '',
  }));

export const useSuperAppStore = create<SuperAppState>((set) => ({
  foodCart: [],
  shoppingCart: [],
  customAddresses: [],
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

  // Hotel booking initial state
  hotelSearch: defaultHotelSearch,
  selectedHotel: null,
  selectedRoom: null,
  hotelTravelers: makeHotelTravelers(defaultHotelSearch.guests),
  hotelContact: {
    phone: '',
    email: '',
  },
  hotelTripSecure: false,
  hotelCouponCode: null,
  hotelPaymentMethod: 'wallet',
  hotelConfirmation: null,

  addCustomAddress: (address) =>
    set((state) => ({
      customAddresses: [...state.customAddresses, address],
    })),
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

  // Hotel actions implementation
  setHotelSearch: (search) =>
    set(() => ({
      hotelSearch: search,
      selectedHotel: null,
      selectedRoom: null,
      hotelConfirmation: null,
      hotelCouponCode: null,
      hotelTripSecure: false,
      hotelPaymentMethod: 'wallet',
      hotelTravelers: makeHotelTravelers(search.guests),
    })),
  setSelectedHotel: (hotel) =>
    set(() => ({
      selectedHotel: hotel,
      selectedRoom: null,
      hotelConfirmation: null,
    })),
  setSelectedRoom: (room) =>
    set(() => ({
      selectedRoom: room,
      hotelConfirmation: null,
    })),
  updateHotelTraveler: (index, field, value) =>
    set((state) => ({
      hotelTravelers: state.hotelTravelers.map((traveler, travelerIndex) =>
        travelerIndex === index ? { ...traveler, [field]: value } : traveler,
      ),
    })),
  setHotelContactField: (field, value) =>
    set((state) => ({
      hotelContact: {
        ...state.hotelContact,
        [field]: value,
      },
    })),
  seedHotelContact: (contact) =>
    set((state) => ({
      hotelContact: {
        ...state.hotelContact,
        ...contact,
      },
    })),
  toggleHotelTripSecure: () =>
    set((state) => ({
      hotelTripSecure: !state.hotelTripSecure,
    })),
  setHotelCouponCode: (code) =>
    set(() => ({
      hotelCouponCode: code,
    })),
  setHotelPaymentMethod: (method) =>
    set(() => ({
      hotelPaymentMethod: method,
    })),
  setHotelConfirmation: (confirmation) =>
    set(() => ({
      hotelConfirmation: confirmation,
    })),
  resetHotelFlow: () =>
    set(() => ({
      selectedHotel: null,
      selectedRoom: null,
      hotelConfirmation: null,
      hotelCouponCode: null,
      hotelTripSecure: false,
      hotelPaymentMethod: 'wallet',
      hotelTravelers: makeHotelTravelers(defaultHotelSearch.guests),
      hotelContact: {
        phone: '',
        email: '',
      },
    })),
}));
