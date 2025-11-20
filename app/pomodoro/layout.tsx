import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Study Room - Pomodoro Timer & Lo-Fi Music',
  description: 'Focus with Pomodoro timer and Lo-Fi beats. Free study room for college students. Boost productivity and concentration.',
  alternates: {
    canonical: 'https://www.colletools.com/pomodoro',
  },
  openGraph: {
    title: 'Study Room - Pomodoro Timer & Lo-Fi Music | ColleTools',
    description: 'Focus with Pomodoro timer and Lo-Fi beats. Free study room for college students.',
    url: 'https://www.colletools.com/pomodoro',
  },
}

export default function PomodoroLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

