'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { format } from 'date-fns'
import { enUS } from 'date-fns/locale'
import ImagePlaceholder from '@/components/ImagePlaceholder'

interface PreviewData {
  title: string
  slug: string
  content: string
  excerpt: string | null
  imageUrl: string | null
  category: {
    name: string
  } | null
  createdAt: string
  author: {
    name: string
  }
}

export default function NewNewsPreviewPage() {
  const router = useRouter()
  const [previewData, setPreviewData] = useState<PreviewData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    if (!token) {
      router.push('/admin')
      return
    }

    // Get preview data from localStorage
    const storedPreview = localStorage.getItem('news-preview-new')
    if (storedPreview) {
      try {
        setPreviewData(JSON.parse(storedPreview))
        setLoading(false)
      } catch (e) {
        console.error('Error parsing preview data:', e)
        router.push('/admin/haberler/yeni')
      }
    } else {
      router.push('/admin/haberler/yeni')
    }
  }, [router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#93D419] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading preview...</p>
        </div>
      </div>
    )
  }

  if (!previewData) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-600">No preview data available</p>
          <Link
            href="/admin/haberler/yeni"
            className="text-[#93D419] hover:text-[#7fb315] mt-4 inline-block"
          >
            Back to Create
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Preview Header */}
      <div className="bg-yellow-100 border-b border-yellow-300 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
              PREVIEW MODE
            </span>
            <span className="text-sm text-gray-700">
              This is how your news article will appear to visitors
            </span>
          </div>
          <Link
            href="/admin/haberler/yeni"
            className="bg-[#93D419] hover:bg-[#7fb315] text-white px-4 py-2 rounded-lg transition-colors font-medium text-sm"
          >
            Back to Edit
          </Link>
        </div>
      </div>

      {/* Preview Content */}
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-8 max-w-7xl mx-auto">
        <article className="bg-white rounded-xl shadow-md overflow-hidden">
          {previewData.imageUrl ? (
            <div className="relative w-full h-96">
              <Image
                src={previewData.imageUrl}
                alt={previewData.title}
                fill
                className="object-cover"
                unoptimized={previewData.imageUrl.startsWith('/uploads/')}
              />
            </div>
          ) : (
            <div className="relative w-full h-96">
              <ImagePlaceholder />
            </div>
          )}

          <div className="p-6 md:p-8">
            <div className="flex items-center gap-4 mb-4">
              {previewData.category && (
                <span className="bg-[#93D419] text-white px-3 py-1 rounded-full text-sm font-medium">
                  {previewData.category.name}
                </span>
              )}
              <span className="text-gray-500 text-sm">
                {format(new Date(previewData.createdAt), 'MMMM d, yyyy', { locale: enUS })}
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {previewData.title}
            </h1>

            {previewData.excerpt && (
              <p className="text-xl text-gray-600 mb-6 italic">
                {previewData.excerpt}
              </p>
            )}

            <div className="prose prose-lg max-w-none mb-8" style={{ textAlign: 'inherit' }}>
              <div dangerouslySetInnerHTML={{ __html: previewData.content }} />
            </div>

            <div className="border-t border-gray-200 pt-4 mt-8">
              <p className="text-sm text-gray-500">
                By <span>{previewData.author.name}</span> • 
                <time dateTime={previewData.createdAt}>
                  {format(new Date(previewData.createdAt), 'MMMM d, yyyy', { locale: enUS })}
                </time>
              </p>
            </div>
          </div>
        </article>
      </div>
    </div>
  )
}

