import { memo } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import {
  trainResultsPalette,
  trainResultsRadius,
  trainResultsShadow,
  trainResultsSpacing,
  trainResultsType,
} from '@/src/theme/train-results-ui';

type SearchHeaderProps = {
  dateLabel: string;
  routeTitle: string;
  onBack: () => void;
  onEdit: () => void;
};

export const SearchHeader = memo(function SearchHeader({
  dateLabel,
  routeTitle,
  onBack,
  onEdit,
}: SearchHeaderProps) {
  return (
    <View style={styles.card}>
      <Pressable hitSlop={12} onPress={onBack} style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}>
        <MaterialCommunityIcons color={trainResultsPalette.textPrimary} name="arrow-left" size={24} />
      </Pressable>

      <View style={styles.textWrap}>
        <Text numberOfLines={1} style={styles.title}>
          {routeTitle}
        </Text>
        <Text style={styles.subtitle}>{dateLabel}</Text>
      </View>

      <Pressable hitSlop={12} onPress={onEdit} style={({ pressed }) => [styles.editWrap, pressed && styles.pressed]}>
        <MaterialCommunityIcons color={trainResultsPalette.primaryBlue} name="pencil" size={20} />
        <Text style={styles.editText}>Edit</Text>
      </Pressable>
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    marginHorizontal: trainResultsSpacing.sm,
    marginTop: trainResultsSpacing.xs,
    paddingHorizontal: trainResultsSpacing.sm,
    minHeight: 68,
    borderRadius: trainResultsRadius.md,
    backgroundColor: trainResultsPalette.surface,
    borderWidth: 1,
    borderColor: trainResultsPalette.border,
    flexDirection: 'row',
    alignItems: 'center',
    ...trainResultsShadow,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textWrap: {
    flex: 1,
    marginLeft: trainResultsSpacing.xs,
  },
  title: {
    ...trainResultsType.routeTitle,
    color: trainResultsPalette.textPrimary,
  },
  subtitle: {
    ...trainResultsType.subtitle,
    color: trainResultsPalette.textSecondary,
    marginTop: 2,
  },
  editWrap: {
    width: 52,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  editText: {
    ...trainResultsType.caption,
    fontFamily: trainResultsType.body.fontFamily,
    color: trainResultsPalette.primaryBlue,
  },
  pressed: {
    opacity: 0.82,
    transform: [{ scale: 0.98 }],
  },
});
