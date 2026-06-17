import { useEffect, useRef, useState } from 'react';
import {
  Animated, Easing, Pressable,
  StyleSheet, Text, View,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import CinematicSplash from './_cinematic-splash';

// ── Partner data (matching booking.html) ───────────────────────────────────
const PARTNERS: { id: string; label: string; sub?: string; color: string; bg: string; iconColor?: string }[] = [
  { id: 'quickride',  label: 'Quick Ride', color: '#15803D', bg: '#F0FDF4', iconColor: '#22C55E' },
  { id: 'meru',       label: 'MERU',       color: '#1E293B', bg: '#FFFBEB', iconColor: '#F59E0B' },
  { id: 'megacabs',   label: 'MegaCabs',   color: '#1E3A8A', bg: '#EFF6FF', iconColor: '#EF4444' },
  { id: 'transferz',  label: 'transferz',  sub: '.com',      color: '#0F172A', bg: '#F8FAFC' },
  { id: 'gozo',       label: 'GOZO',       color: '#2563EB', bg: '#F0F9FF'  },
  { id: 'savaari',    label: 'SAVAARI',    color: '#FFFFFF', bg: '#0099CC'  },
  { id: 'wti',        label: 'WTi',        sub: 'cabs',      color: '#1E3A8A', bg: '#F8FAFC' },
  { id: 'avis',       label: 'AVIS',       color: '#DC2626', bg: '#FFF1F2'  },
];

const STATUS_MESSAGES = [
  'Comparing prices across partners...',
  'Checking availability with Meru...',
  'Pinging Savaari servers...',
  'Negotiating the best fare...',
  'Looking for top-rated drivers...',
  'Almost there...',
];

// ── Ripple ring component ──────────────────────────────────────────────────
function RippleRing({ delay }: { delay: number }) {
  const scale   = useRef(new Animated.Value(0.8)).current;
  const opacity = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.parallel([
        Animated.timing(scale,   { toValue: 3,   duration: 2000, delay, easing: Easing.out(Easing.quad), useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0,   duration: 2000, delay, easing: Easing.out(Easing.quad), useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Animated.View
      style={[
        styles.rippleRing,
        { transform: [{ scale }], opacity },
      ]}
    />
  );
}

// ── Airport Status Messages ──────────────────────────────────────────────────
const AIRPORT_STATUS_MESSAGES = [
  'Connecting to live airport ATC feed...',
  'Checking gate arrival status for HYD...',
  'Pinging airport curbside chauffeurs...',
  'Comparing partner flight-tracking fares...',
  'Matching on-time driver guarantees...',
  'Ready for terminal pickup...',
];

// ── Partner card ────────────────────────────────────────────────────────────
function PartnerCard({ partner, active, isDarkTheme }: { partner: typeof PARTNERS[0]; active: boolean; isDarkTheme?: boolean }) {
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (active) {
      Animated.spring(scale, { toValue: 1.05, useNativeDriver: true, friction: 5 }).start();
    } else {
      Animated.spring(scale, { toValue: 1, useNativeDriver: true, friction: 5 }).start();
    }
  }, [active, scale]);

  return (
    <Animated.View
      style={[
        styles.partnerCard,
        { 
          backgroundColor: isDarkTheme 
            ? (active ? 'rgba(99, 102, 241, 0.18)' : 'rgba(15, 23, 42, 0.6)') 
            : (active ? '#F5F3FF' : '#FFFFFF'), 
          borderColor: isDarkTheme
            ? (active ? '#6366F1' : 'rgba(255, 255, 255, 0.08)')
            : (active ? '#4F46E5' : '#E2E8F0'),
          transform: [{ scale }] 
        },
        active && !isDarkTheme && styles.partnerCardActive,
      ]}
    >
      {/* Savaari: colored bg label */}
      {partner.id === 'savaari' ? (
        <View style={[styles.savaariPill, { backgroundColor: partner.bg }]}>
          <Text style={[styles.savaariText]}>{partner.label}</Text>
        </View>
      ) : partner.id === 'gozo' ? (
        <View style={styles.gozoRow}>
          <Text style={[styles.partnerLabel, { color: isDarkTheme ? '#E2E8F0' : partner.color, letterSpacing: 3, fontSize: 16 }]}>G</Text>
          <View style={styles.gozoCircle} />
          <Text style={[styles.partnerLabel, { color: isDarkTheme ? '#E2E8F0' : partner.color, letterSpacing: 3, fontSize: 16 }]}>Z</Text>
          <View style={[styles.gozoCircle, { backgroundColor: '#F97316' }]} />
        </View>
      ) : partner.id === 'meru' ? (
        <View style={styles.meruRow}>
          <Text style={styles.meruCaret}>^</Text>
          <Text style={[styles.meruText, isDarkTheme && { color: '#E2E8F0' }]}>MERU</Text>
        </View>
      ) : (
        <Text style={[styles.partnerLabel, { color: isDarkTheme ? '#E2E8F0' : partner.color }]}>
          {partner.label}
          {partner.sub ? <Text style={[styles.partnerSub, isDarkTheme && { color: '#94A3B8' }]}>{partner.sub}</Text> : null}
        </Text>
      )}
    </Animated.View>
  );
}

// ── Main Screen ─────────────────────────────────────────────────────────────
export default function CabLoadingScreen() {
  const params = useLocalSearchParams<{ type?: string }>();
  const [statusIdx,     setStatusIdx]     = useState(0);
  const [statusVisible, setStatusVisible] = useState(true);
  const [activePing,    setActivePing]    = useState<Set<string>>(new Set());

  const isAirport = params.type === 'airport';

  // Runway lights animation loop (only for airport)
  const [activeLightIdx, setActiveLightIdx] = useState(0);
  useEffect(() => {
    if (!isAirport) return;
    const interval = setInterval(() => {
      setActiveLightIdx((prev) => (prev + 1) % 5);
    }, 250);
    return () => clearInterval(interval);
  }, [isAirport]);

  // Airplane flight tracking animation loop
  const flightProgress = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (!isAirport) return;
    const loop = Animated.loop(
      Animated.timing(flightProgress, {
        toValue: 1,
        duration: 2200,
        easing: Easing.inOut(Easing.quad),
        useNativeDriver: true,
      })
    );
    loop.start();
    return () => loop.stop();
  }, [isAirport, flightProgress]);

  // Interpolations for flight progress
  const planeTranslateY = flightProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [60, -60],
  });
  const planeScale = flightProgress.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.6, 1.2, 0.7],
  });
  const planeOpacity = flightProgress.interpolate({
    inputRange: [0, 0.2, 0.8, 1],
    outputRange: [0, 1, 1, 0],
  });

  // Navigate to results after 4.2s
  useEffect(() => {
    const nav = setTimeout(() => {
      router.replace({ pathname: '/(cab-module)/cab-results', params: { type: params.type } });
    }, 4200);
    return () => clearTimeout(nav);
  }, [params.type]);

  // Cycle status messages
  useEffect(() => {
    const cycle = setInterval(() => {
      setStatusVisible(false);
      setTimeout(() => {
        setStatusIdx(i => (i + 1) % (isAirport ? AIRPORT_STATUS_MESSAGES.length : STATUS_MESSAGES.length));
        setStatusVisible(true);
      }, 300);
    }, 2500);
    return () => clearInterval(cycle);
  }, [isAirport]);

  // Random partner pinging
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    const ping = () => {
      const count = Math.random() > 0.7 ? 2 : 1;
      const picks = new Set<string>();
      while (picks.size < count) {
        picks.add(PARTNERS[Math.floor(Math.random() * PARTNERS.length)].id);
      }
      setActivePing(picks);
      timeout = setTimeout(ping, Math.floor(Math.random() * 800) + 400);
    };
    timeout = setTimeout(ping, 1000);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <View style={styles.container}>
      <CinematicSplash />

      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.closeBtn}>
          <MaterialCommunityIcons name="close" size={20} color="#475569" />
        </Pressable>
        <View style={styles.liveBadge}>
          <View style={styles.liveDot} />
          <Text style={styles.liveText}>
            {isAirport ? 'FLIGHT TRACKED' : 'LIVE SEARCH'}
          </Text>
        </View>
      </View>

      {/* ── Center: Radar + Text ── */}
      <View style={styles.centerArea}>
        {isAirport ? (
          /* Cinematic Runway & Flight Path Tracer */
          <View style={styles.runwayContainer}>
            <View style={styles.runwayLine} />
            
            {/* Runway lights Left */}
            <View style={styles.lightsLeft}>
              {[0, 1, 2, 3, 4].map((i) => {
                const isActive = activeLightIdx === i;
                return (
                  <View
                    key={`light-l-${i}`}
                    style={[
                      styles.runwayLight,
                      {
                        backgroundColor: isActive ? '#4F46E5' : '#E2E8F0',
                        opacity: isActive ? 1 : 0.4,
                      },
                    ]}
                  />
                );
              })}
            </View>

            {/* Runway lights Right */}
            <View style={styles.lightsRight}>
              {[0, 1, 2, 3, 4].map((i) => {
                const isActive = activeLightIdx === i;
                return (
                  <View
                    key={`light-r-${i}`}
                    style={[
                      styles.runwayLight,
                      {
                        backgroundColor: isActive ? '#4F46E5' : '#E2E8F0',
                        opacity: isActive ? 1 : 0.4,
                      },
                    ]}
                  />
                );
              })}
            </View>

            {/* Hub base circle */}
            <View style={styles.radarHub}>
              <LinearGradient
                colors={['#EEF2FF', '#C7D2FE']}
                style={StyleSheet.absoluteFillObject}
              />
              <MaterialCommunityIcons name="car" size={32} color="#4F46E5" />
            </View>

            {/* Gliding Airplane */}
            <Animated.View
              style={[
                styles.glidingPlane,
                {
                  transform: [
                    { translateY: planeTranslateY },
                    { scale: planeScale },
                  ],
                  opacity: planeOpacity,
                },
              ]}
            >
              <MaterialCommunityIcons name="airplane-takeoff" size={36} color="#FBBF24" />
            </Animated.View>
          </View>
        ) : (
          /* Radar ripple */
          <View style={styles.radarWrap}>
            <RippleRing delay={0}   />
            <RippleRing delay={600} />
            <RippleRing delay={1200}/>

            {/* Violet hub circle */}
            <View style={styles.radarHub}>
              <LinearGradient
                colors={['#6D28D9', '#4F46E5']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.radarGrad}
              >
                <MaterialCommunityIcons name="car" size={40} color="#FFFFFF" />
              </LinearGradient>
            </View>
          </View>
        )}

        {/* Status text */}
        <View style={styles.textBlock}>
          <Text style={styles.headingText}>
            {isAirport ? 'Matching Airport Rides' : 'Finding your ride'}
          </Text>
          <Text
            style={[
              styles.statusText,
              { opacity: statusVisible ? 1 : 0 },
            ]}
            numberOfLines={1}
          >
            {isAirport ? AIRPORT_STATUS_MESSAGES[statusIdx] : STATUS_MESSAGES[statusIdx]}
          </Text>
        </View>
      </View>

      {/* ── Bottom: Partner Grid ── */}
      <View style={styles.partnerPanel}>
        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerLabel}>SEARCHING VIA</Text>
          <View style={styles.dividerLine} />
        </View>

        <View style={styles.partnerGrid}>
          {PARTNERS.map(p => (
            <PartnerCard
              key={p.id}
              partner={p}
              active={activePing.has(p.id)}
            />
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

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 56,
    paddingBottom: 16,
    zIndex: 20,
  },
  closeBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#EEF2FF',
    borderWidth: 1,
    borderColor: '#E0E7FF',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#4F46E5',
  },
  liveText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#4338CA',
    letterSpacing: 0.8,
  },

  // Center radar
  centerArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 40,
    gap: 40,
  },
  radarWrap: {
    width: 128,
    height: 128,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rippleRing: {
    position: 'absolute',
    width: 128,
    height: 128,
    borderRadius: 64,
    borderWidth: 2,
    borderColor: '#6366F1',
  },
  radarHub: {
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: 'hidden',
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 10,
  },
  radarGrad: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Status text
  textBlock: {
    alignItems: 'center',
    gap: 8,
  },
  headingText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#64748B',
    letterSpacing: 0.2,
  },

  // Partner panel
  partnerPanel: {
    backgroundColor: '#F8FAFC',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingTop: 24,
    paddingHorizontal: 20,
    paddingBottom: 40,
    borderTopWidth: 1,
    borderColor: '#F1F5F9',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E2E8F0',
  },
  dividerLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 1.5,
  },
  partnerGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  partnerCard: {
    width: '47.5%',
    height: 56,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
    paddingHorizontal: 8,
  },
  partnerCardActive: {
    borderColor: '#4F46E5',
    shadowColor: '#4F46E5',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4,
  },
  partnerLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1E293B',
    letterSpacing: 0.2,
  },
  partnerSub: {
    fontSize: 10,
    fontWeight: '400',
    color: '#64748B',
  },

  // Partner-specific
  savaariPill: {
    paddingHorizontal: 16,
    paddingVertical: 5,
    borderRadius: 6,
    width: '80%',
    alignItems: 'center',
  },
  savaariText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
    fontStyle: 'italic',
    letterSpacing: 1.5,
  },
  gozoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  gozoCircle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 2.5,
    borderColor: '#2563EB',
    backgroundColor: 'transparent',
  },
  meruRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 2,
  },
  meruCaret: {
    fontSize: 18,
    fontWeight: '900',
    color: '#F59E0B',
    lineHeight: 22,
    marginTop: -2,
  },
  meruText: {
    fontSize: 16,
    fontWeight: '900',
    fontStyle: 'italic',
    color: '#1E293B',
    letterSpacing: -0.5,
  },
  darkContainer: {
    backgroundColor: '#05050D',
  },
  darkCloseBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  darkLiveBadge: {
    backgroundColor: 'rgba(6, 182, 212, 0.12)',
    borderColor: 'rgba(6, 182, 212, 0.25)',
    borderWidth: 1,
  },
  darkLiveDot: {
    backgroundColor: '#06B6D4',
  },
  darkLiveText: {
    color: '#06B6D4',
  },
  darkHeadingText: {
    color: '#FFFFFF',
  },
  darkStatusText: {
    color: '#94A3B8',
  },
  darkPartnerPanel: {
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  darkDividerLine: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  darkDividerLabel: {
    color: '#64748B',
  },

  // Runway Styles
  runwayContainer: {
    width: 140,
    height: 180,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  runwayLine: {
    position: 'absolute',
    height: '100%',
    width: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderStyle: 'dashed',
    borderRadius: 1,
  },
  lightsLeft: {
    position: 'absolute',
    left: 20,
    height: '100%',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  lightsRight: {
    position: 'absolute',
    right: 20,
    height: '100%',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  runwayLight: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  glidingPlane: {
    position: 'absolute',
    shadowColor: '#FBBF24',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
  },
});
