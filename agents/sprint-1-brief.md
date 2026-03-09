# Sprint 1 Agent Briefing — Viewer Scaffold + Primitives + Dashboard

**Agent:** Sonnet 4.6
**Sprint:** 1 of 5
**Depends on:** Sprint 0 complete ✅
**Working directory:** `/opt/FitnessAiManager/autospec`
**Output directory:** `/opt/FitnessAiManager/autospec/viewer/`

---

## Your Mission

Create the viewer React app from scratch. This is the visual interface for AutoSpec — a warm, editorial SPA that displays specs, backlog, docs, and skills. You are building the scaffold, design primitives, layout, and Dashboard page.

---

## Tickets (execute in order)

1. **1.1** — Viewer scaffold: `viewer/` init, package.json, vite.config.ts, tailwind.config.js, tsconfig.json, index.html
2. **1.2** — FitnessAiManager design tokens in tailwind.config.js
3. **1.3** — Port primitives: Button, Card, Badge (extended), Input → `viewer/src/components/primitives/`
4. **1.4** — Layout: Sidebar, Header, Layout, App.tsx with 7 React Router routes
5. **1.5** — DashboardPage `/` — KPI cards, BarChart, PieChart (Recharts), sprint quick-links
6. **1.6** — DesignSystemPage `/design-system` — component gallery (Colors, Typography, Buttons, Cards, Badges)
7. **1.7** — Create `docs/viewer/01_architecture.md` + `docs/viewer/02_design_system.md`

After completing all tickets, update `specs/backlog.md` (Sprint 1 tickets 🔲→✅) and create `sprints/sprint-1/summary.md`.

---

## ABSOLUTE RULES (violations = sprint failure)

- **NO shadcn/ui** — not in dependencies, not in code
- **NO @radix-ui** imports
- **NO RTL CSS** (`dir-rtl`, `text-right`, `direction: rtl`)
- **NO Hebrew text** in component source (remove from ported code)
- **NO dark slate colors** (`#0f172a`, `slate-950`, `zinc-900`, `gray-950`)
- **Background MUST be** `#f5f3ed` (parchment)
- **Body font:** Inter (Google Fonts)
- **Mono font:** JetBrains Mono (Google Fonts)
- **Charts:** Recharts only (no chart.js, no d3 direct)

---

## Task 1.1 — Viewer Scaffold

Create these files:

### `viewer/package.json`
```json
{
  "name": "autospec-viewer",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.22.0",
    "recharts": "^2.12.0",
    "react-markdown": "^9.0.1",
    "remark-gfm": "^4.0.0",
    "fuse.js": "^7.0.0",
    "lucide-react": "^0.344.0"
  },
  "devDependencies": {
    "@types/react": "^18.3.1",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.0",
    "autoprefixer": "^10.4.17",
    "postcss": "^8.4.35",
    "tailwindcss": "^3.4.1",
    "typescript": "^5.4.2",
    "vite": "^5.1.4"
  }
}
```

### `viewer/vite.config.ts`
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: 'dist',
  },
})
```

### `viewer/tsconfig.json`
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"]
}
```

### `viewer/postcss.config.js`
```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

### `viewer/index.html`
```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>AutoSpec Viewer</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

### `viewer/src/main.tsx`
```tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

### `viewer/src/index.css`
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  * {
    box-sizing: border-box;
  }

  html {
    font-family: 'Inter', sans-serif;
  }

  body {
    background-color: #f5f3ed;
    color: #1a1a1a;
    margin: 0;
    padding: 0;
  }

  code, pre, .font-mono {
    font-family: 'JetBrains Mono', monospace;
  }
}
```

---

## Task 1.2 — Design Tokens in tailwind.config.js

