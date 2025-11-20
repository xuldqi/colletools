'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import SectionHeader from '@/components/SectionHeader'
import Card from '@/components/Card'

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">
      <Header />
      <main className="flex-grow">
        <div className="max-w-4xl mx-auto py-10 px-4">
          <SectionHeader title="Privacy Policy" subtitle="Your data stays yours." />
          <Card>
            <div className="prose prose-sm text-gray-600 max-w-none">
              <p><strong>Last Updated: 2025</strong></p>
              <p>At ColleTools, we value your privacy. This Privacy Policy explains how we handle your information.</p>
              
              <h3>1. Information We Collect</h3>
              <p>We use Google Analytics (GA4) to collect anonymous usage data (e.g., which pages are visited, how long users stay). This helps us improve the site. We do not collect personal identifiable information (PII) unless you voluntarily provide it (e.g., contacting us via email).</p>
              
              <h3>2. Local Storage</h3>
              <p>Tools like the "Assignment Tracker" save data locally on your device using your browser's LocalStorage. This data never leaves your computer and is not sent to our servers.</p>
              
              <h3>3. AI Services</h3>
              <p>Our Email Generator uses the Gemini API. The prompt text you enter is sent to Google for processing but is not stored by us.</p>
              
              <h3>4. Cookies</h3>
              <p>We use standard cookies for analytics purposes. You can disable cookies in your browser settings at any time.</p>
            </div>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}

