import { Fragment, useState, type ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View, type ImageSourcePropType } from 'react-native';
import { Image } from 'expo-image';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { radius, spacing, typography } from '@/src/theme/tokens';

type StatItem = {
  label: string;
  value?: string;
  icon?: 'shield-check';
};

type BusResultsHeaderProps = {
  gradientColors?: readonly [string, string];
  from: string;
  to: string;
  dateLabel: string;
  stats?: StatItem[];
  onBack: () => void;
  onRefresh?: () => void;
  title?: string;
  logo?: ImageSourcePropType;
};

export function BusResultsHeader({
  from,
  to,
  dateLabel,
  onBack,
  title,
  logo,
}: BusResultsHeaderProps) {
  const [activeTab, setActiveTab] = useState<'buses' | 'trains'>('buses');

  return (
    <View style={styles.header}>
      <SafeAreaView edges={['top']}>
        <View style={styles.topRow}>
          <Pressable onPress={onBack} style={styles.btn}>
            <MaterialCommunityIcons name="arrow-left" size={24} color="#0F172A" />
          </Pressable>
          <Pressable onPress={onBack} style={styles.summary}>
            {logo ? <Image source={logo} style={styles.logo} contentFit="contain" /> : null}
            <View style={[styles.copy, !title && styles.copyCenter]}>
              <View style={styles.cities}>
                <Text style={styles.city}>{title ? title : `${from} to ${to}`}</Text>
              </View>
              <Text style={styles.date}>{dateLabel.split(' •')[0]}</Text>
            </View>
          </Pressable>
          <Pressable onPress={onBack} style={styles.btnRight}>
            <MaterialCommunityIcons name="pencil" size={20} color="#2563EB" />
          </Pressable>
        </View>

        <View style={styles.tabsRow}>
          <Pressable 
            style={[styles.tab, activeTab === 'buses' && styles.tabActive]} 
            onPress={() => setActiveTab('buses')}
          >
            <MaterialCommunityIcons name="bus" size={20} color={activeTab === 'buses' ? '#2563EB' : '#64748B'} />
            <View style={styles.tabTextWrap}>
              <Text style={[styles.tabTitle, activeTab === 'buses' && styles.tabTitleActive]}>Buses</Text>
              <Text style={styles.tabSubtitle}>₹1938 • 28h 45m</Text>
            </View>
          </Pressable>
          
          <Pressable 
            style={[styles.tab, activeTab === 'trains' && styles.tabActive]} 
            onPress={() => setActiveTab('trains')}
          >
            <MaterialCommunityIcons name="train" size={20} color={activeTab === 'trains' ? '#2563EB' : '#64748B'} />
            <View style={styles.tabTextWrap}>
              <Text style={[styles.tabTitle, activeTab === 'trains' && styles.tabTitleActive]}>Trains</Text>
              <Text style={styles.tabSubtitle}>₹690 • 29h 27m</Text>
            </View>
            <View style={styles.pnrBadge}>
              <Text style={styles.pnrBadgeText}>Live PNR status</Text>
            </View>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
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
  header: { backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  topRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingTop: 12, paddingBottom: 8 },
  btn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  btnRight: { width: 40, height: 40, alignItems: 'flex-end', justifyContent: 'center' },
  summary: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 12 },
  logo: { width: 32, height: 32, borderRadius: 8, backgroundColor: '#F1F5F9' },
  copy: { flex: 1, gap: 2 },
  copyCenter: { alignItems: 'flex-start' },
  cities: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  city: { color: '#0F172A', fontSize: 16, fontWeight: '800' },
  date: { color: '#64748B', fontSize: 12, fontWeight: '600' },
  
  tabsRow: { flexDirection: 'row', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#F1F5F9' },
  tab: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, gap: 8, borderBottomWidth: 2, borderBottomColor: 'transparent' },
  tabActive: { borderBottomColor: '#2563EB' },
  tabTextWrap: { gap: 2 },
  tabTitle: { fontSize: 14, fontWeight: '700', color: '#64748B' },
  tabTitleActive: { color: '#0F172A', fontWeight: '800' },
  tabSubtitle: { fontSize: 10, color: '#94A3B8', fontWeight: '600' },
  pnrBadge: { position: 'absolute', top: 4, right: 12, backgroundColor: '#8B5CF6', paddingHorizontal: 4, paddingVertical: 2, borderRadius: 4 },
  pnrBadgeText: { color: '#FFF', fontSize: 8, fontWeight: '800' },

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
  emptyBtnText: { color: '#111827', fontWeight: '800' },
});
