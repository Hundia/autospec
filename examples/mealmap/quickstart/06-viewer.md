# AutoSpec Viewer — Project Monitor React Application

> **What this section covers:** This section is the complete specification for the viewer/project monitor React application. Read this when building or modifying the viewer app.
>
> **When to read:** When building, modifying, or debugging anything under the `viewer/` directory. This covers tech stack, project structure, design system, all pages, the animation engine, and data files.

---

══════════════════════════════════════════════════════════════
SECTION 7 — VIEWER / PROJECT MONITOR WEBSITE
══════════════════════════════════════════════════════════════

╔══════════════════════════════════════════════════════════════════╗
║  CRITICAL: The viewer is a FULL VISUAL WEBSITE — NOT a simple   ║
║  markdown file reader. Every page MUST include interactive       ║
║  charts, diagrams, animated components, and rich UI built with  ║
║  shadcn/ui + Recharts. Think of it as an executive PRESENTATION ║
║  of the entire project. If a page only renders raw markdown     ║
║  text without visualizations, it is WRONG and must be redone.   ║
╚══════════════════════════════════════════════════════════════════╝

Generate a complete, self-contained React application in viewer/ that
provides a visually impressive dashboard for ALL generated artefacts
(specs, docs, backlog, workflows, architecture, flows, sprints).

### 7.1 Tech Stack

  React 18 + TypeScript + Vite + Tailwind CSS v4 + React Router
  shadcn/ui — complete component library (REQUIRED — do NOT build custom
              UI primitives). Initialize:
                npx shadcn@latest init -d
                npx shadcn@latest add button card badge tabs dialog
                tooltip table dropdown-menu sheet separator select
                command popover scroll-area toggle-group avatar
  recharts — charts and data visualisation (REQUIRED for every data page):
              PieChart, BarChart, LineChart, AreaChart, RadarChart
  @xyflow/react (React Flow v12) — workflow graph visualisation
  framer-motion — panel transitions ONLY (NOT for mass edge animation)
  lucide-react — icons (used by shadcn/ui)
  react-markdown + remark-gfm — Markdown rendering
  react-syntax-highlighter — code block highlighting

### 7.2 Project Structure

