import { useMemo, useState, useEffect } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  BackHandler,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { TrainFloatingBot } from '@/src/components/train/train-floating-bot';
import { IrctcLogoMark } from '@/src/components/train/train-logos';
import { popularTrainStations, type TrainStation } from '@/src/lib/train-stations';
import { useTrainSearchStore, type RecentBooking, type RecentSearch } from '@/src/store/train-search-store';

function startOfDay(date: Date) {
  const nextDate = new Date(date);
  nextDate.setHours(0, 0, 0, 0);
  return nextDate;
}

export default function TrainScreen() {
  // Store destructuring
  const { 
    from, 
    to, 
    setFrom, 
    setTo, 
    recentBookings, 
    recentSearches, 
    addRecentSearch 
  } = useTrainSearchStore();

  useEffect(() => {
    const handleBackPress = () => {
      router.replace('/(home)' as any);
      return true;
    };
    const subscription = BackHandler.addEventListener('hardwareBackPress', handleBackPress);
    return () => {
      subscription.remove();
    };
  }, []);

  const defaultFrom = popularTrainStations.find((station) => station.code === 'SBC') ?? popularTrainStations[5];
  const defaultTo = popularTrainStations.find((station) => station.code === 'ADI') ?? popularTrainStations[7];

  const [departureDate, setDepartureDate] = useState(() => {
    const today = new Date();
    today.setDate(today.getDate() + 1); // Default to tomorrow
    return today;
  });

  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [calendarSearchQuery, setCalendarSearchQuery] = useState('');

  const formattedDate = useMemo(
    () =>
      departureDate.toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
      }),
    [departureDate],
  );
  
  const formattedDay = useMemo(
    () =>
      departureDate.toLocaleDateString('en-US', {
        weekday: 'long',
      }),
    [departureDate],
  );

  const handleQuickDate = (daysAhead: number) => {
    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + daysAhead);
    setDepartureDate(nextDate);
  };

  const isQuickDateActive = (daysAhead: number) => {
    const nextDate = new Date();
    nextDate.setHours(0, 0, 0, 0);
    nextDate.setDate(nextDate.getDate() + daysAhead);

    const selectedDate = new Date(departureDate);
    selectedDate.setHours(0, 0, 0, 0);

    return selectedDate.getTime() === nextDate.getTime();
  };

  const calendarToday = useMemo(() => startOfDay(new Date()), []);
  const calendarMaxDate = useMemo(() => {
    const maxDate = new Date(calendarToday);
    maxDate.setMonth(maxDate.getMonth() + 3);
    maxDate.setHours(23, 59, 59, 999);
    return maxDate;
  }, [calendarToday]);

  // Generate 3 months starting from current month
  const monthsToRender = useMemo(() => {
    const list = [];
    const today = new Date();
    for (let i = 0; i < 3; i++) {
      list.push(new Date(today.getFullYear(), today.getMonth() + i, 1));
    }
    return list;
  }, []);

  // Generate day cells dynamically (Monday start matching Screenshot 5)
  const getMonthCells = (monthDate: Date) => {
    const year = monthDate.getFullYear();
    const month = monthDate.getMonth();
    const monthStart = new Date(year, month, 1);
    
    // Map Sunday (0) to 6, Monday (1) to 0, Tuesday (2) to 1, etc.
    const leadingDays = monthStart.getDay() === 0 ? 6 : monthStart.getDay() - 1;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const cells: (Date | null)[] = Array(leadingDays).fill(null);
    for (let d = 1; d <= daysInMonth; d++) {
      cells.push(new Date(year, month, d));
    }
    return cells;
  };

  const isDateDisabled = (date: Date) => date < calendarToday || date > calendarMaxDate;

  const isSameDay = (left: Date, right: Date) => {
    return (
      left.getFullYear() === right.getFullYear() &&
      left.getMonth() === right.getMonth() &&
      left.getDate() === right.getDate()
    );
  };

  const openCalendar = () => {
    setIsCalendarOpen(true);
  };

  const selectCalendarDate = (date: Date) => {
    if (isDateDisabled(date)) return;
    const nextDate = new Date(date);
    nextDate.setHours(12, 0, 0, 0);
    setDepartureDate(nextDate);
    setIsCalendarOpen(false);
  };

  const handleSearch = () => {
    const selectedFrom = from ?? defaultFrom;
    const selectedTo = to ?? defaultTo;

    // Log the current search to recent searches list
    addRecentSearch({
      id: 'rs-' + Math.random().toString(36).substring(2, 9),
      fromCode: selectedFrom.code,
      fromCity: selectedFrom.city,
      toCode: selectedTo.code,
      toCity: selectedTo.city,
      dateText: formattedDate + ' ' + departureDate.getFullYear().toString().substring(2),
    });

    router.push({
      pathname: '/train-results',
      params: {
        fromCode: selectedFrom.code,
        fromName: selectedFrom.city,
        toCode: selectedTo.code,
        toName: selectedTo.city,
        date: departureDate.toISOString(),
      },
    });
  };

  // Restores search selections from recent searches horizontal pills and immediately triggers train search
  const handleRecentSearchSelect = (search: RecentSearch) => {
    const restoredFrom = popularTrainStations.find(s => s.code === search.fromCode || s.city === search.fromCity);
    const restoredTo = popularTrainStations.find(s => s.code === search.toCode || s.city === search.toCity);
    
    const selectedFrom = restoredFrom ?? defaultFrom;
    const selectedTo = restoredTo ?? defaultTo;

    if (restoredFrom) setFrom(restoredFrom);
    if (restoredTo) setTo(restoredTo);

    router.push({
      pathname: '/train-results',
      params: {
        fromCode: selectedFrom.code,
        fromName: selectedFrom.city,
        toCode: selectedTo.code,
        toName: selectedTo.city,
        date: departureDate.toISOString(),
      },
    });
  };

  const fromLine = from ? `${from.city}, ${from.name}` : 'Enter City, Station name or Station code';
  const toLine = to ? `${to.city}, ${to.name}` : 'Enter City, Station name or Station code';

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.screen}>
        
        {/* Top Header */}
        <View style={styles.header}>
          <Pressable hitSlop={12} onPress={() => router.replace('/(home)' as any)} style={styles.backBtn}>
            <MaterialCommunityIcons color="#151515" name="arrow-left" size={22} />
          </Pressable>
          <Text style={styles.headerTitle}>Trains Search</Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          
          {/* Main search cards input block */}
          <View style={styles.searchPanel}>
            <Pressable onPress={() => router.push('/train-station?field=from')} style={styles.fieldCard}>
              <View style={styles.fieldIconWrap}>
                <View style={styles.filledDot} />
                <View style={styles.fieldLine} />
                <View style={styles.openDot} />
              </View>
              <View style={styles.fieldBody}>
                <Text style={styles.fieldLabel}>From</Text>
                <Text numberOfLines={1} style={[styles.fieldValue, !from && styles.fieldPlaceholder]}>
                  {fromLine}
                </Text>
              </View>
            </Pressable>

            {/* Interchange button wrapper */}
            <View style={styles.interchangeRow}>
              <Pressable
                hitSlop={10}
                onPress={() => {
                  const currentFrom = from ?? defaultFrom;
                  const currentTo = to ?? defaultTo;
                  setFrom(currentTo);
                  setTo(currentFrom);
                }}
                style={styles.swapButton}
              >
                <MaterialCommunityIcons color="#1697F6" name="swap-vertical" size={20} />
              </Pressable>
            </View>

            <Pressable onPress={() => router.push('/train-station?field=to')} style={styles.fieldCard}>
              <View style={styles.fieldIconWrap}>
                <View style={styles.openDot} />
                <View style={styles.fieldLine} />
                <View style={styles.filledDot} />
              </View>
              <View style={styles.fieldBody}>
                <Text style={styles.fieldLabel}>To</Text>
                <Text numberOfLines={1} style={[styles.fieldValue, !to && styles.fieldPlaceholder]}>
                  {toLine}
                </Text>
              </View>
            </Pressable>

            {/* Date selector with quick tomorrow / day after buttons */}
            <View style={styles.dateCard}>
              <View style={styles.dateLeftWrap}>
                <Pressable onPress={openCalendar} style={styles.dateLeft}>
                  <View style={styles.calendarIcon}>
                    <MaterialCommunityIcons color="#7B7B7B" name="calendar-month-outline" size={22} />
                  </View>
                  <View>
                    <Text style={styles.dateLabel}>DATE</Text>
                    <Text style={styles.dateValue}>{formattedDate}</Text>
                    <Text style={styles.dateWeekday}>{formattedDay}</Text>
                  </View>
                </Pressable>
              </View>

              <View style={styles.quickButtonsRow}>
                <Pressable
                  onPress={() => handleQuickDate(1)}
                  style={[styles.quickDateButton, isQuickDateActive(1) && styles.quickDateButtonActive]}
                >
                  <Text
                    style={[styles.quickDateButtonText, isQuickDateActive(1) && styles.quickDateButtonTextActive]}
                  >
                    Tomorrow
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => handleQuickDate(2)}
                  style={[styles.quickDateButton, isQuickDateActive(2) && styles.quickDateButtonActive]}
                >
                  <Text
                    style={[styles.quickDateButtonText, isQuickDateActive(2) && styles.quickDateButtonTextActive]}
                  >
                    Day After
                  </Text>
                </Pressable>
              </View>
            </View>

            {/* Free Cancellation strip in main panel */}
            <View style={styles.refundCard}>
              <View style={styles.checkbox}>
                <MaterialCommunityIcons color="#1697F6" name="check" size={18} />
              </View>
              <View style={styles.cancellationTextWrap}>
                <Text style={styles.cancellationTitle}>Add Free Cancellation and get full fare refund</Text>
                <Text style={styles.cancellationSubtitle}>Zero cancellation fee on all bookings</Text>
              </View>
              <View style={styles.shieldWrap}>
                <MaterialCommunityIcons color="#1697F6" name="shield-check" size={26} />
              </View>
            </View>

            {/* Search Trigger */}
            <Pressable onPress={handleSearch} style={styles.searchButton}>
              <Text style={styles.searchButtonText}>SEARCH</Text>
            </Pressable>

            {/* IRCTC partner logo */}
            <View style={styles.partnerRow}>
              <IrctcLogoMark size={28} />
              <Text style={styles.partnerText}>IRCTC Authorised Partner</Text>
            </View>
          </View>

          {/* OFFERS Section (Screenshot 1) */}
          <View style={styles.offersSection}>
            <View style={styles.offersHeader}>
              <MaterialCommunityIcons color="#A855F7" name="tag-outline" size={18} />
              <Text style={styles.offersTitleText}>OFFERS</Text>
            </View>
            
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.offersScrollContainer}>
              <View style={styles.offerItemCard}>
                <Image 
                  source={{ uri: 'https://images.unsplash.com/photo-1532274402911-5a369e4c4bb5?q=80&w=400&auto=format&fit=crop' }} 
                  style={styles.offerCardImage}
                />
                <View style={styles.offerTextOverlay}>
                  <View style={styles.offerCardHeader}>
                    <View style={styles.offerBadgeLabel}>
                      <Text style={styles.offerBadgeText}>TRAINS</Text>
                    </View>
                    <View style={styles.offerPillIconWrap}>
                      <MaterialCommunityIcons color="#EF4444" name="pill" size={12} />
                      <Text style={styles.offerPillText}>TAKE A CHILL PILL</Text>
                    </View>
                  </View>
                  <Text style={styles.offerCardTitle}>ESCAPE TO THE HILLS:</Text>
                  <Text style={styles.offerCardDesc}>Grab Up to ₹500 OFF* on Alternate Trip Plan for trains</Text>
                  <View style={styles.offerCodeContainer}>
                    <Text style={styles.offerCodeText}>USE CODE: MMTSUMMER</Text>
                  </View>
                </View>
              </View>

              <View style={styles.offerItemCard}>
                <Image 
                  source={{ uri: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=400&auto=format&fit=crop' }} 
                  style={styles.offerCardImage}
                />
                <View style={styles.offerTextOverlay}>
                  <View style={styles.offerCardHeader}>
                    <View style={styles.offerBadgeLabel}>
                      <Text style={styles.offerBadgeText}>TRAINS</Text>
                    </View>
                    <Text style={styles.offerTopMutedText}>DON'T MISS!</Text>
                  </View>
                  <Text style={styles.offerCardTitle}>For Rath Yatra Train Bookings</Text>
                  <Text style={styles.offerCardDesc}>FLAT ₹50 OFF* on selected routes</Text>
                  <View style={styles.offerCodeContainer}>
                    <Text style={styles.offerCodeText}>USE CODE: SUMMERTRIP</Text>
                  </View>
                </View>
              </View>

              <View style={styles.offerItemCard}>
                <Image 
                  source={{ uri: 'https://images.unsplash.com/photo-1557223562-6c77ef16210f?q=80&w=400&auto=format&fit=crop' }} 
                  style={styles.offerCardImage}
                />
                <View style={styles.offerTextOverlay}>
                  <View style={styles.offerCardHeader}>
                    <View style={[styles.offerBadgeLabel, { backgroundColor: '#F59E0B' }]}>
                      <Text style={styles.offerBadgeText}>TATKAL</Text>
                    </View>
                  </View>
                  <Text style={styles.offerCardTitle}>OTP-based Authentication</Text>
                  <Text style={styles.offerCardDesc}>Platform Now Mandatory for Tatkal Bookings</Text>
                  <View style={[styles.offerCodeContainer, { borderColor: '#F59E0B' }]}>
                    <Text style={[styles.offerCodeText, { color: '#F59E0B' }]}>SECURE BOOKING</Text>
                  </View>
                </View>
              </View>

              <View style={styles.offerItemCard}>
                <Image 
                  source={{ uri: 'https://images.unsplash.com/photo-1506013391225-e12fe755e334?q=80&w=400&auto=format&fit=crop' }} 
                  style={styles.offerCardImage}
                />
                <View style={styles.offerTextOverlay}>
                  <View style={styles.offerCardHeader}>
                    <View style={[styles.offerBadgeLabel, { backgroundColor: '#10B981' }]}>
                      <Text style={styles.offerBadgeText}>REFUND</Text>
                    </View>
                  </View>
                  <Text style={styles.offerCardTitle}>FOR TRAIN BOOKINGS</Text>
                  <Text style={styles.offerCardDesc}>Get a Confirmed Ticket or a 3x Refund with Alternate Trip</Text>
                  <View style={[styles.offerCodeContainer, { borderColor: '#10B981' }]}>
                    <Text style={[styles.offerCodeText, { color: '#10B981' }]}>GUARANTEED</Text>
                  </View>
                </View>
              </View>
            </ScrollView>
          </View>

          {/* Dynamic Recent Bookings strip (Screenshot 1 & 4) */}
          {recentBookings.length > 0 && (
            <View style={styles.recentBookingsSection}>
              <View style={styles.recentBookingsHeader}>
                <MaterialCommunityIcons color="#374151" name="clock-outline" size={18} />
                <Text style={styles.recentBookingsTitle}>RECENT BOOKINGS (LAST 12 HOURS)</Text>
              </View>
              
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.bookingsScrollRow}>
                {recentBookings.map((booking) => {
                  const isCancelled = booking.cancelled;
                  return (
                    <Pressable 
                      key={booking.id} 
                      onPress={() => router.push({
                        pathname: isCancelled ? '/train-cancellation' : '/train-confirmation',
                        params: { bookingId: booking.id }
                      } as any)}
                      style={[
                        styles.successfulBookingCard,
                        isCancelled && { backgroundColor: '#F9FAFB', borderColor: '#D1D5DB' }
                      ]}
                    >
                      <View style={[styles.bookingStatusRow, isCancelled && { borderBottomColor: '#E5E7EB' }]}>
                        <View style={styles.bookingStatusLeft}>
                          <Text style={[styles.statusSuccessText, isCancelled && { color: '#6B7280' }]}>
                            {isCancelled ? 'Booking Cancelled' : 'Booking Successful'}
                          </Text>
                          <MaterialCommunityIcons 
                            color={isCancelled ? '#9CA3AF' : '#10B981'} 
                            name={isCancelled ? 'close-circle' : 'check-circle'} 
                            size={16} 
                            style={{ marginLeft: 4 }} 
                          />
                        </View>
                        <Text style={[styles.bookingIdText, isCancelled && { color: '#4B5563' }]}>
                          Booking ID: {booking.bookingId.substring(0, 18)}
                        </Text>
                      </View>

                      <View style={styles.bookingDetailsRow}>
                        <View style={styles.bookingDetailsLeft}>
                          <Text style={[styles.bookingTrainNameText, isCancelled && { color: '#6B7280', textDecorationLine: 'line-through' }]}>
                            {booking.trainName}
                          </Text>
                          <Text style={styles.bookingRouteText}>
                            {booking.routeText}  |  {booking.dateText}  |  <Text style={[styles.bookingPriceBold, isCancelled && { color: '#6B7280' }]}>{booking.priceText}</Text>
                          </Text>
                          
                          {!isCancelled && booking.freeCancellation && (
                            <View style={styles.applicableShieldRow}>
                              <MaterialCommunityIcons color="#1697F6" name="shield-check" size={15} />
                              <Text style={styles.applicableShieldText}>Free cancellation Applicable</Text>
                            </View>
                          )}
                          {isCancelled && (
                            <View style={styles.applicableShieldRow}>
                              <MaterialCommunityIcons color="#EF4444" name="close-circle-outline" size={15} />
                              <Text style={[styles.applicableShieldText, { color: '#EF4444' }]}>Cancelled</Text>
                            </View>
                          )}
                        </View>

                        <View style={styles.bookingDetailsRight}>
                          <MaterialCommunityIcons color={isCancelled ? '#9CA3AF' : '#1697F6'} name="chevron-right" size={24} />
                        </View>
                      </View>
                    </Pressable>
                  );
                })}
              </ScrollView>
            </View>
          )}

          {/* Features Carousel (Screenshot 2) */}
          <View style={styles.featuresSection}>
            <Text style={styles.sectionHeadingText}>Features Our Users Love</Text>
            <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false} contentContainerStyle={styles.featuresCarouselScroll}>
              <View style={styles.featureItemCard}>
                <View style={styles.featureItemLeft}>
                  <Text style={styles.introducingPill}>INTRODUCING</Text>
                  <Text style={styles.featureMainTitle}>Connected Travel</Text>
                  <Text style={styles.featureDescBody}>
                    Find Alternative Multi-leg Travel Options for your route when direct trains are unavailable.
                  </Text>
                  <Pressable onPress={() => Alert.alert('Connected Travel', 'This feature allows you to combine multiple train routes to reach your destination.')} style={styles.knowMoreBtn}>
                    <Text style={styles.knowMoreText}>DISCOVER</Text>
                  </Pressable>
                </View>
                <View style={[styles.featureItemRight, { justifyContent: 'center', alignItems: 'center' }]}>
                  <View style={styles.connectedIllustration}>
                    <MaterialCommunityIcons color="#3B82F6" name="transit-connection-variant" size={48} />
                  </View>
                </View>
              </View>

              <View style={[styles.featureItemCard, { backgroundColor: '#FFFDF5', borderColor: '#FEF3C7', marginLeft: 12 }]}>
                <View style={styles.featureItemLeft}>
                  <Text style={[styles.introducingPill, { color: '#D97706', backgroundColor: '#FEF3C7' }]}>INTRODUCING</Text>
                  <Text style={styles.featureMainTitle}>Food On Train</Text>
                  <Text style={styles.featureDescBody}>
                    Order Food On Train & Get it delivered to your seat. Get Rs. 100 Off!
                  </Text>
                  <Pressable onPress={() => Alert.alert('Food Service', 'Food delivery on train reservation is fully activated next.')} style={styles.knowMoreBtn}>
                    <Text style={styles.knowMoreText}>KNOW MORE</Text>
                  </Pressable>
                </View>
                <View style={styles.featureItemRight}>
                  {/* Styled mock vector illustration representing food package carton bag */}
                  <View style={styles.foodIllustrationBag}>
                    <MaterialCommunityIcons color="#E0A96D" name="package-variant" size={54} />
                    <View style={styles.foodBagHandle} />
                  </View>
                </View>
              </View>

              <View style={[styles.featureItemCard, { backgroundColor: '#F0FDF4', borderColor: '#DCFCE7', marginLeft: 12 }]}>
                <View style={styles.featureItemLeft}>
                  <Text style={[styles.introducingPill, { color: '#16A34A', backgroundColor: '#DCFCE7' }]}>POPULAR</Text>
                  <Text style={styles.featureMainTitle}>Confirmed Ticket</Text>
                  <Text style={styles.featureDescBody}>
                    Get a Confirmed Ticket or a 3x Refund with our Alternate Trip Feature.
                  </Text>
                  <Pressable onPress={() => Alert.alert('Alternate Trip Guarantee', 'We search for alternative routes to ensure you get a confirmed seat, or refund 3x your fare.')} style={styles.knowMoreBtn}>
                    <Text style={styles.knowMoreText}>LEARN MORE</Text>
                  </Pressable>
                </View>
                <View style={[styles.featureItemRight, { justifyContent: 'center', alignItems: 'center' }]}>
                  <View style={styles.connectedIllustration}>
                    <MaterialCommunityIcons color="#16A34A" name="shield-check-outline" size={48} />
                  </View>
                </View>
              </View>
            </ScrollView>
            
            {/* Pagination dots under features carousel */}
            <View style={styles.paginationRow}>
              <View style={[styles.pagDot, styles.pagDotActive]} />
              <View style={styles.pagDot} />
              <View style={styles.pagDot} />
              <View style={styles.pagDot} />
              <View style={styles.pagDot} />
              <View style={styles.pagDot} />
            </View>
          </View>

          {/* Aadhaar to IRCTC Tatkal linkage banner (Screenshot 2) */}
          <View style={styles.aadhaarCardContainer}>
            <View style={styles.aadhaarCardTopRow}>
              <View style={styles.aadhaarCardTextWrap}>
                <Text style={styles.aadhaarCardTitle}>Link Aadhaar to IRCTC for tatkal booking</Text>
                <Text style={styles.aadhaarCardSubtitle}>Mandatory from 1 Jul 25</Text>
              </View>
              
              <View style={styles.aadhaarVisualsGroup}>
                <View style={styles.aadhaarCircularAvatar}>
                  <MaterialCommunityIcons color="#EA580C" name="fingerprint" size={22} />
                  <Text style={styles.tinyAadhaarLabel}>AADHAAR</Text>
                </View>
                <View style={styles.dottedConnector}>
                  <View style={styles.dottedDot} />
                  <View style={styles.dottedDot} />
                  <View style={styles.dottedDot} />
                </View>
                <View style={styles.irctcCircularAvatar}>
                  <IrctcLogoMark size={20} />
                  <Text style={styles.tinyIrctcLabel}>IRCTC</Text>
                </View>
              </View>
            </View>
            <Pressable 
              onPress={() => Alert.alert('Aadhaar Linkage', 'Opening secure IRCTC portal to link your Aadhaar card...')} 
              style={styles.linkAadhaarButton}
            >
              <Text style={styles.linkAadhaarButtonText}>Link Aadhaar</Text>
            </Pressable>
          </View>

          {/* Why Book With Us columns (Screenshot 2) */}
          <View style={styles.whyUsSection}>
            <Text style={styles.sectionHeadingText}>Why Book With Us?</Text>
            <View style={styles.whyUsGrid}>
              <View style={[styles.whyUsCard, { backgroundColor: '#FFF5F0' }]}>
                <Text style={styles.whyUsCardTitle}>Trusted by over 50 Lac Users</Text>
                <View style={styles.whyUsIconWrap}>
                  <MaterialCommunityIcons color="#EF4444" name="account-group" size={26} />
                </View>
              </View>
              
              <View style={[styles.whyUsCard, { backgroundColor: '#F0F5FF' }]}>
                <Text style={styles.whyUsCardTitle}>Get 24x7 dedicated support</Text>
                <View style={styles.whyUsIconWrap}>
                  <MaterialCommunityIcons color="#3B82F6" name="headphones" size={26} />
                </View>
              </View>
            </View>
          </View>

          {/* Return Trip Widget (Screenshot 2) */}
          <View style={styles.sectionCardGeneral}>
            <Pressable 
              onPress={() => {
                const currentFrom = from ?? defaultFrom;
                const currentTo = to ?? defaultTo;
                // Swap targets for return
                setFrom(currentTo);
                setTo(currentFrom);
                Alert.alert('Return Trip Selected', `Search direction flipped to:\n${currentTo.city} → ${currentFrom.city}`);
              }} 
              style={styles.returnTripCard}
            >
              <View style={styles.returnTripLeft}>
                <View style={styles.swapRoundWrap}>
                  <MaterialCommunityIcons color="#3B82F6" name="swap-horizontal" size={18} />
                </View>
                <View style={styles.returnTripTexts}>
                  <Text style={styles.returnTripLabel}>BOOK YOUR RETURN TRIP</Text>
                  <Text style={styles.returnTripRouteText}>
                    {to ? to.city : defaultTo.city} Jn  →  {from ? from.city : defaultFrom.city} Road
                  </Text>
                </View>
              </View>
              <MaterialCommunityIcons color="#1697F6" name="chevron-right" size={24} />
            </Pressable>
          </View>

          {/* Announcements Card (Screenshot 2) */}
          <View style={styles.sectionCardGeneral}>
            <View style={styles.announcementsHeader}>
              <MaterialCommunityIcons color="#F59E0B" name="bullhorn" size={18} />
              <Text style={styles.announcementsTitleText}>ANNOUNCEMENTS</Text>
            </View>
            <View style={styles.announcementsBodyBox}>
              <Text style={styles.announcementBodyText}>
                Chart preparation will now happen 8 hours before departure as per Indian Railways directive.
              </Text>
            </View>
          </View>

          {/* Recent Searches horizontal pillars list (Screenshot 3) */}
          {recentSearches.length > 0 && (
            <View style={styles.recentSearchesSection}>
              <View style={styles.recentSearchesHeader}>
                <MaterialCommunityIcons color="#374151" name="magnify" size={18} />
                <Text style={styles.recentSearchesTitle}>RECENT SEARCHES</Text>
              </View>

              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.searchesScrollContainer}>
                {recentSearches.map((search) => (
                  <Pressable 
                    key={search.id} 
                    onPress={() => handleRecentSearchSelect(search)}
                    style={styles.recentSearchPillCard}
                  >
                    <Text style={styles.searchRouteText}>
                      {search.fromCity}  →  {search.toCity}
                    </Text>
                    <Text style={styles.searchDateText}>{search.dateText}</Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          )}



        </ScrollView>

        {/* ================= MODAL DATE CALENDAR DIALOG ================= */}

        {/* Upgraded full screen Date Picker Calendar (Screenshot 5) */}
        <Modal
          visible={isCalendarOpen}
          transparent={false}
          animationType="slide"
          onRequestClose={() => setIsCalendarOpen(false)}
        >
          <SafeAreaView style={styles.calendarModalContainer}>
            
            {/* Calendar modal header */}
            <View style={styles.calendarHeaderRow}>
              <Pressable hitSlop={12} onPress={() => setIsCalendarOpen(false)} style={styles.calendarBackArrowBtn}>
                <MaterialCommunityIcons color="#111827" name="arrow-left" size={26} />
              </Pressable>
              <Text style={styles.calendarModalHeaderTitle}>Select Date</Text>
            </View>

            {/* Week days abbreviated row headings */}
            <View style={styles.calendarWeekdayTitlesRow}>
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((dayAbbrev) => (
                <Text key={dayAbbrev} style={styles.weekdayLabelHeader}>
                  {dayAbbrev}
                </Text>
              ))}
            </View>

            {/* Scrollable vertical calendar grid list of months */}
            <ScrollView showsVerticalScrollIndicator={true} contentContainerStyle={styles.calendarMonthsScrollList}>
              {monthsToRender.map((monthDate) => {
                const monthTitleString = monthDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
                const dayCells = getMonthCells(monthDate);

                return (
                  <View key={monthDate.toISOString()} style={styles.calendarMonthBlock}>
                    {/* Month Heading */}
                    <Text style={styles.calendarMonthHeading}>{monthTitleString}</Text>

                    {/* Month Days Grid */}
                    <View style={styles.daysGridContainer}>
                      {dayCells.map((cell, index) => {
                        if (!cell) {
                          return <View key={`blank-${monthDate.toISOString()}-${index}`} style={styles.dayGridCellBlank} />;
                        }

                        const disabled = isDateDisabled(cell);
                        const selected = isSameDay(cell, departureDate);

                        return (
                          <Pressable
                            key={cell.toISOString()}
                            disabled={disabled}
                            onPress={() => selectCalendarDate(cell)}
                            style={[
                              styles.dayGridCellActive,
                              selected && styles.dayGridCellSelected,
                              disabled && styles.dayGridCellDisabled,
                            ]}
                          >
                            <Text style={[
                              styles.dayCellTextLabel,
                              selected && styles.dayCellTextSelected,
                              disabled && styles.dayCellTextDisabled,
                            ]}>
                              {cell.getDate()}
                            </Text>
                          </Pressable>
                        );
                      })}
                    </View>
                  </View>
                );
              })}
            </ScrollView>

          </SafeAreaView>
        </Modal>

        <TrainFloatingBot bottom={32} />
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
    height: 56,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    marginLeft: 12,
    fontSize: 17,
    fontWeight: '800',
    color: '#151515',
  },
  scrollContent: {
    paddingBottom: 120,
  },
  searchPanel: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  fieldCard: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 11,
  },
  fieldIconWrap: {
    width: 24,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  filledDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#1697F6',
  },
  fieldLine: {
    width: 8,
    height: 2,
    backgroundColor: '#CFCFCF',
  },
  openDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#1697F6',
    backgroundColor: '#FFFFFF',
  },
  fieldBody: {
    flex: 1,
    marginLeft: 10,
  },
  fieldLabel: {
    fontSize: 10,
    color: '#9CA3AF',
    marginBottom: 3,
    fontWeight: '700',
  },
  fieldValue: {
    fontSize: 15,
    lineHeight: 18,
    fontWeight: '800',
    color: '#111827',
  },
  fieldPlaceholder: {
    color: '#111827',
  },
  interchangeRow: {
    height: 14,
    alignItems: 'flex-end',
    paddingRight: 32,
    zIndex: 10,
  },
  swapButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -9,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  dateCard: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 11,
    marginTop: 10,
    marginBottom: 10,
    gap: 10,
  },
  dateLeftWrap: {
    flex: 1,
    minWidth: 0,
  },
  dateLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  calendarIcon: {
    width: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  dateLabel: {
    fontSize: 10,
    color: '#9CA3AF',
    marginBottom: 3,
    fontWeight: '700',
  },
  dateValue: {
    fontSize: 15.5,
    fontWeight: '900',
    color: '#111827',
  },
  dateWeekday: {
    fontSize: 10,
    color: '#6B7280',
    marginTop: 2,
    fontWeight: '600',
  },
  quickButtonsRow: {
    flexDirection: 'row',
    gap: 6,
  },
  quickDateButton: {
    minHeight: 34,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickDateButtonActive: {
    borderColor: '#1697F6',
    backgroundColor: '#EAF7FF',
  },
  quickDateButtonText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#4B5563',
  },
  quickDateButtonTextActive: {
    color: '#1697F6',
  },
  refundCard: {
    borderWidth: 1,
    borderColor: '#CFEAFF',
    borderRadius: 12,
    backgroundColor: '#F0F9FF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 14,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#1697F6',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  cancellationTextWrap: {
    flex: 1,
    paddingRight: 6,
  },
  cancellationTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#111827',
  },
  cancellationSubtitle: {
    fontSize: 10,
    color: '#6B7280',
    marginTop: 2,
    fontWeight: '600',
  },
  shieldWrap: {
    width: 26,
    height: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchButton: {
    height: 48,
    borderRadius: 10,
    backgroundColor: '#1697F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  partnerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingTop: 14,
  },
  partnerText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#6B7280',
  },

  // Dynamic Completed Bookings Cards (Screenshot 1 & 4)
  recentBookingsSection: {
    marginTop: 10,
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E5E7EB',
  },
  recentBookingsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 6,
    marginBottom: 12,
  },
  recentBookingsTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#374151',
    letterSpacing: 0.5,
  },
  bookingsScrollRow: {
    paddingHorizontal: 16,
    gap: 12,
  },
  successfulBookingCard: {
    width: 328,
    backgroundColor: '#EAFBF7',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  bookingStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#D1FAE5',
    paddingBottom: 8,
    marginBottom: 8,
  },
  bookingStatusLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusSuccessText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F766E',
  },
  bookingIdText: {
    fontSize: 10,
    color: '#065F46',
    fontWeight: '700',
  },
  bookingDetailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bookingDetailsLeft: {
    flex: 1,
  },
  bookingTrainNameText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#111827',
  },
  bookingRouteText: {
    marginTop: 4,
    fontSize: 11,
    color: '#4B5563',
    fontWeight: '700',
  },
  bookingPriceBold: {
    fontWeight: '900',
    color: '#111827',
  },
  applicableShieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 4,
  },
  applicableShieldText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#1697F6',
  },
  bookingDetailsRight: {
    paddingLeft: 8,
  },

  // Carousel & widget Styles
  featuresSection: {
    marginTop: 10,
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E5E7EB',
  },
  sectionHeadingText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1F2937',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  featuresCarouselScroll: {
    paddingHorizontal: 16,
  },
  featureItemCard: {
    width: 328,
    backgroundColor: '#FFF8F4',
    borderWidth: 1,
    borderColor: '#FDE6D8',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureItemLeft: {
    flex: 1,
    paddingRight: 6,
  },
  introducingPill: {
    fontSize: 9,
    fontWeight: '800',
    color: '#E07A5F',
    backgroundColor: '#FFF0E8',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 6,
  },
  featureMainTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#111827',
  },
  featureDescBody: {
    fontSize: 11,
    lineHeight: 15,
    color: '#4B5563',
    marginTop: 4,
    fontWeight: '700',
  },
  knowMoreBtn: {
    marginTop: 10,
    backgroundColor: '#1697F6',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignSelf: 'flex-start',
  },
  knowMoreText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  featureItemRight: {
    width: 72,
    alignItems: 'center',
  },
  foodIllustrationBag: {
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  foodBagHandle: {
    width: 14,
    height: 6,
    borderWidth: 2,
    borderColor: '#E0A96D',
    borderBottomWidth: 0,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    position: 'absolute',
    top: 2,
  },
  paginationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    marginTop: 12,
  },
  pagDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#D1D5DB',
  },
  pagDotActive: {
    backgroundColor: '#6B7280',
    width: 8,
  },
  sectionCardGeneral: {
    marginTop: 10,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E5E7EB',
  },
  tatkalAadhaarCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tatkalTexts: {
    flex: 1.2,
    paddingRight: 6,
  },
  tatkalTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#111827',
  },
  tatkalSubtitle: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 2,
    fontWeight: '600',
  },
  aadhaarVisualsRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  aadhaarCircularAvatar: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEF3C7',
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  tinyAadhaarLabel: {
    fontSize: 6,
    fontWeight: '800',
    color: '#D97706',
    marginTop: 1,
  },
  dashedConnectorLine: {
    flex: 0.5,
    borderWidth: 0.75,
    borderStyle: 'dashed',
    borderColor: '#3B82F6',
    marginHorizontal: 2,
  },
  irctcCircularAvatar: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EFF6FF',
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  tinyIrctcLabel: {
    fontSize: 6,
    fontWeight: '800',
    color: '#1D4ED8',
    marginTop: 1,
  },
  linkAadharButton: {
    marginTop: 14,
    height: 38,
    borderRadius: 6,
    backgroundColor: '#1697F6',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 18,
  },
  linkAadharBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  whyUsSection: {
    marginTop: 10,
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E5E7EB',
  },
  whyUsGrid: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
  },
  whyUsCard: {
    flex: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    minHeight: 86,
    justifyContent: 'space-between',
  },
  whyUsCardTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#111827',
    lineHeight: 16,
  },
  whyUsIconWrap: {
    alignSelf: 'flex-end',
  },
  returnTripCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  returnTripLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  swapRoundWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  returnTripTexts: {
    flex: 1,
  },
  returnTripLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#1697F6',
  },
  returnTripRouteText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#111827',
    marginTop: 2,
  },
  announcementsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  announcementsTitleText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#374151',
    letterSpacing: 0.5,
  },
  announcementsBodyBox: {
    backgroundColor: '#FFF7F7',
    borderWidth: 0.5,
    borderColor: '#FEE2E2',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  announcementBodyText: {
    fontSize: 12,
    lineHeight: 16,
    color: '#B91C1C',
    fontWeight: '700',
  },

  // Recent Searches row (Screenshot 3)
  recentSearchesSection: {
    marginTop: 10,
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E5E7EB',
  },
  recentSearchesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 6,
    marginBottom: 10,
  },
  recentSearchesTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#374151',
  },
  searchesScrollContainer: {
    paddingHorizontal: 16,
    gap: 10,
  },
  recentSearchPillCard: {
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    minWidth: 120,
    alignItems: 'center',
  },
  searchRouteText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#111827',
  },
  searchDateText: {
    marginTop: 4,
    fontSize: 10,
    color: '#6B7280',
    fontWeight: '700',
  },
  // Relocated OFFERS Section (Screenshot 1)
  offersSection: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  offersHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 6,
    marginBottom: 12,
  },
  offersTitleText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#1F2937',
    letterSpacing: 0.5,
  },
  offersScrollContainer: {
    paddingHorizontal: 16,
    gap: 12,
  },
  offerItemCard: {
    width: 290,
    height: 146,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  offerCardImage: {
    width: '100%',
    height: '100%',
    opacity: 0.85,
  },
  offerTextOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    paddingHorizontal: 14,
    paddingVertical: 12,
    justifyContent: 'space-between',
  },
  offerCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  offerBadgeLabel: {
    backgroundColor: '#1697F6',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 4,
  },
  offerBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  offerPillIconWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    borderWidth: 0.5,
    borderColor: '#EF4444',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    gap: 3,
  },
  offerPillText: {
    color: '#FCA5A5',
    fontSize: 8,
    fontWeight: '800',
  },
  offerTopMutedText: {
    color: '#E2E8F0',
    fontSize: 10,
    fontWeight: '900',
  },
  offerCardTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: '#FFFFFF',
    marginTop: 4,
  },
  offerCardDesc: {
    fontSize: 10,
    lineHeight: 13,
    color: '#F1F5F9',
    fontWeight: '600',
    marginTop: 2,
  },
  offerCodeContainer: {
    borderWidth: 1.2,
    borderColor: '#1697F6',
    borderStyle: 'dashed',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(22, 151, 246, 0.1)',
  },
  offerCodeText: {
    color: '#93C5FD',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.4,
  },

  // Expanded features Carousel illustrations
  connectedIllustration: {
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },

  // Redesigned Aadhaar block (Screenshot 2)
  aadhaarCardContainer: {
    backgroundColor: '#F3F8FF',
    borderWidth: 1.5,
    borderColor: '#E1EDFF',
    borderRadius: 14,
    marginHorizontal: 16,
    marginTop: 10,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  aadhaarCardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  aadhaarCardTextWrap: {
    flex: 1.3,
    paddingRight: 8,
  },
  aadhaarCardTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#111827',
    lineHeight: 18,
  },
  aadhaarCardSubtitle: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 4,
    fontWeight: '700',
  },
  aadhaarVisualsGroup: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 4,
  },
  dottedConnector: {
    flexDirection: 'row',
    gap: 3,
    alignItems: 'center',
  },
  dottedDot: {
    width: 3.5,
    height: 3.5,
    borderRadius: 1.75,
    backgroundColor: '#3B82F6',
  },
  linkAadhaarButton: {
    marginTop: 14,
    height: 36,
    borderRadius: 7,
    backgroundColor: '#1697F6',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 18,
  },
  linkAadhaarButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
  },

  // 4. Upgraded full screen Date Picker Calendar (Screenshot 5)
  calendarModalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  calendarHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  calendarBackArrowBtn: {
    padding: 4,
    marginRight: 14,
  },
  calendarModalHeaderTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
  },
  calendarWeekdayTitlesRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    backgroundColor: '#FAFAFA',
  },
  weekdayLabelHeader: {
    width: '14.2857%',
    textAlign: 'center',
    fontSize: 12,
    color: '#7B7B7B',
    fontWeight: '700',
  },
  calendarMonthsScrollList: {
    paddingVertical: 10,
  },
  calendarMonthBlock: {
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  calendarMonthHeading: {
    fontSize: 14,
    fontWeight: '800',
    color: '#111827',
    marginLeft: 8,
    marginBottom: 10,
    marginTop: 10,
  },
  daysGridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayGridCellBlank: {
    width: '14.2857%',
    height: 48,
  },
  dayGridCellActive: {
    width: '14.2857%',
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayGridCellSelected: {
    backgroundColor: '#1697F6',
    borderRadius: 4,
  },
  dayGridCellDisabled: {
    opacity: 0.15,
  },
  dayCellTextLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: '#111827',
  },
  dayCellTextSelected: {
    color: '#FFFFFF',
    fontWeight: '900',
  },
  dayCellTextDisabled: {
    color: '#9CA3AF',
  },
});
