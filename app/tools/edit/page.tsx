import { getToolById } from '@/lib/pdf-tools'
import { PremiumToolPlaceholder } from '@/components/pdf/premium-tool-placeholder'

export default function EditPdfPage() {
  const tool = getToolById('edit')!

  return (
    <PremiumToolPlaceholder
      tool={tool}
      features={[
        'Edit text directly in PDF',
        'Add and modify images',
        'Change fonts and colors',
        'Resize and move elements',
        'Add new text blocks anywhere',
      ]}
    />
  )
}
