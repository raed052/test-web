'use client'

import { useState, useCallback } from 'react'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { ToolPageLayout } from '@/components/pdf/tool-page-layout'
import { FileDropzone, type UploadedFile } from '@/components/pdf/file-dropzone'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'
import { getToolById } from '@/lib/pdf-tools'
import { extractPages, downloadPdf, getPdfInfo } from '@/lib/pdf-processor'
import { Download, RefreshCw, FolderOpen, FileText, GripVertical, ArrowUp, ArrowDown } from 'lucide-react'
import { toast } from 'sonner'

interface PageItem {
  number: number
  originalNumber: number
}

export default function OrganizePdfPage() {
  const tool = getToolById('organize')!
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [processing, setProcessing] = useState(false)
  const [result, setResult] = useState<Uint8Array | null>(null)
  const [pageCount, setPageCount] = useState(0)
  const [pages, setPages] = useState<PageItem[]>([])

  const handleFileChange = async (newFiles: UploadedFile[]) => {
    setFiles(newFiles)
    setResult(null)

    if (newFiles.length > 0) {
      try {
        const info = await getPdfInfo(newFiles[0].file)
        setPageCount(info.pageCount)
        setPages(Array.from({ length: info.pageCount }, (_, i) => ({
          number: i + 1,
          originalNumber: i + 1,
        })))
      } catch {
        setPageCount(0)
        setPages([])
      }
    } else {
      setPageCount(0)
      setPages([])
    }
  }

  const movePage = useCallback((fromIndex: number, direction: 'up' | 'down') => {
    const toIndex = direction === 'up' ? fromIndex - 1 : fromIndex + 1
    if (toIndex < 0 || toIndex >= pages.length) return

    setPages(prev => {
      const newPages = [...prev]
      const [movedPage] = newPages.splice(fromIndex, 1)
      newPages.splice(toIndex, 0, movedPage)
      return newPages
    })
  }, [pages.length])

  const handleOrganize = async () => {
    if (files.length === 0) {
      toast.error('Please upload a PDF file')
      return
    }

    // Check if order has changed
    const hasChanged = pages.some((page, index) => page.originalNumber !== index + 1)
    if (!hasChanged) {
      toast.info('No changes made to page order')
      return
    }

    setProcessing(true)
    setResult(null)

    try {
      const newOrder = pages.map(p => p.originalNumber)
      const organizeResult = await extractPages(files[0].file, newOrder)

      if (organizeResult.success && organizeResult.data) {
        setResult(organizeResult.data)
        toast.success('PDF reorganized successfully!')
      } else {
        toast.error(organizeResult.error || 'Failed to organize PDF')
      }
    } catch (error) {
      toast.error('An unexpected error occurred')
    } finally {
      setProcessing(false)
    }
  }

  const handleDownload = () => {
    if (result) {
      downloadPdf(result, 'organized.pdf')
    }
  }

  const handleReset = () => {
    setFiles([])
    setResult(null)
    setPageCount(0)
    setPages([])
  }

  const resetOrder = () => {
    setPages(Array.from({ length: pageCount }, (_, i) => ({
      number: i + 1,
      originalNumber: i + 1,
    })))
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
                          <span>Reorder the {pageCount} pages using the arrows:</span>
                        </div>
                        <Button variant="outline" size="sm" onClick={resetOrder}>
                          Reset Order
                        </Button>
                      </div>

                      <div className="space-y-2 max-h-[400px] overflow-y-auto">
                        {pages.map((page, index) => (
                          <div
                            key={`${page.originalNumber}-${index}`}
                            className="flex items-center gap-3 p-3 rounded-lg border bg-muted/30"
                          >
                            <GripVertical className="h-4 w-4 text-muted-foreground" />
                            <div className="flex h-8 w-8 items-center justify-center rounded bg-primary/10 text-sm font-medium text-primary">
                              {page.originalNumber}
                            </div>
                            <span className="flex-1 text-sm">
                              Page {page.originalNumber}
                              {page.originalNumber !== index + 1 && (
                                <span className="text-muted-foreground ml-2">
                                  (now position {index + 1})
                                </span>
                              )}
                            </span>
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => movePage(index, 'up')}
                                disabled={index === 0}
                              >
                                <ArrowUp className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => movePage(index, 'down')}
                                disabled={index === pages.length - 1}
                              >
                                <ArrowDown className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  <div className="flex flex-wrap gap-3">
                    <Button
                      onClick={handleOrganize}
                      disabled={files.length === 0 || processing}
                      className="flex-1 sm:flex-none"
                    >
                      {processing && <Spinner className="mr-2" />}
                      <FolderOpen className="mr-2 h-4 w-4" />
                      {processing ? 'Organizing...' : 'Apply Changes'}
                    </Button>

                    {result && (
                      <Button onClick={handleDownload} variant="outline">
                        <Download className="mr-2 h-4 w-4" />
                        Download Organized PDF
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
                  <CardTitle className="text-base">How to Organize PDF</CardTitle>
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
                      <span>Use the arrow buttons to reorder pages</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                        3
                      </span>
                      <span>Click "Apply Changes" when satisfied</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                        4
                      </span>
                      <span>Download your reorganized PDF</span>
                    </li>
                  </ol>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Tips</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p>
                    Perfect for rearranging chapters, moving appendices,
                    or putting pages in the correct sequence after scanning.
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
