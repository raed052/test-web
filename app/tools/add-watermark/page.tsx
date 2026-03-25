'use client'

import { useState } from 'react'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { ToolPageLayout } from '@/components/pdf/tool-page-layout'
import { FileDropzone, type UploadedFile } from '@/components/pdf/file-dropzone'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'
import { Spinner } from '@/components/ui/spinner'
import { FieldGroup, Field, FieldLabel } from '@/components/ui/field'
import { getToolById } from '@/lib/pdf-tools'
import { addTextWatermark, downloadPdf, getPdfInfo } from '@/lib/pdf-processor'
import { Download, RefreshCw, Droplets, FileText } from 'lucide-react'
import { toast } from 'sonner'

type Position = 'center' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'

export default function AddWatermarkPage() {
  const tool = getToolById('add-watermark')!
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [processing, setProcessing] = useState(false)
  const [result, setResult] = useState<Uint8Array | null>(null)
  const [pageCount, setPageCount] = useState(0)
  const [watermarkText, setWatermarkText] = useState('CONFIDENTIAL')
  const [position, setPosition] = useState<Position>('center')
  const [fontSize, setFontSize] = useState([48])
  const [opacity, setOpacity] = useState([30])
  const [rotation, setRotation] = useState([-45])

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

  const handleAddWatermark = async () => {
    if (files.length === 0) {
      toast.error('Please upload a PDF file')
      return
    }

    if (!watermarkText.trim()) {
      toast.error('Please enter watermark text')
      return
    }

    setProcessing(true)
    setResult(null)

    try {
      const addResult = await addTextWatermark(files[0].file, watermarkText, {
        position,
        fontSize: fontSize[0],
        opacity: opacity[0] / 100,
        rotation: rotation[0],
      })

      if (addResult.success && addResult.data) {
        setResult(addResult.data)
        toast.success('Watermark added successfully!')
      } else {
        toast.error(addResult.error || 'Failed to add watermark')
      }
    } catch (error) {
      toast.error('An unexpected error occurred')
    } finally {
      setProcessing(false)
    }
  }

  const handleDownload = () => {
    if (result) {
      downloadPdf(result, 'watermarked.pdf')
    }
  }

  const handleReset = () => {
    setFiles([])
    setResult(null)
    setPageCount(0)
  }

  const positions: { value: Position; label: string }[] = [
    { value: 'top-left', label: 'Top Left' },
    { value: 'top-right', label: 'Top Right' },
    { value: 'center', label: 'Center' },
    { value: 'bottom-left', label: 'Bottom Left' },
    { value: 'bottom-right', label: 'Bottom Right' },
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

                      <FieldGroup>
                        <Field>
                          <FieldLabel>Watermark Text</FieldLabel>
                          <Input
                            value={watermarkText}
                            onChange={(e) => setWatermarkText(e.target.value)}
                            placeholder="Enter watermark text..."
                          />
                        </Field>
                      </FieldGroup>

                      <div>
                        <p className="mb-3 text-sm font-medium">Position</p>
                        <div className="grid grid-cols-3 gap-2">
                          {positions.map(pos => (
                            <Button
                              key={pos.value}
                              variant={position === pos.value ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => setPosition(pos.value)}
                              className="text-xs"
                            >
                              {pos.label}
                            </Button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <div className="mb-2 flex items-center justify-between">
                            <span className="text-sm font-medium">Font Size</span>
                            <span className="text-sm text-muted-foreground">{fontSize[0]}px</span>
                          </div>
                          <Slider
                            value={fontSize}
                            onValueChange={setFontSize}
                            min={12}
                            max={120}
                            step={4}
                          />
                        </div>

                        <div>
                          <div className="mb-2 flex items-center justify-between">
                            <span className="text-sm font-medium">Opacity</span>
                            <span className="text-sm text-muted-foreground">{opacity[0]}%</span>
                          </div>
                          <Slider
                            value={opacity}
                            onValueChange={setOpacity}
                            min={10}
                            max={100}
                            step={5}
                          />
                        </div>

                        <div>
                          <div className="mb-2 flex items-center justify-between">
                            <span className="text-sm font-medium">Rotation</span>
                            <span className="text-sm text-muted-foreground">{rotation[0]}°</span>
                          </div>
                          <Slider
                            value={rotation}
                            onValueChange={setRotation}
                            min={-90}
                            max={90}
                            step={15}
                          />
                        </div>
                      </div>
                    </>
                  )}

                  <div className="flex flex-wrap gap-3">
                    <Button
                      onClick={handleAddWatermark}
                      disabled={files.length === 0 || processing}
                      className="flex-1 sm:flex-none"
                    >
                      {processing && <Spinner className="mr-2" />}
                      <Droplets className="mr-2 h-4 w-4" />
                      {processing ? 'Adding...' : 'Add Watermark'}
                    </Button>

                    {result && (
                      <Button onClick={handleDownload} variant="outline">
                        <Download className="mr-2 h-4 w-4" />
                        Download Watermarked PDF
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
                  <CardTitle className="text-base">How to Add Watermark</CardTitle>
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
                      <span>Enter your watermark text</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                        3
                      </span>
                      <span>Customize position, size, opacity, and rotation</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                        4
                      </span>
                      <span>Download your watermarked PDF</span>
                    </li>
                  </ol>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Use Cases</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <ul className="space-y-2">
                    <li>Mark documents as "CONFIDENTIAL" or "DRAFT"</li>
                    <li>Add your company name or logo text</li>
                    <li>Protect documents from unauthorized use</li>
                    <li>Add "SAMPLE" or "PREVIEW" to demo documents</li>
                  </ul>
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
