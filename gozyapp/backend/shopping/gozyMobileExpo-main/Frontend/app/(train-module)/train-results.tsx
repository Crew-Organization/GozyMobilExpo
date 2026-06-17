import { useCallback, useEffect, useMemo, useState } from 'react';
import { FlashList } from '@shopify/flash-list';
import { router, useLocalSearchParams } from 'expo-router';
import { Alert, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { DateCarousel, type DateChip } from '@/src/components/train/DateCarousel';
import { PromoBanner } from '@/src/components/train/PromoBanner';
import { SearchHeader } from '@/src/components/train/SearchHeader';
import { StickyFilterBar } from '@/src/components/train/StickyFilterBar';
import { TrainCard } from '@/src/components/train/TrainCard';
import { TrainFloatingBot } from '@/src/components/train/train-floating-bot';
import { TransportTabs } from '@/src/components/train/TransportTabs';
import { api } from '@/src/lib/api';
import { trainSearchResults, type TrainAvailability, type TrainSearchResult } from '@/src/lib/train-search-results';
import { useTrainSearchStore } from '@/src/store/train-search-store';
import {
  trainResultsPalette,
  trainResultsRadius,
  trainResultsShadow,
  trainResultsSpacing,
  trainResultsType,
} from '@/src/theme/train-results-ui';

type SortOption = 'availability' | 'shortest' | 'depEarly' | 'depLate' | 'arrEarly' | 'arrLate';
type ModalTab = 'Sort' | 'Filter';
type QuickFilter = 'AC' | 'Available' | 'Departure after 6 PM';
type FilterChip = 'AC' | 'Available' | 'Quota' | 'Departure after 6 PM' | 'Sort & Filter';
type QuotaOption = 'GENERAL' | 'TATKAL' | 'LADIES';
type TicketTypeFilter = 'Trip Guarantee' | 'Free Cancellation';
type AvailabilityFilter = 'TATKAL' | 'AVL' | 'RAC' | 'WL';
type JourneyClassFilter = '1A' | '2A' | '3A' | 'SL' | 'CC' | 'EC';
type TrainTypeFilter = 'Express' | 'Superfast' | 'Weekly' | 'Humsafar' | 'Other';
type TimeBucket = 'Night' | 'Morning' | 'Afternoon' | 'Evening';

const quickFilterOptions: QuickFilter[] = ['AC', 'Available', 'Departure after 6 PM'];
const quotaOptions: QuotaOption[] = ['TATKAL', 'GENERAL', 'LADIES'];
const ticketTypeOptions: TicketTypeFilter[] = ['Trip Guarantee', 'Free Cancellation'];
const availabilityOptions: AvailabilityFilter[] = ['WL', 'TATKAL', 'AVL', 'RAC'];
const journeyClassOptions: JourneyClassFilter[] = ['1A', '2A', '3A', 'SL', 'CC', 'EC'];
const trainTypeOptions: TrainTypeFilter[] = ['Express', 'Superfast', 'Weekly', 'Humsafar', 'Other'];
const timeBuckets: Array<{ key: TimeBucket; icon: keyof typeof MaterialCommunityIcons.glyphMap; range: string }> = [
  { key: 'Night', icon: 'weather-night', range: '12 AM to 6 AM' },
  { key: 'Morning', icon: 'weather-sunset-up', range: '6 AM to 12 PM' },
  { key: 'Afternoon', icon: 'white-balance-sunny', range: '12 PM to 6 PM' },
  { key: 'Evening', icon: 'weather-sunset-down', range: '6 PM to 12 AM' },
];

function formatRouteTitle(fromLabel: string, toLabel: string) {
  return `${fromLabel} To ${toLabel}`;
}

function formatDateLabel(dateString?: string) {
  const parsedDate = dateString ? new Date(dateString) : new Date();
  const safeDate = Number.isNaN(parsedDate.getTime()) ? new Date() : parsedDate;
  const day = safeDate.toLocaleDateString('en-US', { day: 'numeric' });
  const month = safeDate.toLocaleDateString('en-US', { month: 'short' });
  const weekday = safeDate.toLocaleDateString('en-US', { weekday: 'long' });

  return `${day} ${month}, ${weekday}`;
}

function formatDateChipValue(date: Date) {
  return {
    dayLabel: date.toLocaleDateString('en-US', { day: 'numeric' }),
    weekdayLabel: date.toLocaleDateString('en-US', { weekday: 'short' }),
  };
}

function buildDayStrip(dateString?: string): DateChip[] {
  const parsedDate = dateString ? new Date(dateString) : new Date();
  const safeDate = Number.isNaN(parsedDate.getTime()) ? new Date() : parsedDate;
  const baseDate = new Date(safeDate.getFullYear(), safeDate.getMonth(), safeDate.getDate());

  return Array.from({ length: 15 }).map((_, index) => {
    const currentDate = new Date(baseDate);
    currentDate.setDate(baseDate.getDate() + index);

    return {
      key: currentDate.toISOString(),
      monthTag: currentDate.toLocaleDateString('en-US', { month: 'short' }).toUpperCase(),
      ...formatDateChipValue(currentDate),
    };
  });
}

function formatShortDate(date: Date) {
  return date.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
  });
}

function normalizeDate(date: Date) {
  const nextDate = new Date(date);
  nextDate.setHours(12, 0, 0, 0);
  return nextDate;
}

