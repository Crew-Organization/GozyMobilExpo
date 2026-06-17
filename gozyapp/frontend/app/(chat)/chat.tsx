// import { useMemo, useState, useCallback } from 'react';
// import {
//   StyleSheet,
//   Text,
//   View,
//   TextInput,
//   Pressable,
//   useColorScheme,
//   SectionList,
//   RefreshControl,
// } from 'react-native';
// import { MaterialCommunityIcons } from '@expo/vector-icons';
// import { Image } from 'expo-image';
// import { router } from 'expo-router';
// import { FlashList } from '@shopify/flash-list';

// import { useChatStore } from '@/src/store/chat-store';
// import { BottomTabs } from '@/src/components/bottom-tabs';
// import { colors, spacing, typography } from '@/src/theme/tokens';

// export default function ContactListScreen() {
//   const colorScheme = useColorScheme();
//   const isDark = colorScheme === 'dark';
//   const [searchQuery, setSearchQuery] = useState('');
//   const [refreshing, setRefreshing] = useState(false);

//   const { conversations, contacts, searchContacts, setCurrentConversation } = useChatStore();

//   const filteredContacts = useMemo(() => {
//     if (!searchQuery.trim()) return contacts;
//     return searchContacts(searchQuery);
//   }, [searchQuery, contacts, searchContacts]);

//   // Organize contacts: Pinned conversations first, then active, then all
//   const organizedData = useMemo(() => {
//     const pinned = conversations.filter((c) => c.isPinned && !c.archivedAt);
//     const active = conversations.filter((c) => !c.isPinned && !c.archivedAt);
//     const archived = conversations.filter((c) => c.archivedAt);

//     return [
//       ...(pinned.length > 0 ? [{ title: 'PINNED', data: pinned }] : []),
//       ...(active.length > 0 ? [{ title: 'MESSAGES', data: active }] : []),
//       ...(archived.length > 0 ? [{ title: 'ARCHIVED', data: archived }] : []),
//     ];
//   }, [conversations]);

//   const handleContactPress = useCallback(
//     (conversationId: string) => {
//       setCurrentConversation(conversationId);
//       router.push(`/(chat)/${conversationId}`);
//     },
//     [setCurrentConversation],
//   );

//   const onRefresh = useCallback(() => {
//     setRefreshing(true);
//     // Simulate loading
//     setTimeout(() => setRefreshing(false), 1000);
//   }, []);

//   const renderConversation = ({ item, index }: any) => (
//     <ConversationRow
//       conversation={item}
//       onPress={() => handleContactPress(item.id)}
//       isDark={isDark}
//     />
//   );

//   const renderSectionHeader = ({ section }: any) => (
//     <Text style={[styles.sectionHeader, isDark && styles.sectionHeaderDark]}>
//       {section.title}
//     </Text>
//   );

//   return (
//     <View style={[styles.container, isDark && styles.containerDark]}>
//       {/* Header */}
//       <View style={[styles.header, isDark && styles.headerDark]}>
//         <View style={styles.headerTop}>
//           <Text style={[styles.title, isDark && styles.titleDark]}>Messages</Text>
//           <View style={styles.headerActions}>
//             <Pressable style={[styles.iconBtn, isDark && styles.iconBtnDark]}>
//               <MaterialCommunityIcons name="magnify" size={24} color={isDark ? '#fff' : '#111'} />
//             </Pressable>
//             <Pressable style={[styles.iconBtn, isDark && styles.iconBtnDark]}>
//               <MaterialCommunityIcons name="plus" size={24} color={isDark ? '#fff' : '#111'} />
//             </Pressable>
//           </View>
//         </View>

//         {/* Search Bar */}
//         <View style={[styles.searchContainer, isDark && styles.searchContainerDark]}>
//           <MaterialCommunityIcons name="magnify" size={20} color={isDark ? '#888' : '#999'} />
//           <TextInput
//             style={[styles.searchInput, isDark && styles.searchInputDark]}
//             placeholder="Search conversations..."
//             placeholderTextColor={isDark ? '#888' : '#999'}
//             value={searchQuery}
//             onChangeText={setSearchQuery}
//           />
//           {searchQuery.length > 0 && (
//             <Pressable onPress={() => setSearchQuery('')}>
//               <MaterialCommunityIcons name="close" size={20} color={isDark ? '#888' : '#999'} />
//             </Pressable>
//           )}
//         </View>
//       </View>

//       {/* Conversations List */}
//       <SectionList
//         sections={organizedData}
//         keyExtractor={(item) => item.id}
//         renderItem={renderConversation}
//         renderSectionHeader={renderSectionHeader}
//         refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
//         contentContainerStyle={styles.listContent}
//         stickySectionHeadersEnabled
//         ListEmptyComponent={
//           <View style={styles.empty}>
//             <MaterialCommunityIcons
//               name="chat-outline"
//               size={64}
//               color={isDark ? '#444' : '#ddd'}
//             />
//             <Text style={[styles.emptyText, isDark && styles.emptyTextDark]}>
//               No conversations yet
//             </Text>
//           </View>
//         }
//       />
//       <BottomTabs />
//     </View>
//   );
// }

// function ConversationRow({ conversation, onPress, isDark }: any) {
//   const participant = conversation.participantIds[0]; // Simplified

//   return (
//     <Pressable
//       onPress={onPress}
//       style={[styles.conversationRow, isDark && styles.conversationRowDark]}
//     >
//       <View style={styles.avatar}>
//         <Image
//           source={{
//             uri: 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + participant,
//           }}
//           style={styles.avatarImage}
//         />
//         {conversation.isOnline && <View style={styles.onlineBadge} />}
//       </View>

//       <View style={styles.content}>
//         <View style={styles.nameRow}>
//           <Text style={[styles.name, isDark && styles.nameDark]} numberOfLines={1}>
//             {conversation.participantName}
//           </Text>
//           <Text style={[styles.time, isDark && styles.timeDark]}>
//             {new Date(conversation.updatedAt).toLocaleTimeString([], {
//               hour: '2-digit',
//               minute: '2-digit',
//             })}
//           </Text>
//         </View>
//         <Text style={[styles.preview, isDark && styles.previewDark]} numberOfLines={1}>
//           {conversation.lastMessage?.text || 'No messages'}
//         </Text>
//       </View>

//       {conversation.unreadCount > 0 && (
//         <View style={styles.badge}>
//           <Text style={styles.badgeText}>{conversation.unreadCount}</Text>
//         </View>
//       )}
//     </Pressable>
//   );
// }

// const getStyles = (isDark: boolean) => StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: colors.canvas,
//   },
//   containerDark: {
//     backgroundColor: '#1a1a1a',
//   },
//   header: {
//     backgroundColor: colors.canvas,
//     paddingTop: 16,
//     paddingHorizontal: spacing.md,
//     borderBottomWidth: 1,
//     borderBottomColor: colors.line,
//   },
//   headerDark: {
//     backgroundColor: '#0a0a0a',
//     borderBottomColor: '#333',
//   },
//   headerTop: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: spacing.md,
//   },
//   title: {
//     fontSize: 32,
//     fontWeight: '700',
//     color: colors.text,
//   },
//   titleDark: {
//     color: '#fff',
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
//   searchContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: spacing.sm,
//     backgroundColor: colors.surfaceAccent,
//     borderRadius: 24,
//     paddingHorizontal: spacing.md,
//     marginBottom: spacing.md,
//     height: 40,
//   },
//   searchContainerDark: {
//     backgroundColor: '#222',
//   },
//   searchInput: {
//     flex: 1,
//     fontSize: typography.body,
//     color: colors.text,
//   },
//   searchInputDark: {
//     color: '#fff',
//   },
//   listContent: {
//     paddingTop: spacing.sm,
//   },
//   sectionHeader: {
//     fontSize: 12,
//     fontWeight: '700',
//     color: colors.textMuted,
//     paddingHorizontal: spacing.md,
//     paddingVertical: spacing.sm,
//     backgroundColor: colors.canvasMuted,
//   },
//   sectionHeaderDark: {
//     color: isDark ? '#aaa' : '#888',
//     backgroundColor: '#0a0a0a',
//   },
//   conversationRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: spacing.md,
//     paddingVertical: spacing.md,
//     borderBottomWidth: 1,
//     borderBottomColor: colors.line,
//   },
//   conversationRowDark: {
//     borderBottomColor: '#222',
//   },
//   avatar: {
//     position: 'relative',
//     marginRight: spacing.md,
//   },
//   avatarImage: {
//     width: 56,
//     height: 56,
//     borderRadius: 28,
//   },
//   onlineBadge: {
//     position: 'absolute',
//     bottom: 0,
//     right: 0,
//     width: 14,
//     height: 14,
//     borderRadius: 7,
//     backgroundColor: colors.success,
//     borderWidth: 2,
//     borderColor: colors.canvas,
//   },
//   content: {
//     flex: 1,
//   },
//   nameRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 4,
//   },
//   name: {
//     fontSize: 13,
//     fontWeight: '600',
//     color: colors.text,
//     flex: 1,
//   },
//   nameDark: {
//     color: '#fff',
//   },
//   time: {
//     fontSize: 13,
//     color: colors.textMuted,
//   },
//   timeDark: {
//     color: isDark ? '#aaa' : '#888',
//   },
//   preview: {
//     fontSize: 13,
//     color: colors.textMuted,
//   },
//   previewDark: {
//     color: isDark ? '#aaa' : '#888',
//   },
//   badge: {
//     width: 24,
//     height: 24,
//     borderRadius: 12,
//     backgroundColor: colors.sky,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginLeft: spacing.sm,
//   },
//   badgeText: {
//     color: '#fff',
//     fontSize: 12,
//     fontWeight: '700',
//   },
//   empty: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingVertical: 60,
//   },
//   emptyText: {
//     fontSize: 16,
//     color: colors.textMuted,
//     marginTop: spacing.md,
//   },
//   emptyTextDark: {
//     color: isDark ? '#aaa' : '#888',
//   },
// });
import { useState, useCallback, useRef } from 'react';
import { useColorScheme } from 'react-native';
import {
  StyleSheet, Text, View, TextInput, Pressable, FlatList, Modal,
  ScrollView, Switch, Alert, TouchableOpacity, SafeAreaView,
} from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useThemeStore } from '@/src/store/theme-store';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BottomTabs } from '@/src/components/bottom-tabs';

// ─── Types ────────────────────────────────────────────────────────────────────
type ChatTab = 'Chats' | 'Updates' | 'Communities' | 'Calls';
type FilterTab = 'All' | 'Unread' | 'Favorites' | 'Groups';

type GozyConversation = {
  id: string; name: string; avatar?: string; initials?: string;
  avatarColor?: string; lastMessage: string; time: string; unread: number;
  isPinned?: boolean; isFavorite?: boolean; isGroup?: boolean; isOnline?: boolean;
  messageType?: 'text' | 'voice' | 'video' | 'image' | 'doc';
  module?: 'flight' | 'hotel' | 'cab' | 'train' | 'food' | 'shopping' | null;
};

