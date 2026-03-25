import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Shield,
  Zap,
  Globe,
  Smartphone,
  Cloud,
  Code,
  Lock,
  Sparkles,
} from 'lucide-react'

const features = [
  {
    icon: Shield,
    title: 'Secure & Private',
    description:
      'Your files are encrypted and automatically deleted after processing. We never access your content.',
    color: 'text-accent',
    bgColor: 'bg-accent/10',
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description:
      'Process your PDFs in seconds, not minutes. Our optimized engine handles files of any size.',
    color: 'text-primary',
    bgColor: 'bg-primary/10',
  },
  {
    icon: Sparkles,
    title: 'AI-Powered',
    description:
      'Summarize documents, translate content, and chat with your PDFs using advanced AI technology.',
    color: 'text-chart-5',
    bgColor: 'bg-chart-5/10',
  },
  {
    icon: Globe,
    title: 'Works Everywhere',
    description:
      'Use Mido PDF from any browser on any device. No software installation required.',
    color: 'text-chart-2',
    bgColor: 'bg-chart-2/10',
  },
  {
    icon: Smartphone,
    title: 'Mobile Ready',
    description:
      'Install as a PWA on your phone or tablet for native-like experience with offline support.',
    color: 'text-chart-4',
    bgColor: 'bg-chart-4/10',
  },
  {
    icon: Code,
    title: 'Developer API',
    description:
      'Integrate PDF processing into your applications with our comprehensive REST API.',
    color: 'text-chart-3',
    bgColor: 'bg-chart-3/10',
  },
  {
    icon: Cloud,
    title: 'Cloud Integration',
    description:
      'Connect with Google Drive, Dropbox, and OneDrive to access your files from anywhere.',
    color: 'text-chart-2',
    bgColor: 'bg-chart-2/10',
  },
  {
    icon: Lock,
    title: 'No Watermarks',
    description:
      'Premium users get clean output without any watermarks or branding on their documents.',
    color: 'text-primary',
    bgColor: 'bg-primary/10',
  },
]

export function FeaturesSection() {
  return (
    <section className="py-20 lg:py-28">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <Badge variant="outline" className="mb-4">
            Why Choose Us
          </Badge>
          <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
            Built for Everyone
          </h2>
          <p className="mt-4 text-pretty text-muted-foreground">
            Whether you're a student, professional, or developer, Mido PDF has the features you need.
          </p>
        </div>

        {/* Features Grid */}
        <div className="mx-auto grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <Card key={index} className="border-0 bg-muted/50">
              <CardContent className="p-6">
                <div
                  className={`mb-4 flex h-12 w-12 items-center justify-center rounded-lg ${feature.bgColor}`}
                >
                  <feature.icon className={`h-6 w-6 ${feature.color}`} />
                </div>
                <h3 className="mb-2 font-semibold">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
