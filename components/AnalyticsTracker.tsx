'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

// Cookieless page-view counter. Sends only the page path and the referring
// page; no cookies, no local identifiers, no third-party services.
// Admin sessions (logged in on this browser) are not counted.
let firstView = true

export default function AnalyticsTracker() {
  const pathname = usePathname()

  useEffect(() => {
    if (!pathname || pathname.startsWith('/admin')) return
    try {
      if (localStorage.getItem('adminToken')) return
    } catch {
      // storage unavailable: still count
    }

    // document.referrer only describes how the visitor arrived, so send it
    // with the first page of the visit and not with later in-site navigation.
    const referrer = firstView ? document.referrer || null : null
    firstView = false
    const payload = JSON.stringify({ path: pathname, referrer })
    fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: payload,
      keepalive: true,
    }).catch(() => {})
  }, [pathname])

  return null
}
