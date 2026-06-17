import { useEffect, useMemo, useState } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  loadTrainStations,
  filterStations,
  stationCityLine,
  popularTrainStations,
  type TrainStation,
} from '@/src/lib/train-stations';
import { useTrainSearchStore } from '@/src/store/train-search-store';

type StationField = 'from' | 'to';

export default function TrainStationScreen() {
  const { field } = useLocalSearchParams<{ field?: string }>();
  const activeField: StationField = field === 'to' ? 'to' : 'from';

  const { from, to, setFrom, setTo } = useTrainSearchStore();
  const [query, setQuery] = useState('');
  const [stations, setStations] = useState(popularTrainStations);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    loadTrainStations()
      .then((loadedStations) => {
        if (mounted) {
          setStations(loadedStations);
        }
      })
      .finally(() => {
        if (mounted) {
          setIsLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  const listData = useMemo(() => filterStations(query, stations), [query, stations]);

  const selectStation = (station: TrainStation) => {
    if (activeField === 'from') {
      setFrom(station);
    } else {
      setTo(station);
    }
    router.back();
  };

  const switchField = (next: StationField) => {
    router.setParams({ field: next });
    setQuery('');
  };

  const renderField = (label: StationField) => {
    const active = activeField === label;
    const station = label === 'from' ? from : to;
    const displayValue = station ? `${station.city}, ${station.name}` : '';

    return (
      <Pressable onPress={() => switchField(label)} style={[styles.inputBox, active && styles.inputBoxActive]}>
        <Text style={[styles.inputLabel, active && styles.inputLabelActive]}>{label === 'from' ? 'From' : 'To'}</Text>
        {active ? (
          <TextInput
            autoFocus
            onChangeText={setQuery}
            placeholder="Enter City, Station name or ..."
            placeholderTextColor="#94A3B8"
            style={styles.textInput}
            value={query}
          />
        ) : (
          <Text numberOfLines={1} style={[styles.inputValue, !displayValue && styles.inputPlaceholder]}>
            {displayValue || 'Enter City, Station name or ...'}
          </Text>
        )}
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.screen}>
        <View style={styles.header}>
          <Pressable hitSlop={12} onPress={() => router.back()} style={styles.backBtn}>
            <MaterialCommunityIcons color="#0F172A" name="arrow-left" size={24} />
          </Pressable>
          <View style={styles.headerFields}>
            {renderField('from')}
            <View style={styles.divider} />
            {renderField('to')}
            
            <View style={styles.swapIconContainer}>
              <MaterialCommunityIcons name="swap-vertical" size={16} color="#94A3B8" />
            </View>
          </View>
        </View>

        <View style={styles.listHeader}>
          <MaterialCommunityIcons color="#94A3B8" name="close-circle-outline" size={16} />
          <Text style={styles.popularLabel}>
            {isLoading ? 'Loading stations...' : query.trim() ? 'Matching Stations' : 'Popular Searches'}
          </Text>
        </View>

        <FlatList
          data={listData}
          keyExtractor={(item) => item.code}
          keyboardShouldPersistTaps="handled"
          renderItem={({ item }) => (
            <Pressable onPress={() => selectStation(item)} style={styles.stationRow}>
              <View style={styles.stationLeft}>
                <Text style={styles.stationCity}>{stationCityLine(item)}</Text>
                <Text style={styles.stationName}>{item.name}</Text>
              </View>
              <Text style={styles.stationCode}>{item.code}</Text>
            </Pressable>
          )}
          showsVerticalScrollIndicator={false}
        />
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
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  backBtn: {
    padding: 4,
    marginRight: 16,
    marginTop: 12,
  },
  headerFields: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
    position: 'relative',
    overflow: 'hidden',
  },
  inputBox: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  inputBoxActive: {
    backgroundColor: '#EFF6FF',
  },
  inputLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 4,
  },
  inputLabelActive: {
    color: '#0084FF',
  },
  textInput: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0F172A',
    padding: 0,
    margin: 0,
  },
  inputValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0F172A',
  },
  inputPlaceholder: {
    color: '#94A3B8',
    fontWeight: '400',
  },
  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginHorizontal: 16,
  },
  swapIconContainer: {
    position: 'absolute',
    left: 16,
    top: '50%',
    marginTop: -12,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  listHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 12,
  },
  popularLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  stationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  stationLeft: {
    flex: 1,
    paddingRight: 16,
  },
  stationCity: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 4,
  },
  stationName: {
    fontSize: 12,
    color: '#64748B',
  },
  stationCode: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
});
