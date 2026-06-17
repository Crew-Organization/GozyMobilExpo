import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, Animated, Easing, SafeAreaView, Platform } from 'react-native';
import { router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import CinematicSplash from './_cinematic-splash';

const { width, height } = Dimensions.get('window');

const colors = {
  primary: '#4F46E5', // Indigo
  primaryLight: '#EEF2FF',
  secondary: '#10B981', // Emerald
  background: '#F8FAFC',
  surface: '#FFFFFF',
  textMain: '#0F172A',
  textMuted: '#64748B',
  border: '#E2E8F0',
  danger: '#EF4444',
  dangerLight: '#FEF2F2',
  warning: '#F59E0B',
};

export default function CabActiveScreen() {
  const [pulseAnim] = useState(new Animated.Value(1));
  const AnimatedView = Animated.View as any;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <CinematicSplash />
        {/* Dynamic Map Background simulating movement */}
        <View style={styles.mapContainer}>
          <LinearGradient
            colors={['#E2E8F0', '#F1F5F9', '#CBD5E1']}
            style={styles.mapPlaceholder}
          />
          {/* Map Grid Lines */}
          <View style={styles.gridOverlay}>
            {Array.from({ length: 10 }).map((_, i) => (
              <View key={`v-${i}`} style={[styles.gridLineVertical, { left: `${(i + 1) * 10}%` }]} />
            ))}
            {Array.from({ length: 10 }).map((_, i) => (
              <View key={`h-${i}`} style={[styles.gridLineHorizontal, { top: `${(i + 1) * 10}%` }]} />
            ))}
          </View>

          {/* Route Line Mock */}
          <View style={styles.mockRoute} />

          {/* User Location Marker */}
          <View style={styles.userMarkerContainer}>
            <View style={styles.userMarkerInner} />
            <View style={styles.userMarkerPulse} />
          </View>

          {/* Driver Location Marker */}
          <AnimatedView style={[styles.driverMarkerContainer, { transform: [{ scale: pulseAnim }] }]}>
            <View style={styles.driverMarkerBubble}>
              <MaterialCommunityIcons name="car-side" size={16} color="#FFFFFF" />
            </View>
            <View style={styles.driverMarkerPointer} />
          </AnimatedView>

          {/* Header Controls */}
          <View style={styles.headerControls}>
            <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
              <MaterialCommunityIcons name="arrow-left" size={24} color={colors.textMain} />
            </TouchableOpacity>
            <View style={styles.etaBadge}>
              <View style={styles.dotIndicator} />
              <Text style={styles.etaBadgeText}>3 mins away</Text>
            </View>
          </View>
        </View>

        {/* Bottom Sheet Card */}
        <View style={styles.bottomSheet}>
          {/* Drag Indicator */}
          <View style={styles.dragIndicator} />

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            
            {/* OTP Section */}
            <View style={styles.otpCard}>
              <View>
                <Text style={styles.otpLabel}>Your OTP</Text>
                <Text style={styles.otpValue}>5021</Text>
              </View>
              <View style={styles.otpRight}>
                <TouchableOpacity style={styles.copyBtn}>
                  <MaterialCommunityIcons name="content-copy" size={18} color={colors.primary} />
                  <Text style={styles.copyBtnText}>Copy</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Driver & Vehicle Info */}
            <View style={styles.driverCard}>
              <View style={styles.driverAvatarContainer}>
                <LinearGradient
                  colors={['#E2E8F0', '#CBD5E1']}
                  style={styles.driverAvatar}
                >
                  <MaterialCommunityIcons name="account" size={32} color="#94A3B8" />
                </LinearGradient>
                <View style={styles.driverRatingBadge}>
                  <MaterialCommunityIcons name="star" size={10} color="#FFFFFF" />
                  <Text style={styles.driverRatingText}>4.9</Text>
                </View>
              </View>
              
              <View style={styles.driverInfo}>
                <Text style={styles.driverName}>Ramesh Kumar</Text>
                <Text style={styles.driverCar}>Maruti Suzuki Swift</Text>
              </View>
              
              <View style={styles.plateBadge}>
                <Text style={styles.plateText}>TS 09 EB 1234</Text>
              </View>
            </View>

            {/* Communication Controls */}
            <View style={styles.actionRow}>
              <TouchableOpacity style={styles.primaryActionBtn}>
                <MaterialCommunityIcons name="phone" size={22} color="#FFFFFF" />
                <Text style={styles.primaryActionText}>Call</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.secondaryActionBtn}
                onPress={() => router.push({
                  pathname: '/(chat)/[conversationId]',
                  params: { conversationId: 'conv-1' }
                })}
              >
                <MaterialCommunityIcons name="message-text-outline" size={22} color={colors.textMain} />
                <Text style={styles.secondaryActionText}>Message</Text>
              </TouchableOpacity>
            </View>

            {/* Safety & Tools */}
            <View style={styles.toolsGrid}>
              <TouchableOpacity style={styles.toolItem}>
                <View style={[styles.toolIconWrapper, { backgroundColor: colors.dangerLight }]}>
                  <MaterialCommunityIcons name="shield-half-full" size={24} color={colors.danger} />
                </View>
                <Text style={styles.toolText}>Safety SOS</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.toolItem}>
                <View style={[styles.toolIconWrapper, { backgroundColor: colors.primaryLight }]}>
                  <MaterialCommunityIcons name="share-variant-outline" size={24} color={colors.primary} />
                </View>
                <Text style={styles.toolText}>Share Trip</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.toolItem}>
                <View style={[styles.toolIconWrapper, { backgroundColor: '#F1F5F9' }]}>
                  <MaterialCommunityIcons name="map-marker-path" size={24} color={colors.textMain} />
                </View>
                <Text style={styles.toolText}>Edit Route</Text>
              </TouchableOpacity>
            </View>

            {/* End Ride / Cancel Buttons */}
            <TouchableOpacity style={styles.cancelBtn} onPress={() => router.replace('/(travel)/(cabs)/cab-receipt')}>
              <Text style={styles.endRideBtnText}>End Ride (Demo)</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelBtn}>
              <Text style={styles.cancelBtnText}>Cancel Ride</Text>
            </TouchableOpacity>
            
          </ScrollView>
        </View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#E2E8F0', // Matches map background
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  mapPlaceholder: {
    ...StyleSheet.absoluteFillObject,
  },
  gridOverlay: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.3,
  },
  gridLineVertical: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: '#FFFFFF',
  },
  gridLineHorizontal: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: '#FFFFFF',
  },
  mockRoute: {
    position: 'absolute',
    top: '40%',
    left: '20%',
    width: '50%',
    height: 4,
    backgroundColor: colors.primary,
    transform: [{ rotate: '30deg' }],
    borderRadius: 2,
    opacity: 0.6,
  },
  userMarkerContainer: {
    position: 'absolute',
    top: '30%',
    left: '20%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userMarkerInner: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.primary,
    borderWidth: 3,
    borderColor: '#FFFFFF',
    zIndex: 2,
  },
  userMarkerPulse: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    opacity: 0.2,
    zIndex: 1,
  },
  driverMarkerContainer: {
    position: 'absolute',
    top: '55%',
    left: '60%',
    alignItems: 'center',
  },
  driverMarkerBubble: {
    backgroundColor: colors.textMain,
    padding: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  driverMarkerPointer: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: colors.textMain,
    marginTop: -1,
  },
  headerControls: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 10 : 20,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  etaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.textMain,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  dotIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.secondary,
    marginRight: 8,
  },
  etaBadgeText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  bottomSheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 10,
    height: height * 0.55, // Fixed height for bottom sheet portion
  },
  dragIndicator: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#CBD5E1',
    alignSelf: 'center',
    marginBottom: 16,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  otpCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.primaryLight,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E0E7FF',
  },
  otpLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  otpValue: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.textMain,
    letterSpacing: 4,
  },
  otpRight: {},
  copyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E7FF',
  },
  copyBtnText: {
    marginLeft: 6,
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
  },
  driverCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  driverAvatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  driverAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  driverRatingBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.textMain,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  driverRatingText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    marginLeft: 2,
  },
  driverInfo: {
    flex: 1,
  },
  driverName: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textMain,
    marginBottom: 4,
  },
  driverCar: {
    fontSize: 13,
    color: colors.textMuted,
    fontWeight: '500',
  },
  plateBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.border,
  },
  plateText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textMain,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  primaryActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
  },
  primaryActionText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
  },
  secondaryActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  secondaryActionText: {
    color: colors.textMain,
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
  },
  toolsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
    paddingHorizontal: 10,
  },
  toolItem: {
    alignItems: 'center',
  },
  toolIconWrapper: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  toolText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textMain,
  },
  cancelBtn: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  endRideBtnText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '700',
  },
  cancelBtnText: {
    color: colors.danger,
    fontSize: 13,
    fontWeight: '600',
  },
});
