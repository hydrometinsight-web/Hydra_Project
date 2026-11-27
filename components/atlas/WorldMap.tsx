'use client'

import { useMemo, useState } from 'react'
import { geoEqualEarth, geoMercator, geoPath, geoGraticule10, type GeoProjection } from 'd3-geo'
import { feature } from 'topojson-client'
import world from 'world-atlas/countries-110m.json'
import type { Facility } from '@/lib/atlas/types'
import { STATUS } from '@/lib/atlas/categories'

export type MapView = 'world' | 'europe' | 'north-america' | 'east-asia'

export const VIEWS: Record<MapView, { label: string; bbox?: [[number, number], [number, number]] }> = {
  world: { label: 'World' },
  europe: { label: 'Europe', bbox: [[-11, 44], [31, 66]] },
  'north-america': { label: 'North America', bbox: [[-128, 25], [-65, 52]] },
  'east-asia': { label: 'East Asia', bbox: [[100, 18], [140, 42]] },
}

const W = 1000
const H = 520

// Natural Earth 1:110m (public domain) via world-atlas; Antarctica removed.
const COUNTRIES: any = (() => {
  const fc: any = feature(world as any, (world as any).objects.countries)
  return { ...fc, features: fc.features.filter((f: any) => f.id !== '010') }
})()

function makeProjection(view: MapView): GeoProjection {
  const bbox = VIEWS[view].bbox
  if (!bbox) return geoEqualEarth().fitExtent([[8, 8], [W - 8, H - 8]], COUNTRIES)
  const [[x0, y0], [x1, y1]] = bbox
  const box = {
    type: 'Feature',
    properties: {},
    geometry: { type: 'Polygon', coordinates: [[[x0, y0], [x1, y0], [x1, y1], [x0, y1], [x0, y0]]] },
  }
  return geoMercator().fitExtent([[10, 10], [W - 10, H - 10]], box as any)
}

export default function WorldMap({
  facilities,
  view,
  selected,
  onSelect,
}: {
  facilities: Facility[]
  view: MapView
  selected?: string | null
  onSelect: (slug: string | null) => void
}) {
  const [hover, setHover] = useState<string | null>(null)
  const { land, grat, points } = useMemo(() => {
    const projection = makeProjection(view)
    const path = geoPath(projection)
    const pts = facilities
      .map((f) => {
        const p = projection([f.lng, f.lat])
        return p ? { f, x: p[0], y: p[1] } : null
      })
      .filter((p): p is { f: Facility; x: number; y: number } => !!p && p.x >= -5 && p.x <= W + 5 && p.y >= -5 && p.y <= H + 5)
    return { land: path(COUNTRIES) || '', grat: path(geoGraticule10()) || '', points: pts }
  }, [facilities, view])

  const zoomed = view !== 'world'
  const hovered = points.find((p) => p.f.slug === hover)

  return (
    <div className="relative w-full">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-auto block"
        role="img"
        aria-label="Map of battery recycling facilities"
        onClick={() => onSelect(null)}
      >
        <rect width={W} height={H} fill="#0b1220" />
        <path d={grat} fill="none" stroke="#1e293b" strokeWidth={0.6} />
        <path d={land} fill="#1f2a3d" stroke="#334155" strokeWidth={zoomed ? 0.8 : 0.5} />
        {points.map(({ f, x, y }) => {
          const r = f.capacity ? Math.max(5, Math.min(13, Math.sqrt(f.capacity.value) / 14)) : 5.5
          const isSel = selected === f.slug
          const isHover = hover === f.slug
          const color = STATUS[f.status].color
          return (
            <g
              key={f.slug}
              transform={`translate(${x},${y})`}
              className="cursor-pointer"
              onMouseEnter={() => setHover(f.slug)}
              onMouseLeave={() => setHover(null)}
              onClick={(e) => {
                e.stopPropagation()
                onSelect(f.slug)
              }}
            >
              <circle r={r + 9} fill="transparent" />
              {(isSel || isHover) && <circle r={r + 5} fill="none" stroke={color} strokeOpacity={0.6} strokeWidth={2} />}
              <circle r={r} fill={color} fillOpacity={0.92} stroke="#0b1220" strokeWidth={1.6} />
              {f.companyType === 'startup' && <circle r={Math.max(1.6, r / 3)} fill="#0b1220" />}
            </g>
          )
        })}
      </svg>
      {hovered && (
        <div
          className="pointer-events-none absolute z-10 rounded-md bg-white/95 px-3 py-2 text-xs shadow-lg ring-1 ring-black/5"
          style={{ left: `${(hovered.x / W) * 100}%`, top: `${(hovered.y / H) * 100}%`, transform: 'translate(12px, -110%)' }}
        >
          <div className="font-semibold text-gray-900">{hovered.f.name}</div>
          <div className="text-gray-600">
            {hovered.f.city}, {hovered.f.country} · {STATUS[hovered.f.status].label}
          </div>
        </div>
      )}
      <div className="absolute bottom-2 left-3 text-[10px] text-slate-500">Map data: Natural Earth (public domain). Locations are city-level.</div>
    </div>
  )
}
