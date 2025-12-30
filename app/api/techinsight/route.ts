import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const ITEMS_PER_PAGE = 12

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1', 10)
    const search = searchParams.get('search') || ''
    const sortBy = searchParams.get('sortBy') || 'date-desc' // 'date-desc', 'date-asc', 'title-asc', 'title-desc'
    const dateFrom = searchParams.get('dateFrom')
    const dateTo = searchParams.get('dateTo')

    const skip = (page - 1) * ITEMS_PER_PAGE

    const where: any = { published: true }
    
    // Search filter (title, excerpt, content)
    // Note: SQLite doesn't support case-insensitive mode, so we'll use contains
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { excerpt: { contains: search } },
        { content: { contains: search } },
      ]
    }

    // Date range filter
    if (dateFrom || dateTo) {
      where.createdAt = {}
      if (dateFrom) {
        where.createdAt.gte = new Date(dateFrom)
      }
      if (dateTo) {
        const toDate = new Date(dateTo)
        toDate.setHours(23, 59, 59, 999) // End of day
        where.createdAt.lte = toDate
      }
    }

    // Sort options
    let orderBy: any = { createdAt: 'desc' }
    switch (sortBy) {
      case 'date-asc':
        orderBy = { createdAt: 'asc' }
        break
      case 'date-desc':
        orderBy = { createdAt: 'desc' }
        break
      case 'title-asc':
        orderBy = { title: 'asc' }
        break
      case 'title-desc':
        orderBy = { title: 'desc' }
        break
      default:
        orderBy = { createdAt: 'desc' }
    }

    const [insights, total] = await Promise.all([
      prisma.techInsight.findMany({
        where,
        include: {
          tags: {
            include: {
              tag: true,
            },
          },
        },
        orderBy,
        skip,
        take: ITEMS_PER_PAGE,
      }),
      prisma.techInsight.count({ where }),
    ])

    const totalPages = Math.ceil(total / ITEMS_PER_PAGE)

    return NextResponse.json({
      insights,
      pagination: {
        page,
        totalPages,
        totalItems: total,
        itemsPerPage: ITEMS_PER_PAGE,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    })
  } catch (error) {
    console.error('Error fetching tech insights:', error)
    return NextResponse.json({ error: 'Failed to fetch tech insights' }, { status: 500 })
  }
}

