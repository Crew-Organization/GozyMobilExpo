import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';

import { MediaCard } from '@/src/components/media-card';
import { ScreenShell } from '@/src/components/screen-shell';
import { SectionHeader } from '@/src/components/section-header';
import { TopBar } from '@/src/components/top-bar';
import { useApp } from '@/src/context/app-context';
import { entertainmentFilters } from '@/src/lib/commerce-data';
import { useSuperAppStore } from '@/src/store/super-app-store';
import { colors, radius, spacing, typography } from '@/src/theme/tokens';

export default function EntertainmentScreen() {
  const { events } = useApp();
  const { setSelectedEvent } = useSuperAppStore();

  return (
    <ScreenShell>
      <TopBar
        eyebrow="Entertainment"
        primaryAction={{ icon: 'arrow-left', onPress: () => router.back() }}
        secondaryAction={{ icon: 'ticket-confirmation-outline', onPress: () => router.push('/bookings') }}
        subtitle="BookMyShow-style discovery surface with compact movie cards and seat-led booking."
        title="Movies and events"
      />

      <View style={styles.heroCard}>
        <Text style={styles.heroTitle}>Tonight&apos;s entertainment grid</Text>
        <Text style={styles.heroBody}>
          Movies, comedy, and event cards with seat selection and confirmation flow built in.
        </Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
        {entertainmentFilters.map((filter) => (
          <View key={filter} style={styles.filterChip}>
            <Text style={styles.filterText}>{filter}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.sectionBlock}>
        <SectionHeader subtitle="Now showing and recommended" title="Book tickets" />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.carouselRow}>
          {events.map((event) => (
            <MediaCard
              key={event.id}
              badge={event.genre}
              image={event.image}
              meta={`${event.venue} • ${event.date}`}
              onPress={() => {
                setSelectedEvent(event.id);
                router.push('/event-booking');
              }}
              priceLabel={`Rs ${event.price}`}
              subtitle={`${event.rating.toFixed(1)} rated`}
              title={event.title}
              width={236}
            />
          ))}
        </ScrollView>
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  heroCard: {
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  heroTitle: {
    color: colors.text,
    fontSize: typography.title,
    fontWeight: '900',
  },
  heroBody: {
    color: colors.textMuted,
    fontSize: typography.body,
    lineHeight: 21,
  },
  filterRow: {
    gap: spacing.sm,
  },
  filterChip: {
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.line,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  filterText: {
    color: colors.text,
    fontSize: typography.caption,
    fontWeight: '800',
  },
  sectionBlock: {
    gap: spacing.sm,
  },
  carouselRow: {
    gap: spacing.md,
  },
});
