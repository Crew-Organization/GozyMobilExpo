import React from 'react';
import { ScrollView, StyleSheet, Text, View, Pressable, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { useApp } from '@/src/context/app-context';
import { useSuperAppStore } from '@/src/store/super-app-store';
import { colors, radius, spacing } from '@/src/theme/tokens';
import {
  SharedHeader,
  SharedTabBar,
  BannerCarousel,
  BrandCard,
} from '@/src/components/shopping-module/ecosystem';

const beautyBanners = [
  {
    id: 'beauty-b1',
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=1200&q=80',
    title: 'THE GLOW LAB',
    subtitle: 'Serums, Toners & Cleansers starting ₹499',
    deal: 'FLAT 40% OFF',
    productId: 'prod-4',
  },
  {
    id: 'beauty-b2',
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=1200&q=80',
    title: 'MAKEUP ESSENTIALS',
    subtitle: 'Nail polishes, lipsticks & foundations',
    deal: 'MIN 30% OFF',
    productId: 'prod-4',
  },
];

const beautyCategories = [
  { label: 'Skincare', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=150&q=80' },
  { label: 'Makeup', image: 'https://images.unsplash.com/photo-1625093742435-6fa192b6fb10?auto=format&fit=crop&w=150&q=80' },
  { label: 'Haircare', image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=150&q=80' },
  { label: 'Fragrances', image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=150&q=80' },
];

export default function BeautyShoppingScreen() {
  const { products } = useApp();
  const { shoppingCart, setSelectedProduct, toggleWishlist, wishlist } = useSuperAppStore();

  const handleProductPress = (productId: string) => {
    setSelectedProduct(productId);
    router.push('/product-detail');
  };

  const isWishlisted = (productId: string) => {
    return wishlist.some((item) => item.id === productId);
  };

  // Filter Beauty products
  const beautyProducts = products.filter(
    (p) => p.category === 'Beauty' || p.id === 'prod-4'
  );

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <SharedHeader cartCount={shoppingCart.length} />
      <SharedTabBar activeTab="BEAUTY" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Banner Carousel */}
        <BannerCarousel banners={beautyBanners} />

        {/* Circular Categories */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.circleRow}>
          {beautyCategories.map((cat, idx) => (
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
                  <MaterialCommunityIcons name={(cat as any).icon as any} size={24} color="#1F2937" />
                )}
              </View>
              <Text style={styles.circleLabel}>{cat.label}</Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Brand Storefronts */}
        <View style={styles.sectionBlock}>
          <Text style={styles.sectionTitle}>Trending Beauty Brands</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.brandRow}>
            <BrandCard
              name="Luma Skin"
              offer="FLAT 50% OFF"
              logo="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=100&q=80"
              image="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=400&q=80"
              productId="prod-4"
            />
          </ScrollView>
        </View>

        {/* Product Grid */}
        <View style={styles.sectionBlock}>
          <Text style={styles.sectionTitle}>Curated Beauty Range</Text>
          <View style={styles.productGrid}>
            {beautyProducts.map((product) => {
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
    backgroundColor: '#FFFFFF',
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
    color: '#1F2937',
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
    color: '#1F2937',
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
    backgroundColor: '#FFFFFF',
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: '#ECECEC',
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
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  productInfo: {
    padding: spacing.sm,
  },
  brandName: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1F2937',
  },
  productTitle: {
    fontSize: 10,
    color: '#6B7280',
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
    color: '#1F2937',
  },
  originalPrice: {
    fontSize: 10,
    color: '#9CA3AF',
    textDecorationLine: 'line-through',
  },
  discountText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#FF3F6C',
  },
});
