import type { ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import type { BusFilterOption, BusSortOption } from '@/src/lib/bus-search-data';
import { colors, radius, spacing, typography } from '@/src/theme/tokens';

const SORT_OPTIONS: {
  id: BusSortOption;
  label: string;
  icon: 'clock-outline' | 'tag-outline' | 'star-outline' | 'speedometer';
}[] = [
  { id: 'departure', label: 'Departure', icon: 'clock-outline' },
  { id: 'fare', label: 'Cheapest', icon: 'tag-outline' },
  { id: 'rating', label: 'Rating', icon: 'star-outline' },
  { id: 'duration', label: 'Fastest', icon: 'speedometer' },
];

const DEFAULT_FILTERS: { id: BusFilterOption; label: string }[] = [
  { id: 'all', label: 'All buses' },
  { id: 'ac', label: 'AC' },
  { id: 'sleeper', label: 'Sleeper' },
  { id: 'seater', label: 'Seater' },
  { id: 'morning', label: 'Before 12 PM' },
  { id: 'evening', label: 'After 12 PM' },
];

type BusResultsToolbarProps = {
  sortBy: BusSortOption;
  filterBy: BusFilterOption;
  onSortChange: (value: BusSortOption) => void;
  onFilterChange: (value: BusFilterOption) => void;
  accent?: string;
  filterOptions?: { id: BusFilterOption; label: string }[];
};

export function BusResultsToolbar({
  sortBy,
  filterBy,
  onSortChange,
  onFilterChange,
  accent = '#10A8EC',
  filterOptions = DEFAULT_FILTERS,
}: BusResultsToolbarProps) {
  return (
    <View style={styles.panel}>
      <ChipRow>
        {SORT_OPTIONS.map((option) => {
          const active = sortBy === option.id;
          return (
            <Pressable
              key={option.id}
              onPress={() => onSortChange(option.id)}
              style={[styles.sortChip, active && { backgroundColor: accent, borderColor: accent }]}
            >
              <MaterialCommunityIcons
                name={option.icon}
                size={14}
                color={active ? '#FFFFFF' : colors.textMuted}
              />
              <Text style={[styles.sortText, active && styles.sortTextActive]}>{option.label}</Text>
            </Pressable>
          );
        })}
      </ChipRow>
      <ChipRow>
        {filterOptions.map((option) => {
          const active = filterBy === option.id;
          return (
            <Pressable
              key={option.id}
              onPress={() => onFilterChange(option.id)}
              style={[
                styles.filterChip,
                active && { backgroundColor: `${accent}14`, borderColor: accent },
              ]}
            >
              <Text style={[styles.filterText, active && { color: accent, fontWeight: '800' }]}>
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </ChipRow>
    </View>
  );
}

function ChipRow({ children }: { children: ReactNode }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
      {children}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  panel: {
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
    paddingVertical: spacing.sm,
    gap: spacing.xs,
  },
  chipRow: { paddingHorizontal: spacing.md, gap: spacing.xs },
  sortChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceSoft,
    borderWidth: 1,
    borderColor: colors.line,
  },
  sortText: { fontSize: typography.caption, fontWeight: '700', color: colors.textMuted },
  sortTextActive: { color: '#FFFFFF' },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: radius.pill,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: colors.line,
  },
  filterText: { fontSize: typography.caption, fontWeight: '700', color: colors.textMuted },
});
