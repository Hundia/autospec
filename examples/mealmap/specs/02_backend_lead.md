# MealMap — Backend Lead Specification

> **Role:** Backend Lead
> **Cross-references:** `specs/04_db_architect.md` (schema), `specs/05_qa_lead.md` (tests), `specs/backlog.md` (tickets)

---

## 1. System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        Client (React SPA)                        │
└──────────────────────┬──────────────────────────────────────────┘
                       │ HTTPS / Axios
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Express 4.x API Server                        │
│                                                                  │
│  ┌──────────┐  ┌────────────┐  ┌────────────┐  ┌────────────┐  │
│  │  Routes  │→ │ Middleware │→ │Controllers │→ │  Services  │  │
│  └──────────┘  └────────────┘  └────────────┘  └─────┬──────┘  │
│                                                        │         │
│                                                ┌───────▼──────┐  │
│                                                │ Drizzle ORM  │  │
│                                                └───────┬──────┘  │
└────────────────────────────────────────────────────────┼────────┘
                                                         │
                                                         ▼
                                          ┌──────────────────────┐
                                          │   PostgreSQL 15       │
                                          │  (Docker container)   │
                                          └──────────────────────┘
```

### Request Lifecycle

1. **Browser** sends HTTP request to `http://localhost:4000/api`
2. **Express** receives request, global middleware runs (CORS, body parser, Morgan logger)
3. **Authentication middleware** verifies JWT on protected routes (skips `/auth/*`)
4. **Zod validation middleware** validates request body/params/query against schema
5. **Controller** extracts validated data, calls service method
6. **Service** implements business logic, calls Drizzle ORM queries
7. **Drizzle ORM** executes parameterized SQL against PostgreSQL
8. **Service** returns result or throws typed error
9. **Controller** formats response JSON
10. **Global error handler** catches thrown errors, maps to HTTP status + error body
11. **Response** sent to client

---

## 2. Tech Stack

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| Runtime | Node.js | 20 LTS | Server runtime |
| Framework | Express | 4.x | HTTP server and routing |
| Language | TypeScript | 5.x | Type safety across all layers |
| ORM | Drizzle ORM | 0.29+ | Type-safe PostgreSQL queries |
| Validation | Zod | 3.x | Request body and env validation |
| Auth | jsonwebtoken | 9.x | JWT signing and verification |
| Password | bcrypt | 5.x | Password hashing (12 rounds) |
| Testing | Vitest + Supertest | latest | Unit and integration tests |
| Logging | Morgan | 1.x | HTTP request logging |
| DB Driver | postgres (pg-compatible) | latest | Drizzle adapter |

---

## 3. Directory Structure

