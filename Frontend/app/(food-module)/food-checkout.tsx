import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Redirect, router } from 'expo-router';

import { ScreenShell } from '@/src/components/screen-shell';
import { TopBar } from '@/src/components/top-bar';
import { useApp } from '@/src/context/app-context';
import { paymentMethods, savedAddresses } from '@/src/lib/commerce-data';
import { api } from '@/src/lib/api';
import { useSuperAppStore } from '@/src/store/super-app-store';
import { colors, radius, spacing, typography } from '@/src/theme/tokens';

export default function FoodCheckoutScreen() {
  const { refreshApp } = useApp();
  const {
    clearCart,
    commercePaymentMethod,
    foodCart,
    selectedAddressId,
    selectedRestaurantId,
    setCommercePaymentMethod,
    setFoodOrderConfirmation,
    setSelectedAddress,
  } = useSuperAppStore();
  const { restaurants } = useApp();

  const restaurant = restaurants.find((item) => item.id === selectedRestaurantId) ?? restaurants[0];
  const address = savedAddresses.find((item) => item.id === selectedAddressId) ?? savedAddresses[0];
  const subtotal = useMemo(
    () => foodCart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [foodCart],
  );
  const deliveryFee = 39;
  const total = subtotal + deliveryFee;

  if (!foodCart.length || !restaurant) {
    return <Redirect href="/food" />;
  }

  const placeOrder = async () => {
    const confirmation = await api.createFoodOrder(
      {
        restaurantId: restaurant.id,
        items: foodCart,
        address,
        paymentMethod: commercePaymentMethod,
        instructions: 'Leave at the door',
      },
      restaurant,
    );

    setFoodOrderConfirmation(confirmation);
    clearCart('food');
    await refreshApp();
    router.replace('/food-tracking');
  };

  return (
    <ScreenShell>
      <TopBar
        eyebrow="Checkout"
        primaryAction={{ icon: 'arrow-left', onPress: () => router.back() }}
        title="Food checkout"
        subtitle={`${restaurant.name} • ${foodCart.length} items`}
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
              <View style={styles.optionCopy}>
                <Text style={styles.optionTitle}>{item.label}</Text>
                <Text style={styles.optionMeta}>
                  {item.line1}, {item.line2}
                </Text>
              </View>
              <Text style={styles.optionHint}>{item.etaHint}</Text>
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
              <View style={styles.optionCopy}>
                <Text style={styles.optionTitle}>{method.label}</Text>
                <Text style={styles.optionMeta}>{method.subtitle}</Text>
              </View>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Instructions</Text>
        <TextInput
          editable={false}
          style={styles.input}
          value="Leave at the door • ring once"
        />
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Bill summary</Text>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Item total</Text>
          <Text style={styles.summaryValue}>Rs {subtotal}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Delivery fee</Text>
          <Text style={styles.summaryValue}>Rs {deliveryFee}</Text>
        </View>
        <View style={[styles.summaryRow, styles.summaryTotalRow]}>
          <Text style={styles.summaryTotalLabel}>To pay</Text>
          <Text style={styles.summaryTotalValue}>Rs {total}</Text>
        </View>
      </View>

      <Pressable onPress={() => void placeOrder()} style={styles.payButton}>
        <Text style={styles.payButtonText}>Place order</Text>
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
    gap: 6,
  },
  optionRowActive: {
    borderColor: '#BFDBFE',
    backgroundColor: colors.surfaceSoft,
  },
  optionCopy: {
    gap: 4,
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
  optionHint: {
    color: colors.sky,
    fontSize: typography.caption,
    fontWeight: '700',
  },
  input: {
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.line,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    color: colors.textMuted,
    fontSize: typography.body,
    backgroundColor: colors.canvasMuted,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryLabel: {
    color: colors.textMuted,
    fontSize: typography.body,
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
