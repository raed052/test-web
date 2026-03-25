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
import { mergePdfs, downloadPdf } from '@/lib/pdf-processor'
import { Download, RefreshCw, GripVertical } from 'lucide-react'
import { toast } from 'sonner'

export default function MergePdfPage() {
  const tool = getToolById('merge')!
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [processing, setProcessing] = useState(false)
  const [result, setResult] = useState<Uint8Array | null>(null)

  const handleMerge = async () => {
    if (files.length < 2) {
      toast.error('Please upload at least 2 PDF files to merge')
      return
    }

    setProcessing(true)
    setResult(null)

    try {
      const pdfFiles = files.map(f => f.file)
      const mergeResult = await mergePdfs(pdfFiles)

      if (mergeResult.success && mergeResult.data) {
        setResult(mergeResult.data)
        toast.success('PDFs merged successfully!')
      } else {
        toast.error(mergeResult.error || 'Failed to merge PDFs')
      }
    } catch (error) {
      toast.error('An unexpected error occurred')
    } finally {
      setProcessing(false)
    }
  }

  const handleDownload = () => {
    if (result) {
      downloadPdf(result, 'merged.pdf')
    }
  }

  const handleReset = () => {
    setFiles([])
    setResult(null)
  }

  const moveFile = (fromIndex: number, toIndex: number) => {
    const newFiles = [...files]
    const [movedFile] = newFiles.splice(fromIndex, 1)
    newFiles.splice(toIndex, 0, movedFile)
    setFiles(newFiles)
  }

  return (
    <>
      <Header />
      <main className="flex-1">
        <ToolPageLayout tool={tool} showUpgrade>
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Upload PDF Files</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FileDropzone
                    files={files}
                    onFilesChange={setFiles}
                    maxFiles={20}
                    disabled={processing}
                  />

                  {/* Reorder hint */}
                  {files.length > 1 && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <GripVertical className="h-4 w-4" />
                      <span>Files will be merged in the order shown above</span>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex flex-wrap gap-3">
                    <Button
                      onClick={handleMerge}
                      disabled={files.length < 2 || processing}
                      className="flex-1 sm:flex-none"
                    >
                      {processing && <Spinner className="mr-2" />}
                      {processing ? 'Merging...' : 'Merge PDFs'}
                    </Button>

                    {result && (
                      <Button onClick={handleDownload} variant="outline">
                        <Download className="mr-2 h-4 w-4" />
                        Download Merged PDF
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

            {/* Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">How to Merge PDFs</CardTitle>
                </CardHeader>
                <CardContent>
                  <ol className="space-y-3 text-sm text-muted-foreground">
                    <li className="flex gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                        1
                      </span>
                      <span>Upload two or more PDF files using the dropzone above</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                        2
                      </span>
                      <span>Reorder the files by dragging them to your desired order</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                        3
                      </span>
                      <span>Click "Merge PDFs" to combine them into one document</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                        4
                      </span>
                      <span>Download your merged PDF file</span>
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
                    Our PDF merger combines multiple PDF files into a single document while
                    preserving the original quality and formatting. All processing happens
                    in your browser for maximum privacy and speed.
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