```
api/
├── src/
│   ├── index.ts                  # Entry point: creates app, starts server
│   ├── app.ts                    # Express app factory (for testing)
│   ├── config/
│   │   └── env.ts                # Zod-validated env vars (DATABASE_URL, JWT_SECRET, etc.)
│   ├── db/
│   │   ├── connection.ts         # Drizzle client singleton
│   │   └── schema/
│   │       ├── index.ts          # Barrel export of all schema objects
│   │       ├── users.ts          # users table definition
│   │       ├── recipes.ts        # recipes table definition
│   │       ├── ingredients.ts    # ingredients table definition
│   │       ├── recipeIngredients.ts  # recipe_ingredients join table
│   │       ├── mealPlans.ts      # meal_plans table definition
│   │       └── mealPlanEntries.ts    # meal_plan_entries table definition
│   ├── middleware/
│   │   ├── auth.middleware.ts    # JWT verification, attaches req.user
│   │   ├── validate.middleware.ts # Zod schema validation factory
│   │   └── error.middleware.ts   # Global error handler
│   ├── routes/
│   │   ├── index.ts              # Mounts all routers under /api
│   │   ├── auth.routes.ts        # POST /auth/register, /login, /refresh, /logout
│   │   ├── recipes.routes.ts     # CRUD /recipes
│   │   ├── ingredients.routes.ts # GET/POST /ingredients
│   │   ├── mealPlans.routes.ts   # CRUD /meal-plans + /activate
│   │   ├── mealPlanEntries.routes.ts # POST/DELETE /meal-plans/:id/entries
│   │   ├── shoppingList.routes.ts    # GET /meal-plans/:id/shopping-list
│   │   └── health.routes.ts      # GET /health
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   ├── recipes.controller.ts
│   │   ├── ingredients.controller.ts
│   │   ├── mealPlans.controller.ts
│   │   ├── mealPlanEntries.controller.ts
│   │   └── shoppingList.controller.ts
│   ├── services/
│   │   ├── auth.service.ts           # register, login, refreshToken
│   │   ├── recipes.service.ts        # CRUD + search/filter
│   │   ├── ingredients.service.ts    # list, findOrCreate
│   │   ├── mealPlans.service.ts      # CRUD + activate
│   │   ├── mealPlanEntries.service.ts # add, remove entries
│   │   └── shoppingList.service.ts   # aggregation logic
│   ├── schemas/
│   │   ├── auth.schema.ts        # Zod schemas for auth requests
│   │   ├── recipes.schema.ts     # Zod schemas for recipe requests
│   │   ├── ingredients.schema.ts
│   │   ├── mealPlans.schema.ts
│   │   └── mealPlanEntries.schema.ts
│   ├── types/
│   │   ├── express.d.ts          # Augment Request with user: JwtPayload
│   │   └── errors.ts             # Custom error classes
│   └── utils/
│       ├── jwt.ts                # signToken, verifyToken helpers
│       └── hash.ts               # hashPassword, comparePassword
├── tests/
│   ├── unit/
│   │   ├── recipes.service.test.ts
│   │   ├── shoppingList.service.test.ts
│   │   └── auth.service.test.ts
│   └── integration/
│       ├── auth.test.ts
│       ├── recipes.test.ts
│       ├── ingredients.test.ts
│       ├── mealPlans.test.ts
│       └── shoppingList.test.ts
├── drizzle.config.ts             # Drizzle Kit config
├── package.json
├── tsconfig.json
├── .env.example
└── vitest.config.ts
```

---

## 4. Complete API Contracts

### Authentication Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | /api/auth/register | None | Create new user account |
| POST | /api/auth/login | None | Log in, receive tokens |
| POST | /api/auth/refresh | None | Exchange refresh token for new access token |
| POST | /api/auth/logout | Bearer | Invalidate refresh token |

### Recipe Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | /api/recipes | Bearer | List user's recipes (paginated, filterable) |
| POST | /api/recipes | Bearer | Create a new recipe |
| GET | /api/recipes/:id | Bearer | Get single recipe with ingredients |
| PUT | /api/recipes/:id | Bearer | Update recipe fields |
| DELETE | /api/recipes/:id | Bearer | Soft-delete a recipe |

### Ingredient Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | /api/ingredients | Bearer | List all ingredients (with optional name search) |
| POST | /api/ingredients | Bearer | Create a new ingredient |

### Meal Plan Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | /api/meal-plans | Bearer | List user's meal plans |
| POST | /api/meal-plans | Bearer | Create a new meal plan |
| GET | /api/meal-plans/:id | Bearer | Get meal plan with entries |
| PUT | /api/meal-plans/:id | Bearer | Update meal plan name/dates |
| DELETE | /api/meal-plans/:id | Bearer | Delete meal plan and all entries |
| POST | /api/meal-plans/:id/activate | Bearer | Activate this plan, deactivate all others |

### Meal Plan Entry Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | /api/meal-plans/:id/entries | Bearer | List entries for a meal plan |
| POST | /api/meal-plans/:id/entries | Bearer | Add a recipe entry to a slot |
| DELETE | /api/meal-plans/:id/entries/:entryId | Bearer | Remove an entry |

### Shopping List Endpoint

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | /api/meal-plans/:id/shopping-list | Bearer | Generate aggregated shopping list |

### Health Endpoint

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | /api/health | None | Service health check |

---

## 5. Request/Response JSON Examples

### POST /api/auth/register

**Request:**
```json
{
  "name": "Jamie Chen",
  "email": "jamie@example.com",
  "password": "SecurePass1"
}
```

**Response 201:**
```json
{
  "user": {
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "name": "Jamie Chen",
    "email": "jamie@example.com",
    "createdAt": "2026-03-14T10:00:00.000Z"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "dGhpcyBpcyBhIHJlZnJlc2ggdG9rZW4..."
}
```

