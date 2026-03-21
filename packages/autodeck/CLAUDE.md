# Claude Code Memory — AutoDeck

## About This Project

AutoDeck is a standalone, AI-native presentation framework extracted from AutoSpec's presentation system. It provides enterprise-grade React components for building stunning presentations with AI agents.

**npm packages:** `@autodeck/core` (component library), `@autodeck/cli` (scaffold & dev tools)

---

## Project Structure

```
packages/autodeck/
├── packages/
│   ├── core/                    # @autodeck/core — React component library
│   │   ├── src/
│   │   │   ├── engine/          # Presentation engine (orchestrator)
│   │   │   ├── slides/          # 13 built-in slide type components
│   │   │   ├── viz/             # 15 visualization building blocks
│   │   │   ├── backgrounds/     # 12 animated background effects
│   │   │   ├── animations/      # Animation presets & utilities
│   │   │   ├── themes/          # Theme system (createTheme, presets)
│   │   │   ├── navigation/      # Nav controls, progress, keyboard
│   │   │   ├── hooks/           # React hooks
│   │   │   └── index.ts         # Public API barrel export
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── cli/                     # @autodeck/cli — Scaffold & dev tools
│   │   ├── src/commands/        # init, dev, build, deploy
│   │   └── package.json
│   │
│   └── docs-site/               # Documentation website (Astro/Starlight)
│       └── package.json
│
├── skills/                      # AI agent skills (canonical source)
│   └── claude/                  # 4 skills: plan-slide, create-presentation, add-visualization, restyle-presentation
│
├── .claude/commands/            # Claude Code adapters
├── .opencode/skills/            # OpenCode adapters
├── .github/prompts/             # GitHub Copilot adapters
├── .cursor/rules/               # Cursor adapter
├── .continue/                   # Continue.dev adapter
├── .windsurf/rules/             # Windsurf adapter
│
├── examples/                    # Example presentations
│   ├── startup-pitch/
│   ├── tech-architecture/
│   ├── open-source-showcase/
│   └── conference-talk/
│
└── CLAUDE.md                    # This file
```

## Key Commands

```bash
# Development
cd packages/core && npm run dev      # Dev mode
cd packages/core && npm run build    # Build library
cd packages/cli && npm run build     # Build CLI

# Testing
cd packages/core && npm test         # Run tests

# Docs site
cd packages/docs-site && npm run dev # Dev docs
cd packages/docs-site && npm run build

# Full monorepo
npm run build                        # Build all packages (turbo)
```

## Component Reference

### 13 Slide Types
TitleSlide, ContentSlide, SplitSlide, GridSlide, TimelineSlide, PipelineSlide, CodeSlide, DiagramSlide, MetricsSlide, BalanceSlide, EraSlide, QuoteSlide, ClosingSlide

### 15 Visualization Components
TerminalWindow, BrowserMockup, FileTree, FlowDiagram, ChatWindow, CodeBlock, BalanceBeam, KanbanBoard, ArchitectureDiagram, ProcessLoop, Checklist, GradientText, AnimatedCounter, ProgressRing, ScrollProgressBar

### 12 Background Effects
particles, grid, circuits, gradient, matrix, constellation, waves, hex, aurora, fireflies, rain, nebula

### 4 Themes
dark (default), light, midnight, sunrise — or custom via createTheme()

## Design System

- **Background:** dark slate gradient (`from-slate-900 via-slate-800 to-slate-900`)
- **Text:** white with opacity variants (`text-white`, `text-white/60`, `text-white/40`)
- **Accent colors:** Tailwind palette (blue, violet, emerald, cyan, amber, indigo, green)
- **Cards:** `bg-white/5 border border-{color}-500/20 rounded-xl` (glass morphism)
- **Terminal chrome:** 3 dots (red/yellow/green) + dark background
- **Browser chrome:** 3 dots + URL bar + tab bar
- **Fonts:** Inter (sans), JetBrains Mono (mono)
- **Animations:** Framer Motion only — no additional animation libraries

## Animation Rules

- **Static slides** (single viewport): Use `initial` + `animate` with staggered `delay`
- **Scrollable slides** (multi-viewport): Use `whileInView` + `viewport={{ once: true, amount: 0.3 }}`
- **Never** add new npm animation dependencies — use framer-motion + Tailwind + inline SVG
- **Performance:** Prefer `opacity` and `transform` properties for smooth 60fps

## Tech Stack

- React 18 + TypeScript
- Framer Motion 11 (animations)
- Tailwind CSS 3.4 (styling)
- Vite 5 (build)
- Lucide React (icons)
- Turborepo (monorepo)
