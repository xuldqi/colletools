import { useState, useEffect } from 'react'
import SectionHeader from '../components/SectionHeader'
import Card from '../components/Card'
import Button from '../components/Button'

export default function GradeCalc() {
  const [currentGrade, setCurrentGrade] = useState<string>('')
  const [desiredGrade, setDesiredGrade] = useState<string>('')
  const [finalWeight, setFinalWeight] = useState<string>('')
  const [result, setResult] = useState<number | null>(null)

  useEffect(() => {
    try {
      const saved = localStorage.getItem('colletools-grade-calc')
      if (saved) {
        const data = JSON.parse(saved)
        setCurrentGrade(data.currentGrade || '')
        setDesiredGrade(data.desiredGrade || '')
        setFinalWeight(data.finalWeight || '')
      }
    } catch (e) {
      console.error('Failed to load saved data', e)
    }
  }, [])

  useEffect(() => {
    if (currentGrade || desiredGrade || finalWeight) {
      localStorage.setItem('colletools-grade-calc', JSON.stringify({ currentGrade, desiredGrade, finalWeight }))
    }
  }, [currentGrade, desiredGrade, finalWeight])

  const calculate = () => {
    const c = parseFloat(currentGrade)
    const d = parseFloat(desiredGrade)
    const w = parseFloat(finalWeight)
    if (isNaN(c) || isNaN(d) || isNaN(w) || w <= 0) return
    const weightDecimal = w / 100
    const required = (d - c * (1 - weightDecimal)) / weightDecimal
    setResult(required)
  }

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <SectionHeader title="Final Grade Calculator" subtitle="Don't panic. Let's figure out exactly what you need to score on the final." />
      <Card>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Current Grade (%)</label>
            <input type="number" value={currentGrade} onChange={(e) => setCurrentGrade(e.target.value)} placeholder="e.g., 85" className="w-full pl-4 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Target Grade (%)</label>
              <input type="number" value={desiredGrade} onChange={(e) => setDesiredGrade(e.target.value)} placeholder="e.g., 90" className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Final Exam Weight (%)</label>
              <input type="number" value={finalWeight} onChange={(e) => setFinalWeight(e.target.value)} placeholder="e.g., 20" className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" />
            </div>
          </div>
          <Button onClick={calculate} className="w-full py-3 text-lg">Calculate Required Score</Button>
          {result !== null && (
            <div className={`mt-8 p-6 rounded-xl text-center border ${result > 100 ? 'bg-red-50 border-red-100 text-red-800' : 'bg-green-50 border-green-100 text-green-800'}`}>
              <p className="text-xs uppercase tracking-wider font-bold opacity-70 mb-2">You need to score at least</p>
              <p className="text-6xl font-bold mb-3">{result.toFixed(1)}%</p>
              <p className="text-base font-medium px-4">
                {result > 100 ? "Impossible? Maybe. Ask for extra credit or check if the professor curves!" : result > 90 ? "It's going to be tough, but you can do it. Study hard!" : result <= 0 ? "You've already clinched your goal! You could literally score 0." : "Totally achievable. You got this!"}
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
