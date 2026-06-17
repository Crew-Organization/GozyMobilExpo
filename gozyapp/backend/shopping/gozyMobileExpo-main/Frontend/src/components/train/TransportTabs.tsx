import { memo } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import {
  trainResultsPalette,
  trainResultsSpacing,
  trainResultsType,
} from '@/src/theme/train-results-ui';

type TransportTabsProps = {
  activeFareLabel: string;
  activeMetaLabel: string;
  onBusPress: () => void;
};

export const TransportTabs = memo(function TransportTabs({
  activeFareLabel,
  activeMetaLabel,
  onBusPress,
}: TransportTabsProps) {
  return (
    <View style={styles.row}>
      <View style={[styles.tab, styles.activeTab]}>
        <MaterialCommunityIcons color={trainResultsPalette.textPrimary} name="train" size={22} />
        <View style={styles.content}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>Trains</Text>
            <View style={styles.offerPill}>
              <Text style={styles.offerText}>Upto Rs 40 off</Text>
            </View>
          </View>
          <Text style={styles.meta}>{activeFareLabel} • {activeMetaLabel}</Text>
        </View>
      </View>

      <Pressable onPress={onBusPress} style={({ pressed }) => [styles.tab, pressed && styles.pressed]}>
        <MaterialCommunityIcons color={trainResultsPalette.textMuted} name="bus-side" size={22} />
        <View style={styles.content}>
          <Text style={[styles.title, styles.titleMuted]}>No Buses</Text>
          <Text style={[styles.meta, styles.metaMuted]}>Try trains for this route</Text>
        </View>
      </Pressable>
    </View>
  );
});

const styles = StyleSheet.create({
  row: {
    marginTop: trainResultsSpacing.sm,
    flexDirection: 'row',
    backgroundColor: trainResultsPalette.surface,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: trainResultsPalette.border,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: trainResultsSpacing.xs,
    paddingHorizontal: trainResultsSpacing.sm,
    paddingVertical: trainResultsSpacing.sm,
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    backgroundColor: '#F8FBFF',
    borderBottomColor: trainResultsPalette.primaryBlue,
  },
  content: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  title: {
    ...trainResultsType.tabTitle,
    color: trainResultsPalette.textPrimary,
  },
  titleMuted: {
    color: '#CDD3DB',
  },
  meta: {
    ...trainResultsType.tabMeta,
    color: trainResultsPalette.textPrimary,
    marginTop: 2,
  },
  metaMuted: {
    color: '#B7BEC7',
  },
  offerPill: {
    borderRadius: 999,
    backgroundColor: trainResultsPalette.purple,
    paddingHorizontal: 9,
    paddingVertical: 4,
  },
  offerText: {
    ...trainResultsType.tiny,
    color: trainResultsPalette.surface,
    fontFamily: trainResultsType.body.fontFamily,
  },
  pressed: {
    opacity: 0.88,
  },
});
