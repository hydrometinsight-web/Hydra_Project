'use client'

import { useState } from 'react'
import { 
  FaFacebook, 
  FaTwitter, 
  FaLinkedin, 
  FaWhatsapp, 
  FaEnvelope, 
  FaLink,
  FaCheck
} from 'react-icons/fa'

interface SocialShareProps {
  url: string
  title: string
  description?: string
  className?: string
}

export default function SocialShare({ 
  url, 
  title, 
  description = '', 
  className = '' 
}: SocialShareProps) {
  const [copied, setCopied] = useState(false)

  const encodedUrl = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)
  const encodedDescription = encodeURIComponent(description)

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}${description ? `&via=hydrometinsight` : ''}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
    email: `mailto:?subject=${encodedTitle}&body=${encodedDescription}%20${encodedUrl}`,
  }

  const handleShare = (platform: keyof typeof shareLinks) => {
    const shareUrl = shareLinks[platform]
    window.open(shareUrl, '_blank', 'width=600,height=400,scrollbars=yes,resizable=yes')
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy link:', err)
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = url
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      <span className="text-sm font-medium text-gray-700 mr-2">Share:</span>
      
      {/* Facebook */}
      <button
        onClick={() => handleShare('facebook')}
        className="flex items-center justify-center w-10 h-10 rounded-full bg-[#1877F2] text-white hover:bg-[#166FE5] transition-colors duration-200 shadow-sm hover:shadow-md"
        aria-label="Share on Facebook"
        title="Share on Facebook"
      >
        <FaFacebook className="w-5 h-5" />
      </button>

      {/* Twitter */}
      <button
        onClick={() => handleShare('twitter')}
        className="flex items-center justify-center w-10 h-10 rounded-full bg-[#1DA1F2] text-white hover:bg-[#1a91da] transition-colors duration-200 shadow-sm hover:shadow-md"
        aria-label="Share on Twitter"
        title="Share on Twitter"
      >
        <FaTwitter className="w-5 h-5" />
      </button>

      {/* LinkedIn */}
      <button
        onClick={() => handleShare('linkedin')}
        className="flex items-center justify-center w-10 h-10 rounded-full bg-[#0077B5] text-white hover:bg-[#006399] transition-colors duration-200 shadow-sm hover:shadow-md"
        aria-label="Share on LinkedIn"
        title="Share on LinkedIn"
      >
        <FaLinkedin className="w-5 h-5" />
      </button>

      {/* WhatsApp */}
      <button
        onClick={() => handleShare('whatsapp')}
        className="flex items-center justify-center w-10 h-10 rounded-full bg-[#25D366] text-white hover:bg-[#20BA5A] transition-colors duration-200 shadow-sm hover:shadow-md"
        aria-label="Share on WhatsApp"
        title="Share on WhatsApp"
      >
        <FaWhatsapp className="w-5 h-5" />
      </button>

      {/* Email */}
      <button
        onClick={() => handleShare('email')}
        className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-600 text-white hover:bg-gray-700 transition-colors duration-200 shadow-sm hover:shadow-md"
        aria-label="Share via Email"
        title="Share via Email"
      >
        <FaEnvelope className="w-5 h-5" />
      </button>

      {/* Copy Link */}
      <button
        onClick={handleCopyLink}
        className={`flex items-center justify-center w-10 h-10 rounded-full transition-colors duration-200 shadow-sm hover:shadow-md ${
          copied
            ? 'bg-[#93D419] text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
        aria-label="Copy link"
        title="Copy link"
      >
        {copied ? (
          <FaCheck className="w-5 h-5" />
        ) : (
          <FaLink className="w-5 h-5" />
        )}
      </button>
    </div>
  )
}

