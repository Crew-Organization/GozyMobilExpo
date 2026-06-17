import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { getGovtBusOperator } from '@/src/lib/govt-bus-operators';
import { formatBusFare, type GovtBusListing } from '@/src/lib/govt-bus-search-data';
import { colors, radius, spacing, typography } from '@/src/theme/tokens';

type GovtBusResultCardProps = {
  bus: GovtBusListing;
  onPress?: () => void;
};

export function GovtBusResultCard({ bus, onPress }: GovtBusResultCardProps) {
  const operator = getGovtBusOperator(bus.operatorId);
  const brandColors = operator?.colors ?? ['#15BDF2', '#006BFF'];
  const seatsUrgent = bus.seatsLeft <= 8;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
    >
      <View style={styles.govtRibbon}>
        <MaterialCommunityIcons name="shield-check" size={12} color="#FFFFFF" />
        <Text style={styles.govtRibbonText}>State Govt • {bus.state}</Text>
      </View>

      {bus.tags.length > 0 ? (
        <View style={styles.tagRow}>
          {bus.tags
            .filter((tag) => tag !== 'State Govt')
            .slice(0, 2)
            .map((tag) => (
              <View key={tag} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
        </View>
      ) : null}

      <View style={styles.topRow}>
        <View style={styles.operatorBlock}>
          <LinearGradient colors={brandColors} style={styles.logoShell}>
            {operator?.logo ? (
              <Image source={operator.logo} style={styles.logo} contentFit="contain" />
            ) : (
              <Text style={styles.logoFallback}>{bus.operator.charAt(0)}</Text>
            )}
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
            <View style={[styles.dot, { backgroundColor: brandColors[0] }]} />
            <View style={[styles.line, { backgroundColor: `${brandColors[0]}33` }]} />
            <MaterialCommunityIcons name="bus" size={14} color={brandColors[0]} />
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
          <Text style={styles.concessionNote}>Govt concessions may apply</Text>
        </View>
        <LinearGradient colors={brandColors} style={styles.cta}>
          <Text style={styles.ctaText}>View seats</Text>
          <MaterialCommunityIcons name="chevron-right" size={18} color="#FFFFFF" />
        </LinearGradient>
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
    overflow: 'hidden',
  },
  cardPressed: {
    opacity: 0.94,
    transform: [{ scale: 0.995 }],
  },
  govtRibbon: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 5,
    marginBottom: spacing.sm,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.pill,
    backgroundColor: '#166534',
  },
  govtRibbonText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
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
    backgroundColor: '#EEF2FF',
  },
  tagText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#3730A3',
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
  logoShell: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 6,
    backgroundColor: '#FFFFFF',
  },
  logo: {
    width: 36,
    height: 36,
  },
  logoFallback: {
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
  },
  line: {
    flex: 1,
    height: 2,
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
  concessionNote: {
    marginTop: 4,
    fontSize: 10,
    fontWeight: '700',
    color: '#166534',
  },
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: radius.sm,
  },
  ctaText: {
    color: '#FFFFFF',
    fontSize: typography.caption,
    fontWeight: '800',
  },
});
