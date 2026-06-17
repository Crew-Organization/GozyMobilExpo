import { useMemo, useRef, useState } from 'react';
import {
  Animated,
  Modal,
  Pressable,
  type PressableProps,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  type StyleProp,
  View,
  type ViewStyle,
} from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { ScreenShell } from '@/src/components/screen-shell';
import { useApp } from '@/src/context/app-context';
import { buildProductPriceLabel, savedAddresses, shoppingCategories } from '@/src/lib/commerce-data';
import { useSuperAppStore } from '@/src/store/super-app-store';
import { colors, radius, spacing, typography } from '@/src/theme/tokens';
import type { Address, Product } from '@/src/types';

// ============================================================
// Types for shopping filters, category rails, and buttons
// ============================================================

type SortMode = 'Recommended' | 'Price low' | 'Price high' | 'Rating';
type ShoppingFilterState = {
  maxPrice: number | null;
  minRating: number | null;
  minDiscount: number | null;
};
type Department = {
  id: string;
  label: string;
  category: (typeof shoppingCategories)[number];
  image: any;
  query?: string;
};
type AudienceTab = 'All' | 'Men' | 'Women' | 'Kids';
type MiniCategory = Department & {
  query: string;
};
type ExploreItem = {
  id: string;
  title: string;
  subtitle: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  color: string;
};
type BouncyPressableProps = Omit<PressableProps, 'style'> & {
  scaleTo?: number;
  style?: StyleProp<ViewStyle>;
};

const sortModes: SortMode[] = ['Recommended', 'Price low', 'Price high', 'Rating'];
const audienceTabs: AudienceTab[] = ['All', 'Men', 'Women', 'Kids'];
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const defaultShoppingFilters: ShoppingFilterState = {
  maxPrice: null,
  minRating: null,
  minDiscount: null,
};

// ============================================================
// Main category rail data (using local high-fidelity assets)
// ============================================================

const departments: Department[] = [
  {
    id: 'new',
    label: 'Fashion',
    category: 'Fashion',
    query: '',
    image: require('../assets/images/cat_fashion_models.png'),
  },
  {
    id: 'beauty',
    label: 'Beauty',
    category: 'Beauty',
    query: '',
    image: require('../assets/images/cat_beauty.png'),
  },
  {
    id: 'footwear',
    label: 'Footwear',
    category: 'Fashion',
    query: 'shoe',
    image: require('../assets/images/cat_footwear.png'),
  },
  {
    id: 'homeliving',
    label: 'Homeliving',
    category: 'Electronics',
    query: 'lamp',
    image: require('../assets/images/cat_homeliving.png'),
  },
  {
    id: 'accessories',
    label: 'Accessories',
    category: 'All',
    query: 'bag',
    image: require('../assets/images/cat_accessories.png'),
  },
];

// ============================================================
// Small product category rail data
// ============================================================

const miniCategories: MiniCategory[] = [
  {
    id: 'shirts',
    label: 'Shirts',
    category: 'Fashion',
    query: 'shirt',
    image:
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=260&q=80',
  },
  {
    id: 'jeans',
    label: 'Jeans',
    category: 'Fashion',
    query: 'jeans',
    image:
      'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=260&q=80',
  },
  {
    id: 'tees',
    label: 'T-Shirts',
    category: 'Fashion',
    query: 't-shirt',
    image:
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=260&q=80',
  },
  {
    id: 'shoes',
    label: 'Shoes',
    category: 'Fashion',
    query: 'shoe',
    image:
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=260&q=80',
  },
  {
    id: 'watches',
    label: 'Watches',
    category: 'Fashion',
    query: 'watch',
    image:
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=260&q=80',
  },
  {
    id: 'lipstick',
    label: 'Lipstick',
    category: 'Beauty',
    query: 'lipstick',
    image:
      'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=260&q=80',
  },
];

// ============================================================
// Men circular categories data (using local high-fidelity assets)
// ============================================================

const menCategories = [
  {
    id: 'casual',
    label: 'Casual',
    query: 'shirt',
    image: require('../assets/images/men_cat_casual.png'),
  },
  {
    id: 'ethnic',
    label: 'Ethnic',
    query: 'kurta',
    image: require('../assets/images/men_cat_ethnic.png'),
  },
  {
    id: 'footwear',
    label: 'Footwear',
    query: 'sneakers',
    image: require('../assets/images/men_cat_footwear.png'),
  },
  {
    id: 'sports',
    label: 'Sports',
    query: 't-shirt',
    image: require('../assets/images/men_cat_sports.png'),
  },
  {
    id: 'essentials',
    label: 'Essentials',
    query: 't-shirt',
    image: require('../assets/images/men_cat_essentials.png'),
  },
  {
    id: 'accessories',
    label: 'Accessories',
    query: 'watch',
    image: require('../assets/images/cat_accessories.png'),
  },
];

// ============================================================
// Women circular categories data (using local high-fidelity assets)
// ============================================================

const womenCategories = [
  {
    id: 'western',
    label: 'Western',
    query: 'dress',
    image: require('../assets/images/women_cat_western.png'),
  },
  {
    id: 'ethnic',
    label: 'Ethnic',
    query: 'kurta',
    image: require('../assets/images/women_cat_ethnic.png'),
  },
  {
    id: 'footwear',
    label: 'Footwear',
    query: 'shoe',
    image: require('../assets/images/women_cat_footwear.png'),
  },
  {
    id: 'beauty',
    label: 'Beauty',
    query: 'lipstick',
    image: require('../assets/images/women_cat_beauty.png'),
  },
  {
    id: 'fusion',
    label: 'Fusion',
    query: 'kurta',
    image: require('../assets/images/women_cat_fusion.png'),
  },
];

// ============================================================
// Explore more card data
// ============================================================

const exploreMoreItems: ExploreItem[] = [
  { id: 'fwd', title: 'Under Rs 999', subtitle: 'Everyday finds', icon: 'sale', color: '#F97316' },
  { id: 'luxury', title: 'Luxe Edit', subtitle: 'Premium picks', icon: 'diamond-stone', color: '#7C3AED' },
  { id: 'beauty', title: 'Beauty Box', subtitle: 'Skin and glam', icon: 'lipstick', color: '#BE185D' },
  { id: 'delivery', title: 'Fast Ship', subtitle: 'Quick arrivals', icon: 'truck-fast-outline', color: '#0EA5E9' },
];

const quickFilters = ['Coupon ready', 'Fast delivery', 'Top rated', 'Premium edit'];
const shelfDealFilters = [
  { label: 'Crazy Deal', icon: 'brightness-percent' },
  { label: 'Price Crash', icon: 'chart-line-variant' },
  { label: 'Top Brands', icon: 'ticket-percent-outline' },
  { label: 'Wishlist', icon: 'star-outline' },
] as const;

const shelfSubCategories = [
  {
    label: 'Linen',
    query: 'shirt',
    image:
      'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=260&q=80',
  },
  {
    label: 'Formal',
    query: 'shirt',
    image:
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=260&q=80',
  },
  {
    label: 'Cotton',
    query: 'shirt',
    image:
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=260&q=80',
  },
  {
    label: 'Sneakers',
    query: 'shoe',
    image:
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=260&q=80',
  },
  {
    label: 'Loafers',
    query: 'loafers',
    image:
      'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=260&q=80',
  },
];

// ============================================================
// Promotional image assets
// ============================================================

const casualHeroImage =
  'https://images.unsplash.com/photo-1516826957135-700dedea698c?auto=format&fit=crop&w=900&q=85';
const homeHeroImage =
  'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=85';
const brandWatchImage =
  'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=700&q=85';
const brandStyleImage =
  'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=700&q=85';

// ============================================================
// Reusable animated press button
// ============================================================

