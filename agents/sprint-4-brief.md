# Sprint 4 Agent Briefing — CLI + QUICKSTART Update

**Agent:** Sonnet 4.6
**Sprint:** 4 of 5
**Depends on:** Sprint 0 complete ✅ (independent of viewer sprints)
**Working directory:** `/opt/FitnessAiManager/autospec`
**Parallel with:** Sprint 2 + Sprint 3 (you touch different files)

---

## Your Mission

Update the CLI's viewer-prompt generator and QUICKSTART.md Section 7 to use the warm FitnessAiManager palette instead of the dark shadcn/ui theme. NO viewer code changes — this is purely CLI and docs work.

---

## Tickets

| ID | Task | Files affected |
|----|------|----------------|
| 4.1 | Update `viewer-prompt.generator.ts` — emit warm palette spec | `cli/src/generators/viewer-prompt.generator.ts` |
| 4.2 | Update `skills/claude/sprint-run.md` template — add orchestrator pattern note | `skills/claude/sprint-run.md` (already done in Sprint 0 — verify and skip if already updated) |
| 4.3 | QUICKSTART.md Section 7 rewrite — replace dark shadcn → warm FitnessAiManager | `QUICKSTART.md` lines ~1660–1912 |
| 4.4 | Create `docs/cli/viewer_generator.md` | new file |

---

## CRITICAL: What Section 7 currently says (must replace)

Current Section 7 tells developers to use:
- `shadcn/ui` (FORBIDDEN — replace with FitnessAiManager primitives)
- `#0f172a`, `slate-950` dark theme (REPLACE with warm palette)
- `npx shadcn@latest init -d` (REMOVE this command)
- `src/components/ui/` for shadcn (REPLACE with `src/components/primitives/`)

---

## Task 4.3 — QUICKSTART.md Section 7 Rewrite

Read the file first: `QUICKSTART.md`

Find the Section 7 block (starts around line 1660, search for "## Section 7" or "### 7.1 Tech Stack").

Replace the ENTIRE Section 7 (from the opening banner through section 7.3/7.4 component rules) with this new content:

**FIND block starting with** (approximately line 1665):
```
╔══════════════════════════════════════════════════════════════════╗
║  CRITICAL: This is a FULL VISUAL WEBSITE — NOT a markdown       ║
║  reader. Every page must include interactive charts, diagrams,  ║
║  animated components, and rich UI built with shadcn/ui.         ║
║  Think of it as an executive PRESENTATION of the project.       ║
║  If a page just renders raw markdown text, it is WRONG.         ║
╚══════════════════════════════════════════════════════════════════╝
```

**REPLACE that entire banner AND Section 7.1 through 7.3 (up to "### 7.4 Pages")** with:

