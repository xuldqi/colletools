'use client'

interface DateInputProps {
  value: string
  onChange: (value: string) => void
  className?: string
}

export default function DateInput({ value, onChange, className = '' }: DateInputProps) {
  return (
    <div className="relative">
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={className}
        lang="en-US"
        style={{ direction: 'ltr' }}
      />
      <style jsx>{`
        input[type="date"]::-webkit-calendar-picker-indicator {
          cursor: pointer;
        }
        input[type="date"] {
          color-scheme: light;
        }
      `}</style>
    </div>
  )
}

