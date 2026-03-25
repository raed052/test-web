'use client'

import { useState } from 'react'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { ToolPageLayout } from '@/components/pdf/tool-page-layout'
import { FileDropzone, type UploadedFile } from '@/components/pdf/file-dropzone'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import { FieldGroup, Field, FieldLabel } from '@/components/ui/field'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { getToolById } from '@/lib/pdf-tools'
import { getPdfInfo } from '@/lib/pdf-processor'
import { Lock, FileText, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'

export default function ProtectPdfPage() {
  const tool = getToolById('protect')!
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [processing, setProcessing] = useState(false)
  const [pageCount, setPageCount] = useState(0)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [permissions, setPermissions] = useState({
    allowPrinting: true,
    allowCopying: true,
    allowEditing: false,
  })

  const handleFileChange = async (newFiles: UploadedFile[]) => {
    setFiles(newFiles)

    if (newFiles.length > 0) {
      try {
        const info = await getPdfInfo(newFiles[0].file)
        setPageCount(info.pageCount)
      } catch {
        setPageCount(0)
      }
    } else {
      setPageCount(0)
    }
  }

  const handleProtect = async () => {
    if (files.length === 0) {
      toast.error('Please upload a PDF file')
      return
    }

    if (!password) {
      toast.error('Please enter a password')
      return
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    if (password.length < 4) {
      toast.error('Password must be at least 4 characters')
      return
    }

    setProcessing(true)

    try {
      // Note: PDF encryption requires server-side processing
      await new Promise(resolve => setTimeout(resolve, 1500))
      toast.info('PDF protection requires server-side processing. This feature is coming soon!')
    } catch (error) {
      toast.error('An unexpected error occurred')
    } finally {
      setProcessing(false)
    }
  }

  const handleReset = () => {
    setFiles([])
    setPageCount(0)
    setPassword('')
    setConfirmPassword('')
  }

  return (
    <>
      <Header />
      <main className="flex-1">
        <ToolPageLayout tool={tool} showUpgrade>
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Upload PDF File</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="font-medium text-sm">Coming Soon</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          PDF password protection requires server-side processing for security reasons.
                          This feature will be available in an upcoming update.
                        </p>
                      </div>
                    </div>
                  </div>

                  <FileDropzone
                    files={files}
                    onFilesChange={handleFileChange}
                    maxFiles={1}
                    disabled={processing}
                  />

                  {pageCount > 0 && (
                    <>
                      <div className="rounded-lg bg-muted p-4">
                        <div className="flex items-center gap-2 text-sm">
                          <FileText className="h-4 w-4 text-primary" />
                          <span>This PDF has <strong>{pageCount}</strong> pages</span>
                        </div>
                      </div>

                      <FieldGroup>
                        <Field>
                          <FieldLabel>Password</FieldLabel>
                          <Input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter password..."
                          />
                        </Field>
                        <Field>
                          <FieldLabel>Confirm Password</FieldLabel>
                          <Input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm password..."
                          />
                        </Field>
                      </FieldGroup>

                      <div>
                        <p className="mb-3 text-sm font-medium">Permissions</p>
                        <div className="space-y-3">
                          <label className="flex items-center gap-3">
                            <Checkbox
                              checked={permissions.allowPrinting}
                              onCheckedChange={(checked) =>
                                setPermissions(prev => ({ ...prev, allowPrinting: !!checked }))
                              }
                            />
                            <span className="text-sm">Allow Printing</span>
                          </label>
                          <label className="flex items-center gap-3">
                            <Checkbox
                              checked={permissions.allowCopying}
                              onCheckedChange={(checked) =>
                                setPermissions(prev => ({ ...prev, allowCopying: !!checked }))
                              }
                            />
                            <span className="text-sm">Allow Copying Text</span>
                          </label>
                          <label className="flex items-center gap-3">
                            <Checkbox
                              checked={permissions.allowEditing}
                              onCheckedChange={(checked) =>
                                setPermissions(prev => ({ ...prev, allowEditing: !!checked }))
                              }
                            />
                            <span className="text-sm">Allow Editing</span>
                          </label>
                        </div>
                      </div>
                    </>
                  )}

                  <div className="flex flex-wrap gap-3">
                    <Button
                      onClick={handleProtect}
                      disabled={files.length === 0 || processing || !password}
                      className="flex-1 sm:flex-none"
                    >
                      {processing && <Spinner className="mr-2" />}
                      <Lock className="mr-2 h-4 w-4" />
                      {processing ? 'Processing...' : 'Protect PDF'}
                    </Button>

                    {files.length > 0 && (
                      <Button onClick={handleReset} variant="ghost">
                        Reset
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">How to Protect a PDF</CardTitle>
                </CardHeader>
                <CardContent>
                  <ol className="space-y-3 text-sm text-muted-foreground">
                    <li className="flex gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                        1
                      </span>
                      <span>Upload your PDF file</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                        2
                      </span>
                      <span>Set a strong password</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                        3
                      </span>
                      <span>Choose what actions to allow</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                        4
                      </span>
                      <span>Download your protected PDF</span>
                    </li>
                  </ol>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Security Tips</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground space-y-2">
                  <p>Use a strong password with a mix of letters, numbers, and symbols.</p>
                  <p>Store your password securely - we cannot recover it if lost.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </ToolPageLayout>
      </main>
      <Footer />
    </>
  )
}
