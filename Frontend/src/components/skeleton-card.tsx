import { StyleSheet, View } from 'react-native';

import { colors, radius, spacing } from '@/src/theme/tokens';

type SkeletonCardProps = {
  height?: number;
};

export function SkeletonCard({ height = 140 }: SkeletonCardProps) {
  return <View style={[styles.card, { height }]} />;
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    backgroundColor: colors.canvasMuted,
    borderWidth: 1,
    borderColor: colors.line,
    marginBottom: spacing.md,
  },
});
