import { memo } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import {
  trainResultsPalette,
  trainResultsSpacing,
  trainResultsType,
} from '@/src/theme/train-results-ui';

export type TransportType = 'Trains' | 'Buses';

type TransportTabsProps = {
  activeTab: TransportType;
  onTabSelect: (tab: TransportType) => void;
  trainFareLabel: string;
  trainMetaLabel: string;
  busFareLabel: string;
  busMetaLabel: string;
};

export const TransportTabs = memo(function TransportTabs({
  activeTab,
  onTabSelect,
  trainFareLabel,
  trainMetaLabel,
  busFareLabel,
  busMetaLabel,
}: TransportTabsProps) {
  return (
    <View style={styles.row}>
      <Pressable onPress={() => onTabSelect('Trains')} style={[styles.tab, activeTab === 'Trains' && styles.activeTab]}>
        <MaterialCommunityIcons color={activeTab === 'Trains' ? trainResultsPalette.primaryBlue : trainResultsPalette.textMuted} name="train" size={22} />
        <View style={styles.content}>
          <View style={styles.titleRow}>
            <Text style={[styles.title, activeTab !== 'Trains' && styles.titleMuted]}>Trains</Text>
            {activeTab === 'Trains' && (
              <View style={styles.offerPill}>
                <Text style={styles.offerText}>Upto Rs 40 off</Text>
              </View>
            )}
          </View>
          <Text style={[styles.meta, activeTab !== 'Trains' && styles.metaMuted]}>{trainFareLabel} • {trainMetaLabel}</Text>
        </View>
      </Pressable>

      <Pressable onPress={() => onTabSelect('Buses')} style={[styles.tab, activeTab === 'Buses' && styles.activeTab]}>
        <MaterialCommunityIcons color={activeTab === 'Buses' ? trainResultsPalette.primaryBlue : trainResultsPalette.textMuted} name="bus-side" size={22} />
        <View style={styles.content}>
          <Text style={[styles.title, activeTab !== 'Buses' && styles.titleMuted]}>Buses</Text>
          <Text style={[styles.meta, activeTab !== 'Buses' && styles.metaMuted]}>{busFareLabel} • {busMetaLabel}</Text>
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
    color: '#8B96A6',
  },
  meta: {
    ...trainResultsType.tabMeta,
    color: trainResultsPalette.textPrimary,
    marginTop: 2,
  },
  metaMuted: {
    color: '#8B96A6',
  },
  offerPill: {
    borderRadius: 999,
    backgroundColor: trainResultsPalette.purple,
    paddingHorizontal: 6,
    paddingVertical: 2,
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

