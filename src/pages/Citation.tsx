import { useState, useEffect } from 'react'
import SectionHeader from '../components/SectionHeader'
import Card from '../components/Card'

export default function Citation() {
  const [data, setData] = useState({ authorLast: '', authorFirst: '', title: '', publisher: '', year: '', url: '' })
  const [format, setFormat] = useState<'apa' | 'mla'>('apa')

  useEffect(() => {
    try {
      const saved = localStorage.getItem('colletools-citation')
      if (saved) {
        const savedData = JSON.parse(saved)
        setData(savedData.data || data)
        setFormat(savedData.format || 'apa')
      }
    } catch (e) {
      console.error('Failed to load saved data', e)
    }
  }, [])

  useEffect(() => {
    if (data.authorLast || data.authorFirst || data.title || data.publisher || data.year || data.url) {
      localStorage.setItem('colletools-citation', JSON.stringify({ data, format }))
    }
  }, [data, format])

  const generate = () => {
    const { authorLast, authorFirst, title, publisher, year, url } = data
    const hasAnyData = authorLast || authorFirst || title || publisher || year || url
    if (!hasAnyData) return null
    const parts: string[] = []
    if (format === 'apa') {
      if (authorLast) parts.push(authorFirst ? `${authorLast}, ${authorFirst[0]}.` : authorLast)
      if (authorLast || title) parts.push(`(${year || 'n.d.'}).`)
      if (title) parts.push(`${title}.`)
      if (publisher) parts.push(`${publisher}.`)
      if (url) parts.push(url)
    } else {
      if (authorLast) parts.push(authorFirst ? `${authorLast}, ${authorFirst}.` : authorLast)
      if (title) parts.push(`${title}.`)
      const pubYear = [publisher, year].filter(Boolean).join(', ')
      if (pubYear) parts.push(`${pubYear}.`)
      if (url) parts.push(url + '.')
    }
    return parts.length > 0 ? parts.join(' ') : null
  }

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <SectionHeader title="Citation Helper" subtitle="Format references quickly without ads or popups." />
      <Card>
        <div className="flex gap-4 mb-6 border-b pb-4">
          <button onClick={() => setFormat('apa')} className={`px-4 py-1 rounded-full text-sm font-bold ${format === 'apa' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600'}`}>APA 7</button>
          <button onClick={() => setFormat('mla')} className={`px-4 py-1 rounded-full text-sm font-bold ${format === 'mla' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600'}`}>MLA 9</button>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <input className="p-2 border rounded" placeholder="Last Name" value={data.authorLast} onChange={(e) => setData({ ...data, authorLast: e.target.value })} />
          <input className="p-2 border rounded" placeholder="First Name" value={data.authorFirst} onChange={(e) => setData({ ...data, authorFirst: e.target.value })} />
        </div>
        <input className="w-full p-2 border rounded mb-4" placeholder="Book/Article Title" value={data.title} onChange={(e) => setData({ ...data, title: e.target.value })} />
        <div className="grid grid-cols-2 gap-4 mb-4">
          <input className="p-2 border rounded" placeholder="Publisher / Website Name" value={data.publisher} onChange={(e) => setData({ ...data, publisher: e.target.value })} />
          <input className="p-2 border rounded" placeholder="Year" value={data.year} onChange={(e) => setData({ ...data, year: e.target.value })} />
        </div>
        <input className="w-full p-2 border rounded mb-6" placeholder="URL (optional)" value={data.url} onChange={(e) => setData({ ...data, url: e.target.value })} />
        <div className="bg-gray-50 p-4 rounded border">
          <p className="text-xs text-gray-500 uppercase font-bold mb-2">Result</p>
          <p className="font-serif text-lg select-all break-words">{generate() || <span className="text-gray-400 italic">Citation will appear here...</span>}</p>
        </div>
      </Card>
    </div>
  )
}
