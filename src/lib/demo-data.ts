import { subDays, format, addHours, subHours } from 'date-fns'
import type {
  IGAccount,
  Post,
  Comment,
  TeamMember,
  LibraryAsset,
  DailyMetric,
  AccountAnalytics,
  DashboardStats,
  CalendarEvent,
  Notification,
  ApprovalRequest,
} from '@/types'

export const CHART_DATE_FORMAT = 'MMM d'

// ─── Accounts ────────────────────────────────────────────────────────────────

export const DEMO_ACCOUNTS: IGAccount[] = [
  {
    id: 'acc-1',
    name: 'StyleHaus Brand',
    username: 'stylehaus_brand',
    avatar: 'https://i.pravatar.cc/150?img=1',
    followers: 128_450,
    following: 342,
    posts: 892,
    bio: '✨ Premium fashion & lifestyle brand. New collections every season. 🛍️ Shop the link below.',
    category: 'Fashion & Apparel',
    isVerified: true,
    connectedAt: subDays(new Date(), 120).toISOString(),
  },
  {
    id: 'acc-2',
    name: 'TechPulse Media',
    username: 'techpulse_media',
    avatar: 'https://i.pravatar.cc/150?img=2',
    followers: 87_230,
    following: 512,
    posts: 1_204,
    bio: '📱 Your daily dose of tech news, reviews & trends. Follow for the latest in innovation.',
    category: 'Technology',
    isVerified: true,
    connectedAt: subDays(new Date(), 90).toISOString(),
  },
  {
    id: 'acc-3',
    name: 'GreenLeaf Kitchen',
    username: 'greenleaf_kitchen',
    avatar: 'https://i.pravatar.cc/150?img=3',
    followers: 54_780,
    following: 891,
    posts: 634,
    bio: '🌿 Plant-based recipes that taste amazing. Healthy living made delicious. New recipe daily!',
    category: 'Food & Beverage',
    isVerified: false,
    connectedAt: subDays(new Date(), 60).toISOString(),
  },
  {
    id: 'acc-4',
    name: 'FitLife Studio',
    username: 'fitlife_studio',
    avatar: 'https://i.pravatar.cc/150?img=4',
    followers: 201_650,
    following: 234,
    posts: 2_103,
    bio: '💪 Transform your body & mind. Workouts, nutrition, motivation. Join 200K+ fitness family!',
    category: 'Health & Fitness',
    isVerified: true,
    connectedAt: subDays(new Date(), 150).toISOString(),
  },
  {
    id: 'acc-5',
    name: 'Urban Lens Photography',
    username: 'urbanlens_photo',
    avatar: 'https://i.pravatar.cc/150?img=5',
    followers: 43_120,
    following: 1_203,
    posts: 445,
    bio: '📸 Capturing urban stories one frame at a time. Available for commissions. DMs open.',
    category: 'Arts & Photography',
    isVerified: false,
    connectedAt: subDays(new Date(), 45).toISOString(),
  },
]

// ─── Generate daily metrics ───────────────────────────────────────────────────

function generateDailyMetrics(
  accountId: string,
  baseFollowers: number,
  days: number
): DailyMetric[] {
  const metrics: DailyMetric[] = []
  let currentFollowers = baseFollowers - Math.floor(days * 45)

  for (let i = days; i >= 0; i--) {
    const date = format(subDays(new Date(), i), 'yyyy-MM-dd')
    const dailyGain = Math.floor(Math.random() * 120) + 10
    currentFollowers += dailyGain

    metrics.push({
      date,
      followers: currentFollowers,
      followersGain: dailyGain,
      reach: Math.floor(Math.random() * 8000) + 2000,
      impressions: Math.floor(Math.random() * 15000) + 5000,
      profileViews: Math.floor(Math.random() * 500) + 50,
      websiteClicks: Math.floor(Math.random() * 80) + 5,
      likes: Math.floor(Math.random() * 1200) + 200,
      comments: Math.floor(Math.random() * 80) + 10,
      saves: Math.floor(Math.random() * 300) + 30,
      shares: Math.floor(Math.random() * 150) + 10,
    })
  }
  return metrics
}

// ─── Posts ────────────────────────────────────────────────────────────────────

