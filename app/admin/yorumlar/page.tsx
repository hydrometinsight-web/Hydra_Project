'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { format } from 'date-fns'
import { enUS } from 'date-fns/locale'
import { HiCheck, HiX, HiTrash, HiEye, HiEyeOff } from 'react-icons/hi'

interface Comment {
  id: string
  name: string
  email: string
  content: string
  approved: boolean
  createdAt: string
  news: {
    id: string
    title: string
    slug: string
  }
}

interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

interface Counts {
  pending: number
  approved: number
  all: number
}

export default function CommentsPage() {
  const router = useRouter()
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<'all' | 'approved' | 'pending'>('pending')
  const [pagination, setPagination] = useState<Pagination | null>(null)
  const [counts, setCounts] = useState<Counts>({ pending: 0, approved: 0, all: 0 })
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    fetchComments()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, currentPage])

  const fetchComments = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('adminToken')
      if (!token) {
        console.error('No admin token found')
        return
      }

      const params = new URLSearchParams({
        status: statusFilter,
        page: currentPage.toString(),
        limit: '20',
      })
      const res = await fetch(`/api/admin/comments?${params}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      
      if (!res.ok) {
        console.error('Failed to fetch comments:', res.status, res.statusText)
        return
      }

      const data = await res.json()
      if (data.error) {
        console.error('API error:', data.error)
        return
      }

      if (data.comments) {
        setComments(data.comments)
        setPagination(data.pagination)
        if (data.counts) {
          setCounts(data.counts)
        }
      }
    } catch (error) {
      console.error('Error fetching comments:', error)
      alert('Failed to load comments. Please refresh the page.')
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (id: string, approved: boolean) => {
    try {
      const token = localStorage.getItem('adminToken')
      if (!token) {
        alert('Authentication required. Please login again.')
        router.push('/admin')
        return
      }

      const res = await fetch(`/api/admin/comments/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ approved }),
      })

      if (!res.ok) {
        const data = await res.json()
        alert(data.error || 'Failed to update comment')
        return
      }

      const data = await res.json()
      if (data.error) {
        alert(data.error)
        return
      }

      // Refresh comments list
      fetchComments()
    } catch (error) {
      console.error('Error updating comment:', error)
      alert('Failed to update comment. Please try again.')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this comment?')) {
      return
    }
    try {
      const token = localStorage.getItem('adminToken')
      if (!token) {
        alert('Authentication required. Please login again.')
        router.push('/admin')
        return
      }

      const res = await fetch(`/api/admin/comments/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!res.ok) {
        const data = await res.json()
        alert(data.error || 'Failed to delete comment')
        return
      }

      const data = await res.json()
      if (data.error) {
        alert(data.error)
        return
      }

      // Refresh comments list
      fetchComments()
    } catch (error) {
      console.error('Error deleting comment:', error)
      alert('Failed to delete comment. Please try again.')
    }
  }

  const pendingCount = counts.pending
  const approvedCount = counts.approved

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Comment Management</h1>
        <p className="text-gray-600">Manage and moderate comments on news articles</p>
      </div>

      {/* Status Filter */}
      <div className="mb-6 flex gap-4">
        <button
          onClick={() => {
            setStatusFilter('all')
            setCurrentPage(1)
          }}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            statusFilter === 'all'
              ? 'bg-[#93D419] text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          All ({counts.all || 0})
        </button>
        <button
          onClick={() => {
            setStatusFilter('pending')
            setCurrentPage(1)
          }}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            statusFilter === 'pending'
              ? 'bg-yellow-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Pending ({pendingCount})
        </button>
        <button
          onClick={() => {
            setStatusFilter('approved')
            setCurrentPage(1)
          }}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            statusFilter === 'approved'
              ? 'bg-green-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Approved ({approvedCount})
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#93D419] mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading comments...</p>
          </div>
        </div>
      ) : comments.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-600 text-lg">
            {statusFilter === 'pending'
              ? 'No pending comments'
              : statusFilter === 'approved'
              ? 'No approved comments'
              : 'No comments found'}
          </p>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Comment
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Article
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Author
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {comments.map((comment) => (
                    <tr key={comment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 max-w-md line-clamp-2">
                          {comment.content}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link
                          href={`/haber/${comment.news.slug}`}
                          target="_blank"
                          className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          {comment.news.title}
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{comment.name}</div>
                        <div className="text-sm text-gray-500">{comment.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {format(new Date(comment.createdAt), 'MMM d, yyyy', { locale: enUS })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            comment.approved
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {comment.approved ? 'Approved' : 'Pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          {comment.approved ? (
                            <button
                              onClick={() => handleApprove(comment.id, false)}
                              className="text-yellow-600 hover:text-yellow-900"
                              title="Unapprove"
                            >
                              <HiEyeOff className="w-5 h-5" />
                            </button>
                          ) : (
                            <button
                              onClick={() => handleApprove(comment.id, true)}
                              className="text-green-600 hover:text-green-900"
                              title="Approve"
                            >
                              <HiCheck className="w-5 h-5" />
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(comment.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete"
                          >
                            <HiTrash className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing {((currentPage - 1) * pagination.limit) + 1} to{' '}
                {Math.min(currentPage * pagination.limit, pagination.total)} of {pagination.total}{' '}
                comments
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="px-4 py-2 text-gray-700">
                  Page {currentPage} of {pagination.totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(pagination.totalPages, p + 1))}
                  disabled={currentPage === pagination.totalPages}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