**Response 409 (email exists):**
```json
{
  "error": "CONFLICT",
  "message": "An account with this email already exists"
}
```

---

### POST /api/auth/login

**Request:**
```json
{
  "email": "jamie@example.com",
  "password": "SecurePass1"
}
```

**Response 200:**
```json
{
  "user": {
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "name": "Jamie Chen",
    "email": "jamie@example.com"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "dGhpcyBpcyBhIHJlZnJlc2ggdG9rZW4..."
}
```

**Response 401:**
```json
{
  "error": "UNAUTHORIZED",
  "message": "Invalid email or password"
}
```

---

### POST /api/auth/refresh

**Request:**
```json
{
  "refreshToken": "dGhpcyBpcyBhIHJlZnJlc2ggdG9rZW4..."
}
```

**Response 200:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "bmV3UmVmcmVzaFRva2Vu..."
}
```

---

### GET /api/recipes?page=1&limit=20&search=pasta&tag=vegetarian&difficulty=easy&maxTime=30

**Response 200:**
```json
{
  "data": [
    {
      "id": "r1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "title": "Creamy Garlic Pasta",
      "description": "A quick and comforting pasta dish",
      "prepTimeMinutes": 10,
      "cookTimeMinutes": 20,
      "servings": 4,
      "difficulty": "easy",
      "tags": ["vegetarian", "quick", "pasta"],
      "imageUrl": "https://example.com/pasta.jpg",
      "caloriesPerServing": 520,
      "proteinGrams": "18.5",
      "carbsGrams": "72.0",
      "fatGrams": "16.2",
      "isDeleted": false,
      "createdAt": "2026-03-01T12:00:00.000Z",
      "updatedAt": "2026-03-01T12:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 47,
    "totalPages": 3
  }
}
```

---

### POST /api/recipes

**Request:**
```json
{
  "title": "Lemon Herb Chicken",
  "description": "Light and bright baked chicken with fresh herbs",
  "prepTimeMinutes": 15,
  "cookTimeMinutes": 35,
  "servings": 4,
  "difficulty": "medium",
  "tags": ["dinner", "high-protein", "gluten-free"],
  "instructions": "1. Preheat oven to 400°F.\n2. Mix olive oil, lemon juice, garlic, thyme...\n3. Coat chicken...\n4. Bake 35 minutes until internal temp 165°F.",
  "imageUrl": "https://example.com/lemon-chicken.jpg",
  "caloriesPerServing": 340,
  "proteinGrams": 42.5,
  "carbsGrams": 4.0,
  "fatGrams": 16.0,
  "ingredients": [
    { "name": "Chicken breast", "quantity": 800, "unit": "g" },
    { "name": "Olive oil", "quantity": 3, "unit": "tbsp" },
    { "name": "Lemon", "quantity": 2, "unit": "whole" },
    { "name": "Garlic", "quantity": 4, "unit": "whole" },
    { "name": "Fresh thyme", "quantity": 2, "unit": "tbsp" }
  ]
}
```

**Response 201:**
```json
{
  "id": "r2c3d4e5-f6a7-8901-bcde-f12345678901",
  "title": "Lemon Herb Chicken",
  "userId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "description": "Light and bright baked chicken with fresh herbs",
  "prepTimeMinutes": 15,
  "cookTimeMinutes": 35,
  "servings": 4,
  "difficulty": "medium",
  "tags": ["dinner", "high-protein", "gluten-free"],
  "instructions": "1. Preheat oven to 400°F...",
  "imageUrl": "https://example.com/lemon-chicken.jpg",
  "caloriesPerServing": 340,
  "proteinGrams": "42.5",
  "carbsGrams": "4.0",
  "fatGrams": "16.0",
  "isDeleted": false,
  "ingredients": [
    {
      "id": "i1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "name": "Chicken breast",
      "category": "meat",
      "quantity": "800.00",
      "unit": "g"
    },
    {
      "id": "i2c3d4e5-f6a7-8901-bcde-f12345678901",
      "name": "Olive oil",
      "category": "pantry",
      "quantity": "3.00",
      "unit": "tbsp"
    }
  ],
  "createdAt": "2026-03-14T10:30:00.000Z",
  "updatedAt": "2026-03-14T10:30:00.000Z"
}
```

---

### GET /api/recipes/:id

**Response 200:** Same as POST /api/recipes response body (single recipe with full ingredients).

**Response 404:**
```json
{
  "error": "NOT_FOUND",
  "message": "Recipe not found"
}
```

---

### PUT /api/recipes/:id

**Request:** Any subset of recipe fields (same shape as POST, all optional):
```json
{
  "title": "Lemon Herb Chicken (Updated)",
  "cookTimeMinutes": 40
}
```

**Response 200:** Updated recipe object (same shape as GET /api/recipes/:id).

---

### DELETE /api/recipes/:id

**Response 200:**
```json
{
  "message": "Recipe deleted successfully"
}
```

---

### GET /api/ingredients?search=chick

**Response 200:**
```json
{
  "data": [
    { "id": "i1b2c3d4...", "name": "Chicken breast", "category": "meat", "createdAt": "2026-03-01T00:00:00.000Z" },
    { "id": "i2c3d4e5...", "name": "Chicken thigh", "category": "meat", "createdAt": "2026-03-01T00:00:00.000Z" },
    { "id": "i3d4e5f6...", "name": "Chickpeas", "category": "pantry", "createdAt": "2026-03-01T00:00:00.000Z" }
  ]
}
```

---

### POST /api/ingredients

**Request:**
```json
{
  "name": "Quinoa",
  "category": "pantry"
}
```

**Response 201:**
```json
{
  "id": "i4e5f6a7-b8c9-0123-defg-456789012345",
  "name": "Quinoa",
  "category": "pantry",
  "createdAt": "2026-03-14T11:00:00.000Z"
}
```

---

### GET /api/meal-plans

**Response 200:**
```json
{
  "data": [
    {
      "id": "m1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "userId": "a1b2c3d4...",
      "name": "Week of March 17",
      "startDate": "2026-03-17",
      "endDate": "2026-03-23",
      "isActive": true,
      "createdAt": "2026-03-14T09:00:00.000Z",
      "updatedAt": "2026-03-14T09:00:00.000Z"
    }
  ]
}
```

---

### POST /api/meal-plans

**Request:**
```json
{
  "name": "Week of March 17",
  "startDate": "2026-03-17",
  "endDate": "2026-03-23"
}
```

**Response 201:** Meal plan object (same shape as GET /api/meal-plans item, `isActive: false`).

---

### POST /api/meal-plans/:id/activate

**Response 200:**
```json
{
  "id": "m1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "isActive": true,
  "message": "Meal plan activated. Previous active plan deactivated."
}
```

---

### POST /api/meal-plans/:id/entries

**Request:**
```json
{
  "recipeId": "r1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "date": "2026-03-17",
  "mealType": "dinner",
  "servingsOverride": 6
}
```

**Response 201:**
```json
{
  "id": "e1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "mealPlanId": "m1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "recipeId": "r1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "date": "2026-03-17",
  "mealType": "dinner",
  "servingsOverride": 6
}
```

**Response 409 (slot occupied):**
```json
{
  "error": "CONFLICT",
  "message": "A recipe is already assigned to this meal plan, date, and meal type"
}
```

---

### DELETE /api/meal-plans/:id/entries/:entryId

**Response 200:**
```json
{
  "message": "Entry removed from meal plan"
}
```

---

### GET /api/meal-plans/:id/shopping-list

**Response 200:**
```json
{
  "mealPlanId": "m1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "mealPlanName": "Week of March 17",
  "items": [
    {
      "ingredientId": "i1b2c3d4...",
      "name": "Chicken breast",
      "category": "meat",
      "lines": [
        { "quantity": "1600.00", "unit": "g" }
      ]
    },
    {
      "ingredientId": "i5f6a7b8...",
      "name": "Flour",
      "category": "pantry",
      "lines": [
        { "quantity": "3.00", "unit": "cups" }
      ]
    },
    {
      "ingredientId": "i6a7b8c9...",
      "name": "Butter",
      "category": "dairy",
      "lines": [
        { "quantity": "200.00", "unit": "g" },
        { "quantity": "4.00", "unit": "tbsp" }
      ]
    }
  ],
  "groupedByCategory": {
    "meat": ["Chicken breast"],
    "pantry": ["Flour", "Olive oil"],
    "dairy": ["Butter", "Parmesan"],
    "produce": ["Lemon", "Garlic"],
    "frozen": [],
    "other": []
  }
}
```

---

### GET /api/health

**Response 200:**
```json
{
  "status": "ok",
  "timestamp": "2026-03-14T10:00:00.000Z",
  "version": "1.0.0"
}
```

---

## 6. Authentication Flow

### JWT Configuration

| Token | Algorithm | Expiry | Storage |
|-------|-----------|--------|---------|
| Access token | HS256 | 15 minutes | Memory (Zustand store) |
| Refresh token | HS256 | 7 days | localStorage |

### Token Payload

```typescript
// Access token payload
interface JwtPayload {
  sub: string;     // user.id (UUID)
  email: string;
  name: string;
  iat: number;
  exp: number;
}
```

### Refresh Token Strategy

Refresh tokens in v1 are stateless (signed JWTs, not stored in DB). On logout, the frontend clears localStorage. Token revocation before expiry is not supported in v1.

### Auth Middleware

```typescript
// src/middleware/auth.middleware.ts
export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'UNAUTHORIZED', message: 'No token provided' });
    return;
  }
  const token = authHeader.split(' ')[1];
  try {
    const payload = verifyToken(token);
    req.user = payload;
    next();
  } catch {
    res.status(401).json({ error: 'UNAUTHORIZED', message: 'Invalid or expired token' });
  }
}
```

---

## 7. Zod Validation Schemas

### Auth Schemas

```typescript
// src/schemas/auth.schema.ts
export const registerSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  password: z.string().min(8).regex(/\d/, 'Password must contain at least one number'),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const refreshSchema = z.object({
  refreshToken: z.string().min(1),
});
```

### Recipe Schema

```typescript
// src/schemas/recipes.schema.ts
const ingredientInputSchema = z.object({
  name: z.string().min(1).max(100),
  quantity: z.number().positive(),
  unit: z.enum(['cups', 'tbsp', 'tsp', 'oz', 'g', 'ml', 'whole', 'pinch', 'lb']),
});

