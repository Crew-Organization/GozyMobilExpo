import React, { useState } from 'react';
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { colors, radius, spacing, typography, shadow } from '@/src/theme/tokens';
import { formatBusDate, parseBusTravelDate } from '@/src/lib/bus-booking-utils';

const PRIMARY = '#1A6FEF';
const DARK_TEXT = '#1A1A1A';
const MUTED = '#6E6E6E';
const LINE = '#E8E8E8';
const LIGHT_BG = '#F7F7F7';
const GREEN = '#2E7D32';
const RED_TEXT = '#D32F2F';

const INDIA_STATES = [
  'Andhra Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Delhi', 'Goa', 'Gujarat',
  'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh',
  'Maharashtra', 'Odisha', 'Punjab', 'Rajasthan', 'Tamil Nadu', 'Telangana',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
];

const MOCK_OFFERS = [
  {
    id: 'WELCOMEGOZY',
    code: 'WELCOMEGOZY',
    desc: 'Get Flat 10% instant discount up to Rs. 150 + Flat 10% cashback up to Rs. 150 on first bus booking.',
    saving: 150,
    actionLabel: 'Login to avail offer',
    isPrimary: true,
  },
  {
    id: 'MEGABUS',
    code: 'MEGABUS',
    desc: 'Get discount up to 10% on your bus bookings!.',
    saving: 90,
    actionLabel: 'Apply',
    isPrimary: false,
  },
  {
    id: 'GOZYCBIPLAT',
    code: 'GOZYCBIPLAT',
    desc: 'Flat 8% instant discount up to Rs. 500.',
    saving: 400,
    actionLabel: 'Login to avail',
    isPrimary: false,
  },
];

type PassengerData = { name: string; age: string; gender: 'male' | 'female' };

