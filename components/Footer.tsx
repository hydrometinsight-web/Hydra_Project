'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'

export default function Footer() {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null)
  const [submitMessage, setSubmitMessage] = useState('')

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus(null)

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        setSubmitStatus('success')
        setSubmitMessage(data.message || 'Successfully subscribed to newsletter!')
        setEmail('')
      } else {
        setSubmitStatus('error')
        setSubmitMessage(data.error || 'Failed to subscribe. Please try again.')
      }
    } catch (error) {
      setSubmitStatus('error')
      setSubmitMessage('An error occurred. Please try again later.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <footer className="bg-gradient-to-b from-gray-900 via-gray-900 to-black text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-10">
          {/* Brand Section - Left Column */}
          <div className="space-y-5">
            <div className="flex items-center space-x-2.5">
              <Image 
                src="/logo1.png" 
                alt="HydroMetInsight Logo" 
                width={28} 
                height={28} 
                className="w-7 h-7 object-contain opacity-90" 
              />
              <span className="text-lg font-semibold text-white">HydroMetInsight</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              Independent insights on hydrometallurgy, critical metals, and battery recycling.
            </p>
            <div className="flex items-center space-x-3 pt-1">
              <a 
                href="#" 
                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-[#93D419] transition-colors duration-200"
                aria-label="Facebook"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a 
                href="#" 
                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-[#93D419] transition-colors duration-200"
                aria-label="X (Twitter)"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a 
                href="#" 
                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-[#93D419] transition-colors duration-200"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a 
                href="#" 
                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-[#93D419] transition-colors duration-200"
                aria-label="LinkedIn"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
              <a 
                href="#" 
                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-[#93D419] transition-colors duration-200"
                aria-label="YouTube"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Links Section - Center Column */}
          <div className="px-4 md:px-8">
            <h3 className="text-white font-semibold text-sm mb-5 tracking-wide uppercase">Links</h3>
            <nav className="grid grid-cols-2 gap-x-6 gap-y-2.5">
              <Link 
                href="/" 
                className="text-gray-400 hover:text-[#93D419] transition-colors text-sm"
              >
                Home
              </Link>
              <Link 
                href="/news" 
                className="text-gray-400 hover:text-[#93D419] transition-colors text-sm"
              >
                News
              </Link>
              <Link 
                href="/techinsight" 
                className="text-gray-400 hover:text-[#93D419] transition-colors text-sm"
              >
                Tech Insights
              </Link>
              <Link 
                href="/sponsor" 
                className="text-gray-400 hover:text-[#93D419] transition-colors text-sm"
              >
                Sponsors
              </Link>
              <Link 
                href="/calculations" 
                className="text-gray-400 hover:text-[#93D419] transition-colors text-sm"
              >
                Calculations
              </Link>
              <Link 
                href="/about" 
                className="text-gray-400 hover:text-[#93D419] transition-colors text-sm"
              >
                About
              </Link>
            </nav>
          </div>

          {/* Newsletter Section - Right Column */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-5 tracking-wide uppercase">Newsletter</h3>
            <p className="text-gray-400 text-sm mb-5 leading-relaxed">
              Stay informed with our latest research and industry updates.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="space-y-3">
              <div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#93D419] focus:border-[#93D419] text-sm transition-all"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#93D419] hover:bg-[#7fb315] text-white font-medium px-4 py-2.5 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                {isSubmitting ? 'Subscribing...' : 'Subscribe'}
              </button>
              {submitStatus === 'success' && (
                <p className="text-[#93D419] text-xs mt-2">{submitMessage}</p>
              )}
              {submitStatus === 'error' && (
                <p className="text-red-400 text-xs mt-2">{submitMessage}</p>
              )}
            </form>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="border-t border-gray-800 pt-8 mt-8">
          <p className="text-gray-500 text-xs text-center opacity-70">
            © 2025 HydroMetInsight. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
