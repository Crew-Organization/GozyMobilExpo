import { useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Redirect, router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { ScreenShell } from '@/src/components/screen-shell';
import {
  cabTestimonials,
  formatCabCurrency,
  formatCabDateTime,
} from '@/src/lib/cab-data';
import { useSuperAppStore } from '@/src/store/super-app-store';
import { colors, radius, spacing, typography } from '@/src/theme/tokens';

const genders = ['Male', 'Female', 'Other'] as const;

export default function CabReviewScreen() {
  const { cabSearch, cabResults, selectedCabOffer, cabTraveler, setCabTravelerField } =
    useSuperAppStore();
  const [selectedCoupon, setSelectedCoupon] = useState(true);
  const [partPay, setPartPay] = useState(true);
  const [roofCarrier, setRoofCarrier] = useState(false);
  const [driverLanguage, setDriverLanguage] = useState(false);

  if (!cabResults || !selectedCabOffer) {
    return <Redirect href="/cab-results" />;
  }

  const schedule = formatCabDateTime(cabSearch.pickupDateTime);
  const total = selectedCabOffer.price + selectedCabOffer.taxesAndCharges - (selectedCoupon ? cabResults.coupon.savings : 0);
  const addOnTotal = (roofCarrier ? 209 : 0) + (driverLanguage ? 209 : 0);
  const grandTotal = total + addOnTotal;
  const advance = Math.round(grandTotal * 0.2);
  const payNowAmount = partPay ? advance : grandTotal;

  return (
    <ScreenShell contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <MaterialCommunityIcons color="#6B7280" name="arrow-left" size={28} />
        </Pressable>
        <Text style={styles.headerTitle}>Review Your Ride</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollBody} showsVerticalScrollIndicator={false}>
        <View style={styles.routeHero}>
          <View style={styles.routeRow}>
            <Text numberOfLines={1} style={styles.locationText}>
              {cabSearch.pickupLabel}
            </Text>
            <MaterialCommunityIcons color="#A6B3C1" name="swap-horizontal" size={20} />
            <Text numberOfLines={1} style={styles.locationText}>
              {cabSearch.dropLabel}
            </Text>
            <MaterialCommunityIcons color="#1096EB" name="chevron-down" size={24} />
          </View>
          <View style={styles.routeMetaRow}>
            <MaterialCommunityIcons color="#6B7280" name="calendar-month-outline" size={20} />
            <Text style={styles.routeMetaText}>
              {schedule.compact}, {schedule.time}
            </Text>
            <Pressable onPress={() => router.back()} style={styles.editButton}>
              <MaterialCommunityIcons color="#1096EB" name="pencil" size={18} />
              <Text style={styles.editButtonText}>Edit</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.vehicleCard}>
          <View style={styles.vehicleTop}>
            <View style={styles.vehicleThumb}>
              <MaterialCommunityIcons color="#5C80B1" name="car-estate" size={56} />
              <View style={styles.energyStrip}>
                <Text style={styles.energyStripText}>{selectedCabOffer.energyType}</Text>
              </View>
            </View>

            <View style={styles.vehicleCopy}>
              <Text style={styles.vehicleTitle}>{selectedCabOffer.vehicleName}</Text>
              <Text style={styles.vehicleSimilar}>{selectedCabOffer.similarLabel}</Text>
              <View style={styles.vehicleDivider} />
              <Text style={styles.vehicleMeta}>
                {selectedCabOffer.seats} Seats  |  {selectedCabOffer.ac ? 'AC' : 'Non AC'}
              </Text>
            </View>
          </View>

          <View style={styles.statsGrid}>
            <StatCell icon="map-marker-path" text="1 pickup-drop and a rest stop" />
            <StatCell icon="timer-check-outline" text="Free cancellation until Apr 23, 09:00 AM" />
            <StatCell icon="bag-suitcase-outline" text={`Space for ${selectedCabOffer.bags} bags`} />
          </View>

          <View style={styles.alertStrip}>
            <MaterialCommunityIcons color="#9D6B00" name="clock-check-outline" size={18} />
            <Text style={styles.alertStripText}>{selectedCabOffer.cancellationLabel}</Text>
          </View>
        </View>

        <Section title="Inclusions">
          <View style={styles.card}>
            {selectedCabOffer.inclusions.map((item) => (
              <View key={item} style={styles.inclusionRow}>
                <MaterialCommunityIcons color="#0F9A8A" name="check-decagram" size={22} />
                <Text style={styles.inclusionText}>{item}</Text>
              </View>
            ))}
            <View style={styles.tripAssistant}>
              <View style={styles.tripAssistantBubble}>
                <MaterialCommunityIcons color="#FFFFFF" name="microphone" size={24} />
              </View>
              <Text style={styles.tripAssistantText}>Trip assistant</Text>
            </View>
          </View>
        </Section>

        <Section title="Coupon and Offers">
          <View style={styles.card}>
            <Pressable onPress={() => setSelectedCoupon((current) => !current)} style={styles.couponRow}>
              <View style={[styles.radioMark, selectedCoupon ? styles.radioMarkActive : null]}>
                {selectedCoupon ? <View style={styles.radioMarkFill} /> : null}
              </View>
              <View style={styles.couponCopy}>
                <View style={styles.couponCode}>
                  <MaterialCommunityIcons color="#19B8A5" name="ticket-percent" size={18} />
                  <Text style={styles.couponCodeText}>{cabResults.coupon.code}</Text>
                </View>
                <Text style={styles.couponBody}>{cabResults.coupon.description}</Text>
              </View>
            </Pressable>

            <View style={styles.loginBanner}>
              <View style={styles.loginCircle}>
                <MaterialCommunityIcons color="#1F2937" name="key-variant" size={18} />
              </View>
              <Text style={styles.loginBannerText}>Login Now for more Benefits</Text>
              <MaterialCommunityIcons color="#1F2937" name="arrow-right" size={24} />
            </View>

            <View style={styles.inputRow}>
              <TextInput
                placeholder="ENTER A COUPON"
                placeholderTextColor="#A1A1AA"
                style={styles.inputFlex}
              />
              <Text style={styles.applyText}>Apply</Text>
            </View>
          </View>
        </Section>

        <View style={styles.supportBanner}>
          <Text style={styles.supportTitle}>24*7 Customer Support</Text>
          <Text style={styles.supportBody}>Get instant support from customer care</Text>
          <MaterialCommunityIcons color="#7C3AED" name="headset" size={34} />
        </View>

        <Section title="Cancellation Policy">
          <View style={styles.card}>
            <Text style={styles.policyHeadline}>Free cancellation till 1 hr of departure</Text>
            <View style={styles.policyTimeline}>
              <View style={styles.refundLane}>
                <Text style={styles.refundLaneText}>Fully Refundable</Text>
              </View>
              <View style={styles.nonRefundLane}>
                <Text style={styles.nonRefundLaneText}>Non Refundable</Text>
              </View>
            </View>
            <View style={styles.policyLabels}>
              <Text style={styles.policyLabel}>Post Booking</Text>
              <Text style={styles.policyLabel}>Apr 23, 9:00 AM</Text>
              <Text style={styles.policyLabel}>Ride Started</Text>
            </View>
            <Pressable style={styles.linkRow}>
              <Text style={styles.linkText}>Read Cancellation Policy</Text>
              <MaterialCommunityIcons color="#1096EB" name="chevron-right" size={24} />
            </Pressable>
          </View>
        </Section>

        <Section title="Special Requests">
          <View style={styles.card}>
            <AddonRow
              active={roofCarrier}
              description="Car with roof carrier for adjusting extra luggage"
              label="Roof Carrier"
              onPress={() => setRoofCarrier((current) => !current)}
              price="Rs209"
            />
            <View style={styles.cardDivider} />
            <AddonRow
              active={driverLanguage}
              description="Choose your preferred language for a smoother ride"
              helper="Most likely the assigned driver speaks local language if not selected"
              label="Drivers Language"
              onPress={() => setDriverLanguage((current) => !current)}
              price="Rs209"
            />
          </View>
        </Section>

        <Section title="Traveller Details">
          <View style={styles.card}>
            <View style={styles.pickupBox}>
              <Text style={styles.pickupLabel}>Pickup Location</Text>
              <Text numberOfLines={1} style={styles.pickupText}>
                {cabSearch.pickupLabel}
              </Text>
            </View>

            <View style={styles.travellerHeader}>
              <Text style={styles.travellerHeaderText}>Traveller</Text>
              <Text style={styles.saveText}>Save</Text>
            </View>

            <View style={styles.dualInputRow}>
              <TextInput
                onChangeText={(value) => setCabTravelerField('fullName', value)}
                placeholder="FULL NAME"
                placeholderTextColor="#A1A1AA"
                style={[styles.inputBox, styles.halfInput]}
                value={cabTraveler.fullName}
              />
              <TextInput
                keyboardType="phone-pad"
                onChangeText={(value) => setCabTravelerField('mobile', value)}
                placeholder="MOBILE NO. +91"
                placeholderTextColor="#A1A1AA"
                style={[styles.inputBox, styles.halfInput]}
                value={cabTraveler.mobile}
              />
            </View>

            <TextInput
              autoCapitalize="none"
              keyboardType="email-address"
              onChangeText={(value) => setCabTravelerField('email', value)}
              placeholder="EMAIL ID"
              placeholderTextColor="#A1A1AA"
              style={styles.inputBox}
              value={cabTraveler.email}
            />

            <Text style={styles.genderLabel}>GENDER</Text>
            <View style={styles.genderRow}>
              {genders.map((gender) => {
                const active = cabTraveler.gender === gender;
                return (
                  <Pressable
                    key={gender}
                    onPress={() => setCabTravelerField('gender', gender)}
                    style={styles.genderOption}>
                    <View style={[styles.genderRadio, active ? styles.genderRadioActive : null]}>
                      {active ? <View style={styles.genderRadioFill} /> : null}
                    </View>
                    <Text style={styles.genderText}>{gender}</Text>
                  </Pressable>
                );
              })}
            </View>

            <Text style={styles.orText}>Or</Text>
            <Pressable style={styles.loginRow}>
              <MaterialCommunityIcons color="#1096EB" name="account-circle-outline" size={22} />
              <Text style={styles.loginRowText}>LOG INTO EXISTING ACCOUNT</Text>
            </Pressable>

            <View style={styles.cardDivider} />

            <Pressable
              onPress={() => setCabTravelerField('usePickupAsBilling', !cabTraveler.usePickupAsBilling)}
              style={styles.checkboxRow}>
              <View style={[styles.checkbox, cabTraveler.usePickupAsBilling ? styles.checkboxActive : null]}>
                {cabTraveler.usePickupAsBilling ? (
                  <MaterialCommunityIcons color="#FFFFFF" name="check" size={18} />
                ) : null}
              </View>
              <Text style={styles.checkboxText}>Use pickup location as billing address</Text>
            </Pressable>
          </View>
        </Section>

        <Section title="What people are saying about us?">
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.testimonialRow}>
              {cabTestimonials.map((item) => (
                <View key={item.id} style={styles.testimonialCard}>
                  <View style={styles.testimonialHeader}>
                    <View>
                      <Text style={styles.testimonialName}>{item.name}</Text>
                      <Text style={styles.testimonialDate}>{item.date}</Text>
                    </View>
                    <View style={styles.ratingBox}>
                      <Text style={styles.ratingBoxText}>{item.rating}</Text>
                    </View>
                  </View>
                  <Text style={styles.testimonialBody}>{item.body}</Text>
                </View>
              ))}
            </View>
          </ScrollView>
          <Text style={styles.termsText}>
            By proceeding to book, I agree to MakeMyTrip's Privacy Policy, User Agreement, Terms of Service and Cancellation Rules
          </Text>
        </Section>
      </ScrollView>

      <View style={styles.advanceStrip}>
        <Text style={styles.advanceText}>
          Pay {formatCabCurrency(advance)} in advance to reserve and rest to driver.
        </Text>
      </View>

      <View style={styles.bottomBar}>
        <Pressable onPress={() => setPartPay(true)} style={styles.payChoice}>
          <View style={[styles.bottomRadio, partPay ? styles.bottomRadioActive : null]}>
            {partPay ? <View style={styles.bottomRadioFill} /> : null}
          </View>
          <View>
            <Text style={styles.choiceLabel}>Part Pay</Text>
            <Text style={styles.choiceValue}>{formatCabCurrency(advance)}</Text>
          </View>
        </Pressable>

        <Pressable onPress={() => setPartPay(false)} style={styles.payChoice}>
          <View style={[styles.bottomRadio, !partPay ? styles.bottomRadioActive : null]}>
            {!partPay ? <View style={styles.bottomRadioFill} /> : null}
          </View>
          <View>
            <Text style={styles.choiceLabel}>Full Pay</Text>
            <Text style={styles.choiceValue}>{formatCabCurrency(grandTotal)}</Text>
          </View>
        </Pressable>

        <MaterialCommunityIcons color="#D1D5DB" name="information-outline" size={28} />

        <Pressable onPress={() => router.push('/cab-payment' as never)} style={styles.payNowButton}>
          <Text style={styles.payNowText}>PAY NOW</Text>
        </Pressable>
      </View>
    </ScreenShell>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function StatCell({
  icon,
  text,
}: {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  text: string;
}) {
  return (
    <View style={styles.statCell}>
      <MaterialCommunityIcons color="#7C7F86" name={icon} size={26} />
      <Text style={styles.statCellText}>{text}</Text>
    </View>
  );
}

