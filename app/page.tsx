'use client'

import { useState } from 'react'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('')

  const tools = [
    { id: 'grade-calc', title: "Final Grade Calculator", desc: "Calculate exactly what you need on your final to keep your A.", icon: "fa-calculator", color: "text-indigo-600 bg-indigo-50" },
    { id: 'email-gen', title: "Email Template Gen", desc: "Write professional emails to professors in seconds using AI.", icon: "fa-envelope", color: "text-violet-600 bg-violet-50" },
    { id: 'deadlines', title: "Assignment Tracker", desc: "Never miss a due date. Prioritizes tasks by urgency.", icon: "fa-clock", color: "text-pink-600 bg-pink-50" },
    { id: 'citation', title: "Citation Helper", desc: "Format APA & MLA citations instantly for your papers.", icon: "fa-quote-right", color: "text-blue-600 bg-blue-50" },
    { id: 'pomodoro', title: "Study Room", desc: "Pomodoro timer + Lofi beats to get you in the zone.", icon: "fa-headphones", color: "text-amber-600 bg-amber-50" },
    { id: 'decision', title: "Decision Maker", desc: "Can't decide where to eat? Let the wheel decide.", icon: "fa-location-arrow", color: "text-emerald-600 bg-emerald-50" },
  ]

  const filteredTools = tools.filter(tool => 
    tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tool.desc.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <div className="bg-white pt-16 pb-20 px-4 sm:px-6 lg:px-8 border-b border-gray-100">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
              <span className="block">College Life,</span>
              <span className="block text-primary-600">Simplified.</span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Free tools to help you boost your GPA, write better emails, and manage your time. No sign-up required.
            </p>
            <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
              <div className="relative rounded-md shadow-sm w-full max-w-xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i className="fa-solid fa-search text-gray-400"></i>
                </div>
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-3 border" 
                  placeholder="Search tools..." 
                />
              </div>
            </div>
          </div>
        </div>

        {/* Tools Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTools.map((tool) => (
              <Link
                key={tool.id} 
                href={`/${tool.id}`}
                className="group relative bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-primary-500 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-200 border border-gray-100 cursor-pointer"
              >
                <div>
                  <div className={`shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center ring-4 ring-white ${tool.color}`}>
                    <i className={`fa-solid ${tool.icon} text-2xl`}></i>
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="text-lg font-medium">
                    <span className="absolute inset-0" aria-hidden="true"></span>
                    {tool.title}
                  </h3>
                  <p className="mt-2 text-sm text-gray-500">
                    {tool.desc}
                  </p>
                </div>
                <span className="pointer-events-none absolute top-6 right-6 text-gray-300 group-hover:text-gray-400" aria-hidden="true">
                  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 4h1a1 1 0 00-1-1v1zm-1 12a1 1 0 102 0h-2zM8 3a1 1 0 000 2V3zM3.293 19.293a1 1 0 101.414 1.414l-1.414-1.414zM19 4v12h2V4h-2zm1-1H8v2h12V3zm-.707.293l-16 16 1.414 1.414 16-16-1.414-1.414z" />
                  </svg>
                </span>
              </Link>
            ))}
            
            {filteredTools.length === 0 && (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500 text-lg">No tools found matching "{searchQuery}".</p>
                <button onClick={() => setSearchQuery('')} className="mt-4 text-primary-600 font-medium hover:underline">Clear search</button>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

