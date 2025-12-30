import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/security'
import { sanitizeString, sanitizeSlug } from '@/lib/validation'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await verifyToken(request)
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const tag = await prisma.tag.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: {
            news: true,
            techInsights: true,
          },
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

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Validate ID format
    if (typeof params.id !== 'string' || params.id.length === 0 || params.id.length > 100) {
      return NextResponse.json({ error: 'Invalid tag ID' }, { status: 400 })
    }

    // Sanitize inputs
    const sanitizedName = sanitizeString(name, 100)
    const sanitizedSlug = sanitizeSlug(slug)
    const sanitizedDescription = description ? sanitizeString(description, 500) : null

    if (!sanitizedName || !sanitizedSlug) {
      return NextResponse.json({ error: 'Invalid name or slug format' }, { status: 400 })
    }

    // Check if another tag with same name or slug exists
    const existingTag = await prisma.tag.findFirst({
      where: {
        AND: [
          { id: { not: params.id } },
          {
            OR: [
              { name: sanitizedName },
              { slug: sanitizedSlug },
            ],
          },
        ],
      },
    })

    if (existingTag) {
      return NextResponse.json({ error: 'Tag with this name or slug already exists' }, { status: 400 })
    }

    const tag = await prisma.tag.update({
      where: { id: params.id },
      data: {
        name: sanitizedName,
        slug: sanitizedSlug,
        description: sanitizedDescription,
      },
    })

    return NextResponse.json(tag)
  } catch (error) {
    console.error('Error updating tag:', error)
    return NextResponse.json({ error: 'Failed to update tag' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await verifyToken(request)
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Validate ID format
    if (typeof params.id !== 'string' || params.id.length === 0 || params.id.length > 100) {
      return NextResponse.json({ error: 'Invalid tag ID' }, { status: 400 })
    }

    await prisma.tag.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: 'Tag deleted successfully' })
  } catch (error) {
    console.error('Error deleting tag:', error)
    return NextResponse.json({ error: 'Failed to delete tag' }, { status: 500 })
  }
}

