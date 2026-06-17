import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, Pressable, ScrollView, TextInput } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';

import { useSuperAppStore } from '@/src/store/super-app-store';

export default function HotelReviewBookingScreen() {
  const insets = useSafeAreaInsets();
  const { hotelSearch, selectedHotel, selectedRoom } = useSuperAppStore();

  const handleContinue = () => {
    router.push('/(hotels)/hotel-payment');
  };

  const formatCurrency = (val: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

  const checkIn = new Date(hotelSearch.checkInDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  const checkOut = new Date(hotelSearch.checkOutDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });

  return (
    <View style={styles.safeArea}>
      
      {/* Header */}
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 16) }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#333" />
        </Pressable>
        <Text style={styles.headerTitle}>Review Booking</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Booking Summary Card */}
        <View style={styles.summaryCard}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16}}>
            <View style={{flex: 1}}>
              <Text style={{fontSize: 18, fontWeight: '900', color: '#333'}}>{selectedHotel?.name || 'Hotel'}</Text>
              <View style={{flexDirection: 'row', marginTop: 4, marginBottom: 4}}>
                {Array.from({length: selectedHotel?.starRating || 3}).map((_, i) => <MaterialCommunityIcons key={i} name="star" size={12} color="#D97706" />)}
              </View>
              <Text style={{fontSize: 10, color: '#8E8E93'}}>{selectedHotel?.location}, {hotelSearch.city}</Text>
            </View>
            <Image source={{uri: selectedHotel?.images?.[0] || selectedHotel?.image}} style={{width: 60, height: 60, borderRadius: 8}} contentFit="cover" />
          </View>

          <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#F8FAFC', padding: 12, borderRadius: 8, marginBottom: 16}}>
            <View>
              <Text style={{fontSize: 10, color: '#8E8E93', fontWeight: '800', marginBottom: 4}}>CHECK-IN</Text>
              <Text style={{fontSize: 13, fontWeight: '900', color: '#333'}}>{checkIn}</Text>
              <Text style={{fontSize: 10, color: '#333', marginTop: 2}}>{selectedHotel?.rules?.checkInTime || '12 PM'}</Text>
            </View>
            <View style={{backgroundColor: '#FFF', borderWidth: 1, borderColor: '#E5E5EA', borderRadius: 12, paddingHorizontal: 8, paddingVertical: 4}}>
              <Text style={{fontSize: 10, color: '#8E8E93', fontWeight: '800'}}>1 Night</Text>
            </View>
            <View style={{alignItems: 'flex-end'}}>
              <Text style={{fontSize: 10, color: '#8E8E93', fontWeight: '800', marginBottom: 4}}>CHECK-OUT</Text>
              <Text style={{fontSize: 13, fontWeight: '900', color: '#333'}}>{checkOut}</Text>
              <Text style={{fontSize: 10, color: '#333', marginTop: 2}}>{selectedHotel?.rules?.checkOutTime || '11 AM'}</Text>
            </View>
          </View>

          <View style={{marginBottom: 16}}>
            <Text style={{fontSize: 10, color: '#8E8E93', marginBottom: 4}}>Guests & Rooms</Text>
            <Text style={{fontSize: 13, fontWeight: '900', color: '#333'}}>{hotelSearch.guests} Adults • {hotelSearch.rooms} Room</Text>
          </View>

          <View style={styles.divider} />

          <View style={{marginBottom: 16}}>
            <Text style={{fontSize: 16, fontWeight: '900', color: '#333', marginBottom: 8}}>{selectedRoom?.name || 'Standard Room'}</Text>
            <View style={{flexDirection: 'row', marginBottom: 4}}>
              <Text style={{fontSize: 13, color: '#333'}}>•</Text>
              <Text style={{fontSize: 12, color: '#333', marginLeft: 8}}>{selectedRoom?.plan || 'Room Only'}</Text>
            </View>
            <View style={{flexDirection: 'row', marginBottom: 12}}>
              <Text style={{fontSize: 13, color: '#333'}}>•</Text>
              <Text style={{fontSize: 12, color: '#333', marginLeft: 8}}>No meals included</Text>
            </View>
            
            <Text style={{fontSize: 12, fontWeight: '800', color: '#333', marginBottom: 4}}>Non-Refundable</Text>
            <Text style={{fontSize: 10, color: '#8E8E93', marginBottom: 12}}>Refund is not applicable for this booking</Text>
            <Text onPress={() => alert("Feature coming soon!")} style={{fontSize: 12, color: '#0084FF', fontWeight: '800'}}>Inclusions & Cancellation Policy</Text>
          </View>

          <View style={styles.divider} />

          {/* Welcome Offer Banner */}
          <View style={{backgroundColor: '#FFFBEB', borderRadius: 8, padding: 12, borderWidth: 1, borderColor: '#FDE68A'}}>
            <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 8}}>
              <MaterialCommunityIcons name="star-circle" size={16} color="#D97706" />
              <Text style={{fontSize: 12, fontWeight: '900', color: '#D97706', marginLeft: 4}}>Welcome Offer</Text>
            </View>
            <Text style={{fontSize: 10, color: '#333', lineHeight: 16}}>
              Congrats! You have unlocked an exclusive Rate. Use coupon WELCOMETRIP to get additional upto 25% off
            </Text>
          </View>
        </View>

        {/* Primary Guest Details */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Primary Guest Details</Text>
          <View style={{backgroundColor: '#F5FAFF', padding: 12, borderRadius: 8, marginBottom: 16, borderWidth: 1, borderColor: '#D0E6FF'}}>
            <Text onPress={() => alert("Feature coming soon!")} style={{fontSize: 12, color: '#0084FF', fontWeight: '800'}}>Login to access your saved cards & more</Text>
          </View>
          
          <View style={{flexDirection: 'row', gap: 12, marginBottom: 16}}>
            <TextInput style={[styles.inputBox, {flex: 0.3}]} placeholder="TITLE" placeholderTextColor="#8E8E93" />
            <TextInput style={[styles.inputBox, {flex: 1}]} placeholder="FIRST NAME" placeholderTextColor="#8E8E93" />
            <TextInput style={[styles.inputBox, {flex: 1}]} placeholder="LAST NAME" placeholderTextColor="#8E8E93" />
          </View>
          
          <TextInput style={[styles.inputBox, {marginBottom: 16}]} placeholder="EMAIL ID" placeholderTextColor="#8E8E93" />
          
          <View style={{flexDirection: 'row', gap: 12, marginBottom: 16}}>
            <TextInput style={[styles.inputBox, {flex: 0.3}]} placeholder="+91" placeholderTextColor="#8E8E93" />
            <TextInput style={[styles.inputBox, {flex: 1}]} placeholder="CONTACT NO." placeholderTextColor="#8E8E93" keyboardType="phone-pad" />
          </View>
          
          <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 16}}>
            <MaterialCommunityIcons name="checkbox-blank-outline" size={20} color="#8E8E93" />
            <Text style={{fontSize: 12, color: '#333', marginLeft: 8}}>I have a GST number (Optional)</Text>
          </View>
          
          <Text onPress={() => alert("Feature coming soon!")} style={{fontSize: 12, color: '#0084FF', fontWeight: '800'}}>Add Other Guest</Text>
        </View>

        {/* Trip Secure */}
        <View style={styles.card}>
          <View style={{backgroundColor: '#E5FDF4', padding: 12, borderRadius: 8, flexDirection: 'row', alignItems: 'center', marginBottom: 16}}>
            <MaterialCommunityIcons name="shield-check" size={24} color="#10B981" />
            <Text style={{fontSize: 10, color: '#10B981', fontWeight: '800', marginLeft: 8, flex: 1}}>Over 1 million travellers secured in the last month</Text>
          </View>
          
          <Text style={{fontSize: 16, fontWeight: '900', color: '#333'}}>Trip Secure</Text>
          <Text onPress={() => alert("Feature coming soon!")} style={{fontSize: 12, color: '#0084FF', fontWeight: '800', marginBottom: 16}}>Enjoy a Worry-Free Stay</Text>
          
          <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8}}>
            <Text style={{fontSize: 12, color: '#333'}}><MaterialCommunityIcons name="hospital-box-outline" size={12} color="#10B981" /> Medical Assistance</Text>
            <Text style={{fontSize: 12, fontWeight: '800', color: '#333'}}>24*7 SUPPORT</Text>
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8}}>
            <Text style={{fontSize: 12, color: '#333'}}><MaterialCommunityIcons name="cash-refund" size={12} color="#0084FF" /> Refund on Hotel Cancellation</Text>
            <Text style={{fontSize: 12, fontWeight: '800', color: '#333'}}>Rs 10,000</Text>
          </View>
          
          <Text onPress={() => alert("Feature coming soon!")} style={{fontSize: 12, color: '#0084FF', fontWeight: '800', textAlign: 'right', marginBottom: 16}}>6 more benefits</Text>
          
          <Text style={{fontSize: 13, fontWeight: '900', color: '#333'}}>₹29 <Text style={{fontSize: 10, fontWeight: '400', color: '#8E8E93'}}>per person per night</Text></Text>
          <Text style={{fontSize: 10, color: '#8E8E93', marginBottom: 16}}>18% GST Included | Non-Refundable</Text>
          
          <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 12}}>
            <MaterialCommunityIcons name="radiobox-blank" size={20} color="#8E8E93" />
            <Text style={{fontSize: 13, color: '#333', marginLeft: 8}}>Yes, secure my trip.</Text>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 16}}>
            <MaterialCommunityIcons name="radiobox-blank" size={20} color="#8E8E93" />
            <Text style={{fontSize: 13, color: '#333', marginLeft: 8}}>No, I will book without trip secure.</Text>
          </View>
          
          <View style={{flexDirection: 'row', alignItems: 'flex-start', padding: 12, backgroundColor: '#F8FAFC', borderRadius: 8}}>
            <MaterialCommunityIcons name="checkbox-marked" size={20} color="#0084FF" />
            <Text style={{fontSize: 10, color: '#8E8E93', marginLeft: 8, flex: 1, lineHeight: 14}}>
              By proceeding, I agree to MakeMyTrip's <Text onPress={() => alert("Feature coming soon!")} style={{color: '#0084FF'}}>User Agreement, Terms of Service</Text> and <Text onPress={() => alert("Feature coming soon!")} style={{color: '#0084FF'}}>Cancellation & Property Booking Policies</Text>
            </Text>
          </View>
        </View>

        {/* Coupon Codes */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Coupon Codes</Text>
          <View style={{flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#E5E5EA', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, marginBottom: 16}}>
            <TextInput placeholder="Have a Coupon Code?" style={{flex: 1, fontSize: 12}} />
            <Text onPress={() => alert("Feature coming soon!")} style={{fontSize: 12, color: '#0084FF', fontWeight: '800'}}>Apply</Text>
          </View>
          
          <View style={{borderWidth: 1, borderColor: '#0084FF', borderRadius: 8, padding: 12, backgroundColor: '#F5FAFF', marginBottom: 12}}>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8}}>
              <Text style={{fontSize: 12, fontWeight: '900', color: '#333'}}>MMTSMARTDEAL</Text>
              <Text style={{fontSize: 12, fontWeight: '900', color: '#10B981'}}>₹317 off</Text>
            </View>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
              <Text style={{fontSize: 10, color: '#8E8E93', flex: 1}}>Congratulations! Discount of Rs.317 Applied</Text>
              <Text onPress={() => alert("Feature coming soon!")} style={{fontSize: 12, color: '#0084FF', fontWeight: '800'}}>Remove</Text>
            </View>
          </View>
          
          <View style={{borderWidth: 1, borderColor: '#E5E5EA', borderRadius: 8, padding: 12, marginBottom: 12}}>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8}}>
              <Text style={{fontSize: 12, fontWeight: '900', color: '#333'}}>WELCOMETRIP</Text>
              <Text style={{fontSize: 12, fontWeight: '900', color: '#333'}}>₹420 off</Text>
            </View>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
              <Text style={{fontSize: 10, color: '#8E8E93', flex: 1}}>Extra Discount For You! Get Extra 20% off.</Text>
              <Text onPress={() => alert("Feature coming soon!")} style={{fontSize: 12, color: '#0084FF', fontWeight: '800'}}>Apply</Text>
            </View>
          </View>
        </View>

        <View style={{height: 100}} />
      </ScrollView>

      {/* Floating AI Button */}
      <View style={{position: 'absolute', bottom: 100, right: 24, width: 48, height: 48, borderRadius: 24, backgroundColor: '#E5F1FF', alignItems: 'center', justifyContent: 'center', shadowColor: '#0084FF', shadowOpacity: 0.3, shadowRadius: 10, shadowOffset: {width: 0, height: 4}, elevation: 8}}>
        <MaterialCommunityIcons name="robot-outline" size={24} color="#0084FF" />
      </View>

      {/* Sticky Bottom Footer */}
      <View style={styles.stickyFooter}>
        <View>
          <Text style={{fontSize: 16, fontWeight: '800', color: '#111827'}}>₹8,490 <Text style={{fontSize: 12, fontWeight: '600'}}>(1 Room)</Text></Text>
          <Text style={{fontSize: 10, color: '#8E8E93', marginTop: 2}}>INCLUSIVE OF TAXES</Text>
        </View>
        <Pressable style={styles.continueBtn} onPress={() => router.push('/(hotels)/hotel-payment')}>
          <Text style={{color: '#FFF', fontSize: 13, fontWeight: '800'}}>CONTINUE</Text>
        </Pressable>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#E5E5EA' },
  backBtn: { padding: 4, marginRight: 16 },
  headerTitle: { fontSize: 16, fontWeight: '900', color: '#333' },

  content: { flex: 1, paddingVertical: 16 },

  summaryCard: { backgroundColor: '#FFF', marginHorizontal: 16, borderRadius: 12, padding: 16, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, elevation: 3, marginBottom: 16 },
  card: { backgroundColor: '#FFF', marginHorizontal: 16, borderRadius: 12, padding: 16, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, elevation: 3, marginBottom: 16 },
  cardTitle: { fontSize: 16, fontWeight: '900', color: '#333', marginBottom: 16 },
  inputBox: { borderWidth: 1, borderColor: '#E5E5EA', borderRadius: 8, padding: 12 },
  inputText: { fontSize: 10, color: '#8E8E93', fontWeight: '800' },
  divider: { height: 1, backgroundColor: '#E5E5EA', marginVertical: 16 },

  stickyFooter: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: '#E5E5EA', paddingHorizontal: 24, paddingTop: 16, paddingBottom: 32, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  continueBtn: { backgroundColor: '#0084FF', paddingHorizontal: 32, paddingVertical: 14, borderRadius: 8 },
});
