import { useState, useMemo } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Alert,
  TextInput,
  Modal,
} from 'react-native';
import { Redirect, router } from 'expo-router';
import { Image } from 'expo-image';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { LinearGradient } from 'expo-linear-gradient';
import { ScreenShell } from '@/src/components/screen-shell';
import { useApp } from '@/src/context/app-context';
import { useSuperAppStore } from '@/src/store/super-app-store';
import { radius, spacing } from '@/src/theme/tokens';

const { width: screenWidth } = Dimensions.get('window');

const brandColors = {
  myntraPink: '#FF3F6C',
  myntraNavy: '#282C3F',
  lightGray: '#F5F5F6',
  discountGreen: '#03A685',
  borderLight: '#EAEAEC',
  starGold: '#FFAD33',
  ratingGreen: '#14958F',
  ratingGreenLight: '#E4F4F3',
  grayText: '#7E8190',
  lightPink: '#FFF0F2',
};

// Local cache to persist reviews across page navigations within the session
const sessionReviewsCache: Record<
  string,
  Array<{
    id: string;
    name: string;
    rating: number;
    date: string;
    comment: string;
    helpfulCount: number;
    unhelpfulCount: number;
    userVoted?: 'helpful' | 'unhelpful';
  }>
> = {};

const generateDefaultReviews = (productId: string, category: string) => {
  const lowerCat = category.toLowerCase();
  if (lowerCat === 'fashion') {
    return [
      {
        id: `${productId}-rev-1`,
        name: 'Rahul Sharma',
        rating: 5,
        date: '28 May 2026',
        comment: 'Excellent cotton quality! The fit is absolutely perfect and matches the style description exactly. Highly recommend buying this.',
        helpfulCount: 24,
        unhelpfulCount: 2,
      },
      {
        id: `${productId}-rev-2`,
        name: 'Sneha Patel',
        rating: 4,
        date: '15 May 2026',
        comment: 'The material is soft and breathable. Color looks exactly like the picture. Only issue is that standard delivery took 4 days.',
        helpfulCount: 15,
        unhelpfulCount: 1,
      },
      {
        id: `${productId}-rev-3`,
        name: 'Vikram Singh',
        rating: 3,
        date: '04 May 2026',
        comment: 'Average product. The fit is good but the cloth feels slightly thin. Good for casual summer wear though.',
        helpfulCount: 8,
        unhelpfulCount: 3,
      },
    ];
  } else if (lowerCat === 'footwear') {
    return [
      {
        id: `${productId}-rev-1`,
        name: 'Amit Verma',
        rating: 5,
        date: '24 May 2026',
        comment: 'Extremely comfortable sole and amazing grip! Tested it on a morning run and it feels lightweight. True to size.',
        helpfulCount: 42,
        unhelpfulCount: 3,
      },
      {
        id: `${productId}-rev-2`,
        name: 'Neha Kapoor',
        rating: 4,
        date: '18 May 2026',
        comment: 'Stylish design and premium look. The cushion is soft. Fits well but I recommend wearing thick socks initially to break them in.',
        helpfulCount: 19,
        unhelpfulCount: 2,
      },
      {
        id: `${productId}-rev-3`,
        name: 'Rohan Deshmukh',
        rating: 3,
        date: '02 May 2026',
        comment: 'Looks great but the size runs slightly small. I had to exchange for one size larger. Quality is decent.',
        helpfulCount: 12,
        unhelpfulCount: 4,
      },
    ];
  } else if (lowerCat === 'beauty') {
    return [
      {
        id: `${productId}-rev-1`,
        name: 'Priyanka Sen',
        rating: 5,
        date: '27 May 2026',
        comment: 'Absolutely loved it! It has a very mild and pleasing scent, and doesn\'t feel sticky. Perfect for daily skin routine.',
        helpfulCount: 31,
        unhelpfulCount: 1,
      },
      {
        id: `${productId}-rev-2`,
        name: 'Aditi Rao',
        rating: 4,
        date: '20 May 2026',
        comment: 'Very effective product. Noticeable difference in a few days. The packaging was neat and clean. Will order again.',
        helpfulCount: 14,
        unhelpfulCount: 0,
      },
    ];
  } else if (lowerCat === 'homeliving') {
    return [
      {
        id: `${productId}-rev-1`,
        name: 'Manish G.',
        rating: 5,
        date: '29 May 2026',
        comment: 'Beautiful design! It instantly brightened up my living room. The material quality feels premium and durable.',
        helpfulCount: 28,
        unhelpfulCount: 2,
      },
      {
        id: `${productId}-rev-2`,
        name: 'Shreya D.',
        rating: 4,
        date: '10 May 2026',
        comment: 'Very nice addition to the house. The size is as described, colors are vivid. Happy with this purchase.',
        helpfulCount: 11,
        unhelpfulCount: 1,
      },
    ];
  } else {
    return [
      {
        id: `${productId}-rev-1`,
        name: 'Karan Malhotra',
        rating: 5,
        date: '26 May 2026',
        comment: 'Highly recommended! Excellent build quality and design. Works perfectly for what I needed.',
        helpfulCount: 18,
        unhelpfulCount: 1,
      },
      {
        id: `${productId}-rev-2`,
        name: 'Anjali Sharma',
        rating: 4,
        date: '12 May 2026',
        comment: 'Good value for money. Solid construction and functional. Very pleased with the packaging and prompt delivery.',
        helpfulCount: 9,
        unhelpfulCount: 0,
      },
    ];
  }
};

