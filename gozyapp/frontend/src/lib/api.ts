import { Platform } from 'react-native';

import {
  buildEntertainmentFallbackConfirmation,
  buildFoodFallbackConfirmation,
  buildShoppingFallbackConfirmation,
} from '@/src/lib/commerce-data';
import { mockBootstrap, mockSession } from '@/src/lib/mock-data';
import {
  buildFallbackTravelConfirmation,
  buildTravelSearchResult,
} from '@/src/lib/travel-data';
import {
  buildFallbackHotelConfirmation,
  mockHotels,
} from '@/src/lib/hotel-data';
import { searchBusListings } from '@/src/lib/bus-search-data';
import { searchGovtBusListings } from '@/src/lib/govt-bus-search-data';
import type { BusSearchRequest, BusSearchResponse } from '@/src/types/bus';
import {
  trainSearchResults,
  type TrainSearchResult,
} from '@/src/lib/train-search-results';
import type {
  BootstrapPayload,
  AuthChannel,
  AuthProvider,
  CartItem,
  Category,
  EntertainmentBookingConfirmation,
  EntertainmentBookingPayload,
  Experience,
  FoodOrderConfirmation,
  FoodOrderPayload,
  Restaurant,
  Session,
  ShoppingOrderConfirmation,
  ShoppingOrderPayload,
  SwipeDirection,
  TravelBookingConfirmation,
  TravelBookingPayload,
  TravelSearchParams,
  TravelSearchResult,
  UserProfile,
  HotelBookingConfirmation,
  HotelBookingPayload,
} from '@/src/types';

const fallbackApiUrl =
  Platform.OS === 'android' ? 'http://10.0.2.2:4000/api' : 'http://localhost:4000/api';

