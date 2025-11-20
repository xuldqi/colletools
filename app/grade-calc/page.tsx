'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import SectionHeader from '@/components/SectionHeader'
import Card from '@/components/Card'
import Button from '@/components/Button'
import SEOContent from '@/components/SEOContent'

export default function GradeCalculator() {
  const [currentGrade, setCurrentGrade] = useState<string>('')
  const [desiredGrade, setDesiredGrade] = useState<string>('')
  const [finalWeight, setFinalWeight] = useState<string>('')
  const [result, setResult] = useState<number | null>(null)

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
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">
      <Header />
      <main className="flex-grow">
        <div className="max-w-2xl mx-auto py-10 px-4">
          <SectionHeader 
            title="Final Grade Calculator" 
            subtitle="Don't panic. Let's figure out exactly what you need to score on the final." 
          />
          <Card>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Grade (%)</label>
                <div className="relative">
                  <input 
                    type="number" 
                    value={currentGrade}
                    onChange={(e) => setCurrentGrade(e.target.value)}
                    placeholder="e.g., 85"
                    className="w-full pl-4 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none transition-shadow"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Target Grade (%)</label>
                  <input 
                    type="number" 
                    value={desiredGrade}
                    onChange={(e) => setDesiredGrade(e.target.value)}
                    placeholder="e.g., 90"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none transition-shadow"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Final Exam Weight (%)</label>
                  <input 
                    type="number" 
                    value={finalWeight}
                    onChange={(e) => setFinalWeight(e.target.value)}
                    placeholder="e.g., 20"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none transition-shadow"
                  />
                </div>
              </div>
              
              <Button onClick={calculate} className="w-full py-3 text-lg shadow-lg shadow-primary-500/30">
                Calculate Required Score
              </Button>

              {result !== null && (
                <div className={`mt-8 p-6 rounded-xl text-center border transform transition-all duration-500 ${result > 100 ? 'bg-red-50 border-red-100 text-red-800' : 'bg-green-50 border-green-100 text-green-800'}`}>
                  <p className="text-xs uppercase tracking-wider font-bold opacity-70 mb-2">You need to score at least</p>
                  <p className="text-6xl font-bold mb-3 tracking-tight">{result.toFixed(1)}%</p>
                  <p className="text-base font-medium px-4">
                    {result > 100 
                      ? "Impossible? Maybe. Ask for extra credit or check if the professor curves!" 
                      : result > 90
                        ? "It's going to be tough, but you can do it. Study hard!"
                        : result <= 0 
                          ? "You've already clinched your goal! You could literally score 0." 
                          : "Totally achievable. You got this!"}
                  </p>
                </div>
              )}
            </div>
          </Card>

          {/* SEO Content Section */}
          <SEOContent>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">How to Use the Final Grade Calculator</h2>
            <p className="mb-4 leading-relaxed text-gray-600">
              Finals week is stressful enough without having to do complex algebra in your head. Our <strong>Final Grade Calculator</strong> is designed to answer the one question every college student asks at the end of the semester: <em>"What do I need to score on my final exam to get an A?"</em>
            </p>
            <p className="mb-4 leading-relaxed text-gray-600">Here is how to find out your required score in seconds:</p>
            <ul className="list-disc pl-5 mb-6 space-y-2 text-gray-600">
              <li><strong>Current Grade (%):</strong> Enter your current grade in the class before the final exam. You can usually find this on Canvas, Blackboard, or your syllabus.</li>
              <li><strong>Target Grade (%):</strong> Enter the grade you <em>want</em> to end up with for the semester (e.g., 90% for an A, 80% for a B).</li>
              <li><strong>Final Exam Weight (%):</strong> Enter how much your final exam is worth. This is typically 15%, 20%, or sometimes up to 50% of your total grade.</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">The Math Behind the Calculator</h2>
            <p className="mb-4 leading-relaxed text-gray-600">
              Curious about how the numbers work? If you want to calculate it manually, here is the formula we use:
            </p>
            <blockquote className="bg-gray-50 p-4 border-l-4 border-primary-500 font-mono text-sm text-gray-700 mb-6">
              Required Score = (Target Grade - (Current Grade × (100% - Final Weight))) / Final Weight
            </blockquote>
            <p className="mb-6 leading-relaxed text-gray-600">
              For example, if you have an <strong>85%</strong> average, you want a <strong>90%</strong> (A) in the class, and your final is worth <strong>20%</strong>, the calculation would show that you need an impossible <strong>110%</strong> on the final. Time to adjust that target grade to a B+!
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">Common College Grading Scale (US)</h2>
            <p className="mb-4 leading-relaxed text-gray-600">
              While every professor and university is different, here is the standard grading scale used in most US colleges:
            </p>
            <ul className="list-disc pl-5 mb-6 space-y-2 text-gray-600">
              <li><strong>A:</strong> 90% - 100% (4.0 GPA)</li>
              <li><strong>B:</strong> 80% - 89% (3.0 GPA)</li>
              <li><strong>C:</strong> 70% - 79% (2.0 GPA)</li>
              <li><strong>D:</strong> 60% - 69% (1.0 GPA)</li>
              <li><strong>F:</strong> 0% - 59% (0.0 GPA)</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">Study Tips to Hit Your Target Grade</h2>
            <p className="mb-4 leading-relaxed text-gray-600">
              Now that you know the score you need, it's time to focus. Don't forget to check out our <a href="/pomodoro" className="text-primary-600 underline cursor-pointer font-medium">Study Room</a> to use the Pomodoro timer with Lo-Fi music, or use our <a href="/citation" className="text-primary-600 underline cursor-pointer font-medium">Citation Helper</a> to finish those final papers faster.
            </p>
          </SEOContent>
        </div>
      </main>
      <Footer />
    </div>
  )
}

