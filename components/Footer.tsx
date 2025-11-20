'use client'

import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-16 py-12 text-sm font-sans text-gray-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Brand Section */}
        <div className="flex flex-col">
          <Link 
            href="/"
            className="flex items-center cursor-pointer group mb-4" 
          >
            <span className="font-bold text-lg text-gray-900">🎓 ColleTools</span>
          </Link>
          <p className="text-gray-500 leading-relaxed">
            The essential digital toolkit for college students. Calculate grades, generate citations, and boost productivity.
          </p>
        </div>

        {/* Tools Links */}
        <div>
          <h3 className="font-bold text-gray-900 mb-4 uppercase text-xs tracking-wider">Tools</h3>
          <div className="flex flex-col space-y-2">
            <Link href="/grade-calc" className="text-left hover:text-primary-600 transition-colors">Final Grade Calculator</Link>
            <Link href="/email-gen" className="text-left hover:text-primary-600 transition-colors">Email Templates</Link>
            <Link href="/citation" className="text-left hover:text-primary-600 transition-colors">Citation Helper</Link>
            <Link href="/pomodoro" className="text-left hover:text-primary-600 transition-colors">Study Room</Link>
          </div>
        </div>

        {/* Legal Section */}
        <div>
          <h3 className="font-bold text-gray-900 mb-4 uppercase text-xs tracking-wider">Legal</h3>
          <div className="flex flex-col space-y-2 mb-4">
            <Link href="/privacy" className="text-left hover:text-primary-600 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="text-left hover:text-primary-600 transition-colors">Terms of Service</Link>
            <a href="mailto:novemeber11@gmail.com" className="hover:text-primary-600 transition-colors">Contact Us</a>
          </div>
          <p className="text-xs text-gray-400 leading-relaxed">
            <strong>Disclaimer:</strong> ColleTools is an educational tool. Results from calculators are estimates only. Please confirm official grades with your institution.
          </p>
        </div>
      </div>

      {/* Copyright */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-gray-200 text-center text-gray-400 text-xs">
        &copy; 2025 ColleTools.com. All rights reserved. Made for students, by students.
      </div>
    </footer>
  )
}

