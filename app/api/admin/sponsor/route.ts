import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'
import { sanitizeString, validateUrl } from '@/lib/validation'
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
    const sponsors = await prisma.sponsor.findMany({
      orderBy: { createdAt: 'desc' },
    })
    const response = NextResponse.json(sponsors)
    return addSecurityHeaders(response)
  } catch (error) {
    console.error('Error fetching sponsors:', error)
    const response = NextResponse.json({ error: 'Failed to fetch sponsors' }, { status: 500 })
    return addSecurityHeaders(response)
  }
}

export async function POST(request: NextRequest) {
  const user = await verifyToken(request)
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { name, website, logoUrl, description, tier, active } = await request.json()

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }

    // Sanitize inputs
    const sanitizedName = sanitizeString(name, 200)
    const sanitizedWebsite = website ? (validateUrl(website) ? website : null) : null
    const sanitizedLogoUrl = logoUrl ? (validateUrl(logoUrl) ? logoUrl : null) : null
    const sanitizedDescription = description ? sanitizeString(description, 1000) : null
    const sanitizedTier = tier ? sanitizeString(tier, 50) : null

    // Validate name length
    if (sanitizedName.length === 0 || sanitizedName.length > 200) {
      const response = NextResponse.json(
        { error: 'Name must be between 1 and 200 characters' },
        { status: 400 }
      )
      return addSecurityHeaders(response)
    }

    const sponsor = await prisma.sponsor.create({
      data: {
        name: sanitizedName,
        website: sanitizedWebsite,
        logoUrl: sanitizedLogoUrl,
        description: sanitizedDescription,
        tier: sanitizedTier,
        active: active !== undefined ? active : true,
      },
    })

    const response = NextResponse.json(sponsor, { status: 201 })
    return addSecurityHeaders(response)
  } catch (error: any) {
    console.error('Error creating sponsor:', error)
    if (process.env.NODE_ENV === 'development') {
      console.error('Full error:', error)
    }
    
    const response = NextResponse.json({ error: 'Failed to create sponsor' }, { status: 500 })
    return addSecurityHeaders(response)
  }
}

