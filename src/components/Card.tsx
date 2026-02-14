interface CardProps {
  children?: React.ReactNode
  className?: string
}

export default function Card({ children, className = '' }: CardProps) {
  return (
    <div className={`bg-white rounded-xl shadow-soft border border-slate-100 p-6 transition-all hover:shadow-md hover:border-primary-100 ${className}`}>
      {children}
    </div>
  )
}
