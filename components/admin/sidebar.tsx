'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Users,
  CreditCard,
  MessageSquare,
  Settings,
  FileText,
  Bot,
  Ticket,
  BarChart3,
  Megaphone,
  LogOut,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/payments', label: 'Payments', icon: CreditCard },
  { href: '/admin/support', label: 'Support Tickets', icon: Ticket },
  { href: '/admin/ai-chat', label: 'AI Control', icon: Bot },
  { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/admin/content', label: 'Content', icon: FileText },
  { href: '/admin/ads', label: 'Google Ads', icon: Megaphone },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 border-r bg-card flex flex-col">
      <div className="p-6 border-b">
        <Link href="/admin" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <FileText className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <span className="font-bold text-lg">Mido PDF</span>
            <span className="text-xs text-muted-foreground block">Admin Panel</span>
          </div>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || 
            (item.href !== '/admin' && pathname.startsWith(item.href))
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t">
        <Link href="/dashboard">
          <Button variant="outline" className="w-full justify-start gap-2">
            <LogOut className="h-4 w-4" />
            Exit Admin
          </Button>
        </Link>
      </div>
    </aside>
  )
}
