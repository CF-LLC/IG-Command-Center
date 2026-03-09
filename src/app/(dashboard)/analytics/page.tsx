'use client'

import { useState, useEffect } from 'react'
import {
  Users, TrendingUp, Eye, Heart, MessageSquare, Bookmark,
  ArrowUpRight, BarChart3,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, AreaChart, Area, BarChart, Bar, Legend,
} from 'recharts'
import { DEMO_ACCOUNTS, DEMO_ANALYTICS, getDemoEngagementChartData, getDemoReachChartData, getDemoFollowerChartData } from '@/lib/demo-data'

export default function AnalyticsPage() {
  const [selectedAccount, setSelectedAccount] = useState<string>('all')
  const [period, setPeriod] = useState<'7d' | '30d' | '90d'>('30d')
  const [followerData, setFollowerData] = useState<{ date: string; followers: number; gain: number }[]>([])
  const [engagementData, setEngagementData] = useState<{ date: string; likes: number; comments: number; saves: number; shares: number }[]>([])
  const [reachData, setReachData] = useState<{ date: string; reach: number; impressions: number }[]>([])

  const days = period === '7d' ? 7 : period === '30d' ? 30 : 90

  useEffect(() => {
    setFollowerData(getDemoFollowerChartData(days))
    setEngagementData(getDemoEngagementChartData(days))
    setReachData(getDemoReachChartData(days))
  }, [days])

  const analytics = selectedAccount === 'all'
    ? DEMO_ANALYTICS
    : DEMO_ANALYTICS.filter((a) => a.accountId === selectedAccount)

  const totalStats = {
    followers: analytics.reduce((s, a) => s + a.totalFollowers, 0),
    followerGrowth: analytics.reduce((s, a) => s + a.followerGrowth, 0),
    reach: analytics.reduce((s, a) => s + a.totalReach, 0),
    likes: analytics.reduce((s, a) => s + a.totalLikes, 0),
    comments: analytics.reduce((s, a) => s + a.totalComments, 0),
    saves: analytics.reduce((s, a) => s + a.totalSaves, 0),
    avgEngagement: analytics.length > 0
      ? (analytics.reduce((s, a) => s + a.avgEngagementRate, 0) / analytics.length).toFixed(2)
      : '0',
  }

  const topPosts = analytics.flatMap((a) => a.postPerformance)
    .sort((a, b) => b.engagementRate - a.engagementRate)
    .slice(0, 5)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold">Analytics</h1>
          <p className="text-muted-foreground">Deep insights across your Instagram accounts</p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedAccount} onValueChange={setSelectedAccount}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All Accounts" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Accounts</SelectItem>
              {DEMO_ACCOUNTS.map((acc) => (
                <SelectItem key={acc.id} value={acc.id}>@{acc.username}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={period} onValueChange={(v) => setPeriod(v as typeof period)}>
            <SelectTrigger className="w-28">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7 Days</SelectItem>
              <SelectItem value="30d">30 Days</SelectItem>
              <SelectItem value="90d">90 Days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Overview stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Total Followers', value: totalStats.followers.toLocaleString(), icon: Users, change: `+${totalStats.followerGrowth.toLocaleString()}` },
          { label: 'Avg Engagement', value: `${totalStats.avgEngagement}%`, icon: TrendingUp, change: '+0.3%' },
          { label: 'Total Reach', value: totalStats.reach.toLocaleString(), icon: Eye, change: '+12%' },
          { label: 'Total Likes', value: totalStats.likes.toLocaleString(), icon: Heart, change: '+8%' },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                <ArrowUpRight className="h-3 w-3" />
                {stat.change} this period
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="followers">
        <TabsList>
          <TabsTrigger value="followers">Followers</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="reach">Reach</TabsTrigger>
          <TabsTrigger value="posts">Top Posts</TabsTrigger>
        </TabsList>

        <TabsContent value="followers" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Follower Growth</CardTitle>
              <CardDescription>Total followers over the selected period</CardDescription>
            </CardHeader>
            <CardContent>
              {followerData.length === 0 ? (
                <Skeleton className="h-80 w-full" />
              ) : (
                <ResponsiveContainer width="100%" height={320}>
                  <AreaChart data={followerData}>
                    <defs>
                      <linearGradient id="colorFollowers" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="date" tick={{ fontSize: 11 }} tickLine={false} interval={Math.floor(followerData.length / 7)} />
                    <YAxis tick={{ fontSize: 11 }} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                    <Tooltip formatter={(v: number) => [v.toLocaleString(), 'Followers']} />
                    <Area type="monotone" dataKey="followers" stroke="hsl(var(--primary))" fill="url(#colorFollowers)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="engagement" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Engagement Breakdown</CardTitle>
              <CardDescription>Likes, comments, saves, and shares</CardDescription>
            </CardHeader>
            <CardContent>
              {engagementData.length === 0 ? (
                <Skeleton className="h-80 w-full" />
              ) : (
                <ResponsiveContainer width="100%" height={320}>
                  <LineChart data={engagementData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="date" tick={{ fontSize: 11 }} tickLine={false} interval={Math.floor(engagementData.length / 7)} />
                    <YAxis tick={{ fontSize: 11 }} tickLine={false} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="likes" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="comments" stroke="#10b981" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="saves" stroke="#f59e0b" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="shares" stroke="#8b5cf6" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reach" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Reach & Impressions</CardTitle>
              <CardDescription>How many people see your content</CardDescription>
            </CardHeader>
            <CardContent>
              {reachData.length === 0 ? (
                <Skeleton className="h-80 w-full" />
              ) : (
                <ResponsiveContainer width="100%" height={320}>
                  <BarChart data={reachData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="date" tick={{ fontSize: 11 }} tickLine={false} interval={Math.floor(reachData.length / 7)} />
                    <YAxis tick={{ fontSize: 11 }} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                    <Tooltip formatter={(v: number) => v.toLocaleString()} />
                    <Legend />
                    <Bar dataKey="reach" fill="hsl(var(--primary))" radius={[2, 2, 0, 0]} />
                    <Bar dataKey="impressions" fill="#8b5cf6" radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="posts" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Posts</CardTitle>
              <CardDescription>Ranked by engagement rate</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topPosts.map((post, idx) => (
                  <div key={post.postId} className="flex items-center gap-4">
                    <span className="text-2xl font-bold text-muted-foreground w-6 text-center">{idx + 1}</span>
                    <img
                      src={post.thumbnail}
                      alt=""
                      className="h-14 w-14 rounded-md object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium line-clamp-1">{post.caption}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Heart className="h-3 w-3" />{post.likes.toLocaleString()}
                        </span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <MessageSquare className="h-3 w-3" />{post.comments.toLocaleString()}
                        </span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Bookmark className="h-3 w-3" />{post.saves.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <Badge className="shrink-0">
                      {post.engagementRate.toFixed(1)}% ER
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Per-account breakdown */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {analytics.map((a) => {
          const account = DEMO_ACCOUNTS.find((acc) => acc.id === a.accountId)
          return (
            <Card key={a.accountId}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <img src={account?.avatar} alt="" className="h-9 w-9 rounded-full" />
                  <div>
                    <CardTitle className="text-sm">{account?.name}</CardTitle>
                    <CardDescription className="text-xs">@{account?.username}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-muted-foreground">Followers</p>
                  <p className="font-semibold text-sm">{a.totalFollowers.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Growth</p>
                  <p className="font-semibold text-sm text-green-600">+{a.followerGrowthPct}%</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Eng. Rate</p>
                  <p className="font-semibold text-sm">{a.avgEngagementRate}%</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Best Time</p>
                  <p className="font-semibold text-sm">{a.bestPostingTime}</p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
