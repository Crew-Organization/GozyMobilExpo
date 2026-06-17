import { useState } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

export default function CheckPnrStatusScreen() {
  const [pnr, setPnr] = useState('');

  const handleSubmit = () => {
    if (pnr.length !== 10) {
      Alert.alert('Invalid PNR', 'Please enter a valid 10-digit PNR number.');
      return;
    }
    // Route to train-pnr-status screen
    router.push({
      pathname: '/train-pnr-status',
      params: { pnr }
    } as any);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <View style={styles.screen}>
          
          {/* Header Bar */}
          <View style={styles.header}>
            <Pressable hitSlop={12} onPress={() => router.back()} style={styles.backButton}>
              <MaterialCommunityIcons color="#111827" name="arrow-left" size={26} />
            </Pressable>
            <Text style={styles.headerTitle}>Check PNR Status</Text>
          </View>

          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            
            {/* Input Card Container */}
            <View style={styles.inputCard}>
              <Text style={styles.inputHeading}>Enter your 10 digit PNR Number</Text>
              
              <TextInput
                style={styles.pnrInput}
                placeholder="Eg.: 8947502345"
                placeholderTextColor="#9CA3AF"
                keyboardType="numeric"
                maxLength={10}
                value={pnr}
                onChangeText={(val) => setPnr(val.replace(/[^\d]/g, ''))}
              />

              <Pressable
                onPress={handleSubmit}
                style={[
                  styles.submitBtn,
                  pnr.length === 10 ? styles.submitBtnActive : styles.submitBtnInactive
                ]}
              >
                <Text style={styles.submitBtnText}>SUBMIT</Text>
              </Pressable>
            </View>

            {/* WHY BOOK WITH US? Section */}
            <View style={styles.whyBookSection}>
              <Text style={styles.sectionTitle}>WHY BOOK WITH US?</Text>

              {/* Banner 1: Confirmed Ticket or 3x Refund */}
              <View style={styles.promoBanner1}>
                <View style={styles.promoLeftIconBg}>
                  <LinearGradient
                    colors={['#C084FC', '#818CF8']}
                    style={StyleSheet.absoluteFillObject}
                  />
                  <MaterialCommunityIcons color="#FFFFFF" name="ticket-percent-outline" size={22} />
                </View>
                
                <View style={styles.promoTextsCol}>
                  <Text style={styles.promoTitle}>Confirmed Ticket or 3x Refund</Text>
                  <Text style={styles.promoSubtitle}>
                    Trip Guarantee is now Alternate Trip Plan with same benefits
                  </Text>
                </View>
                
                <MaterialCommunityIcons color="#9CA3AF" name="chevron-right" size={20} />
              </View>

              {/* Purple Gradient Box Card (Screenshot 2 middle) */}
              <View style={styles.gradientBlockCard}>
                {/* purple gradient header bar */}
                <LinearGradient
                  colors={['#A855F7', '#3B82F6']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.gradientCardHeader}
                >
                  <Text style={styles.gradientCardHeaderText}>
                    Get a Confirmed Ticket or 3X Refund With Alternate Trip Plan (previously Trip Guarantee)
                  </Text>
                </LinearGradient>

                {/* Inner White Body */}
                <View style={styles.gradientCardBody}>
                  <Text style={styles.whatIsTitle}>What is 3x refund?</Text>
                  
                  {/* Refund options breakdown side-by-side */}
                  <View style={styles.breakdownGrid}>
                    
                    {/* Column 1: 1x Refund */}
                    <View style={styles.refundBox}>
                      <View style={styles.refundBoxLeftLabel}>
                        <Text style={styles.verticalText}>1x Refund</Text>
                      </View>
                      <View style={styles.refundBoxRightContent}>
                        <Text style={styles.refundTitleHighlight}>Ticket fare amount</Text>
                        <Text style={styles.refundDescription}>
                          will be refunded to original paymode
                        </Text>
                      </View>
                    </View>

                    {/* Plus Icon */}
                    <View style={styles.plusWrapper}>
                      <Text style={styles.plusSign}>+</Text>
                    </View>

                    {/* Column 2: 2x Refund */}
                    <View style={styles.refundBox}>
                      <View style={[styles.refundBoxLeftLabel, styles.pinkLabelBg]}>
                        <Text style={[styles.verticalText, styles.pinkLabelText]}>2x Refund</Text>
                      </View>
                      <View style={styles.refundBoxRightContent}>
                        <Text style={styles.refundTitleHighlightPink}>Ticket Fare x 2</Text>
                        <Text style={styles.refundDescription}>
                          will be refunded as MMT Voucher
                        </Text>
                      </View>
                    </View>

                  </View>

                  {/* Handwritten note caption */}
                  <Text style={styles.handwrittenNote}>
                    Use this voucher to book flight, cab, bus or train.
                  </Text>
                </View>
              </View>

              {/* Testimonials */}
              <View style={styles.testimonialsGrid}>
                {/* Prakash Nair */}
                <View style={styles.testimonialCard}>
                  <MaterialCommunityIcons color="#E2E8F0" name="format-quote-open" size={24} style={styles.quoteIcon} />
                  <Text style={styles.testimonialAuthor}>Prakash Nair</Text>
                  <Text style={styles.testimonialBody}>
                    Had to take my Banking exam in Pune but ticket remained in waiting List. Trip Guarantee helped me go to Pune!
                  </Text>
                </View>

                {/* Aman Singh */}
                <View style={styles.testimonialCard}>
                  <MaterialCommunityIcons color="#E2E8F0" name="format-quote-open" size={24} style={styles.quoteIcon} />
                  <Text style={styles.testimonialAuthor}>Aman Singh</Text>
                  <Text style={styles.testimonialBody}>
                    Had to visit my village for immediate family commitment. I reached home on time all thanks to Trip Guarantee
                  </Text>
                </View>
              </View>

              {/* Exclusive Partners Panel */}
              <View style={[styles.sectionHeaderWrap, { marginTop: 24 }]}>
                <Text style={styles.sectionTitle}>Exclusive Partners</Text>
              </View>
              
              <View style={styles.partnerBannerCard}>
                <View style={styles.partnerCardInner}>
                  <View style={styles.partnerIllustration}>
                    <View style={styles.playCircleIcon}>
                      <MaterialCommunityIcons color="#3B82F6" name="play" size={24} />
                    </View>
                  </View>
                </View>
              </View>

            </View>

          </ScrollView>

        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  screen: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    height: 56,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  backButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
    marginLeft: 12,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  inputCard: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 3,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  inputHeading: {
    fontSize: 15.5,
    fontWeight: '800',
    color: '#374151',
    marginBottom: 16,
    textAlign: 'center',
  },
  pnrInput: {
    width: '100%',
    height: 48,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 16,
    backgroundColor: '#FAFAFA',
  },
  submitBtn: {
    width: '100%',
    height: 44,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitBtnInactive: {
    backgroundColor: '#9CA3AF',
  },
  submitBtnActive: {
    backgroundColor: '#1697F6',
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 14.5,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  whyBookSection: {
    paddingHorizontal: 16,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 13.5,
    fontWeight: '900',
    color: '#111827',
    letterSpacing: 0.2,
    marginBottom: 12,
  },
  promoBanner1: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F3F4F6',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 3,
    elevation: 1,
  },
  promoLeftIconBg: {
    width: 38,
    height: 38,
    borderRadius: 8,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  promoTextsCol: {
    flex: 1,
    gap: 2,
  },
  promoTitle: {
    fontSize: 13.5,
    fontWeight: '900',
    color: '#111827',
  },
  promoSubtitle: {
    fontSize: 10.5,
    color: '#6B7280',
    fontWeight: '700',
  },
  gradientBlockCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 2,
  },
  gradientCardHeader: {
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  gradientCardHeaderText: {
    color: '#FFFFFF',
    fontSize: 11.5,
    fontWeight: '900',
    lineHeight: 16,
  },
  gradientCardBody: {
    paddingHorizontal: 12,
    paddingVertical: 16,
  },
  whatIsTitle: {
    fontSize: 13.5,
    fontWeight: '900',
    color: '#111827',
    marginBottom: 14,
  },
  breakdownGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  refundBox: {
    flex: 1,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 6,
    height: 60,
    overflow: 'hidden',
  },
  refundBoxLeftLabel: {
    width: 22,
    backgroundColor: '#F3F4F6',
    borderRightWidth: 1,
    borderRightColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pinkLabelBg: {
    backgroundColor: '#FFF5F5',
    borderRightColor: '#FEE2E2',
  },
  verticalText: {
    fontSize: 7.5,
    fontWeight: '800',
    color: '#6B7280',
    transform: [{ rotate: '-90deg' }],
    width: 48,
    textAlign: 'center',
  },
  pinkLabelText: {
    color: '#E11D48',
  },
  refundBoxRightContent: {
    flex: 1,
    paddingHorizontal: 6,
    justifyContent: 'center',
    gap: 2,
  },
  refundTitleHighlight: {
    fontSize: 10,
    fontWeight: '900',
    color: '#111827',
  },
  refundTitleHighlightPink: {
    fontSize: 10,
    fontWeight: '900',
    color: '#E11D48',
  },
  refundDescription: {
    fontSize: 8,
    color: '#6B7280',
    fontWeight: '700',
    lineHeight: 10,
  },
  plusWrapper: {
    width: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  plusSign: {
    fontSize: 16,
    fontWeight: '900',
    color: '#9CA3AF',
  },
  handwrittenNote: {
    fontSize: 9,
    fontWeight: '700',
    color: '#6B7280',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 12,
  },
  testimonialsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  testimonialCard: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    padding: 12,
    position: 'relative',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  quoteIcon: {
    position: 'absolute',
    left: 8,
    top: 6,
  },
  testimonialAuthor: {
    fontSize: 11,
    fontWeight: '900',
    color: '#4B5563',
    marginLeft: 14,
    marginBottom: 4,
  },
  testimonialBody: {
    fontSize: 9.5,
    color: '#4B5563',
    fontWeight: '700',
    lineHeight: 13,
  },
  sectionHeaderWrap: {
    marginBottom: 10,
  },
  partnerBannerCard: {
    width: '100%',
    height: 120,
    backgroundColor: '#E5E7EB',
    borderRadius: 12,
    overflow: 'hidden',
  },
  partnerCardInner: {
    flex: 1,
    backgroundColor: '#D1D5DB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  partnerIllustration: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playCircleIcon: {
    marginLeft: 3,
  },
});
