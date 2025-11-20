'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import SectionHeader from '@/components/SectionHeader'
import Card from '@/components/Card'
import Button from '@/components/Button'

interface Assignment {
  id: number
  title: string
  date: string // ISO string YYYY-MM-DD
  course: string
  completed: boolean
  priority?: 'high' | 'medium' | 'low'
  notes?: string
}

export default function DeadlineTracker() {
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [newTitle, setNewTitle] = useState('')
  const [newDate, setNewDate] = useState('')
  const [newCourse, setNewCourse] = useState('')
  const [newPriority, setNewPriority] = useState<'high' | 'medium' | 'low'>('medium')
  const [newNotes, setNewNotes] = useState('')

  useEffect(() => {
    try {
      const saved = localStorage.getItem('colletools-assignments')
      if (saved) setAssignments(JSON.parse(saved))
    } catch (e) {
      console.error("Failed to load assignments", e)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('colletools-assignments', JSON.stringify(assignments))
  }, [assignments])

  const addAssignment = () => {
    if (!newTitle || !newDate) return
    const newItem: Assignment = {
      id: Date.now(),
      title: newTitle,
      date: newDate,
      course: newCourse,
      completed: false,
      priority: newPriority,
      notes: newNotes
    }
    setAssignments([...assignments, newItem].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()))
    setNewTitle('')
    setNewDate('')
    setNewCourse('')
    setNewPriority('medium')
    setNewNotes('')
  }

  const toggleComplete = (id: number) => {
    setAssignments(assignments.map(a => a.id === id ? {...a, completed: !a.completed} : a))
  }

  const deleteAssignment = (id: number) => {
    setAssignments(assignments.filter(a => a.id !== id))
  }

  const getUrgencyColor = (dateStr: string, completed: boolean) => {
    if (completed) return 'border-green-500 bg-green-50 opacity-60'
    const daysLeft = Math.ceil((new Date(dateStr).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    if (daysLeft < 0) return 'border-gray-300 bg-gray-100'
    if (daysLeft <= 2) return 'border-red-500 bg-red-50'
    if (daysLeft <= 7) return 'border-yellow-500 bg-yellow-50'
    return 'border-primary-200 bg-white'
  }

  const getDaysText = (dateStr: string) => {
    const daysLeft = Math.ceil((new Date(dateStr).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    if (daysLeft < 0) return 'Overdue'
    if (daysLeft === 0) return 'Today'
    if (daysLeft === 1) return 'Tomorrow'
    return `${daysLeft} days left`
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900" lang="en">
      <Header />
      <main className="flex-grow">
        <div className="max-w-3xl mx-auto py-10 px-4">
          <SectionHeader title="Deadline Tracker" subtitle="Keep track of your assignments. Don't let them sneak up on you." />
          
          <Card className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
              <div className="md:col-span-4">
                <label className="text-xs font-bold text-gray-500 uppercase">Assignment</label>
                <input type="text" value={newTitle} onChange={e => setNewTitle(e.target.value)} className="w-full p-2 border rounded" placeholder="Essay #1" />
              </div>
              <div className="md:col-span-3">
                <label className="text-xs font-bold text-gray-500 uppercase">Course</label>
                <input type="text" value={newCourse} onChange={e => setNewCourse(e.target.value)} className="w-full p-2 border rounded" placeholder="HIST 202" />
              </div>
              <div className="md:col-span-3">
                <label className="text-xs font-bold text-gray-500 uppercase">Due Date</label>
                <input 
                  type="date" 
                  lang="en"
                  value={newDate} 
                  onChange={e => setNewDate(e.target.value)} 
                  className="w-full p-2 border rounded" 
                  style={{ direction: 'ltr' }}
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-xs font-bold text-gray-500 uppercase">Priority</label>
                <select value={newPriority} onChange={e => setNewPriority(e.target.value as any)} className="w-full p-2 border rounded bg-white">
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div className="md:col-span-10">
                <label className="text-xs font-bold text-gray-500 uppercase">Notes (Optional)</label>
                <input type="text" value={newNotes} onChange={e => setNewNotes(e.target.value)} className="w-full p-2 border rounded" placeholder="Details..." />
              </div>
              <div className="md:col-span-2">
                <Button onClick={addAssignment} className="w-full"><i className="fa-solid fa-plus"></i> Add</Button>
              </div>
            </div>
          </Card>

          <div className="space-y-3">
            {assignments.length === 0 && <p className="text-center text-gray-400 py-10">No assignments yet. You're free!</p>}
            {assignments.map(a => (
              <div key={a.id} className={`border-l-4 p-4 rounded-r-lg shadow-sm flex justify-between items-center transition-all ${getUrgencyColor(a.date, a.completed)}`}>
                <div className="flex items-center gap-3 overflow-hidden flex-grow mr-4">
                  <button onClick={() => toggleComplete(a.id)} className={`shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center ${a.completed ? 'bg-green-500 border-green-500 text-white' : 'border-gray-400 text-transparent hover:border-green-500'}`}>
                    <i className="fa-solid fa-check text-xs"></i>
                  </button>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className={`font-bold text-gray-800 truncate ${a.completed ? 'line-through text-gray-500' : ''}`}>{a.title}</p>
                      {a.priority === 'high' && !a.completed && <span className="text-[10px] font-bold bg-red-100 text-red-600 px-1.5 rounded uppercase">High</span>}
                    </div>
                    <p className="text-xs text-gray-600 truncate">{a.course} • {new Date(a.date).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' })}</p>
                    {a.notes && <p className="text-xs text-gray-500 mt-1 truncate italic">{a.notes}</p>}
                  </div>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  {!a.completed && (
                    <span className={`text-xs font-bold px-2 py-1 rounded ${new Date(a.date) < new Date() ? 'text-red-600 bg-red-100' : 'text-primary-600 bg-primary-50'}`}>
                      {getDaysText(a.date)}
                    </span>
                  )}
                  <button onClick={() => deleteAssignment(a.id)} className="text-gray-400 hover:text-red-500"><i className="fa-solid fa-trash"></i></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