function parseTimeToMinutes(value: string) {
  const [time, period] = value.split(' ');
  const [rawHours, minutes] = time.split(':').map(Number);
  let hours = rawHours;

  if (period === 'PM' && hours !== 12) {
    hours += 12;
  }

  if (period === 'AM' && hours === 12) {
    hours = 0;
  }

  return hours * 60 + minutes;
}

function parseDurationToMinutes(value: string) {
  const hoursMatch = value.match(/(\d+)h/i);
  const minutesMatch = value.match(/(\d+)m/i);

  return (hoursMatch ? Number(hoursMatch[1]) : 0) * 60 + (minutesMatch ? Number(minutesMatch[1]) : 0);
}

function getLowestPrice(item: TrainSearchResult) {
  return item.availability.reduce((lowest, slot) => Math.min(lowest, slot.price), item.availability[0]?.price ?? 0);
}

function getBestAvailability(item: TrainSearchResult) {
  const bestSlot = item.availability.find((slot) => {
    const normalized = slot.quotaLabel.toUpperCase();
    return normalized.includes('AVAILABLE') || normalized.includes('AVL');
  });

  if (!bestSlot) {
    return 0;
  }

  const match = bestSlot.quotaLabel.match(/\d+/);
  return match ? Number(match[0]) : 0;
}

function getAvailabilityKind(slot: TrainAvailability): AvailabilityFilter {
  const normalized = slot.quotaLabel.toUpperCase();
  const badge = slot.badge?.toUpperCase() ?? '';

  if (badge.includes('TATKAL') || normalized.includes('TQ')) {
    return 'TATKAL';
  }

  if (normalized.includes('AVAILABLE') || normalized.includes('AVL')) {
    return 'AVL';
  }

  if (normalized.includes('RAC')) {
    return 'RAC';
  }

  return 'WL';
}

function supportsFreeCancellation(slot: TrainAvailability) {
  const status = slot.status.toUpperCase();
  const badge = slot.badge?.toUpperCase() ?? '';
  return status.includes('FREE CANCELLATION') || badge.includes('FREE CANCELLATION');
}

function getTrainTypeLabel(train: TrainSearchResult): TrainTypeFilter {
  const normalized = train.name.toLowerCase();

  if (normalized.includes('humsafar')) {
    return 'Humsafar';
  }

  if (normalized.includes('weekly')) {
    return 'Weekly';
  }

  if (normalized.includes('superfast')) {
    return 'Superfast';
  }

  if (normalized.includes('exp') || normalized.includes('express')) {
    return 'Express';
  }

  return 'Other';
}

function getTimeBucket(value: string): TimeBucket {
  const minutes = parseTimeToMinutes(value);

  if (minutes < 6 * 60) {
    return 'Night';
  }

  if (minutes < 12 * 60) {
    return 'Morning';
  }

  if (minutes < 18 * 60) {
    return 'Afternoon';
  }

  return 'Evening';
}

function stripStationCode(station: string) {
  return station.replace(/\s*\([^)]+\)\s*$/, '').trim();
}

function extractStationCode(station: string) {
  const match = station.match(/\(([^)]+)\)/);
  return match?.[1] ?? station;
}

function formatRouteStationLabel(city?: string, code?: string) {
  if (!city && !code) {
    return '';
  }

  if (!city) {
    return code ?? '';
  }

  return code ? `${city} (${code})` : city;
}

function formatStationChipLabel(station: string) {
  return `${extractStationCode(station)} - ${stripStationCode(station)}`;
}

function getUniqueItems<T>(values: T[]) {
  return Array.from(new Set(values));
}

function buildTatkalSlot(slot: TrainAvailability, index: number): TrainAvailability {
  const premium = slot.className === 'SL' ? 140 : slot.className === '3A' ? 220 : 320;
  const match = slot.quotaLabel.match(/\d+/);
  const availableCount = match ? Number(match[0]) : Math.max(3, 9 - index * 2);

  if (getAvailabilityKind(slot) === 'AVL') {
    return {
      ...slot,
      badge: 'TATKAL',
      price: slot.price + premium,
      quotaLabel: `AVAILABLE ${availableCount}`,
      status: 'Tatkal booking',
      updatedLabel: 'Updated few mins ago',
    };
  }

  return {
    ...slot,
    badge: 'TATKAL',
    price: slot.price + premium,
    quotaLabel: 'BOOKING NOT ALLOWED',
    status: 'Tatkal not open',
    updatedLabel: 'Updated few mins ago',
  };
}

function getQuotaAvailability(availability: TrainAvailability[], quota: QuotaOption) {
  if (quota === 'GENERAL') {
    return availability;
  }

  if (quota === 'TATKAL') {
    const tatkalSlots = availability
      .filter((slot) => getAvailabilityKind(slot) === 'TATKAL')
      .map((slot) => ({
        ...slot,
        badge: 'TATKAL',
        status: 'Tatkal booking',
      }));

    if (tatkalSlots.length) {
      return tatkalSlots;
    }

    return availability.slice(0, Math.min(2, availability.length)).map(buildTatkalSlot);
  }

  const eligibleLadiesSlots = availability.filter((slot) => ['SL', '3A', '2A'].includes(slot.className));
  const sourceSlots = eligibleLadiesSlots.length ? eligibleLadiesSlots.slice(0, 2) : availability.slice(0, 1);

  return sourceSlots.map((slot, index) => ({
    ...slot,
    badge: 'LADIES',
    quotaLabel: `LQ ${Math.max(1, 6 - index * 2)}`,
    status: 'Ladies quota',
    updatedLabel: 'Updated few mins ago',
  }));
}

