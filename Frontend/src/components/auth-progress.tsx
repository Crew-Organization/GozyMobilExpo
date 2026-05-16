import { StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing, typography } from '@/src/theme/tokens';

type AuthProgressProps = {
  currentStep: 1 | 2 | 3;
};

const labels = ['Welcome', 'Sign in', 'Profile'] as const;

export function AuthProgress({ currentStep }: AuthProgressProps) {
  return (
    <View style={styles.container}>
      {labels.map((label, index) => {
        const stepNumber = index + 1;
        const active = stepNumber === currentStep;
        const done = stepNumber < currentStep;

        return (
          <View key={label} style={styles.step}>
            <View style={[styles.dot, (active || done) && styles.dotActive]}>
              <Text style={[styles.dotLabel, (active || done) && styles.dotLabelActive]}>
                {stepNumber}
              </Text>
            </View>
            <Text style={[styles.stepLabel, active && styles.stepLabelActive]}>{label}</Text>
            {index < labels.length - 1 ? (
              <View style={[styles.line, done && styles.lineActive]} />
            ) : null}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  step: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  dot: {
    width: 28,
    height: 28,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.lineStrong,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotActive: {
    backgroundColor: colors.sky,
    borderColor: colors.sky,
  },
  dotLabel: {
    color: colors.textMuted,
    fontSize: typography.caption,
    fontWeight: '800',
  },
  dotLabelActive: {
    color: '#FFFFFF',
  },
  stepLabel: {
    color: colors.textMuted,
    fontSize: typography.caption,
    fontWeight: '700',
  },
  stepLabelActive: {
    color: colors.text,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: colors.line,
    marginLeft: spacing.xs,
  },
  lineActive: {
    backgroundColor: colors.sky,
  },
});
