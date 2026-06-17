import React from 'react';
import { ScrollView, StyleSheet, Text, View, Pressable, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { useApp } from '@/src/context/app-context';
import { useSuperAppStore } from '@/src/store/super-app-store';
import { colors, radius, spacing } from '@/src/theme/tokens';

export default function CategoryDetailScreen() {
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

  // Resolve active category label
  const categoryLabel = id ? id.charAt(0).toUpperCase() + id.slice(1) : 'Catalog';

  // Filter products by category, subcategory, name, or brand match
  const slug = id ? id.toLowerCase() : '';
  const filteredProducts = products.filter((p) => {
    // Exact or partial subcategory match
    if (p.subcategory && (p.subcategory.toLowerCase() === slug || slug.includes(p.subcategory.toLowerCase()) || p.subcategory.toLowerCase().includes(slug))) {
      return true;
    }
    // Category match
    if (p.category.toLowerCase() === slug || p.category.toLowerCase().includes(slug) || slug.includes(p.category.toLowerCase())) {
      return true;
    }
    // Name or Brand match
    if (p.name.toLowerCase().includes(slug) || p.brand.toLowerCase().includes(slug)) {
      return true;
    }
    
    // Explicit custom mapping logic
    const categoryLabelLower = categoryLabel.toLowerCase();
    if (categoryLabelLower.includes('hair') && p.subcategory === 'haircare') return true;
    if (categoryLabelLower.includes('skin') && p.subcategory === 'skincare') return true;
    if (categoryLabelLower.includes('makeup') && p.subcategory === 'makeup') return true;
    if (categoryLabelLower.includes('fragrance') && p.subcategory === 'fragrances') return true;
    
    if (categoryLabelLower.includes('topwear') && p.subcategory === 'topwear') return true;
    if (categoryLabelLower.includes('bottomwear') && p.subcategory === 'bottomwear') return true;
    if (categoryLabelLower.includes('ethnic') && p.subcategory === 'ethnic') return true;
    if (categoryLabelLower.includes('dresses') && p.subcategory === 'dresses') return true;
    
    if (categoryLabelLower.includes('boys') && p.subcategory === 'boys-wear') return true;
    if (categoryLabelLower.includes('girls') && p.subcategory === 'girls-wear') return true;
    if (categoryLabelLower.includes('infant') && p.subcategory === 'infants') return true;
    
    if (categoryLabelLower.includes('bed') && p.subcategory === 'bed-linen') return true;
    if (categoryLabelLower.includes('curtain') && p.subcategory === 'curtains') return true;
    if (categoryLabelLower.includes('cushion') && p.subcategory === 'cushions') return true;
    if (categoryLabelLower.includes('decor') && p.subcategory === 'decor') return true;
    if (categoryLabelLower.includes('bath') && p.subcategory === 'bath') return true;
    
    return false;
  });

  // Dynamic fallback: If no products match the subcategory, filter by the parent category group (Beauty, Fashion, Kids, Home)
  // so we don't show unrelated products (e.g. show Beauty products if they clicked a Beauty subcategory like "Daily Care")
  let visibleProducts = filteredProducts;
  if (visibleProducts.length === 0) {
    const parentCategory = (
      slug.includes('hair') ||
      slug.includes('skin') ||
      slug.includes('care') ||
      slug.includes('makeup') ||
      slug.includes('fragrance') ||
      slug.includes('beauty') ||
      slug.includes('lipstick') ||
      slug.includes('lips') ||
      slug.includes('cosmetic') ||
      slug.includes('serum') ||
      slug.includes('toner') ||
      slug.includes('cream') ||
      slug.includes('lotion') ||
      slug.includes('glam')
    )
      ? 'Beauty'
      : (
        slug.includes('bed') ||
        slug.includes('linen') ||
        slug.includes('curtain') ||
        slug.includes('cushion') ||
        slug.includes('decor') ||
        slug.includes('pillow') ||
        slug.includes('bath') ||
        slug.includes('home') ||
        slug.includes('living') ||
        slug.includes('sheet') ||
        slug.includes('towel') ||
        slug.includes('vase')
      )
      ? 'Home'
      : (
        slug.includes('boy') ||
        slug.includes('girl') ||
        slug.includes('infant') ||
        slug.includes('kids') ||
        slug.includes('toddler') ||
        slug.includes('play') ||
        slug.includes('child') ||
        slug.includes('baby') ||
        slug.includes('romper')
      )
      ? 'Kids'
      : 'Fashion';
    visibleProducts = products.filter((p) => p.category === parentCategory);
  }

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      {/* Sticky Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#1F2937" />
        </Pressable>
        <Text style={styles.headerTitle}>{categoryLabel} Store</Text>
        <Pressable onPress={() => router.push('/shopping-checkout')} style={styles.bagBtn}>
          <MaterialCommunityIcons name="cart-outline" size={24} color="#1F2937" />
        </Pressable>
      </View>

      {/* Grid listing */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.gridHeading}>Surfacing {visibleProducts.length} Premium Styles</Text>
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
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    paddingBottom: 40,
  },
  gridHeading: {
    fontSize: 13,
    fontWeight: '800',
    color: '#6B7280',
    marginBottom: spacing.md,
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
