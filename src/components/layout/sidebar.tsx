'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Calendar,
  PenSquare,
  Library,
  BarChart3,
  MessageSquare,
  UserCog,
  Settings,
  Instagram,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'

const navItems = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Calendar',
    href: '/calendar',
    icon: Calendar,
  },
  {
    title: 'Composer',
    href: '/composer',
    icon: PenSquare,
  },
  {
    title: 'Library',
    href: '/library',
    icon: Library,
  },
  {
    title: 'Analytics',
    href: '/analytics',
    icon: BarChart3,
  },
  {
    title: 'Comments',
    href: '/comments',
    icon: MessageSquare,
    badge: 'new',
  },
  {
    title: 'Accounts',
    href: '/accounts',
    icon: Instagram,
  },
  {
    title: 'Team',
    href: '/team',
    icon: UserCog,
  },
  {
    title: 'Settings',
    href: '/settings',
    icon: Settings,
  },
]

interface SidebarProps {
  mobile?: boolean
  className?: string
}

export function Sidebar({ mobile = false, className }: SidebarProps) {
  const pathname = usePathname()

  return (
    <aside
      className={cn(
        'h-full w-64 flex-col border-r bg-card',
        mobile ? 'flex' : 'hidden md:flex',
        className
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 px-6 border-b">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
          <Instagram className="h-5 w-5 text-primary-foreground" />
        </div>
        <span className="font-semibold text-lg">IG Command</span>
      </div>

      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                )}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                <span className="flex-1">{item.title}</span>
                {item.badge && (
                  <Badge variant="secondary" className="text-xs h-5 px-1.5">
                    {item.badge}
                  </Badge>
                )}
              </Link>
            )
          })}
        </nav>
      </ScrollArea>

      {/* Demo mode badge */}
      <div className="p-4 border-t">
        <div className="rounded-lg bg-primary/10 px-3 py-2 text-xs text-primary font-medium text-center">
          🎭 Demo Mode Active
        </div>
      </div>
    </aside>
  )
}
