import { useEffect, useMemo, useState } from 'react';
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import {
  BUS_CITIES,
  filterBusCities,
  POPULAR_BUS_CITY_NAMES,
  type BusCity,
} from '@/src/lib/bus-cities';
import { colors, radius, spacing, typography } from '@/src/theme/tokens';

type BusCityModalProps = {
  visible: boolean;
  title: string;
  currentCity: string;
  excludeCity?: string;
  /** When set, search is limited to these city names (e.g. operator service area). */
  cityNames?: string[];
  accent?: string;
  onSelect: (city: string) => void;
  onClose: () => void;
};

export function BusCityModal({
  visible,
  title,
  currentCity,
  excludeCity,
  cityNames,
  accent = '#10A8EC',
  onSelect,
  onClose,
}: BusCityModalProps) {
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (visible) setQuery('');
  }, [visible]);

  const cityPool = useMemo(() => {
    if (!cityNames?.length) return BUS_CITIES;
    const allowed = new Set(cityNames.map((name) => name.toLowerCase()));
    const matched = BUS_CITIES.filter((city) => allowed.has(city.name.toLowerCase()));
    const matchedNames = new Set(matched.map((city) => city.name.toLowerCase()));
    const extras: BusCity[] = cityNames
      .filter((name) => !matchedNames.has(name.toLowerCase()))
      .map((name) => ({ name, state: 'Service city' }));
    return [...matched, ...extras];
  }, [cityNames]);

  const filtered = useMemo(() => {
    const list = filterBusCities(query, cityPool).filter(
      (city) => city.name.toLowerCase() !== excludeCity?.trim().toLowerCase(),
    );
    return list;
  }, [cityPool, excludeCity, query]);

  const popularCities = useMemo(() => {
    const popularNames = cityNames?.length ? cityNames : POPULAR_BUS_CITY_NAMES;
    return popularNames
      .map((name) => cityPool.find((city) => city.name === name))
      .filter(
        (city): city is BusCity =>
          city != null && city.name.toLowerCase() !== excludeCity?.trim().toLowerCase(),
      );
  }, [cityNames, cityPool, excludeCity]);

  const showPopular = !query.trim();

  const pickCity = (name: string) => {
    onSelect(name);
    onClose();
  };

  return (
    <Modal transparent visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            <Pressable onPress={onClose} hitSlop={10}>
              <MaterialCommunityIcons name="close" size={24} color={colors.text} />
            </Pressable>
          </View>

          <View style={styles.searchWrap}>
            <MaterialCommunityIcons name="magnify" size={22} color={colors.textMuted} />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Search city or state"
              placeholderTextColor={colors.textLight}
              style={styles.searchInput}
              autoCorrect={false}
              autoCapitalize="words"
              returnKeyType="search"
            />
            {query.length > 0 ? (
              <Pressable onPress={() => setQuery('')} hitSlop={8}>
                <MaterialCommunityIcons name="close-circle" size={20} color={colors.textLight} />
              </Pressable>
            ) : null}
          </View>

          {showPopular ? (
            <View style={styles.popularSection}>
              <Text style={styles.sectionLabel}>POPULAR CITIES</Text>
              <View style={styles.popularRow}>
                {popularCities.map((city) => {
                  const selected = city.name === currentCity;
                  return (
                    <Pressable
                      key={city.name}
                      onPress={() => pickCity(city.name)}
                      style={[
                        styles.popularChip,
                        selected && { backgroundColor: `${accent}18`, borderColor: accent },
                      ]}
                    >
                      <Text style={[styles.popularChipText, selected && { color: accent }]}>
                        {city.name}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          ) : null}

          <Text style={styles.sectionLabel}>
            {query.trim() ? 'SEARCH RESULTS' : 'ALL CITIES'}
          </Text>

          <FlatList
            data={filtered}
            keyExtractor={(item) => item.name}
            keyboardShouldPersistTaps="handled"
            ListEmptyComponent={
              <View style={styles.emptyWrap}>
                <MaterialCommunityIcons name="map-search" size={40} color={colors.textLight} />
                <Text style={styles.emptyTitle}>No city found</Text>
                <Text style={styles.emptyBody}>Try another spelling or pick a nearby city.</Text>
              </View>
            }
            renderItem={({ item }) => {
              const selected = item.name === currentCity;
              return (
                <Pressable
                  onPress={() => pickCity(item.name)}
                  style={[styles.row, selected && { backgroundColor: `${accent}10` }]}
                >
                  <View style={[styles.rowIcon, selected && { backgroundColor: `${accent}20` }]}>
                    <MaterialCommunityIcons
                      name="map-marker"
                      size={18}
                      color={selected ? accent : colors.textMuted}
                    />
                  </View>
                  <View style={styles.rowCopy}>
                    <Text style={[styles.rowTitle, selected && { color: accent, fontWeight: '800' }]}>
                      {item.name}
                    </Text>
                    <Text style={styles.rowState}>{item.state}</Text>
                  </View>
                  {selected ? (
                    <MaterialCommunityIcons name="check-circle" size={22} color={accent} />
                  ) : (
                    <MaterialCommunityIcons name="chevron-right" size={22} color={colors.textLight} />
                  )}
                </Pressable>
              );
            }}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(17, 24, 39, 0.5)',
    justifyContent: 'flex-end',
  },
  sheet: {
    maxHeight: '88%',
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    paddingBottom: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  title: {
    fontSize: typography.section,
    fontWeight: '800',
    color: colors.text,
  },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.md,
    height: 48,
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceSoft,
    borderWidth: 1,
    borderColor: colors.line,
  },
  searchInput: {
    flex: 1,
    fontSize: typography.body,
    color: colors.text,
    paddingVertical: 0,
  },
  popularSection: {
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  sectionLabel: {
    paddingHorizontal: spacing.md,
    marginBottom: spacing.xs,
    fontSize: typography.tiny,
    fontWeight: '900',
    letterSpacing: 0.6,
    color: colors.textMuted,
  },
  popularRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  popularChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceSoft,
    borderWidth: 1,
    borderColor: colors.line,
  },
  popularChipText: {
    fontSize: typography.caption,
    fontWeight: '700',
    color: colors.text,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.line,
  },
  rowIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceSoft,
  },
  rowCopy: {
    flex: 1,
    gap: 2,
  },
  rowTitle: {
    fontSize: typography.body,
    fontWeight: '600',
    color: colors.text,
  },
  rowState: {
    fontSize: typography.caption,
    color: colors.textMuted,
  },
  emptyWrap: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
    gap: spacing.xs,
  },
  emptyTitle: {
    fontSize: typography.body,
    fontWeight: '800',
    color: colors.text,
  },
  emptyBody: {
    fontSize: typography.caption,
    color: colors.textMuted,
    textAlign: 'center',
  },
});