export const createRecipeSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(1000).optional(),
  instructions: z.string().min(1),
  prepTimeMinutes: z.number().int().min(0).max(1440),
  cookTimeMinutes: z.number().int().min(0).max(1440),
  servings: z.number().int().min(1).max(50),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  tags: z.array(z.string().max(50)).default([]),
  imageUrl: z.string().url().optional(),
  caloriesPerServing: z.number().int().min(0).optional(),
  proteinGrams: z.number().min(0).max(999).optional(),
  carbsGrams: z.number().min(0).max(999).optional(),
  fatGrams: z.number().min(0).max(999).optional(),
  ingredients: z.array(ingredientInputSchema).min(1),
});

export const updateRecipeSchema = createRecipeSchema.partial();

export const recipeQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().optional(),
  tag: z.string().optional(),
  difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
  maxTime: z.coerce.number().int().min(0).optional(),
});
```

### Meal Plan Schemas

```typescript
// src/schemas/mealPlans.schema.ts
export const createMealPlanSchema = z.object({
  name: z.string().min(1).max(200),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be YYYY-MM-DD'),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be YYYY-MM-DD'),
}).refine(data => data.endDate >= data.startDate, {
  message: 'End date must be on or after start date',
  path: ['endDate'],
});

export const createEntrySchema = z.object({
  recipeId: z.string().uuid(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  mealType: z.enum(['breakfast', 'lunch', 'dinner', 'snack']),
  servingsOverride: z.number().int().min(1).max(50).optional(),
});
```

---

## 8. Middleware Chain

```
All requests:
  cors() → express.json() → morgan('dev')

Protected routes only:
  authMiddleware → validate(schema) → controller

Error handling (registered last):
  errorMiddleware
```

### validate() Factory

```typescript
// src/middleware/validate.middleware.ts
export function validate(schema: ZodSchema, source: 'body' | 'query' | 'params' = 'body') {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[source]);
    if (!result.success) {
      res.status(400).json({
        error: 'VALIDATION_ERROR',
        message: 'Request validation failed',
        details: result.error.flatten().fieldErrors,
      });
      return;
    }
    req[source] = result.data;
    next();
  };
}
```

---

## 9. Error Handling

### Custom Error Classes

```typescript
// src/types/errors.ts
export class AppError extends Error {
  constructor(
    public readonly code: ErrorCode,
    message: string,
    public readonly statusCode: number = 500
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super('NOT_FOUND', `${resource} not found`, 404);
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super('CONFLICT', message, 409);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super('UNAUTHORIZED', message, 401);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Forbidden') {
    super('FORBIDDEN', message, 403);
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super('VALIDATION_ERROR', message, 400);
  }
}
```

### Error Code Enum

```typescript
export type ErrorCode =
  | 'NOT_FOUND'
  | 'CONFLICT'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'VALIDATION_ERROR'
  | 'INTERNAL_ERROR';
