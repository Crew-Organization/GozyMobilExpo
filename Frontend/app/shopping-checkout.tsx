import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Redirect, router } from 'expo-router';

import { ScreenShell } from '@/src/components/screen-shell';
import { TopBar } from '@/src/components/top-bar';
import { useApp } from '@/src/context/app-context';
import { paymentMethods, savedAddresses } from '@/src/lib/commerce-data';
import { api } from '@/src/lib/api';
import { useSuperAppStore } from '@/src/store/super-app-store';
import { colors, radius, spacing, typography } from '@/src/theme/tokens';

export default function ShoppingCheckoutScreen() {
  const { refreshApp } = useApp();
  const {
    clearCart,
    commercePaymentMethod,
    selectedAddressId,
    setCommercePaymentMethod,
    setSelectedAddress,
    setShoppingOrderConfirmation,
    shoppingCart,
  } = useSuperAppStore();

  const address = savedAddresses.find((item) => item.id === selectedAddressId) ?? savedAddresses[0];
  const subtotal = useMemo(
    () => shoppingCart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [shoppingCart],
  );
  const deliveryFee = 79;
  const total = subtotal + deliveryFee;

  if (!shoppingCart.length) {
    return <Redirect href="/shopping" />;
  }

  const placeOrder = async () => {
    const confirmation = await api.createShoppingOrder({
      items: shoppingCart,
      address,
      paymentMethod: commercePaymentMethod,
    });
    setShoppingOrderConfirmation(confirmation);
    clearCart('shopping');
    await refreshApp();
    router.replace('/shopping-tracking');
  };

  return (
    <ScreenShell>
      <TopBar
        eyebrow="Checkout"
        primaryAction={{ icon: 'arrow-left', onPress: () => router.back() }}
        title="Shopping checkout"
        subtitle={`${shoppingCart.length} items ready to confirm`}
      />

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Delivery address</Text>
        {savedAddresses.map((item) => {
          const active = item.id === address.id;
          return (
            <Pressable
              key={item.id}
              onPress={() => setSelectedAddress(item.id)}
              style={[styles.optionRow, active ? styles.optionRowActive : null]}>
              <Text style={styles.optionTitle}>{item.label}</Text>
              <Text style={styles.optionMeta}>
                {item.line1}, {item.line2}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Payment method</Text>
        {paymentMethods.map((method) => {
          const active = method.id === commercePaymentMethod;
          return (
            <Pressable
              key={method.id}
              onPress={() => setCommercePaymentMethod(method.id)}
              style={[styles.optionRow, active ? styles.optionRowActive : null]}>
              <Text style={styles.optionTitle}>{method.label}</Text>
              <Text style={styles.optionMeta}>{method.subtitle}</Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Order summary</Text>
        {shoppingCart.map((item) => (
          <View key={item.id} style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>{item.title}</Text>
            <Text style={styles.summaryValue}>Rs {item.price * item.quantity}</Text>
          </View>
        ))}
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Delivery</Text>
          <Text style={styles.summaryValue}>Rs {deliveryFee}</Text>
        </View>
        <View style={[styles.summaryRow, styles.summaryTotalRow]}>
          <Text style={styles.summaryTotalLabel}>Total</Text>
          <Text style={styles.summaryTotalValue}>Rs {total}</Text>
        </View>
      </View>

      <Pressable onPress={() => void placeOrder()} style={styles.payButton}>
        <Text style={styles.payButtonText}>Place shopping order</Text>
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
  optionRow: {
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.line,
    padding: spacing.md,
    gap: 4,
  },
  optionRowActive: {
    borderColor: '#BFDBFE',
    backgroundColor: colors.surfaceSoft,
  },
  optionTitle: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: '800',
  },
  optionMeta: {
    color: colors.textMuted,
    fontSize: typography.caption,
    lineHeight: 18,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  summaryLabel: {
    color: colors.textMuted,
    fontSize: typography.body,
    flex: 1,
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
  payButton: {
    borderRadius: radius.pill,
    backgroundColor: colors.sky,
    paddingVertical: 16,
    alignItems: 'center',
  },
  payButtonText: {
    color: '#FFFFFF',
    fontSize: typography.body,
    fontWeight: '800',
  },
});
