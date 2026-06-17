import type { ReactNode } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { ReviewBookingDraft } from '@/src/store/train-search-store';

export function formatPaymentTimer(totalSeconds: number) {
  const mins = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
  const secs = (totalSeconds % 60).toString().padStart(2, '0');
  return `${mins}:${secs}`;
}

export function formatCurrency(value: number) {
  return `\u20B9 ${value.toFixed(2)}`;
}

export function PaymentScreenShell({
  booking,
  children,
  onBack,
  secondsLeft,
  title,
}: {
  booking: ReviewBookingDraft | null;
  children: ReactNode;
  onBack: () => void;
  secondsLeft: number;
  title: string;
}) {
  if (!booking) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No payment draft is available.</Text>
          <Pressable onPress={onBack} style={styles.emptyButton}>
            <Text style={styles.emptyButtonText}>Go back</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.screen}>
        <View style={styles.header}>
          <Pressable hitSlop={12} onPress={onBack} style={styles.backButton}>
            <MaterialCommunityIcons color="#111827" name="arrow-left" size={24} />
          </Pressable>
          <Text style={styles.headerTitle}>{title}</Text>
          <View style={styles.headerTimer}>
            <MaterialCommunityIcons color="#A3A3A3" name="timer-outline" size={24} />
            <Text style={styles.headerTimerText}>{formatPaymentTimer(secondsLeft)}</Text>
          </View>
        </View>
        {children}
      </View>
    </SafeAreaView>
  );
}

