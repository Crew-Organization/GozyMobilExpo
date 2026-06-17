import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, Pressable, Animated, Easing, ActivityIndicator } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { ScreenShell } from '@/src/components/screen-shell';
import { CabHeader } from './cab-header';
import CinematicSplash from './_cinematic-splash';
import { useApp } from '@/src/context/app-context';
const activeBlue = '#4F46E5';

export default function CabPaymentScreen() {
  const params = useLocalSearchParams<{
    type?: string;
    price?: string;
    pickup?: string;
    drop?: string;
    vehicle?: string;
    meta?: string;
  }>();

  const { addBooking } = useApp();

  // Dynamic parameters with fallback to screenshot defaults
  const totalAmount = params.price || '₹ 9,157';
  const pickupLocation = params.pickup || 'Pulivendula';
  const dropLocation = params.drop || 'Thane';
  const vehicleClass = params.meta ? params.meta.split('•')[0].trim() : 'SUV';
  const vehicleName = params.vehicle || 'SUV Cab';

  // State variables for payment processing
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStage, setProcessingStage] = useState(0);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Animations
  const processingFade = useRef(new Animated.Value(0)).current;
  const successScale = useRef(new Animated.Value(0)).current;
  const cardSlideY = useRef(new Animated.Value(350)).current;

  // Processing text stages
  const STAGES = [
    'Connecting to secure payment gateway...',
    'Authorizing transaction with bank rails...',
    'Matching local VIP chauffeur and gate details...',
    'Booking confirmed!',
  ];

  // Stage timer simulation
  useEffect(() => {
    if (!isProcessing) return;

    // Fade in overlay
    Animated.timing(processingFade, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    // Stage 1 -> 2
    const timer1 = setTimeout(() => {
      setProcessingStage(1);
    }, 1000);

    // Stage 2 -> 3
    const timer2 = setTimeout(() => {
      setProcessingStage(2);
    }, 2000);

    // Stage 3 -> Success
    const timer3 = setTimeout(() => {
      setProcessingStage(3);
      setPaymentSuccess(true);

      // Trigger Booking creation in central context
      addBooking({
        id: `cab-${Date.now()}`,
        experienceId: 'cab',
        title: `${vehicleName} Ride`,
        category: 'Travel',
        location: `${pickupLocation} to ${dropLocation}`,
        date: 'Thursday, 23 Apr 2026',
        guests: 1,
        total: parseFloat(totalAmount.replace(/[^0-9.]/g, '')) || 9157,
        status: 'confirmed',
      });

      // Animate success checkmark & result card
      Animated.parallel([
        Animated.spring(successScale, {
          toValue: 1,
          friction: 6,
          useNativeDriver: true,
        }),
        Animated.timing(cardSlideY, {
          toValue: 0,
          duration: 500,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();

    }, 3200);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [isProcessing, addBooking, processingFade, successScale, cardSlideY, totalAmount, pickupLocation, dropLocation, vehicleName]);

  const handlePay = () => {
    setIsProcessing(true);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#F3F4F6' }}>
      <ScreenShell scroll={true} style={styles.shell} contentContainerStyle={styles.scrollContent}>
        <CinematicSplash />
        
        {/* White header bar */}
        <View style={styles.headerWrapper}>
          <CabHeader title="Payment" onBack={() => router.back()} />
        </View>

        {/* ── Total Due Row ── */}
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total Due</Text>
          <View style={styles.totalAmountRow}>
            <Text style={styles.totalAmount}>{totalAmount}</Text>
            <View style={styles.downCircle}>
              <MaterialCommunityIcons name="chevron-down" size={20} color={activeBlue} />
            </View>
          </View>
        </View>

        {/* ── Route Summary Card ── */}
        <View style={styles.tripSummary}>
          <View style={styles.carIconContainer}>
            <View style={styles.carIconCircle}>
              <MaterialCommunityIcons name="car-estate" size={32} color="#174A68" />
            </View>
          </View>
          <View style={styles.tripCopy}>
            <Text style={styles.tripRoute}>
              {pickupLocation} <Text style={styles.arrowText}>→</Text> {dropLocation}
            </Text>
            <Text style={styles.tripClass}>{vehicleClass}</Text>
            <Text style={styles.tripMeta}>Pickup on: Thu, 23 Apr&apos;26, 10:00 AM</Text>
            <Text style={styles.tripMeta}>Drop on: Fri, 24 Apr&apos;26, 4:41 AM</Text>
          </View>
        </View>

        {/* ── Passenger Name strip ── */}
        <View style={styles.passengerStrip}>
          <Text style={styles.passengerLabel}>Nikshitha Nikshitha</Text>
        </View>

        {/* ── Discount Login Banner ── */}
        <View style={styles.loginCard}>
          <View style={styles.loginCopy}>
            <Text style={styles.loginTitle}>Additional discounts and saved payment options</Text>
            <Text style={styles.loginSub}>Login to access saved payments and discounts!</Text>
          </View>
          <Pressable style={styles.loginBtn}>
            <Text style={styles.loginAction}>LOGIN</Text>
          </Pressable>
        </View>

        {/* ── Gift Cards Row ── */}
        <View style={styles.giftRow}>
          <View style={styles.giftLeft}>
            <View style={styles.giftIconBox}>
              <MaterialCommunityIcons name="wallet-giftcard" size={22} color="#FFFFFF" />
            </View>
            <Text style={styles.giftText}>Gift Cards</Text>
          </View>
          <MaterialCommunityIcons name="chevron-down" size={24} color={activeBlue} />
        </View>

        {/* ── Payment Options Header ── */}
        <Text style={styles.sectionTitle}>Payment Options</Text>

        {/* ── Payment Rows list ── */}
        <View style={styles.optionsCard}>
          {/* Row 1: UPI */}
          <Pressable onPress={handlePay} style={styles.paymentRow}>
            <View style={[styles.optionIconCircle, { backgroundColor: '#F0FDF4' }]}>
              <MaterialCommunityIcons name="lightning-bolt" size={24} color="#15803D" />
            </View>
            <View style={styles.optionCopy}>
              <View style={styles.optionTitleRow}>
                <Text style={styles.optionTitle}>UPI Options</Text>
                {/* Mini logos representing GPay / PhonePe / Paytm */}
                <View style={styles.logoBadgesRow}>
                  <View style={[styles.logoBadge, { backgroundColor: '#EEF2FF' }]}><Text style={[styles.logoBadgeText, { color: '#4F46E5' }]}>G</Text></View>
                  <View style={[styles.logoBadge, { backgroundColor: '#F3E8FF' }]}><Text style={[styles.logoBadgeText, { color: '#7C3AED' }]}>P</Text></View>
                  <View style={[styles.logoBadge, { backgroundColor: '#E0F2FE' }]}><Text style={[styles.logoBadgeText, { color: '#0369A1' }]}>pay</Text></View>
                </View>
              </View>
              <Text style={styles.optionSub}>Pay Directly From Your Bank Account</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={24} color="#64748B" />
          </Pressable>

          {/* Row 2: Cards */}
          <Pressable onPress={handlePay} style={styles.paymentRow}>
            <View style={[styles.optionIconCircle, { backgroundColor: '#EFF6FF' }]}>
              <MaterialCommunityIcons name="credit-card-outline" size={24} color="#1D4ED8" />
            </View>
            <View style={styles.optionCopy}>
              <Text style={styles.optionTitle}>Credit & Debit Cards</Text>
              <Text style={styles.optionSub}>Visa, Mastercard, Amex, Rupay and more</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={24} color="#64748B" />
          </Pressable>

          {/* Row 3: Net Banking */}
          <Pressable onPress={handlePay} style={styles.paymentRow}>
            <View style={[styles.optionIconCircle, { backgroundColor: '#ECFDF5' }]}>
              <MaterialCommunityIcons name="bank-outline" size={24} color="#047857" />
            </View>
            <View style={styles.optionCopy}>
              <View style={styles.optionTitleRow}>
                <Text style={styles.optionTitle}>Net Banking</Text>
                <View style={styles.badgeGreen}>
                  <Text style={styles.badgeGreenText}>FINGERPRINT/FACE ID</Text>
                </View>
              </View>
              <Text style={styles.optionSub}>40+ Banks Available</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={24} color="#64748B" />
          </Pressable>

          {/* Row 4: EMI */}
          <Pressable onPress={handlePay} style={styles.paymentRow}>
            <View style={[styles.optionIconCircle, { backgroundColor: '#FFFBEB' }]}>
              <MaterialCommunityIcons name="cash-clock" size={24} color="#D97706" />
            </View>
            <View style={styles.optionCopy}>
              <View style={styles.optionTitleRow}>
                <Text style={styles.optionTitle}>EMI</Text>
                <View style={styles.badgeCyan}>
                  <Text style={styles.badgeCyanText}>NO COST EMI</Text>
                </View>
              </View>
              <Text style={styles.optionSub}>Credit/Debit Card & Cardless EMI available</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={24} color="#64748B" />
          </Pressable>

          {/* Row 5: Gift Cards & wallets */}
          <Pressable onPress={handlePay} style={styles.paymentRow}>
            <View style={[styles.optionIconCircle, { backgroundColor: '#FFF1F2' }]}>
              <MaterialCommunityIcons name="wallet-giftcard" size={24} color="#E11D48" />
            </View>
            <View style={styles.optionCopy}>
              <Text style={styles.optionTitle}>Gift Cards & e-wallets</Text>
              <Text style={styles.optionSub}>MMT Gift cards & Amazon Pay</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={24} color="#64748B" />
          </Pressable>

          {/* Row 6: Google Pay */}
          <Pressable onPress={handlePay} style={styles.paymentRow}>
            <View style={[styles.optionIconCircle, { backgroundColor: '#EEF2FF' }]}>
              <MaterialCommunityIcons name="google" size={24} color="#3B82F6" />
            </View>
            <View style={styles.optionCopy}>
              <Text style={styles.optionTitle}>GooglePay</Text>
              <Text style={styles.optionSub}>Pay with GooglePay</Text>
            </View>
            <MaterialCommunityIcons name="chevron-down" size={24} color="#64748B" />
          </Pressable>

          {/* Row 7: PhonePe */}
          <Pressable onPress={handlePay} style={[styles.paymentRow, { borderBottomWidth: 0 }]}>
            <View style={[styles.optionIconCircle, { backgroundColor: '#F5E6FF' }]}>
              <MaterialCommunityIcons name="cellphone-text" size={24} color="#A855F7" />
            </View>
            <View style={styles.optionCopy}>
              <Text style={styles.optionTitle}>PhonePe</Text>
              <Text style={styles.optionSub}>Pay with PhonePe</Text>
            </View>
            <MaterialCommunityIcons name="chevron-down" size={24} color="#64748B" />
          </Pressable>
        </View>
      </ScreenShell>

      {/* ── Cinematic Done Overlay ── */}
      {isProcessing && (
        <Animated.View style={[styles.overlay, { opacity: processingFade }]} pointerEvents="auto">
          {/* Backdrop Blur effect */}
          <LinearGradient
            colors={['rgba(3, 7, 18, 0.92)', 'rgba(15, 23, 42, 0.95)', 'rgba(3, 7, 18, 0.92)']}
            style={StyleSheet.absoluteFillObject}
          />

          {!paymentSuccess ? (
            /* Stage 1-3: Spinning matches and processing text */
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="large" color="#FFFFFF" style={styles.spinner} />
              <Text style={styles.processingText}>{STAGES[processingStage]}</Text>
            </View>
          ) : (
            /* Stage 4: Cinematic Done checkmark & Voucher Receipt slide up */
            <View style={styles.successContainer}>
              {/* Expanding Green success circle */}
              <Animated.View style={[styles.successCirc, { transform: [{ scale: successScale }] }]}>
                <LinearGradient
                  colors={['#10B981', '#059669']}
                  style={StyleSheet.absoluteFillObject}
                />
                <MaterialCommunityIcons name="check" size={48} color="#FFFFFF" />
              </Animated.View>

              <Text style={styles.successHeading}>Payment Successful!</Text>
              <Text style={styles.successSub}>Your premium ride has been reserved.</Text>

              {/* Slide-up ticket receipt */}
              <Animated.View style={[styles.ticketVoucher, { transform: [{ translateY: cardSlideY }] }]}>
                <View style={styles.notchLeft} />
                <View style={styles.notchRight} />

                {/* Ticket Header */}
                <View style={styles.ticketHeader}>
                  <MaterialCommunityIcons name="shield-check" size={20} color="#10B981" />
                  <Text style={styles.ticketHeaderTitle}>GOZY SECURE CHECKOUT</Text>
                </View>

                {/* Route Summary */}
                <View style={styles.ticketRouteRow}>
                  <View style={styles.ticketHub}>
                    <Text style={styles.ticketHubCode}>PUL</Text>
                    <Text style={styles.ticketHubLabel}>{pickupLocation.slice(0, 15)}</Text>
                  </View>
                  
                  <View style={styles.ticketPath}>
                    <View style={styles.ticketLine} />
                    <MaterialCommunityIcons name="car" size={16} color="#4F46E5" />
                  </View>

                  <View style={[styles.ticketHub, { alignItems: 'flex-end' }]}>
                    <Text style={styles.ticketHubCode}>THA</Text>
                    <Text style={styles.ticketHubLabel}>{dropLocation.slice(0, 15)}</Text>
                  </View>
                </View>

                {/* Ticket divider */}
                <View style={styles.ticketDividerWrapper}>
                  <View style={styles.ticketDividerLine} />
                </View>

                {/* Details list */}
                <View style={styles.ticketDetails}>
                  <View style={styles.ticketDetailRow}>
                    <View style={styles.ticketDetailItem}>
                      <Text style={styles.ticketDetailLabel}>DRIVER</Text>
                      <Text style={styles.ticketDetailValue}>Ramesh Kumar</Text>
                    </View>
                    <View style={styles.ticketDetailItem}>
                      <Text style={styles.ticketDetailLabel}>VEHICLE NO</Text>
                      <Text style={styles.ticketDetailValue}>TS-09-EA-4829</Text>
                    </View>
                  </View>
                  <View style={styles.ticketDetailRow}>
                    <View style={styles.ticketDetailItem}>
                      <Text style={styles.ticketDetailLabel}>TOTAL FARE</Text>
                      <Text style={[styles.ticketDetailValue, { color: '#0F172A', fontWeight: '900' }]}>{totalAmount}</Text>
                    </View>
                    <View style={styles.ticketDetailItem}>
                      <Text style={styles.ticketDetailLabel}>BOOKING ID</Text>
                      <Text style={styles.ticketDetailValue}>GZ-CAB-992A</Text>
                    </View>
                  </View>
                </View>

                {/* Call to action buttons inside the ticket */}
                <View style={styles.actionButtons}>
                  <Pressable
                    onPress={() => router.replace('/(cab-module)/cab-active')}
                    style={styles.btnTrack}
                  >
                    <LinearGradient
                      colors={['#4F46E5', '#6366F1']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={StyleSheet.absoluteFillObject}
                    />
                    <MaterialCommunityIcons name="navigation" size={18} color="#FFFFFF" />
                    <Text style={styles.btnTrackText}>Track Ride Live</Text>
                  </Pressable>

                  <Pressable
                    onPress={() => router.replace('/bookings')}
                    style={styles.btnHistory}
                  >
                    <MaterialCommunityIcons name="history" size={18} color="#4F46E5" />
                    <Text style={styles.btnHistoryText}>View Booking History</Text>
                  </Pressable>
                </View>
              </Animated.View>
            </View>
          )}
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    paddingHorizontal: 0,
    backgroundColor: '#F3F4F6',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  headerWrapper: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  
  // Total Due Section
  totalRow: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    color: '#0F172A',
    fontSize: 18,
    fontWeight: '800',
  },
  totalAmountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  totalAmount: {
    color: '#0F172A',
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  downCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Route summary card
  tripSummary: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 20,
    flexDirection: 'row',
    gap: 16,
    borderBottomWidth: 1,
    borderColor: '#F3F4F6',
  },
  carIconContainer: {
    width: 56,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  carIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 14,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  tripCopy: {
    flex: 1,
  },
  tripRoute: {
    color: '#0F172A',
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 6,
  },
  arrowText: {
    color: '#94A3B8',
    fontWeight: '400',
  },
  tripClass: {
    fontSize: 12,
    fontWeight: '800',
    color: '#4F46E5',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  tripMeta: {
    color: '#64748B',
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '500',
  },

  // Passenger Strip
  passengerStrip: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  passengerLabel: {
    color: '#475569',
    fontSize: 13,
    fontWeight: '700',
  },

  // Login Card Promo
  loginCard: {
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  loginCopy: {
    flex: 1,
  },
  loginTitle: {
    color: '#0F172A',
    fontSize: 13,
    fontWeight: '800',
    lineHeight: 18,
    marginBottom: 4,
  },
  loginSub: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '500',
  },
  loginBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  loginAction: {
    color: '#0084FF',
    fontSize: 13,
    fontWeight: '800',
  },

  // Gift card Row
  giftRow: {
    marginHorizontal: 16,
    marginTop: 16,
    height: 64,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  giftLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  giftIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#F59E0B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  giftText: {
    color: '#0F172A',
    fontSize: 14,
    fontWeight: '800',
  },

  // Section Title
  sectionTitle: {
    color: '#0F172A',
    fontSize: 16,
    fontWeight: '900',
    marginHorizontal: 16,
    marginTop: 24,
    marginBottom: 12,
  },

  // Options list card container
  optionsCard: {
    marginHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  paymentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderColor: '#F1F5F9',
    gap: 16,
  },
  optionIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionCopy: {
    flex: 1,
  },
  optionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flexWrap: 'wrap',
  },
  optionTitle: {
    color: '#0F172A',
    fontSize: 14,
    fontWeight: '800',
  },
  optionSub: {
    color: '#64748B',
    fontSize: 11,
    fontWeight: '500',
    marginTop: 2,
  },
  logoBadgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  logoBadge: {
    paddingHorizontal: 5,
    paddingVertical: 1.5,
    borderRadius: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoBadgeText: {
    fontSize: 8,
    fontWeight: '900',
  },
  badgeGreen: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  badgeGreenText: {
    color: '#047857',
    fontSize: 8,
    fontWeight: '800',
  },
  badgeCyan: {
    backgroundColor: '#ECFEFF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#AEDFEE',
  },
  badgeCyanText: {
    color: '#06B6D4',
    fontSize: 8,
    fontWeight: '800',
  },

  // ── Cinematic Processing Overlay styles ──
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 99999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loaderContainer: {
    alignItems: 'center',
    gap: 20,
    zIndex: 10,
  },
  spinner: {
    transform: [{ scale: 1.5 }],
  },
  processingText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
    textAlign: 'center',
    paddingHorizontal: 24,
  },

  // Success done layout styles
  successContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingHorizontal: 24,
    zIndex: 10,
  },
  successCirc: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 8,
    overflow: 'hidden',
    marginBottom: 16,
  },
  successHeading: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  successSub: {
    fontSize: 13,
    fontWeight: '600',
    color: '#CBD5E1',
    marginBottom: 24,
  },

  // Invoice Ticket voucher styles
  ticketVoucher: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    width: '100%',
    padding: 24,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  notchLeft: {
    position: 'absolute',
    left: -12,
    top: 96,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(15, 23, 42, 0.95)',
    zIndex: 10,
  },
  notchRight: {
    position: 'absolute',
    right: -12,
    top: 96,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(15, 23, 42, 0.95)',
    zIndex: 10,
  },
  ticketHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  ticketHeaderTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 1,
  },
  ticketRouteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  ticketHub: {
    flex: 1,
  },
  ticketHubCode: {
    fontSize: 26,
    fontWeight: '900',
    color: '#0F172A',
  },
  ticketHubLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#94A3B8',
    marginTop: 2,
  },
  ticketPath: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: 80,
    position: 'relative',
  },
  ticketLine: {
    height: 1,
    width: '100%',
    backgroundColor: '#E2E8F0',
    position: 'absolute',
  },
  ticketDividerWrapper: {
    height: 1,
    overflow: 'hidden',
    marginBottom: 16,
  },
  ticketDividerLine: {
    height: 1,
    width: '100%',
    backgroundColor: '#CBD5E1',
    borderStyle: 'dashed',
    borderRadius: 1,
  },
  ticketDetails: {
    gap: 16,
    marginBottom: 24,
  },
  ticketDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  ticketDetailItem: {
    flex: 1,
  },
  ticketDetailLabel: {
    fontSize: 8,
    fontWeight: '700',
    color: '#94A3B8',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  ticketDetailValue: {
    fontSize: 13,
    fontWeight: '800',
    color: '#334155',
  },

  // CTA button Row
  actionButtons: {
    gap: 10,
  },
  btnTrack: {
    height: 48,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  btnTrackText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  btnHistory: {
    height: 48,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },
  btnHistoryText: {
    color: '#4F46E5',
    fontSize: 14,
    fontWeight: '800',
  },
});
