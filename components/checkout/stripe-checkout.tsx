'use client'

import { useCallback, useState } from 'react'
import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider,
} from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { startCheckoutSession } from '@/app/actions/stripe'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface StripeCheckoutProps {
  productId: string
  productName: string
}

export default function StripeCheckout({ productId, productName }: StripeCheckoutProps) {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchClientSecret = useCallback(async () => {
    try {
      const clientSecret = await startCheckoutSession(productId)
      setLoading(false)
      return clientSecret
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start checkout')
      setLoading(false)
      throw err
    }
  }, [productId])

  if (error) {
    return (
      <Card className="border-destructive">
        <CardContent className="pt-6">
          <p className="text-destructive text-center">{error}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">Subscribe to {productName}</CardTitle>
      </CardHeader>
      <CardContent>
        {loading && (
          <div className="flex items-center justify-center py-8">
            <Spinner className="h-8 w-8" />
          </div>
        )}
        <div id="checkout">
          <EmbeddedCheckoutProvider
            stripe={stripePromise}
            options={{ fetchClientSecret }}
          >
            <EmbeddedCheckout />
          </EmbeddedCheckoutProvider>
        </div>
      </CardContent>
    </Card>
  )
}
