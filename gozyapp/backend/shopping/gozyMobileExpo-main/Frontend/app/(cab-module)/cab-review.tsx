import React, { useState, useRef } from 'react';
import {
  Animated,
  Easing,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TextInput,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import CinematicSplash from './_cinematic-splash';

// Style Constants mapped from Tailwind colors
const colors = {
  primary: '#4F46E5', // Indigo-600
  primaryLight: '#EEF2FF', // Indigo-50
  primaryBorder: '#E0E7FF', // Indigo-100
  background: '#F3F4F6', // Gray-100
  surface: '#FFFFFF',
  textMain: '#1E293B', // Slate-800
  textMuted: '#64748B', // Slate-500
  textLight: '#94A3B8', // Slate-400
  border: '#F3F4F6', // Gray-100/200
  success: '#10B981', // Emerald-500
  successLight: '#ECFDF5', // Emerald-50
  successText: '#047857', // Emerald-700
  warning: '#F59E0B', // Amber-500
  warningLight: '#FFFBEB', // Amber-50
  warningText: '#B45309', // Amber-700
  info: '#3B82F6', // Blue-500
  infoLight: '#EFF6FF', // Blue-50
  infoText: '#1D4ED8', // Blue-700
};

export default function CabReviewScreen() {
  const params = useLocalSearchParams<{ type?: string }>();
  const [isFareExpanded, setIsFareExpanded] = useState(true);
  const [flightNumber, setFlightNumber] = useState('');

  const isOutstation = params.type === 'outstation';
  const isAirport = params.type === 'airport';
  const isRailway = params.type === 'railway';
  const isHourly = params.type === 'hourly';

  // Dynamic Vehicle / Pricing Info
  let vehicleName = 'Maruti Suzuki Swift';
  let vehicleMeta = '4 Seats • AC • Petrol';
  let vehicleIcon: any = 'car-hatchback';
  let baseFareText = 'Base Fare';
  let baseFareVal = '₹735';
  let taxText = 'Taxes & Charges';
  let taxVal = '₹428';
  let discountLabel = 'Coupon Discount (CABPERK)';
  let discountVal = '-₹50';
  let totalVal = '₹1,113';
  let savedVal = 'Saved ₹50';

  if (isOutstation) {
    vehicleName = 'Xylo, Ertiga';
    vehicleMeta = '6 Seats • AC • Diesel';
    vehicleIcon = 'car-estate';
    baseFareText = 'Base Fare (872 Kms)';
    baseFareVal = '₹31,408';
    taxText = 'Taxes & GST';
    taxVal = '₹1,480';
    discountLabel = 'Coupon Discount (OUTSTATION30)';
    discountVal = '-₹3,332';
    totalVal = '₹29,556';
    savedVal = 'Saved ₹3,332';
  } else if (isRailway) {
    vehicleName = 'Tata Tigor';
    vehicleMeta = '4 Seats • AC • Electric';
    vehicleIcon = 'car';
    baseFareText = 'Base Fare';
    baseFareVal = '₹702';
    taxText = 'Taxes & Charges';
    taxVal = '₹479';
    discountLabel = 'Coupon Discount (CABPERK)';
    discountVal = '-₹50';
    totalVal = '₹1,131';
    savedVal = 'Saved ₹50';
  } else if (isHourly) {
    vehicleName = 'MG ZS';
    vehicleMeta = '4 Seats • AC • Electric';
    vehicleIcon = 'car-hatchback';
    baseFareText = 'Rental Fare (4 Hrs)';
    baseFareVal = '₹1,500';
    taxText = 'Taxes & Surcharges';
    taxVal = '₹200';
    discountLabel = 'Coupon Discount (CABPERK)';
    discountVal = '-₹50';
    totalVal = '₹1,650';
    savedVal = 'Saved ₹50';
  }

  let pickupLabel = 'PICK-UP';
  let pickupPlace = 'Rajiv Gandhi Intl Airport';
  let dropLabel = 'DROP-OFF';
  let dropPlace = 'B.N Reddy Nagar, Hyderabad';
  let routeMetaText = '34 KM • 1 Hour';

  if (isOutstation) {
    pickupLabel = 'PICK-UP LOCATION';
    pickupPlace = 'Gugudu, Andhra Pradesh';
    dropLabel = 'DROP-OFF LOCATION';
    dropPlace = 'Kalyan, Maharashtra';
    routeMetaText = '872 KM • 18 Hours';
  } else if (isRailway) {
    pickupLabel = 'PICK-UP LOCATION';
    pickupPlace = 'Secunderabad Junction Railway Station';
    dropLabel = 'DROP-OFF LOCATION';
    dropPlace = 'Your Live Location (Secunderabad)';
    routeMetaText = '8 KM • 25 Mins';
  } else if (isHourly) {
    pickupLabel = 'PICK-UP LOCATION';
    pickupPlace = 'Your Live Location (Secunderabad)';
    dropLabel = 'RENTAL PACKAGE';
    dropPlace = '4 Hrs / 40 Kms Rental Package';
    routeMetaText = 'Unlimited Stops • 40 Kms included';
  }

  let inclusionChips = ['Airport Charges', 'Driver Allowance', 'State Tax', 'Free Cancellation'];
  if (isOutstation) {
    inclusionChips = ['Driver Allowance', 'State Taxes & Tolls', 'Fuel Charges', 'Free Cancellation'];
  } else if (isHourly) {
    inclusionChips = ['Fuel Charges', 'Driver Allowance', 'Tolls & Taxes', 'Free Cancellation'];
  } else if (isRailway) {
    inclusionChips = ['Station Entry Charges', 'Driver Allowance', 'State Tax', 'Free Cancellation'];
  }

  // Animations
  const fareHeightAnim = useRef(new Animated.Value(200)).current;
  const fareOpacityAnim = useRef(new Animated.Value(1)).current;
  const fareChevronRotate = useRef(new Animated.Value(1)).current;

  const toggleFare = () => {
    const toValue = isFareExpanded ? 0 : 1;
    
    Animated.parallel([
      Animated.timing(fareHeightAnim, {
        toValue: isFareExpanded ? 0 : 200,
        duration: 300,
        easing: Easing.inOut(Easing.cubic),
        useNativeDriver: false,
      }),
      Animated.timing(fareOpacityAnim, {
        toValue,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(fareChevronRotate, {
        toValue,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
    
    setIsFareExpanded(!isFareExpanded);
  };

  const chevronRotateInterpolation = fareChevronRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const handleCheckout = () => {
    router.push({
      pathname: '/(cab-module)/cab-payment',
      params: {
        type: params.type,
        price: totalVal,
        pickup: pickupPlace,
        drop: dropPlace,
        vehicle: vehicleName,
        meta: vehicleMeta,
      }
    });
  };

  return (
    <View style={styles.container}>
      <CinematicSplash />

      {/* App Bar */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <MaterialCommunityIcons name="arrow-left" size={20} color={colors.textMain} />
        </Pressable>
        <Text style={styles.headerTitle}>Review Your Ride</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Premium Route Card: Boarding Pass for Airport Transfer, otherwise standard Vertical Timeline */}
        {isAirport ? (
          <View style={styles.boardingPassCard}>
            {/* Left and Right Ticket Notches */}
            <View style={styles.leftNotch} />
            <View style={styles.rightNotch} />

            {/* Boarding Pass Header Info */}
            <View style={styles.boardingHeader}>
              <View style={styles.boardingBrandRow}>
                <MaterialCommunityIcons name="airplane" size={14} color={colors.primary} />
                <Text style={styles.boardingHeaderText}>BOARDING PASS • GOZY CABS</Text>
              </View>
              <View style={styles.classBadge}>
                <Text style={styles.classBadgeText}>FLIGHT TRACKED</Text>
              </View>
            </View>

            {/* Airport Codes & Dotted Flight Path */}
            <View style={styles.hubsRow}>
              <View style={styles.hubBlock}>
                <Text style={styles.hubCode}>HYD</Text>
                <Text style={styles.hubName} numberOfLines={1}>RGI Airport</Text>
              </View>
              
              <View style={styles.flightTracerBlock}>
                <View style={styles.flightTracerLine} />
                <MaterialCommunityIcons name="airplane" size={16} color={colors.primary} style={styles.tracerPlane} />
              </View>

              <View style={[styles.hubBlock, { alignItems: 'flex-end' }]}>
                <Text style={styles.hubCode}>CITY</Text>
                <Text style={styles.hubName} numberOfLines={1}>BN Reddy Nagar</Text>
              </View>
            </View>

            {/* Dashed Separator Line */}
            <View style={styles.dashedDividerWrapper}>
              <View style={styles.ticketDashedLine} />
            </View>

            {/* Boarding metadata */}
            <View style={styles.boardingDetails}>
              <View style={styles.detailRow}>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>PICKUP ZONE</Text>
                  <Text style={styles.detailValue}>T1 Arrivals</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>FLIGHT STATUS</Text>
                  <Text style={[styles.detailValue, { color: colors.success, fontWeight: '800' }]}>🛡️ On-Time</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>DEP TIME</Text>
                  <Text style={styles.detailValue}>10:00 AM</Text>
                </View>
              </View>

              {/* Simulated Barcode */}
              <View style={styles.barcodeContainer}>
                <View style={styles.barcodeLabelRow}>
                  <Text style={styles.barcodeText}>PASSENGER TRIP TICKET: GOZY-AIRPORT-990</Text>
                </View>
                <View style={styles.barcodeLines}>
                  {[1, 3, 2, 4, 1, 2, 3, 1, 4, 2, 1, 3, 2, 1, 4, 2, 3, 1, 2, 4, 1, 3, 1, 2, 4, 1, 3].map((barWidth, idx) => (
                    <View
                      key={`bar-${idx}`}
                      style={{
                        height: 24,
                        width: barWidth,
                        backgroundColor: '#475569',
                        marginHorizontal: 1,
                      }}
                    />
                  ))}
                </View>
              </View>
            </View>
          </View>
        ) : (
          <View style={styles.card}>
            <View style={styles.timelineContainer}>
              {/* Connecting Line */}
              <View style={styles.timelineLine} />
              
              {/* Pick-up */}
              <View style={styles.timelineRow}>
                <View style={styles.timelineDotStart} />
                <View style={styles.timelineInfo}>
                  <Text style={styles.timelinePlace} numberOfLines={1}>{pickupPlace}</Text>
                  <Text style={styles.timelineLabel}>{pickupLabel}</Text>
                </View>
              </View>
              
              {/* Drop-off */}
              <View style={styles.timelineRowDrop}>
                <View style={styles.timelineDotEnd}>
                  <View style={styles.timelineDotInner} />
                </View>
                <View style={styles.timelineInfo}>
                  <Text style={styles.timelinePlace} numberOfLines={1}>{dropPlace}</Text>
                  <Text style={styles.timelineLabel}>{dropLabel}</Text>
                </View>
              </View>
            </View>

            {/* Meta Info */}
            <View style={styles.routeMeta}>
              <View style={styles.metaBadge}>
                <MaterialCommunityIcons name="calendar-clock" size={16} color={colors.primary} />
                <Text style={styles.metaText}>23 Apr • 10:00 AM</Text>
              </View>
              <View style={styles.metaBadge}>
                <MaterialCommunityIcons name="map-marker-path" size={16} color={colors.primary} />
                <Text style={styles.metaText}>{routeMetaText}</Text>
              </View>
            </View>
          </View>
        )}

        {/* Selected Vehicle Card */}
        <View style={styles.card}>
          <View style={styles.vehicleRow}>
            <View style={styles.vehicleInfo}>
              <Text style={styles.vehicleName}>{vehicleName}</Text>
              <Text style={styles.vehicleMeta}>{vehicleMeta}</Text>
            </View>
            <View style={styles.vehicleImgBox}>
              <MaterialCommunityIcons name={vehicleIcon} size={32} color={colors.textMuted} />
            </View>
          </View>
          
          {/* Trust Badges */}
          <View style={styles.trustBadgesRow}>
            <View style={[styles.trustBadge, { backgroundColor: colors.warningLight, borderColor: 'rgba(245, 158, 11, 0.3)' }]}>
              <MaterialCommunityIcons name="star" size={12} color={colors.warning} />
              <Text style={[styles.trustBadgeText, { color: colors.warningText }]}>{isOutstation ? '4.9' : '4.2'}</Text>
            </View>
            <View style={[styles.trustBadge, { backgroundColor: colors.infoLight, borderColor: 'rgba(59, 130, 246, 0.3)' }]}>
              <MaterialCommunityIcons name="shield-check" size={12} color={colors.info} />
              <Text style={[styles.trustBadgeText, { color: colors.infoText }]}>Verified Driver</Text>
            </View>
            <View style={[styles.trustBadge, { backgroundColor: colors.successLight, borderColor: 'rgba(16, 185, 129, 0.3)' }]}>
              <MaterialCommunityIcons name="lightning-bolt" size={12} color={colors.success} />
              <Text style={[styles.trustBadgeText, { color: colors.successText }]}>Instant Confirmation</Text>
            </View>
          </View>
        </View>

        {/* Transparent Fare Breakdown (Collapsible) */}
        <View style={[styles.card, { padding: 0, overflow: 'hidden' }]}>
          <Pressable onPress={toggleFare} style={styles.fareToggle}>
            <View style={styles.fareToggleLeft}>
              <MaterialCommunityIcons name="receipt" size={20} color={colors.textLight} />
              <Text style={styles.fareToggleTitle}>Fare Breakdown</Text>
            </View>
            <View style={styles.fareToggleRight}>
              <Text style={styles.fareToggleTotal}>{totalVal}</Text>
              <Animated.View style={{ transform: [{ rotate: chevronRotateInterpolation }] }}>
                <MaterialCommunityIcons name="chevron-down" size={20} color={colors.textLight} />
              </Animated.View>
            </View>
          </Pressable>

          <Animated.View style={{ height: fareHeightAnim, opacity: fareOpacityAnim }}>
            <View style={styles.fareDetails}>
              <View style={styles.fareRow}>
                <Text style={styles.fareLabel}>{baseFareText}</Text>
                <Text style={styles.fareValue}>{baseFareVal}</Text>
              </View>
              <View style={styles.fareRow}>
                <Text style={styles.fareLabel}>{taxText}</Text>
                <Text style={styles.fareValue}>{taxVal}</Text>
              </View>
              <View style={styles.fareDiscountRow}>
                <Text style={styles.fareDiscountLabel}>{discountLabel}</Text>
                <Text style={styles.fareDiscountValue}>{discountVal}</Text>
              </View>
              
              <View style={styles.fareDivider} />
              <View style={styles.fareFinalRow}>
                <Text style={styles.fareFinalLabel}>Total Payable</Text>
                <Text style={styles.fareFinalValue}>{totalVal}</Text>
              </View>
            </View>
          </Animated.View>
        </View>

        {/* Inclusions Chips */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>{"What's Included"}</Text>
          <View style={styles.chipsContainer}>
            {inclusionChips.map((chip, idx) => (
              <View key={idx} style={styles.inclusionChip}>
                <MaterialCommunityIcons name="check-circle" size={14} color={colors.success} />
                <Text style={styles.inclusionChipText}>{chip}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Smart Recommendation & Flight/Train/Hourly Tracking Section */}
        {params.type === 'airport' && (
          <View style={styles.flightTrackingContainer}>
            {/* GOZY AI Banner */}
            <View style={styles.aiBanner}>
              <View style={styles.aiIconBox}>
                <MaterialCommunityIcons name="robot" size={16} color={colors.primary} />
              </View>
              <Text style={styles.aiText}>
                <Text style={styles.aiTextBold}>GOZY AI: </Text>
                Flight tracking is recommended because your trip starts from an airport.
              </Text>
            </View>
            
            {/* Feature Card */}
            <View style={styles.flightCard}>
              <View style={styles.recommendedRibbon}>
                <Text style={styles.ribbonText}>RECOMMENDED</Text>
              </View>
              
              <View style={styles.flightHeader}>
                <View style={styles.flightIconBox}>
                  <MaterialCommunityIcons name="airplane-takeoff" size={24} color={colors.primary} />
                </View>
                <View>
                  <Text style={styles.flightTitle}>Flight Tracked Cab</Text>
                  <Text style={styles.flightSubtitle}>Auto-adjusts to your landing</Text>
                </View>
              </View>
              
              <View style={styles.flightBenefits}>
                {['No waiting calls from driver', 'Auto pickup adjustment for delays', 'Real-time status sync'].map((benefit, idx) => (
                  <View key={idx} style={styles.benefitRow}>
                    <MaterialCommunityIcons name="check" size={16} color={colors.success} style={{ fontWeight: '900' }} />
                    <Text style={styles.benefitText}>{benefit}</Text>
                  </View>
                ))}
              </View>
              
              <View style={styles.flightInputBox}>
                <MaterialCommunityIcons name="ticket-confirmation-outline" size={18} color={colors.textLight} style={styles.flightInputIcon} />
                <TextInput
                  style={styles.flightInput}
                  placeholder="Enter Flight Number (Optional)"
                  placeholderTextColor={colors.textLight}
                  value={flightNumber}
                  onChangeText={setFlightNumber}
                  autoCapitalize="characters"
                />
              </View>
            </View>
          </View>
        )}

        {params.type === 'railway' && (
          <View style={styles.flightTrackingContainer}>
            {/* GOZY AI Banner */}
            <View style={styles.aiBanner}>
              <View style={styles.aiIconBox}>
                <MaterialCommunityIcons name="robot" size={16} color={colors.primary} />
              </View>
              <Text style={styles.aiText}>
                <Text style={styles.aiTextBold}>GOZY AI: </Text>
                Train tracking is recommended because your trip starts from a railway station.
              </Text>
            </View>
            
            {/* Feature Card */}
            <View style={styles.flightCard}>
              <View style={styles.recommendedRibbon}>
                <Text style={styles.ribbonText}>RECOMMENDED</Text>
              </View>
              
              <View style={styles.flightHeader}>
                <View style={styles.flightIconBox}>
                  <MaterialCommunityIcons name="train" size={24} color={colors.primary} />
                </View>
                <View>
                  <Text style={styles.flightTitle}>Train Tracked Cab</Text>
                  <Text style={styles.flightSubtitle}>Auto-adjusts to train delays</Text>
                </View>
              </View>
              
              <View style={styles.flightBenefits}>
                {['Driver waits if train is delayed', 'Platform-side pickup coordination', 'No extra waiting charges'].map((benefit, idx) => (
                  <View key={idx} style={styles.benefitRow}>
                    <MaterialCommunityIcons name="check" size={16} color={colors.success} style={{ fontWeight: '900' }} />
                    <Text style={styles.benefitText}>{benefit}</Text>
                  </View>
                ))}
              </View>
              
              <View style={styles.flightInputBox}>
                <MaterialCommunityIcons name="ticket-confirmation-outline" size={18} color={colors.textLight} style={styles.flightInputIcon} />
                <TextInput
                  style={styles.flightInput}
                  placeholder="Enter Train Number/Code (Optional)"
                  placeholderTextColor={colors.textLight}
                  value={flightNumber}
                  onChangeText={setFlightNumber}
                  autoCapitalize="characters"
                />
              </View>
            </View>
          </View>
        )}

        {params.type === 'outstation' && (
          <View style={styles.flightTrackingContainer}>
            {/* GOZY AI Banner */}
            <View style={styles.aiBanner}>
              <View style={styles.aiIconBox}>
                <MaterialCommunityIcons name="robot" size={16} color={colors.primary} />
              </View>
              <Text style={styles.aiText}>
                <Text style={styles.aiTextBold}>GOZY AI: </Text>
                Safe-trip tracking is recommended for intercity outstation routes.
              </Text>
            </View>
            
            {/* Feature Card */}
            <View style={styles.flightCard}>
              <View style={styles.recommendedRibbon}>
                <Text style={styles.ribbonText}>RECOMMENDED</Text>
              </View>
              
              <View style={styles.flightHeader}>
                <View style={styles.flightIconBox}>
                  <MaterialCommunityIcons name="shield-lock-outline" size={24} color={colors.primary} />
                </View>
                <View>
                  <Text style={styles.flightTitle}>Safe-Trip Optimized Cab</Text>
                  <Text style={styles.flightSubtitle}>Real-time location sharing & safety logs</Text>
                </View>
              </View>
              
              <View style={styles.flightBenefits}>
                {['Live WhatsApp tracking for family', '24/7 SOS dispatch helpline', 'Verified intercity highway route'].map((benefit, idx) => (
                  <View key={idx} style={styles.benefitRow}>
                    <MaterialCommunityIcons name="check" size={16} color={colors.success} style={{ fontWeight: '900' }} />
                    <Text style={styles.benefitText}>{benefit}</Text>
                  </View>
                ))}
              </View>
              
              <View style={styles.flightInputBox}>
                <MaterialCommunityIcons name="whatsapp" size={18} color={colors.textLight} style={styles.flightInputIcon} />
                <TextInput
                  style={styles.flightInput}
                  placeholder="WhatsApp Safety Contact (Optional)"
                  placeholderTextColor={colors.textLight}
                  value={flightNumber}
                  onChangeText={setFlightNumber}
                  keyboardType="phone-pad"
                />
              </View>
            </View>
          </View>
        )}

        {params.type === 'hourly' && (
          <View style={styles.flightTrackingContainer}>
            {/* GOZY AI Banner */}
            <View style={styles.aiBanner}>
              <View style={styles.aiIconBox}>
                <MaterialCommunityIcons name="robot" size={16} color={colors.primary} />
              </View>
              <Text style={styles.aiText}>
                <Text style={styles.aiTextBold}>GOZY AI: </Text>
                Hourly packages support multiple stops and zero hassle.
              </Text>
            </View>
            
            {/* Feature Card */}
            <View style={styles.flightCard}>
              <View style={styles.recommendedRibbon}>
                <Text style={styles.ribbonText}>FLEXIBLE</Text>
              </View>
              
              <View style={styles.flightHeader}>
                <View style={styles.flightIconBox}>
                  <MaterialCommunityIcons name="clock-outline" size={24} color={colors.primary} />
                </View>
                <View>
                  <Text style={styles.flightTitle}>Hourly Rental Benefits</Text>
                  <Text style={styles.flightSubtitle}>Keep the cab as long as you need</Text>
                </View>
              </View>
              
              <View style={styles.flightBenefits}>
                {['Add unlimited stops during trip', 'Keep the same driver & clean car', 'Pay only for extra hours/Kms'].map((benefit, idx) => (
                  <View key={idx} style={styles.benefitRow}>
                    <MaterialCommunityIcons name="check" size={16} color={colors.success} style={{ fontWeight: '900' }} />
                    <Text style={styles.benefitText}>{benefit}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        )}

        {/* Trust Section Grid (Above Payment) */}
        <View style={styles.trustGrid}>
          {[
            { icon: 'shield-check', label: 'Verified\nDrivers' },
            { icon: 'star', label: 'Rated\n4.8/5' },
            { icon: 'map-marker-account', label: 'Live\nTracking' },
            { icon: 'headset', label: '24/7\nSupport' },
          ].map((item, idx) => (
            <View key={idx} style={styles.trustGridItem}>
              <View style={styles.trustGridIcon}>
                <MaterialCommunityIcons name={item.icon as any} size={20} color={colors.textMuted} />
              </View>
              <Text style={styles.trustGridText}>{item.label}</Text>
            </View>
          ))}
        </View>

      </ScrollView>

      {/* Bottom Payment Bar (Sticky) */}
      <View style={styles.bottomBar}>
        {/* Payment Trust Badges */}
        <View style={styles.paymentTrustRow}>
          <View style={styles.paymentTrustSecure}>
            <MaterialCommunityIcons name="lock" size={12} color={colors.textLight} />
            <Text style={styles.paymentTrustText}>SECURE PAYMENT</Text>
          </View>
          <Text style={styles.paymentTrustDiv}>|</Text>
          <Text style={styles.paymentTrustText}>UPI</Text>
          <Text style={styles.paymentTrustDiv}>•</Text>
          <Text style={styles.paymentTrustText}>VISA</Text>
          <Text style={styles.paymentTrustDiv}>•</Text>
          <Text style={styles.paymentTrustText}>RUPAY</Text>
        </View>

        <View style={styles.bottomActionRow}>
          <View style={styles.priceBlock}>
            <Text style={styles.priceLabel}>TOTAL FARE</Text>
            <Text style={styles.priceValue}>{totalVal}</Text>
            <View style={styles.savingsBadge}>
              <MaterialCommunityIcons name="trending-down" size={12} color={colors.successText} />
              <Text style={styles.savingsText}>You {savedVal}</Text>
            </View>
          </View>

          <Pressable onPress={handleCheckout} style={styles.btnCheckout}>
            <Text style={styles.btnCheckoutText}>Pay Securely</Text>
            <MaterialCommunityIcons name="arrow-right" size={20} color="#FFFFFF" />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    position: 'relative',
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    zIndex: 30,
  },
  backBtn: {
    padding: 8,
    marginLeft: -8,
    borderRadius: 20,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '800',
    color: colors.textMain,
    textAlign: 'center',
    marginRight: 16,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 180, // Space for bottom bar
    gap: 20,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  
  // Timeline Route Card
  timelineContainer: {
    position: 'relative',
    marginLeft: 4,
  },
  timelineLine: {
    position: 'absolute',
    left: 9,
    top: 20,
    bottom: 24,
    width: 2,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
  },
  timelineRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 24,
    gap: 16,
    zIndex: 10,
  },
  timelineRowDrop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
    zIndex: 10,
  },
  timelineDotStart: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#EFF6FF',
    borderWidth: 3,
    borderColor: '#3B82F6',
    marginTop: 2,
  },
  timelineDotEnd: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.primary,
    borderWidth: 3,
    borderColor: '#FFFFFF',
    marginTop: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timelineDotInner: {
    width: 6,
    height: 6,
    backgroundColor: '#FFFFFF',
    borderRadius: 3,
  },
  timelineInfo: {
    flex: 1,
  },
  timelinePlace: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textMain,
    lineHeight: 20,
  },
  timelineLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textLight,
    marginTop: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  routeMeta: {
    marginTop: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F9FAFB',
    marginHorizontal: -20,
    marginBottom: -20,
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  metaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  metaText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
  },

  // Vehicle Card
  vehicleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  vehicleInfo: {
    flex: 1,
  },
  vehicleName: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textMain,
    marginBottom: 4,
  },
  vehicleMeta: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textMuted,
  },
  vehicleImgBox: {
    width: 64,
    height: 48,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trustBadgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 16,
  },
  trustBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
  },
  trustBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },

  // Fare Breakdown
  fareToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  fareToggleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  fareToggleTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.textMain,
  },
  fareToggleRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  fareToggleTotal: {
    fontSize: 18,
    fontWeight: '900',
    color: colors.textMain,
  },
  fareDetails: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 8,
  },
  fareRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  fareLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textMuted,
  },
  fareValue: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textMain,
  },
  fareDiscountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.successLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginHorizontal: -8,
  },
  fareDiscountLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.successText,
  },
  fareDiscountValue: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.successText,
  },
  fareDivider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginVertical: 12,
  },
  fareFinalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fareFinalLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.textMain,
  },
  fareFinalValue: {
    fontSize: 18,
    fontWeight: '900',
    color: colors.textMain,
  },

  // Inclusions
  sectionContainer: {
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.textMain,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  inclusionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  inclusionChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#334155',
  },

  // Flight Tracking
  flightTrackingContainer: {
    marginTop: 8,
  },
  aiBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#EEF2FF', // Gradient fallback
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: colors.primaryBorder,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 12,
    gap: 12,
  },
  aiIconBox: {
    backgroundColor: colors.surface,
    padding: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.primaryBorder,
  },
  aiText: {
    flex: 1,
    fontSize: 11,
    fontWeight: '600',
    color: '#312E81',
    lineHeight: 16,
  },
  aiTextBold: {
    fontWeight: '900',
    color: '#4338CA',
    letterSpacing: 0.5,
  },
  flightCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.primaryBorder,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    borderTopRightRadius: 16, // If ai banner doesn't cover
    padding: 20,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    position: 'relative',
    overflow: 'hidden',
  },
  recommendedRibbon: {
    position: 'absolute',
    top: 16,
    right: 0,
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderTopLeftRadius: 6,
    borderBottomLeftRadius: 6,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  ribbonText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  flightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  flightIconBox: {
    width: 40,
    height: 40,
    backgroundColor: colors.primaryLight,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flightTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.textMain,
  },
  flightSubtitle: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  flightBenefits: {
    gap: 8,
    marginBottom: 16,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  benefitText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
  },
  flightInputBox: {
    position: 'relative',
    marginTop: 8,
  },
  flightInputIcon: {
    position: 'absolute',
    left: 12,
    top: 12,
    zIndex: 2,
  },
  flightInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingVertical: 12,
    paddingLeft: 40,
    paddingRight: 16,
    fontSize: 13,
    fontWeight: '700',
    color: colors.textMain,
  },

  // Trust Grid
  trustGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(226, 232, 240, 0.6)',
    marginTop: 8,
    marginBottom: 32,
    marginHorizontal: 16,
  },
  trustGridItem: {
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  trustGridIcon: {
    backgroundColor: '#F1F5F9',
    padding: 8,
    borderRadius: 20,
  },
  trustGridText: {
    fontSize: 9,
    fontWeight: '800',
    color: colors.textMuted,
    textTransform: 'uppercase',
    textAlign: 'center',
    letterSpacing: -0.2,
    lineHeight: 12,
  },

  // Bottom Payment Bar
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  paymentTrustRow: {
    backgroundColor: '#F8FAFC',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(226, 232, 240, 0.5)',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    gap: 8,
  },
  paymentTrustSecure: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  paymentTrustText: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.textLight,
    letterSpacing: 1,
  },
  paymentTrustDiv: {
    fontSize: 10,
    color: '#CBD5E1',
  },
  bottomActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 20,
    paddingBottom: 32, // Safe area for iOS
  },
  priceBlock: {
    flexDirection: 'column',
  },
  priceLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.textMuted,
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  priceValue: {
    fontSize: 24,
    fontWeight: '900',
    color: colors.textMain,
    lineHeight: 28,
  },
  savingsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.successLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 4,
    alignSelf: 'flex-start',
  },
  savingsText: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.successText,
  },
  btnCheckout: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  btnCheckoutText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },

  // Success Modal (Same as before)
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
  },
  modalIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.successLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textMain,
    marginBottom: 8,
  },
  modalDesc: {
    fontSize: 13,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
  },
  modalBtn: {
    width: '100%',
    height: 48,
    backgroundColor: colors.textMain,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },

  // Boarding Pass Card styles
  boardingPassCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 3,
    marginBottom: 20,
    position: 'relative',
    overflow: 'hidden',
  },
  leftNotch: {
    position: 'absolute',
    left: -12,
    top: 136, // relative to ticket height
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F3F4F6', // Match page background color (which is colors.background)
    borderRightWidth: 1.5,
    borderColor: '#E2E8F0',
    zIndex: 10,
  },
  rightNotch: {
    position: 'absolute',
    right: -12,
    top: 136,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    borderLeftWidth: 1.5,
    borderColor: '#E2E8F0',
    zIndex: 10,
  },
  boardingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  boardingBrandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  boardingHeaderText: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: 1.5,
  },
  classBadge: {
    backgroundColor: '#F0FDFA',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#CCFBF1',
  },
  classBadgeText: {
    fontSize: 8,
    fontWeight: '900',
    color: '#0D9488',
  },
  hubsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  hubBlock: {
    flex: 1,
  },
  hubCode: {
    fontSize: 32,
    fontWeight: '900',
    color: colors.textMain,
    letterSpacing: -1,
  },
  hubName: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textMuted,
    marginTop: 2,
  },
  flightTracerBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: 80,
    position: 'relative',
  },
  flightTracerLine: {
    height: 1.5,
    width: '100%',
    backgroundColor: '#E2E8F0',
    borderStyle: 'dashed',
    borderRadius: 1,
  },
  tracerPlane: {
    position: 'absolute',
    alignSelf: 'center',
    transform: [{ rotate: '90deg' }],
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 4,
  },
  dashedDividerWrapper: {
    height: 1,
    overflow: 'hidden',
    marginBottom: 16,
  },
  ticketDashedLine: {
    height: 1.5,
    width: '100%',
    backgroundColor: '#CBD5E1',
    borderStyle: 'dashed',
    borderRadius: 1,
  },
  boardingDetails: {
    gap: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 8,
    fontWeight: '700',
    color: colors.textLight,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.textMain,
  },
  barcodeContainer: {
    alignItems: 'center',
    marginTop: 4,
    gap: 6,
  },
  barcodeLabelRow: {
    alignSelf: 'stretch',
    alignItems: 'center',
  },
  barcodeText: {
    fontSize: 8,
    fontWeight: '700',
    color: colors.textLight,
    letterSpacing: 0.5,
  },
  barcodeLines: {
    flexDirection: 'row',
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