// ─── Mock Data ────────────────────────────────────────────────────────────────
const CONVERSATIONS: GozyConversation[] = [
  { id: 'tara-ai', name: 'Tara – Gozy AI', initials: 'TA', avatarColor: '#6366F1', lastMessage: '✈️ Your flight HYD→DEL is confirmed for Apr 11', time: '12:19 PM', unread: 3, isPinned: true, module: 'flight' },
  { id: 'goa-trip', name: 'Goa Trip 2026 🏖️', initials: 'GT', avatarColor: '#0EA5E9', lastMessage: 'Priya: Hotel check-in is at 3 PM guys!', time: '11:47 AM', unread: 12, isGroup: true, module: 'hotel' },
  { id: 'arjun', name: 'Arjun Mehta', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=arjun', lastMessage: 'Ok sounds good 👍', time: '10:39 AM', unread: 0, isOnline: true },
  { id: 'rahul', name: 'Rahul Sharma', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=rahul', lastMessage: '🎤 Voice message', time: '10:17 AM', unread: 0, messageType: 'voice' },
  { id: 'gozy-deals', name: 'Gozy Deals & Offers 🏷️', initials: 'GD', avatarColor: '#F59E0B', lastMessage: 'Flash Sale: 40% OFF on Maldives packages!', time: '9:55 AM', unread: 7, isGroup: true, module: 'flight' },
  { id: 'meera', name: 'Meera Krishnan', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=meera', lastMessage: '📷 Photo', time: '8:35 AM', unread: 2, messageType: 'image', isOnline: true, isFavorite: true },
  { id: 'cab', name: 'Cab Driver – Ravi (OLA)', initials: 'RD', avatarColor: '#10B981', lastMessage: 'Reached pickup. Green Hyundai i20.', time: 'Yesterday', unread: 0, module: 'cab' },
  { id: 'devteam', name: 'Gozy Dev Squad 💻', initials: 'DS', avatarColor: '#8B5CF6', lastMessage: 'Karan: best_marketing_strategy.pdf', time: 'Yesterday', unread: 1, isGroup: true, messageType: 'doc' },
  { id: 'hotel', name: 'Hotel Concierge – Taj HYD', initials: 'TH', avatarColor: '#EF4444', lastMessage: 'Room 402 ready. Late checkout approved ✅', time: '6/11', unread: 0, module: 'hotel', isFavorite: true },
  { id: 'nikitha', name: 'Nikitha R.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=nikitha', lastMessage: 'No problem 😊', time: '6/10', unread: 0, isFavorite: true },
];

const STATUS_STORIES = [
  { id: 'mine', name: 'My Status', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=me', isMine: true },
  { id: 's1', name: 'Arjun Mehta', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=arjun', hasUpdate: true },
  { id: 's2', name: 'Meera K.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=meera', hasUpdate: true },
  { id: 's3', name: 'Rahul S.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=rahul', hasUpdate: false },
  { id: 's4', name: 'Priya V.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=priya', hasUpdate: true },
];

const CHANNELS = [
  { id: 'c1', name: 'Gozy Travel Deals', initials: 'GT', color: '#00A699', last: 'Flash: Hyderabad → Goa ₹1,299 🔥', time: '11:52 AM', unread: 31 },
  { id: 'c2', name: 'Gozy Cab Offers', initials: 'GC', color: '#F59E0B', last: 'Flat 50% off on first 3 rides this week', time: '11:38 AM', unread: 23 },
  { id: 'c3', name: 'Gozy Stays & Hotels', initials: 'GS', color: '#6366F1', last: '⭐ Premium Referral Alert! Book 2 nights get 1 free', time: '11:38 AM', unread: 34 },
  { id: 'c4', name: 'Gozy Food & Dining', initials: 'GF', color: '#EF4444', last: 'New restaurants added in your city', time: '10:54 AM', unread: 0 },
  { id: 'c5', name: 'Gozy Tech Updates', initials: 'GU', color: '#8B5CF6', last: 'App v3.2 released with AI voice booking', time: 'Yesterday', unread: 1 },
];

const COMMUNITIES = [
  {
    id: 'com1', name: 'Gozy Travellers Community', initials: 'GT', color: '#00A699',
    groups: [
      { id: 'g1', name: 'Announcements', last: 'New flight routes added 🛫', time: '10:39 AM', unread: 5, initials: '📢', color: '#22C55E' },
      { id: 'g2', name: 'Goa Group 2026', last: 'Kiran: Hotel booked!', time: '8:22 AM', unread: 2, initials: 'GG', color: '#0EA5E9' },
      { id: 'g3', name: 'Budget Flyers', last: 'Sai: Check this deal!', time: 'Yesterday', unread: 0, initials: 'BF', color: '#F59E0B' },
    ]
  },
  {
    id: 'com2', name: 'Gozy Food Lovers', initials: 'GF', color: '#EF4444',
    groups: [
      { id: 'g4', name: 'Announcements', last: 'New restaurant partners in HYD', time: '9:14 AM', unread: 1, initials: '📢', color: '#22C55E' },
      { id: 'g5', name: 'Restaurant Reviews', last: 'Meera: Paradise Biryani 10/10', time: 'Yesterday', unread: 0, initials: 'RR', color: '#EF4444' },
    ]
  },
];

const RECENT_CALLS = [
  { id: 'cl1', name: 'Arjun Mehta', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=arjun', type: 'incoming', callType: 'voice', time: '5 minutes ago', missed: false },
  { id: 'cl2', name: 'Meera Krishnan', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=meera', type: 'incoming', callType: 'video', time: 'Today, 8:35 AM', missed: false },
  { id: 'cl3', name: 'Meera Krishnan', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=meera', type: 'incoming', callType: 'video', time: 'Yesterday, 8:55 PM', missed: false },
  { id: 'cl4', name: 'Rahul Sharma', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=rahul', type: 'incoming', callType: 'voice', time: 'Yesterday, 8:48 PM', missed: true },
  { id: 'cl5', name: 'Priya V.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=priya', type: 'outgoing', callType: 'voice', time: 'Yesterday, 6:11 PM', missed: false },
];

const CONTEXT_OPTS = ['Add to Favorites', 'View contact', 'Mark as unread', 'Mute notifications', 'Clear chat', 'Block'];

const FILTER_TABS: FilterTab[] = ['All', 'Unread', 'Favorites', 'Groups'];

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function GozyChatHub() {
  const colorScheme = useColorScheme();
  const { theme, toggleTheme } = useThemeStore();
  const isDark = theme === 'system' ? colorScheme === 'dark' : theme === 'dark';
  const styles = getStyles(isDark);
  const insets = useSafeAreaInsets();
  const [chatTab, setChatTab] = useState<ChatTab>('Chats');
  const [showSettings, setShowSettings] = useState(false);
  const [showNewList, setShowNewList] = useState(false);
  const [showScheduleCall, setShowScheduleCall] = useState(false);
  const [showKeypad, setShowKeypad] = useState(false);

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      {/* ── Tab Content ── */}
      {chatTab === 'Chats' && (
        <ChatsTab isDark={isDark}
          onSettings={() => setShowSettings(true)}
          onNewList={() => setShowNewList(true)}
          onPress={(id, conv) => {
            if (id === 'tara-ai') router.push('/(chat)/assistant');
            else router.push({
              pathname: '/(chat)/[conversationId]',
              params: {
                conversationId: id,
                name: conv.name,
                avatar: conv.avatar || '',
                isGroup: conv.isGroup ? 'true' : 'false',
                isOnline: conv.isOnline ? 'true' : 'false',
              },
            });
          }}
        />
      )}
      {chatTab === 'Updates' && <UpdatesTab isDark={isDark} />}
      {chatTab === 'Communities' && <CommunitiesTab isDark={isDark} />}
      {chatTab === 'Calls' && (
        <CallsTab isDark={isDark}
          onSchedule={() => setShowScheduleCall(true)}
          onKeypad={() => setShowKeypad(true)}
        />
      )}

      {/* ── Inner Bottom Nav ── */}
      <View style={styles.chatNav}>
        {(['Chats', 'Updates', 'Communities', 'Home', 'Calls'] as const).map((tab) => {
          const isActive = chatTab === tab;
          const icons: Record<string, string> = {
            Chats: isActive ? 'message-text' : 'message-text-outline',
            Updates: isActive ? 'circle-slice-8' : 'circle-outline',
            Communities: isActive ? 'account-group' : 'account-group-outline',
            Home: 'home-outline',
            Calls: isActive ? 'phone' : 'phone-outline',
          };
          const totalUnread = CONVERSATIONS.reduce((s, c) => s + c.unread, 0);
          return (
            <Pressable key={tab} onPress={() => {
              if (tab === 'Home') router.push('/(explore)');
              else setChatTab(tab as ChatTab);
            }} style={styles.chatNavItem}>
              <View>
                <MaterialCommunityIcons name={icons[tab] as any} size={22} color={isActive ? '#00A699' : '#777'} />
                {tab === 'Chats' && totalUnread > 0 && (
                  <View style={styles.navBadge}>
                    <Text style={styles.navBadgeText}>{totalUnread > 99 ? '99+' : totalUnread}</Text>
                  </View>
                )}
              </View>
              <Text style={[styles.chatNavLabel, isActive && styles.chatNavLabelActive]}>{tab}</Text>
            </Pressable>
          );
        })}
      </View>

      {/* ── App Bottom Tabs removed ── */}

      {/* ── Modals ── */}
      <SettingsModal isDark={isDark} visible={showSettings} onClose={() => setShowSettings(false)} />
      <NewListModal isDark={isDark} visible={showNewList} onClose={() => setShowNewList(false)} />
      <ScheduleCallModal isDark={isDark} visible={showScheduleCall} onClose={() => setShowScheduleCall(false)} />
      <KeypadModal isDark={isDark} visible={showKeypad} onClose={() => setShowKeypad(false)} />
    </View>
  );
}

// ─── Chats Tab ────────────────────────────────────────────────────────────────
function ChatsTab({ onSettings, onNewList, onPress, isDark }: { onSettings: () => void; onNewList: () => void; onPress: (id: string, conv: GozyConversation) => void; isDark: boolean }) {
  const styles = getStyles(isDark);
  const { toggleTheme, theme } = useThemeStore();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterTab>('All');
  const [convs, setConvs] = useState(CONVERSATIONS);
  const [contextMenu, setContextMenu] = useState(false);
  const [selected, setSelected] = useState<GozyConversation | null>(null);

  const totalUnread = convs.reduce((s, c) => s + c.unread, 0);

  const filtered = convs.filter(c => {
    const q = search.toLowerCase();
    const match = c.name.toLowerCase().includes(q) || c.lastMessage.toLowerCase().includes(q);
    if (!match) return false;
    if (filter === 'Unread') return c.unread > 0;
    if (filter === 'Favorites') return c.isFavorite;
    if (filter === 'Groups') return c.isGroup;
    return true;
  });

  const pinned = filtered.filter(c => c.isPinned);
  const rest = filtered.filter(c => !c.isPinned);
  const allItems = [...pinned, ...rest];

  const placeholder =
    filter === 'Unread' ? 'Search unread chats' :
    filter === 'Favorites' ? 'Search favorite chats' :
    filter === 'Groups' ? 'Search group chats' : 'Ask Tara or Search';

  return (
    <View style={{ flex: 1 }}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image source={require('@/assets/images/logo.svg')} style={{ width: 80, height: 32 }} contentFit="contain" />
        </View>
        <View style={styles.headerRight}>
          <Pressable style={styles.hIcon}><MaterialCommunityIcons name="currency-inr" size={24} color={isDark ? '#fff' : '#111'} /></Pressable>
          <Pressable style={styles.hIcon}><MaterialCommunityIcons name="camera-outline" size={24} color={isDark ? '#fff' : '#111'} /></Pressable>
          <Pressable style={styles.hIcon} onPress={onSettings}><MaterialCommunityIcons name="menu" size={26} color={isDark ? '#fff' : '#111'} /></Pressable>
        </View>
      </View>

      {/* Search */}
      <View style={styles.searchBar}>
        <MaterialCommunityIcons name="magnify" size={20} color={isDark ? '#aaa' : '#888'} />
        <TextInput style={styles.searchInput} placeholder={placeholder} placeholderTextColor="#888" value={search} onChangeText={setSearch} />
        {search.length > 0 && <Pressable onPress={() => setSearch('')}><MaterialCommunityIcons name="close" size={18} color={isDark ? '#aaa' : '#888'} /></Pressable>}
      </View>

      {/* Filter Tabs */}
      <View style={styles.tabRow}>
        {FILTER_TABS.map(tab => {
          const active = filter === tab;
          const label = tab === 'Unread' && totalUnread > 0 ? `Unread ${totalUnread}` : tab === 'Groups' ? `Groups ${convs.filter(c => c.isGroup).length}` : tab;
          return (
            <Pressable key={tab} onPress={() => setFilter(tab)} style={[styles.tab, active && styles.tabActive]}>
              <Text style={[styles.tabText, active && styles.tabTextActive]}>{label}</Text>
            </Pressable>
          );
        })}
        <Pressable style={styles.tabAdd} onPress={onNewList}>
          <MaterialCommunityIcons name="plus" size={16} color={isDark ? '#ccc' : '#555'} />
        </Pressable>
      </View>

      {/* List */}
      <FlatList
        data={allItems}
        keyExtractor={i => i.id}
        renderItem={({ item }) => (
          <ConvRow isDark={isDark} conv={item} onPress={() => onPress(item.id, item)} onLongPress={() => { setSelected(item); setContextMenu(true); }} />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name={filter === 'Favorites' ? 'heart-outline' : 'chat-sleep-outline'} size={72} color="#e0e0e0" />
            <Text style={styles.emptyTitle}>{filter === 'Favorites' ? 'Add to your Favorites list' : 'No chats yet'}</Text>
            <Text style={styles.emptySub}>{filter === 'Favorites' ? 'See your favorites in Chats and Calls. Add as many people or groups as you want.' : 'Start a Gozy conversation!'}</Text>
            {filter === 'Favorites' && <Pressable><Text style={styles.emptyAction}>Add people or groups</Text></Pressable>}
          </View>
        }
      />

      {/* FAB */}
      <Pressable style={styles.fab} onPress={() => router.push('/(chat)/assistant')}>
        <MaterialCommunityIcons name="plus" size={26} color="#fff" />
      </Pressable>

      {/* Context Menu */}
      <Modal visible={contextMenu} transparent animationType="fade" onRequestClose={() => setContextMenu(false)}>
        <Pressable style={styles.ctxOverlay} onPress={() => setContextMenu(false)}>
          <View style={styles.ctxMenu}>
            {[
              { label: selected?.isFavorite ? 'Remove from Favorites' : 'Add to Favorites', action: () => setConvs(cs => cs.map(c => c.id === selected?.id ? { ...c, isFavorite: !c.isFavorite } : c)) },
              { label: 'View contact', action: () => Alert.alert('Contact', `View ${selected?.name}'s profile`) },
              { label: selected?.unread === 0 ? 'Mark as unread' : 'Mark as read', action: () => setConvs(cs => cs.map(c => c.id === selected?.id ? { ...c, unread: c.unread > 0 ? 0 : 1 } : c)) },
              { label: 'Mute notifications', action: () => Alert.alert('Muted', `Notifications muted for ${selected?.name}`) },
              { label: 'Clear chat', action: () => Alert.alert('Cleared', `Chat with ${selected?.name} cleared`) },
              { label: 'Block', action: () => Alert.alert('Blocked', `${selected?.name} has been blocked`) },
            ].map((opt, i, arr) => (
              <Pressable key={opt.label} style={[styles.ctxItem, i < arr.length - 1 && styles.ctxDivider]} onPress={() => { setContextMenu(false); opt.action(); }}>
                <Text style={[styles.ctxText, opt.label === 'Block' && { color: '#EF4444' }]}>{opt.label}</Text>
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

// ─── Updates Tab ──────────────────────────────────────────────────────────────
function UpdatesTab({ isDark }: { isDark: boolean }) {
  const styles = getStyles(isDark);
  return (
    <View style={{ flex: 1 }}>
      <View style={styles.header}>
        <Text style={styles.pageTitle}>Updates</Text>
        <View style={styles.headerRight}>
          <Pressable style={styles.hIcon}><MaterialCommunityIcons name="magnify" size={22} color={isDark ? '#fff' : '#111'} /></Pressable>
          <Pressable style={styles.hIcon}><MaterialCommunityIcons name="dots-vertical" size={22} color={isDark ? '#fff' : '#111'} /></Pressable>
        </View>
      </View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
        {/* Status */}
        <Text style={styles.sectionLabel}>Status</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 12, paddingVertical: 8, gap: 12 }}>
          {STATUS_STORIES.map(s => (
            <Pressable key={s.id} style={{ alignItems: 'center', width: 68 }}>
              <View style={[styles.storyRing, s.isMine && styles.storyMine, !s.isMine && s.hasUpdate && styles.storyActive]}>
                <Image source={{ uri: s.avatar }} style={styles.storyImg} />
                {s.isMine && <View style={styles.storyPlusBtn}><MaterialCommunityIcons name="plus" size={14} color="#fff" /></View>}
              </View>
              <Text style={styles.storyName} numberOfLines={1}>{s.isMine ? 'Add status' : s.name.split(' ')[0]}</Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Channels */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
          <Text style={styles.sectionLabel}>Channels</Text>
          <Pressable style={{ marginRight: 16 }}><Text style={{ color: '#00A699', fontSize: 13, fontWeight: '600' }}>Find channels</Text></Pressable>
        </View>
        {CHANNELS.map(ch => (
          <Pressable key={ch.id} style={styles.row}>
            <View style={[styles.initBox, { backgroundColor: ch.color }]}>
              <Text style={styles.initText}>{ch.initials}</Text>
            </View>
            <View style={styles.rowContent}>
              <View style={styles.rowTop}>
                <Text style={styles.rowName} numberOfLines={1}>{ch.name}</Text>
                <Text style={[styles.rowTime, ch.unread > 0 && styles.rowTimeUnread]}>{ch.time}</Text>
              </View>
              <View style={styles.rowBottom}>
                <Text style={styles.rowPreview} numberOfLines={1}>{ch.last}</Text>
                {ch.unread > 0 && <View style={styles.badge}><Text style={styles.badgeText}>{ch.unread}</Text></View>}
              </View>
            </View>
          </Pressable>
        ))}
      </ScrollView>

      {/* FAB */}
      <Pressable style={[styles.fab, { right: 16 }]}>
        <MaterialCommunityIcons name="camera-plus-outline" size={22} color="#fff" />
      </Pressable>
    </View>
  );
}

// ─── Communities Tab ──────────────────────────────────────────────────────────
function CommunitiesTab({ isDark }: { isDark: boolean }) {
  const styles = getStyles(isDark);
  return (
    <View style={{ flex: 1 }}>
      <View style={styles.header}>
        <Text style={styles.pageTitle}>Communities</Text>
        <Pressable style={styles.hIcon}><MaterialCommunityIcons name="dots-vertical" size={22} color={isDark ? '#fff' : '#111'} /></Pressable>
      </View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
        {/* New Community */}
        <Pressable style={[styles.row, { paddingVertical: 16 }]}>
          <View style={[styles.initBox, { backgroundColor: isDark ? '#0A2E1F' : '#E8F5E9' }]}>
            <MaterialCommunityIcons name="account-group-outline" size={24} color="#00A699" />
          </View>
          <View style={{ marginLeft: 4 }}>
            <Text style={{ fontSize: 16, fontWeight: '500', color: isDark ? '#fff' : '#111' }}>New community</Text>
          </View>
        </Pressable>
        <View style={styles.divider} />

        {COMMUNITIES.map(com => (
          <View key={com.id} style={{ marginBottom: 8 }}>
            <Pressable style={[styles.row, { paddingVertical: 12 }]}>
              <View style={[styles.initBox, { backgroundColor: com.color }]}>
                <Text style={styles.initText}>{com.initials}</Text>
              </View>
              <View style={styles.rowContent}>
                <Text style={[styles.rowName, { fontSize: 16 }]} numberOfLines={1}>{com.name}</Text>
              </View>
            </Pressable>
            {com.groups.slice(0, 3).map(g => (
              <Pressable key={g.id} style={[styles.row, { paddingLeft: 32 }]}>
                <View style={[styles.initBox, { backgroundColor: g.color, width: 40, height: 40, borderRadius: 20 }]}>
                  <Text style={[styles.initText, { fontSize: 14 }]}>{g.initials}</Text>
                </View>
                <View style={styles.rowContent}>
                  <View style={styles.rowTop}>
                    <Text style={styles.rowName} numberOfLines={1}>{g.name}</Text>
                    <Text style={[styles.rowTime, g.unread > 0 && styles.rowTimeUnread]}>{g.time}</Text>
                  </View>
                  <View style={styles.rowBottom}>
                    <Text style={styles.rowPreview} numberOfLines={1}>{g.last}</Text>
                    {g.unread > 0 && <View style={styles.badge}><Text style={styles.badgeText}>{g.unread}</Text></View>}
                  </View>
                </View>
              </Pressable>
            ))}
            <Pressable style={{ paddingLeft: 84, paddingVertical: 8 }}>
              <Text style={{ color: isDark ? '#ccc' : '#555', fontSize: 13 }}>{'>'} View all</Text>
            </Pressable>
            <View style={styles.divider} />
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

// ─── Calls Tab ────────────────────────────────────────────────────────────────
function CallsTab({ onSchedule, onKeypad, isDark }: { onSchedule: () => void; onKeypad: () => void; isDark: boolean }) {
  const styles = getStyles(isDark);
  const [showMenu, setShowMenu] = useState(false);
  const [calls, setCalls] = useState(RECENT_CALLS);
  return (
    <View style={{ flex: 1 }}>
      <View style={styles.header}>
        <Text style={styles.pageTitle}>Calls</Text>
        <View style={styles.headerRight}>
          <Pressable style={styles.hIcon}><MaterialCommunityIcons name="magnify" size={22} color={isDark ? '#fff' : '#111'} /></Pressable>
          <Pressable style={styles.hIcon} onPress={() => setShowMenu(true)}><MaterialCommunityIcons name="dots-vertical" size={22} color={isDark ? '#fff' : '#111'} /></Pressable>
        </View>
      </View>

      {/* Calls three-dots dropdown */}
      <Modal visible={showMenu} transparent animationType="fade" onRequestClose={() => setShowMenu(false)}>
        <Pressable style={{ flex: 1, backgroundColor: isDark ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.1)' }} onPress={() => setShowMenu(false)} />
        <View style={{ position: 'absolute', top: 48, right: 8, backgroundColor: isDark ? '#1a1a1a' : '#fff', borderRadius: 12, paddingVertical: 4, minWidth: 220, elevation: 12, shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 8 }}>
          {[
            { icon: 'phone-plus-outline', label: 'New call', action: () => Alert.alert('New Call', 'Select a contact to call') },
            { icon: 'calendar-outline', label: 'Schedule a call', action: onSchedule },
            { icon: 'dialpad', label: 'Keypad', action: onKeypad },
            { icon: 'heart-outline', label: 'Favorites', action: () => Alert.alert('Favorites', 'Your favorite contacts appear here') },
            { icon: 'delete-sweep-outline', label: 'Clear call log', action: () => { setCalls([]); Alert.alert('Cleared', 'Call log cleared'); } },
          ].map((item, i, arr) => (
            <Pressable key={item.label} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 13, paddingHorizontal: 18, borderBottomWidth: i < arr.length - 1 ? 0.5 : 0, borderColor: '#f0f0f0' }} onPress={() => { setShowMenu(false); item.action(); }}>
              <MaterialCommunityIcons name={item.icon as any} size={20} color={item.label === 'Clear call log' ? '#EF4444' : '#555'} style={{ marginRight: 14 }} />
              <Text style={{ fontSize: 15, color: item.label === 'Clear call log' ? '#EF4444' : '#111' }}>{item.label}</Text>
            </Pressable>
          ))}
        </View>
      </Modal>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
        {/* Quick Actions */}
        <View style={styles.callActions}>
          {[
            { icon: 'phone-outline', label: 'Call' },
            { icon: 'calendar-outline', label: 'Schedule', fn: onSchedule },
            { icon: 'dialpad', label: 'Keypad', fn: onKeypad },
            { icon: 'heart-outline', label: 'Favorites' },
          ].map(a => (
            <Pressable key={a.label} style={styles.callActionBtn} onPress={a.fn}>
              <View style={styles.callActionIcon}>
                <MaterialCommunityIcons name={a.icon as any} size={24} color={isDark ? '#ccc' : '#555'} />
              </View>
              <Text style={styles.callActionLabel}>{a.label}</Text>
            </Pressable>
          ))}
        </View>

        <Text style={[styles.sectionLabel, { marginTop: 8 }]}>Recent</Text>
        {calls.map(call => (
          <Pressable key={call.id} style={styles.row} onPress={() => Alert.alert(call.callType === 'video' ? 'Video Call' : 'Voice Call', `Calling ${call.name}...`)}>
            <Image source={{ uri: call.avatar }} style={[styles.avatarImg, { marginRight: 14 }]} />
            <View style={styles.rowContent}>
              <Text style={[styles.rowName, call.missed && { color: '#EF4444' }]}>{call.name}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 }}>
                <MaterialCommunityIcons
                  name={call.type === 'incoming' ? 'arrow-bottom-left' : 'arrow-top-right'}
                  size={14}
                  color={call.missed ? '#EF4444' : '#00A699'}
                />
                <Text style={styles.rowPreview}>{call.callType === 'video' ? '📹 Video · ' : '📞 Voice · '}{call.time}</Text>
              </View>
            </View>
            <Pressable style={{ padding: 8 }} onPress={() => Alert.alert(call.callType === 'video' ? 'Video Call' : 'Voice Call', `Calling ${call.name}...`)}>
              <MaterialCommunityIcons
                name={call.callType === 'video' ? 'video-outline' : 'phone-outline'}
                size={22} color="#00A699"
              />
            </Pressable>
          </Pressable>
        ))}
      </ScrollView>

      {/* FAB */}
      <Pressable style={styles.fab} onPress={() => Alert.alert('New Call', 'Select a contact to start a call')}>
        <MaterialCommunityIcons name="phone-plus-outline" size={22} color="#fff" />
      </Pressable>
    </View>
  );
}

// ─── Conversation Row ─────────────────────────────────────────────────────────
function ConvRow({ conv, onPress, onLongPress, isDark }: { conv: GozyConversation; onPress: () => void; onLongPress: () => void; isDark: boolean }) {
  const styles = getStyles(isDark);
  const iconMap: Record<string, string> = { flight: '✈️', hotel: '🏨', cab: '🚖', train: '🚂', food: '🍔', shopping: '🛍️' };
  const typeMap: Record<string, string> = { voice: '🎤 Voice message', video: '📹 Video call', image: '📷 Photo', doc: '📄 Document' };
  const preview = (conv.messageType && typeMap[conv.messageType]) || conv.lastMessage;
  const modIcon = conv.module ? iconMap[conv.module] : '';

  return (
    <Pressable onPress={onPress} onLongPress={onLongPress} style={({ pressed }) => [styles.row, pressed && { backgroundColor: isDark ? '#1a1a1a' : '#f5f5f5' }]}>
      <View style={styles.avatarWrap}>
        {conv.avatar
          ? <Image source={{ uri: conv.avatar }} style={styles.avatarImg} />
          : <View style={[styles.initBox, { width: 52, height: 52, borderRadius: 26, backgroundColor: conv.avatarColor || '#888' }]}><Text style={[styles.initText, { fontSize: 18 }]}>{conv.initials}</Text></View>}
        {conv.isOnline && <View style={styles.onlineDot} />}
        {conv.isPinned && <View style={styles.pinBadge}><MaterialCommunityIcons name="pin" size={8} color="#fff" /></View>}
      </View>
      <View style={styles.rowContent}>
        <View style={styles.rowTop}>
          <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
            {conv.isFavorite && <MaterialCommunityIcons name="star" size={12} color="#F59E0B" style={{ marginRight: 3 }} />}
            <Text style={styles.rowName} numberOfLines={1}>{conv.name}</Text>
          </View>
          <Text style={[styles.rowTime, conv.unread > 0 && styles.rowTimeUnread]}>{conv.time}</Text>
        </View>
        <View style={styles.rowBottom}>
          <Text style={[styles.rowPreview, conv.unread > 0 && { color: '#444', fontWeight: '500' }]} numberOfLines={1}>{modIcon ? `${modIcon} ` : ''}{preview}</Text>
          {conv.unread > 0 && <View style={styles.badge}><Text style={styles.badgeText}>{conv.unread > 99 ? '99+' : conv.unread}</Text></View>}
        </View>
      </View>
    </Pressable>
  );
}

// ─── Settings Modal ───────────────────────────────────────────────────────────
type SettingsView =
  | 'main' | 'account' | 'privacy' | 'lists' | 'chatSettings'
  | 'broadcasts' | 'notifications' | 'storageAndData' | 'networkUsage'
  | 'accessibility' | 'appLanguage' | 'helpFeedback' | 'appUpdates'
  | 'qrCode' | 'accountSwitcher'
  | 'passkeys' | 'emailAddress' | 'twoStep' | 'securityNotifs'
  | 'changeNumber' | 'requestInfo' | 'adPrefs' | 'deleteAccount';

const ALL_LANGUAGES = [
  { name: 'English', sub: "device's language" },
  { name: 'हिन्दी', sub: 'Hindi' }, { name: 'मराठी', sub: 'Marathi' },
  { name: 'ગુજરાતી', sub: 'Gujarati' }, { name: 'தமிழ்', sub: 'Tamil' },
  { name: 'বাংলা', sub: 'Bangla' }, { name: 'తెలుగు', sub: 'Telugu' },
  { name: 'ಕನ್ನಡ', sub: 'Kannada' }, { name: 'മലയാളം', sub: 'Malayalam' },
  { name: 'ਪੰਜਾਬੀ', sub: 'Punjabi' }, { name: 'اردو', sub: 'Urdu' },
  { name: 'Afrikaans', sub: 'Afrikaans' }, { name: 'Shqip', sub: 'Albanian' },
  { name: 'አማርኛ', sub: 'Amharic' }, { name: 'العربية', sub: 'Arabic' },
  { name: 'Azərbaycan dili', sub: 'Azerbaijani' }, { name: 'Български', sub: 'Bulgarian' },
  { name: 'Català', sub: 'Catalan' }, { name: '简体中文', sub: 'Simplified Chinese' },
  { name: '繁體中文（香港）', sub: 'Traditional Chinese (Hong Kong)' },
  { name: '繁體中文（台灣）', sub: 'Traditional Chinese (Taiwan)' },
  { name: 'Hrvatski', sub: 'Croatian' }, { name: 'Čeština', sub: 'Czech' },
  { name: 'Dansk', sub: 'Danish' }, { name: 'Nederlands', sub: 'Dutch' },
  { name: 'Eesti', sub: 'Estonian' }, { name: 'Filipino', sub: 'Filipino' },
  { name: 'Suomi', sub: 'Finnish' }, { name: 'Français', sub: 'French' },
  { name: 'Deutsch', sub: 'German' }, { name: 'Ελληνικά', sub: 'Greek' },
  { name: 'Hausa', sub: 'Hausa' }, { name: 'עברית', sub: 'Hebrew' },
  { name: 'Magyar', sub: 'Hungarian' },
];

function SettingsModal({ visible, onClose, isDark }: { visible: boolean; onClose: () => void; isDark: boolean }) {
  const styles = getStyles(isDark);
  const [view, setView] = useState<SettingsView>('main');
  const [readReceipts, setReadReceipts] = useState(true);
  const [mediaVisibility, setMediaVisibility] = useState(true);
  const [keepArchived, setKeepArchived] = useState(true);
  const [newListName, setNewListName] = useState('');
  // Notifications
  const [convTones, setConvTones] = useState(true);
  const [reminders, setReminders] = useState(true);
  const [highPriority, setHighPriority] = useState(true);
  const [reactionNotifs, setReactionNotifs] = useState(true);
  const [statusHighPriority, setStatusHighPriority] = useState(true);
  const [statusReactions, setStatusReactions] = useState(true);
  // Storage
  const [lessDataCalls, setLessDataCalls] = useState(false);
  // Accessibility
  const [increaseContrast, setIncreaseContrast] = useState(false);
  // App updates
  const [autoUpdate, setAutoUpdate] = useState(true);
  const [updateAnyNetwork, setUpdateAnyNetwork] = useState(false);
  const [updateNotif, setUpdateNotif] = useState(true);
  // Language
  const [selectedLang, setSelectedLang] = useState('English');
  // Account switcher
  const [showAccSwitcher, setShowAccSwitcher] = useState(false);

  const back = () => setView('main');
  const backTo = (v: SettingsView) => setView(v);

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={{ flex: 1, backgroundColor: isDark ? '#121212' : '#fff' }}>
        {/* MAIN SETTINGS */}
        {view === 'main' && (
          <>
            <View style={styles.modalHeader}>
              <Pressable onPress={onClose} style={styles.hIcon}><MaterialCommunityIcons name="arrow-left" size={24} color={isDark ? '#fff' : '#111'} /></Pressable>
              <Text style={styles.modalTitle}>Settings</Text>
              <Pressable style={styles.hIcon}><MaterialCommunityIcons name="magnify" size={22} color={isDark ? '#fff' : '#111'} /></Pressable>
            </View>
            <ScrollView>
              {/* Security Banner */}
              <View style={styles.verifyBanner}>
                <MaterialCommunityIcons name="shield-check" size={22} color="#00A699" />
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={{ fontSize: 14, fontWeight: '700', color: isDark ? '#fff' : '#111' }}>Verify with email</Text>
                  <Text style={{ fontSize: 12, color: isDark ? '#ccc' : '#555' }}>Use email to log in or if you need to recover your account. <Text style={{ color: '#00A699', fontWeight: '700' }}>Add email</Text></Text>
                </View>
                <Pressable><MaterialCommunityIcons name="close" size={18} color={isDark ? '#aaa' : '#888'} /></Pressable>
              </View>

              {/* Profile */}
              <Pressable style={[styles.row, { paddingVertical: 16 }]}>
                <View style={[styles.initBox, { width: 56, height: 56, borderRadius: 28, backgroundColor: '#00A699', marginRight: 12 }]}>
                  <Text style={[styles.initText, { fontSize: 22 }]}>VN</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 17, fontWeight: '700', color: isDark ? '#fff' : '#111' }}>V Nikshitha</Text>
                  <Text style={{ fontSize: 13, color: '#00A699' }}>How's your morning? 😊</Text>
                </View>
                <Pressable onPress={() => setView('qrCode')}>
                  <MaterialCommunityIcons name="qrcode" size={24} color={isDark ? '#ccc' : '#555'} style={{ marginRight: 12 }} />
                </Pressable>
                <Pressable onPress={() => setShowAccSwitcher(true)}>
                  <MaterialCommunityIcons name="plus-circle-outline" size={24} color={isDark ? '#ccc' : '#555'} />
                </Pressable>
              </Pressable>
              <View style={styles.divider} />

              {[
                { icon: 'key-outline', label: 'Account', sub: 'Security notifications, change number', fn: () => setView('account') },
                { icon: 'lock-outline', label: 'Privacy', sub: 'Blocked accounts, disappearing messages', fn: () => setView('privacy') },
                { icon: 'format-list-bulleted', label: 'Lists', sub: 'Manage people and groups', fn: () => setView('lists') },
                { icon: 'chat-outline', label: 'Chats', sub: 'Theme, wallpapers, chat history', fn: () => setView('chatSettings') },
                { icon: 'bullhorn-outline', label: 'Broadcasts', sub: 'Manage lists and send broadcasts', fn: () => setView('broadcasts') },
                { icon: 'bell-outline', label: 'Notifications', sub: 'Message, group & call tones', fn: () => setView('notifications') },
                { icon: 'database-outline', label: 'Storage and data', sub: 'Network usage, auto-download', fn: () => setView('storageAndData') },
                { icon: 'human', label: 'Accessibility', sub: 'Increase contrast, animation', fn: () => setView('accessibility') },
                { icon: 'web', label: 'App language', sub: selectedLang + (selectedLang === 'English' ? " (device's language)" : ''), fn: () => setView('appLanguage') },
                { icon: 'help-circle-outline', label: 'Help and feedback', sub: 'Help center, contact us, privacy policy', fn: () => setView('helpFeedback') },
                { icon: 'account-plus-outline', label: 'Invite a friend', sub: '', fn: () => Alert.alert('Invite', 'Share Gozy with friends!') },
                { icon: 'cellphone-arrow-down', label: 'App updates', sub: '', fn: () => setView('appUpdates') },
              ].map(item => (
                <Pressable key={item.label} style={styles.settingsRow} onPress={item.fn}>
                  <MaterialCommunityIcons name={item.icon as any} size={22} color={isDark ? '#ccc' : '#555'} style={{ marginRight: 16 }} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.settingsLabel}>{item.label}</Text>
                    {item.sub ? <Text style={styles.settingsSub}>{item.sub}</Text> : null}
                  </View>
                  <MaterialCommunityIcons name="chevron-right" size={20} color="#ccc" />
                </Pressable>
              ))}

              {/* Gozy Accounts Center */}
              <View style={{ margin: 16, padding: 16, backgroundColor: '#F8FAFC', borderRadius: 12 }}>
                <Text style={{ fontSize: 13, fontWeight: '800', color: '#6366F1', marginBottom: 4 }}>∞ Gozy</Text>
                <Text style={{ fontSize: 15, fontWeight: '700', color: isDark ? '#fff' : '#111' }}>Accounts Center</Text>
                <Text style={{ fontSize: 12, color: isDark ? '#ccc' : '#555', marginTop: 4 }}>Control your experience across Gozy Flights, Hotels, Cabs, and more.</Text>
              </View>
            </ScrollView>
          </>
        )}

        {/* ACCOUNT */}
        {view === 'account' && (
          <>
            <View style={styles.modalHeader}>
              <Pressable onPress={back} style={styles.hIcon}><MaterialCommunityIcons name="arrow-left" size={24} color={isDark ? '#fff' : '#111'} /></Pressable>
              <Text style={styles.modalTitle}>Account</Text>
            </View>
            <ScrollView>
              <Pressable style={styles.settingsRow} onPress={() => setShowAccSwitcher(true)}>
                <MaterialCommunityIcons name="account-plus-outline" size={22} color={isDark ? '#ccc' : '#555'} style={{ marginRight: 16 }} />
                <Text style={[styles.settingsLabel, { flex: 1 }]}>Add account</Text>
                <MaterialCommunityIcons name="chevron-right" size={20} color="#ccc" />
              </Pressable>
              <View style={styles.divider} />
              <Text style={styles.settingsGroupLabel}>Login and security</Text>
              {[
                { icon: 'key-variant', label: 'Passkeys', sub: 'Use your fingerprint or face to sign in', fn: () => setView('passkeys') },
                { icon: 'email-outline', label: 'Email address', sub: 'Add or update your email', fn: () => setView('emailAddress') },
                { icon: 'lock-check-outline', label: 'Two-step verification', sub: 'Add extra security to your account', fn: () => setView('twoStep') },
                { icon: 'bell-ring-outline', label: 'Security notifications', sub: 'Get alerts about account activity', fn: () => setView('securityNotifs') },
              ].map(item => (
                <Pressable key={item.label} style={styles.settingsRow} onPress={item.fn}>
                  <MaterialCommunityIcons name={item.icon as any} size={22} color={isDark ? '#ccc' : '#555'} style={{ marginRight: 16 }} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.settingsLabel}>{item.label}</Text>
                    <Text style={styles.settingsSub}>{item.sub}</Text>
                  </View>
                  <MaterialCommunityIcons name="chevron-right" size={20} color="#ccc" />
                </Pressable>
              ))}
              <View style={styles.divider} />
              <Text style={styles.settingsGroupLabel}>Your account</Text>
              {[
                { icon: 'phone-settings-outline', label: 'Change phone number', sub: '', fn: () => setView('changeNumber') },
                { icon: 'download-outline', label: 'Request account info', sub: 'Get a report of your account data', fn: () => setView('requestInfo') },
                { icon: 'advertisement', label: 'Ad preferences for Status & Channels', sub: '', fn: () => setView('adPrefs') },
                { icon: 'delete-forever-outline', label: 'Delete account', sub: '', fn: () => setView('deleteAccount') },
              ].map(item => (
                <Pressable key={item.label} style={styles.settingsRow} onPress={item.fn}>
                  <MaterialCommunityIcons name={item.icon as any} size={22} color={item.label === 'Delete account' ? '#EF4444' : '#555'} style={{ marginRight: 16 }} />
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.settingsLabel, item.label === 'Delete account' && { color: '#EF4444' }]}>{item.label}</Text>
                    {item.sub ? <Text style={styles.settingsSub}>{item.sub}</Text> : null}
                  </View>
                  <MaterialCommunityIcons name="chevron-right" size={20} color={item.label === 'Delete account' ? '#EF4444' : '#ccc'} />
                </Pressable>
              ))}
            </ScrollView>
          </>
        )}

        {/* PASSKEYS */}
        {view === 'passkeys' && (
          <>
            <View style={styles.modalHeader}>
              <Pressable onPress={() => backTo('account')} style={styles.hIcon}><MaterialCommunityIcons name="arrow-left" size={24} color={isDark ? '#fff' : '#111'} /></Pressable>
              <Text style={styles.modalTitle}>Passkeys</Text>
            </View>
            <ScrollView>
              <View style={{ padding: 24, alignItems: 'center' }}>
                <MaterialCommunityIcons name="fingerprint" size={72} color="#00A699" style={{ marginBottom: 16 }} />
                <Text style={{ fontSize: 20, fontWeight: '700', color: isDark ? '#fff' : '#111', marginBottom: 8 }}>Sign in with your biometrics</Text>
                <Text style={{ fontSize: 14, color: '#666', textAlign: 'center', lineHeight: 22, marginBottom: 24 }}>Passkeys let you sign in to Gozy securely using your fingerprint, face, or screen lock — no password needed.</Text>
                <Pressable style={{ backgroundColor: '#00A699', paddingVertical: 14, paddingHorizontal: 32, borderRadius: 28 }} onPress={() => Alert.alert('Passkey Created', 'Your biometric passkey has been set up successfully!')}>
                  <Text style={{ color: '#fff', fontWeight: '700', fontSize: 16 }}>Create a passkey</Text>
                </Pressable>
              </View>
            </ScrollView>
          </>
        )}

        {/* EMAIL ADDRESS */}
        {view === 'emailAddress' && (
          <>
            <View style={styles.modalHeader}>
              <Pressable onPress={() => backTo('account')} style={styles.hIcon}><MaterialCommunityIcons name="arrow-left" size={24} color={isDark ? '#fff' : '#111'} /></Pressable>
              <Text style={styles.modalTitle}>Email address</Text>
            </View>
            <ScrollView>
              <View style={{ padding: 20 }}>
                <Text style={{ fontSize: 14, color: isDark ? '#ccc' : '#555', marginBottom: 8 }}>Your email address</Text>
                <View style={styles.listNameInput}>
                  <MaterialCommunityIcons name="email-outline" size={20} color={isDark ? '#aaa' : '#888'} />
                  <TextInput placeholder="Add your email address" style={{ flex: 1, fontSize: 16, marginLeft: 8 }} keyboardType="email-address" />
                </View>
                <Text style={{ fontSize: 12, color: isDark ? '#aaa' : '#888', marginTop: 10 }}>Use email to log in or recover your account if you lose access to your phone number.</Text>
                <Pressable style={{ backgroundColor: '#00A699', paddingVertical: 14, borderRadius: 28, alignItems: 'center', marginTop: 24 }} onPress={() => Alert.alert('Saved', 'Email address saved')}>
                  <Text style={{ color: '#fff', fontWeight: '700', fontSize: 16 }}>Save email</Text>
                </Pressable>
              </View>
            </ScrollView>
          </>
        )}

        {/* TWO-STEP VERIFICATION */}
        {view === 'twoStep' && (
          <>
            <View style={styles.modalHeader}>
              <Pressable onPress={() => backTo('account')} style={styles.hIcon}><MaterialCommunityIcons name="arrow-left" size={24} color={isDark ? '#fff' : '#111'} /></Pressable>
              <Text style={styles.modalTitle}>Two-step verification</Text>
            </View>
            <ScrollView>
              <View style={{ padding: 24, alignItems: 'center' }}>
                <MaterialCommunityIcons name="lock-check-outline" size={72} color="#00A699" style={{ marginBottom: 16 }} />
                <Text style={{ fontSize: 20, fontWeight: '700', color: isDark ? '#fff' : '#111', marginBottom: 8 }}>Secure your account</Text>
                <Text style={{ fontSize: 14, color: '#666', textAlign: 'center', lineHeight: 22, marginBottom: 24 }}>Two-step verification adds an extra layer of security. You'll be asked to enter a 6-digit PIN whenever you register your phone number with Gozy again.</Text>
                <Pressable style={{ backgroundColor: '#00A699', paddingVertical: 14, paddingHorizontal: 32, borderRadius: 28 }} onPress={() => Alert.alert('2-Step Enabled', 'Two-step verification has been enabled')}>
                  <Text style={{ color: '#fff', fontWeight: '700', fontSize: 16 }}>Enable</Text>
                </Pressable>
              </View>
            </ScrollView>
          </>
        )}

        {/* SECURITY NOTIFICATIONS */}
        {view === 'securityNotifs' && (
          <>
            <View style={styles.modalHeader}>
              <Pressable onPress={() => backTo('account')} style={styles.hIcon}><MaterialCommunityIcons name="arrow-left" size={24} color={isDark ? '#fff' : '#111'} /></Pressable>
              <Text style={styles.modalTitle}>Security notifications</Text>
            </View>
            <ScrollView>
              <View style={{ padding: 16 }}>
                <Text style={{ fontSize: 14, color: isDark ? '#ccc' : '#555', lineHeight: 22, marginBottom: 20 }}>Show security notifications in this device whenever your security code changes with one of your contacts.</Text>
                <View style={[styles.settingsRow, { justifyContent: 'space-between' }]}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.settingsLabel}>Show security notifications</Text>
                    <Text style={styles.settingsSub}>When enabled, a notification is shown when a contact's security code changes</Text>
                  </View>
                  <Switch value={true} trackColor={{ true: '#00A699' }} />
                </View>
              </View>
            </ScrollView>
          </>
        )}

        {/* CHANGE PHONE NUMBER */}
        {view === 'changeNumber' && (
          <>
            <View style={styles.modalHeader}>
              <Pressable onPress={() => backTo('account')} style={styles.hIcon}><MaterialCommunityIcons name="arrow-left" size={24} color={isDark ? '#fff' : '#111'} /></Pressable>
              <Text style={styles.modalTitle}>Change phone number</Text>
            </View>
            <ScrollView>
              <View style={{ padding: 20 }}>
                <Text style={{ fontSize: 14, color: isDark ? '#ccc' : '#555', lineHeight: 22, marginBottom: 16 }}>Your current number is <Text style={{ fontWeight: '700', color: isDark ? '#fff' : '#111' }}>+91 93475 56415</Text>. Enter a new number below.</Text>
                <Text style={{ fontSize: 13, color: isDark ? '#aaa' : '#888', marginBottom: 6 }}>New phone number</Text>
                <View style={styles.listNameInput}>
                  <Text style={{ fontSize: 16, color: isDark ? '#ccc' : '#555', marginRight: 8 }}>+91</Text>
                  <TextInput placeholder="Enter new number" style={{ flex: 1, fontSize: 16 }} keyboardType="phone-pad" />
                </View>
                <Pressable style={{ backgroundColor: '#00A699', paddingVertical: 14, borderRadius: 28, alignItems: 'center', marginTop: 24 }} onPress={() => Alert.alert('OTP Sent', 'An OTP has been sent to your new number')}>
                  <Text style={{ color: '#fff', fontWeight: '700', fontSize: 16 }}>Send OTP</Text>
                </Pressable>
              </View>
            </ScrollView>
          </>
        )}

        {/* REQUEST ACCOUNT INFO */}
        {view === 'requestInfo' && (
          <>
            <View style={styles.modalHeader}>
              <Pressable onPress={() => backTo('account')} style={styles.hIcon}><MaterialCommunityIcons name="arrow-left" size={24} color={isDark ? '#fff' : '#111'} /></Pressable>
              <Text style={styles.modalTitle}>Request account info</Text>
            </View>
            <ScrollView>
              <View style={{ padding: 24 }}>
                <Text style={{ fontSize: 15, fontWeight: '600', color: isDark ? '#fff' : '#111', marginBottom: 8 }}>Your Gozy account data report</Text>
                <Text style={{ fontSize: 14, color: isDark ? '#ccc' : '#555', lineHeight: 22, marginBottom: 24 }}>You can request a report of your account information including your profile, settings, and other account-related data. The report will be ready in about 3 days.</Text>
                {['Account information', 'Business account information', 'Support history'].map(item => (
                  <View key={item} style={[styles.settingsRow, { justifyContent: 'space-between' }]}>
                    <Text style={styles.settingsLabel}>{item}</Text>
                    <MaterialCommunityIcons name="checkbox-marked-outline" size={22} color="#00A699" />
                  </View>
                ))}
                <Pressable style={{ backgroundColor: '#00A699', paddingVertical: 14, borderRadius: 28, alignItems: 'center', marginTop: 24 }} onPress={() => Alert.alert('Request Submitted', 'Your account info report will be ready in ~3 days')}>
                  <Text style={{ color: '#fff', fontWeight: '700', fontSize: 16 }}>Request report</Text>
                </Pressable>
              </View>
            </ScrollView>
          </>
        )}

        {/* AD PREFERENCES */}
        {view === 'adPrefs' && (
          <>
            <View style={styles.modalHeader}>
              <Pressable onPress={() => backTo('account')} style={styles.hIcon}><MaterialCommunityIcons name="arrow-left" size={24} color={isDark ? '#fff' : '#111'} /></Pressable>
              <Text style={styles.modalTitle}>Ad preferences</Text>
            </View>
            <ScrollView>
              <View style={{ padding: 16 }}>
                <Text style={{ fontSize: 14, color: isDark ? '#ccc' : '#555', lineHeight: 22, marginBottom: 16 }}>Manage how Gozy uses your data for ads shown in Status and Channels.</Text>
                {[
                  { label: 'Personalised ads', sub: 'Allow Gozy to show relevant ads based on your activity', val: true },
                  { label: 'Ad topics', sub: 'See fewer ads on specific topics', val: false },
                ].map(s => (
                  <View key={s.label} style={[styles.settingsRow, { justifyContent: 'space-between' }]}>
                    <View style={{ flex: 1, marginRight: 12 }}>
                      <Text style={styles.settingsLabel}>{s.label}</Text>
                      <Text style={styles.settingsSub}>{s.sub}</Text>
                    </View>
                    <Switch value={s.val} trackColor={{ true: '#00A699' }} />
                  </View>
                ))}
              </View>
            </ScrollView>
          </>
        )}

        {/* DELETE ACCOUNT */}
        {view === 'deleteAccount' && (
          <>
            <View style={styles.modalHeader}>
              <Pressable onPress={() => backTo('account')} style={styles.hIcon}><MaterialCommunityIcons name="arrow-left" size={24} color={isDark ? '#fff' : '#111'} /></Pressable>
              <Text style={styles.modalTitle}>Delete account</Text>
            </View>
            <ScrollView>
              <View style={{ padding: 24 }}>
                <MaterialCommunityIcons name="alert-circle-outline" size={60} color="#EF4444" style={{ alignSelf: 'center', marginBottom: 16 }} />
                <Text style={{ fontSize: 16, fontWeight: '700', color: isDark ? '#fff' : '#111', marginBottom: 8, textAlign: 'center' }}>Delete your Gozy account?</Text>
                <Text style={{ fontSize: 14, color: isDark ? '#ccc' : '#555', lineHeight: 22, marginBottom: 16 }}>Deleting your account will:</Text>
                {['Delete your account from Gozy', 'Erase your message history', 'Delete you from all your Gozy groups', 'Delete your Gozy Backup'].map(item => (
                  <View key={item} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                    <MaterialCommunityIcons name="close-circle" size={18} color="#EF4444" style={{ marginRight: 10 }} />
                    <Text style={{ fontSize: 14, color: isDark ? '#ccc' : '#555' }}>{item}</Text>
                  </View>
                ))}
                <Text style={{ fontSize: 13, color: isDark ? '#aaa' : '#888', marginBottom: 8, marginTop: 8 }}>Enter your phone number to confirm</Text>
                <View style={styles.listNameInput}>
                  <TextInput placeholder="+91 XXXXX XXXXX" style={{ flex: 1, fontSize: 16 }} keyboardType="phone-pad" />
                </View>
                <Pressable style={{ backgroundColor: '#EF4444', paddingVertical: 14, borderRadius: 28, alignItems: 'center', marginTop: 24 }} onPress={() => Alert.alert('Are you sure?', 'This action cannot be undone. All your data will be permanently deleted.', [{ text: 'Cancel', style: 'cancel' }, { text: 'Delete', style: 'destructive', onPress: () => Alert.alert('Account Deleted', 'Your account has been deleted') }])}>
                  <Text style={{ color: '#fff', fontWeight: '700', fontSize: 16 }}>Delete my account</Text>
                </Pressable>
              </View>
            </ScrollView>
          </>
        )}

        {/* PRIVACY */}
        {view === 'privacy' && (
          <>
            <View style={styles.modalHeader}>
              <Pressable onPress={back} style={styles.hIcon}><MaterialCommunityIcons name="arrow-left" size={24} color={isDark ? '#fff' : '#111'} /></Pressable>
              <Text style={styles.modalTitle}>Privacy</Text>
            </View>
            <ScrollView>
              <Text style={styles.settingsGroupLabel}>Who can see my personal info</Text>
              {[
                { label: 'Last seen and online', value: 'Nobody' },
                { label: 'Profile picture', value: 'My contacts' },
                { label: 'About', value: 'Everyone' },
                { label: 'Links', value: 'My contacts' },
                { label: 'Status', value: '109 contacts selected' },
              ].map(item => (
                <Pressable key={item.label} style={styles.settingsRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.settingsLabel}>{item.label}</Text>
                    <Text style={styles.settingsSub}>{item.value}</Text>
                  </View>
                </Pressable>
              ))}
              <Pressable style={[styles.settingsRow, { justifyContent: 'space-between' }]}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.settingsLabel}>Read receipts</Text>
                  <Text style={styles.settingsSub}>If turned off, you won't send or receive Read receipts.</Text>
                </View>
                <Switch value={readReceipts} onValueChange={setReadReceipts} trackColor={{ true: '#00A699' }} />
              </Pressable>
              <View style={styles.divider} />
              <Text style={styles.settingsGroupLabel}>Disappearing messages</Text>
              {['Default message timer', 'Groups', 'Avatar stickers', 'Live location', 'Calls', 'Contacts', 'App lock', 'Chat lock', 'Advanced', 'Privacy checkup'].map(item => (
                <Pressable key={item} style={styles.settingsRow}>
                  <Text style={styles.settingsLabel}>{item}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </>
        )}

        {/* LISTS */}
        {view === 'lists' && (
          <>
            <View style={styles.modalHeader}>
              <Pressable onPress={back} style={styles.hIcon}><MaterialCommunityIcons name="arrow-left" size={24} color={isDark ? '#fff' : '#111'} /></Pressable>
              <Text style={styles.modalTitle}>Lists</Text>
              <Pressable style={styles.hIcon}><MaterialCommunityIcons name="pencil-outline" size={22} color={isDark ? '#fff' : '#111'} /></Pressable>
            </View>
            <ScrollView contentContainerStyle={{ alignItems: 'center', paddingTop: 32 }}>
              <View style={{ flexDirection: 'row', gap: 8, marginBottom: 20 }}>
                {['heart-outline', 'briefcase-outline', 'plus-circle-outline'].map((icon, i) => (
                  <View key={i} style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: isDark ? '#0A2E1F' : '#E8F5E9', alignItems: 'center', justifyContent: 'center' }}>
                    <MaterialCommunityIcons name={icon as any} size={28} color="#00A699" />
                  </View>
                ))}
              </View>
              <Text style={{ fontSize: 14, color: isDark ? '#ccc' : '#555', textAlign: 'center', paddingHorizontal: 40, marginBottom: 24 }}>Any list you create becomes a filter at the top of your Chats tab.</Text>
              <Pressable style={styles.createListBtn}>
                <MaterialCommunityIcons name="plus" size={18} color="#00A699" />
                <Text style={{ color: '#00A699', fontWeight: '700', fontSize: 14 }}>Create a custom list</Text>
              </Pressable>
              <View style={{ width: '100%', marginTop: 24 }}>
                <Text style={styles.settingsGroupLabel}>Your lists</Text>
                {[{ name: 'Unread', sub: 'Preset' }, { name: 'Favorites', sub: 'Add people or groups' }, { name: 'Groups', sub: 'Preset' }].map(l => (
                  <View key={l.name} style={styles.settingsRow}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.settingsLabel}>{l.name}</Text>
                      <Text style={styles.settingsSub}>{l.sub}</Text>
                    </View>
                  </View>
                ))}
                <Text style={styles.settingsGroupLabel}>Available presets</Text>
                <View style={[styles.settingsRow, { justifyContent: 'space-between' }]}>
                  <View>
                    <Text style={styles.settingsLabel}>Communities</Text>
                    <Text style={styles.settingsSub}>Preset</Text>
                  </View>
                  <Pressable style={styles.addPresetBtn}><Text style={{ color: '#00A699', fontWeight: '700' }}>Add</Text></Pressable>
                </View>
              </View>
            </ScrollView>
          </>
        )}

        {/* CHAT SETTINGS */}
        {view === 'chatSettings' && (
          <>
            <View style={styles.modalHeader}>
              <Pressable onPress={back} style={styles.hIcon}><MaterialCommunityIcons name="arrow-left" size={24} color={isDark ? '#fff' : '#111'} /></Pressable>
              <Text style={styles.modalTitle}>Chats</Text>
            </View>
            <ScrollView>
              <Text style={styles.settingsGroupLabel}>Display</Text>
              <Pressable style={styles.settingsRow}><MaterialCommunityIcons name="palette-outline" size={22} color={isDark ? '#ccc' : '#555'} style={{ marginRight: 16 }} /><View><Text style={styles.settingsLabel}>Theme</Text><Text style={styles.settingsSub}>System default</Text></View></Pressable>
              <Pressable style={styles.settingsRow}><MaterialCommunityIcons name="brush-outline" size={22} color={isDark ? '#ccc' : '#555'} style={{ marginRight: 16 }} /><Text style={styles.settingsLabel}>Default chat theme</Text></Pressable>
              <Text style={styles.settingsGroupLabel}>Chat settings</Text>
              {[
                { label: 'Enter is send', sub: 'Enter key will send your message', toggle: false },
                { label: 'Media visibility', sub: 'Show newly downloaded media in your gallery', toggle: true },
              ].map(s => (
                <View key={s.label} style={[styles.settingsRow, { justifyContent: 'space-between' }]}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.settingsLabel}>{s.label}</Text>
                    <Text style={styles.settingsSub}>{s.sub}</Text>
                  </View>
                  <Switch value={s.toggle ? mediaVisibility : false} onValueChange={s.toggle ? setMediaVisibility : undefined} trackColor={{ true: '#00A699' }} />
                </View>
              ))}
              {['Font size', 'Voice message transcripts'].map(s => (
                <Pressable key={s} style={styles.settingsRow}><Text style={styles.settingsLabel}>{s}</Text></Pressable>
              ))}
              <Text style={styles.settingsGroupLabel}>Archived chats</Text>
              <View style={[styles.settingsRow, { justifyContent: 'space-between' }]}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.settingsLabel}>Keep chats archived</Text>
                  <Text style={styles.settingsSub}>Archived chats will remain archived when you receive a new message</Text>
                </View>
                <Switch value={keepArchived} onValueChange={setKeepArchived} trackColor={{ true: '#00A699' }} />
              </View>
              {['Chat backup', 'Transfer chats', 'Chat history'].map(s => (
                <Pressable key={s} style={styles.settingsRow}>
                  <MaterialCommunityIcons name={s === 'Chat backup' ? 'cloud-upload-outline' : s === 'Transfer chats' ? 'transfer-right' : 'history'} size={22} color={isDark ? '#ccc' : '#555'} style={{ marginRight: 16 }} />
                  <Text style={styles.settingsLabel}>{s}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </>
        )}

        {/* BROADCASTS */}
        {view === 'broadcasts' && (
          <>
            <View style={styles.modalHeader}>
              <Pressable onPress={back} style={styles.hIcon}><MaterialCommunityIcons name="arrow-left" size={24} color={isDark ? '#fff' : '#111'} /></Pressable>
              <Text style={styles.modalTitle}>Broadcasts</Text>
            </View>
            <ScrollView>
              <View style={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 8 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                  <Text style={{ fontWeight: '700', fontSize: 15, color: isDark ? '#fff' : '#111' }}>This month</Text>
                  <Text style={{ color: isDark ? '#ccc' : '#555', fontSize: 13 }}>01 Jun – 30 Jun</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8, marginBottom: 4 }}>
                  <View><Text style={{ fontSize: 28, fontWeight: '700', color: isDark ? '#fff' : '#111' }}>0</Text><Text style={{ color: isDark ? '#aaa' : '#888', fontSize: 12 }}>Sent</Text></View>
                  <View style={{ alignItems: 'flex-end' }}><Text style={{ fontSize: 28, fontWeight: '700', color: isDark ? '#fff' : '#111' }}>35</Text><Text style={{ color: isDark ? '#aaa' : '#888', fontSize: 12 }}>Remaining</Text></View>
                </View>
                <View style={{ height: 4, backgroundColor: '#E5E7EB', borderRadius: 2, marginVertical: 8 }}>
                  <View style={{ width: '0%', height: 4, backgroundColor: '#00A699', borderRadius: 2 }} />
                </View>
                <Text style={{ fontSize: 12, color: isDark ? '#ccc' : '#555' }}>Send up to 35 broadcasts per month. <Text style={{ color: '#00A699', fontWeight: '700' }}>Learn more</Text></Text>
              </View>
              <View style={styles.divider} />
              <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 120 }}>
                <Text style={{ color: isDark ? '#aaa' : '#888', fontSize: 14 }}>No broadcasts</Text>
              </View>
            </ScrollView>
            <Pressable style={styles.fabGreen}>
              <MaterialCommunityIcons name="plus" size={26} color="#fff" />
            </Pressable>
          </>
        )}

        {/* NOTIFICATIONS */}
        {view === 'notifications' && (
          <>
            <View style={styles.modalHeader}>
              <Pressable onPress={back} style={styles.hIcon}><MaterialCommunityIcons name="arrow-left" size={24} color={isDark ? '#fff' : '#111'} /></Pressable>
              <Text style={styles.modalTitle}>Notifications</Text>
              <Pressable style={styles.hIcon}><MaterialCommunityIcons name="dots-vertical" size={22} color={isDark ? '#fff' : '#111'} /></Pressable>
            </View>
            <ScrollView>
              {[
                { label: 'Conversation tones', sub: 'Play sounds for incoming and outgoing messages.', val: convTones, set: setConvTones },
                { label: 'Reminders', sub: "Get occasional reminders about messages, calls or status updates you haven't seen", val: reminders, set: setReminders },
              ].map(s => (
                <View key={s.label} style={[styles.settingsRow, { justifyContent: 'space-between' }]}>
                  <View style={{ flex: 1, marginRight: 12 }}>
                    <Text style={styles.settingsLabel}>{s.label}</Text>
                    <Text style={styles.settingsSub}>{s.sub}</Text>
                  </View>
                  <Switch value={s.val} onValueChange={s.set} trackColor={{ true: '#00A699' }} />
                </View>
              ))}
              <View style={styles.divider} />
              <Text style={styles.settingsGroupLabel}>Messages</Text>
              <Pressable style={styles.settingsRow}><View style={{ flex: 1 }}><Text style={styles.settingsLabel}>Notification tone</Text><Text style={styles.settingsSub}>Default ringtone (Encounter)</Text></View></Pressable>
              <Pressable style={styles.settingsRow}><View style={{ flex: 1 }}><Text style={styles.settingsLabel}>Vibrate</Text><Text style={styles.settingsSub}>Default</Text></View></Pressable>
              <View style={styles.settingsRow}><View style={{ flex: 1 }}><Text style={[styles.settingsLabel, { color: '#bbb' }]}>Popup notification</Text><Text style={[styles.settingsSub, { color: '#bbb' }]}>Not available</Text></View></View>
              <Pressable style={styles.settingsRow}><View style={{ flex: 1 }}><Text style={styles.settingsLabel}>Light</Text><Text style={styles.settingsSub}>White</Text></View></Pressable>
              {[
                { label: 'Use high priority notifications', sub: 'Show previews of notifications at the top of the screen', val: highPriority, set: setHighPriority },
                { label: 'Reaction notifications', sub: 'Show notifications for reactions to messages you send', val: reactionNotifs, set: setReactionNotifs },
              ].map(s => (
                <View key={s.label} style={[styles.settingsRow, { justifyContent: 'space-between' }]}>
                  <View style={{ flex: 1, marginRight: 12 }}>
                    <Text style={styles.settingsLabel}>{s.label}</Text>
                    <Text style={styles.settingsSub}>{s.sub}</Text>
                  </View>
                  <Switch value={s.val} onValueChange={s.set} trackColor={{ true: '#00A699' }} />
                </View>
              ))}
              <View style={styles.divider} />
              <Text style={styles.settingsGroupLabel}>Calls</Text>
              <Pressable style={styles.settingsRow}><View style={{ flex: 1 }}><Text style={styles.settingsLabel}>Ringtone</Text><Text style={styles.settingsSub}>Default ringtone (Jovi Lifestyle)</Text></View></Pressable>
              <Pressable style={styles.settingsRow}><View style={{ flex: 1 }}><Text style={styles.settingsLabel}>Vibrate</Text><Text style={styles.settingsSub}>Default</Text></View></Pressable>
              <View style={styles.divider} />
              <Text style={styles.settingsGroupLabel}>Status</Text>
              <Pressable style={styles.settingsRow}><View style={{ flex: 1 }}><Text style={styles.settingsLabel}>Notification tone</Text><Text style={styles.settingsSub}>Default ringtone (Encounter)</Text></View></Pressable>
              <Pressable style={styles.settingsRow}><View style={{ flex: 1 }}><Text style={styles.settingsLabel}>Vibrate</Text><Text style={styles.settingsSub}>Default</Text></View></Pressable>
              {[
                { label: 'Use high priority notifications', sub: 'Show previews of notifications at the top of the screen', val: statusHighPriority, set: setStatusHighPriority },
                { label: 'Reactions', sub: 'Show notifications when you get likes on a status', val: statusReactions, set: setStatusReactions },
              ].map(s => (
                <View key={s.label + '_s'} style={[styles.settingsRow, { justifyContent: 'space-between' }]}>
                  <View style={{ flex: 1, marginRight: 12 }}>
                    <Text style={styles.settingsLabel}>{s.label}</Text>
                    <Text style={styles.settingsSub}>{s.sub}</Text>
                  </View>
                  <Switch value={s.val} onValueChange={s.set} trackColor={{ true: '#00A699' }} />
                </View>
              ))}
              <Pressable style={styles.settingsRow}><View style={{ flex: 1 }}><Text style={styles.settingsLabel}>App icon badge</Text><Text style={styles.settingsSub}>Clears when you open Gozy</Text></View></Pressable>
            </ScrollView>
          </>
        )}

        {/* STORAGE AND DATA */}
        {view === 'storageAndData' && (
          <>
            <View style={styles.modalHeader}>
              <Pressable onPress={back} style={styles.hIcon}><MaterialCommunityIcons name="arrow-left" size={24} color={isDark ? '#fff' : '#111'} /></Pressable>
              <Text style={styles.modalTitle}>Storage and data</Text>
            </View>
            <ScrollView>
              <Pressable style={styles.settingsRow}>
                <MaterialCommunityIcons name="folder-outline" size={26} color={isDark ? '#ccc' : '#555'} style={{ marginRight: 16 }} />
                <View style={{ flex: 1 }}><Text style={styles.settingsLabel}>Manage storage</Text><Text style={styles.settingsSub}>4.8 GB</Text></View>
              </Pressable>
              <Pressable style={styles.settingsRow} onPress={() => setView('networkUsage')}>
                <MaterialCommunityIcons name="refresh" size={26} color={isDark ? '#ccc' : '#555'} style={{ marginRight: 16 }} />
                <View style={{ flex: 1 }}><Text style={styles.settingsLabel}>Network usage</Text><Text style={styles.settingsSub}>5.4 GB sent · 8.6 GB received</Text></View>
              </Pressable>
              <View style={[styles.settingsRow, { justifyContent: 'space-between' }]}>
                <View style={{ flex: 1 }}><Text style={styles.settingsLabel}>Use less data for calls</Text></View>
                <Switch value={lessDataCalls} onValueChange={setLessDataCalls} trackColor={{ true: '#00A699' }} />
              </View>
              <Pressable style={styles.settingsRow}><View style={{ flex: 1 }}><Text style={styles.settingsLabel}>Proxy</Text><Text style={styles.settingsSub}>Off</Text></View></Pressable>
              <View style={styles.divider} />
              <Pressable style={styles.settingsRow}>
                <MaterialCommunityIcons name="high-definition-box" size={26} color={isDark ? '#ccc' : '#555'} style={{ marginRight: 16 }} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.settingsLabel}>Media upload quality</Text>
                  <Text style={styles.settingsSub}>Standard quality</Text>
                  <Text style={[styles.settingsLabel, { marginTop: 10 }]}>Auto-download quality</Text>
                  <Text style={styles.settingsSub}>Auto</Text>
                </View>
              </Pressable>
              <View style={styles.divider} />
              <Text style={styles.settingsGroupLabel}>Media auto-download</Text>
              <Text style={{ fontSize: 12, color: isDark ? '#aaa' : '#888', paddingHorizontal: 20, marginBottom: 8 }}>Voice messages are always automatically downloaded</Text>
              {['When using mobile data', 'When connected on Wi-Fi', 'When roaming'].map(s => (
                <Pressable key={s} style={styles.settingsRow}><View style={{ flex: 1 }}><Text style={styles.settingsLabel}>{s}</Text><Text style={styles.settingsSub}>No media</Text></View></Pressable>
              ))}
            </ScrollView>
          </>
        )}

        {/* NETWORK USAGE */}
        {view === 'networkUsage' && (
          <>
            <View style={styles.modalHeader}>
              <Pressable onPress={() => backTo('storageAndData')} style={styles.hIcon}><MaterialCommunityIcons name="arrow-left" size={24} color={isDark ? '#fff' : '#111'} /></Pressable>
              <Text style={styles.modalTitle}>Network usage</Text>
            </View>
            <ScrollView>
              <View style={{ padding: 20 }}>
                <Text style={{ fontSize: 13, color: isDark ? '#aaa' : '#888', fontWeight: '700', marginBottom: 4 }}>Usage</Text>
                <Text style={{ fontSize: 36, fontWeight: '800', color: isDark ? '#fff' : '#111' }}>14.0 <Text style={{ fontSize: 20 }}>GB</Text></Text>
                <View style={{ flexDirection: 'row', marginTop: 4, marginBottom: 16 }}>
                  <Text style={{ color: isDark ? '#ccc' : '#555', fontSize: 13, marginRight: 16 }}>↑ Sent  5.4 GB</Text>
                  <Text style={{ color: isDark ? '#ccc' : '#555', fontSize: 13 }}>↓ Received  8.6 GB</Text>
                </View>
                {[
                  { icon: 'phone-outline', label: 'Calls', up: '5.0 GB', down: '6.8 GB', bar: 0.75, sub: '210 outgoing · 205 incoming' },
                  { icon: 'image-multiple-outline', label: 'Media', up: '248.8 MB', down: '1.2 GB', bar: 0.15, sub: '' },
                  { icon: 'google-drive', label: 'Google storage', up: '0 kB', down: '0 kB', bar: 0.01, sub: '' },
                  { icon: 'message-outline', label: 'Messages', up: '67.3 MB', down: '105.8 MB', bar: 0.05, sub: '4,148 sent · 26,549 received' },
                  { icon: 'refresh', label: 'Status', up: '2.8 MB', down: '594.7 MB', bar: 0.03, sub: '27 sent · 1,874 received' },
                  { icon: 'earth', label: 'Roaming', up: '0 kB', down: '0 kB', bar: 0.0, sub: '' },
                ].map(item => (
                  <View key={item.label} style={{ marginBottom: 16 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <MaterialCommunityIcons name={item.icon as any} size={22} color={isDark ? '#ccc' : '#555'} style={{ marginRight: 8 }} />
                        <Text style={{ fontSize: 15, fontWeight: '600', color: isDark ? '#fff' : '#111' }}>{item.label}</Text>
                      </View>
                      <Text style={{ fontSize: 13, color: isDark ? '#ccc' : '#555' }}>↑ {item.up}  ↓ {item.down}</Text>
                    </View>
                    <View style={{ height: 4, backgroundColor: '#E5E7EB', borderRadius: 2 }}>
                      <View style={{ width: `${item.bar * 100}%`, height: 4, backgroundColor: '#00A699', borderRadius: 2 }} />
                    </View>
                    {item.sub ? <Text style={{ fontSize: 11, color: isDark ? '#aaa' : '#888', marginTop: 2 }}>{item.sub}</Text> : null}
                  </View>
                ))}
                <View style={styles.divider} />
                <Pressable><Text style={{ fontSize: 15, color: isDark ? '#fff' : '#111', marginTop: 12 }}>Reset statistics</Text><Text style={{ color: isDark ? '#aaa' : '#888', fontSize: 12 }}>Last reset time: Never</Text></Pressable>
              </View>
            </ScrollView>
          </>
        )}

        {/* ACCESSIBILITY */}
        {view === 'accessibility' && (
          <>
            <View style={styles.modalHeader}>
              <Pressable onPress={back} style={styles.hIcon}><MaterialCommunityIcons name="arrow-left" size={24} color={isDark ? '#fff' : '#111'} /></Pressable>
              <Text style={styles.modalTitle}>Accessibility</Text>
            </View>
            <ScrollView>
              <View style={[styles.settingsRow, { justifyContent: 'space-between' }]}>
                <View style={{ flex: 1, marginRight: 12 }}>
                  <Text style={styles.settingsLabel}>Increase contrast</Text>
                  <Text style={styles.settingsSub}>Darken key colors to make things easier to see while in light mode.</Text>
                </View>
                <Switch value={increaseContrast} onValueChange={setIncreaseContrast} trackColor={{ true: '#00A699' }} />
              </View>
              <Pressable style={styles.settingsRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.settingsLabel}>Animation</Text>
                  <Text style={styles.settingsSub}>Choose whether stickers and GIFs move automatically.</Text>
                </View>
              </Pressable>
            </ScrollView>
          </>
        )}

        {/* APP LANGUAGE */}
        {view === 'appLanguage' && (
          <>
            <View style={[styles.modalHeader, { borderBottomWidth: 0 }]}>
              <Pressable onPress={back} style={styles.hIcon}><MaterialCommunityIcons name="close" size={24} color={isDark ? '#fff' : '#111'} /></Pressable>
              <Text style={styles.modalTitle}>App language</Text>
            </View>
            <ScrollView>
              {ALL_LANGUAGES.map(lang => (
                <Pressable key={lang.name} style={styles.settingsRow} onPress={() => { setSelectedLang(lang.name); back(); }}>
                  <View style={{
                    width: 22, height: 22, borderRadius: 11, borderWidth: 2,
                    borderColor: selectedLang === lang.name ? '#00A699' : '#ccc',
                    alignItems: 'center', justifyContent: 'center', marginRight: 16,
                  }}>
                    {selectedLang === lang.name && <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: '#00A699' }} />}
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.settingsLabel}>{lang.name}</Text>
                    {lang.sub !== lang.name && <Text style={styles.settingsSub}>{lang.sub}</Text>}
                  </View>
                </Pressable>
              ))}
            </ScrollView>
          </>
        )}

        {/* HELP AND FEEDBACK */}
        {view === 'helpFeedback' && (
          <>
            <View style={styles.modalHeader}>
              <Pressable onPress={back} style={styles.hIcon}><MaterialCommunityIcons name="arrow-left" size={24} color={isDark ? '#fff' : '#111'} /></Pressable>
              <Text style={styles.modalTitle}>Help and feedback</Text>
            </View>
            <ScrollView>
              {[
                { icon: 'help-circle-outline', label: 'Help center', sub: 'Get help, contact us' },
                { icon: 'bug-outline', label: 'Send feedback', sub: 'Report technical issues' },
                { icon: 'file-document-outline', label: 'Terms and Privacy Policy', sub: '' },
                { icon: 'alert-box-outline', label: 'Channel reports', sub: '' },
                { icon: 'information-outline', label: 'App info', sub: '' },
              ].map(item => (
                <Pressable key={item.label} style={styles.settingsRow}>
                  <MaterialCommunityIcons name={item.icon as any} size={22} color={isDark ? '#ccc' : '#555'} style={{ marginRight: 16 }} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.settingsLabel}>{item.label}</Text>
                    {item.sub ? <Text style={styles.settingsSub}>{item.sub}</Text> : null}
                  </View>
                </Pressable>
              ))}
            </ScrollView>
          </>
        )}

        {/* APP UPDATES */}
        {view === 'appUpdates' && (
          <>
            <View style={styles.modalHeader}>
              <Pressable onPress={back} style={styles.hIcon}><MaterialCommunityIcons name="arrow-left" size={24} color={isDark ? '#fff' : '#111'} /></Pressable>
              <Text style={styles.modalTitle}>App update settings</Text>
            </View>
            <ScrollView>
              <Text style={styles.settingsGroupLabel}>App updates</Text>
              {[
                { label: 'Auto-update Gozy', sub: 'Automatically download app updates.', val: autoUpdate, set: setAutoUpdate },
                { label: 'Allow updates over any network', sub: 'Download updates using mobile data when Wi-Fi is not available. Data charges may apply.', val: updateAnyNetwork, set: setUpdateAnyNetwork },
              ].map(s => (
                <View key={s.label} style={[styles.settingsRow, { justifyContent: 'space-between' }]}>
                  <View style={{ flex: 1, marginRight: 12 }}>
                    <Text style={styles.settingsLabel}>{s.label}</Text>
                    <Text style={styles.settingsSub}>{s.sub}</Text>
                  </View>
                  <Switch value={s.val} onValueChange={s.set} trackColor={{ true: '#00A699' }} />
                </View>
              ))}
              <View style={styles.divider} />
              <Text style={styles.settingsGroupLabel}>Notifications</Text>
              <View style={[styles.settingsRow, { justifyContent: 'space-between' }]}>
                <View style={{ flex: 1, marginRight: 12 }}>
                  <Text style={styles.settingsLabel}>Gozy update available</Text>
                  <Text style={styles.settingsSub}>Get notified when updates are available.</Text>
                </View>
                <Switch value={updateNotif} onValueChange={setUpdateNotif} trackColor={{ true: '#00A699' }} />
              </View>
            </ScrollView>
          </>
        )}

        {/* QR CODE */}
        {view === 'qrCode' && (
          <>
            <View style={styles.modalHeader}>
              <Pressable onPress={back} style={styles.hIcon}><MaterialCommunityIcons name="arrow-left" size={24} color={isDark ? '#fff' : '#111'} /></Pressable>
              <Text style={styles.modalTitle}>QR code</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Pressable style={styles.hIcon}><MaterialCommunityIcons name="share-variant" size={22} color={isDark ? '#fff' : '#111'} /></Pressable>
                <Pressable style={styles.hIcon}><MaterialCommunityIcons name="dots-vertical" size={22} color={isDark ? '#fff' : '#111'} /></Pressable>
              </View>
            </View>
            {/* Tabs */}
            <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderColor: '#eee' }}>
              {['MY CODE', 'SCAN CODE'].map((t, i) => (
                <Pressable key={t} style={{ flex: 1, paddingVertical: 14, alignItems: 'center', borderBottomWidth: i === 0 ? 3 : 0, borderColor: '#00A699' }}>
                  <Text style={{ fontSize: 13, fontWeight: '700', color: i === 0 ? '#00A699' : '#888' }}>{t}</Text>
                </Pressable>
              ))}
            </View>
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, backgroundColor: '#F8FAFC' }}>
              <View style={[styles.initBox, { width: 64, height: 64, borderRadius: 32, backgroundColor: '#00A699', marginBottom: 12 }]}>
                <Text style={[styles.initText, { fontSize: 24 }]}>VN</Text>
              </View>
              <Text style={{ fontSize: 18, fontWeight: '700', color: isDark ? '#fff' : '#111', marginBottom: 2 }}>V Nikshitha</Text>
              <Text style={{ fontSize: 13, color: isDark ? '#aaa' : '#888', marginBottom: 24 }}>Gozy contact</Text>
              {/* Mock QR code block */}
              <View style={{ width: 220, height: 220, backgroundColor: '#fff', borderRadius: 16, alignItems: 'center', justifyContent: 'center', elevation: 4, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 8 }}>
                <View style={{ width: 180, height: 180, borderWidth: 4, borderColor: '#111', borderRadius: 4, alignItems: 'center', justifyContent: 'center' }}>
                  <MaterialCommunityIcons name="fingerprint" size={140} color="#00BFFF" />
                </View>
              </View>
              <Text style={{ fontSize: 12, color: isDark ? '#aaa' : '#888', textAlign: 'center', marginTop: 20, paddingHorizontal: 32 }}>Your QR code is private. If you share it with someone, they can scan it with their Gozy camera to add you as a contact.</Text>
            </View>
          </>
        )}

        {/* ACCOUNT SWITCHER BOTTOM SHEET */}
        <Modal visible={showAccSwitcher} transparent animationType="slide" onRequestClose={() => setShowAccSwitcher(false)}>
          <Pressable style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' }} onPress={() => setShowAccSwitcher(false)} />
          <View style={{ backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24 }}>
            <Text style={{ fontSize: 14, color: isDark ? '#ccc' : '#555', marginBottom: 16 }}>Add another Gozy account to easily switch between your accounts.</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 12, backgroundColor: '#F8FAFC', borderRadius: 12, marginBottom: 12 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={[styles.initBox, { width: 44, height: 44, borderRadius: 22, backgroundColor: '#00A699', marginRight: 12 }]}><Text style={styles.initText}>VN</Text></View>
                <View><Text style={{ fontWeight: '700', color: isDark ? '#fff' : '#111' }}>V Nikshitha</Text><Text style={{ color: isDark ? '#aaa' : '#888', fontSize: 12 }}>+91 93475 56415</Text></View>
              </View>
              <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: '#00A699', alignItems: 'center', justifyContent: 'center' }}>
                <MaterialCommunityIcons name="check" size={18} color="#fff" />
              </View>
            </View>
            <Pressable style={{ flexDirection: 'row', alignItems: 'center', padding: 12 }} onPress={() => setShowAccSwitcher(false)}>
              <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: '#E5E7EB', alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
                <MaterialCommunityIcons name="plus" size={22} color={isDark ? '#ccc' : '#555'} />
              </View>
              <Text style={{ fontSize: 15, color: isDark ? '#fff' : '#111' }}>Add Gozy account</Text>
            </Pressable>
          </View>
        </Modal>
      </SafeAreaView>
    </Modal>
  );
}

