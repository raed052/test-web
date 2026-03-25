'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FieldGroup, Field, FieldLabel, FieldError } from '@/components/ui/field'
import { Spinner } from '@/components/ui/spinner'
import { Separator } from '@/components/ui/separator'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { User, Mail, Lock, Trash2 } from 'lucide-react'

export default function SettingsPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  useEffect(() => {
    async function loadProfile() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        setEmail(user.email || '')
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', user.id)
          .single()
        
        if (profile) {
          setFullName(profile.full_name || '')
        }
      }
      setLoading(false)
    }
    loadProfile()
  }, [])

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) throw new Error('Not authenticated')

      const { error } = await supabase
        .from('profiles')
        .update({ full_name: fullName, updated_at: new Date().toISOString() })
        .eq('id', user.id)

      if (error) throw error
      toast.success('Profile updated successfully')
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }

    setSaving(true)

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      })

      if (error) throw error
      
      toast.success('Password updated successfully')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (error: any) {
      toast.error(error.message || 'Failed to update password')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Spinner className="h-8 w-8" />
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Settings</h1>
        <p className="mt-1 text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="max-w-2xl space-y-8">
        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile Information
            </CardTitle>
            <CardDescription>
              Update your personal information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdateProfile}>
              <FieldGroup>
                <Field>
                  <FieldLabel>Full Name</FieldLabel>
                  <Input
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    placeholder="Your full name"
                  />
                </Field>
                <Field>
                  <FieldLabel>Email</FieldLabel>
                  <Input
                    value={email}
                    disabled
                    className="bg-muted"
                  />
                  <p className="mt-1 text-xs text-muted-foreground">
                    Email cannot be changed
                  </p>
                </Field>
              </FieldGroup>
              <Button type="submit" className="mt-4" disabled={saving}>
                {saving && <Spinner className="mr-2" />}
                Save Changes
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Password Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Change Password
            </CardTitle>
            <CardDescription>
              Update your password to keep your account secure
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdatePassword}>
              <FieldGroup>
                <Field>
                  <FieldLabel>New Password</FieldLabel>
                  <Input
                    type="password"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                  />
                </Field>
                <Field>
                  <FieldLabel>Confirm New Password</FieldLabel>
                  <Input
                    type="password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                  />
                </Field>
              </FieldGroup>
              <Button type="submit" className="mt-4" disabled={saving}>
                {saving && <Spinner className="mr-2" />}
                Update Password
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <Trash2 className="h-5 w-5" />
              Danger Zone
            </CardTitle>
            <CardDescription>
              Irreversible actions for your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm text-muted-foreground">
              Once you delete your account, there is no going back. All your data will be
              permanently removed.
            </p>
            <Button variant="destructive">
              Delete Account
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
