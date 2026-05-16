import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Redirect, router } from 'expo-router';

import { ScreenShell } from '@/src/components/screen-shell';
import { TopBar } from '@/src/components/top-bar';
import { useApp } from '@/src/context/app-context';
import { api } from '@/src/lib/api';
import { paymentMethods, seatLayout } from '@/src/lib/commerce-data';
import { useSuperAppStore } from '@/src/store/super-app-store';
import { colors, radius, spacing, typography } from '@/src/theme/tokens';

export default function EventBookingScreen() {
  const { events, refreshApp } = useApp();
  const {
    commercePaymentMethod,
    selectedEventId,
    selectedSeats,
    setCommercePaymentMethod,
    setEntertainmentConfirmation,
    toggleSeat,
  } = useSuperAppStore();

  const event = events.find((item) => item.id === selectedEventId);
  if (!event) {
    return <Redirect href="/entertainment" />;
  }

  const total = event.price * selectedSeats.length;

  const confirmBooking = async () => {
    const confirmation = await api.createEntertainmentBooking(
      {
        eventId: event.id,
        seats: selectedSeats,
        paymentMethod: commercePaymentMethod,
      },
      {
        title: event.title,
        venue: event.venue,
        date: event.date,
        price: event.price,
      },
    );
    setEntertainmentConfirmation(confirmation);
    await refreshApp();
    router.replace('/event-confirmation');
  };

  return (
    <ScreenShell>
      <TopBar
        eyebrow="Seat selection"
        primaryAction={{ icon: 'arrow-left', onPress: () => router.back() }}
        title={event.title}
        subtitle={`${event.venue} • ${event.date}`}
      />

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Select seats</Text>
        <Text style={styles.sectionSubtitle}>Screen this way</Text>
        <View style={styles.screenBar} />
        {seatLayout.map((row) => (
          <View key={row.join('-')} style={styles.seatRow}>
            {row.map((seat) => {
              const active = selectedSeats.includes(seat);
              return (
                <Pressable
                  key={seat}
                  onPress={() => toggleSeat(seat)}
                  style={[styles.seat, active ? styles.seatActive : null]}>
                  <Text style={[styles.seatText, active ? styles.seatTextActive : null]}>
                    {seat}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        ))}
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Payment</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.paymentRow}>
          {paymentMethods.map((method) => {
            const active = method.id === commercePaymentMethod;
            return (
              <Pressable
                key={method.id}
                onPress={() => setCommercePaymentMethod(method.id)}
                style={[styles.paymentCard, active ? styles.paymentCardActive : null]}>
                <Text style={styles.paymentTitle}>{method.label}</Text>
                <Text style={styles.paymentSubtitle}>{method.subtitle}</Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>{selectedSeats.length || 0} seats selected</Text>
        <Text style={styles.summaryValue}>Rs {total || event.price}</Text>
      </View>

      <Pressable
        disabled={!selectedSeats.length}
        onPress={() => void confirmBooking()}
        style={[styles.confirmButton, !selectedSeats.length ? styles.confirmButtonDisabled : null]}>
        <Text style={styles.confirmButtonText}>Confirm booking</Text>
      </Pressable>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  card: {
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
  sectionSubtitle: {
    color: colors.textMuted,
    fontSize: typography.caption,
    textAlign: 'center',
  },
  screenBar: {
    height: 10,
    borderRadius: radius.pill,
    backgroundColor: colors.canvasMuted,
  },
  seatRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  seat: {
    width: 44,
    height: 34,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.lineStrong,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
  },
  seatActive: {
    borderColor: colors.sky,
    backgroundColor: colors.surfaceSoft,
  },
  seatText: {
    color: colors.text,
    fontSize: typography.caption,
    fontWeight: '800',
  },
  seatTextActive: {
    color: colors.sky,
  },
  paymentRow: {
    gap: spacing.sm,
  },
  paymentCard: {
    width: 168,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.line,
    padding: spacing.md,
    gap: 4,
  },
  paymentCardActive: {
    borderColor: '#BFDBFE',
    backgroundColor: colors.surfaceSoft,
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
  summaryCard: {
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface,
    padding: spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryTitle: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: '800',
  },
  summaryValue: {
    color: colors.text,
    fontSize: typography.section,
    fontWeight: '900',
  },
  confirmButton: {
    borderRadius: radius.pill,
    backgroundColor: colors.sky,
    paddingVertical: 16,
    alignItems: 'center',
  },
  confirmButtonDisabled: {
    opacity: 0.45,
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: typography.body,
    fontWeight: '800',
  },
});
