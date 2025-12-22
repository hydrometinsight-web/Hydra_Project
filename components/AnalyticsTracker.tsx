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

    // Track page view
    fetch('/api/analytics/track', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        path: pathname || '/',
        section,
      }),
    }).catch((error) => {
      console.error('Error tracking page view:', error)
    })
  }, [pathname])

  return null
}

