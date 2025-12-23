import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const ITEMS_PER_PAGE = 12

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1', 10)
    const categoryId = searchParams.get('categoryId')

    const skip = (page - 1) * ITEMS_PER_PAGE

    const where: any = { published: true }
    if (categoryId && categoryId !== 'all') {
      where.categoryId = categoryId
    }

    const [news, total] = await Promise.all([
      prisma.news.findMany({
        where,
        include: {
          category: true,
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: ITEMS_PER_PAGE,
      }),
      prisma.news.count({ where }),
    ])

    const totalPages = Math.ceil(total / ITEMS_PER_PAGE)

    return NextResponse.json({
      news,
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
    console.error('Error fetching news:', error)
    return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 })
  }
}

