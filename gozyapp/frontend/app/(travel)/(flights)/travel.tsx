import React, { useState, useEffect } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Modal,
  TextInput,
  SafeAreaView,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';

import { ScreenShell } from '@/src/components/screen-shell';
import { useApp } from '@/src/context/app-context';
import { api } from '@/src/lib/api';
import { useSuperAppStore } from '@/src/store/super-app-store';
import { defaultTravelSearch } from '@/src/lib/travel-data';
import type { TravelSearchParams, TravelCabinClass } from '@/src/types';
import { colors, radius, spacing, typography } from '@/src/theme/tokens';

const { width } = Dimensions.get('window');

const specialFares = [
  { id: 'student', title: 'Student', subtitle: 'Extra discounts/baggage' },
  { id: 'senior', title: 'Senior Citizen', subtitle: 'Up to ₹ 600 off' },
  { id: 'gst', title: 'Have a GST number', subtitle: 'Upto 10% Extra Savings' },
  { id: 'armed', title: 'Armed Forces', subtitle: 'Up to ₹ 600 off' },
];

const quickLinks = [
  { id: 'tracker', icon: 'airplane-clock', title: 'Flight Tracker', color: '#0084FF', tag: null },
  { id: 'dutyfree', icon: 'shopping-outline', title: 'Shop Duty Free', color: '#0084FF', tag: '10% off' },
  { id: 'calendar', icon: 'calendar-search', title: 'Fare Calendar', color: '#0084FF', tag: null },
];

const popularAirports = [
  { city: 'Hyderabad', code: 'HYD', airport: 'Rajiv Gandhi International Airport' },
  { city: 'New Delhi', code: 'DEL', airport: 'Indira Gandhi International Airport' },
  { city: 'Mumbai', code: 'BOM', airport: 'Chhatrapati Shivaji Maharaj Airport' },
  { city: 'Bangalore', code: 'BLR', airport: 'Kempegowda International Airport' },
  { city: 'Goa', code: 'GOX', airport: 'Manohar International Airport' },
  { city: 'Chennai', code: 'MAA', airport: 'Chennai International Airport' },
];