const postCaptions = [
  "New collection just dropped! 🔥 Which style is your favorite? Comment below! #fashion #newcollection #style",
  "Behind the scenes of our latest shoot ✨ The team worked so hard on this one. #behindthescenes #creative",
  "Top 5 tips you need to know this week 💡 Save this post for later! #tips #howto #tutorial",
  "Our bestseller is back in stock! 🛍️ Limited quantities available. Link in bio to shop now.",
  "Morning routine goals 🌅 Start your day with intention and purpose. What's your morning ritual?",
  "This product has completely changed my routine 🙌 Here's why I love it so much...",
  "We hit 100K followers!! 🎉 Thank you so much for your support. This community means everything.",
  "It's giving main character energy 💫 New drop alert - don't sleep on these pieces!",
  "Collab alert 🤝 We're so excited to partner with @partner for this exclusive collection.",
  "The results speak for themselves 📊 Real data, real growth, real impact for our clients.",
  "Weekend vibes only ☀️ Tag someone you'd spend the weekend with! #weekendvibes #chill",
  "Game changer alert 🚨 We've been working on something big and it's finally here...",
]

const hashtags = [
  ['#fashion', '#style', '#ootd', '#outfitoftheday', '#trendy'],
  ['#tech', '#innovation', '#startup', '#digital', '#future'],
  ['#healthy', '#vegan', '#plantbased', '#foodie', '#recipe'],
  ['#fitness', '#workout', '#gym', '#health', '#motivation'],
  ['#photography', '#urban', '#art', '#creative', '#visual'],
]

export const DEMO_POSTS: Post[] = Array.from({ length: 50 }, (_, i) => {
  const accountIndex = i % 5
  const account = DEMO_ACCOUNTS[accountIndex]
  const daysAgo = Math.floor(i * 1.8)
  const isPublished = i > 5
  const isScheduled = i <= 5
  const statusOptions: Post['status'][] = ['published', 'scheduled', 'draft', 'pending_approval']
  const status: Post['status'] = isPublished ? 'published' : isScheduled ? 'scheduled' : statusOptions[i % 4]

  return {
    id: `post-${i + 1}`,
    accountId: account.id,
    account,
    caption: postCaptions[i % postCaptions.length],
    hashtags: hashtags[accountIndex],
    media: [
      {
        id: `media-${i + 1}`,
        url: `https://picsum.photos/seed/${i + 10}/800/800`,
        type: 'image',
        thumbnail: `https://picsum.photos/seed/${i + 10}/400/400`,
        width: 800,
        height: 800,
      },
    ],
    postType: (['feed', 'reel', 'story', 'carousel'] as Post['postType'][])[i % 4],
    status,
    scheduledAt: isScheduled
      ? addHours(new Date(), (i + 1) * 4).toISOString()
      : undefined,
    publishedAt: isPublished ? subDays(new Date(), daysAgo).toISOString() : undefined,
    createdAt: subDays(new Date(), daysAgo + 1).toISOString(),
    updatedAt: subDays(new Date(), daysAgo).toISOString(),
    createdBy: 'user-1',
    approvedBy: isPublished ? 'user-2' : undefined,
    likes: isPublished ? Math.floor(Math.random() * 3000) + 100 : undefined,
    comments: isPublished ? Math.floor(Math.random() * 150) + 10 : undefined,
    saves: isPublished ? Math.floor(Math.random() * 500) + 20 : undefined,
    reach: isPublished ? Math.floor(Math.random() * 12000) + 1000 : undefined,
    impressions: isPublished ? Math.floor(Math.random() * 25000) + 3000 : undefined,
    engagementRate: isPublished ? parseFloat((Math.random() * 5 + 1.5).toFixed(2)) : undefined,
    aiGenerated: i % 3 === 0,
  }
})

// ─── Comments ─────────────────────────────────────────────────────────────────

const commentTexts = [
  { text: "This is absolutely gorgeous! I need this in my life 😍", sentiment: 'positive' as const },
  { text: "Love your content! Keep it up 🙌", sentiment: 'positive' as const },
  { text: "When will this be restocked?? I've been waiting forever", sentiment: 'neutral' as const },
  { text: "Okay but this is literally the best thing I've seen all week", sentiment: 'positive' as const },
  { text: "The quality looks amazing in person. Already ordered mine!", sentiment: 'positive' as const },
  { text: "I've tried similar products and they never work as advertised...", sentiment: 'negative' as const },
  { text: "Stunning photography! What camera do you use?", sentiment: 'positive' as const },
  { text: "Where can I get this? Link doesn't work for me 😤", sentiment: 'negative' as const },
  { text: "Tag someone who needs this! @bestfriend", sentiment: 'positive' as const },
  { text: "Is this available internationally? Shipping to UK?", sentiment: 'neutral' as const },
  { text: "Not impressed. Expected way better for the price.", sentiment: 'negative' as const },
  { text: "Following for more amazing content like this! ❤️", sentiment: 'positive' as const },
]

