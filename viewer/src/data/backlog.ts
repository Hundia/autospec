export type TicketStatus = 'todo' | 'in-progress' | 'qa' | 'done' | 'blocked'

export interface Ticket {
  id: string
  title: string
  owner: string
  points: number
  status: TicketStatus
  dependencies: string[]
}

export interface Sprint {
  number: string
  name: string
  theme: string
  status: TicketStatus
  totalPoints: number
  tickets: Ticket[]
}

export const backlogData: Sprint[] = [
  {
    number: '0',
    name: 'Sprint 0',
    theme: 'SDD Foundation',
    status: 'done',
    totalPoints: 38,
    tickets: [
      { id: '0.1', title: 'Copy 10 skills → .claude/commands/', owner: 'DevOps', points: 2, status: 'done', dependencies: [] },
      { id: '0.2', title: 'Create autospec/CLAUDE.md', owner: 'PM', points: 5, status: 'done', dependencies: [] },
      { id: '0.3', title: 'Create specs/ — 10 role spec files', owner: 'PM', points: 13, status: 'done', dependencies: [] },
      { id: '0.4', title: 'Create specs/backlog.md', owner: 'PM', points: 8, status: 'done', dependencies: ['0.3'] },
      { id: '0.5', title: 'Update sprint-run.md + execute-ticket.md', owner: 'PM', points: 3, status: 'done', dependencies: [] },
      { id: '0.6', title: 'Create agents/sprint-1–5-brief.md', owner: 'PM', points: 5, status: 'done', dependencies: ['0.4'] },
      { id: '0.7', title: 'Create docs/methodology/10_orchestrator_agent_pattern.md', owner: 'Docs', points: 3, status: 'done', dependencies: [] },
      { id: '0.8', title: 'Create sprints/sprint-0/summary.md', owner: 'PM', points: 2, status: 'done', dependencies: [] },
    ],
  },
  {
    number: '1',
    name: 'Sprint 1',
    theme: 'Viewer Scaffold',
    status: 'done',
    totalPoints: 33,
    tickets: [
      { id: '1.1', title: 'Viewer scaffold', owner: 'Frontend', points: 5, status: 'done', dependencies: [] },
      { id: '1.2', title: 'FitnessAiManager design tokens', owner: 'UI', points: 3, status: 'done', dependencies: ['1.1'] },
      { id: '1.3', title: 'Port primitives', owner: 'UI', points: 8, status: 'done', dependencies: ['1.2'] },
      { id: '1.4', title: 'Layout + routing', owner: 'Frontend', points: 5, status: 'done', dependencies: ['1.3'] },
      { id: '1.5', title: 'DashboardPage', owner: 'Frontend', points: 8, status: 'done', dependencies: ['1.4'] },
      { id: '1.6', title: 'DesignSystemPage', owner: 'UI', points: 5, status: 'done', dependencies: ['1.3'] },
      { id: '1.7', title: 'docs/viewer/01+02', owner: 'Docs', points: 3, status: 'done', dependencies: ['1.4'] },
    ],
  },
  {
    number: '2',
    name: 'Sprint 2',
    theme: 'Content Pages',
    status: 'done',
    totalPoints: 32,
    tickets: [
      { id: '2.1', title: 'DocsPage', owner: 'Frontend', points: 13, status: 'done', dependencies: [] },
      { id: '2.2', title: 'SpecsPage', owner: 'Frontend', points: 8, status: 'done', dependencies: [] },
      { id: '2.3', title: 'BacklogPage', owner: 'Frontend', points: 8, status: 'done', dependencies: [] },
      { id: '2.4', title: 'Static data layer', owner: 'Frontend', points: 5, status: 'done', dependencies: [] },
      { id: '2.5', title: 'docs/viewer/04_pages.md', owner: 'Docs', points: 3, status: 'done', dependencies: [] },
    ],
  },
  {
    number: '3',
    name: 'Sprint 3',
    theme: 'Advanced Pages',
    status: 'done',
    totalPoints: 32,
    tickets: [
      { id: '3.1', title: 'SkillsPage', owner: 'Frontend', points: 8, status: 'done', dependencies: [] },
      { id: '3.2', title: 'EnvironmentsPage', owner: 'Frontend', points: 8, status: 'done', dependencies: [] },
      { id: '3.3', title: 'Chart components', owner: 'UI', points: 8, status: 'done', dependencies: [] },
      { id: '3.4', title: 'environments.json', owner: 'Frontend', points: 5, status: 'done', dependencies: [] },
      { id: '3.5', title: 'docs update', owner: 'Docs', points: 3, status: 'done', dependencies: [] },
    ],
  },
  {
    number: '4',
    name: 'Sprint 4',
    theme: 'CLI + QUICKSTART',
    status: 'done',
    totalPoints: 26,
    tickets: [
      { id: '4.1', title: 'viewer-prompt.generator.ts warm palette', owner: 'Backend', points: 8, status: 'done', dependencies: [] },
      { id: '4.2', title: 'Skills templates orchestrator pattern', owner: 'Backend', points: 5, status: 'done', dependencies: [] },
      { id: '4.3', title: 'QUICKSTART.md Section 7 rewrite', owner: 'Docs', points: 8, status: 'done', dependencies: [] },
      { id: '4.4', title: 'docs/cli/viewer_generator.md', owner: 'Docs', points: 5, status: 'done', dependencies: [] },
    ],
  },
  {
    number: '5',
    name: 'Sprint 5',
    theme: 'Polish + Launch',
    status: 'done',
    totalPoints: 26,
    tickets: [
      { id: '5.1', title: 'viewer/src/data/docs/ copy', owner: 'Frontend', points: 5, status: 'done', dependencies: [] },
      { id: '5.2', title: 'GitHub Actions ci.yml + pages.yml', owner: 'DevOps', points: 8, status: 'done', dependencies: [] },
      { id: '5.3', title: 'npm publish --dry-run', owner: 'DevOps', points: 5, status: 'done', dependencies: [] },
      { id: '5.4', title: 'docs/deployment/github_pages.md', owner: 'Docs', points: 3, status: 'done', dependencies: [] },
      { id: '5.5', title: 'Sprint 5 summary + cleanup', owner: 'PM', points: 5, status: 'done', dependencies: [] },
    ],
  },
  {
    number: '6',
    name: 'Sprint 6',
    theme: 'Multi-Agent Orchestration',
    status: 'todo',
    totalPoints: 38,
    tickets: [
      { id: '6.1', title: 'Phase type system', owner: 'Backend', points: 2, status: 'todo', dependencies: [] },
      { id: '6.2', title: 'Agent profile schema', owner: 'Backend', points: 2, status: 'todo', dependencies: [] },
      { id: '6.3', title: 'Config schema extension', owner: 'Backend', points: 3, status: 'todo', dependencies: ['6.1', '6.2'] },
      { id: '6.4', title: '6 agent profiles + registry', owner: 'Backend', points: 5, status: 'todo', dependencies: ['6.2'] },
      { id: '6.5', title: 'Agent auto-detection', owner: 'Backend', points: 3, status: 'todo', dependencies: ['6.4'] },
      { id: '6.6', title: 'State manager', owner: 'Backend', points: 5, status: 'todo', dependencies: ['6.1'] },
      { id: '6.7', title: 'Phase validators', owner: 'Backend', points: 3, status: 'todo', dependencies: ['6.1', '6.6'] },
      { id: '6.8', title: 'Cross-reference validator', owner: 'Backend', points: 3, status: 'todo', dependencies: ['6.6'] },
      { id: '6.9', title: 'Phase sequencing engine', owner: 'Backend', points: 5, status: 'todo', dependencies: ['6.1', '6.6', '6.7'] },
      { id: '6.10', title: 'autospec generate command', owner: 'Backend', points: 3, status: 'todo', dependencies: ['6.4', '6.9'] },
      { id: '6.11', title: 'Init resume from partial state', owner: 'Backend', points: 3, status: 'todo', dependencies: ['6.6'] },
      { id: '6.12', title: 'Sprint 6 summary + docs', owner: 'PM', points: 1, status: 'todo', dependencies: [] },
    ],
  },
  {
    number: '10',
    name: 'Sprint 10',
    theme: 'README Update + GitHub Pages Consolidation',
    status: 'done',
    totalPoints: 10,
    tickets: [
      { id: '10.1', title: 'Switch presentation/ to HashRouter', owner: 'Frontend', points: 1, status: 'done', dependencies: [] },
      { id: '10.2', title: 'Update vite.config.ts base paths', owner: 'Frontend', points: 1, status: 'done', dependencies: [] },
      { id: '10.3', title: 'Rewrite pages.yml for combined deploy', owner: 'DevOps', points: 3, status: 'done', dependencies: [] },
      { id: '10.4', title: 'Add build-presentation CI job', owner: 'DevOps', points: 1, status: 'done', dependencies: [] },
      { id: '10.5', title: 'Update ViewerSection + Navigation links', owner: 'Frontend', points: 2, status: 'done', dependencies: ['10.2'] },
      { id: '10.6', title: 'Update README with live demo links', owner: 'Product', points: 2, status: 'done', dependencies: [] },
    ],
  },
  {
    number: '11',
    name: 'Sprint 11',
    theme: 'Presentation Expansion — Methodology Slides + Landing Enhancements',
    status: 'in-progress',
    totalPoints: 58,
    tickets: [
      { id: '11.1', title: 'Update slides-en.ts with 7 new slide data entries + reorder', owner: 'Frontend', points: 5, status: 'done', dependencies: [] },
      { id: '11.2', title: 'Update slides-he.ts with Hebrew translations', owner: 'Frontend', points: 3, status: 'done', dependencies: ['11.1'] },
      { id: '11.3', title: 'SprintLifecycleSlide.tsx', owner: 'Frontend', points: 3, status: 'done', dependencies: ['11.1'] },
      { id: '11.4', title: 'OrchestratorSlide.tsx', owner: 'Frontend', points: 3, status: 'done', dependencies: ['11.1'] },
      { id: '11.5', title: 'QAMethodologySlide.tsx', owner: 'Frontend', points: 3, status: 'done', dependencies: ['11.1'] },
      { id: '11.6', title: 'SprintSummarySlide.tsx', owner: 'Frontend', points: 3, status: 'done', dependencies: ['11.1'] },
      { id: '11.7', title: 'SkillsEnvironmentsSlide.tsx', owner: 'Frontend', points: 3, status: 'done', dependencies: ['11.1'] },
      { id: '11.8', title: 'ViewerSlide.tsx', owner: 'Frontend', points: 3, status: 'done', dependencies: ['11.1'] },
      { id: '11.9', title: 'FinOpsSlide.tsx', owner: 'Frontend', points: 3, status: 'done', dependencies: ['11.1'] },
      { id: '11.10', title: 'Wire slides into PresentationPage.tsx', owner: 'Frontend', points: 2, status: 'done', dependencies: ['11.3', '11.4', '11.5', '11.6', '11.7', '11.8', '11.9'] },
      { id: '11.11', title: 'OrchestratorSection.tsx for landing', owner: 'Frontend', points: 5, status: 'done', dependencies: [] },
      { id: '11.12', title: 'QASection.tsx for landing', owner: 'Frontend', points: 5, status: 'done', dependencies: [] },
      { id: '11.13', title: 'SprintLifecycleSection.tsx for landing', owner: 'Frontend', points: 5, status: 'done', dependencies: [] },
      { id: '11.14', title: 'Update LandingPage.tsx + StatsSection', owner: 'Frontend', points: 2, status: 'done', dependencies: ['11.11', '11.12', '11.13'] },
      { id: '11.15', title: 'Fix mobile progress dots for 18 slides', owner: 'Frontend', points: 3, status: 'done', dependencies: ['11.10'] },
      { id: '11.16', title: 'Build verification + RTL QA', owner: 'QA', points: 2, status: 'done', dependencies: ['11.14', '11.15'] },
      { id: '11.17', title: 'Sprint summary + docs + slide catalog', owner: 'PM', points: 3, status: 'todo', dependencies: ['11.16'] },
    ],
  },
]
