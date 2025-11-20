'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function PrivacyBadge() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Check if user has dismissed the badge
    const dismissed = localStorage.getItem('colletools-privacy-badge-dismissed')
    if (!dismissed) {
      setIsVisible(true)
    }
  }, [])

  const handleClose = () => {
    setIsVisible(false)
    localStorage.setItem('colletools-privacy-badge-dismissed', 'true')
  }

  if (!isVisible) {
    return null
  }

  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 relative">
      <button
        onClick={handleClose}
        className="absolute top-2 right-2 text-green-600 hover:text-green-800 transition-colors"
        aria-label="Close privacy badge"
      >
        <i className="fa-solid fa-xmark text-lg"></i>
      </button>
      <div className="flex items-start gap-3 pr-6">
        <div className="flex-shrink-0">
          <i className="fa-solid fa-shield-halved text-green-600 text-xl"></i>
        </div>
        <div className="flex-grow">
          <h3 className="font-bold text-green-900 mb-1">Privacy First</h3>
          <p className="text-sm text-green-800 mb-2">
            <strong>No tracking.</strong> <strong>No data selling.</strong> <strong>Just a tool.</strong> We're the anti-Chegg.
          </p>
          <p className="text-xs text-green-700">
            All data stays in your browser. We don't collect, store, or sell your information. <Link href="/privacy" className="underline font-medium">Learn more</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

