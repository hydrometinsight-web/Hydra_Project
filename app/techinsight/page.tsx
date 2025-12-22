import { prisma } from '@/lib/prisma'
import { format } from 'date-fns'
import { enUS } from 'date-fns/locale'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import AdSense from '@/components/AdSense'
import ImagePlaceholder from '@/components/ImagePlaceholder'

export const metadata: Metadata = {
  title: 'TechInsight',
  description: 'In-depth technical insights and analysis on hydrometallurgy processes, technologies, and innovations.',
  openGraph: {
    title: 'TechInsight | HydroMetInsight',
    description: 'In-depth technical insights and analysis on hydrometallurgy processes, technologies, and innovations.',
    type: 'website',
  },
}

async function getTechInsights() {
  const insights = await prisma.techInsight.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
  })
  return insights
}

export default async function TechInsightPage() {
  const insights = await getTechInsights()

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-8 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">TechInsight</h1>

      {/* AdSense Ad */}
      <div className="mb-8">
        <AdSense adSlot="1234567890" className="w-full" />
      </div>
      
      {insights.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8">
          <p className="text-gray-600 text-lg">
            Welcome to TechInsight. This section will feature technical insights, analysis, and deep dives into hydrometallurgy technologies.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {insights.map((insight) => (
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
                    <span className="text-primary-600 font-medium hover:translate-x-1 transition-transform inline-block">
                      Read More →
                    </span>
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

