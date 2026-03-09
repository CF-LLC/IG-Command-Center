// Instagram Account
export interface IGAccount {
  id: string
  name: string
  username: string
  avatar: string
  followers: number
  following: number
  posts: number
  bio: string
  category: string
  isVerified: boolean
  connectedAt: string
  accessToken?: string
}

// Post / Content
export type PostStatus = 'draft' | 'scheduled' | 'published' | 'failed' | 'pending_approval'
export type PostType = 'feed' | 'reel' | 'story' | 'carousel'
export type MediaType = 'image' | 'video' | 'carousel'

export interface MediaItem {
  id: string
  url: string
  type: MediaType
  thumbnail?: string
  width?: number
  height?: number
  duration?: number
}

export interface Post {
  id: string
  accountId: string
  account?: IGAccount
  caption: string
  hashtags: string[]
  media: MediaItem[]
  postType: PostType
  status: PostStatus
  scheduledAt?: string
  publishedAt?: string
  createdAt: string
  updatedAt: string
  createdBy: string
  approvedBy?: string
  engagementRate?: number
  likes?: number
  comments?: number
  saves?: number
  reach?: number
  impressions?: number
  aiGenerated?: boolean
  notes?: string
}

// Analytics
export interface DailyMetric {
  date: string
  followers: number
  followersGain: number
  reach: number
  impressions: number
  profileViews: number
  websiteClicks: number
  likes: number
  comments: number
  saves: number
  shares: number
}

export interface AccountAnalytics {
  accountId: string
  period: '7d' | '30d' | '90d'
  totalFollowers: number
  followerGrowth: number
  followerGrowthPct: number
  avgEngagementRate: number
  totalReach: number
  totalImpressions: number
  totalLikes: number
  totalComments: number
  totalSaves: number
  bestPostingTime: string
  topHashtags: { tag: string; uses: number; avgEngagement: number }[]
  dailyMetrics: DailyMetric[]
  postPerformance: PostPerformance[]
}

export interface PostPerformance {
  postId: string
  thumbnail: string
  caption: string
  publishedAt: string
  likes: number
  comments: number
  saves: number
  reach: number
  impressions: number
  engagementRate: number
}

// Comments
export type CommentSentiment = 'positive' | 'neutral' | 'negative'
export type CommentStatus = 'new' | 'replied' | 'archived' | 'flagged'

export interface Comment {
  id: string
  postId: string
  accountId: string
  author: string
  authorAvatar: string
  text: string
  sentiment: CommentSentiment
  status: CommentStatus
  likes: number
  createdAt: string
  replies?: CommentReply[]
  isHighPriority?: boolean
}

export interface CommentReply {
  id: string
  text: string
  createdAt: string
  createdBy: string
  isAiGenerated?: boolean
}

// Media Library
export interface LibraryAsset {
  id: string
  name: string
  url: string
  thumbnail?: string
  type: MediaType
  size: number
  width?: number
  height?: number
  duration?: number
  tags: string[]
  uploadedAt: string
  uploadedBy: string
  usedInPosts: number
}

// Team
export type TeamRole = 'owner' | 'admin' | 'editor' | 'viewer'
export type InviteStatus = 'active' | 'pending' | 'inactive'

export interface TeamMember {
  id: string
  name: string
  email: string
  avatar: string
  role: TeamRole
  status: InviteStatus
  joinedAt: string
  lastActiveAt: string
  assignedAccounts: string[]
}

// Notifications
export type NotificationType = 
  | 'post_published'
  | 'post_failed'
  | 'comment_received'
  | 'approval_needed'
  | 'approval_approved'
  | 'approval_rejected'
  | 'follower_milestone'
  | 'mention'

export interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
  read: boolean
  createdAt: string
  relatedId?: string
  accountId?: string
}

// Approval
export type ApprovalStatus = 'pending' | 'approved' | 'rejected' | 'changes_requested'

export interface ApprovalRequest {
  id: string
  postId: string
  post?: Post
  requestedBy: string
  requestedAt: string
  reviewedBy?: string
  reviewedAt?: string
  status: ApprovalStatus
  notes?: string
}

// AI Content
export interface AIContentRequest {
  prompt: string
  accountId: string
  tone?: 'professional' | 'casual' | 'humorous' | 'inspirational' | 'educational'
  includeHashtags?: boolean
  includeEmojis?: boolean
  postType?: PostType
}

export interface AIContentResponse {
  caption: string
  hashtags: string[]
  alternativeVersions?: string[]
}

// Dashboard Stats
export interface DashboardStats {
  totalFollowers: number
  followerGrowth: number
  followerGrowthPct: number
  avgEngagementRate: number
  postsThisWeek: number
  scheduledPosts: number
  pendingApprovals: number
  newComments: number
  totalReach: number
  reachGrowthPct: number
}

// Calendar Event
export interface CalendarEvent {
  id: string
  postId: string
  accountId: string
  account?: IGAccount
  title: string
  date: string
  time: string
  status: PostStatus
  thumbnail?: string
  postType: PostType
}

// Settings
export interface AppSettings {
  defaultPostingTimes: string[]
  autoHashtags: boolean
  autoReply: boolean
  approvalRequired: boolean
  emailNotifications: boolean
  pushNotifications: boolean
  timezone: string
  language: string
}
