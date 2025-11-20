'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import SectionHeader from '@/components/SectionHeader'
import Card from '@/components/Card'

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">
      <Header />
      <main className="flex-grow">
        <div className="max-w-4xl mx-auto py-10 px-4">
          <SectionHeader title="Terms of Service" subtitle="The rules of the road." />
          <Card>
            <div className="prose prose-sm text-gray-600 max-w-none">
              <p><strong>Last Updated: 2025</strong></p>
              
              <h3>1. Acceptance of Terms</h3>
              <p>By accessing ColleTools.com, you agree to be bound by these Terms of Service.</p>
              
              <h3>2. Educational Use Only</h3>
              <p>This website is for educational and informational purposes only. The tools provided (such as the Grade Calculator) are estimates. We are not responsible for any discrepancies between our calculations and your official academic records.</p>
              
              <h3>3. Limitation of Liability</h3>
              <p>ColleTools is provided "as is". We make no warranties regarding the accuracy or reliability of the site. We are not liable for any damages arising from the use of this site.</p>
            </div>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}

