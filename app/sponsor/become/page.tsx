'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import AdSense from '@/components/AdSense'

export default function BecomeSponsorPage() {
  const [formData, setFormData] = useState({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    website: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null)
  const [submitMessage, setSubmitMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus(null)

    try {
      // Here you would typically send the data to an API endpoint
      // For now, we'll simulate a submission
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setSubmitStatus('success')
      setSubmitMessage('Thank you for your interest! We will contact you shortly.')
      setFormData({
        companyName: '',
        contactName: '',
        email: '',
        phone: '',
        website: '',
        message: '',
      })
    } catch (error) {
      setSubmitStatus('error')
      setSubmitMessage('An error occurred. Please try again later.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-8 max-w-7xl mx-auto">
      <Link href="/" className="text-gray-600 hover:text-[#93D419] mb-4 inline-block text-sm transition-colors">
        ← Back to Home
      </Link>

      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Become a Sponsor</h1>
        <p className="text-gray-600 text-lg leading-relaxed max-w-3xl">
          Partner with HydroMetInsight to reach a targeted audience of professionals, researchers, 
          and industry experts in hydrometallurgy, critical metals, and battery recycling.
        </p>
      </div>

      {/* AdSense Ad */}
      <div className="mb-8">
        <AdSense adSlot="1234567890" className="w-full" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-8 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Sponsorship Opportunities</h2>
            
            <div className="space-y-6 mb-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Why Sponsor HydroMetInsight?</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-[#93D419] mt-1">✓</span>
                    <span>Reach a highly targeted audience of industry professionals and researchers</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#93D419] mt-1">✓</span>
                    <span>Increase brand visibility in the hydrometallurgy and critical metals sector</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#93D419] mt-1">✓</span>
                    <span>Support independent journalism and technical content</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#93D419] mt-1">✓</span>
                    <span>Connect with decision-makers and thought leaders</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Sponsorship Packages</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Basic</h4>
                    <p className="text-sm text-gray-600">Logo placement, newsletter mention</p>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Premium</h4>
                    <p className="text-sm text-gray-600">Featured placement, article sponsorship</p>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Enterprise</h4>
                    <p className="text-sm text-gray-600">Custom packages, exclusive opportunities</p>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Custom</h4>
                    <p className="text-sm text-gray-600">Tailored solutions for your needs</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Us</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-2">
                      Company Name *
                    </label>
                    <input
                      id="companyName"
                      name="companyName"
                      type="text"
                      value={formData.companyName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#93D419] focus:border-[#93D419] text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="contactName" className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Name *
                    </label>
                    <input
                      id="contactName"
                      name="contactName"
                      type="text"
                      value={formData.contactName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#93D419] focus:border-[#93D419] text-sm"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#93D419] focus:border-[#93D419] text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Phone
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#93D419] focus:border-[#93D419] text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-2">
                    Website
                  </label>
                  <input
                    id="website"
                    name="website"
                    type="url"
                    value={formData.website}
                    onChange={handleChange}
                    placeholder="https://"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#93D419] focus:border-[#93D419] text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    placeholder="Tell us about your sponsorship interests..."
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#93D419] focus:border-[#93D419] text-sm resize-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 bg-[#93D419] hover:bg-[#7fb315] text-white font-medium px-6 py-2.5 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  <Image src="/logo1.png" alt="Logo" width={16} height={16} className="w-4 h-4 object-contain" />
                  {isSubmitting ? 'Submitting...' : 'Submit Inquiry'}
                </button>
                {submitStatus === 'success' && (
                  <p className="text-[#93D419] text-sm mt-2">{submitMessage}</p>
                )}
                {submitStatus === 'error' && (
                  <p className="text-red-600 text-sm mt-2">{submitMessage}</p>
                )}
              </form>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
            <div className="space-y-3 text-sm text-gray-600">
              <p>
                <strong className="text-gray-900">Email:</strong><br />
                sponsors@hydrometinsight.com
              </p>
              <p>
                <strong className="text-gray-900">Response Time:</strong><br />
                We typically respond within 2-3 business days
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">What to Include</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-[#93D419] mt-1">•</span>
                <span>Your company background and industry focus</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#93D419] mt-1">•</span>
                <span>Preferred sponsorship package or custom requirements</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#93D419] mt-1">•</span>
                <span>Budget range and timeline</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#93D419] mt-1">•</span>
                <span>Any specific goals or objectives</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

