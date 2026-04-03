import { NextResponse, type NextRequest } from 'next/server'
import { verifyAccessSessionInMiddleware } from '@/lib/access-auth-edge'
import { ACCESS_COOKIE_NAME } from '@/lib/access-constants'
import { getAccessProtectionConfigIssues, isAccessProtectionEnabled } from '@/lib/runtime-config'

export async function middleware(request: NextRequest) {
  if (!isAccessProtectionEnabled()) {
    return NextResponse.next({ request })
  }

  const { pathname } = request.nextUrl
  const isLoginRoute = pathname === '/login'
  const isAuthApiRoute = pathname === '/api/auth/login' || pathname === '/api/auth/logout'
  const configIssues = getAccessProtectionConfigIssues()

  if (configIssues.length > 0) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Access protection is misconfigured.' }, { status: 503 })
    }

    return new NextResponse('Service unavailable: access protection is misconfigured.', {
      status: 503,
      headers: {
        'content-type': 'text/plain; charset=utf-8',
      },
    })
  }

  const accessSession = request.cookies.get(ACCESS_COOKIE_NAME)?.value
  const hasValidAccessSession = await verifyAccessSessionInMiddleware(accessSession)

  if (isAuthApiRoute) {
    return NextResponse.next({ request })
  }

  if (isLoginRoute && hasValidAccessSession) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  if (pathname.startsWith('/api/') && !hasValidAccessSession) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!isLoginRoute && !hasValidAccessSession) {
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
