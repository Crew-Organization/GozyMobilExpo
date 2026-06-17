import { memo } from 'react';
import { FlashList } from '@shopify/flash-list';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import {
  trainResultsPalette,
  trainResultsRadius,
  trainResultsSpacing,
  trainResultsType,
} from '@/src/theme/train-results-ui';

export type DateChip = {
  key: string;
  dayLabel: string;
  monthTag: string;
  weekdayLabel: string;
};

type DateCarouselProps = {
  activeIndex: number;
  days: DateChip[];
  onSelect: (index: number) => void;
};

export const DateCarousel = memo(function DateCarousel({
  activeIndex,
  days,
  onSelect,
}: DateCarouselProps) {
  return (
    <View style={styles.wrap}>
      <View style={styles.monthTag}>
        <Text style={styles.monthText}>{days[activeIndex]?.monthTag ?? 'MAY'}</Text>
      </View>

      <FlashList
        horizontal
        data={days}
        keyExtractor={(item) => item.key}
        renderItem={({ item, index }) => {
          const active = index === activeIndex;

          return (
            <Pressable
              onPress={() => onSelect(index)}
              style={({ pressed }) => [
                styles.dayChip,
                active && styles.dayChipActive,
                pressed && styles.dayChipPressed,
              ]}
            >
              <Text style={[styles.dayNumber, active && styles.dayNumberActive]}>{item.dayLabel}</Text>
              <Text style={[styles.dayWeekday, active && styles.dayWeekdayActive]}>{item.weekdayLabel}</Text>
            </Pressable>
          );
        }}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: trainResultsSpacing.xs,
  },
  monthTag: {
    width: 30,
    height: 44,
    marginRight: trainResultsSpacing.xxs,
    backgroundColor: '#111111',
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthText: {
    ...trainResultsType.caption,
    color: trainResultsPalette.surface,
    fontFamily: trainResultsType.trainTitle.fontFamily,
    transform: [{ rotate: '-90deg' }],
  },
  listContent: {
    paddingRight: trainResultsSpacing.xs,
    gap: trainResultsSpacing.xxs,
  },
  dayChip: {
    width: 76,
    height: 48,
    borderRadius: trainResultsRadius.sm,
    borderWidth: 1,
    borderColor: trainResultsPalette.border,
    backgroundColor: trainResultsPalette.surface,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 4,
  },
  dayChipActive: {
    backgroundColor: trainResultsPalette.primaryBlue,
    borderColor: trainResultsPalette.primaryBlue,
  },
  dayChipPressed: {
    transform: [{ scale: 0.98 }],
  },
  dayNumber: {
    fontSize: 12,
    lineHeight: 14,
    fontFamily: trainResultsType.trainTitle.fontFamily,
    color: trainResultsPalette.textPrimary,
  },
  dayNumberActive: {
    color: trainResultsPalette.surface,
  },
  dayWeekday: {
    marginTop: 2,
    fontSize: 9,
    lineHeight: 11,
    fontFamily: trainResultsType.body.fontFamily,
    color: trainResultsPalette.textSecondary,
  },
  dayWeekdayActive: {
    color: 'rgba(255,255,255,0.92)',
  },
});
