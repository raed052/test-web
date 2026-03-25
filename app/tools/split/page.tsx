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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { FieldGroup, Field, FieldLabel } from '@/components/ui/field'
import { getToolById } from '@/lib/pdf-tools'
import { splitPdf, downloadAsZip, getPdfInfo } from '@/lib/pdf-processor'
import { Download, RefreshCw, Scissors, FileText } from 'lucide-react'
import { toast } from 'sonner'

export default function SplitPdfPage() {
  const tool = getToolById('split')!
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [processing, setProcessing] = useState(false)
  const [results, setResults] = useState<{ data: Uint8Array; filename: string }[]>([])
  const [pageCount, setPageCount] = useState<number>(0)
  const [splitMode, setSplitMode] = useState<'all' | 'range'>('all')
  const [rangeInput, setRangeInput] = useState('')

  const handleFileChange = async (newFiles: UploadedFile[]) => {
    setFiles(newFiles)
    setResults([])

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

  const parseRanges = (input: string): { start: number; end: number }[] | null => {
    const ranges: { start: number; end: number }[] = []
    const parts = input.split(',').map(p => p.trim())

    for (const part of parts) {
      if (part.includes('-')) {
        const [start, end] = part.split('-').map(n => parseInt(n.trim()))
        if (isNaN(start) || isNaN(end) || start < 1 || end < start || end > pageCount) {
          return null
        }
        ranges.push({ start, end })
      } else {
        const num = parseInt(part)
        if (isNaN(num) || num < 1 || num > pageCount) {
          return null
        }
        ranges.push({ start: num, end: num })
      }
    }

    return ranges.length > 0 ? ranges : null
  }

  const handleSplit = async () => {
    if (files.length === 0) {
      toast.error('Please upload a PDF file')
      return
    }

    setProcessing(true)
    setResults([])

    try {
      let ranges: { start: number; end: number }[] | undefined

      if (splitMode === 'range' && rangeInput) {
        const parsed = parseRanges(rangeInput)
        if (!parsed) {
          toast.error('Invalid range format. Use format like: 1-3, 5, 7-10')
          setProcessing(false)
          return
        }
        ranges = parsed
      }

      const splitResults = await splitPdf(files[0].file, ranges)
      const successResults = splitResults
        .filter(r => r.success && r.data)
        .map(r => ({ data: r.data!, filename: r.filename! }))

      if (successResults.length > 0) {
        setResults(successResults)
        toast.success(`PDF split into ${successResults.length} file(s)!`)
      } else {
        toast.error('Failed to split PDF')
      }
    } catch (error) {
      toast.error('An unexpected error occurred')
    } finally {
      setProcessing(false)
    }
  }

  const handleDownload = () => {
    if (results.length > 0) {
      downloadAsZip(results, 'split_pages.zip')
    }
  }

  const handleReset = () => {
    setFiles([])
    setResults([])
    setPageCount(0)
    setRangeInput('')
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
                    <div className="rounded-lg bg-muted p-4">
                      <div className="flex items-center gap-2 text-sm">
                        <FileText className="h-4 w-4 text-primary" />
                        <span>This PDF has <strong>{pageCount}</strong> pages</span>
                      </div>
                    </div>
                  )}

                  {files.length > 0 && (
                    <Tabs value={splitMode} onValueChange={(v) => setSplitMode(v as 'all' | 'range')}>
                      <TabsList>
                        <TabsTrigger value="all">Split All Pages</TabsTrigger>
                        <TabsTrigger value="range">Custom Range</TabsTrigger>
                      </TabsList>
                      <TabsContent value="all" className="pt-4">
                        <p className="text-sm text-muted-foreground">
                          Each page will be extracted as a separate PDF file.
                        </p>
                      </TabsContent>
                      <TabsContent value="range" className="pt-4">
                        <FieldGroup>
                          <Field>
                            <FieldLabel>Page Ranges</FieldLabel>
                            <Input
                              placeholder="e.g., 1-3, 5, 7-10"
                              value={rangeInput}
                              onChange={(e) => setRangeInput(e.target.value)}
                            />
                            <p className="mt-1 text-xs text-muted-foreground">
                              Enter page numbers or ranges separated by commas
                            </p>
                          </Field>
                        </FieldGroup>
                      </TabsContent>
                    </Tabs>
                  )}

                  <div className="flex flex-wrap gap-3">
                    <Button
                      onClick={handleSplit}
                      disabled={files.length === 0 || processing}
                      className="flex-1 sm:flex-none"
                    >
                      {processing && <Spinner className="mr-2" />}
                      <Scissors className="mr-2 h-4 w-4" />
                      {processing ? 'Splitting...' : 'Split PDF'}
                    </Button>

                    {results.length > 0 && (
                      <Button onClick={handleDownload} variant="outline">
                        <Download className="mr-2 h-4 w-4" />
                        Download All ({results.length} files)
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
                  <CardTitle className="text-base">How to Split a PDF</CardTitle>
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
                      <span>Choose to split all pages or select specific ranges</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                        3
                      </span>
                      <span>Click "Split PDF" to process</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                        4
                      </span>
                      <span>Download the split files as a ZIP archive</span>
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
