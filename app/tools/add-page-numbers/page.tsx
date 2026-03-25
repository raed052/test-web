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
import { addPageNumbers, downloadPdf, getPdfInfo } from '@/lib/pdf-processor'
import { Download, RefreshCw, Hash, FileText } from 'lucide-react'
import { toast } from 'sonner'

type Position = 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'

export default function AddPageNumbersPage() {
  const tool = getToolById('add-page-numbers')!
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [processing, setProcessing] = useState(false)
  const [result, setResult] = useState<Uint8Array | null>(null)
  const [pageCount, setPageCount] = useState(0)
  const [position, setPosition] = useState<Position>('bottom-center')
  const [startNumber, setStartNumber] = useState(1)

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

  const handleAddNumbers = async () => {
    if (files.length === 0) {
      toast.error('Please upload a PDF file')
      return
    }

    setProcessing(true)
    setResult(null)

    try {
      const addResult = await addPageNumbers(files[0].file, position, startNumber)

      if (addResult.success && addResult.data) {
        setResult(addResult.data)
        toast.success('Page numbers added successfully!')
      } else {
        toast.error(addResult.error || 'Failed to add page numbers')
      }
    } catch (error) {
      toast.error('An unexpected error occurred')
    } finally {
      setProcessing(false)
    }
  }

  const handleDownload = () => {
    if (result) {
      downloadPdf(result, 'numbered.pdf')
    }
  }

  const handleReset = () => {
    setFiles([])
    setResult(null)
    setPageCount(0)
  }

  const positions: { value: Position; label: string }[] = [
    { value: 'top-left', label: 'Top Left' },
    { value: 'top-center', label: 'Top Center' },
    { value: 'top-right', label: 'Top Right' },
    { value: 'bottom-left', label: 'Bottom Left' },
    { value: 'bottom-center', label: 'Bottom Center' },
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

                      <FieldGroup>
                        <Field>
                          <FieldLabel>Start Number</FieldLabel>
                          <Input
                            type="number"
                            min={1}
                            value={startNumber}
                            onChange={(e) => setStartNumber(parseInt(e.target.value) || 1)}
                            className="w-32"
                          />
                          <p className="mt-1 text-xs text-muted-foreground">
                            Pages will be numbered from {startNumber} to {startNumber + pageCount - 1}
                          </p>
                        </Field>
                      </FieldGroup>
                    </>
                  )}

                  <div className="flex flex-wrap gap-3">
                    <Button
                      onClick={handleAddNumbers}
                      disabled={files.length === 0 || processing}
                      className="flex-1 sm:flex-none"
                    >
                      {processing && <Spinner className="mr-2" />}
                      <Hash className="mr-2 h-4 w-4" />
                      {processing ? 'Adding...' : 'Add Page Numbers'}
                    </Button>

                    {result && (
                      <Button onClick={handleDownload} variant="outline">
                        <Download className="mr-2 h-4 w-4" />
                        Download Numbered PDF
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
                  <CardTitle className="text-base">How to Add Page Numbers</CardTitle>
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
                      <span>Choose where to place the page numbers</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                        3
                      </span>
                      <span>Set the starting number (default is 1)</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                        4
                      </span>
                      <span>Download your numbered PDF</span>
                    </li>
                  </ol>
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
