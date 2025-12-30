import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { rateLimit, getClientIdentifier } from '@/lib/rateLimit'
import { sanitizeString, sanitizeEmail, sanitizeHtml } from '@/lib/validation'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const { id: parentId } = params
    const body = await request.json()
    let { name, email, content } = body

    // Validation
    if (!name || !email || !content) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Check if parent comment exists
    const parentComment = await prisma.comment.findUnique({
      where: { id: parentId },
      include: { news: true },
    })

    if (!parentComment) {
      return NextResponse.json(
        { error: 'Parent comment not found' },
        { status: 404 }
      )
    }

    // Sanitize inputs
    name = sanitizeString(name, 100)
    email = sanitizeEmail(email)
    content = sanitizeHtml(sanitizeString(content, 2000))

    if (!name || !email || !content) {
      return NextResponse.json(
        { error: 'Invalid input data' },
        { status: 400 }
      )
    }

    // Create reply comment
    const reply = await prisma.comment.create({
      data: {
        newsId: parentComment.newsId,
        parentId: parentId,
        name,
        email,
        content,
        approved: false, // Replies also need approval
      },
    })

    return NextResponse.json(
      {
        message: 'Reply submitted successfully. It will be visible after approval.',
        comment: reply,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating reply:', error)
    return NextResponse.json(
      { error: 'Failed to create reply' },
      { status: 500 }
    )
  }
}

