import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { colors, radius, spacing, typography, shadow } from '@/src/theme/tokens';
import { getBoardingPoints, getDroppingPoints } from '@/src/services/busService';
import { BoardingPoint, DroppingPoint } from '@/src/store/bus-booking-store';

const PRIMARY = '#0A67FF';
const UNDERLINE_BLUE = '#1A6FEF';

type Mode = 'boarding' | 'dropping';

export default function BoardingSelectionScreen() {
  const params = useLocalSearchParams<{
    busId: string;
    operator: string;
    busType: string;
    seats: string;
    totalFare: string;
    fromCity: string;
    toCity: string;
    date: string;
    departureTime: string;
    arrivalTime: string;
    duration: string;
  }>();

  const [mode, setMode] = useState<Mode>('boarding');
  const [boardingPoints, setBoardingPoints] = useState<BoardingPoint[]>([]);
  const [droppingPoints, setDroppingPoints] = useState<DroppingPoint[]>([]);
  const [selectedBoarding, setSelectedBoarding] = useState<BoardingPoint | null>(null);
  const [selectedDropping, setSelectedDropping] = useState<DroppingPoint | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const seatCount = params.seats?.split(',').length ?? 1;
  const totalFare = parseInt(params.totalFare ?? '0', 10);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const [bp, dp] = await Promise.all([
        getBoardingPoints(params.fromCity ?? 'Bangalore'),
        getDroppingPoints(params.toCity ?? 'Hyderabad'),
      ]);
      setBoardingPoints(bp);
      setDroppingPoints(dp);
      setSelectedBoarding(bp[0]);
      setIsLoading(false);
    })();
  }, [params.fromCity, params.toCity]);

  const list = mode === 'boarding' ? boardingPoints : droppingPoints;
  const dateLabelBoarding = formatDateLabel(params.date ?? '');
  const dateLabelDropping = formatDateLabel(params.date ?? '', 1);

  const handleNext = () => {
    if (mode === 'boarding') {
      setMode('dropping');
    } else {
      router.push({
        pathname: '/(bus-module)/review-booking',
        params: {
          busId: params.busId,
          operator: params.operator,
          busType: params.busType,
          seats: params.seats,
          totalFare: params.totalFare,
          fromCity: params.fromCity,
          toCity: params.toCity,
          date: params.date,
          departureTime: params.departureTime,
          arrivalTime: params.arrivalTime,
          duration: params.duration,
          boardingName: selectedBoarding?.name ?? '',
          boardingTime: selectedBoarding?.time ?? '',
          droppingName: selectedDropping?.name ?? '',
          droppingTime: selectedDropping?.time ?? '',
        },
      } as any);
    }
  };

  const canProceed =
    mode === 'boarding' ? selectedBoarding !== null : selectedDropping !== null;

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.container}>
      {/* ── Header ── */}
      <View style={styles.header}>
        <Pressable
          onPress={() => (mode === 'dropping' ? setMode('boarding') : router.back())}
          hitSlop={12}
          style={styles.backBtn}
        >
          <MaterialCommunityIcons name="arrow-left" size={22} color="#000" />
        </Pressable>
        <Text style={styles.headerTitle}>Select Pickup & Drop Point</Text>
      </View>

      {/* ── Tab Bar (Gozy style) ── */}
      <View style={styles.tabBar}>
        <Pressable onPress={() => setMode('boarding')} style={styles.tabItem}>
          <Text style={[styles.tabLabel, mode === 'boarding' && styles.tabLabelActive]}>
            PICKUP POINTS
          </Text>
          <Text
            numberOfLines={1}
            style={[styles.tabSub, mode === 'boarding' && styles.tabSubSelected]}
          >
            {mode === 'boarding' || !selectedBoarding ? 'Select a point' : selectedBoarding.name}
          </Text>
          {mode === 'boarding' && <View style={styles.tabUnderline} />}
        </Pressable>
        <Pressable onPress={() => mode === 'boarding' ? null : setMode('dropping')} style={styles.tabItem}>
          <Text style={[styles.tabLabel, mode === 'dropping' && styles.tabLabelActive]}>
            DROP POINTS
          </Text>
          <Text
            numberOfLines={1}
            style={[styles.tabSub, mode === 'dropping' && styles.tabSubSelected]}
          >
            {mode === 'dropping' && selectedDropping ? selectedDropping.name : 'Select a point'}
          </Text>
          {mode === 'dropping' && <View style={styles.tabUnderline} />}
        </Pressable>
      </View>

      {/* ── Map Banner ── */}
      <View style={styles.mapBanner}>
        <View style={styles.mapBannerLeft}>
          <Text style={styles.mapBannerTitle}>Choose a landmark and find the{'\n'}nearest pickup point</Text>
          <Pressable style={styles.searchNowBtn}>
            <Text style={styles.searchNowText}>Search now</Text>
          </Pressable>
        </View>
        <View style={styles.mapBannerRight}>
          <View style={styles.mapMockContainer}>
            {/* Mock mini-map */}
            <View style={styles.mapTrack}>
              <View style={styles.mapDotStart} />
              <View style={styles.mapLine} />
              <View style={styles.mapDotEnd}>
                <MaterialCommunityIcons name="map-marker" size={16} color="#E53935" />
              </View>
            </View>
            <Text style={styles.mapDistText}>4.3 km</Text>
          </View>
        </View>
      </View>

      {isLoading ? (
        <View style={styles.loadingView}>
          <ActivityIndicator size="large" color={PRIMARY} />
          <Text style={styles.loadingText}>Loading points…</Text>
        </View>
      ) : (
        <FlatList
          data={list}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <Text style={styles.dateLabel}>
              {mode === 'boarding' ? dateLabelBoarding : dateLabelDropping}
            </Text>
          }
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          renderItem={({ item }) => {
            const isSelected =
              mode === 'boarding'
                ? selectedBoarding?.id === item.id
                : selectedDropping?.id === item.id;

            return (
              <Pressable
                onPress={() => {
                  if (mode === 'boarding') {
                    setSelectedBoarding(item as BoardingPoint);
                  } else {
                    setSelectedDropping(item as DroppingPoint);
                  }
                }}
                style={styles.pointRow}
              >
                {/* Time column */}
                <View style={styles.timeCol}>
                  <Text style={styles.pointTime}>{item.time}</Text>
                </View>

                {/* Info column */}
                <View style={styles.pointInfo}>
                  <Text style={styles.pointName}>{item.name}</Text>
                  <Text style={styles.pointAddress} numberOfLines={4}>
                    {item.address}
                    {(item as any).landmark ? `\n${(item as any).landmark}` : ''}
                  </Text>
                </View>

                {/* Radio button */}
                <View style={[styles.radio, isSelected && styles.radioSelected]}>
                  {isSelected && <View style={styles.radioDot} />}
                </View>
              </Pressable>
            );
          }}
        />
      )}

      {/* ── Bottom Bar ── */}
      <View style={styles.bottomBar}>
        <View style={styles.bottomPriceCol}>
          <Text style={styles.bottomFare}>₹{totalFare.toLocaleString('en-IN')}</Text>
          <Text style={styles.bottomFareSub}>For {seatCount} Seat{seatCount > 1 ? 's' : ''}</Text>
        </View>
        <Pressable style={styles.offersBtn}>
          <Text style={styles.offersBtnText}>Offers</Text>
          <MaterialCommunityIcons name="chevron-up" size={16} color="#0F172A" />
        </Pressable>
        <Pressable
          onPress={handleNext}
          disabled={!canProceed}
          style={[styles.nextBtn, !canProceed && styles.nextBtnDisabled]}
        >
          <Text style={styles.nextBtnText}>Next</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

