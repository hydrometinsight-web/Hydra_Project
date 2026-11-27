import { SITE_URL } from '@/lib/site'
import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'
import { getFacilities, CATEGORIES, facilityHref } from '@/lib/atlas'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SITE_URL

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/news`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/techinsight`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/atlas`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    ...CATEGORIES.filter((c) => c.enabled).map((c) => ({
      url: `${baseUrl}/atlas/${c.id}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
    ...getFacilities().map((f) => ({
      url: `${baseUrl}${facilityHref(f)}`,
      lastModified: new Date(f.lastVerified),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
    {
      url: `${baseUrl}/events`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/calculations`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/sponsor`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
  ]

  // Dynamic pages - News
  const news = await prisma.news.findMany({
    where: { published: true },
    select: {
      slug: true,
      updatedAt: true,
    },
  })

  // Category landing pages (only categories with published news)
  const categories = await prisma.category.findMany({
    // 'platform-updates' only holds site announcements, so it stays out of the sitemap
    where: { news: { some: { published: true } }, slug: { not: 'platform-updates' } },
    select: { slug: true, updatedAt: true, news: { where: { published: true }, select: { updatedAt: true }, orderBy: { updatedAt: 'desc' }, take: 1 } },
  })
  const categoryPages: MetadataRoute.Sitemap = categories.map((c) => ({
    url: `${baseUrl}/category/${c.slug}`,
    lastModified: c.news[0]?.updatedAt || c.updatedAt,
    changeFrequency: 'daily' as const,
    priority: 0.7,
  }))

  const newsPages: MetadataRoute.Sitemap = news.map((item) => ({
    url: `${baseUrl}/haber/${item.slug}`,
    lastModified: item.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  // Dynamic pages - TechInsight
  const techInsights = await prisma.techInsight.findMany({
    where: { published: true },
    select: {
      slug: true,
      updatedAt: true,
    },
  })

  const techInsightPages: MetadataRoute.Sitemap = techInsights.map((item) => ({
    url: `${baseUrl}/techinsight/${item.slug}`,
    lastModified: item.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  // Dynamic pages - Events
  const events = await prisma.event.findMany({
    where: { published: true },
    select: {
      slug: true,
      updatedAt: true,
    },
  })

  const eventPages: MetadataRoute.Sitemap = events.map((item) => ({
    url: `${baseUrl}/event/${item.slug}`,
    lastModified: item.updatedAt,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  return [...staticPages, ...categoryPages, ...newsPages, ...techInsightPages, ...eventPages]
}

