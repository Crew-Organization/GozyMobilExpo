// import { useCallback, useEffect, useRef, useState } from 'react';
// import {
//   StyleSheet,
//   Text,
//   View,
//   Pressable,
//   useColorScheme,
//   Dimensions,
//   ActivityIndicator,
//   NativeScrollEvent,
//   NativeSyntheticEvent,
// } from 'react-native';
// import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
// import { Image } from 'expo-image';
// import { FlashList } from '@shopify/flash-list';
// import Animated, {
//   useSharedValue,
//   useAnimatedStyle,
//   withSpring,
//   ZoomIn,
//   FadeIn,
//   runOnJS,
// } from 'react-native-reanimated';
// import { Video, ResizeMode } from 'expo-av';

// import { useReelsStore } from '@/src/store/reels-store';
import { BottomTabs } from '@/src/components/bottom-tabs';
// import { colors, spacing, typography } from '@/src/theme/tokens';
// import type { Reel } from '@/src/types/reels';

// const { height: screenHeight, width: screenWidth } = Dimensions.get('window');

// export default function ReelsFeedScreen() {
//   const colorScheme = useColorScheme();
//   const isDark = colorScheme === 'dark';

//   const {
//     forYouReels,
//     followingReels,
//     currentTab,
//     currentReelIndex,
//     playingReelId,
//     setForYouReels,
//     setFollowingReels,
//     setCurrentTab,
//     setCurrentReelIndex,
//     setPlayingReelId,
//     toggleLike,
//     toggleBookmark,
//     toggleFollow,
//   } = useReelsStore();

//   const [loading, setLoading] = useState(true);
//   const listRef = useRef<any>(null);
//   const videoRefs = useRef<Map<string, Video>>(new Map());

//   // Mock data
//   const mockReels: Reel[] = [
//     {
//       id: 'reel-1',
//       creatorId: 'user-1',
//       creator: {
//         id: 'user-1',
//         name: 'Sarah Anderson',
//         username: 'sarahfitness',
//         avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
//         verified: true,
//         isFollowing: false,
//         followerCount: 124000,
//       },
//       videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-library/sample/BigBuckBunny.mp4',
//       thumbnail: 'https://images.unsplash.com/photo-1535016120754-be64b975054c?w=400&q=80',
//       caption:
//         '💪 Morning workout motivation! Who else loves starting their day with some yoga? 🧘‍♀️ #fitness #yoga #motivation',
//       hashtags: ['fitness', 'yoga', 'motivation'],
//       duration: 45,
//       likeCount: 12480,
//       commentCount: 456,
//       shareCount: 234,
//       isLiked: false,
//       isBookmarked: false,
//       createdAt: new Date(Date.now() - 2 * 3600000),
//       views: 234000,
//     },
//     {
//       id: 'reel-2',
//       creatorId: 'user-2',
//       creator: {
//         id: 'user-2',
//         name: 'Alex Chen',
//         username: 'alexcooks',
//         avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex',
//         verified: true,
//         isFollowing: true,
//         followerCount: 340000,
//       },
//       videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-library/sample/ElephantsDream.mp4',
//       thumbnail: 'https://images.unsplash.com/photo-1495560886105-403b3ee504b3?w=400&q=80',
//       caption: '🍕 Best pizza recipe ever! Try this at home 👨‍🍳 #foodblog #cooking #pizza',
//       hashtags: ['foodblog', 'cooking', 'pizza'],
//       duration: 60,
//       likeCount: 34000,
//       commentCount: 1200,
//       shareCount: 890,
//       isLiked: true,
//       isBookmarked: true,
//       createdAt: new Date(Date.now() - 1 * 3600000),
//       views: 450000,
//     },
//   ];

//   useEffect(() => {
//     // Load mock data
//     setForYouReels(mockReels);
//     setFollowingReels(mockReels.reverse());
//     setLoading(false);
//   }, [setForYouReels, setFollowingReels]);

//   const reels = currentTab === 'ForYou' ? forYouReels : followingReels;

//   const handleViewableItemsChanged = useCallback(
//     ({ viewableItems }: any) => {
//       if (viewableItems.length > 0) {
//         const newIndex = viewableItems[0].index;
//         setCurrentReelIndex(newIndex);
//         setPlayingReelId(viewableItems[0].item.id);

//         // Pause other videos
//         videoRefs.current.forEach((video, key) => {
//           if (key !== viewableItems[0].item.id) {
//             video.pauseAsync();
//           } else {
//             video.playAsync();
//           }
//         });
//       }
//     },
//     [setCurrentReelIndex, setPlayingReelId],
//   );

//   const renderReel = ({ item }: { item: Reel }) => (
//     <ReelCard
//       reel={item}
//       isDark={isDark}
//       isPlaying={playingReelId === item.id}
//       onLike={() => toggleLike(item.id)}
//       onBookmark={() => toggleBookmark(item.id)}
//       onFollow={() => toggleFollow(item.creator.id)}
//       videoRef={(ref) => {
//         if (ref) videoRefs.current.set(item.id, ref);
//       }}
//     />
//   );

//   if (loading) {
//     return (
//       <View style={[styles.container, isDark && styles.containerDark, styles.loadingContainer]}>
//         <ActivityIndicator size="large" color={colors.sky} />
//       </View>
//     );
//   }

//   return (
//     <View style={[styles.container, isDark && styles.containerDark]}>
//       {/* Tab Bar */}
//       <View style={[styles.tabBar, isDark && styles.tabBarDark]}>
//         <Pressable
//           onPress={() => setCurrentTab('ForYou')}
//           style={styles.tabButton}
//         >
//           <Text
//             style={[
//               styles.tabLabel,
//               currentTab === 'ForYou' && styles.tabLabelActive,
//               isDark && styles.tabLabelDark,
//             ]}
//           >
//             For You
//           </Text>
//           {currentTab === 'ForYou' && <View style={[styles.tabIndicator, isDark && styles.tabIndicatorDark]} />}
//         </Pressable>

//         <Pressable
//           onPress={() => setCurrentTab('Following')}
//           style={styles.tabButton}
//         >
//           <Text
//             style={[
//               styles.tabLabel,
//               currentTab === 'Following' && styles.tabLabelActive,
//               isDark && styles.tabLabelDark,
//             ]}
//           >
//             Following
//           </Text>
//           {currentTab === 'Following' && <View style={[styles.tabIndicator, isDark && styles.tabIndicatorDark]} />}
//         </Pressable>
//       </View>

//       {/* Reels List */}
//       <FlashList
//         ref={listRef}
//         data={reels}
//         renderItem={renderReel}
//         keyExtractor={(item) => item.id}
//         estimatedItemSize={screenHeight}
//         pagingEnabled
//         snapToInterval={screenHeight}
//         decelerationRate="fast"
//         scrollEventThrottle={16}
//         viewabilityConfig={{
//           itemVisiblePercentThreshold: 50,
//         }}
//         onViewableItemsChanged={handleViewableItemsChanged}
//         scrollIndicatorInsets={{ right: 1 }}
//       />
//       
//     </View>
//   );
// }

// function ReelCard({
//   reel,
//   isDark,
//   isPlaying,
//   onLike,
//   onBookmark,
//   onFollow,
//   videoRef,
// }: any) {
//   const [isMuted, setIsMuted] = useState(false);
//   const [showCaption, setShowCaption] = useState(false);
//   const [progress, setProgress] = useState(0);
//   const likeScale = useSharedValue(1);
//   const videoRef_ = useRef<Video>(null);

//   const animatedLike = useAnimatedStyle(() => ({
//     transform: [{ scale: likeScale.value }],
//   }));

//   const handleDoubleTap = () => {
//     onLike();
//     likeScale.value = withSpring(1.3);
//     likeScale.value = withSpring(1);
//   };

//   const handleLikePress = () => {
//     handleDoubleTap();
//   };

//   const handleVideoProgress = (status: any) => {
//     if (status.isLoaded && status.durationMillis) {
//       setProgress((status.positionMillis / status.durationMillis) * 100);
//     }
//   };

//   return (
//     <Pressable style={styles.reelContainer} onPress={() => setIsMuted(!isMuted)}>
//       {/* Video */}
//       <Video
//         ref={(ref) => {
//           videoRef_.current = ref;
//           videoRef(ref);
//         }}
//         source={{ uri: reel.videoUrl }}
//         style={styles.video}
//         resizeMode={ResizeMode.COVER}
//         isLooping
//         isMuted={isMuted}
//         shouldPlay={isPlaying}
//         onPlaybackStatusUpdate={handleVideoProgress}
//         progressUpdateIntervalMillis={500}
//       />

//       {/* Gradient overlay */}
//       <View style={styles.gradientOverlay} />

//       {/* Progress Bar */}
//       <View style={styles.progressBar}>
//         <View
//           style={[
//             styles.progressFill,
//             {
//               width: `${progress}%`,
//             },
//           ]}
//         />
//       </View>

//       {/* Mute Button */}
//       <Pressable style={styles.muteBtn} onPress={() => setIsMuted(!isMuted)}>
//         <Ionicons
//           name={isMuted ? 'volume-off' : 'volume-high'}
//           size={24}
//           color="#fff"
//         />
//       </Pressable>

//       {/* Creator Info */}
//       <View style={styles.creatorSection}>
//         <View style={styles.creatorRow}>
//           <Image
//             source={{ uri: reel.creator.avatar }}
//             style={styles.creatorAvatar}
//           />
//           <View style={styles.creatorInfo}>
//             <View style={styles.creatorNameRow}>
//               <Text style={styles.creatorName}>{reel.creator.name}</Text>
//               {reel.creator.verified && (
//                 <MaterialCommunityIcons
//                   name="check-decagram"
//                   size={16}
//                   color="#4da6ff"
//                   style={styles.verifiedBadge}
//                 />
//               )}
//             </View>
//             <Text style={styles.creatorUsername}>@{reel.creator.username}</Text>
//           </View>
//           <Pressable
//             onPress={onFollow}
//             style={[
//               styles.followBtn,
//               reel.creator.isFollowing && styles.followBtnActive,
//             ]}
//           >
//             <Text
//               style={[
//                 styles.followBtnText,
//                 reel.creator.isFollowing && styles.followBtnTextActive,
//               ]}
//             >
//               {reel.creator.isFollowing ? 'Following' : 'Follow'}
//             </Text>
//           </Pressable>
//         </View>

//         {/* Caption */}
//         <Pressable
//           onPress={() => setShowCaption(!showCaption)}
//           style={styles.captionSection}
//         >
//           <Text
//             style={styles.caption}
//             numberOfLines={showCaption ? 0 : 2}
//           >
//             {reel.caption}
//           </Text>
//           {!showCaption && reel.caption.length > 50 && (
//             <Text style={styles.readMore}>more</Text>
//           )}
//         </Pressable>

//         {/* Hashtags */}
//         {showCaption && (
//           <View style={styles.hashtagsRow}>
//             {reel.hashtags.map((tag) => (
//               <Pressable key={tag} style={styles.hashtag}>
//                 <Text style={styles.hashtagText}>#{tag}</Text>
//               </Pressable>
//             ))}
//           </View>
//         )}
//       </View>

//       {/* Right Actions */}
//       <View style={styles.actionsColumn}>
//         {/* Like Button */}
//         <Pressable style={styles.action} onPress={handleLikePress}>
//           <Animated.View style={animatedLike}>
//             <Ionicons
//               name={reel.isLiked ? 'heart' : 'heart-outline'}
//               size={32}
//               color={reel.isLiked ? '#ff1744' : '#fff'}
//             />
//           </Animated.View>
//           <Text style={styles.actionLabel}>
//             {formatCount(reel.likeCount)}
//           </Text>
//         </Pressable>

//         {/* Comment Button */}
//         <Pressable style={styles.action}>
//           <Ionicons name="chatbubble-outline" size={28} color="#fff" />
//           <Text style={styles.actionLabel}>
//             {formatCount(reel.commentCount)}
//           </Text>
//         </Pressable>

//         {/* Share Button */}
//         <Pressable style={styles.action}>
//           <Ionicons name="share-social-outline" size={28} color="#fff" />
//           <Text style={styles.actionLabel}>
//             {formatCount(reel.shareCount)}
//           </Text>
//         </Pressable>

//         {/* Bookmark Button */}
//         <Pressable style={styles.action} onPress={onBookmark}>
//           <Ionicons
//             name={reel.isBookmarked ? 'bookmark' : 'bookmark-outline'}
//             size={28}
//             color={reel.isBookmarked ? '#ffd60a' : '#fff'}
//           />
//         </Pressable>

//         {/* Creator Avatar */}
//         <Pressable style={styles.creatorAvatarSmall}>
//           <Image
//             source={{ uri: reel.creator.avatar }}
//             style={styles.creatorAvatarSmallImage}
//           />
//           <View style={styles.creatorFollowIndicator} />
//         </Pressable>
//       </View>
//     </Pressable>
//   );
// }

// function formatCount(count: number): string {
//   if (count >= 1000000) return (count / 1000000).toFixed(1) + 'M';
//   if (count >= 1000) return (count / 1000).toFixed(1) + 'K';
//   return count.toString();
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#000',
//   },
//   containerDark: {
//     backgroundColor: '#000',
//   },
//   loadingContainer: {
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   tabBar: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     flexDirection: 'row',
//     justifyContent: 'center',
//     gap: spacing.xl,
//     paddingHorizontal: spacing.lg,
//     paddingVertical: spacing.md,
//     backgroundColor: 'rgba(0,0,0,0.3)',
//     zIndex: 100,
//   },
//   tabBarDark: {
//     backgroundColor: 'rgba(0,0,0,0.5)',
//   },
//   tabButton: {
//     paddingVertical: spacing.sm,
//     alignItems: 'center',
//   },
//   tabLabel: {
//     fontSize: 13,
//     fontWeight: '500',
//     color: 'rgba(255,255,255,0.6)',
//   },
//   tabLabelActive: {
//     fontSize: 16,
//     fontWeight: '700',
//     color: '#fff',
//   },
//   tabLabelDark: {
//     color: 'rgba(255,255,255,0.7)',
//   },
//   tabIndicator: {
//     width: '100%',
//     height: 2,
//     backgroundColor: '#fff',
//     marginTop: spacing.xs,
//   },
//   tabIndicatorDark: {
//     backgroundColor: '#fff',
//   },
//   reelContainer: {
//     width: '100%',
//     height: screenHeight,
//     backgroundColor: '#000',
//     position: 'relative',
//   },
//   video: {
//     width: '100%',
//     height: '100%',
//   },
//   gradientOverlay: {
//     ...StyleSheet.absoluteFillObject,
//     backgroundImage: 'linear-gradient(180deg, rgba(0,0,0,0.3) 0%, transparent 30%, transparent 70%, rgba(0,0,0,0.5) 100%)',
//   },
//   progressBar: {
//     position: 'absolute',
//     top: 50,
//     left: 0,
//     right: 0,
//     height: 2,
//     backgroundColor: 'rgba(255,255,255,0.2)',
//     zIndex: 10,
//   },
//   progressFill: {
//     height: 2,
//     backgroundColor: '#fff',
//   },
//   muteBtn: {
//     position: 'absolute',
//     top: 16,
//     right: 16,
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     justifyContent: 'center',
//     alignItems: 'center',
//     zIndex: 20,
//   },
//   creatorSection: {
//     position: 'absolute',
//     bottom: 120,
//     left: 0,
//     right: 0,
//     paddingHorizontal: spacing.md,
//   },
//   creatorRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: spacing.md,
//     marginBottom: spacing.md,
//   },
//   creatorAvatar: {
//     width: 44,
//     height: 44,
//     borderRadius: 22,
//     borderWidth: 2,
//     borderColor: '#fff',
//   },
//   creatorInfo: {
//     flex: 1,
//   },
//   creatorNameRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 4,
//   },
//   creatorName: {
//     fontSize: 13,
//     fontWeight: '700',
//     color: '#fff',
//   },
//   verifiedBadge: {
//     marginTop: 2,
//   },
//   creatorUsername: {
//     fontSize: 12,
//     color: 'rgba(255,255,255,0.7)',
//     marginTop: 2,
//   },
//   followBtn: {
//     paddingHorizontal: spacing.md,
//     paddingVertical: 6,
//     borderRadius: 20,
//     borderWidth: 1,
//     borderColor: '#fff',
//   },
//   followBtnActive: {
//     backgroundColor: '#fff',
//   },
//   followBtnText: {
//     fontSize: 12,
//     fontWeight: '700',
//     color: '#111827',
//   },
//   followBtnTextActive: {
//     color: '#000',
//   },
//   captionSection: {
//     marginBottom: spacing.md,
//   },
//   caption: {
//     fontSize: 13,
//     color: '#fff',
//     lineHeight: 20,
//   },
//   readMore: {
//     fontSize: 12,
//     color: 'rgba(255,255,255,0.7)',
//     fontWeight: '600',
//   },
//   hashtagsRow: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     gap: spacing.sm,
//   },
//   hashtag: {
//     paddingVertical: 4,
//   },
//   hashtagText: {
//     fontSize: 12,
//     color: '#4da6ff',
//     fontWeight: '600',
//   },
//   actionsColumn: {
//     position: 'absolute',
//     right: spacing.md,
//     bottom: 160,
//     alignItems: 'center',
//     gap: spacing.lg,
//   },
//   action: {
//     alignItems: 'center',
//     gap: 4,
//   },
//   actionLabel: {
//     fontSize: 10.5,
//     fontWeight: '600',
//     color: '#fff',
//   },
//   creatorAvatarSmall: {
//     marginTop: spacing.md,
//     position: 'relative',
//   },
//   creatorAvatarSmallImage: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     borderWidth: 2,
//     borderColor: '#ff1744',
//   },
//   creatorFollowIndicator: {
//     position: 'absolute',
//     bottom: -2,
//     right: -2,
//     width: 16,
//     height: 16,
//     borderRadius: 8,
//     backgroundColor: '#ff1744',
//     borderWidth: 2,
//     borderColor: '#fff',
//   },
// });
import { useCallback, useEffect, useRef, useState, startTransition } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  useColorScheme,
  Dimensions,
  ActivityIndicator,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Switch,
  Alert,
  PanResponder,
  Animated as RNAnimated,
} from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { FlashList } from '@shopify/flash-list';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { Video, ResizeMode } from 'expo-av';
import { router } from 'expo-router';
import { useThemeStore } from '@/src/store/theme-store';
import { LinearGradient } from 'expo-linear-gradient';

// Real App Context & Token imports
import { useApp } from '@/src/context/app-context';
import { ReelCard } from '@/src/components/reel-card';
import { colors, radius, spacing, typography } from '@/src/theme/tokens';
import { useReelsStore } from '@/src/store/reels-store';
import type { Reel } from '@/src/types/reels';

const { height: screenHeight, width: screenWidth } = Dimensions.get('window');

// Custom Hook for Simulation
function useToast() {
  const [toast, setToast] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2000);
  };
  return { toast, showToast };
}

