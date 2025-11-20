import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Assignment Deadline Tracker',
  description: 'Track your assignments and deadlines. Never miss a due date. Free assignment tracker with priority levels and urgency indicators.',
  alternates: {
    canonical: 'https://www.colletools.com/deadlines',
  },
  openGraph: {
    title: 'Assignment Deadline Tracker | ColleTools',
    description: 'Track your assignments and deadlines. Never miss a due date.',
    url: 'https://www.colletools.com/deadlines',
  },
}

export default function DeadlinesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