export default function ReviewBookingScreen() {
  const params = useLocalSearchParams<{
    busId: string;
    operator: string;
    busType: string;
    seats: string;
    totalFare: string;
    fromCity: string;
    toCity: string;
    date: string;
    departureTime: string;
    arrivalTime: string;
    duration: string;
    boardingName: string;
    boardingTime: string;
    droppingName: string;
    droppingTime: string;
    isTripAssured?: string;
    hasFreeCancellation?: string;
  }>();

  const seats = params.seats?.split(',') ?? [];
  const seatCount = seats.length;
  const baseFare = parseInt(params.totalFare ?? '0', 10);
  const travelDate = parseBusTravelDate(params.date ?? '');
  const isTripAssuredBus = params.isTripAssured === 'true';
  const hasFreeCancelBus = params.hasFreeCancellation === 'true';

  // Passenger state
  const [passengers, setPassengers] = useState<PassengerData[]>(
    seats.map(() => ({ name: '', age: '', gender: 'male' as const }))
  );
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedState, setSelectedState] = useState('Telangana');
  const [saveToProfile, setSaveToProfile] = useState(true);

  // TripAssured Modal State
  const [showTripAssuredModal, setShowTripAssuredModal] = useState(false);

  // Add-ons
  const [addTripAssured, setAddTripAssured] = useState(false);
  const [addFreeCancellation, setAddFreeCancellation] = useState(false);
  const [addInsurance, setAddInsurance] = useState(false);

  // Offers
  const [appliedOffer, setAppliedOffer] = useState<string | null>(null);

  const tripAssuredCost = seatCount * 63;
  const freeCancelCost = seatCount * 475;
  const insuranceCost = seatCount * 15;

  const addOnTotal =
    (addTripAssured ? tripAssuredCost : 0) +
    (addFreeCancellation ? freeCancelCost : 0) +
    (addInsurance ? insuranceCost : 0);

  const offerDiscount = appliedOffer === 'MEGABUS' ? 90 : 0;
  const grandTotal = baseFare + addOnTotal - offerDiscount;

  const handleNext = () => {
    // Basic validation
    const hasAllNames = passengers.every((p) => p.name.trim().length > 2);
    const hasAllAges = passengers.every((p) => {
      const age = parseInt(p.age, 10);
      return !isNaN(age) && age > 0 && age < 120;
    });

    if (!hasAllNames || !hasAllAges) {
      Alert.alert('Incomplete Details', 'Please fill in all passenger names and ages.');
      return;
    }
    if (!phone) {
      Alert.alert('Phone Required', 'Please enter a phone number.');
      return;
    }

    if (!addTripAssured) {
      setShowTripAssuredModal(true);
      return;
    }

    proceedToPayment();
  };

  const proceedToPayment = () => {

    router.push({
      pathname: '/(bus-module)/payment',
      params: {
        ...params,
        grandTotal: String(grandTotal),
        taxes: '0',
        couponDiscount: String(offerDiscount),
        addonTotal: String(addOnTotal),
      },
    } as any);
  };

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.container}>
      {/* ── Header ── */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12} style={styles.backBtn}>
          <MaterialCommunityIcons name="arrow-left" size={22} color="#000" />
        </Pressable>
        <View style={styles.headerMid}>
          <Text style={styles.headerTitle}>Review Booking</Text>
          <Text style={styles.headerSub}>
            {params.fromCity} to {params.toCity} | {formatBusDate(travelDate, true)} | {params.boardingTime || params.departureTime}
          </Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* ── Journey Summary Card ── */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryOperator}>{params.operator}</Text>
          <Text style={styles.summaryBusType}>{params.busType}</Text>
          <View style={styles.summaryJourney}>
            <View style={styles.summaryJourneyLeft}>
              <Text style={styles.summaryDepTime}>{params.boardingTime || params.departureTime}, {formatBusDate(travelDate, true)}</Text>
              <Text style={styles.summaryPlace} numberOfLines={2}>{params.boardingName || params.fromCity}</Text>
            </View>
            <View style={styles.summaryDurationCol}>
              <Text style={styles.summaryDuration}>{params.duration}</Text>
              <View style={styles.summaryDurationLine}>
                <View style={styles.summaryLineDot} />
                <View style={styles.summaryLineTrack} />
                <View style={[styles.summaryLineDot, { backgroundColor: PRIMARY }]} />
              </View>
            </View>
            <View style={styles.summaryJourneyRight}>
              <Text style={styles.summaryArrTime}>{params.droppingTime || params.arrivalTime}</Text>
              <Text style={styles.summaryPlace} numberOfLines={2}>{params.droppingName || params.toCity}</Text>
            </View>
          </View>
          <Text style={styles.summarySeats}>Selected Seats : {seats.join(', ')}</Text>
        </View>

        {/* ── Traveller Details ── */}
        <View style={styles.section}>
          <View style={styles.sectionTitleRow}>
            <Text style={styles.sectionTitle}>Traveller Details</Text>
            <Text style={styles.seatCountBadge}>{passengers.filter(p => p.name).length}/{seatCount} Seats Added</Text>
          </View>

          <Pressable style={styles.addTravellerBanner}>
            <MaterialCommunityIcons name="information-outline" size={16} color={PRIMARY} />
            <Text style={styles.addTravellerText}>Add {seatCount} traveller detail{seatCount > 1 ? 's' : ''}</Text>
          </Pressable>

          {passengers.map((pax, idx) => (
            <View key={idx} style={styles.passengerInputRow}>
              {/* Name */}
              <View style={[styles.nameInputWrap, { flex: 2 }]}>
                <Text style={styles.inputFloatLabel}>FULL NAME</Text>
                <TextInput
                  style={styles.mmtInput}
                  placeholder=""
                  value={pax.name}
                  onChangeText={(v) => {
                    const updated = [...passengers];
                    updated[idx] = { ...updated[idx], name: v };
                    setPassengers(updated);
                  }}
                  autoCapitalize="words"
                />
              </View>
              {/* Age */}
              <View style={[styles.nameInputWrap, { flex: 0.8 }]}>
                <Text style={styles.inputFloatLabel}>AGE</Text>
                <TextInput
                  style={styles.mmtInput}
                  placeholder=""
                  value={pax.age}
                  onChangeText={(v) => {
                    const updated = [...passengers];
                    updated[idx] = { ...updated[idx], age: v };
                    setPassengers(updated);
                  }}
                  keyboardType="number-pad"
                  maxLength={3}
                />
              </View>
              {/* Gender icons */}
              <View style={styles.genderIcons}>
                <Pressable onPress={() => {
                  const updated = [...passengers];
                  updated[idx] = { ...updated[idx], gender: 'male' };
                  setPassengers(updated);
                }}>
                  <MaterialCommunityIcons
                    name="face-man-outline"
                    size={28}
                    color={pax.gender === 'male' ? PRIMARY : '#BDBDBD'}
                  />
                </Pressable>
                <Pressable onPress={() => {
                  const updated = [...passengers];
                  updated[idx] = { ...updated[idx], gender: 'female' };
                  setPassengers(updated);
                }}>
                  <MaterialCommunityIcons
                    name="face-woman-outline"
                    size={28}
                    color={pax.gender === 'female' ? '#E91E63' : '#BDBDBD'}
                  />
                </Pressable>
              </View>
            </View>
          ))}

          {/* Login to save banner */}
          <View style={styles.loginSaveBanner}>
            <MaterialCommunityIcons name="gift-outline" size={20} color="#9C27B0" />
            <Text style={styles.loginSaveText}>
              Login to save upto{' '}
              <Text style={styles.loginSaveAmt}>₹400</Text>
              {'\n'}
              <Text style={styles.loginSaveSub}>₹400 savings using code 'GOZYCBIPLAT'</Text>
            </Text>
            <Pressable>
              <Text style={styles.loginNowText}>Login Now</Text>
            </Pressable>
          </View>
        </View>

        {/* ── Contact Details ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Details</Text>
          <Text style={styles.sectionSubtitle}>We'll send your ticket here</Text>

          <View style={styles.contactInputWrap}>
            <Text style={styles.inputFloatLabel}>EMAIL ADDRESS</Text>
            <TextInput
              style={styles.mmtInput}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
          <View style={styles.contactInputWrap}>
            <Text style={styles.inputFloatLabel}>PHONE NUMBER</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
              <Text style={{ fontSize: 13, fontWeight: '500', color: DARK_TEXT, marginRight: 8 }}>+91</Text>
              <TextInput
                style={{ flex: 1, fontSize: 13, fontWeight: '500', color: DARK_TEXT, paddingVertical: 2 }}
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                maxLength={10}
                placeholder="Enter 10-digit number"
                placeholderTextColor="#BDBDBD"
              />
            </View>
          </View>
        </View>

        {/* ── Your State ── */}
        <View style={styles.section}>
          <View style={styles.sectionTitleRow}>
            <Text style={styles.sectionTitle}>Your State</Text>
            <MaterialCommunityIcons name="information-outline" size={16} color={MUTED} />
          </View>
          <Text style={styles.sectionSubtitle}>Required for GST purpose on your tax invoice</Text>
          <View style={styles.stateDropdown}>
            <Text style={styles.stateDropdownLabel}>State</Text>
            <Text style={styles.stateDropdownValue}>{selectedState}</Text>
            <MaterialCommunityIcons name="chevron-down" size={20} color={MUTED} />
          </View>
          <Pressable onPress={() => setSaveToProfile(!saveToProfile)} style={styles.saveToProfileRow}>
            <View style={[styles.checkbox, saveToProfile && styles.checkboxChecked]}>
              {saveToProfile && <MaterialCommunityIcons name="check" size={13} color="#FFF" />}
            </View>
            <Text style={styles.saveToProfileText}>Confirm and save these details to your profile</Text>
          </Pressable>
        </View>

        {/* ── Bus Exclusive Deal ── */}
        <View style={styles.exclusiveDealCard}>
          <View style={styles.exclusiveDealBadge}>
            <MaterialCommunityIcons name="bus" size={13} color="#FFF" />
            <Text style={styles.exclusiveDealBadgeText}>Bus Exclusive Deal</Text>
          </View>
          <Text style={styles.exclusiveDealTitle}>Complete this booking to get</Text>
          <View style={styles.exclusiveDealBullets}>
            <ExclusiveBullet text={`Exclusive rates on select properties in ${params.toCity}`} />
            <ExclusiveBullet text="Extra 12% off using code BOOKSTAYS" bold />
          </View>
        </View>

        {/* ── Offers & Discounts ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Offers & Discounts</Text>
          {MOCK_OFFERS.map((offer) => (
            <View key={offer.id} style={styles.offerRow}>
              <View style={styles.offerLogoCircle}>
                <Text style={styles.offerLogoText}>GZ</Text>
              </View>
              <View style={styles.offerContent}>
                <Text style={styles.offerCode}>{offer.code}</Text>
                <Text style={styles.offerDesc}>{offer.desc}</Text>
                <Text style={styles.offerSaving}>Save Rs. {offer.saving} on this booking</Text>
              </View>
              <Pressable
                onPress={() => {
                  if (offer.actionLabel === 'Apply') {
                    setAppliedOffer(appliedOffer === offer.id ? null : offer.id);
                  }
                }}
                style={[styles.offerActionBtn, appliedOffer === offer.id && styles.offerAppliedBtn]}
              >
                <Text style={[styles.offerActionText, appliedOffer === offer.id && styles.offerAppliedText]}>
                  {appliedOffer === offer.id ? 'Applied ✓' : offer.actionLabel}
                </Text>
              </Pressable>
            </View>
          ))}
        </View>

        {/* ── TripAssured Add-on ── */}
        <View style={styles.addonCard}>
          <View style={styles.addonHeader}>
            <View style={styles.addonIconWrap}>
              <MaterialCommunityIcons name="shield-check" size={26} color="#2196F3" />
            </View>
            <View style={styles.addonHeaderText}>
              <Text style={styles.addonTitle}>TripAssured</Text>
              <Text style={styles.addonSubtitle}>Get TripAssured at just ₹{tripAssuredCost / seatCount}</Text>
            </View>
          </View>
          <View style={styles.addonPurpleBanner}>
            <MaterialCommunityIcons name="thumb-up-outline" size={13} color="#7B1FA2" />
            <Text style={styles.addonPurpleBannerText}>10 Lakh+ people secured their trips with TripAssured</Text>
          </View>
          <View style={styles.addonBenefitCard}>
            <Text style={styles.addonBenefitTitle}>Flat 2x Refund in case of unexpected bus cancellations</Text>
            <View style={styles.addonRefundRow}>
              <View style={styles.addonRefundBox}>
                <Text style={styles.addonRefundMult}>1x</Text>
                <Text style={styles.addonRefundAmt}>₹{baseFare.toLocaleString('en-IN')}</Text>
                <Text style={styles.addonRefundMode}>Original Paymode</Text>
              </View>
              <Text style={styles.addonPlus}>+</Text>
              <View style={styles.addonRefundBox}>
                <Text style={styles.addonRefundMult}>1x</Text>
                <Text style={styles.addonRefundAmt}>up to ₹2000</Text>
                <Text style={styles.addonRefundMode}>As MyCash</Text>
              </View>
            </View>
          </View>
          <Pressable onPress={() => setAddTripAssured(!addTripAssured)} style={styles.addonCheckRow}>
            <View style={[styles.squareCheckbox, addTripAssured && styles.squareCheckboxChecked]}>
              {addTripAssured && <MaterialCommunityIcons name="check" size={13} color="#FFF" />}
            </View>
            <Text style={styles.addonCheckText}>Add TripAssured at ₹{tripAssuredCost}/person</Text>
          </Pressable>
        </View>

        {/* ── Free Cancellation Add-on ── */}
        <View style={styles.addonCard}>
          <View style={styles.addonHeader}>
            <View style={[styles.addonIconWrap, { backgroundColor: '#E8F5E9' }]}>
              <MaterialCommunityIcons name="calendar-remove-outline" size={26} color="#2E7D32" />
            </View>
            <View style={styles.addonHeaderText}>
              <Text style={styles.addonTitle}>Free Cancellation</Text>
              <Text style={styles.addonSubtitle}>Unsure of plans? We've got you covered</Text>
            </View>
          </View>
          <View style={[styles.addonPurpleBanner, { backgroundColor: '#F3E5F5' }]}>
            <MaterialCommunityIcons name="thumb-up-outline" size={13} color="#7B1FA2" />
            <Text style={styles.addonPurpleBannerText}>Customers saved Rs. 1.3 Crore+ in the last 3 months</Text>
          </View>
          <View style={styles.addonGreenBenefits}>
            <GreenBenefit text="Get 100% refund" />
            <GreenBenefit text="Cancel until 6 hours before departure" />
          </View>
          <Pressable onPress={() => setAddFreeCancellation(!addFreeCancellation)} style={styles.addonCheckRow}>
            <View style={[styles.squareCheckbox, addFreeCancellation && styles.squareCheckboxChecked]}>
              {addFreeCancellation && <MaterialCommunityIcons name="check" size={13} color="#FFF" />}
            </View>
            <Text style={styles.addonCheckText}>Add Free Cancellation at ₹{freeCancelCost}/person</Text>
            <Pressable>
              <Text style={styles.addonDetailsLink}> Details</Text>
            </Pressable>
          </Pressable>
        </View>

        {/* ── Trip Insurance Add-on ── */}
        <View style={styles.addonCard}>
          <View style={styles.addonHeader}>
            <View style={[styles.addonIconWrap, { backgroundColor: '#E8F5E9' }]}>
              <MaterialCommunityIcons name="bus-side" size={26} color="#388E3C" />
            </View>
            <View style={styles.addonHeaderText}>
              <Text style={styles.addonTitle}>Secure your trip at just ₹{insuranceCost}</Text>
              <View style={styles.poweredByRow}>
                <Text style={styles.poweredByText}>Powered by </Text>
                <View style={styles.ackoChip}>
                  <Text style={styles.ackoText}>ACKO</Text>
                </View>
                <Pressable>
                  <Text style={styles.seeBenefitsText}> See benefits</Text>
                </Pressable>
              </View>
            </View>
          </View>
          <Pressable onPress={() => setAddInsurance(!addInsurance)} style={styles.addonCheckRow}>
            <View style={[styles.squareCheckbox, addInsurance && styles.squareCheckboxChecked]}>
              {addInsurance && <MaterialCommunityIcons name="check" size={13} color="#FFF" />}
            </View>
            <Text style={styles.addonCheckText}>Add Trip Insurance at ₹{insuranceCost}/person</Text>
          </Pressable>
        </View>

        {/* ── TripAssured Modal ── */}
        <Modal
          visible={showTripAssuredModal}
          animationType="fade"
          transparent={true}
          onRequestClose={() => setShowTripAssuredModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, { padding: 0, paddingBottom: 24 }]}>
              {/* Top Banner */}
              <View style={styles.modalBanner}>
                <Text style={styles.modalBannerText}>Just a second, you missed this...</Text>
                <Pressable onPress={() => setShowTripAssuredModal(false)} style={styles.modalCloseCircle}>
                  <MaterialCommunityIcons name="close" size={16} color="#FFF" />
                </Pressable>
              </View>

              {/* Icon & Title */}
              <View style={{ alignItems: 'center', marginTop: 20 }}>
                <View style={styles.modalIconBox}>
                  <MaterialCommunityIcons name="bus-side" size={40} color="#0084FF" />
                  <View style={styles.modalShieldIcon}>
                    <MaterialCommunityIcons name="shield-check" size={16} color="#FFF" />
                  </View>
                </View>
                <Text style={styles.modalMainTitle}>Get TripAssured at just ₹{tripAssuredCost / seatCount}</Text>
              </View>

              {/* Benefit Card */}
              <View style={[styles.addonBenefitCard, { marginHorizontal: 20, marginTop: 20 }]}>
                <View style={{ flexDirection: 'row', gap: 8, alignItems: 'flex-start' }}>
                  <MaterialCommunityIcons name="ticket-percent-outline" size={20} color="#D97706" />
                  <Text style={[styles.addonBenefitTitle, { flex: 1 }]}>Flat 2x Refund <Text style={{fontWeight: '400'}}>in case of unexpected bus cancellations</Text></Text>
                </View>
                <View style={styles.addonRefundRow}>
                  <View style={styles.addonRefundBox}>
                    <Text style={styles.addonRefundMult}>1x</Text>
                    <Text style={styles.addonRefundAmt}>₹{baseFare.toLocaleString('en-IN')}</Text>
                    <Text style={styles.addonRefundMode}>Original Paymode</Text>
                  </View>
                  <Text style={styles.addonPlus}>+</Text>
                  <View style={styles.addonRefundBox}>
                    <Text style={styles.addonRefundMult}>1x</Text>
                    <Text style={[styles.addonRefundAmt, { color: '#00A699' }]}>up to ₹2000</Text>
                    <Text style={styles.addonRefundMode}>As MyCash</Text>
                  </View>
                </View>
                <Text style={styles.modalTermsText}>*You can get a maximum of Rs. 2000 as myCash</Text>
              </View>

              {/* Actions */}
              <View style={{ paddingHorizontal: 20, marginTop: 24, gap: 16 }}>
                <Pressable
                  style={styles.modalAddBtn}
                  onPress={() => {
                    setAddTripAssured(true);
                    setShowTripAssuredModal(false);
                    proceedToPayment();
                  }}
                >
                  <Text style={styles.modalAddBtnText}>Add TripAssured for ₹{tripAssuredCost / seatCount}/person</Text>
                </Pressable>
                
                <Pressable
                  style={styles.modalSkipBtn}
                  onPress={() => {
                    setShowTripAssuredModal(false);
                    proceedToPayment();
                  }}
                >
                  <Text style={styles.modalSkipBtnText}>Skip for now</Text>
                </Pressable>
              </View>

              <Text style={styles.modalFullTermsLink}>Full Terms And Conditions</Text>
            </View>
          </View>
        </Modal>

        {/* ── Terms ── */}
        <Text style={styles.termsText}>
          By proceeding, I Agree to Gozy's{' '}
          <Text style={{ color: PRIMARY }}>User Agreement</Text>,{' '}
          <Text style={{ color: PRIMARY }}>Terms of Service</Text> and{' '}
          <Text style={{ color: PRIMARY }}>Privacy Policy</Text>
        </Text>

        <View style={{ height: 16 }} />
      </ScrollView>

      {/* ── Sticky Bottom Bar ── */}
      <View style={styles.bottomBar}>
        <View style={styles.bottomLeft}>
          <View style={styles.bottomFareRow}>
            <Text style={styles.bottomFare}>₹{grandTotal.toLocaleString('en-IN')}</Text>
            <MaterialCommunityIcons name="information-outline" size={14} color={MUTED} />
          </View>
          <Text style={styles.bottomFareSub}>For {seatCount} Seat{seatCount > 1 ? 's' : ''}</Text>
        </View>
        <Pressable
          onPress={handleNext}
          style={styles.nextBtn}
        >
          <Text style={styles.nextBtnText}>Next</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

