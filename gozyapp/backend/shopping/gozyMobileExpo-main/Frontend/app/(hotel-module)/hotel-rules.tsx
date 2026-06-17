import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Redirect, router } from 'expo-router';

import { useSuperAppStore } from '@/src/store/super-app-store';
import { colors, radius, spacing, typography } from '@/src/theme/tokens';

const SECTIONS = [
  {
    title: 'Check-in / Check-out',
    icon: 'clock-time-four-outline',
    items: [
      { label: 'Check-in time', value: '12:00 PM', highlight: false },
      { label: 'Check-out time', value: '11:00 AM', highlight: false },
      { label: 'Early check-in', value: 'Subject to availability', highlight: false },
      { label: 'Late check-out', value: 'Subject to availability', highlight: false },
    ],
  },
  {
    title: '⚠️ Must Read',
    icon: 'alert-circle-outline',
    items: [
      { label: '', value: 'Guests are required to present a valid photo ID upon check-in.', highlight: false },
      { label: '', value: 'Primary guest must be at least 18 years old to check-in.', highlight: false },
      { label: '', value: 'The hotel reserves the right to refuse check-in to guests without a valid booking confirmation.', highlight: false },
    ],
  },
  {
    title: 'Guest Profile',
    icon: 'account-group-outline',
    items: [
      { label: 'Unmarried couples', value: '✅ Allowed', highlight: true },
      { label: 'Male groups', value: '✅ Allowed', highlight: true },
      { label: 'Female groups', value: '✅ Allowed', highlight: true },
      { label: 'Bachelor groups', value: '✅ Allowed', highlight: true },
    ],
  },
  {
    title: 'ID Proof Required',
    icon: 'card-account-details-outline',
    items: [
      { label: '', value: 'Aadhaar Card (Indian nationals)', highlight: false },
      { label: '', value: 'Passport (Foreign nationals)', highlight: false },
      { label: '', value: 'Driving License', highlight: false },
      { label: '', value: 'PAN Card (with photo)', highlight: false },
    ],
  },
  {
    title: 'Food & Dining',
    icon: 'food-variant',
    items: [
      { label: 'Outside food', value: '✅ Allowed', highlight: true },
      { label: 'Swiggy/Zomato delivery', value: '✅ Available', highlight: true },
      { label: 'Alcohol in rooms', value: '✅ Allowed from hotel bar', highlight: false },
      { label: 'Non-veg food', value: '✅ Available', highlight: false },
    ],
  },
  {
    title: 'Pets & Smoking',
    icon: 'dog-side',
    items: [
      { label: 'Pets', value: '❌ Not allowed', highlight: false },
      { label: 'Smoking', value: '❌ Smoking rooms not available', highlight: false },
      { label: 'Hookah/Sheesha', value: '❌ Not allowed', highlight: false },
    ],
  },
  {
    title: 'Children Policy',
    icon: 'baby-face-outline',
    items: [
      { label: 'Children under 5', value: 'Stay free using existing beds', highlight: false },
      { label: 'Children 5–12', value: 'Charged at actuals', highlight: false },
      { label: 'Extra bed for child', value: 'Available on request', highlight: false },
    ],
  },
];

export default function HotelRulesScreen() {
  const { selectedHotel } = useSuperAppStore();
  if (!selectedHotel) return <Redirect href="/(hotel-module)/hotel-results" />;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <MaterialCommunityIcons name="arrow-left" size={22} color={colors.text} />
        </Pressable>
        <View>
          <Text style={styles.headerTitle}>Property Rules</Text>
          <Text style={styles.headerSub} numberOfLines={1}>{selectedHotel.name}</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Notice Banner */}
        <View style={styles.noticeBanner}>
          <MaterialCommunityIcons name="information" size={16} color="#1E40AF" />
          <Text style={styles.noticeText}>
            Please review these rules carefully. Violations may result in non-refundable cancellation.
          </Text>
        </View>

        {SECTIONS.map((section, si) => (
          <View key={si} style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons name={section.icon as any} size={18} color="#405B84" />
              <Text style={styles.sectionTitle}>{section.title}</Text>
            </View>
            {section.items.map((item, ii) => (
              <View key={ii} style={styles.ruleRow}>
                {item.label ? (
                  <>
                    <Text style={styles.ruleLabel}>{item.label}</Text>
                    <Text style={[styles.ruleValue, item.highlight && styles.ruleValueHighlight]}>{item.value}</Text>
                  </>
                ) : (
                  <View style={styles.bulletRow}>
                    <View style={styles.bulletDot} />
                    <Text style={styles.bulletText}>{item.value}</Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        ))}

        {/* Proceed */}
        <Pressable style={styles.continueBtn} onPress={() => router.push('/(hotel-module)/hotel-review')}>
          <Text style={styles.continueBtnText}>I Understand, Proceed to Book</Text>
          <MaterialCommunityIcons name="arrow-right" size={18} color="#FFF" />
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },

  header: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: spacing.md, paddingTop: 54, paddingBottom: 12,
    backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: colors.line,
  },
  backBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: typography.body, fontWeight: '900', color: colors.text },
  headerSub: { fontSize: typography.caption, color: colors.textMuted, marginTop: 2, maxWidth: 260 },

  scrollContent: { padding: spacing.md, gap: 16, paddingBottom: 40 },

  noticeBanner: {
    flexDirection: 'row', gap: 8, padding: spacing.md,
    backgroundColor: '#DBEAFE', borderRadius: radius.md, borderWidth: 1, borderColor: '#BFDBFE',
  },
  noticeText: { flex: 1, fontSize: typography.caption, color: '#1E40AF', lineHeight: 18 },

  sectionCard: { backgroundColor: '#FFF', borderRadius: radius.lg, overflow: 'hidden', borderWidth: 1, borderColor: colors.line },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.line, backgroundColor: '#F8FAFC' },
  sectionTitle: { fontSize: typography.body, fontWeight: '900', color: colors.text },

  ruleRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', paddingHorizontal: spacing.md, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.line },
  ruleLabel: { fontSize: typography.caption, color: colors.textMuted, flex: 1 },
  ruleValue: { fontSize: typography.caption, color: colors.text, fontWeight: '700', textAlign: 'right', flex: 1 },
  ruleValueHighlight: { color: colors.success },

  bulletRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, flex: 1 },
  bulletDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: '#405B84', marginTop: 6 },
  bulletText: { flex: 1, fontSize: typography.caption, color: colors.textMuted, lineHeight: 18 },

  continueBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: '#172B4D', borderRadius: radius.pill, paddingVertical: 16,
  },
  continueBtnText: { color: '#FFF', fontSize: typography.body, fontWeight: '900' },
});
