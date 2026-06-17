import { useMemo, useState } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  Share,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTrainSearchStore } from '@/src/store/train-search-store';
import { LinearGradient } from 'expo-linear-gradient';

export default function TrainConfirmationScreen() {
  const { recentBookings } = useTrainSearchStore();
  const { bookingId } = useLocalSearchParams<{ bookingId?: string }>();

  // Retrieve the latest dynamic booking, fallback to premium mock values if empty
  const latestBooking = useMemo(() => {
    if (bookingId) {
      const found = recentBookings.find((b) => b.id === bookingId);
      if (found) return found;
    }
    if (recentBookings.length > 0) {
      return recentBookings[0];
    }
    
    // Beautiful mock defaults exactly matching the screenshots
    return {
      id: 'rb-mock',
      bookingId: 'NR7624860590599208',
      pnr: '6832430149',
      trainName: 'AMRIT BHARAT EXP',
      trainNumber: '20609',
      routeText: 'Palasa - Vijayawada Jn',
      dateText: '30 May',
      priceText: '₹ 694.1',
      freeCancellation: true,
      passengerNames: ['Y Sri Charan'],
      email: 'sricharanc64@gmail.com',
      phone: '919392733617',
      classCode: 'SL',
      tripGuarantee: true,
      departureTime: '02:07 PM',
      arrivalTime: '12:20 AM',
      departureStation: 'Palasa (PSA)',
      arrivalStation: 'Vijayawada Jn (BZA)',
      duration: '10h 13m',
    };
  }, [recentBookings]);

  // Copy PNR or Booking ID helper
  const handleCopyText = async (text: string, label: string) => {
    try {
      await Share.share({ message: text, title: label });
    } catch {
      Alert.alert(label, text);
    }
  };

  const formattedDateHeader = useMemo(() => {
    return `31 May • upcoming • ${latestBooking.departureStation.split(' ')[0]} • ${latestBooking.arrivalStation.split(' ')[0]}`;
  }, [latestBooking]);

  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1200);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.screen}>
        
        {/* Header bar on success background */}
        <View style={styles.header}>
          <Pressable hitSlop={12} onPress={() => router.push('/train')} style={styles.backButton}>
            <MaterialCommunityIcons color="#374151" name="arrow-left" size={26} />
          </Pressable>
          <Text style={styles.headerTitleText}>{latestBooking.routeText} Train</Text>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* Ticket Info Card & Security Badges (Matches Screenshot 1 layout) */}
          <View style={styles.premiumTicketContainer}>
            <View style={styles.premiumTrainHeader}>
              <Text style={styles.premiumTrainName}>AMRIT BHARAT EXP</Text>
              <Text style={styles.premiumTrainNumber}>#20609</Text>
            </View>

            <View style={styles.premiumRouteGrid}>
              <View style={styles.premiumRouteCell}>
                <Text style={styles.premiumCityName}>Palasa</Text>
                <Text style={styles.premiumStationCode}>PSA</Text>
                <Text style={styles.premiumTimeVal}>02:07 PM, 30 May</Text>
              </View>

              <View style={styles.premiumDurationCenter}>
                <Text style={styles.premiumDurationText}>10h 13m</Text>
                <View style={styles.premiumDurationLineContainer}>
                  <View style={styles.premiumDurationDot} />
                  <View style={styles.premiumDurationLine} />
                  <View style={styles.premiumDurationDot} />
                </View>
              </View>

              <View style={[styles.premiumRouteCell, { alignItems: 'flex-end' }]}>
                <Text style={styles.premiumCityName}>Vijayawada Jn</Text>
                <Text style={styles.premiumStationCode}>BZA</Text>
                <Text style={styles.premiumTimeVal}>12:20 AM, 31 May</Text>
              </View>
            </View>

            {/* Mint-Green / Light Teal Badges Card */}
            <View style={styles.mintBadgeBox}>
              <View style={styles.mintBadgeRow}>
                <MaterialCommunityIcons color="#1697F6" name="shield-check" size={20} />
                <Text style={styles.mintBadgeText}>Your ticket is secured with Free Cancellation!</Text>
                <MaterialCommunityIcons color="#8B95A3" name="information-outline" size={16} />
              </View>

              <View style={[styles.mintBadgeRow, { marginTop: 10 }]}>
                <MaterialCommunityIcons color="#1697F6" name="shield-check-outline" size={20} />
                <Text style={styles.mintBadgeText}>Your trip is secured with Trip Guarantee</Text>
                <MaterialCommunityIcons color="#8B95A3" name="information-outline" size={16} />
              </View>
            </View>
          </View>

          {/* Action Buttons directly below the container */}
          <View style={styles.premiumActionsRow}>
            <Pressable onPress={() => Alert.alert('Need Help', 'Connecting to support chat...')} style={styles.premiumOutlineBtn}>
              <Text style={styles.premiumOutlineBtnText}>NEED HELP</Text>
            </Pressable>
            <Pressable onPress={() => router.push('/train-ticket')} style={styles.premiumOutlineBtn}>
              <Text style={styles.premiumOutlineBtnText}>View E-Ticket ↗</Text>
            </Pressable>
          </View>

          {/* Trip Guarantee Status card */}
          {latestBooking.tripGuarantee && (
            <View style={styles.tripGuaranteeCardPremium}>
              {/* Purple/Blue Gradient Header */}
              <LinearGradient
                colors={['#8B5CF6', '#3B82F6']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.tripGuaranteeHeaderPremium}
              >
                <View style={styles.tripGuaranteeBadgePremium}>
                  <MaterialCommunityIcons color="#A855F7" name="ticket-confirmation" size={16} />
                </View>
                <Text style={styles.tripGuaranteeTitlePremium}>Trip Guarantee</Text>
              </LinearGradient>

              <View style={styles.timelineContainerPremium}>
                {/* Step 1: Trip Guarantee Booking */}
                <View style={styles.timelineStepRowPremium}>
                  <View style={styles.timelineCircleActivePremium}>
                    <MaterialCommunityIcons color="#FFFFFF" name="check" size={10} />
                  </View>
                  <View style={styles.timelineVerticalLinePremium} />
                  <View style={styles.timelineContentColumnPremium}>
                    <Text style={styles.timelineStepTitlePremium}>Trip Guarantee Booking</Text>
                    <Text style={styles.timelineStepSubtitlePremium}>8:06 PM, 22 May 2026</Text>
                  </View>
                </View>

                {/* Step 2: Current Status (CNF) */}
                <View style={styles.timelineStepRowPremium}>
                  <View style={styles.cnfLabelWrapperPremium}>
                    <Text style={styles.cnfLabelTextPremium}>CNF</Text>
                  </View>
                  <View style={[styles.timelineVerticalLinePremium, { backgroundColor: '#E2E8F0' }]} />
                  <View style={styles.timelineContentColumnPremium}>
                    <Text style={styles.timelineStepTitlePremium}>Current Status</Text>
                    <Text style={styles.cnfStatusHighlightPremium}>All Passengers Confirmed</Text>
                  </View>
                </View>

                {/* Step 3: Chart Preparation */}
                <View style={[styles.timelineStepRowPremium, { paddingBottom: 0 }]}>
                  <View style={styles.timelineCircleInactivePremium} />
                  <View style={styles.timelineContentColumnPremium}>
                    <Text style={styles.timelineStepTitlePremium}>Chart Preparation</Text>
                  </View>
                </View>
              </View>

              {/* Congratulations message bar */}
              <View style={styles.congratsBannerPremium}>
                <Text style={styles.congratsTextPremium}>
                  congratulations! Your ticket is confirmed. Have a safe journey.
                </Text>
              </View>

              {/* View FAQs bottom bar */}
              <View style={styles.tripGuaranteeFooterPremium}>
                <Text style={styles.tripGuaranteeFooterTextPremium}>
                  As promised, with Trip guarantee your ticket has been confirmed
                </Text>
                <Pressable onPress={() => Alert.alert('Trip Guarantee FAQs', 'Standard FAQs for 3X refund.')} style={styles.viewFaqBtnPremium}>
                  <Text style={styles.viewFaqBtnTextPremium}>VIEW FAQS</Text>
                </Pressable>
              </View>
            </View>
          )}

          {/* Blue status bar: Chart is yet to be prepared */}
          <View style={styles.chartStatusBarPremium}>
            <Text style={styles.chartStatusTextPremium}>Chart is yet to be prepared</Text>
          </View>

          {/* PNR Detailed Checklist */}
          <View style={styles.sectionCard}>
            <View style={styles.pnrSubheaderRow}>
              <Text style={styles.pnrTitle}>PNR {latestBooking.pnr}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <Pressable hitSlop={6} onPress={handleRefresh} style={styles.refreshBtn}>
                  {isRefreshing ? (
                    <ActivityIndicator size="small" color="#1697F6" />
                  ) : (
                    <>
                      <MaterialCommunityIcons color="#1697F6" name="autorenew" size={16} />
                      <Text style={styles.refreshBtnText}>Refresh</Text>
                    </>
                  )}
                </Pressable>
              </View>
            </View>
            
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
              <Text style={styles.pnrMetaText}>
                Sleeper  •  1 Adult(s)
              </Text>
              <Text style={styles.updatedJustNowPremium}>Updated just now</Text>
            </View>

            <View style={styles.divider} />

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
              <Text style={styles.passengerHeaderLabel}>Passenger Name</Text>
            </View>
            
            <View style={styles.passengerDetailRow}>
              <Text style={styles.passengerNameDisplay}>Y Sri Charan</Text>
              <Text style={styles.passengerCnfTextPremium}>CNF/S4/52</Text>
            </View>
          </View>

          {/* Cancellation Info card */}
          <View style={styles.sectionCard}>
            <View style={styles.cancellationHeaderRow}>
              <MaterialCommunityIcons color="#9CA3AF" name="close-circle-outline" size={20} />
              <Text style={styles.cancellationTitleText}>Cancellation</Text>
            </View>
            <Text style={styles.cancellationBodyText}>
              Cancellation charges will be applied as per IRCTC cancellation policies
            </Text>
            
            <Pressable 
              onPress={() => router.push({
                pathname: '/train-cancel-review',
                params: { bookingId: latestBooking.id }
              } as any)} 
              style={styles.cancellationLinkRow}
            >
              <Text style={[styles.cancellationLinkActionText, { color: '#E11D48' }]}>Cancel Booking</Text>
              <MaterialCommunityIcons color="#E11D48" name="chevron-right" size={20} />
            </Pressable>

            <Pressable onPress={() => Alert.alert('TDR Rules', 'TDR filing must be submitted within 2 hours of departure if seats are unutilized.')} style={[styles.cancellationLinkRow, { borderBottomWidth: 0, paddingBottom: 0 }]}>
              <Text style={styles.cancellationLinkActionText}>View TDR Rules</Text>
              <MaterialCommunityIcons color="#1697F6" name="chevron-right" size={20} />
            </Pressable>
          </View>

          {/* Dynamic Amount Paid details */}
          <View style={styles.sectionCard}>
            <View style={styles.amountPaidHeaderRow}>
              <View style={styles.amountHeaderLeft}>
                <MaterialCommunityIcons color="#111827" name="wallet-outline" size={22} />
                <Text style={styles.amountPaidTitle}>AMOUNT PAID</Text>
              </View>
              <Text style={styles.amountPaidValueText}>{latestBooking.priceText}</Text>
            </View>
            
            <Text style={styles.paidMethodText}>Paid by MMT Wallet</Text>
            <Text style={styles.paidMethodText}>Paid by Card</Text>

            <Pressable onPress={() => Alert.alert('Payment Breakup', `Base Fare: ${latestBooking.priceText}\nTotal: ${latestBooking.priceText}`)} style={styles.cancellationLinkRow}>
              <Text style={styles.cancellationLinkActionText}>View Price and Payment Breakup</Text>
              <MaterialCommunityIcons color="#1697F6" name="chevron-right" size={20} />
            </Pressable>

            <Pressable onPress={() => Alert.alert('Download Invoice', 'Secure PDF invoice has been compiled.')} style={[styles.cancellationLinkRow, { borderBottomWidth: 0, paddingBottom: 0 }]}>
              <Text style={styles.cancellationLinkActionText}>Download Invoice</Text>
              <MaterialCommunityIcons color="#1697F6" name="chevron-right" size={20} />
            </Pressable>
          </View>

          {/* Cabs recommendation block */}
          <View style={styles.sectionCard}>
            <Text style={styles.cabTitleHeader}>
              Book an outstation cab for sightseeing or completing your onward journey from{' '}
              <Text style={{ fontWeight: '900' }}>{latestBooking.arrivalStation.split(' ')[0]}</Text>
            </Text>

            {/* Cab Card details */}
            <View style={styles.cabSelectionCard}>
              <View style={styles.cabTopRow}>
                <Image 
                  source={{ uri: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=200&auto=format&fit=crop' }} 
                  style={styles.cabIllustrationImage}
                />
                <View style={styles.cabTextsColumn}>
                  <Text style={styles.cabMiniLabel}>Similar Model</Text>
                  <Text style={styles.cabCarModel}>Dzire, Etios</Text>
                  <Text style={styles.cabCarSpec}>Sedan  |  4 Seats  |  AC</Text>
                </View>
              </View>

              {/* Form address fields */}
              <View style={styles.cabAddressFieldCard}>
                <View style={styles.cabAddressRow}>
                  <View style={styles.cabFilledCircle} />
                  <View style={styles.cabFieldTexts}>
                    <Text style={styles.cabFieldLabelMini}>PICKUP ADDRESS</Text>
                    <Text style={styles.cabAddressValueText}>{latestBooking.arrivalStation.split(' ')[0]} Junction</Text>
                  </View>
                </View>

                <View style={styles.cabAddressRow}>
                  <View style={styles.cabOpenCircle} />
                  <View style={styles.cabFieldTexts}>
                    <Text style={styles.cabFieldLabelMini}>DROP ADDRESS</Text>
                    <TextInput
                      style={styles.cabDropInput}
                      placeholder="Enter drop location"
                      placeholderTextColor="#9CA3AF"
                    />
                  </View>
                </View>
              </View>

              <Pressable onPress={() => Alert.alert('Cab Services', 'Searching available outstation cabs...')} style={styles.viewCabsBtn}>
                <Text style={styles.viewCabsBtnText}>VIEW CABS</Text>
              </Pressable>
            </View>

            {/* Cab Discount banner */}
            <View style={styles.cabDiscountBanner}>
              <Text style={styles.cabDiscountText}>Book today to get best prices!</Text>
              <Text style={styles.cabDiscountSubText}>• No waiting at train stations   • Wide variety of cab options</Text>
              
              <View style={styles.cabPromoCouponBox}>
                <MaterialCommunityIcons color="#0D9488" name="ticket-outline" size={16} />
                <Text style={styles.cabPromoCouponText}>
                  Use code <Text style={{ fontWeight: '900' }}>RAILCAB</Text> to get up to 1000 off on outstation cab booking
                </Text>
              </View>
            </View>
          </View>

          {/* Dynamic passenger contact Details managed through checkout inputs */}
          <View style={styles.sectionCard}>
            <View style={styles.cancellationHeaderRow}>
              <MaterialCommunityIcons color="#9CA3AF" name="account-details-outline" size={22} />
              <Text style={styles.cancellationTitleText}>Contact Details</Text>
            </View>

            <View style={styles.readonlyContactFieldsWrap}>
              <View style={styles.readonlyRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.readonlyLabelMini}>Name</Text>
                  <Text style={styles.readonlyValue}>{latestBooking.passengerNames[0] || 'Y'}</Text>
                </View>
                
                <View style={{ flex: 1, marginLeft: 16 }}>
                  <Text style={styles.readonlyLabelMini}>Phone Number</Text>
                  <Text style={styles.readonlyValue}>{latestBooking.phone}</Text>
                </View>
              </View>

              <View style={[styles.readonlyField, { marginTop: 12 }]}>
                <Text style={styles.readonlyLabelMini}>Email ID</Text>
                <Text style={styles.readonlyValue}>{latestBooking.email}</Text>
              </View>
            </View>
          </View>

          {/* CALL 139 - HELP card */}
          <View style={styles.sectionCard}>
            <View style={styles.cancellationHeaderRow}>
              <MaterialCommunityIcons color="#9CA3AF" name="help-circle-outline" size={22} />
              <Text style={styles.cancellationTitleText}>Call 139 - HELP</Text>
            </View>
            
            <Text style={styles.cancellationBodyText}>
              For PNR status, train timing & running status etc, we recommend you to call IRCTC help line number directly.
            </Text>

            <Pressable onPress={() => Alert.alert('Mock Calling', 'Calling IRCTC helpline 139...')} style={styles.callHelplineBtn}>
              <Text style={styles.callHelplineBtnText}>CALL 139</Text>
            </Pressable>
          </View>

          {/* Let's Plan ahead Stay carousel widget */}
          <View style={[styles.sectionCard, { backgroundColor: '#2D2D2D' }]}>
            <View style={styles.planAheadHeader}>
              <MaterialCommunityIcons color="#E07A5F" name="office-building" size={20} />
              <Text style={styles.planAheadTitleText}>Let&apos;s Plan Ahead</Text>
            </View>
            
            <Text style={styles.planAheadSubtitleText}>
              Book Your Stay in {latestBooking.arrivalStation.split(' ')[0]} (Sun 31 May - Wed 03 Jun)
            </Text>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.staysScrollRow}>
              <View style={styles.stayCardCell}>
                <Image 
                  source={{ uri: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=260&auto=format&fit=crop' }} 
                  style={styles.stayCardImage}
                />
                <View style={styles.stayRatingBadge}>
                  <Text style={styles.stayRatingText}>4.1/5</Text>
                </View>
                <View style={styles.stayCardDetails}>
                  <View style={styles.ratingStarsRow}>
                    <MaterialCommunityIcons color="#F59E0B" name="star" size={12} />
                    <MaterialCommunityIcons color="#F59E0B" name="star" size={12} />
                    <MaterialCommunityIcons color="#F59E0B" name="star" size={12} />
                    <MaterialCommunityIcons color="#E5E7EB" name="star" size={12} />
                    <MaterialCommunityIcons color="#E5E7EB" name="star" size={12} />
                  </View>
                  <Text style={styles.stayHotelName}>Red Fox Hotel</Text>
                  <Text style={styles.stayHotelLocation}>Governorpet</Text>
                  <Text style={styles.hotelPricetag}>₹2,515 <Text style={styles.priceCaption}>per night</Text></Text>
                  <Text style={styles.hotelHighlightText}>✓ Conveniently located near bus & railway stations</Text>
                </View>
              </View>

              <View style={styles.stayCardCell}>
                <Image 
                  source={{ uri: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=260&auto=format&fit=crop' }} 
                  style={styles.stayCardImage}
                />
                <View style={styles.stayRatingBadge}>
                  <Text style={styles.stayRatingText}>4.5/5</Text>
                </View>
                <View style={styles.stayCardDetails}>
                  <View style={styles.ratingStarsRow}>
                    <MaterialCommunityIcons color="#F59E0B" name="star" size={12} />
                    <MaterialCommunityIcons color="#F59E0B" name="star" size={12} />
                    <MaterialCommunityIcons color="#F59E0B" name="star" size={12} />
                    <MaterialCommunityIcons color="#F59E0B" name="star" size={12} />
                    <MaterialCommunityIcons color="#E5E7EB" name="star" size={12} />
                  </View>
                  <Text style={styles.stayHotelName}>Lemon Tree Premier</Text>
                  <Text style={styles.stayHotelLocation}>Punnammathota</Text>
                  <Text style={styles.hotelPricetag}>₹4,950 <Text style={styles.priceCaption}>per night</Text></Text>
                  <Text style={styles.hotelHighlightText}>✓ Proximity to Temple, rooftop pools</Text>
                </View>
              </View>
            </ScrollView>

            <Pressable onPress={() => Alert.alert('Stay options', 'Searching stays in destination city...')} style={styles.viewStaysBtn}>
              <Text style={styles.viewStaysBtnText}>View All Options</Text>
              <Text style={styles.viewStaysSubtitle}>Hotels, Rails & more</Text>
            </Pressable>
          </View>

        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create<any>({
  safeArea: {
    flex: 1,
    backgroundColor: '#E6F7F4', // Match premium success theme green
  },
  screen: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  header: {
    height: 56,
    backgroundColor: '#E6F7F4',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#D1FAE5',
  },
  backButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleText: {
    marginLeft: 12,
    fontSize: 16,
    fontWeight: '800',
    color: '#065F46',
  },
  scrollContent: {
    paddingBottom: 48,
  },
  successBannerArea: {
    backgroundColor: '#E6F7F4',
    paddingVertical: 20,
    alignItems: 'center',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  bookingSuccessfulTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0F766E',
    textAlign: 'center',
  },
  pnrIdGroup: {
    marginTop: 8,
    alignItems: 'center',
    gap: 4,
  },
  pnrRowPressable: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 2,
  },
  successSubLabel: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#0D9488',
    letterSpacing: 0.5,
  },
  ticketCardWrapper: {
    marginHorizontal: 16,
    marginTop: -8,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 18,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  trainNumberRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  ticketTrainName: {
    fontSize: 18,
    fontWeight: '900',
    color: '#111827',
  },
  ticketTrainNumber: {
    fontSize: 13,
    fontWeight: '700',
    color: '#9CA3AF',
  },
  ticketRouteGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 18,
  },
  routeCell: {
    flex: 1.2,
  },
  routeCellRight: {
    alignItems: 'flex-end',
  },
  routeCellRightText: {
    textAlign: 'right',
  },
  cityNameText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#111827',
  },
  stationCodeMini: {
    fontSize: 12,
    fontWeight: '800',
    color: '#6B7280',
    marginTop: 2,
  },
  timeValueText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4B5563',
    marginTop: 6,
  },
  ticketDurationCenter: {
    flex: 1.1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  dashedTripLine: {
    flex: 1,
    height: 1,
    borderWidth: 0.5,
    borderStyle: 'dashed',
    borderColor: '#9CA3AF',
  },
  durationPill: {
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  durationPillText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#6B7280',
  },
  ticketSecurityBadges: {
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 12,
    gap: 8,
  },
  securityBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F9FF',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  securityBadgeText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#1D4ED8',
    marginLeft: 8,
    flex: 1,
  },
  infoIconRight: {
    marginLeft: 4,
  },
  ticketActionsRow: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 14,
  },
  ticketOutlineBtn: {
    flex: 1,
    height: 40,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#1697F6',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  ticketOutlineBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1697F6',
  },
  tripGuaranteeCard: {
    marginHorizontal: 16,
    marginTop: 14,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  tripGuaranteeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#A855F7',
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 10,
  },
  tripGuaranteeBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tripGuaranteeTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  timelineContainer: {
    paddingHorizontal: 18,
    paddingVertical: 18,
  },
  timelineStepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingBottom: 22,
  },
  timelineCircleActive: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  timelineCircleInactive: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
    zIndex: 10,
  },
  timelineVerticalLine: {
    width: 2,
    position: 'absolute',
    left: 9,
    top: 20,
    bottom: 0,
    backgroundColor: '#3B82F6',
  },
  timelineContentColumn: {
    marginLeft: 14,
    flex: 1,
  },
  timelineStepTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#111827',
  },
  timelineStepSubtitle: {
    fontSize: 10,
    color: '#6B7280',
    fontWeight: '700',
    marginTop: 2,
  },
  waitlistLabelWrapper: {
    width: 22,
    height: 22,
    borderRadius: 4,
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FDE68A',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  waitlistLabelText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#D97706',
  },
  waitlistStatusHighlight: {
    fontSize: 12,
    fontWeight: '800',
    color: '#D97706',
    marginTop: 2,
  },
  timelineFooterTip: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginHorizontal: 18,
    borderRadius: 6,
    marginBottom: 14,
  },
  timelineTipText: {
    fontSize: 10.5,
    color: '#4B5563',
    fontWeight: '700',
  },
  threeXRefundBanner: {
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingHorizontal: 14,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FAFAFA',
  },
  threeXRefundText: {
    fontSize: 10.5,
    color: '#374151',
    flex: 1.3,
    fontWeight: '700',
  },
  threeXBoldHighlight: {
    fontWeight: '900',
    color: '#111827',
  },
  viewFaqBtn: {
    borderWidth: 1,
    borderColor: '#1697F6',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  viewFaqBtnText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#1697F6',
  },
  sectionCard: {
    marginHorizontal: 16,
    marginTop: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  pnrSubheaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pnrTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: '#111827',
  },
  refreshBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  refreshBtnText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#1697F6',
  },
  pnrMetaText: {
    marginTop: 4,
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '700',
  },
  updatedMiniLabel: {
    color: '#9CA3AF',
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginVertical: 12,
  },
  passengerHeaderLabel: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#9CA3AF',
    marginBottom: 8,
  },
  passengerDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  passengerNameDisplay: {
    fontSize: 13,
    fontWeight: '900',
    color: '#111827',
  },
  waitlistedBadge: {
    alignItems: 'flex-end',
  },
  waitlistCodeText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#D97706',
  },
  waitlistStateLabel: {
    fontSize: 8,
    fontWeight: '800',
    color: '#D97706',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
    marginTop: 2,
  },
  cancellationHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  cancellationTitleText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#111827',
  },
  cancellationBodyText: {
    fontSize: 11.5,
    lineHeight: 16,
    color: '#6B7280',
    fontWeight: '600',
    marginBottom: 10,
  },
  cancellationLinkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    paddingVertical: 12,
  },
  cancellationLinkActionText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1697F6',
  },
  amountPaidHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  amountHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  amountPaidTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: '#111827',
  },
  amountPaidValueText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#111827',
  },
  paidMethodText: {
    fontSize: 10.5,
    color: '#6B7280',
    fontWeight: '700',
    marginTop: 2,
  },
  cabTitleHeader: {
    fontSize: 13.5,
    lineHeight: 18,
    color: '#4B5563',
    fontWeight: '800',
    marginBottom: 14,
  },
  cabSelectionCard: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#FAFAFA',
  },
  cabTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingBottom: 10,
    marginBottom: 10,
  },
  cabIllustrationImage: {
    width: 64,
    height: 48,
    borderRadius: 6,
  },
  cabTextsColumn: {
    marginLeft: 12,
    flex: 1,
  },
  cabMiniLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#9CA3AF',
  },
  cabCarModel: {
    fontSize: 13,
    fontWeight: '900',
    color: '#111827',
    marginTop: 2,
  },
  cabCarSpec: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#6B7280',
    marginTop: 2,
  },
  cabAddressFieldCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    gap: 8,
  },
  cabAddressRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cabFilledCircle: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#9CA3AF',
    marginRight: 10,
  },
  cabOpenCircle: {
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#9CA3AF',
    backgroundColor: '#FFFFFF',
    marginRight: 10,
  },
  cabFieldTexts: {
    flex: 1,
  },
  cabFieldLabelMini: {
    fontSize: 8,
    fontWeight: '800',
    color: '#9CA3AF',
  },
  cabAddressValueText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#111827',
    marginTop: 1,
  },
  cabDropInput: {
    fontSize: 12,
    fontWeight: '800',
    color: '#111827',
    marginTop: 1,
    paddingVertical: 1,
  },
  viewCabsBtn: {
    height: 40,
    borderRadius: 6,
    backgroundColor: '#1697F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  viewCabsBtnText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  cabDiscountBanner: {
    marginTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 12,
  },
  cabDiscountText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#111827',
  },
  cabDiscountSubText: {
    fontSize: 10.5,
    color: '#4B5563',
    fontWeight: '700',
    marginTop: 4,
  },
  cabPromoCouponBox: {
    marginTop: 10,
    backgroundColor: '#E6FDF9',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  cabPromoCouponText: {
    fontSize: 10.5,
    color: '#0F766E',
    fontWeight: '700',
    flex: 1,
  },
  readonlyContactFieldsWrap: {
    marginTop: 12,
  },
  readonlyRow: {
    flexDirection: 'row',
  },
  readonlyLabelMini: {
    fontSize: 10,
    fontWeight: '800',
    color: '#9CA3AF',
  },
  readonlyValue: {
    fontSize: 13,
    fontWeight: '900',
    color: '#111827',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: '#FAFAFA',
    marginTop: 6,
  },
  readonlyField: {
    width: '100%',
  },
  callHelplineBtn: {
    height: 40,
    borderRadius: 6,
    backgroundColor: '#1697F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  callHelplineBtnText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  planAheadHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  planAheadTitleText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#E07A5F',
  },
  planAheadSubtitleText: {
    fontSize: 11.5,
    color: '#FFFFFF',
    fontWeight: '700',
    marginBottom: 12,
  },
  staysScrollRow: {
    gap: 12,
  },
  stayCardCell: {
    width: 200,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  stayCardImage: {
    width: '100%',
    height: 110,
  },
  stayRatingBadge: {
    position: 'absolute',
    right: 8,
    top: 8,
    backgroundColor: '#1E3A8A',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  stayRatingText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  stayCardDetails: {
    padding: 10,
  },
  ratingStarsRow: {
    flexDirection: 'row',
    gap: 2,
    marginBottom: 4,
  },
  stayHotelName: {
    fontSize: 12,
    fontWeight: '900',
    color: '#111827',
  },
  stayHotelLocation: {
    fontSize: 10,
    color: '#6B7280',
    fontWeight: '700',
    marginTop: 2,
  },
  hotelPricetag: {
    fontSize: 13,
    fontWeight: '900',
    color: '#111827',
    marginTop: 6,
  },
  priceCaption: {
    fontSize: 8,
    color: '#6B7280',
    fontWeight: '600',
  },
  hotelHighlightText: {
    fontSize: 9.5,
    color: '#2563EB',
    fontWeight: '700',
    marginTop: 6,
    lineHeight: 13,
  },
  viewStaysBtn: {
    marginTop: 14,
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewStaysBtnText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#111827',
  },
  viewStaysSubtitle: {
    fontSize: 9,
    color: '#9CA3AF',
    fontWeight: '600',
    marginTop: 2,
  },
  // Confirmed premium ticket card styles (Screenshot 1)
  premiumTicketContainer: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 18,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  premiumTrainHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
    marginBottom: 16,
  },
  premiumTrainName: {
    fontSize: 18,
    fontWeight: '900',
    color: '#111827',
    letterSpacing: -0.3,
  },
  premiumTrainNumber: {
    fontSize: 16,
    fontWeight: '700',
    color: '#6B7280',
  },
  premiumRouteGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  premiumRouteCell: {
    flex: 1.2,
  },
  premiumCityName: {
    fontSize: 16,
    fontWeight: '900',
    color: '#111827',
  },
  premiumStationCode: {
    fontSize: 12,
    fontWeight: '800',
    color: '#6B7280',
    marginTop: 2,
  },
  premiumTimeVal: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#4B5563',
    marginTop: 6,
  },
  premiumDurationCenter: {
    flex: 1.1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  premiumDurationText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#9CA3AF',
    marginBottom: 4,
  },
  premiumDurationLineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  premiumDurationDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#9CA3AF',
  },
  premiumDurationLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#D1D5DB',
  },
  mintBadgeBox: {
    backgroundColor: '#E6F7F4',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  mintBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  mintBadgeLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  mintBadgeText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#047857',
    flex: 1,
  },
  premiumActionsRow: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 14,
    gap: 12,
  },
  premiumOutlineBtn: {
    flex: 1,
    height: 40,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#1697F6',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  premiumOutlineBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1697F6',
  },
  tripGuaranteeCardPremium: {
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  tripGuaranteeHeaderPremium: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 10,
  },
  tripGuaranteeBadgePremium: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tripGuaranteeTitlePremium: {
    fontSize: 13,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  timelineContainerPremium: {
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 12,
  },
  timelineStepRowPremium: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingBottom: 22,
  },
  timelineCircleActivePremium: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  timelineCircleInactivePremium: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
    zIndex: 10,
  },
  timelineVerticalLinePremium: {
    width: 2,
    position: 'absolute',
    left: 8,
    top: 18,
    bottom: 0,
    backgroundColor: '#3B82F6',
  },
  timelineContentColumnPremium: {
    marginLeft: 14,
    flex: 1,
  },
  timelineStepTitlePremium: {
    fontSize: 13,
    fontWeight: '800',
    color: '#111827',
  },
  timelineStepSubtitlePremium: {
    fontSize: 10.5,
    color: '#6B7280',
    fontWeight: '700',
    marginTop: 2,
  },
  cnfLabelWrapperPremium: {
    width: 32,
    height: 22,
    borderRadius: 4,
    backgroundColor: '#E6F7F4',
    borderWidth: 1.5,
    borderColor: '#059669',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  cnfLabelTextPremium: {
    fontSize: 9.5,
    fontWeight: '900',
    color: '#059669',
  },
  cnfStatusHighlightPremium: {
    fontSize: 12,
    fontWeight: '800',
    color: '#059669',
    marginTop: 2,
  },
  congratsBannerPremium: {
    backgroundColor: '#F3F4F6',
    marginHorizontal: 18,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 16,
  },
  congratsTextPremium: {
    fontSize: 10.5,
    color: '#4B5563',
    fontWeight: '700',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  tripGuaranteeFooterPremium: {
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FAFAFA',
    gap: 8,
  },
  tripGuaranteeFooterTextPremium: {
    fontSize: 10.5,
    color: '#4B5563',
    fontWeight: '700',
    flex: 1.3,
    lineHeight: 14,
  },
  viewFaqBtnPremium: {
    borderWidth: 1.5,
    borderColor: '#1697F6',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#FFFFFF',
  },
  viewFaqBtnTextPremium: {
    fontSize: 10,
    fontWeight: '900',
    color: '#1697F6',
  },
  chartStatusBarPremium: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderRadius: 8,
    marginHorizontal: 16,
    marginTop: 16,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chartStatusTextPremium: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#1D4ED8',
  },
  updatedJustNowPremium: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#9CA3AF',
  },
  passengerCnfTextPremium: {
    fontSize: 13,
    fontWeight: '900',
    color: '#111827',
  },
});
