import type { PdfTool } from './types'

export const PDF_TOOLS: PdfTool[] = [
  // Organize PDF
  { id: 'merge', name: 'Merge PDF', description: 'Combine multiple PDFs into one document', icon: 'merge', category: 'organize', path: '/tools/merge', isPremium: false },
  { id: 'split', name: 'Split PDF', description: 'Separate PDF pages into multiple files', icon: 'split', category: 'organize', path: '/tools/split', isPremium: false },
  { id: 'remove-pages', name: 'Remove Pages', description: 'Delete unwanted pages from your PDF', icon: 'remove', category: 'organize', path: '/tools/remove-pages', isPremium: false },
  { id: 'extract-pages', name: 'Extract Pages', description: 'Extract specific pages from a PDF', icon: 'extract', category: 'organize', path: '/tools/extract-pages', isPremium: false },
  { id: 'organize', name: 'Organize PDF', description: 'Reorder, rotate, and organize PDF pages', icon: 'organize', category: 'organize', path: '/tools/organize', isPremium: false },
  { id: 'rotate', name: 'Rotate PDF', description: 'Rotate PDF pages to any angle', icon: 'rotate', category: 'organize', path: '/tools/rotate', isPremium: false },

  // Optimize PDF
  { id: 'compress', name: 'Compress PDF', description: 'Reduce PDF file size while maintaining quality', icon: 'compress', category: 'optimize', path: '/tools/compress', isPremium: false },
  { id: 'repair', name: 'Repair PDF', description: 'Fix corrupted or damaged PDF files', icon: 'repair', category: 'optimize', path: '/tools/repair', isPremium: true },
  { id: 'ocr', name: 'OCR PDF', description: 'Make scanned PDFs searchable with OCR', icon: 'ocr', category: 'optimize', path: '/tools/ocr', isPremium: true },

  // Convert to PDF
  { id: 'jpg-to-pdf', name: 'JPG to PDF', description: 'Convert JPG images to PDF documents', icon: 'image', category: 'convert-to', path: '/tools/jpg-to-pdf', isPremium: false },
  { id: 'png-to-pdf', name: 'PNG to PDF', description: 'Convert PNG images to PDF documents', icon: 'image', category: 'convert-to', path: '/tools/png-to-pdf', isPremium: false },
  { id: 'word-to-pdf', name: 'Word to PDF', description: 'Convert Word documents to PDF', icon: 'word', category: 'convert-to', path: '/tools/word-to-pdf', isPremium: false },
  { id: 'excel-to-pdf', name: 'Excel to PDF', description: 'Convert Excel spreadsheets to PDF', icon: 'excel', category: 'convert-to', path: '/tools/excel-to-pdf', isPremium: false },
  { id: 'ppt-to-pdf', name: 'PowerPoint to PDF', description: 'Convert PowerPoint presentations to PDF', icon: 'powerpoint', category: 'convert-to', path: '/tools/ppt-to-pdf', isPremium: false },
  { id: 'html-to-pdf', name: 'HTML to PDF', description: 'Convert web pages to PDF documents', icon: 'html', category: 'convert-to', path: '/tools/html-to-pdf', isPremium: false },

  // Convert from PDF
  { id: 'pdf-to-jpg', name: 'PDF to JPG', description: 'Convert PDF pages to JPG images', icon: 'image', category: 'convert-from', path: '/tools/pdf-to-jpg', isPremium: false },
  { id: 'pdf-to-png', name: 'PDF to PNG', description: 'Convert PDF pages to PNG images', icon: 'image', category: 'convert-from', path: '/tools/pdf-to-png', isPremium: false },
  { id: 'pdf-to-word', name: 'PDF to Word', description: 'Convert PDF to editable Word documents', icon: 'word', category: 'convert-from', path: '/tools/pdf-to-word', isPremium: false },
  { id: 'pdf-to-excel', name: 'PDF to Excel', description: 'Convert PDF tables to Excel spreadsheets', icon: 'excel', category: 'convert-from', path: '/tools/pdf-to-excel', isPremium: false },
  { id: 'pdf-to-ppt', name: 'PDF to PowerPoint', description: 'Convert PDF to PowerPoint presentations', icon: 'powerpoint', category: 'convert-from', path: '/tools/pdf-to-ppt', isPremium: false },

  // Edit PDF
  { id: 'edit', name: 'Edit PDF', description: 'Edit text, images, and content in PDF', icon: 'edit', category: 'edit', path: '/tools/edit', isPremium: true },
  { id: 'add-page-numbers', name: 'Add Page Numbers', description: 'Add page numbers to your PDF', icon: 'numbers', category: 'edit', path: '/tools/add-page-numbers', isPremium: false },
  { id: 'add-watermark', name: 'Add Watermark', description: 'Add text or image watermark to PDF', icon: 'watermark', category: 'edit', path: '/tools/add-watermark', isPremium: false },
  { id: 'crop', name: 'Crop PDF', description: 'Crop PDF pages to remove margins', icon: 'crop', category: 'edit', path: '/tools/crop', isPremium: false },

  // Security
  { id: 'protect', name: 'Protect PDF', description: 'Add password protection to your PDF', icon: 'lock', category: 'security', path: '/tools/protect', isPremium: false },
  { id: 'unlock', name: 'Unlock PDF', description: 'Remove password from protected PDF', icon: 'unlock', category: 'security', path: '/tools/unlock', isPremium: false },
  { id: 'sign', name: 'Sign PDF', description: 'Add your signature to PDF documents', icon: 'signature', category: 'security', path: '/tools/sign', isPremium: false },
  { id: 'redact', name: 'Redact PDF', description: 'Permanently remove sensitive information', icon: 'redact', category: 'security', path: '/tools/redact', isPremium: true },

  // AI Intelligence
  { id: 'ai-summarize', name: 'AI Summarize', description: 'Get AI-powered summary of your PDF', icon: 'ai', category: 'ai', path: '/tools/ai-summarize', isPremium: true },
  { id: 'ai-translate', name: 'AI Translate', description: 'Translate PDF content to any language', icon: 'translate', category: 'ai', path: '/tools/ai-translate', isPremium: true },
  { id: 'ai-chat', name: 'Chat with PDF', description: 'Ask questions about your PDF content', icon: 'chat', category: 'ai', path: '/tools/ai-chat', isPremium: true },
]

export const TOOL_CATEGORIES = [
  { id: 'organize', name: 'Organize PDF', description: 'Merge, split, and organize your PDF pages' },
  { id: 'optimize', name: 'Optimize PDF', description: 'Compress and repair PDF files' },
  { id: 'convert-to', name: 'Convert to PDF', description: 'Convert images and documents to PDF' },
  { id: 'convert-from', name: 'Convert from PDF', description: 'Convert PDF to other formats' },
  { id: 'edit', name: 'Edit PDF', description: 'Edit and modify PDF content' },
  { id: 'security', name: 'PDF Security', description: 'Protect and secure your PDFs' },
  { id: 'ai', name: 'PDF Intelligence', description: 'AI-powered PDF analysis and processing' },
]

export function getToolsByCategory(category: string): PdfTool[] {
  return PDF_TOOLS.filter(tool => tool.category === category)
}

export function getToolById(id: string): PdfTool | undefined {
  return PDF_TOOLS.find(tool => tool.id === id)
}
