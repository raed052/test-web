import { getToolById } from '@/lib/pdf-tools'
import { PremiumToolPlaceholder } from '@/components/pdf/premium-tool-placeholder'

export default function OcrPdfPage() {
  const tool = getToolById('ocr')!

  return (
    <PremiumToolPlaceholder
      tool={tool}
      features={[
        'Convert scanned PDFs to searchable text',
        'Support for 100+ languages',
        'Preserve original layout and formatting',
        'Extract text from images in PDFs',
        'Batch processing for multiple files',
      ]}
    />
  )
}
