import { StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';

import { ScreenShell } from '@/src/components/screen-shell';
import { TopBar } from '@/src/components/top-bar';
import { useApp } from '@/src/context/app-context';
import { colors, radius, spacing, typography } from '@/src/theme/tokens';

const statusTone = {
  upcoming: colors.sky,
  completed: colors.success,
  confirmed: colors.sky,
  preparing: colors.coral,
  packed: colors.amber,
  'out-for-delivery': colors.mint,
} as const;

export default function BookingsScreen() {
  const { bookings } = useApp();

  return (
    <ScreenShell>
      <TopBar
        eyebrow="Bookings"
        primaryAction={{ icon: 'arrow-left', onPress: () => router.back() }}
        subtitle="Travel, food, shopping, and entertainment confirmations in one compact list."
        title="Your plans and orders"
      />

      {bookings.map((booking) => (
        <View key={booking.id} style={styles.card}>
          <View style={styles.rowBetween}>
            <View style={styles.copy}>
              <Text style={styles.category}>{booking.category}</Text>
              <Text style={styles.title}>{booking.title}</Text>
            </View>
            <Text style={styles.price}>Rs {booking.total}</Text>
          </View>
          <Text style={styles.meta}>
            {booking.date} • {booking.location} • {booking.guests} units
          </Text>
          <Text style={[styles.status, { color: statusTone[booking.status] }]}>
            {booking.status.toUpperCase()}
          </Text>
        </View>
      ))}
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  copy: {
    flex: 1,
    gap: 4,
  },
  category: {
    color: colors.textMuted,
    fontSize: typography.caption,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  title: {
    color: colors.text,
    fontSize: typography.section,
    fontWeight: '900',
  },
  price: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: '900',
  },
  meta: {
    color: colors.textMuted,
    fontSize: typography.body,
    lineHeight: 21,
  },
  status: {
    fontSize: typography.caption,
    fontWeight: '800',
  },
});
