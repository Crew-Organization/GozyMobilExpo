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
  stationTitleLine,
  popularTrainStations,
  type TrainStation,
} from '@/src/lib/train-stations';
import { useTrainSearchStore } from '@/src/store/train-search-store';
import { trainText } from '@/src/theme/train-ui';

type StationField = 'from' | 'to';

function StationConnector() {
  return (
    <View style={styles.connector}>
      <View style={styles.dotFilled} />
      <View style={styles.connectorLine} />
      <View style={styles.dotOpen} />
    </View>
  );
}

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

  const renderRouteRow = (label: StationField) => {
    const active = activeField === label;
    const station = label === 'from' ? from : to;
    const displayTitle = station ? stationTitleLine(station) : '';
    const displaySub = station ? station.name : '';

    return (
      <Pressable
        key={label}
        onPress={() => switchField(label)}
        style={[styles.routeField, active ? styles.routeFieldActive : null]}
      >
        <StationConnector />
        <View style={styles.routeFieldBody}>
          <Text style={active ? trainText.fieldLabelActive : trainText.fieldLabel}>{label === 'from' ? 'From' : 'To'}</Text>
          {active ? (
            <TextInput
              autoFocus
              onChangeText={setQuery}
              placeholder="Enter City, Station name or ..."
              placeholderTextColor="#9E9E9E"
              style={styles.routeInput}
              value={query}
            />
          ) : (
            <>
              <Text style={trainText.fieldPlaceholder} numberOfLines={1}>
                {displayTitle || 'Enter City, Station name or ...'}
              </Text>
              {displaySub ? <Text style={trainText.fieldSubvalue}>{displaySub}</Text> : null}
            </>
          )}
        </View>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.screen}>
        <View style={styles.topBar}>
          <Pressable hitSlop={12} onPress={() => router.back()} style={styles.backBtn}>
            <MaterialCommunityIcons color="#151515" name="arrow-left" size={22} />
          </Pressable>
        </View>

        <View style={styles.searchCard}>
          {renderRouteRow('from')}
          {renderRouteRow('to')}
        </View>

        <View style={styles.listHeader}>
          <MaterialCommunityIcons color="#B0B0B0" name="star-circle-outline" size={16} />
          <Text style={trainText.popularLabel}>
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
                <Text style={trainText.stationCityLine}>{stationCityLine(item)}</Text>
                <Text style={trainText.stationNameLine}>{item.name}</Text>
              </View>
              <Text style={trainText.stationCode}>{item.code}</Text>
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
    backgroundColor: '#F5F5F5',
  },
  screen: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  topBar: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
  },
  backBtn: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchCard: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EBEBEB',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  routeField: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  routeFieldActive: {
    backgroundColor: '#EEF7FF',
  },
  routeFieldBody: {
    flex: 1,
    marginLeft: 10,
    gap: 2,
  },
  routeInput: {
    fontSize: 13.5,
    lineHeight: 17,
    fontWeight: '700',
    color: '#111111',
    padding: 0,
    margin: 0,
  },
  connector: {
    width: 22,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotFilled: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#A0A0A0',
  },
  connectorLine: {
    width: 8,
    height: 2,
    backgroundColor: '#CFCFCF',
  },
  dotOpen: {
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#BEBEBE',
    backgroundColor: '#FFFFFF',
  },
  listHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 8,
  },
  stationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F3F3',
  },
  stationLeft: {
    flex: 1,
    paddingRight: 12,
    gap: 4,
  },
});