export default function ProductDetailScreen() {
  const { products } = useApp();
  const { addProduct, selectedProductId, setSelectedProduct, shoppingCart, toggleWishlist, wishlist } = useSuperAppStore();
  
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Modal Review States
  const [isReviewModalVisible, setIsReviewModalVisible] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [reviewerName, setReviewerName] = useState('');
  const [reviewComment, setReviewComment] = useState('');

  const product = products.find((item) => item.id === selectedProductId);
  if (!product) {
    return <Redirect href="/shopping" />;
  }

  // Get or Initialize reviews for this product
  if (!sessionReviewsCache[product.id]) {
    sessionReviewsCache[product.id] = generateDefaultReviews(product.id, product.category);
  }

  const [reviews, setReviews] = useState(sessionReviewsCache[product.id]);

  const saved = wishlist.some((item) => item.id === product.id);
  const isInBag = shoppingCart.some((item) => item.sourceId === product.id);
  const discountPercent = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

  const productImages = product.images && product.images.length > 0 ? product.images : [product.image];

  const displaySizes = useMemo(() => {
    const originalSizes = product.sizes && product.sizes.length > 0 ? product.sizes : ['6', '7', '8', '9'];
    const isFootwear = product.category.toLowerCase() === 'footwear' || originalSizes.some(s => !isNaN(Number(s)));
    if (isFootwear) {
      return [
        { value: '6', available: true, label: '8 left' },
        { value: '7', available: true },
        { value: '8', available: true },
        { value: '9', available: true },
        { value: '10', available: false },
        { value: '11', available: false },
      ];
    } else {
      return [
        { value: 'S', available: true },
        { value: 'M', available: true },
        { value: 'L', available: true },
        { value: 'XL', available: true },
        { value: 'XXL', available: false },
      ];
    }
  }, [product.sizes, product.category]);

  // Dynamic rating calculations based on local reviews list + baseline rating count
  const calculatedRatings = useMemo(() => {
    const totalLocalReviews = reviews.length;
    const sumLocalRatings = reviews.reduce((acc, rev) => acc + rev.rating, 0);

    const baseCount = product.ratingCount || 240;
    const baseRating = product.rating || 4.2;

    const finalCount = baseCount + totalLocalReviews;
    const finalRating = Number(
      ((baseRating * baseCount + sumLocalRatings) / finalCount).toFixed(1)
    );

    // Calculate rating counts for breakdown
    const distribution = {
      5: Math.round(baseCount * 0.55),
      4: Math.round(baseCount * 0.25),
      3: Math.round(baseCount * 0.12),
      2: Math.round(baseCount * 0.05),
      1: Math.round(baseCount * 0.03),
    };

    reviews.forEach((rev) => {
      const r = rev.rating as 5 | 4 | 3 | 2 | 1;
      if (distribution[r] !== undefined) {
        distribution[r]++;
      }
    });

    return {
      averageRating: finalRating,
      totalCount: finalCount,
      distribution,
    };
  }, [reviews, product.rating, product.ratingCount]);

  // Similar Products Filter (same category, excluding current product, fallback to popular if not enough)
  const similarProducts = useMemo(() => {
    let list = products.filter((item) => item.category === product.category && item.id !== product.id);
    if (list.length < 3) {
      const otherItems = products.filter((item) => item.id !== product.id && item.category !== product.category);
      list = [...list, ...otherItems];
    }
    return list.slice(0, 6);
  }, [products, product.category, product.id]);

  const handleAddToBag = () => {
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      Alert.alert(
        'Select Size',
        'Please select a size before adding the product to your bag.',
        [{ text: 'OK' }]
      );
      return;
    }
    addProduct(product);
  };

  const handleVoteHelpful = (reviewId: string, isUp: boolean) => {
    const updated = reviews.map((rev) => {
      if (rev.id !== reviewId) return rev;
      
      if (rev.userVoted) {
        Alert.alert('Already Voted', 'You have already submitted your feedback for this review.');
        return rev;
      }

      return {
        ...rev,
        helpfulCount: isUp ? rev.helpfulCount + 1 : rev.helpfulCount,
        unhelpfulCount: !isUp ? rev.unhelpfulCount + 1 : rev.unhelpfulCount,
        userVoted: isUp ? ('helpful' as const) : ('unhelpful' as const),
      };
    });

    sessionReviewsCache[product.id] = updated;
    setReviews(updated);
  };

  const handleReviewSubmit = () => {
    if (!reviewComment.trim()) {
      Alert.alert('Error', 'Please enter your review comment.');
      return;
    }

    const newRev = {
      id: `${product.id}-user-${Date.now()}`,
      name: reviewerName.trim() || 'Verified Gozy Buyer',
      rating: newRating,
      date: 'Today',
      comment: reviewComment.trim(),
      helpfulCount: 0,
      unhelpfulCount: 0,
    };

    const updatedReviews = [newRev, ...reviews];
    sessionReviewsCache[product.id] = updatedReviews;
    setReviews(updatedReviews);

    // Reset Form
    setNewRating(5);
    setReviewerName('');
    setReviewComment('');
    setIsReviewModalVisible(false);

    Alert.alert('Review Submitted', 'Thank you! Your review has been added successfully.');
  };

  return (
    <View key={product.id} style={styles.rootContainer}>
      <ScreenShell scroll={true} contentContainerStyle={styles.shellContainer}>
        {/* Header */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12, paddingVertical: 8, borderBottomWidth: 1, borderColor: '#EAEAEC', backgroundColor: '#FFFFFF' }}>
          <Pressable onPress={() => router.back()} style={{ padding: 4 }}>
            <MaterialCommunityIcons name="arrow-left" size={24} color="#282C3F" />
          </Pressable>

          {/* Search bar inside header */}
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 20, height: 38, marginHorizontal: 8, paddingHorizontal: 10 }}>
            <Image
              source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/b/bc/Myntra_Logo.png' }}
              style={{ width: 16, height: 12, marginRight: 6 }}
              contentFit="contain"
            />
            <Text style={{ flex: 1, color: '#A9ABB3', fontSize: 13, fontWeight: '500' }}>Search in Myntra</Text>
            <MaterialCommunityIcons name="magnify" size={18} color="#6B7280" />
          </View>

          {/* Action Icons */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <Pressable onPress={() => router.push('/wishlist')} style={{ padding: 4 }}>
              <MaterialCommunityIcons name="heart-outline" size={24} color="#282C3F" />
            </Pressable>
            <Pressable onPress={() => router.push('/shopping-checkout')} style={{ padding: 4, position: 'relative' }}>
              <MaterialCommunityIcons name="shopping-outline" size={24} color="#282C3F" />
              {shoppingCart.length > 0 && (
                <View style={{ position: 'absolute', top: 2, right: 2, backgroundColor: '#FF3F6C', borderRadius: 8, minWidth: 14, height: 14, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 2 }}>
                  <Text style={{ color: '#FFFFFF', fontSize: 8, fontWeight: '800' }}>{shoppingCart.length}</Text>
                </View>
              )}
            </Pressable>
          </View>
        </View>

        {/* Image Carousel */}
        <View style={styles.carouselContainer}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={(e) => {
              const index = Math.round(e.nativeEvent.contentOffset.x / screenWidth);
              setActiveImageIndex(index);
            }}
            scrollEventThrottle={16}
          >
            {productImages.map((img, i) => (
              <View key={i} style={styles.carouselSlide}>
                <Image source={{ uri: img }} contentFit="cover" style={styles.carouselImage} />
              </View>
            ))}
          </ScrollView>

          {/* Top Left Badge: House of Brands */}
          <View style={{ position: 'absolute', top: 12, left: 12, backgroundColor: '#7C3AED', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 }}>
            <Text style={{ color: '#FFFFFF', fontSize: 10, fontWeight: '800', textTransform: 'uppercase' }}>House of Brands</Text>
          </View>
          
          {/* Pagination Dots */}
          {productImages.length > 1 && (
            <View style={styles.paginationRow}>
              {productImages.map((_, i) => (
                <View
                  key={i}
                  style={[
                    styles.paginationDot,
                    activeImageIndex === i ? styles.paginationDotActive : null,
                  ]}
                />
              ))}
            </View>
          )}

          {/* Bottom Right video bubble */}
          <View style={{ position: 'absolute', bottom: 12, right: 12, width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.92)', borderWidth: 1.5, borderColor: '#FF3F6C', alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOpacity: 0.1, shadowOffset: { width: 0, height: 2 }, shadowRadius: 3, elevation: 4 }}>
            <MaterialCommunityIcons name="play-circle" size={24} color="#FF3F6C" />
          </View>

          {/* Floating Rating Card */}
          <View style={{ position: 'absolute', bottom: 12, left: 12, backgroundColor: 'rgba(255, 255, 255, 0.95)', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 14, gap: 2, borderWidth: 1, borderColor: '#EAEAEC' }}>
            <Text style={{ fontSize: 10.5, fontWeight: '900', color: '#282C3F' }}>{calculatedRatings.averageRating.toFixed(1)}</Text>
            <MaterialCommunityIcons name="star" size={12} color="#14958F" />
            <View style={{ width: 1, height: 10, backgroundColor: '#EAEAEC', marginHorizontal: 4 }} />
            <Text style={{ fontSize: 10.5, color: '#7E8190', fontWeight: '800' }}>
              {calculatedRatings.totalCount}
            </Text>
          </View>
        </View>

        {/* Carousel Action Bar ( hanger, heart, share ) */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderColor: '#EAEAEC', backgroundColor: '#FFFFFF' }}>
          <Pressable style={{ alignItems: 'center' }}>
            <MaterialCommunityIcons name="hanger" size={22} color="#7E8190" />
          </Pressable>
          <View style={{ width: 1, height: 16, backgroundColor: '#EAEAEC' }} />
          <Pressable onPress={() => toggleWishlist(product)} style={{ alignItems: 'center' }}>
            <MaterialCommunityIcons name={saved ? 'heart' : 'heart-outline'} size={22} color={saved ? '#FF3F6C' : '#7E8190'} />
          </Pressable>
          <View style={{ width: 1, height: 16, backgroundColor: '#EAEAEC' }} />
          <Pressable style={{ alignItems: 'center' }}>
            <MaterialCommunityIcons name="share-variant-outline" size={22} color="#7E8190" />
          </Pressable>
        </View>

        {/* Brand & Price Description Card */}
        <View style={styles.detailsCard}>
          <Text style={styles.brandTitle}>{product.brand}</Text>
          <Text style={styles.productName}>{product.name}</Text>
          
          <View style={styles.priceRow}>
            <Text style={{ fontSize: 13, color: '#7E8190', fontWeight: '500', textDecorationLine: 'line-through' }}>
              MRP Rs. {product.originalPrice.toLocaleString('en-IN')}
            </Text>
            <Text style={{ fontSize: 22, fontWeight: '900', color: '#282C3F', marginLeft: 6 }}>
              Rs. {product.price.toLocaleString('en-IN')}
            </Text>
            <View style={{ backgroundColor: '#FF3F6C', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, marginLeft: 8 }}>
              <Text style={{ color: '#FFFFFF', fontSize: 12, fontWeight: '800' }}>{discountPercent}% OFF!</Text>
            </View>
          </View>
          <Text style={{ fontSize: 10.5, color: '#03A685', fontWeight: '700', marginTop: -4 }}>Inclusive of all taxes</Text>

          {/* EORS Mega Deal Box */}
          <View style={{ marginTop: 12, borderWidth: 1, borderColor: '#FCE7F3', borderRadius: 8, padding: 12, backgroundColor: '#FFF5F7', gap: 8 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <View style={{ backgroundColor: '#FF3F6C', borderRadius: 4, paddingHorizontal: 4, paddingVertical: 2 }}>
                  <Text style={{ color: '#FFFFFF', fontSize: 8, fontWeight: '900' }}>MEGA DEAL</Text>
                </View>
                <Text style={{ fontSize: 13, color: '#282C3F', fontWeight: '600' }}>
                  Get at <Text style={{ textDecorationLine: 'underline', fontWeight: '800' }}>Rs. {Math.round(product.price * 0.63)}</Text>
                </Text>
              </View>
              <View style={{ backgroundColor: '#03A685', borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2 }}>
                <Text style={{ color: '#FFFFFF', fontSize: 10, fontWeight: '800' }}>Extra Rs. {Math.round(product.price * 0.37)} Off</Text>
              </View>
            </View>
            <View style={{ height: 1, backgroundColor: '#FCE7F3' }} />
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <Text style={{ fontSize: 10.5, color: '#7E8190', fontWeight: '500' }}>With Coupon + Bank Offer</Text>
              <Text style={{ fontSize: 10.5, color: '#FF3F6C', fontWeight: '800' }}>Details &gt;</Text>
            </View>
          </View>
        </View>

        {/* Color Selector */}
        <View style={{ padding: 16, borderBottomWidth: 1, borderColor: '#EAEAEC', gap: 10 }}>
          <Text style={{ fontSize: 13, fontWeight: '800', color: '#282C3F' }}>Colour <Text style={{ color: '#7E8190', fontWeight: '500' }}>Black</Text></Text>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <View style={{ width: 60, height: 74, borderRadius: 8, borderWidth: 1.5, borderColor: '#FF3F6C', overflow: 'hidden', padding: 2 }}>
              <Image source={{ uri: product.category.toLowerCase() === 'footwear' ? 'https://images.unsplash.com/photo-1603808033192-082d6919d3e1?auto=format&fit=crop&w=150&q=80' : product.image }} contentFit="cover" style={{ width: '100%', height: '100%', borderRadius: 6 }} />
            </View>
            <View style={{ width: 60, height: 74, borderRadius: 8, borderWidth: 1, borderColor: '#EAEAEC', overflow: 'hidden', opacity: 0.7 }}>
              <Image source={{ uri: product.category.toLowerCase() === 'footwear' ? 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=150&q=80' : 'https://images.unsplash.com/photo-1603808033192-082d6919d3e1?w=200&q=80' }} contentFit="cover" style={{ width: '100%', height: '100%', borderRadius: 6 }} />
            </View>
            <View style={{ width: 60, height: 74, borderRadius: 8, borderWidth: 1, borderColor: '#EAEAEC', overflow: 'hidden', opacity: 0.7 }}>
              <Image source={{ uri: product.category.toLowerCase() === 'footwear' ? 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=150&q=80' : 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&q=80' }} contentFit="cover" style={{ width: '100%', height: '100%', borderRadius: 6 }} />
            </View>
          </View>
        </View>

        {/* Size Selector */}
        <View style={{ padding: 16, borderBottomWidth: 1, borderColor: '#EAEAEC', gap: 12 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ fontSize: 13, fontWeight: '900', color: '#282C3F' }}>Select Size (UK Size)</Text>
            <Text style={{ fontSize: 12, fontWeight: '800', color: '#FF3F6C' }}>Size Chart &gt;</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12, paddingVertical: 4 }}>
            {displaySizes.map((sz) => {
              const isSelected = selectedSize === sz.value;
              const isAvailable = sz.available;
              return (
                <View key={sz.value} style={{ alignItems: 'center', gap: 6 }}>
                  <Pressable
                    disabled={!isAvailable}
                    onPress={() => setSelectedSize(sz.value)}
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 14,
                      borderWidth: 1,
                      borderColor: isSelected ? '#FF3F6C' : '#EAEAEC',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: isSelected ? '#FFF0F2' : '#FFFFFF',
                      position: 'relative',
                      overflow: 'hidden',
                      opacity: isAvailable ? 1 : 0.4,
                    }}
                  >
                    <Text style={{ fontSize: 13, fontWeight: '800', color: isSelected ? '#FF3F6C' : '#282C3F' }}>
                      {sz.value}
                    </Text>
                    {!isAvailable && (
                      <View style={{ position: 'absolute', width: 60, height: 1.5, backgroundColor: '#7E8190', transform: [{ rotate: '-45deg' }] }} />
                    )}
                  </Pressable>
                  {sz.label && (
                    <Text style={{ fontSize: 10, color: '#D97706', fontWeight: '700' }}>{sz.label}</Text>
                  )}
                </View>
              );
            })}
          </ScrollView>
        </View>

        {/* Inline Add to Bag Button to match screenshot 1 exactly */}
        <Pressable
          onPress={isInBag ? () => router.push('/shopping-checkout') : handleAddToBag}
          style={{
            marginHorizontal: 16,
            marginVertical: 12,
            height: 48,
            borderRadius: 8,
            backgroundColor: '#FF3F6C',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8
          }}
        >
          <MaterialCommunityIcons name="shopping-outline" size={20} color="#FFFFFF" />
          <Text style={{ fontSize: 13, fontWeight: '900', color: '#FFFFFF' }}>
            {isInBag ? 'GO TO BAG' : 'ADD TO BAG'}
          </Text>
        </Pressable>

        {/* Specifications Block */}
        <View style={styles.specsSection}>
          <Text style={styles.sectionTitle}>Product Specifications</Text>
          <View style={styles.specsGrid}>
            <View style={styles.specItem}>
              <Text style={styles.specLabel}>Fabric</Text>
              <Text style={styles.specValue}>{product.category === 'Footwear' ? 'Synthetic Leather' : '100% Cotton'}</Text>
            </View>
            <View style={styles.specItem}>
              <Text style={styles.specLabel}>{product.category === 'Footwear' ? 'Sole Material' : 'Fit'}</Text>
              <Text style={styles.specValue}>{product.category === 'Footwear' ? 'Rubber / EVA Cushion' : 'Regular Fit'}</Text>
            </View>
            <View style={styles.specItem}>
              <Text style={styles.specLabel}>Main Trend</Text>
              <Text style={styles.specValue}>New Basics</Text>
            </View>
            <View style={styles.specItem}>
              <Text style={styles.specLabel}>Care</Text>
              <Text style={styles.specValue}>Machine Wash</Text>
            </View>
          </View>
        </View>

        {/* Delivery & Services Block */}
        <View style={{ padding: 16, borderBottomWidth: 1, borderColor: '#EAEAEC', gap: 12 }}>
          <Text style={{ fontSize: 13, fontWeight: '900', color: '#282C3F' }}>Delivery & Services</Text>
          
          {/* Pincode display row */}
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 8, paddingHorizontal: 12, height: 44, backgroundColor: '#FFFFFF' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <MaterialCommunityIcons name="map-marker-outline" size={20} color="#7E8190" />
              <Text style={{ fontSize: 13, fontWeight: '800', color: '#282C3F' }}>131029</Text>
            </View>
            <Text style={{ fontSize: 12, fontWeight: '900', color: '#FF3F6C', textDecorationLine: 'underline' }}>Change</Text>
          </View>

          {/* Shipping Estimates Box */}
          <View style={{ borderWidth: 1, borderColor: '#FFF0F2', borderRadius: 8, padding: 12, backgroundColor: '#FFF5F7', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 }}>
              <View style={{ backgroundColor: '#FF3F6C', borderRadius: 10, width: 20, height: 20, alignItems: 'center', justifyContent: 'center' }}>
                <MaterialCommunityIcons name="check" size={12} color="#FFFFFF" />
              </View>
              <View style={{ gap: 2, flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <MaterialCommunityIcons name="truck-delivery-outline" size={14} color="#282C3F" />
                  <Text style={{ fontSize: 10.5, fontWeight: '900', color: '#282C3F' }}>STANDARD</Text>
                </View>
                <Text style={{ fontSize: 12, fontWeight: '800', color: '#282C3F' }}>Delivery between 15 June - 17 June</Text>
              </View>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={{ fontSize: 10, color: '#7E8190', textDecorationLine: 'line-through' }}>MRP Rs. {product.originalPrice.toLocaleString('en-IN')}</Text>
              <Text style={{ fontSize: 10.5, color: '#03A685', fontWeight: '800' }}>Rs. {product.price.toLocaleString('en-IN')} ({discountPercent}% OFF)</Text>
            </View>
          </View>

          {/* COD and Return list */}
          <View style={{ gap: 8, marginTop: 4 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <View style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: '#E4F4F3', alignItems: 'center', justifyContent: 'center' }}>
                <MaterialCommunityIcons name="check" size={12} color="#14958F" />
              </View>
              <View>
                <Text style={{ fontSize: 13, fontWeight: '800', color: '#282C3F' }}>Pay on Delivery is available</Text>
                <Text style={{ fontSize: 10.5, color: '#7E8190', fontWeight: '500' }}>Rs. 10 additional fee applicable</Text>
              </View>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <View style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: '#E4F4F3', alignItems: 'center', justifyContent: 'center' }}>
                <MaterialCommunityIcons name="check" size={12} color="#14958F" />
              </View>
              <Text style={{ fontSize: 13, fontWeight: '800', color: '#282C3F' }}>Hassle free 7 days Return & Exchange</Text>
            </View>
          </View>
        </View>

        {/* --- RATINGS & REVIEWS SECTION --- */}
        <View style={styles.reviewsSection}>
          <Text style={styles.sectionTitle}>Ratings & Reviews</Text>
          
          <View style={styles.ratingBreakdownRow}>
            {/* Left Column: Huge Number */}
            <View style={styles.ratingLeft}>
              <View style={styles.ratingGiantRow}>
                <Text style={styles.ratingGiantText}>{calculatedRatings.averageRating.toFixed(1)}</Text>
                <MaterialCommunityIcons name="star" size={28} color={brandColors.starGold} />
              </View>
              <Text style={styles.ratingSubGiant}>
                {calculatedRatings.totalCount >= 1000 ? `${(calculatedRatings.totalCount / 1000).toFixed(1)}k` : calculatedRatings.totalCount} Verified buyers
              </Text>
            </View>

            {/* Middle Divider */}
            <View style={styles.reviewsDivider} />

            {/* Right Column: Bars */}
            <View style={styles.ratingRight}>
              {[5, 4, 3, 2, 1].map((star) => {
                const count = calculatedRatings.distribution[star as 5 | 4 | 3 | 2 | 1] || 0;
                const percentage = calculatedRatings.totalCount > 0 ? (count / calculatedRatings.totalCount) * 100 : 0;
                return (
                  <View key={star} style={styles.starProgressRow}>
                    <Text style={styles.starProgressLabel}>{star} ★</Text>
                    <View style={styles.starProgressBarBg}>
                      <View 
                        style={[
                          styles.starProgressBarFill, 
                          { 
                            width: `${percentage}%`,
                            backgroundColor: star >= 4 ? brandColors.ratingGreen : star === 3 ? brandColors.starGold : brandColors.myntraPink
                          }
                        ]} 
                      />
                    </View>
                    <Text style={styles.starProgressCount}>{count}</Text>
                  </View>
                );
              })}
            </View>
          </View>

          {/* Customer Reviews Photos Grid */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10, paddingVertical: 4 }}>
            <View style={{ width: 70, height: 70, borderRadius: 8, overflow: 'hidden', position: 'relative' }}>
              <Image source={{ uri: product.image }} style={{ width: '100%', height: '100%' }} contentFit="cover" />
              <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.2)', alignItems: 'center', justifyContent: 'center' }}>
                <MaterialCommunityIcons name="play-circle" size={24} color="#FFFFFF" />
              </View>
              <Text style={{ position: 'absolute', bottom: 4, right: 4, color: '#FFFFFF', fontSize: 8, fontWeight: '800' }}>0:06</Text>
            </View>
            <View style={{ width: 70, height: 70, borderRadius: 8, overflow: 'hidden' }}>
              <Image source={{ uri: 'https://images.unsplash.com/photo-1603808033192-082d6919d3e1?w=200&q=80' }} style={{ width: '100%', height: '100%' }} contentFit="cover" />
            </View>
            <View style={{ width: 70, height: 70, borderRadius: 8, overflow: 'hidden' }}>
              <Image source={{ uri: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&q=80' }} style={{ width: '100%', height: '100%' }} contentFit="cover" />
            </View>
            <View style={{ width: 70, height: 70, borderRadius: 8, overflow: 'hidden', position: 'relative' }}>
              <Image source={{ uri: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&q=80' }} style={{ width: '100%', height: '100%' }} contentFit="cover" />
              <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '800' }}>+3</Text>
              </View>
            </View>
          </ScrollView>

          {/* Customer Reviews List */}
          <View style={styles.reviewsList}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={styles.reviewsListTitle}>Customer Reviews ({reviews.length + 1})</Text>
              <Text style={{ fontSize: 12, fontWeight: '800', color: '#FF3F6C' }}>View All</Text>
            </View>

            {/* Hardcoded EXACT Review to match screenshot */}
            <View style={styles.reviewItem}>
              <View style={styles.reviewHeader}>
                <View style={[styles.starBadge, { backgroundColor: brandColors.ratingGreen }]}>
                  <Text style={styles.starBadgeText}>4 ★</Text>
                </View>
                <Text style={styles.reviewerName}>s. pathak</Text>
                <View style={styles.verifiedBadge}>
                  <MaterialCommunityIcons name="check-decagram" size={12} color={brandColors.ratingGreen} />
                  <Text style={styles.verifiedText}>Verified Buyer</Text>
                </View>
                <Text style={styles.reviewDate}>Oct 03, 2025</Text>
              </View>
              <View style={{ backgroundColor: '#F5F5F6', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, alignSelf: 'flex-start', marginTop: 4 }}>
                <Text style={{ fontSize: 10, color: '#282C3F', fontWeight: '700' }}>Size: 6</Text>
              </View>
              <Text style={styles.reviewText}>
                Size chart is smaller by one number. Product quantity is good. I recommend all to... <Text style={{ color: '#FF3F6C', fontWeight: '800' }}>read more</Text>
              </Text>
            </View>

            {reviews.map((rev) => (
              <View key={rev.id} style={styles.reviewItem}>
                <View style={styles.reviewHeader}>
                  <View style={[styles.starBadge, { backgroundColor: rev.rating >= 4 ? brandColors.ratingGreen : rev.rating === 3 ? brandColors.starGold : brandColors.myntraPink }]}>
                    <Text style={styles.starBadgeText}>{rev.rating} ★</Text>
                  </View>
                  <Text style={styles.reviewerName}>{rev.name}</Text>
                  <View style={styles.verifiedBadge}>
                    <MaterialCommunityIcons name="check-decagram" size={12} color={brandColors.ratingGreen} />
                    <Text style={styles.verifiedText}>Verified Buyer</Text>
                  </View>
                  <Text style={styles.reviewDate}>{rev.date}</Text>
                </View>
                
                <Text style={styles.reviewText}>{rev.comment}</Text>
                
                {/* Helpful voting */}
                <View style={styles.reviewFooter}>
                  <Text style={styles.helpfulQuestion}>Was this helpful?</Text>
                  <Pressable 
                    onPress={() => handleVoteHelpful(rev.id, true)} 
                    style={[styles.helpfulBtn, rev.userVoted === 'helpful' ? styles.helpfulBtnActive : null]}
                  >
                    <MaterialCommunityIcons name="thumb-up-outline" size={14} color={rev.userVoted === 'helpful' ? brandColors.myntraPink : brandColors.grayText} />
                    <Text style={[styles.helpfulCountText, rev.userVoted === 'helpful' ? styles.helpfulCountTextActive : null]}>
                      ({rev.helpfulCount})
                    </Text>
                  </Pressable>
                  <Pressable 
                    onPress={() => handleVoteHelpful(rev.id, false)} 
                    style={[styles.helpfulBtn, rev.userVoted === 'unhelpful' ? styles.helpfulBtnActive : null]}
                  >
                    <MaterialCommunityIcons name="thumb-down-outline" size={14} color={rev.userVoted === 'unhelpful' ? brandColors.myntraPink : brandColors.grayText} />
                    <Text style={[styles.helpfulCountText, rev.userVoted === 'unhelpful' ? styles.helpfulCountTextActive : null]}>
                      ({rev.unhelpfulCount})
                    </Text>
                  </Pressable>
                </View>
              </View>
            ))}
          </View>

          {/* Trust Badges Row */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingVertical: 16, borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#EAEAEC', marginTop: 12 }}>
            {/* Genuine Badge */}
            <View style={{ alignItems: 'center', gap: 6, flex: 1 }}>
              <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: '#FFF0F2', borderStyle: 'dashed', borderWidth: 1, borderColor: '#FF3F6C', alignItems: 'center', justifyContent: 'center' }}>
                <MaterialCommunityIcons name="security" size={20} color="#FF3F6C" />
              </View>
              <Text style={{ fontSize: 10.5, fontWeight: '800', color: '#282C3F', textAlign: 'center' }}>Genuine Product</Text>
            </View>

            {/* Quality Badge */}
            <View style={{ alignItems: 'center', gap: 6, flex: 1 }}>
              <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: '#E4F4F3', borderStyle: 'dashed', borderWidth: 1, borderColor: '#14958F', alignItems: 'center', justifyContent: 'center' }}>
                <MaterialCommunityIcons name="check-decagram" size={20} color="#14958F" />
              </View>
              <Text style={{ fontSize: 10.5, fontWeight: '800', color: '#282C3F', textAlign: 'center' }}>Quality Checked</Text>
            </View>
          </View>

          {/* More Information */}
          <View style={{ paddingVertical: 8, gap: 4 }}>
            <Text style={{ fontSize: 10.5, color: '#9496A2', fontWeight: '600' }}>Product Code: 34131940</Text>
            <Text style={{ fontSize: 12, color: '#FF3F6C', fontWeight: '800' }}>View More</Text>
          </View>

          {/* Write a Review Button */}
          <Pressable 
            onPress={() => setIsReviewModalVisible(true)} 
            style={styles.writeReviewBtn}
          >
            <MaterialCommunityIcons name="square-edit-outline" size={18} color={brandColors.myntraPink} />
            <Text style={styles.writeReviewText}>WRITE A REVIEW</Text>
          </Pressable>
        </View>

        {/* --- SIMILAR PRODUCTS / YOU MAY ALSO LIKE SECTION --- */}
        <View style={styles.similarSection}>
          <Text style={styles.sectionTitle}>Similar Products</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            contentContainerStyle={styles.similarScroll}
          >
            {similarProducts.map((item) => {
              const itemDiscount = Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100);
              return (
                <Pressable 
                  key={item.id}
                  onPress={() => setSelectedProduct(item.id)}
                  style={[styles.similarCard, { width: 150 }]}
                >
                  <View style={styles.similarImageContainer}>
                    <Image source={{ uri: item.image }} contentFit="contain" style={styles.similarImage} />
                    {/* Floating star rating badge */}
                    <View style={{ position: 'absolute', bottom: 4, left: 4, backgroundColor: 'rgba(255, 255, 255, 0.95)', borderRadius: 10, paddingHorizontal: 6, paddingVertical: 2, flexDirection: 'row', alignItems: 'center', gap: 2, borderWidth: 0.5, borderColor: '#EAEAEC' }}>
                      <Text style={{ fontSize: 9, fontWeight: '900', color: '#282C3F' }}>{item.rating || '3.9'}</Text>
                      <MaterialCommunityIcons name="star" size={10} color="#14958F" />
                    </View>
                  </View>
                  <View style={styles.similarInfo}>
                    <Text style={styles.similarBrand} numberOfLines={1}>{item.brand}</Text>
                    <Text style={styles.similarName} numberOfLines={1}>{item.name}</Text>
                    <View style={styles.similarPriceRow}>
                      <Text style={styles.similarPrice}>₹{item.price.toLocaleString('en-IN')}</Text>
                      <Text style={styles.similarOriginalPrice}>₹{item.originalPrice.toLocaleString('en-IN')}</Text>
                    </View>
                    <Text style={styles.similarDiscount}>{itemDiscount}% OFF</Text>
                    
                    {/* Add to Bag Button */}
                    <Pressable
                      onPress={(e) => {
                        e.stopPropagation();
                        addProduct(item);
                        Alert.alert('Added to Bag', `${item.name} has been added to your cart.`);
                      }}
                      style={{ borderWidth: 1, borderColor: '#FF3F6C', borderRadius: 4, height: 28, alignItems: 'center', justifyContent: 'center', marginTop: 6 }}
                    >
                      <Text style={{ color: '#FF3F6C', fontSize: 10, fontWeight: '900' }}>Add to Bag</Text>
                    </Pressable>
                  </View>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {/* --- STYLING IDEAS FROM STUDIO --- */}
        <View style={{ paddingVertical: 16, paddingLeft: 16, gap: 12, backgroundColor: '#FFFFFF' }}>
          <Text style={{ fontSize: 13, fontWeight: '900', color: '#282C3F', textTransform: 'uppercase', letterSpacing: 0.5 }}>Styling Ideas from Studio</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12, paddingRight: 16 }}>
            <View style={{ width: 150, height: 220, borderRadius: 8, overflow: 'hidden', position: 'relative' }}>
              <Image source={{ uri: product.image }} style={{ width: '100%', height: '100%' }} contentFit="cover" />
              <LinearGradient colors={['transparent', 'rgba(0,0,0,0.6)']} style={StyleSheet.absoluteFill} />
              <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' }}>
                <MaterialCommunityIcons name="play-circle" size={32} color="#FFFFFF" />
              </View>
              <View style={{ position: 'absolute', top: 8, left: 8, backgroundColor: '#FFFFFF', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 }}>
                <Text style={{ color: '#FF7F00', fontSize: 8, fontWeight: '900' }}>GLAM CLAN</Text>
              </View>
            </View>

            <View style={{ width: 150, height: 220, borderRadius: 8, overflow: 'hidden', position: 'relative' }}>
              <Image source={{ uri: 'https://images.unsplash.com/photo-1603808033192-082d6919d3e1?w=200&q=80' }} style={{ width: '100%', height: '100%' }} contentFit="cover" />
              <LinearGradient colors={['transparent', 'rgba(0,0,0,0.6)']} style={StyleSheet.absoluteFill} />
              <View style={{ position: 'absolute', top: 8, left: 8, backgroundColor: '#FFFFFF', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 }}>
                <Text style={{ color: '#FF7F00', fontSize: 8, fontWeight: '900' }}>STUDIO FIT</Text>
              </View>
            </View>
          </ScrollView>
        </View>
      </ScreenShell>

      {/* Sticky Bottom Actions Bar */}
      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 72, backgroundColor: '#FFFFFF', borderTopWidth: 1, borderColor: '#EAEAEC', paddingHorizontal: 16, justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.05, shadowOffset: { width: 0, height: -3 }, shadowRadius: 3, elevation: 8 }}>
        <Pressable
          onPress={isInBag ? () => router.push('/shopping-checkout') : handleAddToBag}
          style={{ width: '100%', height: 48, borderRadius: 8, backgroundColor: '#FF3F6C', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 }}
        >
          <MaterialCommunityIcons name="shopping" size={20} color="#FFFFFF" />
          <Text style={{ fontSize: 13, fontWeight: '900', color: '#FFFFFF' }}>
            {isInBag ? 'GO TO BAG' : 'ADD TO BAG'}
          </Text>
        </Pressable>
      </View>

      {/* --- WRITE A REVIEW MODAL --- */}
      <Modal
        visible={isReviewModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsReviewModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Write a Review</Text>
              <Pressable onPress={() => setIsReviewModalVisible(false)} style={styles.closeBtn}>
                <MaterialCommunityIcons name="close" size={24} color={brandColors.myntraNavy} />
              </Pressable>
            </View>

            {/* Modal Body */}
            <ScrollView contentContainerStyle={styles.modalBody}>
              {/* Product Info Summary */}
              <View style={styles.modalProductCard}>
                <Image source={{ uri: product.image }} contentFit="contain" style={styles.modalProductImage} />
                <View style={styles.modalProductDetails}>
                  <Text style={styles.modalProductBrand}>{product.brand}</Text>
                  <Text style={styles.modalProductName} numberOfLines={1}>{product.name}</Text>
                </View>
              </View>

              {/* Star Rating Selection */}
              <Text style={styles.formLabel}>How would you rate this product?</Text>
              <View style={styles.starSelectRow}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Pressable key={star} onPress={() => setNewRating(star)} style={styles.starSelectBtn}>
                    <MaterialCommunityIcons 
                      name={star <= newRating ? 'star' : 'star-outline'} 
                      size={36} 
                      color={star <= newRating ? brandColors.starGold : brandColors.grayText} 
                    />
                  </Pressable>
                ))}
              </View>

              {/* User Name Input */}
              <Text style={styles.formLabel}>Your Name (Optional)</Text>
              <TextInput
                value={reviewerName}
                onChangeText={setReviewerName}
                placeholder="e.g. Priya M."
                placeholderTextColor="#A9ABB3"
                style={styles.formInput}
              />

              {/* User Review Description */}
              <Text style={styles.formLabel}>Review Comments (Required)</Text>
              <TextInput
                value={reviewComment}
                onChangeText={setReviewComment}
                placeholder="Tell us what you liked or disliked about this item..."
                placeholderTextColor="#A9ABB3"
                multiline={true}
                numberOfLines={4}
                style={[styles.formInput, styles.formInputTextarea]}
              />

              {/* Submit Button */}
              <Pressable onPress={handleReviewSubmit} style={styles.submitReviewBtn}>
                <Text style={styles.submitReviewText}>SUBMIT REVIEW</Text>
              </Pressable>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  shellContainer: {
    backgroundColor: '#FFFFFF',
    paddingBottom: 90, // Room for sticky footer
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderColor: brandColors.borderLight,
  },
  headerIconBtn: {
    padding: spacing.xs,
    position: 'relative',
  },
  headerTitleWrap: {
    flex: 1,
    marginLeft: spacing.md,
  },
  headerBrand: {
    fontSize: 13,
    fontWeight: '800',
    color: brandColors.myntraNavy,
  },
  headerCategory: {
    fontSize: 10.5,
    color: brandColors.grayText,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  badge: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: brandColors.myntraNavy,
    borderRadius: radius.pill,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  badgePink: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: brandColors.myntraPink,
    borderRadius: radius.pill,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
  },
  carouselContainer: {
    position: 'relative',
    height: 400,
    backgroundColor: brandColors.lightGray,
  },
  carouselSlide: {
    width: screenWidth,
    height: 400,
  },
  carouselImage: {
    width: '100%',
    height: '100%',
  },
  paginationRow: {
    position: 'absolute',
    bottom: spacing.md,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  paginationDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(40,44,63,0.3)',
  },
  paginationDotActive: {
    backgroundColor: brandColors.myntraPink,
    width: 14,
  },
  floatingRating: {
    position: 'absolute',
    bottom: spacing.md,
    left: spacing.md,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    borderRadius: 4,
    gap: 3,
    borderWidth: 1,
    borderColor: brandColors.borderLight,
  },
  ratingVal: {
    fontSize: 12,
    fontWeight: '800',
    color: brandColors.myntraNavy,
  },
  ratingDivider: {
    width: 1,
    height: 12,
    backgroundColor: brandColors.borderLight,
    marginHorizontal: 4,
  },
  ratingCount: {
    fontSize: 10.5,
    color: brandColors.grayText,
    fontWeight: '600',
  },
  detailsCard: {
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderColor: brandColors.borderLight,
    gap: spacing.xs,
  },
  brandTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: brandColors.myntraNavy,
    textTransform: 'uppercase',
  },
  productName: {
    fontSize: 13,
    color: brandColors.grayText,
    fontWeight: '500',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginTop: spacing.xs,
  },
  priceText: {
    fontSize: 18,
    fontWeight: '900',
    color: brandColors.myntraNavy,
  },
  originalPriceText: {
    fontSize: 16,
    color: '#9496A2',
    textDecorationLine: 'line-through',
    fontWeight: '600',
  },
  discountPercentText: {
    fontSize: 16,
    color: brandColors.myntraPink,
    fontWeight: '800',
  },
  taxLabel: {
    fontSize: 10.5,
    color: brandColors.discountGreen,
    fontWeight: '700',
  },
  sizeSection: {
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderColor: brandColors.borderLight,
    gap: spacing.md,
  },
  sizeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sizeSectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: brandColors.myntraNavy,
  },
  sizeChartLink: {
    fontSize: 12,
    fontWeight: '800',
    color: brandColors.myntraPink,
  },
  sizeSelectorRow: {
    gap: spacing.md,
    paddingVertical: 4,
  },
  sizeCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    borderWidth: 1,
    borderColor: brandColors.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  sizeCircleSelected: {
    borderColor: brandColors.myntraPink,
    backgroundColor: brandColors.lightPink,
  },
  sizeCircleText: {
    fontSize: 13,
    fontWeight: '800',
    color: brandColors.myntraNavy,
  },
  sizeCircleTextSelected: {
    color: brandColors.myntraPink,
  },
  specsSection: {
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderColor: brandColors.borderLight,
    gap: spacing.md,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: brandColors.myntraNavy,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  specsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: spacing.md,
  },
  specItem: {
    width: '50%',
    gap: 4,
  },
  specLabel: {
    fontSize: 10.5,
    color: '#9496A2',
    fontWeight: '600',
  },
  specValue: {
    fontSize: 13,
    color: brandColors.myntraNavy,
    fontWeight: '700',
  },
  deliveryCard: {
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderColor: brandColors.borderLight,
    gap: spacing.sm,
  },
  deliveryTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: brandColors.myntraNavy,
  },
  deliveryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: brandColors.lightGray,
    padding: spacing.md,
    borderRadius: 8,
  },
  deliveryBody: {
    flex: 1,
    fontSize: 12,
    color: '#535665',
    lineHeight: 18,
  },
  
  /* Reviews Section Styles */
  reviewsSection: {
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderColor: brandColors.borderLight,
    gap: spacing.lg,
  },
  ratingBreakdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  ratingLeft: {
    flex: 1.2,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  ratingGiantRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingGiantText: {
    fontSize: 38,
    fontWeight: '900',
    color: brandColors.myntraNavy,
  },
  ratingSubGiant: {
    fontSize: 10.5,
    color: brandColors.grayText,
    fontWeight: '600',
    textAlign: 'center',
  },
  reviewsDivider: {
    width: 1,
    height: 90,
    backgroundColor: brandColors.borderLight,
    marginHorizontal: spacing.md,
  },
  ratingRight: {
    flex: 2,
    gap: 5,
  },
  starProgressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  starProgressLabel: {
    fontSize: 10.5,
    fontWeight: '700',
    color: brandColors.myntraNavy,
    width: 24,
  },
  starProgressBarBg: {
    flex: 1,
    height: 6,
    backgroundColor: brandColors.lightGray,
    borderRadius: 3,
    overflow: 'hidden',
  },
  starProgressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  starProgressCount: {
    fontSize: 10,
    color: brandColors.grayText,
    fontWeight: '600',
    width: 28,
    textAlign: 'right',
  },
  reviewsList: {
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  reviewsListTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: brandColors.myntraNavy,
  },
  reviewItem: {
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderColor: brandColors.lightGray,
    gap: spacing.xs,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  starBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  starBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  reviewerName: {
    fontSize: 12,
    fontWeight: '800',
    color: brandColors.myntraNavy,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: brandColors.ratingGreenLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 12,
  },
  verifiedText: {
    color: brandColors.ratingGreen,
    fontSize: 9,
    fontWeight: '800',
  },
  reviewDate: {
    fontSize: 10,
    color: '#A9ABB3',
    marginLeft: 'auto',
  },
  reviewText: {
    fontSize: 13,
    color: '#282C3F',
    lineHeight: 18,
    marginVertical: 4,
  },
  reviewFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginTop: 4,
  },
  helpfulQuestion: {
    fontSize: 10.5,
    color: brandColors.grayText,
  },
  helpfulBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: brandColors.borderLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  helpfulBtnActive: {
    borderColor: brandColors.myntraPink,
    backgroundColor: brandColors.lightPink,
  },
  helpfulCountText: {
    fontSize: 10.5,
    color: brandColors.grayText,
    fontWeight: '600',
  },
  helpfulCountTextActive: {
    color: brandColors.myntraPink,
  },
  writeReviewBtn: {
    borderWidth: 1,
    borderColor: brandColors.myntraPink,
    borderRadius: 4,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 6,
    marginTop: spacing.sm,
  },
  writeReviewText: {
    color: brandColors.myntraPink,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
  },

  /* Similar Section Styles */
  similarSection: {
    paddingVertical: spacing.lg,
    paddingLeft: spacing.lg,
    gap: spacing.md,
    backgroundColor: '#FFFFFF',
  },
  similarScroll: {
    paddingRight: spacing.lg,
    gap: spacing.md,
  },
  similarCard: {
    width: 140,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: brandColors.borderLight,
    borderRadius: 8,
    overflow: 'hidden',
  },
  similarImageContainer: {
    height: 140,
    backgroundColor: brandColors.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  similarImage: {
    width: '90%',
    height: '90%',
  },
  similarInfo: {
    padding: spacing.sm,
    gap: 2,
  },
  similarBrand: {
    fontSize: 12,
    fontWeight: '800',
    color: brandColors.myntraNavy,
  },
  similarName: {
    fontSize: 10.5,
    color: brandColors.grayText,
  },
  similarPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  similarPrice: {
    fontSize: 12,
    fontWeight: '800',
    color: brandColors.myntraNavy,
  },
  similarOriginalPrice: {
    fontSize: 10,
    color: '#9496A2',
    textDecorationLine: 'line-through',
  },
  similarDiscount: {
    fontSize: 9,
    color: brandColors.myntraPink,
    fontWeight: '800',
  },

  /* Bottom Actions Bar */
  bottomActionBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 72,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderColor: brandColors.borderLight,
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    alignItems: 'center',
    gap: spacing.md,
    elevation: 8,
    shadowColor: '#000000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: -3 },
    shadowRadius: 4,
  },
  wishlistActionBtn: {
    flex: 1,
    height: 46,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: brandColors.borderLight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  wishlistActionBtnSaved: {
    backgroundColor: brandColors.myntraNavy,
    borderColor: brandColors.myntraNavy,
  },
  wishlistActionText: {
    fontSize: 13,
    fontWeight: '800',
    color: brandColors.myntraNavy,
  },
  wishlistActionTextSaved: {
    color: '#FFFFFF',
  },
  bagActionBtn: {
    flex: 1.3,
    height: 46,
    borderRadius: 6,
    backgroundColor: brandColors.myntraPink,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  bagActionText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  /* Write Review Modal Styles */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '85%',
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderColor: brandColors.borderLight,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: brandColors.myntraNavy,
  },
  closeBtn: {
    padding: spacing.xs,
  },
  modalBody: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  modalProductCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: brandColors.lightGray,
    padding: spacing.md,
    borderRadius: 8,
  },
  modalProductImage: {
    width: 50,
    height: 50,
    borderRadius: 4,
  },
  modalProductDetails: {
    flex: 1,
  },
  modalProductBrand: {
    fontSize: 12,
    fontWeight: '800',
    color: brandColors.myntraNavy,
  },
  modalProductName: {
    fontSize: 12,
    color: brandColors.grayText,
  },
  formLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: brandColors.myntraNavy,
    marginTop: spacing.xs,
  },
  starSelectRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginVertical: spacing.xs,
  },
  starSelectBtn: {
    padding: 4,
  },
  formInput: {
    borderWidth: 1,
    borderColor: brandColors.borderLight,
    borderRadius: 6,
    paddingHorizontal: spacing.md,
    height: 44,
    color: brandColors.myntraNavy,
    fontSize: 13,
  },
  formInputTextarea: {
    height: 100,
    textAlignVertical: 'top',
    paddingVertical: spacing.sm,
  },
  submitReviewBtn: {
    backgroundColor: brandColors.myntraPink,
    height: 48,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.md,
  },
  submitReviewText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});
