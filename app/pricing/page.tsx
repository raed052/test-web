import type { Metadata } from 'next'
import Link from 'next/link'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { SUBSCRIPTION_PLANS } from '@/lib/subscriptions'
import { Check, X, Sparkles, HelpCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/server'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

export const metadata: Metadata = {
  title: 'Pricing',
  description: 'Simple, transparent pricing for Mido PDF Tools. Start free, upgrade when you need more.',
}

const comparisonFeatures = [
  { name: 'PDF Tools Access', tooltip: 'Access to all PDF manipulation tools' },
  { name: 'Files Per Day', tooltip: 'Maximum number of files you can process daily' },
  { name: 'Max File Size', tooltip: 'Maximum size per uploaded file' },
  { name: 'AI Features', tooltip: 'Access to AI Summarize, Translate, and Chat' },
  { name: 'Batch Processing', tooltip: 'Process multiple files at once' },
  { name: 'API Access', tooltip: 'REST API for developer integration' },
  { name: 'Priority Support', tooltip: 'Faster response times from our support team' },
  { name: 'No Watermarks', tooltip: 'Clean output without any branding' },
]

const planValues: Record<string, (string | boolean)[]> = {
  free: ['All Tools', '2', '5 MB', false, false, false, false, false],
  weekly: ['All Tools', '50', '50 MB', true, true, false, false, true],
  monthly: ['All Tools', '200', '100 MB', true, true, false, true, true],
  yearly: ['All Tools', 'Unlimited', '200 MB', true, true, true, true, true],
}

export default async function PricingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let profile = null
  if (user) {
    const { data } = await supabase
      .from('profiles')
      .select('full_name, subscription_tier')
      .eq('id', user.id)
      .single()
    profile = data
  }

  const headerUser = user ? {
    email: user.email || '',
    full_name: profile?.full_name || undefined,
    subscription_tier: profile?.subscription_tier || 'free',
  } : null

  const currentTier = profile?.subscription_tier || 'free'

  return (
    <>
      <Header user={headerUser} />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-muted/30 py-16 lg:py-24">
          <div className="container mx-auto px-4 text-center">
            <Badge variant="secondary" className="mb-4">
              <Sparkles className="mr-2 h-3.5 w-3.5 text-primary" />
              Simple Pricing
            </Badge>
            <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl">
              Choose Your Plan
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-pretty text-muted-foreground">
              Start for free, upgrade when you need more. All plans include access to every PDF tool.
            </p>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2 lg:grid-cols-4">
              {SUBSCRIPTION_PLANS.map(plan => {
                const isPopular = plan.id === 'monthly'
                const isBestValue = plan.id === 'yearly'
                const isCurrent = plan.id === currentTier

                return (
                  <Card
                    key={plan.id}
                    className={cn(
                      'relative flex flex-col',
                      isPopular && 'border-primary shadow-lg',
                      isBestValue && 'border-accent',
                      isCurrent && 'ring-2 ring-primary'
                    )}
                  >
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
                        <span className="text-4xl font-bold">${plan.price}</span>
                        {plan.price > 0 && (
                          <span className="text-muted-foreground">/{plan.period}</span>
                        )}
                      </div>
                      {isCurrent && (
                        <Badge variant="outline" className="mt-2 w-fit">
                          Current Plan
                        </Badge>
                      )}
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
                      {isCurrent ? (
                        <Button className="w-full" variant="outline" disabled>
                          Current Plan
                        </Button>
                      ) : (
                        <Link
                          href={plan.id === 'free' ? '/auth/sign-up' : `/checkout/${plan.id}`}
                          className="w-full"
                        >
                          <Button className="w-full" variant={isPopular ? 'default' : 'outline'}>
                            {plan.id === 'free' ? 'Get Started' : 'Subscribe'}
                          </Button>
                        </Link>
                      )}
                    </CardFooter>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>

        {/* Comparison Table */}
        <section className="bg-muted/30 py-16">
          <div className="container mx-auto px-4">
            <h2 className="mb-8 text-center text-2xl font-bold">Compare Plans</h2>
            <div className="mx-auto max-w-4xl overflow-x-auto">
              <TooltipProvider>
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="p-4 text-left font-medium">Feature</th>
                      {SUBSCRIPTION_PLANS.map(plan => (
                        <th key={plan.id} className="p-4 text-center font-medium">
                          {plan.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonFeatures.map((feature, index) => (
                      <tr key={feature.name} className="border-b">
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            {feature.name}
                            <Tooltip>
                              <TooltipTrigger>
                                <HelpCircle className="h-4 w-4 text-muted-foreground" />
                              </TooltipTrigger>
                              <TooltipContent>{feature.tooltip}</TooltipContent>
                            </Tooltip>
                          </div>
                        </td>
                        {SUBSCRIPTION_PLANS.map(plan => {
                          const value = planValues[plan.id][index]
                          return (
                            <td key={plan.id} className="p-4 text-center">
                              {typeof value === 'boolean' ? (
                                value ? (
                                  <Check className="mx-auto h-5 w-5 text-primary" />
                                ) : (
                                  <X className="mx-auto h-5 w-5 text-muted-foreground/50" />
                                )
                              ) : (
                                <span className="text-sm">{value}</span>
                              )}
                            </td>
                          )
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </TooltipProvider>
            </div>
          </div>
        </section>

        {/* Payment Methods */}
        <section className="py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="mb-4 text-2xl font-bold">Multiple Payment Options</h2>
            <p className="mb-8 text-muted-foreground">
              We accept various payment methods for your convenience
            </p>
            <div className="flex flex-wrap items-center justify-center gap-8">
              <div className="flex flex-col items-center gap-2">
                <div className="flex h-16 w-24 items-center justify-center rounded-lg border bg-card">
                  <span className="font-semibold text-primary">Stripe</span>
                </div>
                <span className="text-xs text-muted-foreground">Cards, Apple Pay, Google Pay</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="flex h-16 w-24 items-center justify-center rounded-lg border bg-card">
                  <span className="font-semibold text-chart-4">Binance</span>
                </div>
                <span className="text-xs text-muted-foreground">Crypto Payments</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="flex h-16 w-24 items-center justify-center rounded-lg border bg-card">
                  <span className="font-semibold text-destructive">Vodafone</span>
                </div>
                <span className="text-xs text-muted-foreground">Cash (Egypt)</span>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="bg-muted/30 py-16">
          <div className="container mx-auto px-4">
            <h2 className="mb-8 text-center text-2xl font-bold">Frequently Asked Questions</h2>
            <div className="mx-auto grid max-w-3xl gap-6">
              {[
                {
                  q: 'Can I cancel my subscription anytime?',
                  a: 'Yes, you can cancel your subscription at any time. Your access will continue until the end of your billing period.',
                },
                {
                  q: 'What happens to my files after processing?',
                  a: 'Your files are automatically deleted from our servers after 1 hour. We never store or access your document contents.',
                },
                {
                  q: 'Can I switch between plans?',
                  a: 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.',
                },
                {
                  q: 'Do you offer refunds?',
                  a: 'We offer a 7-day money-back guarantee for all paid plans. Contact our support team for assistance.',
                },
              ].map((faq, i) => (
                <div key={i} className="rounded-lg border bg-card p-6">
                  <h3 className="font-semibold">{faq.q}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
