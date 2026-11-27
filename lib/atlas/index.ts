import { FACILITIES } from './facilities'
import { CATEGORIES, STATUS } from './categories'
import type { Facility, FacilityCategoryId } from './types'

export * from './types'
export * from './categories'

// Data access goes through these functions so the source can move from the
// static file to the database (with an admin editor) without touching pages.
export function getFacilities(category?: FacilityCategoryId): Facility[] {
  const enabled = new Set(CATEGORIES.filter((c) => c.enabled).map((c) => c.id))
  return FACILITIES.filter((f) => enabled.has(f.category) && (!category || f.category === category)).sort(
    (a, b) => STATUS[a.status].order - STATUS[b.status].order || a.name.localeCompare(b.name),
  )
}

export function getFacility(slug: string): Facility | undefined {
  return getFacilities().find((f) => f.slug === slug)
}

export function atlasStats(list: Facility[]) {
  return {
    facilities: list.length,
    countries: new Set(list.map((f) => f.countryCode)).size,
    companies: new Set(list.map((f) => f.parent || f.company)).size,
    operating: list.filter((f) => f.status === 'operating').length,
    startups: list.filter((f) => f.companyType === 'startup').length,
    lastVerified: list.map((f) => f.lastVerified).sort().at(-1) || '',
  }
}

export function formatCapacity(f: Facility) {
  if (!f.capacity) return null
  return `${f.capacity.value.toLocaleString('en-US')} ${f.capacity.unit} ${f.capacity.basis}`
}
