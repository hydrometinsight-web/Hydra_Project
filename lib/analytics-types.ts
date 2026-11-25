export interface KeyCount {
  key: string
  views: number
}

export interface SponsorStat {
  id: string
  name: string
  logoUrl: string | null
  tier: string | null
  active: boolean
  impressions: number
  clicks: number
  reach: number
  ctr: number | null
  placements: { placement: string; impressions: number; clicks: number }[]
}

export interface AnalyticsReport {
  range: { from: string; to: string; days: number }
  generatedAt: string
  trackingSince: string | null
  traffic: {
    views: number
    measuredViews: number
    legacyViews: number
    visitors: number
    viewsPerVisitor: number | null
    daily: { day: string; views: number; visitors: number }[]
    bySection: KeyCount[]
    byCountry: KeyCount[]
    topPages: KeyCount[]
    referrers: KeyCount[]
    devices: KeyCount[]
  }
  sponsors: SponsorStat[]
  newsletter: {
    activeSubscribers: number
    newSubscribers: number
    campaignsSent: number
    emailsSent: number
    campaigns: { subject: string; sentAt: string; recipients: number }[]
  }
  content: { news: number; techInsights: number; events: number }
}

export const SECTION_LABELS: Record<string, string> = {
  home: 'Home',
  news: 'News',
  techinsight: 'Tech Insights',
  events: 'Events',
  event: 'Events',
  sponsor: 'Sponsors',
  calculators: 'Calculators',
  calculations: 'Calculators',
  questions: 'Q&A',
  other: 'Other pages',
}

export function placementLabel(placement: string): string {
  if (placement === 'home') return 'Homepage sponsor strip'
  if (placement === 'sponsor-page') return 'Sponsors page'
  if (placement.startsWith('calculator:')) {
    const slug = placement.slice('calculator:'.length)
    return `Calculator: ${slug.split('-').map((w) => w[0]?.toUpperCase() + w.slice(1)).join(' ')}`
  }
  return placement
}

export function countryName(code: string): string {
  if (!code || code === '—' || code.length !== 2) return 'Unknown'
  try {
    return new Intl.DisplayNames(['en'], { type: 'region' }).of(code) || code
  } catch {
    return code
  }
}

export const fmt = (v: number) => v.toLocaleString('en-US')
export const pct = (v: number | null, digits = 1) => (v == null ? '—' : `${(v * 100).toFixed(digits)}%`)

export function formatDay(day: string, opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' }) {
  return new Date(`${day}T00:00:00Z`).toLocaleDateString('en-GB', { ...opts, timeZone: 'UTC' })
}

export const METHODOLOGY = [
  'All figures are measured on hydrometinsight.com by first-party, cookieless analytics. Nothing in this report is estimated or modelled.',
  'Page views: one view per page opened. Known bots and crawlers are excluded, a repeat of the same page by the same visitor within 30 minutes counts once, and site administrators are not counted.',
  'Visitors: unique visitors per day, summed over the period. Visitor ids are anonymous hashes that change daily; no cookies or IP addresses are stored, so the same person on two days counts twice.',
  'Sponsor impressions: a sponsor logo counts as seen when at least half of it is on screen for one second, at most once per visitor and placement every 30 minutes. Clicks are counted on the sponsor link.',
  'Country comes from the visitor\'s network location as reported by the hosting provider (Vercel).',
]
