import { useEffect, useState } from 'react';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { PaymentBrandIcon, type PaymentBrandKind } from '@/src/components/train/payment-brand-icons';
import {
  CompactScroller,
  PaymentDetailsModal,
  PaymentDueSummary,
  PaymentScreenShell,
} from '@/src/components/train/train-payment-shared';
import { useTrainSearchStore } from '@/src/store/train-search-store';

const partners: Array<{ id: string; title: string; subtitle: string; icon: PaymentBrandKind }> = [
  { id: 'lazypay', title: 'Lazypay', subtitle: 'Unavailable at this moment', icon: 'lazy' },
  { id: 'amazon', title: 'Amazon Pay Later', subtitle: 'Customer not eligible for PayLater', icon: 'amazonpay' },
  { id: 'hdfc', title: 'HDFC Bank', subtitle: 'Insufficient Available Limit', icon: 'hdfc' },
  { id: 'icici', title: 'ICICI Bank', subtitle: 'Insufficient Available Limit', icon: 'icici' },
  { id: 'idfc', title: 'IDFC FIRST Bank', subtitle: 'Insufficient Available Limit', icon: 'idfc' },
  { id: 'bajaj', title: 'Bajaj Finserv EMI Network Card', subtitle: 'Insufficient Available Limit', icon: 'bajaj' },
  { id: 'tvs', title: 'TVS Credit', subtitle: 'Insufficient Available Limit', icon: 'tvs' },
];

export default function TrainPaymentPayLaterScreen() {
  const { reviewBookingDraft } = useTrainSearchStore();
  const [secondsLeft, setSecondsLeft] = useState(10 * 60 + 27);
  const [showDetails, setShowDetails] = useState(false);
  const booking = reviewBookingDraft;

  useEffect(() => {
    const timer = setInterval(() => setSecondsLeft((current) => (current > 0 ? current - 1 : 0)), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <PaymentScreenShell booking={booking} onBack={() => router.back()} secondsLeft={secondsLeft} title="Pay Later">
      {booking ? (
        <>
          <CompactScroller>
            <PaymentDueSummary booking={booking} onToggleDetails={() => setShowDetails(true)} />
            <View style={styles.panel}>
              <Text style={styles.title}>Select a pay later partner</Text>
              <View style={styles.card}>
                {partners.map((partner, index) => (
                  <Pressable key={partner.id} style={[styles.row, index === partners.length - 1 && styles.rowLast]}>
                    <View style={styles.radio} />
                    <PaymentBrandIcon kind={partner.icon} />
                    <View style={styles.textWrap}>
                      <Text style={styles.name}>{partner.title}</Text>
                      <Text style={styles.note}>{partner.subtitle}</Text>
                    </View>
                  </Pressable>
                ))}
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
    borderWidth: 1,
    borderColor: '#DADDE2',
    borderRadius: 18,
    overflow: 'hidden',
  },
  row: {
    minHeight: 86,
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
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#D1D5DB',
  },
  textWrap: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: '#9CA3AF',
  },
  note: {
    marginTop: 2,
    fontSize: 13,
    color: '#B8860B',
  },
});
