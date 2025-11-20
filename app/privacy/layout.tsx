import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'ColleTools privacy policy. No tracking. No data selling. Your privacy is our priority.',
  alternates: {
    canonical: 'https://www.colletools.com/privacy',
  },
  robots: {
    index: false,
    follow: true,
  },
}

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

