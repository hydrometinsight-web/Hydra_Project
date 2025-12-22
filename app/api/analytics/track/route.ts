import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { path, section } = await request.json()

    if (!path || !section) {
      return NextResponse.json({ error: 'Path and section are required' }, { status: 400 })
    }

    await prisma.pageView.create({
      data: {
        path,
        section,
      },
    })

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('Error tracking page view:', error)
    return NextResponse.json({ error: 'Failed to track page view' }, { status: 500 })
  }
}

