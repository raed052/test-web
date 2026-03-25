import { getToolById } from '@/lib/pdf-tools'
import { ComingSoonTool } from '@/components/pdf/coming-soon-tool'

export default function PdfToJpgPage() {
  const tool = getToolById('pdf-to-jpg')!

  return (
    <ComingSoonTool
      tool={tool}
      features={[
        'Convert PDF pages to JPG images',
        'Adjustable image quality',
        'Custom DPI settings',
        'Batch convert all pages',
        'Download as individual files or ZIP',
      ]}
      reason="PDF to image conversion requires server-side rendering to generate high-quality images."
    />
  )
}
