export interface SpecEntry {
  slug: string
  number: string
  title: string
  owner: string
  description: string
}

export const specsManifest: SpecEntry[] = [
  {
    slug: '01_product_manager',
    number: '01',
    title: 'Product Manager',
    owner: 'PM',
    description: 'Vision, personas, problem statement, user stories, MoSCoW priorities',
  },
  {
    slug: '02_backend_lead',
    number: '02',
    title: 'Backend Lead',
    owner: 'Backend',
    description: 'Express + TypeScript architecture, REST endpoints, middleware, error handling',
  },
  {
    slug: '03_frontend_lead',
    number: '03',
    title: 'Frontend Lead',
    owner: 'Frontend',
    description: 'React 18 + Vite + Tailwind, component hierarchy, state management, routing',
  },
  {
    slug: '04_db_architect',
    number: '04',
    title: 'Database Architect',
    owner: 'DB',
    description: 'PostgreSQL + Drizzle ORM, 6 tables, ERD, indexes, seed data',
  },
  {
    slug: '05_qa_lead',
    number: '05',
    title: 'QA Lead',
    owner: 'QA',
    description: 'Test pyramid (unit/integration/E2E), Vitest + Supertest, 70% coverage target',
  },
]
