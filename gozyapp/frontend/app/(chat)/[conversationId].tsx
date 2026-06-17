// import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
// import {
//   StyleSheet,
//   Text,
//   View,
//   TextInput,
//   Pressable,
//   useColorScheme,
//   KeyboardAvoidingView,
//   Platform,
//   Modal,
//   FlatList,
//   Image as RNImage,
//   ActivityIndicator,
// } from 'react-native';
// import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
// import { Image } from 'expo-image';
// import { router, useLocalSearchParams } from 'expo-router';
// import { FlashList } from '@shopify/flash-list';
// import Animated, {
//   FadeIn,
//   FadeOut,
//   SlideInRight,
//   SlideOutRight,
//   ZoomIn,
//   useSharedValue,
//   useAnimatedStyle,
//   withSpring,
//   withTiming,
//   runOnJS,
// } from 'react-native-reanimated';
// import { Audio } from 'expo-av';

// import { useChatStore } from '@/src/store/chat-store';
// import { colors, spacing, typography } from '@/src/theme/tokens';
// import type { Message } from '@/src/types/chat';

// export default function ChatScreen() {
//   const colorScheme = useColorScheme();
//   const isDark = colorScheme === 'dark';
//   const { conversationId } = useLocalSearchParams();

//   const { messages, currentUserId, addMessage, updateMessageStatus, markMessagesAsRead } =
//     useChatStore();

//   const conversationMessages = messages[conversationId as string] || [];
//   const [inputText, setInputText] = useState('');
//   const [showEmojiPicker, setShowEmojiPicker] = useState(false);
//   const [isRecording, setIsRecording] = useState(false);
//   const [recordingDuration, setRecordingDuration] = useState(0);
//   const [selectedForReply, setSelectedForReply] = useState<Message | null>(null);
//   const [reactingToMessageId, setReactingToMessageId] = useState<string | null>(null);

//   const soundRecorder = useRef<Audio.Recording | null>(null);
//   const listRef = useRef<any>(null);
//   const scaleValue = useSharedValue(1);

//   // Mark messages as read on mount
//   useEffect(() => {
//     const unreadMessageIds = conversationMessages
//       .filter((m) => !m.readBy.includes(currentUserId))
//       .map((m) => m.id);
//     if (unreadMessageIds.length > 0) {
//       markMessagesAsRead(conversationId as string, unreadMessageIds);
//     }
//   }, [conversationMessages, currentUserId, markMessagesAsRead, conversationId]);

//   const handleSendMessage = useCallback(() => {
//     if (!inputText.trim() && !selectedForReply) return;

//     const newMessage: Message = {
//       id: `msg-${Date.now()}`,
//       senderId: currentUserId,
//       text: inputText.trim() || undefined,
//       replyTo: selectedForReply || undefined,
//       reactions: {},
//       readBy: [currentUserId],
//       timestamp: new Date(),
//       status: 'sending',
//     };

//     addMessage(conversationId as string, newMessage);
//     setInputText('');
//     setSelectedForReply(null);

//     // Simulate message status updates
//     setTimeout(() => {
//       updateMessageStatus(conversationId as string, newMessage.id, 'sent');
//     }, 500);
//     setTimeout(() => {
//       updateMessageStatus(conversationId as string, newMessage.id, 'delivered');
//     }, 1000);
//   }, [inputText, selectedForReply, currentUserId, conversationId, addMessage, updateMessageStatus]);

//   const handleStartRecording = useCallback(async () => {
//     try {
//       await Audio.requestPermissionsAsync();
//       const recording = new Audio.Recording();
//       await recording.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
//       await recording.startAsync();
//       soundRecorder.current = recording;
//       setIsRecording(true);
//     } catch (error) {
//       console.error('Recording error:', error);
//     }
//   }, []);

//   const handleStopRecording = useCallback(async () => {
//     if (!soundRecorder.current) return;

//     try {
//       await soundRecorder.current.stopAndUnloadAsync();
//       const uri = soundRecorder.current.getURI();
//       soundRecorder.current = null;
//       setIsRecording(false);

//       if (uri) {
//         const voiceMessage: Message = {
//           id: `msg-${Date.now()}`,
//           senderId: currentUserId,
//           voiceUrl: uri,
//           voiceDuration: recordingDuration,
//           reactions: {},
//           readBy: [currentUserId],
//           timestamp: new Date(),
//           status: 'sending',
//         };

//         addMessage(conversationId as string, voiceMessage);
//         setRecordingDuration(0);
//       }
//     } catch (error) {
//       console.error('Stop recording error:', error);
//     }
//   }, [recordingDuration, currentUserId, conversationId, addMessage]);

//   const animatedScale = useAnimatedStyle(() => ({
//     transform: [{ scale: scaleValue.value }],
//   }));

//   const renderMessage = ({ item, index }: { item: Message; index: number }) => (
//     <MessageBubble
//       message={item}
//       isOwn={item.senderId === currentUserId}
//       onReply={() => setSelectedForReply(item)}
//       onReact={() => setReactingToMessageId(item.id)}
//       isDark={isDark}
//       scaleValue={scaleValue}
//     />
//   );

//   const emojis = ['😂', '❤️', '😮', '😢', '🔥', '👍', '👎', '🎉'];

