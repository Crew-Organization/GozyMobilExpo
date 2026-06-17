import React, { useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, Pressable, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { useSuperAppStore } from '@/src/store/super-app-store';

const TABS = ['EVERYONE', 'GROUP', 'COUPLE', 'SOLO', 'BUSINESS', 'FAMILY'];

export default function HotelReviewScreen() {
  const insets = useSafeAreaInsets();
  const { selectedHotel } = useSuperAppStore();
  const [activeTab, setActiveTab] = useState('BUSINESS');

  if (!selectedHotel) return null;

  const formatCurrency = (val: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

  const ratingBars = [
    { label: 'Location', score: 3.3, percentage: '66%' },
    { label: 'Room Cleanliness', score: 3.2, percentage: '64%' },
    { label: 'Food', score: 3.2, percentage: '64%' },
    { label: 'Value For Money', score: 3.6, percentage: '72%' },
  ];

  return (
    <View style={styles.safeArea}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 16) }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#333" />
        </Pressable>
        <Text style={styles.headerTitle}>Ratings & Reviews</Text>
      </View>

      <View style={styles.tabsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {TABS.map(tab => (
            <Pressable key={tab} style={[styles.tabBtn, activeTab === tab && styles.tabBtnActive]} onPress={() => setActiveTab(tab)}>
              <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
              {activeTab === tab && <View style={styles.activeTabLine} />}
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
         
         <Text style={{fontSize: 16, fontWeight: '900', color: '#333', marginBottom: 16, paddingHorizontal: 16}}>
           Reviewed by {activeTab.charAt(0) + activeTab.slice(1).toLowerCase()} Travellers
         </Text>

         {/* Overview Card */}
         <View style={{flexDirection: 'row', paddingHorizontal: 16, marginBottom: 24}}>
           <View style={{backgroundColor: '#0084FF', borderRadius: 8, width: 80, height: 80, alignItems: 'center', justifyContent: 'center'}}>
             <Text style={{color: '#FFF', fontSize: 18, fontWeight: '900'}}>{selectedHotel.rating}</Text>
             <Text style={{color: '#FFF', fontSize: 10, fontWeight: '800'}}>{selectedHotel.ratingLabel}</Text>
           </View>
           
           <View style={{flex: 1, marginLeft: 16, justifyContent: 'center'}}>
             {['Excellent', 'Very Good', 'Average', 'Poor', 'Bad'].map((label, idx) => {
               const percentages = ['48%', '44%', '8%', '0%', '0%'];
               return (
                 <View key={label} style={{flexDirection: 'row', alignItems: 'center', marginBottom: 4}}>
                   <Text style={{fontSize: 9, color: '#8E8E93', width: 50}}>{label}</Text>
                   <View style={{flex: 1, height: 4, backgroundColor: '#E5E5EA', borderRadius: 2, marginHorizontal: 8}}>
                     <View style={{width: percentages[idx], height: '100%', backgroundColor: '#0084FF', borderRadius: 2}} />
                   </View>
                   <Text style={{fontSize: 9, color: '#8E8E93', width: 20}}>{percentages[idx]}</Text>
                 </View>
               );
             })}
           </View>
         </View>

         {/* Detailed Bars */}
         <View style={{flexDirection: 'row', paddingHorizontal: 16, justifyContent: 'space-between', marginBottom: 24}}>
           {ratingBars.map((bar, i) => (
             <View key={i} style={{alignItems: 'center'}}>
               <Text style={{fontSize: 13, fontWeight: '900', color: '#333', marginBottom: 4}}>{bar.score}</Text>
               <Text style={{fontSize: 10, color: '#8E8E93', textAlign: 'center'}}>{bar.label}</Text>
             </View>
           ))}
         </View>

         <View style={{height: 1, backgroundColor: '#E5E5EA', marginHorizontal: 16, marginBottom: 16}} />

         {/* Review Summary */}
         <View style={{paddingHorizontal: 16, marginBottom: 24}}>
           <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 12}}>
             <MaterialCommunityIcons name="star-four-points" size={16} color="#0084FF" />
             <Text style={{fontSize: 16, fontWeight: '900', color: '#333', marginLeft: 8}}>Review Summary</Text>
             <View style={{backgroundColor: '#E5F1FF', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, marginLeft: 8}}>
               <Text onPress={() => alert("Feature coming soon!")} style={{fontSize: 8, color: '#0084FF', fontWeight: '800'}}>Powered by Myra.AI</Text>
             </View>
           </View>
           
           {[
             'Cleanliness and professional staff are highly praised by business travelers, ensuring a pleasant stay.',
             'The property is conveniently located near restaurants and key business areas, making it ideal for work trips.',
             'Fast and reliable free Wi-Fi is a significant highlight, catering well to business needs.',
             'Many guests appreciated the spacious and comfortable rooms, suitable for longer stays.'
           ].map((point, idx) => (
             <View key={idx} style={{flexDirection: 'row', marginBottom: 8}}>
               <Text style={{fontSize: 13, color: '#333'}}>•</Text>
               <Text style={{fontSize: 10.5, color: '#333', marginLeft: 8, lineHeight: 16}}>{point}</Text>
             </View>
           ))}
           <Text onPress={() => alert("Feature coming soon!")} style={{color: '#0084FF', fontSize: 12, fontWeight: '800', marginTop: 4}}>Read More</Text>
         </View>

         {/* Filters */}
         <View style={{paddingHorizontal: 16, marginBottom: 24}}>
           <Text style={{fontSize: 12, color: '#8E8E93', marginBottom: 8}}>Filter reviews by :</Text>
           <View style={{flexDirection: 'row', flexWrap: 'wrap', gap: 8}}>
             {['Location', 'Room Cleanliness', 'Staff Courtesy', 'Value for Money', 'Room Amenities'].map(f => (
               <View key={f} style={{borderWidth: 1, borderColor: '#E5E5EA', borderRadius: 16, paddingHorizontal: 12, paddingVertical: 6}}>
                 <Text style={{fontSize: 10.5, color: '#333'}}>{f}</Text>
               </View>
             ))}
           </View>
         </View>

         {/* All Reviews */}
         <View style={{paddingHorizontal: 16, paddingBottom: 100}}>
           <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16}}>
             <Text style={{fontSize: 16, fontWeight: '900', color: '#333'}}>All {selectedHotel.reviewCount} Reviews</Text>
             <View style={{flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#E5E5EA', borderRadius: 16, paddingHorizontal: 12, paddingVertical: 4}}>
               <Text style={{fontSize: 10, color: '#8E8E93'}}>Latest First</Text>
               <MaterialCommunityIcons name="chevron-down" size={14} color="#8E8E93" style={{marginLeft: 4}} />
             </View>
           </View>

           <View style={{marginBottom: 24}}>
             <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8}}>
               <Text style={{fontSize: 13, fontWeight: '900', color: '#333'}}>excellent</Text>
               <View style={{borderWidth: 1, borderColor: '#0084FF', borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2}}>
                 <Text onPress={() => alert("Feature coming soon!")} style={{fontSize: 10, color: '#0084FF', fontWeight: '900'}}>5.0</Text>
               </View>
             </View>
             <Text style={{fontSize: 10, color: '#8E8E93', marginBottom: 8}}>Sandesh K • GROUP</Text>
             <Text style={{fontSize: 10.5, color: '#333', lineHeight: 16, marginBottom: 8}}>Best location in decent rooms... very supportive staff... Customer centricity at its peak... Well connected to city centre.</Text>
             <Text style={{fontSize: 10, color: '#333', fontWeight: '800'}}>Travel Month: <Text style={{fontWeight: '400'}}>Oct 2023</Text></Text>
             <Text style={{fontSize: 10, color: '#333', fontWeight: '800', marginTop: 2}}>Room: <Text style={{fontWeight: '400'}}>SUITE ROOM</Text></Text>
           </View>
         </View>

      </ScrollView>

      {/* Sticky Bottom Footer */}
      <View style={styles.stickyFooter}>
        <View>
          <Text style={{fontSize: 18, fontWeight: '900', color: '#FFF'}}>{formatCurrency(selectedHotel.price)}</Text>
          <Text style={{fontSize: 10, color: 'rgba(255,255,255,0.7)'}}>+ {formatCurrency(selectedHotel.taxes)} taxes & fees</Text>
          <Text style={{fontSize: 10, color: 'rgba(255,255,255,0.7)'}}>per night</Text>
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Pressable style={{width: 44, height: 44, borderRadius: 22, borderWidth: 1, borderColor: '#405B84', alignItems: 'center', justifyContent: 'center', marginRight: 12}}>
            <MaterialCommunityIcons name="heart-outline" size={20} color="#FFF" />
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
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#FFF' },
  backBtn: { padding: 4, marginRight: 16 },
  headerTitle: { fontSize: 16, fontWeight: '900', color: '#333' },

  tabsContainer: { borderBottomWidth: 1, borderBottomColor: '#E5E5EA', marginBottom: 16 },
  tabBtn: { paddingHorizontal: 16, paddingVertical: 12, position: 'relative' },
  tabBtnActive: {},
  tabText: { fontSize: 12, fontWeight: '800', color: '#8E8E93' },
  tabTextActive: { color: '#0084FF' },
  activeTabLine: { position: 'absolute', bottom: 0, left: 16, right: 16, height: 3, backgroundColor: '#0084FF', borderTopLeftRadius: 3, borderTopRightRadius: 3 },

  content: { flex: 1 },

  stickyFooter: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#172B4D', paddingHorizontal: 24, paddingTop: 16, paddingBottom: 32, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  selectRoomBtn: { backgroundColor: '#0084FF', paddingHorizontal: 24, paddingVertical: 14, borderRadius: 8 },
});