### `viewer/tailwind.config.js`
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Warm palette — adapted from FitnessAiManager/Sivania design system
        sand: {
          DEFAULT: '#d8d0ba',
          50: '#faf9f5',
          100: '#f5f3ed',
          200: '#e8e4d8',
          300: '#d8d0ba',
          400: '#c4b89e',
          500: '#b8a890',
          600: '#a08c72',
          700: '#857358',
          800: '#6b5c47',
          900: '#574b3b',
        },
        sage: {
          DEFAULT: '#698472',
          50: '#f4f7f5',
          100: '#e6ece8',
          200: '#cdd9d1',
          300: '#a8bfaf',
          400: '#8a9f91',
          500: '#698472',
          600: '#536a5b',
          700: '#44564a',
          800: '#39463e',
          900: '#303b34',
        },
        terracotta: {
          DEFAULT: '#8e6a59',
          50: '#faf6f4',
          100: '#f4ebe6',
          200: '#e8d5cc',
          300: '#d9b9a8',
          400: '#c69a84',
          500: '#b08a79',
          600: '#8e6a59',
          700: '#76574a',
          800: '#624940',
          900: '#523f38',
        },
        parchment: '#f5f3ed',
        cream: '#faf9f5',
        charcoal: '#1a1a1a',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        subtle: '0 2px 8px rgba(142, 106, 89, 0.08)',
        soft: '0 4px 16px rgba(142, 106, 89, 0.12)',
        elevated: '0 8px 32px rgba(142, 106, 89, 0.16)',
      },
      spacing: {
        '4.5': '1.125rem',
      },
    },
  },
  plugins: [],
}
```

---

## Task 1.3 — Port Primitives

Create `viewer/src/components/primitives/` with these files. They are ported FROM FitnessAiManager — RTL/Hebrew removed, Badge extended.

### `viewer/src/components/primitives/Button.tsx`
```tsx
import React from 'react'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
  loading?: boolean
  icon?: React.ReactNode
  iconPosition?: 'start' | 'end'
  children: React.ReactNode
}

const variantStyles = {
  primary: 'bg-sage text-cream border-transparent hover:bg-sage-600 active:bg-sage-700 disabled:bg-sage-300 disabled:cursor-not-allowed',
  secondary: 'bg-terracotta text-cream border-transparent hover:bg-terracotta-700 active:bg-terracotta-800 disabled:opacity-50 disabled:cursor-not-allowed',
  outline: 'bg-transparent text-terracotta border-terracotta border-[1.5px] hover:bg-terracotta hover:text-cream disabled:border-sand-400 disabled:text-sand-400 disabled:cursor-not-allowed',
  ghost: 'bg-transparent text-sage border-transparent hover:bg-sand-200 active:bg-sand-300 disabled:text-sand-400 disabled:cursor-not-allowed',
}

const sizeStyles = {
  sm: 'px-4 py-2 text-xs',
  md: 'px-6 py-2.5 text-sm',
  lg: 'px-8 py-3.5 text-base',
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', fullWidth = false, loading = false, icon, iconPosition = 'end', disabled, className = '', children, ...props }, ref) => {
    const classes = [
      'inline-flex items-center justify-center gap-2',
      'font-sans font-medium tracking-wide',
      'rounded-full border',
      'transition-all duration-200',
      'focus:outline-none focus:ring-2 focus:ring-sage/30',
      variantStyles[variant],
      sizeStyles[size],
      fullWidth ? 'w-full' : '',
      loading ? 'opacity-70 cursor-wait' : '',
      className,
    ].filter(Boolean).join(' ')

    return (
      <button ref={ref} disabled={disabled || loading} className={classes} {...props}>
        {loading && (
          <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        )}
        {icon && iconPosition === 'start' && !loading && <span className="flex-shrink-0">{icon}</span>}
        <span>{children}</span>
        {icon && iconPosition === 'end' && !loading && <span className="flex-shrink-0">{icon}</span>}
      </button>
    )
  }
)
Button.displayName = 'Button'
export default Button
```

### `viewer/src/components/primitives/Card.tsx`
```tsx
import React from 'react'

export interface CardProps {
  variant?: 'default' | 'elevated' | 'outlined' | 'filled'
  padding?: 'none' | 'sm' | 'md' | 'lg'
  hoverable?: boolean
  clickable?: boolean
  onClick?: () => void
  children: React.ReactNode
  className?: string
  'data-testid'?: string
}

const variantStyles = {
  default: 'bg-cream shadow-subtle',
  elevated: 'bg-cream shadow-soft',
  outlined: 'bg-cream border border-sand',
  filled: 'bg-sand-200',
}

const paddingStyles = {
  none: 'p-0',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
}

