import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Image } from 'expo-image';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { Chip } from '@/src/components/chip';
import { MediaCard } from '@/src/components/media-card';
import { ScreenShell } from '@/src/components/screen-shell';
import { SectionHeader } from '@/src/components/section-header';
import { SkeletonCard } from '@/src/components/skeleton-card';
import { TopBar } from '@/src/components/top-bar';
import { useApp } from '@/src/context/app-context';
import { foodCuisines } from '@/src/lib/commerce-data';
import { useSuperAppStore } from '@/src/store/super-app-store';
import { colors, radius, spacing, typography } from '@/src/theme/tokens';

export default function FoodScreen() {
  const { isHydrating, recommendations, restaurants } = useApp();
  const { foodCart, setSelectedRestaurant } = useSuperAppStore();
  const [selectedCuisine, setSelectedCuisine] = useState<(typeof foodCuisines)[number]>('All');

  const visibleRestaurants = useMemo(() => {
    if (selectedCuisine === 'All') {
      return restaurants;
    }

    return restaurants.filter((restaurant) =>
      restaurant.cuisine.toLowerCase().includes(selectedCuisine.toLowerCase()),
    );
  }, [restaurants, selectedCuisine]);

  if (isHydrating) {
    return (
      <ScreenShell>
        <TopBar
          eyebrow="Food"
          primaryAction={{ icon: 'arrow-left', onPress: () => router.back() }}
          title="Loading food picks"
          subtitle="Bringing restaurants, offers, and menus together."
        />
        <SkeletonCard height={180} />
        <SkeletonCard height={140} />
      </ScreenShell>
    );
  }

  return (
    <ScreenShell>
      <TopBar
        eyebrow="Food"
        primaryAction={{ icon: 'arrow-left', onPress: () => router.back() }}
        secondaryAction={{ icon: 'cart-outline', onPress: () => router.push('/food-checkout') }}
        subtitle="Carousel-led restaurant discovery with compact menus, offers, and direct order flow."
        title={`Order food • ${foodCart.length} in cart`}
      />

      <View style={styles.heroCard}>
        <View style={styles.heroCopy}>
          <Text style={styles.heroTitle}>Dinner picks that convert fast</Text>
          <Text style={styles.heroBody}>{recommendations[1] ?? recommendations[0]}</Text>
        </View>
        <Image
          contentFit="cover"
          source={{
            uri: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
          }}
          style={styles.heroImage}
        />
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
        {foodCuisines.map((cuisine) => (
          <Chip
            key={cuisine}
            label={cuisine}
            onPress={() => setSelectedCuisine(cuisine)}
            selected={selectedCuisine === cuisine}
          />
        ))}
      </ScrollView>

      <View style={styles.sectionBlock}>
        <SectionHeader subtitle="Trending and high-confidence picks" title="Trending now" />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.carouselRow}>
          {restaurants.map((restaurant) => (
            <MediaCard
              key={restaurant.id}
              badge={restaurant.offer}
              image={restaurant.image}
              meta={`${restaurant.rating.toFixed(1)} • ${restaurant.eta}`}
              onPress={() => {
                setSelectedRestaurant(restaurant.id);
                router.push('/food-restaurant');
              }}
              priceLabel={restaurant.priceForTwo}
              subtitle={restaurant.cuisine}
              title={restaurant.name}
              width={220}
            />
          ))}
        </ScrollView>
      </View>

      <View style={styles.sectionBlock}>
        <SectionHeader subtitle="Compact cards near your current zone" title="Near you" />
        {visibleRestaurants.map((restaurant) => (
          <Pressable
            key={restaurant.id}
            onPress={() => {
              setSelectedRestaurant(restaurant.id);
              router.push('/food-restaurant');
            }}
            style={styles.restaurantRow}>
            <Image contentFit="cover" source={{ uri: restaurant.image }} style={styles.restaurantThumb} />
            <View style={styles.restaurantCopy}>
              <View style={styles.rowBetween}>
                <Text style={styles.restaurantName}>{restaurant.name}</Text>
                <Text style={styles.restaurantRating}>{restaurant.rating.toFixed(1)}</Text>
              </View>
              <Text style={styles.restaurantMeta}>
                {restaurant.cuisine} • {restaurant.eta} • {restaurant.distance}
              </Text>
              <Text style={styles.restaurantOffer}>{restaurant.offer}</Text>
            </View>
          </Pressable>
        ))}
      </View>

      {foodCart.length > 0 ? (
        <Pressable onPress={() => router.push('/food-checkout')} style={styles.checkoutBar}>
          <View>
            <Text style={styles.checkoutLabel}>Food cart</Text>
            <Text style={styles.checkoutValue}>{foodCart.length} items ready</Text>
          </View>
          <MaterialCommunityIcons color="#FFFFFF" name="arrow-right" size={20} />
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
    overflow: 'hidden',
  },
  heroCopy: {
    padding: spacing.lg,
    gap: spacing.sm,
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
  heroImage: {
    width: '100%',
    height: 150,
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
  restaurantRow: {
    flexDirection: 'row',
    gap: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface,
    padding: spacing.sm,
  },
  restaurantThumb: {
    width: 96,
    height: 96,
    borderRadius: radius.md,
  },
  restaurantCopy: {
    flex: 1,
    justifyContent: 'space-between',
    gap: 6,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  restaurantName: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: '800',
    flex: 1,
  },
  restaurantRating: {
    color: colors.success,
    fontSize: typography.caption,
    fontWeight: '800',
  },
  restaurantMeta: {
    color: colors.textMuted,
    fontSize: typography.caption,
    lineHeight: 18,
  },
  restaurantOffer: {
    color: colors.coral,
    fontSize: typography.caption,
    fontWeight: '800',
  },
  checkoutBar: {
    borderRadius: radius.lg,
    backgroundColor: colors.text,
    padding: spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  checkoutLabel: {
    color: 'rgba(255,255,255,0.72)',
    fontSize: typography.caption,
    fontWeight: '700',
  },
  checkoutValue: {
    color: '#FFFFFF',
    fontSize: typography.section,
    fontWeight: '900',
    marginTop: 4,
  },
});
