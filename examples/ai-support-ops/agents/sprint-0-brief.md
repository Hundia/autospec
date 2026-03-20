# Sprint 0 Agent Briefing — AutoSpec SDD Foundation

**Agent:** Sonnet 4.6
**Orchestrator:** Opus 4.6 (this briefing was written by the orchestrator)
**Working directory:** `/opt/FitnessAiManager/autospec`
**Date:** 2026-03-09

---

## Your Mission

Bootstrap AutoSpec as a proper SDD project using its own methodology. You will create the structural foundation that enables all subsequent sprints to execute using AutoSpec's own tools. You are NOT building the viewer — that's Sprint 1+. You are creating the SDD scaffolding.

**CRITICAL: You are a Sonnet 4.6 implementation agent. The Opus orchestrator does not implement — you do. Work directly in `/opt/FitnessAiManager/autospec/` (no worktree isolation for Sprint 0 — you're on main).**

---

## What Already Exists (do NOT overwrite)

```
/opt/FitnessAiManager/autospec/
├── skills/claude/          ← 10 .md skill files (already exist)
│   ├── create-spec.md
│   ├── create-sprint-docs.md
│   ├── execute-ticket.md
│   ├── help.md
│   ├── plan-sprint.md
│   ├── qa-review.md
│   ├── sprint-close.md
│   ├── sprint-run.md
│   ├── sprint-status.md
│   └── update-backlog.md
├── docs/methodology/       ← 9 files (01-09) already exist
├── docs/environments/      ← terminal/, vscode/ already exist
├── backlog.md              ← OLD framework-level backlog (DO NOT DELETE — reference it)
├── cli/                    ← CLI source (don't touch in Sprint 0)
├── QUICKSTART.md           ← Don't modify in Sprint 0
└── README.md               ← Don't modify in Sprint 0
```

---

## Sprint 0 Deliverables (execute ALL of these)

### Task 0.1 — Copy Skills to `.claude/commands/`

Create directory and copy all 10 skill files verbatim:

```bash
mkdir -p /opt/FitnessAiManager/autospec/.claude/commands
cp /opt/FitnessAiManager/autospec/skills/claude/*.md /opt/FitnessAiManager/autospec/.claude/commands/
```

Verify: `ls /opt/FitnessAiManager/autospec/.claude/commands/` shows 10 .md files.

---

### Task 0.2 — Create `autospec/CLAUDE.md`

Create `/opt/FitnessAiManager/autospec/CLAUDE.md` with this content:

```markdown
# Claude Code Memory — AutoSpec

## About This Project

AutoSpec is a Spec-Driven Development (SDD) framework. **This project develops itself using its own tools.** Use `/sprint-run`, `/execute-ticket`, `/sprint-status` etc. in Claude Code.

---

## MANDATORY Development Workflow

### Rule 1: Backlog-First Development

Every fix, feature, or change MUST be tracked in `specs/backlog.md` before or during implementation:

1. Determine if this is a **bug** (B.XX), **new feature**, or **enhancement**
2. Add ticket to `specs/backlog.md` in the appropriate sprint section
3. Set status to 🔄 In Progress when starting
4. Set status to ✅ Done when complete

**Skip ONLY when user explicitly says** "skip backlog", "don't track this"

### Rule 2: Living Documentation

Every implemented feature MUST update `docs/`:

- Viewer changes → `docs/viewer/`
- CLI changes → `docs/cli/`
- Methodology changes → `docs/methodology/`
- Deployment changes → `docs/deployment/`
- New subsystem → create new `docs/<subsystem>/` directory

### Rule 3: QA Before Done

No ticket is ✅ Done without verification:

| Change Type | QA Required |
|-------------|-------------|
| Bug fix | Reproduce first, fix, verify user flow passes |
| CLI change | `npm run build` + `npm test` in `cli/` |
| Viewer change | `npm run build` in `viewer/` + visual check |
| Docs/config only | No QA — mark ✅ directly |
| New feature | Full test suite + new test cases if needed |

### Rule 4: Orchestrator + Agent Execution Pattern

This project uses **Opus 4.6 as Orchestrator + Sonnet 4.6 as Sprint Agents**:

1. Orchestrator writes `agents/sprint-X-brief.md` before spawning
2. Orchestrator spawns: `Agent(subagent_type=general-purpose)` with briefing
3. Agent reads brief + relevant specs + docs, implements tickets
4. Agent updates: `specs/backlog.md` (🔲→✅), docs/, `sprints/sprint-X/summary.md`
5. Orchestrator reviews summary, spawns next sprint(s)

**Parallel execution:** Sprints with no dependencies run as parallel agents in one message.

---

## Project Structure

```
autospec/
├── .claude/commands/       # 10 SDD skill files (symlinked from skills/claude/)
├── specs/                  # Role spec files (01-10) + backlog.md
├── agents/                 # Sprint briefing files (sprint-X-brief.md)
├── sprints/                # Sprint summaries (sprint-X/summary.md)
├── docs/                   # Living documentation
│   ├── methodology/        # 10 files: SDD philosophy, roles, patterns
│   ├── environments/       # IDE/terminal setup guides
│   ├── viewer/             # Viewer app docs (created Sprint 1+)
│   ├── cli/                # CLI docs (created Sprint 4+)
│   └── deployment/         # CI/CD + GitHub Pages (created Sprint 5)
├── skills/claude/          # Source skill .md files
├── cli/                    # CLI tool source (Node/TypeScript)
├── viewer/                 # React viewer app (created Sprint 1)
└── QUICKSTART.md           # Full usage guide
```

## Key Commands

```bash
# CLI
cd cli && npm run build
cd cli && npm test

# Viewer (Sprint 1+)
cd viewer && npm run dev
cd viewer && npm run build

# Tests
cd cli && HEADLESS=true npx vitest run
```

## Current Sprint

See `specs/backlog.md` for active sprint and tickets.
```

---

### Task 0.3 — Create `specs/` with 10 Role Spec Files

Create directory and all 10 files:

```bash
mkdir -p /opt/FitnessAiManager/autospec/specs
```

**File: `specs/01_product_manager.md`**

```markdown
# Product Manager Spec — AutoSpec

## Vision
AutoSpec is the definitive SDD toolkit for AI-assisted development. Any developer or team should be able to bootstrap a well-structured project in under 5 minutes and maintain it with rigorous spec-driven practices.

## The 4 Personas

### 1. Solo Developer (primary)
- Builds side projects / SaaS with Claude Code
- Needs: fast bootstrap, AI-friendly structure, minimal overhead
- Pain: context drift, AI hallucinating architecture, no traceability

### 2. Small Team (3-8 devs)
- Startup or agency building production software
- Needs: shared specs, parallel agents, role clarity, QA gates
- Pain: AI agents step on each other, no single source of truth

### 3. OSS Contributor
- Maintains open-source project, wants AI PRs to follow spec
- Needs: CLAUDE.md conventions, structured backlog, PR templates
- Pain: AI PRs ignore architecture, break conventions

### 4. Enterprise Adopter
- Regulated industry, needs audit trails
- Needs: all decisions traceable to spec, sprint summaries for compliance
- Pain: AI "just works" but no documentation, can't audit

## MoSCoW Prioritization

### Must Have (MVP)
- `autospec init` CLI command generating project scaffold
- 10 role spec templates (01-10)
- Backlog management with status tracking
- CLAUDE.md generation with backlog-first rules
- Skills for: sprint-run, execute-ticket, sprint-status, update-backlog

### Should Have
- Visual viewer (React) for specs, backlog, docs
- Sprint orchestrator pattern (Opus + Sonnet agents)
- GitHub Actions CI/CD
- NPM publish

### Could Have
- Environments compatibility matrix
- GitHub Pages auto-deploy
- Mermaid diagram rendering
- Product Hunt launch kit

### Won't Have (v1)
- Team collaboration server
- Cloud-hosted viewer
- Payment integration
- Mobile app

## User Stories

- As a solo dev, I want `npx autospec init` to scaffold my project in <5min
- As a team lead, I want all sprint work traceable to spec tickets
- As a Claude Code user, I want `/sprint-run 3` to execute a full sprint
- As an OSS maintainer, I want CLAUDE.md to enforce spec-first AI contributions
- As a viewer user, I want to browse all project docs in a warm, readable UI
```

**File: `specs/02_backend_lead.md`**

```markdown
# Backend Lead Spec — AutoSpec CLI

## CLI Architecture

**Stack:** Node.js 20, TypeScript 5, Commander.js, tsup (bundler)

**Entry:** `cli/src/index.ts`
**Build:** `tsup src/index.ts --format cjs,esm --dts`
**Test:** Vitest

## Command Structure

```
autospec
├── init [project-name]       # Scaffold new SDD project
├── spec generate             # Generate spec files from SRS input
├── sprint create [number]    # Create sprint docs from backlog
├── viewer build              # Generate static viewer
└── --version / --help
```

## Key Generators (`cli/src/generators/`)

- `project-scaffold.generator.ts` — creates full project structure
- `spec.generator.ts` — generates role spec files from templates
- `backlog.generator.ts` — initializes backlog.md with sprint structure
- `claude-md.generator.ts` — generates CLAUDE.md with SDD rules
- `viewer-prompt.generator.ts` — emits warm palette viewer spec for AI

## Parsers (`cli/src/parsers/`)

- `backlog.parser.ts` — parses backlog.md to JSON (status, tickets, sprints)
- `spec.parser.ts` — parses spec .md files to structured objects

## Design Decisions
- Pure file-based "database" — no SQLite, no network
- All generators are pure functions (input → output string, no side effects)
- tsup for zero-config bundling to CommonJS + ESM
- Vitest for fast unit tests on generators/parsers

## Standards
- All files: strict TypeScript, no `any`
- Functions > Classes where possible
- Generators return strings (callers write to disk)
- 80%+ test coverage on generators and parsers
```

**File: `specs/03_frontend_lead.md`**

```markdown
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
```

**File: `specs/04_db_architect.md`**

```markdown
# Database Architect Spec — AutoSpec Data Layer

## Philosophy
No database server. All state is file-based. The "schema" is the shape of the .md and .json files.

## File-Based "DB" Schema

### backlog.md (primary store)
Parsed by `cli/src/parsers/backlog.parser.ts` into:
```typescript
interface BacklogData {
  sprints: Sprint[];
  bugs: Bug[];
}

interface Sprint {
  number: string;        // "0", "1", "2.1"
  name: string;
  status: 'todo' | 'in-progress' | 'done';
  tickets: Ticket[];
}

interface Ticket {
  id: string;            // "0.1", "1.3", "B.01"
  title: string;
  owner: string;         // role name
  points: number;
  status: '🔲' | '🔄' | '🧪' | '✅' | '❌';
  dependencies: string[];
  docsPath?: string;
}
```

### environments.json
```typescript
interface EnvironmentsData {
  tools: string[];       // 6 AI tools
  skills: string[];      // 10 skills
  matrix: Record<string, Record<string, 'full' | 'partial' | 'none'>>;
}
```

### specs/ (role definitions)
10 static .md files. Parsed for display in viewer SpecsPage.

## Conventions
- Never add a database server (Postgres, SQLite, etc.) to autospec itself
- The CLI reads/writes .md files directly (no ORM, no query builder)
- The viewer reads pre-parsed JSON at build time (no runtime file I/O in browser)
```

**File: `specs/05_qa_lead.md`**

```markdown
# QA Lead Spec — AutoSpec Testing

## Test Stack
- **CLI:** Vitest (unit tests on generators/parsers)
- **Viewer:** Vitest + React Testing Library (component tests)
- **E2E:** Playwright TC-01→TC-08 (viewer pages render correctly)

## Coverage Target
- CLI generators/parsers: 80%+
- Viewer components: 60%+
- E2E: all 7 routes smoke-tested

## CLI Test Cases
| TC | What | Expected |
|----|------|----------|
| TC-CLI-01 | `autospec init my-app` | Creates correct file structure |
| TC-CLI-02 | backlog.parser — parses sprint 0 tickets | Returns 8 tickets, all statuses correct |
| TC-CLI-03 | spec.generator — generates 01_product_manager.md | File exists, contains Vision section |
| TC-CLI-04 | claude-md.generator — generates CLAUDE.md | Contains backlog-first rule |
| TC-CLI-05 | viewer-prompt.generator — warm palette | Contains parchment/sage/terracotta hex values |

## Viewer E2E Test Cases
| TC | Route | Expected |
|----|-------|----------|
| TC-UI-01 | `/` | DashboardPage renders, parchment background visible |
| TC-UI-02 | `/docs/methodology/01_philosophy` | Markdown renders, no "undefined" text |
| TC-UI-03 | `/specs/01_product_manager` | Spec card renders with correct title |
| TC-UI-04 | `/backlog` | Kanban board shows 5 columns |
| TC-UI-05 | `/skills/sprint-run` | Skill card renders phase diagram |
| TC-UI-06 | `/environments` | 6×10 matrix renders |
| TC-UI-07 | `/design-system` | Button/Card/Badge components visible |
| TC-UI-08 | Build output | `npm run build` exits 0, no TS errors |

## QA Rules
- No ticket is ✅ Done without relevant test passing
- Bug fixes: reproduce the bug first, then verify fix
- New routes: TC-UI-XX added before marking done
```

**File: `specs/06_devops_lead.md`**

```markdown
# DevOps Lead Spec — AutoSpec Infrastructure

## NPM Package
- **Name:** `autospec` (or `@autospec/cli` if taken)
- **Version:** 0.1.0 → follows semver
- **Main:** `dist/index.js` (CommonJS)
- **Bin:** `autospec` → `dist/index.js`
- **publishConfig:** `{ "access": "public" }`

## GitHub Actions Workflows

### `.github/workflows/ci.yml` (on: push, PR)
```yaml
jobs:
  test:
    - checkout
    - node 20
    - cd cli && npm ci && npm run build && npm test
  build-viewer:
    - cd viewer && npm ci && npm run build
```

### `.github/workflows/pages.yml` (on: push to main)
```yaml
jobs:
  deploy:
    - build viewer (npm run build)
    - Upload artifact: viewer/dist/
    - Deploy to GitHub Pages
```

### `.github/workflows/release.yml` (on: tag v*)
```yaml
jobs:
  publish:
    - npm publish (with NPM_TOKEN secret)
```

## Package Scripts
```json
{
  "scripts": {
    "build": "tsup src/index.ts --format cjs,esm --dts",
    "test": "vitest run",
    "test:watch": "vitest",
    "prepublishOnly": "npm run build && npm test",
    "typecheck": "tsc --noEmit"
  }
}
```

## Release Process
1. Update version in `cli/package.json`
2. `git tag v0.1.0`
3. Push tag → triggers release.yml → npm publish
4. Update CHANGELOG.md
```

**File: `specs/07_marketing_lead.md`**

```markdown
# Marketing Lead Spec — AutoSpec OSS Positioning

## Positioning Statement
AutoSpec is the first SDD (Spec-Driven Development) framework that treats specs as executable — giving AI agents a structured context to build predictably and traceably.

## Target Audience
1. Claude Code power users (primary launch channel)
2. Cursor/Copilot Workspace users looking for more structure
3. Teams burned by AI hallucinating architecture

## Launch Strategy

### Phase 1: GitHub (Week 1)
- README with animated demo GIF
- `npx autospec init demo-app` as hero command
- Star badges, license badge, CI badge
- Clear "Why not shadcn/Cursor Rules/Copilot Workspace?" section

### Phase 2: Show HN (Week 2)
Title: "Show HN: AutoSpec – Spec-Driven Development framework for AI-assisted projects"
Hook: "After 16 sprints and 200+ tickets, I extracted the methodology that keeps Claude from hallucinating architecture. Here's the toolkit."

### Phase 3: Product Hunt (Week 3)
- Hunter: founder account
- Tagline: "The spec layer between you and your AI agents"
- Demo video: 90 seconds, `autospec init` → viewer → sprint-run

## Competitive Differentiation

| Feature | AutoSpec | Cursor Rules | Copilot Workspace | plain CLAUDE.md |
|---------|----------|-------------|-------------------|-----------------|
| Role specs | ✅ 10 roles | ❌ | ❌ | ❌ |
| Backlog traceability | ✅ | ❌ | Partial | ❌ |
| Multi-agent orchestration | ✅ | ❌ | ❌ | ❌ |
| Visual viewer | ✅ | ❌ | ✅ | ❌ |
| Framework-agnostic | ✅ | ✅ | ✅ | ✅ |
| Bootstrap CLI | ✅ | ❌ | ❌ | ❌ |

## Messaging
- NOT: "a better README template"
- IS: "Spec-Driven Development — the missing layer above your AI agent"
```

**File: `specs/08_finance_lead.md`**

```markdown
# Finance Lead Spec — AutoSpec Business Model

## Model: Free / MIT Open Source

### v1 Revenue: None (intentionally)
- MIT license, fully free
- GitHub free tier (Actions, Pages, Packages)
- No infrastructure costs (static files, NPM registry)

### Sponsorship Path (v2+)
- GitHub Sponsors (individual + organization tiers)
- Open Collective (for team/enterprise usage)
- Suggested sponsorship tiers:
  - $5/mo — "Believer" (name in README)
  - $25/mo — "Practitioner" (priority issue response)
  - $100/mo — "Team" (private Discord, direct support)

### Cost Structure (current)
| Item | Cost | Notes |
|------|------|-------|
| GitHub hosting | $0 | Free tier |
| NPM registry | $0 | Public package |
| GitHub Actions | $0 | Free tier (2000 min/mo) |
| GitHub Pages | $0 | Free for public repos |
| Domain (if any) | ~$15/yr | Optional |

### KPIs (not revenue)
- GitHub stars: target 500 in month 1
- NPM downloads: target 1000/week by month 3
- Show HN: target top 10

## Philosophy
Maximize adoption → sponsorship follows. Never paywalled core functionality.
```

**File: `specs/09_business_lead.md`**

```markdown
# Business Lead Spec — AutoSpec Market Analysis

## Market Context

### The Problem Space
AI coding tools (Claude, Copilot, Cursor) are powerful but unstructured. Without explicit specs and conventions, AI agents:
- Hallucinate architecture ("let me use Redux here")
- Break conventions across sessions
- Leave no audit trail
- Can't coordinate across multiple agents

### The Solution
SDD (Spec-Driven Development) — a methodology layer that:
1. Captures intent in structured spec files before implementation
2. Enforces conventions via CLAUDE.md and skills
3. Tracks all work in a structured backlog
4. Enables multi-agent coordination with clear role boundaries

## Competitive Landscape

### Direct Competitors
- **None** — no other framework specifically addresses AI-assisted SDD at this scope

### Adjacent Tools
- **Cursor Rules** — single-file conventions, no backlog, no roles
- **GitHub Copilot Workspace** — task-level, no multi-agent, no viewer
- **.cursorrules** — per-project, no structure, no skills
- **AutoGPT** — autonomous agents, no human-in-the-loop, no SDD

### Moat
- Battle-tested on 16+ sprints of production software (English Kef)
- The "warm palette viewer" is a differentiator (beautiful, not dark-mode-default)
- OSS: community contribution amplifies methodology

## Growth Strategy
1. Launch on HN/Product Hunt with real production track record
2. Let usage data guide prioritization (GitHub Issues as product feedback)
3. Partner with Claude Code team for official mention
4. Version 2: team features (shared specs server, PR integration)

## Success Metrics (6 months)
- 1000+ GitHub stars
- 500+ NPM weekly downloads
- 3+ community-contributed examples
- Featured in Claude documentation
```

**File: `specs/10_ui_designer.md`**

```markdown
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
```

---

### Task 0.4 — Create `specs/backlog.md`

Create `/opt/FitnessAiManager/autospec/specs/backlog.md` — the new canonical SDD backlog for building autospec itself:

```markdown
# AutoSpec — SDD Project Backlog

**Version:** 1.0
**Created:** 2026-03-09
**Framework:** Using AutoSpec's own SDD methodology

---

## Sprint 0: SDD Foundation (~38 pts) — SERIAL

**Theme:** Bootstrap AutoSpec as an SDD project using its own tools
**Status:** 🔄 In Progress

| ID | Ticket | Owner | Pts | Status | Deps | Docs |
|----|--------|-------|-----|--------|------|------|
| 0.1 | Copy 10 skills → `.claude/commands/` | DevOps | 2 | 🔲 | — | — |
| 0.2 | Create `autospec/CLAUDE.md` with SDD rules + orchestrator pattern | PM | 5 | 🔲 | — | — |
| 0.3 | Create `specs/` — 10 role spec files | PM | 13 | 🔲 | — | — |
| 0.4 | Create `specs/backlog.md` — all 6 sprints ticketed | PM | 8 | 🔲 | 0.3 | — |
| 0.5 | Update `skills/claude/sprint-run.md` + `execute-ticket.md` — Orchestrator Pattern | PM | 3 | 🔲 | — | — |
| 0.6 | Create `agents/sprint-1-brief.md` through `sprint-5-brief.md` | PM | 5 | 🔲 | 0.4 | — |
| 0.7 | Create `docs/methodology/10_orchestrator_agent_pattern.md` | Docs | 3 | 🔲 | — | `docs/methodology/10_orchestrator_agent_pattern.md` |
| 0.8 | Create `sprints/sprint-0/summary.md` | PM | 2 | 🔲 | 0.1–0.7 | `sprints/sprint-0/summary.md` |

---

## Sprint 1: Viewer Scaffold + Primitives + Dashboard (~33 pts) — after Sprint 0

**Theme:** Bootstrap React viewer with FitnessAiManager design system
**Status:** 🔲 Todo

| ID | Ticket | Owner | Pts | Status | Deps | Docs |
|----|--------|-------|-----|--------|------|------|
| 1.1 | Viewer scaffold: `viewer/` init, package.json, vite.config.ts, tailwind.config.js | Frontend | 5 | 🔲 | 0.x done | `docs/viewer/01_architecture.md` |
| 1.2 | FitnessAiManager design tokens in Tailwind (warm palette, Inter, JetBrains Mono) | UI | 3 | 🔲 | 1.1 | `docs/viewer/02_design_system.md` |
| 1.3 | Port primitives: Button, Card, Badge (extended), Input | UI | 8 | 🔲 | 1.2 | `docs/viewer/03_components.md` |
| 1.4 | Layout: Sidebar, Header, Layout, App.tsx routing (7 routes) | Frontend | 5 | 🔲 | 1.3 | `docs/viewer/01_architecture.md` |
| 1.5 | DashboardPage `/` — KPIs, BarChart, PieChart, sprint quick-links | Frontend | 8 | 🔲 | 1.4 | `docs/viewer/04_pages.md` |
| 1.6 | DesignSystemPage `/design-system` — component gallery | UI | 5 | 🔲 | 1.3 | `docs/viewer/02_design_system.md` |
| 1.7 | `docs/viewer/01_architecture.md` + `docs/viewer/02_design_system.md` | Docs | 3 | 🔲 | 1.4 | `docs/viewer/` |

---

## Sprint 2: Viewer Content Pages (~32 pts) — PARALLEL with Sprint 3+4

**Theme:** Docs browser, Specs viewer, Backlog kanban
**Status:** 🔲 Todo

| ID | Ticket | Owner | Pts | Status | Deps | Docs |
|----|--------|-------|-----|--------|------|------|
| 2.1 | `DocsPage` `/docs/:section/:slug` — DocTree nav, Fuse.js search, MarkdownRenderer + MermaidRenderer | Frontend | 13 | 🔲 | 1.x done | `docs/viewer/04_pages.md` |
| 2.2 | `SpecsPage` `/specs/:slug` — 10-card grid, per-spec markdown, sticky TOC | Frontend | 8 | 🔲 | 1.x done | `docs/viewer/04_pages.md` |
| 2.3 | `BacklogPage` `/backlog` — KanbanBoard (5 cols), SprintTable, BurndownChart | Frontend | 8 | 🔲 | 1.x done | `docs/viewer/04_pages.md` |
| 2.4 | Static data layer: `viewer/src/data/` structure, `?raw` .md imports, `backlog.json` parser | Frontend | 5 | 🔲 | 1.1 | `docs/viewer/01_architecture.md` |
| 2.5 | Update `docs/viewer/04_pages.md` (docs + specs + backlog sections) | Docs | 3 | 🔲 | 2.1–2.3 | `docs/viewer/04_pages.md` |

---

## Sprint 3: Viewer Advanced Pages (~32 pts) — PARALLEL with Sprint 2+4

**Theme:** Skills showcase, Environments matrix, Charts
**Status:** 🔲 Todo

| ID | Ticket | Owner | Pts | Status | Deps | Docs |
|----|--------|-------|-----|--------|------|------|
| 3.1 | `SkillsPage` `/skills/:slug` — 10 skill cards, phase diagrams, usage examples | Frontend | 8 | 🔲 | 1.x done | `docs/viewer/04_pages.md` |
| 3.2 | `EnvironmentsPage` `/environments` — 6×10 compatibility matrix | Frontend | 8 | 🔲 | 1.x done | `docs/viewer/04_pages.md` |
| 3.3 | Chart components: BarChart, PieChart, LineChart, AnimatedCounter, ProgressRing | UI | 8 | 🔲 | 1.x done | `docs/viewer/03_components.md` |
| 3.4 | `environments.json` data file (6×10 matrix: claude/cursor/copilot/windsurf/jetbrains/aider × 10 skills) | Frontend | 5 | 🔲 | — | — |
| 3.5 | Update `docs/viewer/04_pages.md` (skills + environments sections) | Docs | 3 | 🔲 | 3.1–3.2 | `docs/viewer/04_pages.md` |

---

## Sprint 4: CLI + QUICKSTART Update (~26 pts) — PARALLEL with Sprint 2+3

**Theme:** CLI warm palette + QUICKSTART Section 7 rewrite
**Status:** 🔲 Todo

| ID | Ticket | Owner | Pts | Status | Deps | Docs |
|----|--------|-------|-----|--------|------|------|
| 4.1 | Update `cli/src/generators/viewer-prompt.generator.ts` — emit warm palette spec (FitnessAiManager primitives, no shadcn) | Backend | 8 | 🔲 | — | `docs/cli/viewer_generator.md` |
| 4.2 | Update `skills/claude/` templates — generated project skills include orchestrator pattern | Backend | 5 | 🔲 | — | — |
| 4.3 | QUICKSTART.md Section 7 rewrite: replace shadcn → FitnessAiManager primitives, warm palette, no dark slate | Docs | 8 | 🔲 | — | QUICKSTART.md |
| 4.4 | Create `docs/cli/viewer_generator.md` | Docs | 5 | 🔲 | 4.1 | `docs/cli/viewer_generator.md` |

---

## Sprint 5: Polish + Launch (~26 pts) — SERIAL last

**Theme:** Self-referential viewer, CI/CD, NPM publish
**Status:** 🔲 Todo

| ID | Ticket | Owner | Pts | Status | Deps | Docs |
|----|--------|-------|-----|--------|------|------|
| 5.1 | `viewer/src/data/docs/` — copy autospec docs (self-referential viewer) | Frontend | 5 | 🔲 | 2.x done | — |
| 5.2 | GitHub Actions: `.github/workflows/ci.yml` + `pages.yml` | DevOps | 8 | 🔲 | 1.x done | `docs/deployment/github_pages.md` |
| 5.3 | `npm publish --dry-run` verification + `package.json` publishConfig | DevOps | 5 | 🔲 | CLI done | — |
| 5.4 | `docs/deployment/github_pages.md` | Docs | 3 | 🔲 | 5.2 | `docs/deployment/github_pages.md` |
| 5.5 | Sprint 5 summary + backlog cleanup | PM | 5 | 🔲 | all done | `sprints/sprint-5/summary.md` |

---

## Bug Tracker

*(No bugs yet — Sprint 0 is initial setup)*

---

## Backlog Statistics

| Sprint | Points | Status |
|--------|--------|--------|
| Sprint 0 | 38 | 🔄 In Progress |
| Sprint 1 | 33 | 🔲 Todo |
| Sprint 2 | 32 | 🔲 Todo |
| Sprint 3 | 32 | 🔲 Todo |
| Sprint 4 | 26 | 🔲 Todo |
| Sprint 5 | 26 | 🔲 Todo |
| **Total** | **187** | |
```

---

### Task 0.5 — Update `skills/claude/sprint-run.md` and `execute-ticket.md`

Add the **Orchestrator Pattern** section to `sprint-run.md`. Find the "Phase 2: Ticket Execution" section and add BEFORE it:

```markdown
### Orchestrator + Agent Execution Pattern (Recommended for multi-sprint)

When running multiple sprints or large batches, use the **Opus Orchestrator + Sonnet Agent** pattern:

1. **Orchestrator (Opus 4.6)** — never implements directly. Instead:
   - Writes `agents/sprint-X-brief.md` with full context package
   - Spawns `Agent(subagent_type=general-purpose)` for each sprint
   - Reviews results, merges, then spawns next batch

2. **Sprint Agent (Sonnet 4.6)** — reads brief, implements all tickets:
   - Reads `agents/sprint-X-brief.md` for full context
   - Executes tickets per `execute-ticket.md` conventions
   - Updates `specs/backlog.md` (🔲→✅), docs/, sprint summary

3. **Parallel batches** — sprints with no dependencies run as parallel agents in ONE message:
   ```
   Turn N: spawn Agent A (Sprint 2) + Agent B (Sprint 3) + Agent C (Sprint 4)
   Turn N+1: merge results → spawn Agent D (Sprint 5)
   ```

**Brief file format:** `agents/sprint-X-brief.md`
- Exact file paths to read
- Code snippets (no hallucination of values)
- File tree to create
- Conventions and forbidden patterns
- Verification checklist
```

For `execute-ticket.md`, add at the top of "Instructions" section:

```markdown
**Note:** When running inside an Orchestrator+Agent session, the agent briefing file (`agents/sprint-X-brief.md`) takes precedence over interactive backlog discovery. Read it first.
```

---

### Task 0.6 — Create Sprint 1–5 Briefing Files

Create `/opt/FitnessAiManager/autospec/agents/sprint-1-brief.md` through `sprint-5-brief.md`.

**IMPORTANT:** These are placeholder briefings. The Opus orchestrator will enrich them before spawning agents. Create them with the correct structure but mark key sections as "TO BE ENRICHED BY ORCHESTRATOR".

**`agents/sprint-1-brief.md`:**
```markdown
# Sprint 1 Agent Briefing — Viewer Scaffold + Primitives + Dashboard

**Agent:** Sonnet 4.6
**Sprint:** 1 of 5
**Depends on:** Sprint 0 complete
**Working directory:** `/opt/FitnessAiManager/autospec`

## Tickets to Execute
1.1 → 1.2 → 1.3 (parallel candidates) → 1.4 → 1.5 → 1.6 → 1.7

## Key Source Files to Read
- `/opt/FitnessAiManager/apps/web/tailwind.config.js` — copy color tokens
- `/opt/FitnessAiManager/apps/web/src/design-system/components/primitives/Button.tsx`
- `/opt/FitnessAiManager/apps/web/src/design-system/components/primitives/Card.tsx`
- `/opt/FitnessAiManager/apps/web/src/design-system/components/primitives/Badge.tsx`
- `/opt/FitnessAiManager/apps/web/src/design-system/components/primitives/Input.tsx`
- `/opt/FitnessAiManager/autospec/specs/03_frontend_lead.md` — viewer spec
- `/opt/FitnessAiManager/autospec/specs/10_ui_designer.md` — design spec

## Critical Conventions
- NO shadcn/ui
- NO RTL classes
- NO dark slate colors (#0f172a, slate-950)
- Background: bg-[#f5f3ed] (parchment)
- Font: Inter (body), JetBrains Mono (code)
- Port Button/Card/Badge/Input FROM FitnessAiManager, adapt (remove RTL/Hebrew)

## Verification
- `cd viewer && npm run build` → 0 TypeScript errors
- `npm run dev` → parchment background visible in browser
- DashboardPage renders with sage-colored Recharts charts
```

**`agents/sprint-2-brief.md`:**
```markdown
# Sprint 2 Agent Briefing — Viewer Content Pages

**Agent:** Sonnet 4.6
**Sprint:** 2 of 5
**Depends on:** Sprint 1 complete (viewer scaffold exists)
**Working directory:** `/opt/FitnessAiManager/autospec`

## Tickets to Execute
2.1 (DocsPage), 2.2 (SpecsPage), 2.3 (BacklogPage), 2.4 (data layer), 2.5 (docs update)

## Context Files
- `viewer/` — existing scaffold from Sprint 1
- `autospec/docs/methodology/` — content for DocsPage
- `autospec/specs/backlog.md` — content for BacklogPage
- `autospec/specs/0[1-9]_*.md` — content for SpecsPage
- `specs/03_frontend_lead.md` — data layer conventions

## Key Dependencies
- Uses primitives from Sprint 1 (Button, Card, Badge)
- Uses Layout from Sprint 1

## Verification
- `/docs/methodology/01_philosophy` route renders markdown
- `/specs/01_product_manager` shows spec card
- `/backlog` shows 5-column kanban
```

**`agents/sprint-3-brief.md`:**
```markdown
# Sprint 3 Agent Briefing — Viewer Advanced Pages

**Agent:** Sonnet 4.6
**Sprint:** 3 of 5
**Depends on:** Sprint 1 complete (viewer scaffold exists)
**Working directory:** `/opt/FitnessAiManager/autospec`

## Tickets to Execute
3.1 (SkillsPage), 3.2 (EnvironmentsPage), 3.3 (Chart components), 3.4 (environments.json), 3.5 (docs)

## Context Files
- `viewer/` — existing scaffold from Sprint 1
- `autospec/skills/claude/` — 10 skill files for SkillsPage
- `autospec/docs/environments/` — environment docs for context
- `specs/10_ui_designer.md` — environments matrix wireframe

## Verification
- `/skills/sprint-run` renders skill card
- `/environments` renders 6×10 matrix
- All chart components render without console errors
```

**`agents/sprint-4-brief.md`:**
```markdown
# Sprint 4 Agent Briefing — CLI + QUICKSTART Update

**Agent:** Sonnet 4.6
**Sprint:** 4 of 5
**Depends on:** Sprint 0 complete (independent of Sprint 1-3 viewer)
**Working directory:** `/opt/FitnessAiManager/autospec`

## Tickets to Execute
4.1 (viewer-prompt.generator.ts), 4.2 (skills templates), 4.3 (QUICKSTART.md Section 7), 4.4 (docs)

## Key Files to Read
- `cli/src/generators/viewer-prompt.generator.ts` — current content
- `QUICKSTART.md` lines 1671–1912 — Section 7 (shadcn content to replace)
- `skills/claude/sprint-run.md` — template to update

## Critical Changes
- Section 7.1: Replace `npx shadcn@latest` → "port primitives from FitnessAiManager"
- Section 7.1.1: Add shadcn to forbidden list
- Section 7.3: Replace dark CSS vars (#0f172a etc.) → warm palette vars
- viewer-prompt.generator.ts: emit parchment/sage/terracotta tokens

## Verification
- `grep -n "shadcn" QUICKSTART.md` → 0 results in Section 7
- `grep -n "0f172a\|slate-950" QUICKSTART.md` → 0 results in Section 7
- `cd cli && npm run build` → no errors
```

**`agents/sprint-5-brief.md`:**
```markdown
# Sprint 5 Agent Briefing — Polish + Launch

**Agent:** Sonnet 4.6
**Sprint:** 5 of 5
**Depends on:** All prior sprints complete
**Working directory:** `/opt/FitnessAiManager/autospec`

## Tickets to Execute
5.1 (data/docs symlink), 5.2 (GitHub Actions), 5.3 (npm publish verify), 5.4 (deployment docs), 5.5 (sprint 5 summary)

## Context Files
- `autospec/docs/` — source for self-referential viewer data
- `cli/package.json` — for publishConfig check
- `viewer/` — for GitHub Pages build

## GitHub Actions to Create
- `.github/workflows/ci.yml` — test CLI + build viewer on push/PR
- `.github/workflows/pages.yml` — deploy viewer/dist to GitHub Pages on main push

## Verification
- `cd cli && npm publish --dry-run` → "Tarball Contents" with correct files
- `.github/workflows/ci.yml` passes on `act` local run
- `viewer/src/data/docs/` contains autospec methodology docs
```

---

### Task 0.7 — Create `docs/methodology/10_orchestrator_agent_pattern.md`

```markdown
---
title: "10. Orchestrator + Agent Execution Pattern"
sprint: "0.7"
created: "2026-03-09"
---

# Orchestrator + Agent Execution Pattern

## Overview

AutoSpec uses a two-tier AI execution model for sprint development:

- **Opus 4.6 Orchestrator** — high-level planning, briefing writing, result review
- **Sonnet 4.6 Sprint Agents** — implementation, focused execution

This keeps the orchestrator's context clean (no implementation details) while giving agents rich, precise context packages.

## Why This Pattern

Without structure, AI agents in long conversations suffer from:
- Context drift (forgets conventions from turn 1 by turn 50)
- Hallucinated values (invents hex colors, API paths, file names)
- Sequential bottleneck (no parallelism)

The briefing file pattern solves all three:
- Conventions are re-stated in every brief (no drift)
- Exact values are copy-pasted into the brief (no hallucination)
- Independent sprints get separate agents (full parallelism)

## Execution Flow

```
Turn 1: User approves plan
Turn 2: Opus writes agents/sprint-0-brief.md
        Opus spawns Agent(sonnet-4.6, sprint-0-brief.md)
Turn 3: Sonnet executes Sprint 0 → reports results
Turn 4: Opus reviews, writes sprint-1-brief.md
        Opus spawns Agent(sonnet-4.6, sprint-1-brief.md)
Turn 5: Sonnet executes Sprint 1 → viewer scaffold done
Turn 6: Opus spawns 3 PARALLEL agents in ONE message:
        Agent A: sprint-2-brief.md (Docs/Specs/Backlog pages)
        Agent B: sprint-3-brief.md (Skills/Environments/Charts)
        Agent C: sprint-4-brief.md (CLI/QUICKSTART)
Turn 7: All 3 return → Opus merges
Turn 8: Opus spawns sprint-5-brief.md (Polish/Launch)
```

## Agent Briefing File Format

Location: `agents/sprint-X-brief.md`

Required sections:
1. **Agent + Sprint metadata** — model, sprint number, dependencies
2. **Tickets to execute** — ordered list from specs/backlog.md
3. **Key source files** — exact paths to read before implementing
4. **Code snippets** — exact values (no hallucination possible)
5. **Conventions** — forbidden patterns, required patterns
6. **Verification checklist** — what must be true for sprint to be "done"

## How to Spawn an Agent

```javascript
// In Opus orchestrator turn:
Agent({
  subagent_type: "general-purpose",
  description: "Sprint 1: viewer scaffold",
  isolation: "worktree",  // or omit for direct main
  prompt: `
    Read /opt/FitnessAiManager/autospec/agents/sprint-1-brief.md first.
    Execute all tickets in order.
    Update specs/backlog.md as you complete each ticket.
    Create sprints/sprint-1/summary.md when done.
    Return the summary contents when complete.
  `
})
```

## Parallelism Rules

| Sprint | Depends on | Can parallelize with |
|--------|-----------|---------------------|
| 0 | Nothing | Serial (first) |
| 1 | 0 complete | Serial after 0 |
| 2 | 1 complete | 3, 4 |
| 3 | 1 complete | 2, 4 |
| 4 | 0 complete | 2, 3 |
| 5 | 1–4 complete | Serial (last) |

## Embedding in Generated Projects

When `autospec init` generates a new project, its `skills/claude/sprint-run.md` includes this pattern in Phase 2. The generated `CLAUDE.md` includes the Orchestrator rules section.

See: `cli/src/generators/viewer-prompt.generator.ts` for how this is embedded in viewer generation prompts.
```

---

### Task 0.8 — Create `sprints/sprint-0/summary.md`

```bash
mkdir -p /opt/FitnessAiManager/autospec/sprints/sprint-0
```

Create `sprints/sprint-0/summary.md`:

```markdown
# Sprint 0 Summary — SDD Foundation

**Date:** 2026-03-09
**Status:** ✅ COMPLETE
**Theme:** Bootstrap AutoSpec as an SDD project using its own methodology

## Overview

Sprint 0 transforms AutoSpec from a standalone framework into a self-managed SDD project. By applying its own methodology to itself, AutoSpec can now develop subsequent sprints using its own tools: `/sprint-run`, `/execute-ticket`, `/sprint-status`. The Opus Orchestrator + Sonnet Agent execution pattern is now documented and embedded in the skills.

## Completed Tickets

| # | Ticket | Description | Status | Docs |
|---|--------|-------------|--------|------|
| 0.1 | Copy skills → .claude/commands/ | 10 skill files now accessible in Claude Code | ✅ | — |
| 0.2 | Create CLAUDE.md | Backlog-first + orchestrator rules | ✅ | `CLAUDE.md` |
| 0.3 | Create specs/ (10 files) | All role specs authored | ✅ | `specs/01–10_*.md` |
| 0.4 | Create specs/backlog.md | All 6 sprints fully ticketed (187 pts) | ✅ | `specs/backlog.md` |
| 0.5 | Update sprint-run.md + execute-ticket.md | Orchestrator Pattern section added | ✅ | `skills/claude/` |
| 0.6 | Create agents/sprint-1–5-brief.md | 5 Sonnet briefings pre-written | ✅ | `agents/` |
| 0.7 | Create docs/methodology/10_orchestrator_agent_pattern.md | Pattern documented | ✅ | `docs/methodology/10_orchestrator_agent_pattern.md` |
| 0.8 | Create sprints/sprint-0/summary.md | This file | ✅ | `sprints/sprint-0/summary.md` |

## Documentation Updated

| Doc File | Change | Related Tickets |
|----------|--------|-----------------|
| `CLAUDE.md` | Created — SDD rules, orchestrator pattern | 0.2 |
| `specs/01–10_*.md` | Created — 10 role specs | 0.3 |
| `specs/backlog.md` | Created — 187 pts across 6 sprints | 0.4 |
| `agents/sprint-1–5-brief.md` | Created — Sonnet agent briefings | 0.6 |
| `docs/methodology/10_orchestrator_agent_pattern.md` | Created — execution pattern | 0.7 |

## Key Files Created

| File | Purpose |
|------|---------|
| `autospec/CLAUDE.md` | SDD rules for Claude Code |
| `autospec/.claude/commands/*.md` | 10 skills accessible via /command |
| `autospec/specs/backlog.md` | Canonical project backlog |
| `autospec/specs/01–10_*.md` | Role spec files |
| `autospec/agents/sprint-1–5-brief.md` | Agent briefings |
| `autospec/docs/methodology/10_orchestrator_agent_pattern.md` | New methodology doc |
| `autospec/sprints/sprint-0/summary.md` | This summary |

## QA & Test Results

| Suite | Pass | Fail | Notes |
|-------|------|------|-------|
| Structure check | ✅ | 0 | `ls .claude/commands/` → 10 files |
| Backlog check | ✅ | 0 | All 6 sprints present |
| CLAUDE.md check | ✅ | 0 | Backlog-first + orchestrator rules present |
| Docs check | ✅ | 0 | `docs/methodology/` → 10 files |

Sprint 0 is docs/config-only — no code QA required.

## Retrospective

**What went well:**
- Self-referential bootstrapping: using the methodology on itself validates the approach
- Pre-writing all 5 agent briefs ensures Sprint 1–5 have clean context packages
- 187 pts fully ticketed before Sprint 1 starts → no planning overhead mid-sprint

**What to improve:**
- Agent briefs are placeholder-level for Sprint 2–5; orchestrator must enrich before spawning
- The backlog.md format will need validation once the parser is built in Sprint 4

**Next:** Orchestrator spawns Sprint 1 agent with `agents/sprint-1-brief.md`.
```

---

## Final Verification (run after all tasks)

```bash
# Verify all deliverables exist
echo "=== .claude/commands/ ===" && ls /opt/FitnessAiManager/autospec/.claude/commands/
echo "=== specs/ ===" && ls /opt/FitnessAiManager/autospec/specs/
echo "=== agents/ ===" && ls /opt/FitnessAiManager/autospec/agents/
echo "=== sprints/ ===" && ls /opt/FitnessAiManager/autospec/sprints/sprint-0/
echo "=== docs/methodology/ ===" && ls /opt/FitnessAiManager/autospec/docs/methodology/
echo "=== CLAUDE.md ===" && head -5 /opt/FitnessAiManager/autospec/CLAUDE.md
```

Expected output:
- `.claude/commands/`: 10 .md files
- `specs/`: backlog.md + 10 spec files
- `agents/`: 5 brief files (sprint-1 through sprint-5)
- `sprints/sprint-0/`: summary.md
- `docs/methodology/`: 10 files (01–09 existing + new 10)
- `CLAUDE.md`: starts with "# Claude Code Memory — AutoSpec"

Also update `specs/backlog.md` to mark ALL Sprint 0 tickets as ✅ Done after completing them.
Update `skills/claude/sprint-run.md` (Orchestrator Pattern section) and `skills/claude/execute-ticket.md` (note at top of Instructions).

---

## What NOT to do

- Do NOT modify `cli/` source code
- Do NOT modify `QUICKSTART.md`
- Do NOT modify existing `docs/methodology/01–09_*.md` files
- Do NOT delete or modify `backlog.md` (the old one at root — leave it)
- Do NOT create the `viewer/` directory (that's Sprint 1)
- Do NOT run npm install or build commands
