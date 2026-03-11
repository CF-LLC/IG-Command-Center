import { DEMO_NOTIFICATIONS } from '@/lib/demo-data'
import { isDemoModeEnabled } from '@/lib/runtime-config'
import type { Notification } from '@/types'

const isDemoMode = isDemoModeEnabled()

export const notificationService = {
  async getNotifications(): Promise<Notification[]> {
    if (isDemoMode) {
      return [...DEMO_NOTIFICATIONS].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
    }
    throw new Error('Not in demo mode')
  },

  async markAsRead(id: string): Promise<void> {
    if (isDemoMode) {
      const notif = DEMO_NOTIFICATIONS.find((n) => n.id === id)
      if (notif) notif.read = true
      return
    }
    throw new Error('Not in demo mode')
  },

  async markAllAsRead(): Promise<void> {
    if (isDemoMode) {
      DEMO_NOTIFICATIONS.forEach((n) => (n.read = true))
      return
    }
    throw new Error('Not in demo mode')
  },

  getUnreadCount(): number {
    if (isDemoMode) {
      return DEMO_NOTIFICATIONS.filter((n) => !n.read).length
    }
    return 0
  },
}
