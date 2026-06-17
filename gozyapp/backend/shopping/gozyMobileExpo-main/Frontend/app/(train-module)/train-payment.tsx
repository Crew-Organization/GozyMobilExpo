import { useEffect, useState } from 'react';
import { router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { PaymentBrandIcon, type PaymentBrandKind } from '@/src/components/train/payment-brand-icons';
import {
  CompactScroller,
  PaymentDetailsModal,
  PaymentDueSummary,
  PaymentScreenShell,
} from '@/src/components/train/train-payment-shared';
import { buildRecentTrainBooking } from '@/src/lib/train-payment';
import { useTrainSearchStore } from '@/src/store/train-search-store';

type DirectMethod = 'BHIM' | 'PhonePe' | 'GooglePay';

type PaymentOption = {
  id: string;
  title: string;
  subtitle: string;
  icon: PaymentBrandKind;
  badge?: string;
  route?: string;
  directMethod?: DirectMethod;
};

const paymentOptions: PaymentOption[] = [
  { id: 'BHIM', title: 'BHIM', subtitle: 'Pay with BHIM', icon: 'bhim', directMethod: 'BHIM' },
  { id: 'UPI', title: 'UPI Options', subtitle: 'Pay Directly From Your Bank Account', icon: 'upi', route: '/train-payment-upi' },
  { id: 'CARDS', title: 'Credit & Debit Cards', subtitle: 'Visa, Mastercard, Amex, Rupay and more', icon: 'card', route: '/train-payment-cards' },
  { id: 'PAY_LATER', title: 'Pay Later', subtitle: 'Lazypay, Amazon', icon: 'clock', route: '/train-payment-pay-later' },
  { id: 'NET_BANKING', title: 'Net Banking', subtitle: '40+ Banks Available', icon: 'bank', badge: 'Fingerprint/Face ID', route: '/train-payment-netbanking' },
  { id: 'WALLETS', title: 'Gift Cards & e-wallets', subtitle: 'MMT Gift cards & Amazon Pay', icon: 'wallet', route: '/train-payment-giftcards' },
  { id: 'EMI', title: 'EMI', subtitle: 'Credit/Debit Card & Cardless EMI available', icon: 'emi', route: '/train-payment-emi' },
  { id: 'PHONEPE', title: 'PhonePe', subtitle: 'Pay with PhonePe', icon: 'phonepe', directMethod: 'PhonePe' },
  { id: 'GPAY', title: 'GooglePay', subtitle: 'Pay with GooglePay', icon: 'gpay', directMethod: 'GooglePay' },
];

export default function TrainPaymentScreen() {
  const { reviewBookingDraft, setReviewBookingDraft, addRecentBooking } = useTrainSearchStore();
  const [secondsLeft, setSecondsLeft] = useState(8 * 60 + 58);
  const [showDetails, setShowDetails] = useState(false);
  const [myCashOpen, setMyCashOpen] = useState(true);
  const [expandedDirect, setExpandedDirect] = useState<DirectMethod | null>('BHIM');
  const booking = reviewBookingDraft;
  const extraTravellers = booking ? Math.max(booking.passengers.length - 1, 0) : 0;

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((current) => (current > 0 ? current - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const finalizeBooking = (paymentMethod: DirectMethod) => {
    if (!booking) return;

    addRecentBooking(buildRecentTrainBooking(booking));
    setReviewBookingDraft({ ...booking, selectedPaymentMethod: paymentMethod });
    setReviewBookingDraft(null);
    router.push('/train-confirmation' as never);
  };

  return (
    <PaymentScreenShell booking={booking} onBack={() => router.back()} secondsLeft={secondsLeft} title="Payment">
      {booking ? (
        <>
          <CompactScroller>
            <PaymentDueSummary booking={booking} onToggleDetails={() => setShowDetails(true)} />

            <View style={styles.travellerBar}>
              <Text numberOfLines={1} style={styles.travellerText}>
                {booking.passengers[0]?.name} ({booking.passengers[0]?.gender.charAt(0).toUpperCase()}) {booking.passengers[0]?.age}yrs,
                {extraTravellers > 0 ? ` +${extraTravellers} traveller` : ' traveller'}
              </Text>
            </View>

            <View style={styles.sectionCard}>
              <Pressable onPress={() => setMyCashOpen((current) => !current)} style={styles.myCashRow}>
                <View style={styles.myCashIconWrap}>
                  <PaymentBrandIcon kind="mycash" />
                </View>
                <Text style={styles.myCashTitle}>MyCash</Text>
                <MaterialCommunityIcons color="#1697F6" name={myCashOpen ? 'chevron-down' : 'chevron-right'} size={22} />
              </Pressable>

              {myCashOpen ? (
                <Pressable onPress={() => router.push('/train-payment-add-giftcard' as never)} style={styles.giftCardRow}>
                  <PaymentBrandIcon kind="giftcard" compact />
                  <Text style={styles.giftCardText}>Add a Gift Card</Text>
                </Pressable>
              ) : null}
            </View>

            <Text style={styles.sectionTitle}>Payment Options</Text>
            <View style={styles.sectionCard}>
              {paymentOptions.map((option, index) => {
                const isDirect = Boolean(option.directMethod);
                const expanded = option.directMethod ? expandedDirect === option.directMethod : false;

                return (
                  <View key={option.id} style={[styles.optionWrap, index === paymentOptions.length - 1 && styles.optionWrapLast]}>
                    <Pressable
                      onPress={() => {
                        if (option.directMethod) {
                          setExpandedDirect((current) => (current === option.directMethod ? null : option.directMethod!));
                          return;
                        }
                        if (option.route) {
                          router.push(option.route as never);
                        }
                      }}
                      style={styles.optionRow}
                    >
                      <PaymentBrandIcon kind={option.icon} />
                      <View style={styles.optionTextWrap}>
                        <View style={styles.optionTitleRow}>
                          <Text style={styles.optionTitle}>{option.title}</Text>
                          {option.id === 'UPI' ? (
                            <View style={styles.inlineBrandRow}>
                              <PaymentBrandIcon compact kind="gpay" />
                              <PaymentBrandIcon compact kind="phonepe" />
                              <PaymentBrandIcon compact kind="paytm" />
                              <PaymentBrandIcon compact kind="navi" />
                            </View>
                          ) : null}
                          {option.badge ? <Text style={styles.optionBadge}>{option.badge}</Text> : null}
                        </View>
                        <Text style={styles.optionSubtitle}>{option.subtitle}</Text>
                      </View>
                      <MaterialCommunityIcons
                        color="#1697F6"
                        name={isDirect ? (expanded ? 'chevron-down' : 'chevron-right') : 'chevron-right'}
                        size={22}
                      />
                    </Pressable>

                    {expanded && option.directMethod ? (
                      <View style={styles.directActionWrap}>
                        <Pressable onPress={() => finalizeBooking(option.directMethod!)} style={styles.primaryButton}>
                          <Text style={styles.primaryButtonText}>OPEN {option.directMethod.toUpperCase()}</Text>
                        </Pressable>
                      </View>
                    ) : null}
                  </View>
                );
              })}
            </View>

            <View style={styles.disclaimerTextWrap}>
              <Text style={styles.disclaimerText}>
                By continuing to pay, I understand and agree with the{' '}
                <Text style={styles.disclaimerLink}>Terms of Service</Text>,{' '}
                <Text style={styles.disclaimerLink}>Privacy Policy</Text> and{' '}
                <Text style={styles.disclaimerLink}>User Agreement</Text> of MakeMyTrip.
              </Text>
            </View>
          </CompactScroller>

          <PaymentDetailsModal booking={booking} onClose={() => setShowDetails(false)} visible={showDetails} />
        </>
      ) : null}
    </PaymentScreenShell>
  );
}

const styles = StyleSheet.create({
  travellerBar: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  travellerText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#374151',
  },
  sectionTitle: {
    marginHorizontal: 16,
    marginTop: 18,
    marginBottom: 10,
    fontSize: 18,
    fontWeight: '900',
    color: '#111827',
  },
  sectionCard: {
    marginHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  myCashRow: {
    minHeight: 74,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  myCashIconWrap: {
    marginRight: 12,
  },
  myCashTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
  },
  giftCardRow: {
    minHeight: 54,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  giftCardText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1697F6',
  },
  optionWrap: {
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  optionWrapLast: {
    borderBottomWidth: 0,
  },
  optionRow: {
    minHeight: 84,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionTextWrap: {
    flex: 1,
    marginLeft: 12,
  },
  optionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#111827',
  },
  optionSubtitle: {
    marginTop: 2,
    fontSize: 13,
    color: '#4B5563',
  },
  inlineBrandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  optionBadge: {
    backgroundColor: '#44D4C1',
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  directActionWrap: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  primaryButton: {
    height: 48,
    borderRadius: 10,
    backgroundColor: '#1D7DFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  disclaimerTextWrap: {
    paddingHorizontal: 20,
    marginTop: 22,
    marginBottom: 20,
  },
  disclaimerText: {
    fontSize: 12,
    lineHeight: 18,
    color: '#4B5563',
    textAlign: 'center',
    fontWeight: '500',
  },
  disclaimerLink: {
    color: '#1697F6',
  },
});
