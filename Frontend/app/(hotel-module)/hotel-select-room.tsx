import { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Image } from 'expo-image';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Redirect, router } from 'expo-router';

import { useSuperAppStore } from '@/src/store/super-app-store';
import { colors, radius, spacing, typography } from '@/src/theme/tokens';
import type { HotelRoom } from '@/src/types';

export default function HotelSelectRoomScreen() {
  const { selectedHotel, selectedRoom, setSelectedRoom } = useSuperAppStore();
  const [selectedId, setSelectedId] = useState<string | null>(selectedRoom?.id ?? null);

  if (!selectedHotel) return <Redirect href="/(hotel-module)/hotel-results" />;

  const hotel = selectedHotel;

  const handleSelect = (room: HotelRoom) => {
    setSelectedId(room.id);
    setSelectedRoom(room);
  };

  const currentRoom = hotel.rooms.find((r) => r.id === selectedId) ?? null;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <MaterialCommunityIcons name="arrow-left" size={22} color={colors.text} />
        </Pressable>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle} numberOfLines={1}>{hotel.name}</Text>
          <Text style={styles.headerSub}>Select Your Room</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Hotel Summary */}
        <View style={styles.hotelSummary}>
          <Image source={{ uri: hotel.image }} style={styles.summaryImage} contentFit="cover" />
          <View style={styles.summaryBody}>
            <Text style={styles.summaryName} numberOfLines={1}>{hotel.name}</Text>
            <Text style={styles.summaryLocation}>{hotel.location}</Text>
            <View style={styles.summaryMeta}>
              <View style={styles.ratingBadge}>
                <Text style={styles.ratingText}>{hotel.rating} ★</Text>
                <Text style={styles.ratingLabel}>{hotel.ratingLabel}</Text>
              </View>
              <Text style={styles.reviewCount}>{hotel.reviewCount.toLocaleString('en-IN')} ratings</Text>
            </View>
          </View>
        </View>

        {/* Date Bar */}
        <View style={styles.dateBar}>
          <View style={styles.dateItem}>
            <Text style={styles.dateLabel}>CHECK-IN</Text>
            <Text style={styles.dateValue}>{"Sat, 12 Apr '26"}</Text>
          </View>
          <View style={styles.nightPill}>
            <MaterialCommunityIcons name="weather-night" size={12} color="#405B84" />
            <Text style={styles.nightText}>1 Night</Text>
          </View>
          <View style={styles.dateItem}>
            <Text style={styles.dateLabel}>CHECK-OUT</Text>
            <Text style={styles.dateValue}>{"Sun, 13 Apr '26"}</Text>
          </View>
        </View>

        {/* Room Cards */}
        <Text style={styles.sectionTitle}>Available Rooms</Text>
        {hotel.rooms.map((room) => {
          const isSelected = selectedId === room.id;
          return (
            <View key={room.id} style={[styles.roomCard, isSelected && styles.roomCardSelected]}>
              <Image source={{ uri: room.image }} style={styles.roomImage} contentFit="cover" />

              <View style={styles.roomBody}>
                <Text style={styles.roomName}>{room.name}</Text>

                {/* Room Details */}
                <View style={styles.roomDetailsRow}>
                  <View style={styles.roomDetail}>
                    <MaterialCommunityIcons name="ruler-square" size={14} color="#405B84" />
                    <Text style={styles.roomDetailText}>{room.sizeSqFt} sq.ft</Text>
                  </View>
                  <View style={styles.roomDetail}>
                    <MaterialCommunityIcons name="bed-queen" size={14} color="#405B84" />
                    <Text style={styles.roomDetailText}>{room.bedType}</Text>
                  </View>
                  <View style={styles.roomDetail}>
                    <MaterialCommunityIcons name="shower" size={14} color="#405B84" />
                    <Text style={styles.roomDetailText}>{room.bathroomCount} Bath</Text>
                  </View>
                  <View style={styles.roomDetail}>
                    <MaterialCommunityIcons name="account-multiple" size={14} color="#405B84" />
                    <Text style={styles.roomDetailText}>{room.capacity} Guests</Text>
                  </View>
                </View>

                {/* Plan Options */}
                <View style={styles.planBox}>
                  <View style={styles.planHeader}>
                    <MaterialCommunityIcons name="food-variant" size={14} color={colors.success} />
                    <Text style={styles.planLabel}>Room Only</Text>
                    <View style={styles.freeCancelBadge}>
                      <Text style={styles.freeCancelText}>FREE CANCEL</Text>
                    </View>
                  </View>
                  <Text style={styles.planNote}>Free cancellation before 11 Apr 2026. No charges apply.</Text>

                  {/* Price Row */}
                  <View style={styles.priceRow}>
                    <View>
                      <Text style={styles.originalPrice}>₹{(room.price * 2).toLocaleString('en-IN')}</Text>
                      <Text style={styles.currentPrice}>₹{room.price.toLocaleString('en-IN')}</Text>
                      <Text style={styles.taxNote}>+ ₹{hotel.taxes.toLocaleString('en-IN')} taxes/night</Text>
                    </View>
                    <Pressable
                      style={[styles.selectBtn, isSelected && styles.selectBtnSelected]}
                      onPress={() => handleSelect(room)}
                    >
                      {isSelected ? (
                        <>
                          <MaterialCommunityIcons name="check" size={14} color="#FFF" />
                          <Text style={styles.selectBtnText}>Selected</Text>
                        </>
                      ) : (
                        <Text style={styles.selectBtnText}>Select</Text>
                      )}
                    </Pressable>
                  </View>
                </View>

                {/* Amenities */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.roomAmenitiesRow}>
                  {room.amenities.slice(0, 4).map((a) => (
                    <View key={a} style={styles.amenityChip}>
                      <MaterialCommunityIcons name="check" size={10} color={colors.success} />
                      <Text style={styles.amenityText}>{a}</Text>
                    </View>
                  ))}
                </ScrollView>
              </View>
            </View>
          );
        })}
      </ScrollView>

      {/* Sticky Bottom Bar */}
      {currentRoom && (
        <View style={styles.stickyBar}>
          <View>
            <Text style={styles.stickyLabel}>Total for 1 night</Text>
            <Text style={styles.stickyPrice}>₹{(currentRoom.price + hotel.taxes).toLocaleString('en-IN')}</Text>
            <Text style={styles.stickyTax}>incl. of all taxes</Text>
          </View>
          <Pressable
            style={styles.continueBtn}
            onPress={() => router.push('/(hotel-module)/hotel-rules')}
          >
            <Text style={styles.continueBtnText}>CONTINUE</Text>
            <MaterialCommunityIcons name="arrow-right" size={16} color="#FFF" />
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },

  header: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingHorizontal: spacing.md, paddingTop: 54, paddingBottom: 12,
    backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: colors.line,
  },
  backBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  headerCenter: { flex: 1 },
  headerTitle: { fontSize: typography.body, fontWeight: '900', color: colors.text },
  headerSub: { fontSize: typography.caption, color: colors.textMuted, marginTop: 2 },

  scrollContent: { padding: spacing.md, gap: 16, paddingBottom: 120 },

  hotelSummary: { flexDirection: 'row', gap: 12, backgroundColor: '#FFF', borderRadius: radius.md, overflow: 'hidden', borderWidth: 1, borderColor: colors.line },
  summaryImage: { width: 90, height: 90 },
  summaryBody: { flex: 1, padding: 10, gap: 4 },
  summaryName: { fontSize: typography.caption, fontWeight: '900', color: colors.text },
  summaryLocation: { fontSize: 11, color: colors.textMuted },
  summaryMeta: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 2 },
  ratingBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#10B981', paddingHorizontal: 7, paddingVertical: 3, borderRadius: 5 },
  ratingText: { color: '#FFF', fontSize: 11, fontWeight: '900' },
  ratingLabel: { color: 'rgba(255,255,255,0.9)', fontSize: 9, fontWeight: '700' },
  reviewCount: { fontSize: 11, color: colors.textMuted },

  dateBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFF', padding: spacing.md, borderRadius: radius.md, borderWidth: 1, borderColor: colors.line },
  dateItem: { alignItems: 'center' },
  dateLabel: { fontSize: 10, color: colors.textMuted, fontWeight: '700', letterSpacing: 0.5, textTransform: 'uppercase' },
  dateValue: { fontSize: 13, fontWeight: '900', color: colors.text, marginTop: 4 },
  nightPill: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#EEF2F7', paddingHorizontal: 10, paddingVertical: 5, borderRadius: radius.pill },
  nightText: { fontSize: 11, color: '#405B84', fontWeight: '700' },

  sectionTitle: { fontSize: typography.section, fontWeight: '900', color: colors.text },

  roomCard: { backgroundColor: '#FFF', borderRadius: radius.lg, overflow: 'hidden', borderWidth: 2, borderColor: colors.line },
  roomCardSelected: { borderColor: '#172B4D' },
  roomImage: { width: '100%', height: 140 },
  roomBody: { padding: spacing.md, gap: 10 },
  roomName: { fontSize: typography.body, fontWeight: '900', color: colors.text },

  roomDetailsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  roomDetail: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  roomDetailText: { fontSize: 12, color: colors.textMuted, fontWeight: '600' },

  planBox: { backgroundColor: '#F8FAFC', borderRadius: radius.md, padding: spacing.sm, gap: 6, borderWidth: 1, borderColor: colors.line },
  planHeader: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  planLabel: { fontSize: typography.caption, fontWeight: '800', color: colors.text, flex: 1 },
  freeCancelBadge: { backgroundColor: '#D1FAE5', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  freeCancelText: { fontSize: 9, fontWeight: '900', color: '#166534' },
  planNote: { fontSize: 11, color: colors.textMuted, lineHeight: 15 },

  priceRow: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' },
  originalPrice: { fontSize: 12, color: colors.textMuted, textDecorationLine: 'line-through' },
  currentPrice: { fontSize: 20, fontWeight: '900', color: colors.text },
  taxNote: { fontSize: 10, color: colors.textMuted, marginTop: 2 },

  selectBtn: { backgroundColor: '#172B4D', flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 16, paddingVertical: 10, borderRadius: radius.pill },
  selectBtnSelected: { backgroundColor: '#10B981' },
  selectBtnText: { color: '#FFF', fontSize: 13, fontWeight: '900' },

  roomAmenitiesRow: { gap: 8 },
  amenityChip: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#F0FDF4', paddingHorizontal: 8, paddingVertical: 4, borderRadius: radius.pill, borderWidth: 1, borderColor: '#BBF7D0' },
  amenityText: { fontSize: 10, color: '#166534', fontWeight: '600' },

  stickyBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: '#FFF', padding: spacing.md, paddingBottom: 28,
    borderTopWidth: 1, borderTopColor: colors.line,
    shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 10, shadowOffset: { width: 0, height: -4 }, elevation: 8,
  },
  stickyLabel: { fontSize: 11, color: colors.textMuted, fontWeight: '600' },
  stickyPrice: { fontSize: 22, fontWeight: '900', color: colors.text },
  stickyTax: { fontSize: 10, color: colors.textMuted, marginTop: 2 },
  continueBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: '#172B4D', paddingHorizontal: 24, paddingVertical: 14, borderRadius: radius.pill,
  },
  continueBtnText: { color: '#FFF', fontSize: typography.body, fontWeight: '900', letterSpacing: 0.5 },
});
