import { SITE_URL, SITE_NAME } from '@/lib/site'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { format } from 'date-fns'
import { enUS } from 'date-fns/locale'
import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import ImagePlaceholder from '@/components/ImagePlaceholder'

// Category landing pages, e.g. /category/battery-recycling.
// Refreshed every 5 minutes so new articles appear without a redeploy.
export const revalidate = 300

const PAGE_SIZE = 24

async function getCategory(slug: string, page: number) {
  const category = await prisma.category.findUnique({ where: { slug } })
  if (!category) return null
  const where = { published: true, categoryId: category.id }
  const [news, total, others] = await Promise.all([
    prisma.news.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      select: { id: true, title: true, slug: true, excerpt: true, imageUrl: true, createdAt: true },
    }),
    prisma.news.count({ where }),
    prisma.category.findMany({
      where: { id: { not: category.id }, news: { some: { published: true } } },
      orderBy: { name: 'asc' },
      select: { name: true, slug: true },
    }),
  ])
  return { category, news, total, others }
}

function pageFrom(searchParams?: { page?: string }) {
  const p = parseInt(searchParams?.page || '1', 10)
  return Number.isFinite(p) && p > 0 ? p : 1
}

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: { slug: string }
  searchParams?: { page?: string }
}): Promise<Metadata> {
  const data = await getCategory(params.slug, pageFrom(searchParams))
  if (!data) return { title: 'Category Not Found' }
  const { category } = data
  const page = pageFrom(searchParams)
  const url = `${SITE_URL}/category/${category.slug}${page > 1 ? `?page=${page}` : ''}`
  const title = `${category.name} News${page > 1 ? ` – Page ${page}` : ''}`
  const description =
    category.description || `Latest ${category.name.toLowerCase()} news and analysis from ${SITE_NAME}.`
  return {
    title,
    description,
    keywords: [category.name, `${category.name} news`, 'hydrometallurgy', 'critical metals'],
    alternates: { canonical: url },
    openGraph: { type: 'website', url, title: `${title} | ${SITE_NAME}`, description },
    twitter: { card: 'summary', title: `${title} | ${SITE_NAME}`, description },
  }
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: { slug: string }
  searchParams?: { page?: string }
}) {
  const page = pageFrom(searchParams)
  const data = await getCategory(params.slug, page)
  if (!data) notFound()
  const { category, news, total, others } = data
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const url = `${SITE_URL}/category/${category.slug}`

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: `${category.name} News`,
      description: category.description || undefined,
      url,
      isPartOf: { '@type': 'WebSite', name: SITE_NAME, url: SITE_URL },
      mainEntity: {
        '@type': 'ItemList',
        itemListElement: news.map((item, i) => ({
          '@type': 'ListItem',
          position: (page - 1) * PAGE_SIZE + i + 1,
          url: `${SITE_URL}/haber/${item.slug}`,
          name: item.title,
        })),
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'News', item: `${SITE_URL}/news` },
        { '@type': 'ListItem', position: 3, name: category.name, item: url },
      ],
    },
  ]

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-8 max-w-7xl mx-auto">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav className="mb-4 text-sm text-gray-600" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-lime-700">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/news" className="hover:text-lime-700">News</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900">{category.name}</span>
      </nav>

      <header className="bg-white rounded-xl shadow-md p-6 mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">{category.name} News</h1>
        {category.description && <p className="text-gray-600 text-lg mb-3">{category.description}</p>}
        <p className="text-gray-500 text-sm">
          {total} {total === 1 ? 'article' : 'articles'}
        </p>
        {others.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-2">
            {others.map((c) => (
              <Link
                key={c.slug}
                href={`/category/${c.slug}`}
                className="rounded-full bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-200"
              >
                {c.name}
              </Link>
            ))}
          </div>
        )}
      </header>

      {news.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-600 text-lg">No articles in this category yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.map((item) => (
            <Link key={item.id} href={`/haber/${item.slug}`} className="block h-full">
              <article className="h-full flex flex-col bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-200">
                <div className="relative w-full h-48 flex-shrink-0">
                  {item.imageUrl ? (
                    <Image src={item.imageUrl} alt={item.title} fill className="object-cover" sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw" />
                  ) : (
                    <ImagePlaceholder />
                  )}
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2 min-h-[3.5rem]">{item.title}</h2>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3 min-h-[3.75rem]">{item.excerpt || ''}</p>
                  <div className="mt-auto flex items-center justify-between text-xs text-gray-500">
                    <time dateTime={item.createdAt.toISOString()}>
                      {format(new Date(item.createdAt), 'MMMM d, yyyy', { locale: enUS })}
                    </time>
                    <span className="text-lime-700 font-medium">Read More →</span>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <nav className="mt-10 flex items-center justify-center gap-3 text-sm" aria-label="Pagination">
          {page > 1 && (
            <Link href={`/category/${category.slug}${page - 1 > 1 ? `?page=${page - 1}` : ''}`} className="rounded-md border border-gray-300 px-4 py-2 hover:bg-gray-50">
              ← Newer
            </Link>
          )}
          <span className="text-gray-600">Page {page} of {totalPages}</span>
          {page < totalPages && (
            <Link href={`/category/${category.slug}?page=${page + 1}`} className="rounded-md border border-gray-300 px-4 py-2 hover:bg-gray-50">
              Older →
            </Link>
          )}
        </nav>
      )}
    </div>
  )
}
