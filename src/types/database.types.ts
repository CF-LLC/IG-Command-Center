export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      accounts: {
        Row: {
          id: string
          name: string
          username: string
          avatar: string
          followers: number
          following: number
          posts: number
          bio: string
          category: string
          is_verified: boolean
          connected_at: string
          access_token: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          username: string
          avatar: string
          followers?: number
          following?: number
          posts?: number
          bio?: string
          category?: string
          is_verified?: boolean
          connected_at?: string
          access_token?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          username?: string
          avatar?: string
          followers?: number
          following?: number
          posts?: number
          bio?: string
          category?: string
          is_verified?: boolean
          connected_at?: string
          access_token?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      posts: {
        Row: {
          id: string
          account_id: string
          caption: string
          hashtags: string[]
          media: Json
          post_type: string
          status: string
          scheduled_at: string | null
          published_at: string | null
          created_at: string
          updated_at: string
          created_by: string
          approved_by: string | null
          likes: number | null
          comments: number | null
          saves: number | null
          reach: number | null
          impressions: number | null
          ai_generated: boolean
          notes: string | null
        }
        Insert: {
          id?: string
          account_id: string
          caption: string
          hashtags?: string[]
          media?: Json
          post_type?: string
          status?: string
          scheduled_at?: string | null
          published_at?: string | null
          created_at?: string
          updated_at?: string
          created_by: string
          approved_by?: string | null
          likes?: number | null
          comments?: number | null
          saves?: number | null
          reach?: number | null
          impressions?: number | null
          ai_generated?: boolean
          notes?: string | null
        }
        Update: {
          id?: string
          account_id?: string
          caption?: string
          hashtags?: string[]
          media?: Json
          post_type?: string
          status?: string
          scheduled_at?: string | null
          published_at?: string | null
          created_at?: string
          updated_at?: string
          created_by?: string
          approved_by?: string | null
          likes?: number | null
          comments?: number | null
          saves?: number | null
          reach?: number | null
          impressions?: number | null
          ai_generated?: boolean
          notes?: string | null
        }
      }
      team_members: {
        Row: {
          id: string
          name: string
          email: string
          avatar: string
          role: string
          status: string
          joined_at: string
          last_active_at: string
          assigned_accounts: string[]
        }
        Insert: {
          id?: string
          name: string
          email: string
          avatar?: string
          role?: string
          status?: string
          joined_at?: string
          last_active_at?: string
          assigned_accounts?: string[]
        }
        Update: {
          id?: string
          name?: string
          email?: string
          avatar?: string
          role?: string
          status?: string
          joined_at?: string
          last_active_at?: string
          assigned_accounts?: string[]
        }
      }
      comments: {
        Row: {
          id: string
          post_id: string
          account_id: string
          author: string
          author_avatar: string
          text: string
          sentiment: string
          status: string
          likes: number
          created_at: string
          replies: Json
          is_high_priority: boolean
        }
        Insert: {
          id?: string
          post_id: string
          account_id: string
          author: string
          author_avatar?: string
          text: string
          sentiment?: string
          status?: string
          likes?: number
          created_at?: string
          replies?: Json
          is_high_priority?: boolean
        }
        Update: {
          id?: string
          post_id?: string
          account_id?: string
          author?: string
          author_avatar?: string
          text?: string
          sentiment?: string
          status?: string
          likes?: number
          created_at?: string
          replies?: Json
          is_high_priority?: boolean
        }
      }
      media_assets: {
        Row: {
          id: string
          name: string
          url: string
          thumbnail: string | null
          type: string
          size: number
          width: number | null
          height: number | null
          duration: number | null
          tags: string[]
          uploaded_at: string
          uploaded_by: string
          used_in_posts: number
        }
        Insert: {
          id?: string
          name: string
          url: string
          thumbnail?: string | null
          type: string
          size: number
          width?: number | null
          height?: number | null
          duration?: number | null
          tags?: string[]
          uploaded_at?: string
          uploaded_by: string
          used_in_posts?: number
        }
        Update: {
          id?: string
          name?: string
          url?: string
          thumbnail?: string | null
          type?: string
          size?: number
          width?: number | null
          height?: number | null
          duration?: number | null
          tags?: string[]
          uploaded_at?: string
          uploaded_by?: string
          used_in_posts?: number
        }
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}
