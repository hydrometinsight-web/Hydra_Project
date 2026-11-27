import type { CompanyType, FacilityCategoryId, FacilityStatus, ProcessStep } from './types'

export interface CategoryDef {
  id: FacilityCategoryId
  label: string
  shortLabel: string
  description: string
  enabled: boolean // false = announced on the atlas page as coming soon
  processes: ProcessStep[] // process filters shown for this category
}

// Add a category here, set enabled: true and add facilities with that category id.
export const CATEGORIES: CategoryDef[] = [
  {
    id: 'battery-recycling',
    label: 'Battery recycling',
    shortLabel: 'Battery recycling',
    description:
      'Lithium-ion battery recycling: collection and pre-treatment, black mass production, and hydrometallurgical or pyrometallurgical metal recovery.',
    enabled: true,
    processes: ['pre-treatment', 'black-mass', 'hydrometallurgy', 'pyrometallurgy', 'cam-pcam', 'r-and-d'],
  },
  {
    id: 'hpal',
    label: 'HPAL nickel–cobalt',
    shortLabel: 'HPAL',
    description: 'High-pressure acid leach plants producing MHP or mixed sulfides from laterite ore.',
    enabled: false,
    processes: ['hydrometallurgy'],
  },
  {
    id: 'ree-separation',
    label: 'Rare earth separation',
    shortLabel: 'Rare earths',
    description: 'Solvent extraction and separation of rare earth elements, including magnet recycling.',
    enabled: false,
    processes: ['hydrometallurgy'],
  },
  {
    id: 'lithium-refining',
    label: 'Lithium refining',
    shortLabel: 'Lithium',
    description: 'Lithium hydroxide and carbonate refineries.',
    enabled: false,
    processes: ['hydrometallurgy'],
  },
]

export const STATUS: Record<FacilityStatus, { label: string; color: string; order: number }> = {
  operating: { label: 'Operating', color: '#16a34a', order: 0 },
  commissioning: { label: 'Commissioning', color: '#84cc16', order: 1 },
  construction: { label: 'Under construction', color: '#f59e0b', order: 2 },
  planned: { label: 'Planned', color: '#3b82f6', order: 3 },
  idle: { label: 'Idle', color: '#9ca3af', order: 4 },
  halted: { label: 'Halted', color: '#ef4444', order: 5 },
}

export const COMPANY_TYPE: Record<CompanyType, { label: string; description: string }> = {
  startup: { label: 'Start-up / scale-up', description: 'Venture-backed or young independent company' },
  corporate: { label: 'Corporate / holding', description: 'Unit of an established industrial group' },
  'joint-venture': { label: 'Joint venture', description: 'Shared ownership between groups' },
}

export const PROCESS: Record<ProcessStep, string> = {
  collection: 'Collection',
  'pre-treatment': 'Pre-treatment & dismantling',
  'black-mass': 'Black mass production',
  hydrometallurgy: 'Hydrometallurgical refining',
  pyrometallurgy: 'Pyrometallurgy',
  'cam-pcam': 'pCAM / CAM production',
  'r-and-d': 'Pilot / R&D',
}

export function categoryById(id: FacilityCategoryId) {
  return CATEGORIES.find((c) => c.id === id)!
}
