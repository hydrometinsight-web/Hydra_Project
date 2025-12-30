import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/security'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const user = await verifyToken(request)
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status') // 'all', 'approved', 'pending'
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '20', 10)
    const skip = (page - 1) * limit

    const where: any = {}
    if (status === 'approved') {
      where.approved = true
    } else if (status === 'pending') {
      where.approved = false
    }

    const [comments, total, totalPending, totalApproved] = await Promise.all([
      prisma.comment.findMany({
        where,
        include: {
          news: {
            select: {
              id: true,
              title: true,
              slug: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.comment.count({ where }),
      prisma.comment.count({ where: { approved: false } }),
      prisma.comment.count({ where: { approved: true } }),
    ])

    return NextResponse.json({
      comments,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      counts: {
        pending: totalPending,
        approved: totalApproved,
        all: totalPending + totalApproved,
      },
    })
  } catch (error) {
    console.error('Error fetching comments:', error)
    return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 })
  }
}

