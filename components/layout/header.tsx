'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu'
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import {
  FileText,
  ChevronDown,
  Menu,
  User,
  LogOut,
  Settings,
  CreditCard,
  LayoutDashboard,
  Layers,
  Minimize2,
  ArrowLeftRight,
  Edit3,
  Shield,
  Sparkles,
} from 'lucide-react'
import { PDF_TOOLS, TOOL_CATEGORIES } from '@/lib/pdf-tools'

const categoryIcons: Record<string, React.ReactNode> = {
  organize: <Layers className="h-4 w-4" />,
  optimize: <Minimize2 className="h-4 w-4" />,
  'convert-to': <ArrowLeftRight className="h-4 w-4" />,
  'convert-from': <ArrowLeftRight className="h-4 w-4" />,
  edit: <Edit3 className="h-4 w-4" />,
  security: <Shield className="h-4 w-4" />,
  ai: <Sparkles className="h-4 w-4" />,
}

interface HeaderProps {
  user?: {
    email: string
    full_name?: string
    subscription_tier?: string
  } | null
}

export function Header({ user }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <FileText className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold">
            Mido <span className="text-primary">PDF</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          <Link href="/tools/merge">
            <Button variant="ghost" size="sm">
              Merge PDF
            </Button>
          </Link>
          <Link href="/tools/split">
            <Button variant="ghost" size="sm">
              Split PDF
            </Button>
          </Link>
          <Link href="/tools/compress">
            <Button variant="ghost" size="sm">
              Compress PDF
            </Button>
          </Link>

          {/* All Tools Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="text-primary">
                All PDF Tools
                <ChevronDown className="ml-1 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="w-[600px] p-4">
              <div className="grid grid-cols-3 gap-4">
                {TOOL_CATEGORIES.slice(0, 6).map(category => (
                  <div key={category.id}>
                    <DropdownMenuLabel className="flex items-center gap-2 text-xs uppercase text-muted-foreground">
                      {categoryIcons[category.id]}
                      {category.name}
                    </DropdownMenuLabel>
                    <div className="mt-1 space-y-1">
                      {PDF_TOOLS.filter(tool => tool.category === category.id)
                        .slice(0, 4)
                        .map(tool => (
                          <DropdownMenuItem key={tool.id} asChild>
                            <Link
                              href={tool.path}
                              className="flex items-center justify-between text-sm"
                            >
                              {tool.name}
                              {tool.isPremium && (
                                <span className="ml-2 rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary">
                                  PRO
                                </span>
                              )}
                            </Link>
                          </DropdownMenuItem>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
              <DropdownMenuSeparator className="my-3" />
              <DropdownMenuItem asChild>
                <Link href="/tools" className="justify-center text-primary font-medium">
                  View All Tools
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>

        {/* Right Side Actions */}
        <div className="flex items-center gap-2">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="hidden sm:flex">
                  <User className="mr-2 h-4 w-4" />
                  {user.full_name || user.email.split('@')[0]}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col">
                    <span>{user.full_name || 'User'}</span>
                    <span className="text-xs font-normal text-muted-foreground">{user.email}</span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/subscription">
                    <CreditCard className="mr-2 h-4 w-4" />
                    Subscription
                    <span className="ml-auto rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary uppercase">
                      {user.subscription_tier || 'Free'}
                    </span>
                  </Link>
                </DropdownMenuItem>
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
          ) : (
            <>
              <Link href="/auth/login" className="hidden sm:block">
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </Link>
              <Link href="/auth/sign-up">
                <Button size="sm" className="hidden sm:flex">Sign up</Button>
              </Link>
            </>
          )}

          {/* Mobile Menu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                    <FileText className="h-4 w-4 text-primary-foreground" />
                  </div>
                  Mido PDF Tools
                </SheetTitle>
              </SheetHeader>
              <nav className="mt-6 flex flex-col gap-4">
                {user ? (
                  <div className="rounded-lg bg-muted p-3">
                    <p className="font-medium">{user.full_name || user.email}</p>
                    <p className="text-sm text-muted-foreground capitalize">
                      {user.subscription_tier || 'Free'} Plan
                    </p>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Link href="/auth/login" className="flex-1">
                      <Button variant="outline" className="w-full" onClick={() => setMobileOpen(false)}>
                        Login
                      </Button>
                    </Link>
                    <Link href="/auth/sign-up" className="flex-1">
                      <Button className="w-full" onClick={() => setMobileOpen(false)}>
                        Sign up
                      </Button>
                    </Link>
                  </div>
                )}

                <div className="border-t pt-4">
                  <p className="mb-2 text-sm font-medium text-muted-foreground">Popular Tools</p>
                  <div className="space-y-1">
                    {['merge', 'split', 'compress', 'jpg-to-pdf', 'pdf-to-word'].map(toolId => {
                      const tool = PDF_TOOLS.find(t => t.id === toolId)
                      if (!tool) return null
                      return (
                        <Link
                          key={tool.id}
                          href={tool.path}
                          onClick={() => setMobileOpen(false)}
                          className="flex items-center justify-between rounded-md px-3 py-2 text-sm hover:bg-muted"
                        >
                          {tool.name}
                          {tool.isPremium && (
                            <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary">
                              PRO
                            </span>
                          )}
                        </Link>
                      )
                    })}
                  </div>
                </div>

                <Link
                  href="/tools"
                  onClick={() => setMobileOpen(false)}
                  className="text-center text-sm font-medium text-primary"
                >
                  View All Tools
                </Link>

                <div className="border-t pt-4">
                  <Link
                    href="/pricing"
                    onClick={() => setMobileOpen(false)}
                    className="block rounded-md px-3 py-2 text-sm hover:bg-muted"
                  >
                    Pricing
                  </Link>
                  <Link
                    href="/api-docs"
                    onClick={() => setMobileOpen(false)}
                    className="block rounded-md px-3 py-2 text-sm hover:bg-muted"
                  >
                    API Documentation
                  </Link>
                  <Link
                    href="/support"
                    onClick={() => setMobileOpen(false)}
                    className="block rounded-md px-3 py-2 text-sm hover:bg-muted"
                  >
                    Support
                  </Link>
                </div>

                {user && (
                  <div className="border-t pt-4">
                    <Link
                      href="/dashboard"
                      onClick={() => setMobileOpen(false)}
                      className="block rounded-md px-3 py-2 text-sm hover:bg-muted"
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/auth/logout"
                      onClick={() => setMobileOpen(false)}
                      className="block rounded-md px-3 py-2 text-sm text-destructive hover:bg-muted"
                    >
                      Log out
                    </Link>
                  </div>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