export function PaymentDueSummary({
  booking,
  onToggleDetails,
}: {
  booking: ReviewBookingDraft;
  onToggleDetails: () => void;
}) {
  const ticketCharge = booking.baseFare;
  const hasTripGuarantee = booking.slot.status.toLowerCase().includes('confirm or 3x refund') || booking.slot.status.toLowerCase().includes('3x refund');
  const tripGuaranteePremium = hasTripGuarantee ? 215 : 0;
  const freeCancellationFee = 8;
  const irctcConvenienceFee = Math.max(35.40, booking.totalPrice - ticketCharge - tripGuaranteePremium - freeCancellationFee);
  const calculatedTotal = ticketCharge + tripGuaranteePremium + irctcConvenienceFee + freeCancellationFee;

  return (
    <View style={styles.summaryWrap}>
      <View style={styles.summaryHeaderRow}>
        <View style={styles.summaryTextWrap}>
          <Text style={styles.summaryLabel}>Total Due</Text>
          <Text numberOfLines={1} style={styles.summaryTrainCompact}>
            #{booking.train.number} {booking.train.name.toUpperCase()} {booking.slot.className}(GN)
          </Text>
        </View>
        <View style={styles.summaryAmountRow}>
          <Text style={styles.summaryAmount}>{formatCurrency(calculatedTotal)}</Text>
          <Pressable onPress={onToggleDetails} style={styles.summaryToggle}>
            <MaterialCommunityIcons color="#1697F6" name="chevron-down" size={20} />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

export function PaymentDetailsModal({
  booking,
  onClose,
  visible,
}: {
  booking: ReviewBookingDraft;
  onClose: () => void;
  visible: boolean;
}) {
  const extraTravellers = Math.max(booking.passengers.length - 1, 0);
  const ticketCharge = booking.baseFare;
  const hasTripGuarantee = booking.slot.status.toLowerCase().includes('confirm or 3x refund') || booking.slot.status.toLowerCase().includes('3x refund');
  const tripGuaranteePremium = hasTripGuarantee ? 215 : 0;
  const freeCancellationFee = 8;
  const irctcConvenienceFee = Math.max(35.40, booking.totalPrice - ticketCharge - tripGuaranteePremium - freeCancellationFee);
  const calculatedTotal = ticketCharge + tripGuaranteePremium + irctcConvenienceFee + freeCancellationFee;

  const passengerLine = `${booking.passengers[0]?.name ?? 'Traveller'} (${booking.passengers[0]?.gender.charAt(0).toUpperCase() ?? 'F'}) ${booking.passengers[0]?.age ?? ''}yrs${extraTravellers > 0 ? `, +${extraTravellers} traveller` : ''}`;

  return (
    <Modal animationType="fade" onRequestClose={onClose} transparent visible={visible}>
      <View style={styles.modalBackdrop}>
        <View style={styles.modalSheet}>
          <View style={styles.summaryHeaderRow}>
            <Text style={styles.modalAmountLabel}>Total Due</Text>
            <Text style={styles.modalAmountValue}>{formatCurrency(calculatedTotal)}</Text>
          </View>

          <View style={styles.dottedRow}>
            <Text style={styles.dottedLabel}>Ticket Charge</Text>
            <View style={styles.dottedLine} />
            <Text style={styles.dottedValue}>{formatCurrency(ticketCharge)}</Text>
          </View>
          {tripGuaranteePremium > 0 && (
            <View style={styles.dottedRow}>
              <Text style={styles.dottedLabel}>Trip Guarantee Premium (incl. Of Gst)</Text>
              <View style={styles.dottedLine} />
              <Text style={styles.dottedValue}>{formatCurrency(tripGuaranteePremium)}</Text>
            </View>
          )}
          <View style={styles.dottedRow}>
            <Text style={styles.dottedLabel}>Irctc Convenience Fee (incl. Of Gst)</Text>
            <View style={styles.dottedLine} />
            <Text style={styles.dottedValue}>{formatCurrency(irctcConvenienceFee)}</Text>
          </View>
          <View style={styles.dottedRow}>
            <Text style={styles.dottedLabel}>Free Cancellation (incl. Of Gst)</Text>
            <View style={styles.dottedLine} />
            <Text style={styles.dottedValue}>{formatCurrency(freeCancellationFee)}</Text>
          </View>

          <Text style={styles.modalAvailability}>Latest availability ({booking.slot.quotaLabel})</Text>

          <View style={styles.modalTrainCard}>
            <View style={styles.modalTrainIcon}>
              <MaterialCommunityIcons color="#FFFFFF" name="train" size={24} />
            </View>
            <View style={styles.modalTrainText}>
              <Text style={styles.modalTrainTitle}>
                #{booking.train.number} {booking.train.name.toUpperCase()} {booking.slot.className}(GN)
              </Text>
              <Text style={styles.modalTrainMeta}>
                Departure: {booking.train.departureDateLabel} | {booking.train.departureTime} | {booking.train.duration}
              </Text>
              <Text style={styles.modalTrainClass}>{booking.slot.className} (GN)</Text>
            </View>
          </View>

          <View style={styles.routeRow}>
            <View style={styles.routeSide}>
              <Text style={styles.routeTime}>{booking.train.departureTime}</Text>
              <Text style={styles.routeCity}>{booking.train.departureStation.split(' ')[0]}</Text>
            </View>
            <Text style={styles.routeCenter}>--- {booking.train.duration} ---</Text>
            <View style={[styles.routeSide, styles.routeSideRight]}>
              <Text style={styles.routeTime}>{booking.train.arrivalTime}</Text>
              <Text style={styles.routeCity}>{booking.train.arrivalStation.split(' ')[0]}</Text>
            </View>
          </View>

          <Text style={styles.passengerMetaLine}>{passengerLine}</Text>
          <Text style={styles.passengerPhone}>+91-{booking.phone}</Text>
        </View>

        <Pressable onPress={onClose} style={styles.modalClose}>
          <MaterialCommunityIcons color="#111827" name="close" size={22} />
        </Pressable>
      </View>
    </Modal>
  );
}

export function CompactScroller({ children }: { children: ReactNode }) {
  return (
    <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      {children}
    </ScrollView>
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
    height: 64,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    marginLeft: 8,
    fontSize: 19,
    fontWeight: '800',
    color: '#111827',
  },
  headerTimer: {
    marginLeft: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  headerTimerText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F8A94',
  },
  summaryWrap: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  summaryHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 10,
  },
  summaryTextWrap: {
    flex: 1,
  },
  summaryLabel: {
    fontSize: 17,
    fontWeight: '900',
    color: '#111827',
  },
  summaryTrainCompact: {
    marginTop: 2,
    fontSize: 12,
    fontWeight: '800',
    color: '#111827',
  },
  summaryAmountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  summaryAmount: {
    fontSize: 17,
    fontWeight: '900',
    color: '#111827',
  },
  summaryToggle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#DDE5EF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingBottom: 28,
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: 'rgba(17, 24, 39, 0.45)',
    paddingTop: 92,
  },
  modalSheet: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 22,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 14,
  },
  modalAmountLabel: {
    fontSize: 18,
    fontWeight: '900',
    color: '#111827',
  },
  modalAmountValue: {
    fontSize: 18,
    fontWeight: '900',
    color: '#111827',
  },
  dottedRow: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dottedLabel: {
    fontSize: 13,
    color: '#374151',
  },
  dottedLine: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#D1D5DB',
    borderStyle: 'dotted',
  },
  dottedValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
  },
  modalAvailability: {
    marginTop: 14,
    textAlign: 'center',
    fontSize: 13,
    color: '#374151',
  },
  modalTrainCard: {
    marginTop: 12,
    flexDirection: 'row',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTrainIcon: {
    width: 50,
    height: 50,
    borderRadius: 10,
    backgroundColor: '#1D4ED8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  modalTrainText: {
    flex: 1,
  },
  modalTrainTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#111827',
  },
  modalTrainMeta: {
    marginTop: 2,
    fontSize: 12,
    color: '#4B5563',
  },
  modalTrainClass: {
    marginTop: 4,
    fontSize: 12,
    color: '#374151',
  },
  routeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  routeSide: {
    flex: 1,
  },
  routeSideRight: {
    alignItems: 'flex-end',
  },
  routeTime: {
    fontSize: 16,
    fontWeight: '900',
    color: '#111827',
  },
  routeCity: {
    marginTop: 2,
    fontSize: 13,
    color: '#4B5563',
  },
  routeCenter: {
    fontSize: 13,
    color: '#4B5563',
    marginHorizontal: 10,
  },
  passengerMetaLine: {
    marginTop: 12,
    fontSize: 14,
    fontWeight: '800',
    color: '#374151',
  },
  passengerPhone: {
    fontSize: 13,
    color: '#4B5563',
  },
  modalClose: {
    position: 'absolute',
    bottom: -18,
    alignSelf: 'center',
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
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
  emptyButton: {
    marginTop: 16,
    height: 44,
    paddingHorizontal: 18,
    borderRadius: 10,
    backgroundColor: '#1697F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyButtonText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#111827',
  },
});
