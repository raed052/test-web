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
import { getToolById } from '@/lib/pdf-tools'
import { getPdfInfo } from '@/lib/pdf-processor'
import { Unlock, FileText, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'

export default function UnlockPdfPage() {
  const tool = getToolById('unlock')!
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [processing, setProcessing] = useState(false)
  const [password, setPassword] = useState('')

  const handleFileChange = async (newFiles: UploadedFile[]) => {
    setFiles(newFiles)
  }

  const handleUnlock = async () => {
    if (files.length === 0) {
      toast.error('Please upload a PDF file')
      return
    }

    if (!password) {
      toast.error('Please enter the PDF password')
      return
    }

    setProcessing(true)

    try {
      // Note: PDF decryption requires server-side processing
      await new Promise(resolve => setTimeout(resolve, 1500))
      toast.info('PDF unlocking requires server-side processing. This feature is coming soon!')
    } catch (error) {
      toast.error('An unexpected error occurred')
    } finally {
      setProcessing(false)
    }
  }

  const handleReset = () => {
    setFiles([])
    setPassword('')
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
                  <CardTitle>Upload Protected PDF</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="font-medium text-sm">Coming Soon</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          PDF unlocking requires server-side processing for security reasons.
                          You must know the password to unlock the PDF - this tool cannot crack passwords.
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

                  {files.length > 0 && (
                    <FieldGroup>
                      <Field>
                        <FieldLabel>PDF Password</FieldLabel>
                        <Input
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Enter the PDF password..."
                        />
                        <p className="mt-1 text-xs text-muted-foreground">
                          Enter the password that was used to protect this PDF
                        </p>
                      </Field>
                    </FieldGroup>
                  )}

                  <div className="flex flex-wrap gap-3">
                    <Button
                      onClick={handleUnlock}
                      disabled={files.length === 0 || processing || !password}
                      className="flex-1 sm:flex-none"
                    >
                      {processing && <Spinner className="mr-2" />}
                      <Unlock className="mr-2 h-4 w-4" />
                      {processing ? 'Processing...' : 'Unlock PDF'}
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
                  <CardTitle className="text-base">How to Unlock a PDF</CardTitle>
                </CardHeader>
                <CardContent>
                  <ol className="space-y-3 text-sm text-muted-foreground">
                    <li className="flex gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                        1
                      </span>
                      <span>Upload your password-protected PDF</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                        2
                      </span>
                      <span>Enter the PDF password</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                        3
                      </span>
                      <span>Click "Unlock PDF" to remove protection</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                        4
                      </span>
                      <span>Download the unlocked PDF</span>
                    </li>
                  </ol>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Important Note</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground space-y-2">
                  <p>This tool requires you to know the PDF password.</p>
                  <p>We do not support cracking or bypassing password protection on PDFs you do not own.</p>
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
