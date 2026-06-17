import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { GovtBusResultCard } from '@/src/components/govt-bus-result-card';
import { BusResultsBanner, BusResultsEmpty, BusResultsHeader } from '@/src/components/bus-results-header';
import { BusResultsToolbar } from '@/src/components/bus-results-toolbar';
import { useBusSearchResults } from '@/src/hooks/use-bus-search-results';
import { formatBusDate, formatFetchedTime, parseBusTravelDate } from '@/src/lib/bus-booking-utils';
import { getGovtBusOperator } from '@/src/lib/govt-bus-operators';
import type { GovtBusListing } from '@/src/lib/govt-bus-search-data';
import { colors, spacing, typography } from '@/src/theme/tokens';

const GOVT_FILTERS = [
  { id: 'all' as const, label: 'All govt buses' },
  { id: 'ac' as const, label: 'AC' },
  { id: 'sleeper' as const, label: 'Sleeper' },
  { id: 'seater' as const, label: 'Seater' },
  { id: 'morning' as const, label: 'Before 12 PM' },
  { id: 'evening' as const, label: 'After 12 PM' },
];

export default function GovtBusResultsScreen() {
  const params = useLocalSearchParams<{
    from?: string;
    to?: string;
    date?: string;
    operatorId?: string;
  }>();

  const from = params.from ?? 'Bangalore';
  const to = params.to ?? 'Chennai';
  const dateIso = params.date ?? new Date().toISOString();
  const operatorId = params.operatorId;
  const operator = operatorId ? getGovtBusOperator(operatorId) : undefined;
  const accent = operator?.colors[0] ?? '#166534';
  const gradient = (operator?.colors ?? ['#166534', '#15803D']) as [string, string];
  const travelDate = parseBusTravelDate(dateIso);

  const {
    isLoading,
    fetchedAt,
    buses,
    lowestFare,
    sortBy,
    setSortBy,
    filterBy,
    setFilterBy,
    reload,
  } = useBusSearchResults({ from, to, dateIso, scope: 'govt', operatorId });

  const govtBuses = buses as GovtBusListing[];

  if (isLoading) {
    return (
      <View style={styles.screen}>
        <SafeAreaView style={styles.loading}>
          <ActivityIndicator size="large" color={accent} />
          <Text style={styles.loadingTitle}>Finding state transport buses</Text>
          <Text style={styles.loadingSubtitle}>
            {from} → {to} • {formatBusDate(travelDate, true)}
          </Text>
        </SafeAreaView>
      </View>
    );
  }

  const bannerText = operator
    ? `Only ${operator.name} (${operator.state}) — no private operators`
    : 'Only state RTC buses — no private operators';

  return (
    <View style={styles.screen}>
      <BusResultsHeader
        gradientColors={gradient}
        from={from}
        to={to}
        title={operator ? `${operator.name} — State Govt` : 'State Govt buses'}
        logo={operator?.logo}
        dateLabel={`${formatBusDate(travelDate, true)} • Tap to modify`}
        onBack={() => router.back()}
        onRefresh={() => void reload()}
        stats={[
          { label: 'Govt buses', value: String(govtBuses.length) },
          { label: 'Starts from', value: `₹${lowestFare.toLocaleString('en-IN')}` },
          { label: 'RTC verified', icon: 'shield-check' },
        ]}
      />

      <BusResultsToolbar
        accent={accent}
        filterOptions={GOVT_FILTERS}
        sortBy={sortBy}
        filterBy={filterBy}
        onSortChange={setSortBy}
        onFilterChange={setFilterBy}
      />

      <FlatList
        data={govtBuses}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <BusResultsBanner>
            <MaterialCommunityIcons name="shield-check" size={16} color="#166534" />
            <Text style={styles.bannerText}>{bannerText} • Updated {formatFetchedTime(fetchedAt)}</Text>
          </BusResultsBanner>
        }
        ListEmptyComponent={
          <BusResultsEmpty
            title="No govt buses match your filters"
            actionLabel="Show all govt buses"
            accent={accent}
            onAction={() => setFilterBy('all')}
          />
        }
        renderItem={({ item }) => (
          <GovtBusResultCard bus={item} />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F4F7FB' },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  loadingTitle: { fontSize: typography.section, fontWeight: '800', color: colors.text, textAlign: 'center' },
  loadingSubtitle: { fontSize: typography.caption, color: colors.textMuted, textAlign: 'center' },
  list: { paddingTop: spacing.sm, paddingBottom: spacing.xl },
  bannerText: { flex: 1, fontSize: typography.caption, fontWeight: '700', color: '#166534' },
});
