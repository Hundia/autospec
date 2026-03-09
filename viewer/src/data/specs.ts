export interface SpecEntry {
  slug: string
  number: string
  title: string
  owner: string
  description: string
}

export const specsManifest: SpecEntry[] = [
  { slug: '01_product_manager', number: '01', title: 'Product Manager', owner: 'PM', description: 'Vision, personas, MoSCoW, user stories' },
  { slug: '02_backend_lead', number: '02', title: 'Backend Lead', owner: 'Backend', description: 'CLI architecture, generators, parsers, tsup' },
  { slug: '03_frontend_lead', number: '03', title: 'Frontend Lead', owner: 'Frontend', description: 'Viewer architecture, React 18, Vite, Tailwind, 7 pages' },
  { slug: '04_db_architect', number: '04', title: 'Database Architect', owner: 'DB', description: 'File-based DB, backlog.json schema, environments.json' },
  { slug: '05_qa_lead', number: '05', title: 'QA Lead', owner: 'QA', description: 'Vitest 80% coverage, Playwright TC-01→TC-08' },
  { slug: '06_devops_lead', number: '06', title: 'DevOps Lead', owner: 'DevOps', description: 'NPM publish, GitHub Actions CI/release/pages' },
  { slug: '07_marketing_lead', number: '07', title: 'Marketing Lead', owner: 'Marketing', description: 'OSS positioning, Product Hunt, Show HN' },
  { slug: '08_finance_lead', number: '08', title: 'Finance Lead', owner: 'Finance', description: 'Free/MIT, GitHub free tier, sponsorship' },
  { slug: '09_business_lead', number: '09', title: 'Business Lead', owner: 'Business', description: 'Market analysis, differentiators vs Cursor/Copilot' },
  { slug: '10_ui_designer', number: '10', title: 'UI Designer', owner: 'Design', description: 'Warm palette, 7 pages wireframed, component inventory' },
]
