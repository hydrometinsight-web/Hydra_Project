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
    <footer className="bg-[#1a1a1a] text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Section - Left Column */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Image src="/logo1.png" alt="HydroMetInsight Logo" width={40} height={40} className="w-10 h-10 object-contain" />
              <span className="text-xl font-bold text-[#E2FFAC]">HydroMetInsight</span>
            </div>
            <p className="text-white text-sm mb-4">
              Your trusted source for hydrometallurgy news, insights, and developments.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-[#E2FFAC] hover:text-[#93D419] transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a href="#" className="text-[#E2FFAC] hover:text-[#93D419] transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                </svg>
              </a>
              <a href="#" className="text-[#E2FFAC] hover:text-[#93D419] transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Links Section - Middle Column */}
          <div>
            <h3 className="text-[#E2FFAC] font-semibold mb-4">Links</h3>
            <div className="flex flex-col space-y-2">
              <Link href="/" className="text-[#E2FFAC] hover:text-[#93D419] transition-colors text-sm">
                Home
              </Link>
              <Link href="/news" className="text-[#E2FFAC] hover:text-[#93D419] transition-colors text-sm">
                News
              </Link>
              <Link href="/techinsight" className="text-[#E2FFAC] hover:text-[#93D419] transition-colors text-sm">
                Tech Insights
              </Link>
              <Link href="/sponsor" className="text-[#E2FFAC] hover:text-[#93D419] transition-colors text-sm">
                Sponsors
              </Link>
              <Link href="/calculations" className="text-[#E2FFAC] hover:text-[#93D419] transition-colors text-sm">
                Calculations
              </Link>
              <Link href="/about" className="text-[#E2FFAC] hover:text-[#93D419] transition-colors text-sm">
                About
              </Link>
            </div>
          </div>

          {/* Newsletter Section - Right Column */}
          <div>
            <h3 className="text-[#E2FFAC] font-semibold mb-4">Newsletter</h3>
            <p className="text-white text-sm mb-4">
              Subscribe to our newsletter to get the latest updates and insights.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="space-y-3">
              <div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#93D419] focus:border-transparent text-sm"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full inline-flex items-center justify-center gap-2 bg-[#93D419] text-white px-4 py-2 rounded-lg hover:bg-[#7fb315] transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-sm"
              >
                <Image src="/logo1.png" alt="Logo" width={16} height={16} className="w-4 h-4 object-contain" />
                {isSubmitting ? 'Subscribing...' : 'Subscribe'}
              </button>
              {submitStatus === 'success' && (
                <p className="text-green-400 text-xs mt-2">{submitMessage}</p>
              )}
              {submitStatus === 'error' && (
                <p className="text-red-400 text-xs mt-2">{submitMessage}</p>
              )}
            </form>
          </div>
        </div>

        <div className="border-t border-gray-600 mt-8 pt-8">
          <p className="text-white text-sm text-center">
            © {new Date().getFullYear()} HydroMetInsight. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

