import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { AuthProgress } from '@/src/components/auth-progress';
import { ScreenShell } from '@/src/components/screen-shell';
import { useApp } from '@/src/context/app-context';
import { colors, radius, spacing, typography } from '@/src/theme/tokens';
import type { AuthProvider } from '@/src/types';

const benefits = [
  { icon: 'robot-outline', title: 'AI ready' },
  { icon: 'message-processing-outline', title: 'Chat synced' },
  { icon: 'wallet-outline', title: 'Wallet safe' },
] as const;

const detailCards = [
  {
    icon: 'shield-check-outline' as const,
    title: 'Private access',
    body: 'One account for chats, payments, saved items, and AI help.',
  },
  {
    icon: 'flash-outline' as const,
    title: 'Faster entry',
    body: 'Use Google, Microsoft, Apple, phone number, or email.',
  },
  {
    icon: 'devices' as const,
    title: 'Clean setup',
    body: 'Start in seconds and finish your profile after sign in.',
  },
] as const;

const snapshotCards = [
  {
    icon: 'robot-outline' as const,
    label: 'AI companion',
    meta: 'Plans, suggestions, reminders',
  },
  {
    icon: 'wallet-plus-outline' as const,
    label: 'Secure wallet',
    meta: 'Balance, cashback, activity',
  },
  {
    icon: 'message-text-outline' as const,
    label: 'Social inbox',
    meta: 'Friends, partners, updates',
  },
] as const;

const providers: {
  provider: AuthProvider;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  label: string;
  sublabel: string;
}[] = [
  {
    provider: 'google',
    icon: 'google',
    label: 'Continue with Google',
    sublabel: 'Fastest for most users',
  },
  {
    provider: 'microsoft',
    icon: 'microsoft-windows',
    label: 'Continue with Microsoft',
    sublabel: 'Best for work accounts',
  },
  {
    provider: 'apple',
    icon: 'apple',
    label: 'Continue with Apple',
    sublabel: 'Private sign in on Apple devices',
  },
];