//   return (
//     <KeyboardAvoidingView
//       behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//       style={[styles.container, isDark && styles.containerDark]}
//     >
//       {/* Header */}
//       <View style={[styles.header, isDark && styles.headerDark]}>
//         <Pressable onPress={() => router.back()} style={styles.backBtn}>
//           <MaterialCommunityIcons name="arrow-left" size={24} color={isDark ? '#fff' : '#111'} />
//         </Pressable>
//         <View style={styles.headerInfo}>
//           <Text style={[styles.headerTitle, isDark && styles.headerTitleDark]}>John Doe</Text>
//           <Text style={[styles.headerStatus, isDark && styles.headerStatusDark]}>
//             Active now
//           </Text>
//         </View>
//         <View style={styles.headerActions}>
//           <Pressable style={[styles.iconBtn, isDark && styles.iconBtnDark]}>
//             <Ionicons name="call" size={20} color={isDark ? '#fff' : '#111'} />
//           </Pressable>
//           <Pressable style={[styles.iconBtn, isDark && styles.iconBtnDark]}>
//             <Ionicons name="videocam" size={20} color={isDark ? '#fff' : '#111'} />
//           </Pressable>
//         </View>
//       </View>

//       {/* Messages List */}
//       <FlashList
//         ref={listRef}
//         data={conversationMessages}
//         renderItem={renderMessage}
//         keyExtractor={(item) => item.id}
//         contentContainerStyle={styles.messagesList}
//         estimatedItemSize={100}
//         inverted
//         scrollIndicatorInsets={{ right: 1 }}
//       />

//       {/* Reply Preview */}
//       {selectedForReply && (
//         <Animated.View entering={SlideInRight} exiting={SlideOutRight} style={styles.replyPreview}>
//           <View style={styles.replyPreviewContent}>
//             <MaterialCommunityIcons name="reply" size={16} color={colors.sky} />
//             <View style={styles.replyPreviewText}>
//               <Text style={styles.replyPreviewLabel}>Replying to</Text>
//               <Text numberOfLines={1} style={styles.replyPreviewMsg}>
//                 {selectedForReply.text || '📎 Media'}
//               </Text>
//             </View>
//           </View>
//           <Pressable onPress={() => setSelectedForReply(null)}>
//             <MaterialCommunityIcons name="close" size={16} color={colors.textMuted} />
//           </Pressable>
//         </Animated.View>
//       )}

//       {/* Input Area */}
//       <View style={[styles.inputArea, isDark && styles.inputAreaDark]}>
//         <Pressable style={[styles.attachBtn, isDark && styles.attachBtnDark]}>
//           <MaterialCommunityIcons name="plus" size={24} color={colors.sky} />
//         </Pressable>

//         <View style={[styles.inputContainer, isDark && styles.inputContainerDark]}>
//           {isRecording ? (
//             <View style={styles.recordingIndicator}>
//               <Animated.View style={styles.recordingDot} />
//               <Text style={styles.recordingTime}>
//                 {Math.floor(recordingDuration / 60)}:
//                 {(recordingDuration % 60).toString().padStart(2, '0')}
//               </Text>
//             </View>
//           ) : (
//             <>
//               <TextInput
//                 style={[styles.input, isDark && styles.inputDark, { maxHeight: 100 }]}
//                 placeholder="Message..."
//                 placeholderTextColor={isDark ? '#888' : '#999'}
//                 value={inputText}
//                 onChangeText={setInputText}
//                 multiline
//               />
//               <Pressable onPress={() => setShowEmojiPicker(!showEmojiPicker)}>
//                 <MaterialCommunityIcons
//                   name="emoticon-outline"
//                   size={20}
//                   color={colors.sky}
//                   style={styles.emojiBtn}
//                 />
//               </Pressable>
//             </>
//           )}
//         </View>

//         {isRecording ? (
//           <Pressable
//             onPress={handleStopRecording}
//             style={[styles.sendBtn, styles.stopRecordBtn]}
//           >
//             <MaterialCommunityIcons name="stop" size={24} color="#fff" />
//           </Pressable>
//         ) : inputText.trim().length > 0 ? (
//           <Pressable onPress={handleSendMessage} style={[styles.sendBtn, styles.sendBtnActive]}>
//             <MaterialCommunityIcons name="send" size={20} color="#fff" />
//           </Pressable>
//         ) : (
//           <Pressable
//             onPress={handleStartRecording}
//             style={[styles.sendBtn, styles.micBtn]}
//             onLongPress={handleStartRecording}
//           >
//             <MaterialCommunityIcons name="microphone" size={20} color="#fff" />
//           </Pressable>
//         )}
//       </View>

//       {/* Emoji Picker */}
//       {showEmojiPicker && (
//         <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.emojiPickerContainer}>
//           <FlatList
//             data={emojis}
//             renderItem={({ item }) => (
//               <Pressable
//                 onPress={() => {
//                   setInputText(inputText + item);
//                   setShowEmojiPicker(false);
//                 }}
//                 style={styles.emojiItem}
//               >
//                 <Text style={styles.emoji}>{item}</Text>
//               </Pressable>
//             )}
//             keyExtractor={(item) => item}
//             numColumns={8}
//             scrollEnabled={false}
//           />
//         </Animated.View>
//       )}

//       {/* Emoji Reactions Picker */}
//       {reactingToMessageId && (
//         <Modal transparent animationType="fade">
//           <Pressable
//             style={styles.reactionModal}
//             onPress={() => setReactingToMessageId(null)}
//           >
//             <View style={styles.reactionPickerContainer}>
//               {emojis.map((emoji) => (
//                 <Pressable
//                   key={emoji}
//                   onPress={() => {
//                     // TODO: Add emoji reaction to message
//                     setReactingToMessageId(null);
//                   }}
//                   style={styles.reactionItem}
//                 >
//                   <Text style={styles.reactionEmoji}>{emoji}</Text>
//                 </Pressable>
//               ))}
//             </View>
//           </Pressable>
//         </Modal>
//       )}
//     </KeyboardAvoidingView>
//   );
// }

