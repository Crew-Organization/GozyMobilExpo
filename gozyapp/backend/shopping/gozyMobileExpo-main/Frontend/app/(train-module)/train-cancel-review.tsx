import { useMemo, useState } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import {
  Alert,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTrainSearchStore } from '@/src/store/train-search-store';

export default function TrainCancelReviewScreen() {
  const { recentBookings } = useTrainSearchStore();
  const [selectedReasonIdx, setSelectedReasonIdx] = useState<number>(0);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);

  const { bookingId } = useLocalSearchParams<{ bookingId?: string }>();

  // Retrieve the latest dynamic booking, fallback to premium mock values if empty
  const latestBooking = useMemo(() => {
    if (bookingId) {
      const found = recentBookings.find((b) => b.id === bookingId);
      if (found) return found;
    }
    if (recentBookings.length > 0) {
      return recentBookings[0];
    }
    
    // Default mock booking matching the screenshots
    return {
      id: 'rb-mock',
      bookingId: 'NR7624860590599208',
      pnr: '6832430149',
      trainName: 'AMRIT BHARAT EXP',
      trainNumber: '20609',
      routeText: 'Palasa - Vijayawada Jn',
      dateText: '30 May',
      priceText: '₹ 651.7',
      freeCancellation: true,
      passengerNames: ['Y Sri Charan'],
      email: 'sricharanc64@gmail.com',
      phone: '919392733617',
      classCode: 'SL',
      tripGuarantee: true,
      departureTime: '02:07 PM',
      arrivalTime: '12:20 AM',
      departureStation: 'Palasa (PSA)',
      arrivalStation: 'Vijayawada Jn (BZA)',
      duration: '10h 13m',
    };
  }, [recentBookings]);

  // Dynamic calculations based on user's booking details
  const parsedPrice = useMemo(() => {
    const numericStr = latestBooking.priceText.replace(/[^\d.]/g, '');
    const num = parseFloat(numericStr);
    return isNaN(num) ? 651.7 : num;
  }, [latestBooking.priceText]);

  // Route codes and date formatting for subtitle
  const routeSubtitle = useMemo(() => {
    const fromCode = latestBooking.departureStation.match(/\(([^)]+)\)/)?.[1] || 'PSA';
    const toCode = latestBooking.arrivalStation.match(/\(([^)]+)\)/)?.[1] || 'BZA';
    return `${fromCode} - ${toCode} • ${latestBooking.dateText}`;
  }, [latestBooking]);

  const cancellationReasons = [
    'Got better availability in different class in the same train',
    'Not travelling anymore',
    'Unsure whether the seats would be confirm',
    'Booked for Wrong Date/time',
    'Booked by mistake',
    'Connecting Flight / Train delayed',
    'Wait listed or RAC ticket or Ticket is not confirmed',
    'Change In Plans',
  ];

  // Dynamic mathematical breakdown matching screenshot logic
  const breakdown = useMemo(() => {
    const convenienceFee = 17.7;
    const tripGuaranteeCharges = latestBooking.tripGuarantee ? 214 : 0;
    const ticketCharges = Math.max(parsedPrice - convenienceFee - tripGuaranteeCharges, 0);

    // Cancel Review calculations
    // Total Paid = Ticket Charges + Convenience Fee + Trip Guarantee
    const totalPaid = parsedPrice;

    // Cancellation Fee
    let ticketCancellationChargeOriginal = 60;
    let ticketCancellationChargeRefunded = latestBooking.freeCancellation ? 0 : 60;

    // If no Trip Guarantee, convenience fee is not refunded. If Trip Guarantee is opted, convenience fee is refunded/cancelled out?
    // Wait, in screenshot:
    // Total Paid: 651.7 (420 + 17.7 + 214)
    // Cancellation Fee: -231.7 (Free cancellation charges: 0, Trip Guarantee: -214, Convenience Fee: -17.7)
    // Your Refund: 420 (which is exactly Ticket Charges!)
    const cancellationFee = ticketCancellationChargeRefunded + tripGuaranteeCharges + convenienceFee;
    const refund = Math.max(totalPaid - cancellationFee, 0);

    return {
      ticketCharges,
      convenienceFee,
      tripGuaranteeCharges,
      totalPaid,
      ticketCancellationChargeOriginal,
      ticketCancellationChargeRefunded,
      cancellationFee,
      refund,
    };
  }, [latestBooking, parsedPrice]);

  const handleConfirmCancel = () => {
    useTrainSearchStore.setState((state) => {
      let updated = [...state.recentBookings];
      const bookingIndex = updated.findIndex((b) => b.id === latestBooking.id);
      if (bookingIndex >= 0) {
        updated[bookingIndex] = { ...updated[bookingIndex], cancelled: true };
      } else {
        updated = [{
          ...latestBooking,
          cancelled: true
        }, ...updated];
      }
      return { recentBookings: updated };
    });
    router.replace({
      pathname: '/train-cancellation',
      params: { bookingId: latestBooking.id }
    } as any);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.screen}>
        
        {/* Header bar on white background */}
        <View style={styles.header}>
          <Pressable hitSlop={12} onPress={() => router.back()} style={styles.backButton}>
            <MaterialCommunityIcons color="#111827" name="arrow-left" size={26} />
          </Pressable>
          <View style={styles.headerTextWrap}>
            <Text style={styles.headerTitle}>Cancel Train Tickets</Text>
            <Text style={styles.headerSubtitle}>{routeSubtitle}</Text>
          </View>
        </View>

        {/* Progress step bar */}
        <View style={styles.stepsBar}>
          <Text style={styles.activeStepText}>❶ REVIEW PENALTY & REFUND</Text>
          <Text style={styles.inactiveStepText}>❷ CONFIRM</Text>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* Refund Breakdown section */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionHeadingTitle}>Refund for Cancelling Train Booking</Text>

            {/* Red notices */}
            <View style={styles.noticesWrapper}>
              {latestBooking.freeCancellation && (
                <Text style={styles.noticeRedText}>
                  Your booking is covered under FREE Cancellation. You have paid Rs. {breakdown.ticketCharges.toFixed(0)} for this booking.
                </Text>
              )}
              {latestBooking.tripGuarantee && (
                <Text style={[styles.noticeRedText, { marginTop: 8 }]}>
                  Your booking is covered under Trip Guarantee. You have paid Rs. {breakdown.tripGuaranteeCharges.toFixed(2)} for this booking.
                </Text>
              )}
            </View>

            <View style={styles.divider} />

            {/* Total Paid */}
            <View style={styles.breakupRowMain}>
              <Text style={styles.breakupLabelMain}>Total Paid</Text>
              <Text style={styles.breakupValueMain}>₹ {breakdown.totalPaid.toLocaleString('en-IN')}</Text>
            </View>

            <View style={styles.subRowsWrapper}>
              <View style={styles.breakupRowSub}>
                <Text style={styles.breakupLabelSub}>Ticket Charges</Text>
                <Text style={styles.breakupValueSub}>₹ {breakdown.ticketCharges.toLocaleString('en-IN')}</Text>
              </View>
              <View style={styles.breakupRowSub}>
                <Text style={styles.breakupLabelSub}>IRCTC Convenience Fee (incl. of GST)</Text>
                <Text style={styles.breakupValueSub}>₹ {breakdown.convenienceFee.toFixed(2)}</Text>
              </View>
              {latestBooking.tripGuarantee && (
                <View style={styles.breakupRowSub}>
                  <Text style={styles.breakupLabelSub}>Trip Guarantee Charges</Text>
                  <Text style={styles.breakupValueSub}>₹ {breakdown.tripGuaranteeCharges.toLocaleString('en-IN')}</Text>
                </View>
              )}
            </View>

            <View style={styles.divider} />

            {/* Cancellation Fee */}
            <View style={styles.breakupRowMain}>
              <Text style={styles.breakupLabelMain}>Cancellation Fee</Text>
              <Text style={styles.breakupValueMain}>-₹ {breakdown.cancellationFee.toFixed(1)}</Text>
            </View>

            <View style={styles.subRowsWrapper}>
              <View style={styles.breakupRowSub}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flex: 1 }}>
                  <MaterialCommunityIcons color="#0D9488" name="shield-check" size={16} />
                  <Text style={styles.breakupLabelSub}>Ticket Cancellation Charges</Text>
                </View>
                <Text style={styles.breakupValueSub}>
                  {latestBooking.freeCancellation ? (
                    <>
                      <Text style={{ textDecorationLine: 'line-through', color: '#9CA3AF' }}>
                        ₹ {breakdown.ticketCancellationChargeOriginal}
                      </Text>{' '}
                      <Text style={{ color: '#0D9488', fontWeight: '800' }}>₹ 0</Text>
                    </>
                  ) : (
                    `₹ ${breakdown.ticketCancellationChargeOriginal}`
                  )}
                </Text>
              </View>
              {latestBooking.tripGuarantee && (
                <View style={styles.breakupRowSub}>
                  <Text style={styles.breakupLabelSub}>Trip Guarantee Charges</Text>
                  <Text style={styles.breakupValueSub}>-₹ {breakdown.tripGuaranteeCharges.toLocaleString('en-IN')}</Text>
                </View>
              )}
              <View style={styles.breakupRowSub}>
                <Text style={styles.breakupLabelSub}>IRCTC Convenience Fee (incl. of GST)</Text>
                <Text style={styles.breakupValueSub}>-₹ {breakdown.convenienceFee.toFixed(2)}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            {/* Refund Amount */}
            <View style={styles.refundTotalRow}>
              <Text style={styles.refundTotalLabel}>Your Refund</Text>
              <Text style={styles.refundTotalValue}>₹ {breakdown.refund.toLocaleString('en-IN')}</Text>
            </View>

          </View>

          {/* Reason For Cancellation selection */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionHeadingTitle}>Reason For Cancellation</Text>
            
            <View style={styles.reasonsListContainer}>
              {cancellationReasons.map((reason, idx) => {
                const isSelected = selectedReasonIdx === idx;
                return (
                  <Pressable
                    key={idx}
                    onPress={() => setSelectedReasonIdx(idx)}
                    style={styles.reasonOptionRow}
                  >
                    <MaterialCommunityIcons
                      color={isSelected ? '#1697F6' : '#9CA3AF'}
                      name={isSelected ? 'radiobox-marked' : 'radiobox-blank'}
                      size={24}
                    />
                    <Text style={[styles.reasonOptionText, isSelected && styles.reasonOptionTextSelected]}>
                      {reason}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <View style={{ height: 100 }} />

        </ScrollView>

        {/* Absolute Bottom Confirmation Bar */}
        <View style={styles.bottomBar}>
          <Pressable
            onPress={() => setShowConfirmModal(true)}
            style={styles.confirmBtn}
          >
            <Text style={styles.confirmBtnText}>CONFIRM CANCELLATION</Text>
          </Pressable>
        </View>

        {/* Custom Premium In-App Confirmation Modal */}
        <Modal
          visible={showConfirmModal}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowConfirmModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.confirmModalCard}>
              <View style={styles.modalWarningIcon}>
                <MaterialCommunityIcons name="alert-circle" size={48} color="#E11D48" />
              </View>
              <Text style={styles.modalConfirmTitle}>Cancel Ticket</Text>
              <Text style={styles.modalConfirmBody}>
                Are you sure you want to cancel your ticket?
              </Text>
              
              <View style={styles.modalActionsRow}>
                <Pressable
                  style={[styles.modalBtn, styles.modalBtnSecondary]}
                  onPress={() => setShowConfirmModal(false)}
                >
                  <Text style={styles.modalBtnSecondaryText}>Keep Ticket</Text>
                </Pressable>
                <Pressable
                  style={[styles.modalBtn, styles.modalBtnPrimary]}
                  onPress={() => {
                    setShowConfirmModal(false);
                    handleConfirmCancel();
                  }}
                >
                  <Text style={styles.modalBtnPrimaryText}>Confirm Cancel</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  screen: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  header: {
    height: 56,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  backButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTextWrap: {
    marginLeft: 12,
    flex: 1,
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#111827',
  },
  headerSubtitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6B7280',
    marginTop: 1,
  },
  stepsBar: {
    height: 40,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  activeStepText: {
    fontSize: 10.5,
    fontWeight: '900',
    color: '#111827',
  },
  inactiveStepText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#9CA3AF',
  },
  scrollContent: {
    paddingBottom: 48,
  },
  sectionCard: {
    marginTop: 10,
    marginHorizontal: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  sectionHeadingTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#111827',
    marginBottom: 12,
  },
  noticesWrapper: {
    backgroundColor: '#FFF5F5',
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: '#FEE2E2',
    marginBottom: 4,
  },
  noticeRedText: {
    fontSize: 11,
    color: '#E11D48',
    lineHeight: 16,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 12,
  },
  breakupRowMain: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  breakupLabelMain: {
    fontSize: 13,
    fontWeight: '800',
    color: '#111827',
  },
  breakupValueMain: {
    fontSize: 13.5,
    fontWeight: '900',
    color: '#111827',
  },
  subRowsWrapper: {
    marginTop: 8,
    gap: 6,
    paddingLeft: 4,
  },
  breakupRowSub: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  breakupLabelSub: {
    fontSize: 10.5,
    color: '#4B5563',
    fontWeight: '700',
  },
  breakupValueSub: {
    fontSize: 10.5,
    color: '#4B5563',
    fontWeight: '700',
  },
  refundTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  refundTotalLabel: {
    fontSize: 14,
    fontWeight: '900',
    color: '#0D9488',
  },
  refundTotalValue: {
    fontSize: 15.5,
    fontWeight: '900',
    color: '#0D9488',
  },
  reasonsListContainer: {
    marginTop: 4,
    gap: 12,
  },
  reasonOptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 2,
  },
  reasonOptionText: {
    fontSize: 12.5,
    color: '#374151',
    fontWeight: '700',
    flex: 1,
  },
  reasonOptionTextSelected: {
    color: '#111827',
    fontWeight: '800',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 72,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  confirmBtn: {
    height: 44,
    borderRadius: 8,
    backgroundColor: '#E11D48', // Premium red button matching review screen
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmBtnText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  confirmModalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 8,
  },
  modalWarningIcon: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#FFE4E6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalConfirmTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 8,
  },
  modalConfirmBody: {
    fontSize: 14,
    color: '#475569',
    textAlign: 'center',
    lineHeight: 20,
    fontWeight: '600',
    marginBottom: 24,
  },
  modalActionsRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  modalBtn: {
    flex: 1,
    height: 44,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBtnSecondary: {
    backgroundColor: '#F1F5F9',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  modalBtnSecondaryText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#475569',
  },
  modalBtnPrimary: {
    backgroundColor: '#E11D48',
  },
  modalBtnPrimaryText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#FFFFFF',
  },
});
