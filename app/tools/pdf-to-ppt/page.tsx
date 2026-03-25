import { getToolById } from '@/lib/pdf-tools'
import { ComingSoonTool } from '@/components/pdf/coming-soon-tool'

export default function PdfToPptPage() {
  const tool = getToolById('pdf-to-ppt')!

  return (
    <ComingSoonTool
      tool={tool}
      features={[
        'Convert PDF pages to PowerPoint slides',
        'Preserve slide layouts',
        'Extract editable text',
        'Maintain images and graphics',
        'Export to .pptx format',
      ]}
      reason="PDF to PowerPoint conversion requires advanced layout analysis and reconstruction."
    />
  )
}