```

### Global Error Handler

```typescript
// src/middleware/error.middleware.ts
export function errorMiddleware(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      error: err.code,
      message: err.message,
    });
    return;
  }
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'INTERNAL_ERROR',
    message: 'An unexpected error occurred',
  });
}
```

---

## 10. Service Layer Design

### RecipesService

| Method | Responsibility |
|--------|---------------|
| `createRecipe(userId, data)` | Insert recipe + upsert ingredients + insert recipe_ingredients |
| `listRecipes(userId, query)` | Paginated query with search/filter, exclude is_deleted |
| `getRecipeById(userId, id)` | Join with recipe_ingredients + ingredients, verify ownership |
| `updateRecipe(userId, id, data)` | Verify ownership, update fields, replace ingredient associations |
| `deleteRecipe(userId, id)` | Verify ownership, set is_deleted = true |

### ShoppingListService

| Method | Responsibility |
|--------|---------------|
| `generateShoppingList(userId, mealPlanId)` | Load all entries, load recipe ingredients, aggregate quantities by (ingredientId, unit), group by category |

**Aggregation Algorithm:**
```
1. Load all meal_plan_entries for the meal plan (verify user ownership)
2. For each entry, load recipe_ingredients joined with ingredients
3. Scale each ingredient quantity by (servingsOverride ?? recipe.servings) / recipe.servings
4. Group by (ingredient_id, unit)
5. Sum quantities within each group
6. Build result array sorted by category, then name
```

### MealPlansService

| Method | Responsibility |
|--------|---------------|
| `activateMealPlan(userId, id)` | Verify ownership, set all user's plans to isActive=false, then set target to isActive=true in a transaction |

---

## 11. Environment Variables

```env
# Database
DATABASE_URL=postgresql://mealmap_user:mealmap_pass@localhost:5432/mealmap_db

