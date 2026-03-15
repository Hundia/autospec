import React from 'react';

interface CardProps {
  padding?: 'sm' | 'md' | 'lg';
  hoverable?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
}

const paddingClasses = {
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
};

export const Card = React.memo(function Card({
  padding = 'md',
  hoverable = false,
  onClick,
  children,
  className = '',
}: CardProps) {
  return (
    <div
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') onClick();
            }
          : undefined
      }
      className={[
        'bg-white rounded-lg shadow-sm border border-gray-100',
        paddingClasses[padding],
        hoverable ? 'hover:shadow-md hover:border-gray-200 transition-shadow' : '',
        onClick ? 'cursor-pointer' : '',
        className,
      ].join(' ')}
    >
      {children}
    </div>
  );
});
