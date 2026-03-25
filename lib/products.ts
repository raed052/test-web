export interface Product {
  id: string
  name: string
  description: string
  priceInCents: number
  interval?: 'week' | 'month' | 'year'
  images?: string[]
}

// Subscription products - prices validated server-side
export const PRODUCTS: Product[] = [
  {
    id: 'weekly-subscription',
    name: 'Weekly Plan',
    description: 'Access all PDF tools with unlimited usage for 1 week',
    priceInCents: 100, // $1.00
    interval: 'week',
  },
  {
    id: 'monthly-subscription',
    name: 'Monthly Plan',
    description: 'Access all PDF tools with unlimited usage for 1 month',
    priceInCents: 400, // $4.00
    interval: 'month',
  },
  {
    id: 'yearly-subscription',
    name: 'Yearly Plan',
    description: 'Access all PDF tools with unlimited usage for 1 year - Save 37%',
    priceInCents: 3000, // $30.00
    interval: 'year',
  },
]

export function getProductById(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id)
}

export function getProductPrice(id: string): number {
  const product = getProductById(id)
  return product ? product.priceInCents / 100 : 0
}
