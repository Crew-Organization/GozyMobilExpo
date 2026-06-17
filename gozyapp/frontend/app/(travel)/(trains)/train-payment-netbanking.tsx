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

const popularBanks: Array<{ id: string; name: string; icon: PaymentBrandKind; hint?: string }> = [
  { id: 'axis', name: 'Axis Bank', icon: 'axis', hint: 'Fingerprint ID/ FaceID' },
  { id: 'hdfc', name: 'HDFC Bank', icon: 'hdfc' },
  { id: 'icici', name: 'ICICI Bank', icon: 'icici', hint: 'Fingerprint ID/ FaceID' },
  { id: 'sbi', name: 'State Bank of India', icon: 'sbi' },
];

const allBanks: Array<{ id: string; name: string; icon: PaymentBrandKind; hint?: string }> = [
  { id: 'au', name: 'AU Small Finance Bank', icon: 'au' },
  { id: 'axis', name: 'Axis Bank', icon: 'axis', hint: 'Fingerprint ID/ FaceID' },
  { id: 'bandhan', name: 'Bandhan Bank', icon: 'bandhan' },
  { id: 'bob-corp', name: 'Bank Of Baroda Corporate', icon: 'bob' },
  { id: 'bob-retail', name: 'Bank Of Baroda Retail', icon: 'bob' },
  { id: 'boi', name: 'Bank of India', icon: 'boi' },
  { id: 'bom', name: 'Bank of Maharashtra', icon: 'bom' },
  { id: 'hdfc', name: 'HDFC Bank', icon: 'hdfc' },
  { id: 'icici', name: 'ICICI Bank', icon: 'icici', hint: 'Fingerprint ID/ FaceID' },
  { id: 'sbi', name: 'State Bank of India', icon: 'sbi' },
];

export default function TrainPaymentNetBankingScreen() {
  const { reviewBookingDraft, setReviewBookingDraft, addRecentBooking } = useTrainSearchStore();
  const [secondsLeft, setSecondsLeft] = useState(7 * 60 + 28);
  const [showDetails, setShowDetails] = useState(false);
  const [query, setQuery] = useState('');
  const booking = reviewBookingDraft;

  useEffect(() => {
    const timer = setInterval(() => setSecondsLeft((current) => (current > 0 ? current - 1 : 0)), 1000);
    return () => clearInterval(timer);
  }, []);

  const visibleBanks = useMemo(() => {
    if (!query.trim()) return allBanks;
    return allBanks.filter((bank) => bank.name.toLowerCase().includes(query.trim().toLowerCase()));
  }, [query]);

  const chooseBank = () => {
    if (!booking) return;
    addRecentBooking(buildRecentTrainBooking(booking));
    setReviewBookingDraft({ ...booking, selectedPaymentMethod: 'BHIM' });
    setReviewBookingDraft(null);
    router.push('/train-confirmation' as never);
  };

  return (
    <PaymentScreenShell booking={booking} onBack={() => router.back()} secondsLeft={secondsLeft} title="Net banking">
      {booking ? (
        <>
          <CompactScroller>
            <PaymentDueSummary booking={booking} onToggleDetails={() => setShowDetails(true)} />
            <View style={styles.panel}>
              <View style={styles.searchBox}>
                <MaterialCommunityIcons color="#9CA3AF" name="magnify" size={22} />
                <TextInput
                  onChangeText={setQuery}
                  placeholder="Search Bank Here"
                  placeholderTextColor="#9CA3AF"
                  style={styles.searchInput}
                  value={query}
                />
              </View>

              {/* Popular Banks block (only shown when not searching) */}
              {!query.trim() ? (
                <View style={styles.section}>
                  <Text style={styles.sectionHeader}>Popular Banks</Text>
                  <View style={styles.card}>
                    {popularBanks.map((bank, index) => (
                      <Pressable
                        key={`pop-${bank.id}`}
                        onPress={chooseBank}
                        style={[styles.row, index === popularBanks.length - 1 && styles.rowLast]}
                      >
                        <PaymentBrandIcon kind={bank.icon} />
                        <Text style={styles.bankName}>{bank.name}</Text>
                        {bank.hint ? (
                          <View style={styles.badgeWrap}>
                            <Text style={styles.hintText}>{bank.hint}</Text>
                          </View>
                        ) : null}
                        <MaterialCommunityIcons color="#1697F6" name="chevron-right" size={22} />
                      </Pressable>
                    ))}
                  </View>
                </View>
              ) : null}

              {/* All Banks block */}
              <View style={styles.section}>
                <Text style={styles.sectionHeader}>
                  {query.trim() ? 'Search Results' : 'All Banks'}
                </Text>
                <View style={styles.card}>
                  {visibleBanks.map((bank, index) => (
                    <Pressable
                      key={`all-${bank.id}`}
                      onPress={chooseBank}
                      style={[styles.row, index === visibleBanks.length - 1 && styles.rowLast]}
                    >
                      <PaymentBrandIcon kind={bank.icon} />
                      <Text style={styles.bankName}>{bank.name}</Text>
                      {bank.hint ? (
                        <View style={styles.badgeWrap}>
                          <Text style={styles.hintText}>{bank.hint}</Text>
                        </View>
                      ) : null}
                      <MaterialCommunityIcons color="#1697F6" name="chevron-right" size={22} />
                    </Pressable>
                  ))}
                  {visibleBanks.length === 0 && (
                    <View style={styles.emptyState}>
                      <Text style={styles.emptyText}>No banks found matching "{query}"</Text>
                    </View>
                  )}
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
    paddingBottom: 32,
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
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#111827',
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    fontSize: 17,
    fontWeight: '800',
    color: '#111827',
    marginTop: 6,
    marginBottom: 10,
  },
  card: {
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
  badgeWrap: {
    backgroundColor: '#00BFA5',
    borderRadius: 14,
    paddingHorizontal: 8,
    paddingVertical: 3.5,
    marginRight: 4,
  },
  hintText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '700',
  },
  emptyState: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
  },
});
