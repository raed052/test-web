import { getToolById } from '@/lib/pdf-tools'
import { ComingSoonTool } from '@/components/pdf/coming-soon-tool'

export default function ExcelToPdfPage() {
  const tool = getToolById('excel-to-pdf')!

  return (
    <ComingSoonTool
      tool={tool}
      features={[
        'Convert .xls and .xlsx files to PDF',
        'Preserve cell formatting',
        'Maintain formulas results',
        'Support for multiple sheets',
        'Adjustable page layout options',
      ]}
      reason="Excel to PDF conversion requires server-side processing with LibreOffice or similar tools."
    />
  )
}
