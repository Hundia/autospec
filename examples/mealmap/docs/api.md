# MealMap — API Reference

> **Sprint cross-reference:** Populated in Sprint 1 (auth + recipes), extended in Sprint 2 (meal plans + shopping list).
> **Related specs:** `specs/02_backend_lead.md` (full contracts with JSON examples)

---

## Overview

- **Base URL (development):** `http://localhost:4000/api`
- **Base URL (via Vite proxy):** `/api` (frontend uses this in dev)
- **Content-Type:** `application/json` for all requests and responses
- **Authentication:** Bearer JWT — add `Authorization: Bearer <accessToken>` header to all protected endpoints
- **Versioning:** v1 (no version prefix in URL — paths start at `/api/`)

---

## Authentication

All endpoints except `POST /auth/register`, `POST /auth/login`, `POST /auth/refresh`, and `GET /health` require a valid Bearer token.

### Token Flow

```
1. Register or Login → receive accessToken (15 min) + refreshToken (7 days)
2. Include accessToken in Authorization header for all API calls
3. When accessToken expires (401 response) → call POST /auth/refresh
4. On logout → call POST /auth/logout + clear tokens from client storage
```

---

## Endpoint Catalog

### Health

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | /health | None | Service liveness check |

### Auth

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | /auth/register | None | Create account |
| POST | /auth/login | None | Authenticate, receive tokens |
| POST | /auth/refresh | None | Exchange refresh token for new access token |
| POST | /auth/logout | Bearer | Clear server-side session (stateless — client clears tokens) |

### Recipes

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | /recipes | Bearer | List user's recipes (paginated, searchable, filterable) |
| POST | /recipes | Bearer | Create new recipe with ingredients |
| GET | /recipes/:id | Bearer | Get recipe with full ingredient list |
| PUT | /recipes/:id | Bearer | Update recipe fields |
| DELETE | /recipes/:id | Bearer | Soft-delete recipe |

### Ingredients

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | /ingredients | Bearer | List all ingredients (with optional search) |
| POST | /ingredients | Bearer | Create a new ingredient |

### Meal Plans

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | /meal-plans | Bearer | List user's meal plans |
| POST | /meal-plans | Bearer | Create new meal plan |
| GET | /meal-plans/:id | Bearer | Get meal plan with entries |
| PUT | /meal-plans/:id | Bearer | Update name or dates |
| DELETE | /meal-plans/:id | Bearer | Delete plan and all entries |
| POST | /meal-plans/:id/activate | Bearer | Set this plan as active, deactivate others |

### Meal Plan Entries

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | /meal-plans/:id/entries | Bearer | List entries for a meal plan |
| POST | /meal-plans/:id/entries | Bearer | Add a recipe to a day/meal slot |
| DELETE | /meal-plans/:id/entries/:entryId | Bearer | Remove entry from slot |

### Shopping List

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | /meal-plans/:id/shopping-list | Bearer | Generate aggregated shopping list |

---

## Auth Endpoints — curl Examples

### POST /auth/register

```bash
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jamie Chen",
    "email": "jamie@example.com",
    "password": "SecurePass1"
  }'
```

**Response 201:**
```json
{
  "user": { "id": "a1b2c3d4...", "name": "Jamie Chen", "email": "jamie@example.com", "createdAt": "2026-03-14T10:00:00.000Z" },
  "accessToken": "eyJhbGciOiJIUzI1NiJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiJ9..."
}
```

---

### POST /auth/login

```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "jamie@example.com", "password": "SecurePass1"}'
```

**Response 200:** Same shape as register response.

---

### POST /auth/refresh

```bash
curl -X POST http://localhost:4000/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{"refreshToken": "eyJhbGciOiJIUzI1NiJ9..."}'
```

**Response 200:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiJ9..."
}
```

---

### POST /auth/logout

```bash
curl -X POST http://localhost:4000/api/auth/logout \
  -H "Authorization: Bearer <accessToken>"
```

**Response 200:**
```json
{ "message": "Logged out successfully" }
```

---

## Recipe Endpoints — curl Examples

### GET /recipes (list with filters)

```bash
# All recipes, page 1
curl http://localhost:4000/api/recipes \
  -H "Authorization: Bearer <token>"

# Search for pasta, easy only, under 30 min
curl "http://localhost:4000/api/recipes?search=pasta&difficulty=easy&maxTime=30&page=1&limit=20" \
  -H "Authorization: Bearer <token>"

# Filter by tag
curl "http://localhost:4000/api/recipes?tag=vegetarian" \
  -H "Authorization: Bearer <token>"
```

**Response 200:**
```json
{
  "data": [
    {
      "id": "r1b2c3d4...",
      "title": "Creamy Garlic Pasta",
      "prepTimeMinutes": 10,
      "cookTimeMinutes": 20,
      "servings": 4,
      "difficulty": "easy",
      "tags": ["vegetarian", "quick", "pasta"],
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
    "total": 8,
    "totalPages": 1
  }
}
```

---

### POST /recipes (create with ingredients)

```bash
curl -X POST http://localhost:4000/api/recipes \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Lemon Herb Chicken",
    "prepTimeMinutes": 15,
    "cookTimeMinutes": 35,
    "servings": 4,
    "difficulty": "medium",
    "instructions": "1. Preheat oven to 400°F.\n2. Season chicken.\n3. Bake 35 min.",
    "tags": ["dinner", "high-protein"],
    "caloriesPerServing": 340,
    "proteinGrams": 42.5,
    "ingredients": [
      { "name": "Chicken breast", "quantity": 800, "unit": "g" },
      { "name": "Lemon", "quantity": 2, "unit": "whole" },
      { "name": "Olive oil", "quantity": 3, "unit": "tbsp" }
    ]
  }'
