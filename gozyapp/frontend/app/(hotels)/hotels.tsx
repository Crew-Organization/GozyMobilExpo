import React, { useState } from 'react';
import { StyleSheet, Text, View, Pressable, ScrollView, Modal, Dimensions, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useSuperAppStore } from '@/src/store/super-app-store';
import { colors, radius, spacing } from '@/src/theme/tokens';

const { width } = Dimensions.get('window');

const getaways = [
  { id: 1, title: 'Games and Fun', img: 'https://images.unsplash.com/photo-1511882150382-421056c89033?w=400&q=80' },
  { id: 2, title: 'Spa Serenity', img: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&q=80' },
  { id: 3, title: 'Steam Relaxation', img: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400&q=80' },
  { id: 4, title: 'Sky High Escape', img: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=400&q=80' },
  { id: 5, title: 'Private Pool Villas', img: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&q=80' },
  { id: 6, title: 'Nature Retreats', img: 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=400&q=80' },
];

export default function HotelsScreen() {
  const { hotelSearch } = useSuperAppStore();
  const [activeTab, setActiveTab] = useState<'rooms' | 'hourly'>('rooms');

  const insets = useSafeAreaInsets();
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = () => {
    setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
      router.push('/(hotels)/hotel-results');
    }, 1000);
  };

  return (
    <View style={styles.safeArea}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 16) }]}>
        <Pressable onPress={() => router.back()} hitSlop={12} style={styles.backBtn}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#0F172A" />
        </Pressable>
        <Text style={styles.headerTitle}>Hotels Search</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom: 40}}>
        
        {/* Toggle Tabs */}
        <View style={styles.tabsContainer}>
          <Pressable style={[styles.tabBtn, activeTab === 'rooms' && styles.tabBtnActive]} onPress={() => setActiveTab('rooms')}>
            <Text style={[styles.tabText, activeTab === 'rooms' && styles.tabTextActive]}>Upto 4 Rooms</Text>
          </Pressable>
          <Pressable style={[styles.tabBtn, activeTab === 'hourly' && styles.tabBtnActive]} onPress={() => setActiveTab('hourly')}>
            <Text style={[styles.tabText, activeTab === 'hourly' && styles.tabTextActive]}>Hourly Stays</Text>
          </Pressable>
        </View>

        {activeTab === 'hourly' && (
          <View style={styles.hourlyBanner}>
            <MaterialCommunityIcons name="clock-fast" size={24} color="#D97706" />
            <View style={{marginLeft: 12, flex: 1}}>
              <Text style={{fontSize: 13, fontWeight: '800', color: '#333'}}>Introducing Hourly Stays</Text>
              <Text style={{fontSize: 10.5, color: '#333', marginTop: 2}}>Book rooms on hourly basis at your preferred check-in time and save up to 60%!</Text>
            </View>
          </View>
        )}

        {/* Search Widget */}
        <View style={styles.searchWidget}>
           {/* Location */}
           <View style={styles.searchRow}>
             <MaterialCommunityIcons name="magnify" size={20} color="#8E8E93" />
             <View style={{marginLeft: 12, flex: 1}}>
               <Text style={{fontSize: 16, fontWeight: '900', color: '#333'}}>{hotelSearch.city}</Text>
               <Text style={{fontSize: 10, color: '#8E8E93'}}>India</Text>
             </View>
             <Pressable style={styles.nearMeBtn}>
               <MaterialCommunityIcons name="crosshairs-gps" size={14} color="#8E8E93" />
               <Text style={{fontSize: 10, fontWeight: '800', color: '#8E8E93', marginLeft: 4}}>Near Me</Text>
             </Pressable>
           </View>

           {/* Dates */}
           {activeTab === 'rooms' ? (
             <View style={styles.searchRow}>
               <MaterialCommunityIcons name="calendar-month-outline" size={20} color="#8E8E93" />
               <View style={{marginLeft: 12, flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                 <Text style={{fontSize: 13, fontWeight: '900', color: '#333'}}>
                   {new Date(hotelSearch.checkInDate).toLocaleDateString('en-IN', {day: 'numeric', month: 'short'})} <Text style={{fontSize: 10, fontWeight: '400', color: '#8E8E93'}}>{`'${new Date(hotelSearch.checkInDate).getFullYear().toString().slice(-2)}, ${new Date(hotelSearch.checkInDate).toLocaleDateString('en-IN', {weekday: 'short'})}`}</Text>
                 </Text>
                 <View style={styles.nightBadge}><Text style={{fontSize: 8, fontWeight: '900', color: '#8E8E93'}}>1 NIGHT</Text></View>
                 <Text style={{fontSize: 13, fontWeight: '900', color: '#333'}}>
                   {new Date(hotelSearch.checkOutDate).toLocaleDateString('en-IN', {day: 'numeric', month: 'short'})} <Text style={{fontSize: 10, fontWeight: '400', color: '#8E8E93'}}>{`'${new Date(hotelSearch.checkOutDate).getFullYear().toString().slice(-2)}, ${new Date(hotelSearch.checkOutDate).toLocaleDateString('en-IN', {weekday: 'short'})}`}</Text>
                 </Text>
               </View>
             </View>
           ) : (
             <View style={styles.searchRow}>
               <MaterialCommunityIcons name="calendar-month-outline" size={20} color="#8E8E93" />
               <View style={{marginLeft: 12, flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                 <Text style={{fontSize: 13, fontWeight: '900', color: '#333'}}>
                   {new Date(hotelSearch.checkInDate).toLocaleDateString('en-IN', {day: 'numeric', month: 'short'})} <Text style={{fontSize: 10, fontWeight: '400', color: '#8E8E93'}}>{`'${new Date(hotelSearch.checkInDate).getFullYear().toString().slice(-2)}, ${new Date(hotelSearch.checkInDate).toLocaleDateString('en-IN', {weekday: 'short'})}`}</Text>
                 </Text>
                 <View style={{flexDirection: 'row', gap: 8}}>
                   <Pressable style={{borderWidth: 1, borderColor: '#0084FF', borderRadius: 4, paddingHorizontal: 8, paddingVertical: 4}}><Text onPress={() => alert("Feature coming soon!")} style={{fontSize: 10, color: '#0084FF', fontWeight: '800'}}>Today</Text></Pressable>
                   <Pressable style={{borderWidth: 1, borderColor: '#E5E5EA', borderRadius: 4, paddingHorizontal: 8, paddingVertical: 4}}><Text style={{fontSize: 10, color: '#8E8E93', fontWeight: '800'}}>Tomorrow</Text></Pressable>
                 </View>
               </View>
             </View>
           )}

           {/* Guests / Time */}
           <View style={{flexDirection: 'row', gap: 12}}>
             {activeTab === 'hourly' && (
               <View style={[styles.searchRow, {flex: 1}]}>
                 <MaterialCommunityIcons name="clock-outline" size={20} color="#8E8E93" />
                 <Text style={{fontSize: 13, fontWeight: '900', color: '#333', marginLeft: 12}}>08:00 AM</Text>
               </View>
             )}
             <View style={[styles.searchRow, {flex: activeTab === 'hourly' ? 1 : undefined, width: activeTab === 'rooms' ? '100%' : undefined}]}>
               <MaterialCommunityIcons name="account-outline" size={20} color="#8E8E93" />
               <Text style={{fontSize: 13, fontWeight: '900', color: '#333', marginLeft: 12}} numberOfLines={1}>
                 {activeTab === 'rooms' ? `${hotelSearch.rooms} Room, ${hotelSearch.guests} Adults & 0 Children` : `${hotelSearch.rooms} Room, ${hotelSearch.guests} Adults`}
               </Text>
             </View>
           </View>

           <Pressable style={styles.searchActionBtn} onPress={handleSearch} disabled={isSearching}>
             {isSearching ? (
               <ActivityIndicator color="#FFF" />
             ) : (
               <Text style={styles.searchActionText}>SEARCH</Text>
             )}
           </Pressable>
        </View>

        {/* Small Ad Banners */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{paddingHorizontal: 16, paddingBottom: 24, gap: 12}}>
           <Image source={{uri: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80'}} style={{width: 280, height: 80, borderRadius: 8}} contentFit="cover" />
           <Image source={{uri: 'https://images.unsplash.com/photo-1542314831-c6a4d1409341?w=400&q=80'}} style={{width: 280, height: 80, borderRadius: 8}} contentFit="cover" />
        </ScrollView>

        {/* NEARBY GETAWAYS */}
        <View style={{backgroundColor: '#FFFBEB', paddingVertical: 24}}>
           <View style={{alignItems: 'center', marginBottom: 16}}>
             <Text style={{fontSize: 16, fontWeight: '900', color: '#333', letterSpacing: 2}}>✦ NEARBY GETAWAYS ✦</Text>
             <Text style={{fontSize: 10, color: '#8E8E93', textAlign: 'center', marginTop: 4, width: '70%'}}>Discover the most unique and vibrant stays specially curated for you around Hyderabad!</Text>
           </View>
           
           <View style={styles.getawayGrid}>
             {getaways.map((g, index) => (
               <Pressable key={g.id} style={[styles.getawayItem, { width: (width - 48) / 2 }]}>
                 <Image source={{uri: g.img}} style={{width: '100%', height: 120, borderRadius: 12}} contentFit="cover" />
                 <View style={{position: 'absolute', bottom: 0, left: 0, right: 0, height: 40, backgroundColor: 'rgba(0,0,0,0.5)', borderBottomLeftRadius: 12, borderBottomRightRadius: 12, justifyContent: 'center', paddingHorizontal: 8}}>
                   <Text style={{color: '#FFF', fontSize: 10, fontWeight: '800'}} numberOfLines={1}>{g.title}</Text>
                 </View>
               </Pressable>
             ))}
           </View>
           
           <Pressable style={{alignItems: 'flex-end', paddingHorizontal: 16, marginTop: 12}} onPress={handleSearch}>
             <Text onPress={() => alert("Feature coming soon!")} style={{color: '#0084FF', fontSize: 12, fontWeight: '800'}}>View All ❯</Text>
           </Pressable>
        </View>

        {/* OFFERS */}
        <View style={{padding: 16}}>
           <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16}}>
             <Text style={{fontSize: 18, fontWeight: '900', color: '#333'}}>Offers</Text>
             <Pressable onPress={handleSearch}>
               <Text onPress={() => alert("Feature coming soon!")} style={{color: '#0084FF', fontSize: 12, fontWeight: '800'}}>View All ❯</Text>
             </Pressable>
           </View>
           <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{gap: 16}}>
              <Image source={{uri: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600&q=80'}} style={{width: 300, height: 150, borderRadius: 12}} contentFit="cover" />
              <Image source={{uri: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&q=80'}} style={{width: 300, height: 150, borderRadius: 12}} contentFit="cover" />
           </ScrollView>
        </View>

        {/* MMT Luxe */}
        <View style={{padding: 16, paddingBottom: 40}}>
           <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4}}>
             <Text style={{fontSize: 18, fontWeight: '900', color: '#333'}}>MMT Luxe - Super Packages</Text>
             <Pressable onPress={handleSearch}>
               <Text onPress={() => alert("Feature coming soon!")} style={{color: '#0084FF', fontSize: 12, fontWeight: '800'}}>View All ❯</Text>
             </Pressable>
           </View>
           <Text style={{fontSize: 10.5, color: '#8E8E93', marginBottom: 16}}>Lavish stays with world-class amenities & experiences</Text>
           
           <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{gap: 16}}>
              <View style={styles.luxeCard}>
                <Image source={{uri: 'https://images.unsplash.com/photo-1542314831-c6a4d1409341?w=400&q=80'}} style={{width: '100%', height: 140}} contentFit="cover" />
                <View style={{padding: 12}}>
                  <Text style={{fontSize: 13, fontWeight: '800', color: '#333', marginBottom: 4}}>The Leela Hyderabad Banjara...</Text>
                  <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 4}}>
                    <Text style={{fontSize: 10, color: '#8E8E93'}}>Sri Nagar Colony, Hyderabad</Text>
                  </View>
                  <Text style={{fontSize: 16, fontWeight: '900', color: '#333', textAlign: 'right'}}>₹ 24,500</Text>
                  <Text style={{fontSize: 9, color: '#8E8E93', textAlign: 'right', marginBottom: 12}}>Per Night</Text>
                  <Text style={{fontSize: 10, color: '#333'}}>• Complimentary Hi-Tea</Text>
                  <Text style={{fontSize: 10, color: '#333'}}>• Complimentary Two-way Airport Transfer</Text>
                </View>
              </View>

              <View style={styles.luxeCard}>
                <Image source={{uri: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80'}} style={{width: '100%', height: 140}} contentFit="cover" />
                <View style={{padding: 12}}>
                  <Text style={{fontSize: 13, fontWeight: '800', color: '#333', marginBottom: 4}}>ITC Kohenur - A Luxury Collectio...</Text>
                  <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 4}}>
                    <Text style={{fontSize: 10, color: '#8E8E93'}}>Madhapur, Hyderabad</Text>
                  </View>
                  <Text style={{fontSize: 16, fontWeight: '900', color: '#333', textAlign: 'right'}}>₹ 18,900</Text>
                  <Text style={{fontSize: 9, color: '#8E8E93', textAlign: 'right', marginBottom: 12}}>Per Night</Text>
                  <Text style={{fontSize: 10, color: '#333'}}>• 20% discount on F&B</Text>
                  <Text style={{fontSize: 10, color: '#333'}}>• 20% discount on Salon services</Text>
                </View>
              </View>
           </ScrollView>
        </View>

      </ScrollView>

      {/* Floating AI Button */}
      <Pressable style={styles.floatingAiBtn} onPress={() => router.push('/assistant')}>
        <View style={styles.aiGlow}>
          <MaterialCommunityIcons name="robot-outline" size={24} color="#FFF" />
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
  },

  tabsContainer: { flexDirection: 'row', paddingHorizontal: 16, marginBottom: 16, gap: 12 },
  tabBtn: { flex: 1, paddingVertical: 12, borderWidth: 1, borderColor: '#E5E5EA', borderRadius: 8, alignItems: 'center' },
  tabBtnActive: { borderColor: '#0084FF', backgroundColor: '#F5FAFF' },
  tabText: { fontSize: 12, fontWeight: '800', color: '#8E8E93' },
  tabTextActive: { color: '#0084FF' },

  hourlyBanner: { marginHorizontal: 16, backgroundColor: '#FFFBEB', borderRadius: 8, padding: 12, flexDirection: 'row', alignItems: 'center', marginBottom: 16 },

  searchWidget: { paddingHorizontal: 16, gap: 12, marginBottom: 24 },
  searchRow: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#E5E5EA', borderRadius: 8, padding: 12, backgroundColor: '#FFF' },
  nearMeBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F2F4F7', paddingHorizontal: 8, paddingVertical: 6, borderRadius: 12 },
  nightBadge: { backgroundColor: '#F2F4F7', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },

  searchActionBtn: { backgroundColor: '#0084FF', borderRadius: 8, paddingVertical: 14, alignItems: 'center', marginTop: 4 },
  searchActionText: { color: '#FFF', fontSize: 13, fontWeight: '800' },

  getawayGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 16, gap: 16, justifyContent: 'space-between' },
  getawayItem: { marginBottom: 4 },

  luxeCard: { width: 260, borderRadius: 12, borderWidth: 1, borderColor: '#E5E5EA', overflow: 'hidden', backgroundColor: '#FFF' },

  floatingAiBtn: { position: 'absolute', bottom: 20, right: 20, shadowColor: '#0084FF', shadowOpacity: 0.5, shadowRadius: 10, shadowOffset: {width: 0, height: 4}, elevation: 8 },
  aiGlow: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#0084FF', alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: '#D0E6FF' },
});
