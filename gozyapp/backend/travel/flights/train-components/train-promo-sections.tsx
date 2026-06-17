import { useState } from 'react';
import type { ComponentProps } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  AadhaarLogoMark,
  CanaraLogoMark,
  IrctcLogoMark,
  OffersTagIcon,
} from '@/src/components/train/train-logos';
import {
  trainAnnouncement,
  trainOffers,
  trainPhotoAssets,
  trainUserFeatures,
  trainWhyBookCards,
} from '@/src/lib/train-data';
import {
  TRAIN_CAROUSEL_GAP,
  TRAIN_CONTENT_WIDTH,
  TRAIN_FEATURE_CARD_HEIGHT,
  TRAIN_FEATURE_CARD_WIDTH,
  TRAIN_HORIZONTAL_PADDING,
  TRAIN_OFFER_CARD_HEIGHT,
  TRAIN_OFFER_CARD_WIDTH,
  TRAIN_WHY_BOOK_CARD_WIDTH,
  trainText,
} from '@/src/theme/train-ui';

type TrainPromoSectionsProps = {
  onSearchFabPress?: () => void;
  showOffersPartnerRow?: boolean;
  showSearchFab?: boolean;
};

type MaterialIconName = any;

export function TrainPromoSections({
  onSearchFabPress,
  showOffersPartnerRow = true,
  showSearchFab = true,
}: TrainPromoSectionsProps) {
  const [activeFeatureIndex, setActiveFeatureIndex] = useState(0);

  const featurePeekWidth = Math.round(TRAIN_CONTENT_WIDTH * 0.22);

  const handleFeatureScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const stride = TRAIN_FEATURE_CARD_WIDTH + TRAIN_CAROUSEL_GAP;
    const adjustedOffset = Math.max(
      0,
      event.nativeEvent.contentOffset.x - featurePeekWidth - TRAIN_CAROUSEL_GAP,
    );
    const nextIndex = Math.round(adjustedOffset / stride);
    const safeIndex = Math.max(0, Math.min(trainUserFeatures.length - 1, nextIndex));
    setActiveFeatureIndex(safeIndex);
  };

  return (
    <View style={styles.wrap}>
      {/* OFFERS — first promo block after search (reference page 1) */}
      <View style={styles.offersSection}>
        <View style={styles.offersHeader}>
          <OffersTagIcon size={20} />
          <Text style={trainText.sectionTitle}>OFFERS</Text>
        </View>

        <ScrollView
          horizontal
          contentContainerStyle={styles.offersRow}
          decelerationRate="fast"
          showsHorizontalScrollIndicator={false}
          snapToAlignment="start"
          snapToInterval={TRAIN_OFFER_CARD_WIDTH + TRAIN_CAROUSEL_GAP}
        >
          {trainOffers.map((offer) => (
            <Pressable key={offer.id} style={styles.offerCard}>
              <Image contentFit="cover" source={{ uri: offer.image }} style={styles.offerImage} />
              <LinearGradient
                colors={['rgba(0,0,0,0.06)', 'rgba(0,0,0,0.62)']}
                locations={[0.15, 1]}
                style={styles.offerOverlay}
              />
              {offer.brandTitle ? (
                <View style={styles.offerBrandBadge}>
                  <Text style={styles.offerBrandTitle}>{offer.brandTitle}</Text>
                  {offer.brandSubtitle ? (
                    <Text style={styles.offerBrandSubtitle}>{offer.brandSubtitle}</Text>
                  ) : null}
                </View>
              ) : null}
              <View style={styles.offerBadge}>
                <Text style={styles.offerBadgeText}>{offer.badge}</Text>
              </View>
              <View style={styles.offerContent}>
                {offer.eyebrow ? <Text style={trainText.offerEyebrow}>{offer.eyebrow}</Text> : null}
                <Text style={trainText.offerTitle}>{offer.title}</Text>
                <Text style={trainText.offerSubtitle}>{offer.subtitle}</Text>
              </View>
            </Pressable>
          ))}
        </ScrollView>

        {showOffersPartnerRow ? (
          <View style={styles.offersPartnerRow}>
            <IrctcLogoMark size={36} />
            <Text style={trainText.partnerText}>IRCTC Authorised Partner</Text>
          </View>
        ) : null}
      </View>

      {/* Features Our Users Love */}
      <View style={styles.featuresSection}>
        <Text style={[trainText.sectionHeading, styles.sectionHeadingPad]}>
          Features Our Users Love
        </Text>

        <ScrollView
          horizontal
          contentContainerStyle={styles.featuresRow}
          decelerationRate="fast"
          showsHorizontalScrollIndicator={false}
          snapToAlignment="start"
          snapToInterval={TRAIN_FEATURE_CARD_WIDTH + TRAIN_CAROUSEL_GAP}
          onMomentumScrollEnd={handleFeatureScroll}
        >
          <View style={styles.featurePeekCard}>
            <Image
              contentFit="cover"
              source={{ uri: trainPhotoAssets.offerTracks }}
              style={StyleSheet.absoluteFill}
            />
            <LinearGradient colors={['#7BC8F6', '#4A90D9']} style={styles.featurePeekOverlay} />
            <MaterialCommunityIcons color="#FFFFFF" name="train" size={36} />
          </View>

          {trainUserFeatures.map((feature) => (
            <LinearGradient
              key={feature.id}
              colors={feature.accent}
              end={{ x: 1, y: 1 }}
              start={{ x: 0, y: 0 }}
              style={styles.featureCard}
            >
              {feature.image ? (
                <>
                  <Image
                    contentFit="cover"
                    source={{ uri: feature.image }}
                    style={
                      feature.imageStyle === 'bottomRight'
                        ? styles.featureImageBottom
                        : styles.featureImageRight
                    }
                  />
                  <LinearGradient
                    colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.95)']}
                    locations={[0, 0.55]}
                    start={{ x: 0, y: 0.5 }}
                    end={{ x: 1, y: 0.5 }}
                    style={styles.featureImageFade}
                  />
                </>
              ) : null}

              {feature.intro ? (
                <Text style={trainText.featureIntro}>{feature.intro}</Text>
              ) : null}

              {feature.eyebrow ? (
                <View style={styles.featureEyebrowRow}>
                  <MaterialCommunityIcons color={feature.eyebrowColor ?? '#129AAE'} name="account-group" size={13} />
                  <Text style={[trainText.featureEyebrow, { color: feature.eyebrowColor ?? '#129AAE' }]}>
                    {feature.eyebrow}
                  </Text>
                </View>
              ) : null}

              <Text style={[trainText.featureTitle, styles.featureTitlePad]}>{feature.title}</Text>
              <Text style={[trainText.featureSubtitle, styles.featureSubtitlePad]}>{feature.subtitle}</Text>

              <Pressable style={styles.featureCta}>
                <Text style={trainText.featureCta}>{feature.cta}</Text>
              </Pressable>

              {feature.icon && feature.iconBg ? (
                <View style={[styles.featureIconWrap, { backgroundColor: `${feature.iconBg}22` }]}>
                  <View style={[styles.featureIconCircle, { backgroundColor: feature.iconBg }]}>
                    <MaterialCommunityIcons color="#FFFFFF" name={feature.icon as MaterialIconName} size={26} />
                  </View>
                </View>
              ) : null}
            </LinearGradient>
          ))}
        </ScrollView>

        <View style={styles.featureDots}>
          {trainUserFeatures.map((feature, index) => (
            <View
              key={feature.id}
              style={[styles.featureDot, index === activeFeatureIndex && styles.featureDotActive]}
            />
          ))}
        </View>
      </View>

      {/* Aadhaar + IRCTC */}
      <View style={styles.noticeSection}>
        <LinearGradient
          colors={['#EAF6FF', '#DDEEFF']}
          end={{ x: 1, y: 1 }}
          start={{ x: 0, y: 0 }}
          style={styles.noticeCard}
        >
          <View style={styles.noticeContent}>
            <Text style={trainText.noticeTitle}>Link Aadhaar to IRCTC for tatkal booking</Text>
            <Text style={trainText.noticeSubtitle}>Mandatory from 1 Jul 25</Text>
            <Pressable style={styles.noticeButton}>
              <Text style={trainText.noticeButton}>Link Aadhar</Text>
            </Pressable>
          </View>

          <View style={styles.noticeIllustration}>
            <View style={styles.noticeBadgeCircle}>
              <AadhaarLogoMark size={44} />
            </View>
            <View style={styles.noticeBadgeConnector} />
            <View style={styles.noticeBadgeCircle}>
              <IrctcLogoMark size={44} />
            </View>
          </View>
        </LinearGradient>
      </View>

      {/* Why Book With Us */}
      <View style={styles.whyBookSection}>
        <Text style={[trainText.sectionHeading, styles.sectionHeadingPad]}>Why Book With Us?</Text>

        <ScrollView
          horizontal
          contentContainerStyle={styles.whyBookRow}
          decelerationRate="fast"
          showsHorizontalScrollIndicator={false}
          snapToAlignment="start"
          snapToInterval={TRAIN_WHY_BOOK_CARD_WIDTH + TRAIN_CAROUSEL_GAP}
        >
          {trainWhyBookCards.map((item) => (
            <View key={item.id} style={styles.whyBookCard}>
              <View style={[styles.whyBookLeft, { backgroundColor: item.leftTone }]}>
                <MaterialCommunityIcons color={item.iconColor} name={item.icon as MaterialIconName} size={30} />
              </View>
              <View style={styles.whyBookRight}>
                <Text style={trainText.whyBookTitle}>{item.title}</Text>
                {item.showRupeeBadge ? (
                  <View style={styles.rupeeBadge}>
                    <MaterialCommunityIcons color="#0FA888" name="currency-inr" size={22} />
                  </View>
                ) : null}
              </View>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Sponsored — Canara Bank */}
      <View style={styles.sponsoredSection}>
        <View style={styles.sponsoredCard}>
          <Image contentFit="cover" source={{ uri: trainPhotoAssets.sponsoredTravel }} style={styles.sponsoredImage} />
          <LinearGradient colors={['rgba(0,0,0,0.05)', 'rgba(0,0,0,0.55)']} style={styles.sponsoredOverlay} />
          <View style={styles.sponsoredTag}>
            <Text style={styles.sponsoredTagText}>Sponsored</Text>
          </View>
          <View style={styles.sponsoredTopRow}>
            <CanaraLogoMark size={28} />
          </View>
          <View style={styles.sponsoredHeroTextWrap}>
            <Text style={styles.sponsoredHeroYellow}>Your next getaway</Text>
            <Text style={styles.sponsoredHeroRed}>starts with payday.</Text>
          </View>
          <View style={styles.sponsoredFooter}>
            <View style={styles.sponsoredFooterLeft}>
              <CanaraLogoMark size={22} />
              <Text style={styles.sponsoredFooterTitle}>PREMIUM PAYROLL ACCOUNT</Text>
            </View>
            <View style={styles.sponsoredFooterRight}>
              <Text style={styles.sponsoredBullet}>• Instant Overdraft facility</Text>
              <Text style={styles.sponsoredBullet}>• Free Term Life Insurance Cover</Text>
              <Text style={styles.sponsoredBullet}>• Debit Card with Accidental Insurance Cover</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Announcements */}
      <View style={styles.announcementsSection}>
        <View style={styles.announcementsHeader}>
          <MaterialCommunityIcons color="#F5A623" name="bullhorn" size={18} />
          <Text style={trainText.announcementsTitle}>ANNOUNCEMENTS</Text>
        </View>
        <View style={styles.announcementsCardRow}>
          <View style={styles.announcementsCard}>
            <Text style={trainText.announcementsBody}>{trainAnnouncement}</Text>
          </View>
          <Pressable style={styles.voiceFab}>
            <LinearGradient colors={['#4D68F0', '#9B5DE5']} style={styles.voiceFabGradient}>
              <MaterialCommunityIcons color="#FFFFFF" name="microphone" size={22} />
            </LinearGradient>
          </Pressable>
        </View>
      </View>

      {/* Bottom sponsored strip */}
      <View style={styles.sponsoredSectionBottom}>
        <View style={styles.sponsoredCardCompact}>
          <Image contentFit="cover" source={{ uri: trainPhotoAssets.sponsoredTravel }} style={styles.sponsoredImage} />
          <LinearGradient colors={['rgba(0,0,0,0.08)', 'rgba(0,0,0,0.5)']} style={styles.sponsoredOverlay} />
          <View style={styles.sponsoredTag}>
            <Text style={styles.sponsoredTagText}>Sponsored</Text>
          </View>
          <Text style={styles.sponsoredCompactTitle}>Your next getaway</Text>
        </View>
        <View style={styles.bestHintCard}>
          <Text style={styles.bestHintText}>Best H</Text>
        </View>
      </View>

      {showSearchFab ? (
        <Pressable onPress={onSearchFabPress} style={styles.searchFab}>
          <LinearGradient colors={['#1490EA', '#4D68F0']} style={styles.searchFabGradient}>
            <MaterialCommunityIcons color="#FFFFFF" name="magnify" size={26} />
          </LinearGradient>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'relative',
    paddingBottom: 24,
  },
  offersSection: {
    backgroundColor: '#FFFFFF',
    marginTop: 8,
    paddingTop: 14,
    paddingBottom: 18,
  },
  offersHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: TRAIN_HORIZONTAL_PADDING,
    marginBottom: 12,
  },
  offersPartnerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingTop: 14,
    paddingHorizontal: TRAIN_HORIZONTAL_PADDING,
  },
  offerBrandBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 2,
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 5,
    maxWidth: '55%',
  },
  offerBrandTitle: {
    fontSize: 8,
    fontWeight: '800',
    color: '#1A4F8C',
    letterSpacing: 0.3,
  },
  offerBrandSubtitle: {
    fontSize: 9,
    fontWeight: '900',
    color: '#E65100',
    letterSpacing: 0.2,
  },
  offersRow: {
    paddingLeft: TRAIN_HORIZONTAL_PADDING,
    paddingRight: 10,
    gap: TRAIN_CAROUSEL_GAP,
  },
  offerCard: {
    width: TRAIN_OFFER_CARD_WIDTH,
    height: TRAIN_OFFER_CARD_HEIGHT,
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: '#E8E8E8',
  },
  offerImage: {
    ...StyleSheet.absoluteFillObject,
  },
  offerOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  offerBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    zIndex: 2,
  },
  offerBadgeText: {
    fontSize: 8,
    lineHeight: 10,
    color: '#444444',
    fontWeight: '700',
  },
  offerContent: {
    position: 'absolute',
    left: 14,
    right: 14,
    bottom: 14,
    zIndex: 2,
    gap: 2,
  },
  featuresSection: {
    backgroundColor: '#FFFFFF',
    marginTop: 8,
    paddingTop: 18,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: '#EFEFEF',
    position: 'relative',
  },
  sectionHeadingPad: {
    paddingHorizontal: TRAIN_HORIZONTAL_PADDING,
    marginBottom: 14,
  },
  featuresRow: {
    paddingLeft: TRAIN_HORIZONTAL_PADDING,
    paddingRight: 10,
    gap: TRAIN_CAROUSEL_GAP,
    alignItems: 'stretch',
  },
  featurePeekCard: {
    width: Math.round(TRAIN_CONTENT_WIDTH * 0.22),
    height: TRAIN_FEATURE_CARD_HEIGHT,
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E9E9E9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  featurePeekOverlay: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.85,
  },
  featureCard: {
    width: TRAIN_FEATURE_CARD_WIDTH,
    height: TRAIN_FEATURE_CARD_HEIGHT,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E9E9E9',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 14,
    overflow: 'hidden',
  },
  featureImageRight: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: '46%',
    height: '100%',
  },
  featureImageBottom: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: '42%',
    height: '72%',
  },
  featureImageFade: {
    ...StyleSheet.absoluteFillObject,
  },
  featureEyebrowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 8,
  },
  featureTitlePad: {
    maxWidth: '66%',
    marginBottom: 6,
  },
  featureSubtitlePad: {
    maxWidth: '66%',
    marginBottom: 14,
  },
  featureCta: {
    alignSelf: 'flex-start',
    minWidth: 108,
    height: 42,
    paddingHorizontal: 18,
    borderRadius: 12,
    backgroundColor: '#1197F2',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  featureIconWrap: {
    position: 'absolute',
    right: 14,
    bottom: 16,
    zIndex: 2,
  },
  featureIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureDots: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    marginTop: 14,
  },
  featureDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#D6D6D6',
  },
  featureDotActive: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#8F8F8F',
  },
  noticeSection: {
    backgroundColor: '#FFFFFF',
    marginTop: 8,
    paddingHorizontal: TRAIN_HORIZONTAL_PADDING,
    paddingTop: 4,
    paddingBottom: 18,
  },
  noticeCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#D6E7F8',
    minHeight: 132,
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  noticeContent: {
    flex: 1,
    paddingRight: 10,
  },
  noticeButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    height: 36,
    borderRadius: 9,
    backgroundColor: '#1490EA',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 14,
  },
  noticeIllustration: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  noticeBadgeCircle: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    shadowColor: '#6D8DB2',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  noticeBadgeConnector: {
    width: 20,
    height: 0,
    borderTopWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#3E84D4',
    marginHorizontal: 3,
  },
  whyBookSection: {
    backgroundColor: '#FFFFFF',
    marginTop: 8,
    paddingTop: 18,
    paddingBottom: 20,
  },
  whyBookRow: {
    paddingLeft: TRAIN_HORIZONTAL_PADDING,
    paddingRight: 10,
    gap: TRAIN_CAROUSEL_GAP,
  },
  whyBookCard: {
    width: TRAIN_WHY_BOOK_CARD_WIDTH,
    minHeight: 118,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E6E6E6',
    overflow: 'hidden',
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
  },
  whyBookLeft: {
    width: '38%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  whyBookRight: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 14,
    justifyContent: 'center',
    position: 'relative',
  },
  rupeeBadge: {
    position: 'absolute',
    right: 10,
    top: '50%',
    marginTop: -18,
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#0FA888',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  sponsoredSection: {
    backgroundColor: '#FFFFFF',
    marginTop: 8,
    paddingHorizontal: TRAIN_HORIZONTAL_PADDING,
    paddingBottom: 16,
  },
  sponsoredSectionBottom: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: TRAIN_HORIZONTAL_PADDING,
    paddingBottom: 24,
    backgroundColor: '#FFFFFF',
  },
  sponsoredCard: {
    borderRadius: 14,
    overflow: 'hidden',
    minHeight: 196,
    backgroundColor: '#1A4F8C',
  },
  sponsoredCardCompact: {
    flex: 1,
    borderRadius: 14,
    overflow: 'hidden',
    minHeight: 120,
    backgroundColor: '#1A4F8C',
  },
  sponsoredImage: {
    ...StyleSheet.absoluteFillObject,
  },
  sponsoredOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  sponsoredTag: {
    position: 'absolute',
    top: 10,
    right: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.92)',
    zIndex: 2,
  },
  sponsoredTagText: {
    fontSize: 9,
    color: '#333333',
    fontWeight: '600',
  },
  sponsoredTopRow: {
    position: 'absolute',
    top: 10,
    right: 12,
    alignItems: 'flex-end',
    zIndex: 2,
    gap: 4,
  },
  sponsoredHeroTextWrap: {
    position: 'absolute',
    left: 14,
    top: 48,
    zIndex: 2,
  },
  sponsoredHeroYellow: {
    fontSize: 21,
    lineHeight: 24,
    fontWeight: '900',
    color: '#FFD54F',
  },
  sponsoredHeroRed: {
    fontSize: 17,
    lineHeight: 21,
    fontWeight: '900',
    color: '#FF5252',
  },
  sponsoredFooter: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    zIndex: 2,
  },
  sponsoredFooterLeft: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.95)',
    paddingHorizontal: 8,
    paddingVertical: 8,
    justifyContent: 'center',
    gap: 4,
  },
  sponsoredFooterTitle: {
    fontSize: 7.5,
    fontWeight: '700',
    color: '#333333',
  },
  sponsoredFooterRight: {
    flex: 1.1,
    backgroundColor: 'rgba(26,79,140,0.92)',
    paddingHorizontal: 8,
    paddingVertical: 6,
    justifyContent: 'center',
  },
  sponsoredBullet: {
    fontSize: 7.5,
    lineHeight: 11,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  sponsoredCompactTitle: {
    position: 'absolute',
    left: 12,
    bottom: 12,
    fontSize: 16,
    fontWeight: '900',
    color: '#FFD54F',
    zIndex: 2,
  },
  bestHintCard: {
    width: 88,
    minHeight: 120,
    borderRadius: 14,
    backgroundColor: '#F4F4F4',
    borderWidth: 1,
    borderColor: '#E6E6E6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bestHintText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#888888',
  },
  announcementsSection: {
    backgroundColor: '#FFFFFF',
    marginTop: 8,
    paddingHorizontal: TRAIN_HORIZONTAL_PADDING,
    paddingTop: 16,
    paddingBottom: 12,
  },
  announcementsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  announcementsCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  announcementsCard: {
    flex: 1,
    backgroundColor: '#F2F2F2',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    minHeight: 72,
    justifyContent: 'center',
  },
  voiceFab: {
    width: 52,
    height: 52,
    borderRadius: 26,
    overflow: 'hidden',
    elevation: 5,
  },
  voiceFabGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchFab: {
    position: 'absolute',
    right: TRAIN_HORIZONTAL_PADDING,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    overflow: 'hidden',
    elevation: 6,
    zIndex: 10,
  },
  searchFabGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
