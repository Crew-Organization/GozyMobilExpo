import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Redirect, router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { ScreenShell } from '@/src/components/screen-shell';
import { TopBar } from '@/src/components/top-bar';
import { useSuperAppStore } from '@/src/store/super-app-store';
import { colors, radius, spacing, typography } from '@/src/theme/tokens';

// ============================================================
// Food Tracking Module
// ============================================================
// This screen shows the order confirmation, live preparation /
// delivery steps, delivery details, and post-order actions.

export default function FoodTrackingScreen() {
  const { foodOrderConfirmation, setFoodOrderConfirmation } = useSuperAppStore();

  if (!foodOrderConfirmation) {
    return <Redirect href="/food" />;
  }

  return (
    // ========================================================
    // Page Wrapper / Background Section
    // ScreenShell controls the white page background and spacing.
    // ========================================================
    <ScreenShell>
      {/* ======================================================
          Tracking Header Section
          Back-to-food button, order title, restaurant name, and ETA.
      ====================================================== */}
      <TopBar
        eyebrow="Tracking"
        primaryAction={{ icon: 'arrow-left', onPress: () => router.replace('/food') }}
        title="Order placed"
        subtitle={`${foodOrderConfirmation.restaurantName} • ETA ${foodOrderConfirmation.eta}`}
      />

      {/* ======================================================
          Success Confirmation Section
          Green check icon, confirmation title, and support message.
      ====================================================== */}
      <View style={styles.successCard}>
        {/* Success Icon Circle */}
        <View style={styles.successIcon}>
          <MaterialCommunityIcons color={colors.success} name="check-bold" size={24} />
        </View>
        <Text style={styles.successTitle}>Food order confirmed</Text>
        <Text style={styles.successBody}>{foodOrderConfirmation.supportMessage}</Text>
      </View>

      {/* ======================================================
          Live Status Timeline Section
          Each row shows one tracking step and its current state.
      ====================================================== */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Live status</Text>
        {foodOrderConfirmation.trackingSteps.map((step) => (
          <View key={step.id} style={styles.stepRow}>
            {/* Timeline State Dot */}
            <View
              style={[
                styles.stepDot,
                step.state === 'active' ? styles.stepDotActive : null,
                step.state === 'done' ? styles.stepDotDone : null,
              ]}
            />
            {/* Timeline Step Text */}
            <View style={styles.stepCopy}>
              <Text style={styles.stepTitle}>{step.label}</Text>
              <Text style={styles.stepDetail}>{step.detail}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* ======================================================
          Delivery Details Section
          Shows order id, address label, and payment method.
      ====================================================== */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Delivery details</Text>
        <Text style={styles.meta}>Order ID: {foodOrderConfirmation.orderId}</Text>
        <Text style={styles.meta}>Delivering to: {foodOrderConfirmation.addressLabel}</Text>
        <Text style={styles.meta}>Paid via: {foodOrderConfirmation.paymentMethod.toUpperCase()}</Text>
      </View>

      {/* ======================================================
          View Bookings Button Section
          Opens the full bookings screen.
      ====================================================== */}
      <Pressable onPress={() => router.push('/bookings')} style={styles.primaryButton}>
        <Text style={styles.primaryButtonText}>View all bookings</Text>
      </Pressable>

      {/* ======================================================
          Order More Food Button Section
          Clears current confirmation and returns to food home.
      ====================================================== */}
      <Pressable
        onPress={() => {
          setFoodOrderConfirmation(null);
          router.replace('/food');
        }}
        style={styles.secondaryButton}>
        <Text style={styles.secondaryButtonText}>Order more food</Text>
      </Pressable>
    </ScreenShell>
  );
}

// ============================================================
// Styles - Success Confirmation Card
// ============================================================

const styles = StyleSheet.create({
  successCard: {
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface,
    padding: spacing.xl,
    alignItems: 'center',
    gap: spacing.md,
  },
  successIcon: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: '#ECFDF3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  successTitle: {
    color: colors.text,
    fontSize: typography.title,
    fontWeight: '900',
  },
  successBody: {
    color: colors.textMuted,
    fontSize: typography.body,
    textAlign: 'center',
    lineHeight: 21,
  },

  // ==========================================================
  // Styles - Shared White Card Background
  // ==========================================================

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

  // ==========================================================
  // Styles - Live Tracking Timeline
  // ==========================================================

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
    backgroundColor: colors.sky,
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
  meta: {
    color: colors.textMuted,
    fontSize: typography.body,
  },

  // ==========================================================
  // Styles - Action Buttons
  // ==========================================================

  primaryButton: {
    borderRadius: radius.pill,
    backgroundColor: colors.sky,
    paddingVertical: 16,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
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
