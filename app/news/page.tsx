'use client'

import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { enUS } from 'date-fns/locale'
import Image from 'next/image'
import Link from 'next/link'
import AdSense from '@/components/AdSense'
import ImagePlaceholder from '@/components/ImagePlaceholder'

interface Category {
  id: string
  name: string
  slug: string
}

interface NewsItem {
  id: string
  title: string
  slug: string
  excerpt: string | null
  imageUrl: string | null
  createdAt: string
  category: Category | null
}

export default function NewsPage() {
  const [news, setNews] = useState<NewsItem[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Set page metadata
    document.title = 'News | HydroMetInsight'
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Browse the latest news articles in hydrometallurgy, critical metals, and battery recycling.')
    }
  }, [])

  useEffect(() => {
    // Fetch categories
    fetch('/api/categories')
      .then((res) => res.json())
      .then((data) => {
        if (data && !data.error) {
          setCategories(data)
        }
      })
      .catch((error) => {
        console.error('Error fetching categories:', error)
      })

    // Fetch news
    fetch('/api/news')
      .then((res) => res.json())
      .then((data) => {
        if (data && !data.error) {
          setNews(data)
        }
      })
      .catch((error) => {
        console.error('Error fetching news:', error)
      })
      .finally(() => setLoading(false))
  }, [])

  const filteredNews =
    selectedCategory === 'all'
      ? news
      : news.filter((item) => item.category?.id === selectedCategory)

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-8 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">News</h1>

      {/* AdSense Ad */}
      <div className="mb-8">
        <AdSense adSlot="1234567890" className="w-full" />
      </div>

      {/* Category Filter Tabs */}
      {categories.length > 0 && (
        <div className="mb-8 bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
          <div className="flex flex-wrap border-b border-gray-200">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-6 py-4 text-sm font-medium transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-[#93D419] text-white border-b-2 border-[#93D419]'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              All
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-4 text-sm font-medium transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-[#93D419] text-white border-b-2 border-[#93D419]'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#93D419] mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      ) : filteredNews.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8">
          <p className="text-gray-600 text-lg">
            {selectedCategory === 'all'
              ? 'No news articles available at the moment. Check back soon!'
              : 'No news articles found in this category.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNews.map((item) => (
            <Link key={item.id} href={`/haber/${item.slug}`}>
              <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-200">
                {item.imageUrl ? (
                  <div className="relative w-full h-48">
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="relative w-full h-48">
                    <ImagePlaceholder />
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                    {item.title}
                  </h3>
                  {item.excerpt && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {item.excerpt}
                    </p>
                  )}
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>
                      {format(new Date(item.createdAt), 'MMMM d, yyyy', { locale: enUS })}
                    </span>
                    {item.category && (
                      <span className="bg-[#93D419] text-white px-2 py-1 rounded">
                        {item.category.name}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

