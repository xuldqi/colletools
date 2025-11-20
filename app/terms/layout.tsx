import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'ColleTools terms of service. Educational use only. Results are estimates.',
  alternates: {
    canonical: 'https://www.colletools.com/terms',
  },
  robots: {
    index: false,
    follow: true,
  },
}

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

