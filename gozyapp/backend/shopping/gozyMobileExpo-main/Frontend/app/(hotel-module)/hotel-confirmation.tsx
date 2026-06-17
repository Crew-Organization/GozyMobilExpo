import {
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Redirect, router } from 'expo-router';

import { useSuperAppStore } from '@/src/store/super-app-store';
import { colors, radius, spacing, typography } from '@/src/theme/tokens';

const NEXT_STEPS = [
  { icon: 'email-check-outline', title: 'Confirmation email sent', sub: 'Check your inbox for booking voucher' },
  { icon: 'clock-check-outline', title: 'Check-in at 12:00 PM', sub: 'Present booking ID and valid photo ID' },
  { icon: 'wifi', title: 'Free WiFi on arrival', sub: 'Ask reception for the WiFi password' },
  { icon: 'car-front', title: 'Airport transfer available', sub: 'Contact concierge 24h before arrival' },
];

export default function HotelConfirmationScreen() {
  const { hotelConfirmation, selectedHotel, selectedRoom, hotelTravelers } = useSuperAppStore();

  if (!hotelConfirmation || !selectedHotel || !selectedRoom) {
    return <Redirect href="/(hotel-module)/hotel-results" />;
  }

  const conf = hotelConfirmation;
  const hotel = selectedHotel;
  const room = selectedRoom;
  const guestName = `${hotelTravelers[0]?.firstName ?? ''} ${hotelTravelers[0]?.lastName ?? ''}`.trim() || 'Guest';

  const handleShare = async () => {
    try {
      await Share.share({
        message: `✅ Hotel booking confirmed!\n\n🏨 ${hotel.name}\n📋 Booking ID: ${conf.bookingId}\n📅 Check-in: ${conf.checkIn}\n📅 Check-out: ${conf.checkOut}\n🛏️ ${room.name}\n\nBooked via Gozy 🚀`,
      });
    } catch {}
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Success Hero */}
        <LinearGradient colors={['#172B4D', '#29446D', '#405B84']} style={styles.heroGrad}>
          <View style={styles.heroContent}>
            <View style={styles.checkCircle}>
              <MaterialCommunityIcons name="check-bold" size={32} color="#FFF" />
            </View>
            <Text style={styles.successTitle}>Booking Confirmed!</Text>
            <Text style={styles.successSub}>
              Your stay at {hotel.name} is all set, {guestName} 🎉
            </Text>
            <View style={styles.bookingIdBox}>
              <Text style={styles.bookingIdLabel}>BOOKING ID</Text>
              <Text style={styles.bookingId}>{conf.bookingId}</Text>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.content}>
          {/* Hotel Card */}
          <View style={styles.hotelCard}>
            <Image source={{ uri: hotel.image }} style={styles.hotelThumb} contentFit="cover" />
            <View style={styles.hotelCardBody}>
              <Text style={styles.hotelName}>{hotel.name}</Text>
              <Text style={styles.hotelLocation}>{hotel.location}, Hyderabad</Text>
              <View style={styles.ratingBadge}>
                <Text style={styles.ratingText}>{hotel.rating} ★ {hotel.ratingLabel}</Text>
              </View>
            </View>
          </View>

          {/* Stay Summary */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Stay Details</Text>
            <View style={styles.datesRow}>
              <View style={styles.dateBlock}>
                <Text style={styles.dateTopLabel}>CHECK-IN</Text>
                <Text style={styles.dateVal}>{conf.checkIn}</Text>
                <Text style={styles.dateTime}>12:00 PM</Text>
              </View>
              <View style={styles.durationBlock}>
                <MaterialCommunityIcons name="weather-night" size={16} color="#405B84" />
                <Text style={styles.durationText}>1 Night</Text>
              </View>
              <View style={styles.dateBlock}>
                <Text style={styles.dateTopLabel}>CHECK-OUT</Text>
                <Text style={styles.dateVal}>{conf.checkOut}</Text>
                <Text style={styles.dateTime}>11:00 AM</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.detailRow}>
              <MaterialCommunityIcons name="bed-queen" size={14} color={colors.textMuted} />
              <Text style={styles.detailText}>{room.name} · {room.bedType}</Text>
            </View>
            <View style={styles.detailRow}>
              <MaterialCommunityIcons name="account-group" size={14} color={colors.textMuted} />
              <Text style={styles.detailText}>{conf.guests} Guest(s) · {conf.rooms} Room</Text>
            </View>
            {conf.specialRequests && (
              <View style={styles.detailRow}>
                <MaterialCommunityIcons name="note-text-outline" size={14} color={colors.textMuted} />
                <Text style={styles.detailText}>{conf.specialRequests}</Text>
              </View>
            )}
          </View>

          {/* Payment Summary */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Payment Summary</Text>
            <View style={styles.payRow}>
              <Text style={styles.payLabel}>Amount Paid</Text>
              <Text style={styles.payAmount}>₹{conf.amountPaid.toLocaleString('en-IN')}</Text>
            </View>
            <View style={styles.payRow}>
              <Text style={styles.payLabel}>Payment Mode</Text>
              <Text style={styles.payValue}>{conf.paymentMethod.toUpperCase()}</Text>
            </View>
            {conf.savings > 0 && (
              <View style={[styles.payRow, styles.savingsRow]}>
                <Text style={styles.savingsLabel}>🎉 You saved</Text>
                <Text style={styles.savingsAmount}>₹{conf.savings.toLocaleString('en-IN')}</Text>
              </View>
            )}
          </View>

          {/* What's Next */}
          <Text style={styles.nextTitle}>{"What's Next?"}</Text>
          {NEXT_STEPS.map((step, i) => (
            <View key={i} style={styles.nextStep}>
              <View style={styles.nextIconWrap}>
                <MaterialCommunityIcons name={step.icon as any} size={18} color="#405B84" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.nextStepTitle}>{step.title}</Text>
                <Text style={styles.nextStepSub}>{step.sub}</Text>
              </View>
            </View>
          ))}

          {/* Myra.AI suggestion */}
          <View style={styles.aiSuggest}>
            <LinearGradient colors={['#EEF2F7', '#F0F7FF']} style={styles.aiSuggestInner}>
              <View style={styles.aiIconWrap}>
                <MaterialCommunityIcons name="creation" size={18} color="#405B84" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.aiSuggestTitle}>Myra.AI Suggestion 🤖</Text>
                <Text style={styles.aiSuggestText}>
                  {`For your upcoming stay at ${hotel.name}, I would suggest booking a Charminar heritage tour on Day 1 and a Ramoji Film City visit on Day 2!`}
                </Text>
              </View>
            </LinearGradient>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionRow}>
            <Pressable style={styles.actionSecondary} onPress={handleShare}>
              <MaterialCommunityIcons name="share-variant" size={16} color="#172B4D" />
              <Text style={styles.actionSecondaryText}>Share</Text>
            </Pressable>
            <Pressable style={styles.actionSecondary}>
              <MaterialCommunityIcons name="download" size={16} color="#172B4D" />
              <Text style={styles.actionSecondaryText}>Download Voucher</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
        <Pressable style={styles.viewTripsBtn} onPress={() => router.push('/profile')}>
          <Text style={styles.viewTripsBtnText}>VIEW MY TRIPS</Text>
        </Pressable>
        <Pressable style={styles.backHomeBtn} onPress={() => router.replace('/')}>
          <Text style={styles.backHomeBtnText}>GO TO HOME</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },

  heroGrad: { paddingTop: 60, paddingBottom: 40, paddingHorizontal: spacing.md },
  heroContent: { alignItems: 'center', gap: spacing.md },
  checkCircle: { width: 72, height: 72, borderRadius: 36, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: 'rgba(255,255,255,0.5)' },
  successTitle: { fontSize: typography.title, fontWeight: '900', color: '#FFF', textAlign: 'center' },
  successSub: { fontSize: typography.body, color: 'rgba(255,255,255,0.82)', textAlign: 'center', lineHeight: 22 },
  bookingIdBox: { backgroundColor: 'rgba(255,255,255,0.15)', paddingHorizontal: 24, paddingVertical: 12, borderRadius: radius.md, alignItems: 'center' },
  bookingIdLabel: { fontSize: 10, color: 'rgba(255,255,255,0.65)', fontWeight: '700', letterSpacing: 1.5, textTransform: 'uppercase' },
  bookingId: { fontSize: 22, fontWeight: '900', color: '#FFF', letterSpacing: 2, marginTop: 4 },

  content: { padding: spacing.md, gap: 16 },

  hotelCard: { flexDirection: 'row', gap: 12, backgroundColor: '#FFF', borderRadius: radius.md, overflow: 'hidden', borderWidth: 1, borderColor: colors.line },
  hotelThumb: { width: 100, height: 90 },
  hotelCardBody: { flex: 1, padding: 10, gap: 4 },
  hotelName: { fontSize: typography.body, fontWeight: '900', color: colors.text },
  hotelLocation: { fontSize: typography.caption, color: colors.textMuted },
  ratingBadge: { alignSelf: 'flex-start', backgroundColor: '#10B981', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 5, marginTop: 4 },
  ratingText: { color: '#FFF', fontSize: 11, fontWeight: '900' },

  card: { backgroundColor: '#FFF', borderRadius: radius.lg, padding: spacing.md, gap: 10, borderWidth: 1, borderColor: colors.line },
  cardTitle: { fontSize: typography.body, fontWeight: '900', color: colors.text },
  datesRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  dateBlock: { alignItems: 'center' },
  dateTopLabel: { fontSize: 10, color: colors.textMuted, fontWeight: '700', letterSpacing: 0.5, textTransform: 'uppercase' },
  dateVal: { fontSize: 18, fontWeight: '900', color: colors.text, marginTop: 4 },
  dateTime: { fontSize: 11, color: colors.textMuted, marginTop: 2 },
  durationBlock: { alignItems: 'center', gap: 4 },
  durationText: { fontSize: 12, color: '#405B84', fontWeight: '700' },
  divider: { height: 1, backgroundColor: colors.line },
  detailRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  detailText: { fontSize: typography.caption, color: colors.textMuted },

  payRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 3 },
  payLabel: { fontSize: typography.caption, color: colors.textMuted },
  payAmount: { fontSize: typography.section, fontWeight: '900', color: colors.text },
  payValue: { fontSize: typography.caption, fontWeight: '700', color: colors.text },
  savingsRow: { backgroundColor: '#F0FDF4', padding: 8, borderRadius: radius.sm, marginTop: 4 },
  savingsLabel: { fontSize: typography.caption, color: colors.success, fontWeight: '700' },
  savingsAmount: { fontSize: typography.caption, fontWeight: '900', color: colors.success },

  nextTitle: { fontSize: typography.section, fontWeight: '900', color: colors.text },
  nextStep: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, padding: spacing.md, backgroundColor: '#FFF', borderRadius: radius.md, borderWidth: 1, borderColor: colors.line },
  nextIconWrap: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#EEF2F7', alignItems: 'center', justifyContent: 'center' },
  nextStepTitle: { fontSize: typography.caption, fontWeight: '900', color: colors.text },
  nextStepSub: { fontSize: 11, color: colors.textMuted, marginTop: 2, lineHeight: 15 },

  aiSuggest: { borderRadius: radius.md, overflow: 'hidden', borderWidth: 1, borderColor: '#D6DDE7' },
  aiSuggestInner: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, padding: spacing.md },
  aiIconWrap: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#EEF2F7', alignItems: 'center', justifyContent: 'center', marginTop: 2 },
  aiSuggestTitle: { fontSize: typography.caption, fontWeight: '900', color: '#405B84' },
  aiSuggestText: { fontSize: 11, color: colors.textMuted, marginTop: 4, lineHeight: 16 },

  actionRow: { flexDirection: 'row', gap: 12 },
  actionSecondary: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    backgroundColor: '#EEF2F7', borderRadius: radius.pill, paddingVertical: 12, borderWidth: 1, borderColor: '#D6DDE7',
  },
  actionSecondaryText: { fontSize: typography.caption, fontWeight: '800', color: '#172B4D' },

  bottomBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    flexDirection: 'row', gap: 12, backgroundColor: '#FFF',
    padding: spacing.md, paddingBottom: 28,
    borderTopWidth: 1, borderTopColor: colors.line,
    shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 10, shadowOffset: { width: 0, height: -4 }, elevation: 8,
  },
  viewTripsBtn: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    borderRadius: radius.pill, paddingVertical: 14,
    borderWidth: 2, borderColor: '#172B4D',
  },
  viewTripsBtnText: { color: '#172B4D', fontSize: typography.caption, fontWeight: '900', letterSpacing: 0.5 },
  backHomeBtn: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#172B4D', borderRadius: radius.pill, paddingVertical: 14,
  },
  backHomeBtnText: { color: '#FFF', fontSize: typography.caption, fontWeight: '900', letterSpacing: 0.5 },
});