viewer/
├── public/
│   └── icons/                       # Role and status icons
├── src/
│   ├── App.tsx
│   ├── main.tsx
│   ├── index.css                    # Tailwind + global tokens + @keyframes
│   │
│   ├── data/                        # Static artefacts (import at build time)
│   │   ├── specs/                   # All 10 spec .md files
│   │   ├── docs/                    # All docs .md files (mirrored structure)
│   │   │   ├── architecture/        # 8 files including diagrams.md
│   │   │   ├── flows/               # 6 flow definition files (NEW)
│   │   │   ├── workflows/           # 8 files
│   │   │   ├── environments/        # 5 files
│   │   │   ├── api/                 # 5 files including curl-examples.md
│   │   │   ├── testing/             # 6 files including api-test-suite.md
│   │   │   ├── ui-design-system/    # 6 files including screens.md
│   │   │   └── project/             # 4 files including dependencies.md
│   │   ├── sprints/                 # Sprint result folders (NEW)
│   │   │   └── sprint_X/            # qa_result.md, release_notes.md, summary.md
│   │   ├── backlog.json             # Parsed backlog (sprints + tickets)
│   │   ├── workflows.json           # Graph definitions (nodes + edges)
│   │   ├── architecture.json        # Parsed architecture diagrams (NEW)
│   │   ├── flows.json               # Parsed flow definitions (NEW)
│   │   └── requirements.md          # Original SRS
│   │
│   ├── pages/
│   │   ├── DashboardPage.tsx        # "/" — with visual charts
│   │   ├── DesignSystemPage.tsx     # "/design-system" — FULL design system showcase
│   │   ├── SpecsPage.tsx            # "/specs" + "/specs/:slug"
│   │   ├── DocsPage.tsx             # "/docs" + "/docs/:section/:slug"
│   │   ├── BacklogPage.tsx          # "/backlog" — kanban + charts
│   │   ├── WorkflowsPage.tsx        # "/workflows" — animated flows
│   │   ├── FlowsPage.tsx            # "/flows" — user/system flows
│   │   ├── ArchitecturePage.tsx     # "/architecture" — interactive diagrams
│   │   ├── SprintsPage.tsx          # "/sprints" — sprint results
│   │   └── RequirementsPage.tsx     # "/requirements" — traceability matrix
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx          # Collapsible nav (260 px → 64 px)
│   │   │   ├── Header.tsx           # Search, breadcrumb, theme toggle
│   │   │   ├── DetailsPanel.tsx     # Right drawer (380 px, slide-in)
│   │   │   └── Layout.tsx           # Three-column shell
│   │   │
│   │   ├── specs/
│   │   │   ├── SpecViewer.tsx       # Markdown renderer + sticky TOC
│   │   │   ├── SpecCard.tsx         # Grid card for spec list
│   │   │   └── MermaidRenderer.tsx  # Mermaid diagram rendering (NEW)
│   │   │
│   │   ├── docs/
│   │   │   ├── DocViewer.tsx        # Markdown renderer for docs
│   │   │   ├── DocTree.tsx          # Nested folder tree navigation
│   │   │   ├── DocCard.tsx          # Card with visual preview
│   │   │   └── CodeBlock.tsx        # Syntax highlighted code (NEW)
│   │   │
│   │   ├── backlog/
│   │   │   ├── BacklogBoard.tsx     # Tab per sprint + table
│   │   │   ├── KanbanBoard.tsx      # Visual kanban view (NEW)
│   │   │   ├── BurndownChart.tsx    # Sprint burndown (NEW)
│   │   │   ├── SprintTab.tsx
│   │   │   ├── TicketRow.tsx
│   │   │   └── TicketCard.tsx       # Kanban card (NEW)
│   │   │
│   │   ├── workflows/
│   │   │   ├── WorkflowCanvas.tsx   # React Flow wrapper
│   │   │   ├── AnimatedEdge.tsx     # SVG stroke-dashoffset animation
│   │   │   ├── WorkflowNode.tsx     # Memoised node component
│   │   │   ├── AnimationController.tsx  # Play/Pause/Speed/Focus toolbar
│   │   │   ├── WorkflowLegend.tsx   # Collapsible legend overlay
│   │   │   ├── WorkflowSearch.tsx   # Search + filter bar
│   │   │   ├── WorkflowSelector.tsx # Dropdown to select flow (NEW)
│   │   │   └── PlayTour.tsx         # Auto-walk critical path
│   │   │
│   │   ├── flows/                   # NEW — Flow visualization components
│   │   │   ├── UserJourneyDiagram.tsx    # Swimlane user journey
│   │   │   ├── SequenceDiagram.tsx       # Request/response sequence
│   │   │   ├── DataFlowDiagram.tsx       # Data movement visualization
│   │   │   ├── StateMachine.tsx          # State transition diagram
│   │   │   └── FlowSelector.tsx          # Flow type selector
│   │   │
│   │   ├── architecture/            # NEW — Architecture visualization
│   │   │   ├── SystemDiagram.tsx         # Main architecture view
│   │   │   ├── ERDiagram.tsx             # Database ERD
│   │   │   ├── ComponentTree.tsx         # Frontend component hierarchy
│   │   │   ├── LayerDiagram.tsx          # Backend layer visualization
│   │   │   ├── SecurityFlowDiagram.tsx   # Auth/security flow
│   │   │   ├── CloudDiagram.tsx          # Infrastructure visualization
│   │   │   └── DiagramExport.tsx         # Export as PNG/SVG
│   │   │
│   │   ├── sprints/                 # Sprint results components
│   │   │   ├── SprintSummaryCard.tsx     # Sprint overview card
│   │   │   ├── SprintCompletionChart.tsx # Pie chart completion
│   │   │   ├── QAResultsViewer.tsx       # Test results with badges
│   │   │   ├── ReleaseNotesViewer.tsx    # Feature highlights
│   │   │   └── VelocityChart.tsx         # Velocity over sprints
│   │   │
│   │   ├── design-system/          # Design System showcase components
│   │   │   ├── ColorPalette.tsx         # Interactive colour swatch grid
│   │   │   ├── TypographyScale.tsx      # Font scale + weight showcase
│   │   │   ├── SpacingScale.tsx         # Visual spacing/sizing reference
│   │   │   ├── ComponentGallery.tsx     # Live rendered component examples
│   │   │   ├── ScreenInventory.tsx      # Screen wireframes / mockups gallery
│   │   │   ├── IconLibrary.tsx          # Icon grid with search
│   │   │   ├── ResponsivePreview.tsx    # Breakpoint visualizer
│   │   │   └── AccessibilityMatrix.tsx  # A11y compliance checklist
│   │   │
│   │   ├── dashboard/
│   │   │   ├── OverviewCards.tsx         # Stat cards with AnimatedCounter
│   │   │   ├── ProgressRing.tsx          # SVG animated circular progress
│   │   │   ├── SprintTimeline.tsx        # Recharts BarChart (stacked)
│   │   │   ├── ModelDistribution.tsx     # Recharts PieChart
│   │   │   ├── VelocityMini.tsx          # Recharts LineChart
│   │   │   ├── MiniArchitecture.tsx      # Clickable mini diagram → /arch
│   │   │   └── RecentTickets.tsx         # shadcn/ui Table with Badges
│   │   │
│   │   ├── charts/                  # Reusable Recharts wrappers
│   │   │   ├── PieChart.tsx              # Recharts PieChart wrapper
│   │   │   ├── BarChart.tsx              # Recharts BarChart wrapper
│   │   │   ├── LineChart.tsx             # Recharts LineChart wrapper
│   │   │   ├── AreaChart.tsx             # Recharts AreaChart wrapper
│   │   │   ├── ProgressBar.tsx           # Animated progress bar
│   │   │   └── AnimatedCounter.tsx       # Count-up number animation
│   │   │
│   │   └── ui/                      # shadcn/ui components (auto-generated)
│   │       # Generated by: npx shadcn@latest add button card badge tabs
│   │       # dialog tooltip table dropdown-menu sheet separator select
│   │       # command popover scroll-area toggle-group avatar
│   │       # Do NOT build custom UI primitives — use shadcn/ui
│   │
│   ├── hooks/
│   │   ├── useAnimationEngine.ts    # Central animation state
│   │   ├── useAnimationSettings.ts  # localStorage persistence
│   │   ├── useReducedMotion.ts      # prefers-reduced-motion
│   │   ├── useBacklogData.ts        # Parse and filter backlog (NEW)
│   │   └── useDiagramExport.ts      # Export diagrams (NEW)
│   │
│   └── lib/
│       ├── animation.ts             # Constants, easing, helpers
│       ├── graph.ts                 # BFS, critical path, subgraph
│       ├── theme.ts                 # Design tokens
│       ├── mermaid.ts               # Mermaid parsing helpers (NEW)
│       ├── markdown.ts              # Markdown parsing with diagrams (NEW)
│       └── export.ts                # PNG/SVG export utilities (NEW)
│
├── tailwind.config.js
├── vite.config.ts
├── tsconfig.json
└── package.json

### 7.3 Design System (shadcn/ui Dark Theme)

Use shadcn/ui "new-york" style. Configure dark theme as default.

Colours (CSS variables for shadcn/ui):
  --bg:           #0f172a   (slate-950)
  --surface:      #1e293b   (slate-800)
  --surface-2:    #334155   (slate-700)
  --border:       rgba(255,255,255,0.08)
  --text:         #f1f5f9   (slate-100)
  --text-muted:   #94a3b8   (slate-400)
  --primary:      #3b82f6   (blue-500)
  --secondary:    #a855f7   (purple-500)
  --success:      #10b981   (emerald-500)
  --warning:      #f59e0b   (amber-500)
  --error:        #ef4444   (red-500)
  --info:         #06b6d4   (cyan-500)

Recharts theme (use consistently across ALL charts):
  CHART_COLORS = ['#3b82f6', '#a855f7', '#10b981', '#f59e0b',
                   '#ef4444', '#06b6d4', '#ec4899', '#8b5cf6']

Typography: Inter (headings 600–700, body 400), JetBrains Mono (code)
Base: 16 px, scale: 1.25
Spacing: 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 px
Radii: sm 6, md 10, lg 16, full 9999

Component rules (MANDATORY):
  - ALL buttons → shadcn/ui <Button> (never custom)
  - ALL cards → shadcn/ui <Card> with CardHeader, CardContent, CardFooter
  - ALL badges → shadcn/ui <Badge> (variant: default, secondary, destructive, outline)
  - ALL tabs → shadcn/ui <Tabs> with TabsList, TabsTrigger, TabsContent
  - ALL tables → shadcn/ui <Table> with proper header/body/row/cell
  - ALL tooltips → shadcn/ui <Tooltip>
  - ALL dropdowns → shadcn/ui <Select> or <DropdownMenu>
  - ALL charts → Recharts with CHART_COLORS theme
  - NEVER build custom UI primitives — use shadcn/ui for everything

