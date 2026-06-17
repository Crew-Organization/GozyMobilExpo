import { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';

import { ScreenShell } from '@/src/components/screen-shell';
import { TopBar } from '@/src/components/top-bar';
import { useApp } from '@/src/context/app-context';
import {
  defaultTravelSearch,
  formatCurrency,
  formatTravelDate,
  travelBenefits,
  travelMoments,
  travelQuickModules,
  travelRoutePresets,
} from '@/src/lib/travel-data';
import { api } from '@/src/lib/api';
import { useSuperAppStore } from '@/src/store/super-app-store';
import type { TravelSearchParams } from '@/src/types';
import { colors, radius, spacing, typography } from '@/src/theme/tokens';

export function TravelScreen() {
  const { recommendations, travel, session } = useApp();
  const { setTravelResults, setTravelSearch, seedTravelContact } = useSuperAppStore();
  const [search, setSearch] = useState<TravelSearchParams>(defaultTravelSearch);
  const [isSearching, setIsSearching] = useState(false);

  const swapRoute = () => {
    setSearch((current) => ({
      ...current,
      originCity: current.destinationCity,
      originCode: current.destinationCode,
      destinationCity: current.originCity,
      destinationCode: current.originCode,
    }));
  };

  const runSearch = async () => {
    setIsSearching(true);
    try {
      setTravelSearch(search);
      seedTravelContact({
        email: session?.user.email ?? '',
        phone: '9876543210',
      });
      const results = await api.searchTravel(search);
      setTravelResults(results);
      router.push('/travel-results');
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <ScreenShell>
      <TopBar
        eyebrow="Travel"
        primaryAction={{ icon: 'arrow-left', onPress: () => router.back() }}
        secondaryAction={{ icon: 'robot-outline', onPress: () => router.push('/assistant') }}
        subtitle="A compact, flight-first booking flow with clean fares, smart trip signals, and white-first polish."
        title="Search trips, not clutter"
      />

      <View style={styles.heroCard}>
        <View style={styles.heroBadge}>
          <MaterialCommunityIcons color={colors.sky} name="airplane-takeoff" size={18} />
          <Text style={styles.heroBadgeText}>Travel by Gozy AI</Text>
        </View>
        <Text style={styles.heroTitle}>Plan like a travel app. Book like a super app.</Text>
        <Text style={styles.heroBody}>{recommendations[0]}</Text>
        <View style={styles.heroMetrics}>
          <View style={styles.metricPill}>
            <Text style={styles.metricValue}>18h</Text>
            <Text style={styles.metricLabel}>Fare stability</Text>
          </View>
          <View style={styles.metricPill}>
            <Text style={styles.metricValue}>2 min</Text>
            <Text style={styles.metricLabel}>To confirm</Text>
          </View>
          <View style={styles.metricPill}>
            <Text style={styles.metricValue}>24x7</Text>
            <Text style={styles.metricLabel}>Trip support</Text>
          </View>
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.moduleRow}>
        {travelQuickModules.map((module) => {
          const active = module.id === 'Flights';
          const route = module.route;

          const content = (
            <>
              <MaterialCommunityIcons
                color={active ? colors.sky : colors.textMuted}
                name={module.icon as never}
                size={20}
              />
              <Text style={[styles.moduleTitle, active ? styles.moduleTitleActive : null]}>
                {module.label}
              </Text>
              <Text style={styles.moduleCaption}>{module.caption}</Text>
            </>
          );

          if (route) {
            return (
              <Pressable
                key={module.id}
                onPress={() => router.push(route)}
                style={[styles.moduleCard, active ? styles.moduleCardActive : null]}>
                {content}
              </Pressable>
            );
          }

          return (
            <View key={module.id} style={[styles.moduleCard, active ? styles.moduleCardActive : null]}>
              {content}
            </View>
          );
        })}
      </ScrollView>

      <View style={styles.searchCard}>
        <View style={styles.segmentRow}>
          {(['round-trip', 'one-way'] as const).map((tripType) => {
            const active = search.tripType === tripType;
            return (
              <Pressable
                key={tripType}
                onPress={() => setSearch((current) => ({ ...current, tripType }))}
                style={[styles.segmentButton, active ? styles.segmentButtonActive : null]}>
                <Text
                  style={[styles.segmentText, active ? styles.segmentTextActive : null]}>
                  {tripType === 'round-trip' ? 'Round trip' : 'One way'}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.routeCard}>
          <View style={styles.routeColumn}>
            <Text style={styles.fieldLabel}>From</Text>
            <Text style={styles.cityText}>{search.originCity}</Text>
            <Text style={styles.codeText}>{search.originCode}</Text>
          </View>
          <Pressable onPress={swapRoute} style={styles.swapButton}>
            <MaterialCommunityIcons color={colors.sky} name="swap-horizontal" size={20} />
          </Pressable>
          <View style={[styles.routeColumn, styles.routeColumnEnd]}>
            <Text style={styles.fieldLabel}>To</Text>
            <Text style={styles.cityText}>{search.destinationCity}</Text>
            <Text style={styles.codeText}>{search.destinationCode}</Text>
          </View>
        </View>

        <View style={styles.fieldGrid}>
          <View style={styles.infoTile}>
            <Text style={styles.fieldLabel}>Departure</Text>
            <Text style={styles.tileValue}>{formatTravelDate(search.departureDate)}</Text>
            <Text style={styles.tileSubtle}>Best morning fares active</Text>
          </View>
          <View style={styles.infoTile}>
            <Text style={styles.fieldLabel}>Return</Text>
            <Text style={styles.tileValue}>
              {search.returnDate ? formatTravelDate(search.returnDate) : 'Select'}
            </Text>
            <Text style={styles.tileSubtle}>Low volatility window</Text>
          </View>
        </View>

        <View style={styles.fieldGrid}>
          <View style={styles.infoTile}>
            <Text style={styles.fieldLabel}>Travellers</Text>
            <Text style={styles.tileValue}>{search.travellers} travellers</Text>
            <Text style={styles.tileSubtle}>{search.cabinClass}</Text>
          </View>
          <View style={styles.infoTile}>
            <Text style={styles.fieldLabel}>Smart filters</Text>
            <View style={styles.switchRow}>
              <Text style={styles.switchText}>Non-stop only</Text>
              <Switch
                onValueChange={(value) => setSearch((current) => ({ ...current, nonStop: value }))}
                trackColor={{ false: colors.lineStrong, true: '#BFDBFE' }}
                thumbColor={search.nonStop ? colors.sky : '#FFFFFF'}
                value={search.nonStop}
              />
            </View>
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.presetRow}>
          {travelRoutePresets.map((preset) => {
            const active = preset.search.originCode === search.originCode
              && preset.search.destinationCode === search.destinationCode;

            return (
              <Pressable
                key={preset.label}
                onPress={() => setSearch(preset.search)}
                style={[styles.presetChip, active ? styles.presetChipActive : null]}>
                <Text style={[styles.presetText, active ? styles.presetTextActive : null]}>
                  {preset.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <Pressable onPress={runSearch} style={styles.searchButton}>
          <Text style={styles.searchButtonText}>
            {isSearching ? 'Searching fares...' : 'Search flights'}
          </Text>
        </Pressable>
      </View>

      <View style={styles.sectionBlock}>
        <Text style={styles.sectionTitle}>Booking confidence</Text>
        {travelBenefits.map((benefit) => (
          <View key={benefit.title} style={styles.benefitCard}>
            <View style={styles.benefitIcon}>
              <MaterialCommunityIcons color={colors.sky} name="check-decagram-outline" size={18} />
            </View>
            <View style={styles.benefitCopy}>
              <Text style={styles.benefitTitle}>{benefit.title}</Text>
              <Text style={styles.benefitBody}>{benefit.body}</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.sectionBlock}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Curated travel stacks</Text>
          <Pressable onPress={() => router.push('/assistant')}>
            <Text style={styles.sectionLink}>Open AI</Text>
          </Pressable>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.collectionRow}>
          {travel.map((item) => (
            <View key={item.id} style={styles.collectionCard}>
              <Image contentFit="cover" source={{ uri: item.image }} style={styles.collectionImage} />
              <View style={styles.collectionBody}>
                <Text style={styles.collectionKicker}>{item.type}</Text>
                <Text style={styles.collectionTitle}>{item.title}</Text>
                <Text style={styles.collectionSubtitle}>{item.subtitle}</Text>
                <Text style={styles.collectionPrice}>{formatCurrency(item.price)}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>

      <View style={styles.sectionBlock}>
        <Text style={styles.sectionTitle}>Popular for your profile</Text>
        {travelMoments.map((moment) => (
          <View key={moment.title} style={styles.momentRow}>
            <View>
              <Text style={styles.momentTitle}>{moment.title}</Text>
              <Text style={styles.momentSubtitle}>{moment.subtitle}</Text>
            </View>
            <Text style={styles.momentPrice}>{moment.priceLabel}</Text>
          </View>
        ))}
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  heroCard: {
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    padding: spacing.lg,
    gap: spacing.md,
    shadowColor: colors.shadow,
    shadowOpacity: 1,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
    elevation: 3,
  },
  heroBadge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: 8,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceSoft,
  },
  heroBadgeText: {
    color: colors.sky,
    fontSize: typography.caption,
    fontWeight: '800',
  },
  heroTitle: {
    color: colors.text,
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '900',
  },
  heroBody: {
    color: colors.textMuted,
    fontSize: typography.body,
    lineHeight: 22,
  },
  heroMetrics: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  metricPill: {
    flex: 1,
    borderRadius: radius.md,
    backgroundColor: colors.canvasMuted,
    padding: spacing.md,
    gap: 4,
  },
  metricValue: {
    color: colors.text,
    fontSize: typography.section,
    fontWeight: '900',
  },
  metricLabel: {
    color: colors.textMuted,
    fontSize: typography.caption,
  },
  moduleRow: {
    gap: spacing.sm,
  },
  moduleCard: {
    width: 126,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface,
    padding: spacing.md,
    gap: spacing.xs,
  },
  moduleCardActive: {
    borderColor: '#BFDBFE',
    backgroundColor: colors.surfaceSoft,
  },
  moduleTitle: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: '800',
  },
  moduleTitleActive: {
    color: colors.sky,
  },
  moduleCaption: {
    color: colors.textMuted,
    fontSize: typography.caption,
    lineHeight: 17,
  },
  searchCard: {
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    padding: spacing.lg,
    gap: spacing.md,
    shadowColor: colors.shadow,
    shadowOpacity: 1,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 10 },
    elevation: 3,
  },
  segmentRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  segmentButton: {
    flex: 1,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.line,
    paddingVertical: spacing.sm,
    alignItems: 'center',
  },
  segmentButtonActive: {
    backgroundColor: colors.text,
    borderColor: colors.text,
  },
  segmentText: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: '700',
  },
  segmentTextActive: {
    color: '#FFFFFF',
  },
  routeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.canvasMuted,
    padding: spacing.md,
  },
  routeColumn: {
    flex: 1,
    gap: 4,
  },
  routeColumnEnd: {
    alignItems: 'flex-end',
  },
  fieldLabel: {
    color: colors.textMuted,
    fontSize: typography.caption,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.7,
  },
  cityText: {
    color: colors.text,
    fontSize: typography.section,
    fontWeight: '900',
  },
  codeText: {
    color: colors.textMuted,
    fontSize: typography.caption,
  },
  swapButton: {
    width: 42,
    height: 42,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fieldGrid: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  infoTile: {
    flex: 1,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.line,
    padding: spacing.md,
    gap: 6,
  },
  tileValue: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: '800',
  },
  tileSubtle: {
    color: colors.textMuted,
    fontSize: typography.caption,
    lineHeight: 17,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  switchText: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: '700',
  },
  presetRow: {
    gap: spacing.sm,
  },
  presetChip: {
    borderRadius: radius.pill,
    backgroundColor: colors.canvasMuted,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  presetChipActive: {
    backgroundColor: colors.surfaceSoft,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  presetText: {
    color: colors.textMuted,
    fontSize: typography.caption,
    fontWeight: '700',
  },
  presetTextActive: {
    color: colors.sky,
  },
  searchButton: {
    borderRadius: radius.pill,
    backgroundColor: colors.sky,
    paddingVertical: 16,
    alignItems: 'center',
  },
  searchButtonText: {
    color: '#FFFFFF',
    fontSize: typography.body,
    fontWeight: '800',
  },
  sectionBlock: {
    gap: spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    color: colors.text,
    fontSize: typography.section,
    fontWeight: '900',
  },
  sectionLink: {
    color: colors.sky,
    fontSize: typography.body,
    fontWeight: '700',
  },
  benefitCard: {
    flexDirection: 'row',
    gap: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface,
    padding: spacing.md,
  },
  benefitIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: colors.surfaceSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  benefitCopy: {
    flex: 1,
    gap: 4,
  },
  benefitTitle: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: '800',
  },
  benefitBody: {
    color: colors.textMuted,
    fontSize: typography.caption,
    lineHeight: 18,
  },
  collectionRow: {
    gap: spacing.md,
  },
  collectionCard: {
    width: 240,
    borderRadius: radius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface,
  },
  collectionImage: {
    width: '100%',
    height: 150,
  },
  collectionBody: {
    padding: spacing.md,
    gap: 5,
  },
  collectionKicker: {
    color: colors.sky,
    fontSize: typography.caption,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.7,
  },
  collectionTitle: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: '900',
  },
  collectionSubtitle: {
    color: colors.textMuted,
    fontSize: typography.caption,
    lineHeight: 18,
  },
  collectionPrice: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: '800',
    marginTop: spacing.xs,
  },
  momentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
    paddingBottom: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.line,
  },
  momentTitle: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: '800',
  },
  momentSubtitle: {
    color: colors.textMuted,
    fontSize: typography.caption,
    lineHeight: 18,
    marginTop: 4,
  },
  momentPrice: {
    color: colors.sky,
    fontSize: typography.caption,
    fontWeight: '800',
  },
});
