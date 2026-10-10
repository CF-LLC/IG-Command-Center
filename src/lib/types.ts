export type Role = "Admin" | "Editor" | "Approver";

export type PostStatus =
  | "draft"
  | "submitted"
  | "approved"
  | "rejected"
  | "scheduled"
  | "published"
  | "failed";

export type LibraryKind = "caption" | "hashtags" | "hook" | "cta" | "asset";

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: Role;
  avatar: string;
}

export interface Account {
  id: string;
  handle: string;
  displayName: string;
  followers: number;
  following: number;
  postsCount: number;
  engagementRate: number;
  reach30d: number;
  impressions30d: number;
  avatar: string;
  connected: boolean;
  /** Instagram Business/Creator user id */
  igUserId?: string;
  /** Long-lived Page access token (stored server-side only) */
  accessToken?: string;
  profilePictureUrl?: string;
  lastSyncedAt?: string;
}

export interface Post {
  id: string;
  accountIds: string[];
  caption: string;
  mediaUrl: string;
  mediaType: "image" | "carousel" | "reel";
  status: PostStatus;
  scheduledAt?: string;
  publishedAt?: string;
  igMediaId?: string;
  createdBy: string;
  submittedBy?: string;
  reviewedBy?: string;
  reviewNote?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: string;
  accountId: string;
  postId: string;
  author: string;
  text: string;
  createdAt: string;
  replied: boolean;
  replyText?: string;
  /** Real Instagram comment id when synced */
  igCommentId?: string;
}

export interface LibraryItem {
  id: string;
  kind: LibraryKind;
  title: string;
  body: string;
  tags: string[];
  campaign?: string;
}

export interface Notification {
  id: string;
  type: "approval" | "publish" | "failure" | "comment" | "team";
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
  href?: string;
}

export interface AnalyticsPoint {
  date: string;
  followers: number;
  reach: number;
  engagement: number;
  impressions: number;
}

export interface DB {
  users: User[];
  accounts: Account[];
  posts: Post[];
  comments: Comment[];
  library: LibraryItem[];
  notifications: Notification[];
  analytics: Record<string, AnalyticsPoint[]>;
  sessionUserId: string | null;
}
