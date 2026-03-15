# MealMap Viewer — Agent Brief

> **Sprint:** 22B.2
> **Executor:** Sonnet agent
> **Date:** 2026-03-14

---

## Objective

Generate a complete React viewer app at `examples/mealmap/viewer/` that visualizes MealMap's specs, backlog, and docs as an interactive dashboard. This validates section 6 of the QUICKSTART pipeline (`quickstart/06-viewer.md`).

---

## Tech Stack

Use the same stack as the reference viewer at `viewer/` (the autospec viewer):

| Layer | Package | Version |
|-------|---------|---------|
| Framework | React 18 | ^18.3.1 |
| Build | Vite 5 | ^5.1.4 |
| Language | TypeScript 5 | ^5.4.2 |
| Styling | Tailwind CSS 3 | ^3.4.1 |
| Routing | react-router-dom 6 | ^6.22.0 |
| Charts | Recharts 2 | ^2.12.0 |
| Icons | lucide-react | ^0.344.0 |
| Markdown | react-markdown + remark-gfm | ^9.0.1 / ^4.0.0 |

**Do NOT use shadcn/ui, @radix-ui, React Flow, or framer-motion.** Build simple components directly with Tailwind (like the autospec viewer does).

---

## What to Generate

### Directory Structure

```
examples/mealmap/viewer/
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
├── postcss.config.js
├── tailwind.config.js
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── index.css              # Tailwind directives + custom tokens
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Layout.tsx     # Sidebar + main content
│   │   │   ├── Sidebar.tsx    # Nav links
│   │   │   └── Header.tsx     # Page title
│   │   ├── primitives/
│   │   │   ├── Card.tsx       # Card, CardHeader, CardTitle, CardContent
│   │   │   └── Badge.tsx      # Badge with variant colors
│   │   └── charts/
│   │       ├── AnimatedCounter.tsx
│   │       └── ProgressRing.tsx
│   ├── data/
│   │   ├── backlog.ts         # Sprint/ticket data from MealMap backlog
│   │   ├── specs.ts           # Spec manifest from MealMap specs
│   │   └── docs.ts            # Doc manifest from MealMap docs
│   └── pages/
│       ├── DashboardPage.tsx
│       ├── SpecsPage.tsx
│       ├── DocsPage.tsx
│       ├── BacklogPage.tsx
│       ├── DesignSystemPage.tsx
│       └── ArchitecturePage.tsx
```

---

## MealMap-Specific Data

### Specs Manifest (`data/specs.ts`)

```typescript
export interface SpecEntry {
  slug: string
  number: string
  title: string
  owner: string
  description: string
}

export const specsManifest: SpecEntry[] = [
  { slug: '01_product_manager', number: '01', title: 'Product Manager', owner: 'PM', description: 'Vision, personas, problem statement, user stories, MoSCoW priorities' },
  { slug: '02_backend_lead', number: '02', title: 'Backend Lead', owner: 'Backend', description: 'Express + TypeScript architecture, REST endpoints, middleware, error handling' },
  { slug: '03_frontend_lead', number: '03', title: 'Frontend Lead', owner: 'Frontend', description: 'React 18 + Vite + Tailwind, component hierarchy, state management, routing' },
  { slug: '04_db_architect', number: '04', title: 'Database Architect', owner: 'DB', description: 'PostgreSQL + Drizzle ORM, 6 tables, ERD, indexes, seed data' },
  { slug: '05_qa_lead', number: '05', title: 'QA Lead', owner: 'QA', description: 'Test pyramid (unit/integration/E2E), Vitest + Supertest, 70% coverage target' },
]
```

### Docs Manifest (`data/docs.ts`)

```typescript
export interface DocEntry {
  slug: string
  title: string
  section: string
}

export const docsManifest: DocEntry[] = [
  { slug: 'architecture', title: 'Architecture', section: 'system' },
  { slug: 'api', title: 'API Reference', section: 'system' },
  { slug: 'setup', title: 'Setup Guide', section: 'guides' },
]

export const sections = ['system', 'guides'] as const
export type DocSection = typeof sections[number]

export const sectionLabels: Record<DocSection, string> = {
  system: 'System',
  guides: 'Guides',
}
```

### Backlog Data (`data/backlog.ts`)

Parse the MealMap backlog into this structure. Here are the exact tickets:

