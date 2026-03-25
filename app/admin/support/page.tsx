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
import { Ticket, MessageSquare, AlertTriangle, CheckCircle } from 'lucide-react'
import Link from 'next/link'

async function getTickets(status?: string) {
  const supabase = await createClient()
  
  let query = supabase
    .from('support_tickets')
    .select(`
      *,
      profiles:user_id (full_name, email)
    `)
    .order('created_at', { ascending: false })
    .limit(50)

  if (status) {
    query = query.eq('status', status)
  }

  const { data } = await query
  return data || []
}

export default async function SupportPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>
}) {
  const { status } = await searchParams
  const tickets = await getTickets(status)

  const priorityColors: Record<string, string> = {
    low: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
    medium: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    high: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
    urgent: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  }

  const statusIcons: Record<string, typeof Ticket> = {
    open: AlertTriangle,
    'in-progress': MessageSquare,
    resolved: CheckCircle,
    closed: CheckCircle,
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Ticket className="h-8 w-8" />
          Support Tickets
        </h1>
        <p className="text-muted-foreground">Manage customer support requests</p>
      </div>

      <div className="flex gap-2 mb-6">
        <Button variant={!status ? 'default' : 'outline'} asChild>
          <a href="/admin/support">All</a>
        </Button>
        <Button variant={status === 'open' ? 'default' : 'outline'} asChild>
          <a href="/admin/support?status=open">Open</a>
        </Button>
        <Button variant={status === 'in-progress' ? 'default' : 'outline'} asChild>
          <a href="/admin/support?status=in-progress">In Progress</a>
        </Button>
        <Button variant={status === 'resolved' ? 'default' : 'outline'} asChild>
          <a href="/admin/support?status=resolved">Resolved</a>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tickets ({tickets.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Subject</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tickets.map((ticket) => {
                const StatusIcon = statusIcons[ticket.status] || Ticket
                return (
                  <TableRow key={ticket.id}>
                    <TableCell>
                      <div className="max-w-xs">
                        <p className="font-medium truncate">{ticket.subject}</p>
                        <p className="text-sm text-muted-foreground truncate">
                          {ticket.message?.slice(0, 50)}...
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{(ticket.profiles as { full_name?: string })?.full_name || 'Unknown'}</p>
                        <p className="text-sm text-muted-foreground">{(ticket.profiles as { email?: string })?.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded text-xs font-medium capitalize ${priorityColors[ticket.priority] || ''}`}>
                        {ticket.priority}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {ticket.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(ticket.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Link href={`/admin/support/${ticket.id}`}>
                        <Button size="sm" variant="outline">
                          <MessageSquare className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                )
              })}
              {tickets.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No tickets found
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