const authorNames = [
  'sarah_j', 'mike_m92', 'fashionlover_xo', 'tech_guru_2024', 'healthy_hannah',
  'fit_freak_frank', 'urban_explorer_uk', 'style_queen_99', 'gadget_geek_tom',
  'plant_mom_sam', 'workout_warrior', 'creative_lens_co'
]

export const DEMO_COMMENTS: Comment[] = Array.from({ length: 80 }, (_, i) => {
  const commentData = commentTexts[i % commentTexts.length]
  const postIndex = i % DEMO_POSTS.length
  const post = DEMO_POSTS[postIndex]

  return {
    id: `comment-${i + 1}`,
    postId: post.id,
    accountId: post.accountId,
    author: authorNames[i % authorNames.length],
    authorAvatar: `https://i.pravatar.cc/150?img=${(i % 50) + 10}`,
    text: commentData.text,
    sentiment: commentData.sentiment,
    status: (['new', 'replied', 'archived'] as Comment['status'][])[i % 3],
    likes: Math.floor(Math.random() * 50),
    createdAt: subHours(new Date(), i * 2 + 1).toISOString(),
    isHighPriority: commentData.sentiment === 'negative' && i % 4 === 0,
    replies: i % 4 === 0
      ? [
          {
            id: `reply-${i + 1}`,
            text: "Thanks for reaching out! Please DM us and we'll sort this out for you 💌",
            createdAt: subHours(new Date(), i * 2).toISOString(),
            createdBy: 'user-1',
            isAiGenerated: i % 2 === 0,
          },
        ]
      : [],
  }
})

// ─── Team Members ─────────────────────────────────────────────────────────────

export const DEMO_TEAM: TeamMember[] = [
  {
    id: 'user-1',
    name: 'Alex Morgan',
    email: 'alex@company.com',
    avatar: 'https://i.pravatar.cc/150?img=20',
    role: 'owner',
    status: 'active',
    joinedAt: subDays(new Date(), 365).toISOString(),
    lastActiveAt: new Date().toISOString(),
    assignedAccounts: DEMO_ACCOUNTS.map((a) => a.id),
  },
  {
    id: 'user-2',
    name: 'Jordan Lee',
    email: 'jordan@company.com',
    avatar: 'https://i.pravatar.cc/150?img=21',
    role: 'admin',
    status: 'active',
    joinedAt: subDays(new Date(), 240).toISOString(),
    lastActiveAt: subHours(new Date(), 2).toISOString(),
    assignedAccounts: ['acc-1', 'acc-2', 'acc-3'],
  },
  {
    id: 'user-3',
    name: 'Taylor Kim',
    email: 'taylor@company.com',
    avatar: 'https://i.pravatar.cc/150?img=22',
    role: 'editor',
    status: 'active',
    joinedAt: subDays(new Date(), 120).toISOString(),
    lastActiveAt: subHours(new Date(), 5).toISOString(),
    assignedAccounts: ['acc-1', 'acc-4'],
  },
  {
    id: 'user-4',
    name: 'Casey Rivera',
    email: 'casey@company.com',
    avatar: 'https://i.pravatar.cc/150?img=23',
    role: 'editor',
    status: 'active',
    joinedAt: subDays(new Date(), 90).toISOString(),
    lastActiveAt: subDays(new Date(), 1).toISOString(),
    assignedAccounts: ['acc-2', 'acc-5'],
  },
  {
    id: 'user-5',
    name: 'Sam Chen',
    email: 'sam@company.com',
    avatar: 'https://i.pravatar.cc/150?img=24',
    role: 'viewer',
    status: 'active',
    joinedAt: subDays(new Date(), 30).toISOString(),
    lastActiveAt: subDays(new Date(), 3).toISOString(),
    assignedAccounts: ['acc-3'],
  },
  {
    id: 'user-6',
    name: 'Morgan Blake',
    email: 'morgan@company.com',
    avatar: 'https://i.pravatar.cc/150?img=25',
    role: 'editor',
    status: 'pending',
    joinedAt: subDays(new Date(), 5).toISOString(),
    lastActiveAt: subDays(new Date(), 5).toISOString(),
    assignedAccounts: [],
  },
]

