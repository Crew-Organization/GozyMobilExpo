import { useState, useRef } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, TextInput, Animated } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { ScreenShell } from '@/src/components/screen-shell';
import { CabHeader } from './cab-header';
import CinematicSplash from './_cinematic-splash';
import CabEntrySplash from './cab-entry-splash';
import { cabTabs, type CabTabId } from '@/src/lib/cab-data';
import { colors, radius, spacing, typography } from '@/src/theme/tokens';

const mockSuggestions = [
  'Rajiv Gandhi International Airport (HYD), Hyderabad',
  'B.N Reddy Nagar, Hyderabad, Telangana',
  'Gugudu Kullayappa Swamy Temple, Anantapur, Andhra Pradesh',
  'Thane Railway Station, Thane, Maharashtra',
  'Kalyan Junction, Kalyan, Maharashtra',
  'Secunderabad Junction Railway Station, Secunderabad',
  'Gachibowli DLF Cyber City, Hyderabad',
  'Hitech City Metro Station, Hyderabad',
];

export default function CabSearchScreen() {
  const [activeTab, setActiveTab] = useState<CabTabId>('airport');
  const [tripType, setTripType] = useState<'one-way' | 'round-trip'>('one-way');
  const [returnToPickup, setReturnToPickup] = useState(false);

  const [fromText, setFromText] = useState('Your Live Location (Secunderabad, Telangana)');
  const [toText, setToText] = useState('');
  const [focusedInput, setFocusedInput] = useState<'from' | 'to' | null>(null);
  const [toError, setToError] = useState(false);

  // Shake animation for TO field
  const shakeX = useRef(new Animated.Value(0)).current;
  const triggerShake = () => {
    Animated.sequence([
      Animated.timing(shakeX, { toValue: 8,  duration: 60, useNativeDriver: true }),
      Animated.timing(shakeX, { toValue: -8, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeX, { toValue: 6,  duration: 50, useNativeDriver: true }),
      Animated.timing(shakeX, { toValue: -6, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeX, { toValue: 0,  duration: 40, useNativeDriver: true }),
    ]).start();
  };

  const handleSearch = () => {
    // Hourly drop is optional; all other tabs require a destination
    if (!isHourly && !toText.trim()) {
      setToError(true);
      triggerShake();
      return;
    }
    setToError(false);
    router.push({ pathname: '/(cab-module)/cab-loading', params: { type: activeTab } });
  };

  const selectLocation = (val: string) => {
    if (focusedInput === 'from') {
      setFromText(val);
    } else {
      setToText(val);
    }
    setFocusedInput(null);
  };

  const isOutstation = activeTab === 'outstation';
  const isHourly = activeTab === 'hourly';

  // ── Cinematic Cabs Entry Splash Screen ────────────────────────────
  const [splashVisible, setSplashVisible] = useState(true);
  const contentOpacity = useRef(new Animated.Value(0)).current;
  const contentScale = useRef(new Animated.Value(0.97)).current;

  const handlePrepareExit = () => {
    Animated.parallel([
      Animated.timing(contentOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(contentScale, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleSplashFinish = () => {
    setSplashVisible(false);
  };

  return (
    <View style={{ flex: 1 }}>
      <CinematicSplash />

      {splashVisible && (
        <CabEntrySplash 
          onPrepareExit={handlePrepareExit} 
          onFinish={handleSplashFinish} 
        />
      )}

      <Animated.View style={{ flex: 1, opacity: splashVisible ? contentOpacity : 1, transform: [{ scale: splashVisible ? contentScale : 1 }] }}>
        <ScreenShell scroll={false} style={styles.shell}>
        <CabHeader
        title="Cab Search"
        onBack={() => router.back()}
      />

      {/* Tabs Container */}
      <View style={styles.tabsContainer}>
        <View style={styles.tabsRow}>
          {cabTabs.map((tab) => {
            const active = activeTab === tab.id;
            let iconName: keyof typeof MaterialCommunityIcons.glyphMap = 'car';
            if (tab.id === 'airport') iconName = 'airplane';
            else if (tab.id === 'hourly') iconName = 'clock-outline';
            else if (tab.id === 'railway') iconName = 'train';

            return (
              <Pressable
                key={tab.id}
                onPress={() => setActiveTab(tab.id)}
                style={styles.tab}>
                <MaterialCommunityIcons 
                  name={iconName} 
                  size={26} 
                  color={active ? '#4F46E5' : '#64748B'} 
                  style={active && styles.activeIcon}
                />
                <Text style={[styles.tabText, active && styles.tabTextActive]}>
                  {tab.id === 'outstation' ? 'Outstation\ntrips' : tab.id === 'airport' ? 'Airport\nTransfer' : tab.id === 'hourly' ? 'Hourly\nRentals' : 'Railway\nTransfers'}
                </Text>
                {active ? <View style={styles.tabUnderline} /> : null}
              </Pressable>
            );
          })}
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Form Card */}
        <View style={styles.formCard}>
          {/* Flight Tracked Banner for Airport Transfer */}
          {activeTab === 'airport' && (
            <View style={styles.flightBanner}>
              <View style={styles.flightIconWrapper}>
                <MaterialCommunityIcons name="airplane-landing" size={24} color="#4F46E5" />
                <View style={styles.flightCheckBadge}>
                  <MaterialCommunityIcons name="check-circle" size={12} color="#10B981" />
                </View>
              </View>
              <View style={styles.flightTextContainer}>
                <Text style={styles.flightTitle}>Flight Tracked Cab</Text>
                <Text style={styles.flightSub}>Cab ready whenever you land</Text>
              </View>
            </View>
          )}

          {/* Verified Banner for Hourly Rentals */}
          {activeTab === 'hourly' && (
            <View style={styles.verifiedBanner}>
              <View style={styles.verifiedIconWrapper}>
                <MaterialCommunityIcons name="shield-check" size={24} color="#0D9488" />
              </View>
              <View style={styles.verifiedTextContainer}>
                <Text style={styles.verifiedTitle}>Clean Cabs with Verified Drivers</Text>
                <Text style={styles.verifiedSub}>Always on-time cabs</Text>
              </View>
            </View>
          )}
          {/* Segmented Control for Outstation */}
          {isOutstation ? (
            <View style={styles.segmentedControl}>
              <Pressable 
                onPress={() => setTripType('one-way')} 
                style={[styles.segmentBtn, tripType === 'one-way' && styles.segmentBtnActive]}>
                <Text style={[styles.segmentText, tripType === 'one-way' && styles.segmentTextActive]}>One Way</Text>
              </Pressable>
              <Pressable 
                onPress={() => setTripType('round-trip')} 
                style={[styles.segmentBtn, tripType === 'round-trip' && styles.segmentBtnActive]}>
                <Text style={[styles.segmentText, tripType === 'round-trip' && styles.segmentTextActive]}>Round Trip</Text>
              </Pressable>
            </View>
          ) : null}

          {/* Location Fields Stack */}
          {isHourly ? (
            <View style={styles.locationContainer}>
              <View style={styles.locationRow}>
                <MaterialCommunityIcons name="map-marker-outline" size={24} color="#94A3B8" style={styles.locationIcon} />
                <View style={styles.inputStack}>
                  <Text style={styles.inputLabel}>PICK UP ADDRESS</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TextInput 
                      placeholder="Enter pick up address" 
                      placeholderTextColor="#CBD5E1" 
                      style={[styles.textInput, { flex: 1 }]} 
                      value={fromText}
                      onChangeText={(val) => {
                        setFromText(val);
                        setFocusedInput('from');
                      }}
                      onFocus={() => setFocusedInput('from')}
                      onSubmitEditing={() => setFocusedInput(null)}
                    />
                    {fromText ? (
                      <Pressable onPress={() => setFromText('')} style={{ padding: 4 }}>
                        <MaterialCommunityIcons name="close-circle" size={18} color="#94A3B8" />
                      </Pressable>
                    ) : null}
                  </View>
                </View>
              </View>
              <View style={styles.divider} />
              <View style={styles.locationRow}>
                <MaterialCommunityIcons name="map-marker" size={24} color="#818CF8" style={styles.locationIcon} />
                <View style={styles.inputStack}>
                  <Text style={styles.inputLabel}>DROP ADDRESS (OPTIONAL)</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TextInput 
                      placeholder="Enter drop address" 
                      placeholderTextColor="#CBD5E1" 
                      style={[styles.textInput, { flex: 1 }]} 
                      value={toText}
                      onChangeText={(val) => {
                        setToText(val);
                        setFocusedInput('to');
                      }}
                      onFocus={() => setFocusedInput('to')}
                      onSubmitEditing={() => setFocusedInput(null)}
                    />
                    {toText ? (
                      <Pressable onPress={() => setToText('')} style={{ padding: 4 }}>
                        <MaterialCommunityIcons name="close-circle" size={18} color="#94A3B8" />
                      </Pressable>
                    ) : null}
                  </View>
                </View>
              </View>
            </View>
          ) : (
            <View style={styles.locationContainer}>
              <View style={styles.locationRow}>
                <MaterialCommunityIcons name="map-marker-outline" size={24} color="#94A3B8" style={styles.locationIcon} />
                <View style={styles.inputStack}>
                  <Text style={styles.inputLabel}>FROM</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TextInput 
                      placeholder="Enter pick up address" 
                      placeholderTextColor="#CBD5E1" 
                      style={[styles.textInput, { flex: 1 }]} 
                      value={fromText}
                      onChangeText={(val) => {
                        setFromText(val);
                        setFocusedInput('from');
                      }}
                      onFocus={() => setFocusedInput('from')}
                      onSubmitEditing={() => setFocusedInput(null)}
                    />
                    {fromText ? (
                      <Pressable onPress={() => setFromText('')} style={{ padding: 4 }}>
                        <MaterialCommunityIcons name="close-circle" size={18} color="#94A3B8" />
                      </Pressable>
                    ) : null}
                  </View>
                </View>
              </View>
              <View style={styles.divider} />
              <Animated.View style={{ transform: [{ translateX: shakeX }] }}>
                <View style={[
                  styles.locationRow,
                  toError && { backgroundColor: '#FFF1F2' },
                ]}>
                  <MaterialCommunityIcons name="map-marker" size={24} color={toError ? '#EF4444' : '#818CF8'} style={styles.locationIcon} />
                  <View style={styles.inputStack}>
                    <Text style={[styles.inputLabel, toError && { color: '#EF4444' }]}>TO *</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <TextInput 
                        placeholder="Enter drop address" 
                        placeholderTextColor={toError ? '#FCA5A5' : '#CBD5E1'} 
                        style={[styles.textInput, { flex: 1 }, toError && { color: '#DC2626' }]} 
                        value={toText}
                        onChangeText={(val) => {
                          setToText(val);
                          setFocusedInput('to');
                          if (val.trim()) setToError(false);
                        }}
                        onFocus={() => { setFocusedInput('to'); setToError(false); }}
                        onSubmitEditing={() => setFocusedInput(null)}
                      />
                      {toText ? (
                        <Pressable onPress={() => setToText('')} style={{ padding: 4 }}>
                          <MaterialCommunityIcons name="close-circle" size={18} color="#94A3B8" />
                        </Pressable>
                      ) : null}
                    </View>
                  </View>
                </View>
                {toError && (
                  <View style={styles.toErrorRow}>
                    <MaterialCommunityIcons name="alert-circle" size={13} color="#EF4444" />
                    <Text style={styles.toErrorText}>Please enter a drop address to continue</Text>
                  </View>
                )}
              </Animated.View>
              {/* Swap Button */}
              <Pressable 
                onPress={() => {
                  const temp = fromText;
                  setFromText(toText);
                  setToText(temp);
                }} 
                style={styles.swapBtn}>
                <MaterialCommunityIcons name="swap-vertical" size={18} color="#4F46E5" />
              </Pressable>
            </View>
          )}

          {/* Suggestions Dropdown */}
          {focusedInput ? (
            <View style={styles.suggestionsContainer}>
              <Text style={styles.suggestionsTitle}>
                {focusedInput === 'from' ? 'SUGGESTED PICK UP' : 'SUGGESTED DROP-OFF'}
              </Text>
              
              {/* Special GPS Suggestion for from text */}
              {focusedInput === 'from' ? (
                <Pressable 
                  onPress={() => selectLocation('Your Live Location (Secunderabad, Telangana)')} 
                  style={[styles.suggestionItem, { backgroundColor: '#EEF2F6', paddingHorizontal: 8, borderRadius: radius.xs, marginBottom: 4 }]}>
                  <MaterialCommunityIcons name="crosshairs-gps" size={20} color="#4F46E5" />
                  <Text style={[styles.suggestionText, { color: '#4F46E5', fontWeight: '700' }]} numberOfLines={1}>
                    Use Current Location
                  </Text>
                </Pressable>
              ) : null}

              {((focusedInput === 'from' ? fromText : toText) || '').length > 0 ? (
                mockSuggestions.filter(item =>
                  item.toLowerCase().includes((focusedInput === 'from' ? fromText : toText).toLowerCase())
                ).map((item) => (
                  <Pressable key={item} onPress={() => selectLocation(item)} style={styles.suggestionItem}>
                    <MaterialCommunityIcons name="map-marker-radius-outline" size={20} color="#64748B" />
                    <Text style={styles.suggestionText} numberOfLines={1}>{item}</Text>
                  </Pressable>
                ))
              ) : (
                mockSuggestions.slice(0, 4).map((item) => (
                  <Pressable key={item} onPress={() => selectLocation(item)} style={styles.suggestionItem}>
                    <MaterialCommunityIcons name="clock-outline" size={20} color="#94A3B8" />
                    <Text style={styles.suggestionText} numberOfLines={1}>{item}</Text>
                  </Pressable>
                ))
              )}
            </View>
          ) : null}

          {/* Add Stops Button */}
          {isOutstation ? (
            <View style={styles.addStopsRow}>
              <Pressable style={styles.addStopsBtn}>
                <MaterialCommunityIcons name="plus" size={18} color="#4F46E5" />
                <Text style={styles.addStopsText}>ADD STOPS</Text>
              </Pressable>
              <View style={styles.newBadge}>
                <Text style={styles.newBadgeText}>NEW</Text>
              </View>
            </View>
          ) : null}

          {/* Checkbox for Hourly */}
          {isHourly ? (
            <Pressable 
              onPress={() => setReturnToPickup(!returnToPickup)} 
              style={styles.checkboxRow}>
              <View style={[styles.checkbox, returnToPickup && styles.checkboxActive]}>
                {returnToPickup && (
                  <MaterialCommunityIcons name="check" size={16} color={colors.white} />
                )}
              </View>
              <Text style={styles.checkboxText}>I want to return to the pickup location</Text>
            </Pressable>
          ) : null}

          {/* Date & Travellers fields */}
          <View style={styles.infoRow}>
            {/* Trip Start */}
            <View style={styles.infoCard}>
              <MaterialCommunityIcons name="calendar-month-outline" size={22} color="#94A3B8" style={styles.infoIcon} />
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabelText}>TRIP START</Text>
                <View style={styles.dateTimeRow}>
                  <Text style={styles.infoValueText} numberOfLines={1}>Thu, 4 Jun</Text>
                  <Text style={styles.infoValueText} numberOfLines={1}>10:00 AM</Text>
                </View>
              </View>
            </View>

             {/* Selector package (Hourly) vs Travellers (Outstation) */}
            {isHourly ? (
              <View style={styles.infoCard}>
                <MaterialCommunityIcons name="clock-outline" size={22} color="#94A3B8" style={styles.infoIcon} />
                <View style={styles.infoTextContainer}>
                  <Text style={styles.infoLabelText}>PACKAGE</Text>
                  <Text style={styles.infoValueText} numberOfLines={1}>1 Hrs 10 Kms</Text>
                </View>
              </View>
            ) : (activeTab !== 'airport' && activeTab !== 'railway') ? (
              <View style={styles.infoCard}>
                <MaterialCommunityIcons name="account-outline" size={22} color="#94A3B8" style={styles.infoIcon} />
                <View style={styles.infoTextContainer}>
                  <Text style={styles.infoLabelText}>TRAVELLERS</Text>
                  <Text style={styles.infoValueTextMuted} numberOfLines={1}>Optional</Text>
                </View>
              </View>
            ) : null}
          </View>

          {/* CTA Search button */}
          <Pressable
            onPress={handleSearch}
            style={styles.searchBtn}>
            <Text style={styles.searchBtnText}>SEARCH CABS</Text>
          </Pressable>
        </View>

        {/* Promo Banner for Outstation Only */}
        {activeTab === 'outstation' && (
          <LinearGradient 
            colors={['#FFF7ED', '#FEF3C7']} 
            start={{ x: 0, y: 0 }} 
            end={{ x: 1, y: 0 }} 
            style={styles.promoBanner}>
            <View style={styles.promoTextContainer}>
              <Text style={styles.promoTitle}>Plan your multicity road trip</Text>
              <Text style={styles.promoSubtitle}>Add multiple stops effortlessly.</Text>
            </View>
            <View style={styles.promoChevron}>
              <MaterialCommunityIcons name="chevron-right" size={16} color="#F59E0B" />
            </View>
          </LinearGradient>
        )}

        {/* Trust Indicator Footer */}
        <View style={styles.trustBanner}>
          <Text style={styles.trustCount}>
            {activeTab === 'hourly' ? '32,000+' : '6,40,000+'}
          </Text>
          <Text style={styles.trustText}>
            {activeTab === 'hourly' ? 'Customers trusted us with their local Hourly rental trips.' : 'Customers trusted us with their Airport Trips this year.'}
          </Text>
        </View>

        {/* Dynamic Lower Section: Trending Offers vs What's New vs Railway Offers */}
        {activeTab === 'hourly' ? (
          <View style={styles.whatsNewSection}>
            <Text style={styles.sectionTitle}>What&apos;s New</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.whatsNewScroll}>
              {/* Info Card 1 */}
              <View style={styles.infoNewCard}>
                <View style={[styles.infoNewIconBg, { backgroundColor: '#FFF7ED' }]}>
                  <MaterialCommunityIcons name="car-outline" size={28} color="#F97316" />
                  <View style={styles.infoNewPlaneBadge}>
                    <MaterialCommunityIcons name="airplane" size={10} color="#475569" />
                  </View>
                </View>
                <View style={styles.infoNewTextStack}>
                  <Text style={styles.infoNewTitle}>Pre-book International Airport cabs</Text>
                  <Text style={styles.infoNewSub}>Get guaranteed airport cabs outside India with meet & greet services.</Text>
                </View>
              </View>

              {/* Info Card 2 */}
              <View style={styles.infoNewCard}>
                <View style={[styles.infoNewIconBg, { backgroundColor: '#EFF6FF' }]}>
                  <MaterialCommunityIcons name="wallet-outline" size={28} color="#3B82F6" />
                </View>
                <View style={styles.infoNewTextStack}>
                  <Text style={styles.infoNewTitle}>Make Your Trips Affordable</Text>
                  <Text style={styles.infoNewSub}>With Book Now, Pay Later & No-Cost EMI Offers on all rentals.</Text>
                </View>
              </View>
            </ScrollView>
          </View>
        ) : activeTab === 'railway' ? (
          /* Railway Offers Section */
          <View style={styles.offersSection}>
            <Text style={styles.sectionTitle}>Offers</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.offersScroll}>
              {/* Offer Card 1 */}
              <View style={styles.offerCardRailway}>
                <LinearGradient colors={['#EEF2FF', '#C7D2FE']} style={styles.offerGradientRailway}>
                  <Text style={[styles.offerTitleTextRailway, { color: '#4F46E5' }]} numberOfLines={2}>Summer Escape</Text>
                  <View style={styles.offerBadgeRailway}>
                    <Text style={styles.offerBadgeTextRailway}>OFFERS</Text>
                  </View>
                </LinearGradient>
                <View style={styles.offerBookNowBar}>
                  <Text style={styles.bookNowText}>BOOK NOW</Text>
                  <MaterialCommunityIcons name="chevron-right" size={16} color="#4F46E5" />
                </View>
              </View>

              {/* Offer Card 2 */}
              <View style={styles.offerCardRailway}>
                <LinearGradient colors={['#FFEDD5', '#FED7AA']} style={styles.offerGradientRailway}>
                  <Text style={[styles.offerTitleTextRailway, { color: '#EA580C' }]} numberOfLines={2}>Char Dham Yatra</Text>
                </LinearGradient>
                <View style={styles.offerBookNowBar}>
                  <Text style={styles.bookNowText}>BOOK NOW</Text>
                  <MaterialCommunityIcons name="chevron-right" size={16} color="#EA580C" />
                </View>
              </View>
            </ScrollView>
          </View>
        ) : (
          /* Offers Section */
          <View style={styles.offersSection}>
            <Text style={styles.sectionTitle}>Trending Offers</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.offersScroll}>
              {/* Offer Card 1 */}
              <View style={styles.offerCard}>
                <LinearGradient colors={['#22D3EE', '#3B82F6']} style={styles.offerGradient}>
                  <View style={styles.offerBadge}>
                    <Text style={styles.offerBadgeText}>SUMMER SALE</Text>
                  </View>
                </LinearGradient>
                <View style={styles.offerDetails}>
                  <Text style={styles.offerTitleText}>Up to 20% OFF</Text>
                  <Text style={styles.offerSubtext}>On outstation summer trips</Text>
                </View>
              </View>

              {/* Offer Card 2 */}
              <View style={styles.offerCard}>
                <LinearGradient colors={['#B45309', '#292524']} style={styles.offerGradient}>
                  <View style={styles.offerBadgeAmber}>
                    <Text style={styles.offerBadgeTextAmber}>PILGRIMAGE</Text>
                  </View>
                </LinearGradient>
                <View style={styles.offerDetails}>
                  <Text style={styles.offerTitleText}>Flat ₹500 OFF</Text>
                  <Text style={styles.offerSubtext}>For your Char Dham Yatra</Text>
                </View>
              </View>
            </ScrollView>
          </View>
        )}

        {/* Sponsored Banners for Railway Only */}
        {activeTab === 'railway' && (
          <View style={styles.sponsoredSection}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.sponsoredScroll}>
              {/* Sponsor Card 1 */}
              <View style={styles.sponsorCard}>
                <View style={styles.sponsoredBadge}>
                  <Text style={styles.sponsoredBadgeText}>Sponsored</Text>
                </View>
                <View style={styles.sponsorTextStack}>
                  <Text style={styles.sponsorTitle}>Canara Crest</Text>
                  <Text style={styles.sponsorSub}>Curated Journeys</Text>
                </View>
              </View>

              {/* Sponsor Card 2 */}
              <View style={styles.sponsorCard}>
                <View style={styles.sponsoredBadge}>
                  <Text style={styles.sponsoredBadgeText}>Sponsored</Text>
                </View>
                <View style={styles.sponsorTextStack}>
                  <Text style={styles.sponsorTitle}>Canara Crest</Text>
                  <Text style={styles.sponsorSub}>Premium Banking</Text>
                </View>
              </View>
            </ScrollView>
          </View>
        )}
      </ScrollView>
    </ScreenShell>
    </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: { paddingHorizontal: 0, paddingBottom: 0, gap: 0 },


  tabsContainer: {
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderColor: colors.line,
  },
  tabsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xs,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    position: 'relative',
  },
  activeIcon: {
    transform: [{ scale: 1.1 }],
  },
  tabText: {
    fontSize: typography.tiny,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 14,
    fontWeight: '500',
  },
  tabTextActive: {
    color: '#4F46E5',
    fontWeight: '700',
  },
  tabUnderline: {
    position: 'absolute',
    bottom: 0,
    width: 48,
    height: 4,
    backgroundColor: '#4F46E5',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    alignSelf: 'center',
  },
  content: {
    paddingBottom: spacing.xxl,
    backgroundColor: colors.canvasMuted,
  },
  formCard: {
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.lg,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    gap: spacing.md,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 3,
    overflow: 'hidden',
  },
  segmentedControl: {
    backgroundColor: '#F1F5F9',
    borderRadius: radius.sm,
    padding: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.xs,
  },
  segmentBtnActive: {
    backgroundColor: colors.surface,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 1,
  },
  segmentText: {
    fontSize: typography.body,
    fontWeight: '600',
    color: '#64748B',
  },
  segmentTextActive: {
    color: '#4F46E5',
  },
  locationContainer: {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    position: 'relative',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    paddingLeft: 54,
    paddingRight: 50,
  },
  locationIcon: {
    position: 'absolute',
    left: spacing.md,
  },
  inputStack: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#94A3B8',
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  textInput: {
    fontSize: typography.body,
    fontWeight: '600',
    color: colors.text,
    padding: 0,
  },
  toErrorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 14,
    paddingVertical: 6,
    backgroundColor: '#FFF1F2',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  toErrorText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#EF4444',
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: colors.line,
    marginLeft: 48,
  },
  swapBtn: {
    position: 'absolute',
    right: 20,
    top: '50%',
    marginTop: -20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    zIndex: 10,
  },
  addStopsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: -4,
    paddingLeft: 6,
  },
  addStopsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  addStopsText: {
    color: '#4F46E5',
    fontSize: typography.body,
    fontWeight: '700',
  },
  newBadge: {
    backgroundColor: '#FDF2F8',
    borderColor: '#FCE7F3',
    borderWidth: 1,
    borderRadius: radius.pill,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 12,
  },
  newBadgeText: {
    color: '#DB2777',
    fontSize: 10,
    fontWeight: '800',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingLeft: 6,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: radius.xs,
    borderWidth: 1,
    borderColor: colors.line,
  },
  checkboxText: {
    color: colors.textMuted,
    fontSize: typography.body,
  },
  infoRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  infoCard: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.sm,
    backgroundColor: colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
  },
  infoIcon: {
    marginRight: 8,
  },
  infoTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  infoLabelText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#94A3B8',
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  infoValueText: {
    fontSize: typography.body,
    fontWeight: '700',
    color: colors.text,
  },
  infoValueSub: {
    fontSize: typography.caption,
    color: colors.textMuted,
    fontWeight: '400',
  },
  infoValueTextMuted: {
    fontSize: typography.body,
    fontWeight: '500',
    color: colors.textMuted,
  },
  searchBtn: {
    backgroundColor: '#4F46E5',
    borderRadius: radius.sm,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 4,
  },
  searchBtnText: {
    color: colors.white,
    fontSize: typography.body,
    fontWeight: '700',
  },
  promoBanner: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    borderWidth: 1,
    borderColor: '#FED7AA',
    borderRadius: radius.md,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  promoTextContainer: {
    flex: 1,
    paddingRight: spacing.md,
  },
  promoTitle: {
    fontSize: typography.body,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 2,
  },
  promoSubtitle: {
    fontSize: typography.caption,
    color: colors.textMuted,
    fontWeight: '500',
  },
  promoChevron: {
    backgroundColor: colors.white,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  offersSection: {
    marginTop: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  sectionTitle: {
    fontSize: typography.section,
    fontWeight: '800',
    color: colors.text,
    marginBottom: spacing.md,
  },
  offersScroll: {
    gap: spacing.md,
    paddingBottom: spacing.sm,
  },
  offerCard: {
    width: 260,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.line,
    overflow: 'hidden',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  offerGradient: {
    height: 112,
    position: 'relative',
  },
  offerBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  offerBadgeText: {
    color: '#1D4ED8',
    fontSize: 9,
    fontWeight: '800',
  },
  offerBadgeAmber: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  offerBadgeTextAmber: {
    color: '#78350F',
    fontSize: 9,
    fontWeight: '800',
  },
  offerDetails: {
    padding: spacing.sm,
  },
  offerTitleText: {
    fontSize: typography.body,
    fontWeight: '700',
    color: colors.text,
  },
  offerSubtext: {
    fontSize: typography.caption,
    color: colors.textMuted,
    marginTop: 2,
  },
  suggestionsContainer: {
    backgroundColor: '#F8FAFC',
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.line,
    padding: spacing.md,
    marginTop: spacing.xs,
    gap: spacing.sm,
  },
  suggestionsTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(226, 232, 240, 0.5)',
  },
  suggestionText: {
    fontSize: typography.body,
    color: colors.text,
    flex: 1,
  },
  closeSuggestionsBtn: {
    alignSelf: 'flex-end',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: radius.xs,
    backgroundColor: '#EEF2F6',
  },
  closeSuggestionsText: {
    fontSize: typography.caption,
    fontWeight: '700',
    color: '#4F46E5',
  },
  flightBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    borderWidth: 1,
    borderColor: '#E0E7FF',
    padding: spacing.md,
    borderRadius: radius.md,
    marginBottom: spacing.md,
  },
  flightIconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E0E7FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
    position: 'relative',
  },
  flightCheckBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: colors.white,
    borderRadius: 6,
  },
  flightTextContainer: {
    flex: 1,
  },
  flightTitle: {
    color: '#1E1B4B',
    fontSize: typography.body,
    fontWeight: '800',
  },
  flightSub: {
    color: '#4F46E5',
    fontSize: typography.caption,
    fontWeight: '600',
    marginTop: 2,
  },
  dateTimeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'stretch',
  },
  checkboxActive: {
    backgroundColor: '#4F46E5',
    borderColor: '#4F46E5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifiedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDFA',
    borderWidth: 1,
    borderColor: '#CCFBF1',
    padding: spacing.md,
    borderRadius: radius.md,
    marginBottom: spacing.md,
  },
  verifiedIconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#CCFBF1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  verifiedTextContainer: {
    flex: 1,
  },
  verifiedTitle: {
    color: '#115E59',
    fontSize: typography.body,
    fontWeight: '800',
  },
  verifiedSub: {
    color: '#0D9488',
    fontSize: typography.caption,
    fontWeight: '600',
    marginTop: 2,
  },
  trustBanner: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#DBEAFE',
    borderRadius: radius.md,
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  trustCount: {
    fontSize: typography.title,
    fontWeight: '900',
    color: colors.text,
  },
  trustText: {
    flex: 1,
    fontSize: typography.caption,
    color: colors.textMuted,
    fontWeight: '700',
    lineHeight: 18,
  },
  whatsNewSection: {
    marginTop: spacing.lg,
    paddingBottom: spacing.xl,
  },
  whatsNewScroll: {
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  infoNewCard: {
    width: 280,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.md,
    padding: spacing.md,
    flexDirection: 'row',
    gap: spacing.sm,
  },
  infoNewIconBg: {
    width: 56,
    height: 56,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  infoNewPlaneBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    backgroundColor: colors.white,
    borderRadius: 5,
    padding: 2,
    borderWidth: 1,
    borderColor: colors.line,
  },
  infoNewTextStack: {
    flex: 1,
    justifyContent: 'center',
  },
  infoNewTitle: {
    fontSize: typography.caption,
    fontWeight: '800',
    color: colors.text,
    lineHeight: 16,
    marginBottom: 4,
  },
  infoNewSub: {
    fontSize: 10,
    color: colors.textMuted,
    lineHeight: 14,
  },
  offerCardRailway: {
    width: 280,
    height: 180,
    borderRadius: radius.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface,
  },
  offerGradientRailway: {
    flex: 1,
    padding: spacing.md,
    justifyContent: 'space-between',
    position: 'relative',
  },
  offerTitleTextRailway: {
    fontSize: typography.section,
    fontWeight: '900',
    marginTop: 32,
    lineHeight: 24,
  },
  offerBadgeRailway: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  offerBadgeTextRailway: {
    fontSize: 10,
    fontWeight: '800',
    color: '#1E293B',
    letterSpacing: 0.5,
  },
  offerBookNowBar: {
    height: 48,
    backgroundColor: colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.line,
  },
  bookNowText: {
    fontSize: typography.caption,
    fontWeight: '800',
    color: '#4F46E5',
    letterSpacing: 0.5,
  },
  sponsoredSection: {
    marginTop: spacing.md,
    paddingBottom: spacing.xl,
  },
  sponsoredScroll: {
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  sponsorCard: {
    width: 300,
    height: 96,
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#1E293B',
    borderRadius: radius.md,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  sponsoredBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 3,
  },
  sponsoredBadgeText: {
    fontSize: 9,
    fontWeight: '600',
    color: colors.white,
    textTransform: 'uppercase',
  },
  sponsorTextStack: {
    flex: 1,
    justifyContent: 'center',
  },
  sponsorTitle: {
    fontSize: typography.section,
    fontWeight: '800',
    color: '#93C5FD',
    fontStyle: 'italic',
    marginBottom: 2,
  },
  sponsorSub: {
    fontSize: typography.caption,
    fontWeight: '500',
    color: '#CBD5E1',
  },
});

