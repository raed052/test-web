'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { FieldGroup, Field, FieldLabel } from '@/components/ui/field'
import { Spinner } from '@/components/ui/spinner'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { HelpCircle, MessageSquare, Clock, CheckCircle } from 'lucide-react'

export default function SupportPage() {
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [tickets, setTickets] = useState<any[]>([])
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [priority, setPriority] = useState('medium')

  useEffect(() => {
    loadTickets()
  }, [])

  async function loadTickets() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (user) {
      const { data } = await supabase
        .from('support_tickets')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      
      setTickets(data || [])
    }
    setLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!subject.trim() || !message.trim()) {
      toast.error('Please fill in all fields')
      return
    }

    setSubmitting(true)

    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) throw new Error('Not authenticated')

      const { error } = await supabase
        .from('support_tickets')
        .insert({
          user_id: user.id,
          email: user.email,
          subject,
          message,
          priority,
          status: 'open',
        })

      if (error) throw error
      
      toast.success('Support ticket submitted successfully')
      setSubject('')
      setMessage('')
      setPriority('medium')
      loadTickets()
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit ticket')
    } finally {
      setSubmitting(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-chart-4'
      case 'in_progress': return 'bg-primary'
      case 'resolved': return 'bg-chart-3'
      case 'closed': return 'bg-muted'
      default: return 'bg-muted'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-destructive'
      case 'high': return 'text-chart-4'
      case 'medium': return 'text-primary'
      case 'low': return 'text-muted-foreground'
      default: return 'text-muted-foreground'
    }
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Support</h1>
        <p className="mt-1 text-muted-foreground">
          Get help or submit a support request
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Submit Ticket */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Submit a Ticket
            </CardTitle>
            <CardDescription>
              Describe your issue and we'll get back to you
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <FieldGroup>
                <Field>
                  <FieldLabel>Subject</FieldLabel>
                  <Input
                    value={subject}
                    onChange={e => setSubject(e.target.value)}
                    placeholder="Brief description of your issue"
                  />
                </Field>
                <Field>
                  <FieldLabel>Priority</FieldLabel>
                  <Select value={priority} onValueChange={setPriority}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
                <Field>
                  <FieldLabel>Message</FieldLabel>
                  <Textarea
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    placeholder="Describe your issue in detail..."
                    rows={5}
                  />
                </Field>
              </FieldGroup>
              <Button type="submit" className="mt-4" disabled={submitting}>
                {submitting && <Spinner className="mr-2" />}
                Submit Ticket
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Tickets List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5" />
              Your Tickets
            </CardTitle>
            <CardDescription>
              Track the status of your support requests
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Spinner className="h-6 w-6" />
              </div>
            ) : tickets.length > 0 ? (
              <div className="space-y-3">
                {tickets.map(ticket => (
                  <div
                    key={ticket.id}
                    className="rounded-lg border p-4"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium">{ticket.subject}</p>
                        <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                          {ticket.message}
                        </p>
                      </div>
                      <Badge className={getStatusColor(ticket.status)}>
                        {ticket.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(ticket.created_at).toLocaleDateString()}
                      </span>
                      <span className={getPriorityColor(ticket.priority)}>
                        {ticket.priority} priority
                      </span>
                    </div>
                    {ticket.admin_response && (
                      <div className="mt-3 rounded-lg bg-muted p-3">
                        <p className="text-xs font-medium text-muted-foreground">Response:</p>
                        <p className="mt-1 text-sm">{ticket.admin_response}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center">
                <CheckCircle className="mx-auto h-12 w-12 text-muted-foreground/50" />
                <p className="mt-2 text-sm text-muted-foreground">
                  No support tickets yet
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* FAQ Section */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {[
              {
                q: 'How do I upgrade my subscription?',
                a: 'Go to the Subscription page in your dashboard and click "Upgrade Plan" to see available options.',
              },
              {
                q: 'What file size limits apply to my plan?',
                a: 'Free users can upload up to 5MB per file. Premium plans support up to 200MB.',
              },
              {
                q: 'How secure are my uploaded files?',
                a: 'All files are encrypted during transfer and automatically deleted after processing.',
              },
              {
                q: 'Can I cancel my subscription?',
                a: 'Yes, you can cancel anytime. Your access continues until the end of your billing period.',
              },
            ].map((faq, i) => (
              <div key={i} className="rounded-lg border p-4">
                <p className="font-medium">{faq.q}</p>
                <p className="mt-2 text-sm text-muted-foreground">{faq.a}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
