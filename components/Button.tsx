interface ButtonProps {
  onClick?: () => void
  children?: React.ReactNode
  variant?: 'primary' | 'secondary' | 'accent' | 'danger' | 'ghost'
  className?: string
  disabled?: boolean
  loading?: boolean
  type?: 'button' | 'submit' | 'reset'
}

export default function Button({ 
  onClick, 
  children, 
  variant = 'primary', 
  className = "", 
  disabled = false, 
  loading = false,
  type = 'button'
}: ButtonProps) {
  const baseStyle = "px-5 py-2.5 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
  const variants = {
    primary: "bg-primary-600 text-white hover:bg-primary-700 disabled:bg-primary-400",
    secondary: "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 disabled:bg-gray-50",
    accent: "bg-accent text-white hover:bg-pink-500",
    danger: "bg-red-50 text-red-600 hover:bg-red-100",
    ghost: "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
  }
  return (
    <button 
      onClick={onClick} 
      disabled={disabled || loading} 
      type={type}
      className={`${baseStyle} ${variants[variant]} ${className}`}
    >
      {loading && <i className="fa-solid fa-circle-notch fa-spin"></i>}
      {children}
    </button>
  )
}

