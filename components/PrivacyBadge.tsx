'use client'

import Link from 'next/link'

export default function PrivacyBadge() {
  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
      <div className="flex items-start gap-3">
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

