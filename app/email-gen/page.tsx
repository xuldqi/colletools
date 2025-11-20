'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import SectionHeader from '@/components/SectionHeader'
import Card from '@/components/Card'
import Button from '@/components/Button'
import SEOContent from '@/components/SEOContent'

export default function EmailGenerator() {
  const [details, setDetails] = useState({
    profName: '',
    studentName: '',
    type: 'extension',
    course: '',
    reason: ''
  })
  const [generatedEmail, setGeneratedEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Load saved data from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('colletools-email-gen')
      if (saved) {
        const savedDetails = JSON.parse(saved)
        setDetails(savedDetails || details)
      }
    } catch (e) {
      console.error("Failed to load saved data", e)
    }
  }, [])

  // Save data to localStorage whenever inputs change
  useEffect(() => {
    if (details.profName || details.studentName || details.course || details.reason) {
      localStorage.setItem('colletools-email-gen', JSON.stringify(details))
    }
  }, [details])

  const generateEmail = async () => {
    setLoading(true)
    setError('')
    setGeneratedEmail('')

    try {
      const response = await fetch('/api/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ details }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate email')
      }

      const data = await response.json()
      setGeneratedEmail(data.email || "Could not generate email. Please try again.")
    } catch (err) {
      console.error(err)
      setError("Failed to generate email. Please check your inputs and try again.")
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedEmail)
    alert("Copied to clipboard!")
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">
      <Header />
      <main className="flex-grow">
        <div className="max-w-3xl mx-auto py-10 px-4">
          <SectionHeader 
            title="Email Generator" 
            subtitle="Stop overthinking. Generate a professional email in seconds." 
          />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-4">
              <Card>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email Type</label>
                    <select 
                      className="w-full p-2 border rounded bg-white"
                      value={details.type}
                      onChange={e => setDetails({...details, type: e.target.value})}
                    >
                      <option value="extension">Ask for Extension</option>
                      <option value="grade">Grade Inquiry</option>
                      <option value="missing">Missed Class</option>
                      <option value="recommendation">Recommendation Letter</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Professor Name</label>
                    <input 
                      type="text" className="w-full p-2 border rounded" placeholder="Smith"
                      value={details.profName} onChange={e => setDetails({...details, profName: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Your Name</label>
                    <input 
                      type="text" className="w-full p-2 border rounded" placeholder="John Doe"
                      value={details.studentName} onChange={e => setDetails({...details, studentName: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Course Name/ID</label>
                    <input 
                      type="text" className="w-full p-2 border rounded" placeholder="BIO 101"
                      value={details.course} onChange={e => setDetails({...details, course: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Reason / Details</label>
                    <textarea 
                      className="w-full p-2 border rounded text-sm" rows={3} placeholder="I was sick..."
                      value={details.reason} onChange={e => setDetails({...details, reason: e.target.value})}
                    />
                  </div>
                  <Button onClick={generateEmail} loading={loading} className="w-full">Generate Draft</Button>
                </div>
              </Card>
            </div>

            <div className="lg:col-span-2">
              <Card className="h-full min-h-[400px] flex flex-col">
                <div className="flex justify-between items-center mb-4 pb-4 border-b">
                  <h3 className="font-bold text-gray-700">Preview</h3>
                  {generatedEmail && (
                    <button onClick={copyToClipboard} className="text-primary-600 text-sm font-medium hover:underline">
                      <i className="fa-regular fa-copy mr-1"></i> Copy
                    </button>
                  )}
                </div>
                {error && <div className="text-red-500 text-sm bg-red-50 p-3 rounded">{error}</div>}
                <div className="flex-grow bg-gray-50 rounded-lg p-4 font-mono text-sm text-gray-800 whitespace-pre-wrap leading-relaxed overflow-y-auto">
                  {loading ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400">
                      <i className="fa-solid fa-wand-magic-sparkles fa-spin text-2xl mb-2"></i>
                      <p>Drafting your email...</p>
                    </div>
                  ) : generatedEmail ? generatedEmail : (
                    <span className="text-gray-400 italic">Fill out the details on the left and hit Generate to see the magic happen.</span>
                  )}
                </div>
              </Card>
            </div>
          </div>

          {/* SEO Content Section */}
          <SEOContent>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">How to Use This AI Email Generator?</h2>
            <p className="mb-4 leading-relaxed text-gray-600">
              Writing professional emails to professors can be stressful, especially when you're asking for something important like an extension or a grade inquiry. Our AI-powered email generator takes the guesswork out of email writing. Simply fill in the form with your details, select the type of email you need, and our AI will craft a polite, professional message in seconds.
            </p>
            <p className="mb-4 leading-relaxed text-gray-600">
              The generator supports four common email types: asking for assignment extensions, grade inquiries, apologizing for missed classes, and requesting recommendation letters. Each email is tailored to your specific situation while maintaining a respectful, academic tone that professors expect from college students.
            </p>
            <p className="mb-6 leading-relaxed text-gray-600">
              All generated emails are ready to copy and paste directly into your email client. No need to worry about formatting or tone—our AI handles it all. Your email drafts are never saved on our servers, ensuring complete privacy.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">Why Do I Need an Email Generator for Professors?</h2>
            <p className="mb-4 leading-relaxed text-gray-600">
              College students often struggle with email anxiety when communicating with professors. Whether you're dealing with college stress, trying to save your GPA, or simply want to make a good impression, a well-written email can make all the difference. Poorly written emails can hurt your chances of getting extensions, grade adjustments, or recommendation letters.
            </p>
            <p className="mb-4 leading-relaxed text-gray-600">
              Our email generator helps you overcome email anxiety by providing professional templates that follow academic communication standards. It saves you time during busy finals weeks and ensures you present yourself professionally, which is crucial for building positive relationships with professors who can help with your academic success.
            </p>
            <p className="mb-6 leading-relaxed text-gray-600">
              Unlike generic email templates, our AI considers your specific situation, course context, and reason for contacting the professor. This personalized approach increases the likelihood of a positive response and helps you maintain professionalism even when you're stressed or in a hurry.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">Email Types and Best Practices</h2>
            <p className="mb-4 leading-relaxed text-gray-600">
              Our generator supports four common email scenarios that college students face:
            </p>
            <ul className="list-disc pl-5 mb-6 space-y-2 text-gray-600">
              <li><strong>Extension Requests:</strong> When you need more time on an assignment due to illness, emergencies, or other valid reasons. Always be honest and provide context.</li>
              <li><strong>Grade Inquiries:</strong> When you want to understand a grade or respectfully ask for a regrade. Be specific about what you'd like clarified.</li>
              <li><strong>Missed Class:</strong> When you need to apologize for an absence and ask what you missed. Show that you're taking responsibility.</li>
              <li><strong>Recommendation Letters:</strong> When requesting a letter for jobs, internships, or graduate school. Provide context about what you're applying for.</li>
            </ul>
            <p className="mb-6 leading-relaxed text-gray-600">
              Remember: Always personalize the generated email with any additional details specific to your situation. The AI provides a solid foundation, but adding personal touches shows genuine engagement and respect for your professor's time.
            </p>
          </SEOContent>
        </div>
      </main>
      <Footer />
    </div>
  )
}

