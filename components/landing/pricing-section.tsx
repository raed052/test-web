'use client'

import Link from 'next/link'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { SUBSCRIPTION_PLANS } from '@/lib/subscriptions'
import { Check, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

export function PricingSection() {
  return (
    <section className="bg-muted/30 py-20 lg:py-28">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <Badge variant="secondary" className="mb-4">
            <Sparkles className="mr-2 h-3.5 w-3.5 text-primary" />
            Simple Pricing
          </Badge>
          <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
            Choose Your Plan
          </h2>
          <p className="mt-4 text-pretty text-muted-foreground">
            Start for free, upgrade when you need more. All plans include access to every PDF tool.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2 lg:grid-cols-4">
          {SUBSCRIPTION_PLANS.map((plan, index) => {
            const isPopular = plan.id === 'monthly'
            const isBestValue = plan.id === 'yearly'

            return (
              <Card
                key={plan.id}
                className={cn(
                  'relative flex flex-col',
                  isPopular && 'border-primary shadow-lg',
                  isBestValue && 'border-accent'
                )}
              >
                {/* Popular/Best Value Badge */}
                {(isPopular || isBestValue) && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge
                      className={cn(
                        'px-3',
                        isPopular ? 'bg-primary text-primary-foreground' : 'bg-accent text-accent-foreground'
                      )}
                    >
                      {isPopular ? 'Most Popular' : 'Best Value'}
                    </Badge>
                  </div>
                )}

                <CardHeader className="pb-4 pt-6">
                  <h3 className="text-lg font-semibold">{plan.name}</h3>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-4xl font-bold">
                      ${plan.price}
                    </span>
                    {plan.price > 0 && (
                      <span className="text-muted-foreground">
                        /{plan.period}
                      </span>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="flex-1">
                  <ul className="space-y-3">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>

                <CardFooter className="pt-4">
                  <Link href={plan.id === 'free' ? '/auth/sign-up' : `/checkout/${plan.id}`} className="w-full">
                    <Button
                      className="w-full"
                      variant={isPopular ? 'default' : 'outline'}
                    >
                      {plan.id === 'free' ? 'Get Started' : 'Subscribe'}
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            )
          })}
        </div>

        {/* Payment Methods */}
        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            We accept multiple payment methods
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-6 text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="h-8 w-12 rounded bg-muted flex items-center justify-center text-xs font-medium">
                Stripe
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-8 w-12 rounded bg-muted flex items-center justify-center text-xs font-medium">
                Binance
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-8 w-14 rounded bg-muted flex items-center justify-center text-xs font-medium">
                Vodafone
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
