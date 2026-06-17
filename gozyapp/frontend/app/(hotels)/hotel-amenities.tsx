import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, Pressable, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { useSuperAppStore } from '@/src/store/super-app-store';

const amenityCategories = [
  'Basic Facilities', 'General Services', 
  'Health and wellness', 'Transfers', 'Room Amenities', 
  'Food and Drinks', 'Payment Services', 'Safety and Security',
  'Entertainment', 'Media and technology', 'Outdoor Activities and Sports',
  'Indoor Activities and Sports', 'Common Area', 'Shopping',
  'Business Center and Conferences', 'Other Facilities'
];

const amenitiesData = [
  {
    category: 'Basic Facilities',
    items: [
      { name: 'Smoke Detector', icon: 'smoke-detector' },
      { name: 'LAN', icon: 'router-wireless' },
      { name: 'Power Backup', icon: 'lightning-bolt' },
      { name: 'Elevator/Lift', icon: 'elevator' },
      { name: 'Refrigerator', icon: 'fridge' },
      { name: 'Housekeeping', icon: 'broom' },
      { name: 'Washing Machine', icon: 'washing-machine' },
      { name: 'Umbrella', icon: 'umbrella' },
      { name: 'Room Service', icon: 'room-service' },
      { name: 'Air Conditioning', icon: 'air-conditioner' },
      { name: 'Kitchenette', icon: 'fridge-outline' },
      { name: 'Parking', icon: 'parking' },
      { name: 'Wi-Fi', icon: 'wifi' },
      { name: 'Laundry Service', icon: 'tshirt-crew' },
    ]
  },
  {
    category: 'General Services',
    items: [
      { name: 'Concierge', icon: 'bell-ring' },
      { name: 'Luggage Assistance', icon: 'bag-suitcase' },
      { name: 'Doctor on Call', icon: 'doctor' },
      { name: 'Caretaker', icon: 'account-tie' },
      { name: 'Multi-lingual Staff', icon: 'translate' },
    ]
  },
  {
    category: 'Health and wellness',
    items: [
      { name: 'Yoga', icon: 'yoga' },
      { name: 'Meditation Room', icon: 'meditation' },
      { name: 'First-aid Services', icon: 'medical-bag' },
      { name: 'Activity Centre', icon: 'run' },
    ]
  },
  {
    category: 'Transfers',
    items: [
      { name: 'Bus Station Transfers', icon: 'bus' },
      { name: 'Airport Transfers', icon: 'airplane' },
      { name: 'Shuttle Service', icon: 'van-passenger' },
      { name: 'Railway Transfers', icon: 'train' },
    ]
  },
  {
    category: 'Room Amenities',
    items: [
      { name: 'Hairdryer', icon: 'hair-dryer' },
      { name: 'Living Area', icon: 'sofa' },
      { name: 'Fireplace', icon: 'fireplace' },
      { name: 'Air Conditioning', icon: 'air-conditioner' },
      { name: 'Iron/Ironing Board', icon: 'iron' },
      { name: 'Bubble Bath', icon: 'bathtub' },
      { name: 'Terrace', icon: 'balcony' },
      { name: 'Geyser/Water Heater', icon: 'water-boiler' },
      { name: 'Toiletries', icon: 'bottle-tonic' },
      { name: 'Dining Area', icon: 'silverware' },
      { name: 'Work Desk', icon: 'desk' },
      { name: 'Sofa', icon: 'sofa' },
      { name: 'Minibar', icon: 'glass-cocktail' },
      { name: 'Mineral Water', icon: 'bottle-water' },
      { name: 'Cook & Butler Service', icon: 'chef-hat' },
      { name: 'Coffee Machine', icon: 'coffee-maker' },
      { name: 'Heater', icon: 'heating-coil' },
    ]
  },
  {
    category: 'Food and Drinks',
    items: [
      { name: 'Restaurant', icon: 'silverware-fork-knife' },
      { name: 'Dining Area', icon: 'silverware' },
      { name: 'Breakfast', icon: 'coffee' },
    ]
  },
  {
    category: 'Payment Services',
    items: [
      { name: 'ATM', icon: 'atm' },
      { name: 'Currency Exchange', icon: 'currency-usd' },
    ]
  },
  {
    category: 'Safety and Security',
    items: [
      { name: 'CCTV', icon: 'cctv' },
      { name: 'Fire Extinguishers', icon: 'fire-extinguisher' },
      { name: 'Security alarms', icon: 'alarm-light' },
      { name: 'Security Guard', icon: 'security' },
    ]
  },
  {
    category: 'Entertainment',
    items: [
      { name: 'Night Club', icon: 'glass-cocktail' },
    ]
  },
  {
    category: 'Media and technology',
    items: [
      { name: 'TV', icon: 'television' },
    ]
  },
  {
    category: 'Outdoor Activities and Sports',
    items: [
      { name: 'Cycling', icon: 'bike' },
    ]
  },
  {
    category: 'Indoor Activities and Sports',
    items: [
      { name: 'Indoor Games', icon: 'controller-classic' },
    ]
  },
  {
    category: 'Common Area',
    items: [
      { name: 'Living Room', icon: 'sofa' },
      { name: 'Reception', icon: 'desk-lamp' },
      { name: 'Library', icon: 'book-open-page-variant' },
      { name: 'Balcony/Terrace', icon: 'balcony' },
      { name: 'Prayer Room', icon: 'hands-pray' },
      { name: 'Outdoor furniture', icon: 'chair-rolling' },
      { name: 'Garden', icon: 'leaf' },
    ]
  },
  {
    category: 'Shopping',
    items: [
      { name: 'Jewellery Shop', icon: 'diamond-stone' },
    ]
  },
  {
    category: 'Business Center and Conferences',
    items: [
      { name: 'Printer', icon: 'printer' },
      { name: 'Photocopying', icon: 'content-copy' },
      { name: 'Business Centre', icon: 'briefcase' },
    ]
  },
  {
    category: 'Other Facilities',
    items: [
      { name: 'Cloak Room', icon: 'hanger' },
      { name: 'Medical centre', icon: 'hospital-box' },
      { name: 'Carbon Monoxide Detector', icon: 'smoke-detector' },
      { name: 'Food Options Available', icon: 'food' },
    ]
  }
];

