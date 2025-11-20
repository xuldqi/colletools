import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Decision Maker - Random Choice Tool',
  description: 'Can\'t decide? Let our decision maker choose for you. Free random choice tool for college students.',
  alternates: {
    canonical: 'https://www.colletools.com/decision',
  },
  openGraph: {
    title: 'Decision Maker - Random Choice Tool | ColleTools',
    description: 'Can\'t decide? Let our decision maker choose for you.',
    url: 'https://www.colletools.com/decision',
  },
}

export default function DecisionLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

