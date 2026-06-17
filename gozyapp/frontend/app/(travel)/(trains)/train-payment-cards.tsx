import { useEffect, useState } from 'react';
import { router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import {
  CompactScroller,
  PaymentDetailsModal,
  PaymentDueSummary,
  PaymentScreenShell,
} from '@/src/components/train/train-payment-shared';
import { buildRecentTrainBooking } from '@/src/lib/train-payment';
import { useTrainSearchStore } from '@/src/store/train-search-store';

export default function TrainPaymentCardsScreen() {
  const { reviewBookingDraft, setReviewBookingDraft, addRecentBooking } = useTrainSearchStore();
  const [secondsLeft, setSecondsLeft] = useState(7 * 60 + 35);
  const [showDetails, setShowDetails] = useState(false);
  const booking = reviewBookingDraft;

  useEffect(() => {
    const timer = setInterval(() => setSecondsLeft((current) => (current > 0 ? current - 1 : 0)), 1000);
    return () => clearInterval(timer);
  }, []);

  const payNow = () => {
    if (!booking) return;
    addRecentBooking(buildRecentTrainBooking(booking));
    setReviewBookingDraft({ ...booking, selectedPaymentMethod: 'GooglePay' });
    setReviewBookingDraft(null);
    router.push('/train-confirmation' as never);
  };

  return (
    <PaymentScreenShell booking={booking} onBack={() => router.back()} secondsLeft={secondsLeft} title="Cards">
      {booking ? (
        <>
          <CompactScroller>
            <PaymentDueSummary booking={booking} onToggleDetails={() => setShowDetails(true)} />

            <View style={styles.notice}>
              <MaterialCommunityIcons color="#7C6A46" name="information-outline" size={20} />
              <Text style={styles.noticeText}>Please ensure your card is enabled for online transaction.</Text>
              <Text style={styles.noticeLink}>Know more</Text>
            </View>

            <View style={styles.cardBox}>
              <TextInput placeholder="ENTER CARD NUMBER" placeholderTextColor="#1F2937" style={styles.inputLarge} />
              <View style={styles.inlineRow}>
                <TextInput placeholder="MM/YY" placeholderTextColor="#1F2937" style={[styles.inputSmall, styles.inlineInput]} />
                <View style={[styles.inputSmall, styles.inlineInput, styles.cvvWrap]}>
                  <TextInput placeholder="CVV" placeholderTextColor="#1F2937" style={styles.cvvInput} />
                  <MaterialCommunityIcons color="#1F2937" name="eye-off-outline" size={24} />
                </View>
              </View>
            </View>

            <Pressable onPress={payNow} style={styles.payButton}>
              <Text style={styles.payButtonText}>PAY</Text>
            </Pressable>
          </CompactScroller>
          <PaymentDetailsModal booking={booking} onClose={() => setShowDetails(false)} visible={showDetails} />
        </>
      ) : null}
    </PaymentScreenShell>
  );
}

const styles = StyleSheet.create({
  notice: {
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 14,
    backgroundColor: '#FFF0CF',
    paddingHorizontal: 14,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  noticeText: {
    flex: 1,
    fontSize: 13,
    color: '#5B4631',
  },
  noticeLink: {
    fontSize: 13,
    fontWeight: '800',
    color: '#5B4631',
  },
  cardBox: {
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 22,
    backgroundColor: '#BEEAF2',
    padding: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  inputLarge: {
    height: 62,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  inlineRow: {
    marginTop: 14,
    flexDirection: 'row',
    gap: 12,
  },
  inlineInput: {
    flex: 1,
  },
  inputSmall: {
    height: 62,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  cvvWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cvvInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  payButton: {
    height: 54,
    marginHorizontal: 16,
    marginTop: 18,
    borderRadius: 10,
    backgroundColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  payButtonText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#6B7280',
  },
});
