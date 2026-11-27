import { geoEqualEarth, geoPath } from 'd3-geo'
import { feature } from 'topojson-client'
import world from 'world-atlas/countries-110m.json'

// Small static world map (server-rendered) used on atlas hub cards.
const W = 480
const H = 250
const LAND: any = (() => {
  const fc: any = feature(world as any, (world as any).objects.countries)
  return { ...fc, features: fc.features.filter((f: any) => f.id !== '010') }
})()
const projection = geoEqualEarth().fitExtent([[4, 4], [W - 4, H - 4]], LAND)
const LAND_PATH = geoPath(projection)(LAND) || ''

export default function MiniWorld({ points, accent, muted = false }: { points: { lat: number; lng: number }[]; accent: string; muted?: boolean }) {
  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMin slice" className="block h-44 w-full" aria-hidden="true">
      <path d={LAND_PATH} fill={muted ? '#1a2333' : '#1f2a3d'} stroke="#2b384d" strokeWidth={0.5} />
      {points.map((p, i) => {
        const xy = projection([p.lng, p.lat])
        if (!xy) return null
        return (
          <g key={i}>
            <circle cx={xy[0]} cy={xy[1]} r={7} fill={accent} fillOpacity={0.18} />
            <circle cx={xy[0]} cy={xy[1]} r={3.2} fill={accent} stroke="#0b1220" strokeWidth={1} />
          </g>
        )
      })}
    </svg>
  )
}