# JWT
JWT_ACCESS_SECRET=your-access-secret-at-least-32-chars
JWT_REFRESH_SECRET=your-refresh-secret-at-least-32-chars
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Server
PORT=4000
NODE_ENV=development

# Security
BCRYPT_ROUNDS=12
```

### Env Validation

```typescript
// src/config/env.ts
const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  JWT_ACCESS_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32),
  JWT_ACCESS_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
  PORT: z.coerce.number().int().default(4000),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  BCRYPT_ROUNDS: z.coerce.number().int().min(10).default(12),
});

export const env = envSchema.parse(process.env);
```

---

## 12. Performance Requirements

| Endpoint Category | p50 Target | p95 Target | p99 Target |
|-------------------|-----------|-----------|-----------|
| Health check | < 10ms | < 20ms | < 50ms |
| Auth (login/register) | < 200ms | < 500ms | < 1s |
| Recipe list (paginated) | < 50ms | < 200ms | < 500ms |
| Single recipe (with ingredients) | < 30ms | < 100ms | < 200ms |
| Shopping list generation | < 100ms | < 300ms | < 600ms |
| Meal plan operations | < 50ms | < 150ms | < 300ms |

Auth endpoints are slower due to bcrypt hashing (12 rounds ≈ 150–200ms intentionally).

---

*This spec drives implementation. API contracts are the source of truth for both frontend (`specs/03_frontend_lead.md`) and tests (`specs/05_qa_lead.md`).*
