import { useState } from 'react';
import {
  Dimensions,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Redirect, router } from 'expo-router';

import { useSuperAppStore } from '@/src/store/super-app-store';
import { mockHotels } from '@/src/lib/hotel-data';
import { colors, radius, spacing, typography } from '@/src/theme/tokens';

const { width: W } = Dimensions.get('window');

const AMENITY_CATEGORIES = [
  { id: 'basic', label: 'Basic Facilities', items: ['Free WiFi', 'Air Conditioning', '24/7 Room Service', 'Lift', 'CCTV'] },
  { id: 'general', label: 'General Services', items: ['Laundry', 'Doctor on Call', 'Concierge', 'Wake-up Service', 'Luggage Storage'] },
  { id: 'room', label: 'Room Amenities', items: ['Flat-screen TV', 'Work Desk', 'Mini Fridge', 'Electric Kettle', 'Safe Box'] },
  { id: 'food', label: 'Food & Drinks', items: ['Restaurant', 'Bar & Lounge', 'Complimentary Breakfast', 'Room Dining', 'Pool Bar'] },
  { id: 'couples', label: 'Couples', items: ['Couple Friendly', 'Romantic Decor', 'Couple Package', 'Private Jacuzzi', 'In-room Dining for 2'] },
  { id: 'common', label: 'Common Area', items: ['Swimming Pool', 'Gym', 'Spa', 'Conference Room', 'Banquet Hall'] },
];

const LAST_10_RATINGS = [5, 3, 5, 5, 3, 4, 2, 1, 4, 5];

const GUEST_REVIEWS = [
  { name: 'Rahul S.', tag: 'Couple', date: 'Apr 2026', rating: 5, text: 'Absolutely stunning property! The pool view rooms are breathtaking. Staff was incredibly warm and professional.' },
  { name: 'Priya M.', tag: 'Solo', date: 'Mar 2026', rating: 4, text: 'Great location and super clean rooms. The bathroom was spotless with premium toiletries. Breakfast buffet was outstanding.' },
  { name: 'Dev K.', tag: 'Family', date: 'Feb 2026', rating: 3, text: 'Decent stay overall. Rooms are spacious. The check-in took a bit long, but the staff compensated with a complimentary upgrade.' },
];

const LANDMARKS = [
  { name: 'Phoenix aVance Mall', distance: '4.5 km', icon: 'shopping-outline' },
  { name: 'IKEA Hyderabad', distance: '6.2 km', icon: 'home-outline' },
  { name: 'Rajiv Gandhi Int. Airport', distance: '31 km', icon: 'airplane' },
  { name: 'Hussain Sagar Lake', distance: '8 km', icon: 'waves' },
];

const SIMILAR_STAYS = mockHotels.slice(0, 3);

function RatingBox({ value }: { value: number }) {
  const bg = value >= 4 ? '#10B981' : value === 3 ? '#F59E0B' : '#EF4444';
  return (
    <View style={[styles.ratingBox, { backgroundColor: bg }]}>
      <Text style={styles.ratingBoxText}>{value}</Text>
    </View>
  );
}

