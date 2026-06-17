import { create } from 'zustand';
import type { Reel, ReelsFeedTab } from '@/src/types/reels';

interface ReelsStore {
  // Data
  forYouReels: Reel[];
  followingReels: Reel[];
  currentTab: ReelsFeedTab;
  currentReelIndex: number;
  playingReelId: string | null;
  currentUserId: string;

  // Actions
  setForYouReels: (reels: Reel[]) => void;
  setFollowingReels: (reels: Reel[]) => void;
  setCurrentTab: (tab: ReelsFeedTab) => void;
  setCurrentReelIndex: (index: number) => void;
  setPlayingReelId: (reelId: string | null) => void;
  toggleLike: (reelId: string) => void;
  toggleBookmark: (reelId: string) => void;
  toggleFollow: (creatorId: string) => void;
  getCurrentReel: () => Reel | null;
  loadMoreReels: (tab: ReelsFeedTab) => void;
}

export const useReelsStore = create<ReelsStore>((set, get) => ({
    forYouReels: [],
    followingReels: [],
    currentTab: 'ForYou',
    currentReelIndex: 0,
    playingReelId: null,
    currentUserId: 'user-1', // Replace with actual user

    setForYouReels: (reels) => set({ forYouReels: reels }),

    setFollowingReels: (reels) => set({ followingReels: reels }),

    setCurrentTab: (tab) =>
      set({
        currentTab: tab,
        currentReelIndex: 0,
        playingReelId: null,
      }),

    setCurrentReelIndex: (index) => set({ currentReelIndex: index }),

    setPlayingReelId: (reelId) => set({ playingReelId: reelId }),

    toggleLike: (reelId) =>
      set((state) => ({
        forYouReels: state.forYouReels.map((reel) =>
          reel.id === reelId
            ? {
                ...reel,
                isLiked: !reel.isLiked,
                likeCount: reel.isLiked ? reel.likeCount - 1 : reel.likeCount + 1,
              }
            : reel,
        ),
        followingReels: state.followingReels.map((reel) =>
          reel.id === reelId
            ? {
                ...reel,
                isLiked: !reel.isLiked,
                likeCount: reel.isLiked ? reel.likeCount - 1 : reel.likeCount + 1,
              }
            : reel,
        ),
      })),

    toggleBookmark: (reelId) =>
      set((state) => ({
        forYouReels: state.forYouReels.map((reel) =>
          reel.id === reelId ? { ...reel, isBookmarked: !reel.isBookmarked } : reel,
        ),
        followingReels: state.followingReels.map((reel) =>
          reel.id === reelId ? { ...reel, isBookmarked: !reel.isBookmarked } : reel,
        ),
      })),

    toggleFollow: (creatorId) =>
      set((state) => ({
        forYouReels: state.forYouReels.map((reel) =>
          reel.creator.id === creatorId
            ? { ...reel, creator: { ...reel.creator, isFollowing: !reel.creator.isFollowing } }
            : reel,
        ),
        followingReels: state.followingReels.map((reel) =>
          reel.creator.id === creatorId
            ? { ...reel, creator: { ...reel.creator, isFollowing: !reel.creator.isFollowing } }
            : reel,
        ),
      })),

    getCurrentReel: () => {
      const { currentTab, currentReelIndex, forYouReels, followingReels } = get();
      const reels = currentTab === 'ForYou' ? forYouReels : followingReels;
      return reels[currentReelIndex] || null;
    },

    loadMoreReels: (tab) => {
      // Mock implementation - would fetch from backend
      // This is where you'd add pagination logic
    },
  }),
);
