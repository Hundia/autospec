/**
 * Viewer Prompt Generator
 * Generates the prompt(s) that instruct an LLM to build a React-based
 * "project viewer website" — a standalone app that visualizes the generated
 * specs, backlog, system flows, and workflows for any AutoSpec project.
 *
 * This does NOT generate React code. It generates the PROMPT that, when fed
 * to an LLM, produces the viewer app with premium UI and animated workflows.
 */

import path from 'path';
import { writeFile, ensureDir } from '../utils/file.js';
import { getCurrentDate } from '../utils/file.js';
import { ParsedRequirements } from '../parsers/requirements.parser.js';

export interface ViewerPromptGeneratorOptions {
  projectName: string;
  outputDir: string;
  requirements?: ParsedRequirements;
  techStack?: {
    frontend?: string;
    backend?: string;
    database?: string;
    language?: string;
  };
}

// ---------------------------------------------------------------------------
// Prompt 1 — Master viewer generation prompt
// ---------------------------------------------------------------------------

function generateMasterViewerPrompt(options: ViewerPromptGeneratorOptions): string {
  const name = options.projectName;
  const ts = options.techStack || {
    frontend: 'React',
    backend: 'Node.js',
    database: 'PostgreSQL',
    language: 'TypeScript',
  };
  const desc = options.requirements?.description || 'a full-stack application';

  return `# ${name} — Project Viewer Website Generation Prompt

**Purpose:** Feed this prompt to an LLM (Claude, GPT, Gemini) to generate a
standalone React application that visualises every artefact produced by AutoSpec:
specs, backlog, system architecture, workflows, and sprint status.

**Generated:** ${getCurrentDate()}

---

## PROMPT — START HERE

\`\`\`
You are generating a self-contained React project called "${name} Viewer".

╔══════════════════════════════════════════════════════════════════╗
║  CRITICAL: This is a FULL VISUAL WEBSITE — NOT a markdown       ║
║  reader. Every page must include interactive charts, diagrams,  ║
║  animated components, and rich UI built with shadcn/ui.         ║
║  Think of it as an executive PRESENTATION of the project.       ║
║  If a page just renders raw markdown text, it is WRONG.         ║
╚══════════════════════════════════════════════════════════════════╝

It is a read-only, client-side dashboard that renders the AutoSpec artefacts
for "${name}" — ${desc}.

Tech stack for the VIEWER (not the project itself):
  React 18 + TypeScript + Vite + Tailwind CSS v4 + React Router
  shadcn/ui — component library (Button, Card, Badge, Tabs, Dialog,
              Tooltip, Table, DropdownMenu, Sheet, Separator, etc.)
              Initialize with: npx shadcn@latest init -d
              Then add components: npx shadcn@latest add button card badge
              tabs dialog tooltip table dropdown-menu sheet separator
              select command popover scroll-area toggle-group avatar
  Additional libraries (install via npm):
    - @xyflow/react (React Flow v12) — graph / workflow visualisation
    - recharts — charts and data visualisation (pie, bar, line, area, radar)
    - framer-motion — panel transitions and micro-interactions ONLY
    - lucide-react — icons (used by shadcn/ui)
    - react-markdown + remark-gfm — render Markdown specs
    - react-syntax-highlighter — code block highlighting

All project data lives as static imports (JSON / Markdown files copied into
src/data/). The viewer has NO backend; it reads from local files at build time.

╔══════════════════════════════════════════════════════════════════╗
║  VISUAL MANDATE: Every page MUST include at least ONE of:       ║
║  - An interactive chart (Recharts)                              ║
║  - An animated diagram (React Flow / SVG)                       ║
║  - A data-rich card grid with badges and progress indicators    ║
║  - An interactive table with filters and sorting                ║
║  Pages that are purely text/markdown are NOT acceptable.        ║
╚══════════════════════════════════════════════════════════════════╝

────────────────────────────────────────────────────────
1. PROJECT STRUCTURE
────────────────────────────────────────────────────────

viewer/
├── public/
├── src/
│   ├── App.tsx                     # Root: ThemeProvider, Router, Layout
│   ├── main.tsx                    # Vite entry
│   ├── index.css                   # Tailwind directives + global tokens
│   │
│   ├── data/                       # Static project artefacts
│   │   ├── specs/                  # Copy of all 10 spec .md files
│   │   ├── backlog.json            # Parsed backlog (sprints, tickets)
│   │   ├── requirements.md         # Original SRS
│   │   └── workflows.json          # Graph definitions (nodes + edges)
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx         # Navigation sidebar
│   │   │   ├── Header.tsx          # Top bar: search, breadcrumb, theme toggle
│   │   │   ├── DetailsPanel.tsx    # Right-side detail drawer
│   │   │   └── Layout.tsx          # Three-column shell
│   │   │
│   │   ├── specs/
│   │   │   ├── SpecViewer.tsx      # Markdown renderer for any spec
│   │   │   └── SpecCard.tsx        # Summary card for spec list
│   │   │
│   │   ├── backlog/
│   │   │   ├── BacklogBoard.tsx    # Kanban or table view
│   │   │   ├── SprintColumn.tsx    # Single sprint column
│   │   │   └── TicketCard.tsx      # Individual ticket
│   │   │
│   │   ├── workflows/
│   │   │   ├── WorkflowCanvas.tsx  # React Flow canvas wrapper
│   │   │   ├── AnimatedEdge.tsx    # Custom edge with flow animation
│   │   │   ├── WorkflowNode.tsx    # Custom node (memoised)
│   │   │   ├── AnimationController.tsx  # Play/pause/speed UI
│   │   │   ├── WorkflowLegend.tsx  # Legend for animation semantics
│   │   │   ├── WorkflowSearch.tsx  # Search + filter bar
│   │   │   └── useAnimationEngine.ts   # Central animation hook
│   │   │
│   │   ├── dashboard/
│   │   │   ├── DashboardPage.tsx   # Overview: progress, metrics, health
│   │   │   ├── StatCard.tsx        # Single metric card with animated counter
│   │   │   ├── ProgressRing.tsx    # SVG circular progress indicator
│   │   │   ├── SprintTimeline.tsx  # Timeline chart (Recharts BarChart)
│   │   │   ├── ModelDistribution.tsx # Pie chart of model usage (Recharts)
│   │   │   ├── VelocityMini.tsx    # Mini velocity line chart (Recharts)
│   │   │   └── MiniArchitecture.tsx # Clickable mini system diagram
│   │   │
│   │   ├── charts/                 # Reusable chart wrappers (Recharts)
│   │   │   ├── PieChart.tsx        # Recharts PieChart wrapper
│   │   │   ├── BarChart.tsx        # Recharts BarChart wrapper
│   │   │   ├── LineChart.tsx       # Recharts LineChart wrapper
│   │   │   ├── AreaChart.tsx       # Recharts AreaChart wrapper
│   │   │   ├── ProgressBar.tsx     # Animated progress bar
│   │   │   └── AnimatedCounter.tsx # Number counter animation
│   │   │
│   │   ├── flows/                  # Visual flow diagram components
│   │   │   ├── UserJourneyDiagram.tsx   # Swimlane user journey
│   │   │   ├── SequenceDiagram.tsx      # Request/response sequence
│   │   │   ├── DataFlowDiagram.tsx      # Data movement graph
│   │   │   ├── StateMachine.tsx         # State transition diagram
│   │   │   └── FlowSelector.tsx         # Flow type selector
│   │   │
│   │   ├── architecture/           # Architecture diagram components
│   │   │   ├── SystemDiagram.tsx        # Main architecture graph
│   │   │   ├── ERDiagram.tsx            # Database ERD
│   │   │   ├── ComponentTree.tsx        # Frontend component hierarchy
│   │   │   ├── LayerDiagram.tsx         # Backend layer visualization
│   │   │   └── DiagramExport.tsx        # Export PNG/SVG
│   │   │
│   │   └── ui/                     # shadcn/ui components (auto-generated)
│   │       # Use: npx shadcn@latest add button card badge tabs ...
│   │       # All primitives come from shadcn/ui — do NOT build custom ones
│   │
│   ├── pages/
│   │   ├── DashboardPage.tsx       # "/"  — project overview with charts
│   │   ├── SpecsPage.tsx           # "/specs" — card grid + detail viewer
│   │   ├── DocsPage.tsx            # "/docs" — folder tree + doc viewer
│   │   ├── BacklogPage.tsx         # "/backlog" — kanban + charts + table
│   │   ├── WorkflowsPage.tsx       # "/workflows" — animated React Flow
│   │   ├── FlowsPage.tsx           # "/flows" — user/system flow diagrams
│   │   ├── ArchitecturePage.tsx    # "/architecture" — interactive diagrams
│   │   ├── SprintsPage.tsx         # "/sprints" — sprint results + velocity
│   │   └── RequirementsPage.tsx    # "/requirements" — traceability matrix
│   │
│   ├── hooks/
│   │   ├── useAnimationEngine.ts   # Centralised animation state
│   │   ├── useAnimationSettings.ts # Persist settings to localStorage
│   │   └── useReducedMotion.ts     # prefers-reduced-motion detection
│   │
│   └── lib/
│       ├── animation.ts            # Constants, easing curves, helpers
│       ├── graph.ts                # Graph traversal utilities
│       └── theme.ts                # Design tokens
│
├── tailwind.config.js
├── vite.config.ts
├── tsconfig.json
└── package.json

────────────────────────────────────────────────────────
2. DESIGN SYSTEM (shadcn/ui + Tailwind tokens)
────────────────────────────────────────────────────────

Use shadcn/ui "new-york" style with dark theme as default.
Configure shadcn/ui with these CSS variables in globals.css / index.css:

Colour palette (dark theme, required as default):

  --color-bg:           #0f172a   (slate-950)
  --color-surface:      #1e293b   (slate-800)
  --color-surface-2:    #334155   (slate-700)
  --color-border:       rgba(255,255,255,0.08)
  --color-text:         #f1f5f9   (slate-100)
  --color-text-muted:   #94a3b8   (slate-400)
  --color-primary:      #3b82f6   (blue-500)
  --color-secondary:    #a855f7   (purple-500)
  --color-success:      #10b981   (emerald-500)
  --color-warning:      #f59e0b   (amber-500)
  --color-error:        #ef4444   (red-500)
  --color-info:         #06b6d4   (cyan-500)

Recharts theme colours (for consistent chart styling):
  const CHART_COLORS = ['#3b82f6', '#a855f7', '#10b981', '#f59e0b',
                         '#ef4444', '#06b6d4', '#ec4899', '#8b5cf6'];

Typography:
  - Headings: Inter, 600–700 weight
  - Body: Inter, 400
  - Code / mono: JetBrains Mono, 400
  - Base size: 16 px, scale: 1.25 (major third)

Spacing scale: 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 px
Border radius: sm 6px, md 10px, lg 16px, full 9999px

Layout:
  - Sidebar width: 260 px (collapsible to 64 px icon-only)
  - Details panel width: 380 px (slides in from right, hidden by default)
  - Main content: fluid, max-width 1400 px centred
  - Breakpoints: sm 640, md 768, lg 1024, xl 1280

Component usage rules:
  - ALL buttons → shadcn/ui Button (variant: default, outline, ghost, etc.)
  - ALL cards → shadcn/ui Card (with CardHeader, CardContent, CardFooter)
  - ALL badges → shadcn/ui Badge (variant: default, secondary, destructive, outline)
  - ALL tabs → shadcn/ui Tabs (TabsList, TabsTrigger, TabsContent)
  - ALL tables → shadcn/ui Table (TableHeader, TableBody, TableRow, TableCell)
  - ALL tooltips → shadcn/ui Tooltip
  - ALL dropdowns → shadcn/ui DropdownMenu or Select
  - ALL dialogs → shadcn/ui Dialog
  - ALL charts → Recharts (PieChart, BarChart, LineChart, AreaChart)
  - NEVER build custom UI primitives. Use shadcn/ui for everything.

────────────────────────────────────────────────────────
3. PAGE-BY-PAGE GENERATION SPEC
────────────────────────────────────────────────────────

CRITICAL: Each page MUST be a rich visual experience. Use shadcn/ui Card,
Badge, Tabs, Table components everywhere. Use Recharts for every metric.
Do NOT just render markdown. Parse markdown content into structured data
and render it with proper UI components, charts, and interactive elements.

### 3.1 Dashboard  ("/")  — VISUAL SHOWCASE

This is the landing page. It must look like an executive project dashboard.

  REQUIRED visuals (every single one must be present):
  - Project name as large heading + description + tech stack Badge components
  - **Recharts PieChart**: Sprint completion (done vs remaining tickets)
  - **SVG ProgressRing**: Animated circular progress (% complete)
  - **Recharts BarChart**: Tickets per sprint (stacked by status)
  - **Recharts LineChart**: Velocity trend (if multiple sprints)
  - **Recharts PieChart**: Model distribution (haiku/sonnet/opus usage)
  - **AnimatedCounter**: Stat cards with counting animation for:
    Total Tickets, Done, In Progress, QA Review, Blocked
  - **shadcn/ui Table**: Top 5 in-progress tickets with status Badge
  - Quick-links grid: 10 spec cards (role icon + name), clickable
  - Quick-links grid: doc folder cards (folder icon + file count)
  - **MiniArchitecture**: Clickable mini system diagram → /architecture
  - CTA buttons: "View Workflows", "View Backlog" with counts

### 3.2 Specs  ("/specs" and "/specs/:slug")

List view:
  - shadcn/ui Card grid: 2-col md, 3-col lg
  - Each Card: lucide-react role icon, title, excerpt, Badge (word count),
    Badge (reading time), animated hover state
  - Progress indicator per spec (sections covered)

Detail view ("/specs/:slug"):
  - Full Markdown rendering with react-syntax-highlighter for code blocks
  - Sticky TOC sidebar (parsed from ## headings, scrollspy active state)
  - Reading progress bar at top (scroll-based)
  - Mermaid code blocks → rendered as actual diagrams (parse and visualize)
  - JSON blocks → syntax highlighted with copy button
  - "Back to all specs" breadcrumb with shadcn/ui components

### 3.3 Docs  ("/docs" and "/docs/:section/:slug")

Top-level view:
  - Card grid showing each doc folder as a visual card
  - Each card: folder icon, folder name, file count Badge, mini visual preview
  - Cards for: architecture, flows, workflows, environments, api, testing,
    ui-design-system, project

Detail view: Same rendering as Specs detail (Markdown + code + diagrams)

### 3.4 Backlog  ("/backlog")  — DATA-RICH INTERACTIVE PAGE

  THIS PAGE MUST BE HIGHLY VISUAL, not just a text table.

  Top section (always visible):
  - **Recharts BarChart**: Tickets by status (stacked bar per sprint)
  - **Recharts PieChart**: Overall status distribution
  - **AnimatedCounter cards**: Total, Done, In Progress, Blocked
  - **ProgressBar**: Overall project completion with animated fill

  Main content (Tabs via shadcn/ui):
  - **Tab: Kanban Board** (default view)
    - 5 columns: Todo | In Progress | QA Review | Done | Blocked
    - Each column: header with count Badge, cards below
    - Cards: ticket title, owner Avatar/Badge, model Badge (colour-coded),
      points Badge, dependency indicator
    - Column counts and point totals

  - **Tab: Sprint Table** (per sprint)
    - Sprint selector Tabs (Sprint 0, 1, 2, …)
    - Per-sprint: goal description, **animated ProgressBar**, points summary
    - shadcn/ui Table with:
      - Status Badge (colour-coded): 🔲 todo=slate, 🔄 in-progress=blue,
        🧪 qa=purple, ✅ done=emerald, ⏸️ blocked=red
      - Owner Badge with role colour
      - Model Badge (haiku=green, sonnet=blue, opus=purple)
      - Points column
      - Dependency links (clickable)
    - **Recharts**: Sprint burndown chart (ideal vs actual line)

  - Filters bar: status, owner, model (using shadcn/ui Select)
  - Search: instant filter with input highlighting

### 3.5 Workflows  ("/workflows")  ← ANIMATED GRAPH

  - Full-screen React Flow canvas (see Section 4 below)
  - Workflow selector dropdown (shadcn/ui Select) to switch between graphs
  - Top toolbar: AnimationController + WorkflowSearch + filters
  - Bottom-right: WorkflowLegend overlay (collapsible)
  - Export as PNG/SVG button
  - Left sidebar collapses automatically to maximise canvas

### 3.6 Flows  ("/flows")  — VISUAL FLOW DIAGRAMS

  - Flow selector (shadcn/ui Tabs or Select) to switch between:
    1. User Journey — horizontal swimlane diagram
    2. Authentication Flow — animated sequence diagram
    3. Core Features Flow — multi-lane process diagram
    4. Data Flow — React Flow graph with colour-coded data types
    5. Error Handling — decision tree with severity colours
    6. State Transitions — state machine diagram
  - Each flow: interactive, clickable nodes, animated on play
  - Play/Pause controls
  - Export as PNG/SVG

### 3.7 Architecture  ("/architecture")  — INTERACTIVE DIAGRAMS

  NOT just markdown. Must render actual visual diagrams.

  - Tab navigation (shadcn/ui Tabs) between:
    1. **System Architecture** — React Flow graph showing components,
       services, databases, and their connections
    2. **Database ERD** — Tables as Card components with columns listed,
       relationship lines with cardinality labels
    3. **Frontend Component Tree** — Collapsible tree diagram
    4. **Backend Layers** — Layered diagram: Routes → Middleware →
       Controllers → Services → Repositories → DB
    5. **Security Flow** — Auth flow, token lifecycle, permission checks
  - Each tab: "View Source" toggle to show underlying markdown
  - Export diagrams as PNG/SVG

### 3.8 Sprints  ("/sprints")  — SPRINT RESULTS

  - Sprint list with summary Cards
  - Per sprint: **Recharts PieChart** (completed vs remaining),
    QA result badges, release notes rendered, summary rendered
  - **Recharts LineChart**: Velocity across sprints
  - Compare view

### 3.9 Requirements  ("/requirements")  — TRACEABILITY

  - Rendered SRS/PRD markdown
  - **Requirements Traceability Matrix**: shadcn/ui Table mapping
    requirement → spec → ticket, colour-coded by status
  - Functional vs Non-functional sections with Badge indicators
  - **ProgressBar**: Coverage (% of requirements with assigned tickets)

────────────────────────────────────────────────────────
4. WORKFLOW ANIMATION ENGINE (CRITICAL SECTION)
────────────────────────────────────────────────────────

This section defines exactly how the workflow page must behave.

### 4.1 Data Model

Each workflow is defined as:

  interface WorkflowGraph {
    id: string;
    name: string;
    description: string;
    nodes: WorkflowNode[];
    edges: WorkflowEdge[];
  }

  interface WorkflowNode {
    id: string;
    label: string;
    type: 'process' | 'decision' | 'start' | 'end' | 'external';
    metadata?: Record<string, string>;   // e.g. owner, spec file
    position: { x: number; y: number };
  }

  interface WorkflowEdge {
    id: string;
    source: string;
    target: string;
    label?: string;
    animated: boolean;            // participates in animation
    animationDirection: 'forward' | 'reverse';
    priority: number;             // 0 = critical path, 1+ = secondary
  }

### 4.2 Animation Behaviour

Edge animation:
  - Edges animate a subtle "travelling highlight" along their path.
  - Technique: SVG stroke-dasharray + stroke-dashoffset animated via CSS
    @keyframes, NOT per-edge JavaScript timers.
  - A thin gradient pulse (3–5 px wide) travels along the edge path.
  - Colour: follows source node accent, or primary colour by default.
  - Loop: animation repeats infinitely with a gentle pause at the end
    (ease-in-out, 3–5 s period depending on edge length).

Node selection interaction:
  1. User clicks a node.
  2. Incoming edges animate first (highlight travels TO the node, 0.6 s).
  3. After a 0.3 s pause, outgoing edges animate (highlight travels AWAY, 0.6 s).
  4. This creates a causal-trace effect: "data flows in, then results flow out".
  5. All other edges and nodes dim to 20 % opacity during this trace.
  6. Clicking the canvas background resets to global animation.

Branch stagger:
  - If a node has multiple outgoing edges, they animate with a stagger
    offset of 150 ms between each, ordered left-to-right (or top-to-bottom).
  - This prevents visual chaos and lets the viewer follow each branch.

Default pacing:
  - Calm, human-readable. One full edge traversal = 3 s at 1x speed.
  - No flashy effects. No particle trails. Subtle and professional.

### 4.3 Animation Controls (AnimationController.tsx)

Render a compact toolbar at the top of the workflow canvas:

  ┌──────────────────────────────────────────────────────────────┐
  │  ▶ Play  │  ⏸ Pause  │  0.5x  1x  1.5x  │  🔍 Focus  │  ⚙ │
  └──────────────────────────────────────────────────────────────┘

  - Play / Pause: toggles global edge animation.
  - Speed: three radio-style buttons. Adjusts CSS animation-duration
    via a CSS custom property --animation-speed-multiplier.
  - Focus Mode toggle: when ON, only the selected node's connected
    subgraph animates; everything else dims.
    When no node is selected, Focus Mode auto-selects the critical
    path (longest path or most-connected-nodes heuristic).
  - Settings gear (⚙): opens a small popover with:
      - "Animations ON/OFF" master toggle
      - "Reduce motion" override (force minimal animation)
    Settings persisted to localStorage key "${name.toLowerCase().replace(/\s+/g, '-')}-viewer-animation-prefs".

### 4.4 Play Tour Feature

  - A "▶ Play Tour" button in the toolbar.
  - When pressed, the viewer auto-walks the critical path:
    1. Viewport pans/zooms to the start node.
    2. Each node highlights in sequence (1.5 s per node at 1x).
    3. The edge between the previous and current node animates.
    4. DetailsPanel slides open showing the current node's metadata.
    5. At the end, viewport zooms to fit the full graph.
  - Tour can be interrupted by clicking anywhere on the canvas.

### 4.5 Accessibility & Reduced Motion

  - On mount, read window.matchMedia('(prefers-reduced-motion: reduce)').
  - If true:
      - Set master animation toggle to OFF.
      - Edge "flow" animations are replaced with a static dashed style.
      - Node selection still dims unrelated elements (opacity transition
        uses 0 ms duration so it's instant, not animated).
  - All controls are keyboard-accessible (Tab, Enter, Space).
  - React Flow canvas supports keyboard navigation natively.
  - Animated edges include aria-hidden="true"; animation is decorative.

### 4.6 Large Graph Performance

For graphs with > 50 nodes or > 80 edges:

  1. Only animate edges with priority === 0 (critical path) by default.
     Other edges render as static dashed lines.
  2. Use React Flow's built-in virtualisation (only nodes in viewport render).
  3. AnimatedEdge component is wrapped in React.memo with a custom
     areEqual that ignores transient animation state.
  4. The animation engine uses a SINGLE requestAnimationFrame loop
     (via useAnimationEngine hook) that updates a shared CSS custom
     property on the SVG container — individual edges read from it.
     This avoids N timers for N edges.
  5. Node components are memoised; they never re-render due to
     animation state changes.

### 4.7 AnimatedEdge Implementation Guidance

Preferred technique (encode this into the generated code):

  // AnimatedEdge.tsx — Custom React Flow edge
  // Uses SVG stroke-dasharray + stroke-dashoffset for the "travelling pulse"
  //
  // Key idea:
  //   - The edge path is drawn with a long dash-array.
  //   - A CSS @keyframes animation shifts stroke-dashoffset from
  //     pathLength → 0 (forward) or 0 → pathLength (reverse).
  //   - animation-duration is set via var(--edge-animation-duration)
  //     which the AnimationController adjusts when speed changes.
  //   - No JavaScript timers. Pure CSS animation on an SVG <path>.
  //
  // Performance:
  //   - Composited by the GPU (transform + opacity layer).
  //   - No React re-renders during animation.
  //   - Wrap in React.memo.

### 4.8 useAnimationEngine Hook

  interface AnimationState {
    playing: boolean;
    speed: 0.5 | 1 | 1.5;
    focusMode: boolean;
    focusedNodeId: string | null;
    animationsEnabled: boolean;
    reducedMotion: boolean;
    touring: boolean;
    tourStep: number;
  }

  - Single source of truth for all animation state.
  - Exposes actions: play, pause, setSpeed, toggleFocus, selectNode,
    startTour, stopTour, nextTourStep.
  - Persists { speed, focusMode, animationsEnabled } to localStorage.
  - Reads prefers-reduced-motion on mount and on media query change.

────────────────────────────────────────────────────────
5. WORKFLOW LEGEND (WorkflowLegend.tsx)
────────────────────────────────────────────────────────

Render a small, semi-transparent overlay (bottom-right corner) explaining:

  ───▶  Animated pulse = active data / control flow
  - - ▶  Dashed static = secondary or inactive path
  ●──── Blue node = process step
  ◆──── Yellow node = decision point
  ○──── Grey node = external system

  Click a node to trace its data flow.
  Use "Play Tour" to auto-walk the critical path.

The legend is collapsible (toggle arrow). Hidden by default on viewports < 768 px.

────────────────────────────────────────────────────────
6. SEARCH, FILTER & NAVIGATION
────────────────────────────────────────────────────────

Workflow page toolbar includes:
  - Search input: filters nodes by label (highlights matches, dims others).
  - Owner filter dropdown (if metadata.owner exists on nodes).
  - Sprint filter dropdown (if metadata.sprint exists).
  - "Fit View" button: zooms to fit all nodes.

Global sidebar navigation:
  - Dashboard
  - Specs (expandable: lists all 10 specs)
  - Backlog
  - Workflows
  - Architecture
  - Requirements

────────────────────────────────────────────────────────
7. CONSTRAINTS & QUALITY GATES
────────────────────────────────────────────────────────

The generated viewer code MUST:

  ✓ Build with zero TypeScript errors (strict mode).
  ✓ Use shadcn/ui for ALL UI primitives — no custom Button/Card/Badge etc.
  ✓ Use Recharts for ALL charts and data visualizations.
  ✓ Have at least 3 different Recharts chart types across the app.
  ✓ Dashboard page has at least 5 visual components (charts + cards + ring).
  ✓ Backlog page has both kanban AND table views with charts.
  ✓ Architecture page has interactive diagrams, not just markdown text.
  ✓ Every page has at least one non-text visual element.
  ✓ Respect prefers-reduced-motion (tested).
  ✓ Render on mobile (responsive, no horizontal scroll).
  ✓ Have no animation that blocks text reading or button interaction.
  ✓ Use React.memo on every node and edge component.
  ✓ Use zero setInterval / setTimeout for animation (CSS only).
  ✓ Look like a premium, polished SaaS dashboard — NOT a markdown reader.

────────────────────────────────────────────────────────
8. FILES TO GENERATE
────────────────────────────────────────────────────────

Generate EVERY file listed in the project structure (Section 1).

For data files (src/data/), generate COMPLETE realistic content:
  - 10 spec .md files (copy from project's specs/ folder)
  - docs/ folder (mirror the project's docs/ folder structure)
  - backlog.json: fully structured with ALL sprints and ALL tickets
    from the project's specs/backlog.md, parsed into:
    { project, sprints: [{ id, name, goal, status, totalPoints,
      completedPoints, tickets: [...] }], bugs: [...], stats: {...} }
  - workflows.json with at LEAST 6 graphs:
      1. "Feature Development Workflow" (8-12 nodes)
      2. "Sprint Execution Flow" (6-10 nodes)
      3. "System Request Flow" (8-12 nodes)
      4. "CI/CD Pipeline" (8-10 nodes)
      5. "User Authentication Flow" (8-10 nodes)
      6. One project-specific user flow (8-10 nodes)
  - architecture.json: parsed from docs/architecture/ with:
    { system: { components, connections }, database: { tables, relationships },
      frontend: { components, hierarchy }, backend: { layers, flow } }
  - flows.json: parsed from docs/flows/ with:
    { userJourneys, authFlow, dataFlow, stateMachines }
  - metrics.json: computed from backlog.json with:
    { velocity, modelDistribution, coverage, burndown }
  - requirements.md copied from the project root

Setup instructions that MUST be included in package.json scripts:
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  }

After generating package.json, include a setup note:
  npm install
  npx shadcn@latest init -d
  npx shadcn@latest add button card badge tabs dialog tooltip table
    dropdown-menu sheet separator select command popover scroll-area
    toggle-group avatar

────────────────────────────────────────────────────────
9. VIEWER QUALITY CHECKLIST (MUST PASS ALL)
────────────────────────────────────────────────────────

Before considering the viewer complete, verify:

  ✓ Dashboard has at LEAST 3 Recharts charts (pie, bar, line or area)
  ✓ Dashboard has animated stat counter cards
  ✓ Dashboard has a clickable mini architecture diagram
  ✓ Specs page shows a card grid with role icons (not a text list)
  ✓ Docs page shows folder cards with file count badges
  ✓ Backlog has BOTH kanban board view AND table view
  ✓ Backlog has at least 2 charts (status distribution, burndown)
  ✓ Workflows page renders React Flow graphs with animated edges
  ✓ Architecture page has interactive diagrams (not just markdown)
  ✓ All pages use shadcn/ui components (Card, Badge, Tabs, Table, etc.)
  ✓ Every page has at least one interactive/visual element beyond text
  ✓ Dark theme is the default with proper contrast
  ✓ Sidebar navigation works for all 9 pages
  ✓ Build succeeds with zero TypeScript errors
  ✓ The app is visually impressive — it looks like a premium dashboard

Start generating now. Output each file with its full path as a header.
\`\`\`

---

*This prompt is generated by AutoSpec. Feed it to your AI assistant to produce the project viewer app.*
`;
}

