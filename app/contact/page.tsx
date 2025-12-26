'use client'

import { useState } from 'react'
import Image from 'next/image'
import AdSense from '@/components/AdSense'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null)
  const [submitMessage, setSubmitMessage] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus(null)
    setSubmitMessage('')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        setSubmitStatus('success')
        setSubmitMessage(data.message || 'Thank you for your message. We will get back to you soon!')
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: '',
        })
      } else {
        setSubmitStatus('error')
        setSubmitMessage(data.error || 'Failed to send message. Please try again.')
      }
    } catch (error) {
      setSubmitStatus('error')
      setSubmitMessage('An error occurred. Please try again later.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-12 max-w-7xl mx-auto">
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3 tracking-tight">Contact Us</h1>
        <p className="text-lg text-gray-600 max-w-3xl">
          Get in touch with our team. We're here to help with questions, partnerships, and technical inquiries.
        </p>
      </div>

      {/* AdSense Ad */}
      <div className="mb-10">
        <AdSense adSlot="1234567890" className="w-full" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>
            
            {submitStatus === 'success' && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <p className="text-green-800 text-sm">{submitMessage}</p>
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-red-800 text-sm">{submitMessage}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Name *
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    onInvalid={(e) => {
                      e.currentTarget.setCustomValidity('Please fill in this field.')
                    }}
                    onInput={(e) => {
                      e.currentTarget.setCustomValidity('')
                    }}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#93D419] focus:border-[#93D419] text-sm"
                    placeholder="Your name"
                  />
                </div>

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
                    onInvalid={(e) => {
                      e.currentTarget.setCustomValidity('Please enter a valid email address.')
                    }}
                    onInput={(e) => {
                      e.currentTarget.setCustomValidity('')
                    }}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#93D419] focus:border-[#93D419] text-sm"
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                  Subject *
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  onInvalid={(e) => {
                    e.currentTarget.setCustomValidity('Please select a subject.')
                  }}
                  onInput={(e) => {
                    e.currentTarget.setCustomValidity('')
                  }}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#93D419] focus:border-[#93D419] text-sm bg-white"
                >
                  <option value="">Select a subject</option>
                  <option value="general">General Inquiry</option>
                  <option value="partnership">Partnership Inquiry</option>
                  <option value="technical">Technical Question</option>
                  <option value="editorial">Editorial Inquiry</option>
                  <option value="other">Other</option>
                </select>
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
                  rows={6}
                  onInvalid={(e) => {
                    e.currentTarget.setCustomValidity('Please fill in this field.')
                  }}
                  onInput={(e) => {
                    e.currentTarget.setCustomValidity('')
                  }}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#93D419] focus:border-[#93D419] text-sm resize-none"
                  placeholder="Your message..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#93D419] hover:bg-[#7fb315] text-white font-medium px-6 py-3 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
              >
                <Image src="/logo1.png" alt="Logo" width={18} height={18} className="w-4.5 h-4.5 object-contain" />
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>

        {/* Contact Information Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Contact Information</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">Email</p>
                <a 
                  href="mailto:contact@hydrometinsight.com" 
                  className="text-[#93D419] hover:text-[#7fb315] transition-colors text-sm"
                >
                  contact@hydrometinsight.com
                </a>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">Partnership Inquiries</p>
                <a 
                  href="mailto:partnerships@hydrometinsight.com" 
                  className="text-[#93D419] hover:text-[#7fb315] transition-colors text-sm"
                >
                  partnerships@hydrometinsight.com
                </a>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">General Inquiries</p>
                <a 
                  href="mailto:info@hydrometinsight.com" 
                  className="text-[#93D419] hover:text-[#7fb315] transition-colors text-sm"
                >
                  info@hydrometinsight.com
                </a>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Response Time</h4>
            <p className="text-sm text-gray-600 leading-relaxed">
              We typically respond within 2-3 business days. For urgent matters, please indicate in your message.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