function AddonRow({
  active,
  label,
  description,
  helper,
  price,
  onPress,
}: {
  active: boolean;
  label: string;
  description: string;
  helper?: string;
  price: string;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={styles.addonRow}>
      <View style={[styles.squareCheck, active ? styles.squareCheckActive : null]}>
        {active ? <MaterialCommunityIcons color="#FFFFFF" name="check" size={18} /> : null}
      </View>
      <View style={styles.addonCopy}>
        <View style={styles.addonTop}>
          <Text style={styles.addonLabel}>{label}</Text>
          <Text style={styles.addonPrice}>{price}</Text>
        </View>
        <Text style={styles.addonDescription}>{description}</Text>
        {helper ? <Text style={styles.addonHelper}>{helper}</Text> : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: 0,
    paddingBottom: 0,
    gap: 0,
    backgroundColor: '#F5F6F8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  backButton: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '900',
  },
  scrollBody: {
    paddingHorizontal: spacing.md,
    paddingBottom: 180,
    gap: spacing.lg,
  },
  routeHero: {
    marginHorizontal: -spacing.md,
    backgroundColor: '#DFF0FD',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  routeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  locationText: {
    flex: 1,
    color: colors.text,
    fontSize: 18,
    fontWeight: '900',
  },
  routeMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  routeMetaText: {
    color: '#4B5563',
    fontSize: 16,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginLeft: 'auto',
  },
  editButtonText: {
    color: '#1096EB',
    fontSize: 16,
    fontWeight: '800',
  },
  vehicleCard: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#E7E7EA',
    backgroundColor: colors.surface,
    overflow: 'hidden',
  },
  vehicleTop: {
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.md,
  },
  vehicleThumb: {
    width: 108,
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: '#EAF4FF',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: spacing.md,
  },
  energyStrip: {
    width: '100%',
    backgroundColor: '#FCE8BB',
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  energyStripText: {
    color: '#C38900',
    fontSize: typography.body,
    fontWeight: '500',
  },
  vehicleCopy: {
    flex: 1,
    gap: spacing.xs,
    justifyContent: 'center',
  },
  vehicleTitle: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '900',
  },
  vehicleSimilar: {
    color: '#666B74',
    fontSize: 16,
    fontStyle: 'italic',
  },
  vehicleDivider: {
    height: 1,
    backgroundColor: colors.line,
    marginVertical: spacing.xs,
  },
  vehicleMeta: {
    color: '#4B5563',
    fontSize: 18,
  },
  statsGrid: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: colors.line,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  statCell: {
    flex: 1,
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.md,
    borderRightWidth: 1,
    borderRightColor: colors.line,
  },
  statCellText: {
    color: '#444B57',
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
  alertStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: '#FFEBC0',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  alertStripText: {
    color: '#5B4523',
    fontSize: 16,
    fontWeight: '700',
  },
  section: {
    gap: spacing.md,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 26,
    fontWeight: '900',
  },
  card: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#E6E8EE',
    backgroundColor: colors.surface,
    padding: spacing.md,
    gap: spacing.md,
  },
  inclusionRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  inclusionText: {
    flex: 1,
    color: '#1F2937',
    fontSize: 16,
    lineHeight: 24,
  },
  tripAssistant: {
    marginTop: spacing.sm,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: '#E2E6EE',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    shadowColor: colors.shadow,
    shadowOpacity: 1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  tripAssistantBubble: {
    width: 46,
    height: 46,
    borderRadius: radius.pill,
    backgroundColor: '#6489FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tripAssistantText: {
    color: '#2960F4',
    fontSize: typography.section,
    fontWeight: '800',
  },
  couponRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'flex-start',
  },
  radioMark: {
    width: 28,
    height: 28,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    borderColor: '#A1A1AA',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  radioMarkActive: {
    borderColor: '#1096EB',
  },
  radioMarkFill: {
    width: 12,
    height: 12,
    borderRadius: radius.pill,
    backgroundColor: '#1096EB',
  },
  couponCopy: {
    flex: 1,
    gap: spacing.sm,
  },
  couponCode: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#44D4C7',
    borderStyle: 'dashed',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  couponCodeText: {
    color: colors.text,
    fontSize: typography.section,
    fontWeight: '900',
  },
  couponBody: {
    color: '#4B5563',
    fontSize: 16,
    lineHeight: 24,
  },
  loginBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderRadius: 8,
    backgroundColor: '#FFF4D8',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  loginCircle: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    backgroundColor: '#F8C14E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginBannerText: {
    flex: 1,
    color: colors.text,
    fontSize: typography.section,
    fontWeight: '800',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#D8DDE7',
    backgroundColor: '#FAFAFB',
    paddingHorizontal: spacing.md,
  },
  inputFlex: {
    flex: 1,
    color: colors.text,
    fontSize: 18,
    paddingVertical: spacing.md,
  },
  applyText: {
    color: '#A1A1AA',
    fontSize: typography.section,
    fontWeight: '800',
  },
  supportBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderRadius: 24,
    backgroundColor: '#ECD7FF',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  supportTitle: {
    flex: 1,
    color: '#164E85',
    fontSize: typography.section,
    fontWeight: '900',
  },
  supportBody: {
    position: 'absolute',
    left: spacing.md,
    bottom: spacing.md,
    color: '#4B5563',
    fontSize: typography.body,
  },
  policyHeadline: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '800',
  },
  policyTimeline: {
    flexDirection: 'row',
  },
  refundLane: {
    flex: 1,
    backgroundColor: '#0F8D8B',
    paddingVertical: spacing.xs,
    alignItems: 'center',
  },
  refundLaneText: {
    color: colors.white,
    fontSize: typography.section,
    fontWeight: '800',
  },
  nonRefundLane: {
    flex: 1,
    backgroundColor: '#FCE8BB',
    paddingVertical: spacing.xs,
    alignItems: 'center',
  },
  nonRefundLaneText: {
    color: '#111827',
    fontSize: typography.section,
    fontWeight: '800',
  },
  policyLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  policyLabel: {
    color: '#4B5563',
    fontSize: 14,
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: colors.line,
    paddingTop: spacing.md,
  },
  linkText: {
    color: '#1096EB',
    fontSize: typography.section,
    fontWeight: '800',
  },
  addonRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  squareCheck: {
    width: 28,
    height: 28,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#A1A1AA',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  squareCheckActive: {
    borderColor: '#1096EB',
    backgroundColor: '#1096EB',
  },
  addonCopy: {
    flex: 1,
    gap: 4,
  },
  addonTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  addonLabel: {
    color: colors.text,
    fontSize: typography.section,
    fontWeight: '900',
  },
  addonPrice: {
    color: colors.text,
    fontSize: typography.section,
    fontWeight: '900',
  },
  addonDescription: {
    color: '#6B7280',
    fontSize: 16,
  },
  addonHelper: {
    color: '#D48A00',
    fontSize: 14,
    lineHeight: 20,
  },
  cardDivider: {
    height: 1,
    backgroundColor: colors.line,
  },
  pickupBox: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E6E8EE',
    backgroundColor: '#FAFAFB',
    padding: spacing.md,
    gap: 4,
  },
  pickupLabel: {
    color: '#7B808A',
    fontSize: typography.body,
    fontWeight: '700',
  },
  pickupText: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '900',
  },
  travellerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  travellerHeaderText: {
    color: '#4B5563',
    fontSize: typography.body,
  },
  saveText: {
    color: '#1096EB',
    fontSize: typography.body,
    fontWeight: '800',
  },
  dualInputRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  inputBox: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#D8DDE7',
    backgroundColor: '#FAFAFB',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    color: colors.text,
    fontSize: 18,
  },
  halfInput: {
    flex: 1,
  },
  genderLabel: {
    color: '#7B808A',
    fontSize: typography.body,
    fontWeight: '700',
  },
  genderRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  genderOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  genderRadio: {
    width: 22,
    height: 22,
    borderRadius: radius.pill,
    borderWidth: 2,
    borderColor: '#9CA3AF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  genderRadioActive: {
    borderColor: '#1096EB',
  },
  genderRadioFill: {
    width: 10,
    height: 10,
    borderRadius: radius.pill,
    backgroundColor: '#1096EB',
  },
  genderText: {
    color: colors.text,
    fontSize: typography.section,
  },
  orText: {
    color: '#4B5563',
    fontSize: typography.body,
  },
  loginRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  loginRowText: {
    color: '#1096EB',
    fontSize: typography.body,
    fontWeight: '900',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  checkbox: {
    width: 30,
    height: 30,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#9CA3AF',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
  },
  checkboxActive: {
    borderColor: '#1096EB',
    backgroundColor: '#1096EB',
  },
  checkboxText: {
    flex: 1,
    color: '#4B5563',
    fontSize: 16,
  },
  testimonialRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  testimonialCard: {
    width: 286,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface,
    padding: spacing.md,
    gap: spacing.md,
  },
  testimonialHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  testimonialName: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '900',
  },
  testimonialDate: {
    color: '#8A8F98',
    fontSize: 14,
  },
  ratingBox: {
    minWidth: 54,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#1096EB',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xs,
  },
  ratingBoxText: {
    color: '#1096EB',
    fontSize: 18,
    fontWeight: '900',
  },
  testimonialBody: {
    color: '#4B5563',
    fontSize: 16,
    lineHeight: 24,
  },
  termsText: {
    color: '#4B5563',
    fontSize: 14,
    lineHeight: 22,
  },
  advanceStrip: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 84,
    backgroundColor: '#D7FAF2',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  advanceText: {
    color: '#0F7B72',
    fontSize: 16,
    textAlign: 'center',
  },
  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: '#353535',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
  },
  payChoice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  bottomRadio: {
    width: 22,
    height: 22,
    borderRadius: radius.pill,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomRadioActive: {
    borderColor: '#1096EB',
  },
  bottomRadioFill: {
    width: 10,
    height: 10,
    borderRadius: radius.pill,
    backgroundColor: '#1096EB',
  },
  choiceLabel: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 14,
  },
  choiceValue: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  payNowButton: {
    flex: 1,
    minHeight: 56,
    borderRadius: 14,
    backgroundColor: '#147DFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  payNowText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
  },
});
