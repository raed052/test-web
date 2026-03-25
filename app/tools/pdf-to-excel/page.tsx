import { getToolById } from '@/lib/pdf-tools'
import { ComingSoonTool } from '@/components/pdf/coming-soon-tool'

export default function PdfToExcelPage() {
  const tool = getToolById('pdf-to-excel')!

  return (
    <ComingSoonTool
      tool={tool}
      features={[
        'Extract tables from PDF to Excel',
        'Smart table detection',
        'Preserve column structure',
        'Support for multiple tables',
        'Export to .xlsx format',
      ]}
      reason="PDF to Excel conversion requires intelligent table detection and data extraction."
    />
  )
}
