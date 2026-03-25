import { getToolById } from '@/lib/pdf-tools'
import { ComingSoonTool } from '@/components/pdf/coming-soon-tool'

export default function PptToPdfPage() {
  const tool = getToolById('ppt-to-pdf')!

  return (
    <ComingSoonTool
      tool={tool}
      features={[
        'Convert .ppt and .pptx files to PDF',
        'Preserve slide layouts and designs',
        'Maintain animations as static images',
        'Keep embedded media references',
        'Support for speaker notes',
      ]}
      reason="PowerPoint to PDF conversion requires server-side processing with LibreOffice or similar tools."
    />
  )
}
