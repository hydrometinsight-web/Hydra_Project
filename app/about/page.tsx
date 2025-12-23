import Image from 'next/image'

export default function AboutPage() {
  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-12 max-w-7xl mx-auto">
      {/* Hero Section */}
      <div className="relative w-full h-96 rounded-xl overflow-hidden mb-12 shadow-lg">
        <div className="absolute inset-0 bg-gradient-to-r from-[#1a1a1a] via-[#2d2d2d] to-[#1a1a1a]"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-4 z-10">
            <div className="flex items-center justify-center mb-6">
              <Image src="/logo1.png" alt="HydroMetInsight Logo" width={80} height={80} className="w-20 h-20 object-contain" />
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold mb-4">About HydroMetInsight</h1>
            <p className="text-xl lg:text-2xl text-gray-300 max-w-3xl mx-auto">
              Independent insights on hydrometallurgy, critical metals, and battery recycling
            </p>
          </div>
        </div>
        {/* Decorative pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(147, 212, 25, 0.3) 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }}></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Mission */}
        <div className="bg-white rounded-xl shadow-md p-8 hover:shadow-xl transition-shadow">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-[#93D419] rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Our Mission</h2>
          </div>
          <p className="text-gray-600 leading-relaxed">
            To provide comprehensive, accurate, and timely information about hydrometallurgy, 
            connecting professionals, researchers, and enthusiasts in the field.
          </p>
        </div>

        {/* Vision */}
        <div className="bg-white rounded-xl shadow-md p-8 hover:shadow-xl transition-shadow">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-[#93D419] rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Our Vision</h2>
          </div>
          <p className="text-gray-600 leading-relaxed">
            To become the leading platform for hydrometallurgy knowledge sharing, 
            fostering innovation and collaboration across the industry.
          </p>
        </div>

        {/* Values */}
        <div className="bg-white rounded-xl shadow-md p-8 hover:shadow-xl transition-shadow">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-[#93D419] rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Our Values</h2>
          </div>
          <p className="text-gray-600 leading-relaxed">
            Excellence, integrity, and innovation guide everything we do. 
            We are committed to delivering quality content and fostering a vibrant community.
          </p>
        </div>
      </div>

      {/* About Content */}
      <div className="bg-white rounded-xl shadow-md p-8 lg:p-12 mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Who We Are</h2>
        <div className="prose prose-lg max-w-none" style={{ textAlign: 'inherit' }}>
          <p className="text-gray-600 leading-relaxed mb-6">
            HydroMetInsight is a dedicated platform for professionals, researchers, and enthusiasts 
            in the field of hydrometallurgy. We provide the latest news, technical insights, 
            research developments, and industry updates to keep you informed and connected.
          </p>
          <p className="text-gray-600 leading-relaxed mb-6">
            Our team consists of experienced professionals with deep knowledge in hydrometallurgy, 
            materials science, and related fields. We are passionate about sharing knowledge 
            and fostering collaboration within the hydrometallurgy community.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Whether you are a researcher looking for the latest developments, a professional 
            seeking industry insights, or a student exploring the field, HydroMetInsight is 
            your go-to resource for all things hydrometallurgy.
          </p>
        </div>
      </div>

      {/* Services/Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-xl transition-shadow">
          <div className="w-16 h-16 bg-[#93D419] rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Latest News</h3>
          <p className="text-gray-600 text-sm">
            Stay updated with the latest news and developments in hydrometallurgy
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-xl transition-shadow">
          <div className="w-16 h-16 bg-[#93D419] rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Tech Insights</h3>
          <p className="text-gray-600 text-sm">
            Deep dive into technical insights and research findings
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-xl transition-shadow">
          <div className="w-16 h-16 bg-[#93D419] rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Events</h3>
          <p className="text-gray-600 text-sm">
            Discover conferences, workshops, and industry events
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-xl transition-shadow">
          <div className="w-16 h-16 bg-[#93D419] rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Calculations</h3>
          <p className="text-gray-600 text-sm">
            Access useful calculation tools for your work
          </p>
        </div>
      </div>

      {/* Contact CTA */}
      <div className="bg-gray-900 rounded-xl shadow-lg p-8 lg:p-12 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Get in Touch</h2>
        <p className="text-gray-300 text-lg mb-6 max-w-2xl mx-auto">
          Have questions or want to contribute? We'd love to hear from you!
        </p>
        <a
          href="/sorular"
          className="inline-flex items-center gap-2 bg-[#93D419] text-white px-8 py-3 rounded-lg hover:bg-[#7fb315] transition-colors font-medium text-sm"
        >
          Contact Us
        </a>
      </div>
    </div>
  )
}

