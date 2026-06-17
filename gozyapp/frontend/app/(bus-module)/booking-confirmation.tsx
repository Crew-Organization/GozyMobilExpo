import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { colors, radius, spacing, typography, shadow } from '@/src/theme/tokens';
import { formatBusDate, parseBusTravelDate } from '@/src/lib/bus-booking-utils';

const PRIMARY = '#0A67FF';
const { width, height } = Dimensions.get('window');
const CONFETTI_COLORS = ['#EF4444', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899'];
const NUM_CONFETTI = 60;
const AnimatedView = Animated.View as any;

function ConfettiPiece({ delay }: { delay: number }) {
  const initialX = useRef(Math.random() * width).current;
  const translateY = useRef(new Animated.Value(-50)).current;
  const translateX = useRef(new Animated.Value(initialX)).current;
  const rotate = useRef(new Animated.Value(0)).current;
  const color = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
  const size = Math.random() * 8 + 6;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(delay),
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: height + 150,
          duration: Math.random() * 2000 + 2500,
          useNativeDriver: true,
        }),
        Animated.timing(translateX, {
          toValue: initialX + (Math.random() * 100 - 50),
          duration: Math.random() * 2000 + 2500,
          useNativeDriver: true,
        }),
        Animated.timing(rotate, {
          toValue: 1,
          duration: Math.random() * 2000 + 2000,
          useNativeDriver: true,
        })
      ])
    ]).start();
  }, []);

  const spin = rotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  const opacity = translateY.interpolate({
    inputRange: [-50, height - 100, height + 150],
    outputRange: [1, 1, 0],
    extrapolate: 'clamp'
  }) as any;

  const AnimatedView = Animated.View as any;

  return (
    <AnimatedView style={{
      position: 'absolute',
      width: size,
      height: size,
      backgroundColor: color,
      borderRadius: Math.random() > 0.5 ? size / 2 : 2,
      opacity,
      transform: [
        { translateX },
        { translateY },
        { rotate: spin },
      ]
    }} />
  );
}

