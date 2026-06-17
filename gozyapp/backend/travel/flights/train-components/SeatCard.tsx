import { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import type { TrainAvailability } from '@/src/lib/train-search-results';

type SeatCardProps = {
  onPress?: () => void;
  slot: TrainAvailability;
};

export const SeatCard = memo(function SeatCard({ onPress, slot }: SeatCardProps) {
  const quotaUpper = slot.quotaLabel.toUpperCase();
  const statusUpper = slot.status.toUpperCase();
  
  const isAvailable = quotaUpper.includes('AVAILABLE') || quotaUpper.includes('AVL');
  const isWL = quotaUpper.includes('WL') || quotaUpper.includes('RAC') || quotaUpper.includes('GNWL') || quotaUpper.includes('PQWL') || quotaUpper.includes('RLWL') || quotaUpper.includes('TQWL');
  const isBookingBlocked = quotaUpper.includes('BOOKING NOT ALLOWED');
  
  const isConfirm3x = statusUpper.includes('CONFIRM OR 3X REFUND') || statusUpper.includes('3X REFUND');
  const isFreeCancel = statusUpper.includes('FREE CANCELLATION') || slot.status.toLowerCase().includes('free cancellation');

  // Quota style determination
  let quotaColor = '#111827';
  let quotaWeight: '500' | '600' | '700' = '600';
  
  if (isAvailable) {
    quotaColor = '#16A34A'; // vibrant green
    quotaWeight = '700';
  } else if (isWL) {
    quotaColor = isConfirm3x ? '#16A34A' : '#E05A00'; // green if covered by MMT's ConfirmTkt guarantee, orange otherwise
    quotaWeight = '700';
  } else if (isBookingBlocked) {
    quotaColor = '#6B7280'; // medium grey
    quotaWeight = '500';
  }

  // Format price with comma separation and Rupee symbol
  const formattedPrice = slot.price
    ? '₹ ' + slot.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    : '';

  return (
    <Pressable
      disabled={!onPress}
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        pressed && onPress && styles.cardPressed,
      ]}
    >
      <View style={styles.topRow}>
        <Text style={styles.className}>{slot.className}</Text>
        {formattedPrice ? <Text style={styles.price}>{formattedPrice}</Text> : null}
      </View>

      <Text style={[styles.quota, { color: quotaColor, fontWeight: quotaWeight }]}>
        {slot.quotaLabel}
      </Text>

      {isConfirm3x ? (
        <View style={styles.confirm3xRow}>
          <MaterialCommunityIcons color="#7C3AED" name="checkbox-marked" size={12} />
          <Text numberOfLines={1} style={styles.confirm3xText}>Confirm or 3X Refund</Text>
        </View>
      ) : isFreeCancel && !isBookingBlocked ? (
        <Text numberOfLines={1} style={styles.statusFreeCancel}>
          Free Cancellation
        </Text>
      ) : null}

      <Text style={styles.updated}>{slot.updatedLabel}</Text>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  card: {
    width: 125,
    minHeight: 104,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB', // thin clean border
    backgroundColor: '#FFFFFF', // clean white background
    flexDirection: 'column',
  },
  cardPressed: {
    transform: [{ scale: 0.985 }],
    backgroundColor: '#F9FAFB',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  className: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
  },
  price: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
  },
  quota: {
    fontSize: 12,
    marginTop: 8,
  },
  statusFreeCancel: {
    fontSize: 10,
    color: '#6B7280',
    marginTop: 4,
    fontWeight: '400',
  },
  confirm3xRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 4,
  },
  confirm3xText: {
    fontSize: 10,
    color: '#7C3AED',
    fontWeight: '600',
  },
  updated: {
    fontSize: 9,
    color: '#9CA3AF',
    marginTop: 'auto', // Pushes the updated label to the bottom
    paddingTop: 6,
  },
});
