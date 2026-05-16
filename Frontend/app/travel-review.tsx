import { useEffect, useMemo } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Redirect, router } from 'expo-router';

import { ScreenShell } from '@/src/components/screen-shell';
import { TopBar } from '@/src/components/top-bar';
import { TravelOfferCard } from '@/src/components/travel-offer-card';
import { useApp } from '@/src/context/app-context';
import { formatCurrency, formatTravelDate } from '@/src/lib/travel-data';
import { useSuperAppStore } from '@/src/store/super-app-store';
import { colors, radius, spacing, typography } from '@/src/theme/tokens';

const genders = ['Male', 'Female', 'Other'] as const;

export default function TravelReviewScreen() {
  const { session } = useApp();
  const {
    selectedTravelOffer,
    setTravelContactField,
    toggleTravelAddOn,
    travelAddOnIds,
    travelContact,
    travelResults,
    travelSearch,
    travelTravelers,
    updateTravelTraveler,
  } = useSuperAppStore();

  useEffect(() => {
    if (!travelContact.email && session?.user.email) {
      setTravelContactField('email', session.user.email);
    }
  }, [session?.user.email, setTravelContactField, travelContact.email]);

  const total = useMemo(() => {
    if (!selectedTravelOffer || !travelResults) {
      return 0;
    }

    const addOnTotal = travelResults.addOns
      .filter((item) => travelAddOnIds.includes(item.id))
      .reduce((sum, item) => sum + item.price, 0);

    return selectedTravelOffer.price + addOnTotal;
  }, [selectedTravelOffer, travelAddOnIds, travelResults]);

  const canContinue =
    !!selectedTravelOffer &&
    travelTravelers.every((traveler) => traveler.fullName.trim() && traveler.age.trim()) &&
    travelContact.phone.trim().length >= 10 &&
    travelContact.email.includes('@');

  if (!selectedTravelOffer || !travelResults) {
    return <Redirect href="/travel-results" />;
  }

  return (
    <ScreenShell>
      <TopBar
        eyebrow="Review"
        primaryAction={{ icon: 'arrow-left', onPress: () => router.back() }}
        title="Traveller details"
        subtitle={`${formatTravelDate(travelSearch.departureDate)} • ${travelSearch.originCode} to ${travelSearch.destinationCode}`}
      />

      <TravelOfferCard offer={selectedTravelOffer} />

      <View style={styles.formCard}>
        <Text style={styles.sectionTitle}>Travellers</Text>
        {travelTravelers.map((traveler, index) => (
          <View key={`${index + 1}-${traveler.gender}`} style={styles.travelerCard}>
            <Text style={styles.travelerTitle}>Traveller {index + 1}</Text>
            <TextInput
              onChangeText={(value) => updateTravelTraveler(index, 'fullName', value)}
              placeholder="Full name"
              placeholderTextColor={colors.textMuted}
              style={styles.input}
              value={traveler.fullName}
            />
            <View style={styles.inlineInputs}>
              <TextInput
                keyboardType="number-pad"
                onChangeText={(value) => updateTravelTraveler(index, 'age', value)}
                placeholder="Age"
                placeholderTextColor={colors.textMuted}
                style={[styles.input, styles.inlineInput]}
                value={traveler.age}
              />
              <View style={styles.genderRow}>
                {genders.map((gender) => {
                  const active = traveler.gender === gender;
                  return (
                    <Pressable
                      key={gender}
                      onPress={() => updateTravelTraveler(index, 'gender', gender)}
                      style={[styles.genderChip, active ? styles.genderChipActive : null]}>
                      <Text
                        style={[styles.genderText, active ? styles.genderTextActive : null]}>
                        {gender}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.formCard}>
        <Text style={styles.sectionTitle}>Contact details</Text>
        <TextInput
          keyboardType="phone-pad"
          onChangeText={(value) => setTravelContactField('phone', value)}
          placeholder="Mobile number"
          placeholderTextColor={colors.textMuted}
          style={styles.input}
          value={travelContact.phone}
        />
        <TextInput
          autoCapitalize="none"
          keyboardType="email-address"
          onChangeText={(value) => setTravelContactField('email', value)}
          placeholder="Email address"
          placeholderTextColor={colors.textMuted}
          style={styles.input}
          value={travelContact.email}
        />
      </View>

      <View style={styles.formCard}>
        <Text style={styles.sectionTitle}>Recommended add-ons</Text>
        {travelResults.addOns.map((addOn) => {
          const active = travelAddOnIds.includes(addOn.id);
          return (
            <Pressable
              key={addOn.id}
              onPress={() => toggleTravelAddOn(addOn.id)}
              style={[styles.addOnRow, active ? styles.addOnRowActive : null]}>
              <View style={styles.addOnCopy}>
                <Text style={styles.addOnTitle}>{addOn.title}</Text>
                <Text style={styles.addOnSubtitle}>{addOn.subtitle}</Text>
              </View>
              <View style={styles.addOnPriceWrap}>
                <Text style={styles.addOnPrice}>{formatCurrency(addOn.price)}</Text>
                <Text style={styles.addOnState}>{active ? 'Added' : 'Tap to add'}</Text>
              </View>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.checkoutBar}>
        <View>
          <Text style={styles.checkoutLabel}>Review total</Text>
          <Text style={styles.checkoutValue}>{formatCurrency(total)}</Text>
        </View>
        <Pressable
          disabled={!canContinue}
          onPress={() => router.push('/travel-payment')}
          style={[styles.checkoutButton, !canContinue ? styles.checkoutButtonDisabled : null]}>
          <Text style={styles.checkoutButtonText}>Continue</Text>
        </Pressable>
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  formCard: {
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    padding: spacing.lg,
    gap: spacing.md,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: typography.section,
    fontWeight: '900',
  },
  travelerCard: {
    borderRadius: radius.md,
    backgroundColor: colors.canvasMuted,
    padding: spacing.md,
    gap: spacing.sm,
  },
  travelerTitle: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: '800',
  },
  input: {
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    color: colors.text,
    fontSize: typography.body,
  },
  inlineInputs: {
    gap: spacing.sm,
  },
  inlineInput: {
    flex: 1,
  },
  genderRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  genderChip: {
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  genderChipActive: {
    borderColor: '#BFDBFE',
    backgroundColor: colors.surfaceSoft,
  },
  genderText: {
    color: colors.text,
    fontSize: typography.caption,
    fontWeight: '800',
  },
  genderTextActive: {
    color: colors.sky,
  },
  addOnRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.line,
    padding: spacing.md,
  },
  addOnRowActive: {
    borderColor: '#BFDBFE',
    backgroundColor: colors.surfaceSoft,
  },
  addOnCopy: {
    flex: 1,
    gap: 4,
  },
  addOnTitle: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: '800',
  },
  addOnSubtitle: {
    color: colors.textMuted,
    fontSize: typography.caption,
    lineHeight: 18,
  },
  addOnPriceWrap: {
    alignItems: 'flex-end',
    gap: 4,
  },
  addOnPrice: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: '800',
  },
  addOnState: {
    color: colors.sky,
    fontSize: typography.caption,
    fontWeight: '700',
  },
  checkoutBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: colors.text,
    padding: spacing.lg,
  },
  checkoutLabel: {
    color: 'rgba(255,255,255,0.72)',
    fontSize: typography.caption,
    fontWeight: '700',
  },
  checkoutValue: {
    color: '#FFFFFF',
    fontSize: typography.section,
    fontWeight: '900',
    marginTop: 4,
  },
  checkoutButton: {
    borderRadius: radius.pill,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  checkoutButtonDisabled: {
    opacity: 0.45,
  },
  checkoutButtonText: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: '800',
  },
});
