import {
  DEMO_ACCOUNTS,
  DEMO_POSTS,
  DEMO_COMMENTS,
  DEMO_TEAM,
  DEMO_ASSETS,
  DEMO_ANALYTICS,
  DEMO_DASHBOARD_STATS,
  DEMO_CALENDAR_EVENTS,
  DEMO_NOTIFICATIONS,
  DEMO_APPROVALS,
  getDemoFollowerChartData,
  getDemoEngagementChartData,
  getDemoReachChartData,
} from '@/lib/demo-data'
import type { IGAccount } from '@/types'

const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true'

export const instagramService = {
  async getAccounts(): Promise<IGAccount[]> {
    if (isDemoMode) {
      return DEMO_ACCOUNTS
    }
    // Real implementation would call Supabase
    throw new Error('Not in demo mode - Supabase not configured')
  },

  async getAccount(id: string): Promise<IGAccount | null> {
    if (isDemoMode) {
      return DEMO_ACCOUNTS.find((a) => a.id === id) || null
    }
    throw new Error('Not in demo mode')
  },

  async connectAccount(accessToken: string): Promise<IGAccount> {
    if (isDemoMode) {
      return DEMO_ACCOUNTS[0]
    }
    throw new Error('Not in demo mode')
  },

  async disconnectAccount(id: string): Promise<void> {
    if (isDemoMode) return
    throw new Error('Not in demo mode')
  },

  async refreshAccountStats(id: string): Promise<IGAccount | null> {
    if (isDemoMode) {
      return DEMO_ACCOUNTS.find((a) => a.id === id) || null
    }
    throw new Error('Not in demo mode')
  },
}
