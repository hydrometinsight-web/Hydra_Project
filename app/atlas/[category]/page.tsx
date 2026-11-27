import type { Metadata } from 'next'
import Link from 'next/link'
import { SITE_URL, SITE_NAME } from '@/lib/site'
import { notFound } from 'next/navigation'
import { getFacilities, atlasStats, CATEGORIES, findCategory, facilityHref } from '@/lib/atlas'
import AtlasExplorer from '@/components/atlas/AtlasExplorer'

// One page per enabled atlas category, e.g. /atlas/battery-recycling
export function generateStaticParams() {
  return CATEGORIES.filter((c) => c.enabled).map((c) => ({ category: c.id }))
}

const COPY: Record<string, { title: string; description: string; intro: string }> = {
  'battery-recycling': {
    title: 'Battery Recycling Atlas: Plants, Start-ups and Industrial Groups',
    description:
      'Interactive map of lithium-ion battery recycling plants: black mass, hydrometallurgical refining and pre-treatment sites of start-ups and industrial groups, with status, capacity and sources.',
    intro:
      'Where lithium-ion batteries are recycled, and by whom. The map covers pre-treatment, black mass and refining plants run by start-ups and by industrial groups. Each site shows its status and capacity, with public sources.',
  },
}

export function generateMetadata({ params }: { params: { category: string } }): Metadata {
  const cat = findCategory(params.category)
  if (!cat || !cat.enabled) return { title: 'Atlas' }
  const c = COPY[cat.id] || { title: cat.title, description: cat.description }
  return {
    title: c.title,
    description: c.description,
    alternates: { canonical: `/atlas/${cat.id}` },
    openGraph: { title: c.title, description: c.description, url: `${SITE_URL}/atlas/${cat.id}`, type: 'website' },
  }
}

export default function AtlasCategoryPage({ params }: { params: { category: string } }) {
  const cat = findCategory(params.category)
  if (!cat || !cat.enabled) notFound()
  const copy = COPY[cat.id] || { title: cat.title, description: cat.description, intro: cat.description }
  const TITLE = copy.title
  const DESCRIPTION = copy.description
  const facilities = getFacilities(cat.id)
  const stats = atlasStats(facilities)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        name: TITLE,
        description: DESCRIPTION,
        url: `${SITE_URL}/atlas/${cat.id}`,
        isPartOf: { '@type': 'WebSite', name: SITE_NAME, url: SITE_URL },
        dateModified: stats.lastVerified,
        mainEntity: {
          '@type': 'ItemList',
          numberOfItems: facilities.length,
          itemListElement: facilities.map((f, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            url: `${SITE_URL}${facilityHref(f)}`,
            name: f.name,
          })),
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'Atlas', item: `${SITE_URL}/atlas` },
          { '@type': 'ListItem', position: 3, name: cat.title, item: `${SITE_URL}/atlas/${cat.id}` },
        ],
      },
    ],
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="bg-gradient-to-b from-gray-900 to-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#93D419]">
            <Link href="/atlas" className="hover:underline">HydroMetInsight Atlas</Link> · Beta
          </p>
          <h1 className="mt-2 text-3xl md:text-4xl font-bold">{cat.title}</h1>
          <p className="mt-3 max-w-3xl text-gray-300">{copy.intro}</p>
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

        <p className="text-sm text-gray-600">
          Sources are listed on each facility profile. Last checked: {stats.lastVerified}.{' '}
          <Link href="/atlas#how-it-is-built" className="text-lime-700 hover:underline">How the atlas is built</Link>
          {' · '}
          <Link href="/contact" className="text-lime-700 hover:underline">Send a correction</Link>
          {' · '}
          <Link href="/atlas" className="text-lime-700 hover:underline">Other atlas maps</Link>
        </p>
      </main>
    </div>
  )
}
