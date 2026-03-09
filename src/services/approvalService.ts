import { DEMO_APPROVALS } from '@/lib/demo-data'
import type { ApprovalRequest } from '@/types'

const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true'

export const approvalService = {
  async getPendingApprovals(): Promise<ApprovalRequest[]> {
    if (isDemoMode) {
      return DEMO_APPROVALS.filter((a) => a.status === 'pending')
    }
    throw new Error('Not in demo mode')
  },

  async approvePost(approvalId: string, notes?: string): Promise<ApprovalRequest> {
    if (isDemoMode) {
      const index = DEMO_APPROVALS.findIndex((a) => a.id === approvalId)
      if (index === -1) throw new Error('Approval not found')
      DEMO_APPROVALS[index] = {
        ...DEMO_APPROVALS[index],
        status: 'approved',
        reviewedBy: 'user-1',
        reviewedAt: new Date().toISOString(),
        notes,
      }
      return DEMO_APPROVALS[index]
    }
    throw new Error('Not in demo mode')
  },

  async rejectPost(approvalId: string, notes: string): Promise<ApprovalRequest> {
    if (isDemoMode) {
      const index = DEMO_APPROVALS.findIndex((a) => a.id === approvalId)
      if (index === -1) throw new Error('Approval not found')
      DEMO_APPROVALS[index] = {
        ...DEMO_APPROVALS[index],
        status: 'rejected',
        reviewedBy: 'user-1',
        reviewedAt: new Date().toISOString(),
        notes,
      }
      return DEMO_APPROVALS[index]
    }
    throw new Error('Not in demo mode')
  },

  async requestChanges(approvalId: string, notes: string): Promise<ApprovalRequest> {
    if (isDemoMode) {
      const index = DEMO_APPROVALS.findIndex((a) => a.id === approvalId)
      if (index === -1) throw new Error('Approval not found')
      DEMO_APPROVALS[index] = {
        ...DEMO_APPROVALS[index],
        status: 'changes_requested',
        reviewedBy: 'user-1',
        reviewedAt: new Date().toISOString(),
        notes,
      }
      return DEMO_APPROVALS[index]
    }
    throw new Error('Not in demo mode')
  },
}
