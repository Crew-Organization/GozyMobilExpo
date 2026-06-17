import React from 'react';
import { ScrollView, StyleSheet, Text, View, Pressable, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { useApp } from '@/src/context/app-context';
import { useSuperAppStore } from '@/src/store/super-app-store';
import { colors, radius, spacing } from '@/src/theme/tokens';

export default function BrandStoreScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { products } = useApp();
  const { setSelectedProduct, toggleWishlist, wishlist } = useSuperAppStore();

  const handleProductPress = (productId: string) => {
    setSelectedProduct(productId);
    router.push('/product-detail');
  };

  const isWishlisted = (productId: string) => {
    return wishlist.some((item) => item.id === productId);
  };

  const brandName = id ? id.charAt(0).toUpperCase() + id.slice(1) : 'Boutique';

  // Filter products by brand matching
  const brandProducts = products.filter(
    (p) => p.brand.toLowerCase().includes(brandName.toLowerCase()) || 
           brandName.toLowerCase() === 'roadster' && p.brand === 'Gozy Studio' ||
           brandName.toLowerCase() === 'puma' && p.brand === 'Axis'
  );

  const visibleProducts = brandProducts.length > 0 ? brandProducts : products;

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      {/* Sticky Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#1F2937" />
        </Pressable>
        <Text style={styles.headerTitle}>{brandName} Store</Text>
        <Pressable onPress={() => router.push('/shopping-checkout')} style={styles.bagBtn}>
          <MaterialCommunityIcons name="cart-outline" size={24} color="#1F2937" />
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Brand Banner */}
        <LinearGradient
          colors={['#1F2937', '#111827']}
          style={styles.brandHero}
        >
          <Text style={styles.brandHeroTitle}>{brandName.toUpperCase()}</Text>
          <Text style={styles.brandHeroSub}>OFFICIAL BRAND STORE storefront</Text>
          <View style={styles.couponBadge}>
            <Text style={styles.couponText}>EXTRA 15% OFF USING CODE: GOZYBRAND</Text>
          </View>
        </LinearGradient>

        <Text style={styles.gridHeading}>Collection ({visibleProducts.length} items)</Text>
        
        {/* Products Grid */}
        <View style={styles.productGrid}>
          {visibleProducts.map((product) => {
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
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1F2937',
  },
  bagBtn: {
    padding: 4,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  brandHero: {
    paddingVertical: 32,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandHeroTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  brandHeroSub: {
    color: '#9CA3AF',
    fontSize: 10.5,
    marginTop: 4,
    fontWeight: '700',
  },
  couponBadge: {
    backgroundColor: '#FF3F6C',
    borderRadius: radius.sm,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginTop: 12,
  },
  couponText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
  },
  gridHeading: {
    fontSize: 13,
    fontWeight: '800',
    color: '#6B7280',
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  productGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    paddingHorizontal: spacing.md,
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
