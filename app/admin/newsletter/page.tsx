'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

interface Subscriber {
  id: string
  email: string
  active: boolean
  createdAt: string
}

interface Campaign {
  id: string
  subject: string
  content: string
  status: string
  recipients: number
  sentAt: string | null
  createdAt: string
}

export default function NewsletterPage() {
  const router = useRouter()
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'subscribers' | 'campaigns'>('subscribers')
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
  })

  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    if (!token) {
      router.push('/admin')
      return
    }

    fetchData(token)
  }, [router])

  const fetchData = async (token: string) => {
    try {
      // Fetch subscribers
      const subscribersRes = await fetch('/api/admin/newsletter/subscribers', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (subscribersRes.ok) {
        const subscribersData = await subscribersRes.json()
        setSubscribers(subscribersData.subscribers || [])
        setStats(subscribersData.stats || { total: 0, active: 0, inactive: 0 })
      }

      // Fetch campaigns
      const campaignsRes = await fetch('/api/admin/newsletter/campaigns', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (campaignsRes.ok) {
        const campaignsData = await campaignsRes.json()
        setCampaigns(campaignsData || [])
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSendCampaign = async (campaignId: string) => {
    if (!confirm('Are you sure you want to send this newsletter to all active subscribers?')) {
      return
    }

    const token = localStorage.getItem('adminToken')
    if (!token) {
      router.push('/admin')
      return
    }

    try {
      const res = await fetch('/api/admin/newsletter/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ campaignId }),
      })

      const data = await res.json()

      if (res.ok) {
        alert(`Newsletter sent successfully to ${data.recipients} subscribers!`)
        fetchData(token)
      } else {
        alert(data.error || 'Failed to send newsletter')
      }
    } catch (error) {
      console.error('Error sending newsletter:', error)
      alert('Failed to send newsletter')
    }
  }

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
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Newsletter Management</h1>
        <div className="flex gap-3">
          <Link
            href="/admin/newsletter/new"
            className="bg-[#93D419] text-gray-900 px-4 py-2 rounded-lg hover:bg-[#7fb315] transition-colors font-semibold inline-flex items-center gap-2"
          >
            <Image src="/logo1.png" alt="Logo" width={16} height={16} className="w-4 h-4 object-contain" />
            New Campaign
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-md p-4">
          <p className="text-sm font-medium text-gray-600">Total Subscribers</p>
          <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <p className="text-sm font-medium text-gray-600">Active Subscribers</p>
          <p className="text-3xl font-bold text-green-600">{stats.active}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <p className="text-sm font-medium text-gray-600">Inactive Subscribers</p>
          <p className="text-3xl font-bold text-red-600">{stats.inactive}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('subscribers')}
              className={`py-4 px-6 text-sm font-medium border-b-2 ${
                activeTab === 'subscribers'
                  ? 'border-[#93D419] text-[#93D419]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Subscribers ({stats.active})
            </button>
            <button
              onClick={() => setActiveTab('campaigns')}
              className={`py-4 px-6 text-sm font-medium border-b-2 ${
                activeTab === 'campaigns'
                  ? 'border-[#93D419] text-[#93D419]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Campaigns ({campaigns.length})
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'subscribers' ? (
            <div>
              {subscribers.length === 0 ? (
                <p className="text-gray-600 text-center py-8">No subscribers found.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Subscribed
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {subscribers.map((subscriber) => (
                        <tr key={subscriber.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {subscriber.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {subscriber.active ? (
                              <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                                Active
                              </span>
                            ) : (
                              <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                                Inactive
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(subscriber.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ) : (
            <div>
              {campaigns.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-600 mb-4">No campaigns found. Create your first newsletter campaign!</p>
                  <Link
                    href="/admin/newsletter/new"
                    className="inline-block bg-[#93D419] text-gray-900 px-4 py-2 rounded-lg hover:bg-[#7fb315] transition-colors font-semibold"
                  >
                    Create Campaign
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {campaigns.map((campaign) => (
                    <div key={campaign.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">{campaign.subject}</h3>
                          <p className="text-sm text-gray-600 mb-2 line-clamp-2">{campaign.content}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>
                              Status: <span className="font-medium capitalize">{campaign.status}</span>
                            </span>
                            <span>
                              Recipients: <span className="font-medium">{campaign.recipients}</span>
                            </span>
                            {campaign.sentAt && (
                              <span>
                                Sent: <span className="font-medium">{new Date(campaign.sentAt).toLocaleString()}</span>
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2 ml-4">
                          {campaign.status === 'draft' && (
                            <button
                              onClick={() => handleSendCampaign(campaign.id)}
                              className="bg-[#93D419] text-gray-900 px-4 py-2 rounded-lg hover:bg-[#7fb315] transition-colors font-semibold text-sm"
                            >
                              Send
                            </button>
                          )}
                          <button
                            onClick={async () => {
                              try {
                                const res = await fetch('/api/admin/newsletter/export-pdf', {
                                  method: 'POST',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({ campaignId: campaign.id }),
                                })
                                const data = await res.json()
                                if (data.success && data.pdf) {
                                  // Create download link
                                  const link = document.createElement('a')
                                  link.href = data.pdf
                                  link.download = data.filename
                                  document.body.appendChild(link)
                                  link.click()
                                  document.body.removeChild(link)
                                } else {
                                  alert(data.error || 'Failed to generate PDF')
                                }
                              } catch (error) {
                                console.error('Error exporting PDF:', error)
                                alert('Failed to export PDF')
                              }
                            }}
                            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors font-semibold text-sm"
                          >
                            Export PDF
                          </button>
                          <Link
                            href={`/admin/newsletter/${campaign.id}`}
                            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors font-semibold text-sm"
                          >
                            View
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

