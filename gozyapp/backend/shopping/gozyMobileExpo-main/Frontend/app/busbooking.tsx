import { useMemo, useState, type ReactNode } from 'react';
import { Alert, Dimensions, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BusCalendarModal } from '@/src/components/bus-calendar-modal';
import { BusCityModal } from '@/src/components/bus-city-modal';
import { GovtBusCard } from '@/src/components/govt-bus-card';
import { buildBusRouteQuery, formatBusDate, isSameBusRoute } from '@/src/lib/bus-booking-utils';
import { BUS_OFFERS } from '@/src/lib/bus-offers';
import { GOVT_BUS_OPERATORS } from '@/src/lib/govt-bus-operators';

const { width } = Dimensions.get('window');
const ACCENT = '#10A8EC';
const GRADIENT = ['#15BDF2', '#006BFF'] as const;

export default function BusBookingScreen() {
  const [fromCity, setFromCity] = useState('Bangalore');
  const [toCity, setToCity] = useState('Ahmedabad');
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [showFromModal, setShowFromModal] = useState(false);
  const [showToModal, setShowToModal] = useState(false);
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(new Date());

  const { today, tomorrow, isToday, isTomorrow } = useMemo(() => {
    const now = new Date();
    const next = new Date(now);
    next.setDate(next.getDate() + 1);
    return {
      today: now,
      tomorrow: next,
      isToday: selectedDate.toDateString() === now.toDateString(),
      isTomorrow: selectedDate.toDateString() === next.toDateString(),
    };
  }, [selectedDate]);

  const navigateRoute = (path: string, extra?: Record<string, string>) => {
    if (isSameBusRoute(fromCity, toCity)) {
      Alert.alert('Same city', 'Pick different cities for your route.');
      return;
    }
    router.push(`${path}?${buildBusRouteQuery(fromCity, toCity, selectedDate, extra)}` as never);
  };

  return (
    <SafeAreaView edges={['top']} style={styles.root}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} hitSlop={8}>
            <MaterialCommunityIcons name="arrow-left" size={24} color="#202124" />
          </Pressable>
          <Text style={styles.headerTitle}>Bus Search</Text>
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.searchCard}>
            <View style={styles.routeBox}>
              <RouteField label="FROM" value={fromCity} filled onPress={() => setShowFromModal(true)} />
              <View style={styles.divider} />
              <RouteField label="TO" value={toCity} onPress={() => setShowToModal(true)} />
              <Pressable
                onPress={() => {
                  setFromCity(toCity);
                  setToCity(fromCity);
                }}
                style={styles.swapButton}
              >
                <MaterialCommunityIcons name="swap-vertical" size={24} color={ACCENT} />
              </Pressable>
            </View>

            <View style={styles.dateRow}>
              <Pressable onPress={() => setShowCalendarModal(true)} style={styles.dateMain}>
                <MaterialCommunityIcons name="calendar-month-outline" size={22} color="#9AA1AB" />
                <View style={styles.fieldCopy}>
                  <Text style={styles.fieldLabel}>DATE</Text>
                  <Text style={styles.fieldValue}>{formatBusDate(selectedDate)}</Text>
                </View>
              </Pressable>
              <DateChip label="Today" active={isToday} onPress={() => setSelectedDate(today)} />
              <DateChip label="Tomorrow" active={isTomorrow} onPress={() => setSelectedDate(tomorrow)} />
            </View>

            <Pressable onPress={() => navigateRoute('/bus-results')} style={styles.searchWrap}>
              <LinearGradient colors={GRADIENT} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.searchBtn}>
                <Text style={styles.searchBtnText}>SEARCH BUSES</Text>
              </LinearGradient>
            </Pressable>
          </View>

          <BusCityModal
            visible={showFromModal}
            title="Leaving from"
            currentCity={fromCity}
            excludeCity={toCity}
            accent={ACCENT}
            onSelect={setFromCity}
            onClose={() => setShowFromModal(false)}
          />
          <BusCityModal
            visible={showToModal}
            title="Going to"
            currentCity={toCity}
            excludeCity={fromCity}
            accent={ACCENT}
            onSelect={setToCity}
            onClose={() => setShowToModal(false)}
          />
          <BusCalendarModal
            visible={showCalendarModal}
            title="Select date"
            selectedDate={selectedDate}
            calendarMonth={calendarMonth}
            accent={ACCENT}
            onSelect={(day) => {
              setSelectedDate(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), day));
              setShowCalendarModal(false);
            }}
            onClose={() => setShowCalendarModal(false)}
            onMonthChange={setCalendarMonth}
          />

          <Section icon="sale-outline" title="OFFERS">
            <ScrollView horizontal contentContainerStyle={styles.offerRail} showsHorizontalScrollIndicator={false}>
              {BUS_OFFERS.map((offer) => (
                <View key={offer.id} style={styles.offerCard}>
                  <Image source={{ uri: offer.image }} style={styles.offerImage} />
                  <LinearGradient colors={['rgba(255,255,255,0)', 'rgba(255,255,255,0.92)']} style={styles.offerFade} />
                  <View style={styles.offerBadge}>
                    <Text style={styles.offerBadgeText}>{offer.badge}</Text>
                  </View>
                  <View style={styles.offerCopy}>
                    <Text style={styles.offerKicker}>SAVE ON SUMMER TRIPS</Text>
                    <Text style={styles.offerTitle}>{offer.title}</Text>
                    <Text numberOfLines={1} style={styles.offerSubtitle}>
                      {offer.subtitle}
                    </Text>
                    <Text style={styles.offerCta}>{offer.cta}</Text>
                  </View>
                </View>
              ))}
            </ScrollView>
          </Section>

          <Section icon="bus" title="AVAILABLE STATE GOVT BUSES">
            <ScrollView horizontal contentContainerStyle={styles.govtRail} showsHorizontalScrollIndicator={false}>
              {GOVT_BUS_OPERATORS.map((bus) => (
                <GovtBusCard key={bus.id} bus={bus} />
              ))}
            </ScrollView>
            <Pressable onPress={() => navigateRoute('/govt-bus-results')} style={styles.govtSearchBtn}>
              <MaterialCommunityIcons name="shield-check" size={18} color="#166534" />
              <Text style={styles.govtSearchText}>Search all state govt buses on this route</Text>
              <MaterialCommunityIcons name="chevron-right" size={20} color="#166534" />
            </Pressable>
          </Section>

          <View style={styles.askCard}>
            <Text style={styles.askText}>Search buses or ask for help</Text>
            <MaterialCommunityIcons name="creation" size={18} color="#1C8CE8" />
          </View>
        </ScrollView>
    </SafeAreaView>
  );
}

