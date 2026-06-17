import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Redirect, router } from 'expo-router';
import { Image } from 'expo-image';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { ScreenShell } from '@/src/components/screen-shell';
import { TopBar } from '@/src/components/top-bar';
import { useApp } from '@/src/context/app-context';
import { buildProductPriceLabel } from '@/src/lib/commerce-data';
import { useSuperAppStore } from '@/src/store/super-app-store';
import { colors, radius, spacing, typography } from '@/src/theme/tokens';

export default function ProductDetailScreen() {
  const { products } = useApp();
  const { addProduct, selectedProductId, shoppingCart, toggleWishlist, wishlist } = useSuperAppStore();

  const product = products.find((item) => item.id === selectedProductId);
  if (!product) {
    return <Redirect href="/shopping" />;
  }

  const saved = wishlist.some((item) => item.id === product.id);

  return (
    <ScreenShell>
      <TopBar
        eyebrow="Product"
        primaryAction={{ icon: 'arrow-left', onPress: () => router.back() }}
        secondaryAction={{ icon: 'cart-outline', onPress: () => router.push('/shopping-checkout') }}
        subtitle={`${product.brand} • ${product.category}`}
        title={product.name}
      />

      <View style={styles.imageCard}>
        <Image contentFit="cover" source={{ uri: product.image }} style={styles.image} />
        <Pressable onPress={() => toggleWishlist(product)} style={styles.heartButton}>
          <MaterialCommunityIcons
            color={saved ? colors.coral : colors.textMuted}
            name={saved ? 'heart' : 'heart-outline'}
            size={20}
          />
        </Pressable>
      </View>

      <View style={styles.detailCard}>
        <Text style={styles.brand}>{product.brand}</Text>
        <Text style={styles.price}>{buildProductPriceLabel(product)}</Text>
        <Text style={styles.originalPrice}>Rs {product.originalPrice.toLocaleString('en-IN')}</Text>
        <Text style={styles.rating}>{product.rating.toFixed(1)} rated • Premium curated listing</Text>
        {product.sizes ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.sizeRow}>
            {product.sizes.map((size) => (
              <View key={size} style={styles.sizeChip}>
                <Text style={styles.sizeChipText}>{size}</Text>
              </View>
            ))}
          </ScrollView>
        ) : null}
      </View>

      <Pressable onPress={() => addProduct(product)} style={styles.primaryButton}>
        <Text style={styles.primaryButtonText}>Add to cart</Text>
      </Pressable>

      {shoppingCart.length > 0 ? (
        <Pressable onPress={() => router.push('/shopping-checkout')} style={styles.secondaryButton}>
          <Text style={styles.secondaryButtonText}>Go to checkout</Text>
        </Pressable>
      ) : null}
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  imageCard: {
    borderRadius: radius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 320,
  },
  heartButton: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,255,255,0.92)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailCard: {
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  brand: {
    color: colors.textMuted,
    fontSize: typography.caption,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  price: {
    color: colors.text,
    fontSize: typography.title,
    fontWeight: '900',
  },
  originalPrice: {
    color: colors.textMuted,
    fontSize: typography.body,
    textDecorationLine: 'line-through',
  },
  rating: {
    color: colors.textMuted,
    fontSize: typography.body,
  },
  sizeRow: {
    gap: spacing.sm,
  },
  sizeChip: {
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.line,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  sizeChipText: {
    color: colors.text,
    fontSize: typography.caption,
    fontWeight: '800',
  },
  primaryButton: {
    borderRadius: radius.pill,
    backgroundColor: colors.sky,
    paddingVertical: 16,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: typography.body,
    fontWeight: '800',
  },
  secondaryButton: {
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.lineStrong,
    backgroundColor: colors.surface,
    paddingVertical: 16,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: '800',
  },
});
