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
    const insights = await prisma.techInsight.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(insights)
  } catch (error) {
    console.error('Error fetching tech insights:', error)
    return NextResponse.json({ error: 'Failed to fetch tech insights' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const user = await verifyToken(request)
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { title, slug, content, excerpt, imageUrl, published } = await request.json()

    if (!title || !slug || !content) {
      return NextResponse.json({ error: 'Title, slug, and content are required' }, { status: 400 })
    }

    const insight = await prisma.techInsight.create({
      data: {
        title,
        slug,
        content,
        excerpt: excerpt || null,
        imageUrl: imageUrl || null,
        published: published || false,
      },
    })

    return NextResponse.json(insight, { status: 201 })
  } catch (error: any) {
    console.error('Error creating tech insight:', error)
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Tech insight with this slug already exists' }, { status: 400 })
    }
    return NextResponse.json({ error: 'Failed to create tech insight' }, { status: 500 })
  }
}

