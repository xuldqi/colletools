import type { Metadata } from 'next'
import './globals.css'
import Script from 'next/script'

export const metadata: Metadata = {
  metadataBase: new URL('https://www.colletools.com'),
  title: {
    default: 'ColleTools - Free Student Tools for GPA & Productivity',
    template: '%s | ColleTools',
  },
  description: 'Free tools for college students: grade calculator, email generator, citation helper, and more. No sign-up required. Privacy-first.',
  keywords: ['college tools', 'grade calculator', 'GPA calculator', 'citation helper', 'student tools', 'free tools'],
  authors: [{ name: 'ColleTools' }],
  creator: 'ColleTools',
  publisher: 'ColleTools',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.colletools.com',
    siteName: 'ColleTools',
    title: 'ColleTools - Free Student Tools for GPA & Productivity',
    description: 'Free tools for college students: grade calculator, email generator, citation helper, and more. No sign-up required.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'ColleTools - Student Toolkit',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ColleTools - Free Student Tools for GPA & Productivity',
    description: 'Free tools for college students: grade calculator, email generator, citation helper, and more.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Add your verification codes here when available
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" dir="ltr">
      <head>
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="preconnect" href="https://cdnjs.cloudflare.com" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" crossOrigin="anonymous" />
        {/* Google Analytics (GA4) - Replace G-XXXXXXXXXX with your actual measurement ID */}
        {/* <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XXXXXXXXXX');
          `}
        </Script> */}
      </head>
      <body>
        {children}
      </body>
    </html>
  )
}
