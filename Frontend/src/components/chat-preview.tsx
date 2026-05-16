import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';

import { colors, radius, spacing, typography } from '@/src/theme/tokens';
import type { Conversation } from '@/src/types';

type ChatPreviewProps = {
  conversation: Conversation;
  selected?: boolean;
  onPress: () => void;
};

export function ChatPreview({ conversation, selected = false, onPress }: ChatPreviewProps) {
  return (
    <Pressable onPress={onPress} style={[styles.row, selected && styles.selected]}>
      <View>
        <Image source={conversation.avatar} style={styles.avatar} />
        <View
          style={[
            styles.onlineDot,
            { backgroundColor: conversation.online ? colors.success : colors.textMuted },
          ]}
        />
      </View>
      <View style={styles.copy}>
        <View style={styles.titleRow}>
          <Text style={styles.name}>{conversation.participantName}</Text>
          <Text style={styles.meta}>{conversation.lastActive}</Text>
        </View>
        <Text numberOfLines={1} style={styles.destination}>
          {conversation.destination}
        </Text>
        <Text numberOfLines={1} style={styles.message}>
          {conversation.typing ? 'typing...' : conversation.lastMessage}
        </Text>
      </View>
      {conversation.unreadCount > 0 ? (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{conversation.unreadCount}</Text>
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderRadius: radius.md,
    padding: spacing.md,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: colors.line,
  },
  selected: {
    backgroundColor: colors.surfaceSoft,
    borderColor: colors.lineStrong,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceElevated,
  },
  onlineDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: radius.pill,
    borderWidth: 2,
    borderColor: colors.canvas,
  },
  copy: {
    flex: 1,
    gap: 3,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  name: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: '700',
  },
  meta: {
    color: colors.textMuted,
    fontSize: typography.caption,
  },
  destination: {
    color: colors.aqua,
    fontSize: typography.caption,
    fontWeight: '600',
  },
  message: {
    color: colors.textMuted,
    fontSize: typography.body,
  },
  badge: {
    minWidth: 24,
    height: 24,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
    backgroundColor: colors.sky,
  },
  badgeText: {
    color: colors.text,
    fontWeight: '700',
    fontSize: typography.caption,
  },
});
