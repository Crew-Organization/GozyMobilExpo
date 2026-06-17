import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, TextInput, Image } from 'react-native';
import { router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { cabTabs, type CabTabId } from '@/src/lib/cab-data';
import { spacing } from '@/src/theme/tokens';

export default function CabSearchScreen() {
  const [activeTab, setActiveTab] = useState<CabTabId>('airport');
  const [tripType, setTripType] = useState<'one-way' | 'round-trip'>('one-way');
  const [returnToPickup, setReturnToPickup] = useState(false);

  const [fromText, setFromText] = useState('');
  const [toText, setToText] = useState('');

  const isOutstation = activeTab === 'outstation';
  const isAirport = activeTab === 'airport';
  const isHourly = activeTab === 'hourly';
  const isRailway = activeTab === 'railway';

  const handleSearch = () => {
    router.push({ pathname: '/(travel)/(cabs)/cab-loading', params: { type: activeTab } });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12} style={styles.backBtn}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#0F172A" />
        </Pressable>
        <Text style={styles.headerTitle}>Cab Search</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        {cabTabs.map((tab) => {
          const active = activeTab === tab.id;
          let iconName: keyof typeof MaterialCommunityIcons.glyphMap = 'car-side';
          let tabLabel = '';
          if (tab.id === 'outstation') { iconName = 'car'; tabLabel = 'Outstation\ntrips'; }
          else if (tab.id === 'airport') { iconName = 'airplane'; tabLabel = 'Airport\nTransfer'; }
          else if (tab.id === 'hourly') { iconName = 'clock-outline'; tabLabel = 'Hourly\nRentals'; }
          else if (tab.id === 'railway') { iconName = 'train'; tabLabel = 'Railway\nTransfers'; }

          return (
            <Pressable key={tab.id} onPress={() => setActiveTab(tab.id)} style={styles.tab}>
              <MaterialCommunityIcons name={iconName} size={24} color={active ? '#0084FF' : '#64748B'} />
              <Text style={[styles.tabText, active && styles.tabTextActive]}>{tabLabel}</Text>
              {active && <View style={styles.tabUnderline} />}
            </Pressable>
          );
        })}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Banner Section */}
        {isOutstation && (
          <View style={[styles.banner, { backgroundColor: '#FFEDD5' }]}>
            <View style={styles.bannerIconBox}>
              <MaterialCommunityIcons name="map-marker-path" size={20} color="#EA580C" />
            </View>
            <View style={styles.bannerTextContainer}>
              <Text style={styles.bannerTitle}>Plan your multicity road trip</Text>
              <Text style={styles.bannerSub}>Add stops and more...</Text>
            </View>
            <MaterialCommunityIcons name="shield-check" size={24} color="#F59E0B" />
          </View>
        )}
        {isAirport && (
          <View style={[styles.banner, { backgroundColor: '#E0F2FE' }]}>
            <View style={styles.bannerIconBox}>
              <MaterialCommunityIcons name="airplane-landing" size={20} color="#0284C7" />
            </View>
            <View style={styles.bannerTextContainer}>
              <Text style={styles.bannerTitle}>Flight Tracked Cab</Text>
              <Text style={styles.bannerSub}>Cabs ready whenever you land</Text>
            </View>
          </View>
        )}
        {(isHourly || isRailway) && (
          <View style={[styles.banner, { backgroundColor: '#E0F2FE' }]}>
            <View style={styles.bannerIconBox}>
              <MaterialCommunityIcons name="shield-check" size={20} color="#0D9488" />
            </View>
            <View style={styles.bannerTextContainer}>
              <Text style={styles.bannerTitle}>Clean Cabs with Verified Drivers</Text>
              <Text style={styles.bannerSub}>Always on-time cabs</Text>
            </View>
          </View>
        )}

        {/* Segmented Control for Outstation */}
        {isOutstation && (
          <View style={styles.segmentedControl}>
            <Pressable onPress={() => setTripType('one-way')} style={styles.segmentOption}>
              <View style={[styles.radio, tripType === 'one-way' && styles.radioActive]}>
                {tripType === 'one-way' && <View style={styles.radioInner} />}
              </View>
              <Text style={[styles.segmentText, tripType === 'one-way' && styles.segmentTextActive]}>One Way</Text>
            </Pressable>
            <Pressable onPress={() => setTripType('round-trip')} style={styles.segmentOption}>
              <View style={[styles.radio, tripType === 'round-trip' && styles.radioActive]}>
                {tripType === 'round-trip' && <View style={styles.radioInner} />}
              </View>
              <Text style={[styles.segmentText, tripType === 'round-trip' && styles.segmentTextActive]}>Round Trip</Text>
            </Pressable>
          </View>
        )}

        {/* Form Fields */}
        <View style={styles.formCard}>
          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>{isHourly ? 'PICK UP ADDRESS' : 'FROM'}</Text>
            <View style={styles.inputRow}>
              <MaterialCommunityIcons name="circle-outline" size={16} color="#64748B" />
              <TextInput 
                placeholder="Enter pickup address"
                placeholderTextColor="#94A3B8"
                style={styles.textInput}
                value={fromText}
                onChangeText={setFromText}
              />
            </View>
          </View>
          <View style={styles.divider} />
          
          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>{isHourly ? 'DROP ADDRESS (OPTIONAL)' : 'TO'}</Text>
            <View style={styles.inputRow}>
              <MaterialCommunityIcons name="map-marker-outline" size={16} color="#64748B" />
              <TextInput 
                placeholder="Enter drop address"
                placeholderTextColor="#94A3B8"
                style={styles.textInput}
                value={toText}
                onChangeText={setToText}
              />
            </View>
          </View>
          {!isHourly && (
            <Pressable style={styles.swapBtn} onPress={() => { const tmp = fromText; setFromText(toText); setToText(tmp); }}>
              <MaterialCommunityIcons name="swap-vertical" size={20} color="#0084FF" />
            </Pressable>
          )}
        </View>

        {isOutstation && (
          <Pressable style={styles.addStopsBtn}>
            <MaterialCommunityIcons name="plus" size={16} color="#0084FF" />
            <Text style={styles.addStopsText}>ADD STOPS</Text>
            <View style={styles.newBadge}><Text style={styles.newBadgeText}>NEW</Text></View>
          </Pressable>
        )}

        {isHourly && (
          <Pressable onPress={() => setReturnToPickup(!returnToPickup)} style={styles.checkboxContainer}>
            <View style={[styles.checkbox, returnToPickup && styles.checkboxActive]}>
              {returnToPickup && <MaterialCommunityIcons name="check" size={14} color="#FFF" />}
            </View>
            <Text style={styles.checkboxLabel}>I want to return to the pickup location</Text>
          </Pressable>
        )}

        {/* Date and Additional Info */}
        <View style={styles.formCard}>
          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>TRIP START</Text>
            <View style={styles.inputRow}>
              <MaterialCommunityIcons name="calendar-outline" size={16} color="#64748B" />
              <Text style={styles.valueText}>Thu, <Text style={{fontWeight: '700'}}>23 Apr</Text> 2026, 10:00 AM</Text>
            </View>
          </View>
        </View>

        {isHourly ? (
          <View style={[styles.formCard, { marginTop: spacing.sm }]}>
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>SELECT PACKAGE</Text>
              <Text style={styles.valueTextLarge}>1 Hrs 10 Kms</Text>
            </View>
          </View>
        ) : isOutstation ? (
          <View style={[styles.formCard, { marginTop: spacing.sm }]}>
            <View style={styles.inputWrapper}>
              <View style={styles.inputRow}>
                <MaterialCommunityIcons name="account-outline" size={16} color="#64748B" />
                <Text style={styles.valueTextLarge}>TRAVELLERS & BAGS (Optional)</Text>
              </View>
            </View>
          </View>
        ) : null}

        {/* Search Button */}
        <Pressable style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchButtonText}>SEARCH</Text>
        </Pressable>

        {/* Bottom content: Offers / Trust banner */}
        {(isHourly || isAirport) && (
          <View style={styles.trustBanner}>
            <Text style={styles.trustTitle}>{isHourly ? '32,000+' : '6,40,000+'}</Text>
            <Text style={styles.trustDesc}>
              {isHourly ? 'Customers trusted us with their\nlocal Hourly rental trips' : 'Customers trusted us with their\nAirport Trips'}
            </Text>
          </View>
        )}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{isHourly ? "What's New" : 'Offers'}</Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.offersScroll}>
          {isHourly ? (
            <>
              <View style={styles.whatsNewCard}>
                <MaterialCommunityIcons name="car-outline" size={32} color="#EA580C" />
                <View style={{flex:1, marginLeft: 12}}>
                  <Text style={styles.whatsNewTitle}>Pre-book International Airport cabs</Text>
                  <Text style={styles.whatsNewSub}>Get guaranteed airport cabs outside India with meet & greet services.</Text>
                </View>
              </View>
              <View style={styles.whatsNewCard}>
                <MaterialCommunityIcons name="wallet-outline" size={32} color="#3B82F6" />
                <View style={{flex:1, marginLeft: 12}}>
                  <Text style={styles.whatsNewTitle}>Make Your Trips Affordable</Text>
                  <Text style={styles.whatsNewSub}>With Book Now, Pay Later & No-Cost EMI Offers on all rentals.</Text>
                </View>
              </View>
            </>
          ) : (
            <>
              <View style={styles.offerCard}>
                <Image source={{uri: 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&w=300&q=80'}} style={styles.offerImage} />
                <View style={styles.offerFooter}>
                  <Text style={styles.offerText}>Grab Up to 40% OFF</Text>
                  <Text style={styles.offerSubtext}>On Packages, Flights, Stays, Cabs</Text>
                  <Text style={styles.bookNowText}>BOOK NOW &gt;</Text>
                </View>
              </View>
              <View style={styles.offerCard}>
                <Image source={{uri: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=300&q=80'}} style={styles.offerImage} />
                <View style={styles.offerFooter}>
                  <Text style={styles.offerText}>Grab Up to 40% OFF</Text>
                  <Text style={styles.offerSubtext}>On Outstation Trips</Text>
                  <Text style={styles.bookNowText}>BOOK NOW &gt;</Text>
                </View>
              </View>
            </>
          )}
        </ScrollView>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 56,
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
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    position: 'relative',
    gap: 4,
  },
  tabText: {
    fontSize: 10.5,
    color: '#64748B',
    textAlign: 'center',
    fontWeight: '500',
  },
  tabTextActive: {
    color: '#0084FF',
    fontWeight: '700',
  },
  tabUnderline: {
    position: 'absolute',
    bottom: -1,
    height: 3,
    backgroundColor: '#0084FF',
    width: '100%',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  bannerIconBox: {
    marginRight: 12,
  },
  bannerTextContainer: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  bannerSub: {
    fontSize: 10.5,
    color: '#64748B',
  },
  segmentedControl: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 16,
  },
  segmentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#0084FF',
    borderRadius: 20,
    gap: 8,
  },
  radio: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#0084FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioActive: {
    borderColor: '#0084FF',
  },
  radioInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#0084FF',
  },
  segmentText: {
    fontSize: 13,
    color: '#0084FF',
    fontWeight: '600',
  },
  segmentTextActive: {
    color: '#0084FF',
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    paddingHorizontal: 16,
    position: 'relative',
    marginBottom: 16,
  },
  inputWrapper: {
    paddingVertical: 12,
  },
  inputLabel: {
    fontSize: 10.5,
    color: '#64748B',
    marginBottom: 4,
    fontWeight: '600',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  textInput: {
    flex: 1,
    fontSize: 13,
    color: '#0F172A',
    fontWeight: '600',
    padding: 0,
  },
  valueText: {
    fontSize: 13,
    color: '#0F172A',
  },
  valueTextLarge: {
    fontSize: 13,
    color: '#0F172A',
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginLeft: 24,
  },
  swapBtn: {
    position: 'absolute',
    right: 16,
    top: '50%',
    marginTop: -16,
    width: 32,
    height: 32,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  addStopsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    marginBottom: 16,
    gap: 8,
  },
  addStopsText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  newBadge: {
    backgroundColor: '#FCE7F3',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  newBadgeText: {
    color: '#DB2777',
    fontSize: 9,
    fontWeight: '800',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxActive: {
    backgroundColor: '#0084FF',
    borderColor: '#0084FF',
  },
  checkboxLabel: {
    fontSize: 13,
    color: '#64748B',
  },
  searchButton: {
    backgroundColor: '#0084FF',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  searchButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  trustBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F9FF',
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
    gap: 12,
  },
  trustTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0284C7',
  },
  trustDesc: {
    fontSize: 12,
    color: '#475569',
    flex: 1,
  },
  sectionHeader: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  offersScroll: {
    gap: 16,
  },
  offerCard: {
    width: 280,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
  },
  offerImage: {
    width: '100%',
    height: 120,
  },
  offerFooter: {
    padding: 12,
  },
  offerText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  offerSubtext: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
    marginBottom: 8,
  },
  bookNowText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0084FF',
  },
  whatsNewCard: {
    width: 280,
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  whatsNewTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  whatsNewSub: {
    fontSize: 10.5,
    color: '#64748B',
    lineHeight: 16,
  },
});
