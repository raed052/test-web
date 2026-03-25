import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { DashboardSidebar } from '@/components/dashboard/sidebar'
import { DashboardHeader } from '@/components/dashboard/header'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar
        user={{
          email: user.email || '',
          full_name: profile?.full_name || null,
          subscription_tier: profile?.subscription_tier || 'free',
          is_admin: profile?.is_admin || false,
        }}
      />
      <div className="flex flex-1 flex-col lg:pl-64">
        <DashboardHeader
          user={{
            email: user.email || '',
            full_name: profile?.full_name || null,
            avatar_url: profile?.avatar_url || null,
          }}
        />
        <main className="flex-1 bg-muted/30">
          {children}
        </main>
      </div>
    </div>
  )
}
