import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'APA & MLA Citation Helper',
  description: 'Format APA and MLA citations instantly. Free citation generator for academic papers. No ads, no tracking.',
  alternates: {
    canonical: 'https://www.colletools.com/citation',
  },
  openGraph: {
    title: 'APA & MLA Citation Helper | ColleTools',
    description: 'Format APA and MLA citations instantly. Free citation generator for academic papers.',
    url: 'https://www.colletools.com/citation',
  },
}

export default function CitationLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

