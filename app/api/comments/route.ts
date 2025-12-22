import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { rateLimit, getClientIdentifier } from '@/lib/rateLimit'
import { sanitizeString, sanitizeEmail, sanitizeHtml } from '@/lib/validation'

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientId = getClientIdentifier(request)
    const rateLimitResult = rateLimit(`comment:${clientId}`, {
      windowMs: 60 * 1000, // 1 minute
      maxRequests: 3, // 3 comments per minute
    })

    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { error: 'Too many comment submissions. Please try again later.' },
        { 
          status: 429,
          headers: {
            'Retry-After': Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000).toString(),
          },
        }
      )
    }

    const body = await request.json()
    let { newsId, name, email, content } = body

    // Validation
    if (!newsId || !name || !email || !content) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Sanitize inputs
    name = sanitizeString(name, 100)
    email = sanitizeEmail(email)
    content = sanitizeHtml(sanitizeString(content, 2000))
    newsId = sanitizeString(newsId, 50)

    if (!name || !email || !content || !newsId) {
      return NextResponse.json(
        { error: 'Invalid input data' },
        { status: 400 }
      )
    }

    // Check if news exists
    const news = await prisma.news.findUnique({
      where: { id: newsId },
    })

    if (!news) {
      return NextResponse.json(
        { error: 'News article not found' },
        { status: 404 }
      )
    }

    // Create comment (approved: false by default, needs admin approval)
    const comment = await prisma.comment.create({
      data: {
        newsId,
        name,
        email,
        content,
        approved: false,
      },
    })

    return NextResponse.json(
      {
        message: 'Comment submitted successfully. It will be visible after approval.',
        comment,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating comment:', error)
    return NextResponse.json(
      { error: 'Failed to create comment' },
      { status: 500 }
    )
  }
}


