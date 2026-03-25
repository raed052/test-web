import { getToolById } from '@/lib/pdf-tools'
import { ComingSoonTool } from '@/components/pdf/coming-soon-tool'

export default function WordToPdfPage() {
  const tool = getToolById('word-to-pdf')!

  return (
    <ComingSoonTool
      tool={tool}
      features={[
        'Convert .doc and .docx files to PDF',
        'Preserve formatting and styles',
        'Maintain images and tables',
        'Keep hyperlinks active',
        'Support for complex documents',
      ]}
      reason="Word to PDF conversion requires server-side processing with LibreOffice or similar tools."
    />
  )
}
