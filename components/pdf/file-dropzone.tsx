'use client'

import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { cn } from '@/lib/utils'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Upload, FileText, X, AlertCircle } from 'lucide-react'

export interface UploadedFile {
  id: string
  file: File
  name: string
  size: number
  progress: number
  status: 'uploading' | 'ready' | 'processing' | 'done' | 'error'
  error?: string
}

interface FileDropzoneProps {
  accept?: Record<string, string[]>
  maxFiles?: number
  maxSize?: number // in bytes
  files: UploadedFile[]
  onFilesChange: (files: UploadedFile[]) => void
  disabled?: boolean
  className?: string
}

export function FileDropzone({
  accept = { 'application/pdf': ['.pdf'] },
  maxFiles = 10,
  maxSize = 100 * 1024 * 1024, // 100MB default
  files,
  onFilesChange,
  disabled = false,
  className,
}: FileDropzoneProps) {
  const [dragError, setDragError] = useState<string | null>(null)

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: any[]) => {
      setDragError(null)

      if (rejectedFiles.length > 0) {
        const errors = rejectedFiles.map(f => f.errors[0]?.message).join(', ')
        setDragError(errors)
        return
      }

      if (files.length + acceptedFiles.length > maxFiles) {
        setDragError(`Maximum ${maxFiles} files allowed`)
        return
      }

      const newFiles: UploadedFile[] = acceptedFiles.map(file => ({
        id: Math.random().toString(36).substr(2, 9),
        file,
        name: file.name,
        size: file.size,
        progress: 100,
        status: 'ready' as const,
      }))

      onFilesChange([...files, ...newFiles])
    },
    [files, maxFiles, onFilesChange]
  )

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept,
    maxFiles: maxFiles - files.length,
    maxSize,
    disabled,
    multiple: maxFiles > 1,
  })

  const removeFile = (id: string) => {
    onFilesChange(files.filter(f => f.id !== id))
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={cn(
          'relative cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition-all',
          isDragActive && !isDragReject && 'border-primary bg-primary/5',
          isDragReject && 'border-destructive bg-destructive/5',
          disabled && 'cursor-not-allowed opacity-50',
          !isDragActive && !isDragReject && 'border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50'
        )}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-4">
          <div
            className={cn(
              'flex h-16 w-16 items-center justify-center rounded-full',
              isDragActive && !isDragReject ? 'bg-primary/10' : 'bg-muted'
            )}
          >
            <Upload
              className={cn(
                'h-8 w-8',
                isDragActive && !isDragReject ? 'text-primary' : 'text-muted-foreground'
              )}
            />
          </div>
          <div>
            <p className="text-lg font-medium">
              {isDragActive ? 'Drop your files here' : 'Drag & drop your PDF files'}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              or click to browse (max {formatFileSize(maxSize)} per file)
            </p>
          </div>
          <Button type="button" variant="outline" disabled={disabled}>
            Select Files
          </Button>
        </div>
      </div>

      {/* Error Message */}
      {dragError && (
        <div className="flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {dragError}
        </div>
      )}

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-2">
          {files.map(file => (
            <Card key={file.id} className="flex items-center gap-3 p-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{file.name}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{formatFileSize(file.size)}</span>
                  {file.status === 'uploading' && (
                    <>
                      <span>•</span>
                      <span>{file.progress}%</span>
                    </>
                  )}
                  {file.status === 'error' && (
                    <>
                      <span>•</span>
                      <span className="text-destructive">{file.error}</span>
                    </>
                  )}
                </div>
                {file.status === 'uploading' && (
                  <Progress value={file.progress} className="mt-1 h-1" />
                )}
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="shrink-0"
                onClick={() => removeFile(file.id)}
                disabled={file.status === 'processing'}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Remove file</span>
              </Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