### 7.4 Pages

╔══════════════════════════════════════════════════════════════════╗
║  VISUAL MANDATE: Every page MUST include at least ONE of:       ║
║  - A Recharts chart (PieChart, BarChart, LineChart, AreaChart)  ║
║  - An interactive diagram (React Flow graph / SVG diagram)      ║
║  - A data-rich shadcn/ui Card grid with Badges + progress bars  ║
║  - An interactive shadcn/ui Table with filters and sorting      ║
║  Pages that are ONLY text/markdown rendering are NOT acceptable.║
║  The viewer must look like a premium SaaS dashboard product.    ║
╚══════════════════════════════════════════════════════════════════╝

Dashboard ("/"):
  THIS IS THE FIRST PAGE USERS SEE — it must be visually stunning.

  REQUIRED visual components (ALL must be present):
  - Project name as large heading + description + tech stack shadcn/ui Badges
  - **Recharts PieChart**: Sprint completion (done vs remaining tickets)
  - **SVG ProgressRing**: Animated circular progress (% overall completion)
  - **Recharts BarChart**: Tickets per sprint (stacked by status: done/progress/todo)
  - **Recharts LineChart**: Velocity trend line (points completed per sprint)
  - **Recharts PieChart**: Model distribution (haiku=green, sonnet=blue, opus=purple)
  - **AnimatedCounter** shadcn/ui Cards: Total Tickets, Done, In Progress,
    QA Review, Blocked — each with icon, count-up animation, and colour
  - **shadcn/ui Table**: Top 5 in-progress tickets with status Badges
  - Quick-links grid: 10 shadcn/ui Cards for specs (role icon + title)
  - Quick-links grid: doc folder Cards (folder icon + file count Badge)
  - **MiniArchitecture**: Clickable mini system diagram → links to /architecture
  - CTA Buttons: "View Workflows", "View Backlog" with ticket count Badges

Design System ("/design-system") — **VISUAL DESIGN SHOWCASE**:
  ╔══════════════════════════════════════════════════════════╗
  ║  THIS PAGE IS CRITICAL. It must prove to stakeholders   ║
  ║  that the project's visual identity, components,        ║
  ║  screens, and UX patterns are fully designed BEFORE     ║
  ║  development begins. It is an interactive visual        ║
  ║  catalogue — NOT rendered markdown text.                ║
  ╚══════════════════════════════════════════════════════════╝

  Data sources: specs/10_ui_designer.md + docs/ui-design-system/ + design-system.json

  shadcn/ui Tabs navigation across 7 sections:

  **Tab 1: Colour Palette** (ColorPalette.tsx)
    - Every project colour rendered as large interactive swatch Cards
    - Groups: Primary, Secondary, Success, Warning, Error, Info, Neutrals
    - Each swatch: hex code, CSS variable name, Tailwind class, copy-on-click
    - WCAG contrast ratio displayed per colour (against bg and text)
    - Dark/light mode side-by-side comparison
    - Semantic usage map: "primary → buttons, links; error → validation, alerts"

  **Tab 2: Typography** (TypographyScale.tsx)
    - Live rendered type scale: H1 → H2 → H3 → H4 → Body → Small → Caption
    - Each level: font family, weight, size (px + rem), line height
    - Rendered with actual project fonts (Inter / JetBrains Mono)
    - Body paragraph + code block examples for readability preview

  **Tab 3: Components** (ComponentGallery.tsx)
    - Live interactive gallery of ALL UI components the project uses:
      - Buttons: all variants × sizes, rendered live
      - Inputs: text, select, textarea with states (default, focus, error, disabled)
      - Cards: all variants with example content
      - Badges: status/role/model badges with all colour options
      - Modals/Dialogs: example with open button
      - Tables: sample data with sorting
      - Toasts: success, error, warning examples
      - Navigation: sidebar, breadcrumbs, tabs
      - Loading states: skeleton, spinner, progress bar
    - Component hierarchy diagram (Atoms → Molecules → Organisms)
    - Component status matrix: designed/built/planned with Badges

  **Tab 4: Screens** (ScreenInventory.tsx)
    - Grid of ALL application screens as visual Cards
    - Each Card: screen name, route, description, wireframe preview
    - Grouped: Public, Authenticated, Admin, Modal, Error screens
    - Click → expanded view with:
      - ASCII wireframe in styled <pre> (monospace)
      - Screen states: loading, empty, error, populated
      - User flows involving this screen
      - Components used on this screen
    - **Screen navigation map**: visual flow diagram showing screen connections
      (React Flow or simple graph: screen → screen transitions)
    - Screen state matrix: shadcn/ui Table with screens × states

  **Tab 5: Spacing & Layout** (SpacingScale.tsx)
    - Visual spacing scale: 4px → 64px shown as coloured bars with labels
    - Border radius scale: sm → full with rendered examples
    - Shadow scale: sm → xl with Card examples
    - Responsive grid system preview
    - Breakpoint visualizer: mobile / tablet / desktop layout examples

  **Tab 6: Icons & Assets** (IconLibrary.tsx)
    - Grid of all project icons (lucide-react) with search
    - Grouped by: navigation, actions, status, content
    - Click icon → copy import code
    - Size comparison: xs → xl side by side

  **Tab 7: Accessibility** (AccessibilityMatrix.tsx)
    - WCAG 2.1 AA checklist as interactive checkboxes
    - Contrast ratio checker between any two palette colours
    - Keyboard navigation map
    - ARIA label requirements per component
    - Reduced motion behaviour summary

  Design System MUST be the SECOND item in sidebar navigation (after Dashboard).
  Stakeholders review design before development starts.

