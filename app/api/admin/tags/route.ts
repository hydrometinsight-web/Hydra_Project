import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/security'
import { sanitizeString, sanitizeSlug } from '@/lib/validation'

export async function GET(request: NextRequest) {
  const user = await verifyToken(request)
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const tags = await prisma.tag.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: {
            news: true,
            techInsights: true,
          },
        },
      },
    })
    return NextResponse.json(tags)
  } catch (error) {
    console.error('Error fetching tags:', error)
    return NextResponse.json({ error: 'Failed to fetch tags' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const user = await verifyToken(request)
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { name, slug, description } = body

    if (!name || !slug) {
      return NextResponse.json({ error: 'Name and slug are required' }, { status: 400 })
    }

    // Sanitize inputs
    const sanitizedName = sanitizeString(name, 100)
    const sanitizedSlug = sanitizeSlug(slug)
    const sanitizedDescription = description ? sanitizeString(description, 500) : null

    if (!sanitizedName || !sanitizedSlug) {
      return NextResponse.json({ error: 'Invalid name or slug format' }, { status: 400 })
    }

    // Check if tag with same name or slug already exists
    const existingTag = await prisma.tag.findFirst({
      where: {
        OR: [
          { name: sanitizedName },
          { slug: sanitizedSlug },
        ],
      },
    })

    if (existingTag) {
      return NextResponse.json({ error: 'Tag with this name or slug already exists' }, { status: 400 })
    }

    const tag = await prisma.tag.create({
      data: {
        name: sanitizedName,
        slug: sanitizedSlug,
        description: sanitizedDescription,
      },
    })

    return NextResponse.json(tag, { status: 201 })
  } catch (error) {
    console.error('Error creating tag:', error)
    return NextResponse.json({ error: 'Failed to create tag' }, { status: 500 })
  }
}

