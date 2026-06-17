import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, TextInput } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function CabReviewScreen() {
  const params = useLocalSearchParams<{ type?: string }>();
  
  const [roofCarrier, setRoofCarrier] = useState(false);
  const [driverLanguage, setDriverLanguage] = useState(false);
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [useBilling, setUseBilling] = useState(true);
  const [paymentMode, setPaymentMode] = useState<'part' | 'full'>('full');

  const [fullName, setFullName] = useState('Nikshitha');
  const [mobileNo, setMobileNo] = useState('+91 9347556415');
  const [emailId, setEmailId] = useState('nikshithavadthyavath@gmail.com');

  const isOutstation = params.type === 'outstation';

  const partPayAmount = isOutstation ? '₹6,358' : '₹166';
  const fullPayAmount = isOutstation ? '₹31,408' : '₹830';
  const finalPrice = paymentMode === 'part' ? partPayAmount : fullPayAmount;

  const handleCheckout = () => {
    router.push({
      pathname: '/(travel)/(cabs)/cab-payment',
      params: { type: params.type, price: finalPrice }
    });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12} style={styles.backBtn}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#0F172A" />
        </Pressable>
        <Text style={styles.headerTitle}>Review Your Ride</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Support Banner */}
        <View style={styles.supportBanner}>
          <View style={styles.supportBannerText}>
            <Text style={styles.supportBannerTitle}>24*7 Customer Support</Text>
            <Text style={styles.supportBannerSub}>Get instant support from customer care</Text>
          </View>
          <MaterialCommunityIcons name="headset" size={32} color="#8B5CF6" />
        </View>

        {/* Special Requests */}
        <Text style={styles.sectionTitle}>Special Requests</Text>
        <View style={styles.card}>
          <Pressable style={styles.checkboxRow} onPress={() => setRoofCarrier(!roofCarrier)}>
            <View style={[styles.checkbox, roofCarrier && styles.checkboxActive]}>
              {roofCarrier && <MaterialCommunityIcons name="check" size={14} color="#FFF" />}
            </View>
            <View style={styles.checkboxContent}>
              <View style={styles.checkboxTextRow}>
                <Text style={styles.checkboxLabel}>Roof Carrier</Text>
                <Text style={styles.checkboxPrice}>₹209</Text>
              </View>
              <Text style={styles.checkboxSub}>Get a roof carrier for additional extra luggage</Text>
            </View>
          </Pressable>

          <View style={styles.divider} />

          <Pressable style={styles.checkboxRow} onPress={() => setDriverLanguage(!driverLanguage)}>
            <View style={[styles.checkbox, driverLanguage && styles.checkboxActive]}>
              {driverLanguage && <MaterialCommunityIcons name="check" size={14} color="#FFF" />}
            </View>
            <View style={styles.checkboxContent}>
              <View style={styles.checkboxTextRow}>
                <Text style={styles.checkboxLabel}>Drivers Language</Text>
                <Text style={styles.checkboxPrice}>₹209</Text>
              </View>
              <Text style={styles.checkboxSub}>Choose your preferred language for a smoother ride</Text>
              <Text style={styles.warningText}>Most likely the assigned driver speaks local language if not selected</Text>
            </View>
          </Pressable>
        </View>

        {/* Cancellation Policy */}
        <Text style={styles.sectionTitle}>Cancellation Policy</Text>
        <View style={styles.card}>
          <Text style={styles.cancelTitle}>Free cancellation till 1 hr of departure</Text>
          
          <View style={styles.timelineContainer}>
            <View style={styles.timelineTrack}>
              <View style={styles.timelineFill} />
            </View>
            <View style={styles.timelinePoints}>
              <View style={styles.timelinePoint}>
                <Text style={styles.timelineTagFully}>Fully Refundable</Text>
                <View style={styles.timelineDotGreen} />
                <Text style={styles.timelineLabel}>Post Booking</Text>
              </View>
              <View style={styles.timelinePointCenter}>
                <View style={styles.timelineDotGrey} />
                <Text style={styles.timelineLabelCenter}>Apr 23, 9:00 AM</Text>
              </View>
              <View style={styles.timelinePointRight}>
                <Text style={styles.timelineTagNon}>Non Refundable</Text>
                <View style={styles.timelineDotGrey} />
                <Text style={styles.timelineLabelRight}>Ride Started</Text>
              </View>
            </View>
          </View>
          
          <Pressable style={styles.readCancelBtn}>
            <Text style={styles.readCancelText}>Read Cancellation Policy</Text>
            <MaterialCommunityIcons name="chevron-right" size={20} color="#0084FF" />
          </Pressable>
        </View>

        {/* Traveller Details */}
        <Text style={styles.sectionTitle}>Traveller Details</Text>
        <View style={styles.card}>
          <View style={styles.pickupInputWrapper}>
            <Text style={styles.pickupInputLabel}>Pickup Location</Text>
            <Text style={styles.pickupInputText} numberOfLines={1}>Gugudu kullayappa swammy agencies, M...</Text>
          </View>

          <View style={styles.travellerHeaderRow}>
            <Text style={styles.travellerHeader}>Traveller</Text>
            <Text style={styles.saveBtn}>Save</Text>
          </View>

          <View style={styles.formRow}>
            <View style={[styles.inputContainer, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.floatingLabel}>FULL NAME</Text>
              <TextInput style={styles.input} value={fullName} onChangeText={setFullName} />
            </View>
            <View style={[styles.inputContainer, { flex: 1, marginLeft: 8 }]}>
              <Text style={styles.floatingLabel}>MOBILE NO</Text>
              <TextInput style={styles.input} value={mobileNo} onChangeText={setMobileNo} keyboardType="phone-pad" />
            </View>
          </View>

          <View style={[styles.inputContainer, { marginTop: 16 }]}>
            <Text style={styles.floatingLabel}>EMAIL ID</Text>
            <TextInput style={styles.input} value={emailId} onChangeText={setEmailId} keyboardType="email-address" />
          </View>

          <Text style={styles.genderLabel}>GENDER</Text>
          <View style={styles.genderRow}>
            <Pressable onPress={() => setGender('Male')} style={styles.radioOption}>
              <View style={[styles.radioOuter, gender === 'Male' && styles.radioOuterActive]}>
                {gender === 'Male' && <View style={styles.radioInner} />}
              </View>
              <Text style={styles.radioText}>Male</Text>
            </Pressable>
            <Pressable onPress={() => setGender('Female')} style={styles.radioOption}>
              <View style={[styles.radioOuter, gender === 'Female' && styles.radioOuterActive]}>
                {gender === 'Female' && <View style={styles.radioInner} />}
              </View>
              <Text style={styles.radioText}>Female</Text>
            </Pressable>
            <Pressable onPress={() => setGender('Other')} style={styles.radioOption}>
              <View style={[styles.radioOuter, gender === 'Other' && styles.radioOuterActive]}>
                {gender === 'Other' && <View style={styles.radioInner} />}
              </View>
              <Text style={styles.radioText}>Other</Text>
            </Pressable>
          </View>

          <View style={styles.orDividerRow}>
            <View style={styles.orLine} />
            <Text style={styles.orText}>Or</Text>
            <View style={styles.orLine} />
          </View>

          <Pressable style={styles.loginAccountBtn}>
            <MaterialCommunityIcons name="account-circle-outline" size={20} color="#0084FF" />
            <Text style={styles.loginAccountText}>LOG INTO EXISTING ACCOUNT</Text>
          </Pressable>

          <Pressable onPress={() => setUseBilling(!useBilling)} style={styles.billingCheckbox}>
            <View style={[styles.checkbox, useBilling && styles.checkboxActive]}>
              {useBilling && <MaterialCommunityIcons name="check" size={14} color="#FFF" />}
            </View>
            <Text style={styles.billingText}>Use pickup location as billing address</Text>
          </Pressable>
        </View>

        {/* Reviews */}
        <Text style={styles.sectionTitle}>What people are saying about us?</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.reviewsScroll}>
          <View style={styles.reviewCard}>
            <View style={styles.reviewHeader}>
              <View>
                <Text style={styles.reviewerName}>Ashok Kharbe</Text>
                <Text style={styles.reviewDate}>23 Mar 2024</Text>
              </View>
              <View style={styles.ratingBadge}>
                <Text style={styles.ratingText}>5.0</Text>
              </View>
            </View>
            <Text style={styles.reviewText} numberOfLines={3}>
              Cab Driver Guruji is a truly professional and excellent Driver. He understood m...
            </Text>
          </View>
          <View style={styles.reviewCard}>
            <View style={styles.reviewHeader}>
              <View>
                <Text style={styles.reviewerName}>Anonymous</Text>
                <Text style={styles.reviewDate}>01 Mar 2024</Text>
              </View>
              <View style={styles.ratingBadge}>
                <Text style={styles.ratingText}>4.8</Text>
              </View>
            </View>
            <Text style={styles.reviewText} numberOfLines={3}>
              Just had a comfortable ride! Would definitely book again. Highly recommended...
            </Text>
          </View>
        </ScrollView>

        <Text style={styles.disclaimerText}>
          By proceeding to book, I agree to MakeMyTrip's Privacy Policy, User Agreement, Terms of Service & Cancellation Rules.
        </Text>
      </ScrollView>

      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
        <Text style={styles.advanceNotice}>
          Pay {partPayAmount} in advance to reserve and rest to driver.
        </Text>
        <View style={styles.bottomRow}>
          <View style={styles.paymentRadios}>
            <Pressable onPress={() => setPaymentMode('part')} style={styles.bottomRadioOption}>
              <View style={[styles.radioOuter, paymentMode === 'part' && styles.radioOuterActive, { width: 16, height: 16 }]}>
                {paymentMode === 'part' && <View style={[styles.radioInner, { width: 8, height: 8 }]} />}
              </View>
              <View>
                <Text style={styles.bottomRadioLabel}>Part Pay</Text>
                <Text style={styles.bottomRadioValue}>{partPayAmount}</Text>
              </View>
            </Pressable>
            <Pressable onPress={() => setPaymentMode('full')} style={styles.bottomRadioOption}>
              <View style={[styles.radioOuter, paymentMode === 'full' && styles.radioOuterActive, { width: 16, height: 16 }]}>
                {paymentMode === 'full' && <View style={[styles.radioInner, { width: 8, height: 8 }]} />}
              </View>
              <View>
                <Text style={styles.bottomRadioLabel}>Full Pay</Text>
                <Text style={styles.bottomRadioValue}>{fullPayAmount}</Text>
              </View>
            </Pressable>
            <MaterialCommunityIcons name="information-outline" size={20} color="#94A3B8" />
          </View>
          <Pressable onPress={handleCheckout} style={styles.payBtn}>
            <Text style={styles.payBtnText}>PAY NOW</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 56,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  supportBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F3E8FF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  supportBannerText: {
    flex: 1,
  },
  supportBannerTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
  },
  supportBannerSub: {
    fontSize: 12,
    color: '#6B7280',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
    marginBottom: 24,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  checkboxActive: {
    backgroundColor: '#0084FF',
    borderColor: '#0084FF',
  },
  checkboxContent: {
    flex: 1,
  },
  checkboxTextRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  checkboxLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  checkboxPrice: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  checkboxSub: {
    fontSize: 12,
    color: '#64748B',
  },
  warningText: {
    fontSize: 10.5,
    color: '#D97706',
    marginTop: 4,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 16,
  },
  cancelTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 20,
  },
  timelineContainer: {
    position: 'relative',
    height: 70,
    marginBottom: 16,
  },
  timelineTrack: {
    position: 'absolute',
    top: 30,
    left: 20,
    right: 20,
    height: 4,
    backgroundColor: '#E2E8F0',
    borderRadius: 2,
  },
  timelineFill: {
    width: '50%',
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 2,
  },
  timelinePoints: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: '100%',
  },
  timelinePoint: {
    alignItems: 'flex-start',
    width: 100,
  },
  timelinePointCenter: {
    alignItems: 'center',
    width: 100,
  },
  timelinePointRight: {
    alignItems: 'flex-end',
    width: 100,
  },
  timelineTagFully: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
    backgroundColor: '#10B981',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginBottom: 6,
  },
  timelineTagNon: {
    fontSize: 10,
    fontWeight: '700',
    color: '#0F172A',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginBottom: 6,
  },
  timelineDotGreen: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    marginBottom: 4,
    marginLeft: 16,
  },
  timelineDotGrey: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#CBD5E1',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    marginBottom: 4,
  },
  timelineLabel: {
    fontSize: 10.5,
    color: '#64748B',
    fontWeight: '500',
  },
  timelineLabelCenter: {
    fontSize: 10.5,
    color: '#0F172A',
    fontWeight: '700',
  },
  timelineLabelRight: {
    fontSize: 10.5,
    color: '#64748B',
    fontWeight: '500',
  },
  readCancelBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  readCancelText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0084FF',
  },
  pickupInputWrapper: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
  },
  pickupInputLabel: {
    fontSize: 10.5,
    color: '#64748B',
    marginBottom: 4,
  },
  pickupInputText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  travellerHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  travellerHeader: {
    fontSize: 13,
    color: '#64748B',
  },
  saveBtn: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0084FF',
  },
  formRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: '#0084FF', // Focused state look from screenshot
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#F8FAFC',
  },
  floatingLabel: {
    fontSize: 10,
    color: '#64748B',
    marginBottom: 4,
  },
  input: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
    padding: 0,
  },
  genderLabel: {
    fontSize: 10.5,
    color: '#64748B',
    marginTop: 16,
    marginBottom: 8,
  },
  genderRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  radioOuter: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOuterActive: {
    borderColor: '#0084FF',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#0084FF',
  },
  radioText: {
    fontSize: 13,
    color: '#0F172A',
  },
  orDividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  orLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E2E8F0',
  },
  orText: {
    marginHorizontal: 16,
    fontSize: 12,
    color: '#64748B',
  },
  loginAccountBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 20,
  },
  loginAccountText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0084FF',
  },
  billingCheckbox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  billingText: {
    fontSize: 13,
    color: '#0F172A',
    fontWeight: '500',
  },
  reviewsScroll: {
    gap: 16,
    paddingRight: 16,
    marginBottom: 24,
  },
  reviewCard: {
    width: 280,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  reviewerName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  reviewDate: {
    fontSize: 10.5,
    color: '#64748B',
    marginTop: 2,
  },
  ratingBadge: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#0084FF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0084FF',
  },
  reviewText: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 20,
  },
  disclaimerText: {
    fontSize: 10.5,
    color: '#0084FF',
    lineHeight: 16,
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  bottomBar: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingTop: 12,
    paddingHorizontal: 16,
    paddingBottom: 32, // safe area
  },
  advanceNotice: {
    fontSize: 10.5,
    color: '#0084FF',
    textAlign: 'center',
    marginBottom: 12,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  paymentRadios: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  bottomRadioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  bottomRadioLabel: {
    fontSize: 10,
    color: '#64748B',
  },
  bottomRadioValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  payBtn: {
    backgroundColor: '#0084FF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  payBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
