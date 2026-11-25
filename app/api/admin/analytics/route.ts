import { NextRequest, NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'
import jwt from 'jsonwebtoken'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'your-secret-key'

function isAdmin(request: NextRequest) {
  const auth = request.headers.get('authorization')
  if (!auth?.startsWith('Bearer ')) return false
  try {
    const decoded = jwt.verify(auth.slice(7), JWT_SECRET) as { role?: string }
    return decoded.role === 'admin'
  } catch {
    return false
  }
}

function parseDay(value: string | null): Date | null {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null
  const d = new Date(`${value}T00:00:00.000Z`)
  return isNaN(d.getTime()) ? null : d
}

const n = (v: unknown) => Number(v ?? 0)

// Measured analytics for a date range (UTC days, inclusive).
// Every number returned here is counted, never estimated.
export async function GET(request: NextRequest) {
  if (!isAdmin(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const today = new Date(new Date().toISOString().slice(0, 10) + 'T00:00:00.000Z')
  const to = parseDay(searchParams.get('to')) || today
  const from = parseDay(searchParams.get('from')) || new Date(to.getTime() - 29 * 86400_000)
  if (from > to) return NextResponse.json({ error: 'Invalid range' }, { status: 400 })
  const end = new Date(to.getTime() + 86400_000) // exclusive
  const sponsorId = searchParams.get('sponsorId') || null

  const range = Prisma.sql`"createdAt" >= ${from} AND "createdAt" < ${end}`

  try {
    const [
      totals,
      daily,
      bySection,
      byCountry,
      topPages,
      referrers,
      devices,
      sponsorRows,
      sponsors,
      subscribersActive,
      subscribersNew,
      campaigns,
      newsCount,
      insightCount,
      eventCount,
      trackingSince,
    ] = await Promise.all([
      prisma.$queryRaw<any[]>`
        SELECT COUNT(*) AS views,
               COUNT(*) FILTER (WHERE "visitorHash" IS NOT NULL) AS measured_views,
               COUNT(*) FILTER (WHERE "visitorHash" IS NULL) AS legacy_views
        FROM "PageView" WHERE ${range}`,
      prisma.$queryRaw<any[]>`
        SELECT to_char(date_trunc('day', "createdAt"), 'YYYY-MM-DD') AS day,
               COUNT(*) AS views,
               COUNT(DISTINCT "visitorHash") AS visitors
        FROM "PageView" WHERE ${range}
        GROUP BY 1 ORDER BY 1`,
      prisma.$queryRaw<any[]>`
        SELECT "section" AS key, COUNT(*) AS views FROM "PageView" WHERE ${range}
        GROUP BY 1 ORDER BY 2 DESC`,
      prisma.$queryRaw<any[]>`
        SELECT COALESCE("country", '—') AS key, COUNT(*) AS views FROM "PageView" WHERE ${range}
        GROUP BY 1 ORDER BY 2 DESC LIMIT 12`,
      prisma.$queryRaw<any[]>`
        SELECT "path" AS key, COUNT(*) AS views FROM "PageView" WHERE ${range}
        GROUP BY 1 ORDER BY 2 DESC LIMIT 10`,
      prisma.$queryRaw<any[]>`
        SELECT "referrer" AS key, COUNT(*) AS views FROM "PageView"
        WHERE ${range} AND "referrer" IS NOT NULL
        GROUP BY 1 ORDER BY 2 DESC LIMIT 10`,
      prisma.$queryRaw<any[]>`
        SELECT "device" AS key, COUNT(*) AS views FROM "PageView"
        WHERE ${range} AND "device" IS NOT NULL
        GROUP BY 1 ORDER BY 2 DESC`,
      prisma.$queryRaw<any[]>`
        SELECT "sponsorId", "placement", "type", COUNT(*) AS count,
               COUNT(DISTINCT ("visitorHash", to_char("createdAt", 'YYYY-MM-DD'))) AS visitors
        FROM "SponsorEvent" WHERE ${range}
        GROUP BY 1, 2, 3`,
      prisma.sponsor.findMany({ select: { id: true, name: true, logoUrl: true, tier: true, active: true } }),
      prisma.newsletter.count({ where: { active: true } }),
      prisma.newsletter.count({ where: { active: true, createdAt: { gte: from, lt: end } } }),
      prisma.newsletterCampaign.findMany({
        where: { status: 'sent', sentAt: { gte: from, lt: end } },
        select: { subject: true, sentAt: true, recipients: true },
        orderBy: { sentAt: 'asc' },
      }),
      prisma.news.count({ where: { published: true, createdAt: { gte: from, lt: end } } }),
      prisma.techInsight.count({ where: { published: true, createdAt: { gte: from, lt: end } } }),
      prisma.event.count({ where: { published: true, createdAt: { gte: from, lt: end } } }),
      prisma.pageView.findFirst({
        where: { visitorHash: { not: null } },
        orderBy: { createdAt: 'asc' },
        select: { createdAt: true },
      }),
    ])

    // Fill missing days with zeros so charts show the full range.
    const dailyMap = new Map(daily.map((r) => [r.day, r]))
    const series: { day: string; views: number; visitors: number }[] = []
    for (let t = from.getTime(); t < end.getTime(); t += 86400_000) {
      const day = new Date(t).toISOString().slice(0, 10)
      const row = dailyMap.get(day)
      series.push({ day, views: n(row?.views), visitors: n(row?.visitors) })
    }
    const visitors = series.reduce((sum, d) => sum + d.visitors, 0)

    const sponsorStats = sponsors
      .map((s) => {
        const rows = sponsorRows.filter((r) => r.sponsorId === s.id)
        const placements = Array.from(new Set(rows.map((r) => r.placement as string))).map((placement) => {
          const imp = rows.find((r) => r.placement === placement && r.type === 'impression')
          const clk = rows.find((r) => r.placement === placement && r.type === 'click')
          return { placement, impressions: n(imp?.count), clicks: n(clk?.count) }
        })
        const impressions = placements.reduce((a, p) => a + p.impressions, 0)
        const clicks = placements.reduce((a, p) => a + p.clicks, 0)
        const reach = rows.filter((r) => r.type === 'impression').reduce((a, r) => a + n(r.visitors), 0)
        return { ...s, impressions, clicks, reach, ctr: impressions ? clicks / impressions : null, placements }
      })
      .filter((s) => (sponsorId ? s.id === sponsorId : s.active || s.impressions > 0))
      .sort((a, b) => b.impressions - a.impressions)

    const kv = (rows: any[]) => rows.map((r) => ({ key: String(r.key), views: n(r.views) }))

    return NextResponse.json({
      range: { from: from.toISOString().slice(0, 10), to: to.toISOString().slice(0, 10), days: series.length },
      generatedAt: new Date().toISOString(),
      trackingSince: trackingSince?.createdAt?.toISOString() || null,
      traffic: {
        views: n(totals[0]?.views),
        measuredViews: n(totals[0]?.measured_views),
        legacyViews: n(totals[0]?.legacy_views),
        visitors,
        viewsPerVisitor: visitors ? n(totals[0]?.measured_views) / visitors : null,
        daily: series,
        bySection: kv(bySection),
        byCountry: kv(byCountry),
        topPages: kv(topPages),
        referrers: kv(referrers),
        devices: kv(devices),
      },
      sponsors: sponsorStats,
      newsletter: {
        activeSubscribers: subscribersActive,
        newSubscribers: subscribersNew,
        campaignsSent: campaigns.length,
        emailsSent: campaigns.reduce((a, c) => a + (c.recipients || 0), 0),
        campaigns,
      },
      content: { news: newsCount, techInsights: insightCount, events: eventCount },
    })
  } catch (error) {
    console.error('Error building analytics:', error)
    return NextResponse.json({ error: 'Failed to load analytics' }, { status: 500 })
  }
}
