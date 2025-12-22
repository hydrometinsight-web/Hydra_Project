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

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await verifyToken(request)
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const insight = await prisma.techInsight.findUnique({
      where: { id: params.id },
    })

    if (!insight) {
      return NextResponse.json({ error: 'Tech insight not found' }, { status: 404 })
    }

    return NextResponse.json(insight)
  } catch (error) {
    console.error('Error fetching tech insight:', error)
    return NextResponse.json({ error: 'Failed to fetch tech insight' }, { status: 500 })
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
    const { title, slug, content, excerpt, imageUrl, published } = await request.json()

    if (!title || !slug || !content) {
      return NextResponse.json({ error: 'Title, slug, and content are required' }, { status: 400 })
    }

    const insight = await prisma.techInsight.update({
      where: { id: params.id },
      data: {
        title,
        slug,
        content,
        excerpt: excerpt || null,
        imageUrl: imageUrl || null,
        published: published || false,
      },
    })

    return NextResponse.json(insight)
  } catch (error: any) {
    console.error('Error updating tech insight:', error)
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Tech insight not found' }, { status: 404 })
    }
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Tech insight with this slug already exists' }, { status: 400 })
    }
    return NextResponse.json({ error: 'Failed to update tech insight' }, { status: 500 })
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
    await prisma.techInsight.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: 'Tech insight deleted successfully' })
  } catch (error: any) {
    console.error('Error deleting tech insight:', error)
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Tech insight not found' }, { status: 404 })
    }
    return NextResponse.json({ error: 'Failed to delete tech insight' }, { status: 500 })
  }
}

