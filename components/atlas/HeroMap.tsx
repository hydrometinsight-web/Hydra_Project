import Link from 'next/link'
import { geoEqualEarth, geoPath, geoGraticule10 } from 'd3-geo'
import { feature } from 'topojson-client'
import world from 'world-atlas/countries-110m.json'

// Server-rendered world map for the atlas hub hero: glowing facility dots on a dark map.
const W = 1000
const H = 520
const LAND: any = (() => {
  const fc: any = feature(world as any, (world as any).objects.countries)
  return { ...fc, features: fc.features.filter((f: any) => f.id !== '010') }
})()
const projection = geoEqualEarth().fitExtent([[8, 8], [W - 8, H - 8]], LAND)
const path = geoPath(projection)
const LAND_PATH = path(LAND) || ''
const GRAT_PATH = path(geoGraticule10()) || ''

export default function HeroMap({ points }: { points: { lat: number; lng: number; slug: string; href: string; name: string }[] }) {
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="block w-full h-auto" role="img" aria-label="World map of facilities in the atlas">
      <path d={GRAT_PATH} fill="none" stroke="#0c1422" strokeWidth={0.6} />
      <path d={LAND_PATH} fill="#0f1a2b" stroke="#1d2b42" strokeWidth={0.6} />
      {points.map((p, i) => {
        const xy = projection([p.lng, p.lat])
        if (!xy) return null
        const delay = `${(i % 7) * 0.4}s`
        return (
          <Link key={p.slug} href={p.href} aria-label={p.name}>
            <g>
              <title>{p.name}</title>
              <circle cx={xy[0]} cy={xy[1]} r={6} fill="#93D419" opacity={0.18}>
                <animate attributeName="r" values="6;16;6" dur="3s" begin={delay} repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.25;0.05;0.25" dur="3s" begin={delay} repeatCount="indefinite" />
              </circle>
              <circle cx={xy[0]} cy={xy[1]} r={4} fill="#93D419" stroke="#05080f" strokeWidth={1.2} />
            </g>
          </Link>
        )
      })}
    </svg>
  )
}
