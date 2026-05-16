import { Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { colors, radius, spacing, typography } from '@/src/theme/tokens';

type Action = {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  onPress: () => void;
};

type TopBarProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  primaryAction?: Action;
  secondaryAction?: Action;
};

export function TopBar({
  eyebrow,
  title,
  subtitle,
  primaryAction,
  secondaryAction,
}: TopBarProps) {
  return (
    <View style={styles.container}>
      <View style={styles.copy}>
        {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      <View style={styles.actions}>
        {secondaryAction ? (
          <Pressable onPress={secondaryAction.onPress} style={styles.iconButton}>
            <MaterialCommunityIcons color={colors.text} name={secondaryAction.icon} size={20} />
          </Pressable>
        ) : null}
        {primaryAction ? (
          <Pressable onPress={primaryAction.onPress} style={styles.iconButton}>
            <MaterialCommunityIcons color={colors.text} name={primaryAction.icon} size={20} />
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.md,
    paddingTop: spacing.sm,
  },
  copy: {
    flex: 1,
    gap: 4,
  },
  eyebrow: {
    color: colors.aqua,
    fontSize: typography.caption,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  title: {
    color: colors.text,
    fontSize: typography.title,
    fontWeight: '800',
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: typography.body,
    lineHeight: 21,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.shadow,
    shadowOpacity: 1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
});
