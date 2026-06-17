import { useMemo, useRef, useState } from 'react';
import {
  Animated,
  Image,
  Modal,
  Pressable,
  type PressableProps,
  ScrollView,
  type StyleProp,
  Text,
  TextInput,
  View,
  type ViewStyle,
} from 'react-native';
import { router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { SkeletonCard } from '@/src/components/skeleton-card';
import { useApp } from '@/src/context/app-context';
import { useSuperAppStore } from '@/src/store/super-app-store';
import type { Restaurant } from '@/src/types';

// ============================================================
// Food Page Data
// ============================================================

// ============================================================
// Tailwind Color Guide For This Food Screen
// ============================================================
// Main background colour: bg-white
// Main brand red background colour: bg-gozyRed / #EC1746
// Search and card background colour: bg-white
// Active pink accent colour: bg-gozyPink / #EF3F68
// Veg mode and rating green colour: bg-gozyGreen / #00A86B
// Bottom navigation background colour: bg-white

type FoodCategory = {
  id: string;
  label: string;
  image: string;
  badge?: string;
};

const foodCategories: FoodCategory[] = [
  {
    id: 'under-250',
    label: 'Under Rs 250',
    image:
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80',
    badge: 'Explore',
  },
  {
    id: 'all',
    label: 'All',
    image:
      'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'chicken',
    label: 'Chicken',
    image:
      'https://images.unsplash.com/photo-1527477396000-e27163b481c2?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'pizza',
    label: 'Pizza',
    image:
      'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'biryani',
    label: 'Biryani',
    image:
      'https://images.unsplash.com/photo-1563379091339-03246963d29a?auto=format&fit=crop&w=400&q=80',
  },
];

const filters = ['Filters', 'Under Rs 150', 'Schedule', 'Great Offers', 'Rating 4.0+'];

const cardOffers = [
  'Rs 40 OFF above Rs 149',
  '50% OFF select items',
  'Rs 60 OFF above Rs 199',
  '55% OFF select items',
];

type FilterTab = {
  id: string;
  label: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
};

const filterTabs: FilterTab[] = [
  { id: 'sort', label: 'Sort by', icon: 'sort-variant' },
  { id: 'time', label: 'Time', icon: 'timer-outline' },
  { id: 'rating', label: 'Rating', icon: 'star-outline' },
  { id: 'offers', label: 'Offers', icon: 'brightness-percent' },
  { id: 'price', label: 'Dish Price', icon: 'currency-inr' },
  { id: 'trust', label: 'Trust Markers', icon: 'shield-check-outline' },
  { id: 'collections', label: 'Collections', icon: 'file-document-outline' },
];

const sortOptions = [
  'Relevance',
  'Distance: Low to High',
  'Rating: High to Low',
  'Delivery Time: Low to High',
  'Cost for one: Low to High',
  'Cost for one: High to Low',
] as const;

const exploreMoreItems = [
  { id: 'offers', title: 'Offers', icon: 'tag-percent', color: '#2F80ED' },
  { id: 'play', title: 'Play & win', icon: 'cricket', color: '#2563EB' },
  { id: 'top10', title: 'Top 10', icon: 'map-marker-star', color: '#F6B600' },
  { id: 'train', title: 'Food on train', icon: 'train', color: '#60A5FA' },
];

const spotlightTitles = ['Legend Sardar', 'A One Chicken Biryani', 'Chaap Platform'];

type FoodMode = 'delivery' | 'under-250' | 'dining';
type FoodSortOption = (typeof sortOptions)[number];

type FoodFilterState = {
  selectedSort: FoodSortOption;
  selectedRating: string | null;
  selectedPrice: string | null;
  selectedOffer: string | null;
  selectedTrust: string | null;
};

const defaultFoodFilters: FoodFilterState = {
  selectedSort: 'Relevance',
  selectedRating: null,
  selectedPrice: null,
  selectedOffer: null,
  selectedTrust: null,
};

const getFirstNumber = (value: string) => Number(value.match(/\d+(\.\d+)?/)?.[0] ?? 0);
const getLowestMenuPrice = (restaurant: Restaurant) =>
  Math.min(...restaurant.menu.map((item) => item.price));
const hasMenuPriceBetween = (restaurant: Restaurant, min: number, max = Number.POSITIVE_INFINITY) =>
  restaurant.menu.some((item) => item.price >= min && item.price <= max);

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type BouncyPressableProps = Omit<PressableProps, 'style'> & {
  className?: string;
  scaleTo?: number;
  style?: StyleProp<ViewStyle>;
};

function BouncyPressable({
  onPressIn,
  onPressOut,
  scaleTo = 0.96,
  style,
  ...props
}: BouncyPressableProps) {
  const scale = useRef(new Animated.Value(1)).current;

  const animateTo = (value: number) => {
    Animated.spring(scale, {
      damping: 14,
      mass: 0.8,
      stiffness: 260,
      toValue: value,
      useNativeDriver: true,
    }).start();
  };

  return (
    <AnimatedPressable
      {...props}
      onPressIn={(event) => {
        animateTo(scaleTo);
        onPressIn?.(event);
      }}
      onPressOut={(event) => {
        animateTo(1);
        onPressOut?.(event);
      }}
      style={[style, { transform: [{ scale }] }]}
    />
  );
}

// ============================================================
// Main Food Screen
// ============================================================

export default function FoodScreen() {
  const { isHydrating, restaurants, session } = useApp();
  const { foodCart, setSelectedRestaurant } = useSuperAppStore();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [vegMode, setVegMode] = useState(false);
  const [activeMode, setActiveMode] = useState<FoodMode>('delivery');
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [foodFilters, setFoodFilters] = useState<FoodFilterState>(defaultFoodFilters);
  const scrollY = useRef<ScrollView>(null);

  const activeFilterCount = [
    foodFilters.selectedSort !== 'Relevance',
    foodFilters.selectedRating !== null,
    foodFilters.selectedPrice !== null,
    foodFilters.selectedOffer !== null,
    foodFilters.selectedTrust !== null,
  ].filter(Boolean).length;

  const recommendedRestaurants = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    const baseRestaurants = restaurants.filter((restaurant) => {
      const cuisine = restaurant.cuisine.toLowerCase();
      const menuNames = restaurant.menu.map((item) => item.name.toLowerCase());
      const menuPrices = restaurant.menu.map((item) => item.price);

      const matchesSearch =
        query.length === 0 ||
        restaurant.name.toLowerCase().includes(query) ||
        cuisine.includes(query) ||
        menuNames.some((name) => name.includes(query));

      const matchesCategory =
        selectedCategory === 'all' ||
        (selectedCategory === 'under-250' && menuPrices.some((price) => price <= 250)) ||
        cuisine.includes(selectedCategory) ||
        menuNames.some((name) => name.includes(selectedCategory));

      const matchesVegMode = !vegMode || restaurant.menu.some((item) => item.isVeg);
      const matchesMode =
        activeMode === 'delivery' ||
        (activeMode === 'under-250' && menuPrices.some((price) => price <= 250)) ||
        (activeMode === 'dining' && restaurant.rating >= 4.5);

      return matchesSearch && matchesCategory && matchesVegMode && matchesMode;
    });

    const categoryRestaurants =
      selectedCategory === 'pizza' && baseRestaurants.length === 0
        ? restaurants.filter((restaurant) => {
            const matchesVegMode = !vegMode || restaurant.menu.some((item) => item.isVeg);
            return matchesVegMode && restaurant.rating >= 4;
          })
        : baseRestaurants;

    const filteredRestaurants = categoryRestaurants.filter((restaurant) => {
      const offer = restaurant.offer.toLowerCase();
      const matchesRating =
        foodFilters.selectedRating === null ||
        restaurant.rating >= Number(foodFilters.selectedRating.replace('+', ''));

      const matchesPrice =
        foodFilters.selectedPrice === null ||
        (foodFilters.selectedPrice === 'under-150' && hasMenuPriceBetween(restaurant, 0, 150)) ||
        (foodFilters.selectedPrice === '150-300' && hasMenuPriceBetween(restaurant, 150, 300)) ||
        (foodFilters.selectedPrice === 'above-300' && hasMenuPriceBetween(restaurant, 300));

      const matchesOffer =
        foodFilters.selectedOffer === null ||
        (foodFilters.selectedOffer === 'bogo' && (offer.includes('buy') || offer.includes('free'))) ||
        (foodFilters.selectedOffer === 'deals' &&
          (offer.includes('off') || offer.includes('free') || offer.includes('deal')));

      const matchesTrust =
        foodFilters.selectedTrust === null ||
        (foodFilters.selectedTrust === 'veg' && restaurant.menu.some((item) => item.isVeg)) ||
        foodFilters.selectedTrust === 'no-packaging' ||
        foodFilters.selectedTrust === 'low-plastic';

      return matchesRating && matchesPrice && matchesOffer && matchesTrust;
    });

    const sortedRestaurants = [...filteredRestaurants];

    switch (foodFilters.selectedSort) {
      case 'Distance: Low to High':
        sortedRestaurants.sort((a, b) => getFirstNumber(a.distance) - getFirstNumber(b.distance));
        break;
      case 'Rating: High to Low':
        sortedRestaurants.sort((a, b) => b.rating - a.rating);
        break;
      case 'Delivery Time: Low to High':
        sortedRestaurants.sort((a, b) => getFirstNumber(a.eta) - getFirstNumber(b.eta));
        break;
      case 'Cost for one: Low to High':
        sortedRestaurants.sort((a, b) => getLowestMenuPrice(a) - getLowestMenuPrice(b));
        break;
      case 'Cost for one: High to Low':
        sortedRestaurants.sort((a, b) => getLowestMenuPrice(b) - getLowestMenuPrice(a));
        break;
      case 'Relevance':
      default:
        break;
    }

    return sortedRestaurants;
  }, [activeMode, foodFilters, restaurants, searchQuery, selectedCategory, vegMode]);

  if (isHydrating) {
    return (
      <SafeAreaView className="flex-1 gap-6 bg-white p-6">
        <SkeletonCard height={260} />
        <SkeletonCard height={120} />
        <SkeletonCard height={280} />
      </SafeAreaView>
    );
  }

  const openRestaurant = (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant.id);
    router.push('/food-restaurant');
  };

  const scrollToFeed = () => {
    scrollY.current?.scrollTo({ animated: true, y: 520 });
  };

  const selectCategory = (categoryId: string) => {
    setSelectedCategory(categoryId);
    if (categoryId === 'under-250') {
      setActiveMode('under-250');
    } else if (activeMode === 'under-250') {
      setActiveMode('delivery');
    }
    scrollToFeed();
  };

  const selectMode = (mode: FoodMode) => {
    setActiveMode(mode);
    setSelectedCategory(mode === 'under-250' ? 'under-250' : 'all');
    scrollToFeed();
  };

  const userName = session?.user.name?.trim() || 'Guest';
  const userCity = session?.user.city?.trim() || 'your area';
  const avatarInitial = userName.charAt(0).toUpperCase();
  const deliverySubtitle = `${userCity} • ${restaurants.length} restaurants delivering now`;

  return (
    // ========================================================
    // Page Background Colour Section
    // This is the full food page wrapper. Change bg-white here
    // if you want the whole screen background colour to change.
    // ========================================================
    <View className="flex-1 bg-white">
      <ScrollView
        ref={scrollY}
        contentContainerClassName="pb-32"
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[3]}>
        {/* ====================================================
            Top Red Header Section
            Includes location, Gold pill, cart icon, avatar, and veg mode.
        ==================================================== */}
        <FoodHeader
          avatarInitial={avatarInitial}
          cartCount={foodCart.length}
          deliverySubtitle={deliverySubtitle}
          vegMode={vegMode}
          onToggleVegMode={setVegMode}
        />

        {/* ====================================================
            Floating Search Bar Section
            Search input sits over the red promo background.
        ==================================================== */}
        <FoodSearchBar searchQuery={searchQuery} onChangeSearch={setSearchQuery} />

        {/* ====================================================
            Red Offer Background / Promo Banner Section
            This is the big red 50% off visual block.
        ==================================================== */}
        <PromoHero onOrderNow={scrollToFeed} />

        {/* ====================================================
            Sticky Scrolled Search + Category Section
            This pins to the top after the hero scrolls away.
        ==================================================== */}
        <ScrolledFoodControls
          searchQuery={searchQuery}
          selectedCategory={selectedCategory}
          vegMode={vegMode}
          onChangeSearch={setSearchQuery}
          onSelectCategory={selectCategory}
          onToggleVegMode={setVegMode}
        />

        {/* ====================================================
            Filter Chips Section
            Restores Filters / Under Rs 150 / Schedule options.
        ==================================================== */}
        <FilterRail
          activeFilterCount={activeFilterCount}
          filtersVisible={filtersVisible}
          onOpenFilters={() => setFiltersVisible(true)}
        />

        {/* ====================================================
            Recommended Food Cards Section
            Large feed cards shown under the sticky scrolled header.
        ==================================================== */}
        <RestaurantFeed restaurants={recommendedRestaurants} onRestaurantPress={openRestaurant} />
      </ScrollView>

      {/* ======================================================
          Bottom Floating Food Navigation Section
          Delivery / Under Rs 250 / Dining.
      ====================================================== */}
      <FloatingModeBar activeMode={activeMode} onSelectMode={selectMode} />

      {/* ======================================================
          Filters and Sorting Modal Section
          Opens when the Filters chip is pressed.
      ====================================================== */}
      <FoodFilterSheet
        filters={foodFilters}
        onChangeFilters={setFoodFilters}
        visible={filtersVisible}
        onClose={() => setFiltersVisible(false)}
      />

    </View>
  );
}

