import type { AIContentRequest, AIContentResponse } from '@/types'

const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true'

const DEMO_CAPTIONS = [
  "✨ Elevate your everyday with our latest drop. Quality you can feel, style you can see. Shop the link in bio! 🛍️",
  "Big things are happening and we can't keep quiet any longer 🔥 Stay tuned for something amazing coming your way...",
  "Your story deserves to be told. We're here to help you tell it. 💫 What's your next chapter?",
  "The secret to success? Consistency + passion + the right tools. What's your formula? 💪",
  "Life's too short for boring content. Let's create something extraordinary together. 🎨✨",
]

export const aiContentService = {
  async generateCaption(request: AIContentRequest): Promise<AIContentResponse> {
    if (isDemoMode) {
      await new Promise((r) => setTimeout(r, 1500)) // Simulate API delay
      const caption = DEMO_CAPTIONS[Math.floor(Math.random() * DEMO_CAPTIONS.length)]
      return {
        caption,
        hashtags: ['#trending', '#lifestyle', '#brand', '#community', '#inspiration'],
        alternativeVersions: DEMO_CAPTIONS.filter((c) => c !== caption).slice(0, 2),
      }
    }

    // Real OpenAI implementation
    const response = await fetch('/api/ai/generate-caption', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    })

    if (!response.ok) throw new Error('Failed to generate caption')
    return response.json()
  },

  async generateReply(commentText: string, brandVoice?: string): Promise<string> {
    if (isDemoMode) {
      await new Promise((r) => setTimeout(r, 800))
      const replies = [
        "Thank you so much for your kind words! We truly appreciate your support 💕",
        "We love hearing from our community! Reach out via DM if you need any help 🙌",
        "So glad you're loving it! Stay tuned for more exciting updates coming soon ✨",
        "Your feedback means the world to us! We're always working to improve 🙏",
      ]
      return replies[Math.floor(Math.random() * replies.length)]
    }

    const response = await fetch('/api/ai/generate-reply', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ commentText, brandVoice }),
    })

    if (!response.ok) throw new Error('Failed to generate reply')
    const data = await response.json()
    return data.reply
  },

  async generateHashtags(topic: string, count = 10): Promise<string[]> {
    if (isDemoMode) {
      await new Promise((r) => setTimeout(r, 600))
      return [
        '#trending', '#lifestyle', '#inspiration', '#content', '#creator',
        '#community', '#brand', '#digital', '#marketing', '#social',
      ].slice(0, count)
    }

    const response = await fetch('/api/ai/generate-hashtags', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic, count }),
    })

    if (!response.ok) throw new Error('Failed to generate hashtags')
    const data = await response.json()
    return data.hashtags
  },
}
