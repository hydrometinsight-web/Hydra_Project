import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'your-secret-key'

async function verifyToken(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }

  try {
    const token = authHeader.substring(7)
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; role: string }
    return decoded
  } catch {
    return null
  }
}

export async function GET(request: NextRequest) {
  const user = await verifyToken(request)
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const now = new Date()
    const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

    const [
      totalNews,
      publishedNews,
      totalCategories,
      totalTags,
      totalQuestions,
      answeredQuestions,
      totalEvents,
      publishedEvents,
      totalTechInsight,
      publishedTechInsight,
      totalComments,
      approvedComments,
      newsLast7Days,
      newsLast30Days,
      eventsLast7Days,
      eventsLast30Days,
      techInsightLast7Days,
      techInsightLast30Days,
      commentsLast7Days,
      commentsLast30Days,
      questionsLast7Days,
      questionsLast30Days,
      totalUsers,
      totalPageViews,
      pageViewsLast7Days,
      pageViewsLast30Days,
      pageViewsBySection,
      pageViewsByCountry,
    ] = await Promise.all([
      prisma.news.count(),
      prisma.news.count({ where: { published: true } }),
      prisma.category.count(),
      prisma.tag.count(),
      prisma.question.count(),
      prisma.question.count({ where: { answered: true } }),
      prisma.event.count(),
      prisma.event.count({ where: { published: true } }),
      prisma.techInsight.count(),
      prisma.techInsight.count({ where: { published: true } }),
      prisma.comment.count(),
      prisma.comment.count({ where: { approved: true } }),
      prisma.news.count({ where: { createdAt: { gte: last7Days } } }),
      prisma.news.count({ where: { createdAt: { gte: last30Days } } }),
      prisma.event.count({ where: { createdAt: { gte: last7Days } } }),
      prisma.event.count({ where: { createdAt: { gte: last30Days } } }),
      prisma.techInsight.count({ where: { createdAt: { gte: last7Days } } }),
      prisma.techInsight.count({ where: { createdAt: { gte: last30Days } } }),
      prisma.comment.count({ where: { createdAt: { gte: last7Days } } }),
      prisma.comment.count({ where: { createdAt: { gte: last30Days } } }),
      prisma.question.count({ where: { createdAt: { gte: last7Days } } }),
      prisma.question.count({ where: { createdAt: { gte: last30Days } } }),
      prisma.user.count(),
      prisma.pageView.count(),
      prisma.pageView.count({ where: { createdAt: { gte: last7Days } } }),
      prisma.pageView.count({ where: { createdAt: { gte: last30Days } } }),
      prisma.pageView.groupBy({
        by: ['section'],
        _count: {
          id: true,
        },
        orderBy: {
          _count: {
            id: 'desc',
          },
        },
      }),
      prisma.pageView.groupBy({
        by: ['country'],
        _count: {
          id: true,
        },
        where: {
          country: {
            not: null,
          },
        },
        orderBy: {
          _count: {
            id: 'desc',
          },
        },
        take: 10, // Top 10 countries
      }),
    ])

    return NextResponse.json({
      news: {
        total: totalNews,
        published: publishedNews,
        draft: totalNews - publishedNews,
        last7Days: newsLast7Days,
        last30Days: newsLast30Days,
      },
      categories: {
        total: totalCategories,
      },
      tags: {
        total: totalTags,
      },
      questions: {
        total: totalQuestions,
        answered: answeredQuestions,
        pending: totalQuestions - answeredQuestions,
        last7Days: questionsLast7Days,
        last30Days: questionsLast30Days,
      },
      events: {
        total: totalEvents,
        published: publishedEvents,
        draft: totalEvents - publishedEvents,
        last7Days: eventsLast7Days,
        last30Days: eventsLast30Days,
      },
      techInsight: {
        total: totalTechInsight,
        published: publishedTechInsight,
        draft: totalTechInsight - publishedTechInsight,
        last7Days: techInsightLast7Days,
        last30Days: techInsightLast30Days,
      },
      comments: {
        total: totalComments,
        approved: approvedComments,
        pending: totalComments - approvedComments,
        last7Days: commentsLast7Days,
        last30Days: commentsLast30Days,
      },
      users: {
        total: totalUsers,
      },
      activity: {
        last7Days: {
          news: newsLast7Days,
          events: eventsLast7Days,
          techInsight: techInsightLast7Days,
          comments: commentsLast7Days,
          questions: questionsLast7Days,
        },
        last30Days: {
          news: newsLast30Days,
          events: eventsLast30Days,
          techInsight: techInsightLast30Days,
          comments: commentsLast30Days,
          questions: questionsLast30Days,
        },
      },
      pageViews: {
        total: totalPageViews,
        last7Days: pageViewsLast7Days,
        last30Days: pageViewsLast30Days,
        bySection: pageViewsBySection.map((item) => ({
          section: item.section,
          count: item._count.id,
        })),
        byCountry: pageViewsByCountry.map((item) => ({
          country: item.country || 'Unknown',
          count: item._count.id,
        })),
      },
    })
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json({ error: 'Failed to fetch statistics' }, { status: 500 })
  }
}

