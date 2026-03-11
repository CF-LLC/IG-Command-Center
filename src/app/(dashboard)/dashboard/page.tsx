'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import {
  Users,
  TrendingUp,
  Calendar,
  MessageSquare,
  Eye,
  Heart,
  Bookmark,
  ArrowUpRight,
  Clock,
} from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  Legend,
} from 'recharts'
import {
  DEMO_DASHBOARD_STATS,
  DEMO_ACCOUNTS,
  DEMO_POSTS,
  getDemoFollowerChartData,
  getDemoEngagementChartData,
} from '@/lib/demo-data'
import { formatDistanceToNow } from 'date-fns'
import Link from 'next/link'

function StatCard({
  title,
  value,
  change,
  changeLabel,
  icon: Icon,
  trend = 'up',
}: {
  title: string
  value: string | number
  change?: string
  changeLabel?: string
  icon: React.ElementType
  trend?: 'up' | 'down'
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </div>
        {change && (
          <p className={`text-xs mt-1 flex items-center gap-1 ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
            <ArrowUpRight className="h-3 w-3" />
            {change} {changeLabel}
          </p>
        )}
      </CardContent>
    </Card>
  )
}

export default function DashboardPage() {
  const [followerData, setFollowerData] = useState<ReturnType<typeof getDemoFollowerChartData>>([])
  const [engagementData, setEngagementData] = useState<ReturnType<typeof getDemoEngagementChartData>>([])
  const stats = DEMO_DASHBOARD_STATS
  const recentPosts = DEMO_POSTS.filter((p) => p.status === 'published').slice(0, 5)
  const scheduledPosts = DEMO_POSTS.filter((p) => p.status === 'scheduled').slice(0, 3)

  useEffect(() => {
    setFollowerData(getDemoFollowerChartData(30))
    setEngagementData(getDemoEngagementChartData(30))
  }, [])

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Overview of all your Instagram accounts</p>
        </div>
        <Button asChild>
          <Link href="/composer">+ Create Post</Link>
        </Button>
      </div>

      {/* Stats grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Followers"
          value={stats.totalFollowers}
          change={`+${stats.followerGrowth.toLocaleString()}`}
          changeLabel="this month"
          icon={Users}
          trend="up"
        />
        <StatCard
          title="Avg Engagement Rate"
          value={`${stats.avgEngagementRate}%`}
          change="+0.4%"
          changeLabel="vs last month"
          icon={TrendingUp}
          trend="up"
        />
        <StatCard
          title="Total Reach"
          value={stats.totalReach}
          change={`+${stats.reachGrowthPct}%`}
          changeLabel="vs last month"
          icon={Eye}
          trend="up"
        />
        <StatCard
          title="Scheduled Posts"
          value={stats.scheduledPosts}
          changeLabel="posts in queue"
          icon={Calendar}
        />
      </div>

      {/* Secondary stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          title="Posts This Week"
          value={stats.postsThisWeek}
          icon={Heart}
        />
        <StatCard
          title="Pending Approvals"
          value={stats.pendingApprovals}
          icon={Clock}
        />
        <StatCard
          title="New Comments"
          value={stats.newComments}
          icon={MessageSquare}
        />
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Follower growth chart */}
        <Card>
          <CardHeader>
            <CardTitle>Follower Growth</CardTitle>
            <CardDescription>Total followers across all accounts (last 30 days)</CardDescription>
          </CardHeader>
          <CardContent>
            {followerData.length === 0 ? (
              <Skeleton className="h-64 w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={followerData.slice(-14)}>
                  <defs>
                    <linearGradient id="followerGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} tickLine={false} />
                  <YAxis tick={{ fontSize: 11 }} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                  <Tooltip formatter={(v: number) => v.toLocaleString()} />
                  <Area
                    type="monotone"
                    dataKey="followers"
                    stroke="hsl(var(--primary))"
                    fill="url(#followerGradient)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Engagement chart */}
        <Card>
          <CardHeader>
            <CardTitle>Engagement Overview</CardTitle>
            <CardDescription>Likes, comments, and saves (last 14 days)</CardDescription>
          </CardHeader>
          <CardContent>
            {engagementData.length === 0 ? (
              <Skeleton className="h-64 w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={engagementData.slice(-14)}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} tickLine={false} />
                  <YAxis tick={{ fontSize: 11 }} tickLine={false} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="likes" fill="hsl(var(--primary))" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="comments" fill="#10b981" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="saves" fill="#f59e0b" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Accounts overview + Scheduled posts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Account performance */}
        <Card>
          <CardHeader>
            <CardTitle>Account Performance</CardTitle>
            <CardDescription>Overview of your connected accounts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {DEMO_ACCOUNTS.map((account) => (
              <div key={account.id} className="flex items-center gap-3">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={account.avatar} alt={account.name} />
                  <AvatarFallback>{account.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium truncate">{account.name}</p>
                    {account.isVerified && (
                      <Badge variant="secondary" className="text-xs h-4 px-1">✓</Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">@{account.username}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">{(account.followers / 1000).toFixed(1)}K</p>
                  <p className="text-xs text-muted-foreground">followers</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Upcoming scheduled posts */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Upcoming Posts</CardTitle>
                <CardDescription>Next scheduled publications</CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/calendar">View All</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {scheduledPosts.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No scheduled posts</p>
            ) : (
              scheduledPosts.map((post) => (
                <div key={post.id} className="flex items-start gap-3">
                  <div className="relative h-12 w-12 rounded-md overflow-hidden shrink-0">
                    <Image
                      src={post.media[0]?.thumbnail || post.media[0]?.url || 'https://via.placeholder.com/48'}
                      alt="Post preview"
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{post.account?.name}</p>
                    <p className="text-xs text-muted-foreground line-clamp-1">{post.caption.substring(0, 60)}...</p>
                    <p className="text-xs text-primary mt-0.5">
                      {post.scheduledAt ? formatDistanceToNow(new Date(post.scheduledAt), { addSuffix: true }) : ''}
                    </p>
                  </div>
                  <Badge variant="outline" className="text-xs shrink-0">
                    {post.postType}
                  </Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
