import { useEffect, useRef, useState } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, {
  Easing,
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useApp } from '@/src/context/app-context';
import { colors, radius, spacing, typography } from '@/src/theme/tokens';

type TrainFloatingBotProps = {
  bottom?: number;
};

const SUGGESTIONS = [
  'What are Tatkal booking rules?',
  'Track train seat availability',
  'Can I order food on the train?',
  'How to link Aadhaar with IRCTC?',
];

export function TrainFloatingBot({ bottom = 32 }: TrainFloatingBotProps) {
  const { assistantMessages, askAssistant } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const pulse = useSharedValue(1);

  useEffect(() => {
    pulse.value = withRepeat(
      withSequence(
        withTiming(1.06, { duration: 1600, easing: Easing.out(Easing.quad) }),
        withTiming(1, { duration: 1600, easing: Easing.inOut(Easing.quad) }),
      ),
      -1,
      false,
    );
  }, [pulse]);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
    opacity: 0.16,
  }));

  const handleSend = async (text: string) => {
    const prompt = text.trim();
    if (!prompt) return;

    setInput('');
    setIsSending(true);

    try {
      // Small timeout to let screen scroll
      setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);
      await askAssistant(prompt);
    } catch (error) {
      console.warn('Bot communication failed', error);
    } finally {
      setIsSending(false);
      setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 150);
    }
  };

  const handleOpen = () => {
    setIsOpen(true);
    setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 300);
  };

  // Filter messages to show a friendly initial greeting if empty
  const messagesToShow = assistantMessages.length > 0 
    ? assistantMessages 
    : [
        {
          id: 'welcome',
          role: 'assistant' as const,
          text: "Hi exploration traveler! 🚄 I'm Gozy Rail Assistant. Ask me anything about seat availability, Tatkal timing rules, or tracking your PNR!",
        }
      ];

  return (
    <>
      {/* Pulse Floating Action Button */}
      <Animated.View entering={FadeIn.duration(260)} style={[styles.floatingContainer, { bottom }]}>
        <Pressable onPress={handleOpen} style={styles.fab}>
          <Animated.View style={[styles.pulseRing, pulseStyle]} />
          <View style={styles.fabInner}>
            <MaterialCommunityIcons color="#FFFFFF" name="robot-happy-outline" size={22} />
            <View style={styles.onlineIndicator} />
          </View>
        </Pressable>
      </Animated.View>

      {/* Slide up Full Modal Chatbot Overlay */}
      <Modal
        animationType="slide"
        onRequestClose={() => setIsOpen(false)}
        transparent={false}
        visible={isOpen}
      >
        <SafeAreaView style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <Pressable hitSlop={12} onPress={() => setIsOpen(false)} style={styles.closeBtn}>
              <MaterialCommunityIcons color="#151515" name="chevron-down" size={28} />
            </Pressable>
            <View style={styles.headerTitleWrap}>
              <Text style={styles.headerTitle}>Gozy Rail Assistant</Text>
              <View style={styles.onlineBadge}>
                <View style={styles.dotGreen} />
                <Text style={styles.onlineText}>AI Concierge Active</Text>
              </View>
            </View>
            <Pressable
              hitSlop={12}
              onPress={() => {
                // Pre-fill a standard help inquiry
                handleSend('Give me high level help on train reservations');
              }}
              style={styles.helpBtn}
            >
              <MaterialCommunityIcons color="#0084FF" name="help-circle-outline" size={22} />
            </Pressable>
          </View>

          {/* Chat Threads Area */}
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={styles.keyboardView}
          >
            <ScrollView
              ref={scrollViewRef}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
              onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
            >
              {messagesToShow.map((message) => {
                const isAssistant = message.role === 'assistant';
                return (
                  <View
                    key={message.id}
                    style={[
                      styles.bubbleRow,
                      isAssistant ? styles.assistantRow : styles.userRow,
                    ]}
                  >
                    {isAssistant && (
                      <View style={styles.botAvatar}>
                        <MaterialCommunityIcons color="#0084FF" name="robot" size={16} />
                      </View>
                    )}
                    <View style={[styles.bubble, isAssistant ? styles.assistantBubble : styles.userBubble]}>
                      <Text style={[styles.messageText, !isAssistant && styles.userText]}>
                        {message.text}
                      </Text>
                    </View>
                  </View>
                );
              })}

              {isSending && (
                <View style={[styles.bubbleRow, styles.assistantRow]}>
                  <View style={styles.botAvatar}>
                    <MaterialCommunityIcons color="#0084FF" name="robot" size={16} />
                  </View>
                  <View style={[styles.bubble, styles.assistantBubble]}>
                    <Text style={styles.typingText}>Gozy is thinking...</Text>
                  </View>
                </View>
              )}
            </ScrollView>

            {/* Quick Suggestion Pills */}
            <View style={styles.suggestionsContainer}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.suggestionsScroll}>
                {SUGGESTIONS.map((item, idx) => (
                  <Pressable
                    key={`sugg-${idx}`}
                    onPress={() => handleSend(item)}
                    style={styles.suggestionPill}
                  >
                    <Text style={styles.suggestionText}>{item}</Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>

            {/* Composer Input Bar */}
            <View style={styles.composer}>
              <TextInput
                multiline
                onChangeText={setInput}
                placeholder="Ask about tatkal timing, seat quotas..."
                placeholderTextColor="#999999"
                style={styles.input}
                value={input}
              />
              <Pressable
                disabled={!input.trim() || isSending}
                onPress={() => handleSend(input)}
                style={[
                  styles.sendBtn,
                  (!input.trim() || isSending) && styles.sendBtnDisabled,
                ]}
              >
                <MaterialCommunityIcons color="#FFFFFF" name="send" size={20} />
              </Pressable>
            </View>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  floatingContainer: {
    position: 'absolute',
    right: 18,
    zIndex: 999,
  },
  fab: {
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOpacity: 0.2,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  pulseRing: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 27,
    backgroundColor: '#0084FF',
  },
  fabInner: {
    width: '100%',
    height: '100%',
    borderRadius: 27,
    backgroundColor: '#0084FF',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  onlineIndicator: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 9,
    height: 9,
    borderRadius: 4.5,
    backgroundColor: '#00C853',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#F7F9FB',
  },
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  closeBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleWrap: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#151515',
  },
  onlineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  dotGreen: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#00C853',
  },
  onlineText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#666666',
  },
  helpBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 12,
    paddingBottom: 24,
  },
  bubbleRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    maxWidth: '85%',
  },
  assistantRow: {
    alignSelf: 'flex-start',
  },
  userRow: {
    alignSelf: 'flex-end',
    justifyContent: 'flex-end',
  },
  botAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#EBF4FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    marginBottom: 2,
    borderWidth: 1,
    borderColor: '#CCE5FF',
  },
  bubble: {
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOpacity: 0.02,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  assistantBubble: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#EFEFEF',
  },
  userBubble: {
    backgroundColor: '#0084FF',
    borderTopRightRadius: 4,
  },
  messageText: {
    fontSize: 13,
    lineHeight: 18,
    color: '#333333',
    fontWeight: '500',
  },
  userText: {
    color: '#FFFFFF',
  },
  typingText: {
    fontSize: 12.5,
    fontStyle: 'italic',
    color: '#0084FF',
    fontWeight: '600',
  },
  suggestionsContainer: {
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#EBEBEB',
  },
  suggestionsScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  suggestionPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: '#F0F3F6',
    borderWidth: 1,
    borderColor: '#DFE4EA',
  },
  suggestionText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#4A5568',
  },
  composer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
    gap: 10,
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E5EA',
    paddingHorizontal: 14,
    paddingVertical: 8,
    fontSize: 13,
    color: '#151515',
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#0084FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnDisabled: {
    backgroundColor: '#B2D8FF',
  },
});
