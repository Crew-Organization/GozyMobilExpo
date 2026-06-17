import { useMemo, useState, useEffect } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  BackHandler,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { TrainFloatingBot } from '@/src/components/train/train-floating-bot';
import { IrctcLogoMark } from '@/src/components/train/train-logos';
import { popularTrainStations, type TrainStation } from '@/src/lib/train-stations';
import { useTrainSearchStore, type RecentSearch } from '@/src/store/train-search-store';

function startOfDay(date: Date) {
  const nextDate = new Date(date);
  nextDate.setHours(0, 0, 0, 0);
  return nextDate;
}

export default function TrainScreen() {
  const { 
    from, 
    to, 
    setFrom, 
    setTo, 
    recentSearches, 
    addRecentSearch 
  } = useTrainSearchStore();

  useEffect(() => {
    const handleBackPress = () => {
      router.replace('/(explore)');
      return true;
    };
    const subscription = BackHandler.addEventListener('hardwareBackPress', handleBackPress);
    return () => {
      subscription.remove();
    };
  }, []);

  const defaultFrom = popularTrainStations.find((station) => station.code === 'SBC') ?? popularTrainStations[5];
  const defaultTo = popularTrainStations.find((station) => station.code === 'ADI') ?? popularTrainStations[7];

  const [departureDate, setDepartureDate] = useState(() => {
    const today = new Date();
    today.setDate(today.getDate() + 1); // Default to tomorrow
    return today;
  });

  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [freeCancellation, setFreeCancellation] = useState(false);

  const formattedDate = useMemo(
    () =>
      departureDate.toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
      }),
    [departureDate],
  );
  
  const formattedDay = useMemo(
    () =>
      departureDate.toLocaleDateString('en-US', {
        weekday: 'long',
      }),
    [departureDate],
  );

  const handleQuickDate = (daysAhead: number) => {
    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + daysAhead);
    setDepartureDate(nextDate);
  };

  const isQuickDateActive = (daysAhead: number) => {
    const nextDate = new Date();
    nextDate.setHours(0, 0, 0, 0);
    nextDate.setDate(nextDate.getDate() + daysAhead);

    const selectedDate = new Date(departureDate);
    selectedDate.setHours(0, 0, 0, 0);

    return selectedDate.getTime() === nextDate.getTime();
  };

  const calendarToday = useMemo(() => startOfDay(new Date()), []);
  const calendarMaxDate = useMemo(() => {
    const maxDate = new Date(calendarToday);
    maxDate.setMonth(maxDate.getMonth() + 3);
    maxDate.setHours(23, 59, 59, 999);
    return maxDate;
  }, [calendarToday]);

  const monthsToRender = useMemo(() => {
    const list = [];
    const today = new Date();
    for (let i = 0; i < 3; i++) {
      list.push(new Date(today.getFullYear(), today.getMonth() + i, 1));
    }
    return list;
  }, []);

  const getMonthCells = (monthDate: Date) => {
    const year = monthDate.getFullYear();
    const month = monthDate.getMonth();
    const monthStart = new Date(year, month, 1);
    
    const leadingDays = monthStart.getDay() === 0 ? 6 : monthStart.getDay() - 1;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const cells: (Date | null)[] = Array(leadingDays).fill(null);
    for (let d = 1; d <= daysInMonth; d++) {
      cells.push(new Date(year, month, d));
    }
    return cells;
  };

  const isDateDisabled = (date: Date) => date < calendarToday || date > calendarMaxDate;

  const isSameDay = (left: Date, right: Date) => {
    return (
      left.getFullYear() === right.getFullYear() &&
      left.getMonth() === right.getMonth() &&
      left.getDate() === right.getDate()
    );
  };

  const selectCalendarDate = (date: Date) => {
    if (isDateDisabled(date)) return;
    const nextDate = new Date(date);
    nextDate.setHours(12, 0, 0, 0);
    setDepartureDate(nextDate);
    setIsCalendarOpen(false);
  };

  const handleSearch = () => {
    const selectedFrom = from ?? defaultFrom;
    const selectedTo = to ?? defaultTo;

    addRecentSearch({
      id: 'rs-' + Math.random().toString(36).substring(2, 9),
      fromCode: selectedFrom.code,
      fromCity: selectedFrom.city,
      toCode: selectedTo.code,
      toCity: selectedTo.city,
      dateText: formattedDate + ' ' + departureDate.getFullYear().toString().substring(2),
    });

    router.push({
      pathname: '/train-results',
      params: {
        fromCode: selectedFrom.code,
        fromName: selectedFrom.city,
        toCode: selectedTo.code,
        toName: selectedTo.city,
        date: departureDate.toISOString(),
      },
    });
  };

  const insets = useSafeAreaInsets();
  const fromLine = from ? `${from.city}, ${from.name}` : 'Enter City, Station name or Station code';
  const toLine = to ? `${to.city}, ${to.name}` : 'Enter City, Station name or Station code';

  return (
    <View style={styles.safeArea}>
      <View style={[styles.screen, { paddingTop: insets.top }]}>
        
        {/* Header */}
        <View style={styles.header}>
          <Pressable hitSlop={12} onPress={() => router.back()} style={styles.backBtn}>
            <MaterialCommunityIcons color="#0F172A" name="arrow-left" size={24} />
          </Pressable>
          <Text style={styles.headerTitle}>Trains Search</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          
          {/* Main Search Panel */}
          <View style={styles.searchPanel}>
            
            <View style={styles.fieldRow}>
              <View style={styles.fieldIconColumn}>
                <View style={styles.circleDot} />
                <View style={styles.verticalLine} />
                <View style={styles.squareDot} />
              </View>

              <View style={styles.fieldInputsColumn}>
                <Pressable onPress={() => router.push('/train-station?field=from')} style={styles.inputBox}>
                  <Text style={styles.inputLabel}>FROM</Text>
                  <Text numberOfLines={1} style={[styles.inputValue, !from && styles.inputPlaceholder]}>
                    {fromLine}
                  </Text>
                </Pressable>

                <View style={styles.divider} />

                <Pressable onPress={() => router.push('/train-station?field=to')} style={styles.inputBox}>
                  <Text style={styles.inputLabel}>TO</Text>
                  <Text numberOfLines={1} style={[styles.inputValue, !to && styles.inputPlaceholder]}>
                    {toLine}
                  </Text>
                </Pressable>
              </View>

              <Pressable
                hitSlop={10}
                onPress={() => {
                  const currentFrom = from ?? defaultFrom;
                  const currentTo = to ?? defaultTo;
                  setFrom(currentTo);
                  setTo(currentFrom);
                }}
                style={styles.swapBtn}
              >
                <MaterialCommunityIcons color="#0084FF" name="swap-vertical" size={24} />
              </Pressable>
            </View>

            <View style={styles.dateSection}>
              <Pressable onPress={() => setIsCalendarOpen(true)} style={styles.dateBox}>
                <View style={styles.dateIconBox}>
                  <MaterialCommunityIcons name="calendar-month-outline" size={20} color="#64748B" />
                </View>
                <View>
                  <Text style={styles.inputLabel}>DATE</Text>
                  <View style={styles.dateValueRow}>
                    <Text style={styles.dateValueMain}>{formattedDate}</Text>
                    <Text style={styles.dateValueSub}>{formattedDay}</Text>
                  </View>
                </View>
              </Pressable>
              <View style={styles.quickDateRow}>
                <Pressable 
                  onPress={() => handleQuickDate(1)}
                  style={[styles.quickPill, isQuickDateActive(1) && styles.quickPillActive]}
                >
                  <Text style={[styles.quickPillText, isQuickDateActive(1) && styles.quickPillTextActive]}>Tomorrow</Text>
                </Pressable>
                <Pressable 
                  onPress={() => handleQuickDate(2)}
                  style={[styles.quickPill, isQuickDateActive(2) && styles.quickPillActive]}
                >
                  <Text style={[styles.quickPillText, isQuickDateActive(2) && styles.quickPillTextActive]}>Day After</Text>
                </Pressable>
              </View>
            </View>

            {/* Free Cancellation Toggle */}
            <Pressable onPress={() => setFreeCancellation(!freeCancellation)} style={[styles.cancellationBox, freeCancellation && styles.cancellationBoxActive]}>
              <View style={[styles.checkbox, freeCancellation && styles.checkboxActive]}>
                {freeCancellation && <MaterialCommunityIcons name="check" size={14} color="#FFF" />}
              </View>
              <View style={styles.cancellationTextWrap}>
                <Text style={styles.cancellationTitle}>Add Free Cancellation and get full fare refund</Text>
                <Text style={styles.cancellationSubtitle}>Zero cancellation fee on all bookings</Text>
              </View>
              <MaterialCommunityIcons name="shield-check" size={24} color="#0084FF" />
            </Pressable>

            <Pressable onPress={handleSearch} style={styles.searchButton}>
              <Text style={styles.searchButtonText}>SEARCH</Text>
            </Pressable>

            <View style={styles.partnerRow}>
              <IrctcLogoMark size={24} />
              <Text style={styles.partnerText}>IRCTC Authorised Partner</Text>
            </View>
          </View>

          {/* OFFERS Section */}
          <View style={styles.sectionHeaderRow}>
            <MaterialCommunityIcons name="tag-outline" size={18} color="#8B5CF6" />
            <Text style={styles.sectionTitleText}>OFFERS</Text>
          </View>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
            <View style={styles.offerCard}>
              <Image source={{ uri: 'https://images.unsplash.com/photo-1541819665675-9799298e8339?auto=format&fit=crop&w=300&q=80' }} style={styles.offerImage} />
              <View style={styles.offerOverlay}>
                <View style={styles.offerBadge}><Text style={styles.offerBadgeText}>TRAINS</Text></View>
                <View style={{ flex: 1 }} />
                <Text style={styles.offerTitle}>GRAB UP TO 40% OFF*</Text>
                <Text style={styles.offerSub}>on domestic trains</Text>
              </View>
            </View>
            <View style={styles.offerCard}>
              <Image source={{ uri: 'https://images.unsplash.com/photo-1532274402911-5a369e4c4bb5?auto=format&fit=crop&w=300&q=80' }} style={styles.offerImage} />
              <View style={styles.offerOverlay}>
                <View style={[styles.offerBadge, { backgroundColor: '#F59E0B' }]}><Text style={styles.offerBadgeText}>OFFER</Text></View>
                <View style={{ flex: 1 }} />
                <Text style={styles.offerTitle}>FLAT ₹150 OFF*</Text>
                <Text style={styles.offerSub}>on your first booking</Text>
              </View>
            </View>
          </ScrollView>

          {/* Features Our Users Love */}
          <Text style={styles.plainSectionTitle}>Features Our Users Love</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
            <View style={[styles.featureCard, { backgroundColor: '#F0FDF4' }]}>
              <View style={styles.featureLeft}>
                <Text style={styles.featureTitle}>Confirmed Seats</Text>
                <Text style={styles.featureDesc}>Get a Confirmed Ticket or 3x Refund if waitlisted.</Text>
                <Pressable style={[styles.featureBtn, { backgroundColor: '#0084FF' }]}>
                  <Text style={styles.featureBtnText}>KNOW MORE</Text>
                </Pressable>
              </View>
              <View style={styles.featureRight}>
                <MaterialCommunityIcons name="ticket-confirmation-outline" size={40} color="#10B981" />
              </View>
            </View>
            <View style={[styles.featureCard, { backgroundColor: '#EFF6FF' }]}>
              <View style={styles.featureLeft}>
                <Text style={styles.featureTitle}>Link Aadhaar to IRCTC</Text>
                <Text style={styles.featureDesc}>Mandatory from 1 Jul 25 for tatkal bookings.</Text>
                <Pressable style={[styles.featureBtn, { backgroundColor: '#0084FF' }]}>
                  <Text style={styles.featureBtnText}>Link Aadhaar</Text>
                </Pressable>
              </View>
              <View style={styles.featureRight}>
                <MaterialCommunityIcons name="fingerprint" size={40} color="#3B82F6" />
              </View>
            </View>
          </ScrollView>

          {/* Pagination dots (mock) */}
          <View style={styles.paginationRow}>
            <View style={[styles.dot, styles.dotActive]} />
            <View style={styles.dot} />
            <View style={styles.dot} />
            <View style={styles.dot} />
          </View>

          {/* Food On Train */}
          <Text style={styles.plainSectionTitle}>Food On Train</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
            <View style={[styles.featureCard, { backgroundColor: '#FFF7ED', borderColor: '#FFEDD5' }]}>
              <View style={styles.featureLeft}>
                <Text style={[styles.featureTitle, { color: '#C2410C' }]}>Order Food on Train</Text>
                <Text style={styles.featureDesc}>Get piping hot food delivered right to your seat!</Text>
                <Pressable style={[styles.featureBtn, { backgroundColor: '#EA580C' }]}>
                  <Text style={styles.featureBtnText}>ORDER NOW</Text>
                </Pressable>
              </View>
              <View style={styles.featureRight}>
                <MaterialCommunityIcons name="food" size={40} color="#F97316" />
              </View>
            </View>
          </ScrollView>

          {/* Banner Ad 1 */}
          <Image source={{ uri: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=600&q=80' }} style={styles.bannerAdImage} />

          {/* Why Book With Us */}
          <Text style={styles.plainSectionTitle}>Why Book With Us?</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
            <View style={styles.whyUsCard}>
              <View style={[styles.whyUsIcon, { backgroundColor: '#FEF3C7' }]}>
                <MaterialCommunityIcons name="account-group-outline" size={24} color="#D97706" />
              </View>
              <Text style={styles.whyUsText}>Trusted by over 50 Lac Users</Text>
            </View>
            <View style={styles.whyUsCard}>
              <View style={[styles.whyUsIcon, { backgroundColor: '#E0E7FF' }]}>
                <MaterialCommunityIcons name="headphones" size={24} color="#4F46E5" />
              </View>
              <Text style={styles.whyUsText}>Get 24x7 dedicated support</Text>
            </View>
            <View style={styles.whyUsCard}>
              <View style={[styles.whyUsIcon, { backgroundColor: '#DCFCE7' }]}>
                <MaterialCommunityIcons name="cash-refund" size={24} color="#16A34A" />
              </View>
              <Text style={styles.whyUsText}>Instant Refunds. Fast & hassle-free!</Text>
            </View>
          </ScrollView>

          {/* Announcements */}
          <View style={styles.announcementBox}>
            <View style={styles.announcementHeader}>
              <MaterialCommunityIcons name="bullhorn-outline" size={16} color="#F59E0B" />
              <Text style={styles.announcementTitle}>ANNOUNCEMENTS</Text>
            </View>
            <Text style={styles.announcementText}>
              Chart preparation will now happen 4 hours before departure as per Indian Railways directive.
            </Text>
          </View>

          {/* Banner Ad 2 */}
          <Image source={{ uri: 'https://images.unsplash.com/photo-1506012787146-f92b2d7d6d96?auto=format&fit=crop&w=600&q=80' }} style={styles.bannerAdImage} />

        </ScrollView>

        <Modal
          visible={isCalendarOpen}
          transparent={false}
          animationType="slide"
          onRequestClose={() => setIsCalendarOpen(false)}
        >
          <View style={styles.calendarModalContainer}>
            <View style={styles.calendarHeaderRow}>
              <Pressable hitSlop={12} onPress={() => setIsCalendarOpen(false)} style={styles.calendarBackArrowBtn}>
                <MaterialCommunityIcons color="#0F172A" name="close" size={24} />
              </Pressable>
              <Text style={styles.calendarModalHeaderTitle}>Select Date</Text>
            </View>

            <View style={styles.calendarWeekdayTitlesRow}>
              {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map((dayAbbrev) => (
                <Text key={dayAbbrev} style={styles.weekdayLabelHeader}>
                  {dayAbbrev}
                </Text>
              ))}
            </View>

            <ScrollView showsVerticalScrollIndicator={true} contentContainerStyle={styles.calendarMonthsScrollList}>
              {monthsToRender.map((monthDate) => {
                const monthTitleString = monthDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
                const dayCells = getMonthCells(monthDate);

                return (
                  <View key={monthDate.toISOString()} style={styles.calendarMonthBlock}>
                    <Text style={styles.calendarMonthHeading}>{monthTitleString}</Text>
                    <View style={styles.daysGridContainer}>
                      {dayCells.map((cell, index) => {
                        if (!cell) {
                          return <View key={`blank-${monthDate.toISOString()}-${index}`} style={styles.dayGridCellBlank} />;
                        }

                        const disabled = isDateDisabled(cell);
                        const selected = isSameDay(cell, departureDate);

                        return (
                          <Pressable
                            key={cell.toISOString()}
                            disabled={disabled}
                            onPress={() => selectCalendarDate(cell)}
                            style={[
                              styles.dayGridCellActive,
                              selected && styles.dayGridCellSelected,
                              disabled && styles.dayGridCellDisabled,
                            ]}
                          >
                            <Text style={[
                              styles.dayCellTextLabel,
                              selected && styles.dayCellTextSelected,
                              disabled && styles.dayCellTextDisabled,
                            ]}>
                              {cell.getDate()}
                            </Text>
                          </Pressable>
                        );
                      })}
                    </View>
                  </View>
                );
              })}
            </ScrollView>
          </View>
        </Modal>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  screen: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  searchPanel: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 8,
    borderBottomColor: '#F8FAFC',
  },
  fieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  fieldIconColumn: {
    alignItems: 'center',
    marginRight: 12,
  },
  circleDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#94A3B8',
  },
  verticalLine: {
    width: 2,
    height: 36,
    backgroundColor: '#E2E8F0',
    marginVertical: 4,
  },
  squareDot: {
    width: 8,
    height: 8,
    backgroundColor: '#94A3B8',
  },
  fieldInputsColumn: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
  },
  inputBox: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  inputLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 4,
  },
  inputValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  inputPlaceholder: {
    color: '#94A3B8',
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginHorizontal: 16,
  },
  swapBtn: {
    position: 'absolute',
    right: 16,
    top: '50%',
    marginTop: -16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
    padding: 12,
    marginBottom: 16,
  },
  dateBox: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  dateIconBox: {
    marginRight: 12,
  },
  dateValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  dateValueMain: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  dateValueSub: {
    fontSize: 12,
    color: '#64748B',
  },
  quickDateRow: {
    flexDirection: 'row',
    gap: 8,
  },
  quickPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },
  quickPillActive: {
    backgroundColor: '#EFF6FF',
    borderColor: '#0084FF',
  },
  quickPillText: {
    fontSize: 10.5,
    fontWeight: '600',
    color: '#64748B',
  },
  quickPillTextActive: {
    color: '#0084FF',
  },
  cancellationBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
    marginBottom: 16,
  },
  cancellationBoxActive: {
    backgroundColor: '#EFF6FF',
    borderColor: '#BFDBFE',
  },
  checkbox: {
    width: 18,
    height: 18,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    borderRadius: 4,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxActive: {
    backgroundColor: '#0084FF',
    borderColor: '#0084FF',
  },
  cancellationTextWrap: {
    flex: 1,
  },
  cancellationTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 2,
  },
  cancellationSubtitle: {
    fontSize: 10.5,
    color: '#64748B',
  },
  searchButton: {
    backgroundColor: '#0084FF',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  searchButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  partnerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  partnerText: {
    fontSize: 10.5,
    color: '#64748B',
    fontWeight: '500',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    marginBottom: 12,
    gap: 6,
  },
  sectionTitleText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F172A',
  },
  plainSectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
    paddingHorizontal: 16,
    paddingTop: 24,
    marginBottom: 12,
  },
  horizontalScroll: {
    paddingHorizontal: 16,
    gap: 12,
  },
  offerCard: {
    width: 240,
    height: 140,
    borderRadius: 8,
    overflow: 'hidden',
  },
  offerImage: {
    ...StyleSheet.absoluteFillObject,
  },
  offerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: 12,
  },
  offerBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#A855F7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  offerBadgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '800',
  },
  offerTitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 2,
  },
  offerSub: {
    color: '#FFF',
    fontSize: 12,
  },
  featureCard: {
    width: 280,
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  featureLeft: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 6,
  },
  featureDesc: {
    fontSize: 12,
    color: '#475569',
    marginBottom: 12,
    lineHeight: 18,
  },
  featureBtn: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  featureBtnText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  featureRight: {
    justifyContent: 'center',
    paddingLeft: 12,
  },
  paginationRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    marginTop: 16,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#CBD5E1',
  },
  dotActive: {
    backgroundColor: '#0F172A',
  },
  bannerAdImage: {
    height: 120,
    marginHorizontal: 16,
    marginTop: 24,
    borderRadius: 8,
  },
  whyUsCard: {
    width: 140,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    alignItems: 'flex-start',
  },
  whyUsIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  whyUsText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0F172A',
  },
  announcementBox: {
    marginHorizontal: 16,
    marginTop: 24,
    padding: 16,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
  },
  announcementHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  announcementTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F172A',
  },
  announcementText: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 18,
  },
  calendarModalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  calendarHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  calendarBackArrowBtn: {
    padding: 4,
    marginRight: 12,
  },
  calendarModalHeaderTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  calendarWeekdayTitlesRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingVertical: 12,
  },
  weekdayLabelHeader: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  calendarMonthsScrollList: {
    paddingBottom: 40,
  },
  calendarMonthBlock: {
    paddingTop: 16,
  },
  calendarMonthHeading: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    marginLeft: 16,
    marginBottom: 16,
  },
  daysGridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayGridCellBlank: {
    width: '14.28%',
    height: 48,
  },
  dayGridCellActive: {
    width: '14.28%',
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayGridCellSelected: {
    backgroundColor: '#0084FF',
    borderRadius: 24,
  },
  dayGridCellDisabled: {
    opacity: 0.3,
  },
  dayCellTextLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0F172A',
  },
  dayCellTextSelected: {
    color: '#FFFFFF',
  },
  dayCellTextDisabled: {
    color: '#94A3B8',
  },
});
