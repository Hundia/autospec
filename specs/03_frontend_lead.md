# Frontend Lead Spec — AutoSpec Viewer

## Stack
- React 18 + TypeScript 5
- Vite 5
- Tailwind CSS v3 (warm palette — FitnessAiManager-derived)
- React Router v6
- Recharts (charts)
- react-markdown + remark-gfm (markdown rendering)
- mermaid.js (diagram rendering)
- Fuse.js (fuzzy search)

## FORBIDDEN
- shadcn/ui (conflicts with warm palette; use FitnessAiManager primitives instead)
- @radix-ui (unless already a transitive dep)
- Any RTL CSS classes (dir-rtl, etc.)
- Dark slate colors (#0f172a, slate-950, zinc-900)

## Design System (Warm Palette)
Source: `/opt/FitnessAiManager/apps/web/tailwind.config.js`

```js
colors: {
  parchment: { DEFAULT: '#f5f3ed', light: '#faf9f5' },
  sage: { DEFAULT: '#698472', 600: '#536a5b', 700: '#44564a' },
  terracotta: { DEFAULT: '#8e6a59', 700: '#76574a' },
  sand: { DEFAULT: '#d8d0ba', 200: '#e8e4d8' },
}
fonts: {
  sans: ['Inter', 'sans-serif'],
  mono: ['JetBrains Mono', 'monospace'],
}
```

Background: `bg-parchment` (#f5f3ed)
Surface: `bg-cream` (#faf9f5)
Primary action: `bg-sage` buttons
Accent: `bg-terracotta` for warnings/highlights

## Primitives (port from FitnessAiManager)
Source: `/opt/FitnessAiManager/apps/web/src/design-system/components/primitives/`

- `Button.tsx` — remove font-hebrew → font-inter; keep all variants (primary, secondary, ghost, danger)
- `Card.tsx` + CardHeader/CardContent/CardFooter — direct port, remove RTL
- `Badge.tsx` — port + extend with variants: `done`/`in-progress`/`todo`/`blocked`/`haiku`/`sonnet`/`opus`
- `Input.tsx` — direct port, remove RTL classes

## 7 Pages / Routes

| Path | Page | Description |
|------|------|-------------|
| `/` | DashboardPage | KPIs, charts, sprint overview |
| `/docs/:section/:slug` | DocsPage | Browse methodology docs |
| `/specs/:slug` | SpecsPage | 10 role spec cards |
| `/backlog` | BacklogPage | Kanban board + sprint table |
| `/skills/:slug` | SkillsPage | 10 skill cards with phase diagrams |
| `/environments` | EnvironmentsPage | 6×10 compatibility matrix |
| `/design-system` | DesignSystemPage | Component gallery |

## Data Layer
`viewer/src/data/` — static JSON + ?raw .md imports (no API calls)
- `backlog.json` — parsed backlog data
- `docs/` — copied autospec docs files
- `environments.json` — 6×10 compatibility matrix data

## File Structure
```
viewer/
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
├── index.html
└── src/
    ├── main.tsx
    ├── App.tsx              # Router setup, 7 routes
    ├── components/
    │   ├── primitives/      # Button, Card, Badge, Input
    │   ├── layout/          # Sidebar, Header, Layout
    │   └── charts/          # BarChart, PieChart, AnimatedCounter
    ├── pages/               # 7 page components
    └── data/                # Static data files
```
