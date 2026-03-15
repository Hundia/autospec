export type TicketStatus = 'done' | 'in-progress' | 'todo' | 'blocked' | 'qa'

export interface Ticket {
  id: string
  title: string
  points: number
  status: TicketStatus
  owner: string
  dependencies: string[]
}

export interface Sprint {
  number: number
  name: string
  theme: string
  status: TicketStatus
  totalPoints: number
  tickets: Ticket[]
}

export const backlogData: Sprint[] = [
  {
    number: 0,
    name: 'Sprint 0',
    theme: 'Foundation',
    status: 'done',
    totalPoints: 23,
    tickets: [
      { id: '0.1', title: 'docker-compose.yml with PostgreSQL', points: 2, status: 'done', owner: 'DevOps', dependencies: [] },
      { id: '0.2', title: 'Initialize Express + TypeScript backend', points: 3, status: 'done', owner: 'Backend', dependencies: ['0.1'] },
      { id: '0.3', title: 'Drizzle ORM setup + schema', points: 3, status: 'done', owner: 'DB', dependencies: ['0.1'] },
      { id: '0.4', title: 'Zod env validation + config module', points: 1, status: 'done', owner: 'Backend', dependencies: ['0.2'] },
      { id: '0.5', title: 'Health check endpoint', points: 1, status: 'done', owner: 'Backend', dependencies: ['0.2'] },
      { id: '0.6', title: 'Global error middleware', points: 2, status: 'done', owner: 'Backend', dependencies: ['0.2'] },
      { id: '0.7', title: 'Initialize React + Vite + Tailwind frontend', points: 3, status: 'done', owner: 'Frontend', dependencies: [] },
      { id: '0.8', title: 'Atom components + AppLayout', points: 3, status: 'done', owner: 'Frontend', dependencies: ['0.7'] },
      { id: '0.9', title: 'Axios API client + auth store skeleton', points: 3, status: 'done', owner: 'Frontend', dependencies: ['0.7'] },
      { id: '0.10', title: 'Sprint 0 summary + docs scaffold', points: 2, status: 'done', owner: 'QA', dependencies: [] },
    ],
  },
  {
    number: 1,
    name: 'Sprint 1',
    theme: 'Recipes + Auth',
    status: 'todo',
    totalPoints: 29,
    tickets: [
      { id: '1.1', title: 'Auth endpoints (register, login, refresh, logout)', points: 5, status: 'todo', owner: 'Backend', dependencies: ['0.3', '0.6'] },
      { id: '1.2', title: 'JWT auth middleware', points: 2, status: 'todo', owner: 'Backend', dependencies: ['1.1'] },
      { id: '1.3', title: 'Recipe CRUD endpoints', points: 5, status: 'todo', owner: 'Backend', dependencies: ['1.2'] },
      { id: '1.4', title: 'Ingredient endpoints', points: 2, status: 'todo', owner: 'Backend', dependencies: ['1.2'] },
      { id: '1.5', title: 'Login + Register pages', points: 3, status: 'todo', owner: 'Frontend', dependencies: ['0.9', '1.1'] },
      { id: '1.6', title: 'Recipe list page + filters', points: 5, status: 'todo', owner: 'Frontend', dependencies: ['0.8', '1.3'] },
      { id: '1.7', title: 'Recipe detail page with scaling', points: 3, status: 'todo', owner: 'Frontend', dependencies: ['1.6'] },
      { id: '1.8', title: 'Create + Edit recipe form', points: 5, status: 'todo', owner: 'Frontend', dependencies: ['1.6', '1.4'] },
      { id: '1.9', title: 'Unit + integration tests (Sprint 1)', points: 3, status: 'todo', owner: 'QA', dependencies: [] },
      { id: '1.10', title: 'Sprint 1 summary + docs update', points: 2, status: 'todo', owner: 'QA', dependencies: ['1.9'] },
    ],
  },
  {
    number: 2,
    name: 'Sprint 2',
    theme: 'Meal Planning + Shopping Lists',
    status: 'todo',
    totalPoints: 23,
    tickets: [
      { id: '2.1', title: 'Meal plan CRUD endpoints', points: 5, status: 'todo', owner: 'Backend', dependencies: ['1.2'] },
      { id: '2.2', title: 'Meal plan entry endpoints', points: 3, status: 'todo', owner: 'Backend', dependencies: ['2.1'] },
      { id: '2.3', title: 'Shopping list generation endpoint', points: 5, status: 'todo', owner: 'Backend', dependencies: ['2.2'] },
      { id: '2.4', title: 'Meal plan list + calendar page', points: 5, status: 'todo', owner: 'Frontend', dependencies: ['0.8', '2.1', '2.2'] },
      { id: '2.5', title: 'Shopping list page', points: 3, status: 'todo', owner: 'Frontend', dependencies: ['2.3', '0.8'] },
      { id: '2.6', title: 'Unit + integration tests (Sprint 2)', points: 5, status: 'todo', owner: 'QA', dependencies: [] },
      { id: '2.7', title: 'Database seed script', points: 2, status: 'todo', owner: 'DB', dependencies: ['0.3'] },
      { id: '2.8', title: 'Sprint 2 summary + docs final', points: 2, status: 'todo', owner: 'QA', dependencies: ['2.6'] },
    ],
  },
]
