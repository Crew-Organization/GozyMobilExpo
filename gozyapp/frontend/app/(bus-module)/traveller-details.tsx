import React, { useState } from 'react';
import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Alert,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { colors, radius, spacing, typography, shadow } from '@/src/theme/tokens';
import { usePassengerStore, Gender } from '@/src/store/bus-passenger-store';

const PRIMARY = '#0A67FF';
const GRADIENT: [string, string] = ['#15BDF2', '#006BFF'];
const GENDERS: Gender[] = ['Male', 'Female', 'Other'];

export default function TravellerDetailsScreen() {
  const params = useLocalSearchParams<{
    busId: string;
    operator: string;
    busType: string;
    seats: string;
    totalFare: string;
    fromCity: string;
    toCity: string;
    date: string;
    departureTime: string;
    arrivalTime: string;
    duration: string;
    boardingName: string;
    boardingTime: string;
    droppingName: string;
    droppingTime: string;
  }>();

  const {
    passengers,
    emergencyContact,
    gstDetails,
    errors,
    addPassenger,
    removePassenger,
    updatePassenger,
    setEmergencyContact,
    setGstDetails,
    validatePassengers,
  } = usePassengerStore();

  const [showGst, setShowGst] = useState(false);
  const seats = params.seats?.split(',') ?? [];

  const handleContinue = () => {
    if (!validatePassengers()) {
      Alert.alert('Incomplete Details', 'Please fill in all passenger details correctly.');
      return;
    }
    router.push({
      pathname: '/(bus-module)/review-booking',
      params: { ...params },
    } as any);
  };

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12} style={styles.backBtn}>
          <MaterialCommunityIcons name="arrow-left" size={22} color={colors.text} />
        </Pressable>
        <View style={styles.headerMid}>
          <Text style={styles.headerTitle}>Traveller Details</Text>
          <Text style={styles.headerSub}>{params.fromCity} → {params.toCity}</Text>
        </View>
      </View>

      {/* Journey Info strip */}
      <View style={styles.journeyStrip}>
        <MaterialCommunityIcons name="bus" size={14} color={PRIMARY} />
        <Text style={styles.journeyText}>
          {params.operator} • {params.departureTime} • Seats: {seats.join(', ')}
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Passengers */}
        <Text style={styles.sectionTitle}>Passenger Information</Text>
        <Text style={styles.sectionHint}>Enter details exactly as on government ID</Text>

        {passengers.map((p, idx) => (
          <View key={p.id} style={styles.passengerCard}>
            <View style={styles.passengerCardHeader}>
              <View style={styles.passengerNum}>
                <Text style={styles.passengerNumText}>{idx + 1}</Text>
              </View>
              <Text style={styles.passengerLabel}>Passenger {idx + 1}</Text>
              {seats[idx] && (
                <View style={styles.seatTag}>
                  <MaterialCommunityIcons name="seat-outline" size={12} color={PRIMARY} />
                  <Text style={styles.seatTagText}>Seat {seats[idx]}</Text>
                </View>
              )}
              {idx > 0 && (
                <Pressable onPress={() => removePassenger(p.id)} style={styles.removeBtn}>
                  <MaterialCommunityIcons name="close-circle" size={20} color={colors.danger} />
                </Pressable>
              )}
            </View>

            {/* Name */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Full Name *</Text>
              <TextInput
                style={[styles.input, errors[`${p.id}-name`] && styles.inputError]}
                placeholder="e.g. Ramesh Kumar"
                placeholderTextColor={colors.textLight}
                value={p.name}
                onChangeText={(v) => updatePassenger(p.id, 'name', v)}
                autoCapitalize="words"
              />
              {errors[`${p.id}-name`] && (
                <Text style={styles.errorText}>{errors[`${p.id}-name`]}</Text>
              )}
            </View>

            {/* Age + Gender */}
            <View style={styles.rowFields}>
              <View style={[styles.fieldGroup, { flex: 1 }]}>
                <Text style={styles.fieldLabel}>Age *</Text>
                <TextInput
                  style={[styles.input, errors[`${p.id}-age`] && styles.inputError]}
                  placeholder="e.g. 28"
                  placeholderTextColor={colors.textLight}
                  keyboardType="number-pad"
                  value={p.age}
                  onChangeText={(v) => updatePassenger(p.id, 'age', v)}
                  maxLength={3}
                />
                {errors[`${p.id}-age`] && (
                  <Text style={styles.errorText}>{errors[`${p.id}-age`]}</Text>
                )}
              </View>

              <View style={[styles.fieldGroup, { flex: 1.5 }]}>
                <Text style={styles.fieldLabel}>Gender *</Text>
                <View style={styles.genderRow}>
                  {GENDERS.map((g) => (
                    <Pressable
                      key={g}
                      onPress={() => updatePassenger(p.id, 'gender', g)}
                      style={[styles.genderChip, p.gender === g && styles.genderChipActive]}
                    >
                      <Text style={[styles.genderChipText, p.gender === g && styles.genderChipTextActive]}>
                        {g}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            </View>
          </View>
        ))}

        {/* Add passenger */}
        {passengers.length < seats.length && (
          <Pressable onPress={addPassenger} style={styles.addPassengerBtn}>
            <MaterialCommunityIcons name="plus-circle-outline" size={20} color={PRIMARY} />
            <Text style={styles.addPassengerText}>Add Passenger</Text>
          </Pressable>
        )}

        {/* Emergency Contact */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionCardTitle}>Emergency Contact</Text>
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Contact person name"
              placeholderTextColor={colors.textLight}
              value={emergencyContact.name}
              onChangeText={(v) => setEmergencyContact('name', v)}
              autoCapitalize="words"
            />
          </View>
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Phone Number</Text>
            <TextInput
              style={styles.input}
              placeholder="10-digit mobile number"
              placeholderTextColor={colors.textLight}
              keyboardType="phone-pad"
              value={emergencyContact.phone}
              onChangeText={(v) => setEmergencyContact('phone', v)}
              maxLength={10}
            />
          </View>
        </View>

        {/* GST Details (collapsible) */}
        <Pressable
          onPress={() => setShowGst(!showGst)}
          style={styles.gstToggle}
        >
          <MaterialCommunityIcons
            name={showGst ? 'chevron-up' : 'chevron-down'}
            size={20}
            color={PRIMARY}
          />
          <Text style={styles.gstToggleText}>GST Invoice (Optional)</Text>
        </Pressable>

        {showGst && (
          <View style={styles.sectionCard}>
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Company Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Your company name"
                placeholderTextColor={colors.textLight}
                value={gstDetails.companyName}
                onChangeText={(v) => setGstDetails('companyName', v)}
              />
            </View>
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>GSTIN</Text>
              <TextInput
                style={styles.input}
                placeholder="15-character GST number"
                placeholderTextColor={colors.textLight}
                value={gstDetails.gstin}
                onChangeText={(v) => setGstDetails('gstin', v.toUpperCase())}
                autoCapitalize="characters"
                maxLength={15}
              />
            </View>
          </View>
        )}

        {/* Policy note */}
        <View style={styles.policyNote}>
          <MaterialCommunityIcons name="information-outline" size={16} color={PRIMARY} />
          <Text style={styles.policyText}>
            Passengers must carry valid government ID (Aadhaar/PAN/Passport). Reporting time is 15 minutes before departure.
          </Text>
        </View>

        <View style={styles.scrollPad} />
      </ScrollView>

      {/* Bottom CTA */}
      <View style={styles.bottomBar}>
        <View style={styles.fareSummary}>
          <Text style={styles.fareLabel}>Total Fare</Text>
          <Text style={styles.fareAmount}>₹{parseInt(params.totalFare ?? '0').toLocaleString('en-IN')}</Text>
        </View>
        <Pressable onPress={handleContinue}>
          <LinearGradient colors={GRADIENT} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.continueBtn}>
            <Text style={styles.continueBtnText}>CONTINUE</Text>
            <MaterialCommunityIcons name="arrow-right" size={18} color="#FFF" />
          </LinearGradient>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.canvas },
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
    gap: spacing.sm,
  },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerMid: { flex: 1 },
  headerTitle: { fontSize: typography.bodySmall, fontWeight: '800', color: colors.text },
  headerSub: { fontSize: typography.tiny, color: colors.textMuted },

  journeyStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    backgroundColor: '#EFF6FF',
    borderBottomWidth: 1,
    borderBottomColor: '#BFDBFE',
  },
  journeyText: { fontSize: 12, fontWeight: '600', color: PRIMARY },

  scrollContent: { padding: spacing.md, gap: spacing.sm },

  sectionTitle: { fontSize: typography.body, fontWeight: '800', color: colors.text },
  sectionHint: { fontSize: typography.tiny, color: colors.textMuted, marginTop: 2 },

  passengerCard: {
    backgroundColor: colors.background,
    borderRadius: radius.md,
    padding: spacing.md,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.line,
    ...shadow.sm,
  },
  passengerCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  passengerNum: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: PRIMARY,
    alignItems: 'center',
    justifyContent: 'center',
  },
  passengerNumText: { color: '#FFF', fontSize: 12, fontWeight: '800' },
  passengerLabel: { flex: 1, fontSize: typography.bodySmall, fontWeight: '800', color: colors.text },
  seatTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.pill,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  seatTagText: { fontSize: 10.5, fontWeight: '700', color: PRIMARY },
  removeBtn: { padding: 4 },

  fieldGroup: { gap: 4 },
  fieldLabel: { fontSize: typography.tiny, fontWeight: '700', color: colors.textMuted, letterSpacing: 0.3 },
  input: {
    height: 48,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.line,
    paddingHorizontal: spacing.md,
    fontSize: typography.bodySmall,
    fontWeight: '600',
    color: colors.text,
    backgroundColor: colors.background,
  },
  inputError: { borderColor: colors.danger },
  errorText: { fontSize: 10.5, color: colors.danger, fontWeight: '600' },

  rowFields: { flexDirection: 'row', gap: spacing.sm },

  genderRow: { flexDirection: 'row', gap: spacing.xs, flexWrap: 'wrap' },
  genderChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    borderColor: colors.line,
    backgroundColor: colors.background,
  },
  genderChipActive: { backgroundColor: '#EFF6FF', borderColor: PRIMARY },
  genderChipText: { fontSize: 12, fontWeight: '700', color: colors.textMuted },
  genderChipTextActive: { color: PRIMARY },

  addPassengerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: PRIMARY,
    borderStyle: 'dashed',
    backgroundColor: '#EFF6FF',
  },
  addPassengerText: { fontSize: typography.bodySmall, fontWeight: '700', color: PRIMARY },

  sectionCard: {
    backgroundColor: colors.background,
    borderRadius: radius.md,
    padding: spacing.md,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.line,
    ...shadow.sm,
  },
  sectionCardTitle: { fontSize: typography.bodySmall, fontWeight: '800', color: colors.text, marginBottom: 4 },

  gstToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.background,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.line,
  },
  gstToggleText: { fontSize: typography.bodySmall, fontWeight: '700', color: PRIMARY },

  policyNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    padding: spacing.md,
    backgroundColor: '#EFF6FF',
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  policyText: { flex: 1, fontSize: typography.tiny, color: colors.textMuted, lineHeight: 18 },

  scrollPad: { height: 24 },

  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.line,
    gap: spacing.sm,
    ...shadow.lg,
  },
  fareSummary: { flex: 1, gap: 2 },
  fareLabel: { fontSize: typography.tiny, color: colors.textMuted, fontWeight: '600' },
  fareAmount: { fontSize: typography.body, fontWeight: '900', color: colors.text },
  continueBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
  },
  continueBtnText: { fontSize: typography.small, fontWeight: '900', color: '#FFFFFF', letterSpacing: 0.5 },
});
