'use client'

import { useState } from 'react'
import { Instagram } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useRouter } from 'next/navigation'

export const dynamic = 'force-dynamic'

const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE !== 'false'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState(isDemoMode ? 'alex@company.com' : '')
  const [password, setPassword] = useState(isDemoMode ? 'demo1234' : '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as { error?: string } | null
        throw new Error(body?.error || 'Sign in failed. Check your credentials.')
      }

      router.push('/dashboard')
      router.refresh()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unable to sign in.'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-background p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
            <Instagram className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="text-2xl font-bold">IG Command Center</span>
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle>Welcome back</CardTitle>
            <CardDescription>Sign in to your account to continue</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>

              {error && <p className="text-sm text-destructive">{error}</p>}
            </form>

            {isDemoMode && (
              <div className="mt-4 rounded-lg bg-muted p-3 text-center text-sm">
                <p className="font-medium">Demo Mode</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Credentials are pre-filled. Click Sign In to continue.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
