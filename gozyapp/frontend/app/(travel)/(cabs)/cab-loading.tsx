import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

const PARTNERS = [
  { id: 'olacabs',  label: 'Ola Cabs', color: '#1E293B', bg: '#FFFBEB', iconColor: '#000' },
  { id: 'meru',     label: 'MERU',     color: '#1E293B', bg: '#FFFBEB', iconColor: '#F59E0B' },
  { id: 'megacabs', label: 'MegaCabs', color: '#1E3A8A', bg: '#EFF6FF', iconColor: '#EF4444' },
  { id: 'transferz',label: 'transferz',sub: '.com',      color: '#0F172A', bg: '#F8FAFC' },
  { id: 'gozo',     label: 'GOZO',     color: '#2563EB', bg: '#F0F9FF'  },
  { id: 'savaari',  label: 'SAVAARI',  color: '#FFFFFF', bg: '#0099CC'  },
  { id: 'wti',      label: 'WTi',      sub: 'cabs',      color: '#1E3A8A', bg: '#F8FAFC' },
  { id: 'avis',     label: 'AVIS',     color: '#DC2626', bg: '#FFF1F2'  },
];

export default function CabLoadingScreen() {
  const params = useLocalSearchParams<{ type?: string }>();

  useEffect(() => {
    const nav = setTimeout(() => {
      router.replace({ pathname: '/(travel)/(cabs)/cab-results', params: { type: params.type } });
    }, 2500);
    return () => clearTimeout(nav);
  }, [params.type]);

  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <ActivityIndicator size="large" color="#0084FF" style={styles.spinner} />
        <Text style={styles.loadingText}>Finding the best ride with our{'\n'}Cab Partners</Text>
      </View>
      <View style={styles.bottomSection}>
        <View style={styles.grid}>
          {PARTNERS.map(p => (
            <View key={p.id} style={styles.partnerCard}>
              {p.id === 'savaari' ? (
                <View style={[styles.savaariPill, { backgroundColor: p.bg }]}>
                  <Text style={styles.savaariText}>{p.label}</Text>
                </View>
              ) : p.id === 'olacabs' ? (
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <View style={{width: 14, height: 14, borderRadius: 7, backgroundColor: '#C8EE2E', marginRight: 4}} />
                  <Text style={[styles.partnerLabel, { color: p.color }]}>Ola Cabs</Text>
                </View>
              ) : p.id === 'gozo' ? (
                <View style={styles.gozoRow}>
                  <Text style={[styles.partnerLabel, { color: p.color, letterSpacing: 1, fontSize: 13 }]}>G</Text>
                  <View style={styles.gozoCircle} />
                  <Text style={[styles.partnerLabel, { color: p.color, letterSpacing: 1, fontSize: 13 }]}>Z</Text>
                  <View style={[styles.gozoCircle, { backgroundColor: '#F97316' }]} />
                </View>
              ) : p.id === 'meru' ? (
                <View style={styles.meruRow}>
                  <Text style={styles.meruCaret}>^</Text>
                  <Text style={styles.meruText}>MERU</Text>
                </View>
              ) : (
                <Text style={[styles.partnerLabel, { color: p.color }]}>
                  {p.label}
                  {p.sub && <Text style={styles.partnerSub}>{p.sub}</Text>}
                </Text>
              )}
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  topSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinner: {
    marginBottom: 24,
    transform: [{ scale: 1.5 }],
  },
  loadingText: {
    fontSize: 16,
    color: '#475569',
    textAlign: 'center',
    lineHeight: 24,
  },
  bottomSection: {
    backgroundColor: '#1C1C1C',
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
    maxWidth: 320,
  },
  partnerCard: {
    width: '45%',
    height: 48,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  partnerLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1E293B',
  },
  partnerSub: {
    fontSize: 10,
    fontWeight: '400',
    color: '#64748B',
  },
  savaariPill: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 4,
    width: '80%',
    alignItems: 'center',
  },
  savaariText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#FFFFFF',
    fontStyle: 'italic',
  },
  gozoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  gozoCircle: {
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#2563EB',
    backgroundColor: 'transparent',
  },
  meruRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 2,
  },
  meruCaret: {
    fontSize: 13,
    fontWeight: '900',
    color: '#F59E0B',
    lineHeight: 16,
  },
  meruText: {
    fontSize: 13,
    fontWeight: '900',
    fontStyle: 'italic',
    color: '#1E293B',
  },
});