// ---------------------------------------------------------------------------
// Prompt 2 — Workflow data generation sub-prompt
// ---------------------------------------------------------------------------

function generateWorkflowDataPrompt(options: ViewerPromptGeneratorOptions): string {
  const name = options.projectName;
  const ts = options.techStack || {
    frontend: 'React',
    backend: 'Node.js',
    database: 'PostgreSQL',
    language: 'TypeScript',
  };

  return `# ${name} — Workflow Graph Data Generation Prompt

**Purpose:** Feed this prompt to an LLM to generate the workflow JSON data
files that the project viewer website consumes. Run this AFTER you have
generated the specs and backlog.

**Generated:** ${getCurrentDate()}

---

## PROMPT — START HERE

\`\`\`
Read the following AutoSpec artefacts for "${name}" and produce a
workflows.json file containing graph definitions for every significant
workflow in the project.

Input files to read:
  - docs/workflows.md (development, sprint, multi-agent, bug fix, git, deploy)
  - docs/architecture.md (system layers, request flow, auth flow)
  - specs/01_product_manager.md (user flows)
  - specs/02_backend_lead.md (API request lifecycle)
  - specs/06_devops_lead.md (CI/CD pipeline)
  - specs/backlog.md (sprint structure)

Output: a single JSON file with this schema:

{
  "workflows": [
    {
      "id": "string",
      "name": "string",
      "description": "string",
      "category": "development" | "architecture" | "user-flow" | "deployment",
      "nodes": [
        {
          "id": "string",
          "label": "string",
          "type": "start" | "process" | "decision" | "end" | "external",
          "metadata": {
            "owner": "string (optional — Backend, Frontend, DevOps, QA, etc.)",
            "specFile": "string (optional — which spec this relates to)",
            "sprint": "string (optional — sprint number)",
            "description": "string (optional — tooltip text)"
          },
          "position": { "x": number, "y": number }
        }
      ],
      "edges": [
        {
          "id": "string (e.g. e-source-target)",
          "source": "string (node id)",
          "target": "string (node id)",
          "label": "string (optional — edge label like 'yes', 'no', 'on success')",
          "animated": true | false,
          "animationDirection": "forward" | "reverse",
          "priority": 0 | 1 | 2
        }
      ]
    }
  ]
}

Rules for generating graph data:

1. Node positioning:
   - Use a top-to-bottom layout. Start nodes at y=0.
   - Horizontal spacing: 250 px between parallel nodes.
   - Vertical spacing: 120 px between sequential nodes.
   - Decision nodes should have branches going left and right.

2. Edge priority:
   - priority 0 = critical / happy path (these animate by default)
   - priority 1 = common alternative path
   - priority 2 = error / edge case path

3. Edge animation direction:
   - "forward" = pulse travels source → target (default)
   - "reverse" = pulse travels target → source (rare, for feedback loops)

4. Generate at LEAST these workflow graphs:

   a) "Feature Development Workflow"
      Nodes: Pick Ticket → Read Specs → Update Backlog (In Progress)
             → Create Branch → Implement → Write Tests → Run Tests
             → [Decision: Pass?] → Yes: Update Backlog (QA) → QA Review
             → [Decision: Pass?] → Yes: Mark Done / No: Back to Implement
      Category: development

   b) "Sprint Execution Flow"
      Nodes: Sprint Planning → Load Sprint Prompt → Execute Tickets
             → [Decision: Multi-agent?] → Yes: Fork (Agent A + Agent B)
             → Integration → Full Test Suite → Sprint Review → Sprint Complete
      Category: development

   c) "System Request Flow"
      Nodes: Client → ${ts.frontend} SPA → HTTP Request → API Gateway
             → Auth Middleware → Route Handler → Controller → Service
             → Repository → ${ts.database} → Response
      Category: architecture

   d) "CI/CD Pipeline"
      Nodes: Git Push → Install Deps → [Parallel: Lint, Typecheck, Unit Tests]
             → Build → Integration Tests → [Decision: Branch?]
             → develop: Deploy Staging / main: Deploy Production → Health Check
      Category: deployment

   e) "User Authentication Flow"
      Nodes: Visit App → [Decision: Logged in?] → No: Show Login
             → Enter Credentials → Validate → [Decision: Valid?]
             → Yes: Create Session → Redirect Dashboard
             → No: Show Error → Back to Login
      Category: user-flow

   f) One additional flow derived from the project's specific user flows
      in specs/01_product_manager.md. Use realistic node labels.
      Category: user-flow

5. Every graph must have exactly one "start" node and at least one "end" node.
6. Decision nodes must have at least two outgoing edges with labels.
7. Keep graphs between 6 and 15 nodes for readability.

Output ONLY the JSON. No commentary.
\`\`\`

---

*This prompt is generated by AutoSpec. Feed it after specs are generated.*
`;
}

