import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { useApp } from '@/src/context/app-context';
import { useSuperAppStore } from '@/src/store/super-app-store';
import { colors, radius, spacing, typography, shadow } from '@/src/theme/tokens';
import { SharedHeader, SharedTabBar, BannerCarousel, BrandCard } from '@/src/components/shopping-module/ecosystem';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Premium local data mapping to products for full interactivity
const curatedBrowsing = [
  {
    id: 'prod-1',
    title: 'Miss Chase Red Crop Top',
    brand: 'Miss Chase',
    price: 649,
    originalPrice: 1499,
    priceDrop: '▼ ₹150 Price Drop',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=400&q=80',
    discount: '56% OFF',
    category: 'Fashion',
  },
  {
    id: 'prod-3',
    title: 'Berrylush Floral Print A-Line Dress',
    brand: 'Berrylush',
    price: 799,
    originalPrice: 1999,
    priceDrop: '▼ ₹300 Price Drop',
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=400&q=80',
    discount: '60% OFF',
    category: 'Fashion',
  },
  {
    id: 'prod-4',
    title: 'Lino Perros Leather Handbag',
    brand: 'Lino Perros',
    price: 1299,
    originalPrice: 3999,
    priceDrop: '▼ ₹500 Price Drop',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=400&q=80',
    discount: '67% OFF',
    category: 'Fashion',
  },
  {
    id: 'prod-b1',
    title: 'Tinted Sunscreen Gel SPF 50',
    brand: 'Lakme',
    price: 185,
    originalPrice: 395,
    priceDrop: '▼ ₹50 Price Drop',
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=400&q=80',
    discount: '53% OFF',
    category: 'Beauty',
  },
  {
    id: 'prod-b5',
    title: 'Rosemary Hair Essential Oil',
    brand: 'Soulflower',
    price: 599,
    originalPrice: 650,
    priceDrop: '▼ ₹30 Price Drop',
    image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=400&q=80',
    discount: '8% OFF',
    category: 'Beauty',
  },
  {
    id: 'prod-k1',
    title: 'Boys Cotton Play T-Shirt',
    brand: 'H&M',
    price: 399,
    originalPrice: 799,
    priceDrop: '▼ ₹100 Price Drop',
    image: 'https://images.unsplash.com/photo-1519457431-44cacac7a15a?auto=format&fit=crop&w=400&q=80',
    discount: '50% OFF',
    category: 'Kids',
  },
];

const featuredBrands = [
  {
    id: 'brand-veromoda',
    name: 'Vero Moda',
    deal: 'FLAT 60% OFF',
    tagline: 'Premium European Styles',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=600&q=80',
    productId: 'prod-1',
  },
  {
    id: 'brand-nike',
    name: 'Nike',
    deal: 'MIN 40% OFF',
    tagline: 'Performance & Streetwear Classics',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80',
    productId: 'prod-3',
  },
  {
    id: 'brand-luma',
    name: 'Luma Skin',
    deal: 'FLAT 40% OFF',
    tagline: 'Organic Hydrating Serums',
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=600&q=80',
    productId: 'prod-4',
  },
  {
    id: 'brand-roadster',
    name: 'Roadster',
    deal: 'MIN 55% OFF',
    tagline: 'Urban Outdoor Apparel',
    image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=600&q=80',
    productId: 'prod-1',
  },
];

const unmissableDeals = [
  {
    id: 'deal-kurta',
    title: 'Anubhutee Kurta Sets',
    price: 'Under ₹599',
    discount: '70% OFF',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=400&q=80',
    productId: 'prod-4',
  },
  {
    id: 'deal-handbag',
    title: 'Baggit Handbags',
    price: 'Under ₹799',
    discount: '65% OFF',
    image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=400&q=80',
    productId: 'prod-1',
  },
  {
    id: 'deal-dress',
    title: 'Harpa Dresses',
    price: 'Under ₹499',
    discount: '75% OFF',
    image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=400&q=80',
    productId: 'prod-3',
  },
  {
    id: 'deal-activewear',
    title: 'Puma Sportswear',
    price: 'Under ₹999',
    discount: '55% OFF',
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=400&q=80',
    productId: 'prod-3',
  },
  {
    id: 'deal-beauty',
    title: 'Lakme Face Care',
    price: 'Under ₹299',
    discount: '50% OFF',
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=400&q=80',
    productId: 'prod-b1',
  },
  {
    id: 'deal-kids',
    title: 'H&M Play Shirts',
    price: 'Under ₹399',
    discount: '50% OFF',
    image: 'https://images.unsplash.com/photo-1519457431-44cacac7a15a?auto=format&fit=crop&w=400&q=80',
    productId: 'prod-k1',
  },
];

