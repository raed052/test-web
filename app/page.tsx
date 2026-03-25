import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Hero } from '@/components/landing/hero'
import { ToolsGrid } from '@/components/landing/tools-grid'
import { FeaturesSection } from '@/components/landing/features-section'
import { PricingSection } from '@/components/landing/pricing-section'
import { CtaSection } from '@/components/landing/cta-section'
import { createClient } from '@/lib/supabase/server'

export default async function HomePage() {
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

  return (
    <>
      <Header user={headerUser} />
      <main className="flex-1">
        <Hero />
        <ToolsGrid />
        <FeaturesSection />
        <PricingSection />
        <CtaSection />
      </main>
      <Footer />
    </>
  )
}
