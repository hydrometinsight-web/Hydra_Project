'use client'

import { useEffect, useState } from 'react'
import Script from 'next/script'

interface CookiePreferences {
  essential: boolean
  analytics: boolean
  marketing: boolean
}

const COOKIE_PREFERENCES_KEY = 'cookie-preferences'

export default function ConditionalScripts() {
  const [preferences, setPreferences] = useState<CookiePreferences | null>(null)
  const adsenseId = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ID

  useEffect(() => {
    // Load cookie preferences
    const loadPreferences = () => {
      const saved = localStorage.getItem(COOKIE_PREFERENCES_KEY)
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          setPreferences(parsed)
        } catch (error) {
          console.error('Error parsing cookie preferences:', error)
        }
      } else {
        // Default: only essential cookies
        setPreferences({
          essential: true,
          analytics: false,
          marketing: false,
        })
      }
    }

    loadPreferences()

    // Listen for cookie consent updates
    const handleConsentUpdate = (event: CustomEvent) => {
      setPreferences(event.detail)
    }

    window.addEventListener('cookieConsentUpdated', handleConsentUpdate as EventListener)

    return () => {
      window.removeEventListener('cookieConsentUpdated', handleConsentUpdate as EventListener)
    }
  }, [])

  // Don't load scripts until preferences are loaded
  if (preferences === null) {
    return null
  }

  return (
    <>
      {/* Analytics Scripts - Only load if analytics cookies are accepted */}
      {preferences.analytics && (
        <>
          {/* Google Analytics can be added here if needed */}
          {/* Example:
          <Script
            strategy="afterInteractive"
            src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'GA_MEASUREMENT_ID');
            `}
          </Script>
          */}
        </>
      )}

      {/* AdSense Scripts - Only load if marketing cookies are accepted */}
      {preferences.marketing && adsenseId && (
        <>
          <Script
            id="adsense-config"
            strategy="afterInteractive"
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
    </>
  )
}

