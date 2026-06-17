import { useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { Redirect, router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { ScreenShell } from '@/src/components/screen-shell';
import { TopBar } from '@/src/components/top-bar';
import { TravelOfferCard } from '@/src/components/travel-offer-card';
import { useApp } from '@/src/context/app-context';
import { formatCurrency, formatTravelDate } from '@/src/lib/travel-data';
import { useSuperAppStore } from '@/src/store/super-app-store';
import type { TravelPaymentMethod } from '@/src/types';
import { colors, radius, spacing, typography } from '@/src/theme/tokens';

const paymentMethods: {
  id: TravelPaymentMethod;
  label: string;
  subtitle: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
}[] = [
  {
    id: 'wallet',
    label: 'Gozy wallet',
    subtitle: 'Fastest checkout using your in-app balance',
    icon: 'wallet-outline',
  },
  {
    id: 'upi',
    label: 'UPI',
    subtitle: 'Confirm instantly using a mock UPI flow',
    icon: 'cellphone-wireless',
  },
  {
    id: 'card',
    label: 'Card',
    subtitle: 'Mock credit or debit card payment',
    icon: 'credit-card-outline',
  },
];

export default function TravelPaymentScreen() {
  const { createTravelBooking, walletBalance } = useApp();
  const {
    selectedTravelOffer,
    setTravelConfirmation,
    setTravelPaymentMethod,
    travelAddOnIds,
    travelContact,
    travelPaymentMethod,
    travelResults,
    travelSearch,
    travelTravelers,
  } = useSuperAppStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedAddOns = useMemo(
    () => travelResults?.addOns.filter((item) => travelAddOnIds.includes(item.id)) ?? [],
    [travelAddOnIds, travelResults],
  );

  const total = useMemo(() => {
    if (!selectedTravelOffer) {
      return 0;
    }

    return (
      selectedTravelOffer.price + selectedAddOns.reduce((sum, item) => sum + item.price, 0)
    );
  }, [selectedAddOns, selectedTravelOffer]);

  if (!selectedTravelOffer || !travelResults) {
    return <Redirect href="/travel-results" />;
  }

  const walletInsufficient = travelPaymentMethod === 'wallet' && walletBalance < total;

  const confirmBooking = async () => {
    if (walletInsufficient) {
      return;
    }

    setIsSubmitting(true);
    try {
      const confirmation = await createTravelBooking({
        search: travelSearch,
        offerId: selectedTravelOffer.id,
        travelers: travelTravelers,
        contact: travelContact,
        addOnIds: travelAddOnIds,
        paymentMethod: travelPaymentMethod,
      });
      setTravelConfirmation(confirmation);
      router.replace('/travel-confirmation');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScreenShell>
      <TopBar
        eyebrow="Payment"
        primaryAction={{ icon: 'arrow-left', onPress: () => router.back() }}
        title="Confirm and pay"
        subtitle={`${formatTravelDate(travelSearch.departureDate)} • ${travelTravelers.length} travellers`}
      />

      <TravelOfferCard offer={selectedTravelOffer} />

      <View style={styles.summaryCard}>
        <Text style={styles.sectionTitle}>Fare summary</Text>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Flight fare</Text>
          <Text style={styles.summaryValue}>{formatCurrency(selectedTravelOffer.price)}</Text>
        </View>
        {selectedAddOns.map((addOn) => (
          <View key={addOn.id} style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>{addOn.title}</Text>
            <Text style={styles.summaryValue}>{formatCurrency(addOn.price)}</Text>
          </View>
        ))}
        <View style={[styles.summaryRow, styles.summaryTotalRow]}>
          <Text style={styles.summaryTotalLabel}>Amount to pay</Text>
          <Text style={styles.summaryTotalValue}>{formatCurrency(total)}</Text>
        </View>
      </View>

      <View style={styles.summaryCard}>
        <Text style={styles.sectionTitle}>Choose payment method</Text>
        {paymentMethods.map((method) => {
          const active = method.id === travelPaymentMethod;
          const isWallet = method.id === 'wallet';
          return (
            <Pressable
              key={method.id}
              onPress={() => setTravelPaymentMethod(method.id)}
              style={[styles.paymentRow, active ? styles.paymentRowActive : null]}>
              <View style={styles.paymentIcon}>
                <MaterialCommunityIcons color={colors.sky} name={method.icon} size={20} />
              </View>
              <View style={styles.paymentCopy}>
                <Text style={styles.paymentTitle}>{method.label}</Text>
                <Text style={styles.paymentSubtitle}>{method.subtitle}</Text>
                {isWallet ? (
                  <Text style={styles.walletHint}>
                    Balance available: {formatCurrency(walletBalance)}
                  </Text>
                ) : null}
              </View>
              <View style={[styles.radioOuter, active ? styles.radioOuterActive : null]}>
                {active ? <View style={styles.radioInner} /> : null}
              </View>
            </Pressable>
          );
        })}
        {walletInsufficient ? (
          <Text style={styles.errorText}>
            Your wallet balance is lower than the booking total. Switch to UPI or card.
          </Text>
        ) : null}
      </View>

      <Pressable
        disabled={isSubmitting || walletInsufficient}
        onPress={confirmBooking}
        style={[
          styles.payButton,
          isSubmitting || walletInsufficient ? styles.payButtonDisabled : null,
        ]}>
        {isSubmitting ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.payButtonText}>Pay {formatCurrency(total)}</Text>
        )}
      </Pressable>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  summaryCard: {
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    padding: spacing.lg,
    gap: spacing.md,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: typography.section,
    fontWeight: '900',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  summaryLabel: {
    color: colors.textMuted,
    fontSize: typography.body,
  },
  summaryValue: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: '700',
  },
  summaryTotalRow: {
    paddingTop: spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.line,
  },
  summaryTotalLabel: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: '800',
  },
  summaryTotalValue: {
    color: colors.text,
    fontSize: typography.section,
    fontWeight: '900',
  },
  paymentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.line,
    padding: spacing.md,
  },
  paymentRowActive: {
    borderColor: '#BFDBFE',
    backgroundColor: colors.surfaceSoft,
  },
  paymentIcon: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: colors.canvasMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  paymentCopy: {
    flex: 1,
    gap: 4,
  },
  paymentTitle: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: '800',
  },
  paymentSubtitle: {
    color: colors.textMuted,
    fontSize: typography.caption,
    lineHeight: 18,
  },
  walletHint: {
    color: colors.sky,
    fontSize: typography.caption,
    fontWeight: '700',
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    borderColor: colors.lineStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOuterActive: {
    borderColor: colors.sky,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: radius.pill,
    backgroundColor: colors.sky,
  },
  errorText: {
    color: colors.danger,
    fontSize: typography.caption,
    fontWeight: '700',
  },
  payButton: {
    borderRadius: radius.pill,
    backgroundColor: colors.sky,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  payButtonDisabled: {
    opacity: 0.45,
  },
  payButtonText: {
    color: '#FFFFFF',
    fontSize: typography.body,
    fontWeight: '800',
  },
});
