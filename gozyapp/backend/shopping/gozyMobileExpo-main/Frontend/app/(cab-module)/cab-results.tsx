import { useState, useRef, useEffect } from 'react';
import {
  Animated,
  Easing,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import CinematicSplash from './_cinematic-splash';

import { cabRides, type CabRide } from '@/src/lib/cab-data';

// Define filter categories for each ride ID
const rideCategories: Record<string, string[]> = {
  swift: ['all', 'cheapest'],
  tigor: ['all', 'cheapest', 'ev', 'popular'],
  'mg-zs': ['all', 'ev', 'premium', 'popular'],
  byd: ['all', 'ev', 'suv', 'premium'],
  innova: ['all', 'suv', 'premium'],
  mercedes: ['all', 'luxury', 'premium'],
};

// AI assistant descriptions based on selected ride ID
const aiRecommendations: Record<string, string> = {
  swift: 'Maruti Suzuki Swift is your cheapest option, offering a budget-friendly ride for your trip.',
  tigor: 'Tata Tigor EV offers the best balance of price, rating, and arrival time for your airport trip.',
  'mg-zs': 'MG ZS EV helps you save 3kg CO₂ while traveling in eco-friendly style.',
  byd: 'BYD eMAX 7 offers a spacious 6-seater EV experience for families.',
  innova: 'Toyota Innova is perfect for groups up to 6 with its spacious seating and luggage space.',
  mercedes: 'Mercedes E-Class offers our premium VIP experience with a professional chauffeur and complimentary waters.',
};

// ── Staggered Ride Card Component ───────────────────────────────────────────
interface RideCardProps {
  ride: CabRide;
  index: number;
  isSelected: boolean;
  onPress: () => void;
}

function RideCard({ ride, index, isSelected, onPress }: RideCardProps) {
  const translateY = useRef(new Animated.Value(32)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 0,
        duration: 380,
        delay: index * 60,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 380,
        delay: index * 60,
        useNativeDriver: true,
      }),
    ]).start();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isLuxury = ride.id === 'mercedes';
  const isEV = ride.fuel === 'Electric';
  const isTigor = ride.id === 'tigor'; // Recommended card
  const isMG = ride.id === 'mg-zs'; // Eco Friendly card

  // Styles mapping based on card type
  const cardBg = isLuxury ? '#0B0F19' : '#FFFFFF';
  const nameColor = isLuxury ? '#FFFFFF' : '#0F172A';
  const metaColor = isLuxury ? '#CBD5E1' : '#64748B';
  const borderClr = isSelected
    ? isLuxury
      ? '#F59E0B'
      : '#4F46E5'
    : isLuxury
    ? 'rgba(245, 158, 11, 0.4)'
    : '#E2E8F0';

  return (
    <Animated.View style={{ transform: [{ translateY }], opacity }}>
      <Pressable
        onPress={onPress}
        style={[
          styles.rideCard,
          { backgroundColor: cardBg, borderColor: borderClr },
          isSelected && !isLuxury && styles.rideCardSelected,
          isSelected && isLuxury && styles.luxurySelectedGlow,
          isTigor && styles.recommendedBorderGlow,
        ]}
      >
        {/* Recommended Tag */}
        {isTigor && (
          <View style={[styles.rideTag, styles.tagRecommended]}>
            <Text style={styles.rideTagText}>⭐ Recommended</Text>
          </View>
        )}

        {/* Eco Friendly Tag */}
        {isMG && (
          <View style={[styles.rideTag, styles.tagEco]}>
            <Text style={styles.rideTagText}>🌱 Eco Friendly</Text>
          </View>
        )}

        {/* Luxury Tag */}
        {isLuxury && (
          <View style={[styles.rideTag, styles.tagLuxury]}>
            <Text style={styles.rideTagText}>👑 Luxury</Text>
          </View>
        )}

        {/* Card Main layout */}
        {/* Cinematic blue orb inside card */}
        <View style={styles.cardOrb} pointerEvents="none" />
        <View style={styles.rideMain}>
          {/* Vehicle Tile Illustration wrapper */}
          <View style={[styles.carTile, isLuxury && styles.luxuryTile]}>
            {isLuxury ? (
              <LinearGradient
                colors={['#78350F', '#1C1917']}
                style={StyleSheet.absoluteFillObject}
              />
            ) : null}
            <MaterialCommunityIcons
              name={ride.vehicleIcon as any}
              size={36}
              color={isLuxury ? '#F59E0B' : isEV ? '#10B981' : '#4F46E5'}
            />
            {isEV && (
              <View style={styles.evBadge}>
                <Text style={styles.evBadgeText}>EV</Text>
              </View>
            )}
          </View>

          {/* Details */}
          <View style={styles.rideDetails}>
            <View style={styles.rideHeaderRow}>
              <Text style={[styles.rideName, { color: nameColor }]} numberOfLines={1}>
                {ride.name}
              </Text>
              <View
                style={[
                  styles.vehicleMetaBadge,
                  isEV
                    ? styles.badgeElectric
                    : ride.fuel === 'Petrol'
                    ? styles.badgePetrol
                    : ride.fuel === 'Diesel'
                    ? styles.badgeDiesel
                    : styles.badgeHybrid,
                ]}
              >
                <Text
                  style={[
                    styles.vehicleMetaBadgeText,
                    isEV
                      ? { color: '#10B981' }
                      : ride.fuel === 'Petrol'
                      ? { color: '#4F46E5' }
                      : ride.fuel === 'Diesel'
                      ? { color: '#64748B' }
                      : { color: '#F59E0B' },
                  ]}
                >
                  {ride.fuel}
                </Text>
              </View>
            </View>

            <View style={styles.ratingRow}>
              <MaterialCommunityIcons name="star" size={12} color="#F59E0B" />
              <Text style={[styles.ratingText, { color: metaColor }]}>
                {ride.rating.replace('/5', '')} • {isTigor ? '4 mins' : isLuxury ? '7 mins' : '6 mins'} away
              </Text>
            </View>
          </View>

          {/* Price Block */}
          <View style={styles.priceBox}>
            <Text style={[styles.priceCurrent, { color: isLuxury ? '#F59E0B' : '#0F172A' }]}>
              ₹{ride.price}
            </Text>
            {ride.discount ? (
              <View style={styles.savingsBadge}>
                <Text style={styles.savingsText}>Save ₹{(parseInt((ride.strikePrice || '0').replace(/,/g, ''), 10) - parseInt((ride.price || '0').replace(/,/g, ''), 10)).toLocaleString('en-IN')}</Text>
              </View>
            ) : (
              <Text style={styles.priceDiscount}>Standard Fare</Text>
            )}
          </View>
        </View>

        {/* Card Footer Features list */}
        <View style={[styles.rideFooter, isLuxury && styles.luxuryFooterBorder]}>
          {isLuxury ? (
            <>
              <View style={styles.featurePill}>
                <MaterialCommunityIcons name="account-tie" size={10} color="#CBD5E1" />
                <Text style={styles.featurePillText}>Chauffeur</Text>
              </View>
              <View style={styles.featurePill}>
                <MaterialCommunityIcons name="cup-water" size={10} color="#CBD5E1" />
                <Text style={styles.featurePillText}>Free Water</Text>
              </View>
              <View style={styles.featurePill}>
                <MaterialCommunityIcons name="wifi" size={10} color="#CBD5E1" />
                <Text style={styles.featurePillText}>In-Car WiFi</Text>
              </View>
            </>
          ) : (
            <>
              <View style={styles.featurePill}>
                <MaterialCommunityIcons name="account-group" size={10} color="#64748B" />
                <Text style={styles.featurePillText}>{ride.seats}</Text>
              </View>
              <View style={styles.featurePill}>
                <MaterialCommunityIcons name="wind-power" size={10} color="#64748B" />
                <Text style={styles.featurePillText}>AC</Text>
              </View>
              <View style={styles.featurePill}>
                <MaterialCommunityIcons name="music" size={10} color="#64748B" />
                <Text style={styles.featurePillText}>Music</Text>
              </View>
              {isEV && (
                <View style={styles.featurePill}>
                  <MaterialCommunityIcons name="flash" size={10} color="#64748B" />
                  <Text style={styles.featurePillText}>Fast Charging</Text>
                </View>
              )}
            </>
          )}
        </View>
      </Pressable>
    </Animated.View>
  );
}

