'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import SectionHeader from '@/components/SectionHeader'
import Card from '@/components/Card'
import SEOContent from '@/components/SEOContent'

export default function CitationHelper() {
  const [data, setData] = useState({
    authorLast: '', authorFirst: '', title: '', publisher: '', year: '', url: ''
  })
  const [format, setFormat] = useState<'apa' | 'mla'>('apa')

  // Load saved data from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('colletools-citation')
      if (saved) {
        const savedData = JSON.parse(saved)
        setData(savedData.data || data)
        setFormat(savedData.format || 'apa')
      }
    } catch (e) {
      console.error("Failed to load saved data", e)
    }
  }, [])

  // Save data to localStorage whenever inputs change
  useEffect(() => {
    if (data.authorLast || data.authorFirst || data.title || data.publisher || data.year || data.url) {
      localStorage.setItem('colletools-citation', JSON.stringify({
        data,
        format
      }))
    }
  }, [data, format])

  const generate = () => {
    const { authorLast, authorFirst, title, publisher, year, url } = data
    
    // Check if all fields are empty
    const hasAnyData = authorLast || authorFirst || title || publisher || year || url
    if (!hasAnyData) {
      return null // Return null to show placeholder
    }
    
    const parts = []

    if (format === 'apa') {
       // Author
       if (authorLast) {
         let authorPart = authorLast
         if (authorFirst) authorPart += `, ${authorFirst[0]}.`
         parts.push(authorPart)
       }
       
       // Year - only add if we have author or title
       if (authorLast || title) {
         const yearPart = `(${year || 'n.d.'}).`
         parts.push(yearPart)
       }

       // Title
       if (title) parts.push(`${title}.`)

       // Publisher
       if (publisher) parts.push(`${publisher}.`)

       // URL
       if (url) parts.push(url)

       // Only return if we have at least one meaningful part
       if (parts.length === 0) return null
       return parts.join(' ')

    } else {
      // MLA: Author. Title. Publisher, Year. URL.
      
      // Author
      if (authorLast) {
        let authorPart = authorLast
        if (authorFirst) authorPart += `, ${authorFirst}.`
        parts.push(authorPart)
      }

      // Title
      if (title) parts.push(`${title}.`)

      // Publisher & Year
      let pubYear = []
      if (publisher) pubYear.push(publisher)
      if (year) pubYear.push(year)
      if (pubYear.length > 0) parts.push(`${pubYear.join(', ')}.`)

      // URL
      if (url) parts.push(url + ".")
      
      // Only return if we have at least one meaningful part
      if (parts.length === 0) return null
      return parts.join(' ')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">
      <Header />
      <main className="flex-grow">
        <div className="max-w-2xl mx-auto py-10 px-4">
          <SectionHeader title="Citation Helper" subtitle="Format references quickly without ads or popups." />
          <Card>
            <div className="flex gap-4 mb-6 border-b pb-4">
              <button onClick={() => setFormat('apa')} className={`px-4 py-1 rounded-full text-sm font-bold ${format === 'apa' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600'}`}>APA 7</button>
              <button onClick={() => setFormat('mla')} className={`px-4 py-1 rounded-full text-sm font-bold ${format === 'mla' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600'}`}>MLA 9</button>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <input className="p-2 border rounded" placeholder="Last Name" value={data.authorLast} onChange={e => setData({...data, authorLast: e.target.value})} />
              <input className="p-2 border rounded" placeholder="First Name" value={data.authorFirst} onChange={e => setData({...data, authorFirst: e.target.value})} />
            </div>
            <input className="w-full p-2 border rounded mb-4" placeholder="Book/Article Title" value={data.title} onChange={e => setData({...data, title: e.target.value})} />
            <div className="grid grid-cols-2 gap-4 mb-4">
              <input className="p-2 border rounded" placeholder="Publisher / Website Name" value={data.publisher} onChange={e => setData({...data, publisher: e.target.value})} />
              <input className="p-2 border rounded" placeholder="Year" value={data.year} onChange={e => setData({...data, year: e.target.value})} />
            </div>
            <input className="w-full p-2 border rounded mb-6" placeholder="URL (optional)" value={data.url} onChange={e => setData({...data, url: e.target.value})} />
            
            <div className="bg-gray-50 p-4 rounded border">
              <p className="text-xs text-gray-500 uppercase font-bold mb-2">Result</p>
              <p className="font-serif text-lg select-all break-words">
                {generate() || <span className="text-gray-400 italic">Citation will appear here...</span>}
              </p>
            </div>
          </Card>

          {/* SEO Content Section */}
          <SEOContent>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">How to Use This Citation Helper?</h2>
            <p className="mb-4 leading-relaxed text-gray-600">
              Formatting citations can be tedious and error-prone, especially when you're rushing to finish a paper. Our Citation Helper supports both APA 7th edition and MLA 9th edition formats, the two most common citation styles in American colleges. Simply fill in the information about your source, select your preferred format, and the citation appears instantly.
            </p>
            <p className="mb-4 leading-relaxed text-gray-600">
              The tool handles all the formatting details automatically—commas, periods, parentheses, and capitalization are all correct. You can copy the citation directly into your paper's reference list or works cited page. No more worrying about punctuation errors or missing elements that could cost you points.
            </p>
            <p className="mb-6 leading-relaxed text-gray-600">
              All citation data is stored locally in your browser, so you can return later to edit or reference your citations. The tool works for books, articles, websites, and other common academic sources.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">Why Do I Need a Citation Helper?</h2>
            <p className="mb-4 leading-relaxed text-gray-600">
              Proper citation is essential for academic integrity and avoiding plagiarism. Many students lose points on papers due to incorrect citation formatting, even when their research and writing are solid. College stress and tight deadlines make it easy to make citation mistakes, which can hurt your GPA and academic standing.
            </p>
            <p className="mb-4 leading-relaxed text-gray-600">
              Our citation helper saves you time and ensures accuracy. Instead of spending hours looking up citation rules or using unreliable online generators filled with ads, you get instant, accurate citations in seconds. This frees up time for actual research and writing, helping you produce better papers and maintain your grades.
            </p>
            <p className="mb-6 leading-relaxed text-gray-600">
              Whether you're writing a research paper, literature review, or any academic assignment, proper citations show your professors that you understand academic standards and respect intellectual property. This attention to detail can make the difference between an A and a B, especially in courses with strict formatting requirements.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">APA vs MLA Citation Formats</h2>
            <p className="mb-4 leading-relaxed text-gray-600">
              Understanding when to use each format is crucial for academic success:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <h3 className="font-bold text-gray-900 mb-2">APA 7th Edition</h3>
              <p className="text-sm text-gray-600 mb-2">
                Used primarily in: Psychology, Education, Social Sciences, Business
              </p>
              <p className="text-sm text-gray-600">
                Format: Author, A. (Year). Title. Publisher. URL
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <h3 className="font-bold text-gray-900 mb-2">MLA 9th Edition</h3>
              <p className="text-sm text-gray-600 mb-2">
                Used primarily in: Literature, Languages, Humanities, Arts
              </p>
              <p className="text-sm text-gray-600">
                Format: Author. Title. Publisher, Year. URL.
              </p>
            </div>
            <p className="mb-6 leading-relaxed text-gray-600">
              Always check your assignment instructions or ask your professor which format to use. Some courses may have specific requirements that differ from standard guidelines.
            </p>
          </SEOContent>
        </div>
      </main>
      <Footer />
    </div>
  )
}

