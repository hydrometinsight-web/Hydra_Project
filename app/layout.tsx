import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import LayoutWrapper from '@/components/LayoutWrapper'
import AnalyticsTracker from '@/components/AnalyticsTracker'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'HydroMetInsight - Hydrometallurgy News and Content Platform',
  description: 'Latest news, research and developments in the field of hydrometallurgy',
  icons: {
    icon: '/logo1.png',
    shortcut: '/logo1.png',
    apple: '/logo1.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const adsenseId = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ID

  return (
    <html lang="en">
      <body className={inter.className}>
        {adsenseId && (
          <>
            <Script
              id="adsense-config"
              strategy="beforeInteractive"
              dangerouslySetInnerHTML={{
                __html: `window.__ADSENSE_ID__ = "${adsenseId}";`,
              }}
            />
            <Script
              async
              src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseId}`}
              crossOrigin="anonymous"
              strategy="afterInteractive"
            />
          </>
        )}
        <AnalyticsTracker />
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  )
}