const homeBanners = [
  {
    id: 'home-banner-1',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80',
    title: 'END OF REASON SALE IS LIVE',
    subtitle: '50% - 80% OFF on all top global brands',
    deal: 'SALE IS LIVE',
    productId: 'prod-1',
  },
  {
    id: 'home-banner-2',
    image: 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&w=1200&q=80',
    title: 'STYLE UNLIMITED UNDER ₹499',
    subtitle: 'T-shirts, dresses, footwear & more',
    deal: 'UNDER ₹499',
    productId: 'prod-3',
  },
  {
    id: 'home-banner-3',
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=1200&q=80',
    title: 'THE BEAUTY SPECIAL',
    subtitle: 'Flat 40% OFF on premium skincare & cosmetics',
    deal: 'FLAT 40% OFF',
    productId: 'prod-4',
  },
  {
    id: 'home-banner-4',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80',
    title: 'GENTS SMART FIT SHIRTS',
    subtitle: 'Crisp casuals & formal linen starts ₹699',
    deal: 'MIN 50% OFF',
    productId: 'prod-1',
  },
  {
    id: 'home-banner-5',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1200&q=80',
    title: 'SUMMER BRUSH MAJESTY',
    subtitle: 'Lightweight flowy midi & maxi wear starting ₹899',
    deal: 'FLAT 60% OFF',
    productId: 'prod-3',
  },
  {
    id: 'home-banner-6',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80',
    title: 'HOME MAKEOVER CARNIVAL',
    subtitle: 'Bedsheets, curtains & organic cushions flat 50% off',
    deal: 'FLAT 50% OFF',
    productId: 'prod-h1',
  },
];

const homeBrands = [
  { name: 'Vero Moda', offer: 'FLAT 50% OFF', logo: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=100&q=80', image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=400&q=80', productId: 'prod-1' },
  { name: 'Nike', offer: 'MIN 40% OFF', logo: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=100&q=80', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=400&q=80', productId: 'prod-3' },
  { name: 'Berrylush', offer: 'FLAT 60% OFF', logo: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=100&q=80', image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=400&q=80', productId: 'prod-3' },
  { name: 'Luma Skin', offer: 'FLAT 40% OFF', logo: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=100&q=80', image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=400&q=80', productId: 'prod-4' },
  { name: 'Puma', offer: 'MIN 50% OFF', logo: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=100&q=80', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=400&q=80', productId: 'prod-3' },
  { name: 'Roadster', offer: 'FLAT 55% OFF', logo: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=100&q=80', image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=400&q=80', productId: 'prod-1' },
  { name: 'H&M', offer: 'UP TO 50% OFF', logo: 'https://images.unsplash.com/photo-1519457431-44cacac7a15a?auto=format&fit=crop&w=100&q=80', image: 'https://images.unsplash.com/photo-1519457431-44cacac7a15a?auto=format&fit=crop&w=400&q=80', productId: 'prod-k1' },
  { name: 'Biba', offer: 'MIN 40% OFF', logo: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=100&q=80', image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=400&q=80', productId: 'prod-4' },
];

