'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export default function AnalyticsTracker() {
  const pathname = usePathname()

  useEffect(() => {
    // Don't track admin pages
    if (pathname?.startsWith('/admin')) {
      return
    }

    // Determine section from pathname
    let section = 'home'
    if (pathname?.startsWith('/news') || pathname?.startsWith('/haber')) {
      section = 'news'
    } else if (pathname?.startsWith('/techinsight')) {
      section = 'techinsight'
    } else if (pathname?.startsWith('/event')) {
      section = 'event'
    } else if (pathname?.startsWith('/sponsor')) {
      section = 'sponsor'
    } else if (pathname?.startsWith('/calculations')) {
      section = 'calculations'
    } else if (pathname === '/') {
      section = 'home'
    }

    // Get country from browser (using Intl API as fallback)
    const getCountry = async () => {
      try {
        // Try to get country from IP geolocation API (free service)
        const response = await fetch('https://ipapi.co/json/')
        const data = await response.json()
        return data.country_code || null
      } catch {
        // Fallback: try to get from browser locale
        try {
          const locale = Intl.DateTimeFormat().resolvedOptions().locale
          // Extract country code from locale (e.g., 'en-US' -> 'US')
          const parts = locale.split('-')
          return parts.length > 1 ? parts[parts.length - 1] : null
        } catch {
          return null
        }
      }
    }

    // Track page view with country
    getCountry().then((country) => {
      fetch('/api/analytics/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          path: pathname || '/',
          section,
          country: country || null,
        }),
      }).catch((error) => {
        console.error('Error tracking page view:', error)
      })
    })
  }, [pathname])

  return null
}