```typescript
export type TicketStatus = 'done' | 'in-progress' | 'todo' | 'blocked' | 'qa'

export interface Ticket {
  id: string
  title: string
  points: number
  status: TicketStatus
  owner: string
  dependencies: string[]
}

export interface Sprint {
  number: number
  name: string
  theme: string
  status: TicketStatus
  totalPoints: number
  tickets: Ticket[]
}

export const backlogData: Sprint[] = [
  {
    number: 0,
    name: 'Sprint 0',
    theme: 'Foundation',
    status: 'done',
    totalPoints: 23,
    tickets: [
      { id: '0.1', title: 'docker-compose.yml with PostgreSQL', points: 2, status: 'done', owner: 'DevOps', dependencies: [] },
      { id: '0.2', title: 'Initialize Express + TypeScript backend', points: 3, status: 'done', owner: 'Backend', dependencies: ['0.1'] },
      { id: '0.3', title: 'Drizzle ORM setup + schema', points: 3, status: 'done', owner: 'DB', dependencies: ['0.1'] },
      { id: '0.4', title: 'Zod env validation + config module', points: 1, status: 'done', owner: 'Backend', dependencies: ['0.2'] },
      { id: '0.5', title: 'Health check endpoint', points: 1, status: 'done', owner: 'Backend', dependencies: ['0.2'] },
      { id: '0.6', title: 'Global error middleware', points: 2, status: 'done', owner: 'Backend', dependencies: ['0.2'] },
      { id: '0.7', title: 'Initialize React + Vite + Tailwind frontend', points: 3, status: 'done', owner: 'Frontend', dependencies: [] },
      { id: '0.8', title: 'Atom components + AppLayout', points: 3, status: 'done', owner: 'Frontend', dependencies: ['0.7'] },
      { id: '0.9', title: 'Axios API client + auth store skeleton', points: 3, status: 'done', owner: 'Frontend', dependencies: ['0.7'] },
      { id: '0.10', title: 'Sprint 0 summary + docs scaffold', points: 2, status: 'done', owner: 'QA', dependencies: [] },
    ],
  },
  {
    number: 1,
    name: 'Sprint 1',
    theme: 'Recipes + Auth',
    status: 'todo',
    totalPoints: 30,
    tickets: [
      { id: '1.1', title: 'Auth endpoints (register, login, refresh, logout)', points: 5, status: 'todo', owner: 'Backend', dependencies: ['0.3', '0.6'] },
      { id: '1.2', title: 'JWT auth middleware', points: 2, status: 'todo', owner: 'Backend', dependencies: ['1.1'] },
      { id: '1.3', title: 'Recipe CRUD endpoints', points: 5, status: 'todo', owner: 'Backend', dependencies: ['1.2'] },
      { id: '1.4', title: 'Ingredient endpoints', points: 2, status: 'todo', owner: 'Backend', dependencies: ['1.2'] },
      { id: '1.5', title: 'Login + Register pages', points: 3, status: 'todo', owner: 'Frontend', dependencies: ['0.9', '1.1'] },
      { id: '1.6', title: 'Recipe list page + filters', points: 5, status: 'todo', owner: 'Frontend', dependencies: ['0.8', '1.3'] },
      { id: '1.7', title: 'Recipe detail page with scaling', points: 3, status: 'todo', owner: 'Frontend', dependencies: ['1.6'] },
      { id: '1.8', title: 'Create + Edit recipe form', points: 5, status: 'todo', owner: 'Frontend', dependencies: ['1.6', '1.4'] },
      { id: '1.9', title: 'Unit + integration tests (Sprint 1)', points: 3, status: 'todo', owner: 'QA', dependencies: [] },
      { id: '1.10', title: 'Sprint 1 summary + docs update', points: 2, status: 'todo', owner: 'QA', dependencies: ['1.9'] },
    ],
  },
  {
    number: 2,
    name: 'Sprint 2',
    theme: 'Meal Planning + Shopping Lists',
    status: 'todo',
    totalPoints: 22,
    tickets: [
      { id: '2.1', title: 'Meal plan CRUD endpoints', points: 5, status: 'todo', owner: 'Backend', dependencies: ['1.2'] },
      { id: '2.2', title: 'Meal plan entry endpoints', points: 3, status: 'todo', owner: 'Backend', dependencies: ['2.1'] },
      { id: '2.3', title: 'Shopping list generation endpoint', points: 5, status: 'todo', owner: 'Backend', dependencies: ['2.2'] },
      { id: '2.4', title: 'Meal plan list + calendar page', points: 5, status: 'todo', owner: 'Frontend', dependencies: ['0.8', '2.1', '2.2'] },
      { id: '2.5', title: 'Shopping list page', points: 3, status: 'todo', owner: 'Frontend', dependencies: ['2.3', '0.8'] },
      { id: '2.6', title: 'Unit + integration tests (Sprint 2)', points: 5, status: 'todo', owner: 'QA', dependencies: [] },
      { id: '2.7', title: 'Database seed script', points: 2, status: 'todo', owner: 'DB', dependencies: ['0.3'] },
      { id: '2.8', title: 'Sprint 2 summary + docs final', points: 2, status: 'todo', owner: 'QA', dependencies: ['2.6'] },
    ],
  },
]
```

