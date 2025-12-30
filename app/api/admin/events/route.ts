import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'
import { sanitizeString, sanitizeSlug, sanitizeHtml, validateUrl } from '@/lib/validation'
import { addSecurityHeaders } from '@/lib/security'

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
    const events = await prisma.event.findMany({
      orderBy: { startDate: 'asc' },
    })
    const response = NextResponse.json(events)
    return addSecurityHeaders(response)
  } catch (error) {
    console.error('Error fetching events:', error)
    const response = NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 })
    return addSecurityHeaders(response)
  }
}

export async function POST(request: NextRequest) {
  const user = await verifyToken(request)
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { title, slug, description, location, startDate, endDate, imageUrl, website, published } = body

    // Validate required fields
    if (!title || !slug || !description || !location || !startDate) {
      const response = NextResponse.json(
        { error: 'Title, slug, description, location, and startDate are required' },
        { status: 400 }
      )
      return addSecurityHeaders(response)
    }

    // Sanitize and validate inputs
    const sanitizedTitle = sanitizeString(title, 500)
    const sanitizedSlug = sanitizeSlug(slug)
    const sanitizedDescription = sanitizeHtml(description)
    const sanitizedLocation = sanitizeString(location, 200)
    const sanitizedImageUrl = imageUrl ? (validateUrl(imageUrl) ? imageUrl : null) : null
    const sanitizedWebsite = website ? (validateUrl(website) ? website : null) : null

    // Validate lengths
    if (sanitizedTitle.length === 0 || sanitizedTitle.length > 500) {
      const response = NextResponse.json(
        { error: 'Title must be between 1 and 500 characters' },
        { status: 400 }
      )
      return addSecurityHeaders(response)
    }

    if (sanitizedSlug.length === 0 || sanitizedSlug.length > 100) {
      const response = NextResponse.json({ error: 'Invalid slug format' }, { status: 400 })
      return addSecurityHeaders(response)
    }

    if (sanitizedDescription.length === 0 || sanitizedDescription.length > 10000) {
      const response = NextResponse.json(
        { error: 'Description must be between 1 and 10000 characters' },
        { status: 400 }
      )
      return addSecurityHeaders(response)
    }

    // Validate dates
    const start = new Date(startDate)
    if (isNaN(start.getTime())) {
      const response = NextResponse.json({ error: 'Invalid start date' }, { status: 400 })
      return addSecurityHeaders(response)
    }

    const end = endDate ? new Date(endDate) : null
    if (end && isNaN(end.getTime())) {
      const response = NextResponse.json({ error: 'Invalid end date' }, { status: 400 })
      return addSecurityHeaders(response)
    }

    if (end && end < start) {
      const response = NextResponse.json({ error: 'End date must be after start date' }, { status: 400 })
      return addSecurityHeaders(response)
    }

    const event = await prisma.event.create({
      data: {
        title: sanitizedTitle,
        slug: sanitizedSlug,
        description: sanitizedDescription,
        location: sanitizedLocation,
        startDate: start,
        endDate: end,
        imageUrl: sanitizedImageUrl,
        website: sanitizedWebsite,
        published: published === true,
      },
    })

    const response = NextResponse.json(event, { status: 201 })
    return addSecurityHeaders(response)
  } catch (error: any) {
    console.error('Error creating event:', error)
    if (process.env.NODE_ENV === 'development') {
      console.error('Full error:', error)
    }
    
    if (error.code === 'P2002') {
      const response = NextResponse.json({ error: 'Event with this slug already exists' }, { status: 400 })
      return addSecurityHeaders(response)
    }
    
    const response = NextResponse.json({ error: 'Failed to create event' }, { status: 500 })
    return addSecurityHeaders(response)
  }
}

