import type { Metadata } from 'next'
import Link from 'next/link'
import { FaCarBattery, FaIndustry, FaMagnet, FaFlask, FaArrowRight } from 'react-icons/fa'
import { SITE_URL, SITE_NAME } from '@/lib/site'
import { CATEGORIES, getFacilities, atlasStats } from '@/lib/atlas'
import MiniWorld from '@/components/atlas/MiniWorld'

const TITLE = 'HydroMetInsight Atlas: Maps of Hydrometallurgy and Battery Recycling'
const DESCRIPTION =
  'Interactive maps of the hydrometallurgy industry: battery recycling plants today, with HPAL, rare earth separation and lithium refining layers to follow.'

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: '/atlas' },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}/atlas`, type: 'website' },
}

const ICONS = { battery: FaCarBattery, industry: FaIndustry, magnet: FaMagnet, flask: FaFlask }

export default function AtlasHub() {
  const all = getFacilities()
  const total = atlasStats(all)
  const live = CATEGORIES.filter((c) => c.enabled)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: TITLE,
    description: DESCRIPTION,
    url: `${SITE_URL}/atlas`,
    isPartOf: { '@type': 'WebSite', name: SITE_NAME, url: SITE_URL },
    hasPart: live.map((c) => ({ '@type': 'CollectionPage', name: c.title, url: `${SITE_URL}/atlas/${c.id}` })),
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="bg-gradient-to-b from-gray-900 to-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#93D419]">HydroMetInsight Atlas · Beta</p>
          <h1 className="mt-2 text-3xl md:text-5xl font-bold">The hydrometallurgy industry, mapped</h1>
          <p className="mt-4 max-w-3xl text-lg text-gray-300">
            Plant-by-plant maps of the industries we cover: who operates where, what each site does, how big it is and whether it is
            running. Every entry is sourced and dated.
          </p>
          <div className="mt-6 flex flex-wrap gap-6 text-sm text-gray-400">
            <span><strong className="text-2xl text-white">{total.facilities}</strong> facilities</span>
            <span><strong className="text-2xl text-white">{total.countries}</strong> countries</span>
            <span><strong className="text-2xl text-white">{live.length}</strong> of {CATEGORIES.length} maps live</span>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid gap-6 md:grid-cols-2">
          {CATEGORIES.map((c) => {
            const Icon = ICONS[c.icon]
            const list = c.enabled ? getFacilities(c.id) : []
            const s = atlasStats(list)
            const body = (
              <>
                <div className="relative overflow-hidden bg-[#0b1220]">
                  <MiniWorld points={list} accent={c.accent} muted={!c.enabled} />
                  {!c.enabled && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="rounded-full border border-slate-600 bg-slate-900/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-slate-300">
                        Coming soon
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-lg" style={{ background: `${c.accent}22`, color: c.accent }}>
                      <Icon className="h-5 w-5" />
                    </span>
                    <h2 className="text-xl font-bold text-gray-900">{c.label}</h2>
                    {c.enabled && (
                      <span className="ml-auto rounded-full bg-lime-100 px-2.5 py-0.5 text-xs font-semibold text-lime-800">Live</span>
                    )}
                  </div>
                  <p className="mt-3 text-sm text-gray-600">{c.tagline}</p>
                  {c.enabled ? (
                    <div className="mt-auto flex items-end justify-between pt-5">
                      <div className="flex gap-5 text-sm text-gray-500">
                        <span><strong className="block text-xl text-gray-900">{s.facilities}</strong>facilities</span>
                        <span><strong className="block text-xl text-gray-900">{s.countries}</strong>countries</span>
                        <span><strong className="block text-xl text-gray-900">{s.startups}</strong>start-up sites</span>
                      </div>
                      <span className="inline-flex items-center gap-2 rounded-md bg-gray-900 px-4 py-2 text-sm font-semibold text-white group-hover:bg-gray-700">
                        Open map <FaArrowRight className="h-3 w-3" />
                      </span>
                    </div>
                  ) : (
                    <p className="mt-auto pt-5 text-sm text-gray-500">
                      In preparation.{' '}
                      <Link href="/contact" className="font-medium text-lime-700 hover:underline">Suggest a plant or source</Link>
                    </p>
                  )}
                </div>
              </>
            )
            return c.enabled ? (
              <Link
                key={c.id}
                href={`/atlas/${c.id}`}
                className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
                style={{ borderTop: `4px solid ${c.accent}` }}
              >
                {body}
              </Link>
            ) : (
              <div
                key={c.id}
                className="flex flex-col overflow-hidden rounded-2xl border border-dashed border-gray-300 bg-white/70"
                style={{ borderTop: `4px solid ${c.accent}66` }}
              >
                {body}
              </div>
            )
          })}
        </div>

        <section id="how-it-is-built" className="mt-10 scroll-mt-24 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900">How the atlas is built</h2>
          <ul className="mt-3 grid gap-x-8 gap-y-2 text-sm text-gray-700 list-disc pl-5 md:grid-cols-2">
            <li>Every facility comes from public sources: company releases, regulatory filings and trade press. Sources are listed on each profile.</li>
            <li>Status and capacity are as reported by the company or the cited source. Capacities use different bases (battery feed, black mass or product), so they are labelled and not added up.</li>
            <li>Locations are shown at city level.</li>
            <li>Last checked: {total.lastVerified}. Spotted something out of date? <Link href="/contact" className="text-lime-700 hover:underline">Send us a correction</Link>.</li>
          </ul>
        </section>

        <section className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:flex md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Know a plant we are missing?</h2>
            <p className="mt-1 text-sm text-gray-600">
              Operators, investors and engineers can send new sites, corrections or sources. Each update is checked against public information before it goes on the map.
            </p>
          </div>
          <Link href="/contact" className="mt-4 inline-block shrink-0 rounded-md bg-[#93D419] px-5 py-2.5 text-sm font-semibold text-gray-900 hover:bg-lime-400 md:mt-0">
            Send an update
          </Link>
        </section>
      </main>
    </div>
  )
}
