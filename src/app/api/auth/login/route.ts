import { NextResponse } from 'next/server'
import {
  canUseProtectedAccess,
  createAccessSession,
  getAccessSessionMaxAge,
  validateAccessCredentials,
} from '@/lib/access-auth'
import { ACCESS_COOKIE_NAME } from '@/lib/access-constants'
import { isAccessProtectionEnabled } from '@/lib/runtime-config'

export async function POST(request: Request) {
  if (!isAccessProtectionEnabled()) {
    return NextResponse.json({ ok: true })
  }

  if (!canUseProtectedAccess()) {
    return NextResponse.json(
      { error: 'Access protection is enabled but not configured.' },
      { status: 500 }
    )
  }

  const body = (await request.json().catch(() => null)) as
    | { email?: string; password?: string }
    | null

  const email = body?.email || ''
  const password = body?.password || ''

  if (!validateAccessCredentials(email, password)) {
    return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 })
  }

  const response = NextResponse.json({ ok: true })
  response.cookies.set(ACCESS_COOKIE_NAME, createAccessSession(email), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: getAccessSessionMaxAge(),
  })

  return response
}
