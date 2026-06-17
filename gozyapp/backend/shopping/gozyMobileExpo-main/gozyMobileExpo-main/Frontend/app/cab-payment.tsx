import { useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Redirect, router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { ScreenShell } from '@/src/components/screen-shell';
import {
  cabPaymentOptions,
  formatCabCurrency,
  formatCabDateTime,
} from '@/src/lib/cab-data';
import { useSuperAppStore } from '@/src/store/super-app-store';
import { colors, radius, spacing, typography } from '@/src/theme/tokens';

export default function CabPaymentScreen() {
  const { cabSearch, cabResults, selectedCabOffer, cabTraveler } = useSuperAppStore();
  const [expandedId, setExpandedId] = useState('gpay');

  if (!cabResults || !selectedCabOffer) {
    return <Redirect href="/cab-review" />;
  }

  const pickupMeta = formatCabDateTime(cabSearch.pickupDateTime);
  const dropMeta = formatCabDateTime(cabSearch.returnDateTime ?? cabSearch.pickupDateTime);
  const total = useMemo(
    () => selectedCabOffer.price + selectedCabOffer.taxesAndCharges - cabResults.coupon.savings,
    [cabResults.coupon.savings, selectedCabOffer.price, selectedCabOffer.taxesAndCharges],
  );

  return (
    <ScreenShell contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <MaterialCommunityIcons color="#6B7280" name="arrow-left" size={28} />
        </Pressable>
        <Text style={styles.headerTitle}>Payment</Text>
      </View>

      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>Total Due</Text>
        <View style={styles.totalAmountWrap}>
          <Text style={styles.totalAmount}>{formatCabCurrency(total)}</Text>
          <MaterialCommunityIcons color="#9CA3AF" name="chevron-down" size={28} />
        </View>
      </View>

      <View style={styles.tripSummary}>
        <MaterialCommunityIcons color="#2B74D1" name="car-estate" size={42} />
        <View style={styles.tripSummaryCopy}>
          <Text style={styles.tripRoute}>
            {cabSearch.pickupLabel} to {cabSearch.dropLabel}
          </Text>
          <Text style={styles.tripMeta}>{selectedCabOffer.vehicleType}</Text>
          <Text style={styles.tripMeta}>
            Pickup on: {pickupMeta.day}, {pickupMeta.time}
          </Text>
          <Text style={styles.tripMeta}>
            Drop on: {dropMeta.day}, {dropMeta.time}
          </Text>
        </View>
      </View>

      <View style={styles.nameStrip}>
        <Text style={styles.nameStripText}>{cabTraveler.fullName || 'Traveller details pending'}</Text>
      </View>

      <View style={styles.loginCard}>
        <View style={styles.loginCopy}>
          <Text style={styles.loginTitle}>Additional discounts and saved payment options</Text>
          <Text style={styles.loginSubtitle}>Login to access saved payments and discounts!</Text>
        </View>
        <Text style={styles.loginAction}>LOGIN</Text>
      </View>

      <View style={styles.giftHeader}>
        <MaterialCommunityIcons color="#E19E2D" name="wallet-giftcard" size={24} />
        <Text style={styles.giftHeaderText}>Gift Cards</Text>
        <MaterialCommunityIcons color="#1096EB" name="chevron-down" size={24} />
      </View>

      <Text style={styles.sectionTitle}>Payment Options</Text>

      <ScrollView contentContainerStyle={styles.optionsList} showsVerticalScrollIndicator={false}>
        {cabPaymentOptions.map((option) => {
          const expanded = option.id === expandedId;
          return (
            <View key={option.id} style={styles.optionCard}>
              <Pressable
                onPress={() => setExpandedId(expanded ? '' : option.id)}
                style={styles.optionRow}>
                <View style={styles.optionLeft}>
                  <MaterialCommunityIcons
                    color="#2B74D1"
                    name={option.icon as keyof typeof MaterialCommunityIcons.glyphMap}
                    size={30}
                  />
                  <View style={styles.optionCopy}>
                    <View style={styles.optionTitleRow}>
                      <Text style={styles.optionTitle}>{option.title}</Text>
                      {'badge' in option && option.badge ? (
                        <View style={styles.optionBadge}>
                          <Text style={styles.optionBadgeText}>{option.badge}</Text>
                        </View>
                      ) : null}
                    </View>
                    <Text style={styles.optionSubtitle}>{option.subtitle}</Text>
                  </View>
                </View>
                <MaterialCommunityIcons
                  color="#1096EB"
                  name={expanded ? 'chevron-down' : 'chevron-right'}
                  size={24}
                />
              </Pressable>

              {expanded ? (
                <View style={styles.expandedPanel}>
                  <Text style={styles.expandedText}>
                    Mock payment entry for {option.title}. Tap another row to explore alternate methods.
                  </Text>
                  <Pressable style={styles.payButton}>
                    <Text style={styles.payButtonText}>Pay {formatCabCurrency(total)}</Text>
                  </Pressable>
                </View>
              ) : null}
            </View>
          );
        })}
      </ScrollView>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxl,
    backgroundColor: '#F5F6F8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  backButton: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '900',
  },
  totalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  totalLabel: {
    color: colors.text,
    fontSize: 26,
    fontWeight: '900',
  },
  totalAmountWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  totalAmount: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '900',
  },
  tripSummary: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  tripSummaryCopy: {
    flex: 1,
    gap: 4,
  },
  tripRoute: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '900',
  },
  tripMeta: {
    color: '#4B5563',
    fontSize: 16,
  },
  nameStrip: {
    backgroundColor: '#F1F2F4',
    borderRadius: 16,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  nameStripText: {
    color: '#4B5563',
    fontSize: 16,
  },
  loginCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderRadius: 24,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    padding: spacing.md,
  },
  loginCopy: {
    flex: 1,
    gap: 4,
  },
  loginTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '900',
  },
  loginSubtitle: {
    color: '#6B7280',
    fontSize: 16,
  },
  loginAction: {
    color: '#1096EB',
    fontSize: typography.section,
    fontWeight: '900',
  },
  giftHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#D8DDE7',
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  giftHeaderText: {
    flex: 1,
    color: colors.text,
    fontSize: typography.section,
    fontWeight: '800',
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 26,
    fontWeight: '900',
  },
  optionsList: {
    gap: spacing.sm,
  },
  optionCard: {
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface,
    overflow: 'hidden',
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  optionLeft: {
    flex: 1,
    flexDirection: 'row',
    gap: spacing.md,
    alignItems: 'center',
  },
  optionCopy: {
    flex: 1,
    gap: 4,
  },
  optionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  optionTitle: {
    color: colors.text,
    fontSize: typography.section,
    fontWeight: '800',
  },
  optionBadge: {
    borderRadius: radius.pill,
    backgroundColor: '#2AD7B0',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
  },
  optionBadgeText: {
    color: '#FFFFFF',
    fontSize: typography.caption,
    fontWeight: '800',
  },
  optionSubtitle: {
    color: '#6B7280',
    fontSize: 16,
  },
  expandedPanel: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
    gap: spacing.md,
  },
  expandedText: {
    color: '#4B5563',
    fontSize: 15,
    lineHeight: 22,
  },
  payButton: {
    borderRadius: 14,
    backgroundColor: '#147DFF',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
  },
  payButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
  },
});
