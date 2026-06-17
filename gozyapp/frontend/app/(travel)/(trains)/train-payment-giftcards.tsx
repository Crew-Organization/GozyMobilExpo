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
import { useTrainSearchStore } from '@/src/store/train-search-store';

export default function TrainPaymentGiftCardsScreen() {
  const { reviewBookingDraft } = useTrainSearchStore();
  const [secondsLeft, setSecondsLeft] = useState(7 * 60 + 12);
  const [showDetails, setShowDetails] = useState(false);
  const booking = reviewBookingDraft;

  useEffect(() => {
    const timer = setInterval(() => setSecondsLeft((current) => (current > 0 ? current - 1 : 0)), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <PaymentScreenShell booking={booking} onBack={() => router.back()} secondsLeft={secondsLeft} title="Gift Cards">
      {booking ? (
        <>
          <CompactScroller>
            <PaymentDueSummary booking={booking} onToggleDetails={() => setShowDetails(true)} />
            <View style={styles.panel}>
              <Text style={styles.title}>Gift Cards & e-wallets</Text>
              <View style={styles.card}>
                <Pressable onPress={() => router.push('/train-payment-add-giftcard' as never)} style={styles.row}>
                  <PaymentBrandIcon kind="giftcard" />
                  <View style={styles.textWrap}>
                    <Text style={styles.label}>MMT Gift Card</Text>
                    <Text style={styles.note}>Add or apply an existing gift card</Text>
                  </View>
                  <MaterialCommunityIcons color="#1697F6" name="chevron-right" size={22} />
                </Pressable>
                <View style={[styles.row, styles.rowLast]}>
                  <PaymentBrandIcon kind="amazonpay" />
                  <View style={styles.textWrap}>
                    <Text style={styles.label}>Amazon Pay</Text>
                    <Text style={styles.note}>Wallet will be available after linking</Text>
                  </View>
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
  card: {
    marginTop: 14,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
  },
  row: {
    minHeight: 72,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  rowLast: {
    borderBottomWidth: 0,
  },
  textWrap: {
    flex: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  note: {
    marginTop: 2,
    fontSize: 12,
    color: '#6B7280',
  },
});
