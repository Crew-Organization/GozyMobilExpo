import { Pressable, ScrollView, Text, View, Image } from 'react-native';
import { Redirect, router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useApp } from '@/src/context/app-context';
import { useSuperAppStore } from '@/src/store/super-app-store';
import type { MenuItem, Restaurant } from '@/src/types';

// ============================================================
// Food Restaurant Detail Module
// ============================================================
// This screen matches the reference restaurant detail page:
// top actions, pure veg badge, restaurant metadata, offer strip,
// menu filters, combo cards, recommended menu rows, and cart CTA.

const menuFilters = ['Filters', 'Highly reordered', 'Spicy'];

// ============================================================
// Main Restaurant Detail Screen
// ============================================================

export default function FoodRestaurantScreen() {
  const { restaurants } = useApp();
  const { addRestaurantItem, foodCart, selectedRestaurantId } = useSuperAppStore();

  const restaurant = restaurants.find((item) => item.id === selectedRestaurantId);
  if (!restaurant) {
    return <Redirect href="/food" />;
  }

  return (
    // ========================================================
    // Page Background Section
    // bg-white controls the whole restaurant detail background.
    // ========================================================
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView contentContainerClassName="pb-32" showsVerticalScrollIndicator={false}>
        {/* ====================================================
            Top Action Header Section
            Back, Search, and More menu buttons.
        ==================================================== */}
        <RestaurantTopActions />

        {/* ====================================================
            Restaurant Summary Section
            Pure veg badge, restaurant name, rating, distance, ETA.
        ==================================================== */}
        <RestaurantSummary restaurant={restaurant} />

        {/* ====================================================
            Restaurant Offer Strip Section
            Main discount row and offer count.
        ==================================================== */}
        <RestaurantOfferStrip restaurant={restaurant} />

        {/* ====================================================
            Menu Filter Chips Section
            Filters / reordered / spicy chips.
        ==================================================== */}
        <RestaurantMenuFilters />

        {/* ====================================================
            Most Ordered Together Section
            Horizontal combo cards with add buttons.
        ==================================================== */}
        <MostOrderedTogether restaurant={restaurant} onAddItem={addRestaurantItem} />

        {/* ====================================================
            Recommended Menu Section
            Main menu list with Add actions.
        ==================================================== */}
        <RecommendedMenu restaurant={restaurant} onAddItem={addRestaurantItem} />
      </ScrollView>

      {/* ======================================================
          Floating Menu Button Section
          Dark menu shortcut pinned to bottom right.
      ====================================================== */}
      <FloatingMenuButton />

      {/* ======================================================
          Cart Checkout Bar Section
          Appears when food cart has at least one item.
      ====================================================== */}
      {foodCart.length > 0 ? <RestaurantCheckoutBar itemCount={foodCart.length} /> : null}
    </SafeAreaView>
  );
}

// ============================================================
// Top Action Header Component
// ============================================================

function RestaurantTopActions() {
  return (
    <View className="flex-row items-center justify-between px-5 py-4">
      <Pressable
        className="h-16 w-16 items-center justify-center rounded-full border border-gray-100 bg-white shadow-sm"
        onPress={() => router.back()}>
        <MaterialCommunityIcons color="#111827" name="chevron-left" size={36} />
      </Pressable>

      <View className="flex-row items-center gap-3">
        <Pressable className="min-h-14 flex-row items-center gap-2 rounded-full border border-gray-100 bg-white px-5 shadow-sm">
          <MaterialCommunityIcons color="#111827" name="magnify" size={28} />
          <Text className="text-lg font-bold text-gray-900">Search</Text>
        </Pressable>

        <Pressable className="h-16 w-16 items-center justify-center rounded-full border border-gray-100 bg-white shadow-sm">
          <MaterialCommunityIcons color="#111827" name="dots-vertical" size={30} />
        </Pressable>
      </View>
    </View>
  );
}

// ============================================================
// Restaurant Summary Component
// ============================================================

type RestaurantSummaryProps = {
  restaurant: Restaurant;
};

