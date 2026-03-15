import React from 'react'
import { NavLink } from 'react-router-dom'
import { LayoutDashboard, List, FileText, BookOpen, Palette, Network } from 'lucide-react'
import { backlogData } from '../../data/backlog'

const statusEmoji: Record<string, string> = {
  done: '✅',
  'in-progress': '🔄',
  todo: '🔲',
  blocked: '⏸️',
  qa: '🧪',
}

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/backlog', label: 'Backlog', icon: List },
  { to: '/specs', label: 'Specs', icon: FileText },
  { to: '/docs', label: 'Docs', icon: BookOpen },
  { to: '/architecture', label: 'Architecture', icon: Network },
  { to: '/design-system', label: 'Design System', icon: Palette },
]

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  [
    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200',
    isActive
      ? 'bg-brand-500 text-white font-medium'
      : 'text-gray-700 hover:bg-brand-50 hover:text-brand-700',
  ].join(' ')

export const Sidebar: React.FC = () => {
  return (
    <aside className="w-56 bg-white border-r border-gray-200 flex-shrink-0 h-screen sticky top-0 overflow-y-auto flex flex-col">
      {/* Logo */}
      <div className="p-5 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm font-bold">M</span>
          </div>
          <div>
            <div className="text-sm font-semibold text-gray-900">MealMap</div>
            <div className="text-xs text-gray-500">Spec Dashboard</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="p-3 space-y-0.5 flex-1">
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink key={to} to={to} end={end} className={navLinkClass}>
            <Icon size={16} />
            {label}
          </NavLink>
        ))}

        {/* Sprint list */}
        <div className="pt-3">
          <div className="px-3 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Sprints
          </div>
          <div className="mt-1 space-y-0.5">
            {backlogData.map(sprint => (
              <div
                key={sprint.number}
                className="flex items-center gap-2 px-3 py-1.5 rounded-md text-xs text-gray-600"
              >
                <span className="text-[10px]">{statusEmoji[sprint.status] || '🔲'}</span>
                <span className="truncate">S{sprint.number} · {sprint.theme}</span>
              </div>
            ))}
          </div>
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="text-xs text-gray-400 text-center">v0.1.0 · SDD Framework</div>
      </div>
    </aside>
  )
}
