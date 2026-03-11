import { Sidebar } from '@/components/layout/sidebar'
import { Header } from '@/components/layout/header'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { verifyAccessSession } from '@/lib/access-auth'
import { ACCESS_COOKIE_NAME } from '@/lib/access-constants'
import { isAccessProtectionEnabled } from '@/lib/runtime-config'

export const dynamic = 'force-dynamic'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  if (isAccessProtectionEnabled()) {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get(ACCESS_COOKIE_NAME)?.value

    if (!verifyAccessSession(sessionCookie)) {
      redirect('/login')
    }
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
