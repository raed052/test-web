import { getToolById } from '@/lib/pdf-tools'
import { PremiumToolPlaceholder } from '@/components/pdf/premium-tool-placeholder'

export default function AiTranslatePage() {
  const tool = getToolById('ai-translate')!

  return (
    <PremiumToolPlaceholder
      tool={tool}
      features={[
        'AI-powered PDF translation',
        'Support for 50+ languages',
        'Preserve original formatting',
        'Translate entire documents instantly',
        'Context-aware translations',
      ]}
      comingSoon
    />
  )
}
