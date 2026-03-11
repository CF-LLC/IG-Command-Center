import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { verifyAccessSession } from '@/lib/access-auth'
import { ACCESS_COOKIE_NAME } from '@/lib/access-constants'
import { isAccessProtectionEnabled } from '@/lib/runtime-config'

export const dynamic = 'force-dynamic'

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  if (isAccessProtectionEnabled()) {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get(ACCESS_COOKIE_NAME)?.value

    if (verifyAccessSession(sessionCookie)) {
      redirect('/dashboard')
    }
  }

  return children
}