export const Card: React.FC<CardProps> = ({
  variant = 'default', padding = 'md', hoverable = false, clickable = false,
  onClick, children, className = '', 'data-testid': dataTestId,
}) => {
  const classes = [
    'rounded-xl transition-all duration-200',
    variantStyles[variant],
    paddingStyles[padding],
    hoverable || clickable ? 'hover:shadow-soft hover:-translate-y-1' : '',
    clickable ? 'cursor-pointer' : '',
    className,
  ].filter(Boolean).join(' ')

  if (clickable) {
    return (
      <button className={classes} onClick={onClick} type="button" data-testid={dataTestId}>
        {children}
      </button>
    )
  }

  return <div className={classes} data-testid={dataTestId}>{children}</div>
}

export const CardHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`mb-4 ${className}`}>{children}</div>
)

export const CardTitle: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <h3 className={`text-xl font-normal text-terracotta ${className}`}>{children}</h3>
)

export const CardDescription: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <p className={`text-sm text-sand-600 mt-1 ${className}`}>{children}</p>
)

export const CardContent: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={className}>{children}</div>
)

export const CardFooter: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`mt-4 pt-4 border-t border-sand ${className}`}>{children}</div>
)

export default Card
```

### `viewer/src/components/primitives/Badge.tsx`
```tsx
import React from 'react'

export type BadgeVariant =
  | 'default'
  | 'done'
  | 'in-progress'
  | 'todo'
  | 'blocked'
  | 'qa'
  | 'haiku'
  | 'sonnet'
  | 'opus'
  | 'confirmed'
  | 'cancelled'

export interface BadgeProps {
  variant?: BadgeVariant
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
  className?: string
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-sand-200 text-terracotta',
  done: 'bg-sage text-cream',
  'in-progress': 'bg-amber-100 text-amber-800',
  todo: 'bg-sand-200 text-sand-700',
  blocked: 'bg-red-100 text-red-700',
  qa: 'bg-blue-100 text-blue-700',
  haiku: 'bg-purple-100 text-purple-700',
  sonnet: 'bg-blue-100 text-blue-800',
  opus: 'bg-orange-100 text-orange-800',
  confirmed: 'bg-sage text-cream',
  cancelled: 'bg-terracotta text-cream',
}

const sizeStyles = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-3 py-1 text-xs',
  lg: 'px-4 py-1.5 text-sm',
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'default', size = 'md', children, className = '',
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
```

### `viewer/src/components/primitives/Input.tsx`
```tsx
import React from 'react'

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string
  helperText?: string
  error?: string
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
  startAdornment?: React.ReactNode
  endAdornment?: React.ReactNode
}

const sizeStyles = {
  sm: 'px-3 py-2 text-sm',
  md: 'px-4 py-3 text-base',
  lg: 'px-5 py-4 text-lg',
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, helperText, error, size = 'md', fullWidth = true, startAdornment, endAdornment, className = '', id, ...props }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`
    const hasError = !!error

    const inputClasses = [
      'block font-sans bg-parchment border rounded-lg',
      'transition-all duration-200 placeholder:text-sand-500',
      sizeStyles[size],
      fullWidth ? 'w-full' : '',
      startAdornment ? 'pl-10' : '',
      endAdornment ? 'pr-10' : '',
      hasError
        ? 'border-terracotta focus:border-terracotta focus:ring-2 focus:ring-terracotta/15'
        : 'border-sand focus:border-sage focus:ring-2 focus:ring-sage/15',
      'focus:outline-none',
      'disabled:bg-sand-100 disabled:cursor-not-allowed disabled:opacity-60',
      className,
    ].filter(Boolean).join(' ')

    return (
      <div className={fullWidth ? 'w-full' : ''}>
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-terracotta mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          {startAdornment && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-sand-500">{startAdornment}</div>}
          <input ref={ref} id={inputId} className={inputClasses} aria-invalid={hasError} {...props} />
          {endAdornment && <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sand-500">{endAdornment}</div>}
        </div>
        {error && <p className="mt-1.5 text-sm text-terracotta" role="alert">{error}</p>}
        {helperText && !error && <p className="mt-1.5 text-sm text-sand-500">{helperText}</p>}
      </div>
    )
  }
)
Input.displayName = 'Input'
export default Input
```

