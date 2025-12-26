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

      {/* Sponsorship Package Statistics */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Sponsorship Package Statistics</h2>
        
        {/* Period Selector */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Period</label>
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#93D419] focus:border-[#93D419]">
            <option value="march-2026">March 2026</option>
            <option value="february-2026">February 2026</option>
            <option value="january-2026">January 2026</option>
          </select>
        </div>

        {/* Tool Sponsorship Stats */}
        <div className="border border-gray-200 rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Tool Sponsorship</h3>
            <span className="text-sm text-gray-500">Period: March 2026</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">Tool Sessions</p>
              <p className="text-2xl font-bold text-gray-900">2,430</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Unique Engineers</p>
              <p className="text-2xl font-bold text-gray-900">1,120</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Avg. Session Duration</p>
              <p className="text-2xl font-bold text-gray-900">3m 40s</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Learn More Clicks</p>
              <p className="text-2xl font-bold text-gray-900">96</p>
            </div>
          </div>

          {/* Countries Distribution */}
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Countries</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#93D419]"></div>
                  <span className="text-sm text-gray-700">EU</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-[#93D419] rounded-full" style={{ width: '58%' }}></div>
                  </div>
                  <span className="text-sm font-semibold text-gray-900 w-12 text-right">58%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span className="text-sm text-gray-700">NA</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: '22%' }}></div>
                  </div>
                  <span className="text-sm font-semibold text-gray-900 w-12 text-right">22%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                  <span className="text-sm text-gray-700">Asia</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500 rounded-full" style={{ width: '15%' }}></div>
                  </div>
                  <span className="text-sm font-semibold text-gray-900 w-12 text-right">15%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Industries */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Industries</h4>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1.5 bg-[#93D419]/10 text-[#93D419] rounded-full text-sm font-medium">Battery Recycling</span>
              <span className="px-3 py-1.5 bg-[#93D419]/10 text-[#93D419] rounded-full text-sm font-medium">Nickel</span>
              <span className="px-3 py-1.5 bg-[#93D419]/10 text-[#93D419] rounded-full text-sm font-medium">Cobalt</span>
              <span className="px-3 py-1.5 bg-[#93D419]/10 text-[#93D419] rounded-full text-sm font-medium">Lithium</span>
            </div>
          </div>
        </div>

        {/* Technology Partner Stats */}
        <div className="border border-gray-200 rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Technology Partner</h3>
            <span className="text-sm text-gray-500">Period: March 2026</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">Page Views</p>
              <p className="text-2xl font-bold text-gray-900">8,450</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Unique Visitors</p>
              <p className="text-2xl font-bold text-gray-900">3,220</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Newsletter Opens</p>
              <p className="text-2xl font-bold text-gray-900">1,850</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Click-Through Rate</p>
              <p className="text-2xl font-bold text-gray-900">4.2%</p>
            </div>
          </div>

          {/* Countries Distribution */}
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Countries</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#93D419]"></div>
                  <span className="text-sm text-gray-700">EU</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-[#93D419] rounded-full" style={{ width: '52%' }}></div>
                  </div>
                  <span className="text-sm font-semibold text-gray-900 w-12 text-right">52%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span className="text-sm text-gray-700">NA</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: '28%' }}></div>
                  </div>
                  <span className="text-sm font-semibold text-gray-900 w-12 text-right">28%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                  <span className="text-sm text-gray-700">Asia</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500 rounded-full" style={{ width: '12%' }}></div>
                  </div>
                  <span className="text-sm font-semibold text-gray-900 w-12 text-right">12%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Industries */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Industries</h4>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1.5 bg-[#93D419]/10 text-[#93D419] rounded-full text-sm font-medium">Battery Recycling</span>
              <span className="px-3 py-1.5 bg-[#93D419]/10 text-[#93D419] rounded-full text-sm font-medium">Nickel</span>
              <span className="px-3 py-1.5 bg-[#93D419]/10 text-[#93D419] rounded-full text-sm font-medium">Cobalt</span>
              <span className="px-3 py-1.5 bg-[#93D419]/10 text-[#93D419] rounded-full text-sm font-medium">Lithium</span>
              <span className="px-3 py-1.5 bg-[#93D419]/10 text-[#93D419] rounded-full text-sm font-medium">Copper</span>
            </div>
          </div>
        </div>

        {/* Technical Content Partnership Stats */}
        <div className="border border-gray-200 rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Technical Content Partnership</h3>
            <span className="text-sm text-gray-500">Period: March 2026</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">Article Views</p>
              <p className="text-2xl font-bold text-gray-900">5,680</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Unique Readers</p>
              <p className="text-2xl font-bold text-gray-900">2,140</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Avg. Read Time</p>
              <p className="text-2xl font-bold text-gray-900">6m 15s</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Newsletter Clicks</p>
              <p className="text-2xl font-bold text-gray-900">342</p>
            </div>
          </div>

          {/* Countries Distribution */}
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Countries</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#93D419]"></div>
                  <span className="text-sm text-gray-700">EU</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-[#93D419] rounded-full" style={{ width: '55%' }}></div>
                  </div>
                  <span className="text-sm font-semibold text-gray-900 w-12 text-right">55%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span className="text-sm text-gray-700">NA</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: '25%' }}></div>
                  </div>
                  <span className="text-sm font-semibold text-gray-900 w-12 text-right">25%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                  <span className="text-sm text-gray-700">Asia</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500 rounded-full" style={{ width: '18%' }}></div>
                  </div>
                  <span className="text-sm font-semibold text-gray-900 w-12 text-right">18%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Industries */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Industries</h4>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1.5 bg-[#93D419]/10 text-[#93D419] rounded-full text-sm font-medium">Battery Recycling</span>
              <span className="px-3 py-1.5 bg-[#93D419]/10 text-[#93D419] rounded-full text-sm font-medium">Nickel</span>
              <span className="px-3 py-1.5 bg-[#93D419]/10 text-[#93D419] rounded-full text-sm font-medium">Cobalt</span>
              <span className="px-3 py-1.5 bg-[#93D419]/10 text-[#93D419] rounded-full text-sm font-medium">Lithium</span>
            </div>
          </div>
        </div>

        {/* Webinar & Events Stats */}
        <div className="border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Webinar & Events</h3>
            <span className="text-sm text-gray-500">Period: March 2026</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Registrations</p>
              <p className="text-2xl font-bold text-gray-900">1,240</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Attendees</p>
              <p className="text-2xl font-bold text-gray-900">890</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Avg. Attendance Rate</p>
              <p className="text-2xl font-bold text-gray-900">71.8%</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Recording Views</p>
              <p className="text-2xl font-bold text-gray-900">2,150</p>
            </div>
          </div>

          {/* Countries Distribution */}
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Countries</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#93D419]"></div>
                  <span className="text-sm text-gray-700">EU</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-[#93D419] rounded-full" style={{ width: '60%' }}></div>
                  </div>
                  <span className="text-sm font-semibold text-gray-900 w-12 text-right">60%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span className="text-sm text-gray-700">NA</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: '20%' }}></div>
                  </div>
                  <span className="text-sm font-semibold text-gray-900 w-12 text-right">20%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                  <span className="text-sm text-gray-700">Asia</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500 rounded-full" style={{ width: '12%' }}></div>
                  </div>
                  <span className="text-sm font-semibold text-gray-900 w-12 text-right">12%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Industries */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Industries</h4>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1.5 bg-[#93D419]/10 text-[#93D419] rounded-full text-sm font-medium">Battery Recycling</span>
              <span className="px-3 py-1.5 bg-[#93D419]/10 text-[#93D419] rounded-full text-sm font-medium">Nickel</span>
              <span className="px-3 py-1.5 bg-[#93D419]/10 text-[#93D419] rounded-full text-sm font-medium">Cobalt</span>
              <span className="px-3 py-1.5 bg-[#93D419]/10 text-[#93D419] rounded-full text-sm font-medium">Lithium</span>
            </div>
          </div>
        </div>
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