function RestaurantSummary({ restaurant }: RestaurantSummaryProps) {
  const isPureVeg = restaurant.menu.some((item) => item.isVeg);

  return (
    <View className="gap-4 px-5 pb-5">
      {isPureVeg ? (
        <View className="self-start flex-row items-center gap-2 rounded-full bg-[#E7FBEF] px-3 py-2">
          <MaterialCommunityIcons color="#00A86B" name="leaf" size={22} />
          <Text className="text-lg font-black text-gozyGreen">Pure Veg</Text>
        </View>
      ) : null}

      <View className="flex-row items-start justify-between gap-4">
        <View className="min-w-0 flex-1 gap-3">
          <View className="flex-row items-center gap-2">
            <Text className="flex-1 text-[34px] font-black text-gray-900" numberOfLines={2}>
              {restaurant.name.toUpperCase()}
            </Text>
            <MaterialCommunityIcons color="#111827" name="information-outline" size={28} />
          </View>

          <View className="flex-row items-center gap-2">
            <MaterialCommunityIcons color="#4B5563" name="map-marker-outline" size={25} />
            <Text className="text-xl font-bold text-gray-700">
              {restaurant.distance} · local delivery zone
            </Text>
          </View>

          <View className="flex-row items-center gap-2">
            <MaterialCommunityIcons color="#4B5563" name="clock-outline" size={25} />
            <Text className="text-xl font-bold text-gray-700">
              {restaurant.eta} · Schedule for later
            </Text>
            <MaterialCommunityIcons color="#6B7280" name="chevron-down" size={24} />
          </View>
        </View>

        <View className="items-center">
          <View className="flex-row items-center gap-1 rounded-full bg-[#078444] px-3 py-2">
            <MaterialCommunityIcons color="#FFFFFF" name="star" size={20} />
            <Text className="text-2xl font-black text-white">{restaurant.rating.toFixed(1)}</Text>
          </View>
          <Text className="mt-2 border-b border-dashed border-gray-400 text-base font-bold text-gray-500">
            By 1.3K+
          </Text>
        </View>
      </View>

      <View className="flex-row gap-3">
        <TrustPill label="No packaging charges" />
        <TrustPill label="Frequently reordered" />
      </View>
    </View>
  );
}

// ============================================================
// Trust Pill Component
// ============================================================

function TrustPill({ label }: { label: string }) {
  return (
    <View className="flex-1 flex-row items-center justify-center gap-2 rounded-full bg-gray-50 px-3 py-4">
      <MaterialCommunityIcons color="#00A86B" name="check" size={21} />
      <Text className="text-base font-bold text-gray-700">{label}</Text>
    </View>
  );
}

// ============================================================
// Restaurant Offer Strip Component
// ============================================================

function RestaurantOfferStrip({ restaurant }: RestaurantSummaryProps) {
  return (
    <View className="border-y border-gray-100 px-5 py-5">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-3">
          <MaterialCommunityIcons color="#2F80ED" name="brightness-percent" size={30} />
          <Text className="text-xl font-black text-gray-900">{restaurant.offer}</Text>
        </View>
        <View className="flex-row items-center gap-1">
          <Text className="text-lg font-bold text-gray-400">5 offers</Text>
          <MaterialCommunityIcons color="#9CA3AF" name="chevron-down" size={24} />
        </View>
      </View>
    </View>
  );
}

// ============================================================
// Menu Filter Chips Component
// ============================================================

function RestaurantMenuFilters() {
  return (
    <ScrollView
      className="border-b border-gray-100 bg-white"
      contentContainerClassName="gap-3 px-5 py-5"
      horizontal
      showsHorizontalScrollIndicator={false}>
      {menuFilters.map((filter) => (
        <Pressable
          className="min-h-[50px] flex-row items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 shadow-sm"
          key={filter}>
          {filter === 'Filters' ? (
            <MaterialCommunityIcons color="#1F2937" name="tune-variant" size={20} />
          ) : null}
          {filter === 'Highly reordered' ? (
            <MaterialCommunityIcons color="#00A86B" name="reload" size={22} />
          ) : null}
          {filter === 'Spicy' ? <Text className="text-xl">🌶️</Text> : null}
          <Text className="text-lg font-black text-gray-800">{filter}</Text>
          {filter === 'Filters' ? <MaterialCommunityIcons color="#1F2937" name="chevron-down" size={18} /> : null}
        </Pressable>
      ))}
    </ScrollView>
  );
}

// ============================================================
// Most Ordered Together Component
// ============================================================

type MenuActionProps = {
  restaurant: Restaurant;
  onAddItem: (restaurant: Restaurant, item: MenuItem) => void;
};

