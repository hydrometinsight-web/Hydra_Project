'use client'

import { useEffect, useRef } from 'react'

interface AdSenseProps {
  adSlot: string
  adFormat?: 'auto' | 'rectangle' | 'vertical' | 'horizontal'
  style?: React.CSSProperties
  className?: string
  fullWidthResponsive?: boolean
}

export default function AdSense({
  adSlot,
  adFormat = 'auto',
  style,
  className = '',
  fullWidthResponsive = true,
}: AdSenseProps) {
  const adRef = useRef<HTMLDivElement>(null)
  const adsenseId = typeof window !== 'undefined' ? (window as any).__ADSENSE_ID__ : null

  useEffect(() => {
    try {
      // Wait for AdSense script to load
      const checkAdSense = setInterval(() => {
        if (typeof window !== 'undefined' && (window as any).adsbygoogle && adRef.current) {
          try {
            ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({})
            clearInterval(checkAdSense)
          } catch (err) {
            console.error('AdSense push error:', err)
          }
        }
      }, 100)

      // Clear interval after 10 seconds
      setTimeout(() => {
        clearInterval(checkAdSense)
      }, 10000)

      return () => {
        clearInterval(checkAdSense)
      }
    } catch (err) {
      console.error('AdSense error:', err)
    }
  }, [adSlot])

  // If no AdSense ID, show placeholder in development
  if (!adsenseId && process.env.NODE_ENV === 'production') {
    return null
  }

  // Show placeholder in development
  if (!adsenseId) {
    return (
      <div className={`adsense-container ${className} bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center`} style={style}>
        <p className="text-gray-500 text-sm">
          AdSense Placeholder
          <br />
          <span className="text-xs">Add NEXT_PUBLIC_GOOGLE_ADSENSE_ID to .env</span>
        </p>
      </div>
    )
  }

  return (
    <div ref={adRef} className={`adsense-container ${className}`} style={style}>
      <ins
        className="adsbygoogle"
        style={{
          display: 'block',
          textAlign: 'center',
          minHeight: '100px',
          ...(fullWidthResponsive ? {} : { width: '100%', height: '100%' }),
        }}
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={fullWidthResponsive ? 'true' : 'false'}
      />
    </div>
  )
}

