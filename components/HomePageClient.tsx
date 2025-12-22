'use client'

import Link from 'next/link'
import Image from 'next/image'
import { format } from 'date-fns'
import { enUS } from 'date-fns/locale'
import AdSense from './AdSense'
import ImagePlaceholder from './ImagePlaceholder'

interface HomePageClientProps {
  latestNews: any[]
  allNews: any[]
  events: any[]
  techInsights: any[]
}

export default function HomePageClient({
  latestNews,
  allNews,
  events,
  techInsights,
}: HomePageClientProps) {
  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-6 max-w-7xl mx-auto">
      {/* Latest News Section */}
      <section className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">Latest News</h2>
          <div className="flex-1 border-b border-gray-300"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {latestNews.map((news) => (
            <Link key={news.id} href={`/haber/${news.slug}`}>
              <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer">
                {news.imageUrl ? (
                  <div className="relative w-full h-48">
                    <Image
                      src={news.imageUrl}
                      alt={news.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="relative w-full h-48">
                    <ImagePlaceholder />
                  </div>
                )}
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    {news.title}
                  </h3>
                  {news.excerpt && (
                    <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                      {news.excerpt}
                    </p>
                  )}
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{format(new Date(news.createdAt), 'MMM d, yyyy', { locale: enUS })}</span>
                    {news.category && (
                      <span className="bg-[#93D419] text-white px-2 py-1 rounded">
                        {news.category.name}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* AdSense Ad */}
      <div className="my-8">
        <AdSense adSlot="1234567890" className="w-full" />
      </div>

      {/* TechInsight Section */}
      <section className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">TechInsight</h2>
          <div className="flex-1 border-b border-gray-300"></div>
          <Link href="/techinsight" className="text-[#93D419] hover:text-[#7fb315] font-medium">
            View All →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {techInsights.map((insight) => (
            <Link key={insight.id} href={`/techinsight/${insight.slug}`}>
              <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer">
                {insight.imageUrl ? (
                  <div className="relative w-full h-48">
                    <Image
                      src={insight.imageUrl}
                      alt={insight.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="relative w-full h-48">
                    <ImagePlaceholder />
                  </div>
                )}
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    {insight.title}
                  </h3>
                  {insight.excerpt && (
                    <p className="text-gray-600 text-sm mb-2 line-clamp-3">
                      {insight.excerpt}
                    </p>
                  )}
                  <div className="text-xs text-gray-500">
                    {format(new Date(insight.createdAt), 'MMM d, yyyy', { locale: enUS })}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* AdSense Ad */}
      <div className="my-8">
        <AdSense adSlot="1234567890" className="w-full" />
      </div>

      {/* All News Section */}
      <section className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">All News</h2>
          <div className="flex-1 border-b border-gray-300"></div>
          <Link href="/news" className="text-[#93D419] hover:text-[#7fb315] font-medium">
            View All →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allNews.slice(0, 6).map((news) => (
            <Link key={news.id} href={`/haber/${news.slug}`}>
              <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer">
                {news.imageUrl ? (
                  <div className="relative w-full h-48">
                    <Image
                      src={news.imageUrl}
                      alt={news.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="relative w-full h-48">
                    <ImagePlaceholder />
                  </div>
                )}
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    {news.title}
                  </h3>
                  {news.excerpt && (
                    <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                      {news.excerpt}
                    </p>
                  )}
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{format(new Date(news.createdAt), 'MMM d, yyyy', { locale: enUS })}</span>
                    {news.category && (
                      <span className="bg-[#93D419] text-white px-2 py-1 rounded">
                        {news.category.name}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Events Section */}
      <section className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">Events</h2>
          <div className="flex-1 border-b border-gray-300"></div>
          <Link href="/event" className="text-[#93D419] hover:text-[#7fb315] font-medium">
            View All →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {events.map((event) => (
            <Link key={event.id} href={`/event/${event.slug}`}>
              <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer">
                {event.imageUrl ? (
                  <div className="relative w-full h-48">
                    <Image
                      src={event.imageUrl}
                      alt={event.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="relative w-full h-48">
                    <ImagePlaceholder />
                  </div>
                )}
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    {event.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                    {event.description}
                  </p>
                  <div className="text-xs text-gray-500">
                    {format(new Date(event.startDate), 'MMM d, yyyy', { locale: enUS })} - {event.location}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}

