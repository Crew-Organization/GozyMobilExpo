import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';

import { ScreenShell } from '@/src/components/screen-shell';
import { TopBar } from '@/src/components/top-bar';
import { TravelOfferCard } from '@/src/components/travel-offer-card';
import { useSuperAppStore } from '@/src/store/super-app-store';
import { api } from '@/src/lib/api';
import { formatCurrency, formatTravelDate } from '@/src/lib/travel-data';
import { colors, radius, spacing, typography } from '@/src/theme/tokens';

const sortOptions = ['Best', 'Cheapest', 'Fastest'] as const;

export default function TravelResultsScreen() {
  const { travelSearch, travelResults, setTravelResults, selectTravelOffer } = useSuperAppStore();
  const [sortBy, setSortBy] = useState<(typeof sortOptions)[number]>('Best');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (travelResults) {
      return;
    }

    let cancelled = false;
    const load = async () => {
      setIsLoading(true);
      try {
        const results = await api.searchTravel(travelSearch);
        if (!cancelled) {
          setTravelResults(results);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, [setTravelResults, travelResults, travelSearch]);

  const sortedOffers = useMemo(() => {
    if (!travelResults) {
      return [];
    }

    const offers = [...travelResults.offers];
    if (sortBy === 'Cheapest') {
      offers.sort((left, right) => left.price - right.price);
    } else if (sortBy === 'Fastest') {
      offers.sort((left, right) => left.duration.localeCompare(right.duration));
    }
    return offers;
  }, [sortBy, travelResults]);

  if (!travelResults && isLoading) {
    return (
      <ScreenShell scroll={false} style={styles.loadingWrap}>
        <ActivityIndicator color={colors.sky} size="large" />
        <Text style={styles.loadingText}>Searching live-feel fares for your route...</Text>
      </ScreenShell>
    );
  }

  if (!travelResults) {
    return (
      <ScreenShell>
        <TopBar
          eyebrow="Travel"
          primaryAction={{ icon: 'arrow-left', onPress: () => router.back() }}
          title="Results unavailable"
          subtitle="Search again to refresh your travel inventory."
        />
      </ScreenShell>
    );
  }

  return (
    <ScreenShell>
      <TopBar
        eyebrow="Flights"
        primaryAction={{ icon: 'arrow-left', onPress: () => router.back() }}
        title={`${travelSearch.originCode} to ${travelSearch.destinationCode}`}
        subtitle={`${formatTravelDate(travelSearch.departureDate)} • ${travelSearch.travellers} travellers • ${travelSearch.cabinClass}`}
      />

      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>{travelResults.summary}</Text>
        <Text style={styles.summaryBody}>{travelResults.aiTip}</Text>
        <View style={styles.insightRow}>
          <View style={styles.insightTile}>
            <Text style={styles.insightLabel}>AI confidence</Text>
            <Text style={styles.insightValue}>{travelResults.priceInsight.confidenceLabel}</Text>
          </View>
          <View style={styles.insightTile}>
            <Text style={styles.insightLabel}>Fare trend</Text>
            <Text style={styles.insightValue}>{travelResults.priceInsight.trendLabel}</Text>
          </View>
          <View style={styles.insightTile}>
            <Text style={styles.insightLabel}>Average fare</Text>
            <Text style={styles.insightValue}>
              {formatCurrency(travelResults.priceInsight.averageFare)}
            </Text>
          </View>
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.sortRow}>
        {sortOptions.map((option) => {
          const active = sortBy === option;
          return (
            <Pressable
              key={option}
              onPress={() => setSortBy(option)}
              style={[styles.sortChip, active ? styles.sortChipActive : null]}>
              <Text style={[styles.sortText, active ? styles.sortTextActive : null]}>{option}</Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {sortedOffers.map((offer) => (
        <TravelOfferCard
          key={offer.id}
          actionLabel="Book flight"
          offer={offer}
          onPress={() => {
            selectTravelOffer(offer);
            router.push('/travel-review');
          }}
        />
      ))}
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  loadingWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
  },
  loadingText: {
    color: colors.textMuted,
    fontSize: typography.body,
  },
  summaryCard: {
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    padding: spacing.lg,
    gap: spacing.md,
  },
  summaryTitle: {
    color: colors.text,
    fontSize: typography.section,
    fontWeight: '900',
  },
  summaryBody: {
    color: colors.textMuted,
    fontSize: typography.body,
    lineHeight: 21,
  },
  insightRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  insightTile: {
    flex: 1,
    borderRadius: radius.md,
    backgroundColor: colors.canvasMuted,
    padding: spacing.md,
    gap: 4,
  },
  insightLabel: {
    color: colors.textMuted,
    fontSize: typography.caption,
    fontWeight: '700',
  },
  insightValue: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: '800',
  },
  sortRow: {
    gap: spacing.sm,
  },
  sortChip: {
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.line,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.surface,
  },
  sortChipActive: {
    backgroundColor: colors.text,
    borderColor: colors.text,
  },
  sortText: {
    color: colors.text,
    fontSize: typography.caption,
    fontWeight: '800',
  },
  sortTextActive: {
    color: '#FFFFFF',
  },
});
