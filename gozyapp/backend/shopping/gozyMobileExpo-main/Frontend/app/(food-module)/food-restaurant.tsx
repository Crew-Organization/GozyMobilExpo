import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Redirect, router } from 'expo-router';
import { Image } from 'expo-image';

import { ScreenShell } from '@/src/components/screen-shell';
import { TopBar } from '@/src/components/top-bar';
import { useApp } from '@/src/context/app-context';
import { useSuperAppStore } from '@/src/store/super-app-store';
import { colors, radius, spacing, typography } from '@/src/theme/tokens';

export default function FoodRestaurantScreen() {
  const { restaurants } = useApp();
  const { addRestaurantItem, foodCart, selectedRestaurantId } = useSuperAppStore();

  const restaurant = restaurants.find((item) => item.id === selectedRestaurantId);
  if (!restaurant) {
    return <Redirect href="/food" />;
  }

  return (
    <ScreenShell>
      <TopBar
        eyebrow="Restaurant"
        primaryAction={{ icon: 'arrow-left', onPress: () => router.back() }}
        secondaryAction={{ icon: 'cart-outline', onPress: () => router.push('/food-checkout') }}
        subtitle={`${restaurant.cuisine} • ${restaurant.rating.toFixed(1)} • ${restaurant.eta}`}
        title={restaurant.name}
      />

      <View style={styles.heroCard}>
        <Image contentFit="cover" source={{ uri: restaurant.image }} style={styles.heroImage} />
        <View style={styles.heroBody}>
          <Text style={styles.offer}>{restaurant.offer}</Text>
          <Text style={styles.meta}>
            {restaurant.distance} • {restaurant.priceForTwo}
          </Text>
        </View>
      </View>

      <View style={styles.reviewCard}>
        <Text style={styles.sectionTitle}>Popular reviews</Text>
        {restaurant.reviews.map((review) => (
          <Text key={review} style={styles.reviewText}>
            {review}
          </Text>
        ))}
      </View>

      <View style={styles.reviewCard}>
        <Text style={styles.sectionTitle}>Menu</Text>
        {restaurant.menu.map((item) => (
          <View key={item.id} style={styles.menuRow}>
            <View style={styles.menuCopy}>
              <Text style={styles.menuTitle}>{item.name}</Text>
              <Text style={styles.menuDesc}>{item.description}</Text>
              <Text style={styles.menuPrice}>Rs {item.price}</Text>
            </View>
            <Pressable
              onPress={() => addRestaurantItem(restaurant, item)}
              style={styles.addButton}>
              <Text style={styles.addButtonText}>Add</Text>
            </Pressable>
          </View>
        ))}
      </View>

      {foodCart.length > 0 ? (
        <Pressable onPress={() => router.push('/food-checkout')} style={styles.checkoutBar}>
          <Text style={styles.checkoutBarText}>Continue to checkout</Text>
        </Pressable>
      ) : null}
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  heroCard: {
    borderRadius: radius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface,
  },
  heroImage: {
    width: '100%',
    height: 210,
  },
  heroBody: {
    padding: spacing.lg,
    gap: 6,
  },
  offer: {
    color: colors.coral,
    fontSize: typography.caption,
    fontWeight: '800',
  },
  meta: {
    color: colors.textMuted,
    fontSize: typography.body,
  },
  reviewCard: {
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface,
    padding: spacing.lg,
    gap: spacing.md,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: typography.section,
    fontWeight: '900',
  },
  reviewText: {
    color: colors.textMuted,
    fontSize: typography.body,
    lineHeight: 21,
    paddingTop: spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.line,
  },
  menuRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.line,
  },
  menuCopy: {
    flex: 1,
    gap: 4,
  },
  menuTitle: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: '800',
  },
  menuDesc: {
    color: colors.textMuted,
    fontSize: typography.caption,
    lineHeight: 18,
  },
  menuPrice: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: '800',
    marginTop: 4,
  },
  addButton: {
    alignSelf: 'flex-start',
    borderRadius: radius.pill,
    backgroundColor: colors.sky,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: typography.caption,
    fontWeight: '800',
  },
  checkoutBar: {
    borderRadius: radius.pill,
    backgroundColor: colors.text,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  checkoutBarText: {
    color: '#FFFFFF',
    fontSize: typography.body,
    fontWeight: '800',
  },
});
