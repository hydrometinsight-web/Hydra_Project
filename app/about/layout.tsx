import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: { absolute: 'About HydroMetInsight' },
  description:
    'HydroMetInsight is an independent platform from Madrid covering hydrometallurgy, battery recycling, rare earths and critical metals for engineers and industry.',
  alternates: { canonical: '/about' },
  openGraph: { title: 'About HydroMetInsight', description: 'HydroMetInsight is an independent platform from Madrid covering hydrometallurgy, battery recycling, rare earths and critical metals for engineers and industry.', url: '/about' },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
