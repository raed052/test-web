import { getToolById } from '@/lib/pdf-tools'
import { ComingSoonTool } from '@/components/pdf/coming-soon-tool'

export default function PdfToPngPage() {
  const tool = getToolById('pdf-to-png')!

  return (
    <ComingSoonTool
      tool={tool}
      features={[
        'Convert PDF pages to PNG images',
        'Lossless image quality',
        'Support for transparency',
        'High resolution output',
        'Batch processing support',
      ]}
      reason="PDF to image conversion requires server-side rendering to generate high-quality images."
    />
  )
}
