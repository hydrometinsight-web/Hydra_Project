import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'TechInsight: Technical Articles on Hydrometallurgy',
  description:
    'In-depth technical articles on leaching, solvent extraction, precipitation, water recovery and battery material processing.',
  alternates: { canonical: '/techinsight' },
  openGraph: { title: 'TechInsight: Technical Articles on Hydrometallurgy | HydroMetInsight', description: 'In-depth technical articles on leaching, solvent extraction, precipitation, water recovery and battery material processing.', url: '/techinsight' },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