const categoryCircles = [
  { label: 'Men', image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=150&q=80' },
  { label: 'Women', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80' },
  { label: 'Kids', image: 'https://images.unsplash.com/photo-1519457431-44cacac7a15a?auto=format&fit=crop&w=150&q=80' },
  { label: 'Beauty', image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=150&q=80' },
  { label: 'Home Living', image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=150&q=80' },
  { label: 'Footwear', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=150&q=80' },
  { label: 'Accessories', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=150&q=80' },
  { label: 'Jewellery', image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=150&q=80' },
  { label: 'Bags', image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=150&q=80' },
  { label: 'Smart Gadgets', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=150&q=80' },
  { label: 'Luxe Couture', image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=150&q=80' },
  { label: 'Active Wear', image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=150&q=80' },
  { label: 'Ethnic Wear', image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=150&q=80' },
  { label: 'Watches', image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=150&q=80' },
  { label: 'Sunglasses', image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=150&q=80' },
  { label: 'Winter Wear', image: 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&w=150&q=80' },
];

const bankOffers = [
  { code: 'SBI10', title: '10% Instant Discount', desc: 'On SBI Credit Cards. Min spend ₹2,999', icon: 'card-bulleted-outline', color: '#FFF2F2', textColor: '#FF3F6C' },
  { code: 'HDFCFWD', title: 'Flat ₹500 Cashback', desc: 'On HDFC EasyShop Cards. Min spend ₹4,999', icon: 'wallet-giftcard', color: '#EEF2FF', textColor: '#3B82F6' },
  { code: 'FREEGOZY', title: 'Free Delivery + Gift', desc: 'On your 1st Gozy Shopping order', icon: 'gift-outline', color: '#ECFDF5', textColor: '#10B981' },
  { code: 'AXIS15', title: '15% Cashback Up to ₹750', desc: 'On Axis Bank Debit Cards. Min ₹1,999', icon: 'bank-outline', color: '#FFF7ED', textColor: '#EA580C' },
  { code: 'ICICI20', title: 'Extra 20% OFF', desc: 'ICICI Credit Cards. No minimum order', icon: 'credit-card-outline', color: '#F5F3FF', textColor: '#7C3AED' },
  { code: 'PAYTM', title: '₹200 Cashback', desc: 'Pay via Paytm UPI on orders ₹999+', icon: 'cellphone-nfc', color: '#F0FDFA', textColor: '#0D9488' },
];

const dailyDeals = [
  { brand: 'Roadster', item: 'T-Shirts & Jeans', offer: 'Flat 60% OFF', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=200&q=80', productId: 'prod-1' },
  { brand: 'Nike', item: 'Sneakers & Tees', offer: 'Min 40% OFF', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=200&q=80', productId: 'prod-3' },
  { brand: 'Berrylush', item: 'Dresses & Tops', offer: 'Flat 65% OFF', image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=200&q=80', productId: 'prod-3' },
  { brand: 'Luma Skin', item: 'Skincare Serums', offer: 'Flat 40% OFF', image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=200&q=80', productId: 'prod-4' },
  { brand: 'Lakme', item: 'Cosmetic Range', offer: 'Up to 55% OFF', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=200&q=80', productId: 'prod-b1' },
  { brand: 'H&M Kids', item: 'Playwear Sets', offer: 'Flat 50% OFF', image: 'https://images.unsplash.com/photo-1519457431-44cacac7a15a?auto=format&fit=crop&w=200&q=80', productId: 'prod-k1' },
  { brand: 'Baggit', item: 'Handbags & Packs', offer: 'Min 60% OFF', image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=200&q=80', productId: 'prod-1' },
  { brand: 'Home Centre', item: 'Sheets & Pillows', offer: 'Flat 45% OFF', image: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=200&q=80', productId: 'prod-h1' },
  { brand: 'Puma', item: 'Sports Collection', offer: 'Up to 55% OFF', image: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=200&q=80', productId: 'prod-3' },
  { brand: 'Miss Chase', item: 'Party Wear Edit', offer: 'Flat 70% OFF', image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=200&q=80', productId: 'prod-1' },
];

const closetEssentials = [
  { title: 'The Denim Edit', tag: 'Durable & Classic Fits', image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=600&q=80', productId: 'prod-1' },
  { title: 'Breezy Linen Shirts', tag: 'Soft Pastel Hues', image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=600&q=80', productId: 'prod-1' },
  { title: 'Active Footwear Hub', tag: 'Sports Cushioned Shoes', image: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=600&q=80', productId: 'prod-3' },
  { title: 'Ethnic Festive Wear', tag: 'Kurtas, Sarees & More', image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80', productId: 'prod-4' },
  { title: 'Premium Watches', tag: 'From ₹999 Onwards', image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=600&q=80', productId: 'prod-1' },
  { title: 'Skincare Favourites', tag: 'Hydration & Glow', image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=600&q=80', productId: 'prod-b1' },
];

export default function ShoppingScreen() {
  const { products, walletBalance } = useApp();
  const { shoppingCart, setSelectedProduct, toggleWishlist, wishlist } = useSuperAppStore();

  const [showSplash, setShowSplash] = useState(true);
  const [selectedGender, setSelectedGender] = useState<'ALL' | 'MEN' | 'WOMEN' | 'KIDS'>('ALL');
  
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Cinematic splash sequence
  useEffect(() => {
    const timer = setTimeout(() => {
      handleDismissSplash();
    }, 2800);

    return () => clearTimeout(timer);
  }, []);

  // Pulsing EORS highlight text animation
  useEffect(() => {
    if (showSplash) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.06,
            duration: 900,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1.0,
            duration: 900,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [showSplash]);

  const handleDismissSplash = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 650,
      useNativeDriver: true,
    }).start(() => {
      setShowSplash(false);
    });
  };

  const handleProductPress = (productId: string) => {
    setSelectedProduct(productId);
    router.push('/product-detail');
  };

  const isWishlisted = (productId: string) => {
    return wishlist.some((item) => item.id === productId);
  };

  const handleWishlistToggle = (productId: string) => {
    const matchedProduct = products.find((p) => p.id === productId);
    if (matchedProduct) {
      toggleWishlist(matchedProduct);
    }
  };

  return (
    <View style={styles.container}>
      {/* 1. Cinematic EORS Splash Screen Overlay */}
      {showSplash && (
        <Animated.View style={[StyleSheet.absoluteFill, { opacity: fadeAnim, zIndex: 1000 }]}>
          <Pressable style={StyleSheet.absoluteFill} onPress={handleDismissSplash}>
            <LinearGradient
              colors={['#0D0714', '#1F0A27', '#2E082D']}
              style={styles.splashGradient}
            >
              {/* Spotlight Beams */}
              <View style={[styles.spotlightBeam, { left: -80, transform: [{ rotate: '38deg' }] }]} />
              <View style={[styles.spotlightBeam, { right: -80, transform: [{ rotate: '-38deg' }] }]} />

              <View style={styles.splashContent}>
                {/* Neon hanger logo with hexagon outline */}
                <Animated.View style={[styles.neonHexagon, { transform: [{ scale: pulseAnim }] }]}>
                  <View style={styles.hexagonBorder}>
                    <MaterialCommunityIcons name="hanger" size={80} color="#FF3F6C" style={styles.glowingHanger} />
                    <Text style={styles.neonTextMain}>GOZY EORS</Text>
                    <Text style={styles.neonTextSub}>END OF REASON SALE</Text>
                  </View>
                </Animated.View>

                {/* 3D Metallic "SALE IS LIVE" gold badge */}
                <Animated.View style={[styles.goldBadgeContainer, { transform: [{ scale: pulseAnim }] }]}>
                  <LinearGradient
                    colors={['#FFE259', '#FFA751']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.goldBadgeGradient}
                  >
                    <Text style={styles.goldBadgeText}>SALE IS LIVE</Text>
                  </LinearGradient>
                </Animated.View>

                {/* Sparkling Details */}
                <Text style={styles.splashDealSub}>50% - 80% OFF • FREE SHIPPING ON 1st ORDER</Text>
                
                <View style={styles.skipContainer}>
                  <Text style={styles.skipText}>Tap anywhere to enter Gozy Store</Text>
                  <MaterialCommunityIcons name="chevron-double-down" size={20} color="rgba(255,255,255,0.6)" style={styles.skipArrow} />
                </View>
              </View>
            </LinearGradient>
          </Pressable>
        </Animated.View>
      )}

      {/* Main Homepage content */}
      <SafeAreaView edges={['top']} style={styles.mainContainer}>
        {/* Reusable premium components layout */}
        <SharedHeader cartCount={shoppingCart.length} />
        <SharedTabBar activeTab="ALL" />

        {/* Scrollable Curation and Products Layout */}
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* Circle Categories Horizontal Row */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.circleCategoriesRow}
          >
            {categoryCircles.map((cat, idx) => (
              <Pressable
                key={idx}
                style={styles.circleCategoryItem}
                onPress={() => {
                  const label = cat.label.toLowerCase();
                  if (label === 'men') {
                    router.push('/men');
                  } else if (label === 'women') {
                    router.push('/women');
                  } else if (label === 'kids') {
                    router.push('/kids');
                  } else if (label.includes('beauty')) {
                    router.push('/beauty');
                  } else if (label.includes('home') || label.includes('living')) {
                    router.push('/home-living');
                  } else if (label.includes('luxe')) {
                    router.push('/luxe');
                  } else {
                    const slug = cat.label.toLowerCase().replace(/\s+/g, '-');
                    router.push({ pathname: '/category/[id]', params: { id: slug } } as any);
                  }
                }}
              >
                <View style={[styles.circleIconContainer, (cat as any).highlight && styles.circleHighlightBorder]}>
                  {cat.image ? (
                    <Image source={{ uri: cat.image }} style={styles.circleImg} />
                  ) : (
                    <LinearGradient
                      colors={(cat as any).highlight ? ['#FF3F6C', '#FF8E53'] : ['#F3F4F6', '#E5E7EB']}
                      style={styles.circleIconGradient}
                    >
                      <MaterialCommunityIcons
                        name={(cat as any).icon as any}
                        size={24}
                        color={(cat as any).highlight ? '#FFFFFF' : '#4B5563'}
                      />
                    </LinearGradient>
                  )}
                  {(cat as any).highlight && (
                    <View style={styles.circleHotBadge}>
                      <Text style={styles.circleHotText}>EORS</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.circleCategoryLabel} numberOfLines={1}>
                  {cat.label}
                </Text>
              </Pressable>
            ))}
          </ScrollView>

          {/* Top Banner Carousel */}
          <BannerCarousel banners={homeBanners} />

          {/* Curated EORS Hero Banner Under ₹699 */}
          <LinearGradient
            colors={['#8E2DE2', '#4A00E0']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.heroBanner}
          >
            <View style={styles.heroBannerLeft}>
              <View style={styles.heroEorsBadge}>
                <Text style={styles.heroEorsText}>GOZY EORS SPECIAL</Text>
              </View>
              <Text style={styles.heroBannerTitle}>EVERYTHING UNDER ₹699</Text>
              <Text style={styles.heroBannerSub}>Kurta Sets, Jeans, Handbags & more</Text>
            </View>
            <LinearGradient
              colors={['#FF007F', '#FF7F00']}
              style={styles.heroBannerBtn}
            >
              <Text style={styles.heroBannerBtnText}>SHOP NOW</Text>
            </LinearGradient>
          </LinearGradient>

          {/* Filter Navigation Chips */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.quickChipsBlock}>
            {['Kurta Sets', 'Jeans', 'Handbags', 'Dresses', 'Sneakers', 'T-Shirts', 'Watches', 'Sarees', 'Sunglasses', 'Perfumes'].map((chipLabel) => (
              <Pressable key={chipLabel} style={styles.quickChip}>
                <Text style={styles.quickChipText}>{chipLabel}</Text>
              </Pressable>
            ))}
          </ScrollView>

          {/* Continue Browsing Section */}
          <View style={styles.sectionBlock}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Continue Browsing These Brands</Text>
              <Text style={styles.sectionActionText}>View Board</Text>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.continueBrowsingRow}
            >
              {curatedBrowsing.map((item) => {
                const saved = isWishlisted(item.id);
                return (
                  <View key={item.id} style={styles.productCard}>
                    <Pressable onPress={() => handleProductPress(item.id)}>
                      <ImageBackground
                        source={{ uri: item.image }}
                        style={styles.productImage}
                        imageStyle={{ borderRadius: radius.md }}
                      >
                        <Pressable
                          style={styles.cardHeartBtn}
                          onPress={() => handleWishlistToggle(item.id)}
                        >
                          <MaterialCommunityIcons
                            name={saved ? 'heart' : 'heart-outline'}
                            size={18}
                            color={saved ? '#FF3F6C' : colors.textSecondary}
                          />
                        </Pressable>
                      </ImageBackground>
                    </Pressable>
                    <View style={styles.productInfo}>
                      <Text style={styles.productBrand} numberOfLines={1}>
                        {item.brand}
                      </Text>
                      <Text style={styles.productTitle} numberOfLines={1}>
                        {item.title}
                      </Text>
                      <View style={styles.priceRow}>
                        <Text style={styles.currentPrice}>₹{item.price}</Text>
                        <Text style={styles.originalPrice}>₹{item.originalPrice}</Text>
                        <Text style={styles.discountPercent}>{item.discount}</Text>
                      </View>
                      <View style={styles.priceDropBadge}>
                        <Text style={styles.priceDropText}>{item.priceDrop}</Text>
                      </View>
                    </View>
                  </View>
                );
              })}
            </ScrollView>
          </View>

          {/* Featured Brands */}
          <View style={styles.sectionBlock}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Featured Storefronts & Brands</Text>
              <Text style={styles.sectionActionText}>See All</Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.brandRow}>
              {homeBrands.map((brand, bIdx) => (
                <BrandCard
                  key={bIdx}
                  name={brand.name}
                  offer={brand.offer}
                  logo={brand.logo}
                  image={brand.image}
                  productId={brand.productId}
                />
              ))}
            </ScrollView>
          </View>

          <View style={styles.sectionBlock}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Unmissable Deals For You</Text>
              <View style={styles.dealsBadge}>
                <Text style={styles.dealsBadgeText}>LIMITED TIME</Text>
              </View>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.unmissableScrollRow}
            >
              {unmissableDeals.map((deal) => (
                <Pressable
                  key={deal.id}
                  style={styles.unmissableCard}
                  onPress={() => handleProductPress(deal.productId)}
                >
                  <View style={styles.unmissableCircleContainer}>
                    <Image
                      source={{ uri: deal.image }}
                      style={styles.unmissableImage}
                    />
                    <View style={styles.unmissableDiscountBadge}>
                      <Text style={styles.unmissableDiscountText}>{deal.discount}</Text>
                    </View>
                  </View>
                  <View style={styles.unmissableInfo}>
                    <Text style={styles.unmissableTitle} numberOfLines={1}>
                      {deal.title}
                    </Text>
                    <Text style={styles.unmissablePrice}>{deal.price}</Text>
                  </View>
                </Pressable>
              ))}
            </ScrollView>
          </View>

          {/* Price Store */}
          <View style={[styles.sectionBlock, styles.priceStoreBlock]}>
            <Text style={styles.sectionTitle}>Shop By Price Store</Text>
            <View style={styles.priceStoreGrid}>
              {[
                { label: 'FLAT 80% OFF', color: '#FFF5F5', textColor: '#E53E3E', subtitle: 'Clearance deals' },
                { label: 'UNDER ₹199', color: '#F0FFF4', textColor: '#38A169', subtitle: 'Pocket-friendly styling' },
                { label: 'UNDER ₹499', color: '#EBF8FF', textColor: '#3182CE', subtitle: 'Trending wardrobe drops' },
                { label: 'UNDER ₹999', color: '#FAF5FF', textColor: '#805AD5', subtitle: 'Premium styles curated' },
                { label: 'UNDER ₹1499', color: '#FFFBEB', textColor: '#D97706', subtitle: 'Mid-range bestsellers' },
                { label: 'FLAT 70% OFF', color: '#FFF0F8', textColor: '#DB2777', subtitle: 'Today only flash sale' },
              ].map((store, index) => (
                <Pressable
                  key={index}
                  style={[styles.priceStoreCard, { backgroundColor: store.color }]}
                  onPress={() => handleProductPress('prod-1')}
                >
                  <Text style={[styles.priceStoreLabel, { color: store.textColor }]}>{store.label}</Text>
                  <Text style={styles.priceStoreSub}>{store.subtitle}</Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Bank & Coupon Offers */}
          <View style={styles.sectionBlock}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Bank & Coupon Offers</Text>
              <Text style={styles.sectionActionText}>View All</Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.bankOffersRow}>
              {bankOffers.map((offer) => (
                <Pressable key={offer.code} style={[styles.bankOfferCard, { backgroundColor: offer.color }]} onPress={() => handleProductPress('prod-1')}>
                  <View style={styles.bankOfferTop}>
                    <MaterialCommunityIcons name={offer.icon as any} size={22} color={offer.textColor} />
                    <View style={[styles.bankCodeBadge, { borderColor: offer.textColor }]}>
                      <Text style={[styles.bankCodeText, { color: offer.textColor }]}>{offer.code}</Text>
                    </View>
                  </View>
                  <Text style={[styles.bankOfferTitle, { color: offer.textColor }]}>{offer.title}</Text>
                  <Text style={styles.bankOfferDesc}>{offer.desc}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>

          {/* Deals of the Day */}
          <View style={styles.sectionBlock}>
            <View style={styles.sectionHeaderRow}>
              <View>
                <Text style={styles.sectionTitle}>Deals of the Day</Text>
                <Text style={styles.dealTimerText}>⏱ Ends in 08:32:14</Text>
              </View>
              <Text style={styles.sectionActionText}>See All →</Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dailyDealsRow}>
              {dailyDeals.map((deal, idx) => (
                <Pressable key={idx} style={styles.dailyDealCard} onPress={() => handleProductPress(deal.productId)}>
                  <Image source={{ uri: deal.image }} style={styles.dailyDealImg} />
                  <View style={styles.dailyDealOfferBadge}>
                    <Text style={styles.dailyDealOfferText}>{deal.offer}</Text>
                  </View>
                  <View style={styles.dailyDealInfo}>
                    <Text style={styles.dailyDealBrand} numberOfLines={1}>{deal.brand}</Text>
                    <Text style={styles.dailyDealItem} numberOfLines={1}>{deal.item}</Text>
                  </View>
                </Pressable>
              ))}
            </ScrollView>
          </View>

          {/* Must-Have Closet Essentials */}
          <View style={styles.sectionBlock}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Must-Have Closet Essentials</Text>
              <Text style={styles.sectionActionText}>Explore</Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.closetRow}>
              {closetEssentials.map((item, idx) => (
                <Pressable key={idx} style={styles.closetCard} onPress={() => handleProductPress(item.productId)}>
                  <Image source={{ uri: item.image }} style={styles.closetImg} />
                  <View style={styles.closetOverlay}>
                    <Text style={styles.closetTitle}>{item.title}</Text>
                    <Text style={styles.closetTag}>{item.tag}</Text>
                    <View style={styles.closetShopBtn}>
                      <Text style={styles.closetShopBtnText}>SHOP NOW</Text>
                    </View>
                  </View>
                </Pressable>
              ))}
            </ScrollView>
          </View>

          {/* Footer Taglines */}
          <View style={styles.footerTagBlock}>
            <View style={styles.footerTagRow}>
              <MaterialCommunityIcons name="shield-check-outline" size={18} color="#10B981" />
              <Text style={styles.footerTagText}>100% Original Products — Guaranteed</Text>
            </View>
            <View style={styles.footerTagRow}>
              <MaterialCommunityIcons name="undo-variant" size={18} color="#3B82F6" />
              <Text style={styles.footerTagText}>Easy 14-Day Returns & Exchanges</Text>
            </View>
            <View style={styles.footerTagRow}>
              <MaterialCommunityIcons name="truck-fast-outline" size={18} color="#8B5CF6" />
              <Text style={styles.footerTagText}>Free Express Delivery on 1st Order</Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* Sticky Bottom Tab Footer */}
      <View style={styles.footerTabBar}>
        <Pressable style={styles.footerTab} onPress={() => {}}>
          <MaterialCommunityIcons name="hanger" size={24} color="#FF3F6C" />
          <Text style={[styles.footerTabText, styles.footerTabTextActive]}>Home</Text>
        </Pressable>

        <Pressable style={styles.footerTab} onPress={() => handleProductPress('prod-3')}>
          <View style={styles.fwdIconWrapper}>
            <MaterialCommunityIcons name="fire" size={24} color="#FF5722" />
            <View style={styles.newBadge}>
              <Text style={styles.newBadgeText}>NEW</Text>
            </View>
          </View>
          <Text style={styles.footerTabText}>fwd</Text>
        </Pressable>

        <Pressable style={styles.footerTab} onPress={() => handleProductPress('prod-1')}>
          <MaterialCommunityIcons name="crown-outline" size={24} color="#9C27B0" />
          <Text style={styles.footerTabText}>Luxe</Text>
        </Pressable>

        <Pressable style={styles.footerTab} onPress={() => router.push('/shopping-checkout')}>
          <View style={styles.cartIconWrapper}>
            <MaterialCommunityIcons name="cart-outline" size={24} color={colors.textSecondary} />
            {shoppingCart.length > 0 && (
              <View style={styles.footerCartBadge}>
                <Text style={styles.footerCartBadgeText}>{shoppingCart.length}</Text>
              </View>
            )}
          </View>
          <Text style={styles.footerTabText}>Bag</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  // Splash Screen Overlay Styles
  splashGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  spotlightBeam: {
    position: 'absolute',
    top: -100,
    width: 150,
    height: SCREEN_HEIGHT + 200,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  splashContent: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  neonHexagon: {
    padding: 32,
    borderWidth: 3,
    borderColor: '#FF3F6C',
    borderRadius: 24,
    backgroundColor: 'rgba(13, 7, 20, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FF3F6C',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 24,
    elevation: 10,
    width: SCREEN_WIDTH * 0.78,
  },
  hexagonBorder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  glowingHanger: {
    textShadowColor: '#FF3F6C',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
    marginBottom: spacing.md,
  },
  neonTextMain: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: 2,
    textShadowColor: '#00FFFF',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  neonTextSub: {
    color: '#00FFFF',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 3,
    marginTop: spacing.xs,
    textTransform: 'uppercase',
  },
  goldBadgeContainer: {
    marginTop: spacing.xl,
    borderRadius: radius.md,
    overflow: 'hidden',
    shadowColor: '#FFA751',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 8,
  },
  goldBadgeGradient: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  goldBadgeText: {
    color: '#000000',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  splashDealSub: {
    color: '#FFFFFF',
    fontSize: typography.bodySmall,
    fontWeight: '700',
    marginTop: spacing.lg,
    opacity: 0.9,
    letterSpacing: 0.8,
  },
  skipContainer: {
    marginTop: 64,
    alignItems: 'center',
  },
  skipText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: typography.small,
    fontWeight: '600',
    letterSpacing: 1,
  },
  skipArrow: {
    marginTop: spacing.xs,
  },

  // Main UI Screen Styles
  mainContainer: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  deliveryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    backgroundColor: '#F8F9FA',
    borderBottomWidth: 1,
    borderBottomColor: '#EEF0F2',
  },
  deliveryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 4,
  },
  deliveryText: {
    color: colors.textSecondary,
    fontSize: typography.small,
    fontWeight: '700',
    maxWidth: SCREEN_WIDTH * 0.58,
  },
  walletContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(10, 103, 255, 0.08)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    gap: 4,
  },
  walletText: {
    color: colors.primary,
    fontSize: typography.tiny,
    fontWeight: '800',
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    marginTop: spacing.sm,
    gap: spacing.sm,
  },
  gozyLogo: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  gozyLogoAccent: {
    color: '#FF3F6C',
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    height: 38,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingHorizontal: spacing.sm,
  },
  searchIcon: {
    marginRight: 6,
  },
  searchBar: {
    flex: 1,
    height: '100%',
    fontSize: typography.bodySmall,
    color: colors.text,
    paddingVertical: 0,
  },
  searchTrigger: {
    padding: 4,
    marginLeft: 4,
  },
  headerRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  headerActionBtn: {
    padding: 2,
  },
  cartIconWrapper: {
    position: 'relative',
  },
  cartBadge: {
    position: 'absolute',
    top: -5,
    right: -6,
    backgroundColor: '#FF3F6C',
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '900',
  },

  // Gender navigation selector tabs
  genderTabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
  },
  genderTab: {
    flex: 1,
    paddingVertical: spacing.md,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#F5F5F5',
  },
  activeGenderTab: {
    borderBottomColor: '#FF3F6C',
  },
  genderTabLabel: {
    color: colors.textMuted,
    fontSize: typography.bodySmall,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  activeGenderTabLabel: {
    color: '#FF3F6C',
    fontWeight: '900',
  },

  scrollContent: {
    paddingBottom: 90,
  },

  // Categories circles styling
  circleCategoriesRow: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: '#FFFFFF',
    gap: spacing.lg,
  },
  circleCategoryItem: {
    alignItems: 'center',
    width: 68,
  },
  circleIconContainer: {
    position: 'relative',
    width: 58,
    height: 58,
    borderRadius: 29,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F5F5',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
  },
  circleImg: {
    width: '100%',
    height: '100%',
    borderRadius: 29,
  },
  circleHighlightBorder: {
    borderWidth: 2,
    borderColor: '#FF3F6C',
    padding: 2,
  },
  circleIconGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 29,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleHotBadge: {
    position: 'absolute',
    top: -5,
    right: -8,
    backgroundColor: '#FF3F6C',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 6,
  },
  circleHotText: {
    color: '#FFFFFF',
    fontSize: 7,
    fontWeight: '900',
  },
  circleCategoryLabel: {
    color: colors.text,
    fontSize: typography.tiny,
    fontWeight: '700',
    marginTop: 6,
    textAlign: 'center',
  },

  // Hero Banner Under 699
  heroBanner: {
    marginHorizontal: spacing.md,
    marginTop: spacing.sm,
    borderRadius: radius.md,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#4A00E0',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  heroBannerLeft: {
    flex: 1,
  },
  heroEorsBadge: {
    backgroundColor: '#FF3F6C',
    alignSelf: 'flex-start',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginBottom: 6,
  },
  heroEorsText: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: '800',
  },
  heroBannerTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  heroBannerSub: {
    color: '#E0D4FF',
    fontSize: typography.small,
    marginTop: 2,
  },
  heroBannerBtn: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    shadowColor: '#FF007F',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  heroBannerBtnText: {
    color: '#111827',
    fontSize: 10,
    fontWeight: '800',
  },

  // Quick category chips row
  quickChipsBlock: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginTop: spacing.xs,
  },
  quickChip: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EAEAEA',
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  quickChipText: {
    color: colors.textSecondary,
    fontSize: typography.small,
    fontWeight: '700',
  },

  // Sections overall styles
  sectionBlock: {
    marginTop: spacing.lg,
    paddingHorizontal: spacing.md,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 0.2,
  },
  sectionActionText: {
    color: '#FF3F6C',
    fontSize: typography.bodySmall,
    fontWeight: '800',
  },

  // Continue Browsing Carousel Layout
  continueBrowsingRow: {
    gap: spacing.md,
    paddingRight: spacing.md,
  },
  productCard: {
    backgroundColor: '#FFFFFF',
    width: 154,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: '#ECECEC',
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: 172,
    position: 'relative',
  },
  cardHeartBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  productInfo: {
    padding: spacing.sm,
  },
  productBrand: {
    color: colors.text,
    fontSize: typography.caption,
    fontWeight: '800',
  },
  productTitle: {
    color: colors.textMuted,
    fontSize: 10.5,
    marginTop: 2,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
    gap: 4,
  },
  currentPrice: {
    color: colors.text,
    fontSize: typography.bodySmall,
    fontWeight: '800',
  },
  originalPrice: {
    color: colors.textLight,
    fontSize: typography.caption,
    textDecorationLine: 'line-through',
  },
  discountPercent: {
    color: '#FF3F6C',
    fontSize: 9,
    fontWeight: '800',
  },
  priceDropBadge: {
    backgroundColor: '#E6F4EA',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginTop: spacing.xs,
    alignSelf: 'flex-start',
  },
  priceDropText: {
    color: '#137333',
    fontSize: 8,
    fontWeight: '800',
  },

  // Featured storefronts styling
  featuredBrandsGrid: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  brandRow: {
    gap: spacing.md,
    paddingRight: spacing.md,
  },
  featuredBrandCard: {
    flex: 1,
    height: 180,
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
  featuredBrandImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
  },
  featuredBrandGradient: {
    padding: spacing.md,
  },
  featuredBrandDeal: {
    color: '#FFF066',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  featuredBrandName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
    marginTop: 2,
  },
  featuredBrandTagline: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '600',
    opacity: 0.9,
    marginTop: 2,
  },

  // Unmissable Deals Grid layout
  dealsBadge: {
    backgroundColor: '#FFF3CD',
    borderColor: '#FFEEBA',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  dealsBadgeText: {
    color: '#856404',
    fontSize: 9,
    fontWeight: '800',
  },
  unmissableScrollRow: {
    gap: spacing.md,
    paddingRight: spacing.md,
  },
  unmissableCard: {
    width: 90,
    alignItems: 'center',
  },
  unmissableCircleContainer: {
    position: 'relative',
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#FF3F6C',
    backgroundColor: '#F9FAFB',
  },
  unmissableImage: {
    width: '100%',
    height: '100%',
  },
  unmissableDiscountBadge: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FF3F6C',
    paddingVertical: 2,
    alignItems: 'center',
  },
  unmissableDiscountText: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: '900',
  },
  unmissableInfo: {
    marginTop: spacing.xs,
    alignItems: 'center',
    width: '100%',
  },
  unmissableTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.textSecondary,
    textAlign: 'center',
  },
  unmissablePrice: {
    fontSize: 10.5,
    fontWeight: '900',
    color: colors.text,
    marginTop: 1,
  },

  // Price Store Block
  priceStoreBlock: {
    marginBottom: spacing.xl,
  },
  priceStoreGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  priceStoreCard: {
    width: '48%',
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.03)',
    justifyContent: 'center',
  },
  priceStoreLabel: {
    fontSize: 13,
    fontWeight: '900',
  },
  priceStoreSub: {
    fontSize: 9,
    color: colors.textMuted,
    marginTop: 2,
    fontWeight: '500',
  },

  // Sticky Bottom Navigation Footer
  footerTabBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 64,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#ECECEC',
    flexDirection: 'row',
    paddingBottom: 4,
  },
  footerTab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fwdIconWrapper: {
    position: 'relative',
  },
  newBadge: {
    position: 'absolute',
    top: -5,
    right: -14,
    backgroundColor: '#FF3F6C',
    paddingHorizontal: 3,
    paddingVertical: 1,
    borderRadius: 4,
  },
  newBadgeText: {
    color: '#FFFFFF',
    fontSize: 6,
    fontWeight: '900',
  },
  footerCartBadge: {
    position: 'absolute',
    top: -4,
    right: -8,
    backgroundColor: '#FF3F6C',
    width: 14,
    height: 14,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerCartBadgeText: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: '900',
  },
  footerTabText: {
    fontSize: 9,
    color: colors.textSecondary,
    fontWeight: '700',
    marginTop: 2,
  },
  footerTabTextActive: {
    color: '#FF3F6C',
    fontWeight: '800',
  },

  // Bank Offers
  bankOffersRow: {
    gap: spacing.md,
    paddingRight: spacing.md,
  },
  bankOfferCard: {
    width: 200,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  bankOfferTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  bankCodeBadge: {
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  bankCodeText: {
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  bankOfferTitle: {
    fontSize: 13,
    fontWeight: '900',
    marginBottom: 4,
  },
  bankOfferDesc: {
    fontSize: 10,
    color: colors.textSecondary,
    lineHeight: 14,
  },

  // Daily Deals
  dealTimerText: {
    fontSize: 10,
    color: '#FF3F6C',
    fontWeight: '700',
    marginTop: 2,
  },
  dailyDealsRow: {
    gap: spacing.sm,
    paddingRight: spacing.md,
  },
  dailyDealCard: {
    width: 120,
    borderRadius: radius.md,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#ECECEC',
  },
  dailyDealImg: {
    width: '100%',
    height: 110,
    resizeMode: 'cover',
  },
  dailyDealOfferBadge: {
    backgroundColor: '#FF3F6C',
    paddingHorizontal: 6,
    paddingVertical: 3,
  },
  dailyDealOfferText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '900',
  },
  dailyDealInfo: {
    padding: 6,
  },
  dailyDealBrand: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.text,
  },
  dailyDealItem: {
    fontSize: 9,
    color: colors.textSecondary,
    marginTop: 1,
  },

  // Closet Essentials
  closetRow: {
    gap: spacing.md,
    paddingRight: spacing.md,
  },
  closetCard: {
    width: 200,
    height: 160,
    borderRadius: radius.md,
    overflow: 'hidden',
  },
  closetImg: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  closetOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: 12,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  closetTitle: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
  },
  closetTag: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 9,
    marginTop: 2,
  },
  closetShopBtn: {
    marginTop: 8,
    backgroundColor: '#FF3F6C',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  closetShopBtnText: {
    color: '#111827',
    fontSize: 8,
    fontWeight: '900',
  },

  // Footer Taglines
  footerTagBlock: {
    marginTop: spacing.xl,
    marginHorizontal: spacing.md,
    marginBottom: 90,
    gap: 12,
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  footerTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  footerTagText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '600',
  },
});
