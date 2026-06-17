import React, { useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Pressable, Animated, Dimensions, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSuperAppStore } from '@/src/store/super-app-store';
import { formatCurrency } from '@/src/lib/travel-data';

const { width, height } = Dimensions.get('window');

const CONFETTI_COLORS = ['#EF4444', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899'];
const NUM_CONFETTI = 60;

function ConfettiPiece({ delay }: { delay: number }) {
  const initialX = useRef(Math.random() * width).current;
  const translateY = useRef(new Animated.Value(-50)).current;
  const translateX = useRef(new Animated.Value(initialX)).current;
  const rotate = useRef(new Animated.Value(0)).current;
  const color = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
  const size = Math.random() * 8 + 6;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(delay),
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: height + 150,
          duration: Math.random() * 2000 + 2500,
          useNativeDriver: true,
        }),
        Animated.timing(translateX, {
          toValue: initialX + (Math.random() * 100 - 50),
          duration: Math.random() * 2000 + 2500,
          useNativeDriver: true,
        }),
        Animated.timing(rotate, {
          toValue: 1,
          duration: Math.random() * 2000 + 2000,
          useNativeDriver: true,
        })
      ])
    ]).start();
  }, []);

  const spin = rotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  const opacity = translateY.interpolate({
    inputRange: [-50, height - 100, height + 150],
    outputRange: [1, 1, 0],
    extrapolate: 'clamp'
  }) as any;

  const AnimatedView = Animated.View as any;

  return (
    <AnimatedView style={{
      position: 'absolute',
      width: size,
      height: size,
      backgroundColor: color,
      borderRadius: Math.random() > 0.5 ? size / 2 : 2,
      opacity,
      transform: [
        { translateX },
        { translateY },
        { rotate: spin },
      ]
    }} />
  );
}

export default function TravelConfirmationScreen() {
  const { selectedTravelOffer, travelSearch } = useSuperAppStore();
  const scaleValue = useRef(new Animated.Value(0)).current;
  const insets = useSafeAreaInsets();
  const AnimatedView = Animated.View as any;

  useEffect(() => {
    Animated.spring(scaleValue, {
      toValue: 1,
      friction: 4,
      tension: 40,
      useNativeDriver: true,
    }).start();
  }, []);

  if (!selectedTravelOffer) return null;

  return (
    <View style={styles.safeArea}>
      
      {/* Confetti Animation Layer */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        {Array.from({ length: NUM_CONFETTI }).map((_, i) => (
          <ConfettiPiece key={i} delay={Math.random() * 1500} />
        ))}
      </View>

      <View style={[styles.header, { paddingTop: Math.max(insets.top, 16) }]}>
        <Text style={styles.headerTitle}>Confirmation</Text>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <AnimatedView style={[styles.successIconWrapper, { transform: [{ scale: scaleValue }] }]}>
           <MaterialCommunityIcons name="check-circle" size={100} color="#10B981" />
        </AnimatedView>
        
        <Text style={styles.title}>Booking Confirmed!</Text>
        <Text style={styles.subtitle}>Your flight has been successfully booked.</Text>

        <View style={styles.ticketCard}>
           <View style={{flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: '#E5E5EA', paddingBottom: 16, marginBottom: 16}}>
             <View>
               <Text style={styles.cardLabel}>FROM</Text>
               <Text style={styles.cardCity}>{travelSearch.originCity}</Text>
               <Text style={styles.cardCode}>{travelSearch.originCode}</Text>
             </View>
             <View style={{alignItems: 'center', justifyContent: 'center'}}>
               <MaterialCommunityIcons name="airplane" size={24} color="#0084FF" style={{transform: [{rotate: '90deg'}]}} />
               <Text style={{fontSize: 10, color: '#8E8E93', marginTop: 4}}>Non-stop</Text>
             </View>
             <View style={{alignItems: 'flex-end'}}>
               <Text style={styles.cardLabel}>TO</Text>
               <Text style={styles.cardCity}>{travelSearch.destinationCity}</Text>
               <Text style={styles.cardCode}>{travelSearch.destinationCode}</Text>
             </View>
           </View>

           <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
             <View>
               <Text style={styles.cardLabel}>DATE</Text>
               <Text style={styles.cardValue}>11 Apr 2024</Text>
             </View>
             <View>
               <Text style={styles.cardLabel}>TRAVELLERS</Text>
               <Text style={styles.cardValue}>{travelSearch.travellers} Adult</Text>
             </View>
             <View>
               <Text style={styles.cardLabel}>AMOUNT PAID</Text>
               <Text style={styles.cardValue}>₹ 7,066</Text>
             </View>
           </View>
        </View>

        <Pressable style={styles.primaryBtn} onPress={() => router.push('/travel-ticket')}>
           <Text style={styles.primaryBtnText}>VIEW TICKET</Text>
        </Pressable>
        <Pressable style={styles.secondaryBtn} onPress={() => router.navigate('/(explore)')}>
           <Text style={styles.secondaryBtnText}>BACK TO HOME</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFF' },
  header: { paddingHorizontal: 24, paddingBottom: 12, backgroundColor: '#FFF' },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#333' },
  container: { flexGrow: 1, padding: 24, alignItems: 'center', justifyContent: 'center' },
  
  successIconWrapper: { marginBottom: 24, shadowColor: '#10B981', shadowOpacity: 0.3, shadowRadius: 20, shadowOffset: { width: 0, height: 10 }, elevation: 10 },
  title: { fontSize: 28, fontWeight: '900', color: '#333', marginBottom: 8, textAlign: 'center' },
  subtitle: { fontSize: 13, color: '#8E8E93', marginBottom: 40, textAlign: 'center' },

  ticketCard: { width: '100%', backgroundColor: '#F5FAFF', borderRadius: 16, padding: 20, marginBottom: 40, borderWidth: 1, borderColor: '#D0E6FF' },
  cardLabel: { fontSize: 10, fontWeight: '800', color: '#8E8E93', marginBottom: 4 },
  cardCity: { fontSize: 16, fontWeight: '800', color: '#333' },
  cardCode: { fontSize: 18, fontWeight: '900', color: '#0084FF', marginTop: 4 },
  cardValue: { fontSize: 13, fontWeight: '800', color: '#333' },

  primaryBtn: { width: '100%', backgroundColor: '#0084FF', paddingVertical: 16, borderRadius: 12, alignItems: 'center', marginBottom: 16 },
  primaryBtnText: { color: '#FFFFFF', fontSize: 13, fontWeight: '800' },
  secondaryBtn: { width: '100%', paddingVertical: 16, borderRadius: 12, alignItems: 'center' },
  secondaryBtnText: { color: '#0084FF', fontSize: 13, fontWeight: '800' },
});
