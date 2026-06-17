import React from 'react';
import { StyleSheet, Text, View, Pressable, ScrollView, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useSuperAppStore } from '@/src/store/super-app-store';

export default function FoodCancellationScreen() {
  const { foodOrderConfirmation, setFoodOrderConfirmation } = useSuperAppStore();
  const insets = useSafeAreaInsets();

  // If there's no order to cancel, just redirect
  if (!foodOrderConfirmation) {
     return null;
  }

  // Assuming food total is extracted from the order (using a dummy value here since it's not in the state object)
  const totalFare = 320; 
  const cancellationFee = 0; // Free cancellation before preparation
  const refundAmount = Math.max(totalFare - cancellationFee, 0);

  const handleBackToHome = () => {
    setFoodOrderConfirmation(null);
    router.replace('/(explore)');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFF' }}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 16) }]}>
        <View style={styles.headerLeft}>
          <Pressable onPress={handleBackToHome} style={styles.backButton}>
            <MaterialCommunityIcons name="close" size={24} color="#333" />
          </Pressable>
          <Text style={styles.headerTitle}>Cancellation Summary</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Status Badge */}
        <View style={styles.statusContainer}>
          <MaterialCommunityIcons name="cancel" size={64} color="#EF4444" />
          <Text style={styles.statusTitle}>Order Cancelled</Text>
          <Text style={styles.statusSub}>Your food order has been successfully cancelled.</Text>
        </View>

        {/* Order Info */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Order Details</Text>
          <Text style={styles.restaurantText}>{foodOrderConfirmation.restaurantName}</Text>
          <Text style={styles.addressText}>Delivering to: {foodOrderConfirmation.addressLabel}</Text>
          <Text style={styles.orderIdText}>Order ID: {foodOrderConfirmation.orderId}</Text>
        </View>

        {/* Refund Breakdown */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Refund Breakdown</Text>
          
          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>Total Amount Paid</Text>
            <Text style={styles.breakdownValue}>₹ {totalFare}</Text>
          </View>
          
          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>Cancellation Fee</Text>
            <Text style={styles.breakdownValueNegative}>-₹ {cancellationFee}</Text>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Final Refund Amount</Text>
            <Text style={styles.totalValue}>₹ {refundAmount}</Text>
          </View>
        </View>

        {/* Refund Timeline */}
        <View style={styles.timelineCard}>
          <MaterialCommunityIcons name="bank-transfer" size={24} color="#0084FF" />
          <View style={styles.timelineTextContainer}>
            <Text style={styles.timelineTitle}>Refund Initiated</Text>
            <Text style={styles.timelineDesc}>
              The refund amount of ₹ {refundAmount} has been initiated to {foodOrderConfirmation.paymentMethod.toUpperCase()}. Depending on your bank, it may take 2-3 business days to reflect.
            </Text>
          </View>
        </View>

        <Pressable style={styles.homeBtn} onPress={handleBackToHome}>
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
  statusTitle: { fontSize: 24, fontWeight: '900', color: '#EF4444', marginTop: 16 },
  statusSub: { fontSize: 13, color: '#8E8E93', textAlign: 'center', marginTop: 8 },
  
  card: { backgroundColor: '#F8FAFC', borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#E5E5EA' },
  cardTitle: { fontSize: 16, fontWeight: '900', color: '#333', marginBottom: 12 },
  
  restaurantText: { fontSize: 18, fontWeight: '800', color: '#333' },
  addressText: { fontSize: 13, color: '#8E8E93', marginTop: 4 },
  orderIdText: { fontSize: 13, fontWeight: '700', color: '#0084FF', marginTop: 8 },
  
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
