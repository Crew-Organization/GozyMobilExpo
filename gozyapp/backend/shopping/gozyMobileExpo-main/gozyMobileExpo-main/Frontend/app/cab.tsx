import { useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import {
  cabFaqs,
  cabHeroPromos,
  cabModeTabs,
  cabOffersFeed,
  defaultCabSearch,
  formatCabDateTime,
} from '@/src/lib/cab-data';
import { useSuperAppStore } from '@/src/store/super-app-store';
import { colors, radius, spacing, typography } from '@/src/theme/tokens';

export default function CabScreen() {
  const { cabRecentSearches, resetCabFlow, setCabSearch, addCabRecentSearch } = useSuperAppStore();
  const [activeTab, setActiveTab] = useState(defaultCabSearch.tripMode);
  const [rideKind, setRideKind] = useState(defaultCabSearch.rideKind);
  const [pickup, setPickup] = useState(defaultCabSearch.pickupLabel);
  const [drop, setDrop] = useState(defaultCabSearch.dropLabel);
  const [tripStart] = useState(defaultCabSearch.pickupDateTime);
  const [tripEnd] = useState(defaultCabSearch.returnDateTime ?? '2026-04-24T10:00:00');

  const promo = cabHeroPromos[activeTab];
  const startMeta = useMemo(() => formatCabDateTime(tripStart), [tripStart]);
  const endMeta = useMemo(() => formatCabDateTime(tripEnd), [tripEnd]);

  const handleSearch = () => {
    const search = {
      tripMode: activeTab,
      rideKind,
      pickupLabel: pickup,
      dropLabel: drop,
      pickupDateTime: tripStart,
      returnDateTime: rideKind === 'round-trip' ? tripEnd : undefined,
      distanceKm: activeTab === 'airport' ? 34 : 872,
      durationLabel: activeTab === 'airport' ? '1 hr(s) approx time' : '18 hr(s) approx time',
    } as const;

    resetCabFlow();
    setCabSearch(search);
    addCabRecentSearch({
      id: `${pickup}-${drop}`.toLowerCase().replace(/\s+/g, '-'),
      from: pickup,
      to: drop,
      dateLabel: startMeta.compact,
    });
    router.push('/cab-matching');
  };

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.headerAction}>
            <MaterialCommunityIcons color={colors.text} name="arrow-left" size={28} />
          </Pressable>
          <Text style={styles.headerTitle}>Cab Search</Text>
          <View style={styles.headerAction} />
        </View>

        <View style={styles.tabsRow}>
          {cabModeTabs.map((tab) => {
            const active = tab.id === activeTab;

            return (
              <Pressable
                key={tab.id}
                onPress={() => setActiveTab(tab.id)}
                style={[styles.tabCard, active ? styles.tabCardActive : null]}>
                <MaterialCommunityIcons
                  color={active ? '#1096EB' : '#5C6675'}
                  name={tab.icon as keyof typeof MaterialCommunityIcons.glyphMap}
                  size={28}
                />
                <Text style={[styles.tabLabel, active ? styles.tabLabelActive : null]}>{tab.label}</Text>
                {active ? <View style={styles.tabBar} /> : null}
              </Pressable>
            );
          })}
        </View>

        <View style={[styles.heroBanner, { backgroundColor: promo.tint }]}>
          <View style={styles.heroIcon}>
            <MaterialCommunityIcons
              color="#11A0F0"
              name={promo.icon as keyof typeof MaterialCommunityIcons.glyphMap}
              size={28}
            />
          </View>
          <View style={styles.heroCopy}>
            <Text style={styles.heroTitle}>{promo.title}</Text>
            <Text style={styles.heroBody}>{promo.body}</Text>
          </View>
        </View>

        <View style={styles.dotsRow}>
          <View style={[styles.dot, styles.dotActive]} />
          <View style={styles.dot} />
        </View>

        <View style={styles.sectionPad}>
          <View style={styles.modeRow}>
            <RideModeButton
              active={rideKind === 'one-way'}
              caption="Get dropped off"
              label="One Way"
              onPress={() => setRideKind('one-way')}
            />
            <RideModeButton
              active={rideKind === 'round-trip'}
              caption="Keep cab till return"
              label="Round Trip"
              onPress={() => setRideKind('round-trip')}
            />
          </View>

          <View style={styles.routeStack}>
            <RouteField
              icon="map-marker-radius-outline"
              label="FROM"
              onChangeText={setPickup}
              placeholder="Enter pick up address"
              value={pickup}
            />
            <Pressable
              onPress={() => {
                const nextPickup = drop;
                const nextDrop = pickup;
                setPickup(nextPickup);
                setDrop(nextDrop);
              }}
              style={styles.swapButton}>
              <MaterialCommunityIcons color="#1096EB" name="swap-vertical" size={26} />
            </Pressable>
            <RouteField
              icon="map-marker-outline"
              label="TO"
              onChangeText={setDrop}
              placeholder="Enter drop address"
              value={drop}
            />
          </View>

          {rideKind === 'round-trip' ? (
            <View style={styles.returnStrip}>
              <MaterialCommunityIcons color="#6B7280" name="swap-horizontal" size={20} />
              <Text style={styles.returnTitle}>RETURN TO PICKUP LOCATION</Text>
              <View style={styles.roundTripChip}>
                <Text style={styles.roundTripChipText}>Round trip</Text>
              </View>
            </View>
          ) : null}

          <View style={styles.addStopsRow}>
            <Pressable style={styles.addStopsButton}>
              <Text style={styles.addStopsText}>+ ADD STOPS</Text>
            </Pressable>
            <View style={styles.newChip}>
              <Text style={styles.newChipText}>new</Text>
            </View>
          </View>

          <View style={styles.dateRow}>
            <InfoTile
              label="TRIP START"
              title={startMeta.day}
              subtitle={startMeta.time}
            />
            <InfoTile
              label="TRIP END"
              title={rideKind === 'round-trip' ? endMeta.compact : 'Same day'}
              subtitle={rideKind === 'round-trip' ? endMeta.weekday : 'Flexible'}
            />
          </View>

          <WideInfoTile
            icon="account-outline"
            label="TRAVELLERS and BAGS (Optional)"
          />

          <Pressable onPress={handleSearch} style={styles.searchButton}>
            <LinearGradient colors={['#1BB6F9', '#1858F5']} style={styles.searchGradient}>
              <Text style={styles.searchText}>SEARCH</Text>
            </LinearGradient>
          </Pressable>
        </View>

        <View style={styles.graySection}>
          <Text style={styles.sectionTitle}>Recent Searches</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.recentRow}>
              {cabRecentSearches.map((item) => (
                <Pressable
                  key={item.id}
                  onPress={() => {
                    setPickup(item.from);
                    setDrop(item.to);
                  }}
                  style={styles.recentCard}>
                  <Text numberOfLines={1} style={styles.recentRoute}>
                    {item.from} to {item.to}
                  </Text>
                  <Text style={styles.recentDate}>{item.dateLabel}</Text>
                </Pressable>
              ))}
            </View>
          </ScrollView>

          <Text style={styles.sectionTitle}>Offers</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.offerRow}>
              {cabOffersFeed.map((offer) => (
                <LinearGradient
                  key={offer.id}
                  colors={offer.palette}
                  style={styles.offerCard}>
                  <Text style={styles.offerTag}>OFFERS</Text>
                  <Text style={styles.offerTitle}>{offer.title}</Text>
                  <Text style={styles.offerBody}>{offer.body}</Text>
                  <Text style={styles.offerCta}>{offer.cta}</Text>
                </LinearGradient>
              ))}
            </View>
          </ScrollView>

          <Text style={styles.sectionTitle}>FAQs</Text>
          {cabFaqs.map((faq) => (
            <View key={faq.id} style={styles.faqCard}>
              <Text style={styles.faqQuestion}>Q. {faq.question}</Text>
              <Text style={styles.faqAnswer}>{faq.answer}</Text>
              <View style={styles.faqFooter}>
                <Text style={styles.faqLink}>Read more</Text>
                <MaterialCommunityIcons color="#1096EB" name="chevron-right" size={24} />
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

function RideModeButton({
  active,
  label,
  caption,
  onPress,
}: {
  active: boolean;
  label: string;
  caption: string;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={[styles.modeCard, active ? styles.modeCardActive : null]}>
      <View style={[styles.radioOuter, active ? styles.radioOuterActive : null]}>
        {active ? <View style={styles.radioInner} /> : null}
      </View>
      <View>
        <Text style={[styles.modeTitle, active ? styles.modeTitleActive : null]}>{label}</Text>
        <Text style={styles.modeCaption}>{caption}</Text>
      </View>
    </Pressable>
  );
}

function RouteField({
  icon,
  label,
  value,
  placeholder,
  onChangeText,
}: {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  label: string;
  value: string;
  placeholder: string;
  onChangeText: (text: string) => void;
}) {
  return (
    <View style={styles.routeField}>
      <View style={styles.routeMarker}>
        <MaterialCommunityIcons color="#6B7280" name={icon} size={20} />
      </View>
      <View style={styles.routeCopy}>
        <Text style={styles.routeLabel}>{label}</Text>
        <TextInput
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#9AA3AF"
          style={styles.routeInput}
          value={value}
        />
      </View>
    </View>
  );
}

function InfoTile({
  label,
  title,
  subtitle,
}: {
  label: string;
  title: string;
  subtitle: string;
}) {
  return (
    <View style={styles.infoTile}>
      <MaterialCommunityIcons color="#A1A1AA" name="calendar-month-outline" size={22} />
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoTitle}>{title}</Text>
      <Text style={styles.infoSubtitle}>{subtitle}</Text>
    </View>
  );
}

function WideInfoTile({ icon, label }: { icon: keyof typeof MaterialCommunityIcons.glyphMap; label: string }) {
  return (
    <View style={styles.wideInfoTile}>
      <MaterialCommunityIcons color="#80858F" name={icon} size={22} />
      <Text style={styles.wideInfoText}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.canvas,
  },
  content: {
    paddingBottom: spacing.xxl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  headerAction: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '900',
  },
  tabsRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  tabCard: {
    flex: 1,
    alignItems: 'center',
    gap: spacing.xs,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
    backgroundColor: colors.white,
  },
  tabCardActive: {
    backgroundColor: '#F1F8FF',
  },
  tabLabel: {
    color: colors.text,
    fontSize: typography.body,
    textAlign: 'center',
    lineHeight: 21,
  },
  tabLabelActive: {
    color: '#1096EB',
    fontWeight: '800',
  },
  tabBar: {
    position: 'absolute',
    bottom: 0,
    width: 72,
    height: 4,
    borderRadius: radius.pill,
    backgroundColor: '#1096EB',
  },
  heroBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  heroIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.88)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroCopy: {
    flex: 1,
    gap: 4,
  },
  heroTitle: {
    color: colors.text,
    fontSize: typography.section,
    fontWeight: '900',
  },
  heroBody: {
    color: colors.textMuted,
    fontSize: typography.body,
    lineHeight: 22,
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.sm,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: radius.pill,
    backgroundColor: '#D4D4D8',
  },
  dotActive: {
    backgroundColor: '#9CA3AF',
  },
  sectionPad: {
    paddingHorizontal: spacing.md,
    gap: spacing.md,
  },
  modeRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  modeCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: '#D8DFE8',
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  modeCardActive: {
    borderColor: '#1096EB',
    backgroundColor: '#EDF7FF',
  },
  radioOuter: {
    width: 28,
    height: 28,
    borderRadius: radius.pill,
    borderWidth: 2,
    borderColor: '#A1A1AA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOuterActive: {
    borderColor: '#1096EB',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: radius.pill,
    backgroundColor: '#1096EB',
  },
  modeTitle: {
    color: colors.text,
    fontSize: typography.section,
    fontWeight: '800',
  },
  modeTitleActive: {
    color: '#1096EB',
  },
  modeCaption: {
    color: colors.textMuted,
    fontSize: typography.body,
  },
  routeStack: {
    gap: spacing.md,
    position: 'relative',
  },
  routeField: {
    flexDirection: 'row',
    gap: spacing.sm,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: '#E6E8EE',
    backgroundColor: '#FAFAFB',
    padding: spacing.md,
    minHeight: 86,
  },
  routeMarker: {
    paddingTop: 8,
  },
  routeCopy: {
    flex: 1,
    gap: 6,
  },
  routeLabel: {
    color: '#72757D',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.6,
  },
  routeInput: {
    color: colors.text,
    fontSize: 18,
    paddingVertical: 0,
  },
  swapButton: {
    position: 'absolute',
    right: 8,
    top: 64,
    zIndex: 2,
    width: 52,
    height: 52,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E6E8EE',
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.shadow,
    shadowOpacity: 1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  returnStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    borderRadius: radius.md,
    backgroundColor: '#F5F5F5',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  returnTitle: {
    color: '#4C525D',
    fontSize: 15,
    fontWeight: '800',
  },
  roundTripChip: {
    borderRadius: radius.sm,
    backgroundColor: '#DFF1FF',
    paddingHorizontal: spacing.xs,
    paddingVertical: 4,
  },
  roundTripChipText: {
    color: '#0A87D1',
    fontSize: typography.caption,
    fontWeight: '800',
  },
  addStopsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  addStopsButton: {
    borderRadius: radius.md,
    borderWidth: 2,
    borderColor: '#1096EB',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  addStopsText: {
    color: '#1096EB',
    fontSize: typography.body,
    fontWeight: '900',
  },
  newChip: {
    borderRadius: radius.pill,
    backgroundColor: '#FFEEF6',
    paddingHorizontal: spacing.xs,
    paddingVertical: 4,
  },
  newChipText: {
    color: '#D84A8B',
    fontSize: typography.caption,
    fontWeight: '800',
  },
  dateRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  infoTile: {
    flex: 1,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: '#E6E8EE',
    backgroundColor: '#FAFAFB',
    padding: spacing.md,
    gap: 4,
  },
  infoLabel: {
    color: '#72757D',
    fontSize: 13,
    fontWeight: '700',
  },
  infoTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '900',
  },
  infoSubtitle: {
    color: '#4B5563',
    fontSize: typography.body,
  },
  wideInfoTile: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: '#E6E8EE',
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.lg,
  },
  wideInfoText: {
    color: '#303543',
    fontSize: typography.section,
    fontWeight: '500',
  },
  searchButton: {
    borderRadius: radius.md,
    overflow: 'hidden',
  },
  searchGradient: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
  },
  searchText: {
    color: colors.white,
    fontSize: 22,
    fontWeight: '900',
  },
  graySection: {
    marginTop: spacing.lg,
    backgroundColor: '#F3F4F6',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.lg,
    gap: spacing.md,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '900',
  },
  recentRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  recentCard: {
    width: 240,
    minHeight: 120,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#36A8F0',
    backgroundColor: colors.surface,
    padding: spacing.md,
    justifyContent: 'space-between',
  },
  recentRoute: {
    color: colors.text,
    fontSize: typography.section,
    fontWeight: '700',
  },
  recentDate: {
    color: '#7B808A',
    fontSize: 15,
  },
  offerRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  offerCard: {
    width: 300,
    borderRadius: 28,
    padding: spacing.lg,
    gap: spacing.sm,
    minHeight: 220,
    justifyContent: 'flex-end',
  },
  offerTag: {
    alignSelf: 'flex-start',
    color: '#4A5565',
    fontSize: typography.caption,
    fontWeight: '800',
    backgroundColor: 'rgba(255,255,255,0.8)',
    paddingHorizontal: spacing.xs,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  offerTitle: {
    color: colors.text,
    fontSize: 28,
    lineHeight: 32,
    fontWeight: '900',
  },
  offerBody: {
    color: '#4B5563',
    fontSize: typography.body,
    lineHeight: 22,
  },
  offerCta: {
    color: '#1096EB',
    fontSize: typography.section,
    fontWeight: '900',
  },
  faqCard: {
    borderRadius: 24,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    padding: spacing.md,
    gap: spacing.md,
  },
  faqQuestion: {
    color: colors.text,
    fontSize: typography.section,
    fontWeight: '900',
  },
  faqAnswer: {
    color: '#5B616E',
    fontSize: typography.body,
    lineHeight: 24,
  },
  faqFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.line,
  },
  faqLink: {
    color: '#1096EB',
    fontSize: typography.section,
    fontWeight: '900',
  },
});
