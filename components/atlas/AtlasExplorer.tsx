'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import WorldMap, { VIEWS, type MapView } from './WorldMap'
import type { CompanyType, Facility, FacilityStatus, ProcessStep, Region } from '@/lib/atlas/types'
import { COMPANY_TYPE, PROCESS, STATUS } from '@/lib/atlas/categories'

function toggle<T>(set: Set<T>, v: T) {
  const n = new Set(set)
  n.has(v) ? n.delete(v) : n.add(v)
  return n
}

function Chip({ active, onClick, children, dot }: { active: boolean; onClick: () => void; children: React.ReactNode; dot?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
        active ? 'border-gray-900 bg-gray-900 text-white' : 'border-gray-300 bg-white text-gray-700 hover:border-gray-500'
      }`}
    >
      {dot && <span className="h-2 w-2 rounded-full" style={{ background: dot }} />}
      {children}
    </button>
  )
}

function capacityText(f: Facility) {
  if (!f.capacity) return '—'
  return `${f.capacity.value.toLocaleString('en-US')} ${f.capacity.unit}`
}

export default function AtlasExplorer({ facilities }: { facilities: Facility[] }) {
  const [view, setView] = useState<MapView>('world')
  const [status, setStatus] = useState<Set<FacilityStatus>>(new Set())
  const [ctype, setCtype] = useState<Set<CompanyType>>(new Set())
  const [proc, setProc] = useState<Set<ProcessStep>>(new Set())
  const [region, setRegion] = useState<Set<Region>>(new Set())
  const [q, setQ] = useState('')
  const [selected, setSelected] = useState<string | null>(null)

  const present = useMemo(() => {
    const s = new Set(facilities.map((f) => f.status))
    const r = new Set(facilities.map((f) => f.region))
    const p = new Set(facilities.flatMap((f) => f.processes))
    return {
      status: (Object.keys(STATUS) as FacilityStatus[]).filter((k) => s.has(k)),
      region: Array.from(r).sort() as Region[],
      process: (Object.keys(PROCESS) as ProcessStep[]).filter((k) => p.has(k)),
    }
  }, [facilities])

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase()
    return facilities.filter(
      (f) =>
        (!status.size || status.has(f.status)) &&
        (!ctype.size || ctype.has(f.companyType)) &&
        (!region.size || region.has(f.region)) &&
        (!proc.size || f.processes.some((p) => proc.has(p))) &&
        (!term || [f.name, f.company, f.parent, f.city, f.country].join(' ').toLowerCase().includes(term)),
    )
  }, [facilities, status, ctype, proc, region, q])

  const sel = filtered.find((f) => f.slug === selected) || null
  const anyFilter = status.size || ctype.size || proc.size || region.size || q

  return (
    <div className="space-y-5">
      {/* Filters */}
      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="w-20 text-xs font-semibold uppercase tracking-wide text-gray-500">Status</span>
          {present.status.map((s) => (
            <Chip key={s} active={status.has(s)} onClick={() => setStatus(toggle(status, s))} dot={STATUS[s].color}>
              {STATUS[s].label}
            </Chip>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="w-20 text-xs font-semibold uppercase tracking-wide text-gray-500">Company</span>
          {(Object.keys(COMPANY_TYPE) as CompanyType[])
            .filter((c) => facilities.some((f) => f.companyType === c))
            .map((c) => (
              <Chip key={c} active={ctype.has(c)} onClick={() => setCtype(toggle(ctype, c))}>
                {COMPANY_TYPE[c].label}
              </Chip>
            ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="w-20 text-xs font-semibold uppercase tracking-wide text-gray-500">Process</span>
          {present.process.map((p) => (
            <Chip key={p} active={proc.has(p)} onClick={() => setProc(toggle(proc, p))}>
              {PROCESS[p]}
            </Chip>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="w-20 text-xs font-semibold uppercase tracking-wide text-gray-500">Region</span>
          {present.region.map((r) => (
            <Chip
              key={r}
              active={region.has(r)}
              onClick={() => {
                const next = toggle(region, r)
                setRegion(next)
                // Follow a single selected region with the matching map view
                const only = next.size === 1 ? Array.from(next)[0] : null
                setView(only === 'Europe' ? 'europe' : only === 'North America' ? 'north-america' : only === 'Asia' ? 'east-asia' : 'world')
              }}
            >
              {r}
            </Chip>
          ))}
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search company, city, country…"
            className="ml-auto w-full sm:w-64 rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-gray-900 focus:outline-none"
            aria-label="Search facilities"
          />
        </div>
        {anyFilter ? (
          <button
            type="button"
            className="text-xs text-lime-700 hover:underline"
            onClick={() => {
              setStatus(new Set()); setCtype(new Set()); setProc(new Set()); setRegion(new Set()); setQ('')
            }}
          >
            Clear filters
          </button>
        ) : null}
      </div>

      {/* Map + detail card */}
      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <div className="overflow-hidden rounded-xl border border-gray-800 bg-[#0b1220] shadow-sm">
          <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 px-3 py-2">
            {(Object.keys(VIEWS) as MapView[]).map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setView(v)}
                className={`rounded-md px-2.5 py-1 text-xs font-medium ${view === v ? 'bg-[#93D419] text-gray-900' : 'text-slate-300 hover:text-white'}`}
              >
                {VIEWS[v].label}
              </button>
            ))}
            <span className="ml-auto text-xs text-slate-400">
              {filtered.length} of {facilities.length} facilities
            </span>
          </div>
          <WorldMap facilities={filtered} view={view} selected={selected} onSelect={setSelected} />
          <div className="flex flex-wrap gap-x-4 gap-y-1 border-t border-slate-800 px-3 py-2 text-[11px] text-slate-300">
            {present.status.map((s) => (
              <span key={s} className="inline-flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: STATUS[s].color }} />
                {STATUS[s].label}
              </span>
            ))}
            <span className="inline-flex items-center gap-1.5">
              <span className="relative inline-block h-2.5 w-2.5 rounded-full bg-slate-300">
                <span className="absolute inset-[3px] rounded-full bg-[#0b1220]" />
              </span>
              Start-up (hollow centre)
            </span>
            <span>Dot size: listed capacity</span>
          </div>
        </div>

        <aside className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          {sel ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-medium">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: STATUS[sel.status].color }} />
                {STATUS[sel.status].label}
                <span className="text-gray-400">·</span>
                <span className="text-gray-600">{COMPANY_TYPE[sel.companyType].label}</span>
              </div>
              <h3 className="text-lg font-bold leading-snug text-gray-900">{sel.name}</h3>
              <p className="text-sm text-gray-600">
                {sel.company}
                {sel.parent && sel.parent !== sel.company ? ` · part of ${sel.parent}` : ''}
              </p>
              <p className="text-sm text-gray-600">{sel.city}, {sel.country}</p>
              <p className="text-sm text-gray-800">{sel.summary}</p>
              <dl className="grid grid-cols-2 gap-2 text-xs">
                <div><dt className="text-gray-500">Capacity</dt><dd className="font-medium text-gray-900">{capacityText(sel)}</dd></div>
                <div><dt className="text-gray-500">Start</dt><dd className="font-medium text-gray-900">{sel.startYear || '—'}</dd></div>
              </dl>
              <Link href={`/atlas/${sel.slug}`} className="inline-block rounded-md bg-gray-900 px-3 py-2 text-xs font-semibold text-white hover:bg-gray-700">
                Facility profile →
              </Link>
            </div>
          ) : (
            <div className="space-y-2 text-sm text-gray-600">
              <h3 className="text-base font-semibold text-gray-900">Explore the map</h3>
              <p>Select a dot to see the facility, its owner, process and capacity.</p>
              <p>Use the filters to compare start-ups with corporate groups, or to show only plants that are operating.</p>
            </div>
          )}
        </aside>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
            <tr>
              <th className="px-4 py-3">Facility</th>
              <th className="px-4 py-3">Company</th>
              <th className="px-4 py-3">Location</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Capacity</th>
              <th className="px-4 py-3">Process</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((f) => (
              <tr key={f.slug} className={`hover:bg-lime-50/50 ${selected === f.slug ? 'bg-lime-50' : ''}`} onMouseEnter={() => setSelected(f.slug)}>
                <td className="px-4 py-3 font-medium">
                  <Link href={`/atlas/${f.slug}`} className="text-gray-900 hover:text-lime-700 hover:underline">{f.name}</Link>
                </td>
                <td className="px-4 py-3 text-gray-700">
                  {f.company}
                  <div className="text-xs text-gray-500">{COMPANY_TYPE[f.companyType].label}{f.parent && f.parent !== f.company ? ` · ${f.parent}` : ''}</div>
                </td>
                <td className="px-4 py-3 text-gray-700">{f.city}<div className="text-xs text-gray-500">{f.country}</div></td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-800">
                    <span className="h-2 w-2 rounded-full" style={{ background: STATUS[f.status].color }} />
                    {STATUS[f.status].label}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-700 whitespace-nowrap">
                  {capacityText(f)}
                  {f.capacity && <div className="text-xs text-gray-500">{f.capacity.basis}</div>}
                </td>
                <td className="px-4 py-3 text-xs text-gray-600">{f.processes.map((p) => PROCESS[p]).join(' · ')}</td>
              </tr>
            ))}
            {!filtered.length && (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-500">No facilities match these filters.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
