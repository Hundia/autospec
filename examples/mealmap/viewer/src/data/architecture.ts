import { FlowStep, FlowConnection } from '../components/diagrams/FlowDiagram'

export interface SystemNode {
  id: string
  label: string
  sublabel?: string
  layer: 'client' | 'api' | 'middleware' | 'data'
  x: number
  y: number
  width: number
  height: number
  icon?: string
  color: string
}

export interface SystemEdge {
  from: string
  to: string
  label?: string
  style?: 'solid' | 'dashed'
}

export interface DBTable {
  name: string
  columns: { name: string; type: string; constraint?: string }[]
  color: string
}

export interface DBRelationship {
  from: string
  to: string
  type: '1:N' | 'N:1' | 'M:N' | '1:1'
  label?: string
  throughTable?: string
}

export const systemNodes: SystemNode[] = [
  { id: 'browser', label: 'Browser', sublabel: 'User Agent', layer: 'client', x: 280, y: 20, width: 140, height: 50, icon: '\u{1F310}', color: '#e5e7eb' },
  { id: 'react', label: 'React SPA', sublabel: 'Vite + Tailwind', layer: 'client', x: 280, y: 100, width: 140, height: 50, icon: '\u269B\uFE0F', color: '#dcfce7' },
  { id: 'axios', label: 'Axios Client', sublabel: 'HTTP + Interceptors', layer: 'client', x: 280, y: 180, width: 140, height: 50, icon: '\u{1F4E1}', color: '#dcfce7' },
  { id: 'express', label: 'Express API', sublabel: 'TypeScript + Zod', layer: 'api', x: 280, y: 280, width: 140, height: 50, icon: '\u{1F682}', color: '#bbf7d0' },
  { id: 'auth-mw', label: 'Auth Middleware', sublabel: 'JWT Verify', layer: 'middleware', x: 100, y: 280, width: 140, height: 50, icon: '\u{1F510}', color: '#fef3c7' },
  { id: 'validate-mw', label: 'Zod Validation', sublabel: 'Schema Check', layer: 'middleware', x: 460, y: 280, width: 140, height: 50, icon: '\u2705', color: '#fef3c7' },
  { id: 'drizzle', label: 'Drizzle ORM', sublabel: 'Type-safe SQL', layer: 'data', x: 280, y: 380, width: 140, height: 50, icon: '\u{1F4A7}', color: '#dbeafe' },
  { id: 'postgres', label: 'PostgreSQL', sublabel: 'v15 + Indexes', layer: 'data', x: 280, y: 460, width: 140, height: 50, icon: '\u{1F418}', color: '#e0e7ff' },
]

export const systemEdges: SystemEdge[] = [
  { from: 'browser', to: 'react', label: 'Renders' },
  { from: 'react', to: 'axios', label: 'API Calls' },
  { from: 'axios', to: 'express', label: 'HTTP/JSON' },
  { from: 'auth-mw', to: 'express', label: 'Guards', style: 'dashed' },
  { from: 'validate-mw', to: 'express', label: 'Validates', style: 'dashed' },
  { from: 'express', to: 'drizzle', label: 'Queries' },
  { from: 'drizzle', to: 'postgres', label: 'SQL' },
]

export const dbTables: DBTable[] = [
  {
    name: 'users',
    color: '#22c55e',
    columns: [
      { name: 'id', type: 'uuid', constraint: 'PK' },
      { name: 'email', type: 'varchar(255)', constraint: 'UNIQUE' },
      { name: 'password_hash', type: 'varchar(255)' },
      { name: 'name', type: 'varchar(100)' },
      { name: 'created_at', type: 'timestamp' },
    ],
  },
  {
    name: 'recipes',
    color: '#16a34a',
    columns: [
      { name: 'id', type: 'uuid', constraint: 'PK' },
      { name: 'user_id', type: 'uuid', constraint: 'FK \u2192 users' },
      { name: 'title', type: 'varchar(200)' },
      { name: 'description', type: 'text' },
      { name: 'prep_time', type: 'int' },
      { name: 'cook_time', type: 'int' },
      { name: 'servings', type: 'int' },
      { name: 'difficulty', type: 'enum' },
    ],
  },
  {
    name: 'ingredients',
    color: '#15803d',
    columns: [
      { name: 'id', type: 'uuid', constraint: 'PK' },
      { name: 'name', type: 'varchar(150)' },
      { name: 'category', type: 'varchar(50)' },
      { name: 'unit', type: 'varchar(20)' },
      { name: 'calories_per_100g', type: 'decimal' },
    ],
  },
  {
    name: 'recipe_ingredients',
    color: '#4ade80',
    columns: [
      { name: 'recipe_id', type: 'uuid', constraint: 'FK \u2192 recipes' },
      { name: 'ingredient_id', type: 'uuid', constraint: 'FK \u2192 ingredients' },
      { name: 'quantity', type: 'decimal' },
      { name: 'unit', type: 'varchar(20)' },
    ],
  },
  {
    name: 'meal_plans',
    color: '#86efac',
    columns: [
      { name: 'id', type: 'uuid', constraint: 'PK' },
      { name: 'user_id', type: 'uuid', constraint: 'FK \u2192 users' },
      { name: 'week_start', type: 'date' },
      { name: 'name', type: 'varchar(100)' },
    ],
  },
  {
    name: 'meal_plan_entries',
    color: '#bbf7d0',
    columns: [
      { name: 'id', type: 'uuid', constraint: 'PK' },
      { name: 'meal_plan_id', type: 'uuid', constraint: 'FK \u2192 meal_plans' },
      { name: 'recipe_id', type: 'uuid', constraint: 'FK \u2192 recipes' },
      { name: 'day_of_week', type: 'int' },
      { name: 'meal_type', type: 'enum' },
    ],
  },
]

