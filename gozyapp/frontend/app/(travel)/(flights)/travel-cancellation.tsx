import React from 'react';
import { StyleSheet, Text, View, Pressable, ScrollView, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useSuperAppStore } from '@/src/store/super-app-store';

export default function TravelCancellationScreen() {
  const { travelSearch, selectedTravelOffer } = useSuperAppStore();
  const insets = useSafeAreaInsets();

  const totalFare = selectedTravelOffer?.price || 5600;
  const airlineCancellationFee = 3500;
  const platformFee = 300;
  const totalCancellationFee = airlineCancellationFee + platformFee;
  const refundAmount = Math.max(totalFare - totalCancellationFee, 0);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFF' }}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 16) }]}>
        <View style={styles.headerLeft}>
          <Pressable onPress={() => router.replace('/(explore)')} style={styles.backButton}>
            <MaterialCommunityIcons name="close" size={24} color="#333" />
          </Pressable>
          <Text style={styles.headerTitle}>Cancellation Summary</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Status Badge */}
        <View style={styles.statusContainer}>
          <MaterialCommunityIcons name="check-circle" size={64} color="#10B981" />
          <Text style={styles.statusTitle}>Flight Cancelled</Text>
          <Text style={styles.statusSub}>Your flight has been successfully cancelled.</Text>
        </View>

        {/* Flight Info */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Flight Details</Text>
          <Text style={styles.routeText}>{travelSearch.originCity} to {travelSearch.destinationCity}</Text>
          <Text style={styles.flightDate}>
            {new Date(travelSearch.departureDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
          </Text>
          <Text style={styles.pnrText}>PNR: X7B9K2</Text>
        </View>

        {/* Refund Breakdown */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Refund Breakdown</Text>
          
          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>Total Fare Paid</Text>
            <Text style={styles.breakdownValue}>₹ {totalFare.toLocaleString('en-IN')}</Text>
          </View>
          
          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>Airline Cancellation Fee</Text>
            <Text style={styles.breakdownValueNegative}>-₹ {airlineCancellationFee.toLocaleString('en-IN')}</Text>
          </View>

          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>Platform Fee</Text>
            <Text style={styles.breakdownValueNegative}>-₹ {platformFee.toLocaleString('en-IN')}</Text>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Final Refund Amount</Text>
            <Text style={styles.totalValue}>₹ {refundAmount.toLocaleString('en-IN')}</Text>
          </View>
        </View>

        {/* Refund Timeline */}
        <View style={styles.timelineCard}>
          <MaterialCommunityIcons name="bank-transfer" size={24} color="#0084FF" />
          <View style={styles.timelineTextContainer}>
            <Text style={styles.timelineTitle}>Refund Initiated</Text>
            <Text style={styles.timelineDesc}>
              The refund amount of ₹ {refundAmount.toLocaleString('en-IN')} has been initiated to your original payment source. Depending on your bank, it may take 5-7 business days to reflect.
            </Text>
          </View>
        </View>

        <Pressable style={styles.homeBtn} onPress={() => router.replace('/(explore)')}>
          <Text style={styles.homeBtnText}>BACK TO HOME</Text>
        </Pressable>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingBottom: 12, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#E5E5EA' },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  backButton: { marginRight: 12 },
  headerTitle: { fontSize: 18, fontWeight: '900', color: '#333' },
  
  content: { padding: 16 },
  
  statusContainer: { alignItems: 'center', marginVertical: 32 },
  statusTitle: { fontSize: 24, fontWeight: '900', color: '#10B981', marginTop: 16 },
  statusSub: { fontSize: 13, color: '#8E8E93', textAlign: 'center', marginTop: 8 },
  
  card: { backgroundColor: '#F8FAFC', borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#E5E5EA' },
  cardTitle: { fontSize: 16, fontWeight: '900', color: '#333', marginBottom: 12 },
  
  routeText: { fontSize: 18, fontWeight: '800', color: '#333' },
  flightDate: { fontSize: 13, color: '#8E8E93', marginTop: 4 },
  pnrText: { fontSize: 13, fontWeight: '700', color: '#0084FF', marginTop: 8 },
  
  breakdownRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  breakdownLabel: { fontSize: 13, color: '#333', fontWeight: '600' },
  breakdownValue: { fontSize: 13, color: '#333', fontWeight: '800' },
  breakdownValueNegative: { fontSize: 13, color: '#EF4444', fontWeight: '800' },
  
  divider: { height: 1, backgroundColor: '#E5E5EA', marginVertical: 12 },
  
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  totalLabel: { fontSize: 16, color: '#10B981', fontWeight: '900' },
  totalValue: { fontSize: 18, color: '#10B981', fontWeight: '900' },
  
  timelineCard: { backgroundColor: '#F0F9FF', borderRadius: 12, padding: 16, flexDirection: 'row', alignItems: 'flex-start', marginBottom: 32 },
  timelineTextContainer: { flex: 1, marginLeft: 12 },
  timelineTitle: { fontSize: 14, fontWeight: '800', color: '#0084FF', marginBottom: 4 },
  timelineDesc: { fontSize: 12, color: '#0084FF', lineHeight: 18 },
  
  homeBtn: { backgroundColor: '#0084FF', paddingVertical: 16, borderRadius: 12, alignItems: 'center' },
  homeBtnText: { color: '#FFFFFF', fontSize: 14, fontWeight: '900' },
});
