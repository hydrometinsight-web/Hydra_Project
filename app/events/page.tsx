'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { enUS } from 'date-fns/locale'
import Image from 'next/image'
import Link from 'next/link'
import AdSense from '@/components/AdSense'
import ImagePlaceholder from '@/components/ImagePlaceholder'

interface EventItem {
  id: string
  title: string
  slug: string
  description: string
  location: string
  startDate: string
  endDate: string | null
  imageUrl: string | null
}

interface Pagination {
  page: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

export default function EventsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [events, setEvents] = useState<EventItem[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [pagination, setPagination] = useState<Pagination | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('startDate-desc')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [location, setLocation] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  useEffect(() => {
    // Set page metadata
    document.title = 'Events | HydroMetInsight'
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Browse upcoming and past events in hydrometallurgy, critical metals, and battery recycling.')
    }

    // Get page from URL
    const page = parseInt(searchParams.get('page') || '1', 10)
    setCurrentPage(page)
  }, [searchParams])

  useEffect(() => {
    // Initialize filters from URL params
    const urlSearch = searchParams.get('search') || ''
    const urlSort = searchParams.get('sortBy') || 'startDate-desc'
    const urlDateFrom = searchParams.get('dateFrom') || ''
    const urlDateTo = searchParams.get('dateTo') || ''
    const urlLocation = searchParams.get('location') || ''
    
    setSearchQuery(urlSearch)
    setSortBy(urlSort)
    setDateFrom(urlDateFrom)
    setDateTo(urlDateTo)
    setLocation(urlLocation)
  }, [searchParams])

  useEffect(() => {
    setLoading(true)
    // Fetch events with pagination and filters
    const params = new URLSearchParams()
    params.set('page', currentPage.toString())
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
    if (location) {
      params.set('location', location)
    }

    fetch(`/api/events?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        if (data && !data.error) {
          setEvents(data.events || [])
          setPagination(data.pagination || null)
        }
      })
      .catch((error) => {
        console.error('Error fetching events:', error)
      })
      .finally(() => setLoading(false))
  }, [currentPage, searchQuery, sortBy, dateFrom, dateTo, location])

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
    if (key === 'location') setLocation(value)
    updateURL({ [key]: value, page: 1 })
  }

  const clearFilters = () => {
    setSearchQuery('')
    setSortBy('startDate-desc')
    setDateFrom('')
    setDateTo('')
    setLocation('')
    setCurrentPage(1)
    router.push('/events?page=1')
  }

  const updateURL = (updates: Record<string, string | number>) => {
    const params = new URLSearchParams()
    params.set('page', (updates.page || currentPage).toString())
    
    const search = updates.search !== undefined ? updates.search : searchQuery
    if (search) {
      params.set('search', search)
    }
    
    const sort = updates.sortBy !== undefined ? updates.sortBy : sortBy
    if (sort && sort !== 'startDate-desc') {
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

    const loc = updates.location !== undefined ? updates.location : location
    if (loc) {
      params.set('location', loc)
    }
    
    router.push(`/events?${params.toString()}`)
  }

  const formatEventDate = (startDate: string, endDate: string | null) => {
    const start = new Date(startDate)
    const end = endDate ? new Date(endDate) : null
    
    if (end && start.toDateString() !== end.toDateString()) {
      return `${format(start, 'MMM d', { locale: enUS })} - ${format(end, 'MMM d, yyyy', { locale: enUS })}`
    }
    return format(start, 'MMMM d, yyyy', { locale: enUS })
  }

  const stripHtml = (html: string) => {
    if (!html) return ''
    return html
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/&nbsp;/g, ' ') // Replace &nbsp; with space
      .replace(/&amp;/g, '&') // Replace &amp; with &
      .replace(/&lt;/g, '<') // Replace &lt; with <
      .replace(/&gt;/g, '>') // Replace &gt; with >
      .replace(/&quot;/g, '"') // Replace &quot; with "
      .replace(/&#39;/g, "'") // Replace &#39; with '
      .trim()
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-8 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Events</h1>

      {/* AdSense Ad */}
      <div className="mb-8">
        <AdSense adSlot="1234567890" className="w-full" />
      </div>

      {/* Advanced Filters */}
      <div className="mb-6 bg-white rounded-lg shadow-md border border-gray-200 p-4">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between mb-4">
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex-1 w-full lg:max-w-md">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search events..."
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
              {(sortBy !== 'startDate-desc' || dateFrom || dateTo || location) && (
                <span className="bg-[#93D419] text-white text-xs px-2 py-0.5 rounded-full">
                  {(sortBy !== 'startDate-desc' ? 1 : 0) + (dateFrom ? 1 : 0) + (dateTo ? 1 : 0) + (location ? 1 : 0)}
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
              {/* Sort By */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#93D419] focus:border-[#93D419] text-sm"
                >
                  <option value="startDate-desc">Newest First</option>
                  <option value="startDate-asc">Oldest First</option>
                  <option value="title-asc">Title (A-Z)</option>
                  <option value="title-desc">Title (Z-A)</option>
                </select>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => handleFilterChange('location', e.target.value)}
                  placeholder="Filter by location..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#93D419] focus:border-[#93D419] text-sm"
                />
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
            {(sortBy !== 'startDate-desc' || dateFrom || dateTo || searchQuery || location) && (
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
      ) : events.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8">
          <p className="text-gray-600 text-lg">
            No events available at the moment. Check back soon!
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
              {events.map((event) => (
                <Link 
                  key={event.id} 
                  href={`/event/${event.slug}`} 
                  className="h-full block"
                >
                  <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-200 h-full flex flex-col">
                    {event.imageUrl ? (
                      <div className="relative w-full h-48 flex-shrink-0">
                        <Image
                          src={event.imageUrl}
                          alt={event.title}
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
                        {event.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-grow">
                        {stripHtml(event.description)}
                      </p>
                      <div className="flex flex-col gap-2 text-xs text-gray-500 mt-auto">
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span>{formatEventDate(event.startDate, event.endDate)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span>{event.location}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            /* List View */
            <div className="space-y-4">
              {events.map((event) => (
                <Link 
                  key={event.id} 
                  href={`/event/${event.slug}`}
                  className="block"
                >
                  <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-200 min-h-[200px]">
                    <div className="flex flex-col md:flex-row h-full">
                      <div className="md:w-64 flex-shrink-0">
                        {event.imageUrl ? (
                          <div className="relative w-full h-48 md:h-full min-h-[200px]">
                            <Image
                              src={event.imageUrl}
                              alt={event.title}
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
                          {event.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow">
                          {stripHtml(event.description)}
                        </p>
                        <div className="flex flex-col gap-2 text-xs text-gray-500 mt-auto">
                          <div className="flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span>{formatEventDate(event.startDate, event.endDate)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span>{event.location}</span>
                          </div>
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
                    return (
                      page === 1 ||
                      page === pagination.totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    )
                  })
                  .map((page, index, array) => {
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

