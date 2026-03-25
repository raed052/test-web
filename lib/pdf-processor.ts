// PDF Processing utilities using pdf-lib
import { PDFDocument } from 'pdf-lib'

export interface ProcessingResult {
  success: boolean
  data?: Uint8Array
  filename?: string
  error?: string
}

// Merge multiple PDFs into one
export async function mergePdfs(files: File[]): Promise<ProcessingResult> {
  try {
    const mergedPdf = await PDFDocument.create()

    for (const file of files) {
      const arrayBuffer = await file.arrayBuffer()
      const pdf = await PDFDocument.load(arrayBuffer)
      const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices())
      copiedPages.forEach(page => mergedPdf.addPage(page))
    }

    const pdfBytes = await mergedPdf.save()
    return {
      success: true,
      data: pdfBytes,
      filename: 'merged.pdf',
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to merge PDFs',
    }
  }
}

// Split PDF into individual pages or ranges
export async function splitPdf(
  file: File,
  ranges?: { start: number; end: number }[]
): Promise<ProcessingResult[]> {
  try {
    const arrayBuffer = await file.arrayBuffer()
    const pdf = await PDFDocument.load(arrayBuffer)
    const totalPages = pdf.getPageCount()
    const results: ProcessingResult[] = []

    if (ranges && ranges.length > 0) {
      // Split by ranges
      for (let i = 0; i < ranges.length; i++) {
        const { start, end } = ranges[i]
        const newPdf = await PDFDocument.create()
        const pageIndices = []
        for (let j = start - 1; j < end && j < totalPages; j++) {
          pageIndices.push(j)
        }
        const copiedPages = await newPdf.copyPages(pdf, pageIndices)
        copiedPages.forEach(page => newPdf.addPage(page))
        const pdfBytes = await newPdf.save()
        results.push({
          success: true,
          data: pdfBytes,
          filename: `split_${i + 1}.pdf`,
        })
      }
    } else {
      // Split into individual pages
      for (let i = 0; i < totalPages; i++) {
        const newPdf = await PDFDocument.create()
        const [copiedPage] = await newPdf.copyPages(pdf, [i])
        newPdf.addPage(copiedPage)
        const pdfBytes = await newPdf.save()
        results.push({
          success: true,
          data: pdfBytes,
          filename: `page_${i + 1}.pdf`,
        })
      }
    }

    return results
  } catch (error) {
    return [{
      success: false,
      error: error instanceof Error ? error.message : 'Failed to split PDF',
    }]
  }
}

// Extract specific pages from PDF
export async function extractPages(
  file: File,
  pageNumbers: number[]
): Promise<ProcessingResult> {
  try {
    const arrayBuffer = await file.arrayBuffer()
    const pdf = await PDFDocument.load(arrayBuffer)
    const newPdf = await PDFDocument.create()
    
    const pageIndices = pageNumbers.map(n => n - 1).filter(i => i >= 0 && i < pdf.getPageCount())
    const copiedPages = await newPdf.copyPages(pdf, pageIndices)
    copiedPages.forEach(page => newPdf.addPage(page))

    const pdfBytes = await newPdf.save()
    return {
      success: true,
      data: pdfBytes,
      filename: 'extracted.pdf',
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to extract pages',
    }
  }
}

// Remove pages from PDF
export async function removePages(
  file: File,
  pageNumbers: number[]
): Promise<ProcessingResult> {
  try {
    const arrayBuffer = await file.arrayBuffer()
    const pdf = await PDFDocument.load(arrayBuffer)
    const totalPages = pdf.getPageCount()
    
    const pagesToKeep = []
    for (let i = 0; i < totalPages; i++) {
      if (!pageNumbers.includes(i + 1)) {
        pagesToKeep.push(i)
      }
    }

    const newPdf = await PDFDocument.create()
    const copiedPages = await newPdf.copyPages(pdf, pagesToKeep)
    copiedPages.forEach(page => newPdf.addPage(page))

    const pdfBytes = await newPdf.save()
    return {
      success: true,
      data: pdfBytes,
      filename: 'modified.pdf',
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to remove pages',
    }
  }
}

