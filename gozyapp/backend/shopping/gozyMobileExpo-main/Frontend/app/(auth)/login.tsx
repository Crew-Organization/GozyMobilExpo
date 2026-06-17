import { useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Image } from 'expo-image';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { AuthProgress } from '@/src/components/auth-progress';
import { ScreenShell } from '@/src/components/screen-shell';
import { useApp } from '@/src/context/app-context';
import { colors, radius, spacing, typography } from '@/src/theme/tokens';
import type { AuthChannel, AuthProvider } from '@/src/types';

const providers: {
  provider: AuthProvider;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  label: string;
}[] = [
  { provider: 'google', icon: 'google', label: 'Google' },
  { provider: 'microsoft', icon: 'microsoft-windows', label: 'Microsoft' },
  { provider: 'apple', icon: 'apple', label: 'Apple' },
];

function readParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default function LoginScreen() {
  const params = useLocalSearchParams<{ mode?: string | string[]; method?: string | string[] }>();
  const initialMode = readParam(params.mode) === 'signup' ? 'signup' : 'signin';
  const initialChannel = readParam(params.method) === 'phone' ? 'phone' : 'email';
  const { requestOtp, verifyOtp, continueAsDemo, continueWithProvider } = useApp();

  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const [channel, setChannel] = useState<AuthChannel>(initialChannel);
  const [email, setEmail] = useState('demo@gozy.app');
  const [phone, setPhone] = useState('+91 9876543210');
  const [code, setCode] = useState('202626');
  const [otpHint, setOtpHint] = useState('');
  const [requestedIdentifier, setRequestedIdentifier] = useState<string | null>(null);
  const [requestedChannel, setRequestedChannel] = useState<AuthChannel | null>(null);
  const [busyAction, setBusyAction] = useState<'request' | 'verify' | AuthProvider | null>(null);

  const identifier = channel === 'email' ? email.trim() : phone.trim();
  const sentState = requestedIdentifier === identifier && requestedChannel === channel;

  const sentTitle = channel === 'email' ? 'Check your email' : 'Check your messages';
  const sentFallback =
    channel === 'email'
      ? `We sent a secure 6-digit code to ${identifier}. Check inbox and spam.`
      : `We sent a secure 6-digit code to ${identifier}. Check SMS or WhatsApp.`;

  const primaryCopy = useMemo(
    () =>
      mode === 'signin'
        ? 'Sign back in without passwords.'
        : 'Create your account with a simple one-time code.',
    [mode],
  );

  const handleRequestOtp = async () => {
    if (!identifier) {
      return;
    }

    setBusyAction('request');

    try {
      const hint = await requestOtp(identifier, channel);
      setRequestedIdentifier(identifier);
      setRequestedChannel(channel);
      setOtpHint(hint);
    } finally {
      setBusyAction(null);
    }
  };

  const handleVerify = async () => {
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
      const nextSession = await continueWithProvider(provider, mode);
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
      <AuthProgress currentStep={2} />

      <View style={styles.heroCard}>
        <View style={styles.heroCopy}>
          <Text style={styles.eyebrow}>Passwordless access</Text>
          <Text style={styles.title}>{primaryCopy}</Text>
          <Text style={styles.subtitle}>
            Use email, phone, or a provider sign-in. Your Gozy account stays connected to one clean profile.
          </Text>
        </View>
        <Image
          contentFit="cover"
          source={{
            uri: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=1200&q=80',
          }}
          style={styles.heroImage}
        />
      </View>

      <View style={styles.panel}>
        <Text style={styles.panelLabel}>Account mode</Text>
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

        <Text style={styles.panelLabel}>Verification method</Text>
        <View style={styles.inlineOptions}>
          <Pressable
            onPress={() => setChannel('email')}
            style={[styles.inlineButton, channel === 'email' && styles.inlineButtonActive]}>
            <MaterialCommunityIcons
              color={channel === 'email' ? '#FFFFFF' : colors.sky}
              name="email-outline"
              size={18}
            />
            <Text
              style={[
                styles.inlineButtonText,
                channel === 'email' && styles.inlineButtonTextActive,
              ]}>
              Email
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setChannel('phone')}
            style={[styles.inlineButton, channel === 'phone' && styles.inlineButtonActive]}>
            <MaterialCommunityIcons
              color={channel === 'phone' ? '#FFFFFF' : colors.sky}
              name="phone-outline"
              size={18}
            />
            <Text
              style={[
                styles.inlineButtonText,
                channel === 'phone' && styles.inlineButtonTextActive,
              ]}>
              Phone number
            </Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.formCard}>
        <Text style={styles.fieldLabel}>{channel === 'email' ? 'Email address' : 'Phone number'}</Text>
        <TextInput
          autoCapitalize="none"
          keyboardType={channel === 'email' ? 'email-address' : 'phone-pad'}
          onChangeText={channel === 'email' ? setEmail : setPhone}
          placeholder={channel === 'email' ? 'you@gozy.app' : '+91 9876543210'}
          placeholderTextColor={colors.textLight}
          style={styles.input}
          value={channel === 'email' ? email : phone}
        />

        <Pressable
          disabled={busyAction !== null || !identifier}
          onPress={handleRequestOtp}
          style={[styles.secondaryButton, (!identifier || busyAction !== null) && styles.disabled]}>
          <Text style={styles.secondaryButtonText}>
            {busyAction === 'request' ? 'Sending code...' : sentState ? 'Send again' : 'Send code'}
          </Text>
        </Pressable>

        <View style={styles.noticeCard}>
          <MaterialCommunityIcons
            color={colors.sky}
            name={channel === 'email' ? 'email-fast-outline' : 'message-processing-outline'}
            size={18}
          />
          <View style={styles.noticeCopy}>
            <Text style={styles.noticeTitle}>{sentState ? sentTitle : 'Check delivery details'}</Text>
            <Text style={styles.noticeBody}>
              {sentState
                ? otpHint || sentFallback
                : channel === 'email'
                  ? 'We will send a one-time code to your inbox. In local mode, the default code is 202626. If you change the email, send a fresh code.'
                  : 'We will send a one-time code to your phone. In local mode, the default code is 202626. If you change the number, send a fresh code.'}
            </Text>
          </View>
        </View>

        <Text style={styles.fieldLabel}>One-time code</Text>
        <TextInput
          keyboardType="number-pad"
          maxLength={6}
          onChangeText={setCode}
          placeholder="202626"
          placeholderTextColor={colors.textLight}
          style={styles.input}
          value={code}
        />

        <Pressable
          disabled={busyAction !== null || !sentState || code.trim().length < 4}
          onPress={handleVerify}
          style={[styles.primaryButton, (busyAction !== null || !sentState || code.trim().length < 4) && styles.disabled]}>
          {busyAction === 'verify' ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <Text style={styles.primaryButtonText}>
              {mode === 'signin' ? 'Sign in to Gozy' : 'Create your Gozy account'}
            </Text>
          )}
        </Pressable>
      </View>

      <View style={styles.panel}>
        <Text style={styles.sectionTitle}>Other ways to continue</Text>
        <View style={styles.providerRow}>
          {providers.map((item) => {
            const busy = busyAction === item.provider;

            return (
              <Pressable
                disabled={busyAction !== null}
                key={item.provider}
                onPress={() => handleProvider(item.provider)}
                style={styles.providerButton}>
                {busy ? (
                  <ActivityIndicator color={colors.sky} size="small" />
                ) : (
                  <MaterialCommunityIcons color={colors.text} name={item.icon} size={20} />
                )}
                <Text style={styles.providerText}>{item.label}</Text>
              </Pressable>
            );
          })}
        </View>
        <Pressable
          disabled={busyAction !== null}
          onPress={handleDemo}
          style={[styles.demoButton, busyAction !== null && styles.disabled]}>
          <MaterialCommunityIcons color={colors.sky} name="arrow-right-circle-outline" size={18} />
          <Text style={styles.demoButtonText}>Continue as demo user</Text>
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
  },
  heroCard: {
    borderRadius: radius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface,
  },
  heroCopy: {
    padding: spacing.lg,
    gap: spacing.sm,
  },
  heroImage: {
    width: '100%',
    height: 150,
  },
  eyebrow: {
    color: colors.sky,
    fontSize: typography.caption,
    fontWeight: '800',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '900',
    lineHeight: 34,
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: typography.body,
    lineHeight: 22,
  },
  panel: {
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    padding: spacing.lg,
    gap: spacing.md,
  },
  panelLabel: {
    color: colors.textMuted,
    fontSize: typography.caption,
    fontWeight: '800',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
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
    height: 44,
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
  inlineOptions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  inlineButton: {
    flex: 1,
    minHeight: 48,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceSoft,
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    flexDirection: 'row',
    paddingHorizontal: spacing.sm,
  },
  inlineButtonActive: {
    backgroundColor: colors.sky,
    borderColor: colors.sky,
  },
  inlineButtonText: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: '700',
  },
  inlineButtonTextActive: {
    color: '#FFFFFF',
  },
  formCard: {
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    padding: spacing.lg,
    gap: spacing.md,
  },
  fieldLabel: {
    color: colors.text,
    fontSize: typography.caption,
    fontWeight: '800',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  input: {
    height: 52,
    borderRadius: radius.md,
    backgroundColor: colors.canvasMuted,
    borderWidth: 1,
    borderColor: colors.line,
    paddingHorizontal: spacing.md,
    color: colors.text,
    fontSize: typography.body,
  },
  secondaryButton: {
    height: 50,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.lineStrong,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
  },
  secondaryButtonText: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: '700',
  },
  noticeCard: {
    flexDirection: 'row',
    gap: spacing.sm,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceSoft,
    borderWidth: 1,
    borderColor: colors.line,
    padding: spacing.md,
    alignItems: 'flex-start',
  },
  noticeCopy: {
    flex: 1,
    gap: 2,
  },
  noticeTitle: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: '800',
  },
  noticeBody: {
    color: colors.textMuted,
    fontSize: typography.caption,
    lineHeight: 18,
  },
  primaryButton: {
    height: 52,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.sky,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: typography.body,
    fontWeight: '800',
  },
  disabled: {
    opacity: 0.5,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: '800',
  },
  providerRow: {
    gap: spacing.sm,
  },
  providerButton: {
    minHeight: 50,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  providerText: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: '700',
  },
  demoButton: {
    minHeight: 50,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceSoft,
    borderWidth: 1,
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
});
