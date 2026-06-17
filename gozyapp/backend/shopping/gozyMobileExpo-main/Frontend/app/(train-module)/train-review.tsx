import { useEffect, useMemo, useState } from 'react';
import { router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { getAvailabilityTone } from '@/src/theme/train-results-ui';
import { useTrainSearchStore } from '@/src/store/train-search-store';

function formatClassName(code: string) {
  if (code === 'SL') return 'SLEEPER';
  if (code === '3A') return '3 TIER AC';
  if (code === '2A') return '2 TIER AC';
  if (code === '1A') return '1ST AC';
  if (code === 'CC') return 'AC CHAIR CAR';
  if (code === 'EC') return 'EXECUTIVE CHAIR CAR';
  return code;
}

function formatTimer(totalSeconds: number) {
  const mins = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
  const secs = (totalSeconds % 60).toString().padStart(2, '0');
  return `${mins}m:${secs}s`;
}

export default function TrainReviewScreen() {
  const { reviewBookingDraft } = useTrainSearchStore();
  const [showDetails, setShowDetails] = useState(false);
  const [showBreakup, setShowBreakup] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(10 * 60);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((current) => (current > 0 ? current - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const booking = reviewBookingDraft;
  const ticketStatus = booking?.slot.quotaLabel ?? '';
  const statusColor = getAvailabilityTone(ticketStatus, booking?.slot.badge, booking?.slot.status).accentColor;

  const priceRows = useMemo(() => {
    if (!booking) {
      return [];
    }

    return [
      { label: 'Ticket Charge', value: booking.baseFare, tone: '#111827' },
      ...(booking.tripGuaranteeFee > 0
        ? [{ label: 'Trip Guarantee / 3x Refund', value: booking.tripGuaranteeFee, tone: '#111827' }]
        : []),
      ...(booking.freeCancellationFee > 0
        ? [{ label: 'Free Cancellation (incl. of GST)', value: booking.freeCancellationFee, tone: '#111827' }]
        : []),
      { label: 'Agent Convenience Fees (Waived off)', value: 0, tone: '#111827' },
      { label: 'IRCTC Travel Insurance Premium', value: 0, tone: '#111827' },
      { label: 'IRCTC Convenience Fee (incl. of GST)', value: 0, tone: '#111827' },
      { label: 'Coupon Discount', value: booking.discountAmt, tone: '#DC2626', isDiscount: true },
    ];
  }, [booking]);

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
      <View style={styles.screen}>
        <View style={styles.header}>
          <Pressable hitSlop={12} onPress={() => router.back()} style={styles.backButton}>
            <MaterialCommunityIcons color="#111827" name="arrow-left" size={26} />
          </Pressable>
          <View style={styles.headerTextWrap}>
            <Text style={styles.headerTitle}>Review Booking</Text>
            <Text style={styles.headerSubtitle}>{booking.routeTitle}</Text>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.timerStrip}>
            <Text style={styles.timerInfo}>Review booking, complete payment and enter IRCTC login password in 10 mins.</Text>
            <View style={styles.timerBadge}>
              <MaterialCommunityIcons color="#FFFFFF" name="clock-outline" size={16} />
              <Text style={styles.timerBadgeText}>{formatTimer(secondsLeft)}</Text>
            </View>
          </View>

          <View style={styles.offerCard}>
            <Text style={styles.offerTitle}>Book this train & get</Text>
            <Text style={styles.offerBullet}>• Exclusive hotel prices for train bookers</Text>
            <Text style={styles.offerBullet}>• Up to 20% off on hotels and homestays</Text>
            <View style={styles.offerDividerRow}>
              <Text style={styles.offerDividerText}>TRAINS + STAY</Text>
              <View style={styles.offerDividerLine} />
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.trainTitleRow}>
              <Text style={styles.trainName}>{booking.train.name}</Text>
              <Text style={styles.trainNumber}>#{booking.train.number}</Text>
            </View>

            {!showDetails ? (
              <View style={styles.summaryRow}>
                <View style={styles.summaryMetaRow}>
                  <Text style={styles.trainClass}>{formatClassName(booking.slot.className)}</Text>
                  <Text style={[styles.trainQuota, { color: statusColor }]}>{booking.slot.quotaLabel}</Text>
                </View>
                <Pressable onPress={() => setShowDetails(true)} style={styles.detailToggle}>
                  <Text style={styles.detailToggleText}>View Details</Text>
                  <MaterialCommunityIcons color="#1697F6" name="chevron-down" size={20} />
                </Pressable>
              </View>
            ) : (
              <>
                <View style={styles.summaryExpandedTop}>
                  <View>
                    <Text style={styles.trainClass}>{formatClassName(booking.slot.className)}</Text>
                    <Text style={styles.quotaCaption}>General Quota</Text>
                  </View>
                  <View style={styles.summaryExpandedRight}>
                    <Text style={[styles.trainQuota, { color: statusColor }]}>{booking.slot.quotaLabel}</Text>
                    <Text style={styles.updatedText}>{booking.slot.updatedLabel}</Text>
                  </View>
                </View>

                <View style={styles.tripRow}>
                  <View style={styles.tripSide}>
                    <Text style={styles.timeValue}>{booking.train.departureTime}</Text>
                    <Text style={styles.timeDate}>{booking.train.departureDateLabel}</Text>
                    <Text style={styles.stationText}>{booking.train.departureStation}</Text>
                  </View>
                  <View style={styles.tripCenter}>
                    <View style={styles.tripLine} />
                    <Text style={styles.durationText}>{booking.train.duration}</Text>
                    <View style={styles.tripLine} />
                  </View>
                  <View style={[styles.tripSide, styles.tripSideRight]}>
                    <Text style={styles.timeValue}>{booking.train.arrivalTime}</Text>
                    <Text style={styles.timeDate}>{booking.train.arrivalDateLabel}</Text>
                    <Text style={[styles.stationText, styles.stationTextRight]}>{booking.train.arrivalStation}</Text>
                  </View>
                </View>

                <Pressable onPress={() => setShowDetails(false)} style={[styles.detailToggle, styles.detailToggleRight]}>
                  <Text style={styles.detailToggleText}>Hide Details</Text>
                  <MaterialCommunityIcons color="#1697F6" name="chevron-up" size={20} />
                </Pressable>
              </>
            )}

            <View style={styles.divider} />

            <View style={styles.boardingRow}>
              <View>
                <Text style={styles.boardingTitle}>Boarding Station</Text>
                <Text style={styles.boardingStation}>
                  {booking.train.departureStation.match(/\(([^)]+)\)/)?.[1] ?? 'CHE'} / {booking.train.departureStation.replace(/\s*\([^)]+\)/, '').toUpperCase()}
                </Text>
              </View>
              <Text style={styles.boardingTime}>{booking.train.departureTime} ({booking.train.departureDateLabel})</Text>
            </View>

            <View style={styles.passengerList}>
              {booking.passengers.map((passenger) => (
                <View key={passenger.id} style={styles.passengerCard}>
                  <Text style={styles.passengerName}>
                    {passenger.name}, {passenger.age} ({passenger.gender.charAt(0).toLowerCase()})
                  </Text>
                  <Text style={styles.passengerMeta}>{passenger.berth}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.card}>
            <Pressable onPress={() => setShowBreakup((current) => !current)} style={styles.breakupHeader}>
              <Text style={styles.breakupTitle}>Price Breakup</Text>
              <MaterialCommunityIcons color="#1697F6" name={showBreakup ? 'chevron-up' : 'chevron-down'} size={24} />
            </Pressable>

            {showBreakup ? (
              <View style={styles.breakupContent}>
                {priceRows.map((row) => (
                  <View key={row.label} style={styles.priceRow}>
                    <Text style={styles.priceLabel}>{row.label}</Text>
                    <Text style={[styles.priceValue, { color: row.tone }]}>₹ {row.value}</Text>
                  </View>
                ))}

                <View style={[styles.priceRow, styles.totalRow]}>
                  <Text style={styles.totalLabel}>Total Price</Text>
                  <Text style={styles.totalValue}>₹ {booking.totalPrice}</Text>
                </View>
              </View>
            ) : null}
          </View>
        </ScrollView>

        <View style={styles.bottomBar}>
          <Text style={styles.footerAmount}>₹ {booking.totalPrice}</Text>
          <Pressable onPress={() => router.push('/train-payment')} style={styles.payButton}>
            <Text style={styles.payButtonText}>Continue</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  screen: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  header: {
    height: 86,
    paddingHorizontal: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTextWrap: {
    marginLeft: 10,
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
  },
  headerSubtitle: {
    marginTop: 3,
    fontSize: 12,
    color: '#8B95A3',
    fontWeight: '600',
  },
  scrollContent: {
    paddingBottom: 120,
  },
  timerStrip: {
    backgroundColor: '#FFF2D9',
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  timerInfo: {
    flex: 1,
    fontSize: 12,
    lineHeight: 18,
    color: '#6B4F14',
    fontWeight: '600',
  },
  timerBadge: {
    borderRadius: 999,
    backgroundColor: '#F6B21A',
    paddingHorizontal: 14,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  timerBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  offerCard: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 18,
    marginTop: 10,
  },
  offerTitle: {
    fontSize: 19,
    fontWeight: '900',
    color: '#111827',
  },
  offerBullet: {
    marginTop: 10,
    fontSize: 13,
    color: '#0F766E',
    fontWeight: '700',
  },
  offerDividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 18,
  },
  offerDividerText: {
    fontSize: 15,
    letterSpacing: 3,
    fontWeight: '800',
    color: '#0F766E',
  },
  offerDividerLine: {
    flex: 1,
    height: 1.5,
    backgroundColor: '#B78A1B',
  },
  card: {
    backgroundColor: '#FFFFFF',
    marginTop: 10,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  trainTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  trainName: {
    fontSize: 20,
    fontWeight: '900',
    color: '#111827',
    flex: 1,
  },
  trainNumber: {
    marginLeft: 10,
    fontSize: 16,
    color: '#A1A1AA',
  },
  summaryRow: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  trainClass: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  trainQuota: {
    fontSize: 13,
    fontWeight: '800',
  },
  detailToggle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailToggleText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1697F6',
  },
  summaryExpandedTop: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quotaCaption: {
    marginTop: 4,
    fontSize: 12,
    color: '#9CA3AF',
  },
  summaryExpandedRight: {
    alignItems: 'flex-end',
  },
  updatedText: {
    marginTop: 4,
    fontSize: 12,
    color: '#9CA3AF',
  },
  tripRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  tripSide: {
    flex: 1,
  },
  tripSideRight: {
    alignItems: 'flex-end',
  },
  timeValue: {
    fontSize: 16,
    fontWeight: '900',
    color: '#111827',
  },
  timeDate: {
    marginTop: 2,
    fontSize: 12,
    color: '#9CA3AF',
  },
  stationText: {
    marginTop: 8,
    fontSize: 13,
    color: '#6B7280',
  },
  stationTextRight: {
    textAlign: 'right',
  },
  tripCenter: {
    flex: 0.8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 8,
  },
  tripLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  durationText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  detailToggleRight: {
    alignSelf: 'flex-end',
    marginTop: 12,
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginVertical: 16,
  },
  boardingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    gap: 10,
  },
  boardingTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#111827',
  },
  boardingStation: {
    marginTop: 4,
    fontSize: 13,
    color: '#4B5563',
    fontWeight: '700',
  },
  boardingTime: {
    fontSize: 13,
    fontWeight: '800',
    color: '#4B5563',
  },
  passengerList: {
    marginTop: 14,
    gap: 12,
  },
  passengerCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  passengerName: {
    fontSize: 15,
    fontWeight: '900',
    color: '#111827',
  },
  passengerMeta: {
    marginTop: 8,
    fontSize: 13,
    color: '#9CA3AF',
  },
  breakupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  breakupTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  breakupContent: {
    marginTop: 12,
    gap: 12,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 14,
  },
  priceLabel: {
    flex: 1,
    fontSize: 13,
    color: '#111827',
  },
  priceValue: {
    fontSize: 13,
    fontWeight: '700',
  },
  totalRow: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '900',
    color: '#111827',
  },
  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#3B3B3B',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  footerAmount: {
    fontSize: 19,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  payButton: {
    minWidth: 170,
    height: 54,
    borderRadius: 999,
    backgroundColor: '#1D7DFF',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  payButtonText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
  },
  backHomeButton: {
    marginTop: 16,
    height: 44,
    paddingHorizontal: 18,
    borderRadius: 10,
    backgroundColor: '#1697F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backHomeText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
