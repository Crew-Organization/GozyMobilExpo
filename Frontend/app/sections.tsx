import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';

import { ScreenShell } from '@/src/components/screen-shell';
import { TopBar } from '@/src/components/top-bar';
import { useApp } from '@/src/context/app-context';
import { colors, radius, spacing, typography } from '@/src/theme/tokens';

export default function SectionsScreen() {
  const { sections } = useApp();

  return (
    <ScreenShell>
      <TopBar
        eyebrow="Super app sections"
        primaryAction={{ icon: 'arrow-left', onPress: () => router.back() }}
        subtitle="Dedicated product surfaces for travel, food, shopping, entertainment, and social coordination."
        title="Gozy vertical stacks"
      />

      {sections.map((section) => (
        <View key={section.id} style={[styles.card, { borderColor: `${section.accent}55` }]}>
          <Text style={[styles.kind, { color: section.accent }]}>{section.kind}</Text>
          <Text style={styles.title}>{section.title}</Text>
          <Text style={styles.summary}>{section.summary}</Text>

          <View style={styles.metricBanner}>
            <Text style={[styles.metric, { color: section.accent }]}>{section.heroMetric}</Text>
            <Text style={styles.metricLabel}>{section.heroLabel}</Text>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.actions}>
            {section.actions.map((action) => (
              <View key={action.id} style={styles.actionCard}>
                <Text style={styles.actionLabel}>{action.label}</Text>
                <Text style={styles.actionCaption}>{action.caption}</Text>
                {action.badge ? <Text style={styles.badge}>{action.badge}</Text> : null}
              </View>
            ))}
          </ScrollView>

          <View style={styles.highlightWrap}>
            {section.highlights.map((highlight) => (
              <Text key={highlight} style={styles.highlight}>
                {highlight}
              </Text>
            ))}
          </View>

          <Text style={styles.inspiration}>Benchmarked against {section.inspirations.join(', ')}</Text>
        </View>
      ))}
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    padding: spacing.lg,
    gap: spacing.md,
  },
  kind: {
    fontSize: typography.caption,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  title: {
    color: colors.text,
    fontSize: typography.title,
    fontWeight: '800',
  },
  summary: {
    color: colors.textMuted,
    fontSize: typography.body,
    lineHeight: 22,
  },
  metricBanner: {
    borderRadius: radius.md,
    backgroundColor: colors.canvasMuted,
    padding: spacing.md,
  },
  metric: {
    fontSize: 26,
    fontWeight: '900',
  },
  metricLabel: {
    color: colors.textMuted,
    fontSize: typography.caption,
    marginTop: 4,
  },
  actions: {
    gap: spacing.sm,
  },
  actionCard: {
    width: 150,
    borderRadius: radius.md,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: colors.line,
    padding: spacing.md,
    gap: spacing.xs,
  },
  actionLabel: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: '700',
  },
  actionCaption: {
    color: colors.textMuted,
    fontSize: typography.caption,
  },
  badge: {
    color: colors.aqua,
    fontSize: typography.caption,
    fontWeight: '800',
    marginTop: spacing.xs,
  },
  highlightWrap: {
    gap: spacing.sm,
  },
  highlight: {
    color: colors.text,
    fontSize: typography.body,
    lineHeight: 21,
  },
  inspiration: {
    color: colors.textMuted,
    fontSize: typography.caption,
    lineHeight: 18,
  },
});
