import { useState } from 'react';
import {
  Dimensions,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

import { useSuperAppStore } from '@/src/store/super-app-store';
import { formatHotelDate, getaways, offers } from '@/src/lib/hotel-data';
import { colors, radius, spacing, typography } from '@/src/theme/tokens';

const { width: W } = Dimensions.get('window');

const popularCities = [
  { id: 'hyd', city: 'Hyderabad', label: 'City of Pearls', image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=400&q=80' },
  { id: 'goa', city: 'Goa', label: 'Sun, Sand & Sea', image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=400&q=80' },
  { id: 'blr', city: 'Bengaluru', label: 'Garden City', image: 'https://images.unsplash.com/photo-1566552881560-0be862a7c445?w=400&q=80' },
  { id: 'mum', city: 'Mumbai', label: 'City of Dreams', image: 'https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?w=400&q=80' },
  { id: 'del', city: 'Delhi', label: 'Capital Vibes', image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=400&q=80' },
];

const weekdays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

const toDateKey = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

const parseDateKey = (dateKey: string) => {
  const [year, month, day] = dateKey.split('-').map(Number);
  return new Date(year, month - 1, day);
};

const addDays = (dateKey: string, days: number) => {
  const date = parseDateKey(dateKey);
  date.setDate(date.getDate() + days);
  return toDateKey(date);
};

const diffDays = (startKey: string, endKey: string) =>
  Math.max(1, Math.round((parseDateKey(endKey).getTime() - parseDateKey(startKey).getTime()) / (1000 * 60 * 60 * 24)));

const monthLabel = (year: number, month: number) =>
  new Date(year, month, 1).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });

const buildMonthDays = (year: number, month: number) => {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  return [
    ...Array.from({ length: firstDay }, () => null),
    ...Array.from({ length: daysInMonth }, (_, index) => toDateKey(new Date(year, month, index + 1))),
  ];
};

export default function HotelsScreen() {
  const { setHotelSearch, hotelSearch, setHotelCouponCode } = useSuperAppStore();
  const [activeTab, setActiveTab] = useState<'regular' | 'hourly'>(hotelSearch.searchType);
  const [cityModalVisible, setCityModalVisible] = useState(false);
  const [dateModalVisible, setDateModalVisible] = useState(false);
  const [guestModalVisible, setGuestModalVisible] = useState(false);
  const [cityQuery, setCityQuery] = useState('');
  const [dateStep, setDateStep] = useState<'checkIn' | 'checkOut'>('checkIn');

  const nights = diffDays(hotelSearch.checkInDate, hotelSearch.checkOutDate);
  const checkInDate = parseDateKey(hotelSearch.checkInDate);
  const calendarMonths = Array.from({ length: 4 }, (_, index) => ({
    year: new Date(checkInDate.getFullYear(), checkInDate.getMonth() + index, 1).getFullYear(),
    month: new Date(checkInDate.getFullYear(), checkInDate.getMonth() + index, 1).getMonth(),
  }));

  const filteredCities = popularCities.filter((city) =>
    `${city.city} ${city.label}`.toLowerCase().includes(cityQuery.trim().toLowerCase()),
  );

  const updateSearch = (next: Partial<typeof hotelSearch>) => {
    setHotelSearch({
      ...hotelSearch,
      ...next,
    });
  };

  const handleTabPress = (searchType: 'regular' | 'hourly') => {
    setActiveTab(searchType);
    updateSearch({
      searchType,
      checkInTime: searchType === 'hourly' ? hotelSearch.checkInTime ?? '10:00 AM' : undefined,
    });
  };

  const handleSearch = (city?: string, couponCode?: string) => {
    setHotelSearch({
      ...hotelSearch,
      searchType: activeTab,
      city: city || hotelSearch.city,
    });
    if (couponCode) {
      setHotelCouponCode(couponCode);
    }
    router.push('/(hotel-module)/hotel-results');
  };

  const selectCity = (city: string) => {
    updateSearch({ city });
    setCityModalVisible(false);
  };

  const selectCalendarDate = (dateKey: string) => {
    if (dateStep === 'checkIn' || parseDateKey(dateKey) <= parseDateKey(hotelSearch.checkInDate)) {
      updateSearch({
        checkInDate: dateKey,
        checkOutDate: addDays(dateKey, 1),
      });
      setDateStep('checkOut');
      return;
    }

    updateSearch({
      checkOutDate: dateKey,
    });
    setDateStep('checkIn');
  };

  const isInSelectedRange = (dateKey: string) =>
    parseDateKey(dateKey) > parseDateKey(hotelSearch.checkInDate) &&
    parseDateKey(dateKey) < parseDateKey(hotelSearch.checkOutDate);

  const updateOccupancy = (field: 'rooms' | 'guests', delta: number) => {
    const max = field === 'rooms' ? 4 : 8;
    updateSearch({
      [field]: Math.min(max, Math.max(1, hotelSearch[field] + delta)),
    });
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#172B4D', '#29446D', '#405B84']} style={styles.hero}>
        <View style={styles.heroContent}>
          <View style={styles.heroTop}>
            <Pressable onPress={() => router.back()} style={styles.backBtn}>
              <MaterialCommunityIcons name="arrow-left" size={22} color="#FFF" />
            </Pressable>
            <Text style={styles.heroTitle}>Hotels & Stays</Text>
            <View style={{ width: 36 }} />
          </View>

          <View style={styles.tabRow}>
            <Pressable
              style={[styles.tab, activeTab === 'regular' && styles.tabActive]}
              onPress={() => handleTabPress('regular')}
            >
              <MaterialCommunityIcons name="bed-queen-outline" size={14} color={activeTab === 'regular' ? '#172B4D' : '#FFF'} />
              <Text style={[styles.tabText, activeTab === 'regular' && styles.tabTextActive]}>Upto 4 Rooms</Text>
            </Pressable>
            <Pressable
              style={[styles.tab, activeTab === 'hourly' && styles.tabActive]}
              onPress={() => handleTabPress('hourly')}
            >
              <MaterialCommunityIcons name="clock-outline" size={14} color={activeTab === 'hourly' ? '#172B4D' : '#FFF'} />
              <Text style={[styles.tabText, activeTab === 'hourly' && styles.tabTextActive]}>Hourly Stays</Text>
            </Pressable>
          </View>

          <View style={styles.searchBox}>
            <Pressable style={styles.searchRow} onPress={() => setCityModalVisible(true)}>
              <MaterialCommunityIcons name="map-marker-outline" size={18} color="#405B84" />
              <View style={styles.searchTextWrap}>
                <Text style={styles.searchLabel}>City / Area / Property</Text>
                <Text style={styles.searchValue}>{hotelSearch.city}</Text>
              </View>
              <MaterialCommunityIcons name="chevron-down" size={18} color="#405B84" />
            </Pressable>

            <View style={styles.searchDivider} />

            <Pressable style={styles.searchBottomRow} onPress={() => setDateModalVisible(true)}>
              <View style={styles.searchDateWrap}>
                <MaterialCommunityIcons name="calendar-range" size={16} color="#405B84" />
                <View>
                  <Text style={styles.searchLabel}>Check-in</Text>
                  <Text style={styles.searchSmall}>{formatHotelDate(hotelSearch.checkInDate)}</Text>
                </View>
              </View>
              <View style={styles.nightBadge}>
                <Text style={styles.nightText}>{activeTab === 'hourly' ? 'HOURLY' : `${nights} NIGHT`}</Text>
              </View>
              <View style={styles.searchDateWrap}>
                <View>
                  <Text style={styles.searchLabel}>Check-out</Text>
                  <Text style={styles.searchSmall}>{formatHotelDate(hotelSearch.checkOutDate)}</Text>
                </View>
                <MaterialCommunityIcons name="calendar-range" size={16} color="#405B84" />
              </View>
            </Pressable>

            <View style={styles.searchDivider} />

            <Pressable style={styles.searchRow} onPress={() => setGuestModalVisible(true)}>
              <MaterialCommunityIcons name="account-group-outline" size={18} color="#405B84" />
              <Text style={[styles.searchSmall, { flex: 1 }]}>{hotelSearch.rooms} Room · {hotelSearch.guests} Adults</Text>
              <MaterialCommunityIcons name="chevron-down" size={18} color="#405B84" />
            </Pressable>
          </View>

          <Pressable style={styles.searchBtn} onPress={() => handleSearch()}>
            <MaterialCommunityIcons name="magnify" size={18} color="#FFF" />
            <Text style={styles.searchBtnText}>SEARCH HOTELS</Text>
          </Pressable>
        </View>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Pressable style={styles.offerBanner} onPress={() => handleSearch(undefined, offers[0].code)}>
          <LinearGradient colors={['#F43F5E', '#EC4899']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.offerGrad}>
            <MaterialCommunityIcons name="tag-outline" size={16} color="#FFF" />
            <Text style={styles.offerText}>{offers[0].title}: {offers[0].subtitle}</Text>
            <MaterialCommunityIcons name="arrow-right" size={16} color="#FFF" />
          </LinearGradient>
        </Pressable>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Nearby Getaways</Text>
          <Text style={styles.sectionSub}>Book your perfect escape</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.getawayRow}>
          {getaways.map((g) => (
            <Pressable key={g.id} style={styles.getawayCard} onPress={() => handleSearch()}>
              <Image source={{ uri: g.image }} style={StyleSheet.absoluteFillObject} contentFit="cover" />
              <LinearGradient colors={['transparent', 'rgba(0,0,0,0.72)']} style={StyleSheet.absoluteFillObject} />
              <View style={styles.getawayContent}>
                <Text style={styles.getawayTitle}>{g.title}</Text>
                <Text style={styles.getawaySub}>{g.subtitle}</Text>
              </View>
            </Pressable>
          ))}
        </ScrollView>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Top City Picks</Text>
          <Text style={styles.sectionSub}>Most searched destinations</Text>
        </View>
        <View style={styles.citiesGrid}>
          {popularCities.map((c) => (
            <Pressable key={c.id} style={styles.cityCard} onPress={() => handleSearch(c.city)}>
              <Image source={{ uri: c.image }} style={StyleSheet.absoluteFillObject} contentFit="cover" />
              <LinearGradient colors={['transparent', 'rgba(0,0,0,0.68)']} style={StyleSheet.absoluteFillObject} />
              <View style={styles.cityContent}>
                <Text style={styles.cityName}>{c.city}</Text>
                <Text style={styles.cityLabel}>{c.label}</Text>
              </View>
            </Pressable>
          ))}
        </View>

        <Pressable style={styles.luxeBanner} onPress={() => handleSearch()}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80' }}
            style={StyleSheet.absoluteFillObject}
            contentFit="cover"
          />
          <LinearGradient colors={['rgba(23,43,77,0.55)', 'rgba(23,43,77,0.85)']} style={StyleSheet.absoluteFillObject} />
          <View style={styles.luxeContent}>
            <View style={styles.luxeBadge}>
              <Text style={styles.luxeBadgeText}>★ LUXE</Text>
            </View>
            <Text style={styles.luxeTitle}>Super Packages</Text>
            <Text style={styles.luxeSub}>Handpicked 5★ stays with exclusive perks, spa credits & more</Text>
            <View style={styles.luxeBtn}>
              <Text style={styles.luxeBtnText}>Explore Now</Text>
              <MaterialCommunityIcons name="arrow-right" size={14} color="#172B4D" />
            </View>
          </View>
        </Pressable>

        <Pressable style={styles.aiBox} onPress={() => router.push('/assistant')}>
          <LinearGradient colors={['#EEF2F7', '#F8FAFC']} style={styles.aiBoxInner}>
            <View style={styles.aiIconWrap}>
              <MaterialCommunityIcons name="creation" size={20} color="#405B84" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.aiTitle}>Myra.AI Hotel Finder</Text>
              <Text style={styles.aiSub}>{"Tell Myra what you're looking for - pool, spa, pet-friendly..."}</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={20} color="#405B84" />
          </LinearGradient>
        </Pressable>
      </ScrollView>

      <Modal visible={cityModalVisible} animationType="slide" onRequestClose={() => setCityModalVisible(false)}>
        <View style={styles.modalScreen}>
          <View style={styles.modalHeader}>
            <Pressable onPress={() => setCityModalVisible(false)} style={styles.modalIconBtn}>
              <MaterialCommunityIcons name="arrow-left" size={22} color={colors.text} />
            </Pressable>
            <Text style={styles.modalTitle}>Select City</Text>
          </View>
          <TextInput
            value={cityQuery}
            onChangeText={setCityQuery}
            placeholder="Search city, area, or property"
            placeholderTextColor={colors.textLight}
            style={styles.modalInput}
          />
          <ScrollView contentContainerStyle={styles.modalList}>
            {(filteredCities.length ? filteredCities : popularCities).map((city) => (
              <Pressable key={city.id} style={styles.modalOption} onPress={() => selectCity(city.city)}>
                <Image source={{ uri: city.image }} style={styles.modalOptionImage} contentFit="cover" />
                <View style={{ flex: 1 }}>
                  <Text style={styles.modalOptionTitle}>{city.city}</Text>
                  <Text style={styles.modalOptionSub}>{city.label}</Text>
                </View>
                {hotelSearch.city === city.city && <MaterialCommunityIcons name="check-circle" size={20} color={colors.success} />}
              </Pressable>
            ))}
          </ScrollView>
        </View>
      </Modal>

      <Modal visible={dateModalVisible} animationType="slide" onRequestClose={() => setDateModalVisible(false)}>
        <View style={styles.modalScreen}>
          <View style={styles.calendarHeader}>
            <Pressable onPress={() => setDateModalVisible(false)} style={styles.modalIconBtn}>
              <MaterialCommunityIcons name="arrow-left" size={22} color={colors.text} />
            </Pressable>
            <View style={{ flex: 1 }}>
              <Text style={styles.modalTitle}>Select Dates</Text>
              <Text style={styles.calendarHint}>
                {dateStep === 'checkIn' ? 'Choose your check-in date' : 'Now choose your check-out date'}
              </Text>
            </View>
          </View>

          <View style={styles.selectedDatesBar}>
            <Pressable
              style={[styles.selectedDatePill, dateStep === 'checkIn' && styles.selectedDatePillActive]}
              onPress={() => setDateStep('checkIn')}
            >
              <Text style={styles.selectedDateLabel}>CHECK-IN</Text>
              <Text style={styles.selectedDateValue}>{formatHotelDate(hotelSearch.checkInDate)}</Text>
            </Pressable>
            <View style={styles.selectedNightBadge}>
              <MaterialCommunityIcons name="weather-night" size={13} color="#405B84" />
              <Text style={styles.selectedNightText}>{nights} Night</Text>
            </View>
            <Pressable
              style={[styles.selectedDatePill, dateStep === 'checkOut' && styles.selectedDatePillActive]}
              onPress={() => setDateStep('checkOut')}
            >
              <Text style={styles.selectedDateLabel}>CHECK-OUT</Text>
              <Text style={styles.selectedDateValue}>{formatHotelDate(hotelSearch.checkOutDate)}</Text>
            </Pressable>
          </View>

          <View style={styles.weekdayRow}>
            {weekdays.map((day, index) => (
              <Text key={`${day}-${index}`} style={styles.weekdayText}>{day}</Text>
            ))}
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.calendarScroll}>
            {calendarMonths.map(({ year, month }) => (
              <View key={`${year}-${month}`} style={styles.monthBlock}>
                <Text style={styles.monthTitle}>{monthLabel(year, month)}</Text>
                <View style={styles.calendarGrid}>
                  {buildMonthDays(year, month).map((dateKey, index) => {
                    if (!dateKey) {
                      return <View key={`empty-${index}`} style={styles.dayCell} />;
                    }

                    const isCheckIn = dateKey === hotelSearch.checkInDate;
                    const isCheckOut = dateKey === hotelSearch.checkOutDate;
                    const inRange = isInSelectedRange(dateKey);

                    return (
                      <Pressable
                        key={dateKey}
                        style={[
                          styles.dayCell,
                          inRange && styles.dayCellInRange,
                          (isCheckIn || isCheckOut) && styles.dayCellSelected,
                        ]}
                        onPress={() => selectCalendarDate(dateKey)}
                      >
                        <Text style={[styles.dayText, (isCheckIn || isCheckOut) && styles.dayTextSelected]}>
                          {parseDateKey(dateKey).getDate()}
                        </Text>
                        {isCheckIn && <Text style={styles.dayCaption}>IN</Text>}
                        {isCheckOut && <Text style={styles.dayCaption}>OUT</Text>}
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            ))}
          </ScrollView>

          <View style={styles.calendarFooter}>
            <Pressable style={styles.doneBtn} onPress={() => setDateModalVisible(false)}>
              <Text style={styles.doneBtnText}>DONE</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <Modal visible={guestModalVisible} animationType="slide" transparent onRequestClose={() => setGuestModalVisible(false)}>
        <View style={styles.sheetBackdrop}>
          <View style={styles.guestSheet}>
            <View style={styles.sheetHandle} />
            <Text style={styles.modalTitle}>Rooms & Guests</Text>
            {([
              { field: 'rooms' as const, label: 'Rooms', value: hotelSearch.rooms },
              { field: 'guests' as const, label: 'Adults', value: hotelSearch.guests },
            ]).map((item) => (
              <View key={item.field} style={styles.counterRow}>
                <Text style={styles.counterLabel}>{item.label}</Text>
                <View style={styles.counterControls}>
                  <Pressable style={styles.counterBtn} onPress={() => updateOccupancy(item.field, -1)}>
                    <MaterialCommunityIcons name="minus" size={18} color="#405B84" />
                  </Pressable>
                  <Text style={styles.counterValue}>{item.value}</Text>
                  <Pressable style={styles.counterBtn} onPress={() => updateOccupancy(item.field, 1)}>
                    <MaterialCommunityIcons name="plus" size={18} color="#405B84" />
                  </Pressable>
                </View>
              </View>
            ))}
            <Pressable style={styles.doneBtn} onPress={() => setGuestModalVisible(false)}>
              <Text style={styles.doneBtnText}>DONE</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  hero: { paddingBottom: spacing.lg },
  heroContent: { paddingHorizontal: spacing.md, paddingTop: 56, gap: spacing.md },
  heroTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  backBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  heroTitle: { color: '#FFF', fontSize: typography.section, fontWeight: '900', letterSpacing: -0.5 },

  tabRow: { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: radius.pill, padding: 4, gap: 4 },
  tab: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 8, borderRadius: radius.pill },
  tabActive: { backgroundColor: '#FFF' },
  tabText: { color: '#FFF', fontSize: typography.caption, fontWeight: '700' },
  tabTextActive: { color: '#172B4D' },

  searchBox: { backgroundColor: '#FFF', borderRadius: radius.md, padding: spacing.md, gap: spacing.sm },
  searchRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  searchTextWrap: { flex: 1 },
  searchLabel: { fontSize: 10, color: colors.textMuted, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
  searchValue: { fontSize: typography.body, color: colors.text, fontWeight: '800', marginTop: 2 },
  searchSmall: { fontSize: typography.caption, color: colors.text, fontWeight: '700', marginTop: 2 },
  searchDivider: { height: 1, backgroundColor: colors.line },
  searchBottomRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  searchDateWrap: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  nightBadge: { backgroundColor: '#EEF2F7', paddingHorizontal: 10, paddingVertical: 4, borderRadius: radius.pill },
  nightText: { fontSize: 10, color: '#405B84', fontWeight: '900', letterSpacing: 0.5 },

  searchBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: '#F43F5E', borderRadius: radius.pill, paddingVertical: 14,
  },
  searchBtnText: { color: '#FFF', fontSize: typography.body, fontWeight: '900', letterSpacing: 0.5 },

  scrollContent: { paddingBottom: 40, gap: spacing.xl },

  offerBanner: { marginHorizontal: spacing.md, marginTop: spacing.md, borderRadius: radius.md, overflow: 'hidden' },
  offerGrad: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: spacing.md, paddingVertical: 12 },
  offerText: { color: '#FFF', fontSize: typography.caption, fontWeight: '700', flex: 1 },

  sectionHeader: { paddingHorizontal: spacing.md },
  sectionTitle: { fontSize: typography.section, fontWeight: '900', color: colors.text, letterSpacing: -0.5 },
  sectionSub: { fontSize: typography.caption, color: colors.textMuted, marginTop: 2 },

  getawayRow: { paddingHorizontal: spacing.md, gap: 12 },
  getawayCard: { width: 140, height: 180, borderRadius: radius.md, overflow: 'hidden' },
  getawayContent: { position: 'absolute', bottom: 12, left: 10, right: 10 },
  getawayTitle: { color: '#FFF', fontSize: 13, fontWeight: '900', lineHeight: 16 },
  getawaySub: { color: 'rgba(255,255,255,0.8)', fontSize: 10, marginTop: 2 },

  citiesGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: spacing.md, gap: 10 },
  cityCard: { width: (W - 48 - 10) / 2, height: 110, borderRadius: radius.md, overflow: 'hidden' },
  cityContent: { position: 'absolute', bottom: 10, left: 10 },
  cityName: { color: '#FFF', fontSize: typography.body, fontWeight: '900' },
  cityLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 10, marginTop: 2 },

  luxeBanner: { marginHorizontal: spacing.md, height: 180, borderRadius: radius.lg, overflow: 'hidden' },
  luxeContent: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: spacing.md },
  luxeBadge: { backgroundColor: '#F59E0B', alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, marginBottom: 8 },
  luxeBadgeText: { color: '#FFF', fontSize: 10, fontWeight: '900', letterSpacing: 0.5 },
  luxeTitle: { color: '#FFF', fontSize: 22, fontWeight: '900' },
  luxeSub: { color: 'rgba(255,255,255,0.8)', fontSize: 12, marginTop: 4, lineHeight: 16 },
  luxeBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 10,
    backgroundColor: '#FFF', alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 6, borderRadius: radius.pill,
  },
  luxeBtnText: { color: '#172B4D', fontSize: 12, fontWeight: '900' },

  aiBox: { marginHorizontal: spacing.md },
  aiBoxInner: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, padding: spacing.md, borderRadius: radius.md, borderWidth: 1, borderColor: colors.line },
  aiIconWrap: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#EEF2F7', alignItems: 'center', justifyContent: 'center' },
  aiTitle: { fontSize: typography.caption, fontWeight: '900', color: colors.text },
  aiSub: { fontSize: 11, color: colors.textMuted, marginTop: 2, lineHeight: 15 },

  modalScreen: { flex: 1, backgroundColor: '#F8FAFC', paddingTop: 54 },
  modalHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: spacing.md, paddingBottom: spacing.md },
  calendarHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: spacing.md, paddingBottom: spacing.sm },
  calendarHint: { fontSize: typography.caption, color: colors.textMuted, marginTop: 2 },
  modalIconBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  modalTitle: { fontSize: typography.body, color: colors.text, fontWeight: '900' },
  modalInput: {
    marginHorizontal: spacing.md,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    fontSize: typography.caption,
    color: colors.text,
  },
  modalList: { padding: spacing.md, gap: 12 },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FFF',
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.line,
    padding: spacing.sm,
  },
  modalOptionImage: { width: 56, height: 56, borderRadius: radius.sm },
  modalOptionTitle: { fontSize: typography.body, color: colors.text, fontWeight: '900' },
  modalOptionSub: { fontSize: typography.caption, color: colors.textMuted, marginTop: 2 },
  selectedDatesBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
  },
  selectedDatePill: {
    flex: 1,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.md,
    paddingHorizontal: spacing.sm,
    paddingVertical: 10,
  },
  selectedDatePillActive: { borderColor: '#0084FF', backgroundColor: '#F0F7FF' },
  selectedDateLabel: { fontSize: 9, color: colors.textMuted, fontWeight: '800', letterSpacing: 0.5 },
  selectedDateValue: { fontSize: 12, color: colors.text, fontWeight: '900', marginTop: 3 },
  selectedNightBadge: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    backgroundColor: '#EEF2F7',
    borderRadius: radius.pill,
    paddingHorizontal: 8,
    paddingVertical: 7,
  },
  selectedNightText: { fontSize: 10, color: '#405B84', fontWeight: '900' },
  weekdayRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.line,
  },
  weekdayText: { flex: 1, textAlign: 'center', fontSize: 11, color: colors.textMuted, fontWeight: '900' },
  calendarScroll: { padding: spacing.md, paddingBottom: 110, gap: spacing.lg },
  monthBlock: { backgroundColor: '#FFF', borderRadius: radius.md, padding: spacing.md, borderWidth: 1, borderColor: colors.line },
  monthTitle: { fontSize: typography.body, color: colors.text, fontWeight: '900', marginBottom: spacing.sm },
  calendarGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  dayCell: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 0,
  },
  dayCellInRange: { backgroundColor: '#E0F2FE' },
  dayCellSelected: { backgroundColor: '#0084FF', borderRadius: radius.pill },
  dayText: { fontSize: typography.caption, color: colors.text, fontWeight: '800' },
  dayTextSelected: { color: '#FFF' },
  dayCaption: { fontSize: 8, color: '#FFF', fontWeight: '900', marginTop: 1 },
  calendarFooter: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#FFF',
    padding: spacing.md,
    paddingBottom: 28,
    borderTopWidth: 1,
    borderTopColor: colors.line,
  },
  dateOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFF',
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.line,
    padding: spacing.md,
  },
  sheetBackdrop: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(15,23,42,0.35)' },
  guestSheet: { backgroundColor: '#FFF', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: spacing.lg, gap: spacing.md },
  sheetHandle: { alignSelf: 'center', width: 44, height: 4, borderRadius: 2, backgroundColor: colors.lineStrong, marginBottom: 4 },
  counterRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  counterLabel: { fontSize: typography.body, color: colors.text, fontWeight: '800' },
  counterControls: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  counterBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#EEF2F7', alignItems: 'center', justifyContent: 'center' },
  counterValue: { minWidth: 24, textAlign: 'center', fontSize: typography.body, fontWeight: '900', color: colors.text },
  doneBtn: { backgroundColor: '#172B4D', borderRadius: radius.pill, paddingVertical: 14, alignItems: 'center', marginTop: spacing.sm },
  doneBtnText: { color: '#FFF', fontSize: typography.body, fontWeight: '900' },
});
