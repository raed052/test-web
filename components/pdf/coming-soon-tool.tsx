'use client'

import Link from 'next/link'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Clock, Bell, CheckCircle } from 'lucide-react'
import type { PdfTool } from '@/lib/types'

interface ComingSoonToolProps {
  tool: PdfTool
  features: string[]
  reason?: string
}

export function ComingSoonTool({ tool, features, reason }: ComingSoonToolProps) {
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
              <Badge variant="outline">
                <Clock className="mr-1 h-3 w-3" />
                Coming Soon
              </Badge>
            </div>
            <p className="mt-2 text-muted-foreground">{tool.description}</p>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Card className="border-muted">
                <CardContent className="p-8 text-center">
                  <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                    <Clock className="h-10 w-10 text-muted-foreground" />
                  </div>
                  
                  <h2 className="text-2xl font-bold mb-2">Coming Soon</h2>
                  
                  <p className="text-muted-foreground max-w-md mx-auto mb-4">
                    {tool.name} is currently in development and will be available soon.
                  </p>

                  {reason && (
                    <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6 bg-muted p-3 rounded-lg">
                      {reason}
                    </p>
                  )}

                  <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                    <Button size="lg" variant="outline" disabled>
                      <Bell className="mr-2 h-4 w-4" />
                      Notify Me (Coming Soon)
                    </Button>
                    <Link href="/tools">
                      <Button variant="ghost" size="lg">
                        Browse Available Tools
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Planned Features</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {features.map((feature, index) => (
                      <li key={index} className="flex gap-3 text-sm">
                        <CheckCircle className="h-5 w-5 shrink-0 text-muted-foreground" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Try These Instead</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Link href="/tools/merge" className="block text-sm text-primary hover:underline">
                    Merge PDF
                  </Link>
                  <Link href="/tools/split" className="block text-sm text-primary hover:underline">
                    Split PDF
                  </Link>
                  <Link href="/tools/compress" className="block text-sm text-primary hover:underline">
                    Compress PDF
                  </Link>
                  <Link href="/tools/rotate" className="block text-sm text-primary hover:underline">
                    Rotate PDF
                  </Link>
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
