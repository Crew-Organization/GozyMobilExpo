import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { buildCalendarDays, isSameCalendarDay, MONTH_NAMES } from '@/src/lib/bus-booking-utils';
import { colors, radius, spacing, typography } from '@/src/theme/tokens';

type BusCalendarModalProps = {
  visible: boolean;
  title: string;
  selectedDate: Date;
  calendarMonth: Date;
  accent?: string;
  onSelect: (day: number) => void;
  onClose: () => void;
  onMonthChange: (month: Date) => void;
};

export function BusCalendarModal({
  visible,
  title,
  selectedDate,
  calendarMonth,
  accent = colors.sky,
  onSelect,
  onClose,
  onMonthChange,
}: BusCalendarModalProps) {
  const days = buildCalendarDays(calendarMonth);

  return (
    <Modal transparent visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            <Pressable onPress={onClose} hitSlop={10}>
              <MaterialCommunityIcons name="close" size={24} color={colors.text} />
            </Pressable>
          </View>
          <View style={styles.nav}>
            <Pressable
              onPress={() =>
                onMonthChange(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1))
              }
              style={styles.navBtn}
            >
              <MaterialCommunityIcons name="chevron-left" size={28} color={accent} />
            </Pressable>
            <Text style={styles.month}>
              {MONTH_NAMES[calendarMonth.getMonth()]} {calendarMonth.getFullYear()}
            </Text>
            <Pressable
              onPress={() =>
                onMonthChange(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1))
              }
              style={styles.navBtn}
            >
              <MaterialCommunityIcons name="chevron-right" size={28} color={accent} />
            </Pressable>
          </View>
          <View style={styles.weekRow}>
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((label, index) => (
              <Text key={`${label}-${index}`} style={styles.weekCell}>
                {label}
              </Text>
            ))}
          </View>
          <View style={styles.grid}>
            {days.map((day, index) => {
              const selected = isSameCalendarDay(day, selectedDate, calendarMonth);
              return (
                <Pressable
                  key={index}
                  disabled={day === null}
                  onPress={() => day !== null && onSelect(day)}
                  style={[styles.cell, selected && { backgroundColor: accent }]}
                >
                  {day !== null ? (
                    <Text style={[styles.cellText, selected && styles.cellTextSelected]}>{day}</Text>
                  ) : null}
                </Pressable>
              );
            })}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(17, 24, 39, 0.45)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    paddingBottom: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  title: {
    fontSize: typography.section,
    fontWeight: '800',
    color: colors.text,
  },
  nav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  navBtn: {
    padding: spacing.xs,
  },
  month: {
    fontSize: typography.body,
    fontWeight: '700',
    color: colors.text,
  },
  weekRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    marginBottom: spacing.xs,
  },
  weekCell: {
    flex: 1,
    textAlign: 'center',
    fontSize: typography.caption,
    fontWeight: '700',
    color: colors.textMuted,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.md,
  },
  cell: {
    width: '14.28%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.xs,
  },
  cellText: {
    fontSize: typography.body,
    fontWeight: '600',
    color: colors.text,
  },
  cellTextSelected: {
    color: colors.white,
    fontWeight: '800',
  },
});
