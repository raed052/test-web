import type { SubscriptionPlan, SubscriptionTier } from './types'

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    period: 'forever',
    features: [
      'Access to all PDF tools',
      '2 files per day',
      'Max 5MB file size',
      'Basic support',
    ],
    limits: {
      filesPerDay: 2,
      maxFileSize: 5,
      aiFeatures: false,
      batchProcessing: false,
      apiAccess: false,
      prioritySupport: false,
    },
  },
  {
    id: 'weekly',
    name: 'Weekly',
    price: 1,
    period: 'week',
    features: [
      'Unlimited PDF tools',
      '50 files per day',
      'Max 50MB file size',
      'AI features included',
      'Email support',
    ],
    limits: {
      filesPerDay: 50,
      maxFileSize: 50,
      aiFeatures: true,
      batchProcessing: true,
      apiAccess: false,
      prioritySupport: false,
    },
  },
  {
    id: 'monthly',
    name: 'Monthly',
    price: 4,
    period: 'month',
    features: [
      'Unlimited PDF tools',
      '200 files per day',
      'Max 100MB file size',
      'AI features included',
      'Batch processing',
      'Priority support',
    ],
    limits: {
      filesPerDay: 200,
      maxFileSize: 100,
      aiFeatures: true,
      batchProcessing: true,
      apiAccess: false,
      prioritySupport: true,
    },
  },
  {
    id: 'yearly',
    name: 'Yearly',
    price: 30,
    period: 'year',
    features: [
      'Unlimited PDF tools',
      'Unlimited files per day',
      'Max 200MB file size',
      'AI features included',
      'Batch processing',
      'API access',
      'Priority support',
      '2 months free!',
    ],
    limits: {
      filesPerDay: -1, // unlimited
      maxFileSize: 200,
      aiFeatures: true,
      batchProcessing: true,
      apiAccess: true,
      prioritySupport: true,
    },
  },
]

export function getPlanById(id: SubscriptionTier): SubscriptionPlan | undefined {
  return SUBSCRIPTION_PLANS.find(plan => plan.id === id)
}

export function canUserPerformOperation(
  tier: SubscriptionTier,
  dailyCount: number,
  fileSize: number
): { allowed: boolean; reason?: string } {
  const plan = getPlanById(tier)
  if (!plan) return { allowed: false, reason: 'Invalid subscription tier' }

  // Check daily limit (unlimited = -1)
  if (plan.limits.filesPerDay !== -1 && dailyCount >= plan.limits.filesPerDay) {
    return { 
      allowed: false, 
      reason: `Daily limit reached (${plan.limits.filesPerDay} files). Upgrade to process more files.` 
    }
  }

  // Check file size (in MB)
  const fileSizeMB = fileSize / (1024 * 1024)
  if (fileSizeMB > plan.limits.maxFileSize) {
    return { 
      allowed: false, 
      reason: `File too large (max ${plan.limits.maxFileSize}MB). Upgrade for larger files.` 
    }
  }

  return { allowed: true }
}

export function canUseAiFeatures(tier: SubscriptionTier): boolean {
  const plan = getPlanById(tier)
  return plan?.limits.aiFeatures ?? false
}

export function canUseBatchProcessing(tier: SubscriptionTier): boolean {
  const plan = getPlanById(tier)
  return plan?.limits.batchProcessing ?? false
}

export function canUseApi(tier: SubscriptionTier): boolean {
  const plan = getPlanById(tier)
  return plan?.limits.apiAccess ?? false
}

// Stripe product IDs for subscriptions
export const STRIPE_PRODUCTS = {
  weekly: {
    id: 'mido-pdf-weekly',
    name: 'Mido PDF Tools - Weekly',
    description: 'Weekly subscription to Mido PDF Tools',
    priceInCents: 100, // $1
  },
  monthly: {
    id: 'mido-pdf-monthly',
    name: 'Mido PDF Tools - Monthly',
    description: 'Monthly subscription to Mido PDF Tools',
    priceInCents: 400, // $4
  },
  yearly: {
    id: 'mido-pdf-yearly',
    name: 'Mido PDF Tools - Yearly',
    description: 'Yearly subscription to Mido PDF Tools',
    priceInCents: 3000, // $30
  },
}
