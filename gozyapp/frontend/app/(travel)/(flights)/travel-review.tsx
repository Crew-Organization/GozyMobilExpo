import React, { useEffect, useState, useRef } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, SafeAreaView, Modal, TextInput, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';

import { useSuperAppStore } from '@/src/store/super-app-store';
import { formatCurrency } from '@/src/lib/travel-data';
import { colors, spacing } from '@/src/theme/tokens';

const { height } = Dimensions.get('window');

const tabs = ['Booking policies', 'Exclusive combos', 'Flexibility add-ons', 'Important info', 'Offers', 'Trip secure', 'Traveller details'];

const coupons = [
  { code: 'MMTSECURE', desc: 'Get an instant discount of ₹ 263 on your flight booking and Trip Secure combo', discount: 263 },
  { code: 'MMTSUPER', desc: 'Get ₹ 197 instant discount on your flight booking', discount: 197 },
  { code: 'RUPAYICICI', desc: 'Get ₹ 996 instant discount on MMT ICICI RuPay Credit card and Get additional 5% myCash', discount: 996 },
];

export default function TravelReviewScreen() {
  const { selectedTravelOffer, travelSearch } = useSuperAppStore();
  const [activeTab, setActiveTab] = useState('Booking policies');
  const scrollViewRef = useRef<ScrollView>(null);
  const insets = useSafeAreaInsets();

  // States
  const [selectedFlex, setSelectedFlex] = useState<string | null>('Free Date Change');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [tripSecure, setTripSecure] = useState<boolean | null>(null); // null means user hasn't decided
  const [adults, setAdults] = useState<any[]>([]); // Added adults
  const [contactEmail, setContactEmail] = useState('nikhitha1312@gmail.com');
  const [contactPhone, setContactPhone] = useState('9876543210');
  
  // Modals
  const [showAddTraveller, setShowAddTraveller] = useState(false);
  const [showSecureWarning, setShowSecureWarning] = useState(false);
  const [showFlightDetails, setShowFlightDetails] = useState(false);
  const [showBaggage, setShowBaggage] = useState(false);
  const [showEditContact, setShowEditContact] = useState(false);
  const [showEditPincode, setShowEditPincode] = useState(false);

  // New traveller form
  const [newGender, setNewGender] = useState<'MALE' | 'FEMALE'>('FEMALE');
  const [newFirstName, setNewFirstName] = useState('');
  const [newLastName, setNewLastName] = useState('');

  useEffect(() => {
    if (!selectedTravelOffer) {
      router.replace('/travel-results');
    }
  }, [selectedTravelOffer]);

  if (!selectedTravelOffer) {
    return null;
  }

  // Calculate pricing
  let displayPrice = selectedTravelOffer.price;
  if (selectedFlex === 'Free Date Change') displayPrice += 434;
  else if (selectedFlex === 'Zero Cancellation') displayPrice += 514;
  else if (selectedFlex === 'FlexiFly') displayPrice += 600;

  if (tripSecure) displayPrice += 299;

  const activeCoupon = coupons.find(c => c.code === appliedCoupon);
  if (activeCoupon) displayPrice -= activeCoupon.discount;

  const handleContinue = () => {
    if (tripSecure === null) {
      setShowSecureWarning(true);
    } else {
      router.push('/travel-addons');
    }
  };

  const handleAddTravellerSave = () => {
    if (newFirstName && newLastName) {
      setAdults([...adults, { firstName: newFirstName, lastName: newLastName, gender: newGender }]);
      setNewFirstName('');
      setNewLastName('');
      setShowAddTraveller(false);
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
          <View>
            <Text style={styles.headerTitle}>{travelSearch.originCity} to {travelSearch.destinationCity}</Text>
            <Text style={styles.headerSubtitle}>11 Apr, {travelSearch.travellers} Adult, {travelSearch.cabinClass}</Text>
          </View>
        </View>
        <View style={styles.headerRight}>
          <MaterialCommunityIcons name="bell-ring-outline" size={20} color="#333" style={{ marginRight: 16 }} />
          <MaterialCommunityIcons name="share-variant-outline" size={20} color="#333" />
        </View>
      </View>

      {/* Sticky Tabs Selector */}
      <View style={styles.tabScrollContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabScrollContent}>
          {tabs.map((tab) => {
            const active = activeTab === tab;
            return (
              <Pressable key={tab} onPress={() => setActiveTab(tab)} style={[styles.tabBtn, active && styles.tabBtnActive]}>
                 <Text style={[styles.tabText, active && styles.tabTextActive]}>{tab}</Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView 
        ref={scrollViewRef}
        style={{ flex: 1 }} 
        contentContainerStyle={{ paddingBottom: 120 }} 
        showsVerticalScrollIndicator={false}
      >
        
        {/* FLIGHT SUMMARY CARD (from Image 8) */}
        <View style={styles.section}>
          <View style={styles.card}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Air_India_Logo.svg/512px-Air_India_Logo.svg.png' }} style={{ width: 24, height: 24 }} contentFit="contain" />
                <View style={{ marginLeft: 8 }}>
                  <Text style={{ fontSize: 12, fontWeight: '800', color: '#333' }}>Air India</Text>
                  <Text style={{ fontSize: 10, color: '#8E8E93' }}>AI 2776</Text>
                </View>
              </View>
              <Text style={{ fontSize: 10, color: '#8E8E93' }}>Economy • Eco Value</Text>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <View>
                <Text style={{ fontSize: 16, fontWeight: '800', color: '#333' }}>HYD 23:30</Text>
                <Text style={{ fontSize: 10, color: '#8E8E93' }}>Sat, 11 Apr</Text>
              </View>
              <View style={{ alignItems: 'center' }}>
                <Text style={{ fontSize: 10, color: '#8E8E93' }}>2h 30m</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 4 }}>
                  <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: '#8E8E93' }} />
                  <View style={{ width: 40, height: 1, backgroundColor: '#8E8E93' }} />
                  <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: '#8E8E93' }} />
                </View>
                <Text style={{ fontSize: 10, color: '#8E8E93' }}>Non stop</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={{ fontSize: 16, fontWeight: '800', color: '#333' }}>02:00 DEL</Text>
                <Text style={{ fontSize: 10, color: '#8E8E93' }}>Sun, 12 Apr</Text>
              </View>
            </View>

            <Pressable onPress={() => setShowFlightDetails(true)} style={{ borderTopWidth: 1, borderTopColor: '#E5E5EA', marginTop: 12, paddingTop: 12 }}>
              <Text onPress={() => alert("Feature coming soon!")} style={{ color: '#0084FF', fontSize: 12, fontWeight: '800' }}>View Flight & Fare details</Text>
            </Pressable>
          </View>
        </View>

        {/* BOOKING POLICIES SECTION */}
        <View style={styles.section}>
          <Text style={styles.sectionHeading}>Booking Policies</Text>
          
          <View style={styles.card}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <Text style={{ fontSize: 13, fontWeight: '800', color: '#333' }}>Baggage allowance</Text>
              <MaterialCommunityIcons name="chevron-right" size={20} color="#0084FF" />
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
              <MaterialCommunityIcons name="check-circle" size={16} color="#00A699" />
              <Text style={{ fontSize: 12, color: '#333', marginLeft: 8 }}>Cabin <Text style={{ fontWeight: '700' }}>7 Kgs / adult</Text></Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
              <MaterialCommunityIcons name="check-circle" size={16} color="#00A699" />
              <Text style={{ fontSize: 12, color: '#333', marginLeft: 8 }}>Check-in <Text style={{ fontWeight: '700' }}>15 Kgs / adult</Text></Text>
            </View>

            <View style={{ backgroundColor: '#F5FAFF', padding: 12, borderRadius: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 12, fontWeight: '700', color: '#333' }}>Upgrade to extra cabin baggage</Text>
                <Text style={{ fontSize: 10, color: '#8E8E93' }}>Additional 3 KGS</Text>
              </View>
              <Pressable onPress={() => setShowBaggage(true)}>
                <Text onPress={() => alert("Feature coming soon!")} style={{ fontSize: 12, fontWeight: '800', color: '#0084FF' }}>ADD BAGGAGE</Text>
              </Pressable>
            </View>

            <View style={{ backgroundColor: '#F3E8FF', padding: 12, borderRadius: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 }}>
              <Text style={{ color: '#7E22CE', fontSize: 12, fontWeight: '800' }}>Need a summary? Ask Myra!</Text>
              <MaterialCommunityIcons name="chevron-right" size={16} color="#7E22CE" />
            </View>
          </View>

          <View style={styles.card}>
            <Text style={{ fontSize: 13, fontWeight: '800', color: '#333', marginBottom: 12 }}>Cancellation refund & date change</Text>
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 8 }}>
              <Text style={{ fontSize: 12, color: '#333' }}>• <Text style={{ fontWeight: '700' }}>Cancellation:</Text> Get refund of about ₹ 1,046 on cancellation upto 2 hours before departure</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
              <Text style={{ fontSize: 12, color: '#333' }}>• <Text style={{ fontWeight: '700' }}>Date change:</Text> Airline fee of ₹ 3,450 + fare diff on date change up to 2 hours before departure</Text>
            </View>
          </View>
        </View>

        {/* FLEXIBILITY ADD-ONS SECTION */}
        <View style={styles.section}>
          <Text style={styles.sectionHeading}>Flexibility add-ons</Text>
          <View style={styles.card}>
            <Text style={{ fontSize: 16, fontWeight: '800', color: '#333', marginBottom: 16, textAlign: 'center' }}>Get more benefits by upgrading your fare</Text>
            <View style={{ flexDirection: 'row', gap: 8, marginBottom: 20 }}>
              <View style={{ flex: 1, borderWidth: 2, borderColor: '#0084FF', borderRadius: 8, padding: 12, alignItems: 'center', backgroundColor: '#F5FAFF' }}>
                <MaterialCommunityIcons name="radiobox-marked" size={20} color="#0084FF" style={{ marginBottom: 8 }} />
                <Text style={{ fontSize: 10, color: '#8E8E93', textAlign: 'center' }}>Your Selection</Text>
                <Text style={{ fontSize: 13, fontWeight: '900', color: '#333', marginTop: 4 }}>₹ 6,646</Text>
              </View>
              <View style={{ flex: 1, borderWidth: 1, borderColor: '#E5E5EA', borderRadius: 8, padding: 12, alignItems: 'center' }}>
                <MaterialCommunityIcons name="radiobox-blank" size={20} color="#8E8E93" style={{ marginBottom: 8 }} />
                <Text style={{ fontSize: 10, color: '#8E8E93', textAlign: 'center' }}>MMT Regular</Text>
                <Text style={{ fontSize: 13, fontWeight: '900', color: '#333', marginTop: 4 }}>₹ 7,171</Text>
              </View>
              <View style={{ flex: 1, borderWidth: 1, borderColor: '#E5E5EA', borderRadius: 8, padding: 12, alignItems: 'center' }}>
                <MaterialCommunityIcons name="radiobox-blank" size={20} color="#8E8E93" style={{ marginBottom: 8 }} />
                <Text style={{ fontSize: 10, color: '#8E8E93', textAlign: 'center' }}>MMT Premium</Text>
                <Text style={{ fontSize: 13, fontWeight: '900', color: '#333', marginTop: 4 }}>₹ 7,721</Text>
              </View>
            </View>
            <Text style={{ fontSize: 12, color: '#EF4444', fontWeight: '800', textAlign: 'center' }}>You are missing out on these benefits</Text>
          </View>

          <Text style={{ fontSize: 16, fontWeight: '800', color: '#333', marginBottom: 12, marginTop: 8 }}>Travel worry-free with flexibility</Text>
          <View style={styles.card}>
            {/* Free Date Change */}
            <Pressable onPress={() => setSelectedFlex('Free Date Change')} style={[styles.flexiRow, selectedFlex === 'Free Date Change' && styles.flexiRowActive]}>
              <MaterialCommunityIcons name={selectedFlex === 'Free Date Change' ? "radiobox-marked" : "radiobox-blank"} size={20} color={selectedFlex === 'Free Date Change' ? "#0084FF" : "#8E8E93"} />
              <View style={styles.flexiContent}>
                <Text style={styles.flexiTitle}>Free Date Change</Text>
                <Text style={styles.flexiSub}>Zero Fee on date change. <Text onPress={() => alert("Feature coming soon!")} style={{color:'#0084FF'}}>View T&C</Text></Text>
              </View>
              <View style={{alignItems: 'flex-end'}}>
                <MaterialCommunityIcons name="calendar-sync" size={16} color="#0084FF" />
                <Text style={styles.flexiPrice}>₹ 434</Text>
              </View>
            </Pressable>

            {/* Zero Cancellation */}
            <Pressable onPress={() => setSelectedFlex('Zero Cancellation')} style={[styles.flexiRow, selectedFlex === 'Zero Cancellation' && styles.flexiRowActive]}>
              <MaterialCommunityIcons name={selectedFlex === 'Zero Cancellation' ? "radiobox-marked" : "radiobox-blank"} size={20} color={selectedFlex === 'Zero Cancellation' ? "#0084FF" : "#8E8E93"} />
              <View style={styles.flexiContent}>
                <Text style={styles.flexiTitle}>Zero Cancellation</Text>
                <Text style={styles.flexiSub}>Get 100% refund on cancellation. <Text onPress={() => alert("Feature coming soon!")} style={{color:'#0084FF'}}>View T&C</Text></Text>
              </View>
              <View style={{alignItems: 'flex-end'}}>
                <MaterialCommunityIcons name="cash-refund" size={16} color="#9333EA" />
                <Text style={styles.flexiPrice}>₹ 514</Text>
              </View>
            </Pressable>

            {/* FlexiFly */}
            <Pressable onPress={() => setSelectedFlex('FlexiFly')} style={[styles.flexiRow, selectedFlex === 'FlexiFly' && styles.flexiRowActive, { borderBottomWidth: 0 }]}>
              <MaterialCommunityIcons name={selectedFlex === 'FlexiFly' ? "radiobox-marked" : "radiobox-blank"} size={20} color={selectedFlex === 'FlexiFly' ? "#0084FF" : "#8E8E93"} />
              <View style={styles.flexiContent}>
                <Text style={styles.flexiTitle}>FlexiFly</Text>
                <Text style={styles.flexiSub}>(Zero Cancellation or Free Date Change)</Text>
                <Text style={styles.flexiSub2}>Get <Text style={{fontWeight:'700', color:'#16A34A'}}>100% refund</Text> on cancellation OR <Text style={{fontWeight:'700', color:'#16A34A'}}>Zero Fee</Text> on date change. <Text onPress={() => alert("Feature coming soon!")} style={{color:'#0084FF'}}>View T&C</Text></Text>
              </View>
              <View style={{alignItems: 'flex-end'}}>
                <MaterialCommunityIcons name="shield-check" size={16} color="#0084FF" />
                <Text style={styles.flexiPrice}>₹ 600</Text>
              </View>
            </Pressable>

            <View style={styles.myraHintBox}>
              <MaterialCommunityIcons name="lightbulb-on" size={16} color="#EAB308" />
              <Text style={styles.myraHintText}>Not sure of your plans? Add FlexiFly and get twin benefits (Zero Cancellation + Free Date Change) for max flexibility.</Text>
            </View>
          </View>
        </View>

        {/* IMPORTANT INFO SECTION */}
        <View style={styles.section}>
          <Text style={styles.sectionHeading}>Important Information</Text>
          <View style={styles.card}>
            <View style={styles.myraAIBox}>
               <Text style={styles.myraAIText}>🤖 Get a quick summary, just ask Myra!</Text>
               <MaterialCommunityIcons name="chevron-right" size={16} color="#7E22CE" />
            </View>
            <View style={styles.infoBlock}>
               <MaterialCommunityIcons name="alert-circle-outline" size={18} color="#EF4444" />
               <View style={{flex: 1}}>
                 <Text style={styles.infoTitle}>Check travel guidelines and baggage information below:</Text>
                 <Text style={styles.infoBullet}>• Carry no more than 1 check-in baggage and 1 hand baggage per passenger. If violated, airline may levy extra charges.</Text>
               </View>
            </View>
          </View>
        </View>

        {/* OFFERS SECTION */}
        <View style={styles.section}>
          <Text style={styles.sectionHeading}>Offers</Text>
          <Text style={styles.sectionSubHeading}>To help you save more</Text>
          <View style={styles.card}>
            <View style={styles.couponInputRow}>
              <TextInput placeholder="Enter coupon code" style={styles.couponInput} />
              <Text style={styles.applyBtnText}>APPLY</Text>
            </View>

            {coupons.map((c, i) => (
              <View key={i} style={styles.couponRow}>
                 <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                   <View style={{flexDirection: 'row', alignItems: 'center'}}>
                     <MaterialCommunityIcons name="brightness-percent" size={16} color="#00A699" style={{marginRight: 8}}/>
                     <Text style={styles.couponCodeText}>{c.code}</Text>
                   </View>
                   <Text style={styles.couponDiscountText}>₹ {c.discount} off</Text>
                 </View>
                 <Text style={styles.couponDescText}>{c.desc}</Text>
                 <View style={{alignItems: 'flex-end'}}>
                   {appliedCoupon === c.code ? (
                     <Pressable onPress={() => setAppliedCoupon(null)}>
                       <Text style={styles.removeText}>Remove</Text>
                     </Pressable>
                   ) : (
                     <Pressable onPress={() => setAppliedCoupon(c.code)}>
                       <Text style={styles.applyBtnText}>Apply</Text>
                     </Pressable>
                   )}
                 </View>
              </View>
            ))}

            <Pressable style={{paddingTop: 16}}>
              <Text onPress={() => alert("Feature coming soon!")} style={{color: '#0084FF', fontSize: 12, fontWeight: '700'}}>View all coupons</Text>
            </Pressable>
          </View>
        </View>

        {/* TRIP SECURE SECTION */}
        <View style={styles.section}>
          <View style={styles.card}>
            <Text style={{fontSize: 16, fontWeight: '800', color: '#333', marginBottom: 8}}>Book this flight & get</Text>
            <Text style={{fontSize: 10.5, color: '#00A699'}}>• <Text style={{fontWeight:'700'}}>Exclusive rates</Text> on 1000+ Properties in {travelSearch.destinationCity}</Text>
            <Text style={{fontSize: 10.5, color: '#00A699', marginBottom: 12}}>• <Text style={{fontWeight:'700'}}>Extra 12% off</Text> using code BOOKSTAYS</Text>
            
            <View style={{flexDirection: 'row', gap: 8}}>
              <Image source={{uri: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&q=80'}} style={{width: 100, height: 60, borderRadius: 8}} />
              <Image source={{uri: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=200&q=80'}} style={{width: 100, height: 60, borderRadius: 8}} />
              <Image source={{uri: 'https://images.unsplash.com/photo-1542314831-c6a4d1409341?w=200&q=80'}} style={{width: 100, height: 60, borderRadius: 8}} />
            </View>
            <Text style={{fontSize: 10, fontWeight: '900', color: '#CA8A04', marginTop: 12, textTransform: 'uppercase', letterSpacing: 1}}>Flyer Exclusive Deal</Text>
          </View>

          <View style={styles.card}>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16}}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <MaterialCommunityIcons name="shield-check" size={20} color="#0084FF" />
                <Text style={{fontSize: 16, fontWeight: '800', color: '#333', marginLeft: 8}}>Trip Secure</Text>
              </View>
              <Text onPress={() => alert("Feature coming soon!")} style={{fontSize: 13, fontWeight: '900', color: '#0084FF', fontStyle: 'italic'}}>ACKO</Text>
            </View>

            <Text style={{fontSize: 12, color: '#8E8E93', marginBottom: 12}}>Plan Benefits</Text>
            <View style={{flexDirection: 'row', gap: 8, marginBottom: 16}}>
              <View style={styles.benefitBox}>
                <MaterialCommunityIcons name="bag-checked" size={20} color="#0084FF" />
                <Text style={styles.benefitBoxTitle}>Lost Baggage Assistance</Text>
                <Text style={styles.benefitBoxSub}>24x7 support</Text>
              </View>
              <View style={styles.benefitBox}>
                <MaterialCommunityIcons name="clock-alert" size={20} color="#0084FF" />
                <Text style={styles.benefitBoxTitle}>Trip Delay</Text>
                <Text style={styles.benefitBoxSub}>Flat ₹ 1,500</Text>
              </View>
              <View style={styles.benefitBox}>
                <MaterialCommunityIcons name="close-circle-multiple" size={20} color="#0084FF" />
                <Text style={styles.benefitBoxTitle}>Trip Cancellation</Text>
                <Text style={styles.benefitBoxSub}>upto ₹ 3,500</Text>
              </View>
            </View>
            <Pressable style={{alignItems: 'center', marginBottom: 16}}>
              <Text onPress={() => alert("Feature coming soon!")} style={{color: '#0084FF', fontSize: 12, fontWeight: '700'}}>View All Benefits</Text>
            </Pressable>

            <View style={{backgroundColor: '#FFF2E6', padding: 4, alignItems: 'center', borderRadius: 4, marginBottom: 12}}>
              <Text style={{fontSize: 9, color: '#D35400', fontWeight: '800'}}>Recommended for your travel within India</Text>
            </View>

            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
               <View>
                 <Text style={{fontSize: 13, fontWeight: '900', color: '#333'}}>₹ 299<Text style={{fontSize: 10, fontWeight: '400', color: '#8E8E93'}}>/per person</Text></Text>
               </View>
            </View>
            
            <View style={{flexDirection: 'row', marginTop: 16, gap: 16}}>
              <Pressable onPress={() => setTripSecure(true)} style={{flexDirection: 'row', alignItems: 'center'}}>
                <MaterialCommunityIcons name={tripSecure === true ? "radiobox-marked" : "radiobox-blank"} size={20} color={tripSecure === true ? "#0084FF" : "#8E8E93"} />
                <Text style={{fontSize: 12, color: '#333', marginLeft: 8}}>Yes, secure my trip</Text>
              </Pressable>
            </View>
            <View style={{flexDirection: 'row', marginTop: 12, gap: 16}}>
              <Pressable onPress={() => setTripSecure(false)} style={{flexDirection: 'row', alignItems: 'center'}}>
                <MaterialCommunityIcons name={tripSecure === false ? "radiobox-marked" : "radiobox-blank"} size={20} color={tripSecure === false ? "#0084FF" : "#8E8E93"} />
                <Text style={{fontSize: 12, color: '#333', marginLeft: 8}}>No, I will book without trip secure</Text>
              </Pressable>
            </View>

            <Text style={{fontSize: 9, color: '#8E8E93', marginTop: 16, lineHeight: 14}}>
              Trip Secure is non-refundable. By selecting it, I confirm all travelers are Indian nationals, aged 6 months to 90 years, and accept the <Text onPress={() => alert("Feature coming soon!")} style={{color: '#0084FF'}}>T&Cs</Text>
            </Text>
          </View>
        </View>

        {/* TRAVELLER DETAILS SECTION */}
        <View style={styles.section}>
          <Text style={styles.sectionHeading}>Traveller Details</Text>
          
          <View style={[styles.card, { backgroundColor: '#F5FAFF', borderColor: '#D0E6FF', flexDirection: 'row', alignItems: 'center' }]}>
             <MaterialCommunityIcons name="account-circle" size={20} color="#0084FF" />
             <Text style={{fontSize: 10, color: '#333', flex: 1, marginLeft: 8}}>Log in to view your saved traveller list, unlock amazing deals & much more!</Text>
             <Text onPress={() => alert("Feature coming soon!")} style={{fontSize: 12, fontWeight: '800', color: '#0084FF'}}>LOG-IN</Text>
          </View>

          <View style={styles.card}>
             <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16}}>
               <View style={{flexDirection: 'row', alignItems: 'center'}}>
                 <MaterialCommunityIcons name="account" size={16} color="#333" />
                 <Text style={{fontSize: 12, fontWeight: '800', color: '#333', marginLeft: 8}}>ADULT (12 yrs+)</Text>
               </View>
               <Text style={{fontSize: 10, color: '#8E8E93'}}>{adults.length}/{travelSearch.travellers} added</Text>
             </View>

             {adults.map((adult, idx) => (
               <View key={idx} style={{flexDirection: 'row', alignItems: 'center', marginBottom: 12, backgroundColor: '#F5FAFF', padding: 12, borderRadius: 8}}>
                 <MaterialCommunityIcons name="check-circle" size={16} color="#00A699" />
                 <View style={{marginLeft: 12, flex: 1}}>
                   <Text style={{fontSize: 12, fontWeight: '700', color: '#333'}}>{adult.firstName} {adult.lastName}</Text>
                 </View>
                 <MaterialCommunityIcons name="pencil" size={16} color="#0084FF" />
               </View>
             ))}

             {adults.length < travelSearch.travellers && (
               <Pressable onPress={() => setShowAddTraveller(true)} style={{borderWidth: 1, borderColor: '#0084FF', borderRadius: 8, paddingVertical: 12, alignItems: 'center'}}>
                 <Text onPress={() => alert("Feature coming soon!")} style={{color: '#0084FF', fontSize: 12, fontWeight: '800'}}>Add new adult</Text>
               </Pressable>
             )}
          </View>

          <View style={styles.card}>
             <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12}}>
               <Text style={{fontSize: 12, fontWeight: '800', color: '#333'}}>Booking details will be sent to</Text>
               <Pressable onPress={() => setShowEditContact(true)} style={{flexDirection: 'row', alignItems: 'center'}}>
                 <Text onPress={() => alert("Feature coming soon!")} style={{fontSize: 12, fontWeight: '800', color: '#0084FF', marginRight: 4}}>EDIT</Text>
                 <MaterialCommunityIcons name="chevron-right" size={20} color="#0084FF" />
               </Pressable>
             </View>
             <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 8}}>
               <MaterialCommunityIcons name="email-outline" size={16} color="#8E8E93" />
               <Text style={{fontSize: 12, color: '#333', marginLeft: 8}}>{contactEmail}</Text>
             </View>
             <View style={{flexDirection: 'row', alignItems: 'center'}}>
               <MaterialCommunityIcons name="phone-outline" size={16} color="#8E8E93" />
               <Text style={{fontSize: 12, color: '#333', marginLeft: 8}}>+91 {contactPhone}</Text>
             </View>
          </View>

          <View style={styles.card}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <MaterialCommunityIcons name="checkbox-blank-outline" size={20} color="#8E8E93" />
              <Text style={{fontSize: 12, color: '#333', marginLeft: 8}}>I have a GST number <Text style={{color: '#8E8E93'}}>(Optional)</Text></Text>
            </View>
          </View>

          <View style={styles.card}>
             <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
               <View>
                 <Text style={{fontSize: 12, fontWeight: '800', color: '#333'}}>Your pincode and state ⓘ</Text>
                 <Text style={{fontSize: 10, color: '#8E8E93', marginTop: 4}}>Required for GST purpose on your tax invoice</Text>
               </View>
               <Pressable onPress={() => setShowEditPincode(true)} style={{flexDirection: 'row', alignItems: 'center'}}>
                 <Text onPress={() => alert("Feature coming soon!")} style={{fontSize: 12, fontWeight: '800', color: '#0084FF', marginRight: 4}}>EDIT</Text>
                 <MaterialCommunityIcons name="chevron-down" size={16} color="#0084FF" />
               </Pressable>
             </View>
             <Text style={{fontSize: 13, fontWeight: '700', color: '#333', marginTop: 12}}>Telangana</Text>
             <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 8}}>
               <MaterialCommunityIcons name="checkbox-marked" size={20} color="#0084FF" />
               <Text style={{fontSize: 10, color: '#333', marginLeft: 8}}>Confirm and save these details to your profile</Text>
             </View>
          </View>

          <View style={[styles.card, { backgroundColor: '#F0FDF4', borderColor: '#BBF7D0' }]}>
             <Text style={{fontSize: 10.5, color: '#16A34A', fontWeight: '600'}}>Gozy is on a mission to plant 4 million trees by 2027! <Text onPress={() => alert("Feature coming soon!")} style={{color: '#0084FF'}}>Know More</Text></Text>
             <View style={{flexDirection: 'row', gap: 12, marginTop: 12}}>
               <View style={styles.donationChip}><Text style={styles.donationText}>₹ 5</Text></View>
               <View style={[styles.donationChip, {borderColor: '#16A34A', backgroundColor: '#DCFCE7'}]}><Text style={[styles.donationText, {color: '#16A34A'}]}>₹ 10</Text></View>
               <View style={styles.donationChip}><Text style={styles.donationText}>₹ 20</Text></View>
               <View style={styles.donationChip}><Text style={styles.donationText}>₹ 50</Text></View>
             </View>
          </View>

          <View style={{flexDirection: 'row', paddingHorizontal: 16, paddingBottom: 24}}>
            <MaterialCommunityIcons name="checkbox-marked" size={20} color="#0084FF" />
            <Text style={{fontSize: 10, color: '#333', marginLeft: 8, flex: 1, lineHeight: 16}}>
              I understand and agree with the <Text onPress={() => alert("Feature coming soon!")} style={{color: '#0084FF'}}>Fare Rules</Text>, the <Text onPress={() => alert("Feature coming soon!")} style={{color: '#0084FF'}}>Privacy Policy</Text>, the <Text onPress={() => alert("Feature coming soon!")} style={{color: '#0084FF'}}>User Agreement</Text> and <Text onPress={() => alert("Feature coming soon!")} style={{color: '#0084FF'}}>Terms of Service</Text> of Gozy.
            </Text>
          </View>
        </View>

      </ScrollView>

      {/* Sticky Bottom Footer */}
      <View style={{ backgroundColor: '#FFF', borderTopWidth: 1, borderTopColor: '#E5E5EA' }}>
        <View style={styles.lockPriceBanner}>
          <MaterialCommunityIcons name="lock-outline" size={14} color="#0084FF" />
          <Text style={{fontSize: 10, color: '#333', marginLeft: 6, flex: 1}}>Not sure? Lock this price!</Text>
          <Text onPress={() => alert("Feature coming soon!")} style={{fontSize: 10, fontWeight: '800', color: '#0084FF'}}>LOCK NOW</Text>
        </View>
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

      {/* Add Traveller Modal */}
      <Modal visible={showAddTraveller} animationType="slide" presentationStyle="pageSheet">
         <SafeAreaView style={{flex: 1, backgroundColor: '#FFF'}}>
            <View style={styles.modalHeader}>
              <Pressable onPress={() => setShowAddTraveller(false)} style={{padding: 8}}>
                 <MaterialCommunityIcons name="close" size={24} color="#333" />
              </Pressable>
              <Text style={{fontSize: 16, fontWeight: '800', color: '#333', marginLeft: 8}}>Add Traveller</Text>
            </View>
            <ScrollView style={{padding: 16}}>
               <View style={{backgroundColor: '#FEF9C3', padding: 12, borderRadius: 8, flexDirection: 'row', marginBottom: 20}}>
                 <MaterialCommunityIcons name="information" size={16} color="#CA8A04" />
                 <Text style={{fontSize: 10, color: '#854D0E', marginLeft: 8, flex: 1, fontWeight: '600'}}>
                   Important: Enter name as mentioned on your passport or Government approved IDs.
                 </Text>
               </View>

               <Text style={{fontSize: 12, fontWeight: '700', color: '#8E8E93', marginBottom: 8}}>GENDER</Text>
               <View style={{flexDirection: 'row', gap: 12, marginBottom: 20}}>
                 <Pressable onPress={() => setNewGender('MALE')} style={[styles.genderBtn, newGender === 'MALE' && styles.genderBtnActive]}>
                   <Text style={[styles.genderBtnText, newGender === 'MALE' && styles.genderBtnTextActive]}>MALE</Text>
                 </Pressable>
                 <Pressable onPress={() => setNewGender('FEMALE')} style={[styles.genderBtn, newGender === 'FEMALE' && styles.genderBtnActive]}>
                   <Text style={[styles.genderBtnText, newGender === 'FEMALE' && styles.genderBtnTextActive]}>FEMALE</Text>
                 </Pressable>
               </View>

               <View style={styles.inputContainer}>
                 <Text style={styles.inputLabel}>First & Middle Name</Text>
                 <TextInput value={newFirstName} onChangeText={setNewFirstName} placeholder="E.g. Nikhitha" style={styles.inputField} />
               </View>

               <View style={styles.inputContainer}>
                 <Text style={styles.inputLabel}>Last Name</Text>
                 <TextInput value={newLastName} onChangeText={setNewLastName} placeholder="E.g. Sharma" style={styles.inputField} />
               </View>

            </ScrollView>
            <View style={{padding: 16, borderTopWidth: 1, borderTopColor: '#E5E5EA'}}>
               <Pressable onPress={handleAddTravellerSave} style={styles.confirmBtn}>
                  <Text style={styles.confirmBtnText}>CONFIRM</Text>
               </Pressable>
            </View>
         </SafeAreaView>
      </Modal>

      {/* Trip Secure Warning Modal */}
      <Modal visible={showSecureWarning} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.warningModalContent}>
             <View style={{alignItems: 'flex-end', width: '100%'}}>
               <Pressable onPress={() => setShowSecureWarning(false)} style={{padding: 4}}>
                 <MaterialCommunityIcons name="close-circle" size={24} color="#8E8E93" />
               </Pressable>
             </View>
             
             <View style={styles.shieldIconLarge}>
               <MaterialCommunityIcons name="shield-check" size={40} color="#FFF" />
             </View>

             <View style={{backgroundColor: '#FFF2E6', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 4, marginTop: -16, marginBottom: 16}}>
               <Text style={{fontSize: 10, color: '#D35400', fontWeight: '800'}}>Recommended for your travel within India</Text>
             </View>

             <Text style={{fontSize: 18, fontWeight: '900', color: '#333', textAlign: 'center', marginBottom: 8}}>
               It seems you haven't opted for trip protection plans!
             </Text>
             <Text style={{fontSize: 13, fontWeight: '800', color: '#333', marginBottom: 24}}>₹ 299 per traveller</Text>

             <View style={{flexDirection: 'row', gap: 12, marginBottom: 24, width: '100%', paddingHorizontal: 16}}>
                <View style={{flex: 1, alignItems: 'center'}}>
                  <MaterialCommunityIcons name="bag-checked" size={24} color="#00A699" />
                  <Text style={{fontSize: 10, fontWeight: '800', color: '#333', textAlign: 'center', marginTop: 8}}>Lost Baggage Assistance</Text>
                </View>
                <View style={{flex: 1, alignItems: 'center'}}>
                  <MaterialCommunityIcons name="clock-alert" size={24} color="#00A699" />
                  <Text style={{fontSize: 10, fontWeight: '800', color: '#333', textAlign: 'center', marginTop: 8}}>Trip Delay ₹ 1,500</Text>
                </View>
                <View style={{flex: 1, alignItems: 'center'}}>
                  <MaterialCommunityIcons name="close-circle-multiple" size={24} color="#00A699" />
                  <Text style={{fontSize: 10, fontWeight: '800', color: '#333', textAlign: 'center', marginTop: 8}}>Trip Cancellation upto ₹ 3,500</Text>
                </View>
             </View>

             <Pressable style={styles.outlineBtn} onPress={() => { setShowSecureWarning(false); setTripSecure(false); router.push('/travel-addons'); }}>
                <Text style={styles.outlineBtnText}>Book without Trip Secure</Text>
             </Pressable>
             <Pressable style={styles.solidBtn} onPress={() => { setShowSecureWarning(false); setTripSecure(true); router.push('/travel-addons'); }}>
                <Text style={styles.solidBtnText}>SECURE TRIP</Text>
             </Pressable>
          </View>
        </View>
      </Modal>

      <Modal visible={showFlightDetails} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <Pressable style={styles.modalBg} onPress={() => setShowFlightDetails(false)} />
          <View style={styles.modalContentBottom}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Flight & Fare Details</Text>
              <Pressable onPress={() => setShowFlightDetails(false)}>
                <MaterialCommunityIcons name="close" size={24} color="#333" />
              </Pressable>
            </View>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16 }}>
              {/* Flight Details */}
              <Text style={{ fontSize: 16, fontWeight: '800', color: '#333', marginBottom: 12 }}>Itinerary</Text>
              <View style={{ backgroundColor: '#F8FAFC', padding: 12, borderRadius: 8, marginBottom: 20 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <Text style={{ fontSize: 13, fontWeight: '800', color: '#333' }}>{travelSearch.originCity} to {travelSearch.destinationCity}</Text>
                  <Text onPress={() => alert("Feature coming soon!")} style={{ fontSize: 12, color: '#0084FF', fontWeight: '800' }}>{selectedTravelOffer.duration}</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                  <Image source={{ uri: 'https://companieslogo.com/img/orig/INDIGO.NS-d8dd8fdf.png?t=1602674483' }} style={{ width: 16, height: 16 }} contentFit="contain" />
                  <Text style={{ fontSize: 12, color: '#333', marginLeft: 8 }}>{selectedTravelOffer.airline} • {selectedTravelOffer.flightNumber}</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <View>
                    <Text style={{ fontSize: 16, fontWeight: '800', color: '#333' }}>{selectedTravelOffer.departTime}</Text>
                    <Text style={{ fontSize: 10, color: '#8E8E93' }}>Sat, 11 Apr</Text>
                  </View>
                  <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontSize: 10, color: '#8E8E93' }}>{selectedTravelOffer.stops}</Text>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={{ fontSize: 16, fontWeight: '800', color: '#333' }}>{selectedTravelOffer.arriveTime}</Text>
                    <Text style={{ fontSize: 10, color: '#8E8E93' }}>Sun, 12 Apr</Text>
                  </View>
                </View>
              </View>

              {/* Fare Details */}
              <Text style={{ fontSize: 16, fontWeight: '800', color: '#333', marginBottom: 12 }}>Fare Breakdown</Text>
              <View style={{ backgroundColor: '#FFF', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#E5E5EA', marginBottom: 12 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                  <Text style={{ fontSize: 12, color: '#333' }}>Base Fare (1 Adult)</Text>
                  <Text style={{ fontSize: 12, color: '#333' }}>{formatCurrency(selectedTravelOffer.price - 1200)}</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                  <Text style={{ fontSize: 12, color: '#333' }}>Taxes & Surcharges</Text>
                  <Text style={{ fontSize: 12, color: '#333' }}>{formatCurrency(1200)}</Text>
                </View>
                {selectedFlex !== 'None' && (
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                    <Text style={{ fontSize: 12, color: '#333' }}>Flexibility ({selectedFlex})</Text>
                    <Text style={{ fontSize: 12, color: '#333' }}>{formatCurrency(selectedFlex === 'Free Date Change' ? 434 : selectedFlex === 'Zero Cancellation' ? 514 : 600)}</Text>
                  </View>
                )}
                {appliedCoupon && (
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                    <Text style={{ fontSize: 12, color: '#16A34A', fontWeight: '700' }}>Coupon Discount</Text>
                    <Text style={{ fontSize: 12, color: '#16A34A', fontWeight: '700' }}>-{formatCurrency(coupons.find(c => c.code === appliedCoupon)?.discount || 0)}</Text>
                  </View>
                )}
                {tripSecure && (
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                    <Text style={{ fontSize: 12, color: '#333' }}>Trip Secure</Text>
                    <Text style={{ fontSize: 12, color: '#333' }}>{formatCurrency(199)}</Text>
                  </View>
                )}
                <View style={{ height: 1, backgroundColor: '#E5E5EA', marginVertical: 8 }} />
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ fontSize: 13, fontWeight: '800', color: '#333' }}>Total Amount</Text>
                  <Text style={{ fontSize: 13, fontWeight: '800', color: '#333' }}>{formatCurrency(displayPrice)}</Text>
                </View>
              </View>
            </ScrollView>
            <View style={{ padding: 16, borderTopWidth: 1, borderTopColor: '#E5E5EA' }}>
              <Pressable style={[styles.continueBtn, { width: '100%' }]} onPress={() => setShowFlightDetails(false)}>
                <Text style={styles.continueBtnText}>GOT IT</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={showBaggage} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <Pressable style={styles.modalBg} onPress={() => setShowBaggage(false)} />
          <View style={styles.modalContentBottom}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Extra Baggage</Text>
              <Pressable onPress={() => setShowBaggage(false)}>
                <MaterialCommunityIcons name="close" size={24} color="#333" />
              </Pressable>
            </View>
            <View style={{ padding: 16 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#F8FAFC', padding: 16, borderRadius: 8, marginBottom: 12 }}>
                <View>
                  <Text style={{ fontSize: 13, fontWeight: '800', color: '#333' }}>+ 5 KGs</Text>
                  <Text style={{ fontSize: 12, color: '#8E8E93' }}>₹ 2,250</Text>
                </View>
                <Pressable onPress={() => setShowBaggage(false)} style={{ backgroundColor: '#0084FF', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 4 }}>
                  <Text style={{ color: '#FFF', fontSize: 12, fontWeight: '800' }}>ADD</Text>
                </Pressable>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#F8FAFC', padding: 16, borderRadius: 8, marginBottom: 12 }}>
                <View>
                  <Text style={{ fontSize: 13, fontWeight: '800', color: '#333' }}>+ 10 KGs</Text>
                  <Text style={{ fontSize: 12, color: '#8E8E93' }}>₹ 4,500</Text>
                </View>
                <Pressable onPress={() => setShowBaggage(false)} style={{ backgroundColor: '#0084FF', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 4 }}>
                  <Text style={{ color: '#FFF', fontSize: 12, fontWeight: '800' }}>ADD</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={showEditContact} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <Pressable style={styles.modalBg} onPress={() => setShowEditContact(false)} />
          <View style={styles.modalContentBottom}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Contact Details</Text>
              <Pressable onPress={() => setShowEditContact(false)}>
                <MaterialCommunityIcons name="close" size={24} color="#333" />
              </Pressable>
            </View>
            <View style={{ padding: 16 }}>
              <Text style={{ fontSize: 12, fontWeight: '700', color: '#333', marginBottom: 8 }}>Email Address</Text>
              <TextInput style={{ borderWidth: 1, borderColor: '#E5E5EA', borderRadius: 8, padding: 12, marginBottom: 16 }} value={contactEmail} onChangeText={setContactEmail} />
              <Text style={{ fontSize: 12, fontWeight: '700', color: '#333', marginBottom: 8 }}>Phone Number</Text>
              <TextInput style={{ borderWidth: 1, borderColor: '#E5E5EA', borderRadius: 8, padding: 12, marginBottom: 24 }} value={contactPhone} onChangeText={setContactPhone} keyboardType="phone-pad" />
              <Pressable style={styles.continueBtn} onPress={() => setShowEditContact(false)}>
                <Text style={styles.continueBtnText}>SAVE</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={showEditPincode} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <Pressable style={styles.modalBg} onPress={() => setShowEditPincode(false)} />
          <View style={styles.modalContentBottom}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Pincode & State</Text>
              <Pressable onPress={() => setShowEditPincode(false)}>
                <MaterialCommunityIcons name="close" size={24} color="#333" />
              </Pressable>
            </View>
            <View style={{ padding: 16 }}>
              <Text style={{ fontSize: 12, fontWeight: '700', color: '#333', marginBottom: 8 }}>Pincode</Text>
              <TextInput style={{ borderWidth: 1, borderColor: '#E5E5EA', borderRadius: 8, padding: 12, marginBottom: 16 }} placeholder="Enter Pincode" keyboardType="number-pad" />
              <Text style={{ fontSize: 12, fontWeight: '700', color: '#333', marginBottom: 8 }}>State</Text>
              <TextInput style={{ borderWidth: 1, borderColor: '#E5E5EA', borderRadius: 8, padding: 12, marginBottom: 24 }} placeholder="Enter State" />
              <Pressable style={styles.continueBtn} onPress={() => setShowEditPincode(false)}>
                <Text style={styles.continueBtnText}>SAVE</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F2F4F7' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingBottom: 12, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#E5E5EA' },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  backButton: { marginRight: 12 },
  headerTitle: { fontSize: 16, fontWeight: '800', color: colors.text },
  headerSubtitle: { fontSize: 10.5, color: '#8E8E93', marginTop: 2 },
  headerRight: { flexDirection: 'row', alignItems: 'center' },

  tabScrollContainer: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  tabScrollContent: { paddingHorizontal: 16, paddingVertical: 10, alignItems: 'center', gap: 8 },
  tabBtn: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, borderWidth: 1, borderColor: '#E5E5EA', backgroundColor: '#FFF' },
  tabBtnActive: { backgroundColor: '#EBF4FF', borderColor: '#0084FF' },
  tabText: { fontSize: 12, fontWeight: '700', color: '#8E8E93' },
  tabTextActive: { color: '#0084FF' },

  section: { padding: 16 },
  sectionHeading: { fontSize: 18, fontWeight: '900', color: '#333', marginBottom: 12, marginTop: 8 },
  sectionSubHeading: { fontSize: 12, color: '#8E8E93', marginBottom: 12, marginTop: -8 },
  
  card: { backgroundColor: '#FFF', borderRadius: 12, padding: 16, marginBottom: 16, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, elevation: 2, borderWidth: 1, borderColor: '#E5E5EA' },
  
  flexiRow: { flexDirection: 'row', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#E5E5EA' },
  flexiRowActive: { backgroundColor: '#F5FAFF' },
  flexiContent: { flex: 1, paddingHorizontal: 12 },
  flexiTitle: { fontSize: 13, fontWeight: '800', color: '#333' },
  flexiSub: { fontSize: 10, color: '#8E8E93', marginTop: 4 },
  flexiSub2: { fontSize: 10, color: '#333', marginTop: 4, lineHeight: 14 },
  flexiPrice: { fontSize: 12, fontWeight: '800', color: '#333', marginTop: 4 },
  myraHintBox: { backgroundColor: '#FEF9C3', padding: 12, borderRadius: 8, flexDirection: 'row', alignItems: 'flex-start', marginTop: 12 },
  myraHintText: { fontSize: 10, color: '#854D0E', marginLeft: 8, flex: 1, fontWeight: '600' },

  myraAIBox: { backgroundColor: '#F3E8FF', padding: 12, borderRadius: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  myraAIText: { color: '#7E22CE', fontSize: 12, fontWeight: '800' },
  infoBlock: { flexDirection: 'row', alignItems: 'flex-start' },
  infoTitle: { fontSize: 12, fontWeight: '800', color: '#333', marginLeft: 8, marginBottom: 8 },
  infoBullet: { fontSize: 10.5, color: '#333', marginLeft: 8, lineHeight: 16 },

  couponInputRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#E5E5EA', paddingBottom: 12, marginBottom: 16, alignItems: 'center' },
  couponInput: { flex: 1, fontSize: 13, color: '#333' },
  applyBtnText: { color: '#0084FF', fontSize: 12, fontWeight: '800' },
  couponRow: { paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#F2F4F7' },
  couponCodeText: { fontSize: 12, fontWeight: '800', color: '#333' },
  couponDiscountText: { fontSize: 12, fontWeight: '800', color: '#00A699' },
  couponDescText: { fontSize: 10, color: '#8E8E93', marginVertical: 8, lineHeight: 14, width: '80%' },
  removeText: { color: '#EF4444', fontSize: 12, fontWeight: '800' },

  benefitBox: { flex: 1, borderWidth: 1, borderColor: '#E5E5EA', borderRadius: 8, padding: 12, backgroundColor: '#FFF' },
  benefitBoxTitle: { fontSize: 10, fontWeight: '800', color: '#333', marginTop: 8, marginBottom: 4 },
  benefitBoxSub: { fontSize: 10, color: '#00A699', fontWeight: '700' },

  donationChip: { borderWidth: 1, borderColor: '#E5E5EA', borderRadius: 20, paddingVertical: 6, paddingHorizontal: 16, backgroundColor: '#FFF' },
  donationText: { fontSize: 12, fontWeight: '800', color: '#8E8E93' },

  lockPriceBanner: { backgroundColor: '#F5FAFF', paddingVertical: 8, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center' },
  stickyFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FFFFFF', paddingHorizontal: 16, paddingVertical: 12, borderTopWidth: 1, borderTopColor: '#E5E5EA' },
  footerPrice: { fontSize: 18, fontWeight: '900', color: '#111827' },
  footerSub: { fontSize: 10.5, color: '#8E8E93', marginTop: 2 },
  continueBtn: { backgroundColor: '#0084FF', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8 },
  continueBtnText: { color: '#FFFFFF', fontSize: 13, fontWeight: '800' },

  modalHeader: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#E5E5EA' },
  genderBtn: { flex: 1, borderWidth: 1, borderColor: '#0084FF', borderRadius: 8, paddingVertical: 12, alignItems: 'center' },
  genderBtnActive: { backgroundColor: '#0084FF' },
  genderBtnText: { color: '#0084FF', fontSize: 12, fontWeight: '800' },
  genderBtnTextActive: { color: '#FFF' },
  inputContainer: { borderWidth: 1, borderColor: '#0084FF', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8, marginBottom: 16 },
  inputLabel: { fontSize: 10, color: '#0084FF', fontWeight: '700', marginBottom: 4 },
  inputField: { fontSize: 13, color: '#333', padding: 0 },
  confirmBtn: { backgroundColor: '#0084FF', borderRadius: 8, paddingVertical: 14, alignItems: 'center' },
  confirmBtnText: { color: '#111827', fontSize: 13, fontWeight: '800' },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalBg: { position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 },
  modalContentBottom: { backgroundColor: '#FFF', borderRadius: 16, width: '100%', overflow: 'hidden', marginTop: 'auto', maxHeight: '90%' },
  modalTitle: { fontSize: 16, fontWeight: '900', color: '#333' },
  warningModalContent: { backgroundColor: '#FFF', borderRadius: 16, padding: 20, width: '100%', alignItems: 'center' },
  shieldIconLarge: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#0084FF', alignItems: 'center', justifyContent: 'center', marginTop: -60, borderWidth: 4, borderColor: '#FFF' },
  outlineBtn: { width: '100%', borderWidth: 1, borderColor: '#0084FF', borderRadius: 8, paddingVertical: 14, alignItems: 'center', marginBottom: 12 },
  outlineBtnText: { color: '#0084FF', fontSize: 13, fontWeight: '800' },
  solidBtn: { width: '100%', backgroundColor: '#0084FF', borderRadius: 8, paddingVertical: 14, alignItems: 'center' },
  solidBtnText: { color: '#FFFFFF', fontSize: 13, fontWeight: '800' },
});
