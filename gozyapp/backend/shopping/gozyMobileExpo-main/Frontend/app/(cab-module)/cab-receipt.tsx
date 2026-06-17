import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated, Pressable } from 'react-native';
import { router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import CinematicSplash from './_cinematic-splash';

const colors = {
  primary: '#4F46E5', // Indigo
  primaryLight: '#EEF2FF',
  success: '#10B981',
  successLight: '#D1FAE5',
  background: '#F8FAFC',
  surface: '#FFFFFF',
  textMain: '#0F172A',
  textMuted: '#64748B',
  border: '#E2E8F0',
  starActive: '#F59E0B', // Amber
  starInactive: '#CBD5E1',
};

const TIP_AMOUNTS = [10, 20, 50, 'Custom'];
const FEEDBACK_TAGS = ['Clean Car', 'Polite Driver', 'Great Music', 'Smooth Ride', 'On Time', 'AC Was Good'];

export default function CabReceiptScreen() {
  const [rating, setRating] = useState(0);
  const [selectedTip, setSelectedTip] = useState<number | string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  
  const scaleAnim = new Animated.Value(1);

  const handleStarPress = (rate: number) => {
    setRating(rate);
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 1.2, duration: 100, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 100, useNativeDriver: true })
    ]).start();
  };

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSubmit = () => {
    // Navigate back to home or out of the booking flow
    router.replace('/(cab-module)/cab');
  };

  return (
    <View style={{ flex: 1 }}>
      <CinematicSplash />
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      
      {/* Header Close Button */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeBtn} onPress={handleSubmit}>
          <MaterialCommunityIcons name="close" size={24} color={colors.textMain} />
        </TouchableOpacity>
      </View>

      {/* Success Hero Section */}
      <View style={styles.heroSection}>
        <View style={styles.successIconWrapper}>
          <LinearGradient
            colors={['#10B981', '#059669']}
            style={styles.successIcon}
          >
            <MaterialCommunityIcons name="check" size={32} color="#FFFFFF" />
          </LinearGradient>
        </View>
        <Text style={styles.heroTitle}>{"You've arrived!"}</Text>
        <Text style={styles.heroSub}>Hope you enjoyed your ride with Ramesh.</Text>
      </View>

      {/* Rating Card */}
      <View style={styles.ratingCard}>
        <Text style={styles.cardTitle}>How was your trip?</Text>
        <View style={styles.starsRow}>
          {[1, 2, 3, 4, 5].map((star) => (
            <Pressable key={star} onPress={() => handleStarPress(star)}>
              <Animated.View style={{ transform: [{ scale: rating === star ? scaleAnim : 1 }] }}>
                <MaterialCommunityIcons 
                  name={star <= rating ? "star" : "star-outline"} 
                  size={42} 
                  color={star <= rating ? colors.starActive : colors.starInactive} 
                  style={styles.starIcon}
                />
              </Animated.View>
            </Pressable>
          ))}
        </View>

        {rating > 0 && (
          <View style={styles.feedbackSection}>
            <Text style={styles.feedbackTitle}>What went well?</Text>
            <View style={styles.tagsContainer}>
              {FEEDBACK_TAGS.map((tag) => {
                const isActive = selectedTags.includes(tag);
                return (
                  <TouchableOpacity 
                    key={tag} 
                    style={[styles.tagChip, isActive && styles.tagChipActive]}
                    onPress={() => toggleTag(tag)}
                  >
                    <Text style={[styles.tagText, isActive && styles.tagTextActive]}>{tag}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}
      </View>

      {/* Tipping Card */}
      <View style={styles.tipCard}>
        <View style={styles.tipHeader}>
          <Text style={styles.cardTitle}>Tip your driver</Text>
          <Text style={styles.tipSub}>100% of tips go to Ramesh</Text>
        </View>
        <View style={styles.tipRow}>
          {TIP_AMOUNTS.map((amt) => {
            const isActive = selectedTip === amt;
            return (
              <TouchableOpacity 
                key={amt} 
                style={[styles.tipChip, isActive && styles.tipChipActive]}
                onPress={() => setSelectedTip(isActive ? null : amt)}
              >
                <Text style={[styles.tipText, isActive && styles.tipTextActive]}>
                  {typeof amt === 'number' ? `₹${amt}` : amt}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Stripe-style Receipt */}
      <View style={styles.receiptCard}>
        <View style={styles.receiptHeader}>
          <Text style={styles.receiptTitle}>Trip Receipt</Text>
          <Text style={styles.receiptDate}>23 Apr 2026, 11:15 AM</Text>
        </View>
        
        <View style={styles.receiptDivider} />
        
        <View style={styles.receiptRow}>
          <Text style={styles.receiptLabel}>Trip Fare</Text>
          <Text style={styles.receiptValue}>₹735</Text>
        </View>
        <View style={styles.receiptRow}>
          <Text style={styles.receiptLabel}>Taxes & Fees</Text>
          <Text style={styles.receiptValue}>₹428</Text>
        </View>
        <View style={styles.receiptRow}>
          <Text style={styles.receiptLabel}>Promo Applied</Text>
          <Text style={styles.receiptDiscount}>-₹50</Text>
        </View>
        
        {selectedTip && typeof selectedTip === 'number' && (
          <View style={styles.receiptRow}>
            <Text style={styles.receiptLabel}>Driver Tip</Text>
            <Text style={styles.receiptValue}>₹{selectedTip}</Text>
          </View>
        )}

        <View style={styles.receiptDivider} />
        
        <View style={styles.receiptTotalRow}>
          <Text style={styles.receiptTotalLabel}>Total Paid</Text>
          <Text style={styles.receiptTotalValue}>
            ₹{1113 + (typeof selectedTip === 'number' ? selectedTip : 0)}
          </Text>
        </View>

        <TouchableOpacity style={styles.downloadInvoiceBtn}>
          <MaterialCommunityIcons name="file-download-outline" size={18} color={colors.primary} />
          <Text style={styles.downloadInvoiceText}>Download PDF Invoice</Text>
        </TouchableOpacity>
      </View>

      {/* Submit Action */}
      <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
        <LinearGradient
          colors={['#4F46E5', '#6366F1']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={StyleSheet.absoluteFillObject}
        />
        <Text style={styles.submitBtnText}>Done</Text>
      </TouchableOpacity>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingTop: 50,
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  closeBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  successIconWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.successLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  successIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.success,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: colors.textMain,
    marginBottom: 8,
  },
  heroSub: {
    fontSize: 15,
    color: colors.textMuted,
    fontWeight: '500',
  },
  ratingCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textMain,
    marginBottom: 16,
    textAlign: 'center',
  },
  starsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  starIcon: {
    padding: 4,
  },
  feedbackSection: {
    marginTop: 24,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  feedbackTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textMain,
    marginBottom: 12,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  tagChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tagChipActive: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  tagText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textMuted,
  },
  tagTextActive: {
    color: colors.primary,
  },
  tipCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 3,
  },
  tipHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  tipSub: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 4,
  },
  tipRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  tipChip: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  tipChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  tipText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textMain,
  },
  tipTextActive: {
    color: '#FFFFFF',
  },
  receiptCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 24,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: colors.border,
  },
  receiptHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  receiptTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textMain,
  },
  receiptDate: {
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: '600',
  },
  receiptDivider: {
    height: 1,
    backgroundColor: colors.border,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: colors.border,
    marginVertical: 16,
  },
  receiptRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  receiptLabel: {
    fontSize: 14,
    color: colors.textMuted,
    fontWeight: '500',
  },
  receiptValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textMain,
  },
  receiptDiscount: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.success,
  },
  receiptTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  receiptTotalLabel: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textMain,
  },
  receiptTotalValue: {
    fontSize: 24,
    fontWeight: '900',
    color: colors.textMain,
  },
  downloadInvoiceBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    backgroundColor: colors.primaryLight,
    borderRadius: 12,
    gap: 8,
  },
  downloadInvoiceText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '700',
  },
  submitBtn: {
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 4,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
