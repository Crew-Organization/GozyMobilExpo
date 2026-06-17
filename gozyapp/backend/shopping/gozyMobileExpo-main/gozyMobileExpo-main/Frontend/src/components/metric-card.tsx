import { StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing, typography } from '@/src/theme/tokens';

type MetricCardProps = {
  label: string;
  value: string;
  helper?: string;
  tone?: string;
  progress?: number;
};

export function MetricCard({
  label,
  value,
  helper,
  tone = colors.aqua,
  progress,
}: MetricCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
      {helper ? <Text style={styles.helper}>{helper}</Text> : null}
      {typeof progress === 'number' ? (
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { backgroundColor: tone, width: `${progress}%` }]} />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minHeight: 110,
    borderRadius: radius.md,
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    gap: spacing.xs,
  },
  label: {
    color: colors.textMuted,
    fontSize: typography.caption,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  value: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '800',
  },
  helper: {
    color: colors.textMuted,
    fontSize: typography.body,
    lineHeight: 20,
  },
  progressTrack: {
    marginTop: spacing.sm,
    height: 6,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: radius.pill,
  },
});
