export type SubscriptionTier = 'free' | 'weekly' | 'monthly' | 'yearly'

export interface Profile {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  subscription_tier: SubscriptionTier
  subscription_expires_at: string | null
  daily_operations_count: number
  last_operation_date: string | null
  is_admin: boolean
  created_at: string
  updated_at: string
}

export interface Payment {
  id: string
  user_id: string
  amount: number
  currency: string
  payment_method: 'stripe' | 'binance' | 'vodafone_cash'
  payment_status: 'pending' | 'completed' | 'failed' | 'refunded'
  subscription_tier: SubscriptionTier
  stripe_payment_id: string | null
  binance_order_id: string | null
  vodafone_phone: string | null
  vodafone_transaction_id: string | null
  created_at: string
}

export interface FileOperation {
  id: string
  user_id: string | null
  operation_type: string
  file_name: string
  file_size: number
  status: 'processing' | 'completed' | 'failed'
  result_url: string | null
  error_message: string | null
  created_at: string
}

export interface SupportTicket {
  id: string
  user_id: string | null
  email: string
  subject: string
  message: string
  status: 'open' | 'in_progress' | 'resolved' | 'closed'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  admin_response: string | null
  created_at: string
  updated_at: string
}

export interface ApiKey {
  id: string
  user_id: string
  key_hash: string
  name: string
  is_active: boolean
  last_used_at: string | null
  requests_count: number
  created_at: string
}

export interface PdfTool {
  id: string
  name: string
  description: string
  icon: string
  category: 'organize' | 'optimize' | 'convert-to' | 'convert-from' | 'edit' | 'security' | 'ai'
  path: string
  isPremium: boolean
}

export interface SubscriptionPlan {
  id: SubscriptionTier
  name: string
  price: number
  period: string
  features: string[]
  limits: {
    filesPerDay: number
    maxFileSize: number // in MB
    aiFeatures: boolean
    batchProcessing: boolean
    apiAccess: boolean
    prioritySupport: boolean
  }
}
