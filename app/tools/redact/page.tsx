import { getToolById } from '@/lib/pdf-tools'
import { PremiumToolPlaceholder } from '@/components/pdf/premium-tool-placeholder'

export default function RedactPdfPage() {
  const tool = getToolById('redact')!

  return (
    <PremiumToolPlaceholder
      tool={tool}
      features={[
        'Permanently remove sensitive information',
        'Redact text, images, and areas',
        'Search and redact patterns (SSN, emails)',
        'Black out or white out content',
        'GDPR and compliance-ready redaction',
      ]}
    />
  )
}