export default function BookingConfirmationScreen() {
  const params = useLocalSearchParams<{
    pnr: string;
    bookingId: string;
    operator: string;
    busType: string;
    fromCity: string;
    toCity: string;
    date: string;
    departureTime: string;
    arrivalTime: string;
    seats: string;
    boarding: string;
    dropping: string;
    totalPaid: string;
  }>();

  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, tension: 80, friction: 8 }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
    ]).start();
  }, []);

  const seats = params.seats?.split(',') ?? [];

  const handleShare = async () => {
    await Share.share({
      message: `My bus ticket is confirmed! 🎉\nRoute: ${params.fromCity} → ${params.toCity}\nOperator: ${params.operator}\nDate: ${params.date ? formatBusDate(parseBusTravelDate(params.date), true) : ''}\nSeats: ${params.seats}\nPNR: ${params.pnr}\nBoarding: ${params.boarding}\n\nBooked via Gozy App.`,
    });
  };

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.container}>
      {/* Confetti Animation Layer */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        {Array.from({ length: NUM_CONFETTI }).map((_, i) => (
          <ConfettiPiece key={i} delay={Math.random() * 1500} />
        ))}
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Success animation */}
        <AnimatedView style={[styles.successCircle, { transform: [{ scale: scaleAnim }] }]}>
          <LinearGradient
            colors={['#10B981', '#059669']}
            style={styles.successGradient}
          >
            <MaterialCommunityIcons name="check-bold" size={52} color="#FFF" />
          </LinearGradient>
        </AnimatedView>

        <AnimatedView style={[styles.titleBlock, { opacity: fadeAnim }]}>
          <Text style={styles.successTitle}>Booking Confirmed! 🎉</Text>
          <Text style={styles.successSubtitle}>
            Your ticket has been successfully booked. Have a safe journey!
          </Text>
        </AnimatedView>

        {/* PNR Card */}
        <AnimatedView style={[styles.pnrCard, { opacity: fadeAnim }]}>
          <LinearGradient colors={['#0A67FF', '#0052CC']} style={styles.pnrGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
            <View style={styles.pnrRow}>
              <View>
                <Text style={styles.pnrLabel}>PNR NUMBER</Text>
                <Text style={styles.pnrValue}>{params.pnr}</Text>
              </View>
              <View style={styles.pnrQrArea}>
                <MaterialCommunityIcons name="qrcode" size={64} color="rgba(255,255,255,0.9)" />
                <Text style={styles.pnrQrLabel}>Show at boarding</Text>
              </View>
            </View>
            <View style={styles.pnrDivider} />
            <View style={styles.pnrRoute}>
              <View>
                <Text style={styles.pnrCity}>{params.fromCity}</Text>
                <Text style={styles.pnrTime}>{params.departureTime}</Text>
              </View>
              <View style={styles.pnrArrow}>
                <MaterialCommunityIcons name="bus" size={20} color="rgba(255,255,255,0.8)" />
                <Text style={styles.pnrDuration}>{params.seats?.split(',').length} seat(s)</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.pnrCity}>{params.toCity}</Text>
                <Text style={styles.pnrTime}>{params.arrivalTime}</Text>
              </View>
            </View>
          </LinearGradient>
          {/* Ticket perforated edge */}
          <View style={styles.perforatedEdge}>
            <View style={styles.perforatedCircleLeft} />
            <View style={styles.perforatedLine} />
            <View style={styles.perforatedCircleRight} />
          </View>
          {/* Ticket lower half */}
          <View style={styles.ticketLower}>
            <DetailRow label="Booking ID" value={params.bookingId ?? ''} />
            <DetailRow label="Operator" value={`${params.operator} • ${params.busType}`} />
            <DetailRow label="Journey Date" value={params.date ? formatBusDate(parseBusTravelDate(params.date), true) : ''} />
            <DetailRow label="Seats" value={seats.join(', ')} />
            <DetailRow label="Boarding" value={params.boarding ?? ''} />
            <DetailRow label="Dropping" value={params.dropping ?? ''} />
            <View style={styles.paidRow}>
              <Text style={styles.paidLabel}>Total Paid</Text>
              <Text style={styles.paidValue}>₹{parseInt(params.totalPaid ?? '0').toLocaleString('en-IN')}</Text>
            </View>
          </View>
        </AnimatedView>

        {/* Action Buttons */}
        <AnimatedView style={[styles.actionsRow, { opacity: fadeAnim }]}>
          <Pressable onPress={handleShare} style={styles.actionBtn}>
            <MaterialCommunityIcons name="share-variant" size={20} color={PRIMARY} />
            <Text style={styles.actionBtnText}>Share</Text>
          </Pressable>
          <Pressable style={styles.actionBtn}>
            <MaterialCommunityIcons name="download" size={20} color={PRIMARY} />
            <Text style={styles.actionBtnText}>Download</Text>
          </Pressable>
          <Pressable style={styles.actionBtn}>
            <MaterialCommunityIcons name="help-circle-outline" size={20} color={PRIMARY} />
            <Text style={styles.actionBtnText}>Support</Text>
          </Pressable>
        </AnimatedView>

        {/* Important notice */}
        <View style={styles.noticeCard}>
          <MaterialCommunityIcons name="information" size={16} color={colors.warning} />
          <View style={{ flex: 1 }}>
            <Text style={styles.noticeTitle}>Important Reminders</Text>
            <Text style={styles.noticeText}>• Carry valid government ID (Aadhaar/PAN/Passport)</Text>
            <Text style={styles.noticeText}>• Report 15 minutes before departure</Text>
            <Text style={styles.noticeText}>• Luggage limit: 20 kg per passenger</Text>
          </View>
        </View>

        {/* Support */}
        <View style={styles.supportCard}>
          <Text style={styles.supportTitle}>Need Help?</Text>
          <View style={styles.supportRow}>
            <MaterialCommunityIcons name="phone" size={14} color={colors.success} />
            <Text style={styles.supportText}>1800-123-4567 (24x7 Free)</Text>
          </View>
          <View style={styles.supportRow}>
            <MaterialCommunityIcons name="email-outline" size={14} color={PRIMARY} />
            <Text style={styles.supportText}>support@gozy.app</Text>
          </View>
        </View>

        <View style={styles.scrollPad} />
      </ScrollView>

      {/* Bottom CTAs */}
      <View style={styles.bottomBar}>
        <Pressable
          onPress={() => {
            router.dismissAll();
            router.replace('/(explore)');
          }}
          style={styles.homeBtn}
        >
          <MaterialCommunityIcons name="home-outline" size={18} color={colors.textMuted} />
          <Text style={styles.homeBtnText}>Go Home</Text>
        </Pressable>
        <Pressable
          onPress={() => router.push({
            pathname: '/(bus-module)/bus-ticket',
            params: params,
          })}
          style={styles.bookMoreBtn}
        >
          <LinearGradient colors={['#15BDF2', '#006BFF']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.bookMoreGrad}>
            <MaterialCommunityIcons name="ticket-confirmation" size={18} color="#FFF" />
            <Text style={styles.bookMoreText}>VIEW TICKET</Text>
          </LinearGradient>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={detailStyles.row}>
      <Text style={detailStyles.label}>{label}</Text>
      <Text style={detailStyles.value}>{value}</Text>
    </View>
  );
}

const detailStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  label: { fontSize: typography.small, color: colors.textMuted, fontWeight: '600' },
  value: { fontSize: typography.small, fontWeight: '700', color: colors.text, flex: 1, textAlign: 'right' },
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.canvas },
  scrollContent: {
    padding: spacing.md,
    alignItems: 'center',
    gap: spacing.md,
  },

  successCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginTop: spacing.md,
    ...shadow.lg,
  },
  successGradient: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleBlock: { alignItems: 'center', gap: 8 },
  successTitle: { fontSize: typography.section, fontWeight: '900', color: colors.text, textAlign: 'center' },
  successSubtitle: { fontSize: typography.small, color: colors.textMuted, textAlign: 'center', lineHeight: 20 },

  // PNR Card
  pnrCard: {
    width: '100%',
    borderRadius: radius.md,
    overflow: 'hidden',
    ...shadow.lg,
    borderWidth: 1,
    borderColor: colors.line,
  },
  pnrGradient: { padding: spacing.md, gap: spacing.sm },
  pnrRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  pnrLabel: { fontSize: 10.5, fontWeight: '800', color: 'rgba(255,255,255,0.6)', letterSpacing: 1 },
  pnrValue: { fontSize: 18, fontWeight: '900', color: '#FFF', letterSpacing: 2 },
  pnrQrArea: { alignItems: 'center', gap: 4 },
  pnrQrLabel: { fontSize: 10, color: 'rgba(255,255,255,0.6)', fontWeight: '700' },
  pnrDivider: { height: 1, backgroundColor: 'rgba(255,255,255,0.2)' },
  pnrRoute: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  pnrCity: { fontSize: typography.body, fontWeight: '900', color: '#FFF' },
  pnrTime: { fontSize: typography.tiny, color: 'rgba(255,255,255,0.7)', fontWeight: '600', marginTop: 2 },
  pnrArrow: { alignItems: 'center', gap: 4 },
  pnrDuration: { fontSize: 10, color: 'rgba(255,255,255,0.7)', fontWeight: '600' },

  perforatedEdge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.canvas,
  },
  perforatedCircleLeft: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.canvas,
    marginLeft: -10,
  },
  perforatedLine: { flex: 1, height: 1, borderWidth: 1, borderStyle: 'dashed', borderColor: colors.line },
  perforatedCircleRight: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.canvas,
    marginRight: -10,
  },

  ticketLower: {
    backgroundColor: colors.background,
    padding: spacing.md,
    gap: 0,
  },
  paidRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: spacing.sm,
    marginTop: 4,
  },
  paidLabel: { fontSize: typography.bodySmall, fontWeight: '800', color: colors.text },
  paidValue: { fontSize: typography.section, fontWeight: '900', color: colors.success },

  actionsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    width: '100%',
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: PRIMARY,
    backgroundColor: '#EFF6FF',
  },
  actionBtnText: { fontSize: typography.small, fontWeight: '700', color: PRIMARY },

  noticeCard: {
    flexDirection: 'row',
    gap: spacing.sm,
    padding: spacing.md,
    backgroundColor: colors.warningLight,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: '#FCD34D',
    width: '100%',
  },
  noticeTitle: { fontSize: typography.small, fontWeight: '800', color: '#92400E', marginBottom: 4 },
  noticeText: { fontSize: 12, color: '#92400E', lineHeight: 20 },

  supportCard: {
    width: '100%',
    padding: spacing.md,
    backgroundColor: colors.background,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.line,
    gap: 8,
    ...shadow.sm,
  },
  supportTitle: { fontSize: typography.bodySmall, fontWeight: '800', color: colors.text },
  supportRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  supportText: { fontSize: typography.small, color: colors.textMuted, fontWeight: '600' },

  scrollPad: { height: 24 },

  bottomBar: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.line,
    ...shadow.lg,
  },
  homeBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.line,
  },
  homeBtnText: { fontSize: typography.small, fontWeight: '700', color: colors.textMuted },
  bookMoreBtn: { flex: 2, borderRadius: radius.md, overflow: 'hidden' },
  bookMoreGrad: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: spacing.sm,
  },
  bookMoreText: { fontSize: typography.small, fontWeight: '900', color: '#FFF' },
});
