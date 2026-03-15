import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../components/primitives/Card'

const techStack = [
  { layer: 'Frontend', tech: 'React 18 + Vite 5 + TypeScript', notes: 'SPA, component-based UI' },
  { layer: 'Styling', tech: 'Tailwind CSS 3', notes: 'Utility-first, brand-500 (#22c55e)' },
  { layer: 'State', tech: 'Zustand 4', notes: 'Auth store, recipe store' },
  { layer: 'HTTP Client', tech: 'Axios 1', notes: 'Interceptors for JWT refresh' },
  { layer: 'Routing', tech: 'React Router 6', notes: 'Client-side routing, protected routes' },
  { layer: 'Backend', tech: 'Express 4 + TypeScript', notes: 'REST API, modular route structure' },
  { layer: 'Validation', tech: 'Zod 3', notes: 'Request body + env validation' },
  { layer: 'Database', tech: 'PostgreSQL 15', notes: '6 tables: users, recipes, ingredients, meal_plans, meal_entries, shopping_lists' },
  { layer: 'ORM', tech: 'Drizzle ORM 0.29', notes: 'Type-safe queries, migration support' },
  { layer: 'Auth', tech: 'JWT + bcrypt', notes: 'Access token 15m, refresh token 7d' },
  { layer: 'Testing', tech: 'Vitest + Supertest', notes: '70% coverage target' },
  { layer: 'Infrastructure', tech: 'Docker Compose', notes: 'PostgreSQL + API + Web services' },
]

const architectureDiagram = `
  Browser
     │
     ▼
  React SPA (Vite)
  ├── /login, /register       ← AuthModule
  ├── /recipes                ← RecipeListPage
  ├── /recipes/:id            ← RecipeDetailPage
  ├── /recipes/new            ← RecipeFormPage
  ├── /meal-plans             ← MealPlanPage (calendar)
  └── /shopping-list          ← ShoppingListPage
     │
     │  Axios + JWT Bearer
     ▼
  Express API
  ├── POST /api/auth/register
  ├── POST /api/auth/login
  ├── POST /api/auth/refresh
  ├── GET  /api/recipes
  ├── POST /api/recipes
  ├── GET  /api/recipes/:id
  ├── PUT  /api/recipes/:id
  ├── DELETE /api/recipes/:id
  ├── GET  /api/ingredients
  ├── GET  /api/meal-plans
  ├── POST /api/meal-plans
  ├── POST /api/meal-plans/:id/entries
  └── GET  /api/shopping-lists/:mealPlanId
     │
     │  Drizzle ORM
     ▼
  PostgreSQL 15
  ├── users
  ├── recipes
  ├── ingredients
  ├── recipe_ingredients (join)
  ├── meal_plans
  ├── meal_entries
  └── shopping_lists
`

export const ArchitecturePage: React.FC = () => {
  return (
    <div className="max-w-5xl space-y-6">
      <div>
        <h2 className="text-2xl font-light text-gray-900">Architecture</h2>
        <p className="text-sm text-gray-500 mt-1">System design and technology decisions for MealMap</p>
      </div>

      {/* Architecture Diagram */}
      <Card>
        <CardHeader>
          <CardTitle>System Diagram</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="text-xs font-mono text-gray-600 bg-gray-50 p-4 rounded-lg overflow-x-auto leading-relaxed whitespace-pre">
            {architectureDiagram}
          </pre>
        </CardContent>
      </Card>

      {/* Tech Stack Table */}
      <Card>
        <CardHeader>
          <CardTitle>Tech Stack</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-700">Layer</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-700">Technology</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-700">Notes</th>
              </tr>
            </thead>
            <tbody>
              {techStack.map((row, i) => (
                <tr key={i} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-2.5 font-medium text-gray-800">{row.layer}</td>
                  <td className="px-4 py-2.5 font-mono text-xs text-brand-700">{row.tech}</td>
                  <td className="px-4 py-2.5 text-gray-500 text-xs">{row.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Key Decisions */}
      <Card>
        <CardHeader>
          <CardTitle>Key Design Decisions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="w-2 h-2 rounded-full bg-brand-500 mt-1.5 flex-shrink-0" />
              <div>
                <div className="text-sm font-medium text-gray-900">Drizzle ORM over Prisma</div>
                <div className="text-sm text-gray-500">Chosen for lighter bundle size, SQL-like API, and better TypeScript inference without code generation.</div>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-2 h-2 rounded-full bg-brand-500 mt-1.5 flex-shrink-0" />
              <div>
                <div className="text-sm font-medium text-gray-900">Zustand over Redux</div>
                <div className="text-sm text-gray-500">Minimal boilerplate for the auth and recipe state. Stores are co-located with their feature.</div>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-2 h-2 rounded-full bg-brand-500 mt-1.5 flex-shrink-0" />
              <div>
                <div className="text-sm font-medium text-gray-900">JWT with refresh token rotation</div>
                <div className="text-sm text-gray-500">Short-lived access tokens (15m) with secure httpOnly cookie for refresh. Axios interceptor handles token refresh transparently.</div>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-2 h-2 rounded-full bg-brand-500 mt-1.5 flex-shrink-0" />
              <div>
                <div className="text-sm font-medium text-gray-900">Shopping list generation as a computed endpoint</div>
                <div className="text-sm text-gray-500">Rather than storing shopping lists, they are generated on-the-fly by aggregating recipe ingredients for a meal plan week.</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
