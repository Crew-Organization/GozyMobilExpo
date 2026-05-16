import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { Chip } from '@/src/components/chip';
import { MediaCard } from '@/src/components/media-card';
import { ScreenShell } from '@/src/components/screen-shell';
import { SectionHeader } from '@/src/components/section-header';
import { TopBar } from '@/src/components/top-bar';
import { useApp } from '@/src/context/app-context';
import { buildProductPriceLabel, shoppingCategories } from '@/src/lib/commerce-data';
import { useSuperAppStore } from '@/src/store/super-app-store';
import { colors, radius, spacing, typography } from '@/src/theme/tokens';

export default function ShoppingScreen() {
  const { products } = useApp();
  const { shoppingCart, setSelectedProduct, toggleWishlist, wishlist } = useSuperAppStore();
  const [selectedCategory, setSelectedCategory] = useState<(typeof shoppingCategories)[number]>('All');

  const visibleProducts = products.filter(
    (product) => selectedCategory === 'All' || product.category === selectedCategory,
  );

  return (
    <ScreenShell>
      <TopBar
        eyebrow="Shopping"
        primaryAction={{ icon: 'arrow-left', onPress: () => router.back() }}
        secondaryAction={{ icon: 'cart-outline', onPress: () => router.push('/shopping-checkout') }}
        subtitle="Amazon-style discovery, Myntra-style fashion curation, and Flipkart-like deal cards."
        title={`Shop smart • ${shoppingCart.length} in cart`}
      />

      <View style={styles.heroCard}>
        <Text style={styles.heroEyebrow}>Trending deals</Text>
        <Text style={styles.heroTitle}>Tonight&apos;s fashion and tech shortlist</Text>
        <Text style={styles.heroBody}>
          Compact cards, fast compare, and clean product detail flow built for Android-first browsing.
        </Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
        {shoppingCategories.map((category) => (
          <Chip
            key={category}
            label={category}
            onPress={() => setSelectedCategory(category)}
            selected={selectedCategory === category}
          />
        ))}
      </ScrollView>

      <View style={styles.sectionBlock}>
        <SectionHeader subtitle="Trending and recommended" title="Top picks" />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.carouselRow}>
          {products.map((product) => (
            <MediaCard
              key={product.id}
              badge={product.badge}
              image={product.image}
              meta={`${product.brand} • ${product.rating.toFixed(1)}`}
              onPress={() => {
                setSelectedProduct(product.id);
                router.push('/product-detail');
              }}
              priceLabel={buildProductPriceLabel(product)}
              subtitle={product.category}
              title={product.name}
              width={208}
            />
          ))}
        </ScrollView>
      </View>

      <View style={styles.sectionBlock}>
        <SectionHeader subtitle="Grid view for fast comparison" title="Browse all" />
        <View style={styles.grid}>
          {visibleProducts.map((product) => {
            const saved = wishlist.some((item) => item.id === product.id);
            return (
              <View key={product.id} style={styles.gridCard}>
                <Pressable
                  onPress={() => {
                    setSelectedProduct(product.id);
                    router.push('/product-detail');
                  }}>
                  <MediaCard
                    compact
                    image={product.image}
                    meta={product.brand}
                    priceLabel={buildProductPriceLabel(product)}
                    subtitle={product.category}
                    title={product.name}
                    width={160}
                  />
                </Pressable>
                <Pressable
                  onPress={() => toggleWishlist(product)}
                  style={styles.heartButton}>
                  <MaterialCommunityIcons
                    color={saved ? colors.coral : colors.textMuted}
                    name={saved ? 'heart' : 'heart-outline'}
                    size={18}
                  />
                </Pressable>
              </View>
            );
          })}
        </View>
      </View>

      {shoppingCart.length > 0 ? (
        <Pressable onPress={() => router.push('/shopping-checkout')} style={styles.checkoutBar}>
          <Text style={styles.checkoutText}>Continue shopping checkout</Text>
        </Pressable>
      ) : null}
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  heroCard: {
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  heroEyebrow: {
    color: colors.sky,
    fontSize: typography.caption,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  heroTitle: {
    color: colors.text,
    fontSize: typography.title,
    fontWeight: '900',
  },
  heroBody: {
    color: colors.textMuted,
    fontSize: typography.body,
    lineHeight: 21,
  },
  chipRow: {
    gap: spacing.sm,
  },
  sectionBlock: {
    gap: spacing.sm,
  },
  carouselRow: {
    gap: spacing.md,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  gridCard: {
    width: '47%',
    position: 'relative',
  },
  heartButton: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    width: 32,
    height: 32,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,255,255,0.94)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkoutBar: {
    borderRadius: radius.pill,
    backgroundColor: colors.text,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  checkoutText: {
    color: '#FFFFFF',
    fontSize: typography.body,
    fontWeight: '800',
  },
});
