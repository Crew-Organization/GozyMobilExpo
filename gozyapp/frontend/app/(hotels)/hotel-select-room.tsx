import React, { useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, Pressable, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';

import { useSuperAppStore } from '@/src/store/super-app-store';

export default function HotelSelectRoomScreen() {
  const insets = useSafeAreaInsets();
  const { hotelSearch, setSelectedRoom } = useSuperAppStore();
  const [selectedRoomId, setSelectedRoomId] = useState(1);

  const rooms = [
    {
      id: 1,
      name: 'Standard Room + 2 Adults',
      size: '144 sq.ft (13 sq.m)',
      bed: '1 Double Bed',
      bath: '1 Bathroom',
      plan: 'Room Only',
      refundable: 'Non-Refundable',
      originalPrice: 2290,
      price: 1410,
      taxes: 205,
      img: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&q=80',
    },
    {
      id: 2,
      name: 'STUDIO ROOM + 2 Adults',
      size: '200 sq.ft (19 sq.m)',
      bed: '1 King Bed',
      bath: '1 Bathroom',
      plan: 'Room Only',
      refundable: 'Non-Refundable',
      originalPrice: 4400,
      price: 2229,
      taxes: 234,
      img: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=400&q=80',
    }
  ];

  const handleContinue = () => {
    const selected = rooms.find(r => r.id === selectedRoomId);
    if (selected) setSelectedRoom(selected as any);
    router.push('/(hotels)/hotel-review-booking');
  };

  const formatCurrency = (val: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

  return (
    <View style={styles.safeArea}>
      
      {/* Header */}
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 16) }]}>
        <View style={styles.headerLeft}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <MaterialCommunityIcons name="arrow-left" size={24} color="#333" />
          </Pressable>
          <View>
            <Text style={styles.headerTitle}>Select Room</Text>
            <Text style={styles.headerSubtitle}>{new Date(hotelSearch.checkInDate).toLocaleDateString('en-IN', {month: 'short', day: 'numeric'})} - {new Date(hotelSearch.checkOutDate).toLocaleDateString('en-IN', {month: 'short', day: 'numeric'})} • {hotelSearch.rooms} room • {hotelSearch.guests} Guests</Text>
          </View>
        </View>
        <Text onPress={() => alert("Feature coming soon!")} style={{color: '#0084FF', fontSize: 12, fontWeight: '800'}}>Modify</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        
        {rooms.map((room) => {
          const isSelected = selectedRoomId === room.id;
          return (
            <View key={room.id} style={[styles.roomCard, isSelected && styles.roomCardSelected]}>
              <Text style={{fontSize: 13, fontWeight: '900', color: '#333', marginBottom: 12, paddingHorizontal: 16}}>{room.name}</Text>
              
              <View style={{flexDirection: 'row', paddingHorizontal: 16, marginBottom: 16}}>
                <View style={{width: 100, height: 80, borderRadius: 8, overflow: 'hidden', marginRight: 12}}>
                  <Image source={{uri: room.img}} style={StyleSheet.absoluteFillObject} contentFit="cover" />
                  <View style={{position: 'absolute', bottom: 4, right: 4, backgroundColor: 'rgba(0,0,0,0.5)', padding: 4, borderRadius: 4}}>
                    <MaterialCommunityIcons name="image-multiple" size={12} color="#FFF" />
                  </View>
                </View>
                
                <View style={{flex: 1, justifyContent: 'center'}}>
                  <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 4}}>
                    <MaterialCommunityIcons name="ruler-square" size={12} color="#8E8E93" />
                    <Text style={{fontSize: 10, color: '#333', marginLeft: 4}}>{room.size}</Text>
                  </View>
                  <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 4}}>
                    <MaterialCommunityIcons name="bed-double-outline" size={12} color="#8E8E93" />
                    <Text style={{fontSize: 10, color: '#333', marginLeft: 4}}>{room.bed}</Text>
                  </View>
                  {room.bath && (
                    <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 8}}>
                      <MaterialCommunityIcons name="shower" size={12} color="#8E8E93" />
                      <Text style={{fontSize: 10, color: '#333', marginLeft: 4}}>{room.bath}</Text>
                    </View>
                  )}
                  <Text onPress={() => alert("Feature coming soon!")} style={{fontSize: 12, fontWeight: '800', color: '#0084FF'}}>View All</Text>
                </View>
              </View>

              <View style={{height: 1, backgroundColor: '#E5E5EA', marginHorizontal: 16, marginBottom: 16}} />

              <View style={{paddingHorizontal: 16}}>
                <Text style={{fontSize: 13, fontWeight: '900', color: '#333', marginBottom: 8}}>{room.plan}</Text>
                <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 16}}>
                  <Text style={{fontSize: 13, color: '#333'}}>•</Text>
                  <Text style={{fontSize: 12, color: '#333', marginLeft: 8}}>{room.refundable}</Text>
                </View>

                <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end'}}>
                  <Text onPress={() => alert("Feature coming soon!")} style={{fontSize: 12, fontWeight: '800', color: '#0084FF'}}>More Details</Text>
                  
                  <View style={{alignItems: 'flex-end'}}>
                    <Text style={{fontSize: 10, color: '#8E8E93', textDecorationLine: 'line-through'}}>{formatCurrency(room.originalPrice)}</Text>
                    <Text style={{fontSize: 18, fontWeight: '900', color: '#333'}}>{formatCurrency(room.price)}</Text>
                    <Text style={{fontSize: 10, color: '#8E8E93'}}>+ {formatCurrency(room.taxes)} taxes & fees</Text>
                    <Text style={{fontSize: 9, color: '#8E8E93', marginTop: 2}}>per night</Text>
                    
                    {isSelected ? (
                      <View style={{flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#0084FF', borderRadius: 4, paddingHorizontal: 12, paddingVertical: 6, marginTop: 12}}>
                        <MaterialCommunityIcons name="check" size={16} color="#0084FF" />
                        <Text onPress={() => alert("Feature coming soon!")} style={{fontSize: 12, color: '#0084FF', fontWeight: '800', marginLeft: 4}}>Selected</Text>
                      </View>
                    ) : (
                      <Pressable style={{backgroundColor: '#0084FF', borderRadius: 4, paddingHorizontal: 16, paddingVertical: 8, marginTop: 12}} onPress={() => setSelectedRoomId(room.id)}>
                        <Text style={{fontSize: 12, color: '#FFF', fontWeight: '800'}}>CONTINUE</Text>
                      </Pressable>
                    )}
                  </View>
                </View>
              </View>

            </View>
          );
        })}

        <View style={{height: 100}} />
      </ScrollView>

      {/* Floating AI Button */}
      <View style={{position: 'absolute', bottom: 120, right: 24, width: 48, height: 48, borderRadius: 24, backgroundColor: '#E5F1FF', alignItems: 'center', justifyContent: 'center', shadowColor: '#0084FF', shadowOpacity: 0.3, shadowRadius: 10, shadowOffset: {width: 0, height: 4}, elevation: 8}}>
        <MaterialCommunityIcons name="robot-outline" size={24} color="#0084FF" />
      </View>

      {/* Sticky Bottom Footer */}
      <View style={styles.stickyFooter}>
        <View>
          <Text style={{fontSize: 18, fontWeight: '900', color: '#333'}}>{formatCurrency(rooms.find(r => r.id === selectedRoomId)?.price || 0)}</Text>
          <Text style={{fontSize: 10, color: '#8E8E93'}}>+ {formatCurrency(rooms.find(r => r.id === selectedRoomId)?.taxes || 0)} taxes & fees</Text>
          <Text style={{fontSize: 10, color: '#8E8E93'}}>per night</Text>
        </View>
        <Pressable style={styles.continueBtn} onPress={handleContinue}>
          <Text style={{color: '#FFF', fontSize: 13, fontWeight: '800'}}>CONTINUE</Text>
        </Pressable>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#E5E5EA' },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  backBtn: { padding: 4, marginRight: 16 },
  headerTitle: { fontSize: 16, fontWeight: '900', color: '#333' },
  headerSubtitle: { fontSize: 10, color: '#8E8E93' },

  content: { flex: 1, paddingVertical: 16 },

  roomCard: { backgroundColor: '#FFF', marginHorizontal: 16, marginBottom: 16, borderRadius: 12, paddingVertical: 16, borderWidth: 1, borderColor: '#E5E5EA', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, elevation: 3 },
  roomCardSelected: { borderColor: '#D0E6FF', backgroundColor: '#F5FAFF' },

  stickyFooter: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: '#E5E5EA', paddingHorizontal: 24, paddingTop: 16, paddingBottom: 32, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  continueBtn: { backgroundColor: '#0084FF', paddingHorizontal: 32, paddingVertical: 14, borderRadius: 8 },
});
