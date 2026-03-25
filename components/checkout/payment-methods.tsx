'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CreditCard, Smartphone, Bitcoin, Copy, Check } from 'lucide-react'
import StripeCheckout from './stripe-checkout'
import { PRODUCTS } from '@/lib/products'

interface PaymentMethodsProps {
  productId: string
}

export default function PaymentMethods({ productId }: PaymentMethodsProps) {
  const [copied, setCopied] = useState(false)
  const [vodafoneNumber, setVodafoneNumber] = useState('')
  const [transactionId, setTransactionId] = useState('')
  const [submitting, setSubmitting] = useState(false)
  
  const product = PRODUCTS.find(p => p.id === productId)
  const price = product ? product.priceInCents / 100 : 0
  
  // Binance wallet address (example - replace with actual)
  const binanceWallet = '0x1234567890abcdef1234567890abcdef12345678'
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleAlternativePayment = async (method: 'binance' | 'vodafone') => {
    setSubmitting(true)
    // This would submit to a verification queue for manual approval
    // In production, you'd integrate with Binance Pay API or Vodafone Cash API
    try {
      const response = await fetch('/api/payments/alternative', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          method,
          productId,
          transactionId,
          vodafoneNumber: method === 'vodafone' ? vodafoneNumber : undefined,
        }),
      })
      
      if (response.ok) {
        alert('Payment submitted for verification. You will receive an email once confirmed.')
      }
    } catch (error) {
      alert('Failed to submit payment. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Tabs defaultValue="stripe" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="stripe" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            <span className="hidden sm:inline">Card</span>
          </TabsTrigger>
          <TabsTrigger value="binance" className="flex items-center gap-2">
            <Bitcoin className="h-4 w-4" />
            <span className="hidden sm:inline">Crypto</span>
          </TabsTrigger>
          <TabsTrigger value="vodafone" className="flex items-center gap-2">
            <Smartphone className="h-4 w-4" />
            <span className="hidden sm:inline">Vodafone</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="stripe" className="mt-6">
          <StripeCheckout productId={productId} productName={product?.name || 'Subscription'} />
        </TabsContent>

        <TabsContent value="binance" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bitcoin className="h-5 w-5 text-yellow-500" />
                Pay with Binance
              </CardTitle>
              <CardDescription>
                Send USDT (TRC20) or BNB to the address below
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="rounded-lg bg-muted p-4">
                <p className="text-2xl font-bold text-center text-primary">
                  ${price.toFixed(2)} USDT
                </p>
              </div>
              
              <div className="space-y-2">
                <Label>Wallet Address (USDT TRC20)</Label>
                <div className="flex gap-2">
                  <Input value={binanceWallet} readOnly className="font-mono text-sm" />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(binanceWallet)}
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="binance-tx">Transaction ID</Label>
                <Input
                  id="binance-tx"
                  placeholder="Enter your transaction hash"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                />
              </div>

              <Button 
                className="w-full" 
                onClick={() => handleAlternativePayment('binance')}
                disabled={!transactionId || submitting}
              >
                {submitting ? 'Submitting...' : 'Submit for Verification'}
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                Payments are verified within 1-24 hours. You will receive an email confirmation.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vodafone" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="h-5 w-5 text-red-500" />
                Vodafone Cash (Egypt)
              </CardTitle>
              <CardDescription>
                Send payment via Vodafone Cash mobile wallet
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="rounded-lg bg-muted p-4">
                <p className="text-2xl font-bold text-center text-primary">
                  {(price * 50).toFixed(0)} EGP
                </p>
                <p className="text-sm text-muted-foreground text-center mt-1">
                  (approximately ${price.toFixed(2)} USD)
                </p>
              </div>

              <div className="space-y-2">
                <Label>Send to Vodafone Number</Label>
                <div className="flex gap-2">
                  <Input value="01012345678" readOnly className="font-mono" />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard('01012345678')}
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="vf-number">Your Vodafone Number</Label>
                <Input
                  id="vf-number"
                  placeholder="01xxxxxxxxx"
                  value={vodafoneNumber}
                  onChange={(e) => setVodafoneNumber(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="vf-tx">Transaction Reference</Label>
                <Input
                  id="vf-tx"
                  placeholder="Enter the transaction reference from SMS"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                />
              </div>

              <Button 
                className="w-full bg-red-600 hover:bg-red-700" 
                onClick={() => handleAlternativePayment('vodafone')}
                disabled={!transactionId || !vodafoneNumber || submitting}
              >
                {submitting ? 'Submitting...' : 'Submit for Verification'}
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                Payments are verified within 1-24 hours. You will receive an email confirmation.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