// ─── Media Library ────────────────────────────────────────────────────────────

export const DEMO_ASSETS: LibraryAsset[] = Array.from({ length: 30 }, (_, i) => ({
  id: `asset-${i + 1}`,
  name: `asset_${String(i + 1).padStart(3, '0')}.${i % 4 === 0 ? 'mp4' : 'jpg'}`,
  url: `https://picsum.photos/seed/${i + 100}/800/800`,
  thumbnail: `https://picsum.photos/seed/${i + 100}/400/400`,
  type: (i % 4 === 0 ? 'video' : 'image') as LibraryAsset['type'],
  size: Math.floor(Math.random() * 5_000_000) + 200_000,
  width: 800,
  height: 800,
  duration: i % 4 === 0 ? Math.floor(Math.random() * 60) + 15 : undefined,
  tags: [
    ['fashion', 'product', 'lifestyle'][i % 3],
    ['summer', 'winter', 'spring'][i % 3],
  ],
  uploadedAt: subDays(new Date(), Math.floor(Math.random() * 60)).toISOString(),
  uploadedBy: 'user-1',
  usedInPosts: Math.floor(Math.random() * 8),
}))

// ─── Analytics ───────────────────────────────────────────────────────────────

export const DEMO_ANALYTICS: AccountAnalytics[] = DEMO_ACCOUNTS.map((account) => {
  const dailyMetrics = generateDailyMetrics(account.id, account.followers, 90)

  return {
    accountId: account.id,
    period: '30d',
    totalFollowers: account.followers,
    followerGrowth: Math.floor(account.followers * 0.04),
    followerGrowthPct: parseFloat((Math.random() * 5 + 1).toFixed(1)),
    avgEngagementRate: parseFloat((Math.random() * 3 + 1.5).toFixed(2)),
    totalReach: Math.floor(account.followers * 0.65),
    totalImpressions: Math.floor(account.followers * 1.2),
    totalLikes: Math.floor(account.followers * 0.08),
    totalComments: Math.floor(account.followers * 0.005),
    totalSaves: Math.floor(account.followers * 0.015),
    bestPostingTime: ['9:00 AM', '12:00 PM', '6:00 PM', '8:00 PM'][Math.floor(Math.random() * 4)],
    topHashtags: [
      { tag: '#trending', uses: 12, avgEngagement: 4.2 },
      { tag: '#lifestyle', uses: 10, avgEngagement: 3.8 },
      { tag: '#brand', uses: 8, avgEngagement: 3.5 },
      { tag: '#community', uses: 7, avgEngagement: 3.1 },
      { tag: '#daily', uses: 5, avgEngagement: 2.9 },
    ],
    dailyMetrics,
    postPerformance: DEMO_POSTS.filter((p) => p.accountId === account.id && p.status === 'published')
      .slice(0, 5)
      .map((p) => ({
        postId: p.id,
        thumbnail: p.media[0]?.thumbnail || '',
        caption: p.caption.substring(0, 80),
        publishedAt: p.publishedAt || '',
        likes: p.likes || 0,
        comments: p.comments || 0,
        saves: p.saves || 0,
        reach: p.reach || 0,
        impressions: p.impressions || 0,
        engagementRate: p.engagementRate || 0,
      })),
  }
})

// ─── Dashboard Stats ──────────────────────────────────────────────────────────

export const DEMO_DASHBOARD_STATS: DashboardStats = {
  totalFollowers: DEMO_ACCOUNTS.reduce((s, a) => s + a.followers, 0),
  followerGrowth: 8_420,
  followerGrowthPct: 1.8,
  avgEngagementRate: 3.4,
  postsThisWeek: 12,
  scheduledPosts: DEMO_POSTS.filter((p) => p.status === 'scheduled').length,
  pendingApprovals: DEMO_POSTS.filter((p) => p.status === 'pending_approval').length,
  newComments: DEMO_COMMENTS.filter((c) => c.status === 'new').length,
  totalReach: 324_500,
  reachGrowthPct: 12.3,
}

