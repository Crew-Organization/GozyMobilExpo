import React, { useRef, useState, useEffect } from 'react';
import { StyleSheet, Text, View, Pressable, ScrollView, SafeAreaView, Dimensions, ActivityIndicator } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';

import { colors } from '@/src/theme/tokens';

const { width } = Dimensions.get('window');

export default function CabTicketScreen() {
  const params = useLocalSearchParams<{
    type?: string;
    price?: string;
    pickup?: string;
    drop?: string;
    vehicle?: string;
  }>();

  const insets = useSafeAreaInsets();
  const ticketRef = useRef(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  const pickup = params.pickup || 'Pulivendula';
  const drop = params.drop || 'Thane';
  const vehicle = params.vehicle || 'SUV';

  const handleCancelBooking = () => {
    setIsCancelling(true);
    setTimeout(() => {
      setIsCancelling(false);
      setShowCancelModal(false);
      router.push({
        pathname: '/(travel)/(cabs)/cab-cancellation',
        params: { ...params }
      });
    }, 1000);
  };

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
          
          {/* Top section */}
          <View style={styles.ticketTop}>
             <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <MaterialCommunityIcons name="car-estate" size={24} color="#0084FF" />
                  <Text style={{fontSize: 13, fontWeight: '800', color: '#333', marginLeft: 8}}>Gozy Cabs</Text>
                </View>
                <View style={{alignItems: 'flex-end'}}>
                  <Text style={{fontSize: 10, color: '#8E8E93', fontWeight: '700'}}>BOOKING ID</Text>
                  <Text onPress={() => alert("Feature coming soon!")} style={{fontSize: 16, fontWeight: '900', color: '#0084FF'}}>CAB982Z</Text>
                </View>
             </View>
          </View>

          {/* Middle section - Route */}
          <View style={styles.ticketMiddle}>
             <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                <View style={{flex: 1}}>
                  <Text style={{fontSize: 18, fontWeight: '900', color: '#333'}}>Pickup</Text>
                  <Text style={{fontSize: 12, fontWeight: '700', color: '#8E8E93', marginTop: 4}}>{pickup}</Text>
                  <Text style={{fontSize: 12, color: '#333', fontWeight: '800', marginTop: 8}}>09:00 AM</Text>
                  <Text style={{fontSize: 10, color: '#8E8E93'}}>23 Apr 2024</Text>
                </View>

                <View style={{flex: 1, alignItems: 'center'}}>
                   <Text style={{fontSize: 10, color: '#8E8E93', marginBottom: 4}}></Text>
                   <View style={{flexDirection: 'row', alignItems: 'center', width: '100%'}}>
                     <View style={{width: 6, height: 6, borderRadius: 3, backgroundColor: '#0084FF'}} />
                     <View style={{flex: 1, height: 1, backgroundColor: '#0084FF', borderStyle: 'dashed', borderWidth: 1, borderColor: '#0084FF', marginHorizontal: 2}} />
                     <MaterialCommunityIcons name="car-estate" size={16} color="#0084FF" />
                   </View>
                   <Text style={{fontSize: 10, color: '#8E8E93', marginTop: 4}}>Direct</Text>
                </View>

                <View style={{flex: 1, alignItems: 'flex-end'}}>
                  <Text style={{fontSize: 18, fontWeight: '900', color: '#333'}}>Drop</Text>
                  <Text style={{fontSize: 12, fontWeight: '700', color: '#8E8E93', marginTop: 4}}>{drop}</Text>
                  <Text style={{fontSize: 12, color: '#333', fontWeight: '800', marginTop: 8}}>--:--</Text>
                  <Text style={{fontSize: 10, color: '#8E8E93'}}>23 Apr 2024</Text>
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
                  <Text style={{fontSize: 13, fontWeight: '800', color: '#333'}}>Nikshitha</Text>
                </View>
                <View style={{flex: 1}}>
                  <Text style={{fontSize: 10, color: '#8E8E93', marginBottom: 2}}>Driver</Text>
                  <Text style={{fontSize: 13, fontWeight: '800', color: '#333'}}>Assigned Soon</Text>
                </View>
             </View>
             
             <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20}}>
                <View style={{flex: 1}}>
                  <Text style={{fontSize: 10, color: '#8E8E93', marginBottom: 2}}>Vehicle</Text>
                  <Text style={{fontSize: 13, fontWeight: '800', color: '#333'}}>{vehicle}</Text>
                </View>
                <View style={{flex: 1}}>
                  <Text style={{fontSize: 10, color: '#8E8E93', marginBottom: 2}}>Status</Text>
                  <Text style={{fontSize: 13, fontWeight: '800', color: '#10B981'}}>Confirmed</Text>
                </View>
             </View>

             {/* QR Code Mock */}
             <View style={{alignItems: 'center', marginTop: 8}}>
                <Image source={{uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/QR_code_for_mobile_English_Wikipedia.svg/1200px-QR_code_for_mobile_English_Wikipedia.svg.png'}} style={{width: 100, height: 100}} />
                <Text style={{fontSize: 10, color: '#8E8E93', marginTop: 8}}>Scan for ride details</Text>
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
                  Are you sure you want to cancel your cab? Cancellation charges may apply.
                </Text>
                
                {isCancelling ? (
                   <View style={{alignItems: 'center', paddingVertical: 12}}>
                      <ActivityIndicator size="large" color="#EF4444" style={{marginBottom: 8}} />
                      <Text style={{fontSize: 13, fontWeight: '800', color: '#EF4444'}}>Cancelling...</Text>
                   </View>
                ) : (
                   <View style={{flexDirection: 'row', gap: 16, width: '100%'}}>
                     <Pressable style={{flex: 1, paddingVertical: 14, alignItems: 'center', backgroundColor: '#E5E5EA', borderRadius: 8}} onPress={() => setShowCancelModal(false)}>
                        <Text style={{color: '#333', fontSize: 13, fontWeight: '800'}}>KEEP CAB</Text>
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
