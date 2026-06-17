import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { colors, radius, spacing, typography, shadow } from '@/src/theme/tokens';
import { formatBusDate } from '@/src/lib/bus-booking-utils';
import { formatBusFare } from '@/src/lib/bus-search-data';
import { getSeatLayout } from '@/src/services/busService';
import { Seat, Deck, useBookingStore } from '@/src/store/bus-booking-store';

const PRIMARY = '#2563EB';

export default function SelectSeatsScreen() {
  const params = useLocalSearchParams<{
    busId: string;
    operator: string;
    busType: string;
    rating: string;
    reviews: string;
    price: string;
    originalPrice: string;
    departureTime: string;
    arrivalTime: string;
    duration: string;
    seatsLeft: string;
    singleSeatsLeft?: string;
    isSleeper: string;
    fromCity: string;
    toCity: string;
    date: string;
    amenities?: string;
    isTripAssured?: string;
    hasFreeCancellation?: string;
  }>();

  const isSleeper = params.isSleeper === 'true';
  const isTripAssured = params.isTripAssured === 'true';
  const hasFreeCancellation = params.hasFreeCancellation === 'true';
  const basePrice = parseInt(params.price ?? '1200', 10);
  const operatorName = params.operator ?? 'VRL Travels';
  const ratingVal = parseFloat(params.rating ?? '4.5');

  const [activeDeck, setActiveDeck] = useState<Deck>('lower');
  const [seatLayout, setSeatLayout] = useState<Seat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  
  const [showInfoSheet, setShowInfoSheet] = useState(false);
  const [infoTab, setInfoTab] = useState<'Bus Info' | 'Amenities' | 'Reviews' | 'Bus Stops' | 'Policies'>('Bus Info');
  const [showOffersSheet, setShowOffersSheet] = useState(false);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const seats = await getSeatLayout(params.busId, isSleeper, basePrice);
      setSeatLayout(seats);
      setIsLoading(false);
    })();
  }, [params.busId, isSleeper, basePrice]);

  const deckSeats = useMemo(
    () => seatLayout.filter((s) => s.deck === activeDeck),
    [seatLayout, activeDeck]
  );

  const rows = useMemo(() => {
    const map: Record<number, Seat[]> = {};
    deckSeats.forEach((seat) => {
      if (!map[seat.row]) map[seat.row] = [];
      map[seat.row].push(seat);
    });
    return Object.keys(map)
      .map(Number)
      .sort((a, b) => a - b)
      .map((n) => map[n].sort((a, b) => a.col - b.col));
  }, [deckSeats]);

  const totalAmount = useMemo(
    () => selectedSeats.reduce((s, seat) => s + seat.price, 0),
    [selectedSeats]
  );

  const handleSeatPress = useCallback(
    (seat: Seat) => {
      if (seat.status === 'booked' || seat.status === 'male' || seat.status === 'blocked') return;
      const already = selectedSeats.some((s) => s.id === seat.id);
      if (already) {
        setSelectedSeats((prev) => prev.filter((s) => s.id !== seat.id));
      } else {
        if (selectedSeats.length >= 6) {
          Alert.alert('Limit Reached', 'You can select up to 6 seats at once.');
          return;
        }
        setSelectedSeats((prev) => [...prev, seat]);
      }
    },
    [selectedSeats]
  );

  const handleProceed = useCallback(() => {
    if (selectedSeats.length === 0) {
      Alert.alert('No Seats Selected', 'Please select at least one seat to continue.');
      return;
    }
    router.push({
      pathname: '/(bus-module)/boarding-selection',
      params: {
        busId: params.busId,
        operator: operatorName,
        busType: params.busType,
        seats: selectedSeats.map((s) => s.id).join(','),
        totalFare: String(totalAmount),
        fromCity: params.fromCity,
        toCity: params.toCity,
        date: params.date,
        departureTime: params.departureTime,
        arrivalTime: params.arrivalTime,
        duration: params.duration,
      },
    } as any);
  }, [selectedSeats, totalAmount, params, operatorName]);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingView}>
          <ActivityIndicator size="large" color={PRIMARY} />
          <Text style={styles.loadingText}>Loading seat map…</Text>
        </View>
      </SafeAreaView>
    );
  }

  const lowerCount = seatLayout.filter((s) => s.deck === 'lower' && s.status !== 'booked' && s.status !== 'blocked').length;
  const upperCount = seatLayout.filter((s) => s.deck === 'upper' && s.status !== 'booked' && s.status !== 'blocked').length;

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      {/* ── Header ── */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#0F172A" />
        </Pressable>
        <Text style={styles.headerTitle}>Select Seats</Text>
        <Pressable style={styles.infoBtn} onPress={() => setShowInfoSheet(true)}>
          <MaterialCommunityIcons name="information-outline" size={20} color="#3B82F6" />
          <Text style={styles.infoBtnText}>INFO</Text>
        </Pressable>
      </View>

      <View style={styles.deckTabsRow}>
        <Pressable style={[styles.deckTab, activeDeck === 'lower' && styles.deckTabActive]} onPress={() => setActiveDeck('lower')}>
          <Text style={[styles.deckTabText, activeDeck === 'lower' && styles.deckTabTextActive]}>LOWER BERTH ({lowerCount})</Text>
        </Pressable>
        <Pressable style={[styles.deckTab, activeDeck === 'upper' && styles.deckTabActive]} onPress={() => setActiveDeck('upper')}>
          <Text style={[styles.deckTabText, activeDeck === 'upper' && styles.deckTabTextActive]}>UPPER BERTH ({upperCount})</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.busShell}>
          <View style={styles.driverSection}>
            <MaterialCommunityIcons name="steering" size={24} color="#9CA3AF" />
          </View>
          <View style={styles.seatArea}>
            {rows.map((rowSeats, rowIndex) => {
              const leftSeats = rowSeats.filter((s) => s.col === 1);
              const rightSeats = rowSeats.filter((s) => s.col > 1);
              return (
                <View key={rowIndex} style={styles.seatRow}>
                  <View style={styles.leftColumn}>
                    {leftSeats.map((seat) => (
                      <SeatCell
                        key={seat.id}
                        seat={seat}
                        isSelected={selectedSeats.some((s) => s.id === seat.id)}
                        onPress={handleSeatPress}
                        isSleeper={isSleeper}
                      />
                    ))}
                  </View>
                  <View style={styles.aisle} />
                  <View style={styles.rightColumns}>
                    {rightSeats.map((seat) => (
                      <SeatCell
                        key={seat.id}
                        seat={seat}
                        isSelected={selectedSeats.some((s) => s.id === seat.id)}
                        onPress={handleSeatPress}
                        isSleeper={isSleeper}
                      />
                    ))}
                  </View>
                </View>
              );
            })}
          </View>
        </View>
        <View style={{ height: 110 }} />
      </ScrollView>

      {/* Warning Box */}
      <View style={styles.warningBox}>
        <Text style={styles.warningBoxText}>Please note, this bus operator doesn't allow kids free do passengers to book nearest seats for safety</Text>
      </View>

      {/* ── Sticky Bottom Bar ── */}
      <View style={styles.bottomBar}>
        <View style={styles.bottomPriceCol}>
          <Text style={styles.bottomPriceText}>₹{totalAmount.toLocaleString('en-IN')}</Text>
          <Text style={styles.bottomPriceSub}>For {selectedSeats.length} Seat{selectedSeats.length !== 1 ? 's' : ''}</Text>
        </View>
        
        <Pressable style={styles.offersBtn} onPress={() => setShowOffersSheet(true)}>
          <Text style={styles.offersBtnText}>Offers</Text>
          <MaterialCommunityIcons name="chevron-up" size={16} color="#0F172A" />
        </Pressable>

        <Pressable 
          onPress={handleProceed} 
          disabled={selectedSeats.length === 0}
          style={[styles.proceedBtn, selectedSeats.length === 0 && styles.proceedBtnDisabled]}
        >
          <Text style={styles.proceedBtnText}>Next</Text>
        </Pressable>
      </View>

      {/* INFO BOTTOM SHEET */}
      <Modal visible={showInfoSheet} animationType="slide" transparent>
        <Pressable style={styles.modalOverlay} onPress={() => setShowInfoSheet(false)}>
          <Pressable style={styles.infoSheet} onPress={(e) => e.stopPropagation()}>
            <View style={styles.sheetHandleWrap}>
              <View style={styles.sheetHandle} />
            </View>
            
            <View style={styles.operatorRow}>
              <View style={styles.operatorIcon}>
                <Image source={{uri: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=100&h=100&fit=crop'}} style={styles.operatorLogoImage} />
              </View>
              <View style={{flex: 1}}>
                <Text style={styles.sheetTitle}>{operatorName}</Text>
                <Text style={styles.sheetSubtitle}>AC Sleeper (2+1)</Text>
                <Text style={styles.sheetStats}>34 Seats Left • 18 Single Seats</Text>
              </View>
              <View style={styles.ratingBadge}>
                <MaterialCommunityIcons name="star" size={10} color="#FFF" />
                <Text style={styles.ratingBadgeText}>{ratingVal.toFixed(1)}</Text>
              </View>
            </View>

            <View style={styles.sheetTabs}>
              {['Bus Info', 'Amenities', 'Reviews', 'Bus Stops', 'Policies'].map((tab) => (
                <Pressable key={tab} style={[styles.sheetTab, infoTab === tab && styles.sheetTabActive]} onPress={() => setInfoTab(tab as any)}>
                  <Text style={[styles.sheetTabText, infoTab === tab && styles.sheetTabTextActive]}>{tab}</Text>
                </Pressable>
              ))}
            </View>

            <ScrollView contentContainerStyle={styles.sheetContent}>
              {infoTab === 'Bus Info' && (
                <View>
                  <Text style={styles.sectionHeader}>Bus Insights</Text>
                  <Text style={styles.sectionSub}>Insights based on past trends</Text>
                  <View style={styles.insightCard}>
                    <Text style={styles.insightTitle}>AC Sleeper (2+1)</Text>
                  </View>
                </View>
              )}
              {infoTab === 'Amenities' && (
                <View>
                  <Text style={styles.sectionHeader}>Amenities</Text>
                  <View style={styles.amenitiesGrid}>
                    <View style={styles.amenityChip}><MaterialCommunityIcons name="cctv" size={16} color="#6B7280" /><Text style={styles.amenityText}>CCTV</Text></View>
                    <View style={styles.amenityChip}><MaterialCommunityIcons name="toilet" size={16} color="#6B7280" /><Text style={styles.amenityText}>Toilet</Text></View>
                    <View style={styles.amenityChip}><MaterialCommunityIcons name="blanket" size={16} color="#6B7280" /><Text style={styles.amenityText}>Blankets</Text></View>
                    <View style={styles.amenityChip}><MaterialCommunityIcons name="book-open" size={16} color="#6B7280" /><Text style={styles.amenityText}>Reading Light</Text></View>
                  </View>
                </View>
              )}
              {infoTab === 'Reviews' && (
                <View>
                  <Text style={styles.sectionHeader}>Travelers Reviews</Text>
                  <View style={styles.reviewSummaryBox}>
                    <Text style={styles.reviewScore}>{ratingVal.toFixed(1)}</Text>
                    <View>
                      <Text style={styles.reviewScoreText}>Fair</Text>
                      <Text style={styles.reviewCountText}>4 Reviews & 7 Ratings</Text>
                    </View>
                  </View>
                  <Text style={styles.reviewText}>"Nothing is proper in the jain travels. The stop in this route not in time..."</Text>
                </View>
              )}
              {infoTab === 'Bus Stops' && (
                <View>
                  <View style={styles.stopsTabs}>
                    <Pressable style={styles.stopsTabActive}><Text style={styles.stopsTabTextActive}>Boarding Points</Text></Pressable>
                    <Pressable style={styles.stopsTab}><Text style={styles.stopsTabText}>Dropping Points</Text></Pressable>
                  </View>
                  <View style={styles.stopItem}>
                    <Text style={styles.stopTime}>15:15</Text>
                    <Text style={styles.stopName}>Jain travels, hotel suprabhat, anand rao circle</Text>
                  </View>
                  <View style={styles.stopItem}>
                    <Text style={styles.stopTime}>16:00</Text>
                    <Text style={styles.stopName}>Yeshwanthpur govardhan theatre near kokan</Text>
                  </View>
                </View>
              )}
              {infoTab === 'Policies' && (
                <View>
                  <Text style={styles.sectionHeader}>Cancellation Policy</Text>
                  <View style={styles.policyRow}>
                    <Text style={styles.policyTime}>Before 06:15 AM, Fri, 24 Apr 26</Text>
                    <Text style={styles.policyRefund}>90% Refund</Text>
                  </View>
                  <View style={styles.policyRow}>
                    <Text style={styles.policyTime}>Before 11:15 AM, Fri, 24 Apr 26</Text>
                    <Text style={styles.policyRefund}>50% Refund</Text>
                  </View>
                  <View style={styles.policyRow}>
                    <Text style={styles.policyTime}>After 01:15 PM, Fri, 24 Apr 26</Text>
                    <Text style={styles.policyRefund}>No Refund</Text>
                  </View>
                </View>
              )}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>

    </SafeAreaView>
  );
}