export default function HotelDetailScreen() {
  const { selectedHotel } = useSuperAppStore();
  const [showAmenities, setShowAmenities] = useState(false);
  const [amenityTab, setAmenityTab] = useState('basic');
  const [showMap, setShowMap] = useState(false);
  const [wishlist, setWishlist] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);

  if (!selectedHotel) return <Redirect href="/(hotel-module)/hotel-results" />;

  const hotel = selectedHotel;

  const subScores = [
    { label: 'Location', score: 4.6 },
    { label: 'Cleanliness', score: 4.4 },
    { label: 'Food', score: 4.2 },
    { label: 'Value for Money', score: 4.1 },
  ];

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Image Gallery */}
        <View style={styles.galleryWrap}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(e) => {
              setCurrentImage(Math.round(e.nativeEvent.contentOffset.x / W));
            }}
          >
            {hotel.images.map((img, i) => (
              <View key={i} style={{ width: W, height: 260 }}>
                <Image source={{ uri: img }} style={{ width: W, height: 260 }} contentFit="cover" />
                <LinearGradient colors={['rgba(0,0,0,0.3)', 'transparent']} style={styles.galleryTopGrad} />
                <LinearGradient colors={['transparent', 'rgba(0,0,0,0.5)']} style={styles.galleryBotGrad} />
              </View>
            ))}
          </ScrollView>

          {/* Header actions */}
          <View style={styles.galleryHeader}>
            <Pressable style={styles.galleryBtn} onPress={() => router.back()}>
              <MaterialCommunityIcons name="arrow-left" size={20} color="#FFF" />
            </Pressable>
            <View style={styles.galleryActions}>
              <Pressable style={styles.galleryBtn} onPress={() => setWishlist(!wishlist)}>
                <MaterialCommunityIcons name={wishlist ? 'heart' : 'heart-outline'} size={20} color={wishlist ? '#F43F5E' : '#FFF'} />
              </Pressable>
              <Pressable style={styles.galleryBtn}>
                <MaterialCommunityIcons name="share-variant" size={20} color="#FFF" />
              </Pressable>
            </View>
          </View>

          {/* Photo count */}
          <Pressable style={styles.photoCount}>
            <MaterialCommunityIcons name="image-multiple" size={14} color="#FFF" />
            <Text style={styles.photoCountText}>+269 Photos</Text>
          </Pressable>

          {/* Dots */}
          <View style={styles.galleryDots}>
            {hotel.images.map((_, i) => (
              <View key={i} style={[styles.dot, i === currentImage && styles.dotActive]} />
            ))}
          </View>
        </View>

        <View style={styles.content}>
          {/* Hotel Name & Basic Info */}
          {hotel.isLuxe && (
            <View style={styles.luxeBadge}>
              <Text style={styles.luxeText}>★ LUXE COLLECTION</Text>
            </View>
          )}
          <Text style={styles.hotelName}>{hotel.name}</Text>
          <View style={styles.starRow}>
            {Array.from({ length: hotel.starRating }).map((_, i) => (
              <MaterialCommunityIcons key={i} name="star" size={12} color="#F59E0B" />
            ))}
          </View>
          <View style={styles.locationRow}>
            <MaterialCommunityIcons name="map-marker" size={14} color={colors.textMuted} />
            <Text style={styles.locationText}>{hotel.location}, {hotel.area}, Hyderabad</Text>
          </View>

          {/* Myra.AI Price Alert */}
          <View style={styles.aiPriceAlert}>
            <LinearGradient colors={['#EEF2F7', '#F0F7FF']} style={styles.aiPriceInner}>
              <View style={styles.aiIconWrap}>
                <MaterialCommunityIcons name="creation" size={18} color="#405B84" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.aiPriceTitle}>Myra.AI Price Alert 🔔</Text>
                <Text style={styles.aiPriceText}>
                  Price is 9% lower than usual for this property. Best time to book!
                </Text>
              </View>
            </LinearGradient>
          </View>

          {/* About */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About This Property</Text>
            <Text style={styles.description}>{hotel.description}</Text>
            <Pressable style={styles.aiHighlightBtn}>
              <MaterialCommunityIcons name="creation" size={14} color="#405B84" />
              <Text style={styles.aiHighlightText}>What are property highlights?</Text>
              <MaterialCommunityIcons name="chevron-right" size={16} color="#405B84" />
            </Pressable>
          </View>

          {/* Ratings & Reviews */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ratings & Reviews</Text>
            <View style={styles.overallRating}>
              <View style={styles.bigRatingBox}>
                <Text style={styles.bigRatingNum}>{hotel.rating}</Text>
                <Text style={styles.bigRatingLabel}>{hotel.ratingLabel}</Text>
                <Text style={styles.bigRatingCount}>{hotel.reviewCount.toLocaleString('en-IN')} Ratings</Text>
              </View>
              <View style={styles.subScores}>
                {subScores.map((s) => (
                  <View key={s.label} style={styles.subScoreRow}>
                    <Text style={styles.subScoreLabel}>{s.label}</Text>
                    <View style={styles.subScoreBar}>
                      <View style={[styles.subScoreBarFill, { width: `${(s.score / 5) * 100}%` }]} />
                    </View>
                    <Text style={styles.subScoreNum}>{s.score}</Text>
                  </View>
                ))}
              </View>
            </View>

            <Text style={styles.last10Label}>Last 10 Customer Ratings</Text>
            <View style={styles.last10Row}>
              {LAST_10_RATINGS.map((r, i) => <RatingBox key={i} value={r} />)}
            </View>

            {/* AI Review Summary */}
            <View style={styles.aiReviewBox}>
              <View style={styles.aiReviewHeader}>
                <MaterialCommunityIcons name="creation" size={14} color="#405B84" />
                <Text style={styles.aiReviewTitle}>Myra.AI Review Summary</Text>
              </View>
              <View style={styles.aiReviewBullets}>
                {['Spotless bathrooms with premium toiletries', 'Warm & professional staff', 'Excellent breakfast buffet spread'].map((b, i) => (
                  <View key={i} style={styles.bulletRow}>
                    <View style={styles.bulletDot} />
                    <Text style={styles.bulletText}>{b}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Guest Reviews */}
            {GUEST_REVIEWS.map((rev, i) => (
              <View key={i} style={styles.reviewCard}>
                <View style={styles.reviewTop}>
                  <View style={[styles.reviewAvatar, { backgroundColor: ['#EEF2F7', '#FEF3C7', '#D1FAE5'][i] }]}>
                    <Text style={styles.reviewAvatarText}>{rev.name[0]}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.reviewerName}>{rev.name}</Text>
                    <View style={styles.reviewMeta}>
                      <View style={styles.reviewTagBadge}><Text style={styles.reviewTagText}>{rev.tag}</Text></View>
                      <Text style={styles.reviewDate}>{rev.date}</Text>
                    </View>
                  </View>
                  <View style={[styles.reviewRating, { backgroundColor: rev.rating >= 4 ? '#10B981' : '#F59E0B' }]}>
                    <Text style={styles.reviewRatingText}>{rev.rating} ★</Text>
                  </View>
                </View>
                <Text style={styles.reviewText}>{rev.text}</Text>
              </View>
            ))}
          </View>

          {/* Amenities */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Top Amenities</Text>
            <View style={styles.amenitiesGrid}>
              {hotel.amenities.slice(0, 6).map((a) => (
                <View key={a} style={styles.amenityChip}>
                  <MaterialCommunityIcons name="check-circle-outline" size={14} color={colors.success} />
                  <Text style={styles.amenityText}>{a}</Text>
                </View>
              ))}
            </View>
            <Pressable style={styles.seeAllBtn} onPress={() => setShowAmenities(true)}>
              <Text style={styles.seeAllText}>See All Amenities</Text>
              <MaterialCommunityIcons name="chevron-right" size={16} color="#405B84" />
            </Pressable>
          </View>

          {/* Location */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Location & Landmarks</Text>
            {LANDMARKS.map((l) => (
              <View key={l.name} style={styles.landmarkRow}>
                <View style={styles.landmarkIcon}>
                  <MaterialCommunityIcons name={l.icon as any} size={16} color="#405B84" />
                </View>
                <Text style={styles.landmarkName}>{l.name}</Text>
                <Text style={styles.landmarkDist}>{l.distance}</Text>
              </View>
            ))}
            <Pressable style={styles.mapBtn} onPress={() => setShowMap(true)}>
              <MaterialCommunityIcons name="map-outline" size={14} color="#405B84" />
              <Text style={styles.mapBtnText}>View on Map</Text>
            </Pressable>
          </View>

          {/* Rooms */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Rooms</Text>
            {hotel.rooms.map((room) => (
              <View key={room.id} style={styles.roomCard}>
                <Image source={{ uri: room.image }} style={styles.roomImage} contentFit="cover" />
                <View style={styles.roomBody}>
                  <Text style={styles.roomName}>{room.name}</Text>
                  <View style={styles.roomMetaRow}>
                    <MaterialCommunityIcons name="ruler-square" size={12} color={colors.textMuted} />
                    <Text style={styles.roomMeta}>{room.sizeSqFt} sq.ft</Text>
                    <MaterialCommunityIcons name="bed-queen" size={12} color={colors.textMuted} />
                    <Text style={styles.roomMeta}>{room.bedType}</Text>
                  </View>
                  <Text style={styles.roomPrice}>₹{room.price.toLocaleString('en-IN')}<Text style={styles.roomPriceNight}>/night</Text></Text>
                </View>
              </View>
            ))}
          </View>

          {/* Similar Stays */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Similar Stays</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12 }}>
              {SIMILAR_STAYS.map((s) => (
                <Pressable key={s.id} style={styles.similarCard} onPress={() => { useSuperAppStore.getState().setSelectedHotel(s); }}>
                  <Image source={{ uri: s.image }} style={styles.similarImage} contentFit="cover" />
                  <View style={styles.similarBody}>
                    <Text style={styles.similarName} numberOfLines={1}>{s.name}</Text>
                    <Text style={styles.similarPrice}>₹{s.price.toLocaleString('en-IN')}/night</Text>
                  </View>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </View>
      </ScrollView>

      {/* Sticky Bottom Bar */}
      <View style={styles.stickyBar}>
        <View>
          <Text style={styles.stickyPrice}>₹{hotel.price.toLocaleString('en-IN')}<Text style={styles.stickyPerNight}>/night</Text></Text>
          <Text style={styles.stickyTax}>+ ₹{hotel.taxes.toLocaleString('en-IN')} taxes</Text>
        </View>
        <Pressable style={styles.selectRoomBtn} onPress={() => router.push('/(hotel-module)/hotel-select-room')}>
          <Text style={styles.selectRoomText}>SELECT ROOM</Text>
        </Pressable>
      </View>

      {/* Amenities Modal */}
      <Modal visible={showAmenities} animationType="slide" presentationStyle="pageSheet">
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>All Amenities</Text>
            <Pressable onPress={() => setShowAmenities(false)}>
              <MaterialCommunityIcons name="close" size={24} color={colors.text} />
            </Pressable>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.amenityTabRow}>
            {AMENITY_CATEGORIES.map((cat) => (
              <Pressable
                key={cat.id}
                style={[styles.amenityTab, amenityTab === cat.id && styles.amenityTabActive]}
                onPress={() => setAmenityTab(cat.id)}
              >
                <Text style={[styles.amenityTabText, amenityTab === cat.id && styles.amenityTabTextActive]}>{cat.label}</Text>
              </Pressable>
            ))}
          </ScrollView>
          <ScrollView contentContainerStyle={{ padding: spacing.md, gap: 12 }}>
            {AMENITY_CATEGORIES.find((c) => c.id === amenityTab)?.items.map((item) => (
              <View key={item} style={styles.amenityListRow}>
                <MaterialCommunityIcons name="check-circle" size={18} color={colors.success} />
                <Text style={styles.amenityListText}>{item}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      </Modal>

      {/* Map Modal */}
      <Modal visible={showMap} animationType="slide" presentationStyle="pageSheet">
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Location</Text>
            <Pressable onPress={() => setShowMap(false)}>
              <MaterialCommunityIcons name="close" size={24} color={colors.text} />
            </Pressable>
          </View>
          <View style={styles.mapPlaceholder}>
            <MaterialCommunityIcons name="map" size={60} color="#D6DDE7" />
            <Text style={styles.mapPlaceholderText}>Map View</Text>
            <Text style={styles.mapPlaceholderSub}>{hotel.location}, Hyderabad</Text>
          </View>
          {LANDMARKS.map((l) => (
            <View key={l.name} style={styles.landmarkRow}>
              <View style={styles.landmarkIcon}>
                <MaterialCommunityIcons name={l.icon as any} size={16} color="#405B84" />
              </View>
              <Text style={styles.landmarkName}>{l.name}</Text>
              <Text style={styles.landmarkDist}>{l.distance}</Text>
            </View>
          ))}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },

  galleryWrap: { height: 260, position: 'relative' },
  galleryTopGrad: { position: 'absolute', top: 0, left: 0, right: 0, height: 80 },
  galleryBotGrad: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 80 },
  galleryHeader: { position: 'absolute', top: 50, left: spacing.md, right: spacing.md, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  galleryBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(0,0,0,0.4)', alignItems: 'center', justifyContent: 'center' },
  galleryActions: { flexDirection: 'row', gap: 8 },
  photoCount: { position: 'absolute', bottom: 12, right: 12, flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(0,0,0,0.55)', paddingHorizontal: 10, paddingVertical: 5, borderRadius: radius.pill },
  photoCountText: { color: '#FFF', fontSize: 11, fontWeight: '700' },
  galleryDots: { position: 'absolute', bottom: 12, left: 0, right: 0, flexDirection: 'row', justifyContent: 'center', gap: 4 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.5)' },
  dotActive: { backgroundColor: '#FFF', width: 12 },

  content: { padding: spacing.md, gap: spacing.lg },
  luxeBadge: { alignSelf: 'flex-start', backgroundColor: '#F59E0B', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  luxeText: { color: '#FFF', fontSize: 10, fontWeight: '900', letterSpacing: 0.5 },
  hotelName: { fontSize: typography.title, fontWeight: '900', color: colors.text, lineHeight: 30 },
  starRow: { flexDirection: 'row', gap: 2 },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  locationText: { fontSize: typography.caption, color: colors.textMuted },

  aiPriceAlert: { borderRadius: radius.md, overflow: 'hidden', borderWidth: 1, borderColor: '#D6DDE7' },
  aiPriceInner: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: spacing.md },
  aiIconWrap: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#EEF2F7', alignItems: 'center', justifyContent: 'center' },
  aiPriceTitle: { fontSize: typography.caption, fontWeight: '900', color: colors.text },
  aiPriceText: { fontSize: 11, color: colors.textMuted, marginTop: 2, lineHeight: 15 },

  section: { gap: spacing.sm },
  sectionTitle: { fontSize: typography.section, fontWeight: '900', color: colors.text },
  description: { fontSize: typography.caption, color: colors.textMuted, lineHeight: 20 },
  aiHighlightBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, padding: spacing.sm, borderRadius: radius.md, backgroundColor: '#EEF2F7', borderWidth: 1, borderColor: '#D6DDE7' },
  aiHighlightText: { flex: 1, fontSize: typography.caption, color: '#405B84', fontWeight: '700' },

  overallRating: { flexDirection: 'row', gap: spacing.md, padding: spacing.md, backgroundColor: '#FFF', borderRadius: radius.md, borderWidth: 1, borderColor: colors.line },
  bigRatingBox: { alignItems: 'center', justifyContent: 'center', width: 80 },
  bigRatingNum: { fontSize: 32, fontWeight: '900', color: '#10B981' },
  bigRatingLabel: { fontSize: 12, fontWeight: '700', color: colors.textMuted, marginTop: 2 },
  bigRatingCount: { fontSize: 10, color: colors.textLight, marginTop: 2, textAlign: 'center' },
  subScores: { flex: 1, gap: 8 },
  subScoreRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  subScoreLabel: { fontSize: 11, color: colors.textMuted, width: 90 },
  subScoreBar: { flex: 1, height: 4, backgroundColor: '#E7ECF2', borderRadius: 2, overflow: 'hidden' },
  subScoreBarFill: { height: '100%', backgroundColor: '#10B981', borderRadius: 2 },
  subScoreNum: { fontSize: 11, fontWeight: '700', color: colors.text, width: 24, textAlign: 'right' },

  last10Label: { fontSize: typography.caption, fontWeight: '700', color: colors.textMuted },
  last10Row: { flexDirection: 'row', gap: 6 },
  ratingBox: { width: 30, height: 30, borderRadius: 6, alignItems: 'center', justifyContent: 'center' },
  ratingBoxText: { color: '#FFF', fontSize: 12, fontWeight: '900' },

  aiReviewBox: { backgroundColor: '#EEF2F7', borderRadius: radius.md, padding: spacing.md, gap: 8 },
  aiReviewHeader: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  aiReviewTitle: { fontSize: typography.caption, fontWeight: '900', color: '#405B84' },
  aiReviewBullets: { gap: 6 },
  bulletRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  bulletDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: '#405B84', marginTop: 6 },
  bulletText: { fontSize: 12, color: colors.textMuted, flex: 1, lineHeight: 16 },

  reviewCard: { backgroundColor: '#FFF', borderRadius: radius.md, padding: spacing.md, gap: 8, borderWidth: 1, borderColor: colors.line },
  reviewTop: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  reviewAvatar: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  reviewAvatarText: { fontSize: 14, fontWeight: '900', color: colors.text },
  reviewerName: { fontSize: typography.caption, fontWeight: '900', color: colors.text },
  reviewMeta: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 2 },
  reviewTagBadge: { backgroundColor: '#EEF2F7', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  reviewTagText: { fontSize: 10, color: '#405B84', fontWeight: '700' },
  reviewDate: { fontSize: 10, color: colors.textLight },
  reviewRating: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  reviewRatingText: { color: '#FFF', fontSize: 11, fontWeight: '900' },
  reviewText: { fontSize: typography.caption, color: colors.textMuted, lineHeight: 18 },

  amenitiesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  amenityChip: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: '#F0FDF4', paddingHorizontal: 10, paddingVertical: 5, borderRadius: radius.pill, borderWidth: 1, borderColor: '#BBF7D0' },
  amenityText: { fontSize: 11, color: '#166534', fontWeight: '600' },
  seeAllBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, alignSelf: 'flex-start', marginTop: 4 },
  seeAllText: { fontSize: typography.caption, fontWeight: '800', color: '#405B84' },

  landmarkRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: colors.line },
  landmarkIcon: { width: 32, height: 32, borderRadius: 10, backgroundColor: '#EEF2F7', alignItems: 'center', justifyContent: 'center' },
  landmarkName: { flex: 1, fontSize: typography.caption, color: colors.text, fontWeight: '600' },
  landmarkDist: { fontSize: typography.caption, color: colors.textMuted, fontWeight: '700' },
  mapBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4, alignSelf: 'flex-start' },
  mapBtnText: { fontSize: typography.caption, fontWeight: '800', color: '#405B84' },

  roomCard: { backgroundColor: '#FFF', borderRadius: radius.md, overflow: 'hidden', borderWidth: 1, borderColor: colors.line },
  roomImage: { width: '100%', height: 120 },
  roomBody: { padding: spacing.md, gap: 6 },
  roomName: { fontSize: typography.body, fontWeight: '900', color: colors.text },
  roomMetaRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  roomMeta: { fontSize: 11, color: colors.textMuted },
  roomPrice: { fontSize: 18, fontWeight: '900', color: colors.text, marginTop: 4 },
  roomPriceNight: { fontSize: 12, fontWeight: '400', color: colors.textMuted },

  similarCard: { width: 160, backgroundColor: '#FFF', borderRadius: radius.md, overflow: 'hidden', borderWidth: 1, borderColor: colors.line },
  similarImage: { width: 160, height: 100 },
  similarBody: { padding: 8 },
  similarName: { fontSize: 12, fontWeight: '800', color: colors.text },
  similarPrice: { fontSize: 11, color: colors.textMuted, marginTop: 2 },

  stickyBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: '#FFF', padding: spacing.md, paddingBottom: 28,
    borderTopWidth: 1, borderTopColor: colors.line,
    shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 10, shadowOffset: { width: 0, height: -4 }, elevation: 8,
  },
  stickyPrice: { fontSize: 22, fontWeight: '900', color: colors.text },
  stickyPerNight: { fontSize: 12, fontWeight: '400', color: colors.textMuted },
  stickyTax: { fontSize: 11, color: colors.textMuted, marginTop: 2 },
  selectRoomBtn: { backgroundColor: '#172B4D', paddingHorizontal: 24, paddingVertical: 14, borderRadius: radius.pill },
  selectRoomText: { color: '#FFF', fontSize: typography.body, fontWeight: '900', letterSpacing: 0.5 },

  modalContainer: { flex: 1, backgroundColor: '#FFF' },
  modalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: spacing.md, paddingTop: 20, borderBottomWidth: 1, borderBottomColor: colors.line },
  modalTitle: { fontSize: typography.section, fontWeight: '900', color: colors.text },
  amenityTabRow: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm, gap: 8 },
  amenityTab: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: radius.pill, borderWidth: 1, borderColor: colors.line },
  amenityTabActive: { backgroundColor: '#172B4D', borderColor: '#172B4D' },
  amenityTabText: { fontSize: 12, fontWeight: '700', color: colors.text },
  amenityTabTextActive: { color: '#FFF' },
  amenityListRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.line },
  amenityListText: { fontSize: typography.body, color: colors.text },
  mapPlaceholder: { height: 200, backgroundColor: '#EEF2F7', alignItems: 'center', justifyContent: 'center', margin: spacing.md, borderRadius: radius.lg, gap: 8 },
  mapPlaceholderText: { fontSize: typography.section, fontWeight: '900', color: colors.textMuted },
  mapPlaceholderSub: { fontSize: typography.caption, color: colors.textLight },
});
