import { getToolById } from '@/lib/pdf-tools'
import { ComingSoonTool } from '@/components/pdf/coming-soon-tool'

export default function PdfToWordPage() {
  const tool = getToolById('pdf-to-word')!

  return (
    <ComingSoonTool
      tool={tool}
      features={[
        'Convert PDF to editable Word documents',
        'Preserve text formatting',
        'Maintain images and tables',
        'Keep document structure',
        'Support for complex layouts',
      ]}
      reason="PDF to Word conversion requires advanced OCR and document reconstruction capabilities."
    />
  )
}