### `viewer/src/components/primitives/index.ts`
```typescript
export { Button } from './Button'
export type { ButtonProps } from './Button'
export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './Card'
export type { CardProps } from './Card'
export { Badge } from './Badge'
export type { BadgeProps, BadgeVariant } from './Badge'
export { Input } from './Input'
export type { InputProps } from './Input'
```

---

## Task 1.4 — Layout Components

### `viewer/src/components/layout/Sidebar.tsx`
```tsx
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
```

### `viewer/src/components/layout/Header.tsx`
```tsx
import React from 'react'
import { useLocation } from 'react-router-dom'

const routeLabels: Record<string, string> = {
  '/': 'Dashboard',
  '/backlog': 'Backlog',
  '/environments': 'Environments',
  '/design-system': 'Design System',
}

function getTitle(pathname: string): string {
  if (routeLabels[pathname]) return routeLabels[pathname]
  if (pathname.startsWith('/docs/')) return 'Documentation'
  if (pathname.startsWith('/specs/')) return 'Specifications'
  if (pathname.startsWith('/skills/')) return 'Skills'
  return 'AutoSpec'
}

export const Header: React.FC = () => {
  const location = useLocation()
  const title = getTitle(location.pathname)

  return (
    <header className="h-14 bg-parchment border-b border-sand px-6 flex items-center justify-between flex-shrink-0">
      <h1 className="text-base font-semibold text-charcoal">{title}</h1>
      <div className="flex items-center gap-2">
        <span className="text-xs text-sand-600 font-mono">AutoSpec v0.1.0</span>
      </div>
    </header>
  )
}
```

### `viewer/src/components/layout/Layout.tsx`
```tsx
import React from 'react'
import { Sidebar } from './Sidebar'
import { Header } from './Header'

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex h-screen bg-parchment overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
```

### `viewer/src/App.tsx`
```tsx
import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import { DashboardPage } from './pages/DashboardPage'
import { DocsPage } from './pages/DocsPage'
import { SpecsPage } from './pages/SpecsPage'
import { BacklogPage } from './pages/BacklogPage'
import { SkillsPage } from './pages/SkillsPage'
import { EnvironmentsPage } from './pages/EnvironmentsPage'
import { DesignSystemPage } from './pages/DesignSystemPage'

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/docs/:section/:slug" element={<DocsPage />} />
          <Route path="/specs/:slug" element={<SpecsPage />} />
          <Route path="/backlog" element={<BacklogPage />} />
          <Route path="/skills/:slug" element={<SkillsPage />} />
          <Route path="/environments" element={<EnvironmentsPage />} />
          <Route path="/design-system" element={<DesignSystemPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}
```

---

## Task 1.5 — DashboardPage

Create `viewer/src/pages/DashboardPage.tsx` with KPI cards and Recharts charts. Use REAL data from `specs/backlog.md`:
- Sprint 0: 38 pts, 8 tickets
- Sprint 1: 33 pts, 7 tickets
- Sprint 2: 32 pts, 5 tickets
- Sprint 3: 32 pts, 5 tickets
- Sprint 4: 26 pts, 4 tickets
- Sprint 5: 26 pts, 5 tickets
- Total: 187 pts, 34 tickets

