import { prisma } from '@/lib/prisma'
import { format } from 'date-fns'
import { enUS } from 'date-fns/locale'
import Image from 'next/image'
import Link from 'next/link'
import ImagePlaceholder from './ImagePlaceholder'

interface RelatedContentProps {
  currentNewsId?: string
  currentTechInsightId?: string
  tagIds: string[]
}

export default async function RelatedContent({ 
  currentNewsId, 
  currentTechInsightId, 
  tagIds 
}: RelatedContentProps) {
  if (!tagIds || tagIds.length === 0) {
    return null
  }

  // Get related news (excluding current news)
  const relatedNews = await prisma.news.findMany({
    where: {
      published: true,
      id: currentNewsId ? { not: currentNewsId } : undefined,
      tags: {
        some: {
          tagId: { in: tagIds },
        },
      },
    },
    include: {
      category: true,
      author: true,
    },
    orderBy: { createdAt: 'desc' },
    take: 3,
  })

  // Get related tech insights (excluding current tech insight)
  const relatedTechInsights = await prisma.techInsight.findMany({
    where: {
      published: true,
      id: currentTechInsightId ? { not: currentTechInsightId } : undefined,
      tags: {
        some: {
          tagId: { in: tagIds },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: 3,
  })

  const totalRelated = relatedNews.length + relatedTechInsights.length

  if (totalRelated === 0) {
    return null
  }

  return (
    <div className="mt-8 bg-white rounded-xl shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Content</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {relatedNews.map((item) => (
          <Link key={item.id} href={`/haber/${item.slug}`}>
            <div className="bg-gray-50 rounded-lg overflow-hidden hover:shadow-md transition-shadow border border-gray-200">
              {item.imageUrl ? (
                <div className="relative w-full h-40">
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="relative w-full h-40">
                  <ImagePlaceholder />
                </div>
              )}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                  {item.title}
                </h3>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>
                    {format(new Date(item.createdAt), 'MMM d, yyyy', { locale: enUS })}
                  </span>
                  {item.category && (
                    <span className="bg-[#93D419] text-white px-2 py-1 rounded text-xs">
                      {item.category.name}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </Link>
        ))}

        {relatedTechInsights.map((insight) => (
          <Link key={insight.id} href={`/techinsight/${insight.slug}`}>
            <div className="bg-gray-50 rounded-lg overflow-hidden hover:shadow-md transition-shadow border border-gray-200">
              {insight.imageUrl ? (
                <div className="relative w-full h-40">
                  <Image
                    src={insight.imageUrl}
                    alt={insight.title}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="relative w-full h-40">
                  <ImagePlaceholder />
                </div>
              )}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                  {insight.title}
                </h3>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>
                    {format(new Date(insight.createdAt), 'MMM d, yyyy', { locale: enUS })}
                  </span>
                  <span className="text-[#93D419] font-medium">TechInsight</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

