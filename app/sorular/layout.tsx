import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Questions',
  description:
    'Questions and answers on hydrometallurgy, battery recycling and critical metals from the HydroMetInsight community.',
  alternates: { canonical: '/sorular' },
  openGraph: { title: 'Questions | HydroMetInsight', description: 'Questions and answers on hydrometallurgy, battery recycling and critical metals from the HydroMetInsight community.', url: '/sorular' },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
