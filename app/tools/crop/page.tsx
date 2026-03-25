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
import { cropPdf, downloadPdf, getPdfInfo } from '@/lib/pdf-processor'
import { Download, RefreshCw, Crop, FileText } from 'lucide-react'
import { toast } from 'sonner'

export default function CropPdfPage() {
  const tool = getToolById('crop')!
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [processing, setProcessing] = useState(false)
  const [result, setResult] = useState<Uint8Array | null>(null)
  const [pageCount, setPageCount] = useState(0)
  const [margins, setMargins] = useState({
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  })

  const handleFileChange = async (newFiles: UploadedFile[]) => {
    setFiles(newFiles)
    setResult(null)

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

  const handleCrop = async () => {
    if (files.length === 0) {
      toast.error('Please upload a PDF file')
      return
    }

    setProcessing(true)
    setResult(null)

    try {
      const cropResult = await cropPdf(files[0].file, margins)

      if (cropResult.success && cropResult.data) {
        setResult(cropResult.data)
        toast.success('PDF cropped successfully!')
      } else {
        toast.error(cropResult.error || 'Failed to crop PDF')
      }
    } catch (error) {
      toast.error('An unexpected error occurred')
    } finally {
      setProcessing(false)
    }
  }

  const handleDownload = () => {
    if (result) {
      downloadPdf(result, 'cropped.pdf')
    }
  }

  const handleReset = () => {
    setFiles([])
    setResult(null)
    setPageCount(0)
    setMargins({ top: 0, right: 0, bottom: 0, left: 0 })
  }

  const handleMarginChange = (side: keyof typeof margins, value: string) => {
    const numValue = parseInt(value) || 0
    setMargins(prev => ({ ...prev, [side]: Math.max(0, numValue) }))
  }

  const presets = [
    { name: 'None', margins: { top: 0, right: 0, bottom: 0, left: 0 } },
    { name: 'Small', margins: { top: 20, right: 20, bottom: 20, left: 20 } },
    { name: 'Medium', margins: { top: 40, right: 40, bottom: 40, left: 40 } },
    { name: 'Large', margins: { top: 72, right: 72, bottom: 72, left: 72 } },
  ]

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

                      <div>
                        <p className="mb-3 text-sm font-medium">Quick Presets</p>
                        <div className="flex flex-wrap gap-2">
                          {presets.map(preset => (
                            <Button
                              key={preset.name}
                              variant="outline"
                              size="sm"
                              onClick={() => setMargins(preset.margins)}
                            >
                              {preset.name}
                            </Button>
                          ))}
                        </div>
                      </div>

                      <FieldGroup>
                        <p className="text-sm font-medium">Custom Margins (in points, 1 inch = 72 points)</p>
                        <div className="grid grid-cols-2 gap-4">
                          <Field>
                            <FieldLabel>Top</FieldLabel>
                            <Input
                              type="number"
                              min={0}
                              value={margins.top}
                              onChange={(e) => handleMarginChange('top', e.target.value)}
                            />
                          </Field>
                          <Field>
                            <FieldLabel>Right</FieldLabel>
                            <Input
                              type="number"
                              min={0}
                              value={margins.right}
                              onChange={(e) => handleMarginChange('right', e.target.value)}
                            />
                          </Field>
                          <Field>
                            <FieldLabel>Bottom</FieldLabel>
                            <Input
                              type="number"
                              min={0}
                              value={margins.bottom}
                              onChange={(e) => handleMarginChange('bottom', e.target.value)}
                            />
                          </Field>
                          <Field>
                            <FieldLabel>Left</FieldLabel>
                            <Input
                              type="number"
                              min={0}
                              value={margins.left}
                              onChange={(e) => handleMarginChange('left', e.target.value)}
                            />
                          </Field>
                        </div>
                      </FieldGroup>
                    </>
                  )}

                  <div className="flex flex-wrap gap-3">
                    <Button
                      onClick={handleCrop}
                      disabled={files.length === 0 || processing}
                      className="flex-1 sm:flex-none"
                    >
                      {processing && <Spinner className="mr-2" />}
                      <Crop className="mr-2 h-4 w-4" />
                      {processing ? 'Cropping...' : 'Crop PDF'}
                    </Button>

                    {result && (
                      <Button onClick={handleDownload} variant="outline">
                        <Download className="mr-2 h-4 w-4" />
                        Download Cropped PDF
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
                  <CardTitle className="text-base">How to Crop a PDF</CardTitle>
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
                      <span>Choose a preset or enter custom margins</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                        3
                      </span>
                      <span>Click "Crop PDF" to process</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                        4
                      </span>
                      <span>Download your cropped PDF</span>
                    </li>
                  </ol>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">About Cropping</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p>
                    Cropping removes margins from all sides of your PDF pages.
                    This is useful for removing unnecessary whitespace or
                    adjusting the visible area of scanned documents.
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
