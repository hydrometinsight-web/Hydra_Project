'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Stats {
  news?: {
    total: number
    published: number
    draft: number
  }
  techInsight?: {
    total: number
    published: number
    draft: number
  }
  events?: {
    total: number
    published: number
    draft: number
  }
  tags?: {
    total: number
  }
}

export default function ContentPage() {
  const router = useRouter()
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    if (!token) {
      router.push('/admin')
      return
    }

    // Fetch stats
    fetch('/api/admin/stats', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (res.status === 401 || res.status === 403) {
          localStorage.removeItem('adminToken')
          router.push('/admin')
          return null
        }
        return res.json()
      })
      .then((data) => {
        if (!data) return
        if (data.error) {
          if (data.error === 'Unauthorized' || data.error === 'Access denied') {
            localStorage.removeItem('adminToken')
            router.push('/admin')
            return
          }
          setStats(null)
        } else {
          setStats(data)
        }
      })
      .catch((error) => {
        console.error('Error fetching stats:', error)
        setStats(null)
      })
      .finally(() => setLoading(false))
  }, [router])

  return (
    <div className="p-6">
      <div className="mb-6">
        <Link
          href="/admin/dashboard"
          className="text-gray-600 hover:text-[#93D419] mb-4 inline-block text-sm transition-colors font-medium"
        >
          ← Back to Dashboard
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Content</h1>
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

        {/* Tags Stats */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Tags</h2>
            <Link href="/admin/etiketler" className="text-[#93D419] hover:text-[#7fb315] text-sm">
              Manage →
            </Link>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Total Tags</p>
            <p className="text-3xl font-bold text-gray-900">{stats?.tags?.total || 0}</p>
          </div>
        </div>

        {/* Empty Card 5 */}
        <div className="bg-white rounded-lg shadow-md p-6 border-2 border-dashed border-gray-300">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-400">-</h2>
            <span className="text-gray-400 text-sm">-</span>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-400">-</p>
            <p className="text-3xl font-bold text-gray-300">-</p>
          </div>
        </div>

        {/* Empty Card 6 */}
        <div className="bg-white rounded-lg shadow-md p-6 border-2 border-dashed border-gray-300">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-400">-</h2>
            <span className="text-gray-400 text-sm">-</span>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-400">-</p>
            <p className="text-3xl font-bold text-gray-300">-</p>
          </div>
        </div>
      </div>
    </div>
  )
}