export const dbRelationships: DBRelationship[] = [
  { from: 'users', to: 'recipes', type: '1:N', label: 'owns' },
  { from: 'users', to: 'meal_plans', type: '1:N', label: 'creates' },
  { from: 'recipes', to: 'recipe_ingredients', type: '1:N' },
  { from: 'ingredients', to: 'recipe_ingredients', type: '1:N' },
  { from: 'meal_plans', to: 'meal_plan_entries', type: '1:N' },
  { from: 'meal_plan_entries', to: 'recipes', type: 'N:1', label: 'references' },
]

export interface Actor {
  id: string
  label: string
  icon?: string
  color?: string
}

export interface Message {
  from: string
  to: string
  label: string
  type: 'sync' | 'async' | 'return' | 'self'
  description?: string
}

export interface ActivationBar {
  actor: string
  startMsg: number
  endMsg: number
}

export interface SequenceFlow {
  id: string
  title: string
  description: string
  actors: Actor[]
  messages: Message[]
  activations: ActivationBar[]
}

export const sequenceFlows: SequenceFlow[] = [
  {
    id: 'auth',
    title: 'Authentication Flow',
    description: 'User registration and login with JWT tokens',
    actors: [
      { id: 'user', label: 'User', icon: '\u{1F464}', color: '#6b7280' },
      { id: 'react', label: 'React SPA', icon: '\u269B\uFE0F', color: '#22c55e' },
      { id: 'api', label: 'Express API', icon: '\u{1F682}', color: '#16a34a' },
      { id: 'db', label: 'PostgreSQL', icon: '\u{1F418}', color: '#15803d' },
    ],
    messages: [
      { from: 'user', to: 'react', label: 'Enter credentials', type: 'sync' },
      { from: 'react', to: 'api', label: 'POST /auth/login', type: 'sync', description: 'Email + password' },
      { from: 'api', to: 'db', label: 'SELECT user', type: 'sync', description: 'Find by email' },
      { from: 'db', to: 'api', label: 'User record', type: 'return' },
      { from: 'api', to: 'api', label: 'bcrypt.compare()', type: 'self', description: 'Verify password hash' },
      { from: 'api', to: 'api', label: 'Sign JWT', type: 'self', description: 'Access + refresh tokens' },
      { from: 'api', to: 'react', label: '200 + tokens', type: 'return' },
      { from: 'react', to: 'react', label: 'Store tokens', type: 'self', description: 'Zustand auth store' },
      { from: 'react', to: 'user', label: 'Redirect to /recipes', type: 'return' },
    ],
    activations: [
      { actor: 'api', startMsg: 1, endMsg: 6 },
      { actor: 'react', startMsg: 0, endMsg: 8 },
    ],
  },
  {
    id: 'recipe-crud',
    title: 'Recipe CRUD Flow',
    description: 'Creating a recipe with ingredients',
    actors: [
      { id: 'user', label: 'User', icon: '\u{1F464}', color: '#6b7280' },
      { id: 'react', label: 'React SPA', icon: '\u269B\uFE0F', color: '#22c55e' },
      { id: 'api', label: 'Express API', icon: '\u{1F682}', color: '#16a34a' },
      { id: 'db', label: 'PostgreSQL', icon: '\u{1F418}', color: '#15803d' },
    ],
    messages: [
      { from: 'user', to: 'react', label: 'Fill recipe form', type: 'sync' },
      { from: 'react', to: 'react', label: 'Zod validate', type: 'self', description: 'Client-side validation' },
      { from: 'react', to: 'api', label: 'POST /recipes', type: 'sync', description: 'Recipe + ingredients[]' },
      { from: 'api', to: 'api', label: 'Auth middleware', type: 'self', description: 'Verify JWT' },
      { from: 'api', to: 'api', label: 'Zod validate', type: 'self', description: 'Server-side validation' },
      { from: 'api', to: 'db', label: 'BEGIN transaction', type: 'sync' },
      { from: 'api', to: 'db', label: 'INSERT recipe', type: 'sync' },
      { from: 'api', to: 'db', label: 'INSERT recipe_ingredients', type: 'sync', description: 'Batch insert' },
      { from: 'api', to: 'db', label: 'COMMIT', type: 'sync' },
      { from: 'db', to: 'api', label: 'Created recipe', type: 'return' },
      { from: 'api', to: 'react', label: '201 + recipe', type: 'return' },
      { from: 'react', to: 'user', label: 'Navigate to detail', type: 'return' },
    ],
    activations: [
      { actor: 'api', startMsg: 2, endMsg: 10 },
      { actor: 'db', startMsg: 5, endMsg: 9 },
    ],
  },
  {
    id: 'meal-planning',
    title: 'Meal Planning Flow',
    description: 'Adding recipes to a weekly meal plan',
    actors: [
      { id: 'user', label: 'User', icon: '\u{1F464}', color: '#6b7280' },
      { id: 'react', label: 'React SPA', icon: '\u269B\uFE0F', color: '#22c55e' },
      { id: 'api', label: 'Express API', icon: '\u{1F682}', color: '#16a34a' },
      { id: 'db', label: 'PostgreSQL', icon: '\u{1F418}', color: '#15803d' },
    ],
    messages: [
      { from: 'user', to: 'react', label: 'Click meal slot', type: 'sync', description: 'Tuesday dinner' },
      { from: 'react', to: 'react', label: 'Open recipe picker', type: 'self' },
      { from: 'user', to: 'react', label: 'Select recipe', type: 'sync', description: 'Pasta Carbonara' },
      { from: 'react', to: 'api', label: 'POST /meal-plans/:id/entries', type: 'sync' },
      { from: 'api', to: 'db', label: 'INSERT meal_plan_entry', type: 'sync' },
      { from: 'db', to: 'api', label: 'Created entry', type: 'return' },
      { from: 'api', to: 'react', label: '201 + entry', type: 'return' },
      { from: 'react', to: 'user', label: 'Update calendar slot', type: 'return' },
    ],
    activations: [
      { actor: 'react', startMsg: 0, endMsg: 7 },
      { actor: 'api', startMsg: 3, endMsg: 6 },
    ],
  },
  {
    id: 'shopping-list',
    title: 'Shopping List Generation',
    description: 'Generating a grouped shopping list from a meal plan',
    actors: [
      { id: 'user', label: 'User', icon: '\u{1F464}', color: '#6b7280' },
      { id: 'react', label: 'React SPA', icon: '\u269B\uFE0F', color: '#22c55e' },
      { id: 'api', label: 'Express API', icon: '\u{1F682}', color: '#16a34a' },
      { id: 'db', label: 'PostgreSQL', icon: '\u{1F418}', color: '#15803d' },
    ],
    messages: [
      { from: 'user', to: 'react', label: 'Click "Generate List"', type: 'sync' },
      { from: 'react', to: 'api', label: 'GET /meal-plans/:id/shopping-list', type: 'sync' },
      { from: 'api', to: 'db', label: 'Load plan + entries', type: 'sync', description: 'JOIN recipes, ingredients' },
      { from: 'db', to: 'api', label: 'Full plan data', type: 'return' },
      { from: 'api', to: 'api', label: 'Aggregate quantities', type: 'self', description: 'Group by ingredient' },
      { from: 'api', to: 'api', label: 'Categorize items', type: 'self', description: 'Produce, Dairy, Meat...' },
      { from: 'api', to: 'react', label: '200 + grouped list', type: 'return' },
      { from: 'react', to: 'user', label: 'Render checklist', type: 'return', description: 'Grouped by category' },
    ],
    activations: [
      { actor: 'api', startMsg: 1, endMsg: 6 },
    ],
  },
]

