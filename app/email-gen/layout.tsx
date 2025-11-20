import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI Email Generator for Professors',
  description: 'Generate professional emails to professors in seconds using AI. Ask for extensions, grade inquiries, and recommendation letters. Free and privacy-first.',
  alternates: {
    canonical: 'https://www.colletools.com/email-gen',
  },
  openGraph: {
    title: 'AI Email Generator for Professors | ColleTools',
    description: 'Generate professional emails to professors in seconds using AI. Free and privacy-first.',
    url: 'https://www.colletools.com/email-gen',
  },
}

export default function EmailGenLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

