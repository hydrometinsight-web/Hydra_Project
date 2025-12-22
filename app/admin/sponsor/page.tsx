'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function SponsorPage() {
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    if (!token) {
      router.push('/admin')
      return
    }
  }, [router])

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Sponsors</h1>
      </div>

      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Sponsor management coming soon.</p>
          <p className="text-sm text-gray-500">
            This section will allow you to manage sponsors and their information.
          </p>
        </div>
      </div>
    </div>
  )
}
