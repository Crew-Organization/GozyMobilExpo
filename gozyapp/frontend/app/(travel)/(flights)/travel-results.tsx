import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Modal,
  Dimensions,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';

import { ScreenShell } from '@/src/components/screen-shell';
import { useSuperAppStore } from '@/src/store/super-app-store';
import { api } from '@/src/lib/api';
import { formatCurrency, formatTravelDate } from '@/src/lib/travel-data';
import { colors, radius, spacing, typography } from '@/src/theme/tokens';
import type { TravelOffer } from '@/src/types';

const { width } = Dimensions.get('window');

const sortOptions = [
  { id: 'cheapest', label: 'Sorted by:\nCheapest', icon: 'sort-variant' },
  { id: 'nonstop', label: 'Non Stop', icon: null },
  { id: 'refundable', label: 'Refundable Fares', icon: null },
  { id: 'filter', label: 'Filter', icon: 'tune' },
];

const fareCalendar = [
  { date: 'Fri, Apr 10', price: 11678, active: false },
  { date: 'Sat, Apr 11', price: 6646, active: true },
  { date: 'Sun, Apr 12', price: 6130, active: false },
  { date: 'Mon, Apr 13', price: 6130, active: false },
];

// Exact Mock Flights from screenshots
const exactMockFlights: TravelOffer[] = [
  {
    id: 'offer-exact-1',
    airline: 'Air India',
    airlineCode: 'AI',
    flightNumber: 'AI 2776',
    departTime: '23:30',
    arriveTime: '02:00',
    duration: '2h 30m',
    stops: 'Non-stop',
    price: 6646,
    originalPrice: 7500,
    seatsLeft: 9,
    cabinBag: '7 kg',
    checkInBag: '15 kg',
    refundLabel: 'Refundable',
    onTimeLabel: '90% on time',
    emissionsLabel: '10% lower CO2',
    tags: ['free Meal'],
  },
  {
    id: 'offer-exact-2',
    airline: 'IndiGo',
    airlineCode: '6E',
    flightNumber: '6E 543',
    departTime: '23:50',
    arriveTime: '02:20',
    duration: '2h 30m',
    stops: 'Non-stop',
    price: 6760,
    originalPrice: 7800,
    seatsLeft: 7,
    cabinBag: '7 kg',
    checkInBag: '15 kg',
    refundLabel: 'Refundable',
    onTimeLabel: '100% on time',
    emissionsLabel: '12% lower CO2',
    tags: ['Lock this price @ ₹ 359 →'],
  },
  {
    id: 'offer-exact-3',
    airline: 'Air India',
    airlineCode: 'AI',
    flightNumber: 'AI 2776',
    departTime: '12:45',
    arriveTime: '15:20',
    duration: '2h 35m',
    stops: 'Non-stop',
    price: 11698,
    originalPrice: 13000,
    seatsLeft: 5,
    cabinBag: '7 kg',
    checkInBag: '15 kg',
    refundLabel: 'Refundable',
    onTimeLabel: '93% on time',
    emissionsLabel: '10% lower CO2',
    tags: ['Free Hot Meal | Free Seat with VISA Signature', 'Lock this price @ ₹ 625 →'],
  },
  {
    id: 'offer-exact-4',
    airline: 'IndiGo',
    airlineCode: '6E',
    flightNumber: '6E 102',
    departTime: '05:20',
    arriveTime: '07:45',
    duration: '2h 25m',
    stops: 'Non-stop',
    price: 12535,
    originalPrice: 14000,
    seatsLeft: 8,
    cabinBag: '7 kg',
    checkInBag: '15 kg',
    refundLabel: 'Refundable',
    onTimeLabel: '100% on time',
    emissionsLabel: '12% lower CO2',
    tags: [],
  },
  {
    id: 'offer-exact-5',
    airline: 'Akasa Air',
    airlineCode: 'QP',
    flightNumber: 'QP 142',
    departTime: '06:00',
    arriveTime: '08:15',
    duration: '2h 15m',
    stops: 'Non-stop',
    price: 12599,
    originalPrice: 14500,
    seatsLeft: 6,
    cabinBag: '7 kg',
    checkInBag: '15 kg',
    refundLabel: 'Refundable',
    onTimeLabel: '100% on time',
    emissionsLabel: '11% lower CO2',
    tags: [],
  },
  {
    id: 'offer-exact-6',
    airline: 'IndiGo',
    airlineCode: '6E',
    flightNumber: '6E 543',
    departTime: '06:25',
    arriveTime: '08:45',
    duration: '2h 20m',
    stops: 'Non-stop',
    price: 13795,
    originalPrice: 15500,
    seatsLeft: 4,
    cabinBag: '7 kg',
    checkInBag: '15 kg',
    refundLabel: 'Refundable',
    onTimeLabel: '100% on time',
    emissionsLabel: '12% lower CO2',
    tags: [],
  },
  {
    id: 'offer-exact-7',
    airline: 'Air India',
    airlineCode: 'AI',
    flightNumber: 'AI 280',
    departTime: '08:35',
    arriveTime: '10:55',
    duration: '2h 20m',
    stops: 'Non-stop',
    price: 19257,
    originalPrice: 21000,
    seatsLeft: 2,
    cabinBag: '7 kg',
    checkInBag: '15 kg',
    refundLabel: 'Refundable',
    onTimeLabel: '100% on time',
    emissionsLabel: '10% lower CO2',
    tags: [],
  },
];

