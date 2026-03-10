// Auth service - in demo mode, uses a simple in-memory session
const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true'

export interface AuthUser {
  id: string
  email: string
  name: string
  avatar: string
  role: string
}

const DEMO_USER: AuthUser = {
  id: 'user-1',
  email: 'alex@company.com',
  name: 'Alex Morgan',
  avatar: 'https://i.pravatar.cc/150?img=20',
  role: 'owner',
}

export const authService = {
  async getCurrentUser(): Promise<AuthUser | null> {
    if (isDemoMode) {
      return DEMO_USER
    }
    return null
  },

  async signIn(email: string, password: string): Promise<AuthUser> {
    if (isDemoMode) {
      await new Promise((r) => setTimeout(r, 500))
      return DEMO_USER
    }
    throw new Error('Not in demo mode')
  },

  async signOut(): Promise<void> {
    if (isDemoMode) return
    throw new Error('Not in demo mode')
  },
}