function countBy<T extends string>(values: T[]) {
  return values.reduce<Record<string, number>>((acc, value) => {
    acc[value] = (acc[value] ?? 0) + 1;
    return acc;
  }, {});
}

function toggleItem<T extends string>(items: T[], item: T) {
  return items.includes(item) ? items.filter((value) => value !== item) : [...items, item];
}

function capitalizeQuotaLabel(value: QuotaOption) {
  if (value === 'GENERAL') {
    return 'GENERAL QUOTA';
  }

  if (value === 'LADIES') {
    return 'LADIES QUOTA';
  }

  return 'TATKAL';
}

function journeyClassLabel(value: JourneyClassFilter) {
  if (value === '1A') return '1A - 1st AC';
  if (value === '2A') return '2A - 2 Tier AC';
  if (value === '3A') return '3A - 3 Tier AC';
  if (value === 'SL') return 'SL - Sleeper';
  if (value === 'CC') return 'CC - Chair Car';
  return 'EC - Executive';
}

type ChipButtonProps = {
  active: boolean;
  label: string;
  onPress: () => void;
  compact?: boolean;
};

function ChipButton({ active, label, onPress, compact = false }: ChipButtonProps) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.filterChip, compact && styles.filterChipCompact, active && styles.filterChipActive, pressed && styles.filterChipPressed]}>
      <Text style={[styles.filterChipText, active && styles.filterChipTextActive]}>{label}</Text>
    </Pressable>
  );
}

type TimeCardProps = {
  active: boolean;
  count: number;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  label: TimeBucket;
  onPress: () => void;
  range: string;
};

function TimeCard({ active, count, icon, label, onPress, range }: TimeCardProps) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.timeCard, active && styles.timeCardActive, pressed && styles.filterChipPressed]}>
      <MaterialCommunityIcons
        color={active ? trainResultsPalette.primaryBlue : '#B0B7C3'}
        name={icon}
        size={24}
      />
      <Text style={[styles.timeCardLabel, active && styles.timeCardLabelActive]}>
        {label} ({count})
      </Text>
      <Text style={[styles.timeCardRange, active && styles.timeCardRangeActive]}>{range}</Text>
    </Pressable>
  );
}

