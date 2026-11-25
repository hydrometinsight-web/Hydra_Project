// Builds the letterhead PDF report in the browser (jsPDF, vector output).
import type { AnalyticsReport, KeyCount } from './analytics-types'
import { METHODOLOGY, SECTION_LABELS, countryName, fmt, formatDay, pct, placementLabel } from './analytics-types'

const NAVY: [number, number, number] = [11, 18, 32]
const NAVY_2: [number, number, number] = [22, 35, 58]
const LIME: [number, number, number] = [147, 212, 25]
const LIME_TEXT: [number, number, number] = [77, 124, 15]
const INK: [number, number, number] = [17, 24, 39]
const MUTED: [number, number, number] = [107, 114, 128]
const LINE: [number, number, number] = [229, 231, 235]
const SOFT: [number, number, number] = [243, 244, 246]

const W = 210
const H = 297
const M = 16 // page margin
const CONTENT_TOP = 40
const CONTENT_BOTTOM = H - 22

async function loadImage(src: string): Promise<string | null> {
  try {
    const res = await fetch(src)
    const blob = await res.blob()
    return await new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = () => resolve(null)
      reader.readAsDataURL(blob)
    })
  } catch {
    return null
  }
}

export async function downloadReportPdf(report: AnalyticsReport, opts: { sponsorName?: string | null } = {}) {
  const jsPDF = (await import('jspdf')).default
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  const logo = await loadImage('/logo1.png')
  const period = `${formatDay(report.range.from)} – ${formatDay(report.range.to)}`
  const title = opts.sponsorName ? `Sponsor report: ${opts.sponsorName}` : 'Audience report'
  let y = CONTENT_TOP

  const letterhead = () => {
    doc.setFillColor(...NAVY)
    doc.rect(0, 0, W, 28, 'F')
    doc.setFillColor(...LIME)
    doc.rect(0, 28, W, 1.2, 'F')
    if (logo) doc.addImage(logo, 'PNG', M, 8.5, 11, 11.3)
    doc.setTextColor(255, 255, 255)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(15)
    doc.text('HydroMetInsight', M + 15, 14.5)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8)
    doc.setTextColor(200, 210, 225)
    doc.text('Hydrometallurgy · Critical metals · Battery recycling', M + 15, 19.5)
    doc.setFontSize(8.5)
    doc.setTextColor(255, 255, 255)
    doc.text('AUDIENCE & SPONSORSHIP REPORT', W - M, 13.5, { align: 'right' })
    doc.setTextColor(...LIME)
    doc.text(period, W - M, 19, { align: 'right' })
  }

  const footer = (page: number, pages: number) => {
    doc.setDrawColor(...LINE)
    doc.setLineWidth(0.3)
    doc.line(M, H - 15, W - M, H - 15)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(7.5)
    doc.setTextColor(...MUTED)
    doc.text('HydroMetInsight · Madrid, Spain · www.hydrometinsight.com', M, H - 10)
    const note = opts.sponsorName ? `Prepared for ${opts.sponsorName} · Confidential` : 'Measured first-party data'
    doc.text(`${note}   ·   Page ${page} of ${pages}`, W - M, H - 10, { align: 'right' })
  }

  const newPage = () => {
    doc.addPage()
    letterhead()
    y = CONTENT_TOP
  }

  const ensure = (height: number) => {
    if (y + height > CONTENT_BOTTOM) newPage()
  }

  const heading = (text: string, keepWith = 30) => {
    ensure(8 + keepWith)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(11.5)
    doc.setTextColor(...INK)
    doc.text(text, M, y)
    doc.setFillColor(...LIME)
    doc.rect(M, y + 1.8, 10, 0.8, 'F')
    y += 8
  }

  const tiles = (items: { label: string; value: string; note?: string }[]) => {
    const gap = 4
    const w = (W - 2 * M - gap * (items.length - 1)) / items.length
    const h = 22
    ensure(h + 4)
    items.forEach((item, i) => {
      const x = M + i * (w + gap)
      doc.setFillColor(...SOFT)
      doc.roundedRect(x, y, w, h, 2, 2, 'F')
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(7.5)
      doc.setTextColor(...MUTED)
      doc.text(item.label.toUpperCase(), x + 4, y + 6)
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(16)
      doc.setTextColor(...INK)
      doc.text(item.value, x + 4, y + 14.5)
      if (item.note) {
        doc.setFont('helvetica', 'normal')
        doc.setFontSize(6.8)
        doc.setTextColor(...MUTED)
        doc.text(item.note, x + 4, y + 19)
      }
    })
    y += h + 7
  }

  const dailyChart = () => {
    const data = report.traffic.daily
    const h = 48
    ensure(h + 16)
    const x0 = M + 10
    const plotW = W - M - x0
    const max = Math.max(1, ...data.map((d) => d.views))
    const step = niceStep(max)
    const top = Math.ceil(max / step) * step
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(6.5)
    for (let v = 0; v <= top; v += step) {
      const gy = y + h - (v / top) * h
      doc.setDrawColor(...LINE)
      doc.setLineWidth(0.2)
      doc.line(x0, gy, W - M, gy)
      doc.setTextColor(...MUTED)
      doc.text(fmt(v), x0 - 2, gy + 1, { align: 'right' })
    }
    const slot = plotW / data.length
    const barW = Math.max(0.6, Math.min(6, slot - 0.8))
    data.forEach((d, i) => {
      const bh = (d.views / top) * h
      if (bh > 0) {
        doc.setFillColor(...NAVY_2)
        doc.rect(x0 + i * slot + (slot - barW) / 2, y + h - bh, barW, bh, 'F')
      }
    })
    // visitors line
    doc.setDrawColor(...LIME_TEXT)
    doc.setLineWidth(0.6)
    for (let i = 1; i < data.length; i++) {
      const xa = x0 + (i - 0.5) * slot
      const xb = x0 + (i + 0.5) * slot
      const ya = y + h - (data[i - 1].visitors / top) * h
      const yb = y + h - (data[i].visitors / top) * h
      doc.line(xa, ya, xb, yb)
    }
    // x labels: first, middle, last
    doc.setTextColor(...MUTED)
    const label = (i: number, align: 'left' | 'center' | 'right') =>
      doc.text(formatDay(data[i].day, { day: 'numeric', month: 'short' }), x0 + (i + 0.5) * slot, y + h + 4.5, { align })
    if (data.length) {
      label(0, 'left')
      if (data.length > 2) label(Math.floor(data.length / 2), 'center')
      label(data.length - 1, 'right')
    }
    // legend
    const ly = y + h + 10
    doc.setFillColor(...NAVY_2)
    doc.rect(x0, ly - 2.2, 3, 2.5, 'F')
    doc.setTextColor(...INK)
    doc.setFontSize(7.5)
    doc.text('Page views', x0 + 4.5, ly)
    doc.setDrawColor(...LIME_TEXT)
    doc.setLineWidth(0.8)
    doc.line(x0 + 26, ly - 1, x0 + 31, ly - 1)
    doc.text('Visitors (unique per day)', x0 + 32.5, ly)
    y = ly + 8
  }

  const table = (
    x: number,
    width: number,
    columns: { label: string; align?: 'left' | 'right'; width: number }[],
    rows: string[][],
    startY: number
  ) => {
    let ty = startY
    const rowH = 6.2
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(7.3)
    doc.setTextColor(...MUTED)
    let cx = x
    columns.forEach((c) => {
      const tx = c.align === 'right' ? cx + c.width * width : cx
      doc.text(c.label.toUpperCase(), tx, ty, { align: c.align === 'right' ? 'right' : 'left' })
      cx += c.width * width
    })
    ty += 2
    doc.setDrawColor(...LINE)
    doc.setLineWidth(0.3)
    doc.line(x, ty, x + width, ty)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8.3)
    if (rows.length === 0) {
      ty += rowH - 1.5
      doc.setTextColor(...MUTED)
      doc.text('No data in this period', x, ty)
      return ty + 3
    }
    rows.forEach((row) => {
      ty += rowH
      cx = x
      row.forEach((cell, i) => {
        const c = columns[i]
        const maxW = c.width * width - 2
        const text = doc.splitTextToSize(cell, maxW)[0] as string
        doc.setTextColor(...(i === 0 ? INK : INK))
        const tx = c.align === 'right' ? cx + c.width * width : cx
        doc.text(text, tx, ty - 1.6, { align: c.align === 'right' ? 'right' : 'left' })
        cx += c.width * width
      })
      doc.setDrawColor(...SOFT)
      doc.line(x, ty, x + width, ty)
    })
    return ty + 3
  }

  const twoTables = (
    left: { title: string; rows: KeyCount[]; label: (k: string) => string; total: number },
    right: { title: string; rows: KeyCount[]; label: (k: string) => string; total: number }
  ) => {
    const gap = 8
    const w = (W - 2 * M - gap) / 2
    const rowsMax = Math.max(left.rows.length, right.rows.length, 1)
    ensure(14 + rowsMax * 6.2 + 8)
    const cols = (t: string) => [
      { label: t, width: 0.62 },
      { label: 'Views', width: 0.2, align: 'right' as const },
      { label: 'Share', width: 0.18, align: 'right' as const },
    ]
    const toRows = (side: typeof left) =>
      side.rows.map((r) => [side.label(r.key), fmt(r.views), pct(side.total ? r.views / side.total : null, 0)])
    const startY = y
    const a = table(M, w, cols(left.title), toRows(left), startY)
    const b = table(M + w + gap, w, cols(right.title), toRows(right), startY)
    y = Math.max(a, b) + 5
  }

  // ---------- Page 1 ----------
  letterhead()
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(19)
  doc.setTextColor(...INK)
  doc.text(title, M, y + 2)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(...MUTED)
  doc.text(
    `Period: ${period} (${report.range.days} days, UTC)   ·   Generated ${new Date(report.generatedAt).toLocaleString('en-GB', { timeZone: 'UTC' })} UTC`,
    M,
    y + 9
  )
  y += 18

  const t = report.traffic
  const sponsor = opts.sponsorName ? report.sponsors[0] : null

  if (sponsor) {
    heading('Sponsor performance')
    tiles([
      { label: 'Impressions', value: fmt(sponsor.impressions), note: 'Logo seen on screen' },
      { label: 'Reach', value: fmt(sponsor.reach), note: 'Unique visitors per day' },
      { label: 'Clicks', value: fmt(sponsor.clicks), note: 'Sponsor link clicks' },
      { label: 'Click-through rate', value: pct(sponsor.ctr), note: 'Clicks ÷ impressions' },
    ])
    ensure(30)
    y = table(
      M,
      W - 2 * M,
      [
        { label: 'Placement', width: 0.52 },
        { label: 'Impressions', width: 0.16, align: 'right' },
        { label: 'Clicks', width: 0.16, align: 'right' },
        { label: 'CTR', width: 0.16, align: 'right' },
      ],
      sponsor.placements.map((p) => [
        placementLabel(p.placement),
        fmt(p.impressions),
        fmt(p.clicks),
        pct(p.impressions ? p.clicks / p.impressions : null),
      ]),
      y
    ) + 6
  }

  heading(sponsor ? 'Site audience in the same period' : 'Audience overview')
  tiles([
    { label: 'Page views', value: fmt(t.views) },
    { label: 'Visitors', value: fmt(t.visitors), note: 'Unique per day, summed' },
    { label: 'Views per visitor', value: t.viewsPerVisitor ? t.viewsPerVisitor.toFixed(2) : '—' },
    { label: 'Subscribers', value: fmt(report.newsletter.activeSubscribers), note: `Newsletter, +${fmt(report.newsletter.newSubscribers)} in period` },
  ])

  heading('Daily traffic', 66)
  dailyChart()

  heading('Where the audience comes from', 14 + Math.max(t.byCountry.length, t.bySection.length, 1) * 6.2)
  twoTables(
    { title: 'Country', rows: t.byCountry, label: countryName, total: t.views },
    { title: 'Section', rows: t.bySection, label: (k) => SECTION_LABELS[k] || k, total: t.views }
  )

  heading('Pages and referrers', 14 + Math.max(t.topPages.length, t.referrers.length, 1) * 6.2)
  twoTables(
    { title: 'Top pages', rows: t.topPages, label: (k) => k, total: t.views },
    { title: 'Referring sites', rows: t.referrers, label: (k) => k, total: t.views }
  )

  if (!sponsor && report.sponsors.length) {
    heading('Sponsor visibility', 14 + report.sponsors.length * 6.2)
    ensure(14 + report.sponsors.length * 6.2)
    y = table(
      M,
      W - 2 * M,
      [
        { label: 'Sponsor', width: 0.4 },
        { label: 'Impressions', width: 0.15, align: 'right' },
        { label: 'Reach', width: 0.15, align: 'right' },
        { label: 'Clicks', width: 0.15, align: 'right' },
        { label: 'CTR', width: 0.15, align: 'right' },
      ],
      report.sponsors.map((s) => [s.name, fmt(s.impressions), fmt(s.reach), fmt(s.clicks), pct(s.ctr)]),
      y
    ) + 6
  }

  heading('Newsletter and content')
  tiles([
    { label: 'Campaigns sent', value: fmt(report.newsletter.campaignsSent) },
    { label: 'Emails delivered to', value: fmt(report.newsletter.emailsSent), note: 'Recipients, all campaigns' },
    { label: 'Articles published', value: fmt(report.content.news + report.content.techInsights) },
    { label: 'Events listed', value: fmt(report.content.events) },
  ])

  // Methodology
  heading('How these numbers are measured', 60)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  const lines: string[] = []
  METHODOLOGY.forEach((p) => lines.push(...(doc.splitTextToSize(`•  ${p}`, W - 2 * M - 6) as string[]), ''))
  if (t.legacyViews > 0) {
    lines.push(
      ...(doc.splitTextToSize(
        `•  ${fmt(t.legacyViews)} of the page views in this period were recorded by the earlier counter, which only counted visitors who accepted analytics cookies and did not identify unique visitors. They are included in page views but not in visitors.`,
        W - 2 * M - 6
      ) as string[])
    )
  }
  const boxH = lines.length * 3.6 + 6
  ensure(boxH)
  doc.setFillColor(...SOFT)
  doc.roundedRect(M, y - 2, W - 2 * M, boxH, 2, 2, 'F')
  doc.setTextColor(...INK)
  lines.forEach((line, i) => doc.text(line, M + 3, y + 3 + i * 3.6))
  y += boxH + 4

  const pages = doc.getNumberOfPages()
  for (let p = 1; p <= pages; p++) {
    doc.setPage(p)
    footer(p, pages)
  }

  const slug = (opts.sponsorName || 'audience').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  doc.save(`hydrometinsight-${slug}-report-${report.range.from}_${report.range.to}.pdf`)
}

function niceStep(max: number) {
  const raw = max / 4
  const pow = Math.pow(10, Math.floor(Math.log10(raw)))
  const f = raw / pow
  const nice = f <= 1 ? 1 : f <= 2 ? 2 : f <= 5 ? 5 : 10
  return Math.max(1, nice * pow)
}
