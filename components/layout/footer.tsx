import Link from 'next/link'
import { FileText } from 'lucide-react'

const footerLinks = {
  tools: [
    { name: 'Merge PDF', href: '/tools/merge' },
    { name: 'Split PDF', href: '/tools/split' },
    { name: 'Compress PDF', href: '/tools/compress' },
    { name: 'Convert to PDF', href: '/tools/jpg-to-pdf' },
    { name: 'All Tools', href: '/tools' },
  ],
  company: [
    { name: 'About Us', href: '/about' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'API Documentation', href: '/api-docs' },
    { name: 'Blog', href: '/blog' },
  ],
  support: [
    { name: 'Help Center', href: '/support' },
    { name: 'Contact Us', href: '/contact' },
    { name: 'FAQ', href: '/faq' },
    { name: 'Status', href: '/status' },
  ],
  legal: [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Cookie Policy', href: '/cookies' },
  ],
}

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                <FileText className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">
                Mido <span className="text-primary">PDF</span>
              </span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">
              Free online PDF tools to merge, split, compress, convert, and edit your PDF files.
              Fast, secure, and easy to use.
            </p>
          </div>

          {/* Tools */}
          <div>
            <h3 className="mb-4 text-sm font-semibold">PDF Tools</h3>
            <ul className="space-y-2">
              {footerLinks.tools.map(link => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="mb-4 text-sm font-semibold">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map(link => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="mb-4 text-sm font-semibold">Support</h3>
            <ul className="space-y-2">
              {footerLinks.support.map(link => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="mb-4 text-sm font-semibold">Legal</h3>
            <ul className="space-y-2">
              {footerLinks.legal.map(link => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t pt-8 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Mido PDF Tools. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-xs text-muted-foreground">
              Made with care for document lovers everywhere
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
