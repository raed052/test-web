'use client'

import { useState, useRef } from 'react'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { ToolPageLayout } from '@/components/pdf/tool-page-layout'
import { FileDropzone, type UploadedFile } from '@/components/pdf/file-dropzone'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { FieldGroup, Field, FieldLabel } from '@/components/ui/field'
import { getToolById } from '@/lib/pdf-tools'
import { getPdfInfo } from '@/lib/pdf-processor'
import { PenTool, FileText, Type, Eraser, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'

export default function SignPdfPage() {
  const tool = getToolById('sign')!
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [pageCount, setPageCount] = useState(0)
  const [signatureMode, setSignatureMode] = useState<'draw' | 'type'>('type')
  const [typedSignature, setTypedSignature] = useState('')
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)

  const handleFileChange = async (newFiles: UploadedFile[]) => {
    setFiles(newFiles)

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

  const clearCanvas = () => {
    const canvas = canvasRef.current
    if (canvas) {
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
      }
    }
  }

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    setIsDrawing(true)
    const ctx = canvas.getContext('2d')
    if (ctx) {
      const rect = canvas.getBoundingClientRect()
      ctx.beginPath()
      ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top)
    }
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (ctx) {
      const rect = canvas.getBoundingClientRect()
      ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top)
      ctx.strokeStyle = '#000'
      ctx.lineWidth = 2
      ctx.lineCap = 'round'
      ctx.stroke()
    }
  }

  const stopDrawing = () => {
    setIsDrawing(false)
  }

  const handleSign = async () => {
    if (files.length === 0) {
      toast.error('Please upload a PDF file')
      return
    }

    toast.info('PDF signing with visual signature placement is coming soon!')
  }

  const handleReset = () => {
    setFiles([])
    setPageCount(0)
    setTypedSignature('')
    clearCanvas()
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
                  <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="font-medium text-sm">Coming Soon</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Visual PDF signing with signature placement is being developed.
                          You will be able to draw or type your signature and place it anywhere on the document.
                        </p>
                      </div>
                    </div>
                  </div>

                  <FileDropzone
                    files={files}
                    onFilesChange={handleFileChange}
                    maxFiles={1}
                  />

                  {pageCount > 0 && (
                    <>
                      <div className="rounded-lg bg-muted p-4">
                        <div className="flex items-center gap-2 text-sm">
                          <FileText className="h-4 w-4 text-primary" />
                          <span>This PDF has <strong>{pageCount}</strong> pages</span>
                        </div>
                      </div>

                      <Tabs value={signatureMode} onValueChange={(v) => setSignatureMode(v as 'draw' | 'type')}>
                        <TabsList>
                          <TabsTrigger value="type">
                            <Type className="mr-2 h-4 w-4" />
                            Type Signature
                          </TabsTrigger>
                          <TabsTrigger value="draw">
                            <PenTool className="mr-2 h-4 w-4" />
                            Draw Signature
                          </TabsTrigger>
                        </TabsList>

                        <TabsContent value="type" className="pt-4">
                          <FieldGroup>
                            <Field>
                              <FieldLabel>Your Signature</FieldLabel>
                              <Input
                                value={typedSignature}
                                onChange={(e) => setTypedSignature(e.target.value)}
                                placeholder="Type your name..."
                                className="font-serif text-xl"
                              />
                            </Field>
                          </FieldGroup>
                          {typedSignature && (
                            <div className="mt-4 p-4 border rounded-lg bg-white">
                              <p className="text-sm text-muted-foreground mb-2">Preview:</p>
                              <p className="font-serif text-2xl italic">{typedSignature}</p>
                            </div>
                          )}
                        </TabsContent>

                        <TabsContent value="draw" className="pt-4">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">Draw your signature below</span>
                              <Button variant="outline" size="sm" onClick={clearCanvas}>
                                <Eraser className="mr-2 h-4 w-4" />
                                Clear
                              </Button>
                            </div>
                            <canvas
                              ref={canvasRef}
                              width={400}
                              height={150}
                              className="w-full border rounded-lg bg-white cursor-crosshair"
                              onMouseDown={startDrawing}
                              onMouseMove={draw}
                              onMouseUp={stopDrawing}
                              onMouseLeave={stopDrawing}
                            />
                          </div>
                        </TabsContent>
                      </Tabs>
                    </>
                  )}

                  <div className="flex flex-wrap gap-3">
                    <Button
                      onClick={handleSign}
                      disabled={files.length === 0}
                      className="flex-1 sm:flex-none"
                    >
                      <PenTool className="mr-2 h-4 w-4" />
                      Sign PDF
                    </Button>

                    {files.length > 0 && (
                      <Button onClick={handleReset} variant="ghost">
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
                  <CardTitle className="text-base">How to Sign a PDF</CardTitle>
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
                      <span>Type or draw your signature</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                        3
                      </span>
                      <span>Click where you want to place it</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                        4
                      </span>
                      <span>Download your signed PDF</span>
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
