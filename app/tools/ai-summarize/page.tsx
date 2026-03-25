import { getToolById } from '@/lib/pdf-tools'
import { PremiumToolPlaceholder } from '@/components/pdf/premium-tool-placeholder'

export default function AiSummarizePage() {
  const tool = getToolById('ai-summarize')!

  return (
    <PremiumToolPlaceholder
      tool={tool}
      features={[
        'AI-powered document summarization',
        'Extract key points and insights',
        'Generate executive summaries',
        'Customize summary length',
        'Support for long documents',
      ]}
      comingSoon
    />
  )
}