```tsx
import React from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '../components/primitives/Card'
import { Badge } from '../components/primitives/Badge'

const sprintData = [
  { sprint: 'S0', points: 38, tickets: 8, status: 'done' },
  { sprint: 'S1', points: 33, tickets: 7, status: 'in-progress' },
  { sprint: 'S2', points: 32, tickets: 5, status: 'todo' },
  { sprint: 'S3', points: 32, tickets: 5, status: 'todo' },
  { sprint: 'S4', points: 26, tickets: 4, status: 'todo' },
  { sprint: 'S5', points: 26, tickets: 5, status: 'todo' },
]

const statusData = [
  { name: 'Done', value: 8, color: '#698472' },
  { name: 'In Progress', value: 7, color: '#b08a79' },
  { name: 'Todo', value: 19, color: '#d8d0ba' },
]

function AnimatedCounter({ value, label }: { value: number; label: string }) {
  return (
    <div className="text-center">
      <div className="text-3xl font-bold text-charcoal">{value}</div>
      <div className="text-xs text-sand-600 mt-1">{label}</div>
    </div>
  )
}

export const DashboardPage: React.FC = () => {
  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h2 className="text-2xl font-light text-charcoal">AutoSpec Overview</h2>
        <p className="text-sm text-sand-600 mt-1">Spec-Driven Development Framework</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4">
        <Card variant="outlined">
          <CardContent className="py-4">
            <AnimatedCounter value={187} label="Total Points" />
          </CardContent>
        </Card>
        <Card variant="outlined">
          <CardContent className="py-4">
            <AnimatedCounter value={34} label="Total Tickets" />
          </CardContent>
        </Card>
        <Card variant="outlined">
          <CardContent className="py-4">
            <AnimatedCounter value={6} label="Sprints" />
          </CardContent>
        </Card>
        <Card variant="outlined">
          <CardContent className="py-4">
            <AnimatedCounter value={10} label="Role Specs" />
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-3 gap-6">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Points per Sprint</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={sprintData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <XAxis dataKey="sprint" tick={{ fontSize: 12, fill: '#b8a890' }} />
                <YAxis tick={{ fontSize: 12, fill: '#b8a890' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#faf9f5', border: '1px solid #d8d0ba', borderRadius: '8px' }}
                />
                <Bar dataKey="points" fill="#698472" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={statusData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} dataKey="value">
                  {statusData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#faf9f5', border: '1px solid #d8d0ba', borderRadius: '8px' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col gap-1 mt-2">
              {statusData.map(({ name, color, value }) => (
                <div key={name} className="flex items-center gap-2 text-xs">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                  <span className="text-sand-600">{name} ({value})</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sprint Quick Links */}
      <Card>
        <CardHeader>
          <CardTitle>Sprints</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {sprintData.map(({ sprint, points, tickets, status }) => (
              <div key={sprint} className="flex items-center justify-between py-2 border-b border-sand last:border-0">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm text-charcoal font-medium">{sprint}</span>
                  <Badge variant={status as 'done' | 'in-progress' | 'todo'}>
                    {status === 'done' ? '✅ Done' : status === 'in-progress' ? '🔄 In Progress' : '🔲 Todo'}
                  </Badge>
                </div>
                <div className="text-sm text-sand-600">
                  {tickets} tickets · {points} pts
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
```

---

## Task 1.6 — DesignSystemPage + Stub Pages

### `viewer/src/pages/DesignSystemPage.tsx`
```tsx
import React, { useState } from 'react'
import { Button } from '../components/primitives/Button'
import { Card, CardHeader, CardTitle, CardContent } from '../components/primitives/Card'
import { Badge } from '../components/primitives/Badge'
import { Input } from '../components/primitives/Input'
import { Search } from 'lucide-react'

const colors = [
  { name: 'parchment', hex: '#f5f3ed', cls: 'bg-parchment' },
  { name: 'cream', hex: '#faf9f5', cls: 'bg-cream' },
  { name: 'sage', hex: '#698472', cls: 'bg-sage' },
  { name: 'sage-600', hex: '#536a5b', cls: 'bg-sage-600' },
  { name: 'terracotta', hex: '#8e6a59', cls: 'bg-terracotta' },
  { name: 'sand', hex: '#d8d0ba', cls: 'bg-sand' },
  { name: 'sand-200', hex: '#e8e4d8', cls: 'bg-sand-200' },
  { name: 'charcoal', hex: '#1a1a1a', cls: 'bg-charcoal' },
]

export const DesignSystemPage: React.FC = () => {
  const [inputVal, setInputVal] = useState('')

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h2 className="text-2xl font-light text-charcoal">Design System</h2>
        <p className="text-sm text-sand-600 mt-1">Warm palette — adapted from FitnessAiManager/Sivania</p>
      </div>

      <Card>
        <CardHeader><CardTitle>Colors</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            {colors.map(({ name, hex, cls }) => (
              <div key={name}>
                <div className={`h-16 rounded-lg ${cls} border border-sand mb-2`} />
                <div className="text-xs font-medium text-charcoal">{name}</div>
                <div className="text-xs text-sand-600 font-mono">{hex}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Buttons</CardTitle></CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="primary" size="sm">Small</Button>
          <Button variant="primary" size="lg">Large</Button>
          <Button variant="primary" loading>Loading</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Badges</CardTitle></CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Badge variant="done">Done</Badge>
          <Badge variant="in-progress">In Progress</Badge>
          <Badge variant="todo">Todo</Badge>
          <Badge variant="blocked">Blocked</Badge>
          <Badge variant="qa">QA</Badge>
          <Badge variant="haiku">Haiku</Badge>
          <Badge variant="sonnet">Sonnet</Badge>
          <Badge variant="opus">Opus</Badge>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Cards</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-3 gap-4">
          <Card variant="default"><CardContent><p className="text-sm">Default</p></CardContent></Card>
          <Card variant="elevated"><CardContent><p className="text-sm">Elevated</p></CardContent></Card>
          <Card variant="outlined"><CardContent><p className="text-sm">Outlined</p></CardContent></Card>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Inputs</CardTitle></CardHeader>
        <CardContent className="space-y-4 max-w-md">
          <Input label="Default Input" placeholder="Enter text..." value={inputVal} onChange={e => setInputVal(e.target.value)} />
          <Input label="With Icon" placeholder="Search..." startAdornment={<Search size={16} />} />
          <Input label="Error State" error="This field is required" placeholder="Error..." />
          <Input label="Helper Text" helperText="Some helpful context" placeholder="With helper..." />
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Typography</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="text-3xl font-light text-charcoal">Display / Light</div>
          <div className="text-2xl font-normal text-charcoal">Heading / Normal</div>
          <div className="text-xl font-medium text-charcoal">Subheading / Medium</div>
          <div className="text-base text-charcoal">Body text — Inter, 16px regular</div>
          <div className="text-sm text-sand-600">Small text — muted, 14px</div>
          <div className="font-mono text-sm text-sage-700 bg-sand-200 px-3 py-2 rounded">code block — JetBrains Mono</div>
        </CardContent>
      </Card>
    </div>
  )
}
```

