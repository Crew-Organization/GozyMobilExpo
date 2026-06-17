import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { formatCurrency } from '@/src/lib/travel-data';
import type { TravelOffer } from '@/src/types';
import { colors, radius, spacing, typography } from '@/src/theme/tokens';

type TravelOfferCardProps = {
  offer: TravelOffer;
  actionLabel?: string;
  footer?: ReactNode;
  onPress?: () => void;
};

export function TravelOfferCard({
  offer,
  actionLabel,
  footer,
  onPress,
}: TravelOfferCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.airlineRow}>
          <View style={styles.logoBadge}>
            <Text style={styles.logoText}>{offer.airlineCode}</Text>
          </View>
          <View style={styles.airlineCopy}>
            <Text style={styles.airlineName}>{offer.airline}</Text>
            <Text style={styles.flightNumber}>{offer.flightNumber}</Text>
          </View>
        </View>
        {offer.badge ? <Text style={styles.offerBadge}>{offer.badge}</Text> : null}
      </View>

      <View style={styles.timelineRow}>
        <View>
          <Text style={styles.timeText}>{offer.departTime}</Text>
          <Text style={styles.codeText}>{offer.fromTerminal}</Text>
        </View>
        <View style={styles.durationWrap}>
          <Text style={styles.durationText}>{offer.duration}</Text>
          <View style={styles.durationLine}>
            <View style={styles.dot} />
            <View style={styles.line} />
            <MaterialCommunityIcons color={colors.sky} name="airplane" size={15} />
          </View>
          <Text style={styles.stopText}>{offer.stops}</Text>
        </View>
        <View style={styles.arriveWrap}>
          <Text style={styles.timeText}>{offer.arriveTime}</Text>
          <Text style={styles.codeText}>{offer.toTerminal}</Text>
        </View>
      </View>

      <View style={styles.metaRow}>
        <Text style={styles.metaChip}>{offer.cabinBag}</Text>
        <Text style={styles.metaChip}>{offer.checkInBag}</Text>
        <Text style={styles.metaChip}>{offer.onTimeLabel}</Text>
      </View>

      <View style={styles.metaRow}>
        <Text style={styles.metaDetail}>{offer.refundLabel}</Text>
        <Text style={styles.metaDetail}>{offer.emissionsLabel}</Text>
      </View>

      <View style={styles.tagsRow}>
        {offer.tags.map((tag) => (
          <View key={tag} style={styles.tagPill}>
            <Text style={styles.tagText}>{tag}</Text>
          </View>
        ))}
      </View>

      <View style={styles.footerRow}>
        <View>
          <View style={styles.priceRow}>
            <Text style={styles.priceText}>{formatCurrency(offer.price)}</Text>
            <Text style={styles.strikeText}>{formatCurrency(offer.originalPrice)}</Text>
          </View>
          <Text style={styles.seatText}>{offer.seatsLeft} seats left at this fare</Text>
        </View>
        {actionLabel && onPress ? (
          <Pressable onPress={onPress} style={styles.bookButton}>
            <Text style={styles.bookButtonText}>{actionLabel}</Text>
          </Pressable>
        ) : null}
      </View>

      {footer}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    padding: spacing.lg,
    gap: spacing.md,
    shadowColor: colors.shadow,
    shadowOpacity: 1,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.md,
  },
  airlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
  },
  logoBadge: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: colors.surfaceSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    color: colors.sky,
    fontSize: typography.caption,
    fontWeight: '800',
  },
  airlineCopy: {
    gap: 2,
  },
  airlineName: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: '800',
  },
  flightNumber: {
    color: colors.textMuted,
    fontSize: typography.caption,
  },
  offerBadge: {
    color: colors.sky,
    fontSize: typography.caption,
    fontWeight: '800',
    backgroundColor: colors.surfaceSoft,
    paddingHorizontal: spacing.sm,
    paddingVertical: 7,
    borderRadius: radius.pill,
  },
  timelineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  durationWrap: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
  },
  durationText: {
    color: colors.textMuted,
    fontSize: typography.caption,
    fontWeight: '700',
  },
  durationLine: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: radius.pill,
    backgroundColor: colors.sky,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: colors.lineStrong,
  },
  stopText: {
    color: colors.textMuted,
    fontSize: typography.caption,
  },
  timeText: {
    color: colors.text,
    fontSize: typography.section,
    fontWeight: '900',
  },
  codeText: {
    color: colors.textMuted,
    fontSize: typography.caption,
    marginTop: 4,
  },
  arriveWrap: {
    alignItems: 'flex-end',
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  metaChip: {
    color: colors.text,
    fontSize: typography.caption,
    fontWeight: '700',
    paddingHorizontal: spacing.sm,
    paddingVertical: 8,
    backgroundColor: colors.canvasMuted,
    borderRadius: radius.pill,
  },
  metaDetail: {
    color: colors.textMuted,
    fontSize: typography.caption,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  tagPill: {
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.line,
    paddingHorizontal: spacing.sm,
    paddingVertical: 8,
  },
  tagText: {
    color: colors.text,
    fontSize: typography.caption,
    fontWeight: '700',
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  priceText: {
    color: colors.text,
    fontSize: typography.section,
    fontWeight: '900',
  },
  strikeText: {
    color: colors.textMuted,
    fontSize: typography.caption,
    textDecorationLine: 'line-through',
  },
  seatText: {
    color: colors.coral,
    fontSize: typography.caption,
    fontWeight: '700',
    marginTop: 4,
  },
  bookButton: {
    borderRadius: radius.pill,
    backgroundColor: colors.sky,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  bookButtonText: {
    color: '#111827',
    fontSize: typography.body,
    fontWeight: '800',
  },
});