// function MessageBubble({ message, isOwn, onReply, onReact, isDark, scaleValue }: any) {
//   const scale = useSharedValue(1);
//   const animated = useAnimatedStyle(() => ({
//     transform: [{ scale: scale.value }],
//   }));

//   const handleDoubleTap = () => {
//     scale.value = withSpring(1.05);
//     scale.value = withTiming(1, { duration: 200 });
//     // Like animation
//   };

//   return (
//     <View style={[styles.messageRow, isOwn && styles.messageRowOwn]}>
//       <Pressable
//         onLongPress={onReact}
//         onPress={onReply}
//         delayLongPress={200}
//         style={[
//           styles.bubble,
//           isOwn ? styles.bubbleOwn : styles.bubbleOther,
//           isDark && (isOwn ? styles.bubbleOwnDark : styles.bubbleOtherDark),
//         ]}
//       >
//         {message.replyTo && (
//           <View style={[styles.replyQuote, isDark && styles.replyQuoteDark]}>
//             <Text style={styles.replyQuoteText} numberOfLines={2}>
//               {message.replyTo.text || '📎 Media'}
//             </Text>
//           </View>
//         )}

//         {message.text && <Text style={[styles.text, isOwn && styles.textOwn]}>{message.text}</Text>}

//         {message.voiceUrl && (
//           <View style={styles.voiceMessage}>
//             <MaterialCommunityIcons name="play-circle" size={32} color={isOwn ? '#fff' : colors.sky} />
//             <View style={styles.waveform}>
//               {[...Array(20)].map((_, i) => (
//                 <View
//                   key={i}
//                   style={[
//                     styles.waveformBar,
//                     {
//                       height: Math.random() * 30 + 5,
//                       backgroundColor: isOwn ? '#fff' : colors.sky,
//                     },
//                   ]}
//                 />
//               ))}
//             </View>
//             <Text style={[styles.voiceDuration, isOwn && styles.voiceDurationOwn]}>
//               {formatDuration(message.voiceDuration || 0)}
//             </Text>
//           </View>
//         )}

//         <View style={styles.messageFooter}>
//           <Text style={[styles.timestamp, isOwn && styles.timestampOwn]}>
//             {new Date(message.timestamp).toLocaleTimeString([], {
//               hour: '2-digit',
//               minute: '2-digit',
//             })}
//           </Text>

//           {isOwn && (
//             <View style={styles.readReceipt}>
//               {message.status === 'sending' && (
//                 <MaterialCommunityIcons name="clock-outline" size={12} color="#fff" />
//               )}
//               {message.status === 'sent' && (
//                 <MaterialCommunityIcons name="check" size={12} color="#fff" />
//               )}
//               {message.status === 'delivered' && (
//                 <MaterialCommunityIcons name="check-all" size={12} color="#fff" />
//               )}
//               {message.status === 'read' && (
//                 <MaterialCommunityIcons name="check-all" size={12} color="#4da6ff" />
//               )}
//             </View>
//           )}
//         </View>
//       </Pressable>

//       {/* Reactions */}
//       {Object.keys(message.reactions).length > 0 && (
//         <View style={styles.reactionsContainer}>
//           {Object.entries(message.reactions).map(([emoji, userIds]) => (
//             <View key={emoji} style={[styles.reactionBadge, isDark && styles.reactionBadgeDark]}>
//               <Text style={styles.reactionBadgeEmoji}>{emoji}</Text>
//               <Text style={[styles.reactionCount, isDark && styles.reactionCountDark]}>
//                 {userIds.length}
//               </Text>
//             </View>
//           ))}
//         </View>
//       )}
//     </View>
//   );
// }

