import { prisma } from '@/lib/prisma'
import { Suspense } from 'react'
import type { Metadata } from 'next'
import HomePageClient from '@/components/HomePageClient'
import StructuredData from '@/components/StructuredData'

export const metadata: Metadata = {
  title: 'Home',
  description: 'Latest news, research, and developments in hydrometallurgy, critical metals, and battery recycling. Independent insights for engineers and industry experts.',
  openGraph: {
    title: 'HydroMetInsight - Hydrometallurgy News and Content Platform',
    description: 'Latest news, research, and developments in hydrometallurgy, critical metals, and battery recycling.',
    type: 'website',
  },
}

async function getFeaturedNews() {
  // Get main featured news
  const mainFeatured = await prisma.news.findFirst({
    where: { 
      published: true,
      featuredType: 'main',
    },
    include: {
      category: true,
      author: true,
    },
  })

  // Get secondary featured news (3 items)
  const secondaryFeatured = await prisma.news.findMany({
    where: { 
      published: true,
      featuredType: {
        in: ['secondary1', 'secondary2', 'secondary3'],
      },
    },
    include: {
      category: true,
      author: true,
    },
    orderBy: { 
      featuredType: 'asc', // secondary1, secondary2, secondary3 order
    },
    take: 3,
  })

  // If we have featured news, return them
  if (mainFeatured || secondaryFeatured.length > 0) {
    const featuredNews = []
    if (mainFeatured) {
      featuredNews.push(mainFeatured)
    }
    featuredNews.push(...secondaryFeatured)
    
    // Fill remaining slots with latest news if needed
    if (featuredNews.length < 4) {
      const featuredIds = featuredNews.map(n => n.id)
      const latestNews = await prisma.news.findMany({
        where: { 
          published: true,
          ...(featuredIds.length > 0 && {
            id: {
              notIn: featuredIds,
            },
          }),
        },
        include: {
          category: true,
          author: true,
        },
        orderBy: { createdAt: 'desc' },
        take: 4 - featuredNews.length,
      })
      featuredNews.push(...latestNews)
    }
    return featuredNews.slice(0, 4)
  }

  // Fallback to latest news if no featured news
  const news = await prisma.news.findMany({
    where: { published: true },
    include: {
      category: true,
      author: true,
    },
    orderBy: { createdAt: 'desc' },
    take: 4,
  })
  return news
}

async function getAllNews() {
  const news = await prisma.news.findMany({
    where: { published: true },
    include: {
      category: true,
      author: true,
    },
    orderBy: { createdAt: 'desc' },
  })
  return news
}

async function getTechInsights() {
  const insights = await prisma.techInsight.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
    take: 3,
  })
  return insights
}

async function getEvents() {
  const events = await prisma.event.findMany({
    where: { published: true },
    orderBy: { startDate: 'asc' },
    take: 3,
  })
  return events
}

async function getSponsors() {
  const sponsors = await prisma.sponsor.findMany({
    where: { active: true },
    orderBy: { createdAt: 'desc' },
  })
  return sponsors
}

export default async function Home() {
  const latestNews = await getFeaturedNews()
  const allNews = await getAllNews()
  const techInsights = await getTechInsights()
  const events = await getEvents()
  const sponsors = await getSponsors()

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  // Organization Structured Data
  const organizationStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'HydroMetInsight',
    url: baseUrl,
    logo: `${baseUrl}/logo1.png`,
    description: 'Independent insights on hydrometallurgy, critical metals, and battery recycling.',
    sameAs: [],
  }

  // Website Structured Data
  const websiteStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'HydroMetInsight',
    url: baseUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${baseUrl}/news?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }

  return (
    <>
      <StructuredData data={organizationStructuredData} />
      <StructuredData data={websiteStructuredData} />
      <Suspense fallback={<div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-6 max-w-7xl mx-auto"><div className="text-center py-12">Loading...</div></div>}>
        <HomePageClient
          latestNews={latestNews}
          allNews={allNews}
          techInsights={techInsights}
          events={events}
          sponsors={sponsors}
        />
      </Suspense>
    </>
  )
}

