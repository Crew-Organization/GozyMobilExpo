import { Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { cabPartners, formatCabCurrency } from '@/src/lib/cab-data';
import type { CabOffer } from '@/src/types';
import { colors, radius, spacing, typography } from '@/src/theme/tokens';

const vehicleIconByType: Record<CabOffer['vehicleType'], keyof typeof MaterialCommunityIcons.glyphMap> = {
  Hatchback: 'car-hatchback',
  Sedan: 'car',
  SUV: 'car-estate',
  Premium: 'car-limousine',
};

export function CabOfferCard({
  offer,
  onPress,
  highlightCoupon,
}: {
  offer: CabOffer;
  onPress?: () => void;
  highlightCoupon?: boolean;
}) {
  const partner = cabPartners.find((item) => item.id === offer.partnerId);
  const savings =
    typeof offer.originalPrice === 'number'
      ? Math.round(((offer.originalPrice - offer.price) / offer.originalPrice) * 100)
      : null;

  return (
    <Pressable disabled={!onPress} onPress={onPress} style={styles.card}>
      <View style={styles.mainRow}>
        <View style={styles.thumb}>
          <MaterialCommunityIcons
            color="#5D7FAF"
            name={vehicleIconByType[offer.vehicleType]}
            size={44}
          />
          <View style={styles.fuelPill}>
            <Text style={styles.fuelText}>{offer.energyType}</Text>
          </View>
        </View>

        <View style={styles.copy}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>{offer.vehicleName}</Text>
            <Text style={styles.newPill}>new</Text>
          </View>
          <Text style={styles.similar}>{offer.similarLabel}</Text>
          <Text style={styles.meta}>
            {offer.seats} Seats  .  {offer.ac ? 'AC' : 'Non AC'}
          </Text>
          {partner ? (
            <Text style={styles.partnerText}>Top rated partner: {partner.name}</Text>
          ) : null}
        </View>

        <View style={styles.priceWrap}>
          {savings ? (
            <View style={styles.savingsRow}>
              <Text style={styles.savingsText}>{savings}% off</Text>
              <Text style={styles.originalPrice}>{formatCabCurrency(offer.originalPrice ?? 0)}</Text>
            </View>
          ) : null}
          <Text style={styles.price}>{formatCabCurrency(offer.price)}</Text>
          <Text style={styles.taxes}>+ {formatCabCurrency(offer.taxesAndCharges)} (Taxes and Charges)</Text>
        </View>
      </View>

      {highlightCoupon ? (
        <View style={styles.tipBanner}>
          <MaterialCommunityIcons color="#E0A020" name="star-four-points" size={16} />
          <Text style={styles.tipText}>Add Roof Carrier to fit 4 more bags @ Rs157</Text>
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#E6E8EE',
    backgroundColor: colors.surface,
    overflow: 'hidden',
  },
  mainRow: {
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.md,
  },
  thumb: {
    width: 104,
    borderRadius: 16,
    backgroundColor: '#EAF4FF',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: spacing.md,
  },
  fuelPill: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: '#E8FBF7',
    paddingVertical: spacing.xs,
  },
  fuelText: {
    color: '#0E9484',
    fontSize: typography.body,
    fontWeight: '500',
  },
  copy: {
    flex: 1,
    gap: 4,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  title: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '900',
  },
  newPill: {
    color: colors.white,
    fontSize: typography.caption,
    fontWeight: '800',
    backgroundColor: '#0F9A9A',
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: radius.sm,
    overflow: 'hidden',
  },
  similar: {
    color: '#5F636D',
    fontSize: 16,
    fontStyle: 'italic',
  },
  meta: {
    color: '#343A46',
    fontSize: 18,
  },
  partnerText: {
    color: colors.textMuted,
    fontSize: typography.caption,
    fontWeight: '700',
    marginTop: spacing.xs,
  },
  priceWrap: {
    width: 132,
    alignItems: 'flex-end',
    gap: 2,
  },
  savingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
  },
  savingsText: {
    color: '#0C8D7A',
    fontSize: 16,
    fontWeight: '700',
  },
  originalPrice: {
    color: '#8A8F98',
    fontSize: 16,
    textDecorationLine: 'line-through',
  },
  price: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '900',
  },
  taxes: {
    color: '#6B7280',
    fontSize: typography.body,
    textAlign: 'right',
  },
  tipBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: '#F7F2FF',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  tipText: {
    color: '#2C4D94',
    fontSize: typography.body,
    fontWeight: '700',
  },
});
