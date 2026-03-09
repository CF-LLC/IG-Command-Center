import { NextResponse, type NextRequest } from 'next/server'

const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true'

export async function middleware(request: NextRequest) {
  // In demo mode, allow all routes
  if (isDemoMode) {
    return NextResponse.next()
  }

  // In production, use Supabase auth middleware
  const { updateSession } = await import('@/lib/supabase/middleware')
  return updateSession(request)
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