Specs ("/specs"):
  - 10 shadcn/ui Card components in responsive grid (2 col md, 3 col lg)
  - Each Card: lucide-react role icon, title, description excerpt,
    Badge (word count), Badge (reading time), hover animation
  - **VISUAL: ProgressBar** per spec (sections covered vs total)
  - Must render ALL 10 specs with consistent styling
  - Detail ("/specs/:slug"): full Markdown rendered with:
    - Sticky TOC sidebar (auto-generated from ## headings, scrollspy active)
    - **VISUAL: Reading progress bar** at top (scroll-based)
    - **VISUAL: Mermaid diagram rendering** (if spec contains mermaid blocks)
    - **VISUAL: Code blocks** with react-syntax-highlighter + copy Button
    - Breadcrumb navigation with shadcn/ui components

Docs ("/docs"):
  - shadcn/ui Card grid showing each doc folder as a visual tile
  - Each Card: lucide-react folder icon, folder name, file count Badge,
    mini visual preview (not just text — show a small icon/illustration)
  - Cards for:
    📁 architecture/ — mini diagram icon
    📁 flows/ — mini flow arrow icon
    📁 workflows/ — mini process icon
    📁 environments/ — server icon
    📁 api/ — endpoint count Badge
    📁 testing/ — test pyramid icon
    📁 ui-design-system/ — colour swatch preview
    📁 project/ — folder tree icon
  - Nested tree navigation with expand/collapse (shadcn/ui Collapsible)
  - Detail ("/docs/:section/:slug"): full Markdown rendered with:
    - **VISUAL: Mermaid diagrams rendered** (flowcharts, sequence, ERD)
    - **VISUAL: Tables** using shadcn/ui Table with alternating rows
    - **VISUAL: Code blocks** with react-syntax-highlighter + copy Button
    - Breadcrumb: Docs > Architecture > Security

Flows ("/flows") — **REACT FLOW DIAGRAMS (NEVER TEXT)**:
  ╔══════════════════════════════════════════════════════════════════╗
  ║  CRITICAL: Every flow MUST render as a React Flow <ReactFlow>  ║
  ║  graph with nodes and edges. Read from flows.json which has    ║
  ║  pre-computed node positions. NEVER render flows as markdown   ║
  ║  text, bullet lists, ASCII art, or numbered steps.             ║
  ║                                                                ║
  ║  ANTI-PATTERN (WRONG):                                         ║
  ║    1. User visits app                                          ║
  ║    2. User clicks login → shows form                           ║
  ║    3. User submits credentials → API validates                 ║
  ║                                                                ║
  ║  CORRECT PATTERN:                                              ║
  ║    <ReactFlow nodes={flow.nodes} edges={flow.edges} />         ║
  ║    with styled custom nodes, animated edges, and interactivity ║
  ╚══════════════════════════════════════════════════════════════════╝

  Data source: flows.json (each flow has nodes[] with positions + edges[])

  shadcn/ui Tabs to switch between flow diagrams:

  **Each flow renders as a full React Flow canvas:**

  - **User Journey** (type: "swimlane")
    - React Flow graph with horizontal swim lanes (coloured background rows)
    - Lane headers on the left: "User", "Frontend", "API", "Database"
    - Custom nodes positioned within their lane's Y range
    - Animated edges showing request/response flow between lanes
    - Persona icon on the start node
    - Click node → Sheet with step details

  - **Authentication Flow** (type: "sequence")
    - React Flow graph with participant columns (Client, API, Auth, DB)
    - Column headers at top
    - Nodes arranged vertically in time order within columns
    - Animated edges as request arrows (→) and response arrows (←)
    - Edge labels: "POST /login", "200 OK + JWT", "SELECT user"
    - Token lifecycle shown as node colour transitions

  - **Core Features Flow** (type: "process")
    - React Flow graph of main feature workflows
    - Decision nodes (diamond shape) for branching
    - Clickable nodes link to relevant spec files
    - Colour-coded by feature area

  - **Data Flow** (type: "dataflow")
    - React Flow graph showing data movement between components
    - Node colour indicates data type (user data=blue, config=green, etc.)
    - Edge labels show data transformation descriptions
    - Animated edges showing direction of data flow

  - **Error Handling** (type: "decision-tree")
    - React Flow decision tree diagram
    - Decision nodes with Yes/No branches
    - Colour-coded by severity: warning=amber, error=red, fatal=dark red
    - Leaf nodes show recovery actions

  - **State Transitions** (type: "state-machine")
    - React Flow graph with state nodes (rounded rectangles)
    - Transition edges with event labels: "submit()", "approve()", "reject()"
    - Click state → highlight valid transitions (dim others)
    - Current/initial state highlighted with accent ring

  Each flow tab: Play/Pause for edge animations, Export PNG/SVG
  Custom node component per flow type (SwimLaneNode, SequenceNode, StateNode, etc.)
  All nodes use React.memo for performance

Backlog ("/backlog"):
  THIS IS THE MOST DATA-RICH PAGE — must be highly visual and interactive.

  Top section (always visible, above the fold):
  - **Recharts BarChart**: Tickets by status per sprint (stacked bars)
  - **Recharts PieChart**: Overall status distribution
  - **AnimatedCounter** shadcn/ui Cards: Total, Done, In Progress, Blocked
  - **ProgressBar**: Overall project completion with animated fill

  Main content (shadcn/ui Tabs):

  **Tab 1: Kanban Board** (default view, drag-disabled display only):
    - 5 columns: Todo | In Progress | QA Review | Done | Blocked
    - Each column: header with count Badge, point total
    - shadcn/ui Cards per ticket: title, owner Avatar/Badge, model Badge
      (haiku=green, sonnet=blue, opus=purple), points, dependency indicator
    - Column colour coding matching status

  **Tab 2: Sprint Table** (per-sprint view):
    - Sprint selector using shadcn/ui Tabs (Sprint 0, 1, 2, …)
    - Per-sprint: goal text, **animated ProgressBar**, points summary
    - shadcn/ui Table with sortable columns:
      - Status Badge (colour-coded):
        🔲 todo=slate, 🔄 in-progress=blue, 🧪 qa=purple,
        ✅ done=emerald, ⏸️ blocked=red
      - Owner Badge with role colour
      - Model Badge (haiku=green, sonnet=blue, opus=purple)
      - Points column
      - Dependency links (clickable)
    - **Recharts LineChart**: Sprint burndown (ideal vs actual line)

  - Filter bar: shadcn/ui Select for status, owner, model
  - Search: instant filter with debounced input
  - Bug Backlog tab with severity colour Badges
  - Click ticket → Sheet/DetailsPanel with full info + dependency graph

Workflows ("/workflows"):
  - Full-screen React Flow canvas (see Section 7.5 for animation details)
  - **VISUAL: Multiple workflow graphs** selectable via shadcn/ui Select:
    1. Feature Development Flow
    2. Sprint Execution Flow
    3. System Request Lifecycle
    4. CI/CD Pipeline (with parallel lanes)
    5. Authentication Flow
    6. Project-specific user flows
  - Top toolbar: AnimationController + search + workflow selector
  - **VISUAL: Animated edges** (CSS stroke-dasharray animation)
  - **VISUAL: Node highlighting** on hover with shadcn/ui Tooltip
  - Bottom-right: legend overlay (collapsible)
  - Export graph as PNG/SVG via shadcn/ui Button

Architecture ("/architecture") — **REACT FLOW DIAGRAMS (NEVER TEXT)**:
  ╔══════════════════════════════════════════════════════════════════╗
  ║  CRITICAL: Every architecture diagram MUST render as a React   ║
  ║  Flow <ReactFlow> graph with nodes and edges. Read from        ║
  ║  architecture.json which has pre-computed node positions.      ║
  ║  NEVER render architecture as markdown text, bullet lists,     ║
  ║  ASCII boxes, or <pre> blocks. Every tab must show a visual    ║
  ║  interactive graph that users can zoom, pan, and click.        ║
  ║                                                                ║
  ║  ANTI-PATTERN (WRONG):                                         ║
  ║    ## System Architecture                                      ║
  ║    - Client (React SPA)                                        ║
  ║      - API Gateway (Express)                                   ║
  ║        - Auth Service                                          ║
  ║        - User Service                                          ║
  ║                                                                ║
  ║  ALSO WRONG:                                                   ║
  ║    ┌──────────┐    ┌──────────┐    ┌──────────┐               ║
  ║    │  Client  │───▶│   API    │───▶│    DB    │               ║
  ║    └──────────┘    └──────────┘    └──────────┘               ║
  ║                                                                ║
  ║  CORRECT PATTERN:                                              ║
  ║    <ReactFlow nodes={diagram.nodes} edges={diagram.edges}      ║
  ║      nodeTypes={customNodeTypes} fitView />                    ║
  ╚══════════════════════════════════════════════════════════════════╝

  Data source: architecture.json (each diagram has nodes[] with positions + edges[])

  shadcn/ui Tabs navigation. Each tab renders a React Flow canvas:

  **Tab 1: System Architecture** (id: "system-architecture", default view)
    - React Flow graph with custom node components per type:
      - "frontend" nodes: blue background, Monitor icon
      - "backend" nodes: purple background, Server icon
      - "database" nodes: green background, Database icon
      - "cache" nodes: amber background, Zap icon
      - "queue" nodes: cyan background, List icon
      - "external" nodes: grey dashed border, Globe icon
    - Each node: rounded Card with icon + label + tech badge
    - Click node → shadcn/ui Sheet with metadata (tech stack, description,
      endpoints, responsibilities)
    - Animated edges showing data flow direction
    - Edge labels: "HTTP/REST", "WebSocket", "SQL", "Redis", "gRPC"
    - Zoom, pan, fitView enabled

  **Tab 2: Database ERD** (id: "database-erd")
    - React Flow graph with custom ERD node component:
      - Each node = one database table
      - Node renders as a Card with:
        - Header: table name (bold, coloured)
        - Body: list of columns with type badges
        - PK columns marked with key icon
        - FK columns marked with link icon
    - Edges = relationships with cardinality labels ("1:N", "N:M", "1:1")
    - Edge style: different colours per relationship type
    - Click table node → Sheet with full schema, indexes, constraints

  **Tab 3: Frontend Component Tree** (id: "frontend-tree")
    - React Flow graph with tree layout (top-down):
      - Root: App
      - Level 1: Layout components
      - Level 2: Page components
      - Level 3: Feature components
      - Level 4: UI primitives
    - Nodes as rounded Cards with component name
    - Edges as parent→child arrows
    - Click node → Sheet with props, state, children info
    - Collapsible subtrees (click group to expand/collapse)

  **Tab 4: Backend Layers** (id: "backend-layers")
    - React Flow graph showing layered architecture:
      - Horizontal layers (top to bottom): Routes → Middleware →
        Controllers → Services → Repositories → Database
      - Multiple nodes per layer (one per route/controller/service)
      - Animated request flow on play button (edge pulse top → bottom)
      - Response flow (edge pulse bottom → top) in different colour
    - Layer background colours for visual grouping

  **Tab 5: Security Flow** (id: "security-flow")
    - React Flow graph showing auth flow:
      - Login request → credential validation → token generation →
        token storage → subsequent request → token verification →
        permission check → resource access
    - Nodes colour-coded: auth=blue, token=green, permission=amber
    - Edge labels: "JWT", "bcrypt", "RBAC check"
    - Animated flow on play

  Each tab: "View Source" toggle (shows raw markdown), Export PNG/SVG
  All custom nodes wrapped in React.memo
  All diagrams must be zoomable, pannable, and responsive

Sprints ("/sprints") — **SPRINT RESULTS WITH CHARTS**:
  View completed sprint documentation from sprints/ folder.

  - Sprint list as shadcn/ui Cards with status Badges
  - Per-sprint view shows:
    - **Recharts PieChart**: Completion (done vs remaining tickets)
    - **shadcn/ui Card**: Sprint summary with key metric Badges
    - qa_result.md rendered with test result Badges (pass/fail/skip)
    - release_notes.md rendered with feature highlight Cards
    - summary.md rendered with retrospective insights
  - **Recharts LineChart**: Velocity comparison across all sprints

Requirements ("/requirements"):
  - Rendered SRS/PRD markdown with syntax highlighting
  - **VISUAL: Requirements Traceability Matrix**
    - shadcn/ui Table mapping: requirement → spec → ticket
    - Status Badges colour-coded by implementation status
  - Functional vs non-functional sections with shadcn/ui Badges
  - **Recharts/ProgressBar**: Coverage (% of requirements with tickets)

### 7.5 Workflow Animation Engine

DATA MODEL:

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
    metadata?: Record<string, string>;
    position: { x: number; y: number };
  }

  interface WorkflowEdge {
    id: string;
    source: string;
    target: string;
    label?: string;
    animated: boolean;
    animationDirection: 'forward' | 'reverse';
    priority: number;   // 0 = critical path, 1+ = secondary
  }

