import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from '@/components/ui/sonner'
import './globals.css'

const _geist = Geist({ subsets: ['latin'] })
const _geistMono = Geist_Mono({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'Mido PDF Tools - Free Online PDF Editor & Converter',
    template: '%s | Mido PDF Tools',
  },
  description:
    'Free online PDF tools to merge, split, compress, convert, edit, and protect your PDF files. AI-powered document processing with no software installation required.',
  keywords: [
    'PDF tools',
    'PDF editor',
    'merge PDF',
    'split PDF',
    'compress PDF',
    'convert PDF',
    'PDF to Word',
    'Word to PDF',
    'online PDF',
    'free PDF tools',
  ],
  authors: [{ name: 'Mido PDF Tools' }],
  creator: 'Mido PDF Tools',
  publisher: 'Mido PDF Tools',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://midopdf.com',
    siteName: 'Mido PDF Tools',
    title: 'Mido PDF Tools - Free Online PDF Editor & Converter',
    description:
      'Free online PDF tools to merge, split, compress, convert, edit, and protect your PDF files.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mido PDF Tools - Free Online PDF Editor & Converter',
    description:
      'Free online PDF tools to merge, split, compress, convert, edit, and protect your PDF files.',
  },
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/icon-light-32x32.png', media: '(prefers-color-scheme: light)' },
      { url: '/icon-dark-32x32.png', media: '(prefers-color-scheme: dark)' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#E85D4C' },
    { media: '(prefers-color-scheme: dark)', color: '#1a1a2e' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="font-sans antialiased min-h-screen flex flex-col">
        {children}
        <Toaster />
        <Analytics />
      </body>
    </html>
  )
}
