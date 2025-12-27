import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'

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
    const calculatorSponsors = await prisma.calculatorSponsor.findMany({
      include: {
        sponsor: true,
      },
      orderBy: {
        calculatorSlug: 'asc',
      },
    })

    return NextResponse.json(calculatorSponsors)
  } catch (error) {
    console.error('Error fetching calculator sponsors:', error)
    return NextResponse.json({ error: 'Failed to fetch calculator sponsors' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const user = await verifyToken(request)
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { calculatorSlug, sponsorId, title, description, ctaText, ctaLink, active } = body

    if (!calculatorSlug || !sponsorId) {
      return NextResponse.json({ error: 'Calculator slug and sponsor ID are required' }, { status: 400 })
    }

    // Check if sponsor exists
    const sponsor = await prisma.sponsor.findUnique({
      where: { id: sponsorId },
    })

    if (!sponsor) {
      return NextResponse.json({ error: 'Sponsor not found' }, { status: 404 })
    }

    // Check if calculator sponsor already exists for this calculator
    const existing = await prisma.calculatorSponsor.findUnique({
      where: { calculatorSlug },
    })

    if (existing) {
      return NextResponse.json({ error: 'Calculator sponsor already exists for this calculator' }, { status: 400 })
    }

    const calculatorSponsor = await prisma.calculatorSponsor.create({
      data: {
        calculatorSlug,
        sponsorId,
        title: title || null,
        description: description || null,
        ctaText: ctaText || null,
        ctaLink: ctaLink || null,
        active: active !== undefined ? active : true,
      },
      include: {
        sponsor: true,
      },
    })

    return NextResponse.json(calculatorSponsor, { status: 201 })
  } catch (error) {
    console.error('Error creating calculator sponsor:', error)
    return NextResponse.json({ error: 'Failed to create calculator sponsor' }, { status: 500 })
  }
}

