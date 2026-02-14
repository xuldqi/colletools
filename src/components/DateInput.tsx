import { useState, useEffect } from 'react'

interface DateInputProps {
  value: string
  onChange: (value: string) => void
  className?: string
}

export default function DateInput({ value, onChange, className = '' }: DateInputProps) {
  const getDisplayValue = (val: string) => {
    if (val) {
      const [year, month, day] = val.split('-')
      if (year && month && day) return `${month}/${day}/${year}`
    }
    return ''
  }
  const [displayValue, setDisplayValue] = useState(() => getDisplayValue(value))
  useEffect(() => setDisplayValue(getDisplayValue(value)), [value])

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.replace(/\D/g, '')
    let formatted = ''
    if (input.length > 0) {
      formatted = input.substring(0, 2)
      if (input.length > 2) formatted += '/' + input.substring(2, 4)
      if (input.length > 4) formatted += '/' + input.substring(4, 8)
    }
    setDisplayValue(formatted)
    if (formatted.length === 10) {
      const [month, day, year] = formatted.split('/')
      if (month && day && year && parseInt(month) >= 1 && parseInt(month) <= 12 &&
          parseInt(day) >= 1 && parseInt(day) <= 31 && parseInt(year) >= 1900 && parseInt(year) <= 2100) {
        onChange(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`)
      }
    } else if (formatted.length === 0) onChange('')
  }

  return (
    <div className="relative">
      <input type="text" value={displayValue} onChange={handleTextChange} placeholder="MM/DD/YYYY" className={className} maxLength={10} />
      <input type="date" value={value} onChange={(e) => onChange(e.target.value)} className="absolute right-0 top-0 h-full w-8 opacity-0 cursor-pointer" />
      <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400"><i className="fa-regular fa-calendar"></i></div>
    </div>
  )
}
