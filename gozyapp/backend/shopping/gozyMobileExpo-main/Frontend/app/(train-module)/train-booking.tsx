import { useMemo, useState, useEffect } from 'react';
import { router } from 'expo-router';
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { TrainFloatingBot } from '@/src/components/train/train-floating-bot';
import { useTrainSearchStore, type SavedPassenger } from '@/src/store/train-search-store';

function formatJourneyDate(dateString?: string) {
  const date = dateString ? new Date(dateString) : new Date();
  const safeDate = Number.isNaN(date.getTime()) ? new Date() : date;

  return safeDate.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    weekday: 'long',
  });
}

function formatClassName(code: string) {
  if (code === 'SL') return 'SLEEPER';
  if (code === '3A') return '3 TIER AC';
  if (code === '2A') return '2 TIER AC';
  if (code === '1A') return '1ST AC';
  if (code === 'CC') return 'AC CHAIR CAR';
  if (code === 'EC') return 'EXECUTIVE CHAIR CAR';
  return code;
}

function getQuotaLabel(value: string) {
  const normalized = value.toUpperCase();

  if (normalized.includes('TQ') || normalized.includes('TATKAL')) {
    return 'Tatkal Quota';
  }

  if (normalized.includes('LQ')) {
    return 'Ladies Quota';
  }

  return 'General Quota';
}

const INDIAN_STATES = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chandigarh',
  'Chhattisgarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jammu and Kashmir',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Puducherry',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttarakhand',
  'Uttar Pradesh',
  'West Bengal'
];

