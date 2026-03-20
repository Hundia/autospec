import type { GraphNode, GraphEdge } from '../components/diagrams/DependencyGraph'
import type { Actor, Message, ActivationBar } from '../components/diagrams/SequenceDiagram'
import type { TimelinePhase, TimelineMilestone } from '../components/diagrams/SprintTimeline'
import type { AgentData } from '../components/diagrams/AgentCapabilityRadar'
import type { FlowStep, FlowConnection } from '../components/diagrams/FlowDiagram'

export interface SprintPlanning {
  overview: string
  architectureNotes?: string
  flowSteps?: FlowStep[]
  flowConnections?: FlowConnection[]
  dependencyGraph?: { nodes: GraphNode[]; edges: GraphEdge[] }
  sequenceDiagram?: { actors: Actor[]; messages: Message[]; activationBars?: ActivationBar[] }
}

export interface SprintRetrospective {
  completedAt: string
  timeline?: { phases: TimelinePhase[]; milestones?: TimelineMilestone[]; columns: string[]; totalRows?: number }
  agentRadar?: { agents: AgentData[]; axes: { key: string; label: string }[] }
  keyMetrics?: { label: string; value: string | number }[]
  highlights?: string[]
  challenges?: string[]
}

export interface SprintVisualization {
  sprintId: string
  title: string
  planning?: SprintPlanning
  retrospective?: SprintRetrospective
}

