import { useEffect, useMemo, useState } from 'react';
import { router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { PaymentBrandIcon, type PaymentBrandKind } from '@/src/components/train/payment-brand-icons';
import {
  CompactScroller,
  PaymentDetailsModal,
  PaymentDueSummary,
  PaymentScreenShell,
} from '@/src/components/train/train-payment-shared';
import { buildRecentTrainBooking } from '@/src/lib/train-payment';
import { useTrainSearchStore } from '@/src/store/train-search-store';

type EmiTab = 'CREDIT CARD' | 'DEBIT CARD' | 'CARDLESS EMI';

const availableBanks: Array<{ id: string; name: string; icon: PaymentBrandKind }> = [
  { id: 'hdfc', name: 'HDFC Bank', icon: 'hdfc' },
  { id: 'kotak', name: 'Kotak Mahindra Bank', icon: 'kotak' },
];

const unavailableBanks: Array<{ id: string; name: string; icon: PaymentBrandKind }> = [
  { id: 'bajaj', name: 'Bajaj Finserv EMI Network Card', icon: 'bajaj' },
  { id: 'icici', name: 'ICICI Bank', icon: 'icici' },
  { id: 'axis', name: 'Axis Bank', icon: 'axis' },
  { id: 'hsbc', name: 'HSBC Bank', icon: 'hsbc' },
  { id: 'sbi', name: 'SBI Card', icon: 'sbi' },
];

export default function TrainPaymentEmiScreen() {
  const { reviewBookingDraft, setReviewBookingDraft, addRecentBooking } = useTrainSearchStore();
  const [secondsLeft, setSecondsLeft] = useState(7 * 60 + 5);
  const [showDetails, setShowDetails] = useState(false);
  const [query, setQuery] = useState('');
  const [tab, setTab] = useState<EmiTab>('CREDIT CARD');
  const booking = reviewBookingDraft;

  useEffect(() => {
    const timer = setInterval(() => setSecondsLeft((current) => (current > 0 ? current - 1 : 0)), 1000);
    return () => clearInterval(timer);
  }, []);

  const visibleAvailable = useMemo(() => {
    if (!query.trim()) return availableBanks;
    return availableBanks.filter((bank) => bank.name.toLowerCase().includes(query.trim().toLowerCase()));
  }, [query]);

  const chooseEmi = () => {
    if (!booking) return;
    addRecentBooking(buildRecentTrainBooking(booking));
    setReviewBookingDraft({ ...booking, selectedPaymentMethod: 'BHIM' });
    setReviewBookingDraft(null);
    router.push('/train-confirmation' as never);
  };

  return (
    <PaymentScreenShell booking={booking} onBack={() => router.back()} secondsLeft={secondsLeft} title="EMI">
      {booking ? (
        <>
          <CompactScroller>
            <PaymentDueSummary booking={booking} onToggleDetails={() => setShowDetails(true)} />
            <View style={styles.panel}>
              <View style={styles.searchBox}>
                <MaterialCommunityIcons color="#9CA3AF" name="magnify" size={22} />
                <TextInput
                  onChangeText={setQuery}
                  placeholder="Search here"
                  placeholderTextColor="#9CA3AF"
                  style={styles.searchInput}
                  value={query}
                />
              </View>

              <View style={styles.tabRow}>
                {(['CREDIT CARD', 'DEBIT CARD', 'CARDLESS EMI'] as EmiTab[]).map((item) => (
                  <Pressable key={item} onPress={() => setTab(item)} style={[styles.tab, tab === item && styles.tabActive]}>
                    <Text style={[styles.tabText, tab === item && styles.tabTextActive]}>{item}</Text>
                  </Pressable>
                ))}
              </View>

              <Text style={styles.groupTitle}>All Banks</Text>
              <View style={styles.card}>
                {visibleAvailable.map((bank, index) => (
                  <Pressable key={bank.id} onPress={chooseEmi} style={[styles.row, index === visibleAvailable.length - 1 && styles.rowLast]}>
                    <PaymentBrandIcon kind={bank.icon} />
                    <Text style={styles.bankName}>{bank.name}</Text>
                    <MaterialCommunityIcons color="#1697F6" name="chevron-right" size={22} />
                  </Pressable>
                ))}
              </View>

              <Text style={[styles.groupTitle, styles.groupTitleOffset]}>Banks unavailable for this booking</Text>
              <Text style={styles.subtitle}>Insufficient booking amount</Text>
              <View style={styles.card}>
                {unavailableBanks.map((bank, index) => (
                  <View key={bank.id} style={[styles.row, index === unavailableBanks.length - 1 && styles.rowLast]}>
                    <PaymentBrandIcon kind={bank.icon} />
                    <Text style={styles.bankNameMuted}>{bank.name}</Text>
                  </View>
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
  searchBox: {
    height: 52,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#111827',
  },
  tabRow: {
    marginTop: 14,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    flexDirection: 'row',
  },
  tab: {
    flex: 1,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRightWidth: 1,
    borderRightColor: '#D1D5DB',
  },
  tabActive: {
    backgroundColor: '#EAF4FF',
  },
  tabText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#374151',
  },
  tabTextActive: {
    color: '#111827',
  },
  groupTitle: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '900',
    color: '#111827',
  },
  groupTitleOffset: {
    marginTop: 20,
  },
  subtitle: {
    marginTop: 4,
    fontSize: 12,
    color: '#6B7280',
  },
  card: {
    marginTop: 10,
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
  bankName: {
    flex: 1,
    fontSize: 13,
    color: '#111827',
  },
  bankNameMuted: {
    flex: 1,
    fontSize: 13,
    color: '#9CA3AF',
  },
});
