'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import RichTextEditor from '@/components/RichTextEditor'
import ImageUpload from '@/components/ImageUpload'

interface News {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string | null
  imageUrl: string | null
  published: boolean
  categoryId: string | null
  category: {
    id: string
    name: string
  } | null
}

interface Category {
  id: string
  name: string
  slug: string
}

export default function EditNewsPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [news, setNews] = useState<News | null>(null)
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [content, setContent] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [published, setPublished] = useState(false)
  const [categoryId, setCategoryId] = useState('')
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    if (!token) {
      router.push('/admin')
      return
    }

    // Fetch news
    fetch(`/api/admin/news/${id}`, {
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
          setError(data.error)
        } else {
          setNews(data)
          setTitle(data.title)
          setSlug(data.slug)
          setContent(data.content)
          setExcerpt(data.excerpt || '')
          setImageUrl(data.imageUrl || '')
          setPublished(data.published)
          setCategoryId(data.categoryId || '')
        }
      })
      .catch((error) => {
        console.error('Error fetching news:', error)
        setError('Failed to load news')
      })

    // Fetch categories
    fetch('/api/admin/categories', {
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
        if (!data) return
        if (!data.error) {
          setCategories(data)
        }
      })
      .catch((error) => {
        console.error('Error fetching categories:', error)
      })
      .finally(() => setLoading(false))
  }, [id, router])

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setTitle(value)
    if (!slug || slug === generateSlug(news?.title || '')) {
      setSlug(generateSlug(value))
    }
  }

  const handlePreview = () => {
    // Save current form data to localStorage for preview
    const previewData = {
      title,
      slug,
      content,
      excerpt: excerpt || null,
      imageUrl: imageUrl || null,
      category: categories.find(c => c.id === categoryId) || null,
      createdAt: news?.createdAt || new Date().toISOString(),
      author: { name: 'Admin' }, // You can get this from the API if needed
    }
    localStorage.setItem(`news-preview-${id}`, JSON.stringify(previewData))
    window.open(`/admin/haberler/${id}/preview`, '_blank')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Check if content is empty (only HTML tags)
    const contentText = content.replace(/<[^>]*>/g, '').trim()
    if (!contentText) {
      setError('Content is required')
      return
    }

    setIsSubmitting(true)
    setError('')

    const token = localStorage.getItem('adminToken')
    if (!token) {
      router.push('/admin')
      return
    }

    try {
      const response = await fetch(`/api/admin/news/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          slug,
          content,
          excerpt: excerpt || null,
          imageUrl: imageUrl || null,
          published,
          categoryId: categoryId || null,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        router.push('/admin/haberler')
      } else {
        setError(data.error || 'Failed to update news')
      }
    } catch (error) {
      console.error('Error updating news:', error)
      setError('An error occurred. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this news article? This action cannot be undone.')) {
      return
    }

    const token = localStorage.getItem('adminToken')
    if (!token) {
      router.push('/admin')
      return
    }

    try {
      const response = await fetch(`/api/admin/news/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        router.push('/admin/haberler')
      } else {
        const data = await response.json()
        setError(data.error || 'Failed to delete news')
      }
    } catch (error) {
      console.error('Error deleting news:', error)
      setError('An error occurred. Please try again.')
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

  if (!news) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-600">News article not found</p>
          <Link
            href="/admin/haberler"
            className="text-[#93D419] hover:text-[#7fb315] mt-4 inline-block"
          >
            Back to News
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link
            href="/admin/haberler"
            className="text-gray-600 hover:text-[#93D419] mb-4 inline-block text-sm transition-colors font-medium"
          >
            ← Back to News
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Edit News</h1>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-8">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        <div className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={handleTitleChange}
              required
              onInvalid={(e) => {
                e.currentTarget.setCustomValidity('Please fill in this field.')
              }}
              onInput={(e) => {
                e.currentTarget.setCustomValidity('')
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#93D419] focus:border-transparent"
              placeholder="News title"
            />
          </div>

          <div>
            <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-2">
              Slug *
            </label>
            <input
              id="slug"
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              required
              onInvalid={(e) => {
                e.currentTarget.setCustomValidity('Please fill in this field.')
              }}
              onInput={(e) => {
                e.currentTarget.setCustomValidity('')
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#93D419] focus:border-transparent"
              placeholder="news-slug"
            />
            <p className="mt-1 text-xs text-gray-500">
              URL-friendly version of the title (auto-generated from title)
            </p>
          </div>

          <div>
            <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              id="categoryId"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#93D419] focus:border-transparent"
            >
              <option value="">No category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-2">
              Excerpt
            </label>
            <textarea
              id="excerpt"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#93D419] focus:border-transparent resize-none"
              placeholder="Short description (optional)"
            />
          </div>

          <div>
            <ImageUpload
              value={imageUrl}
              onChange={setImageUrl}
              label="Image"
            />
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
              Content *
            </label>
            <RichTextEditor
              value={content}
              onChange={setContent}
              placeholder="Enter the content..."
            />
          </div>

          <div className="flex items-center">
            <input
              id="published"
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              className="h-4 w-4 text-[#93D419] focus:ring-[#93D419] border-gray-300 rounded"
            />
            <label htmlFor="published" className="ml-2 block text-sm text-gray-700">
              Publish immediately
            </label>
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#93D419] hover:bg-[#7fb315] text-white font-medium px-8 py-3 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
            >
              {isSubmitting ? 'Updating...' : 'Update News'}
            </button>
            <button
              type="button"
              onClick={handlePreview}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
            >
              Preview
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white font-medium px-6 py-3 rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
            >
              Delete
            </button>
            <Link
              href="/admin/haberler"
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium px-6 py-3 rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
            >
              Cancel
            </Link>
          </div>
        </div>
      </form>
      </div>
    </div>
  )
}

