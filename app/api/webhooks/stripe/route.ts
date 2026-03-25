import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia',
})

// Use service role key for admin operations
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

export async function POST(req: Request) {
  const body = await req.text()
  const headersList = await headers()
  const signature = headersList.get('stripe-signature')

  if (!signature || !webhookSecret) {
    return NextResponse.json({ error: 'Missing signature or webhook secret' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const userId = session.metadata?.user_id
        const productId = session.metadata?.product_id

        if (userId && productId) {
          // Determine subscription tier and dates
          let tier: 'weekly' | 'monthly' | 'yearly' = 'monthly'
          let expiresAt = new Date()

          if (productId.includes('weekly')) {
            tier = 'weekly'
            expiresAt.setDate(expiresAt.getDate() + 7)
          } else if (productId.includes('yearly')) {
            tier = 'yearly'
            expiresAt.setFullYear(expiresAt.getFullYear() + 1)
          } else {
            tier = 'monthly'
            expiresAt.setMonth(expiresAt.getMonth() + 1)
          }

          // Update user profile
          await supabaseAdmin
            .from('profiles')
            .update({
              subscription_tier: tier,
              subscription_expires_at: expiresAt.toISOString(),
            })
            .eq('id', userId)

          // Record payment
          await supabaseAdmin
            .from('payments')
            .insert({
              user_id: userId,
              amount: (session.amount_total || 0) / 100,
              currency: session.currency || 'usd',
              payment_method: 'stripe',
              status: 'completed',
              stripe_session_id: session.id,
            })
        }
        break
      }

      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        // Handle subscription updates/cancellations
        // You would look up the user by their Stripe customer ID
        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Error processing webhook:', error)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}