Generate workflows.json with at LEAST these graphs:
  1. Feature Development Flow (8–12 nodes)
  2. Sprint Execution Flow (6–10 nodes)
  3. System Request Lifecycle (8–12 nodes, from client to DB and back)
  4. CI/CD Pipeline (8–10 nodes with parallel stages)
  5. User Authentication Flow (8–10 nodes)
  6. One additional flow derived from the project's specific user flows

EDGE ANIMATION (AnimatedEdge.tsx):

  Technique: SVG stroke-dasharray + stroke-dashoffset via CSS @keyframes.
  NO JavaScript timers. Pure CSS on an SVG <path>.

  The edge draws a second <path> overlay (the "pulse"):
    - strokeDasharray = pathLength
    - strokeDashoffset animates from pathLength → 0 (forward)
    - animation-duration reads from CSS variable --edge-anim-duration
    - animationTimingFunction: ease-in-out
    - animationIterationCount: infinite

  @keyframes edgeFlow {
    0%   { stroke-dashoffset: var(--path-length); opacity: 0; }
    10%  { opacity: 1; }
    90%  { opacity: 1; }
    100% { stroke-dashoffset: 0; opacity: 0; }
  }

  Speed mapping (set as CSS custom property on wrapper):
    0.5x → --edge-anim-duration: 6s
    1.0x → --edge-anim-duration: 3s
    1.5x → --edge-anim-duration: 2s

