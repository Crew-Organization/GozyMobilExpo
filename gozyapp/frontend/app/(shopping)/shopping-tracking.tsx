import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Redirect, router } from 'expo-router';

import { ScreenShell } from '@/src/components/screen-shell';
import { TopBar } from '@/src/components/top-bar';
import { useSuperAppStore } from '@/src/store/super-app-store';
import { colors, radius, spacing, typography } from '@/src/theme/tokens';

export default function ShoppingTrackingScreen() {
  const { setShoppingOrderConfirmation, shoppingOrderConfirmation } = useSuperAppStore();

  if (!shoppingOrderConfirmation) {
    return <Redirect href="/shopping" />;
  }

  return (
    <ScreenShell>
      <TopBar
        eyebrow="Tracking"
        primaryAction={{ icon: 'arrow-left', onPress: () => router.replace('/shopping') }}
        title="Order confirmed"
        subtitle={`Delivery by ${shoppingOrderConfirmation.deliveryDate}`}
      />

      <View style={styles.card}>
        <Text style={styles.title}>Shopping order placed</Text>
        <Text style={styles.body}>{shoppingOrderConfirmation.supportMessage}</Text>
        <Text style={styles.meta}>Order ID: {shoppingOrderConfirmation.orderId}</Text>
        <Text style={styles.meta}>
          Delivering to: {shoppingOrderConfirmation.addressLabel}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Delivery timeline</Text>
        {shoppingOrderConfirmation.trackingSteps.map((step) => (
          <View key={step.id} style={styles.stepRow}>
            <View
              style={[
                styles.stepDot,
                step.state === 'active' ? styles.stepDotActive : null,
                step.state === 'done' ? styles.stepDotDone : null,
              ]}
            />
            <View style={styles.stepCopy}>
              <Text style={styles.stepTitle}>{step.label}</Text>
              <Text style={styles.stepDetail}>{step.detail}</Text>
            </View>
          </View>
        ))}
      </View>

      <Pressable onPress={() => router.push('/bookings')} style={styles.primaryButton}>
        <Text style={styles.primaryButtonText}>Open bookings</Text>
      </Pressable>

      <Pressable
        onPress={() => {
          setShoppingOrderConfirmation(null);
          router.replace('/shopping');
        }}
        style={styles.secondaryButton}>
        <Text style={styles.secondaryButtonText}>Back to shopping</Text>
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
    fontSize: typography.caption,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: typography.section,
    fontWeight: '900',
  },
  stepRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  stepDot: {
    width: 14,
    height: 14,
    borderRadius: radius.pill,
    backgroundColor: colors.lineStrong,
    marginTop: 2,
  },
  stepDotActive: {
    backgroundColor: '#FF3F6C',
  },
  stepDotDone: {
    backgroundColor: colors.success,
  },
  stepCopy: {
    flex: 1,
    gap: 2,
  },
  stepTitle: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: '800',
  },
  stepDetail: {
    color: colors.textMuted,
    fontSize: typography.caption,
    lineHeight: 18,
  },
  primaryButton: {
    borderRadius: radius.pill,
    backgroundColor: '#FF3F6C',
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
