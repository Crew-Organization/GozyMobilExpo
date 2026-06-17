import React, { useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Pressable, Animated, Dimensions, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSuperAppStore } from '@/src/store/super-app-store';

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

export default function FoodConfirmationScreen() {
  const { foodOrderConfirmation } = useSuperAppStore();
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

  if (!foodOrderConfirmation) return null;

  return (
    <View style={styles.safeArea}>
      
      {/* Confetti Animation Layer */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        {Array.from({ length: NUM_CONFETTI }).map((_, i) => (
          <ConfettiPiece key={i} delay={Math.random() * 1500} />
        ))}
      </View>

      <View style={[styles.header, { paddingTop: Math.max(insets.top, 16) }]}>
        <Text style={styles.headerTitle}>Order Confirmation</Text>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <AnimatedView style={[styles.successIconWrapper, { transform: [{ scale: scaleValue }] }]}>
           <MaterialCommunityIcons name="check-circle" size={100} color="#10B981" />
        </AnimatedView>
        
        <Text style={styles.title}>Order Placed!</Text>
        <Text style={styles.subtitle}>Your food is being prepared by {foodOrderConfirmation.restaurantName}.</Text>

        <View style={styles.ticketCard}>
           <View style={{flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: '#E5E5EA', paddingBottom: 16, marginBottom: 16}}>
             <View style={{ flex: 1 }}>
               <Text style={styles.cardLabel}>RESTAURANT</Text>
               <Text style={styles.cardCity}>{foodOrderConfirmation.restaurantName}</Text>
             </View>
             <View style={{alignItems: 'center', justifyContent: 'center', paddingHorizontal: 16}}>
               <MaterialCommunityIcons name="silverware-fork-knife" size={24} color="#0084FF" />
             </View>
             <View style={{ flex: 1, alignItems: 'flex-end' }}>
               <Text style={styles.cardLabel}>DELIVERING TO</Text>
               <Text style={styles.cardCity} numberOfLines={2}>{foodOrderConfirmation.addressLabel}</Text>
             </View>
           </View>

           <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
             <View>
               <Text style={styles.cardLabel}>ORDER ID</Text>
               <Text style={styles.cardValue}>{foodOrderConfirmation.orderId}</Text>
             </View>
             <View>
               <Text style={styles.cardLabel}>ESTIMATED TIME</Text>
               <Text style={styles.cardValue}>{foodOrderConfirmation.eta}</Text>
             </View>
             <View>
               <Text style={styles.cardLabel}>AMOUNT PAID</Text>
               <Text style={styles.cardValue}>Paid via {foodOrderConfirmation.paymentMethod.toUpperCase()}</Text>
             </View>
           </View>
        </View>

        <Pressable style={styles.primaryBtn} onPress={() => router.push('/food-tracking')}>
           <Text style={styles.primaryBtnText}>TRACK ORDER</Text>
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
  headerTitle: { fontSize: 24, fontWeight: '900', color: '#111827' },
  container: { padding: 24, alignItems: 'center', paddingTop: 40 },
  successIconWrapper: { marginBottom: 24 },
  title: { fontSize: 28, fontWeight: '900', color: '#111827', marginBottom: 8, textAlign: 'center' },
  subtitle: { fontSize: 16, color: '#6B7280', textAlign: 'center', marginBottom: 32, lineHeight: 24 },
  ticketCard: { width: '100%', backgroundColor: '#F9FAFB', borderRadius: 16, padding: 20, marginBottom: 32, borderWidth: 1, borderColor: '#E5E7EB' },
  cardLabel: { fontSize: 10, fontWeight: '800', color: '#6B7280', letterSpacing: 1, marginBottom: 4 },
  cardCity: { fontSize: 16, fontWeight: '900', color: '#111827' },
  cardValue: { fontSize: 14, fontWeight: '800', color: '#111827' },
  primaryBtn: { width: '100%', backgroundColor: '#0084FF', paddingVertical: 16, borderRadius: 12, alignItems: 'center', marginBottom: 16 },
  primaryBtnText: { color: '#FFFFFF', fontSize: 13, fontWeight: '900' },
  secondaryBtn: { width: '100%', backgroundColor: '#F3F4F6', paddingVertical: 16, borderRadius: 12, alignItems: 'center' },
  secondaryBtnText: { color: '#111827', fontSize: 13, fontWeight: '800' },
});
