import { getToolById } from '@/lib/pdf-tools'
import { ComingSoonTool } from '@/components/pdf/coming-soon-tool'

export default function HtmlToPdfPage() {
  const tool = getToolById('html-to-pdf')!

  return (
    <ComingSoonTool
      tool={tool}
      features={[
        'Convert web pages to PDF',
        'Capture full page or visible area',
        'Preserve CSS styling',
        'Handle dynamic content',
        'Custom page size options',
      ]}
      reason="HTML to PDF conversion requires server-side rendering with Puppeteer or similar tools."
    />
  )
}
