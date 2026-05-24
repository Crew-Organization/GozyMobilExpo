import { useEffect, useState } from 'react';
import { Dimensions, Pressable, ScrollView, StyleSheet, Text, View, TextInput, FlatList } from 'react-native';
import { MaterialCommunityIcons, FontAwesome6, Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { useApp } from '@/src/context/app-context';
import { useSuperAppStore } from '@/src/store/super-app-store';

const { width: screenWidth } = Dimensions.get('window');

const palette = {
  accent: '#F84464', // BookMyShow Pink
  accentSoft: '#FFF1F5',
  blue: '#2F6CE5',
  text: '#1F2937', // Darker text for white theme
  textDark: '#111827',
  muted: '#9CA3AF', // Muted text
  line: '#E5E7EB', // Light border lines
  surface: '#FFFFFF',
  canvas: '#FFFFFF', // White background as requested
  softBg: '#F3F4F6', // Light gray background for search/inputs
  shadow: 'rgba(0, 0, 0, 0.05)',
  success: '#10B981',
};

const POPULAR_CITIES = [
  { id: 'delhi', name: 'Delhi NCR', icon: 'castle' },
  { id: 'mumbai', name: 'Mumbai', icon: 'bridge' },
  { id: 'kolkata', name: 'Kolkata', icon: 'ship' },
  { id: 'bengaluru', name: 'Bengaluru', icon: 'office-building' },
  { id: 'hyderabad', name: 'Hyderabad', icon: 'church' },
  { id: 'chandigarh', name: 'Chandigarh', icon: 'tree' },
];

const ALL_CITIES = [
  'Abohar', 'Abu Dhabi', 'Abu Road', 'Achampet', 'Adilabad', 'Adipur', 'Agad', 'Agar', 'Agartala', 'Agra', 
  'Ahmedabad', 'Ahmedgarh', 'Ahmednagar', 'Aizawl', 'Ajmer', 'Akbarpur', 'Akividu', 'Akola', 'Alakode', 
  'Alangayam', 'Alangudi', 'Alappuzha', 'Alibag', 'Aligarh', 'Alipurduar', 'Allahabad', 'Almora', 'Alwar', 
  'Amadalavalasa', 'Amalapuram', 'Ambala', 'Ambajogai', 'Ambasamudram', 'Ambattur', 'Ambernath', 'Ambikapur', 
  'Amravati', 'Amreli', 'Amritsar', 'Anakapalle', 'Anand', 'Anantapur', 'Anantnag', 'Anjar', 'Anjangaon', 
  'Ankleshwar', 'Arakkonam', 'Arambagh', 'Araria', 'Arcot', 'Arrah', 'Aruppukottai', 'Asansol', 'Ashta', 
  'Aska', 'Assandh', 'Atmakur', 'Attili', 'Attur', 'Auraiya', 'Aurangabad', 'Avadi', 'Azamgarh',
];

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export default function EntertainmentScreen() {
  const insets = useSafeAreaInsets();
  const [currentScreen, setCurrentScreen] = useState<'home' | 'location'>('home');
  const [selectedCity, setSelectedCity] = useState('Aerocity, Delhi');
  const [searchQuery, setSearchQuery] = useState('');
  const [showProfileBanner, setShowProfileBanner] = useState(true);

  // Filter cities based on search
  const filteredCities = ALL_CITIES.filter((city) =>
    city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCitySelect = (cityName: string) => {
    setSelectedCity(cityName);
    setCurrentScreen('home');
    setSearchQuery('');
  };

  if (currentScreen === 'location') {
    return (
      <View style={[styles.root, { backgroundColor: palette.canvas }]}>
        <SafeAreaView edges={['top', 'bottom']} style={styles.safe}>
          {/* Header */}
          <View style={styles.locationHeader}>
            <Pressable onPress={() => setCurrentScreen('home')} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color={palette.text} />
            </Pressable>
            <Text style={styles.locationHeaderTitle}>Location</Text>
          </View>

          {/* Search bar */}
          <View style={styles.searchBarContainer}>
            <Ionicons name="search" size={20} color={palette.muted} style={styles.searchIcon} />
            <TextInput
              placeholder="Search city, area or locality"
              placeholderTextColor={palette.muted}
              value={searchQuery}
              onChangeText={setSearchQuery}
              style={styles.locationSearchInput}
            />
          </View>

          {searchQuery.length === 0 ? (
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.locationContent}>
              {/* Permission Banner */}
              <Pressable style={styles.permissionBanner}>
                <LinearGradient
                  colors={['#F84464', '#C026D3']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.permissionGradient}
                >
                  <View style={styles.permissionLeft}>
                    <View style={styles.locationIconCircle}>
                      <MaterialCommunityIcons name="map-marker-radius" size={24} color="#F84464" />
                    </View>
                    <View style={styles.permissionTexts}>
                      <Text style={styles.permissionTitle}>Enable location permissions →</Text>
                      <Text style={styles.permissionSubtitle}>for more relevant suggestions near you</Text>
                    </View>
                  </View>
                </LinearGradient>
              </Pressable>

              {/* Popular Cities */}
              <View style={styles.popularCitiesSection}>
                <Text style={styles.sectionHeadingText}>Popular cities</Text>
                <View style={styles.popularCitiesGrid}>
                  {POPULAR_CITIES.map((city) => (
                    <Pressable
                      key={city.id}
                      onPress={() => handleCitySelect(city.name)}
                      style={styles.popularCityCard}
                    >
                      <View style={styles.popularCityIconWrap}>
                        <MaterialCommunityIcons name={city.icon as any} size={28} color={palette.text} />
                      </View>
                      <Text style={styles.popularCityName}>{city.name}</Text>
                    </Pressable>
                  ))}
                </View>
              </View>

              {/* All Cities */}
              <View style={styles.allCitiesSection}>
                <View style={styles.allCitiesHeader}>
                  <Text style={styles.sectionHeadingText}>All cities</Text>
                </View>
                <View style={styles.citiesWithIndexRow}>
                  <View style={styles.citiesListContainer}>
                    {ALL_CITIES.map((city) => (
                      <Pressable
                        key={city}
                        onPress={() => handleCitySelect(city)}
                        style={styles.cityListItem}
                      >
                        <Text style={styles.cityListItemText}>{city}</Text>
                      </Pressable>
                    ))}
                  </View>

                  {/* A-Z Sidebar index */}
                  <View style={styles.alphabetIndexSidebar}>
                    {ALPHABET.map((letter) => (
                      <Text key={letter} style={styles.alphabetIndexLetter}>
                        {letter}
                      </Text>
                    ))}
                  </View>
                </View>
              </View>
            </ScrollView>
          ) : (
            <FlatList
              data={filteredCities}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <Pressable onPress={() => handleCitySelect(item)} style={styles.searchResultItem}>
                  <MaterialCommunityIcons name="map-marker-outline" size={20} color={palette.muted} />
                  <Text style={styles.searchResultText}>{item}</Text>
                </Pressable>
              )}
              contentContainerStyle={styles.searchResultsContainer}
            />
          )}
        </SafeAreaView>
      </View>
    );
  }

  // Home screen UI
  return (
    <View style={[styles.root, { backgroundColor: palette.canvas }]}>
      <SafeAreaView edges={['top']} style={styles.safe}>
        {/* Top Header */}
        <View style={styles.homeHeader}>
          <View style={styles.homeHeaderLeft}>
            {/* Back button near location to route back to dash */}
            <Pressable onPress={() => router.back()} style={styles.homeHeaderBackBtn}>
              <Ionicons name="arrow-back" size={24} color={palette.textDark} />
            </Pressable>
            <Pressable onPress={() => setCurrentScreen('location')} style={styles.locationSelectorRow}>
              <MaterialCommunityIcons name="map-marker" size={20} color={palette.textDark} />
              <View style={styles.locationTextContainer}>
                <View style={styles.locationNameWithArrow}>
                  <Text style={styles.locationTextBold}>{selectedCity.split(',')[0]}</Text>
                  <MaterialCommunityIcons name="chevron-down" size={16} color={palette.textDark} />
                </View>
                {selectedCity.includes(',') && (
                  <Text style={styles.locationTextSub}>{selectedCity.split(',')[1].trim()}</Text>
                )}
              </View>
            </Pressable>
          </View>

          <View style={styles.homeHeaderRight}>
            <Pressable style={styles.headerIconButton}>
              <Ionicons name="bookmark-outline" size={22} color={palette.textDark} />
            </Pressable>
            <Pressable style={styles.headerIconButton}>
              <Ionicons name="person-outline" size={22} color={palette.textDark} />
            </Pressable>
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.homeSearchBarContainer}>
          <Ionicons name="search" size={20} color={palette.muted} style={styles.searchIcon} />
          <TextInput
            placeholder="Search for 'Ginny Weds Sunny 2'"
            placeholderTextColor={palette.muted}
            editable={false}
            style={styles.homeSearchInput}
          />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.homeContent}>
          {/* Banner Carousel */}
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.bannersCarousel}
          >
            {/* Banner 1 - PLAY */}
            <View style={styles.bannerContainer}>
              <LinearGradient
                colors={['#0F172A', '#134E5E']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.bannerGradient}
              >
                <View style={styles.bannerLeftInfo}>
                  <Text style={styles.bannerSubtitle}>It&apos;s time to</Text>
                  <Text style={styles.bannerTitleMain}>PLAY</Text>
                  <Text style={styles.bannerDistrict}>In your District</Text>
                  <Text style={styles.bannerOfferText}>Get flat ₹100 OFF on your first 3 bookings</Text>
                  <Pressable style={styles.bannerButton}>
                    <Text style={styles.bannerButtonText}>Explore now ›</Text>
                  </Pressable>
                </View>
                {/* Visual decorators for play */}
                <View style={styles.bannerVisualRight}>
                  <View style={styles.sportsBallIconWrap}>
                    <MaterialCommunityIcons name="soccer" size={32} color="#E2E8F0" />
                  </View>
                  <View style={[styles.sportsBallIconWrap, styles.ballRight]}>
                    <MaterialCommunityIcons name="basketball" size={30} color="#F97316" />
                  </View>
                </View>
              </LinearGradient>
            </View>

            {/* Banner 2 - SUMMERTIME MADNESS */}
            <View style={styles.bannerContainer}>
              <LinearGradient
                colors={['#0284C7', '#06B6D4']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.bannerGradient}
              >
                <View style={styles.bannerLeftInfo}>
                  <Text style={styles.summerMadnessTitle}>SUMMERTIME{'\n'}MADNESS</Text>
                  <Text style={styles.summerMadnessSub}>Beat the heat at amusement parks</Text>
                  <Pressable style={[styles.bannerButton, { backgroundColor: '#FFFFFF' }]}>
                    <Text style={[styles.bannerButtonText, { color: '#0284C7' }]}>Up to 50% OFF ›</Text>
                  </Pressable>
                </View>
                <View style={styles.bannerVisualRight}>
                  <FontAwesome6 name="umbrella-beach" size={54} color="#FFF" style={styles.beachIcon} />
                </View>
              </LinearGradient>
            </View>
          </ScrollView>

          {/* Category Grid */}
          <View style={styles.categoryGridContainer}>
            <View style={styles.categoryRow}>
              {/* Row 1 */}
              <View style={styles.categoryCardItem}>
                <View style={[styles.categoryIconWrap, { backgroundColor: '#FDF2F8' }]}>
                  <MaterialCommunityIcons name="balloon" size={26} color="#DB2777" />
                </View>
                <Text style={styles.categoryLabelText}>Dining</Text>
              </View>
              <View style={styles.categoryCardItem}>
                <View style={[styles.categoryIconWrap, { backgroundColor: '#EFF6FF' }]}>
                  <MaterialCommunityIcons name="movie-play" size={26} color="#2563EB" />
                </View>
                <Text style={styles.categoryLabelText}>Movies</Text>
              </View>
              <View style={styles.categoryCardItem}>
                <View style={[styles.categoryIconWrap, { backgroundColor: '#FEF3C7' }]}>
                  <MaterialCommunityIcons name="microphone-variant" size={26} color="#D97706" />
                </View>
                <Text style={styles.categoryLabelText}>Events</Text>
              </View>
            </View>

            <View style={[styles.categoryRow, { marginTop: 14 }]}>
              {/* Row 2 */}
              <View style={styles.categoryCardItem}>
                <View style={[styles.categoryIconWrap, { backgroundColor: '#FFF7ED' }]}>
                  <MaterialCommunityIcons name="cricket" size={26} color="#EA580C" />
                </View>
                <Text style={styles.categoryLabelText}>IPL</Text>
              </View>
              <View style={styles.categoryCardItem}>
                <View style={[styles.categoryIconWrap, { backgroundColor: '#ECFDF5' }]}>
                  <MaterialCommunityIcons name="shopping" size={26} color="#059669" />
                </View>
                <Text style={styles.categoryLabelText}>Stores</Text>
              </View>
              <View style={styles.categoryCardItem}>
                <View style={[styles.categoryIconWrap, { backgroundColor: '#F5F3FF' }]}>
                  <MaterialCommunityIcons name="gamepad-variant" size={26} color="#7C3AED" />
                </View>
                <Text style={styles.categoryLabelText}>Activities</Text>
              </View>
              <View style={styles.categoryCardItem}>
                <View style={[styles.categoryIconWrap, { backgroundColor: '#ECFEFF' }]}>
                  <MaterialCommunityIcons name="play-circle" size={26} color="#0891B2" />
                  <View style={styles.newBadge}>
                    <Text style={styles.newBadgeText}>NEW</Text>
                  </View>
                </View>
                <Text style={styles.categoryLabelText}>Play</Text>
              </View>
            </View>
          </View>

          {/* IN THE SPOTLIGHT */}
          <View style={styles.spotlightHeader}>
            <View style={styles.spotlightLine} />
            <Text style={styles.spotlightTitle}>IN THE SPOTLIGHT</Text>
            <View style={styles.spotlightLine} />
          </View>

          {/* Spotlight Event Card */}
          <View style={styles.spotlightCard}>
            <Image
              source="https://images.unsplash.com/photo-1516280440614-37939bbacd6a?auto=format&fit=crop&w=1200&q=80"
              style={styles.spotlightCardImage}
              contentFit="cover"
            />
            {/* Share action */}
            <Pressable style={styles.shareIconButton}>
              <Ionicons name="share-social-outline" size={18} color="#FFFFFF" />
            </Pressable>

            <View style={styles.spotlightCardDetails}>
              <Text style={styles.spotlightCardDate}>Mon, 27 Apr - Fri, 1 May, Multiple slots</Text>
              <View style={styles.spotlightCardTitleRow}>
                <Text style={styles.spotlightCardTitle}>
                  Comedy Circus Gurgaon | A Standup Comedy Lineup Show
                </Text>
                <Pressable style={styles.spotlightCardBookmarkBtn}>
                  <Ionicons name="bookmark-outline" size={20} color={palette.text} />
                </Pressable>
              </View>
              <Text style={styles.spotlightCardVenue}>Gurugram</Text>
            </View>
          </View>
        </ScrollView>

        {/* Sticky Profile Completion Banner */}
        {showProfileBanner && (
          <View style={[styles.profileBanner, { bottom: 0 }]}>
            <View style={styles.profileBannerLeft}>
              <View style={styles.profileBannerAvatar}>
                <Ionicons name="person" size={20} color={palette.muted} />
              </View>
              <View style={styles.profileBannerTextWrap}>
                <Text style={styles.profileBannerTitle}>Complete your profile</Text>
                <Text style={styles.profileBannerSub}>Add your email and other details</Text>
              </View>
            </View>
            <View style={styles.profileBannerRight}>
              <Pressable style={styles.profileBannerAddBtn}>
                <Text style={styles.profileBannerAddBtnText}>Add</Text>
              </Pressable>
              <Pressable onPress={() => setShowProfileBanner(false)} style={styles.profileBannerCloseBtn}>
                <Ionicons name="close" size={18} color={palette.text} />
              </Pressable>
            </View>
          </View>
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  safe: {
    flex: 1,
  },
  // Location Selection Styling
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: palette.line,
  },
  backButton: {
    marginRight: 16,
  },
  locationHeaderTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: palette.textDark,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: palette.softBg,
    marginHorizontal: 16,
    marginTop: 14,
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 44,
  },
  searchIcon: {
    marginRight: 8,
  },
  locationSearchInput: {
    flex: 1,
    fontSize: 15,
    color: palette.textDark,
    height: '100%',
  },
  locationContent: {
    paddingBottom: 24,
  },
  permissionBanner: {
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  permissionGradient: {
    padding: 16,
  },
  permissionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  permissionTexts: {
    flex: 1,
  },
  permissionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  permissionSubtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
  popularCitiesSection: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionHeadingText: {
    fontSize: 14,
    fontWeight: '700',
    color: palette.text,
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  popularCitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginHorizontal: -4,
  },
  popularCityCard: {
    width: '31%',
    alignItems: 'center',
    marginBottom: 18,
    paddingVertical: 8,
  },
  popularCityIconWrap: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: palette.line,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  popularCityName: {
    fontSize: 12,
    fontWeight: '500',
    color: palette.text,
    marginTop: 8,
    textAlign: 'center',
  },
  allCitiesSection: {
    marginTop: 12,
    paddingLeft: 16,
  },
  allCitiesHeader: {
    borderBottomWidth: 1,
    borderBottomColor: palette.line,
    paddingBottom: 8,
    marginRight: 16,
  },
  citiesWithIndexRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  citiesListContainer: {
    flex: 1,
    paddingRight: 16,
  },
  cityListItem: {
    paddingVertical: 14,
    borderBottomWidth: 0.5,
    borderBottomColor: palette.line,
  },
  cityListItemText: {
    fontSize: 14,
    color: palette.text,
  },
  alphabetIndexSidebar: {
    width: 24,
    alignItems: 'center',
    paddingVertical: 12,
  },
  alphabetIndexLetter: {
    fontSize: 10,
    fontWeight: '600',
    color: palette.text,
    paddingVertical: 2,
  },
  searchResultsContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  searchResultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 0.5,
    borderBottomColor: palette.line,
  },
  searchResultText: {
    fontSize: 15,
    color: palette.text,
    marginLeft: 12,
  },

  // Home Screen Styling
  homeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  homeHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  homeHeaderBackBtn: {
    marginRight: 12,
  },
  locationSelectorRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationTextContainer: {
    marginLeft: 6,
  },
  locationNameWithArrow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationTextBold: {
    fontSize: 16,
    fontWeight: '700',
    color: palette.textDark,
  },
  locationTextSub: {
    fontSize: 11,
    color: palette.muted,
    marginTop: 1,
  },
  homeHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIconButton: {
    marginLeft: 16,
    padding: 4,
  },
  homeSearchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: palette.softBg,
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 40,
  },
  homeSearchInput: {
    flex: 1,
    fontSize: 14,
    color: palette.textDark,
  },
  homeContent: {
    paddingBottom: 80,
  },
  bannersCarousel: {
    paddingHorizontal: 16,
    gap: 12,
    marginTop: 8,
  },
  bannerContainer: {
    width: screenWidth - 32,
    height: 160,
    borderRadius: 12,
    overflow: 'hidden',
  },
  bannerGradient: {
    flex: 1,
    flexDirection: 'row',
    padding: 16,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bannerLeftInfo: {
    flex: 1.2,
    justifyContent: 'center',
  },
  bannerSubtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '600',
  },
  bannerTitleMain: {
    fontSize: 28,
    fontWeight: '900',
    color: '#38BDF8',
    letterSpacing: 2,
    lineHeight: 32,
  },
  bannerDistrict: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '700',
    marginTop: -2,
  },
  bannerOfferText: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 8,
  },
  bannerButton: {
    backgroundColor: '#38BDF8',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginTop: 10,
  },
  bannerButtonText: {
    color: '#0F172A',
    fontSize: 11,
    fontWeight: '700',
  },
  bannerVisualRight: {
    flex: 0.8,
    justifyContent: 'center',
    alignItems: 'flex-end',
    height: '100%',
  },
  sportsBallIconWrap: {
    opacity: 0.3,
    transform: [{ rotate: '-15deg' }],
  },
  ballRight: {
    marginTop: 10,
    marginRight: 20,
    opacity: 0.4,
    transform: [{ rotate: '20deg' }],
  },
  summerMadnessTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FFFFFF',
    lineHeight: 24,
  },
  summerMadnessSub: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 4,
  },
  beachIcon: {
    opacity: 0.8,
    marginRight: 10,
  },

  // Category Grid
  categoryGridContainer: {
    marginHorizontal: 16,
    marginTop: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: palette.line,
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  categoryCardItem: {
    width: '22%',
    alignItems: 'center',
  },
  categoryIconWrap: {
    width: 54,
    height: 54,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  categoryLabelText: {
    fontSize: 12,
    fontWeight: '600',
    color: palette.text,
    marginTop: 8,
    textAlign: 'center',
  },
  newBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: palette.accent,
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 6,
  },
  newBadgeText: {
    color: '#FFFFFF',
    fontSize: 7,
    fontWeight: '800',
  },

  // Spotlight Section
  spotlightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    paddingHorizontal: 16,
  },
  spotlightLine: {
    flex: 1,
    height: 1,
    backgroundColor: palette.line,
  },
  spotlightTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: palette.muted,
    marginHorizontal: 12,
    letterSpacing: 1,
  },
  spotlightCard: {
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: palette.line,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  spotlightCardImage: {
    width: '100%',
    height: 200,
  },
  shareIconButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.5)',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  spotlightCardDetails: {
    padding: 16,
  },
  spotlightCardDate: {
    fontSize: 11,
    fontWeight: '600',
    color: '#D97706', // Warm Orange
    textTransform: 'uppercase',
  },
  spotlightCardTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: 6,
  },
  spotlightCardTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: palette.textDark,
    lineHeight: 20,
    marginRight: 12,
  },
  spotlightCardBookmarkBtn: {
    padding: 2,
  },
  spotlightCardVenue: {
    fontSize: 12,
    color: palette.muted,
    marginTop: 4,
  },

  // Sticky bottom banner
  profileBanner: {
    position: 'absolute',
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: palette.line,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 8,
  },
  profileBannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  profileBannerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: palette.softBg,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  profileBannerTextWrap: {
    flex: 1,
  },
  profileBannerTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: palette.textDark,
  },
  profileBannerSub: {
    fontSize: 11,
    color: palette.muted,
    marginTop: 1,
  },
  profileBannerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileBannerAddBtn: {
    backgroundColor: palette.textDark,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 6,
    marginRight: 12,
  },
  profileBannerAddBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  profileBannerCloseBtn: {
    padding: 4,
  },
});
