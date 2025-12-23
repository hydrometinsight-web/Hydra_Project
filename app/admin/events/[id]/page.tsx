'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import RichTextEditor from '@/components/RichTextEditor'
import ImageUpload from '@/components/ImageUpload'

interface Event {
  id: string
  title: string
  slug: string
  description: string
  location: string
  startDate: string
  endDate: string | null
  imageUrl: string | null
  published: boolean
}

export default function EditEventPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [event, setEvent] = useState<Event | null>(null)
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [description, setDescription] = useState('')
  const [location, setLocation] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [published, setPublished] = useState(false)
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    if (!token) {
      router.push('/admin')
      return
    }

    fetch(`/api/admin/events/${id}`, {
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
          setEvent(data)
          setTitle(data.title)
          setSlug(data.slug)
          setDescription(data.description)
          setLocation(data.location)
          // Format dates for datetime-local input
          const start = new Date(data.startDate)
          const end = data.endDate ? new Date(data.endDate) : null
          setStartDate(start.toISOString().slice(0, 16))
          setEndDate(end ? end.toISOString().slice(0, 16) : '')
          setImageUrl(data.imageUrl || '')
          setPublished(data.published)
        }
      })
      .catch((error) => {
        console.error('Error fetching event:', error)
        setError('Failed to load event')
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
    if (!slug || slug === generateSlug(event?.title || '')) {
      setSlug(generateSlug(value))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Check if description is empty (only HTML tags)
    const descriptionText = description.replace(/<[^>]*>/g, '').trim()
    if (!descriptionText) {
      setError('Description is required')
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
      const response = await fetch(`/api/admin/events/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          slug,
          description,
          location,
          startDate,
          endDate: endDate || null,
          imageUrl: imageUrl || null,
          published,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        router.push('/admin/events')
      } else {
        setError(data.error || 'Failed to update event')
      }
    } catch (error) {
      console.error('Error updating event:', error)
      setError('An error occurred. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      return
    }

    const token = localStorage.getItem('adminToken')
    if (!token) {
      router.push('/admin')
      return
    }

    try {
      const response = await fetch(`/api/admin/events/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        router.push('/admin/events')
      } else {
        const data = await response.json()
        setError(data.error || 'Failed to delete event')
      }
    } catch (error) {
      console.error('Error deleting event:', error)
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

  if (!event) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-600">Event not found</p>
          <Link
            href="/admin/events"
            className="text-[#93D419] hover:text-[#7fb315] mt-4 inline-block"
          >
            Back to Events
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
            href="/admin/events"
            className="text-gray-600 hover:text-[#93D419] mb-4 inline-block text-sm transition-colors font-medium"
          >
            ← Back to Events
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Edit Event</h1>
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
              placeholder="Event title"
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
              placeholder="event-slug"
            />
            <p className="mt-1 text-xs text-gray-500">
              URL-friendly version of the title (auto-generated from title)
            </p>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <RichTextEditor
              value={description}
              onChange={setDescription}
              placeholder="Enter event description..."
            />
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
              Location *
            </label>
            <input
              id="location"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
              onInvalid={(e) => {
                e.currentTarget.setCustomValidity('Please fill in this field.')
              }}
              onInput={(e) => {
                e.currentTarget.setCustomValidity('')
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#93D419] focus:border-transparent"
              placeholder="Event location"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
                Start Date *
              </label>
              <input
                id="startDate"
                type="datetime-local"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
                onInvalid={(e) => {
                  e.currentTarget.setCustomValidity('Please fill in this field.')
                }}
                onInput={(e) => {
                  e.currentTarget.setCustomValidity('')
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#93D419] focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">
                End Date
              </label>
              <input
                id="endDate"
                type="datetime-local"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#93D419] focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <ImageUpload
              value={imageUrl}
              onChange={setImageUrl}
              label="Image"
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
              {isSubmitting ? 'Updating...' : 'Update Event'}
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white font-medium px-6 py-3 rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
            >
              Delete
            </button>
            <Link
              href="/admin/events"
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