// ─── New List Modal ───────────────────────────────────────────────────────────
function NewListModal({ visible, onClose, isDark }: { visible: boolean; onClose: () => void; isDark: boolean }) {
  const styles = getStyles(isDark);
  const [name, setName] = useState('');
  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <SafeAreaView style={{ flex: 1, backgroundColor: isDark ? '#121212' : '#fff' }}>
        <View style={styles.modalHeader}>
          <Pressable onPress={onClose}><MaterialCommunityIcons name="close" size={24} color={isDark ? '#fff' : '#111'} /></Pressable>
          <Text style={styles.modalTitle}>New list</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={{ padding: 20 }}>
          <Text style={{ fontSize: 13, color: isDark ? '#ccc' : '#555', marginBottom: 8 }}>List name</Text>
          <View style={styles.listNameInput}>
            <TextInput value={name} onChangeText={setName} placeholder="Example: Work, Friends" style={{ flex: 1, fontSize: 16 }} />
            <MaterialCommunityIcons name="emoticon-outline" size={22} color={isDark ? '#aaa' : '#888'} />
          </View>
          <Text style={{ fontSize: 12, color: isDark ? '#aaa' : '#888', marginTop: 10 }}>Any list you create becomes a filter at the top of your Chats tab.</Text>
        </View>
        <View style={{ flex: 1 }} />
        <Pressable style={[styles.addPeopleBtn, { opacity: name.length > 0 ? 1 : 0.5 }]}>
          <Text style={styles.addPeopleBtnText}>Add people or groups</Text>
        </Pressable>
      </SafeAreaView>
    </Modal>
  );
}

