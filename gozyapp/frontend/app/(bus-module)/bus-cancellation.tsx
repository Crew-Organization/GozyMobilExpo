import React from 'react';
import { StyleSheet, Text, View, Pressable, ScrollView, SafeAreaView } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, radius, spacing, shadow } from '@/src/theme/tokens';
import { formatBusDate, parseBusTravelDate } from '@/src/lib/bus-booking-utils';

export default function BusCancellationScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{
    pnr?: string;
    operator?: string;
    fromCity?: string;
    toCity?: string;
    date?: string;
    seats?: string;
    totalPaid?: string;
  }>();

  const travelDate = params.date ? parseBusTravelDate(params.date) : new Date();
  
  const totalPaid = parseInt(params.totalPaid || '1500', 10);
  // Example cancellation logic
  const operatorFee = Math.round(totalPaid * 0.15); // 15% operator fee
  const gozyFee = 50; 
  const refundAmount = Math.max(0, totalPaid - operatorFee - gozyFee);

  return (
    <View style={styles.container}>
      <SafeAreaView style={{ backgroundColor: '#EF4444' }} edges={['top']} />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Pressable onPress={() => {
            router.dismissAll();
            router.replace('/(explore)');
          }} style={styles.backBtn}>
            <MaterialCommunityIcons name="close" size={24} color="#FFF" />
          </Pressable>
          <Text style={styles.headerTitle}>Cancellation Details</Text>
          <View style={{ width: 24 }} />
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}>
        
        {/* Success Banner */}
        <View style={styles.successBanner}>
          <MaterialCommunityIcons name="check-circle" size={48} color="#10B981" />
          <Text style={styles.successTitle}>Ticket Cancelled Successfully</Text>
          <Text style={styles.successSubtitle}>Your bus booking has been cancelled.</Text>
        </View>

        {/* Route Info */}
        <View style={styles.routeCard}>
          <View style={styles.routeHeader}>
            <MaterialCommunityIcons name="bus" size={20} color="#666" />
            <Text style={styles.operatorText}>{params.operator || 'Bus Operator'}</Text>
          </View>
          <View style={styles.routeRow}>
            <Text style={styles.cityText}>{params.fromCity}</Text>
            <MaterialCommunityIcons name="arrow-right" size={20} color="#999" />
            <Text style={styles.cityText}>{params.toCity}</Text>
          </View>
          <Text style={styles.dateText}>{formatBusDate(travelDate, true)} • Seats: {params.seats || '1'}</Text>
          <Text style={styles.pnrText}>PNR: {params.pnr || 'N/A'}</Text>
        </View>

        {/* Refund Details */}
        <View style={styles.refundCard}>
          <Text style={styles.sectionTitle}>Refund Breakdown</Text>
          
          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>Total Amount Paid</Text>
            <Text style={styles.breakdownValue}>₹{totalPaid.toLocaleString('en-IN')}</Text>
          </View>
          
          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>Operator Cancellation Fee</Text>
            <Text style={[styles.breakdownValue, { color: '#EF4444' }]}>-₹{operatorFee.toLocaleString('en-IN')}</Text>
          </View>

          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>Gozy Platform Fee</Text>
            <Text style={[styles.breakdownValue, { color: '#EF4444' }]}>-₹{gozyFee.toLocaleString('en-IN')}</Text>
          </View>

          <View style={styles.divider} />
          
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Refund</Text>
            <Text style={styles.totalValue}>₹{refundAmount.toLocaleString('en-IN')}</Text>
          </View>
        </View>

        {/* Timeline */}
        <View style={styles.timelineCard}>
          <View style={styles.timelineRow}>
            <MaterialCommunityIcons name="check-circle" size={20} color="#10B981" />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.timelineTitle}>Cancellation Confirmed</Text>
              <Text style={styles.timelineSub}>Your ticket is cancelled.</Text>
            </View>
          </View>
          <View style={styles.timelineLine} />
          <View style={styles.timelineRow}>
            <MaterialCommunityIcons name="clock-outline" size={20} color="#D97706" />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.timelineTitle}>Refund Initiated</Text>
              <Text style={styles.timelineSub}>Refund of ₹{refundAmount.toLocaleString('en-IN')} is being processed.</Text>
            </View>
          </View>
          <View style={styles.timelineLine} />
          <View style={styles.timelineRow}>
            <MaterialCommunityIcons name="bank-transfer" size={20} color="#9CA3AF" />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={[styles.timelineTitle, { color: '#6B7280' }]}>Refund Credited</Text>
              <Text style={styles.timelineSub}>Expect to receive it in 3-5 business days to your original payment method.</Text>
            </View>
          </View>
        </View>

      </ScrollView>

      {/* Bottom Action */}
      <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <Pressable 
          style={styles.homeBtn}
          onPress={() => {
            router.dismissAll();
            router.replace('/(explore)');
          }}
        >
          <Text style={styles.homeBtnText}>Back to Home</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F7FB' },
  header: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 16,
    paddingBottom: 24,
    paddingTop: 12,
  },
  headerTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  backBtn: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#FFF' },
  
  content: { padding: 16 },
  
  successBanner: { alignItems: 'center', marginVertical: 24 },
  successTitle: { fontSize: 22, fontWeight: '800', color: '#1F2937', marginTop: 16, textAlign: 'center' },
  successSubtitle: { fontSize: 14, color: '#6B7280', marginTop: 8, textAlign: 'center' },

  routeCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    ...shadow.sm,
  },
  routeHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 8 },
  operatorText: { fontSize: 13, fontWeight: '700', color: '#666' },
  routeRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 8 },
  cityText: { fontSize: 18, fontWeight: '800', color: '#111827' },
  dateText: { fontSize: 14, color: '#4B5563', fontWeight: '500' },
  pnrText: { fontSize: 12, fontWeight: '700', color: '#0084FF', marginTop: 8 },

  refundCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    ...shadow.sm,
  },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: '#111827', marginBottom: 16 },
  breakdownRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  breakdownLabel: { fontSize: 14, color: '#4B5563' },
  breakdownValue: { fontSize: 14, fontWeight: '600', color: '#111827' },
  divider: { height: 1, backgroundColor: '#E5E7EB', marginVertical: 12 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  totalLabel: { fontSize: 16, fontWeight: '800', color: '#111827' },
  totalValue: { fontSize: 20, fontWeight: '900', color: '#10B981' },

  timelineCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
    ...shadow.sm,
  },
  timelineRow: { flexDirection: 'row', alignItems: 'flex-start' },
  timelineLine: { width: 2, height: 24, backgroundColor: '#E5E7EB', marginLeft: 9, marginVertical: 4 },
  timelineTitle: { fontSize: 15, fontWeight: '700', color: '#111827' },
  timelineSub: { fontSize: 13, color: '#6B7280', marginTop: 2, lineHeight: 18 },

  bottomBar: {
    backgroundColor: '#FFF',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    ...shadow.lg,
  },
  homeBtn: {
    backgroundColor: '#EF4444',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  homeBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '800' },
});