### Stub pages (Sprint 2+3 will replace these)

**`viewer/src/pages/DocsPage.tsx`**
```tsx
import React from 'react'
export const DocsPage: React.FC = () => (
  <div className="text-center py-20 text-sand-600">
    <div className="text-4xl mb-4">📄</div>
    <div className="text-lg font-light">Documentation</div>
    <div className="text-sm mt-2">Coming in Sprint 2</div>
  </div>
)
```

**`viewer/src/pages/SpecsPage.tsx`**
```tsx
import React from 'react'
export const SpecsPage: React.FC = () => (
  <div className="text-center py-20 text-sand-600">
    <div className="text-4xl mb-4">📋</div>
    <div className="text-lg font-light">Specifications</div>
    <div className="text-sm mt-2">Coming in Sprint 2</div>
  </div>
)
```

**`viewer/src/pages/BacklogPage.tsx`**
```tsx
import React from 'react'
export const BacklogPage: React.FC = () => (
  <div className="text-center py-20 text-sand-600">
    <div className="text-4xl mb-4">📊</div>
    <div className="text-lg font-light">Backlog</div>
    <div className="text-sm mt-2">Coming in Sprint 2</div>
  </div>
)
```

**`viewer/src/pages/SkillsPage.tsx`**
```tsx
import React from 'react'
export const SkillsPage: React.FC = () => (
  <div className="text-center py-20 text-sand-600">
    <div className="text-4xl mb-4">⚡</div>
    <div className="text-lg font-light">Skills</div>
    <div className="text-sm mt-2">Coming in Sprint 3</div>
  </div>
)
```

**`viewer/src/pages/EnvironmentsPage.tsx`**
```tsx
import React from 'react'
export const EnvironmentsPage: React.FC = () => (
  <div className="text-center py-20 text-sand-600">
    <div className="text-4xl mb-4">🔧</div>
    <div className="text-lg font-light">Environments</div>
    <div className="text-sm mt-2">Coming in Sprint 3</div>
  </div>
)
```

---

## Task 1.7 — Documentation Files

Create `docs/viewer/` directory and two files:

