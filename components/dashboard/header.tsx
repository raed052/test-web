'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import {
  Menu,
  User,
  LogOut,
  Settings,
  FileText,
  LayoutDashboard,
  CreditCard,
  History,
  Key,
  HelpCircle,
} from 'lucide-react'

interface DashboardHeaderProps {
  user: {
    email: string
    full_name: string | null
    avatar_url: string | null
  }
}

const mobileNavItems = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/history', label: 'History', icon: History },
  { href: '/dashboard/subscription', label: 'Subscription', icon: CreditCard },
  { href: '/dashboard/api-keys', label: 'API Keys', icon: Key },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
  { href: '/dashboard/support', label: 'Support', icon: HelpCircle },
]

export function DashboardHeader({ user }: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-background px-4 lg:px-6">
      {/* Mobile Menu */}
      <div className="flex items-center gap-4 lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64">
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                  <FileText className="h-4 w-4 text-primary-foreground" />
                </div>
                Mido PDF
              </SheetTitle>
            </SheetHeader>
            <nav className="mt-6 space-y-1">
              {mobileNavItems.map(item => (
                <Link key={item.href} href={item.href}>
                  <Button variant="ghost" className="w-full justify-start">
                    <item.icon className="mr-3 h-4 w-4" />
                    {item.label}
                  </Button>
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
        <Link href="/" className="flex items-center gap-2 lg:hidden">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <FileText className="h-4 w-4 text-primary-foreground" />
          </div>
        </Link>
      </div>

      {/* Spacer for desktop */}
      <div className="hidden lg:block" />

      {/* Quick Actions */}
      <div className="flex items-center gap-2">
        <Link href="/tools">
          <Button variant="outline" size="sm">
            <FileText className="mr-2 h-4 w-4" />
            PDF Tools
          </Button>
        </Link>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                {(user.full_name || user.email).charAt(0).toUpperCase()}
              </div>
              <span className="sr-only">User menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span>{user.full_name || 'User'}</span>
                <span className="text-xs font-normal text-muted-foreground">
                  {user.email}
                </span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/dashboard/settings">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/auth/logout" className="text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
