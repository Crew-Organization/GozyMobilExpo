import { useState } from 'react';
import {
  Dimensions,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Image } from 'expo-image';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

import { useSuperAppStore } from '@/src/store/super-app-store';
import { mockHotels, inlineCollections } from '@/src/lib/hotel-data';
import { colors, radius, spacing, typography } from '@/src/theme/tokens';
import type { HotelOffer } from '@/src/types';

const { width: W } = Dimensions.get('window');

const FILTERS = ['Sort', 'All Filters', 'Price', 'Location', 'Star Rating', 'Rush Deal'];

function StarBadge({ rating, label }: { rating: number; label: string }) {
  const bg = rating >= 4.5 ? '#10B981' : rating >= 4.0 ? '#3B82F6' : '#F59E0B';
  return (
    <View style={[styles.ratingBadge, { backgroundColor: bg }]}>
      <Text style={styles.ratingText}>{rating} ★</Text>
      <Text style={styles.ratingLabel}>{label}</Text>
    </View>
  );
}

function HotelCard({ hotel, onPress }: { hotel: HotelOffer; onPress: () => void }) {
  return (
    <Pressable style={styles.hotelCard} onPress={onPress}>
      {/* Image */}
      <View style={styles.cardImageWrap}>
        <Image source={{ uri: hotel.image }} style={styles.cardImage} contentFit="cover" />
        {hotel.isSponsored && (
          <View style={styles.sponsoredBadge}>
            <Text style={styles.sponsoredText}>Sponsored</Text>
          </View>
        )}
        {hotel.badge && (
          <View style={styles.rushBadge}>
            <Text style={styles.rushText}>{hotel.badge}</Text>
          </View>
        )}
        {hotel.isLuxe && (
          <View style={styles.luxeBadge}>
            <Text style={styles.luxeText}>★ LUXE</Text>
          </View>
        )}
      </View>

      <View style={styles.cardBody}>
        {hotel.apartmentType && (
          <Text style={styles.aptType}>{hotel.apartmentType}</Text>
        )}
        <Text style={styles.hotelName} numberOfLines={1}>{hotel.name}</Text>
        <View style={styles.locationRow}>
          <MaterialCommunityIcons name="map-marker" size={12} color={colors.textMuted} />
          <Text style={styles.locationText}>{hotel.location} · {hotel.area}</Text>
        </View>

        <View style={styles.ratingRow}>
          <StarBadge rating={hotel.rating} label={hotel.ratingLabel} />
          <Text style={styles.reviewCount}>{hotel.reviewCount.toLocaleString('en-IN')} Ratings</Text>
        </View>

        {/* Highlights */}
        <View style={styles.highlightsRow}>
          {hotel.highlights?.slice(0, 2).map((h, i) => (
            <View key={i} style={styles.highlightChip}>
              <MaterialCommunityIcons name="check-circle" size={10} color={colors.success} />
              <Text style={styles.highlightText}>{h}</Text>
            </View>
          ))}
        </View>

        {/* Price */}
        <View style={styles.priceRow}>
          <View>
            {hotel.originalPrice !== undefined && hotel.originalPrice > hotel.price && (
              <Text style={styles.originalPrice}>₹{hotel.originalPrice.toLocaleString('en-IN')}</Text>
            )}
            <Text style={styles.price}>₹{hotel.price.toLocaleString('en-IN')}</Text>
            <Text style={styles.taxLabel}>+ ₹{hotel.taxes.toLocaleString('en-IN')} taxes & fees/night</Text>
          </View>
          <Pressable style={styles.selectBtn} onPress={onPress}>
            <Text style={styles.selectBtnText}>View Rooms</Text>
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
}

export default function HotelResultsScreen() {
  const { hotelSearch, setSelectedHotel } = useSuperAppStore();
  const [activeFilter, setActiveFilter] = useState('Sort');

  const handleHotelPress = (hotel: HotelOffer) => {
    setSelectedHotel(hotel);
    router.push('/(hotel-module)/hotel-detail');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <MaterialCommunityIcons name="arrow-left" size={22} color={colors.text} />
        </Pressable>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>{hotelSearch.city} · Hotels</Text>
          <Text style={styles.headerSub}>
            12 Apr – 13 Apr · {hotelSearch.rooms} Room · {hotelSearch.guests} Guest
          </Text>
        </View>
        <Pressable style={styles.editBtn}>
          <Text style={styles.editText}>Edit</Text>
        </Pressable>
      </View>

      {/* Filter Pills */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterScroll}
        contentContainerStyle={styles.filterRow}
      >
        {FILTERS.map((f) => (
          <Pressable
            key={f}
            style={[styles.filterChip, activeFilter === f && styles.filterChipActive]}
            onPress={() => setActiveFilter(f)}
          >
            {f === 'Sort' && <MaterialCommunityIcons name="sort" size={13} color={activeFilter === f ? '#FFF' : colors.text} />}
            {f === 'All Filters' && <MaterialCommunityIcons name="tune" size={13} color={activeFilter === f ? '#FFF' : colors.text} />}
            <Text style={[styles.filterChipText, activeFilter === f && styles.filterChipTextActive]}>{f}</Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Results count */}
      <View style={styles.resultsBar}>
        <Text style={styles.resultsText}>
          <Text style={{ fontWeight: '900', color: colors.text }}>{mockHotels.length} Hotels</Text>
          {'  '}found in {hotelSearch.city}
        </Text>
      </View>

      <FlatList
        data={mockHotels}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <>
            <HotelCard hotel={item} onPress={() => handleHotelPress(item)} />
            {/* Inline Collection after 3rd item */}
            {index === 2 && (
              <View style={styles.collectionWrap}>
                <Text style={styles.collectionTitle}>🏨 Curated Collections</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.collectionRow}>
                  {inlineCollections.map((col) => (
                    <Pressable key={col.title} style={styles.collectionCard}>
                      <Text style={styles.collectionCardTitle}>{col.title}</Text>
                      <Text style={styles.collectionCardSub}>{col.description}</Text>
                      <Text style={styles.collectionCardCta}>Explore →</Text>
                    </Pressable>
                  ))}
                </ScrollView>
              </View>
            )}
          </>
        )}
        ListFooterComponent={
          <View style={styles.aiBar}>
            <MaterialCommunityIcons name="creation" size={16} color="#405B84" />
            <Text style={styles.aiBarText}>Show me stays near Secunderabad Junction with a pool…</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },

  header: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingHorizontal: spacing.md, paddingTop: 54, paddingBottom: 12,
    backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: colors.line,
  },
  backBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  headerCenter: { flex: 1 },
  headerTitle: { fontSize: typography.body, fontWeight: '900', color: colors.text },
  headerSub: { fontSize: typography.caption, color: colors.textMuted, marginTop: 2 },
  editBtn: { backgroundColor: '#EEF2F7', paddingHorizontal: 12, paddingVertical: 6, borderRadius: radius.pill },
  editText: { fontSize: typography.caption, fontWeight: '800', color: '#405B84' },

  filterScroll: { backgroundColor: '#FFF', maxHeight: 52 },
  filterRow: { paddingHorizontal: spacing.md, paddingVertical: 10, gap: 8 },
  filterChip: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: radius.pill,
    borderWidth: 1, borderColor: colors.line, backgroundColor: '#FFF',
  },
  filterChipActive: { backgroundColor: '#172B4D', borderColor: '#172B4D' },
  filterChipText: { fontSize: 12, fontWeight: '700', color: colors.text },
  filterChipTextActive: { color: '#FFF' },

  resultsBar: { paddingHorizontal: spacing.md, paddingVertical: 10, backgroundColor: '#F8FAFC' },
  resultsText: { fontSize: typography.caption, color: colors.textMuted },

  listContent: { padding: spacing.md, gap: 16, paddingBottom: 100 },

  hotelCard: {
    backgroundColor: '#FFF', borderRadius: radius.lg, overflow: 'hidden',
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 12, shadowOffset: { width: 0, height: 4 }, elevation: 3,
  },
  cardImageWrap: { height: 180, position: 'relative' },
  cardImage: { width: '100%', height: '100%' },
  sponsoredBadge: {
    position: 'absolute', top: 10, left: 10,
    backgroundColor: 'rgba(0,0,0,0.55)', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6,
  },
  sponsoredText: { color: '#FFF', fontSize: 10, fontWeight: '700' },
  rushBadge: {
    position: 'absolute', top: 10, left: 10,
    backgroundColor: '#EF4444', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6,
  },
  rushText: { color: '#FFF', fontSize: 10, fontWeight: '900' },
  luxeBadge: {
    position: 'absolute', top: 10, right: 10,
    backgroundColor: '#F59E0B', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6,
  },
  luxeText: { color: '#FFF', fontSize: 10, fontWeight: '900' },

  cardBody: { padding: spacing.md, gap: 8 },
  aptType: { fontSize: 10, color: '#405B84', fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  hotelName: { fontSize: typography.body, fontWeight: '900', color: colors.text },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  locationText: { fontSize: typography.caption, color: colors.textMuted },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  ratingBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  ratingText: { color: '#FFF', fontSize: 12, fontWeight: '900' },
  ratingLabel: { color: 'rgba(255,255,255,0.9)', fontSize: 10, fontWeight: '700' },
  reviewCount: { fontSize: typography.caption, color: colors.textMuted },

  highlightsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  highlightChip: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  highlightText: { fontSize: 11, color: colors.textMuted },

  priceRow: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: 4 },
  originalPrice: { fontSize: 12, color: colors.textMuted, textDecorationLine: 'line-through' },
  price: { fontSize: 20, fontWeight: '900', color: colors.text },
  taxLabel: { fontSize: 10, color: colors.textMuted, marginTop: 2 },
  selectBtn: {
    backgroundColor: '#172B4D', paddingHorizontal: 16, paddingVertical: 8, borderRadius: radius.pill,
  },
  selectBtnText: { color: '#FFF', fontSize: 12, fontWeight: '900' },

  collectionWrap: { marginBottom: 4 },
  collectionTitle: { fontSize: typography.caption, fontWeight: '900', color: colors.text, marginBottom: 8 },
  collectionRow: { gap: 10 },
  collectionCard: {
    width: W * 0.6, padding: spacing.md, borderRadius: radius.md,
    backgroundColor: '#EEF2F7', borderWidth: 1, borderColor: '#D6DDE7',
  },
  collectionCardTitle: { fontSize: typography.caption, fontWeight: '900', color: colors.text },
  collectionCardSub: { fontSize: 11, color: colors.textMuted, marginTop: 4, lineHeight: 15 },
  collectionCardCta: { fontSize: 12, fontWeight: '800', color: '#405B84', marginTop: 8 },

  aiBar: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    margin: spacing.md, padding: spacing.md,
    backgroundColor: '#EEF2F7', borderRadius: radius.lg,
    borderWidth: 1, borderColor: '#D6DDE7',
  },
  aiBarText: { flex: 1, fontSize: typography.caption, color: '#405B84', fontStyle: 'italic' },
});
