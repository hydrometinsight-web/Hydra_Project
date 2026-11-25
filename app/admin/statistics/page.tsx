'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { AnalyticsReport, KeyCount } from '@/lib/analytics-types'
import { METHODOLOGY, SECTION_LABELS, countryName, fmt, formatDay, pct, placementLabel } from '@/lib/analytics-types'

type Preset = '7d' | '30d' | 'this-month' | 'last-month' | '90d' | 'custom'

const PRESETS: { id: Preset; label: string }[] = [
  { id: '7d', label: 'Last 7 days' },
  { id: '30d', label: 'Last 30 days' },
  { id: 'this-month', label: 'This month' },
  { id: 'last-month', label: 'Last month' },
  { id: '90d', label: 'Last 90 days' },
  { id: 'custom', label: 'Custom' },
]

const iso = (d: Date) => d.toISOString().slice(0, 10)

function rangeFor(preset: Preset): { from: string; to: string } {
  const now = new Date()
  const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()))
  const minus = (days: number) => new Date(today.getTime() - days * 86400_000)
  switch (preset) {
    case '7d':
      return { from: iso(minus(6)), to: iso(today) }
    case 'this-month':
      return { from: iso(new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), 1))), to: iso(today) }
    case 'last-month': {
      const first = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth() - 1, 1))
      const last = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), 0))
      return { from: iso(first), to: iso(last) }
    }
    case '90d':
      return { from: iso(minus(89)), to: iso(today) }
    default:
      return { from: iso(minus(29)), to: iso(today) }
  }
}