### Design Tokens (from `specs/03_frontend_lead.md`)

Use the MealMap brand colors — a green-themed palette:

```css
/* src/index.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --brand-50: #f0fdf4;
    --brand-100: #dcfce7;
    --brand-500: #22c55e;
    --brand-600: #16a34a;
    --brand-700: #15803d;
    --gray-50: #f9fafb;
    --gray-100: #f3f4f6;
    --gray-200: #e5e7eb;
    --gray-500: #6b7280;
    --gray-700: #374151;
    --gray-900: #111827;
  }
}

body {
  @apply bg-gray-50 text-gray-700 font-sans;
}
```

```javascript
// tailwind.config.js
module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
```

---

## Page Requirements

### 1. DashboardPage (required)

- **KPI cards** (4-5): Total Points (75), Total Tickets (24), Sprints (3), Role Specs (5), Completion ring (23/75 = 31% done)
- **Bar chart**: Points per sprint (S0=23, S1=30, S2=22) — color-coded by status (done=green, todo=gray)
- **Pie chart**: Status distribution (Done=10, Todo=18)
- **Sprint quick-links**: List each sprint with status badge, ticket count, point count

### 2. BacklogPage (required)

- **Kanban view**: Columns for Todo/In Progress/Done, ticket cards with ID, title, points, owner
- **Table view**: Toggle to tabular view with all ticket fields
- **Summary stats**: Total points, done points

### 3. SpecsPage (required)

- **Grid of 5 spec cards**: Each shows number, title, owner badge, description
- **Click to detail**: Show spec reference path

### 4. DocsPage (required)

- **Section folders**: Group by section (system, guides)
- **Doc cards**: Each shows title, section badge

### 5. DesignSystemPage (nice to have)

- Show MealMap's color palette swatches (brand-50 through brand-700 + grays)
- Typography samples
- Component examples (Button, Card, Badge, Input)

### 6. ArchitecturePage (nice to have)

- ASCII or text rendering of the system architecture from `docs/architecture.md`
- Tech stack table (Express + React + PostgreSQL + Drizzle)

---

## Component Patterns

### Card (reuse from autospec viewer pattern)

```typescript
interface CardProps {
  variant?: 'default' | 'outlined'
  hoverable?: boolean
  clickable?: boolean
  onClick?: () => void
  className?: string
  children: React.ReactNode
}
```

### Badge

```typescript
type BadgeVariant = 'done' | 'todo' | 'in-progress' | 'qa' | 'blocked' | 'default'
```

Colors:
- done: `bg-green-100 text-green-700`
- todo: `bg-gray-100 text-gray-600`
- in-progress: `bg-amber-100 text-amber-700`
- qa: `bg-blue-100 text-blue-700`
- blocked: `bg-red-100 text-red-700`

### AnimatedCounter

Simple counter that displays a number with a label below.

### ProgressRing

SVG circle with stroke-dashoffset animation showing completion percentage.

---

## Layout

- **Sidebar**: Fixed left sidebar (w-56) with nav links to all 6 pages. MealMap branding at top. Active link highlighted with brand-500.
- **Header**: Page title derived from route
- **Main**: Scrollable content area with max-width constraint

---

## Build Requirements

1. `npm install` must succeed
2. `npx tsc --noEmit` must pass (no type errors)
3. `npx vite build` must produce dist/ without errors
4. No runtime dependencies on shadcn/ui, @radix-ui, React Flow, or framer-motion

---

## Files to Read for Context

- `quickstart/06-viewer.md` — Full viewer spec (for understanding the standard)
- `examples/mealmap/specs/backlog.md` — Source data for backlog.ts
- `examples/mealmap/specs/03_frontend_lead.md` — Design tokens
- `examples/mealmap/docs/architecture.md` — Architecture diagram
- `viewer/src/pages/DashboardPage.tsx` — Reference pattern for charts
- `viewer/src/pages/BacklogPage.tsx` — Reference pattern for kanban/table
- `viewer/src/components/primitives/Card.tsx` — Reference Card component
- `viewer/src/components/primitives/Badge.tsx` — Reference Badge component

---

## Key Constraint

This is a **standalone viewer for MealMap**, not the autospec viewer. It should:
- Use MealMap's green brand colors (not autospec's warm palette)
- Show MealMap's 5 specs, 3 docs, 24 tickets across 3 sprints
- Title should say "MealMap" not "AutoSpec"
- Be completely self-contained in `examples/mealmap/viewer/`
