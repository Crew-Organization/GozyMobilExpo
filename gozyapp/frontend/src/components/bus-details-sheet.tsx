import React from 'react';
import { Modal, StyleSheet, Text, View, Pressable, ScrollView, SafeAreaView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, radius, spacing, typography, shadow } from '@/src/theme/tokens';
import type { BusListing } from '@/src/lib/bus-search-data';
import { formatBusDate, parseBusTravelDate } from '@/src/lib/bus-booking-utils';

type Props = {
  bus: BusListing | null;
  visible: boolean;
  fromCity: string;
  toCity: string;
  dateIso: string;
  onClose: () => void;
  onContinueToSeats: (bus: BusListing) => void;
};

const PRIMARY = '#0A67FF';

export function BusDetailsSheet({ bus, visible, fromCity, toCity, dateIso, onClose, onContinueToSeats }: Props) {
  if (!bus) return null;

  const travelDate = parseBusTravelDate(dateIso);

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        <View style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Bus Details</Text>
            <Pressable onPress={onClose} hitSlop={12} style={styles.closeBtn}>
              <MaterialCommunityIcons name="close" size={20} color={colors.text} />
            </Pressable>
          </View>
          
          <ScrollView contentContainerStyle={styles.content}>
            <View style={styles.operatorRow}>
              <Text style={styles.operatorName}>{bus.operator}</Text>
              <View style={styles.ratingBadge}>
                <MaterialCommunityIcons name="star" size={12} color="#FFF" />
                <Text style={styles.ratingText}>{bus.rating}</Text>
              </View>
            </View>
            <Text style={styles.busType}>{bus.busType}</Text>
            
            <View style={styles.timeRow}>
              <View style={styles.timeBlock}>
                <Text style={styles.time}>{bus.departureTime}</Text>
                <Text style={styles.city}>{fromCity}</Text>
                <Text style={styles.date}>{formatBusDate(travelDate)}</Text>
              </View>
              <View style={styles.durationBlock}>
                <Text style={styles.duration}>{bus.duration}</Text>
                <View style={styles.line} />
                <Text style={styles.stops}>Direct</Text>
              </View>
              <View style={styles.timeBlock}>
                <Text style={styles.time}>{bus.arrivalTime}</Text>
                <Text style={styles.city}>{toCity}</Text>
                <Text style={styles.date}>{formatBusDate(travelDate)}</Text>
              </View>
            </View>

            <View style={styles.amenities}>
              <Text style={styles.sectionTitle}>Amenities</Text>
              <View style={styles.amenitiesList}>
                {bus.amenities.map(item => (
                  <View key={item} style={styles.amenityChip}>
                    <MaterialCommunityIcons name="check-circle-outline" size={14} color={colors.textMuted} />
                    <Text style={styles.amenityText}>{item}</Text>
                  </View>
                ))}
              </View>
            </View>
            
          </ScrollView>

          <SafeAreaView edges={['bottom']}>
            <View style={styles.footer}>
              <View>
                <Text style={styles.price}>₹{bus.price.toLocaleString('en-IN')}</Text>
                <Text style={styles.seatsLeft}>{bus.seatsLeft} Seats Left</Text>
              </View>
              <Pressable style={styles.btn} onPress={() => onContinueToSeats(bus)}>
                <Text style={styles.btnText}>SELECT SEATS</Text>
              </Pressable>
            </View>
          </SafeAreaView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  sheet: {
    backgroundColor: colors.background,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    maxHeight: '85%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  headerTitle: {
    fontSize: typography.body,
    fontWeight: '800',
    color: colors.text,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.surfaceSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: spacing.md,
    gap: spacing.md,
  },
  operatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  operatorName: {
    fontSize: typography.bodySmall,
    fontWeight: '800',
    color: colors.text,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: '#16A34A',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.sm,
  },
  ratingText: {
    fontSize: typography.tiny,
    fontWeight: '800',
    color: '#FFF',
  },
  busType: {
    fontSize: typography.caption,
    color: colors.textMuted,
    marginTop: -8,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surfaceSoft,
    padding: spacing.md,
    borderRadius: radius.md,
  },
  timeBlock: {
    alignItems: 'center',
    gap: 2,
  },
  time: {
    fontSize: typography.body,
    fontWeight: '900',
    color: colors.text,
  },
  city: {
    fontSize: typography.caption,
    fontWeight: '600',
    color: colors.textMuted,
  },
  date: {
    fontSize: typography.tiny,
    color: colors.textLight,
  },
  durationBlock: {
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: spacing.sm,
  },
  duration: {
    fontSize: typography.caption,
    fontWeight: '600',
    color: colors.textMuted,
  },
  line: {
    height: 1,
    backgroundColor: colors.line,
    width: '100%',
    marginVertical: 4,
  },
  stops: {
    fontSize: typography.tiny,
    color: colors.textLight,
  },
  sectionTitle: {
    fontSize: typography.bodySmall,
    fontWeight: '800',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  amenities: {
    marginTop: spacing.sm,
  },
  amenitiesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  amenityChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.surfaceSoft,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.sm,
  },
  amenityText: {
    fontSize: typography.caption,
    color: colors.textMuted,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.line,
    backgroundColor: colors.background,
    ...shadow.lg,
  },
  price: {
    fontSize: typography.section,
    fontWeight: '900',
    color: colors.text,
  },
  seatsLeft: {
    fontSize: typography.caption,
    fontWeight: '600',
    color: '#D97706',
  },
  btn: {
    backgroundColor: PRIMARY,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
  },
  btnText: {
    fontSize: typography.caption,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
