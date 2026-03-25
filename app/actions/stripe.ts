'use server'

import { stripe } from '@/lib/stripe'
import { PRODUCTS } from '@/lib/products'
import { createClient } from '@/lib/supabase/server'

export async function startCheckoutSession(productId: string) {
  const product = PRODUCTS.find((p) => p.id === productId)
  if (!product) {
    throw new Error(`Product with id "${productId}" not found`)
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    throw new Error('You must be logged in to subscribe')
  }

  // Create Checkout Sessions with subscription mode
  const session = await stripe.checkout.sessions.create({
    ui_mode: 'embedded',
    redirect_on_completion: 'never',
    customer_email: user.email,
    metadata: {
      user_id: user.id,
      product_id: productId,
    },
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: product.name,
            description: product.description,
          },
          unit_amount: product.priceInCents,
          recurring: product.interval ? {
            interval: product.interval,
            interval_count: 1,
          } : undefined,
        },
        quantity: 1,
      },
    ],
    mode: product.interval ? 'subscription' : 'payment',
  })

  return session.client_secret
}

export async function getPaymentHistory() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return []
  }

  const { data } = await supabase
    .from('payments')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return data || []
}
