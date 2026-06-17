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

const kidsBanners = [
  {
    id: 'kids-b1',
    image: 'https://images.unsplash.com/photo-1519457431-44cacac7a15a?auto=format&fit=crop&w=1200&q=80',
    title: 'THE FUN PLAYROOM',
    subtitle: 'Colorful, durable outfits starting ₹299',
    deal: 'FLAT 50% OFF',
    productId: 'prod-1',
  },
  {
    id: 'kids-b2',
    image: 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=1200&q=80',
    title: 'BACK TO SCHOOL',
    subtitle: 'School uniforms, bags & shoes from top brands',
    deal: 'MIN 30% OFF',
    productId: 'prod-3',
  },
];

const kidsCategories = [
  { label: 'Boys', image: 'https://images.unsplash.com/photo-1519457431-44cacac7a15a?auto=format&fit=crop&w=150&q=80' },
  { label: 'Girls', image: 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=150&q=80' },
  { label: 'Infants', image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=150&q=80' },
  { label: 'Toys', image: 'https://images.unsplash.com/photo-1531325082793-ca7c9db6a2c6?auto=format&fit=crop&w=150&q=80' },
];

export default function KidsShoppingScreen() {
  const { products } = useApp();
  const { shoppingCart, setSelectedProduct, toggleWishlist, wishlist } = useSuperAppStore();

  const handleProductPress = (productId: string) => {
    setSelectedProduct(productId);
    router.push('/product-detail');
  };

  const isWishlisted = (productId: string) => {
    return wishlist.some((item) => item.id === productId);
  };

  const kidsProducts = products.filter(
    (p) => p.category === 'Kids' || p.id === 'prod-1' || p.id === 'prod-3'
  );

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <SharedHeader cartCount={shoppingCart.length} />
      <SharedTabBar activeTab="KIDS" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Banner Carousel */}
        <BannerCarousel banners={kidsBanners} />

        {/* Circular Categories */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.circleRow}>
          {kidsCategories.map((cat, idx) => (
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
          <Text style={styles.sectionTitle}>Kids Featured Brands</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.brandRow}>
            <BrandCard
              name="Gini & Jony"
              offer="FLAT 40% OFF"
              logo="https://images.unsplash.com/photo-1519457431-44cacac7a15a?auto=format&fit=crop&w=100&q=80"
              image="https://images.unsplash.com/photo-1519457431-44cacac7a15a?auto=format&fit=crop&w=400&q=80"
              productId="prod-1"
            />
            <BrandCard
              name="Nike Kids"
              offer="MIN 25% OFF"
              logo="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=100&q=80"
              image="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=400&q=80"
              productId="prod-3"
            />
          </ScrollView>
        </View>

        {/* Product Grid */}
        <View style={styles.sectionBlock}>
          <Text style={styles.sectionTitle}>Curated Kids Wear</Text>
          <View style={styles.productGrid}>
            {kidsProducts.map((product) => {
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
