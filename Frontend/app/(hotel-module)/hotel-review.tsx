import { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Redirect, router } from 'expo-router';

import { useSuperAppStore } from '@/src/store/super-app-store';
import { coupons } from '@/src/lib/hotel-data';
import { colors, radius, spacing, typography } from '@/src/theme/tokens';

const TRIP_SECURE_COST_PER_PERSON_PER_NIGHT = 29;

export default function HotelReviewScreen() {
  const {
    selectedHotel,
    selectedRoom,
    hotelTravelers,
    hotelContact,
    hotelTripSecure,
    hotelCouponCode,
    updateHotelTraveler,
    setHotelContactField,
    toggleHotelTripSecure,
    setHotelCouponCode,
    hotelSearch,
  } = useSuperAppStore();

  const [expandCoupons, setExpandCoupons] = useState(false);
  const [gstExpanded, setGstExpanded] = useState(false);

  if (!selectedHotel || !selectedRoom) return <Redirect href="/(hotel-module)/hotel-results" />;

  const hotel = selectedHotel;
  const room = selectedRoom;

  const appliedCoupon = coupons.find((c) => c.code === hotelCouponCode);
  const discount = appliedCoupon?.amount ?? 0;
  const insuranceCost = hotelTripSecure ? TRIP_SECURE_COST_PER_PERSON_PER_NIGHT * hotelSearch.guests : 0;
  const roomTotal = room.price + hotel.taxes;
  const total = roomTotal + insuranceCost - discount;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <MaterialCommunityIcons name="arrow-left" size={22} color={colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Review Booking</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Booking Summary */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Stay Details</Text>
          <View style={styles.stayRow}>
            <View style={styles.dateBlock}>
              <Text style={styles.stayDateLabel}>CHECK-IN</Text>
              <Text style={styles.stayDate}>12 Apr</Text>
              <Text style={styles.stayDay}>Saturday</Text>
            </View>
            <View style={styles.nightBlock}>
              <MaterialCommunityIcons name="weather-night" size={16} color="#405B84" />
              <Text style={styles.nightText}>1 Night</Text>
            </View>
            <View style={styles.dateBlock}>
              <Text style={styles.stayDateLabel}>CHECK-OUT</Text>
              <Text style={styles.stayDate}>13 Apr</Text>
              <Text style={styles.stayDay}>Sunday</Text>
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.stayInfoRow}>
            <MaterialCommunityIcons name="office-building" size={14} color={colors.textMuted} />
            <Text style={styles.stayInfoText} numberOfLines={1}>{hotel.name}</Text>
          </View>
          <View style={styles.stayInfoRow}>
            <MaterialCommunityIcons name="bed-queen" size={14} color={colors.textMuted} />
            <Text style={styles.stayInfoText}>{room.name} · {room.sizeSqFt} sq.ft</Text>
          </View>
          <View style={styles.stayInfoRow}>
            <MaterialCommunityIcons name="account-group" size={14} color={colors.textMuted} />
            <Text style={styles.stayInfoText}>{hotelSearch.guests} Guest · {hotelSearch.rooms} Room</Text>
          </View>
        </View>

        {/* Traveller Details */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Primary Guest</Text>
          {hotelTravelers.slice(0, 1).map((traveler, idx) => (
            <View key={idx} style={styles.travelerForm}>
              {/* Title Picker */}
              <View style={styles.titleRow}>
                {(['Mr', 'Mrs', 'Ms'] as const).map((t) => (
                  <Pressable
                    key={t}
                    style={[styles.titleChip, traveler.title === t && styles.titleChipActive]}
                    onPress={() => updateHotelTraveler(idx, 'title', t)}
                  >
                    <Text style={[styles.titleChipText, traveler.title === t && styles.titleChipTextActive]}>{t}</Text>
                  </Pressable>
                ))}
              </View>

              <View style={styles.nameRow}>
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  placeholder="First Name"
                  value={traveler.firstName}
                  onChangeText={(v) => updateHotelTraveler(idx, 'firstName', v)}
                  placeholderTextColor={colors.textLight}
                />
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  placeholder="Last Name"
                  value={traveler.lastName}
                  onChangeText={(v) => updateHotelTraveler(idx, 'lastName', v)}
                  placeholderTextColor={colors.textLight}
                />
              </View>

              <TextInput
                style={styles.input}
                placeholder="Email Address"
                keyboardType="email-address"
                value={hotelContact.email}
                onChangeText={(v) => setHotelContactField('email', v)}
                placeholderTextColor={colors.textLight}
              />
              <TextInput
                style={styles.input}
                placeholder="Mobile Number"
                keyboardType="phone-pad"
                value={hotelContact.phone}
                onChangeText={(v) => setHotelContactField('phone', v)}
                placeholderTextColor={colors.textLight}
              />
            </View>
          ))}

          {/* GST */}
          <Pressable style={styles.gstToggle} onPress={() => setGstExpanded(!gstExpanded)}>
            <Text style={styles.gstToggleText}>Add GST details (Optional)</Text>
            <MaterialCommunityIcons name={gstExpanded ? 'chevron-up' : 'chevron-down'} size={18} color="#405B84" />
          </Pressable>
          {gstExpanded && (
            <TextInput
              style={[styles.input, { marginTop: 8 }]}
              placeholder="Enter GST Number"
              placeholderTextColor={colors.textLight}
            />
          )}
        </View>

        {/* Coupons */}
        <View style={styles.card}>
          <Pressable style={styles.couponHeader} onPress={() => setExpandCoupons(!expandCoupons)}>
            <MaterialCommunityIcons name="ticket-percent-outline" size={18} color="#405B84" />
            <Text style={styles.couponHeaderText}>Apply Coupon</Text>
            {appliedCoupon && (
              <View style={styles.couponAppliedBadge}>
                <Text style={styles.couponAppliedText}>-₹{discount}</Text>
              </View>
            )}
            <MaterialCommunityIcons name={expandCoupons ? 'chevron-up' : 'chevron-down'} size={18} color="#405B84" />
          </Pressable>

          {expandCoupons && (
            <View style={styles.couponsListWrap}>
              {coupons.map((coupon) => {
                const active = hotelCouponCode === coupon.code;
                return (
                  <Pressable
                    key={coupon.code}
                    style={[styles.couponCard, active && styles.couponCardActive]}
                    onPress={() => setHotelCouponCode(active ? null : coupon.code)}
                  >
                    <View style={styles.couponLeft}>
                      <Text style={styles.couponCode}>{coupon.code}</Text>
                      <Text style={styles.couponDesc}>{coupon.description}</Text>
                    </View>
                    <View style={[styles.couponRadio, active && styles.couponRadioActive]}>
                      {active && <View style={styles.couponRadioInner} />}
                    </View>
                  </Pressable>
                );
              })}
            </View>
          )}
        </View>

        {/* Trip Secure */}
        <View style={styles.card}>
          <View style={styles.tripSecureHeader}>
            <View style={styles.tripSecureIconWrap}>
              <MaterialCommunityIcons name="shield-check" size={20} color="#10B981" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.tripSecureTitle}>Trip Secure Protection</Text>
              <Text style={styles.tripSecureSub}>Coverage for trip cancellation, medical emergencies & more</Text>
            </View>
            <Pressable
              style={[styles.tripSecureToggle, hotelTripSecure && styles.tripSecureToggleOn]}
              onPress={toggleHotelTripSecure}
            >
              <View style={[styles.tripSecureKnob, hotelTripSecure && styles.tripSecureKnobOn]} />
            </Pressable>
          </View>
          {hotelTripSecure && (
            <View style={styles.tripSecureCostRow}>
              <MaterialCommunityIcons name="check-circle" size={12} color={colors.success} />
              <Text style={styles.tripSecureCostText}>
                +₹{insuranceCost} insurance for {hotelSearch.guests} guest(s) · 1 night
              </Text>
            </View>
          )}
        </View>

        {/* Price Summary */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Price Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Room charges (1 night)</Text>
            <Text style={styles.summaryValue}>₹{room.price.toLocaleString('en-IN')}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Taxes & fees</Text>
            <Text style={styles.summaryValue}>₹{hotel.taxes.toLocaleString('en-IN')}</Text>
          </View>
          {hotelTripSecure && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Trip Secure</Text>
              <Text style={styles.summaryValue}>₹{insuranceCost}</Text>
            </View>
          )}
          {discount > 0 && (
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: colors.success }]}>Coupon ({hotelCouponCode})</Text>
              <Text style={[styles.summaryValue, { color: colors.success }]}>-₹{discount}</Text>
            </View>
          )}
          <View style={[styles.summaryRow, styles.summaryTotal]}>
            <Text style={styles.summaryTotalLabel}>Total Amount</Text>
            <Text style={styles.summaryTotalValue}>₹{total.toLocaleString('en-IN')}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Sticky Bottom */}
      <View style={styles.stickyBar}>
        <View>
          <Text style={styles.stickyLabel}>Pay now</Text>
          <Text style={styles.stickyTotal}>₹{total.toLocaleString('en-IN')}</Text>
          <Text style={styles.stickyTax}>incl. of taxes{discount > 0 ? ' & discount' : ''}</Text>
        </View>
        <Pressable style={styles.proceedBtn} onPress={() => router.push('/(hotel-module)/hotel-payment')}>
          <Text style={styles.proceedBtnText}>PROCEED</Text>
          <MaterialCommunityIcons name="arrow-right" size={16} color="#FFF" />
        </Pressable>
      </View>
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

  scrollContent: { padding: spacing.md, gap: 16, paddingBottom: 120 },

  card: { backgroundColor: '#FFF', borderRadius: radius.lg, padding: spacing.md, gap: 12, borderWidth: 1, borderColor: colors.line },
  cardTitle: { fontSize: typography.body, fontWeight: '900', color: colors.text },

  stayRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  dateBlock: { alignItems: 'center' },
  stayDateLabel: { fontSize: 10, color: colors.textMuted, fontWeight: '700', letterSpacing: 0.5, textTransform: 'uppercase' },
  stayDate: { fontSize: 22, fontWeight: '900', color: colors.text, marginTop: 4 },
  stayDay: { fontSize: 11, color: colors.textMuted, marginTop: 2 },
  nightBlock: { alignItems: 'center', gap: 4 },
  nightText: { fontSize: 12, color: '#405B84', fontWeight: '700' },
  divider: { height: 1, backgroundColor: colors.line },
  stayInfoRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  stayInfoText: { fontSize: typography.caption, color: colors.textMuted, flex: 1 },

  travelerForm: { gap: 10 },
  titleRow: { flexDirection: 'row', gap: 8 },
  titleChip: { paddingHorizontal: 16, paddingVertical: 7, borderRadius: radius.pill, borderWidth: 1, borderColor: colors.line },
  titleChipActive: { backgroundColor: '#172B4D', borderColor: '#172B4D' },
  titleChipText: { fontSize: typography.caption, fontWeight: '700', color: colors.text },
  titleChipTextActive: { color: '#FFF' },
  nameRow: { flexDirection: 'row', gap: 10 },
  input: {
    backgroundColor: '#F8FAFC', borderRadius: radius.md, borderWidth: 1, borderColor: colors.line,
    paddingHorizontal: spacing.md, paddingVertical: 12, fontSize: typography.caption, color: colors.text,
  },
  gstToggle: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  gstToggleText: { fontSize: typography.caption, fontWeight: '700', color: '#405B84' },

  couponHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  couponHeaderText: { flex: 1, fontSize: typography.body, fontWeight: '800', color: colors.text },
  couponAppliedBadge: { backgroundColor: '#D1FAE5', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  couponAppliedText: { fontSize: 11, color: '#166534', fontWeight: '900' },
  couponsListWrap: { gap: 10 },
  couponCard: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: spacing.md, borderRadius: radius.md, borderWidth: 1.5, borderColor: colors.line, borderStyle: 'dashed' },
  couponCardActive: { borderColor: '#172B4D', backgroundColor: '#EEF2F7' },
  couponLeft: { flex: 1, gap: 4 },
  couponCode: { fontSize: typography.body, fontWeight: '900', color: '#172B4D' },
  couponDesc: { fontSize: 11, color: colors.textMuted, lineHeight: 15 },
  couponRadio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: colors.lineStrong, alignItems: 'center', justifyContent: 'center' },
  couponRadioActive: { borderColor: '#172B4D' },
  couponRadioInner: { width: 9, height: 9, borderRadius: 5, backgroundColor: '#172B4D' },

  tripSecureHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  tripSecureIconWrap: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#D1FAE5', alignItems: 'center', justifyContent: 'center' },
  tripSecureTitle: { fontSize: typography.caption, fontWeight: '900', color: colors.text },
  tripSecureSub: { fontSize: 11, color: colors.textMuted, marginTop: 2, lineHeight: 15 },
  tripSecureToggle: { width: 46, height: 26, borderRadius: 13, backgroundColor: colors.lineStrong, justifyContent: 'center', paddingHorizontal: 3 },
  tripSecureToggleOn: { backgroundColor: '#10B981' },
  tripSecureKnob: { width: 20, height: 20, borderRadius: 10, backgroundColor: '#FFF', shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 4, elevation: 2 },
  tripSecureKnobOn: { alignSelf: 'flex-end' },
  tripSecureCostRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  tripSecureCostText: { fontSize: 11, color: colors.success, fontWeight: '700' },

  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
  summaryLabel: { fontSize: typography.caption, color: colors.textMuted },
  summaryValue: { fontSize: typography.caption, color: colors.text, fontWeight: '700' },
  summaryTotal: { borderTopWidth: 1, borderTopColor: colors.line, paddingTop: 10, marginTop: 4 },
  summaryTotalLabel: { fontSize: typography.body, fontWeight: '900', color: colors.text },
  summaryTotalValue: { fontSize: typography.section, fontWeight: '900', color: colors.text },

  stickyBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: '#FFF', padding: spacing.md, paddingBottom: 28,
    borderTopWidth: 1, borderTopColor: colors.line,
    shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 10, shadowOffset: { width: 0, height: -4 }, elevation: 8,
  },
  stickyLabel: { fontSize: 11, color: colors.textMuted, fontWeight: '600' },
  stickyTotal: { fontSize: 22, fontWeight: '900', color: colors.text },
  stickyTax: { fontSize: 10, color: colors.textMuted, marginTop: 2 },
  proceedBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: '#172B4D', paddingHorizontal: 24, paddingVertical: 14, borderRadius: radius.pill,
  },
  proceedBtnText: { color: '#FFF', fontSize: typography.body, fontWeight: '900', letterSpacing: 0.5 },
});