// Request lifecycle flow diagram
export const requestLifecycleSteps: FlowStep[] = [
  { id: 'req', label: 'HTTP Request', type: 'start', status: 'active' },
  { id: 'cors', label: 'CORS Check', type: 'validation', status: 'complete', description: 'Origin validation' },
  { id: 'body', label: 'Body Parser', type: 'process', status: 'complete', description: 'JSON parsing' },
  { id: 'rate', label: 'Rate Limiter', type: 'decision', status: 'complete', description: '100 req/min' },
  { id: 'auth', label: 'Auth Middleware', type: 'process', status: 'active', description: 'JWT verification' },
  { id: 'validate', label: 'Zod Validation', type: 'validation', status: 'complete', description: 'Request schema' },
  { id: 'controller', label: 'Route Controller', type: 'process', status: 'active', description: 'Business logic' },
  { id: 'service', label: 'Service Layer', type: 'process', status: 'complete', description: 'Data operations' },
  { id: 'db', label: 'Database Query', type: 'process', status: 'complete', description: 'Drizzle ORM' },
  { id: 'response', label: 'JSON Response', type: 'end', status: 'active' },
]

export const requestLifecycleConnections: FlowConnection[] = [
  { from: 'req', to: 'cors', label: 'Incoming' },
  { from: 'cors', to: 'body' },
  { from: 'body', to: 'rate' },
  { from: 'rate', to: 'auth', label: 'Under limit', condition: 'yes' },
  { from: 'auth', to: 'validate' },
  { from: 'validate', to: 'controller' },
  { from: 'controller', to: 'service' },
  { from: 'service', to: 'db' },
  { from: 'db', to: 'response' },
]
