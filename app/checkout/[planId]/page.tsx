import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import PaymentMethods from '@/components/checkout/payment-methods'
import { PRODUCTS } from '@/lib/products'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ planId: string }>
}) {
  const { planId } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect(`/auth/login?redirect=/checkout/${planId}`)
  }

  const product = PRODUCTS.find(p => p.id === planId)
  
  if (!product) {
    redirect('/pricing')
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container py-8 px-4">
        <Link 
          href="/pricing" 
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Pricing
        </Link>

        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Complete Your Subscription</h1>
            <p className="text-muted-foreground">
              You're subscribing to <span className="font-semibold text-foreground">{product.name}</span>
            </p>
          </div>

          <PaymentMethods productId={planId} />
        </div>
      </main>
      <Footer />
    </div>
  )
}
