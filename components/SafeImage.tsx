'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import ImagePlaceholder from './ImagePlaceholder'

interface SafeImageProps {
  src: string | null | undefined
  alt: string
  fill?: boolean
  className?: string
  width?: number
  height?: number
  priority?: boolean
}

export default function SafeImage({ 
  src, 
  alt, 
  fill = false, 
  className = 'object-cover',
  width,
  height,
  priority = false
}: SafeImageProps) {
  const [hasError, setHasError] = useState(false)
  const [imgSrc, setImgSrc] = useState<string | null>(null)

  useEffect(() => {
    // Reset error state when src changes
    setHasError(false)
    if (src && typeof src === 'string' && src.trim()) {
      setImgSrc(src.trim())
    } else {
      setImgSrc(null)
    }
  }, [src])

  // Debug log in development
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('SafeImage props:', { src, imgSrc, hasError })
    }
  }, [src, imgSrc, hasError])

  // If no src or error occurred, show placeholder
  if (!imgSrc || hasError) {
    if (fill) {
      return (
        <div className="relative w-full h-full">
          <ImagePlaceholder />
        </div>
      )
    }
    return <ImagePlaceholder />
  }

  // For local uploads (/uploads/), use Next.js Image component
  // For external URLs, use regular img tag with error handling
  const isLocalUpload = imgSrc.startsWith('/uploads/')
  const isExternalUrl = imgSrc.startsWith('http://') || imgSrc.startsWith('https://')

  if (fill) {
    if (isLocalUpload) {
      // Use Next.js Image for local uploads
      return (
        <div className="relative w-full h-full">
          <Image
            src={imgSrc}
            alt={alt}
            fill
            className={className}
            unoptimized={false}
          />
        </div>
      )
    }
    
    // Use regular img tag for external URLs
    return (
      <div className="relative w-full h-full">
        <img
          src={imgSrc}
          alt={alt}
          className={className}
          onError={() => {
            console.error('Image failed to load:', imgSrc)
            setHasError(true)
          }}
          onLoad={() => {
            if (process.env.NODE_ENV === 'development') {
              console.log('Image loaded successfully:', imgSrc)
            }
          }}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>
    )
  }

  if (isLocalUpload) {
    // Use Next.js Image for local uploads
    return (
      <Image
        src={imgSrc}
        alt={alt}
        width={width || 800}
        height={height || 600}
        className={className}
        unoptimized={false}
      />
    )
  }

  // Use regular img tag for external URLs
  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      onError={() => {
        console.error('Image failed to load:', imgSrc)
        setHasError(true)
      }}
      onLoad={() => {
        if (process.env.NODE_ENV === 'development') {
          console.log('Image loaded successfully:', imgSrc)
        }
      }}
      width={width || 800}
      height={height || 600}
    />
  )
}

