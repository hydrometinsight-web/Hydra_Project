'use client'

import { useEffect, useRef } from 'react'

/**
 * A single, clearly labelled AdSense display unit.
 *
 * Consent is handled by Google's own certified CMP (AdSense → Privacy & messaging),
 * which is delivered through the adsbygoogle.js tag loaded in app/layout.tsx.
 * The ad slot id comes from an env var; without a real slot nothing is rendered,
 * so no empty boxes or placeholders ever show on the live site.
 */

const CLIENT = 'ca-pub-2342049878330495'

const SLOTS: Record<string, string> = {
  article: process.env.NEXT_PUBLIC_ADSENSE_SLOT_ARTICLE || '2118863343', // "Article end - news and TechInsight" display unit
}

interface AdSenseProps {
  placement: 'article'
  className?: string
}

export default function AdSense({ placement, className = '' }: AdSenseProps) {
  const adSlot = SLOTS[placement] || ''
  const pushed = useRef(false)

  useEffect(() => {
    if (!adSlot || pushed.current) return
    try {
      ;((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({})
      pushed.current = true
    } catch {
      /* ad blockers or a not-yet-approved account: fail silently */
    }
  }, [adSlot])

  if (!/^\d{6,}$/.test(adSlot)) return null

  return (
    <aside className={`not-prose ${className}`} aria-label="Advertisement">
      <p className="text-[10px] uppercase tracking-[0.14em] text-gray-400 text-center mb-1">
        Advertisement
      </p>
      <ins
        className="adsbygoogle"
        style={{ display: 'block', minHeight: 120 }}
        data-ad-client={CLIENT}
        data-ad-slot={adSlot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </aside>
  )
}
