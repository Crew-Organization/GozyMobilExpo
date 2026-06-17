import React, { useState } from 'react';
import { StyleSheet, Text, View, Pressable, ScrollView, SafeAreaView, Dimensions, Modal, ActivityIndicator } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { colors, radius, spacing, typography, shadow } from '@/src/theme/tokens';
import { formatBusDate, parseBusTravelDate } from '@/src/lib/bus-booking-utils';

const { width } = Dimensions.get('window');

export default function BusTicketScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{
    pnr?: string;
    bookingId?: string;
    operator?: string;
    busType?: string;
    fromCity?: string;
    toCity?: string;
    date?: string;
    departureTime?: string;
    arrivalTime?: string;
    seats?: string;
    boarding?: string;
    dropping?: string;
    totalPaid?: string;
  }>();

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  const handleCancelBooking = () => {
    setIsCancelling(true);
    setTimeout(() => {
      setIsCancelling(false);
      setShowCancelModal(false);
      router.push({
        pathname: '/(bus-module)/bus-cancellation',
        params: params,
      });
    }, 1000);
  };

  const travelDate = params.date ? parseBusTravelDate(params.date) : new Date();

  return (
    <View style={styles.container}>
      <SafeAreaView style={{ backgroundColor: '#0084FF' }} edges={['top']} />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <MaterialCommunityIcons name="arrow-left" size={24} color="#FFF" />
          </Pressable>
          <Text style={styles.headerTitle}>E-Ticket</Text>
          <Pressable style={styles.shareBtn}>
            <MaterialCommunityIcons name="share-variant" size={22} color="#FFF" />
          </Pressable>
        </View>
        <View style={styles.routeHeader}>
          <Text style={styles.routeCity}>{params.fromCity}</Text>
          <MaterialCommunityIcons name="bus-side" size={24} color="#FFF" />
          <Text style={styles.routeCity}>{params.toCity}</Text>
        </View>
        <Text style={styles.routeDate}>{formatBusDate(travelDate, true)}</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}>
        
        <View style={styles.ticketStatusBanner}>
          <MaterialCommunityIcons name="check-circle" size={20} color="#16A34A" />
          <Text style={styles.ticketStatusText}>Ticket Confirmed</Text>
        </View>

        <View style={styles.ticketCard}>
          <View style={styles.operatorRow}>
            <View style={styles.operatorLeft}>
              <Text style={styles.operatorName}>{params.operator || 'Bus Operator'}</Text>
              <Text style={styles.busType}>{params.busType || 'AC Sleeper'}</Text>
            </View>
            <View style={styles.pnrBox}>
              <Text style={styles.pnrLabel}>PNR NO.</Text>
              <Text style={styles.pnrValue}>{params.pnr || 'BUS12345678'}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.timeLocationRow}>
            <View style={styles.tlLeft}>
              <Text style={styles.tlTime}>{params.departureTime || '10:00'}</Text>
              <Text style={styles.tlDate}>{formatBusDate(travelDate, true)}</Text>
              <Text style={styles.tlPlace}>{params.boarding || params.fromCity}</Text>
            </View>
            <View style={styles.tlCenter}>
              <MaterialCommunityIcons name="bus" size={24} color="#0084FF" />
            </View>
            <View style={styles.tlRight}>
              <Text style={styles.tlTime}>{params.arrivalTime || '18:00'}</Text>
              <Text style={styles.tlDate}>{formatBusDate(travelDate, true)}</Text>
              <Text style={styles.tlPlace}>{params.dropping || params.toCity}</Text>
            </View>
          </View>

          <View style={styles.dividerDashed} />

          <View style={styles.seatRow}>
            <View>
              <Text style={styles.infoLabel}>SEATS</Text>
              <Text style={styles.infoValue}>{params.seats || 'U1, U2'}</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.infoLabel}>TOTAL FARE</Text>
              <Text style={styles.infoValue}>₹{parseInt(params.totalPaid || '0', 10).toLocaleString('en-IN')}</Text>
            </View>
          </View>
        </View>

        <View style={styles.qrCard}>
          <Text style={styles.qrTitle}>Show this QR at boarding</Text>
          <MaterialCommunityIcons name="qrcode" size={120} color="#333" />
          <Text style={styles.qrText}>Booking ID: {params.bookingId || 'GZBUS998877'}</Text>
        </View>

        <View style={styles.actionsCard}>
          <Pressable style={styles.actionRow}>
            <MaterialCommunityIcons name="download" size={24} color="#0084FF" />
            <Text style={styles.actionText}>Download PDF</Text>
          </Pressable>
          <View style={styles.actionDivider} />
          <Pressable style={styles.actionRow} onPress={() => setShowCancelModal(true)}>
            <MaterialCommunityIcons name="close-circle-outline" size={24} color="#EF4444" />
            <Text style={[styles.actionText, { color: '#EF4444' }]}>Cancel Booking</Text>
          </Pressable>
        </View>

      </ScrollView>

      {/* Cancel Modal */}
      <Modal visible={showCancelModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { paddingBottom: Math.max(insets.bottom, 24) }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Cancel Booking</Text>
              <Pressable onPress={() => setShowCancelModal(false)}>
                <MaterialCommunityIcons name="close" size={24} color="#333" />
              </Pressable>
            </View>
            
            <View style={styles.cancelWarningBox}>
              <MaterialCommunityIcons name="alert" size={24} color="#D97706" />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.cancelWarningTitle}>Are you sure you want to cancel?</Text>
                <Text style={styles.cancelWarningText}>Cancellation charges may apply as per the operator's policy.</Text>
              </View>
            </View>

            <Pressable 
              style={styles.confirmCancelBtn} 
              onPress={handleCancelBooking}
              disabled={isCancelling}
            >
              {isCancelling ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.confirmCancelBtnText}>Yes, Cancel Ticket</Text>
              )}
            </Pressable>
            
            <Pressable style={styles.keepBookingBtn} onPress={() => setShowCancelModal(false)}>
              <Text style={styles.keepBookingBtnText}>No, Keep My Ticket</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F7FB' },
  header: {
    backgroundColor: '#0084FF',
    paddingHorizontal: 16,
    paddingBottom: 24,
    paddingTop: 12,
  },
  headerTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  backBtn: { padding: 4 },
  shareBtn: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#FFF' },
  routeHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 16, marginBottom: 8 },
  routeCity: { fontSize: 22, fontWeight: '900', color: '#FFF' },
  routeDate: { fontSize: 14, color: '#E0F2FE', textAlign: 'center', fontWeight: '500' },
  
  content: { padding: 16 },
  
  ticketStatusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#DCFCE7',
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  ticketStatusText: { fontSize: 14, fontWeight: '800', color: '#166534' },

  ticketCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    ...shadow.md,
  },
  operatorRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  operatorLeft: { flex: 1 },
  operatorName: { fontSize: 18, fontWeight: '800', color: '#1A1A1A' },
  busType: { fontSize: 13, color: '#666', marginTop: 4 },
  pnrBox: { alignItems: 'flex-end' },
  pnrLabel: { fontSize: 11, fontWeight: '700', color: '#666' },
  pnrValue: { fontSize: 15, fontWeight: '900', color: '#0084FF', marginTop: 2 },
  
  divider: { height: 1, backgroundColor: '#F0F0F0', marginVertical: 16 },
  dividerDashed: { height: 1, borderWidth: 1, borderStyle: 'dashed', borderColor: '#E5E5E5', marginVertical: 16 },
  
  timeLocationRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  tlLeft: { flex: 1, alignItems: 'flex-start' },
  tlCenter: { paddingHorizontal: 16, paddingTop: 4 },
  tlRight: { flex: 1, alignItems: 'flex-end' },
  tlTime: { fontSize: 20, fontWeight: '900', color: '#1A1A1A' },
  tlDate: { fontSize: 12, color: '#666', marginTop: 2, fontWeight: '500' },
  tlPlace: { fontSize: 13, color: '#333', marginTop: 6, fontWeight: '600', textAlign: 'left' },
  
  seatRow: { flexDirection: 'row', justifyContent: 'space-between' },
  infoLabel: { fontSize: 11, fontWeight: '700', color: '#888', marginBottom: 4 },
  infoValue: { fontSize: 16, fontWeight: '800', color: '#333' },

  qrCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
    ...shadow.md,
  },
  qrTitle: { fontSize: 14, fontWeight: '700', color: '#666', marginBottom: 16 },
  qrText: { fontSize: 14, fontWeight: '800', color: '#333', marginTop: 16, letterSpacing: 1 },

  actionsCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    ...shadow.md,
    marginBottom: 40,
  },
  actionRow: { flexDirection: 'row', alignItems: 'center', padding: 20, gap: 16 },
  actionText: { fontSize: 15, fontWeight: '700', color: '#333' },
  actionDivider: { height: 1, backgroundColor: '#F0F0F0', marginHorizontal: 20 },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 20, fontWeight: '800', color: '#1A1A1A' },
  
  cancelWarningBox: {
    flexDirection: 'row',
    backgroundColor: '#FEF3C7',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  cancelWarningTitle: { fontSize: 15, fontWeight: '800', color: '#92400E', marginBottom: 4 },
  cancelWarningText: { fontSize: 13, color: '#92400E', lineHeight: 18 },

  confirmCancelBtn: {
    backgroundColor: '#EF4444',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  confirmCancelBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '800' },
  
  keepBookingBtn: {
    backgroundColor: '#F3F4F6',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  keepBookingBtnText: { color: '#4B5563', fontSize: 16, fontWeight: '800' },
});
