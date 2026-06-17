import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { ScreenShell } from '@/src/components/screen-shell';
import { SuperSectionCard } from '@/src/components/super-section-card';
import { TopBar } from '@/src/components/top-bar';
import { useApp } from '@/src/context/app-context';
import { colors, radius, spacing, typography } from '@/src/theme/tokens';

const verticalLinks = [
  { title: 'Travel', body: 'Flights, stays, AI trip planner, travel partners', icon: 'airplane', route: '/travel' },
  { title: 'Food', body: 'Restaurants, menus, cart, order flow', icon: 'silverware-fork-knife', route: '/food' },
  { title: 'Shopping', body: 'Fashion, electronics, wishlist, checkout', icon: 'shopping', route: '/shopping' },
  { title: 'Entertainment', body: 'Movies, events, tickets, local nights', icon: 'movie-open-outline', route: '/entertainment' },
  { title: 'AI Assistant', body: 'Trip planning, food suggestions, lifestyle concierge', icon: 'robot-outline', route: '/assistant' },
  { title: 'Cart', body: 'Food plus shopping checkout in one place', icon: 'cart-outline', route: '/cart' },
];

export default function ExploreScreen() {
  const { sections, travel, restaurants, products, events } = useApp();

  return (
    <ScreenShell>
      <TopBar
        showLogo={true}
        eyebrow="Explore modules"
        subtitle="Dedicated surfaces inspired by category leaders, translated into Gozy’s own white minimal system."
        title="Gozy verticals"
      />

      <View style={styles.verticalGrid}>
        {verticalLinks.map((link) => (
          <Pressable key={link.title} onPress={() => router.push(link.route as never)} style={styles.verticalCard}>
            <MaterialCommunityIcons color={colors.sky} name={link.icon as never} size={22} />
            <Text style={styles.verticalTitle}>{link.title}</Text>
            <Text style={styles.verticalBody}>{link.body}</Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.block}>
        <Text style={styles.blockTitle}>Section architecture</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalList}>
          {sections.map((section) => (
            <SuperSectionCard key={section.id} onPress={() => router.push('/sections')} section={section} />
          ))}
        </ScrollView>
      </View>

      <View style={styles.block}>
        <Text style={styles.blockTitle}>Live inventory snapshots</Text>
        <Text style={styles.snapshot}>Travel deals: {travel.length}</Text>
        <Text style={styles.snapshot}>Restaurants: {restaurants.length}</Text>
        <Text style={styles.snapshot}>Products: {products.length}</Text>
        <Text style={styles.snapshot}>Events: {events.length}</Text>
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  verticalGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  verticalCard: {
    width: '48%',
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    padding: spacing.md,
    gap: spacing.sm,
  },
  verticalTitle: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: '800',
  },
  verticalBody: {
    color: colors.textMuted,
    fontSize: typography.caption,
    lineHeight: 18,
  },
  block: {
    gap: spacing.md,
  },
  blockTitle: {
    color: colors.text,
    fontSize: typography.section,
    fontWeight: '800',
  },
  horizontalList: {
    gap: spacing.md,
  },
  snapshot: {
    color: colors.textMuted,
    fontSize: typography.body,
    lineHeight: 20,
  },
});