### `docs/viewer/01_architecture.md`
```markdown
---
title: "Viewer Architecture"
sprint: "1.1, 1.4"
created: "2026-03-09"
---

# Viewer Architecture

## Stack
- **React 18** + TypeScript 5
- **Vite 5** (build tool)
- **Tailwind CSS v3** (warm palette, no dark mode)
- **React Router v6** (7 routes)
- **Recharts** (BarChart, PieChart on Dashboard)
- **Lucide React** (icons)

## Directory Structure
```
viewer/
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
├── index.html          ← Google Fonts: Inter + JetBrains Mono
└── src/
    ├── main.tsx
    ├── App.tsx         ← BrowserRouter + 7 routes
    ├── index.css       ← Tailwind directives + base styles
    ├── components/
    │   ├── primitives/ ← Button, Card, Badge, Input (FitnessAiManager port)
    │   └── layout/     ← Sidebar, Header, Layout
    └── pages/          ← 7 page components
```

## Route Table
| Path | Component | Status |
|------|-----------|--------|
| `/` | DashboardPage | ✅ Sprint 1 |
| `/docs/:section/:slug` | DocsPage | 🔲 Sprint 2 |
| `/specs/:slug` | SpecsPage | 🔲 Sprint 2 |
| `/backlog` | BacklogPage | 🔲 Sprint 2 |
| `/skills/:slug` | SkillsPage | 🔲 Sprint 3 |
| `/environments` | EnvironmentsPage | 🔲 Sprint 3 |
| `/design-system` | DesignSystemPage | ✅ Sprint 1 |

## Data Flow
- Sprint 1: Static inline data in page components
- Sprint 2+: `viewer/src/data/` static files (JSON + ?raw .md imports)
```

### `docs/viewer/02_design_system.md`
```markdown
---
title: "Viewer Design System"
sprint: "1.2, 1.3"
created: "2026-03-09"
---

# Viewer Design System

## Origin
Adapted from FitnessAiManager (Sivania) design system. Source:
- `/opt/FitnessAiManager/apps/web/tailwind.config.js`
- `/opt/FitnessAiManager/apps/web/src/design-system/components/primitives/`

Adaptations:
- Removed: RTL classes, Hebrew fonts (Heebo, Rubik, Assistant), direction-rtl
- Added: Inter (body), JetBrains Mono (code)
- Extended Badge: added `done`, `in-progress`, `todo`, `blocked`, `qa`, `haiku`, `sonnet`, `opus` variants

## Color Tokens
| Token | Hex | Tailwind Class | Usage |
|-------|-----|----------------|-------|
| parchment | `#f5f3ed` | `bg-parchment` | Page background |
| cream | `#faf9f5` | `bg-cream` | Card/surface background |
| sage | `#698472` | `bg-sage` | Primary actions, active nav |
| sage-600 | `#536a5b` | `bg-sage-600` | Hover state |
| terracotta | `#8e6a59` | `bg-terracotta` | Accents, headings, errors |
| sand | `#d8d0ba` | `bg-sand` | Borders |
| sand-200 | `#e8e4d8` | `bg-sand-200` | Subtle fills |
| charcoal | `#1a1a1a` | `text-charcoal` | Body text |

## Typography
- **Body:** Inter (Google Fonts, weights: 300/400/500/600/700)
- **Code:** JetBrains Mono (Google Fonts, weights: 400/500)

## Primitives
| Component | Source | Modifications |
|-----------|--------|--------------|
| Button | FitnessAiManager | Removed font-hebrew → font-sans |
| Card | FitnessAiManager | Direct port, removed RTL padding |
| Badge | FitnessAiManager | Extended: 8 new SDD-specific variants |
| Input | FitnessAiManager | Removed RTL padding swap |

## Forbidden
- `shadcn/ui` — conflicts with warm palette
- RTL CSS (`dir-rtl`, `text-right` as default)
- Dark slate (`#0f172a`, `slate-950`, `zinc-900`)
```

---

## Build & Verify

After implementing all files:

```bash
cd /opt/FitnessAiManager/autospec/viewer
npm install
npm run build
```

**Expected:** Zero TypeScript errors, `dist/` folder created.

**Verification checks:**
```bash
grep -r "shadcn\|@radix-ui\|font-hebrew\|0f172a\|slate-950" viewer/src/ || echo "CLEAN"
ls viewer/src/components/primitives/
ls viewer/src/pages/
```

## Final Steps

1. Update `specs/backlog.md` — Sprint 1 tickets (1.1–1.7) → ✅ Done, Sprint 1 status → ✅ Done
2. Create `sprints/sprint-1/summary.md`
3. Return: build output, file list, any TS errors and how they were fixed
