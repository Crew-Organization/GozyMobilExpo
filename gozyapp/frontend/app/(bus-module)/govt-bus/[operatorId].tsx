import { useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BusCalendarModal } from '@/src/components/bus-calendar-modal';
import { BusCityModal } from '@/src/components/bus-city-modal';
import { formatBusDate } from '@/src/lib/bus-booking-utils';
import { getGovtBusOperator, GOVT_BUS_UI } from '@/src/lib/govt-bus-operators';
import { colors, gradients, radius, spacing, typography } from '@/src/theme/tokens';

export default function GovtBusOperatorScreen() {
  const { operatorId } = useLocalSearchParams<{ operatorId: string | string[] }>();
  const resolvedId = Array.isArray(operatorId) ? operatorId[0] : operatorId ?? '';
  const operator = useMemo(() => getGovtBusOperator(resolvedId), [resolvedId]);

  const [fromCity, setFromCity] = useState(operator?.defaultFrom ?? '');
  const [toCity, setToCity] = useState(operator?.defaultTo ?? '');
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [showFromModal, setShowFromModal] = useState(false);
  const [showToModal, setShowToModal] = useState(false);
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(new Date());

  if (!operator) {
    return (
      <SafeAreaView style={styles.missing}>
        <Text style={styles.missingText}>Operator not found</Text>
        <Pressable onPress={() => router.back()} style={styles.missingBtn}>
          <Text style={styles.missingBtnText}>Go back</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  const ui = GOVT_BUS_UI;
  const { cities, colors: brandColors } = operator;
  const accent = brandColors[0];
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const isToday = selectedDate.toDateString() === today.toDateString();
  const isTomorrow = selectedDate.toDateString() === tomorrow.toDateString();

  const handleSearch = () => {
    if (fromCity.trim().toLowerCase() === toCity.trim().toLowerCase()) {
      Alert.alert('Same city', 'Pick different cities for your route.');
      return;
    }
    const query = new URLSearchParams({
      from: fromCity,
      to: toCity,
      date: selectedDate.toISOString(),
      operatorId: operator.id,
      operatorName: operator.name,
    }).toString();
    router.push(`/govt-bus-results?${query}` as never);
  };

  return (
    <View style={styles.root}>
      <SafeAreaView edges={['top']} style={styles.safe}>
        <View style={styles.topBar}>
          <Pressable onPress={() => router.back()} hitSlop={12} style={styles.backBtn}>
            <MaterialCommunityIcons name="arrow-left" size={24} color={colors.text} />
          </Pressable>
          <Text style={styles.topBarTitle}>{operator.name}</Text>
          <View style={styles.ratingBadge}>
            <MaterialCommunityIcons name="star" size={12} color={colors.white} />
            <Text style={styles.ratingText}>{operator.rating.toFixed(2)}</Text>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <View style={styles.hero}>
            <View style={styles.heroCopy}>
              <Text style={styles.nativeTitle}>{operator.nativeTitle}</Text>
              <Text style={styles.tagline}>{ui.tagline}</Text>
            </View>
            <View style={styles.heroLogoShell}>
              <Image source={operator.logo} style={styles.heroLogo} contentFit="contain" />
            </View>
          </View>

          <View style={styles.searchCard}>
            <View style={styles.routeBox}>
              <Pressable onPress={() => setShowFromModal(true)} style={styles.routeRow}>
                <MaterialCommunityIcons name="bus-side" size={22} color={colors.textMuted} />
                <View style={styles.routeCopy}>
                  <Text style={styles.fieldLabel}>{ui.from}</Text>
                  <Text style={styles.fieldValue}>{fromCity}</Text>
                </View>
              </Pressable>
              <View style={styles.routeDivider} />
              <Pressable onPress={() => setShowToModal(true)} style={styles.routeRow}>
                <MaterialCommunityIcons name="bus-side" size={22} color={colors.textMuted} />
                <View style={styles.routeCopy}>
                  <Text style={styles.fieldLabel}>{ui.to}</Text>
                  <Text style={styles.fieldValue}>{toCity}</Text>
                </View>
              </Pressable>
              <Pressable
                onPress={() => {
                  setFromCity(toCity);
                  setToCity(fromCity);
                }}
                style={styles.swapBtn}
              >
                <MaterialCommunityIcons name="swap-vertical" size={22} color={accent} />
              </Pressable>
            </View>

            <View style={styles.dateSection}>
              <Pressable onPress={() => setShowCalendarModal(true)} style={styles.dateMain}>
                <MaterialCommunityIcons name="calendar-month-outline" size={22} color={colors.textMuted} />
                <View style={styles.routeCopy}>
                  <Text style={styles.fieldLabel}>{ui.dateOfJourney}</Text>
                  <Text style={styles.fieldValue}>{formatBusDate(selectedDate, true)}</Text>
                </View>
              </Pressable>
              <Pressable
                onPress={() => setSelectedDate(new Date())}
                style={[styles.dateChip, isToday && { backgroundColor: `${accent}18`, borderColor: accent }]}
              >
                <Text style={[styles.dateChipText, isToday && { color: accent, fontWeight: '700' }]}>
                  {ui.today}
                </Text>
              </Pressable>
              <Pressable
                onPress={() => setSelectedDate(tomorrow)}
                style={[styles.dateChip, isTomorrow && { backgroundColor: `${accent}18`, borderColor: accent }]}
              >
                <Text style={[styles.dateChipText, isTomorrow && { color: accent, fontWeight: '700' }]}>
                  {ui.tomorrow}
                </Text>
              </Pressable>
            </View>

            <Pressable onPress={handleSearch} style={styles.searchPressable}>
              <LinearGradient
                colors={[...brandColors]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.searchBtn}
              >
                <MaterialCommunityIcons name="magnify" size={22} color={colors.white} />
                <Text style={styles.searchBtnText}>{ui.searchBuses}</Text>
              </LinearGradient>
            </Pressable>
            <Text style={styles.partnerNote}>
              Gozy — {ui.partnerNote} {operator.name}
            </Text>
          </View>

          <Text style={styles.sectionHeading}>
            {operator.name} {ui.concessionsTitle}
          </Text>
          <View style={[styles.concessionCard, { backgroundColor: `${accent}12` }]}>
            <View style={[styles.concessionIcon, { backgroundColor: `${accent}22` }]}>
              <MaterialCommunityIcons name="human-child" size={28} color={accent} />
            </View>
            <View style={styles.infoCopy}>
              <Text style={styles.infoTitle}>{ui.concessionHeadline}</Text>
              <Text style={styles.infoSub}>{ui.concessionSub}</Text>
            </View>
          </View>

          <Text style={styles.sectionHeading}>{ui.whyBookTitle}</Text>
          <View style={styles.whyCard}>
            <View style={styles.whyIcon}>
              <MaterialCommunityIcons name="headset" size={26} color={colors.sky} />
            </View>
            <View style={styles.infoCopy}>
              <Text style={styles.infoTitle}>{ui.whyBookHeadline}</Text>
              <Text style={styles.infoSub}>{ui.whyBookSub}</Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>

      <BusCityModal
        visible={showFromModal}
        title={ui.selectCity}
        currentCity={fromCity}
        excludeCity={toCity}
        cityNames={cities}
        accent={accent}
        onSelect={setFromCity}
        onClose={() => setShowFromModal(false)}
      />
      <BusCityModal
        visible={showToModal}
        title={ui.selectCity}
        currentCity={toCity}
        excludeCity={fromCity}
        cityNames={cities}
        accent={accent}
        onSelect={setToCity}
        onClose={() => setShowToModal(false)}
      />
      <BusCalendarModal
        visible={showCalendarModal}
        title={ui.selectDate}
        selectedDate={selectedDate}
        calendarMonth={calendarMonth}
        accent={accent}
        onSelect={(day) => {
          setSelectedDate(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), day));
          setShowCalendarModal(false);
        }}
        onClose={() => setShowCalendarModal(false)}
        onMonthChange={setCalendarMonth}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.canvas },
  safe: { flex: 1 },
  missing: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    backgroundColor: colors.canvas,
  },
  missingText: { fontSize: typography.body, color: colors.textMuted },
  missingBtn: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: colors.sky,
  },
  missingBtnText: { color: colors.white, fontWeight: '700' },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
    backgroundColor: colors.surface,
  },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  topBarTitle: {
    flex: 1,
    marginLeft: spacing.xs,
    fontSize: typography.section,
    fontWeight: '800',
    color: colors.text,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.pill,
    backgroundColor: colors.success,
  },
  ratingText: { color: colors.white, fontSize: typography.caption, fontWeight: '800' },
  scroll: { paddingBottom: spacing.xxl },
  hero: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    gap: spacing.sm,
  },
  heroCopy: { flex: 1, gap: 6 },
  nativeTitle: { fontSize: 22, fontWeight: '800', color: colors.text, lineHeight: 30 },
  tagline: { fontSize: typography.caption, color: colors.textMuted, lineHeight: 18 },
  heroLogoShell: {
    width: 72,
    height: 72,
    borderRadius: radius.sm,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 6,
  },
  heroLogo: { width: 58, height: 58 },
  searchCard: {
    marginHorizontal: spacing.md,
    marginTop: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    gap: spacing.md,
  },
  routeBox: {
    position: 'relative',
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.sm,
    overflow: 'hidden',
  },
  routeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 14,
  },
  routeDivider: { height: 1, backgroundColor: colors.line, marginLeft: 44 },
  routeCopy: { flex: 1, gap: 2 },
  fieldLabel: {
    fontSize: typography.tiny,
    fontWeight: '700',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  fieldValue: { fontSize: typography.body, fontWeight: '700', color: colors.text },
  swapBtn: {
    position: 'absolute',
    right: 12,
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
    elevation: 3,
  },
  dateSection: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  dateMain: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingVertical: 4 },
  dateChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surfaceSoft,
  },
  dateChipText: { fontSize: typography.caption, fontWeight: '600', color: colors.textMuted },
  searchPressable: { borderRadius: radius.pill, overflow: 'hidden' },
  searchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingVertical: 16,
    borderRadius: radius.pill,
  },
  searchBtnText: { color: colors.white, fontSize: typography.body, fontWeight: '800' },
  partnerNote: { textAlign: 'center', fontSize: typography.tiny, color: colors.textMuted },
  sectionHeading: {
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
    marginHorizontal: spacing.md,
    fontSize: typography.section,
    fontWeight: '800',
    color: colors.text,
  },
  concessionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginHorizontal: spacing.md,
    padding: spacing.md,
    borderRadius: radius.md,
  },
  concessionIcon: {
    width: 52,
    height: 52,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoCopy: { flex: 1, gap: 4 },
  infoTitle: { fontSize: typography.body, fontWeight: '800', color: colors.text },
  infoSub: { fontSize: typography.caption, color: colors.textMuted },
  whyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginHorizontal: spacing.md,
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
  },
  whyIcon: {
    width: 52,
    height: 52,
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceAccent,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
