import { useState } from 'react';
import {
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Redirect, router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { useApp } from '@/src/context/app-context';
import { useSuperAppStore } from '@/src/store/super-app-store';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Similar products mock
const similarProducts = [
  {
    id: 'sim-1',
    brand: 'Off Duty India',
    name: 'Women Wide Leg Pants',
    price: 1650,
    rating: 4.2,
    image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'sim-2',
    brand: 'Miss Chase',
    name: 'Women Wide Leg Jeans',
    price: 1395,
    originalPrice: 3245,
    discount: '57% OFF',
    rating: 4.1,
    image: 'https://images.unsplash.com/photo-1475178626620-a4d074967452?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'sim-3',
    brand: 'Roadster',
    name: 'High-Rise Wide Trousers',
    price: 1299,
    originalPrice: 2599,
    discount: '50% OFF',
    rating: 4.2,
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=300&q=80',
  },
];

const youMayAlsoLike = [
  {
    id: 'may-1',
    brand: 'BAESD',
    name: 'Floral Puff Sleeve Dress',
    price: 1299,
    rating: 4.3,
    image: 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'may-2',
    brand: 'StyleCast',
    name: 'Casual Midi Skirt',
    price: 899,
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'may-3',
    brand: 'French Connection',
    name: 'Wrap Maxi Dress',
    price: 2199,
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=300&q=80',
  },
];

const mockReviews = [
  {
    id: 'rev-1',
    name: 'SUNIDHI TOMAR',
    rating: 5,
    date: 'Oct 02, 2025',
    size: '36',
    text: 'Comfy, stylish, and perfect fit! These high-rise jeans are incredibly flattering and the material is super soft.',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80',
    verified: true,
  },
  {
    id: 'rev-2',
    name: 'RAHUL S.',
    rating: 5,
    date: 'Jul 18, 2025',
    size: '32',
    text: 'Great quality product. Miss Chase never disappoints.',
    verified: true,
  },
];

export default function ProductDetailScreen() {
  const { products } = useApp();
  const { addProduct, selectedProductId, shoppingCart, toggleWishlist, wishlist } = useSuperAppStore();

  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'similar' | 'maylike'>('similar');
  const [showStickyAddBag, setShowStickyAddBag] = useState(true);

  const product = products.find((item) => item.id === selectedProductId);
  if (!product) {
    return <Redirect href="/shopping" />;
  }

  const saved = wishlist.some((item) => item.id === product.id);
  const isInCart = shoppingCart.some(
    (item) => item.sourceId === product.id || item.id === `product-${product.id}`
  );
  const discountPct = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
  const megaDealPrice = Math.round(product.price * 0.8);
  const extraOff = product.price - megaDealPrice;

  return (
    <View style={styles.container}>
      {/* Fixed Myntra-style header */}
      <SafeAreaView edges={['top']} style={styles.header}>
        <View style={styles.headerRow}>
          <Pressable onPress={() => router.back()} style={styles.headerBtn}>
            <MaterialCommunityIcons name="arrow-left" size={22} color="#1F2937" />
          </Pressable>

          <Pressable style={styles.headerSearch} onPress={() => router.push('/search')}>
            <MaterialCommunityIcons name="magnify" size={18} color="#9CA3AF" />
            <Text style={styles.headerSearchText}>Search in Gozy Shopping</Text>
          </Pressable>

          <Pressable style={styles.headerBtn} onPress={() => toggleWishlist(product)}>
            <MaterialCommunityIcons
              name={saved ? 'heart' : 'heart-outline'}
              size={22}
              color={saved ? '#FF3F6C' : '#1F2937'}
            />
          </Pressable>

          <Pressable style={styles.headerBtn} onPress={() => router.push('/shopping-checkout')}>
            <View>
              <MaterialCommunityIcons name="shopping-outline" size={22} color="#1F2937" />
              {shoppingCart.length > 0 && (
                <View style={styles.cartBadge}>
                  <Text style={styles.cartBadgeText}>{shoppingCart.length}</Text>
                </View>
              )}
            </View>
          </Pressable>
        </View>
      </SafeAreaView>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        scrollEventThrottle={16}
        onScroll={(event) => {
          const yOffset = event.nativeEvent.contentOffset.y;
          // Hide sticky bottom Add to Bag button if user scrolled past 260px (where page level Add to Bag becomes visible)
          if (yOffset > 260) {
            setShowStickyAddBag(false);
          } else {
            setShowStickyAddBag(true);
          }
        }}
      >
        {/* Product Image — full width, tall */}
        <View style={styles.imageWrapper}>
          <Image source={{ uri: product.image }} style={styles.mainImage} resizeMode="cover" />

          {/* Rating badge over image */}
          <View style={styles.ratingOverlay}>
            <MaterialCommunityIcons name="star" size={13} color="#FFB300" />
            <Text style={styles.ratingOverlayText}>{product.rating.toFixed(1)}</Text>
            <Text style={styles.ratingOverlayDivider}>|</Text>
            <Text style={styles.ratingOverlayCount}>237</Text>
          </View>

          {/* Video preview thumb — Myntra style */}
          <Pressable style={styles.videoThumb}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=80&q=80' }}
              style={styles.videoThumbImg}
            />
            <View style={styles.videoPlayBtn}>
              <MaterialCommunityIcons name="play" size={12} color="#FFFFFF" />
            </View>
          </Pressable>
        </View>

        {/* Image dots */}
        <View style={styles.imageDots}>
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <View key={i} style={[styles.imageDot, i === 0 && styles.imageDotActive]} />
          ))}
        </View>

        {/* 3 action icons row — try, wishlist, share */}
        <View style={styles.actionIconRow}>
          <Pressable style={styles.actionIconBtn}>
            <MaterialCommunityIcons name="tshirt-crew-outline" size={22} color="#6B7280" />
          </Pressable>
          <View style={styles.actionIconDivider} />
          <Pressable style={styles.actionIconBtn} onPress={() => toggleWishlist(product)}>
            <MaterialCommunityIcons name={saved ? 'heart' : 'heart-outline'} size={22} color={saved ? '#FF3F6C' : '#6B7280'} />
          </Pressable>
          <View style={styles.actionIconDivider} />
          <Pressable style={styles.actionIconBtn}>
            <MaterialCommunityIcons name="share-variant-outline" size={22} color="#6B7280" />
          </Pressable>
        </View>

        {/* Product brand + name + price */}
        <View style={styles.productInfoBlock}>
          <Text style={styles.productBrandBold}>
            {product.brand}{' '}
            <Text style={styles.productNameInline}>{product.name}</Text>
          </Text>

          <View style={styles.priceRow}>
            <Text style={styles.mrpLabel}>MRP </Text>
            <Text style={styles.strikeMrp}>₹{product.originalPrice.toLocaleString('en-IN')}</Text>
            <Text style={styles.salePrice}>₹{product.price.toLocaleString('en-IN')}</Text>
            <View style={styles.discountBadge}>
              <Text style={styles.discountBadgeText}>{discountPct}% OFF!</Text>
            </View>
          </View>

          <Text style={styles.crazyDealLabel}>Crazy Deal</Text>
        </View>

        {/* MEGA DEAL banner */}
        <View style={styles.megaDealBanner}>
          <LinearGradient colors={['#FF3F6C', '#FF1744']} style={styles.megaDealLeft}>
            <Text style={styles.megaDealLabel}>MEGA{'\n'}DEAL</Text>
          </LinearGradient>
          <View style={styles.megaDealCenter}>
            <Text style={styles.megaDealGetAt}>Get at ₹{megaDealPrice.toLocaleString('en-IN')}</Text>
            <Text style={styles.megaDealWith}>With Coupon + Bank Offer</Text>
          </View>
          <Pressable style={styles.megaDealRight}>
            <Text style={styles.megaDealExtraOff}>Extra ₹{extraOff} Off</Text>
          </Pressable>
          <Pressable style={styles.megaDealDetailsBtn}>
            <Text style={styles.megaDealDetailsText}>Details {'>'}</Text>
          </Pressable>
        </View>

        {/* Size selector — Myntra style */}
        {product.sizes && product.sizes.length > 0 && (
          <View style={styles.sizeBlock}>
            <View style={styles.sizeHeaderRow}>
              <Text style={styles.sizeTitle}>Select Size</Text>
              <Pressable style={styles.sizeChartBtn}>
                <Text style={styles.sizeChartText}>Size Chart {'>'}</Text>
              </Pressable>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.sizeChipsRow}>
              {product.sizes.map((size) => (
                <Pressable
                  key={size}
                  onPress={() => setSelectedSize(size)}
                  style={[
                    styles.sizeChip,
                    selectedSize === size && styles.sizeChipSelected,
                  ]}
                >
                  <Text style={[styles.sizeChipLabel, selectedSize === size && styles.sizeChipLabelSelected]}>
                    {size}
                  </Text>
                  <Text style={[styles.sizeChipPrice, selectedSize === size && styles.sizeChipPriceSelected]}>
                    ₹{product.price}
                  </Text>
                  {selectedSize === size && (
                    <Text style={styles.sizeLeftLabel}>7 left</Text>
                  )}
                </Pressable>
              ))}
            </ScrollView>
          </View>
        )}

        {/* CTA Buttons */}
        <View style={styles.ctaRow}>
          <Pressable style={styles.buyNowBtn} onPress={() => { addProduct(product); router.push('/shopping-checkout'); }}>
            <MaterialCommunityIcons name="shopping-outline" size={16} color="#FF3F6C" />
            <Text style={styles.buyNowText}>Buy Now</Text>
          </Pressable>
          <Pressable
            style={styles.addToBagBtn}
            onPress={() => {
              if (isInCart) {
                router.push('/shopping-checkout');
              } else {
                addProduct(product);
              }
            }}
          >
            <LinearGradient colors={['#FF3F6C', '#FF1744']} style={styles.addToBagGradient}>
              <MaterialCommunityIcons name={isInCart ? 'cart-outline' : 'bag-personal-outline'} size={16} color="#FFFFFF" />
              <Text style={styles.addToBagText}>{isInCart ? 'Go to Bag' : 'Add to Bag'}</Text>
            </LinearGradient>
          </Pressable>
        </View>

        {/* Delivery & Services */}
        <View style={styles.deliveryBlock}>
          <Text style={styles.deliverySectionTitle}>Delivery & Services</Text>

          <View style={styles.deliveryAddressCard}>
            <MaterialCommunityIcons name="map-marker-outline" size={16} color="#6B7280" />
            <Text style={styles.deliveryAddressText} numberOfLines={1}>V.nikshitha - IIT DELHI, SONEPAT C...</Text>
            <Pressable>
              <Text style={styles.changeText}>Change</Text>
            </Pressable>
          </View>

          <View style={styles.deliveryOptionCard}>
            <View style={styles.deliveryOptionLeft}>
              <MaterialCommunityIcons name="check-circle" size={20} color="#FF3F6C" style={{ marginRight: 8 }} />
              <View>
                <Text style={styles.deliveryTypeLabel}>STANDARD</Text>
                <Text style={styles.deliveryDate}>Delivery by Thu, 18 Jun</Text>
              </View>
            </View>
            <View style={styles.deliveryOptionRight}>
              <Text style={styles.deliveryOriginalPrice}>MRP ₹{product.originalPrice.toLocaleString('en-IN')}</Text>
              <Text style={styles.deliverySalePrice}>₹{product.price.toLocaleString('en-IN')} ({discountPct}% OFF)</Text>
            </View>
          </View>

          <View style={styles.serviceRow}>
            <MaterialCommunityIcons name="cash-multiple" size={20} color="#4B5563" />
            <View style={styles.serviceInfo}>
              <Text style={styles.serviceTitle}>Pay on Delivery is available</Text>
              <Text style={styles.serviceSubtitle}>₹10 additional fee applicable</Text>
            </View>
          </View>

          <View style={styles.serviceRow}>
            <MaterialCommunityIcons name="swap-horizontal" size={20} color="#4B5563" />
            <View style={styles.serviceInfo}>
              <Text style={styles.serviceTitle}>Hassle free 7 days Return & Exchange</Text>
            </View>
          </View>
        </View>

        {/* Ratings & Reviews */}
        <View style={styles.reviewBlock}>
          <Text style={styles.reviewSectionTitle}>Ratings & Reviews</Text>

          <View style={styles.ratingRow}>
            <View style={styles.ratingScoreBadge}>
              <Text style={styles.ratingScore}>{product.rating.toFixed(1)}</Text>
              <MaterialCommunityIcons name="star" size={14} color="#FFFFFF" />
            </View>
            <Pressable style={styles.ratingCountBtn}>
              <Text style={styles.ratingCountText}>237 ratings | 32 reviews </Text>
              <MaterialCommunityIcons name="chevron-right" size={14} color="#6B7280" />
            </Pressable>
          </View>

          {/* Review photo strip */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.reviewPhotoRow}>
            {[
              'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&w=100&q=80',
              'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80',
              'https://images.unsplash.com/photo-1514996937319-344454492b37?auto=format&fit=crop&w=100&q=80',
              'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=100&q=80',
            ].map((img, idx) => (
              <Pressable key={idx} style={styles.reviewPhoto}>
                <Image source={{ uri: img }} style={styles.reviewPhotoImg} />
                {idx === 0 && (
                  <View style={styles.reviewVideoOverlay}>
                    <MaterialCommunityIcons name="play" size={12} color="#FFFFFF" />
                    <Text style={styles.reviewVideoTime}>0:05</Text>
                  </View>
                )}
                {idx === 3 && (
                  <View style={styles.reviewMoreOverlay}>
                    <Text style={styles.reviewMoreText}>+11</Text>
                  </View>
                )}
              </Pressable>
            ))}
          </ScrollView>

          {/* Review cards */}
          <View style={styles.reviewHeaderRow}>
            <Text style={styles.customerReviewTitle}>Customer Reviews (32)</Text>
            <Pressable><Text style={styles.viewAllText}>View All</Text></Pressable>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.reviewCardsRow}>
            {mockReviews.map((review) => (
              <View key={review.id} style={styles.reviewCard}>
                <View style={styles.reviewCardTop}>
                  <View style={[styles.reviewStarBadge, { backgroundColor: review.rating >= 4 ? '#2E7D32' : '#F59E0B' }]}>
                    <Text style={styles.reviewStarText}>{review.rating} ★</Text>
                  </View>
                  <Text style={styles.reviewDate}>{review.date}</Text>
                  {review.size && <Text style={styles.reviewSize}>Size: {review.size}</Text>}
                </View>
                <View style={styles.reviewCardBody}>
                  <Text style={styles.reviewText} numberOfLines={3}>{review.text}</Text>
                  {review.image && (
                    <Image source={{ uri: review.image }} style={styles.reviewCardImg} />
                  )}
                </View>
                {review.verified && (
                  <View style={styles.verifiedRow}>
                    <MaterialCommunityIcons name="check-circle-outline" size={12} color="#10B981" />
                    <Text style={styles.verifiedText}>{review.name}</Text>
                  </View>
                )}
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Trust badges */}
        <View style={styles.trustBadgesRow}>
          <View style={styles.trustBadge}>
            <MaterialCommunityIcons name="shield-star-outline" size={36} color="#FF3F6C" />
            <Text style={styles.trustBadgeTitle}>Genuine{'\n'}Product</Text>
          </View>
          <View style={styles.trustBadge}>
            <MaterialCommunityIcons name="check-decagram-outline" size={36} color="#FF3F6C" />
            <Text style={styles.trustBadgeTitle}>Quality{'\n'}Checked</Text>
          </View>
        </View>

        {/* More information */}
        <View style={styles.moreInfoBlock}>
          <Text style={styles.moreInfoTitle}>More Information</Text>
          <Text style={styles.moreInfoCode}>Product Code: {product.id.toUpperCase()}</Text>
          <Pressable><Text style={styles.viewMoreLink}>View More</Text></Pressable>
        </View>

        {/* Similar Products */}
        <View style={styles.similarBlock}>
          <Text style={styles.similarTitle}>Similar Products</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.similarRow}>
            {similarProducts.map((p) => (
              <View key={p.id} style={styles.similarCard}>
                <Image source={{ uri: p.image }} style={styles.similarImg} />
                <View style={styles.similarRatingBadge}>
                  <MaterialCommunityIcons name="star" size={9} color="#2E7D32" />
                  <Text style={styles.similarRatingText}>{p.rating}</Text>
                </View>
                <View style={styles.similarInfo}>
                  <Text style={styles.similarBrand} numberOfLines={1}>{p.brand}</Text>
                  <Text style={styles.similarName} numberOfLines={2}>{p.name}</Text>
                  <View style={styles.similarPriceRow}>
                    {p.originalPrice && (
                      <Text style={styles.similarOriginalPrice}>₹{p.originalPrice.toLocaleString('en-IN')}</Text>
                    )}
                    <Text style={styles.similarSalePrice}>₹{p.price.toLocaleString('en-IN')}</Text>
                    {p.discount && <Text style={styles.similarDiscount}>{p.discount}</Text>}
                  </View>
                  <Pressable style={styles.addToBagMini}>
                    <Text style={styles.addToBagMiniText}>Add to Bag</Text>
                  </Pressable>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* You May Also Like */}
        <View style={styles.youMayBlock}>
          <Text style={styles.youMayTitle}>You may also like</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.youMayRow}>
            {youMayAlsoLike.map((p) => (
              <Pressable key={p.id} style={styles.youMayCard}>
                <Image source={{ uri: p.image }} style={styles.youMayImg} />
                <View style={styles.youMayRatingBadge}>
                  <MaterialCommunityIcons name="star" size={9} color="#2E7D32" />
                  <Text style={styles.youMayRatingText}>{p.rating}</Text>
                </View>
                <Text style={styles.youMayBrand} numberOfLines={1}>{p.brand}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* Bottom padding for sticky bar */}
        <View style={{ height: 80 }} />
      </ScrollView>

      {/* Sticky bottom CTA */}
      {showStickyAddBag && (
        <View style={styles.stickyBar}>
          <Pressable style={styles.stickyBuyNow} onPress={() => { addProduct(product); router.push('/shopping-checkout'); }}>
            <MaterialCommunityIcons name="shopping-outline" size={16} color="#FF3F6C" />
            <Text style={styles.stickyBuyNowText}>Buy Now</Text>
          </Pressable>
          <Pressable
            style={styles.stickyAddBag}
            onPress={() => {
              if (isInCart) {
                router.push('/shopping-checkout');
              } else {
                addProduct(product);
              }
            }}
          >
            <LinearGradient colors={['#FF3F6C', '#FF1744']} style={styles.stickyAddBagGradient}>
              <MaterialCommunityIcons name={isInCart ? 'cart-outline' : 'bag-personal-outline'} size={16} color="#FFFFFF" />
              <Text style={styles.stickyAddBagText}>{isInCart ? 'Go to Bag' : 'Add to Bag'}</Text>
            </LinearGradient>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  // Header
  header: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    zIndex: 10,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  headerBtn: {
    padding: 4,
  },
  headerSearch: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 6,
  },
  headerSearchText: {
    flex: 1,
    fontSize: 13,
    color: '#9CA3AF',
  },
  cartBadge: {
    position: 'absolute',
    top: -4,
    right: -6,
    backgroundColor: '#FF3F6C',
    width: 14,
    height: 14,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBadgeText: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: '900',
  },

  scrollContent: {
    backgroundColor: '#FFFFFF',
  },

  // Product Image
  imageWrapper: {
    backgroundColor: '#F5F5F5',
    position: 'relative',
  },
  mainImage: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH * 1.25,
  },
  ratingOverlay: {
    position: 'absolute',
    bottom: 14,
    right: 14,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    gap: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  ratingOverlayText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1F2937',
  },
  ratingOverlayDivider: {
    color: '#D1D5DB',
    fontSize: 12,
  },
  ratingOverlayCount: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
  },
  videoThumb: {
    position: 'absolute',
    bottom: 14,
    right: 90,
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#FF3F6C',
  },
  videoThumbImg: {
    width: '100%',
    height: '100%',
  },
  videoPlayBtn: {
    position: 'absolute',
    inset: 0,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Image dots
  imageDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
  },
  imageDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#D1D5DB',
  },
  imageDotActive: {
    backgroundColor: '#FF3F6C',
    width: 16,
  },

  // Action icons (try / heart / share)
  actionIconRow: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#F3F4F6',
  },
  actionIconBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  actionIconDivider: {
    width: 1,
    backgroundColor: '#F3F4F6',
    marginVertical: 8,
  },

  // Product info block
  productInfoBlock: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: '#FFFFFF',
  },
  productBrandBold: {
    fontSize: 16,
    fontWeight: '900',
    color: '#1F2937',
    lineHeight: 22,
  },
  productNameInline: {
    fontWeight: '400',
    color: '#374151',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 6,
  },
  mrpLabel: {
    fontSize: 13,
    color: '#6B7280',
  },
  strikeMrp: {
    fontSize: 13,
    color: '#9CA3AF',
    textDecorationLine: 'line-through',
  },
  salePrice: {
    fontSize: 18,
    fontWeight: '900',
    color: '#1F2937',
  },
  discountBadge: {
    backgroundColor: '#FF3F6C',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
  },
  discountBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '900',
  },
  crazyDealLabel: {
    color: '#FF8C00',
    fontSize: 12,
    fontWeight: '800',
    marginTop: 4,
  },

  // Mega deal banner
  megaDealBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginVertical: 12,
    borderWidth: 1,
    borderColor: '#FFD1DC',
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#FFF5F7',
  },
  megaDealLeft: {
    paddingHorizontal: 10,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  megaDealLabel: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '900',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  megaDealCenter: {
    flex: 1,
    paddingHorizontal: 10,
  },
  megaDealGetAt: {
    fontSize: 13,
    fontWeight: '900',
    color: '#1F2937',
  },
  megaDealWith: {
    fontSize: 10,
    color: '#6B7280',
    marginTop: 2,
  },
  megaDealRight: {
    backgroundColor: '#10B981',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 6,
    marginRight: 8,
  },
  megaDealExtraOff: {
    color: '#FFFFFF',
    fontSize: 10.5,
    fontWeight: '900',
  },
  megaDealDetailsBtn: {
    paddingRight: 12,
  },
  megaDealDetailsText: {
    color: '#FF3F6C',
    fontSize: 10.5,
    fontWeight: '700',
  },

  // Size selector
  sizeBlock: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    borderTopWidth: 8,
    borderTopColor: '#F8F9FB',
  },
  sizeHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sizeTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: '#1F2937',
  },
  sizeChartBtn: {},
  sizeChartText: {
    color: '#FF3F6C',
    fontSize: 13,
    fontWeight: '700',
  },
  sizeChipsRow: {
    gap: 10,
    paddingRight: 16,
  },
  sizeChip: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    alignItems: 'center',
    minWidth: 70,
    backgroundColor: '#FFFFFF',
  },
  sizeChipSelected: {
    borderColor: '#FF3F6C',
    borderWidth: 2,
  },
  sizeChipLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: '#374151',
  },
  sizeChipLabelSelected: {
    color: '#1F2937',
  },
  sizeChipPrice: {
    fontSize: 10,
    color: '#9CA3AF',
    marginTop: 2,
  },
  sizeChipPriceSelected: {
    color: '#FF3F6C',
  },
  sizeLeftLabel: {
    fontSize: 9,
    color: '#F59E0B',
    fontWeight: '700',
    marginTop: 3,
  },

  // CTA buttons
  ctaRow: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
  },
  buyNowBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderWidth: 1.5,
    borderColor: '#FF3F6C',
    borderRadius: 8,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
  },
  buyNowText: {
    color: '#FF3F6C',
    fontSize: 13,
    fontWeight: '900',
  },
  addToBagBtn: {
    flex: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
  addToBagGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 14,
  },
  addToBagText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
  },

  // Delivery block
  deliveryBlock: {
    marginTop: 8,
    borderTopWidth: 8,
    borderTopColor: '#F8F9FB',
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
  },
  deliverySectionTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#1F2937',
    marginBottom: 4,
  },
  deliveryAddressCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    gap: 6,
  },
  deliveryAddressText: {
    flex: 1,
    fontSize: 13,
    color: '#374151',
    fontWeight: '600',
  },
  changeText: {
    color: '#FF3F6C',
    fontSize: 13,
    fontWeight: '700',
  },
  deliveryOptionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFF5F7',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#FFD1DC',
  },
  deliveryOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deliveryTypeLabel: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#1F2937',
    letterSpacing: 0.5,
  },
  deliveryDate: {
    fontSize: 13,
    fontWeight: '700',
    color: '#374151',
    marginTop: 2,
  },
  deliveryOptionRight: {
    alignItems: 'flex-end',
  },
  deliveryOriginalPrice: {
    fontSize: 10,
    color: '#9CA3AF',
    textDecorationLine: 'line-through',
  },
  deliverySalePrice: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1F2937',
  },
  serviceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  serviceInfo: {},
  serviceTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1F2937',
  },
  serviceSubtitle: {
    fontSize: 10.5,
    color: '#9CA3AF',
    marginTop: 1,
  },

  // Ratings & Reviews
  reviewBlock: {
    marginTop: 8,
    borderTopWidth: 8,
    borderTopColor: '#F8F9FB',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  reviewSectionTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#1F2937',
    marginBottom: 16,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  ratingScoreBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#2E7D32',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  ratingScore: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
  },
  ratingCountBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  ratingCountText: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '600',
  },

  // Review photos
  reviewPhotoRow: {
    gap: 8,
    marginBottom: 20,
  },
  reviewPhoto: {
    width: 84,
    height: 84,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  reviewPhotoImg: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  reviewVideoOverlay: {
    position: 'absolute',
    bottom: 4,
    left: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  reviewVideoTime: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '700',
  },
  reviewMoreOverlay: {
    position: 'absolute',
    inset: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  reviewMoreText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
  },

  // Review cards
  reviewHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  customerReviewTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: '#1F2937',
  },
  viewAllText: {
    color: '#374151',
    fontSize: 13,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
  reviewCardsRow: {
    gap: 12,
    paddingRight: 16,
  },
  reviewCard: {
    width: SCREEN_WIDTH - 80,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    padding: 14,
    backgroundColor: '#FAFAFA',
  },
  reviewCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  reviewStarBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  reviewStarText: {
    color: '#FFFFFF',
    fontSize: 10.5,
    fontWeight: '900',
  },
  reviewDate: {
    fontSize: 10.5,
    color: '#9CA3AF',
    flex: 1,
  },
  reviewSize: {
    fontSize: 10.5,
    color: '#6B7280',
    fontWeight: '600',
  },
  reviewCardBody: {
    flexDirection: 'row',
    gap: 10,
  },
  reviewText: {
    flex: 1,
    fontSize: 12,
    color: '#374151',
    lineHeight: 18,
  },
  reviewCardImg: {
    width: 56,
    height: 56,
    borderRadius: 6,
  },
  verifiedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 10,
  },
  verifiedText: {
    fontSize: 10.5,
    color: '#10B981',
    fontWeight: '700',
  },

  // Trust badges
  trustBadgesRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 40,
    paddingVertical: 24,
    borderTopWidth: 8,
    borderTopColor: '#F8F9FB',
  },
  trustBadge: {
    alignItems: 'center',
    gap: 8,
  },
  trustBadgeTitle: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#FF3F6C',
    textAlign: 'center',
    lineHeight: 16,
  },

  // More Info
  moreInfoBlock: {
    borderTopWidth: 8,
    borderTopColor: '#F8F9FB',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  moreInfoTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#1F2937',
    marginBottom: 8,
  },
  moreInfoCode: {
    fontSize: 13,
    color: '#6B7280',
  },
  viewMoreLink: {
    color: '#FF3F6C',
    fontSize: 13,
    fontWeight: '700',
    marginTop: 4,
  },

  // Similar Products
  similarBlock: {
    borderTopWidth: 8,
    borderTopColor: '#F8F9FB',
    paddingTop: 16,
    paddingLeft: 16,
  },
  similarTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: '#1F2937',
    marginBottom: 14,
  },
  similarRow: {
    gap: 12,
    paddingRight: 16,
  },
  similarCard: {
    width: 160,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  similarImg: {
    width: '100%',
    height: 190,
    resizeMode: 'cover',
  },
  similarRatingBadge: {
    position: 'absolute',
    top: 176,
    left: 6,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 4,
    gap: 2,
  },
  similarRatingText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#2E7D32',
  },
  similarInfo: {
    padding: 8,
  },
  similarBrand: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#1F2937',
  },
  similarName: {
    fontSize: 10,
    color: '#6B7280',
    marginTop: 2,
    lineHeight: 14,
  },
  similarPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  similarOriginalPrice: {
    fontSize: 9,
    color: '#9CA3AF',
    textDecorationLine: 'line-through',
  },
  similarSalePrice: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1F2937',
  },
  similarDiscount: {
    fontSize: 9,
    fontWeight: '800',
    color: '#FF3F6C',
  },
  addToBagMini: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#FF3F6C',
    borderRadius: 4,
    paddingVertical: 5,
    alignItems: 'center',
  },
  addToBagMiniText: {
    color: '#FF3F6C',
    fontSize: 10.5,
    fontWeight: '700',
  },

  // You may also like
  youMayBlock: {
    borderTopWidth: 8,
    borderTopColor: '#F8F9FB',
    paddingTop: 16,
    paddingLeft: 16,
    marginTop: 8,
  },
  youMayTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: '#1F2937',
    marginBottom: 14,
  },
  youMayRow: {
    gap: 10,
    paddingRight: 16,
  },
  youMayCard: {
    width: 130,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  youMayImg: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  youMayRatingBadge: {
    position: 'absolute',
    top: 136,
    left: 6,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 4,
    gap: 2,
  },
  youMayRatingText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#2E7D32',
  },
  youMayBrand: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#1F2937',
    padding: 8,
    paddingTop: 4,
  },

  // Sticky bottom bar
  stickyBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    gap: 10,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingHorizontal: 16,
    paddingVertical: 10,
    paddingBottom: 16,
  },
  stickyBuyNow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderWidth: 1.5,
    borderColor: '#FF3F6C',
    borderRadius: 8,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
  },
  stickyBuyNowText: {
    color: '#FF3F6C',
    fontSize: 13,
    fontWeight: '900',
  },
  stickyAddBag: {
    flex: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
  stickyAddBagGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 14,
  },
  stickyAddBagText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
  },
});
