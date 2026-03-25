'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  FileText,
  LayoutDashboard,
  CreditCard,
  Settings,
  History,
  Key,
  HelpCircle,
  Crown,
  Shield,
} from 'lucide-react'

interface DashboardSidebarProps {
  user: {
    email: string
    full_name: string | null
    subscription_tier: string
    is_admin: boolean
  }
}

const navItems = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/history', label: 'History', icon: History },
  { href: '/dashboard/subscription', label: 'Subscription', icon: CreditCard },
  { href: '/dashboard/api-keys', label: 'API Keys', icon: Key },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
  { href: '/dashboard/support', label: 'Support', icon: HelpCircle },
]

export function DashboardSidebar({ user }: DashboardSidebarProps) {
  const pathname = usePathname()

  return (
    <aside className="fixed inset-y-0 left-0 z-50 hidden w-64 border-r bg-background lg:block">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center border-b px-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <FileText className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold">
              Mido <span className="text-primary">PDF</span>
            </span>
          </Link>
        </div>

        {/* User Info */}
        <div className="border-b p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
              {(user.full_name || user.email).charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">
                {user.full_name || user.email.split('@')[0]}
              </p>
              <div className="flex items-center gap-1">
                <Badge
                  variant="secondary"
                  className={cn(
                    'text-[10px]',
                    user.subscription_tier !== 'free' && 'bg-primary/10 text-primary'
                  )}
                >
                  {user.subscription_tier !== 'free' && <Crown className="mr-1 h-2.5 w-2.5" />}
                  {user.subscription_tier.toUpperCase()}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-4">
          {navItems.map(item => {
            const isActive = pathname === item.href
            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={isActive ? 'secondary' : 'ghost'}
                  className={cn(
                    'w-full justify-start',
                    isActive && 'bg-primary/10 text-primary'
                  )}
                >
                  <item.icon className="mr-3 h-4 w-4" />
                  {item.label}
                </Button>
              </Link>
            )
          })}
        </nav>

        {/* Admin Link */}
        {user.is_admin && (
          <div className="border-t p-4">
            <Link href="/admin">
              <Button variant="outline" className="w-full justify-start">
                <Shield className="mr-3 h-4 w-4" />
                Admin Panel
              </Button>
            </Link>
          </div>
        )}

        {/* Upgrade CTA */}
        {user.subscription_tier === 'free' && (
          <div className="border-t p-4">
            <div className="rounded-lg bg-primary/5 p-4">
              <p className="text-sm font-medium">Upgrade to Pro</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Get unlimited access to all features
              </p>
              <Link href="/pricing">
                <Button size="sm" className="mt-3 w-full">
                  <Crown className="mr-2 h-3.5 w-3.5" />
                  Upgrade Now
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </aside>
  )
}
