import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Text, Animated, Dimensions, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface CabEntrySplashProps {
  onPrepareExit: () => void;
  onFinish: () => void;
}

const { width } = Dimensions.get('window');

export default function CabEntrySplash({ onPrepareExit, onFinish }: CabEntrySplashProps) {
  // Animation variables
  const fadeExit = useRef(new Animated.Value(1)).current;
  
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.75)).current;
  
  const orb1Scale = useRef(new Animated.Value(0.6)).current;
  const orb2Scale = useRef(new Animated.Value(0.5)).current;
  
  const lineWidth = useRef(new Animated.Value(0)).current;
  
  const carTranslateX = useRef(new Animated.Value(-80)).current;
  const carOpacity = useRef(new Animated.Value(0)).current;
  
  const taglineOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // 1. Trigger background glowing ambient orbs expansion
    Animated.parallel([
      Animated.timing(orb1Scale, {
        toValue: 2.2,
        duration: 2500,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(orb2Scale, {
        toValue: 2.0,
        duration: 2500,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start();

    // 2. Orchestrated logo, line, car, and subtitle animation sequence
    Animated.sequence([
      // A. Logo fades and springs in
      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.spring(logoScale, {
          toValue: 1,
          friction: 6,
          tension: 35,
          useNativeDriver: true,
        }),
      ]),
      // B. Draw-in separator line expansion & car entry glide
      Animated.parallel([
        Animated.timing(lineWidth, {
          toValue: 1,
          duration: 650,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: false,
        }),
        Animated.timing(carOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.spring(carTranslateX, {
          toValue: 0,
          friction: 7,
          tension: 25,
          useNativeDriver: true,
        }),
      ]),
      // C. Tagline fades in smoothly
      Animated.timing(taglineOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();

    // 3. Keep showing the cinematic screen for a moment, then fade out the whole overlay
    const exitTimer = setTimeout(() => {
      onPrepareExit(); // Trigger the content fade-in and scale-up underneath
      Animated.timing(fadeExit, {
        toValue: 0,
        duration: 650,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }).start(() => {
        onFinish();
      });
    }, 2100);

    return () => clearTimeout(exitTimer);
  }, [onPrepareExit, onFinish, fadeExit, logoOpacity, logoScale, orb1Scale, orb2Scale, lineWidth, carOpacity, carTranslateX, taglineOpacity]);

  return (
    <Animated.View style={[styles.overlay, { opacity: fadeExit }]} pointerEvents="none">
      <LinearGradient
        colors={['#FFFFFF', '#FFFFFF', '#FFFFFF']}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      {/* Ambient Neon Glowing Orbs */}
      <Animated.View
        style={[
          styles.orb1,
          {
            transform: [{ scale: orb1Scale }],
          },
        ]}
      />
      <Animated.View
        style={[
          styles.orb2,
          {
            transform: [{ scale: orb2Scale }],
          },
        ]}
      />

      {/* Content Container */}
      <View style={styles.content}>
        {/* Brand Block */}
        <Animated.View style={{ opacity: logoOpacity, transform: [{ scale: logoScale }], alignItems: 'center' }}>
          <Text style={styles.brandTitle}>GOZY</Text>
          <Text style={styles.brandSubtitle}>C A B S</Text>
        </Animated.View>

        {/* Animated Divider Line */}
        <View style={styles.dividerWrapper}>
          <Animated.View
            style={[
              styles.dividerLine,
              {
                transform: [{ scaleX: lineWidth }],
              },
            ]}
          />
        </View>

        {/* Dynamic Car Silhouette Glide */}
        <View style={styles.carContainer}>
          <Animated.View
            style={{
              opacity: carOpacity,
              transform: [{ translateX: carTranslateX }],
            }}
          >
            <MaterialCommunityIcons name="car-sports" size={32} color="#7C3AED" />
          </Animated.View>
        </View>

        {/* Bottom Tagline */}
        <Animated.View style={{ opacity: taglineOpacity, marginTop: 12 }}>
          <Text style={styles.tagline}>PREMIUM RIDE EXPERIENCE</Text>
        </Animated.View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 9999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    zIndex: 10,
  },
  brandTitle: {
    fontSize: 48,
    fontWeight: '900',
    color: '#6D28D9',
    letterSpacing: 8,
    textShadowColor: 'rgba(109, 40, 217, 0.15)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 15,
  },
  brandSubtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8B5CF6',
    letterSpacing: 6,
    marginTop: 4,
  },
  dividerWrapper: {
    height: 2,
    width: width * 0.5,
    marginVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dividerLine: {
    height: 2,
    width: '100%',
    backgroundColor: '#7C3AED', // Premium purple divider line
    borderRadius: 1,
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  carContainer: {
    height: 40,
    width: 120,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  tagline: {
    fontSize: 11,
    fontWeight: '700',
    color: '#7C3AED',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  // Glowing ambient backdrops
  orb1: {
    position: 'absolute',
    top: '25%',
    left: '15%',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#6366F1', // Indigo glow
    opacity: 0.03,
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 120,
    elevation: 0,
  },
  orb2: {
    position: 'absolute',
    bottom: '30%',
    right: '15%',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: '#06B6D4', // Cyan glow
    opacity: 0.02,
    shadowColor: '#06B6D4',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 100,
    elevation: 0,
  },
});
