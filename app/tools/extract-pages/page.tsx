'use client'

import { useState } from 'react'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { ToolPageLayout } from '@/components/pdf/tool-page-layout'
import { FileDropzone, type UploadedFile } from '@/components/pdf/file-dropzone'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Spinner } from '@/components/ui/spinner'
import { getToolById } from '@/lib/pdf-tools'
import { extractPages, downloadPdf, getPdfInfo } from '@/lib/pdf-processor'
import { Download, RefreshCw, Copy, FileText } from 'lucide-react'
import { toast } from 'sonner'

export default function ExtractPagesPage() {
  const tool = getToolById('extract-pages')!
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [processing, setProcessing] = useState(false)
  const [result, setResult] = useState<Uint8Array | null>(null)
  const [pageCount, setPageCount] = useState(0)
  const [selectedPages, setSelectedPages] = useState<number[]>([])

  const handleFileChange = async (newFiles: UploadedFile[]) => {
    setFiles(newFiles)
    setResult(null)
    setSelectedPages([])

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

  const togglePage = (pageNum: number) => {
    setSelectedPages(prev =>
      prev.includes(pageNum)
        ? prev.filter(p => p !== pageNum)
        : [...prev, pageNum].sort((a, b) => a - b)
    )
  }

  const selectAll = () => {
    setSelectedPages(Array.from({ length: pageCount }, (_, i) => i + 1))
  }

  const deselectAll = () => {
    setSelectedPages([])
  }

  const handleExtract = async () => {
    if (files.length === 0) {
      toast.error('Please upload a PDF file')
      return
    }

    if (selectedPages.length === 0) {
      toast.error('Please select pages to extract')
      return
    }

    setProcessing(true)
    setResult(null)

    try {
      const extractResult = await extractPages(files[0].file, selectedPages)

      if (extractResult.success && extractResult.data) {
        setResult(extractResult.data)
        toast.success(`Extracted ${selectedPages.length} page(s) successfully!`)
      } else {
        toast.error(extractResult.error || 'Failed to extract pages')
      }
    } catch (error) {
      toast.error('An unexpected error occurred')
    } finally {
      setProcessing(false)
    }
  }

  const handleDownload = () => {
    if (result) {
      downloadPdf(result, 'extracted.pdf')
    }
  }

  const handleReset = () => {
    setFiles([])
    setResult(null)
    setPageCount(0)
    setSelectedPages([])
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
                  <FileDropzone
                    files={files}
                    onFilesChange={handleFileChange}
                    maxFiles={1}
                    disabled={processing}
                  />

                  {pageCount > 0 && (
                    <>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm">
                          <FileText className="h-4 w-4 text-primary" />
                          <span>
                            This PDF has <strong>{pageCount}</strong> pages.
                            Select pages to extract:
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={selectAll}>
                            Select All
                          </Button>
                          <Button variant="outline" size="sm" onClick={deselectAll}>
                            Deselect All
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2">
                        {Array.from({ length: pageCount }, (_, i) => i + 1).map(pageNum => (
                          <label
                            key={pageNum}
                            className={`flex items-center justify-center p-3 rounded-lg border cursor-pointer transition-colors ${
                              selectedPages.includes(pageNum)
                                ? 'bg-primary/10 border-primary text-primary'
                                : 'bg-muted/50 hover:bg-muted'
                            }`}
                          >
                            <Checkbox
                              checked={selectedPages.includes(pageNum)}
                              onCheckedChange={() => togglePage(pageNum)}
                              className="sr-only"
                            />
                            <span className="text-sm font-medium">{pageNum}</span>
                          </label>
                        ))}
                      </div>

                      {selectedPages.length > 0 && (
                        <p className="text-sm text-muted-foreground">
                          {selectedPages.length} page(s) selected: {selectedPages.join(', ')}
                        </p>
                      )}
                    </>
                  )}

                  <div className="flex flex-wrap gap-3">
                    <Button
                      onClick={handleExtract}
                      disabled={files.length === 0 || selectedPages.length === 0 || processing}
                      className="flex-1 sm:flex-none"
                    >
                      {processing && <Spinner className="mr-2" />}
                      <Copy className="mr-2 h-4 w-4" />
                      {processing ? 'Extracting...' : 'Extract Pages'}
                    </Button>

                    {result && (
                      <Button onClick={handleDownload} variant="outline">
                        <Download className="mr-2 h-4 w-4" />
                        Download Extracted PDF
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
                  <CardTitle className="text-base">How to Extract Pages</CardTitle>
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
                      <span>Select the page numbers you want to extract</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                        3
                      </span>
                      <span>Click "Extract Pages" to create a new PDF</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                        4
                      </span>
                      <span>Download the new PDF with only selected pages</span>
                    </li>
                  </ol>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">About This Tool</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p>
                    Extract specific pages from your PDF to create a new document.
                    The original file remains unchanged. Perfect for pulling out
                    chapters, sections, or specific content from larger documents.
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
