import Link from 'next/link'
import type { Metadata } from 'next'
import AdSense from '@/components/AdSense'

export const metadata: Metadata = {
  title: 'Engineering Calculators | HydroMetInsight',
  description:
    'Free calculation tools for hydrometallurgy, battery recycling and chemical engineering.',
}

const TOOLS = [
  {
    href: '/calculator/molecular-weight',
    title: 'Molecular Weight Calculator',
    description: 'Molecular weight of any chemical formula, with an element-by-element breakdown.',
  },
  {
    href: '/calculator/unit-converter',
    title: 'Unit Converter',
    description: 'Concentration, temperature, pressure, volume, mass, length and energy units.',
  },
]

export default function CalculationsPage() {
  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-12 max-w-5xl mx-auto">
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-3 tracking-tight">Engineering Calculators</h1>
        <p className="text-lg text-gray-600">
          Simple calculation tools for hydrometallurgy, battery recycling and chemical engineering.
        </p>
      </div>

      <div className="mb-10">
        <AdSense adSlot="1234567890" className="w-full" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {TOOLS.map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            className="group block h-full rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:border-[#93D419] hover:shadow-md"
          >
            <div className="flex h-full flex-col">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">{tool.title}</h2>
              <p className="text-gray-600 leading-relaxed flex-grow">{tool.description}</p>
              <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-lime-700">
                Open
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
