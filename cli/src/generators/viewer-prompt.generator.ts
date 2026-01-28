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
It is a read-only, client-side dashboard that renders the AutoSpec artefacts
for "${name}" — ${desc}.

Tech stack for the VIEWER (not the project itself):
  React 18 + TypeScript + Vite + Tailwind CSS + React Router
  Additional libraries (install via npm):
    - @xyflow/react (React Flow v12) — graph / workflow visualisation
    - framer-motion — panel transitions and micro-interactions ONLY
    - lucide-react — icons
    - react-markdown + remark-gfm — render Markdown specs

All project data lives as static imports (JSON / Markdown files copied into
src/data/). The viewer has NO backend; it reads from local files at build time.

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
│   │   │   ├── StatCard.tsx        # Single metric card
│   │   │   └── ProgressRing.tsx    # Circular progress indicator
│   │   │
│   │   └── ui/                     # Shared primitives
│   │       ├── Button.tsx
│   │       ├── Badge.tsx
│   │       ├── Card.tsx
│   │       ├── Toggle.tsx
│   │       └── Tooltip.tsx
│   │
│   ├── pages/
│   │   ├── DashboardPage.tsx       # "/"  — project overview
│   │   ├── SpecsPage.tsx           # "/specs" — list + viewer
│   │   ├── BacklogPage.tsx         # "/backlog" — sprints & tickets
│   │   ├── WorkflowsPage.tsx       # "/workflows" — animated graph
│   │   ├── ArchitecturePage.tsx    # "/architecture" — system diagram
│   │   └── RequirementsPage.tsx    # "/requirements" — original SRS
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
2. DESIGN SYSTEM (generated CSS / Tailwind tokens)
────────────────────────────────────────────────────────

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

────────────────────────────────────────────────────────
3. PAGE-BY-PAGE GENERATION SPEC
────────────────────────────────────────────────────────

### 3.1 Dashboard  ("/")

Content:
  - Project name, description, tech stack badges
  - Sprint progress ring (% tickets done)
  - Stat cards: Total Tickets, Done, In Progress, Blocked, Test Coverage target
  - Mini backlog table (top 5 in-progress tickets)
  - Quick-links to each spec file
  - "View Workflows" CTA that navigates to /workflows

### 3.2 Specs  ("/specs" and "/specs/:slug")

List view:
  - 10 spec cards in a responsive grid (2-col md, 3-col lg)
  - Each card: role icon, title, description excerpt, word count badge
  - Click → navigates to /specs/:slug

Detail view:
  - Full Markdown rendering with syntax-highlighted code blocks
  - Sticky table-of-contents sidebar (parsed from ## headings)
  - "Back to all specs" breadcrumb

### 3.3 Backlog  ("/backlog")

  - Tab bar: one tab per sprint (Sprint 0, 1, 2, …)
  - Active sprint highlighted with accent colour
  - Each sprint renders a table:
      | # | Ticket | Status | Owner | Model |
    Status renders as coloured badge (emoji mapped to colour)
  - Filter: by status, by owner, by model
  - Search: free-text across ticket descriptions
  - Sprint progress bar at top of each tab

### 3.4 Workflows  ("/workflows")  ← PRIMARY FOCUS

  - Full-screen React Flow canvas (see Section 4 below)
  - Top toolbar: AnimationController + WorkflowSearch + filter dropdowns
  - Bottom-right: WorkflowLegend overlay
  - Left sidebar collapses automatically on this page to maximise canvas

### 3.5 Architecture  ("/architecture")

  - Render docs/architecture.md as rich Markdown
  - ASCII diagrams render inside styled <pre> blocks with monospace font
  - Optionally convert the main system diagram to a small React Flow graph

### 3.6 Requirements  ("/requirements")

  - Render original requirements.md as rich Markdown
  - Highlight functional vs non-functional requirements with colour badges

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
  ✓ Pass eslint with no warnings.
  ✓ Score ≥ 90 on Lighthouse Performance (no layout thrash from animations).
  ✓ Score ≥ 95 on Lighthouse Accessibility.
  ✓ Respect prefers-reduced-motion (tested).
  ✓ Render on mobile (responsive, no horizontal scroll).
  ✓ Have no animation that blocks text reading or button interaction.
  ✓ Use React.memo on every node and edge component.
  ✓ Use zero setInterval / setTimeout for animation (CSS only).
  ✓ Include brief inline comments explaining animation logic.

────────────────────────────────────────────────────────
8. FILES TO GENERATE
────────────────────────────────────────────────────────

Generate every file listed in the project structure (Section 1).
For data files (src/data/), generate realistic placeholder content
based on the "${name}" project:
  - 10 spec stubs (short Markdown with realistic headings)
  - backlog.json with 2 sprints and 10+ tickets
  - workflows.json with at least 2 graphs:
      1. "Development Workflow" (8-12 nodes)
      2. "Sprint Execution Flow" (6-10 nodes)
  - requirements.md copied from the project root

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

  ✓ All interactive elements have visible focus ring.
  ✓ Buttons have min-height 44 px (touch target).
  ✓ Cards use subtle border + shadow, not heavy outlines.
  ✓ Scrollable regions have styled scrollbar (thin, semi-transparent).
  ✓ Empty states have illustration/message ("No tickets in this sprint").
  ✓ Loading states use skeleton placeholders, not spinners.
  ✓ Transitions between pages: fade (150 ms), not slide.
  ✓ No layout shift on page load.
  ✓ Search input has debounced filtering (300 ms).
  ✓ Tooltip on hover for truncated text (max 2 lines with ellipsis).

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
