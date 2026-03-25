'use client'

import Link from 'next/link'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Crown, ArrowLeft, Sparkles, CheckCircle } from 'lucide-react'
import type { PdfTool } from '@/lib/types'

interface PremiumToolPlaceholderProps {
  tool: PdfTool
  features: string[]
  comingSoon?: boolean
}

export function PremiumToolPlaceholder({ tool, features, comingSoon = false }: PremiumToolPlaceholderProps) {
  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <Link
            href="/tools"
            className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to all tools
          </Link>

          <div className="mb-8">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold sm:text-3xl">{tool.name}</h1>
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                <Crown className="mr-1 h-3 w-3" />
                PRO
              </Badge>
            </div>
            <p className="mt-2 text-muted-foreground">{tool.description}</p>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Card className="border-primary/20">
                <CardContent className="p-8 text-center">
                  <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                    {comingSoon ? (
                      <Sparkles className="h-10 w-10 text-primary" />
                    ) : (
                      <Crown className="h-10 w-10 text-primary" />
                    )}
                  </div>
                  
                  <h2 className="text-2xl font-bold mb-2">
                    {comingSoon ? 'Coming Soon' : 'Premium Feature'}
                  </h2>
                  
                  <p className="text-muted-foreground max-w-md mx-auto mb-6">
                    {comingSoon 
                      ? `${tool.name} is currently in development and will be available soon for premium subscribers.`
                      : `Unlock ${tool.name} and all other premium features by upgrading your plan.`
                    }
                  </p>

                  <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                    <Link href="/pricing">
                      <Button size="lg">
                        <Crown className="mr-2 h-4 w-4" />
                        {comingSoon ? 'View Pricing' : 'Upgrade Now'}
                      </Button>
                    </Link>
                    <Link href="/tools">
                      <Button variant="outline" size="lg">
                        Browse Free Tools
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Features</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {features.map((feature, index) => (
                      <li key={index} className="flex gap-3 text-sm">
                        <CheckCircle className="h-5 w-5 shrink-0 text-primary" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Premium Benefits</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground space-y-2">
                  <p>Unlimited file processing</p>
                  <p>Larger file size limits (up to 100MB)</p>
                  <p>Priority processing speed</p>
                  <p>Access to all premium tools</p>
                  <p>No watermarks on output</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
