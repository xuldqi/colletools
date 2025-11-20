'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Header() {
  const pathname = usePathname()

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link 
            href="/"
            className="flex items-center cursor-pointer group" 
          >
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white mr-2 group-hover:bg-primary-700 transition-colors">
              <i className="fa-solid fa-graduation-cap"></i>
            </div>
            <span className="font-bold text-xl text-gray-900 tracking-tight">ColleTools</span>
          </Link>
          <nav className="hidden md:flex space-x-8 text-sm font-medium">
            <Link href="/grade-calc" className={`hover:text-primary-600 ${pathname === '/grade-calc' ? 'text-primary-600' : 'text-gray-500'}`}>Academics</Link>
            <Link href="/email-gen" className={`hover:text-primary-600 ${pathname === '/email-gen' ? 'text-primary-600' : 'text-gray-500'}`}>Campus Life</Link>
            <Link href="/deadlines" className={`hover:text-primary-600 ${pathname === '/deadlines' ? 'text-primary-600' : 'text-gray-500'}`}>Productivity</Link>
          </nav>
          <div className="flex items-center space-x-4">
            <Link href="/" className="text-gray-400 hover:text-gray-600">
              <i className="fa-solid fa-magnifying-glass"></i>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}

