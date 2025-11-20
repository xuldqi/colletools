'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import SectionHeader from '@/components/SectionHeader'
import Card from '@/components/Card'
import Button from '@/components/Button'

export default function DecisionMaker() {
  const [options, setOptions] = useState<string[]>(['Library', 'Dorm', 'Coffee Shop'])
  const [newOption, setNewOption] = useState('')
  const [decision, setDecision] = useState<string | null>(null)
  const [isSpinning, setIsSpinning] = useState(false)

  const addOption = () => {
    if(newOption) {
      setOptions([...options, newOption])
      setNewOption('')
    }
  }

  const decide = () => {
    if (options.length === 0) return
    setIsSpinning(true)
    setDecision(null)
    setTimeout(() => {
      const random = options[Math.floor(Math.random() * options.length)]
      setDecision(random)
      setIsSpinning(false)
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">
      <Header />
      <main className="flex-grow">
        <div className="max-w-xl mx-auto py-10 px-4">
          <SectionHeader title="Decision Maker" subtitle="Can't decide where to eat or study? Let fate decide." />
          <Card>
            <div className="flex gap-2 mb-6">
              <input 
                className="flex-grow p-2 border rounded" 
                placeholder="Add option (e.g. Taco Bell)" 
                value={newOption} 
                onChange={e => setNewOption(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addOption()}
              />
              <Button onClick={addOption}>Add</Button>
            </div>
            <div className="flex flex-wrap gap-2 mb-8">
              {options.map((opt, i) => (
                <span key={i} className="bg-gray-100 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                  {opt}
                  <button onClick={() => setOptions(options.filter((_, idx) => idx !== i))} className="text-gray-400 hover:text-red-500">&times;</button>
                </span>
              ))}
            </div>
            <Button onClick={decide} disabled={isSpinning} className="w-full py-4 text-lg" variant="accent">
              {isSpinning ? "Deciding..." : "Decide for Me"}
            </Button>
            {decision && !isSpinning && (
              <div className="mt-6 text-center animate-bounce">
                <p className="text-sm text-gray-500 uppercase">The universe says</p>
                <p className="text-4xl font-bold text-primary-600">{decision}</p>
              </div>
            )}
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}

