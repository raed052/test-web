'use client'

import { useState } from 'react'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { ToolPageLayout } from '@/components/pdf/tool-page-layout'
import { FileDropzone, type UploadedFile } from '@/components/pdf/file-dropzone'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'
import { getToolById } from '@/lib/pdf-tools'
import { imagesToPdf, downloadPdf } from '@/lib/pdf-processor'
import { Download, RefreshCw, FileImage } from 'lucide-react'
import { toast } from 'sonner'

export default function PngToPdfPage() {
  const tool = getToolById('png-to-pdf')!
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [processing, setProcessing] = useState(false)
  const [result, setResult] = useState<Uint8Array | null>(null)

  const handleConvert = async () => {
    if (files.length === 0) {
      toast.error('Please upload at least one image')
      return
    }

    setProcessing(true)
    setResult(null)

    try {
      const imageFiles = files.map(f => f.file)
      const convertResult = await imagesToPdf(imageFiles)

      if (convertResult.success && convertResult.data) {
        setResult(convertResult.data)
        toast.success('Images converted to PDF successfully!')
      } else {
        toast.error(convertResult.error || 'Failed to convert images')
      }
    } catch (error) {
      toast.error('An unexpected error occurred')
    } finally {
      setProcessing(false)
    }
  }

  const handleDownload = () => {
    if (result) {
      downloadPdf(result, 'converted.pdf')
    }
  }

  const handleReset = () => {
    setFiles([])
    setResult(null)
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
                  <CardTitle>Upload PNG Images</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FileDropzone
                    files={files}
                    onFilesChange={setFiles}
                    accept={{
                      'image/png': ['.png'],
                    }}
                    maxFiles={50}
                    disabled={processing}
                  />

                  {files.length > 1 && (
                    <p className="text-sm text-muted-foreground">
                      {files.length} images will be combined into a single PDF. Each image will be on its own page.
                    </p>
                  )}

                  <div className="flex flex-wrap gap-3">
                    <Button
                      onClick={handleConvert}
                      disabled={files.length === 0 || processing}
                      className="flex-1 sm:flex-none"
                    >
                      {processing && <Spinner className="mr-2" />}
                      <FileImage className="mr-2 h-4 w-4" />
                      {processing ? 'Converting...' : 'Convert to PDF'}
                    </Button>

                    {result && (
                      <Button onClick={handleDownload} variant="outline">
                        <Download className="mr-2 h-4 w-4" />
                        Download PDF
                      </Button>
                    )}

                    {files.length > 0 && (
                      <Button onClick={handleReset} variant="ghost">
                        <RefreshCw className="mr-2 h-4 w-4" />
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
                  <CardTitle className="text-base">How to Convert PNG to PDF</CardTitle>
                </CardHeader>
                <CardContent>
                  <ol className="space-y-3 text-sm text-muted-foreground">
                    <li className="flex gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                        1
                      </span>
                      <span>Upload one or more PNG images</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                        2
                      </span>
                      <span>Reorder images if needed</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                        3
                      </span>
                      <span>Click "Convert to PDF"</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                        4
                      </span>
                      <span>Download your new PDF file</span>
                    </li>
                  </ol>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">About PNG Format</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p>
                    PNG (Portable Network Graphics) supports transparent backgrounds
                    and is ideal for screenshots, graphics, and images with text.
                    The transparency will be converted to white in the PDF.
                  </p>
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
