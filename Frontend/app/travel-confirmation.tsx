import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Redirect, router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { ScreenShell } from '@/src/components/screen-shell';
import { TopBar } from '@/src/components/top-bar';
import { formatCurrency, formatTravelDate } from '@/src/lib/travel-data';
import { useSuperAppStore } from '@/src/store/super-app-store';
import { colors, radius, spacing, typography } from '@/src/theme/tokens';

export default function TravelConfirmationScreen() {
  const { resetTravelFlow, travelConfirmation } = useSuperAppStore();

  if (!travelConfirmation) {
    return <Redirect href="/travel" />;
  }

  return (
    <ScreenShell>
      <TopBar
        eyebrow="Confirmed"
        primaryAction={{ icon: 'arrow-left', onPress: () => router.replace('/travel') }}
        title="Booking locked in"
        subtitle="Your ticket, route, and support are now inside Gozy."
      />

      <View style={styles.successCard}>
        <View style={styles.successIcon}>
          <MaterialCommunityIcons color={colors.success} name="check-bold" size={28} />
        </View>
        <Text style={styles.successTitle}>You are ready to fly</Text>
        <Text style={styles.successBody}>{travelConfirmation.supportMessage}</Text>
      </View>

      <View style={styles.detailCard}>
        <Text style={styles.cardTitle}>{travelConfirmation.title}</Text>
        <Text style={styles.routeText}>{travelConfirmation.route}</Text>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Booking ID</Text>
          <Text style={styles.detailValue}>{travelConfirmation.bookingId}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>PNR</Text>
          <Text style={styles.detailValue}>{travelConfirmation.pnr}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Departure</Text>
          <Text style={styles.detailValue}>
            {formatTravelDate(travelConfirmation.departureDate)}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Payment</Text>
          <Text style={styles.detailValue}>
            {travelConfirmation.paymentMethod.toUpperCase()}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Amount paid</Text>
          <Text style={styles.detailValue}>
            {formatCurrency(travelConfirmation.amountPaid)}
          </Text>
        </View>
      </View>

      <View style={styles.detailCard}>
        <Text style={styles.cardTitle}>Included</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipRow}>
          {travelConfirmation.summaryChips.map((chip) => (
            <View key={chip} style={styles.infoChip}>
              <Text style={styles.infoChipText}>{chip}</Text>
            </View>
          ))}
        </ScrollView>
      </View>

      <Pressable
        onPress={() => {
          resetTravelFlow();
          router.replace('/bookings');
        }}
        style={styles.primaryButton}>
        <Text style={styles.primaryButtonText}>View in bookings</Text>
      </Pressable>

      <Pressable
        onPress={() => {
          resetTravelFlow();
          router.replace('/(home)');
        }}
        style={styles.secondaryButton}>
        <Text style={styles.secondaryButtonText}>Back to home</Text>
      </Pressable>

      <Pressable onPress={() => router.push('/assistant')} style={styles.inlineLink}>
        <Text style={styles.inlineLinkText}>Ask Gozy AI for a day-wise trip plan</Text>
      </Pressable>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  successCard: {
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    padding: spacing.xl,
    alignItems: 'center',
    gap: spacing.md,
  },
  successIcon: {
    width: 64,
    height: 64,
    borderRadius: 22,
    backgroundColor: '#ECFDF3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  successTitle: {
    color: colors.text,
    fontSize: typography.title,
    fontWeight: '900',
  },
  successBody: {
    color: colors.textMuted,
    fontSize: typography.body,
    textAlign: 'center',
    lineHeight: 22,
  },
  detailCard: {
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    padding: spacing.lg,
    gap: spacing.md,
  },
  cardTitle: {
    color: colors.text,
    fontSize: typography.section,
    fontWeight: '900',
  },
  routeText: {
    color: colors.textMuted,
    fontSize: typography.body,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  detailLabel: {
    color: colors.textMuted,
    fontSize: typography.body,
  },
  detailValue: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: '800',
  },
  chipRow: {
    gap: spacing.sm,
  },
  infoChip: {
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceSoft,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  infoChipText: {
    color: colors.sky,
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
  inlineLink: {
    alignItems: 'center',
  },
  inlineLinkText: {
    color: colors.sky,
    fontSize: typography.body,
    fontWeight: '700',
  },
});
