export interface DocEntry {
  slug: string
  title: string
  section: DocSection
  icon: string // emoji
  content: string // rich markdown content
}

export const sections = ['architecture', 'api', 'guides', 'flows'] as const
export type DocSection = typeof sections[number]

export const sectionLabels: Record<DocSection, string> = {
  architecture: 'Architecture',
  api: 'API Reference',
  guides: 'Setup & Guides',
  flows: 'Application Flows',
}

export const sectionIcons: Record<DocSection, string> = {
  architecture: '🏗️',
  api: '🔌',
  guides: '📘',
  flows: '🔄',
}

export const docsManifest: DocEntry[] = [
  {
    slug: 'system-overview',
    title: 'System Overview',
    section: 'architecture',
    icon: '🏛️',
    content: `# System Overview

MealMap follows a **three-tier architecture** with clear separation of concerns:

## Architecture Layers

| Layer | Technology | Responsibility |
|-------|-----------|----------------|
| **Presentation** | React 18 + Vite | SPA with component-based UI, client-side routing |
| **Application** | Express + TypeScript | REST API, business logic, validation, auth |
| **Data** | PostgreSQL + Drizzle | Relational storage, migrations, type-safe queries |

## Key Design Decisions

- **Drizzle over Prisma** — Drizzle generates SQL at build time, giving us full control over queries and zero runtime overhead. Prisma's query engine adds ~8MB to the bundle.
- **Zustand over Redux** — For a recipe app, we need simple shared state (auth, cart). Zustand's 1KB footprint and hook-based API eliminates boilerplate.
- **Zod for validation** — Shared schemas between frontend forms and backend endpoints. One schema definition, two runtimes.
- **JWT with refresh tokens** — Stateless auth for horizontal scaling. 15-min access tokens + 7-day refresh tokens balance security and UX.

## Project Structure

\`\`\`
mealmap/
├── api/                    # Express backend
│   ├── src/
│   │   ├── routes/         # Route handlers (auth, recipes, meals, shopping)
│   │   ├── middleware/     # Auth, validation, error handling
│   │   ├── services/       # Business logic layer
│   │   └── db/             # Drizzle schema, migrations, seeds
│   └── tests/              # Vitest + Supertest
├── web/                    # React frontend
│   ├── src/
│   │   ├── pages/          # Route pages
│   │   ├── components/     # Shared UI components
│   │   ├── stores/         # Zustand state
│   │   └── services/       # Axios API clients
└── docker-compose.yml      # PostgreSQL + API containers
\`\`\`
`,
  },
  {
    slug: 'database-schema',
    title: 'Database Schema',
    section: 'architecture',
    icon: '🗄️',
    content: `# Database Schema

MealMap uses **6 tables** organized into 3 domains:

## Tables Overview

| Table | Domain | Description | Key Columns |
|-------|--------|-------------|-------------|
| \`users\` | Auth | User accounts | id, email, password_hash, name, created_at |
| \`recipes\` | Recipes | Recipe definitions | id, user_id (FK), title, description, prep_time, cook_time, servings, difficulty |
| \`ingredients\` | Recipes | Ingredient library | id, name, category, unit, calories_per_100g |
| \`recipe_ingredients\` | Recipes | Junction table | recipe_id (FK), ingredient_id (FK), quantity, unit |
| \`meal_plans\` | Planning | Weekly meal plans | id, user_id (FK), week_start, name |
| \`meal_plan_entries\` | Planning | Individual meal slots | id, meal_plan_id (FK), recipe_id (FK), day_of_week, meal_type |

## Relationships

- \`users\` → \`recipes\` (1:N) — A user owns many recipes
- \`users\` → \`meal_plans\` (1:N) — A user has many meal plans
- \`recipes\` ↔ \`ingredients\` (M:N via \`recipe_ingredients\`) — Recipes contain many ingredients
- \`meal_plans\` → \`meal_plan_entries\` (1:N) — A plan has many entries
- \`meal_plan_entries\` → \`recipes\` (N:1) — Each entry references one recipe

## Indexes

| Index | Table | Columns | Purpose |
|-------|-------|---------|---------|
| \`idx_recipes_user\` | recipes | user_id | Fast recipe listing per user |
| \`idx_ingredients_category\` | ingredients | category | Filter ingredients by aisle |
| \`idx_meal_entries_plan\` | meal_plan_entries | meal_plan_id | Load plan entries efficiently |
| \`idx_meal_entries_recipe\` | meal_plan_entries | recipe_id | Find which plans use a recipe |
| \`unique_email\` | users | email | Prevent duplicate accounts |

## Seed Data

The database comes pre-seeded with:
- 3 demo users (Jamie, Morgan, Pat — matching our personas)
- 25 recipes across Italian, Asian, Mexican, and American cuisines
- 40 ingredients with nutritional data
- 2 sample meal plans (Jamie's Weeknight Dinners, Morgan's Family Week)
`,
  },
  {
    slug: 'auth-endpoints',
    title: 'Auth Endpoints',
    section: 'api',
    icon: '🔐',
    content: `# Authentication API

All auth endpoints are prefixed with \`/api/auth\`.

## Endpoints

### POST /api/auth/register

Create a new user account.

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| email | string | ✅ | Valid email format, unique |
| password | string | ✅ | Min 8 chars, 1 uppercase, 1 number |
| name | string | ✅ | 2-50 characters |

**Response (201):**
\`\`\`json
{
  "user": { "id": "uuid", "email": "jamie@example.com", "name": "Jamie" },
  "accessToken": "eyJhbG...",
  "refreshToken": "eyJhbG..."
}
\`\`\`

### POST /api/auth/login

Authenticate and receive tokens.

| Field | Type | Required |
|-------|------|----------|
| email | string | ✅ |
| password | string | ✅ |

**Response (200):** Same shape as register.
**Error (401):** \`{ "error": "Invalid credentials" }\`

### POST /api/auth/refresh

Exchange a refresh token for new token pair.

| Header | Value |
|--------|-------|
| Authorization | Bearer {refreshToken} |

**Response (200):** \`{ "accessToken": "...", "refreshToken": "..." }\`

### POST /api/auth/logout

Invalidate the current refresh token.

| Header | Value |
|--------|-------|
| Authorization | Bearer {accessToken} |

**Response (204):** No content.

## Security Details

- Passwords hashed with bcrypt (12 rounds)
- Access tokens expire in 15 minutes
- Refresh tokens expire in 7 days
- Failed login attempts tracked (5 max, 15-min lockout)
- Rate limiting: 10 auth requests per minute per IP
`,
  },
  {
    slug: 'recipe-endpoints',
    title: 'Recipe Endpoints',
    section: 'api',
    icon: '📖',
    content: `# Recipe API

All recipe endpoints require authentication. Prefix: \`/api/recipes\`.

## Endpoints

### GET /api/recipes

List recipes with filtering and pagination.

| Query Param | Type | Default | Description |
|-------------|------|---------|-------------|
| page | number | 1 | Page number |
| limit | number | 20 | Items per page (max 100) |
| difficulty | string | — | easy, medium, hard |
| tags | string | — | Comma-separated tag filter |
| search | string | — | Full-text search on title/description |
| sort | string | created_at | Sort field (created_at, prep_time, title) |

**Response (200):**
\`\`\`json
{
  "recipes": [{ "id": "uuid", "title": "Pasta Carbonara", "difficulty": "medium", ... }],
  "total": 42,
  "page": 1,
  "totalPages": 3
}
\`\`\`

### GET /api/recipes/:id

Get recipe with full ingredients list.

### POST /api/recipes

Create a new recipe.

| Field | Type | Required |
|-------|------|----------|
| title | string | ✅ |
| description | string | ❌ |
| prepTime | number | ✅ (minutes) |
| cookTime | number | ✅ (minutes) |
| servings | number | ✅ |
| difficulty | enum | ✅ (easy/medium/hard) |
| tags | string[] | ❌ |
| ingredients | array | ✅ |
| ingredients[].ingredientId | uuid | ✅ |
| ingredients[].quantity | number | ✅ |
| ingredients[].unit | string | ✅ |

### PUT /api/recipes/:id

Update recipe (owner only).

### DELETE /api/recipes/:id

Delete recipe (owner only). Cascades to recipe_ingredients.
`,
  },
  {
    slug: 'meal-plan-endpoints',
    title: 'Meal Plan Endpoints',
    section: 'api',
    icon: '📅',
    content: `# Meal Plan API

Prefix: \`/api/meal-plans\`. All endpoints require authentication.

## Endpoints

### GET /api/meal-plans

List user's meal plans.

### POST /api/meal-plans

Create a new meal plan.

| Field | Type | Required |
|-------|------|----------|
| name | string | ✅ |
| weekStart | date | ✅ (ISO 8601, must be Monday) |

### GET /api/meal-plans/:id

Get plan with all entries populated with recipe data.

**Response:**
\`\`\`json
{
  "id": "uuid",
  "name": "This Week",
  "weekStart": "2026-03-16",
  "entries": [
    {
      "id": "uuid",
      "dayOfWeek": 1,
      "mealType": "dinner",
      "recipe": { "id": "uuid", "title": "Pasta Carbonara", "prepTime": 15, "cookTime": 20 }
    }
  ]
}
\`\`\`

### POST /api/meal-plans/:id/entries

Add a recipe to a meal slot.

| Field | Type | Required |
|-------|------|----------|
| recipeId | uuid | ✅ |
| dayOfWeek | number | ✅ (1=Mon, 7=Sun) |
| mealType | enum | ✅ (breakfast/lunch/dinner/snack) |

### DELETE /api/meal-plans/:id/entries/:entryId

Remove a meal from the plan.

### GET /api/meal-plans/:id/shopping-list

**Generate shopping list** from all recipes in the plan.

Aggregates ingredients across all entries, combining quantities for the same ingredient. Groups by ingredient category (Produce, Dairy, Meat, Pantry, etc.).

**Response:**
\`\`\`json
{
  "groups": [
    {
      "category": "Produce",
      "items": [
        { "ingredient": "Tomatoes", "totalQuantity": 6, "unit": "whole", "recipes": ["Pasta Sauce", "Salad"] }
      ]
    }
  ],
  "totalItems": 23,
  "totalRecipes": 7
}
\`\`\`
`,
  },
  {
    slug: 'setup-guide',
    title: 'Setup Guide',
    section: 'guides',
    icon: '🚀',
    content: `# Setup Guide

## Prerequisites

- Node.js 20+
- PostgreSQL 15+
- Docker & Docker Compose (recommended)

## Quick Start (Docker)

\`\`\`bash
# Clone and start
git clone https://github.com/your-org/mealmap.git
cd mealmap
cp .env.example .env

# Start PostgreSQL
docker-compose up -d db

# Install & migrate
cd api && npm install && npm run db:migrate && npm run db:seed
cd ../web && npm install

# Run
cd ../api && npm run dev    # API on :4000
cd ../web && npm run dev    # SPA on :3000
\`\`\`

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| DATABASE_URL | postgresql://... | PostgreSQL connection string |
| JWT_SECRET | — | Secret for signing tokens (min 32 chars) |
| JWT_REFRESH_SECRET | — | Separate secret for refresh tokens |
| PORT | 4000 | API server port |
| NODE_ENV | development | Environment mode |
| CORS_ORIGIN | http://localhost:3000 | Allowed frontend origin |

## Database Commands

\`\`\`bash
npm run db:migrate    # Run pending migrations
npm run db:seed       # Seed demo data
npm run db:studio     # Open Drizzle Studio (GUI)
npm run db:generate   # Generate migration from schema changes
\`\`\`

## Running Tests

\`\`\`bash
cd api
npm test              # Run all tests
npm run test:watch    # Watch mode
npm run test:coverage # With coverage report
\`\`\`
`,
  },
  {
    slug: 'auth-flow',
    title: 'Authentication Flow',
    section: 'flows',
    icon: '🔑',
    content: `# Authentication Flow

## Registration Flow

1. User submits email + password + name
2. Server validates with Zod schema
3. Check email uniqueness in \`users\` table
4. Hash password with bcrypt (12 rounds)
5. Insert user record
6. Generate access token (15m) + refresh token (7d)
7. Return user profile + both tokens

## Login Flow

1. User submits email + password
2. Server finds user by email
3. Compare password hash with bcrypt
4. If match → generate new token pair
5. If fail → increment attempt counter (lockout after 5)

## Token Refresh Flow

1. Client detects 401 on API call
2. Axios interceptor sends refresh token to \`/auth/refresh\`
3. Server validates refresh token signature + expiry
4. If valid → issue new access + refresh tokens
5. If invalid → redirect to login

## Middleware Chain

Every authenticated request passes through:

\`\`\`
Request → CORS → Body Parser → Rate Limiter → Auth Middleware → Route Handler
                                                    │
                                          Extract JWT from header
                                          Verify signature + expiry
                                          Attach user to req.user
                                          Reject if invalid/expired
\`\`\`
`,
  },
  {
    slug: 'recipe-lifecycle',
    title: 'Recipe Lifecycle',
    section: 'flows',
    icon: '🍳',
    content: `# Recipe Lifecycle

## Create Recipe Flow

1. **Frontend Form** — User fills title, description, prep/cook time, servings, difficulty
2. **Ingredient Builder** — Dynamic rows: select ingredient → set quantity + unit
3. **Tag Selection** — Multi-select from predefined tags (vegetarian, quick, budget, etc.)
4. **Validation** — Zod schema validates all fields client-side before submit
5. **API Call** — POST /api/recipes with recipe + ingredients array
6. **Server Processing:**
   - Validate request body (Zod)
   - Begin transaction
   - Insert recipe record
   - Insert recipe_ingredients rows
   - Commit transaction
7. **Response** — Return created recipe with populated ingredients

## Recipe in Meal Plans

When a recipe is added to a meal plan:
- The \`meal_plan_entries\` junction links plan + recipe + day + meal type
- Shopping list generation aggregates ingredients across all plan entries
- Deleting a recipe cascades: removes from all meal plan entries first

## Serving Scaler

The serving scaler adjusts ingredient quantities in real-time:

\`\`\`
displayQuantity = (originalQuantity / originalServings) × desiredServings
\`\`\`

This is computed client-side with no API call — instant feedback.
`,
  },
  {
    slug: 'meal-planning-flow',
    title: 'Meal Planning Flow',
    section: 'flows',
    icon: '📋',
    content: `# Meal Planning Flow

## Creating a Meal Plan

1. User clicks "New Plan" → enters name + selects week start date (must be Monday)
2. API creates \`meal_plans\` record
3. Calendar view renders 7 columns × 4 rows (Mon-Sun × Breakfast/Lunch/Dinner/Snack)

## Adding Meals

1. User clicks empty slot → recipe picker modal opens
2. Search/filter recipes by name, tags, difficulty
3. Select recipe → API POST to \`/meal-plans/:id/entries\`
4. Calendar slot updates with recipe name + prep time badge

## Shopping List Generation

The most complex flow — transforms a meal plan into a grouped shopping list:

1. **Fetch** — GET /meal-plans/:id/shopping-list
2. **Collect** — Server loads all entries → recipes → recipe_ingredients → ingredients
3. **Aggregate** — Group by ingredient, sum quantities (handling unit conversions)
4. **Categorize** — Group by ingredient.category (Produce, Dairy, Meat, Bakery, Pantry, Frozen)
5. **Sort** — Each category sorted alphabetically
6. **Return** — Grouped list with total counts

### Aggregation Example

If Monday dinner needs 2 tomatoes and Wednesday lunch needs 3 tomatoes:
\`\`\`
{ ingredient: "Tomatoes", totalQuantity: 5, unit: "whole", recipes: ["Pasta Sauce", "Bruschetta"] }
\`\`\`
`,
  },
  {
    slug: 'shopping-list-flow',
    title: 'Shopping List Generation',
    section: 'flows',
    icon: '🛒',
    content: `# Shopping List Generation

## Algorithm

\`\`\`
Input: meal_plan_id
Output: grouped shopping list

1. Load meal_plan with entries (JOIN recipes, recipe_ingredients, ingredients)
2. For each entry:
   a. For each recipe_ingredient:
      - key = ingredient_id
      - If key exists in accumulator: add quantity
      - Else: create new entry
3. Group accumulated items by ingredient.category
4. Sort groups alphabetically
5. Sort items within groups alphabetically
6. Return { groups, totalItems, totalRecipes }
\`\`\`

## Unit Handling

Quantities are stored in their original units. The aggregation only combines items with matching units:

| Scenario | Result |
|----------|--------|
| 2 cups flour + 1 cup flour | 3 cups flour |
| 200g chicken + 300g chicken | 500g chicken |
| 2 cups milk + 500ml milk | Listed separately (unit mismatch) |

Future: unit conversion engine to normalize (cups → ml, oz → g).

## Checklist UX

The shopping list renders as an interactive checklist:
- Items grouped by category (collapsible sections)
- Each item has a checkbox → strike-through when checked
- Checked count shown per category: "3/5 items"
- "Clear completed" button removes checked items
- State persisted in localStorage (survives page refresh)
`,
  },
]
