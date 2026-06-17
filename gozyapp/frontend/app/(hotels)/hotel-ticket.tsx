import React, { useState } from 'react';
import { StyleSheet, Text, View, Pressable, ScrollView, SafeAreaView, Dimensions, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';

import { useSuperAppStore } from '@/src/store/super-app-store';
import { colors } from '@/src/theme/tokens';

export default function HotelTicketScreen() {
  const { hotelSearch, selectedHotel } = useSuperAppStore();
  const insets = useSafeAreaInsets();
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  const handleCancelBooking = () => {
    setIsCancelling(true);
    setTimeout(() => {
      setIsCancelling(false);
      setShowCancelModal(false);
      router.push('/hotel-cancellation');
    }, 1000);
  };

  if (!selectedHotel) {
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center'}}>
        <Text>No booking found</Text>
        <Pressable onPress={() => router.replace('/(explore)')} style={{marginTop: 20}}>
          <Text style={{color: '#0084FF', fontWeight: '800'}}>Go Home</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  const checkIn = new Date(hotelSearch.checkInDate);
  const checkOut = new Date(hotelSearch.checkOutDate);
  const nights = Math.max(1, Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)));
  const checkInDate = checkIn.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  const checkOutDate = checkOut.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

  return (
    <View style={styles.safeArea}>
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 16) }]}>
        <View style={styles.headerLeft}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <MaterialCommunityIcons name="arrow-left" size={24} color={colors.text} />
          </Pressable>
          <Text style={styles.headerTitle}>Hotel Booking</Text>
        </View>
        <View style={styles.headerRight}>
          <Pressable style={styles.iconBtn}>
            <MaterialCommunityIcons name="download-outline" size={24} color="#0084FF" />
          </Pressable>
          <Pressable style={styles.iconBtn}>
            <MaterialCommunityIcons name="share-variant-outline" size={24} color="#0084FF" />
          </Pressable>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        <View style={styles.ticketContainer}>
          <View style={styles.ticketTop}>
             <Text style={{fontSize: 18, fontWeight: '900', color: '#333'}}>{selectedHotel.name}</Text>
             <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 4}}>
               <MaterialCommunityIcons name="map-marker" size={14} color="#8E8E93" />
               <Text style={{fontSize: 12, color: '#8E8E93', marginLeft: 4}}>{selectedHotel.location}</Text>
             </View>
          </View>

          <View style={styles.ticketMiddle}>
             <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                <View style={{flex: 1}}>
                  <Text style={{fontSize: 12, color: '#8E8E93', marginBottom: 2}}>Check-in</Text>
                  <Text style={{fontSize: 16, fontWeight: '800', color: '#333'}}>{checkInDate}</Text>
                  <Text style={{fontSize: 12, fontWeight: '600', color: '#333', marginTop: 4}}>12:00 PM</Text>
                </View>

                <View style={{flex: 1, alignItems: 'center'}}>
                   <View style={{width: 32, height: 32, borderRadius: 16, backgroundColor: '#E5F1FF', alignItems: 'center', justifyContent: 'center'}}>
                     <MaterialCommunityIcons name="moon-waning-crescent" size={16} color="#0084FF" />
                   </View>
                   <Text onPress={() => alert("Feature coming soon!")} style={{fontSize: 10, color: '#0084FF', fontWeight: '700', marginTop: 4}}>{nights} Night(s)</Text>
                </View>

                <View style={{flex: 1, alignItems: 'flex-end'}}>
                  <Text style={{fontSize: 12, color: '#8E8E93', marginBottom: 2}}>Check-out</Text>
                  <Text style={{fontSize: 16, fontWeight: '800', color: '#333'}}>{checkOutDate}</Text>
                  <Text style={{fontSize: 12, fontWeight: '600', color: '#333', marginTop: 4}}>11:00 AM</Text>
                </View>
             </View>
          </View>

          <View style={styles.dividerContainer}>
             <View style={styles.notchLeft} />
             <View style={styles.dottedLine} />
             <View style={styles.notchRight} />
          </View>

          <View style={styles.ticketBottom}>
             <Text style={{fontSize: 13, fontWeight: '800', color: '#333', marginBottom: 12}}>Booking Details</Text>
             <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16}}>
                <View style={{flex: 1}}>
                  <Text style={{fontSize: 10.5, color: '#8E8E93', marginBottom: 2}}>Guest Name</Text>
                  <Text style={{fontSize: 13, fontWeight: '800', color: '#333'}}>Sandeep Naik</Text>
                </View>
                <View style={{flex: 1}}>
                  <Text style={{fontSize: 10.5, color: '#8E8E93', marginBottom: 2}}>Guests</Text>
                  <Text style={{fontSize: 13, fontWeight: '800', color: '#333'}}>{hotelSearch.guests} Adults</Text>
                </View>
             </View>
             
             <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20}}>
                <View style={{flex: 1}}>
                  <Text style={{fontSize: 10.5, color: '#8E8E93', marginBottom: 2}}>Room Type</Text>
                  <Text style={{fontSize: 13, fontWeight: '800', color: '#333'}}>Classic AC Room</Text>
                </View>
                <View style={{flex: 1}}>
                  <Text style={{fontSize: 10.5, color: '#8E8E93', marginBottom: 2}}>Booking ID</Text>
                  <Text style={{fontSize: 13, fontWeight: '800', color: '#333'}}>HTL-X7B9K2</Text>
                </View>
             </View>

             <View style={{alignItems: 'center', marginTop: 8}}>
                <Image source={{uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/QR_code_for_mobile_English_Wikipedia.svg/1200px-QR_code_for_mobile_English_Wikipedia.svg.png'}} style={{width: 100, height: 100}} />
                <Text style={{fontSize: 10.5, color: '#8E8E93', marginTop: 8}}>Show this at reception</Text>
             </View>
          </View>
        </View>

        <View style={{marginTop: 24, gap: 12}}>
           <Pressable style={styles.primaryBtn} onPress={() => router.replace('/(explore)')}>
              <Text style={styles.primaryBtnText}>RETURN TO HOME</Text>
           </Pressable>
           <Pressable style={styles.secondaryBtn} onPress={() => setShowCancelModal(true)}>
              <Text style={styles.secondaryBtnText}>CANCEL BOOKING</Text>
           </Pressable>
        </View>

      </ScrollView>

      {showCancelModal && (
        <View style={StyleSheet.absoluteFill}>
          <View style={{flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center', padding: 20}}>
             <View style={{backgroundColor: '#FFF', borderRadius: 16, padding: 24, width: '100%', alignItems: 'center'}}>
                <MaterialCommunityIcons name="alert-circle-outline" size={64} color="#EF4444" style={{marginBottom: 16}} />
                <Text style={{fontSize: 18, fontWeight: '900', color: '#333', marginBottom: 8}}>Cancel Booking?</Text>
                <Text style={{fontSize: 13, color: '#8E8E93', textAlign: 'center', marginBottom: 24}}>
                  Are you sure you want to cancel your hotel booking? Cancellation charges may apply based on hotel policy.
                </Text>
                
                {isCancelling ? (
                   <View style={{alignItems: 'center', paddingVertical: 12}}>
                      <ActivityIndicator size="large" color="#EF4444" style={{marginBottom: 8}} />
                      <Text style={{fontSize: 13, fontWeight: '800', color: '#EF4444'}}>Cancelling...</Text>
                   </View>
                ) : (
                   <View style={{flexDirection: 'row', gap: 16, width: '100%'}}>
                     <Pressable style={{flex: 1, paddingVertical: 14, alignItems: 'center', backgroundColor: '#E5E5EA', borderRadius: 8}} onPress={() => setShowCancelModal(false)}>
                        <Text style={{color: '#333', fontSize: 13, fontWeight: '800'}}>KEEP BOOKING</Text>
                     </Pressable>
                     <Pressable style={{flex: 1, paddingVertical: 14, alignItems: 'center', backgroundColor: '#EF4444', borderRadius: 8}} onPress={handleCancelBooking}>
                        <Text style={{color: '#FFF', fontSize: 13, fontWeight: '800'}}>CANCEL</Text>
                     </Pressable>
                   </View>
                )}
             </View>
          </View>
        </View>
      )}

    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#0084FF' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingBottom: 12, backgroundColor: '#FFF' },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  backButton: { marginRight: 12 },
  headerTitle: { fontSize: 18, fontWeight: '900', color: '#333' },
  headerRight: { flexDirection: 'row', gap: 16 },
  iconBtn: { padding: 4 },
  
  content: { padding: 24 },
  
  ticketContainer: { backgroundColor: '#FFF', borderRadius: 16, overflow: 'hidden', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, elevation: 5 },
  
  ticketTop: { padding: 20, backgroundColor: '#F8FAFC' },
  ticketMiddle: { padding: 20, backgroundColor: '#FFF' },
  
  dividerContainer: { flexDirection: 'row', alignItems: 'center', height: 24, backgroundColor: '#FFF' },
  notchLeft: { width: 12, height: 24, backgroundColor: '#0084FF', borderTopRightRadius: 12, borderBottomRightRadius: 12, marginLeft: -1 },
  dottedLine: { flex: 1, height: 1, borderWidth: 1, borderColor: '#E5E5EA', borderStyle: 'dashed', marginHorizontal: 8 },
  notchRight: { width: 12, height: 24, backgroundColor: '#0084FF', borderTopLeftRadius: 12, borderBottomLeftRadius: 12, marginRight: -1 },
  
  ticketBottom: { padding: 20, backgroundColor: '#FFF' },
  
  primaryBtn: { backgroundColor: '#FFF', paddingVertical: 16, borderRadius: 12, alignItems: 'center' },
  primaryBtnText: { color: '#0084FF', fontSize: 13, fontWeight: '900' },
  secondaryBtn: { paddingVertical: 16, borderRadius: 12, alignItems: 'center' },
  secondaryBtnText: { color: '#FFFFFF', fontSize: 13, fontWeight: '800' },
});
