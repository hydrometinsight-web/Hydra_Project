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

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  const user = await verifyToken(request)
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const resolvedParams = await Promise.resolve(params)
    const { id } = resolvedParams
    const body = await request.json()
    const { sponsorId, title, description, ctaText, ctaLink, active } = body

    // Check if calculator sponsor exists
    const existing = await prisma.calculatorSponsor.findUnique({
      where: { id },
    })

    if (!existing) {
      return NextResponse.json({ error: 'Calculator sponsor not found' }, { status: 404 })
    }

    // If sponsorId is being updated, check if sponsor exists
    if (sponsorId && sponsorId !== existing.sponsorId) {
      const sponsor = await prisma.sponsor.findUnique({
        where: { id: sponsorId },
      })

      if (!sponsor) {
        return NextResponse.json({ error: 'Sponsor not found' }, { status: 404 })
      }
    }

    const updateData: any = {}
    if (sponsorId !== undefined) updateData.sponsorId = sponsorId
    if (title !== undefined) updateData.title = title || null
    if (description !== undefined) updateData.description = description || null
    if (ctaText !== undefined) updateData.ctaText = ctaText || null
    if (ctaLink !== undefined) updateData.ctaLink = ctaLink || null
    if (active !== undefined) updateData.active = active

    const calculatorSponsor = await prisma.calculatorSponsor.update({
      where: { id },
      data: updateData,
      include: {
        sponsor: true,
      },
    })

    return NextResponse.json(calculatorSponsor)
  } catch (error) {
    console.error('Error updating calculator sponsor:', error)
    return NextResponse.json({ error: 'Failed to update calculator sponsor' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  const user = await verifyToken(request)
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const resolvedParams = await Promise.resolve(params)
    const { id } = resolvedParams

    await prisma.calculatorSponsor.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Calculator sponsor deleted successfully' })
  } catch (error) {
    console.error('Error deleting calculator sponsor:', error)
    return NextResponse.json({ error: 'Failed to delete calculator sponsor' }, { status: 500 })
  }
}

