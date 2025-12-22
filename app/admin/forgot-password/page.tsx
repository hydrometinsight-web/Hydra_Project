'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

export default function ForgotPassword() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [resetUrl, setResetUrl] = useState<string | null>(null)
  const [token, setToken] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess(false)
    setLoading(true)
    setResetUrl(null)
    setToken(null)

    try {
      const response = await fetch('/api/admin/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(true)
        // In development, show the reset URL and token
        if (data.resetUrl && data.token) {
          setResetUrl(data.resetUrl)
          setToken(data.token)
        }
      } else {
        setError(data.error || 'Failed to send reset link')
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
            Forgot Password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your email address and we'll send you a password reset link
          </p>
        </div>

        {success ? (
          <div className="space-y-4">
            <div className="rounded-md bg-green-50 border border-green-200 p-4">
              <p className="text-sm text-green-800">
                {process.env.NODE_ENV === 'development'
                  ? 'Password reset link generated (development mode):'
                  : 'If an account with that email exists, a password reset link has been sent to your email.'}
              </p>
            </div>

            {resetUrl && token && (
              <div className="rounded-md bg-blue-50 border border-blue-200 p-4 space-y-3">
                <p className="text-sm font-medium text-blue-900">Development Mode - Reset Information:</p>
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-blue-700 font-medium mb-1">Reset URL:</p>
                    <a
                      href={resetUrl}
                      className="text-xs text-blue-600 hover:text-blue-800 break-all underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {resetUrl}
                    </a>
                  </div>
                  <div>
                    <p className="text-xs text-blue-700 font-medium mb-1">Token (copy this if needed):</p>
                    <code className="text-xs bg-blue-100 px-2 py-1 rounded break-all block">
                      {token}
                    </code>
                  </div>
                </div>
              </div>
            )}

            <div className="text-center">
              <Link
                href="/admin"
                className="text-sm text-[#93D419] hover:text-[#7fb315] font-medium"
              >
                ← Back to login
              </Link>
            </div>
          </div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
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
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-[#93D419] focus:border-[#93D419] focus:z-10 sm:text-sm"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="text-sm text-red-800">{error}</div>
              </div>
            )}

            <div className="space-y-3">
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#93D419] hover:bg-[#7fb315] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#93D419] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>

              <div className="text-center">
                <Link
                  href="/admin"
                  className="text-sm text-[#93D419] hover:text-[#7fb315] font-medium"
                >
                  ← Back to login
                </Link>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

