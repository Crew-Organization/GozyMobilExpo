import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';

import { ScreenShell } from '@/src/components/screen-shell';
import { TopBar } from '@/src/components/top-bar';
import { api } from '@/src/lib/api';
import { useSuperAppStore } from '@/src/store/super-app-store';
import { colors, radius, spacing, typography } from '@/src/theme/tokens';

export default function CartScreen() {
  const { foodCart, shoppingCart, updateQuantity, clearCart } = useSuperAppStore();
  const items = [...foodCart, ...shoppingCart];
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = async () => {
    if (!items.length) {
      return;
    }

    await api.checkout(items);
    clearCart('food');
    clearCart('shopping');
    router.push('/bookings');
  };

  return (
    <ScreenShell>
      <TopBar
        eyebrow="Cart"
        primaryAction={{ icon: 'arrow-left', onPress: () => router.back() }}
        subtitle="Unified checkout for food and shopping with mock backend confirmation."
        title="Cart and checkout"
      />

      {items.map((item) => (
        <View key={item.id} style={styles.card}>
          <View style={styles.rowBetween}>
            <View>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.subtitle}>{item.subtitle}</Text>
            </View>
            <Text style={styles.price}>Rs {item.price}</Text>
          </View>
          <View style={styles.quantityRow}>
            <Pressable onPress={() => updateQuantity(item.kind, item.id, item.quantity - 1)} style={styles.quantityButton}>
              <Text style={styles.quantityButtonText}>-</Text>
            </Pressable>
            <Text style={styles.quantity}>{item.quantity}</Text>
            <Pressable onPress={() => updateQuantity(item.kind, item.id, item.quantity + 1)} style={styles.quantityButton}>
              <Text style={styles.quantityButtonText}>+</Text>
            </Pressable>
          </View>
        </View>
      ))}

      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Total</Text>
        <Text style={styles.summaryAmount}>Rs {total}</Text>
        <Pressable onPress={() => void handleCheckout()} style={styles.checkoutButton}>
          <Text style={styles.checkoutButtonText}>Checkout</Text>
        </Pressable>
      </View>
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
    gap: spacing.md,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  title: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: '800',
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: typography.caption,
    marginTop: 4,
  },
  price: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: '800',
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityButtonText: {
    color: colors.text,
    fontSize: typography.section,
    fontWeight: '700',
  },
  quantity: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: '700',
  },
  summaryCard: {
    borderRadius: radius.lg,
    backgroundColor: colors.surfaceSoft,
    borderWidth: 1,
    borderColor: colors.line,
    padding: spacing.lg,
    gap: spacing.md,
  },
  summaryTitle: {
    color: colors.textMuted,
    fontSize: typography.caption,
    textTransform: 'uppercase',
    fontWeight: '700',
  },
  summaryAmount: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '900',
  },
  checkoutButton: {
    borderRadius: radius.pill,
    backgroundColor: colors.sky,
    paddingVertical: spacing.sm,
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: '#FFFFFF',
    fontSize: typography.body,
    fontWeight: '700',
  },
});
