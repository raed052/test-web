import type { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { getPlanById } from '@/lib/subscriptions'
import { PDF_TOOLS } from '@/lib/pdf-tools'
import {
  FileText,
  Crown,
  History,
  TrendingUp,
  ArrowRight,
  Zap,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Manage your Mido PDF Tools account',
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user?.id)
    .single()

  const { data: recentOperations } = await supabase
    .from('file_operations')
    .select('*')
    .eq('user_id', user?.id)
    .order('created_at', { ascending: false })
    .limit(5)

  const plan = getPlanById(profile?.subscription_tier || 'free')
  const dailyLimit = plan?.limits.filesPerDay || 2
  const dailyUsed = profile?.daily_operations_count || 0
  const usagePercent = dailyLimit === -1 ? 0 : Math.min((dailyUsed / dailyLimit) * 100, 100)

  // Popular tools
  const popularTools = PDF_TOOLS.filter(t => ['merge', 'split', 'compress', 'jpg-to-pdf'].includes(t.id))

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Welcome back, {profile?.full_name?.split(' ')[0] || 'there'}!
        </h1>
        <p className="mt-1 text-muted-foreground">
          Here's an overview of your account and recent activity.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Daily Usage</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dailyUsed} / {dailyLimit === -1 ? 'Unlimited' : dailyLimit}
            </div>
            <Progress value={usagePercent} className="mt-2 h-2" />
            <p className="mt-1 text-xs text-muted-foreground">
              Files processed today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Current Plan</CardTitle>
            <Crown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold capitalize">{profile?.subscription_tier}</span>
              {profile?.subscription_tier !== 'free' && (
                <Badge variant="secondary" className="bg-primary/10 text-primary">Active</Badge>
              )}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {profile?.subscription_tier === 'free' ? (
                <Link href="/pricing" className="text-primary hover:underline">
                  Upgrade for more features
                </Link>
              ) : (
                `Renews ${profile?.subscription_expires_at ? new Date(profile.subscription_expires_at).toLocaleDateString() : 'soon'}`
              )}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Operations</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recentOperations?.length || 0}</div>
            <p className="mt-1 text-xs text-muted-foreground">All time processed files</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Available Tools</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{PDF_TOOLS.length}</div>
            <p className="mt-1 text-xs text-muted-foreground">
              {profile?.subscription_tier === 'free' ? 'Free tier access' : 'Full access'}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Start processing your PDFs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2">
              {popularTools.map(tool => (
                <Link key={tool.id} href={tool.path}>
                  <div className="flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-muted">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{tool.name}</p>
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {tool.description}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <Link href="/tools">
              <Button variant="outline" className="mt-4 w-full">
                View All Tools
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest file operations</CardDescription>
          </CardHeader>
          <CardContent>
            {recentOperations && recentOperations.length > 0 ? (
              <div className="space-y-3">
                {recentOperations.map((op: any) => (
                  <div
                    key={op.id}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded bg-muted">
                        <History className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-medium capitalize">
                          {op.operation_type.replace(/-/g, ' ')}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(op.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant={op.status === 'completed' ? 'default' : 'secondary'}
                      className={op.status === 'completed' ? 'bg-chart-3' : ''}
                    >
                      {op.status}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center">
                <History className="mx-auto h-12 w-12 text-muted-foreground/50" />
                <p className="mt-2 text-sm text-muted-foreground">
                  No recent activity
                </p>
                <Link href="/tools">
                  <Button variant="link" className="mt-2">
                    Start processing PDFs
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
