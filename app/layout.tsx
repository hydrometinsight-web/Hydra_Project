import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import LayoutWrapper from '@/components/LayoutWrapper'
import AnalyticsTracker from '@/components/AnalyticsTracker'
import ConditionalScripts from '@/components/ConditionalScripts'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: 'HydroMetInsight - Hydrometallurgy News and Content Platform',
    template: '%s | HydroMetInsight',
  },
  description: 'Latest news, research, and developments in hydrometallurgy, critical metals, and battery recycling. Independent insights for engineers and industry experts.',
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
    title: 'HydroMetInsight - Hydrometallurgy News and Content Platform',
    description: 'Latest news, research, and developments in hydrometallurgy, critical metals, and battery recycling.',
    images: [
      {
        url: '/logo1.png',
        width: 1200,
        height: 630,
        alt: 'HydroMetInsight Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HydroMetInsight - Hydrometallurgy News and Content Platform',
    description: 'Latest news, research, and developments in hydrometallurgy, critical metals, and battery recycling.',
    images: ['/logo1.png'],
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
  icons: {
    icon: '/logo1.png',
    shortcut: '/logo1.png',
    apple: '/logo1.png',
  },
  alternates: {
    canonical: '/',
  },
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
      <body className={inter.className}>
        <ConditionalScripts />
        <AnalyticsTracker />
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  )
}

