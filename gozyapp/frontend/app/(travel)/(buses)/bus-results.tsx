import { useState } from 'react';
import { ActivityIndicator, FlatList, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BusResultCard } from '@/src/components/bus-result-card';
import { BusResultsBanner, BusResultsEmpty, BusResultsHeader } from '@/src/components/bus-results-header';
import { useBusSearchResults } from '@/src/hooks/use-bus-search-results';
import { formatBusDate, formatFetchedTime, parseBusTravelDate } from '@/src/lib/bus-booking-utils';
import { colors, spacing, typography } from '@/src/theme/tokens';

const ACCENT = '#10A8EC';

export default function BusResultsScreen() {
  const params = useLocalSearchParams<{ from?: string; to?: string; date?: string }>();
  const from = params.from ?? 'Bangalore';
  const to = params.to ?? 'Ahmedabad';
  const dateIso = params.date ?? new Date().toISOString();
  const travelDate = parseBusTravelDate(dateIso);

  const [showTimingModal, setShowTimingModal] = useState(false);

  const {
    isLoading,
    fetchedAt,
    buses,
    lowestFare,
    sortBy,
    setSortBy,
    filters,
    setFilters,
    reload,
  } = useBusSearchResults({ from, to, dateIso, scope: 'all' });

  const handleContinueToSeats = (bus: any) => {
    router.push({
      pathname: '/(bus-module)/select-seats',
      params: {
        busId: bus.id,
        operator: bus.operator,
        busType: bus.busType,
        rating: String(bus.rating),
        reviews: String(bus.reviews),
        price: String(bus.price),
        originalPrice: String(bus.originalPrice),
        departureTime: bus.departureTime,
        arrivalTime: bus.arrivalTime,
        duration: bus.duration,
        seatsLeft: String(bus.seatsLeft),
        singleSeatsLeft: String(bus.singleSeatsLeft),
        isSleeper: String(bus.isSleeper),
        fromCity: from,
        toCity: to,
        date: dateIso,
        amenities: bus.amenities.join(','),
        isTripAssured: String(bus.isTripAssured),
        hasFreeCancellation: String(bus.hasFreeCancellation),
      },
    } as any);
  };

  if (isLoading) {
    return (
      <View style={styles.screen}>
        <SafeAreaView style={styles.loading}>
          <ActivityIndicator size="large" color={ACCENT} />
          <Text style={styles.loadingTitle}>Fetching live buses</Text>
          <Text style={styles.loadingSubtitle}>
            {from} → {to} • {formatBusDate(travelDate, true)}
          </Text>
        </SafeAreaView>
      </View>
    );
  }

  const renderListHeader = () => (
    <View style={styles.headerWidgets}>
      <View style={styles.bannerRow}>
        <View style={[styles.miniBanner, {borderColor: '#A5F3FC', backgroundColor: '#ECFEFF'}]}>
          <Text style={[styles.miniBannerTitle, {color: '#0891B2'}]}>Free Cancellation <MaterialCommunityIcons name="shield-check" size={12} color="#0891B2" /></Text>
          <Text style={styles.miniBannerSub}>Get 100% refund if you cancel anytime</Text>
        </View>
        <View style={[styles.miniBanner, {borderColor: '#FECACA', backgroundColor: '#FEF2F2'}]}>
          <Text style={[styles.miniBannerTitle, {color: '#DC2626'}]}>Return trip offers</Text>
          <Text style={styles.miniBannerSub}>Save 10% on return bookings</Text>
        </View>
      </View>

      <View style={styles.offerCard}>
        <View style={styles.offerCardLeft}>
          <View style={styles.offerCircle}>
            <Text style={styles.offerCircleText}>gozy</Text>
          </View>
        </View>
        <View style={styles.offerCardMid}>
          <Text style={styles.offerCode}>WELCOMEGOZY</Text>
          <Text style={styles.offerDesc}>Get flat 10% instant discount up to Rs 150 + Rs 150 cashback up to Rs 150 on first bus booking.</Text>
        </View>
        <Text style={styles.offerLogin}>Login</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.screen}>
      <BusResultsHeader
        from={from}
        to={to}
        dateLabel={`${formatBusDate(travelDate, true)} • Tap to modify`}
        onBack={() => router.back()}
      />

      <FlatList
        data={buses}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={renderListHeader}
        ListEmptyComponent={
          <BusResultsEmpty
            title="No buses match your filters"
            actionLabel="Clear Filters"
            accent={ACCENT}
            onAction={() => setFilters({ ...filters, ac: null, sleeper: null })}
          />
        }
        renderItem={({ item }) => (
          <BusResultCard 
            bus={item} 
            onPress={() => handleContinueToSeats(item)} 
            onViewSeatsClick={() => handleContinueToSeats(item)} 
          />
        )}
      />

      {/* Floating Bottom Nav Bar */}
      <View style={styles.bottomFilterNav}>
        <Pressable 
          style={styles.filterNavItem}
          onPress={() => setFilters({ ...filters, sleeper: filters.sleeper === null ? true : null })}
        >
          <MaterialCommunityIcons name="seat-passenger" size={20} color={filters.sleeper === true ? '#3B82F6' : '#9CA3AF'} />
          <Text style={[styles.filterNavText, filters.sleeper === true && {color: '#3B82F6'}]}>Sleeper</Text>
        </Pressable>
        <Pressable style={styles.filterNavItem} onPress={() => setShowTimingModal(true)}>
          <MaterialCommunityIcons name="clock-outline" size={20} color="#9CA3AF" />
          <Text style={styles.filterNavText}>Timing</Text>
        </Pressable>
        <Pressable 
          style={styles.filterNavItem}
          onPress={() => setFilters({ ...filters, ac: filters.ac === null ? true : null })}
        >
          <MaterialCommunityIcons name="snowflake" size={20} color={filters.ac === true ? '#3B82F6' : '#9CA3AF'} />
          <Text style={[styles.filterNavText, filters.ac === true && {color: '#3B82F6'}]}>AC</Text>
        </Pressable>
        <Pressable 
          style={styles.filterNavItem}
          onPress={() => setSortBy(sortBy === 'departure' ? 'fare' : 'departure')}
        >
          <MaterialCommunityIcons name="sort" size={20} color={sortBy === 'fare' ? '#3B82F6' : '#9CA3AF'} />
          <Text style={[styles.filterNavText, sortBy === 'fare' && {color: '#3B82F6'}]}>Sort {sortBy === 'fare' && 'Fare'}</Text>
        </Pressable>
        <Pressable style={styles.filterNavItem} onPress={() => alert('More filters coming soon!')}>
          <MaterialCommunityIcons name="filter-variant" size={20} color="#9CA3AF" />
          <Text style={styles.filterNavText}>Filters</Text>
        </Pressable>
      </View>

      {/* Timing Filter Modal */}
      <Modal visible={showTimingModal} animationType="slide" transparent>
        <Pressable style={styles.modalOverlay} onPress={() => setShowTimingModal(false)}>
          <Pressable style={styles.timingSheet} onPress={(e) => e.stopPropagation()}>
            <View style={styles.timingSheetHeader}>
              <Text style={styles.timingSheetTitle}>Timing</Text>
              <Pressable onPress={() => setShowTimingModal(false)}>
                <Text style={styles.timingSheetApply}>APPLY</Text>
              </Pressable>
            </View>

            <Text style={styles.timingSectionLabel}>PICKUP TIME - {from.toUpperCase()}</Text>
            <View style={styles.timeSlotsRow}>
              <View style={styles.timeSlot}>
                <MaterialCommunityIcons name="weather-sunset-up" size={24} color="#6B7280" />
                <Text style={styles.timeSlotText}>6 AM - 12 PM</Text>
              </View>
              <View style={styles.timeSlot}>
                <MaterialCommunityIcons name="weather-sunny" size={24} color="#6B7280" />
                <Text style={styles.timeSlotText}>12 PM - 6 PM</Text>
              </View>
              <View style={styles.timeSlot}>
                <MaterialCommunityIcons name="weather-sunset-down" size={24} color="#6B7280" />
                <Text style={styles.timeSlotText}>6 PM - 12 AM</Text>
              </View>
              <View style={styles.timeSlot}>
                <MaterialCommunityIcons name="weather-night" size={24} color="#6B7280" />
                <Text style={styles.timeSlotText}>12 AM - 6 AM</Text>
              </View>
            </View>

            <Text style={[styles.timingSectionLabel, {marginTop: 16}]}>DROPOFF TIME - {to.toUpperCase()}</Text>
            <View style={styles.timeSlotsRow}>
              <View style={styles.timeSlot}>
                <MaterialCommunityIcons name="weather-sunset-up" size={24} color="#6B7280" />
                <Text style={styles.timeSlotText}>6 AM - 12 PM</Text>
              </View>
              <View style={styles.timeSlot}>
                <MaterialCommunityIcons name="weather-sunny" size={24} color="#6B7280" />
                <Text style={styles.timeSlotText}>12 PM - 6 PM</Text>
              </View>
              <View style={styles.timeSlot}>
                <MaterialCommunityIcons name="weather-sunset-down" size={24} color="#6B7280" />
                <Text style={styles.timeSlotText}>6 PM - 12 AM</Text>
              </View>
              <View style={styles.timeSlot}>
                <MaterialCommunityIcons name="weather-night" size={24} color="#6B7280" />
                <Text style={styles.timeSlotText}>12 AM - 6 AM</Text>
              </View>
            </View>
            <SafeAreaView edges={['bottom']} />
          </Pressable>
        </Pressable>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F1F5F9' },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  loadingTitle: { fontSize: typography.section, fontWeight: '800', color: colors.text },
  loadingSubtitle: { fontSize: typography.caption, color: colors.textMuted, textAlign: 'center' },
  list: { paddingBottom: 100 },
  
  headerWidgets: { paddingHorizontal: 12, paddingTop: 12, paddingBottom: 8 },
  bannerRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  miniBanner: { flex: 1, borderRadius: 8, padding: 8, borderWidth: 1 },
  miniBannerTitle: { fontSize: 11, fontWeight: '800', marginBottom: 2 },
  miniBannerSub: { fontSize: 9, color: '#4B5563', fontWeight: '600' },
  
  offerCard: { flexDirection: 'row', backgroundColor: '#FFFFFF', borderRadius: 8, padding: 12, alignItems: 'center', borderWidth: 1, borderColor: '#E2E8F0' },
  offerCardLeft: { marginRight: 12 },
  offerCircle: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#EF4444', alignItems: 'center', justifyContent: 'center' },
  offerCircleText: { color: '#FFF', fontSize: 10, fontWeight: '900', letterSpacing: -0.5 },
  offerCardMid: { flex: 1, paddingRight: 8 },
  offerCode: { fontSize: 12, fontWeight: '800', color: '#1F2937', marginBottom: 2 },
  offerDesc: { fontSize: 10, color: '#6B7280', lineHeight: 14 },
  offerLogin: { fontSize: 12, fontWeight: '800', color: '#3B82F6' },

  bottomFilterNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 12,
    paddingBottom: 24, // safe area padding
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  filterNavItem: { alignItems: 'center', gap: 4 },
  filterNavText: { color: '#64748B', fontSize: 10, fontWeight: '700' },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  timingSheet: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 16, borderTopRightRadius: 16, padding: 20 },
  timingSheetHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 },
  timingSheetTitle: { fontSize: 18, fontWeight: '800', color: '#1F2937' },
  timingSheetApply: { fontSize: 14, fontWeight: '800', color: '#3B82F6' },
  
  timingSectionLabel: { fontSize: 10, fontWeight: '800', color: '#6B7280', marginBottom: 12, letterSpacing: 0.5 },
  timeSlotsRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  timeSlot: { width: '48%', flexDirection: 'row', alignItems: 'center', gap: 8, padding: 12, borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8 },
  timeSlotText: { fontSize: 12, fontWeight: '700', color: '#374151' },
});
