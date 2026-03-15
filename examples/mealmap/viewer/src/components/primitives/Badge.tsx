import React from 'react'

export type BadgeVariant =
  | 'default'
  | 'done'
  | 'in-progress'
  | 'todo'
  | 'blocked'
  | 'qa'

export interface BadgeProps {
  variant?: BadgeVariant
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
  className?: string
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-gray-100 text-gray-600',
  done: 'bg-green-100 text-green-700',
  'in-progress': 'bg-amber-100 text-amber-700',
  todo: 'bg-gray-100 text-gray-600',
  blocked: 'bg-red-100 text-red-700',
  qa: 'bg-blue-100 text-blue-700',
}

const sizeStyles = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-3 py-1 text-xs',
  lg: 'px-4 py-1.5 text-sm',
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  size = 'md',
  children,
  className = '',
}) => {
  const classes = [
    'inline-flex items-center justify-center font-medium rounded-full',
    variantStyles[variant],
    sizeStyles[size],
    className,
  ].filter(Boolean).join(' ')

  return <span className={classes}>{children}</span>
}

export default Badge
