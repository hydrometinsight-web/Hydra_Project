'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  HiHome,
  HiNewspaper,
  HiFolder,
  HiLightBulb,
  HiCalendar,
  HiUsers,
  HiChartBar,
  HiLogout,
} from 'react-icons/hi'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [hasToken, setHasToken] = useState(false)

  useEffect(() => {
    // For login page, don't check token
    if (pathname === '/admin') {
      return
    }

    // Simple token check - no API verification
    const token = localStorage.getItem('adminToken')
    
    if (!token) {
      router.push('/admin')
      return
    }

    // Token exists, allow access
    setHasToken(true)
  }, [router, pathname])

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    router.push('/admin')
  }

  // Show login page without sidebar
  if (pathname === '/admin') {
    return <>{children}</>
  }

  // For other admin pages, require token
  if (!hasToken) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#93D419] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-gray-900 via-gray-900 to-black shadow-lg fixed h-full left-0 top-0 overflow-y-auto border-r border-gray-800">
        <div className="p-6 border-b border-gray-800">
          <Link href="/admin/dashboard" className="text-xl font-bold text-white">
            Admin Panel
          </Link>
        </div>
        <nav className="p-4 space-y-2">
          <Link
            href="/admin/dashboard"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              pathname === '/admin/dashboard'
                ? 'bg-[#93D419] text-white'
                : 'text-gray-300 hover:bg-gray-800 hover:text-[#93D419]'
            }`}
          >
            <HiHome className="w-5 h-5" />
            Dashboard
          </Link>
          <Link
            href="/admin/haberler"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              pathname?.startsWith('/admin/haberler')
                ? 'bg-[#93D419] text-white'
                : 'text-gray-300 hover:bg-gray-800 hover:text-[#93D419]'
            }`}
          >
            <HiNewspaper className="w-5 h-5" />
            News
          </Link>
          <Link
            href="/admin/kategoriler"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              pathname?.startsWith('/admin/kategoriler')
                ? 'bg-[#93D419] text-white'
                : 'text-gray-300 hover:bg-gray-800 hover:text-[#93D419]'
            }`}
          >
            <HiFolder className="w-5 h-5" />
            Categories
          </Link>
          <Link
            href="/admin/techinsight"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              pathname?.startsWith('/admin/techinsight')
                ? 'bg-[#93D419] text-white'
                : 'text-gray-300 hover:bg-gray-800 hover:text-[#93D419]'
            }`}
          >
            <HiLightBulb className="w-5 h-5" />
            TechInsight
          </Link>
          <Link
            href="/admin/events"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              pathname?.startsWith('/admin/events')
                ? 'bg-[#93D419] text-white'
                : 'text-gray-300 hover:bg-gray-800 hover:text-[#93D419]'
            }`}
          >
            <HiCalendar className="w-5 h-5" />
            Events
          </Link>
          <Link
            href="/admin/sponsor"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              pathname?.startsWith('/admin/sponsor')
                ? 'bg-[#93D419] text-white'
                : 'text-gray-300 hover:bg-gray-800 hover:text-[#93D419]'
            }`}
          >
            <HiUsers className="w-5 h-5" />
            Sponsors
          </Link>
          <Link
            href="/admin/statistics"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              pathname?.startsWith('/admin/statistics')
                ? 'bg-[#93D419] text-white'
                : 'text-gray-300 hover:bg-gray-800 hover:text-[#93D419]'
            }`}
          >
            <HiChartBar className="w-5 h-5" />
            Statistics
          </Link>
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-300 hover:bg-gray-800 hover:text-[#93D419] transition-colors"
          >
            <HiLogout className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64">
        {children}
      </main>
    </div>
  )
}
