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

interface SponsorshipStats {
  toolSponsorship: {
    toolSessions: number
    uniqueEngineers: number
    avgSessionDuration: string
    learnMoreClicks: number
    countries: Array<{ country: string; percentage: number }>
    industries: string[]
  }
  technologyPartner: {
    pageViews: number
    uniqueVisitors: number
    newsletterOpens: number
    clickThroughRate: string
    countries: Array<{ country: string; percentage: number }>
    industries: string[]
  }
  technicalContentPartnership: {
    articleViews: number
    uniqueReaders: number
    avgReadTime: string
    newsletterClicks: number
    countries: Array<{ country: string; percentage: number }>
    industries: string[]
  }
  webinarEvents: {
    totalRegistrations: number
    attendees: number
    avgAttendanceRate: string
    recordingViews: number
    countries: Array<{ country: string; percentage: number }>
    industries: string[]
  }
}

export default function StatisticsPage() {
  const router = useRouter()
  const [stats, setStats] = useState<Stats | null>(null)
  const [sponsorshipStats, setSponsorshipStats] = useState<SponsorshipStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [sponsorshipLoading, setSponsorshipLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState('march-2026')

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

    // Fetch sponsorship stats
    fetch(`/api/admin/sponsorship-stats?period=${selectedPeriod}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (res.status === 401 || res.status === 403) {
          return null
        }
        return res.json()
      })
      .then((data) => {
        if (data && !data.error) {
          setSponsorshipStats(data)
        }
      })
      .catch((error) => {
        console.error('Error fetching sponsorship stats:', error)
      })
      .finally(() => setSponsorshipLoading(false))
  }, [router, selectedPeriod])

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
          <select 
            value={selectedPeriod}
            onChange={(e) => {
              setSelectedPeriod(e.target.value)
              setSponsorshipLoading(true)
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#93D419] focus:border-[#93D419]"
          >
            <option value="march-2026">March 2026</option>
            <option value="february-2026">February 2026</option>
            <option value="january-2026">January 2026</option>
          </select>
        </div>

        {sponsorshipLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#93D419] mx-auto"></div>
            <p className="mt-2 text-gray-600 text-sm">Loading sponsorship statistics...</p>
          </div>
        ) : !sponsorshipStats ? (
          <div className="text-center py-8 text-gray-500">
            No sponsorship statistics available for this period.
          </div>
        ) : (
          <>
            {/* Tool Sponsorship Stats */}
            {sponsorshipStats.toolSponsorship && (
              <div className="border border-gray-200 rounded-lg p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Tool Sponsorship</h3>
                  <span className="text-sm text-gray-500">
                    Period: {selectedPeriod === 'march-2026' ? 'March 2026' : selectedPeriod === 'february-2026' ? 'February 2026' : 'January 2026'}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Tool Sessions</p>
                    <p className="text-2xl font-bold text-gray-900">{sponsorshipStats.toolSponsorship.toolSessions.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Unique Engineers</p>
                    <p className="text-2xl font-bold text-gray-900">{sponsorshipStats.toolSponsorship.uniqueEngineers.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Avg. Session Duration</p>
                    <p className="text-2xl font-bold text-gray-900">{sponsorshipStats.toolSponsorship.avgSessionDuration}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Learn More Clicks</p>
                    <p className="text-2xl font-bold text-gray-900">{sponsorshipStats.toolSponsorship.learnMoreClicks.toLocaleString()}</p>
                  </div>
                </div>

                {/* Countries Distribution */}
                {sponsorshipStats.toolSponsorship.countries.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Countries</h4>
                    <div className="space-y-2">
                      {sponsorshipStats.toolSponsorship.countries.slice(0, 3).map((item, index) => {
                        const colors = ['bg-[#93D419]', 'bg-blue-500', 'bg-purple-500']
                        return (
                          <div key={item.country} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className={`w-3 h-3 rounded-full ${colors[index] || 'bg-gray-500'}`}></div>
                              <span className="text-sm text-gray-700">{item.country}</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div className={`h-full ${colors[index] || 'bg-gray-500'} rounded-full`} style={{ width: `${item.percentage}%` }}></div>
                              </div>
                              <span className="text-sm font-semibold text-gray-900 w-12 text-right">{item.percentage}%</span>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* Industries */}
                {sponsorshipStats.toolSponsorship.industries.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Industries</h4>
                    <div className="flex flex-wrap gap-2">
                      {sponsorshipStats.toolSponsorship.industries.map((industry) => (
                        <span key={industry} className="px-3 py-1.5 bg-[#93D419]/10 text-[#93D419] rounded-full text-sm font-medium">
                          {industry}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Technology Partner Stats */}
            {sponsorshipStats.technologyPartner && (
              <div className="border border-gray-200 rounded-lg p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Technology Partner</h3>
                  <span className="text-sm text-gray-500">
                    Period: {selectedPeriod === 'march-2026' ? 'March 2026' : selectedPeriod === 'february-2026' ? 'February 2026' : 'January 2026'}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Page Views</p>
                    <p className="text-2xl font-bold text-gray-900">{sponsorshipStats.technologyPartner.pageViews.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Unique Visitors</p>
                    <p className="text-2xl font-bold text-gray-900">{sponsorshipStats.technologyPartner.uniqueVisitors.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Newsletter Opens</p>
                    <p className="text-2xl font-bold text-gray-900">{sponsorshipStats.technologyPartner.newsletterOpens.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Click-Through Rate</p>
                    <p className="text-2xl font-bold text-gray-900">{sponsorshipStats.technologyPartner.clickThroughRate}</p>
                  </div>
                </div>

                {/* Countries Distribution */}
                {sponsorshipStats.technologyPartner.countries.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Countries</h4>
                    <div className="space-y-2">
                      {sponsorshipStats.technologyPartner.countries.slice(0, 3).map((item, index) => {
                        const colors = ['bg-[#93D419]', 'bg-blue-500', 'bg-purple-500']
                        return (
                          <div key={item.country} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className={`w-3 h-3 rounded-full ${colors[index] || 'bg-gray-500'}`}></div>
                              <span className="text-sm text-gray-700">{item.country}</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div className={`h-full ${colors[index] || 'bg-gray-500'} rounded-full`} style={{ width: `${item.percentage}%` }}></div>
                              </div>
                              <span className="text-sm font-semibold text-gray-900 w-12 text-right">{item.percentage}%</span>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* Industries */}
                {sponsorshipStats.technologyPartner.industries.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Industries</h4>
                    <div className="flex flex-wrap gap-2">
                      {sponsorshipStats.technologyPartner.industries.map((industry) => (
                        <span key={industry} className="px-3 py-1.5 bg-[#93D419]/10 text-[#93D419] rounded-full text-sm font-medium">
                          {industry}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Technical Content Partnership Stats */}
            {sponsorshipStats.technicalContentPartnership && (
              <div className="border border-gray-200 rounded-lg p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Technical Content Partnership</h3>
                  <span className="text-sm text-gray-500">
                    Period: {selectedPeriod === 'march-2026' ? 'March 2026' : selectedPeriod === 'february-2026' ? 'February 2026' : 'January 2026'}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Article Views</p>
                    <p className="text-2xl font-bold text-gray-900">{sponsorshipStats.technicalContentPartnership.articleViews.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Unique Readers</p>
                    <p className="text-2xl font-bold text-gray-900">{sponsorshipStats.technicalContentPartnership.uniqueReaders.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Avg. Read Time</p>
                    <p className="text-2xl font-bold text-gray-900">{sponsorshipStats.technicalContentPartnership.avgReadTime}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Newsletter Clicks</p>
                    <p className="text-2xl font-bold text-gray-900">{sponsorshipStats.technicalContentPartnership.newsletterClicks.toLocaleString()}</p>
                  </div>
                </div>

                {/* Countries Distribution */}
                {sponsorshipStats.technicalContentPartnership.countries.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Countries</h4>
                    <div className="space-y-2">
                      {sponsorshipStats.technicalContentPartnership.countries.slice(0, 3).map((item, index) => {
                        const colors = ['bg-[#93D419]', 'bg-blue-500', 'bg-purple-500']
                        return (
                          <div key={item.country} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className={`w-3 h-3 rounded-full ${colors[index] || 'bg-gray-500'}`}></div>
                              <span className="text-sm text-gray-700">{item.country}</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div className={`h-full ${colors[index] || 'bg-gray-500'} rounded-full`} style={{ width: `${item.percentage}%` }}></div>
                              </div>
                              <span className="text-sm font-semibold text-gray-900 w-12 text-right">{item.percentage}%</span>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* Industries */}
                {sponsorshipStats.technicalContentPartnership.industries.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Industries</h4>
                    <div className="flex flex-wrap gap-2">
                      {sponsorshipStats.technicalContentPartnership.industries.map((industry) => (
                        <span key={industry} className="px-3 py-1.5 bg-[#93D419]/10 text-[#93D419] rounded-full text-sm font-medium">
                          {industry}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Webinar & Events Stats */}
            {sponsorshipStats.webinarEvents && (
              <div className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Webinar & Events</h3>
                  <span className="text-sm text-gray-500">
                    Period: {selectedPeriod === 'march-2026' ? 'March 2026' : selectedPeriod === 'february-2026' ? 'February 2026' : 'January 2026'}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total Registrations</p>
                    <p className="text-2xl font-bold text-gray-900">{sponsorshipStats.webinarEvents.totalRegistrations.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Attendees</p>
                    <p className="text-2xl font-bold text-gray-900">{sponsorshipStats.webinarEvents.attendees.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Avg. Attendance Rate</p>
                    <p className="text-2xl font-bold text-gray-900">{sponsorshipStats.webinarEvents.avgAttendanceRate}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Recording Views</p>
                    <p className="text-2xl font-bold text-gray-900">{sponsorshipStats.webinarEvents.recordingViews.toLocaleString()}</p>
                  </div>
                </div>

                {/* Countries Distribution */}
                {sponsorshipStats.webinarEvents.countries.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Countries</h4>
                    <div className="space-y-2">
                      {sponsorshipStats.webinarEvents.countries.slice(0, 3).map((item, index) => {
                        const colors = ['bg-[#93D419]', 'bg-blue-500', 'bg-purple-500']
                        return (
                          <div key={item.country} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className={`w-3 h-3 rounded-full ${colors[index] || 'bg-gray-500'}`}></div>
                              <span className="text-sm text-gray-700">{item.country}</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div className={`h-full ${colors[index] || 'bg-gray-500'} rounded-full`} style={{ width: `${item.percentage}%` }}></div>
                              </div>
                              <span className="text-sm font-semibold text-gray-900 w-12 text-right">{item.percentage}%</span>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* Industries */}
                {sponsorshipStats.webinarEvents.industries.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Industries</h4>
                    <div className="flex flex-wrap gap-2">
                      {sponsorshipStats.webinarEvents.industries.map((industry) => (
                        <span key={industry} className="px-3 py-1.5 bg-[#93D419]/10 text-[#93D419] rounded-full text-sm font-medium">
                          {industry}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
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

