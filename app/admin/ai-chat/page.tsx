'use client'

import { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Bot, Send, User, Sparkles, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  action?: {
    type: string
    status: 'pending' | 'completed' | 'failed'
    details?: string
  }
}

const EXAMPLE_COMMANDS = [
  'Show me today\'s statistics',
  'List all pending payments',
  'How many new users signed up this week?',
  'Approve payment #12345',
  'Send announcement to all users',
  'Change pricing for monthly plan to $5',
  'View open support tickets',
  'Block user by email',
]

export default function AIControlPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m your AI assistant for managing Mido PDF Tools. I can help you with:\n\n- View and manage users\n- Review and approve payments\n- Handle support tickets\n- View analytics and statistics\n- Update site settings\n- Send announcements\n\nWhat would you like to do?',
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/admin/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      })

      const data = await response.json()

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.message || 'I processed your request.',
        timestamp: new Date(),
        action: data.action,
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error processing your request. Please try again.',
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleExampleClick = (example: string) => {
    setInput(example)
  }

  return (
    <div className="p-8 h-full flex flex-col">
      <div className="mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Bot className="h-8 w-8" />
          AI Control Center
        </h1>
        <p className="text-muted-foreground">
          Use natural language to manage your platform
        </p>
      </div>

      <div className="flex-1 grid gap-6 lg:grid-cols-4">
        <Card className="lg:col-span-3 flex flex-col">
          <CardHeader className="border-b">
            <CardTitle className="text-lg flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Chat with AI Assistant
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col p-0">
            <ScrollArea className="flex-1 p-4" ref={scrollRef}>
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      'flex gap-3',
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    )}
                  >
                    {message.role === 'assistant' && (
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                        <Bot className="h-5 w-5 text-primary-foreground" />
                      </div>
                    )}
                    <div
                      className={cn(
                        'max-w-[80%] rounded-lg px-4 py-2',
                        message.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      )}
                    >
                      <p className="whitespace-pre-wrap text-sm">{message.content}</p>
                      {message.action && (
                        <div className={cn(
                          'mt-2 text-xs px-2 py-1 rounded',
                          message.action.status === 'completed' ? 'bg-green-100 text-green-800' :
                          message.action.status === 'failed' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        )}>
                          {message.action.type}: {message.action.status}
                          {message.action.details && ` - ${message.action.details}`}
                        </div>
                      )}
                      <p className="text-xs opacity-50 mt-1">
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                    {message.role === 'user' && (
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                        <User className="h-5 w-5" />
                      </div>
                    )}
                  </div>
                ))}
                {isLoading && (
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                      <Bot className="h-5 w-5 text-primary-foreground animate-pulse" />
                    </div>
                    <div className="bg-muted rounded-lg px-4 py-2">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-foreground/50 rounded-full animate-bounce" />
                        <span className="w-2 h-2 bg-foreground/50 rounded-full animate-bounce [animation-delay:0.1s]" />
                        <span className="w-2 h-2 bg-foreground/50 rounded-full animate-bounce [animation-delay:0.2s]" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            <form onSubmit={handleSubmit} className="p-4 border-t flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a command or question..."
                disabled={isLoading}
                className="flex-1"
              />
              <Button type="submit" disabled={isLoading || !input.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Example Commands</CardTitle>
              <CardDescription>Click to use</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {EXAMPLE_COMMANDS.map((cmd, i) => (
                <button
                  key={i}
                  onClick={() => handleExampleClick(cmd)}
                  className="w-full text-left text-sm p-2 rounded hover:bg-muted transition-colors"
                >
                  {cmd}
                </button>
              ))}
            </CardContent>
          </Card>

          <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-950/20 dark:border-yellow-900">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2 text-yellow-800 dark:text-yellow-200">
                <AlertCircle className="h-4 w-4" />
                Important
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-yellow-700 dark:text-yellow-300">
                AI actions are logged and may affect live data. Review actions carefully before confirming.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
