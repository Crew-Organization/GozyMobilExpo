import { Dimensions, StyleSheet } from 'react-native';

const { width } = Dimensions.get('window');

export const TRAIN_HORIZONTAL_PADDING = 16;
export const TRAIN_CONTENT_WIDTH = width - TRAIN_HORIZONTAL_PADDING * 2;
export const TRAIN_CAROUSEL_GAP = 12;

export const TRAIN_OFFER_CARD_WIDTH = 228;
export const TRAIN_OFFER_CARD_HEIGHT = 124;

export const TRAIN_FEATURE_CARD_WIDTH = 232;
export const TRAIN_FEATURE_CARD_HEIGHT = 148;

export const TRAIN_WHY_BOOK_CARD_WIDTH = 188;

// Premium Color System
const colors = {
  textDark: '#1A1A1A',
  textMuted: '#666666',
  textLight: '#999999',
  primaryBlue: '#0084FF',
  primaryBlueSoft: '#EBF4FF',
  accentGreen: '#00A699',
  accentOrange: '#FF5A5F',
  accentPurple: '#8244E1',
  bgCard: '#FFFFFF',
  borderLight: '#E5E5EA',
};

export const trainText = StyleSheet.create({
  // Section Headings & Titles
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.textMuted,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textDark,
    letterSpacing: -0.2,
  },
  partnerText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textMuted,
  },

  // Offer Card Text
  offerEyebrow: {
    fontSize: 8.5,
    fontWeight: '900',
    color: colors.accentOrange,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  offerTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
    lineHeight: 16,
  },
  offerSubtitle: {
    fontSize: 9.5,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.85)',
    lineHeight: 12,
  },

  // Feature Card Text
  featureIntro: {
    fontSize: 9,
    fontWeight: '800',
    color: colors.accentGreen,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  featureEyebrow: {
    fontSize: 9.5,
    fontWeight: '800',
    color: colors.primaryBlue,
    letterSpacing: 0.2,
  },
  featureTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.textDark,
    lineHeight: 16,
  },
  featureSubtitle: {
    fontSize: 10,
    fontWeight: '500',
    color: colors.textMuted,
    lineHeight: 13,
  },
  featureCta: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  // Link Aadhaar Notice
  noticeTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1A4F8C',
    lineHeight: 16,
  },
  noticeSubtitle: {
    fontSize: 10,
    fontWeight: '600',
    color: '#E65100',
    marginTop: 2,
  },
  noticeButton: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  // Why Book Card
  whyBookTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textDark,
    lineHeight: 14,
  },

  // Announcements
  announcementsTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.accentPurple,
    letterSpacing: 0.8,
  },
  announcementsBody: {
    fontSize: 10.5,
    fontWeight: '500',
    color: colors.textMuted,
    lineHeight: 14,
  },

  // Form Fields (train-station.tsx)
  fieldLabel: {
    fontSize: 9.5,
    fontWeight: '700',
    color: colors.textLight,
    textTransform: 'uppercase',
  },
  fieldLabelActive: {
    fontSize: 9.5,
    fontWeight: '800',
    color: colors.primaryBlue,
    textTransform: 'uppercase',
  },
  fieldPlaceholder: {
    fontSize: 13.5,
    fontWeight: '700',
    color: colors.textDark,
  },
  fieldSubvalue: {
    fontSize: 10.5,
    color: colors.textMuted,
    fontWeight: '500',
  },
  popularLabel: {
    fontSize: 11.5,
    fontWeight: '800',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  // Station List Rows
  stationCityLine: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.textDark,
  },
  stationNameLine: {
    fontSize: 10.5,
    fontWeight: '500',
    color: colors.textMuted,
  },
  stationCode: {
    fontSize: 12.5,
    fontWeight: '900',
    color: colors.primaryBlue,
  },
});
