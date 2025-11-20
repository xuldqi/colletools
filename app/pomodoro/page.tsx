'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import SectionHeader from '@/components/SectionHeader'
import Card from '@/components/Card'
import Button from '@/components/Button'
import SEOContent from '@/components/SEOContent'

export default function PomodoroTimer() {
  const [minutes, setMinutes] = useState(25)
  const [seconds, setSeconds] = useState(0)
  const [isActive, setIsActive] = useState(false)
  const [mode, setMode] = useState<'work' | 'break'>('work')
  
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    if (isActive) {
      interval = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            setIsActive(false)
            // Timer done
            const audio = new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg')
            audio.play()
          } else {
            setMinutes(minutes - 1)
            setSeconds(59)
          }
        } else {
          setSeconds(seconds - 1)
        }
      }, 1000)
    } else if (!isActive && seconds !== 0) {
      if (interval) clearInterval(interval)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isActive, seconds, minutes])

  const toggleTimer = () => setIsActive(!isActive)
  const resetTimer = () => {
    setIsActive(false)
    setMinutes(mode === 'work' ? 25 : 5)
    setSeconds(0)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">
      <Header />
      <main className="flex-grow">
        <div className="max-w-4xl mx-auto py-10 px-4">
          <SectionHeader title="Study Room" subtitle="Lo-fi beats and a timer. Pure focus." />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <Card className="flex flex-col items-center justify-center py-12">
              <div className="flex gap-2 mb-8">
                <button onClick={() => {setMode('work'); setMinutes(25); setSeconds(0); setIsActive(false);}} className={`px-4 py-1 rounded-full text-sm font-bold ${mode === 'work' ? 'bg-primary-100 text-primary-700' : 'text-gray-500'}`}>Work (25m)</button>
                <button onClick={() => {setMode('break'); setMinutes(5); setSeconds(0); setIsActive(false);}} className={`px-4 py-1 rounded-full text-sm font-bold ${mode === 'break' ? 'bg-green-100 text-green-700' : 'text-gray-500'}`}>Break (5m)</button>
              </div>
              <div className="text-8xl font-bold text-gray-800 font-mono mb-8">
                {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
              </div>
              <div className="flex gap-4">
                <Button onClick={toggleTimer} className="w-32">{isActive ? 'Pause' : 'Start'}</Button>
                <Button onClick={resetTimer} variant="secondary" className="w-32">Reset</Button>
              </div>
            </Card>
            
            {/* Spotify Embed */}
            <div className="w-full">
              <iframe 
                style={{borderRadius: "12px"}} 
                src="https://open.spotify.com/embed/playlist/0vvXsWCC9xrXsKd4FyS8kM?utm_source=generator&theme=0" 
                width="100%" 
                height="152" 
                frameBorder="0" 
                allowFullScreen 
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                loading="lazy"
                title="Lofi Girl Playlist"
              >
              </iframe>
            </div>
          </div>

          {/* SEO Content Section */}
          <SEOContent>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">How to Use This Study Room?</h2>
            <p className="mb-4 leading-relaxed text-gray-600">
              The Pomodoro Technique is a time management method that breaks work into 25-minute focused intervals (called "pomodoros") followed by 5-minute breaks. Our Study Room combines this proven technique with Lo-Fi music to create the perfect study environment. Simply select "Work (25m)" or "Break (5m)", click Start, and focus on your task.
            </p>
            <p className="mb-4 leading-relaxed text-gray-600">
              The timer displays prominently in large, easy-to-read numbers, so you always know how much time remains. When a work session completes, an audio alert notifies you to take a break. The built-in Lo-Fi music playlist helps create a calm, focused atmosphere that many students find improves concentration and reduces distractions.
            </p>
            <p className="mb-6 leading-relaxed text-gray-600">
              Regular breaks prevent burnout and maintain mental freshness, which is crucial during long study sessions. The Pomodoro Technique helps you maintain focus, avoid procrastination, and make steady progress on your assignments without feeling overwhelmed.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">Why Do I Need a Pomodoro Timer for Studying?</h2>
            <p className="mb-4 leading-relaxed text-gray-600">
              College students often struggle with focus, especially when dealing with college stress and overwhelming workloads. The Pomodoro Technique addresses this by breaking large tasks into manageable chunks, making it easier to start and maintain momentum. Research shows that focused work intervals improve productivity and reduce mental fatigue.
            </p>
            <p className="mb-4 leading-relaxed text-gray-600">
              During finals week or when working on major projects, maintaining focus for hours at a time becomes difficult. The Pomodoro method helps you stay productive by providing structured breaks that prevent burnout. The combination of focused work time and regular rest periods is more effective than trying to study for hours without breaks.
            </p>
            <p className="mb-6 leading-relaxed text-gray-600">
              The Lo-Fi music component helps create a study-friendly environment by providing background noise that masks distractions without being too engaging. This ambient sound helps many students enter a "flow state" where they can work more efficiently and retain information better.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">Pomodoro Technique Best Practices</h2>
            <p className="mb-4 leading-relaxed text-gray-600">
              To get the most out of the Pomodoro Technique:
            </p>
            <ul className="list-disc pl-5 mb-6 space-y-2 text-gray-600">
              <li><strong>Eliminate Distractions:</strong> Put your phone away, close unnecessary browser tabs, and focus solely on your task during the 25-minute work period.</li>
              <li><strong>Respect the Breaks:</strong> Take your 5-minute breaks seriously. Stand up, stretch, get water, or briefly step away from your desk.</li>
              <li><strong>Track Your Progress:</strong> After completing four pomodoros, take a longer 15-30 minute break to recharge.</li>
              <li><strong>Adjust as Needed:</strong> If 25 minutes feels too short or too long, you can modify the timer, but try to maintain the work-break rhythm.</li>
            </ul>
            <p className="mb-6 leading-relaxed text-gray-600">
              The technique works best when you commit to it fully. During work periods, avoid checking social media, responding to messages, or multitasking. The goal is deep, focused work that helps you make real progress on your assignments and study materials.
            </p>
          </SEOContent>
        </div>
      </main>
      <Footer />
    </div>
  )
}