function MostOrderedTogether({ restaurant, onAddItem }: MenuActionProps) {
  return (
    <View className="gap-5 border-b border-gray-100 px-5 py-8">
      <View className="flex-row items-center justify-between">
        <Text className="text-2xl font-black text-gray-950">Most ordered together</Text>
        <MaterialCommunityIcons color="#374151" name="chevron-up" size={28} />
      </View>

      <ScrollView contentContainerClassName="gap-5" horizontal showsHorizontalScrollIndicator={false}>
        {restaurant.menu.map((item) => (
          <Pressable
            className="w-[270px] overflow-hidden rounded-2xl border border-gray-100 bg-white"
            key={item.id}>
            <View className="h-[170px]">
              <Image className="h-full w-full" resizeMode="cover" source={{ uri: restaurant.image }} />
              <Pressable
                className="absolute right-3 top-[78px] h-11 w-11 items-center justify-center rounded-full bg-white shadow"
                onPress={() => onAddItem(restaurant, item)}>
                <MaterialCommunityIcons color="#9CA3AF" name="plus" size={30} />
              </Pressable>
            </View>

            <View className="gap-4 p-4">
              <View className="self-start flex-row items-center gap-2 rounded-full bg-[#FFF8C7] px-2 py-1">
                <View className="h-5 w-5 rounded border-2 border-gozyGreen" />
                <Text className="text-sm font-bold text-gray-700">Ordered by 50+ customers</Text>
              </View>

              <Text className="text-xl font-bold text-gray-900" numberOfLines={2}>
                {item.name}
              </Text>
              <View className="flex-row items-center justify-between">
                <Text className="text-xl font-black text-gray-900">₹{item.price}</Text>
                <Pressable
                  className="rounded-xl border border-gozyPink px-5 py-3"
                  onPress={() => onAddItem(restaurant, item)}>
                  <Text className="text-lg font-black text-gozyPink">See items</Text>
                </Pressable>
              </View>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

// ============================================================
// Recommended Menu Component
// ============================================================

function RecommendedMenu({ restaurant, onAddItem }: MenuActionProps) {
  return (
    <View className="gap-5 px-5 py-8">
      <View className="flex-row items-center justify-between">
        <Text className="text-2xl font-black text-gray-950">Recommended for you</Text>
        <MaterialCommunityIcons color="#374151" name="chevron-up" size={28} />
      </View>

      {restaurant.menu.map((item) => (
        <View className="flex-row gap-4 border-b border-gray-100 pb-5" key={item.id}>
          <View className="flex-1 gap-2">
            <View className="flex-row items-center gap-2">
              <View className={`h-5 w-5 rounded border-2 ${item.isVeg ? 'border-gozyGreen' : 'border-red-500'}`} />
              {item.popular ? <Text className="text-lg">🌶️</Text> : null}
            </View>
            <Text className="text-xl font-black text-gray-900">{item.name}</Text>
            <Text className="text-lg font-bold text-gray-900">₹{item.price}</Text>
            <Text className="text-sm font-semibold leading-5 text-gray-500">{item.description}</Text>
          </View>

          <View className="w-[128px]">
            <Image className="h-[112px] w-full rounded-2xl" resizeMode="cover" source={{ uri: restaurant.image }} />
            <Pressable
              className="-mt-6 self-center rounded-xl border border-gozyPink bg-white px-7 py-2 shadow"
              onPress={() => onAddItem(restaurant, item)}>
              <Text className="text-lg font-black text-gozyPink">ADD</Text>
            </Pressable>
          </View>
        </View>
      ))}
    </View>
  );
}

// ============================================================
// Floating Menu Button Component
// ============================================================

function FloatingMenuButton() {
  return (
    <Pressable className="absolute bottom-9 right-5 flex-row items-center gap-2 rounded-2xl bg-[#252837] px-5 py-4 shadow-xl">
      <MaterialCommunityIcons color="#FFFFFF" name="silverware-fork-knife" size={26} />
      <Text className="text-xl font-black text-white">Menu</Text>
    </Pressable>
  );
}

// ============================================================
// Restaurant Checkout Bar Component
// ============================================================

function RestaurantCheckoutBar({ itemCount }: { itemCount: number }) {
  return (
    <Pressable
      className="absolute bottom-7 left-5 right-36 rounded-2xl bg-gozyGreen px-5 py-4 shadow-xl"
      onPress={() => router.push('/food-checkout')}>
      <Text className="text-center text-lg font-black text-white">{itemCount} item added · Checkout</Text>
    </Pressable>
  );
}
