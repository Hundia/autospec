export type CompatibilityLevel = 'full' | 'partial' | 'none'

export interface EnvironmentTool {
  id: string
  name: string
  shortName: string
  color: string
}

export interface Skill {
  id: string
  name: string
  description: string
}

export const tools: EnvironmentTool[] = [
  { id: 'claude-code', name: 'Claude Code', shortName: 'Claude', color: '#698472' },
  { id: 'cursor', name: 'Cursor', shortName: 'Cursor', color: '#8e6a59' },
  { id: 'copilot', name: 'GitHub Copilot', shortName: 'Copilot', color: '#536a5b' },
  { id: 'windsurf', name: 'Windsurf', shortName: 'Windsurf', color: '#b08a79' },
  { id: 'jetbrains', name: 'JetBrains AI', shortName: 'JetBrains', color: '#a08c72' },
  { id: 'continue', name: 'Continue', shortName: 'Continue', color: '#857358' },
]

export const skills: Skill[] = [
  { id: 'sprint-run', name: 'sprint-run', description: 'Execute full sprint end-to-end' },
  { id: 'execute-ticket', name: 'execute-ticket', description: 'Execute single ticket' },
  { id: 'plan-sprint', name: 'plan-sprint', description: 'Plan sprint from backlog' },
  { id: 'sprint-status', name: 'sprint-status', description: 'Show sprint progress' },
  { id: 'sprint-close', name: 'sprint-close', description: 'Close sprint and summarize' },
  { id: 'update-backlog', name: 'update-backlog', description: 'Update ticket statuses' },
  { id: 'create-spec', name: 'create-spec', description: 'Generate spec from SRS' },
  { id: 'create-sprint-docs', name: 'create-sprint-docs', description: 'Create sprint docs' },
  { id: 'qa-review', name: 'qa-review', description: 'QA verification protocol' },
  { id: 'help', name: 'help', description: 'List all available commands' },
]

// 6 tools × 10 skills compatibility matrix
export const compatibilityMatrix: Record<string, Record<string, CompatibilityLevel>> = {
  'claude-code': {
    'sprint-run': 'full', 'execute-ticket': 'full', 'plan-sprint': 'full',
    'sprint-status': 'full', 'sprint-close': 'full', 'update-backlog': 'full',
    'create-spec': 'full', 'create-sprint-docs': 'full', 'qa-review': 'full', 'help': 'full',
  },
  'cursor': {
    'sprint-run': 'partial', 'execute-ticket': 'full', 'plan-sprint': 'partial',
    'sprint-status': 'partial', 'sprint-close': 'partial', 'update-backlog': 'full',
    'create-spec': 'partial', 'create-sprint-docs': 'partial', 'qa-review': 'partial', 'help': 'none',
  },
  'copilot': {
    'sprint-run': 'none', 'execute-ticket': 'partial', 'plan-sprint': 'none',
    'sprint-status': 'none', 'sprint-close': 'none', 'update-backlog': 'partial',
    'create-spec': 'none', 'create-sprint-docs': 'none', 'qa-review': 'partial', 'help': 'none',
  },
  'windsurf': {
    'sprint-run': 'partial', 'execute-ticket': 'full', 'plan-sprint': 'partial',
    'sprint-status': 'partial', 'sprint-close': 'partial', 'update-backlog': 'full',
    'create-spec': 'partial', 'create-sprint-docs': 'partial', 'qa-review': 'partial', 'help': 'partial',
  },
  'jetbrains': {
    'sprint-run': 'none', 'execute-ticket': 'partial', 'plan-sprint': 'none',
    'sprint-status': 'none', 'sprint-close': 'none', 'update-backlog': 'partial',
    'create-spec': 'partial', 'create-sprint-docs': 'none', 'qa-review': 'partial', 'help': 'none',
  },
  'continue': {
    'sprint-run': 'partial', 'execute-ticket': 'full', 'plan-sprint': 'partial',
    'sprint-status': 'partial', 'sprint-close': 'partial', 'update-backlog': 'full',
    'create-spec': 'partial', 'create-sprint-docs': 'partial', 'qa-review': 'full', 'help': 'full',
  },
}