// function formatDuration(seconds: number) {
//   const mins = Math.floor(seconds / 60);
//   const secs = seconds % 60;
//   return `${mins}:${secs.toString().padStart(2, '0')}`;
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: colors.canvas,
//   },
//   containerDark: {
//     backgroundColor: '#1a1a1a',
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: spacing.md,
//     paddingVertical: spacing.md,
//     backgroundColor: colors.canvas,
//     borderBottomWidth: 1,
//     borderBottomColor: colors.line,
//   },
//   headerDark: {
//     backgroundColor: '#0a0a0a',
//     borderBottomColor: '#333',
//   },
//   backBtn: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   headerInfo: {
//     flex: 1,
//     marginLeft: spacing.md,
//   },
//   headerTitle: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: colors.text,
//   },
//   headerTitleDark: {
//     color: '#fff',
//   },
//   headerStatus: {
//     fontSize: 12,
//     color: colors.textMuted,
//     marginTop: 2,
//   },
//   headerStatusDark: {
//     color: '#888',
//   },
//   headerActions: {
//     flexDirection: 'row',
//     gap: spacing.sm,
//   },
//   iconBtn: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: colors.surfaceAccent,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   iconBtnDark: {
//     backgroundColor: '#222',
//   },
//   messagesList: {
//     paddingHorizontal: spacing.md,
//     paddingVertical: spacing.md,
//   },
//   messageRow: {
//     flexDirection: 'row',
//     justifyContent: 'flex-end',
//     marginBottom: spacing.md,
//   },
//   messageRowOwn: {
//     justifyContent: 'flex-end',
//   },
//   bubble: {
//     maxWidth: '75%',
//     borderRadius: 16,
//     padding: spacing.md,
//     borderBottomRightRadius: 4,
//   },
//   bubbleOwn: {
//     backgroundColor: colors.sky,
//     borderBottomRightRadius: 4,
//   },
//   bubbleOwnDark: {
//     backgroundColor: '#172B4D',
//   },
//   bubbleOther: {
//     backgroundColor: colors.surfaceAccent,
//     borderBottomLeftRadius: 4,
//   },
//   bubbleOtherDark: {
//     backgroundColor: '#222',
//   },
//   text: {
//     fontSize: 13,
//     color: colors.text,
//     lineHeight: 20,
//   },
//   textOwn: {
//     color: '#fff',
//   },
//   voiceMessage: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: spacing.sm,
//   },
//   waveform: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 3,
//     flex: 1,
//   },
//   waveformBar: {
//     width: 2,
//     borderRadius: 1,
//   },
//   voiceDuration: {
//     fontSize: 12,
//     color: colors.textMuted,
//   },
//   voiceDurationOwn: {
//     color: '#fff',
//   },
//   messageFooter: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'flex-end',
//     gap: spacing.xs,
//     marginTop: spacing.xs,
//   },
//   timestamp: {
//     fontSize: 12,
//     color: colors.textMuted,
//   },
//   timestampOwn: {
//     color: 'rgba(255,255,255,0.7)',
//   },
//   readReceipt: {
//     flexDirection: 'row',
//     gap: 2,
//   },
//   reactionsContainer: {
//     flexDirection: 'row',
//     gap: spacing.xs,
//     marginTop: spacing.xs,
//     flexWrap: 'wrap',
//   },
//   reactionBadge: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 4,
//     paddingHorizontal: spacing.sm,
//     paddingVertical: 3,
//     borderRadius: 12,
//     backgroundColor: colors.surfaceAccent,
//     borderWidth: 1,
//     borderColor: colors.line,
//   },
//   reactionBadgeDark: {
//     backgroundColor: '#222',
//     borderColor: '#333',
//   },
//   reactionBadgeEmoji: {
//     fontSize: 13,
//   },
//   reactionCount: {
//     fontSize: 10.5,
//     fontWeight: '600',
//     color: colors.textMuted,
//   },
//   reactionCountDark: {
//     color: '#888',
//   },
//   replyQuote: {
//     paddingVertical: spacing.sm,
//     paddingHorizontal: spacing.md,
//     borderLeftWidth: 3,
//     borderLeftColor: 'rgba(255,255,255,0.3)',
//     marginBottom: spacing.sm,
//     backgroundColor: 'rgba(255,255,255,0.1)',
//     borderRadius: 6,
//   },
//   replyQuoteDark: {
//     borderLeftColor: 'rgba(255,255,255,0.2)',
//     backgroundColor: 'rgba(255,255,255,0.05)',
//   },
//   replyQuoteText: {
//     fontSize: 13,
//     color: '#fff',
//     opacity: 0.8,
//   },
//   replyPreview: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingHorizontal: spacing.md,
//     paddingVertical: spacing.sm,
//     backgroundColor: colors.surfaceAccent,
//     borderTopWidth: 1,
//     borderTopColor: colors.line,
//   },
//   replyPreviewContent: {
//     flex: 1,
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: spacing.md,
//   },
//   replyPreviewText: {
//     flex: 1,
//   },
//   replyPreviewLabel: {
//     fontSize: 12,
//     color: colors.textMuted,
//   },
//   replyPreviewMsg: {
//     fontSize: 13,
//     color: colors.text,
//     fontWeight: '500',
//   },
//   inputArea: {
//     flexDirection: 'row',
//     alignItems: 'flex-end',
//     gap: spacing.sm,
//     paddingHorizontal: spacing.md,
//     paddingVertical: spacing.md,
//     backgroundColor: colors.canvas,
//     borderTopWidth: 1,
//     borderTopColor: colors.line,
//   },
//   inputAreaDark: {
//     backgroundColor: '#0a0a0a',
//     borderTopColor: '#333',
//   },
//   attachBtn: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   attachBtnDark: {},
//   inputContainer: {
//     flex: 1,
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: colors.surfaceAccent,
//     borderRadius: 24,
//     paddingHorizontal: spacing.md,
//     minHeight: 40,
//   },
//   inputContainerDark: {
//     backgroundColor: '#222',
//   },
//   input: {
//     flex: 1,
//     fontSize: 13,
//     color: colors.text,
//     padding: spacing.sm,
//     paddingVertical: spacing.sm,
//   },
//   inputDark: {
//     color: '#fff',
//   },
//   emojiBtn: {
//     marginLeft: spacing.xs,
//   },
//   sendBtn: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: colors.textMuted,
//   },
//   sendBtnActive: {
//     backgroundColor: colors.sky,
//   },
//   stopRecordBtn: {
//     backgroundColor: colors.danger,
//   },
//   micBtn: {
//     backgroundColor: colors.sky,
//   },
//   recordingIndicator: {
//     flex: 1,
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: spacing.md,
//   },
//   recordingDot: {
//     width: 12,
//     height: 12,
//     borderRadius: 6,
//     backgroundColor: colors.danger,
//   },
//   recordingTime: {
//     fontSize: 13,
//     fontWeight: '600',
//     color: colors.text,
//   },
//   emojiPickerContainer: {
//     backgroundColor: colors.canvas,
//     borderTopWidth: 1,
//     borderTopColor: colors.line,
//     padding: spacing.md,
//     maxHeight: 150,
//   },
//   emojiItem: {
//     flex: 1 / 8,
//     aspectRatio: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   emoji: {
//     fontSize: 18,
//   },
//   reactionModal: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0,0,0,0.5)',
//   },
//   reactionPickerContainer: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     backgroundColor: colors.canvas,
//     borderRadius: 16,
//     padding: spacing.md,
//     gap: spacing.md,
//     justifyContent: 'center',
//     maxWidth: 300,
//   },
//   reactionItem: {
//     width: '20%',
//     aspectRatio: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   reactionEmoji: {
//     fontSize: 32,
//   },
// });
import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  useColorScheme,
  KeyboardAvoidingView,
  Platform,
  Modal,
  FlatList,
  Image as RNImage,
  ActivityIndicator,
} from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { FlashList } from '@shopify/flash-list';
import Animated, {
  FadeIn,
  FadeOut,
  SlideInRight,
  SlideOutRight,
  ZoomIn,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { Audio } from 'expo-av';

import { useChatStore } from '@/src/store/chat-store';
import { colors, spacing, typography } from '@/src/theme/tokens';
import type { Message } from '@/src/types/chat';

export default function ChatScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { conversationId, name, avatar, isGroup, isOnline } = useLocalSearchParams<{
    conversationId: string;
    name?: string;
    avatar?: string;
    isGroup?: string;
    isOnline?: string;
  }>();
  const displayName = name || conversationId || 'Chat';
  const online = isOnline === 'true';
  const [showHeaderMenu, setShowHeaderMenu] = useState(false);

  const { messages, currentUserId, addMessage, updateMessageStatus, markMessagesAsRead } =
    useChatStore();

  const conversationMessages = messages[conversationId as string] || [];
  const [inputText, setInputText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [selectedForReply, setSelectedForReply] = useState<Message | null>(null);
  const [reactingToMessageId, setReactingToMessageId] = useState<string | null>(null);

  const soundRecorder = useRef<Audio.Recording | null>(null);
  const listRef = useRef<any>(null);
  const scaleValue = useSharedValue(1);

  // Mark messages as read on mount
  useEffect(() => {
    const unreadMessageIds = conversationMessages
      .filter((m) => !m.readBy.includes(currentUserId))
      .map((m) => m.id);
    if (unreadMessageIds.length > 0) {
      markMessagesAsRead(conversationId as string, unreadMessageIds);
    }
  }, [conversationMessages, currentUserId, markMessagesAsRead, conversationId]);

  const handleSendMessage = useCallback(() => {
    if (!inputText.trim() && !selectedForReply) return;

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      senderId: currentUserId,
      text: inputText.trim() || undefined,
      replyTo: selectedForReply || undefined,
      reactions: {},
      readBy: [currentUserId],
      timestamp: new Date(),
      status: 'sending',
    };

    addMessage(conversationId as string, newMessage);
    setInputText('');
    setSelectedForReply(null);

    // Simulate message status updates
    setTimeout(() => {
      updateMessageStatus(conversationId as string, newMessage.id, 'sent');
    }, 500);
    setTimeout(() => {
      updateMessageStatus(conversationId as string, newMessage.id, 'delivered');
    }, 1000);
  }, [inputText, selectedForReply, currentUserId, conversationId, addMessage, updateMessageStatus]);

  const handleStartRecording = useCallback(async () => {
    try {
      await Audio.requestPermissionsAsync();
      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
      await recording.startAsync();
      soundRecorder.current = recording;
      setIsRecording(true);
    } catch (error) {
      console.error('Recording error:', error);
    }
  }, []);

  const handleStopRecording = useCallback(async () => {
    if (!soundRecorder.current) return;

    try {
      await soundRecorder.current.stopAndUnloadAsync();
      const uri = soundRecorder.current.getURI();
      soundRecorder.current = null;
      setIsRecording(false);

      if (uri) {
        const voiceMessage: Message = {
          id: `msg-${Date.now()}`,
          senderId: currentUserId,
          voiceUrl: uri,
          voiceDuration: recordingDuration,
          reactions: {},
          readBy: [currentUserId],
          timestamp: new Date(),
          status: 'sending',
        };

        addMessage(conversationId as string, voiceMessage);
        setRecordingDuration(0);
      }
    } catch (error) {
      console.error('Stop recording error:', error);
    }
  }, [recordingDuration, currentUserId, conversationId, addMessage]);

  const animatedScale = useAnimatedStyle(() => ({
    transform: [{ scale: scaleValue.value }],
  }));

  const renderMessage = ({ item, index }: { item: Message; index: number }) => (
    <MessageBubble
      message={item}
      isOwn={item.senderId === currentUserId}
      onReply={() => setSelectedForReply(item)}
      onReact={() => setReactingToMessageId(item.id)}
      isDark={isDark}
      scaleValue={scaleValue}
    />
  );

  const emojis = ['😂', '❤️', '😮', '😢', '🔥', '👍', '👎', '🎉'];

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, isDark && styles.containerDark]}
    >
      {/* Header */}
      <View style={[styles.header, isDark && styles.headerDark]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={isDark ? '#fff' : '#111'} />
        </Pressable>
        {avatar ? (
          <Image source={{ uri: avatar }} style={{ width: 36, height: 36, borderRadius: 18, marginRight: 8 }} />
        ) : (
          <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: '#00A699', alignItems: 'center', justifyContent: 'center', marginRight: 8 }}>
            <Text style={{ color: '#fff', fontWeight: '700', fontSize: 14 }}>{displayName.slice(0, 2).toUpperCase()}</Text>
          </View>
        )}
        <View style={styles.headerInfo}>
          <Text style={[styles.headerTitle, isDark && styles.headerTitleDark]} numberOfLines={1}>{displayName}</Text>
          <Text style={[styles.headerStatus, isDark && styles.headerStatusDark]}>
            {online ? '🟢 Online' : isGroup === 'true' ? 'Tap for group info' : 'Tap for contact info'}
          </Text>
        </View>
        <View style={styles.headerActions}>
          <Pressable style={[styles.iconBtn, isDark && styles.iconBtnDark]} onPress={() => Alert.alert('Voice Call', `Calling ${displayName}...`)}>            <Ionicons name="call" size={20} color={isDark ? '#fff' : '#111'} />
          </Pressable>
          <Pressable style={[styles.iconBtn, isDark && styles.iconBtnDark]} onPress={() => Alert.alert('Video Call', `Starting video call with ${displayName}...`)}>
            <Ionicons name="videocam" size={20} color={isDark ? '#fff' : '#111'} />
          </Pressable>
          <Pressable style={[styles.iconBtn, isDark && styles.iconBtnDark]} onPress={() => setShowHeaderMenu(true)}>
            <MaterialCommunityIcons name="dots-vertical" size={20} color={isDark ? '#fff' : '#111'} />
          </Pressable>
        </View>
      </View>

      {/* Header Dropdown Menu */}
      <Modal visible={showHeaderMenu} transparent animationType="fade" onRequestClose={() => setShowHeaderMenu(false)}>
        <Pressable style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.15)' }} onPress={() => setShowHeaderMenu(false)} />
        <View style={{ position: 'absolute', top: 56, right: 8, backgroundColor: '#fff', borderRadius: 12, paddingVertical: 4, minWidth: 200, elevation: 12, shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 8 }}>
          {[
            { icon: 'account-circle-outline', label: 'View contact', action: () => Alert.alert('Contact', `Viewing profile of ${displayName}`) },
            { icon: 'volume-mute-outline', label: 'Mute notifications', action: () => Alert.alert('Muted', `Notifications muted for ${displayName}`) },
            { icon: 'wallpaper', label: 'Wallpaper', action: () => Alert.alert('Wallpaper', 'Choose a chat wallpaper') },
            { icon: 'export-variant', label: 'Export chat', action: () => Alert.alert('Export', 'Chat export started') },
            { icon: 'delete-outline', label: 'Clear chat', action: () => Alert.alert('Clear Chat', 'All messages cleared') },
            { icon: 'block-helper', label: 'Block', action: () => Alert.alert('Block', `${displayName} has been blocked`) },
            { icon: 'flag-outline', label: 'Report', action: () => Alert.alert('Report', 'Thank you for your report') },
          ].map((item, i, arr) => (
            <Pressable key={item.label} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 13, paddingHorizontal: 18, borderBottomWidth: i < arr.length - 1 ? 0.5 : 0, borderColor: '#f0f0f0' }} onPress={() => { setShowHeaderMenu(false); item.action(); }}>
              <MaterialCommunityIcons name={item.icon as any} size={20} color={item.label === 'Block' || item.label === 'Report' ? '#EF4444' : '#555'} style={{ marginRight: 14 }} />
              <Text style={{ fontSize: 15, color: item.label === 'Block' || item.label === 'Report' ? '#EF4444' : '#111' }}>{item.label}</Text>
            </Pressable>
          ))}
        </View>
      </Modal>

      {/* Messages List */}
      <FlashList
        ref={listRef}
        data={conversationMessages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messagesList}
        estimatedItemSize={100}
        inverted
        scrollIndicatorInsets={{ right: 1 }}
      />

      {/* Reply Preview */}
      {selectedForReply && (
        <Animated.View entering={SlideInRight} exiting={SlideOutRight} style={styles.replyPreview}>
          <View style={styles.replyPreviewContent}>
            <MaterialCommunityIcons name="reply" size={16} color={colors.sky} />
            <View style={styles.replyPreviewText}>
              <Text style={styles.replyPreviewLabel}>Replying to</Text>
              <Text numberOfLines={1} style={styles.replyPreviewMsg}>
                {selectedForReply.text || '📎 Media'}
              </Text>
            </View>
          </View>
          <Pressable onPress={() => setSelectedForReply(null)}>
            <MaterialCommunityIcons name="close" size={16} color={colors.textMuted} />
          </Pressable>
        </Animated.View>
      )}

      {/* Input Area */}
      <View style={[styles.inputArea, isDark && styles.inputAreaDark]}>
        <Pressable style={[styles.attachBtn, isDark && styles.attachBtnDark]}>
          <MaterialCommunityIcons name="plus" size={24} color={colors.sky} />
        </Pressable>

        <View style={[styles.inputContainer, isDark && styles.inputContainerDark]}>
          {isRecording ? (
            <View style={styles.recordingIndicator}>
              <Animated.View style={styles.recordingDot} />
              <Text style={styles.recordingTime}>
                {Math.floor(recordingDuration / 60)}:
                {(recordingDuration % 60).toString().padStart(2, '0')}
              </Text>
            </View>
          ) : (
            <>
              <TextInput
                style={[styles.input, isDark && styles.inputDark, { maxHeight: 100 }]}
                placeholder="Message..."
                placeholderTextColor={isDark ? '#888' : '#999'}
                value={inputText}
                onChangeText={setInputText}
                multiline
              />
              <Pressable onPress={() => setShowEmojiPicker(!showEmojiPicker)}>
                <MaterialCommunityIcons
                  name="emoticon-outline"
                  size={20}
                  color={colors.sky}
                  style={styles.emojiBtn}
                />
              </Pressable>
            </>
          )}
        </View>

        {isRecording ? (
          <Pressable
            onPress={handleStopRecording}
            style={[styles.sendBtn, styles.stopRecordBtn]}
          >
            <MaterialCommunityIcons name="stop" size={24} color="#fff" />
          </Pressable>
        ) : inputText.trim().length > 0 ? (
          <Pressable onPress={handleSendMessage} style={[styles.sendBtn, styles.sendBtnActive]}>
            <MaterialCommunityIcons name="send" size={20} color="#fff" />
          </Pressable>
        ) : (
          <Pressable
            onPress={handleStartRecording}
            style={[styles.sendBtn, styles.micBtn]}
            onLongPress={handleStartRecording}
          >
            <MaterialCommunityIcons name="microphone" size={20} color="#fff" />
          </Pressable>
        )}
      </View>

      {/* Emoji Picker */}
      {showEmojiPicker && (
        <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.emojiPickerContainer}>
          <FlatList
            data={emojis}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => {
                  setInputText(inputText + item);
                  setShowEmojiPicker(false);
                }}
                style={styles.emojiItem}
              >
                <Text style={styles.emoji}>{item}</Text>
              </Pressable>
            )}
            keyExtractor={(item) => item}
            numColumns={8}
            scrollEnabled={false}
          />
        </Animated.View>
      )}

      {/* Emoji Reactions Picker */}
      {reactingToMessageId && (
        <Modal transparent animationType="fade">
          <Pressable
            style={styles.reactionModal}
            onPress={() => setReactingToMessageId(null)}
          >
            <View style={styles.reactionPickerContainer}>
              {emojis.map((emoji) => (
                <Pressable
                  key={emoji}
                  onPress={() => {
                    // TODO: Add emoji reaction to message
                    setReactingToMessageId(null);
                  }}
                  style={styles.reactionItem}
                >
                  <Text style={styles.reactionEmoji}>{emoji}</Text>
                </Pressable>
              ))}
            </View>
          </Pressable>
        </Modal>
      )}
    </KeyboardAvoidingView>
  );
}