// ── Main Screen Component ───────────────────────────────────────────────────
export default function CabResultsScreen() {
  const params = useLocalSearchParams<{ type?: string }>();
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedRideId, setSelectedRideId] = useState('tigor');

  // Staggered animated visibility for top section
  const headerFade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(headerFade, {
      toValue: 1,
      duration: 450,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isAirport = params.type === 'airport';
  const isRailway = params.type === 'railway';
  const isHourly = params.type === 'hourly';
  const isOutstation = params.type === 'outstation';

  const dynamicRides = cabRides.map(ride => {
    if (isOutstation) {
      if (ride.id === 'swift') {
        return {
          ...ride,
          price: '17,664',
          tax: '979',
          strikePrice: '20,446',
          discount: '14% off',
        };
      } else if (ride.id === 'tigor') {
        return {
          ...ride,
          price: '18,024',
          tax: '997',
          strikePrice: '20,862',
          discount: '14% off',
        };
      } else if (ride.id === 'innova' || ride.id === 'byd' || ride.id === 'xylo' || ride.id === 'mg-zs') {
        return {
          ...ride,
          name: 'Xylo, Ertiga',
          price: '31,408',
          tax: '1,480',
          strikePrice: '36,220',
          discount: '14% off',
          vehicleIcon: 'car-estate' as any,
          fuel: 'Diesel' as const,
          seats: '6 Seats',
        };
      } else {
        const priceNum = parseInt(ride.price.replace(/,/g, ''), 10);
        const outstationPrice = (priceNum * 12).toLocaleString('en-IN');
        const outstationTax = (priceNum * 0.8).toFixed(0);
        return {
          ...ride,
          price: outstationPrice,
          tax: outstationTax,
        };
      }
    }
    return ride;
  });

  const activeRide = dynamicRides.find((r) => r.id === selectedRideId) || dynamicRides[1];

  // Filter rides list based on selected filter tag
  const filteredRides = dynamicRides.filter((ride) => {
    const categories = rideCategories[ride.id] || ['all'];
    return categories.includes(selectedFilter);
  });

  const handleBooking = () => {
    router.push({ pathname: '/(cab-module)/cab-review', params: { type: params.type } });
  };

  let pickupAddress = 'Your Live Location (Secunderabad)';
  let dropAddress = 'Destination Location';
  let tripDuration = '34 KM • 1 Hour';

  if (isAirport) {
    pickupAddress = 'Rajiv Gandhi International Airport (HYD)';
    dropAddress = 'B.N Reddy Nagar, Hyderabad';
    tripDuration = '34 KM • 1 Hour';
  } else if (isRailway) {
    pickupAddress = 'Secunderabad Junction Railway Station';
    dropAddress = 'Your Live Location (Secunderabad)';
    tripDuration = '8 KM • 25 Mins';
  } else if (isHourly) {
    pickupAddress = 'Your Live Location (Secunderabad)';
    dropAddress = '4 Hrs / 40 Kms Rental Package';
    tripDuration = 'Unlimited Stops • 40 Kms included';
  } else if (isOutstation) {
    pickupAddress = 'Gugudu, Andhra Pradesh';
    dropAddress = 'Kalyan, Maharashtra';
    tripDuration = '872 KM • 18 Hours';
  }

  return (
    <View style={styles.container}>
      <CinematicSplash />
      {/* Sticky top app navigation header */}
      <Animated.View style={[styles.header, { opacity: headerFade }]}>
        <View style={styles.headerTop}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <MaterialCommunityIcons name="chevron-left" size={24} color="#0F172A" />
          </Pressable>
          <Text style={styles.headerTitle}>GOZY</Text>
          <View style={styles.bellBtn}>
            <MaterialCommunityIcons name="bell-outline" size={20} color="#64748B" />
          </View>
        </View>
      </Animated.View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Dynamic header card: Boarding Pass for Airport Transfer, otherwise standard Route Card */}
        {isAirport ? (
          <View style={styles.boardingPassCard}>
            {/* Left and Right Ticket Notches */}
            <View style={styles.leftNotch} />
            <View style={styles.rightNotch} />

            {/* Boarding Pass Header Info */}
            <View style={styles.boardingHeader}>
              <View style={styles.boardingBrandRow}>
                <MaterialCommunityIcons name="airplane" size={14} color="#4F46E5" />
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
                <MaterialCommunityIcons name="airplane" size={16} color="#4F46E5" style={styles.tracerPlane} />
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
                  <Text style={[styles.detailValue, { color: '#10B981', fontWeight: '800' }]}>🛡️ On-Time</Text>
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
          <View style={styles.routeCard}>
            <View style={styles.routeFlow}>
              {/* Pickup */}
              <View style={styles.routePoint}>
                <View style={styles.pointDot}>
                  <View style={styles.dotInner} />
                </View>
                <View style={styles.pointInfo}>
                  <Text style={styles.pointLabel}>Pickup Location</Text>
                  <Text style={styles.pointAddress} numberOfLines={1}>{pickupAddress}</Text>
                </View>
              </View>

              {/* Destination */}
              <View style={styles.routePoint}>
                <View style={[styles.pointDot, styles.pointDotDest]}>
                  <View style={[styles.dotInner, styles.dotInnerDest]} />
                </View>
                <View style={styles.pointInfo}>
                  <Text style={styles.pointLabel}>{isHourly ? 'Rental Package' : 'Destination'}</Text>
                  <Text style={styles.pointAddress} numberOfLines={1}>{dropAddress}</Text>
                </View>
              </View>
            </View>

            <View style={styles.routeDivider} />

            {/* Trip Meta details */}
            <View style={styles.tripMeta}>
              <View style={styles.metaDetails}>
                <View style={styles.metaTextRow}>
                  <MaterialCommunityIcons name="map-marker-distance" size={13} color="#64748B" />
                  <Text style={styles.metaText}>{tripDuration}</Text>
                </View>
                <Text style={styles.metaSummary}>Thu, 4 Jun • 10:00 AM</Text>
              </View>
              <Pressable onPress={() => router.back()} style={styles.btnEditTrip}>
                <MaterialCommunityIcons name="pencil" size={12} color="#FFFFFF" />
                <Text style={styles.btnEditTripText}>Edit</Text>
              </Pressable>
            </View>
          </View>
        )}

        {/* Smart Filter Chips scroll list */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterSection}
          contentContainerStyle={styles.filterChipsContent}
        >
          {['All', 'Cheapest', 'Popular', 'EV', 'SUV', 'Premium', 'Luxury'].map((chip) => {
            const filterKey = chip.toLowerCase();
            const isActive = selectedFilter === filterKey;
            return (
              <Pressable
                key={chip}
                onPress={() => setSelectedFilter(filterKey)}
                style={[styles.filterChip, isActive && styles.filterChipActive]}
              >
                <Text style={[styles.filterChipText, isActive && styles.filterChipTextActive]}>
                  {chip}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Safety & Trust section */}
        <View style={styles.trustSection}>
          <Text style={styles.trustTitle}>GOZY Safety & Trust</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.trustScrollContent}
          >
            <View style={styles.trustCard}>
              <View style={[styles.trustIconBox, styles.verifiedIcon]}>
                <MaterialCommunityIcons name="shield-check" size={18} color="#10B981" />
              </View>
              <View style={styles.trustInfo}>
                <Text style={styles.trustLabel}>Drivers</Text>
                <Text style={styles.trustValue}>🛡️ Verified</Text>
              </View>
            </View>

            <View style={styles.trustCard}>
              <View style={[styles.trustIconBox, styles.ratingIcon]}>
                <MaterialCommunityIcons name="star" size={18} color="#F59E0B" />
              </View>
              <View style={styles.trustInfo}>
                <Text style={styles.trustLabel}>Avg Rating</Text>
                <Text style={styles.trustValue}>⭐ 4.8 Rating</Text>
              </View>
            </View>

            <View style={styles.trustCard}>
              <View style={[styles.trustIconBox, styles.driversIcon]}>
                <MaterialCommunityIcons name="navigation" size={18} color="#4F46E5" />
              </View>
              <View style={styles.trustInfo}>
                <Text style={styles.trustLabel}>Nearby</Text>
                <Text style={styles.trustValue}>🚖 24 Drivers</Text>
              </View>
            </View>

            <View style={styles.trustCard}>
              <View style={[styles.trustIconBox, styles.instantIcon]}>
                <MaterialCommunityIcons name="flash" size={18} color="#06B6D4" />
              </View>
              <View style={styles.trustInfo}>
                <Text style={styles.trustLabel}>Booking</Text>
                <Text style={styles.trustValue}>⚡ Instant</Text>
              </View>
            </View>
          </ScrollView>
        </View>

        {/* Rides Container list */}
        <View style={styles.ridesContainer}>
          {filteredRides.map((ride, index) => (
            <RideCard
              key={ride.id}
              ride={ride}
              index={index}
              isSelected={selectedRideId === ride.id}
              onPress={() => {
                setSelectedRideId(ride.id);
                router.push({ pathname: '/(cab-module)/cab-review', params: { type: params.type } });
              }}
            />
          ))}
          {filteredRides.length === 0 && (
            <View style={styles.emptyContainer}>
              <MaterialCommunityIcons name="car-off" size={48} color="#94A3B8" />
              <Text style={styles.emptyText}>No rides available for this category.</Text>
            </View>
          )}
        </View>

        {/* Auto-applied promo discount banner */}
        <View style={styles.offerBanner}>
          <LinearGradient
            colors={['#4F46E5', '#7C3AED']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFillObject}
          />
          <View style={styles.offerHeader}>
            <View style={styles.offerTag}>
              <Text style={styles.offerTagText}>🎁 Applied For You</Text>
            </View>
            <View style={styles.offerCodeContainer}>
              <Text style={styles.offerCode}>CABPERK</Text>
            </View>
          </View>
          <View style={styles.offerBody}>
            <Text style={styles.offerTitle}>₹50 OFF Applied</Text>
            <Text style={styles.offerDesc}>You save ₹50 instantly on this booking</Text>
          </View>
        </View>

        {/* Floating GOZY AI Assistant details */}
        <View style={styles.aiAssistantCard}>
          <View style={styles.aiAvatar}>
            <MaterialCommunityIcons name="robot" size={20} color="#FFFFFF" />
            <View style={styles.pulseIndicator} />
          </View>
          <View style={styles.aiContent}>
            <View style={styles.aiHeader}>
              <MaterialCommunityIcons name="creation" size={12} color="#4F46E5" />
              <Text style={styles.aiHeaderTitle}>GOZY AI</Text>
            </View>
            <Text style={styles.aiText}>
              {aiRecommendations[selectedRideId] ||
                'Tata Tigor EV offers the best balance of price, rating and arrival time.'}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Sticky Bottom Booking Drawer bar */}
      <View style={styles.bottomBar}>
        <View style={styles.selectionSummary}>
          <View style={styles.selectionDetails}>
            <Text style={styles.selectionLabel}>Selected Ride</Text>
            <Text style={styles.selectionValue} numberOfLines={1}>
              {activeRide.name}
            </Text>
          </View>
          <View style={styles.selectionPrice}>
            <Text style={styles.selectionAmt}>₹{activeRide.price}</Text>
            <Text style={styles.selectionPromoInfo}>🎁 ₹50 Discount Applied</Text>
          </View>
        </View>
        <Pressable onPress={handleBooking} style={styles.btnContinue}>
          <LinearGradient
            colors={['#4F46E5', '#6366F1']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={StyleSheet.absoluteFillObject}
          />
          <Text style={styles.btnContinueText}>Continue Booking</Text>
          <MaterialCommunityIcons name="arrow-right" size={18} color="#FFFFFF" />
        </Pressable>
      </View>


    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    paddingTop: 50,
    paddingBottom: 12,
    zIndex: 10,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  bellBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 150, // space for bottom sticky drawer
  },

  // Glassmorphism Route Card
  routeCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.55)',
    borderRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 3,
    marginBottom: 20,
    overflow: 'hidden',
  },
  routeFlow: {
    gap: 16,
    position: 'relative',
  },
  routePoint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  pointDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(79, 70, 229, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pointDotDest: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
  },
  dotInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#4F46E5',
  },
  dotInnerDest: {
    backgroundColor: '#10B981',
  },
  pointInfo: {
    flex: 1,
  },
  pointLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  pointAddress: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  routeDivider: {
    height: 1,
    backgroundColor: 'rgba(226, 232, 240, 0.7)',
    marginVertical: 16,
  },
  tripMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metaDetails: {
    gap: 4,
  },
  metaTextRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  metaSummary: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  btnEditTrip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: '#0F172A',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 2,
  },
  btnEditTripText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },

  // Smart Filter Chips
  filterSection: {
    marginHorizontal: -16,
    marginBottom: 20,
  },
  filterChipsContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterChip: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.45)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
  },
  filterChipActive: {
    backgroundColor: '#4F46E5',
    borderColor: '#4F46E5',
    shadowColor: '#4F46E5',
    shadowOpacity: 0.18,
    shadowRadius: 8,
    transform: [{ scale: 1.02 }],
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },

  // Safety & Trust Section
  trustSection: {
    marginBottom: 24,
  },
  trustTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
    paddingLeft: 4,
  },
  trustScrollContent: {
    gap: 10,
  },
  trustCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.45)',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
  },
  trustIconBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifiedIcon: { backgroundColor: 'rgba(16, 185, 129, 0.12)' },
  ratingIcon: { backgroundColor: 'rgba(245, 158, 11, 0.12)' },
  driversIcon: { backgroundColor: 'rgba(79, 70, 229, 0.12)' },
  instantIcon: { backgroundColor: 'rgba(6, 182, 212, 0.12)' },
  trustInfo: {
    flexDirection: 'column',
  },
  trustLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
    textTransform: 'uppercase',
  },
  trustValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },

  // Rides Container List
  ridesContainer: {
    gap: 14,
    marginBottom: 24,
  },
  rideCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.45)',
    borderRadius: 24,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    position: 'relative',
    overflow: 'hidden',
  },
  cardOrb: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#2563EB',
    opacity: 0.08,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 30,
    elevation: 0,
  },
  rideCardSelected: {
    borderColor: '#4F46E5',
    backgroundColor: '#FFFFFF',
    shadowColor: '#4F46E5',
    shadowOpacity: 0.08,
    shadowRadius: 16,
  },
  recommendedBorderGlow: {
    borderColor: '#818CF8',
    shadowColor: '#818CF8',
    shadowOpacity: 0.12,
    shadowRadius: 12,
  },
  luxurySelectedGlow: {
    borderColor: '#F59E0B',
    shadowColor: '#F59E0B',
    shadowOpacity: 0.25,
    shadowRadius: 20,
  },
  rideTag: {
    position: 'absolute',
    top: 0,
    left: 0,
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderBottomRightRadius: 12,
  },
  rideTagText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#FFFFFF',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  tagRecommended: {
    backgroundColor: '#4F46E5',
  },
  tagEco: {
    backgroundColor: '#10B981',
  },
  tagLuxury: {
    backgroundColor: '#F59E0B',
  },
  rideMain: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginTop: 4,
  },
  carTile: {
    width: 64,
    height: 60,
    borderRadius: 14,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    position: 'relative',
  },
  luxuryTile: {
    borderWidth: 1,
    borderColor: '#78350F',
    overflow: 'hidden',
  },
  evBadge: {
    position: 'absolute',
    bottom: -6,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.25)',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 3,
  },
  evBadgeText: {
    fontSize: 7,
    fontWeight: '900',
    color: '#10B981',
    letterSpacing: 0.5,
  },
  rideDetails: {
    flex: 1,
  },
  rideHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  rideName: {
    fontSize: 15,
    fontWeight: '700',
  },
  vehicleMetaBadge: {
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
  },
  vehicleMetaBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  badgeElectric: { backgroundColor: 'rgba(16, 185, 129, 0.1)' },
  badgePetrol: { backgroundColor: 'rgba(79, 70, 229, 0.08)' },
  badgeDiesel: { backgroundColor: 'rgba(100, 116, 139, 0.1)' },
  badgeHybrid: { backgroundColor: 'rgba(245, 158, 11, 0.1)' },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: '600',
  },
  priceBox: {
    alignItems: 'flex-end',
    gap: 2,
  },
  priceCurrent: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  savingsBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    paddingVertical: 1,
    paddingHorizontal: 5,
    borderRadius: 4,
  },
  savingsText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#10B981',
  },
  priceDiscount: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748B',
  },
  rideFooter: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(226, 232, 240, 0.5)',
  },
  luxuryFooterBorder: {
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
  },
  featurePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    fontSize: 10,
    backgroundColor: 'rgba(241, 245, 249, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(226, 232, 240, 0.8)',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  featurePillText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748B',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    gap: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },

  // Applied Offer Banner
  offerBanner: {
    borderRadius: 20,
    padding: 16,
    marginBottom: 24,
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
  },
  offerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  offerTag: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 100,
  },
  offerTagText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#FFFFFF',
    textTransform: 'uppercase',
  },
  offerCodeContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
    paddingVertical: 2,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(251, 191, 36, 0.4)',
    borderStyle: 'dashed',
  },
  offerCode: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FBBF24',
  },
  offerBody: {
    gap: 2,
  },
  offerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  offerDesc: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.85,
    fontWeight: '500',
  },

  // Floating AI Assistant
  aiAssistantCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.55)',
    borderRadius: 20,
    padding: 14,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 1,
    marginBottom: 24,
  },
  aiAvatar: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#4F46E5',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  pulseIndicator: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  aiContent: {
    flex: 1,
    gap: 2,
  },
  aiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  aiHeaderTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#4F46E5',
  },
  aiText: {
    fontSize: 12,
    color: '#0F172A',
    fontWeight: '600',
    lineHeight: 16,
  },

  // Sticky Bottom Bar
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 34,
    gap: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 10,
  },
  selectionSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectionDetails: {
    flex: 1,
  },
  selectionLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
    textTransform: 'uppercase',
  },
  selectionValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  selectionPrice: {
    alignItems: 'flex-end',
  },
  selectionAmt: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  selectionPromoInfo: {
    fontSize: 10,
    fontWeight: '700',
    color: '#10B981',
  },
  btnContinue: {
    height: 54,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 3,
  },
  btnContinueText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },

  // Modal overlay
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 5,
  },
  modalIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 8,
  },
  modalDesc: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
  },
  modalBtn: {
    width: '100%',
    height: 48,
    backgroundColor: '#0F172A',
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
    backgroundColor: '#F8FAFC', // Match container page bg color
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
    backgroundColor: '#F8FAFC',
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
    color: '#4F46E5',
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
    color: '#0F172A',
    letterSpacing: -1,
  },
  hubName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
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
    color: '#94A3B8',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1E293B',
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
    color: '#94A3B8',
    letterSpacing: 0.5,
  },
  barcodeLines: {
    flexDirection: 'row',
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
