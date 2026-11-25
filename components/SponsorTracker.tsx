'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

// Wraps a sponsor's logo/link. Counts one impression when at least half of it
// has been visible on screen for one second, and one click when a link inside
// it is clicked. Links keep their normal href; nothing is redirected.
export default function SponsorTracker({
  sponsorId,
  placement,
  className,
  children,
}: {
  sponsorId: string
  placement: string
  className?: string
  children: React.ReactNode
}) {
  const ref = useRef<HTMLDivElement>(null)
  const pathname = usePathname()

  useEffect(() => {
    const el = ref.current
    if (!el || isAdmin() || typeof IntersectionObserver === 'undefined') return
    let timer: ReturnType<typeof setTimeout> | null = null
    let sent = false
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (sent) return
        if (entry.isIntersecting) {
          timer = setTimeout(() => {
            sent = true
            send(sponsorId, placement, 'impression', pathname)
            observer.disconnect()
          }, 1000)
        } else if (timer) {
          clearTimeout(timer)
          timer = null
        }
      },
      { threshold: 0.5 }
    )
    observer.observe(el)
    return () => {
      if (timer) clearTimeout(timer)
      observer.disconnect()
    }
  }, [sponsorId, placement, pathname])

  const onClick = (event: React.MouseEvent) => {
    if (isAdmin()) return
    if ((event.target as HTMLElement).closest('a')) send(sponsorId, placement, 'click', pathname)
  }

  return (
    <div ref={ref} className={className} onClick={onClick} onAuxClick={onClick}>
      {children}
    </div>
  )
}

function isAdmin() {
  try {
    return !!localStorage.getItem('adminToken')
  } catch {
    return false
  }
}

function send(sponsorId: string, placement: string, type: 'impression' | 'click', path: string | null) {
  const body = JSON.stringify({ sponsorId, placement, type, path })
  try {
    if (type === 'click' && navigator.sendBeacon) {
      navigator.sendBeacon('/api/sponsor-event', new Blob([body], { type: 'application/json' }))
      return
    }
  } catch {
    // fall through to fetch
  }
  fetch('/api/sponsor-event', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
    keepalive: true,
  }).catch(() => {})
}
