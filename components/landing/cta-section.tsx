import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, FileText } from 'lucide-react'

export function CtaSection() {
  return (
    <section className="bg-primary py-20 lg:py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-foreground/10">
              <FileText className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <h2 className="text-balance text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl">
            Ready to Transform Your PDFs?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-pretty text-primary-foreground/80">
            Join thousands of users who trust Mido PDF Tools for their document needs.
            Start for free, no credit card required.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/tools">
              <Button
                size="lg"
                variant="secondary"
                className="h-12 px-8 text-base"
              >
                Get Started Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/pricing">
              <Button
                size="lg"
                variant="outline"
                className="h-12 px-8 text-base border-primary-foreground/20 bg-transparent text-primary-foreground hover:bg-primary-foreground/10"
              >
                View Pricing
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
