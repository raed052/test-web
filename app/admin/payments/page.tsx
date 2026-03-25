import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { CreditCard, Check, X, Clock } from 'lucide-react'
import { revalidatePath } from 'next/cache'

async function getPayments(status?: string) {
  const supabase = await createClient()
  
  let query = supabase
    .from('payments')
    .select(`
      *,
      profiles:user_id (full_name, email)
    `)
    .order('created_at', { ascending: false })
    .limit(100)

  if (status) {
    query = query.eq('status', status)
  }

  const { data } = await query
  return data || []
}

async function approvePayment(formData: FormData) {
  'use server'
  const paymentId = formData.get('paymentId') as string
  const supabase = await createClient()
  
  const { data: payment } = await supabase
    .from('payments')
    .select('user_id, metadata')
    .eq('id', paymentId)
    .single()

  if (payment) {
    // Update payment status
    await supabase
      .from('payments')
      .update({ status: 'completed' })
      .eq('id', paymentId)

    // Update user subscription
    const productId = (payment.metadata as { product_id?: string })?.product_id || ''
    let tier: string = 'monthly'
    const expiresAt = new Date()

    if (productId.includes('weekly')) {
      tier = 'weekly'
      expiresAt.setDate(expiresAt.getDate() + 7)
    } else if (productId.includes('yearly')) {
      tier = 'yearly'
      expiresAt.setFullYear(expiresAt.getFullYear() + 1)
    } else {
      expiresAt.setMonth(expiresAt.getMonth() + 1)
    }

    await supabase
      .from('profiles')
      .update({
        subscription_tier: tier,
        subscription_expires_at: expiresAt.toISOString(),
      })
      .eq('id', payment.user_id)
  }

  revalidatePath('/admin/payments')
}

async function rejectPayment(formData: FormData) {
  'use server'
  const paymentId = formData.get('paymentId') as string
  const supabase = await createClient()
  
  await supabase
    .from('payments')
    .update({ status: 'failed' })
    .eq('id', paymentId)

  revalidatePath('/admin/payments')
}

export default async function PaymentsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>
}) {
  const { status } = await searchParams
  const payments = await getPayments(status)

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    completed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    failed: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <CreditCard className="h-8 w-8" />
          Payment Management
        </h1>
        <p className="text-muted-foreground">Review and manage all payments</p>
      </div>

      <div className="flex gap-2 mb-6">
        <Button variant={!status ? 'default' : 'outline'} asChild>
          <a href="/admin/payments">All</a>
        </Button>
        <Button variant={status === 'pending' ? 'default' : 'outline'} asChild>
          <a href="/admin/payments?status=pending">Pending</a>
        </Button>
        <Button variant={status === 'completed' ? 'default' : 'outline'} asChild>
          <a href="/admin/payments?status=completed">Completed</a>
        </Button>
        <Button variant={status === 'failed' ? 'default' : 'outline'} asChild>
          <a href="/admin/payments?status=failed">Failed</a>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payments ({payments.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{(payment.profiles as { full_name?: string })?.full_name || 'Unknown'}</p>
                      <p className="text-sm text-muted-foreground">{(payment.profiles as { email?: string })?.email}</p>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    ${payment.amount?.toFixed(2)} {payment.currency?.toUpperCase()}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {payment.payment_method}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${statusColors[payment.status] || ''}`}>
                      {payment.status === 'pending' && <Clock className="inline h-3 w-3 mr-1" />}
                      {payment.status === 'completed' && <Check className="inline h-3 w-3 mr-1" />}
                      {payment.status === 'failed' && <X className="inline h-3 w-3 mr-1" />}
                      {payment.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    {new Date(payment.created_at).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    {payment.status === 'pending' && (
                      <div className="flex gap-2">
                        <form action={approvePayment}>
                          <input type="hidden" name="paymentId" value={payment.id} />
                          <Button type="submit" size="sm" variant="default">
                            <Check className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                        </form>
                        <form action={rejectPayment}>
                          <input type="hidden" name="paymentId" value={payment.id} />
                          <Button type="submit" size="sm" variant="destructive">
                            <X className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </form>
                      </div>
                    )}
                    {payment.status !== 'pending' && (
                      <span className="text-sm text-muted-foreground">-</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {payments.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No payments found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
