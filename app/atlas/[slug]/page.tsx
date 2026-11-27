import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { format } from 'date-fns'
import { enUS } from 'date-fns/locale'
import { geoMercator, geoPath } from 'd3-geo'
import { feature } from 'topojson-client'
import world from 'world-atlas/countries-110m.json'
import { prisma } from '@/lib/prisma'
import { SITE_URL } from '@/lib/site'
import { getFacilities, getFacility, formatCapacity, STATUS, COMPANY_TYPE, PROCESS, categoryById } from '@/lib/atlas'

export const revalidate = 600

export function generateStaticParams() {
  return getFacilities().map((f) => ({ slug: f.slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const f = getFacility(params.slug)
  if (!f) return { title: 'Facility not found' }
  const title = `${f.name} – ${f.company}`
  const description = `${STATUS[f.status].label} ${categoryById(f.category).label.toLowerCase()} facility in ${f.city}, ${f.country}. ${f.summary}`.slice(0, 300)
  return {
    title,
    description,
    alternates: { canonical: `/atlas/${f.slug}` },
    openGraph: { title, description, url: `${SITE_URL}/atlas/${f.slug}`, type: 'article' },
  }
}

async function relatedNews(keywords: string[] = []) {
  if (!keywords.length) return []
  try {
    return await prisma.news.findMany({
      where: {
        published: true,
        OR: keywords.flatMap((k) => [
          { title: { contains: k, mode: 'insensitive' as const } },
          { excerpt: { contains: k, mode: 'insensitive' as const } },
        ]),
      },
      orderBy: { createdAt: 'desc' },
      take: 4,
      select: { title: true, slug: true, createdAt: true },
    })
  } catch {
    return []
  }
}

function MiniMap({ lat, lng }: { lat: number; lng: number }) {
  const countries: any = feature(world as any, (world as any).objects.countries)
  const W = 360, H = 220
  const projection = geoMercator().center([lng, lat]).scale(900).translate([W / 2, H / 2])
  const path = geoPath(projection)
  const [x, y] = projection([lng, lat]) || [W / 2, H / 2]
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto rounded-lg" role="img" aria-label="Location map">
      <rect width={W} height={H} fill="#0b1220" />
      <path d={path(countries) || ''} fill="#1f2a3d" stroke="#334155" strokeWidth={0.6} />
      <circle cx={x} cy={y} r={14} fill="#93D419" fillOpacity={0.18} />
      <circle cx={x} cy={y} r={6} fill="#93D419" stroke="#0b1220" strokeWidth={2} />
    </svg>
  )
}

export default async function FacilityPage({ params }: { params: { slug: string } }) {
  const f = getFacility(params.slug)
  if (!f) notFound()
  const news = await relatedNews(f.newsKeywords)
  const siblings = getFacilities(f.category).filter((o) => o.slug !== f.slug && (o.parent || o.company) === (f.parent || f.company))
  const cap = formatCapacity(f)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Place',
        name: f.name,
        description: f.summary,
        url: `${SITE_URL}/atlas/${f.slug}`,
        geo: { '@type': 'GeoCoordinates', latitude: f.lat, longitude: f.lng },
        address: { '@type': 'PostalAddress', addressLocality: f.city, addressCountry: f.countryCode },
        ...(f.website ? { sameAs: [f.website] } : {}),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'Atlas', item: `${SITE_URL}/atlas` },
          { '@type': 'ListItem', position: 3, name: f.name, item: `${SITE_URL}/atlas/${f.slug}` },
        ],
      },
    ],
  }

  const facts: [string, React.ReactNode][] = [
    ['Company', <>{f.company}{f.parent && f.parent !== f.company ? <span className="text-gray-500"> · part of {f.parent}</span> : null}</>],
    ['Company type', COMPANY_TYPE[f.companyType].label],
    ['Status', <span key="s" className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full" style={{ background: STATUS[f.status].color }} />{STATUS[f.status].label}</span>],
    ['Location', `${f.city}, ${f.country}`],
    ['Process', f.processes.map((p) => PROCESS[p]).join(' · ')],
    ['Capacity', cap ? <>{cap}{f.capacity?.note ? <span className="block text-xs text-gray-500">{f.capacity.note}</span> : null}</> : 'Not disclosed'],
    ['Start of operations', f.startYear ? String(f.startYear) : '—'],
    ['Last checked', f.lastVerified],
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <nav className="text-sm text-gray-500">
          <Link href="/atlas" className="text-lime-700 hover:underline">← Battery Recycling Atlas</Link>
        </nav>

        <div className="mt-4 grid gap-6 lg:grid-cols-[1fr_360px]">
          <article className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-lime-700">{categoryById(f.category).label}</p>
            <h1 className="mt-1 text-3xl font-bold text-gray-900">{f.name}</h1>
            <p className="mt-3 text-gray-700 leading-relaxed">{f.summary}</p>
            {f.statusNote && (
              <p className="mt-3 rounded-md border-l-4 border-amber-400 bg-amber-50 px-3 py-2 text-sm text-amber-900">{f.statusNote}</p>
            )}

            <dl className="mt-6 divide-y divide-gray-100 border-t border-gray-100 text-sm">
              {facts.map(([k, v]) => (
                <div key={k} className="grid grid-cols-3 gap-4 py-2.5">
                  <dt className="text-gray-500">{k}</dt>
                  <dd className="col-span-2 text-gray-900">{v}</dd>
                </div>
              ))}
            </dl>

            <h2 className="mt-8 text-lg font-bold text-gray-900">Sources</h2>
            <ul className="mt-2 space-y-1.5 text-sm">
              {f.sources.map((s) => (
                <li key={s.url}>
                  <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-lime-700 hover:underline">{s.title}</a>
                  {s.date ? <span className="text-gray-500"> · {s.date}</span> : null}
                </li>
              ))}
            </ul>
            {f.website && (
              <p className="mt-4 text-sm">
                Company website:{' '}
                <a href={f.website} target="_blank" rel="noopener noreferrer" className="text-lime-700 hover:underline">{f.website.replace(/^https?:\/\//, '')}</a>
              </p>
            )}
          </article>

          <aside className="space-y-4">
            <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
              <MiniMap lat={f.lat} lng={f.lng} />
              <p className="mt-2 text-xs text-gray-500">City-level location. Map data: Natural Earth.</p>
            </div>

            {news.length > 0 && (
              <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                <h2 className="text-sm font-bold uppercase tracking-wide text-gray-900">On HydroMetInsight</h2>
                <ul className="mt-3 space-y-3">
                  {news.map((n: { title: string; slug: string; createdAt: Date }) => (
                    <li key={n.slug}>
                      <Link href={`/haber/${n.slug}`} className="text-sm font-medium text-gray-900 hover:text-lime-700">{n.title}</Link>
                      <div className="text-xs text-gray-500">{format(n.createdAt, 'd MMM yyyy', { locale: enUS })}</div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {siblings.length > 0 && (
              <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                <h2 className="text-sm font-bold uppercase tracking-wide text-gray-900">Other {f.parent || f.company} sites</h2>
                <ul className="mt-3 space-y-2 text-sm">
                  {siblings.map((o) => (
                    <li key={o.slug}>
                      <Link href={`/atlas/${o.slug}`} className="text-gray-900 hover:text-lime-700">{o.name}</Link>
                      <span className="text-gray-500"> · {STATUS[o.status].label}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="rounded-xl border border-gray-200 bg-white p-4 text-sm text-gray-700 shadow-sm">
              Is this profile out of date? <Link href="/contact" className="text-lime-700 hover:underline">Send a correction</Link>.
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
