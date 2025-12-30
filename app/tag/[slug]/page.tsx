import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { format } from 'date-fns'
import { enUS } from 'date-fns/locale'
import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import AdSense from '@/components/AdSense'
import ImagePlaceholder from '@/components/ImagePlaceholder'

async function getTag(slug: string) {
  const tag = await prisma.tag.findUnique({
    where: { slug },
  })

  if (!tag) return null

  // Fetch published news with this tag
  const newsWithTag = await prisma.news.findMany({
    where: {
      published: true,
      tags: {
        some: {
          tagId: tag.id,
        },
      },
    },
    include: {
      category: true,
      author: true,
    },
    orderBy: { createdAt: 'desc' },
  })

  // Fetch published tech insights with this tag
  const techInsightsWithTag = await prisma.techInsight.findMany({
    where: {
      published: true,
      tags: {
        some: {
          tagId: tag.id,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  return {
    ...tag,
    news: newsWithTag,
    techInsights: techInsightsWithTag,
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const tag = await getTag(params.slug)

  if (!tag) {
    return {
      title: 'Tag Not Found',
    }
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const url = `${baseUrl}/tag/${tag.slug}`

  return {
    title: `#${tag.name} - Tag`,
    description: tag.description || `Browse all content tagged with ${tag.name}`,
    keywords: [tag.name, 'hydrometallurgy', 'critical metals', 'mining technology'],
    openGraph: {
      type: 'website',
      url,
      title: `#${tag.name} - Tag`,
      description: tag.description || `Browse all content tagged with ${tag.name}`,
    },
    twitter: {
      card: 'summary',
      title: `#${tag.name} - Tag`,
      description: tag.description || `Browse all content tagged with ${tag.name}`,
    },
    alternates: {
      canonical: url,
    },
  }
}

export default async function TagPage({ params }: { params: { slug: string } }) {
  const tag = await getTag(params.slug)

  if (!tag) {
    notFound()
  }

  const totalItems = tag.news.length + tag.techInsights.length

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <Link href="/news" className="text-gray-600 hover:text-[#93D419] mb-4 inline-block text-sm transition-colors">
          ← Back to News
        </Link>
        <div className="bg-white rounded-xl shadow-md p-6">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            #{tag.name}
          </h1>
          {tag.description && (
            <p className="text-gray-600 text-lg mb-4">
              {tag.description}
            </p>
          )}
          <p className="text-gray-500 text-sm">
            {totalItems} {totalItems === 1 ? 'item' : 'items'} tagged with this tag
          </p>
        </div>
      </div>

      {/* AdSense Ad */}
      <div className="mb-8">
        <AdSense adSlot="1234567890" className="w-full" />
      </div>

      {totalItems === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-600 text-lg">
            No content found with this tag. Check back soon!
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* News Section */}
          {tag.news.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">News Articles</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tag.news.map((item) => (
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
            </div>
          )}

          {/* TechInsight Section */}
          {tag.techInsights.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">TechInsights</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tag.techInsights.map((insight) => (
                  <Link key={insight.id} href={`/techinsight/${insight.slug}`}>
                    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-200">
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
                      <div className="p-6">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                          {insight.title}
                        </h3>
                        {insight.excerpt && (
                          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                            {insight.excerpt}
                          </p>
                        )}
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>
                            {format(new Date(insight.createdAt), 'MMMM d, yyyy', { locale: enUS })}
                          </span>
                          <span className="text-[#93D419] font-medium hover:translate-x-1 transition-transform inline-block">
                            Read More →
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

