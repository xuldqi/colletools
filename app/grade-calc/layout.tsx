import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Final Grade Calculator - What Score Do I Need?',
  description: 'Calculate what score you need on your final exam to hit your target GPA. Free, fast, and ad-free grade calculator for college students.',
  alternates: {
    canonical: 'https://www.colletools.com/grade-calc',
  },
  openGraph: {
    title: 'Final Grade Calculator - What Score Do I Need? | ColleTools',
    description: 'Calculate what score you need on your final exam to hit your target GPA. Free, fast, and ad-free.',
    url: 'https://www.colletools.com/grade-calc',
  },
}

export default function GradeCalcLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