export default function HotelAmenitiesScreen() {
  const insets = useSafeAreaInsets();
  const { selectedHotel } = useSuperAppStore();

  if (!selectedHotel) return null;

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
            <Text style={styles.headerTitle}>Amenities for Couples</Text>
            <Text style={styles.headerSubtitle}>{selectedHotel.name}</Text>
          </View>
        </View>
        <MaterialCommunityIcons name="magnify" size={24} color="#333" />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Categories Grid */}
        <View style={styles.categoriesGrid}>
          {amenityCategories.map((cat, idx) => (
            <View key={idx} style={[styles.categoryPill, idx === 0 && styles.categoryPillActive]}>
              <Text style={[styles.categoryText, idx === 0 && styles.categoryTextActive]}>{cat}</Text>
            </View>
          ))}
        </View>

        <View style={styles.divider} />

        {/* Dynamic Sections */}
        {amenitiesData.map((section, sIdx) => (
          <View key={sIdx}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{section.category}</Text>
              {section.items.map((item, idx) => (
                <View key={idx} style={styles.amenityRow}>
                  <MaterialCommunityIcons name={item.icon as any} size={20} color="#8E8E93" />
                  <Text style={styles.amenityText}>{item.name}</Text>
                </View>
              ))}
              {section.items.length > 5 && (
                <Text onPress={() => alert("Feature coming soon!")} style={{color: '#0084FF', fontSize: 12, fontWeight: '800', marginTop: 8}}>Show Less</Text>
              )}
            </View>
            {sIdx < amenitiesData.length - 1 && <View style={styles.divider} />}
          </View>
        ))}

        {/* What guests said */}
        <View style={styles.divider} />
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What guests said</Text>
          <View style={{flexDirection: 'row', alignItems: 'flex-start', marginTop: 12}}>
             <MaterialCommunityIcons name="message-star-outline" size={20} color="#0084FF" />
             <View style={{marginLeft: 12, flex: 1}}>
               <Text style={{fontSize: 12, fontWeight: '800', color: '#333'}}>Amenities rated 8.8 by guests</Text>
               <Text style={{fontSize: 10.5, color: '#333', lineHeight: 16, marginTop: 4}}>
                 Guests appreciated the variety and quality of amenities, such as clean rooms, comfortable furnishings, and reliable Wi-Fi. Many noted the presence of helpful facilities like coffee machines and mini fridges. The overall maintenance was praised, contributing to a pleasant stay. Some reviews mentioned a lack of basic items, like adequate towels, but the overall sentiment focused... <Text onPress={() => alert("Feature coming soon!")} style={{color: '#0084FF', fontWeight: '800'}}>Read More</Text>
               </Text>
             </View>
          </View>
        </View>

        <View style={{height: 120}} />
      </ScrollView>

      {/* Floating AI Button */}
      <View style={{position: 'absolute', bottom: 120, right: 24, width: 48, height: 48, borderRadius: 24, backgroundColor: '#0084FF', alignItems: 'center', justifyContent: 'center', shadowColor: '#0084FF', shadowOpacity: 0.5, shadowRadius: 10, shadowOffset: {width: 0, height: 4}, elevation: 8, borderWidth: 2, borderColor: '#D0E6FF'}}>
        <MaterialCommunityIcons name="robot-outline" size={20} color="#FFF" />
      </View>

      {/* Sticky Bottom Footer */}
      <View style={styles.stickyFooter}>
        <View>
          <Text style={{fontSize: 18, fontWeight: '900', color: '#111827'}}>{formatCurrency(selectedHotel.price)}</Text>
          <Text style={{fontSize: 10, color: '#8E8E93'}}>+ {formatCurrency(selectedHotel.taxes)} taxes & fees</Text>
          <Text style={{fontSize: 10, color: '#8E8E93'}}>per night</Text>
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Pressable style={{width: 44, height: 44, borderRadius: 22, borderWidth: 1, borderColor: '#E5E5EA', alignItems: 'center', justifyContent: 'center', marginRight: 12}}>
            <MaterialCommunityIcons name="heart-outline" size={20} color="#333" />
          </Pressable>
          <Pressable style={styles.selectRoomBtn} onPress={() => router.push('/(hotels)/hotel-select-room')}>
            <Text style={{color: '#FFF', fontSize: 13, fontWeight: '800'}}>SELECT ROOM</Text>
          </Pressable>
        </View>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFF' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#FFF' },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  backBtn: { padding: 4, marginRight: 16 },
  headerTitle: { fontSize: 13, fontWeight: '900', color: '#333' },
  headerSubtitle: { fontSize: 10, color: '#8E8E93' },

  content: { flex: 1 },

  categoriesGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 16, paddingVertical: 16, gap: 8 },
  categoryPill: { borderWidth: 1, borderColor: '#E5E5EA', borderRadius: 4, paddingHorizontal: 12, paddingVertical: 6 },
  categoryPillActive: { borderColor: '#0084FF', backgroundColor: '#F5FAFF' },
  categoryText: { fontSize: 10, color: '#333' },
  categoryTextActive: { color: '#0084FF', fontWeight: '800' },

  divider: { height: 4, backgroundColor: '#F8FAFC', borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#E5E5EA' },

  section: { paddingHorizontal: 16, paddingVertical: 16 },
  sectionTitle: { fontSize: 16, fontWeight: '900', color: '#333', marginBottom: 16 },
  
  amenityRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  amenityText: { fontSize: 12, color: '#333', marginLeft: 12 },

  stickyFooter: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: '#E5E5EA', paddingHorizontal: 24, paddingTop: 16, paddingBottom: 32, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  selectRoomBtn: { backgroundColor: '#0084FF', paddingHorizontal: 24, paddingVertical: 14, borderRadius: 8 },
});