function BouncyPressable({ onPressIn, onPressOut, scaleTo = 0.96, style, ...props }: BouncyPressableProps) {
  const scale = useRef(new Animated.Value(1)).current;

  const animateTo = (value: number) => {
    Animated.spring(scale, {
      damping: 14,
      mass: 0.8,
      stiffness: 240,
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
// Product discount helper
// ============================================================

function discountFor(product: Product) {
  if (!product.originalPrice || product.originalPrice <= product.price) {
    return 0;
  }

  return Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
}

function getImageSource(source: any) {
  if (typeof source === 'string') {
    return { uri: source };
  }
  return source;
}

export default function ShoppingScreen() {
  // ============================================================
  // App data and shopping store state
  // ============================================================

  const { products } = useApp();
  const {
    addCustomAddress,
    customAddresses,
    selectedAddressId,
    setSelectedAddress,
    shoppingCart,
    setSelectedProduct,
    toggleWishlist,
    wishlist,
  } = useSuperAppStore();

  // ============================================================
  // Screen state for filters, search, and address modal
  // ============================================================

  const [selectedCategory, setSelectedCategory] = useState<(typeof shoppingCategories)[number]>('All');
  const [selectedQuickFilter, setSelectedQuickFilter] = useState('Coupon ready');
  const [selectedAudience, setSelectedAudience] = useState<AudienceTab>('All');
  const [sortMode, setSortMode] = useState<SortMode>('Recommended');
  const [query, setQuery] = useState('');
  const [activeShelfTitle, setActiveShelfTitle] = useState<string | null>(null);
  const [filterSheetVisible, setFilterSheetVisible] = useState(false);
  const [shoppingFilters, setShoppingFilters] = useState<ShoppingFilterState>(defaultShoppingFilters);
  const [addressModalVisible, setAddressModalVisible] = useState(false);
  const [addingAddress, setAddingAddress] = useState(false);
  const [newAddressLabel, setNewAddressLabel] = useState('');
  const [newAddressLine1, setNewAddressLine1] = useState('');
  const [newAddressLine2, setNewAddressLine2] = useState('');

  // ============================================================
  // Derived address data
  // ============================================================

  const addressOptions = useMemo(() => [...savedAddresses, ...customAddresses], [customAddresses]);
  const selectedAddress = addressOptions.find((item) => item.id === selectedAddressId) ?? addressOptions[0];

  // ============================================================
  // Product collections for carousels and grids
  // ============================================================

  const featuredProducts = useMemo(
    () =>
      [...products]
        .sort((first, second) => discountFor(second) - discountFor(first))
        .slice(0, 4),
    [products],
  );

  const budgetProducts = useMemo(
    () => [...products].sort((first, second) => first.price - second.price).slice(0, 6),
    [products],
  );

  const wishlistPreview = wishlist[0] ?? featuredProducts[0];
  const activeFilterCount = [
    shoppingFilters.maxPrice !== null,
    shoppingFilters.minRating !== null,
    shoppingFilters.minDiscount !== null,
  ].filter(Boolean).length;

  // ============================================================
  // Search, filter, audience tab, and sort logic
  // ============================================================

  const visibleProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const filtered = products.filter((product) => {
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      const matchesAudience = (() => {
        if (selectedAudience === 'All') return true;
        if (selectedAudience === 'Men') {
          return ['shirt', 'jeans', 't-shirt', 'sneakers', 'loafers', 'watch'].some((term) =>
            product.name.toLowerCase().includes(term),
          );
        }
        if (selectedAudience === 'Women') {
          return ['dress', 'kurta', 'lipstick', 'serum', 'sunscreen', 'pouch', 'tote'].some((term) =>
            product.name.toLowerCase().includes(term),
          );
        }
        return ['t-shirt', 'shoes', 'speaker', 'sunglasses'].some((term) =>
          product.name.toLowerCase().includes(term),
        );
      })();
      const matchesQuery =
        normalizedQuery.length === 0 ||
        [product.name, product.brand, product.category].some((value) =>
          value.toLowerCase().includes(normalizedQuery),
        );
      const matchesQuickFilter = (() => {
        if (selectedQuickFilter === 'Coupon ready') return discountFor(product) >= 35;
        if (selectedQuickFilter === 'Fast delivery') return product.rating >= 4.2;
        if (selectedQuickFilter === 'Top rated') return product.rating >= 4.5;
        if (selectedQuickFilter === 'Premium edit') return product.price >= 1500;
        if (selectedQuickFilter === 'Under Rs 999') return product.price <= 999;
        if (selectedQuickFilter === 'Luxe Edit') return product.price >= 1500;
        if (selectedQuickFilter === 'Beauty Box') return product.category === 'Beauty';
        if (selectedQuickFilter === 'Fast Ship') return product.rating >= 4.2;
        return true;
      })();
      const matchesSheetFilters =
        (shoppingFilters.maxPrice === null || product.price <= shoppingFilters.maxPrice) &&
        (shoppingFilters.minRating === null || product.rating >= shoppingFilters.minRating) &&
        (shoppingFilters.minDiscount === null || discountFor(product) >= shoppingFilters.minDiscount);

      return matchesCategory && matchesAudience && matchesQuery && matchesQuickFilter && matchesSheetFilters;
    });

    return [...filtered].sort((first, second) => {
      if (sortMode === 'Price low') return first.price - second.price;
      if (sortMode === 'Price high') return second.price - first.price;
      if (sortMode === 'Rating') return second.rating - first.rating;
      return discountFor(second) - discountFor(first);
    });
  }, [products, query, selectedAudience, selectedCategory, selectedQuickFilter, shoppingFilters, sortMode]);

  // ============================================================
  // Navigation and filter action handlers
  // ============================================================

  const openProduct = (product: Product) => {
    setSelectedProduct(product.id);
    router.push('/product-detail');
  };

  const openMiniCategory = (category: MiniCategory) => {
    setSelectedCategory(category.category);
    setQuery(category.query);
    setSelectedQuickFilter('Fast delivery');
    setActiveShelfTitle(category.label);
  };

  const openDepartment = (department: Department) => {
    setSelectedCategory(department.category);
    setQuery(department.query ?? '');
    setSelectedQuickFilter('Fast delivery');
    setSortMode('Recommended');
    setActiveShelfTitle(department.label);
  };

  const openAudience = (tab: AudienceTab) => {
    setSelectedAudience(tab);
    setSelectedCategory(tab === 'All' ? 'All' : 'Fashion');
    setQuery('');
    setSelectedQuickFilter('Fast delivery');
    setActiveShelfTitle(null);
  };

  const resetShoppingHome = () => {
    setSelectedAudience('All');
    setSelectedCategory('All');
    setQuery('');
    setSelectedQuickFilter('Coupon ready');
    setSortMode('Recommended');
    setActiveShelfTitle(null);
    setShoppingFilters(defaultShoppingFilters);
  };

  const openExplore = (item: ExploreItem) => {
    setSelectedQuickFilter(item.title);
    if (item.id === 'fwd') {
      setSelectedCategory('All');
      setQuery('');
      setSortMode('Price low');
      setActiveShelfTitle(item.title);
      return;
    }

    if (item.id === 'luxury') {
      setSelectedCategory('Fashion');
      setQuery('');
      setSortMode('Price high');
      setActiveShelfTitle(item.title);
      return;
    }

    if (item.id === 'beauty') {
      setSelectedCategory('Beauty');
      setQuery('');
      setSortMode('Recommended');
      setActiveShelfTitle(item.title);
      return;
    }

    setSelectedCategory('All');
    setQuery('');
    setSortMode('Rating');
    setActiveShelfTitle(item.title);
  };

  const openBag = () => {
    router.push(shoppingCart.length > 0 ? '/shopping-checkout' : '/cart');
  };

  const openProfile = () => {
    router.push('/profile');
  };

  const startVoiceSearch = () => {
    setQuery('shirts');
    setSelectedCategory('Fashion');
    setSelectedQuickFilter('Fast delivery');
    setActiveShelfTitle('Shirts');
  };

  const startCameraSearch = () => {
    setQuery('sunglasses');
    setSelectedCategory('Fashion');
    setSelectedQuickFilter('Fast delivery');
    setActiveShelfTitle('Sunglasses');
  };

  const openHeroDeal = () => {
    setSelectedCategory('Fashion');
    setQuery('shirt');
    setSelectedQuickFilter('Under Rs 999');
    setSortMode('Price low');
    setActiveShelfTitle('Shirts');
  };

  const openBrandShelf = (queryValue: string, mode: SortMode = 'Recommended') => {
    setSelectedCategory('Fashion');
    setQuery(queryValue);
    setSelectedQuickFilter('Fast delivery');
    setSortMode(mode);
    setActiveShelfTitle(queryValue);
  };

  const updateShoppingFilters = (updates: Partial<ShoppingFilterState>) => {
    setShoppingFilters((current) => ({ ...current, ...updates }));
  };

  // ============================================================
  // Add new delivery address handler
  // ============================================================

  const saveNewAddress = () => {
    const label = newAddressLabel.trim() || 'New address';
    const line1 = newAddressLine1.trim();
    const line2 = newAddressLine2.trim();

    if (!line1 || !line2) {
      return;
    }

    const address: Address = {
      id: `addr-custom-${Date.now()}`,
      label,
      line1,
      line2,
      etaHint: 'Added from shopping delivery picker',
    };

    addCustomAddress(address);
    setNewAddressLabel('');
    setNewAddressLine1('');
    setNewAddressLine2('');
    setAddingAddress(false);
    setAddressModalVisible(false);
  };

  if (activeShelfTitle) {
    const shelfTitle = activeShelfTitle.toUpperCase();

    return (
      <ScreenShell contentContainerStyle={styles.shelfScreen}>
        <View style={styles.shelfHeader}>
          <Pressable onPress={resetShoppingHome} style={styles.shelfHeaderIcon}>
            <MaterialCommunityIcons color={colors.text} name="arrow-left" size={30} />
          </Pressable>
          <Text style={styles.shelfLogo}>M</Text>
          <Text numberOfLines={1} style={styles.shelfTitle}>
            {shelfTitle}
          </Text>
          <View style={styles.shelfHeaderSpacer} />
          <Pressable onPress={() => setActiveShelfTitle('Search')} style={styles.shelfHeaderIcon}>
            <MaterialCommunityIcons color={colors.text} name="magnify" size={31} />
          </Pressable>
          <Pressable onPress={() => router.push('/wishlist')} style={styles.shelfHeaderIcon}>
            <MaterialCommunityIcons color={colors.text} name="heart-outline" size={32} />
          </Pressable>
          <Pressable onPress={openBag} style={styles.shelfHeaderIcon}>
            <MaterialCommunityIcons color={colors.text} name="shopping-outline" size={31} />
          </Pressable>
        </View>

        <Pressable onPress={() => setAddressModalVisible(true)} style={styles.shelfLocationRow}>
          <MaterialCommunityIcons color="#3F3F46" name="map-marker" size={24} />
          <Text numberOfLines={1} style={styles.shelfLocationText}>
            {selectedAddress?.line2?.match(/\d{6}/)?.[0] ?? '131029'}
          </Text>
          <MaterialCommunityIcons color={colors.text} name="chevron-down" size={29} />
        </Pressable>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.shelfDealRow}>
          {shelfDealFilters.map((filter) => (
            <Pressable
              key={filter.label}
              onPress={() => {
                setSelectedQuickFilter(filter.label === 'Wishlist' ? 'Top rated' : 'Coupon ready');
                if (filter.label === 'Price Crash') setSortMode('Price low');
                if (filter.label === 'Top Brands') setSortMode('Rating');
              }}
              style={styles.shelfDealChip}>
              <MaterialCommunityIcons
                color={colors.text}
                name={filter.icon as keyof typeof MaterialCommunityIcons.glyphMap}
                size={25}
              />
              <Text style={styles.shelfDealText}>{filter.label}</Text>
            </Pressable>
          ))}
        </ScrollView>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.shelfCategoryRow}>
          {shelfSubCategories.map((category) => (
            <Pressable
              key={category.label}
              onPress={() => {
                setQuery(category.query);
                setActiveShelfTitle(category.label);
                setSelectedCategory('Fashion');
                setSelectedQuickFilter('Fast delivery');
              }}
              style={styles.shelfCategoryItem}>
              <Image contentFit="cover" source={{ uri: category.image }} style={styles.shelfCategoryImage} />
              <Text numberOfLines={1} style={styles.shelfCategoryText}>
                {category.label}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        <View style={styles.shelfCouponBand}>
          <View style={styles.shelfCouponPart}>
            <View style={styles.shelfCouponIcon}>
              <MaterialCommunityIcons color={colors.white} name="truck-outline" size={24} />
            </View>
            <Text style={styles.shelfCouponText}>Free Shipping on your first order</Text>
          </View>
          <View style={styles.shelfCouponDivider} />
          <View style={styles.shelfCouponPart}>
            <View style={[styles.shelfCouponIcon, styles.shelfCouponIconPurple]}>
              <MaterialCommunityIcons color={colors.white} name="ticket-percent-outline" size={23} />
            </View>
            <View>
              <Text style={styles.shelfCouponText}>Rs 500 off for you</Text>
              <Text style={styles.shelfCouponCode}>MYNTRA500</Text>
            </View>
          </View>
        </View>

        <BouncyPressable onPress={() => openBrandShelf(query || 'shirt', 'Rating')} style={styles.shelfHeroBanner}>
          <Image contentFit="cover" source={{ uri: brandStyleImage }} style={styles.shelfHeroImage} />
          <View style={styles.shelfHeroCopy}>
            <Text style={styles.shelfHeroBrand}>VERO MODA</Text>
            <Text style={styles.shelfHeroSmall}>The Spring-Summer Collection</Text>
            <Text style={styles.shelfHeroOffer}>Extra 10% Off</Text>
            <Text style={styles.shelfHeroSmall}>Only On Gozy</Text>
          </View>
          <View style={styles.shelfHeroArrow}>
            <MaterialCommunityIcons color={colors.white} name="chevron-right" size={27} />
          </View>
        </BouncyPressable>

        <View style={styles.shelfDots}>
          {Array.from({ length: 5 }).map((_, index) => (
            <View key={index} style={[styles.shelfDot, index === 1 ? styles.shelfDotActive : null]} />
          ))}
        </View>

        <View style={styles.shelfGrid}>
          {visibleProducts.map((product) => {
            const saved = wishlist.some((item) => item.id === product.id);
            return (
              <BouncyPressable key={product.id} onPress={() => openProduct(product)} style={styles.shelfProductCard}>
                <View style={styles.shelfProductImageWrap}>
                  <Image contentFit="cover" source={{ uri: product.image }} style={styles.shelfProductImage} />
                  {product.badge ? (
                    <View style={styles.shelfProductBadge}>
                      <Text style={styles.shelfProductBadgeText}>{product.badge}</Text>
                    </View>
                  ) : null}
                  <Pressable
                    onPress={(event) => {
                      event.stopPropagation();
                      toggleWishlist(product);
                    }}
                    style={styles.shelfWishlistButton}>
                    <MaterialCommunityIcons
                      color={saved ? '#E11D48' : colors.white}
                      name={saved ? 'heart' : 'heart-outline'}
                      size={21}
                    />
                  </Pressable>
                </View>
                <View style={styles.shelfProductBody}>
                  <Text numberOfLines={1} style={styles.productBrand}>
                    {product.brand}
                  </Text>
                  <Text numberOfLines={1} style={styles.productName}>
                    {product.name}
                  </Text>
                  <View style={styles.priceRow}>
                    <Text style={styles.productPrice}>{buildProductPriceLabel(product)}</Text>
                    <Text style={styles.originalPrice}>Rs {product.originalPrice.toLocaleString('en-IN')}</Text>
                  </View>
                  <Text style={styles.discountText}>{discountFor(product)}% OFF</Text>
                </View>
              </BouncyPressable>
            );
          })}
        </View>

        {visibleProducts.length === 0 ? (
          <View style={styles.shelfEmptyState}>
            <Text style={styles.shelfEmptyTitle}>No products found</Text>
            <Text style={styles.shelfEmptyBody}>Clear filters or try another category.</Text>
          </View>
        ) : null}

        <View style={styles.shelfBottomBar}>
          <Pressable onPress={() => setSelectedAudience('Men')} style={styles.shelfBottomItem}>
            <Text style={styles.shelfBottomText}>MEN</Text>
          </Pressable>
          <View style={styles.shelfBottomDivider} />
          <Pressable onPress={() => setFilterSheetVisible(true)} style={styles.shelfBottomItem}>
            <MaterialCommunityIcons color="#7A7F87" name="sort-variant" size={24} />
            <Text style={styles.shelfBottomText}>SORT</Text>
          </Pressable>
          <View style={styles.shelfBottomDivider} />
          <Pressable onPress={() => setFilterSheetVisible(true)} style={styles.shelfBottomItem}>
            <MaterialCommunityIcons color="#7A7F87" name="filter" size={25} />
            <Text style={styles.shelfBottomText}>FILTER</Text>
            {activeFilterCount > 0 ? <View style={styles.shelfFilterDot} /> : null}
          </Pressable>
        </View>

        <Modal
          animationType="slide"
          onRequestClose={() => setFilterSheetVisible(false)}
          transparent
          visible={filterSheetVisible}>
          <View style={styles.modalBackdrop}>
            <View style={styles.filterSheet}>
              <View style={styles.addressSheetHeader}>
                <View>
                  <Text style={styles.addressSheetTitle}>Filters and sort</Text>
                  <Text style={styles.addressSheetSubtitle}>{visibleProducts.length} products match</Text>
                </View>
                <Pressable onPress={() => setFilterSheetVisible(false)} style={styles.sheetCloseButton}>
                  <MaterialCommunityIcons color={colors.text} name="close" size={20} />
                </Pressable>
              </View>

              <Text style={styles.filterSheetLabel}>Sort by</Text>
              <View style={styles.filterOptionGrid}>
                {sortModes.map((mode) => (
                  <Pressable
                    key={mode}
                    onPress={() => setSortMode(mode)}
                    style={[styles.filterOption, sortMode === mode ? styles.filterOptionActive : null]}>
                    <Text style={[styles.filterOptionText, sortMode === mode ? styles.filterOptionTextActive : null]}>
                      {mode}
                    </Text>
                  </Pressable>
                ))}
              </View>

              <Text style={styles.filterSheetLabel}>Price</Text>
              <View style={styles.filterOptionGrid}>
                {[999, 1499, 2499].map((price) => (
                  <Pressable
                    key={price}
                    onPress={() =>
                      updateShoppingFilters({
                        maxPrice: shoppingFilters.maxPrice === price ? null : price,
                      })
                    }
                    style={[styles.filterOption, shoppingFilters.maxPrice === price ? styles.filterOptionActive : null]}>
                    <Text
                      style={[
                        styles.filterOptionText,
                        shoppingFilters.maxPrice === price ? styles.filterOptionTextActive : null,
                      ]}>
                      Under Rs {price}
                    </Text>
                  </Pressable>
                ))}
              </View>

              <Text style={styles.filterSheetLabel}>Rating and discount</Text>
              <View style={styles.filterOptionGrid}>
                <Pressable
                  onPress={() =>
                    updateShoppingFilters({
                      minRating: shoppingFilters.minRating === 4.3 ? null : 4.3,
                    })
                  }
                  style={[styles.filterOption, shoppingFilters.minRating === 4.3 ? styles.filterOptionActive : null]}>
                  <Text
                    style={[
                      styles.filterOptionText,
                      shoppingFilters.minRating === 4.3 ? styles.filterOptionTextActive : null,
                    ]}>
                    4.3+ rated
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() =>
                    updateShoppingFilters({
                      minDiscount: shoppingFilters.minDiscount === 40 ? null : 40,
                    })
                  }
                  style={[
                    styles.filterOption,
                    shoppingFilters.minDiscount === 40 ? styles.filterOptionActive : null,
                  ]}>
                  <Text
                    style={[
                      styles.filterOptionText,
                      shoppingFilters.minDiscount === 40 ? styles.filterOptionTextActive : null,
                    ]}>
                    40% off
                  </Text>
                </Pressable>
              </View>

              <View style={styles.filterSheetActions}>
                <Pressable
                  onPress={() => {
                    setShoppingFilters(defaultShoppingFilters);
                    setSortMode('Recommended');
                  }}
                  style={styles.filterClearButton}>
                  <Text style={styles.filterClearText}>Clear all</Text>
                </Pressable>
                <Pressable onPress={() => setFilterSheetVisible(false)} style={styles.filterApplyButton}>
                  <Text style={styles.filterApplyText}>Apply</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>

        <Modal
          animationType="slide"
          onRequestClose={() => setAddressModalVisible(false)}
          transparent
          visible={addressModalVisible}>
          <View style={styles.modalBackdrop}>
            <View style={styles.addressSheet}>
              <View style={styles.addressSheetHeader}>
                <View>
                  <Text style={styles.addressSheetTitle}>Choose delivery address</Text>
                  <Text style={styles.addressSheetSubtitle}>Used for shelf delivery estimates.</Text>
                </View>
                <Pressable onPress={() => setAddressModalVisible(false)} style={styles.sheetCloseButton}>
                  <MaterialCommunityIcons color={colors.text} name="close" size={20} />
                </Pressable>
              </View>
              {addressOptions.map((address) => (
                <Pressable
                  key={address.id}
                  onPress={() => {
                    setSelectedAddress(address.id);
                    setAddressModalVisible(false);
                  }}
                  style={[
                    styles.addressOption,
                    address.id === selectedAddressId ? styles.addressOptionActive : null,
                  ]}>
                  <View style={styles.addressOptionCopy}>
                    <Text style={styles.addressOptionTitle}>{address.label}</Text>
                    <Text style={styles.addressOptionMeta}>
                      {address.line1}, {address.line2}
                    </Text>
                  </View>
                </Pressable>
              ))}
            </View>
          </View>
        </Modal>
      </ScreenShell>
    );
  }

  return (
    <ScreenShell scroll={false} style={styles.homeShell}>
      <View style={styles.homeRoot}>
      <View pointerEvents="none" style={styles.homeBackdrop}>
        <View style={[StyleSheet.absoluteFill, { backgroundColor: '#FFFFFF' }]} />
      </View>

      <ScrollView contentContainerStyle={styles.screen} showsVerticalScrollIndicator={false}>

      {/* Delivery address selector */}
      <Pressable onPress={() => setAddressModalVisible(true)} style={styles.deliveryRow}>
        <Pressable
          onPress={(event) => {
            event.stopPropagation();
            router.back();
          }}
          style={styles.backButton}>
          <MaterialCommunityIcons color={colors.text} name="arrow-left" size={19} />
        </Pressable>
        <MaterialCommunityIcons color={colors.text} name="map-marker" size={20} />
        <Text numberOfLines={1} style={styles.deliveryText}>
          Deliver to {selectedAddress?.label ?? 'Select address'}
        </Text>
        <MaterialCommunityIcons color={colors.text} name="chevron-down" size={19} />
      </Pressable>

      {/* Search bar and top action buttons */}
      <View style={styles.topBar}>
        <View style={styles.searchWrap}>
          <Text style={styles.searchLogo}>M</Text>
          <TextInput
            onChangeText={setQuery}
            placeholder='"Shirts"'
            placeholderTextColor={colors.textMuted}
            style={styles.searchInput}
            value={query}
          />
          <Pressable onPress={startVoiceSearch} style={styles.searchIconButton}>
            <MaterialCommunityIcons color={colors.textMuted} name="microphone-outline" size={22} />
          </Pressable>
          <Pressable onPress={startCameraSearch} style={styles.searchIconButton}>
            <MaterialCommunityIcons color={colors.textMuted} name="camera-outline" size={22} />
          </Pressable>
        </View>
        <Pressable onPress={() => router.push('/notifications')} style={styles.iconButton}>
          <MaterialCommunityIcons color={colors.text} name="bell-outline" size={21} />
        </Pressable>
        <Pressable onPress={() => router.push('/wishlist')} style={styles.iconButton}>
          <MaterialCommunityIcons color={colors.text} name="heart-outline" size={21} />
          {wishlist.length > 0 ? <View style={styles.dotBadge} /> : null}
        </Pressable>
        <Pressable onPress={openProfile} style={styles.iconButton}>
          <MaterialCommunityIcons color={colors.text} name="account-circle-outline" size={25} />
        </Pressable>
      </View>

      {/* Audience tabs: All, Men, Women, Kids */}
      <View style={[
        styles.audienceRow,
        (selectedAudience === 'Men' || selectedAudience === 'All') ? { borderBottomColor: '#E11D48' } : null
      ]}>
        {audienceTabs.map((tab) => {
          const isActive = selectedAudience === tab;
          const isFolderTheme = selectedAudience === 'Men' || selectedAudience === 'All';
          
          let tabStyle: any = [styles.audienceTab];
          let textStyle: any = [styles.audienceText];
          
          if (isActive) {
            if (isFolderTheme) {
              tabStyle.push({
                borderColor: '#E11D48',
                borderTopWidth: 1.5,
                borderLeftWidth: 1.5,
                borderRightWidth: 1.5,
                borderBottomWidth: 0,
                borderTopLeftRadius: 12,
                borderTopRightRadius: 12,
                backgroundColor: '#FFFFFF',
                marginBottom: -1.5,
                zIndex: 10,
              });
              textStyle.push({
                color: '#E11D48',
                fontWeight: '900',
              });
            } else {
              tabStyle.push(styles.audienceTabActive);
              textStyle.push(styles.audienceTextActive);
            }
          } else {
            if (isFolderTheme) {
              textStyle.push({
                color: '#1E0A2E',
                fontWeight: '700',
              });
            }
          }
          
          return (
            <Pressable
              key={tab}
              onPress={() => openAudience(tab)}
              style={tabStyle}>
              <Text style={textStyle}>
                {tab}
              </Text>
            </Pressable>
          );
        })}
        <Pressable onPress={resetShoppingHome} style={styles.gridMenuButton}>
          <MaterialCommunityIcons color={colors.white} name="view-grid" size={22} />
        </Pressable>
      </View>

      {selectedAudience === 'Men' ? (
        <>
          {/* Men circular category circles */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.menCategoriesRow}>
            {menCategories.map((cat) => (
              <BouncyPressable
                key={cat.id}
                onPress={() => {
                  setQuery(cat.query);
                  setActiveShelfTitle(`Men's ${cat.label}`);
                  setSelectedCategory('Fashion');
                  setSelectedQuickFilter('Fast delivery');
                }}
                style={styles.menCategoryItem}
              >
                <View style={styles.menCategoryCircle}>
                  <Image contentFit="cover" source={getImageSource(cat.image)} style={styles.menCategoryImage} />
                </View>
                <Text style={styles.menCategoryLabel}>{cat.label}</Text>
              </BouncyPressable>
            ))}
          </ScrollView>

          {/* EORS Coupon Strip */}
          <BouncyPressable
            onPress={() => {
              setSelectedQuickFilter('Coupon ready');
              setSortMode('Price low');
            }}
            style={styles.couponBand}>
            <Text style={styles.couponText}>FLAT Rs 500 OFF</Text>
            <View style={styles.couponCode}>
              <Text style={styles.couponCodeEyebrow}>USE CODE:</Text>
              <Text style={styles.couponCodeText}>EORS500</Text>
            </View>
          </BouncyPressable>

          {/* EORS Hero Banner */}
          {/* Blackberrys Hero Banner */}
          <BouncyPressable onPress={() => openBrandShelf('shirt', 'Price high')} style={styles.menHeroContainer}>
            <LinearGradient
              colors={['#FCD34D', '#F97316', '#EF4444']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.menHeroBorder}
            >
              <View style={{ backgroundColor: '#111827', borderRadius: 14, overflow: 'hidden' }}>
                <View style={{ height: 180, flexDirection: 'row', position: 'relative' }}>
                  {/* Left part: text and gradient overlay */}
                  <View style={styles.menHeroLeft}>
                    <LinearGradient
                      colors={['rgba(0,0,0,0.85)', 'rgba(0,0,0,0.4)', 'transparent']}
                      start={{ x: 0.1, y: 0 }}
                      end={{ x: 0.9, y: 0 }}
                      style={StyleSheet.absoluteFillObject}
                    />
                    
                    <View style={styles.menSaleBadgeContainer}>
                      <View style={styles.hexBadgeBorder}>
                        <Text style={styles.hexBadgeTextSmall}>END OF</Text>
                        <Text style={styles.hexBadgeTextLarge}>REASON</Text>
                        <Text style={styles.hexBadgeTextSmall}>SALE</Text>
                      </View>
                    </View>

                    <Text style={styles.menHeroSubtitle}>A Summer Special Edit</Text>
                    <Text style={styles.menHeroTitle}>UP TO 50% OFF</Text>
                  </View>

                  {/* Right part: model image */}
                  <View style={styles.menHeroRight}>
                    <Image
                      source={require('../assets/images/men_banner_model.png')}
                      contentFit="cover"
                      style={StyleSheet.absoluteFillObject}
                    />
                    <View style={{ position: 'absolute', right: 8, bottom: 8, backgroundColor: 'rgba(0,0,0,0.3)', paddingHorizontal: 4, paddingVertical: 1, borderRadius: 2 }}>
                      <Text style={{ color: '#FFF', fontSize: 8, fontWeight: '700' }}>AD</Text>
                    </View>
                  </View>
                </View>

                {/* Bottom brand strip */}
                <View style={styles.menHeroFooter}>
                  <View style={styles.menHeroFooterBrand}>
                    <MaterialCommunityIcons name="crown-outline" size={18} color="#000" />
                    <Text style={styles.menHeroFooterBrandName}>BLACKBERRYS</Text>
                  </View>
                  <View style={styles.menHeroFooterCta}>
                    <Text style={styles.menHeroFooterCtaText}>Shop Now</Text>
                    <MaterialCommunityIcons name="chevron-right" size={14} color="#FFF" />
                  </View>
                </View>
              </View>
            </LinearGradient>
          </BouncyPressable>

          {/* Dots Indicator */}
          <View style={styles.menDotsContainer}>
            {Array.from({ length: 10 }).map((_, idx) => (
              <View
                key={idx}
                style={[
                  styles.menDot,
                  idx === 1 ? styles.menDotActive : null
                ]}
              />
            ))}
          </View>

          {/* Partner Strips */}
          <View style={styles.partnerStripsContainer}>
            <View style={styles.partnerRow}>
              <LinearGradient
                colors={['#EF4444', '#B91C1C']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.poweredLabelBlock}
              >
                <Text style={styles.poweredLabelText}>POWERED BY</Text>
              </LinearGradient>
              <Pressable onPress={() => openBrandShelf('shirt')} style={[styles.partnerBrandBlock, { backgroundColor: '#4C1D95' }]}>
                <Text style={[styles.partnerBrandText, { color: '#FFFFFF' }]}>Libas</Text>
                <MaterialCommunityIcons name="chevron-right" size={14} color="#FFFFFF" />
              </Pressable>
              <Pressable onPress={() => openBrandShelf('shirt')} style={[styles.partnerBrandBlock, { backgroundColor: '#FFFFFF', borderColor: '#E5E7EB', borderWidth: 1 }]}>
                <Text style={[styles.partnerBrandText, { color: '#000000' }]}>RARE RABBIT</Text>
                <MaterialCommunityIcons name="chevron-right" size={14} color="#000000" />
              </Pressable>
            </View>
            <View style={styles.partnerRow}>
              <Pressable onPress={() => openBrandShelf('bag')} style={[styles.partnerBrandBlock, { backgroundColor: '#F3F4F6' }]}>
                <Text style={[styles.partnerBrandText, { color: '#111827' }]}>MIRAGGIO</Text>
              </Pressable>
              <Pressable onPress={() => openBrandShelf('jeans')} style={[styles.partnerBrandBlock, { backgroundColor: '#002C5B' }]}>
                <Text style={[styles.partnerBrandText, { color: '#FFFFFF' }]}>JACK & JONES</Text>
              </Pressable>
              <Pressable onPress={() => openBrandShelf('watch')} style={[styles.partnerBrandBlock, { backgroundColor: '#111827' }]}>
                <Text style={[styles.partnerBrandText, { color: '#FFFFFF' }]}>TIMEX</Text>
              </Pressable>
              <LinearGradient
                colors={['#EF4444', '#B91C1C']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.poweredLabelBlock}
              >
                <Text style={styles.poweredLabelText}>PARTNERS</Text>
              </LinearGradient>
            </View>
          </View>

          {/* Flipkart Axis & SBI Bank Offer Strip */}
          <Pressable onPress={() => setShoppingFilters(prev => ({ ...prev, minDiscount: 40 }))} style={styles.bankOfferStrip}>
            <View style={styles.bankCardsContainer}>
              <View style={[styles.miniCreditCard, styles.sbiCard]} />
              <View style={[styles.miniCreditCard, styles.axisCard]}>
                <View style={styles.axisCardStripe} />
              </View>
            </View>
            <View style={styles.bankOfferTextContainer}>
              <Text style={styles.bankOfferTitle}>Get Extra 10% Savings*</Text>
              <Text style={styles.bankOfferSubtitle}>With Flipkart Axis Bank & SBI Credit Cards</Text>
            </View>
            <View style={styles.bankPlayButton}>
              <MaterialCommunityIcons name="play" size={14} color="#FFFFFF" />
            </View>
          </Pressable>

          {/* Featured Brands */}
          <View style={styles.featuredBrandsContainer}>
            <Text style={styles.featuredBrandsHeading}>FEATURED BRANDS</Text>
            <View style={styles.featuredBrandsGrid}>
              <BouncyPressable onPress={() => openBrandShelf('shirt', 'Rating')} style={styles.featuredBrandCard}>
                <Image
                  source={require('../assets/images/trunk_category_image.png')}
                  contentFit="cover"
                  style={StyleSheet.absoluteFill}
                />
                <View style={styles.brandOverlayScrim} />
                <View style={styles.brandCardOfferContainer}>
                  <Text style={styles.brandCardOfferText}>UP TO 30% OFF</Text>
                  <Text style={styles.brandCardSubText}>Everyday Comfort Essentials</Text>
                </View>
                <View style={styles.brandLogoPillContainer}>
                  <View style={[styles.brandLogoPill, styles.vanHeusenPill]}>
                    <Text style={styles.vanHeusenPillText}>VAN HEUSEN</Text>
                    <Text style={styles.vanHeusenSubPillText}>INNERWEAR</Text>
                  </View>
                </View>
              </BouncyPressable>
              <BouncyPressable onPress={() => openBrandShelf('jeans', 'Rating')} style={styles.featuredBrandCard}>
                <Image
                  source={require('../assets/images/men_cat_casual.png')}
                  contentFit="cover"
                  style={StyleSheet.absoluteFill}
                />
                <View style={styles.brandOverlayScrim} />
                <View style={styles.brandCardOfferContainer}>
                  <Text style={styles.brandCardOfferText}>UP TO 50% OFF</Text>
                  <Text style={styles.brandCardSubText}>Casual Wear</Text>
                </View>
                <View style={styles.brandLogoPillContainer}>
                  <View style={[styles.brandLogoPill, styles.levisPill, { paddingVertical: 4 }]}>
                    <Text style={[styles.levisPillText, { fontWeight: '900', fontSize: 13, letterSpacing: 0.5 }]}>Levi's</Text>
                  </View>
                </View>
              </BouncyPressable>
            </View>
          </View>

          {/* Highlights of the Day */}
          <View style={styles.highlightsContainer}>
            <View style={styles.ledMarquee}>
              <Text style={styles.ledText}>★ HIGHLIGHTS OF THE DAY ★</Text>
            </View>
            <View style={styles.highlightsScrollContainer}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.highlightsRow}>
                <BouncyPressable onPress={() => openBrandShelf('shirt')} style={styles.highlightCard}>
                  <Image
                    source={{ uri: 'https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=320&q=80' }}
                    contentFit="cover"
                    style={styles.highlightImage}
                  />
                  <View style={styles.highlightTextOverlay}>
                    <Text style={styles.highlightCardTitle}>Rainy Day Ready</Text>
                    <Text style={styles.highlightCardSubtitle}>Waterproof Essentials</Text>
                  </View>
                </BouncyPressable>
                <BouncyPressable onPress={() => openBrandShelf('shirt')} style={styles.highlightCard}>
                  <Image
                    source={{ uri: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=320&q=80' }}
                    contentFit="cover"
                    style={styles.highlightImage}
                  />
                  <View style={styles.highlightTextOverlay}>
                    <Text style={styles.highlightCardTitle}>Sun-Kissed Styles</Text>
                    <Text style={styles.highlightCardSubtitle}>Bright & Breezy Shirts</Text>
                  </View>
                </BouncyPressable>
                <BouncyPressable onPress={() => openBrandShelf('jeans')} style={styles.highlightCard}>
                  <Image
                    source={{ uri: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=320&q=80' }}
                    contentFit="cover"
                    style={styles.highlightImage}
                  />
                  <View style={styles.highlightTextOverlay}>
                    <Text style={styles.highlightCardTitle}>Relaxed Styles</Text>
                    <Text style={styles.highlightCardSubtitle}>Effortless Everyday Fits</Text>
                  </View>
                </BouncyPressable>
              </ScrollView>
              <Pressable onPress={() => openBrandShelf('shirt')} style={styles.highlightsPlayButton}>
                <MaterialCommunityIcons name="play" size={24} color="#FFFFFF" />
              </Pressable>
            </View>
          </View>

          {/* Fits For Every Scene */}
          <View style={styles.sceneContainer}>
            <View style={styles.sceneHeaderGlow}>
              <Text style={styles.sceneTitleText}>FITS FOR EVERY SCENE</Text>
            </View>
            <View style={styles.sceneGrid}>
              {[
                {
                  label: 'Wedding',
                  images: [
                    'https://images.unsplash.com/photo-1597983073493-88cd35cf93b0?auto=format&fit=crop&w=150&q=80',
                    'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=150&q=80',
                    'https://images.unsplash.com/photo-1605001011156-cbf0b0f67a51?auto=format&fit=crop&w=150&q=80'
                  ]
                },
                {
                  label: 'Workwear',
                  images: [
                    'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=150&q=80',
                    'https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=150&q=80',
                    'https://images.unsplash.com/photo-1624561172888-ac93c696e10c?auto=format&fit=crop&w=150&q=80'
                  ]
                },
                {
                  label: 'Sports',
                  images: [
                    'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80',
                    'https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=150&q=80',
                    'https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=150&q=80'
                  ]
                },
                {
                  label: 'Party',
                  images: [
                    'https://images.unsplash.com/photo-1488161628813-04466f872be2?auto=format&fit=crop&w=150&q=80',
                    'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=150&q=80',
                    'https://images.unsplash.com/photo-1618886614638-80e3c103d31a?auto=format&fit=crop&w=150&q=80'
                  ]
                },
                {
                  label: 'Travel Ready',
                  images: [
                    'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=150&q=80',
                    'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?auto=format&fit=crop&w=150&q=80',
                    'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=150&q=80'
                  ]
                },
                {
                  label: 'Laidback Fit',
                  images: [
                    'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=150&q=80',
                    'https://images.unsplash.com/photo-1551854838-212c50b4c184?auto=format&fit=crop&w=150&q=80',
                    'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=150&q=80'
                  ]
                }
              ].map((item, index) => (
                <BouncyPressable key={index} onPress={() => openBrandShelf('shirt')} style={styles.sceneCard}>
                  <View style={styles.sceneCardCollage}>
                    {item.images.map((img, imgIdx) => (
                      <Image key={imgIdx} source={{ uri: img }} style={styles.sceneCollageImage} contentFit="cover" />
                    ))}
                  </View>
                  <View style={styles.sceneCardFooter}>
                    <Text style={styles.sceneCardLabel}>{item.label}</Text>
                  </View>
                </BouncyPressable>
              ))}
            </View>
          </View>

          {/* Sponsored Brands */}
          <View style={styles.sponsoredContainer}>
            <Text style={styles.sponsoredTitle}>SPONSORED BRANDS</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.sponsoredScroll}>
              {[
                {
                  brand: 'TIMEX',
                  offer: 'UP TO 40% OFF',
                  sub: 'Limited Time',
                  image: 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&w=400&q=80'
                },
                {
                  brand: 'JACK & JONES',
                  offer: 'UP TO 50% OFF',
                  sub: 'Casual Wear',
                  image: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=400&q=80',
                  hasPlay: true
                }
              ].map((item, index) => (
                <BouncyPressable key={index} onPress={() => openBrandShelf('shirt')} style={styles.sponsoredCard}>
                  <Image source={{ uri: item.image }} style={StyleSheet.absoluteFill} contentFit="cover" />
                  <View style={styles.sponsoredOverlay} />
                  
                  {item.hasPlay && (
                    <View style={styles.sponsoredPlayButton}>
                      <MaterialCommunityIcons name="play" size={24} color="#FFFFFF" />
                    </View>
                  )}

                  <View style={styles.sponsoredInfo}>
                    <Text style={styles.sponsoredOfferText}>{item.offer}</Text>
                    <Text style={styles.sponsoredSubText}>{item.sub}</Text>
                  </View>

                  <View style={styles.sponsoredLogoPillContainer}>
                    <View style={styles.sponsoredLogoPill}>
                      <Text style={styles.sponsoredLogoText}>{item.brand}</Text>
                    </View>
                  </View>
                </BouncyPressable>
              ))}
            </ScrollView>
          </View>

          {/* Hot Right Now */}
          <View style={styles.hotRightNowContainer}>
            <Text style={styles.hotRightNowHeading}>HOT RIGHT NOW</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hotRightNowScroll}>
              {[
                {
                  title: 'REFINED STYLES',
                  sub: 'Iconic Whites',
                  brand: 'ARROW',
                  image: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=320&q=80'
                },
                {
                  title: 'VACAY VIBES',
                  sub: 'Seaside Adventures',
                  brand: 'U.S. POLO ASSN.',
                  image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=320&q=80'
                },
                {
                  title: 'WEDDING DIARIES',
                  sub: 'Festive Favourites',
                  brand: 'MANYAVAR',
                  image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=320&q=80'
                }
              ].map((item, index) => (
                <BouncyPressable key={index} onPress={() => openBrandShelf('shirt')} style={styles.hotRightNowCard}>
                  <Image source={{ uri: item.image }} style={styles.hotRightNowImage} contentFit="cover" />
                  
                  <View style={styles.hotRightNowBody}>
                    <Text style={styles.hotRightNowTitle}>{item.title}</Text>
                    <Text style={styles.hotRightNowSub}>{item.sub}</Text>
                  </View>

                  <View style={styles.hotRightNowLogoContainer}>
                    <View style={styles.hotRightNowLogoPill}>
                      <Text style={styles.hotRightNowLogoText}>{item.brand}</Text>
                    </View>
                  </View>
                </BouncyPressable>
              ))}
            </ScrollView>
          </View>

          {/* Wedding Diaries */}
          <View style={styles.weddingDiariesContainer}>
            <View style={styles.weddingDiariesBanner}>
              <Text style={styles.weddingDiariesTitle}>WEDDING DIARIES</Text>
              <Text style={styles.weddingDiariesSubtitle}>Styles For Every Guest</Text>
            </View>
            
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.weddingDiariesScroll}>
              {[
                {
                  title: 'Nehru Jackets',
                  offer: 'UP TO 70% OFF',
                  image: 'https://images.unsplash.com/photo-1597983073493-88cd35cf93b0?auto=format&fit=crop&w=320&q=80'
                },
                {
                  title: 'Classic Sherwanis',
                  offer: 'UP TO 70% OFF',
                  image: 'https://images.unsplash.com/photo-1605001011156-cbf0b0f67a51?auto=format&fit=crop&w=320&q=80'
                },
                {
                  title: 'Festive Kurtas',
                  offer: 'STARTING ₹999',
                  image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=320&q=80'
                }
              ].map((item, index) => (
                <BouncyPressable key={index} onPress={() => openBrandShelf('kurta')} style={styles.weddingCard}>
                  <Image source={{ uri: item.image }} style={styles.weddingCardImage} contentFit="cover" />
                  <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.8)']}
                    style={StyleSheet.absoluteFill}
                  />
                  <View style={styles.weddingCardContent}>
                    <Text style={styles.weddingCardTitle}>{item.title}</Text>
                    <Text style={styles.weddingCardOffer}>{item.offer}</Text>
                  </View>
                </BouncyPressable>
              ))}
            </ScrollView>
          </View>

          {/* Your Dose of Latest Trends */}
          <View style={styles.trendsContainer}>
            <LinearGradient
              colors={['#FFEDD5', '#FED7AA']}
              style={styles.trendsHeader}
            >
              <Text style={styles.trendsTitleText}>YOUR DOSE OF THE LATEST TRENDS</Text>
              <Text style={styles.trendsSubText}>Powered By TRENDNXT</Text>
            </LinearGradient>
            
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.trendsScroll}>
              {[
                {
                  num: '1',
                  title: 'Elevated Solid Shirts',
                  offer: 'Under ₹1299',
                  image: 'https://images.unsplash.com/photo-1618886614638-80e3c103d31a?auto=format&fit=crop&w=320&q=80'
                },
                {
                  num: '2',
                  title: 'Linen Kurtas',
                  offer: 'Under ₹1499',
                  image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=320&q=80'
                },
                {
                  num: '3',
                  title: 'Chronograph Watches',
                  offer: 'Under ₹4999',
                  image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=320&q=80'
                }
              ].map((item, index) => (
                <BouncyPressable key={index} onPress={() => openBrandShelf('shirt')} style={styles.trendCard}>
                  <Image source={{ uri: item.image }} style={styles.trendImage} contentFit="cover" />
                  
                  <View style={styles.trendNumberContainer}>
                    <Text style={styles.trendNumberText}>{item.num}</Text>
                  </View>

                  <View style={styles.trendContent}>
                    <Text numberOfLines={1} style={styles.trendCardTitle}>{item.title}</Text>
                    <Text style={styles.trendCardOffer}>{item.offer}</Text>
                  </View>
                </BouncyPressable>
              ))}
            </ScrollView>
          </View>

          {/* Brands In Focus */}
          <View style={styles.focusContainer}>
            <View style={styles.focusHeader}>
              <Text style={styles.focusHeadingText}>BRANDS IN FOCUS</Text>
              <Pressable onPress={() => openBrandShelf('shirt')} style={styles.focusPlayIcon}>
                <MaterialCommunityIcons name="play" size={16} color="#FFFFFF" />
              </Pressable>
            </View>
            
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.focusScroll}>
              {[
                {
                  title: 'PREMIUM BAGS',
                  offer: 'UP TO 50% OFF',
                  image: 'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=320&q=80'
                },
                {
                  title: 'LUXURY SUITS',
                  offer: 'UP TO 40% OFF',
                  image: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=320&q=80'
                },
                {
                  title: 'ATHLETIC SHOES',
                  offer: 'UP TO 30% OFF',
                  image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=320&q=80'
                }
              ].map((item, index) => (
                <BouncyPressable key={index} onPress={() => openBrandShelf('shirt')} style={styles.focusCard}>
                  <Image source={{ uri: item.image }} style={StyleSheet.absoluteFill} contentFit="cover" />
                  <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.7)']}
                    style={StyleSheet.absoluteFill}
                  />
                  <View style={styles.focusCardContent}>
                    <Text style={styles.focusCardTitle}>{item.title}</Text>
                    <Text style={styles.focusCardOffer}>{item.offer}</Text>
                  </View>
                </BouncyPressable>
              ))}
            </ScrollView>
          </View>
        </>
      ) : selectedAudience === 'Women' ? (
        <>
          {/* Women circular category circles */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.departmentRow}>
            {womenCategories.map((cat) => (
              <BouncyPressable
                key={cat.id}
                onPress={() => {
                  setQuery(cat.query);
                  setActiveShelfTitle(`Women's ${cat.label}`);
                  setSelectedCategory('Fashion');
                  setSelectedQuickFilter('Fast delivery');
                }}
                style={styles.menCategoryItem}>
                <View style={[styles.menCategoryCircle, { borderColor: '#E11D48', backgroundColor: '#FFF' }]}>
                  <Image contentFit="cover" source={getImageSource(cat.image)} style={styles.menCategoryImage} />
                </View>
                <Text numberOfLines={1} style={styles.menCategoryLabel}>
                  {cat.label}
                </Text>
              </BouncyPressable>
            ))}
          </ScrollView>

          {/* Coupon strip */}
          <BouncyPressable
            onPress={() => {
              setSelectedQuickFilter('Coupon ready');
              setSortMode('Price low');
            }}
            style={styles.couponBand}>
            <Text style={styles.couponText}>FLAT Rs 500 OFF</Text>
            <View style={styles.couponCode}>
              <Text style={styles.couponCodeEyebrow}>USE CODE:</Text>
              <Text style={styles.couponCodeText}>EORS500</Text>
            </View>
          </BouncyPressable>

          {/* Main promotional hero carousel */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dealHeroRow}>
            <BouncyPressable onPress={() => openDepartment(departments[3])} scaleTo={0.985} style={styles.dealHeroCard}>
              <Image contentFit="cover" source={{ uri: homeHeroImage }} style={StyleSheet.absoluteFill} />
              <View style={styles.heroScrim} />
              <View style={styles.saleTag}>
                <Text style={styles.saleTagText}>AD</Text>
              </View>
              <View style={styles.dealHeroFooter}>
                <Text style={styles.dealHeroTitle}>Home Decor</Text>
                <View style={styles.blackCta}>
                  <Text style={styles.blackCtaText}>Shop Now</Text>
                  <MaterialCommunityIcons color={colors.white} name="arrow-right-circle" size={17} />
                </View>
              </View>
            </BouncyPressable>
            <BouncyPressable onPress={openHeroDeal} scaleTo={0.985} style={styles.dealHeroCardLarge}>
              <Image contentFit="cover" source={getImageSource(require('../assets/images/women_banner_model.png'))} style={StyleSheet.absoluteFill} />
              <View style={styles.heroScrim} />
              <View style={styles.reasonBadge}>
                <Text style={styles.reasonBadgeText}>END OF REASON SALE</Text>
              </View>
              <View style={styles.dealHeroCopy}>
                <Text style={styles.dealHeroTitle}>Smart Casual Fit</Text>
                <Text style={styles.dealHeroPrice}>UNDER Rs 299</Text>
              </View>
              <View style={styles.dealBrandFooter}>
                <Text style={styles.dealBrandText}>amante</Text>
                <Text style={styles.dealBrandText}>GUESS</Text>
                <Text style={styles.dealBrandMore}>+ More</Text>
              </View>
            </BouncyPressable>
          </ScrollView>

          {/* Carousel dots */}
          <View style={styles.carouselDots}>
            {Array.from({ length: 7 }).map((_, index) => (
              <View key={index} style={[styles.carouselDot, index === 1 ? styles.carouselDotActive : null]} />
            ))}
          </View>

          {/* Powered-by brand strip */}
          <BouncyPressable onPress={() => openBrandShelf('kurta')} style={styles.brandStrip}>
            <Text style={styles.brandStripLabel}>POWERED BY</Text>
            <Text style={styles.brandStripName}>amante</Text>
            <Text style={styles.brandStripName}>GUESS</Text>
          </BouncyPressable>

          {/* Cashback strip */}
          <BouncyPressable
            onPress={() => {
              setSelectedQuickFilter('Coupon ready');
              setSortMode('Price low');
            }}
            style={styles.cashbackStrip}>
            <View style={styles.cashbackIcon}>
              <MaterialCommunityIcons color={colors.white} name="credit-card-check-outline" size={18} />
            </View>
            <Text numberOfLines={1} style={styles.cashbackText}>
              7.5% cashback with selected bank cards
            </Text>
            <View style={styles.cashbackCta}>
              <Text style={styles.cashbackCtaText}>Apply now</Text>
            </View>
          </BouncyPressable>

          {/* Continue wishlisting card */}
          {wishlistPreview ? (
            <View style={styles.wishlistPanel}>
              <Text style={styles.wishlistTitle}>CONTINUE WISHLISTING</Text>
              <BouncyPressable onPress={() => openProduct(wishlistPreview)} style={styles.wishlistCard}>
                <Image contentFit="cover" source={{ uri: wishlistPreview.image }} style={styles.wishlistImage} />
                <View style={styles.wishlistCopy}>
                  <Text numberOfLines={1} style={styles.wishlistBrand}>
                    {wishlistPreview.brand}
                  </Text>
                  <Text numberOfLines={1} style={styles.wishlistName}>
                    {wishlistPreview.name}
                  </Text>
                </View>
                <View style={styles.playButton}>
                  <MaterialCommunityIcons color={colors.white} name="play" size={18} />
                </View>
              </BouncyPressable>
            </View>
          ) : null}

          {/* Top brands section header */}
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Top brands to wishlist</Text>
              <Text style={styles.sectionSubtitle}>Statement deals from curated brands</Text>
            </View>
            <Pressable
              onPress={() => {
                setSelectedQuickFilter('Top rated');
                setSortMode('Rating');
              }}
              style={styles.textAction}>
              <Text style={styles.textActionLabel}>Top rated</Text>
            </Pressable>
          </View>

          {/* Top brands carousel */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.brandCardRow}>
            <BouncyPressable
              onPress={() => {
                openBrandShelf('watch', 'Price high');
              }}
              style={styles.brandCard}>
              <Image contentFit="cover" source={{ uri: brandWatchImage }} style={styles.brandCardImage} />
              <View style={styles.brandCardScrim} />
              <Text style={styles.brandCardOffer}>Up To 40% Off</Text>
              <Text style={styles.brandCardTitle}>Statement Watches</Text>
              <Text style={styles.brandCardLogo}>GUESS</Text>
            </BouncyPressable>
            <BouncyPressable onPress={() => openBrandShelf('dress', 'Price high')} style={styles.brandCard}>
              <Image contentFit="cover" source={{ uri: brandStyleImage }} style={styles.brandCardImage} />
              <View style={styles.brandCardScrim} />
              <Text style={styles.brandCardOffer}>Up To 60% Off</Text>
              <Text style={styles.brandCardTitle}>Premium Fit, Everyday Comfort</Text>
              <Text style={styles.brandCardLogo}>amante</Text>
            </BouncyPressable>
          </ScrollView>

          {/* Budget-friendly finds section */}
          <View style={styles.budgetPanel}>
            <Text style={styles.budgetTitle}>BUDGET-FRIENDLY FINDS</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.budgetRow}>
              {budgetProducts.map((product) => (
                <BouncyPressable key={product.id} onPress={() => openProduct(product)} style={styles.budgetCard}>
                  <Image contentFit="cover" source={{ uri: product.image }} style={styles.budgetImage} />
                  <View style={styles.budgetOverlay}>
                    <Text style={styles.budgetUnder}>Under</Text>
                    <Text style={styles.budgetPrice}>{buildProductPriceLabel(product)}</Text>
                    <Text numberOfLines={1} style={styles.budgetName}>
                      {product.name}
                    </Text>
                  </View>
                </BouncyPressable>
              ))}
            </ScrollView>
          </View>

          {/* Hottest categories section header */}
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Hottest categories</Text>
              <Text style={styles.sectionSubtitle}>Tap to jump into a shelf</Text>
            </View>
          </View>

          {/* Hottest categories grid */}
          <View style={styles.hotGrid}>
            {miniCategories.slice(0, 4).map((category) => (
              <BouncyPressable
                key={category.id}
                onPress={() => openMiniCategory(category)}
                style={styles.hotCategoryCard}>
                <Image contentFit="cover" source={{ uri: category.image }} style={styles.hotCategoryImage} />
                <View style={styles.hotCategoryScrim} />
                <Text style={styles.hotCategoryTitle}>{category.label}</Text>
                <Text style={styles.hotCategorySubtitle}>Up to 60% off</Text>
              </BouncyPressable>
            ))}
          </View>

          {/* Explore more section header */}
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Explore more</Text>
              <Text style={styles.sectionSubtitle}>More shopping lanes in Gozy</Text>
            </View>
          </View>

          {/* Explore more cards */}
          <View style={styles.exploreGrid}>
            {exploreMoreItems.map((item) => (
              <BouncyPressable key={item.id} onPress={() => openExplore(item)} style={styles.exploreCard}>
                <View style={[styles.exploreIcon, { backgroundColor: item.color }]}>
                  <MaterialCommunityIcons color={colors.white} name={item.icon} size={21} />
                </View>
                <View style={styles.exploreCopy}>
                  <Text numberOfLines={1} style={styles.exploreTitle}>
                    {item.title}
                  </Text>
                  <Text numberOfLines={1} style={styles.exploreSubtitle}>
                    {item.subtitle}
                  </Text>
                </View>
                <MaterialCommunityIcons color={colors.textMuted} name="chevron-right" size={20} />
              </BouncyPressable>
            ))}
          </View>

          {/* Featured products carousel */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.featuredRow}>
            {featuredProducts.map((product) => (
              <BouncyPressable key={product.id} onPress={() => openProduct(product)} style={styles.featuredCard}>
                <Image contentFit="cover" source={{ uri: product.image }} style={styles.featuredImage} />
                <View style={styles.featuredBody}>
                  <Text numberOfLines={1} style={styles.productBrand}>
                    {product.brand}
                  </Text>
                  <Text numberOfLines={1} style={styles.productName}>
                    {product.name}
                  </Text>
                  <View style={styles.priceRow}>
                    <Text style={styles.productPrice}>{buildProductPriceLabel(product)}</Text>
                    <Text style={styles.discountText}>{discountFor(product)}% OFF</Text>
                  </View>
                </View>
              </BouncyPressable>
            ))}
          </ScrollView>
        </>
      ) : selectedAudience === 'Kids' ? (
        <>
          {/* Kids Category Circles Rail */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.departmentRow}>
            {[
              { id: 'girls', label: 'Girls', img: 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=150&q=80', isHex: true },
              { id: 'boys', label: 'Boys', img: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=150&q=80' },
              { id: 'infants', label: 'Infants', img: 'https://images.unsplash.com/photo-1519689680058-324335c77ebe?auto=format&fit=crop&w=150&q=80' },
              { id: 'teens', label: 'Teens', img: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=150&q=80' },
              { id: 'addons', label: 'Add-ons', img: require('../assets/images/cat_accessories.png') }
            ].map((cat) => (
              <BouncyPressable
                key={cat.id}
                onPress={() => { setQuery(cat.id === 'addons' ? 'bag' : cat.id); setActiveShelfTitle(cat.label); }}
                style={styles.menCategoryItem}
              >
                {cat.isHex ? (
                  /* Golden hex border style for Girls */
                  <View style={styles.girlsHexBorderContainer}>
                    <View style={styles.girlsHexBorderInner}>
                      <Image source={getImageSource(cat.img)} style={styles.menCategoryImage} contentFit="cover" />
                    </View>
                  </View>
                ) : (
                  <View style={[styles.menCategoryCircle, { borderColor: '#E5E7EB', backgroundColor: '#FFF' }]}>
                    <Image source={getImageSource(cat.img)} style={styles.menCategoryImage} contentFit="cover" />
                  </View>
                )}
                <Text numberOfLines={1} style={[styles.menCategoryLabel, cat.isHex ? { color: '#E11D48', fontWeight: '900' } : null]}>
                  {cat.label}
                </Text>
              </BouncyPressable>
            ))}
          </ScrollView>

          {/* SALE IS LIVE coupon strip */}
          <BouncyPressable
            onPress={() => {
              setSelectedQuickFilter('Coupon ready');
              setSortMode('Price low');
            }}
            style={styles.kidsCouponBand}
          >
            <View style={styles.kidsCouponBadge}><Text style={styles.kidsCouponBadgeText}>END OF REASON SALE</Text></View>
            <Text style={styles.kidsCouponText}>SALE IS LIVE!</Text>
            <View style={styles.kidsShopNowButton}>
              <Text style={styles.kidsShopNowButtonText}>Shop Now</Text>
              <MaterialCommunityIcons name="chevron-right" size={12} color="#000000" />
            </View>
          </BouncyPressable>

          {/* Megaphone Girls Wear EORS Hero Banner */}
          <BouncyPressable onPress={() => openBrandShelf('dress')} style={styles.kidsHeroContainer}>
            <LinearGradient
              colors={['#FCD34D', '#F97316', '#EF4444']}
              start={{ x: 0.1, y: 0 }}
              end={{ x: 0.9, y: 1 }}
              style={styles.kidsHeroContent}
            >
              <View style={styles.kidsHeroLeft}>
                {/* Sale Badge */}
                <View style={styles.kidsHeroSaleBadgeContainer}>
                  <View style={styles.kidsHeroSaleBadge}>
                    <Text style={styles.kidsHeroSaleBadgeText}>END OF</Text>
                    <Text style={styles.kidsHeroSaleBadgeTextBold}>REASON</Text>
                    <Text style={styles.kidsHeroSaleBadgeText}>SALE</Text>
                    <View style={styles.kidsLiveNowBadge}><Text style={styles.kidsLiveNowBadgeText}>• LIVE NOW</Text></View>
                  </View>
                </View>
                
                <Text style={styles.kidsHeroTitle}>Cute Girls Wear</Text>
                <Text style={styles.kidsHeroDiscount}>50-80% OFF</Text>
                
                <View style={styles.kidsHeroShopBtn}>
                  <Text style={styles.kidsHeroShopBtnText}>Shop Now</Text>
                  <MaterialCommunityIcons name="chevron-right" size={13} color="#FFFFFF" />
                </View>
              </View>
              
              {/* Kids model image on right */}
              <View style={styles.kidsHeroRight}>
                <Image
                  source={{ uri: 'https://images.unsplash.com/photo-1519457431-44ccd64a579b?auto=format&fit=crop&w=400&q=80' }}
                  style={styles.kidsHeroModelImage}
                  contentFit="cover"
                />
              </View>
            </LinearGradient>
          </BouncyPressable>

          {/* Dots Indicator below Hero Banner */}
          <View style={[styles.carouselDots, { marginTop: 10, marginBottom: 15 }]}>
            {Array.from({ length: 11 }).map((_, index) => (
              <View key={index} style={[styles.carouselDot, index === 0 ? styles.carouselDotActive : null]} />
            ))}
          </View>

          {/* HDFC Bank Offer Strip */}
          <Pressable onPress={() => setShoppingFilters(prev => ({ ...prev, minDiscount: 40 }))} style={styles.hdfcOfferStrip}>
            <View style={styles.hdfcLogoContainer}>
              <Text style={styles.hdfcLogoText}>HDFC BANK</Text>
            </View>
            <View style={styles.hdfcTextContainer}>
              <Text style={styles.hdfcOfferTitle}>10% Instant Discount*</Text>
              <Text style={styles.hdfcOfferSubtitle}>On HDFC Bank Credit Cards and EASYEMI on Credit Cards</Text>
            </View>
          </Pressable>

          {/* Categories Grid Row (Dresses, Soft Toys, Clogs, Accessories, Ballerinas) */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={[styles.pocketFriendlyScroll, { marginVertical: spacing.md }]}>
            {[
              { label: 'Dresses', img: 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=150&q=80', query: 'dress' },
              { label: 'Soft Toys', img: 'https://images.unsplash.com/photo-1559251606-c623743a6d76?auto=format&fit=crop&w=150&q=80', query: 'romper' },
              { label: 'Clogs & Flip Flops', img: require('../assets/images/women_cat_footwear.png'), query: 'sneakers' },
              { label: 'Accessories', img: require('../assets/images/cat_accessories.png'), query: 'bag' },
              { label: 'Ballerinas', img: require('../assets/images/cat_footwear.png'), query: 'sneakers' }
            ].map((item, index) => (
              <BouncyPressable key={index} onPress={() => { setQuery(item.query); setActiveShelfTitle(item.label); }} style={styles.pocketFriendlyCard}>
                <View style={styles.pocketFriendlyImageContainer}>
                  <Image source={getImageSource(item.img)} style={styles.pocketFriendlyImage} contentFit="cover" />
                </View>
                <View style={[styles.pocketFriendlyPill, { backgroundColor: '#E11D48' }]}>
                  <Text numberOfLines={1} style={styles.pocketFriendlyPillText}>{item.label}</Text>
                </View>
              </BouncyPressable>
            ))}
          </ScrollView>

          {/* Character Shop Grid */}
          <View style={styles.characterShopContainer}>
            <Text style={styles.characterShopHeading}>Character Shop</Text>
            <View style={styles.characterShopGrid}>
              {[
                { name: 'Avengers', img: 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=180&q=80', query: 'shirt', color: '#FEF08A' },
                { name: 'Spider-Man', img: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=180&q=80', query: 'shirt', color: '#FED7AA' },
                { name: 'Hello Kitty', img: 'https://images.unsplash.com/photo-1519457431-44ccd64a579b?auto=format&fit=crop&w=180&q=80', query: 'dress', color: '#FBCFE8' },
                { name: 'Mickey Mouse', img: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=180&q=80', query: 'shirt', color: '#E9D5FF' },
                { name: 'Minnie Mouse', img: 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=180&q=80', query: 'dress', color: '#FECDD3' },
                { name: 'The Lion King', img: 'https://images.unsplash.com/photo-1519689680058-324335c77ebe?auto=format&fit=crop&w=180&q=80', query: 'romper', color: '#FEF08A' },
                { name: 'Disney Princess', img: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=180&q=80', query: 'dress', color: '#FBCFE8' },
                { name: 'Captain America', img: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=180&q=80', query: 'shirt', color: '#BFDBFE' },
                { name: 'Winnie The Pooh', img: 'https://images.unsplash.com/photo-1519689680058-324335c77ebe?auto=format&fit=crop&w=180&q=80', query: 'romper', color: '#FDE68A' },
                { name: 'Batman', img: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=180&q=80', query: 'shirt', color: '#E2E8F0' },
                { name: 'Peppa Pig', img: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=180&q=80', query: 'dress', color: '#FFF1F2' },
                { name: 'Baby Shark', img: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=180&q=80', query: 'shirt', color: '#CFFAFE' }
              ].map((char, index) => (
                <BouncyPressable
                  key={index}
                  onPress={() => { setQuery(char.query); setActiveShelfTitle(char.name); }}
                  style={styles.characterCard}
                >
                  <View style={[styles.characterImageWrapper, { backgroundColor: char.color }]}>
                    <Image source={{ uri: char.img }} style={styles.characterCardImage} contentFit="cover" />
                  </View>
                  <View style={styles.characterLabelPill}>
                    <Text numberOfLines={1} style={styles.characterLabelText}>{char.name}</Text>
                    <MaterialCommunityIcons name="chevron-right" size={10} color="#000000" />
                  </View>
                </BouncyPressable>
              ))}
            </View>
          </View>

          {/* SUPER-HOT DEALS */}
          <View style={styles.kidsSuperHotContainer}>
            <View style={styles.kidsSuperHotHeader}>
              <Text style={styles.kidsSuperHotTitle}>SUPER-HOT DEALS</Text>
              <BouncyPressable onPress={() => openBrandShelf('dress')} style={styles.kidsSuperHotBadge}>
                <Text style={styles.kidsSuperHotBadgeText}>Shop Now</Text>
                <MaterialCommunityIcons name="chevron-right" size={13} color="#FFFFFF" />
              </BouncyPressable>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.kidsSuperHotScroll}>
              
              {/* Deal 1: Sweet Little Styles */}
              <BouncyPressable onPress={() => openBrandShelf('dress')} style={styles.kidsSuperHotCard}>
                <Image
                  source={{ uri: 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=400&q=80' }}
                  style={StyleSheet.absoluteFill}
                  contentFit="cover"
                />
                <LinearGradient colors={['transparent', 'rgba(0,0,0,0.8)']} style={StyleSheet.absoluteFill} />
                <View style={styles.kidsSuperHotCardContent}>
                  <Text style={styles.kidsSuperHotCardOffer}>MIN. 55% OFF</Text>
                  <Text style={styles.kidsSuperHotCardSub}>Sweet Little Styles</Text>
                </View>
                <View style={styles.kidsSuperHotLogosRow}>
                  <Text style={styles.kidsSuperHotLogoText}>Allen Solly</Text>
                  <View style={styles.verticalBrandSeparator} />
                  <Text style={styles.kidsSuperHotLogoText}>U.S. Polo Assn.</Text>
                </View>
                <View style={styles.kidsSuperHotMorePill}>
                  <Text style={styles.kidsSuperHotMorePillText}>& More</Text>
                </View>
              </BouncyPressable>

              {/* Deal 2: Little Lehengas */}
              <BouncyPressable onPress={() => openBrandShelf('dress')} style={styles.kidsSuperHotCard}>
                <Image
                  source={{ uri: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=400&q=80' }}
                  style={StyleSheet.absoluteFill}
                  contentFit="cover"
                />
                <LinearGradient colors={['transparent', 'rgba(0,0,0,0.8)']} style={StyleSheet.absoluteFill} />
                <View style={styles.kidsSuperHotCardContent}>
                  <Text style={styles.kidsSuperHotCardOffer}>UNDER ₹799</Text>
                  <Text style={styles.kidsSuperHotCardSub}>Little Lehengas For Li'l Ones</Text>
                </View>
                <View style={styles.kidsSuperHotLogosRow}>
                  <Text style={styles.kidsSuperHotLogoText}>Bitiya by Bhama</Text>
                </View>
                <View style={styles.kidsSuperHotMorePill}>
                  <Text style={styles.kidsSuperHotMorePillText}>& More</Text>
                </View>
              </BouncyPressable>

            </ScrollView>
          </View>

          {/* Kids FEATURED BRANDS */}
          <View style={styles.kidsFeaturedBrandsContainer}>
            <Text style={styles.kidsFeaturedBrandsHeading}>FEATURED BRANDS</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.featuredBrandsAllScroll}>
              
              {/* Ed-a-Mamma Card */}
              <BouncyPressable onPress={() => openBrandShelf('dress')} style={styles.brandAllCard}>
                <Image
                  source={{ uri: 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=400&q=80' }}
                  style={StyleSheet.absoluteFill}
                  contentFit="cover"
                />
                <LinearGradient colors={['transparent', 'rgba(0,0,0,0.85)']} style={StyleSheet.absoluteFill} />
                <View style={styles.brandAllCardContent}>
                  <Text style={styles.brandAllCardOffer}>UP TO 60% OFF</Text>
                  <Text style={styles.brandAllCardSub}>Conscious Clothing For Kids</Text>
                </View>
                <View style={styles.brandAllLogoPillContainer}>
                  <View style={styles.brandAllLogoPill}>
                    <Text style={[styles.miraggioLogoText, { letterSpacing: 0.5 }]}>ED-A-MAMMA</Text>
                  </View>
                </View>
              </BouncyPressable>

              {/* Crocs Card */}
              <BouncyPressable onPress={() => openBrandShelf('sneakers')} style={styles.brandAllCard}>
                <Image
                  source={{ uri: 'https://images.unsplash.com/photo-1603808033192-082d6919d3e1?auto=format&fit=crop&w=400&q=80' }}
                  style={StyleSheet.absoluteFill}
                  contentFit="cover"
                />
                <LinearGradient colors={['transparent', 'rgba(0,0,0,0.85)']} style={StyleSheet.absoluteFill} />
                <View style={styles.brandAllCardContent}>
                  <Text style={styles.brandAllCardOffer}>MIN. 45% OFF</Text>
                  <Text style={styles.brandAllCardSub}>Fav Clogs On Sale</Text>
                </View>
                <View style={styles.brandAllLogoPillContainer}>
                  <View style={[styles.brandAllLogoPill, { paddingVertical: 4 }]}>
                    <Text style={[styles.miraggioLogoText, { fontSize: 13, fontWeight: '900', color: '#000000' }]}>crocs</Text>
                  </View>
                </View>
              </BouncyPressable>

            </ScrollView>
          </View>

          {/* YOUR DOSE OF THE LATEST TRENDS */}
          <View style={styles.latestTrendsContainer}>
            <View style={styles.latestTrendsHeader}>
              <Text style={styles.latestTrendsTitle}>YOUR DOSE OF THE LATEST TRENDS</Text>
              <Text style={styles.latestTrendsSubtitle}>Powered By TRENDNXT</Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.latestTrendsScroll}>
              
              {/* Card 1 */}
              <BouncyPressable onPress={() => openBrandShelf('dress')} style={styles.latestTrendCard}>
                <Image
                  source={{ uri: 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=300&q=80' }}
                  style={StyleSheet.absoluteFill}
                  contentFit="cover"
                />
                <LinearGradient colors={['transparent', 'rgba(0,0,0,0.8)']} style={StyleSheet.absoluteFill} />
                <View style={styles.latestTrendNumberContainer}>
                  <Text style={styles.latestTrendNumber}>1</Text>
                </View>
                <View style={styles.latestTrendCardContent}>
                  <Text style={styles.latestTrendLabel}>Sunny Dresses</Text>
                  <Text style={styles.latestTrendPrice}>Under ₹999</Text>
                </View>
              </BouncyPressable>

              {/* Card 2 */}
              <BouncyPressable onPress={() => openBrandShelf('kurta')} style={styles.latestTrendCard}>
                <Image
                  source={{ uri: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=300&q=80' }}
                  style={StyleSheet.absoluteFill}
                  contentFit="cover"
                />
                <LinearGradient colors={['transparent', 'rgba(0,0,0,0.8)']} style={StyleSheet.absoluteFill} />
                <View style={styles.latestTrendNumberContainer}>
                  <Text style={styles.latestTrendNumber}>2</Text>
                </View>
                <View style={styles.latestTrendCardContent}>
                  <Text style={styles.latestTrendLabel}>Printed Sharara Sets</Text>
                  <Text style={styles.latestTrendPrice}>Under ₹1299</Text>
                </View>
              </BouncyPressable>

              {/* Card 3 */}
              <BouncyPressable onPress={() => openBrandShelf('sneakers')} style={styles.latestTrendCard}>
                <Image
                  source={{ uri: 'https://images.unsplash.com/photo-1603808033192-082d6919d3e1?auto=format&fit=crop&w=300&q=80' }}
                  style={StyleSheet.absoluteFill}
                  contentFit="cover"
                />
                <LinearGradient colors={['transparent', 'rgba(0,0,0,0.8)']} style={StyleSheet.absoluteFill} />
                <View style={styles.latestTrendNumberContainer}>
                  <Text style={styles.latestTrendNumber}>3</Text>
                </View>
                <View style={styles.latestTrendCardContent}>
                  <Text style={styles.latestTrendLabel}>Strappy Sandals</Text>
                  <Text style={styles.latestTrendPrice}>Under ₹1199</Text>
                </View>
              </BouncyPressable>

            </ScrollView>
          </View>
        </>
      ) : (
        <>
          {/* Main category rail */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.departmentRow}>
            {departments.map((department) => (
              <BouncyPressable
                key={department.id}
                onPress={() => openDepartment(department)}
                style={styles.menCategoryItem}>
                <View style={[styles.menCategoryCircle, { borderColor: '#E11D48', backgroundColor: '#FFF' }]}>
                  <Image contentFit="cover" source={getImageSource(department.image)} style={styles.menCategoryImage} />
                </View>
                <Text numberOfLines={1} style={styles.menCategoryLabel}>
                  {department.label}
                </Text>
              </BouncyPressable>
            ))}
          </ScrollView>

          {/* Coupon strip */}
          <BouncyPressable
            onPress={() => {
              setSelectedQuickFilter('Coupon ready');
              setSortMode('Price low');
            }}
            style={styles.couponBand}>
            <Text style={styles.couponText}>FLAT Rs 500 OFF</Text>
            <View style={styles.couponCode}>
              <Text style={styles.couponCodeEyebrow}>USE CODE:</Text>
              <Text style={styles.couponCodeText}>EORS500</Text>
            </View>
          </BouncyPressable>

          {/* EORS Hero Banner */}
          <BouncyPressable onPress={() => openBrandShelf('shirt', 'Price high')} style={styles.menHeroContainer}>
            <LinearGradient
              colors={['#FCD34D', '#F97316', '#EF4444']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.menHeroBorder}
            >
              <View style={styles.menHeroInnerEors}>
                <Image
                  source={require('../assets/images/eors_banner.jpg')}
                  contentFit="cover"
                  style={StyleSheet.absoluteFill}
                />
              </View>
            </LinearGradient>
          </BouncyPressable>

          {/* EORS Dots Indicator */}
          <View style={[styles.carouselDots, { marginTop: 10, marginBottom: 15 }]}>
            {Array.from({ length: 11 }).map((_, index) => (
              <View key={index} style={[styles.carouselDot, index === 1 ? styles.carouselDotActive : null]} />
            ))}
          </View>


          {/* Partner Strips */}
          <View style={styles.partnerStripsContainer}>
            <View style={styles.partnerRow}>
              <LinearGradient
                colors={['#EF4444', '#B91C1C']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.poweredLabelBlock}
              >
                <Text style={styles.poweredLabelText}>POWERED BY</Text>
              </LinearGradient>
              <Pressable onPress={() => openBrandShelf('shirt')} style={[styles.partnerBrandBlock, { backgroundColor: '#4C1D95' }]}>
                <Text style={[styles.partnerBrandText, { color: '#FFFFFF' }]}>Libas</Text>
                <MaterialCommunityIcons name="chevron-right" size={14} color="#FFFFFF" />
              </Pressable>
              <Pressable onPress={() => openBrandShelf('shirt')} style={[styles.partnerBrandBlock, { backgroundColor: '#FFFFFF', borderColor: '#E5E7EB', borderWidth: 1 }]}>
                <Text style={[styles.partnerBrandText, { color: '#000000' }]}>RARE RABBIT</Text>
                <MaterialCommunityIcons name="chevron-right" size={14} color="#000000" />
              </Pressable>
            </View>
            <View style={styles.partnerRow}>
              <Pressable onPress={() => openBrandShelf('bag')} style={[styles.partnerBrandBlock, { backgroundColor: '#F3F4F6' }]}>
                <Text style={[styles.partnerBrandText, { color: '#111827' }]}>MIRAGGIO</Text>
              </Pressable>
              <Pressable onPress={() => openBrandShelf('jeans')} style={[styles.partnerBrandBlock, { backgroundColor: '#002C5B' }]}>
                <Text style={[styles.partnerBrandText, { color: '#FFFFFF' }]}>JACK & JONES</Text>
              </Pressable>
              <Pressable onPress={() => openBrandShelf('watch')} style={[styles.partnerBrandBlock, { backgroundColor: '#111827' }]}>
                <Text style={[styles.partnerBrandText, { color: '#FFFFFF' }]}>TIMEX</Text>
              </Pressable>
              <LinearGradient
                colors={['#EF4444', '#B91C1C']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.poweredLabelBlock}
              >
                <Text style={styles.poweredLabelText}>PARTNERS</Text>
              </LinearGradient>
            </View>
          </View>

          {/* HDFC Bank Offer Strip */}
          <Pressable onPress={() => setShoppingFilters(prev => ({ ...prev, minDiscount: 40 }))} style={styles.hdfcOfferStrip}>
            <View style={styles.hdfcLogoContainer}>
              <Text style={styles.hdfcLogoText}>HDFC BANK</Text>
            </View>
            <View style={styles.hdfcTextContainer}>
              <Text style={styles.hdfcOfferTitle}>10% Instant Discount*</Text>
              <Text style={styles.hdfcOfferSubtitle}>On HDFC Bank Credit Cards</Text>
            </View>
            <View style={styles.playToSlayButton}>
              <MaterialCommunityIcons name="play" size={11} color="#FFFFFF" style={{ marginRight: 2 }} />
              <Text style={styles.playToSlayText}>PLAY TO SLAY</Text>
            </View>
          </Pressable>

          {/* Brand of the Day */}
          <View style={styles.brandOfDayContainer}>
            <View style={styles.brandOfDayHeader}>
              <Text style={styles.brandOfDayHeading}>BRAND OF THE DAY</Text>
              <View style={styles.adBadge}><Text style={styles.adBadgeText}>AD</Text></View>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.brandOfDayScroll}>
              <BouncyPressable onPress={() => openBrandShelf('kurta')} style={styles.brandOfDayCard}>
                <LinearGradient
                  colors={['#7F1D1D', '#991B1B', '#B91C1C']}
                  style={StyleSheet.absoluteFill}
                />
                <Text style={styles.brandOfDayLogo}>VARANGA</Text>
                <Text style={styles.brandOfDayOffer}>UP TO 80% OFF ›</Text>
              </BouncyPressable>
              
              <BouncyPressable onPress={() => openBrandShelf('shirt')} style={styles.brandOfDayCard}>
                <LinearGradient
                  colors={['#7F1D1D', '#991B1B', '#B91C1C']}
                  style={StyleSheet.absoluteFill}
                />
                <Text style={styles.brandOfDayLogo}>CRAZY DEALS</Text>
                <Text style={styles.brandOfDayOffer}>SHOP NOW ›</Text>
              </BouncyPressable>
            </ScrollView>
          </View>

          {/* Streax Hair Serum Ad Banner */}
          <BouncyPressable onPress={() => openBrandShelf('serum')} style={styles.streaxBanner}>
            <LinearGradient
              colors={['#701A75', '#D946EF', '#F472B6']}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={StyleSheet.absoluteFill}
            />
            {/* Ad badge */}
            <View style={styles.streaxAdBadge}>
              <Text style={styles.streaxAdBadgeText}>AD</Text>
            </View>
            
            {/* Model image */}
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=260&q=80' }}
              style={styles.streaxModelImage}
              contentFit="cover"
            />
            
            {/* Text content */}
            <View style={styles.streaxContent}>
              <View style={styles.streaxBrandPill}>
                <Text style={styles.streaxBrandText}>streax</Text>
                <Text style={styles.streaxSubText}>HAIR SERUM</Text>
              </View>
              <View style={styles.streaxOfferContainer}>
                <Text style={styles.streaxOfferTitle}>UP TO 25%</Text>
                <Text style={styles.streaxOfferSub}>OFF</Text>
              </View>
            </View>
          </BouncyPressable>

          {/* Streax Dots Indicator */}
          <View style={styles.streaxDots}>
            {Array.from({ length: 9 }).map((_, index) => (
              <View key={index} style={[styles.streaxDot, index === 1 ? styles.streaxDotActive : null]} />
            ))}
          </View>

          {/* Price Store Grid */}
          <View style={styles.priceStoreContainer}>
            <View style={styles.priceStoreTopRow}>
              {/* Left Column: Large Card */}
              <BouncyPressable onPress={() => setShoppingFilters(prev => ({ ...prev, maxPrice: 99 }))} style={styles.priceCardLarge}>
                <LinearGradient
                  colors={['#8B5CF6', '#4C1D95']}
                  style={StyleSheet.absoluteFill}
                />
                <View style={styles.radialRaysContainer}>
                  <Image
                    source={require('../assets/images/price_store_models.png')}
                    style={StyleSheet.absoluteFill}
                    contentFit="cover"
                  />
                </View>
                <LinearGradient
                  colors={['rgba(76, 29, 149, 0.15)', 'rgba(76, 29, 149, 0.85)']}
                  style={StyleSheet.absoluteFill}
                />
                <View style={styles.priceCardLargeTopContent}>
                  <Text style={styles.priceStoreTitleGold}>PRICE</Text>
                  <Text style={styles.priceStoreTitleGold}>STORE</Text>
                </View>
                <View style={styles.priceCardLargeBottomContent}>
                  <Text style={styles.priceCardLargeLabelText}>Under</Text>
                  <Text style={styles.priceCardLargeValueText}>₹99</Text>
                </View>
              </BouncyPressable>
              
              {/* Right Column: 3 Stacked Cards */}
              <View style={styles.priceStoreRightCol}>
                {/* Card 1: Flat 80% */}
                <BouncyPressable onPress={() => setShoppingFilters(prev => ({ ...prev, minDiscount: 80 }))} style={styles.priceCardPink}>
                  <LinearGradient
                    colors={['#EC4899', '#701A75']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={StyleSheet.absoluteFill}
                  />
                  <Text style={styles.priceCardSmallLabelText}>Flat</Text>
                  <Text style={styles.priceCardSmallValueText}>80%</Text>
                </BouncyPressable>

                {/* Card 2: Under 199 */}
                <BouncyPressable onPress={() => setShoppingFilters(prev => ({ ...prev, maxPrice: 199 }))} style={styles.priceCardPurple}>
                  <LinearGradient
                    colors={['#A855F7', '#4C1D95']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={StyleSheet.absoluteFill}
                  />
                  <Text style={styles.priceCardSmallLabelText}>Under</Text>
                  <Text style={styles.priceCardSmallValueText}>₹199</Text>
                </BouncyPressable>

                {/* Card 3: Under 299 */}
                <BouncyPressable onPress={() => setShoppingFilters(prev => ({ ...prev, maxPrice: 299 }))} style={styles.priceCardPurple}>
                  <LinearGradient
                    colors={['#A855F7', '#4C1D95']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={StyleSheet.absoluteFill}
                  />
                  <Text style={styles.priceCardSmallLabelText}>Under</Text>
                  <Text style={styles.priceCardSmallValueText}>₹299</Text>
                </BouncyPressable>
              </View>
            </View>

            {/* Bottom Row */}
            <View style={styles.priceStoreBottomRow}>
              {/* Left Column: Price Crash */}
              <BouncyPressable onPress={() => setSortMode('Price low')} style={styles.priceCardBottom}>
                <LinearGradient
                  colors={['#A855F7', '#4C1D95']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={StyleSheet.absoluteFill}
                />
                <Text style={styles.priceCrashTextGold}>PRICE ↓</Text>
                <Text style={styles.priceCrashTextGold}>CRASH</Text>
              </BouncyPressable>

              {/* Right Column: Last Chance Deals */}
              <BouncyPressable onPress={() => setSelectedQuickFilter('Coupon ready')} style={styles.priceCardBottom}>
                <LinearGradient
                  colors={['#A855F7', '#4C1D95']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={StyleSheet.absoluteFill}
                />
                <Text style={styles.priceDealsTextGold}>LAST 🛒</Text>
                <Text style={styles.priceDealsTextGold}>CHANCE</Text>
                <Text style={styles.priceDealsTextGold}>DEALS %</Text>
              </BouncyPressable>
            </View>
          </View>

          {/* Pocket Friendly Prices */}
          <View style={styles.pocketFriendlyContainer}>
            <View style={styles.pocketFriendlyHeader}>
              <LinearGradient
                colors={['#EF4444', '#B91C1C']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFill}
              />
              <Text style={styles.pocketFriendlyTitle}>
                POCKET FRIENDLY <Text style={{ color: '#FCD34D' }}>P₹ICES</Text>
              </Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pocketFriendlyScroll}>
              {[
                { label: 'Trousers', img: require('../assets/images/men_cat_casual.png'), query: 'jeans' },
                { label: 'Casual Shoes', img: require('../assets/images/men_cat_footwear.png'), query: 'sneakers' },
                { label: 'Sports Shoes', img: require('../assets/images/men_cat_sports.png'), query: 'sneakers' },
                { label: 'Flip Flops', img: require('../assets/images/women_cat_footwear.png'), query: 'sneakers' },
                { label: 'Track Pants', img: require('../assets/images/men_cat_essentials.png'), query: 't-shirt' },
                { label: 'Kids Wear', img: 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=150&q=80', query: 't-shirt' },
                { label: 'Sarees', img: require('../assets/images/women_cat_ethnic.png'), query: 'kurta' },
                { label: 'Face Wash', img: require('../assets/images/women_cat_beauty.png'), query: 'lipstick' },
                { label: 'Kurtas', img: require('../assets/images/men_cat_ethnic.png'), query: 'kurta' },
                { label: 'Sunscreen', img: require('../assets/images/cat_beauty.png'), query: 'lipstick' }
              ].map((item, index) => (
                <BouncyPressable key={index} onPress={() => { setQuery(item.query); setActiveShelfTitle(item.label); }} style={styles.pocketFriendlyCard}>
                  <View style={styles.pocketFriendlyImageContainer}>
                    <LinearGradient
                      colors={['#FFFBEB', '#FDE68A', '#F97316']}
                      start={{ x: 0.5, y: 0 }}
                      end={{ x: 0.5, y: 1 }}
                      style={StyleSheet.absoluteFill}
                    />
                    <Image source={getImageSource(item.img)} style={styles.pocketFriendlyImage} contentFit="cover" />
                  </View>
                  <View style={styles.pocketFriendlyPill}>
                    <Text numberOfLines={1} style={styles.pocketFriendlyPillText}>{item.label}</Text>
                  </View>
                </BouncyPressable>
              ))}
            </ScrollView>
          </View>

          {/* TOP CATEGORIES */}
          <View style={styles.topCategoriesContainer}>
            <View style={styles.topCategoriesHeader}>
              <Text style={styles.topCategoriesTitle}>TOP CATEGORIES</Text>
              <BouncyPressable onPress={() => openBrandShelf('shirt', 'Rating')} style={styles.shopNowBadge}>
                <Text style={styles.shopNowBadgeText}>Shop Now</Text>
                <MaterialCommunityIcons name="chevron-right" size={13} color="#FFFFFF" />
              </BouncyPressable>
            </View>

            <View style={styles.topCategoriesGrid}>
              {/* Jockey Trunk Card */}
              <BouncyPressable onPress={() => { setQuery('trunk'); setActiveShelfTitle('Trunks'); }} style={styles.topCategoryCard}>
                <Text style={styles.topCategoryCardTitle}>Trunk</Text>
                <View style={styles.topCategoryCardImageWrapper}>
                  <Image
                    source={require('../assets/images/trunk_category_image.png')}
                    style={styles.topCategoryCardImage}
                    contentFit="cover"
                  />
                  <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.6)']}
                    style={StyleSheet.absoluteFill}
                  />
                  <View style={styles.topCategoryCardPriceOverlay}>
                    <Text style={styles.topCategoryCardPriceText}>Under ₹449</Text>
                  </View>
                </View>
                <View style={styles.topCategoryCardBrandsRow}>
                  <Text style={styles.topCategoryCardBrandText}>JOCKEY</Text>
                  <View style={styles.verticalBrandSeparator} />
                  <Text style={styles.topCategoryCardBrandText}>XYXX</Text>
                </View>
                <View style={styles.morePillContainer}>
                  <View style={styles.morePill}>
                    <Text style={styles.morePillText}>& More</Text>
                  </View>
                </View>
              </BouncyPressable>

              {/* Anouk Kurtas Card */}
              <BouncyPressable onPress={() => { setQuery('kurta'); setActiveShelfTitle('Kurtas'); }} style={styles.topCategoryCard}>
                <Text style={styles.topCategoryCardTitle}>Kurtas</Text>
                <View style={styles.topCategoryCardImageWrapper}>
                  <Image
                    source={require('../assets/images/women_cat_ethnic.png')}
                    style={styles.topCategoryCardImage}
                    contentFit="cover"
                  />
                  <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.6)']}
                    style={StyleSheet.absoluteFill}
                  />
                  <View style={styles.topCategoryCardPriceOverlay}>
                    <Text style={styles.topCategoryCardPriceText}>Under ₹549</Text>
                  </View>
                </View>
                <View style={styles.topCategoryCardBrandsRow}>
                  <Text style={[styles.topCategoryCardBrandText, { color: '#EA580C' }]}>anouk</Text>
                  <View style={styles.verticalBrandSeparator} />
                  <Text style={styles.topCategoryCardBrandText}>kalini</Text>
                </View>
                <View style={styles.morePillContainer}>
                  <View style={styles.morePill}>
                    <Text style={styles.morePillText}>& More</Text>
                  </View>
                </View>
              </BouncyPressable>

              {/* Mars Highlighter Card */}
              <BouncyPressable onPress={() => { setQuery('lipstick'); setActiveShelfTitle('Highlighter'); }} style={styles.topCategoryCard}>
                <Text style={styles.topCategoryCardTitle}>Highlighter</Text>
                <View style={styles.topCategoryCardImageWrapper}>
                  <Image
                    source={require('../assets/images/cat_beauty.png')}
                    style={styles.topCategoryCardImage}
                    contentFit="cover"
                  />
                  <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.6)']}
                    style={StyleSheet.absoluteFill}
                  />
                  <View style={styles.topCategoryCardPriceOverlay}>
                    <Text style={styles.topCategoryCardPriceText}>Under ₹299</Text>
                  </View>
                </View>
                <View style={styles.topCategoryCardBrandsRow}>
                  <Text style={styles.topCategoryCardBrandText}>MARS</Text>
                  <View style={styles.verticalBrandSeparator} />
                  <Text style={styles.topCategoryCardBrandText}>FACES CANADA</Text>
                </View>
                <View style={styles.morePillContainer}>
                  <View style={styles.morePill}>
                    <Text style={styles.morePillText}>& More</Text>
                  </View>
                </View>
              </BouncyPressable>

              {/* Jack & Jones Caps Card */}
              <BouncyPressable onPress={() => { setQuery('cap'); setActiveShelfTitle('Caps'); }} style={styles.topCategoryCard}>
                <Text style={styles.topCategoryCardTitle}>Caps</Text>
                <View style={styles.topCategoryCardImageWrapper}>
                  <Image
                    source={{ uri: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=400&q=80' }}
                    style={styles.topCategoryCardImage}
                    contentFit="cover"
                  />
                  <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.6)']}
                    style={StyleSheet.absoluteFill}
                  />
                  <View style={styles.topCategoryCardPriceOverlay}>
                    <Text style={styles.topCategoryCardPriceText}>Under ₹449</Text>
                  </View>
                </View>
                <View style={styles.topCategoryCardBrandsRow}>
                  <Text style={styles.topCategoryCardBrandText}>JACK & JONES</Text>
                  <View style={styles.verticalBrandSeparator} />
                  <Text style={styles.topCategoryCardBrandText}>Mast & Harbour</Text>
                </View>
                <View style={styles.morePillContainer}>
                  <View style={styles.morePill}>
                    <Text style={styles.morePillText}>& More</Text>
                  </View>
                </View>
              </BouncyPressable>
            </View>
          </View>

          {/* Red-Orange Glossy Pocket Friendly Prices Container */}
          <View style={styles.redPocketFriendlyContainer}>
            <LinearGradient
              colors={['#EF4444', '#B91C1C']}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={styles.redPocketFriendlyHeader}
            >
              <Text style={styles.redPocketFriendlyTitle}>POCKET FRIENDLY PRICES</Text>
            </LinearGradient>

            <View style={styles.redPocketFriendlyGrid}>
              {[
                { label: 'Sandals', price: '₹799', img: require('../assets/images/women_cat_footwear.png'), query: 'sneakers' },
                { label: 'Kurtas', price: '₹449', img: require('../assets/images/women_cat_ethnic.png'), query: 'kurta' },
                { label: 'Headphones', price: '₹1249', img: { uri: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=260&q=80' }, query: 'electronics' },
                { label: 'Track Pants', price: '₹449', img: require('../assets/images/men_cat_essentials.png'), query: 't-shirt' },
                { label: 'Backpacks', price: '₹749', img: require('../assets/images/cat_accessories.png'), query: 'bag' },
                { label: 'Handbags', price: '₹849', img: { uri: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=260&q=80' }, query: 'bag' },
                { label: 'Shampoo', price: '₹249', img: { uri: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=260&q=80' }, query: 'beauty' },
                { label: 'Face Wash', price: '₹299', img: require('../assets/images/cat_beauty.png'), query: 'lipstick' }
              ].map((item, index) => (
                <BouncyPressable
                  key={index}
                  onPress={() => { setQuery(item.query); setActiveShelfTitle(item.label); }}
                  style={styles.redPocketFriendlyCard}
                >
                  <View style={styles.redPocketFriendlyCardContent}>
                    <Image source={getImageSource(item.img)} style={styles.redPocketFriendlyCardImage} contentFit="cover" />
                    <LinearGradient
                      colors={['transparent', 'rgba(0,0,0,0.85)']}
                      style={styles.redPocketFriendlyCardOverlay}
                    >
                      <Text style={styles.redPocketFriendlyCardUnder}>Under</Text>
                      <Text style={styles.redPocketFriendlyCardPrice}>{item.price}</Text>
                      <Text style={styles.redPocketFriendlyCardLabel}>{item.label}</Text>
                    </LinearGradient>
                  </View>
                </BouncyPressable>
              ))}
            </View>
          </View>

          {/* Featured Brands All */}
          <View style={styles.featuredBrandsAllContainer}>
            <Text style={styles.featuredBrandsAllHeading}>FEATURED BRANDS</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.featuredBrandsAllScroll}>
              
              {/* Nike Brand Card */}
              <BouncyPressable onPress={() => openBrandShelf('shoe', 'Rating')} style={styles.brandAllCard}>
                <Image
                  source={{ uri: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=400&q=80' }}
                  style={StyleSheet.absoluteFill}
                  contentFit="cover"
                />
                <LinearGradient colors={['transparent', 'rgba(0,0,0,0.85)']} style={StyleSheet.absoluteFill} />
                <View style={styles.brandAllCardContent}>
                  <Text style={styles.brandAllCardOffer}>MIN. 40% OFF</Text>
                  <Text style={styles.brandAllCardSub}>+ Extra 10% Off</Text>
                  <Text style={styles.brandAllCardDesc}>Chase Your Best</Text>
                </View>
                <View style={styles.brandAllLogoPillContainer}>
                  <View style={[styles.brandAllLogoPill, { backgroundColor: '#FFF', paddingVertical: 4 }]}>
                    <Image
                      source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.png' }}
                      style={{ width: 44, height: 20 }}
                      contentFit="contain"
                    />
                  </View>
                </View>
              </BouncyPressable>

              {/* Miraggio Brand Card */}
              <BouncyPressable onPress={() => openBrandShelf('bag', 'Rating')} style={styles.brandAllCard}>
                <Image
                  source={{ uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80' }}
                  style={StyleSheet.absoluteFill}
                  contentFit="cover"
                />
                <LinearGradient colors={['transparent', 'rgba(0,0,0,0.85)']} style={StyleSheet.absoluteFill} />
                <View style={styles.brandAllCardContent}>
                  <Text style={styles.brandAllCardOffer}>UP TO 40% OFF</Text>
                  <Text style={styles.brandAllCardSub}>Shop Your Favourite</Text>
                </View>
                <View style={styles.brandAllLogoPillContainer}>
                  <View style={styles.brandAllLogoPill}>
                    <Text style={styles.miraggioLogoText}>MIRAGGIO</Text>
                  </View>
                </View>
              </BouncyPressable>

            </ScrollView>
          </View>

          {/* SPONSORED BRANDS */}
          <View style={styles.allSponsoredBrandsContainer}>
            <Text style={styles.allSponsoredBrandsHeading}>SPONSORED BRANDS</Text>
            <View style={styles.allSponsoredBrandsGrid}>
              
              {/* Indulekha Card */}
              <BouncyPressable onPress={() => openBrandShelf('serum')} style={[styles.allSponsoredCard, { backgroundColor: '#FEF08A' }]}>
                <View style={styles.allSponsoredCardLeft}>
                  <Text style={[styles.allSponsoredOfferTitle, { color: '#78350F' }]}>Grows 11,000</Text>
                  <Text style={[styles.allSponsoredOfferTitle, { color: '#78350F' }]}>new hair</Text>
                  <Text style={[styles.allSponsoredOfferTitle, { color: '#78350F', marginBottom: 4 }]}>in 3 months</Text>
                  
                  <View style={styles.allSponsoredBlackBadge}>
                    <Text style={styles.allSponsoredBlackBadgeText}>UP TO 40% OFF</Text>
                  </View>
                  
                  <Text style={[styles.allSponsoredSubText, { color: '#854D0E' }]}>100% Ayurvedic Growth Serum</Text>
                </View>
                
                <Image
                  source={{ uri: 'https://images.unsplash.com/photo-1608248597481-496100c8c836?auto=format&fit=crop&w=260&q=80' }}
                  style={styles.allSponsoredCardRightImage}
                  contentFit="cover"
                />
                
                {/* Brand Pill */}
                <View style={styles.allSponsoredPillContainer}>
                  <View style={styles.allSponsoredPill}>
                    <Text style={styles.allSponsoredPillText}>indulekha</Text>
                  </View>
                </View>
              </BouncyPressable>

              {/* Vero Moda Card */}
              <BouncyPressable onPress={() => openBrandShelf('dress')} style={[styles.allSponsoredCard, { backgroundColor: '#F3F4F6' }]}>
                <View style={styles.allSponsoredCardLeft}>
                  <View style={styles.allSponsoredBlackBadge}>
                    <Text style={styles.allSponsoredBlackBadgeText}>MIN. 50% OFF</Text>
                  </View>
                  <Text style={[styles.allSponsoredSubText, { color: '#4B5563', marginTop: 8 }]}>The Occasion Dress Perfect Fit</Text>
                </View>
                
                <Image
                  source={{ uri: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=260&q=80' }}
                  style={styles.allSponsoredCardRightImage}
                  contentFit="cover"
                />
                
                {/* Brand Pill */}
                <View style={styles.allSponsoredPillContainer}>
                  <View style={styles.allSponsoredPill}>
                    <Text style={styles.allSponsoredPillText}>VERO MODA</Text>
                  </View>
                </View>
              </BouncyPressable>

            </View>
          </View>
        </>
      )}

      {/* Quick filters and sort controls */}
      <View style={styles.filterPanel}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
          {quickFilters.map((filter) => (
            <Pressable
              key={filter}
              onPress={() => {
                setSelectedQuickFilter(filter);
                if (filter === 'Top rated') setSortMode('Rating');
                if (filter === 'Premium edit') setSortMode('Price high');
                if (filter === 'Coupon ready') setSortMode('Price low');
              }}
              style={[
                styles.filterChip,
                selectedQuickFilter === filter ? styles.filterChipActive : null,
              ]}>
              <Text
                style={[
                  styles.filterChipText,
                  selectedQuickFilter === filter ? styles.filterChipTextActive : null,
                ]}>
                {filter}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.sortRow}>
          {sortModes.map((mode) => (
            <Pressable
              key={mode}
              onPress={() => setSortMode(mode)}
              style={[styles.sortChip, sortMode === mode ? styles.sortChipActive : null]}>
              <Text style={[styles.sortChipText, sortMode === mode ? styles.sortChipTextActive : null]}>
                {mode}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {/* Recommended product grid header */}
      <View style={styles.sectionHeader}>
        <View>
          <Text style={styles.sectionTitle}>Recommended for you</Text>
          <Text style={styles.sectionSubtitle}>{visibleProducts.length} products available</Text>
        </View>
        <Pressable
          onPress={() => {
            setSelectedQuickFilter('Top rated');
            setSortMode('Rating');
          }}>
          <MaterialCommunityIcons color={colors.textMuted} name="tune-variant" size={22} />
        </Pressable>
      </View>

      {/* Recommended product grid */}
      <View style={styles.grid}>
        {visibleProducts.map((product) => {
          const saved = wishlist.some((item) => item.id === product.id);
          return (
            <BouncyPressable key={product.id} onPress={() => openProduct(product)} style={styles.productTile}>
              <View style={styles.tileImageWrap}>
                <Image contentFit="cover" source={{ uri: product.image }} style={styles.tileImage} />
                <Pressable
                  onPress={(event) => {
                    event.stopPropagation();
                    toggleWishlist(product);
                  }}
                  style={styles.heartButton}>
                  <MaterialCommunityIcons
                    color={saved ? '#E11D48' : colors.textMuted}
                    name={saved ? 'heart' : 'heart-outline'}
                    size={18}
                  />
                </Pressable>
                <View style={styles.ratingBadge}>
                  <Text style={styles.ratingText}>{product.rating.toFixed(1)}</Text>
                  <MaterialCommunityIcons color="#16A34A" name="star" size={11} />
                </View>
              </View>
              <View style={styles.tileBody}>
                <Text numberOfLines={1} style={styles.productBrand}>
                  {product.brand}
                </Text>
                <Text numberOfLines={1} style={styles.productName}>
                  {product.name}
                </Text>
                <View style={styles.priceRow}>
                  <Text style={styles.productPrice}>{buildProductPriceLabel(product)}</Text>
                  <Text style={styles.originalPrice}>Rs {product.originalPrice.toLocaleString('en-IN')}</Text>
                </View>
                <Text style={styles.discountText}>{discountFor(product)}% OFF</Text>
              </View>
            </BouncyPressable>
          );
        })}
      </View>

      {/* Sticky checkout call-to-action */}
      {shoppingCart.length > 0 ? (
        <BouncyPressable onPress={() => router.push('/shopping-checkout')} style={styles.checkoutBar}>
          <View>
            <Text style={styles.checkoutTitle}>{shoppingCart.length} item cart</Text>
            <Text style={styles.checkoutSubtitle}>Ready for secure checkout</Text>
          </View>
          <View style={styles.checkoutCta}>
            <Text style={styles.checkoutCtaText}>Checkout</Text>
            <MaterialCommunityIcons color={colors.text} name="arrow-right" size={17} />
          </View>
        </BouncyPressable>
      ) : null}
      </ScrollView>

      {/* Fashion bottom navigation */}
      <View style={styles.bottomFashionNav}>
        <Pressable onPress={resetShoppingHome} style={styles.bottomNavItem}>
          <Text style={styles.bottomNavLogo}>M</Text>
          <Text style={[styles.bottomNavText, styles.bottomNavTextActive]}>Home</Text>
        </Pressable>
        <Pressable onPress={() => openExplore(exploreMoreItems[0])} style={styles.bottomNavItem}>
          <Text style={styles.bottomNavStrong}>fwd</Text>
          <Text style={styles.bottomNavText}>Under Rs999</Text>
        </Pressable>
        <Pressable onPress={() => openExplore(exploreMoreItems[1])} style={styles.bottomNavItem}>
          <Text style={styles.bottomNavStrong}>LUXE</Text>
          <Text style={styles.bottomNavText}>Luxury</Text>
        </Pressable>
        <Pressable onPress={openBag} style={styles.bottomNavItem}>
          <MaterialCommunityIcons color={colors.text} name="shopping-outline" size={24} />
          <Text style={styles.bottomNavText}>Bag</Text>
        </Pressable>
      </View>

      {/* Delivery address picker modal */}
      <Modal
        animationType="slide"
        onRequestClose={() => setAddressModalVisible(false)}
        transparent
        visible={addressModalVisible}>
        <View style={styles.modalBackdrop}>
          <View style={styles.addressSheet}>
            <View style={styles.addressSheetHeader}>
              <View>
                <Text style={styles.addressSheetTitle}>Choose delivery address</Text>
                <Text style={styles.addressSheetSubtitle}>This address will be used at checkout.</Text>
              </View>
              <Pressable onPress={() => setAddressModalVisible(false)} style={styles.sheetCloseButton}>
                <MaterialCommunityIcons color={colors.text} name="close" size={20} />
              </Pressable>
            </View>

            <ScrollView contentContainerStyle={styles.addressList} showsVerticalScrollIndicator={false}>
              {addressOptions.map((address) => {
                const active = address.id === selectedAddressId;
                return (
                  <Pressable
                    key={address.id}
                    onPress={() => {
                      setSelectedAddress(address.id);
                      setAddressModalVisible(false);
                    }}
                    style={[styles.addressOption, active ? styles.addressOptionActive : null]}>
                    <View style={styles.addressIconWrap}>
                      <MaterialCommunityIcons
                        color={active ? colors.white : '#BE185D'}
                        name={address.label.toLowerCase().includes('work') ? 'office-building' : 'home-map-marker'}
                        size={20}
                      />
                    </View>
                    <View style={styles.addressOptionCopy}>
                      <Text style={styles.addressOptionTitle}>{address.label}</Text>
                      <Text style={styles.addressOptionMeta}>
                        {address.line1}, {address.line2}
                      </Text>
                      {address.etaHint ? <Text style={styles.addressEta}>{address.etaHint}</Text> : null}
                    </View>
                    {active ? (
                      <MaterialCommunityIcons color="#BE185D" name="check-circle" size={22} />
                    ) : null}
                  </Pressable>
                );
              })}

              {addingAddress ? (
                <View style={styles.addAddressBox}>
                  <Text style={styles.addAddressTitle}>Add new address</Text>
                  <TextInput
                    onChangeText={setNewAddressLabel}
                    placeholder="Label, e.g. Home, Hostel, Office"
                    placeholderTextColor={colors.textLight}
                    style={styles.addressInput}
                    value={newAddressLabel}
                  />
                  <TextInput
                    onChangeText={setNewAddressLine1}
                    placeholder="House / flat / building"
                    placeholderTextColor={colors.textLight}
                    style={styles.addressInput}
                    value={newAddressLine1}
                  />
                  <TextInput
                    onChangeText={setNewAddressLine2}
                    placeholder="Area, city, pincode"
                    placeholderTextColor={colors.textLight}
                    style={styles.addressInput}
                    value={newAddressLine2}
                  />
                  <View style={styles.addAddressActions}>
                    <Pressable onPress={() => setAddingAddress(false)} style={styles.cancelAddressButton}>
                      <Text style={styles.cancelAddressText}>Cancel</Text>
                    </Pressable>
                    <Pressable onPress={saveNewAddress} style={styles.saveAddressButton}>
                      <Text style={styles.saveAddressText}>Save address</Text>
                    </Pressable>
                  </View>
                </View>
              ) : (
                <Pressable onPress={() => setAddingAddress(true)} style={styles.addAddressButton}>
                  <MaterialCommunityIcons color="#BE185D" name="plus-circle-outline" size={22} />
                  <Text style={styles.addAddressButtonText}>Add new address</Text>
                </Pressable>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  // ============================================================
  // Screen background and main spacing
  // ============================================================
  homeShell: {
    flex: 1,
    paddingHorizontal: 0,
    paddingBottom: 0,
    gap: 0,
  },
  homeRoot: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: '#F114A2',
  },
  screen: {
    paddingHorizontal: spacing.sm,
    gap: spacing.sm,
    paddingBottom: 132,
  },
  homeBackdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  homeBackdropMist: {
    position: 'absolute',
    left: -20,
    right: -20,
    top: 0,
    height: 360,
  },
  homeBackdropWarmGlow: {
    position: 'absolute',
    left: -70,
    right: -20,
    top: -34,
    height: 190,
    backgroundColor: 'rgba(255, 215, 142, 0.64)',
    borderBottomLeftRadius: 160,
    borderBottomRightRadius: 200,
  },
  homeBackdropCoolGlow: {
    position: 'absolute',
    left: -26,
    right: -26,
    top: 232,
    height: 270,
    backgroundColor: 'rgba(169, 236, 255, 0.88)',
    borderTopLeftRadius: 56,
    borderTopRightRadius: 56,
    borderBottomLeftRadius: 84,
    borderBottomRightRadius: 84,
  },
  homeBackdropPeachBand: {
    position: 'absolute',
    left: -30,
    right: -30,
    top: 0,
    height: 168,
    backgroundColor: 'rgba(248, 182, 148, 0.42)',
    transform: [{ rotate: '4deg' }],
  },
  homeBackdropBlueBand: {
    position: 'absolute',
    left: -80,
    right: -80,
    top: 300,
    height: 190,
    backgroundColor: 'rgba(181, 244, 255, 0.68)',
    transform: [{ rotate: '-3deg' }],
  },
  homeBackdropMagentaBand: {
    position: 'absolute',
    left: -40,
    right: -40,
    top: 650,
    height: 520,
    backgroundColor: 'rgba(229, 18, 163, 0.82)',
  },
  homeBackdropBeamLeft: {
    position: 'absolute',
    left: 44,
    top: 56,
    width: 20,
    height: 360,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.34)',
    transform: [{ rotate: '16deg' }],
  },
  homeBackdropBeamCenter: {
    position: 'absolute',
    left: '48%',
    top: 16,
    width: 18,
    height: 420,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.24)',
    transform: [{ rotate: '-7deg' }],
  },
  homeBackdropBeamRight: {
    position: 'absolute',
    right: 58,
    top: 42,
    width: 18,
    height: 350,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.36)',
    transform: [{ rotate: '-14deg' }],
  },
  homeBackdropSpotlightLeft: {
    position: 'absolute',
    left: -36,
    top: -4,
    width: 156,
    height: 136,
    borderRadius: 76,
    backgroundColor: 'rgba(255,255,255,0.26)',
  },
  homeBackdropSpotlightRight: {
    position: 'absolute',
    right: -36,
    top: 0,
    width: 160,
    height: 144,
    borderRadius: 80,
    backgroundColor: 'rgba(255,255,255,0.28)',
  },
  homeFloodLeft: {
    position: 'absolute',
    left: 6,
    top: 18,
    width: 82,
    height: 82,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    transform: [{ rotate: '-18deg' }],
  },
  homeFloodRight: {
    position: 'absolute',
    right: 12,
    top: 18,
    width: 82,
    height: 82,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    transform: [{ rotate: '16deg' }],
  },
  homeFloodDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: 'rgba(255,255,255,0.82)',
  },

  // ============================================================
  // Delivery row styles
  // ============================================================
  deliveryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xxs,
    paddingTop: spacing.sm,
    paddingHorizontal: spacing.xs,
  },
  backButton: {
    width: 0,
    height: 30,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 0,
    overflow: 'hidden',
  },
  deliveryText: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: '900',
    maxWidth: 240,
  },

  // ============================================================
  // Search bar and header action styles
  // ============================================================
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.xs,
  },
  topCopy: {
    flex: 1,
  },
  brandMark: {
    color: colors.text,
    fontSize: typography.section,
    fontWeight: '900',
  },
  locationText: {
    color: colors.textMuted,
    fontSize: typography.caption,
    fontWeight: '600',
  },
  iconButton: {
    width: 38,
    height: 48,
    borderRadius: radius.pill,
    borderWidth: 0,
    borderColor: 'transparent',
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  dotBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E11D48',
  },
  countBadge: {
    position: 'absolute',
    top: 4,
    right: 2,
    minWidth: 17,
    height: 17,
    borderRadius: 9,
    backgroundColor: '#E11D48',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  countBadgeText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: '900',
  },
  searchWrap: {
    flex: 1,
    height: 58,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(17, 24, 39, 0.36)',
    backgroundColor: colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
  },
  searchLogo: {
    color: '#DB2777',
    fontSize: 26,
    fontWeight: '900',
  },
  searchInput: {
    flex: 1,
    color: colors.text,
    fontSize: typography.body,
    fontWeight: '700',
  },
  searchIconButton: {
    width: 28,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ============================================================
  // Audience tab styles
  // ============================================================
  audienceRow: {
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: '#6D28D9',
    marginHorizontal: -spacing.sm,
    paddingHorizontal: spacing.sm,
  },
  audienceTab: {
    flex: 1,
    minHeight: 54,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderBottomWidth: 0,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  audienceTabActive: {
    borderColor: '#7C3AED',
    borderBottomColor: 'transparent',
  },
  audienceText: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: '700',
  },
  audienceTextActive: {
    color: '#EC4899',
    fontWeight: '900',
  },
  gridMenuButton: {
    width: 44,
    height: 44,
    borderRadius: radius.sm,
    backgroundColor: '#111827',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.xs,
  },

  // ============================================================
  // Legacy category pill styles
  // ============================================================
  modeRow: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  modePill: {
    flex: 1,
    minHeight: 38,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xs,
  },
  modePillActive: {
    backgroundColor: colors.text,
    borderColor: colors.text,
  },
  modeText: {
    color: colors.textMuted,
    fontSize: typography.tiny,
    fontWeight: '800',
  },
  modeTextActive: {
    color: colors.white,
  },

  // ============================================================
  // Main hero banner styles
  // ============================================================
  hero: {
    height: 260,
    borderRadius: radius.md,
    overflow: 'hidden',
    justifyContent: 'flex-end',
    backgroundColor: '#FCE7F3',
    borderWidth: 2,
    borderColor: '#F97316',
  },
  heroScrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.34)',
  },
  heroContent: {
    padding: spacing.lg,
    gap: spacing.xs,
  },
  heroKicker: {
    color: '#FDE68A',
    fontSize: typography.tiny,
    fontWeight: '900',
    letterSpacing: 0,
  },
  heroTitle: {
    color: colors.white,
    fontSize: 30,
    lineHeight: 35,
    fontWeight: '900',
    letterSpacing: 0,
    maxWidth: 260,
  },
  heroBody: {
    color: 'rgba(255,255,255,0.86)',
    fontSize: typography.caption,
    lineHeight: 19,
    fontWeight: '600',
    maxWidth: 270,
  },
  heroCta: {
    marginTop: spacing.xs,
    alignSelf: 'flex-start',
    minHeight: 36,
    borderRadius: radius.pill,
    backgroundColor: colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xxs,
    paddingHorizontal: spacing.md,
  },
  heroCtaText: {
    color: colors.text,
    fontSize: typography.caption,
    fontWeight: '900',
  },

  // ============================================================
  // Main category rail styles
  // ============================================================
  departmentRow: {
    gap: spacing.lg,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xs,
    paddingBottom: spacing.sm,
  },
  departmentItem: {
    width: 94,
    alignItems: 'center',
    gap: spacing.xs,
  },
  departmentImage: {
    width: 86,
    height: 76,
    borderRadius: 18,
    borderWidth: 0,
    backgroundColor: 'transparent',
  },
  departmentLabel: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: '900',
    textAlign: 'center',
  },

  // ============================================================
  // Small product category rail styles
  // ============================================================
  miniCategoryRow: {
    gap: spacing.sm,
    paddingRight: spacing.md,
  },
  miniCategoryItem: {
    width: 82,
    alignItems: 'center',
    gap: spacing.xs,
  },
  miniCategoryImage: {
    width: 78,
    height: 78,
    borderRadius: 18,
    backgroundColor: '#FDF2F8',
  },
  miniCategoryLabel: {
    color: colors.text,
    fontSize: typography.tiny,
    fontWeight: '800',
    textAlign: 'center',
  },

  // ============================================================
  // Coupon and countdown styles
  // ============================================================
  couponBand: {
    minHeight: 86,
    borderRadius: 10,
    backgroundColor: '#FFF7FB',
    borderWidth: 1,
    borderColor: '#E879F9',
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  couponText: {
    color: '#9D174D',
    fontSize: 34,
    fontWeight: '900',
  },
  couponCode: {
    borderRadius: radius.xs,
    backgroundColor: '#FFF7FB',
    borderWidth: 1,
    borderColor: '#E879F9',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    alignItems: 'center',
  },
  couponCodeEyebrow: {
    color: colors.textMuted,
    fontSize: 8,
    fontWeight: '900',
  },
  couponCodeText: {
    color: '#BE185D',
    fontSize: typography.section,
    fontWeight: '900',
  },
  countdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  countdownLabel: {
    color: colors.textMuted,
    fontSize: typography.caption,
    fontWeight: '800',
  },
  countdownTime: {
    color: '#DC2626',
    fontSize: typography.caption,
    fontWeight: '900',
  },
  dealHeroRow: {
    gap: spacing.sm,
    paddingRight: spacing.md,
    marginHorizontal: -spacing.sm,
    paddingLeft: spacing.sm,
  },
  dealHeroCard: {
    width: 172,
    height: 342,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: '#EC4899',
    overflow: 'hidden',
    backgroundColor: colors.surfaceAccent,
  },
  dealHeroCardLarge: {
    width: 330,
    height: 342,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: '#F97316',
    overflow: 'hidden',
    backgroundColor: colors.surfaceAccent,
  },
  saleTag: {
    position: 'absolute',
    right: spacing.sm,
    bottom: 82,
    borderRadius: 6,
    backgroundColor: 'rgba(255,255,255,0.8)',
    paddingHorizontal: 5,
    paddingVertical: 3,
  },
  saleTagText: {
    color: colors.textMuted,
    fontSize: 10,
    fontWeight: '900',
  },
  dealHeroFooter: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    minHeight: 82,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
  },
  blackCta: {
    borderRadius: radius.pill,
    backgroundColor: colors.black,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xxs,
    paddingHorizontal: spacing.sm,
    paddingVertical: 7,
  },
  blackCtaText: {
    color: colors.white,
    fontSize: typography.tiny,
    fontWeight: '900',
  },
  reasonBadge: {
    position: 'absolute',
    top: spacing.md,
    left: spacing.lg,
    width: 86,
    minHeight: 58,
    borderRadius: radius.sm,
    borderWidth: 2,
    borderColor: '#EC4899',
    backgroundColor: 'rgba(255,255,255,0.86)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
  },
  reasonBadgeText: {
    color: '#BE185D',
    fontSize: 10,
    fontWeight: '900',
    textAlign: 'center',
  },
  dealHeroCopy: {
    position: 'absolute',
    left: spacing.lg,
    right: spacing.lg,
    bottom: 78,
  },
  dealHeroTitle: {
    color: colors.white,
    fontSize: typography.section,
    fontWeight: '800',
  },
  dealHeroPrice: {
    color: colors.white,
    fontSize: 34,
    fontWeight: '900',
  },
  dealBrandFooter: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    minHeight: 68,
    backgroundColor: colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: spacing.sm,
  },
  dealBrandText: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: '900',
  },
  dealBrandMore: {
    color: colors.textMuted,
    fontSize: typography.tiny,
    fontWeight: '900',
  },
  carouselDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.xs,
    marginTop: -spacing.xs,
  },
  carouselDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(124,58,237,0.22)',
  },
  carouselDotActive: {
    backgroundColor: '#7C3AED',
  },

  // ============================================================
  // Optional offer band styles
  // ============================================================
  offerBand: {
    borderRadius: radius.md,
    backgroundColor: '#FFEDD5',
    borderWidth: 1,
    borderColor: '#FED7AA',
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  offerTitle: {
    color: '#7C2D12',
    fontSize: typography.body,
    fontWeight: '900',
  },
  offerBody: {
    color: '#9A3412',
    fontSize: typography.caption,
    fontWeight: '700',
    marginTop: 2,
  },

  // ============================================================
  // Powered-by brand strip styles
  // ============================================================
  brandStrip: {
    minHeight: 58,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#C4B5FD',
    backgroundColor: colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    gap: spacing.sm,
    paddingHorizontal: spacing.sm,
  },
  brandStripLabel: {
    color: '#BE185D',
    fontSize: typography.body,
    fontWeight: '900',
  },
  brandStripName: {
    color: colors.text,
    fontSize: typography.caption,
    fontWeight: '900',
  },
  cashbackStrip: {
    minHeight: 56,
    borderRadius: 0,
    backgroundColor: '#FFF1F2',
    borderWidth: 1,
    borderColor: '#FDA4AF',
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.sm,
  },
  cashbackIcon: {
    width: 92,
    height: 34,
    borderRadius: 4,
    backgroundColor: '#0F5EA8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cashbackText: {
    flex: 1,
    color: colors.text,
    fontSize: typography.caption,
    fontWeight: '800',
  },
  cashbackCta: {
    borderRadius: radius.pill,
    backgroundColor: colors.black,
    width: 52,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.sm,
  },
  cashbackCtaText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: '900',
    textTransform: 'uppercase',
  },

  // ============================================================
  // Continue wishlisting styles
  // ============================================================
  wishlistPanel: {
    borderRadius: radius.lg,
    backgroundColor: '#FFEDD5',
    padding: spacing.md,
    gap: spacing.sm,
    overflow: 'hidden',
  },
  wishlistTitle: {
    color: '#BE123C',
    fontSize: typography.section,
    fontWeight: '900',
    textAlign: 'center',
  },
  wishlistCard: {
    width: 210,
    borderRadius: radius.md,
    backgroundColor: colors.white,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#FDA4AF',
  },
  wishlistImage: {
    width: '100%',
    height: 210,
    backgroundColor: colors.surfaceAccent,
  },
  wishlistCopy: {
    padding: spacing.md,
    gap: 3,
  },
  wishlistBrand: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: '900',
  },
  wishlistName: {
    color: colors.textMuted,
    fontSize: typography.caption,
    fontWeight: '700',
  },
  playButton: {
    position: 'absolute',
    right: spacing.md,
    bottom: spacing.md,
    width: 46,
    height: 46,
    borderRadius: radius.pill,
    backgroundColor: colors.black,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: colors.white,
  },

  // ============================================================
  // Shared section heading styles
  // ============================================================
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: typography.section,
    fontWeight: '900',
  },
  sectionSubtitle: {
    color: colors.textMuted,
    fontSize: typography.caption,
    fontWeight: '600',
    marginTop: 2,
  },
  textAction: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
  },
  textActionLabel: {
    color: '#BE185D',
    fontSize: typography.caption,
    fontWeight: '900',
  },

  // ============================================================
  // Featured product card styles
  // ============================================================
  featuredRow: {
    gap: spacing.md,
    paddingRight: spacing.md,
  },
  featuredCard: {
    width: 168,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: '#FBCFE8',
    backgroundColor: colors.surface,
    overflow: 'hidden',
  },
  featuredImage: {
    width: '100%',
    height: 172,
    backgroundColor: colors.surfaceAccent,
  },
  featuredBody: {
    padding: spacing.sm,
    gap: 3,
  },

  // ============================================================
  // Top brand carousel styles
  // ============================================================
  brandCardRow: {
    gap: spacing.md,
    paddingRight: spacing.md,
  },
  brandCard: {
    width: 250,
    height: 300,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: '#FDBA74',
    backgroundColor: colors.surface,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  brandCardImage: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.surfaceAccent,
  },
  brandCardScrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.22)',
  },
  brandCardOffer: {
    color: colors.white,
    fontSize: typography.section,
    fontWeight: '900',
    textAlign: 'center',
  },
  brandCardTitle: {
    color: colors.white,
    fontSize: typography.caption,
    fontWeight: '800',
    textAlign: 'center',
    marginTop: 3,
  },
  brandCardLogo: {
    backgroundColor: colors.white,
    color: colors.text,
    fontSize: typography.title,
    fontWeight: '900',
    textAlign: 'center',
    paddingVertical: spacing.md,
    marginTop: spacing.md,
  },

  // ============================================================
  // Budget-friendly finds styles
  // ============================================================
  budgetPanel: {
    borderRadius: radius.lg,
    backgroundColor: '#FDBA74',
    paddingVertical: spacing.md,
    gap: spacing.sm,
    overflow: 'hidden',
  },
  budgetTitle: {
    color: '#9F1239',
    fontSize: typography.section,
    fontWeight: '900',
    textAlign: 'center',
  },
  budgetRow: {
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  budgetCard: {
    width: 128,
    height: 174,
    borderRadius: radius.sm,
    overflow: 'hidden',
    backgroundColor: colors.surface,
  },
  budgetImage: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.surfaceAccent,
  },
  budgetOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: spacing.sm,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  budgetUnder: {
    color: colors.white,
    fontSize: typography.tiny,
    fontWeight: '800',
  },
  budgetPrice: {
    color: colors.white,
    fontSize: typography.section,
    fontWeight: '900',
  },
  budgetName: {
    color: colors.white,
    fontSize: typography.caption,
    fontWeight: '800',
  },

  // ============================================================
  // Hottest category grid styles
  // ============================================================
  hotGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  hotCategoryCard: {
    width: '47.7%',
    height: 150,
    borderRadius: radius.md,
    overflow: 'hidden',
    justifyContent: 'flex-end',
    backgroundColor: '#E0F2FE',
  },
  hotCategoryImage: {
    ...StyleSheet.absoluteFillObject,
  },
  hotCategoryScrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.26)',
  },
  hotCategoryTitle: {
    color: colors.white,
    fontSize: typography.body,
    fontWeight: '900',
    paddingHorizontal: spacing.sm,
  },
  hotCategorySubtitle: {
    color: 'rgba(255,255,255,0.86)',
    fontSize: typography.tiny,
    fontWeight: '800',
    paddingHorizontal: spacing.sm,
    paddingBottom: spacing.sm,
    marginTop: 2,
  },

  // ============================================================
  // Explore more card styles
  // ============================================================
  exploreGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  exploreCard: {
    width: '47.7%',
    minHeight: 78,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.sm,
  },
  exploreIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  exploreCopy: {
    flex: 1,
    minWidth: 0,
  },
  exploreTitle: {
    color: colors.text,
    fontSize: typography.caption,
    fontWeight: '900',
  },
  exploreSubtitle: {
    color: colors.textMuted,
    fontSize: typography.tiny,
    fontWeight: '700',
    marginTop: 2,
  },

  // ============================================================
  // Quick filter and sort control styles
  // ============================================================
  filterPanel: {
    gap: spacing.sm,
  },
  filterRow: {
    gap: spacing.xs,
    paddingRight: spacing.md,
  },
  filterChip: {
    minHeight: 34,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
    backgroundColor: colors.surface,
  },
  filterChipActive: {
    borderColor: '#FB7185',
    backgroundColor: '#FFE4E6',
  },
  filterChipText: {
    color: colors.textMuted,
    fontSize: typography.tiny,
    fontWeight: '800',
  },
  filterChipTextActive: {
    color: '#BE185D',
  },
  sortRow: {
    gap: spacing.xs,
    paddingRight: spacing.md,
  },
  sortChip: {
    minHeight: 32,
    borderRadius: radius.xs,
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.sm,
  },
  sortChipActive: {
    borderColor: '#7C3AED',
    backgroundColor: '#7C3AED',
  },
  sortChipText: {
    color: colors.textMuted,
    fontSize: typography.tiny,
    fontWeight: '800',
  },
  sortChipTextActive: {
    color: colors.white,
  },

  // ============================================================
  // Product grid and product tile styles
  // ============================================================
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  productTile: {
    width: '47.7%',
    borderRadius: radius.sm,
    backgroundColor: colors.surface,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#FBCFE8',
  },
  tileImageWrap: {
    position: 'relative',
    aspectRatio: 0.78,
    backgroundColor: colors.surfaceAccent,
  },
  tileImage: {
    width: '100%',
    height: '100%',
  },
  heartButton: {
    position: 'absolute',
    top: spacing.xs,
    right: spacing.xs,
    width: 32,
    height: 32,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,255,255,0.94)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ratingBadge: {
    position: 'absolute',
    left: spacing.xs,
    bottom: spacing.xs,
    minHeight: 24,
    borderRadius: radius.xs,
    backgroundColor: 'rgba(255,255,255,0.92)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingHorizontal: spacing.xs,
  },
  ratingText: {
    color: colors.text,
    fontSize: typography.tiny,
    fontWeight: '900',
  },
  tileBody: {
    padding: spacing.sm,
    gap: 3,
  },
  productBrand: {
    color: colors.text,
    fontSize: typography.caption,
    fontWeight: '900',
  },
  productName: {
    color: colors.textMuted,
    fontSize: typography.tiny,
    fontWeight: '700',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 5,
  },
  productPrice: {
    color: colors.text,
    fontSize: typography.caption,
    fontWeight: '900',
  },
  originalPrice: {
    color: colors.textLight,
    fontSize: typography.tiny,
    fontWeight: '700',
    textDecorationLine: 'line-through',
  },
  discountText: {
    color: '#BE185D',
    fontSize: typography.tiny,
    fontWeight: '900',
  },

  // ============================================================
  // Category shelf styles
  // ============================================================
  shelfScreen: {
    paddingHorizontal: 0,
    gap: spacing.md,
    backgroundColor: colors.white,
    paddingBottom: 92,
  },
  shelfHeader: {
    minHeight: 66,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    backgroundColor: colors.white,
  },
  shelfHeaderIcon: {
    width: 38,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shelfLogo: {
    color: '#DB2777',
    fontSize: 34,
    fontWeight: '900',
    lineHeight: 38,
  },
  shelfTitle: {
    flexShrink: 1,
    color: colors.text,
    fontSize: typography.section,
    fontWeight: '900',
    marginLeft: spacing.xs,
  },
  shelfHeaderSpacer: {
    flex: 1,
  },
  shelfLocationRow: {
    minHeight: 54,
    backgroundColor: '#F1EDFF',
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
  },
  shelfLocationText: {
    flex: 1,
    color: colors.text,
    fontSize: typography.body,
    fontWeight: '900',
  },
  shelfDealRow: {
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: 2,
  },
  shelfDealChip: {
    minHeight: 54,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: '#D4D4D8',
    backgroundColor: colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
  },
  shelfDealText: {
    color: colors.text,
    fontSize: typography.caption,
    fontWeight: '900',
  },
  shelfCategoryRow: {
    gap: spacing.lg,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.lg,
  },
  shelfCategoryItem: {
    width: 86,
    alignItems: 'center',
    gap: spacing.xs,
  },
  shelfCategoryImage: {
    width: 76,
    height: 76,
    borderRadius: radius.pill,
    backgroundColor: '#F4F4F5',
  },
  shelfCategoryText: {
    color: colors.text,
    fontSize: typography.caption,
    fontWeight: '700',
    textAlign: 'center',
  },
  shelfCouponBand: {
    minHeight: 88,
    borderRadius: 14,
    marginHorizontal: spacing.md,
    backgroundColor: '#E8DFFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    gap: spacing.md,
  },
  shelfCouponPart: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  shelfCouponIcon: {
    width: 42,
    height: 42,
    borderRadius: radius.xs,
    backgroundColor: '#34C38F',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shelfCouponIconPurple: {
    backgroundColor: '#8B5CF6',
  },
  shelfCouponText: {
    flexShrink: 1,
    color: colors.text,
    fontSize: typography.body,
    lineHeight: 21,
    fontWeight: '900',
  },
  shelfCouponCode: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#6B7280',
    color: colors.text,
    fontSize: typography.caption,
    fontWeight: '900',
    marginTop: 4,
    paddingHorizontal: spacing.xs,
    paddingVertical: 3,
  },
  shelfCouponDivider: {
    width: 1,
    height: 48,
    backgroundColor: '#C7C2D6',
  },
  shelfHeroBanner: {
    minHeight: 214,
    marginHorizontal: spacing.xs,
    backgroundColor: colors.white,
    flexDirection: 'row',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F4F4F5',
  },
  shelfHeroImage: {
    width: '54%',
    height: '100%',
    backgroundColor: colors.surfaceAccent,
  },
  shelfHeroCopy: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
  },
  shelfHeroBrand: {
    color: colors.text,
    fontSize: 26,
    fontWeight: '900',
  },
  shelfHeroSmall: {
    color: colors.text,
    fontSize: typography.tiny,
    fontWeight: '700',
    marginTop: 4,
  },
  shelfHeroOffer: {
    color: colors.text,
    fontSize: typography.caption,
    fontWeight: '900',
    marginTop: spacing.xs,
  },
  shelfHeroArrow: {
    position: 'absolute',
    right: spacing.sm,
    bottom: spacing.sm,
    width: 38,
    height: 38,
    borderRadius: radius.pill,
    backgroundColor: colors.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shelfDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.xs,
    marginTop: -spacing.xs,
  },
  shelfDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#D4D4D8',
  },
  shelfDotActive: {
    backgroundColor: '#4B5563',
  },
  shelfGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  shelfProductCard: {
    width: '48.3%',
    backgroundColor: colors.white,
  },
  shelfProductImageWrap: {
    height: 240,
    borderRadius: radius.xs,
    overflow: 'hidden',
    backgroundColor: colors.surfaceAccent,
  },
  shelfProductImage: {
    width: '100%',
    height: '100%',
  },
  shelfProductBadge: {
    position: 'absolute',
    top: spacing.xs,
    left: spacing.xs,
    backgroundColor: '#5B21B6',
    paddingHorizontal: spacing.xs,
    paddingVertical: 4,
  },
  shelfProductBadgeText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: '900',
  },
  shelfWishlistButton: {
    position: 'absolute',
    right: spacing.xs,
    bottom: spacing.xs,
    width: 36,
    height: 36,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(0,0,0,0.52)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shelfProductBody: {
    paddingVertical: spacing.xs,
    gap: 3,
  },
  shelfBottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    minHeight: 74,
    borderTopWidth: 1,
    borderTopColor: colors.line,
    backgroundColor: colors.white,
    flexDirection: 'row',
    alignItems: 'center',
  },
  shelfBottomItem: {
    flex: 1,
    minHeight: 74,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  shelfBottomText: {
    color: '#4B5563',
    fontSize: typography.section,
    fontWeight: '900',
  },
  shelfBottomDivider: {
    width: 1,
    height: 44,
    backgroundColor: colors.line,
  },
  shelfFilterDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E11D48',
    marginLeft: -3,
    marginTop: -20,
  },
  shelfEmptyState: {
    marginHorizontal: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceSoft,
    padding: spacing.lg,
    alignItems: 'center',
  },
  shelfEmptyTitle: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: '900',
  },
  shelfEmptyBody: {
    color: colors.textMuted,
    fontSize: typography.caption,
    fontWeight: '700',
    marginTop: 4,
  },
  filterSheet: {
    maxHeight: '86%',
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    backgroundColor: colors.white,
    padding: spacing.lg,
    gap: spacing.md,
  },
  filterSheetLabel: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: '900',
  },
  filterOptionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  filterOption: {
    minHeight: 42,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.lineStrong,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
    backgroundColor: colors.white,
  },
  filterOptionActive: {
    borderColor: '#BE185D',
    backgroundColor: '#FFE4E6',
  },
  filterOptionText: {
    color: colors.textMuted,
    fontSize: typography.caption,
    fontWeight: '800',
  },
  filterOptionTextActive: {
    color: '#BE185D',
  },
  filterSheetActions: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingTop: spacing.sm,
  },
  filterClearButton: {
    flex: 1,
    minHeight: 50,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.lineStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterClearText: {
    color: colors.text,
    fontSize: typography.caption,
    fontWeight: '900',
  },
  filterApplyButton: {
    flex: 1,
    minHeight: 50,
    borderRadius: radius.pill,
    backgroundColor: '#BE185D',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterApplyText: {
    color: colors.white,
    fontSize: typography.caption,
    fontWeight: '900',
  },

  // ============================================================
  // Checkout call-to-action styles
  // ============================================================
  checkoutBar: {
    borderRadius: radius.md,
    backgroundColor: '#BE185D',
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  checkoutTitle: {
    color: colors.white,
    fontSize: typography.body,
    fontWeight: '900',
  },
  checkoutSubtitle: {
    color: 'rgba(255,255,255,0.72)',
    fontSize: typography.tiny,
    fontWeight: '700',
    marginTop: 2,
  },
  checkoutCta: {
    minHeight: 36,
    borderRadius: radius.pill,
    backgroundColor: colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xxs,
    paddingHorizontal: spacing.md,
  },
  checkoutCtaText: {
    color: colors.text,
    fontSize: typography.caption,
    fontWeight: '900',
  },

  // ============================================================
  // Fashion bottom navigation styles
  // ============================================================
  bottomFashionNav: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    minHeight: 65,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingTop: 6,
    paddingBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: -3 },
    elevation: 10,
  },
  bottomNavItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  bottomNavLogo: {
    color: '#E11D48',
    fontSize: 22,
    fontWeight: '900',
    lineHeight: 24,
  },
  bottomNavStrong: {
    color: '#111827',
    fontSize: 18,
    fontWeight: '900',
    lineHeight: 20,
  },
  bottomNavText: {
    color: '#4B5563',
    fontSize: 9.5,
    fontWeight: '800',
    marginTop: 1,
  },
  bottomNavTextActive: {
    color: '#E11D48',
  },

  // ============================================================
  // Address picker modal styles
  // ============================================================
  modalBackdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(17, 24, 39, 0.42)',
  },
  addressSheet: {
    maxHeight: '82%',
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    backgroundColor: '#FFF7FB',
    padding: spacing.lg,
    gap: spacing.md,
  },
  addressSheetHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  addressSheetTitle: {
    color: colors.text,
    fontSize: typography.section,
    fontWeight: '900',
  },
  addressSheetSubtitle: {
    color: colors.textMuted,
    fontSize: typography.caption,
    fontWeight: '700',
    marginTop: 3,
  },
  sheetCloseButton: {
    width: 38,
    height: 38,
    borderRadius: radius.pill,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addressList: {
    gap: spacing.sm,
    paddingBottom: spacing.lg,
  },
  addressOption: {
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: '#FBCFE8',
    backgroundColor: colors.white,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  addressOptionActive: {
    borderColor: '#BE185D',
    backgroundColor: '#FFE4E6',
  },
  addressIconWrap: {
    width: 38,
    height: 38,
    borderRadius: radius.pill,
    backgroundColor: '#FCE7F3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addressOptionCopy: {
    flex: 1,
    gap: 3,
  },
  addressOptionTitle: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: '900',
  },
  addressOptionMeta: {
    color: colors.textMuted,
    fontSize: typography.caption,
    lineHeight: 19,
    fontWeight: '700',
  },
  addressEta: {
    color: '#BE185D',
    fontSize: typography.tiny,
    fontWeight: '900',
  },
  addAddressButton: {
    minHeight: 54,
    borderRadius: radius.md,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#BE185D',
    backgroundColor: '#FFF1F2',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  addAddressButtonText: {
    color: '#BE185D',
    fontSize: typography.body,
    fontWeight: '900',
  },
  addAddressBox: {
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: '#FDA4AF',
    backgroundColor: colors.white,
    padding: spacing.md,
    gap: spacing.sm,
  },
  addAddressTitle: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: '900',
  },
  addressInput: {
    minHeight: 46,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surfaceSoft,
    paddingHorizontal: spacing.md,
    color: colors.text,
    fontSize: typography.caption,
    fontWeight: '700',
  },
  addAddressActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  cancelAddressButton: {
    flex: 1,
    minHeight: 46,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.lineStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelAddressText: {
    color: colors.text,
    fontSize: typography.caption,
    fontWeight: '900',
  },
  saveAddressButton: {
    flex: 1.2,
    minHeight: 46,
    borderRadius: radius.pill,
    backgroundColor: '#BE185D',
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveAddressText: {
    color: colors.white,
    fontSize: typography.caption,
    fontWeight: '900',
  },

  // ============================================================
  // Men's Tab custom design styles
  // ============================================================
  menCategoriesRow: {
    flexDirection: 'row',
    paddingVertical: spacing.md,
    gap: spacing.md,
    alignItems: 'center',
  },
  menCategoryItem: {
    alignItems: 'center',
    width: 72,
  },
  menCategoryCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 1.5,
    borderColor: '#E11D48',
    backgroundColor: '#F3F4F6',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1.5 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  menCategoryImage: {
    width: '100%',
    height: '100%',
  },
  menCategoryLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#1E0A2E',
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  menHeroContainer: {
    marginVertical: spacing.sm,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  menHeroBorder: {
    padding: 2.5,
    borderRadius: 16,
  },
  menHeroInner: {
    height: 180,
    flexDirection: 'row',
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: '#111827',
  },
  menHeroInnerEors: {
    height: 220,
    borderRadius: 14,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#FFE4E6',
  },
  menHeroLeft: {
    flex: 1.2,
    padding: spacing.md,
    justifyContent: 'center',
    position: 'relative',
  },
  menHeroRight: {
    flex: 1,
    position: 'relative',
  },
  menSaleBadgeContainer: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    zIndex: 2,
  },
  menSaleBadgeHex: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: 6,
  },
  menSaleBadgeText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: '900',
  },
  menHeroSubtitle: {
    color: '#FCD34D',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginBottom: spacing.xs,
    marginTop: spacing.md,
  },
  menHeroTitle: {
    color: colors.white,
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  menHeroOffer: {
    color: '#F97316',
    fontSize: 18,
    fontWeight: '900',
    marginTop: spacing.xs,
  },
  menHeroFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.white,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  menHeroFooterBrand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  menHeroFooterLogoBg: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#111827',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menHeroFooterLogoText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '900',
  },
  menHeroFooterBrandName: {
    color: '#111827',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  menHeroFooterCta: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111827',
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 2,
  },
  menHeroFooterCtaText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: '900',
  },
  menDotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    marginVertical: spacing.xs,
  },
  menDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#D1D5DB',
  },
  menDotActive: {
    backgroundColor: '#4B5563',
    width: 12,
  },
  partnerStripsContainer: {
    marginVertical: spacing.sm,
    gap: spacing.xs,
  },
  partnerRow: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  poweredLabelBlock: {
    paddingHorizontal: spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  poweredLabelText: {
    color: colors.white,
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  partnerBrandBlock: {
    flex: 1,
    height: 36,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    gap: spacing.xxs,
  },
  partnerBrandText: {
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  bankOfferStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    padding: spacing.md,
    marginVertical: spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1.5 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1.5,
  },
  bankCardsContainer: {
    width: 44,
    height: 28,
    position: 'relative',
    marginRight: spacing.xs,
  },
  miniCreditCard: {
    width: 32,
    height: 20,
    borderRadius: 3,
    position: 'absolute',
  },
  sbiCard: {
    backgroundColor: '#1E293B',
    top: 0,
    left: 0,
    transform: [{ rotate: '-12deg' }],
  },
  axisCard: {
    backgroundColor: '#0EA5E9',
    bottom: 0,
    right: 0,
    borderWidth: 0.5,
    borderColor: '#E2E8F0',
    justifyContent: 'center',
  },
  axisCardStripe: {
    height: 4,
    backgroundColor: '#F59E0B',
    width: '100%',
  },
  bankOfferTextContainer: {
    flex: 1,
  },
  bankOfferTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: '#1E293B',
  },
  bankOfferSubtitle: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '700',
    marginTop: 2,
  },
  bankPlayButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  featuredBrandsContainer: {
    marginVertical: spacing.sm,
  },
  featuredBrandsHeading: {
    fontSize: 14,
    fontWeight: '900',
    color: '#F97316',
    letterSpacing: 1.5,
    marginBottom: spacing.sm,
  },
  featuredBrandsGrid: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  featuredBrandCard: {
    flex: 1,
    height: 220,
    borderRadius: 14,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#F1F5F9',
  },
  brandOverlayScrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  brandLogoPillContainer: {
    position: 'absolute',
    bottom: spacing.md,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  brandLogoPill: {
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radius.pill,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  vanHeusenPill: {
    backgroundColor: colors.white,
  },
  vanHeusenPillText: {
    color: '#1E293B',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  levisPill: {
    backgroundColor: '#E11D48',
  },
  levisPillText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  vanHeusenSubPillText: {
    color: '#4B5563',
    fontSize: 7,
    fontWeight: '900',
    letterSpacing: 1,
    textAlign: 'center',
    marginTop: -1,
  },
  brandCardOfferContainer: {
    position: 'absolute',
    bottom: 58,
    left: spacing.xs,
    right: spacing.xs,
    alignItems: 'center',
    zIndex: 3,
  },
  brandCardOfferText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  brandCardSubText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 1,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  hexBadgeBorder: {
    borderWidth: 2,
    borderColor: '#EC4899',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
  },
  hexBadgeTextSmall: {
    color: '#EC4899',
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  hexBadgeTextLarge: {
    color: '#EC4899',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.5,
    textAlign: 'center',
    marginVertical: -2,
  },
  highlightsContainer: {
    marginVertical: spacing.sm,
  },
  ledMarquee: {
    backgroundColor: '#EF4444',
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#F59E0B',
    alignItems: 'center',
    marginBottom: spacing.sm,
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  ledText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  highlightsScrollContainer: {
    position: 'relative',
  },
  highlightsRow: {
    gap: spacing.sm,
    paddingRight: 50,
  },
  highlightCard: {
    width: 140,
    height: 190,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: '#F1F5F9',
    position: 'relative',
  },
  highlightImage: {
    width: '100%',
    height: '100%',
  },
  highlightTextOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    padding: spacing.xs,
  },
  highlightCardTitle: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '900',
  },
  highlightCardSubtitle: {
    color: '#CBD5E1',
    fontSize: 9,
    fontWeight: '700',
    marginTop: 2,
  },
  highlightsPlayButton: {
    position: 'absolute',
    right: spacing.xs,
    bottom: spacing.xs,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
  },
  sceneContainer: {
    marginVertical: spacing.sm,
  },
  sceneHeaderGlow: {
    backgroundColor: '#FFF',
    paddingVertical: 8,
    paddingHorizontal: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    marginBottom: spacing.sm,
    alignItems: 'center',
  },
  sceneTitleText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#6B21A8',
    letterSpacing: 1.5,
  },
  sceneGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: spacing.sm,
  },
  sceneCard: {
    width: '48.5%',
    backgroundColor: '#FFF',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  sceneCardCollage: {
    flexDirection: 'row',
    height: 110,
    gap: 1,
  },
  sceneCollageImage: {
    flex: 1,
    height: '100%',
  },
  sceneCardFooter: {
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  sceneCardLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1F2937',
  },
  sponsoredContainer: {
    marginVertical: spacing.sm,
  },
  sponsoredTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: '#C2410C',
    letterSpacing: 1.5,
    marginBottom: spacing.sm,
  },
  sponsoredScroll: {
    gap: spacing.sm,
  },
  sponsoredCard: {
    width: 240,
    height: 320,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#F1F5F9',
  },
  sponsoredOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
  },
  sponsoredPlayButton: {
    position: 'absolute',
    top: '40%',
    left: '42%',
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  sponsoredInfo: {
    position: 'absolute',
    bottom: 65,
    left: spacing.md,
    right: spacing.md,
  },
  sponsoredOfferText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  sponsoredSubText: {
    color: '#E2E8F0',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 2,
  },
  sponsoredLogoPillContainer: {
    position: 'absolute',
    bottom: 15,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  sponsoredLogoPill: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    borderRadius: 4,
    width: '85%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  sponsoredLogoText: {
    color: '#1E293B',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1,
  },
  hotRightNowContainer: {
    marginVertical: spacing.sm,
  },
  hotRightNowHeading: {
    fontSize: 14,
    fontWeight: '900',
    color: '#1E293B',
    letterSpacing: 1.5,
    marginBottom: spacing.sm,
  },
  hotRightNowScroll: {
    gap: spacing.sm,
    paddingVertical: 2,
  },
  hotRightNowCard: {
    width: 170,
    height: 280,
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#3B82F6',
    position: 'relative',
    backgroundColor: '#F1F5F9',
  },
  hotRightNowImage: {
    width: '100%',
    height: '70%',
  },
  hotRightNowBody: {
    padding: spacing.sm,
    backgroundColor: '#EFF6FF',
    flex: 1,
    justifyContent: 'center',
  },
  hotRightNowTitle: {
    fontSize: 11,
    fontWeight: '900',
    color: '#2563EB',
    textAlign: 'center',
  },
  hotRightNowSub: {
    fontSize: 9,
    fontWeight: '700',
    color: '#475569',
    marginTop: 2,
    textAlign: 'center',
  },
  hotRightNowLogoContainer: {
    position: 'absolute',
    top: '63%',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  hotRightNowLogoPill: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  hotRightNowLogoText: {
    color: '#1E293B',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  weddingDiariesContainer: {
    marginVertical: spacing.sm,
  },
  weddingDiariesBanner: {
    backgroundColor: '#FBCFE8',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  weddingDiariesTitle: {
    color: '#9D174D',
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 1,
  },
  weddingDiariesSubtitle: {
    color: '#C2185B',
    fontSize: 11,
    fontWeight: '700',
    marginTop: 2,
  },
  weddingDiariesScroll: {
    gap: spacing.sm,
  },
  weddingCard: {
    width: 140,
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#F1F5F9',
  },
  weddingCardImage: {
    width: '100%',
    height: '100%',
  },
  weddingCardContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.sm,
    zIndex: 2,
  },
  weddingCardTitle: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '900',
  },
  weddingCardOffer: {
    color: '#FBCFE8',
    fontSize: 9,
    fontWeight: '800',
    marginTop: 2,
  },
  trendsContainer: {
    marginVertical: spacing.sm,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#FFF7ED',
    paddingBottom: spacing.sm,
  },
  trendsHeader: {
    paddingVertical: 12,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#FFEDD5',
  },
  trendsTitleText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#C2410C',
    letterSpacing: 0.5,
  },
  trendsSubText: {
    fontSize: 9,
    color: '#EA580C',
    fontWeight: '700',
    marginTop: 2,
  },
  trendsScroll: {
    gap: spacing.sm,
    paddingHorizontal: spacing.sm,
    marginTop: spacing.sm,
  },
  trendCard: {
    width: 150,
    height: 230,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#FFEDD5',
  },
  trendImage: {
    width: '100%',
    height: '70%',
  },
  trendNumberContainer: {
    position: 'absolute',
    top: spacing.xs,
    left: spacing.xs,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  trendNumberText: {
    fontSize: 15,
    fontWeight: '900',
    color: '#C2410C',
  },
  trendContent: {
    padding: spacing.xs,
    flex: 1,
    justifyContent: 'center',
  },
  trendCardTitle: {
    fontSize: 10,
    fontWeight: '900',
    color: '#1E293B',
  },
  trendCardOffer: {
    fontSize: 9,
    color: '#C2410C',
    fontWeight: '800',
    marginTop: 1,
  },
  focusContainer: {
    marginVertical: spacing.sm,
  },
  focusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  focusHeadingText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#B91C1C',
    letterSpacing: 1.5,
  },
  focusPlayIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  focusScroll: {
    gap: spacing.sm,
  },
  focusCard: {
    width: 155,
    height: 210,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#F1F5F9',
  },
  focusCardContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.sm,
    zIndex: 2,
  },
  focusCardTitle: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '900',
  },
  focusCardOffer: {
    color: '#F87171',
    fontSize: 9,
    fontWeight: '800',
    marginTop: 2,
  },
  hdfcOfferStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    padding: spacing.md,
    marginVertical: spacing.sm,
  },
  hdfcLogoContainer: {
    backgroundColor: '#004C8F',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 4,
  },
  hdfcLogoText: {
    color: '#FFF',
    fontSize: 9,
    fontWeight: '900',
  },
  hdfcTextContainer: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  hdfcOfferTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: '#1E293B',
  },
  hdfcOfferSubtitle: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '700',
    marginTop: 2,
  },
  playToSlayButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#000',
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 2,
  },
  playToSlayText: {
    color: '#FFF',
    fontSize: 9,
    fontWeight: '900',
  },
  brandOfDayContainer: {
    marginVertical: spacing.sm,
  },
  brandOfDayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  brandOfDayHeading: {
    fontSize: 14,
    fontWeight: '900',
    color: '#1E293B',
    letterSpacing: 1.5,
  },
  adBadge: {
    backgroundColor: '#E2E8F0',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  adBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#64748B',
  },
  brandOfDayScroll: {
    gap: spacing.sm,
  },
  brandOfDayCard: {
    width: 260,
    height: 110,
    borderRadius: 14,
    overflow: 'hidden',
    padding: spacing.md,
    justifyContent: 'center',
    position: 'relative',
  },
  brandOfDayLogo: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 2,
  },
  brandOfDayOffer: {
    color: '#FCD34D',
    fontSize: 13,
    fontWeight: '900',
    marginTop: spacing.xs,
  },
  priceStoreContainer: {
    marginVertical: spacing.sm,
  },
  priceStoreHeading: {
    fontSize: 16,
    fontWeight: '900',
    color: '#D97706',
    letterSpacing: 2,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  priceStoreGrid: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  priceStoreCol: {
    flex: 1,
    gap: spacing.sm,
  },
  priceCardLarge: {
    height: 240,
    borderRadius: 14,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#F3F4F6',
    borderWidth: 1.5,
    borderColor: '#C084FC',
  },
  priceCardLargeTopContent: {
    position: 'absolute',
    top: 14,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  priceCardLargeBottomContent: {
    position: 'absolute',
    bottom: 14,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  priceCardLargeContent: {
    position: 'absolute',
    bottom: spacing.md,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  priceCardLargeTitle: {
    color: '#F3E8FF',
    fontSize: 16,
    fontWeight: '800',
  },
  priceCardLargeValue: {
    color: '#FFF',
    fontSize: 36,
    fontWeight: '900',
    lineHeight: 40,
  },
  priceCardSmallPurple: {
    height: 100,
    borderRadius: 14,
    backgroundColor: '#6D28D9',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#C084FC',
  },
  priceCrashText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 1,
  },
  priceCardSmallPink: {
    height: 74,
    borderRadius: 14,
    backgroundColor: '#DB2777',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#F472B6',
  },
  priceCardSmallLabel: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
  },
  priceCardSmallValue: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: '900',
  },
  priceCardSmallPurpleContainer: {
    height: 74,
    borderRadius: 14,
    backgroundColor: '#6D28D9',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#C084FC',
  },
  priceCardSmallPinkContainer: {
    height: 100,
    borderRadius: 14,
    backgroundColor: '#DB2777',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#F472B6',
  },
  priceDealsLabel: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '900',
  },
  priceDealsValue: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  pocketFriendlyContainer: {
    marginVertical: spacing.sm,
  },
  pocketFriendlyHeader: {
    backgroundColor: '#FFF7ED',
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFEDD5',
    marginBottom: spacing.sm,
  },
  pocketFriendlyTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: '#EA580C',
    letterSpacing: 1.5,
  },
  pocketFriendlyScroll: {
    gap: spacing.sm,
  },
  pocketFriendlyItem: {
    alignItems: 'center',
    width: 76,
  },
  pocketFriendlyCircle: {
    width: 66,
    height: 66,
    borderRadius: 33,
    borderWidth: 1.5,
    borderColor: '#F43F5E',
    backgroundColor: '#FFF',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pocketFriendlyImage: {
    width: '100%',
    height: '100%',
  },
  pocketFriendlyLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#374151',
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  featuredBrandsAllContainer: {
    marginVertical: spacing.sm,
  },
  featuredBrandsAllHeading: {
    fontSize: 14,
    fontWeight: '900',
    color: '#EA580C',
    letterSpacing: 1.5,
    marginBottom: spacing.sm,
  },
  featuredBrandsAllScroll: {
    gap: spacing.sm,
  },
  brandAllCard: {
    width: 170,
    height: 230,
    borderRadius: 14,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#F1F5F9',
  },
  brandAllCardContent: {
    position: 'absolute',
    bottom: 55,
    left: spacing.sm,
    right: spacing.sm,
    zIndex: 2,
  },
  brandAllCardOffer: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '900',
  },
  brandAllCardSub: {
    color: '#E2E8F0',
    fontSize: 11,
    fontWeight: '800',
    marginTop: 2,
  },
  brandAllCardDesc: {
    color: '#94A3B8',
    fontSize: 10,
    fontWeight: '700',
    marginTop: 1,
  },
  brandAllLogoPillContainer: {
    position: 'absolute',
    bottom: 12,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  brandAllLogoPill: {
    backgroundColor: '#FFF',
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: 4,
    width: '85%',
    alignItems: 'center',
  },
  nikeLogoText: {
    color: '#000',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  miraggioLogoText: {
    color: '#1E293B',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
  },
  
  // ============================================================
  // Streax Hair Serum Ad Banner Styles
  // ============================================================
  streaxBanner: {
    height: 120,
    borderRadius: 14,
    overflow: 'hidden',
    position: 'relative',
    marginHorizontal: spacing.sm,
    marginVertical: spacing.xs,
  },
  streaxAdBadge: {
    position: 'absolute',
    top: spacing.xs,
    left: spacing.xs,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 4,
    paddingHorizontal: 5,
    paddingVertical: 1,
    zIndex: 10,
  },
  streaxAdBadgeText: {
    color: '#E2E8F0',
    fontSize: 8,
    fontWeight: '900',
  },
  streaxModelImage: {
    width: '45%',
    height: '100%',
    position: 'absolute',
    left: 0,
    top: 0,
  },
  streaxContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingRight: spacing.md,
    height: '100%',
  },
  streaxBrandPill: {
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1.5 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    marginRight: spacing.md,
  },
  streaxBrandText: {
    color: '#000000',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  streaxSubText: {
    color: '#3F3F46',
    fontSize: 7,
    fontWeight: '900',
    marginTop: 1,
    letterSpacing: 0.5,
  },
  streaxOfferContainer: {
    justifyContent: 'center',
  },
  streaxOfferTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  streaxOfferSub: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 0.5,
    textAlign: 'center',
    marginTop: -2,
  },
  streaxDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    marginVertical: spacing.xs,
  },
  streaxDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#D1D5DB',
  },
  streaxDotActive: {
    backgroundColor: '#111827',
  },

  // ============================================================
  // Price Store Grid Styles
  // ============================================================
  priceStoreTopRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginHorizontal: spacing.xs,
  },
  priceStoreRightCol: {
    flex: 1,
    gap: spacing.sm,
  },
  priceStoreBottomRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginHorizontal: spacing.xs,
    marginTop: spacing.sm,
  },
  priceCardPink: {
    height: 74,
    borderRadius: 14,
    overflow: 'hidden',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#F472B6',
  },
  priceCardPurple: {
    height: 74,
    borderRadius: 14,
    overflow: 'hidden',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#C084FC',
  },
  priceCardBottom: {
    flex: 1,
    height: 100,
    borderRadius: 14,
    overflow: 'hidden',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#C084FC',
  },
  priceStoreTitleGold: {
    color: '#FCD34D',
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 1.5,
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 1.5, height: 1.5 },
    textShadowRadius: 2,
  },
  priceCardLargeSpacer: {
    height: 48,
  },
  priceCardLargeLabelText: {
    color: '#E9D5FF',
    fontSize: 14,
    fontWeight: '900',
    textAlign: 'center',
  },
  priceCardLargeValueText: {
    color: '#FFFFFF',
    fontSize: 34,
    fontWeight: '900',
    textAlign: 'center',
    marginTop: -4,
  },
  priceCardSmallLabelText: {
    color: '#E9D5FF',
    fontSize: 12,
    fontWeight: '900',
    textAlign: 'center',
  },
  priceCardSmallValueText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '900',
    textAlign: 'center',
    marginTop: -2,
  },
  priceCrashTextGold: {
    color: '#FCD34D',
    fontSize: 17,
    fontWeight: '900',
    letterSpacing: 1,
    textAlign: 'center',
  },
  priceDealsTextGold: {
    color: '#FCD34D',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  radialRaysContainer: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.65,
  },

  // ============================================================
  // Pocket Friendly Section Cards Styles
  // ============================================================
  pocketFriendlyCard: {
    width: 76,
    alignItems: 'center',
  },
  pocketFriendlyImageContainer: {
    width: 76,
    height: 104,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1.5,
    borderColor: '#FECDD3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pocketFriendlyPill: {
    backgroundColor: '#EC4899',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginTop: -10,
    zIndex: 10,
    width: '94%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1.5 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  pocketFriendlyPillText: {
    color: '#FFFFFF',
    fontSize: 8.5,
    fontWeight: '900',
    textAlign: 'center',
  },

  // ============================================================
  // TOP CATEGORIES Section Styles
  // ============================================================
  topCategoriesContainer: {
    marginHorizontal: spacing.sm,
    marginVertical: spacing.md,
  },
  topCategoriesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  topCategoriesTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#EA580C',
    letterSpacing: 1.2,
  },
  shopNowBadge: {
    backgroundColor: '#000000',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  shopNowBadgeText: {
    color: '#FFFFFF',
    fontSize: 9.5,
    fontWeight: '900',
  },
  topCategoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    justifyContent: 'space-between',
  },
  topCategoryCard: {
    width: '47.5%',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    padding: spacing.xs,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1.5 },
    shadowOpacity: 0.05,
    shadowRadius: 2.5,
    elevation: 2,
    marginBottom: spacing.xs,
  },
  topCategoryCardTitle: {
    fontSize: 12.5,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: spacing.xs,
  },
  topCategoryCardImageWrapper: {
    width: '100%',
    height: 125,
    borderRadius: 10,
    overflow: 'hidden',
    position: 'relative',
  },
  topCategoryCardImage: {
    width: '100%',
    height: '100%',
  },
  topCategoryCardPriceOverlay: {
    position: 'absolute',
    bottom: spacing.xs,
    left: spacing.xs,
    right: spacing.xs,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 6,
    paddingVertical: 3,
    paddingHorizontal: spacing.xs,
    alignItems: 'center',
  },
  topCategoryCardPriceText: {
    color: '#FFFFFF',
    fontSize: 10.5,
    fontWeight: '900',
  },
  topCategoryCardBrandsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.xs,
    width: '100%',
  },
  topCategoryCardBrandText: {
    fontSize: 8,
    fontWeight: '900',
    color: '#475569',
    letterSpacing: 0.5,
  },
  verticalBrandSeparator: {
    width: 1.2,
    height: 9,
    backgroundColor: '#CBD5E1',
    marginHorizontal: 4,
  },
  morePillContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 5,
  },
  morePill: {
    backgroundColor: '#FEF3C7',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  morePillText: {
    color: '#D97706',
    fontSize: 7.5,
    fontWeight: '900',
  },

  // ============================================================
  // Pocket Friendly (Red-Orange Grid Theme) Styles
  // ============================================================
  redPocketFriendlyContainer: {
    marginHorizontal: spacing.sm,
    marginVertical: spacing.md,
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#EF4444',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 4,
    backgroundColor: '#7F1D1D',
  },
  redPocketFriendlyHeader: {
    paddingVertical: spacing.sm,
    alignItems: 'center',
    borderBottomWidth: 1.5,
    borderColor: '#EA580C',
  },
  redPocketFriendlyTitle: {
    color: '#FFFFFF',
    fontSize: 14.5,
    fontWeight: '900',
    letterSpacing: 1.5,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  redPocketFriendlyGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: spacing.sm,
    gap: spacing.sm,
    justifyContent: 'space-between',
    backgroundColor: '#7F1D1D',
  },
  redPocketFriendlyCard: {
    width: '22.8%',
    height: 104,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#EA580C',
    backgroundColor: '#FFFFFF',
  },
  redPocketFriendlyCardContent: {
    flex: 1,
    position: 'relative',
  },
  redPocketFriendlyCardImage: {
    width: '100%',
    height: '100%',
  },
  redPocketFriendlyCardOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingVertical: 4,
    paddingHorizontal: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  redPocketFriendlyCardUnder: {
    color: '#E2E8F0',
    fontSize: 6.5,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  redPocketFriendlyCardPrice: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '900',
    marginTop: -1,
  },
  redPocketFriendlyCardLabel: {
    color: '#FCD34D',
    fontSize: 6.5,
    fontWeight: '900',
    marginTop: 1,
    textTransform: 'uppercase',
  },

  // ============================================================
  // SPONSORED BRANDS (ALL Tab) Styles
  // ============================================================
  allSponsoredBrandsContainer: {
    marginHorizontal: spacing.sm,
    marginVertical: spacing.md,
  },
  allSponsoredBrandsHeading: {
    fontSize: 14,
    fontWeight: '900',
    color: '#EA580C',
    letterSpacing: 1.5,
    marginBottom: spacing.sm,
  },
  allSponsoredBrandsGrid: {
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'space-between',
  },
  allSponsoredCard: {
    flex: 1,
    height: 135,
    borderRadius: 14,
    overflow: 'hidden',
    position: 'relative',
    flexDirection: 'row',
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1.5 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  allSponsoredCardLeft: {
    flex: 1.2,
    justifyContent: 'center',
    paddingRight: 4,
  },
  allSponsoredOfferTitle: {
    fontSize: 10.5,
    fontWeight: '900',
    lineHeight: 12.5,
  },
  allSponsoredBlackBadge: {
    backgroundColor: '#000000',
    alignSelf: 'flex-start',
    borderRadius: 4,
    paddingHorizontal: 5,
    paddingVertical: 2.5,
    marginVertical: 4,
  },
  allSponsoredBlackBadgeText: {
    color: '#FFFFFF',
    fontSize: 7.5,
    fontWeight: '900',
  },
  allSponsoredSubText: {
    fontSize: 7,
    fontWeight: '800',
    lineHeight: 9.5,
  },
  allSponsoredCardRightImage: {
    flex: 0.8,
    height: '100%',
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
  },
  allSponsoredPillContainer: {
    position: 'absolute',
    bottom: 8,
    left: spacing.sm,
  },
  allSponsoredPill: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1.5,
    elevation: 1.5,
  },
  allSponsoredPillText: {
    color: '#000000',
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 0.5,
  },

  // ============================================================
  // Kids Tab Custom Styles
  // ============================================================
  girlsHexBorderContainer: {
    width: 76,
    height: 76,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  girlsHexBorderInner: {
    width: 66,
    height: 66,
    borderRadius: 33,
    borderWidth: 2,
    borderColor: '#E11D48',
    overflow: 'hidden',
    backgroundColor: '#FFF',
  },
  kidsCouponBand: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FF3F6C',
    marginHorizontal: spacing.sm,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    marginVertical: spacing.xs,
  },
  kidsCouponBadge: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  kidsCouponBadgeText: {
    color: '#FF3F6C',
    fontSize: 8,
    fontWeight: '900',
  },
  kidsCouponText: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  kidsShopNowButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  kidsShopNowButtonText: {
    color: '#000000',
    fontSize: 9.5,
    fontWeight: '900',
  },
  kidsHeroContainer: {
    marginHorizontal: spacing.sm,
    marginTop: spacing.xs,
    borderRadius: 18,
    overflow: 'hidden',
  },
  kidsHeroContent: {
    height: 195,
    flexDirection: 'row',
    padding: spacing.md,
    position: 'relative',
  },
  kidsHeroLeft: {
    flex: 1.2,
    justifyContent: 'center',
  },
  kidsHeroRight: {
    flex: 0.8,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  kidsHeroSaleBadgeContainer: {
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  kidsHeroSaleBadge: {
    backgroundColor: '#4C1D95',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
    padding: 6,
    borderRadius: 6,
    alignItems: 'center',
  },
  kidsHeroSaleBadgeText: {
    color: '#FFFFFF',
    fontSize: 7.5,
    fontWeight: '800',
  },
  kidsHeroSaleBadgeTextBold: {
    color: '#FCD34D',
    fontSize: 10,
    fontWeight: '900',
  },
  kidsLiveNowBadge: {
    backgroundColor: '#22C55E',
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 1,
    marginTop: 2,
  },
  kidsLiveNowBadgeText: {
    color: '#FFFFFF',
    fontSize: 6.5,
    fontWeight: '900',
  },
  kidsHeroTitle: {
    color: '#FFFFFF',
    fontSize: 15.5,
    fontWeight: '900',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  kidsHeroDiscount: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '900',
    marginTop: -2,
    marginBottom: 8,
  },
  kidsHeroShopBtn: {
    backgroundColor: '#000000',
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 2,
  },
  kidsHeroShopBtnText: {
    color: '#FFFFFF',
    fontSize: 10.5,
    fontWeight: '900',
  },
  kidsHeroModelImage: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  characterShopContainer: {
    marginHorizontal: spacing.sm,
    marginVertical: spacing.md,
  },
  characterShopHeading: {
    fontSize: 15,
    fontWeight: '900',
    color: '#4A044E',
    letterSpacing: 1.2,
    marginBottom: spacing.sm,
  },
  characterShopGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    justifyContent: 'space-between',
  },
  characterCard: {
    width: '31.2%',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  characterImageWrapper: {
    width: '100%',
    height: 110,
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  characterCardImage: {
    width: '100%',
    height: '100%',
  },
  characterLabelPill: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 3.5,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    marginTop: -12,
    zIndex: 10,
    width: '92%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1.5,
    elevation: 1.5,
  },
  characterLabelText: {
    color: '#000000',
    fontSize: 7.5,
    fontWeight: '900',
    textAlign: 'center',
  },
  kidsSuperHotContainer: {
    marginHorizontal: spacing.sm,
    marginVertical: spacing.md,
  },
  kidsSuperHotHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  kidsSuperHotTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#581C87',
    letterSpacing: 1,
  },
  kidsSuperHotBadge: {
    backgroundColor: '#000000',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  kidsSuperHotBadgeText: {
    color: '#FFFFFF',
    fontSize: 9.5,
    fontWeight: '900',
  },
  kidsSuperHotScroll: {
    gap: spacing.sm,
  },
  kidsSuperHotCard: {
    width: 210,
    height: 290,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#F1F5F9',
  },
  kidsSuperHotCardContent: {
    position: 'absolute',
    bottom: 50,
    left: spacing.sm,
    right: spacing.sm,
    zIndex: 2,
  },
  kidsSuperHotCardOffer: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  kidsSuperHotCardSub: {
    color: '#F1F5F9',
    fontSize: 10,
    fontWeight: '800',
    marginTop: 2,
  },
  kidsSuperHotLogosRow: {
    position: 'absolute',
    bottom: 15,
    left: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 2,
  },
  kidsSuperHotLogoText: {
    color: '#E2E8F0',
    fontSize: 8.5,
    fontWeight: '900',
  },
  kidsSuperHotMorePill: {
    position: 'absolute',
    bottom: 12,
    right: spacing.sm,
    backgroundColor: '#FEF3C7',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2.5,
    zIndex: 2,
  },
  kidsSuperHotMorePillText: {
    color: '#D97706',
    fontSize: 8,
    fontWeight: '900',
  },
  kidsFeaturedBrandsContainer: {
    marginHorizontal: spacing.sm,
    marginVertical: spacing.md,
  },
  kidsFeaturedBrandsHeading: {
    fontSize: 14,
    fontWeight: '900',
    color: '#EA580C',
    letterSpacing: 1.5,
    marginBottom: spacing.sm,
  },
  latestTrendsContainer: {
    marginHorizontal: spacing.sm,
    marginVertical: spacing.md,
  },
  latestTrendsHeader: {
    marginBottom: spacing.sm,
  },
  latestTrendsTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: '#7C2D12',
    letterSpacing: 0.5,
  },
  latestTrendsSubtitle: {
    fontSize: 9.5,
    color: '#9A3412',
    fontWeight: '800',
    marginTop: 1,
  },
  latestTrendsScroll: {
    gap: spacing.sm,
  },
  latestTrendCard: {
    width: 145,
    height: 200,
    borderRadius: 14,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#F1F5F9',
  },
  latestTrendNumberContainer: {
    position: 'absolute',
    top: 8,
    left: 8,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  latestTrendNumber: {
    color: '#000000',
    fontSize: 12.5,
    fontWeight: '900',
  },
  latestTrendCardContent: {
    position: 'absolute',
    bottom: 12,
    left: spacing.xs,
    right: spacing.xs,
    zIndex: 2,
    alignItems: 'center',
  },
  latestTrendLabel: {
    color: '#FFFFFF',
    fontSize: 10.5,
    fontWeight: '900',
    textAlign: 'center',
  },
  latestTrendPrice: {
    color: '#FCD34D',
    fontSize: 10,
    fontWeight: '900',
    marginTop: 1,
  },
});

