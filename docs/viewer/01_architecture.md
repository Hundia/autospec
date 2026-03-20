---
title: "Viewer Architecture"
sprint: "1.1, 1.4"
created: "2026-03-09"
---

# Viewer Architecture

## Sprint 27 Update (2026-03-20) — Landing Page Redesign

The landing page was redesigned from 22 sections to 7 purposeful sections.

### New 7-Section Structure
1. Navigation
2. Hero (terminal animation demo)
3. Problem (new — context degradation timeline)
4. Three Pillars (Specs as Code, Sprint Summaries, Living Docs)
5. How It Works / Pipeline (4-phase stepper: Foundation → Visualize → Build → Close)
6. Viewer Preview (browser mockup)
7. Quick Start

### Removed Components (15 files deleted)
- EvolutionSection, ContextPoisoningSection, BreakingPointSection, CostOfNoSpecsSection
- RolesSection, SprintMemorySection, OrchestratorSection, QASection
- FinOpsSection, StatsSection, CompetitiveSection, CaseStudiesSection
- FutureVisionSection, ToolsSection, DocumentationSection

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
