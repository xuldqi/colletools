'use client'

import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-16 py-10 px-5 text-sm text-gray-600">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-wrap justify-between gap-8 mb-10">
          <div className="flex-1 min-w-[200px]">
            <Link href="/" className="font-bold text-lg text-gray-900 mb-2 block no-underline">
              🎓 ColleTools
            </Link>
            <p className="text-gray-500 leading-relaxed mb-2">
              The essential digital toolkit for college students. Calculate grades, generate citations, and boost productivity.
            </p>
            <p className="text-xs text-gray-500 mt-2">
              <strong>No tracking. No data selling.</strong> Just a tool.
            </p>
          </div>

          <div className="flex-1 min-w-[200px]">
            <div className="font-semibold text-gray-700 mb-3">Tools</div>
            <div className="flex flex-col space-y-2">
              <Link href="/grade-calc" className="text-gray-600 no-underline hover:text-primary-600 transition-colors">
                Final Grade Calculator
              </Link>
              <Link href="/email-gen" className="text-gray-600 no-underline hover:text-primary-600 transition-colors">
                Email Templates
              </Link>
              <Link href="/citation" className="text-gray-600 no-underline hover:text-primary-600 transition-colors">
                Citation Helper
              </Link>
              <Link href="/pomodoro" className="text-gray-600 no-underline hover:text-primary-600 transition-colors">
                Study Room
              </Link>
            </div>
          </div>

          <div className="flex-1 min-w-[200px]">
            <div className="font-semibold text-gray-700 mb-3">Legal</div>
            <div className="flex flex-col space-y-2 mb-4">
              <Link href="/privacy" className="text-gray-600 no-underline hover:text-primary-600 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-600 no-underline hover:text-primary-600 transition-colors">
                Terms of Service
              </Link>
              <a href="mailto:novemeber11@gmail.com" className="text-gray-600 no-underline hover:text-primary-600 transition-colors">
                Contact Us
              </a>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              <strong>Disclaimer:</strong> ColleTools is an educational tool. Results from calculators are estimates only. Please confirm official grades with your institution.
            </p>
          </div>
        </div>

        <div className="text-center pt-8 border-t border-gray-200 text-xs text-gray-400">
          &copy; 2025 ColleTools.com. All rights reserved. Made for students, by students.
        </div>
      </div>
    </footer>
  )
}
