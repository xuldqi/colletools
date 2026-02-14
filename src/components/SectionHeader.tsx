import { Link } from 'react-router-dom'

interface SectionHeaderProps {
  title: string
  subtitle: string
  backAction?: () => void
}

export default function SectionHeader({ title, subtitle, backAction }: SectionHeaderProps) {
  return (
    <div className="mb-8">
      {backAction ? (
        <button
          onClick={backAction}
          className="mb-4 text-sm text-gray-500 hover:text-primary-600 flex items-center gap-1 transition-colors"
        >
          <i className="fa-solid fa-arrow-left"></i> Back to Home
        </button>
      ) : (
        <Link
          to="/"
          className="mb-4 text-sm text-gray-500 hover:text-primary-600 flex items-center gap-1 transition-colors"
        >
          <i className="fa-solid fa-arrow-left"></i> Back to Home
        </Link>
      )}
      <h2 className="text-3xl font-bold text-gray-900 mb-2">{title}</h2>
      <p className="text-gray-600 text-lg">{subtitle}</p>
    </div>
  )
}
