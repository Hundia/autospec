export interface Persona {
  name: string
  role: string
  avatar: string // emoji
  goals: string[]
  frustrations: string[]
}

export interface FeatureEpic {
  id: string
  title: string
  description: string
  icon: string // emoji
  status: 'done' | 'in-progress' | 'planned'
}

export interface TechItem {
  name: string
  category: string
  purpose: string
  version?: string
}

export const appDescription = {
  name: 'MealMap',
  tagline: 'Plan meals. Shop smart. Eat well.',
  summary: 'MealMap is a full-stack meal planning application that helps users organize recipes, plan weekly meals, and generate smart shopping lists. Built with Express + React using Spec-Driven Development.',
  problem: 'Home cooks waste time deciding what to cook, buying duplicate ingredients, and forgetting items at the store. MealMap solves this by connecting recipes → meal plans → shopping lists into one seamless workflow.',
}

export const personas: Persona[] = [
  {
    name: 'Jamie',
    role: 'Busy Professional',
    avatar: '👩‍💼',
    goals: ['Plan a full week of meals in under 10 minutes', 'Reduce food waste by buying only what\'s needed', 'Discover new recipes that fit dietary preferences'],
    frustrations: ['Spends 30+ min deciding what to cook each night', 'Frequently buys ingredients already in the pantry', 'Recipe apps don\'t connect to shopping lists'],
  },
  {
    name: 'Morgan',
    role: 'Health-Conscious Parent',
    avatar: '👨‍👧‍👦',
    goals: ['Track nutrition for family meals', 'Scale recipes for different family sizes', 'Build a rotating menu the whole family enjoys'],
    frustrations: ['Hard to plan balanced meals across a week', 'Manual calorie counting is tedious', 'Kids have different preferences and allergies'],
  },
  {
    name: 'Pat',
    role: 'College Student',
    avatar: '🧑‍🎓',
    goals: ['Cook on a tight budget', 'Simple recipes with minimal ingredients', 'Batch cook meals for the week'],
    frustrations: ['Recipes assume you have a fully stocked kitchen', 'No way to filter by budget or cooking skill', 'Shopping lists from multiple recipes have duplicates'],
  },
]

export const featureEpics: FeatureEpic[] = [
  { id: 'F1', title: 'Authentication', description: 'JWT-based register/login with refresh tokens, secure password hashing, and session management', icon: '🔐', status: 'done' },
  { id: 'F2', title: 'Recipe Management', description: 'Full CRUD for recipes with ingredients, tags, difficulty levels, prep/cook times, and nutritional info', icon: '📖', status: 'done' },
  { id: 'F3', title: 'Ingredient Library', description: 'Shared ingredient database with units, categories, and nutritional data per 100g', icon: '🥕', status: 'done' },
  { id: 'F4', title: 'Meal Planning', description: 'Weekly calendar view with drag-and-drop meal assignment across breakfast, lunch, dinner, and snacks', icon: '📅', status: 'in-progress' },
  { id: 'F5', title: 'Smart Shopping Lists', description: 'Auto-generated shopping lists from meal plans with quantity aggregation, aisle grouping, and checkoff', icon: '🛒', status: 'in-progress' },
  { id: 'F6', title: 'Nutrition Dashboard', description: 'Weekly nutrition summary with macro tracking, calorie targets, and dietary goal progress', icon: '📊', status: 'planned' },
]

export const techStack: TechItem[] = [
  { name: 'React', category: 'Frontend', purpose: 'UI component library', version: '18.3' },
  { name: 'Vite', category: 'Frontend', purpose: 'Build tool & dev server', version: '5.1' },
  { name: 'Tailwind CSS', category: 'Frontend', purpose: 'Utility-first styling', version: '3.4' },
  { name: 'Zustand', category: 'Frontend', purpose: 'Lightweight state management' },
  { name: 'Axios', category: 'Frontend', purpose: 'HTTP client with interceptors' },
  { name: 'React Router', category: 'Frontend', purpose: 'Client-side routing', version: '6.22' },
  { name: 'Express', category: 'Backend', purpose: 'HTTP server framework', version: '4.x' },
  { name: 'TypeScript', category: 'Backend', purpose: 'Type safety across stack', version: '5.4' },
  { name: 'Zod', category: 'Backend', purpose: 'Runtime schema validation' },
  { name: 'Drizzle ORM', category: 'Database', purpose: 'Type-safe SQL query builder' },
  { name: 'PostgreSQL', category: 'Database', purpose: 'Relational database', version: '15' },
  { name: 'JWT', category: 'Auth', purpose: 'Stateless authentication tokens' },
  { name: 'bcrypt', category: 'Auth', purpose: 'Password hashing (12 rounds)' },
  { name: 'Vitest', category: 'Testing', purpose: 'Unit & integration tests' },
  { name: 'Supertest', category: 'Testing', purpose: 'HTTP endpoint testing' },
  { name: 'Docker', category: 'Infrastructure', purpose: 'Containerized deployment' },
]
