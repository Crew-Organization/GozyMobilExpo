import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';

import { ScreenShell } from '@/src/components/screen-shell';
import { TopBar } from '@/src/components/top-bar';
import { useApp } from '@/src/context/app-context';
import { colors, radius, spacing, typography } from '@/src/theme/tokens';

export default function NotificationsScreen() {
  const { notifications, markNotificationRead } = useApp();

  return (
    <ScreenShell>
      <TopBar
        eyebrow="Notifications"
        primaryAction={{ icon: 'arrow-left', onPress: () => router.back() }}
        subtitle="Realtime chat alerts, booking updates, and recommendation nudges."
        title="Inbox updates"
      />

      {notifications.map((notification) => (
        <Pressable
          key={notification.id}
          onPress={() => void markNotificationRead(notification.id)}
          style={[styles.card, notification.read && styles.readCard]}>
          <View style={styles.row}>
            <Text style={styles.title}>{notification.title}</Text>
            <Text style={styles.time}>{notification.createdAt.slice(11, 16)}</Text>
          </View>
          <Text style={styles.body}>{notification.body}</Text>
        </Pressable>
      ))}
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  readCard: {
    opacity: 0.7,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  title: {
    flex: 1,
    color: colors.text,
    fontSize: typography.body,
    fontWeight: '800',
  },
  time: {
    color: colors.textMuted,
    fontSize: typography.caption,
  },
  body: {
    color: colors.textMuted,
    fontSize: typography.body,
    lineHeight: 21,
  },
});
