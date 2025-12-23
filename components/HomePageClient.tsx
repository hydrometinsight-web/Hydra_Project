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
  techInsights: any[]
  events: any[]
  sponsors: any[]
}

export default function HomePageClient({
  latestNews,
  allNews,
  techInsights,
  events,
  sponsors,
}: HomePageClientProps) {
  // Filter out latest news from all news
  const latestNewsIds = new Set(latestNews.map((news) => news.id))
  const filteredAllNews = allNews.filter((news) => !latestNewsIds.has(news.id))

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-6 max-w-7xl mx-auto">
      {/* Latest News Section */}
      <section className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">Latest News</h2>
          <div className="flex-1 border-b border-gray-300"></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:items-stretch">
          {/* Featured News - Large */}
          {latestNews.length > 0 && (
            <Link href={`/haber/${latestNews[0].slug}`} className="lg:col-span-2 flex">
              <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer w-full relative border border-gray-200 flex flex-col">
                {latestNews[0].imageUrl ? (
                  <div className="relative w-full flex-1 min-h-[400px] lg:min-h-0 overflow-hidden">
                    <Image
                      src={latestNews[0].imageUrl}
                      alt={latestNews[0].title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 800px"
                    />
                    {/* Strong Dark Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/90 via-black/60 to-transparent" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.75) 30%, rgba(0,0,0,0.4) 60%, transparent 100%)' }}></div>
                    {/* Content Overlay - Bottom Left Aligned */}
                    <div className="absolute inset-0 flex flex-col justify-end p-6 lg:p-8">
                      <div className="w-full pr-4">
                        <h3 className="text-2xl lg:text-4xl font-bold text-white mb-4 line-clamp-3 leading-tight" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.8), 0 4px 16px rgba(0,0,0,0.6)' }}>
                          {latestNews[0].title}
                        </h3>
                        {latestNews[0].excerpt && (
                          <p className="text-white text-base lg:text-lg mb-4 line-clamp-2 leading-relaxed" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.8)' }}>
                            {latestNews[0].excerpt}
                          </p>
                        )}
                        <button className="self-start inline-flex items-center gap-2 bg-gray-800 hover:bg-gray-900 text-white font-medium px-4 py-2 rounded-lg transition-colors duration-200 text-sm">
                          <Image src="/logo1.png" alt="Logo" width={16} height={16} className="w-4 h-4 object-contain" />
                          Read More →
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="relative w-full flex-1 min-h-[400px] lg:min-h-0">
                    <ImagePlaceholder />
                    <div className="absolute inset-0 flex flex-col justify-end p-6 lg:p-8">
                      <h3 className="text-2xl lg:text-4xl font-bold text-gray-900 mb-4 line-clamp-3 leading-tight">
                        {latestNews[0].title}
                      </h3>
                      {latestNews[0].excerpt && (
                        <p className="text-gray-700 text-lg lg:text-xl mb-4 line-clamp-3 leading-relaxed">
                          {latestNews[0].excerpt}
                        </p>
                      )}
                      <button className="self-start inline-flex items-center gap-2 bg-gray-800 hover:bg-gray-900 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl text-base lg:text-lg">
                        <Image src="/logo1.png" alt="Logo" width={20} height={20} className="w-5 h-5 object-contain" />
                        Read More →
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </Link>
          )}

          {/* Side News - Small */}
          <div className="flex flex-col gap-4 h-full">
            {latestNews.slice(1, 4).map((news) => (
              <Link key={news.id} href={`/haber/${news.slug}`} className="flex-1 flex">
                <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer relative border border-gray-200 w-full flex flex-col">
                  {news.imageUrl ? (
                    <div className="relative w-full flex-1 min-h-[120px] overflow-hidden">
                      <Image
                        src={news.imageUrl}
                        alt={news.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 400px"
                      />
                      {/* Strong Dark Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.75) 40%, rgba(0,0,0,0.3) 70%, transparent 100%)' }}></div>
                      {/* Semi-transparent Dark Text Container */}
                      <div className="absolute inset-0 flex flex-col justify-end">
                        <div className="bg-black/60 backdrop-blur-sm p-4">
                          <h3 className="text-base lg:text-lg font-bold text-white mb-0 line-clamp-2 leading-tight" style={{ textShadow: '0 2px 6px rgba(0,0,0,0.9), 0 1px 3px rgba(0,0,0,0.7)' }}>
                            {news.title}
                          </h3>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="relative w-full flex-1 min-h-[120px]">
                      <ImagePlaceholder />
                      <div className="absolute inset-0 flex flex-col justify-end p-4">
                        <h3 className="text-base lg:text-lg font-bold text-gray-900 mb-0 line-clamp-3 leading-tight">
                          {news.title}
                        </h3>
                      </div>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* AdSense Ad - Between Latest News and TechInsight */}
      <div className="my-6">
        <AdSense adSlot="1234567890" className="w-full" />
      </div>

      {/* TechInsight Section */}
      <section className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">TechInsight</h2>
          <div className="flex-1 border-b border-gray-300"></div>
          <Link href="/techinsight" className="text-gray-600 hover:text-[#93D419] font-medium text-sm transition-colors">
            View All →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {techInsights.map((insight) => (
            <Link key={insight.id} href={`/techinsight/${insight.slug}`}>
              <article className="bg-white rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer border border-gray-200 group">
                {insight.imageUrl ? (
                  <div className="relative w-full aspect-[16/10] overflow-hidden bg-gray-100">
                    <Image
                      src={insight.imageUrl}
                      alt={insight.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 400px"
                    />
                  </div>
                ) : (
                  <div className="relative w-full aspect-[16/10] overflow-hidden bg-gray-100">
                    <ImagePlaceholder />
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 leading-snug group-hover:text-[#93D419] transition-colors duration-200">
                    {insight.title}
                  </h3>
                  {insight.excerpt && (
                    <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                      {insight.excerpt}
                    </p>
                  )}
                  <div className="flex items-center text-sm text-gray-500 font-medium">
                    <span>Read Article</span>
                    <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </section>

      {/* AdSense Ad - Between TechInsight and All News */}
      <div className="my-6">
        <AdSense adSlot="1234567890" className="w-full" />
      </div>

      {/* All News Section */}
      <section className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">All News</h2>
          <div className="flex-1 border-b border-gray-300"></div>
          <Link href="/news" className="text-gray-600 hover:text-[#93D419] font-medium text-sm transition-colors">
            View All →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAllNews.slice(0, 6).map((news) => (
            <Link key={news.id} href={`/haber/${news.slug}`}>
              <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-200">
                {news.imageUrl ? (
                  <div className="relative w-full h-48 overflow-hidden">
                    <Image
                      src={news.imageUrl}
                      alt={news.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
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
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {news.excerpt}
                    </p>
                  )}
                  <button className="inline-flex items-center gap-2 bg-gray-800 hover:bg-gray-900 text-white font-semibold px-4 py-2 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg text-sm">
                    <Image src="/logo1.png" alt="Logo" width={16} height={16} className="w-4 h-4 object-contain" />
                    Read More →
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* AdSense Ad - Between All News and Events */}
      <div className="my-6">
        <AdSense adSlot="1234567890" className="w-full" />
      </div>

      {/* Events Section */}
      <section className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">Events</h2>
          <div className="flex-1 border-b border-gray-300"></div>
          <Link href="/event" className="text-gray-600 hover:text-[#93D419] font-medium text-sm transition-colors">
            View All →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {events.map((event) => (
            <Link key={event.id} href={`/event/${event.slug}`}>
              <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col h-full border border-gray-200">
                {event.imageUrl ? (
                  <div className="relative w-full h-48 flex-shrink-0 overflow-hidden">
                    <Image
                      src={event.imageUrl}
                      alt={event.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 400px"
                    />
                  </div>
                ) : (
                  <div className="relative w-full h-48 flex-shrink-0">
                    <ImagePlaceholder />
                  </div>
                )}
                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    {event.title}
                  </h3>
                  {event.description && (
                    <p className="text-gray-600 text-sm mb-2 line-clamp-2 flex-grow">
                      {event.description}
                    </p>
                  )}
                  <div className="text-xs text-gray-500 mt-auto">
                    {format(new Date(event.startDate), 'MMM d, yyyy', { locale: enUS })} - {event.location}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* AdSense Ad - Between Events and Sponsors */}
      <div className="my-6">
        <AdSense adSlot="1234567890" className="w-full" />
      </div>

      {/* Sponsors Section */}
      {sponsors.length > 0 && (
        <section className="mb-6">
          <div className="flex items-center gap-4 mb-6">
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">Our Sponsors</h2>
            <div className="flex-1 border-b border-gray-300"></div>
            <Link href="/sponsor" className="text-gray-600 hover:text-[#93D419] font-medium text-sm transition-colors">
              View All →
            </Link>
          </div>
          <div className="bg-white rounded-xl shadow-md p-8">
            <p className="text-gray-600 text-center mb-6">
              Thank you to our sponsors for supporting HydroMetInsight. We are grateful for their partnership.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 items-center justify-items-center mb-8">
              {sponsors.map((sponsor) => (
                <a
                  key={sponsor.id}
                  href={sponsor.website || '#'}
                  target={sponsor.website ? '_blank' : undefined}
                  rel={sponsor.website ? 'noopener noreferrer' : undefined}
                  className="w-full h-32 bg-white rounded-lg flex items-center justify-center hover:shadow-lg transition-all duration-200 border border-gray-200 p-4 group"
                >
                  {sponsor.logoUrl ? (
                    <div className="relative w-full h-full">
                      <Image
                        src={sponsor.logoUrl}
                        alt={sponsor.name}
                        fill
                        className="object-contain group-hover:scale-105 transition-transform duration-200"
                        unoptimized={sponsor.logoUrl.startsWith('/uploads/')}
                      />
                    </div>
                  ) : (
                    <div className="text-center">
                      <span className="text-gray-600 text-sm font-semibold group-hover:text-[#93D419] transition-colors">
                        {sponsor.name}
                      </span>
                    </div>
                  )}
                </a>
              ))}
            </div>
            <div className="text-center">
              <Link
                href="/sponsor/become"
                className="inline-flex items-center gap-2 bg-[#93D419] hover:bg-[#7fb315] text-white font-medium px-8 py-3 rounded-lg transition-colors duration-200 text-sm"
              >
                <Image src="/logo1.png" alt="Logo" width={16} height={16} className="w-4 h-4 object-contain" />
                Become a Sponsor
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

