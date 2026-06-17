export const colors = {
  // Brand
  sky: '#172B4D',
  aqua: '#29446D',
  mint: '#405B84',
  coral: '#5B7194',
  amber: '#7D8EAA',

  // Canvas & Surfaces
  canvas: '#F0F4F8', // Powder blue background
  canvasMuted: '#E2E8F0',
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',
  surfaceSoft: '#F8FAFC',
  surfaceAccent: '#EEF2F7',

  // UI Elements
  line: '#E7ECF2',
  lineStrong: '#D6DDE7',
  text: '#111827',
  textMuted: '#667085',
  textLight: '#98A2B3',

  // Status
  success: '#10B981',
  danger: '#EF4444',
  warning: '#F59E0B',

  // Specialties
  shadow: 'rgba(17, 24, 39, 0.08)',
  white: '#FFFFFF',
  black: '#000000',
  background: '#FFFFFF',
  warningLight: '#FEF3C7',
  textSecondary: '#4B5563',
};

export const gradients = {
  app: ['#FFFFFF', '#FFFFFF'] as const,
  hero: ['rgba(23, 43, 77, 0.01)', 'rgba(23, 43, 77, 0.06)'] as const,
  card: ['#FFFFFF', '#F8FAFC'] as const,
  sky: ['#27416D', '#172B4D'] as const,
  aqua: ['#405B84', '#29446D'] as const,
  premium: ['#172B4D', '#405B84'] as const,
};

export const spacing = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const radius = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  pill: 999,
};

export const typography = {
  hero: 32,
  title: 24,
  section: 20,
  body: 16,
  bodySmall: 14,
  caption: 13,
  small: 12,
  tiny: 11,
};

export const shadow = {
  sm: {
    shadowColor: 'rgba(17, 24, 39, 0.08)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: 'rgba(17, 24, 39, 0.08)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: 'rgba(17, 24, 39, 0.08)',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 8,
  },
};