export default function TrainResultsScreen() {
  const params = useLocalSearchParams<{
    date?: string;
    fromCode?: string;
    fromName?: string;
    toCode?: string;
    toName?: string;
  }>();
  const { from, setBookingSelection, to } = useTrainSearchStore();

  const [activeDayIndex, setActiveDayIndex] = useState(0);
  const [results, setResults] = useState<TrainSearchResult[]>(trainSearchResults);
  const [isSortFilterOpen, setIsSortFilterOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<ModalTab>('Filter');
  const [selectedSort, setSelectedSort] = useState<SortOption>('availability');
  const [selectedQuickFilters, setSelectedQuickFilters] = useState<QuickFilter[]>([]);
  const [selectedQuota, setSelectedQuota] = useState<QuotaOption>('GENERAL');
  const [selectedTicketTypes, setSelectedTicketTypes] = useState<TicketTypeFilter[]>([]);
  const [selectedAvailabilityKinds, setSelectedAvailabilityKinds] = useState<AvailabilityFilter[]>([]);
  const [selectedJourneyClasses, setSelectedJourneyClasses] = useState<JourneyClassFilter[]>([]);
  const [selectedTrainTypes, setSelectedTrainTypes] = useState<TrainTypeFilter[]>([]);
  const [selectedDepartureBuckets, setSelectedDepartureBuckets] = useState<TimeBucket[]>([]);
  const [selectedArrivalBuckets, setSelectedArrivalBuckets] = useState<TimeBucket[]>([]);
  const [selectedFromStations, setSelectedFromStations] = useState<string[]>([]);
  const [selectedToStations, setSelectedToStations] = useState<string[]>([]);

  useEffect(() => {
    let mounted = true;

    api
      .searchTrains({
        fromCode: params.fromCode || 'SBC',
        fromName: params.fromName || 'Bangalore',
        toCode: params.toCode || 'ADI',
        toName: params.toName || 'Ahmedabad',
        date: params.date || new Date().toISOString(),
      })
      .then((response) => {
        if (!mounted) {
          return;
        }

        setResults(response.length ? response : trainSearchResults);
      })
      .catch(() => {
        if (!mounted) {
          return;
        }

        setResults(trainSearchResults);
      });

    return () => {
      mounted = false;
    };
  }, [params.date, params.fromCode, params.fromName, params.toCode, params.toName]);

  const fromLabel = from?.city ?? params.fromName ?? params.fromCode ?? 'Bangalore';
  const toLabel = to?.city ?? params.toName ?? params.toCode ?? 'Ahmedabad';
  const routeFromStationLabel = formatRouteStationLabel(params.fromName ?? from?.city ?? undefined, params.fromCode ?? from?.code ?? undefined);
  const routeToStationLabel = formatRouteStationLabel(params.toName ?? to?.city ?? undefined, params.toCode ?? to?.code ?? undefined);
  const dayStrip = useMemo(() => buildDayStrip(params.date), [params.date]);
  const baseJourneyDate = useMemo(() => normalizeDate(params.date ? new Date(params.date) : new Date()), [params.date]);
  const selectedJourneyDate = useMemo(() => {
    const nextDate = new Date(baseJourneyDate);
    nextDate.setDate(baseJourneyDate.getDate() + activeDayIndex);
    return normalizeDate(nextDate);
  }, [activeDayIndex, baseJourneyDate]);
  const routeTitle = formatRouteTitle(fromLabel, toLabel);
  const dateLabel = useMemo(() => formatDateLabel(selectedJourneyDate.toISOString()), [selectedJourneyDate]);

  const availabilityCounts = useMemo(
    () => countBy(results.flatMap((train) => train.availability.map(getAvailabilityKind))),
    [results],
  );

  const journeyClassCounts = useMemo(
    () => countBy(results.flatMap((train) => train.availability.map((slot) => slot.className as JourneyClassFilter))),
    [results],
  );

  const departureBucketCounts = useMemo(
    () => countBy(results.map((train) => getTimeBucket(train.departureTime))),
    [results],
  );

  const arrivalBucketCounts = useMemo(
    () => countBy(results.map((train) => getTimeBucket(train.arrivalTime))),
    [results],
  );

  const trainTypeCounts = useMemo(
    () => countBy(results.map(getTrainTypeLabel)),
    [results],
  );

  const fromStations = useMemo(
    () => getUniqueItems(results.map((train) => train.departureStation)),
    [results],
  );

  const toStations = useMemo(
    () => getUniqueItems(results.map((train) => train.arrivalStation)),
    [results],
  );

  const fromStationCounts = useMemo(
    () => countBy(results.map((train) => train.departureStation)),
    [results],
  );

  const toStationCounts = useMemo(
    () => countBy(results.map((train) => train.arrivalStation)),
    [results],
  );

  const quotaCounts = useMemo(
    () =>
      quotaOptions.reduce<Record<QuotaOption, number>>((acc, quota) => {
        acc[quota] = results.filter((train) => getQuotaAvailability(train.availability, quota).length > 0).length;
        return acc;
      }, { GENERAL: 0, TATKAL: 0, LADIES: 0 }),
    [results],
  );

  const ticketTypeCounts = useMemo(
    () => ({
      'Trip Guarantee': results.filter((train) => Boolean(train.note)).length,
      'Free Cancellation': results.filter((train) => train.availability.some(supportsFreeCancellation)).length,
    }),
    [results],
  );

  const displayedResults = useMemo(() => {
    let list = results.map((train) => ({
      ...train,
      availability: getQuotaAvailability(train.availability, selectedQuota),
    }));

    if (selectedQuickFilters.includes('AC')) {
      list = list
        .map((train) => ({
          ...train,
          availability: train.availability.filter((slot) => ['3A', '2A', '1A', 'CC', 'EC'].includes(slot.className)),
        }))
        .filter((train) => train.availability.length > 0);
    }

    if (selectedQuickFilters.includes('Available')) {
      list = list
        .map((train) => ({
          ...train,
          availability: train.availability.filter((slot) => getAvailabilityKind(slot) === 'AVL'),
        }))
        .filter((train) => train.availability.length > 0);
    }

    if (selectedQuickFilters.includes('Departure after 6 PM')) {
      list = list.filter((train) => parseTimeToMinutes(train.departureTime) >= 18 * 60);
    }

    if (selectedTicketTypes.includes('Trip Guarantee')) {
      list = list.filter((train) => Boolean(train.note));
    }

    if (selectedTicketTypes.includes('Free Cancellation')) {
      list = list
        .map((train) => ({
          ...train,
          availability: train.availability.filter(supportsFreeCancellation),
        }))
        .filter((train) => train.availability.length > 0);
    }

    if (selectedAvailabilityKinds.length) {
      list = list
        .map((train) => ({
          ...train,
          availability: train.availability.filter((slot) => selectedAvailabilityKinds.includes(getAvailabilityKind(slot))),
        }))
        .filter((train) => train.availability.length > 0);
    }

    if (selectedJourneyClasses.length) {
      list = list
        .map((train) => ({
          ...train,
          availability: train.availability.filter((slot) => selectedJourneyClasses.includes(slot.className as JourneyClassFilter)),
        }))
        .filter((train) => train.availability.length > 0);
    }

    if (selectedTrainTypes.length) {
      list = list.filter((train) => selectedTrainTypes.includes(getTrainTypeLabel(train)));
    }

    if (selectedDepartureBuckets.length) {
      list = list.filter((train) => selectedDepartureBuckets.includes(getTimeBucket(train.departureTime)));
    }

    if (selectedArrivalBuckets.length) {
      list = list.filter((train) => selectedArrivalBuckets.includes(getTimeBucket(train.arrivalTime)));
    }

    if (selectedFromStations.length) {
      list = list.filter((train) => selectedFromStations.includes(train.departureStation));
    }

    if (selectedToStations.length) {
      list = list.filter((train) => selectedToStations.includes(train.arrivalStation));
    }

    if (selectedSort === 'availability') {
      list.sort((left, right) => getBestAvailability(right) - getBestAvailability(left));
    }

    if (selectedSort === 'shortest') {
      list.sort((left, right) => parseDurationToMinutes(left.duration) - parseDurationToMinutes(right.duration));
    }

    if (selectedSort === 'depEarly') {
      list.sort((left, right) => parseTimeToMinutes(left.departureTime) - parseTimeToMinutes(right.departureTime));
    }

    if (selectedSort === 'depLate') {
      list.sort((left, right) => parseTimeToMinutes(right.departureTime) - parseTimeToMinutes(left.departureTime));
    }

    if (selectedSort === 'arrEarly') {
      list.sort((left, right) => parseTimeToMinutes(left.arrivalTime) - parseTimeToMinutes(right.arrivalTime));
    }

    if (selectedSort === 'arrLate') {
      list.sort((left, right) => parseTimeToMinutes(right.arrivalTime) - parseTimeToMinutes(left.arrivalTime));
    }

    return list.map((train) => {
      const departureDate = normalizeDate(selectedJourneyDate);
      const departureMinutes = parseTimeToMinutes(train.departureTime);
      const durationMinutes = parseDurationToMinutes(train.duration);
      const arrivalOffsetDays = Math.floor((departureMinutes + durationMinutes) / (24 * 60));
      const arrivalDate = new Date(departureDate);
      arrivalDate.setDate(departureDate.getDate() + arrivalOffsetDays);

      return {
        ...train,
        departureDateLabel: formatShortDate(departureDate),
        arrivalDateLabel: formatShortDate(arrivalDate),
        departureStation: routeFromStationLabel || train.departureStation,
        arrivalStation: routeToStationLabel || train.arrivalStation,
        nextRunLabel: train.nextRunLabel ? `Next runs on ${arrivalDate.toLocaleDateString('en-US', { weekday: 'short' })}, ${formatShortDate(departureDate)}` : undefined,
      };
    });
  }, [
    results,
    selectedQuota,
    selectedQuickFilters,
    selectedTicketTypes,
    selectedAvailabilityKinds,
    selectedJourneyClasses,
    selectedTrainTypes,
    selectedDepartureBuckets,
    selectedArrivalBuckets,
    selectedFromStations,
    selectedToStations,
    selectedJourneyDate,
    selectedSort,
    routeFromStationLabel,
    routeToStationLabel,
  ]);

  const lowestFareLabel = useMemo(() => {
    const lowest = displayedResults.length ? Math.min(...displayedResults.map(getLowestPrice)) : 300;
    return `Rs ${lowest}`;
  }, [displayedResults]);

  const shortestDuration = useMemo(() => {
    if (!displayedResults.length) {
      return '7h 40m';
    }

    return [...displayedResults].sort(
      (left, right) => parseDurationToMinutes(left.duration) - parseDurationToMinutes(right.duration),
    )[0].duration;
  }, [displayedResults]);

  const activeFilterCount =
    selectedQuickFilters.length +
    selectedTicketTypes.length +
    selectedAvailabilityKinds.length +
    selectedJourneyClasses.length +
    selectedTrainTypes.length +
    selectedDepartureBuckets.length +
    selectedArrivalBuckets.length +
    selectedFromStations.length +
    selectedToStations.length +
    (selectedQuota !== 'GENERAL' ? 1 : 0);

  const toggleQuickFilter = useCallback((filter: QuickFilter) => {
    setSelectedQuickFilters((current) => toggleItem(current, filter));
  }, []);

  const clearFilters = useCallback(() => {
    setSelectedQuickFilters([]);
    setSelectedQuota('GENERAL');
    setSelectedSort('availability');
    setSelectedTicketTypes([]);
    setSelectedAvailabilityKinds([]);
    setSelectedJourneyClasses([]);
    setSelectedTrainTypes([]);
    setSelectedDepartureBuckets([]);
    setSelectedArrivalBuckets([]);
    setSelectedFromStations([]);
    setSelectedToStations([]);
  }, []);

  const handleChipPress = useCallback(
    (chip: FilterChip) => {
      if (chip === 'AC' || chip === 'Available' || chip === 'Departure after 6 PM') {
        toggleQuickFilter(chip);
        return;
      }

      setActiveTab('Filter');
      setIsSortFilterOpen(true);
    },
    [toggleQuickFilter],
  );

  const renderTrainItem = useCallback(
    ({ item, index }: { item: TrainSearchResult; index: number }) => (
      <TrainCard
        index={index}
        item={item}
        onSeatPress={(train, slot) => {
          setBookingSelection({
            journeyDate: selectedJourneyDate.toISOString(),
            routeTitle,
            slot,
            train,
          });
          router.push('/train-booking');
        }}
      />
    ),
    [routeTitle, selectedJourneyDate, setBookingSelection],
  );

  const headerComponent = useMemo(
    () => (
      <>
        <SearchHeader dateLabel={dateLabel} routeTitle={routeTitle} onBack={() => router.back()} onEdit={() => router.back()} />

        <TransportTabs
          activeFareLabel={lowestFareLabel}
          activeMetaLabel={shortestDuration}
          onBusPress={() => Alert.alert('Buses Available', 'Buses are not available for this route right now.')}
        />

        <DateCarousel activeIndex={activeDayIndex} days={dayStrip} onSelect={setActiveDayIndex} />

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.bannerRow}
          style={styles.bannerStrip}
        >
          <PromoBanner variant="refund" />
        </ScrollView>

        <PromoBanner variant="aadhaar" />
      </>
    ),
    [activeDayIndex, dateLabel, dayStrip, lowestFareLabel, routeTitle, shortestDuration],
  );

  const footerComponent = useMemo(
    () => (
      <View style={styles.footerPromo}>
        <View style={styles.footerPromoIcon}>
          <MaterialCommunityIcons color={trainResultsPalette.purple} name="ticket-confirmation" size={24} />
        </View>
        <View style={styles.footerPromoContent}>
          <Text style={styles.footerPromoTitle}>Confirmed Ticket or 3x Refund</Text>
          <Text style={styles.footerPromoBody}>Trip Guarantee keeps alternate confirmed options ready when seats are tight.</Text>
        </View>
      </View>
    ),
    [],
  );

  return (
    <View style={styles.safeArea}>
      <View style={styles.screen}>
        <FlashList
          data={displayedResults}
          keyExtractor={(item) => item.id}
          renderItem={renderTrainItem}
          ListHeaderComponent={headerComponent}
          ListFooterComponent={footerComponent}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>No trains match the selected filters.</Text>
              <Text style={styles.emptyBody}>Try adjusting quota, timing, class, or availability filters to see more train options.</Text>
            </View>
          }
        />

        <TrainFloatingBot bottom={96} />

        <StickyFilterBar
          activeFilterCount={activeFilterCount}
          activeQuota={selectedQuota !== 'GENERAL'}
          activeQuickFilters={selectedQuickFilters}
          onChipPress={handleChipPress}
        />

        <Modal animationType="slide" onRequestClose={() => setIsSortFilterOpen(false)} visible={isSortFilterOpen}>
          <View style={styles.modalSafe}>
            <View style={styles.modalHeader}>
              <View style={styles.modalHeaderLeft}>
                <Pressable hitSlop={12} onPress={() => setIsSortFilterOpen(false)} style={styles.modalBackButton}>
                  <MaterialCommunityIcons color={trainResultsPalette.textPrimary} name="close" size={26} />
                </Pressable>
                <View>
                  <Text style={styles.modalTitle}>Sort & Filter</Text>
                  <Text style={styles.modalSubtitle}>{displayedResults.length} trains found</Text>
                </View>
              </View>
              <Pressable onPress={clearFilters}>
                <Text style={styles.clearText}>Clear All</Text>
              </Pressable>
            </View>

            <View style={styles.modalTabs}>
              <Pressable
                onPress={() => setActiveTab('Sort')}
                style={[styles.modalTab, activeTab === 'Sort' && styles.modalTabActive]}
              >
                <Text style={[styles.modalTabText, activeTab === 'Sort' && styles.modalTabTextActive]}>Sort</Text>
              </Pressable>
              <Pressable
                onPress={() => setActiveTab('Filter')}
                style={[styles.modalTab, activeTab === 'Filter' && styles.modalTabActive]}
              >
                <Text style={[styles.modalTabText, activeTab === 'Filter' && styles.modalTabTextActive]}>Filter</Text>
              </Pressable>
            </View>

            <ScrollView contentContainerStyle={styles.modalBody} showsVerticalScrollIndicator={false}>
              {activeTab === 'Sort' ? (
                <View style={styles.modalSection}>
                  {[
                    ['Available Tickets First', 'availability'],
                    ['Shortest Duration', 'shortest'],
                    ['Early Departure', 'depEarly'],
                    ['Late Departure', 'depLate'],
                    ['Early Arrival', 'arrEarly'],
                    ['Late Arrival', 'arrLate'],
                  ].map(([label, value]) => {
                    const active = selectedSort === value;
                    return (
                      <Pressable
                        key={value}
                        onPress={() => setSelectedSort(value as SortOption)}
                        style={({ pressed }) => [styles.modalRow, active && styles.modalRowActive, pressed && styles.modalRowPressed]}
                      >
                        <Text style={[styles.modalRowText, active && styles.modalRowTextActive]}>{label}</Text>
                        {active ? (
                          <MaterialCommunityIcons color={trainResultsPalette.primaryBlue} name="check-circle" size={18} />
                        ) : (
                          <View style={styles.modalRadio} />
                        )}
                      </Pressable>
                    );
                  })}
                </View>
              ) : (
                <View style={styles.modalSection}>
                  <View style={styles.filterBlock}>
                    <Text style={styles.modalSectionTitle}>Quick Filters</Text>
                    <View style={styles.compactPillWrap}>
                      {quickFilterOptions.map((filter) => (
                        <ChipButton
                          key={filter}
                          active={selectedQuickFilters.includes(filter)}
                          label={filter}
                          onPress={() => toggleQuickFilter(filter)}
                          compact
                        />
                      ))}
                    </View>
                  </View>

                  <View style={styles.filterBlock}>
                    <Text style={styles.modalSectionTitle}>Quota</Text>
                    <View style={styles.compactPillWrap}>
                      {quotaOptions.map((quota) => (
                        <ChipButton
                          key={quota}
                          active={selectedQuota === quota}
                          label={`${capitalizeQuotaLabel(quota)} (${quotaCounts[quota] ?? 0})`}
                          onPress={() => setSelectedQuota(quota)}
                        />
                      ))}
                    </View>
                  </View>

                  <View style={styles.filterBlock}>
                    <Text style={styles.modalSectionTitle}>Ticket Type Filter</Text>
                    <View style={styles.compactPillWrap}>
                      {ticketTypeOptions.map((type) => (
                        <ChipButton
                          key={type}
                          active={selectedTicketTypes.includes(type)}
                          label={`${type} (${ticketTypeCounts[type] ?? 0})`}
                          onPress={() => setSelectedTicketTypes((current) => toggleItem(current, type))}
                        />
                      ))}
                    </View>
                  </View>

                  <View style={styles.filterBlock}>
                    <Text style={styles.modalSectionTitle}>Availability</Text>
                    <View style={styles.compactPillWrap}>
                      {availabilityOptions.map((type) => (
                        <ChipButton
                          key={type}
                          active={selectedAvailabilityKinds.includes(type)}
                          label={`${type} (${availabilityCounts[type] ?? 0})`}
                          onPress={() => setSelectedAvailabilityKinds((current) => toggleItem(current, type))}
                        />
                      ))}
                    </View>
                  </View>

                  <View style={styles.filterBlock}>
                    <Text style={styles.modalSectionTitle}>Journey Class Filters</Text>
                    <View style={styles.compactPillWrap}>
                      {journeyClassOptions.map((travelClass) => (
                        <ChipButton
                          key={travelClass}
                          active={selectedJourneyClasses.includes(travelClass)}
                          label={`${journeyClassLabel(travelClass)} (${journeyClassCounts[travelClass] ?? 0})`}
                          onPress={() => setSelectedJourneyClasses((current) => toggleItem(current, travelClass))}
                        />
                      ))}
                    </View>
                  </View>

                  <View style={styles.filterBlock}>
                    <Text style={styles.modalSectionTitle}>Train Types</Text>
                    <View style={styles.compactPillWrap}>
                      {trainTypeOptions.map((type) => (
                        <ChipButton
                          key={type}
                          active={selectedTrainTypes.includes(type)}
                          label={`${type} (${trainTypeCounts[type] ?? 0})`}
                          onPress={() => setSelectedTrainTypes((current) => toggleItem(current, type))}
                        />
                      ))}
                    </View>
                  </View>

                  <View style={styles.filterBlock}>
                    <Text style={styles.modalSectionTitle}>Departure from {fromLabel}</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.timeCardRow}>
                      {timeBuckets.map((bucket) => (
                        <TimeCard
                          key={bucket.key}
                          active={selectedDepartureBuckets.includes(bucket.key)}
                          count={departureBucketCounts[bucket.key] ?? 0}
                          icon={bucket.icon}
                          label={bucket.key}
                          onPress={() => setSelectedDepartureBuckets((current) => toggleItem(current, bucket.key))}
                          range={bucket.range}
                        />
                      ))}
                    </ScrollView>
                  </View>

                  <View style={styles.filterBlock}>
                    <Text style={styles.modalSectionTitle}>Arrival in {toLabel}</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.timeCardRow}>
                      {timeBuckets.map((bucket) => (
                        <TimeCard
                          key={bucket.key}
                          active={selectedArrivalBuckets.includes(bucket.key)}
                          count={arrivalBucketCounts[bucket.key] ?? 0}
                          icon={bucket.icon}
                          label={bucket.key}
                          onPress={() => setSelectedArrivalBuckets((current) => toggleItem(current, bucket.key))}
                          range={bucket.range}
                        />
                      ))}
                    </ScrollView>
                  </View>

                  <View style={styles.filterBlock}>
                    <Text style={styles.modalSectionTitle}>Stations in {fromLabel}</Text>
                    <View style={styles.compactPillWrap}>
                      {fromStations.map((station) => (
                        <ChipButton
                          key={station}
                          active={selectedFromStations.includes(station)}
                          label={`${formatStationChipLabel(station)} (${fromStationCounts[station] ?? 0})`}
                          onPress={() => setSelectedFromStations((current) => toggleItem(current, station))}
                        />
                      ))}
                    </View>
                  </View>

                  <View style={styles.filterBlock}>
                    <Text style={styles.modalSectionTitle}>Stations in {toLabel}</Text>
                    <View style={styles.compactPillWrap}>
                      {toStations.map((station) => (
                        <ChipButton
                          key={station}
                          active={selectedToStations.includes(station)}
                          label={`${formatStationChipLabel(station)} (${toStationCounts[station] ?? 0})`}
                          onPress={() => setSelectedToStations((current) => toggleItem(current, station))}
                        />
                      ))}
                    </View>
                  </View>
                </View>
              )}
            </ScrollView>

            <View style={styles.modalFooter}>
              <Pressable onPress={() => setIsSortFilterOpen(false)} style={styles.applyButton}>
                <Text style={styles.applyButtonText}>Apply</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    width: '100%',
    alignSelf: 'stretch',
    backgroundColor: trainResultsPalette.mutedBackground,
    paddingTop: Platform.OS === 'ios' ? 44 : 36,
  },
  screen: {
    flex: 1,
    width: '100%',
    alignSelf: 'stretch',
    backgroundColor: trainResultsPalette.mutedBackground,
  },
  listContent: {
    paddingBottom: 150,
  },
  bannerStrip: {
    marginTop: trainResultsSpacing.sm,
  },
  bannerRow: {
    paddingHorizontal: trainResultsSpacing.xs,
    gap: trainResultsSpacing.xs,
  },
  separator: {
    height: trainResultsSpacing.xs,
  },
  emptyState: {
    marginHorizontal: trainResultsSpacing.sm,
    marginTop: trainResultsSpacing.xl,
    padding: trainResultsSpacing.lg,
    borderRadius: trainResultsRadius.md,
    backgroundColor: trainResultsPalette.surface,
    alignItems: 'center',
    ...trainResultsShadow,
  },
  emptyTitle: {
    ...trainResultsType.trainTitle,
    color: trainResultsPalette.textPrimary,
    textAlign: 'center',
  },
  emptyBody: {
    ...trainResultsType.body,
    color: trainResultsPalette.textSecondary,
    textAlign: 'center',
    marginTop: trainResultsSpacing.xs,
  },
  footerPromo: {
    marginHorizontal: trainResultsSpacing.sm,
    marginTop: trainResultsSpacing.sm,
    paddingHorizontal: trainResultsSpacing.lg,
    paddingVertical: trainResultsSpacing.lg,
    borderRadius: trainResultsRadius.md,
    backgroundColor: '#EEDFFF',
    flexDirection: 'row',
    alignItems: 'center',
    ...trainResultsShadow,
  },
  footerPromoIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: trainResultsPalette.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: trainResultsSpacing.sm,
  },
  footerPromoContent: {
    flex: 1,
  },
  footerPromoTitle: {
    ...trainResultsType.trainTitle,
    color: trainResultsPalette.darkNavy,
  },
  footerPromoBody: {
    ...trainResultsType.body,
    color: '#5B6474',
    marginTop: 6,
  },
  modalSafe: {
    flex: 1,
    width: '100%',
    alignSelf: 'stretch',
    backgroundColor: trainResultsPalette.surface,
    paddingTop: Platform.OS === 'ios' ? 44 : 36,
  },
  modalHeader: {
    minHeight: 64,
    paddingHorizontal: trainResultsSpacing.md,
    paddingVertical: trainResultsSpacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: trainResultsPalette.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  modalBackButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  modalTitle: {
    ...trainResultsType.routeTitle,
    color: trainResultsPalette.textPrimary,
  },
  modalSubtitle: {
    ...trainResultsType.caption,
    color: trainResultsPalette.textSecondary,
    marginTop: 2,
  },
  clearText: {
    ...trainResultsType.body,
    color: trainResultsPalette.primaryBlue,
    fontWeight: '700',
  },
  modalTabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: trainResultsPalette.border,
  },
  modalTab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  modalTabActive: {
    borderBottomColor: trainResultsPalette.primaryBlue,
  },
  modalTabText: {
    ...trainResultsType.body,
    color: '#8B95A3',
    fontSize: 13,
    lineHeight: 16,
    fontWeight: '600',
  },
  modalTabTextActive: {
    color: trainResultsPalette.textPrimary,
    fontWeight: '700',
  },
  modalBody: {
    paddingBottom: 24,
  },
  modalSection: {
    gap: 2,
  },
  modalRow: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: trainResultsSpacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#EFF3F8',
  },
  modalRowActive: {
    backgroundColor: '#F8FBFF',
  },
  modalRowPressed: {
    opacity: 0.8,
  },
  modalRowText: {
    ...trainResultsType.body,
    color: trainResultsPalette.textPrimary,
    fontSize: 12,
    lineHeight: 16,
  },
  modalRowTextActive: {
    fontWeight: '700',
  },
  modalRadio: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D7E2EE',
  },
  filterBlock: {
    paddingHorizontal: trainResultsSpacing.md,
    paddingVertical: trainResultsSpacing.lg,
    borderBottomWidth: 8,
    borderBottomColor: '#F7F9FC',
  },
  modalSectionTitle: {
    ...trainResultsType.routeTitle,
    fontSize: 15,
    lineHeight: 19,
    color: trainResultsPalette.textPrimary,
    marginBottom: trainResultsSpacing.sm,
  },
  compactPillWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: trainResultsSpacing.xs,
  },
  filterChip: {
    minHeight: 38,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#DEE6F0',
    backgroundColor: trainResultsPalette.surface,
    justifyContent: 'center',
    ...trainResultsShadow,
  },
  filterChipCompact: {
    minHeight: 34,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  filterChipActive: {
    backgroundColor: trainResultsPalette.primaryBlue,
    borderColor: trainResultsPalette.primaryBlue,
  },
  filterChipPressed: {
    transform: [{ scale: 0.98 }],
  },
  filterChipText: {
    ...trainResultsType.body,
    color: '#4B5563',
    fontSize: 11,
    lineHeight: 14,
  },
  filterChipTextActive: {
    color: trainResultsPalette.surface,
    fontWeight: '700',
  },
  timeCardRow: {
    paddingRight: trainResultsSpacing.md,
    gap: trainResultsSpacing.xs,
  },
  timeCard: {
    width: 110,
    minHeight: 108,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#DEE6F0',
    backgroundColor: trainResultsPalette.surface,
    paddingHorizontal: 10,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    ...trainResultsShadow,
  },
  timeCardActive: {
    borderColor: '#B7DAF8',
    backgroundColor: '#F3FAFF',
  },
  timeCardLabel: {
    ...trainResultsType.body,
    color: trainResultsPalette.textPrimary,
    textAlign: 'center',
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '700',
    marginTop: 10,
  },
  timeCardLabelActive: {
    color: trainResultsPalette.primaryBlue,
  },
  timeCardRange: {
    ...trainResultsType.caption,
    color: '#7B8798',
    textAlign: 'center',
    marginTop: 4,
  },
  timeCardRangeActive: {
    color: trainResultsPalette.textPrimary,
  },
  modalFooter: {
    paddingHorizontal: trainResultsSpacing.md,
    paddingTop: trainResultsSpacing.sm,
    paddingBottom: trainResultsSpacing.md,
    borderTopWidth: 1,
    borderTopColor: trainResultsPalette.border,
    backgroundColor: trainResultsPalette.surface,
  },
  applyButton: {
    height: 48,
    borderRadius: trainResultsRadius.sm,
    backgroundColor: trainResultsPalette.primaryBlue,
    alignItems: 'center',
    justifyContent: 'center',
    ...trainResultsShadow,
  },
  applyButtonText: {
    ...trainResultsType.body,
    color: trainResultsPalette.surface,
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '700',
  },
});
