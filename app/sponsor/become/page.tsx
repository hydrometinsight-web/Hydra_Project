'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function BecomeSponsorPage() {
  const [formData, setFormData] = useState({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    website: '',
    companyType: '',
    sponsorshipInterest: '',
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
      const response = await fetch('/api/sponsor/inquiry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setSubmitStatus('success')
        setSubmitMessage('Thank you for your interest. Our team will contact you within 2-3 business days.')
        setFormData({
          companyName: '',
          contactName: '',
          email: '',
          phone: '',
          website: '',
          companyType: '',
          sponsorshipInterest: '',
          message: '',
        })
      } else {
        throw new Error('Submission failed')
      }
    } catch (error) {
      setSubmitStatus('error')
      setSubmitMessage('An error occurred. Please try again or contact us directly.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-16 max-w-7xl mx-auto">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-gray-600 hover:text-[#93D419] mb-8 text-sm transition-colors font-medium group"
        >
          <svg className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Home
        </Link>

        {/* Hero Section */}
        <section className="mb-20">
          <div className="mb-4">
            <span className="inline-block text-xs font-semibold text-[#93D419] uppercase tracking-wider mb-4">
              Partnership Opportunities
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight tracking-tight">
            Technology Partnerships
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-[#93D419] to-[#7fb315] mb-8"></div>
          <p className="text-xl md:text-2xl text-gray-700 leading-relaxed max-w-4xl font-light">
            HydroMetInsight partners with technology providers, engineering firms, and solution developers 
            to advance technical knowledge in hydrometallurgy, critical metals processing, and battery recycling.
          </p>
        </section>

        {/* Why Partner With Us */}
        <section className="mb-20">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-10 md:p-14">
            <div className="mb-10">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Why Partner With Us</h2>
              <div className="w-16 h-0.5 bg-[#93D419]"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="group">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#93D419] to-[#7fb315] flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Technical Audience</h3>
                </div>
                <p className="text-gray-700 leading-relaxed pl-16">
                  Our readership consists of process engineers, plant operators, R&D professionals, 
                  and technical decision-makers actively engaged in hydrometallurgical applications.
                </p>
              </div>
              
              <div className="group">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#93D419] to-[#7fb315] flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Editorial Credibility</h3>
                </div>
                <p className="text-gray-700 leading-relaxed pl-16">
                  HydroMetInsight maintains editorial independence. Our technical content and analysis 
                  are developed without sponsor influence, ensuring credibility with engineering audiences.
                </p>
              </div>

              <div className="group">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#93D419] to-[#7fb315] flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Decision-Maker Access</h3>
                </div>
                <p className="text-gray-700 leading-relaxed pl-16">
                  Connect with engineering managers, R&D directors, and technical specialists who 
                  evaluate and implement new technologies in production environments.
                </p>
              </div>
              
              <div className="group">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#93D419] to-[#7fb315] flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Industry Focus</h3>
                </div>
                <p className="text-gray-700 leading-relaxed pl-16">
                  Specialized coverage of hydrometallurgy, critical metals extraction, and battery 
                  recycling technologies for professionals who require technical depth.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Partnership Models */}
        <section className="mb-20">
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Partnership Models</h2>
            <div className="w-16 h-0.5 bg-[#93D419] mb-4"></div>
            <p className="text-gray-700 text-lg max-w-3xl">
              Structured partnership programs for technology providers and engineering companies 
              operating in the hydrometallurgy ecosystem.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Calculator Sponsor */}
            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-8 hover:shadow-xl hover:border-[#93D419]/30 transition-all duration-300 group">
              <div className="mb-6">
                <span className="inline-block bg-gradient-to-r from-[#93D419] to-[#7fb315] text-white text-xs font-bold px-4 py-1.5 rounded-full mb-4 uppercase tracking-wider shadow-sm">
                  Calculator Partnership
                </span>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-[#93D419] transition-colors">Calculator Sponsor</h3>
                <p className="text-gray-700 leading-relaxed mb-6">
                  Sponsor engineering calculators and tools used by professionals in hydrometallurgy, 
                  critical metals processing, and battery recycling.
                </p>
              </div>
              
              <div className="space-y-4 pt-6 border-t border-gray-100">
                <h4 className="font-bold text-gray-900 text-sm uppercase tracking-wide">Key Privileges</h4>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start gap-3">
                    <span className="text-[#93D419] mt-1.5 font-bold text-lg leading-none">✓</span>
                    <span className="leading-relaxed">Logo placement in calculator sidebar</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#93D419] mt-1.5 font-bold text-lg leading-none">✓</span>
                    <span className="leading-relaxed">"Sponsored By" section with "Technical Partner" designation</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#93D419] mt-1.5 font-bold text-lg leading-none">✓</span>
                    <span className="leading-relaxed">Editorial independence statement included</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#93D419] mt-1.5 font-bold text-lg leading-none">✓</span>
                    <span className="leading-relaxed">Optional "Learn More" link to your website</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#93D419] mt-1.5 font-bold text-lg leading-none">✓</span>
                    <span className="leading-relaxed">Visibility to engineers actively using calculation tools</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Technology Partner */}
            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-8 hover:shadow-xl hover:border-[#93D419]/30 transition-all duration-300 group">
              <div className="mb-6">
                <span className="inline-block bg-gradient-to-r from-[#93D419] to-[#7fb315] text-white text-xs font-bold px-4 py-1.5 rounded-full mb-4 uppercase tracking-wider shadow-sm">
                  Technology Partner
                </span>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-[#93D419] transition-colors">Technology Partner</h3>
                <p className="text-gray-700 leading-relaxed mb-6">
                  Comprehensive partnership for equipment manufacturers, process technology providers, 
                  and solution developers in hydrometallurgy and battery recycling.
                </p>
              </div>
              
              <div className="space-y-4 pt-6 border-t border-gray-100">
                <h4 className="font-bold text-gray-900 text-sm uppercase tracking-wide">Key Privileges</h4>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start gap-3">
                    <span className="text-[#93D419] mt-1.5 font-bold text-lg leading-none">✓</span>
                    <span className="leading-relaxed">Featured logo placement on homepage and sponsor directory</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#93D419] mt-1.5 font-bold text-lg leading-none">✓</span>
                    <span className="leading-relaxed">Quarterly technical content feature or case study</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#93D419] mt-1.5 font-bold text-lg leading-none">✓</span>
                    <span className="leading-relaxed">Newsletter sponsorship</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#93D419] mt-1.5 font-bold text-lg leading-none">✓</span>
                    <span className="leading-relaxed">Audience engagement metrics and insights</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#93D419] mt-1.5 font-bold text-lg leading-none">✓</span>
                    <span className="leading-relaxed">Priority consideration for webinar co-hosting</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Technical Content Sponsor */}
            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-8 hover:shadow-xl hover:border-[#93D419]/30 transition-all duration-300 group">
              <div className="mb-6">
                <span className="inline-block bg-gradient-to-r from-[#93D419] to-[#7fb315] text-white text-xs font-bold px-4 py-1.5 rounded-full mb-4 uppercase tracking-wider shadow-sm">
                  Content Partnership
                </span>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-[#93D419] transition-colors">Technical Content Sponsor</h3>
                <p className="text-gray-700 leading-relaxed mb-6">
                  Support specific technical articles, research summaries, or industry analysis 
                  relevant to your technology domain or expertise.
                </p>
              </div>
              
              <div className="space-y-4 pt-6 border-t border-gray-100">
                <h4 className="font-bold text-gray-900 text-sm uppercase tracking-wide">Key Privileges</h4>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start gap-3">
                    <span className="text-[#93D419] mt-1.5 font-bold text-lg leading-none">✓</span>
                    <span className="leading-relaxed">Sponsored content placement with clear disclosure</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#93D419] mt-1.5 font-bold text-lg leading-none">✓</span>
                    <span className="leading-relaxed">Logo placement on sponsored articles</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#93D419] mt-1.5 font-bold text-lg leading-none">✓</span>
                    <span className="leading-relaxed">Newsletter mention with article link</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#93D419] mt-1.5 font-bold text-lg leading-none">✓</span>
                    <span className="leading-relaxed">Cross-channel promotion where applicable</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Case Study Partner */}
            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-8 hover:shadow-xl hover:border-[#93D419]/30 transition-all duration-300 group">
              <div className="mb-6">
                <span className="inline-block bg-gradient-to-r from-[#93D419] to-[#7fb315] text-white text-xs font-bold px-4 py-1.5 rounded-full mb-4 uppercase tracking-wider shadow-sm">
                  Case Study Partnership
                </span>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-[#93D419] transition-colors">Case Study Partner</h3>
                <p className="text-gray-700 leading-relaxed mb-6">
                  Technical case study showcasing your technology or solution, including 
                  real-world applications, process data, and performance metrics.
                </p>
              </div>
              
              <div className="space-y-4 pt-6 border-t border-gray-100">
                <h4 className="font-bold text-gray-900 text-sm uppercase tracking-wide">Key Privileges</h4>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start gap-3">
                    <span className="text-[#93D419] mt-1.5 font-bold text-lg leading-none">✓</span>
                    <span className="leading-relaxed">Dedicated technical case study article</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#93D419] mt-1.5 font-bold text-lg leading-none">✓</span>
                    <span className="leading-relaxed">Technical data and process details presentation</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#93D419] mt-1.5 font-bold text-lg leading-none">✓</span>
                    <span className="leading-relaxed">Featured placement in newsletter and homepage</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#93D419] mt-1.5 font-bold text-lg leading-none">✓</span>
                    <span className="leading-relaxed">Extended visibility period</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Webinar Sponsor */}
            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-8 hover:shadow-xl hover:border-[#93D419]/30 transition-all duration-300 group">
              <div className="mb-6">
                <span className="inline-block bg-gradient-to-r from-[#93D419] to-[#7fb315] text-white text-xs font-bold px-4 py-1.5 rounded-full mb-4 uppercase tracking-wider shadow-sm">
                  Webinar Partnership
                </span>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-[#93D419] transition-colors">Webinar Sponsor</h3>
                <p className="text-gray-700 leading-relaxed mb-6">
                  Co-host or sponsor technical webinars on topics relevant to your expertise, 
                  engaging with engineering professionals in real-time.
                </p>
              </div>
              
              <div className="space-y-4 pt-6 border-t border-gray-100">
                <h4 className="font-bold text-gray-900 text-sm uppercase tracking-wide">Key Privileges</h4>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start gap-3">
                    <span className="text-[#93D419] mt-1.5 font-bold text-lg leading-none">✓</span>
                    <span className="leading-relaxed">Co-hosting or exclusive sponsorship of technical webinar</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#93D419] mt-1.5 font-bold text-lg leading-none">✓</span>
                    <span className="leading-relaxed">Pre-event promotion across channels</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#93D419] mt-1.5 font-bold text-lg leading-none">✓</span>
                    <span className="leading-relaxed">Access to attendee list (with consent)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#93D419] mt-1.5 font-bold text-lg leading-none">✓</span>
                    <span className="leading-relaxed">Post-event content and recording promotion</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Editorial Independence & Transparency */}
        <section className="mb-20">
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border border-gray-200 p-10 md:p-14 shadow-lg">
            <div className="mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">Editorial Independence & Transparency</h2>
              <div className="w-16 h-0.5 bg-[#93D419]"></div>
            </div>
            <div className="space-y-5 text-gray-700 leading-relaxed">
              <p className="text-lg">
                <strong className="text-gray-900 font-semibold">HydroMetInsight maintains strict editorial independence.</strong> 
                Technical content, research analysis, and industry reporting are developed independently 
                of sponsor relationships.
              </p>
              <p>
                Sponsored content and partnerships are clearly disclosed. We partner with companies 
                whose technologies align with our mission of advancing hydrometallurgy knowledge, 
                while editorial decisions remain independent.
              </p>
              <p>
                We seek partnerships with organizations committed to technical excellence, innovation, 
                and sustainable practices in hydrometallurgy and battery recycling.
              </p>
            </div>
          </div>
        </section>

        {/* Call to Action - Contact Form */}
        <section className="mb-20">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-10 md:p-14">
            <div className="mb-10">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Partnership Inquiry</h2>
              <div className="w-16 h-0.5 bg-[#93D419] mb-6"></div>
              <p className="text-gray-700 text-lg max-w-3xl leading-relaxed">
                To discuss partnership opportunities, please provide details about your company 
                and partnership objectives. We will respond within 2-3 business days.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="companyName" className="block text-sm font-bold text-gray-900 mb-3">
                    Company Name *
                  </label>
                  <input
                    id="companyName"
                    name="companyName"
                    type="text"
                    value={formData.companyName}
                    onChange={handleChange}
                    required
                    onInvalid={(e) => {
                      e.currentTarget.setCustomValidity('Please fill in this field.')
                    }}
                    onInput={(e) => {
                      e.currentTarget.setCustomValidity('')
                    }}
                    className="w-full px-5 py-3.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#93D419]/20 focus:border-[#93D419] bg-white transition-all text-gray-900 placeholder-gray-400"
                    placeholder="Company name"
                  />
                </div>

                <div>
                  <label htmlFor="companyType" className="block text-sm font-bold text-gray-900 mb-3">
                    Company Type *
                  </label>
                  <select
                    id="companyType"
                    name="companyType"
                    value={formData.companyType}
                    onChange={handleChange}
                    required
                    onInvalid={(e) => {
                      e.currentTarget.setCustomValidity('Please select an option.')
                    }}
                    onInput={(e) => {
                      e.currentTarget.setCustomValidity('')
                    }}
                    className="w-full px-5 py-3.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#93D419]/20 focus:border-[#93D419] bg-white transition-all text-gray-900"
                  >
                    <option value="">Select company type</option>
                    <option value="technology-provider">Technology Provider</option>
                    <option value="engineering-company">Engineering Company</option>
                    <option value="chemical-supplier">Chemical Supplier</option>
                    <option value="battery-recycling">Battery Recycling Firm</option>
                    <option value="equipment-manufacturer">Equipment Manufacturer</option>
                    <option value="research-institution">Research Institution</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="contactName" className="block text-sm font-bold text-gray-900 mb-3">
                    Contact Name *
                  </label>
                  <input
                    id="contactName"
                    name="contactName"
                    type="text"
                    value={formData.contactName}
                    onChange={handleChange}
                    required
                    onInvalid={(e) => {
                      e.currentTarget.setCustomValidity('Please fill in this field.')
                    }}
                    onInput={(e) => {
                      e.currentTarget.setCustomValidity('')
                    }}
                    className="w-full px-5 py-3.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#93D419]/20 focus:border-[#93D419] bg-white transition-all text-gray-900 placeholder-gray-400"
                    placeholder="Full name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-bold text-gray-900 mb-3">
                    Email Address *
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
                    className="w-full px-5 py-3.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#93D419]/20 focus:border-[#93D419] bg-white transition-all text-gray-900 placeholder-gray-400"
                    placeholder="email@company.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="phone" className="block text-sm font-bold text-gray-900 mb-3">
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-5 py-3.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#93D419]/20 focus:border-[#93D419] bg-white transition-all text-gray-900 placeholder-gray-400"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>

                <div>
                  <label htmlFor="website" className="block text-sm font-bold text-gray-900 mb-3">
                    Company Website
                  </label>
                  <input
                    id="website"
                    name="website"
                    type="url"
                    value={formData.website}
                    onChange={handleChange}
                    className="w-full px-5 py-3.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#93D419]/20 focus:border-[#93D419] bg-white transition-all text-gray-900 placeholder-gray-400"
                    placeholder="https://www.example.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="sponsorshipInterest" className="block text-sm font-bold text-gray-900 mb-3">
                  Partnership Interest *
                </label>
                <select
                  id="sponsorshipInterest"
                  name="sponsorshipInterest"
                  value={formData.sponsorshipInterest}
                  onChange={handleChange}
                  required
                  onInvalid={(e) => {
                    e.currentTarget.setCustomValidity('Please select an option.')
                  }}
                  onInput={(e) => {
                    e.currentTarget.setCustomValidity('')
                  }}
                  className="w-full px-5 py-3.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#93D419]/20 focus:border-[#93D419] bg-white transition-all text-gray-900"
                >
                  <option value="">Select partnership type</option>
                  <option value="calculator-sponsor">Calculator Sponsor</option>
                  <option value="technology-partner">Technology Partner</option>
                  <option value="technical-content">Technical Content Sponsor</option>
                  <option value="case-study">Case Study Partner</option>
                  <option value="webinar">Webinar Sponsor</option>
                  <option value="custom">Custom Partnership</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-bold text-gray-900 mb-3">
                  Additional Information *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  onInvalid={(e) => {
                    e.currentTarget.setCustomValidity('Please provide additional information about your partnership interest.')
                  }}
                  onInput={(e) => {
                    e.currentTarget.setCustomValidity('')
                  }}
                  rows={6}
                  placeholder="Describe your company, technology focus, and partnership objectives. Include specific technical areas or topics of interest."
                  className="w-full px-5 py-3.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#93D419]/20 focus:border-[#93D419] bg-white resize-none transition-all text-gray-900 placeholder-gray-400"
                />
              </div>

              <div className="pt-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-3 bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 text-white font-bold px-10 py-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-base shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit Partnership Inquiry
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </>
                  )}
                </button>
              </div>

              {submitStatus === 'success' && (
                <div className="bg-green-50 border-2 border-green-200 rounded-lg p-5 shadow-sm">
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <p className="text-green-800 font-semibold">{submitMessage}</p>
                  </div>
                </div>
              )}
              {submitStatus === 'error' && (
                <div className="bg-red-50 border-2 border-red-200 rounded-lg p-5 shadow-sm">
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <p className="text-red-800 font-semibold">{submitMessage}</p>
                  </div>
                </div>
              )}
            </form>
          </div>
        </section>

        {/* Contact Information */}
        <section className="bg-white rounded-2xl shadow-lg border border-gray-100 p-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Partnership Inquiries</h3>
              <div className="space-y-4 text-gray-700">
                <div>
                  <strong className="text-gray-900 font-semibold block mb-1">Email:</strong>
                  <a href="mailto:partners@hydrometinsight.com" className="text-[#93D419] hover:text-[#7fb315] transition-colors font-medium inline-flex items-center gap-2">
                    partners@hydrometinsight.com
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </a>
                </div>
                <div>
                  <strong className="text-gray-900 font-semibold block mb-1">Response Time:</strong>
                  <span>2-3 business days</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Inquiry Guidelines</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-[#93D419] mt-1.5 font-bold text-lg leading-none">•</span>
                  <span>Company background and technology focus</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#93D419] mt-1.5 font-bold text-lg leading-none">•</span>
                  <span>Preferred partnership model and objectives</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#93D419] mt-1.5 font-bold text-lg leading-none">•</span>
                  <span>Relevant technical areas or topics of interest</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#93D419] mt-1.5 font-bold text-lg leading-none">•</span>
                  <span>Timeline and partnership duration preferences</span>
                </li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
