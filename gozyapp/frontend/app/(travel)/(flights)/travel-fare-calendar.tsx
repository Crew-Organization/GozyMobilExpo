import React, { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSuperAppStore } from '@/src/store/super-app-store';
import { colors, spacing, radius } from '@/src/theme/tokens';
import { formatCurrency } from '@/src/lib/travel-data';

const { width } = Dimensions.get('window');

const months = [
  { id: 'apr', name: 'Apr 2026', days: 30, startDay: 3 }, // 1st Apr is Wednesday
  { id: 'may', name: 'May 2026', days: 31, startDay: 5 }, // 1st May is Friday
  { id: 'jun', name: 'Jun 2026', days: 30, startDay: 1 }, // 1st Jun is Monday
  { id: 'jul', name: 'Jul 2026', days: 31, startDay: 3 }, // 1st Jul is Wednesday
];

const daysOfWeek = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

// Price generator function for a date
function getPriceForDay(day: number, monthId: string) {
  // Make Sat Apr 11 and Sun Apr 12 match results page exactly
  if (monthId === 'apr') {
    if (day === 10) return 11678;
    if (day === 11) return 6646; // Sat
    if (day === 12) return 6130; // Sun
    if (day === 13) return 6130; // Mon
  }
  
  // Seed-based price generation for other dates
  const seed = (day * 7 + monthId.charCodeAt(0) * 3) % 100;
  if (seed < 20) return 6130 + (seed % 10) * 50; // Cheapest green
  if (seed < 70) return 8000 + (seed % 20) * 100; // Medium orange/black
  return 11000 + (seed % 15) * 200; // Expensive red/gray
}

