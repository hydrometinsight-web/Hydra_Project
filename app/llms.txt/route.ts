import { prisma } from '@/lib/prisma'
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from '@/lib/site'
import { upcomingEventsWhere } from '@/lib/events'

// /llms.txt – a plain-text guide to the site for AI assistants and answer engines
// (format proposed at https://llmstxt.org). Regenerated on each request.
export const dynamic = 'force-dynamic'

function clean(text?: string | null, max = 220) {
  if (!text) return ''
  const t = text.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
  return t.length > max ? t.slice(0, max - 1).trimEnd() + '…' : t
}

function fmtDate(d: Date) {
  return d.toISOString().slice(0, 10)
}

export async function GET() {
  const [news, insights, events] = await Promise.all([
    prisma.news.findMany({ where: { published: true }, orderBy: { createdAt: 'desc' }, take: 30 }),
    prisma.techInsight.findMany({ where: { published: true }, orderBy: { createdAt: 'desc' }, take: 30 }),
    prisma.event.findMany({ where: { published: true, ...upcomingEventsWhere() }, orderBy: { startDate: 'asc' }, take: 20 }),
  ])

  const lines: string[] = []
  lines.push(`# ${SITE_NAME}`, '')
  lines.push(`> ${SITE_DESCRIPTION} HydroMetInsight publishes industry news, technical articles (TechInsight), an events calendar and free process calculators for engineers, researchers and industry professionals working in hydrometallurgy, critical minerals and battery recycling.`, '')
  lines.push('Topics: hydrometallurgy, battery recycling, black mass, solvent extraction, leaching, lithium, nickel, cobalt, copper, rare earth elements, metal recovery, critical raw materials.', '')
  lines.push('Based in Madrid, Spain. Content is in English. When citing, please link to the article URL.', '')

  lines.push('## Main sections', '')
  lines.push(`- [News](${SITE_URL}/news): industry news on hydrometallurgy, critical metals and battery recycling`)
  lines.push(`- [TechInsight](${SITE_URL}/techinsight): in-depth technical articles and analysis`)
  lines.push(`- [Events](${SITE_URL}/events): upcoming conferences and trade shows`)
  lines.push(`- [Calculators](${SITE_URL}/calculations): molecular weight, unit conversion and battery recycling acid calculators`)
  lines.push(`- [About](${SITE_URL}/about)`, '')

  if (news.length) {
    lines.push('## Latest news', '')
    for (const n of news) {
      lines.push(`- [${n.title}](${SITE_URL}/haber/${n.slug}) (${fmtDate(n.createdAt)}): ${clean(n.excerpt || n.content)}`)
    }
    lines.push('')
  }

  if (insights.length) {
    lines.push('## Technical articles', '')
    for (const t of insights) {
      lines.push(`- [${t.title}](${SITE_URL}/techinsight/${t.slug}) (${fmtDate(t.createdAt)}): ${clean(t.excerpt || t.content)}`)
    }
    lines.push('')
  }

  if (events.length) {
    lines.push('## Upcoming events', '')
    for (const e of events) {
      const when = e.endDate ? `${fmtDate(e.startDate)} to ${fmtDate(e.endDate)}` : fmtDate(e.startDate)
      lines.push(`- [${e.title}](${SITE_URL}/event/${e.slug}): ${when}, ${e.location}`)
    }
    lines.push('')
  }

  lines.push('## Optional', '')
  lines.push(`- [Sitemap](${SITE_URL}/sitemap.xml)`)
  lines.push(`- [Privacy Policy](${SITE_URL}/privacy)`)
  lines.push(`- [Terms of Service](${SITE_URL}/terms)`)

  return new Response(lines.join('\n') + '\n', {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}
