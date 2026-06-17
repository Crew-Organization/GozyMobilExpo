import { startTransition, useDeferredValue, useMemo, useRef, useState } from 'react';
import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  type ViewToken,
} from 'react-native';
import { router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { Chip } from '@/src/components/chip';
import { ReelCard } from '@/src/components/reel-card';
import { ScreenShell } from '@/src/components/screen-shell';
import { TopBar } from '@/src/components/top-bar';
import { useApp } from '@/src/context/app-context';
import { colors, radius, spacing, typography } from '@/src/theme/tokens';
import type { Category } from '@/src/types';

const filters: ('All' | Category)[] = ['All', 'Travel', 'Food', 'Shopping', 'Entertainment'];

export default function ReelsScreen() {
  const { feed, sections, recommendations, handleFeedSwipe, bookExperience } = useApp();
  const [query, setQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'All' | Category>('All');
  const [activeId, setActiveId] = useState<string | null>(feed[0]?.id ?? null);
  const deferredQuery = useDeferredValue(query);

  const filteredFeed = useMemo(() => {
    return feed.filter((item) => {
      const matchesCategory = selectedFilter === 'All' || item.category === selectedFilter;
      const haystack = `${item.title} ${item.location} ${item.tags.join(' ')}`.toLowerCase();
      const matchesQuery = haystack.includes(deferredQuery.trim().toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [deferredQuery, feed, selectedFilter]);

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      const firstVisible = viewableItems.find((item) => item.isViewable);
      if (typeof firstVisible?.item === 'object' && firstVisible.item && 'id' in firstVisible.item) {
        setActiveId(String(firstVisible.item.id));
      }
    },
  );

  return (
    <ScreenShell scroll={false} style={styles.screen}>
      <TopBar
        eyebrow="Reels discovery"
        primaryAction={{ icon: 'robot-outline', onPress: () => router.push('/assistant') }}
        subtitle="Swipe through travel, food, shopping, and entertainment moments ranked by your preferences."
        title="Discover"
      />

      <View style={styles.searchCard}>
        <View style={styles.searchRow}>
          <MaterialCommunityIcons color={colors.textMuted} name="magnify" size={20} />
          <TextInput
            onChangeText={setQuery}
            placeholder="Search places, cuisines, products, or events"
            placeholderTextColor={colors.textMuted}
            style={styles.searchInput}
            value={query}
          />
        </View>
        <Text style={styles.searchHint}>{recommendations[1]}</Text>
      </View>

      <FlatList
        ListHeaderComponent={
          <View style={styles.listHeader}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
              {filters.map((filter) => (
                <Chip
                  key={filter}
                  label={filter}
                  onPress={() => startTransition(() => setSelectedFilter(filter))}
                  selected={selectedFilter === filter}
                />
              ))}
            </ScrollView>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.modulePills}>
              {sections.map((section) => (
                <Pressable key={section.id} onPress={() => router.push('/sections')} style={styles.modulePill}>
                  <Text style={[styles.modulePillText, { color: section.accent }]}>{section.title}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        }
        contentContainerStyle={styles.listContent}
        data={filteredFeed}
        keyExtractor={(item) => item.id}
        onViewableItemsChanged={onViewableItemsChanged.current}
        renderItem={({ item }) => (
          <ReelCard
            active={activeId === item.id}
            experience={item}
            onBook={(experience) => {
              void bookExperience(experience);
              router.push('/bookings');
            }}
            onSwipe={(experienceId, direction) => {
              void handleFeedSwipe(experienceId, direction);
            }}
          />
        )}
        showsVerticalScrollIndicator={false}
        viewabilityConfig={{ itemVisiblePercentThreshold: 60 }}
      />
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  searchCard: {
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    padding: spacing.md,
    gap: spacing.sm,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  searchInput: {
    flex: 1,
    color: colors.text,
    fontSize: typography.body,
  },
  searchHint: {
    color: colors.textMuted,
    fontSize: typography.caption,
    lineHeight: 18,
  },
  listHeader: {
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  filterRow: {
    gap: spacing.sm,
  },
  modulePills: {
    gap: spacing.sm,
  },
  modulePill: {
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceSoft,
    borderWidth: 1,
    borderColor: colors.line,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  modulePillText: {
    fontSize: typography.caption,
    fontWeight: '700',
  },
  listContent: {
    gap: spacing.lg,
    paddingBottom: spacing.xxl,
  },
});
