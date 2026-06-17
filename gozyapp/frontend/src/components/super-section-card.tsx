import { Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { colors, radius, spacing, typography } from '@/src/theme/tokens';
import type { LifestyleSection } from '@/src/types';

type SuperSectionCardProps = {
  section: LifestyleSection;
  onPress?: () => void;
};

export function SuperSectionCard({ section, onPress }: SuperSectionCardProps) {
  return (
    <Pressable onPress={onPress} style={[styles.card, { borderColor: `${section.accent}55` }]}>
      <View style={styles.header}>
        <View style={[styles.iconWrap, { backgroundColor: `${section.accent}22` }]}>
          <MaterialCommunityIcons
            color={section.accent}
            name={iconForSection(section.kind)}
            size={22}
          />
        </View>
        <View style={styles.metricWrap}>
          <Text style={[styles.metric, { color: section.accent }]}>{section.heroMetric}</Text>
          <Text style={styles.metricLabel}>{section.heroLabel}</Text>
        </View>
      </View>

      <Text style={styles.title}>{section.title}</Text>
      <Text style={styles.summary}>{section.summary}</Text>

      <View style={styles.actions}>
        {section.actions.slice(0, 4).map((action) => (
          <View key={action.id} style={styles.action}>
            <MaterialCommunityIcons color={colors.text} name={action.icon as never} size={16} />
            <Text style={styles.actionLabel}>{action.label}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.inspirations}>Inspired by {section.inspirations.join(', ')}</Text>
    </Pressable>
  );
}

function iconForSection(kind: LifestyleSection['kind']) {
  switch (kind) {
    case 'travel':
      return 'airplane';
    case 'food':
      return 'silverware-fork-knife';
    case 'shopping':
      return 'shopping';
    case 'entertainment':
      return 'ticket-confirmation-outline';
    case 'social':
      return 'message-text-outline';
    default:
      return 'apps';
  }
}

const styles = StyleSheet.create({
  card: {
    width: 320,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  iconWrap: {
    width: 46,
    height: 46,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metricWrap: {
    flex: 1,
    alignItems: 'flex-end',
  },
  metric: {
    fontSize: typography.section,
    fontWeight: '900',
  },
  metricLabel: {
    color: colors.textMuted,
    fontSize: typography.caption,
  },
  title: {
    color: colors.text,
    fontSize: typography.section,
    fontWeight: '800',
  },
  summary: {
    color: colors.textMuted,
    fontSize: typography.body,
    lineHeight: 21,
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,255,255,0.06)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 8,
  },
  actionLabel: {
    color: colors.text,
    fontSize: typography.caption,
    fontWeight: '700',
  },
  inspirations: {
    marginTop: spacing.xs,
    color: colors.textMuted,
    fontSize: typography.caption,
    lineHeight: 18,
  },
});
