import React from 'react';
import { ScrollView, StyleSheet, Text, View, Pressable, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { useApp } from '@/src/context/app-context';
import { useSuperAppStore } from '@/src/store/super-app-store';
import { colors, radius, spacing } from '@/src/theme/tokens';
import {
  SharedHeader,
  SharedTabBar,
  BannerCarousel,
  BrandCard,
} from '@/src/components/shopping-module/ecosystem';

const luxeBanners = [
  {
    id: 'luxe-b1',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=80',
    title: 'THE COUTURE EDIT',
    subtitle: 'Designer collections, couture details & apparel',
    deal: 'LUXURY SELECTIONS',
    productId: 'prod-1',
  },
  {
    id: 'luxe-b2',
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=80',
    title: 'CHRONO LUXURY WATCHES',
    subtitle: 'Exquisite timepieces from global heritage brands',
    deal: 'MIN 20% OFF',
    productId: 'prod-3',
  },
];

const luxeCategories = [
  { label: 'Watches', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=150&q=80' },
  { label: 'Couture', image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=150&q=80' },
  { label: 'Fine Bags', image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=150&q=80' },
];

export default function LuxeShoppingScreen() {
  const { products } = useApp();
  const { shoppingCart, setSelectedProduct, toggleWishlist, wishlist } = useSuperAppStore();

  const handleProductPress = (productId: string) => {
    setSelectedProduct(productId);
    router.push('/product-detail');
  };

  const isWishlisted = (productId: string) => {
    return wishlist.some((item) => item.id === productId);
  };

  const luxeProducts = products.filter(
    (p) => p.id === 'prod-1' || p.id === 'prod-3'
  );

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <SharedHeader cartCount={shoppingCart.length} />
      <SharedTabBar activeTab="LUXE" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Luxe Banner Carousel */}
        <BannerCarousel banners={luxeBanners} />

        {/* Categories row */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.circleRow}>
          {luxeCategories.map((cat, idx) => (
            <Pressable
              key={idx}
              onPress={() => {
                const slug = cat.label.toLowerCase().replace(/\s+/g, '-');
                router.push({ pathname: '/category/[id]', params: { id: slug } } as any);
              }}
              style={styles.circleItem}
            >
              <View style={styles.circleIconContainer}>
                {cat.image ? (
                  <Image source={{ uri: cat.image }} style={styles.circleImg} />
                ) : (
                  <MaterialCommunityIcons name={(cat as any).icon as any} size={24} color="#FFFFFF" />
                )}
              </View>
              <Text style={styles.circleLabel}>{cat.label}</Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Brand Storefronts */}
        <View style={styles.sectionBlock}>
          <Text style={styles.sectionTitle}>Exclusive Designer Boutiques</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.brandRow}>
            <BrandCard
              name="Exclusive Luxe"
              offer="UP TO 20% CASHBACK"
              logo="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=100&q=80"
              image="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=400&q=80"
              productId="prod-1"
            />
          </ScrollView>
        </View>

        {/* Product Grid */}
        <View style={styles.sectionBlock}>
          <Text style={styles.sectionTitle}>Luxe Shortlist</Text>
          <View style={styles.productGrid}>
            {luxeProducts.map((product) => {
              const saved = isWishlisted(product.id);
              return (
                <View key={product.id} style={styles.productCard}>
                  <Pressable onPress={() => handleProductPress(product.id)}>
                    <Image source={{ uri: product.image }} style={styles.productImg} />
                    <Pressable
                      style={styles.heartBtn}
                      onPress={() => toggleWishlist(product)}
                    >
                      <MaterialCommunityIcons
                        name={saved ? 'heart' : 'heart-outline'}
                        size={18}
                        color={saved ? '#FF3F6C' : '#6B7280'}
                      />
                    </Pressable>
                  </Pressable>
                  <View style={styles.productInfo}>
                    <Text style={styles.brandName}>{product.brand}</Text>
                    <Text style={styles.productTitle} numberOfLines={1}>
                      {product.name}
                    </Text>
                    <View style={styles.priceRow}>
                      <Text style={styles.priceText}>₹{product.price}</Text>
                      <Text style={styles.originalPrice}>₹{product.originalPrice}</Text>
                      <Text style={styles.discountText}>
                        ({Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF)
                      </Text>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A050D', // Dark premium background
  },
  scrollContent: {
    paddingBottom: 40,
  },
  circleRow: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    gap: spacing.lg,
  },
  circleItem: {
    alignItems: 'center',
    width: 68,
  },
  circleIconContainer: {
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  circleImg: {
    width: '100%',
    height: '100%',
    borderRadius: 29,
  },
  circleLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#D4AF37', // Gold text
    marginTop: 6,
    textAlign: 'center',
  },
  sectionBlock: {
    marginTop: spacing.lg,
    paddingHorizontal: spacing.md,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#D4AF37', // Gold title
    marginBottom: spacing.md,
  },
  brandRow: {
    gap: spacing.md,
  },
  productGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  productCard: {
    width: '48%',
    backgroundColor: '#1C1622',
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: '#3D314A',
    overflow: 'hidden',
    marginBottom: spacing.md,
  },
  productImg: {
    width: '100%',
    height: 180,
  },
  heartBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(28,22,34,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  productInfo: {
    padding: spacing.sm,
  },
  brandName: {
    fontSize: 12,
    fontWeight: '800',
    color: '#D4AF37',
  },
  productTitle: {
    fontSize: 10,
    color: '#A093B1',
    marginTop: 2,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 4,
  },
  priceText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  originalPrice: {
    fontSize: 10,
    color: '#7C6F8E',
    textDecorationLine: 'line-through',
  },
  discountText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#D4AF37',
  },
});
