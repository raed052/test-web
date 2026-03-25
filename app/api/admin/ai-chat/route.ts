import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Simple command parser for admin AI chat
async function parseAndExecuteCommand(message: string, supabase: ReturnType<typeof createClient> extends Promise<infer T> ? T : never) {
  const lowerMessage = message.toLowerCase()

  // Statistics commands
  if (lowerMessage.includes('statistic') || lowerMessage.includes('stats') || lowerMessage.includes('today')) {
    const [
      { count: totalUsers },
      { count: premiumUsers },
      { count: todayOps },
      { data: recentPayments },
    ] = await Promise.all([
      supabase.from('profiles').select('*', { count: 'exact', head: true }),
      supabase.from('profiles').select('*', { count: 'exact', head: true }).neq('subscription_tier', 'free'),
      supabase.from('file_operations').select('*', { count: 'exact', head: true })
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()),
      supabase.from('payments').select('amount').eq('status', 'completed'),
    ])

    const revenue = recentPayments?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0

    return {
      message: `Here are today's statistics:\n\n- Total Users: ${totalUsers || 0}\n- Premium Users: ${premiumUsers || 0}\n- Operations Today: ${todayOps || 0}\n- Total Revenue: $${revenue.toFixed(2)}`,
      action: { type: 'fetch_stats', status: 'completed' as const },
    }
  }

  // Pending payments
  if (lowerMessage.includes('pending payment') || lowerMessage.includes('review payment')) {
    const { data: pendingPayments, count } = await supabase
      .from('payments')
      .select('*', { count: 'exact' })
      .eq('status', 'pending')
      .limit(10)

    if (!pendingPayments || pendingPayments.length === 0) {
      return {
        message: 'No pending payments found. All payments have been processed!',
        action: { type: 'list_payments', status: 'completed' as const },
      }
    }

    const paymentList = pendingPayments.map((p, i) => 
      `${i + 1}. ID: ${p.id.slice(0, 8)}... | $${p.amount} | ${p.payment_method} | ${new Date(p.created_at).toLocaleDateString()}`
    ).join('\n')

    return {
      message: `Found ${count} pending payment(s):\n\n${paymentList}\n\nTo approve a payment, say "Approve payment [ID]"`,
      action: { type: 'list_payments', status: 'completed' as const },
    }
  }

  // Approve payment
  if (lowerMessage.includes('approve payment')) {
    const idMatch = message.match(/payment\s+#?([a-f0-9-]+)/i)
    if (idMatch) {
      const { error } = await supabase
        .from('payments')
        .update({ status: 'completed' })
        .eq('id', idMatch[1])

      if (error) {
        return {
          message: `Failed to approve payment: ${error.message}`,
          action: { type: 'approve_payment', status: 'failed' as const, details: error.message },
        }
      }

      return {
        message: `Payment ${idMatch[1]} has been approved successfully.`,
        action: { type: 'approve_payment', status: 'completed' as const },
      }
    }
  }

  // Support tickets
  if (lowerMessage.includes('support ticket') || lowerMessage.includes('open ticket')) {
    const { data: tickets, count } = await supabase
      .from('support_tickets')
      .select('*', { count: 'exact' })
      .eq('status', 'open')
      .order('created_at', { ascending: false })
      .limit(10)

    if (!tickets || tickets.length === 0) {
      return {
        message: 'No open support tickets. Great job keeping up!',
        action: { type: 'list_tickets', status: 'completed' as const },
      }
    }

    const ticketList = tickets.map((t, i) => 
      `${i + 1}. [${t.priority}] ${t.subject}\n   Created: ${new Date(t.created_at).toLocaleDateString()}`
    ).join('\n\n')

    return {
      message: `Found ${count} open ticket(s):\n\n${ticketList}`,
      action: { type: 'list_tickets', status: 'completed' as const },
    }
  }

  // New users
  if (lowerMessage.includes('new user') || lowerMessage.includes('sign up') || lowerMessage.includes('registration')) {
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
    const { count } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', weekAgo)

    return {
      message: `${count || 0} new users have signed up in the past week.`,
      action: { type: 'count_users', status: 'completed' as const },
    }
  }

  // Default response
  return {
    message: `I understand you want to: "${message}"\n\nI can help you with:\n- View statistics ("Show me today's stats")\n- List pending payments ("Show pending payments")\n- Approve payments ("Approve payment #ID")\n- View support tickets ("Show open tickets")\n- Count new users ("How many new users this week?")\n\nPlease try one of these commands.`,
  }
}

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single()

    if (!profile?.is_admin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const { message } = await req.json()

    if (!message) {
      return NextResponse.json({ error: 'Message required' }, { status: 400 })
    }

    // Log the chat
    await supabase.from('admin_chat_logs').insert({
      admin_id: user.id,
      message,
    })

    // Parse and execute command
    const result = await parseAndExecuteCommand(message, supabase)

    // Log the response
    await supabase.from('admin_chat_logs').insert({
      admin_id: user.id,
      message: result.message,
      action_type: result.action?.type,
      action_result: result.action ? JSON.stringify(result.action) : null,
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('AI Chat error:', error)
    return NextResponse.json({ 
      message: 'An error occurred processing your request.',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
