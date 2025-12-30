import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'
import { sanitizeString, sanitizeSlug, sanitizeHtml, validateUrl } from '@/lib/validation'

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

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await verifyToken(request)
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const news = await prisma.news.findUnique({
      where: { id: params.id },
      include: {
        category: true,
        author: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
    })

    if (!news) {
      return NextResponse.json({ error: 'News not found' }, { status: 404 })
    }

    return NextResponse.json(news)
  } catch (error) {
    console.error('Error fetching news:', error)
    return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 })
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
    const { title, slug, content, excerpt, imageUrl, published, categoryId, tagIds } = body

    // Validate required fields
    if (!title || !slug || !content) {
      return NextResponse.json({ error: 'Title, slug, and content are required' }, { status: 400 })
    }

    // Validate ID format (basic check)
    if (typeof params.id !== 'string' || params.id.length === 0 || params.id.length > 100) {
      return NextResponse.json({ error: 'Invalid news ID' }, { status: 400 })
    }

    // Sanitize and validate inputs
    const sanitizedTitle = sanitizeString(title, 500)
    const sanitizedSlug = sanitizeSlug(slug)
    const sanitizedContent = sanitizeHtml(content)
    const sanitizedExcerpt = excerpt ? sanitizeString(excerpt, 1000) : null
    const sanitizedImageUrl = imageUrl ? (validateUrl(imageUrl) ? imageUrl : null) : null

    // Validate lengths
    if (sanitizedTitle.length === 0 || sanitizedTitle.length > 500) {
      return NextResponse.json({ error: 'Title must be between 1 and 500 characters' }, { status: 400 })
    }

    if (sanitizedSlug.length === 0 || sanitizedSlug.length > 100) {
      return NextResponse.json({ error: 'Invalid slug format' }, { status: 400 })
    }

    if (sanitizedContent.length === 0 || sanitizedContent.length > 50000) {
      return NextResponse.json({ error: 'Content must be between 1 and 50000 characters' }, { status: 400 })
    }

    // Validate categoryId if provided
    if (categoryId) {
      const category = await prisma.category.findUnique({
        where: { id: categoryId },
      })
      if (!category) {
        return NextResponse.json({ error: 'Invalid category' }, { status: 400 })
      }
    }

    // Validate tagIds if provided
    if (tagIds && Array.isArray(tagIds) && tagIds.length > 0) {
      const tags = await prisma.tag.findMany({
        where: { id: { in: tagIds } },
      })
      if (tags.length !== tagIds.length) {
        return NextResponse.json({ error: 'One or more tags are invalid' }, { status: 400 })
      }
    }

    // Update tags relationship
    if (tagIds !== undefined) {
      // Delete existing tags
      await prisma.newsTag.deleteMany({
        where: { newsId: params.id },
      })
      
      // Create new tags if provided
      if (Array.isArray(tagIds) && tagIds.length > 0) {
        await prisma.newsTag.createMany({
          data: tagIds.map((tagId: string) => ({
            newsId: params.id,
            tagId,
          })),
        })
      }
    }

    const news = await prisma.news.update({
      where: { id: params.id },
      data: {
        title: sanitizedTitle,
        slug: sanitizedSlug,
        content: sanitizedContent,
        excerpt: sanitizedExcerpt,
        imageUrl: sanitizedImageUrl,
        published: published === true,
        categoryId: categoryId || null,
      },
      include: {
        category: true,
        author: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
    })

    return NextResponse.json(news)
  } catch (error: any) {
    console.error('Error updating news:', error)
    // Don't expose internal error details in production
    if (process.env.NODE_ENV === 'development') {
      console.error('Full error:', error)
    }
    
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'News not found' }, { status: 404 })
    }
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'News with this slug already exists' }, { status: 400 })
    }
    
    return NextResponse.json(
      { error: 'Failed to update news' },
      { status: 500 }
    )
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
      return NextResponse.json({ error: 'Invalid news ID' }, { status: 400 })
    }

    await prisma.news.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: 'News deleted successfully' })
  } catch (error: any) {
    console.error('Error deleting news:', error)
    // Don't expose internal error details in production
    if (process.env.NODE_ENV === 'development') {
      console.error('Full error:', error)
    }
    
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'News not found' }, { status: 404 })
    }
    
    return NextResponse.json(
      { error: 'Failed to delete news' },
      { status: 500 }
    )
  }
}

