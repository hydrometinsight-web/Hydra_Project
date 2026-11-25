import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import {
  cleanPath,
  countryFrom,
  deviceFrom,
  isBot,
  referrerHost,
  sectionFor,
  visitorHash,
} from '@/lib/analytics'

export const dynamic = 'force-dynamic'

const DEDUPE_MINUTES = 30
const MAX_VIEWS_PER_VISITOR_PER_DAY = 150

// Records one page view. Cookieless and anonymous; see lib/analytics.ts.
export async function POST(request: NextRequest) {
  try {
    const ua = request.headers.get('user-agent')
    if (isBot(ua)) return NextResponse.json({ counted: false, reason: 'bot' })

    // Only accept beacons sent from our own pages.
    const origin = request.headers.get('origin')
    const host = request.headers.get('host')
    if (origin && host && new URL(origin).host !== host) {
      return NextResponse.json({ counted: false, reason: 'origin' }, { status: 403 })
    }

    const body = await request.json().catch(() => ({}))
    const path = cleanPath(body?.path)
    if (!path) return NextResponse.json({ counted: false, reason: 'path' }, { status: 400 })

    const hash = visitorHash(request)
    const now = Date.now()

    const [recentSame, todayCount] = await Promise.all([
      prisma.pageView.count({
        where: { visitorHash: hash, path, createdAt: { gte: new Date(now - DEDUPE_MINUTES * 60_000) } },
      }),
      prisma.pageView.count({
        where: { visitorHash: hash, createdAt: { gte: new Date(now - 24 * 3600_000) } },
      }),
    ])
    if (recentSame > 0) return NextResponse.json({ counted: false, reason: 'repeat' })
    if (todayCount >= MAX_VIEWS_PER_VISITOR_PER_DAY) {
      return NextResponse.json({ counted: false, reason: 'limit' })
    }

    await prisma.pageView.create({
      data: {
        path,
        section: sectionFor(path),
        country: countryFrom(request),
        visitorHash: hash,
        referrer: referrerHost(body?.referrer, host),
        device: deviceFrom(ua),
      },
    })

    return NextResponse.json({ counted: true })
  } catch (error) {
    console.error('Error tracking page view:', error)
    return NextResponse.json({ error: 'Failed to track page view' }, { status: 500 })
  }
}