// ============================================================
// Top Search Header Component
// ============================================================

type ScrolledFoodControlsProps = {
  searchQuery: string;
  selectedCategory: string;
  vegMode: boolean;
  onChangeSearch: (value: string) => void;
  onSelectCategory: (categoryId: string) => void;
  onToggleVegMode: (enabled: boolean) => void;
};

function ScrolledFoodControls({
  searchQuery,
  selectedCategory,
  vegMode,
  onChangeSearch,
  onSelectCategory,
  onToggleVegMode,
}: ScrolledFoodControlsProps) {
  return (
    <View className="z-20 bg-white shadow-sm">
      <FoodTopSearchHeader
        searchQuery={searchQuery}
        vegMode={vegMode}
        onChangeSearch={onChangeSearch}
        onToggleVegMode={onToggleVegMode}
      />
      <CategoryRail selectedCategory={selectedCategory} onSelectCategory={onSelectCategory} />
    </View>
  );
}

type FoodTopSearchHeaderProps = {
  searchQuery: string;
  vegMode: boolean;
  onChangeSearch: (value: string) => void;
  onToggleVegMode: (enabled: boolean) => void;
};

function FoodTopSearchHeader({
  searchQuery,
  vegMode,
  onChangeSearch,
  onToggleVegMode,
}: FoodTopSearchHeaderProps) {
  return (
    <SafeAreaView className="bg-white">
      <View className="flex-row items-center gap-3 px-5 pb-5 pt-3">
        {/* Search Bar Section */}
        <View className="min-h-[64px] flex-1 flex-row items-center gap-3 rounded-2xl border border-gray-100 bg-white px-4 shadow">
          <MaterialCommunityIcons color="#EF3F68" name="magnify" size={30} />
          <TextInput
            autoCapitalize="none"
            className="min-w-0 flex-1 py-3 text-xl font-semibold text-gray-950"
            onChangeText={onChangeSearch}
            placeholder="Restaurant name or a dish..."
            placeholderTextColor="#7C8291"
            value={searchQuery}
          />
          <View className="h-9 w-px bg-gray-100" />
          <MaterialCommunityIcons color="#EF3F68" name="microphone-outline" size={25} />
        </View>

        {/* Veg Mode Toggle Section */}
        <View className="items-center gap-1">
          <Text className="text-center text-[13px] font-black leading-[14px] text-gray-950">
            VEG{'\n'}MODE
          </Text>
          <BouncyPressable
            accessibilityRole="switch"
            accessibilityState={{ checked: vegMode }}
            className={`h-8 w-[54px] rounded-full p-[3px] ${vegMode ? 'bg-gozyGreen' : 'bg-gray-300'}`}
            onPress={() => onToggleVegMode(!vegMode)}>
            <View className={`h-[26px] w-[26px] rounded-full bg-white ${vegMode ? 'self-end' : 'self-start'}`} />
          </BouncyPressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

// ============================================================
// Header Component
// ============================================================

type FoodHeaderProps = {
  avatarInitial: string;
  cartCount: number;
  deliverySubtitle: string;
  vegMode: boolean;
  onToggleVegMode: (enabled: boolean) => void;
};

function FoodHeader({
  avatarInitial,
  cartCount,
  deliverySubtitle,
  vegMode,
  onToggleVegMode,
}: FoodHeaderProps) {
  return (
    // ========================================================
    // Header Background Colour
    // bg-gozyRed controls the red top area behind location/actions.
    // ========================================================
    <View className="min-h-[186px] overflow-hidden bg-gozyRed px-5 pt-8">
      {/* Location + Header Action Buttons Row */}
      <View className="flex-row items-start justify-between gap-3">
        {/* Location Text Block */}
        <View className="min-w-0 flex-1">
          <View className="flex-row items-center">
            <MaterialCommunityIcons color="#FFFFFF" name="map-marker" size={26} />
            <Text className="text-[26px] font-black text-white">Home</Text>
            <MaterialCommunityIcons color="#FFFFFF" name="chevron-down" size={24} />
          </View>
          <Text className="mt-1 pr-2 text-sm font-bold text-white/90" numberOfLines={1}>
            {deliverySubtitle}
          </Text>
        </View>

        {/* Gold, Cart, and Avatar Buttons */}
        <View className="flex-row items-center gap-2">
          <View className="min-w-[62px] items-center rounded-full bg-[#FFF7D6] py-1.5 shadow-lg">
            <Text className="text-[11px] font-black text-[#A36B00]">GOLD</Text>
            <Text className="-mt-0.5 text-[13px] font-black text-[#7A4A00]">Rs 1</Text>
          </View>

          <BouncyPressable
            className="h-11 w-11 items-center justify-center rounded-full bg-[#FFA4B4]"
            onPress={() => router.push('/food-checkout')}>
            <MaterialCommunityIcons color="#111827" name="ticket-percent-outline" size={20} />
            {cartCount > 0 ? <View className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-gozyGreen" /> : null}
          </BouncyPressable>

          <View className="h-11 w-11 items-center justify-center rounded-full bg-[#BFE0FF]">
            <Text className="text-[25px] font-black text-[#074AA2]">{avatarInitial}</Text>
          </View>
        </View>
      </View>

      {/* Veg Mode Toggle Section */}
      <View className="absolute bottom-4 right-5 items-center gap-1.5">
        <Text className="text-center text-[13px] font-black leading-[15px] text-white">
          VEG{'\n'}MODE
        </Text>
        <BouncyPressable
          accessibilityRole="switch"
          accessibilityState={{ checked: vegMode }}
          className={`h-8 w-[55px] rounded-full p-[3px] ${vegMode ? 'bg-gozyGreen' : 'bg-[#A9B0B8]'}`}
          onPress={() => onToggleVegMode(!vegMode)}>
          <View className={`h-[26px] w-[26px] rounded-full bg-white ${vegMode ? 'self-end' : 'self-start'}`} />
        </BouncyPressable>
      </View>
    </View>
  );
}

// ============================================================
// Search Bar Component
// ============================================================

type FoodSearchBarProps = {
  searchQuery: string;
  onChangeSearch: (value: string) => void;
};

function FoodSearchBar({ searchQuery, onChangeSearch }: FoodSearchBarProps) {
  return (
    // ========================================================
    // Search Bar Container
    // bg-white is the search bar background colour.
    // shadow-xl gives the floating card effect.
    // ========================================================
    <View className="z-10 mx-5 -mt-12 min-h-[68px] flex-row items-center gap-3 rounded-3xl bg-white px-5 shadow-xl">
      {/* Search Icon */}
      <MaterialCommunityIcons color="#EF3F68" name="magnify" size={30} />

      {/* Search Text Input */}
      <TextInput
        autoCapitalize="none"
        className="min-w-0 flex-1 py-3 text-xl font-semibold text-gray-950"
        onChangeText={onChangeSearch}
        placeholder='Search "spicy biryani"'
        placeholderTextColor="#7C8291"
        value={searchQuery}
      />

      {/* Search Bar Divider */}
      <View className="h-9 w-px bg-[#EDF0F4]" />

      {/* Voice Search Icon */}
      <MaterialCommunityIcons color="#EF3F68" name="microphone-outline" size={26} />
    </View>
  );
}

// ============================================================
// Promo Hero Component
// ============================================================

type PromoHeroProps = {
  onOrderNow: () => void;
};

function PromoHero({ onOrderNow }: PromoHeroProps) {
  return (
    // ========================================================
    // Promo Hero Background Colour
    // bg-gozyRed controls the big red offer banner background.
    // ========================================================
    <View className="-mt-10 min-h-[300px] items-center justify-center overflow-hidden bg-gozyRed pt-20">
      {/* Abstract Red Burst Background Shapes */}
      <View className="absolute h-32 w-[360px] rotate-[-13deg] bg-[#FF4E68]" />
      <View className="absolute h-[118px] w-[330px] rotate-[26deg] bg-[#FF6378]" />
      <View className="absolute h-[104px] w-[300px] rotate-[56deg] bg-[#D50837] opacity-70" />

      {/* Discount Ticket Decorations */}
      <Text className="absolute left-[72px] top-[126px] rotate-[-18deg] text-[38px] font-black text-[#FFD426]">
        %
      </Text>
      <Text className="absolute right-[76px] top-[92px] rotate-[13deg] text-[32px] font-black text-[#FFD426]">
        %
      </Text>

      {/* Main Promo Text */}
      <Text className="text-[48px] font-black italic text-[#FFD426]">ITEMS AT</Text>
      <Text className="-mt-2 text-[58px] font-black italic text-[#FFF8EF]">50% OFF</Text>

      {/* Order Now Button */}
      <BouncyPressable className="mt-3 flex-row items-center gap-1 rounded-full bg-black px-6 py-3" onPress={onOrderNow}>
        <Text className="text-base font-black text-white">Order now</Text>
        <MaterialCommunityIcons color="#FFFFFF" name="chevron-right" size={20} />
      </BouncyPressable>

      {/* Promo Carousel Dots */}
      <View className="mt-6 flex-row items-center gap-2">
        <View className="h-2 w-2 rounded-full bg-white/40" />
        <View className="h-2.5 w-2.5 rounded-full bg-white" />
        <View className="h-2 w-2 rounded-full bg-white/40" />
        <View className="h-2 w-2 rounded-full bg-white/40" />
      </View>
    </View>
  );
}

// ============================================================
// Category Rail Component
// ============================================================

type CategoryRailProps = {
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
};

function CategoryRail({ selectedCategory, onSelectCategory }: CategoryRailProps) {
  return (
    // ========================================================
    // Food Categories Background Colour
    // bg-white keeps the category rail clean under the red hero.
    // ========================================================
    <ScrollView
      className="border-b border-[#EDF0F4] bg-white"
      contentContainerClassName="gap-5 px-5 pt-4"
      horizontal
      showsHorizontalScrollIndicator={false}>
      {foodCategories.map((category) => {
        const isSelected = category.id === selectedCategory;

        return (
          <BouncyPressable
            className="w-[82px] items-center gap-2"
            key={category.id}
            onPress={() => onSelectCategory(category.id)}>
            {/* Category Food Image */}
            <Image className="h-[50px] w-[66px] rounded-2xl" resizeMode="cover" source={{ uri: category.image }} />

            {/* Optional Category Badge */}
            {category.badge ? (
              <Text className="absolute top-8 overflow-hidden rounded-full bg-[#0078A8] px-2 py-0.5 text-[10px] font-black text-white">
                {category.badge}
              </Text>
            ) : null}

            {/* Category Label */}
            <Text className="max-w-[82px] text-sm font-bold text-gray-950" numberOfLines={1}>
              {category.label}
            </Text>

            {/* Active Category Pink Underline */}
            <View className={`h-1 w-[58px] rounded-t ${isSelected ? 'bg-gozyPink' : 'bg-transparent'}`} />
          </BouncyPressable>
        );
      })}
    </ScrollView>
  );
}

// ============================================================
// Filter Rail Component
// ============================================================

type FilterRailProps = {
  activeFilterCount: number;
  filtersVisible: boolean;
  onOpenFilters: () => void;
};

function FilterRail({ activeFilterCount, filtersVisible, onOpenFilters }: FilterRailProps) {
  const filterChipActive = filtersVisible || activeFilterCount > 0;

  return (
    // ========================================================
    // Filter Chips Section
    // Each Pressable below is one filter chip.
    // ========================================================
    <ScrollView
      contentContainerClassName="gap-3 px-5 py-5"
      horizontal
      showsHorizontalScrollIndicator={false}>
      {filters.map((filter) => (
        <BouncyPressable
          // Filter Chip CSS: border, white background, spacing, shadow.
          className={`min-h-[44px] flex-row items-center gap-1.5 rounded-xl border px-3.5 shadow ${
            filter === 'Filters' && filterChipActive
              ? 'border-gozyPink bg-[#FFF3F6]'
              : 'border-gray-200 bg-white'
          }`}
          key={filter}
          onPress={filter === 'Filters' ? onOpenFilters : undefined}>
          {filter === 'Filters' ? (
            <MaterialCommunityIcons
              color={filterChipActive ? '#EF3F68' : '#1F2937'}
              name="tune-variant"
              size={18}
            />
          ) : null}
          <Text
            className={`text-sm font-extrabold ${
              filter === 'Filters' && filterChipActive ? 'text-gozyPink' : 'text-gray-800'
            }`}>
            {filter}
          </Text>
          {filter === 'Filters' && activeFilterCount > 0 ? (
            <View className="h-5 min-w-5 items-center justify-center rounded-full bg-gozyPink px-1.5">
              <Text className="text-[11px] font-black text-white">{activeFilterCount}</Text>
            </View>
          ) : null}
          {filter === 'Filters' || filter === 'Schedule' ? (
            <MaterialCommunityIcons
              color={filter === 'Filters' && filterChipActive ? '#EF3F68' : '#1F2937'}
              name="chevron-down"
              size={18}
            />
          ) : null}
        </BouncyPressable>
      ))}
    </ScrollView>
  );
}

// ============================================================
// Quick ETA Row Component
// ============================================================

function QuickEtaRow() {
  return (
    <View className="flex-row items-center gap-8 px-5 pb-9">
      <View className="flex-row items-center gap-1">
        <MaterialCommunityIcons color="#00A86B" name="lightning-bolt" size={20} />
        <Text className="text-base font-black text-gozyGreen">25-30 mins</Text>
      </View>
      <View className="flex-row items-center gap-1">
        <MaterialCommunityIcons color="#6B7280" name="clock-outline" size={20} />
        <Text className="text-base font-bold text-gray-500">50-55 mins</Text>
      </View>
      <View className="flex-row items-center gap-1">
        <MaterialCommunityIcons color="#6B7280" name="clock-outline" size={20} />
        <Text className="text-base font-bold text-gray-500">55-60 mins</Text>
      </View>
    </View>
  );
}

// ============================================================
// Explore More Section Component
// ============================================================

function ExploreMoreSection() {
  return (
    <View className="gap-5 pb-10">
      <Text className="px-5 text-base font-extrabold text-[#737A88]">EXPLORE MORE</Text>
      <ScrollView
        contentContainerClassName="gap-4 px-5"
        horizontal
        showsHorizontalScrollIndicator={false}>
        {exploreMoreItems.map((item) => (
          <BouncyPressable
            className="h-[118px] w-[128px] items-center justify-center gap-3 rounded-2xl border border-gray-100 bg-white shadow-sm"
            key={item.id}>
            <MaterialCommunityIcons color={item.color} name={item.icon as never} size={46} />
            <Text className="text-center text-lg font-black text-gray-900">{item.title}</Text>
          </BouncyPressable>
        ))}
      </ScrollView>
    </View>
  );
}

// ============================================================
// Spotlight Carousel Section Component
// ============================================================

type SpotlightSectionProps = {
  restaurants: Restaurant[];
  onRestaurantPress: (restaurant: Restaurant) => void;
};

function SpotlightSection({ restaurants, onRestaurantPress }: SpotlightSectionProps) {
  const spotlightRestaurants = restaurants.slice(0, 3);

  if (!spotlightRestaurants.length) {
    return null;
  }

  return (
    <View className="gap-5 pb-10">
      <Text className="px-5 text-base font-extrabold text-[#737A88]">IN THE SPOTLIGHT</Text>
      <ScrollView
        contentContainerClassName="gap-5 px-5"
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToAlignment="center">
        {spotlightRestaurants.map((restaurant, index) => (
          <BouncyPressable
            className="h-[190px] w-[270px] overflow-hidden rounded-3xl bg-gray-100"
            key={restaurant.id}
            onPress={() => onRestaurantPress(restaurant)}>
            <Image className="h-full w-full" resizeMode="cover" source={{ uri: restaurant.image }} />
            <View className="absolute inset-0 bg-black/25" />
            <MaterialCommunityIcons
              color="#FFFFFF"
              name="bookmark-outline"
              size={30}
              style={{ position: 'absolute', right: 14, top: 14 }}
            />
            <View className="absolute bottom-5 left-5 right-5">
              <Text className="text-2xl font-black text-white">{restaurant.offer}</Text>
              <View className="mt-2 flex-row items-center justify-between">
                <Text className="max-w-[170px] text-3xl font-black text-white" numberOfLines={1}>
                  {spotlightTitles[index] ?? restaurant.name}
                </Text>
                <View className="flex-row items-center gap-1 rounded-full bg-gozyGreen px-2 py-1">
                  <MaterialCommunityIcons color="#FFFFFF" name="star" size={15} />
                  <Text className="text-base font-black text-white">{restaurant.rating.toFixed(1)}</Text>
                </View>
              </View>
            </View>
          </BouncyPressable>
        ))}
      </ScrollView>
      <View className="flex-row justify-center gap-2">
        <View className="h-2.5 w-2.5 rounded-full bg-gozyPink" />
        <View className="h-2.5 w-2.5 rounded-full bg-gray-300" />
        <View className="h-2.5 w-2.5 rounded-full bg-gray-300" />
        <View className="h-2.5 w-2.5 rounded-full bg-gray-300" />
      </View>
    </View>
  );
}

// ============================================================
// Large Restaurant Feed Section Component
// ============================================================

type RestaurantFeedProps = {
  restaurants: Restaurant[];
  onRestaurantPress: (restaurant: Restaurant) => void;
};

function RestaurantFeed({ restaurants, onRestaurantPress }: RestaurantFeedProps) {
  if (restaurants.length === 0) {
    return (
      <View className="mx-5 rounded-3xl bg-[#FFF1F4] p-6">
        <Text className="text-xl font-black text-gray-950">No matches found</Text>
        <Text className="mt-2 text-base text-gray-500">Try another dish, cuisine, or turn off veg mode.</Text>
      </View>
    );
  }

  return (
    <View className="gap-8 px-5 pt-0">
      {restaurants.map((restaurant, index) => (
        <LargeRestaurantCard
          key={restaurant.id}
          offer={cardOffers[index % cardOffers.length]}
          restaurant={restaurant}
          urgent={index === 0}
          onPress={() => onRestaurantPress(restaurant)}
        />
      ))}
    </View>
  );
}

// ============================================================
// Large Restaurant Card Component
// ============================================================

type LargeRestaurantCardProps = {
  restaurant: Restaurant;
  offer: string;
  urgent: boolean;
  onPress: () => void;
};

function LargeRestaurantCard({ restaurant, offer, urgent, onPress }: LargeRestaurantCardProps) {
  const primaryCuisine = restaurant.cuisine.split(',')[0]?.trim() || 'Food';

  return (
    <BouncyPressable className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-lg" onPress={onPress}>
      <View className="h-[300px] overflow-hidden">
        <Image className="h-full w-full" resizeMode="cover" source={{ uri: restaurant.image }} />
        <Text className="absolute left-4 top-4 rounded-md bg-black/70 px-2 py-1 text-base font-bold text-white">
          {primaryCuisine} · {restaurant.priceForTwo.replace('Rs ', '₹').replace('for two', 'for one')}
        </Text>
        <MaterialCommunityIcons
          color="#FFFFFF"
          name="bookmark-outline"
          size={34}
          style={{ position: 'absolute', right: 16, top: 14 }}
        />
        <Text className="absolute bottom-0 left-0 bg-[#087BE8] px-4 py-2 text-lg font-black text-white">
          Free delivery with Gold
        </Text>
        <View className="absolute bottom-4 right-4 flex-row items-center gap-2">
          <View className="h-2.5 w-6 rounded-full bg-white" />
          {[0, 1, 2, 3, 4, 5, 6].map((dot) => (
            <View className="h-2.5 w-2.5 rounded-full bg-white/60" key={dot} />
          ))}
        </View>
      </View>

      <View className="gap-2 px-5 py-4">
        <View className="flex-row items-start justify-between gap-3">
          <Text className="flex-1 text-[32px] font-black text-gray-950" numberOfLines={1}>
            {restaurant.name}
          </Text>
          <View className="items-center">
            <View className="flex-row items-center gap-1 rounded-full bg-gozyGreen px-2 py-1">
              <MaterialCommunityIcons color="#FFFFFF" name="star" size={17} />
              <Text className="text-lg font-black text-white">{restaurant.rating.toFixed(1)}</Text>
            </View>
            <Text className="mt-1 text-sm font-bold text-gray-400">1K+ ratings</Text>
          </View>
        </View>

        <View className="flex-row items-center gap-2">
          <MaterialCommunityIcons
            color={urgent ? '#00A86B' : '#6B7280'}
            name={urgent ? 'lightning-bolt' : 'clock-outline'}
            size={22}
          />
          <Text className={`text-lg font-bold ${urgent ? 'text-gozyGreen' : 'text-gray-500'}`}>
            {urgent ? `Near & Fast` : restaurant.eta}
          </Text>
          {!urgent ? (
            <>
              <Text className="text-lg font-bold text-gray-300">|</Text>
              <Text className="text-lg font-bold text-gray-500">{restaurant.distance}</Text>
            </>
          ) : null}
        </View>

        <View className="flex-row items-center gap-2">
          <MaterialCommunityIcons color="#2F80ED" name="brightness-percent" size={22} />
          <Text className="text-lg font-black text-gray-600">{offer}</Text>
        </View>

        {restaurant.menu.some((item) => item.isVeg) ? (
          <View className="mt-2 self-start flex-row items-center gap-1 rounded-full bg-gray-100 px-3 py-2">
            <MaterialCommunityIcons color="#00A86B" name="leaf" size={20} />
            <Text className="text-base font-bold text-gray-600">Pure Veg restaurant</Text>
          </View>
        ) : null}
      </View>
    </BouncyPressable>
  );
}

// ============================================================
// Filters and Sorting Bottom Sheet Component
// ============================================================

type FoodFilterSheetProps = {
  filters: FoodFilterState;
  onChangeFilters: (filters: FoodFilterState) => void;
  visible: boolean;
  onClose: () => void;
};

function FoodFilterSheet({ filters, onChangeFilters, visible, onClose }: FoodFilterSheetProps) {
  const [activeTab, setActiveTab] = useState('sort');
  const { selectedOffer, selectedPrice, selectedRating, selectedSort, selectedTrust } = filters;

  const updateFilters = (updates: Partial<FoodFilterState>) => {
    onChangeFilters({ ...filters, ...updates });
  };

  const hasSelectedFilters =
    selectedSort !== 'Relevance' ||
    selectedRating !== null ||
    selectedPrice !== null ||
    selectedOffer !== null ||
    selectedTrust !== null;

  const clearFilters = () => {
    onChangeFilters(defaultFoodFilters);
    setActiveTab('sort');
  };

  return (
    <Modal animationType="fade" onRequestClose={onClose} transparent visible={visible}>
      {/* ======================================================
          Filter Modal Dark Overlay Background
          bg-black/60 creates the dimmed food page behind sheet.
      ====================================================== */}
      <View className="flex-1 justify-end bg-black/60">
        {/* Filter Modal Close X Button */}
        <BouncyPressable
          accessibilityLabel="Close filters"
          className="mb-7 h-16 w-16 self-center items-center justify-center rounded-full bg-[#252837]"
          onPress={onClose}>
          <MaterialCommunityIcons color="#FFFFFF" name="close" size={36} />
        </BouncyPressable>

        {/* Filter Modal White Bottom Sheet */}
        <View className="h-[80%] overflow-hidden rounded-t-2xl bg-white">
          {/* Filter Modal Header */}
          <View className="min-h-[82px] flex-row items-center justify-between border-b border-gray-200 px-5">
            <Text className="text-[26px] font-black text-gray-900">Filters and sorting</Text>
            <BouncyPressable onPress={clearFilters}>
              <Text className="text-xl font-bold text-gray-400">Clear all</Text>
            </BouncyPressable>
          </View>

          {/* Filter Modal Body: Left Tabs + Right Content */}
          <View className="flex-1 flex-row">
            {/* Left Filter Category Tabs */}
            <View className="w-[112px] border-r border-gray-200 bg-white">
              {filterTabs.map((tab) => {
                const active = activeTab === tab.id;

                return (
                  <BouncyPressable
                    className={`min-h-[96px] items-center justify-center gap-2 border-r-4 ${
                      active ? 'border-gozyPink bg-[#FFF3F6]' : 'border-transparent bg-white'
                    }`}
                    key={tab.id}
                    onPress={() => setActiveTab(tab.id)}>
                    <MaterialCommunityIcons
                      color={active ? '#EF3F68' : '#9CA3AF'}
                      name={tab.icon}
                      size={28}
                    />
                    <Text
                      className={`text-center text-[15px] font-extrabold ${
                        active ? 'text-gray-950' : 'text-gray-500'
                      }`}>
                      {tab.label}
                    </Text>
                  </BouncyPressable>
                );
              })}
            </View>

            {/* Right Filter Options Scroll Area */}
            <ScrollView
              className="flex-1 bg-white"
              contentContainerClassName="gap-5 px-4 py-6 pb-10"
              showsVerticalScrollIndicator={false}>
              <FilterSectionCard title="Sort by">
                <View className="overflow-hidden rounded-2xl bg-white">
                  {sortOptions.map((option) => {
                    const active = selectedSort === option;

                    return (
                      <BouncyPressable
                        className={`min-h-[70px] flex-row items-center justify-between border-b border-gray-100 px-5 ${
                          active ? 'bg-[#FFF3F6]' : 'bg-white'
                        }`}
                        key={option}
                        onPress={() => updateFilters({ selectedSort: option })}>
                        <Text className="text-lg font-bold text-gray-900">{option}</Text>
                        <View
                          className={`h-8 w-8 items-center justify-center rounded-full border-4 ${
                            active ? 'border-gozyPink' : 'border-gray-300'
                          }`}>
                          {active ? <View className="h-3.5 w-3.5 rounded-full bg-gozyPink" /> : null}
                        </View>
                      </BouncyPressable>
                    );
                  })}
                </View>
              </FilterSectionCard>

              <FilterSectionCard title="Time">
                <View className="flex-row">
                  <FilterOptionTile
                    icon="calendar-clock"
                    label="Schedule"
                    onPress={() => setActiveTab('time')}
                  />
                </View>
              </FilterSectionCard>

              <FilterSectionCard title="Restaurant Rating">
                <View className="flex-row gap-4">
                  <FilterOptionTile
                    active={selectedRating === '3.5+'}
                    icon="star"
                    label="Rated 3.5+"
                    onPress={() => updateFilters({ selectedRating: selectedRating === '3.5+' ? null : '3.5+' })}
                  />
                  <FilterOptionTile
                    active={selectedRating === '4.0+'}
                    icon="star"
                    label="Rated 4.0+"
                    onPress={() => updateFilters({ selectedRating: selectedRating === '4.0+' ? null : '4.0+' })}
                  />
                </View>
              </FilterSectionCard>

              <FilterSectionCard title="Offers">
                <View className="gap-3">
                  <FilterOptionPill
                    active={selectedOffer === 'bogo'}
                    label="Buy 1 Get 1 and more"
                    onPress={() => updateFilters({ selectedOffer: selectedOffer === 'bogo' ? null : 'bogo' })}
                  />
                  <FilterOptionPill
                    active={selectedOffer === 'deals'}
                    label="Deals of the Day"
                    onPress={() => updateFilters({ selectedOffer: selectedOffer === 'deals' ? null : 'deals' })}
                  />
                </View>
              </FilterSectionCard>

              <FilterSectionCard title="Dish Price">
                <View className="flex-row gap-3">
                  <FilterOptionTile
                    active={selectedPrice === 'under-150'}
                    icon="currency-inr"
                    label={'Under\nRs 150'}
                    onPress={() => updateFilters({ selectedPrice: selectedPrice === 'under-150' ? null : 'under-150' })}
                  />
                  <FilterOptionTile
                    active={selectedPrice === '150-300'}
                    icon="currency-inr"
                    label={'Rs 150 -\nRs 300'}
                    onPress={() => updateFilters({ selectedPrice: selectedPrice === '150-300' ? null : '150-300' })}
                  />
                  <FilterOptionTile
                    active={selectedPrice === 'above-300'}
                    icon="currency-inr"
                    label={'Above\nRs 300'}
                    onPress={() => updateFilters({ selectedPrice: selectedPrice === 'above-300' ? null : 'above-300' })}
                  />
                </View>
              </FilterSectionCard>

              <FilterSectionCard title="Trust Markers">
                <View className="flex-row flex-wrap gap-4">
                  <FilterOptionTile
                    active={selectedTrust === 'veg'}
                    icon="leaf-circle"
                    label="Pure Veg"
                    onPress={() => updateFilters({ selectedTrust: selectedTrust === 'veg' ? null : 'veg' })}
                  />
                  <FilterOptionTile
                    active={selectedTrust === 'no-packaging'}
                    icon="cash-remove"
                    label={'No Packaging\ncharges'}
                    onPress={() =>
                      updateFilters({ selectedTrust: selectedTrust === 'no-packaging' ? null : 'no-packaging' })
                    }
                  />
                  <FilterOptionTile
                    active={selectedTrust === 'low-plastic'}
                    icon="shopping-outline"
                    label={'Low plastic\npackaging'}
                    onPress={() => updateFilters({ selectedTrust: selectedTrust === 'low-plastic' ? null : 'low-plastic' })}
                  />
                </View>
              </FilterSectionCard>

              <FilterSectionCard title="Collections">
                <FilterOptionPill label="Previously ordered" onPress={() => setActiveTab('collections')} />
              </FilterSectionCard>
            </ScrollView>
          </View>

          {/* Filter Modal Bottom Action Buttons */}
          <View className="min-h-[92px] flex-row items-center gap-4 border-t border-gray-200 bg-white px-5">
            <BouncyPressable className="flex-1 items-center justify-center rounded-2xl py-4" onPress={onClose}>
              <Text className="text-2xl font-bold text-gray-600">Close</Text>
            </BouncyPressable>

            <BouncyPressable
              className={`flex-1 items-center justify-center rounded-2xl py-4 ${
                hasSelectedFilters ? 'bg-gozyPink' : 'bg-gray-200'
              }`}
              onPress={onClose}>
              <Text className={`text-xl font-black ${hasSelectedFilters ? 'text-white' : 'text-gray-400'}`}>
                Show results
              </Text>
            </BouncyPressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

// ============================================================
// Filter Sheet Section Card Component
// ============================================================

type FilterSectionCardProps = {
  title: string;
  children: React.ReactNode;
};

function FilterSectionCard({ title, children }: FilterSectionCardProps) {
  return (
    <View className="gap-4 rounded-3xl bg-[#F5F6FB] p-5">
      <Text className="text-2xl font-black text-gray-900">{title}</Text>
      {children}
    </View>
  );
}

// ============================================================
// Filter Tile Button Component
// ============================================================

type FilterOptionTileProps = {
  active?: boolean;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  label: string;
  onPress: () => void;
};

function FilterOptionTile({ active = false, icon, label, onPress }: FilterOptionTileProps) {
  return (
    <BouncyPressable
      className={`min-h-[108px] flex-1 items-center justify-center gap-2 rounded-2xl border px-3 shadow ${
        active ? 'border-gozyPink bg-[#FFF3F6]' : 'border-gray-100 bg-white'
      }`}
      onPress={onPress}>
      <MaterialCommunityIcons color={active ? '#EF3F68' : '#00A86B'} name={icon} size={28} />
      <Text className="text-center text-lg font-bold text-gray-900">{label}</Text>
    </BouncyPressable>
  );
}

// ============================================================
// Filter Pill Button Component
// ============================================================

type FilterOptionPillProps = {
  active?: boolean;
  label: string;
  onPress: () => void;
};

function FilterOptionPill({ active = false, label, onPress }: FilterOptionPillProps) {
  return (
    <BouncyPressable
      className={`self-start rounded-2xl border px-5 py-4 shadow ${
        active ? 'border-gozyPink bg-[#FFF3F6]' : 'border-gray-100 bg-white'
      }`}
      onPress={onPress}>
      <Text className="text-lg font-bold text-gray-900">{label}</Text>
    </BouncyPressable>
  );
}

// ============================================================
// Restaurant Grid Component
// ============================================================

type RestaurantGridProps = {
  restaurants: Restaurant[];
  onRestaurantPress: (restaurant: Restaurant) => void;
};

function RestaurantGrid({ restaurants, onRestaurantPress }: RestaurantGridProps) {
  if (restaurants.length === 0) {
    return (
      // ======================================================
      // Empty Restaurant State
      // Shows when search/category/veg filters find no results.
      // ======================================================
      <View className="mx-6 rounded-3xl bg-[#FFF1F4] p-6">
        <Text className="text-xl font-black text-gray-950">No matches found</Text>
        <Text className="mt-2 text-base text-gray-500">Try another dish, cuisine, or turn off veg mode.</Text>
      </View>
    );
  }

  return (
    // ========================================================
    // Recommended Restaurant Cards Section
    // Cards are laid out in a compact three-column grid.
    // ========================================================
    <View className="gap-4 px-5">
      {/* Restaurant Section Heading */}
      <Text className="text-base font-extrabold text-[#737A88]">RECOMMENDED FOR YOU</Text>

      {/* Restaurant Cards Grid */}
      <View className="flex-row flex-wrap justify-between gap-y-6">
        {restaurants.map((restaurant, index) => (
          <RestaurantCard
            key={restaurant.id}
            offer={cardOffers[index % cardOffers.length]}
            onPress={() => onRestaurantPress(restaurant)}
            restaurant={restaurant}
            urgent={index === 0}
          />
        ))}
      </View>
    </View>
  );
}

type RestaurantCardProps = {
  restaurant: Restaurant;
  offer: string;
  urgent: boolean;
  onPress: () => void;
};

function RestaurantCard({ restaurant, offer, urgent, onPress }: RestaurantCardProps) {
  return (
    // ========================================================
    // Individual Restaurant Card
    // Contains image, offer ribbon, rating badge, name, and ETA.
    // ========================================================
    <BouncyPressable className="min-w-[104px] basis-[31.5%]" onPress={onPress}>
      {/* Restaurant Image + Offer Ribbon + Rating Badge */}
      <View className="h-[104px] overflow-hidden rounded-2xl bg-gray-100">
        <Image className="h-full w-full" resizeMode="cover" source={{ uri: restaurant.image }} />
        <Text className="absolute left-0 right-0 top-0 bg-gray-950/80 px-1.5 py-1 text-[11px] font-black text-white">
          {offer}
        </Text>
        <View className="absolute bottom-0 left-0 flex-row items-center gap-0.5 rounded-tr-full bg-gozyGreen px-2 py-1.5">
          <MaterialCommunityIcons color="#FFFFFF" name="star" size={12} />
          <Text className="text-[13px] font-black text-white">{restaurant.rating.toFixed(1)}</Text>
        </View>
      </View>

      {/* Restaurant Name */}
      <Text className="mt-2 text-base font-black text-gray-950" numberOfLines={1}>
        {restaurant.name}
      </Text>

      {/* Delivery Time Row */}
      <View className="mt-1 flex-row items-center gap-1">
        <MaterialCommunityIcons
          color={urgent ? '#00A86B' : '#6B7280'}
          name={urgent ? 'lightning-bolt' : 'clock-outline'}
          size={18}
        />
        <Text className={`text-[13px] font-extrabold ${urgent ? 'text-gozyGreen' : 'text-gray-500'}`}>
          {restaurant.eta}
        </Text>
      </View>
    </BouncyPressable>
  );
}

// ============================================================
// Bottom Mode Bar Component
// ============================================================

type FloatingModeBarProps = {
  activeMode: FoodMode;
  onSelectMode: (mode: FoodMode) => void;
};

function FloatingModeBar({ activeMode, onSelectMode }: FloatingModeBarProps) {
  const modes: {
    id: FoodMode;
    label: string;
    icon: keyof typeof MaterialCommunityIcons.glyphMap;
  }[] = [
    { id: 'delivery', label: 'Delivery', icon: 'truck-delivery-outline' },
    { id: 'under-250', label: 'Under Rs 250', icon: 'ticket-percent-outline' },
    { id: 'dining', label: 'Dining', icon: 'room-service-outline' },
  ];

  return (
    // ========================================================
    // Bottom Floating Navigation Background
    // This section stays fixed at the bottom of the food page.
    // ========================================================
    <View className="absolute bottom-5 left-0 right-0 flex-row items-center px-4" pointerEvents="box-none">
      {/* White Rounded Bottom Mode Bar */}
      <View className="min-h-[76px] flex-1 flex-row items-center justify-around rounded-[32px] bg-white px-3 shadow-2xl">
        {modes.map((mode) => {
          const active = activeMode === mode.id;

          return (
            <BouncyPressable
              className={`min-h-14 flex-1 items-center justify-center gap-1 rounded-[28px] ${
                active ? 'bg-[#FFF0F4]' : ''
              }`}
              key={mode.id}
              onPress={() => onSelectMode(mode.id)}>
              <MaterialCommunityIcons color={active ? '#EF3F68' : '#7C8291'} name={mode.icon} size={24} />
              <Text className={`text-[13px] ${active ? 'font-black text-gozyPink' : 'font-extrabold text-[#747B89]'}`}>
                {mode.label}
              </Text>
            </BouncyPressable>
          );
        })}
      </View>

    </View>
  );
}
