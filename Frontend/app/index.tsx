import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { Redirect } from 'expo-router';
import { useEffect } from 'react';

import { ScreenShell } from '@/src/components/screen-shell';
import { useApp } from '@/src/context/app-context';
import { colors, spacing, typography } from '@/src/theme/tokens';

export default function Index() {
  const { session, onboarded, isHydrating } = useApp();

  if (!isHydrating) {
    if (session && onboarded) {
      return <Redirect href="/(tabs)" />;
    }
    return <Redirect href="/(auth)/welcome" />;
  }

  return (
    <ScreenShell contentContainerStyle={styles.content}>
      <View style={styles.center}>
        <ActivityIndicator color={colors.aqua} size="large" />
        <Text style={styles.title}>Loading your Gozy flow</Text>
        <Text style={styles.subtitle}>Travel, food, shopping, and entertainment are syncing.</Text>
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  center: {
    alignItems: 'center',
    gap: spacing.md,
  },
  title: {
    color: colors.text,
    fontSize: typography.section,
    fontWeight: '800',
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: typography.body,
    textAlign: 'center',
    lineHeight: 21,
  },
});
