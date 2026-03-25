import { getToolById } from '@/lib/pdf-tools'
import { PremiumToolPlaceholder } from '@/components/pdf/premium-tool-placeholder'

export default function AiChatPage() {
  const tool = getToolById('ai-chat')!

  return (
    <PremiumToolPlaceholder
      tool={tool}
      features={[
        'Ask questions about your PDF',
        'Get instant answers from document content',
        'Find specific information quickly',
        'Summarize sections on demand',
        'Multi-document conversations',
      ]}
      comingSoon
    />
  )
}
