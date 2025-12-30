import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const tag = await prisma.tag.findUnique({
      where: { slug: params.slug },
      include: {
        news: {
          where: { published: true },
          include: {
            category: true,
            author: true,
          },
          orderBy: { createdAt: 'desc' },
        },
        techInsights: {
          where: { published: true },
          orderBy: { createdAt: 'desc' },
        },
      },
    })

    if (!tag) {
      return NextResponse.json({ error: 'Tag not found' }, { status: 404 })
    }

    return NextResponse.json(tag)
  } catch (error) {
    console.error('Error fetching tag:', error)
    return NextResponse.json({ error: 'Failed to fetch tag' }, { status: 500 })
  }
}

