import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Image } from 'expo-image';

import { Chip } from '@/src/components/chip';
import { ScreenShell } from '@/src/components/screen-shell';
import { TopBar } from '@/src/components/top-bar';
import { useApp } from '@/src/context/app-context';
import { useSuperAppStore } from '@/src/store/super-app-store';
import { colors, radius, spacing, typography } from '@/src/theme/tokens';

export default function ProfileTabScreen() {
  const { session, logout } = useApp();
  const { wishlist, foodCart, shoppingCart } = useSuperAppStore();

  if (!session) {
    return null;
  }

  return (
    <ScreenShell>
      <TopBar
        eyebrow="Profile"
        primaryAction={{ icon: 'wallet-outline', onPress: () => router.push('/wallet') }}
        secondaryAction={{ icon: 'heart-outline', onPress: () => router.push('/wishlist') }}
        subtitle="Account, saved tastes, module preferences, wallet access, and AI profile tuning."
        title="You"
      />

      <View style={styles.hero}>
        <Image source={session.user.avatar} style={styles.avatar} />
        <Text style={styles.name}>{session.user.name || 'Gozy user'}</Text>
        <Text style={styles.meta}>
          {session.user.email} • {session.user.city}
        </Text>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{wishlist.length}</Text>
          <Text style={styles.statLabel}>Wishlist</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{foodCart.length + shoppingCart.length}</Text>
          <Text style={styles.statLabel}>Cart items</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{session.user.preferredCategories.length}</Text>
          <Text style={styles.statLabel}>Priority modules</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Interests</Text>
        <View style={styles.chips}>
          {session.user.interests.map((interest) => (
            <Chip key={interest} label={interest} selected />
          ))}
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Priority categories</Text>
        <View style={styles.chips}>
          {session.user.preferredCategories.map((category) => (
            <Chip key={category} label={category} selected />
          ))}
        </View>
      </View>

      <View style={styles.linkGroup}>
        <Pressable onPress={() => router.push('/wallet')} style={styles.linkCard}>
          <Text style={styles.linkTitle}>Wallet and rewards</Text>
          <Text style={styles.linkBody}>Top up, review cashback, and track transactions.</Text>
        </Pressable>
        <Pressable onPress={() => router.push('/assistant')} style={styles.linkCard}>
          <Text style={styles.linkTitle}>AI assistant</Text>
          <Text style={styles.linkBody}>Tune trip, food, and shopping suggestions from your profile.</Text>
        </Pressable>
      </View>

      <Pressable
        onPress={() => {
          logout();
          router.replace('/(auth)/login');
        }}
        style={styles.logoutButton}>
        <Text style={styles.logoutText}>Log out</Text>
      </Pressable>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  hero: {
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
  },
  avatar: {
    width: 92,
    height: 92,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceElevated,
  },
  name: {
    color: colors.text,
    fontSize: typography.title,
    fontWeight: '800',
  },
  meta: {
    color: colors.textMuted,
    fontSize: typography.body,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  statCard: {
    flex: 1,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    padding: spacing.md,
    alignItems: 'center',
    gap: spacing.xs,
  },
  statValue: {
    color: colors.text,
    fontSize: typography.section,
    fontWeight: '900',
  },
  statLabel: {
    color: colors.textMuted,
    fontSize: typography.caption,
  },
  card: {
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
    fontWeight: '800',
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  linkGroup: {
    gap: spacing.md,
  },
  linkCard: {
    borderRadius: radius.md,
    backgroundColor: colors.surfaceElevated,
    borderWidth: 1,
    borderColor: colors.line,
    padding: spacing.lg,
    gap: spacing.xs,
  },
  linkTitle: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: '800',
  },
  linkBody: {
    color: colors.textMuted,
    fontSize: typography.caption,
    lineHeight: 18,
  },
  logoutButton: {
    borderRadius: radius.pill,
    backgroundColor: colors.sky,
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
  },
  logoutText: {
    color: '#FFFFFF',
    fontSize: typography.body,
    fontWeight: '800',
  },
});
