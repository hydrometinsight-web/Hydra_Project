// Shared types for the HydroMetInsight Atlas.
// The atlas is built to hold several facility categories (battery recycling first,
// HPAL, rare-earth separation, lithium refining and others later). Every category
// uses the same Facility shape, so map, filters and detail pages work unchanged
// when a new category is added.

export type FacilityCategoryId =
  | 'battery-recycling'
  | 'hpal'
  | 'ree-separation'
  | 'lithium-refining'

export type FacilityStatus =
  | 'operating'
  | 'commissioning'
  | 'construction'
  | 'planned'
  | 'idle'
  | 'halted'

export type CompanyType = 'startup' | 'corporate' | 'joint-venture'

// Process steps a facility performs. Category-specific steps live side by side;
// each category declares which ones it uses (see categories.ts).
export type ProcessStep =
  | 'collection'
  | 'pre-treatment'
  | 'black-mass'
  | 'hydrometallurgy'
  | 'pyrometallurgy'
  | 'cam-pcam'
  | 'r-and-d'

export type Region = 'Europe' | 'North America' | 'Asia' | 'Oceania' | 'South America' | 'Africa' | 'Middle East'

export interface Capacity {
  value: number
  unit: string // e.g. 't/y'
  basis: string // e.g. 'battery feed', 'black mass'
  note?: string
}

export interface SourceRef {
  title: string
  url: string
  date?: string // YYYY-MM or YYYY-MM-DD
}

export interface Facility {
  slug: string
  name: string
  category: FacilityCategoryId
  company: string
  parent?: string // owning group, for corporate units and JVs
  companyType: CompanyType
  status: FacilityStatus
  statusNote?: string
  processes: ProcessStep[]
  capacity?: Capacity
  startYear?: number
  city: string
  country: string
  countryCode: string // ISO 3166-1 alpha-2
  region: Region
  lat: number
  lng: number
  summary: string
  website?: string
  newsKeywords?: string[] // used to pull related HydroMetInsight articles
  sources: SourceRef[]
  lastVerified: string // YYYY-MM-DD
}