NODE SELECTION — CAUSAL TRACE:

  Click a node →
    Step 1 (0 ms): Dim all nodes/edges to opacity 0.15.
                    Highlight clicked node (opacity 1 + ring).
    Step 2 (0–600 ms): Incoming edges animate (pulse travels TO node).
                        Source nodes fade to 0.8.
    Step 3 (600–900 ms): Pause. Clicked node pulses (scale 1.0 → 1.03 → 1.0).
    Step 4 (900–1500 ms): Outgoing edges animate (pulse travels AWAY).
                           Target nodes fade to 0.8.
                           Multiple outgoing edges stagger 150 ms each.
    Step 5 (1500 ms+): Hold. Edges loop. Click another node or canvas bg to reset.

  Implementation: CSS classes toggled by useAnimationEngine hook.
  NO per-node/per-edge React state. Only hook holds selectedNodeId.

CONTROLS (AnimationController.tsx):

  ┌──────────────────────────────────────────────────────────┐
  │ ▶ Play │ ⏸ Pause │ 0.5x  1x  1.5x │ 🔍 Focus │ ⚙ │
  └──────────────────────────────────────────────────────────┘

  - Play / Pause: toggle edge CSS animation-name.
  - Speed: set --edge-anim-duration CSS property. No React re-render.
  - Focus Mode: only selected node's subgraph (BFS depth 2) visible.
    If no node selected: auto-highlight critical path (longest path heuristic).
  - Settings gear (⚙) popover: master ON/OFF + reduced-motion override.
  - Persist to localStorage: animationsEnabled, speed, focusMode.

PLAY TOUR (PlayTour.tsx):

  1. Compute critical path (longest start→end path).
  2. fitView to start node (800 ms pan).
  3. Trigger causal trace on current node.
  4. Open DetailsPanel with node metadata.
  5. Wait 1500 ms / speed multiplier.
  6. Advance to next node.
  7. On final node: fitView to full graph (1200 ms).
  Cancel: click canvas, press Escape, or click Pause.

LEGEND (WorkflowLegend.tsx):

  Bottom-right corner, semi-transparent, collapsible.
  ──▶  Animated pulse = active data flow
  - -▶  Dashed = secondary / inactive path
  ● Blue   = process step
  ◆ Yellow = decision point
  ○ Grey   = external system
  Click a node to trace its flow. "Play Tour" auto-walks the main path.
  Hidden on viewports < 768 px.

ACCESSIBILITY:

  - Read prefers-reduced-motion on mount and on change.
  - If active: animations default OFF, edges show static dashes,
    node selection uses instant opacity (0 ms transition).
    User can still opt-in via Settings toggle.
  - All controls: keyboard-accessible (Tab, Enter, Space).
  - Animated edges: aria-hidden="true" (decorative).

PERFORMANCE (>50 nodes or >80 edges):

  1. Only animate priority-0 edges by default.
  2. Enable React Flow viewport virtualisation.
  3. React.memo on EVERY node and edge component.
  4. Memo comparator ignores: playing, speed, focusedNodeId.
  5. ONE requestAnimationFrame loop (if needed) via useAnimationEngine.
  6. Only GPU-composited properties: opacity, transform, stroke-dashoffset.
  7. Framer Motion: panels/pages ONLY. Never on canvas elements.
  8. Zero setInterval / setTimeout for animation.

### 7.6 Viewer Data Files

Generate these inside viewer/src/data/. The viewer must have access to
EVERY SINGLE generated .md file so it can render them all.

╔══════════════════════════════════════════════════════════════════╗
║  CRITICAL: The JSON data files are what enable visual rendering.║
║  Without properly structured JSON, the viewer can only show     ║
║  markdown text — which defeats the entire purpose.              ║
║  Every JSON file below MUST be generated with complete,         ║
║  realistic data. This is what powers the charts, diagrams,      ║
║  kanban boards, and interactive components.                     ║
╚══════════════════════════════════════════════════════════════════╝

