import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Hydrometallurgy and Battery Recycling Events',
  description:
    'Upcoming conferences, symposia and trade shows in hydrometallurgy, battery recycling, critical minerals and metallurgical processing.',
  alternates: { canonical: '/events' },
  openGraph: { title: 'Hydrometallurgy and Battery Recycling Events | HydroMetInsight', description: 'Upcoming conferences, symposia and trade shows in hydrometallurgy, battery recycling, critical minerals and metallurgical processing.', url: '/events' },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
