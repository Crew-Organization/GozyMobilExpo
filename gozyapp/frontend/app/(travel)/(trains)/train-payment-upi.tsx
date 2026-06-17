import { useEffect, useState } from 'react';
import { router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { PaymentBrandIcon } from '@/src/components/train/payment-brand-icons';
import {
  CompactScroller,
  PaymentDetailsModal,
  PaymentDueSummary,
  PaymentScreenShell,
} from '@/src/components/train/train-payment-shared';
import { buildRecentTrainBooking } from '@/src/lib/train-payment';
import { useTrainSearchStore } from '@/src/store/train-search-store';

const apps = [
  { id: 'GooglePay', label: 'GPay', icon: 'gpay' as const },
  { id: 'PhonePe', label: 'PhonePe', icon: 'phonepe' as const },
  { id: 'Paytm', label: 'Paytm', icon: 'paytm' as const },
  { id: 'BHIM', label: 'BHIM', icon: 'bhim' as const },
  { id: 'super.money', label: 'super.money', icon: 'supermoney' as const },
  { id: 'Navi', label: 'Navi', icon: 'navi' as const },
  { id: 'Amazon Pay', label: 'Amazon Pay', icon: 'amazonpay' as const },
];

export function formatCurrency(value: number) {
  return `\u20B9 ${value.toFixed(2)}`;
}

export default function TrainPaymentUpiScreen() {
  const { reviewBookingDraft, setReviewBookingDraft, addRecentBooking } = useTrainSearchStore();
  const [secondsLeft, setSecondsLeft] = useState(7 * 60 + 40);
  const [showDetails, setShowDetails] = useState(false);
  const booking = reviewBookingDraft;

  useEffect(() => {
    const timer = setInterval(() => setSecondsLeft((current) => (current > 0 ? current - 1 : 0)), 1000);
    return () => clearInterval(timer);
  }, []);

  const finalize = (method: 'BHIM' | 'PhonePe' | 'GooglePay') => {
    if (!booking) return;
    addRecentBooking(buildRecentTrainBooking(booking));
    setReviewBookingDraft({ ...booking, selectedPaymentMethod: method });
    setReviewBookingDraft(null);
    router.push('/train-confirmation' as never);
  };

  const ticketCharge = booking ? booking.baseFare : 0;
  const hasTripGuarantee = booking ? (booking.slot.status.toLowerCase().includes('confirm or 3x refund') || booking.slot.status.toLowerCase().includes('3x refund')) : false;
  const tripGuaranteePremium = hasTripGuarantee ? 215 : 0;
  const freeCancellationFee = 8;
  const irctcConvenienceFee = booking ? Math.max(35.40, booking.totalPrice - ticketCharge - tripGuaranteePremium - freeCancellationFee) : 35.40;
  const calculatedTotal = ticketCharge + tripGuaranteePremium + irctcConvenienceFee + freeCancellationFee;

  return (
    <PaymentScreenShell booking={booking} onBack={() => router.back()} secondsLeft={secondsLeft} title="UPI">
      {booking ? (
        <>
          <CompactScroller>
            <PaymentDueSummary booking={booking} onToggleDetails={() => setShowDetails(true)} />
            <View style={styles.panel}>
              <Text style={styles.title}>Select UPI App</Text>
              <Text style={styles.subtitle}>You will be redirected to the app after selction</Text>

              <View style={styles.card}>
                {apps.map((app, index) => (
                  <Pressable
                    key={app.id}
                    onPress={() => finalize(app.id === 'PhonePe' ? 'PhonePe' : app.id === 'GooglePay' ? 'GooglePay' : 'BHIM')}
                    style={[styles.row, index === apps.length - 1 && styles.rowLast]}
                  >
                    <PaymentBrandIcon kind={app.icon} />
                    <Text style={styles.label}>{app.label}</Text>
                    <MaterialCommunityIcons color="#1697F6" name="chevron-right" size={22} />
                  </Pressable>
                ))}
              </View>

              {/* OR Divider Line */}
              <View style={styles.orRow}>
                <View style={styles.orLine} />
                <Text style={styles.orText}>OR</Text>
                <View style={styles.orLine} />
              </View>

              {/* Share Payment Link block */}
              <View style={styles.shareBlock}>
                <View style={styles.shareTitleRow}>
                  <Text style={styles.shareTitleText}>Share Payment Link</Text>
                  <View style={styles.newPill}>
                    <Text style={styles.newPillText}>new</Text>
                  </View>
                </View>
                <Text style={styles.shareSubtitle}>
                  Payments via UPI ID are discontinued as per latest NPCI guidelines - You can still request money by sharing the payment link.
                </Text>
                
                <View style={styles.successStrip}>
                  <View style={styles.successBullet}>
                    <MaterialCommunityIcons color="#0F766E" name="check" size={12} />
                  </View>
                  <Text style={styles.successStripText}>
                    Link for payment of {formatCurrency(calculatedTotal)} will be valid for 10 min
                  </Text>
                </View>
              </View>

            </View>
          </CompactScroller>
          <PaymentDetailsModal booking={booking} onClose={() => setShowDetails(false)} visible={showDetails} />
        </>
      ) : null}
    </PaymentScreenShell>
  );
}

const styles = StyleSheet.create({
  panel: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '900',
    color: '#111827',
  },
  subtitle: {
    marginTop: 4,
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '600',
  },
  card: {
    marginTop: 12,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
  },
  row: {
    minHeight: 68,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  rowLast: {
    borderBottomWidth: 0,
  },
  label: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
  },
  orRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
    gap: 12,
  },
  orLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  orText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#6B7280',
  },
  shareBlock: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 16,
    marginBottom: 20,
  },
  shareTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  shareTitleText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#111827',
  },
  newPill: {
    backgroundColor: '#FFF1F2',
    borderWidth: 0.5,
    borderColor: '#FDA4AF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  newPillText: {
    fontSize: 8,
    fontWeight: '800',
    color: '#E11D48',
    textTransform: 'uppercase',
  },
  shareSubtitle: {
    marginTop: 6,
    fontSize: 12,
    lineHeight: 16,
    color: '#D97706',
    fontWeight: '700',
  },
  successStrip: {
    marginTop: 14,
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  successBullet: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#A7F3D0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  successStripText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#065F46',
    flex: 1,
  },
});
