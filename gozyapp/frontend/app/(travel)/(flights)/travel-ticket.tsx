import React, { useRef, useState, useEffect } from 'react';
import { StyleSheet, Text, View, Pressable, ScrollView, SafeAreaView, Dimensions, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';

import { useSuperAppStore } from '@/src/store/super-app-store';
import { colors } from '@/src/theme/tokens';

const { width } = Dimensions.get('window');

export default function TravelTicketScreen() {
  const { travelSearch, selectedTravelOffer } = useSuperAppStore();
  const insets = useSafeAreaInsets();
  const ticketRef = useRef(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  const handleCancelBooking = () => {
    setIsCancelling(true);
    setTimeout(() => {
      setIsCancelling(false);
      setShowCancelModal(false);
      router.push('/travel-cancellation');
    }, 1000);
  };

  if (!selectedTravelOffer) {
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center'}}>
        <Text>No ticket found</Text>
        <Pressable onPress={() => router.push('/(explore)')} style={{marginTop: 20}}>
          <Text onPress={() => alert("Feature coming soon!")} style={{color: '#0084FF', fontWeight: '800'}}>Go Home</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.safeArea}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 16) }]}>
        <View style={styles.headerLeft}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <MaterialCommunityIcons name="arrow-left" size={24} color={colors.text} />
          </Pressable>
          <Text style={styles.headerTitle}>E-Ticket</Text>
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
        
        {/* Ticket Container */}
        <View style={styles.ticketContainer} ref={ticketRef}>
          
          {/* Top section - Airline & PNR */}
          <View style={styles.ticketTop}>
             <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Image source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Air_India_Logo.svg/512px-Air_India_Logo.svg.png' }} style={{ width: 24, height: 24, marginRight: 8 }} contentFit="contain" />
                  <Text style={{fontSize: 13, fontWeight: '800', color: '#333'}}>Air India</Text>
                </View>
                <View style={{alignItems: 'flex-end'}}>
                  <Text style={{fontSize: 10, color: '#8E8E93', fontWeight: '700'}}>PNR</Text>
                  <Text onPress={() => alert("Feature coming soon!")} style={{fontSize: 16, fontWeight: '900', color: '#0084FF'}}>X7B9K2</Text>
                </View>
             </View>
          </View>

          {/* Middle section - Flight Route */}
          <View style={styles.ticketMiddle}>
             <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                <View style={{flex: 1}}>
                  <Text style={{fontSize: 18, fontWeight: '900', color: '#333'}}>{travelSearch.originCode}</Text>
                  <Text style={{fontSize: 12, fontWeight: '700', color: '#8E8E93', marginTop: 4}}>{travelSearch.originCity}</Text>
                  <Text style={{fontSize: 12, color: '#333', fontWeight: '800', marginTop: 8}}>23:30</Text>
                  <Text style={{fontSize: 10, color: '#8E8E93'}}>Sat, 11 Apr</Text>
                </View>

                <View style={{flex: 1, alignItems: 'center'}}>
                   <Text style={{fontSize: 10, color: '#8E8E93', marginBottom: 4}}>2h 30m</Text>
                   <View style={{flexDirection: 'row', alignItems: 'center', width: '100%'}}>
                     <View style={{width: 6, height: 6, borderRadius: 3, backgroundColor: '#0084FF'}} />
                     <View style={{flex: 1, height: 1, backgroundColor: '#0084FF', borderStyle: 'dashed', borderWidth: 1, borderColor: '#0084FF', marginHorizontal: 2}} />
                     <MaterialCommunityIcons name="airplane" size={16} color="#0084FF" style={{transform: [{rotate: '90deg'}]}} />
                   </View>
                   <Text style={{fontSize: 10, color: '#8E8E93', marginTop: 4}}>Non-stop</Text>
                </View>

                <View style={{flex: 1, alignItems: 'flex-end'}}>
                  <Text style={{fontSize: 18, fontWeight: '900', color: '#333'}}>{travelSearch.destinationCode}</Text>
                  <Text style={{fontSize: 12, fontWeight: '700', color: '#8E8E93', marginTop: 4}}>{travelSearch.destinationCity}</Text>
                  <Text style={{fontSize: 12, color: '#333', fontWeight: '800', marginTop: 8}}>02:00</Text>
                  <Text style={{fontSize: 10, color: '#8E8E93'}}>Sun, 12 Apr</Text>
                </View>
             </View>
          </View>

          {/* Dotted Divider */}
          <View style={styles.dividerContainer}>
             <View style={styles.notchLeft} />
             <View style={styles.dottedLine} />
             <View style={styles.notchRight} />
          </View>

          {/* Passenger Details */}
          <View style={styles.ticketBottom}>
             <Text style={{fontSize: 12, fontWeight: '800', color: '#333', marginBottom: 12}}>Passenger Details</Text>
             <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16}}>
                <View style={{flex: 1}}>
                  <Text style={{fontSize: 10, color: '#8E8E93', marginBottom: 2}}>Name</Text>
                  <Text style={{fontSize: 13, fontWeight: '800', color: '#333'}}>Nikhitha (Adult)</Text>
                </View>
                <View style={{flex: 1}}>
                  <Text style={{fontSize: 10, color: '#8E8E93', marginBottom: 2}}>Seat</Text>
                  <Text style={{fontSize: 13, fontWeight: '800', color: '#333'}}>1A</Text>
                </View>
             </View>
             
             <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20}}>
                <View style={{flex: 1}}>
                  <Text style={{fontSize: 10, color: '#8E8E93', marginBottom: 2}}>Class</Text>
                  <Text style={{fontSize: 13, fontWeight: '800', color: '#333'}}>{travelSearch.cabinClass}</Text>
                </View>
                <View style={{flex: 1}}>
                  <Text style={{fontSize: 10, color: '#8E8E93', marginBottom: 2}}>Baggage</Text>
                  <Text style={{fontSize: 13, fontWeight: '800', color: '#333'}}>15kg Check-in</Text>
                </View>
             </View>

             {/* QR Code Mock */}
             <View style={{alignItems: 'center', marginTop: 8}}>
                <Image source={{uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/QR_code_for_mobile_English_Wikipedia.svg/1200px-QR_code_for_mobile_English_Wikipedia.svg.png'}} style={{width: 100, height: 100}} />
                <Text style={{fontSize: 10, color: '#8E8E93', marginTop: 8}}>Scan for boarding pass</Text>
             </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={{marginTop: 24, gap: 12}}>
           <Pressable style={styles.primaryBtn} onPress={() => router.push('/(explore)')}>
              <Text style={styles.primaryBtnText}>RETURN TO HOME</Text>
           </Pressable>
           <Pressable style={styles.secondaryBtn} onPress={() => setShowCancelModal(true)}>
              <Text style={styles.secondaryBtnText}>CANCEL BOOKING</Text>
           </Pressable>
        </View>

      </ScrollView>

      {/* Cancel Confirmation Modal */}
      {showCancelModal && (
        <View style={StyleSheet.absoluteFill}>
          <View style={{flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center', padding: 20}}>
             <View style={{backgroundColor: '#FFF', borderRadius: 16, padding: 24, width: '100%', alignItems: 'center'}}>
                <MaterialCommunityIcons name="alert-circle-outline" size={64} color="#EF4444" style={{marginBottom: 16}} />
                <Text style={{fontSize: 18, fontWeight: '900', color: '#333', marginBottom: 8}}>Cancel Booking?</Text>
                <Text style={{fontSize: 13, color: '#8E8E93', textAlign: 'center', marginBottom: 24}}>
                  Are you sure you want to cancel your flight? Cancellation charges may apply based on airline rules.
                </Text>
                
                {isCancelling ? (
                   <View style={{alignItems: 'center', paddingVertical: 12}}>
                      <ActivityIndicator size="large" color="#EF4444" style={{marginBottom: 8}} />
                      <Text style={{fontSize: 13, fontWeight: '800', color: '#EF4444'}}>Cancelling...</Text>
                   </View>
                ) : (
                   <View style={{flexDirection: 'row', gap: 16, width: '100%'}}>
                     <Pressable style={{flex: 1, paddingVertical: 14, alignItems: 'center', backgroundColor: '#E5E5EA', borderRadius: 8}} onPress={() => setShowCancelModal(false)}>
                        <Text style={{color: '#333', fontSize: 13, fontWeight: '800'}}>KEEP FLIGHT</Text>
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
