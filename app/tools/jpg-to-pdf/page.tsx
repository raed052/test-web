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
import { Download, RefreshCw, Image } from 'lucide-react'
import { toast } from 'sonner'

export default function JpgToPdfPage() {
  const tool = getToolById('jpg-to-pdf')!
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
                  <CardTitle>Upload JPG Images</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FileDropzone
                    files={files}
                    onFilesChange={setFiles}
                    accept={{
                      'image/jpeg': ['.jpg', '.jpeg'],
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
                      <Image className="mr-2 h-4 w-4" />
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
                  <CardTitle className="text-base">Supported Formats</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-primary" />
                      JPG / JPEG images
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-primary" />
                      PNG images
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Tips</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p>
                    Upload multiple images to combine them into a multi-page PDF.
                    The images will appear in the order you uploaded them.
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
