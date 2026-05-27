import type { Metadata } from 'next'
import './globals.css'
import { Providers } from './providers'
import { MagneticCursor } from '@/components/ui/MagneticCursor'
import { GlassDock } from '@/components/ui/GlassDock'
import { EasterEggs } from '@/components/ui/EasterEggs'

export const metadata: Metadata = {
  title: 'Savin Osuka — Systems Engineer',
  description:
    'I build payment infrastructure, platform reliability, and digital channel systems. Based in Nairobi, working globally.',
  keywords: [
    'Savin Osuka',
    'Systems Engineer',
    'FinTech Engineer',
    'SRE',
    'Platform Engineer',
    'Nairobi',
    'Kenya',
    'M-Pesa',
  ],
  authors: [{ name: 'Savin Osuka', url: 'https://github.com/savin2001' }],
  creator: 'Savin Osuka',
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    title: 'Savin Osuka — Systems Engineer',
    description:
      'Payment infrastructure · Platform reliability · Digital channels. I build the systems behind seamless customer experiences.',
    siteName: 'Savin Osuka',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Savin Osuka — Systems Engineer',
    description: 'Payment infrastructure · Platform reliability · Digital channels. Nairobi → Global.',
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Person',
              name: 'Savin Osuka',
              jobTitle: 'Systems Engineer',
              description:
                'I build payment infrastructure, platform reliability, and digital channel systems. Based in Nairobi, working globally.',
              url: 'https://savin-osuka.netlify.app',
              email: 'osukasavin@gmail.com',
              address: {
                '@type': 'PostalAddress',
                addressLocality: 'Nairobi',
                addressCountry: 'KE',
              },
              sameAs: [
                'https://github.com/savin2001',
                'https://linkedin.com/in/savin-osuka-320225350',
                'https://twitter.com/SavinOsuka',
              ],
              knowsAbout: [
                'FinTech Engineering',
                'Payment Infrastructure',
                'Platform Reliability Engineering',
                'Digital Channels',
                'Cloud Infrastructure',
                'Security Engineering',
                'M-Pesa Integration',
                'Anthropic Claude API',
              ],
            }),
          }}
        />
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
