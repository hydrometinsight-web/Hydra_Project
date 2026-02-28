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

        {/* Hero Section - Above the Fold */}
        <section className="mb-20 relative">
          <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl overflow-hidden shadow-2xl">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}></div>
            </div>
            
            <div className="relative px-8 md:px-12 lg:px-16 py-16 md:py-20 lg:py-24">
              <div className="max-w-5xl">
                <div className="mb-6">
                  <span className="inline-flex items-center gap-2 px-4 py-2 bg-[#93D419]/20 backdrop-blur-sm rounded-full text-sm font-bold text-[#93D419] uppercase tracking-wider border border-[#93D419]/30">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Technology Partnerships
                  </span>
                </div>
                
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-6 leading-tight tracking-tight">
                  Reach Engineering Decision-Makers in{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#93D419] to-[#7fb315]">
                    Hydrometallurgy and Battery Recycling
                  </span>
                </h1>
                
                <div className="w-32 h-1 bg-gradient-to-r from-[#93D419] to-[#7fb315] mb-8 rounded-full"></div>
                
                <div className="space-y-5 text-gray-200 leading-relaxed">
                  <p className="text-base md:text-lg font-medium">
                    HydroMetInsight serves <span className="text-white font-bold">process engineers</span>, <span className="text-white font-bold">R&D specialists</span>, and <span className="text-white font-bold">technical managers</span> who evaluate and implement technologies in production environments.
                  </p>
                  <p className="text-sm md:text-base">
                    Partner with us to connect with engineering professionals actively solving problems in critical metals extraction, battery recycling, and hydrometallurgical processing.
                  </p>
                  <p className="text-sm md:text-base">
                    Our platform provides direct access to decision-makers who evaluate technologies based on engineering merit, performance data, and technical credibility. We focus exclusively on the hydrometallurgy ecosystem, ensuring your message reaches the right technical audience at the right moment in their evaluation process.
                  </p>
                  <p className="text-sm md:text-base">
                    With a dedicated readership of process engineers, plant operators, and R&D directors, HydroMetInsight offers targeted visibility for technology providers, equipment manufacturers, and solution developers. Our editorial independence and technical depth ensure that partnerships align with engineering standards and audience expectations.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Partner With Us */}
        <section className="mb-24">
          <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-10 md:p-14 relative overflow-hidden">
            {/* Decorative background element */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#93D419]/5 to-transparent rounded-full blur-3xl -mr-32 -mt-32"></div>
            
            <div className="relative mb-12">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-1 h-12 bg-gradient-to-b from-[#93D419] to-[#7fb315] rounded-full"></div>
                <div>
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-3">
                    Why Partner With Us
                  </h2>
                  <div className="w-20 h-1 bg-gradient-to-r from-[#93D419] to-[#7fb315] rounded-full"></div>
                </div>
              </div>
              <p className="text-gray-700 text-lg md:text-xl max-w-3xl leading-relaxed font-medium">
                Our platform reaches technical professionals who make technology decisions based on 
                engineering merit, not marketing claims.
              </p>
            </div>
            
            <div className="relative grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="group relative bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 border border-gray-200 hover:border-[#93D419]/30 hover:shadow-xl transition-all duration-300">
                <div className="flex items-start gap-4 mb-5">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#93D419] to-[#7fb315] flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 flex-shrink-0">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 group-hover:text-[#93D419] transition-colors">
                      Role-Based Technical Audience
                    </h3>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed text-base">
                  Process engineers, plant operators, R&D specialists, and engineering managers 
                  who actively evaluate equipment, technologies, and solutions for production implementation.
                </p>
              </div>
              
              <div className="group relative bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 border border-gray-200 hover:border-[#93D419]/30 hover:shadow-xl transition-all duration-300">
                <div className="flex items-start gap-4 mb-5">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#93D419] to-[#7fb315] flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 flex-shrink-0">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 group-hover:text-[#93D419] transition-colors">
                      Technical Credibility
                    </h3>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed text-base">
                  Engineering-focused content and analysis developed independently. Our readership 
                  trusts our technical depth and editorial integrity.
                </p>
              </div>

              <div className="group relative bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 border border-gray-200 hover:border-[#93D419]/30 hover:shadow-xl transition-all duration-300">
                <div className="flex items-start gap-4 mb-5">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#93D419] to-[#7fb315] flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 flex-shrink-0">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 group-hover:text-[#93D419] transition-colors">
                      Decision-Maker Access
                    </h3>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed text-base">
                  Connect with R&D directors, engineering managers, and technical specialists 
                  who have authority to evaluate and approve technology investments.
                </p>
              </div>
              
              <div className="group relative bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 border border-gray-200 hover:border-[#93D419]/30 hover:shadow-xl transition-all duration-300">
                <div className="flex items-start gap-4 mb-5">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#93D419] to-[#7fb315] flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 flex-shrink-0">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 group-hover:text-[#93D419] transition-colors">
                      Industry Specialization
                    </h3>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed text-base">
                  Deep technical coverage of hydrometallurgy, critical metals extraction, and battery 
                  recycling. Our audience requires specialized knowledge, not generic content.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Partnership Models */}
        <section className="mb-24">
          <div className="mb-12 lg:mb-16">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-1 h-16 bg-gradient-to-b from-[#93D419] to-[#7fb315] rounded-full"></div>
              <div>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
                  Partnership Models
                </h2>
                <div className="w-24 h-1 bg-gradient-to-r from-[#93D419] to-[#7fb315] rounded-full mb-5"></div>
              </div>
            </div>
            <p className="text-gray-600 text-base md:text-lg max-w-3xl leading-relaxed font-medium">
              Structured partnership programs designed for technology providers, engineering firms, 
              and solution developers in the hydrometallurgy ecosystem.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {/* Tool Sponsorship */}
            <div className="group bg-white rounded-2xl border border-gray-100 p-8 lg:p-10 hover:shadow-xl hover:shadow-gray-100/50 hover:-translate-y-1 hover:border-gray-200 transition-all duration-500">
              <div className="mb-6">
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#93D419]/10 to-[#7fb315]/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-7 h-7 text-[#93D419]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 group-hover:text-[#93D419] transition-colors">Tool Sponsorship</h3>
                </div>
                <p className="text-gray-600 leading-relaxed mb-4 text-[15px]">
                  Visibility through engineering calculators and technical tools used during active problem-solving and process evaluation.
                </p>
                <p className="text-sm text-gray-500 mb-6">
                  <span className="font-semibold text-gray-700">Best for:</span> Technology providers, software developers, and equipment suppliers aligned with engineering workflows.
                </p>
              </div>
              
              <div className="pt-6 border-t border-gray-100">
                <h4 className="font-semibold text-gray-900 text-sm mb-5">Key Privileges</h4>
                <ul className="space-y-3.5 text-gray-700">
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-[#93D419] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="leading-relaxed text-sm">Logo placement within calculators and tools</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-[#93D419] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="leading-relaxed text-sm">Visibility during active engineering decision-making</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-[#93D419] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="leading-relaxed text-sm">Clear editorial independence statement</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-[#93D419] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="leading-relaxed text-sm">Optional link to technical resources</span>
                  </li>
                </ul>
              </div>
              
              <div className="mt-7 pt-6 border-t border-gray-100">
                <button className="inline-flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-[#93D419] transition-colors group/btn">
                  Learn more
                  <svg className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Technology Partner */}
            <div className="group bg-white rounded-2xl border border-gray-100 p-8 lg:p-10 hover:shadow-xl hover:shadow-gray-100/50 hover:-translate-y-1 hover:border-gray-200 transition-all duration-500">
              <div className="mb-6">
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#93D419]/10 to-[#7fb315]/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-7 h-7 text-[#93D419]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 group-hover:text-[#93D419] transition-colors">Technology Partner</h3>
                </div>
                <p className="text-gray-600 leading-relaxed mb-4 text-[15px]">
                  Long-term, multi-channel partnership offering sustained visibility with a highly targeted engineering audience.
                </p>
                <p className="text-sm text-gray-500 mb-6">
                  <span className="font-semibold text-gray-700">Best for:</span> Established technology providers and engineering companies seeking continuous engagement with decision-makers.
                </p>
              </div>
              
              <div className="pt-6 border-t border-gray-100">
                <h4 className="font-semibold text-gray-900 text-sm mb-5">Key Privileges</h4>
                <ul className="space-y-3.5 text-gray-700">
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-[#93D419] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="leading-relaxed text-sm">Featured logo on homepage and sponsor directory</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-[#93D419] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="leading-relaxed text-sm">Newsletter sponsorship</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-[#93D419] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="leading-relaxed text-sm">Priority consideration for webinars</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-[#93D419] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="leading-relaxed text-sm">Audience engagement insights</span>
                  </li>
                </ul>
              </div>
              
              <div className="mt-7 pt-6 border-t border-gray-100">
                <button className="inline-flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-[#93D419] transition-colors group/btn">
                  Learn more
                  <svg className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Technical Content Partnership */}
            <div className="group bg-white rounded-2xl border border-gray-100 p-8 lg:p-10 hover:shadow-xl hover:shadow-gray-100/50 hover:-translate-y-1 hover:border-gray-200 transition-all duration-500">
              <div className="mb-6">
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#93D419]/10 to-[#7fb315]/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-7 h-7 text-[#93D419]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 group-hover:text-[#93D419] transition-colors">Technical Content Partnership</h3>
                </div>
                <p className="text-gray-600 leading-relaxed mb-4 text-[15px]">
                  Sponsor high-quality technical content focused on real engineering challenges and solutions.
                </p>
                <p className="text-sm text-gray-500 mb-6">
                  <span className="font-semibold text-gray-700">Best for:</span> Companies with strong technical expertise, case studies, or research-driven solutions.
                </p>
              </div>
              
              <div className="pt-6 border-t border-gray-100">
                <h4 className="font-semibold text-gray-900 text-sm mb-5">Key Privileges</h4>
                <ul className="space-y-3.5 text-gray-700">
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-[#93D419] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="leading-relaxed text-sm">Sponsored technical articles or case studies</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-[#93D419] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="leading-relaxed text-sm">Clear disclosure and editorial independence</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-[#93D419] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="leading-relaxed text-sm">Logo placement on content pages</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-[#93D419] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="leading-relaxed text-sm">Newsletter distribution to engineering subscribers</span>
                  </li>
                </ul>
              </div>
              
              <div className="mt-7 pt-6 border-t border-gray-100">
                <button className="inline-flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-[#93D419] transition-colors group/btn">
                  Learn more
                  <svg className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Webinar & Events */}
            <div className="group bg-white rounded-2xl border border-gray-100 p-8 lg:p-10 hover:shadow-xl hover:shadow-gray-100/50 hover:-translate-y-1 hover:border-gray-200 transition-all duration-500">
              <div className="mb-6">
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#93D419]/10 to-[#7fb315]/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-7 h-7 text-[#93D419]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 group-hover:text-[#93D419] transition-colors">Webinar & Events</h3>
                </div>
                <p className="text-gray-600 leading-relaxed mb-4 text-[15px]">
                  Live technical engagement through educational webinars and engineering-focused events.
                </p>
                <p className="text-sm text-gray-500 mb-6">
                  <span className="font-semibold text-gray-700">Best for:</span> Technology providers and engineering firms looking for direct interaction and lead generation.
                </p>
              </div>
              
              <div className="pt-6 border-t border-gray-100">
                <h4 className="font-semibold text-gray-900 text-sm mb-5">Key Privileges</h4>
                <ul className="space-y-3.5 text-gray-700">
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-[#93D419] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="leading-relaxed text-sm">Webinar co-hosting or exclusive sponsorship</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-[#93D419] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="leading-relaxed text-sm">Pre- and post-event promotion</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-[#93D419] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="leading-relaxed text-sm">Access to attendee list with consent</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-[#93D419] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="leading-relaxed text-sm">Recorded content visibility</span>
                  </li>
                </ul>
              </div>
              
              <div className="mt-7 pt-6 border-t border-gray-100">
                <button className="inline-flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-[#93D419] transition-colors group/btn">
                  Learn more
                  <svg className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Editorial Independence & Transparency */}
        <section className="mb-24">
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-2 border-gray-200 p-10 md:p-14 shadow-lg">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <svg className="w-8 h-8 text-[#93D419]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Editorial Independence & Transparency</h2>
              </div>
              <div className="w-16 h-0.5 bg-[#93D419]"></div>
            </div>
            <div className="space-y-6 text-gray-700 leading-relaxed">
              <p className="text-lg font-semibold text-gray-900">
                HydroMetInsight maintains strict editorial independence. All technical content, 
                research analysis, and industry reporting are developed independently of sponsor relationships.
              </p>
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <h3 className="font-bold text-gray-900 mb-3">Calculation Independence</h3>
                <p className="mb-3">
                  <strong>Calculator formulas, assumptions, and methodologies are not influenced by sponsorship.</strong> 
                  All engineering calculations remain fully independent, ensuring accuracy and credibility 
                  with technical audiences.
                </p>
                <p>
                  Sponsored calculators display clear editorial independence statements, and all calculation 
                  logic is developed based on standard engineering principles, not sponsor preferences.
                </p>
              </div>
              <p>
                Sponsored content and partnerships are clearly disclosed with transparent labeling. 
                We partner with companies whose technologies align with our mission of advancing 
                hydrometallurgy knowledge, while editorial decisions remain independent.
              </p>
              <p>
                We seek partnerships with organizations committed to technical excellence, innovation, 
                and sustainable practices in hydrometallurgy and battery recycling.
              </p>
            </div>
          </div>
        </section>

        {/* Call to Action - Contact Form */}
        <section className="mb-24">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-10 md:p-14">
            <div className="mb-10">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Request Partnership Discussion</h2>
              <div className="w-16 h-0.5 bg-[#93D419] mb-6"></div>
              <p className="text-gray-700 text-lg max-w-3xl leading-relaxed mb-4">
                To discuss partnership opportunities, please provide details about your company 
                and partnership objectives.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-blue-800">
                  <strong>All partnership inquiries are reviewed manually.</strong> We do not engage in 
                  mass marketing or irrelevant placements. Each partnership is evaluated for alignment 
                  with our technical audience and editorial standards.
                </p>
              </div>
              <p className="text-gray-600 text-sm">
                We will respond within 2-3 business days.
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
                  <option value="tool-sponsorship">Tool Sponsorship</option>
                  <option value="technology-partner">Technology Partner</option>
                  <option value="technical-content">Technical Content Partnership</option>
                  <option value="webinar-events">Webinar & Events</option>
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
                      Request Partnership Discussion
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
