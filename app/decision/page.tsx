'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import SectionHeader from '@/components/SectionHeader'
import Card from '@/components/Card'
import Button from '@/components/Button'
import SEOContent from '@/components/SEOContent'

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

          {/* SEO Content Section */}
          <SEOContent>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">How to Use This Decision Maker?</h2>
            <p className="mb-4 leading-relaxed text-gray-600">
              Decision fatigue is real, especially for college students juggling multiple choices every day. Our Decision Maker tool helps you make quick choices by randomly selecting from your options. Simply add all your options (like study locations, meal choices, or activity options), click "Decide for Me," and let the tool choose.
            </p>
            <p className="mb-4 leading-relaxed text-gray-600">
              The tool uses a fair random selection algorithm, so each option has an equal chance of being chosen. You can add as many options as you need and remove any that no longer apply. The decision is displayed prominently with a fun animation, making the process engaging rather than stressful.
            </p>
            <p className="mb-6 leading-relaxed text-gray-600">
              This tool is perfect for non-critical decisions where any choice is acceptable. It saves mental energy for more important decisions and helps you move forward when you're stuck in analysis paralysis.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">Why Do I Need a Decision Maker Tool?</h2>
            <p className="mb-4 leading-relaxed text-gray-600">
              College students face countless small decisions daily: where to study, what to eat, which assignment to tackle first, or how to spend free time. These micro-decisions can contribute to decision fatigue and college stress, leaving you mentally exhausted before you even tackle important academic work.
            </p>
            <p className="mb-4 leading-relaxed text-gray-600">
              By automating trivial decisions, you preserve mental energy for choices that actually matter—like how to approach a difficult assignment or which courses to take next semester. The decision maker helps you break free from overthinking and move forward with confidence, reducing stress and improving your overall productivity.
            </p>
            <p className="mb-6 leading-relaxed text-gray-600">
              Sometimes, the best decision is simply making a decision. When all options are roughly equivalent, spending time deliberating is counterproductive. The decision maker helps you recognize when a choice doesn't require extensive analysis and encourages you to move forward quickly.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">When to Use the Decision Maker</h2>
            <p className="mb-4 leading-relaxed text-gray-600">
              The decision maker is ideal for:
            </p>
            <ul className="list-disc pl-5 mb-6 space-y-2 text-gray-600">
              <li><strong>Study Locations:</strong> Choosing between library, coffee shop, dorm room, or study lounge</li>
              <li><strong>Meal Choices:</strong> Deciding where to eat when all options seem equally appealing</li>
              <li><strong>Break Activities:</strong> Selecting how to spend study breaks to maximize relaxation</li>
              <li><strong>Assignment Order:</strong> When multiple assignments have similar priority and deadlines</li>
              <li><strong>Social Plans:</strong> Choosing between equally appealing weekend activities or events</li>
            </ul>
            <p className="mb-6 leading-relaxed text-gray-600">
              Remember: Use this tool for low-stakes decisions where any choice is acceptable. For important academic or life decisions, take time to consider your options carefully. The decision maker is a tool to reduce decision fatigue, not a replacement for thoughtful consideration when it matters.
            </p>
          </SEOContent>
        </div>
      </main>
      <Footer />
    </div>
  )
}

