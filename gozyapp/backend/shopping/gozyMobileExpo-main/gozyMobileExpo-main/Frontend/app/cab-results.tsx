import { useMemo, useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Redirect, router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { CabOfferCard } from '@/src/components/cab-offer-card';
import { ScreenShell } from '@/src/components/screen-shell';
import { cabSortOptions, formatCabDateTime } from '@/src/lib/cab-data';
import { useSuperAppStore } from '@/src/store/super-app-store';
import type { CabOffer } from '@/src/types';
import { colors, radius, spacing, typography } from '@/src/theme/tokens';

export default function CabResultsScreen() {
  const { cabSearch, cabResults, selectCabOffer } = useSuperAppStore();
  const [activeType, setActiveType] = useState<'All' | CabOffer['vehicleType']>('All');
  const [selectedSort, setSelectedSort] = useState(cabSortOptions[0]);
  const [showSort, setShowSort] = useState(false);

  if (!cabResults) {
    return <Redirect href="/cab" />;
  }

  const schedule = formatCabDateTime(cabSearch.pickupDateTime);
  const vehicleTypes = useMemo(
    () => ['All', ...new Set(cabResults.offers.map((offer) => offer.vehicleType))] as const,
    [cabResults.offers],
  );

  const sortedOffers = useMemo(() => {
    let filtered =
      activeType === 'All'
        ? cabResults.offers
        : cabResults.offers.filter((offer) => offer.vehicleType === activeType);

    filtered = [...filtered];

    if (selectedSort === 'Price (Low to High)') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (selectedSort === 'Price (High to Low)') {
      filtered.sort((a, b) => b.price - a.price);
    } else {
      filtered.sort((a, b) => b.rating - a.rating);
    }

    return filtered;
  }, [activeType, cabResults.offers, selectedSort]);

  return (
    <>
      <ScreenShell contentContainerStyle={styles.content}>
        <View style={styles.summaryCard}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <MaterialCommunityIcons color="#6B7280" name="arrow-left" size={28} />
          </Pressable>
          <View style={styles.summaryCopy}>
            <Text numberOfLines={1} style={styles.routeTitle}>
              {cabSearch.pickupLabel} to {cabSearch.dropLabel}
            </Text>
            <Text style={styles.routeSubtitle}>
              {schedule.compact}, {schedule.time}
            </Text>
          </View>
          <Pressable onPress={() => router.back()} style={styles.editWrap}>
            <MaterialCommunityIcons color="#12A4F8" name="pencil" size={22} />
            <Text style={styles.editText}>Edit</Text>
          </Pressable>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.filterRow}>
            {vehicleTypes.map((type) => {
              const active = type === activeType;
              return (
                <Pressable
                  key={type}
                  onPress={() => setActiveType(type)}
                  style={[styles.filterChip, active ? styles.filterChipActive : null]}>
                  <Text style={[styles.filterChipText, active ? styles.filterChipTextActive : null]}>
                    {type}
                  </Text>
                </Pressable>
              );
            })}
            <Pressable onPress={() => setShowSort(true)} style={styles.sortChip}>
              <Text style={styles.sortChipText}>Sort</Text>
              <MaterialCommunityIcons color={colors.text} name="swap-vertical" size={18} />
            </Pressable>
          </View>
        </ScrollView>

        <View style={styles.trustBanner}>
          <View style={styles.trustTop}>
            <TrustPill icon="badge-account-outline" label="Trusted Drivers" />
            <TrustPill icon="car-wash" label="Clean cabs" />
            <TrustPill icon="timer-check-outline" label="On-Time Pickup" />
          </View>
          <Text style={styles.partnerCaption}>Our Top Rated Partner SAVAARI</Text>
        </View>

        <View style={styles.bagsCard}>
          <MaterialCommunityIcons color="#7A7F88" name="bag-suitcase-outline" size={24} />
          <Text style={styles.bagsCopy}>Not sure if your bags will fit?</Text>
          <Text style={styles.bagsLink}>Check here</Text>
        </View>

        <Text style={styles.infoLine}>
          Rates for {cabSearch.distanceKm} Kms approx distance | {cabSearch.durationLabel}
        </Text>

        <View style={styles.list}>
          {sortedOffers.map((offer, index) => (
            <CabOfferCard
              key={offer.id}
              highlightCoupon={index === 0}
              offer={offer}
              onPress={() => {
                selectCabOffer(offer);
                router.push('/cab-review');
              }}
            />
          ))}
        </View>
      </ScreenShell>

      <Modal animationType="slide" onRequestClose={() => setShowSort(false)} transparent visible={showSort}>
        <View style={styles.modalBackdrop}>
          <Pressable onPress={() => setShowSort(false)} style={styles.modalDismissArea} />
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Sort By</Text>
              <Pressable onPress={() => setShowSort(false)} style={styles.closeButton}>
                <MaterialCommunityIcons color="#A3A3A3" name="close" size={28} />
              </Pressable>
            </View>
            {cabSortOptions.map((option) => (
              <Pressable
                key={option}
                onPress={() => {
                  setSelectedSort(option);
                  setShowSort(false);
                }}
                style={styles.sortOption}>
                <View style={styles.sortRadio}>
                  {selectedSort === option ? <View style={styles.sortRadioFill} /> : null}
                </View>
                <Text style={styles.sortOptionText}>{option}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      </Modal>
    </>
  );
}

function TrustPill({
  icon,
  label,
}: {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  label: string;
}) {
  return (
    <View style={styles.trustPill}>
      <MaterialCommunityIcons color="#F4F8FF" name={icon} size={18} />
      <Text style={styles.trustText}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxl,
    backgroundColor: '#F8F9FB',
  },
  summaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface,
    padding: spacing.md,
  },
  backButton: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryCopy: {
    flex: 1,
    gap: 2,
  },
  routeTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '900',
  },
  routeSubtitle: {
    color: '#6B7280',
    fontSize: 15,
  },
  editWrap: {
    alignItems: 'center',
    gap: 4,
  },
  editText: {
    color: '#12A4F8',
    fontSize: typography.body,
    fontWeight: '800',
  },
  filterRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
  },
  filterChip: {
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: '#D8DEE7',
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  filterChipActive: {
    borderColor: '#1096EB',
    backgroundColor: '#EEF7FF',
  },
  filterChipText: {
    color: colors.text,
    fontSize: typography.section,
  },
  filterChipTextActive: {
    color: '#1096EB',
    fontWeight: '800',
  },
  sortChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: '#D8DEE7',
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  sortChipText: {
    color: colors.text,
    fontSize: typography.section,
  },
  trustBanner: {
    borderRadius: 24,
    backgroundColor: '#052E65',
    overflow: 'hidden',
  },
  trustTop: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.md,
  },
  trustPill: {
    alignItems: 'center',
    gap: 6,
  },
  trustText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '700',
  },
  partnerCaption: {
    color: '#1A436E',
    backgroundColor: '#DDF1FF',
    textAlign: 'center',
    paddingVertical: spacing.xs,
    fontSize: typography.body,
    fontWeight: '700',
  },
  bagsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E4E7EC',
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  bagsCopy: {
    flex: 1,
    color: '#6B7280',
    fontSize: 16,
  },
  bagsLink: {
    color: '#1096EB',
    fontSize: 16,
    fontWeight: '700',
  },
  infoLine: {
    color: '#3F4651',
    fontSize: 16,
  },
  list: {
    gap: spacing.md,
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.28)',
  },
  modalDismissArea: {
    flex: 1,
  },
  modalSheet: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
    gap: spacing.sm,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  modalTitle: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '900',
  },
  closeButton: {
    width: 42,
    height: 42,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F4F6',
  },
  sortOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.line,
  },
  sortRadio: {
    width: 24,
    height: 24,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    borderColor: '#B4B8C0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sortRadioFill: {
    width: 10,
    height: 10,
    borderRadius: radius.pill,
    backgroundColor: '#1096EB',
  },
  sortOptionText: {
    color: colors.text,
    fontSize: 18,
  },
});