export default function TravelResultsScreen() {
  const { travelSearch, setTravelResults, selectTravelOffer } = useSuperAppStore();
  const [sortBy, setSortBy] = useState('cheapest');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFareOffer, setSelectedFareOffer] = useState<TravelOffer | null>(null);
  const insets = useSafeAreaInsets();

  // Scroll offset tracking for Header bell transition
  const [scrollY, setScrollY] = useState(0);

  // Active filters list locally
  const [appliedFilters, setAppliedFilters] = useState<string[]>(['nonstop']);
  const [showBottomFilterBanner, setShowBottomFilterBanner] = useState(true);

  useEffect(() => {
    // Populate the results with our exact flights automatically
    setTravelResults({
      searchId: 'exact-flights-search',
      routeLabel: `${travelSearch.originCode} -> ${travelSearch.destinationCode}`,
      summary: `Exact flights for ${travelSearch.originCity} to ${travelSearch.destinationCity}`,
      aiTip: 'Gozy AI pre-selected the best direct flights for you.',
      priceInsight: {
        confidenceLabel: 'High confidence',
        trendLabel: 'Stable prices',
        averageFare: 6646,
      },
      addOns: [],
      offers: exactMockFlights,
    });
  }, [setTravelResults, travelSearch]);

  const toggleFilter = (filterId: string) => {
    if (filterId === 'filter') {
      setShowBottomFilterBanner(!showBottomFilterBanner);
      return;
    }
    setAppliedFilters((prev) =>
      prev.includes(filterId) ? prev.filter((id) => id !== filterId) : [...prev, filterId]
    );
  };

  const sortedOffers = useMemo(() => {
    let offers = [...exactMockFlights];
    if (appliedFilters.includes('nonstop')) {
      offers = offers.filter((o) => o.stops.toLowerCase().includes('non') || o.stops.toLowerCase().includes('0'));
    }

    if (sortBy === 'cheapest') {
      offers.sort((left, right) => left.price - right.price);
    }
    return offers;
  }, [sortBy, appliedFilters]);

  return (
    <View style={styles.safeArea}>
      {/* Custom Header */}
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 16) }]}>
        <View style={styles.headerLeft}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <MaterialCommunityIcons name="arrow-left" size={24} color={colors.text} />
          </Pressable>
          <View>
            <View style={styles.titleRow}>
              <Text style={styles.headerTitle}>{travelSearch.originCity} to {travelSearch.destinationCity}</Text>
              <MaterialCommunityIcons name="pencil" size={14} color="#0084FF" style={{ marginLeft: 6 }} />
            </View>
            <Text style={styles.headerSubtitle}>
              11 Apr | {travelSearch.travellers} Adult | {travelSearch.cabinClass}
            </Text>
          </View>
        </View>
        
        {/* Dynamic Edit Price Alert Bell Button */}
        {scrollY > 50 ? (
          <Pressable style={styles.priceAlertBellOnly}>
            <MaterialCommunityIcons name="bell" size={20} color="#0084FF" />
          </Pressable>
        ) : (
          <Pressable style={styles.priceAlertBtn}>
            <MaterialCommunityIcons name="bell-ring" size={16} color="#0084FF" />
            <Text style={styles.priceAlertText}>Edit Price Alert</Text>
          </Pressable>
        )}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        onScroll={(event) => {
          setScrollY(event.nativeEvent.contentOffset.y);
        }}
        scrollEventThrottle={16}
      >
        
        {/* Kotakemi Sliding Banner (Hidden when scrolled, mimicking Column 2) */}
        {scrollY <= 50 && (
          <View style={styles.kotakemiContainer}>
            <View style={styles.kotakemiCard}>
              <View style={styles.kotakemiBadge}>
                <Text style={styles.kotakemiLogoText}>KOTAKEMI</Text>
              </View>
              <Text style={styles.kotakemiText}>
                Get up to 25% off on your flight bookings using Kotak cards!
              </Text>
              <Text style={styles.slideIndicator}>2/5</Text>
            </View>
          </View>
        )}

        {/* Fare Calendar Strip (Hidden when scrolled, mimicking Column 2) */}
        {scrollY <= 50 && (
          <View style={styles.calendarStripContainer}>
            <View style={styles.monthBadge}>
              <Text style={styles.monthText}>APR</Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.calendarScroll}>
              {fareCalendar.map((item, index) => (
                <Pressable
                  key={index}
                  onPress={() => router.push('/travel-fare-calendar')}
                  style={[styles.calendarBox, item.active && styles.calendarBoxActive]}
                >
                  <Text style={[styles.calendarDate, item.active && styles.calendarDateActive]}>{item.date}</Text>
                  <Text style={[styles.calendarPrice, item.active && styles.calendarPriceActive]}>
                    {formatCurrency(item.price)}
                  </Text>
                </Pressable>
              ))}
              
              <Pressable onPress={() => router.push('/travel-fare-calendar')} style={styles.calendarIconBtn}>
                <MaterialCommunityIcons name="calendar-month" size={22} color="#0084FF" />
              </Pressable>
            </ScrollView>
          </View>
        )}

        {/* Filter Chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRowScroll} contentContainerStyle={styles.filterRow}>
          {sortOptions.map((opt) => {
            const active = opt.id === 'cheapest' ? sortBy === 'cheapest' : appliedFilters.includes(opt.id);
            return (
              <Pressable
                key={opt.id}
                onPress={() => {
                  if (opt.id === 'cheapest') setSortBy('cheapest');
                  else toggleFilter(opt.id);
                }}
                style={[styles.filterChip, active && styles.filterChipActive]}
              >
                {opt.icon && <MaterialCommunityIcons name={opt.icon as any} size={16} color={active ? '#0084FF' : '#333'} style={{ marginRight: 4 }} />}
                <Text style={[styles.filterText, active && styles.filterTextActive]}>{opt.label}</Text>
                {opt.id === 'filter' && (
                  <View style={styles.filterDot} />
                )}
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Flight Cards list */}
        <View style={styles.cardsContainer}>
          {sortedOffers.map((offer, idx) => {
            const isAI2776 = offer.flightNumber === 'AI 2776';
            const isIndiGoPriceLock = offer.tags?.some((t) => t.includes('Lock this price'));
            const showVisaPromo = idx === 1 && scrollY <= 50;

            return (
              <React.Fragment key={offer.id}>
                {/* Visa Promo Banner Card inserted in between flight cards */}
                {showVisaPromo && (
                  <View style={styles.visaCard}>
                    <View style={styles.visaHeader}>
                      <View style={styles.visaLogoContainer}>
                        <Text style={styles.visaText}>VISA</Text>
                        <Text style={styles.signatureText}>Signature</Text>
                      </View>
                      <View>
                        <Text style={styles.visaPromoTitle}>VISA Exclusive Offer</Text>
                        <Text style={styles.visaPromoSub}>Free Seat with VISA Signature Credit Card</Text>
                      </View>
                    </View>
                    <View style={styles.redBadgeFloat} />
                  </View>
                )}

                {/* Actual Flight card */}
                <Pressable
                  style={styles.flightCard}
                  onPress={() => {
                    setSelectedFareOffer(offer);
                  }}
                >
                  {/* Card Header */}
                  <View style={styles.cardHeader}>
                    <View style={styles.airlineInfo}>
                      <Image source={getAirlineLogo(offer.airline)} style={styles.airlineLogo} contentFit="contain" />
                      <View>
                        <Text style={styles.airlineName}>{offer.airline}</Text>
                        <Text style={styles.onTimeLabelText}>{offer.onTimeLabel}</Text>
                      </View>
                    </View>
                    <Text style={styles.flightPrice}>{formatCurrency(offer.price)}</Text>
                  </View>

                  {/* Time Row */}
                  <View style={styles.timeRow}>
                    <View style={styles.timeCol}>
                      <Text style={styles.timeText}>{offer.departTime}</Text>
                      <Text style={styles.codeText}>{travelSearch.originCode}</Text>
                    </View>
                    <View style={styles.durationWrap}>
                      <Text style={styles.durationText}>{offer.duration}</Text>
                      <View style={styles.durationLine}>
                        <View style={styles.dot} />
                        <View style={styles.line} />
                        <View style={styles.dot} />
                      </View>
                      <Text style={styles.stopText}>{offer.stops}</Text>
                    </View>
                    <View style={styles.timeColEnd}>
                      <Text style={styles.timeText}>{offer.arriveTime}</Text>
                      <Text style={styles.codeText}>{travelSearch.destinationCode}</Text>
                    </View>
                  </View>

                  {/* Offers / Tags */}
                  <View style={styles.offerBanner}>
                    <Text style={styles.offerBannerText}>
                      Flat 12% OFF on Axis Bank Credit Cards using MMTA... <Text onPress={() => alert("Feature coming soon!")} style={{ color: '#0084FF', fontWeight: '800' }}>+ more {'>'}</Text>
                    </Text>
                  </View>
                  
                  {isAI2776 && (
                    <Text style={styles.freeMealText}>
                      {offer.price === 11698 ? 'Free Hot Meal | Free Seat with VISA Signature' : 'Free Meal'}
                    </Text>
                  )}

                  {/* Lock Price / Lock Deal Button */}
                  {isIndiGoPriceLock && (
                    <View style={styles.lockPriceFooter}>
                      <View style={styles.lockPriceBtn}>
                        <MaterialCommunityIcons name="lock-open-outline" size={14} color="#0084FF" />
                        <Text style={styles.lockPriceText}>{offer.tags[0]}</Text>
                      </View>
                    </View>
                  )}
                </Pressable>
              </React.Fragment>
            );
          })}

          {/* Price Prediction Trend Card */}
          {scrollY <= 50 && (
            <View style={styles.trendCard}>
              <View style={styles.trendHeader}>
                <MaterialCommunityIcons name="trending-up" size={22} color="#EAB308" />
                <View style={styles.trendContent}>
                  <Text style={styles.trendTitle}>Prices are expected to rise in 15 days</Text>
                  <Text style={styles.trendSub}>We recommend booking now to lock in these low rates.</Text>
                </View>
              </View>
            </View>
          )}
        </View>

        <View style={styles.footerSpacer} />
      </ScrollView>

      {/* Sticky Bottom Notification Filter Banner */}
      {showBottomFilterBanner && appliedFilters.includes('nonstop') && scrollY <= 50 && (
        <View style={styles.stickyFilterBanner}>
          <Text style={styles.stickyFilterText}>
            We have pre-applied Non-Stop filter for your convenience.
          </Text>
          <Pressable onPress={() => setAppliedFilters(appliedFilters.filter(f => f !== 'nonstop'))}>
            <Text style={styles.removeFilterText}>REMOVE</Text>
          </Pressable>
        </View>
      )}

      {/* Floating Chatbot Assistant Button */}
      <View style={styles.floatingChatbotContainer}>
        <Pressable onPress={() => router.push('/assistant')} style={styles.floatingChatbotBtn}>
          <MaterialCommunityIcons name="robot-outline" size={26} color="#FFF" />
        </Pressable>
      </View>

      {/* Flight details & Fare options Modal */}
      <Modal
        visible={!!selectedFareOffer}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setSelectedFareOffer(null)}
      >
        <SafeAreaView style={{ flex: 1, backgroundColor: '#FFF' }}>
          <View style={styles.modalHeader}>
            <Pressable onPress={() => setSelectedFareOffer(null)} style={{ padding: 8 }}>
              <MaterialCommunityIcons name="close" size={24} color="#333" />
            </Pressable>
            <Text style={styles.modalTitle}>Flight details & Fare options</Text>
          </View>
          
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16 }}>
            {/* Eco Value Card */}
            <View style={styles.fareCard}>
              <View style={styles.fareCardHeader}>
                <Text style={styles.fareTitle}>Eco Value</Text>
                <Text style={styles.farePrice}>{formatCurrency(selectedFareOffer?.price ?? 6646)}/Adult</Text>
              </View>
              
              <View style={styles.fareIncludes}>
                <View style={styles.fareIncludeRow}>
                  <MaterialCommunityIcons name="check-circle" size={16} color="#00A699" />
                  <Text style={styles.fareIncludeText}>Cabin bag 7 Kgs / Adult</Text>
                </View>
                <View style={styles.fareIncludeRow}>
                  <MaterialCommunityIcons name="check-circle" size={16} color="#00A699" />
                  <Text style={styles.fareIncludeText}>Check-in 15 Kgs / Adult</Text>
                </View>
                <View style={styles.fareIncludeRow}>
                  <MaterialCommunityIcons name="minus-circle" size={16} color="#EF4444" />
                  <Text style={styles.fareIncludeText}>Cancellation fee starting ₹ 3,000</Text>
                </View>
                <View style={styles.fareIncludeRow}>
                  <MaterialCommunityIcons name="minus-circle" size={16} color="#EF4444" />
                  <Text style={styles.fareIncludeText}>Date Change fee starting ₹ 3,100</Text>
                </View>
              </View>
              
              <Pressable>
                <Text style={styles.fareViewSeat}>View Seat, meal ⌄</Text>
              </Pressable>
              
              <View style={styles.fareActions}>
                <Pressable style={styles.fareLockBtn}>
                  <Text style={styles.fareLockText}>LOCK PRICE</Text>
                </Pressable>
                <Pressable
                  style={styles.fareBookBtn}
                  onPress={() => {
                    if (selectedFareOffer) selectTravelOffer(selectedFareOffer);
                    setSelectedFareOffer(null);
                    router.push('/travel-review');
                  }}
                >
                  <Text style={styles.fareBookText}>BOOK NOW</Text>
                </Pressable>
              </View>
              
              <View style={styles.fareOfferBanner}>
                <Text style={styles.fareOfferText}>Flat 12% OFF on Axis Bank Credit Card using MMTASICC | Flat ₹ 197 OFF using code MMTSUPER</Text>
              </View>
            </View>

            {/* MMT Special Fare Card */}
            <View style={[styles.fareCard, { borderColor: '#EAB308', padding: 0, overflow: 'hidden' }]}>
              <View style={styles.specialFareHeader}>
                <Text style={styles.specialFareTitle}>MMT SPECIAL FARE</Text>
                <Text style={styles.specialFarePrice}>₹ 6,922/Adult</Text>
              </View>
              <View style={{ padding: 16 }}>
                <View style={styles.benefitBadge}>
                  <Text style={styles.benefitBadgeText}>BENEFIT WORTH ₹ 5,000 INCLUDED</Text>
                </View>
                <Text style={styles.specialFareFlex}>Flexi Fly (Zero Cancellation OR Free Date Change)</Text>
                
                <View style={[styles.fareIncludes, { marginTop: 12 }]}>
                  <View style={styles.fareIncludeRow}><MaterialCommunityIcons name="check-circle" size={16} color="#00A699" /><Text style={styles.fareIncludeText}>Cabin bag 7 Kgs / Adult</Text></View>
                  <View style={styles.fareIncludeRow}><MaterialCommunityIcons name="check-circle" size={16} color="#00A699" /><Text style={styles.fareIncludeText}>Check-in 15 Kgs / Adult</Text></View>
                  <View style={styles.fareIncludeRow}><MaterialCommunityIcons name="check-circle" size={16} color="#00A699" /><Text style={styles.fareIncludeText}>Seat Free seats available</Text></View>
                  <View style={styles.fareIncludeRow}><MaterialCommunityIcons name="check-circle" size={16} color="#00A699" /><Text style={styles.fareIncludeText}>Meal Get complimentary meals</Text></View>
                </View>
                
                <Pressable
                  style={[styles.fareBookBtn, { marginTop: 12 }]}
                  onPress={() => {
                    const fallback = selectedFareOffer || exactMockFlights[0];
                    selectTravelOffer({ ...fallback, price: 6922 });
                    setSelectedFareOffer(null);
                    router.push('/travel-review');
                  }}
                >
                  <Text style={styles.fareBookText}>BOOK NOW</Text>
                </Pressable>
              </View>
            </View>

            {/* Eco Classic Card */}
            <View style={styles.fareCard}>
              <View style={styles.fareCardHeader}>
                <Text style={styles.fareTitle}>Eco Classic</Text>
                <Text style={styles.farePrice}>₹ 7,171/Adult</Text>
              </View>
              
              <View style={styles.fareIncludes}>
                <View style={styles.fareIncludeRow}><MaterialCommunityIcons name="check-circle" size={16} color="#00A699" /><Text style={styles.fareIncludeText}>Cabin bag 7 Kgs / Adult</Text></View>
                <View style={styles.fareIncludeRow}><MaterialCommunityIcons name="check-circle" size={16} color="#00A699" /><Text style={styles.fareIncludeText}>Check-in 20 Kgs / Adult</Text></View>
                <View style={styles.fareIncludeRow}><MaterialCommunityIcons name="minus-circle" size={16} color="#EF4444" /><Text style={styles.fareIncludeText}>Cancellation fee starting ₹ 3,500</Text></View>
                <View style={styles.fareIncludeRow}><MaterialCommunityIcons name="minus-circle" size={16} color="#EF4444" /><Text style={styles.fareIncludeText}>Date Change fee starting ₹ 1,000</Text></View>
              </View>
              
              <Pressable>
                <Text style={styles.fareViewSeat}>View Seat, meal ⌄</Text>
              </Pressable>
              
              <View style={styles.fareActions}>
                <Pressable style={styles.fareLockBtn}>
                  <Text style={styles.fareLockText}>LOCK PRICE</Text>
                </Pressable>
                <Pressable
                  style={styles.fareBookBtn}
                  onPress={() => {
                    const fallback = selectedFareOffer || exactMockFlights[0];
                    selectTravelOffer({ ...fallback, price: 7171 });
                    setSelectedFareOffer(null);
                    router.push('/travel-review');
                  }}
                >
                  <Text style={styles.fareBookText}>BOOK NOW</Text>
                </Pressable>
              </View>
              
              <View style={styles.fareOfferBanner}>
                <Text style={styles.fareOfferText}>Flat 12% OFF on Axis Bank Credit Card using MMTASICC | Flat ₹ 197 OFF using code MMTSUPER</Text>
              </View>
            </View>

            {/* Eco Flex Card */}
            <View style={styles.fareCard}>
              <View style={styles.fareCardHeader}>
                <Text style={styles.fareTitle}>Eco Flex</Text>
                <Text style={styles.farePrice}>₹ 8,221/Adult</Text>
              </View>
              
              <View style={styles.fareIncludes}>
                <View style={styles.fareIncludeRow}><MaterialCommunityIcons name="check-circle" size={16} color="#00A699" /><Text style={styles.fareIncludeText}>Cabin bag 7 Kgs / Adult</Text></View>
                <View style={styles.fareIncludeRow}><MaterialCommunityIcons name="check-circle" size={16} color="#00A699" /><Text style={styles.fareIncludeText}>Check-in 25 Kgs / Adult</Text></View>
                <View style={styles.fareIncludeRow}><MaterialCommunityIcons name="minus-circle" size={16} color="#EF4444" /><Text style={styles.fareIncludeText}>Cancellation fee starting ₹ 999</Text></View>
                <View style={styles.fareIncludeRow}><MaterialCommunityIcons name="minus-circle" size={16} color="#EF4444" /><Text style={styles.fareIncludeText}>Date Change fee starting ₹ 250</Text></View>
              </View>
              
              <Pressable>
                <Text style={styles.fareViewSeat}>View Seat, meal ⌄</Text>
              </Pressable>
              
              <View style={styles.fareActions}>
                <Pressable style={styles.fareLockBtn}>
                  <Text style={styles.fareLockText}>LOCK PRICE</Text>
                </Pressable>
                <Pressable
                  style={styles.fareBookBtn}
                  onPress={() => {
                    const fallback = selectedFareOffer || exactMockFlights[0];
                    selectTravelOffer({ ...fallback, price: 8221 });
                    setSelectedFareOffer(null);
                    router.push('/travel-review');
                  }}
                >
                  <Text style={styles.fareBookText}>BOOK NOW</Text>
                </Pressable>
              </View>
              
              <View style={styles.fareOfferBanner}>
                <Text style={styles.fareOfferText}>Flat 12% OFF on Axis Bank Credit Card using MMTASICC | Flat ₹ 197 OFF using code MMTSUPER</Text>
              </View>
            </View>

            <View style={{ height: 40 }} />
          </ScrollView>
        </SafeAreaView>
      </Modal>

    </View>
  );
}

