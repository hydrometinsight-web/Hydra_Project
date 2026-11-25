import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { cleanPath, countryFrom, isBot, visitorHash } from '@/lib/analytics'

export const dynamic = 'force-dynamic'

const PLACEMENT = /^(home|sponsor-page|calculator:[a-z0-9-]{1,60})$/
// One impression per visitor, sponsor and placement per 30 minutes;
// repeated clicks within 1 minute count once.
const DEDUPE_MS = { impression: 30 * 60_000, click: 60_000 } as const

export async function POST(request: NextRequest) {
  try {
    if (isBot(request.headers.get('user-agent'))) return NextResponse.json({ counted: false })

    const origin = request.headers.get('origin')
    const host = request.headers.get('host')
    if (origin && host && new URL(origin).host !== host) {
      return NextResponse.json({ counted: false }, { status: 403 })
    }

    const body = await request.json().catch(() => ({}))
    const type = body?.type === 'click' ? 'click' : body?.type === 'impression' ? 'impression' : null
    const placement = typeof body?.placement === 'string' && PLACEMENT.test(body.placement) ? body.placement : null
    const sponsorId = typeof body?.sponsorId === 'string' && body.sponsorId.length < 60 ? body.sponsorId : null
    if (!type || !placement || !sponsorId) return NextResponse.json({ counted: false }, { status: 400 })

    const sponsor = await prisma.sponsor.findFirst({ where: { id: sponsorId, active: true }, select: { id: true } })
    if (!sponsor) return NextResponse.json({ counted: false }, { status: 404 })

    const hash = visitorHash(request)
    const recent = await prisma.sponsorEvent.count({
      where: {
        visitorHash: hash,
        sponsorId,
        placement,
        type,
        createdAt: { gte: new Date(Date.now() - DEDUPE_MS[type]) },
      },
    })
    if (recent > 0) return NextResponse.json({ counted: false, reason: 'repeat' })

    await prisma.sponsorEvent.create({
      data: {
        sponsorId,
        placement,
        type,
        path: cleanPath(body?.path),
        country: countryFrom(request),
        visitorHash: hash,
      },
    })
    return NextResponse.json({ counted: true })
  } catch (error) {
    console.error('Error tracking sponsor event:', error)
    return NextResponse.json({ error: 'Failed to track' }, { status: 500 })
  }
}