viewer/src/data/
├── specs/
│   ├── 01_product_manager.md
│   ├── 02_backend_lead.md
│   ├── 03_frontend_lead.md
│   ├── 04_db_architect.md
│   ├── 05_qa_lead.md
│   ├── 06_devops_lead.md
│   ├── 07_marketing_lead.md
│   ├── 08_finance_lead.md
│   ├── 09_business_lead.md
│   └── 10_ui_designer.md
│
├── docs/
│   ├── architecture/
│   │   ├── overview.md
│   │   ├── backend.md
│   │   ├── frontend.md
│   │   ├── database.md
│   │   ├── security.md
│   │   ├── cloud.md
│   │   ├── deep-dive.md
│   │   └── diagrams.md           # Mermaid/PlantUML definitions (NEW)
│   │
│   ├── flows/                    # NEW — Flow documentation
│   │   ├── user-journeys.md      # User journey descriptions
│   │   ├── authentication-flow.md # Auth flow steps
│   │   ├── core-features-flow.md  # Main feature flows
│   │   ├── data-flow.md          # Data movement descriptions
│   │   ├── error-handling-flow.md # Error flows
│   │   └── state-transitions.md   # State machine definitions
│   │
│   ├── workflows/
│   │   ├── development.md
│   │   ├── sprint-execution.md
│   │   ├── git-workflow.md
│   │   ├── ci-cd-pipeline.md
│   │   ├── bug-fix.md
│   │   ├── deployment.md
│   │   ├── multi-agent.md
│   │   └── qa-review.md
│   │
│   ├── environments/
│   │   ├── development.md
│   │   ├── docker.md
│   │   ├── staging.md
│   │   ├── production.md
│   │   └── environment-variables.md
│   │
│   ├── api/
│   │   ├── reference.md
│   │   ├── authentication.md
│   │   ├── error-codes.md
│   │   ├── rate-limiting.md
│   │   └── curl-examples.md      # Ready-to-run curl commands (NEW)
│   │
│   ├── testing/
│   │   ├── strategy.md
│   │   ├── unit-tests.md
│   │   ├── integration-tests.md
│   │   ├── e2e-tests.md
│   │   ├── test-data.md
│   │   └── api-test-suite.md     # Complete API test scenarios (NEW)
│   │
│   ├── ui-design-system/
│   │   ├── tokens.md
│   │   ├── components.md
│   │   ├── layouts.md
│   │   ├── accessibility.md
│   │   ├── icons-assets.md
│   │   └── screens.md            # Screen inventory (NEW)
│   │
│   └── project/
│       ├── setup.md
│       ├── coding-standards.md
│       ├── glossary.md
│       └── dependencies.md       # Package dependencies (NEW)
│
├── sprints/                      # NEW — Sprint execution results
│   ├── sprint_0/
│   │   ├── qa_result.md
│   │   ├── release_notes.md
│   │   └── summary.md
│   └── sprint_N/                 # (One folder per completed sprint)
│       ├── qa_result.md
│       ├── release_notes.md
│       └── summary.md
│
├── backlog.json                  # Parsed from specs/backlog.md into structured JSON:
│                                 #   {
│                                 #     project: { name, description, totalSprints, totalTickets, totalPoints },
│                                 #     sprints: [{
│                                 #       id, name, goal, status, totalPoints, completedPoints,
│                                 #       tickets: [{ id, title, description, points, status,
│                                 #                   owner, model, dependencies, notes }]
│                                 #     }],
│                                 #     bugs: [{ id, title, severity, status, sprint, notes }],
│                                 #     stats: { todo, inProgress, qaReview, done, blocked }
│                                 #   }
│
├── workflows.json                # Graph definitions for workflow visualization:
│                                 #   [{
│                                 #     id, name, description,
│                                 #     nodes: [{ id, label, type, position, metadata }],
│                                 #     edges: [{ id, source, target, label, animated, priority }]
│                                 #   }]
│
├── architecture.json             # Structured architecture data AS REACT FLOW GRAPHS:
│                                 #   {
│                                 #     "diagrams": [
│                                 #       {
│                                 #         "id": "system-architecture",
│                                 #         "name": "System Architecture",
│                                 #         "description": "High-level system components",
│                                 #         "nodes": [
│                                 #           {
│                                 #             "id": "client",
│                                 #             "label": "React SPA",
│                                 #             "type": "frontend",
│                                 #             "icon": "monitor",
│                                 #             "metadata": { "tech": "React 18", "desc": "..." },
│                                 #             "position": { "x": 400, "y": 0 }
│                                 #           },
│                                 #           {
│                                 #             "id": "api-gateway",
│                                 #             "label": "API Gateway",
│                                 #             "type": "backend",
│                                 #             "icon": "server",
│                                 #             "metadata": { "tech": "Express.js", "desc": "..." },
│                                 #             "position": { "x": 400, "y": 150 }
│                                 #           }
│                                 #           // ... more nodes for each component
│                                 #         ],
│                                 #         "edges": [
│                                 #           {
│                                 #             "id": "e-client-api",
│                                 #             "source": "client",
│                                 #             "target": "api-gateway",
│                                 #             "label": "HTTP/REST",
│                                 #             "animated": true
│                                 #           }
│                                 #           // ... more edges for each connection
│                                 #         ]
│                                 #       },
│                                 #       {
│                                 #         "id": "database-erd",
│                                 #         "name": "Database ERD",
│                                 #         "nodes": [
│                                 #           {
│                                 #             "id": "users-table",
│                                 #             "label": "users",
│                                 #             "type": "table",
│                                 #             "metadata": {
│                                 #               "columns": [
│                                 #                 { "name": "id", "type": "UUID", "pk": true },
│                                 #                 { "name": "email", "type": "VARCHAR(255)" },
│                                 #                 { "name": "name", "type": "VARCHAR(100)" }
│                                 #               ]
│                                 #             },
│                                 #             "position": { "x": 0, "y": 0 }
│                                 #           }
│                                 #         ],
│                                 #         "edges": [
│                                 #           {
│                                 #             "id": "e-users-orders",
│                                 #             "source": "users-table",
│                                 #             "target": "orders-table",
│                                 #             "label": "1:N",
│                                 #             "animated": false
│                                 #           }
│                                 #         ]
│                                 #       },
│                                 #       { "id": "backend-layers", ... },
│                                 #       { "id": "frontend-tree", ... },
│                                 #       { "id": "security-flow", ... }
│                                 #     ]
│                                 #   }
│                                 #
│                                 #   Node types: "frontend"|"backend"|"database"|"cache"|
│                                 #     "queue"|"external"|"table"|"service"|"middleware"
│                                 #   Every diagram MUST have nodes with positions + edges.
│                                 #   This is what React Flow renders — not text!
│
├── flows.json                    # Structured flow data AS REACT FLOW GRAPHS:
│                                 #   {
│                                 #     "flows": [
│                                 #       {
│                                 #         "id": "user-journey",
│                                 #         "name": "User Journey",
│                                 #         "type": "swimlane",
│                                 #         "description": "End-to-end user journey",
│                                 #         "lanes": ["User", "Frontend", "API", "Database"],
│                                 #         "nodes": [
│                                 #           {
│                                 #             "id": "visit-app",
│                                 #             "label": "Visit Application",
│                                 #             "lane": "User",
│                                 #             "type": "start",
│                                 #             "position": { "x": 0, "y": 50 }
│                                 #           },
│                                 #           {
│                                 #             "id": "render-page",
│                                 #             "label": "Render Landing Page",
│                                 #             "lane": "Frontend",
│                                 #             "type": "process",
│                                 #             "position": { "x": 250, "y": 50 }
│                                 #           }
│                                 #         ],
│                                 #         "edges": [
│                                 #           {
│                                 #             "id": "e-visit-render",
│                                 #             "source": "visit-app",
│                                 #             "target": "render-page",
│                                 #             "label": "HTTP GET /",
│                                 #             "animated": true
│                                 #           }
│                                 #         ]
│                                 #       },
│                                 #       {
│                                 #         "id": "auth-flow",
│                                 #         "name": "Authentication Flow",
│                                 #         "type": "sequence",
│                                 #         "participants": ["Client", "API", "Auth Service", "DB"],
│                                 #         "nodes": [...],
│                                 #         "edges": [...]
│                                 #       },
│                                 #       {
│                                 #         "id": "data-flow",
│                                 #         "name": "Data Flow",
│                                 #         "type": "dataflow",
│                                 #         "nodes": [...],
│                                 #         "edges": [...]
│                                 #       },
│                                 #       {
│                                 #         "id": "state-machine-order",
│                                 #         "name": "Order State Machine",
│                                 #         "type": "state-machine",
│                                 #         "nodes": [
│                                 #           { "id": "draft", "label": "Draft", "type": "state",
│                                 #             "position": { "x": 0, "y": 100 } },
│                                 #           { "id": "submitted", "label": "Submitted", "type": "state",
│                                 #             "position": { "x": 250, "y": 100 } }
│                                 #         ],
│                                 #         "edges": [
│                                 #           { "id": "e-draft-submit", "source": "draft",
│                                 #             "target": "submitted", "label": "submit()",
│                                 #             "animated": true }
│                                 #         ]
│                                 #       },
│                                 #       { "id": "error-flow", ... },
│                                 #       { "id": "core-features", ... }
│                                 #     ]
│                                 #   }
│                                 #
│                                 #   Flow types: "swimlane"|"sequence"|"dataflow"|
│                                 #     "state-machine"|"decision-tree"|"process"
│                                 #   Every flow MUST have nodes with positions + edges.
│                                 #   This is what React Flow renders — not text!
│
├── metrics.json                  # Project metrics for dashboard:
│                                 #   {
│                                 #     velocity: [{ sprint, points }],
│                                 #     modelDistribution: { haiku: N, sonnet: N, opus: N },
│                                 #     coverage: { unit: N, integration: N, e2e: N },
│                                 #     burndown: [{ date, remaining }]
│                                 #   }
│
├── design-system.json            # Structured design system data for visual rendering:
│                                 #   {
│                                 #     colors: {
│                                 #       primary, secondary, success, warning, error, info,
│                                 #       neutrals: [{ name, hex, usage }],
│                                 #       semantic: [{ usage, colorRef }]
│                                 #     },
│                                 #     typography: {
│                                 #       scale: [{ level, family, size, weight, lineHeight }]
│                                 #     },
│                                 #     spacing: [{ name, px, rem }],
│                                 #     radii: [{ name, px }],
│                                 #     shadows: [{ name, value }],
│                                 #     components: [{ name, category, variants, status }],
│                                 #     screens: [{
│                                 #       name, route, category, description, wireframe,
│                                 #       states: ['loading','empty','error','populated'],
│                                 #       componentsUsed: [...]
│                                 #     }],
│                                 #     screenFlow: { nodes: [...], edges: [...] },
│                                 #     breakpoints: [{ name, minWidth, columns, behavior }],
│                                 #     icons: [{ name, category, usage }],
│                                 #     accessibility: { wcagLevel, checklist: [{ item, status }] }
│                                 #   }
│
└── requirements.md               # Original SRS/PRD input documents

