import React from 'react'
import { NavLink } from 'react-router-dom'
import { LayoutDashboard, FileText, List, BookOpen, Zap, Grid, Palette } from 'lucide-react'

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/docs/methodology/01_philosophy', label: 'Docs', icon: BookOpen },
  { to: '/specs/01_product_manager', label: 'Specs', icon: FileText },
  { to: '/backlog', label: 'Backlog', icon: List },
  { to: '/skills/sprint-run', label: 'Skills', icon: Zap },
  { to: '/environments', label: 'Environments', icon: Grid },
  { to: '/design-system', label: 'Design System', icon: Palette },
]

export const Sidebar: React.FC = () => {
  return (
    <aside className="w-60 bg-cream border-r border-sand flex-shrink-0 h-screen sticky top-0 overflow-y-auto">
      <div className="p-6 border-b border-sand">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-sage rounded-lg flex items-center justify-center">
            <span className="text-cream text-sm font-bold">A</span>
          </div>
          <div>
            <div className="text-sm font-semibold text-charcoal">AutoSpec</div>
            <div className="text-xs text-sand-600">SDD Framework</div>
          </div>
        </div>
      </div>
      <nav className="p-4 space-y-1">
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              [
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200',
                isActive
                  ? 'bg-sage text-cream font-medium'
                  : 'text-charcoal hover:bg-sand-200 hover:text-sage-700',
              ].join(' ')
            }
          >
            <Icon size={16} />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-sand">
        <div className="text-xs text-sand-600 text-center">v0.1.0 · MIT License</div>
      </div>
    </aside>
  )
}
