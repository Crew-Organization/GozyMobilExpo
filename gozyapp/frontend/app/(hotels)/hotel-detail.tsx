import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, Pressable, ScrollView, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';

import { useSuperAppStore } from '@/src/store/super-app-store';

const { width } = Dimensions.get('window');

export default function HotelDetailScreen() {
  const insets = useSafeAreaInsets();
  const { selectedHotel, hotelSearch } = useSuperAppStore();

  if (!selectedHotel) return null;

  const formatCurrency = (val: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

  const checkIn = new Date(hotelSearch.checkInDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  const checkOut = new Date(hotelSearch.checkOutDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  const checkInTime = selectedHotel.rules?.checkInTime || '12:00 PM';
  const checkOutTime = selectedHotel.rules?.checkOutTime || '11:00 AM';

  return (
    <View style={styles.safeArea}>
      
      {/* Header */}
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 16) }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#333" />
        </Pressable>
        <View style={styles.headerRight}>
          <MaterialCommunityIcons name="share-variant-outline" size={24} color="#333" />
          <MaterialCommunityIcons name="heart-outline" size={24} color="#333" style={{marginLeft: 16}} />
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Image Grid */}
        <View style={styles.imageGrid}>
          <Image source={{uri: selectedHotel.images?.[0] || selectedHotel.image}} style={styles.mainImage} contentFit="cover" />
          <View style={styles.sideImages}>
             <Image source={{uri: selectedHotel.images?.[1] || selectedHotel.image}} style={styles.sideImageTop} contentFit="cover" />
             <Pressable style={styles.sideImageBottomContainer}>
               <Image source={{uri: selectedHotel.images?.[2] || selectedHotel.image}} style={styles.sideImageBottom} contentFit="cover" />
               <View style={styles.morePhotosOverlay}>
                 <Text style={{color: '#FFF', fontSize: 16, fontWeight: '900'}}>+{Math.max((selectedHotel.images?.length || 0) - 3, 269)}</Text>
                 <Text style={{color: '#FFF', fontSize: 10, fontWeight: '800', textAlign: 'center'}}>Property & Guest Photos</Text>
               </View>
             </Pressable>
          </View>
        </View>

        <View style={{padding: 16}}>
           {/* Title & Rating */}
           <View style={{flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12}}>
             <View style={{flex: 1}}>
               <Text style={{fontSize: 22, fontWeight: '900', color: '#333'}}>{selectedHotel.name}</Text>
               <View style={{flexDirection: 'row', marginTop: 4}}>
                 {Array.from({length: selectedHotel.starRating || 3}).map((_, i) => <MaterialCommunityIcons key={i} name="star" size={12} color="#D97706" />)}
               </View>
             </View>
           </View>

           <Pressable style={styles.rowBtn} onPress={() => router.push('/(hotels)/hotel-review')}>
             <View style={{backgroundColor: '#0084FF', borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2}}>
               <Text style={{color: '#FFF', fontSize: 12, fontWeight: '900'}}>{selectedHotel.rating}</Text>
             </View>
             <Text onPress={() => alert("Feature coming soon!")} style={{color: '#0084FF', fontSize: 12, fontWeight: '800', marginLeft: 8}}>{selectedHotel.ratingLabel} <Text style={{color: '#8E8E93', fontWeight: '500'}}>({selectedHotel.reviewCount} Ratings)</Text></Text>
             <MaterialCommunityIcons name="chevron-right" size={20} color="#0084FF" style={{marginLeft: 'auto'}} />
           </Pressable>

           <Pressable style={styles.rowBtn} onPress={() => router.push('/(hotels)/hotel-map')}>
             <MaterialCommunityIcons name="map-marker-outline" size={20} color="#8E8E93" />
             <View style={{marginLeft: 8, flex: 1}}>
               <Text style={{color: '#333', fontSize: 12, fontWeight: '800'}}>{selectedHotel.location}, {hotelSearch.city}</Text>
               {selectedHotel.highlights?.[2] && <Text style={{color: '#8E8E93', fontSize: 10}}>{selectedHotel.highlights[2]}</Text>}
             </View>
             <MaterialCommunityIcons name="chevron-right" size={20} color="#0084FF" />
           </Pressable>

           <View style={styles.divider} />

           {/* Travel Dates & Guests */}
           <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12}}>
             <Text style={{fontSize: 16, fontWeight: '900', color: '#333'}}>Travel Dates & Guests</Text>
             <MaterialCommunityIcons name="pencil-outline" size={16} color="#0084FF" />
           </View>
           <Text style={{fontSize: 10, color: '#8E8E93', marginBottom: 16}}>Check-in: {checkInTime} • Check-out: {checkOutTime}</Text>
           <View style={{flexDirection: 'row', gap: 12}}>
             <View style={styles.datePill}>
               <MaterialCommunityIcons name="calendar-month-outline" size={16} color="#0084FF" />
               <Text onPress={() => alert("Feature coming soon!")} style={{fontSize: 12, fontWeight: '800', color: '#0084FF', marginLeft: 8}}>{checkIn} - {checkOut}</Text>
             </View>
             <View style={styles.datePill}>
               <MaterialCommunityIcons name="account-outline" size={16} color="#0084FF" />
               <Text onPress={() => alert("Feature coming soon!")} style={{fontSize: 12, fontWeight: '800', color: '#0084FF', marginLeft: 8}}>{hotelSearch.guests} Guests, {hotelSearch.rooms} room</Text>
             </View>
           </View>

           <View style={styles.divider} />

           {/* Price Alert powered by Myra.AI */}
           <View style={{backgroundColor: '#F5FAFF', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#D0E6FF'}}>
             <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 8}}>
               <View style={{backgroundColor: '#0084FF', width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center'}}>
                 <MaterialCommunityIcons name="robot-outline" size={14} color="#FFF" />
               </View>
               <View style={{marginLeft: 8}}>
                 <Text onPress={() => alert("Feature coming soon!")} style={{fontSize: 12, fontWeight: '900', color: '#0084FF'}}>Price Alert</Text>
                 <Text style={{fontSize: 10, color: '#8E8E93'}}>Powered by Myra.AI</Text>
               </View>
             </View>
             <Text style={{fontSize: 13, fontWeight: '900', color: '#333', marginBottom: 4}}>Price is <Text style={{color: '#10B981'}}>9% lower</Text> than usual</Text>
             <Text style={{fontSize: 10, color: '#8E8E93', lineHeight: 14}}>Prices are down by ₹172 compared to the average price of the last 3 days. Book now to get this deal!</Text>
           </View>

           <View style={styles.divider} />

           {/* About This Property */}
           <Text style={{fontSize: 16, fontWeight: '900', color: '#333', marginBottom: 12}}>About This Property</Text>
           <Pressable style={{flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#E5E5EA', marginBottom: 12}}>
             <View style={{backgroundColor: '#0084FF', width: 20, height: 20, borderRadius: 10, alignItems: 'center', justifyContent: 'center'}}>
               <MaterialCommunityIcons name="robot-outline" size={12} color="#FFF" />
             </View>
             <Text onPress={() => alert("Feature coming soon!")} style={{fontSize: 12, color: '#0084FF', fontWeight: '800', marginLeft: 8, flex: 1}}>What are property highlights?</Text>
             <MaterialCommunityIcons name="chevron-right" size={20} color="#0084FF" />
           </Pressable>
           <Text style={{fontSize: 12, color: '#8E8E93', lineHeight: 18}} numberOfLines={3}>
             {selectedHotel.description}
           </Text>
           <Text onPress={() => alert("Feature coming soon!")} style={{fontSize: 12, fontWeight: '800', color: '#0084FF', marginTop: 8}}>View All</Text>

           <View style={styles.divider} />

           {/* Amenities */}
           <Text style={{fontSize: 16, fontWeight: '900', color: '#333', marginBottom: 16}}>Amenities for Couples</Text>
           <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 8, marginBottom: 16}}>
             <View style={{alignItems: 'center'}}>
               <MaterialCommunityIcons name="silverware-fork-knife" size={24} color="#333" />
               <Text style={{fontSize: 10, color: '#8E8E93', marginTop: 4}}>Restaurant</Text>
             </View>
             <View style={{alignItems: 'center'}}>
               <MaterialCommunityIcons name="controller-classic" size={24} color="#333" />
               <Text style={{fontSize: 10, color: '#8E8E93', marginTop: 4}}>Indoor Games</Text>
             </View>
             <View style={{alignItems: 'center'}}>
               <MaterialCommunityIcons name="smoke-detector" size={24} color="#333" />
               <Text style={{fontSize: 10, color: '#8E8E93', marginTop: 4}}>Smoke Detector</Text>
             </View>
           </View>
           <Pressable onPress={() => router.push('/(hotels)/hotel-amenities')}>
             <Text onPress={() => alert("Feature coming soon!")} style={{fontSize: 12, fontWeight: '800', color: '#0084FF'}}>See All</Text>
           </Pressable>

           <View style={styles.divider} />

           {/* Guest Photos */}
           <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12}}>
             <Text style={{fontSize: 16, fontWeight: '900', color: '#333'}}>Guest Photos</Text>
           </View>
           <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{gap: 8, paddingBottom: 16}}>
             <Image source={{uri: 'https://images.unsplash.com/photo-1542314831-c6a4d1409341?w=400&q=80'}} style={{width: 80, height: 80, borderRadius: 8}} contentFit="cover" />
             <Image source={{uri: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80'}} style={{width: 80, height: 80, borderRadius: 8}} contentFit="cover" />
             <Image source={{uri: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=400&q=80'}} style={{width: 80, height: 80, borderRadius: 8}} contentFit="cover" />
             <View style={{width: 80, height: 80, borderRadius: 8, backgroundColor: 'rgba(0,0,0,0.6)', alignItems: 'center', justifyContent: 'center'}}>
               <Text style={{color: '#FFF', fontSize: 13, fontWeight: '900'}}>+223</Text>
               <Text style={{color: '#FFF', fontSize: 10, textAlign: 'center'}}>Guest Photos</Text>
             </View>
           </ScrollView>

           <View style={styles.divider} />

           {/* Guest Reviews */}
           <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16}}>
             <Text style={{fontSize: 16, fontWeight: '900', color: '#333'}}>Guest Reviews</Text>
           </View>
           
           <View style={{marginBottom: 16}}>
             <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start'}}>
               <View style={{flex: 1, paddingRight: 16}}>
                 <Text style={{fontSize: 12, fontWeight: '900', color: '#333', marginBottom: 4}}>Excellent Stay</Text>
                 <Text style={{fontSize: 10, color: '#8E8E93', marginBottom: 8}}>Bhibas B • Solo • Apr 04, 2026</Text>
               </View>
               <View style={{borderWidth: 1, borderColor: '#0084FF', borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2}}>
                 <Text onPress={() => alert("Feature coming soon!")} style={{fontSize: 10, color: '#0084FF', fontWeight: '900'}}>5.0</Text>
               </View>
             </View>
             <Text style={{fontSize: 10.5, color: '#333', lineHeight: 16}}>It was a nice experience with kove stay, Stuff behaviour and hospitality was good, rooms were clean, surely a budget friendly stay at Hyderabad.</Text>
           </View>

           <View style={{marginBottom: 16}}>
             <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start'}}>
               <View style={{flex: 1, paddingRight: 16}}>
                 <Text style={{fontSize: 12, fontWeight: '900', color: '#333', marginBottom: 4}}>Clean rooms, welcoming and value for money sta</Text>
                 <Text style={{fontSize: 10, color: '#8E8E93', marginBottom: 8}}>Monish M • Couple • Mar 31, 2026</Text>
               </View>
               <View style={{borderWidth: 1, borderColor: '#0084FF', borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2}}>
                 <Text onPress={() => alert("Feature coming soon!")} style={{fontSize: 10, color: '#0084FF', fontWeight: '900'}}>4.0</Text>
               </View>
             </View>
             <Text style={{fontSize: 10.5, color: '#333', lineHeight: 16}}>The stay was good for the price. The location is good, there are some food places nearby and the hotel was welcoming, only issue is a bit small.</Text>
           </View>
           
           <Pressable onPress={() => router.push('/(hotels)/hotel-review')}>
             <Text onPress={() => alert("Feature coming soon!")} style={{fontSize: 12, fontWeight: '800', color: '#0084FF'}}>Read All {selectedHotel.reviewCount} Reviews</Text>
           </Pressable>

           <View style={styles.divider} />

           {/* Restaurants */}
           <Text style={{fontSize: 16, fontWeight: '900', color: '#333', marginBottom: 12}}>Restaurants</Text>
           <View style={{flexDirection: 'row', marginBottom: 8}}>
             <Text style={{fontSize: 13, color: '#333'}}>•</Text>
             <Text style={{fontSize: 12, color: '#333', marginLeft: 8}}>There is one on site restaurant.</Text>
           </View>
           <View style={{flexDirection: 'row', marginBottom: 16}}>
             <Text style={{fontSize: 13, color: '#333'}}>•</Text>
             <Text style={{fontSize: 12, color: '#333', marginLeft: 8}}>Location is serviceable by Blinkit, Instamart and Swiggy</Text>
           </View>

           <View style={{flexDirection: 'row', gap: 12, marginBottom: 16}}>
             <View style={{width: 120, height: 80, borderRadius: 8, overflow: 'hidden'}}>
               <Image source={{uri: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&q=80'}} style={StyleSheet.absoluteFillObject} contentFit="cover" />
               <View style={{position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.5)', padding: 4}}>
                 <Text style={{color: '#FFF', fontSize: 10, fontWeight: '800'}}>South India</Text>
               </View>
             </View>
             <View style={{width: 120, height: 80, borderRadius: 8, overflow: 'hidden'}}>
               <Image source={{uri: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&q=80'}} style={StyleSheet.absoluteFillObject} contentFit="cover" />
               <View style={{position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.5)', padding: 4}}>
                 <Text style={{color: '#FFF', fontSize: 10, fontWeight: '800'}}>Continental</Text>
               </View>
             </View>
           </View>

           <View style={styles.divider} />

           {/* Location */}
           <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12}}>
             <Text style={{fontSize: 16, fontWeight: '900', color: '#333'}}>Location</Text>
           </View>
           <Text style={{fontSize: 12, fontWeight: '800', color: '#333', marginBottom: 4}}>Address: <Text style={{fontWeight: '400'}}>H NO. 1-59/165 AND 167/GF, JAYABHERI ENCLAVE, APHB ...</Text></Text>
           <Text style={{fontSize: 10, color: '#8E8E93', marginBottom: 16}}>10 minutes walk to University of Hyderabad</Text>

           <Pressable style={{height: 160, borderRadius: 12, overflow: 'hidden', backgroundColor: '#F2F4F7', marginBottom: 16}} onPress={() => router.push('/(hotels)/hotel-map')}>
             <Image source={{uri: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&q=80'}} style={StyleSheet.absoluteFillObject} contentFit="cover" opacity={0.6} />
             <View style={{position: 'absolute', top: 12, left: 12, backgroundColor: '#FFF', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, flexDirection: 'row', alignItems: 'center'}}>
               <MaterialCommunityIcons name="arrow-expand-all" size={12} color="#0084FF" />
               <Text onPress={() => alert("Feature coming soon!")} style={{fontSize: 10, color: '#0084FF', fontWeight: '800', marginLeft: 4}}>Expand Map</Text>
             </View>
             <MaterialCommunityIcons name="map-marker" size={32} color="#E11D48" style={{position: 'absolute', top: '40%', left: '50%'}} />
           </Pressable>

           {/* Guest Profile Rules */}
           <View style={styles.divider} />
           <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12}}>
             <Text style={{fontSize: 16, fontWeight: '900', color: '#333'}}>Guest Profile</Text>
           </View>
           <View style={{flexDirection: 'row', marginBottom: 8}}>
             <Text style={{fontSize: 13, color: '#333'}}>•</Text>
             <Text style={{fontSize: 12, color: '#333', marginLeft: 8}}>Primary Guest should be at least 18 years of age.</Text>
           </View>
           <View style={{flexDirection: 'row', marginBottom: 8}}>
             <Text style={{fontSize: 13, color: '#333'}}>•</Text>
             <Text style={{fontSize: 12, color: '#333', marginLeft: 8}}>Groups with only male guests are allowed at the property.</Text>
           </View>
           <View style={{flexDirection: 'row', marginBottom: 16}}>
             <Text style={{fontSize: 13, color: '#333'}}>•</Text>
             <Text style={{fontSize: 12, color: '#333', marginLeft: 8}}>Passport, Aadhaar, Driving License and Govt. ID are accepted as ID proof(s).</Text>
           </View>
           <Pressable onPress={() => router.push('/(hotels)/hotel-rules')}>
             <Text onPress={() => alert("Feature coming soon!")} style={{fontSize: 12, fontWeight: '800', color: '#0084FF'}}>View More</Text>
           </Pressable>

           <View style={styles.divider} />

           {/* Similar Properties */}
           <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16}}>
             <Text style={{fontSize: 16, fontWeight: '900', color: '#333'}}>Similar Properties</Text>
             <Text onPress={() => alert("Feature coming soon!")} style={{fontSize: 12, fontWeight: '800', color: '#0084FF'}}>+ Add to Compare</Text>
           </View>

           <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{gap: 16, paddingBottom: 16}}>
             <View style={{width: 160, borderWidth: 1, borderColor: '#E5E5EA', borderRadius: 8, overflow: 'hidden'}}>
               <Image source={{uri: 'https://images.unsplash.com/photo-1542314831-c6a4d1409341?w=400&q=80'}} style={{width: '100%', height: 100}} contentFit="cover" />
               <View style={{padding: 8}}>
                 <Text style={{fontSize: 12, fontWeight: '800', color: '#333', marginBottom: 4}} numberOfLines={1}>FabHotel Jaswitha Grand</Text>
                 <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end'}}>
                   <View style={{flexDirection: 'row'}}>
                     {[1,2,3,4].map(i => <MaterialCommunityIcons key={i} name="star" size={10} color="#D97706" />)}
                   </View>
                   <View style={{alignItems: 'flex-end'}}>
                     <Text style={{fontSize: 13, fontWeight: '900', color: '#333'}}>₹ 1,257</Text>
                     <Text style={{fontSize: 8, color: '#8E8E93'}}>Per Night</Text>
                   </View>
                 </View>
               </View>
             </View>
             <View style={{width: 160, borderWidth: 1, borderColor: '#E5E5EA', borderRadius: 8, overflow: 'hidden'}}>
               <Image source={{uri: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80'}} style={{width: '100%', height: 100}} contentFit="cover" />
               <View style={{padding: 8}}>
                 <Text style={{fontSize: 12, fontWeight: '800', color: '#333', marginBottom: 4}} numberOfLines={1}>Hotel White Premium</Text>
                 <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end'}}>
                   <View style={{flexDirection: 'row'}}>
                     {[1,2,3].map(i => <MaterialCommunityIcons key={i} name="star" size={10} color="#D97706" />)}
                   </View>
                   <View style={{alignItems: 'flex-end'}}>
                     <Text style={{fontSize: 13, fontWeight: '900', color: '#333'}}>₹ 1,499</Text>
                     <Text style={{fontSize: 8, color: '#8E8E93'}}>Per Night</Text>
                   </View>
                 </View>
               </View>
             </View>
           </ScrollView>

           {/* Info banner */}
           <View style={{flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E5E5EA', borderRadius: 8, padding: 12, marginTop: 16}}>
             <MaterialCommunityIcons name="text-box-search-outline" size={24} color="#8E8E93" />
             <View style={{marginLeft: 12}}>
               <Text style={{fontSize: 12, fontWeight: '900', color: '#333'}}>Did we miss any information?</Text>
               <Text onPress={() => alert("Feature coming soon!")} style={{fontSize: 10, color: '#0084FF', fontWeight: '800'}}>We'd love to know from you</Text>
             </View>
           </View>

           <View style={{height: 100}} />
        </View>
      </ScrollView>

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
  backBtn: { padding: 4 },
  headerRight: { flexDirection: 'row', alignItems: 'center' },

  content: { flex: 1 },
  
  imageGrid: { flexDirection: 'row', height: 220, paddingHorizontal: 16, gap: 8 },
  mainImage: { flex: 2, height: '100%', borderRadius: 12 },
  sideImages: { flex: 1, height: '100%', gap: 8 },
  sideImageTop: { flex: 1, borderRadius: 12 },
  sideImageBottomContainer: { flex: 1, borderRadius: 12, overflow: 'hidden' },
  sideImageBottom: { flex: 1 },
  morePhotosOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', alignItems: 'center', justifyContent: 'center', padding: 4 },

  rowBtn: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F2F4F7' },
  divider: { height: 1, backgroundColor: '#F2F4F7', marginVertical: 16 },

  datePill: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#D0E6FF', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8, backgroundColor: '#F5FAFF' },

  stickyFooter: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: '#E5E5EA', paddingHorizontal: 24, paddingTop: 16, paddingBottom: 32, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  selectRoomBtn: { backgroundColor: '#0084FF', paddingHorizontal: 24, paddingVertical: 14, borderRadius: 8 },
});
