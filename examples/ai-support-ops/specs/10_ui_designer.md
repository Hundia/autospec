# UI Designer Spec — AutoSpec Viewer

## Design Philosophy
Warm, editorial, readable. Inspired by physical notebooks and design documents. NOT the default dark tech aesthetic.

## Color Palette (exact hex values)
```
Background:  #f5f3ed  (parchment)
Surface:     #faf9f5  (cream)
Primary:     #698472  (sage)
Primary Dk:  #536a5b  (sage-600)
Accent:      #8e6a59  (terracotta)
Border:      #d8d0ba  (sand)
Border Lt:   #e8e4d8  (sand-200)
```

## Typography
- Body: Inter (Google Fonts)
- Code/mono: JetBrains Mono (Google Fonts)
- Scale: text-sm (14px) body, text-base (16px) prose, text-lg+ headings

## Component Inventory

### Primitives (from FitnessAiManager)
- **Button** — primary (sage bg), secondary (outlined), ghost, danger (terracotta)
- **Card** — parchment bg, sand border, subtle shadow
- **Badge** — standard variants + custom: `done`(sage), `in-progress`(amber), `todo`(gray), `blocked`(red), `haiku`(purple), `sonnet`(blue), `opus`(orange)
- **Input** — sand border, focus: sage ring

### Layout
- **Sidebar** — 240px, cream bg, sage active state, links to all 7 pages
- **Header** — parchment bg, page title + breadcrumb
- **Layout** — sidebar + main content area

### Charts (Recharts)
- **BarChart** — sage/terracotta fill, parchment background
- **PieChart** — sage palette segments
- **LineChart** — sage stroke
- **AnimatedCounter** — count-up animation, large text

## Page Wireframes

### Dashboard `/`
```
┌─────────────────────────────────────────────────┐
│ [KPI: Total Tickets] [Done] [In Progress] [Bugs] │
│                                                   │
│ ┌─ Tickets per Sprint (BarChart) ──┐ ┌─ Status ─┐│
│ │  ████ Sprint 0                   │ │ PieChart  ││
│ │  ████████ Sprint 1               │ │           ││
│ │  ████████████ Sprint 2-4         │ └───────────┘│
│ └──────────────────────────────────┘              │
│                                                   │
│ ┌─ Active Sprint ──────────────────────────────┐  │
│ │ Sprint 0: Foundation [████░░░░░░] 38%        │  │
│ │ [0.1 ✅] [0.2 ✅] [0.3 🔄] [0.4 🔲] ...    │  │
│ └──────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
```

### Backlog `/backlog`
```
┌─ Kanban ──────────────────────────────────────────┐
│ [🔲 Todo] [🔄 In Progress] [🧪 QA] [✅ Done] [❌] │
│                                                     │
│ Sprint 0   Sprint 1   Sprint 2   Sprint 2   ...    │
│ ┌──────┐  ┌──────┐   ┌──────┐   ┌──────┐          │
│ │ 0.3  │  │      │   │      │   │ 0.1  │          │
│ │ 0.4  │  │      │   │      │   │ 0.2  │          │
│ └──────┘  └──────┘   └──────┘   └──────┘          │
└─────────────────────────────────────────────────── ┘
```

### Environments `/environments`
```
6 tools × 10 skills compatibility matrix
Full ✅ | Partial ⚠️ | None ❌

         | sprint-run | exec-ticket | plan-sprint | ...
---------|------------|-------------|-------------|----
claude   |     ✅     |      ✅     |      ✅     | ...
cursor   |     ⚠️     |      ✅     |      ⚠️     | ...
copilot  |     ❌     |      ⚠️     |      ❌     | ...
```

## Icon System
Use Lucide React icons (already a React ecosystem standard).
