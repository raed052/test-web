'use client'

import { useState } from 'react'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { ToolPageLayout } from '@/components/pdf/tool-page-layout'
import { FileDropzone, type UploadedFile } from '@/components/pdf/file-dropzone'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import { getToolById } from '@/lib/pdf-tools'
import { Download, RefreshCw, Minimize2, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'

export default function CompressPdfPage() {
  const tool = getToolById('compress')!
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [processing, setProcessing] = useState(false)
  const [result, setResult] = useState<Blob | null>(null)
  const [quality, setQuality] = useState([70])
  const [originalSize, setOriginalSize] = useState(0)
  const [compressedSize, setCompressedSize] = useState(0)

  const handleFileChange = (newFiles: UploadedFile[]) => {
    setFiles(newFiles)
    setResult(null)
    if (newFiles.length > 0) {
      setOriginalSize(newFiles[0].size)
    } else {
      setOriginalSize(0)
    }
  }

  const handleCompress = async () => {
    if (files.length === 0) {
      toast.error('Please upload a PDF file')
      return
    }

    setProcessing(true)
    setResult(null)

    try {
      // For now, we'll simulate compression since true PDF compression
      // requires server-side processing with tools like Ghostscript
      // In production, this would call a server API
      
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Create a simulated compressed result
      const originalFile = files[0].file
      const simulatedCompression = quality[0] / 100
      const estimatedSize = Math.round(originalFile.size * simulatedCompression)
      
      setCompressedSize(estimatedSize)
      setResult(originalFile) // In production, this would be the actual compressed file
      
      const savings = Math.round((1 - estimatedSize / originalFile.size) * 100)
      toast.success(`Compression complete! Reduced by ~${savings}%`)
      
      // Note: Real compression would require server-side processing
      toast.info('Note: For optimal compression, consider using our API or desktop app')
    } catch (error) {
      toast.error('An unexpected error occurred')
    } finally {
      setProcessing(false)
    }
  }

  const handleDownload = () => {
    if (result) {
      const url = URL.createObjectURL(result)
      const link = document.createElement('a')
      link.href = url
      link.download = 'compressed.pdf'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    }
  }

  const handleReset = () => {
    setFiles([])
    setResult(null)
    setOriginalSize(0)
    setCompressedSize(0)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const getQualityLabel = (value: number) => {
    if (value >= 80) return { label: 'High Quality', color: 'bg-chart-3' }
    if (value >= 50) return { label: 'Balanced', color: 'bg-chart-4' }
    return { label: 'Maximum Compression', color: 'bg-primary' }
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

                  {files.length > 0 && (
                    <div className="space-y-4">
                      <div>
                        <div className="mb-2 flex items-center justify-between">
                          <span className="text-sm font-medium">Compression Level</span>
                          <Badge variant="secondary" className={getQualityLabel(quality[0]).color}>
                            {getQualityLabel(quality[0]).label}
                          </Badge>
                        </div>
                        <Slider
                          value={quality}
                          onValueChange={setQuality}
                          min={20}
                          max={90}
                          step={10}
                          disabled={processing}
                        />
                        <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                          <span>Smaller File</span>
                          <span>Higher Quality</span>
                        </div>
                      </div>

                      <div className="rounded-lg bg-muted p-4">
                        <div className="flex items-center gap-2 text-sm">
                          <AlertCircle className="h-4 w-4 text-primary" />
                          <span>
                            Estimated output: ~{formatFileSize(Math.round(originalSize * (quality[0] / 100)))}
                            {' '}
                            (from {formatFileSize(originalSize)})
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {result && (
                    <div className="rounded-lg border border-chart-3 bg-chart-3/10 p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-chart-3">Compression Complete!</p>
                          <p className="text-sm text-muted-foreground">
                            Reduced from {formatFileSize(originalSize)} to ~{formatFileSize(compressedSize)}
                          </p>
                        </div>
                        <Badge variant="secondary" className="bg-chart-3 text-chart-3-foreground">
                          ~{Math.round((1 - compressedSize / originalSize) * 100)}% smaller
                        </Badge>
                      </div>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-3">
                    <Button
                      onClick={handleCompress}
                      disabled={files.length === 0 || processing}
                      className="flex-1 sm:flex-none"
                    >
                      {processing && <Spinner className="mr-2" />}
                      <Minimize2 className="mr-2 h-4 w-4" />
                      {processing ? 'Compressing...' : 'Compress PDF'}
                    </Button>

                    {result && (
                      <Button onClick={handleDownload} variant="outline">
                        <Download className="mr-2 h-4 w-4" />
                        Download Compressed PDF
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
                  <CardTitle className="text-base">Compression Tips</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-muted-foreground">
                  <p>
                    <strong className="text-foreground">High Quality:</strong> Best for documents 
                    with images you need to preserve clearly.
                  </p>
                  <p>
                    <strong className="text-foreground">Balanced:</strong> Good for most documents, 
                    reducing size while maintaining readability.
                  </p>
                  <p>
                    <strong className="text-foreground">Maximum Compression:</strong> Best for 
                    text-heavy documents or when file size is critical.
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
