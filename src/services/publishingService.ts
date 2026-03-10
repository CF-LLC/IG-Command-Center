import { DEMO_POSTS } from '@/lib/demo-data'
import type { Post } from '@/types'

const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true'

export const publishingService = {
  async getPosts(filters?: {
    accountId?: string
    status?: Post['status']
    limit?: number
  }): Promise<Post[]> {
    if (isDemoMode) {
      let posts = [...DEMO_POSTS]
      if (filters?.accountId) {
        posts = posts.filter((p) => p.accountId === filters.accountId)
      }
      if (filters?.status) {
        posts = posts.filter((p) => p.status === filters.status)
      }
      if (filters?.limit) {
        posts = posts.slice(0, filters.limit)
      }
      return posts
    }
    throw new Error('Not in demo mode')
  },

  async getPost(id: string): Promise<Post | null> {
    if (isDemoMode) {
      return DEMO_POSTS.find((p) => p.id === id) || null
    }
    throw new Error('Not in demo mode')
  },

  async createPost(data: Partial<Post>): Promise<Post> {
    if (isDemoMode) {
      const newPost: Post = {
        id: `post-${Date.now()}`,
        accountId: data.accountId || 'acc-1',
        caption: data.caption || '',
        hashtags: data.hashtags || [],
        media: data.media || [],
        postType: data.postType || 'feed',
        status: data.status || 'draft',
        scheduledAt: data.scheduledAt,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: 'user-1',
        aiGenerated: data.aiGenerated,
      }
      DEMO_POSTS.unshift(newPost)
      return newPost
    }
    throw new Error('Not in demo mode')
  },

  async updatePost(id: string, data: Partial<Post>): Promise<Post> {
    if (isDemoMode) {
      const index = DEMO_POSTS.findIndex((p) => p.id === id)
      if (index === -1) throw new Error('Post not found')
      DEMO_POSTS[index] = { ...DEMO_POSTS[index], ...data, updatedAt: new Date().toISOString() }
      return DEMO_POSTS[index]
    }
    throw new Error('Not in demo mode')
  },

  async deletePost(id: string): Promise<void> {
    if (isDemoMode) {
      const index = DEMO_POSTS.findIndex((p) => p.id === id)
      if (index !== -1) DEMO_POSTS.splice(index, 1)
      return
    }
    throw new Error('Not in demo mode')
  },

  async schedulePost(id: string, scheduledAt: string): Promise<Post> {
    return this.updatePost(id, { status: 'scheduled', scheduledAt })
  },

  async publishNow(id: string): Promise<Post> {
    return this.updatePost(id, {
      status: 'published',
      publishedAt: new Date().toISOString(),
    })
  },
}
