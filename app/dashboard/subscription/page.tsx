import type { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { SUBSCRIPTION_PLANS, getPlanById } from '@/lib/subscriptions'
import { Check, Crown, CreditCard, Calendar, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Subscription',
  description: 'Manage your subscription plan',
}

export default async function SubscriptionPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('profiles')
    .select('subscription_tier, subscription_expires_at')
    .eq('id', user?.id)
    .single()

  const { data: payments } = await supabase
    .from('payments')
    .select('*')
    .eq('user_id', user?.id)
    .order('created_at', { ascending: false })
    .limit(5)

  const currentTier = profile?.subscription_tier || 'free'
  const currentPlan = getPlanById(currentTier)
  const isExpiringSoon = profile?.subscription_expires_at && 
    new Date(profile.subscription_expires_at) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Subscription</h1>
        <p className="mt-1 text-muted-foreground">
          Manage your subscription plan and billing
        </p>
      </div>

      {/* Current Plan */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-primary" />
            Current Plan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold capitalize">{currentTier}</span>
                {currentTier !== 'free' && (
                  <Badge className="bg-primary">Active</Badge>
                )}
              </div>
              {currentPlan && (
                <p className="mt-1 text-muted-foreground">
                  ${currentPlan.price}/{currentPlan.period === 'forever' ? '' : currentPlan.period}
                </p>
              )}
              {profile?.subscription_expires_at && currentTier !== 'free' && (
                <div className="mt-3 flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {isExpiringSoon ? (
                      <span className="text-warning">
                        Expires {new Date(profile.subscription_expires_at).toLocaleDateString()}
                      </span>
                    ) : (
                      <span>
                        Renews on {new Date(profile.subscription_expires_at).toLocaleDateString()}
                      </span>
                    )}
                  </span>
                </div>
              )}
            </div>
            <div className="flex flex-col gap-2 sm:items-end">
              {currentTier === 'free' ? (
                <Link href="/pricing">
                  <Button>
                    <Crown className="mr-2 h-4 w-4" />
                    Upgrade Plan
                  </Button>
                </Link>
              ) : (
                <>
                  <Link href="/pricing">
                    <Button variant="outline">Change Plan</Button>
                  </Link>
                  <Button variant="ghost" size="sm" className="text-destructive">
                    Cancel Subscription
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Plan Features */}
          {currentPlan && (
            <div className="mt-6 border-t pt-6">
              <h4 className="mb-3 text-sm font-medium">Your Plan Includes:</h4>
              <div className="grid gap-2 sm:grid-cols-2">
                {currentPlan.features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary" />
                    {feature}
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Expiring Warning */}
      {isExpiringSoon && (
        <div className="mb-8 flex items-center gap-3 rounded-lg border border-warning bg-warning/10 p-4">
          <AlertCircle className="h-5 w-5 text-warning" />
          <div>
            <p className="font-medium">Your subscription is expiring soon</p>
            <p className="text-sm text-muted-foreground">
              Renew now to keep your premium features
            </p>
          </div>
          <Button size="sm" className="ml-auto">
            Renew Now
          </Button>
        </div>
      )}

      {/* Available Plans */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Available Plans</CardTitle>
          <CardDescription>Choose the plan that works best for you</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {SUBSCRIPTION_PLANS.map(plan => {
              const isCurrent = plan.id === currentTier
              const isPopular = plan.id === 'monthly'

              return (
                <div
                  key={plan.id}
                  className={cn(
                    'relative rounded-lg border p-4',
                    isCurrent && 'border-primary bg-primary/5',
                    isPopular && !isCurrent && 'border-accent'
                  )}
                >
                  {isPopular && !isCurrent && (
                    <Badge className="absolute -top-2 left-1/2 -translate-x-1/2 bg-accent">
                      Popular
                    </Badge>
                  )}
                  <h4 className="font-semibold">{plan.name}</h4>
                  <div className="mt-2">
                    <span className="text-2xl font-bold">${plan.price}</span>
                    {plan.price > 0 && (
                      <span className="text-muted-foreground">/{plan.period}</span>
                    )}
                  </div>
                  <ul className="mt-4 space-y-2 text-sm">
                    {plan.features.slice(0, 3).map((feature, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <Check className="h-3 w-3 text-primary" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4">
                    {isCurrent ? (
                      <Button variant="outline" className="w-full" disabled>
                        Current Plan
                      </Button>
                    ) : (
                      <Link href={`/checkout/${plan.id}`}>
                        <Button
                          variant={isPopular ? 'default' : 'outline'}
                          className="w-full"
                        >
                          {plan.price === 0 ? 'Downgrade' : 'Upgrade'}
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Payment History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment History
          </CardTitle>
        </CardHeader>
        <CardContent>
          {payments && payments.length > 0 ? (
            <div className="space-y-3">
              {payments.map((payment: any) => (
                <div
                  key={payment.id}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div>
                    <p className="font-medium capitalize">
                      {payment.subscription_tier} Plan
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(payment.created_at).toLocaleDateString()} via{' '}
                      {payment.payment_method.replace('_', ' ')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${payment.amount}</p>
                    <Badge
                      variant={payment.payment_status === 'completed' ? 'default' : 'secondary'}
                      className={payment.payment_status === 'completed' ? 'bg-chart-3' : ''}
                    >
                      {payment.payment_status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center">
              <CreditCard className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <p className="mt-2 text-sm text-muted-foreground">
                No payment history yet
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
