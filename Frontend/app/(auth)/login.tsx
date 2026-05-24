import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';


import { ScreenShell } from '@/src/components/screen-shell';
import { useApp } from '@/src/context/app-context';
import { colors, radius, spacing, typography } from '@/src/theme/tokens';
import type { AuthProvider } from '@/src/types';

export default function LoginScreen() {
  const { requestOtp, verifyOtp, continueWithProvider, continueAsDemo } = useApp();

  const [email, setEmail] = useState('demo@gozy.app');
  const [code, setCode] = useState('202626');
  const [step, setStep] = useState<'email' | 'code'>('email');
  const [busyAction, setBusyAction] = useState<'request' | 'verify' | AuthProvider | null>(null);
  const [otpHint, setOtpHint] = useState('');

  const handleRequestOtp = async () => {
    if (!email.trim()) return;
    setBusyAction('request');
    try {
      const hint = await requestOtp(email.trim(), 'email');
      setOtpHint(hint);
      setStep('code');
    } finally {
      setBusyAction(null);
    }
  };

  const handleVerify = async () => {
    if (code.trim().length < 4) return;
    setBusyAction('verify');
    try {
      const nextSession = await verifyOtp(code.trim());
      router.replace(nextSession.user.name ? '/(tabs)' : '/(auth)/profile-setup');
    } finally {
      setBusyAction(null);
    }
  };

  const handleProvider = async (provider: AuthProvider) => {
    setBusyAction(provider);
    try {
      const nextSession = await continueWithProvider(provider, 'signin');
      router.replace(nextSession.user.name ? '/(tabs)' : '/(auth)/profile-setup');
    } finally {
      setBusyAction(null);
    }
  };

  const handleDemo = async () => {
    setBusyAction('verify');
    try {
      await continueAsDemo();
      router.replace('/(tabs)');
    } finally {
      setBusyAction(null);
    }
  };

  return (
    <ScreenShell contentContainerStyle={styles.content}>


      <View style={styles.header}>
        <View style={styles.brandBadge}>
          <Text style={styles.brandText}>GOZY SECURE</Text>
        </View>
        <Image
          contentFit="cover"
          source={{
            uri: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=1200&q=80',
          }}
          style={styles.heroImage}
        />
        <Text style={styles.headerTitle}>Create your account</Text>
        <Text style={styles.headerSubtitle}>
          Secure, passwordless entry using your preferred account channel.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardLabel}>CONTINUE WITH MAIL</Text>

        {step === 'email' ? (
          <View style={styles.formGroup}>
            <View style={styles.inputWrapper}>
              <MaterialCommunityIcons name="email-outline" size={20} color={colors.textLight} style={styles.inputIcon} />
              <TextInput
                autoCapitalize="none"
                keyboardType="email-address"
                onChangeText={setEmail}
                placeholder="you@example.com"
                placeholderTextColor={colors.textLight}
                style={styles.input}
                value={email}
              />
            </View>

            <Pressable
              disabled={busyAction !== null || !email.trim()}
              onPress={handleRequestOtp}
              style={[styles.primaryButton, (!email.trim() || busyAction !== null) && styles.disabledButton]}
            >
              <LinearGradient colors={['#172B4D', '#29446D']} style={styles.gradientButton}>
                {busyAction === 'request' ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <>
                    <Text style={styles.primaryButtonText}>Send One-Time Code</Text>
                    <MaterialCommunityIcons name="send" size={16} color="#FFFFFF" />
                  </>
                )}
              </LinearGradient>
            </Pressable>
          </View>
        ) : (
          <View style={styles.formGroup}>
            <View style={styles.infoBox}>
              <MaterialCommunityIcons name="email-fast-outline" size={20} color={colors.sky} />
              <View style={{ flex: 1 }}>
                <Text style={styles.infoTitle}>Verification Code Sent</Text>
                <Text style={styles.infoText}>
                  We sent a 6-digit code to <Text style={{ fontWeight: '700' }}>{email}</Text>. 
                  In local mock mode, use the default code <Text style={{ fontWeight: '800' }}>202626</Text>.
                </Text>
              </View>
            </View>

            <View style={styles.inputWrapper}>
              <MaterialCommunityIcons name="key-outline" size={20} color={colors.textLight} style={styles.inputIcon} />
              <TextInput
                keyboardType="number-pad"
                maxLength={6}
                onChangeText={setCode}
                placeholder="202626"
                placeholderTextColor={colors.textLight}
                style={styles.input}
                value={code}
              />
            </View>

            <View style={styles.actionRow}>
              <Pressable onPress={() => setStep('email')} style={styles.backButton}>
                <Text style={styles.backButtonText}>Change</Text>
              </Pressable>
              <Pressable
                disabled={busyAction !== null || code.trim().length < 4}
                onPress={handleVerify}
                style={[styles.verifyButton, (busyAction !== null || code.trim().length < 4) && styles.disabledButton]}
              >
                {busyAction === 'verify' ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Text style={styles.verifyButtonText}>Verify</Text>
                )}
              </Pressable>
            </View>
          </View>
        )}
      </View>

      <View style={styles.dividerRow}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>OR CONTINUE WITH</Text>
        <View style={styles.dividerLine} />
      </View>

      <View style={styles.providerStack}>
        <Pressable
          disabled={busyAction !== null}
          onPress={() => handleProvider('microsoft')}
          style={[styles.providerButton, styles.microsoftButton]}
        >
          {busyAction === 'microsoft' ? (
            <ActivityIndicator color="#000000" size="small" />
          ) : (
            <>
              <MaterialCommunityIcons name="microsoft-windows" size={20} color="#000000" />
              <Text style={styles.providerButtonText}>Continue with Microsoft</Text>
            </>
          )}
        </Pressable>

        <Pressable
          disabled={busyAction !== null}
          onPress={() => handleProvider('apple')}
          style={[styles.providerButton, styles.appleButton]}
        >
          {busyAction === 'apple' ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <>
              <MaterialCommunityIcons name="apple" size={22} color="#FFFFFF" />
              <Text style={[styles.providerButtonText, { color: '#FFFFFF' }]}>Continue with Apple</Text>
            </>
          )}
        </Pressable>
      </View>

      <View style={styles.footer}>
        <Pressable
          disabled={busyAction !== null}
          onPress={handleDemo}
          style={[styles.demoButton, busyAction !== null && styles.disabledButton]}
        >
          <MaterialCommunityIcons name="arrow-right-circle-outline" size={18} color={colors.sky} />
          <Text style={styles.demoButtonText}>Continue as demo user</Text>
        </Pressable>
        <Pressable onPress={() => router.back()} style={styles.backLink}>
          <Text style={styles.backLinkText}>Go back to Gateway</Text>
        </Pressable>
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxl,
    backgroundColor: '#F8FAFC',
  },
  header: {
    alignItems: 'center',
    gap: spacing.xxs,
    paddingHorizontal: spacing.lg,
    marginTop: spacing.sm,
  },
  brandBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: 5,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
  },
  brandText: {
    color: colors.sky,
    fontSize: typography.tiny,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  heroImage: {
    width: '100%',
    height: 150,
    borderRadius: radius.lg,
    marginTop: spacing.sm,
  },
  headerTitle: {
    color: colors.text,
    fontSize: 26,
    fontWeight: '900',
    marginTop: 12,
  },
  headerSubtitle: {
    color: colors.textMuted,
    fontSize: typography.body,
    textAlign: 'center',
    paddingHorizontal: spacing.lg,
  },
  card: {
    marginHorizontal: spacing.lg,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    padding: spacing.lg,
    gap: spacing.md,
    shadowColor: colors.shadow,
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  cardLabel: {
    color: colors.textMuted,
    fontSize: typography.tiny,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  formGroup: {
    gap: spacing.md,
  },
  inputWrapper: {
    height: 52,
    borderRadius: radius.md,
    backgroundColor: colors.canvasMuted,
    borderWidth: 1.5,
    borderColor: colors.line,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
  },
  inputIcon: {
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
    height: '100%',
    color: colors.text,
    fontSize: typography.body,
    fontWeight: '600',
  },
  primaryButton: {
    width: '100%',
    height: 52,
    borderRadius: radius.pill,
    overflow: 'hidden',
  },
  gradientButton: {
    width: '100%',
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: typography.body,
    fontWeight: '800',
  },
  disabledButton: {
    opacity: 0.55,
  },
  infoBox: {
    flexDirection: 'row',
    gap: spacing.sm,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceSoft,
    borderWidth: 1,
    borderColor: colors.line,
    padding: spacing.md,
    alignItems: 'flex-start',
  },
  infoTitle: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: '800',
    marginBottom: 2,
  },
  infoText: {
    color: colors.textMuted,
    fontSize: typography.caption,
    lineHeight: 18,
  },
  actionRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  backButton: {
    flex: 1,
    height: 52,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    borderColor: colors.lineStrong,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: '700',
  },
  verifyButton: {
    flex: 2,
    height: 52,
    borderRadius: radius.pill,
    backgroundColor: colors.sky,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifyButtonText: {
    color: '#FFFFFF',
    fontSize: typography.body,
    fontWeight: '800',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.line,
  },
  dividerText: {
    color: colors.textLight,
    fontSize: typography.tiny,
    fontWeight: '800',
    letterSpacing: 1,
  },
  providerStack: {
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  providerButton: {
    height: 52,
    borderRadius: radius.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    borderWidth: 1.5,
    shadowColor: colors.shadow,
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  microsoftButton: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
  },
  appleButton: {
    backgroundColor: '#000000',
    borderColor: '#000000',
  },
  providerButtonText: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: '700',
  },
  footer: {
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    marginTop: spacing.sm,
  },
  demoButton: {
    width: '100%',
    height: 52,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceSoft,
    borderWidth: 1.5,
    borderColor: colors.line,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  demoButtonText: {
    color: colors.sky,
    fontSize: typography.body,
    fontWeight: '800',
  },
  backLink: {
    paddingVertical: 4,
  },
  backLinkText: {
    color: colors.textMuted,
    fontSize: typography.body,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
});
