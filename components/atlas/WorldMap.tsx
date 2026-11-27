'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
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
const K_MIN = 1
const K_MAX = 16
const HIRES_AT = 2.2 // switch to the 1:50m coastline once zoomed in this far

function toCountries(topo: any) {
  const fc: any = feature(topo, topo.objects.countries)
  return { ...fc, features: fc.features.filter((f: any) => f.id !== '010') } // drop Antarctica
}

// Natural Earth 1:110m (public domain) via world-atlas
const COUNTRIES_110 = toCountries(world as any)

function makeProjection(view: MapView): GeoProjection {
  const bbox = VIEWS[view].bbox
  if (!bbox) return geoEqualEarth().fitExtent([[8, 8], [W - 8, H - 8]], COUNTRIES_110)
  const [[x0, y0], [x1, y1]] = bbox
  // Corner points (not a polygon) so winding order cannot invert the fit
  const box = { type: 'MultiPoint', coordinates: [[x0, y0], [x1, y0], [x1, y1], [x0, y1]] }
  return geoMercator().fitExtent([[10, 10], [W - 10, H - 10]], box as any)
}

type T = { k: number; x: number; y: number }
const IDENTITY: T = { k: 1, x: 0, y: 0 }

function clampT(t: T): T {
  const k = Math.min(K_MAX, Math.max(K_MIN, t.k))
  // keep at least a third of the map in view
  const minX = W / 3 - W * k
  const minY = H / 3 - H * k
  return { k, x: Math.min((2 * W) / 3, Math.max(minX, t.x)), y: Math.min((2 * H) / 3, Math.max(minY, t.y)) }
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
  const svgRef = useRef<SVGSVGElement>(null)
  const [hover, setHover] = useState<string | null>(null)
  const [t, setT] = useState<T>(IDENTITY)
  const [dragging, setDragging] = useState(false)
  const [hires, setHires] = useState<any>(null)
  const drag = useRef<{ pointers: Map<number, { x: number; y: number }>; moved: boolean; last?: { x: number; y: number }; dist?: number }>({
    pointers: new Map(),
    moved: false,
  })

  // A preset view resets the zoom
  useEffect(() => setT(IDENTITY), [view])

  // Load the detailed coastline only when someone zooms in
  const wantHires = t.k >= HIRES_AT
  useEffect(() => {
    if (!wantHires || hires) return
    let cancelled = false
    import('world-atlas/countries-50m.json').then((m: any) => {
      if (!cancelled) setHires(toCountries(m.default || m))
    })
    return () => {
      cancelled = true
    }
  }, [wantHires, hires])

  const projection = useMemo(() => makeProjection(view), [view])
  const { land, grat } = useMemo(() => {
    const path = geoPath(projection)
    const countries = wantHires && hires ? hires : COUNTRIES_110
    return { land: path(countries) || '', grat: path(geoGraticule10()) || '' }
  }, [projection, hires, wantHires])

  const points = useMemo(
    () =>
      facilities
        .map((f) => {
          const p = projection([f.lng, f.lat])
          return p ? { f, px: p[0], py: p[1] } : null
        })
        .filter((p): p is { f: Facility; px: number; py: number } => !!p),
    [facilities, projection],
  )

  // client px -> SVG user units
  const toSvg = useCallback((clientX: number, clientY: number) => {
    const r = svgRef.current!.getBoundingClientRect()
    return { x: ((clientX - r.left) / r.width) * W, y: ((clientY - r.top) / r.height) * H }
  }, [])

  const zoomAt = useCallback((factor: number, cx = W / 2, cy = H / 2) => {
    setT((prev) => {
      const k = Math.min(K_MAX, Math.max(K_MIN, prev.k * factor))
      const f = k / prev.k
      return clampT({ k, x: cx - (cx - prev.x) * f, y: cy - (cy - prev.y) * f })
    })
  }, [])

  // Wheel zoom (non-passive so the page does not scroll while zooming the map)
  useEffect(() => {
    const el = svgRef.current
    if (!el) return
    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      const p = toSvg(e.clientX, e.clientY)
      zoomAt(Math.exp(-e.deltaY * 0.0018), p.x, p.y)
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [toSvg, zoomAt])

  const onPointerDown = (e: React.PointerEvent) => {
    ;(e.currentTarget as Element).setPointerCapture(e.pointerId)
    const d = drag.current
    d.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY })
    d.moved = false
    d.last = toSvg(e.clientX, e.clientY)
    setDragging(true)
    if (d.pointers.size === 2) {
      const [a, b] = Array.from(d.pointers.values())
      d.dist = Math.hypot(a.x - b.x, a.y - b.y)
    }
  }
  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current
    if (!d.pointers.has(e.pointerId)) return
    d.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY })
    if (d.pointers.size === 2 && d.dist) {
      // pinch zoom
      const [a, b] = Array.from(d.pointers.values())
      const dist = Math.hypot(a.x - b.x, a.y - b.y)
      const mid = toSvg((a.x + b.x) / 2, (a.y + b.y) / 2)
      zoomAt(dist / d.dist, mid.x, mid.y)
      d.dist = dist
      d.moved = true
      return
    }
    const p = toSvg(e.clientX, e.clientY)
    const dx = p.x - (d.last?.x ?? p.x)
    const dy = p.y - (d.last?.y ?? p.y)
    if (!d.moved && Math.hypot(dx, dy) < 3) return // small jitter still counts as a click
    d.moved = true
    d.last = p
    setT((prev) => clampT({ ...prev, x: prev.x + dx, y: prev.y + dy }))
  }
  const onPointerUp = (e: React.PointerEvent) => {
    const d = drag.current
    d.pointers.delete(e.pointerId)
    if (d.pointers.size < 2) d.dist = undefined
    const rest = Array.from(d.pointers.values())[0]
    if (rest) d.last = toSvg(rest.x, rest.y)
    if (!d.pointers.size) setDragging(false)
  }

  const visible = points
    .map((p) => ({ ...p, x: p.px * t.k + t.x, y: p.py * t.k + t.y }))
    .filter((p) => p.x >= -20 && p.x <= W + 20 && p.y >= -20 && p.y <= H + 20)
  const hovered = visible.find((p) => p.f.slug === hover)
  const markerScale = Math.min(1.6, 1 + Math.log2(t.k) * 0.15)

  return (
    <div className="relative w-full select-none">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        className={`w-full h-auto block touch-none ${dragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        role="img"
        aria-label="Map of battery recycling facilities. Scroll or pinch to zoom, drag to pan."
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onClick={() => {
          if (!drag.current.moved) onSelect(null)
        }}
        onDoubleClick={(e) => {
          const p = toSvg(e.clientX, e.clientY)
          zoomAt(2, p.x, p.y)
        }}
      >
        <rect width={W} height={H} fill="#0b1220" />
        <g transform={`translate(${t.x},${t.y}) scale(${t.k})`}>
          <path d={grat} fill="none" stroke="#1e293b" strokeWidth={0.6} vectorEffect="non-scaling-stroke" />
          <path d={land} fill="#1f2a3d" stroke="#334155" strokeWidth={0.7} vectorEffect="non-scaling-stroke" />
        </g>
        {visible.map(({ f, x, y }) => {
          const base = f.capacity ? Math.max(5, Math.min(13, Math.sqrt(f.capacity.value) / 14)) : 5.5
          const r = base * markerScale
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
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation()
                onSelect(f.slug)
              }}
            >
              <circle r={r + 9} fill="transparent" />
              {(isSel || isHover) && <circle r={r + 5} fill="none" stroke={color} strokeOpacity={0.6} strokeWidth={2} />}
              <circle r={r} fill={color} fillOpacity={0.92} stroke="#0b1220" strokeWidth={1.6} />
              {f.companyType === 'startup' && <circle r={Math.max(1.6, r / 3)} fill="#0b1220" />}
              {t.k >= 3 && (
                <text x={r + 6} y={4} fontSize={12} fill="#e2e8f0" stroke="#0b1220" strokeWidth={3} paintOrder="stroke" style={{ pointerEvents: 'none' }}>
                  {f.company.replace(/ \(.*\)$/, '')}
                </text>
              )}
            </g>
          )
        })}
      </svg>

      {/* Zoom controls */}
      <div className="absolute right-3 top-3 flex flex-col overflow-hidden rounded-md border border-slate-700 bg-slate-900/90 shadow">
        <button type="button" aria-label="Zoom in" onClick={() => zoomAt(1.6)} className="h-8 w-8 text-lg leading-none text-slate-200 hover:bg-slate-700">+</button>
        <button type="button" aria-label="Zoom out" onClick={() => zoomAt(1 / 1.6)} className="h-8 w-8 border-t border-slate-700 text-lg leading-none text-slate-200 hover:bg-slate-700">−</button>
        <button type="button" aria-label="Reset zoom" title="Reset" onClick={() => setT(IDENTITY)} className="h-8 w-8 border-t border-slate-700 text-sm text-slate-200 hover:bg-slate-700">⟲</button>
      </div>

      {hovered && !dragging && (
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
      <div className="pointer-events-none absolute bottom-2 left-3 text-[10px] text-slate-500">
        Scroll or pinch to zoom · drag to pan · Map data: Natural Earth (public domain). Locations are city-level.
      </div>
    </div>
  )
}
