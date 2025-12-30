import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { format } from 'date-fns'
import { enUS } from 'date-fns/locale'
import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import AdSense from '@/components/AdSense'
import ImagePlaceholder from '@/components/ImagePlaceholder'
import SocialShare from '@/components/SocialShare'
import RelatedContent from '@/components/RelatedContent'
import PDFExportButton from '@/components/PDFExportButton'

async function getTechInsight(slug: string) {
  const insight = await prisma.techInsight.findUnique({
    where: { slug },
    include: {
      tags: {
        include: {
          tag: true,
        },
      },
    },
  })
  return insight
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const insight = await getTechInsight(params.slug)

  if (!insight || !insight.published) {
    return {
      title: 'TechInsight Not Found',
    }
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const url = `${baseUrl}/techinsight/${insight.slug}`
  const imageUrl = insight.imageUrl || `${baseUrl}/logo1.png`

  return {
    title: insight.title,
    description: insight.excerpt || 'Read technical insights and analysis in hydrometallurgy and critical metals.',
    keywords: ['hydrometallurgy', 'technical insights', 'critical metals', 'mining technology', 'metal extraction'],
    openGraph: {
      type: 'article',
      url,
      title: insight.title,
      description: insight.excerpt || 'Read technical insights and analysis in hydrometallurgy and critical metals.',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: insight.title,
        },
      ],
      publishedTime: insight.createdAt.toISOString(),
      modifiedTime: insight.updatedAt.toISOString(),
    },
    twitter: {
      card: 'summary_large_image',
      title: insight.title,
      description: insight.excerpt || 'Read technical insights and analysis in hydrometallurgy and critical metals.',
      images: [imageUrl],
    },
    alternates: {
      canonical: url,
    },
  }
}

export default async function TechInsightDetailPage({ params }: { params: { slug: string } }) {
  const insight = await getTechInsight(params.slug)

  if (!insight || !insight.published) {
    notFound()
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const url = `${baseUrl}/techinsight/${insight.slug}`

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
          <div className="mb-4 flex items-center gap-4 flex-wrap">
            {insight.tags && insight.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {insight.tags.map((techInsightTag) => (
                  <Link
                    key={techInsightTag.tag.id}
                    href={`/tag/${techInsightTag.tag.slug}`}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-full text-sm font-medium transition-colors inline-block min-w-[100px] text-center"
                  >
                    #{techInsightTag.tag.name}
                  </Link>
                ))}
              </div>
            )}
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

          {/* Social Share Buttons and PDF Export */}
          <div className="mb-6 pb-6 border-b border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <SocialShare 
              url={url}
              title={insight.title}
              description={insight.excerpt || ''}
            />
            <PDFExportButton
              elementId="techinsight-content"
              title={insight.title}
              date={format(new Date(insight.createdAt), 'MMMM d, yyyy', { locale: enUS })}
              filename={`${insight.slug}.pdf`}
            />
          </div>

          <div id="techinsight-content" className="print-content">
            <div className="prose prose-lg max-w-none mb-8" style={{ textAlign: 'inherit' }}>
              <div dangerouslySetInnerHTML={{ __html: insight.content }} />
            </div>
          </div>
        </div>
      </article>

      {/* AdSense Ad */}
      <div className="my-8">
        <AdSense adSlot="1234567890" className="w-full" />
      </div>

      {/* Related Content */}
      {insight.tags && insight.tags.length > 0 && (
        <RelatedContent 
          currentTechInsightId={insight.id} 
          tagIds={insight.tags.map(t => t.tag.id)} 
        />
      )}
    </div>
  )
}

