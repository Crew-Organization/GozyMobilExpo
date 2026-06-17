import React from 'react';
import { ScrollView, StyleSheet, Text, View, Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, typography } from '@/src/theme/tokens';

type CarouselSectionProps = {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onPressAction?: () => void;
  children: React.ReactNode;
};

export function CarouselSection({
  title,
  subtitle,
  actionLabel = 'See all',
  onPressAction,
  children,
}: CarouselSectionProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titles}>
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
        {onPressAction ? (
          <Pressable onPress={onPressAction} style={styles.action}>
            <Text style={styles.actionLabel}>{actionLabel}</Text>
            <MaterialCommunityIcons name="chevron-right" size={16} color={colors.sky} />
          </Pressable>
        ) : null}
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        snapToInterval={240 + spacing.md} // Roughly the width of a card + gap
        decelerationRate="fast"
      >
        {children}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
    marginVertical: spacing.xs,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
  },
  titles: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: typography.section,
    fontWeight: '900',
    color: colors.text,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: typography.caption,
    color: colors.textMuted,
    lineHeight: 18,
  },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingBottom: 2,
  },
  actionLabel: {
    fontSize: typography.caption,
    fontWeight: '700',
    color: colors.sky,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
    paddingBottom: spacing.sm,
  },
});