```
╔══════════════════════════════════════════════════════════════════╗
║  CRITICAL: This is a FULL VISUAL WEBSITE — NOT a markdown       ║
║  reader. Every page must include interactive charts, diagrams,  ║
║  and rich UI with the warm FitnessAiManager design system.      ║
║  If a page only renders raw markdown text, it is WRONG.         ║
╚══════════════════════════════════════════════════════════════════╝

Generate a complete, self-contained React application in viewer/ that
provides a visually impressive dashboard for ALL generated artefacts
(specs, docs, backlog, workflows, architecture, flows, sprints).

### 7.1 Tech Stack

  React 18 + TypeScript + Vite 5 + Tailwind CSS v3 + React Router v6

  UI Primitives: FitnessAiManager design system (REQUIRED — port from source)
    Source: /opt/FitnessAiManager/apps/web/src/design-system/components/primitives/
    Components to port: Button.tsx, Card.tsx, Badge.tsx, Input.tsx
    Remove: RTL classes (dir-rtl, text-right), Hebrew fonts (Heebo/Rubik/Assistant)
    Keep: all variant logic, shadow system, transition classes

  Additional libraries (install via npm):
    - recharts — charts and data visualisation (REQUIRED for every data page):
                PieChart, BarChart, LineChart, AreaChart
    - @xyflow/react (React Flow v12) — workflow graph visualisation (optional)
    - fuse.js — fuzzy search across docs, specs, and backlog
    - lucide-react — icons
    - react-markdown + remark-gfm — Markdown rendering
    - mermaid — render Mermaid diagram blocks embedded in markdown

### 7.1.1 Framework Lockdown (MANDATORY)

Use ONLY the framework/component mapping below. Do not substitute alternatives.

  - App shell + routing: React Router (`Layout`, `Sidebar`, `Header`, nested routes)
  - UI primitives: FitnessAiManager primitives ONLY (`src/components/primitives/*`)
  - Charts and KPI visuals: Recharts ONLY
  - Workflow/graph canvases: `@xyflow/react` ONLY (if used)
  - Markdown rendering: `react-markdown` + `remark-gfm` ONLY
  - Icons: `lucide-react` ONLY

FORBIDDEN (must NOT appear anywhere):
  - shadcn/ui — incompatible with warm palette, do NOT install
  - @radix-ui imports (shadcn dependency)
  - Chart.js, Nivo, ECharts, ApexCharts
  - MUI, Ant Design, Chakra, Mantine, Bootstrap
  - Any RTL CSS classes (dir-rtl, text-right as default layout)
  - Dark slate colors: #0f172a, slate-950, zinc-900, gray-950

Enforcement checks (must be explicitly validated):
  - `package.json` does NOT include shadcn, @radix-ui, or dark theme packages
  - `src/components/primitives/` has Button, Card, Badge, Input
  - No forbidden libraries in `package.json` or imports

### 7.2 Project Structure

viewer/
├── public/
│   └── icons/                       # Role and status icons
├── src/
│   ├── App.tsx
│   ├── main.tsx
│   ├── index.css                    # Tailwind + global tokens
│   │
│   ├── data/                        # Static artefacts (import at build time)
│   │   ├── specs/                   # All 10 spec .md files
│   │   ├── docs/                    # All docs .md files (mirrored structure)
│   │   ├── backlog.ts               # Typed backlog data (sprints + tickets)
│   │   ├── environments.ts          # 6×N compatibility matrix
│   │   └── requirements.md          # Original SRS
│   │
│   ├── pages/
│   │   ├── DashboardPage.tsx        # "/" — KPI cards + Recharts charts
│   │   ├── DesignSystemPage.tsx     # "/design-system" — component gallery
│   │   ├── SpecsPage.tsx            # "/specs" + "/specs/:slug"
│   │   ├── DocsPage.tsx             # "/docs" + "/docs/:section/:slug"
│   │   ├── BacklogPage.tsx          # "/backlog" — kanban + table
│   │   ├── SkillsPage.tsx           # "/skills/:slug" — skill cards
│   │   └── EnvironmentsPage.tsx     # "/environments" — compatibility matrix
│   │
│   ├── components/
│   │   ├── primitives/              # FitnessAiManager ports (Button, Card, Badge, Input)
│   │   ├── layout/                  # Sidebar, Header, Layout
│   │   └── charts/                  # Recharts wrappers (BarChart, PieChart, etc.)
│   │
│   └── hooks/
│       └── useBacklogData.ts        # Parse and filter backlog
│
├── tailwind.config.js
├── vite.config.ts
├── tsconfig.json
└── package.json

### 7.3 Design System (Warm FitnessAiManager Palette)

Port the warm design system from FitnessAiManager. Do NOT use dark mode.

Source tailwind.config.js:
  /opt/FitnessAiManager/apps/web/tailwind.config.js

Colours (exact hex values — copy these into tailwind.config.js):
  parchment:      #f5f3ed   ← PAGE BACKGROUND (body bg-color)
  cream:          #faf9f5   ← CARD/SURFACE background
  sage:           #698472   ← PRIMARY actions, active nav, buttons
  sage-600:       #536a5b   ← hover state
  sage-700:       #44564a   ← active/pressed state
  terracotta:     #8e6a59   ← ACCENT, headings, error states
  terracotta-700: #76574a   ← terracotta hover
  sand:           #d8d0ba   ← BORDERS, dividers
  sand-200:       #e8e4d8   ← subtle fills, code backgrounds
  charcoal:       #1a1a1a   ← BODY TEXT

Recharts theme (use consistently across ALL charts):
  CHART_COLORS = ['#698472', '#8e6a59', '#536a5b', '#b08a79',
                   '#a08c72', '#44564a', '#d9b9a8', '#d8d0ba']

Typography:
  Body: Inter (Google Fonts, weights: 300/400/500/600/700)
  Code: JetBrains Mono (Google Fonts, weights: 400/500)
  Load via <link> in index.html (no self-hosted)
  font-family body: 'Inter', sans-serif
  font-family code: 'JetBrains Mono', monospace

Shadows (copy from source):
  subtle:   0 2px 8px rgba(142, 106, 89, 0.08)
  soft:     0 4px 16px rgba(142, 106, 89, 0.12)
  elevated: 0 8px 32px rgba(142, 106, 89, 0.16)

Component rules (MANDATORY):
  - ALL buttons → FitnessAiManager <Button> variants: primary(sage)/secondary(terracotta)/outline/ghost
  - ALL cards → FitnessAiManager <Card> with CardHeader, CardContent, CardFooter
  - ALL badges → FitnessAiManager <Badge> with warm variants (not shadcn)
  - ALL charts → Recharts with CHART_COLORS warm theme
  - NEVER use shadcn/ui — port primitives from FitnessAiManager source
  - NEVER use dark slate (#0f172a) as background

```

**IMPORTANT:** Section 7.4 (Pages) and everything after should remain UNCHANGED. Only replace 7.1 through 7.3 (inclusive of the opening banner).

---

## Task 4.1 — Update viewer-prompt.generator.ts

Read `cli/src/generators/viewer-prompt.generator.ts` first.

Find the section that generates the design system instructions (search for `shadcn` or `#0f172a` or `slate-950`).

Replace the entire design system specification section within the generated prompt with the warm palette version. The key changes:

1. Replace any text about shadcn/ui with FitnessAiManager primitives
2. Replace dark CSS vars with warm palette vars
3. Replace CHART_COLORS dark theme with warm palette colors
4. Keep all other prompt content (project structure, page descriptions, etc.)

Specifically, in the `generateMasterViewerPrompt` function, find the design system section and replace it with:

```typescript
// In the template string, replace the design system block:
const designSystemSection = `
### Design System (Warm FitnessAiManager Palette)

**Source:** Port primitives from FitnessAiManager design system.
Do NOT use shadcn/ui. Do NOT use dark slate colors.

**tailwind.config.js colors:**
\`\`\`javascript
colors: {
  parchment: '#f5f3ed',  // Page background
  cream: '#faf9f5',       // Card/surface background
  sage: {
    DEFAULT: '#698472',   // Primary actions
    600: '#536a5b',       // Hover
    700: '#44564a',       // Active
  },
  terracotta: {
    DEFAULT: '#8e6a59',   // Accent, headings
    700: '#76574a',
  },
  sand: {
    DEFAULT: '#d8d0ba',   // Borders
    200: '#e8e4d8',       // Subtle fills
  },
  charcoal: '#1a1a1a',    // Body text
}
\`\`\`

**Typography:**
- Body: Inter (Google Fonts)
- Code: JetBrains Mono (Google Fonts)

**Recharts CHART_COLORS:**
\`\`\`javascript
const CHART_COLORS = ['#698472', '#8e6a59', '#536a5b', '#b08a79',
                       '#a08c72', '#44564a', '#d9b9a8', '#d8d0ba']
\`\`\`

**Primitives to port** (from /opt/FitnessAiManager/apps/web/src/design-system/components/primitives/):
- Button.tsx → remove font-hebrew, keep all variants (primary/secondary/outline/ghost)
- Card.tsx + CardHeader/CardContent/CardFooter → direct port, remove RTL
- Badge.tsx → port + extend with done/in-progress/todo/blocked/haiku/sonnet/opus variants
- Input.tsx → direct port, remove direction-ltr forced and RTL padding

**FORBIDDEN:**
- shadcn/ui (npx shadcn@latest) — do NOT install
- @radix-ui
- RTL CSS (dir-rtl, text-right as default)
- Dark colors: #0f172a, slate-950, zinc-900
`
```

After making the replacement, ensure the function still returns valid TypeScript and the rest of the generator remains intact.

---

## Task 4.4 — Create `docs/cli/viewer_generator.md`

```bash
mkdir -p /opt/FitnessAiManager/autospec/docs/cli
```

Create `docs/cli/viewer_generator.md`:

```markdown
---
title: "Viewer Prompt Generator"
sprint: "4.1"
created: "2026-03-09"
---

# Viewer Prompt Generator

**File:** `cli/src/generators/viewer-prompt.generator.ts`

## Purpose

Generates the LLM prompt that instructs an AI to build a React-based "project viewer" for any AutoSpec-managed project. This generator does NOT produce React code directly — it produces a prompt that, when fed to Claude/GPT, generates the viewer app.

## Design System Spec (Post-Sprint 4)

The generated prompt now specifies the **warm FitnessAiManager palette** instead of the previous dark shadcn/ui theme.

### Color Tokens Emitted
| Token | Hex | Usage |
|-------|-----|-------|
| parchment | `#f5f3ed` | Page background |
| cream | `#faf9f5` | Card surface |
| sage | `#698472` | Primary actions |
| terracotta | `#8e6a59` | Accent |
| sand | `#d8d0ba` | Borders |
| charcoal | `#1a1a1a` | Text |

### Primitive Strategy
- **Port FROM:** `/opt/FitnessAiManager/apps/web/src/design-system/components/primitives/`
- **NOT from:** shadcn/ui (forbidden)
- **Adaptations:** Remove RTL classes, Hebrew fonts → Inter/JetBrains Mono

### Recharts Colors
```javascript
const CHART_COLORS = ['#698472', '#8e6a59', '#536a5b', '#b08a79',
                       '#a08c72', '#44564a', '#d9b9a8', '#d8d0ba']
```

## Usage

The generator is called by `autospec init` and `autospec viewer build`:

```typescript
import { generateViewerPrompt } from './generators/viewer-prompt.generator.js'

const prompt = generateViewerPrompt({
  projectName: 'MyApp',
  outputDir: './viewer-prompt',
  requirements: parsedReqs,
  techStack: { frontend: 'React', backend: 'Node.js' }
})
```

## Sprint History
| Sprint | Change |
|--------|--------|
| Sprint 4.1 | Replaced dark shadcn palette → warm FitnessAiManager palette |
| Initial | Dark slate theme (slate-950 background, shadcn/ui) |
```

---

## Verification

```bash
# Check shadcn removed from QUICKSTART Section 7
grep -n "shadcn" /opt/FitnessAiManager/autospec/QUICKSTART.md | grep -E "^(167|168|169|170|171|172|173|174|175|176|177|178|179|180|181|182|183|184|185|186|187|188|189|190|191):" | head -20
# Should show 0 matches in lines 1670-1912

# Check dark colors removed
grep -n "0f172a\|slate-950\|slate-800" /opt/FitnessAiManager/autospec/QUICKSTART.md | head -10
# Should show 0 matches

# Check CLI builds
cd /opt/FitnessAiManager/autospec/cli && npm run build
# Should succeed with 0 errors
```

---

## Final Steps

1. Update `specs/backlog.md` — Sprint 4 tickets (4.1–4.4) → ✅ Done, Sprint 4 status → ✅ Done
2. Create `sprints/sprint-4/summary.md`
3. Return: verification results (grep output), build exit code, files modified