function ExclusiveBullet({ text, bold }: { text: string; bold?: boolean }) {
  return (
    <View style={excStyles.row}>
      <MaterialCommunityIcons name="check" size={14} color={PRIMARY} />
      <Text style={[excStyles.text, bold && { fontWeight: '700' }]}>{text}</Text>
    </View>
  );
}
const excStyles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-start', gap: 6, marginTop: 4 },
  text: { flex: 1, fontSize: 13, color: DARK_TEXT, fontWeight: '400', lineHeight: 18 },
});

function GreenBenefit({ text }: { text: string }) {
  return (
    <View style={gbStyles.row}>
      <MaterialCommunityIcons name="check-circle" size={18} color={GREEN} />
      <Text style={gbStyles.text}>{text}</Text>
    </View>
  );
}
const gbStyles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 6 },
  text: { fontSize: 13, color: DARK_TEXT, fontWeight: '500' },
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: LIGHT_BG },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
    gap: 8,
  },
  backBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  headerMid: { flex: 1 },
  headerTitle: { fontSize: 17, fontWeight: '700', color: '#000000' },
  headerSub: { fontSize: 10.5, color: '#6E6E6E', fontWeight: '400', marginTop: 2 },

  scrollContent: { paddingBottom: 8 },

  // Journey Summary
  summaryCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderBottomWidth: 8,
    borderBottomColor: LIGHT_BG,
  },
  summaryOperator: { fontSize: 16, fontWeight: '700', color: DARK_TEXT, marginBottom: 2 },
  summaryBusType: { fontSize: 13, color: MUTED, marginBottom: 12 },
  summaryJourney: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12 },
  summaryJourneyLeft: { flex: 1 },
  summaryJourneyRight: { flex: 1, alignItems: 'flex-end' },
  summaryDurationCol: { flex: 1, alignItems: 'center', gap: 6, paddingTop: 4 },
  summaryDepTime: { fontSize: 13, fontWeight: '700', color: DARK_TEXT, marginBottom: 4 },
  summaryArrTime: { fontSize: 13, fontWeight: '700', color: DARK_TEXT, textAlign: 'right', marginBottom: 4 },
  summaryPlace: { fontSize: 12, color: MUTED, lineHeight: 16, fontWeight: '400' },
  summaryDuration: { fontSize: 10.5, color: MUTED, fontWeight: '600' },
  summaryDurationLine: { flexDirection: 'row', alignItems: 'center', width: '80%' },
  summaryLineDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#9E9E9E' },
  summaryLineTrack: { flex: 1, height: 1.5, backgroundColor: '#D0D0D0' },
  summarySeats: { fontSize: 13, fontWeight: '600', color: DARK_TEXT, borderTopWidth: 1, borderTopColor: LINE, paddingTop: 10 },

  // Sections
  section: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 8,
    borderBottomColor: LIGHT_BG,
    gap: 12,
  },
  sectionTitleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: DARK_TEXT },
  sectionSubtitle: { fontSize: 12, color: MUTED, marginTop: -6 },
  seatCountBadge: { fontSize: 12, fontWeight: '700', color: RED_TEXT },

  // Add traveller banner
  addTravellerBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    backgroundColor: '#EFF6FF',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  addTravellerText: { fontSize: 13, fontWeight: '600', color: PRIMARY },

  // Passenger row inputs
  passengerInputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  nameInputWrap: {
    borderWidth: 1.5,
    borderColor: PRIMARY,
    borderRadius: 4,
    paddingTop: 18,
    paddingHorizontal: 10,
    paddingBottom: 8,
    position: 'relative',
    backgroundColor: '#FFFFFF',
  },
  inputFloatLabel: {
    position: 'absolute',
    top: 6,
    left: 10,
    fontSize: 10,
    fontWeight: '700',
    color: PRIMARY,
    letterSpacing: 0.5,
  },
  mmtInput: {
    fontSize: 13,
    fontWeight: '500',
    color: DARK_TEXT,
    paddingVertical: 2,
    borderWidth: 0,
    backgroundColor: 'transparent',
  },
  genderIcons: { flexDirection: 'row', gap: 8, paddingBottom: 8 },

  // Login save banner
  loginSaveBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    backgroundColor: '#FAFAFA',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: LINE,
  },
  loginSaveText: { flex: 1, fontSize: 13, color: DARK_TEXT, lineHeight: 18 },
  loginSaveAmt: { fontWeight: '700', color: DARK_TEXT },
  loginSaveSub: { fontSize: 12, color: MUTED },
  loginNowText: { fontSize: 13, fontWeight: '700', color: PRIMARY },

  // Contact inputs
  contactInputWrap: {
    borderWidth: 1,
    borderColor: '#BDBDBD',
    borderRadius: 4,
    paddingTop: 18,
    paddingHorizontal: 10,
    paddingBottom: 8,
    position: 'relative',
    backgroundColor: '#FFFFFF',
  },
  phonePrefix: {
    position: 'absolute',
    left: 10,
    bottom: 10,
    zIndex: 1,
  },
  phonePrefixText: { fontSize: 13, fontWeight: '500', color: DARK_TEXT },
  phoneTextInput: {
    fontSize: 13,
    fontWeight: '500',
    color: DARK_TEXT,
    paddingLeft: 36,
    flex: 1,
  },

  // State dropdown
  stateDropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#BDBDBD',
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
  },
  stateDropdownLabel: { fontSize: 10.5, color: MUTED, width: 50 },
  stateDropdownValue: { flex: 1, fontSize: 13, fontWeight: '500', color: DARK_TEXT },
  saveToProfileRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  checkbox: {
    width: 20, height: 20, borderRadius: 4, borderWidth: 2, borderColor: '#BDBDBD',
    alignItems: 'center', justifyContent: 'center',
  },
  checkboxChecked: { backgroundColor: PRIMARY, borderColor: PRIMARY },
  saveToProfileText: { fontSize: 13, color: MUTED, flex: 1 },

  // Bus Exclusive Deal
  exclusiveDealCard: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 8,
    borderBottomColor: LIGHT_BG,
    gap: 8,
  },
  exclusiveDealBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    alignSelf: 'flex-start',
    backgroundColor: '#D32F2F',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 3,
  },
  exclusiveDealBadgeText: { fontSize: 12, fontWeight: '800', color: '#FFFFFF', letterSpacing: 0.3 },
  exclusiveDealTitle: { fontSize: 13, color: MUTED, fontWeight: '500' },
  exclusiveDealBullets: { gap: 2 },

  // Offers
  offerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: LINE,
  },
  offerLogoCircle: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: '#D32F2F', alignItems: 'center', justifyContent: 'center',
  },
  offerLogoText: { fontSize: 10.5, fontWeight: '900', color: '#FFFFFF' },
  offerContent: { flex: 1, gap: 3 },
  offerCode: { fontSize: 13, fontWeight: '700', color: DARK_TEXT },
  offerDesc: { fontSize: 12, color: MUTED, lineHeight: 17 },
  offerSaving: { fontSize: 12, fontWeight: '700', color: GREEN },
  offerActionBtn: { paddingTop: 2 },
  offerAppliedBtn: {},
  offerActionText: { fontSize: 13, fontWeight: '700', color: PRIMARY },
  offerAppliedText: { color: GREEN },

  // Add-on cards
  addonCard: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 8,
    borderBottomColor: LIGHT_BG,
    gap: 12,
  },
  addonHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  addonIconWrap: {
    width: 48, height: 48, borderRadius: 8,
    backgroundColor: '#E3F2FD', alignItems: 'center', justifyContent: 'center',
  },
  addonHeaderText: { flex: 1, gap: 3 },
  addonTitle: { fontSize: 16, fontWeight: '700', color: DARK_TEXT },
  addonSubtitle: { fontSize: 13, color: MUTED },
  addonPurpleBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F3E5F5',
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  addonPurpleBannerText: { fontSize: 12, color: '#7B1FA2', fontWeight: '600' },
  addonBenefitCard: {
    borderWidth: 1, borderColor: LINE, borderRadius: 6,
    padding: 12, gap: 10,
  },
  addonBenefitTitle: { fontSize: 13, fontWeight: '600', color: DARK_TEXT },
  addonRefundRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  addonRefundBox: {
    flex: 1, borderWidth: 1, borderColor: LINE, borderRadius: 5,
    padding: 10, alignItems: 'center', gap: 2,
  },
  addonRefundMult: { fontSize: 10.5, color: MUTED, fontWeight: '600' },
  addonRefundAmt: { fontSize: 13, fontWeight: '800', color: DARK_TEXT },
  addonRefundMode: { fontSize: 10, color: MUTED, textAlign: 'center' },
  addonPlus: { fontSize: 16, color: MUTED, fontWeight: '700' },
  addonGreenBenefits: {
    borderWidth: 1, borderColor: LINE, borderRadius: 6, paddingHorizontal: 12, paddingVertical: 4,
  },
  addonCheckRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  squareCheckbox: {
    width: 22, height: 22, borderRadius: 4, borderWidth: 2, borderColor: '#BDBDBD',
    alignItems: 'center', justifyContent: 'center',
  },
  squareCheckboxChecked: { backgroundColor: PRIMARY, borderColor: PRIMARY },
  addonCheckText: { fontSize: 13, fontWeight: '500', color: DARK_TEXT },
  addonDetailsLink: { fontSize: 13, fontWeight: '700', color: PRIMARY },

  // Powered by row
  poweredByRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' },
  poweredByText: { fontSize: 12, color: MUTED },
  ackoChip: {
    paddingHorizontal: 5, paddingVertical: 1, borderRadius: 3,
    backgroundColor: '#7C3AED',
  },
  ackoText: { fontSize: 10.5, fontWeight: '900', color: '#FFF' },
  seeBenefitsText: { fontSize: 12, fontWeight: '700', color: PRIMARY },

  // Terms
  termsText: {
    fontSize: 12, color: MUTED, paddingHorizontal: 16, paddingVertical: 12,
    backgroundColor: '#FFFFFF', lineHeight: 18,
  },

  // Bottom bar (MMT style)
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E8E8E8',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  bottomLeft: { gap: 2 },
  bottomFareRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  bottomFare: { fontSize: 18, fontWeight: '800', color: '#1A1A1A' },
  bottomFareSub: { fontSize: 10, color: '#6E6E6E', fontWeight: '600' },
  nextBtn: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 4,
  },
  nextBtnDisabled: {
    opacity: 0.5,
  },
  nextBtnText: { fontSize: 14, fontWeight: '800', color: '#FFFFFF' },

  // Modal Overlay
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    width: '100%',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
  },
  modalBanner: {
    backgroundColor: '#E0F2FE',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  modalBannerText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0084FF',
  },
  modalCloseCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#A3A3A3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalIconBox: {
    position: 'relative',
    marginBottom: 8,
  },
  modalShieldIcon: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    backgroundColor: '#00A699',
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  modalMainTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#1A1A1A',
  },
  modalTermsText: {
    fontSize: 11,
    color: '#8E8E93',
    marginTop: 10,
  },
  modalAddBtn: {
    backgroundColor: '#0084FF',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalAddBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  modalSkipBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  modalSkipBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  modalFullTermsLink: {
    fontSize: 12,
    color: '#0084FF',
    fontWeight: '700',
    textAlign: 'left',
    marginTop: 24,
    paddingHorizontal: 20,
  },
});