export const apiBaseUrl = process.env.EXPO_PUBLIC_API_URL ?? fallbackApiUrl;
export const socketBaseUrl = apiBaseUrl.replace(/\/api$/, '');

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 800);

  try {
    const response = await fetch(`${apiBaseUrl}${path}`, {
      ...init,
      signal: controller.signal as any,
      headers: {
        'Content-Type': 'application/json',
        ...(init?.headers ?? {}),
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Request failed for ${path}`);
    }

    return (await response.json()) as T;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

type TrainSearchParams = {
  fromCode: string;
  fromName: string;
  toCode: string;
  toName: string;
  date: string;
};

function formatStationLabel(name: string, code: string, fallback: string) {
  const safeName = name.trim();
  const safeCode = code.trim().toUpperCase();

  if (safeName && safeCode) {
    return `${safeName} (${safeCode})`;
  }

  if (safeName) {
    return safeName;
  }

  if (safeCode) {
    return safeCode;
  }

  return fallback;
}

function formatDateParts(dateString: string) {
  const parsedDate = new Date(dateString);
  const safeDate = Number.isNaN(parsedDate.getTime()) ? new Date() : parsedDate;

  const departureDateLabel = safeDate.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
  });

  const arrivalDate = new Date(safeDate);
  arrivalDate.setDate(arrivalDate.getDate() + 1);

  const arrivalDateLabel = arrivalDate.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
  });

  return { departureDateLabel, arrivalDateLabel };
}

function buildFallbackTrainResults(search: TrainSearchParams): TrainSearchResult[] {
  const { departureDateLabel, arrivalDateLabel } = formatDateParts(search.date);

  return trainSearchResults.map((item, index) => {
    const isSameDayArrival = item.duration.startsWith('04h') || item.duration.startsWith('08h');

    return {
      ...item,
      id: `${item.id}-${search.fromCode || 'from'}-${search.toCode || 'to'}-${index}`,
      departureDateLabel,
      arrivalDateLabel: isSameDayArrival ? departureDateLabel : arrivalDateLabel,
    };
  });
}

export const api = {
  baseUrl: apiBaseUrl,
  socketBaseUrl,
  async getBootstrap(): Promise<BootstrapPayload> {
    try {
      return await request<BootstrapPayload>('/bootstrap');
    } catch {
      return mockBootstrap;
    }
  },
  async requestOtp(
    identifier: string,
    channel: AuthChannel,
  ): Promise<{ success: boolean; otpHint: string }> {
    try {
      return await request('/auth/request-otp', {
        method: 'POST',
        body: JSON.stringify({ identifier, channel }),
      });
    } catch {
      return {
        success: true,
        otpHint:
          channel === 'email'
            ? `We sent a 6-digit code to ${identifier}. Check inbox and spam. Use 202626 in local mode.`
            : `We sent a 6-digit code to ${identifier}. Check SMS or WhatsApp. Use 202626 in local mode.`,
      };
    }
  },
  async verifyOtp(identifier: string, channel: AuthChannel, code: string): Promise<Session> {
    try {
      return await request('/auth/verify-otp', {
        method: 'POST',
        body: JSON.stringify({ identifier, channel, code }),
      });
    } catch {
      return {
        ...mockSession,
        user: {
          ...mockSession.user,
          ...(channel === 'email'
            ? { email: identifier }
            : {
                phone: identifier,
                email: mockSession.user.email,
              }),
        },
      };
    }
  },
  async continueWithProvider(provider: AuthProvider, mode: 'signin' | 'signup'): Promise<Session> {
    try {
      return await request('/auth/provider', {
        method: 'POST',
        body: JSON.stringify({ provider, mode }),
      });
    } catch {
      return {
        ...mockSession,
        user: {
          ...mockSession.user,
          email: `${provider}@gozy.app`,
        },
      };
    }
  },
  async continueAsDemo(): Promise<Session> {
    try {
      return await request('/auth/demo', {
        method: 'POST',
      });
    } catch {
      return {
        ...mockSession,
      };
    }
  },
  async updateProfile(profile: Partial<UserProfile>): Promise<UserProfile> {
    try {
      return await request('/auth/profile', {
        method: 'PATCH',
        body: JSON.stringify(profile),
      });
    } catch {
      return {
        ...mockSession.user,
        ...profile,
      };
    }
  },
  async swipeExperience(experienceId: string, direction: SwipeDirection) {
    try {
      return await request(`/feed/${experienceId}/swipe`, {
        method: 'POST',
        body: JSON.stringify({ direction }),
      });
    } catch {
      return { success: true };
    }
  },
  async likeMatch(matchId: string) {
    try {
      return await request(`/matches/${matchId}/like`, {
        method: 'POST',
      });
    } catch {
      return { success: true };
    }
  },
  async sendMessage(conversationId: string, text: string) {
    try {
      return await request(`/chat/${conversationId}/messages`, {
        method: 'POST',
        body: JSON.stringify({ text }),
      });
    } catch {
      return { success: true };
    }
  },
  async addMoney(amount: number) {
    try {
      return await request('/wallet/add-money', {
        method: 'POST',
        body: JSON.stringify({ amount }),
      });
    } catch {
      return { success: true };
    }
  },
  async createBooking(experience: Experience) {
    try {
      return await request('/bookings', {
        method: 'POST',
        body: JSON.stringify({ experienceId: experience.id }),
      });
    } catch {
      return { success: true };
    }
  },
  async checkout(items: CartItem[]) {
    try {
      return await request('/orders/checkout', {
        method: 'POST',
        body: JSON.stringify({ items }),
      });
    } catch {
      return {
        success: true,
        orderId: `order-${Date.now()}`,
        total: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
      };
    }
  },
  async createFoodOrder(
    payload: FoodOrderPayload,
    fallbackRestaurant: Restaurant,
  ): Promise<FoodOrderConfirmation> {
    try {
      return await request<FoodOrderConfirmation>('/orders/food', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    } catch {
      const total = payload.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      return buildFoodFallbackConfirmation(
        fallbackRestaurant,
        total,
        payload.paymentMethod,
        payload.address.label,
      );
    }
  },
  async createShoppingOrder(payload: ShoppingOrderPayload): Promise<ShoppingOrderConfirmation> {
    try {
      return await request<ShoppingOrderConfirmation>('/orders/shopping', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    } catch {
      const total = payload.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      return buildShoppingFallbackConfirmation(
        payload.items.length,
        total,
        payload.paymentMethod,
        payload.address.label,
      );
    }
  },
  async createEntertainmentBooking(
    payload: EntertainmentBookingPayload,
    fallbackEvent: { title: string; venue: string; date: string; price: number },
  ): Promise<EntertainmentBookingConfirmation> {
    try {
      return await request<EntertainmentBookingConfirmation>('/orders/entertainment', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    } catch {
      return buildEntertainmentFallbackConfirmation(
        {
          id: payload.eventId,
          title: fallbackEvent.title,
          venue: fallbackEvent.venue,
          date: fallbackEvent.date,
          genre: 'Movie',
          image: '',
          rating: 4.7,
          price: fallbackEvent.price,
        },
        payload.seats,
        payload.paymentMethod,
      );
    }
  },
  async getOrderTracking(orderId: string) {
    return request(`/orders/${orderId}`);
  },
  async searchTravel(search: TravelSearchParams): Promise<TravelSearchResult> {
    try {
      return await request<TravelSearchResult>('/travel/search', {
        method: 'POST',
        body: JSON.stringify(search),
      });
    } catch {
      return buildTravelSearchResult(search);
    }
  },
  async searchBuses(payload: BusSearchRequest): Promise<BusSearchResponse> {
    try {
      return await request<BusSearchResponse>('/buses/search', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    } catch {
      const date = new Date(payload.date);
      const listings =
        payload.scope === 'govt'
          ? searchGovtBusListings(payload.from, payload.to, date, payload.operatorId)
          : searchBusListings(payload.from, payload.to, date);
      return {
        from: payload.from,
        to: payload.to,
        date: payload.date.slice(0, 10),
        scope: payload.scope ?? 'all',
        fetchedAt: new Date().toISOString(),
        listings,
      };
    }
  },
  async createTravelBooking(
    payload: TravelBookingPayload,
  ): Promise<TravelBookingConfirmation> {
    try {
      return await request<TravelBookingConfirmation>('/bookings/travel', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    } catch {
      const fallbackSearch = buildTravelSearchResult(payload.search);
      const fallbackOffer =
        fallbackSearch.offers.find((offer) => offer.id === payload.offerId) ??
        fallbackSearch.offers[0];

      return buildFallbackTravelConfirmation(
        payload.search,
        fallbackOffer,
        payload.addOnIds,
        payload.paymentMethod,
        mockBootstrap.walletBalance,
      );
    }
  },
  async createHotelBooking(
    payload: HotelBookingPayload,
  ): Promise<HotelBookingConfirmation> {
    try {
      return await request<HotelBookingConfirmation>('/bookings/hotel', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    } catch {
      const hotel = mockHotels.find((h) => h.id === payload.hotelId) ?? mockHotels[0];
      const room = hotel.rooms.find((r) => r.id === payload.roomId) ?? hotel.rooms[0];
      return buildFallbackHotelConfirmation(payload, hotel, room, mockBootstrap.walletBalance);
    }
  },
  async searchTrains(search: TrainSearchParams): Promise<TrainSearchResult[]> {
    try {
      return await request<TrainSearchResult[]>('/trains/search', {
        method: 'POST',
        body: JSON.stringify(search),
      });
    } catch {
      return buildFallbackTrainResults(search);
    }
  },
  async markNotificationRead(notificationId: string) {
    try {
      return await request(`/notifications/${notificationId}/read`, {
        method: 'POST',
      });
    } catch {
      return { success: true };
    }
  },
  async getRecommendations(category?: Category) {
    try {
      const query = category ? `?category=${encodeURIComponent(category)}` : '';
      return await request<{ recommendations: string[] }>(`/recommendations${query}`);
    } catch {
      return { recommendations: mockBootstrap.recommendations };
    }
  },
  async askAssistant(prompt: string) {
    try {
      return await request<{ reply: string; chips: string[] }>('/ai/assistant', {
        method: 'POST',
        body: JSON.stringify({ prompt }),
      });
    } catch {
      const lower = prompt.toLowerCase();
      if (lower.includes('goa')) {
        return {
          reply:
            'For Goa, I would book a Friday morning flight, a South Goa beach stay, one cafe crawl, and one nightlife block. Your current budget fits a 3-day plan around Rs 16k to Rs 22k.',
          chips: ['Show Goa travel deals', 'Find beach stays', 'Add nightlife picks'],
        };
      }

      if (lower.includes('food')) {
        return {
          reply:
            'You usually convert best on compact, highly rated food spots with fast delivery. I would start with Bowl Theory and Biryani Social Club nearby.',
          chips: ['Open food module', 'Add top bowl to cart', 'Find late-night dining'],
        };
      }

      return {
        reply:
          'I can help across trips, food, shopping, and entertainment. Try asking for a city, budget, cuisine, or vibe and I will build a plan.',
        chips: ['Plan a weekend trip', 'Best food near me', 'Shopping deals today'],
      };
    }
  },
};
