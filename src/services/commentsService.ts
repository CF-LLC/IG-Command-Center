import { DEMO_COMMENTS } from '@/lib/demo-data'
import { isDemoModeEnabled } from '@/lib/runtime-config'
import type { Comment, CommentReply } from '@/types'

const isDemoMode = isDemoModeEnabled()

export const commentsService = {
  async getComments(filters?: {
    accountId?: string
    status?: Comment['status']
    sentiment?: Comment['sentiment']
    limit?: number
  }): Promise<Comment[]> {
    if (isDemoMode) {
      let comments = [...DEMO_COMMENTS]
      if (filters?.accountId) {
        comments = comments.filter((c) => c.accountId === filters.accountId)
      }
      if (filters?.status) {
        comments = comments.filter((c) => c.status === filters.status)
      }
      if (filters?.sentiment) {
        comments = comments.filter((c) => c.sentiment === filters.sentiment)
      }
      if (filters?.limit) {
        comments = comments.slice(0, filters.limit)
      }
      return comments
    }
    throw new Error('Not in demo mode')
  },

  async replyToComment(commentId: string, text: string, isAiGenerated = false): Promise<Comment> {
    if (isDemoMode) {
      const index = DEMO_COMMENTS.findIndex((c) => c.id === commentId)
      if (index === -1) throw new Error('Comment not found')

      const reply: CommentReply = {
        id: `reply-${Date.now()}`,
        text,
        createdAt: new Date().toISOString(),
        createdBy: 'user-1',
        isAiGenerated,
      }

      DEMO_COMMENTS[index] = {
        ...DEMO_COMMENTS[index],
        status: 'replied',
        replies: [...(DEMO_COMMENTS[index].replies || []), reply],
      }

      return DEMO_COMMENTS[index]
    }
    throw new Error('Not in demo mode')
  },

  async archiveComment(commentId: string): Promise<void> {
    if (isDemoMode) {
      const index = DEMO_COMMENTS.findIndex((c) => c.id === commentId)
      if (index !== -1) {
        DEMO_COMMENTS[index] = { ...DEMO_COMMENTS[index], status: 'archived' }
      }
      return
    }
    throw new Error('Not in demo mode')
  },

  async flagComment(commentId: string): Promise<void> {
    if (isDemoMode) {
      const index = DEMO_COMMENTS.findIndex((c) => c.id === commentId)
      if (index !== -1) {
        DEMO_COMMENTS[index] = { ...DEMO_COMMENTS[index], status: 'flagged' }
      }
      return
    }
    throw new Error('Not in demo mode')
  },
}
