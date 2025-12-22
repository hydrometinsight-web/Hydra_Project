'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface Stats {
  news?: {
    total: number
    published: number
    draft: number
    last7Days: number
    last30Days: number
  }
  categories?: {
    total: number
  }
  questions?: {
    total: number
    answered: number
    pending: number
    last7Days: number
    last30Days: number
  }
  events?: {
    total: number
    published: number
    draft: number
    last7Days: number
    last30Days: number
  }
  techInsight?: {
    total: number
    published: number
    draft: number
    last7Days: number
    last30Days: number
  }
  comments?: {
    total: number
    approved: number
    pending: number
    last7Days: number
    last30Days: number
  }
  users?: {
    total: number
  }
  activity?: {
    last7Days: {
      news: number
      events: number
      techInsight: number
      comments: number
      questions: number
    }
    last30Days: {
      news: number
      events: number
      techInsight: number
      comments: number
      questions: number
    }
  }
  pageViews?: {
    total: number
    last7Days: number
    last30Days: number
    bySection: Array<{ section: string; count: number }>
    byCountry: Array<{ country: string; count: number }>
  }
}

export default function StatisticsPage() {
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
          // Only logout on auth errors
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
        // Don't logout on network errors
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
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Statistics</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* News Stats */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">News</h2>
          <p className="text-3xl font-bold text-gray-900">{stats?.news?.total || 0}</p>
          <p className="text-xs text-gray-500 mt-1">
            {stats?.news?.published || 0} published, {stats?.news?.draft || 0} draft
          </p>
          <p className="text-xs text-gray-400 mt-2">
            Last 7 days: {stats?.news?.last7Days || 0} | Last 30 days: {stats?.news?.last30Days || 0}
          </p>
        </div>

        {/* Events Stats */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Events</h2>
          <p className="text-3xl font-bold text-gray-900">{stats?.events?.total || 0}</p>
          <p className="text-xs text-gray-500 mt-1">
            {stats?.events?.published || 0} published, {stats?.events?.draft || 0} draft
          </p>
          <p className="text-xs text-gray-400 mt-2">
            Last 7 days: {stats?.events?.last7Days || 0} | Last 30 days: {stats?.events?.last30Days || 0}
          </p>
        </div>

        {/* TechInsight Stats */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">TechInsight</h2>
          <p className="text-3xl font-bold text-gray-900">{stats?.techInsight?.total || 0}</p>
          <p className="text-xs text-gray-500 mt-1">
            {stats?.techInsight?.published || 0} published, {stats?.techInsight?.draft || 0} draft
          </p>
          <p className="text-xs text-gray-400 mt-2">
            Last 7 days: {stats?.techInsight?.last7Days || 0} | Last 30 days: {stats?.techInsight?.last30Days || 0}
          </p>
        </div>

        {/* Comments Stats */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Comments</h2>
          <p className="text-3xl font-bold text-gray-900">{stats?.comments?.total || 0}</p>
          <p className="text-xs text-gray-500 mt-1">
            {stats?.comments?.approved || 0} approved, {stats?.comments?.pending || 0} pending
          </p>
          <p className="text-xs text-gray-400 mt-2">
            Last 7 days: {stats?.comments?.last7Days || 0} | Last 30 days: {stats?.comments?.last30Days || 0}
          </p>
        </div>
      </div>

      {/* Page Views */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Page Views</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-600">Total</p>
            <p className="text-2xl font-bold text-gray-900">{stats?.pageViews?.total || 0}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Last 7 Days</p>
            <p className="text-2xl font-bold text-gray-900">{stats?.pageViews?.last7Days || 0}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Last 30 Days</p>
            <p className="text-2xl font-bold text-gray-900">{stats?.pageViews?.last30Days || 0}</p>
          </div>
        </div>
        {stats?.pageViews?.bySection && stats.pageViews.bySection.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Most Visited Sections</h3>
            <div className="space-y-2">
              {stats.pageViews.bySection.map((item) => (
                <div key={item.section} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 capitalize">{item.section}</span>
                  <span className="text-sm font-semibold text-gray-900">{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        {stats?.pageViews?.byCountry && stats.pageViews.byCountry.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Countries</h3>
            <div className="space-y-2">
              {stats.pageViews.byCountry.map((item) => (
                <div key={item.country} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 uppercase">{item.country}</span>
                  <span className="text-sm font-semibold text-gray-900">{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Activity - Last 7 Days</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">News</span>
              <span className="text-sm font-semibold text-gray-900">{stats?.activity?.last7Days?.news || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Events</span>
              <span className="text-sm font-semibold text-gray-900">{stats?.activity?.last7Days?.events || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">TechInsight</span>
              <span className="text-sm font-semibold text-gray-900">{stats?.activity?.last7Days?.techInsight || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Comments</span>
              <span className="text-sm font-semibold text-gray-900">{stats?.activity?.last7Days?.comments || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Questions</span>
              <span className="text-sm font-semibold text-gray-900">{stats?.activity?.last7Days?.questions || 0}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Activity - Last 30 Days</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">News</span>
              <span className="text-sm font-semibold text-gray-900">{stats?.activity?.last30Days?.news || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Events</span>
              <span className="text-sm font-semibold text-gray-900">{stats?.activity?.last30Days?.events || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">TechInsight</span>
              <span className="text-sm font-semibold text-gray-900">{stats?.activity?.last30Days?.techInsight || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Comments</span>
              <span className="text-sm font-semibold text-gray-900">{stats?.activity?.last30Days?.comments || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Questions</span>
              <span className="text-sm font-semibold text-gray-900">{stats?.activity?.last30Days?.questions || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