export default function WelcomeScreen() {
  const { continueAsDemo, continueWithProvider } = useApp();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [busyProvider, setBusyProvider] = useState<AuthProvider | null>(null);
  const [busyDemo, setBusyDemo] = useState(false);

  const handleProvider = async (provider: AuthProvider) => {
    setBusyProvider(provider);

    try {
      const nextSession = await continueWithProvider(provider, mode);
      router.replace(nextSession.user.name ? '/(tabs)' : '/(auth)/profile-setup');
    } finally {
      setBusyProvider(null);
    }
  };

  const handleOtpRoute = (method: 'phone' | 'email') => {
    router.push({
      pathname: '/(auth)/login',
      params: { mode, method },
    });
  };

  const handleDemo = async () => {
    setBusyDemo(true);

    try {
      await continueAsDemo();
      router.replace('/(tabs)');
    } finally {
      setBusyDemo(false);
    }
  };

  return (
    <ScreenShell contentContainerStyle={styles.content}>
      <AuthProgress currentStep={1} />

      <View style={styles.heroCard}>
        <Image
          contentFit="cover"
          source={{
            uri: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1400&q=80',
          }}
          style={styles.heroImage}
        />
        <LinearGradient colors={['rgba(23,43,77,0.1)', 'rgba(23,43,77,0.78)']} style={styles.heroOverlay} />

        <View style={styles.heroTopRow}>
          <View style={styles.logoBadge}>
            <Text style={styles.logoBadgeText}>GOZY</Text>
          </View>
          <View style={styles.heroPill}>
            <MaterialCommunityIcons color="#FFFFFF" name="shield-lock-outline" size={14} />
            <Text style={styles.heroPillText}>Secure access</Text>
          </View>
        </View>

        <View style={styles.heroContent}>
          <Text style={styles.heroTitle}>One elegant sign in for everything inside Gozy.</Text>
          <Text style={styles.heroBody}>
            Enter once and keep your chats, wallet, bookings, saved picks, and AI assistance connected in one place.
          </Text>

          <View style={styles.benefitRow}>
            {benefits.map((benefit) => (
              <View key={benefit.title} style={styles.benefitChip}>
                <MaterialCommunityIcons color="#FFFFFF" name={benefit.icon} size={15} />
                <Text style={styles.benefitLabel}>{benefit.title}</Text>
              </View>
            ))}
          </View>

          <View style={styles.heroStatsRow}>
            <View style={styles.heroStatCard}>
              <Text style={styles.heroStatValue}>5 ways</Text>
              <Text style={styles.heroStatLabel}>Google, Microsoft, Apple, phone, email</Text>
            </View>
            <View style={styles.heroStatCard}>
              <Text style={styles.heroStatValue}>1 profile</Text>
              <Text style={styles.heroStatLabel}>Wallet, AI, chat, saved activity</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.snapshotRow}>
        {snapshotCards.map((card) => (
          <View key={card.label} style={styles.snapshotCard}>
            <View style={styles.snapshotIcon}>
              <MaterialCommunityIcons color={colors.sky} name={card.icon} size={18} />
            </View>
            <Text style={styles.snapshotLabel}>{card.label}</Text>
            <Text style={styles.snapshotMeta}>{card.meta}</Text>
          </View>
        ))}
      </View>

      <View style={styles.panel}>
        <View style={styles.panelHeader}>
          <View>
            <Text style={styles.panelLabel}>Account mode</Text>
            <Text style={styles.panelTitle}>
              {mode === 'signin' ? 'Welcome back' : 'Create your account'}
            </Text>
          </View>
          <View style={styles.panelTag}>
            <Text style={styles.panelTagText}>
              {mode === 'signin' ? 'Returning user' : 'New to Gozy'}
            </Text>
          </View>
        </View>

        <View style={styles.segmented}>
          <Pressable
            onPress={() => setMode('signin')}
            style={[styles.segment, mode === 'signin' && styles.segmentActive]}>
            <Text style={[styles.segmentText, mode === 'signin' && styles.segmentTextActive]}>
              Sign in
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setMode('signup')}
            style={[styles.segment, mode === 'signup' && styles.segmentActive]}>
            <Text style={[styles.segmentText, mode === 'signup' && styles.segmentTextActive]}>
              Create account
            </Text>
          </Pressable>
        </View>

        <Text style={styles.sectionTitle}>Continue instantly</Text>
        <View style={styles.stack}>
          {providers.map((item) => {
            const busy = busyProvider === item.provider;

            return (
              <Pressable
                disabled={Boolean(busyProvider) || busyDemo}
                key={item.provider}
                onPress={() => handleProvider(item.provider)}
                style={styles.authButton}>
                <View style={styles.authButtonLeft}>
                  <View style={styles.authIconWrap}>
                    {busy ? (
                      <ActivityIndicator color={colors.sky} size="small" />
                    ) : (
                      <MaterialCommunityIcons color={colors.text} name={item.icon} size={19} />
                    )}
                  </View>
                  <View style={styles.authCopy}>
                    <Text style={styles.authButtonText}>
                      {busy ? 'Continuing...' : item.label}
                    </Text>
                    <Text style={styles.authButtonSubtext}>{item.sublabel}</Text>
                  </View>
                </View>
                <MaterialCommunityIcons color={colors.textLight} name="chevron-right" size={18} />
              </Pressable>
            );
          })}
        </View>

        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or continue with a one-time code</Text>
          <View style={styles.dividerLine} />
        </View>

        <View style={styles.inlineOptions}>
          <Pressable onPress={() => handleOtpRoute('phone')} style={styles.inlineButton}>
            <View style={styles.inlineIconWrap}>
              <MaterialCommunityIcons color={colors.sky} name="phone-outline" size={18} />
            </View>
            <View style={styles.inlineCopy}>
              <Text style={styles.inlineButtonTitle}>Phone number</Text>
              <Text style={styles.inlineButtonMeta}>SMS or WhatsApp code</Text>
            </View>
          </Pressable>

          <Pressable onPress={() => handleOtpRoute('email')} style={styles.inlineButton}>
            <View style={styles.inlineIconWrap}>
              <MaterialCommunityIcons color={colors.sky} name="email-outline" size={18} />
            </View>
            <View style={styles.inlineCopy}>
              <Text style={styles.inlineButtonTitle}>Email</Text>
              <Text style={styles.inlineButtonMeta}>Inbox verification code</Text>
            </View>
          </Pressable>
        </View>

        <Text style={styles.helper}>
          Choose any option above. If you use phone or email, Gozy sends a secure one-time code on the next screen.
        </Text>

        <Pressable
          disabled={busyDemo || Boolean(busyProvider)}
          onPress={handleDemo}
          style={[styles.demoButton, (busyDemo || Boolean(busyProvider)) && styles.disabledButton]}>
          {busyDemo ? (
            <ActivityIndicator color={colors.sky} size="small" />
          ) : (
            <>
              <MaterialCommunityIcons color={colors.sky} name="arrow-right-circle-outline" size={18} />
              <Text style={styles.demoButtonText}>Continue as demo user</Text>
            </>
          )}
        </Pressable>
      </View>

      <View style={styles.detailGrid}>
        {detailCards.map((card) => (
          <View key={card.title} style={styles.detailCard}>
            <View style={styles.detailIcon}>
              <MaterialCommunityIcons color={colors.sky} name={card.icon} size={18} />
            </View>
            <Text style={styles.detailTitle}>{card.title}</Text>
            <Text style={styles.detailBody}>{card.body}</Text>
          </View>
        ))}
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  heroCard: {
    minHeight: 410,
    borderRadius: radius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface,
    shadowColor: colors.shadow,
    shadowOpacity: 1,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 12 },
    elevation: 6,
  },
  heroImage: {
    ...StyleSheet.absoluteFillObject,
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  heroTopRow: {
    position: 'absolute',
    top: spacing.lg,
    left: spacing.lg,
    right: spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 2,
  },
  logoBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.16)',
  },
  logoBadgeText: {
    color: '#FFFFFF',
    fontSize: typography.caption,
    fontWeight: '800',
    letterSpacing: 2,
  },
  heroPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: 8,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
  },
  heroPillText: {
    color: '#FFFFFF',
    fontSize: typography.tiny,
    fontWeight: '700',
  },
  heroContent: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: spacing.xl,
    gap: spacing.md,
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '900',
    lineHeight: 38,
    maxWidth: 290,
  },
  heroBody: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: typography.body,
    lineHeight: 22,
    maxWidth: 310,
  },
  benefitRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  benefitChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  benefitLabel: {
    color: '#FFFFFF',
    fontSize: typography.caption,
    fontWeight: '700',
  },
  heroStatsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  heroStatCard: {
    flex: 1,
    borderRadius: radius.md,
    padding: spacing.md,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
  },
  heroStatValue: {
    color: '#FFFFFF',
    fontSize: typography.body,
    fontWeight: '900',
  },
  heroStatLabel: {
    color: 'rgba(255,255,255,0.82)',
    fontSize: typography.caption,
    lineHeight: 18,
    marginTop: 4,
  },
  snapshotRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  snapshotCard: {
    flex: 1,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    padding: spacing.md,
    gap: spacing.xs,
    shadowColor: colors.shadow,
    shadowOpacity: 0.6,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  snapshotIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: colors.surfaceSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  snapshotLabel: {
    color: colors.text,
    fontSize: typography.caption,
    fontWeight: '800',
  },
  snapshotMeta: {
    color: colors.textMuted,
    fontSize: typography.tiny,
    lineHeight: 16,
  },
  panel: {
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    padding: spacing.lg,
    gap: spacing.md,
    shadowColor: colors.shadow,
    shadowOpacity: 0.65,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 4,
  },
  panelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  panelLabel: {
    color: colors.textMuted,
    fontSize: typography.caption,
    fontWeight: '800',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  panelTitle: {
    color: colors.text,
    fontSize: typography.section,
    fontWeight: '900',
    marginTop: 2,
  },
  panelTag: {
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 8,
    backgroundColor: colors.surfaceSoft,
    borderWidth: 1,
    borderColor: colors.line,
  },
  panelTagText: {
    color: colors.sky,
    fontSize: typography.tiny,
    fontWeight: '800',
  },
  segmented: {
    flexDirection: 'row',
    borderRadius: radius.pill,
    backgroundColor: colors.canvasMuted,
    padding: 4,
    gap: 4,
  },
  segment: {
    flex: 1,
    height: 46,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentActive: {
    backgroundColor: colors.sky,
  },
  segmentText: {
    color: colors.textMuted,
    fontSize: typography.body,
    fontWeight: '700',
  },
  segmentTextActive: {
    color: '#FFFFFF',
  },
  sectionTitle: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: '800',
  },
  stack: {
    gap: spacing.sm,
  },
  authButton: {
    minHeight: 64,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  authButtonLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
  },
  authIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: colors.surfaceSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  authCopy: {
    flex: 1,
    gap: 2,
  },
  authButtonText: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: '800',
  },
  authButtonSubtext: {
    color: colors.textMuted,
    fontSize: typography.caption,
    lineHeight: 18,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.line,
  },
  dividerText: {
    color: colors.textLight,
    fontSize: typography.caption,
    fontWeight: '700',
  },
  inlineOptions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  inlineButton: {
    flex: 1,
    minHeight: 88,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceSoft,
    borderWidth: 1,
    borderColor: colors.line,
    padding: spacing.md,
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  inlineIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.line,
  },
  inlineCopy: {
    gap: 4,
  },
  inlineButtonTitle: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: '800',
  },
  inlineButtonMeta: {
    color: colors.textMuted,
    fontSize: typography.caption,
    lineHeight: 18,
  },
  helper: {
    color: colors.textMuted,
    fontSize: typography.caption,
    lineHeight: 18,
  },
  demoButton: {
    minHeight: 52,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.lineStrong,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  demoButtonText: {
    color: colors.sky,
    fontSize: typography.body,
    fontWeight: '800',
  },
  disabledButton: {
    opacity: 0.55,
  },
  detailGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  detailCard: {
    width: '47%',
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    padding: spacing.md,
    gap: spacing.xs,
  },
  detailIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: colors.surfaceSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailTitle: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: '800',
  },
  detailBody: {
    color: colors.textMuted,
    fontSize: typography.caption,
    lineHeight: 18,
  },
});