export const sprintVisualizations: Record<string, SprintVisualization> = {
  '0': {
    sprintId: '0',
    title: 'SDD Foundation',
    planning: { overview: 'Bootstrap AutoSpec as an SDD project using its own tools. Created 10 role specs, backlog, agent briefings, and methodology docs.' },
    retrospective: {
      completedAt: '2026-03-09',
      highlights: ['Self-bootstrapped SDD', 'All 10 specs defined', 'Orchestrator + Agent pattern documented'],
      challenges: ['First-ever SDD project bootstrap'],
      keyMetrics: [
        { label: 'Role Specs', value: 10 },
        { label: 'Methodology Docs', value: 10 },
        { label: 'Sprint Briefs', value: 5 },
        { label: 'Points Delivered', value: 38 },
      ],
    },
  },
  '1': {
    sprintId: '1',
    title: 'Viewer Scaffold',
    planning: { overview: 'Create React/Vite viewer app with warm palette design system. Port primitives from FitnessAiManager, build Layout + routing, DashboardPage, and DesignSystemPage.' },
    retrospective: {
      completedAt: '2026-03-09',
      highlights: ['Warm palette design tokens', 'Card/Badge/Button primitives ported', 'Dashboard with animated counters'],
      challenges: ['Adapting RTL design system for LTR viewer'],
      keyMetrics: [
        { label: 'Components Ported', value: 4 },
        { label: 'Pages Created', value: 2 },
        { label: 'Points Delivered', value: 33 },
      ],
    },
  },
  '2': {
    sprintId: '2',
    title: 'Content Pages',
    planning: { overview: 'Build DocsPage (markdown rendering), SpecsPage, BacklogPage, and static data layer for all content.' },
    retrospective: {
      completedAt: '2026-03-09',
      highlights: ['Markdown rendering with frontmatter', 'Backlog table with status badges', 'Static data layer pattern established'],
      challenges: ['Large markdown files needed chunking strategy'],
      keyMetrics: [
        { label: 'Pages Created', value: 3 },
        { label: 'Data Files', value: 4 },
        { label: 'Points Delivered', value: 32 },
      ],
    },
  },
  '3': {
    sprintId: '3',
    title: 'Advanced Pages',
    planning: { overview: 'Build SkillsPage, EnvironmentsPage, chart components (AnimatedCounter, ProgressRing), and environments data.' },
    retrospective: {
      completedAt: '2026-03-09',
      highlights: ['ProgressRing + AnimatedCounter charts', 'Skills page with syntax highlighting', 'Environment comparison cards'],
      challenges: ['SVG chart animations needed careful tuning'],
      keyMetrics: [
        { label: 'Chart Components', value: 2 },
        { label: 'Pages Created', value: 2 },
        { label: 'Points Delivered', value: 32 },
      ],
    },
  },
  '4': {
    sprintId: '4',
    title: 'CLI + QUICKSTART',
    planning: { overview: 'Update CLI viewer generator for warm palette, update skills templates for orchestrator pattern, rewrite QUICKSTART.md Section 7.' },
    retrospective: {
      completedAt: '2026-03-09',
      highlights: ['CLI generates warm palette viewers', 'Orchestrator pattern in skills', 'QUICKSTART fully updated'],
      challenges: ['Generator template complexity'],
      keyMetrics: [
        { label: 'Templates Updated', value: 3 },
        { label: 'Points Delivered', value: 26 },
      ],
    },
  },
  '5': {
    sprintId: '5',
    title: 'Polish + Launch',
    planning: { overview: 'Self-referential docs copy, GitHub Actions CI/CD, npm publish dry-run, deployment docs, final cleanup.' },
    retrospective: {
      completedAt: '2026-03-09',
      highlights: ['GitHub Pages deployment live', 'CI pipeline green', 'Self-referential docs in viewer'],
      challenges: ['GitHub Pages base path configuration'],
      keyMetrics: [
        { label: 'Workflows Created', value: 2 },
        { label: 'Points Delivered', value: 26 },
      ],
    },
  },
  '6': {
    sprintId: '6',
    title: 'Multi-Agent Orchestration',
    planning: {
      overview: 'Multi-agent orchestration engine: phase type system, 6 agent profiles (Claude, Gemini, Copilot, OpenCode, Cline, Continue), state management, phase sequencing, CLI integration. Planned via 6-phase expert analysis with Architect + HX Expert parallel analysis, PM-A draft (24 tickets, 67pts), PM-B adversarial review (10 issues found), PM-C final synthesis (12 tickets, 38pts).',
      flowSteps: [
        { id: 'start', label: 'User Goal', type: 'start', status: 'complete' },
        { id: 'analyze', label: 'Read Backlog + Docs', type: 'process', status: 'complete' },
        { id: 'experts', label: 'Expert Analysis', type: 'parallel', status: 'complete' },
        { id: 'draft', label: 'PM-A Draft Plan', type: 'process', status: 'complete' },
        { id: 'review', label: 'Adversarial Review', type: 'decision', status: 'complete' },
        { id: 'synthesize', label: 'Final Synthesis', type: 'process', status: 'complete' },
        { id: 'validate', label: 'Format Validation', type: 'validation', status: 'complete' },
        { id: 'approve', label: 'User Approval', type: 'decision', status: 'complete' },
        { id: 'end', label: 'Sprint Committed', type: 'end', status: 'complete' },
      ],
      flowConnections: [
        { from: 'start', to: 'analyze' },
        { from: 'analyze', to: 'experts' },
        { from: 'experts', to: 'draft' },
        { from: 'draft', to: 'review' },
        { from: 'review', to: 'synthesize', label: 'Pass', condition: 'yes' },
        { from: 'review', to: 'draft', label: 'Rework', condition: 'retry' },
        { from: 'synthesize', to: 'validate' },
        { from: 'validate', to: 'approve' },
        { from: 'approve', to: 'end', label: 'Approved', condition: 'yes' },
        { from: 'approve', to: 'review', label: 'Rejected', condition: 'no' },
      ],
      dependencyGraph: {
        nodes: [
          { id: '6.1', label: 'Phase Types', x: 40, y: 20, owner: 'Backend', points: 2, status: 'todo', description: 'Define phase type system: foundation, scaffold, content, polish, qa with ordering + dependency rules' },
          { id: '6.2', label: 'Agent Schema', x: 270, y: 20, owner: 'Backend', points: 2, status: 'todo', description: 'Define agent type enum + base AgentProfile interface' },
          { id: '6.3', label: 'Config Extension', x: 155, y: 100, owner: 'Backend', points: 3, status: 'todo', description: 'Extend .autospecrc.json with agents, phases, orchestration sections' },
          { id: '6.4', label: '6 Agent Profiles', x: 430, y: 100, owner: 'Backend', points: 5, status: 'todo', description: 'Create Claude, Copilot, Gemini, Cline, Continue, Windsurf profiles + registry' },
          { id: '6.5', label: 'Auto-Detection', x: 560, y: 190, owner: 'Backend', points: 3, status: 'todo', description: 'Auto-detect active AI environment from process/env signals' },
          { id: '6.6', label: 'State Manager', x: 40, y: 190, owner: 'Backend', points: 5, status: 'todo', description: 'Track phase progress, file hashes, completion status. Atomic writes.' },
          { id: '6.7', label: 'Validators', x: 200, y: 190, owner: 'Backend', points: 3, status: 'todo', description: 'Pre/post-condition checks per phase type' },
          { id: '6.8', label: 'Cross-Ref Check', x: 40, y: 280, owner: 'Backend', points: 3, status: 'todo', description: 'Verify backlog <-> docs <-> sprint summary linkage' },
          { id: '6.9', label: 'Sequencer', x: 270, y: 280, owner: 'Backend', points: 5, status: 'todo', description: 'Resolve phase ordering, dependency graph, parallel-safe detection' },
          { id: '6.10', label: 'Generate Cmd', x: 480, y: 280, owner: 'Backend', points: 3, status: 'todo', description: 'autospec generate command — wraps generators behind sequencer' },
          { id: '6.11', label: 'Init Resume', x: 130, y: 280, owner: 'Backend', points: 3, status: 'todo', description: 'Update autospec init to resume from partial state' },
          { id: '6.12', label: 'Docs + Summary', x: 620, y: 280, owner: 'PM', points: 1, status: 'todo', description: 'Sprint 6 summary + documentation update' },
        ],
        edges: [
          { from: '6.1', to: '6.3' },
          { from: '6.2', to: '6.3' },
          { from: '6.2', to: '6.4' },
          { from: '6.4', to: '6.5' },
          { from: '6.1', to: '6.6' },
          { from: '6.1', to: '6.7' },
          { from: '6.6', to: '6.7' },
          { from: '6.6', to: '6.8' },
          { from: '6.6', to: '6.11' },
          { from: '6.1', to: '6.9' },
          { from: '6.6', to: '6.9' },
          { from: '6.7', to: '6.9' },
          { from: '6.4', to: '6.10' },
          { from: '6.9', to: '6.10' },
        ],
      },
      sequenceDiagram: {
        actors: [
          { id: 'user', label: 'User', color: '#574b3b', icon: '👤' },
          { id: 'orchestrator', label: 'Orchestrator', color: '#698472', icon: '🎯' },
          { id: 'architect', label: 'Architect', color: '#8e6a59', icon: '🏗' },
          { id: 'hx', label: 'HX Expert', color: '#b08a79', icon: '🧠' },
          { id: 'pma', label: 'PM-A', color: '#7a9488', icon: '📋' },
          { id: 'pmb', label: 'PM-B', color: '#a08c72', icon: '🔍' },
          { id: 'pmc', label: 'PM-C', color: '#698472', icon: '✅' },
        ],
        messages: [
          { from: 'user', to: 'orchestrator', label: '/plan-sprint "goal"', type: 'sync', description: 'User invokes plan-sprint with feature goal' },
          { from: 'orchestrator', to: 'orchestrator', label: 'Read backlog + docs', type: 'self', description: 'Analyze goal, determine next sprint number, select experts' },
          { from: 'orchestrator', to: 'architect', label: 'Analyze architecture', type: 'async', description: 'Phase 2: parallel expert launch' },
          { from: 'orchestrator', to: 'hx', label: 'Analyze user experience', type: 'async', description: 'Phase 2: parallel expert launch' },
          { from: 'architect', to: 'orchestrator', label: 'System impact report', type: 'return', description: 'API design, file structure, risks, complexity estimate' },
          { from: 'hx', to: 'orchestrator', label: 'UX analysis report', type: 'return', description: 'Personas, journeys, error recovery, success metrics' },
          { from: 'orchestrator', to: 'pma', label: 'Draft sprint plan', type: 'sync', description: 'Phase 3: synthesize all expert analyses into draft' },
          { from: 'pma', to: 'orchestrator', label: 'Draft: 12 tickets, 38 pts', type: 'return', description: 'Complete draft with phases, QA plan, docs impact' },
          { from: 'orchestrator', to: 'pmb', label: 'Adversarial review', type: 'sync', description: 'Phase 4: review against 8-point checklist' },
          { from: 'pmb', to: 'orchestrator', label: '10 issues, 5 recommendations', type: 'return', description: 'Completeness, granularity, FinOps, QA coverage gaps' },
          { from: 'orchestrator', to: 'pmc', label: 'Final synthesis', type: 'sync', description: 'Phase 5: merge draft + review, validate format' },
          { from: 'pmc', to: 'orchestrator', label: 'Final plan: 38 pts', type: 'return', description: 'Production-ready sprint plan matching backlog format' },
          { from: 'orchestrator', to: 'user', label: 'Present plan for approval', type: 'sync', description: 'Phase 6: show summary + ask to commit to backlog' },
        ],
        activationBars: [
          { actor: 'orchestrator', startMsg: 0, endMsg: 12 },
          { actor: 'architect', startMsg: 2, endMsg: 4 },
          { actor: 'hx', startMsg: 3, endMsg: 5 },
          { actor: 'pma', startMsg: 6, endMsg: 7 },
          { actor: 'pmb', startMsg: 8, endMsg: 9 },
          { actor: 'pmc', startMsg: 10, endMsg: 11 },
        ],
      },
    },
    retrospective: {
      completedAt: '',
      timeline: {
        phases: [
          { id: 'types', label: 'Types & Config', startCol: 0, span: 1, row: 0, status: 'planned', tickets: ['6.1', '6.2', '6.3'] },
          { id: 'agents', label: 'Agent Profiles', startCol: 1, span: 1, row: 0, status: 'planned', tickets: ['6.4', '6.5'] },
          { id: 'state', label: 'State + Validation', startCol: 1, span: 2, row: 1, status: 'planned', tickets: ['6.6', '6.7', '6.8'] },
          { id: 'engine', label: 'Sequencing Engine', startCol: 3, span: 1, row: 0, status: 'planned', tickets: ['6.9'] },
          { id: 'cli', label: 'CLI Commands', startCol: 3, span: 1, row: 1, status: 'planned', tickets: ['6.10', '6.11'] },
          { id: 'docs', label: 'Docs & Summary', startCol: 4, span: 1, row: 0, status: 'planned', tickets: ['6.12'] },
        ],
        milestones: [
          { col: 2, label: 'State API stable', icon: '🔒' },
          { col: 4, label: 'Sprint complete', icon: '🚀' },
        ],
        columns: ['Phase 1', 'Phase 2', 'Phase 3', 'Phase 4', 'Phase 5'],
        totalRows: 2,
      },
      agentRadar: {
        agents: [
          { id: 'claude', name: 'Claude Code', color: '#698472', values: { context: 80, output: 75, subagents: 95, streaming: 90, resume: 95, isolation: 90 } },
          { id: 'gemini', name: 'Gemini CLI', color: '#4285f4', values: { context: 100, output: 95, subagents: 20, streaming: 60, resume: 15, isolation: 30 } },
          { id: 'copilot', name: 'GitHub Copilot', color: '#000000', values: { context: 40, output: 25, subagents: 10, streaming: 30, resume: 10, isolation: 15 } },
          { id: 'opencode', name: 'OpenCode', color: '#f59e0b', values: { context: 60, output: 55, subagents: 35, streaming: 40, resume: 20, isolation: 30 } },
          { id: 'cline', name: 'Cline', color: '#8b5cf6', values: { context: 70, output: 60, subagents: 15, streaming: 50, resume: 15, isolation: 25 } },
          { id: 'continue', name: 'Continue', color: '#ef4444', values: { context: 55, output: 50, subagents: 10, streaming: 35, resume: 20, isolation: 60 } },
        ],
        axes: [
          { key: 'context', label: 'Context' },
          { key: 'output', label: 'Output' },
          { key: 'subagents', label: 'Subagents' },
          { key: 'streaming', label: 'Streaming' },
          { key: 'resume', label: 'Resume' },
          { key: 'isolation', label: 'Isolation' },
        ],
      },
      keyMetrics: [
        { label: 'Total Points', value: 38 },
        { label: 'Tickets', value: 12 },
        { label: 'Agent Profiles', value: 6 },
        { label: 'Phase Types', value: 5 },
      ],
    },
  },
  '10': {
    sprintId: '10',
    title: 'README + GitHub Pages',
    planning: { overview: 'Switch presentation to HashRouter, update Vite base paths, rewrite GitHub Pages workflow for combined deploy, update README with live demo links.' },
    retrospective: {
      completedAt: '2026-03-09',
      highlights: ['Combined viewer + presentation deploy', 'HashRouter for GitHub Pages compatibility', 'Live demo links in README'],
      challenges: ['Base path coordination between viewer and presentation'],
      keyMetrics: [
        { label: 'Points Delivered', value: 10 },
      ],
    },
  },
  '11': {
    sprintId: '11',
    title: 'Presentation Expansion',
    planning: { overview: 'Expand presentation to 18 slides with methodology content: Sprint Lifecycle, Orchestrator, QA Methodology, Sprint Summary, Skills/Environments, Viewer, and FinOps slides. Add 3 new landing page sections.' },
    retrospective: {
      completedAt: '2026-03-10',
      highlights: ['18 slides with full EN+HE support', '3 new landing sections', 'Mobile progress dots fixed'],
      challenges: ['Mobile layout for 18 progress dots'],
      keyMetrics: [
        { label: 'New Slides', value: 7 },
        { label: 'Landing Sections', value: 3 },
        { label: 'Points Delivered', value: 58 },
      ],
    },
  },
  '12A': {
    sprintId: '12A',
    title: 'Presentation Evolution Narrative',
    planning: { overview: '27-slide presentation with evolution narrative: 4 eras of software development, context poisoning, reverse-engineering tax, breaking point, bridge to SDD, docs folder structure, model optimization, before/after comparison.' },
    retrospective: {
      completedAt: '2026-03-10',
      highlights: ['27-slide evolution story', '10 new narrative slides', 'Final tagline slide'],
      challenges: ['Maintaining coherent narrative arc across 27 slides'],
      keyMetrics: [
        { label: 'Total Slides', value: 27 },
        { label: 'New Slides', value: 10 },
        { label: 'Points Delivered', value: 55 },
      ],
    },
  },
  '12B': {
    sprintId: '12B',
    title: 'Landing Page Evolution',
    planning: { overview: 'Add evolution narrative to landing page: 4-era timeline section, before/after comparison section, enhanced Sprint Memory section with reverse-engineering tax.' },
    retrospective: {
      completedAt: '2026-03-10',
      highlights: ['EvolutionSection with 4-era timeline', 'BeforeAfterSection comparison', 'Enhanced SprintMemorySection'],
      challenges: ['Consistent visual language between presentation and landing'],
      keyMetrics: [
        { label: 'New Sections', value: 2 },
        { label: 'Points Delivered', value: 14 },
      ],
    },
  },
  '13A': {
    sprintId: '13A',
    title: 'Presentation Deep Rework (Data)',
    planning: { overview: '29-slide presentation deep rework: new data layer with slide sequence, premium TitleSlide animations, SDDMethodologySlide, reworked SolutionSlide with SDD reframe, TicketExecutionSlide.' },
    retrospective: {
      completedAt: '2026-03-10',
      highlights: ['Premium title animations', 'SDD methodology slide', 'Ticket execution slide'],
      challenges: ['Coordinating data layer changes across EN+HE'],
      keyMetrics: [
        { label: 'Total Slides', value: 29 },
        { label: 'New Slides', value: 2 },
        { label: 'Points Delivered', value: 30 },
      ],
    },
  },
  '13B': {
    sprintId: '13B',
    title: 'Presentation Deep Rework (Components)',
    planning: { overview: 'Component reworks: 7-phase WorkflowSlide pipeline, RolesSlide with role-not-agent swim lanes, EnvironmentProofSlide, OrchestratorSlide PM role update. Wire 3 new slides, remove 1.' },
    retrospective: {
      completedAt: '2026-03-10',
      highlights: ['7-phase workflow pipeline', 'Role vs Agent distinction', 'Environment proof slide'],
      challenges: ['Swim lane layout complexity'],
      keyMetrics: [
        { label: 'Reworked Slides', value: 4 },
        { label: 'Points Delivered', value: 24 },
      ],
    },
  },
  '14': {
    sprintId: '14',
    title: 'SDD Deepening + Future Vision',
    planning: { overview: '32-slide presentation: fix TitleSlide navigation, ContextPoisoning overflow, add SDDCostOfChaos, SDDThreePillars, FutureWaterfall, FutureMonolith slides. Rework SolutionSlide with capabilities.' },
    retrospective: {
      completedAt: '2026-03-10',
      highlights: ['32 slides EN+HE', '4 new vision slides', 'Navigation bugs fixed'],
      challenges: ['ContextPoisoning card overflow on smaller viewports'],
      keyMetrics: [
        { label: 'Total Slides', value: 32 },
        { label: 'New Slides', value: 4 },
        { label: 'Bugs Fixed', value: 2 },
        { label: 'Points Delivered', value: 32 },
      ],
    },
  },
  '15': {
    sprintId: '15',
    title: 'Viewer Overhaul',
    planning: {
      overview: 'Complete viewer overhaul: generic sprint pages, collapsible sidebar, derived dashboard, expert review. 20 tickets across 3 sub-sprints (15A/B/C).',
      flowSteps: [
        { id: 'start', label: 'Sprint 15 Plan', type: 'start', status: 'complete' },
        { id: 'data', label: 'Data Layer + Types', type: 'process', status: 'complete' },
        { id: 'page', label: 'Generic SprintPage', type: 'process', status: 'complete' },
        { id: 'sidebar', label: 'Sidebar Redesign', type: 'process', status: 'complete' },
        { id: 'dashboard', label: 'Dashboard Derived', type: 'process', status: 'complete' },
        { id: 'review', label: 'Expert Review', type: 'decision', status: 'complete' },
        { id: 'fixes', label: 'Fix Findings', type: 'process', status: 'complete' },
        { id: 'end', label: 'Sprint Complete', type: 'end', status: 'complete' },
      ],
      flowConnections: [
        { from: 'start', to: 'data' },
        { from: 'data', to: 'page' },
        { from: 'page', to: 'sidebar' },
        { from: 'sidebar', to: 'dashboard' },
        { from: 'dashboard', to: 'review' },
        { from: 'review', to: 'fixes', label: 'Issues Found', condition: 'yes' },
        { from: 'review', to: 'end', label: 'All Clear', condition: 'skip' },
        { from: 'fixes', to: 'end' },
      ],
    },
    retrospective: {
      completedAt: '2026-03-10',
      highlights: [
        'Generic SprintPage replaces hardcoded Sprint6Page — all 14+ sprints navigable',
        'All 5 diagram components now actively used (FlowDiagram was unused before)',
        'Dashboard KPIs auto-derived from backlog data — no more manual updates',
        'Playwright expert review: 0 critical, 0 moderate, 0 minor findings',
        'Collapsible sidebar with all sprints + status indicators',
      ],
      challenges: [
        'Extracting Sprint6Page inline data into reusable data structures',
        'TypeScript DOM types in Playwright review script (switched to JS)',
      ],
      keyMetrics: [
        { label: 'Tickets', value: 20 },
        { label: 'Points', value: 81 },
        { label: 'Diagrams Used', value: 5 },
        { label: 'Review Findings', value: 0 },
      ],
    },
  },
}
