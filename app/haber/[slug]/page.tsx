import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { format } from 'date-fns'
import { enUS } from 'date-fns/locale'
import Image from 'next/image'
import Link from 'next/link'
import AdSense from '@/components/AdSense'
import ImagePlaceholder from '@/components/ImagePlaceholder'

async function getNews(slug: string) {
  const news = await prisma.news.findUnique({
    where: { slug },
    include: {
      category: true,
      author: true,
      comments: {
        where: { approved: true },
        orderBy: { createdAt: 'desc' },
      },
    },
  })
  return news
}

export default async function NewsDetailPage({ params }: { params: { slug: string } }) {
  const news = await getNews(params.slug)

  if (!news || !news.published) {
    notFound()
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-8 max-w-7xl mx-auto">
      <Link href="/news" className="text-[#93D419] hover:text-[#7fb315] mb-4 inline-block">
        ← Back to News
      </Link>

      <article className="bg-white rounded-xl shadow-md overflow-hidden">
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
          <div className="flex items-center gap-4 mb-4">
            {news.category && (
              <span className="bg-[#93D419] text-white px-3 py-1 rounded-full text-sm font-medium">
                {news.category.name}
              </span>
            )}
            <span className="text-gray-500 text-sm">
              {format(new Date(news.createdAt), 'MMMM d, yyyy', { locale: enUS })}
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {news.title}
          </h1>

          {news.excerpt && (
            <p className="text-xl text-gray-600 mb-6 italic">
              {news.excerpt}
            </p>
          )}

          <div className="prose prose-lg max-w-none mb-8">
            <div dangerouslySetInnerHTML={{ __html: news.content }} />
          </div>

          <div className="border-t border-gray-200 pt-4 mt-8">
            <p className="text-sm text-gray-500">
              By {news.author.name} • {format(new Date(news.createdAt), 'MMMM d, yyyy', { locale: enUS })}
            </p>
          </div>
        </div>
      </article>

      {/* AdSense Ad */}
      <div className="my-8">
        <AdSense adSlot="1234567890" className="w-full" />
      </div>

      {/* Comments Section */}
      {news.comments.length > 0 && (
        <div className="mt-8 bg-white rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Comments</h2>
          <div className="space-y-4">
            {news.comments.map((comment) => (
              <div key={comment.id} className="border-b border-gray-200 pb-4 last:border-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-semibold text-gray-900">{comment.name}</span>
                  <span className="text-gray-500 text-sm">
                    {format(new Date(comment.createdAt), 'MMM d, yyyy', { locale: enUS })}
                  </span>
                </div>
                <p className="text-gray-700">{comment.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

