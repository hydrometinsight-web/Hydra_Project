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

export async function GET(request: NextRequest) {
  const user = await verifyToken(request)
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const news = await prisma.news.findMany({
      include: {
        category: true,
        author: true,
      },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(news)
  } catch (error) {
    console.error('Error fetching news:', error)
    return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const user = await verifyToken(request)
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { title, slug, content, excerpt, imageUrl, published, categoryId } = body

    // Validate required fields
    if (!title || !slug || !content) {
      return NextResponse.json({ error: 'Title, slug, and content are required' }, { status: 400 })
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

    const news = await prisma.news.create({
      data: {
        title: sanitizedTitle,
        slug: sanitizedSlug,
        content: sanitizedContent,
        excerpt: sanitizedExcerpt,
        imageUrl: sanitizedImageUrl,
        published: published === true,
        categoryId: categoryId || null,
        authorId: user.userId,
      },
      include: {
        category: true,
        author: true,
      },
    })

    return NextResponse.json(news, { status: 201 })
  } catch (error: any) {
    console.error('Error creating news:', error)
    // Don't expose internal error details in production
    if (process.env.NODE_ENV === 'development') {
      console.error('Full error:', error)
    }
    
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'News with this slug already exists' }, { status: 400 })
    }
    
    return NextResponse.json(
      { error: 'Failed to create news' },
      { status: 500 }
    )
  }
}