export default function TrainBookingScreen() {
  const {
    bookingSelection,
    savedPassengers,
    addSavedPassenger,
    removeSavedPassenger,
    setReviewBookingDraft,
  } = useTrainSearchStore();
  const [showDetails, setShowDetails] = useState(false);

  // Core Booking States
  const [irctcUsername, setIrctcUsername] = useState('nikshitha'); // default username matching user's screenshot
  const [travellers, setTravellers] = useState<SavedPassenger[]>(savedPassengers);
  
  // Passenger Form Dialog States
  const [isTravellerModalVisible, setIsTravellerModalVisible] = useState(false);
  const [tName, setTName] = useState('');
  const [tAge, setTAge] = useState('');
  const [tGender, setTGender] = useState('Male');
  const [tBerth, setTBerth] = useState('No Preference');

  // Cancellation Insurance (defaulting to null representing unselected state)
  const [refundOption, setRefundOption] = useState<'zero' | 'pay' | null>(null);

  // 3x Refund and Checked travellers states
  const [checkedTravellerIds, setCheckedTravellerIds] = useState<string[]>([]);
  const [add3xRefund, setAdd3xRefund] = useState(false);
  const [addFreeCancel3x, setAddFreeCancel3x] = useState(false);

  const is3xRefundSlot = useMemo(() => {
    return bookingSelection?.slot.status.includes('Confirm or 3x Refund');
  }, [bookingSelection]);

  useEffect(() => {
    setTravellers(savedPassengers);
    setCheckedTravellerIds((current) =>
      current.filter((id) => savedPassengers.some((traveller) => traveller.id === id))
    );
  }, [savedPassengers]);

  // Coupon / Offers states
  const [selectedFestiveMeal, setSelectedFestiveMeal] = useState(false);
  const [couponInput, setCouponInput] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);

  // Contact Details
  const [email, setEmail] = useState('nikshithavadthyavath@gmail.com'); // pre-filled matching screenshot
  const [phone, setPhone] = useState('9347556415'); // pre-filled matching screenshot

  // GST optional details
  const [gstEnabled, setGstEnabled] = useState(false);
  const [gstin, setGstin] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [companyAddress, setCompanyAddress] = useState('');

  // Searchable State selector states
  const [selectedState, setSelectedState] = useState('Telangana');
  const [isStateModalVisible, setIsStateModalVisible] = useState(false);
  const [stateSearchQuery, setStateSearchQuery] = useState('');
  const [saveToProfile, setSaveToProfile] = useState(false);

  // Username validation dialog states
  const [isUsernameModalVisible, setIsUsernameModalVisible] = useState(false);
  const [tempUsernameInput, setTempUsernameInput] = useState('nikshitha');

  // Cancellation Bottom Sheet Nudge state
  const [isCancellationPromptVisible, setIsCancellationPromptVisible] = useState(false);

  const routeSubtitle = useMemo(() => {
    if (!bookingSelection) {
      return 'Bangalore To Ahmedabad | 24 Apr, Friday';
    }
    return `${bookingSelection.routeTitle} | ${formatJourneyDate(bookingSelection.journeyDate)}`;
  }, [bookingSelection]);

  const selectedTravellers = travellers.filter((traveller) => checkedTravellerIds.includes(traveller.id));
  const filteredStatesList =
    stateSearchQuery.trim() === ''
      ? INDIAN_STATES
      : INDIAN_STATES.filter((stateName) => stateName.toLowerCase().includes(stateSearchQuery.toLowerCase()));

  if (!bookingSelection) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No train seat selected.</Text>
          <Pressable onPress={() => router.back()} style={styles.backHomeButton}>
            <Text style={styles.backHomeText}>Go back</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const { slot, train } = bookingSelection;
  const boardingStation = train.departureStation.toUpperCase().replace(/\s*\(([^)]+)\)/, ', $1');

  // Dynamic Price Calculations
  const passengerCount = selectedTravellers.length;
  const baseFare = slot.price * passengerCount;
  const cancellationFee = (
    (is3xRefundSlot
      ? (add3xRefund ? Math.round(slot.price * 0.6) : 0) + (addFreeCancel3x ? Math.round(slot.price * 0.4) : 0)
      : (refundOption === 'zero' ? 320 : 0)
    ) * passengerCount
  );
  
  // Voucher Discount logic
  const isCouponValid = couponApplied || selectedFestiveMeal;
  const discountAmt = isCouponValid ? 100 : 0;
  const totalPrice = Math.max(baseFare + cancellationFee - discountAmt, 0);

  // Filter states list based on search query
  // Save new traveller handler
  const handleSaveTraveller = () => {
    if (tName.trim() === '') {
      Alert.alert('Invalid Name', 'Please enter a valid traveller name.');
      return;
    }
    if (tAge.trim() === '' || Number.isNaN(Number(tAge)) || Number(tAge) <= 0) {
      Alert.alert('Invalid Age', 'Please enter a valid age.');
      return;
    }

    const newPassenger: SavedPassenger = {
      id: Math.random().toString(36).substring(2, 9),
      name: tName.trim(),
      age: tAge.trim(),
      gender: tGender,
      berth: tBerth,
    };

    addSavedPassenger(newPassenger);
    setCheckedTravellerIds((current) => [...current, newPassenger.id]);
    setTName('');
    setTAge('');
    setTGender('Male');
    setTBerth('No Preference');
    setIsTravellerModalVisible(false);
  };

  // Triggered when DONE is clicked in Username validation Modal
  const handleDoneUsername = () => {
    if (tempUsernameInput.trim() === '') {
      Alert.alert('Username required', 'Please enter a valid IRCTC Username.');
      return;
    }
    setIrctcUsername(tempUsernameInput.trim());
    setIsUsernameModalVisible(false);
  };

  const openReviewBooking = (chosenRefundOption: 'zero' | 'pay') => {
    const tripGuaranteeFee = is3xRefundSlot && add3xRefund ? Math.round(slot.price * 0.6) * passengerCount : 0;
    const freeCancellationFee = is3xRefundSlot
      ? (addFreeCancel3x ? Math.round(slot.price * 0.4) * passengerCount : 0)
      : chosenRefundOption === 'zero'
        ? 320 * passengerCount
        : 0;
    const finalCancellationFee = tripGuaranteeFee + freeCancellationFee;
    const finalTotalPrice = Math.max(baseFare + finalCancellationFee - discountAmt, 0);

    setReviewBookingDraft({
      id: 'draft-' + Math.random().toString(36).substring(2, 9),
      irctcUsername: irctcUsername.trim(),
      routeTitle: routeSubtitle,
      journeyDate: bookingSelection.journeyDate,
      email: email.trim(),
      phone: phone.trim(),
      train,
      slot,
      passengers: selectedTravellers,
      baseFare,
      tripGuaranteeFee,
      freeCancellationFee,
      cancellationFee: finalCancellationFee,
      discountAmt,
      totalPrice: finalTotalPrice,
      refundOption: chosenRefundOption,
      addFreeCancel3x,
      add3xRefund,
      selectedPaymentMethod: null,
    });

    router.push('/train-review');
  };

  // Proceed checkout validation handler
  const handleProceedToPayment = () => {
    // 1. If username is missing, prompt
    if (irctcUsername.trim() === '') {
      Alert.alert('Missing IRCTC Username', 'Please add and verify your IRCTC username to continue.');
      return;
    }

    // 2. If travellers list is empty or passengerCount is 0, prompt
    if (passengerCount === 0) {
      Alert.alert('No Travellers Selected', 'Please select or add at least one traveller to book your ticket.');
      return;
    }

    // 3. Validate Email and Phone
    if (email.trim() === '' || !email.includes('@')) {
      Alert.alert('Invalid Email', 'Please enter a valid Email ID.');
      return;
    }
    if (phone.trim().length < 10 || Number.isNaN(Number(phone))) {
      Alert.alert('Invalid Phone', 'Please enter a valid 10-digit Phone Number.');
      return;
    }
    if (gstEnabled && (gstin.trim() === '' || companyName.trim() === '')) {
      Alert.alert('GST Details Incomplete', 'Please fill in the GSTIN and Company Name or disable GST.');
      return;
    }

    // 4. Check cancellation protection nudge
    if (is3xRefundSlot) {
      openReviewBooking(addFreeCancel3x ? 'zero' : 'pay');
    } else {
      if (refundOption === null) {
        setIsCancellationPromptVisible(true);
        return;
      }
      openReviewBooking(refundOption);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.screen}>
        
        {/* Header bar */}
        <View style={styles.header}>
          <Pressable hitSlop={12} onPress={() => router.back()} style={styles.backButton}>
            <MaterialCommunityIcons color="#111827" name="arrow-left" size={26} />
          </Pressable>
          <View style={styles.headerTextWrap}>
            <Text style={styles.headerTitle}>Traveller Details</Text>
            <Text style={styles.headerSubtitle}>{routeSubtitle}</Text>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {is3xRefundSlot && (
            <View style={styles.forgotPasswordBar}>
              <Text style={styles.forgotPasswordText}>
                Forgot Password? <Text style={styles.getNewPasswordLink} onPress={() => Alert.alert('Forgot Password', 'Password recovery instructions sent.')}>Get a new password now</Text>
              </Text>
            </View>
          )}
          
          {/* Train Ticket summary card */}
          <View style={styles.trainCard}>
            <View style={styles.trainTitleRow}>
              <Text style={styles.trainName}>{train.name}</Text>
              <Text style={styles.trainNumber}>#{train.number}</Text>
            </View>

            {!showDetails ? (
              <View style={styles.trainSummaryRow}>
                <View style={styles.trainSummaryLeft}>
                  <Text style={styles.trainClass}>{formatClassName(slot.className)}</Text>
                  <Text style={styles.summaryQuota}>{slot.quotaLabel}</Text>
                </View>
                <Pressable onPress={() => setShowDetails(true)} style={styles.detailToggle}>
                  <Text style={styles.detailToggleText}>View Details</Text>
                  <MaterialCommunityIcons color="#1697F6" name="chevron-down" size={20} />
                </Pressable>
              </View>
            ) : (
              <>
                <View style={styles.expandedTopRow}>
                  <View>
                    <Text style={styles.trainClass}>{formatClassName(slot.className)}</Text>
                    <Text style={styles.quotaCaption}>{getQuotaLabel(slot.quotaLabel)}</Text>
                  </View>
                  <View style={styles.expandedRight}>
                    <Text style={styles.summaryQuota}>{slot.quotaLabel}</Text>
                    <Text style={styles.updatedLabel}>{slot.updatedLabel}</Text>
                  </View>
                </View>

                <View style={styles.tripRow}>
                  <View style={styles.tripSide}>
                    <View style={styles.timeRow}>
                      <Text style={styles.timeValue}>{train.departureTime}</Text>
                      <Text style={styles.timeDate}>{train.departureDateLabel}</Text>
                    </View>
                    <Text style={styles.stationLabel}>{train.departureStation}</Text>
                  </View>

                  <View style={styles.tripCenter}>
                    <View style={styles.tripLine} />
                    <Text style={styles.durationLabel}>{train.duration}</Text>
                    <View style={styles.tripLine} />
                  </View>

                  <View style={[styles.tripSide, styles.tripSideRight]}>
                    <View style={[styles.timeRow, styles.timeRowRight]}>
                      <Text style={styles.timeValue}>{train.arrivalTime}</Text>
                      <Text style={styles.timeDate}>{train.arrivalDateLabel}</Text>
                    </View>
                    <Text style={[styles.stationLabel, styles.stationLabelRight]}>{train.arrivalStation}</Text>
                  </View>
                </View>

                <Pressable onPress={() => setShowDetails(false)} style={[styles.detailToggle, styles.detailToggleRight]}>
                  <Text style={styles.detailToggleText}>Hide Details</Text>
                  <MaterialCommunityIcons color="#1697F6" name="chevron-up" size={20} />
                </Pressable>
              </>
            )}

            <View style={styles.divider} />

            <View style={styles.boardingRow}>
              <Text style={styles.boardingLabel}>Boarding{'\n'}Station</Text>
              <View style={styles.boardingContent}>
                <Text style={styles.boardingStation}>{boardingStation}</Text>
                <Text style={styles.boardingTime}>{train.departureTime}, {train.departureDateLabel}</Text>
              </View>
              <Pressable onPress={() => Alert.alert('Change Boarding', 'Boarding station changes can be added next.')} style={styles.changeButton}>
                <Text style={styles.changeText}>Change</Text>
              </Pressable>
            </View>
          </View>

          {/* Clickable & Editable IRCTC Username Card - Opens Username verification popup */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>IRCTC Username</Text>
              <Pressable onPress={() => Alert.alert('Why required?', 'Your official IRCTC username is required to book a real train reservation. For this mock app, you can enter any username.')}>
                <Text style={styles.inlineLink}>Why is this required?</Text>
              </Pressable>
            </View>

            <Pressable 
              onPress={() => {
                setTempUsernameInput(irctcUsername);
                setIsUsernameModalVisible(true);
              }} 
              style={styles.inputCard}
            >
              <View style={styles.inputCardRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.inputLabel}>USERNAME</Text>
                  <Text style={styles.usernameDisplayValue}>
                    {irctcUsername !== '' ? irctcUsername : 'Please enter IRCTC username.'}
                  </Text>
                </View>
                {irctcUsername.trim() !== '' ? (
                  <View style={styles.verifySuccessIndicator}>
                    <MaterialCommunityIcons color="#10B981" name="check-circle" size={20} />
                    <Text style={styles.verifiedBtnText}>Verified</Text>
                  </View>
                ) : (
                  <MaterialCommunityIcons color="#1697F6" name="pencil-outline" size={20} />
                )}
              </View>
            </Pressable>

            <Pressable onPress={() => Alert.alert('IRCTC Account', 'To create a real IRCTC account, please register on www.irctc.co.in.')} style={styles.actionLink}>
              <Text style={styles.actionLinkText}>CREATE NEW IRCTC ACCOUNT</Text>
            </Pressable>

            <Pressable onPress={() => {
              setTempUsernameInput(irctcUsername);
              setIsUsernameModalVisible(true);
            }} style={styles.actionLink}>
              <Text style={styles.actionLinkText}>FORGOT USERNAME / PASSWORD</Text>
            </Pressable>
          </View>

          {/* Saved Travellers Section */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Traveller Details</Text>

            {travellers.length === 0 ? (
              <View style={styles.noticeStrip}>
                <Text style={styles.noticeText}>No saved passenger yet. Add one to continue with booking.</Text>
              </View>
            ) : (
              <View style={styles.travellerList}>
                {travellers.map((traveller) => {
                  const isChecked = checkedTravellerIds.includes(traveller.id);

                  return (
                    <Pressable
                      key={traveller.id}
                      onPress={() =>
                        setCheckedTravellerIds((current) =>
                          current.includes(traveller.id)
                            ? current.filter((id) => id !== traveller.id)
                            : [...current, traveller.id]
                        )
                      }
                      style={styles.customTravellerRow}
                    >
                      <View style={styles.travellerLeftRow}>
                        <MaterialCommunityIcons
                          name={isChecked ? 'checkbox-marked' : 'checkbox-blank-outline'}
                          size={22}
                          color={isChecked ? '#1697F6' : '#9CA3AF'}
                        />
                        <View style={styles.travellerTextCol}>
                          <Text style={styles.customTravellerName}>
                            {traveller.name}, {traveller.age} ({traveller.gender.charAt(0).toLowerCase()})
                          </Text>
                          <Text style={styles.customTravellerSubtext}>{traveller.berth}</Text>
                        </View>
                      </View>
                      <Pressable
                        hitSlop={8}
                        onPress={() => removeSavedPassenger(traveller.id)}
                      >
                        <Text style={styles.editBtnText}>REMOVE</Text>
                      </Pressable>
                    </Pressable>
                  );
                })}
              </View>
            )}

            <View style={styles.travellerFooterRow}>
              <Pressable onPress={() => setIsTravellerModalVisible(true)} style={styles.addTravellerBtn}>
                <MaterialCommunityIcons name="plus" size={18} color="#1697F6" />
                <Text style={styles.addTravellerBtnText}>
                  {travellers.length === 0 ? 'ADD PASSENGER' : 'ADD ANOTHER'}
                </Text>
              </Pressable>
              <Pressable onPress={() => Alert.alert('Saved passengers', `${checkedTravellerIds.length} passenger(s) selected for this booking.`)} style={styles.viewAllBtn}>
                <Text style={styles.viewAllBtnText}>{checkedTravellerIds.length} SELECTED</Text>
                <MaterialCommunityIcons name="account-group-outline" size={16} color="#1697F6" />
              </Pressable>
            </View>
          </View>

          {/* Premium Free Cancellation Options Card */}
          {is3xRefundSlot ? (
            <View style={{ gap: 14, marginVertical: 14 }}>
              {/* Card 1: Get a Confirmed Ticket or 3x Refund */}
              <View style={styles.premiumRefundCard}>
                <LinearGradient
                  colors={['#A855F7', '#3B82F6']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.premiumRefundHeader}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={styles.premiumHeaderTitle}>Get a Confirmed Ticket or 3x Refund</Text>
                    <Text style={styles.premiumHeaderSubtitle}>With Alternate Trip Plan (previously Trip Guarantee)</Text>
                  </View>
                  <MaterialCommunityIcons name="ticket-percent" size={24} color="#FFFFFF" style={{ marginLeft: 8 }} />
                </LinearGradient>

                <View style={styles.premiumRefundBody}>
                  {/* Two Refund Boxes */}
                  <View style={styles.refundBoxesRow}>
                    {/* Box 1: 1x Refund */}
                    <View style={styles.refundBox}>
                      <View style={styles.refundBoxTag}>
                        <Text style={styles.refundBoxTagText}>1x Refund</Text>
                      </View>
                      <View style={styles.refundBoxContent}>
                        <Text style={styles.refundBoxTitle}>Ticket fare = ₹ {slot.price}</Text>
                        <Text style={styles.refundBoxBody}>will be refunded to original paymode</Text>
                      </View>
                    </View>

                    {/* Box 2: 2x Refund */}
                    <View style={styles.refundBox}>
                      <View style={styles.refundBoxTag}>
                        <Text style={styles.refundBoxTagText}>2x Refund</Text>
                      </View>
                      <View style={styles.refundBoxContent}>
                        <Text style={styles.refundBoxTitle}>Ticket Fare x 2</Text>
                        <Text style={styles.refundBoxBody}>will be refunded as MMT Voucher</Text>
                      </View>
                    </View>
                  </View>

                  {/* Total Refund Highlight */}
                  <View style={styles.totalRefundHighlightRow}>
                    <Text style={styles.totalRefundText}>
                      Refund = <Text style={styles.totalRefundPriceText}>₹{slot.price * 3}</Text>
                    </Text>
                    <MaterialCommunityIcons name="check-circle" size={18} color="#10B981" />
                  </View>

                  {/* Bullet points */}
                  <View style={styles.premiumBullets}>
                    <View style={styles.bulletRow}>
                      <Text style={styles.bulletDot}>•</Text>
                      <Text style={styles.bulletText}>Use this voucher to book flight, cab, bus or train.</Text>
                    </View>
                    <View style={styles.bulletRow}>
                      <Text style={styles.bulletDot}>•</Text>
                      <Text style={styles.bulletText}>
                        Waitlisted bookings are eligible for a 3X refund. RAC is treated as confirmed, as travel is allowed with RAC tickets.{' '}
                        <Text style={styles.knowMoreLink} onPress={() => Alert.alert('Trip Guarantee Policy', 'Waitlisted bookings qualify for full 300% refund value.')}>Know more</Text>
                      </Text>
                    </View>
                  </View>

                  {/* Checkbox at bottom */}
                  <Pressable
                    onPress={() => {
                      setAdd3xRefund(!add3xRefund);
                    }}
                    style={styles.add3xCheckboxRow}
                  >
                    <MaterialCommunityIcons
                      name={add3xRefund ? 'checkbox-marked' : 'checkbox-blank-outline'}
                      size={22}
                      color={add3xRefund ? '#1D9BF0' : '#9CA3AF'}
                    />
                    <Text style={styles.add3xCheckboxText}>Add for ₹{Math.round(slot.price * 0.6)}/person</Text>
                  </Pressable>
                </View>
              </View>

              {/* Card 2: Free Cancellation */}
              <View style={styles.premiumFreeCancelCard}>
                <LinearGradient
                  colors={['#0EA5E9', '#1D9BF0']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.premiumFreeCancelHeader}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={styles.premiumHeaderTitle}>Free Cancellation</Text>
                    <Text style={styles.premiumHeaderSubtitle}>Pay zero charges when ticket is cancelled.</Text>
                  </View>
                  <MaterialCommunityIcons name="shield-check" size={24} color="#FFFFFF" style={{ marginLeft: 8 }} />
                </LinearGradient>

                <View style={styles.premiumFreeCancelBody}>
                  <View style={styles.totalRefundHighlightRow}>
                    <Text style={styles.totalRefundText}>
                      Refund per passenger when you cancel your ticket: <Text style={styles.totalRefundPriceText}>₹{slot.price}</Text>
                    </Text>
                    <MaterialCommunityIcons name="check-circle" size={18} color="#10B981" />
                  </View>

                  {/* Checkbox to add free cancellation */}
                  <Pressable
                    onPress={() => {
                      setAddFreeCancel3x(!addFreeCancel3x);
                    }}
                    style={styles.add3xCheckboxRow}
                  >
                    <MaterialCommunityIcons
                      name={addFreeCancel3x ? 'checkbox-marked' : 'checkbox-blank-outline'}
                      size={22}
                      color={addFreeCancel3x ? '#1D9BF0' : '#9CA3AF'}
                    />
                    <Text style={styles.add3xCheckboxText}>Add for ₹320/person</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          ) : (
            <View style={styles.cancellationCard}>
              <View style={styles.cancellationHeader}>
                <View style={styles.shieldIconBackground}>
                  <MaterialCommunityIcons color="#1697F6" name="shield-check" size={28} />
                </View>
                <View style={styles.cancellationHeaderTexts}>
                  <Text style={styles.cancellationMainTitle}>Get Full Fare Refund on Cancellation</Text>
                  <Text style={styles.cancellationSubtitle}>Just at ₹320 per person</Text>
                </View>
              </View>

              <View style={styles.cancellationOptions}>
                {/* Option A: Zero Charges */}
                <Pressable
                  onPress={() => setRefundOption('zero')}
                  style={[
                    styles.cancelOptionRow,
                    refundOption === 'zero' && styles.cancelOptionRowSelected,
                  ]}
                >
                  <MaterialCommunityIcons
                    color={refundOption === 'zero' ? '#1697F6' : '#9CA3AF'}
                    name={refundOption === 'zero' ? 'radiobox-marked' : 'radiobox-blank'}
                    size={24}
                  />
                  <View style={styles.cancelOptionContent}>
                    <Text style={styles.cancelOptionTitle}>Zero charges when the ticket is cancelled</Text>
                    <View style={styles.refundRow}>
                      <Text style={styles.refundHighlight}>Refund: ₹ {slot.price} per person</Text>
                      <MaterialCommunityIcons color="#10B981" name="check-circle" size={16} style={{ marginLeft: 6 }} />
                    </View>
                  </View>
                </Pressable>

                {/* Option B: Pay fees on cancellation */}
                <Pressable
                  onPress={() => setRefundOption('pay')}
                  style={[
                    styles.cancelOptionRow,
                    refundOption === 'pay' && styles.cancelOptionRowSelected,
                  ]}
                >
                  <MaterialCommunityIcons
                    color={refundOption === 'pay' ? '#1697F6' : '#9CA3AF'}
                    name={refundOption === 'pay' ? 'radiobox-marked' : 'radiobox-blank'}
                    size={24}
                  />
                  <View style={styles.cancelOptionContent}>
                    <Text style={styles.cancelOptionTitle}>Pay fees on cancellation</Text>
                  </View>
                </Pressable>
              </View>

              <View style={styles.bulbTipRow}>
                <MaterialCommunityIcons color="#F59E0B" name="lightbulb-on-outline" size={18} />
                <Text style={styles.bulbTipText}>35% travellers cancel their ticket due to change in plans</Text>
              </View>

              <Pressable onPress={() => Alert.alert('Terms & Conditions', '1. Zero cancellation charges apply to all cancellations processed 4 hours before train departure.\n2. In-app protection charges of ₹320/person are non-refundable.')}>
                <Text style={styles.termsLinkText}>Terms & Conditions</Text>
              </Pressable>
            </View>
          )}

          {/* Offers & Discounts Card */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Offers & Discounts</Text>
            
            <Pressable
              onPress={() => {
                setSelectedFestiveMeal(!selectedFestiveMeal);
                if (!selectedFestiveMeal) {
                  setCouponApplied(false);
                }
              }}
              style={styles.festiveMealRow}
            >
              <MaterialCommunityIcons
                color={selectedFestiveMeal ? '#1697F6' : '#9CA3AF'}
                name={selectedFestiveMeal ? 'radiobox-marked' : 'radiobox-blank'}
                size={24}
              />
              <View style={styles.festiveMealTextContainer}>
                <View style={styles.dashedBadgeWrap}>
                  <View style={styles.dashedBadge}>
                    <Text style={styles.dashedBadgeText}>festivemeal</Text>
                  </View>
                </View>
                <Text style={styles.festiveMealDescription}>
                  Festive offer: Get Flat 100 off on your meal booking.
                </Text>
              </View>
            </Pressable>

            <View style={styles.couponInputContainer}>
              <TextInput
                style={styles.couponInput}
                value={couponInput}
                onChangeText={(t) => {
                  setCouponInput(t);
                  if (couponApplied) setCouponApplied(false);
                }}
                placeholder="Enter a coupon code"
                placeholderTextColor="#A1A1AA"
                autoCapitalize="none"
                autoCorrect={false}
              />
              <Pressable
                onPress={() => {
                  if (couponInput.trim().toLowerCase() === 'festivemeal') {
                    setCouponApplied(true);
                    setSelectedFestiveMeal(false);
                    Alert.alert('Coupon Applied', 'Voucher "festivemeal" applied! Flat ₹100 discount credited.');
                  } else if (couponInput.trim() === '') {
                    Alert.alert('Empty Coupon', 'Please enter a coupon code.');
                  } else {
                    Alert.alert('Invalid Coupon', 'The coupon code you entered is invalid.');
                  }
                }}
                style={styles.applyButton}
              >
                <Text style={styles.applyButtonText}>Apply</Text>
              </Pressable>
            </View>

            {isCouponValid && (
              <View style={styles.couponAppliedStrip}>
                <MaterialCommunityIcons color="#10B981" name="check-circle" size={16} />
                <Text style={styles.couponAppliedText}>
                  Voucher discount of ₹100 applied successfully!
                </Text>
              </View>
            )}
          </View>

          {/* Contact Details Card */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Contact Details</Text>
            
            <View style={styles.contactField}>
              <Text style={styles.fieldLabel}>Email ID</Text>
              <TextInput
                style={styles.contactTextInput}
                value={email}
                onChangeText={setEmail}
                placeholder="Eg. abc@gmail.com"
                placeholderTextColor="#A1A1AA"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={styles.contactField}>
              <Text style={styles.fieldLabel}>Phone Number</Text>
              <TextInput
                style={styles.contactTextInput}
                value={phone}
                onChangeText={setPhone}
                placeholder="Eg. 9111111111"
                placeholderTextColor="#A1A1AA"
                keyboardType="phone-pad"
              />
            </View>
          </View>

          {/* Optional GST details */}
          <View style={styles.sectionCard}>
            <Pressable
              onPress={() => setGstEnabled(!gstEnabled)}
              style={styles.gstToggleRow}
            >
              <MaterialCommunityIcons
                color={gstEnabled ? '#1697F6' : '#9CA3AF'}
                name={gstEnabled ? 'checkbox-marked-outline' : 'checkbox-blank-outline'}
                size={22}
              />
              <Text style={styles.gstToggleText}>
                Enter Gst Details <Text style={styles.optionalText}>(Optional)</Text>
              </Text>
            </Pressable>

            {gstEnabled && (
              <View style={styles.gstFormWrap}>
                <View style={styles.contactField}>
                  <Text style={styles.fieldLabel}>GSTIN</Text>
                  <TextInput
                    style={styles.contactTextInput}
                    value={gstin}
                    onChangeText={setGstin}
                    placeholder="Eg. 36AAAAA1111A1Z1"
                    placeholderTextColor="#A1A1AA"
                    autoCapitalize="characters"
                    autoCorrect={false}
                  />
                </View>

                <View style={styles.contactField}>
                  <Text style={styles.fieldLabel}>Company Name</Text>
                  <TextInput
                    style={styles.contactTextInput}
                    value={companyName}
                    onChangeText={setCompanyName}
                    placeholder="Eg. Acme Corp"
                    placeholderTextColor="#A1A1AA"
                  />
                </View>

                <View style={styles.contactField}>
                  <Text style={styles.fieldLabel}>Company Address</Text>
                  <TextInput
                    style={styles.contactTextInput}
                    value={companyAddress}
                    onChangeText={setCompanyAddress}
                    placeholder="Eg. Hyderabad, India"
                    placeholderTextColor="#A1A1AA"
                  />
                </View>
              </View>
            )}
          </View>

          {/* State selectionDropdown triggers searchable modal */}
          <View style={styles.sectionCard}>
            <View style={styles.stateHeadingRow}>
              <Text style={styles.sectionTitle}>Your State</Text>
              <Pressable
                onPress={() => Alert.alert('State requirement', 'Selecting your home state is required by the Government of India for tax invoices under the GST structure.')}
                style={styles.infoIconPress}
              >
                <MaterialCommunityIcons color="#8B95A3" name="information-outline" size={18} />
              </Pressable>
            </View>
            <Text style={styles.stateSubtitle}>Required for GST purpose on your tax invoice</Text>

            <Pressable
              onPress={() => {
                setStateSearchQuery('');
                setIsStateModalVisible(true);
              }}
              style={styles.stateSelectorDropdown}
            >
              <View>
                <Text style={styles.dropdownMiniLabel}>State</Text>
                <Text style={styles.dropdownSelectedValue}>{selectedState}</Text>
              </View>
              <MaterialCommunityIcons color="#6B7280" name="chevron-down" size={24} />
            </Pressable>

            <Pressable
              onPress={() => setSaveToProfile(!saveToProfile)}
              style={styles.saveProfileCheckRow}
            >
              <MaterialCommunityIcons
                color={saveToProfile ? '#B91C1C' : '#9CA3AF'}
                name={saveToProfile ? 'checkbox-marked' : 'checkbox-blank-outline'}
                size={22}
              />
              <Text style={styles.saveProfileCheckText}>Confirm and save these details to your profile</Text>
            </Pressable>
          </View>

          {/* Legal policy block */}
          <View style={styles.disclaimerCard}>
            <Text style={styles.disclaimerBody}>
              By proceeding, I confirm that I agree to the{' '}
              <Text style={styles.disclaimerLink} onPress={() => Alert.alert('Cancellation Policy', 'Standard IRCTC cancellation policies apply.')}>Cancellation Policy</Text>,{' '}
              <Text style={styles.disclaimerLink} onPress={() => Alert.alert('Booking Policy', 'Tickets booked here correspond to simulated virtual mock journeys.')}>Booking Policy</Text>,{' '}
              <Text style={styles.disclaimerLink} onPress={() => Alert.alert('Privacy Policy', 'We value and protect your privacy.')}>Privacy Policy</Text>,{' '}
              <Text style={styles.disclaimerLink} onPress={() => Alert.alert('User Agreement', 'User agreement rules.')}>User Agreement</Text>, and{' '}
              <Text style={styles.disclaimerLink} onPress={() => Alert.alert('Terms of Service', 'Terms of service rules.')}>Terms of Service</Text>.
            </Text>
          </View>

        </ScrollView>

        <TrainFloatingBot bottom={128} />

        {/* Dynamic dynamic total pricing bar */}
        <View style={styles.bottomBar}>
          <View style={styles.pricingSummaryRow}>
            <View>
              <Text style={styles.amountLabel}>Total Amount</Text>
              <Text style={styles.amountValue}>₹{totalPrice}</Text>
            </View>
            <Pressable
              onPress={() => {
                Alert.alert(
                  'Price Breakdown',
                  `Base Ticket Fare: ₹${baseFare} (${passengerCount || 0} passenger)\n` +
                  `Cancellation Protection: ₹${cancellationFee}\n` +
                  `Discount Applied: -₹${discountAmt}\n` +
                  `------------------------------\n` +
                  `Final Total Price: ₹${totalPrice}`
                );
              }}
              style={styles.breakupToggle}
            >
              <Text style={styles.breakupToggleText}>View Breakup</Text>
              <MaterialCommunityIcons color="#1697F6" name="chevron-up" size={16} />
            </Pressable>
          </View>
          
          <Pressable onPress={handleProceedToPayment} style={styles.paymentButton}>
            <Text style={styles.paymentButtonText}>PROCEED TO PAYMENT</Text>
          </Pressable>
        </View>

        {/* ================= MODAL DIALOGS ================= */}

        {/* Multi-passenger add Form Modal */}
        <Modal
          visible={isTravellerModalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setIsTravellerModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalHeaderTitle}>Add Traveller Details</Text>
                <Pressable hitSlop={8} onPress={() => setIsTravellerModalVisible(false)}>
                  <MaterialCommunityIcons color="#374151" name="close" size={24} />
                </Pressable>
              </View>

              <ScrollView style={styles.modalScroll}>
                <Text style={styles.modalLabel}>FULL NAME</Text>
                <TextInput
                  style={styles.modalTextInput}
                  value={tName}
                  onChangeText={setTName}
                  placeholder="Enter passenger name"
                  placeholderTextColor="#9CA3AF"
                  autoCapitalize="words"
                />

                <Text style={styles.modalLabel}>AGE (YEARS)</Text>
                <TextInput
                  style={styles.modalTextInput}
                  value={tAge}
                  onChangeText={setTAge}
                  placeholder="Enter age"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="numeric"
                  maxLength={3}
                />

                <Text style={styles.modalLabel}>GENDER</Text>
                <View style={styles.selectorRow}>
                  {['Male', 'Female', 'Other'].map((g) => (
                    <TouchableOpacity
                      key={g}
                      onPress={() => setTGender(g)}
                      style={[
                        styles.selectorPill,
                        tGender === g && styles.selectorPillActive,
                      ]}
                    >
                      <Text style={[
                        styles.selectorPillText,
                        tGender === g && styles.selectorPillTextActive,
                      ]}>
                        {g}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <Text style={styles.modalLabel}>BERTH PREFERENCE</Text>
                <View style={styles.berthGrid}>
                  {['No Preference', 'Lower', 'Middle', 'Upper', 'Side Lower', 'Side Upper'].map((b) => (
                    <TouchableOpacity
                      key={b}
                      onPress={() => setTBerth(b)}
                      style={[
                        styles.berthPill,
                        tBerth === b && styles.berthPillActive,
                      ]}
                    >
                      <Text style={[
                        styles.berthPillText,
                        tBerth === b && styles.berthPillTextActive,
                      ]}>
                        {b}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>

              <View style={styles.modalActions}>
                <Pressable
                  onPress={() => setIsTravellerModalVisible(false)}
                  style={[styles.modalBtn, styles.modalBtnCancel]}
                >
                  <Text style={styles.modalBtnCancelText}>Cancel</Text>
                </Pressable>
                <Pressable
                  onPress={handleSaveTraveller}
                  style={[styles.modalBtn, styles.modalBtnSave]}
                >
                  <Text style={styles.modalBtnSaveText}>Save Traveller</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>

        {/* 1. Searchable State Picker Full Screen Modal (Screenshot 1) */}
        <Modal
          visible={isStateModalVisible}
          transparent={false}
          animationType="slide"
          onRequestClose={() => setIsStateModalVisible(false)}
        >
          <SafeAreaView style={styles.stateModalContainer}>
            {/* Modal Header */}
            <View style={styles.stateModalHeader}>
              <Pressable hitSlop={12} onPress={() => setIsStateModalVisible(false)} style={styles.stateCloseBtn}>
                <MaterialCommunityIcons color="#374151" name="close" size={28} />
              </Pressable>
              <Text style={styles.stateHeaderTitle}>Select the State</Text>
            </View>

            {/* Search Input Box */}
            <View style={styles.stateSearchBoxContainer}>
              <View style={styles.stateSearchBox}>
                <TextInput
                  style={styles.stateSearchTextInput}
                  value={stateSearchQuery}
                  onChangeText={setStateSearchQuery}
                  placeholder="Enter state"
                  placeholderTextColor="#9CA3AF"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <MaterialCommunityIcons color="#111827" name="magnify" size={24} style={styles.searchIconRight} />
              </View>
            </View>

            {/* States List */}
            <FlatList
              data={filteredStatesList}
              keyExtractor={(item) => item}
              showsVerticalScrollIndicator={true}
              contentContainerStyle={styles.statesListContent}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => {
                    setSelectedState(item);
                    setIsStateModalVisible(false);
                  }}
                  style={styles.stateRowContainer}
                >
                  {/* Pin location icon inside light blue square background container */}
                  <View style={styles.pinIconContainer}>
                    <MaterialCommunityIcons color="#4338CA" name="map-marker" size={18} />
                  </View>
                  <Text style={styles.stateRowTextName}>{item}</Text>
                </Pressable>
              )}
              ListEmptyComponent={
                <View style={styles.emptyStateList}>
                  <Text style={styles.emptyStateListText}>{`No states found matching "${stateSearchQuery}"`}</Text>
                </View>
              }
            />
          </SafeAreaView>
        </Modal>

        {/* 2. Centered Username Verification Modal (Screenshot 2) */}
        <Modal
          visible={isUsernameModalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setIsUsernameModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.usernameModalCard}>
              
              {/* Header */}
              <View style={styles.usernameHeader}>
                <Text style={styles.usernameHeaderTitle}>IRCTC Username</Text>
                <Pressable hitSlop={12} onPress={() => setIsUsernameModalVisible(false)} style={styles.usernameClosePress}>
                  <MaterialCommunityIcons color="#6B7280" name="close-circle" size={24} />
                </Pressable>
              </View>

              {/* TextInput inside a card */}
              <View style={styles.usernameVerifyCard}>
                <Text style={styles.verifyLabelSmall}>IRCTC USERNAME</Text>
                <TextInput
                  style={styles.verifyTextInputValue}
                  value={tempUsernameInput}
                  onChangeText={setTempUsernameInput}
                  placeholder="Enter IRCTC Username"
                  placeholderTextColor="#9CA3AF"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>

              {/* Checkmarks list inside green block */}
              {tempUsernameInput.trim().length > 2 ? (
                <View style={styles.checkmarksBlock}>
                  <View style={styles.checkRowItem}>
                    <MaterialCommunityIcons color="#0D9488" name="check-circle" size={18} />
                    <Text style={styles.checkRowText}>{`Username '${tempUsernameInput}' exists in IRCTC.`}</Text>
                  </View>
                  <View style={styles.checkRowItem}>
                    <MaterialCommunityIcons color="#0D9488" name="check-circle" size={18} />
                    <Text style={styles.checkRowText}>Password is valid.</Text>
                  </View>
                  <View style={styles.checkRowItem}>
                    <MaterialCommunityIcons color="#0D9488" name="check-circle" size={18} />
                    <Text style={styles.checkRowText}>IRCTC profile is complete.</Text>
                  </View>
                </View>
              ) : (
                <View style={styles.checkmarksPlaceholder}>
                  <Text style={styles.placeholderWarning}>Please type username to validate profile details.</Text>
                </View>
              )}

              {/* Peach warning card */}
              <View style={styles.peachWarningBox}>
                <Text style={styles.peachWarningText}>
                  IRCTC password will be required after Payment. Please ensure you enter correct username.
                </Text>
              </View>

              {/* Forgot links */}
              <View style={styles.forgotLinksRow}>
                <Text style={styles.forgotPassText}>Forgot Password?</Text>
                <Pressable onPress={() => Alert.alert('Recovery', 'Opening recovery window...')}>
                  <Text style={styles.forgotLinkActionText}>GET NEW PASSWORD</Text>
                </Pressable>
              </View>

              {/* DONE button */}
              <Pressable onPress={handleDoneUsername} style={styles.doneVerificationBtn}>
                <Text style={styles.doneVerificationBtnText}>DONE</Text>
              </Pressable>

            </View>
          </View>
        </Modal>

        {/* 3. Cancellation Prompter Bottom Sheet Modal (Screenshot 3) */}
        <Modal
          visible={isCancellationPromptVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setIsCancellationPromptVisible(false)}
        >
          <View style={styles.promptBottomOverlay}>
            <View style={styles.promptBottomContent}>
              
              {/* Shield Header */}
              <View style={styles.promptHeader}>
                <View style={styles.promptShieldWrap}>
                  <MaterialCommunityIcons color="#1697F6" name="shield-check" size={32} />
                </View>
                <View style={styles.promptHeaderTextWrap}>
                  <Text style={styles.promptHeaderTitle}>Get full refund on cancellation</Text>
                  <Text style={styles.promptHeaderSubtitle}>Guaranteed refund. Trusted by 1 Lakh+ users</Text>
                </View>
              </View>

              {/* Highlight strip */}
              <View style={styles.promptHighlightStrip}>
                <Text style={styles.promptHighlightStripText}>
                  Cancel your Train bookings for FREE with Free Cancellation
                </Text>
              </View>

              {/* Checklist */}
              <View style={styles.promptChecklist}>
                <View style={styles.promptCheckRow}>
                  <MaterialCommunityIcons color="#0D9488" name="check" size={20} />
                  <Text style={styles.promptCheckRowTextBold}>
                    Approx Refund : ₹ {slot.price}/person
                  </Text>
                </View>
                <View style={styles.promptCheckRow}>
                  <MaterialCommunityIcons color="#0D9488" name="check" size={18} />
                  <Text style={styles.promptCheckRowText}>Enjoy ZERO IRCTC penalty</Text>
                </View>
                <View style={styles.promptCheckRow}>
                  <MaterialCommunityIcons color="#0D9488" name="check" size={18} />
                  <Text style={styles.promptCheckRowText}>Get FULL Ticket Fare Refund</Text>
                </View>
                <View style={styles.promptCheckRow}>
                  <MaterialCommunityIcons color="#0D9488" name="check" size={18} />
                  <Text style={styles.promptCheckRowText}>Automatic waiver on your cancellation</Text>
                </View>
                <View style={styles.promptCheckRow}>
                  <MaterialCommunityIcons color="#0D9488" name="check" size={18} />
                  <Text style={styles.promptCheckRowText}>Instant refund to your original pay mode</Text>
                </View>
              </View>

              {/* Buttons */}
              <View style={styles.promptActionsWrap}>
                <Pressable 
                  onPress={() => {
                    setRefundOption('zero');
                    setIsCancellationPromptVisible(false);
                    setTimeout(() => {
                      openReviewBooking('zero');
                    }, 300);
                  }}
                  style={styles.promptBuyBtn}
                >
                  <Text style={styles.promptBuyBtnText}>Buy Free Cancellation @ ₹320/person</Text>
                </Pressable>

                <Pressable 
                  onPress={() => {
                    setRefundOption('pay');
                    setIsCancellationPromptVisible(false);
                    setTimeout(() => {
                      openReviewBooking('pay');
                    }, 300);
                  }}
                  style={styles.promptSkipBtn}
                >
                  <Text style={styles.promptSkipBtnText}>Skip Free Cancellation</Text>
                </Pressable>
              </View>

            </View>
          </View>
        </Modal>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  screen: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  header: {
    height: 86,
    paddingHorizontal: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTextWrap: {
    marginLeft: 10,
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    lineHeight: 22,
    fontWeight: '800',
    color: '#111827',
  },
  headerSubtitle: {
    marginTop: 4,
    fontSize: 12,
    lineHeight: 16,
    color: '#8B95A3',
  },
  scrollContent: {
    paddingBottom: 220,
  },
  trainCard: {
    backgroundColor: '#FFFFFF',
    marginTop: 10,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E5E7EB',
  },
  trainTitleRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
  },
  trainName: {
    fontSize: 18,
    lineHeight: 22,
    fontWeight: '800',
    color: '#111827',
  },
  trainNumber: {
    fontSize: 16,
    lineHeight: 20,
    color: '#A1A1AA',
  },
  trainSummaryRow: {
    marginTop: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  trainSummaryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  trainClass: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '700',
    color: '#111827',
  },
  summaryQuota: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '700',
    color: '#D97706',
  },
  detailToggle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailToggleRight: {
    justifyContent: 'flex-end',
    marginTop: 12,
  },
  detailToggleText: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '700',
    color: '#1697F6',
  },
  expandedTopRow: {
    marginTop: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  expandedRight: {
    alignItems: 'flex-end',
  },
  quotaCaption: {
    marginTop: 8,
    fontSize: 11,
    lineHeight: 14,
    color: '#9CA3AF',
  },
  updatedLabel: {
    marginTop: 8,
    fontSize: 11,
    lineHeight: 14,
    color: '#9CA3AF',
  },
  tripRow: {
    marginTop: 18,
    flexDirection: 'row',
    alignItems: 'center',
  },
  tripSide: {
    flex: 1.1,
  },
  tripSideRight: {
    alignItems: 'flex-end',
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  timeRowRight: {
    justifyContent: 'flex-end',
  },
  timeValue: {
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '800',
    color: '#111827',
  },
  timeDate: {
    fontSize: 12,
    lineHeight: 16,
    color: '#8B95A3',
  },
  stationLabel: {
    marginTop: 8,
    fontSize: 11,
    lineHeight: 15,
    color: '#8B95A3',
  },
  stationLabelRight: {
    textAlign: 'right',
  },
  tripCenter: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 6,
  },
  tripLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  durationLabel: {
    fontSize: 11,
    lineHeight: 15,
    color: '#9CA3AF',
  },
  divider: {
    marginTop: 16,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  boardingRow: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  boardingLabel: {
    width: 86,
    fontSize: 12,
    lineHeight: 16,
    color: '#111827',
    fontWeight: '500',
  },
  boardingContent: {
    flex: 1,
    paddingRight: 8,
  },
  boardingStation: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '700',
    color: '#111827',
  },
  boardingTime: {
    marginTop: 4,
    fontSize: 11,
    lineHeight: 14,
    color: '#8B95A3',
  },
  changeButton: {
    paddingLeft: 8,
  },
  changeText: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '700',
    color: '#1697F6',
  },
  sectionCard: {
    marginTop: 10,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E5E7EB',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  sectionTitle: {
    fontSize: 18,
    lineHeight: 22,
    fontWeight: '800',
    color: '#111827',
  },
  inlineLink: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '700',
    color: '#1697F6',
  },
  inputCard: {
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 14,
    backgroundColor: '#FAFAFA',
  },
  inputCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  verifySuccessIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  verifiedBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#10B981',
  },
  inputLabel: {
    fontSize: 10,
    lineHeight: 13,
    fontWeight: '700',
    color: '#A1A1AA',
  },
  usernameDisplayValue: {
    marginTop: 4,
    fontSize: 15,
    fontWeight: '800',
    color: '#111827',
  },
  textInput: {
    marginTop: 4,
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    paddingVertical: 4,
  },
  actionLink: {
    marginTop: 18,
  },
  actionLinkText: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '800',
    color: '#1697F6',
  },
  noticeStrip: {
    marginTop: 14,
    backgroundColor: '#FFF7EC',
    borderWidth: 1,
    borderColor: '#F4E7CE',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  noticeText: {
    fontSize: 11,
    lineHeight: 14,
    color: '#D97706',
    fontWeight: '700',
  },
  travellerLink: {
    marginTop: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  travellerList: {
    marginTop: 12,
    gap: 10,
  },
  travellerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#F3F4F6',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  avatarCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#1697F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  travellerInfoWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  travellerTextColumn: {
    marginLeft: 10,
    flex: 1,
  },
  travellerNameText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#111827',
  },
  travellerSubText: {
    marginTop: 2,
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '700',
  },
  deleteTravellerButton: {
    padding: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancellationCard: {
    marginTop: 10,
    backgroundColor: '#EAF7FF',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#D7ECFA',
    paddingHorizontal: 16,
    paddingVertical: 18,
  },
  cancellationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  shieldIconBackground: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancellationHeaderTexts: {
    marginLeft: 12,
    flex: 1,
  },
  cancellationMainTitle: {
    fontSize: 15,
    lineHeight: 18,
    fontWeight: '800',
    color: '#111827',
  },
  cancellationSubtitle: {
    marginTop: 2,
    fontSize: 12,
    color: '#374151',
    fontWeight: '600',
  },
  cancellationOptions: {
    marginTop: 16,
    gap: 10,
  },
  cancelOptionRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 14,
    gap: 10,
  },
  cancelOptionRowSelected: {
    borderColor: '#1697F6',
    backgroundColor: '#F0F9FF',
  },
  cancelOptionContent: {
    flex: 1,
  },
  cancelOptionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#111827',
  },
  refundRow: {
    marginTop: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  refundHighlight: {
    fontSize: 12,
    fontWeight: '800',
    color: '#10B981',
  },
  bulbTipRow: {
    marginTop: 14,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3FAFF',
    borderWidth: 1,
    borderColor: '#E0F2FE',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    gap: 6,
  },
  bulbTipText: {
    fontSize: 11,
    color: '#4B5563',
    flex: 1,
    fontWeight: '700',
  },
  termsLinkText: {
    marginTop: 12,
    fontSize: 12,
    fontWeight: '800',
    color: '#1697F6',
    alignSelf: 'flex-start',
  },
  festiveMealRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginTop: 14,
  },
  festiveMealTextContainer: {
    marginLeft: 10,
    flex: 1,
  },
  dashedBadgeWrap: {
    alignSelf: 'flex-start',
  },
  dashedBadge: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#0D9488',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    backgroundColor: '#F0FDFA',
  },
  dashedBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0D9488',
  },
  festiveMealDescription: {
    marginTop: 6,
    fontSize: 12,
    lineHeight: 16,
    color: '#374151',
  },
  couponInputContainer: {
    flexDirection: 'row',
    marginTop: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    backgroundColor: '#FAFAFA',
    overflow: 'hidden',
  },
  couponInput: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
  },
  applyButton: {
    paddingHorizontal: 20,
    backgroundColor: '#F3F4F6',
    borderLeftWidth: 1,
    borderLeftColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyButtonText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1697F6',
  },
  couponAppliedStrip: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  couponAppliedText: {
    fontSize: 11,
    color: '#065F46',
    fontWeight: '800',
  },
  contactField: {
    marginTop: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingBottom: 6,
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#8B95A3',
  },
  contactTextInput: {
    marginTop: 6,
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    paddingVertical: 2,
  },
  gstToggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  gstToggleText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#111827',
  },
  optionalText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
  },
  gstFormWrap: {
    marginTop: 10,
    paddingLeft: 4,
  },
  stateHeadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  infoIconPress: {
    padding: 4,
  },
  stateSubtitle: {
    marginTop: 2,
    fontSize: 11,
    color: '#9CA3AF',
    fontWeight: '700',
  },
  stateSelectorDropdown: {
    marginTop: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: '#FAFAFA',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dropdownMiniLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#A1A1AA',
  },
  dropdownSelectedValue: {
    marginTop: 4,
    fontSize: 14,
    fontWeight: '800',
    color: '#111827',
  },
  saveProfileCheckRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
    gap: 8,
  },
  saveProfileCheckText: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '700',
    flex: 1,
  },
  disclaimerCard: {
    paddingHorizontal: 16,
    paddingVertical: 18,
    marginTop: 10,
    backgroundColor: '#F9FAFB',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E5E7EB',
  },
  disclaimerBody: {
    fontSize: 11,
    lineHeight: 15,
    color: '#6B7280',
    fontWeight: '700',
  },
  disclaimerLink: {
    color: '#1697F6',
    fontWeight: '800',
  },
  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 10,
  },
  pricingSummaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  amountLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#8B95A3',
  },
  amountValue: {
    fontSize: 20,
    fontWeight: '900',
    color: '#111827',
  },
  breakupToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingVertical: 4,
  },
  breakupToggleText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1697F6',
  },
  paymentButton: {
    height: 52,
    borderRadius: 8,
    backgroundColor: '#1697F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paymentButtonText: {
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  emptyTitle: {
    fontSize: 18,
    lineHeight: 22,
    fontWeight: '800',
    color: '#111827',
  },
  backHomeButton: {
    marginTop: 16,
    height: 44,
    paddingHorizontal: 18,
    borderRadius: 10,
    backgroundColor: '#1697F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backHomeText: {
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    width: '100%',
    maxHeight: '85%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 18,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalHeaderTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
  },
  modalScroll: {
    marginTop: 14,
  },
  modalLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#8B95A3',
    marginTop: 12,
  },
  modalTextInput: {
    marginTop: 6,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    backgroundColor: '#FAFAFA',
  },
  selectorRow: {
    flexDirection: 'row',
    marginTop: 6,
    gap: 8,
  },
  selectorPill: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 6,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
  },
  selectorPillActive: {
    borderColor: '#1697F6',
    backgroundColor: '#EAF7FF',
  },
  selectorPillText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#4B5563',
  },
  selectorPillTextActive: {
    color: '#1697F6',
  },
  berthGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 6,
    gap: 8,
  },
  berthPill: {
    width: '48%',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 6,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
  },
  berthPillActive: {
    borderColor: '#1697F6',
    backgroundColor: '#EAF7FF',
  },
  berthPillText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#4B5563',
  },
  berthPillTextActive: {
    color: '#1697F6',
  },
  modalActions: {
    flexDirection: 'row',
    marginTop: 20,
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 14,
  },
  modalBtn: {
    flex: 1,
    height: 46,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBtnCancel: {
    backgroundColor: '#F3F4F6',
  },
  modalBtnCancelText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#4B5563',
  },
  modalBtnSave: {
    backgroundColor: '#1697F6',
  },
  modalBtnSaveText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  // 1. Searchable State Picker Modal Styles (Screenshot 1)
  stateModalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  stateModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  stateCloseBtn: {
    padding: 4,
    marginRight: 12,
  },
  stateHeaderTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
  },
  stateSearchBoxContainer: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#F9FAFB',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  stateSearchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    height: 48,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  stateSearchTextInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  searchIconRight: {
    marginLeft: 8,
  },
  statesListContent: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  stateRowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  pinIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 6,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  stateRowTextName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#374151',
  },
  emptyStateList: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyStateListText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '700',
  },

  // 2. Centered Username Verification popup (Screenshot 2)
  usernameModalCard: {
    width: '90%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 10,
  },
  usernameHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  usernameHeaderTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
  },
  usernameClosePress: {
    padding: 2,
  },
  usernameVerifyCard: {
    marginTop: 18,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: '#FAFAFA',
  },
  verifyLabelSmall: {
    fontSize: 10,
    fontWeight: '800',
    color: '#8B95A3',
  },
  verifyTextInputValue: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
    marginTop: 2,
    paddingVertical: 4,
  },
  checkmarksBlock: {
    marginTop: 14,
    gap: 8,
    paddingLeft: 4,
  },
  checkRowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  checkRowText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F766E',
  },
  checkmarksPlaceholder: {
    marginTop: 14,
    paddingHorizontal: 4,
  },
  placeholderWarning: {
    fontSize: 12,
    color: '#9CA3AF',
    fontStyle: 'italic',
    fontWeight: '600',
  },
  peachWarningBox: {
    marginTop: 18,
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FDE68A',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  peachWarningText: {
    fontSize: 12,
    lineHeight: 16,
    color: '#B45309',
    fontWeight: '700',
  },
  forgotLinksRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    gap: 4,
  },
  forgotPassText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '700',
  },
  forgotLinkActionText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1697F6',
  },
  doneVerificationBtn: {
    marginTop: 20,
    height: 48,
    borderRadius: 8,
    backgroundColor: '#1697F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  doneVerificationBtnText: {
    fontSize: 15,
    fontWeight: '900',
    color: '#FFFFFF',
  },

  // 3. Bottom Sheet Cancellation Prompter (Screenshot 3)
  promptBottomOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
  },
  promptBottomContent: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 12,
  },
  promptHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 14,
  },
  promptShieldWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EAF7FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  promptHeaderTextWrap: {
    marginLeft: 12,
    flex: 1,
  },
  promptHeaderTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
  },
  promptHeaderSubtitle: {
    marginTop: 2,
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '700',
  },
  promptHighlightStrip: {
    backgroundColor: '#E6FDF9',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginTop: 8,
  },
  promptHighlightStripText: {
    fontSize: 11,
    color: '#0F766E',
    fontWeight: '800',
  },
  promptChecklist: {
    marginTop: 18,
    gap: 8,
  },
  promptCheckRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  promptCheckRowTextBold: {
    fontSize: 15,
    fontWeight: '900',
    color: '#0F766E',
  },
  promptCheckRowText: {
    fontSize: 13,
    color: '#4B5563',
    fontWeight: '700',
  },
  promptActionsWrap: {
    marginTop: 22,
    gap: 12,
  },
  promptBuyBtn: {
    height: 52,
    borderRadius: 8,
    backgroundColor: '#1697F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  promptBuyBtnText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  promptSkipBtn: {
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  promptSkipBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1697F6',
    textDecorationLine: 'underline',
  },
  forgotPasswordBar: {
    backgroundColor: '#FFEFEB',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#FFD1C1',
    marginBottom: 10,
  },
  forgotPasswordText: {
    fontSize: 12,
    color: '#D97706',
    fontWeight: '600',
  },
  getNewPasswordLink: {
    color: '#1D9BF0',
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
  customTravellerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  travellerLeftRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    flex: 1,
  },
  travellerTextCol: {
    flexDirection: 'column',
    gap: 4,
    flex: 1,
  },
  customTravellerName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  customTravellerSubtext: {
    fontSize: 12,
    color: '#6B7280',
  },
  extraConcessionText: {
    fontSize: 10,
    color: '#9CA3AF',
    marginTop: 2,
  },
  editBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1D9BF0',
    paddingHorizontal: 8,
  },
  travellerFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  addTravellerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  addTravellerBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1D9BF0',
  },
  viewAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  viewAllBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1D9BF0',
  },
  premiumRefundCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
    shadowColor: 'rgba(0,0,0,0.06)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 3,
  },
  premiumRefundHeader: {
    paddingHorizontal: 14,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  premiumHeaderTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  premiumHeaderSubtitle: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.85)',
    marginTop: 3,
  },
  premiumRefundBody: {
    padding: 14,
  },
  refundBoxesRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 14,
  },
  refundBox: {
    flex: 1,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#F9FAFB',
  },
  refundBoxTag: {
    backgroundColor: '#E5E7EB',
    paddingHorizontal: 4,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: '#D1D5DB',
    width: 24,
  },
  refundBoxTagText: {
    fontSize: 8,
    fontWeight: '700',
    color: '#4B5563',
    transform: [{ rotate: '-90deg' }],
    width: 60,
    textAlign: 'center',
  },
  refundBoxContent: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
  },
  refundBoxTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 3,
  },
  refundBoxBody: {
    fontSize: 10,
    color: '#6B7280',
    lineHeight: 12,
  },
  totalRefundHighlightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    backgroundColor: '#ECFDF5',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#A7F3D0',
    marginBottom: 14,
  },
  totalRefundText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#065F46',
  },
  totalRefundPriceText: {
    color: '#10B981',
    fontWeight: '900',
    fontSize: 16,
  },
  premiumBullets: {
    gap: 8,
    marginBottom: 16,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
  },
  bulletDot: {
    fontSize: 12,
    color: '#4B5563',
    lineHeight: 16,
  },
  bulletText: {
    fontSize: 11,
    color: '#4B5563',
    flex: 1,
    lineHeight: 15,
  },
  knowMoreLink: {
    color: '#1D9BF0',
    fontWeight: '700',
  },
  add3xCheckboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  add3xCheckboxText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
  },
  premiumFreeCancelCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
    shadowColor: 'rgba(0,0,0,0.06)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 3,
  },
  premiumFreeCancelHeader: {
    paddingHorizontal: 14,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  premiumFreeCancelBody: {
    padding: 14,
  },
});
