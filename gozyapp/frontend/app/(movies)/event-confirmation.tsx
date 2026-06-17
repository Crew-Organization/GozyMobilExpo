import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Redirect, router } from 'expo-router';

import { ScreenShell } from '@/src/components/screen-shell';
import { TopBar } from '@/src/components/top-bar';
import { useSuperAppStore } from '@/src/store/super-app-store';
import { colors, radius, spacing, typography } from '@/src/theme/tokens';

export default function EventConfirmationScreen() {
  const { entertainmentConfirmation, resetEntertainmentSelection } = useSuperAppStore();

  if (!entertainmentConfirmation) {
    return <Redirect href="/entertainment" />;
  }

  return (
    <ScreenShell>
      <TopBar
        eyebrow="Confirmed"
        primaryAction={{ icon: 'arrow-left', onPress: () => router.replace('/entertainment') }}
        title="Tickets booked"
        subtitle={entertainmentConfirmation.eventTitle}
      />

      <View style={styles.card}>
        <Text style={styles.title}>Seats locked successfully</Text>
        <Text style={styles.body}>{entertainmentConfirmation.supportMessage}</Text>
        <Text style={styles.meta}>Booking ID: {entertainmentConfirmation.bookingId}</Text>
        <Text style={styles.meta}>Venue: {entertainmentConfirmation.venue}</Text>
        <Text style={styles.meta}>Date: {entertainmentConfirmation.date}</Text>
        <Text style={styles.meta}>Seats: {entertainmentConfirmation.seats.join(', ')}</Text>
      </View>

      <Pressable onPress={() => router.push('/bookings')} style={styles.primaryButton}>
        <Text style={styles.primaryButtonText}>View bookings</Text>
      </Pressable>

      <Pressable
        onPress={() => {
          resetEntertainmentSelection();
          router.replace('/entertainment');
        }}
        style={styles.secondaryButton}>
        <Text style={styles.secondaryButtonText}>Book another event</Text>
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
    padding: spacing.xl,
    gap: spacing.md,
  },
  title: {
    color: colors.text,
    fontSize: typography.title,
    fontWeight: '900',
  },
  body: {
    color: colors.textMuted,
    fontSize: typography.body,
    lineHeight: 21,
  },
  meta: {
    color: colors.textMuted,
    fontSize: typography.body,
  },
  primaryButton: {
    borderRadius: radius.pill,
    backgroundColor: colors.sky,
    paddingVertical: 16,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#111827',
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
});