// Rotate pages in PDF
export async function rotatePages(
  file: File,
  rotation: 90 | 180 | 270,
  pageNumbers?: number[]
): Promise<ProcessingResult> {
  try {
    const arrayBuffer = await file.arrayBuffer()
    const pdf = await PDFDocument.load(arrayBuffer)
    const pages = pdf.getPages()

    pages.forEach((page, index) => {
      if (!pageNumbers || pageNumbers.includes(index + 1)) {
        const currentRotation = page.getRotation().angle
        page.setRotation({ type: 'degrees', angle: (currentRotation + rotation) % 360 })
      }
    })

    const pdfBytes = await pdf.save()
    return {
      success: true,
      data: pdfBytes,
      filename: 'rotated.pdf',
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to rotate pages',
    }
  }
}

// Get PDF metadata and page count
export async function getPdfInfo(file: File): Promise<{
  pageCount: number
  title?: string
  author?: string
  subject?: string
  creator?: string
}> {
  const arrayBuffer = await file.arrayBuffer()
  const pdf = await PDFDocument.load(arrayBuffer)
  
  return {
    pageCount: pdf.getPageCount(),
    title: pdf.getTitle(),
    author: pdf.getAuthor(),
    subject: pdf.getSubject(),
    creator: pdf.getCreator(),
  }
}

// Add page numbers to PDF
export async function addPageNumbers(
  file: File,
  position: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right' = 'bottom-center',
  startNumber: number = 1
): Promise<ProcessingResult> {
  try {
    const arrayBuffer = await file.arrayBuffer()
    const pdf = await PDFDocument.load(arrayBuffer)
    const pages = pdf.getPages()
    const { rgb } = await import('pdf-lib')

    for (let i = 0; i < pages.length; i++) {
      const page = pages[i]
      const { width, height } = page.getSize()
      const pageNumber = String(startNumber + i)
      
      let x: number, y: number
      const margin = 40
      const fontSize = 12

      switch (position) {
        case 'top-left':
          x = margin
          y = height - margin
          break
        case 'top-center':
          x = width / 2 - fontSize / 2
          y = height - margin
          break
        case 'top-right':
          x = width - margin - fontSize
          y = height - margin
          break
        case 'bottom-left':
          x = margin
          y = margin
          break
        case 'bottom-center':
          x = width / 2 - fontSize / 2
          y = margin
          break
        case 'bottom-right':
          x = width - margin - fontSize
          y = margin
          break
      }

      page.drawText(pageNumber, {
        x,
        y,
        size: fontSize,
        color: rgb(0.2, 0.2, 0.2),
      })
    }

    const pdfBytes = await pdf.save()
    return {
      success: true,
      data: pdfBytes,
      filename: 'numbered.pdf',
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to add page numbers',
    }
  }
}

// Convert images to PDF
export async function imagesToPdf(files: File[]): Promise<ProcessingResult> {
  try {
    const pdf = await PDFDocument.create()

    for (const file of files) {
      const arrayBuffer = await file.arrayBuffer()
      const uint8Array = new Uint8Array(arrayBuffer)
      
      let image
      if (file.type === 'image/jpeg' || file.type === 'image/jpg') {
        image = await pdf.embedJpg(uint8Array)
      } else if (file.type === 'image/png') {
        image = await pdf.embedPng(uint8Array)
      } else {
        continue // Skip unsupported formats
      }

      const page = pdf.addPage([image.width, image.height])
      page.drawImage(image, {
        x: 0,
        y: 0,
        width: image.width,
        height: image.height,
      })
    }

    const pdfBytes = await pdf.save()
    return {
      success: true,
      data: pdfBytes,
      filename: 'converted.pdf',
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to convert images to PDF',
    }
  }
}

// Download helper
export function downloadPdf(data: Uint8Array, filename: string) {
  const blob = new Blob([data], { type: 'application/pdf' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

// Download multiple files as zip
export async function downloadAsZip(files: { data: Uint8Array; filename: string }[], zipName: string) {
  const JSZip = (await import('jszip')).default
  const zip = new JSZip()

  files.forEach(file => {
    zip.file(file.filename, file.data)
  })

  const blob = await zip.generateAsync({ type: 'blob' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = zipName
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
