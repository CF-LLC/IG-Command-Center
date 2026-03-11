import { NextResponse, type NextRequest } from 'next/server'
import { ACCESS_COOKIE_NAME } from '@/lib/access-constants'
import { isAccessProtectionEnabled } from '@/lib/runtime-config'

export async function middleware(request: NextRequest) {
  if (!isAccessProtectionEnabled()) {
    return NextResponse.next({ request })
  }

  const { pathname } = request.nextUrl
  const isLoginRoute = pathname === '/login'
  const isAuthApiRoute = pathname === '/api/auth/login' || pathname === '/api/auth/logout'
  const hasAccessSession = Boolean(request.cookies.get(ACCESS_COOKIE_NAME)?.value)

  if (isAuthApiRoute) {
    return NextResponse.next({ request })
  }

  if (isLoginRoute && hasAccessSession) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  if (pathname.startsWith('/api/') && !hasAccessSession) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!isLoginRoute && !hasAccessSession) {
    const loginUrl = new URL('/login', request.url)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next({ request })
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
