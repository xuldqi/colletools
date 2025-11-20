import type { Metadata } from 'next'
import './globals.css'
import Script from 'next/script'

export const metadata: Metadata = {
  title: 'ColleTools - The Ultimate Student Toolkit for GPA, Citations & Focus',
  description: 'Calculate exactly what score you need on your final exam to hit your target GPA. Free, fast, and ad-free tools for college students.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" dir="ltr">
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
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