function getAirlineLogo(airline: string) {
  if (airline.includes('Air India')) return { uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Air_India_Logo.svg/512px-Air_India_Logo.svg.png' };
  if (airline.includes('IndiGo')) return { uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/IndiGo_Airlines_logo.svg/512px-IndiGo_Airlines_logo.svg.png' };
  if (airline.includes('Akasa')) return { uri: 'https://upload.wikimedia.org/wikipedia/en/thumb/0/05/Akasa_Air_logo.svg/512px-Akasa_Air_logo.svg.png' };
  if (airline.includes('Vistara')) return { uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Vistara_Logo.svg/512px-Vistara_Logo.svg.png' };
  if (airline.includes('SpiceJet')) return { uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/SpiceJet_Logo.svg/512px-SpiceJet_Logo.svg.png' };
  return { uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Air_India_Logo.svg/512px-Air_India_Logo.svg.png' };
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F2F4F7' },
  loadingWrap: { alignItems: 'center', justifyContent: 'center', gap: spacing.md },
  loadingText: { color: colors.textMuted, fontSize: typography.body },
  
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: { marginRight: 12 },
  titleRow: { flexDirection: 'row', alignItems: 'center' },
  headerTitle: { fontSize: 16, fontWeight: '800', color: colors.text },
  headerSubtitle: { fontSize: 10.5, color: '#8E8E93', marginTop: 2 },
  priceAlertBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5FAFF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#D0E6FF',
  },
  priceAlertText: { color: '#0084FF', fontSize: 10, fontWeight: '800', marginLeft: 4 },
  priceAlertBellOnly: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F5FAFF',
    borderWidth: 1,
    borderColor: '#D0E6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  scrollContent: { paddingBottom: 100 },

  kotakemiContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  kotakemiCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderColor: '#E5E5EA',
    borderWidth: 1,
    position: 'relative',
    shadowColor: '#000',
    shadowOpacity: 0.02,
    shadowRadius: 5,
    elevation: 1,
  },
  kotakemiBadge: {
    backgroundColor: '#0A2540',
    alignSelf: 'flex-start',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
    marginBottom: 8,
  },
  kotakemiLogoText: {
    color: '#FFF',
    fontSize: 9,
    fontWeight: '900',
  },
  kotakemiText: {
    fontSize: 12,
    color: '#333',
    lineHeight: 18,
    fontWeight: '600',
    width: '90%',
  },
  slideIndicator: {
    position: 'absolute',
    right: 12,
    top: 12,
    fontSize: 10,
    color: '#8E8E93',
    fontWeight: '700',
  },

  calendarStripContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  monthBadge: {
    backgroundColor: '#333',
    paddingHorizontal: 6,
    justifyContent: 'center',
    borderTopRightRadius: 6,
    borderBottomRightRadius: 6,
  },
  monthText: { color: '#FFF', fontSize: 10, fontWeight: '900', transform: [{ rotate: '-90deg' }] },
  calendarScroll: { paddingHorizontal: 12, gap: 8, alignItems: 'center' },
  calendarBox: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 6,
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  calendarBoxActive: { borderColor: '#0084FF', backgroundColor: '#F5FAFF' },
  calendarDate: { fontSize: 10.5, color: '#333', fontWeight: '600' },
  calendarDateActive: { color: '#0084FF' },
  calendarPrice: { fontSize: 12, fontWeight: '800', color: '#00A699', marginTop: 2 },
  calendarPriceActive: { color: '#0084FF' },
  calendarIconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#EBF4FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },

  filterRowScroll: {
    maxHeight: 52,
    marginVertical: 12,
  },
  filterRow: {
    paddingHorizontal: 16,
    gap: 8,
    alignItems: 'center',
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5EA',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    position: 'relative',
  },
  filterChipActive: { backgroundColor: '#F5FAFF', borderColor: '#0084FF' },
  filterText: { fontSize: 10.5, fontWeight: '700', color: '#333' },
  filterTextActive: { color: '#0084FF' },
  filterDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#0084FF',
    position: 'absolute',
    top: 4,
    right: 4,
  },

  cardsContainer: { paddingHorizontal: 16, gap: 12 },
  flightCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    borderColor: '#E5E5EA',
    borderWidth: 1,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  airlineInfo: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  airlineLogo: { width: 20, height: 20, borderRadius: 4 },
  airlineName: { fontSize: 13, fontWeight: '800', color: '#333' },
  onTimeLabelText: { fontSize: 9, color: '#8E8E93', marginTop: 1 },
  flightPrice: { fontSize: 18, fontWeight: '900', color: colors.text },

  timeRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  timeCol: { alignItems: 'flex-start' },
  timeColEnd: { alignItems: 'flex-end' },
  timeText: { fontSize: 15, fontWeight: '900', color: colors.text },
  codeText: { fontSize: 12, color: '#8E8E93', marginTop: 2 },

  durationWrap: { flex: 1, alignItems: 'center', marginHorizontal: 20 },
  durationText: { fontSize: 10.5, color: '#333', fontWeight: '600', marginBottom: 4 },
  durationLine: { flexDirection: 'row', alignItems: 'center', width: '100%', gap: 4 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#CCC' },
  line: { flex: 1, height: 1, backgroundColor: '#CCC' },
  stopText: { fontSize: 10, color: '#8E8E93', marginTop: 4 },

  offerBanner: { backgroundColor: '#F5FAFF', padding: 8, borderRadius: 6, marginBottom: 8 },
  offerBannerText: { fontSize: 10, color: '#00A699', fontWeight: '600' },
  freeMealText: { fontSize: 10, color: '#00A699', fontWeight: '800', marginBottom: 12 },

  lockPriceFooter: { flexDirection: 'row', justifyContent: 'flex-end', borderTopWidth: 1, borderTopColor: '#F2F4F7', paddingTop: 12 },
  lockPriceBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F5FAFF', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: '#D0E6FF' },
  lockPriceText: { fontSize: 10, fontWeight: '800', color: '#0084FF', marginLeft: 4 },

  visaCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D0E6FF',
    borderRadius: 12,
    padding: 16,
    position: 'relative',
    shadowColor: '#000',
    shadowOpacity: 0.02,
    shadowRadius: 5,
    elevation: 1,
  },
  visaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  visaLogoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRightWidth: 1,
    borderRightColor: '#E5E5EA',
    paddingRight: 16,
  },
  visaText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0000FF',
    fontStyle: 'italic',
  },
  signatureText: {
    fontSize: 7,
    fontWeight: '900',
    color: '#D4AF37',
  },
  visaPromoTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#333',
  },
  visaPromoSub: {
    fontSize: 10,
    color: '#8E8E93',
    marginTop: 2,
  },
  redBadgeFloat: {
    position: 'absolute',
    right: 12,
    top: 12,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#EF4444',
  },

  trendCard: {
    backgroundColor: '#FFFBEB',
    borderColor: '#FEF08A',
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
  },
  trendHeader: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  trendContent: {
    flex: 1,
  },
  trendTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#854D0E',
  },
  trendSub: {
    fontSize: 10.5,
    color: '#CA8A04',
    marginTop: 2,
    lineHeight: 16,
  },

  footerSpacer: {
    height: 80,
  },

  stickyFilterBanner: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 10,
  },
  stickyFilterText: {
    color: '#333',
    fontSize: 10.5,
    fontWeight: '800',
    width: '75%',
    lineHeight: 16,
  },
  removeFilterText: {
    color: '#F87171',
    fontWeight: '900',
    fontSize: 10.5,
  },

  floatingChatbotContainer: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
    zIndex: 99,
  },
  floatingChatbotBtn: {
    backgroundColor: '#0084FF',
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },

  modalHeader: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#E5E5EA' },
  modalTitle: { fontSize: 16, fontWeight: '800', color: '#333', marginLeft: 8 },
  fareCard: { borderWidth: 1, borderColor: '#E5E5EA', borderRadius: 12, padding: 16, marginBottom: 16, backgroundColor: '#FFF' },
  fareCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  fareTitle: { fontSize: 16, fontWeight: '800', color: '#333' },
  farePrice: { fontSize: 16, fontWeight: '900', color: '#333' },
  fareIncludes: { gap: 8, marginBottom: 12 },
  fareIncludeRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  fareIncludeText: { fontSize: 12, color: '#333' },
  fareViewSeat: { fontSize: 12, color: '#0084FF', fontWeight: '700', marginVertical: 8 },
  fareActions: { flexDirection: 'row', gap: 12, marginTop: 8 },
  fareLockBtn: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 8, borderWidth: 1, borderColor: '#0084FF' },
  fareLockText: { color: '#0084FF', fontSize: 12, fontWeight: '800' },
  fareBookBtn: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 8, backgroundColor: '#0084FF' },
  fareBookText: { color: '#FFFFFF', fontSize: 12, fontWeight: '800' },
  fareOfferBanner: { backgroundColor: '#F5FAFF', padding: 8, borderRadius: 6, marginTop: 16 },
  fareOfferText: { fontSize: 10, color: '#00A699', fontWeight: '600', textAlign: 'center' },

  specialFareHeader: {
    backgroundColor: '#FFF2E6',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#FFE0CC',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  specialFareTitle: {
    color: '#8A4200',
    fontSize: 13,
    fontWeight: '900',
  },
  specialFarePrice: {
    color: '#8A4200',
    fontSize: 13,
    fontWeight: '900',
  },
  benefitBadge: {
    backgroundColor: '#FFE5CC',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginBottom: 8,
  },
  benefitBadgeText: {
    color: '#D35400',
    fontSize: 10,
    fontWeight: '900',
  },
  specialFareFlex: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#27AE60',
  },
});
