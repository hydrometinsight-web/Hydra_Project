import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'
import { sanitizeString, validateUrl } from '@/lib/validation'

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
    const sponsor = await prisma.sponsor.findUnique({
      where: { id: params.id },
    })

    if (!sponsor) {
      return NextResponse.json({ error: 'Sponsor not found' }, { status: 404 })
    }

    return NextResponse.json(sponsor)
  } catch (error) {
    console.error('Error fetching sponsor:', error)
    return NextResponse.json({ error: 'Failed to fetch sponsor' }, { status: 500 })
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
    const { name, website, logoUrl, description, tier, active } = await request.json()

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }

    // Check if sponsor exists
    const existing = await prisma.sponsor.findUnique({
      where: { id: params.id },
    })

    if (!existing) {
      return NextResponse.json({ error: 'Sponsor not found' }, { status: 404 })
    }

    // Sanitize inputs
    const sanitizedName = sanitizeString(name, 200)
    const sanitizedWebsite = website ? (validateUrl(website) ? website : null) : null
    const sanitizedLogoUrl = logoUrl ? (validateUrl(logoUrl) ? logoUrl : null) : null
    const sanitizedDescription = description ? sanitizeString(description, 1000) : null
    const sanitizedTier = tier ? sanitizeString(tier, 50) : null

    const sponsor = await prisma.sponsor.update({
      where: { id: params.id },
      data: {
        name: sanitizedName,
        website: sanitizedWebsite,
        logoUrl: sanitizedLogoUrl,
        description: sanitizedDescription,
        tier: sanitizedTier,
        active: active !== undefined ? active : existing.active,
      },
    })

    return NextResponse.json(sponsor)
  } catch (error: any) {
    console.error('Error updating sponsor:', error)
    return NextResponse.json({ error: 'Failed to update sponsor' }, { status: 500 })
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
    const sponsor = await prisma.sponsor.findUnique({
      where: { id: params.id },
    })

    if (!sponsor) {
      return NextResponse.json({ error: 'Sponsor not found' }, { status: 404 })
    }

    await prisma.sponsor.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: 'Sponsor deleted successfully' })
  } catch (error) {
    console.error('Error deleting sponsor:', error)
    return NextResponse.json({ error: 'Failed to delete sponsor' }, { status: 500 })
  }
}