function RouteField({
  label,
  value,
  filled,
  onPress,
}: {
  label: string;
  value: string;
  filled?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={styles.routeRow}>
      <View style={styles.routeRail}>
        <View style={filled ? styles.dotFilled : styles.dot} />
        {filled ? <View style={styles.routeLine} /> : null}
      </View>
      <View style={styles.fieldCopy}>
        <Text style={styles.fieldLabel}>{label}</Text>
        <Text style={styles.fieldValue}>{value}</Text>
      </View>
    </Pressable>
  );
}

function DateChip({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={[styles.dateChip, active && styles.dateChipActive]}>
      <Text style={[styles.dateChipText, active && styles.dateChipTextActive]}>{label}</Text>
    </Pressable>
  );
}

function Section({
  icon,
  title,
  children,
}: {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  title: string;
  children: ReactNode;
}) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHead}>
        <MaterialCommunityIcons name={icon} size={16} color="#7B8592" />
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F4F4F4' },
  header: {
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
  },
  headerTitle: { color: '#333', fontSize: 18, fontWeight: '800' },
  content: { paddingBottom: 28 },
  searchCard: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E9E9E9',
  },
  routeBox: {
    borderWidth: 1,
    borderColor: '#E7E8EB',
    borderRadius: 8,
    backgroundColor: '#FAFAFA',
  },
  routeRow: { minHeight: 76, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14 },
  routeRail: { width: 20, alignItems: 'center', alignSelf: 'stretch', paddingTop: 20 },
  dotFilled: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#8F96A3' },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 1.4,
    borderColor: '#A4AAB4',
    backgroundColor: '#FFFFFF',
  },
  routeLine: { width: 1, flex: 1, marginTop: 4, backgroundColor: '#DADDE2' },
  fieldCopy: { flex: 1, gap: 2 },
  fieldLabel: { color: '#989EA8', fontSize: 10, fontWeight: '900' },
  fieldValue: { color: '#191919', fontSize: 15, fontWeight: '900' },
  divider: { height: 1, marginLeft: 46, backgroundColor: '#ECEDEF' },
  swapButton: {
    position: 'absolute',
    right: 12,
    top: 62,
    width: 34,
    height: 34,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8EEF5',
    elevation: 3,
  },
  dateRow: {
    minHeight: 56,
    marginTop: 9,
    borderWidth: 1,
    borderColor: '#E7E8EB',
    borderRadius: 8,
    backgroundColor: '#FAFAFA',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 11,
    gap: 9,
  },
  dateMain: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 9 },
  dateChip: {
    minWidth: 63,
    height: 32,
    paddingHorizontal: 10,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#ECEDEF',
  },
  dateChipActive: { backgroundColor: '#15BDF2', borderColor: '#15BDF2' },
  dateChipText: { color: '#7C838D', fontSize: 12, fontWeight: '800' },
  dateChipTextActive: { color: '#FFFFFF', fontWeight: '900' },
  searchWrap: { marginTop: 12 },
  searchBtn: { height: 51, borderRadius: 7, alignItems: 'center', justifyContent: 'center' },
  searchBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '900' },
  section: {
    marginTop: 8,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E7E7E7',
  },
  sectionHead: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 17, marginBottom: 12 },
  sectionTitle: { color: '#3B3F45', fontSize: 12, fontWeight: '900' },
  offerRail: { paddingHorizontal: 17, gap: 12 },
  offerCard: {
    width: Math.min(254, width - 52),
    height: 133,
    borderRadius: 9,
    overflow: 'hidden',
    backgroundColor: '#F7F7F7',
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  offerImage: { width: '100%', height: '100%' },
  offerFade: { ...StyleSheet.absoluteFillObject },
  offerBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 9,
    backgroundColor: '#FFE55C',
    borderWidth: 1,
    borderColor: '#101010',
  },
  offerBadgeText: { color: '#111', fontSize: 8, fontWeight: '900' },
  offerCopy: { position: 'absolute', left: 10, right: 10, bottom: 7 },
  offerKicker: {
    alignSelf: 'flex-start',
    paddingHorizontal: 5,
    paddingVertical: 2,
    backgroundColor: '#1D1D1D',
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '900',
  },
  offerTitle: { color: '#191919', fontSize: 16, fontWeight: '900' },
  offerSubtitle: { color: '#343434', fontSize: 9, fontWeight: '700' },
  offerCta: { alignSelf: 'flex-end', color: '#1495DF', fontSize: 10, fontWeight: '900' },
  govtRail: { paddingHorizontal: 17, gap: 12, paddingBottom: 8 },
  govtSearchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginHorizontal: 17,
    marginTop: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: '#ECFDF3',
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  govtSearchText: { flex: 1, fontSize: 12, fontWeight: '800', color: '#166534' },
  askCard: {
    height: 34,
    marginHorizontal: 57,
    marginTop: -18,
    borderRadius: 17,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E6F0FA',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    elevation: 3,
  },
  askText: { color: '#168BE9', fontSize: 12, fontWeight: '900' },
});
