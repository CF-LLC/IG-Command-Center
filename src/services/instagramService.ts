import {
  DEMO_ACCOUNTS,
} from '@/lib/demo-data'
import { isDemoModeEnabled } from '@/lib/runtime-config'
import type { IGAccount } from '@/types'

const isDemoMode = isDemoModeEnabled()

export const instagramService = {
  async getAccounts(): Promise<IGAccount[]> {
    if (isDemoMode) {
      return DEMO_ACCOUNTS
    }
    // Real implementation should call Instagram Graph API + Neon-backed services.
    throw new Error('Not in demo mode')
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
