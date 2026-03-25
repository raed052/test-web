import type { Metadata } from 'next'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { ToolsGrid } from '@/components/landing/tools-grid'
import { createClient } from '@/lib/supabase/server'

export const metadata: Metadata = {
  title: 'All PDF Tools',
  description: 'Browse all available PDF tools - merge, split, compress, convert, edit, protect, and more.',
}

export default async function ToolsPage() {
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
        <div className="container mx-auto px-4 py-12">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">All PDF Tools</h1>
            <p className="mt-2 text-muted-foreground">
              Choose from our comprehensive collection of PDF tools to handle any document task.
            </p>
          </div>
        </div>
        <ToolsGrid />
      </main>
      <Footer />
    </>
  )
}
