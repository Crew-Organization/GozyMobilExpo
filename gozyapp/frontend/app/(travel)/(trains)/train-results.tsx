import { useCallback, useEffect, useMemo, useState } from 'react';
import { FlashList } from '@shopify/flash-list';
import { router, useLocalSearchParams } from 'expo-router';
import { Alert, Modal, Pressable, ScrollView, StyleSheet, Text, View, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { DateCarousel, type DateChip } from '@/src/components/train/DateCarousel';
import { SearchHeader } from '@/src/components/train/SearchHeader';
import { StickyFilterBar } from '@/src/components/train/StickyFilterBar';
import { TrainCard } from '@/src/components/train/TrainCard';
import { TrainFloatingBot } from '@/src/components/train/train-floating-bot';
import { TransportTabs, type TransportType } from '@/src/components/train/TransportTabs';
import { api } from '@/src/lib/api';
import { trainSearchResults, type TrainAvailability, type TrainSearchResult } from '@/src/lib/train-search-results';
import { useTrainSearchStore } from '@/src/store/train-search-store';

// ====================== MOCK BUS DATA ======================
type BusSearchResult = {
  id: string;
  operator: string;
  type: string;
  departure: string;
  arrival: string;
  duration: string;
  price: number;
  seatsLeft: number;
  rating: number;
  isMegabus?: boolean;
};

const mockBusResults: BusSearchResult[] = [
  {
    id: 'b1',
    operator: 'M R Travels',
    type: 'Bharat Benz A/C Seater / Sleeper (2+1)',
    departure: '16:00',
    arrival: '23:59',
    duration: '07h 59m',
    price: 1938,
    seatsLeft: 29,
    rating: 3.8,
  },
  {
    id: 'b2',
    operator: 'Shri Mallinath Tours And Travels',
    type: 'A/C Sleeper (2+1)',
    departure: '20:00',
    arrival: '01:30',
    duration: '05h 30m',
    price: 3800,
    seatsLeft: 42,
    rating: 4.2,
  },
  {
    id: 'b3',
    operator: 'VRL Travels',
    type: 'Volvo 9600 Multi-Axle A/C Sleeper (2+1)',
    departure: '22:30',
    arrival: '03:30',
    duration: '05h 00m',
    price: 4600,
    seatsLeft: 30,
    rating: 4.9,
    isMegabus: true,
  },
  {
    id: 'b4',
    operator: 'R L CITY TRAVELS',
    type: 'A/C Sleeper (2+1)',
    departure: '22:10',
    arrival: '03:30',
    duration: '05h 20m',
    price: 5200,
    seatsLeft: 26,
    rating: 4.4,
  },
  {
    id: 'b5',
    operator: 'Sandesha Travels',
    type: 'A/C Sleeper (2+1)',
    departure: '20:00',
    arrival: '02:00',
    duration: '06h 00m',
    price: 4000,
    seatsLeft: 13,
    rating: 4.3,
  },
];

// ====================== HELPERS ======================

function normalizeDate(date: Date) {
  const nextDate = new Date(date);
  nextDate.setHours(12, 0, 0, 0);
  return nextDate;
}

function formatDateLabel(dateString?: string) {
  const parsedDate = dateString ? new Date(dateString) : new Date();
  const safeDate = Number.isNaN(parsedDate.getTime()) ? new Date() : parsedDate;
  const day = safeDate.toLocaleDateString('en-US', { day: 'numeric' });
  const month = safeDate.toLocaleDateString('en-US', { month: 'short' });
  const weekday = safeDate.toLocaleDateString('en-US', { weekday: 'long' });
  return `${day} ${month}, ${weekday}`;
}

function buildDayStrip(dateString?: string): DateChip[] {
  const parsedDate = dateString ? new Date(dateString) : new Date();
  const safeDate = Number.isNaN(parsedDate.getTime()) ? new Date() : parsedDate;
  const baseDate = new Date(safeDate.getFullYear(), safeDate.getMonth(), safeDate.getDate());

  return Array.from({ length: 15 }).map((_, index) => {
    const currentDate = new Date(baseDate);
    currentDate.setDate(baseDate.getDate() + index);

    return {
      key: currentDate.toISOString(),
      monthTag: currentDate.toLocaleDateString('en-US', { month: 'short' }).toUpperCase(),
      dayLabel: currentDate.toLocaleDateString('en-US', { day: 'numeric' }),
      weekdayLabel: currentDate.toLocaleDateString('en-US', { weekday: 'short' }),
    };
  });
}

function getLowestPrice(item: TrainSearchResult) {
  return item.availability.reduce((lowest, slot) => Math.min(lowest, slot.price), item.availability[0]?.price ?? 0);
}

// ====================== COMPONENT ======================

export default function TrainResultsScreen() {
  const params = useLocalSearchParams<{
    date?: string;
    fromCode?: string;
    fromName?: string;
    toCode?: string;
    toName?: string;
  }>();
  
  const { from, setBookingSelection, to } = useTrainSearchStore();
  const [activeTab, setActiveTab] = useState<TransportType>('Trains');
  const [activeDayIndex, setActiveDayIndex] = useState(0);
  const [results, setResults] = useState<TrainSearchResult[]>(trainSearchResults);
  
  // Modals state
  const [isSortFilterOpen, setIsSortFilterOpen] = useState(false);
  const [modalTab, setModalTab] = useState<'Sort' | 'Filter'>('Filter');
  
  // Sort state
  const [selectedSort, setSelectedSort] = useState<string>('availability');
  
  // Filters state
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [selectedQuota, setSelectedQuota] = useState<'GENERAL' | 'TATKAL' | 'LADIES'>('GENERAL');
  
  // Bottom sheet
  const [activeBusFilterSheet, setActiveBusFilterSheet] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    api
      .searchTrains({
        fromCode: params.fromCode || 'SBC',
        fromName: params.fromName || 'Bangalore',
        toCode: params.toCode || 'ADI',
        toName: params.toName || 'Ahmedabad',
        date: params.date || new Date().toISOString(),
      })
      .then((response) => {
        if (!mounted) return;
        setResults(response.length ? response : trainSearchResults);
      })
      .catch(() => {
        if (!mounted) return;
        setResults(trainSearchResults);
      });
    return () => { mounted = false; };
  }, [params.date, params.fromCode, params.fromName, params.toCode, params.toName]);

  const fromLabel = from?.city ?? params.fromName ?? params.fromCode ?? 'Bangalore';
  const toLabel = to?.city ?? params.toName ?? params.toCode ?? 'Ahmedabad';
  const routeTitle = `${fromLabel} To ${toLabel}`;
  
  const baseJourneyDate = useMemo(() => normalizeDate(params.date ? new Date(params.date) : new Date()), [params.date]);
  const selectedJourneyDate = useMemo(() => {
    const nextDate = new Date(baseJourneyDate);
    nextDate.setDate(baseJourneyDate.getDate() + activeDayIndex);
    return normalizeDate(nextDate);
  }, [activeDayIndex, baseJourneyDate]);
  
  const dateLabel = useMemo(() => formatDateLabel(selectedJourneyDate.toISOString()), [selectedJourneyDate]);
  const dayStrip = useMemo(() => buildDayStrip(params.date), [params.date]);

  const lowestTrainFare = useMemo(() => {
    const lowest = results.length ? Math.min(...results.map(getLowestPrice)) : 720;
    return `₹${lowest}`;
  }, [results]);

  const lowestBusFare = useMemo(() => {
    const lowest = mockBusResults.length ? Math.min(...mockBusResults.map(b => b.price)) : 1938;
    return `₹${lowest}`;
  }, []);

  const toggleFilter = useCallback((chip: string) => {
    setSelectedFilters(prev => prev.includes(chip) ? prev.filter(c => c !== chip) : [...prev, chip]);
  }, []);

  const renderTrainItem = useCallback(({ item, index }: { item: TrainSearchResult; index: number }) => (
    <TrainCard
      index={index}
      item={item}
      onSeatPress={(train, slot) => {
        setBookingSelection({
          journeyDate: selectedJourneyDate.toISOString(),
          routeTitle,
          slot,
          train,
        });
        router.push('/train-booking');
      }}
    />
  ), [routeTitle, selectedJourneyDate, setBookingSelection]);

  const renderBusItem = useCallback(({ item }: { item: BusSearchResult }) => (
    <View style={styles.busCard}>
      {item.isMegabus && (
        <View style={styles.megabusBanner}>
          <MaterialCommunityIcons name="star-circle" size={14} color="#EF4444" />
          <Text style={styles.megabusBannerText}>MEGABUS</Text>
          <Text style={styles.megabusBannerSub}>Get discount up to 10% on your bus bookings!</Text>
          <Text style={styles.megabusBannerCopy}>Copy</Text>
        </View>
      )}
      
      <View style={styles.busCardInner}>
        <View style={styles.busHeaderRow}>
          <Text style={styles.busOperator}>{item.operator}</Text>
          <View style={styles.busRatingPill}>
            <MaterialCommunityIcons name="star" size={10} color="#FFF" />
            <Text style={styles.busRatingText}>{item.rating}</Text>
          </View>
        </View>
        <Text style={styles.busType}>{item.type}</Text>
        
        <View style={styles.busTimeRow}>
          <View style={styles.busTimeCol}>
            <Text style={styles.busTimeText}>{item.departure}</Text>
            <Text style={styles.busSeatsText}>{item.seatsLeft} Seats Left</Text>
          </View>
          <View style={styles.busDurationCol}>
            <Text style={styles.busDurationText}>- {item.duration} -</Text>
          </View>
          <View style={styles.busTimeColRight}>
            <Text style={styles.busTimeText}>{item.arrival}</Text>
            <Text style={styles.busNextDay}>(next day)</Text>
          </View>
          <View style={styles.busPriceCol}>
            <Text style={styles.busPriceText}>₹{item.price.toLocaleString()}</Text>
          </View>
        </View>
      </View>
    </View>
  ), []);

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <View style={styles.screen}>
        
        <SearchHeader dateLabel={dateLabel} routeTitle={routeTitle} onBack={() => router.back()} onEdit={() => router.back()} />
        
        <TransportTabs
          activeTab={activeTab}
          onTabSelect={setActiveTab}
          trainFareLabel={lowestTrainFare}
          trainMetaLabel="29h 27m"
          busFareLabel={lowestBusFare}
          busMetaLabel="28h 45m"
        />
        
        {activeTab === 'Trains' && (
          <View style={{ paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#FFF' }}>
            <View style={styles.loginBannerCard}>
              <View style={styles.loginBannerIcon}><MaterialCommunityIcons name="account-circle-outline" size={24} color="#F59E0B" /></View>
              <View style={{ flex: 1 }}>
                <Text style={styles.loginBannerTitle}>Login Now</Text>
                <Text style={styles.loginBannerSub}>To use your saved profile</Text>
              </View>
              <MaterialCommunityIcons name="arrow-right" size={20} color="#0084FF" />
            </View>
            <View style={[styles.loginBannerCard, { backgroundColor: '#F0FDF4', borderColor: '#DCFCE7', marginTop: 8 }]}>
              <View style={styles.loginBannerIcon}><MaterialCommunityIcons name="shield-check" size={24} color="#10B981" /></View>
              <View style={{ flex: 1 }}>
                <Text style={styles.loginBannerTitle}>Confirmed Ticket or 3x Refund</Text>
                <Text style={styles.loginBannerSub}>Opt-in if your ticket remains waitlisted</Text>
              </View>
            </View>
          </View>
        )}

        {activeTab === 'Trains' ? (
          <FlashList
            data={results}
            keyExtractor={(item) => item.id}
            renderItem={renderTrainItem}
            ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <FlashList
            data={mockBusResults}
            keyExtractor={(item) => item.id}
            renderItem={renderBusItem}
            ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
            contentContainerStyle={[styles.listContent, { paddingBottom: 100 }]}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={
              <View style={styles.busPromoRow}>
                <View style={[styles.busPromoCard, { backgroundColor: '#E0F2FE' }]}>
                  <Text style={styles.busPromoTitle}>Free Cancellation</Text>
                  <Text style={styles.busPromoSub}>Get 100% refund + no cancellation fee</Text>
                </View>
                <View style={[styles.busPromoCard, { backgroundColor: '#FFEDD5' }]}>
                  <Text style={[styles.busPromoTitle, { color: '#C2410C' }]}>Return trip offers</Text>
                  <Text style={[styles.busPromoSub, { color: '#C2410C' }]}>Upto 10% off on booking return tickets</Text>
                </View>
              </View>
            }
          />
        )}

        <TrainFloatingBot bottom={80} />

        <View style={styles.busBottomFilterBar}>
          <Pressable onPress={() => setActiveBusFilterSheet('Seat')} style={styles.busFilterTab}>
            <MaterialCommunityIcons name="seat-passenger" size={20} color="#0F172A" />
            <Text style={styles.busFilterTabText}>Seat</Text>
          </Pressable>
          <Pressable onPress={() => setActiveBusFilterSheet('Timing')} style={styles.busFilterTab}>
            <MaterialCommunityIcons name="clock-outline" size={20} color="#0F172A" />
            <Text style={styles.busFilterTabText}>Timing</Text>
          </Pressable>
          {activeTab === 'Buses' && (
            <Pressable onPress={() => setActiveBusFilterSheet('AC')} style={styles.busFilterTab}>
              <MaterialCommunityIcons name="snowflake" size={20} color="#0F172A" />
              <Text style={styles.busFilterTabText}>AC</Text>
            </Pressable>
          )}
          <Pressable onPress={() => { setIsSortFilterOpen(true); setModalTab('Sort'); }} style={styles.busFilterTab}>
            <MaterialCommunityIcons name="sort-variant" size={20} color="#0F172A" />
            <Text style={styles.busFilterTabText}>Sort</Text>
          </Pressable>
          <Pressable onPress={() => { setIsSortFilterOpen(true); setModalTab('Filter'); }} style={styles.busFilterTab}>
            <MaterialCommunityIcons name="tune" size={20} color="#0F172A" />
            <Text style={styles.busFilterTabText}>Filters</Text>
          </Pressable>
        </View>

        {/* Trains Sort & Filter Modal */}
        <Modal animationType="slide" onRequestClose={() => setIsSortFilterOpen(false)} visible={isSortFilterOpen}>
          <SafeAreaView style={styles.modalSafe}>
            <View style={styles.modalHeader}>
              <View style={styles.modalHeaderLeft}>
                <Pressable hitSlop={12} onPress={() => setIsSortFilterOpen(false)} style={styles.modalBackButton}>
                  <MaterialCommunityIcons color="#0F172A" name="close" size={26} />
                </Pressable>
                <View>
                  <Text style={styles.modalTitle}>Sort & Filter</Text>
                  <Text style={styles.modalSubtitle}>{results.length} trains found</Text>
                </View>
              </View>
              <Pressable onPress={() => { setSelectedSort('availability'); setSelectedFilters([]); setSelectedQuota('GENERAL'); }}>
                <Text style={styles.clearText}>Clear All</Text>
              </Pressable>
            </View>

            <View style={styles.modalTabs}>
              <Pressable onPress={() => setModalTab('Sort')} style={[styles.modalTab, modalTab === 'Sort' && styles.modalTabActive]}>
                <Text style={[styles.modalTabText, modalTab === 'Sort' && styles.modalTabTextActive]}>Sort</Text>
              </Pressable>
              <Pressable onPress={() => setModalTab('Filter')} style={[styles.modalTab, modalTab === 'Filter' && styles.modalTabActive]}>
                <Text style={[styles.modalTabText, modalTab === 'Filter' && styles.modalTabTextActive]}>Filter</Text>
              </Pressable>
            </View>

            <ScrollView contentContainerStyle={styles.modalScroll}>
              {modalTab === 'Sort' ? (
                <View style={styles.filterSection}>
                  <Pressable onPress={() => setSelectedSort('relevance')} style={styles.radioRow}>
                    <Text style={styles.radioLabel}>Relevance</Text>
                    {selectedSort === 'relevance' && <MaterialCommunityIcons name="check" size={20} color="#0084FF" />}
                  </Pressable>
                  <View style={styles.dividerLine} />
                  <Pressable onPress={() => setSelectedSort('rating')} style={styles.radioRow}>
                    <Text style={styles.radioLabel}>Rating</Text>
                    {selectedSort === 'rating' && <MaterialCommunityIcons name="check" size={20} color="#0084FF" />}
                  </Pressable>
                  <View style={styles.dividerLine} />
                  <Pressable onPress={() => setSelectedSort('price')} style={styles.radioRow}>
                    <Text style={styles.radioLabel}>Price - low to high</Text>
                    {selectedSort === 'price' && <MaterialCommunityIcons name="check" size={20} color="#0084FF" />}
                  </Pressable>
                  <View style={styles.dividerLine} />
                  <Pressable onPress={() => setSelectedSort('availability')} style={styles.radioRow}>
                    <Text style={styles.radioLabel}>Available tickets First</Text>
                    {selectedSort === 'availability' && <MaterialCommunityIcons name="check" size={20} color="#0084FF" />}
                  </Pressable>
                  <View style={styles.dividerLine} />
                  <Pressable onPress={() => setSelectedSort('duration')} style={styles.radioRow}>
                    <Text style={styles.radioLabel}>Duration (Shortest First)</Text>
                    {selectedSort === 'duration' && <MaterialCommunityIcons name="check" size={20} color="#0084FF" />}
                  </Pressable>
                  <View style={styles.dividerLine} />
                  <Pressable onPress={() => setSelectedSort('departure_early')} style={styles.radioRow}>
                    <Text style={styles.radioLabel}>Departure (Early First)</Text>
                    {selectedSort === 'departure_early' && <MaterialCommunityIcons name="check" size={20} color="#0084FF" />}
                  </Pressable>
                  <View style={styles.dividerLine} />
                  <Pressable onPress={() => setSelectedSort('departure_late')} style={styles.radioRow}>
                    <Text style={styles.radioLabel}>Departure (Late First)</Text>
                    {selectedSort === 'departure_late' && <MaterialCommunityIcons name="check" size={20} color="#0084FF" />}
                  </Pressable>
                  <View style={styles.dividerLine} />
                  <Pressable onPress={() => setSelectedSort('arrival_early')} style={styles.radioRow}>
                    <Text style={styles.radioLabel}>Arrival (Early First)</Text>
                    {selectedSort === 'arrival_early' && <MaterialCommunityIcons name="check" size={20} color="#0084FF" />}
                  </Pressable>
                  <View style={styles.dividerLine} />
                  <Pressable onPress={() => setSelectedSort('arrival_late')} style={styles.radioRow}>
                    <Text style={styles.radioLabel}>Arrival (Late First)</Text>
                    {selectedSort === 'arrival_late' && <MaterialCommunityIcons name="check" size={20} color="#0084FF" />}
                  </Pressable>
                </View>
              ) : (
                <>
                  <View style={styles.filterSection}>
                    <Text style={styles.filterSectionTitle}>Quick Filters</Text>
                    <View style={styles.chipGrid}>
                      {['AC', 'Available', 'Departure after 6 PM'].map((filter) => (
                        <Pressable 
                          key={filter}
                          onPress={() => toggleFilter(filter)}
                          style={[styles.modalChip, selectedFilters.includes(filter) && styles.modalChipActive]}
                        >
                          <Text style={[styles.modalChipText, selectedFilters.includes(filter) && styles.modalChipTextActive]}>{filter}</Text>
                        </Pressable>
                      ))}
                    </View>
                  </View>
                  <View style={styles.filterSection}>
                    <Text style={styles.filterSectionTitle}>Quota</Text>
                    <View style={styles.chipGrid}>
                      {(['GENERAL', 'TATKAL', 'LADIES'] as const).map((q) => (
                        <Pressable 
                          key={q}
                          onPress={() => setSelectedQuota(q)}
                          style={[styles.modalChip, selectedQuota === q && styles.modalChipActive]}
                        >
                          <Text style={[styles.modalChipText, selectedQuota === q && styles.modalChipTextActive]}>{q}</Text>
                        </Pressable>
                      ))}
                    </View>
                  </View>
                  <View style={styles.filterSection}>
                    <Text style={styles.filterSectionTitle}>Ticket type Filter</Text>
                    <View style={styles.chipGrid}>
                      {['Confirmed / RAC tickets', 'Waitlisted tickets'].map((filter) => (
                        <Pressable 
                          key={filter}
                          onPress={() => toggleFilter(filter)}
                          style={[styles.modalChip, selectedFilters.includes(filter) && styles.modalChipActive]}
                        >
                          <Text style={[styles.modalChipText, selectedFilters.includes(filter) && styles.modalChipTextActive]}>{filter}</Text>
                        </Pressable>
                      ))}
                    </View>
                  </View>
                  <View style={styles.filterSection}>
                    <Text style={styles.filterSectionTitle}>Availability</Text>
                    <View style={styles.chipGrid}>
                      {['WL - Waitlist', 'TATKAL', 'AVL - Available', 'RAC'].map((filter) => (
                        <Pressable 
                          key={filter}
                          onPress={() => toggleFilter(filter)}
                          style={[styles.modalChip, selectedFilters.includes(filter) && styles.modalChipActive]}
                        >
                          <Text style={[styles.modalChipText, selectedFilters.includes(filter) && styles.modalChipTextActive]}>{filter}</Text>
                        </Pressable>
                      ))}
                    </View>
                  </View>
                  <View style={styles.filterSection}>
                    <Text style={styles.filterSectionTitle}>Journey Class Filters</Text>
                    <View style={styles.chipGrid}>
                      {['1A - 1st AC', '2A - 2 Tier AC', '3A - 3 Tier AC', 'SL - Sleeper'].map((filter) => (
                        <Pressable 
                          key={filter}
                          onPress={() => toggleFilter(filter)}
                          style={[styles.modalChip, selectedFilters.includes(filter) && styles.modalChipActive]}
                        >
                          <Text style={[styles.modalChipText, selectedFilters.includes(filter) && styles.modalChipTextActive]}>{filter}</Text>
                        </Pressable>
                      ))}
                    </View>
                  </View>
                  <View style={styles.filterSection}>
                    <Text style={styles.filterSectionTitle}>Train Types</Text>
                    <View style={styles.chipGrid}>
                      {['Express', 'Shatabdi', 'Rajdhani', 'Special'].map((filter) => (
                        <Pressable 
                          key={filter}
                          onPress={() => toggleFilter(filter)}
                          style={[styles.modalChip, selectedFilters.includes(filter) && styles.modalChipActive]}
                        >
                          <Text style={[styles.modalChipText, selectedFilters.includes(filter) && styles.modalChipTextActive]}>{filter}</Text>
                        </Pressable>
                      ))}
                    </View>
                  </View>
                  <View style={styles.filterSection}>
                    <Text style={styles.filterSectionTitle}>Departure from {fromLabel}</Text>
                    <View style={styles.chipGrid}>
                      {['00:00 - 06:00', '06:00 - 12:00', '12:00 - 18:00', '18:00 - 24:00'].map((filter) => (
                        <Pressable 
                          key={filter}
                          onPress={() => toggleFilter(filter)}
                          style={[styles.modalChip, selectedFilters.includes(filter) && styles.modalChipActive]}
                        >
                          <Text style={[styles.modalChipText, selectedFilters.includes(filter) && styles.modalChipTextActive]}>{filter}</Text>
                        </Pressable>
                      ))}
                    </View>
                  </View>
                  <View style={styles.filterSection}>
                    <Text style={styles.filterSectionTitle}>Arrival in {toLabel}</Text>
                    <View style={styles.chipGrid}>
                      {['00:00 - 06:00', '06:00 - 12:00', '12:00 - 18:00', '18:00 - 24:00'].map((filter) => (
                        <Pressable 
                          key={filter}
                          onPress={() => toggleFilter(filter)}
                          style={[styles.modalChip, selectedFilters.includes(filter) && styles.modalChipActive]}
                        >
                          <Text style={[styles.modalChipText, selectedFilters.includes(filter) && styles.modalChipTextActive]}>{filter}</Text>
                        </Pressable>
                      ))}
                    </View>
                  </View>
                  <View style={styles.filterSection}>
                    <Text style={styles.filterSectionTitle}>Stations in {fromLabel}</Text>
                    <View style={styles.chipGrid}>
                      {[`Yesvantpur Jn (YPR)`, `KSR Bengaluru (SBC)`].map((filter) => (
                        <Pressable 
                          key={filter}
                          onPress={() => toggleFilter(filter)}
                          style={[styles.modalChip, selectedFilters.includes(filter) && styles.modalChipActive]}
                        >
                          <Text style={[styles.modalChipText, selectedFilters.includes(filter) && styles.modalChipTextActive]}>{filter}</Text>
                        </Pressable>
                      ))}
                    </View>
                  </View>
                  <View style={styles.filterSection}>
                    <Text style={styles.filterSectionTitle}>Stations in {toLabel}</Text>
                    <View style={styles.chipGrid}>
                      {[`Ahmedabad Jn (ADI)`, `Sabarmati Bg (SBIB)`].map((filter) => (
                        <Pressable 
                          key={filter}
                          onPress={() => toggleFilter(filter)}
                          style={[styles.modalChip, selectedFilters.includes(filter) && styles.modalChipActive]}
                        >
                          <Text style={[styles.modalChipText, selectedFilters.includes(filter) && styles.modalChipTextActive]}>{filter}</Text>
                        </Pressable>
                      ))}
                    </View>
                  </View>
                </>
              )}
            </ScrollView>

            <View style={styles.modalFooter}>
              <Pressable onPress={() => setIsSortFilterOpen(false)} style={styles.applyBtn}>
                <Text style={styles.applyBtnText}>Apply</Text>
              </Pressable>
            </View>
          </SafeAreaView>
        </Modal>

        {/* Seat / Timing Bottom Sheet Filter */}
        <Modal animationType="fade" transparent visible={!!activeBusFilterSheet} onRequestClose={() => setActiveBusFilterSheet(null)}>
          <View style={styles.busSheetOverlay}>
            <Pressable style={StyleSheet.absoluteFill} onPress={() => setActiveBusFilterSheet(null)} />
            <View style={styles.busSheetContent}>
              <View style={styles.busSheetHeader}>
                <Text style={styles.busSheetTitle}>{activeBusFilterSheet}</Text>
                <Pressable onPress={() => setActiveBusFilterSheet(null)}>
                  <Text style={styles.busSheetApplyText}>APPLY</Text>
                </Pressable>
              </View>
              
              <View style={styles.busSheetBody}>
                {activeBusFilterSheet === 'Seat' ? (
                  <View>
                    <Text style={{ fontSize: 12, fontWeight: '600', color: '#64748B', marginBottom: 12 }}>SEAT TYPE</Text>
                    <View style={{ flexDirection: 'row', gap: 12 }}>
                      <View style={[styles.modalChip, { flex: 1, alignItems: 'center' }]}><Text style={styles.modalChipText}>Seater</Text></View>
                      <View style={[styles.modalChip, { flex: 1, alignItems: 'center' }]}><Text style={styles.modalChipText}>Sleeper</Text></View>
                    </View>
                    <Text style={{ fontSize: 12, fontWeight: '600', color: '#64748B', marginTop: 24, marginBottom: 12 }}>SINGLE SEATER SLEEPER</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                      <MaterialCommunityIcons name="square-outline" size={24} color="#CBD5E1" />
                      <Text style={{ fontSize: 13, color: '#0F172A' }}>Single Window Seats</Text>
                    </View>
                  </View>
                ) : activeBusFilterSheet === 'Timing' ? (
                  <View>
                    <Text style={{ fontSize: 12, fontWeight: '600', color: '#64748B', marginBottom: 12 }}>PICKUP TIME</Text>
                    <View style={{ flexDirection: 'row', gap: 8 }}>
                      <View style={[styles.modalChip, { flex: 1, alignItems: 'center' }]}><MaterialCommunityIcons name="weather-sunset-up" size={16} color="#475569" /><Text style={[styles.modalChipText, { fontSize: 10, marginTop: 4 }]}>6 AM - 12 PM</Text></View>
                      <View style={[styles.modalChip, { flex: 1, alignItems: 'center' }]}><MaterialCommunityIcons name="white-balance-sunny" size={16} color="#475569" /><Text style={[styles.modalChipText, { fontSize: 10, marginTop: 4 }]}>12 PM - 6 PM</Text></View>
                      <View style={[styles.modalChip, { flex: 1, alignItems: 'center' }]}><MaterialCommunityIcons name="weather-night" size={16} color="#475569" /><Text style={[styles.modalChipText, { fontSize: 10, marginTop: 4 }]}>6 PM - 12 AM</Text></View>
                    </View>
                  </View>
                ) : (
                  <Text style={{ color: '#475569' }}>Filter options for {activeBusFilterSheet}</Text>
                )}
              </View>
            </View>
          </View>
        </Modal>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F1F5F9' },
  screen: { flex: 1, backgroundColor: '#F1F5F9' },
  listContent: { paddingBottom: 100, paddingTop: 12 },
  
  loginBannerCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFBEB', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#FEF3C7' },
  loginBannerIcon: { marginRight: 12 },
  loginBannerTitle: { fontSize: 13, fontWeight: '700', color: '#0F172A' },
  loginBannerSub: { fontSize: 12, color: '#64748B' },
  
  // Bus styles
  busPromoRow: { flexDirection: 'row', gap: 12, marginHorizontal: 16, marginBottom: 16 },
  busPromoCard: { flex: 1, padding: 12, borderRadius: 8 },
  busPromoTitle: { fontSize: 12, fontWeight: '700', color: '#0369A1', marginBottom: 4 },
  busPromoSub: { fontSize: 10, color: '#0284C7', lineHeight: 14 },
  
  busCard: {
    marginHorizontal: 16,
    backgroundColor: '#FFF',
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  busCardInner: { padding: 16 },
  megabusBanner: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#FEF2F2', paddingHorizontal: 12, paddingVertical: 6, gap: 6,
  },
  megabusBannerText: { fontSize: 10, fontWeight: '800', color: '#EF4444' },
  megabusBannerSub: { flex: 1, fontSize: 10, color: '#475569' },
  megabusBannerCopy: { fontSize: 10, fontWeight: '700', color: '#0084FF' },
  
  busHeaderRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 },
  busOperator: { fontSize: 13, fontWeight: '700', color: '#0F172A' },
  busRatingPill: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#10B981', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, gap: 2 },
  busRatingText: { fontSize: 10, fontWeight: '700', color: '#FFF' },
  busType: { fontSize: 12, color: '#64748B', marginBottom: 16 },
  
  busTimeRow: { flexDirection: 'row', alignItems: 'center' },
  busTimeCol: { flex: 1 },
  busTimeColRight: { flex: 1, alignItems: 'flex-end' },
  busDurationCol: { alignItems: 'center', paddingHorizontal: 8 },
  busPriceCol: { marginLeft: 16, alignItems: 'flex-end' },
  
  busTimeText: { fontSize: 16, fontWeight: '800', color: '#0F172A' },
  busSeatsText: { fontSize: 10.5, color: '#EF4444', marginTop: 4 },
  busNextDay: { fontSize: 10, color: '#64748B', marginTop: 4 },
  busDurationText: { fontSize: 10.5, color: '#94A3B8' },
  busPriceText: { fontSize: 18, fontWeight: '800', color: '#0F172A' },

  busBottomFilterBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    height: 64, backgroundColor: '#FFFFFF',
    borderTopWidth: 1, borderTopColor: '#E2E8F0',
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around',
    paddingBottom: 16,
  },
  busFilterTab: { alignItems: 'center', justifyContent: 'center' },
  busFilterTabText: { fontSize: 10, color: '#0F172A', marginTop: 4 },

  busSheetOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  busSheetContent: { backgroundColor: '#FFF', borderTopLeftRadius: 16, borderTopRightRadius: 16, padding: 16, minHeight: 250 },
  busSheetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  busSheetTitle: { fontSize: 16, fontWeight: '700', color: '#0F172A' },
  busSheetApplyText: { fontSize: 13, fontWeight: '700', color: '#0084FF' },
  busSheetBody: { paddingBottom: 24 },

  // Train Modal Styles
  modalSafe: { flex: 1, backgroundColor: '#FFFFFF' },
  modalHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#E2E8F0',
  },
  modalHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  modalBackButton: { padding: 4 },
  modalTitle: { fontSize: 16, fontWeight: '800', color: '#0F172A' },
  modalSubtitle: { fontSize: 12, color: '#64748B' },
  clearText: { fontSize: 13, fontWeight: '600', color: '#0084FF' },
  
  modalTabs: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  modalTab: { flex: 1, alignItems: 'center', paddingVertical: 12, borderBottomWidth: 2, borderBottomColor: 'transparent' },
  modalTabActive: { borderBottomColor: '#0084FF' },
  modalTabText: { fontSize: 13, fontWeight: '600', color: '#64748B' },
  modalTabTextActive: { color: '#0084FF' },
  
  modalScroll: { padding: 16 },
  filterSection: { marginBottom: 24 },
  filterSectionTitle: { fontSize: 13, fontWeight: '700', color: '#0F172A', marginBottom: 12 },
  chipGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  modalChip: {
    paddingHorizontal: 12, paddingVertical: 8,
    borderRadius: 8, borderWidth: 1, borderColor: '#E2E8F0', backgroundColor: '#F8FAFC',
  },
  modalChipActive: { backgroundColor: '#EFF6FF', borderColor: '#0084FF' },
  modalChipText: { fontSize: 12, fontWeight: '600', color: '#475569' },
  modalChipTextActive: { color: '#0084FF' },

  radioRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12 },
  radioLabel: { fontSize: 13, fontWeight: '600', color: '#0F172A' },
  radioSubLabel: { fontSize: 12, color: '#64748B', marginTop: 4 },
  dividerLine: { height: 1, backgroundColor: '#E2E8F0' },

  modalFooter: { padding: 16, borderTopWidth: 1, borderTopColor: '#E2E8F0' },
  applyBtn: { backgroundColor: '#0084FF', paddingVertical: 14, borderRadius: 8, alignItems: 'center' },
  applyBtnText: { color: '#111827', fontSize: 16, fontWeight: '700' },
});
