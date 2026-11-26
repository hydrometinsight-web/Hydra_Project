import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Hydrometallurgy and Critical Metals News',
  description:
    'Latest news on hydrometallurgy, battery recycling, black mass, lithium, nickel, cobalt and rare earths, with analysis for engineers and industry.',
  alternates: { canonical: '/news' },
  openGraph: { title: 'Hydrometallurgy and Critical Metals News | HydroMetInsight', description: 'Latest news on hydrometallurgy, battery recycling, black mass, lithium, nickel, cobalt and rare earths, with analysis for engineers and industry.', url: '/news' },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
