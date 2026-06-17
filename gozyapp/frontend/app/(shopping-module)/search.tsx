import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View, TextInput, Pressable, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { useApp } from '@/src/context/app-context';
import { useSuperAppStore } from '@/src/store/super-app-store';
import { colors, radius, spacing } from '@/src/theme/tokens';

const popularKeywords = ['Shirt', 'T-Shirt', 'Dress', 'Sneakers', 'Serum', 'Bag'];

export default function SearchScreen() {
  const { products } = useApp();
  const { setSelectedProduct, toggleWishlist, wishlist } = useSuperAppStore();
  const [query, setQuery] = useState('');

  const handleProductPress = (productId: string) => {
    setSelectedProduct(productId);
    router.push('/product-detail');
  };

  const isWishlisted = (productId: string) => {
    return wishlist.some((item) => item.id === productId);
  };

  // Filter products dynamically
  const searchResults = products.filter(
    (p) => p.name.toLowerCase().includes(query.toLowerCase()) ||
           p.brand.toLowerCase().includes(query.toLowerCase()) ||
           p.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      {/* Header bar */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#1F2937" />
        </Pressable>

        <View style={styles.searchBarWrapper}>
          <MaterialCommunityIcons name="magnify" size={20} color={colors.textLight} style={{ marginRight: 6 }} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search clothes, brands, collections..."
            placeholderTextColor={colors.textLight}
            autoFocus
            style={styles.searchInput}
          />
          {query.length > 0 && (
            <Pressable onPress={() => setQuery('')}>
              <MaterialCommunityIcons name="close-circle" size={18} color={colors.textLight} />
            </Pressable>
          )}
        </View>
      </View>

      {/* Suggested chips or matches */}
      {query.length === 0 ? (
        <ScrollView contentContainerStyle={styles.suggestContent}>
          <Text style={styles.suggestHeading}>Popular Searches</Text>
          <View style={styles.chipsRow}>
            {popularKeywords.map((tag) => (
              <Pressable key={tag} onPress={() => setQuery(tag)} style={styles.chip}>
                <Text style={styles.chipText}>{tag}</Text>
              </Pressable>
            ))}
          </View>
        </ScrollView>
      ) : (
        <ScrollView contentContainerStyle={styles.resultsContent}>
          <Text style={styles.resultsCount}>Found {searchResults.length} matches</Text>
          
          <View style={styles.productGrid}>
            {searchResults.map((product) => {
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
      )}
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
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backBtn: {
    padding: 4,
    marginRight: 6,
  },
  searchBarWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
    backgroundColor: '#F3F4F6',
    borderRadius: radius.md,
    paddingHorizontal: spacing.sm,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 13,
    color: colors.text,
    paddingVertical: 0,
  },
  suggestContent: {
    padding: spacing.md,
  },
  suggestHeading: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.textMuted,
    marginBottom: spacing.md,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  chip: {
    backgroundColor: '#F3F4F6',
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
  },
  chipText: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '700',
  },
  resultsContent: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    paddingBottom: 40,
  },
  resultsCount: {
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
