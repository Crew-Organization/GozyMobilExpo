import { StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';

import { ScreenShell } from '@/src/components/screen-shell';
import { TopBar } from '@/src/components/top-bar';
import { useSuperAppStore } from '@/src/store/super-app-store';
import { colors, radius, spacing, typography } from '@/src/theme/tokens';

export default function WishlistScreen() {
  const { wishlist } = useSuperAppStore();

  return (
    <ScreenShell>
      <TopBar
        eyebrow="Wishlist"
        primaryAction={{ icon: 'arrow-left', onPress: () => router.back() }}
        subtitle="Saved products from shopping flows."
        title="Saved for later"
      />

      {wishlist.length ? (
        wishlist.map((item) => (
          <View key={item.id} style={styles.card}>
            <Text style={styles.title}>{item.name}</Text>
            <Text style={styles.subtitle}>
              {item.brand} • {item.category}
            </Text>
            <Text style={styles.price}>Rs {item.price}</Text>
          </View>
        ))
      ) : (
        <View style={styles.card}>
          <Text style={styles.title}>Nothing saved yet</Text>
          <Text style={styles.subtitle}>Add products from the shopping module to build your wishlist.</Text>
        </View>
      )}
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
  title: {
    color: colors.text,
    fontSize: typography.section,
    fontWeight: '800',
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: typography.body,
  },
  price: {
    color: colors.sky,
    fontSize: typography.body,
    fontWeight: '800',
  },
});
