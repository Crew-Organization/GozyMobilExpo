// import { useState } from 'react';
// import { ScrollView, StyleSheet, Text, View, Pressable, Dimensions, Alert } from 'react-native';
// import { Image } from 'expo-image';
// import { MaterialCommunityIcons } from '@expo/vector-icons';
// import { LinearGradient } from 'expo-linear-gradient';

// const { width: screenWidth } = Dimensions.get('window');

// const baseGridModules = [
//   { id: 'flights', label: 'Flights', icon: 'airplane' },
//   { id: 'hotels', label: 'Hotels', icon: 'office-building' },
//   { id: 'bus', label: 'Bus', icon: 'bus' },
//   { id: 'trains', label: 'Trains', icon: 'train' },
//   { id: 'cabs', label: 'Cabs', icon: 'taxi' },
//   { id: 'movies', label: 'Movies', icon: 'movie-open' },
//   { id: 'shopping', label: 'Shopping', icon: 'shopping' },
//   { id: 'food', label: 'Food', icon: 'silverware-fork-knife' },
// ];

// const expandedGridModules = [
//   { id: 'forex', label: 'Forex Card', icon: 'currency-usd' },
//   { id: 'tours', label: 'Tours', icon: 'hot-air-balloon-outline', badge: 'NEW' },
//   { id: 'hourly', label: 'Hourly Stays', icon: 'bed-clock' },
//   { id: 'visa', label: 'Visa', icon: 'passport' },
//   { id: 'insurance', label: 'Insurance', icon: 'shield-check-outline' },
//   { id: 'events', label: 'Events', icon: 'ticket-outline' },
//   { id: 'gift', label: 'Gift Cards', icon: 'gift-outline' },
//   { id: 'invest', label: 'Invest', icon: 'chart-line' },
// ];

// const filterPills = ['Trending', 'Flights', 'Hotels', 'Rails'];

// const allOfferCards = {
//   Trending: [
//     { id: 't1', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80', title: 'Save on Summer Trips', subtitle: 'Up to 30% off on premium beach resorts', badge: 'SUMMER SALE' },
//     { id: 't2', image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=600&q=80', title: 'Mountain Retreats', subtitle: 'Exclusive member rates for Nordic cabins', badge: 'LUXURY ESCAPE' },
//   ],
//   Flights: [
//     { id: 'f1', image: 'https://images.unsplash.com/photo-1436491865332-7a615061c443?auto=format&fit=crop&w=600&q=80', title: 'DOMESTIC FLIGHTS', subtitle: 'Flat 15% Off on Flights', badge: 'FLIGHTS' },
//   ],
//   Hotels: [
//     { id: 'h1', image: 'https://images.unsplash.com/photo-1551882547-ff40c0d1398c?auto=format&fit=crop&w=600&q=80', title: 'PREMIUM STAYS', subtitle: 'Free Room Upgrades', badge: 'HOTELS' },
//   ],
//   Rails: [
//     { id: 'r1', image: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=600&q=80', title: 'TRAIN BOOKINGS', subtitle: 'Zero Convenience Fee', badge: 'RAILS' },
//   ],
// };

// import { router } from 'expo-router';

// export default function SuperAppDashboard() {
//   const [isExpanded, setIsExpanded] = useState(true);
//   const [activeOfferFilter, setActiveOfferFilter] = useState('Trending');

//   const handleFeaturePress = (id?: string) => {
//     if (id === 'food') {
//       router.push('/food');
//     } else {
//       Alert.alert('Coming Soon', 'This feature is currently under development!');
//     }
//   };

//   const visibleModules = isExpanded ? [...baseGridModules, ...expandedGridModules] : baseGridModules;

//   return (
//     <View style={styles.container}>
//       <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
//         {/* Header */}
//         <View style={styles.header}>
//           <View style={styles.headerLeft}>
//             <MaterialCommunityIcons name="menu" size={28} color="#111" />
//             <Text style={styles.headerTitle}>Explorer</Text>
//           </View>
//           <View style={styles.headerRight}>
//             <View style={styles.headerActionBtn}>
//               <MaterialCommunityIcons name="wallet-outline" size={16} color="#0EA5E9" />
//               <Text style={styles.headerActionBtnText}>Wallet</Text>
//             </View>
//             <View style={styles.headerAction}>
//               <MaterialCommunityIcons name="bell-outline" size={24} color="#111" />
//               <View style={styles.notifDot} />
//             </View>
//           </View>
//         </View>

//         {/* Unified Main Grid Container */}
//         <View style={styles.mainGridCard}>
//           <View style={styles.unifiedGrid}>
//             {visibleModules.map((item) => (
//               <Pressable key={item.id} style={styles.unifiedModule} onPress={() => handleFeaturePress(item.id)}>
//                 <View style={styles.unifiedIconContainer}>
//                   {(item as any).badge && (
//                     <View style={styles.badgeWrapper}>
//                       <Text style={styles.badgeText}>{(item as any).badge}</Text>
//                     </View>
//                   )}
//                   <MaterialCommunityIcons 
//                     name={item.icon as any} 
//                     size={26} 
//                     color="#475569" 
//                   />
//                 </View>
//                 <Text style={styles.unifiedModuleLabel} numberOfLines={2}>{item.label}</Text>
//               </Pressable>
//             ))}
//           </View>

//           <Pressable style={styles.chevronWrapper} onPress={() => setIsExpanded(!isExpanded)}>
//             <MaterialCommunityIcons name={isExpanded ? "chevron-up" : "chevron-down"} size={24} color="#0EA5E9" />
//           </Pressable>
//         </View>

//         {/* Exclusive Offers Section */}
//         <View style={styles.sectionHeader}>
//           <View>
//             <Text style={styles.sectionTitle}>Exclusive Offers</Text>
//             <Text style={styles.sectionSubtitle}>Handpicked deals just for you</Text>
//           </View>
//           <Pressable style={styles.viewAllBtnInline} onPress={() => handleFeaturePress()}>
//             <Text style={styles.viewAllBtnInlineText}>View All</Text>
//             <MaterialCommunityIcons name="arrow-right" size={16} color="#0EA5E9" />
//           </Pressable>
//         </View>

//         <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterPillsContainer}>
//           {filterPills.map((pill) => (
//             <Pressable key={pill} style={[styles.filterPill, activeOfferFilter === pill && styles.filterPillActive]} onPress={() => setActiveOfferFilter(pill)}>
//               <Text style={[styles.filterPillText, activeOfferFilter === pill && styles.filterPillTextActive]}>{pill}</Text>
//             </Pressable>
//           ))}
//         </ScrollView>

//         <ScrollView 
//           horizontal 
//           showsHorizontalScrollIndicator={false} 
//           contentContainerStyle={styles.horizontalScrollContainer}
//           snapToInterval={screenWidth * 0.85 + 16}
//           decelerationRate="fast"
//         >
//           {(allOfferCards[activeOfferFilter as keyof typeof allOfferCards] || []).map((offer) => (
//             <Pressable key={offer.id} style={styles.offerCard} onPress={() => handleFeaturePress()}>
//               <Image source={{ uri: offer.image }} style={StyleSheet.absoluteFillObject} contentFit="cover" />
//               <LinearGradient colors={['transparent', 'rgba(0,0,0,0.8)']} style={StyleSheet.absoluteFillObject} />
//               <View style={styles.offerBadge}><Text style={styles.offerBadgeText}>{offer.badge}</Text></View>
//               <View style={styles.offerContent}>
//                 <Text style={styles.offerTitle}>{offer.title}</Text>
//                 <Text style={styles.offerSubtitle}>{offer.subtitle}</Text>
//               </View>
//             </Pressable>
//           ))}
//         </ScrollView>

//         {/* AI Concierge Section */}
//         <View style={styles.adventureCard}>
//           <Text style={styles.advTitle}>Your Next Adventure Starts{'\n'}Here</Text>
//           <Text style={styles.advSubtitle}>Let our AI concierge craft a personalized{'\n'}itinerary based on your explorer profile.</Text>
//           <Pressable style={styles.planTripBtn}>
//             <Text style={styles.planTripBtnText}>Plan My Trip</Text>
//           </Pressable>
          
//           <View style={styles.aiConciergeBox}>
//             <MaterialCommunityIcons name="creation" size={32} color="#0F172A" />
//             <Text style={styles.aiConciergeText}>AI CONCIERGE</Text>
//           </View>
//         </View>

//       </ScrollView>

