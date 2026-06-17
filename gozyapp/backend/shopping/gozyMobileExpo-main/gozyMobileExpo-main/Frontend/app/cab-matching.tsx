import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { ScreenShell } from '@/src/components/screen-shell';
import { buildCabSearchResult } from '@/src/lib/cab-data';
import { useSuperAppStore } from '@/src/store/super-app-store';
import { colors, radius, spacing, typography } from '@/src/theme/tokens';

const highlights = [
  {
    id: 'quality',
    icon: 'shield-car',
    title: 'Quality and Premium Cabs',
    subtitle: 'and Drivers',
  },
  {
    id: 'fare',
    icon: 'cash-refund',
    title: 'One Way Fare',
    subtitle: 'No hidden surprises',
  },
];

export default function CabMatchingScreen() {
  const { cabSearch, setCabResults } = useSuperAppStore();

  useEffect(() => {
    const result = buildCabSearchResult(cabSearch);
    setCabResults(result);

    const timeout = setTimeout(() => {
      router.replace('/cab-results');
    }, 1800);

    return () => clearTimeout(timeout);
  }, [cabSearch, setCabResults]);

  return (
    <ScreenShell scroll={false} style={styles.root}>
      <View style={styles.centerWrap}>
        {highlights.map((item, index) => (
          <View key={item.id} style={[styles.featureBlock, index === 1 ? styles.featureBlockMuted : null]}>
            <MaterialCommunityIcons
              color={index === 1 ? '#D8E9FF' : '#2E67B1'}
              name={item.icon as keyof typeof MaterialCommunityIcons.glyphMap}
              size={58}
            />
            <Text style={[styles.featureTitle, index === 1 ? styles.featureMutedText : null]}>
              {item.title}
            </Text>
            <Text style={[styles.featureTitle, index === 1 ? styles.featureMutedText : null]}>
              {item.subtitle}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.bottomArea}>
        <Text style={styles.fetchText}>Fetching Best Rides</Text>
        <View style={styles.dotRow}>
          <View style={[styles.dot, styles.dotActive]} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xxl,
  },
  centerWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 56,
  },
  featureBlock: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  featureBlockMuted: {
    opacity: 0.18,
  },
  featureTitle: {
    color: '#4D4F56',
    fontSize: 18,
    textAlign: 'center',
    lineHeight: 28,
  },
  featureMutedText: {
    color: '#AEB4BE',
  },
  bottomArea: {
    alignItems: 'center',
    gap: spacing.sm,
    paddingBottom: spacing.xxl,
  },
  fetchText: {
    color: '#A0A0A0',
    fontSize: 20,
    fontWeight: '400',
  },
  dotRow: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: radius.pill,
    backgroundColor: '#D7D7D7',
  },
  dotActive: {
    backgroundColor: '#AFAFAF',
  },
});
