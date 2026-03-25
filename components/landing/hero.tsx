'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Sparkles, Shield, Zap } from 'lucide-react'

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background to-muted/30 py-20 lg:py-32">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/4 top-1/4 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute right-1/4 bottom-1/4 h-72 w-72 rounded-full bg-accent/5 blur-3xl" />
      </div>

      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <Badge variant="secondary" className="mb-6 px-4 py-1.5">
            <Sparkles className="mr-2 h-3.5 w-3.5 text-primary" />
            Now with AI-Powered PDF Intelligence
          </Badge>

          {/* Heading */}
          <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Every PDF Tool You Need,{' '}
            <span className="text-primary">All in One Place</span>
          </h1>

          {/* Subheading */}
          <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-muted-foreground sm:text-xl">
            Merge, split, compress, convert, edit, and protect your PDFs online for free.
            No installation required. Fast, secure, and incredibly easy to use.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/tools">
              <Button size="lg" className="h-12 px-8 text-base">
                Explore All Tools
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/pricing">
              <Button variant="outline" size="lg" className="h-12 px-8 text-base">
                View Pricing
              </Button>
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-accent" />
              <span>Secure & Private</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              <span>Lightning Fast</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-chart-5" />
              <span>AI-Powered</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
