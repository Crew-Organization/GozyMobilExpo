import { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import {
  trainResultsPalette,
  trainResultsRadius,
  trainResultsSpacing,
  trainResultsType,
} from '@/src/theme/train-results-ui';

const weekTemplate = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

type WeeklyIndicatorProps = {
  runningDays: string[];
};

export const WeeklyIndicator = memo(function WeeklyIndicator({ runningDays }: WeeklyIndicatorProps) {
  return (
    <View style={styles.wrap}>
      {weekTemplate.map((day, index) => {
        const active = runningDays.includes(day);

        return (
          <View key={`${day}-${index}`} style={styles.dayWrap}>
            <Text style={[styles.label, active && styles.labelActive]}>{day}</Text>
            {index < weekTemplate.length - 1 ? <Text style={styles.separator}>|</Text> : null}
          </View>
        );
      })}
    </View>
  );
});

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 0,
  },
  dayWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  label: {
    fontSize: 8,
    lineHeight: 10,
    color: '#CBD5E1',
    fontFamily: trainResultsType.body.fontFamily,
  },
  labelActive: {
    color: '#4B5563',
    fontFamily: trainResultsType.trainTitle.fontFamily,
  },
  separator: {
    fontSize: 8,
    lineHeight: 10,
    color: '#D1D5DB',
    fontFamily: trainResultsType.body.fontFamily,
  },
});
