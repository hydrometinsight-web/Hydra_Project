'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

export default function AdminLogin() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [sessionExpired, setSessionExpired] = useState(false)

  useEffect(() => {
    if (searchParams?.get('expired') === 'true') {
      setSessionExpired(true)
      // Clear any existing session data
      localStorage.removeItem('adminToken')
      localStorage.removeItem('adminSession')
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok && data.token) {
        localStorage.setItem('adminToken', data.token)
        
        // Save session info with IP
        const { saveSessionInfo } = await import('@/lib/adminSecurity')
        const { trackActivity } = await import('@/lib/adminSecurity')
        
        // Get IP (if available)
        let ip = 'unknown'
        try {
          const ipResponse = await fetch('https://api.ipify.org?format=json')
          const ipData = await ipResponse.json()
          ip = ipData.ip || 'unknown'
        } catch {
          // Ignore IP fetch errors
        }
        
        saveSessionInfo(ip)
        trackActivity('login', { email, ip })
        
        // Navigate to dashboard
        router.push('/admin/dashboard')
      } else {
        setError(data.error || 'Login failed')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="flex items-center justify-center mb-4">
            <Image src="/logo1.png" alt="HydroMetInsight Logo" width={60} height={60} className="w-15 h-15 object-contain" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Admin Login
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sign in to access the admin panel
          </p>
          {sessionExpired && (
            <div className="mt-4 rounded-md bg-yellow-50 border border-yellow-200 p-4">
              <p className="text-sm text-yellow-800">
                Your session has expired due to inactivity. Please log in again.
              </p>
            </div>
          )}
        </div>
        <div className="text-center">
          <Link
            href="/admin/forgot-password"
            className="text-sm text-[#93D419] hover:text-[#7fb315] font-medium"
          >
            Forgot your password?
          </Link>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                onInvalid={(e) => {
                  e.currentTarget.setCustomValidity('Please enter a valid email address.')
                }}
                onInput={(e) => {
                  e.currentTarget.setCustomValidity('')
                }}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-[#93D419] focus:border-[#93D419] focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                onInvalid={(e) => {
                  e.currentTarget.setCustomValidity('Please fill in this field.')
                }}
                onInput={(e) => {
                  e.currentTarget.setCustomValidity('')
                }}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-[#93D419] focus:border-[#93D419] focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-800">{error}</div>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#93D419] hover:bg-[#7fb315] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#93D419] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

