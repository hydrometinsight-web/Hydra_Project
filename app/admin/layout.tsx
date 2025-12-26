'use client'

import { useEffect, useState, useCallback } from 'react'
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
import { getSessionInfo, saveSessionInfo, updateActivity, isSessionValid, clearSession, trackActivity } from '@/lib/adminSecurity'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [hasToken, setHasToken] = useState(false)
  const [sessionWarning, setSessionWarning] = useState(false)

  // Verify token with server
  const verifyToken = useCallback(async () => {
    const token = localStorage.getItem('adminToken')
    if (!token) {
      return false
    }

    try {
      const response = await fetch('/api/admin/verify', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json()
      return data.valid === true
    } catch {
      return false
    }
  }, [])

  // Check session validity
  const checkSession = useCallback(() => {
    if (!isSessionValid()) {
      clearSession()
      router.push('/admin?expired=true')
      return false
    }

    // Check if session is about to expire (5 minutes warning)
    const session = getSessionInfo()
    if (session) {
      const timeRemaining = 30 * 60 * 1000 - (Date.now() - session.loginTime)
      if (timeRemaining < 5 * 60 * 1000 && timeRemaining > 0) {
        setSessionWarning(true)
      } else {
        setSessionWarning(false)
      }
    }

    return true
  }, [router])

  useEffect(() => {
    // For login page, don't check token
    if (pathname === '/admin') {
      return
    }

    const initializeSession = async () => {
      // Check local session first
      if (!isSessionValid()) {
        clearSession()
        router.push('/admin?expired=true')
        return
      }

      // Verify token with server
      const isValid = await verifyToken()
      if (!isValid) {
        clearSession()
        router.push('/admin?expired=true')
        return
      }

      setHasToken(true)
      updateActivity()
    }

    initializeSession()

    // Set up activity tracking
    const activityEvents = ['mousedown', 'keydown', 'scroll', 'touchstart']
    const handleActivity = () => {
      updateActivity()
      trackActivity('activity', { path: pathname })
    }

    activityEvents.forEach(event => {
      window.addEventListener(event, handleActivity, { passive: true })
    })

    // Check session every minute
    const sessionCheckInterval = setInterval(() => {
      if (!checkSession()) {
        clearInterval(sessionCheckInterval)
      }
    }, 60000) // Check every minute

    // Verify token every 5 minutes
    const tokenVerifyInterval = setInterval(async () => {
      const isValid = await verifyToken()
      if (!isValid) {
        clearSession()
        router.push('/admin?expired=true')
        clearInterval(tokenVerifyInterval)
      }
    }, 5 * 60 * 1000) // Verify every 5 minutes

    return () => {
      activityEvents.forEach(event => {
        window.removeEventListener(event, handleActivity)
      })
      clearInterval(sessionCheckInterval)
      clearInterval(tokenVerifyInterval)
    }
  }, [router, pathname, verifyToken, checkSession])

  const handleLogout = async () => {
    const token = localStorage.getItem('adminToken')
    if (token) {
      try {
        await fetch('/api/admin/logout', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
      } catch {
        // Ignore errors
      }
    }
    trackActivity('logout', { path: pathname })
    clearSession()
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
              pathname?.startsWith('/admin/haberler') || pathname?.startsWith('/admin/kategoriler')
                ? 'bg-[#93D419] text-white'
                : 'text-gray-300 hover:bg-gray-800 hover:text-[#93D419]'
            }`}
          >
            <HiNewspaper className="w-5 h-5" />
            News
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
          <Link
            href="/admin/newsletter"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              pathname?.startsWith('/admin/newsletter')
                ? 'bg-[#93D419] text-white'
                : 'text-gray-300 hover:bg-gray-800 hover:text-[#93D419]'
            }`}
          >
            <HiNewspaper className="w-5 h-5" />
            Newsletter
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
        {/* Session Warning */}
        {sessionWarning && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 m-4">
            <div className="flex items-center justify-between">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    Your session will expire soon. Please save your work.
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  updateActivity()
                  setSessionWarning(false)
                }}
                className="ml-4 text-sm text-yellow-700 hover:text-yellow-900 underline"
              >
                Extend Session
              </button>
            </div>
          </div>
        )}
        {children}
      </main>
    </div>
  )
}