//       {/* Floating Action Button */}
//       <Pressable style={styles.fabBtn}>
//         <MaterialCommunityIcons name="plus" size={28} color="#FFF" />
//       </Pressable>

//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#F8FAFC' },
//   scrollContent: { paddingBottom: 100 },
  
//   // Header
//   header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 60, paddingBottom: 16, backgroundColor: '#FFFFFF', borderBottomLeftRadius: 24, borderBottomRightRadius: 24, zIndex: 10, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, elevation: 4 },
//   headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
//   headerTitle: { fontSize: 18, fontWeight: '900', color: '#0F172A' },
//   headerRight: { flexDirection: 'row', alignItems: 'center', gap: 16 },
//   headerActionBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#E0F2FE', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
//   headerActionBtnText: { fontSize: 12, fontWeight: '800', color: '#0369A1' },
//   headerAction: { alignItems: 'center', justifyContent: 'center', position: 'relative' },
//   notifDot: { position: 'absolute', top: -2, right: 2, width: 8, height: 8, borderRadius: 4, backgroundColor: '#EF4444', borderWidth: 1.5, borderColor: '#FFFFFF' },
  
//   // Unified Grid
//   mainGridCard: { backgroundColor: '#FFFFFF', marginHorizontal: 16, borderRadius: 24, paddingTop: 20, paddingHorizontal: 12, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 12, shadowOffset: { width: 0, height: 6 }, elevation: 4, marginTop: 24, marginBottom: 24 },
//   unifiedGrid: { flexDirection: 'row', flexWrap: 'wrap' },
//   unifiedModule: { width: '25%', alignItems: 'center', paddingVertical: 12, gap: 8 },
//   unifiedIconContainer: { position: 'relative', width: 48, height: 48, borderRadius: 24, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center' },
//   badgeWrapper: { position: 'absolute', top: -6, left: '50%', marginLeft: -16, backgroundColor: '#EF4444', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 10, zIndex: 2, borderWidth: 1, borderColor: '#FFF' },
//   badgeText: { color: '#FFF', fontSize: 7, fontWeight: '900', textTransform: 'uppercase' },
//   unifiedModuleLabel: { fontSize: 10, fontWeight: '600', color: '#334155', textAlign: 'center', lineHeight: 12 },
//   chevronWrapper: { alignItems: 'center', paddingVertical: 6, marginTop: 8 },
  
//   // Sections Shared
//   sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 16, marginTop: 8 },
//   sectionTitle: { fontSize: 20, fontWeight: '900', color: '#0F172A', letterSpacing: -0.5 },
//   sectionSubtitle: { fontSize: 12, fontWeight: '500', color: '#334155', marginTop: 2 },
//   viewAllBtnInline: { flexDirection: 'row', alignItems: 'center', gap: 4 },
//   viewAllBtnInlineText: { fontSize: 13, fontWeight: '800', color: '#0EA5E9' },
//   horizontalScrollContainer: { paddingHorizontal: 16, gap: 12 },
  
//   // Filter Pills
//   filterPillsContainer: { paddingHorizontal: 16, gap: 12, marginBottom: 16 },
//   filterPill: { paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#CBD5E1' },
//   filterPillActive: { borderColor: '#0EA5E9', backgroundColor: '#F0F9FF' },
//   filterPillText: { fontSize: 13, fontWeight: '600', color: '#334155' },
//   filterPillTextActive: { color: '#0EA5E9', fontWeight: '800' },
  
//   // Offer Cards
//   offerCard: { width: screenWidth * 0.82, height: 180, borderRadius: 20, overflow: 'hidden', backgroundColor: '#E2E8F0', shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 10, shadowOffset: { width: 0, height: 5 }, elevation: 5 },
//   offerBadge: { position: 'absolute', top: 16, left: 16, backgroundColor: '#FFFFFF', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
//   offerBadgeText: { fontSize: 10, fontWeight: '900', color: '#0F172A', letterSpacing: 0.5 },
//   offerContent: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 16 },
//   offerTitle: { color: '#FFFFFF', fontSize: 18, fontWeight: '900', marginBottom: 4 },
//   offerSubtitle: { color: '#E2E8F0', fontSize: 12, fontWeight: '500' },
  
//   // AI Concierge
//   adventureCard: { backgroundColor: '#FFFFFF', marginHorizontal: 16, marginTop: 24, borderRadius: 24, padding: 24, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 12, shadowOffset: { width: 0, height: 6 }, elevation: 4 },
//   advTitle: { fontSize: 20, fontWeight: '900', color: '#0F172A', textAlign: 'center', marginBottom: 8 },
//   advSubtitle: { fontSize: 12, color: '#475569', textAlign: 'center', lineHeight: 18, marginBottom: 20 },
//   planTripBtn: { backgroundColor: '#0A2540', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 20, marginBottom: 24 },
//   planTripBtnText: { color: '#FFF', fontSize: 14, fontWeight: '800' },
//   aiConciergeBox: { backgroundColor: '#F8FAFC', width: '100%', paddingVertical: 24, borderRadius: 16, alignItems: 'center', justifyContent: 'center', gap: 12, borderWidth: 1, borderColor: '#E2E8F0' },
//   aiConciergeText: { fontSize: 14, fontWeight: '900', color: '#0F172A', letterSpacing: 0.5 },

//   // FAB
//   fabBtn: { position: 'absolute', bottom: 32, right: 24, width: 56, height: 56, borderRadius: 28, backgroundColor: '#0284C7', alignItems: 'center', justifyContent: 'center', shadowColor: '#0284C7', shadowOpacity: 0.4, shadowRadius: 12, shadowOffset: { width: 0, height: 6 }, elevation: 6 },
// });


 import { useState, useRef } from 'react';
import {
  ScrollView, StyleSheet, Text, View, Pressable,
  Dimensions, Alert, ImageBackground, Modal, FlatList
} from 'react-native';
import { Image } from 'expo-image';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width: screenWidth } = Dimensions.get('window');

// ── UNCHANGED TOP DATA ────────────────────────────────────────────────────────
const baseGridModules = [
  { id: 'flights', label: 'Flights', icon: 'airplane' },
  { id: 'hotels', label: 'Hotels', icon: 'office-building' },
  { id: 'bus', label: 'Bus', icon: 'bus' },
  { id: 'trains', label: 'Trains', icon: 'train' },
  { id: 'cabs', label: 'Cabs', icon: 'taxi' },
  { id: 'entertainment', label: 'Movies', icon: 'movie-open' },
  { id: 'shopping', label: 'Shopping', icon: 'shopping' },
  { id: 'food', label: 'Food', icon: 'silverware-fork-knife' },
];
const expandedGridModules = [
  { id: 'forex', label: 'Forex Card', icon: 'currency-usd' },
  { id: 'tours', label: 'Tours', icon: 'hot-air-balloon-outline', badge: 'NEW' },
  { id: 'hourly', label: 'Hourly Stays', icon: 'bed-clock' },
  { id: 'visa', label: 'Visa', icon: 'passport' },
  { id: 'insurance', label: 'Insurance', icon: 'shield-check-outline' },
  { id: 'events', label: 'Events', icon: 'ticket-outline' },
  { id: 'gift', label: 'Gift Cards', icon: 'gift-outline' },
  { id: 'invest', label: 'Invest', icon: 'chart-line' },
];

// ── FILTER PILLS ──────────────────────────────────────────────────────────────
const filterPills = ['Trending', 'Flights', 'Hotels', 'Rails', 'Holidays', 'Cabs'];

