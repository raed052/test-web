'use client'

import { ReactNode } from 'react'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Crown } from 'lucide-react'
import type { PdfTool } from '@/lib/types'

interface ToolPageLayoutProps {
  tool: PdfTool
  children: ReactNode
  userTier?: string
  showUpgrade?: boolean
}

export function ToolPageLayout({
  tool,
  children,
  userTier = 'free',
  showUpgrade = false,
}: ToolPageLayoutProps) {
  const isPremiumLocked = tool.isPremium && userTier === 'free'

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Navigation */}
      <Link
        href="/tools"
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to all tools
      </Link>

      {/* Tool Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold sm:text-3xl">{tool.name}</h1>
          {tool.isPremium && (
            <Badge variant="secondary" className="bg-primary/10 text-primary">
              <Crown className="mr-1 h-3 w-3" />
              PRO
            </Badge>
          )}
        </div>
        <p className="mt-2 text-muted-foreground">{tool.description}</p>
      </div>

      {/* Premium Lock Overlay */}
      {isPremiumLocked ? (
        <div className="rounded-xl border bg-muted/50 p-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Crown className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-xl font-semibold">Premium Feature</h2>
          <p className="mx-auto mt-2 max-w-md text-muted-foreground">
            This tool is available for premium subscribers. Upgrade your plan to unlock {tool.name} and all other premium features.
          </p>
          <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link href="/pricing">
              <Button>
                <Crown className="mr-2 h-4 w-4" />
                Upgrade Now
              </Button>
            </Link>
            <Link href="/tools">
              <Button variant="outline">Browse Free Tools</Button>
            </Link>
          </div>
        </div>
      ) : (
        <>
          {/* Show upgrade banner for free users */}
          {showUpgrade && userTier === 'free' && (
            <div className="mb-6 flex items-center justify-between rounded-lg bg-primary/5 p-4">
              <div>
                <p className="font-medium">
                  Free tier: 2 files/day, 5MB max
                </p>
                <p className="text-sm text-muted-foreground">
                  Upgrade for unlimited files and larger sizes
                </p>
              </div>
              <Link href="/pricing">
                <Button size="sm" variant="outline">
                  Upgrade
                </Button>
              </Link>
            </div>
          )}
          {children}
        </>
      )}
    </div>
  )
}
