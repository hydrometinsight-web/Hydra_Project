import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sponsors and Partners',
  description:
    'Companies supporting HydroMetInsight and how to reach engineers and decision-makers in hydrometallurgy and battery recycling.',
  alternates: { canonical: '/sponsor' },
  openGraph: { title: 'Sponsors and Partners | HydroMetInsight', description: 'Companies supporting HydroMetInsight and how to reach engineers and decision-makers in hydrometallurgy and battery recycling.', url: '/sponsor' },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