// ── OFFER CARDS PER FILTER ────────────────────────────────────────────────────
const allOffers: Record<string, any[]> = {
  Trending: [
    { id: 't1', image: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=700&q=80', badge: 'OFFERS', label: 'SAVE ON SUMMER TRIPS:', title: 'Grab Up to 40% OFF*', subtitle: 'on Packages, Flights, Stays, Buses, Cabs, Trains & More', kotak: false },
    { id: 't2', image: 'https://images.unsplash.com/photo-1501555088652-021faa106b9b?w=700&q=80', badge: 'OFFERS', label: 'TRAVEL ALL AROUND THE WORLD:', title: 'Grab Up to 35% OFF*', subtitle: 'on flights, hotels & holiday packages', kotak: true },
    { id: 't3', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=700&q=80', badge: 'HOT DEAL', label: 'WEEKEND GETAWAY:', title: 'Flat ₹1500 OFF*', subtitle: 'on bookings above ₹5000 this weekend only', kotak: false },
    { id: 't4', image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=700&q=80', badge: 'EXCLUSIVE', label: 'MOUNTAIN ESCAPES:', title: 'Up to 50% OFF*', subtitle: 'on hill station packages — Manali, Shimla, Ooty & more', kotak: false },
    { id: 't5', image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=700&q=80', badge: 'LIMITED', label: 'EARLY BIRD OFFER:', title: 'Extra 20% Cashback', subtitle: 'Book 30 days in advance & save big on all categories', kotak: false },
  ],
  Flights: [
    { id: 'f1', image: 'https://images.unsplash.com/photo-1436491865332-7a615061c443?w=700&q=80', badge: 'FLIGHTS', label: 'DOMESTIC FLIGHTS:', title: 'Flat 15% OFF*', subtitle: 'on all domestic routes — DEL, BOM, BLR, HYD & more', kotak: false },
    { id: 'f2', image: 'https://images.unsplash.com/photo-1556388158-158ea5ccacbd?w=700&q=80', badge: 'FLIGHTS', label: 'INTERNATIONAL FLIGHTS:', title: 'Up to ₹3000 OFF*', subtitle: 'on international bookings with HDFC credit cards', kotak: false },
    { id: 'f3', image: 'https://images.unsplash.com/photo-1542296332-2e4473faf563?w=700&q=80', badge: 'FLIGHTS', label: 'BUSINESS CLASS:', title: 'Upgrade for ₹999*', subtitle: 'Bid upgrade on select IndiGo & Air India routes', kotak: false },
    { id: 'f4', image: 'https://images.unsplash.com/photo-1474302770737-173ee21bab63?w=700&q=80', badge: 'FLIGHTS', label: 'MONSOON SALE:', title: 'Fares from ₹899*', subtitle: 'Grab lowest fares on top 50 domestic routes', kotak: false },
  ],
  Hotels: [
    { id: 'h1', image: 'https://images.unsplash.com/photo-1551882547-ff40c0d1398c?w=700&q=80', badge: 'HOTELS', label: 'PREMIUM STAYS:', title: 'Up to 45% OFF*', subtitle: 'on 5-star hotels across India — limited period offer', kotak: false },
    { id: 'h2', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=700&q=80', badge: 'HOTELS', label: 'RESORT ESCAPES:', title: 'Free Room Upgrade*', subtitle: 'on bookings at select resort properties this season', kotak: false },
    { id: 'h3', image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=700&q=80', badge: 'HOTELS', label: 'BUSINESS HOTELS:', title: 'Flat ₹800 OFF*', subtitle: 'on corporate stays with complimentary breakfast', kotak: false },
  ],
  Rails: [
    { id: 'r1', image: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=700&q=80', badge: 'RAILS', label: 'TRAIN BOOKINGS:', title: 'Zero Convenience Fee*', subtitle: 'Book any train ticket with no extra charges this month', kotak: false },
    { id: 'r2', image: 'https://images.unsplash.com/photo-1609141282851-a6a2ab76ddfe?w=700&q=80', badge: 'RAILS', label: 'TATKAL OFFER:', title: 'Save ₹200 on Tatkal*', subtitle: 'Use code RAIL200 on Tatkal bookings — limited slots', kotak: false },
    { id: 'r3', image: 'https://images.unsplash.com/photo-1553684208-5e796de3fe0e?w=700&q=80', badge: 'RAILS', label: 'FOOD ON TRAIN:', title: 'Free Meal Upgrade*', subtitle: 'Order food on train & get complimentary dessert', kotak: false },
  ],
  Holidays: [
    { id: 'p1', image: 'https://images.unsplash.com/photo-1503220317375-aaad61436b1b?w=700&q=80', badge: 'HOLIDAYS', label: 'INTERNATIONAL PACKAGES:', title: 'Up to 40% OFF*', subtitle: 'Europe, Bali, Thailand, Dubai packages at unbeatable prices', kotak: false },
    { id: 'p2', image: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=700&q=80', badge: 'HOLIDAYS', label: 'HONEYMOON SPECIAL:', title: 'Couple Packages ₹24,999*', subtitle: 'All-inclusive romantic getaways for 2 — flights + hotel', kotak: false },
    { id: 'p3', image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=700&q=80', badge: 'HOLIDAYS', label: 'FAMILY PACKAGES:', title: 'Kids Stay Free*', subtitle: 'Book family package & children below 12 stay at no cost', kotak: false },
  ],
  Cabs: [
    { id: 'c1', image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=700&q=80', badge: 'CABS', label: 'AIRPORT TRANSFERS:', title: 'Flat 20% OFF*', subtitle: 'on all airport pickups and drops — any city any time', kotak: false },
    { id: 'c2', image: 'https://images.unsplash.com/photo-1511527661048-7fe73d85e9a4?w=700&q=80', badge: 'CABS', label: 'OUTSTATION CABS:', title: 'Save ₹500*', subtitle: 'on first outstation ride — one-way or round trip', kotak: false },
    { id: 'c3', image: 'https://images.unsplash.com/photo-1597007030739-6d2e6f43f83b?w=700&q=80', badge: 'CABS', label: 'HOURLY RENTAL:', title: 'First Hour Free*', subtitle: 'Rent a cab by the hour — city tour, meetings & errands', kotak: false },
  ],
};

// ── FLIGHT DEAL CARDS (shown when Flights pill active) ────────────────────────
const flightDeals = [
  { id: 'fd1', from: 'DEL', to: 'BOM', fromCity: 'Delhi', toCity: 'Mumbai', price: '₹1,899', date: 'Wed, 28 May', airline: 'IndiGo', duration: '2h 10m', tag: 'CHEAPEST' },
  { id: 'fd2', from: 'BLR', to: 'DEL', fromCity: 'Bangalore', toCity: 'Delhi', price: '₹2,299', date: 'Thu, 29 May', airline: 'Air India', duration: '2h 45m', tag: 'NONSTOP' },
  { id: 'fd3', from: 'HYD', to: 'BOM', fromCity: 'Hyderabad', toCity: 'Mumbai', price: '₹1,499', date: 'Fri, 30 May', airline: 'SpiceJet', duration: '1h 35m', tag: 'HOT DEAL' },
  { id: 'fd4', from: 'MAA', to: 'BLR', fromCity: 'Chennai', toCity: 'Bangalore', price: '₹899', date: 'Sat, 31 May', airline: 'Akasa Air', duration: '1h 05m', tag: 'CHEAPEST' },
  { id: 'fd5', from: 'DEL', to: 'GOI', fromCity: 'Delhi', toCity: 'Goa', price: '₹3,199', date: 'Sun, 1 Jun', airline: 'Vistara', duration: '2h 30m', tag: 'POPULAR' },
];

// ── AIRLINE STORES (more cards, no blue overlay) ──────────────────────────────
const airlineStores = [
  { id: 'ai',        name: 'Air India',         image: 'https://images.unsplash.com/photo-1436491865332-7a615061c443?w=400&q=90', tailColor: '#C8102E' },
  { id: 'etihad',    name: 'Etihad Airways',    image: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=400&q=90', tailColor: '#BFA46A' },
  { id: 'malaysia',  name: 'Malaysia Airlines', image: 'https://images.unsplash.com/photo-1517999144091-3d9dca6d1e43?w=400&q=90', tailColor: '#CC0001' },
  { id: 'airasia',   name: 'AirAsia',           image: 'https://images.unsplash.com/photo-1483450388369-9ed95738483c?w=400&q=90', tailColor: '#FF0000' },
  { id: 'emirates',  name: 'Emirates',          image: 'https://images.unsplash.com/photo-1556388158-158ea5ccacbd?w=400&q=90', tailColor: '#D4A017' },
  { id: 'singapore', name: 'Singapore Airlines',image: 'https://images.unsplash.com/photo-1474302770737-173ee21bab63?w=400&q=90', tailColor: '#00308F' },
  { id: 'indigo',    name: 'IndiGo',            image: 'https://images.unsplash.com/photo-1542296332-2e4473faf563?w=400&q=90', tailColor: '#1E3A8A' },
];

// ── HOTEL STORES ──────────────────────────────────────────────────────────────
const hotelStores = [
  { id: 'sterling', title: 'Sterling Hotels &\nResorts', logoText: 'Sterling',    logoColor: '#D946EF', logoBg: '#FFF',    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80' },
  { id: 'hyatt',    title: 'Hyatt Hotels',               logoText: 'WORLD\nOF HYATT', logoColor: '#FFF', logoBg: '#0052CC', image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600&q=80' },
  { id: 'orchid',   title: 'Royal Orchid\nHotels',       logoText: 'ROYAL\nORCHID',   logoColor: '#FFF', logoBg: '#7C3AED', image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&q=80' },
];

// ── WHAT'S NEW ────────────────────────────────────────────────────────────────
const whatsNewStories = [
  { id: 's1', label: 'Train Seat\nAvailability F...', img: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=200&q=80' },
  { id: 's2', label: "MMT's Travel\nCard is Here",   img: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=200&q=80' },
  { id: 's3', label: 'Tours &\nAttractions',         img: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=200&q=80' },
  { id: 's4', label: 'Custom Cab\nAdd-ons',          img: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=200&q=80' },
  { id: 's5', label: 'Food on Train\nServices',      img: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=200&q=80' },
];

// ── WHERE 2 GO ────────────────────────────────────────────────────────────────
const allWhere2Go = [
  { id: 'w1',  image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=500&q=80', location: 'Jammu',     subtitle: 'A Slice of Heaven',                   tall: true },
  { id: 'w2',  image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&q=80', sponsored: true,       text: "Take a break at Australia's Getaways." },
  { id: 'w3',  image: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=500&q=80', location: 'Kenya',     subtitle: 'Deep dive into wildlife',              author: 'Sushil Sharma', video: '0:43' },
  { id: 'w4',  image: 'https://images.unsplash.com/photo-1431274172761-fca41d930114?w=500&q=80', location: 'Paris',     subtitle: 'A blissful trip to Paris',             author: 'Vamsi Kaka' },
  { id: 'w5',  image: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=500&q=80', rating: '4.0/5',       title: 'The Greenfields Resort',                 location: 'Chevella' },
  { id: 'w6',  image: 'https://images.unsplash.com/photo-1582640810028-b4be59f16a08?w=500&q=80', rating: '4.5/5',       title: "Hampi's Boulders Resort",                location: 'Hampi' },
  { id: 'w7',  image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=500&q=80', location: 'Goa',       subtitle: 'Sun, Sand & Serenity',                author: 'Priya Mehta' },
  { id: 'w8',  image: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=500&q=80', location: 'Ladakh',    subtitle: 'The Land of High Passes',             author: 'Rohit Singh' },
  { id: 'w9',  image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=500&q=80', location: 'Rajasthan', subtitle: 'Colors of the Desert',                author: 'Ananya Roy' },
  { id: 'w10', image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=500&q=80', location: 'Kerala',    subtitle: 'God\'s Own Country',                  author: 'Dev Nair' },
];

import { router } from 'expo-router';

export default function SuperAppDashboard() {
  const [isExpanded, setIsExpanded] = useState(true);
  const [activeFilter, setActiveFilter] = useState('Trending');
  const [showAllOffers, setShowAllOffers] = useState(false);
  const [showMoreCards, setShowMoreCards] = useState(false);
  const [w2gCount, setW2gCount] = useState(6);

  const handleFeaturePress = (id?: string) => {
    if (id === 'food') router.push('/food');
    else if (id === 'movies' || id === 'entertainment')
      router.push({ pathname: '/entertainment', params: { tab: 'home' } });
    else if (id === 'events') router.push({ pathname: '/entertainment', params: { tab: 'live' } });
    else Alert.alert('Coming Soon', 'This feature is under development!');
  };

  const visibleModules = isExpanded ? [...baseGridModules, ...expandedGridModules] : baseGridModules;
  const currentOffers = allOffers[activeFilter] || allOffers['Trending'];
  const displayedW2g = allWhere2Go.slice(0, w2gCount);

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* ── HEADER — UNCHANGED ── */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <MaterialCommunityIcons name="menu" size={28} color="#111" />
            <Text style={styles.headerTitle}>Explorer</Text>
          </View>
          <View style={styles.headerRight}>
            <View style={styles.headerActionBtn}>
              <MaterialCommunityIcons name="wallet-outline" size={16} color="#0EA5E9" />
              <Text style={styles.headerActionBtnText}>Wallet</Text>
            </View>
            <View style={styles.headerAction}>
              <MaterialCommunityIcons name="bell-outline" size={24} color="#111" />
              <View style={styles.notifDot} />
            </View>
          </View>
        </View>

        {/* ── GRID — UNCHANGED ── */}
        <View style={styles.mainGridCard}>
          <View style={styles.unifiedGrid}>
            {visibleModules.map((item) => (
              <Pressable key={item.id} style={styles.unifiedModule} onPress={() => handleFeaturePress(item.id)}>
                <View style={styles.unifiedIconContainer}>
                  {(item as any).badge && (
                    <View style={styles.badgeWrapper}>
                      <Text style={styles.badgeText}>{(item as any).badge}</Text>
                    </View>
                  )}
                  <MaterialCommunityIcons name={item.icon as any} size={26} color="#475569" />
                </View>
                <Text style={styles.unifiedModuleLabel} numberOfLines={2}>{item.label}</Text>
              </Pressable>
            ))}
          </View>
          <Pressable style={styles.chevronWrapper} onPress={() => setIsExpanded(!isExpanded)}>
            <MaterialCommunityIcons name={isExpanded ? 'chevron-up' : 'chevron-down'} size={24} color="#0EA5E9" />
          </Pressable>
        </View>

        {/* ════ NEW UI FROM HERE ════ */}

        {/* ── OFFERS HEADER ── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Offers</Text>
          <Pressable style={styles.viewAllBtn} onPress={() => setShowAllOffers(true)}>
            <Text style={styles.viewAllText}>View All</Text>
            <MaterialCommunityIcons name="chevron-right-circle" size={18} color="#0084FF" />
          </Pressable>
        </View>

        {/* Filter Pills */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pillsRow}>
          {filterPills.map((pill) => (
            <Pressable
              key={pill}
              style={[styles.pill, activeFilter === pill && styles.pillActive]}
              onPress={() => setActiveFilter(pill)}
            >
              <Text style={[styles.pillText, activeFilter === pill && styles.pillTextActive]}>{pill}</Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Flight Deal Cards — shown when Flights is active */}
        {activeFilter === 'Flights' && (
          <View style={{ marginBottom: 16 }}>
            <Text style={styles.dealsSubtitle}>✈️  Best fares right now</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.flightDealsRow}>
              {flightDeals.map((fd) => (
                <Pressable key={fd.id} style={styles.flightDealCard}>
                  <View style={styles.fdTop}>
                    <View style={styles.fdTagWrap}><Text style={styles.fdTag}>{fd.tag}</Text></View>
                    <Text style={styles.fdAirline}>{fd.airline}</Text>
                  </View>
                  <View style={styles.fdMiddle}>
                    <View style={styles.fdCity}>
                      <Text style={styles.fdCode}>{fd.from}</Text>
                      <Text style={styles.fdCityName}>{fd.fromCity}</Text>
                    </View>
                    <View style={styles.fdArrowWrap}>
                      <View style={styles.fdLine} />
                      <MaterialCommunityIcons name="airplane" size={16} color="#0084FF" />
                      <View style={styles.fdLine} />
                    </View>
                    <View style={styles.fdCity}>
                      <Text style={styles.fdCode}>{fd.to}</Text>
                      <Text style={styles.fdCityName}>{fd.toCity}</Text>
                    </View>
                  </View>
                  <View style={styles.fdBottom}>
                    <View>
                      <Text style={styles.fdDate}>{fd.date}</Text>
                      <Text style={styles.fdDuration}>{fd.duration}</Text>
                    </View>
                    <Text style={styles.fdPrice}>{fd.price}</Text>
                  </View>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Offer Cards Carousel */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.offerRow}
          snapToInterval={screenWidth * 0.68 + 12}
          decelerationRate="fast"
        >
          {currentOffers.map((offer) => (
            <Pressable key={offer.id} style={styles.offerCard}>
              <ImageBackground
                source={{ uri: offer.image }}
                style={StyleSheet.absoluteFillObject}
                imageStyle={{ borderRadius: 14 }}
              >
                <LinearGradient
                  colors={['rgba(0,0,0,0.0)', 'rgba(0,0,0,0.82)']}
                  style={[StyleSheet.absoluteFillObject, { borderRadius: 14 }]}
                />
                <View style={styles.offerBadge}>
                  <Text style={styles.offerBadgeText}>{offer.badge}</Text>
                </View>
                <View style={styles.offerContent}>
                  <Text style={styles.offerLabel}>{offer.label}</Text>
                  <Text style={styles.offerTitle}>{offer.title}</Text>
                  <Text style={styles.offerSubtitle}>{offer.subtitle}</Text>
                  {offer.kotak && (
                    <View style={styles.kotakRow}>
                      <View style={styles.kotakBadge}><Text style={styles.kotakBadgeText}>kotak</Text></View>
                      <Text style={styles.kotakNote}>Exclusive offer* for all Kotak Mahindra Bank Credit Card{'\n'}No-Cost EMI transactions</Text>
                    </View>
                  )}
                </View>
              </ImageBackground>
            </Pressable>
          ))}
        </ScrollView>

        {/* ── FLAGSHIP AIRLINE STORES — No blue overlay, wider cards, more airlines ── */}
        <View style={[styles.sectionHeader, { marginTop: 28 }]}>
          <Text style={styles.sectionTitle}>Flagship Airline Stores</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.airlinesRow}>
          {airlineStores.map((a) => (
            <Pressable key={a.id} style={styles.airlineCard}>
              <Image source={{ uri: a.image }} style={StyleSheet.absoluteFillObject} contentFit="cover" />
              {/* Only a very subtle bottom gradient for text — no blue overlay */}
              <LinearGradient
                colors={['transparent', 'transparent', 'rgba(0,0,0,0.55)']}
                style={StyleSheet.absoluteFillObject}
              />
              <View style={[styles.tailWing, { backgroundColor: a.tailColor }]} />
              <Text style={styles.airlineName}>{a.name}</Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* ── FLAGSHIP HOTEL STORES ── */}
        <View style={[styles.sectionHeader, { marginTop: 28 }]}>
          <Text style={styles.sectionTitle}>Flagship Hotel Stores</Text>
        </View>
        <View style={styles.hotelsGrid}>
          <Pressable style={styles.hotelLarge}>
            <Image source={{ uri: hotelStores[0].image }} style={StyleSheet.absoluteFillObject} contentFit="cover" />
            <LinearGradient colors={['transparent', 'rgba(0,0,0,0.72)']} style={StyleSheet.absoluteFillObject} />
            <View style={[styles.hotelLogoBadge, { backgroundColor: hotelStores[0].logoBg }]}>
              <Text style={[styles.hotelLogoText, { color: hotelStores[0].logoColor }]}>{hotelStores[0].logoText}</Text>
            </View>
            <Text style={styles.hotelTitleLarge}>{hotelStores[0].title}</Text>
          </Pressable>
          <View style={styles.hotelRightCol}>
            {hotelStores.slice(1).map((h) => (
              <Pressable key={h.id} style={styles.hotelSmall}>
                <Image source={{ uri: h.image }} style={StyleSheet.absoluteFillObject} contentFit="cover" />
                <LinearGradient colors={['transparent', 'rgba(0,0,0,0.75)']} style={StyleSheet.absoluteFillObject} />
                <View style={[styles.hotelLogoBadgeSmall, { backgroundColor: h.logoBg }]}>
                  <Text style={[styles.hotelLogoTextSmall, { color: h.logoColor }]}>{h.logoText}</Text>
                </View>
                <Text style={styles.hotelTitleSmall}>{h.title}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* ── WHAT'S NEW ── */}
        <View style={[styles.sectionHeader, { marginTop: 28 }]}>
          <Text style={styles.sectionTitle}>What&apos;s New</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.storiesRow}>
          {whatsNewStories.map((s) => (
            <View key={s.id} style={styles.storyWrap}>
              <LinearGradient colors={['#F43F5E', '#EC4899', '#3B82F6']} style={styles.storyBorder}>
                <View style={styles.storyInner}>
                  <Image source={{ uri: s.img }} style={StyleSheet.absoluteFillObject} contentFit="cover" />
                </View>
              </LinearGradient>
              <Text style={styles.storyLabel} numberOfLines={2}>{s.label}</Text>
            </View>
          ))}
        </ScrollView>

        {/* ── DISCOVER MORE ── */}
        <View style={[styles.sectionHeader, { marginTop: 28 }]}>
          <Text style={styles.sectionTitle}>Discover more than travel</Text>
        </View>
        <View style={styles.discoverCard}>
          <View style={styles.discoverItem}>
            <MaterialCommunityIcons name="account-multiple-plus-outline" size={28} color="#3B82F6" />
            <Text style={styles.discoverLabel}>Refer &{'\n'}Earn</Text>
          </View>
          <View style={styles.discoverDivider} />
          <View style={styles.discoverItem}>
            <MaterialCommunityIcons name="ticket-confirmation-outline" size={28} color="#3B82F6" />
            <Text style={styles.discoverLabel}>PNR{'\n'}Status</Text>
          </View>
          <View style={styles.discoverDivider} />
          <View style={styles.discoverItem}>
            <MaterialCommunityIcons name="airplane-search" size={28} color="#3B82F6" />
            <Text style={styles.discoverLabel}>Flight{'\n'}Status</Text>
          </View>
        </View>

        {/* ── HOSTING ── */}
        <View style={[styles.sectionHeader, { marginTop: 28 }]}>
          <Text style={styles.sectionTitle}>Explore the world of hosting</Text>
        </View>
        <Pressable style={styles.hostingBanner}>
          <Image source={{ uri: 'https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?w=800&q=80' }} style={StyleSheet.absoluteFillObject} contentFit="cover" />
          <LinearGradient colors={['transparent', 'rgba(0,0,0,0.55)']} style={StyleSheet.absoluteFillObject} />
          <View style={styles.hostingRow}>
            <Text style={styles.hostingText}>List your property & get extra income</Text>
            <MaterialCommunityIcons name="chevron-right" size={20} color="#FFF" />
          </View>
        </Pressable>

        {/* ── EXCLUSIVE PARTNERS ── */}
        <View style={[styles.sectionHeader, { marginTop: 28 }]}>
          <Text style={styles.sectionTitle}>Exclusive Partners</Text>
        </View>
        <View style={styles.partnerCard}>
          <View style={styles.partnerLeft}>
            <Text style={styles.pGetForex}>GET FOREX</Text>
            <Text style={styles.pOn}>on</Text>
            <View style={styles.pMmtRow}>
              <Text style={styles.pMake}>make</Text>
              <View style={styles.pMyBadge}><Text style={styles.pMyText}>my</Text></View>
              <Text style={styles.pTrip}>trip</Text>
            </View>
            <View style={{ marginTop: 10 }}>
              <Text style={styles.pPowered}>POWERED BY</Text>
              <Text style={styles.pBookMyForex}>BookMyForex</Text>
            </View>
          </View>
          <View style={styles.partnerRight}>
            <Text style={styles.pHeading}>Lowest Exchange Rates</Text>
            <Text style={styles.pGuaranteed}>Guaranteed*</Text>
            <View style={styles.pDivider} />
            <Text style={styles.pSameDay}>Same-day</Text>
            <Text style={styles.pDoorstep}>Doorstep Delivery</Text>
            <Pressable style={styles.orderBtn}>
              <Text style={styles.orderBtnText}>ORDER FOREX</Text>
            </Pressable>
            <Text style={styles.pTnc}>*T&Cs Apply</Text>
          </View>
        </View>
        <View style={styles.adRow}>
          <Text style={styles.adText}>Ad</Text>
          <MaterialCommunityIcons name="information-outline" size={13} color="#94A3B8" />
        </View>

        {/* ── WHERE 2 GO ── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Where 2 Go</Text>
          <Pressable style={styles.viewAllBtn} onPress={() => setW2gCount(allWhere2Go.length)}>
            <Text style={styles.viewAllText}>View All</Text>
            <MaterialCommunityIcons name="chevron-right-circle" size={18} color="#0084FF" />
          </Pressable>
        </View>

        <View style={styles.w2gGrid}>
          <View style={styles.w2gCol}>
            {/* Tall — Jammu */}
            <Pressable style={styles.w2gTall}>
              <Image source={{ uri: allWhere2Go[0].image }} style={StyleSheet.absoluteFillObject} contentFit="cover" />
              <LinearGradient colors={['transparent', 'rgba(0,0,0,0.7)']} style={StyleSheet.absoluteFillObject} />
              <View style={styles.w2gLocRow}>
                <MaterialCommunityIcons name="map-marker" size={11} color="#FFF" />
                <Text style={styles.w2gLoc}>{allWhere2Go[0].location}</Text>
              </View>
              <Text style={styles.w2gSub}>{allWhere2Go[0].subtitle}</Text>
            </Pressable>
            {/* Paris */}
            <Pressable style={styles.w2gShort}>
              <Image source={{ uri: allWhere2Go[3].image }} style={StyleSheet.absoluteFillObject} contentFit="cover" />
              <LinearGradient colors={['transparent', 'rgba(0,0,0,0.65)']} style={StyleSheet.absoluteFillObject} />
              <View style={styles.w2gLocRow}>
                <MaterialCommunityIcons name="map-marker" size={11} color="#FFF" />
                <Text style={styles.w2gLoc}>{allWhere2Go[3].location}</Text>
              </View>
              <Text style={styles.w2gSub}>{allWhere2Go[3].subtitle}</Text>
              <Text style={styles.w2gAuthor}>{allWhere2Go[3].author}</Text>
            </Pressable>
            {w2gCount > 6 && (
              <Pressable style={styles.w2gShort}>
                <Image source={{ uri: allWhere2Go[6].image }} style={StyleSheet.absoluteFillObject} contentFit="cover" />
                <LinearGradient colors={['transparent', 'rgba(0,0,0,0.65)']} style={StyleSheet.absoluteFillObject} />
                <View style={styles.w2gLocRow}>
                  <MaterialCommunityIcons name="map-marker" size={11} color="#FFF" />
                  <Text style={styles.w2gLoc}>{allWhere2Go[6].location}</Text>
                </View>
                <Text style={styles.w2gSub}>{allWhere2Go[6].subtitle}</Text>
              </Pressable>
            )}
            {w2gCount > 8 && (
              <Pressable style={styles.w2gShort}>
                <Image source={{ uri: allWhere2Go[8].image }} style={StyleSheet.absoluteFillObject} contentFit="cover" />
                <LinearGradient colors={['transparent', 'rgba(0,0,0,0.65)']} style={StyleSheet.absoluteFillObject} />
                <View style={styles.w2gLocRow}>
                  <MaterialCommunityIcons name="map-marker" size={11} color="#FFF" />
                  <Text style={styles.w2gLoc}>{allWhere2Go[8].location}</Text>
                </View>
                <Text style={styles.w2gSub}>{allWhere2Go[8].subtitle}</Text>
              </Pressable>
            )}
          </View>

          <View style={styles.w2gCol}>
            {/* Sponsored */}
            <Pressable style={[styles.w2gShort, { backgroundColor: '#E2E8F0' }]}>
              <Image source={{ uri: allWhere2Go[1].image }} style={StyleSheet.absoluteFillObject} contentFit="cover" />
              <View style={styles.sponsoredTag}>
                <MaterialCommunityIcons name="flag-outline" size={9} color="#64748B" />
                <Text style={styles.sponsoredText}>Sponsored</Text>
              </View>
              <View style={styles.sponsoredTextBox}>
                <Text style={styles.sponsoredTitle}>{allWhere2Go[1].text}</Text>
              </View>
            </Pressable>
            {/* Kenya video */}
            <Pressable style={styles.w2gShort}>
              <Image source={{ uri: allWhere2Go[2].image }} style={StyleSheet.absoluteFillObject} contentFit="cover" />
              <LinearGradient colors={['transparent', 'rgba(0,0,0,0.7)']} style={StyleSheet.absoluteFillObject} />
              <View style={styles.videoBadge}><Text style={styles.videoBadgeText}>{allWhere2Go[2].video}</Text></View>
              <View style={styles.playCircle}><MaterialCommunityIcons name="play" size={18} color="#FFF" /></View>
              <View style={styles.w2gLocRow}>
                <MaterialCommunityIcons name="map-marker" size={11} color="#FFF" />
                <Text style={styles.w2gLoc}>{allWhere2Go[2].location}</Text>
              </View>
            </Pressable>
            <View style={styles.w2gMeta}>
              <Text style={styles.w2gMetaTitle}>{allWhere2Go[2].subtitle}</Text>
              <Text style={styles.w2gMetaAuthor}>{allWhere2Go[2].author}</Text>
            </View>
            {/* Hotel rating */}
            <Pressable style={styles.w2gShort}>
              <Image source={{ uri: allWhere2Go[4].image }} style={StyleSheet.absoluteFillObject} contentFit="cover" />
              <LinearGradient colors={['transparent', 'rgba(0,0,0,0.65)']} style={StyleSheet.absoluteFillObject} />
              <View style={styles.ratingBadge}><Text style={styles.ratingText}>{allWhere2Go[4].rating}</Text></View>
              <Text style={styles.w2gHotelTitle}>{allWhere2Go[4].title}</Text>
              <Text style={styles.w2gHotelLoc}>{allWhere2Go[4].location}</Text>
            </Pressable>
            {w2gCount > 6 && (
              <Pressable style={styles.w2gShort}>
                <Image source={{ uri: allWhere2Go[7].image }} style={StyleSheet.absoluteFillObject} contentFit="cover" />
                <LinearGradient colors={['transparent', 'rgba(0,0,0,0.65)']} style={StyleSheet.absoluteFillObject} />
                <View style={styles.w2gLocRow}>
                  <MaterialCommunityIcons name="map-marker" size={11} color="#FFF" />
                  <Text style={styles.w2gLoc}>{allWhere2Go[7].location}</Text>
                </View>
                <Text style={styles.w2gSub}>{allWhere2Go[7].subtitle}</Text>
              </Pressable>
            )}
            {w2gCount > 8 && (
              <Pressable style={styles.w2gShort}>
                <Image source={{ uri: allWhere2Go[9].image }} style={StyleSheet.absoluteFillObject} contentFit="cover" />
                <LinearGradient colors={['transparent', 'rgba(0,0,0,0.65)']} style={StyleSheet.absoluteFillObject} />
                <View style={styles.w2gLocRow}>
                  <MaterialCommunityIcons name="map-marker" size={11} color="#FFF" />
                  <Text style={styles.w2gLoc}>{allWhere2Go[9].location}</Text>
                </View>
                <Text style={styles.w2gSub}>{allWhere2Go[9].subtitle}</Text>
              </Pressable>
            )}
          </View>
        </View>

        {/* VIEW MORE Button */}
        {w2gCount < allWhere2Go.length && (
          <Pressable style={styles.viewMoreBtn} onPress={() => setW2gCount(prev => Math.min(prev + 4, allWhere2Go.length))}>
            <Text style={styles.viewMoreText}>VIEW MORE</Text>
            <MaterialCommunityIcons name="chevron-right-circle" size={20} color="#FFF" />
          </Pressable>
        )}
        {w2gCount >= allWhere2Go.length && (
          <View style={styles.allLoadedBadge}>
            <MaterialCommunityIcons name="check-circle" size={18} color="#10B981" />
            <Text style={styles.allLoadedText}>You&apos;ve seen it all!</Text>
          </View>
        )}

        {/* Adventure Footer */}
        <View style={styles.adventureFooter}>
          <Text style={styles.adventureSmall}>Where can your next adventure</Text>
          <Text style={styles.adventureBig}>take you ?</Text>
        </View>

      </ScrollView>

      {/* ── VIEW ALL OFFERS MODAL ── */}
      <Modal visible={showAllOffers} animationType="slide" onRequestClose={() => setShowAllOffers(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Pressable onPress={() => setShowAllOffers(false)} style={styles.modalBack}>
              <MaterialCommunityIcons name="arrow-left" size={24} color="#0F172A" />
            </Pressable>
            <Text style={styles.modalTitle}>All Offers</Text>
          </View>
          <FlatList
            data={Object.values(allOffers).flat()}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ padding: 16, gap: 16 }}
            renderItem={({ item }) => (
              <Pressable style={styles.modalOfferCard}>
                <ImageBackground source={{ uri: item.image }} style={{ height: 160, borderRadius: 14, overflow: 'hidden', justifyContent: 'flex-end' }}>
                  <LinearGradient colors={['transparent', 'rgba(0,0,0,0.8)']} style={StyleSheet.absoluteFillObject} />
                  <View style={{ padding: 14 }}>
                    <Text style={styles.offerLabel}>{item.label}</Text>
                    <Text style={styles.offerTitle}>{item.title}</Text>
                    <Text style={styles.offerSubtitle}>{item.subtitle}</Text>
                  </View>
                </ImageBackground>
              </Pressable>
            )}
          />
        </View>
      </Modal>

      {/* ── BOTTOM TAB BAR ── */}
      <View style={styles.bottomTabBar}>
        <View style={styles.tabItem}>
          <MaterialCommunityIcons name="home" size={24} color="#0084FF" />
          <Text style={[styles.tabLabel, { color: '#0084FF', fontWeight: '800' }]}>Home</Text>
        </View>
        <View style={styles.tabItem}>
          <MaterialCommunityIcons name="briefcase-outline" size={24} color="#64748B" />
          <Text style={styles.tabLabel}>My Trips</Text>
        </View>
        <View style={styles.myraWrap}>
          <LinearGradient colors={['#6EE7B7', '#3B82F6', '#9333EA']} style={styles.myraOuter}>
            <View style={styles.myraInner}>
              <MaterialCommunityIcons name="microphone" size={22} color="#FFF" />
            </View>
          </LinearGradient>
          <Text style={styles.myraLabel}>myra.AI</Text>
        </View>
        <View style={styles.tabItem}>
          <MaterialCommunityIcons name="compass-outline" size={24} color="#64748B" />
          <Text style={styles.tabLabel}>Where2Go</Text>
        </View>
        <View style={styles.tabItem}>
          <MaterialCommunityIcons name="credit-card-outline" size={24} color="#64748B" />
          <Text style={styles.tabLabel}>Credit Card</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  scrollContent: { paddingBottom: 130 },

  // Header — unchanged
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 60, paddingBottom: 16, backgroundColor: '#FFFFFF', borderBottomLeftRadius: 24, borderBottomRightRadius: 24, zIndex: 10, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, elevation: 4 },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  headerTitle: { fontSize: 18, fontWeight: '900', color: '#0F172A' },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  headerActionBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#E0F2FE', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
  headerActionBtnText: { fontSize: 12, fontWeight: '800', color: '#0369A1' },
  headerAction: { alignItems: 'center', justifyContent: 'center', position: 'relative' },
  notifDot: { position: 'absolute', top: -2, right: 2, width: 8, height: 8, borderRadius: 4, backgroundColor: '#EF4444', borderWidth: 1.5, borderColor: '#FFFFFF' },

  // Grid — unchanged
  mainGridCard: { backgroundColor: '#FFFFFF', marginHorizontal: 16, borderRadius: 24, paddingTop: 20, paddingHorizontal: 12, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 12, shadowOffset: { width: 0, height: 6 }, elevation: 4, marginTop: 24, marginBottom: 24 },
  unifiedGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  unifiedModule: { width: '25%', alignItems: 'center', paddingVertical: 12, gap: 8 },
  unifiedIconContainer: { position: 'relative', width: 48, height: 48, borderRadius: 24, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center' },
  badgeWrapper: { position: 'absolute', top: -6, left: '50%', marginLeft: -16, backgroundColor: '#EF4444', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 10, zIndex: 2, borderWidth: 1, borderColor: '#FFF' },
  badgeText: { color: '#FFF', fontSize: 7, fontWeight: '900', textTransform: 'uppercase' },
  unifiedModuleLabel: { fontSize: 10, fontWeight: '600', color: '#334155', textAlign: 'center', lineHeight: 12 },
  chevronWrapper: { alignItems: 'center', paddingVertical: 6, marginTop: 8 },

  // Section
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, marginBottom: 14 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#0F172A', letterSpacing: -0.3 },
  viewAllBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  viewAllText: { fontSize: 12, fontWeight: '700', color: '#0084FF' },

  // Pills
  pillsRow: { paddingHorizontal: 16, gap: 8, marginBottom: 14 },
  pill: { paddingHorizontal: 18, paddingVertical: 7, borderRadius: 8, backgroundColor: '#FFF', borderWidth: 1, borderColor: '#E2E8F0' },
  pillActive: { backgroundColor: '#E0F2FE', borderColor: '#0084FF' },
  pillText: { fontSize: 12, fontWeight: '600', color: '#475569' },
  pillTextActive: { color: '#0084FF', fontWeight: '800' },

  // Flight Deal Cards
  dealsSubtitle: { fontSize: 13, fontWeight: '700', color: '#475569', paddingHorizontal: 16, marginBottom: 10 },
  flightDealsRow: { paddingHorizontal: 16, gap: 12 },
  flightDealCard: { width: 180, backgroundColor: '#FFF', borderRadius: 16, padding: 14, shadowColor: '#000', shadowOpacity: 0.07, shadowRadius: 8, elevation: 3, borderWidth: 1, borderColor: '#E0F2FE' },
  fdTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  fdTagWrap: { backgroundColor: '#FEF3C7', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  fdTag: { fontSize: 8, fontWeight: '900', color: '#D97706' },
  fdAirline: { fontSize: 10, fontWeight: '700', color: '#64748B' },
  fdMiddle: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 14 },
  fdCity: { alignItems: 'center', flex: 1 },
  fdCode: { fontSize: 18, fontWeight: '900', color: '#0F172A' },
  fdCityName: { fontSize: 9, color: '#64748B', fontWeight: '500' },
  fdArrowWrap: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  fdLine: { width: 18, height: 1, backgroundColor: '#CBD5E1' },
  fdBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', borderTopWidth: 1, borderColor: '#F1F5F9', paddingTop: 10 },
  fdDate: { fontSize: 9, color: '#64748B', fontWeight: '600' },
  fdDuration: { fontSize: 9, color: '#94A3B8', marginTop: 2 },
  fdPrice: { fontSize: 17, fontWeight: '900', color: '#0084FF' },

  // Offer Cards
  offerRow: { paddingHorizontal: 16, gap: 12 },
  offerCard: { width: screenWidth * 0.68, height: 182, borderRadius: 14, overflow: 'hidden', elevation: 4, shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 8 },
  offerBadge: { position: 'absolute', top: 12, right: 12, backgroundColor: 'rgba(255,255,255,0.92)', paddingHorizontal: 7, paddingVertical: 3, borderRadius: 4 },
  offerBadgeText: { fontSize: 9, fontWeight: '900', color: '#1E293B' },
  offerContent: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 14 },
  offerLabel: { color: '#E2E8F0', fontSize: 10, fontWeight: '700', marginBottom: 2 },
  offerTitle: { color: '#FFF', fontSize: 20, fontWeight: '900', marginBottom: 2 },
  offerSubtitle: { color: '#CBD5E1', fontSize: 10, fontWeight: '500', marginBottom: 6 },
  kotakRow: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 6, padding: 7 },
  kotakBadge: { backgroundColor: '#CC0000', paddingHorizontal: 5, paddingVertical: 2, borderRadius: 3 },
  kotakBadgeText: { color: '#FFF', fontSize: 9, fontWeight: '900' },
  kotakNote: { color: '#E2E8F0', fontSize: 8, fontWeight: '500', flex: 1, lineHeight: 11 },

  // Airlines — wider cards, no blue overlay
  airlinesRow: { paddingHorizontal: 16, gap: 12 },
  airlineCard: { width: 110, height: 140, borderRadius: 55, overflow: 'hidden', justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 16 },
  airlineName: { color: '#FFF', fontSize: 11, fontWeight: '800', textAlign: 'center', zIndex: 2, lineHeight: 14, textShadowColor: 'rgba(0,0,0,0.8)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 3 },
  tailWing: { position: 'absolute', bottom: -4, width: 28, height: 5, borderRadius: 3 },

  // Hotels
  hotelsGrid: { flexDirection: 'row', paddingHorizontal: 16, gap: 10, height: 220 },
  hotelLarge: { flex: 1.1, borderRadius: 16, overflow: 'hidden', padding: 12, justifyContent: 'space-between' },
  hotelLogoBadge: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 5, borderRadius: 20 },
  hotelLogoText: { fontSize: 10, fontWeight: '900' },
  hotelTitleLarge: { color: '#FFF', fontSize: 14, fontWeight: '900', lineHeight: 18 },
  hotelRightCol: { flex: 1, gap: 10 },
  hotelSmall: { flex: 1, borderRadius: 14, overflow: 'hidden', padding: 10, justifyContent: 'space-between' },
  hotelLogoBadgeSmall: { alignSelf: 'flex-start', paddingHorizontal: 6, paddingVertical: 4, borderRadius: 20 },
  hotelLogoTextSmall: { fontSize: 8, fontWeight: '900', textAlign: 'center', lineHeight: 10 },
  hotelTitleSmall: { color: '#FFF', fontSize: 12, fontWeight: '900', lineHeight: 15 },

  // Stories
  storiesRow: { paddingHorizontal: 16, gap: 14 },
  storyWrap: { alignItems: 'center', width: 76, gap: 6 },
  storyBorder: { width: 66, height: 66, borderRadius: 33, padding: 2.5, justifyContent: 'center', alignItems: 'center' },
  storyInner: { width: '100%', height: '100%', borderRadius: 30, backgroundColor: '#FFF', overflow: 'hidden' },
  storyLabel: { fontSize: 10, fontWeight: '500', color: '#475569', textAlign: 'center', lineHeight: 13 },

  // Discover
  discoverCard: { flexDirection: 'row', marginHorizontal: 16, backgroundColor: '#FFF', borderRadius: 16, paddingVertical: 16, borderWidth: 1, borderColor: '#E2E8F0' },
  discoverItem: { flex: 1, alignItems: 'center', gap: 6 },
  discoverDivider: { width: 1, backgroundColor: '#E2E8F0', marginVertical: 4 },
  discoverLabel: { fontSize: 11, fontWeight: '700', color: '#334155', textAlign: 'center', lineHeight: 15 },

  // Hosting
  hostingBanner: { marginHorizontal: 16, height: 130, borderRadius: 16, overflow: 'hidden', justifyContent: 'flex-end' },
  hostingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 14 },
  hostingText: { color: '#FFF', fontSize: 15, fontWeight: '800', flex: 1 },

  // Partner
  partnerCard: { marginHorizontal: 16, borderRadius: 16, overflow: 'hidden', flexDirection: 'row', height: 172 },
  partnerLeft: { flex: 1, backgroundColor: '#1A56C4', padding: 16, justifyContent: 'center' },
  pGetForex: { color: '#A0C4FF', fontSize: 10, fontWeight: '700', letterSpacing: 1 },
  pOn: { color: '#FFF', fontSize: 11, fontWeight: '400', marginTop: 2 },
  pMmtRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  pMake: { color: '#FFF', fontSize: 15, fontWeight: '300', fontStyle: 'italic' },
  pMyBadge: { backgroundColor: '#E53E3E', paddingHorizontal: 4, paddingVertical: 1, borderRadius: 3 },
  pMyText: { color: '#FFF', fontSize: 13, fontWeight: '900' },
  pTrip: { color: '#FFF', fontSize: 15, fontWeight: '800' },
  pPowered: { color: '#A0C4FF', fontSize: 8, fontWeight: '600', letterSpacing: 0.5 },
  pBookMyForex: { color: '#FFF', fontSize: 11, fontWeight: '800' },
  partnerRight: { flex: 1.1, backgroundColor: '#E53E3E', padding: 14, justifyContent: 'center', alignItems: 'center' },
  pHeading: { color: '#FFF', fontSize: 14, fontWeight: '800', textAlign: 'center' },
  pGuaranteed: { color: '#FFF', fontSize: 12, fontWeight: '400', textAlign: 'center' },
  pDivider: { width: '80%', height: 1, backgroundColor: 'rgba(255,255,255,0.4)', marginVertical: 8 },
  pSameDay: { color: '#FFF', fontSize: 12, fontWeight: '400' },
  pDoorstep: { color: '#FFF', fontSize: 16, fontWeight: '900' },
  orderBtn: { backgroundColor: '#0F172A', paddingHorizontal: 18, paddingVertical: 8, borderRadius: 6, marginTop: 10 },
  orderBtnText: { color: '#FFF', fontSize: 11, fontWeight: '900', letterSpacing: 1 },
  pTnc: { color: 'rgba(255,255,255,0.65)', fontSize: 9, marginTop: 5 },
  adRow: { flexDirection: 'row', alignItems: 'center', gap: 3, justifyContent: 'flex-end', paddingHorizontal: 16, marginTop: 4, marginBottom: 4 },
  adText: { fontSize: 10, color: '#94A3B8', fontWeight: '600' },

  // Where 2 Go
  w2gGrid: { flexDirection: 'row', paddingHorizontal: 16, gap: 10 },
  w2gCol: { flex: 1, gap: 10 },
  w2gTall: { height: 260, borderRadius: 16, overflow: 'hidden', justifyContent: 'flex-end', padding: 12 },
  w2gShort: { height: 130, borderRadius: 16, overflow: 'hidden', justifyContent: 'flex-end', padding: 10 },
  w2gLocRow: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  w2gLoc: { color: '#FFF', fontSize: 12, fontWeight: '700' },
  w2gSub: { color: '#FFF', fontSize: 10, fontWeight: '500', marginTop: 2 },
  w2gAuthor: { color: 'rgba(255,255,255,0.7)', fontSize: 9, marginTop: 1 },
  sponsoredTag: { position: 'absolute', top: 8, left: 8, flexDirection: 'row', alignItems: 'center', gap: 2 },
  sponsoredText: { fontSize: 9, color: '#64748B', fontWeight: '600' },
  sponsoredTextBox: { padding: 8 },
  sponsoredTitle: { fontSize: 11, fontWeight: '700', color: '#1E293B', lineHeight: 15 },
  videoBadge: { position: 'absolute', top: 8, right: 8, backgroundColor: 'rgba(0,0,0,0.55)', paddingHorizontal: 5, paddingVertical: 2, borderRadius: 4 },
  videoBadgeText: { color: '#FFF', fontSize: 9, fontWeight: '700' },
  playCircle: { position: 'absolute', top: '30%', alignSelf: 'center', width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center' },
  w2gMeta: { backgroundColor: '#FFF', borderRadius: 12, padding: 10, marginTop: -4 },
  w2gMetaTitle: { fontSize: 11, fontWeight: '700', color: '#1E293B', lineHeight: 14 },
  w2gMetaAuthor: { fontSize: 10, color: '#64748B', marginTop: 2 },
  ratingBadge: { position: 'absolute', top: 8, left: 8, backgroundColor: 'rgba(0,0,0,0.55)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  ratingText: { color: '#FFF', fontSize: 9, fontWeight: '700' },
  w2gHotelTitle: { color: '#FFF', fontSize: 11, fontWeight: '800', lineHeight: 14 },
  w2gHotelLoc: { color: 'rgba(255,255,255,0.75)', fontSize: 9, marginTop: 1 },

  // View More
  viewMoreBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginHorizontal: 16, marginTop: 20, backgroundColor: '#0084FF', borderRadius: 12, paddingVertical: 14 },
  viewMoreText: { color: '#FFF', fontSize: 14, fontWeight: '900', letterSpacing: 1 },
  allLoadedBadge: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 20 },
  allLoadedText: { fontSize: 13, fontWeight: '700', color: '#10B981' },

  // Adventure
  adventureFooter: { marginHorizontal: 16, marginTop: 32, paddingBottom: 16 },
  adventureSmall: { fontSize: 13, color: '#64748B' },
  adventureBig: { fontSize: 28, fontWeight: '900', color: '#0EA5E9', marginTop: 2 },

  // Modal
  modalContainer: { flex: 1, backgroundColor: '#F8FAFC' },
  modalHeader: { flexDirection: 'row', alignItems: 'center', gap: 16, paddingHorizontal: 16, paddingTop: 56, paddingBottom: 16, backgroundColor: '#FFF', borderBottomWidth: 1, borderColor: '#E2E8F0' },
  modalBack: { padding: 4 },
  modalTitle: { fontSize: 18, fontWeight: '900', color: '#0F172A' },
  modalOfferCard: { borderRadius: 14, overflow: 'hidden' },

  // Bottom Tab
  bottomTabBar: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 76, backgroundColor: '#FFF', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', borderTopWidth: 1, borderColor: '#E2E8F0', paddingBottom: 6 },
  tabItem: { alignItems: 'center', justifyContent: 'center', gap: 3 },
  tabLabel: { fontSize: 10, fontWeight: '600', color: '#64748B' },
  myraWrap: { alignItems: 'center', top: -14 },
  myraOuter: { width: 52, height: 52, borderRadius: 26, padding: 3, shadowColor: '#3B82F6', shadowOpacity: 0.35, shadowRadius: 8, elevation: 6 },
  myraInner: { width: '100%', height: '100%', borderRadius: 23, backgroundColor: '#1E293B', justifyContent: 'center', alignItems: 'center' },
  myraLabel: { fontSize: 10, fontWeight: '800', color: '#3A53A4', marginTop: 4 },
});
