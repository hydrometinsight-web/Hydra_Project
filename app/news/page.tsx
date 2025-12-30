'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
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

interface Tag {
  id: string
  name: string
  slug: string
}

interface NewsTag {
  tag: Tag
}

interface NewsItem {
  id: string
  title: string
  slug: string
  excerpt: string | null
  imageUrl: string | null
  createdAt: string
  category: Category | null
  tags?: NewsTag[]
}

interface Pagination {
  page: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

export default function NewsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [news, setNews] = useState<NewsItem[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [pagination, setPagination] = useState<Pagination | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('date-desc')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  useEffect(() => {
    // Set page metadata
    document.title = 'News | HydroMetInsight'
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Browse the latest news articles in hydrometallurgy, critical metals, and battery recycling.')
    }

    // Get page from URL
    const page = parseInt(searchParams.get('page') || '1', 10)
    setCurrentPage(page)
  }, [searchParams])

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
  }, [])

  useEffect(() => {
    // Initialize filters from URL params
    const urlSearch = searchParams.get('search') || ''
    const urlSort = searchParams.get('sortBy') || 'date-desc'
    const urlDateFrom = searchParams.get('dateFrom') || ''
    const urlDateTo = searchParams.get('dateTo') || ''
    
    setSearchQuery(urlSearch)
    setSortBy(urlSort)
    setDateFrom(urlDateFrom)
    setDateTo(urlDateTo)
  }, [searchParams])

  useEffect(() => {
    setLoading(true)
    // Fetch news with pagination and filters
    const params = new URLSearchParams()
    params.set('page', currentPage.toString())
    if (selectedCategory !== 'all') {
      params.set('categoryId', selectedCategory)
    }
    if (searchQuery) {
      params.set('search', searchQuery)
    }
    if (sortBy) {
      params.set('sortBy', sortBy)
    }
    if (dateFrom) {
      params.set('dateFrom', dateFrom)
    }
    if (dateTo) {
      params.set('dateTo', dateTo)
    }

    fetch(`/api/news?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        if (data && !data.error) {
          setNews(data.news || [])
          setPagination(data.pagination || null)
        }
      })
      .catch((error) => {
        console.error('Error fetching news:', error)
      })
      .finally(() => setLoading(false))
  }, [currentPage, selectedCategory, searchQuery, sortBy, dateFrom, dateTo])

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId)
    setCurrentPage(1)
    updateURL({ categoryId, page: 1 })
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    updateURL({ page })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1)
    updateURL({ search: searchQuery, page: 1 })
  }

  const handleFilterChange = (key: string, value: string) => {
    setCurrentPage(1)
    if (key === 'sortBy') setSortBy(value)
    if (key === 'dateFrom') setDateFrom(value)
    if (key === 'dateTo') setDateTo(value)
    updateURL({ [key]: value, page: 1 })
  }

  const clearFilters = () => {
    setSearchQuery('')
    setSortBy('date-desc')
    setDateFrom('')
    setDateTo('')
    setSelectedCategory('all')
    setCurrentPage(1)
    router.push('/news?page=1')
  }

  const updateURL = (updates: Record<string, string | number>) => {
    const params = new URLSearchParams()
    params.set('page', (updates.page || currentPage).toString())
    
    const category = updates.categoryId !== undefined ? updates.categoryId : selectedCategory
    if (category !== 'all') {
      params.set('categoryId', category)
    }
    
    const search = updates.search !== undefined ? updates.search : searchQuery
    if (search) {
      params.set('search', search)
    }
    
    const sort = updates.sortBy !== undefined ? updates.sortBy : sortBy
    if (sort && sort !== 'date-desc') {
      params.set('sortBy', sort)
    }
    
    const from = updates.dateFrom !== undefined ? updates.dateFrom : dateFrom
    if (from) {
      params.set('dateFrom', from)
    }
    
    const to = updates.dateTo !== undefined ? updates.dateTo : dateTo
    if (to) {
      params.set('dateTo', to)
    }
    
    router.push(`/news?${params.toString()}`)
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-8 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">News</h1>

      {/* AdSense Ad */}
      <div className="mb-8">
        <AdSense adSlot="1234567890" className="w-full" />
      </div>

      {/* Advanced Filters with Categories */}
      <div className="mb-6 bg-white rounded-lg shadow-md border border-gray-200 p-4">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between mb-4">
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex-1 w-full lg:max-w-md">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search news articles..."
                className="w-full px-4 py-2.5 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#93D419] focus:border-[#93D419] text-sm"
              />
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('')
                    updateURL({ search: '', page: 1 })
                  }}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </form>

          {/* Filter Controls */}
          <div className="flex items-center gap-3 w-full lg:w-auto">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors text-sm font-medium"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Filters
              {(sortBy !== 'date-desc' || dateFrom || dateTo || selectedCategory !== 'all') && (
                <span className="bg-[#93D419] text-white text-xs px-2 py-0.5 rounded-full">
                  {(sortBy !== 'date-desc' ? 1 : 0) + (dateFrom ? 1 : 0) + (dateTo ? 1 : 0) + (selectedCategory !== 'all' ? 1 : 0)}
                </span>
              )}
            </button>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-white text-[#93D419] shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                aria-label="Grid view"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded transition-colors ${
                  viewMode === 'list'
                    ? 'bg-white text-[#93D419] shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                aria-label="List view"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Advanced Filter Panel */}
        {showFilters && (
          <div className="border-t border-gray-200 pt-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Category Filter - Dropdown */}
              {categories.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#93D419] focus:border-[#93D419] text-sm bg-white"
                  >
                    <option value="all">All Categories</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Sort By */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#93D419] focus:border-[#93D419] text-sm"
                >
                  <option value="date-desc">Newest First</option>
                  <option value="date-asc">Oldest First</option>
                  <option value="title-asc">Title (A-Z)</option>
                  <option value="title-desc">Title (Z-A)</option>
                </select>
              </div>

              {/* Date From */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">From Date</label>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#93D419] focus:border-[#93D419] text-sm"
                />
              </div>

              {/* Date To */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">To Date</label>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                  min={dateFrom}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#93D419] focus:border-[#93D419] text-sm"
                />
              </div>
            </div>

            {/* Clear Filters Button */}
            {(sortBy !== 'date-desc' || dateFrom || dateTo || searchQuery || selectedCategory !== 'all') && (
              <div className="mt-4 flex justify-end">
                <button
                  onClick={clearFilters}
                  className="text-sm text-gray-600 hover:text-[#93D419] transition-colors font-medium"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#93D419] mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      ) : news.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8">
          <p className="text-gray-600 text-lg">
            {selectedCategory === 'all'
              ? 'No news articles available at the moment. Check back soon!'
              : 'No news articles found in this category.'}
          </p>
        </div>
      ) : (
        <>
          {/* Results Count */}
          {pagination && (
            <div className="mb-4 text-sm text-gray-600">
              Showing {((currentPage - 1) * pagination.itemsPerPage) + 1} - {Math.min(currentPage * pagination.itemsPerPage, pagination.totalItems)} of {pagination.totalItems} results
            </div>
          )}

          {/* Grid View */}
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {news.map((item) => (
                <Link key={item.id} href={`/haber/${item.slug}`} className="h-full">
                  <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-200 h-full flex flex-col">
                    {item.imageUrl ? (
                      <div className="relative w-full h-48 flex-shrink-0">
                        <Image
                          src={item.imageUrl}
                          alt={item.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="relative w-full h-48 flex-shrink-0">
                        <ImagePlaceholder />
                      </div>
                    )}
                    <div className="p-6 flex flex-col flex-grow">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                        {item.title}
                      </h3>
                      {item.excerpt && (
                        <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-grow">
                          {item.excerpt}
                        </p>
                      )}
                      {item.tags && item.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {item.tags.slice(0, 3).map((newsTag) => (
                            <Link
                              key={newsTag.tag.id}
                              href={`/tag/${newsTag.tag.slug}`}
                              onClick={(e) => e.stopPropagation()}
                              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-full text-xs font-medium transition-colors inline-block min-w-[80px] text-center"
                            >
                              #{newsTag.tag.name}
                            </Link>
                          ))}
                          {item.tags.length > 3 && (
                            <span className="text-gray-500 text-xs px-2 py-1">
                              +{item.tags.length - 3}
                            </span>
                          )}
                        </div>
                      )}
                      <div className="flex items-center justify-between text-xs text-gray-500 mt-auto">
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
          ) : (
            /* List View */
            <div className="space-y-4">
              {news.map((item) => (
                <Link key={item.id} href={`/haber/${item.slug}`}>
                  <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-200 min-h-[200px]">
                    <div className="flex flex-col md:flex-row h-full">
                      <div className="md:w-64 flex-shrink-0">
                        {item.imageUrl ? (
                          <div className="relative w-full h-48 md:h-full min-h-[200px]">
                            <Image
                              src={item.imageUrl}
                              alt={item.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="relative w-full h-48 md:h-full min-h-[200px]">
                            <ImagePlaceholder />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 p-6 flex flex-col">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          {item.title}
                        </h3>
                        {item.excerpt && (
                          <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow">
                            {item.excerpt}
                          </p>
                        )}
                        {item.tags && item.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-3">
                            {item.tags.slice(0, 3).map((newsTag) => (
                              <Link
                                key={newsTag.tag.id}
                                href={`/tag/${newsTag.tag.slug}`}
                                onClick={(e) => e.stopPropagation()}
                                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-full text-xs font-medium transition-colors inline-block min-w-[80px] text-center"
                              >
                                #{newsTag.tag.name}
                              </Link>
                            ))}
                            {item.tags.length > 3 && (
                              <span className="text-gray-500 text-xs px-2 py-1">
                                +{item.tags.length - 3}
                              </span>
                            )}
                          </div>
                        )}
                        <div className="flex items-center justify-between text-xs text-gray-500 mt-auto">
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
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="mt-8 flex justify-center items-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={!pagination.hasPrevPage}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  pagination.hasPrevPage
                    ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                Previous
              </button>

              <div className="flex gap-1">
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                  .filter((page) => {
                    // Show first page, last page, current page, and pages around current
                    return (
                      page === 1 ||
                      page === pagination.totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    )
                  })
                  .map((page, index, array) => {
                    // Add ellipsis if there's a gap
                    const showEllipsisBefore = index > 0 && page - array[index - 1] > 1
                    return (
                      <div key={page} className="flex items-center gap-1">
                        {showEllipsisBefore && (
                          <span className="px-2 text-gray-500">...</span>
                        )}
                        <button
                          onClick={() => handlePageChange(page)}
                          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                            page === currentPage
                              ? 'bg-[#93D419] text-white'
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }`}
                        >
                          {page}
                        </button>
                      </div>
                    )
                  })}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={!pagination.hasNextPage}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  pagination.hasNextPage
                    ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

