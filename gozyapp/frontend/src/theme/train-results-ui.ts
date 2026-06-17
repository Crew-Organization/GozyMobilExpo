import type { TextStyle, ViewStyle } from 'react-native';

export const trainResultsPalette = {
  primaryBlue: '#1D9BF0',
  darkNavy: '#0B1B2B',
  dullBlack: '#2F343B',
  successGreen: '#16A34A',
  warningOrange: '#D97706',
  purple: '#A855F7',
  mutedBackground: '#F5F7FA',
  border: '#E5E7EB',
  textPrimary: '#111827',
  textSecondary: '#6B7280',
  textMuted: '#9CA3AF',
  surface: '#FFFFFF',
  shadow: 'rgba(15, 23, 42, 0.08)',
  shadowStrong: 'rgba(15, 23, 42, 0.14)',
  aquaSoft: '#E7F7F5',
  blueSoft: '#EAF5FF',
  amberSoft: '#FFF8E8',
  purpleSoft: '#F5ECFF',
  greenSoft: '#ECFDF3',
  badgeYellow: '#FBBF24',
} as const;

export const trainResultsSpacing = {
  xxs: 3,
  xs: 6,
  sm: 10,
  md: 14,
  lg: 18,
  xl: 20,
} as const;

export const trainResultsRadius = {
  sm: 10,
  md: 16,
  lg: 18,
  pill: 999,
} as const;

export const trainResultsFonts = {
  regular: undefined,
  medium: undefined,
  semiBold: undefined,
  bold: undefined,
} as const;

export const trainResultsType = {
  routeTitle: {
    fontFamily: trainResultsFonts.bold,
    fontSize: 18,
    lineHeight: 22,
    letterSpacing: -0.3,
    fontWeight: '900',
  } satisfies TextStyle,
  subtitle: {
    fontFamily: trainResultsFonts.medium,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: -0.1,
    fontWeight: '600',
  } satisfies TextStyle,
  tabTitle: {
    fontFamily: trainResultsFonts.bold,
    fontSize: 16,
    lineHeight: 20,
    letterSpacing: -0.2,
    fontWeight: '800',
  } satisfies TextStyle,
  tabMeta: {
    fontFamily: trainResultsFonts.semiBold,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '700',
  } satisfies TextStyle,
  trainTitle: {
    fontFamily: trainResultsFonts.bold,
    fontSize: 16,
    lineHeight: 20,
    letterSpacing: -0.3,
    fontWeight: '900',
  } satisfies TextStyle,
  trainNumber: {
    fontFamily: trainResultsFonts.medium,
    fontSize: 12,
    lineHeight: 15,
    fontWeight: '600',
  } satisfies TextStyle,
  time: {
    fontFamily: trainResultsFonts.bold,
    fontSize: 16,
    lineHeight: 20,
    letterSpacing: -0.2,
    fontWeight: '900',
  } satisfies TextStyle,
  body: {
    fontFamily: trainResultsFonts.medium,
    fontSize: 13,
    lineHeight: 17,
    fontWeight: '600',
  } satisfies TextStyle,
  caption: {
    fontFamily: trainResultsFonts.regular,
    fontSize: 12,
    lineHeight: 15,
    fontWeight: '500',
  } satisfies TextStyle,
  tiny: {
    fontFamily: trainResultsFonts.regular,
    fontSize: 10.5,
    lineHeight: 14,
    fontWeight: '500',
  } satisfies TextStyle,
} as const;

export const trainResultsShadow = {
  shadowColor: trainResultsPalette.shadowStrong,
  shadowOpacity: 1,
  shadowOffset: { width: 0, height: 4 },
  shadowRadius: 12,
  elevation: 4,
} satisfies ViewStyle;

function extractStatusCount(value: string) {
  const match = value.toUpperCase().match(/\b(?:GNWL|RLWL|PQWL|TQWL|WL|RAC)\s*(\d+)\b/);
  return match ? Number(match[1]) : null;
}

export function getAvailabilityTone(quotaLabel: string, badge?: string, status?: string) {
  const normalized = [quotaLabel, badge, status].filter(Boolean).join(' ').toUpperCase();
  const statusCount = extractStatusCount(normalized);

  if (normalized.includes('AVAILABLE') || normalized.includes('AVL')) {
    return {
      backgroundColor: trainResultsPalette.greenSoft,
      borderColor: '#BBF7D0',
      accentColor: trainResultsPalette.successGreen,
      badgeBackgroundColor: trainResultsPalette.primaryBlue,
      badgeTextColor: trainResultsPalette.surface,
    };
  }

  if (
    normalized.includes('NO CHANCE') ||
    normalized.includes('REGRET') ||
    (statusCount !== null && statusCount >= 50)
  ) {
    return {
      backgroundColor: '#FDE8E8',
      borderColor: '#FECACA',
      accentColor: '#DC2626',
      badgeBackgroundColor: '#DC2626',
      badgeTextColor: trainResultsPalette.surface,
    };
  }

  if (normalized.includes('WL') || normalized.includes('RAC')) {
    return {
      backgroundColor: '#FFF5EB',
      borderColor: '#FED7AA',
      accentColor: trainResultsPalette.warningOrange,
      badgeBackgroundColor: '#FDBA74',
      badgeTextColor: trainResultsPalette.textPrimary,
    };
  }

  if (badge?.toUpperCase().includes('TATKAL')) {
    return {
      backgroundColor: trainResultsPalette.amberSoft,
      borderColor: '#FCD34D',
      accentColor: trainResultsPalette.warningOrange,
      badgeBackgroundColor: trainResultsPalette.badgeYellow,
      badgeTextColor: trainResultsPalette.textPrimary,
    };
  }

  return {
    backgroundColor: '#EAECEF',
    borderColor: '#C9CED6',
    accentColor: trainResultsPalette.dullBlack,
    badgeBackgroundColor: trainResultsPalette.dullBlack,
    badgeTextColor: trainResultsPalette.surface,
  };
}
