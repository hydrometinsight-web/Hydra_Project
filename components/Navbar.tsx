import Link from 'next/link'
import Image from 'next/image'

export default function Navbar() {
  return (
    <nav className="bg-gradient-to-b from-gray-900 via-gray-900 to-black border-b border-gray-800 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2.5 hover:opacity-90 transition-opacity">
            <Image 
              src="/logo1.png" 
              alt="HydroMetInsight Logo" 
              width={28} 
              height={28} 
              className="w-7 h-7 object-contain opacity-90" 
            />
            <span className="text-lg font-semibold text-white">HydroMetInsight</span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-8 ml-auto">
            <Link 
              href="/" 
              className="text-gray-300 hover:text-[#93D419] transition-colors text-sm font-medium"
            >
              Home
            </Link>
            <Link 
              href="/news" 
              className="text-gray-300 hover:text-[#93D419] transition-colors text-sm font-medium"
            >
              News
            </Link>
            <Link 
              href="/techinsight" 
              className="text-gray-300 hover:text-[#93D419] transition-colors text-sm font-medium"
            >
              Tech Insights
            </Link>
            <Link 
              href="/event" 
              className="text-gray-300 hover:text-[#93D419] transition-colors text-sm font-medium"
            >
              Events
            </Link>
            <Link 
              href="/sponsor" 
              className="text-gray-300 hover:text-[#93D419] transition-colors text-sm font-medium"
            >
              Sponsors
            </Link>
            <Link 
              href="/calculations" 
              className="text-gray-300 hover:text-[#93D419] transition-colors text-sm font-medium"
            >
              Calculations
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button className="text-gray-300 hover:text-[#93D419] transition-colors p-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
