import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { PRODUCTS } from '@/lib/products'

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { method, productId, transactionId, vodafoneNumber } = body

    if (!method || !productId || !transactionId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const product = PRODUCTS.find(p => p.id === productId)
    if (!product) {
      return NextResponse.json({ error: 'Invalid product' }, { status: 400 })
    }

    // Record the payment as pending for manual verification
    const { error } = await supabase
      .from('payments')
      .insert({
        user_id: user.id,
        amount: product.priceInCents / 100,
        currency: 'usd',
        payment_method: method,
        status: 'pending',
        metadata: {
          transaction_id: transactionId,
          vodafone_number: vodafoneNumber,
          product_id: productId,
          product_name: product.name,
        },
      })

    if (error) {
      console.error('Failed to record payment:', error)
      return NextResponse.json({ error: 'Failed to submit payment' }, { status: 500 })
    }

    // In a real app, you'd also:
    // 1. Send notification to admin for manual verification
    // 2. Send confirmation email to user
    // 3. Integrate with actual payment APIs for automatic verification

    return NextResponse.json({ 
      success: true,
      message: 'Payment submitted for verification' 
    })
  } catch (error) {
    console.error('Payment submission error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
