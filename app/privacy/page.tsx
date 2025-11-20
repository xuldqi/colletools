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
            
            <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
              <h3 className="font-bold text-green-900 mb-2">Our Privacy Promise</h3>
              <p className="text-green-800 mb-2">
                <strong>No tracking. No data selling. Just a tool.</strong>
              </p>
              <p className="text-sm text-green-700">
                We're the anti-Chegg. Unlike companies that collect and sell student data, we believe your privacy is non-negotiable. All your data stays in your browser. We don't track you. We don't sell your information. We don't share it with schools or third parties. Period.
              </p>
            </div>

            <p>At ColleTools, we value your privacy above all else. This Privacy Policy explains our commitment to protecting your data.</p>
            
            <h3>1. We Don't Track You</h3>
            <p><strong>We do not use tracking cookies, pixels, or any analytics that identify you.</strong> Unlike Chegg, CourseHero, and other platforms that monitor your activity, we don't track which pages you visit, how long you stay, or what you search for. Your browsing is completely private.</p>
            
            <h3>2. We Don't Collect Personal Information</h3>
            <p><strong>We don't ask for your name, email, or any personal details.</strong> You can use all our tools without creating an account or providing any information. The only exception is if you voluntarily contact us via email, in which case we only use that email to respond to you.</p>
            
            <h3>3. All Data Stays in Your Browser</h3>
            <p>Tools like the "Assignment Tracker" and "Grade Calculator" save data locally on your device using your browser's LocalStorage. <strong>This data never leaves your computer and is never sent to our servers.</strong> It's stored on your device, under your control. If you clear your browser data, it's gone—and that's exactly how it should be.</p>
            
            <h3>4. AI Services (Email Generator)</h3>
            <p>Our Email Generator uses Google's Gemini API. When you generate an email, the text you enter is sent to Google for processing. <strong>We do not store this data.</strong> Google processes it and returns the result, but we don't keep a copy. Your email drafts are never saved on our servers.</p>
            
            <h3>5. We Don't Sell Your Data</h3>
            <p><strong>We will never sell, rent, or share your data with anyone.</strong> Not with advertisers. Not with schools. Not with data brokers. Not with anyone. This is a core principle of ColleTools, and it will never change.</p>
            
            <h3>6. No Cookies (Except Essential)</h3>
            <p>We don't use tracking cookies or advertising cookies. The only cookies that might be set are essential for the website to function (like session cookies). You can disable cookies in your browser settings at any time, and our tools will still work.</p>
            
            <h3>7. Third-Party Services</h3>
            <p>We use minimal third-party services. Font Awesome (for icons) and Google Fonts (for typography) are loaded from CDNs, but they don't track you. Our hosting provider (Vercel) may collect basic server logs (IP addresses, request times), but this is standard web hosting and not used for tracking.</p>
            
            <div className="bg-gray-50 border-l-4 border-gray-400 p-4 mt-6">
              <h3 className="font-bold text-gray-900 mb-2">The Bottom Line</h3>
              <p className="text-gray-700">
                We built ColleTools because we were frustrated with companies like Chegg that collect and monetize student data. We believe students deserve better. <strong>Your privacy is not for sale.</strong> Use our tools with confidence, knowing that your data stays yours.
              </p>
            </div>
            </div>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}

