import { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Redirect, router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

import { useSuperAppStore } from '@/src/store/super-app-store';
import { useApp } from '@/src/context/app-context';
import { coupons } from '@/src/lib/hotel-data';
import { colors, radius, spacing, typography } from '@/src/theme/tokens';
import type { HotelPaymentMethod } from '@/src/types';

const PAYMENT_METHODS: {
  id: HotelPaymentMethod;
  label: string;
  subtitle: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  badge?: string;
}[] = [
  { id: 'wallet', label: 'Gozy Wallet', subtitle: 'Instant checkout, no redirects', icon: 'wallet-outline', badge: 'FASTEST' },
  { id: 'upi', label: 'UPI / BHIM', subtitle: 'Pay via PhonePe, GPay, Paytm or any UPI app', icon: 'cellphone-wireless' },
  { id: 'card', label: 'Credit / Debit Card', subtitle: 'Visa, Mastercard, RuPay & more', icon: 'credit-card-outline' },
  { id: 'netbanking', label: 'Net Banking', subtitle: 'All major banks supported', icon: 'bank-outline' },
  { id: 'emi', label: 'EMI', subtitle: 'No-cost EMI via HDFC, ICICI, Axis & more', icon: 'cash-multiple' },
];

export default function HotelPaymentScreen() {
  const {
    selectedHotel,
    selectedRoom,
    hotelTripSecure,
    hotelCouponCode,
    hotelSearch,
    hotelTravelers,
    hotelContact,
    hotelPaymentMethod,
    setHotelPaymentMethod,
    setHotelConfirmation,
  } = useSuperAppStore();

  const { createHotelBooking, walletBalance } = useApp();
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!selectedHotel || !selectedRoom) return <Redirect href="/(hotel-module)/hotel-results" />;

  const hotel = selectedHotel;
  const room = selectedRoom;

  const appliedCoupon = coupons.find((c) => c.code === hotelCouponCode);
  const discount = appliedCoupon?.amount ?? 0;
  const insuranceCost = hotelTripSecure ? 29 * hotelSearch.guests : 0;
  const total = room.price + hotel.taxes + insuranceCost - discount;
  const walletInsufficient = hotelPaymentMethod === 'wallet' && walletBalance < total;

  const confirmBooking = async () => {
    if (walletInsufficient) return;
    setIsSubmitting(true);
    try {
      const confirmation = await createHotelBooking({
        hotelId: hotel.id,
        roomId: room.id,
        checkIn: hotelSearch.checkInDate,
        checkOut: hotelSearch.checkOutDate,
        guests: hotelSearch.guests,
        rooms: hotelSearch.rooms,
        travelerInfo: hotelTravelers,
        contactInfo: hotelContact,
        couponCode: hotelCouponCode,
        tripSecure: hotelTripSecure,
        paymentMethod: hotelPaymentMethod,
      });
      setHotelConfirmation(confirmation);
      router.replace('/(hotel-module)/hotel-confirmation');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <MaterialCommunityIcons name="arrow-left" size={22} color={colors.text} />
        </Pressable>
        <View>
          <Text style={styles.headerTitle}>Payment</Text>
          <Text style={styles.headerSub}>Complete your booking</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Booking Strip */}
        <LinearGradient colors={['#172B4D', '#29446D']} style={styles.bookingStrip}>
          <View style={styles.stripLeft}>
            <Text style={styles.stripLabel}>{"You're booking"}</Text>
            <Text style={styles.stripName} numberOfLines={1}>{hotel.name}</Text>
            <Text style={styles.stripRoom}>{room.name} · 1 Night · {hotelSearch.guests} Guest</Text>
          </View>
          <View style={styles.stripRight}>
            <Text style={styles.stripTotal}>₹{total.toLocaleString('en-IN')}</Text>
            <Text style={styles.stripTax}>incl. taxes</Text>
          </View>
        </LinearGradient>

        {/* Price Breakup */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Price Breakup</Text>
          <View style={styles.breakupRow}>
            <Text style={styles.breakupLabel}>Room (1 night)</Text>
            <Text style={styles.breakupValue}>₹{room.price.toLocaleString('en-IN')}</Text>
          </View>
          <View style={styles.breakupRow}>
            <Text style={styles.breakupLabel}>Taxes & Fees</Text>
            <Text style={styles.breakupValue}>₹{hotel.taxes.toLocaleString('en-IN')}</Text>
          </View>
          {hotelTripSecure && (
            <View style={styles.breakupRow}>
              <Text style={styles.breakupLabel}>Trip Secure</Text>
              <Text style={styles.breakupValue}>₹{insuranceCost}</Text>
            </View>
          )}
          {discount > 0 && (
            <View style={styles.breakupRow}>
              <Text style={[styles.breakupLabel, { color: colors.success }]}>Coupon ({hotelCouponCode})</Text>
              <Text style={[styles.breakupValue, { color: colors.success }]}>-₹{discount}</Text>
            </View>
          )}
          <View style={[styles.breakupRow, styles.breakupTotal]}>
            <Text style={styles.breakupTotalLabel}>Total</Text>
            <Text style={styles.breakupTotalValue}>₹{total.toLocaleString('en-IN')}</Text>
          </View>
        </View>

        {/* Payment Methods */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Choose Payment</Text>
          {PAYMENT_METHODS.map((method) => {
            const active = hotelPaymentMethod === method.id;
            const isWallet = method.id === 'wallet';
            return (
              <Pressable
                key={method.id}
                style={[styles.payRow, active && styles.payRowActive]}
                onPress={() => setHotelPaymentMethod(method.id)}
              >
                <View style={[styles.payIcon, active && styles.payIconActive]}>
                  <MaterialCommunityIcons name={method.icon} size={20} color={active ? '#FFF' : '#405B84'} />
                </View>
                <View style={styles.payCopy}>
                  <View style={styles.payLabelRow}>
                    <Text style={styles.payTitle}>{method.label}</Text>
                    {method.badge && (
                      <View style={styles.payBadge}>
                        <Text style={styles.payBadgeText}>{method.badge}</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.paySubtitle}>{method.subtitle}</Text>
                  {isWallet && (
                    <Text style={[styles.walletBalance, walletInsufficient && { color: colors.danger }]}>
                      Balance: ₹{walletBalance.toLocaleString('en-IN')}
                      {walletInsufficient ? '  (Insufficient)' : ''}
                    </Text>
                  )}
                </View>
                <View style={[styles.radio, active && styles.radioActive]}>
                  {active && <View style={styles.radioInner} />}
                </View>
              </Pressable>
            );
          })}
        </View>

        {/* Security Notice */}
        <View style={styles.securityRow}>
          <MaterialCommunityIcons name="lock-outline" size={14} color={colors.textMuted} />
          <Text style={styles.securityText}>All payments are 256-bit SSL encrypted and processed securely by Gozy Payments.</Text>
        </View>
      </ScrollView>

      {/* Pay Button */}
      <View style={styles.stickyBar}>
        <Pressable
          disabled={isSubmitting || walletInsufficient}
          onPress={confirmBooking}
          style={[styles.payBtn, (isSubmitting || walletInsufficient) && styles.payBtnDisabled]}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <>
              <MaterialCommunityIcons name="lock" size={16} color="#FFF" />
              <Text style={styles.payBtnText}>PAY ₹{total.toLocaleString('en-IN')}</Text>
            </>
          )}
        </Pressable>
        {walletInsufficient && (
          <Text style={styles.insufficientNote}>Wallet balance is insufficient. Please choose another payment method.</Text>
        )}
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
  headerSub: { fontSize: typography.caption, color: colors.textMuted, marginTop: 2 },

  scrollContent: { padding: spacing.md, gap: 16, paddingBottom: 120 },

  bookingStrip: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: spacing.md, borderRadius: radius.lg, gap: 12 },
  stripLeft: { flex: 1, gap: 3 },
  stripLabel: { fontSize: 10, color: 'rgba(255,255,255,0.6)', fontWeight: '700', textTransform: 'uppercase' },
  stripName: { fontSize: typography.body, fontWeight: '900', color: '#FFF' },
  stripRoom: { fontSize: 11, color: 'rgba(255,255,255,0.75)' },
  stripRight: { alignItems: 'flex-end' },
  stripTotal: { fontSize: 22, fontWeight: '900', color: '#FFF' },
  stripTax: { fontSize: 10, color: 'rgba(255,255,255,0.6)', marginTop: 2 },

  card: { backgroundColor: '#FFF', borderRadius: radius.lg, padding: spacing.md, gap: 12, borderWidth: 1, borderColor: colors.line },
  cardTitle: { fontSize: typography.body, fontWeight: '900', color: colors.text },

  breakupRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 3 },
  breakupLabel: { fontSize: typography.caption, color: colors.textMuted },
  breakupValue: { fontSize: typography.caption, color: colors.text, fontWeight: '700' },
  breakupTotal: { borderTopWidth: 1, borderTopColor: colors.line, paddingTop: 10, marginTop: 4 },
  breakupTotalLabel: { fontSize: typography.body, fontWeight: '900', color: colors.text },
  breakupTotalValue: { fontSize: typography.section, fontWeight: '900', color: colors.text },

  payRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, padding: spacing.md, borderRadius: radius.md, borderWidth: 1, borderColor: colors.line },
  payRowActive: { borderColor: '#172B4D', backgroundColor: '#EEF2F7' },
  payIcon: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#EEF2F7', alignItems: 'center', justifyContent: 'center' },
  payIconActive: { backgroundColor: '#172B4D' },
  payCopy: { flex: 1, gap: 3 },
  payLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  payTitle: { fontSize: typography.body, fontWeight: '800', color: colors.text },
  payBadge: { backgroundColor: '#FEF9C3', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  payBadgeText: { fontSize: 9, fontWeight: '900', color: '#854D0E' },
  paySubtitle: { fontSize: 11, color: colors.textMuted, lineHeight: 15 },
  walletBalance: { fontSize: 11, color: '#405B84', fontWeight: '700', marginTop: 2 },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: colors.lineStrong, alignItems: 'center', justifyContent: 'center' },
  radioActive: { borderColor: '#172B4D' },
  radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#172B4D' },

  securityRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 6 },
  securityText: { flex: 1, fontSize: 11, color: colors.textMuted, lineHeight: 16 },

  stickyBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: '#FFF', padding: spacing.md, paddingBottom: 28,
    gap: 8, borderTopWidth: 1, borderTopColor: colors.line,
    shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 10, shadowOffset: { width: 0, height: -4 }, elevation: 8,
  },
  payBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: '#172B4D', borderRadius: radius.pill, paddingVertical: 16,
  },
  payBtnDisabled: { opacity: 0.4 },
  payBtnText: { color: '#FFF', fontSize: typography.body, fontWeight: '900', letterSpacing: 0.5 },
  insufficientNote: { fontSize: 11, color: colors.danger, textAlign: 'center', fontWeight: '600' },
});
