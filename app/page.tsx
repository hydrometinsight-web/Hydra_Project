import { SITE_URL, SITE_DESCRIPTION, SOCIAL_PROFILES } from '@/lib/site'
import { prisma } from '@/lib/prisma'
import { upcomingEventsWhere } from '@/lib/events'
import { Suspense } from 'react'
import type { Metadata } from 'next'
import HomePageClient from '@/components/HomePageClient'
import StructuredData from '@/components/StructuredData'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: { absolute: 'HydroMetInsight: Hydrometallurgy & Battery Recycling News' },
  description:
    'Independent news and technical insight on hydrometallurgy, battery recycling, rare earths and critical metals for engineers and industry professionals.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'HydroMetInsight: Hydrometallurgy & Battery Recycling News',
    description: 'Independent news and technical insight on hydrometallurgy, battery recycling, rare earths and critical metals.',
    type: 'website',
    url: '/',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'HydroMetInsight' }],
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
  // Only show upcoming or ongoing events (same rule as the /events page)
  const events = await prisma.event.findMany({
    where: {
      published: true,
      ...upcomingEventsWhere(),
    },
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

  const baseUrl = SITE_URL

  // Organization Structured Data
  const organizationStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'HydroMetInsight',
    url: baseUrl,
    logo: { '@type': 'ImageObject', url: `${baseUrl}/logo-square.png`, width: 512, height: 512 },
    image: `${baseUrl}/og-image.png`,
    description: SITE_DESCRIPTION,
    foundingDate: '2026',
    location: { '@type': 'Place', address: { '@type': 'PostalAddress', addressLocality: 'Madrid', addressCountry: 'ES' } },
    knowsAbout: [
      'Hydrometallurgy',
      'Battery recycling',
      'Black mass',
      'Critical minerals',
      'Solvent extraction',
      'Leaching',
      'Lithium',
      'Nickel and cobalt',
      'Rare earth elements',
      'Metal recovery',
    ],
    sameAs: SOCIAL_PROFILES,
  }

  // Website Structured Data
  const websiteStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'HydroMetInsight',
    alternateName: ['HydroMet Insight', 'hydrometinsight.com'],
    url: `${baseUrl}/`,
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

