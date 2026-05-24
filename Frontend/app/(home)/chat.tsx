import { useDeferredValue, useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { ChatPreview } from '@/src/components/chat-preview';
import { ScreenShell } from '@/src/components/screen-shell';
import { TopBar } from '@/src/components/top-bar';
import { useApp } from '@/src/context/app-context';
import { colors, radius, spacing, typography } from '@/src/theme/tokens';

export default function ChatScreen() {
  const { conversations, sections, markConversationRead, sendChatMessage, session } = useApp();
  const [search, setSearch] = useState('');
  const deferredSearch = useDeferredValue(search);
  const filteredConversations = useMemo(
    () =>
      conversations.filter((conversation) =>
        `${conversation.participantName} ${conversation.destination}`
          .toLowerCase()
          .includes(deferredSearch.trim().toLowerCase()),
      ),
    [conversations, deferredSearch],
  );
  const [selectedId, setSelectedId] = useState(filteredConversations[0]?.id ?? conversations[0]?.id ?? '');
  const [message, setMessage] = useState('');
  const socialSection = sections.find((section) => section.kind === 'social');

  const activeConversation =
    filteredConversations.find((conversation) => conversation.id === selectedId) ?? filteredConversations[0];

  const handleSelect = (conversationId: string) => {
    setSelectedId(conversationId);
    markConversationRead(conversationId);
  };

  const handleSend = async () => {
    if (!activeConversation || !message.trim()) {
      return;
    }

    const nextMessage = message;
    setMessage('');
    await sendChatMessage(activeConversation.id, nextMessage);
  };

  return (
    <ScreenShell scroll={false} style={styles.flex}>
      <TopBar
        eyebrow="Realtime chat"
        subtitle="Socket-ready one-to-one messaging for travel planning and social coordination."
        title="Inbox"
      />

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}>
        <View style={styles.searchCard}>
          <MaterialCommunityIcons color={colors.textMuted} name="magnify" size={18} />
          <TextInput
            onChangeText={setSearch}
            placeholder="Search chats or destinations"
            placeholderTextColor={colors.textMuted}
            style={styles.searchInput}
            value={search}
          />
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.previewList}>
          {filteredConversations.map((conversation) => (
            <View key={conversation.id} style={styles.previewWrap}>
              <ChatPreview
                conversation={conversation}
                onPress={() => handleSelect(conversation.id)}
                selected={activeConversation?.id === conversation.id}
              />
            </View>
          ))}
        </ScrollView>

        {socialSection ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.modeList}>
            {socialSection.actions.map((action) => (
              <View key={action.id} style={styles.modeCard}>
                <Text style={styles.modeTitle}>{action.label}</Text>
                <Text style={styles.modeCaption}>{action.caption}</Text>
                {action.badge ? <Text style={styles.modeBadge}>{action.badge}</Text> : null}
              </View>
            ))}
          </ScrollView>
        ) : null}

        {activeConversation ? (
          <View style={styles.threadCard}>
            <View style={styles.threadHeader}>
              <View>
                <Text style={styles.threadName}>{activeConversation.participantName}</Text>
                <Text style={styles.threadMeta}>{activeConversation.destination}</Text>
              </View>
              <Text style={styles.threadMeta}>{activeConversation.online ? 'Online now' : activeConversation.lastActive}</Text>
            </View>

            <ScrollView contentContainerStyle={styles.messages} showsVerticalScrollIndicator={false}>
              {activeConversation.messages.map((chatMessage) => {
                const isSelf = chatMessage.senderId === session?.user.id;
                return (
                  <View key={chatMessage.id} style={[styles.messageBubble, isSelf ? styles.selfBubble : styles.peerBubble]}>
                    <Text style={[styles.messageText, isSelf && styles.selfText]}>{chatMessage.text}</Text>
                  </View>
                );
              })}
              {activeConversation.typing ? <Text style={styles.typing}>Typing a fresh update...</Text> : null}
            </ScrollView>

            <View style={styles.composer}>
              <TextInput
                multiline
                onChangeText={setMessage}
                placeholder="Send a quick plan, location, or budget note"
                placeholderTextColor={colors.textMuted}
                style={styles.composerInput}
                value={message}
              />
              <Pressable onPress={handleSend} style={styles.sendButton}>
                <MaterialCommunityIcons color={colors.text} name="send" size={18} />
              </Pressable>
            </View>
          </View>
        ) : null}
      </KeyboardAvoidingView>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  searchCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    paddingHorizontal: spacing.md,
    height: 48,
  },
  searchInput: {
    flex: 1,
    color: colors.text,
    fontSize: typography.body,
  },
  previewList: {
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  previewWrap: {
    width: 300,
  },
  modeList: {
    gap: spacing.sm,
    paddingBottom: spacing.md,
  },
  modeCard: {
    width: 136,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceSoft,
    borderWidth: 1,
    borderColor: colors.line,
    padding: spacing.md,
    gap: spacing.xs,
  },
  modeTitle: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: '700',
  },
  modeCaption: {
    color: colors.textMuted,
    fontSize: typography.caption,
    lineHeight: 18,
  },
  modeBadge: {
    color: colors.aqua,
    fontSize: typography.caption,
    fontWeight: '800',
  },
  threadCard: {
    flex: 1,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    padding: spacing.lg,
    gap: spacing.md,
  },
  threadHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.md,
  },
  threadName: {
    color: colors.text,
    fontSize: typography.section,
    fontWeight: '800',
  },
  threadMeta: {
    color: colors.textMuted,
    fontSize: typography.caption,
  },
  messages: {
    gap: spacing.sm,
    paddingBottom: spacing.sm,
  },
  messageBubble: {
    maxWidth: '82%',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
  },
  selfBubble: {
    alignSelf: 'flex-end',
    backgroundColor: colors.sky,
  },
  peerBubble: {
    alignSelf: 'flex-start',
    backgroundColor: colors.canvasMuted,
  },
  messageText: {
    color: colors.text,
    fontSize: typography.body,
    lineHeight: 20,
  },
  selfText: {
    color: colors.text,
  },
  typing: {
    color: colors.aqua,
    fontSize: typography.caption,
    fontWeight: '600',
  },
  composer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.line,
    paddingTop: spacing.md,
  },
  composerInput: {
    flex: 1,
    minHeight: 48,
    maxHeight: 120,
    borderRadius: radius.md,
    backgroundColor: colors.canvasMuted,
    borderWidth: 1,
    borderColor: colors.line,
    color: colors.text,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: typography.body,
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.sky,
  },
});
