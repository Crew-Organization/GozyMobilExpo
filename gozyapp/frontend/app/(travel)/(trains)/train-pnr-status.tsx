import { useMemo, useState } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PnrStatusScreen() {
  const { pnr } = useLocalSearchParams<{ pnr?: string }>();
  const displayPnr = pnr || '6832430149';

  const handleCopyText = async () => {
    try {
      await Share.share({ message: displayPnr, title: 'PNR Number' });
    } catch {
      Alert.alert('PNR Number', displayPnr);
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `My Amrit Bharat Exp ticket PNR: ${displayPnr}. Current Status: CNF/S4/52. Chart Prepared!`,
        title: 'Share PNR Status'
      });
    } catch (err) {
      Alert.alert('Error', 'Unable to share PNR status');
    }
  };

  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1200);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.screen}>
        
        {/* Header Bar */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Pressable hitSlop={12} onPress={() => router.back()} style={styles.backButton}>
              <MaterialCommunityIcons color="#374151" name="arrow-left" size={26} />
            </Pressable>
            <View style={styles.headerTitleContainer}>
              <Text style={styles.headerTitle}>PNR Status</Text>
              <Text style={styles.headerSubtitle}>PNR {displayPnr}</Text>
            </View>
          </View>
          
          <View style={styles.headerActions}>
            <Pressable hitSlop={8} onPress={handleCopyText} style={styles.headerActionBtn}>
              <MaterialCommunityIcons color="#1D4ED8" name="content-copy" size={20} />
            </Pressable>
            <Pressable hitSlop={8} onPress={handleRefresh} style={styles.headerActionBtn}>
              {isRefreshing ? (
                <ActivityIndicator size="small" color="#1D4ED8" />
              ) : (
                <MaterialCommunityIcons color="#1D4ED8" name="autorenew" size={20} />
              )}
            </Pressable>
            <Pressable hitSlop={8} onPress={handleShare} style={styles.headerActionBtn}>
              <MaterialCommunityIcons color="#1D4ED8" name="share-variant" size={20} />
            </Pressable>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* Main Booking Ticket Card */}
          <View style={styles.ticketCard}>
            
            {/* Train Name & Number */}
            <View style={styles.trainHeader}>
              <View style={styles.trainNameGroup}>
                <Text style={styles.trainName}>Amrit Bharat Exp</Text>
                <View style={styles.classBadge}>
                  <Text style={styles.classBadgeText}>SL | GN</Text>
                </View>
              </View>
              <Text style={styles.trainNumber}>#20609</Text>
            </View>

            {/* Route & Times Grid */}
            <View style={styles.routeGrid}>
              <View style={styles.routeCell}>
                <Text style={styles.cityName}>Palasa</Text>
                <Text style={styles.stationCode}>PSA</Text>
                <Text style={styles.timeVal}>02:07 PM, 30 May</Text>
              </View>

              <View style={styles.durationCenter}>
                <Text style={styles.durationText}>10h 13m</Text>
                <View style={styles.durationLineContainer}>
                  <View style={styles.durationDot} />
                  <View style={styles.durationLine} />
                  <View style={styles.durationDot} />
                </View>
              </View>

              <View style={[styles.routeCell, { alignItems: 'flex-end' }]}>
                <Text style={styles.cityName}>Vijayawada Jn</Text>
                <Text style={styles.stationCode}>BZA</Text>
                <Text style={styles.timeVal}>12:20 AM, 31 May</Text>
              </View>
            </View>

            {/* Green Status Bar: Chart has been prepared */}
            <View style={styles.chartStatusBar}>
              <Text style={styles.chartStatusText}>Chart has been prepared</Text>
            </View>

            {/* Passenger list */}
            <View style={styles.passengerRow}>
              <Text style={styles.passengerLabel}>Passenger 1</Text>
              <Text style={styles.passengerStatus}>CNF-S4-52</Text>
            </View>

            <View style={styles.divider} />

            {/* Train Schedule & Live Status Buttons */}
            <View style={styles.ticketActions}>
              <Pressable
                onPress={() => Alert.alert('Train Schedule', 'Amrit Bharat Exp 20609 runs daily.')}
                style={styles.actionBtn}
              >
                <MaterialCommunityIcons color="#4B5563" name="calendar-clock" size={20} />
                <Text style={styles.actionBtnText}>Train Schedule</Text>
              </Pressable>

              <Pressable
                onPress={() => Alert.alert('Live Status', 'Train is running on time. Expected platform: 3.')}
                style={styles.actionBtn}
              >
                <MaterialCommunityIcons color="#4B5563" name="radar" size={20} />
                <Text style={styles.actionBtnText}>Live Train Status</Text>
              </Pressable>
            </View>

          </View>

          {/* Food on Train Promo card */}
          <View style={styles.foodPromoCard}>
            <View style={styles.foodTextsCol}>
              <View style={styles.foodLogoRow}>
                <Text style={styles.foodLogoMain}>food</Text>
                <Text style={styles.foodLogoSub}>on</Text>
                <Text style={styles.foodLogoMain}>train</Text>
                <View style={styles.foodNewBadge}>
                  <Text style={styles.foodNewBadgeText}>new</Text>
                </View>
              </View>
              
              <Text style={styles.foodTitle}>Enjoy your favorite meals</Text>
              <Text style={styles.foodSubtitle}>Delivered to your train seat.</Text>

              <Pressable onPress={() => Alert.alert('Order Food', 'Opening Food on Train search...')} style={styles.orderNowBtn}>
                <Text style={styles.orderNowBtnText}>Order Now</Text>
              </Pressable>
            </View>

            {/* Indian Thali image */}
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=260&auto=format&fit=crop' }}
              style={styles.foodPromoImage}
            />
          </View>

          {/* Sponsored Oppo Banner */}
          <View style={styles.sponsoredAdCard}>
            <View style={styles.adHeader}>
              <Text style={styles.adBrandLogo}>oppo</Text>
              <View style={styles.adSponsoredBadge}>
                <Text style={styles.adSponsoredBadgeText}>Sponsored</Text>
              </View>
            </View>
            
            <View style={styles.adBodyRow}>
              <View style={styles.adTextsCol}>
                <Text style={styles.adProductTitle}>OPPO Find X9s</Text>
                <Text style={styles.adProductTagline}>Your Story Matters. Create with Find.</Text>
                <Pressable onPress={() => Alert.alert('Oppo Find X9s', 'Redirecting to Oppo store...')} style={styles.buyNowBtn}>
                  <Text style={styles.buyNowBtnText}>Buy Now</Text>
                </Pressable>
              </View>

              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=200&auto=format&fit=crop' }}
                style={styles.adProductImage}
              />
            </View>
          </View>

          {/* Disclaimer Section */}
          <View style={styles.disclaimerSection}>
            <Text style={styles.disclaimerTitle}>Disclaimer</Text>
            <Text style={styles.disclaimerText}>
              The Confirmation chances, platform numbers and coach positions are projections alone, they have no affiliation with IRCTC. Neither MakeMyTrip nor IRCTC will be responsible for any liability occurring due to this information.
            </Text>
          </View>

        </ScrollView>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
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
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleContainer: {
    marginLeft: 12,
  },
  headerTitle: {
    fontSize: 16.5,
    fontWeight: '900',
    color: '#111827',
  },
  headerSubtitle: {
    fontSize: 10.5,
    color: '#6B7280',
    fontWeight: '700',
    marginTop: 1,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
  },
  headerActionBtn: {
    padding: 2,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  ticketCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 14,
    marginTop: 14,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  trainHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  trainNameGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  trainName: {
    fontSize: 16,
    fontWeight: '900',
    color: '#111827',
  },
  classBadge: {
    borderWidth: 1.5,
    borderColor: '#9CA3AF',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 1,
  },
  classBadgeText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#4B5563',
  },
  trainNumber: {
    fontSize: 13,
    fontWeight: '700',
    color: '#9CA3AF',
  },
  routeGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  routeCell: {
    flex: 1.2,
  },
  cityName: {
    fontSize: 13.5,
    fontWeight: '900',
    color: '#111827',
  },
  stationCode: {
    fontSize: 12,
    fontWeight: '800',
    color: '#6B7280',
    marginTop: 2,
  },
  timeVal: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#4B5563',
    marginTop: 6,
  },
  durationCenter: {
    flex: 1.1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  durationText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#9CA3AF',
    marginBottom: 4,
  },
  durationLineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  durationDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#9CA3AF',
  },
  durationLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#D1D5DB',
  },
  chartStatusBar: {
    backgroundColor: '#E6F7F4',
    borderRadius: 6,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  chartStatusText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#059669',
  },
  passengerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  passengerLabel: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#4B5563',
  },
  passengerStatus: {
    fontSize: 13,
    fontWeight: '900',
    color: '#059669',
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginVertical: 14,
  },
  ticketActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionBtn: {
    flex: 1,
    height: 38,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  actionBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#4B5563',
  },
  foodPromoCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 14,
    marginTop: 14,
    borderRadius: 14,
    overflow: 'hidden',
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 18,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 2,
  },
  foodTextsCol: {
    flex: 1.3,
  },
  foodLogoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginBottom: 8,
  },
  foodLogoMain: {
    fontSize: 13,
    fontWeight: '900',
    color: '#B91C1C', // Food Red color
  },
  foodLogoSub: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#4B5563',
    fontStyle: 'italic',
  },
  foodNewBadge: {
    backgroundColor: '#F472B6', // pink-400
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 0.5,
    marginLeft: 4,
  },
  foodNewBadgeText: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  foodTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: '#111827',
    marginBottom: 4,
  },
  foodSubtitle: {
    fontSize: 10.5,
    color: '#6B7280',
    fontWeight: '700',
    marginBottom: 14,
  },
  orderNowBtn: {
    height: 32,
    width: 100,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#1697F6',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  orderNowBtnText: {
    fontSize: 11.5,
    fontWeight: '900',
    color: '#1697F6',
  },
  foodPromoImage: {
    width: 110,
    height: 100,
    borderRadius: 10,
    marginLeft: 12,
  },
  sponsoredAdCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 14,
    marginTop: 14,
    borderRadius: 14,
    padding: 14,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 2,
  },
  adHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  adBrandLogo: {
    fontSize: 13,
    fontWeight: '800',
    color: '#9CA3AF',
    letterSpacing: 1.5,
  },
  adSponsoredBadge: {
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  adSponsoredBadgeText: {
    fontSize: 8,
    fontWeight: '800',
    color: '#6B7280',
  },
  adBodyRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  adTextsCol: {
    flex: 1.3,
  },
  adProductTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: '#111827',
    marginBottom: 4,
  },
  adProductTagline: {
    fontSize: 10.5,
    color: '#4B5563',
    fontWeight: '700',
    marginBottom: 12,
    lineHeight: 15,
  },
  buyNowBtn: {
    height: 32,
    width: 90,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#111827',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  buyNowBtnText: {
    fontSize: 11.5,
    fontWeight: '900',
    color: '#111827',
  },
  adProductImage: {
    width: 90,
    height: 100,
    borderRadius: 8,
    marginLeft: 12,
    resizeMode: 'cover',
  },
  disclaimerSection: {
    backgroundColor: '#E5E7EB',
    paddingVertical: 18,
    paddingHorizontal: 16,
    marginTop: 24,
  },
  disclaimerTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: '#4B5563',
    marginBottom: 8,
  },
  disclaimerText: {
    fontSize: 10.5,
    color: '#6B7280',
    lineHeight: 16,
    fontWeight: '700',
  },
});
