'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { Settings, Save, DollarSign, Bell, Shield, Globe } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function AdminSettingsPage() {
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    // Save settings to database
    await new Promise(resolve => setTimeout(resolve, 1000))
    setSaving(false)
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Settings className="h-8 w-8" />
          Site Settings
        </h1>
        <p className="text-muted-foreground">Configure your Mido PDF Tools platform</p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="pricing">Pricing</TabsTrigger>
          <TabsTrigger value="limits">Limits</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                General Settings
              </CardTitle>
              <CardDescription>Basic site configuration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="siteName">Site Name</Label>
                  <Input id="siteName" defaultValue="Mido PDF Tools" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="siteUrl">Site URL</Label>
                  <Input id="siteUrl" defaultValue="https://midopdf.com" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Site Description</Label>
                <Textarea 
                  id="description" 
                  defaultValue="Free online PDF tools to merge, split, compress, convert PDFs and more."
                  rows={3}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Maintenance Mode</Label>
                  <p className="text-sm text-muted-foreground">Temporarily disable the site</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pricing">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Pricing Configuration
              </CardTitle>
              <CardDescription>Set subscription prices</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-3">
                <div className="space-y-2">
                  <Label>Weekly Plan ($)</Label>
                  <Input type="number" defaultValue="1.00" step="0.01" />
                </div>
                <div className="space-y-2">
                  <Label>Monthly Plan ($)</Label>
                  <Input type="number" defaultValue="4.00" step="0.01" />
                </div>
                <div className="space-y-2">
                  <Label>Yearly Plan ($)</Label>
                  <Input type="number" defaultValue="30.00" step="0.01" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Show Yearly Savings Badge</Label>
                  <p className="text-sm text-muted-foreground">Display discount percentage</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="limits">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Usage Limits
              </CardTitle>
              <CardDescription>Configure usage limits per tier</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-medium">Free Tier</h4>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Daily File Limit</Label>
                    <Input type="number" defaultValue="2" />
                  </div>
                  <div className="space-y-2">
                    <Label>Max File Size (MB)</Label>
                    <Input type="number" defaultValue="5" />
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="font-medium">Premium Tiers</h4>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Daily File Limit</Label>
                    <Input type="number" defaultValue="999" />
                  </div>
                  <div className="space-y-2">
                    <Label>Max File Size (MB)</Label>
                    <Input type="number" defaultValue="100" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments">
          <Card>
            <CardHeader>
              <CardTitle>Payment Settings</CardTitle>
              <CardDescription>Configure payment methods</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Stripe Payments</Label>
                  <p className="text-sm text-muted-foreground">Accept card payments</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Binance Pay</Label>
                  <p className="text-sm text-muted-foreground">Accept cryptocurrency</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Vodafone Cash (Egypt)</Label>
                  <p className="text-sm text-muted-foreground">Accept mobile payments</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="space-y-2">
                <Label>Binance Wallet Address</Label>
                <Input defaultValue="0x1234567890abcdef1234567890abcdef12345678" />
              </div>
              <div className="space-y-2">
                <Label>Vodafone Cash Number</Label>
                <Input defaultValue="01012345678" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Settings
              </CardTitle>
              <CardDescription>Configure email and push notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label>New User Notifications</Label>
                  <p className="text-sm text-muted-foreground">Get notified of new signups</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Payment Notifications</Label>
                  <p className="text-sm text-muted-foreground">Get notified of new payments</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Support Ticket Notifications</Label>
                  <p className="text-sm text-muted-foreground">Get notified of new tickets</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="space-y-2">
                <Label>Admin Email</Label>
                <Input type="email" placeholder="admin@midopdf.com" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-6 flex justify-end">
        <Button onClick={handleSave} disabled={saving}>
          <Save className="h-4 w-4 mr-2" />
          {saving ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>
    </div>
  )
}
