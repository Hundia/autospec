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
    status: 'in-progress',
    totalPoints: 32,
    tickets: [
      { id: '2.1', title: 'DocsPage', owner: 'Frontend', points: 13, status: 'in-progress', dependencies: [] },
      { id: '2.2', title: 'SpecsPage', owner: 'Frontend', points: 8, status: 'todo', dependencies: [] },
      { id: '2.3', title: 'BacklogPage', owner: 'Frontend', points: 8, status: 'todo', dependencies: [] },
      { id: '2.4', title: 'Static data layer', owner: 'Frontend', points: 5, status: 'todo', dependencies: [] },
      { id: '2.5', title: 'docs/viewer/04_pages.md', owner: 'Docs', points: 3, status: 'todo', dependencies: [] },
    ],
  },
  {
    number: '3',
    name: 'Sprint 3',
    theme: 'Advanced Pages',
    status: 'todo',
    totalPoints: 32,
    tickets: [
      { id: '3.1', title: 'SkillsPage', owner: 'Frontend', points: 8, status: 'todo', dependencies: [] },
      { id: '3.2', title: 'EnvironmentsPage', owner: 'Frontend', points: 8, status: 'todo', dependencies: [] },
      { id: '3.3', title: 'Chart components', owner: 'UI', points: 8, status: 'todo', dependencies: [] },
      { id: '3.4', title: 'environments.json', owner: 'Frontend', points: 5, status: 'todo', dependencies: [] },
      { id: '3.5', title: 'docs update', owner: 'Docs', points: 3, status: 'todo', dependencies: [] },
    ],
  },
  {
    number: '4',
    name: 'Sprint 4',
    theme: 'CLI + QUICKSTART',
    status: 'todo',
    totalPoints: 26,
    tickets: [
      { id: '4.1', title: 'viewer-prompt.generator.ts warm palette', owner: 'Backend', points: 8, status: 'todo', dependencies: [] },
      { id: '4.2', title: 'Skills templates orchestrator pattern', owner: 'Backend', points: 5, status: 'todo', dependencies: [] },
      { id: '4.3', title: 'QUICKSTART.md Section 7 rewrite', owner: 'Docs', points: 8, status: 'todo', dependencies: [] },
      { id: '4.4', title: 'docs/cli/viewer_generator.md', owner: 'Docs', points: 5, status: 'todo', dependencies: [] },
    ],
  },
  {
    number: '5',
    name: 'Sprint 5',
    theme: 'Polish + Launch',
    status: 'todo',
    totalPoints: 26,
    tickets: [
      { id: '5.1', title: 'viewer/src/data/docs/ copy', owner: 'Frontend', points: 5, status: 'todo', dependencies: [] },
      { id: '5.2', title: 'GitHub Actions ci.yml + pages.yml', owner: 'DevOps', points: 8, status: 'todo', dependencies: [] },
      { id: '5.3', title: 'npm publish --dry-run', owner: 'DevOps', points: 5, status: 'todo', dependencies: [] },
      { id: '5.4', title: 'docs/deployment/github_pages.md', owner: 'Docs', points: 3, status: 'todo', dependencies: [] },
      { id: '5.5', title: 'Sprint 5 summary + cleanup', owner: 'PM', points: 5, status: 'todo', dependencies: [] },
    ],
  },
]