// ──────────────── SeatCell ────────────────
type SeatCellProps = {
  seat: Seat;
  isSelected: boolean;
  onPress: (seat: Seat) => void;
  isSleeper: boolean;
};

function SeatCell({ seat, isSelected, onPress, isSleeper }: SeatCellProps) {
  const isSold = seat.status === 'booked' || seat.status === 'blocked' || seat.status === 'male';

  const getBackground = () => {
    if (isSelected) return '#3B82F6';
    if (isSold) return '#F3F4F6'; // light grey
    return '#FFFFFF';
  };
  const getBorder = () => {
    if (isSelected) return '#2563EB';
    if (isSold) return '#E5E7EB'; // light grey border
    return '#9CA3AF';
  };

  return (
    <View style={seatStyles.cellWrapper}>
      <Pressable
        onPress={() => onPress(seat)}
        disabled={isSold}
        style={[
          isSleeper ? seatStyles.sleeperCell : seatStyles.seaterCell,
          { backgroundColor: getBackground(), borderColor: getBorder() },
        ]}
      >
        {isSold ? (
          <View style={seatStyles.soldContainer}>
            <MaterialCommunityIcons name="account-outline" size={24} color="#D1D5DB" />
            <View style={[seatStyles.pillow, { borderColor: '#D1D5DB', marginTop: 'auto' }]} />
            <Text style={seatStyles.soldText}>SOLD</Text>
          </View>
        ) : (
          <View style={[seatStyles.pillow, { borderColor: isSelected ? '#FFFFFF' : '#D1D5DB' }]} />
        )}
      </Pressable>
      
      {!isSold && (
        <Text style={seatStyles.priceText}>₹{seat.price}</Text>
      )}
    </View>
  );
}

