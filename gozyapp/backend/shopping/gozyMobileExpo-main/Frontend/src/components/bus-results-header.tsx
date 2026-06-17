import { Fragment, type ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View, type ImageSourcePropType } from 'react-native';
import { Image } from 'expo-image';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

import { radius, spacing, typography } from '@/src/theme/tokens';

type StatItem = {
  label: string;
  value?: string;
  icon?: 'shield-check';
};

type BusResultsHeaderProps = {
  gradientColors: readonly [string, string];
  from: string;
  to: string;
  dateLabel: string;
  stats: StatItem[];
  onBack: () => void;
  onRefresh?: () => void;
  title?: string;
  logo?: ImageSourcePropType;
};

export function BusResultsHeader({
  gradientColors,
  from,
  to,
  dateLabel,
  stats,
  onBack,
  onRefresh,
  title,
  logo,
}: BusResultsHeaderProps) {
  return (
    <LinearGradient colors={[...gradientColors]} style={styles.header}>
      <SafeAreaView edges={['top']}>
        <View style={styles.row}>
          <Pressable onPress={onBack} style={styles.btn}>
            <MaterialCommunityIcons name="arrow-left" size={24} color="#FFFFFF" />
          </Pressable>
          <Pressable onPress={onBack} style={styles.summary}>
            {logo ? <Image source={logo} style={styles.logo} contentFit="contain" /> : null}
            <View style={[styles.copy, !title && styles.copyCenter]}>
              {title ? <Text style={styles.title} numberOfLines={1}>{title}</Text> : null}
              <View style={styles.cities}>
                <Text style={styles.city}>{from}</Text>
                <MaterialCommunityIcons name="arrow-right" size={16} color="rgba(255,255,255,0.9)" />
                <Text style={styles.city}>{to}</Text>
              </View>
              <Text style={styles.date}>{dateLabel}</Text>
            </View>
          </Pressable>
          <Pressable onPress={onRefresh ?? onBack} style={styles.btn}>
            {onRefresh ? (
              <MaterialCommunityIcons name="refresh" size={22} color="#FFFFFF" />
            ) : null}
          </Pressable>
        </View>
        <View style={styles.stats}>
          {stats.map((stat, index) => (
            <Fragment key={stat.label}>
              {index > 0 ? <View style={styles.divider} /> : null}
              <View style={styles.statCell}>
                {stat.icon ? (
                  <MaterialCommunityIcons name={stat.icon} size={18} color="#FFFFFF" />
                ) : (
                  <Text style={styles.statValue}>{stat.value}</Text>
                )}
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            </Fragment>
          ))}
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

export function BusResultsBanner({ children }: { children: ReactNode }) {
  return <View style={styles.banner}>{children}</View>;
}

export function BusResultsEmpty({
  title,
  actionLabel,
  accent,
  onAction,
}: {
  title: string;
  actionLabel: string;
  accent: string;
  onAction: () => void;
}) {
  return (
    <View style={styles.empty}>
      <MaterialCommunityIcons name="bus-alert" size={48} color="#98A2B3" />
      <Text style={styles.emptyTitle}>{title}</Text>
      <Pressable onPress={onAction} style={[styles.emptyBtn, { backgroundColor: accent }]}>
        <Text style={styles.emptyBtnText}>{actionLabel}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { paddingBottom: spacing.md },
  row: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.sm, paddingTop: spacing.xs },
  btn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  summary: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  logo: { width: 40, height: 40, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.9)' },
  copy: { flex: 1, gap: 4 },
  copyCenter: { alignItems: 'center' },
  title: {
    color: 'rgba(255,255,255,0.92)',
    fontSize: typography.caption,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  cities: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  city: { color: '#FFFFFF', fontSize: typography.section, fontWeight: '900' },
  date: { color: 'rgba(255,255,255,0.85)', fontSize: typography.caption, fontWeight: '600' },
  stats: {
    flexDirection: 'row',
    marginHorizontal: spacing.md,
    marginTop: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: 'rgba(255,255,255,0.16)',
  },
  statCell: { flex: 1, alignItems: 'center', gap: 4 },
  divider: { width: 1, backgroundColor: 'rgba(255,255,255,0.25)' },
  statValue: { color: '#FFFFFF', fontSize: typography.body, fontWeight: '900' },
  statLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 10, fontWeight: '600', textAlign: 'center' },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
    padding: spacing.sm,
    borderRadius: radius.sm,
    backgroundColor: '#ECFDF3',
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  empty: { alignItems: 'center', paddingVertical: spacing.xxl, gap: spacing.sm },
  emptyTitle: { fontSize: typography.body, fontWeight: '800', color: '#111827' },
  emptyBtn: {
    marginTop: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.sm,
  },
  emptyBtnText: { color: '#FFFFFF', fontWeight: '800' },
});
