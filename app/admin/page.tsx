import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, CreditCard, FileText, TrendingUp, Ticket, Bot } from 'lucide-react'
import Link from 'next/link'

async function getStats() {
  const supabase = await createClient()
  
  const [
    { count: totalUsers },
    { count: premiumUsers },
    { count: totalOperations },
    { count: pendingTickets },
    { data: recentPayments },
    { data: todayOperations },
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('profiles').select('*', { count: 'exact', head: true }).neq('subscription_tier', 'free'),
    supabase.from('file_operations').select('*', { count: 'exact', head: true }),
    supabase.from('support_tickets').select('*', { count: 'exact', head: true }).eq('status', 'open'),
    supabase.from('payments').select('amount').eq('status', 'completed').limit(100),
    supabase.from('file_operations').select('*', { count: 'exact', head: true })
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()),
  ])

  const totalRevenue = recentPayments?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0

  return {
    totalUsers: totalUsers || 0,
    premiumUsers: premiumUsers || 0,
    totalOperations: totalOperations || 0,
    pendingTickets: pendingTickets || 0,
    totalRevenue,
    todayOperations: todayOperations?.length || 0,
  }
}

export default async function AdminDashboard() {
  const stats = await getStats()

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers.toLocaleString(),
      description: `${stats.premiumUsers} premium subscribers`,
      icon: Users,
      href: '/admin/users',
      color: 'text-blue-500',
    },
    {
      title: 'Total Revenue',
      value: `$${stats.totalRevenue.toFixed(2)}`,
      description: 'From all payments',
      icon: CreditCard,
      href: '/admin/payments',
      color: 'text-green-500',
    },
    {
      title: 'PDF Operations',
      value: stats.totalOperations.toLocaleString(),
      description: `${stats.todayOperations} today`,
      icon: FileText,
      href: '/admin/analytics',
      color: 'text-purple-500',
    },
    {
      title: 'Support Tickets',
      value: stats.pendingTickets.toString(),
      description: 'Pending tickets',
      icon: Ticket,
      href: '/admin/support',
      color: 'text-orange-500',
    },
  ]

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage your Mido PDF Tools platform</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <Link key={stat.title} href={stat.href}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">{stat.description}</p>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              AI Control Center
            </CardTitle>
            <CardDescription>
              Use natural language to control your platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link 
              href="/admin/ai-chat"
              className="inline-flex items-center gap-2 text-primary hover:underline"
            >
              Open AI Chat
              <TrendingUp className="h-4 w-4" />
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Quick Actions
            </CardTitle>
            <CardDescription>
              Common administrative tasks
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/admin/payments?status=pending" className="block text-sm text-primary hover:underline">
              Review pending payments
            </Link>
            <Link href="/admin/support?status=open" className="block text-sm text-primary hover:underline">
              View open support tickets
            </Link>
            <Link href="/admin/users?filter=new" className="block text-sm text-primary hover:underline">
              View new registrations
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
