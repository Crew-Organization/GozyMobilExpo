export interface Creator {
  id: string;
  name: string;
  username: string;
  avatar: string;
  verified: boolean;
  isFollowing: boolean;
  followerCount: number;
}

export interface Reel {
  id: string;
  creatorId: string;
  creator: Creator;
  videoUrl: string;
  thumbnail: string;
  caption: string;
  hashtags: string[];
  duration: number;
  likeCount: number;
  commentCount: number;
  shareCount: number;
  isLiked: boolean;
  isBookmarked: boolean;
  createdAt: Date;
  views: number;
}

export interface ReelEngagement {
  reelId: string;
  isLiked: boolean;
  isBookmarked: boolean;
  isShared: boolean;
  timestamp: Date;
}

export type ReelsFeedTab = 'ForYou' | 'Following';