export default function StatisticsPage() {
  const router = useRouter()
  const [preset, setPreset] = useState<Preset>('30d')
  const [range, setRange] = useState(rangeFor('30d'))
  const [sponsorId, setSponsorId] = useState('')
  const [report, setReport] = useState<AnalyticsReport | null>(null)
  const [sponsorList, setSponsorList] = useState<{ id: string; name: string }[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pdfBusy, setPdfBusy] = useState(false)

  const load = useCallback(async () => {
    const token = localStorage.getItem('adminToken')
    if (!token) {
      router.push('/admin')
      return
    }
    setLoading(true)
    setError(null)
    try {
      const qs = new URLSearchParams({ from: range.from, to: range.to })
      if (sponsorId) qs.set('sponsorId', sponsorId)
      const res = await fetch(`/api/admin/analytics?${qs}`, { headers: { Authorization: `Bearer ${token}` } })
      if (res.status === 401 || res.status === 403) {
        localStorage.removeItem('adminToken')
        router.push('/admin')
        return
      }
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setReport(data)
      if (!sponsorId) setSponsorList(data.sponsors.map((s: any) => ({ id: s.id, name: s.name })))
    } catch (e: any) {
      setError(e?.message || 'Could not load statistics')
    } finally {
      setLoading(false)
    }
  }, [range, sponsorId, router])

  useEffect(() => {
    load()
  }, [load])

  const selectPreset = (p: Preset) => {
    setPreset(p)
    if (p !== 'custom') setRange(rangeFor(p))
  }

  const sponsor = sponsorId && report ? report.sponsors.find((s) => s.id === sponsorId) || null : null

  const downloadPdf = async () => {
    if (!report) return
    setPdfBusy(true)
    try {
      const { downloadReportPdf } = await import('@/lib/report-pdf')
      await downloadReportPdf(report, { sponsorName: sponsor?.name || null })
    } finally {
      setPdfBusy(false)
    }
  }

  return (
    <div className="p-6 max-w-7xl">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Statistics</h1>
          <p className="text-sm text-gray-500 mt-1">
            Measured, first-party data. Nothing on this page is estimated.
          </p>
        </div>
        <button
          onClick={downloadPdf}
          disabled={!report || pdfBusy}
          className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-50"
        >
          <svg className="h-4 w-4 text-[#93D419]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v12m0 0l-4-4m4 4l4-4M4 20h16" />
          </svg>
          {pdfBusy ? 'Preparing PDF…' : sponsor ? `Download ${sponsor.name} report (PDF)` : 'Download report (PDF)'}
        </button>
      </div>

      {/* Filters: one row */}
      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-gray-200 bg-white p-3 mb-6">
        <div className="flex flex-wrap gap-1">
          {PRESETS.map((p) => (
            <button
              key={p.id}
              onClick={() => selectPreset(p.id)}
              className={`rounded-md px-3 py-1.5 text-sm font-medium ${
                preset === p.id ? 'bg-gray-900 text-white' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
        {preset === 'custom' && (
          <div className="flex items-center gap-2 text-sm">
            <input
              type="date"
              value={range.from}
              max={range.to}
              onChange={(e) => e.target.value && setRange((r) => ({ ...r, from: e.target.value }))}
              className="rounded-md border border-gray-300 px-2 py-1 text-gray-900"
            />
            <span className="text-gray-500">to</span>
            <input
              type="date"
              value={range.to}
              min={range.from}
              onChange={(e) => e.target.value && setRange((r) => ({ ...r, to: e.target.value }))}
              className="rounded-md border border-gray-300 px-2 py-1 text-gray-900"
            />
          </div>
        )}
        <div className="ml-auto flex items-center gap-2 text-sm">
          <label htmlFor="sponsor" className="text-gray-600">Report for</label>
          <select
            id="sponsor"
            value={sponsorId}
            onChange={(e) => setSponsorId(e.target.value)}
            className="rounded-md border border-gray-300 px-2 py-1.5 text-gray-900"
          >
            <option value="">Whole site</option>
            {sponsorList.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>
      </div>

      {error && <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>}

      {loading && !report ? (
        <div className="flex h-64 items-center justify-center text-gray-500">Loading…</div>
      ) : report ? (
        <div className={loading ? 'opacity-60 transition-opacity' : ''}>
          <p className="mb-4 text-sm text-gray-500">
            {formatDay(report.range.from)} – {formatDay(report.range.to)} · {report.range.days} days (UTC)
          </p>

          {report.traffic.legacyViews > 0 && (
            <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
              <strong>Mixed data in this period.</strong> {fmt(report.traffic.legacyViews)} page views come from the
              earlier counter, which only counted visitors who accepted analytics cookies and could not tell visitors
              apart. They are included in page views but not in visitors.
              {report.trackingSince && <> The new counter has been running since {formatDay(report.trackingSince.slice(0, 10))}.</>}
            </div>
          )}

          {sponsor && (
            <Section title={`Sponsor performance: ${sponsor.name}`}>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
                <Tile label="Impressions" value={fmt(sponsor.impressions)} note="Logo seen on screen" />
                <Tile label="Reach" value={fmt(sponsor.reach)} note="Unique visitors per day" />
                <Tile label="Clicks" value={fmt(sponsor.clicks)} note="Sponsor link clicks" />
                <Tile label="Click-through rate" value={pct(sponsor.ctr)} note="Clicks ÷ impressions" />
              </div>
              <SimpleTable
                columns={['Placement', 'Impressions', 'Clicks', 'CTR']}
                rows={sponsor.placements.map((p) => [
                  placementLabel(p.placement),
                  fmt(p.impressions),
                  fmt(p.clicks),
                  pct(p.impressions ? p.clicks / p.impressions : null),
                ])}
              />
            </Section>
          )}

          <Section title={sponsor ? 'Site audience in the same period' : 'Audience overview'}>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <Tile label="Page views" value={fmt(report.traffic.views)} />
              <Tile label="Visitors" value={fmt(report.traffic.visitors)} note="Unique per day, summed" />
              <Tile
                label="Views per visitor"
                value={report.traffic.viewsPerVisitor ? report.traffic.viewsPerVisitor.toFixed(2) : '—'}
              />
              <Tile
                label="Newsletter subscribers"
                value={fmt(report.newsletter.activeSubscribers)}
                note={`+${fmt(report.newsletter.newSubscribers)} in this period`}
              />
            </div>
          </Section>

          <Section title="Daily traffic">
            <DailyChart data={report.traffic.daily} />
          </Section>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Section title="Countries">
              <Bars rows={report.traffic.byCountry} total={report.traffic.views} label={countryName} />
            </Section>
            <Section title="Sections">
              <Bars rows={report.traffic.bySection} total={report.traffic.views} label={(k) => SECTION_LABELS[k] || k} />
            </Section>
            <Section title="Top pages">
              <Bars rows={report.traffic.topPages} total={report.traffic.views} label={(k) => k} mono />
            </Section>
            <Section title="Referring sites">
              <Bars rows={report.traffic.referrers} total={report.traffic.views} label={(k) => k} />
            </Section>
          </div>

          {!sponsor && (
            <Section title="Sponsor visibility">
              <SimpleTable
                columns={['Sponsor', 'Impressions', 'Reach', 'Clicks', 'CTR']}
                rows={report.sponsors.map((s) => [s.name, fmt(s.impressions), fmt(s.reach), fmt(s.clicks), pct(s.ctr)])}
                empty="No sponsors yet."
              />
            </Section>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Section title="Devices">
              <Bars
                rows={report.traffic.devices}
                total={report.traffic.devices.reduce((a, d) => a + d.views, 0)}
                label={(k) => k[0].toUpperCase() + k.slice(1)}
              />
            </Section>
            <Section title="Newsletter and content">
              <div className="grid grid-cols-2 gap-4">
                <Tile label="Campaigns sent" value={fmt(report.newsletter.campaignsSent)} />
                <Tile label="Emails delivered to" value={fmt(report.newsletter.emailsSent)} />
                <Tile label="Articles published" value={fmt(report.content.news + report.content.techInsights)} />
                <Tile label="Events listed" value={fmt(report.content.events)} />
              </div>
              <p className="mt-3 text-xs text-gray-500">Newsletter opens and clicks are not measured yet.</p>
            </Section>
          </div>

          <Section title="How these numbers are measured">
            <ul className="space-y-2 text-sm text-gray-600 list-disc pl-5">
              {METHODOLOGY.map((m) => (
                <li key={m}>{m}</li>
              ))}
            </ul>
          </Section>
        </div>
      ) : null}
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-6 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-base font-semibold text-gray-900">{title}</h2>
      {children}
    </section>
  )
}

function Tile({ label, value, note }: { label: string; value: string; note?: string }) {
  return (
    <div className="rounded-lg bg-gray-50 p-4">
      <div className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</div>
      <div className="mt-1 text-2xl font-bold text-gray-900 tabular-nums">{value}</div>
      {note && <div className="mt-0.5 text-xs text-gray-500">{note}</div>}
    </div>
  )
}

function Bars({ rows, total, label, mono }: { rows: KeyCount[]; total: number; label: (k: string) => string; mono?: boolean }) {
  if (!rows.length) return <p className="text-sm text-gray-500">No data in this period.</p>
  const max = Math.max(...rows.map((r) => r.views), 1)
  return (
    <ul className="space-y-2.5">
      {rows.map((r) => (
        <li key={r.key} title={`${label(r.key)}: ${fmt(r.views)} views (${pct(total ? r.views / total : null)})`}>
          <div className="flex items-baseline justify-between gap-3 text-sm">
            <span className={`truncate text-gray-800 ${mono ? 'font-mono text-xs' : ''}`}>{label(r.key)}</span>
            <span className="shrink-0 tabular-nums text-gray-600">
              {fmt(r.views)} <span className="text-gray-400">· {pct(total ? r.views / total : null, 0)}</span>
            </span>
          </div>
          <div className="mt-1 h-1.5 rounded-full bg-gray-100">
            <div className="h-1.5 rounded-full bg-[#16233a]" style={{ width: `${(r.views / max) * 100}%` }} />
          </div>
        </li>
      ))}
    </ul>
  )
}

function SimpleTable({ columns, rows, empty = 'No data in this period.' }: { columns: string[]; rows: string[][]; empty?: string }) {
  if (!rows.length) return <p className="text-sm text-gray-500">{empty}</p>
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 text-xs uppercase tracking-wide text-gray-500">
            {columns.map((c, i) => (
              <th key={c} className={`py-2 font-medium ${i ? 'text-right' : 'text-left'}`}>{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-gray-100 last:border-0">
              {row.map((cell, j) => (
                <td key={j} className={`py-2 ${j ? 'text-right tabular-nums text-gray-700' : 'text-gray-900'}`}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function DailyChart({ data }: { data: { day: string; views: number; visitors: number }[] }) {
  const [hover, setHover] = useState<number | null>(null)
  const W = 900
  const H = 240
  const pad = { l: 44, r: 12, t: 12, b: 28 }
  const plotW = W - pad.l - pad.r
  const plotH = H - pad.t - pad.b
  const { top, ticks } = useMemo(() => {
    const max = Math.max(1, ...data.map((d) => d.views))
    const raw = max / 4
    const pow = Math.pow(10, Math.floor(Math.log10(raw)))
    const f = raw / pow
    const step = Math.max(1, (f <= 1 ? 1 : f <= 2 ? 2 : f <= 5 ? 5 : 10) * pow)
    const top = Math.ceil(max / step) * step
    const ticks: number[] = []
    for (let v = 0; v <= top; v += step) ticks.push(v)
    return { top, ticks }
  }, [data])

  if (!data.length) return null
  const slot = plotW / data.length
  const barW = Math.max(2, Math.min(22, slot - 2))
  const yOf = (v: number) => pad.t + plotH - (v / top) * plotH
  const xMid = (i: number) => pad.l + i * slot + slot / 2
  const line = data.map((d, i) => `${i ? 'L' : 'M'}${xMid(i).toFixed(1)},${yOf(d.visitors).toFixed(1)}`).join(' ')
  const labelIdx = Array.from(new Set([0, Math.floor((data.length - 1) / 2), data.length - 1]))
  const h = hover != null ? data[hover] : null

  return (
    <div>
      <div className="mb-3 flex items-center gap-5 text-xs text-gray-600">
        <span className="flex items-center gap-1.5"><span className="inline-block h-2.5 w-2.5 rounded-sm bg-[#16233a]" /> Page views</span>
        <span className="flex items-center gap-1.5"><span className="inline-block h-0.5 w-4 bg-lime-700" /> Visitors (unique per day)</span>
      </div>
      <div className="relative">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label="Daily page views and visitors">
          {ticks.map((v) => (
            <g key={v}>
              <line x1={pad.l} x2={W - pad.r} y1={yOf(v)} y2={yOf(v)} stroke="#e5e7eb" strokeWidth={1} />
              <text x={pad.l - 8} y={yOf(v) + 4} textAnchor="end" fontSize={11} fill="#6b7280">{fmt(v)}</text>
            </g>
          ))}
          {data.map((d, i) => {
            const bh = (d.views / top) * plotH
            return bh > 0 ? (
              <rect
                key={d.day}
                x={xMid(i) - barW / 2}
                y={yOf(d.views)}
                width={barW}
                height={bh}
                rx={Math.min(4, barW / 2)}
                fill="#16233a"
                opacity={hover == null || hover === i ? 1 : 0.55}
              />
            ) : null
          })}
          <path d={line} fill="none" stroke="#4d7c0f" strokeWidth={2} strokeLinejoin="round" />
          {hover != null && (
            <>
              <line x1={xMid(hover)} x2={xMid(hover)} y1={pad.t} y2={pad.t + plotH} stroke="#9ca3af" strokeDasharray="3 3" />
              <circle cx={xMid(hover)} cy={yOf(data[hover].visitors)} r={4} fill="#4d7c0f" stroke="#fff" strokeWidth={2} />
            </>
          )}
          {labelIdx.map((i) => (
            <text
              key={i}
              x={xMid(i)}
              y={H - 8}
              fontSize={11}
              fill="#6b7280"
              textAnchor={i === 0 ? 'start' : i === data.length - 1 ? 'end' : 'middle'}
            >
              {formatDay(data[i].day, { day: 'numeric', month: 'short' })}
            </text>
          ))}
          {data.map((d, i) => (
            <rect
              key={`hit-${d.day}`}
              x={pad.l + i * slot}
              y={pad.t}
              width={slot}
              height={plotH}
              fill="transparent"
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
            />
          ))}
        </svg>
        {h && (
          <div
            className="pointer-events-none absolute top-0 rounded-md border border-gray-200 bg-white px-3 py-2 text-xs shadow-md"
            style={{ left: `${(xMid(hover!) / W) * 100}%`, transform: `translateX(${hover! > data.length / 2 ? '-105%' : '5%'})` }}
          >
            <div className="font-semibold text-gray-900">{formatDay(h.day)}</div>
            <div className="text-gray-700">{fmt(h.views)} page views</div>
            <div className="text-gray-700">{fmt(h.visitors)} visitors</div>
          </div>
        )}
      </div>
    </div>
  )
}
