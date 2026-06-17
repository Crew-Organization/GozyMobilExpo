import { memo, useState, useMemo } from 'react';
import { FlashList } from '@shopify/flash-list';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Alert, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import type { TrainAvailability, TrainSearchResult } from '@/src/lib/train-search-results';
import {
  getAvailabilityTone,
  trainResultsPalette,
  trainResultsRadius,
  trainResultsShadow,
  trainResultsSpacing,
  trainResultsType,
} from '@/src/theme/train-results-ui';
import { SeatCard } from '@/src/components/train/SeatCard';
import { WeeklyIndicator } from '@/src/components/train/WeeklyIndicator';

// Station schedule lookup and dynamic generator
const getTrainSchedule = (
  trainNumber: string,
  boardingCode: string,
  destinationCode: string
) => {
  // Exact 24-station Falaknuma Express schedule matching the screenshots
  const fullSchedule = [
    { code: 'HWH', name: 'HOWRAH JN', distance: '0.0 km', platform: '#21', day: 1, stopTime: 'Journey Start', arrival: '', departure: '08:25', isJourneyStart: true },
    { code: 'KGP', name: 'KHARAGPUR JN', distance: '116.0 km', platform: '#3', day: 1, stopTime: '05:00m', arrival: '10:00', departure: '10:05' },
    { code: 'BLS', name: 'BALESHWAR', distance: '234.0 km', platform: '#2', day: 1, stopTime: '02:00m', arrival: '11:25', departure: '11:27' },
    { code: 'BHC', name: 'BHADRAK', distance: '296.0 km', platform: '#2', day: 1, stopTime: '02:00m', arrival: '12:30', departure: '12:32' },
    { code: 'JJKR', name: 'JAJPUR K ROAD', distance: '340.0 km', platform: '#3', day: 1, stopTime: '02:00m', arrival: '13:01', departure: '13:03' },
    { code: 'CTC', name: 'CUTTACK', distance: '412.0 km', platform: '#3', day: 1, stopTime: '05:00m', arrival: '14:00', departure: '14:05' },
    { code: 'BBS', name: 'BHUBANESWAR', distance: '439.0 km', platform: '#4', day: 1, stopTime: '05:00m', arrival: '14:40', departure: '14:45' },
    { code: 'KUR', name: 'KHURDA ROAD JN', distance: '458.0 km', platform: '#3', day: 1, stopTime: '20:00m', arrival: '15:05', departure: '15:25' },
    { code: 'BALU', name: 'BALUGAON', distance: '529.0 km', platform: '#4', day: 1, stopTime: '02:00m', arrival: '16:38', departure: '16:40' },
    { code: 'KIT', name: 'KHALLIKOT', distance: '546.0 km', platform: '#3', day: 1, stopTime: '02:00m', arrival: '17:08', departure: '17:10' },
    { code: 'BAM', name: 'BRAHMAPUR', distance: '679.0 km', platform: '#1', day: 1, stopTime: '02:00m', arrival: '19:08', departure: '19:10' },
    { code: 'CHE', name: 'SRIKAKULAM ROAD', distance: '752.0 km', platform: '#3', day: 1, stopTime: '02:00m', arrival: '20:10', departure: '20:12' },
    { code: 'VZM', name: 'VIZIANAGRAM JN', distance: '821.0 km', platform: '#1', day: 1, stopTime: '05:00m', arrival: '21:05', departure: '21:10' },
    { code: 'VSKP', name: 'VISAKHAPATNAM', distance: '882.0 km', platform: '#5', day: 1, stopTime: '20:00m', arrival: '22:10', departure: '22:30' },
    { code: 'SLO', name: 'SAMALKOT JN', distance: '1032.0 km', platform: '#3', day: 2, stopTime: '01:00m', arrival: '00:39', departure: '00:40' },
    { code: 'RJY', name: 'RAJAHMUNDRY', distance: '1083.0 km', platform: '#1', day: 2, stopTime: '02:00m', arrival: '01:18', departure: '01:20' },
    { code: 'TDD', name: 'TADEPALLIGUDEM', distance: '1125.0 km', platform: '#3', day: 2, stopTime: '01:00m', arrival: '02:04', departure: '02:05' },
    { code: 'EE', name: 'ELURU', distance: '1172.0 km', platform: '#3', day: 2, stopTime: '01:00m', arrival: '02:44', departure: '02:45' },
    { code: 'BZA', name: 'VIJAYAWADA JN', distance: '1232.0 km', platform: '#5', day: 2, stopTime: '10:00m', arrival: '04:00', departure: '04:10' },
    { code: 'GNT', name: 'GUNTUR JN', distance: '1264.0 km', platform: '#4', day: 2, stopTime: '05:00m', arrival: '05:00', departure: '05:05' },
    { code: 'PGRL', name: 'PIDUGURALLA', distance: '1338.0 km', platform: '#2', day: 2, stopTime: '01:00m', arrival: '06:04', departure: '06:05' },
    { code: 'MRGA', name: 'MIRYALAGUDA', distance: '1397.0 km', platform: '#1', day: 2, stopTime: '01:00m', arrival: '07:01', departure: '07:02' },
    { code: 'NLDA', name: 'NALGONDA', distance: '1435.0 km', platform: '#1', day: 2, stopTime: '01:00m', arrival: '07:50', departure: '07:51' },
    { code: 'SC', name: 'SECUNDERABAD JN', distance: '1545.0 km', platform: '#6', day: 2, stopTime: 'Journey End', arrival: '10:30', departure: '', isJourneyEnd: true },
  ];

  // If search boarding/destination are not CHE/BZA, dynamically generate a matching schedule
  const hasBoarding = fullSchedule.some(s => s.code === boardingCode);
  const hasDest = fullSchedule.some(s => s.code === destinationCode);

  if (hasBoarding && hasDest) {
    return fullSchedule;
  }

  // Generic fallback schedule mapping
  return [
    { code: 'ORIG', name: 'ORIGIN JUNCTION', distance: '0.0 km', platform: '#1', day: 1, stopTime: 'Journey Start', arrival: '', departure: '06:00', isJourneyStart: true },
    { code: 'INT1', name: 'INTERMEDIATE STATION A', distance: '85.0 km', platform: '#2', day: 1, stopTime: '02:00m', arrival: '07:15', departure: '07:17' },
    { code: 'INT2', name: 'INTERMEDIATE STATION B', distance: '160.0 km', platform: '#1', day: 1, stopTime: '05:00m', arrival: '08:30', departure: '08:35' },
    { code: boardingCode, name: boardingCode === 'YPR' ? 'YESVANTPUR JN' : boardingCode === 'SBC' ? 'KSR BENGALURU' : boardingCode === 'SMVB' ? 'SMVT BENGALURU' : 'BOARDING STATION', distance: '240.0 km', platform: '#3', day: 1, stopTime: '05:00m', arrival: '09:50', departure: '09:55' },
    { code: 'INT3', name: 'ROUTE JUNCTION X', distance: '360.0 km', platform: '#2', day: 1, stopTime: '10:00m', arrival: '11:45', departure: '11:55' },
    { code: 'INT4', name: 'ROUTE JUNCTION Y', distance: '480.0 km', platform: '#3', day: 1, stopTime: '05:00m', arrival: '13:40', departure: '13:45' },
    { code: 'INT5', name: 'ROUTE JUNCTION Z', distance: '620.0 km', platform: '#1', day: 1, stopTime: '02:00m', arrival: '15:20', departure: '15:22' },
    { code: 'INT6', name: 'WAYPOINT STATION M', distance: '810.0 km', platform: '#2', day: 1, stopTime: '15:00m', arrival: '18:10', departure: '18:25' },
    { code: destinationCode, name: destinationCode === 'ADI' ? 'AHMEDABAD JN' : destinationCode === 'SBIB' ? 'SABARMATI BG' : 'DESTINATION STATION', distance: '1050.0 km', platform: '#4', day: 2, stopTime: '10:00m', arrival: '02:30', departure: '02:40' },
    { code: 'TERM', name: 'TERMINUS STATION', distance: '1200.0 km', platform: '#5', day: 2, stopTime: 'Journey End', arrival: '05:30', departure: '', isJourneyEnd: true }
  ];
};

