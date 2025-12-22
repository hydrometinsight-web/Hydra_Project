import { prisma } from '@/lib/prisma'
import { Suspense } from 'react'
import HomePageClient from '@/components/HomePageClient'

async function getLatestNews() {
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

export default async function Home() {
  const latestNews = await getLatestNews()
  const allNews = await getAllNews()
  const techInsights = await getTechInsights()
  const events = await getEvents()

  return (
    <Suspense fallback={<div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-6 max-w-7xl mx-auto"><div className="text-center py-12">Loading...</div></div>}>
      <HomePageClient
        latestNews={latestNews}
        allNews={allNews}
        techInsights={techInsights}
        events={events}
      />
    </Suspense>
  )
}

