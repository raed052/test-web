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
import { removePages, downloadPdf, getPdfInfo } from '@/lib/pdf-processor'
import { Download, RefreshCw, Trash2, FileText } from 'lucide-react'
import { toast } from 'sonner'

export default function RemovePagesPage() {
  const tool = getToolById('remove-pages')!
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
        : [...prev, pageNum]
    )
  }

  const handleRemove = async () => {
    if (files.length === 0) {
      toast.error('Please upload a PDF file')
      return
    }

    if (selectedPages.length === 0) {
      toast.error('Please select pages to remove')
      return
    }

    if (selectedPages.length >= pageCount) {
      toast.error('Cannot remove all pages from the document')
      return
    }

    setProcessing(true)
    setResult(null)

    try {
      const removeResult = await removePages(files[0].file, selectedPages)

      if (removeResult.success && removeResult.data) {
        setResult(removeResult.data)
        toast.success(`Removed ${selectedPages.length} page(s) successfully!`)
      } else {
        toast.error(removeResult.error || 'Failed to remove pages')
      }
    } catch (error) {
      toast.error('An unexpected error occurred')
    } finally {
      setProcessing(false)
    }
  }

  const handleDownload = () => {
    if (result) {
      downloadPdf(result, 'modified.pdf')
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
                      <div className="rounded-lg bg-muted p-4">
                        <div className="flex items-center gap-2 text-sm">
                          <FileText className="h-4 w-4 text-primary" />
                          <span>
                            This PDF has <strong>{pageCount}</strong> pages.
                            Select pages to remove:
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2">
                        {Array.from({ length: pageCount }, (_, i) => i + 1).map(pageNum => (
                          <label
                            key={pageNum}
                            className={`flex items-center justify-center p-3 rounded-lg border cursor-pointer transition-colors ${
                              selectedPages.includes(pageNum)
                                ? 'bg-destructive/10 border-destructive text-destructive'
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
                          {selectedPages.length} page(s) selected for removal
                        </p>
                      )}
                    </>
                  )}

                  <div className="flex flex-wrap gap-3">
                    <Button
                      onClick={handleRemove}
                      disabled={files.length === 0 || selectedPages.length === 0 || processing}
                      variant="destructive"
                      className="flex-1 sm:flex-none"
                    >
                      {processing && <Spinner className="mr-2" />}
                      <Trash2 className="mr-2 h-4 w-4" />
                      {processing ? 'Removing...' : 'Remove Pages'}
                    </Button>

                    {result && (
                      <Button onClick={handleDownload} variant="outline">
                        <Download className="mr-2 h-4 w-4" />
                        Download Modified PDF
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
                  <CardTitle className="text-base">How to Remove Pages</CardTitle>
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
                      <span>Click on the page numbers you want to remove</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                        3
                      </span>
                      <span>Click "Remove Pages" to process</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                        4
                      </span>
                      <span>Download your modified PDF</span>
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