const seatStyles = StyleSheet.create({
  cellWrapper: {
    alignItems: 'center',
    marginHorizontal: 6,
    marginVertical: 8,
  },
  seaterCell: {
    width: 46, height: 46, borderRadius: 8,
    borderWidth: 1, alignItems: 'center', justifyContent: 'center',
    position: 'relative',
  },
  sleeperCell: {
    width: 44, height: 86, borderRadius: 8,
    borderWidth: 1, alignItems: 'center', justifyContent: 'flex-end', // Pillow at bottom in image
    position: 'relative', paddingBottom: 6,
  },
  pillow: {
    width: 20, height: 6, borderRadius: 3, borderWidth: 1,
  },
  soldContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingBottom: 2,
    paddingTop: 10,
  },
  soldText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#D1D5DB',
    marginTop: 2,
  },
  priceText: {
    fontSize: 10,
    color: '#4B5563',
    fontWeight: '600',
    marginTop: 4,
  }
});

// ──────────────── Main Styles ────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  loadingView: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.md },
  loadingText: { fontSize: typography.body, fontWeight: '700', color: colors.textMuted },

  // Header
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1, borderBottomColor: '#F1F5F9',
  },
  backBtn: { width: 32, height: 32, alignItems: 'flex-start', justifyContent: 'center' },
  headerTitle: { flex: 1, fontSize: 18, fontWeight: '800', color: '#0F172A' },
  infoBtn: { alignItems: 'center' },
  infoBtnText: { fontSize: 8, color: '#3B82F6', fontWeight: '800', marginTop: 2 },

  deckTabsRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  deckTab: { flex: 1, alignItems: 'center', paddingVertical: 12, borderBottomWidth: 2, borderBottomColor: 'transparent' },
  deckTabActive: { borderBottomColor: '#3B82F6' },
  deckTabText: { fontSize: 12, fontWeight: '700', color: '#64748B' },
  deckTabTextActive: { color: '#0F172A', fontWeight: '800' },

  scrollContent: { paddingTop: 24, paddingHorizontal: 32, alignItems: 'center' },
  busShell: { paddingHorizontal: 16 },
  driverSection: { alignItems: 'flex-end', marginBottom: 24, paddingRight: 16 },
  
  seatArea: { gap: 2 },
  seatRow: { flexDirection: 'row', alignItems: 'center' },
  leftColumn: { flexDirection: 'row' },
  aisle: { width: 40 },
  rightColumns: { flexDirection: 'row' },

  warningBox: { backgroundColor: '#4B5563', padding: 12, marginHorizontal: 16, borderRadius: 8, position: 'absolute', bottom: 84, left: 0, right: 0 },
  warningBoxText: { color: '#FFF', fontSize: 10, textAlign: 'center', lineHeight: 14 },

  // Bottom bar
  bottomBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1, borderTopColor: '#E2E8F0',
  },
  bottomPriceCol: { flex: 1 },
  bottomPriceText: { color: '#0F172A', fontSize: 18, fontWeight: '800' },
  bottomPriceSub: { color: '#64748B', fontSize: 10, fontWeight: '600' },
  
  offersBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 12, paddingVertical: 8, backgroundColor: '#F1F5F9', borderRadius: 4, marginRight: 16, borderWidth: 1, borderColor: '#E2E8F0' },
  offersBtnText: { color: '#0F172A', fontSize: 12, fontWeight: '700' },

  proceedBtn: { backgroundColor: '#3B82F6', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 4 },
  proceedBtnDisabled: { opacity: 0.5 },
  proceedBtnText: { color: '#FFFFFF', fontSize: 14, fontWeight: '800' },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  infoSheet: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 16, borderTopRightRadius: 16, height: '85%' },
  sheetHandleWrap: { alignItems: 'center', paddingVertical: 12 },
  sheetHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: '#E2E8F0' },
  
  operatorRow: { flexDirection: 'row', paddingHorizontal: 16, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  operatorIcon: { width: 48, height: 48, borderRadius: 8, overflow: 'hidden', marginRight: 12 },
  operatorLogoImage: { width: '100%', height: '100%' },
  sheetTitle: { fontSize: 16, fontWeight: '800', color: '#0F172A', marginBottom: 2 },
  sheetSubtitle: { fontSize: 12, color: '#64748B', marginBottom: 2 },
  sheetStats: { fontSize: 10, color: '#94A3B8' },
  ratingBadge: { backgroundColor: '#2563EB', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, height: 20, gap: 2 },
  ratingBadgeText: { color: '#FFF', fontSize: 10, fontWeight: '800' },

  sheetTabs: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  sheetTab: { paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 2, borderBottomColor: 'transparent' },
  sheetTabActive: { borderBottomColor: '#2563EB' },
  sheetTabText: { fontSize: 12, fontWeight: '700', color: '#64748B' },
  sheetTabTextActive: { color: '#2563EB', fontWeight: '800' },

  sheetContent: { padding: 16 },
  sectionHeader: { fontSize: 16, fontWeight: '800', color: '#0F172A', marginBottom: 4 },
  sectionSub: { fontSize: 12, color: '#64748B', marginBottom: 12 },
  insightCard: { backgroundColor: '#F8FAFC', padding: 16, borderRadius: 8, borderWidth: 1, borderColor: '#E2E8F0' },
  insightTitle: { fontSize: 14, fontWeight: '700' },

  amenitiesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 },
  amenityChip: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 8, borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 8 },
  amenityText: { fontSize: 12, color: '#475569', fontWeight: '600' },

  reviewSummaryBox: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16, backgroundColor: '#F8FAFC', borderRadius: 8, marginBottom: 12 },
  reviewScore: { backgroundColor: '#2563EB', color: '#FFF', fontSize: 24, fontWeight: '800', padding: 8, borderRadius: 8 },
  reviewScoreText: { fontSize: 16, fontWeight: '800', color: '#0F172A' },
  reviewCountText: { fontSize: 12, color: '#64748B' },
  reviewText: { fontSize: 13, color: '#333', lineHeight: 20, fontStyle: 'italic' },

  stopsTabs: { flexDirection: 'row', marginBottom: 16 },
  stopsTabActive: { flex: 1, alignItems: 'center', paddingVertical: 8, borderWidth: 1, borderColor: '#3B82F6', backgroundColor: '#EFF6FF', borderRadius: 4 },
  stopsTabTextActive: { color: '#3B82F6', fontWeight: '700', fontSize: 12 },
  stopsTab: { flex: 1, alignItems: 'center', paddingVertical: 8, borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 4 },
  stopsTabText: { color: '#64748B', fontWeight: '700', fontSize: 12 },
  stopItem: { flexDirection: 'row', marginBottom: 16 },
  stopTime: { width: 48, fontSize: 12, fontWeight: '700', color: '#0F172A' },
  stopName: { flex: 1, fontSize: 12, color: '#475569', lineHeight: 18 },

  policyRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  policyTime: { fontSize: 12, color: '#475569', flex: 1 },
  policyRefund: { fontSize: 12, fontWeight: '800', color: '#16A34A' },
});
