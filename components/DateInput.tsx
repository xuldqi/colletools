'use client'

import { useState, useEffect } from 'react'

interface DateInputProps {
  value: string // YYYY-MM-DD format
  onChange: (value: string) => void
  className?: string
}

export default function DateInput({ value, onChange, className = '' }: DateInputProps) {
  const [displayValue, setDisplayValue] = useState('')
  const [showPicker, setShowPicker] = useState(false)

  // Convert YYYY-MM-DD to MM/DD/YYYY for display
  useEffect(() => {
    if (value) {
      const [year, month, day] = value.split('-')
      if (year && month && day) {
        setDisplayValue(`${month}/${day}/${year}`)
      } else {
        setDisplayValue('')
      }
    } else {
      setDisplayValue('')
    }
  }, [value])

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let input = e.target.value.replace(/\D/g, '') // Remove non-digits
    
    // Format as MM/DD/YYYY
    let formatted = ''
    if (input.length > 0) {
      formatted = input.substring(0, 2) // Month
      if (input.length > 2) {
        formatted += '/' + input.substring(2, 4) // Day
      }
      if (input.length > 4) {
        formatted += '/' + input.substring(4, 8) // Year (limit to 4 digits)
      }
    }
    
    setDisplayValue(formatted)
    
    // Convert MM/DD/YYYY to YYYY-MM-DD when complete
    if (formatted.length === 10) {
      const [month, day, year] = formatted.split('/')
      if (month && day && year && 
          parseInt(month) >= 1 && parseInt(month) <= 12 &&
          parseInt(day) >= 1 && parseInt(day) <= 31 &&
          parseInt(year) >= 1900 && parseInt(year) <= 2100) {
        const dateStr = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
        const date = new Date(dateStr + 'T00:00:00')
        if (!isNaN(date.getTime()) && 
            date.getMonth() + 1 === parseInt(month) && 
            date.getDate() === parseInt(day)) {
          onChange(dateStr)
        }
      }
    } else if (formatted.length === 0) {
      onChange('')
    }
  }

  const handleDatePickerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value)
  }

  return (
    <div className="relative">
      {/* Text input for MM/DD/YYYY display */}
      <input
        type="text"
        value={displayValue}
        onChange={handleTextChange}
        placeholder="MM/DD/YYYY"
        className={className}
        style={{ direction: 'ltr' }}
        maxLength={10}
        onFocus={() => setShowPicker(true)}
      />
      {/* Hidden native date picker for calendar icon */}
      <input
        type="date"
        value={value}
        onChange={handleDatePickerChange}
        className="absolute right-0 top-0 h-full w-8 opacity-0 cursor-pointer"
        style={{ pointerEvents: 'auto' }}
        title="Open calendar"
      />
      {/* Calendar icon overlay */}
      <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
        <i className="fa-regular fa-calendar"></i>
      </div>
    </div>
  )
}
