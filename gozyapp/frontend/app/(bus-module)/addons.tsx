import React from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { colors, radius, spacing, typography, shadow } from '@/src/theme/tokens';
import { usePaymentStore } from '@/src/store/bus-payment-store';

const PRIMARY = '#0A67FF';
const GRADIENT: [string, string] = ['#15BDF2', '#006BFF'];

export default function AddonsScreen() {
  const params = useLocalSearchParams<{
    totalFare: string;
    fromCity: string;
    toCity: string;
    operator: string;
    seats: string;
    departureTime: string;
    busId: string;
    busType: string;
    date: string;
    arrivalTime: string;
    duration: string;
    boardingName: string;
    boardingTime: string;
    droppingName: string;
    droppingTime: string;
  }>();

  const { addons, toggleAddon } = usePaymentStore();

  const addonTotal = addons.filter((a) => a.selected).reduce((s, a) => s + a.price, 0);
  const baseFare = parseInt(params.totalFare ?? '0', 10);
  const grandTotal = baseFare + addonTotal;

  const handleContinue = () => {
    router.push({
      pathname: '/(bus-module)/review-booking',
      params: { ...params, addonTotal: String(addonTotal) },
    } as any);
  };

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12} style={styles.backBtn}>
          <MaterialCommunityIcons name="arrow-left" size={22} color={colors.text} />
        </Pressable>
        <View style={styles.headerMid}>
          <Text style={styles.headerTitle}>Add-ons & Protection</Text>
          <Text style={styles.headerSub}>{params.fromCity} → {params.toCity}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.pageTitle}>Enhance Your Journey</Text>
        <Text style={styles.pageSubtitle}>
          Select optional add-ons for a safer and more comfortable trip.
        </Text>

        {addons.map((addon) => (
          <View key={addon.id} style={[styles.addonCard, addon.selected && styles.addonCardSelected]}>
            <View style={[styles.addonIcon, addon.selected && styles.addonIconActive]}>
              <MaterialCommunityIcons
                name={addon.icon as any}
                size={24}
                color={addon.selected ? '#FFF' : PRIMARY}
              />
            </View>
            <View style={styles.addonInfo}>
              <Text style={styles.addonName}>{addon.name}</Text>
              <Text style={styles.addonDesc}>{addon.description}</Text>
              <Text style={styles.addonPrice}>+₹{addon.price}/person</Text>
            </View>
            <Switch
              value={addon.selected}
              onValueChange={() => toggleAddon(addon.id)}
              trackColor={{ false: colors.line, true: '#BFDBFE' }}
              thumbColor={addon.selected ? PRIMARY : colors.textLight}
            />
          </View>
        ))}

        {/* Cancellation policy */}
        <View style={styles.policyCard}>
          <View style={styles.policyHeader}>
            <MaterialCommunityIcons name="cancel" size={18} color={PRIMARY} />
            <Text style={styles.policyTitle}>Cancellation Policy</Text>
          </View>
          {[
            { when: 'More than 48h before', refund: '90% refund' },
            { when: '24–48h before departure', refund: '75% refund' },
            { when: '12–24h before departure', refund: '50% refund' },
            { when: '6–12h before departure', refund: '25% refund' },
            { when: 'Less than 6 hours', refund: 'No refund' },
            { when: 'No-show', refund: 'No refund' },
          ].map((r) => (
            <View key={r.when} style={styles.policyRow}>
              <MaterialCommunityIcons
                name={r.refund === 'No refund' ? 'close-circle-outline' : 'check-circle-outline'}
                size={14}
                color={r.refund === 'No refund' ? colors.danger : colors.success}
              />
              <Text style={styles.policyWhen}>{r.when}</Text>
              <Text style={[styles.policyRefund, r.refund === 'No refund' && { color: colors.danger }]}>
                {r.refund}
              </Text>
            </View>
          ))}
          <Text style={styles.policyNote}>Convenience fees are non-refundable.</Text>
        </View>

        <View style={styles.scrollPad} />
      </ScrollView>

      {/* Bottom summary */}
      <View style={styles.bottomBar}>
        <View style={styles.priceSummary}>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Base fare</Text>
            <Text style={styles.priceVal}>₹{baseFare.toLocaleString('en-IN')}</Text>
          </View>
          {addonTotal > 0 && (
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Add-ons</Text>
              <Text style={[styles.priceVal, { color: colors.success }]}>
                +₹{addonTotal.toLocaleString('en-IN')}
              </Text>
            </View>
          )}
          <View style={[styles.priceRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalVal}>₹{grandTotal.toLocaleString('en-IN')}</Text>
          </View>
        </View>
        <Pressable onPress={handleContinue}>
          <LinearGradient colors={GRADIENT} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.continueBtn}>
            <Text style={styles.continueBtnText}>REVIEW BOOKING</Text>
            <MaterialCommunityIcons name="arrow-right" size={18} color="#FFF" />
          </LinearGradient>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.canvas },
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
    gap: spacing.sm,
  },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerMid: { flex: 1 },
  headerTitle: { fontSize: typography.bodySmall, fontWeight: '800', color: colors.text },
  headerSub: { fontSize: typography.tiny, color: colors.textMuted },

  scrollContent: { padding: spacing.md, gap: spacing.sm },

  pageTitle: { fontSize: typography.body, fontWeight: '900', color: colors.text },
  pageSubtitle: { fontSize: typography.small, color: colors.textMuted, marginTop: 4, marginBottom: spacing.xs },

  addonCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.background,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.line,
    ...shadow.sm,
  },
  addonCardSelected: {
    borderColor: PRIMARY,
    backgroundColor: '#EFF6FF',
  },
  addonIcon: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  addonIconActive: { backgroundColor: PRIMARY, borderColor: PRIMARY },
  addonInfo: { flex: 1, gap: 2 },
  addonName: { fontSize: typography.bodySmall, fontWeight: '800', color: colors.text },
  addonDesc: { fontSize: typography.tiny, color: colors.textMuted, lineHeight: 16 },
  addonPrice: { fontSize: typography.small, fontWeight: '700', color: colors.success, marginTop: 2 },

  policyCard: {
    backgroundColor: colors.background,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.line,
    gap: spacing.xs,
    ...shadow.sm,
  },
  policyHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: spacing.xs },
  policyTitle: { fontSize: typography.bodySmall, fontWeight: '800', color: colors.text },
  policyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  policyWhen: { flex: 1, fontSize: 12, color: colors.textMuted, fontWeight: '600' },
  policyRefund: { fontSize: 12, fontWeight: '700', color: colors.success },
  policyNote: { fontSize: 10.5, color: colors.textLight, marginTop: 4 },

  scrollPad: { height: 24 },

  bottomBar: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.line,
    gap: spacing.xs,
    ...shadow.lg,
  },
  priceSummary: { gap: 4 },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  priceLabel: { fontSize: typography.small, color: colors.textMuted, fontWeight: '600' },
  priceVal: { fontSize: typography.small, fontWeight: '700', color: colors.text },
  totalRow: { borderTopWidth: 1, borderTopColor: colors.line, paddingTop: 6, marginTop: 4 },
  totalLabel: { fontSize: typography.body, fontWeight: '900', color: colors.text },
  totalVal: { fontSize: typography.body, fontWeight: '900', color: PRIMARY },
  continueBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
  },
  continueBtnText: { fontSize: typography.small, fontWeight: '900', color: '#FFFFFF', letterSpacing: 0.5 },
});