// ---------------------------------------------------------------------------
// Prompt 3 — Animation & UI sub-prompt (standalone reference)
// ---------------------------------------------------------------------------

function generateAnimationGuidePrompt(options: ViewerPromptGeneratorOptions): string {
  const name = options.projectName;

  return `# ${name} — Viewer Animation & UI Implementation Guide

**Purpose:** Standalone reference for the animation system and UI rules that
the generated project viewer website must follow. This can be fed alongside
the master viewer prompt, or used to refine an already-generated viewer.

**Generated:** ${getCurrentDate()}

---

## PROMPT — START HERE

\`\`\`
You are refining the "${name} Viewer" React application. Apply the following
animation engine and UI rules precisely. Do not deviate.

═══════════════════════════════════════════════════════
A. ANIMATION ENGINE — SVG EDGE ANIMATION
═══════════════════════════════════════════════════════

Implementation:

1. AnimatedEdge.tsx renders a custom React Flow edge using <BaseEdge>.
2. Overlay a second <path> element (the "pulse") on top of the base edge:

   <path
     d={edgePath}
     className="animated-pulse"
     style={{
       stroke: pulseColor,
       strokeWidth: 3,
       fill: 'none',
       strokeDasharray: pathLength,
       strokeDashoffset: pathLength,
       animationDuration: \`calc(var(--edge-animation-duration, 3s) / var(--animation-speed, 1))\`,
       animationName: playing ? 'edgeFlow' : 'none',
       animationTimingFunction: 'ease-in-out',
       animationIterationCount: 'infinite',
       animationDirection: direction === 'reverse' ? 'reverse' : 'normal',
     }}
   />

3. CSS keyframes (define ONCE in index.css, not per-component):

   @keyframes edgeFlow {
     0%   { stroke-dashoffset: var(--path-length); opacity: 0; }
     10%  { opacity: 1; }
     90%  { opacity: 1; }
     100% { stroke-dashoffset: 0; opacity: 0; }
   }

4. --edge-animation-duration is set on the React Flow wrapper <div>:
     0.5x speed → 6s
     1.0x speed → 3s
     1.5x speed → 2s

5. The AnimationController updates this CSS variable on the wrapper ref.
   No React state update is needed for speed change — CSS picks it up.

═══════════════════════════════════════════════════════
B. NODE SELECTION — CAUSAL TRACE
═══════════════════════════════════════════════════════

When a node is clicked:

  Step 1 (0 ms):
    - Set all nodes and edges to opacity 0.15.
    - Set clicked node to opacity 1 + highlighted ring.

  Step 2 (0–600 ms):
    - Incoming edges animate (pulse travels to the node).
    - Source nodes of those edges fade to opacity 0.8.

  Step 3 (600–900 ms):
    - Brief pause. Clicked node pulses gently (scale 1.0 → 1.03 → 1.0).

  Step 4 (900–1500 ms):
    - Outgoing edges animate (pulse travels away from node).
    - Target nodes of those edges fade to opacity 0.8.
    - If multiple outgoing edges: stagger by 150 ms each.

  Step 5 (1500 ms+):
    - Hold this state. Incoming and outgoing edges continue looping.
    - User can click another node to re-trigger, or click canvas bg to reset.

Implementation:
  - Use CSS classes toggled by the useAnimationEngine hook:
      .edge--dimmed    { opacity: 0.15; }
      .edge--active-in { animation: edgeFlow ... }
      .edge--active-out { animation: edgeFlow ... ; animation-delay: 0.9s }
      .node--dimmed    { opacity: 0.15; }
      .node--highlighted { box-shadow: 0 0 0 3px var(--color-primary); }
  - The hook computes which edges are incoming/outgoing for the selected node
    and returns className maps. Components read from the map via their id.
  - NO per-node/per-edge React state. Only the hook holds selectedNodeId.

═══════════════════════════════════════════════════════
C. FOCUS MODE
═══════════════════════════════════════════════════════

When Focus Mode is ON:
  - If a node is selected: compute its connected subgraph
    (BFS up to depth 2 in both directions).
  - Only subgraph nodes/edges are visible (opacity 1).
  - Everything else: opacity 0.08.
  - Animated edges restricted to this subgraph.

When Focus Mode is ON but no node is selected:
  - Auto-select the critical path:
    Heuristic: topological sort, then the longest path from any start node
    to any end node. Highlight that path.

═══════════════════════════════════════════════════════
D. PLAY TOUR
═══════════════════════════════════════════════════════

Tour implementation:
  - Compute critical path (same heuristic as Focus Mode fallback).
  - Store as an ordered array of node IDs.
  - On each step:
      1. fitView({ nodes: [currentNodeId], padding: 0.5, duration: 800 })
      2. Trigger causal trace on current node (Section B).
      3. Open DetailsPanel with node metadata.
      4. Wait (1500 ms / speed multiplier).
      5. Advance to next node.
  - On final node: fitView({ padding: 0.2, duration: 1200 }) to show all.
  - Cancel on: click canvas, press Escape, or click Pause.

═══════════════════════════════════════════════════════
E. REDUCED MOTION
═══════════════════════════════════════════════════════

Detection (useReducedMotion.ts):
  const query = window.matchMedia('(prefers-reduced-motion: reduce)');
  Return reactive boolean. Listen for changes.

Behaviour when reduced motion is active:
  - animationsEnabled defaults to false.
  - Edge pulse replaced with static dashed stroke (no animation).
  - Node selection trace: instant opacity changes (transition: 0ms).
  - Tour auto-walk still moves viewport but without edge animation.
  - Speed controls are hidden (irrelevant).
  - User can still manually enable animations via Settings toggle
    (explicit opt-in overrides the OS preference).

═══════════════════════════════════════════════════════
F. PERFORMANCE RULES
═══════════════════════════════════════════════════════

1. NEVER use setInterval or setTimeout for edge animation.
2. NEVER store animation frame/tick in React state.
3. Every node component: export default React.memo(WorkflowNode).
4. Every edge component: export default React.memo(AnimatedEdge).
5. Memo comparator for edges ignores: playing, speed, focusedNodeId.
   (These affect CSS classes, not component props.)
6. For graphs > 50 nodes: auto-enable React Flow \`nodesDraggable={false}\`
   and reduce animation to priority-0 edges only.
7. SVG animations are GPU-composited. Do NOT animate layout properties
   (width, height, top, left). Only use opacity, transform, stroke-dashoffset.
8. Avoid Framer Motion on the canvas. Use it only for:
   - Sidebar slide in/out
   - DetailsPanel slide in/out
   - Page transitions
   - Modal/popover enter/exit

═══════════════════════════════════════════════════════
G. SETTINGS PERSISTENCE
═══════════════════════════════════════════════════════

localStorage key: "${name.toLowerCase().replace(/\s+/g, '-')}-viewer-prefs"

Schema:
{
  "animationsEnabled": boolean,
  "speed": 0.5 | 1 | 1.5,
  "focusMode": boolean,
  "sidebarCollapsed": boolean,
  "theme": "dark" | "light"
}

Read on mount. Write on every change (debounced 500 ms).

═══════════════════════════════════════════════════════
H. UI POLISH CHECKLIST
═══════════════════════════════════════════════════════

  ✓ All UI primitives use shadcn/ui components (never custom implementations).
  ✓ All charts use Recharts with consistent colour theme.
  ✓ All interactive elements have visible focus ring.
  ✓ Buttons have min-height 44 px (touch target).
  ✓ Cards use shadcn/ui Card with subtle border + shadow.
  ✓ Scrollable regions have styled scrollbar (thin, semi-transparent).
  ✓ Empty states have illustration/message ("No tickets in this sprint").
  ✓ Loading states use skeleton placeholders, not spinners.
  ✓ Transitions between pages: fade (150 ms), not slide.
  ✓ No layout shift on page load.
  ✓ Search input has debounced filtering (300 ms).
  ✓ Tooltip on hover for truncated text (max 2 lines with ellipsis).
  ✓ Dashboard has at least 3 Recharts charts visible above the fold.
  ✓ The overall aesthetic is polished, premium, and visually impressive.

Apply all of the above to the existing codebase. Output changed files only.
\`\`\`

---

*This prompt is generated by AutoSpec. Use it to refine or audit the viewer.*
`;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Generate all viewer prompt files
 */
export async function generateViewerPrompts(
  options: ViewerPromptGeneratorOptions
): Promise<string[]> {
  const viewerDir = path.join(options.outputDir, 'viewer');
  await ensureDir(viewerDir);

  const prompts = [
    {
      filename: 'generate-viewer-app.md',
      content: generateMasterViewerPrompt(options),
    },
    {
      filename: 'generate-workflow-data.md',
      content: generateWorkflowDataPrompt(options),
    },
    {
      filename: 'animation-ui-guide.md',
      content: generateAnimationGuidePrompt(options),
    },
  ];

  const generatedFiles: string[] = [];

  for (const prompt of prompts) {
    const outputPath = path.join(viewerDir, prompt.filename);
    await writeFile(outputPath, prompt.content);
    generatedFiles.push(outputPath);
  }

  return generatedFiles;
}
