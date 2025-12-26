'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { format } from 'date-fns'
import { enUS } from 'date-fns/locale'

interface News {
  id: string
  title: string
  slug: string
  excerpt: string | null
  published: boolean
  featuredType: string | null
  createdAt: string
  category: {
    name: string
  } | null
}

export default function NewsPage() {
  const router = useRouter()
  const [news, setNews] = useState<News[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)

  const handleFeaturedChange = async (newsId: string, value: string) => {
    const featuredType = value === '' ? null : value
    setUpdating(newsId)
    const token = localStorage.getItem('adminToken')
    if (!token) {
      router.push('/admin')
      return
    }

    try {
      const response = await fetch(`/api/admin/news/${newsId}/featured`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ featuredType }),
      })

      const data = await response.json()

      if (!response.ok) {
        console.error('API Error:', {
          status: response.status,
          statusText: response.statusText,
          error: data.error,
          details: data.details
        })
        alert(data.error || `Failed to update featured status (${response.status})`)
        return
      }

      // Update local state immediately
      setNews(news.map(item => 
        item.id === newsId 
          ? { ...item, featuredType }
          : featuredType && item.featuredType === featuredType
          ? { ...item, featuredType: null } // Remove from other position if same type selected
          : item
      ))
    } catch (error: any) {
      console.error('Network Error:', error)
      alert(`Network error: ${error.message || 'Please check your connection and try again.'}`)
    } finally {
      setUpdating(null)
    }
  }

  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    if (!token) {
      router.push('/admin')
      return
    }

    fetch('/api/admin/news', {
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
          // For other errors, just show empty list
          setNews([])
        } else {
          setNews(data)
        }
      })
      .catch((error) => {
        console.error('Error fetching news:', error)
        // Don't logout on network errors
        setNews([])
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
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">News</h1>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/kategoriler"
            className="bg-gray-200 text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
          >
            Categories
          </Link>
          <Link
            href="/admin/haberler/yeni"
            className="bg-[#93D419] text-gray-900 px-4 py-2 rounded-lg hover:bg-[#7fb315] transition-colors font-semibold"
          >
            + New News
          </Link>
        </div>
      </div>

      {news.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-600">No news articles found. Create your first article!</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Featured
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {news.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {item.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.category?.name || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(new Date(item.createdAt), 'MMM d, yyyy', { locale: enUS })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        item.published
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {item.published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={item.featuredType || ''}
                      onChange={(e) => handleFeaturedChange(item.id, e.target.value)}
                      disabled={updating === item.id || !item.published}
                      className="text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-[#93D419] focus:border-[#93D419] bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="">Not Featured</option>
                      <option value="main">Main Featured</option>
                      <option value="secondary1">Secondary 1</option>
                      <option value="secondary2">Secondary 2</option>
                      <option value="secondary3">Secondary 3</option>
                    </select>
                    {!item.published && (
                      <p className="text-xs text-gray-400 mt-1">Publish first</p>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link
                      href={`/admin/haberler/${item.id}`}
                      className="text-[#93D419] hover:text-[#7fb315]"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