Import strategy:
- Use Vite's ?raw import for .md files so they are embedded at build time
- For .json files, use standard import
- Generate architecture.json, flows.json, and design-system.json by parsing markdown
- design-system.json is parsed from specs/10_ui_designer.md + docs/ui-design-system/
- These JSON files enable the visual diagram rendering (not just text)

JSON Generation Rules:
- Parse Mermaid blocks from markdown and convert to React Flow node/edge format
- Extract tables and convert to structured data with positions
- Parse ASCII diagrams and infer component relationships as nodes + edges
- ALL diagram JSON files (architecture.json, flows.json, workflows.json) MUST
  use React Flow-compatible format: nodes[] with { id, label, type, position }
  and edges[] with { id, source, target, label, animated }
- Every node MUST have a position: { x, y } — this is what React Flow needs
  to render the graph. Without positions, React Flow cannot display nodes.
- All JSON must be valid and complete — no placeholders

╔══════════════════════════════════════════════════════════════════╗
║  DIAGRAM RENDERING RULES — READ THIS CAREFULLY                  ║
╠══════════════════════════════════════════════════════════════════╣
║                                                                  ║
║  The Architecture, Flows, and Workflows pages MUST render        ║
║  diagrams using <ReactFlow> components reading from JSON data.   ║
║                                                                  ║
║  NEVER DO ANY OF THESE (these are ALL wrong):                    ║
║  ✗ Render markdown text and call it a "diagram"                  ║
║  ✗ Render ASCII art boxes (┌──────┐) in <pre> tags              ║
║  ✗ Render numbered step lists ("1. User logs in, 2. API…")      ║
║  ✗ Render bullet-point hierarchies as the diagram                ║
║  ✗ Render Mermaid source code as text instead of a graph         ║
║  ✗ Show a markdown file with "```mermaid" blocks unrendered     ║
║  ✗ Use only <div> boxes with CSS borders to fake a diagram       ║
║                                                                  ║
║  ALWAYS DO THIS (the only correct approach):                     ║
║  ✓ Use <ReactFlow nodes={data.nodes} edges={data.edges} />      ║
║  ✓ Define custom nodeTypes for each diagram type                 ║
║  ✓ Every node has position: { x, y } from the JSON              ║
║  ✓ Edges connect nodes with animated or styled lines             ║
║  ✓ Users can zoom, pan, and click on nodes                       ║
║  ✓ Click node → opens Sheet/panel with metadata details          ║
║  ✓ Diagrams have fitView for auto-zoom on load                   ║
║                                                                  ║
║  Architecture → architecture.json → React Flow per tab           ║
║  Flows → flows.json → React Flow per tab                         ║
║  Workflows → workflows.json → React Flow per tab                 ║
║                                                                  ║
║  If a diagram renders as text, it is WRONG. Fix it.              ║
╚══════════════════════════════════════════════════════════════════╝

---
*Source: QUICKSTART.md — Part 6 of 7*
