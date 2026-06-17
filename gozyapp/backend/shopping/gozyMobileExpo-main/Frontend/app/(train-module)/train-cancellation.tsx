import { useMemo, useState, useEffect } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import {
  Alert,
  Pressable,
  Share,
  ScrollView,
  StyleSheet,
  Text,
  View,
  BackHandler,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTrainSearchStore } from '@/src/store/train-search-store';

export default function TrainCancellationScreen() {
  const { recentBookings } = useTrainSearchStore();
  const [refundStatusAnswered, setRefundStatusAnswered] = useState<string | null>(null);

  useEffect(() => {
    const handleBackPress = () => {
      router.replace('/train' as any);
      return true;
    };
    const subscription = BackHandler.addEventListener('hardwareBackPress', handleBackPress);
    return () => {
      subscription.remove();
    };
  }, []);

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
    
    // Default mock booking matching the screenshots
    return {
      id: 'rb-mock',
      bookingId: 'NR2402013447556336',
      pnr: '4754298837',
      trainName: 'EAST COAST EXP',
      trainNumber: '18046',
      routeText: 'Vijayawada Jn - Shalimar',
      dateText: '13 Mar',
      priceText: '₹ 1,605',
      freeCancellation: true,
      passengerNames: ['A vijaya'],
      email: 'sricharanc64@gmail.com',
      phone: '919392733617',
      classCode: '3A',
      tripGuarantee: true,
      departureTime: '02:45 PM',
      arrivalTime: '03:35 PM',
      departureStation: 'Vijayawada Jn (KMT)',
      arrivalStation: 'Shalimar (SHM)',
      duration: '24h 50m',
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

  // Dynamic calculations based on user's booking details
  const parsedPrice = useMemo(() => {
    const numericStr = latestBooking.priceText.replace(/[^\d.]/g, '');
    const num = parseFloat(numericStr);
    return isNaN(num) ? 1605 : num;
  }, [latestBooking.priceText]);

  const refundDetails = useMemo(() => {
    // If Trip Guarantee is opted:
    // User gets 1x in original payment mode (cash refund) and 2x as travel voucher.
    // Total cash refund = 100% of price paid (cancellation fee is waived due to waitlist/trip guarantee).
    if (latestBooking.tripGuarantee) {
      return {
        cashRefund: parsedPrice,
        cancellationFee: 0,
        voucherWorth: parsedPrice * 2,
        voucherCode: 'VOMTRAIN3PY4GEGYZ',
        dealOpted: 'Trip Guarantee (3X Refund: 1x Cash + 2x Voucher)',
      };
    }

    // If Free Cancellation is opted but no Trip Guarantee:
    // User gets 100% cash refund.
    if (latestBooking.freeCancellation) {
      return {
        cashRefund: parsedPrice,
        cancellationFee: 0,
        voucherWorth: 0,
        voucherCode: null,
        dealOpted: 'Free Cancellation (100% Refund)',
      };
    }

    // Standard cancellation (no deals opted):
    // Deduct standard IRCTC fee (e.g. flat ₹190 per passenger)
    const passengerCount = latestBooking.passengerNames.length;
    const fee = 190 * passengerCount;
    const refund = Math.max(parsedPrice - fee, 0);
    return {
      cashRefund: refund,
      cancellationFee: fee,
      voucherWorth: 0,
      voucherCode: null,
      dealOpted: 'Standard Cancellation (IRCTC Policy)',
    };
  }, [latestBooking, parsedPrice]);

  // Dynamic dates
  const cancellationDateStr = '12 Mar 2026, 21:07';
  const refundProcessedDateStr = '12 Mar 2026, 21:17';
  const expectedRefundRange = '17 Mar - 20 Mar';

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.screen}>
        
        {/* Header bar on pink background */}
        <View style={styles.header}>
          <Pressable hitSlop={12} onPress={() => router.replace('/train' as any)} style={styles.backButton}>
            <MaterialCommunityIcons color="#374151" name="arrow-left" size={26} />
          </Pressable>
          <Text style={styles.headerTitleText}>Booking Cancelled</Text>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* Booking Cancelled Header Banner */}
          <View style={styles.cancellationBannerArea}>
            <Text style={styles.bookingCancelledTitle}>Booking Cancelled</Text>

            <Pressable onPress={() => handleCopyText(latestBooking.bookingId, 'BOOKING ID')} style={styles.bookingIdPressable}>
              <Text style={styles.bookingIdText}>BOOKING ID {latestBooking.bookingId}</Text>
              <MaterialCommunityIcons color="#6B7280" name="content-copy" size={13} style={{ marginLeft: 4 }} />
            </Pressable>
          </View>

          {/* White Main Cancellation Card Overlay */}
          <View style={styles.mainCancellationCard}>
            
            {/* Refund Header Row */}
            <View style={styles.refundHeaderRow}>
              <View style={styles.refundIconBackground}>
                <MaterialCommunityIcons color="#0D9488" name="currency-inr" size={20} />
              </View>
              <Text style={styles.refundTitleText}>
                Refund of <Text style={{ fontWeight: '900' }}>₹ {refundDetails.cashRefund.toLocaleString('en-IN')}</Text> processed
              </Text>
            </View>

            {/* Cancelled Travellers Row */}
            <View style={styles.cancelledTravellersRow}>
              <MaterialCommunityIcons color="#E07A5F" name="account-remove-outline" size={22} />
              <Text style={styles.cancelledTravellersText}>You cancelled all traveler(s)</Text>
            </View>

            <View style={styles.divider} />

            {/* Refund Status Progress Timeline */}
            <View style={styles.timelineContainer}>
              
              {/* Step 1: Booking cancelled */}
              <View style={styles.timelineStepRow}>
                <View style={styles.timelineCircleActive}>
                  <MaterialCommunityIcons color="#FFFFFF" name="check" size={11} />
                </View>
                <View style={styles.timelineVerticalLine} />
                <View style={styles.timelineContentColumn}>
                  <Text style={styles.timelineStepTitle}>Booking cancelled</Text>
                  <Text style={styles.timelineStepSubtitle}>{cancellationDateStr}</Text>
                </View>
              </View>

              {/* Step 2: Refund processed */}
              <View style={styles.timelineStepRow}>
                <View style={styles.timelineCircleActive}>
                  <MaterialCommunityIcons color="#FFFFFF" name="check" size={11} />
                </View>
                <View style={styles.timelineVerticalLine} />
                <View style={styles.timelineContentColumn}>
                  <Text style={styles.timelineStepTitle}>Refund processed : ₹ {refundDetails.cashRefund.toLocaleString('en-IN')}</Text>
                  <Text style={styles.timelineStepSubtitle}>{refundProcessedDateStr}</Text>
                </View>
              </View>

              {/* Step 3: Refund credited in account */}
              <View style={[styles.timelineStepRow, { paddingBottom: 0 }]}>
                <View style={styles.timelineCircleActive}>
                  <MaterialCommunityIcons color="#FFFFFF" name="check" size={11} />
                </View>
                <View style={styles.timelineContentColumn}>
                  <Text style={styles.timelineStepTitle}>Refund credited in account</Text>
                  <Text style={styles.expectedDateText}>Expected By {expectedRefundRange}</Text>

                  {/* Gray transaction details box */}
                  <View style={styles.transactionDetailsBox}>
                    <Text style={styles.transactionDetailsText}>
                      ₹ {refundDetails.cashRefund.toLocaleString('en-IN')} has been processed in okaxis, you can trace the status of this refund transaction using ARN number 511310010716.
                    </Text>
                    <Text style={styles.transactionSubText}>
                      It takes 3-6 working days for refund to reflect in okaxis account.
                    </Text>
                  </View>
                </View>
              </View>

            </View>

            <View style={styles.divider} />

            {/* Original Payment Mode Detail */}
            <View style={styles.paymentModeSection}>
              <Text style={styles.paymentModeLabel}>Original Payment Mode</Text>
              <Text style={styles.paymentModeValue}>₹ {refundDetails.cashRefund.toLocaleString('en-IN')}</Text>
            </View>
            <Text style={styles.paymentModeSubtext}>In okaxis</Text>

            <View style={styles.divider} />

            {/* Thumbs Up/Down feedback card */}
            <View style={styles.feedbackSection}>
              <Text style={styles.feedbackTitle}>Have you received the refund?</Text>
              
              <View style={styles.feedbackButtonsRow}>
                <Pressable 
                  onPress={() => {
                    setRefundStatusAnswered('yes');
                    Alert.alert('Thank you!', 'We are glad the refund has successfully reached you.');
                  }} 
                  style={[
                    styles.feedbackButton, 
                    refundStatusAnswered === 'yes' && { backgroundColor: '#ECFDF5', borderColor: '#10B981' }
                  ]}
                >
                  <MaterialCommunityIcons 
                    color={refundStatusAnswered === 'yes' ? '#10B981' : '#0EA5E9'} 
                    name="thumb-up-outline" 
                    size={18} 
                  />
                  <Text style={[styles.feedbackButtonText, refundStatusAnswered === 'yes' && { color: '#10B981' }]}>Yes</Text>
                </Pressable>

                <Pressable 
                  onPress={() => {
                    setRefundStatusAnswered('no');
                    Alert.alert('Refund Pending', 'Refunds normally reflect within 3-6 banking working days. If it is beyond this window, please reach support.');
                  }} 
                  style={[
                    styles.feedbackButton, 
                    refundStatusAnswered === 'no' && { backgroundColor: '#FEF2F2', borderColor: '#EF4444' }
                  ]}
                >
                  <MaterialCommunityIcons 
                    color={refundStatusAnswered === 'no' ? '#EF4444' : '#EF4444'} 
                    name="thumb-down-outline" 
                    size={18} 
                  />
                  <Text style={[styles.feedbackButtonText, refundStatusAnswered === 'no' && { color: '#EF4444' }]}>Not yet</Text>
                </Pressable>
              </View>
            </View>

            <View style={styles.divider} />

            {/* Helpful links rows */}
            <Pressable onPress={() => Alert.alert('Refund Breakup', `Total Price Paid: ${latestBooking.priceText}\nDeal Opted: ${refundDetails.dealOpted}\nCancellation Charges: ₹ ${refundDetails.cancellationFee}\nTotal Refund: ₹ ${refundDetails.cashRefund}`)} style={styles.linkRow}>
              <Text style={styles.linkActionText}>View Refund Breakup</Text>
              <MaterialCommunityIcons color="#0EA5E9" name="chevron-right" size={20} />
            </Pressable>

            <Pressable onPress={() => Alert.alert('Bank Statement Check', 'To confirm refund:\n1. Check entries from "MakeMyTrip" or "IRCTC".\n2. Verify the transactions in your okaxis account under ARN 511310010716.\n3. Wait 3-6 business days.')} style={[styles.linkRow, { borderBottomWidth: 0, paddingBottom: 0 }]}>
              <Text style={styles.linkActionText}>How to check refund in bank statement?</Text>
              <MaterialCommunityIcons color="#0EA5E9" name="chevron-right" size={20} />
            </Pressable>

          </View>

          {/* Need Help Action Button */}
          <Pressable onPress={() => Alert.alert('Need Help', 'Redirecting to support assistant...')} style={styles.cancellationNeedHelpBtn}>
            <Text style={styles.cancellationNeedHelpBtnText}>NEED HELP</Text>
          </Pressable>

          {/* Conditional Purple Trip Guarantee Section (Screenshot 3) */}
          {latestBooking.tripGuarantee && (
            <View style={styles.tripGuaranteeCard}>
              
              {/* Header */}
              <View style={styles.tripGuaranteeHeader}>
                <View style={styles.tripGuaranteeBadge}>
                  <MaterialCommunityIcons color="#FFFFFF" name="ticket-percent" size={18} />
                </View>
                <Text style={styles.tripGuaranteeTitle}>Trip Guarantee</Text>
              </View>

              {/* Timeline */}
              <View style={styles.timelineContainer}>
                {/* Step 1: Trip Guarantee Booking */}
                <View style={styles.timelineStepRow}>
                  <View style={styles.timelineCircleActiveBlue}>
                    <MaterialCommunityIcons color="#FFFFFF" name="check" size={11} />
                  </View>
                  <View style={styles.timelineVerticalLineBlue} />
                  <View style={styles.timelineContentColumn}>
                    <Text style={styles.timelineStepTitle}>Trip Guarantee Booking</Text>
                    <Text style={styles.timelineStepSubtitle}>2:07 PM, 4 March 2026</Text>
                  </View>
                </View>

                {/* Step 2: Current Status */}
                <View style={[styles.timelineStepRow, { paddingBottom: 0 }]}>
                  <View style={styles.waitlistLabelWrapperYellow}>
                    <Text style={styles.waitlistLabelTextYellow}>WL</Text>
                  </View>
                  <View style={styles.timelineContentColumn}>
                    <Text style={styles.timelineStepTitle}>Current Status, Chart Prepared</Text>
                    <Text style={styles.waitlistStatusHighlightYellow}>All Passengers waitlisted</Text>
                  </View>
                </View>
              </View>

              {/* Gray Explanation Box */}
              <View style={styles.voucherExplanationBox}>
                <Text style={styles.voucherExplanationText}>
                  Unfortunately, your ticket remained Waitlisted. However has promised, we have initiated a refund of 1x in the original payment mode and 2x in the form of travel voucher
                </Text>
              </View>

              {/* Voucher issuance details */}
              <View style={styles.voucherSummaryTextWrap}>
                <Text style={styles.voucherSummaryText}>
                  We have issued a <Text style={{ fontWeight: '900' }}>2X Travel Voucher</Text> for {latestBooking.passengerNames.length} passengers worth{' '}
                  <Text style={{ fontWeight: '900', color: '#111827' }}>₹ {refundDetails.voucherWorth.toLocaleString('en-IN')}</Text>, as per the Trip Guarantee policies. Use this voucher to <Text style={{ fontWeight: '800', color: '#1697F6' }}>upgrade your trip on MakeMyTrip</Text>
                </Text>
              </View>

              {/* Voucher Code Card */}
              <View style={styles.voucherCodeCard}>
                <View style={styles.voucherCodeLeftRow}>
                  <MaterialCommunityIcons color="#0D9488" name="ticket-outline" size={20} />
                  <View style={styles.voucherCodeTextCol}>
                    <Text style={styles.voucherCodeLabelMini}>Voucher Code</Text>
                    <Text style={styles.voucherCodeValue}>{refundDetails.voucherCode}</Text>
                  </View>
                </View>
                <Pressable onPress={() => handleCopyText(refundDetails.voucherCode || '', 'VOUCHER CODE')} style={styles.voucherCopyBtn}>
                  <MaterialCommunityIcons color="#0D9488" name="content-copy" size={18} />
                </Pressable>
              </View>

              {/* Voucher rules table */}
              <View style={styles.voucherRulesTable}>
                <View style={styles.voucherRulesCol}>
                  <Text style={styles.ruleTitle}>Voucher is valid for 7 days</Text>
                  <Text style={styles.ruleBody}>Your 2X voucher will be valid for 7 days from activation i.e. till 19 Mar 2026</Text>
                </View>
                
                <View style={[styles.voucherRulesCol, { marginLeft: 16 }]}>
                  <Text style={styles.ruleTitle}>Departure should be in 7 days</Text>
                  <Text style={styles.ruleBody}>Departure date should be inside the 7 day bracket i.e. before 19 Mar 2026</Text>
                </View>
              </View>

              {/* View voucher rules link */}
              <Pressable onPress={() => Alert.alert('2X Voucher Rules', '1. Voucher worth 2x base ticket fare.\n2. Applicable on Flights, Cabs, Buses or Stays on MakeMyTrip.\n3. Must book and travel within 7 days.')} style={styles.viewRulesLinkBtn}>
                <Text style={styles.viewRulesLinkText}>View 2X Voucher rules</Text>
              </Pressable>

              {/* Account restriction details */}
              <View style={styles.accountRestrictionBox}>
                <Text style={styles.accountRestrictionText}>
                  The voucher can only be applied in the MMT account of{' '}
                  <Text style={{ fontWeight: '800' }}>{latestBooking.email.slice(0, 2) + '*********' + latestBooking.email.slice(latestBooking.email.indexOf('@'))}</Text> ({'*********' + latestBooking.phone.slice(-4)}).
                </Text>
              </View>

              {/* Footer */}
              <View style={styles.threeXRefundBanner}>
                <Text style={styles.threeXRefundText}>
                  If status stays the same after chart preparation, you will get{' '}
                  <Text style={styles.threeXBoldHighlight}>3X refund</Text>
                </Text>
                <Pressable onPress={() => Alert.alert('Trip Guarantee FAQs', 'Standard FAQs for 3X refund.')} style={styles.viewFaqBtn}>
                  <Text style={styles.viewFaqBtnText}>VIEW FAQS</Text>
                </Pressable>
              </View>

            </View>
          )}

          {/* Khammam to Shalimar Train Details Ticket Info (Screenshot 4) */}
          <View style={styles.ticketDetailsCard}>
            
            <View style={styles.ticketCardHeaderRow}>
              <Text style={styles.ticketCardTrainName}>{latestBooking.trainName}</Text>
              <Text style={styles.ticketCardTrainNumber}>#{latestBooking.trainNumber}</Text>
            </View>

            <View style={styles.ticketCardRouteGrid}>
              <View style={styles.routeCell}>
                <Text style={styles.cityNameText}>{latestBooking.departureStation.split(' ')[0]}</Text>
                <Text style={styles.stationCodeMini}>{latestBooking.departureStation.match(/\(([^)]+)\)/)?.[1] || 'PSA'}</Text>
                <Text style={styles.timeValueText}>{latestBooking.departureTime}, {latestBooking.dateText}</Text>
              </View>

              <View style={styles.ticketDurationCenter}>
                <View style={styles.dashedTripLine} />
                <View style={styles.durationPill}>
                  <Text style={styles.durationPillText}>{latestBooking.duration}</Text>
                </View>
                <View style={styles.dashedTripLine} />
              </View>

              <View style={[styles.routeCell, styles.routeCellRight]}>
                <Text style={[styles.cityNameText, styles.routeCellRightText]}>{latestBooking.arrivalStation.split(' ')[0]}</Text>
                <Text style={[styles.stationCodeMini, styles.routeCellRightText]}>{latestBooking.arrivalStation.match(/\(([^)]+)\)/)?.[1] || 'BZA'}</Text>
                <Text style={[styles.timeValueText, styles.routeCellRightText]}>{latestBooking.arrivalTime}, 14 Mar</Text>
              </View>
            </View>

            <View style={styles.ticketCardFooterStatus}>
              <Text style={styles.chartPreparedLabel}>Chart Prepared</Text>
            </View>

          </View>

          {/* PNR Detailed info card (Screenshot 4) */}
          <View style={styles.sectionCard}>
            <View style={styles.pnrCardHeaderRow}>
              <Text style={styles.pnrCardTitle}>PNR {latestBooking.pnr}</Text>
              <Text style={styles.chartPreparedRightText}>Chart Prepared</Text>
            </View>
            
            <Text style={styles.pnrCardMetaText}>
              AC 3 Tier  •  {latestBooking.passengerNames.length} Adult(s)
            </Text>

            <View style={styles.divider} />

            <Text style={styles.passengerHeaderLabel}>Passenger Name</Text>
            
            {latestBooking.passengerNames.map((pName, pIndex) => (
              <View key={pIndex} style={styles.passengerDetailRow}>
                <Text style={styles.passengerNameDisplay}>{pName}</Text>
                <Text style={styles.cancelledPassengerBadge}>CANCELLED</Text>
              </View>
            ))}
          </View>

          {/* Dynamic Amount Paid details (Screenshot 4) */}
          <View style={styles.sectionCard}>
            <View style={styles.amountPaidHeaderRow}>
              <View style={styles.amountHeaderLeft}>
                <MaterialCommunityIcons color="#111827" name="wallet-outline" size={22} />
                <Text style={styles.amountPaidTitle}>AMOUNT PAID</Text>
              </View>
              <Text style={styles.amountPaidValueText}>{latestBooking.priceText}</Text>
            </View>
            
            <Text style={styles.paidMethodText}>Paid by Card</Text>

            <Pressable onPress={() => Alert.alert('Payment Breakup', `Base Fare: ${latestBooking.priceText}\nTotal: ${latestBooking.priceText}`)} style={styles.linkRow}>
              <Text style={styles.linkActionText}>View Price and Payment Breakup</Text>
              <MaterialCommunityIcons color="#0EA5E9" name="chevron-right" size={20} />
            </Pressable>

            <Pressable onPress={() => Alert.alert('Download Invoice', 'Secure PDF invoice has been compiled.')} style={[styles.linkRow, { borderBottomWidth: 0, paddingBottom: 0 }]}>
              <Text style={styles.linkActionText}>Download Invoice</Text>
              <MaterialCommunityIcons color="#0EA5E9" name="chevron-right" size={20} />
            </Pressable>
          </View>

          {/* Dynamic passenger contact Details (Screenshot 4) */}
          <View style={styles.sectionCard}>
            <View style={styles.cancellationHeaderRow}>
              <MaterialCommunityIcons color="#9CA3AF" name="account-details-outline" size={22} />
              <Text style={styles.cancellationTitleText}>Contact Details</Text>
            </View>

            <View style={styles.readonlyContactFieldsWrap}>
              <View style={styles.readonlyRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.readonlyLabelMini}>Name</Text>
                  <Text style={styles.readonlyValue}>{latestBooking.passengerNames[0] || 'A'}</Text>
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

          {/* CALL 139 - HELP card (Screenshot 5) */}
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

        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create<any>({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFE4E6', // Premium rose success theme for cancelled
  },
  screen: {
    flex: 1,
    backgroundColor: '#FFF1F2', // Soft pink background matching the screenshot
  },
  header: {
    height: 56,
    backgroundColor: '#FFE4E6',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#FEE2E2',
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
    color: '#374151',
  },
  scrollContent: {
    paddingBottom: 48,
  },
  cancellationBannerArea: {
    backgroundColor: '#FFE4E6',
    paddingVertical: 20,
    alignItems: 'center',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  bookingCancelledTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#374151',
    textAlign: 'center',
  },
  bookingIdPressable: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    paddingVertical: 2,
  },
  bookingIdText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#6B7280',
    letterSpacing: 0.5,
  },
  mainCancellationCard: {
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
  refundHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#DCFCE7',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 14,
  },
  refundIconBackground: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  refundTitleText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
    flex: 1,
  },
  cancelledTravellersRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
    paddingHorizontal: 4,
    gap: 8,
  },
  cancelledTravellersText: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#374151',
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginVertical: 14,
  },
  timelineContainer: {
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  timelineStepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingBottom: 24,
  },
  timelineCircleActive: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#F59E0B',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  timelineVerticalLine: {
    width: 2,
    position: 'absolute',
    left: 9,
    top: 20,
    bottom: 0,
    backgroundColor: '#F59E0B',
  },
  timelineCircleActiveBlue: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  timelineVerticalLineBlue: {
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
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '700',
    marginTop: 2,
  },
  expectedDateText: {
    fontSize: 11,
    color: '#9CA3AF',
    fontWeight: '700',
    marginTop: 2,
  },
  transactionDetailsBox: {
    backgroundColor: '#F9FAFB',
    borderRadius: 6,
    padding: 10,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  transactionDetailsText: {
    fontSize: 11,
    color: '#4B5563',
    lineHeight: 16,
    fontWeight: '700',
  },
  transactionSubText: {
    fontSize: 9.5,
    color: '#9CA3AF',
    marginTop: 6,
    fontWeight: '600',
  },
  paymentModeSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  paymentModeLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: '#4B5563',
  },
  paymentModeValue: {
    fontSize: 14,
    fontWeight: '900',
    color: '#111827',
  },
  paymentModeSubtext: {
    fontSize: 11,
    color: '#9CA3AF',
    fontWeight: '600',
    marginTop: 2,
  },
  feedbackSection: {
    alignItems: 'center',
    paddingVertical: 4,
  },
  feedbackTitle: {
    fontSize: 13.5,
    fontWeight: '900',
    color: '#111827',
    marginBottom: 12,
  },
  feedbackButtonsRow: {
    flexDirection: 'row',
    gap: 16,
    width: '100%',
  },
  feedbackButton: {
    flex: 1,
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  feedbackButtonText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#4B5563',
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    paddingVertical: 12,
  },
  linkActionText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0EA5E9',
  },
  cancellationNeedHelpBtn: {
    marginHorizontal: 16,
    marginTop: 14,
    height: 40,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#0EA5E9',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  cancellationNeedHelpBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0EA5E9',
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
    fontSize: 15,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  waitlistLabelWrapperYellow: {
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
  waitlistLabelTextYellow: {
    fontSize: 10,
    fontWeight: '900',
    color: '#D97706',
  },
  waitlistStatusHighlightYellow: {
    fontSize: 12,
    fontWeight: '800',
    color: '#D97706',
    marginTop: 2,
  },
  voucherExplanationBox: {
    backgroundColor: '#F3F4F6',
    marginHorizontal: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 6,
    marginTop: -4,
  },
  voucherExplanationText: {
    fontSize: 11,
    color: '#4B5563',
    lineHeight: 16,
    fontWeight: '700',
  },
  voucherSummaryTextWrap: {
    paddingHorizontal: 14,
    marginTop: 14,
  },
  voucherSummaryText: {
    fontSize: 12,
    color: '#4B5563',
    lineHeight: 17,
    fontWeight: '700',
  },
  voucherCodeCard: {
    marginHorizontal: 14,
    marginTop: 12,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#0D9488',
    borderRadius: 8,
    backgroundColor: '#E6FDF9',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  voucherCodeLeftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  voucherCodeTextCol: {
    gap: 2,
  },
  voucherCodeLabelMini: {
    fontSize: 8.5,
    fontWeight: '800',
    color: '#9CA3AF',
  },
  voucherCodeValue: {
    fontSize: 13.5,
    fontWeight: '900',
    color: '#0D9488',
  },
  voucherCopyBtn: {
    padding: 6,
  },
  voucherRulesTable: {
    flexDirection: 'row',
    marginHorizontal: 14,
    marginTop: 14,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  voucherRulesCol: {
    flex: 1,
    gap: 4,
  },
  ruleTitle: {
    fontSize: 11,
    fontWeight: '900',
    color: '#111827',
  },
  ruleBody: {
    fontSize: 9.5,
    color: '#6B7280',
    lineHeight: 13,
    fontWeight: '700',
  },
  viewRulesLinkBtn: {
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  viewRulesLinkText: {
    fontSize: 11.5,
    fontWeight: '900',
    color: '#1697F6',
  },
  accountRestrictionBox: {
    marginHorizontal: 14,
    marginBottom: 14,
  },
  accountRestrictionText: {
    fontSize: 9.5,
    color: '#9CA3AF',
    lineHeight: 13,
    fontWeight: '600',
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
    fontSize: 11,
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
  ticketDetailsCard: {
    marginHorizontal: 16,
    marginTop: 14,
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
  ticketCardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  ticketCardTrainName: {
    fontSize: 18,
    fontWeight: '900',
    color: '#111827',
  },
  ticketCardTrainNumber: {
    fontSize: 15,
    fontWeight: '700',
    color: '#9CA3AF',
  },
  ticketCardRouteGrid: {
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
  ticketCardFooterStatus: {
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 12,
    alignItems: 'center',
  },
  chartPreparedLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0EA5E9',
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 6,
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
  pnrCardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pnrCardTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#111827',
  },
  chartPreparedRightText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#6B7280',
  },
  pnrCardMetaText: {
    marginTop: 4,
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '700',
  },
  passengerHeaderLabel: {
    fontSize: 11,
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
    fontSize: 14,
    fontWeight: '900',
    color: '#111827',
  },
  cancelledPassengerBadge: {
    fontSize: 9,
    fontWeight: '900',
    color: '#9CA3AF',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
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
    fontSize: 14,
    fontWeight: '900',
    color: '#111827',
  },
  amountPaidValueText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#111827',
  },
  paidMethodText: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '700',
    marginTop: 2,
  },
  cancellationHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  cancellationTitleText: {
    fontSize: 15,
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
    backgroundColor: '#0EA5E9',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  callHelplineBtnText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#FFFFFF',
  },
});