type TrainCardProps = {
  index: number;
  item: TrainSearchResult;
  onSeatPress?: (train: TrainSearchResult, slot: TrainAvailability) => void;
};

export const TrainCard = memo(function TrainCard({ index, item, onSeatPress }: TrainCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showSchedule, setShowSchedule] = useState(false);
  const [selectedQuota, setSelectedQuota] = useState<'GENERAL' | 'TATKAL' | 'LADIES'>('GENERAL');

  // Find unique classNames from item.availability
  const uniqueClasses = useMemo(() => {
    return item.availability.reduce<string[]>((acc, slot) => {
      if (!acc.includes(slot.className)) {
        acc.push(slot.className);
      }
      return acc;
    }, []);
  }, [item.availability]);

  const [selectedClass, setSelectedClass] = useState(uniqueClasses[0] || '2A');

  const getClassDisplayName = (className: string) => {
    if (className === '1A') return '1 Tier AC';
    if (className === '2A') return '2 Tier AC';
    if (className === '3A') return '3 Tier AC';
    if (className === '3E') return '3 Economy';
    if (className === 'SL') return 'Sleeper';
    return className;
  };

  const nearbyDates = useMemo(() => {
    const baseDateStr = item.departureDateLabel || '28 May';
    const now = new Date();
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const parts = baseDateStr.split(' ');
    const baseDay = parseInt(parts[0], 10) || now.getDate();
    const baseMonthStr = parts[1] || 'May';
    const baseMonth = monthNames.findIndex(m => m.toLowerCase() === baseMonthStr.toLowerCase());
    const year = now.getFullYear();
    const base = new Date(year, baseMonth === -1 ? 4 : baseMonth, baseDay);
    
    return Array.from({ length: 6 }).map((_, i) => {
      const d = new Date(base);
      d.setDate(base.getDate() + i);
      const dayLabel = d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
      const weekdayLabel = d.toLocaleDateString('en-US', { weekday: 'short' });
      return {
        label: `${dayLabel}, ${weekdayLabel}`,
        isSearchDate: i === 0,
      };
    });
  }, [item.departureDateLabel]);

  // Find the slot matching selected class and quota (if applicable)
  const getActiveSlot = () => {
    let slot = item.availability.find(s => s.className === selectedClass && s.badge?.toUpperCase() === selectedQuota);
    if (!slot && selectedQuota === 'GENERAL') {
      slot = item.availability.find(s => s.className === selectedClass && !s.badge);
    }
    // Fallback to any slot of selected class
    if (!slot) {
      slot = item.availability.find(s => s.className === selectedClass);
    }
    return slot;
  };

  const activeSlot = getActiveSlot();

  const getPriceForClass = (className: string) => {
    let slot = item.availability.find(s => s.className === className && s.badge?.toUpperCase() === selectedQuota);
    if (!slot && selectedQuota === 'GENERAL') {
      slot = item.availability.find(s => s.className === className && !s.badge);
    }
    if (!slot) {
      slot = item.availability.find(s => s.className === className);
    }
    if (slot && !slot.quotaLabel.toUpperCase().includes('BOOKING NOT ALLOWED')) {
      return `₹ ${slot.price.toLocaleString()}`;
    }
    return '--';
  };

  const renderNearbyDates = () => {
    return (
      <View style={styles.expansionPanel}>
        {/* Quota Tabs */}
        <View style={styles.quotaPillRow}>
          {(['GENERAL', 'TATKAL', 'LADIES'] as const).map((quota) => {
            const isActive = selectedQuota === quota;
            const displayLabel = quota === 'GENERAL' ? 'General Quota' : quota === 'TATKAL' ? 'Tatkal Quota' : 'Ladies Quota';
            return (
              <Pressable
                key={quota}
                onPress={() => setSelectedQuota(quota)}
                style={[styles.quotaPill, isActive && styles.quotaPillActive]}
              >
                {isActive && (
                  <MaterialCommunityIcons color={trainResultsPalette.primaryBlue} name="check" size={14} style={{ marginRight: 2 }} />
                )}
                <Text style={[styles.quotaPillText, isActive && styles.quotaPillTextActive]}>
                  {displayLabel}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Class Tabs */}
        <View style={styles.classTabRow}>
          {uniqueClasses.map((className) => {
            const isActive = selectedClass === className;
            const price = getPriceForClass(className);
            return (
              <Pressable
                key={className}
                onPress={() => setSelectedClass(className)}
                style={[styles.classTab, isActive && styles.classTabActive]}
              >
                <Text style={[styles.classTabText, isActive && styles.classTabTextActive]}>
                  {getClassDisplayName(className)}
                </Text>
                <Text style={[styles.classTabPrice, isActive && styles.classTabPriceActive, price === '--' && styles.classTabPriceEmpty]}>
                  {price}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Dates List */}
        <View style={styles.datesListContainer}>
          {nearbyDates.map((dateObj, i) => {
            let statusText = 'Booking not allowed';
            let statusColor: string = trainResultsPalette.dullBlack;
            
            if (dateObj.isSearchDate) {
              if (activeSlot) {
                statusText = activeSlot.quotaLabel;
                statusColor = getAvailabilityTone(statusText, activeSlot.badge, activeSlot.status).accentColor;
              }
            }

            const handleDateRowPress = () => {
              if (dateObj.isSearchDate && activeSlot && !statusText.toUpperCase().includes('BOOKING NOT ALLOWED')) {
                onSeatPress?.(item, activeSlot);
              } else if (!dateObj.isSearchDate) {
                Alert.alert('Booking not allowed', 'Advance booking is only allowed for the primary searched date in this simulation.');
              }
            };

            return (
              <Pressable
                key={i}
                onPress={handleDateRowPress}
                style={[styles.dateRow, i === nearbyDates.length - 1 && styles.lastDateRow]}
              >
                <View style={styles.dateLeft}>
                  <Text style={styles.dateLabelText}>{dateObj.label}</Text>
                  {dateObj.isSearchDate && (
                    <Text style={styles.yourSearchLabel}>Your Search</Text>
                  )}
                </View>
                <View style={styles.dateRight}>
                  <Text style={[styles.dateStatusText, { color: statusColor }]}>{statusText}</Text>
                  <MaterialCommunityIcons color="#CCCCCC" name="chevron-right" size={20} />
                </View>
              </Pressable>
            );
          })}
        </View>
      </View>
    );
  };

  return (
    <Animated.View entering={FadeInDown.duration(280).delay(Math.min(index * 40, 180))} style={styles.card}>
      {item.note ? (
        <View style={styles.noteBanner}>
          <Text style={styles.noteTitle}>Confirmed Options</Text>
          <Text style={styles.noteBody}>{item.note}</Text>
        </View>
      ) : null}

      {item.nextRunLabel ? (
        <View style={styles.runBanner}>
          <Text style={styles.runBannerText}>{item.nextRunLabel}</Text>
        </View>
      ) : null}

      <View style={styles.header}>
        <View style={styles.titleWrap}>
          <Text numberOfLines={1} style={styles.trainName}>{item.name}</Text>
          <Text style={styles.trainNumber}>#{item.number}</Text>
        </View>
        <WeeklyIndicator runningDays={item.runningDays} />
      </View>

      <View style={styles.tripRow}>
        <View style={styles.tripSide}>
          <View style={styles.timeRow}>
            <Text style={styles.time}>{item.departureTime}</Text>
            <Text style={styles.date}>{item.departureDateLabel}</Text>
          </View>
          <Text numberOfLines={1} style={styles.station}>{item.departureStation}</Text>
        </View>

        <View style={styles.tripCenter}>
          <Text style={[styles.durationText, { textAlign: 'center', marginBottom: 4 }]}>{item.duration}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: '#0F766E' }} />
            <View style={[styles.durationLine, { height: 1.5, backgroundColor: '#0F766E', flex: 1 }]} />
            <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: '#0F766E' }} />
          </View>
        </View>

        <View style={[styles.tripSide, styles.tripSideRight]}>
          <View style={[styles.timeRow, styles.timeRowRight]}>
            <Text style={styles.time}>{item.arrivalTime}</Text>
            <Text style={styles.date}>{item.arrivalDateLabel}</Text>
          </View>
          <Text numberOfLines={1} style={[styles.station, styles.stationRight]}>{item.arrivalStation}</Text>
        </View>
      </View>

      {/* Conditionally Render SeatCards or Nearby Dates expansion panel */}
      {isExpanded ? (
        renderNearbyDates()
      ) : (
        <FlashList
          horizontal
          data={item.availability}
          keyExtractor={(slot, seatIndex) => `${item.id}-${slot.className}-${slot.quotaLabel}-${seatIndex}`}
          renderItem={({ item: slot }) => <SeatCard onPress={() => onSeatPress?.(item, slot)} slot={slot} />}
          ItemSeparatorComponent={() => <View style={styles.seatSeparator} />}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.seatList}
        />
      )}

      <View style={styles.footer}>
        <Pressable
          onPress={() => setIsExpanded(!isExpanded)}
          style={({ pressed }) => [styles.footerAction, pressed && styles.footerPressed]}
        >
          {isExpanded ? (
            <MaterialCommunityIcons color={trainResultsPalette.primaryBlue} name="chevron-up" size={24} />
          ) : (
            <>
              <Text style={styles.footerText}>Nearby Dates</Text>
              <MaterialCommunityIcons color={trainResultsPalette.primaryBlue} name="chevron-down" size={18} />
            </>
          )}
        </Pressable>
        <Pressable
          onPress={() => setShowSchedule(true)}
          style={({ pressed }) => [styles.footerAction, pressed && styles.footerPressed]}
        >
          <Text style={styles.footerText}>Train Schedule</Text>
        </Pressable>
      </View>

      {/* Train Schedule Bottom Sheet Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showSchedule}
        onRequestClose={() => setShowSchedule(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <View style={styles.headerLeft}>
                <View style={styles.trainIconCircle}>
                  <MaterialCommunityIcons color="#FFFFFF" name="train" size={24} />
                </View>
                <View style={styles.trainHeaderDetails}>
                  <Text style={styles.modalTrainNumber}>{item.number}</Text>
                  <Text numberOfLines={1} style={styles.modalTrainName}>
                    {item.name.toUpperCase()}
                  </Text>
                </View>
              </View>
              <Pressable
                onPress={() => setShowSchedule(false)}
                style={({ pressed }) => [styles.closeBtn, pressed && styles.btnPressed]}
              >
                <MaterialCommunityIcons color="#4B5563" name="close" size={24} />
              </Pressable>
            </View>

            {/* Train details table */}
            <View style={styles.detailsCard}>
              <View style={styles.detailsRow}>
                <Text style={styles.detailsRowLabel}>Runs On</Text>
                <View style={styles.runsOnRow}>
                  {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, dIdx) => {
                    const isActive = item.runningDays.includes(day) || item.runningDays.length === 7;
                    return (
                      <Text
                        key={dIdx}
                        style={[
                          styles.dayLetter,
                          isActive ? styles.dayLetterActive : styles.dayLetterInactive,
                        ]}
                      >
                        {day}
                      </Text>
                    );
                  })}
                </View>
              </View>
              <View style={styles.detailsRowDivider} />
              <View style={styles.detailsRow}>
                <Text style={styles.detailsRowLabel}>Classes</Text>
                <Text style={styles.detailsRowValue}>{uniqueClasses.join('  ')}</Text>
              </View>
              <View style={styles.detailsRowDivider} />
              <View style={styles.detailsRow}>
                <Text style={styles.detailsRowLabel}>Total Duration</Text>
                <Text style={styles.detailsRowValue}>{item.duration}</Text>
              </View>
              <View style={styles.detailsRowDivider} />
              <View style={styles.detailsRow}>
                <Text style={styles.detailsRowLabel}>Number Of Stops</Text>
                <Text style={styles.detailsRowValue}>
                  {(() => {
                    const bCode = item.departureStation.match(/\(([^)]+)\)/)?.[1] || 'CHE';
                    const dCode = item.arrivalStation.match(/\(([^)]+)\)/)?.[1] || 'BZA';
                    return getTrainSchedule(item.number, bCode, dCode).length;
                  })()}
                </Text>
              </View>
            </View>

            {/* Scrollable Timeline */}
            <ScrollView showsVerticalScrollIndicator={false} style={styles.timelineScroller}>
              {(() => {
                const bCode = item.departureStation.match(/\(([^)]+)\)/)?.[1] || 'CHE';
                const dCode = item.arrivalStation.match(/\(([^)]+)\)/)?.[1] || 'BZA';
                const scheduleStations = getTrainSchedule(item.number, bCode, dCode);
                const boardingIndex = scheduleStations.findIndex(s => s.code === bCode);
                const destinationIndex = scheduleStations.findIndex(s => s.code === dCode);

                const beforeStations = scheduleStations.slice(0, boardingIndex);
                const middleStations = scheduleStations.slice(boardingIndex, destinationIndex + 1);
                const afterStations = scheduleStations.slice(destinationIndex + 1);

                let currentDay = 0;

                const renderStationRow = (station: any, idx: number, absoluteIndex: number) => {
                  const isBoarding = absoluteIndex === boardingIndex;
                  const isDestination = absoluteIndex === destinationIndex;
                  const isInside = absoluteIndex >= boardingIndex && absoluteIndex <= destinationIndex;
                  
                  const showDayBadge = station.day !== currentDay;
                  if (showDayBadge) {
                    currentDay = station.day;
                  }

                  let circleIcon = null;
                  if (isDestination) {
                    circleIcon = (
                      <View style={styles.timelineCircleWrapper}>
                        <MaterialCommunityIcons color="#0F766E" name="check-circle" size={18} />
                      </View>
                    );
                  } else if (isInside) {
                    circleIcon = (
                      <View style={[styles.timelineCircleEmpty, styles.timelineCircleTeal]} />
                    );
                  } else {
                    circleIcon = (
                      <View style={[styles.timelineCircleEmpty, styles.timelineCircleGrey]} />
                    );
                  }

                  const showLineTop = absoluteIndex > 0;
                  const lineTopTeal = absoluteIndex > boardingIndex && absoluteIndex <= destinationIndex;
                  const showLineBottom = absoluteIndex < scheduleStations.length - 1;
                  const lineBottomTeal = absoluteIndex >= boardingIndex && absoluteIndex < destinationIndex;

                  return (
                    <View key={`${station.code}-${absoluteIndex}`} style={styles.timelineRowContainer}>
                      {showDayBadge ? (
                        <View style={styles.dayIndicatorRow}>
                          <View style={styles.dayLine} />
                          <View style={styles.dayBadge}>
                            <Text style={styles.dayBadgeText}>Day {station.day}</Text>
                          </View>
                          <View style={styles.dayLine} />
                        </View>
                      ) : null}

                      <View style={styles.stationRow}>
                        <View style={styles.stationLeftColumn}>
                          <Text style={[styles.stationCodeText, isInside && styles.stationTextTeal]}>
                            {station.code}
                          </Text>
                          <Text style={styles.stationDistanceText}>{station.distance}</Text>
                        </View>

                        <View style={styles.stationCenterColumn}>
                          {showLineTop ? (
                            <View
                              style={[
                                styles.timelineLineHalf,
                                styles.timelineLineTop,
                                lineTopTeal ? styles.lineTeal : styles.lineGrey,
                              ]}
                            />
                          ) : null}
                          {showLineBottom ? (
                            <View
                              style={[
                                styles.timelineLineHalf,
                                styles.timelineLineBottom,
                                lineBottomTeal ? styles.lineTeal : styles.lineGrey,
                              ]}
                            />
                          ) : null}
                          {circleIcon}
                        </View>

                        <View style={styles.stationRightColumn}>
                          <View style={styles.stationNameRow}>
                            <Text numberOfLines={1} style={[styles.stationNameText, isInside && styles.stationNameBold]}>
                              {station.name}
                            </Text>
                            {isBoarding ? (
                              <View style={styles.boardingPill}>
                                <Text style={styles.boardingPillText}>Boarding</Text>
                              </View>
                            ) : null}
                            {isDestination ? (
                              <View style={styles.boardingPill}>
                                <Text style={styles.boardingPillText}>Get down</Text>
                              </View>
                            ) : null}
                          </View>

                          <Text style={styles.platformStopText}>
                            Platform {station.platform} | {station.stopTime === 'Journey Start' || station.stopTime === 'Journey End' ? station.stopTime : `Stop ${station.stopTime}`}
                          </Text>

                          <View style={styles.timingsRow}>
                            {station.isJourneyStart ? (
                              <Text style={styles.timingsText}>
                                <Text style={styles.timingsLabel}>DEP. </Text>{station.departure}
                              </Text>
                            ) : station.isJourneyEnd ? (
                              <Text style={styles.timingsText}>
                                <Text style={styles.timingsLabel}>ARR. </Text>{station.arrival}
                              </Text>
                            ) : (
                              <Text style={styles.timingsText}>
                                <Text style={styles.timingsLabel}>ARR. </Text>{station.arrival}  <Text style={styles.timingsLabel}>DEP. </Text>{station.departure}
                              </Text>
                            )}
                          </View>
                        </View>
                      </View>
                    </View>
                  );
                };

                return (
                  <View style={styles.timelineScrollerContent}>
                    {beforeStations.length > 0 ? (
                      <View style={styles.transparentPathCard}>
                        {beforeStations.map((station, sIdx) => renderStationRow(station, sIdx, sIdx))}
                      </View>
                    ) : null}

                    {middleStations.length > 0 ? (
                      <View style={styles.selectedPathCard}>
                        {middleStations.map((station, sIdx) => renderStationRow(station, sIdx, boardingIndex + sIdx))}
                      </View>
                    ) : null}

                    {afterStations.length > 0 ? (
                      <View style={styles.transparentPathCard}>
                        {afterStations.map((station, sIdx) => renderStationRow(station, sIdx, destinationIndex + 1 + sIdx))}
                      </View>
                    ) : null}
                  </View>
                );
              })()}

              {/* Disclaimer */}
              <View style={styles.disclaimerContainer}>
                <Text style={styles.disclaimerTitle}>Disclaimer</Text>
                <Text style={styles.disclaimerText}>
                  You are advised to verify the details before making any decision based on the information provided. Neither MakeMyTrip nor IRCTC will be responsible for any liability occurring due to this information.
                </Text>
              </View>
            </ScrollView>

            {/* Bottom bar with action */}
            <View style={styles.bottomBar}>
              <Pressable
                onPress={() => setShowSchedule(false)}
                style={({ pressed }) => [styles.okayButton, pressed && styles.okayButtonPressed]}
              >
                <Text style={styles.okayButtonText}>Okay</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  card: {
    marginHorizontal: trainResultsSpacing.xs,
    borderRadius: trainResultsRadius.sm,
    paddingHorizontal: trainResultsSpacing.xs,
    paddingVertical: trainResultsSpacing.xs,
    backgroundColor: trainResultsPalette.surface,
    ...trainResultsShadow,
  },
  noteBanner: {
    marginBottom: 8,
    borderRadius: 14,
    backgroundColor: trainResultsPalette.aquaSoft,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  noteTitle: {
    ...trainResultsType.caption,
    color: trainResultsPalette.successGreen,
    fontFamily: trainResultsType.trainTitle.fontFamily,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  noteBody: {
    ...trainResultsType.body,
    color: trainResultsPalette.textPrimary,
  },
  runBanner: {
    alignSelf: 'flex-start',
    marginBottom: 8,
    backgroundColor: '#DDF9F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderTopLeftRadius: 8,
    borderBottomRightRadius: 12,
  },
  runBannerText: {
    ...trainResultsType.caption,
    color: '#0F766E',
    fontFamily: trainResultsType.trainTitle.fontFamily,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  titleWrap: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
    flex: 1,
    paddingRight: 8,
  },
  trainName: {
    ...trainResultsType.trainTitle,
    color: trainResultsPalette.textPrimary,
    flexShrink: 1,
  },
  trainNumber: {
    ...trainResultsType.trainNumber,
    color: '#9CA3AF',
  },
  tripRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  tripSide: {
    flex: 1.18,
  },
  tripSideRight: {
    alignItems: 'flex-end',
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 3,
  },
  timeRowRight: {
    justifyContent: 'flex-end',
  },
  time: {
    ...trainResultsType.time,
    color: trainResultsPalette.textPrimary,
  },
  date: {
    ...trainResultsType.caption,
    color: '#9CA3AF',
  },
  station: {
    ...trainResultsType.caption,
    marginTop: 6,
    color: '#8B96A6',
  },
  stationRight: {
    textAlign: 'right',
  },
  tripCenter: {
    flex: 1,
    paddingHorizontal: 4,
  },
  durationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  durationLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#ECEFF3',
  },
  durationText: {
    ...trainResultsType.caption,
    color: '#9CA3AF',
  },
  seatList: {
    marginTop: 10,
    paddingRight: 8,
  },
  seatSeparator: {
    width: 8,
  },
  footer: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  footerAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  footerPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  footerText: {
    ...trainResultsType.body,
    color: trainResultsPalette.primaryBlue,
    fontFamily: trainResultsType.trainTitle.fontFamily,
  },
  expansionPanel: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 12,
  },
  quotaPillRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  quotaPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: trainResultsRadius.pill,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  quotaPillActive: {
    borderColor: trainResultsPalette.primaryBlue,
    backgroundColor: '#EAF5FF',
  },
  quotaPillText: {
    fontSize: 10,
    fontFamily: trainResultsType.body.fontFamily,
    color: '#4B5563',
    fontWeight: '500',
  },
  quotaPillTextActive: {
    color: trainResultsPalette.primaryBlue,
    fontWeight: '600',
  },
  classTabRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    marginBottom: 8,
  },
  classTab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  classTabActive: {
    borderBottomColor: trainResultsPalette.primaryBlue,
  },
  classTabText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#9CA3AF',
  },
  classTabTextActive: {
    color: trainResultsPalette.textPrimary,
    fontWeight: '700',
  },
  classTabPrice: {
    fontSize: 10,
    fontWeight: '500',
    color: '#9CA3AF',
    marginTop: 2,
  },
  classTabPriceActive: {
    color: trainResultsPalette.textPrimary,
    fontWeight: '600',
  },
  classTabPriceEmpty: {
    color: '#D1D5DB',
  },
  datesListContainer: {
    marginTop: 4,
  },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F9FAFB',
  },
  lastDateRow: {
    borderBottomWidth: 0,
  },
  dateLeft: {
    flexDirection: 'column',
    gap: 2,
  },
  dateLabelText: {
    fontSize: 12,
    fontWeight: '500',
    color: trainResultsPalette.textPrimary,
  },
  yourSearchLabel: {
    fontSize: 9,
    color: '#9CA3AF',
  },
  dateRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dateStatusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  statusGreen: {
    color: trainResultsPalette.successGreen,
  },
  statusOrange: {
    color: trainResultsPalette.warningOrange,
  },
  statusGray: {
    color: trainResultsPalette.dullBlack,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: '92%',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  trainIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1E6091',
    alignItems: 'center',
    justifyContent: 'center',
  },
  trainHeaderDetails: {
    flexDirection: 'column',
    flex: 1,
  },
  modalTrainNumber: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
  },
  modalTrainName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4B5563',
    marginTop: 2,
    letterSpacing: 0.5,
  },
  closeBtn: {
    padding: 6,
    borderRadius: 99,
    backgroundColor: '#F3F4F6',
  },
  btnPressed: {
    opacity: 0.7,
  },
  detailsCard: {
    margin: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 14,
    paddingHorizontal: 14,
    backgroundColor: '#FFFFFF',
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 42,
  },
  detailsRowLabel: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '600',
  },
  detailsRowValue: {
    fontSize: 13,
    color: '#111827',
    fontWeight: '700',
  },
  detailsRowDivider: {
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  runsOnRow: {
    flexDirection: 'row',
    gap: 8,
  },
  dayLetter: {
    fontSize: 12,
    fontWeight: '800',
    width: 14,
    textAlign: 'center',
  },
  dayLetterActive: {
    color: '#0F766E',
  },
  dayLetterInactive: {
    color: '#D1D5DB',
  },
  timelineScroller: {
    flex: 1,
    paddingHorizontal: 16,
  },
  timelineScrollerContent: {
    paddingVertical: 12,
  },
  timelineRowContainer: {
    flexDirection: 'column',
  },
  dayIndicatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 14,
    width: '100%',
  },
  dayLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  dayBadge: {
    backgroundColor: '#000000',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 4,
    marginHorizontal: 8,
  },
  dayBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  stationRow: {
    flexDirection: 'row',
    minHeight: 74,
  },
  stationLeftColumn: {
    width: 68,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    paddingTop: 4,
  },
  stationCodeText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#374151',
  },
  stationTextTeal: {
    color: '#0F766E',
  },
  stationDistanceText: {
    fontSize: 10,
    color: '#9CA3AF',
    marginTop: 4,
  },
  stationCenterColumn: {
    width: 32,
    alignItems: 'center',
    justifyContent: 'flex-start',
    position: 'relative',
  },
  timelineLineHalf: {
    position: 'absolute',
    width: 2.5,
    left: '50%',
    marginLeft: -1.25,
  },
  timelineLineTop: {
    top: 0,
    bottom: '50%',
  },
  timelineLineBottom: {
    top: '50%',
    bottom: 0,
  },
  lineTeal: {
    backgroundColor: '#0F766E',
  },
  lineGrey: {
    backgroundColor: '#E5E7EB',
  },
  timelineCircleWrapper: {
    zIndex: 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 9,
    width: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  timelineCircleEmpty: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2.5,
    backgroundColor: '#FFFFFF',
    zIndex: 2,
    marginTop: 7,
  },
  timelineCircleTeal: {
    borderColor: '#0F766E',
    borderWidth: 3,
  },
  timelineCircleGrey: {
    borderColor: '#9CA3AF',
    borderWidth: 2,
  },
  stationRightColumn: {
    flex: 1,
    paddingLeft: 8,
    justifyContent: 'flex-start',
    paddingBottom: 16,
  },
  stationNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  stationNameText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111827',
    maxWidth: '65%',
  },
  stationNameBold: {
    fontWeight: '800',
    color: '#111827',
  },
  boardingPill: {
    borderWidth: 1,
    borderColor: '#BDC3C7',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    backgroundColor: '#F8F9FA',
  },
  boardingPillText: {
    fontSize: 8,
    fontWeight: '700',
    color: '#7F8C8D',
  },
  platformStopText: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 4,
  },
  timingsRow: {
    marginTop: 6,
  },
  timingsText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0F766E',
  },
  timingsLabel: {
    fontWeight: '400',
    color: '#6B7280',
  },
  selectedPathCard: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 14,
    marginVertical: 6,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  transparentPathCard: {
    paddingHorizontal: 12,
    paddingVertical: 0,
    marginVertical: 0,
    backgroundColor: 'transparent',
  },
  disclaimerContainer: {
    marginTop: 20,
    marginBottom: 30,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 16,
  },
  disclaimerTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 6,
  },
  disclaimerText: {
    fontSize: 11,
    color: '#6B7280',
    lineHeight: 16,
  },
  bottomBar: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    backgroundColor: '#FFFFFF',
  },
  okayButton: {
    height: 48,
    borderRadius: 24,
    backgroundColor: '#1A73E8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  okayButtonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.99 }],
  },
  okayButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
});
