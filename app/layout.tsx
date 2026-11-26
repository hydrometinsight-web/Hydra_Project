import { SITE_URL } from '@/lib/site'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import LayoutWrapper from '@/components/LayoutWrapper'
import AnalyticsTracker from '@/components/AnalyticsTracker'
import { Analytics } from '@vercel/analytics/next'
import ConditionalScripts from '@/components/ConditionalScripts'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'HydroMetInsight: Hydrometallurgy & Battery Recycling News',
    template: '%s | HydroMetInsight',
  },
  description: 'Independent news and technical insight on hydrometallurgy, battery recycling, rare earths and critical metals for engineers and industry professionals.',
  applicationName: 'HydroMetInsight',
  keywords: [
    'hydrometallurgy',
    'critical metals',
    'battery recycling',
    'mining technology',
    'metal extraction',
    'sustainable mining',
    'chemical engineering',
    'metallurgical processes',
  ],
  authors: [{ name: 'HydroMetInsight' }],
  creator: 'HydroMetInsight',
  publisher: 'HydroMetInsight',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: 'HydroMetInsight',
    title: 'HydroMetInsight: Hydrometallurgy & Battery Recycling News',
    description: 'Independent news and technical insight on hydrometallurgy, battery recycling, rare earths and critical metals.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'HydroMetInsight – Hydrometallurgy, Battery Recycling and Critical Metals',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HydroMetInsight: Hydrometallurgy & Battery Recycling News',
    description: 'Independent news and technical insight on hydrometallurgy, battery recycling, rare earths and critical metals.',
    images: ['/og-image.png'],
    creator: '@hydrometinsight',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  // Square icons on the brand navy so they stay visible in Google results and browser tabs.
  // No site-wide canonical here: each page declares its own (a root canonical would point every page at "/").
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon-48.png', sizes: '48x48', type: 'image/png' },
      { url: '/icon-96.png', sizes: '96x96', type: 'image/png' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
  },
  manifest: '/manifest.webmanifest',
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="google-adsense-account" content="ca-pub-2342049878330495" />
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2342049878330495"
          crossOrigin="anonymous"
          strategy="beforeInteractive"
        />
      </head>
      <body className={inter.className}>
        <ConditionalScripts />
        <AnalyticsTracker />
        <LayoutWrapper>{children}</LayoutWrapper>
        <Analytics />
      </body>
    </html>
  )
}