// ─── Schedule Call Modal ──────────────────────────────────────────────────────
function ScheduleCallModal({ visible, onClose, isDark }: { visible: boolean; onClose: () => void; isDark: boolean }) {
  const styles = getStyles(isDark);
  const [callType, setCallType] = useState<'Video' | 'Voice'>('Video');
  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={{ flex: 1, backgroundColor: isDark ? '#121212' : '#fff' }}>
        <View style={styles.modalHeader}>
          <Pressable onPress={onClose} style={styles.hIcon}><MaterialCommunityIcons name="arrow-left" size={24} color={isDark ? '#fff' : '#111'} /></Pressable>
          <Text style={styles.modalTitle}>Schedule call</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={{ padding: 20 }}>
          <Text style={{ fontSize: 22, fontWeight: '700', color: isDark ? '#fff' : '#111' }}>V Nikshitha's call</Text>
          <TextInput placeholder="Description (Optional)" placeholderTextColor="#888" style={{ color: isDark ? '#ccc' : '#555', marginTop: 4, marginBottom: 24, fontSize: 14 }} />
          <View style={styles.divider} />
          {[{ label: 'Jun 12, 2026', time: '12:30 PM' }, { label: 'Jun 12, 2026', time: '1:00 PM' }].map((d, i) => (
            <View key={i} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 16 }}>
              <MaterialCommunityIcons name="calendar-outline" size={22} color={isDark ? '#ccc' : '#555'} style={{ marginRight: 16 }} />
              <Text style={{ flex: 1, fontSize: 15, color: isDark ? '#fff' : '#111' }}>{d.label}</Text>
              <Text style={{ fontSize: 15, color: isDark ? '#fff' : '#111' }}>{d.time}</Text>
            </View>
          ))}
          <Pressable style={{ paddingVertical: 12, paddingLeft: 38 }}>
            <Text style={{ fontSize: 14, color: isDark ? '#ccc' : '#555' }}>Remove end time</Text>
          </Pressable>
          <View style={styles.divider} />
          <Pressable style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 16 }}>
            <MaterialCommunityIcons name="video-outline" size={22} color={isDark ? '#ccc' : '#555'} style={{ marginRight: 16 }} />
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 15, color: isDark ? '#fff' : '#111' }}>Call type</Text>
              <Text style={{ fontSize: 13, color: isDark ? '#aaa' : '#888' }}>{callType}</Text>
            </View>
          </Pressable>
          <Pressable style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 16 }}>
            <MaterialCommunityIcons name="bell-outline" size={22} color={isDark ? '#ccc' : '#555'} style={{ marginRight: 16 }} />
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 15, color: isDark ? '#fff' : '#111' }}>Reminder</Text>
              <Text style={{ fontSize: 13, color: isDark ? '#aaa' : '#888' }}>15 minutes before</Text>
            </View>
          </Pressable>
        </View>
        <View style={{ flex: 1 }} />
        <Pressable style={[styles.fab, { position: 'relative', margin: 16, width: 56, height: 56, borderRadius: 28, alignSelf: 'flex-end' }]} onPress={onClose}>
          <MaterialCommunityIcons name="send" size={22} color="#fff" />
        </Pressable>
      </SafeAreaView>
    </Modal>
  );
}