// ── Helpers ──
function formatDateLabel(dateIso: string, addDays = 0): string {
  try {
    const date = new Date(dateIso);
    date.setDate(date.getDate() + addDays);
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const yyyy = date.getFullYear();
    return `${dd}-${mm}-${yyyy}`;
  } catch {
    const today = new Date();
    today.setDate(today.getDate() + addDays);
    return `${String(today.getDate()).padStart(2, '0')}-${String(today.getMonth() + 1).padStart(2, '0')}-${today.getFullYear()}`;
  }
}

// ── Styles ──
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F7F7' },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EBEBEB',
    gap: 8,
  },
  backBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#000000' },

  // Tabs
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  tabItem: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 0,
    position: 'relative',
  },
  tabLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#9E9E9E',
    letterSpacing: 0.3,
    marginBottom: 3,
  },
  tabLabelActive: { color: '#000000' },
  tabSub: {
    fontSize: 12,
    color: '#9E9E9E',
    fontWeight: '400',
    marginBottom: 10,
  },
  tabSubSelected: { color: '#4A4A4A', fontWeight: '500' },
  tabUnderline: {
    position: 'absolute',
    bottom: 0,
    left: 16,
    right: 16,
    height: 3,
    backgroundColor: UNDERLINE_BLUE,
    borderRadius: 2,
  },

  // Map Banner
  mapBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    marginHorizontal: 12,
    marginTop: 12,
    borderRadius: 10,
    padding: 14,
    overflow: 'hidden',
  },
  mapBannerLeft: { flex: 1.2, gap: 10 },
  mapBannerTitle: { fontSize: 13, fontWeight: '500', color: '#1A1A1A', lineHeight: 20 },
  searchNowBtn: {
    alignSelf: 'flex-start',
    borderWidth: 1.5,
    borderColor: '#1A6FEF',
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  searchNowText: { fontSize: 13, fontWeight: '600', color: '#1A6FEF' },
  mapBannerRight: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  mapMockContainer: { alignItems: 'center', gap: 4 },
  mapTrack: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  mapDotStart: {
    width: 10, height: 10, borderRadius: 5,
    backgroundColor: '#26C6DA', borderWidth: 2, borderColor: '#FFF',
  },
  mapLine: { width: 40, height: 2.5, backgroundColor: '#26C6DA' },
  mapDotEnd: {},
  mapDistText: {
    fontSize: 10.5, fontWeight: '700', color: '#1A6FEF',
    backgroundColor: 'rgba(255,255,255,0.85)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4,
  },

  loadingView: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  loadingText: { fontSize: 13, color: '#9E9E9E', fontWeight: '600' },

  // List
  listContent: { paddingBottom: 16 },
  dateLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333333',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: '#F7F7F7',
  },
  separator: { height: 1, backgroundColor: '#EEEEEE', marginLeft: 16 },

  // Point row (Gozy style)
  pointRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    gap: 12,
  },
  timeCol: { width: 42, paddingTop: 1 },
  pointTime: { fontSize: 13, fontWeight: '700', color: '#1A1A1A' },
  pointInfo: { flex: 1 },
  pointName: { fontSize: 13, fontWeight: '700', color: '#1A1A1A', lineHeight: 20, marginBottom: 3 },
  pointAddress: { fontSize: 12, color: '#6E6E6E', lineHeight: 17, fontWeight: '400' },

  // Radio
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#BDBDBD',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
    flexShrink: 0,
  },
  radioSelected: { borderColor: UNDERLINE_BLUE },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: UNDERLINE_BLUE,
  },

// ── Bottom bar
  bottomBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1, borderTopColor: '#E2E8F0',
  },
  bottomPriceCol: { flex: 1 },
  bottomFare: { color: '#0F172A', fontSize: 18, fontWeight: '800' },
  bottomFareSub: { color: '#64748B', fontSize: 10, fontWeight: '600' },
  
  offersBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 12, paddingVertical: 8, backgroundColor: '#F1F5F9', borderRadius: 4, marginRight: 16, borderWidth: 1, borderColor: '#E2E8F0' },
  offersBtnText: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },

  nextBtn: { backgroundColor: '#3B82F6', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 4 },
  nextBtnDisabled: { opacity: 0.5 },
  nextBtnText: { color: '#FFFFFF', fontSize: 14, fontWeight: '800' },
});
