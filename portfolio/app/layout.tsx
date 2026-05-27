import type { Metadata } from 'next'
import './globals.css'
import { Providers } from './providers'
import { MagneticCursor } from '@/components/ui/MagneticCursor'
import { GlassDock } from '@/components/ui/GlassDock'
import { EasterEggs } from '@/components/ui/EasterEggs'

export const metadata: Metadata = {
  title: 'Savin Osuka — Digital Channels · Platform Reliability · FinTech Builder',
  description:
    'I build, operate, secure and scale digital experiences. Turning complex systems into seamless customer experiences across FinTech, Infrastructure, and Platform Engineering.',
  keywords: [
    'Savin Osuka',
    'Platform Reliability Engineer',
    'Digital Channels Engineer',
    'FinTech Engineer',
    'Infrastructure Engineer',
    'SRE',
    'Nairobi',
    'Kenya',
  ],
  authors: [{ name: 'Savin Osuka', url: 'https://github.com/savin2001' }],
  creator: 'Savin Osuka',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    title: 'Savin Osuka — Build. Operate. Secure. Scale.',
    description:
      'Digital Channels Engineer, Platform Reliability Engineer, FinTech Builder. Turning complex systems into seamless customer experiences.',
    siteName: 'Savin Osuka Portfolio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Savin Osuka — Build. Operate. Secure. Scale.',
    description: 'Digital Channels Engineer · Platform Reliability · FinTech Builder',
    creator: '@SavinOsuka',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <Providers>
          {/* Ambient effects */}
          <div className="noise-overlay" aria-hidden="true" />
          <div className="scan-line" aria-hidden="true" />

          {/* Custom cursor */}
          <MagneticCursor />

          {/* Navigation */}
          <GlassDock />

          {/* Main content */}
          <main>{children}</main>

          {/* Easter eggs handler */}
          <EasterEggs />
        </Providers>
      </body>
    </html>
  )
}
