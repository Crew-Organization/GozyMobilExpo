import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, Image } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { cabRides } from '@/src/lib/cab-data';

export default function CabResultsScreen() {
  const params = useLocalSearchParams<{ type?: string }>();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12} style={styles.backBtn}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#0F172A" />
        </Pressable>
        <View style={styles.headerInfo}>
          <View style={styles.routeRow}>
            <Text style={styles.routeText} numberOfLines={1}>Rajiv Gandhi Int. to B N Reddy Nagar Hyd...</Text>
            <MaterialCommunityIcons name="pencil" size={16} color="#0084FF" />
          </View>
          <Text style={styles.dateText}>23 Apr, 10:00 AM</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.summaryText}>Rides for 34 Kms approx distance | 1 hr 15 mins</Text>

        {cabRides.map((ride, index) => {
          const isElectric = ride.fuel === 'Electric';
          const isTigor = ride.id === 'tigor';

          return (
            <View key={ride.id}>
              <Pressable 
                style={styles.rideCard}
                onPress={() => router.push({ pathname: '/(travel)/(cabs)/cab-review', params: { type: params.type } })}
              >
                <View style={styles.carIconBox}>
                  <MaterialCommunityIcons name={ride.vehicleIcon as any} size={32} color="#0084FF" />
                  {isElectric && (
                    <View style={styles.evBadge}>
                      <Text style={styles.evBadgeText}>EV</Text>
                    </View>
                  )}
                </View>
                
                <View style={styles.rideDetails}>
                  <Text style={styles.rideName}>{ride.name}</Text>
                  <View style={styles.metaRow}>
                    <View style={[styles.fuelBadge, isElectric && styles.fuelBadgeEv]}>
                      <Text style={[styles.fuelText, isElectric && styles.fuelTextEv]}>{ride.fuel}</Text>
                    </View>
                    <Text style={styles.seatsText}>{ride.seats} • AC</Text>
                  </View>
                </View>

                <View style={styles.priceContainer}>
                  {isTigor && (
                    <View style={styles.discountRow}>
                      <Text style={styles.discountPercent}>14% off</Text>
                      <Text style={styles.strikePrice}>₹817</Text>
                    </View>
                  )}
                  <Text style={styles.price}>₹{ride.price}</Text>
                  <Text style={styles.taxesText}>+ ₹42 Taxes & Charges</Text>
                </View>
              </Pressable>

              {/* Promo Banner injected after second item */}
              {index === 1 && (
                <View style={styles.promoBanner}>
                  <View style={styles.promoIcon}>
                    <MaterialCommunityIcons name="brightness-percent" size={24} color="#FFF" />
                  </View>
                  <View style={styles.promoDetails}>
                    <Text style={styles.promoTitle}>Flat Rs. 50 OFF for you</Text>
                    <Text style={styles.promoCode}>Use coupon code: CABPROMO</Text>
                    <Text style={styles.promoStatus}>Discount auto-applied</Text>
                  </View>
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 56,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  backBtn: {
    padding: 4,
    marginRight: 12,
  },
  headerInfo: {
    flex: 1,
  },
  routeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  routeText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
    flex: 1,
  },
  dateText: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  summaryText: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 16,
  },
  rideCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 12,
    alignItems: 'center',
  },
  carIconBox: {
    width: 48,
    height: 48,
    backgroundColor: '#EFF6FF',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    position: 'relative',
  },
  evBadge: {
    position: 'absolute',
    bottom: -4,
    backgroundColor: '#10B981',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 4,
  },
  evBadgeText: {
    fontSize: 8,
    fontWeight: '800',
    color: '#FFF',
  },
  rideDetails: {
    flex: 1,
  },
  rideName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 6,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  fuelBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  fuelBadgeEv: {
    backgroundColor: '#E0F2FE',
  },
  fuelText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748B',
  },
  fuelTextEv: {
    color: '#0284C7',
  },
  seatsText: {
    fontSize: 10.5,
    color: '#64748B',
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  discountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  discountPercent: {
    fontSize: 10.5,
    color: '#10B981',
    fontWeight: '600',
  },
  strikePrice: {
    fontSize: 10.5,
    color: '#94A3B8',
    textDecorationLine: 'line-through',
  },
  price: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  taxesText: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 2,
  },
  promoBanner: {
    flexDirection: 'row',
    backgroundColor: '#E0F2FE',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: 'center',
  },
  promoIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#0EA5E9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  promoDetails: {
    flex: 1,
  },
  promoTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0369A1',
    marginBottom: 2,
  },
  promoCode: {
    fontSize: 12,
    color: '#0284C7',
  },
  promoStatus: {
    fontSize: 10.5,
    color: '#0284C7',
    marginTop: 4,
  },
});
