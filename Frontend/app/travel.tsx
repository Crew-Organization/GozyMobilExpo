import { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Dimensions,
} from 'react-native';
import { router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';

import { ScreenShell } from '@/src/components/screen-shell';
import { useApp } from '@/src/context/app-context';
import { api } from '@/src/lib/api';
import { useSuperAppStore } from '@/src/store/super-app-store';
import { defaultTravelSearch } from '@/src/lib/travel-data';
import type { TravelSearchParams } from '@/src/types';
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

export default function TravelScreen() {
  const { session } = useApp();
  const { setTravelResults, setTravelSearch, seedTravelContact } = useSuperAppStore();
  const [search, setSearch] = useState<TravelSearchParams>(defaultTravelSearch);
  const [isSearching, setIsSearching] = useState(false);
  const [tripType, setTripType] = useState<'ONE WAY' | 'ROUNDTRIP' | 'MULTICITY'>('ONE WAY');
  const [selectedFares, setSelectedFares] = useState<string[]>([]);

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

  return (
    <View style={styles.container}>
      {/* Custom Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Flight Search</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
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

          {/* From / To Locations */}
          <View style={styles.locationContainer}>
            <Pressable style={styles.locationBox}>
              <Text style={styles.fieldLabel}>FROM</Text>
              <Text style={styles.cityText}>{search.originCity}</Text>
              <Text style={styles.airportText} numberOfLines={1}>
                {search.originCode} - Intl Airport
              </Text>
            </Pressable>
            
            <View style={styles.swapButtonContainer}>
              <Pressable onPress={swapRoute} style={styles.swapButton}>
                <MaterialCommunityIcons name="swap-horizontal" size={16} color="#0084FF" />
              </Pressable>
            </View>

            <Pressable style={styles.locationBox}>
              <Text style={styles.fieldLabel}>TO</Text>
              <Text style={styles.cityText}>{search.destinationCity}</Text>
              <Text style={styles.airportText} numberOfLines={1}>
                {search.destinationCode} - Intl Airport
              </Text>
            </Pressable>
          </View>

          {/* Dates */}
          <View style={styles.datesContainer}>
            <Pressable style={styles.dateBox}>
              <Text style={styles.fieldLabel}>DEPARTURE DATE</Text>
              <View style={styles.dateValueRow}>
                <Text style={styles.dateTextMain}>11 Apr</Text>
                <Text style={styles.dateTextSub}>Sat, 2026</Text>
              </View>
            </Pressable>
            <Pressable style={styles.dateBox}>
              <Text style={[styles.fieldLabel, { color: '#0084FF', fontWeight: '800' }]}>
                +ADD RETURN DATE
              </Text>
              <Text style={styles.addReturnSub}>Save more on round trips!</Text>
            </Pressable>
          </View>

          {/* Travellers & Class */}
          <Pressable style={styles.travellersBox}>
            <Text style={styles.fieldLabel}>TRAVELLERS & CLASS</Text>
            <View style={styles.travellersRow}>
              <Text style={styles.travellersCount}>{search.travellers}, </Text>
              <Text style={styles.travellersClass}>{search.cabinClass}</Text>
            </View>
          </Pressable>

          {/* Special Fares */}
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

          {/* Search Button */}
          <Pressable onPress={runSearch} style={styles.searchButton}>
            <Text style={styles.searchButtonText}>
              {isSearching ? 'SEARCHING...' : 'SEARCH FLIGHTS'}
            </Text>
          </Pressable>
        </View>

        {/* Quick Links */}
        <View style={styles.quickLinksContainer}>
          {quickLinks.map((link) => (
            <Pressable key={link.id} style={styles.quickLinkItem}>
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

        {/* Ad Banner */}
        <View style={styles.adBannerContainer}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1200&q=80' }}
            style={styles.adBannerImage}
          />
          <LinearGradient colors={['transparent', 'rgba(0,0,0,0.8)']} style={styles.adBannerOverlay} />
          <View style={styles.adBannerContent}>
            <View style={styles.adBannerBadge}>
              <Text style={styles.adBannerBadgeText}>WORLD OF HYATT</Text>
            </View>
            <Text style={styles.adBannerTitle}>Experience Beachfront Luxury & Local Culture</Text>
            <Text style={styles.adBannerSubtitle}>At Hyatt Goa Hotels.</Text>
            <Pressable style={styles.adBannerButton}>
              <Text style={styles.adBannerButtonText}>BOOK NOW</Text>
            </Pressable>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F4F7', // Light gray background to pop the white cards
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60, // approximate status bar
    paddingBottom: 16,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
  },
  scrollContent: {
    paddingBottom: 40,
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
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 8,
    marginBottom: 16,
  },
  tripTypeButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tripTypeButtonActive: {
    backgroundColor: '#EBF4FF',
    borderWidth: 1,
    borderColor: '#0084FF',
    borderRadius: 8,
    margin: -1, // overlap the container border
  },
  tripTypeText: {
    fontSize: 12,
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
    fontSize: 11,
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
    fontSize: 11,
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
    fontSize: 14,
    color: '#333333',
  },
  specialFaresSection: {
    marginBottom: 20,
  },
  specialFaresLabel: {
    fontSize: 11,
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
    color: '#00A699', // Teal color from screenshot
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
    backgroundColor: '#F3E8FF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    zIndex: 2,
  },
  quickLinkTagText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#9333EA',
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
    fontSize: 11,
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
  adBannerBadge: {
    backgroundColor: '#0084FF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 2,
    marginBottom: 8,
  },
  adBannerBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#FFFFFF',
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
    fontSize: 14,
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
    fontSize: 11,
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
    fontSize: 14,
    fontWeight: '800',
    color: '#9333EA',
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
    fontSize: 11,
    color: '#8E8E93',
  },
  footerSpacer: {
    height: 60,
  },
});
