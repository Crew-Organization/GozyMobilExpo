import { Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { formatBusFare, type BusListing } from '@/src/lib/bus-search-data';
import { colors, radius, spacing, typography } from '@/src/theme/tokens';

type BusResultCardProps = {
  bus: BusListing;
  onPress?: () => void;
  onViewSeatsClick?: () => void;
};

export function BusResultCard({ bus, onPress, onViewSeatsClick }: BusResultCardProps) {
  const seatsUrgent = bus.seatsLeft <= 8;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
    >
      {bus.tags.length > 0 ? (
        <View style={styles.tagRow}>
          {bus.tags.map((tag) => (
            <View
              key={tag}
              style={[styles.tag, tag === 'Flash Deal' && styles.tagDeal, tag === 'Best Price' && styles.tagBest]}
            >
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
      ) : null}

      <View style={styles.topRow}>
        <View style={styles.operatorBlock}>
          <LinearGradient colors={['#15BDF2', '#006BFF']} style={styles.operatorLogo}>
            <Text style={styles.operatorInitial}>{bus.operator.charAt(0)}</Text>
          </LinearGradient>
          <View style={styles.operatorCopy}>
            <Text style={styles.operatorName} numberOfLines={1}>
              {bus.operator}
            </Text>
            <Text style={styles.busType}>{bus.busType}</Text>
          </View>
        </View>
        <View style={styles.ratingBlock}>
          <View style={styles.ratingPill}>
            <MaterialCommunityIcons name="star" size={12} color="#FFFFFF" />
            <Text style={styles.ratingText}>{bus.rating.toFixed(1)}</Text>
          </View>
          <Text style={styles.reviewCount}>{bus.reviews.toLocaleString('en-IN')} reviews</Text>
        </View>
      </View>

      <View style={styles.timelineRow}>
        <View style={styles.timeCol}>
          <Text style={styles.timeText}>{bus.departureTime}</Text>
          <Text style={styles.timeMeta}>{bus.boardingPoints} boarding points</Text>
        </View>
        <View style={styles.durationCol}>
          <Text style={styles.durationText}>{bus.duration}</Text>
          <View style={styles.durationLine}>
            <View style={styles.dot} />
            <View style={styles.line} />
            <MaterialCommunityIcons name="bus" size={14} color="#10A8EC" />
          </View>
        </View>
        <View style={[styles.timeCol, styles.timeColEnd]}>
          <Text style={styles.timeText}>{bus.arrivalTime}</Text>
          <Text style={styles.timeMeta}>{bus.droppingPoints} dropping points</Text>
        </View>
      </View>

      <View style={styles.amenityRow}>
        {bus.amenities.slice(0, 4).map((amenity) => (
          <View key={amenity} style={styles.amenityChip}>
            <Text style={styles.amenityText}>{amenity}</Text>
          </View>
        ))}
      </View>

      <View style={styles.footerRow}>
        <View>
          <Text style={[styles.seatsText, seatsUrgent && styles.seatsUrgent]}>
            {seatsUrgent ? `Only ${bus.seatsLeft} seats left` : `${bus.seatsLeft} seats available`}
          </Text>
          <View style={styles.priceRow}>
            <Text style={styles.price}>{formatBusFare(bus.price)}</Text>
            <Text style={styles.strike}>{formatBusFare(bus.originalPrice)}</Text>
          </View>
        </View>
        <Pressable 
          style={styles.cta} 
          onPress={(e) => {
            if (onViewSeatsClick) {
              e.stopPropagation();
              onViewSeatsClick();
            }
          }}
        >
          <Text style={styles.ctaText}>View seats</Text>
          <MaterialCommunityIcons name="chevron-right" size={18} color="#FFFFFF" />
        </Pressable>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  cardPressed: {
    opacity: 0.94,
    transform: [{ scale: 0.995 }],
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: spacing.sm,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.pill,
    backgroundColor: '#E8F7FE',
  },
  tagDeal: {
    backgroundColor: '#FFF4E5',
  },
  tagBest: {
    backgroundColor: '#E8F8EF',
  },
  tagText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#0B6E99',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  operatorBlock: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  operatorLogo: {
    width: 42,
    height: 42,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  operatorInitial: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
  },
  operatorCopy: {
    flex: 1,
    gap: 2,
  },
  operatorName: {
    fontSize: typography.body,
    fontWeight: '800',
    color: colors.text,
  },
  busType: {
    fontSize: typography.caption,
    color: colors.textMuted,
    fontWeight: '600',
  },
  ratingBlock: {
    alignItems: 'flex-end',
    gap: 4,
  },
  ratingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.pill,
    backgroundColor: '#16A34A',
  },
  ratingText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  reviewCount: {
    fontSize: 10,
    color: colors.textMuted,
    fontWeight: '600',
  },
  timelineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  timeCol: {
    flex: 1,
    gap: 4,
  },
  timeColEnd: {
    alignItems: 'flex-end',
  },
  timeText: {
    fontSize: 18,
    fontWeight: '900',
    color: colors.text,
  },
  timeMeta: {
    fontSize: 10,
    color: colors.textMuted,
    fontWeight: '600',
  },
  durationCol: {
    width: 110,
    alignItems: 'center',
    gap: 4,
  },
  durationText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textMuted,
  },
  durationLine: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10A8EC',
  },
  line: {
    flex: 1,
    height: 2,
    backgroundColor: '#D6EEF9',
  },
  amenityRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: spacing.md,
  },
  amenityChip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.xs,
    backgroundColor: colors.surfaceSoft,
    borderWidth: 1,
    borderColor: colors.line,
  },
  amenityText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textMuted,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.line,
  },
  seatsText: {
    fontSize: typography.caption,
    fontWeight: '700',
    color: colors.textMuted,
    marginBottom: 4,
  },
  seatsUrgent: {
    color: '#DC2626',
    fontWeight: '800',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  price: {
    fontSize: 22,
    fontWeight: '900',
    color: colors.text,
  },
  strike: {
    fontSize: typography.caption,
    color: colors.textLight,
    textDecorationLine: 'line-through',
    fontWeight: '600',
  },
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: radius.sm,
    backgroundColor: '#10A8EC',
  },
  ctaText: {
    color: '#FFFFFF',
    fontSize: typography.caption,
    fontWeight: '800',
  },
});
