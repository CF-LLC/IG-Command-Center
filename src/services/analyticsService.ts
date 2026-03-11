import {
  DEMO_ANALYTICS,
  getDemoFollowerChartData,
  getDemoEngagementChartData,
  getDemoReachChartData,
} from '@/lib/demo-data'
import { isDemoModeEnabled } from '@/lib/runtime-config'
import type { AccountAnalytics } from '@/types'

const isDemoMode = isDemoModeEnabled()

export const analyticsService = {
  async getAccountAnalytics(
    accountId: string,
    period: '7d' | '30d' | '90d' = '30d'
  ): Promise<AccountAnalytics | null> {
    if (isDemoMode) {
      const analytics = DEMO_ANALYTICS.find((a) => a.accountId === accountId)
      return analytics ? { ...analytics, period } : null
    }
    throw new Error('Not in demo mode')
  },

  async getAllAnalytics(period: '7d' | '30d' | '90d' = '30d'): Promise<AccountAnalytics[]> {
    if (isDemoMode) {
      return DEMO_ANALYTICS.map((a) => ({ ...a, period }))
    }
    throw new Error('Not in demo mode')
  },

  async getFollowerChartData(days = 30) {
    if (isDemoMode) return getDemoFollowerChartData(days)
    throw new Error('Not in demo mode')
  },

  async getEngagementChartData(days = 30) {
    if (isDemoMode) return getDemoEngagementChartData(days)
    throw new Error('Not in demo mode')
  },

  async getReachChartData(days = 30) {
    if (isDemoMode) return getDemoReachChartData(days)
    throw new Error('Not in demo mode')
  },
}
