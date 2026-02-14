import { useState, useEffect } from 'react'
import SectionHeader from '../components/SectionHeader'
import Card from '../components/Card'
import Button from '../components/Button'

export default function Pomodoro() {
  const [minutes, setMinutes] = useState(25)
  const [seconds, setSeconds] = useState(0)
  const [isActive, setIsActive] = useState(false)
  const [mode, setMode] = useState<'work' | 'break'>('work')

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null
    if (isActive) {
      interval = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            setIsActive(false)
            new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg').play()
          } else {
            setMinutes((m) => m - 1)
            setSeconds(59)
          }
        } else setSeconds((s) => s - 1)
      }, 1000)
    }
    return () => { if (interval) clearInterval(interval) }
  }, [isActive, seconds, minutes])

  const toggleTimer = () => setIsActive(!isActive)
  const resetTimer = () => {
    setIsActive(false)
    setMinutes(mode === 'work' ? 25 : 5)
    setSeconds(0)
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <SectionHeader title="Study Room" subtitle="Lo-fi beats and a timer. Pure focus." />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <Card className="flex flex-col items-center justify-center py-12">
          <div className="flex gap-2 mb-8">
            <button onClick={() => { setMode('work'); setMinutes(25); setSeconds(0); setIsActive(false) }} className={`px-4 py-1 rounded-full text-sm font-bold ${mode === 'work' ? 'bg-primary-100 text-primary-700' : 'text-gray-500'}`}>Work (25m)</button>
            <button onClick={() => { setMode('break'); setMinutes(5); setSeconds(0); setIsActive(false) }} className={`px-4 py-1 rounded-full text-sm font-bold ${mode === 'break' ? 'bg-green-100 text-green-700' : 'text-gray-500'}`}>Break (5m)</button>
          </div>
          <div className="text-8xl font-bold text-gray-800 font-mono mb-8">
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </div>
          <div className="flex gap-4">
            <Button onClick={toggleTimer} className="w-32">{isActive ? 'Pause' : 'Start'}</Button>
            <Button onClick={resetTimer} variant="secondary" className="w-32">Reset</Button>
          </div>
        </Card>
        <div className="w-full">
          <iframe
            style={{ borderRadius: '12px' }}
            src="https://open.spotify.com/embed/playlist/0vvXsWCC9xrXsKd4FyS8kM?utm_source=generator&theme=0"
            width="100%"
            height="152"
            frameBorder="0"
            allowFullScreen
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            title="Lofi Girl Playlist"
          />
        </div>
      </div>
    </div>
  )
}
