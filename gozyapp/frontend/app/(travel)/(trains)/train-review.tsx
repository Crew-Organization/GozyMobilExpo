import { useEffect, useState } from 'react';
import { router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTrainSearchStore } from '@/src/store/train-search-store';

export default function TrainReviewScreen() {
  const { reviewBookingDraft } = useTrainSearchStore();
  const [secondsLeft, setSecondsLeft] = useState(10 * 60);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((current) => (current > 0 ? current - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const booking = reviewBookingDraft;

  if (!booking) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No review booking is ready yet.</Text>
          <Pressable onPress={() => router.back()} style={styles.backHomeButton}>
            <Text style={styles.backHomeText}>Go back</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <Pressable hitSlop={12} onPress={() => router.back()} style={styles.backButton}>
          <MaterialCommunityIcons color="#0F172A" name="arrow-left" size={24} />
        </Pressable>
        <View style={styles.headerTextWrap}>
          <Text style={styles.headerTitle}>Review Booking</Text>
          <Text style={styles.headerSubtitle}>{booking.routeTitle}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Timer Strip */}
        <View style={styles.timerStrip}>
          <Text style={styles.timerInfo}>Review booking, complete payment and enter IRCTC login password in 10 mins.</Text>
          <View style={styles.timerBadge}>
            <MaterialCommunityIcons color="#FFFFFF" name="clock-outline" size={14} />
            <Text style={styles.timerBadgeText}>
              {Math.floor(secondsLeft / 60)}:{(secondsLeft % 60).toString().padStart(2, '0')}
            </Text>
          </View>
        </View>

        {/* Train Card */}
        <View style={styles.card}>
          <View style={styles.trainTitleRow}>
            <Text style={styles.trainName}>{booking.train.name}</Text>
            <Text style={styles.trainNumber}>#{booking.train.number}</Text>
          </View>
          <Text style={styles.trainSubRow}>
            <Text style={styles.trainClass}>{booking.slot.className}</Text> | <Text style={styles.trainQuota}>{booking.slot.quotaLabel}</Text>
          </Text>
          <Text style={styles.ticketStatus}>Available-0004</Text>
          <Text style={styles.detailsToggleTextRight}>View Details v</Text>

          <View style={styles.divider} />

          <View style={styles.boardingRow}>
            <Text style={styles.boardingLabel}>Boarding{'\n'}Station</Text>
            <View style={styles.boardingInfo}>
              <Text style={styles.boardingStationText}>{booking.train.departureStation}</Text>
              <Text style={styles.boardingTimeText}>{booking.train.departureTime} (24 Apr)</Text>
            </View>
          </View>

          <View style={styles.divider} />

          {booking.passengers.map((p) => (
            <View key={p.id} style={styles.travellerRow}>
              <Text style={styles.travellerName}>{p.name}, {p.age} ({p.gender.charAt(0)})</Text>
              <Text style={styles.travellerMeta}>{p.berth}</Text>
            </View>
          ))}
        </View>

        {/* Important Info Card */}
        <View style={styles.importantInfoCard}>
          <View style={styles.importantInfoHeader}>
            <Text style={styles.importantInfoTitle}>Important Information</Text>
            <MaterialCommunityIcons name="close" size={20} color="#64748B" />
          </View>
          <View style={styles.importantInfoBanner}>
            <MaterialCommunityIcons name="alert-circle" size={16} color="#D97706" />
            <Text style={styles.importantInfoBannerText}>Your IRCTC password will be required after payment to complete the booking. Please verify your username.</Text>
          </View>
          <View style={styles.irctcRow}>
            <Text style={styles.irctcLabel}>IRCTC USERNAME</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <Text style={styles.irctcValue}>{booking.irctcUsername}</Text>
              <Text style={styles.blueLink}>Edit</Text>
            </View>
          </View>
          <View style={styles.irctcRow}>
            <Text style={styles.irctcLabel}>IRCTC PASSWORD</Text>
            <Text style={styles.irctcWarningText}>Will be required after payment</Text>
          </View>
          <View style={[styles.irctcRow, { marginTop: 12 }]}>
            <Text style={styles.blueLink}>Get New Password</Text>
            <Text style={styles.blueLink}>Create IRCTC Account</Text>
          </View>
        </View>

      </ScrollView>

      {/* Fixed Bottom Bar */}
      <View style={styles.bottomBar}>
        <Pressable onPress={() => router.push('/train-payment')} style={styles.proceedButton}>
          <Text style={styles.proceedButtonText}>PROCEED TO PAYMENT</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F1F5F9' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  backButton: { marginRight: 12 },
  headerTextWrap: { flex: 1 },
  headerTitle: { fontSize: 16, fontWeight: '700', color: '#0F172A' },
  headerSubtitle: { fontSize: 12, color: '#64748B', marginTop: 2 },
  scrollContent: { paddingBottom: 100 },

  timerStrip: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 12, backgroundColor: '#FCD34D' },
  timerInfo: { flex: 1, fontSize: 12, color: '#78350F', fontWeight: '600' },
  timerBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F59E0B', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 16, marginLeft: 12 },
  timerBadgeText: { fontSize: 12, color: '#FFF', fontWeight: '700', marginLeft: 4 },

  card: { backgroundColor: '#FFF', marginVertical: 4, padding: 16, borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#E2E8F0' },
  trainTitleRow: { flexDirection: 'row', alignItems: 'baseline', gap: 8 },
  trainName: { fontSize: 18, fontWeight: '700', color: '#0F172A' },
  trainNumber: { fontSize: 13, color: '#64748B' },
  trainSubRow: { marginTop: 8 },
  trainClass: { fontSize: 12, fontWeight: '600', color: '#64748B' },
  trainQuota: { fontSize: 12, fontWeight: '600', color: '#F59E0B' },
  ticketStatus: { fontSize: 12, color: '#10B981', marginTop: 4 },
  detailsToggleTextRight: { textAlign: 'right', fontSize: 12, color: '#0084FF', fontWeight: '600', marginTop: -16 },
  
  divider: { height: 1, backgroundColor: '#F1F5F9', marginVertical: 16 },

  boardingRow: { flexDirection: 'row' },
  boardingLabel: { fontSize: 12, fontWeight: '600', color: '#64748B', width: 70 },
  boardingInfo: { flex: 1, paddingHorizontal: 12 },
  boardingStationText: { fontSize: 13, fontWeight: '600', color: '#0F172A' },
  boardingTimeText: { fontSize: 12, color: '#0F172A', marginTop: 4, fontWeight: '600' },

  travellerRow: { marginBottom: 8 },
  travellerName: { fontSize: 13, fontWeight: '700', color: '#0F172A' },
  travellerMeta: { fontSize: 12, color: '#64748B', marginTop: 2 },

  importantInfoCard: { backgroundColor: '#FFF', margin: 16, borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0', overflow: 'hidden' },
  importantInfoHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  importantInfoTitle: { fontSize: 13, fontWeight: '700', color: '#0F172A' },
  importantInfoBanner: { flexDirection: 'row', backgroundColor: '#FEF3C7', padding: 12, gap: 8 },
  importantInfoBannerText: { flex: 1, fontSize: 12, color: '#92400E', fontWeight: '500' },
  
  irctcRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, marginTop: 12, paddingBottom: 4 },
  irctcLabel: { fontSize: 10, color: '#64748B', fontWeight: '600' },
  irctcValue: { fontSize: 13, fontWeight: '700', color: '#0F172A' },
  irctcWarningText: { fontSize: 12, fontWeight: '600', color: '#D97706' },
  blueLink: { fontSize: 12, fontWeight: '600', color: '#0084FF' },

  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#FFFFFF', padding: 16, borderTopWidth: 1, borderTopColor: '#E2E8F0', paddingBottom: 32 },
  proceedButton: { backgroundColor: '#0084FF', padding: 16, borderRadius: 8, alignItems: 'center' },
  proceedButtonText: { fontSize: 16, fontWeight: '700', color: '#FFFFFF' },

  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyTitle: { fontSize: 18, fontWeight: '700' },
  backHomeButton: { marginTop: 16, padding: 12, backgroundColor: '#0084FF', borderRadius: 8 },
  backHomeText: { color: '#FFF', fontWeight: '700' },
});
