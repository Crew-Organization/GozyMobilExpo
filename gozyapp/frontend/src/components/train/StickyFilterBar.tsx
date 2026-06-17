import { memo } from 'react';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import {
  trainResultsPalette,
  trainResultsRadius,
  trainResultsShadow,
  trainResultsSpacing,
  trainResultsType,
} from '@/src/theme/train-results-ui';

type StickyFilterBarProps = {
  activeFilterCount: number;
  activeQuota: boolean;
  activeQuickFilters: string[];
  onChipPress: (chip: 'AC' | 'Available' | 'Quota' | 'Departure after 6 PM' | 'Sort & Filter') => void;
};

const chips = ['AC', 'Available', 'Quota', 'Departure after 6 PM', 'Sort & Filter'] as const;

export const StickyFilterBar = memo(function StickyFilterBar({
  activeFilterCount,
  activeQuota,
  activeQuickFilters,
  onChipPress,
}: StickyFilterBarProps) {
  return (
    <Animated.View entering={FadeInDown.duration(260)} style={styles.wrap} pointerEvents="box-none">
      <View style={styles.bar}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {chips.map((chip) => {
            const active =
              (chip === 'Quota' && activeQuota) ||
              (chip !== 'Quota' && chip !== 'Sort & Filter' && activeQuickFilters.includes(chip)) ||
              (chip === 'Sort & Filter' && activeFilterCount > 0);

            return (
              <Pressable
                key={chip}
                onPress={() => onChipPress(chip)}
                style={({ pressed }) => [
                  styles.chip,
                  chip === 'Departure after 6 PM' && styles.chipWide,
                  chip === 'Sort & Filter' && styles.chipSort,
                  active && styles.chipActive,
                  pressed && styles.chipPressed,
                ]}
              >
                {chip === 'Sort & Filter' ? (
                  <View style={styles.sortWrap}>
                    <View style={styles.sortIconWrap}>
                      <MaterialCommunityIcons color={trainResultsPalette.surface} name="tune-variant" size={18} />
                      <View style={styles.badge}>
                        <Text style={styles.badgeText}>{Math.max(1, activeFilterCount)}</Text>
                      </View>
                    </View>
                    <Text style={styles.chipText}>Sort & Filter</Text>
                  </View>
                ) : (
                  <Text style={styles.chipText}>
                    {chip === 'Departure after 6 PM' ? 'Departure\nafter 6 PM' : chip}
                  </Text>
                )}
              </Pressable>
            );
          })}
        </ScrollView>
      </View>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: trainResultsSpacing.sm,
    paddingBottom: 10,
  },
  bar: {
    backgroundColor: 'rgba(11, 27, 43, 0.96)',
    borderRadius: trainResultsRadius.md,
    paddingVertical: 6,
    paddingHorizontal: 4,
    ...trainResultsShadow,
  },
  scrollContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 4,
  },
  chip: {
    minWidth: 64,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    paddingVertical: 11,
  },
  chipWide: {
    minWidth: 102,
  },
  chipSort: {
    minWidth: 86,
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  chipActive: {
    backgroundColor: 'rgba(29, 155, 240, 0.18)',
  },
  chipPressed: {
    transform: [{ scale: 0.98 }],
  },
  chipText: {
    ...trainResultsType.caption,
    color: trainResultsPalette.surface,
    fontFamily: trainResultsType.body.fontFamily,
    textAlign: 'center',
  },
  sortWrap: {
    alignItems: 'center',
    gap: 4,
  },
  sortIconWrap: {
    position: 'relative',
    width: 22,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: -7,
    right: -10,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: trainResultsPalette.surface,
    borderWidth: 2,
    borderColor: trainResultsPalette.darkNavy,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    ...trainResultsType.tiny,
    color: trainResultsPalette.primaryBlue,
    fontFamily: trainResultsType.trainTitle.fontFamily,
  },
});