```

**Response 201:** Full recipe object with `id`, `userId`, all fields, and `ingredients` array.

---

### GET /recipes/:id

```bash
curl http://localhost:4000/api/recipes/r1b2c3d4-e5f6-7890-abcd-ef1234567890 \
  -H "Authorization: Bearer <token>"
```

**Response 200:** Full recipe with ingredients array (ingredient name, category, quantity, unit).

---

### DELETE /recipes/:id (soft delete)

```bash
curl -X DELETE http://localhost:4000/api/recipes/r1b2c3d4-e5f6-7890-abcd-ef1234567890 \
  -H "Authorization: Bearer <token>"
```

**Response 200:** `{ "message": "Recipe deleted successfully" }`

---

## Meal Plan Endpoints — curl Examples

### POST /meal-plans

```bash
curl -X POST http://localhost:4000/api/meal-plans \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Week of March 17",
    "startDate": "2026-03-17",
    "endDate": "2026-03-23"
  }'
```

**Response 201:**
```json
{
  "id": "m1b2c3d4...",
  "userId": "a1b2c3d4...",
  "name": "Week of March 17",
  "startDate": "2026-03-17",
  "endDate": "2026-03-23",
  "isActive": false,
  "createdAt": "2026-03-14T09:00:00.000Z",
  "updatedAt": "2026-03-14T09:00:00.000Z"
}
```

---

### POST /meal-plans/:id/activate

```bash
curl -X POST http://localhost:4000/api/meal-plans/m1b2c3d4-e5f6-7890-abcd-ef1234567890/activate \
  -H "Authorization: Bearer <token>"
```

**Response 200:**
```json
{
  "id": "m1b2c3d4...",
  "isActive": true,
  "message": "Meal plan activated. Previous active plan deactivated."
}
```

---

### POST /meal-plans/:id/entries

```bash
curl -X POST http://localhost:4000/api/meal-plans/m1b2c3d4.../entries \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "recipeId": "r1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "date": "2026-03-17",
    "mealType": "dinner",
    "servingsOverride": 6
  }'
```

**Response 201:** Entry object with id, mealPlanId, recipeId, date, mealType, servingsOverride.

---

### GET /meal-plans/:id/shopping-list

```bash
curl http://localhost:4000/api/meal-plans/m1b2c3d4-e5f6-7890-abcd-ef1234567890/shopping-list \
  -H "Authorization: Bearer <token>"
```

**Response 200:**
```json
{
  "mealPlanId": "m1b2c3d4...",
  "mealPlanName": "Week of March 17",
  "items": [
    {
      "ingredientId": "i1b2c3d4...",
      "name": "Chicken breast",
      "category": "meat",
      "lines": [{ "quantity": "1600.00", "unit": "g" }]
    },
    {
      "ingredientId": "i5f6a7b8...",
      "name": "All-purpose flour",
      "category": "pantry",
      "lines": [{ "quantity": "3.00", "unit": "cups" }]
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
    "pantry": ["All-purpose flour", "Olive oil", "Pasta (penne)"],
    "dairy": ["Butter", "Parmesan cheese"],
    "produce": ["Garlic", "Lemon", "Cherry tomatoes"],
    "frozen": [],
    "other": []
  }
}
```

---

## Pagination Format

All list endpoints that support pagination use this query parameter and response format:

**Query parameters:**
- `page` (integer, default 1) — page number (1-indexed)
- `limit` (integer, default 20, max 100) — items per page

**Response:**
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 47,
    "totalPages": 3
  }
}
```

---

## Error Response Format

All errors return a consistent JSON body:

```json
{
  "error": "ERROR_CODE",
  "message": "Human-readable message"
}
```

For validation errors (400), an additional `details` field contains field-level errors:

```json
{
  "error": "VALIDATION_ERROR",
  "message": "Request validation failed",
  "details": {
    "title": ["String must contain at least 1 character(s)"],
    "servings": ["Expected number, received string"]
  }
}
```

### HTTP Status to Error Code Mapping

| HTTP Status | Error Code | When |
|-------------|-----------|------|
| 400 | `VALIDATION_ERROR` | Request body/query fails Zod schema |
| 401 | `UNAUTHORIZED` | Missing or invalid JWT, wrong password |
| 403 | `FORBIDDEN` | Authenticated but insufficient permission |
| 404 | `NOT_FOUND` | Resource does not exist or belongs to another user |
| 409 | `CONFLICT` | Duplicate email on register, duplicate meal plan slot |
| 500 | `INTERNAL_ERROR` | Unexpected server error |

---

## Request Validation Rules

| Field | Rule |
|-------|------|
| `email` | Valid email format (RFC 5322) |
| `password` | ≥ 8 characters, at least one digit |
| `name` (user) | 1–100 characters |
| `title` (recipe) | 1–200 characters |
| `description` | 0–1000 characters |
| `prepTimeMinutes` | Integer 0–1440 |
| `cookTimeMinutes` | Integer 0–1440 |
| `servings` | Integer 1–50 |
| `difficulty` | One of: `easy`, `medium`, `hard` |
| `unit` | One of: `cups`, `tbsp`, `tsp`, `oz`, `g`, `ml`, `whole`, `pinch`, `lb` |
| `mealType` | One of: `breakfast`, `lunch`, `dinner`, `snack` |
| `startDate` / `endDate` | YYYY-MM-DD format; endDate ≥ startDate |
| `servingsOverride` | Integer 1–50 (optional) |
| `quantity` (ingredient) | Positive number |
| `category` (ingredient) | One of: `produce`, `dairy`, `meat`, `pantry`, `frozen`, `other` |

---

*For full request/response JSON examples with every field, see `specs/02_backend_lead.md`. For test examples using Supertest, see `specs/05_qa_lead.md`.*
