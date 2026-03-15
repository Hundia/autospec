import React from 'react'

export interface CardProps {
  variant?: 'default' | 'outlined' | 'elevated'
  hoverable?: boolean
  clickable?: boolean
  onClick?: () => void
  children: React.ReactNode
  className?: string
}

const variantStyles = {
  default: 'bg-white shadow-subtle',
  elevated: 'bg-white shadow-soft',
  outlined: 'bg-white border border-gray-200',
}

export const Card: React.FC<CardProps> = ({
  variant = 'default',
  hoverable = false,
  clickable = false,
  onClick,
  children,
  className = '',
}) => {
  const classes = [
    'rounded-xl transition-all duration-200',
    variantStyles[variant],
    'p-6',
    hoverable || clickable ? 'hover:shadow-soft hover:-translate-y-0.5' : '',
    clickable ? 'cursor-pointer' : '',
    className,
  ].filter(Boolean).join(' ')

  if (clickable) {
    return (
      <button className={classes} onClick={onClick} type="button">
        {children}
      </button>
    )
  }

  return <div className={classes}>{children}</div>
}

export const CardHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`mb-4 ${className}`}>{children}</div>
)

export const CardTitle: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <h3 className={`text-lg font-semibold text-gray-900 ${className}`}>{children}</h3>
)

export const CardDescription: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <p className={`text-sm text-gray-500 mt-1 ${className}`}>{children}</p>
)

export const CardContent: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={className}>{children}</div>
)

export const CardFooter: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`mt-4 pt-4 border-t border-gray-200 ${className}`}>{children}</div>
)

export default Card