export default function TravelFareCalendarScreen() {
  const { travelSearch, setTravelSearch } = useSuperAppStore();
  const [selectedMonth, setSelectedMonth] = useState('apr');
  
  // Parse existing departureDate (e.g. "2026-04-11") or default to 11
  const initialDay = travelSearch.departureDate ? parseInt(travelSearch.departureDate.split('-')[2]) || 11 : 11;
  const [selectedDay, setSelectedDay] = useState(initialDay);

  const monthObj = months.find((m) => m.id === selectedMonth) || months[0];
  const selectedPrice = getPriceForDay(selectedDay, selectedMonth);

  // Generate calendar grid array
  const gridCells: { day: number | null; price: number | null }[] = [];
  
  // Padding for the start day of the month (1-indexed startDay where 1=Mon, 7=Sun)
  // startDay - 1 empty cells are needed at the beginning
  const paddingCount = monthObj.startDay - 1;
  for (let i = 0; i < paddingCount; i++) {
    gridCells.push({ day: null, price: null });
  }

  // Fill in the actual days
  for (let d = 1; d <= monthObj.days; d++) {
    gridCells.push({ day: d, price: getPriceForDay(d, selectedMonth) });
  }

  const handleSelectDate = () => {
    // Format date string as YYYY-MM-DD
    const monthIndex = months.findIndex((m) => m.id === selectedMonth) + 4; // April is 4
    const monthStr = monthIndex < 10 ? `0${monthIndex}` : `${monthIndex}`;
    const dayStr = selectedDay < 10 ? `0${selectedDay}` : `${selectedDay}`;
    const formattedDate = `2026-${monthStr}-${dayStr}`;

    setTravelSearch({
      ...travelSearch,
      departureDate: formattedDate,
    });
    router.back();
  };

  const getPriceColor = (price: number) => {
    if (price <= 7000) return '#00A699'; // Green (Cheapest)
    if (price <= 10000) return '#4B5563'; // Gray/Black (Average)
    return '#EF4444'; // Red (High)
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={colors.text} />
        </Pressable>
        <View>
          <Text style={styles.headerTitle}>Fare Calendar</Text>
          <Text style={styles.headerSubtitle}>
            {travelSearch.originCode} → {travelSearch.destinationCode} • Select cheapest dates
          </Text>
        </View>
      </View>

      {/* Month Tabs */}
      <View style={styles.monthTabsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.monthTabsScroll}>
          {months.map((m) => {
            const active = selectedMonth === m.id;
            return (
              <Pressable
                key={m.id}
                onPress={() => {
                  setSelectedMonth(m.id);
                  setSelectedDay(1); // Reset day selection to 1st of month
                }}
                style={[styles.monthTab, active && styles.monthTabActive]}
              >
                <Text style={[styles.monthTabText, active && styles.monthTabTextActive]}>
                  {m.name}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Calendar Grid Container */}
        <View style={styles.calendarContainer}>
          {/* Weekday headers */}
          <View style={styles.weekdaysRow}>
            {daysOfWeek.map((day) => (
              <Text key={day} style={styles.weekdayText}>
                {day}
              </Text>
            ))}
          </View>

          {/* Calendar Grid Cells */}
          <View style={styles.gridContainer}>
            {gridCells.map((cell, index) => {
              if (cell.day === null) {
                return <View key={`empty-${index}`} style={styles.gridCellEmpty} />;
              }

              const isSelected = selectedDay === cell.day;
              const price = cell.price || 0;
              const priceColor = getPriceColor(price);

              return (
                <Pressable
                  key={`day-${cell.day}`}
                  onPress={() => setSelectedDay(cell.day!)}
                  style={[
                    styles.gridCell,
                    isSelected && styles.gridCellSelected,
                  ]}
                >
                  <Text style={[styles.dayText, isSelected && styles.dayTextSelected]}>
                    {cell.day}
                  </Text>
                  <Text
                    style={[
                      styles.priceText,
                      { color: isSelected ? '#FFFFFF' : priceColor },
                      isSelected && styles.priceTextSelected,
                    ]}
                    numberOfLines={1}
                  >
                    ₹{Math.round(price / 100) / 10}k
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Legend */}
        <View style={styles.legendContainer}>
          <View style={styles.legendItem}>
            <View style={[styles.legendIndicator, { backgroundColor: '#00A699' }]} />
            <Text style={styles.legendText}>Cheapest</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendIndicator, { backgroundColor: '#4B5563' }]} />
            <Text style={styles.legendText}>Average</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendIndicator, { backgroundColor: '#EF4444' }]} />
            <Text style={styles.legendText}>High Price</Text>
          </View>
        </View>

        {/* Information box */}
        <View style={styles.infoCard}>
          <MaterialCommunityIcons name="information" size={16} color="#0084FF" />
          <Text style={styles.infoText}>
            Fare calendar prices are indicative and based on history. Real-time rates will be updated during review.
          </Text>
        </View>
      </ScrollView>

      {/* Sticky Bottom Done Bar */}
      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.bottomDate}>
            {selectedDay} {monthObj.name.split(' ')[0]} 2026
          </Text>
          <Text style={styles.bottomPrice}>
            Fare starting: <Text style={{ color: getPriceColor(selectedPrice), fontWeight: '900' }}>{formatCurrency(selectedPrice)}</Text>
          </Text>
        </View>
        <Pressable onPress={handleSelectDate} style={styles.selectBtn}>
          <Text style={styles.selectBtnText}>SELECT DATE</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F4F7',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
  },
  headerSubtitle: {
    fontSize: 10.5,
    color: colors.textMuted,
    marginTop: 2,
  },
  monthTabsContainer: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  monthTabsScroll: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  monthTab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    backgroundColor: '#FFFFFF',
  },
  monthTabActive: {
    borderColor: '#0084FF',
    backgroundColor: '#F5FAFF',
  },
  monthTabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#8E8E93',
  },
  monthTabTextActive: {
    color: '#0084FF',
    fontWeight: '800',
  },
  scrollContent: {
    paddingBottom: 100,
  },
  calendarContainer: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  weekdaysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F4F7',
    marginBottom: 8,
  },
  weekdayText: {
    width: (width - 80) / 7,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '700',
    color: '#8E8E93',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: 8,
  },
  gridCell: {
    width: (width - 56) / 7,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'transparent',
    paddingVertical: 4,
  },
  gridCellEmpty: {
    width: (width - 56) / 7,
    height: 52,
  },
  gridCellSelected: {
    backgroundColor: '#0084FF',
    borderColor: '#0084FF',
  },
  dayText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#333333',
  },
  dayTextSelected: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  priceText: {
    fontSize: 9,
    fontWeight: '800',
    marginTop: 2,
  },
  priceTextSelected: {
    color: '#FFFFFF',
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
    marginVertical: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    fontSize: 10.5,
    color: '#666',
    fontWeight: '600',
  },
  infoCard: {
    backgroundColor: '#EBF4FF',
    margin: 16,
    padding: 12,
    borderRadius: 8,
    flexDirection: 'row',
    gap: 8,
    alignItems: 'flex-start',
  },
  infoText: {
    fontSize: 10.5,
    color: '#0084FF',
    flex: 1,
    lineHeight: 16,
    fontWeight: '500',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
  },
  bottomDate: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.text,
  },
  bottomPrice: {
    fontSize: 10.5,
    color: '#8E8E93',
    marginTop: 2,
  },
  selectBtn: {
    backgroundColor: '#0084FF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  selectBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
});