export default function TravelScreen() {
  const { session } = useApp();
  const { travelSearch, setTravelResults, setTravelSearch, seedTravelContact } = useSuperAppStore();
  const insets = useSafeAreaInsets();
  
  const [search, setSearch] = useState<TravelSearchParams>(travelSearch);
  const [isSearching, setIsSearching] = useState(false);
  const [tripType, setTripType] = useState<'ONE WAY' | 'ROUNDTRIP' | 'MULTICITY'>('ONE WAY');
  const [selectedFares, setSelectedFares] = useState<string[]>([]);
  
  // Scroll Position
  const [scrollY, setScrollY] = useState(0);
  const isCollapsed = scrollY > 80;

  // City modal state
  const [showCityModal, setShowCityModal] = useState<'from' | 'to' | null>(null);
  const [citySearchQuery, setCitySearchQuery] = useState('');

  // Travellers modal state
  const [showTravellersModal, setShowTravellersModal] = useState(false);
  const [localTravellers, setLocalTravellers] = useState(search.travellers);
  const [localCabinClass, setLocalCabinClass] = useState<TravelCabinClass>(search.cabinClass);

  // Synchronize store dates/changes
  useEffect(() => {
    setSearch(travelSearch);
  }, [travelSearch]);

  const swapRoute = () => {
    setSearch((current) => ({
      ...current,
      originCity: current.destinationCity,
      originCode: current.destinationCode,
      destinationCity: current.originCity,
      destinationCode: current.originCode,
    }));
  };

  const toggleFare = (id: string) => {
    setSelectedFares((current) =>
      current.includes(id) ? current.filter((f) => f !== id) : [...current, id]
    );
  };

  const runSearch = async () => {
    setIsSearching(true);
    try {
      // Ensure we push changes to store before searching
      setTravelSearch(search);
      seedTravelContact({
        email: session?.user.email ?? '',
        phone: '9876543210',
      });
      const results = await api.searchTravel(search);
      setTravelResults(results);
      router.push('/travel-results');
    } finally {
      setIsSearching(false);
    }
  };

  // Filter airports based on search query
  const filteredAirports = popularAirports.filter(
    (ap) =>
      ap.city.toLowerCase().includes(citySearchQuery.toLowerCase()) ||
      ap.code.toLowerCase().includes(citySearchQuery.toLowerCase()) ||
      ap.airport.toLowerCase().includes(citySearchQuery.toLowerCase())
  );

  const handleCitySelect = (city: string, code: string) => {
    if (showCityModal === 'from') {
      setSearch((prev) => ({
        ...prev,
        originCity: city,
        originCode: code,
      }));
    } else {
      setSearch((prev) => ({
        ...prev,
        destinationCity: city,
        destinationCode: code,
      }));
    }
    setShowCityModal(null);
    setCitySearchQuery('');
  };

  const handleTravellersSave = () => {
    setSearch((prev) => ({
      ...prev,
      travellers: localTravellers,
      cabinClass: localCabinClass,
    }));
    setShowTravellersModal(false);
  };

  const getFloatingIconName = () => {
    if (isCollapsed) return 'microphone';
    if (tripType === 'ONE WAY') return 'magnify';
    if (tripType === 'ROUNDTRIP') return 'robot-outline';
    return 'microphone'; // MULTICITY
  };

  return (
    <View style={styles.container}>
      {/* Custom Header */}
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 16) }]}>
        <Pressable onPress={() => router.back()} hitSlop={12} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#0F172A" />
        </Pressable>
        <Text style={styles.headerTitle}>Flight Search</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        onScroll={(event) => {
          setScrollY(event.nativeEvent.contentOffset.y);
        }}
        scrollEventThrottle={16}
      >
        
        {/* Main Booking Card */}
        <View style={styles.bookingCard}>
          {/* Trip Type Selector */}
          <View style={styles.tripTypeContainer}>
            {(['ONE WAY', 'ROUNDTRIP', 'MULTICITY'] as const).map((type) => {
              const active = tripType === type;
              return (
                <Pressable
                  key={type}
                  onPress={() => setTripType(type)}
                  style={[styles.tripTypeButton, active && styles.tripTypeButtonActive]}
                >
                  <Text style={[styles.tripTypeText, active && styles.tripTypeTextActive]}>
                    {type}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* Conditional Layouts based on Collapsed / tripType */}
          {isCollapsed ? (
            /* Screen 4: Collapsed Search overview card */
            <View style={styles.collapsedCard}>
              <View style={styles.collapsedDetails}>
                <Text style={styles.collapsedRoute}>
                  {search.originCity.toUpperCase()} - {search.destinationCity.toUpperCase()}
                </Text>
                <Text style={styles.collapsedMeta}>
                  11 APR | {search.travellers} TRAVELLERS | {search.cabinClass.toUpperCase()}
                </Text>
              </View>
              <Pressable onPress={runSearch} style={styles.collapsedSearchBtn}>
                <Text style={styles.collapsedSearchBtnText}>
                  {isSearching ? 'SEARCHING...' : 'SEARCH FLIGHTS'}
                </Text>
              </Pressable>
            </View>
          ) : tripType === 'MULTICITY' ? (
            /* Screen 3: MULTICITY layout */
            <View style={styles.multiCityContainer}>
              {/* Flight 1 */}
              <View style={styles.multiCityRow}>
                <Pressable onPress={() => setShowCityModal('from')} style={styles.multiLocationCol}>
                  <Text style={styles.fieldLabel}>FROM</Text>
                  <Text style={styles.cityText}>{search.originCode}</Text>
                  <Text style={styles.airportText} numberOfLines={1}>{search.originCity}</Text>
                </Pressable>
                <Pressable onPress={() => setShowCityModal('to')} style={styles.multiLocationCol}>
                  <Text style={styles.fieldLabel}>TO</Text>
                  <Text style={styles.cityText}>BOM</Text>
                  <Text style={styles.airportText} numberOfLines={1}>Mumbai</Text>
                </Pressable>
                <Pressable onPress={() => router.push('/travel-fare-calendar')} style={styles.multiLocationCol}>
                  <Text style={styles.fieldLabel}>DATE</Text>
                  <Text style={[styles.cityText, { fontSize: 16 }]}>11 Apr</Text>
                  <Text style={styles.airportText} numberOfLines={1}>Sat, 2026</Text>
                </Pressable>
              </View>

              {/* Flight 2 */}
              <View style={styles.multiCityRow}>
                <View style={styles.multiLocationCol}>
                  <Text style={styles.fieldLabel}>FROM</Text>
                  <Text style={styles.cityText}>BOM</Text>
                  <Text style={styles.airportText} numberOfLines={1}>Mumbai</Text>
                </View>
                <Pressable onPress={() => setShowCityModal('to')} style={[styles.multiLocationCol, styles.multiLocationColEmpty]}>
                  <Text style={styles.fieldLabel}>TO</Text>
                  <Text onPress={() => alert("Feature coming soon!")} style={[styles.cityText, { color: '#0084FF' }]}>TO</Text>
                </Pressable>
                <Pressable onPress={() => router.push('/travel-fare-calendar')} style={[styles.multiLocationCol, styles.multiLocationColEmpty]}>
                  <Text style={styles.fieldLabel}>DATE</Text>
                  <Text onPress={() => alert("Feature coming soon!")} style={[styles.cityText, { color: '#0084FF', fontSize: 16 }]}>Date</Text>
                </Pressable>
                <Pressable style={styles.multiCityRemoveBtn}>
                  <MaterialCommunityIcons name="close-circle" size={18} color="#CCC" />
                </Pressable>
              </View>

              {/* Add City Button */}
              <Pressable style={styles.addCityButton}>
                <Text style={styles.addCityText}>+ ADD CITY</Text>
              </Pressable>
            </View>
          ) : (
            /* Screen 1 & 2: ONE WAY & ROUNDTRIP layout */
            <>
              {/* From / To Locations */}
              <View style={styles.locationContainer}>
                <Pressable onPress={() => setShowCityModal('from')} style={styles.locationBox}>
                  <Text style={styles.fieldLabel}>FROM</Text>
                  <Text style={styles.cityText}>{search.originCity}</Text>
                  <Text style={styles.airportText} numberOfLines={1}>
                    {search.originCode} - {search.originCity === 'Hyderabad' ? 'Rajiv Gandhi' : 'Intl'} Airport
                  </Text>
                </Pressable>
                
                <View style={styles.swapButtonContainer}>
                  <Pressable onPress={swapRoute} style={styles.swapButton}>
                    <MaterialCommunityIcons name="swap-horizontal" size={16} color="#0084FF" />
                  </Pressable>
                </View>

                <Pressable onPress={() => setShowCityModal('to')} style={styles.locationBox}>
                  <Text style={styles.fieldLabel}>TO</Text>
                  <Text style={styles.cityText}>{search.destinationCity}</Text>
                  <Text style={styles.airportText} numberOfLines={1}>
                    {search.destinationCode} - {search.destinationCity === 'New Delhi' ? 'Indira Gandhi' : 'Intl'} Airport
                  </Text>
                </Pressable>
              </View>

              {/* Dates */}
              <View style={styles.datesContainer}>
                <Pressable onPress={() => router.push('/travel-fare-calendar')} style={styles.dateBox}>
                  <Text style={styles.fieldLabel}>DEPARTURE DATE</Text>
                  <View style={styles.dateValueRow}>
                    <Text style={styles.dateTextMain}>11 Apr</Text>
                    <Text style={styles.dateTextSub}>Sat, 2026</Text>
                  </View>
                </Pressable>
                
                {tripType === 'ROUNDTRIP' ? (
                  <Pressable onPress={() => router.push('/travel-fare-calendar')} style={styles.dateBox}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Text style={styles.fieldLabel}>RETURN DATE</Text>
                      <Pressable onPress={(e) => {
                        e.stopPropagation();
                        setTripType('ONE WAY');
                      }}>
                        <MaterialCommunityIcons name="close-circle" size={14} color="#CCC" />
                      </Pressable>
                    </View>
                    <View style={styles.dateValueRow}>
                      <Text style={styles.dateTextMain}>12 Apr</Text>
                      <Text style={styles.dateTextSub}>Sun, 2026</Text>
                    </View>
                  </Pressable>
                ) : (
                  <Pressable style={styles.dateBox} onPress={() => setTripType('ROUNDTRIP')}>
                    <Text onPress={() => alert("Feature coming soon!")} style={[styles.fieldLabel, { color: '#0084FF', fontWeight: '800' }]}>
                      +ADD RETURN DATE
                    </Text>
                    <Text style={styles.addReturnSub}>Save more on round trips!</Text>
                  </Pressable>
                )}
              </View>
            </>
          )}

          {/* Travellers & Class Selector */}
          {!isCollapsed && (
            <Pressable onPress={() => {
              setLocalTravellers(search.travellers);
              setLocalCabinClass(search.cabinClass);
              setShowTravellersModal(true);
            }} style={styles.travellersBox}>
              <Text style={styles.fieldLabel}>TRAVELLERS & CLASS</Text>
              <View style={styles.travellersRow}>
                <Text style={styles.travellersCount}>{search.travellers}, </Text>
                <Text style={styles.travellersClass}>{search.cabinClass === 'Economy' ? 'Economy/Premium Economy' : search.cabinClass}</Text>
              </View>
            </Pressable>
          )}

          {/* Special Fares */}
          {!isCollapsed && (
            <View style={styles.specialFaresSection}>
              <Text style={styles.specialFaresLabel}>SPECIAL FARES (OPTIONAL)</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.specialFaresScroll}>
                {specialFares.map((fare) => {
                  const active = selectedFares.includes(fare.id);
                  return (
                    <Pressable
                      key={fare.id}
                      onPress={() => toggleFare(fare.id)}
                      style={[styles.fareChip, active && styles.fareChipActive]}
                    >
                      <Text style={[styles.fareTitle, active && styles.fareTitleActive]}>{fare.title}</Text>
                      <Text style={[styles.fareSubtitle, active && styles.fareSubtitleActive]}>{fare.subtitle}</Text>
                    </Pressable>
                  );
                })}
              </ScrollView>
            </View>
          )}

          {/* Search Button (Hidden when collapsed since it's inside the collapsed card) */}
          {!isCollapsed && (
            <Pressable onPress={runSearch} style={styles.searchButton}>
              <Text style={styles.searchButtonText}>
                {isSearching ? 'SEARCHING...' : 'SEARCH FLIGHTS'}
              </Text>
            </Pressable>
          )}
        </View>

        {/* Screen 4 promo banner - Fare Calendar exploration */}
        {isCollapsed && (
          <Pressable onPress={() => router.push('/travel-fare-calendar')} style={styles.fareCalendarPromoCard}>
            <View style={styles.fareCalendarIconBox}>
              <MaterialCommunityIcons name="calendar-search" size={26} color="#0084FF" />
            </View>
            <View style={styles.fareCalendarContent}>
              <View style={styles.newBadge}>
                <Text style={styles.newBadgeText}>NEW</Text>
              </View>
              <Text style={styles.fareCalendarTitle}>
                Book cheapest flights for your trips, with our Fare Calendar
              </Text>
              <Text style={styles.exploreFareText}>EXPLORE FARE CALENDAR →</Text>
            </View>
          </Pressable>
        )}

        {/* Quick Links (Hidden when collapsed to match mockup) */}
        {!isCollapsed && (
          <View style={styles.quickLinksContainer}>
            {quickLinks.map((link) => (
              <Pressable
                key={link.id}
                onPress={() => {
                  if (link.id === 'calendar') router.push('/travel-fare-calendar');
                }}
                style={styles.quickLinkItem}
              >
                {link.tag && (
                  <View style={styles.quickLinkTag}>
                    <Text style={styles.quickLinkTagText}>{link.tag}</Text>
                  </View>
                )}
                <View style={styles.quickLinkIconBox}>
                  <MaterialCommunityIcons name={link.icon as any} size={24} color={link.color} />
                </View>
                <Text style={styles.quickLinkText}>{link.title}</Text>
              </Pressable>
            ))}
          </View>
        )}

        {/* Hyatt Ad Banner */}
        <View style={styles.adBannerContainer}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1200&q=80' }}
            style={styles.adBannerImage}
          />
          <LinearGradient colors={['transparent', 'rgba(0,0,0,0.8)']} style={styles.adBannerOverlay} />
          <View style={styles.adBannerContent}>
            <Text style={styles.adBannerTitle}>Experience Beachfront Luxury & Local Culture</Text>
            <Text style={styles.adBannerSubtitle}>At Hyatt Goa Hotels.</Text>
            <Pressable style={styles.adBannerButton}>
              <Text style={styles.adBannerButtonText}>BOOK NOW</Text>
            </Pressable>
          </View>
        </View>

        {/* Flagship Airline Store Banner */}
        <View style={styles.flagshipContainer}>
          <Text style={styles.flagshipTitle}>Flagship Airline Store</Text>
          <View style={styles.flagshipBannerBox}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1436491865332-7a615061c443?auto=format&fit=crop&w=1200&q=80' }}
              style={StyleSheet.absoluteFillObject}
              contentFit="cover"
            />
            <LinearGradient colors={['transparent', 'rgba(0,0,0,0.8)']} style={StyleSheet.absoluteFillObject} />
            
            <View style={styles.flagshipLogoBadge}>
              <Text style={styles.flagshipLogoText}>ITA</Text>
              <Text onPress={() => alert("Feature coming soon!")} style={{ fontSize: 7, fontWeight: '900', color: '#0084FF' }}>AIRWAYS</Text>
            </View>

            <View style={styles.flagshipContent}>
              <Text style={styles.flagshipHeadline}>Fly Around the World with ITA Airways</Text>
            </View>
          </View>
        </View>

        {/* Offers Section */}
        <View style={styles.offersHeader}>
          <Text style={styles.offersTitle}>OFFERS</Text>
          <Pressable>
            <Text style={styles.viewAllText}>View All</Text>
          </Pressable>
        </View>
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.offersScroll}>
          <View style={styles.offerCard}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80' }}
              style={styles.offerImage}
            />
            <View style={styles.offerCardContent}>
              <Text style={styles.offerCardTitle}>Flat 15% Off on Domestic Flights</Text>
              <Text style={styles.offerCardSubtitle}>Use code GOZYFLY. Valid till end of month.</Text>
            </View>
          </View>
          <View style={styles.offerCard}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1517840901100-8179e982acb7?auto=format&fit=crop&w=800&q=80' }}
              style={styles.offerImage}
            />
            <View style={styles.offerCardContent}>
              <Text style={styles.offerCardTitle}>Upto ₹5000 Cashback</Text>
              <Text style={styles.offerCardSubtitle}>On International bookings with Gozy Card.</Text>
            </View>
          </View>
        </ScrollView>
        
        <View style={styles.footerSpacer} />
      </ScrollView>

      {/* Floating Action Button */}
      <View style={styles.floatingActionBtnContainer}>
        <Pressable onPress={runSearch} style={styles.floatingActionBtn}>
          <MaterialCommunityIcons name={getFloatingIconName() as any} size={26} color="#FFF" />
        </Pressable>
      </View>

      {/* City Selection Modal */}
      <Modal visible={!!showCityModal} animationType="slide">
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Pressable onPress={() => setShowCityModal(null)} style={styles.modalCloseBtn}>
              <MaterialCommunityIcons name="close" size={24} color={colors.text} />
            </Pressable>
            <Text style={styles.modalTitle}>
              Select {showCityModal === 'from' ? 'Departure' : 'Arrival'} City
            </Text>
          </View>
          
          <View style={styles.modalSearchBox}>
            <MaterialCommunityIcons name="magnify" size={20} color="#8E8E93" style={{ marginRight: 8 }} />
            <TextInput
              placeholder="Search airport or city name"
              value={citySearchQuery}
              onChangeText={setCitySearchQuery}
              style={styles.modalSearchInput}
              autoFocus
            />
          </View>

          <Text style={styles.popularAirportsHeading}>Popular Airports</Text>
          <FlatListAirports airports={filteredAirports} onSelect={handleCitySelect} />
        </SafeAreaView>
      </Modal>

      {/* Travellers & Class Selector Modal */}
      <Modal visible={showTravellersModal} animationType="fade" transparent>
        <View style={styles.travellersModalOverlay}>
          <View style={styles.travellersModalContent}>
            <Text style={styles.travellersModalTitle}>Travellers & Cabin Class</Text>

            {/* Travellers Incrementer */}
            <View style={styles.selectorRow}>
              <Text style={styles.selectorLabel}>Number of Travellers</Text>
              <View style={styles.counterBox}>
                <Pressable
                  disabled={localTravellers <= 1}
                  onPress={() => setLocalTravellers(localTravellers - 1)}
                  style={[styles.counterBtn, localTravellers <= 1 && styles.counterBtnDisabled]}
                >
                  <MaterialCommunityIcons name="minus" size={20} color={localTravellers <= 1 ? '#CCC' : '#0084FF'} />
                </Pressable>
                <Text style={styles.counterValue}>{localTravellers}</Text>
                <Pressable
                  disabled={localTravellers >= 9}
                  onPress={() => setLocalTravellers(localTravellers + 1)}
                  style={[styles.counterBtn, localTravellers >= 9 && styles.counterBtnDisabled]}
                >
                  <MaterialCommunityIcons name="plus" size={20} color={localTravellers >= 9 ? '#CCC' : '#0084FF'} />
                </Pressable>
              </View>
            </View>

            {/* Cabin Class Selection */}
            <Text style={styles.selectorLabelClass}>Cabin Class</Text>
            <View style={styles.classGroup}>
              {(['Economy', 'Premium Economy', 'Business'] as const).map((c) => {
                const selected = localCabinClass === c;
                return (
                  <Pressable
                    key={c}
                    onPress={() => setLocalCabinClass(c)}
                    style={[styles.classOptionBtn, selected && styles.classOptionBtnActive]}
                  >
                    <Text style={[styles.classOptionText, selected && styles.classOptionTextActive]}>
                      {c}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {/* Done & Cancel Action Buttons */}
            <View style={styles.travellersActions}>
              <Pressable onPress={() => setShowTravellersModal(false)} style={styles.travellersCancelBtn}>
                <Text style={styles.travellersCancelText}>CANCEL</Text>
              </Pressable>
              <Pressable onPress={handleTravellersSave} style={styles.travellersSaveBtn}>
                <Text style={styles.travellersSaveText}>DONE</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// Inline flat list helper to render airports inside city modal
function FlatListAirports({ airports, onSelect }: { airports: typeof popularAirports; onSelect: (city: string, code: string) => void }) {
  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: 16 }}>
      {airports.map((ap) => (
        <Pressable
          key={ap.code}
          onPress={() => onSelect(ap.city, ap.code)}
          style={styles.airportItem}
        >
          <View style={styles.airportItemLeft}>
            <MaterialCommunityIcons name="airplane" size={18} color="#8E8E93" style={{ marginRight: 12 }} />
            <View>
              <Text style={styles.airportCityName}>{ap.city}</Text>
              <Text style={styles.airportFullName}>{ap.airport}</Text>
            </View>
          </View>
          <Text style={styles.airportItemCode}>{ap.code}</Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F4F7',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
  },
  scrollContent: {
    paddingBottom: 80,
  },
  bookingCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
    marginBottom: 16,
  },
  tripTypeContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  tripTypeButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  tripTypeButtonActive: {
    borderColor: '#0084FF',
    backgroundColor: '#FFFFFF',
  },
  tripTypeText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#8E8E93',
  },
  tripTypeTextActive: {
    color: '#0084FF',
    fontWeight: '800',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  locationBox: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 8,
    padding: 12,
  },
  swapButtonContainer: {
    width: 24,
    alignItems: 'center',
    zIndex: 10,
    marginHorizontal: -12,
  },
  swapButton: {
    backgroundColor: '#EBF4FF',
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#0084FF',
  },
  fieldLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#8E8E93',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  cityText: {
    fontSize: 18,
    fontWeight: '900',
    color: colors.text,
    marginBottom: 2,
  },
  airportText: {
    fontSize: 10.5,
    color: '#8E8E93',
  },
  datesContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  dateBox: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 8,
    padding: 12,
    justifyContent: 'center',
  },
  dateValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  dateTextMain: {
    fontSize: 18,
    fontWeight: '900',
    color: colors.text,
  },
  dateTextSub: {
    fontSize: 12,
    color: '#8E8E93',
  },
  addReturnSub: {
    fontSize: 10.5,
    color: '#8E8E93',
  },
  travellersBox: {
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  travellersRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  travellersCount: {
    fontSize: 18,
    fontWeight: '900',
    color: colors.text,
  },
  travellersClass: {
    fontSize: 13,
    color: '#333333',
  },
  specialFaresSection: {
    marginBottom: 20,
  },
  specialFaresLabel: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#8E8E93',
    marginBottom: 8,
  },
  specialFaresScroll: {
    gap: 8,
    paddingRight: 20,
  },
  fareChip: {
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  fareChipActive: {
    borderColor: '#0084FF',
    backgroundColor: '#F5FAFF',
  },
  fareTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 2,
  },
  fareTitleActive: {
    color: '#0084FF',
  },
  fareSubtitle: {
    fontSize: 10,
    color: '#00A699',
  },
  fareSubtitleActive: {
    color: '#0084FF',
  },
  searchButton: {
    backgroundColor: '#0084FF',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
  },
  searchButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  quickLinksContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  quickLinkItem: {
    flex: 1,
    alignItems: 'center',
    position: 'relative',
  },
  quickLinkTag: {
    position: 'absolute',
    top: -10,
    backgroundColor: '#FFEBF3',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    zIndex: 2,
  },
  quickLinkTagText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#EF4444',
  },
  quickLinkIconBox: {
    width: 60,
    height: 48,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    marginBottom: 8,
  },
  quickLinkText: {
    fontSize: 10.5,
    color: '#333333',
    fontWeight: '500',
    textAlign: 'center',
  },
  adBannerContainer: {
    marginHorizontal: 16,
    height: 160,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 24,
  },
  adBannerImage: {
    width: '100%',
    height: '100%',
  },
  adBannerOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  adBannerContent: {
    ...StyleSheet.absoluteFillObject,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  adBannerTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    width: '70%',
    marginBottom: 4,
  },
  adBannerSubtitle: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
    marginBottom: 12,
  },
  adBannerButton: {
    backgroundColor: '#0084FF',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 4,
  },
  adBannerButtonText: {
    color: '#FFFFFF',
    fontSize: 10.5,
    fontWeight: '800',
  },
  offersHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  offersTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: colors.text,
  },
  viewAllText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0084FF',
  },
  offersScroll: {
    paddingHorizontal: 16,
    gap: 12,
  },
  offerCard: {
    width: 240,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  offerImage: {
    width: '100%',
    height: 100,
  },
  offerCardContent: {
    padding: 12,
  },
  offerCardTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 4,
  },
  offerCardSubtitle: {
    fontSize: 10.5,
    color: '#8E8E93',
  },
  footerSpacer: {
    height: 60,
  },
  flagshipContainer: {
    marginHorizontal: 16,
    marginBottom: 24,
  },
  flagshipTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: colors.text,
    marginBottom: 12,
  },
  flagshipBannerBox: {
    height: 140,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  flagshipLogoBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: '#FFF',
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flagshipLogoText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#0084FF',
    fontStyle: 'italic',
  },
  flagshipContent: {
    position: 'absolute',
    bottom: 12,
    left: 12,
  },
  flagshipHeadline: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  floatingActionBtnContainer: {
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
  floatingActionBtn: {
    backgroundColor: '#0084FF',
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  collapsedCard: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#D0E6FF',
    borderRadius: 12,
    backgroundColor: '#F5FAFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  collapsedDetails: {
    flex: 1,
  },
  collapsedRoute: {
    fontSize: 13,
    fontWeight: '900',
    color: '#111827',
  },
  collapsedMeta: {
    fontSize: 10.5,
    color: '#667085',
    marginTop: 2,
    fontWeight: '600',
  },
  collapsedSearchBtn: {
    backgroundColor: '#0084FF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    marginLeft: 8,
  },
  collapsedSearchBtnText: {
    color: '#FFFFFF',
    fontSize: 10.5,
    fontWeight: '800',
  },
  fareCalendarPromoCard: {
    backgroundColor: '#EBF4FF',
    borderColor: '#0084FF',
    borderWidth: 1,
    borderRadius: 12,
    marginHorizontal: 16,
    padding: 16,
    flexDirection: 'row',
    marginBottom: 24,
    gap: 12,
    alignItems: 'center',
  },
  fareCalendarIconBox: {
    width: 44,
    height: 44,
    backgroundColor: '#FFF',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fareCalendarContent: {
    flex: 1,
  },
  newBadge: {
    backgroundColor: '#00A699',
    alignSelf: 'flex-start',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginBottom: 4,
  },
  newBadgeText: {
    color: '#FFF',
    fontSize: 9,
    fontWeight: '900',
  },
  fareCalendarTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#333',
    lineHeight: 16,
  },
  exploreFareText: {
    color: '#0084FF',
    fontSize: 10.5,
    fontWeight: '900',
    marginTop: 6,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  modalCloseBtn: {
    marginRight: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
  },
  modalSearchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F4F7',
    margin: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
  },
  modalSearchInput: {
    flex: 1,
    fontSize: 13,
    color: '#333333',
  },
  popularAirportsHeading: {
    fontSize: 13,
    fontWeight: '800',
    color: '#8E8E93',
    marginHorizontal: 16,
    marginBottom: 12,
  },
  airportItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F4F7',
  },
  airportItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  airportCityName: {
    fontSize: 13,
    fontWeight: '800',
    color: '#333333',
  },
  airportFullName: {
    fontSize: 10.5,
    color: '#8E8E93',
    marginTop: 2,
  },
  airportItemCode: {
    fontSize: 13,
    fontWeight: '900',
    color: '#333333',
  },
  multiCityContainer: {
    marginBottom: 12,
  },
  multiCityRow: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 8,
    marginBottom: 8,
    alignItems: 'center',
    position: 'relative',
    backgroundColor: '#FFF',
  },
  multiLocationCol: {
    flex: 1,
    padding: 12,
    borderRightWidth: 1,
    borderRightColor: '#E5E5EA',
  },
  multiLocationColEmpty: {
    backgroundColor: '#F5FAFF',
  },
  multiCityRemoveBtn: {
    position: 'absolute',
    right: -6,
    top: -6,
    backgroundColor: '#FFF',
    borderRadius: 12,
    zIndex: 10,
  },
  addCityButton: {
    borderWidth: 1,
    borderColor: '#0084FF',
    borderStyle: 'dashed',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 4,
  },
  addCityText: {
    color: '#0084FF',
    fontSize: 12,
    fontWeight: '800',
  },
  travellersModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  travellersModalContent: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
  },
  travellersModalTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: '#333333',
    marginBottom: 20,
    textAlign: 'center',
  },
  selectorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  selectorLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#333333',
  },
  selectorLabelClass: {
    fontSize: 13,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 10,
  },
  counterBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 8,
  },
  counterBtn: {
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterBtnDisabled: {
    opacity: 0.5,
  },
  counterValue: {
    fontSize: 16,
    fontWeight: '800',
    color: '#333333',
    paddingHorizontal: 16,
  },
  classGroup: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 24,
  },
  classOptionBtn: {
    flex: 1,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  classOptionBtnActive: {
    borderColor: '#0084FF',
    backgroundColor: '#F5FAFF',
  },
  classOptionText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#8E8E93',
  },
  classOptionTextActive: {
    color: '#0084FF',
    fontWeight: '900',
  },
  travellersActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 16,
  },
  travellersCancelBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  travellersCancelText: {
    color: '#8E8E93',
    fontSize: 13,
    fontWeight: '800',
  },
  travellersSaveBtn: {
    backgroundColor: '#0084FF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  travellersSaveText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
});
