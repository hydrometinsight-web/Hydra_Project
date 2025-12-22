import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { format } from 'date-fns'
import { enUS } from 'date-fns/locale'
import Image from 'next/image'
import Link from 'next/link'
import AdSense from '@/components/AdSense'
import ImagePlaceholder from '@/components/ImagePlaceholder'

async function getTechInsight(slug: string) {
  const insight = await prisma.techInsight.findUnique({
    where: { slug },
  })
  return insight
}

export default async function TechInsightDetailPage({ params }: { params: { slug: string } }) {
  const insight = await getTechInsight(params.slug)

  if (!insight || !insight.published) {
    notFound()
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-8 max-w-7xl mx-auto">
      <Link href="/techinsight" className="text-[#93D419] hover:text-[#7fb315] mb-4 inline-block">
        ← Back to TechInsight
      </Link>

      <article className="bg-white rounded-xl shadow-md overflow-hidden">
        {insight.imageUrl ? (
          <div className="relative w-full h-96">
            <Image
              src={insight.imageUrl}
              alt={insight.title}
              fill
              className="object-cover"
            />
          </div>
        ) : (
          <div className="relative w-full h-96">
            <ImagePlaceholder />
          </div>
        )}

        <div className="p-6 md:p-8">
          <div className="mb-4">
            <span className="text-gray-500 text-sm">
              {format(new Date(insight.createdAt), 'MMMM d, yyyy', { locale: enUS })}
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {insight.title}
          </h1>

          {insight.excerpt && (
            <p className="text-xl text-gray-600 mb-6 italic">
              {insight.excerpt}
            </p>
          )}

          <div className="prose prose-lg max-w-none mb-8">
            <div dangerouslySetInnerHTML={{ __html: insight.content }} />
          </div>
        </div>
      </article>

      {/* AdSense Ad */}
      <div className="my-8">
        <AdSense adSlot="1234567890" className="w-full" />
      </div>
    </div>
  )
}

