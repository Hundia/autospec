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
  { slug: '04_pages', title: 'Pages', section: 'viewer' },
  { slug: '05_advanced_pages', title: 'Advanced Pages', section: 'viewer' },
  { slug: '06_quickstart_page', title: 'QuickStart Page', section: 'viewer' },
  // Research (NEW)
  { slug: '01_competitive_analysis', title: 'Competitive Analysis', section: 'research' },
  { slug: '02_provider_architecture', title: 'Provider Architecture', section: 'research' },
  { slug: '03_design_decisions', title: 'Design Decisions', section: 'research' },
  // CLI
  { slug: '01_architecture', title: 'CLI Architecture', section: 'cli' },
  { slug: '02_providers', title: 'LLM Providers', section: 'cli' },
  { slug: '03_generate_pipeline', title: 'Generate Pipeline', section: 'cli' },
  { slug: '04_error_handling', title: 'Error Handling', section: 'cli' },
  { slug: '05_roadmap', title: 'Version Roadmap', section: 'cli' },
  { slug: 'orchestration', title: 'Phase Orchestration', section: 'cli' },
  { slug: 'agent_profiles', title: 'Agent Profiles', section: 'cli' },
  // Pilot
  { slug: '01_overview', title: 'Overview', section: 'pilot' },
  { slug: '02_architecture', title: 'Architecture', section: 'pilot' },
  { slug: '03_approval_flow', title: 'Approval Flow', section: 'pilot' },
  { slug: '04_cli_reference', title: 'CLI Reference', section: 'pilot' },
  { slug: '05_whatsapp_integration', title: 'WhatsApp Integration', section: 'pilot' },
  { slug: '06_workflows', title: 'Workflows & How-To', section: 'pilot' },
  { slug: '07_whatsapp_setup_guide', title: 'WhatsApp Setup Guide', section: 'pilot' },
  { slug: '08_installation_guide', title: 'Installation Guide', section: 'pilot' },
  { slug: '09_skills_reference', title: 'Skills Reference', section: 'pilot' },
]

export const sections = ['methodology', 'viewer', 'research', 'cli', 'pilot'] as const
export type DocSection = typeof sections[number]

export const sectionLabels: Record<DocSection, string> = {
  methodology: 'Methodology',
  viewer: 'Viewer',
  research: 'Research',
  cli: 'CLI',
  pilot: 'Pilot',
}
