import React from 'react';
import { ScrollView, StyleSheet, Text, Pressable, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, radius, spacing, typography, shadow } from '@/src/theme/tokens';
import { BusSortOption } from '@/src/lib/bus-search-data';

export type BusFilters = {
  ac: boolean | null;
  sleeper: boolean | null;
  pickupTime: string[];
  dropoffTime: string[];
  operators: string[];
  minPrice: number | null;
  maxPrice: number | null;
};

type Props = {
  sortBy: BusSortOption;
  onSortChange: (sort: BusSortOption) => void;
  filters?: BusFilters;
  onFiltersChange?: (filters: BusFilters) => void;
  uniqueOperators?: string[];
  fromCity: string;
  toCity: string;
  accentColor: string;
};

export function BusFilterToolbar({ sortBy, onSortChange, accentColor }: Props) {
  // In a real app we'd trigger bottom sheets for these, but we'll mock the UI structure here
  return (
    <View style={styles.container}>
      <View style={styles.busBottomFilterBar}>
        <Pressable onPress={() => {}} style={styles.busFilterTab}>
          <MaterialCommunityIcons name="seat-passenger" size={24} color="#64748B" />
          <Text style={styles.busFilterTabText}>Seat</Text>
        </Pressable>
        <Pressable onPress={() => {}} style={styles.busFilterTab}>
          <MaterialCommunityIcons name="clock-outline" size={24} color="#64748B" />
          <Text style={styles.busFilterTabText}>Timing</Text>
        </Pressable>
        <Pressable onPress={() => {}} style={styles.busFilterTab}>
          <MaterialCommunityIcons name="snowflake" size={24} color="#64748B" />
          <Text style={styles.busFilterTabText}>AC</Text>
        </Pressable>
        <Pressable onPress={() => onSortChange('fare')} style={styles.busFilterTab}>
          <MaterialCommunityIcons name="sort-variant" size={24} color="#64748B" />
          <Text style={styles.busFilterTabText}>Sort</Text>
        </Pressable>
        <Pressable onPress={() => {}} style={styles.busFilterTab}>
          <MaterialCommunityIcons name="filter-variant" size={24} color="#64748B" />
          <Text style={styles.busFilterTabText}>All Filters</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingBottom: 24, // extra padding for safe area
  },
  busBottomFilterBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  busFilterTab: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  busFilterTabText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 4,
  },
});