// ─── Keypad Modal ─────────────────────────────────────────────────────────────
function KeypadModal({ visible, onClose, isDark }: { visible: boolean; onClose: () => void; isDark: boolean }) {
  const styles = getStyles(isDark);
  const [digits, setDigits] = useState('');
  const keys = [['1', '2\nABC', '3\nDEF'], ['4\nGHI', '5\nJKL', '6\nMNO'], ['7\nPQRS', '8\nTUV', '9\nWXYZ'], ['*', '0\n+', '#']];
  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={{ flex: 1, backgroundColor: isDark ? '#121212' : '#fff' }}>
        <View style={styles.modalHeader}>
          <Pressable onPress={onClose} style={styles.hIcon}><MaterialCommunityIcons name="arrow-left" size={24} color={isDark ? '#fff' : '#111'} /></Pressable>
          <View style={{ flex: 1 }} />
        </View>
        <View style={{ flex: 1, justifyContent: 'flex-end', paddingBottom: 32 }}>
          <Text style={{ textAlign: 'center', fontSize: 32, letterSpacing: 4, color: isDark ? '#fff' : '#111', marginBottom: 32, minHeight: 44 }}>{digits}</Text>
          {keys.map((row, ri) => (
            <View key={ri} style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 8 }}>
              {row.map(key => {
                const [main, sub] = key.split('\n');
                return (
                  <Pressable key={key} style={styles.dialKey} onPress={() => setDigits(d => d + main)}>
                    <Text style={styles.dialKeyMain}>{main}</Text>
                    {sub ? <Text style={styles.dialKeySub}>{sub}</Text> : null}
                  </Pressable>
                );
              })}
            </View>
          ))}
          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 12 }}>
            <Pressable style={[styles.fab, { position: 'relative' }]} onPress={() => Alert.alert('Calling...', digits)}>
              <MaterialCommunityIcons name="phone" size={26} color="#fff" />
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const getStyles = (isDark: boolean) => StyleSheet.create({
  root: { flex: 1, backgroundColor: isDark ? '#121212' : '#fff' },

  // Nav
  chatNav: { flexDirection: 'row', backgroundColor: isDark ? '#1a1a1a' : '#fff', paddingVertical: 12, marginHorizontal: 16, marginBottom: 24, borderRadius: 30, elevation: 10, shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 10, shadowOffset: { width: 0, height: 4 } },
  chatNavItem: { flex: 1, alignItems: 'center', gap: 2 },
  chatNavLabel: { fontSize: 10, color: isDark ? '#bbb' : '#777' },
  chatNavLabelActive: { color: '#00A699', fontWeight: '700' },
  navBadge: { position: 'absolute', top: -4, right: -8, backgroundColor: '#00A699', borderRadius: 10, minWidth: 18, height: 18, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4 },
  navBadgeText: { color: '#fff', fontSize: 9, fontWeight: '800' },

  // Header
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, backgroundColor: isDark ? '#121212' : '#fff' },
  brandName: { fontSize: 26, fontWeight: '800', color: '#00A699', letterSpacing: -0.5 },
  pageTitle: { fontSize: 22, fontWeight: '700', color: isDark ? '#fff' : '#111', flex: 1 },
  headerRight: { flexDirection: 'row', alignItems: 'center' },
  hIcon: { padding: 8 },

  // Search
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: isDark ? '#1e1e1e' : '#F2F4F7', borderRadius: 24, marginHorizontal: 12, marginVertical: 4, paddingHorizontal: 14, paddingVertical: 9, gap: 8 },
  searchInput: { flex: 1, fontSize: 14, color: isDark ? '#fff' : '#111' },

  // Tabs
  tabRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 6, gap: 8 },
  tab: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: isDark ? '#333' : '#E0E0E0' },
  tabActive: { backgroundColor: '#00A699', borderColor: '#00A699' },
  tabText: { fontSize: 12, color: isDark ? '#ccc' : '#555', fontWeight: '500' },
  tabTextActive: { color: '#fff', fontWeight: '700' },
  tabAdd: { width: 30, height: 30, borderRadius: 15, borderWidth: 1, borderColor: isDark ? '#333' : '#E0E0E0', alignItems: 'center', justifyContent: 'center' },

  // Row
  row: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10 },
  avatarWrap: { position: 'relative', marginRight: 12 },
  avatarImg: { width: 52, height: 52, borderRadius: 26 },
  initBox: { width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center' },
  initText: { color: '#fff', fontWeight: '800', fontSize: 16 },
  onlineDot: { position: 'absolute', bottom: 1, right: 1, width: 13, height: 13, borderRadius: 7, backgroundColor: '#25D366', borderWidth: 2, borderColor: isDark ? '#121212' : '#fff' },
  pinBadge: { position: 'absolute', top: 0, right: 0, width: 16, height: 16, borderRadius: 8, backgroundColor: '#00A699', alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: isDark ? '#121212' : '#fff' },
  rowContent: { flex: 1 },
  rowTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 },
  rowName: { fontSize: 15, fontWeight: '600', color: isDark ? '#fff' : '#111', flex: 1 },
  rowTime: { fontSize: 12, color: isDark ? '#999' : '#999', marginLeft: 8 },
  rowTimeUnread: { color: '#00A699', fontWeight: '600' },
  rowBottom: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  rowPreview: { fontSize: 13, color: isDark ? '#aaa' : '#888', flex: 1 },
  badge: { backgroundColor: '#00A699', borderRadius: 12, minWidth: 22, height: 22, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 6, marginLeft: 8 },
  badgeText: { color: '#fff', fontSize: 11, fontWeight: '800' },

  // Empty
  emptyState: { alignItems: 'center', paddingVertical: 80, paddingHorizontal: 40 },
  emptyTitle: { fontSize: 20, fontWeight: '800', color: isDark ? '#eee' : '#333', marginTop: 16, textAlign: 'center' },
  emptySub: { fontSize: 14, color: isDark ? '#aaa' : '#888', textAlign: 'center', marginTop: 8, lineHeight: 20 },
  emptyAction: { color: '#00A699', fontWeight: '700', fontSize: 14, marginTop: 16 },

  // FAB
  fab: { position: 'absolute', bottom: 96, right: 16, width: 56, height: 56, borderRadius: 28, backgroundColor: '#00A699', alignItems: 'center', justifyContent: 'center', elevation: 6, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 8, shadowOffset: { width: 0, height: 4 } },
  fabGreen: { position: 'absolute', bottom: 104, right: 20, width: 56, height: 56, borderRadius: 28, backgroundColor: '#00A699', alignItems: 'center', justifyContent: 'center', elevation: 6, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 8, shadowOffset: { width: 0, height: 4 } },

  // Context
  ctxOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)', justifyContent: 'center', alignItems: 'flex-end', paddingRight: 16, paddingTop: 80 },
  ctxMenu: { backgroundColor: isDark ? '#121212' : '#fff', borderRadius: 12, paddingVertical: 4, minWidth: 220, elevation: 10 },
  ctxItem: { paddingVertical: 14, paddingHorizontal: 20 },
  ctxDivider: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#F0F0F0' },
  ctxText: { fontSize: 15, color: isDark ? '#fff' : '#111' },

  // Status
  sectionLabel: { fontSize: 16, fontWeight: '700', color: isDark ? '#fff' : '#111', paddingHorizontal: 16, paddingTop: 12, paddingBottom: 4 },
  storyRing: { width: 60, height: 60, borderRadius: 30, borderWidth: 2, borderColor: isDark ? '#333' : '#E0E0E0', overflow: 'hidden', alignItems: 'center', justifyContent: 'center' },
  storyMine: { borderStyle: 'dashed', borderColor: '#BDBDBD' },
  storyActive: { borderColor: '#00A699', borderWidth: 2.5 },
  storyImg: { width: 56, height: 56, borderRadius: 28 },
  storyPlusBtn: { position: 'absolute', bottom: 0, right: 0, width: 20, height: 20, borderRadius: 10, backgroundColor: '#00A699', alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: isDark ? '#121212' : '#fff' },
  storyName: { fontSize: 11, color: isDark ? '#ccc' : '#555', marginTop: 4, textAlign: 'center', maxWidth: 68 },

  // Calls
  callActions: { flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 16, justifyContent: 'space-around' },
  callActionBtn: { alignItems: 'center', gap: 6 },
  callActionIcon: { width: 56, height: 56, borderRadius: 28, backgroundColor: isDark ? '#1e1e1e' : '#F2F4F7', alignItems: 'center', justifyContent: 'center' },
  callActionLabel: { fontSize: 12, color: isDark ? '#ccc' : '#555' },

  // Divider
  divider: { height: StyleSheet.hairlineWidth, backgroundColor: '#E0E0E0', marginVertical: 4 },

  // Settings
  modalHeader: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 12, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#E0E0E0' },
  modalTitle: { flex: 1, fontSize: 18, fontWeight: '700', color: isDark ? '#fff' : '#111', marginLeft: 8 },
  verifyBanner: { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: isDark ? '#0A2E1F' : '#E8F5E9', margin: 12, padding: 14, borderRadius: 10, gap: 8 },
  settingsRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#F0F0F0' },
  settingsLabel: { fontSize: 15, color: isDark ? '#fff' : '#111', fontWeight: '500' },
  settingsSub: { fontSize: 12, color: isDark ? '#aaa' : '#888', marginTop: 2 },
  settingsGroupLabel: { fontSize: 12, color: isDark ? '#aaa' : '#888', fontWeight: '600', paddingHorizontal: 16, paddingTop: 16, paddingBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 },

  // Lists
  createListBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 14, paddingHorizontal: 32, backgroundColor: isDark ? '#0A2E1F' : '#E8F5E9', borderRadius: 28 },
  addPresetBtn: { paddingHorizontal: 16, paddingVertical: 6, backgroundColor: isDark ? '#0A2E1F' : '#E8F5E9', borderRadius: 16 },

  // New List
  listNameInput: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: isDark ? '#333' : '#E0E0E0', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, gap: 8 },
  addPeopleBtn: { backgroundColor: isDark ? '#0A2E1F' : '#E8F5E9', margin: 20, paddingVertical: 16, borderRadius: 28, alignItems: 'center' },
  addPeopleBtnText: { color: '#00A699', fontWeight: '700', fontSize: 15 },

  // Keypad
  dialKey: { width: 80, height: 80, borderRadius: 40, backgroundColor: isDark ? '#1e1e1e' : '#F2F4F7', alignItems: 'center', justifyContent: 'center', marginHorizontal: 12 },
  dialKeyMain: { fontSize: 28, fontWeight: '300', color: isDark ? '#fff' : '#111' },
  dialKeySub: { fontSize: 9, color: isDark ? '#bbb' : '#777', letterSpacing: 1, marginTop: -4 },
});
