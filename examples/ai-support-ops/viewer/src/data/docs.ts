// Static doc manifests — maps sections to files
// Pages will import markdown using ?raw (Vite raw import)

export interface DocEntry {
  slug: string
  title: string
  section: string
}

export const docsManifest: DocEntry[] = [
  // Methodology
  { slug: '01_philosophy', title: 'Philosophy', section: 'methodology' },
  { slug: '02_spec_structure', title: 'Spec Structure', section: 'methodology' },
  { slug: '03_team_roles', title: 'Team Roles', section: 'methodology' },
  { slug: '04_backlog_management', title: 'Backlog Management', section: 'methodology' },
  { slug: '05_multi_agent', title: 'Multi-Agent', section: 'methodology' },
  { slug: '06_qa_methodology', title: 'QA Methodology', section: 'methodology' },
  { slug: '07_model_selection', title: 'Model Selection', section: 'methodology' },
  { slug: '08_test_validation_results', title: 'Test Validation', section: 'methodology' },
  { slug: '09_ground_truth_schema', title: 'Ground Truth Schema', section: 'methodology' },
  { slug: '10_orchestrator_agent_pattern', title: 'Orchestrator Pattern', section: 'methodology' },
  // Viewer
  { slug: '01_architecture', title: 'Architecture', section: 'viewer' },
  { slug: '02_design_system', title: 'Design System', section: 'viewer' },
  // CLI
  { slug: 'orchestration', title: 'Phase Orchestration', section: 'cli' },
  { slug: 'agent_profiles', title: 'Agent Profiles', section: 'cli' },
]

export const sections = ['methodology', 'viewer', 'cli'] as const
export type DocSection = typeof sections[number]

export const sectionLabels: Record<DocSection, string> = {
  methodology: 'Methodology',
  viewer: 'Viewer',
  cli: 'CLI',
}
