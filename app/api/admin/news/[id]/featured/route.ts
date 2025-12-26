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

export async function PATCH(
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
    let { featuredType } = body

    // Handle empty string as null
    if (featuredType === '' || featuredType === undefined) {
      featuredType = null
    }

    // Validate featuredType
    const validTypes = ['main', 'secondary1', 'secondary2', 'secondary3', null]
    if (featuredType !== null && !validTypes.includes(featuredType)) {
      return NextResponse.json({ error: 'Invalid featured type' }, { status: 400 })
    }

    // Prepare update data
    const updateData: { featuredType: string | null } = {
      featuredType: featuredType,
    }

    // First, update the current news item
    const updatedNews = await prisma.news.update({
      where: { id },
      data: updateData,
    })

    // If setting a featured type, clear it from all other news items
    if (featuredType) {
      // Find all news with the same featuredType
      const allNewsWithType = await prisma.news.findMany({
        where: {
          featuredType: featuredType,
        },
        select: { id: true },
      })

      // Filter out current id and update the rest
      const otherNewsIds = allNewsWithType
        .map(item => item.id)
        .filter(itemId => itemId !== id)

      // Update each one individually (more reliable)
      if (otherNewsIds.length > 0) {
        for (const otherId of otherNewsIds) {
          await prisma.news.update({
            where: { id: otherId },
            data: { featuredType: null },
          })
        }
      }
    }

    return NextResponse.json(updatedNews)
  } catch (error: any) {
    console.error('Error updating featured status:', error)
    
    // Provide more specific error messages
    if (error?.code === 'P2002') {
      return NextResponse.json({ error: 'A news item with this featured type already exists' }, { status: 400 })
    }
    if (error?.code === 'P2025') {
      return NextResponse.json({ error: 'News item not found' }, { status: 404 })
    }
    
    const errorMessage = error?.message || 'Failed to update featured status'
    return NextResponse.json({ 
      error: errorMessage,
      details: process.env.NODE_ENV === 'development' ? String(error) : undefined
    }, { status: 500 })
  }
}

