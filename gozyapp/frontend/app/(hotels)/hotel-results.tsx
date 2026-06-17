import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Pressable, ScrollView, Modal, Dimensions, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';

import { useSuperAppStore } from '@/src/store/super-app-store';
import { mockHotels } from '@/src/lib/hotel-data';

const { width, height } = Dimensions.get('window');

export default function HotelResultsScreen() {
  const insets = useSafeAreaInsets();
  const { hotelSearch, setSelectedHotel } = useSuperAppStore();
  const [activeModal, setActiveModal] = useState<'sort' | 'filter' | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const formatCurrency = (val: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

  const checkIn = new Date(hotelSearch.checkInDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  const checkOut = new Date(hotelSearch.checkOutDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });

  if (isLoading) {
    return (
      <View style={[styles.safeArea, { justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFF' }]}>
        <Image source={{uri: 'https://cdn-icons-png.flaticon.com/512/2933/2933772.png'}} style={{width: 100, height: 100, marginBottom: 24}} contentFit="contain" />
        <Text style={{fontSize: 18, fontWeight: '900', color: '#333'}}>Loading your favourite Hotels</Text>
        <ActivityIndicator color="#0084FF" style={{marginTop: 16}} />
      </View>
    );
  }

  return (
    <View style={styles.safeArea}>
      
      {/* Search Header */}
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 16) }]}>
        <View style={styles.headerLeft}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <MaterialCommunityIcons name="arrow-left" size={24} color="#333" />
          </Pressable>
          <View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={styles.headerCity}>{hotelSearch.city}</Text>
              <MaterialCommunityIcons name="pencil-outline" size={14} color="#0084FF" style={{marginLeft: 8}} />
            </View>
            <Text style={styles.headerDetails}>{checkIn} - {checkOut}, {hotelSearch.rooms} room, {hotelSearch.guests} Guests</Text>
          </View>
        </View>
        <View style={styles.headerRight}>
          <MaterialCommunityIcons name="magnify" size={24} color="#0084FF" />
          <View style={{flexDirection: 'row', alignItems: 'center', marginLeft: 16}}>
            <Text onPress={() => alert("Feature coming soon!")} style={{fontSize: 12, fontWeight: '800', color: '#0084FF', marginRight: 2}}>INR</Text>
            <MaterialCommunityIcons name="chevron-down" size={16} color="#0084FF" />
          </View>
        </View>
      </View>

      {/* Sticky Filter Bar */}
      <View style={styles.filterBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{paddingHorizontal: 16, alignItems: 'center'}}>
          <Pressable style={styles.filterPill}>
            <MaterialCommunityIcons name="map-marker" size={16} color="#0084FF" />
            <Text style={styles.filterPillText}>Maps</Text>
          </Pressable>
          <Pressable style={styles.filterPill} onPress={() => setActiveModal('sort')}>
            <Text style={styles.filterPillText}>Sort By</Text>
            <MaterialCommunityIcons name="swap-vertical" size={16} color="#333" />
          </Pressable>
          <Pressable style={styles.filterPill} onPress={() => setActiveModal('filter')}>
            <Text style={styles.filterPillText}>All Filters</Text>
            <MaterialCommunityIcons name="tune" size={16} color="#333" />
          </Pressable>
          <Pressable style={styles.filterPill}>
            <MaterialCommunityIcons name="clock-fast" size={16} color="#D97706" />
            <Text style={styles.filterPillText}>Rush Deal</Text>
          </Pressable>
        </ScrollView>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Banner */}
        <View style={styles.promoBanner}>
           <LinearGradient colors={['#D0E6FF', '#E5F1FF']} style={StyleSheet.absoluteFillObject} />
           <Text style={{fontSize: 18, fontWeight: '900', color: '#E11D48', textAlign: 'center'}}>Limited Time Offer</Text>
           <Text style={{fontSize: 12, color: '#333', textAlign: 'center', marginTop: 4, marginHorizontal: 20}}>Upto <Text style={{fontWeight: '800'}}>40% off</Text> on 20,000+ properties. Book by 10th April to avail them!</Text>
           <Pressable style={{backgroundColor: '#FFF', borderWidth: 1, borderColor: '#333', borderRadius: 4, alignSelf: 'center', paddingHorizontal: 16, paddingVertical: 6, marginTop: 12}}>
             <Text style={{fontSize: 10, fontWeight: '800', color: '#333'}}>SEE PROPERTIES</Text>
           </Pressable>
        </View>

        <Text style={{fontSize: 16, fontWeight: '900', color: '#333', paddingHorizontal: 16, marginTop: 16, marginBottom: 12}}>Showing Properties in {hotelSearch.city}</Text>

        {/* Hotel Cards */}
        {mockHotels.map((hotel, index) => (
          <Pressable key={hotel.id} style={styles.hotelCard} onPress={() => {
            setSelectedHotel(hotel);
            router.push('/(hotels)/hotel-detail');
          }}>
             
             {/* Image Gallery Mock */}
             <View style={{position: 'relative'}}>
               <Image source={{uri: hotel.image}} style={{width: '100%', height: 200}} contentFit="cover" />
               <View style={{position: 'absolute', top: 12, right: 12, backgroundColor: 'rgba(0,0,0,0.5)', width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center'}}>
                 <MaterialCommunityIcons name="heart-outline" size={18} color="#FFF" />
               </View>
               <View style={{position: 'absolute', bottom: 12, alignSelf: 'center', flexDirection: 'row', gap: 6}}>
                 {[0,1,2,3].map(dot => <View key={dot} style={{width: dot===0 ? 8:6, height: dot===0 ? 8:6, borderRadius: 4, backgroundColor: dot===0 ? '#FFF' : 'rgba(255,255,255,0.5)'}} />)}
               </View>
             </View>

             <View style={{padding: 16}}>
                {/* Ratings & Tags */}
                <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8}}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <View style={{backgroundColor: '#0084FF', borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2}}>
                      <Text style={{color: '#FFF', fontSize: 12, fontWeight: '900'}}>{hotel.rating}</Text>
                    </View>
                    <Text onPress={() => alert("Feature coming soon!")} style={{color: '#0084FF', fontSize: 12, fontWeight: '800', marginLeft: 8}}>{hotel.ratingLabel}</Text>
                    <Text style={{color: '#8E8E93', fontSize: 10, marginLeft: 4}}>({hotel.reviewCount} Ratings)</Text>
                  </View>
                  {hotel.isSponsored && <Text style={{fontSize: 8, color: '#8E8E93', fontWeight: '800'}}>SPONSORED</Text>}
                </View>

                {/* Title & Stars */}
                <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 4}}>
                  <Text style={{fontSize: 16, fontWeight: '900', color: '#333', flexShrink: 1}}>{hotel.name}</Text>
                </View>
                <View style={{flexDirection: 'row', marginBottom: 8}}>
                  {Array.from({length: hotel.starRating || 3}).map((_, i) => <MaterialCommunityIcons key={i} name="star" size={12} color="#D97706" />)}
                </View>

                {/* Location */}
                <Text style={{fontSize: 10, color: '#8E8E93', marginBottom: 12}}>{hotel.location}</Text>

                {/* Price Section */}
                <View style={{alignItems: 'flex-end', position: 'absolute', right: 16, top: 56}}>
                  {hotel.originalPrice && <Text style={{fontSize: 10, color: '#8E8E93', textDecorationLine: 'line-through'}}>{formatCurrency(hotel.originalPrice)}</Text>}
                  <Text style={{fontSize: 18, fontWeight: '900', color: '#333'}}>{formatCurrency(hotel.price)}</Text>
                  <Text style={{fontSize: 10, color: '#8E8E93'}}>+ {formatCurrency(hotel.taxes)} taxes & fees</Text>
                  <Text style={{fontSize: 9, color: '#8E8E93', marginTop: 2}}>Per Night</Text>
                </View>

                {/* Perks */}
                {hotel.highlights && hotel.highlights.slice(0, 2).map((perk, i) => (
                  <View key={i} style={{flexDirection: 'row', alignItems: 'center', marginTop: 4}}>
                    <MaterialCommunityIcons name="check" size={14} color="#10B981" />
                    <Text style={{fontSize: 10.5, color: '#10B981', marginLeft: 4}}>{perk}</Text>
                  </View>
                ))}

             </View>
          </Pressable>
        ))}

        <View style={{height: 100}} />
      </ScrollView>

      {/* Floating Prompt Banner */}
      <View style={{position: 'absolute', bottom: 24, alignSelf: 'center', width: width - 32, backgroundColor: '#FFF', borderRadius: 24, paddingHorizontal: 16, paddingVertical: 12, shadowColor: '#0084FF', shadowOpacity: 0.3, shadowRadius: 10, shadowOffset: {width: 0, height: 4}, elevation: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 2, borderColor: '#0084FF'}}>
         <Text style={{fontSize: 12, color: '#333', flex: 1}}>Show me stays with steam and sauna facilities</Text>
         <View style={{width: 32, height: 32, borderRadius: 16, backgroundColor: '#E5F1FF', alignItems: 'center', justifyContent: 'center'}}>
           <MaterialCommunityIcons name="robot-outline" size={20} color="#0084FF" />
         </View>
      </View>

      {/* Sort By Modal / Bottom Sheet */}
      <Modal visible={activeModal === 'sort'} animationType="slide" transparent>
        <View style={styles.sheetBackdrop}>
          <View style={styles.sheetContent}>
            <View style={{flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#E5E5EA'}}>
              <Pressable onPress={() => setActiveModal(null)}><MaterialCommunityIcons name="close" size={24} color="#333" /></Pressable>
              <Text style={{fontSize: 16, fontWeight: '900', color: '#333', marginLeft: 16}}>Sort By</Text>
            </View>
            <View style={{padding: 16}}>
              {['Popularity', 'Price (Low to High)', 'Price (High to Low)', 'User Rating (Highest)', 'Lowest Price & Best Rated'].map((sort, index) => (
                <Pressable key={index} style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16}}>
                  <Text style={{fontSize: 13, color: '#333'}}>{sort}</Text>
                  <MaterialCommunityIcons name={index === 0 ? "radiobox-marked" : "radiobox-blank"} size={24} color={index === 0 ? "#0084FF" : "#8E8E93"} />
                </Pressable>
              ))}
            </View>
          </View>
        </View>
      </Modal>

      {/* Filters Modal / Bottom Sheet */}
      <Modal visible={activeModal === 'filter'} animationType="slide" transparent>
        <View style={styles.sheetBackdrop}>
          <View style={[styles.sheetContent, {height: '80%'}]}>
            <View style={{flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#E5E5EA'}}>
              <Pressable onPress={() => setActiveModal(null)}><MaterialCommunityIcons name="close" size={24} color="#333" /></Pressable>
              <Text style={{fontSize: 16, fontWeight: '900', color: '#333', marginLeft: 16}}>Filters</Text>
            </View>
            <View style={{flexDirection: 'row', flex: 1}}>
              {/* Left Sidebar */}
              <ScrollView style={{width: 120, backgroundColor: '#F8FAFC', borderRightWidth: 1, borderRightColor: '#E5E5EA'}}>
                 {['Price', 'Star Rating', 'User Rating', 'Meal Options', 'Property Type', 'Suggested For You', 'Location & Landmarks'].map((filter, idx) => (
                   <View key={idx} style={{padding: 16, borderLeftWidth: idx === 0 ? 4 : 0, borderLeftColor: '#0084FF', backgroundColor: idx === 0 ? '#FFF' : 'transparent'}}>
                     <Text onPress={() => alert("Feature coming soon!")} style={{fontSize: 12, fontWeight: idx === 0 ? '900' : '500', color: idx === 0 ? '#0084FF' : '#333'}}>{filter}</Text>
                   </View>
                 ))}
              </ScrollView>
              {/* Right Content */}
              <ScrollView style={{flex: 1, padding: 16}}>
                 <Text style={{fontSize: 13, fontWeight: '800', color: '#333', marginBottom: 16}}>Price Per Night</Text>
                 <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24}}>
                   <View style={{borderWidth: 1, borderColor: '#E5E5EA', borderRadius: 8, padding: 8, width: '45%'}}>
                     <Text style={{fontSize: 10, color: '#8E8E93'}}>Minimum</Text>
                     <Text style={{fontSize: 13, fontWeight: '800', color: '#333'}}>₹ 0</Text>
                   </View>
                   <View style={{borderWidth: 1, borderColor: '#E5E5EA', borderRadius: 8, padding: 8, width: '45%'}}>
                     <Text style={{fontSize: 10, color: '#8E8E93'}}>Maximum</Text>
                     <Text style={{fontSize: 13, fontWeight: '800', color: '#333'}}>₹ 30,000+</Text>
                   </View>
                 </View>
                 
                 {/* Mock Histogram */}
                 <View style={{height: 100, alignItems: 'center', justifyContent: 'flex-end', marginBottom: 24}}>
                    <View style={{width: '100%', height: 2, backgroundColor: '#0084FF', position: 'absolute', bottom: 10}} />
                    <View style={{flexDirection: 'row', alignItems: 'flex-end', height: 80, width: '80%', gap: 4, paddingBottom: 12}}>
                      {[10,20,50,80,60,40,30,20,10,5].map((h,i) => <View key={i} style={{width: 10, height: h, backgroundColor: '#0084FF', borderTopLeftRadius: 2, borderTopRightRadius: 2}} />)}
                    </View>
                    {/* Mock Knobs */}
                    <View style={{width: 20, height: 20, borderRadius: 10, backgroundColor: '#FFF', borderWidth: 2, borderColor: '#0084FF', position: 'absolute', bottom: 0, left: '10%'}} />
                    <View style={{width: 20, height: 20, borderRadius: 10, backgroundColor: '#FFF', borderWidth: 2, borderColor: '#0084FF', position: 'absolute', bottom: 0, right: '10%'}} />
                 </View>

                 {/* Price buckets */}
                 {[{range: '₹ 0 - ₹ 2000', count: 616}, {range: '₹ 2000 - ₹ 4500', count: 513}, {range: '₹ 4500 - ₹ 7000', count: 122}, {range: '₹ 7000 - ₹ 10000', count: 38}].map((bucket, i) => (
                   <View key={i} style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16}}>
                     <View style={{flexDirection: 'row', alignItems: 'center'}}>
                       <MaterialCommunityIcons name="checkbox-blank-outline" size={20} color="#8E8E93" />
                       <Text style={{fontSize: 13, color: '#333', marginLeft: 12}}>{bucket.range}</Text>
                     </View>
                     <Text style={{fontSize: 12, color: '#8E8E93'}}>{bucket.count}</Text>
                   </View>
                 ))}
              </ScrollView>
            </View>
            <View style={{padding: 16, borderTopWidth: 1, borderTopColor: '#E5E5EA', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
               <Text style={{fontSize: 13, fontWeight: '800', color: '#8E8E93'}}>Reset</Text>
               <Pressable style={{backgroundColor: '#E5E5EA', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8}} onPress={() => setActiveModal(null)}>
                 <Text style={{color: '#8E8E93', fontSize: 13, fontWeight: '800'}}>VIEW PROPERTIES</Text>
               </Pressable>
            </View>
          </View>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { backgroundColor: '#FFF', paddingHorizontal: 16, paddingVertical: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', zIndex: 10 },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  backBtn: { marginRight: 16 },
  headerCity: { fontSize: 16, fontWeight: '900', color: '#333' },
  headerDetails: { fontSize: 10, color: '#8E8E93', marginTop: 2 },
  headerRight: { flexDirection: 'row', alignItems: 'center' },

  filterBar: { backgroundColor: '#FFF', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#E5E5EA', zIndex: 10 },
  filterPill: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#E5E5EA', borderRadius: 16, paddingHorizontal: 12, paddingVertical: 6, marginRight: 8, backgroundColor: '#FFF' },
  filterPillText: { fontSize: 10.5, fontWeight: '800', color: '#333', marginHorizontal: 4 },

  content: { flex: 1 },
  promoBanner: { marginHorizontal: 16, marginTop: 16, borderRadius: 8, overflow: 'hidden', padding: 16 },

  hotelCard: { backgroundColor: '#FFF', marginHorizontal: 16, marginBottom: 16, borderRadius: 12, overflow: 'hidden', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, elevation: 3 },
  
  sheetBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  sheetContent: { backgroundColor: '#FFF', borderTopLeftRadius: 20, borderTopRightRadius: 20, overflow: 'hidden' },
});
