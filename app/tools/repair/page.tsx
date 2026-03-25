import { getToolById } from '@/lib/pdf-tools'
import { PremiumToolPlaceholder } from '@/components/pdf/premium-tool-placeholder'

export default function RepairPdfPage() {
  const tool = getToolById('repair')!

  return (
    <PremiumToolPlaceholder
      tool={tool}
      features={[
        'Fix corrupted PDF files',
        'Recover damaged documents',
        'Repair broken internal structures',
        'Restore unreadable PDFs',
        'Preserve original content when possible',
      ]}
    />
  )
}
