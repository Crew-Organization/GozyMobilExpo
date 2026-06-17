import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BusResultCard } from '@/src/components/bus-result-card';
import { BusResultsBanner, BusResultsEmpty, BusResultsHeader } from '@/src/components/bus-results-header';
import { BusResultsToolbar } from '@/src/components/bus-results-toolbar';
import { useBusSearchResults } from '@/src/hooks/use-bus-search-results';
import { formatBusDate, formatFetchedTime, parseBusTravelDate } from '@/src/lib/bus-booking-utils';
import { colors, spacing, typography } from '@/src/theme/tokens';

const ACCENT = '#10A8EC';
const GRADIENT = ['#15BDF2', '#006BFF'] as const;

export default function BusResultsScreen() {
  const params = useLocalSearchParams<{ from?: string; to?: string; date?: string }>();
  const from = params.from ?? 'Bangalore';
  const to = params.to ?? 'Ahmedabad';
  const dateIso = params.date ?? new Date().toISOString();
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
  } = useBusSearchResults({ from, to, dateIso, scope: 'all' });

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

  return (
    <View style={styles.screen}>
      <BusResultsHeader
        gradientColors={GRADIENT}
        from={from}
        to={to}
        dateLabel={`${formatBusDate(travelDate, true)} • Tap to modify`}
        onBack={() => router.back()}
        onRefresh={() => void reload()}
        stats={[
          { label: 'Buses found', value: String(buses.length) },
          { label: 'Starts from', value: `₹${lowestFare.toLocaleString('en-IN')}` },
          { label: 'Updated', value: formatFetchedTime(fetchedAt) },
        ]}
      />

      <BusResultsToolbar
        sortBy={sortBy}
        filterBy={filterBy}
        onSortChange={setSortBy}
        onFilterChange={setFilterBy}
      />

      <FlatList
        data={buses}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <BusResultsBanner>
            <MaterialCommunityIcons name="access-point" size={16} color="#16A34A" />
            <Text style={styles.bannerText}>Live inventory from Gozy • Tap ↻ to refresh</Text>
          </BusResultsBanner>
        }
        ListEmptyComponent={
          <BusResultsEmpty
            title="No buses match your filters"
            actionLabel="Show all buses"
            accent={ACCENT}
            onAction={() => setFilterBy('all')}
          />
        }
        renderItem={({ item }) => (
          <BusResultCard bus={item} />
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
  loadingTitle: { fontSize: typography.section, fontWeight: '800', color: colors.text },
  loadingSubtitle: { fontSize: typography.caption, color: colors.textMuted, textAlign: 'center' },
  list: { paddingTop: spacing.sm, paddingBottom: spacing.xl },
  bannerText: { flex: 1, fontSize: typography.caption, fontWeight: '700', color: '#166534' },
});
