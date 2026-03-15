import React from 'react'
import { useLocation } from 'react-router-dom'

const pageTitles: Record<string, string> = {
  '/': 'Dashboard',
  '/about': 'About',
  '/backlog': 'Backlog',
  '/specs': 'Specs',
  '/docs': 'Docs',
  '/design-system': 'Design System',
  '/architecture': 'Architecture',
}

export const Header: React.FC = () => {
  const location = useLocation()
  const title = pageTitles[location.pathname] ?? 'MealMap'

  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center px-6 flex-shrink-0">
      <h1 className="text-base font-semibold text-gray-900">{title}</h1>
      <div className="ml-auto flex items-center gap-2">
        <span className="text-xs text-gray-400">MealMap Viewer</span>
      </div>
    </header>
  )
}