function MessageBubble({ message, isOwn, onReply, onReact, isDark, scaleValue }: any) {
  const scale = useSharedValue(1);
  const animated = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handleDoubleTap = () => {
    scale.value = withSpring(1.05);
    scale.value = withTiming(1, { duration: 200 });
    // Like animation
  };

  return (
    <View style={[styles.messageRow, isOwn && styles.messageRowOwn]}>
      <Pressable
        onLongPress={onReact}
        onPress={onReply}
        delayLongPress={200}
        style={[
          styles.bubble,
          isOwn ? styles.bubbleOwn : styles.bubbleOther,
          isDark && (isOwn ? styles.bubbleOwnDark : styles.bubbleOtherDark),
        ]}
      >
        {message.replyTo && (
          <View style={[styles.replyQuote, isDark && styles.replyQuoteDark]}>
            <Text style={styles.replyQuoteText} numberOfLines={2}>
              {message.replyTo.text || '📎 Media'}
            </Text>
          </View>
        )}

        {message.text && <Text style={[styles.text, isOwn && styles.textOwn]}>{message.text}</Text>}

        {message.voiceUrl && (
          <View style={styles.voiceMessage}>
            <MaterialCommunityIcons name="play-circle" size={32} color={isOwn ? '#fff' : colors.sky} />
            <View style={styles.waveform}>
              {[...Array(20)].map((_, i) => (
                <View
                  key={i}
                  style={[
                    styles.waveformBar,
                    {
                      height: Math.random() * 30 + 5,
                      backgroundColor: isOwn ? '#fff' : colors.sky,
                    },
                  ]}
                />
              ))}
            </View>
            <Text style={[styles.voiceDuration, isOwn && styles.voiceDurationOwn]}>
              {formatDuration(message.voiceDuration || 0)}
            </Text>
          </View>
        )}

        <View style={styles.messageFooter}>
          <Text style={[styles.timestamp, isOwn && styles.timestampOwn]}>
            {new Date(message.timestamp).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>

          {isOwn && (
            <View style={styles.readReceipt}>
              {message.status === 'sending' && (
                <MaterialCommunityIcons name="clock-outline" size={12} color="#fff" />
              )}
              {message.status === 'sent' && (
                <MaterialCommunityIcons name="check" size={12} color="#fff" />
              )}
              {message.status === 'delivered' && (
                <MaterialCommunityIcons name="check-all" size={12} color="#fff" />
              )}
              {message.status === 'read' && (
                <MaterialCommunityIcons name="check-all" size={12} color="#4da6ff" />
              )}
            </View>
          )}
        </View>
      </Pressable>

      {/* Quick Reactions Bar */}
      {!isOwn && (
        <View style={{ flexDirection: 'row', gap: 8, marginTop: 6, marginLeft: 8, marginBottom: 8 }}>
          {['👍', '❤️', '😂', '😮'].map((emoji) => (
            <Pressable key={emoji} onPress={() => onReact && onReact()} style={{ backgroundColor: isDark ? '#333' : '#f0f0f0', borderRadius: 14, paddingHorizontal: 8, paddingVertical: 4, borderWidth: 1, borderColor: isDark ? '#444' : '#e0e0e0' }}>
              <Text style={{ fontSize: 16 }}>{emoji}</Text>
            </Pressable>
          ))}
        </View>
      )}

      {/* Reactions */}
      {Object.keys(message.reactions || {}).length > 0 && (
        <View style={styles.reactionsContainer}>
          {Object.entries(message.reactions).map(([emoji, userIds]) => (
            <View key={emoji} style={[styles.reactionBadge, isDark && styles.reactionBadgeDark]}>
              <Text style={styles.reactionBadgeEmoji}>{emoji}</Text>
              <Text style={[styles.reactionCount, isDark && styles.reactionCountDark]}>
                {userIds.length}
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

function formatDuration(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.canvas,
  },
  containerDark: {
    backgroundColor: '#1a1a1a',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: colors.canvas,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  headerDark: {
    backgroundColor: '#0a0a0a',
    borderBottomColor: '#333',
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  headerTitleDark: {
    color: '#fff',
  },
  headerStatus: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  headerStatusDark: {
    color: '#888',
  },
  headerActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surfaceAccent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconBtnDark: {
    backgroundColor: '#222',
  },
  messagesList: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  messageRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: spacing.md,
  },
  messageRowOwn: {
    justifyContent: 'flex-end',
  },
  bubble: {
    maxWidth: '75%',
    borderRadius: 16,
    padding: spacing.md,
    borderBottomRightRadius: 4,
  },
  bubbleOwn: {
    backgroundColor: colors.sky,
    borderBottomRightRadius: 4,
  },
  bubbleOwnDark: {
    backgroundColor: '#172B4D',
  },
  bubbleOther: {
    backgroundColor: colors.surfaceAccent,
    borderBottomLeftRadius: 4,
  },
  bubbleOtherDark: {
    backgroundColor: '#222',
  },
  text: {
    fontSize: 13,
    color: colors.text,
    lineHeight: 20,
  },
  textOwn: {
    color: '#fff',
  },
  voiceMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  waveform: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    flex: 1,
  },
  waveformBar: {
    width: 2,
    borderRadius: 1,
  },
  voiceDuration: {
    fontSize: 12,
    color: colors.textMuted,
  },
  voiceDurationOwn: {
    color: '#fff',
  },
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  timestamp: {
    fontSize: 12,
    color: colors.textMuted,
  },
  timestampOwn: {
    color: 'rgba(255,255,255,0.7)',
  },
  readReceipt: {
    flexDirection: 'row',
    gap: 2,
  },
  reactionsContainer: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginTop: spacing.xs,
    flexWrap: 'wrap',
  },
  reactionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: 12,
    backgroundColor: colors.surfaceAccent,
    borderWidth: 1,
    borderColor: colors.line,
  },
  reactionBadgeDark: {
    backgroundColor: '#222',
    borderColor: '#333',
  },
  reactionBadgeEmoji: {
    fontSize: 13,
  },
  reactionCount: {
    fontSize: 10.5,
    fontWeight: '600',
    color: colors.textMuted,
  },
  reactionCountDark: {
    color: '#888',
  },
  replyQuote: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: 'rgba(255,255,255,0.3)',
    marginBottom: spacing.sm,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 6,
  },
  replyQuoteDark: {
    borderLeftColor: 'rgba(255,255,255,0.2)',
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  replyQuoteText: {
    fontSize: 13,
    color: '#fff',
    opacity: 0.8,
  },
  replyPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.surfaceAccent,
    borderTopWidth: 1,
    borderTopColor: colors.line,
  },
  replyPreviewContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  replyPreviewText: {
    flex: 1,
  },
  replyPreviewLabel: {
    fontSize: 12,
    color: colors.textMuted,
  },
  replyPreviewMsg: {
    fontSize: 13,
    color: colors.text,
    fontWeight: '500',
  },
  inputArea: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: colors.canvas,
    borderTopWidth: 1,
    borderTopColor: colors.line,
  },
  inputAreaDark: {
    backgroundColor: '#0a0a0a',
    borderTopColor: '#333',
  },
  attachBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  attachBtnDark: {},
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceAccent,
    borderRadius: 24,
    paddingHorizontal: spacing.md,
    minHeight: 40,
  },
  inputContainerDark: {
    backgroundColor: '#222',
  },
  input: {
    flex: 1,
    fontSize: 13,
    color: colors.text,
    padding: spacing.sm,
    paddingVertical: spacing.sm,
  },
  inputDark: {
    color: '#fff',
  },
  emojiBtn: {
    marginLeft: spacing.xs,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.textMuted,
  },
  sendBtnActive: {
    backgroundColor: colors.sky,
  },
  stopRecordBtn: {
    backgroundColor: colors.danger,
  },
  micBtn: {
    backgroundColor: colors.sky,
  },
  recordingIndicator: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  recordingDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.danger,
  },
  recordingTime: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
  },
  emojiPickerContainer: {
    backgroundColor: colors.canvas,
    borderTopWidth: 1,
    borderTopColor: colors.line,
    padding: spacing.md,
    maxHeight: 150,
  },
  emojiItem: {
    flex: 1 / 8,
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emoji: {
    fontSize: 18,
  },
  reactionModal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  reactionPickerContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: colors.canvas,
    borderRadius: 16,
    padding: spacing.md,
    gap: spacing.md,
    justifyContent: 'center',
    maxWidth: 300,
  },
  reactionItem: {
    width: '20%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  reactionEmoji: {
    fontSize: 32,
  },
});