export default function GozySocialHub() {
  const colorScheme = useColorScheme();
  const { theme, toggleTheme } = useThemeStore();
  const isDark = theme === 'system' ? colorScheme === 'dark' : theme === 'dark';

  // Navigation Stack State
  const [navStack, setNavStack] = useState<string[]>(['Main']);

  // Custom Tab Order matching user request: Home (Feed) -> Reels -> Messages (Inbox) -> Search (Discover) -> Profile
  const [activeTab, setActiveTab] = useState<'Feed' | 'Reels' | 'Inbox' | 'Search' | 'Profile'>('Feed');

  // Custom Toast
  const { toast, showToast } = useToast();

  // App context data for Reels Discovery (Discover) Screen
  const { feed, sections, recommendations, handleFeedSwipe, bookExperience } = useApp();
  const [selectedFilter, setSelectedFilter] = useState<'All' | string>('All');

  // Selected sub-state
  const [selectedChatUser, setSelectedChatUser] = useState<any>(null);
  const [selectedAudio, setSelectedAudio] = useState<any>(null);
  const [activeSwipeLeftExp, setActiveSwipeLeftExp] = useState<any>(null);
  const [activeSwipeRightExp, setActiveSwipeRightExp] = useState<any>(null);
  const [editingProfile, setEditingProfile] = useState({
    name: 'Nikshitha',
    username: 'nikshitha_gozy',
    bio: 'Product Designer | Building Gozy OS 🌌 | Exploring the world ✈️',
    website: 'gozy.ai',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=nikshitha',
  });

  const [followersCount, setFollowersCount] = useState(38);
  const [followingCount, setFollowingCount] = useState(23);
  const [showDiscoverPeople, setShowDiscoverPeople] = useState(false);
  const [followedSuggestedIds, setFollowedSuggestedIds] = useState<string[]>([]);
  const [highlights, setHighlights] = useState([
    { id: 'h1', name: 'Travel ✈️', image: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=200&q=80' },
    { id: 'h2', name: 'Foodie 🍔', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200&q=80' },
    { id: 'h3', name: 'Coding 💻', image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=200&q=80' },
  ]);
  const [userPosts, setUserPosts] = useState([
    { id: 'up1', image: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=400&q=80', type: 'reel', views: '25K' },
    { id: 'up2', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80', type: 'post', views: '' },
    { id: 'up3', image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&q=80', type: 'reel', views: '18K' },
  ]);

  // Inbox & Chat Messages State
  const [chatHistories, setChatHistories] = useState<Record<string, any[]>>({
    'v_nikshitha': [
      { id: '1', text: 'Hey Nikshitha! Have you seen this cool travel reel?', isMe: false, time: '10:30 AM' },
      { id: '2', text: 'Yeah, looks incredible! Where was it filmed?', isMe: true, time: '10:32 AM' },
      { id: '3', text: 'It is in Goa! Let us plan a trip soon.', isMe: false, time: '10:35 AM' },
    ],
    'nikshitha_p': [
      { id: '1', text: 'Are we still on for the design review today?', isMe: false, time: 'Yesterday' },
      { id: '2', text: 'Yes, let us connect around 4 PM.', isMe: true, time: 'Yesterday' },
    ],
    'im_sandy': [
      { id: '1', text: 'Bro, check out this startup concept.', isMe: false, time: 'Monday' },
      { id: '2', text: 'Super innovative!', isMe: true, time: 'Monday' },
    ]
  });

  // Active typing status
  const [isTyping, setIsTyping] = useState(false);

  // Settings states
  const [privateAccount, setPrivateAccount] = useState(false);
  const [notificationsSettings, setNotificationsSettings] = useState({
    pauseAll: false,
    quietMode: false,
    likesComments: true,
    messages: true,
  });
  const [dailyTimeLimit, setDailyTimeLimit] = useState(60); // minutes
  const [blockedUsers, setBlockedUsers] = useState([
    { id: 'b1', name: 'spammer_boy', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=spammer' },
    { id: 'b2', name: 'toxic_user_99', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=toxic' },
  ]);

  // Stories States
  const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null);
  const mockStories = [
    { id: 'story-gozy', name: 'Your story', avatar: editingProfile.avatar, isGozyLogo: true, image: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=600&q=80' },
    { id: 'story-1', name: 'peyushbansal', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=peyush', image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&q=80' },
    { id: 'story-2', name: 'ashneer.grover', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ashneer', image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&q=80' },
    { id: 'story-3', name: 'rajshamaniin', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=raj', image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600&q=80' },
    { id: 'story-4', name: 'zomato_ceo', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=deepinder', image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&q=80' },
  ];

  // QR Code background emoji
  const [qrEmoji, setQrEmoji] = useState('✨');

  // Reels lists & global store interaction
  const {
    forYouReels,
    playingReelId,
    setForYouReels,
    setPlayingReelId,
    toggleLike,
    toggleBookmark,
    toggleFollow,
  } = useReelsStore();

  const [loadingReels, setLoadingReels] = useState(true);
  const videoRefs = useRef<Map<string, Video>>(new Map());

  // Search screen query state
  const [searchQuery, setSearchQuery] = useState('');

  // Mock post items
  const [feedPosts, setFeedPosts] = useState([
    {
      id: 'post-1',
      creator: 'mayaphotography',
      verified: true,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=maya',
      location: 'Malé, Maldives',
      image: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&q=80',
      caption: 'Overwater villa vibes in Maldives. 🏝️ Booked everything with split-pay through Gozy! #travel #maldives #overwater',
      likes: 4284,
      comments: 194,
      isLiked: true,
      isBookmarked: true,
      isFollowing: true,
    },
    {
      id: 'post-2',
      creator: 'muzammil_milliondots',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=muzammil',
      location: 'Dubai, UAE',
      image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80',
      caption: 'Building the future of spatial computing in Dubai! 🚀🇦🇪 #startup #dubai #spatial',
      likes: 1284,
      comments: 94,
      isLiked: false,
      isBookmarked: false,
      isFollowing: false,
    },
    {
      id: 'post-3',
      creator: 'alexcooks',
      verified: true,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex',
      location: 'Glen\'s Bakehouse, Bangalore',
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80',
      caption: 'Glen\'s signature red velvet cupcakes are worth every calorie. 🧁❤️ #foodlife #bangalore #glens',
      likes: 2452,
      comments: 88,
      isLiked: false,
      isBookmarked: false,
      isFollowing: false,
    },
    {
      id: 'post-4',
      creator: 'emmastyle',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emma',
      location: 'UB City, Bengaluru',
      image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&q=80',
      caption: 'Curated streetwear cargo drop just went live! Tap link in bio to unlock 8% cashback. 🎒🔥 #streetstyle #outfit',
      likes: 3422,
      comments: 118,
      isLiked: true,
      isBookmarked: false,
      isFollowing: true,
    },
    {
      id: 'post-5',
      creator: 'jamestravel',
      verified: true,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=james',
      location: 'PVR Orion Mall',
      image: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=800&q=80',
      caption: 'IMAX Dune screening followed by cold brew shakes. Perfect Sunday! 🎬🥤 #weekendvibes #movienight',
      likes: 890,
      comments: 42,
      isLiked: false,
      isBookmarked: false,
      isFollowing: false,
    }
  ]);

  // Suggested follow accounts
  const [suggestedCreators] = useState([
    { id: 's1', username: 'Pranitha', name: 'Pranitha K', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=pranitha', subtext: 'Follow back' },
    { id: 's2', username: 'Lenskart', name: 'Lenskart', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lenskart', subtext: 'Suggested for you' },
    { id: 's3', username: 'anupammittal', name: 'Anupam Mittal', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=anupam', subtext: 'Followed by ashneer' },
  ]);

  const pushScreen = (screenName: string) => {
    setNavStack(prev => [...prev, screenName]);
  };

  const popScreen = () => {
    if (navStack.length > 1) {
      setNavStack(prev => prev.slice(0, -1));
    }
  };

  const currentScreen = navStack[navStack.length - 1];

  // Load Reels on mount
  useEffect(() => {
    const mockReelsData: Reel[] = [
      {
        id: 'r1',
        creatorId: 'creator-1',
        creator: {
          id: 'creator-1',
          name: 'Travel Vlogger',
          username: '@travelvlogger',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=travelvlogger',
          verified: true,
          isFollowing: false,
          followerCount: 2450000,
        },
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-library/sample/ForBiggerEscapes.mp4',
        thumbnail: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=400&q=80',
        caption: 'Amazing beach sunset in Maldives! 🌅🏝️ Who else loves tropical sunsets? #travel #maldives #sunset',
        hashtags: ['travel', 'maldives', 'sunset'],
        category: 'Travel',
        duration: 30,
        likeCount: 245001,
        commentCount: 12500,
        shareCount: 8900,
        isLiked: false,
        isBookmarked: false,
        createdAt: new Date(),
        views: 5200000,
      },
      {
        id: 'r2',
        creatorId: 'creator-2',
        creator: {
          id: 'creator-2',
          name: 'Foodie Express',
          username: '@foodieexpress',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=foodieexpress',
          verified: true,
          isFollowing: false,
          followerCount: 890000,
        },
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-library/sample/ForBiggerBlazes.mp4',
        thumbnail: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80',
        caption: 'Best Biriyani in Bangalore! 🍛🔥 Glen\'s Bakehouse special. Only ₹299 with Gozy split-pay! #food #bangalore #biryani',
        hashtags: ['food', 'biryani', 'bangalore'],
        category: 'Food',
        duration: 25,
        likeCount: 89200,
        commentCount: 4300,
        shareCount: 2100,
        isLiked: false,
        isBookmarked: false,
        createdAt: new Date(),
        views: 980000,
      },
      {
        id: 'r3',
        creatorId: 'creator-3',
        creator: {
          id: 'creator-3',
          name: 'StyleHub India',
          username: '@stylehubindia',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=stylehub',
          verified: true,
          isFollowing: false,
          followerCount: 340000,
        },
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-library/sample/ForBiggerFun.mp4',
        thumbnail: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&q=80',
        caption: 'Unboxing the new UB City summer collection! 👟✨ Same-day delivery. Tap to grab yours. #fashion #shopping #summer',
        hashtags: ['fashion', 'shopping', 'summer'],
        category: 'Shopping',
        duration: 22,
        likeCount: 34100,
        commentCount: 1870,
        shareCount: 930,
        isLiked: false,
        isBookmarked: false,
        createdAt: new Date(),
        views: 420000,
      },
      {
        id: 'r4',
        creatorId: 'creator-4',
        creator: {
          id: 'creator-4',
          name: 'CinematicIndia',
          username: '@cinematicindia',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=cinematicindia',
          verified: true,
          isFollowing: false,
          followerCount: 1200000,
        },
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-library/sample/ForBiggerMeltdowns.mp4',
        thumbnail: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&q=80',
        caption: 'IMAX Dune Part 2 was EPIC! 🎬🍿 PVR Orion Mall experience. Book tickets via Gozy now. #imax #movies #dune',
        hashtags: ['movies', 'imax', 'dune'],
        category: 'Entertainment',
        duration: 27,
        likeCount: 67800,
        commentCount: 5400,
        shareCount: 3200,
        isLiked: false,
        isBookmarked: false,
        createdAt: new Date(),
        views: 1800000,
      },
      {
        id: 'r5',
        creatorId: 'creator-5',
        creator: {
          id: 'creator-5',
          name: 'GozyTravel',
          username: '@gozy_travel',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=gozy_travel',
          verified: true,
          isFollowing: true,
          followerCount: 5000000,
        },
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-library/sample/WeAreGoingOnBullrun.mp4',
        thumbnail: 'https://images.unsplash.com/photo-1499856374007-5efc5e4e52e0?w=400&q=80',
        caption: 'Paris in 4 days — complete itinerary! 🗼✈️ Flights from ₹35,000. Book with Gozy split-pay. #paris #travel #europe',
        hashtags: ['paris', 'travel', 'europe'],
        category: 'Travel',
        duration: 60,
        likeCount: 948000,
        commentCount: 43000,
        shareCount: 88000,
        isLiked: true,
        isBookmarked: true,
        createdAt: new Date(),
        views: 8900000,
      },
      {
        id: 'r6',
        creatorId: 'creator-6',
        creator: {
          id: 'creator-6',
          name: 'Delhi Food Diaries',
          username: '@delhifooddiaries',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=delhifood',
          verified: false,
          isFollowing: false,
          followerCount: 120000,
        },
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-library/sample/ForBiggerEscapes.mp4',
        thumbnail: 'https://images.unsplash.com/photo-1567337710282-00832b415979?w=400&q=80',
        caption: 'Street tacos + mango lassi combo for ₹149! 🌮🥭 Karol Bagh night market. #streetfood #delhi #foodie',
        hashtags: ['streetfood', 'delhi', 'foodie'],
        category: 'Food',
        duration: 18,
        likeCount: 22400,
        commentCount: 890,
        shareCount: 410,
        isLiked: false,
        isBookmarked: false,
        createdAt: new Date(),
        views: 350000,
      },
      {
        id: 'r7',
        creatorId: 'creator-7',
        creator: {
          id: 'creator-7',
          name: 'Sneaker Culture',
          username: '@sneakerculture_in',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sneakerculture',
          verified: false,
          isFollowing: false,
          followerCount: 68000,
        },
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-library/sample/ForBiggerBlazes.mp4',
        thumbnail: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80',
        caption: 'Nike Air Max 97 review + where to buy at BEST price in India 👟🔥 Use Gozy for 12% cashback! #sneakers #nike #shopping',
        hashtags: ['sneakers', 'nike', 'shopping'],
        category: 'Shopping',
        duration: 35,
        likeCount: 15600,
        commentCount: 720,
        shareCount: 380,
        isLiked: false,
        isBookmarked: false,
        createdAt: new Date(),
        views: 210000,
      },
      {
        id: 'r8',
        creatorId: 'creator-8',
        creator: {
          id: 'creator-8',
          name: 'Gozy Entertainment',
          username: '@gozy_entertainment',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=gozyentertain',
          verified: true,
          isFollowing: true,
          followerCount: 780000,
        },
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-library/sample/ForBiggerFun.mp4',
        thumbnail: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&q=80',
        caption: 'Coldplay India 2025 — we got tickets with Gozy! 🎶🎸 Group booking made easy. #coldplay #concert #music',
        hashtags: ['coldplay', 'concert', 'music'],
        category: 'Entertainment',
        duration: 42,
        likeCount: 185000,
        commentCount: 22000,
        shareCount: 14500,
        isLiked: false,
        isBookmarked: false,
        createdAt: new Date(),
        views: 4200000,
      },
      {
        id: 'r9',
        creatorId: 'creator-9',
        creator: {
          id: 'creator-9',
          name: 'Himalaya Hiker',
          username: '@himalayahiker',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=himalayahiker',
          verified: false,
          isFollowing: false,
          followerCount: 95000,
        },
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-library/sample/WeAreGoingOnBullrun.mp4',
        thumbnail: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&q=80',
        caption: 'Spiti Valley road trip in 6 days! 🏔️🚗 Full budget breakdown: ₹12,000 per person. #himalayas #roadtrip #spiti',
        hashtags: ['himalayas', 'roadtrip', 'spiti'],
        category: 'Travel',
        duration: 50,
        likeCount: 42000,
        commentCount: 2100,
        shareCount: 1800,
        isLiked: false,
        isBookmarked: false,
        createdAt: new Date(),
        views: 680000,
      },
      {
        id: 'r10',
        creatorId: 'creator-10',
        creator: {
          id: 'creator-10',
          name: 'Tara AI',
          username: '@tara_gozy_ai',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=taraai',
          verified: true,
          isFollowing: true,
          followerCount: 3200000,
        },
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-library/sample/ForBiggerMeltdowns.mp4',
        thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&q=80',
        caption: '✨ Swipe left to book → Swipe right to explore details! Gozy makes every reel actionable. Ask Tara anything. #gozy #tara #ai',
        hashtags: ['gozy', 'tara', 'ai'],
        category: 'Entertainment',
        duration: 15,
        likeCount: 1200000,
        commentCount: 85000,
        shareCount: 120000,
        isLiked: true,
        isBookmarked: true,
        createdAt: new Date(),
        views: 12000000,
      },
    ];

    setForYouReels(mockReelsData);
    setPlayingReelId(mockReelsData[0]?.id || null);
    setLoadingReels(false);
  }, []);

  // Back Navigation override
  const handleBackPress = () => {
    popScreen();
  };

  // Bottom Sheets Overlays
  const [commentSheetOpen, setCommentSheetOpen] = useState(false);
  const [shareSheetOpen, setShareSheetOpen] = useState(false);
  const [optionsSheetOpen, setOptionsSheetOpen] = useState(false);
  const [reelsComments, setReelsComments] = useState([
    { id: 'c1', username: 'zain_lmao', text: 'This is super dope! 🔥 Let us go next week', likes: 12, liked: false, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zain' },
    { id: 'c2', username: 'aurat_jaat_hu', text: 'Wait, is this real? Awesome quality', likes: 4, liked: false, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=aurat' },
    { id: 'c3', username: 'pure_nayab_1', text: 'Loving the editing style here guys!', likes: 2, liked: false, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=pure' },
  ]);
  const [newCommentText, setNewCommentText] = useState('');

  // Story autoplay logic
  useEffect(() => {
    if (activeStoryIndex !== null) {
      const timer = setTimeout(() => {
        if (activeStoryIndex < mockStories.length - 1) {
          setActiveStoryIndex(activeStoryIndex + 1);
        } else {
          setActiveStoryIndex(null);
        }
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [activeStoryIndex]);

  return (
    <View style={[styles.root, isDark ? styles.rootDark : styles.rootLight]}>
      {/* Dynamic Toast Banner */}
      {toast && (
        <View style={styles.toastContainer}>
          <Text style={styles.toastText}>{toast}</Text>
        </View>
      )}

      {/* Main Switch Router */}
      {currentScreen === 'Main' && (
        <View style={[styles.screenContainer, activeTab === 'Reels' && { paddingTop: 0 }]}>
          {activeTab === 'Feed' && renderFeed()}
          {activeTab === 'Reels' && renderReels()}
          {activeTab === 'Inbox' && renderInbox()}
          {activeTab === 'Search' && renderSearch()}
          {activeTab === 'Profile' && renderProfile()}

          {/* Social Bottom Tab Bar */}
          {renderTabBar()}
          
        </View>
      )}

      {/* SUB-PAGES */}
      {currentScreen === 'ChatRoom' && renderChatRoom()}
      {currentScreen === 'NewChat' && renderNewChat()}
      {currentScreen === 'EditProfile' && renderEditProfile()}
      {currentScreen === 'QRCode' && renderQRCode()}
      {currentScreen === 'AudioDetails' && renderAudioDetails()}

      {/* Settings screens */}
      {currentScreen === 'Settings' && renderSettings()}
      {currentScreen === 'Settings_AccountsCenter' && renderAccountsCenter()}
      {currentScreen === 'Settings_Notifications' && renderNotificationsSettings()}
      {currentScreen === 'Settings_TimeManagement' && renderTimeManagement()}
      {currentScreen === 'Settings_Blocked' && renderBlockedAccounts()}
      {currentScreen === 'Settings_Saved' && renderSavedCollections()}
      {currentScreen === 'Settings_Archive' && renderArchive()}
      {currentScreen === 'Settings_YourActivity' && renderYourActivity()}
      {currentScreen === 'Settings_AccountPrivacy' && renderAccountPrivacy()}
      {currentScreen === 'Settings_Help' && renderHelpCenter()}

      {/* Global Story Overlay Modal */}
      {activeStoryIndex !== null && renderStoryOverlay()}
      {activeSwipeLeftExp !== null && renderSwipeLeftModal()}
      {activeSwipeRightExp !== null && renderSwipeRightModal()}
    </View>
  );

  // ==========================================
  // CUSTOM BOTTOM TAB BAR
  // ==========================================
  function renderTabBar() {
    const isReels = activeTab === 'Reels';
    const activeColor = isReels ? '#fff' : '#0084FF';
    const inactiveColor = isReels ? '#777' : '#8E8E93';
    const tabBackground = isReels ? '#000' : (isDark ? '#121212' : '#fff');
    const borderCol = isReels ? '#1a1a1a' : (isDark ? '#262626' : '#EFEFEF');

    return (
      <View style={[
        styles.tabBar,
        { backgroundColor: tabBackground },
        isReels && { backgroundColor: 'rgba(0,0,0,0.5)' }
      ]}>
        {/* Tab 1: Home/Feed */}
        <Pressable style={styles.tabItem} onPress={() => { setActiveTab('Feed'); setPlayingReelId(null); }}>
          <Ionicons
            name={activeTab === 'Feed' ? 'home' : 'home-outline'}
            size={24}
            color={activeTab === 'Feed' ? activeColor : inactiveColor}
          />
        </Pressable>

        {/* Tab 2: Reels */}
        <Pressable style={styles.tabItem} onPress={() => { setActiveTab('Reels'); if (forYouReels.length > 0) setPlayingReelId(forYouReels[0].id); }}>
          <MaterialCommunityIcons
            name={activeTab === 'Reels' ? 'play-box-multiple' : 'play-box-multiple-outline'}
            size={24}
            color={activeTab === 'Reels' ? activeColor : inactiveColor}
          />
        </Pressable>

        {/* Tab 3: Messages */}
        <Pressable style={styles.tabItem} onPress={() => { setActiveTab('Inbox'); setPlayingReelId(null); }}>
          <Ionicons
            name={activeTab === 'Inbox' ? 'paper-plane' : 'paper-plane-outline'}
            size={24}
            color={activeTab === 'Inbox' ? activeColor : inactiveColor}
          />
        </Pressable>

        {/* Tab 4: Search/Discover */}
        <Pressable style={styles.tabItem} onPress={() => { setActiveTab('Search'); setPlayingReelId(null); }}>
          <Ionicons
            name={activeTab === 'Search' ? 'compass' : 'compass-outline'}
            size={24}
            color={activeTab === 'Search' ? activeColor : inactiveColor}
          />
        </Pressable>

        {/* Tab 5: Profile */}
        <Pressable style={styles.tabItem} onPress={() => { setActiveTab('Profile'); setPlayingReelId(null); }}>
          <View style={[styles.tabAvatarContainer, activeTab === 'Profile' && { borderColor: activeColor }]}>
            <Image source={{ uri: editingProfile.avatar }} style={styles.tabAvatar} />
          </View>
        </Pressable>
      </View>
    );
  }

  // ==========================================
  // FEED VIEW
  // ==========================================
  function renderFeed() {
    return (
      <View style={styles.flex1}>
        {/* Header - Center title logo, Left Plus, Right Heart, No other icons */}
        <View style={[styles.feedHeader, isDark ? styles.borderDark : styles.borderLight]}>
          <Pressable onPress={() => pushScreen('NewChat')} style={styles.headerIconLeft}>
            <Ionicons name="add" size={28} color={isDark ? '#fff' : '#000'} />
          </Pressable>

          <Text style={[styles.feedLogo, { color: isDark ? '#fff' : '#000' }]}>Gozy Social</Text>

          <Pressable style={styles.headerIconRight} onPress={() => pushScreen('Settings_Notifications')}>
            <Ionicons name="heart-outline" size={26} color={isDark ? '#fff' : '#000'} />
          </Pressable>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContentPadding}>
          {/* Stories Horizontal view */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.storiesContainer}>
            {mockStories.map((story, index) => (
              <Pressable key={story.id} style={styles.storyItem} onPress={() => setActiveStoryIndex(index)}>
                <View style={story.isGozyLogo ? styles.storyRingGozy : styles.storyRing}>
                  <Image source={{ uri: story.avatar }} style={styles.storyAvatar} />
                  {story.isGozyLogo && (
                    <View style={styles.storyPlusBtn}>
                      <Ionicons name="add" size={12} color="#fff" />
                    </View>
                  )}
                </View>
                <Text style={[styles.storyName, { color: isDark ? '#ccc' : '#333' }]} numberOfLines={1}>
                  {story.name}
                </Text>
              </Pressable>
            ))}
          </ScrollView>

          {/* AI Creation Tools Banner */}
          <View style={styles.aiBannerContainer}>
            <View style={styles.aiBanner}>
              <View style={styles.aiBannerTextCol}>
                <Text style={styles.aiBannerTitle}>Gozy AI Creative Tools ⚡️</Text>
                <Text style={styles.aiBannerSub}>Generate stunning visual art instantly with Tara AI.</Text>
                <Pressable style={styles.aiBannerBtn} onPress={() => showToast('Redirecting to Tara AI creator...')}>
                  <Text style={styles.aiBannerBtnText}>Try free creation</Text>
                </Pressable>
              </View>
              <View style={styles.aiBannerImageCol}>
                <Image source={{ uri: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&q=80' }} style={styles.aiBannerCard} />
              </View>
            </View>
          </View>

          {/* Feed Posts */}
          {feedPosts.map((post, postIdx) => (
            <View key={post.id} style={[styles.postCard, { borderBottomColor: isDark ? '#262626' : '#efefef' }]}>
              {/* Creator header */}
              <View style={styles.postHeader}>
                <Image source={{ uri: post.avatar }} style={styles.postCreatorAvatar} />
                <View style={styles.flex1}>
                  <View style={styles.row}>
                    <Text style={[styles.postCreatorName, { color: isDark ? '#fff' : '#000' }]}>{post.creator}</Text>
                    {post.verified && (
                      <MaterialCommunityIcons name="check-decagram" size={14} color="#0084FF" style={styles.verifiedBadge} />
                    )}
                  </View>
                  {post.location && <Text style={styles.postLocation}>{post.location}</Text>}
                </View>
                <Pressable
                  style={[styles.postFollowBtn, post.isFollowing && styles.postFollowBtnActive]}
                  onPress={() => {
                    const newPosts = [...feedPosts];
                    newPosts[postIdx].isFollowing = !newPosts[postIdx].isFollowing;
                    setFeedPosts(newPosts);
                    showToast(newPosts[postIdx].isFollowing ? `Following @${post.creator}` : `Unfollowed @${post.creator}`);
                  }}
                >
                  <Text style={[styles.postFollowBtnText, post.isFollowing && { color: isDark ? '#aaa' : '#666' }]}>
                    {post.isFollowing ? 'Following' : 'Follow'}
                  </Text>
                </Pressable>
              </View>

              {/* Feed media body */}
              <Image source={{ uri: post.image }} style={styles.postImage} contentFit="cover" />

              {/* Interaction Bar */}
              <View style={styles.postActionBar}>
                <View style={styles.row}>
                  <Pressable
                    style={styles.postActionIcon}
                    onPress={() => {
                      const newPosts = [...feedPosts];
                      newPosts[postIdx].isLiked = !newPosts[postIdx].isLiked;
                      newPosts[postIdx].likes += newPosts[postIdx].isLiked ? 1 : -1;
                      setFeedPosts(newPosts);
                    }}
                  >
                    <Ionicons
                      name={post.isLiked ? 'heart' : 'heart-outline'}
                      size={26}
                      color={post.isLiked ? '#ff1744' : (isDark ? '#fff' : '#000')}
                    />
                  </Pressable>
                  <Pressable style={styles.postActionIcon} onPress={() => { setActiveTab('Reels'); setCommentSheetOpen(true); }}>
                    <Ionicons name="chatbubble-outline" size={24} color={isDark ? '#fff' : '#000'} />
                  </Pressable>
                  <Pressable style={styles.postActionIcon} onPress={() => { setShareSheetOpen(true); }}>
                    <Ionicons name="paper-plane-outline" size={24} color={isDark ? '#fff' : '#000'} />
                  </Pressable>
                </View>
                <Pressable
                  onPress={() => {
                    const newPosts = [...feedPosts];
                    newPosts[postIdx].isBookmarked = !newPosts[postIdx].isBookmarked;
                    setFeedPosts(newPosts);
                    showToast(newPosts[postIdx].isBookmarked ? 'Saved to collection' : 'Removed from collection');
                  }}
                >
                  <Ionicons
                    name={post.isBookmarked ? 'bookmark' : 'bookmark-outline'}
                    size={24}
                    color={post.isBookmarked ? '#ffd60a' : (isDark ? '#fff' : '#000')}
                  />
                </Pressable>
              </View>

              {/* Post details */}
              <View style={styles.postInfoSection}>
                <Text style={[styles.postLikesCount, { color: isDark ? '#fff' : '#000' }]}>{post.likes.toLocaleString()} likes</Text>
                <Text style={[styles.postCaption, { color: isDark ? '#ddd' : '#222' }]}>
                  <Text style={styles.boldText}>{post.creator} </Text>
                  {post.caption}
                </Text>
                <Pressable onPress={() => { setActiveTab('Reels'); setCommentSheetOpen(true); }}>
                  <Text style={styles.postViewComments}>View all {post.comments} comments</Text>
                </Pressable>
              </View>
            </View>
          ))}

          {/* Suggested Creators Section */}
          <View style={[styles.suggestedContainer, { backgroundColor: isDark ? '#1a1a1a' : '#f9f9f9' }]}>
            <View style={[styles.row, { justifyContent: 'space-between', marginBottom: spacing.md }]}>
              <Text style={[styles.suggestedTitle, { color: isDark ? '#fff' : '#000' }]}>Suggested for you</Text>
              <Pressable onPress={() => pushScreen('NewChat')}>
                <Text style={styles.suggestedSeeAll}>See All</Text>
              </Pressable>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {suggestedCreators.map((creator) => (
                <View key={creator.id} style={[styles.suggestedCard, { backgroundColor: isDark ? '#262626' : '#fff' }]}>
                  <Image source={{ uri: creator.avatar }} style={styles.suggestedAvatar} />
                  <Text style={[styles.suggestedName, { color: isDark ? '#fff' : '#000' }]} numberOfLines={1}>{creator.username}</Text>
                  <Text style={styles.suggestedSubtext} numberOfLines={1}>{creator.subtext}</Text>
                  <Pressable
                    style={styles.suggestedFollowBtn}
                    onPress={() => {
                      showToast(`Followed @${creator.username}`);
                    }}
                  >
                    <Text style={styles.suggestedFollowText}>Follow</Text>
                  </Pressable>
                </View>
              ))}
            </ScrollView>
          </View>
        </ScrollView>
      </View>
    );
  }

  // ==========================================
  // REELS DISCOVERY (SEARCH TAB)
  // ==========================================
  function renderSearch() {
    const exploreFeed = feed.filter((item) => {
      const matchesCategory = selectedFilter === 'All' || item.category === selectedFilter;
      const haystack = `${item.title} ${item.location} ${item.tags.join(' ')}`.toLowerCase();
      const matchesQuery = haystack.includes(searchQuery.trim().toLowerCase());
      return matchesCategory && matchesQuery;
    });

    return (
      <View style={styles.flex1}>
        {/* TopBar matching screenshot */}
        <View style={styles.discoverHeader}>
          <View style={styles.row}>
            <Pressable onPress={() => router.replace('/(explore)')} style={{ marginRight: 12 }}>
              <Ionicons name="arrow-back" size={24} color={isDark ? '#fff' : '#000'} />
            </Pressable>
            <View>
              <Text style={styles.eyebrow}>REELS DISCOVERY</Text>
              <Text style={[styles.discoverTitle, { color: isDark ? '#fff' : '#000' }]}>Discover</Text>
            </View>
          </View>
          <Pressable style={styles.assistantBtn} onPress={() => router.push('/assistant')}>
            <MaterialCommunityIcons name="robot-outline" size={24} color="#0084FF" />
          </Pressable>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} style={styles.flex1} contentContainerStyle={styles.scrollContentPadding}>
          {/* Subtitle & Search wrapped in padded container */}
          <View style={{ paddingHorizontal: 16 }}>
            <Text style={styles.discoverSubtitle}>
              Swipe through travel, food, shopping, and entertainment moments ranked by your preferences.
            </Text>

            {/* Search box & hint */}
            <View style={[styles.searchCard, { backgroundColor: isDark ? '#1a1a1a' : '#fff', borderColor: isDark ? '#262626' : '#efefef' }]}>
              <View style={styles.searchRow}>
                <MaterialCommunityIcons color={isDark ? '#888' : '#8E8E93'} name="magnify" size={20} />
                <TextInput
                  onChangeText={setSearchQuery}
                  placeholder="Search places, cuisines, products, or events"
                  placeholderTextColor={isDark ? '#888' : '#8E8E93'}
                  style={[styles.searchInput, { color: isDark ? '#fff' : '#000' }]}
                  value={searchQuery}
                />
              </View>
              <Text style={styles.searchHint}>{recommendations[1] || "You respond best to compact food plans with instant booking and split pay."}</Text>
            </View>
          </View>

          {/* Filter Chips */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ marginBottom: 12 }}
            contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
          >
            {['All', 'Travel', 'Food', 'Shopping', 'Entertainment'].map((filter) => (
              <Pressable
                key={filter}
                style={[
                  styles.filterChip,
                  selectedFilter === filter ? styles.filterChipActive : { backgroundColor: isDark ? '#262626' : '#fff' },
                  { borderColor: isDark ? '#262626' : '#efefef' },
                  { marginRight: 0 }
                ]}
                onPress={() => setSelectedFilter(filter)}
              >
                <Text style={[styles.filterChipText, selectedFilter === filter ? { color: '#fff' } : { color: isDark ? '#ccc' : '#333' }]}>
                  {filter}
                </Text>
              </Pressable>
            ))}
          </ScrollView>

          {/* Stack module pills */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ marginBottom: 16 }}
            contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
          >
            {sections.map((section) => (
              <Pressable key={section.id} onPress={() => showToast(`Opening ${section.title}...`)} style={[styles.modulePill, { backgroundColor: isDark ? '#262626' : '#f0f0f0', borderColor: isDark ? '#333' : '#e0e0e0', marginRight: 0 }]}>
                <Text style={[styles.modulePillText, { color: section.accent || '#0084FF' }]}>{section.title}</Text>
              </Pressable>
            ))}
          </ScrollView>

          {/* Experience Cards */}
          <View style={{ paddingHorizontal: 16 }}>
            <View style={styles.exploreGridList}>
              {exploreFeed.map((item) => (
                <View key={item.id} style={{ marginBottom: 20 }}>
                  <ReelCard
                    active={playingReelId === item.id}
                    experience={item}
                    onBook={(exp: any) => {
                      bookExperience(exp);
                      router.push('/bookings');
                    }}
                    onSwipe={(expId: string, dir: string) => {
                      handleFeedSwipe(expId, dir as any);
                      if (dir === 'left') {
                        setActiveSwipeLeftExp(item);
                      } else if (dir === 'right') {
                        setActiveSwipeRightExp(item);
                      }
                    }}
                  />
                </View>
              ))}
              {exploreFeed.length === 0 && (
                <Text style={{ textAlign: 'center', marginTop: 40, color: '#888' }}>No results match search query.</Text>
              )}
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }

  // ==========================================
  // REELS vertical scrollview
  // ==========================================
  function renderReels() {
    if (loadingReels) {
      return (
        <View style={styles.centeredContainer}>
          <ActivityIndicator size="large" color={colors.sky} />
        </View>
      );
    }

    return (
      <View style={styles.reelsContainer}>
        {/* Fullscreen Video List */}
        <FlashList
          data={forYouReels}
          renderItem={({ item }) => (
            <ReelVideoCard
              reel={item}
              isPlaying={playingReelId === item.id}
              onLike={() => {
                toggleLike(item.id);
                showToast(!item.isLiked ? '❤️ Reel Liked!' : 'Like removed');
              }}
              onBookmark={() => {
                toggleBookmark(item.id);
                showToast(!item.isBookmarked ? '🔖 Saved to collection!' : 'Bookmark removed');
              }}
              onFollow={() => {
                toggleFollow(item.creator.id);
                showToast(!item.creator.isFollowing ? `✅ Following @${item.creator.username}` : `Unfollowed @${item.creator.username}`);
              }}
              onCommentPress={() => setCommentSheetOpen(true)}
              onSharePress={() => setShareSheetOpen(true)}
              onMorePress={() => setOptionsSheetOpen(true)}
              onAudioPress={(audioInfo: any) => {
                setSelectedAudio(audioInfo);
                pushScreen('AudioDetails');
              }}
              videoRef={(ref) => {
                if (ref) videoRefs.current.set(item.id, ref);
              }}
              onSwipe={(direction: 'left' | 'right') => {
                if (direction === 'left') {
                  setActiveSwipeLeftExp(item);
                } else if (direction === 'right') {
                  setActiveSwipeRightExp(item);
                }
              }}
            />
          )}
          keyExtractor={(item) => item.id}
          estimatedItemSize={screenHeight}
          pagingEnabled
          snapToInterval={screenHeight}
          decelerationRate="fast"
          onViewableItemsChanged={({ viewableItems }) => {
            if (viewableItems.length > 0) {
              const activeId = viewableItems[0].item.id;
              setPlayingReelId(activeId);
              videoRefs.current.forEach((video, key) => {
                if (key !== activeId) {
                  video.pauseAsync();
                } else {
                  video.playAsync();
                }
              });
            }
          }}
        />

        {/* Global Sheets Overlays for Reels */}
        {commentSheetOpen && renderCommentsSheet()}
        {shareSheetOpen && renderShareSheet()}
        {optionsSheetOpen && renderMoreOptionsSheet()}
      </View>
    );
  }

  // ==========================================
  // INBOX / DM CHATS
  // ==========================================
  function renderInbox() {
    const dmList = [
      { id: 'v_nikshitha', name: 'V Nikshitha', username: 'v_nikshitha', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=v_nikshitha', subtext: 'Sent a reel', time: '10:35 AM', unread: true },
      { id: 'nikshitha_p', name: 'Nikshitha', username: 'nikshitha_p', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=nikshitha_p', subtext: 'Seen Monday', time: 'Mon', unread: false },
      { id: 'im_sandy', name: 'im_sandy', username: 'im_sandy', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sandy', subtext: 'Seen Monday', time: 'Mon', unread: false }
    ];

    return (
      <View style={styles.flex1}>
        {/* DM Header */}
        <View style={styles.dmHeader}>
          <View style={styles.row}>
            <Pressable onPress={() => router.replace('/(explore)')} style={{ marginRight: 12 }}>
              <Ionicons name="arrow-back" size={24} color={isDark ? '#fff' : '#000'} />
            </Pressable>
            <Text style={[styles.dmHeaderTitle, { color: isDark ? '#fff' : '#000' }]}>gozy_your_personal_os</Text>
          </View>
          <View style={styles.row}>
            <Pressable style={styles.headerIcon} onPress={() => pushScreen('NewChat')}>
              <Ionicons name="create-outline" size={24} color={isDark ? '#fff' : '#000'} />
            </Pressable>
          </View>
        </View>

        {/* Bubble Notes at Top — extra paddingTop so bubbles above avatars are visible */}
        <View style={styles.notesSection}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ overflow: 'visible' }}
            contentContainerStyle={{ paddingTop: 26, paddingHorizontal: 4 }}
          >
            {/* User Note */}
            <View style={styles.noteItem}>
              <Pressable style={styles.noteAvatarWrapper} onPress={() => showToast('Write a note modal...')}>
                <Image source={{ uri: editingProfile.avatar }} style={styles.noteAvatar} />
                <View style={styles.myNoteBubble}>
                  <Text style={styles.myNoteBubbleText}>Your note</Text>
                </View>
                <View style={[styles.thoughtDot1, { backgroundColor: 'rgba(20,20,20,0.88)' }]} />
                <View style={[styles.thoughtDot2, { backgroundColor: 'rgba(20,20,20,0.88)' }]} />
                <View style={styles.plusOverlay}>
                  <Ionicons name="add" size={10} color="#fff" />
                </View>
              </Pressable>
              <Text style={[styles.noteName, { color: isDark ? '#aaa' : '#333' }]}>Your thoughts</Text>
            </View>

            {/* Friends Notes */}
            <View style={styles.noteItem}>
              <View style={styles.noteAvatarWrapper}>
                <Image source={{ uri: 'https://api.dicebear.com/7.x/avataaars/svg?seed=v_nikshitha' }} style={styles.noteAvatar} />
                <View style={styles.noteBubble}>
                  <Text style={styles.noteBubbleText} numberOfLines={1}>Map 📍</Text>
                </View>
                <View style={styles.thoughtDot1} />
                <View style={styles.thoughtDot2} />
              </View>
              <Text style={[styles.noteName, { color: isDark ? '#aaa' : '#333' }]}>V Nikshitha</Text>
            </View>

            <View style={styles.noteItem}>
              <View style={styles.noteAvatarWrapper}>
                <Image source={{ uri: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sandy' }} style={styles.noteAvatar} />
                <View style={styles.noteBubble}>
                  <Text style={styles.noteBubbleText} numberOfLines={1}>Coding 💻</Text>
                </View>
                <View style={styles.thoughtDot1} />
                <View style={styles.thoughtDot2} />
              </View>
              <Text style={[styles.noteName, { color: isDark ? '#aaa' : '#333' }]}>im_sandy</Text>
            </View>
          </ScrollView>
        </View>

        <View style={styles.sectionHeaderLine} />

        {/* Dynamic DM List */}
        <ScrollView style={styles.flex1} contentContainerStyle={styles.scrollContentPadding}>
          {dmList.map((chat) => (
            <Pressable
              key={chat.id}
              style={styles.chatListItem}
              onPress={() => {
                setSelectedChatUser(chat);
                pushScreen('ChatRoom');
              }}
            >
              <Image source={{ uri: chat.avatar }} style={styles.chatListAvatar} />
              <View style={styles.flex1}>
                <Text style={[styles.chatListName, { color: isDark ? '#fff' : '#000' }, chat.unread && styles.boldText]}>
                  {chat.name}
                </Text>
                <Text style={[styles.chatListSub, { color: isDark ? '#888' : '#666' }]}>
                  {chat.subtext} • {chat.time}
                </Text>
              </View>
              {chat.unread && <View style={styles.unreadDot} />}
            </Pressable>
          ))}
        </ScrollView>
      </View>
    );
  }

  // ==========================================
  // PROFILE SCREEN
  // ==========================================
  function renderProfile() {
    return (
      <View style={styles.flex1}>
        {/* Header */}
        <View style={styles.profileHeader}>
          <View style={styles.row}>
            <Pressable onPress={() => router.replace('/(explore)')} style={{ marginRight: 12 }}>
              <Ionicons name="arrow-back" size={24} color={isDark ? '#fff' : '#000'} />
            </Pressable>
            <Text style={[styles.profileUsername, { color: isDark ? '#fff' : '#000' }]}>{editingProfile.username}</Text>
          </View>
          <View style={styles.row}>
            <Pressable style={styles.headerIcon} onPress={() => {
              const list = [
                { id: 'up-' + Date.now(), image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=80', type: 'post', views: '' },
                { id: 'up-' + Date.now() + '-1', image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400&q=80', type: 'reel', views: '1.2K' },
                { id: 'up-' + Date.now() + '-2', image: 'https://images.unsplash.com/photo-1551882547-ff40c0d1398c?w=400&q=80', type: 'post', views: '' }
              ];
              const randomPost = list[Math.floor(Math.random() * list.length)];
              setUserPosts(prev => [randomPost, ...prev]);
              showToast('✨ New post published successfully!');
            }}>
              <Ionicons name="add-circle-outline" size={24} color={isDark ? '#fff' : '#000'} />
            </Pressable>
            <Pressable style={styles.headerIcon} onPress={() => pushScreen('QRCode')}>
              <Ionicons name="qr-code-outline" size={22} color={isDark ? '#fff' : '#000'} />
            </Pressable>
            <Pressable style={styles.headerIcon} onPress={() => pushScreen('Settings')}>
              <Ionicons name="menu-outline" size={26} color={isDark ? '#fff' : '#000'} />
            </Pressable>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContentPadding}>
          {/* Main profile row — overflow visible so note bubble above avatar is not clipped */}
          <View style={[styles.profileBioSection, { paddingTop: 28, overflow: 'visible' }]}>
            <View style={[styles.profileRow, { overflow: 'visible' }]}>
              <View style={styles.profileAvatarContainer}>
                <Image source={{ uri: editingProfile.avatar }} style={styles.profileMainAvatar} />
                <View style={styles.profileNoteBubble}>
                  <Text style={styles.profileNoteText}>Coding 💻</Text>
                </View>
                {/* Small thought bubble connector dots */}
                <View style={styles.profileThoughtDot1} />
                <View style={styles.profileThoughtDot2} />
              </View>
              <View style={styles.profileStatsRow}>
                <View style={styles.statItem}>
                  <Text style={[styles.statNumber, { color: isDark ? '#fff' : '#000' }]}>{userPosts.length}</Text>
                  <Text style={styles.statLabel}>posts</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={[styles.statNumber, { color: isDark ? '#fff' : '#000' }]}>{followersCount}</Text>
                  <Text style={styles.statLabel}>followers</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={[styles.statNumber, { color: isDark ? '#fff' : '#000' }]}>{followingCount}</Text>
                  <Text style={styles.statLabel}>following</Text>
                </View>
              </View>
            </View>

            {/* Profile info text */}
            <Text style={[styles.profileName, { color: isDark ? '#fff' : '#000' }]}>{editingProfile.name}</Text>
            <Text style={[styles.profileBio, { color: isDark ? '#ccc' : '#444' }]}>{editingProfile.bio}</Text>
            <Text style={styles.profileWebsite}>{editingProfile.website}</Text>

            {/* Action Buttons */}
            <View style={styles.profileButtonsRow}>
              <Pressable style={[styles.profileBtn, { backgroundColor: isDark ? '#262626' : '#efefef' }]} onPress={() => pushScreen('EditProfile')}>
                <Text style={[styles.profileBtnText, { color: isDark ? '#fff' : '#000' }]}>Edit profile</Text>
              </Pressable>
              <Pressable style={[styles.profileBtn, { backgroundColor: isDark ? '#262626' : '#efefef' }]} onPress={() => pushScreen('QRCode')}>
                <Text style={[styles.profileBtnText, { color: isDark ? '#fff' : '#000' }]}>Share profile</Text>
              </Pressable>
              <Pressable
                style={[
                  styles.profileBtnSquare,
                  { backgroundColor: showDiscoverPeople ? '#0084FF' : (isDark ? '#262626' : '#efefef') }
                ]}
                onPress={() => setShowDiscoverPeople(!showDiscoverPeople)}
              >
                <Ionicons
                  name="person-add-outline"
                  size={16}
                  color={showDiscoverPeople ? '#fff' : (isDark ? '#fff' : '#000')}
                />
              </Pressable>
            </View>

            {/* Discover People Suggestions */}
            {showDiscoverPeople && (
              <View style={[styles.discoverPeopleSection, { backgroundColor: isDark ? '#1a1a1a' : '#f9f9f9', borderColor: isDark ? '#262626' : '#efefef' }]}>
                <View style={styles.discoverPeopleHeader}>
                  <Text style={[styles.discoverPeopleTitle, { color: isDark ? '#fff' : '#000' }]}>Discover People</Text>
                  <Pressable onPress={() => setShowDiscoverPeople(false)}>
                    <Text style={styles.discoverPeopleSeeAll}>See all</Text>
                  </Pressable>
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.discoverPeopleScroll}>
                  {[
                    { id: 's1', name: 'Sandra Lopez', username: 'sandra_l', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sandra' },
                    { id: 's2', name: 'Developer Roy', username: 'roy_dev', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=roy' },
                    { id: 's3', name: 'Adventure Pete', username: 'pete_adv', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=pete' }
                  ].map((person) => {
                    const isFollowed = followedSuggestedIds.includes(person.id);
                    return (
                      <View key={person.id} style={[styles.suggestedCard, { backgroundColor: isDark ? '#262626' : '#fff', borderColor: isDark ? '#333' : '#e0e0e0' }]}>
                        <Pressable style={styles.suggestedClose} onPress={() => showToast('Removed suggestion')}>
                          <Ionicons name="close" size={14} color="#888" />
                        </Pressable>
                        <Image source={{ uri: person.avatar }} style={styles.suggestedAvatar} />
                        <Text style={[styles.suggestedName, { color: isDark ? '#fff' : '#000' }]} numberOfLines={1}>{person.name}</Text>
                        <Text style={styles.suggestedUser}>@{person.username}</Text>
                        <Pressable
                          style={[styles.suggestedFollowBtn, isFollowed && { backgroundColor: isDark ? '#333' : '#efefef' }]}
                          onPress={() => {
                            if (isFollowed) {
                              setFollowedSuggestedIds(prev => prev.filter(id => id !== person.id));
                              setFollowingCount(c => c - 1);
                              showToast(`Unfollowed @${person.username}`);
                            } else {
                              setFollowedSuggestedIds(prev => [...prev, person.id]);
                              setFollowingCount(c => c + 1);
                              showToast(`Following @${person.username}`);
                            }
                          }}
                        >
                          <Text style={[styles.suggestedFollowText, { color: isFollowed ? (isDark ? '#ccc' : '#333') : '#fff' }]}>
                            {isFollowed ? 'Following' : 'Follow'}
                          </Text>
                        </Pressable>
                      </View>
                    );
                  })}
                </ScrollView>
              </View>
            )}
          </View>

          {/* Highlights Row */}
          <View style={styles.highlightsContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.highlightsScroll}>
              <View style={styles.highlightItem}>
                <Pressable
                  style={[styles.highlightCircle, { backgroundColor: isDark ? '#262626' : '#f0f0f0', borderColor: isDark ? '#333' : '#dbdbdb', borderStyle: 'dashed' }]}
                  onPress={() => {
                    Alert.prompt(
                      "New Highlight",
                      "Enter highlight name:",
                      [
                        { text: "Cancel", style: "cancel" },
                        {
                          text: "Add",
                          onPress: (text) => {
                            if (text && text.trim() !== '') {
                              const newId = `h-${Date.now()}`;
                              const images = [
                                'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=200&q=80',
                                'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=200&q=80',
                                'https://images.unsplash.com/photo-1436491865332-7a615061c443?w=200&q=80',
                                'https://images.unsplash.com/photo-1551882547-ff40c0d1398c?w=200&q=80'
                              ];
                              const randomImg = images[Math.floor(Math.random() * images.length)];
                              setHighlights(prev => [...prev, { id: newId, name: text.trim(), image: randomImg }]);
                              showToast(`Highlight "${text.trim()}" created!`);
                            }
                          }
                        }
                      ]
                    );
                  }}
                >
                  <Ionicons name="add" size={24} color={isDark ? '#fff' : '#000'} />
                </Pressable>
                <Text style={[styles.highlightText, { color: isDark ? '#aaa' : '#333' }]}>New</Text>
              </View>

              {highlights.map((highlight) => (
                <View key={highlight.id} style={styles.highlightItem}>
                  <Pressable
                    style={[styles.highlightCircle, { borderColor: isDark ? '#262626' : '#efefef' }]}
                    onPress={() => showToast(`Opening Highlight: ${highlight.name}`)}
                  >
                    <Image source={{ uri: highlight.image }} style={styles.highlightImg} />
                  </Pressable>
                  <Text style={[styles.highlightText, { color: isDark ? '#aaa' : '#333' }]} numberOfLines={1}>{highlight.name}</Text>
                </View>
              ))}
            </ScrollView>
          </View>

          {/* Grid Layout of Posts */}
          <View style={[styles.gridTabs, { borderTopColor: isDark ? '#262626' : '#efefef' }]}>
            <View style={[styles.gridTab, styles.gridTabActive]}>
              <MaterialCommunityIcons name="grid" size={24} color="#0084FF" />
            </View>
            <View style={styles.gridTab}>
              <MaterialCommunityIcons name="play-box-outline" size={24} color="#888" />
            </View>
            <View style={styles.gridTab}>
              <MaterialCommunityIcons name="tag-outline" size={24} color="#888" />
            </View>
          </View>

          {userPosts.length === 0 ? (
            <View style={styles.emptyGridContainer}>
              <Ionicons name="camera-outline" size={48} color={isDark ? '#444' : '#ccc'} />
              <Text style={[styles.emptyGridTitle, { color: isDark ? '#fff' : '#000' }]}>No Posts Yet</Text>
              <Text style={styles.emptyGridSub}>When you share photos or reels, they will appear on your profile.</Text>
            </View>
          ) : (
            <View style={styles.postsGrid}>
              {userPosts.map((post) => (
                <Pressable
                  key={post.id}
                  style={styles.gridPostItem}
                  onPress={() => showToast(post.type === 'reel' ? 'Playing user reel...' : 'Opening post view...')}
                >
                  <Image source={{ uri: post.image }} style={styles.gridPostImg} />
                  {post.type === 'reel' && (
                    <View style={styles.gridReelBadge}>
                      <Ionicons name="play" size={12} color="#fff" />
                      {post.views !== '' && <Text style={styles.gridReelViews}>{post.views}</Text>}
                    </View>
                  )}
                </Pressable>
              ))}
            </View>
          )}
        </ScrollView>
      </View>
    );
  }

  // ==========================================
  // EDIT PROFILE SCREEN
  // ==========================================
  function renderEditProfile() {
    return (
      <View style={[styles.subPageRoot, { backgroundColor: isDark ? '#000' : '#fff' }]}>
        <View style={[styles.subPageHeader, { borderBottomColor: isDark ? '#262626' : '#efefef' }]}>
          <Pressable onPress={handleBackPress}>
            <Text style={[styles.subPageCancel, { color: isDark ? '#fff' : '#000' }]}>Cancel</Text>
          </Pressable>
          <Text style={[styles.subPageTitle, { color: isDark ? '#fff' : '#000' }]}>Edit profile</Text>
          <Pressable
            onPress={() => {
              showToast('Profile updated!');
              popScreen();
            }}
          >
            <Text style={styles.subPageDone}>Done</Text>
          </Pressable>
        </View>

        <ScrollView style={styles.flex1} contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
          <View style={styles.editAvatarSection}>
            <Image source={{ uri: editingProfile.avatar }} style={styles.editAvatarImage} />
            <Pressable onPress={() => {
              const seed = Math.floor(Math.random() * 1000);
              setEditingProfile(prev => ({
                ...prev,
                avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=nikshitha${seed}`
              }));
              showToast('Generated random avatar!');
            }}>
              <Text style={styles.changeAvatarText}>Edit picture or avatar</Text>
            </Pressable>
          </View>

          {/* Form Fields */}
          <View style={styles.editFormField}>
            <Text style={styles.editFieldLabel}>Name</Text>
            <TextInput
              style={[styles.editFieldInput, { color: isDark ? '#fff' : '#000', borderBottomColor: isDark ? '#262626' : '#efefef' }]}
              value={editingProfile.name}
              onChangeText={(txt) => setEditingProfile(prev => ({ ...prev, name: txt }))}
            />
          </View>

          <View style={styles.editFormField}>
            <Text style={styles.editFieldLabel}>Username</Text>
            <TextInput
              style={[styles.editFieldInput, { color: isDark ? '#fff' : '#000', borderBottomColor: isDark ? '#262626' : '#efefef' }]}
              value={editingProfile.username}
              onChangeText={(txt) => setEditingProfile(prev => ({ ...prev, username: txt }))}
            />
          </View>

          <View style={styles.editFormField}>
            <Text style={styles.editFieldLabel}>Website</Text>
            <TextInput
              style={[styles.editFieldInput, { color: isDark ? '#fff' : '#000', borderBottomColor: isDark ? '#262626' : '#efefef' }]}
              value={editingProfile.website}
              onChangeText={(txt) => setEditingProfile(prev => ({ ...prev, website: txt }))}
              placeholder="Website link"
              placeholderTextColor="#888"
            />
          </View>

          <View style={styles.editFormField}>
            <Text style={styles.editFieldLabel}>Bio</Text>
            <TextInput
              style={[styles.editFieldInput, { color: isDark ? '#fff' : '#000', borderBottomColor: isDark ? '#262626' : '#efefef' }]}
              value={editingProfile.bio}
              onChangeText={(txt) => setEditingProfile(prev => ({ ...prev, bio: txt }))}
              multiline
            />
          </View>
        </ScrollView>
      </View>
    );
  }

  // ==========================================
  // DISCOVER PEOPLE / NEW CHAT SELECTOR
  // ==========================================
  function renderNewChat() {
    return (
      <View style={[styles.subPageRoot, { backgroundColor: isDark ? '#000' : '#fff' }]}>
        <View style={[styles.subPageHeader, { borderBottomColor: isDark ? '#262626' : '#efefef' }]}>
          <Pressable onPress={handleBackPress}>
            <Ionicons name="arrow-back" size={24} color={isDark ? '#fff' : '#000'} />
          </Pressable>
          <Text style={[styles.subPageTitle, { color: isDark ? '#fff' : '#000' }]}>Discover People</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView style={styles.flex1} contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
          <Text style={[styles.suggestedTitle, { color: isDark ? '#fff' : '#000', marginBottom: 16 }]}>Recommended Contacts</Text>
          {suggestedCreators.map((item) => (
            <View key={item.id} style={styles.discoverRow}>
              <Image source={{ uri: item.avatar }} style={styles.discoverAvatar} />
              <View style={styles.flex1}>
                <Text style={[styles.discoverName, { color: isDark ? '#fff' : '#000' }]}>{item.username}</Text>
                <Text style={styles.discoverSub}>{item.name}</Text>
              </View>
              <Pressable
                style={styles.discoverFollowBtn}
                onPress={() => {
                  showToast(`Following ${item.username}`);
                }}
              >
                <Text style={styles.discoverFollowBtnText}>Follow</Text>
              </Pressable>
              <Pressable style={{ marginLeft: 12 }} onPress={() => showToast('Removed suggestion')}>
                <Ionicons name="close" size={20} color={isDark ? '#888' : '#888'} />
              </Pressable>
            </View>
          ))}
        </ScrollView>
      </View>
    );
  }

  // ==========================================
  // DIRECT MESSAGE CHAT ROOM
  // ==========================================
  function renderChatRoom() {
    const chatUser = selectedChatUser || { name: 'Nikshitha', username: 'nikshitha', id: 'v_nikshitha' };
    const history = chatHistories[chatUser.id] || [];
    const [msgText, setMsgText] = useState('');
    const chatScrollViewRef = useRef<ScrollView>(null);

    const handleSendMessage = () => {
      if (!msgText.trim()) return;

      const newMsg = {
        id: Math.random().toString(),
        text: msgText,
        isMe: true,
        time: 'Just Now',
      };

      const updatedHistory = [...history, newMsg];
      setChatHistories(prev => ({
        ...prev,
        [chatUser.id]: updatedHistory
      }));
      setMsgText('');

      // Auto reply simulation after 1.5 seconds
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        const autoReply = {
          id: Math.random().toString(),
          text: 'Got it! Tara and Gozy AI are super fast to respond here. 👍',
          isMe: false,
          time: 'Just Now',
        };
        setChatHistories(prev => ({
          ...prev,
          [chatUser.id]: [...updatedHistory, autoReply]
        }));
      }, 1500);
    };

    return (
      <KeyboardAvoidingView
        style={[styles.subPageRoot, { backgroundColor: isDark ? '#000' : '#fff' }]}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Chat Room Header */}
        <View style={[styles.subPageHeader, { borderBottomColor: isDark ? '#262626' : '#efefef' }]}>
          <Pressable onPress={handleBackPress}>
            <Ionicons name="arrow-back" size={24} color={isDark ? '#fff' : '#000'} />
          </Pressable>
          <View style={styles.chatHeaderInfo}>
            <Image source={{ uri: chatUser.avatar }} style={styles.chatHeaderAvatar} />
            <View>
              <Text style={[styles.chatHeaderName, { color: isDark ? '#fff' : '#000' }]}>{chatUser.name}</Text>
              <Text style={styles.chatHeaderStatus}>Active now</Text>
            </View>
          </View>
          <View style={styles.row}>
            <Pressable style={styles.headerIcon} onPress={() => Alert.alert('Call Info', `Calling ${chatUser.name} on Gozy...`)}>
              <Ionicons name="call-outline" size={22} color={isDark ? '#fff' : '#000'} />
            </Pressable>
            <Pressable style={styles.headerIcon} onPress={() => Alert.alert('Video Call', `Connecting video call with ${chatUser.name}...`)}>
              <Ionicons name="videocam-outline" size={22} color={isDark ? '#fff' : '#000'} />
            </Pressable>
          </View>
        </View>

        {/* Message List */}
        <ScrollView
          ref={chatScrollViewRef}
          style={styles.flex1}
          contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
          onContentSizeChange={() => chatScrollViewRef.current?.scrollToEnd({ animated: true })}
        >
          {history.map((msg) => (
            <View
              key={msg.id}
              style={[
                styles.msgBubbleWrapper,
                msg.isMe ? styles.msgBubbleMeWrapper : styles.msgBubbleOtherWrapper
              ]}
            >
              <View
                style={[
                  styles.msgBubble,
                  msg.isMe ? styles.msgBubbleMe : (isDark ? styles.msgBubbleOtherDark : styles.msgBubbleOtherLight)
                ]}
              >
                <Text style={[styles.msgText, { color: msg.isMe ? '#fff' : (isDark ? '#fff' : '#000') }]}>
                  {msg.text}
                </Text>
              </View>
              <Text style={styles.msgTime}>{msg.time}</Text>
            </View>
          ))}

          {isTyping && (
            <View style={styles.msgBubbleOtherWrapper}>
              <View style={[styles.msgBubble, isDark ? styles.msgBubbleOtherDark : styles.msgBubbleOtherLight]}>
                <ActivityIndicator size="small" color="#0084FF" />
              </View>
            </View>
          )}
        </ScrollView>

        {/* Chat Input Row */}
        <View style={[styles.chatInputRow, { borderTopColor: isDark ? '#262626' : '#efefef' }]}>
          <Pressable style={styles.chatInputIcon}>
            <Ionicons name="camera" size={24} color="#0084FF" />
          </Pressable>
          <View style={[styles.chatInputContainer, { backgroundColor: isDark ? '#262626' : '#f0f0f0' }]}>
            <TextInput
              style={[styles.chatInputText, { color: isDark ? '#fff' : '#000' }]}
              placeholder="Message..."
              placeholderTextColor="#888"
              value={msgText}
              onChangeText={setMsgText}
            />
            <Pressable onPress={handleSendMessage} disabled={!msgText.trim()}>
              <Text style={[styles.chatSendBtn, { opacity: msgText.trim() ? 1 : 0.5 }]}>Send</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    );
  }

  // ==========================================
  // QR CODE SCREEN
  // ==========================================
  function renderQRCode() {
    const emojiList = ['✨', '🔥', '🚀', '💻', '🎨', '✈️', '💼'];

    return (
      <View style={[styles.subPageRoot, { backgroundColor: isDark ? '#000' : '#fff' }]}>
        <View style={styles.subPageHeader}>
          <Pressable onPress={handleBackPress}>
            <Ionicons name="close" size={28} color={isDark ? '#fff' : '#000'} />
          </Pressable>
          <Text style={[styles.subPageTitle, { color: isDark ? '#fff' : '#000' }]}>QR Code</Text>
          <View style={{ width: 28 }} />
        </View>

        <View style={styles.qrContentContainer}>
          {/* Emoji Background Selection */}
          <View style={styles.qrEmojiBar}>
            {emojiList.map((e) => (
              <Pressable key={e} onPress={() => setQrEmoji(e)} style={[styles.qrEmojiItem, qrEmoji === e && styles.qrEmojiActive]}>
                <Text style={{ fontSize: 20 }}>{e}</Text>
              </Pressable>
            ))}
          </View>

          {/* QR Card */}
          <View style={[styles.qrCardContainer, { backgroundColor: isDark ? '#1a1a1a' : '#f5f5f5' }]}>
            <Text style={{ fontSize: 40, marginBottom: 12 }}>{qrEmoji}</Text>
            <View style={styles.qrMockCode}>
              <MaterialCommunityIcons name="qrcode" size={180} color={isDark ? '#fff' : '#000'} />
            </View>
            <Text style={[styles.qrNameText, { color: isDark ? '#fff' : '#000' }]}>@{editingProfile.username}</Text>
            <Text style={styles.qrSubtitle}>Gozy Social Personal OS</Text>
          </View>
          <Text style={styles.qrScanInstruct}>Scan this code on Gozy app to view profile</Text>
        </View>
      </View>
    );
  }

  // ==========================================
  // AUDIO DETAILS SCREEN
  // ==========================================
  function renderAudioDetails() {
    const audio = selectedAudio || { title: 'Gozy Original Audio', artist: 'Tara AI' };

    return (
      <View style={[styles.subPageRoot, { backgroundColor: isDark ? '#000' : '#fff' }]}>
        <View style={styles.subPageHeader}>
          <Pressable onPress={handleBackPress}>
            <Ionicons name="arrow-back" size={24} color={isDark ? '#fff' : '#000'} />
          </Pressable>
          <Text style={[styles.subPageTitle, { color: isDark ? '#fff' : '#000' }]} numberOfLines={1}>Audio Details</Text>
          <Pressable onPress={() => showToast('Audio link copied!')}>
            <Ionicons name="share-social-outline" size={24} color={isDark ? '#fff' : '#000'} />
          </Pressable>
        </View>

        <ScrollView style={styles.flex1} contentContainerStyle={{ paddingBottom: 100 }}>
          <View style={styles.audioMainInfo}>
            <View style={styles.audioAlbumCover}>
              <MaterialCommunityIcons name="music-circle" size={80} color="#0084FF" />
            </View>
            <Text style={[styles.audioTitleText, { color: isDark ? '#fff' : '#000' }]}>{audio.title}</Text>
            <Text style={styles.audioArtistText}>{audio.artist}</Text>
            <Text style={styles.audioStatText}>Used in 14.8K Gozy reels</Text>
          </View>

          {/* Grid list of reels using this audio */}
          <View style={styles.gridSectionHeader}>
            <Text style={[styles.gridSectionTitle, { color: isDark ? '#fff' : '#000' }]}>Popular Reels</Text>
          </View>

          <View style={styles.exploreGrid}>
            <View style={styles.exploreCell}>
              <Image source={{ uri: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=300&q=80' }} style={styles.exploreGridImage} />
            </View>
            <View style={styles.exploreCell}>
              <Image source={{ uri: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=300&q=80' }} style={styles.exploreGridImage} />
            </View>
            <View style={styles.exploreCell}>
              <Image source={{ uri: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=300&q=80' }} style={styles.exploreGridImage} />
            </View>
          </View>

          <Pressable style={styles.audioUseBtn} onPress={() => { showToast('Loading audio template...'); popScreen(); setActiveTab('Reels'); }}>
            <Text style={styles.audioUseText}>Use Audio</Text>
          </Pressable>
        </ScrollView>
      </View>
    );
  }

  // ==========================================
  // SETTINGS DRAWERS & DETAILS
  // ==========================================
  function renderSettings() {
    const menuItems = [
      { id: 'AccountsCenter', title: 'Accounts Center', icon: 'shield-account-outline', isHeader: true },
      { id: 'Notifications', title: 'Notifications', icon: 'bell-outline' },
      { id: 'TimeManagement', title: 'Time spent', icon: 'clock-outline' },
      { id: 'Blocked', title: 'Blocked', icon: 'close-circle-outline' },
      { id: 'Saved', title: 'Saved', icon: 'bookmark-outline' },
      { id: 'Archive', title: 'Archive', icon: 'archive-outline' },
      { id: 'YourActivity', title: 'Your activity', icon: 'history' },
      { id: 'AccountPrivacy', title: 'Account privacy', icon: 'lock-outline' },
      { id: 'Help', title: 'Help', icon: 'help-circle-outline' },
    ];

    return (
      <View style={[styles.subPageRoot, { backgroundColor: isDark ? '#000' : '#fff' }]}>
        <View style={[styles.subPageHeader, { borderBottomColor: isDark ? '#262626' : '#efefef' }]}>
          <Pressable onPress={handleBackPress}>
            <Ionicons name="arrow-back" size={24} color={isDark ? '#fff' : '#000'} />
          </Pressable>
          <Text style={[styles.subPageTitle, { color: isDark ? '#fff' : '#000' }]}>Settings and activity</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView style={styles.flex1} contentContainerStyle={{ paddingBottom: 100 }}>
          {/* Main search bar in settings */}
          <View style={styles.settingsSearchBox}>
            <Ionicons name="search" size={16} color="#888" style={{ marginRight: 8 }} />
            <TextInput
              style={[styles.settingsSearchInput, { color: isDark ? '#fff' : '#000' }]}
              placeholder="Search settings..."
              placeholderTextColor="#888"
            />
          </View>

          {/* Settings list items */}
          {menuItems.map((item) => (
            <Pressable
              key={item.id}
              style={[styles.settingsItem, item.isHeader && styles.settingsItemFeatured, { borderBottomColor: isDark ? '#262626' : '#efefef' }]}
              onPress={() => pushScreen(`Settings_${item.id}`)}
            >
              <View style={styles.row}>
                <MaterialCommunityIcons name={item.icon as any} size={22} color={isDark ? '#fff' : '#333'} style={{ marginRight: 16 }} />
                <Text style={[styles.settingsItemText, { color: isDark ? '#fff' : '#000' }]}>{item.title}</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#888" />
            </Pressable>
          ))}
        </ScrollView>
      </View>
    );
  }

  // Settings Sub-page: Accounts Center
  function renderAccountsCenter() {
    return (
      <View style={[styles.subPageRoot, { backgroundColor: isDark ? '#000' : '#fff' }]}>
        <View style={styles.subPageHeader}>
          <Pressable onPress={handleBackPress}>
            <Ionicons name="arrow-back" size={24} color={isDark ? '#fff' : '#000'} />
          </Pressable>
          <Text style={[styles.subPageTitle, { color: isDark ? '#fff' : '#000' }]}>Accounts Center</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView style={styles.flex1} contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
          <View style={styles.accCenterBanner}>
            <Text style={styles.accCenterBannerTitle}>Gozy OS Account Manager</Text>
            <Text style={styles.accCenterBannerDesc}>Manage your connected experiences across travel, food, and social feeds in one place.</Text>
          </View>

          <Text style={styles.settingsGroupHeader}>Profiles</Text>
          <View style={styles.profileRow}>
            <Image source={{ uri: editingProfile.avatar }} style={styles.discoverAvatar} />
            <View style={styles.flex1}>
              <Text style={[styles.boldText, { color: isDark ? '#fff' : '#000' }]}>{editingProfile.name}</Text>
              <Text style={{ color: '#888', fontSize: 12 }}>{editingProfile.username}</Text>
            </View>
          </View>

          <Text style={styles.settingsGroupHeader}>Account Settings</Text>
          <Pressable style={styles.accCenterItem} onPress={() => showToast('Loading details...')}>
            <Text style={[styles.accCenterItemText, { color: isDark ? '#fff' : '#000' }]}>Personal Details</Text>
          </Pressable>
          <Pressable style={styles.accCenterItem} onPress={() => showToast('Loading details...')}>
            <Text style={[styles.accCenterItemText, { color: isDark ? '#fff' : '#000' }]}>Password & Security</Text>
          </Pressable>
          <Pressable style={styles.accCenterItem} onPress={() => showToast('Loading details...')}>
            <Text style={[styles.accCenterItemText, { color: isDark ? '#fff' : '#000' }]}>Connected Experiences</Text>
          </Pressable>
        </ScrollView>
      </View>
    );
  }

  // Settings Sub-page: Notifications
  function renderNotificationsSettings() {
    const updateNotifSetting = (key: string, val: boolean) => {
      setNotificationsSettings(prev => ({ ...prev, [key]: val }));
      showToast('Notifications preference updated.');
    };

    return (
      <View style={[styles.subPageRoot, { backgroundColor: isDark ? '#000' : '#fff' }]}>
        <View style={styles.subPageHeader}>
          <Pressable onPress={handleBackPress}>
            <Ionicons name="arrow-back" size={24} color={isDark ? '#fff' : '#000'} />
          </Pressable>
          <Text style={[styles.subPageTitle, { color: isDark ? '#fff' : '#000' }]}>Notifications</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView style={styles.flex1} contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
          <View style={styles.settingsSwitchRow}>
            <View style={styles.flex1}>
              <Text style={[styles.switchRowLabel, { color: isDark ? '#fff' : '#000' }]}>Pause All</Text>
              <Text style={styles.switchRowSub}>Temporarily pause all notifications on Gozy Social.</Text>
            </View>
            <Switch
              value={notificationsSettings.pauseAll}
              onValueChange={(v) => updateNotifSetting('pauseAll', v)}
            />
          </View>

          <View style={styles.settingsSwitchRow}>
            <View style={styles.flex1}>
              <Text style={[styles.switchRowLabel, { color: isDark ? '#fff' : '#000' }]}>Quiet Mode</Text>
              <Text style={styles.switchRowSub}>Automatically mute notifications at night.</Text>
            </View>
            <Switch
              value={notificationsSettings.quietMode}
              onValueChange={(v) => updateNotifSetting('quietMode', v)}
            />
          </View>

          <View style={styles.settingsSwitchRow}>
            <View style={styles.flex1}>
              <Text style={[styles.switchRowLabel, { color: isDark ? '#fff' : '#000' }]}>Likes & Comments</Text>
            </View>
            <Switch
              value={notificationsSettings.likesComments}
              onValueChange={(v) => updateNotifSetting('likesComments', v)}
            />
          </View>

          <View style={styles.settingsSwitchRow}>
            <View style={styles.flex1}>
              <Text style={[styles.switchRowLabel, { color: isDark ? '#fff' : '#000' }]}>Direct Messages</Text>
            </View>
            <Switch
              value={notificationsSettings.messages}
              onValueChange={(v) => updateNotifSetting('messages', v)}
            />
          </View>
        </ScrollView>
      </View>
    );
  }

  // Settings Sub-page: Time Spent
  function renderTimeManagement() {
    return (
      <View style={[styles.subPageRoot, { backgroundColor: isDark ? '#000' : '#fff' }]}>
        <View style={styles.subPageHeader}>
          <Pressable onPress={handleBackPress}>
            <Ionicons name="arrow-back" size={24} color={isDark ? '#fff' : '#000'} />
          </Pressable>
          <Text style={[styles.subPageTitle, { color: isDark ? '#fff' : '#000' }]}>Time Spent</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView style={styles.flex1} contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
          <View style={styles.screentimeDisplay}>
            <Text style={styles.screentimeTitle}>Daily Average</Text>
            <Text style={[styles.screentimeHours, { color: isDark ? '#fff' : '#000' }]}>1h 12m</Text>
            <Text style={styles.screentimeDesc}>Time spent per day on Gozy Social this week.</Text>
          </View>

          {/* Simple Weekly Bar Chart */}
          <Text style={styles.settingsGroupHeader}>Weekly Activity</Text>
          <View style={styles.chartContainer}>
            <View style={styles.chartBarCol}>
              <View style={[styles.chartBar, { height: 45 }]} />
              <Text style={styles.chartBarLabel}>M</Text>
            </View>
            <View style={styles.chartBarCol}>
              <View style={[styles.chartBar, { height: 80 }]} />
              <Text style={styles.chartBarLabel}>T</Text>
            </View>
            <View style={styles.chartBarCol}>
              <View style={[styles.chartBar, { height: 30 }]} />
              <Text style={styles.chartBarLabel}>W</Text>
            </View>
            <View style={styles.chartBarCol}>
              <View style={[styles.chartBar, { height: 120 }]} />
              <Text style={styles.chartBarLabel}>T</Text>
            </View>
            <View style={styles.chartBarCol}>
              <View style={[styles.chartBar, { height: 75 }]} />
              <Text style={styles.chartBarLabel}>F</Text>
            </View>
          </View>

          <Text style={styles.settingsGroupHeader}>Manage Screen Time</Text>
          <View style={styles.settingsSwitchRow}>
            <View style={styles.flex1}>
              <Text style={[styles.switchRowLabel, { color: isDark ? '#fff' : '#000' }]}>Set Daily Limit</Text>
              <Text style={styles.switchRowSub}>Alert me when daily limit of {dailyTimeLimit}m is reached.</Text>
            </View>
            <Switch
              value={true}
              onValueChange={() => { }}
            />
          </View>
        </ScrollView>
      </View>
    );
  }

  // Settings Sub-page: Blocked Users
  function renderBlockedAccounts() {
    return (
      <View style={[styles.subPageRoot, { backgroundColor: isDark ? '#000' : '#fff' }]}>
        <View style={styles.subPageHeader}>
          <Pressable onPress={handleBackPress}>
            <Ionicons name="arrow-back" size={24} color={isDark ? '#fff' : '#000'} />
          </Pressable>
          <Text style={[styles.subPageTitle, { color: isDark ? '#fff' : '#000' }]}>Blocked</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView style={styles.flex1} contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
          <Text style={[styles.suggestedTitle, { color: isDark ? '#fff' : '#000', marginBottom: 16 }]}>Blocked accounts</Text>
          {blockedUsers.length === 0 ? (
            <Text style={styles.emptyGridSub}>You haven't blocked anyone yet.</Text>
          ) : (
            blockedUsers.map((user) => (
              <View key={user.id} style={styles.discoverRow}>
                <Image source={{ uri: user.avatar }} style={styles.discoverAvatar} />
                <View style={styles.flex1}>
                  <Text style={[styles.discoverName, { color: isDark ? '#fff' : '#000' }]}>{user.name}</Text>
                </View>
                <Pressable
                  style={styles.unblockBtn}
                  onPress={() => {
                    setBlockedUsers(prev => prev.filter(u => u.id !== user.id));
                    showToast(`Unblocked ${user.name}`);
                  }}
                >
                  <Text style={styles.unblockBtnText}>Unblock</Text>
                </Pressable>
              </View>
            ))
          )}
        </ScrollView>
      </View>
    );
  }

  // Settings Sub-page: Saved (collections)
  function renderSavedCollections() {
    return (
      <View style={[styles.subPageRoot, { backgroundColor: isDark ? '#000' : '#fff' }]}>
        <View style={styles.subPageHeader}>
          <Pressable onPress={handleBackPress}>
            <Ionicons name="arrow-back" size={24} color={isDark ? '#fff' : '#000'} />
          </Pressable>
          <Text style={[styles.subPageTitle, { color: isDark ? '#fff' : '#000' }]}>Saved</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView style={styles.flex1} contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
          <View style={styles.savedGrid}>
            <Pressable style={styles.savedFolder} onPress={() => showToast('Opening folder...')}>
              <View style={styles.savedFolderThumb}>
                <Ionicons name="heart" size={32} color="#ff1744" />
              </View>
              <Text style={[styles.savedFolderTitle, { color: isDark ? '#fff' : '#000' }]}>All Posts</Text>
            </Pressable>

            <Pressable style={styles.savedFolder} onPress={() => showToast('Opening folder...')}>
              <View style={styles.savedFolderThumb}>
                <Ionicons name="musical-notes" size={32} color="#0084FF" />
              </View>
              <Text style={[styles.savedFolderTitle, { color: isDark ? '#fff' : '#000' }]}>Audio</Text>
            </Pressable>
          </View>
        </ScrollView>
      </View>
    );
  }

  // Settings Sub-page: Archive
  function renderArchive() {
    return (
      <View style={[styles.subPageRoot, { backgroundColor: isDark ? '#000' : '#fff' }]}>
        <View style={styles.subPageHeader}>
          <Pressable onPress={handleBackPress}>
            <Ionicons name="arrow-back" size={24} color={isDark ? '#fff' : '#000'} />
          </Pressable>
          <Text style={[styles.subPageTitle, { color: isDark ? '#fff' : '#000' }]}>Archive</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.centeredContainer}>
          <Ionicons name="archive-outline" size={48} color={isDark ? '#444' : '#ccc'} />
          <Text style={[styles.emptyGridTitle, { color: isDark ? '#fff' : '#000' }]}>Archive Empty</Text>
          <Text style={styles.emptyGridSub}>Your archived stories and posts will appear here.</Text>
        </View>
      </View>
    );
  }

  // Settings Sub-page: Your Activity
  function renderYourActivity() {
    return (
      <View style={[styles.subPageRoot, { backgroundColor: isDark ? '#000' : '#fff' }]}>
        <View style={styles.subPageHeader}>
          <Pressable onPress={handleBackPress}>
            <Ionicons name="arrow-back" size={24} color={isDark ? '#fff' : '#000'} />
          </Pressable>
          <Text style={[styles.subPageTitle, { color: isDark ? '#fff' : '#000' }]}>Your Activity</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView style={styles.flex1} contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
          <Text style={[styles.suggestedTitle, { color: isDark ? '#fff' : '#000', marginBottom: 12 }]}>Review likes & comments</Text>
          <Pressable style={styles.settingsItem} onPress={() => showToast('Loading likes...')}>
            <Text style={{ color: isDark ? '#fff' : '#000' }}>Likes</Text>
          </Pressable>
          <Pressable style={styles.settingsItem} onPress={() => showToast('Loading comments...')}>
            <Text style={{ color: isDark ? '#fff' : '#000' }}>Comments</Text>
          </Pressable>
          <Pressable style={styles.settingsItem} onPress={() => showToast('Loading watch logs...')}>
            <Text style={{ color: isDark ? '#fff' : '#000' }}>Reels view history</Text>
          </Pressable>
        </ScrollView>
      </View>
    );
  }

  // Settings Sub-page: Account Privacy
  function renderAccountPrivacy() {
    return (
      <View style={[styles.subPageRoot, { backgroundColor: isDark ? '#000' : '#fff' }]}>
        <View style={styles.subPageHeader}>
          <Pressable onPress={handleBackPress}>
            <Ionicons name="arrow-back" size={24} color={isDark ? '#fff' : '#000'} />
          </Pressable>
          <Text style={[styles.subPageTitle, { color: isDark ? '#fff' : '#000' }]}>Account Privacy</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView style={styles.flex1} contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
          <View style={styles.settingsSwitchRow}>
            <View style={styles.flex1}>
              <Text style={[styles.switchRowLabel, { color: isDark ? '#fff' : '#000' }]}>Private Account</Text>
              <Text style={styles.switchRowSub}>Only approved followers can see your posts and reels.</Text>
            </View>
            <Switch
              value={privateAccount}
              onValueChange={(v) => {
                setPrivateAccount(v);
                showToast(v ? 'Account is now Private' : 'Account is now Public');
              }}
            />
          </View>
        </ScrollView>
      </View>
    );
  }

  // Settings Sub-page: Help Center
  function renderHelpCenter() {
    return (
      <View style={[styles.subPageRoot, { backgroundColor: isDark ? '#000' : '#fff' }]}>
        <View style={styles.subPageHeader}>
          <Pressable onPress={handleBackPress}>
            <Ionicons name="arrow-back" size={24} color={isDark ? '#fff' : '#000'} />
          </Pressable>
          <Text style={[styles.subPageTitle, { color: isDark ? '#fff' : '#000' }]}>Help Center</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView style={styles.flex1} contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
          <Text style={[styles.boldText, { color: isDark ? '#fff' : '#000', fontSize: 16, marginBottom: 12 }]}>How can we help?</Text>
          <Pressable style={styles.accCenterItem} onPress={() => showToast('Help guide loading...')}>
            <Text style={[styles.accCenterItemText, { color: isDark ? '#fff' : '#000' }]}>Report a Problem</Text>
          </Pressable>
          <Pressable style={styles.accCenterItem} onPress={() => showToast('Help guide loading...')}>
            <Text style={[styles.accCenterItemText, { color: isDark ? '#fff' : '#000' }]}>Privacy & Security Help</Text>
          </Pressable>
          <Pressable style={styles.accCenterItem} onPress={() => showToast('Help guide loading...')}>
            <Text style={[styles.accCenterItemText, { color: isDark ? '#fff' : '#000' }]}>Support Requests</Text>
          </Pressable>
        </ScrollView>
      </View>
    );
  }

  // ==========================================
  // STORIES OVERLAY PREVIEW
  // ==========================================
  function renderStoryOverlay() {
    if (activeStoryIndex === null) return null;
    const story = mockStories[activeStoryIndex];

    return (
      <View style={styles.storyOverlayRoot}>
        <View style={styles.storyProgressContainer}>
          {mockStories.map((_, i) => (
            <View key={i} style={styles.storyProgressBarBackground}>
              <View
                style={[
                  styles.storyProgressBarFill,
                  i < activeStoryIndex && { width: '100%' },
                  i === activeStoryIndex && { width: '100%' }, // simulated full width
                ]}
              />
            </View>
          ))}
        </View>

        <View style={styles.storyOverlayHeader}>
          <Image source={{ uri: story.avatar }} style={styles.storyHeaderAvatar} />
          <Text style={styles.storyHeaderName}>{story.name}</Text>
          <Pressable style={styles.storyCloseBtn} onPress={() => setActiveStoryIndex(null)}>
            <Ionicons name="close" size={24} color="#fff" />
          </Pressable>
        </View>

        <Image source={{ uri: story.image }} style={styles.storyOverlayImage} contentFit="contain" />

        <Pressable
          style={styles.storyLeftTap}
          onPress={() => {
            if (activeStoryIndex > 0) setActiveStoryIndex(activeStoryIndex - 1);
          }}
        />
        <Pressable
          style={styles.storyRightTap}
          onPress={() => {
            if (activeStoryIndex < mockStories.length - 1) {
              setActiveStoryIndex(activeStoryIndex + 1);
            } else {
              setActiveStoryIndex(null);
            }
          }}
        />
      </View>
    );
  }

  // ==========================================
  // COMMENTS BOTTOM SHEET
  // ==========================================
  function renderCommentsSheet() {
    const handleAddComment = () => {
      if (!newCommentText.trim()) return;
      const newComment = {
        id: Math.random().toString(),
        username: editingProfile.username,
        text: newCommentText,
        likes: 0,
        liked: false,
        avatar: editingProfile.avatar,
      };
      setReelsComments(prev => [newComment, ...prev]);
      setNewCommentText('');
      showToast('Comment posted!');
    };

    return (
      <View style={styles.bottomSheetBackdrop}>
        <Pressable style={styles.flex1} onPress={() => setCommentSheetOpen(false)} />
        <View style={[styles.bottomSheetContent, { backgroundColor: isDark ? '#1a1a1a' : '#fff' }]}>
          <View style={styles.bottomSheetHeader}>
            <Text style={[styles.bottomSheetTitle, { color: isDark ? '#fff' : '#000' }]}>Comments</Text>
            <Pressable onPress={() => setCommentSheetOpen(false)}>
              <Ionicons name="close" size={24} color={isDark ? '#fff' : '#000'} />
            </Pressable>
          </View>

          {/* Quick Reaction Emojis */}
          <View style={styles.reactionEmojisRow}>
            {['❤️', '🙌', '🔥', '👏', '😂', '😍', '😮', '😢'].map((emoji) => (
              <Pressable key={emoji} onPress={() => setNewCommentText(prev => prev + emoji)} style={styles.emojiReactionBtn}>
                <Text style={{ fontSize: 24 }}>{emoji}</Text>
              </Pressable>
            ))}
          </View>

          {/* Comments List */}
          <ScrollView style={styles.flex1}>
            {reelsComments.map((c, index) => (
              <View key={c.id} style={styles.commentRow}>
                <Image source={{ uri: c.avatar }} style={styles.commentAvatar} />
                <View style={styles.flex1}>
                  <Text style={[styles.commentUsername, { color: isDark ? '#fff' : '#000' }]}>{c.username}</Text>
                  <Text style={[styles.commentText, { color: isDark ? '#ccc' : '#333' }]}>{c.text}</Text>
                </View>
                <Pressable
                  onPress={() => {
                    const newComments = [...reelsComments];
                    newComments[index].liked = !newComments[index].liked;
                    newComments[index].likes += newComments[index].liked ? 1 : -1;
                    setReelsComments(newComments);
                  }}
                  style={styles.commentLikeBtn}
                >
                  <Ionicons
                    name={c.liked ? 'heart' : 'heart-outline'}
                    size={16}
                    color={c.liked ? '#ff1744' : '#888'}
                  />
                  <Text style={{ color: '#888', fontSize: 10 }}>{c.likes}</Text>
                </Pressable>
              </View>
            ))}
          </ScrollView>

          {/* Input field */}
          <View style={[styles.commentInputRow, { borderTopColor: isDark ? '#262626' : '#efefef' }]}>
            <Image source={{ uri: editingProfile.avatar }} style={styles.commentInputAvatar} />
            <TextInput
              style={[styles.commentTextInput, { color: isDark ? '#fff' : '#000', backgroundColor: isDark ? '#262626' : '#f5f5f5' }]}
              placeholder="Join the conversation..."
              placeholderTextColor="#888"
              value={newCommentText}
              onChangeText={setNewCommentText}
            />
            <Pressable onPress={handleAddComment} disabled={!newCommentText.trim()}>
              <Text style={[styles.commentPostBtn, { opacity: newCommentText.trim() ? 1 : 0.5 }]}>Post</Text>
            </Pressable>
          </View>
        </View>
      </View>
    );
  }

  // ==========================================
  // SHARE BOTTOM SHEET
  // ==========================================
  function renderShareSheet() {
    const contacts = [
      { id: '1', name: 'V Nikshitha', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=v_nikshitha', verified: true },
      { id: '2', name: 'Nikshitha', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=nikshitha_p' },
      { id: '3', name: 'im_sandy', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sandy' },
      { id: '4', name: 'Albinder Dhindsa', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=albinder', verified: true },
      { id: '5', name: 'Vineeta Singh', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=vineeta', verified: true },
      { id: '6', name: 'Nikhil Kamath', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=nikhil', verified: true },
    ];

    return (
      <View style={styles.bottomSheetBackdrop}>
        <Pressable style={styles.flex1} onPress={() => setShareSheetOpen(false)} />
        <View style={[styles.bottomSheetContent, { backgroundColor: isDark ? '#1a1a1a' : '#fff' }]}>
          <View style={styles.bottomSheetHeader}>
            <Text style={[styles.bottomSheetTitle, { color: isDark ? '#fff' : '#000' }]}>Send to</Text>
            <Pressable onPress={() => setShareSheetOpen(false)}>
              <Ionicons name="close" size={24} color={isDark ? '#fff' : '#000'} />
            </Pressable>
          </View>

          {/* Search bar inside send */}
          <View style={[styles.shareSearchBox, { backgroundColor: isDark ? '#2a2a2a' : '#f0f0f0' }]}>
            <Ionicons name="search" size={16} color={isDark ? '#aaa' : '#555'} style={{ marginRight: 8 }} />
            <TextInput
              style={[styles.shareSearchInput, { color: isDark ? '#fff' : '#000' }]}
              placeholder="Search contacts..."
              placeholderTextColor={isDark ? '#888' : '#999'}
            />
          </View>

          {/* Contact grid with names clearly visible */}
          <View style={{ marginVertical: 8 }}>
            <Text style={{ fontSize: 11, color: isDark ? '#aaa' : '#666', paddingHorizontal: 16, marginBottom: 8, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 }}>Suggested</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 12 }}>
              {contacts.map((contact) => (
                <Pressable
                  key={contact.id}
                  style={styles.shareContactItem}
                  onPress={() => {
                    showToast(`✉️ Reel shared to ${contact.name}!`);
                    setShareSheetOpen(false);
                  }}
                >
                  <Image source={{ uri: contact.avatar }} style={styles.shareContactAvatar} />
                  <View style={styles.row}>
                    <Text style={[styles.shareContactName, { color: isDark ? '#fff' : '#111' }]} numberOfLines={1}>
                      {contact.name.split(' ')[0]}
                    </Text>
                    {contact.verified && (
                      <MaterialCommunityIcons name="check-decagram" size={10} color="#0084FF" style={{ marginLeft: 2 }} />
                    )}
                  </View>
                </Pressable>
              ))}
            </ScrollView>
          </View>

          <View style={styles.sectionHeaderLine} />

          {/* Sharing app shortcuts */}
          <View style={styles.shareShortcutsRow}>
            <Pressable style={styles.shortcutBtn} onPress={() => { showToast('Added to story!'); setShareSheetOpen(false); }}>
              <View style={[styles.shortcutIconCircle, { backgroundColor: isDark ? '#333' : '#f0f0f0' }]}>
                <Ionicons name="add" size={22} color={isDark ? '#fff' : '#000'} />
              </View>
              <Text style={[styles.shortcutText, { color: isDark ? '#ddd' : '#222' }]}>Add to{"\n"}story</Text>
            </Pressable>
            <Pressable style={styles.shortcutBtn} onPress={() => { showToast('✅ Link copied!'); setShareSheetOpen(false); }}>
              <View style={[styles.shortcutIconCircle, { backgroundColor: isDark ? '#333' : '#f0f0f0' }]}>
                <Ionicons name="link" size={22} color={isDark ? '#fff' : '#000'} />
              </View>
              <Text style={[styles.shortcutText, { color: isDark ? '#ddd' : '#222' }]}>Copy{"\n"}link</Text>
            </Pressable>
            <Pressable style={styles.shortcutBtn} onPress={() => { showToast('Sharing via WhatsApp...'); setShareSheetOpen(false); }}>
              <View style={[styles.shortcutIconCircle, { backgroundColor: '#25D366' }]}>
                <Ionicons name="logo-whatsapp" size={22} color="#fff" />
              </View>
              <Text style={[styles.shortcutText, { color: isDark ? '#ddd' : '#222' }]}>WhatsApp</Text>
            </Pressable>
            <Pressable style={styles.shortcutBtn} onPress={() => { showToast('Sharing to Instagram...'); setShareSheetOpen(false); }}>
              <View style={[styles.shortcutIconCircle, { backgroundColor: '#E1306C' }]}>
                <Ionicons name="logo-instagram" size={22} color="#fff" />
              </View>
              <Text style={[styles.shortcutText, { color: isDark ? '#ddd' : '#222' }]}>Instagram</Text>
            </Pressable>
          </View>
        </View>
      </View>
    );
  }

  // ==========================================
  // MORE OPTIONS BOTTOM SHEET
  // ==========================================
  function renderMoreOptionsSheet() {
    const options = [
      { label: 'Save', icon: 'bookmark-outline', action: () => showToast('Reel saved to collections!') },
      { label: 'Playback Speed', icon: 'speedometer', action: () => showToast('Speed toggled to 1.5x') },
      { label: 'Not Interested', icon: 'eye-off-outline', action: () => showToast('We will show fewer reels like this.') },
      { label: 'Report Reel', icon: 'flag-outline', action: () => showToast('Thank you for reporting this post.') },
    ];

    return (
      <View style={styles.bottomSheetBackdrop}>
        <Pressable style={styles.flex1} onPress={() => setOptionsSheetOpen(false)} />
        <View style={[styles.bottomSheetContent, { backgroundColor: isDark ? '#1a1a1a' : '#fff' }]}>
          <View style={styles.bottomSheetHeader}>
            <Text style={[styles.bottomSheetTitle, { color: isDark ? '#fff' : '#000' }]}>Options</Text>
            <Pressable onPress={() => setOptionsSheetOpen(false)}>
              <Ionicons name="close" size={24} color={isDark ? '#fff' : '#000'} />
            </Pressable>
          </View>

          <View style={{ paddingVertical: 12 }}>
            {options.map((opt, idx) => (
              <Pressable
                key={idx}
                style={[styles.settingsItem, { borderBottomColor: isDark ? '#262626' : '#efefef' }]}
                onPress={() => {
                  opt.action();
                  setOptionsSheetOpen(false);
                }}
              >
                <View style={styles.row}>
                  <Ionicons name={opt.icon as any} size={20} color={isDark ? '#fff' : '#333'} style={{ marginRight: 16 }} />
                  <Text style={[styles.settingsItemText, { color: isDark ? '#fff' : '#000' }]}>{opt.label}</Text>
                </View>
              </Pressable>
            ))}
          </View>
        </View>
      </View>
    );
  }

  // ==========================================
  // SWIPE OVERLAYS
  // ==========================================
  function renderSwipeLeftModal() {
    const item = activeSwipeLeftExp;
    if (!item) return null;

    const isTravel = item.category === 'Travel';
    const titleText = isTravel ? 'Book Trip' : (item.category === 'Food' ? 'Book Food' : (item.category === 'Shopping' ? 'Book Product' : 'Book Ticket'));

    const nearestName = isTravel ? 'Bangalore City Station' : (item.category === 'Food' ? 'Glen\'s Bakehouse' : (item.category === 'Shopping' ? 'UB City Boutique' : 'PVR Orion Mall'));
    const nearestRating = isTravel ? '4' : (item.category === 'Food' ? '4.2' : (item.category === 'Shopping' ? '4.5' : '4.6'));
    const nearestDistance = isTravel ? '5.0 km' : (item.category === 'Food' ? '1.2 km' : (item.category === 'Shopping' ? '3.1 km' : '8.4 km'));
    const nearestTime = isTravel ? '20 min' : (item.category === 'Food' ? '15 min' : (item.category === 'Shopping' ? '25 min' : '30 min'));
    const displayPrice = isTravel ? '₹45,000 – ₹1,20,000' : (item.category === 'Food' ? '₹800 – ₹2,500' : (item.category === 'Shopping' ? '₹1,899 – ₹4,999' : '₹380 – ₹1,200'));
    const iconName = isTravel ? 'airplane' : (item.category === 'Food' ? 'silverware-fork-knife' : (item.category === 'Shopping' ? 'shopping' : 'ticket-outline'));

    const displayTitle = isTravel ? 'Maldives Overwater Villas' : item.title;
    const displayLocation = isTravel ? 'Malé, Maldives' : item.location;
    const displayImg = isTravel ? 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=600&q=80' : item.posterUrl;

    const similarOptions = isTravel ? [
      { name: 'Kempegowda Intl Airport', rating: '4.4', dist: '35 km', price: 'Varies', img: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=200&q=80' },
      { name: 'Bangalore City Station', rating: '4', dist: '5.0 km', price: '₹100-2500', img: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=200&q=80' },
      { name: 'Majestic Bus Terminal', rating: '3.8', dist: '5.2 km', price: '₹200-1500', img: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=200&q=80' },
    ] : (item.category === 'Food' ? [
      { name: 'Glen\'s Bakehouse', rating: '4.2', dist: '1.2 km', price: '₹600 for two', img: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&q=80' },
      { name: 'Third Wave Coffee', rating: '4.4', dist: '0.8 km', price: '₹500 for two', img: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=200&q=80' },
      { name: 'Truffle Burger Hub', rating: '4.1', dist: '1.5 km', price: '₹700 for two', img: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&q=80' },
    ] : item.category === 'Shopping' ? [
      { name: 'UB City Boutique', rating: '4.5', dist: '3.1 km', price: '₹1899+', img: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=200&q=80' },
      { name: 'Zara Indiranagar', rating: '4.3', dist: '2.0 km', price: '₹999+', img: 'https://images.unsplash.com/photo-1567401893930-7be7c28a4b4b?w=200&q=80' },
      { name: 'H&M Central Mall', rating: '4.0', dist: '4.2 km', price: '₹799+', img: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=200&q=80' },
    ] : [
      { name: 'PVR Orion Mall', rating: '4.6', dist: '8.4 km', price: '₹380+', img: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=200&q=80' },
      { name: 'Cinepolis Sonipat', rating: '9.4', dist: '0.5 km', price: '₹220', img: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=200&q=80' },
      { name: 'Forum IMAX Bengaluru', rating: '4.7', dist: '6.2 km', price: '₹400+', img: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=200&q=80' },
    ]);

    return (
      <View style={styles.bookingOverlayBackdrop}>
        <View style={[styles.bookingOverlayContent, { backgroundColor: isDark ? '#121212' : '#fff' }]}>
          {/* Header Row */}
          <View style={styles.bookingOverlayHeader}>
            <View style={styles.row}>
              <View style={styles.bookingHeaderIconCircle}>
                <MaterialCommunityIcons name={iconName as any} size={20} color="#fff" />
              </View>
              <Text style={[styles.bookingHeaderTitle, { color: isDark ? '#fff' : '#000' }]}>{titleText}</Text>
            </View>
            <Pressable style={styles.bookingCloseBtn} onPress={() => setActiveSwipeLeftExp(null)}>
              <Ionicons name="close" size={20} color={isDark ? '#fff' : '#000'} />
            </Pressable>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
            {/* Item Details Card */}
            <View style={[styles.bookingItemCard, { backgroundColor: isDark ? '#1a1a1a' : '#f9f9f9', borderColor: isDark ? '#262626' : '#efefef' }]}>
              <Image source={{ uri: displayImg }} style={styles.bookingItemImg} />
              <View style={styles.flex1}>
                <Text style={[styles.bookingItemTitle, { color: isDark ? '#fff' : '#000' }]}>{displayTitle}</Text>
                <Text style={styles.bookingItemLoc}>📍 {displayLocation}</Text>
              </View>
              <Text style={styles.bookingItemPrice}>{displayPrice}</Text>
            </View>

            {/* NEAREST STORE */}
            <View style={styles.bookingSectionHeaderRow}>
              <Text style={styles.bookingSectionLabel}>NEAREST STORE</Text>
              <Pressable onPress={() => showToast('Selecting nearest outlet...')}>
                <Text style={styles.bookingChangeText}>Change</Text>
              </Pressable>
            </View>

            <View style={[styles.bookingNearestCard, { backgroundColor: isDark ? '#1e293b' : '#eff6ff', borderColor: '#0084FF' }]}>
              <Image source={{ uri: similarOptions[1]?.img || displayImg }} style={styles.bookingNearestImg} />
              <View style={styles.flex1}>
                <Text style={[styles.bookingNearestName, { color: isDark ? '#fff' : '#0f172a' }]}>{nearestName}</Text>
                <Text style={[styles.bookingNearestSub, { color: isDark ? '#94a3b8' : '#475569' }]}>
                  ⭐ {nearestRating}  •  {nearestDistance}  •  {nearestTime}
                </Text>
              </View>
              <Ionicons name="checkmark-circle" size={24} color="#0084FF" />
            </View>

            {/* Time & Distance Chips */}
            <View style={styles.bookingChipsRow}>
              <View style={[styles.bookingChipCard, { backgroundColor: isDark ? '#1a1a1a' : '#f8fafc' }]}>
                <Ionicons name="time-outline" size={22} color="#0084FF" />
                <View>
                  <Text style={[styles.bookingChipVal, { color: isDark ? '#fff' : '#1e293b' }]}>{nearestTime}</Text>
                  <Text style={styles.bookingChipLabel}>{isTravel ? 'TRAVEL TIME' : 'DELIVERY'}</Text>
                </View>
              </View>
              <View style={[styles.bookingChipCard, { backgroundColor: isDark ? '#1a1a1a' : '#f8fafc' }]}>
                <Ionicons name="location-outline" size={22} color="#0084FF" />
                <View>
                  <Text style={[styles.bookingChipVal, { color: isDark ? '#fff' : '#1e293b' }]}>{nearestDistance}</Text>
                  <Text style={styles.bookingChipLabel}>DISTANCE</Text>
                </View>
              </View>
            </View>

            {/* Total Price Box */}
            <View style={[styles.bookingPriceBox, { backgroundColor: isDark ? '#1e293b' : '#eff6ff' }]}>
              <Text style={[styles.bookingPriceLabelText, { color: isDark ? '#fff' : '#0f172a' }]}>Total Price</Text>
              <Text style={styles.bookingPriceValText}>{displayPrice}</Text>
            </View>

            {/* NEARBY SIMILAR OPTIONS */}
            <Text style={styles.bookingSectionLabel}>NEARBY SIMILAR TRAVEL OPTIONS</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.bookingSimilarScroll}>
              {similarOptions.map((opt, i) => (
                <View key={i} style={[styles.bookingSimilarCard, { backgroundColor: isDark ? '#1a1a1a' : '#fff', borderColor: isDark ? '#262626' : '#efefef' }]}>
                  <Image source={{ uri: opt.img }} style={styles.bookingSimilarImg} />
                  <View style={{ padding: 8 }}>
                    <Text style={[styles.bookingSimilarName, { color: isDark ? '#fff' : '#1e293b' }]} numberOfLines={1}>{opt.name}</Text>
                    <Text style={styles.bookingSimilarMeta}>⭐ {opt.rating}  •  {opt.dist}</Text>
                    <Text style={styles.bookingSimilarPrice}>{opt.price}</Text>
                  </View>
                </View>
              ))}
            </ScrollView>

            <Pressable style={styles.bookingConfirmBtn} onPress={() => {
              showToast('Booking successfully created!');
              setActiveSwipeLeftExp(null);
            }}>
              <Text style={styles.bookingConfirmBtnText}>Confirm and pay</Text>
            </Pressable>
          </ScrollView>
        </View>
      </View>
    );
  }

  function renderSwipeRightModal() {
    const item = activeSwipeRightExp;
    if (!item) return null;

    const isTravel = item.category === 'Travel';
    const displayTitle = isTravel ? 'Maldives Overwater Villas' : item.title;
    const displaySubtitle = isTravel ? 'Your dream destination awaits' : item.subtitle;
    const displayLoc = isTravel ? 'Malé, Maldives' : item.location;
    const displayPrice = isTravel ? '₹45,000 – ₹1,20,000' : item.priceLabel;
    const displayImg = isTravel ? 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=600&q=80' : item.posterUrl;

    const ratingText = isTravel ? '4.6 / 5' : `${item.rating} / 5`;
    const bestTime = isTravel ? 'Oct – Mar' : 'All Year';
    const duration = isTravel ? '3–7 days' : item.duration;
    const weather = isTravel ? 'Pleasant' : (item.vibe || 'Chill');

    const descText = isTravel
      ? 'Maldives Overwater Villas — experience the magic of Malé, Maldives. From stunning landscapes to world-class hospitality, this tropical paradise offers pristine sandy beaches, snorkeling over beautiful coral reefs, and luxurious private overwater villas with breathtaking sunset views.'
      : item.description;

    const highlightsTitle = isTravel ? 'Trip Highlights' : (item.category === 'Food' ? 'Popular Dishes' : (item.category === 'Shopping' ? 'Product Features' : 'Show Details'));

    const highlights = isTravel
      ? ['Scenic viewpoints & landmarks', 'Local cuisine & culture', 'Adventure activities', 'Couples & honeymoons', 'Family vacations', 'Solo adventurers', 'Weekend getaways']
      : (item.category === 'Food'
        ? ['Signature chef menu items', 'Freshly sourced organic ingredients', 'Curated table service', 'Fine-dining ambience']
        : item.category === 'Shopping'
          ? ['Oversized premium fit', 'Durable high-quality fabrics', 'Exclusive designer drop', 'Limited stock available']
          : ['Premium IMAX screening seats', 'Surround sound audio experience', 'After-show group social hangouts', 'Snacks and beverages included']);

    const availableAtText = isTravel ? 'Kempegowda Intl Airport' : (item.category === 'Food' ? 'Indiranagar Chef Table' : (item.category === 'Shopping' ? 'UB City Boutique Mall' : 'Orion Mall Multiplex'));

    return (
      <View style={[styles.detailsRoot, { backgroundColor: isDark ? '#0a0f1d' : '#fff' }]}>
        <View style={styles.detailsCoverContainer}>
          <Image source={{ uri: displayImg }} style={styles.detailsCoverImg} />
          <LinearGradient colors={['rgba(0,0,0,0.6)', 'rgba(0,0,0,0.1)', 'rgba(0,0,0,0.8)']} style={StyleSheet.absoluteFillObject} />

          <Pressable style={styles.detailsCloseBtn} onPress={() => setActiveSwipeRightExp(null)}>
            <Ionicons name="close" size={24} color="#fff" />
          </Pressable>

          <View style={styles.detailsCoverTextOverlay}>
            <Text style={styles.detailsCoverTitle}>{displayTitle}</Text>
            <Text style={styles.detailsCoverSub}>{displaySubtitle}</Text>
            <View style={styles.detailsCoverPriceRow}>
              <Text style={styles.detailsCoverPrice}>{displayPrice}</Text>
              <Text style={styles.detailsCoverLoc}>📍 {displayLoc}</Text>
            </View>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
          <View style={styles.detailsBadgesRow}>
            <View style={[styles.detailsBadgeCard, { backgroundColor: isDark ? '#1a1a1a' : '#f8fafc' }]}>
              <Ionicons name="star" size={20} color="#EAB308" />
              <Text style={[styles.detailsBadgeVal, { color: isDark ? '#fff' : '#0f172a' }]}>{ratingText}</Text>
              <Text style={styles.detailsBadgeLabel}>RATING</Text>
            </View>
            <View style={[styles.detailsBadgeCard, { backgroundColor: isDark ? '#1a1a1a' : '#f8fafc' }]}>
              <Ionicons name="calendar-outline" size={20} color="#0084FF" />
              <Text style={[styles.detailsBadgeVal, { color: isDark ? '#fff' : '#0f172a' }]} numberOfLines={1}>{bestTime}</Text>
              <Text style={styles.detailsBadgeLabel}>BEST TIME</Text>
            </View>
            <View style={[styles.detailsBadgeCard, { backgroundColor: isDark ? '#1a1a1a' : '#f8fafc' }]}>
              <Ionicons name="airplane-outline" size={20} color="#10B981" />
              <Text style={[styles.detailsBadgeVal, { color: isDark ? '#fff' : '#0f172a' }]} numberOfLines={1}>{duration}</Text>
              <Text style={styles.detailsBadgeLabel}>DURATION</Text>
            </View>
            <View style={[styles.detailsBadgeCard, { backgroundColor: isDark ? '#1a1a1a' : '#f8fafc' }]}>
              <Ionicons name="thermometer-outline" size={20} color="#EC4899" />
              <Text style={[styles.detailsBadgeVal, { color: isDark ? '#fff' : '#0f172a' }]} numberOfLines={1}>{weather}</Text>
              <Text style={styles.detailsBadgeLabel}>{isTravel ? 'WEATHER' : 'VIBE'}</Text>
            </View>
          </View>

          <Text style={[styles.detailsDesc, { color: isDark ? '#94a3b8' : '#334155' }]}>{descText}</Text>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.detailsChipsScroll}>
            {item.tags.map((tag: string, i: number) => (
              <View key={i} style={[styles.detailsChip, { backgroundColor: isDark ? '#1e293b' : '#f1f5f9' }]}>
                <Text style={[styles.detailsChipText, { color: isDark ? '#cbd5e1' : '#475569' }]}>#{tag.replace(/\s+/g, '')}</Text>
              </View>
            ))}
          </ScrollView>

          <View style={styles.detailsHighlightsContainer}>
            <View style={styles.row}>
              <Text style={{ fontSize: 20, marginRight: 8 }}>🗺️</Text>
              <Text style={[styles.detailsHighlightsTitle, { color: isDark ? '#fff' : '#0f172a' }]}>{highlightsTitle}</Text>
            </View>
            {highlights.map((h, i) => (
              <View key={i} style={styles.detailsBulletRow}>
                <View style={styles.detailsBullet} />
                <Text style={[styles.detailsBulletText, { color: isDark ? '#cbd5e1' : '#334155' }]}>{h}</Text>
              </View>
            ))}
          </View>

          <View style={[styles.detailsAvailableBar, { borderTopColor: isDark ? '#1e293b' : '#e2e8f0' }]}>
            <View style={styles.row}>
              <View style={styles.detailsLocIconCircle}>
                <Ionicons name="location-outline" size={20} color="#0084FF" />
              </View>
              <View>
                <Text style={styles.detailsAvailableLabel}>AVAILABLE AT</Text>
                <Text style={[styles.detailsAvailableVal, { color: isDark ? '#fff' : '#0f172a' }]}>{availableAtText}</Text>
              </View>
            </View>
            <Pressable style={styles.detailsBookBtn} onPress={() => {
              showToast('Opening booking sheet...');
              setActiveSwipeLeftExp(item);
              setActiveSwipeRightExp(null);
            }}>
              <Text style={styles.detailsBookBtnText}>Book Now</Text>
            </Pressable>
          </View>
        </ScrollView>
      </View>
    );
  }
}

// ==========================================
// REEL CARD COMPONENT
// ==========================================
function ReelVideoCard({
  reel,
  isPlaying,
  onLike,
  onBookmark,
  onFollow,
  onCommentPress,
  onSharePress,
  onMorePress,
  onAudioPress,
  videoRef,
  onSwipe,
}: any) {
  const [isMuted, setIsMuted] = useState(false);
  const [showCaption, setShowCaption] = useState(false);
  const [progress, setProgress] = useState(0);

  // Swipe logic using PanResponder & Animated
  const translate = useRef(new RNAnimated.ValueXY()).current;
  const swipeThreshold = 80;

  const finishSwipe = (direction: 'left' | 'right') => {
    RNAnimated.timing(translate, {
      toValue: { x: direction === 'right' ? screenWidth : -screenWidth, y: 0 },
      duration: 180,
      useNativeDriver: true,
    }).start(() => {
      translate.setValue({ x: 0, y: 0 });
      if (onSwipe) onSwipe(direction);
    });
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) =>
        Math.abs(gestureState.dx) > 15 && Math.abs(gestureState.dx) > Math.abs(gestureState.dy),
      onPanResponderMove: RNAnimated.event([null, { dx: translate.x }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx > swipeThreshold) {
          finishSwipe('right');
        } else if (gestureState.dx < -swipeThreshold) {
          finishSwipe('left');
        } else {
          RNAnimated.spring(translate, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: true,
            friction: 7,
          }).start();
        }
      },
    })
  ).current;

  const rotation = translate.x.interpolate({
    inputRange: [-180, 0, 180],
    outputRange: ['-8deg', '0deg', '8deg'],
  });

  const likeOpacity = translate.x.interpolate({
    inputRange: [0, swipeThreshold, 150],
    outputRange: [0, 0.8, 1],
    extrapolate: 'clamp',
  });

  const skipOpacity = translate.x.interpolate({
    inputRange: [-150, -swipeThreshold, 0],
    outputRange: [1, 0.8, 0],
    extrapolate: 'clamp',
  });

  // Like Spring scale animations
  const likeScale = useSharedValue(1);
  const animatedLike = useAnimatedStyle(() => ({
    transform: [{ scale: likeScale.value }],
  }));

  const handleDoubleTap = () => {
    onLike();
    likeScale.value = withSpring(1.3, {}, () => {
      likeScale.value = withSpring(1);
    });
  };

  const handleVideoProgress = (status: any) => {
    if (status.isLoaded && status.durationMillis) {
      setProgress((status.positionMillis / status.durationMillis) * 100);
    }
  };

  return (
    <RNAnimated.View
      {...panResponder.panHandlers}
      style={[
        styles.reelContainer,
        {
          transform: [{ translateX: translate.x }, { rotate: rotation }],
        },
      ]}
    >
      {/* Thumbnail placeholder */}
      {reel.thumbnail && (
        <Image
          source={{ uri: reel.thumbnail }}
          style={[StyleSheet.absoluteFillObject, { zIndex: 0 }]}
          contentFit="cover"
        />
      )}

      {/* Video Stream */}
      <Video
        ref={videoRef}
        source={{ uri: reel.videoUrl }}
        style={[styles.video, { position: 'absolute', zIndex: 1 }]}
        resizeMode={ResizeMode.COVER}
        isLooping
        isMuted={isMuted}
        shouldPlay={isPlaying}
        onPlaybackStatusUpdate={handleVideoProgress}
        progressUpdateIntervalMillis={500}
      />

      {/* Sound active status button */}
      <Pressable style={[styles.muteBtn, { zIndex: 20 }]} onPress={() => setIsMuted(!isMuted)}>
        <Ionicons name={isMuted ? 'volume-off' : 'volume-high'} size={20} color="#fff" />
      </Pressable>

      {/* Swipe Overlay indicators */}
      <RNAnimated.View style={[styles.swipePill, styles.likePill, { opacity: likeOpacity, zIndex: 30 }]}>
        <Text style={styles.swipePillText}>Save</Text>
      </RNAnimated.View>
      <RNAnimated.View style={[styles.swipePill, styles.skipPill, { opacity: skipOpacity, zIndex: 30 }]}>
        <Text style={styles.swipePillText}>Skip</Text>
      </RNAnimated.View>

      {/* Bottom info section */}
      <View style={[styles.creatorSection, { zIndex: 20 }]}>
        <View style={styles.creatorRow}>
          <Image source={{ uri: reel.creator.avatar }} style={styles.creatorAvatar} />
          <View style={styles.creatorInfo}>
            <View style={styles.creatorNameRow}>
              <Text style={styles.creatorName}>{reel.creator.name}</Text>
              {reel.creator.verified && (
                <MaterialCommunityIcons name="check-decagram" size={14} color="#0084FF" />
              )}
            </View>
            <Text style={styles.creatorUsername}>@{reel.creator.username}</Text>
          </View>
          <Pressable
            onPress={onFollow}
            style={[styles.followBtn, reel.creator.isFollowing && styles.followBtnActive]}
          >
            <Text style={[styles.followBtnText, reel.creator.isFollowing && styles.followBtnTextActive]}>
              {reel.creator.isFollowing ? 'Following' : 'Follow'}
            </Text>
          </Pressable>
        </View>

        {/* Caption */}
        <Pressable onPress={() => setShowCaption(!showCaption)}>
          <Text style={styles.caption} numberOfLines={showCaption ? 0 : 2}>
            {reel.caption}
          </Text>
          {!showCaption && reel.caption.length > 50 && (
            <Text style={styles.readMore}>more</Text>
          )}
        </Pressable>

        {/* Audiopill */}
        <Pressable style={styles.audioPill} onPress={() => onAudioPress({ title: 'Gozy Original Audio', artist: reel.creator.name })}>
          <Ionicons name="musical-notes" size={12} color="#fff" style={{ marginRight: 6 }} />
          <Text style={styles.audioText} numberOfLines={1}>{reel.creator.name} • Original Audio</Text>
        </Pressable>
      </View>

      {/* Right engagement icons */}
      <View style={[styles.actionsColumn, { zIndex: 20 }]}>
        <Pressable style={styles.action} onPress={handleDoubleTap}>
          <Animated.View style={animatedLike}>
            <Ionicons
              name={reel.isLiked ? 'heart' : 'heart-outline'}
              size={32}
              color={reel.isLiked ? '#ff1744' : '#fff'}
            />
          </Animated.View>
          <Text style={styles.actionLabel}>{(reel.likeCount || 0).toLocaleString()}</Text>
        </Pressable>

        <Pressable style={styles.action} onPress={onCommentPress}>
          <Ionicons name="chatbubble-outline" size={28} color="#fff" />
          <Text style={styles.actionLabel}>{(reel.commentCount || 0).toLocaleString()}</Text>
        </Pressable>

        <Pressable style={styles.action} onPress={onSharePress}>
          <Ionicons name="paper-plane-outline" size={28} color="#fff" />
          <Text style={styles.actionLabel}>{(reel.shareCount || 0).toLocaleString()}</Text>
        </Pressable>

        <Pressable style={styles.action} onPress={onBookmark}>
          <Ionicons
            name={reel.isBookmarked ? 'bookmark' : 'bookmark-outline'}
            size={28}
            color={reel.isBookmarked ? '#ffd60a' : '#fff'}
          />
        </Pressable>

        <Pressable style={styles.action} onPress={onMorePress}>
          <Ionicons name="ellipsis-horizontal" size={24} color="#fff" />
        </Pressable>
      </View>

      {/* Dark overlay gradients */}
      <View style={[styles.gradientOverlay, { zIndex: 5 }]} />

      {/* Progress timeline bar */}
      <View style={[styles.progressBar, { zIndex: 10 }]}>
        <View style={[styles.progressFill, { width: `${progress}%` }]} />
      </View>
    </RNAnimated.View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  rootDark: {
    backgroundColor: '#000',
  },
  rootLight: {
    backgroundColor: '#fff',
  },
  flex1: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  boldText: {
    fontWeight: '700',
  },
  screenContainer: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 44 : 0,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  toastContainer: {
    position: 'absolute',
    top: 60,
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.85)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    zIndex: 9999,
  },
  toastText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  scrollContentPadding: {
    paddingBottom: 120, // Bottom padding to prevent clipping under the custom tab bar
  },

  // Tab Bar
  tabBar: {
    flexDirection: 'row',
    paddingVertical: 12,
    marginHorizontal: 16,
    marginBottom: 24,
    borderRadius: 30,
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    height: 60,
    alignItems: 'center',
    justifyContent: 'space-around',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    height: '100%',
  },
  tabAvatarContainer: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1.5,
    borderColor: 'transparent',
    overflow: 'hidden',
  },
  tabAvatar: {
    width: '100%',
    height: '100%',
  },

  // Feed Views Header Centered
  feedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
  },
  borderDark: {
    borderBottomColor: '#262626',
  },
  borderLight: {
    borderBottomColor: '#EFEFEF',
  },
  headerIconLeft: {
    width: 40,
    alignItems: 'flex-start',
  },
  headerIconRight: {
    width: 40,
    alignItems: 'flex-end',
  },
  feedLogo: {
    fontSize: 22,
    fontWeight: '800',
    fontStyle: 'italic',
    letterSpacing: 0.5,
    textAlign: 'center',
    flex: 1,
  },
  headerIcon: {
    marginLeft: 18,
  },
  storiesContainer: {
    paddingVertical: 12,
    paddingLeft: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#efefef',
  },
  storyItem: {
    alignItems: 'center',
    marginRight: 16,
    width: 72,
  },
  storyRing: {
    width: 62,
    height: 62,
    borderRadius: 31,
    borderWidth: 2,
    borderColor: '#ff1744',
    padding: 2,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  storyRingGozy: {
    width: 62,
    height: 62,
    borderRadius: 31,
    borderWidth: 2.5,
    borderColor: '#0084FF',
    padding: 2,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  storyAvatar: {
    width: '100%',
    height: '100%',
    borderRadius: 30,
  },
  storyPlusBtn: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: '#0084FF',
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#fff',
  },
  storyName: {
    fontSize: 10,
    marginTop: 6,
    textAlign: 'center',
  },

  // AI Banner Carousel
  aiBannerContainer: {
    paddingHorizontal: 16,
    marginVertical: 12,
  },
  aiBanner: {
    flexDirection: 'row',
    backgroundColor: '#7E22CE',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  aiBannerTextCol: {
    flex: 1.4,
    paddingRight: 8,
  },
  aiBannerTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 4,
  },
  aiBannerSub: {
    color: '#E9D5FF',
    fontSize: 10.5,
    lineHeight: 14,
    marginBottom: 10,
  },
  aiBannerBtn: {
    backgroundColor: '#fff',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  aiBannerBtnText: {
    color: '#7E22CE',
    fontSize: 10.5,
    fontWeight: '700',
  },
  aiBannerImageCol: {
    flex: 0.9,
    alignItems: 'flex-end',
  },
  aiBannerCard: {
    width: 80,
    height: 100,
    borderRadius: 8,
  },

  // Feed Posts
  postCard: {
    marginBottom: 16,
    borderBottomWidth: 0.5,
    paddingBottom: 16,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  postCreatorAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 10,
  },
  postCreatorName: {
    fontSize: 12.5,
    fontWeight: '700',
  },
  verifiedBadge: {
    marginLeft: 4,
  },
  postLocation: {
    fontSize: 10,
    color: '#8E8E93',
  },
  postFollowBtn: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 4,
    backgroundColor: '#0084FF',
  },
  postFollowBtnActive: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: '#ccc',
  },
  postFollowBtnText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
  postImage: {
    width: screenWidth,
    height: screenWidth * 1.25,
  },
  postActionBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  postActionIcon: {
    marginRight: 16,
  },
  postInfoSection: {
    paddingHorizontal: 12,
  },
  postLikesCount: {
    fontSize: 12.5,
    fontWeight: '700',
    marginBottom: 4,
  },
  postCaption: {
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 4,
  },
  postViewComments: {
    fontSize: 11.5,
    color: '#8E8E93',
    marginTop: 2,
  },

  // Suggested Creators Carousel
  suggestedContainer: {
    padding: 16,
    marginVertical: 12,
  },
  suggestedTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  suggestedSeeAll: {
    fontSize: 12,
    color: '#0084FF',
    fontWeight: '600',
  },
  suggestedCard: {
    width: 130,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 10,
    borderWidth: 0.5,
    borderColor: '#efefef',
  },
  suggestedAvatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    marginBottom: 8,
  },
  suggestedName: {
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center',
  },
  suggestedSubtext: {
    fontSize: 9.5,
    color: '#888',
    textAlign: 'center',
    marginBottom: 10,
  },
  suggestedFollowBtn: {
    backgroundColor: '#0084FF',
    width: '100%',
    paddingVertical: 6,
    borderRadius: 4,
    alignItems: 'center',
  },
  suggestedFollowText: {
    color: '#fff',
    fontSize: 10.5,
    fontWeight: '700',
  },

  // Reels Discovery Screen Styles (for Search tab)
  discoverHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  eyebrow: {
    fontSize: 10,
    fontWeight: '700',
    color: '#888',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  discoverTitle: {
    fontSize: 28,
    fontWeight: '800',
    marginTop: 2,
  },
  assistantBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 132, 255, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  discoverSubtitle: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginVertical: 12,
  },
  searchCard: {
    borderRadius: radius.lg,
    borderWidth: 1,
    padding: spacing.md,
    gap: spacing.sm,
    marginBottom: 16,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: typography.body,
    paddingVertical: 4,
  },
  searchHint: {
    color: '#8E8E93',
    fontSize: 11.5,
    lineHeight: 18,
  },
  filterRowContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  filterChip: {
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: '#0084FF',
    borderColor: '#0084FF',
  },
  filterChipText: {
    fontSize: 12.5,
    fontWeight: '700',
  },
  modulePillsContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  modulePill: {
    borderRadius: radius.pill,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
  },
  modulePillText: {
    fontSize: 11.5,
    fontWeight: '700',
  },
  exploreGridList: {
    marginTop: 8,
  },

  // Reels View
  reelsContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  reelContainer: {
    width: screenWidth,
    height: screenHeight - 68, // Account for custom tabbar height
    backgroundColor: '#000',
    position: 'relative',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  progressBar: {
    position: 'absolute',
    top: 48,
    left: 0,
    right: 0,
    height: 1.5,
    backgroundColor: 'rgba(255,255,255,0.2)',
    zIndex: 10,
  },
  progressFill: {
    height: 1.5,
    backgroundColor: '#fff',
  },
  muteBtn: {
    position: 'absolute',
    top: 60,
    right: 16,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 20,
  },
  creatorSection: {
    position: 'absolute',
    bottom: 24,
    left: 12,
    right: 80,
    zIndex: 20,
  },
  creatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  creatorAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#fff',
  },
  creatorInfo: {
    flex: 1,
  },
  creatorNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  creatorName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#fff',
  },
  creatorUsername: {
    fontSize: 11,
    color: '#ddd',
  },
  followBtn: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#fff',
  },
  followBtnActive: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderColor: 'transparent',
  },
  followBtnText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
  followBtnTextActive: {
    color: '#ddd',
  },
  caption: {
    fontSize: 12,
    color: '#fff',
    lineHeight: 16,
    marginBottom: 8,
  },
  readMore: {
    color: '#ccc',
    fontWeight: '600',
    fontSize: 11,
  },
  audioPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  audioText: {
    color: '#fff',
    fontSize: 10,
  },
  actionsColumn: {
    position: 'absolute',
    right: 12,
    bottom: 30,
    alignItems: 'center',
    gap: 16,
    zIndex: 20,
  },
  action: {
    alignItems: 'center',
  },
  actionLabel: {
    fontSize: 10,
    color: '#fff',
    marginTop: 4,
    fontWeight: '600',
  },

  // DM Section
  dmHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  dmHeaderTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  notesSection: {
    paddingTop: 8,
    paddingBottom: 10,
    paddingLeft: 0,
    overflow: 'visible',
  },
  notesScrollView: {
    flexDirection: 'row',
    overflow: 'visible',
  },
  noteItem: {
    alignItems: 'center',
    marginRight: 20,
    width: 72,
    overflow: 'visible',
  },
  noteAvatarWrapper: {
    position: 'relative',
    width: 58,
    height: 58,
    marginBottom: 6,
    overflow: 'visible',
  },
  noteAvatar: {
    width: 58,
    height: 58,
    borderRadius: 29,
  },
  myNoteBubble: {
    position: 'absolute',
    top: -16,
    left: -6,
    backgroundColor: 'rgba(20,20,20,0.88)',
    paddingVertical: 3,
    paddingHorizontal: 7,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    zIndex: 99,
    elevation: 6,
  },
  myNoteBubbleText: {
    color: '#fff',
    fontSize: 8.5,
    fontWeight: '700',
  },
  noteBubble: {
    position: 'absolute',
    top: -16,
    left: -6,
    backgroundColor: '#0084FF',
    paddingVertical: 3,
    paddingHorizontal: 7,
    borderRadius: 10,
    maxWidth: 68,
    zIndex: 99,
    elevation: 6,
  },
  noteBubbleText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '700',
  },
  plusOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#0084FF',
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#fff',
  },
  noteName: {
    fontSize: 10,
    textAlign: 'center',
  },
  chatListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  chatListAvatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    marginRight: 12,
  },
  chatListName: {
    fontSize: 13.5,
  },
  chatListSub: {
    fontSize: 11.5,
    marginTop: 2,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#0084FF',
    marginLeft: 8,
  },

  // Chat Room
  chatHeaderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginLeft: 12,
  },
  chatHeaderAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  chatHeaderName: {
    fontSize: 13,
    fontWeight: '700',
  },
  chatHeaderStatus: {
    fontSize: 10.5,
    color: '#00A699',
  },
  msgBubbleWrapper: {
    marginVertical: 4,
    maxWidth: '75%',
  },
  msgBubbleMeWrapper: {
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
  },
  msgBubbleOtherWrapper: {
    alignSelf: 'flex-start',
    alignItems: 'flex-start',
  },
  msgBubble: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  msgBubbleMe: {
    backgroundColor: '#0084FF',
  },
  msgBubbleOtherDark: {
    backgroundColor: '#262626',
  },
  msgBubbleOtherLight: {
    backgroundColor: '#efefef',
  },
  msgText: {
    fontSize: 13,
    lineHeight: 18,
  },
  msgTime: {
    fontSize: 9,
    color: '#888',
    marginTop: 2,
    marginHorizontal: 4,
  },
  chatInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 0.5,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  chatInputIcon: {
    marginRight: 10,
  },
  chatInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    paddingHorizontal: 12,
    height: 38,
  },
  chatInputText: {
    flex: 1,
    fontSize: 13,
  },
  chatSendBtn: {
    fontSize: 13,
    color: '#0084FF',
    fontWeight: '700',
    marginLeft: 6,
  },

  // QR Code
  qrContentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  qrEmojiBar: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 24,
  },
  qrEmojiItem: {
    padding: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  qrEmojiActive: {
    borderColor: '#0084FF',
  },
  qrCardContainer: {
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    width: '100%',
    maxWidth: 300,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  qrMockCode: {
    padding: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 16,
  },
  qrNameText: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 4,
  },
  qrSubtitle: {
    color: '#888',
    fontSize: 11.5,
  },
  qrScanInstruct: {
    color: '#888',
    fontSize: 11,
    marginTop: 24,
  },

  // Audio Details
  audioMainInfo: {
    alignItems: 'center',
    padding: 24,
  },
  audioAlbumCover: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  audioTitleText: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 4,
  },
  audioArtistText: {
    fontSize: 13,
    color: '#888',
    marginBottom: 8,
  },
  audioStatText: {
    fontSize: 11.5,
    color: '#0084FF',
    fontWeight: '600',
  },
  gridSectionHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  gridSectionTitle: {
    fontSize: 13.5,
    fontWeight: '800',
  },
  audioUseBtn: {
    margin: 16,
    backgroundColor: '#0084FF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  audioUseText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '800',
  },

  // Profile
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  profileUsername: {
    fontSize: 18,
    fontWeight: '800',
  },
  profileBioSection: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  profileAvatarContainer: {
    position: 'relative',
  },
  profileMainAvatar: {
    width: 76,
    height: 76,
    borderRadius: 38,
  },
  profileNoteBubble: {
    position: 'absolute',
    top: -20,
    left: -12,
    backgroundColor: '#0084FF',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 12,
    zIndex: 999,
    elevation: 10,
    shadowColor: '#0084FF',
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  profileNoteText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '800',
  },
  profileStatsRow: {
    flexDirection: 'row',
    gap: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 16,
    fontWeight: '800',
  },
  statLabel: {
    fontSize: 10.5,
    color: '#888',
    marginTop: 2,
  },
  profileName: {
    fontSize: 13.5,
    fontWeight: '800',
    marginBottom: 4,
  },
  profileBio: {
    fontSize: 12.5,
    lineHeight: 16,
    marginBottom: 4,
  },
  profileWebsite: {
    fontSize: 12,
    color: '#0084FF',
    fontWeight: '700',
    marginBottom: 16,
  },
  profileButtonsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  profileBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  profileBtnSquare: {
    width: 36,
    height: 36,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
  gridTabs: {
    flexDirection: 'row',
    borderTopWidth: 0.5,
    borderTopColor: '#efefef',
    height: 44,
  },
  gridTab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gridTabActive: {
    borderBottomWidth: 1.5,
    borderBottomColor: '#0084FF',
  },
  emptyGridContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyGridTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginTop: 12,
    marginBottom: 6,
  },
  emptyGridSub: {
    fontSize: 11.5,
    color: '#888',
    textAlign: 'center',
    lineHeight: 16,
  },

  // Edit Profile fields
  editAvatarSection: {
    alignItems: 'center',
    marginVertical: 20,
  },
  editAvatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  changeAvatarText: {
    color: '#0084FF',
    fontSize: 13,
    fontWeight: '700',
  },
  editFormField: {
    marginBottom: 16,
  },
  editFieldLabel: {
    fontSize: 12,
    color: '#888',
    marginBottom: 6,
  },
  editFieldInput: {
    fontSize: 13.5,
    borderBottomWidth: 0.5,
    paddingVertical: 6,
  },

  // Discover / Recommended rows
  discoverRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  discoverAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
  },
  discoverName: {
    fontSize: 13,
    fontWeight: '700',
  },
  discoverSub: {
    fontSize: 11,
    color: '#888',
    marginTop: 2,
  },
  discoverFollowBtn: {
    backgroundColor: '#0084FF',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 6,
  },
  discoverFollowBtnText: {
    color: '#fff',
    fontSize: 11.5,
    fontWeight: '700',
  },

  // Settings stack styling
  settingsSearchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(128,128,128,0.1)',
    margin: 16,
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 38,
  },
  settingsSearchInput: {
    flex: 1,
    fontSize: 13,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 0.5,
  },
  settingsItemFeatured: {
    backgroundColor: 'rgba(0, 132, 255, 0.05)',
  },
  settingsItemText: {
    fontSize: 13.5,
  },
  settingsGroupHeader: {
    fontSize: 11.5,
    color: '#888',
    fontWeight: '700',
    textTransform: 'uppercase',
    marginTop: 24,
    marginBottom: 10,
    paddingHorizontal: 16,
  },
  accCenterBanner: {
    backgroundColor: 'rgba(0,132,255,0.05)',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  accCenterBannerTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0084FF',
    marginBottom: 4,
  },
  accCenterBannerDesc: {
    fontSize: 11,
    color: '#666',
    lineHeight: 15,
  },
  accCenterItem: {
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(128,128,128,0.15)',
  },
  accCenterItemText: {
    fontSize: 13,
  },
  settingsSwitchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(128,128,128,0.15)',
  },
  switchRowLabel: {
    fontSize: 13,
    fontWeight: '700',
  },
  switchRowSub: {
    fontSize: 10.5,
    color: '#888',
    marginTop: 2,
    paddingRight: 12,
  },
  unblockBtn: {
    borderWidth: 1,
    borderColor: '#ff1744',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  unblockBtnText: {
    color: '#ff1744',
    fontSize: 11,
    fontWeight: '700',
  },

  // Screentime
  screentimeDisplay: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  screentimeTitle: {
    fontSize: 12.5,
    color: '#888',
    fontWeight: '600',
  },
  screentimeHours: {
    fontSize: 36,
    fontWeight: '800',
    marginVertical: 8,
  },
  screentimeDesc: {
    fontSize: 11.5,
    color: '#888',
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 160,
    paddingVertical: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(128,128,128,0.15)',
  },
  chartBarCol: {
    alignItems: 'center',
  },
  chartBar: {
    width: 24,
    backgroundColor: '#0084FF',
    borderRadius: 4,
  },
  chartBarLabel: {
    color: '#888',
    fontSize: 10,
    marginTop: 8,
  },

  // Saved Collections folder
  savedGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  savedFolder: {
    width: (screenWidth - 48) / 2,
  },
  savedFolderThumb: {
    aspectRatio: 1,
    backgroundColor: 'rgba(128,128,128,0.1)',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  savedFolderTitle: {
    fontSize: 12,
    fontWeight: '700',
    paddingLeft: 4,
  },

  // Story Overlay modal
  storyOverlayRoot: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000',
    zIndex: 99999,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
  },
  storyProgressContainer: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    gap: 4,
    marginBottom: 12,
  },
  storyProgressBarBackground: {
    flex: 1,
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 1,
    overflow: 'hidden',
  },
  storyProgressBarFill: {
    height: '100%',
    backgroundColor: '#fff',
    width: '0%',
  },
  storyOverlayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 20,
    zIndex: 10,
  },
  storyHeaderAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#fff',
  },
  storyHeaderName: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
    flex: 1,
  },
  storyCloseBtn: {
    padding: 4,
  },
  storyOverlayImage: {
    flex: 1,
    width: '100%',
  },
  storyLeftTap: {
    position: 'absolute',
    left: 0,
    top: 100,
    bottom: 100,
    width: screenWidth * 0.3,
    zIndex: 2,
  },
  storyRightTap: {
    position: 'absolute',
    right: 0,
    top: 100,
    bottom: 100,
    width: screenWidth * 0.3,
    zIndex: 2,
  },

  // Subpages shared
  subPageRoot: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1000,
    paddingTop: Platform.OS === 'ios' ? 48 : 0,
  },
  subPageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
  },
  subPageCancel: {
    fontSize: 13,
  },
  subPageTitle: {
    fontSize: 14.5,
    fontWeight: '800',
  },
  subPageDone: {
    fontSize: 13,
    color: '#0084FF',
    fontWeight: '800',
  },

  // Bottom Sheet Overlays
  bottomSheetBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 9999,
    justifyContent: 'flex-end',
  },
  bottomSheetContent: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '65%',
    paddingBottom: Platform.OS === 'ios' ? 30 : 16,
  },
  bottomSheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(128,128,128,0.15)',
  },
  bottomSheetTitle: {
    fontSize: 14,
    fontWeight: '800',
  },
  reactionEmojisRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  emojiReactionBtn: {
    padding: 6,
  },
  commentRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  commentAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: 10,
  },
  commentUsername: {
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 2,
  },
  commentText: {
    fontSize: 12,
    lineHeight: 16,
  },
  commentLikeBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 8,
  },
  commentInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderTopWidth: 0.5,
  },
  commentInputAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: 8,
  },
  commentTextInput: {
    flex: 1,
    borderRadius: 16,
    paddingHorizontal: 12,
    fontSize: 12,
    height: 32,
    marginRight: 8,
  },
  commentPostBtn: {
    fontSize: 12,
    color: '#0084FF',
    fontWeight: '700',
  },

  // Share overlay sheets
  shareSearchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(128,128,128,0.1)',
    marginHorizontal: 16,
    marginVertical: 10,
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 36,
  },
  shareSearchInput: {
    flex: 1,
    fontSize: 12.5,
  },
  shareContactItem: {
    alignItems: 'center',
    width: 72,
    marginRight: 8,
  },
  shareContactAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginBottom: 6,
  },
  shareContactName: {
    fontSize: 9.5,
    textAlign: 'center',
  },
  sectionHeaderLine: {
    height: 0.5,
    backgroundColor: 'rgba(128,128,128,0.15)',
    marginVertical: 10,
  },
  shareShortcutsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
  },
  shortcutBtn: {
    alignItems: 'center',
  },
  shortcutIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(128,128,128,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  shortcutText: {
    fontSize: 10,
  },

  // Swipe Modals Styles
  bookingOverlayBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 10000,
    justifyContent: 'flex-end',
  },
  bookingOverlayContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '85%',
    padding: 16,
  },
  bookingOverlayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(128,128,128,0.2)',
  },
  bookingHeaderIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#0084FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  bookingHeaderTitle: {
    fontSize: 20,
    fontWeight: '800',
  },
  bookingCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(128,128,128,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookingItemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginVertical: 16,
  },
  bookingItemImg: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 12,
  },
  bookingItemTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
  },
  bookingItemLoc: {
    fontSize: 12,
    color: '#888',
  },
  bookingItemPrice: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0084FF',
    marginLeft: 8,
  },
  bookingSectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  bookingSectionLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#888',
    letterSpacing: 0.5,
  },
  bookingChangeText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0084FF',
  },
  bookingNearestCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    marginBottom: 16,
  },
  bookingNearestImg: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 12,
  },
  bookingNearestName: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },
  bookingNearestSub: {
    fontSize: 11,
  },
  bookingChipsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  bookingChipCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    gap: 10,
  },
  bookingChipVal: {
    fontSize: 14,
    fontWeight: '800',
  },
  bookingChipLabel: {
    fontSize: 9,
    color: '#888',
    fontWeight: '600',
    marginTop: 2,
  },
  bookingPriceBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  bookingPriceLabelText: {
    fontSize: 15,
    fontWeight: '700',
  },
  bookingPriceValText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0084FF',
  },
  bookingSimilarScroll: {
    marginVertical: 12,
  },
  bookingSimilarCard: {
    width: 140,
    borderRadius: 12,
    borderWidth: 1,
    marginRight: 12,
    overflow: 'hidden',
    paddingBottom: 8,
  },
  bookingSimilarImg: {
    width: '100%',
    height: 80,
  },
  bookingSimilarName: {
    fontSize: 12,
    fontWeight: '700',
    marginTop: 4,
  },
  bookingSimilarMeta: {
    fontSize: 10,
    color: '#888',
    marginVertical: 2,
  },
  bookingSimilarPrice: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0084FF',
  },
  bookingConfirmBtn: {
    backgroundColor: '#0084FF',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  bookingConfirmBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '800',
  },

  // Details View Styles
  detailsRoot: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 10001,
  },
  detailsCoverContainer: {
    height: '38%',
    width: '100%',
    position: 'relative',
  },
  detailsCoverImg: {
    width: '100%',
    height: '100%',
  },
  detailsCloseBtn: {
    position: 'absolute',
    top: 40,
    right: 16,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailsCoverTextOverlay: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
  },
  detailsCoverTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
    marginBottom: 4,
  },
  detailsCoverSub: {
    fontSize: 13,
    color: '#e2e8f0',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
    marginBottom: 8,
  },
  detailsCoverPriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailsCoverPrice: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FBBF24',
  },
  detailsCoverLoc: {
    fontSize: 12,
    color: '#cbd5e1',
  },
  detailsBadgesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    marginVertical: 12,
  },
  detailsBadgeCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(128,128,128,0.1)',
  },
  detailsBadgeVal: {
    fontSize: 12,
    fontWeight: '800',
    marginVertical: 4,
  },
  detailsBadgeLabel: {
    fontSize: 8,
    color: '#888',
    fontWeight: '700',
  },
  detailsDesc: {
    fontSize: 13,
    lineHeight: 19,
    marginVertical: 12,
  },
  detailsChipsScroll: {
    marginVertical: 8,
  },
  detailsChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    marginRight: 8,
  },
  detailsChipText: {
    fontSize: 11,
    fontWeight: '600',
  },
  detailsHighlightsContainer: {
    marginVertical: 16,
  },
  detailsHighlightsTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  detailsBulletRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  detailsBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
    marginRight: 10,
  },
  detailsBulletText: {
    fontSize: 13,
  },
  detailsAvailableBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    marginTop: 20,
  },
  detailsLocIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,132,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  detailsAvailableLabel: {
    fontSize: 9,
    color: '#888',
    fontWeight: '700',
  },
  detailsAvailableVal: {
    fontSize: 13,
    fontWeight: '800',
  },
  detailsBookBtn: {
    backgroundColor: '#0084FF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  detailsBookBtnText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '800',
  },

  // Swipe overlays styles
  swipePill: {
    position: 'absolute',
    top: 100,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 3,
  },
  likePill: {
    right: 40,
    borderColor: '#3dd598',
    backgroundColor: 'rgba(61, 213, 152, 0.15)',
  },
  skipPill: {
    left: 40,
    borderColor: '#ff8268',
    backgroundColor: 'rgba(255, 130, 104, 0.15)',
  },
  swipePillText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },

  // Inbox thought bubble tail dots
  thoughtDot1: {
    position: 'absolute',
    top: -5,
    left: 10,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#0084FF',
    zIndex: 98,
  },
  thoughtDot2: {
    position: 'absolute',
    top: 1,
    left: 14,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#0084FF',
    zIndex: 98,
  },

  // Profile thought bubble tail dots
  profileThoughtDot1: {
    position: 'absolute',
    top: -6,
    left: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#0084FF',
    zIndex: 998,
  },
  profileThoughtDot2: {
    position: 'absolute',
    top: 2,
    left: 14,
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#0084FF',
    zIndex: 998,
  },
  profileAvatarContainer: {
    position: 'relative',
    width: 76,
    height: 76,
    overflow: 'visible',
  },

  // Discover Suggested People styles
  discoverPeopleSection: {
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 8,
    borderRadius: 8,
    borderWidth: 1,
    paddingVertical: 12,
  },
  discoverPeopleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  discoverPeopleTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  discoverPeopleSeeAll: {
    fontSize: 12,
    color: '#0084FF',
    fontWeight: '700',
  },
  discoverPeopleScroll: {
    paddingHorizontal: 12,
    gap: 10,
  },
  suggestedCard: {
    width: 120,
    borderRadius: 8,
    borderWidth: 1,
    padding: 10,
    alignItems: 'center',
    position: 'relative',
  },
  suggestedClose: {
    position: 'absolute',
    top: 6,
    right: 6,
    zIndex: 10,
  },
  suggestedAvatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    marginBottom: 6,
  },
  suggestedName: {
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center',
    width: '100%',
  },
  suggestedUser: {
    fontSize: 9,
    color: '#888',
    marginBottom: 10,
    textAlign: 'center',
  },

  // Highlights styles
  highlightsContainer: {
    marginVertical: 12,
    paddingLeft: 16,
  },
  highlightsScroll: {
    gap: 14,
  },
  highlightItem: {
    alignItems: 'center',
    width: 64,
  },
  highlightCircle: {
    width: 58,
    height: 58,
    borderRadius: 29,
    borderWidth: 1,
    padding: 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  highlightImg: {
    width: '100%',
    height: '100%',
    borderRadius: 27,
  },
  highlightText: {
    fontSize: 10,
    marginTop: 4,
    textAlign: 'center',
    width: '100%',
  },

  // Posts grid styles
  postsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 1.5,
    paddingHorizontal: 1,
  },
  gridPostItem: {
    width: (screenWidth - 5) / 3,
    height: (screenWidth - 5) / 3,
    position: 'relative',
  },
  gridPostImg: {
    width: '100%',
    height: '100%',
  },
  gridReelBadge: {
    position: 'absolute',
    bottom: 6,
    left: 6,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
  },
  gridReelViews: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '700',
    marginLeft: 3,
  },
});
