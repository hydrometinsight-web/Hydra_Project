'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

interface Stats {
  news?: {
    total: number
    published: number
    draft: number
  }
  categories?: {
    total: number
  }
  questions?: {
    total: number
    answered: number
    pending: number
  }
  events?: {
    total: number
    published: number
    draft: number
  }
  techInsight?: {
    total: number
    published: number
    draft: number
  }
  comments?: {
    total: number
    approved: number
    pending: number
  }
  users?: {
    total: number
  }
}

export default function AdminDashboard() {
  const router = useRouter()
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    if (!token) {
      router.push('/admin')
      return
    }

    fetch('/api/admin/stats', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (res.status === 401 || res.status === 403) {
          // Unauthorized - token expired or invalid
          localStorage.removeItem('adminToken')
          router.push('/admin')
          return null
        }
        return res.json()
      })
      .then((data) => {
        if (!data) return // Already handled error case
        
        if (data.error) {
          // Only logout on auth errors, for other errors just show empty stats
          if (data.error === 'Unauthorized' || data.error === 'Access denied') {
            localStorage.removeItem('adminToken')
            router.push('/admin')
            return
          }
          // For other errors, just show empty stats
          setStats(null)
        } else {
          setStats(data)
        }
      })
      .catch((error) => {
        console.error('Error fetching stats:', error)
        // Don't logout on network errors, just show empty stats
        setStats(null)
      })
      .finally(() => setLoading(false))
  }, [router])

  if (loading) {
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
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <Image src="/logo1.png" alt="Logo" width={40} height={40} className="w-10 h-10 object-contain" />
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* News Stats */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">News</h2>
            <Link href="/admin/haberler" className="text-[#93D419] hover:text-[#7fb315] text-sm">
              Manage →
            </Link>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Total News</p>
            <p className="text-3xl font-bold text-gray-900">{stats?.news?.total || 0}</p>
            <p className="text-xs text-gray-500 mt-1">
              {stats?.news?.published || 0} published, {stats?.news?.draft || 0} draft
            </p>
          </div>
        </div>

        {/* Categories Stats */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Categories</h2>
            <Link href="/admin/kategoriler" className="text-[#93D419] hover:text-[#7fb315] text-sm">
              Manage →
            </Link>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Total Categories</p>
            <p className="text-3xl font-bold text-gray-900">{stats?.categories?.total || 0}</p>
          </div>
        </div>

        {/* Events Stats */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Events</h2>
            <Link href="/admin/events" className="text-[#93D419] hover:text-[#7fb315] text-sm">
              Manage →
            </Link>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Total Events</p>
            <p className="text-3xl font-bold text-gray-900">{stats?.events?.total || 0}</p>
            <p className="text-xs text-gray-500 mt-1">
              {stats?.events?.published || 0} published, {stats?.events?.draft || 0} draft
            </p>
          </div>
        </div>

        {/* TechInsight Stats */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">TechInsight</h2>
            <Link href="/admin/techinsight" className="text-[#93D419] hover:text-[#7fb315] text-sm">
              Manage →
            </Link>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Total TechInsight</p>
            <p className="text-3xl font-bold text-gray-900">{stats?.techInsight?.total || 0}</p>
            <p className="text-xs text-gray-500 mt-1">
              {stats?.techInsight?.published || 0} published, {stats?.techInsight?.draft || 0} draft
            </p>
          </div>
        </div>

        {/* Comments Stats */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Comments</h2>
            <Link href="/admin/yorumlar" className="text-[#93D419] hover:text-[#7fb315] text-sm">
              Manage →
            </Link>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Total Comments</p>
            <p className="text-3xl font-bold text-gray-900">{stats?.comments?.total || 0}</p>
            <p className="text-xs text-gray-500 mt-1">
              {stats?.comments?.approved || 0} approved, {stats?.comments?.pending || 0} pending
            </p>
          </div>
        </div>

        {/* Users Stats */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Users</h2>
          <div>
            <p className="text-sm font-medium text-gray-600">Total Users</p>
            <p className="text-3xl font-bold text-gray-900">{stats?.users?.total || 0}</p>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <Link
          href="/admin/statistics"
          className="inline-flex items-center gap-2 bg-[#93D419] text-gray-900 px-6 py-3 rounded-lg hover:bg-[#7fb315] transition-colors font-semibold"
        >
          View Detailed Statistics →
        </Link>
      </div>
    </div>
  )
}

