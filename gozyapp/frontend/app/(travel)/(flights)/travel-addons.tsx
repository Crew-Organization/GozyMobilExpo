import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, SafeAreaView, Modal, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';

import { useSuperAppStore } from '@/src/store/super-app-store';
import { formatCurrency } from '@/src/lib/travel-data';
import { colors } from '@/src/theme/tokens';

const { height } = Dimensions.get('window');

const tabs = ['SEATS', 'MEALS', 'CABS', 'ADD-ONS'];

export default function TravelAddonsScreen() {
  const { selectedTravelOffer, travelSearch } = useSuperAppStore();
  const [activeTab, setActiveTab] = useState('SEATS');

  // Add-on states
  const [selectedSeat, setSelectedSeat] = useState<string | null>(null);
  const [selectedMeal, setSelectedMeal] = useState<string | null>(null);
  const [showMealWarning, setShowMealWarning] = useState(false);
  const [showReviewTrip, setShowReviewTrip] = useState(false);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (!selectedTravelOffer) {
      router.replace('/travel-results');
    }
  }, [selectedTravelOffer]);

  if (!selectedTravelOffer) {
    return null;
  }

  const displayPrice = selectedTravelOffer.price + (selectedSeat === '1A' ? 400 : 0);

  const handleContinue = () => {
    if (!selectedMeal && !showMealWarning && !showReviewTrip) {
      setShowMealWarning(true);
    } else if (showMealWarning) {
      setShowMealWarning(false);
      setShowReviewTrip(true);
    } else {
      setShowReviewTrip(true);
    }
  };

  return (
    <View style={styles.safeArea}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 16) }]}>
        <View style={styles.headerLeft}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <MaterialCommunityIcons name="arrow-left" size={24} color={colors.text} />
          </Pressable>
          <Text style={styles.headerTitle}>Add-ons</Text>
        </View>
        <Pressable onPress={() => router.push('/travel-payment')}>
          <Text onPress={() => alert("Feature coming soon!")} style={{color: '#0084FF', fontSize: 12, fontWeight: '800'}}>Skip To Payment</Text>
        </Pressable>
      </View>

      {/* Tabs Selector */}
      <View style={styles.tabScrollContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabScrollContent}>
          {tabs.map((tab) => {
            const active = activeTab === tab;
            return (
              <Pressable key={tab} onPress={() => setActiveTab(tab)} style={[styles.tabBtn, active && styles.tabBtnActive]}>
                 <Text style={[styles.tabText, active && styles.tabTextActive]}>{tab}</Text>
                 {tab === 'CABS' && <View style={styles.newBadge}><Text style={styles.newBadgeText}>NEW</Text></View>}
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* Content Area */}
      <View style={{ flex: 1, backgroundColor: '#F2F4F7' }}>
        {activeTab === 'SEATS' && (
           <View style={{flex: 1}}>
             <View style={{backgroundColor: '#0084FF', padding: 12, flexDirection: 'row', alignItems: 'center'}}>
               <Text style={{color: '#FFF', fontSize: 13, fontWeight: '800', marginRight: 8}}>{travelSearch.originCode} - {travelSearch.destinationCode}</Text>
             </View>
             
             <View style={{backgroundColor: '#EBF4FF', padding: 12, alignItems: 'center', margin: 16, borderRadius: 8}}>
               <Text onPress={() => alert("Feature coming soon!")} style={{fontSize: 12, color: '#0084FF', fontWeight: '700'}}>🏷 Use code MMTSEAT free seat (upto 250 passengers)</Text>
             </View>

             {/* Mock Seat Map Container */}
             <ScrollView style={{flex: 1}} contentContainerStyle={{alignItems: 'center', paddingBottom: 100, paddingTop: 20}} showsVerticalScrollIndicator={false}>
                {/* Airplane Nose Mock */}
                <View style={{width: 280, height: 100, backgroundColor: '#E5E5EA', borderTopLeftRadius: 140, borderTopRightRadius: 140, alignItems: 'center', justifyContent: 'flex-end', marginBottom: 20}}>
                   <View style={{width: 60, height: 30, backgroundColor: '#FFF', borderTopLeftRadius: 30, borderTopRightRadius: 30, marginBottom: 10}} />
                </View>

                {/* Seat Grid */}
                <View style={{flexDirection: 'row', gap: 40}}>
                   {/* ABC Side */}
                   <View style={{gap: 8}}>
                     {[1,2,3,4,5,6,7,8].map(row => (
                       <View key={`row-left-${row}`} style={{flexDirection: 'row', gap: 4}}>
                         <Pressable onPress={() => setSelectedSeat(`${row}A`)} style={[styles.seatBox, selectedSeat === `${row}A` && styles.seatBoxSelected, row <= 2 && styles.seatBoxPremium]}>
                           <MaterialCommunityIcons name="seat-passenger" size={16} color={selectedSeat === `${row}A` ? '#FFF' : (row <= 2 ? '#FFF' : '#333')} />
                         </Pressable>
                         <Pressable onPress={() => setSelectedSeat(`${row}B`)} style={[styles.seatBox, selectedSeat === `${row}B` && styles.seatBoxSelected, row <= 2 && styles.seatBoxPremium]}>
                           <MaterialCommunityIcons name="seat-passenger" size={16} color={selectedSeat === `${row}B` ? '#FFF' : (row <= 2 ? '#FFF' : '#333')} />
                         </Pressable>
                         <Pressable onPress={() => setSelectedSeat(`${row}C`)} style={[styles.seatBox, selectedSeat === `${row}C` && styles.seatBoxSelected, row <= 2 && styles.seatBoxPremium]}>
                           <MaterialCommunityIcons name="seat-passenger" size={16} color={selectedSeat === `${row}C` ? '#FFF' : (row <= 2 ? '#FFF' : '#333')} />
                         </Pressable>
                       </View>
                     ))}
                   </View>

                   {/* DEF Side */}
                   <View style={{gap: 8}}>
                     {[1,2,3,4,5,6,7,8].map(row => (
                       <View key={`row-right-${row}`} style={{flexDirection: 'row', gap: 4}}>
                         <Pressable onPress={() => setSelectedSeat(`${row}D`)} style={[styles.seatBox, selectedSeat === `${row}D` && styles.seatBoxSelected, row <= 2 && styles.seatBoxPremium]}>
                           <MaterialCommunityIcons name="seat-passenger" size={16} color={selectedSeat === `${row}D` ? '#FFF' : (row <= 2 ? '#FFF' : '#333')} />
                         </Pressable>
                         <Pressable onPress={() => setSelectedSeat(`${row}E`)} style={[styles.seatBox, selectedSeat === `${row}E` && styles.seatBoxSelected, row <= 2 && styles.seatBoxPremium]}>
                           <MaterialCommunityIcons name="seat-passenger" size={16} color={selectedSeat === `${row}E` ? '#FFF' : (row <= 2 ? '#FFF' : '#333')} />
                         </Pressable>
                         <Pressable onPress={() => setSelectedSeat(`${row}F`)} style={[styles.seatBox, selectedSeat === `${row}F` && styles.seatBoxSelected, row <= 2 && styles.seatBoxPremium]}>
                           <MaterialCommunityIcons name="seat-passenger" size={16} color={selectedSeat === `${row}F` ? '#FFF' : (row <= 2 ? '#FFF' : '#333')} />
                         </Pressable>
                       </View>
                     ))}
                   </View>
                </View>

             </ScrollView>

             {/* Legend */}
             <View style={{backgroundColor: '#FFF', padding: 12, flexDirection: 'row', justifyContent: 'space-around', borderTopWidth: 1, borderTopColor: '#E5E5EA'}}>
               <View style={{flexDirection: 'row', alignItems: 'center'}}><View style={[styles.legendBox, {backgroundColor: '#E5E5EA'}]}/><Text style={styles.legendText}>Free</Text></View>
               <View style={{flexDirection: 'row', alignItems: 'center'}}><View style={[styles.legendBox, {backgroundColor: '#0084FF'}]}/><Text style={styles.legendText}>₹150 - ₹400</Text></View>
               <View style={{flexDirection: 'row', alignItems: 'center'}}><View style={[styles.legendBox, {backgroundColor: '#9333EA'}]}/><Text style={styles.legendText}>₹500 - ₹1495</Text></View>
               <View style={{flexDirection: 'row', alignItems: 'center'}}><MaterialCommunityIcons name="arrow-split-vertical" size={14} color="#EF4444" /><Text style={styles.legendText}>Exit Row</Text></View>
             </View>
           </View>
        )}

        {activeTab === 'MEALS' && (
          <ScrollView style={{padding: 16}}>
             <Text onPress={() => alert("Feature coming soon!")} style={{fontSize: 16, fontWeight: '800', color: '#0084FF', marginBottom: 16}}>In-flight meals</Text>
             
             <View style={styles.addonCard}>
               <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                 <View style={{flexDirection: 'row', alignItems: 'center'}}>
                   <MaterialCommunityIcons name="food-drumstick" size={24} color="#EF4444" />
                   <View style={{marginLeft: 12}}>
                     <Text style={{fontSize: 13, fontWeight: '800', color: '#333'}}>Non-Vegetarian Meal</Text>
                     <Text style={{fontSize: 12, color: '#16A34A', fontWeight: '700', marginTop: 4}}>Free</Text>
                   </View>
                 </View>
                 <Pressable onPress={() => setSelectedMeal('NonVeg')} style={selectedMeal === 'NonVeg' ? styles.addBtnActive : styles.addBtn}>
                   <Text style={selectedMeal === 'NonVeg' ? styles.addBtnTextActive : styles.addBtnText}>{selectedMeal === 'NonVeg' ? 'ADDED' : 'ADD'}</Text>
                 </Pressable>
               </View>
             </View>

             <View style={styles.addonCard}>
               <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                 <View style={{flexDirection: 'row', alignItems: 'center'}}>
                   <MaterialCommunityIcons name="leaf" size={24} color="#16A34A" />
                   <View style={{marginLeft: 12}}>
                     <Text style={{fontSize: 13, fontWeight: '800', color: '#333'}}>Vegetarian Meal</Text>
                     <Text style={{fontSize: 12, color: '#16A34A', fontWeight: '700', marginTop: 4}}>Free</Text>
                   </View>
                 </View>
                 <Pressable onPress={() => setSelectedMeal('Veg')} style={selectedMeal === 'Veg' ? styles.addBtnActive : styles.addBtn}>
                   <Text style={selectedMeal === 'Veg' ? styles.addBtnTextActive : styles.addBtnText}>{selectedMeal === 'Veg' ? 'ADDED' : 'ADD'}</Text>
                 </Pressable>
               </View>
             </View>
          </ScrollView>
        )}

        {activeTab === 'CABS' && (
          <ScrollView style={{padding: 16}}>
             <View style={styles.addonCard}>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                   <View>
                     <Text style={{fontSize: 16, fontWeight: '800', color: '#333'}}>Ride Guarantee</Text>
                     <Text style={{fontSize: 10, color: '#8E8E93', marginTop: 4}}>Cancel cab for free if flight reschedules. <Text onPress={() => alert("Feature coming soon!")} style={{color: '#0084FF'}}>Know more</Text></Text>
                   </View>
                   <MaterialCommunityIcons name="shield-car" size={30} color="#9333EA" />
                </View>

                <View style={{flexDirection: 'row', marginTop: 16, gap: 12}}>
                  <View style={{backgroundColor: '#EBF4FF', paddingVertical: 6, paddingHorizontal: 16, borderRadius: 20}}>
                     <Text onPress={() => alert("Feature coming soon!")} style={{fontSize: 10, color: '#0084FF', fontWeight: '800'}}>To {travelSearch.originCode} airport</Text>
                  </View>
                  <View style={{paddingVertical: 6, paddingHorizontal: 16, borderRadius: 20, borderWidth: 1, borderColor: '#E5E5EA'}}>
                     <Text style={{fontSize: 10, color: '#8E8E93', fontWeight: '800'}}>From {travelSearch.destinationCode} airport</Text>
                  </View>
                </View>

                <View style={{borderWidth: 1, borderColor: '#E5E5EA', borderRadius: 8, marginTop: 16}}>
                  <View style={{padding: 12, borderBottomWidth: 1, borderBottomColor: '#E5E5EA'}}>
                    <Text style={{fontSize: 10, color: '#8E8E93', fontWeight: '700', marginBottom: 4}}>DROP LOCATION</Text>
                    <Text style={{fontSize: 13, color: '#333', fontWeight: '800'}}>{travelSearch.originCity} Airport</Text>
                  </View>
                  <View style={{padding: 12}}>
                    <Text style={{fontSize: 10, color: '#8E8E93', fontWeight: '700', marginBottom: 4}}>PICKUP TIME</Text>
                    <Text style={{fontSize: 13, color: '#333', fontWeight: '800'}}>Sat, 11 Apr, 08:30 PM</Text>
                    <Text style={{fontSize: 10, color: '#00A699', marginTop: 4}}>Your flight departs from {travelSearch.originCode} at 11:30 PM</Text>
                  </View>
                </View>

                <Pressable style={{borderWidth: 1, borderColor: '#0084FF', borderRadius: 8, paddingVertical: 12, alignItems: 'center', marginTop: 16}}>
                  <Text onPress={() => alert("Feature coming soon!")} style={{color: '#0084FF', fontSize: 12, fontWeight: '800'}}>SEARCH CABS</Text>
                </Pressable>

                <View style={{backgroundColor: '#FFFBEB', padding: 8, borderRadius: 8, flexDirection: 'row', alignItems: 'center', marginTop: 16}}>
                  <MaterialCommunityIcons name="lightning-bolt" size={16} color="#CA8A04" />
                  <Text style={{fontSize: 10, color: '#CA8A04', marginLeft: 8}}>Peak hours in {travelSearch.originCity}! Book now to avoid surge.</Text>
                </View>
             </View>
          </ScrollView>
        )}

        {activeTab === 'ADD-ONS' && (
          <ScrollView style={{padding: 16}}>
             <View style={{backgroundColor: '#0084FF', padding: 16, borderRadius: 8, marginBottom: 16}}>
               <Text style={{fontSize: 16, color: '#FFF', fontWeight: '900'}}>Get more for less! Exclusive services at fab prices</Text>
               <View style={{flexDirection: 'row', marginTop: 12, gap: 12}}>
                 <View style={{backgroundColor: '#005BBB', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20}}>
                   <Text style={{color: '#FFF', fontSize: 10, fontWeight: '800'}}>Flight Delay Protection</Text>
                 </View>
                 <View style={{backgroundColor: 'transparent', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: '#FFF'}}>
                   <Text style={{color: '#FFF', fontSize: 10, fontWeight: '800'}}>Courier Bags</Text>
                 </View>
               </View>
             </View>

             <View style={styles.addonCard}>
               <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#E5E5EA', paddingBottom: 12, marginBottom: 12}}>
                 <Text style={{fontSize: 13, fontWeight: '800', color: '#333'}}>Flight Delay Protection</Text>
                 <MaterialCommunityIcons name="shield-check" size={20} color="#00A699" />
               </View>
               <Text style={{fontSize: 12, fontWeight: '800', color: '#333', marginBottom: 4}}>Flight delay compensation of ₹2000</Text>
               <Text style={{fontSize: 10, color: '#8E8E93', marginBottom: 12, lineHeight: 14}}>
                 Get flat ₹2000 compensation if your flight is delayed for 1 hour or more for any reason. <Text onPress={() => alert("Feature coming soon!")} style={{color: '#0084FF'}}>View T&C</Text>
               </Text>
               <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                 <Text style={{fontSize: 16, fontWeight: '900', color: '#333'}}>₹ 99 <Text style={{fontSize: 10, fontWeight: '400', color: '#8E8E93'}}>/per pax</Text></Text>
                 <Pressable style={styles.addBtn}>
                   <Text style={styles.addBtnText}>ADD</Text>
                 </Pressable>
               </View>
               <View style={{flexDirection: 'row', marginTop: 16, flexWrap: 'wrap', gap: 12}}>
                 <View style={{flexDirection: 'row', alignItems: 'center'}}><MaterialCommunityIcons name="check-circle" size={14} color="#00A699"/><Text style={{fontSize: 10, color: '#8E8E93', marginLeft: 4}}>Covers Any Delay</Text></View>
                 <View style={{flexDirection: 'row', alignItems: 'center'}}><MaterialCommunityIcons name="check-circle" size={14} color="#00A699"/><Text style={{fontSize: 10, color: '#8E8E93', marginLeft: 4}}>Value For Money</Text></View>
                 <View style={{flexDirection: 'row', alignItems: 'center'}}><MaterialCommunityIcons name="check-circle" size={14} color="#00A699"/><Text style={{fontSize: 10, color: '#8E8E93', marginLeft: 4}}>Quick Claims Settlements</Text></View>
                 <View style={{flexDirection: 'row', alignItems: 'center'}}><MaterialCommunityIcons name="check-circle" size={14} color="#00A699"/><Text style={{fontSize: 10, color: '#8E8E93', marginLeft: 4}}>100% Digital Claims</Text></View>
               </View>
             </View>

             <View style={styles.addonCard}>
               <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#E5E5EA', paddingBottom: 12, marginBottom: 12}}>
                 <Text style={{fontSize: 13, fontWeight: '800', color: '#333'}}>Courier Your Bags & Travel Baggage Free</Text>
                 <Text style={{fontSize: 12, fontWeight: '900', color: '#E11D48', fontStyle: 'italic'}}>AIRA MEDIA</Text>
               </View>
               <Text style={{fontSize: 10, color: '#8E8E93', marginBottom: 12, lineHeight: 14}}>
                 Have excess baggage? Send it separately via courier with us directly to the destination. <Text onPress={() => alert("Feature coming soon!")} style={{color: '#0084FF'}}>Know more</Text>
               </Text>
               <Pressable style={{borderWidth: 1, borderColor: '#0084FF', borderRadius: 8, paddingVertical: 12, alignItems: 'center', marginBottom: 16}}>
                  <Text onPress={() => alert("Feature coming soon!")} style={{color: '#0084FF', fontSize: 12, fontWeight: '800'}}>+ Add Delivery location</Text>
               </Pressable>
               <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                 <Text style={{fontSize: 16, fontWeight: '900', color: '#333'}}>₹ 900 for 1 Bag <Text style={{fontSize: 10, fontWeight: '400', color: '#8E8E93'}}>/per pax</Text></Text>
                 <Pressable style={styles.addBtn}>
                   <Text style={styles.addBtnText}>ADD</Text>
                 </Pressable>
               </View>
             </View>

          </ScrollView>
        )}
      </View>

      {/* Sticky Bottom Footer */}
      <View style={{ backgroundColor: '#FFF', borderTopWidth: 1, borderTopColor: '#E5E5EA' }}>
        <View style={styles.stickyFooter}>
          <View>
            <Text style={styles.footerPrice}>{formatCurrency(displayPrice)} ⓘ</Text>
            <Text style={styles.footerSub}>FOR {travelSearch.travellers} ADULT</Text>
          </View>
          <Pressable style={styles.continueBtn} onPress={handleContinue}>
            <Text style={styles.continueBtnText}>CONTINUE</Text>
          </Pressable>
        </View>
      </View>

      {/* Meal Warning Modal */}
      <Modal visible={showMealWarning} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.warningModalContent}>
             <Text style={{fontSize: 18, fontWeight: '900', color: '#333', textAlign: 'center', marginBottom: 12}}>
               Are you sure you want to miss your FREE meal?
             </Text>
             <Text style={{fontSize: 12, color: '#8E8E93', textAlign: 'center', marginBottom: 24, lineHeight: 18}}>
               You are entitled to a FREE meal but you have not selected your preferred meal yet. Select now!
             </Text>

             <View style={{borderWidth: 1, borderColor: '#E5E5EA', borderRadius: 8, padding: 12, width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24}}>
               <View style={{flexDirection: 'row', alignItems: 'center'}}>
                 <MaterialCommunityIcons name="airplane" size={16} color="#EF4444" />
                 <Text style={{fontSize: 13, fontWeight: '800', color: '#333', marginLeft: 8}}>{travelSearch.originCode} - {travelSearch.destinationCode}</Text>
               </View>
               <View style={{flexDirection: 'row', alignItems: 'center', gap: 12}}>
                 <View style={{flexDirection: 'row', alignItems: 'center'}}>
                   <MaterialCommunityIcons name="food-drumstick" size={14} color="#EF4444" />
                   <Text style={{fontSize: 10, color: '#8E8E93', marginLeft: 4}}>0/1</Text>
                 </View>
                 <View style={{flexDirection: 'row', alignItems: 'center'}}>
                   <MaterialCommunityIcons name="leaf" size={14} color="#16A34A" />
                   <Text style={{fontSize: 10, color: '#8E8E93', marginLeft: 4}}>0/1</Text>
                 </View>
               </View>
             </View>

             <View style={{flexDirection: 'row', width: '100%', gap: 16}}>
                <Pressable style={{flex: 1, paddingVertical: 14, alignItems: 'center'}} onPress={() => { setShowMealWarning(false); setActiveTab('MEALS'); }}>
                  <Text style={{color: '#0084FF', fontSize: 13, fontWeight: '800'}}>No, Select Meal</Text>
                </Pressable>
                <Pressable style={{flex: 1, paddingVertical: 14, alignItems: 'center'}} onPress={() => { setShowMealWarning(false); setShowReviewTrip(true); }}>
                  <Text style={{color: '#0084FF', fontSize: 13, fontWeight: '800'}}>Continue</Text>
                </Pressable>
             </View>
          </View>
        </View>
      </Modal>

      {/* Review Trip Details Modal */}
      <Modal visible={showReviewTrip} animationType="slide" presentationStyle="pageSheet">
         <SafeAreaView style={{flex: 1, backgroundColor: '#FFF'}}>
            <View style={{flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#E5E5EA'}}>
              <Pressable onPress={() => setShowReviewTrip(false)}>
                 <MaterialCommunityIcons name="close" size={24} color="#333" />
              </Pressable>
              <Text style={{fontSize: 16, fontWeight: '800', color: '#333', marginLeft: 12}}>Review trip details</Text>
            </View>
            <ScrollView style={{padding: 16}}>
               <View style={{borderWidth: 1, borderColor: '#E5E5EA', borderRadius: 8, padding: 12, marginBottom: 20}}>
                 <View style={{flexDirection: 'row', alignItems: 'flex-start'}}>
                   <Image source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Air_India_Logo.svg/512px-Air_India_Logo.svg.png' }} style={{ width: 24, height: 24, marginRight: 12 }} contentFit="contain" />
                   <View>
                     <Text style={{fontSize: 13, fontWeight: '800', color: '#333'}}>{travelSearch.originCode} - {travelSearch.destinationCode}</Text>
                     <Text style={{fontSize: 12, color: '#333', marginTop: 4}}>Sat, 11 Apr • 23:30 <MaterialCommunityIcons name="airplane" size={12} color="#8E8E93" /> 02:00 <Text style={{fontSize: 10, color: '#EF4444'}}>+1</Text></Text>
                     <Text style={{fontSize: 12, color: '#8E8E93', marginTop: 2}}>2h 30m • Non stop</Text>
                   </View>
                 </View>
               </View>

               <Text style={{fontSize: 16, fontWeight: '900', color: '#333', marginBottom: 12}}>Travellers</Text>
               <View style={{borderWidth: 1, borderColor: '#E5E5EA', borderRadius: 8, padding: 12, marginBottom: 20}}>
                  <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8}}>
                    <Text style={{fontSize: 12, fontWeight: '800', color: '#333'}}>ADULT 1</Text>
                    <Pressable onPress={() => { setShowReviewTrip(false); router.push('/travel-review'); }}>
                      <Text onPress={() => alert("Feature coming soon!")} style={{fontSize: 12, fontWeight: '800', color: '#0084FF'}}>Edit</Text>
                    </Pressable>
                  </View>
                  <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4}}>
                    <Text style={{fontSize: 12, color: '#8E8E93'}}>First & Middle Name</Text>
                    <Text style={{fontSize: 12, color: '#333', fontWeight: '700'}}>Nikhitha</Text>
                  </View>
                  <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4}}>
                    <Text style={{fontSize: 12, color: '#8E8E93'}}>Last Name</Text>
                    <Text style={{fontSize: 12, color: '#333', fontWeight: '700'}}>-</Text>
                  </View>
                  <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                    <Text style={{fontSize: 12, color: '#8E8E93'}}>Gender</Text>
                    <Text style={{fontSize: 12, color: '#333', fontWeight: '700'}}>FEMALE</Text>
                  </View>
               </View>

               <Text style={{fontSize: 10, color: '#8E8E93', lineHeight: 14}}>
                 NOTE: Please review your itinerary & traveller details carefully to avoid late cancellation and fare later.
               </Text>
            </ScrollView>
            <View style={{padding: 16, borderTopWidth: 1, borderTopColor: '#E5E5EA'}}>
               <Pressable onPress={() => { setShowReviewTrip(false); router.push('/travel-payment'); }} style={{ backgroundColor: '#0084FF', borderRadius: 8, paddingVertical: 14, alignItems: 'center' }}>
                  <Text style={{ color: '#FFF', fontSize: 13, fontWeight: '800' }}>Confirm & continue</Text>
               </Pressable>
            </View>
         </SafeAreaView>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFF' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingBottom: 12, backgroundColor: '#FFFFFF' },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  backButton: { marginRight: 12 },
  headerTitle: { fontSize: 18, fontWeight: '900', color: colors.text },
  
  tabScrollContainer: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  tabScrollContent: { paddingHorizontal: 16, paddingVertical: 10, alignItems: 'center', gap: 16 },
  tabBtn: { paddingVertical: 8, paddingHorizontal: 0, borderBottomWidth: 2, borderBottomColor: 'transparent', flexDirection: 'row', alignItems: 'center' },
  tabBtnActive: { borderBottomColor: '#0084FF' },
  tabText: { fontSize: 12, fontWeight: '800', color: '#8E8E93' },
  tabTextActive: { color: '#0084FF' },
  newBadge: { backgroundColor: '#EF4444', paddingHorizontal: 4, paddingVertical: 2, borderRadius: 4, marginLeft: 4 },
  newBadgeText: { color: '#FFF', fontSize: 8, fontWeight: '900' },

  seatBox: { width: 32, height: 32, borderRadius: 4, backgroundColor: '#E5E5EA', alignItems: 'center', justifyContent: 'center' },
  seatBoxPremium: { backgroundColor: '#0084FF' },
  seatBoxSelected: { backgroundColor: '#16A34A', borderWidth: 2, borderColor: '#000' },
  
  legendBox: { width: 12, height: 12, borderRadius: 2, marginRight: 4 },
  legendText: { fontSize: 10, color: '#333' },

  addonCard: { backgroundColor: '#FFF', borderRadius: 12, padding: 16, marginBottom: 16, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, elevation: 2, borderWidth: 1, borderColor: '#E5E5EA' },
  addBtn: { borderWidth: 1, borderColor: '#0084FF', borderRadius: 4, paddingHorizontal: 16, paddingVertical: 6 },
  addBtnText: { color: '#0084FF', fontSize: 12, fontWeight: '800' },
  addBtnActive: { backgroundColor: '#EBF4FF', borderWidth: 1, borderColor: '#0084FF', borderRadius: 4, paddingHorizontal: 16, paddingVertical: 6 },
  addBtnTextActive: { color: '#0084FF', fontSize: 12, fontWeight: '800' },

  stickyFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FFFFFF', paddingHorizontal: 16, paddingVertical: 12, borderTopWidth: 1, borderTopColor: '#E5E5EA' },
  footerPrice: { fontSize: 18, fontWeight: '900', color: '#111827' },
  footerSub: { fontSize: 10.5, color: '#8E8E93', marginTop: 2 },
  continueBtn: { backgroundColor: '#0084FF', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8 },
  continueBtnText: { color: '#FFFFFF', fontSize: 13, fontWeight: '800' },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  warningModalContent: { backgroundColor: '#FFF', borderRadius: 16, padding: 24, width: '100%', alignItems: 'center' },
});
