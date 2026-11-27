import type { Metadata } from 'next'
import Link from 'next/link'
import { SITE_URL, SITE_NAME } from '@/lib/site'
import { getFacilities, atlasStats, CATEGORIES } from '@/lib/atlas'
import AtlasExplorer from '@/components/atlas/AtlasExplorer'

const TITLE = 'Battery Recycling Atlas: Plants, Start-ups and Industrial Groups'
const DESCRIPTION =
  'Interactive map of lithium-ion battery recycling plants: black mass, hydrometallurgical refining and pre-treatment sites of start-ups and industrial groups, with status, capacity and sources.'

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: '/atlas' },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}/atlas`, type: 'website' },
}

export default function AtlasPage() {
  const facilities = getFacilities('battery-recycling')
  const stats = atlasStats(facilities)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        name: TITLE,
        description: DESCRIPTION,
        url: `${SITE_URL}/atlas`,
        isPartOf: { '@type': 'WebSite', name: SITE_NAME, url: SITE_URL },
        dateModified: stats.lastVerified,
        mainEntity: {
          '@type': 'ItemList',
          numberOfItems: facilities.length,
          itemListElement: facilities.map((f, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            url: `${SITE_URL}/atlas/${f.slug}`,
            name: f.name,
          })),
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'Atlas', item: `${SITE_URL}/atlas` },
        ],
      },
    ],
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="bg-gradient-to-b from-gray-900 to-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#93D419]">HydroMetInsight Atlas · Beta</p>
          <h1 className="mt-2 text-3xl md:text-4xl font-bold">Battery Recycling Atlas</h1>
          <p className="mt-3 max-w-3xl text-gray-300">
            Where lithium-ion batteries are recycled, and by whom. The map covers pre-treatment, black mass and refining plants run by
            start-ups and by industrial groups. Each site shows its status and capacity, with public sources.
          </p>
          <dl className="mt-6 grid grid-cols-2 sm:grid-cols-5 gap-3">
            {[
              ['Facilities', stats.facilities],
              ['Countries', stats.countries],
              ['Companies', stats.companies],
              ['Operating', stats.operating],
              ['Start-up sites', stats.startups],
            ].map(([k, v]) => (
              <div key={k as string} className="rounded-lg border border-gray-800 bg-gray-900/60 px-4 py-3">
                <dt className="text-xs text-gray-400">{k}</dt>
                <dd className="text-2xl font-bold text-white">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        <AtlasExplorer facilities={facilities} />

        <section className="grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900">How the atlas is built</h2>
            <ul className="mt-3 space-y-2 text-sm text-gray-700 list-disc pl-5">
              <li>Every facility comes from public sources: company releases, regulatory filings and trade press. Sources are listed on each profile.</li>
              <li>Status and capacity are as reported by the company or the cited source. Capacities use different bases (battery feed, black mass or product), so they are labelled and not added up.</li>
              <li>Locations are shown at city level.</li>
              <li>
                Last checked: {stats.lastVerified}. Spotted something out of date?{' '}
                <Link href="/contact" className="text-lime-700 hover:underline">Send us a correction</Link>.
              </li>
            </ul>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900">Coming next</h2>
            <p className="mt-2 text-sm text-gray-700">The atlas will grow into more hydrometallurgy layers on the same map:</p>
            <ul className="mt-3 space-y-2 text-sm">
              {CATEGORIES.map((c) => (
                <li key={c.id} className="flex items-start gap-2">
                  <span className={`mt-1 h-2 w-2 rounded-full ${c.enabled ? 'bg-[#93D419]' : 'bg-gray-300'}`} />
                  <span>
                    <span className="font-semibold text-gray-900">{c.label}</span>
                    <span className="text-gray-500"> · {c.enabled ? 'live' : 'coming soon'}</span>
                    <span className="block text-gray-600">{c.description}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
    </div>
  )
}
