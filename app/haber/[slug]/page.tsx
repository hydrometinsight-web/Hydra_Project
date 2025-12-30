import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { format } from 'date-fns'
import { enUS } from 'date-fns/locale'
import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import AdSense from '@/components/AdSense'
import ImagePlaceholder from '@/components/ImagePlaceholder'
import CommentForm from '@/components/CommentForm'
import CommentItem from '@/components/CommentItem'
import StructuredData from '@/components/StructuredData'
import SocialShare from '@/components/SocialShare'
import RelatedContent from '@/components/RelatedContent'
import PDFExportButton from '@/components/PDFExportButton'

async function getNews(slug: string) {
  const news = await prisma.news.findUnique({
    where: { slug },
    include: {
      category: true,
      author: true,
      comments: {
        where: { 
          approved: true,
          parentId: null, // Only top-level comments
        },
        include: {
          replies: {
            where: { approved: true },
            include: {
              likes: true,
            },
            orderBy: { createdAt: 'asc' },
          },
          likes: true,
        },
        orderBy: { createdAt: 'desc' },
      },
      tags: {
        include: {
          tag: true,
        },
      },
    },
  })
  return news
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const news = await getNews(params.slug)

  if (!news || !news.published) {
    return {
      title: 'News Not Found',
    }
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const url = `${baseUrl}/haber/${news.slug}`
  const imageUrl = news.imageUrl || `${baseUrl}/logo1.png`

  return {
    title: news.title,
    description: news.excerpt || 'Read the latest news in hydrometallurgy and critical metals.',
    keywords: news.category ? [news.category.name, 'hydrometallurgy', 'critical metals', 'mining'] : ['hydrometallurgy', 'critical metals', 'mining'],
    authors: [{ name: news.author.name }],
    openGraph: {
      type: 'article',
      url,
      title: news.title,
      description: news.excerpt || 'Read the latest news in hydrometallurgy and critical metals.',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: news.title,
        },
      ],
      publishedTime: news.createdAt.toISOString(),
      modifiedTime: news.updatedAt.toISOString(),
      authors: [news.author.name],
      section: news.category?.name,
      tags: news.category ? [news.category.name] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: news.title,
      description: news.excerpt || 'Read the latest news in hydrometallurgy and critical metals.',
      images: [imageUrl],
    },
    alternates: {
      canonical: url,
    },
  }
}

export default async function NewsDetailPage({ params }: { params: { slug: string } }) {
  const news = await getNews(params.slug)

  if (!news || !news.published) {
    notFound()
  }

      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
      const url = `${baseUrl}/haber/${news.slug}`
      const imageUrl = news.imageUrl || `${baseUrl}/logo1.png`

      // Structured Data for Article
      const articleStructuredData = {
        '@context': 'https://schema.org',
        '@type': 'NewsArticle',
        headline: news.title,
        description: news.excerpt || '',
        image: imageUrl,
        datePublished: news.createdAt.toISOString(),
        dateModified: news.updatedAt.toISOString(),
        author: {
          '@type': 'Person',
          name: news.author.name,
        },
        publisher: {
          '@type': 'Organization',
          name: 'HydroMetInsight',
          logo: {
            '@type': 'ImageObject',
            url: `${baseUrl}/logo1.png`,
          },
        },
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': url,
        },
        articleSection: news.category?.name,
        keywords: news.category ? news.category.name : 'hydrometallurgy',
      }

  return (
    <>
      <StructuredData data={articleStructuredData} />
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-8 max-w-7xl mx-auto">
        <Link href="/news" className="text-gray-600 hover:text-[#93D419] mb-4 inline-block text-sm transition-colors">
          ← Back to News
        </Link>

        <article className="bg-white rounded-xl shadow-md overflow-hidden" itemScope itemType="https://schema.org/NewsArticle">
        {news.imageUrl ? (
          <div className="relative w-full h-96">
            <Image
              src={news.imageUrl}
              alt={news.title}
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
          <div className="flex items-center gap-4 mb-4 flex-wrap">
            {news.category && (
              <span className="bg-[#93D419] text-white px-3 py-1 rounded-full text-sm font-medium">
                {news.category.name}
              </span>
            )}
            {news.tags && news.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {news.tags.map((newsTag) => (
                  <Link
                    key={newsTag.tag.id}
                    href={`/tag/${newsTag.tag.slug}`}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-full text-sm font-medium transition-colors inline-block min-w-[100px] text-center"
                  >
                    #{newsTag.tag.name}
                  </Link>
                ))}
              </div>
            )}
            <span className="text-gray-500 text-sm">
              {format(new Date(news.createdAt), 'MMMM d, yyyy', { locale: enUS })}
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4" itemProp="headline">
            {news.title}
          </h1>

          {news.excerpt && (
            <p className="text-xl text-gray-600 mb-6 italic" itemProp="description">
              {news.excerpt}
            </p>
          )}

          {/* Social Share Buttons and PDF Export */}
          <div className="mb-6 pb-6 border-b border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <SocialShare 
              url={url}
              title={news.title}
              description={news.excerpt || ''}
            />
            <PDFExportButton
              elementId="news-content"
              title={news.title}
              author={news.author.name}
              date={format(new Date(news.createdAt), 'MMMM d, yyyy', { locale: enUS })}
              filename={`${news.slug}.pdf`}
            />
          </div>

          <div id="news-content" className="print-content">
            <div className="prose prose-lg max-w-none mb-8" itemProp="articleBody" style={{ textAlign: 'inherit' }}>
              <div dangerouslySetInnerHTML={{ __html: news.content }} />
            </div>
          </div>

          <div className="border-t border-gray-200 pt-4 mt-8">
            <p className="text-sm text-gray-500">
              By <span itemProp="author">{news.author.name}</span> • 
              <time itemProp="datePublished" dateTime={news.createdAt.toISOString()}>
                {format(new Date(news.createdAt), 'MMMM d, yyyy', { locale: enUS })}
              </time>
            </p>
          </div>
        </div>
      </article>

      {/* AdSense Ad */}
      <div className="my-8">
        <AdSense adSlot="1234567890" className="w-full" />
      </div>

      {/* Related Content */}
      {news.tags && news.tags.length > 0 && (
        <RelatedContent currentNewsId={news.id} tagIds={news.tags.map(t => t.tag.id)} />
      )}

      {/* Comments Section */}
      <div className="mt-8">
        <CommentForm newsId={news.id} />
        
        {news.comments.length > 0 && (
          <div className="mt-8 bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Comments ({news.comments.length})
            </h2>
            <div className="space-y-6">
              {news.comments.map((comment) => (
                <div key={comment.id} className="border-b border-gray-200 pb-6 last:border-0 last:pb-0">
                  <CommentItem comment={comment as any} newsId={news.id} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
    </>
  )
}