// ─── Calendar Events ──────────────────────────────────────────────────────────

export const DEMO_CALENDAR_EVENTS: CalendarEvent[] = DEMO_POSTS.filter(
  (p) => p.status === 'scheduled' || (p.status === 'published' && p.publishedAt)
).map((p) => ({
  id: `event-${p.id}`,
  postId: p.id,
  accountId: p.accountId,
  account: p.account,
  title: p.caption.substring(0, 50) + (p.caption.length > 50 ? '...' : ''),
  date: format(
    new Date(p.scheduledAt || p.publishedAt || new Date()),
    'yyyy-MM-dd'
  ),
  time: format(
    new Date(p.scheduledAt || p.publishedAt || new Date()),
    'HH:mm'
  ),
  status: p.status,
  thumbnail: p.media[0]?.thumbnail,
  postType: p.postType,
}))

// ─── Notifications ────────────────────────────────────────────────────────────

export const DEMO_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif-1',
    type: 'post_published',
    title: 'Post Published Successfully',
    message: '"New collection just dropped! 🔥" has been published on StyleHaus Brand.',
    read: false,
    createdAt: subHours(new Date(), 1).toISOString(),
    accountId: 'acc-1',
  },
  {
    id: 'notif-2',
    type: 'approval_needed',
    title: 'Post Needs Approval',
    message: 'Taylor Kim has submitted a new post for review on FitLife Studio.',
    read: false,
    createdAt: subHours(new Date(), 3).toISOString(),
    accountId: 'acc-4',
  },
  {
    id: 'notif-3',
    type: 'comment_received',
    title: 'New Negative Comment',
    message: 'A negative comment has been detected on TechPulse Media. Review needed.',
    read: false,
    createdAt: subHours(new Date(), 4).toISOString(),
    accountId: 'acc-2',
  },
  {
    id: 'notif-4',
    type: 'follower_milestone',
    title: '🎉 Milestone Reached!',
    message: 'FitLife Studio just crossed 200,000 followers!',
    read: true,
    createdAt: subDays(new Date(), 1).toISOString(),
    accountId: 'acc-4',
  },
  {
    id: 'notif-5',
    type: 'post_failed',
    title: 'Post Publishing Failed',
    message: 'Scheduled post on GreenLeaf Kitchen failed to publish. Please retry.',
    read: true,
    createdAt: subDays(new Date(), 1).toISOString(),
    accountId: 'acc-3',
  },
]

// ─── Approval Requests ────────────────────────────────────────────────────────

export const DEMO_APPROVALS: ApprovalRequest[] = DEMO_POSTS.filter(
  (p) => p.status === 'pending_approval'
).map((p, i) => ({
  id: `approval-${i + 1}`,
  postId: p.id,
  post: p,
  requestedBy: 'user-3',
  requestedAt: subHours(new Date(), (i + 1) * 6).toISOString(),
  status: 'pending',
  notes: i === 0 ? 'Please review the caption - I tried to make it more engaging' : undefined,
}))

// ─── Aggregated chart data for dashboard ─────────────────────────────────────

export function getDemoFollowerChartData(days = 30) {
  const data = []
  let total = DEMO_DASHBOARD_STATS.totalFollowers - days * 280

  for (let i = days; i >= 0; i--) {
    const gain = Math.floor(Math.random() * 600) + 100
    total += gain
    data.push({
      date: format(subDays(new Date(), i), CHART_DATE_FORMAT),
      followers: total,
      gain,
    })
  }
  return data
}

export function getDemoEngagementChartData(days = 30) {
  const data = []
  for (let i = days; i >= 0; i--) {
    data.push({
      date: format(subDays(new Date(), i), CHART_DATE_FORMAT),
      likes: Math.floor(Math.random() * 5000) + 1000,
      comments: Math.floor(Math.random() * 300) + 50,
      saves: Math.floor(Math.random() * 800) + 100,
      shares: Math.floor(Math.random() * 400) + 50,
    })
  }
  return data
}

export function getDemoReachChartData(days = 30) {
  const data = []
  for (let i = days; i >= 0; i--) {
    data.push({
      date: format(subDays(new Date(), i), CHART_DATE_FORMAT),
      reach: Math.floor(Math.random() * 20000) + 5000,
      impressions: Math.floor(Math.random() * 40000) + 10000,
    })
  }
  return data
}
