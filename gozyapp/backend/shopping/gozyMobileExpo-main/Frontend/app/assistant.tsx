import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';

import { ScreenShell } from '@/src/components/screen-shell';
import { TopBar } from '@/src/components/top-bar';
import { useApp } from '@/src/context/app-context';
import { colors, radius, spacing, typography } from '@/src/theme/tokens';

export default function AssistantScreen() {
  const { assistantMessages, askAssistant } = useApp();
  const [input, setInput] = useState('');

  const handleSend = async (prompt: string) => {
    if (!prompt.trim()) {
      return;
    }

    setInput('');
    await askAssistant(prompt);
  };

  return (
    <ScreenShell scroll={false} style={styles.flex}>
      <TopBar
        eyebrow="AI assistant"
        primaryAction={{ icon: 'arrow-left', onPress: () => router.back() }}
        subtitle='Ask things like "Plan my Goa trip", "Best food near me", or "Weekend shopping deals".'
        title="Gozy Concierge"
      />

      <View style={styles.threadCard}>
        <ScrollView contentContainerStyle={styles.messages} showsVerticalScrollIndicator={false}>
          {assistantMessages.map((message) => (
            <View
              key={message.id}
              style={[styles.bubble, message.role === 'assistant' ? styles.assistant : styles.user]}>
              <Text style={[styles.messageText, message.role === 'user' && styles.userText]}>
                {message.text}
              </Text>
              {message.chips ? (
                <View style={styles.chipWrap}>
                  {message.chips.map((chip) => (
                    <Pressable key={chip} onPress={() => void handleSend(chip)} style={styles.quickChip}>
                      <Text style={styles.quickChipText}>{chip}</Text>
                    </Pressable>
                  ))}
                </View>
              ) : null}
            </View>
          ))}
        </ScrollView>

        <View style={styles.composer}>
          <TextInput
            onChangeText={setInput}
            placeholder="Ask Gozy AI"
            placeholderTextColor={colors.textMuted}
            style={styles.input}
            value={input}
          />
          <Pressable onPress={() => void handleSend(input)} style={styles.sendButton}>
            <Text style={styles.sendButtonText}>Send</Text>
          </Pressable>
        </View>
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
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
  messages: {
    gap: spacing.sm,
    paddingBottom: spacing.md,
  },
  bubble: {
    maxWidth: '92%',
    borderRadius: radius.md,
    padding: spacing.md,
    gap: spacing.sm,
  },
  assistant: {
    alignSelf: 'flex-start',
    backgroundColor: colors.surfaceSoft,
  },
  user: {
    alignSelf: 'flex-end',
    backgroundColor: colors.sky,
  },
  messageText: {
    color: colors.text,
    fontSize: typography.body,
    lineHeight: 21,
  },
  userText: {
    color: '#FFFFFF',
  },
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  quickChip: {
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    paddingHorizontal: spacing.sm,
    paddingVertical: 8,
  },
  quickChipText: {
    color: colors.text,
    fontSize: typography.caption,
    fontWeight: '700',
  },
  composer: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  input: {
    flex: 1,
    height: 48,
    borderRadius: radius.pill,
    backgroundColor: colors.canvasMuted,
    borderWidth: 1,
    borderColor: colors.line,
    paddingHorizontal: spacing.md,
    color: colors.text,
    fontSize: typography.body,
  },
  sendButton: {
    borderRadius: radius.pill,
    backgroundColor: colors.sky,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontSize: typography.body,
    fontWeight: '700',
  },
});
