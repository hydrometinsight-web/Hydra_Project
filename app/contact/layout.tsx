import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Get in touch with HydroMetInsight for news tips, partnerships, sponsorship and editorial questions.',
  alternates: { canonical: '/contact' },
  openGraph: { title: 'Contact | HydroMetInsight', description: 'Get in touch with HydroMetInsight for news tips, partnerships, sponsorship and editorial questions.', url: '/contact' },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
