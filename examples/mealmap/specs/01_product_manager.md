# MealMap — Product Manager Specification

> **Role:** Product Manager
> **Cross-references:** `specs/02_backend_lead.md` (API contracts), `specs/03_frontend_lead.md` (UI/UX), `specs/backlog.md` (sprint plan)

---

## 1. Project Vision

### Elevator Pitch

MealMap is a web application that transforms how home cooks organize their culinary life. Instead of recipes scattered across browser bookmarks, screenshots, and sticky notes, MealMap gives every cook a single place to store recipes, plan their week visually, and generate an accurate grocery list in one click. Whether you are a fitness enthusiast tracking macros, a busy parent feeding four kids, or a weekend cook building a personal cookbook, MealMap turns Sunday meal planning from a chore into a five-minute ritual.

### Mission Statement

Eliminate the cognitive overhead of meal planning so that home cooks spend less time deciding what to eat and more time enjoying cooking.

---

## 2. Problem Statement

### The Pain Points

**Problem 1: Recipe fragmentation.** The average home cook has recipes in four or more places simultaneously — browser bookmarks, Pinterest boards, screenshots, physical cookbooks, family group chats, and handwritten notes. Finding a specific recipe when hungry and in a hurry is frustrating and often leads to ordering takeout instead.

**Problem 2: Meal planning is manual and tedious.** Planning a week of meals involves browsing scattered recipe sources, mentally tracking what was eaten last week, estimating what the family will enjoy, and writing a shopping list by hand. This takes 30–45 minutes every Sunday and is error-prone.

**Problem 3: Shopping lists are guesswork.** Without a system that knows what is in each recipe, grocery lists are written from memory. This leads to buying duplicates (two bags of flour when one suffices) and forgetting key ingredients (no garlic for the pasta dish). Forgotten items mean extra trips to the store.

**Problem 4: No nutritional visibility.** People tracking their health goals have no easy way to understand the macro profile of a meal plan at a glance without manually entering every ingredient into a separate app.

**Problem 5: Scaling recipes is error-prone.** Cooking for two vs. cooking for a family of eight requires mental arithmetic on every ingredient, leading to mistakes and wasted food.

### Who Suffers

These problems affect an estimated 80% of the 130M+ US households that cook at home regularly. The problem is universal regardless of cooking skill level.

---

## 3. User Personas

### Persona 1: Jamie Chen — The Organized Home Cook

| Attribute | Detail |
|-----------|--------|
| Age | 34 |
| Location | Seattle, WA |
| Household | Lives with partner, no kids yet |
| Occupation | UX designer (works from home) |
| Tech comfort | Intermediate — uses apps daily, comfortable with web forms |

**Goals:**
- Consolidate 100+ saved recipes into one searchable, organized library
- Plan the week's meals every Sunday without stress
- Generate an accurate grocery list that eliminates forgotten ingredients
- Reduce food waste by planning around fridge contents

**Frustrations:**
- Recipe bookmarks are unorganized and hard to search by "what I feel like eating"
- Spends 30 minutes every Sunday just browsing to remember what recipes exist
- Grocery trips often require a second visit for a forgotten item
- Cookbook recipes don't scale well when cooking for two instead of four

**Typical Week:**
Sunday: Plans 5 dinners + 3 lunches. Monday–Friday: Follows plan, occasionally swaps. Weekend: Free-form cooking.

**Quote:** *"I just want all my recipes in one place and a list that tells me exactly what to buy."*

---

### Persona 2: Morgan Riley — The Fitness Enthusiast

| Attribute | Detail |
|-----------|--------|
| Age | 28 |
| Location | Austin, TX |
| Household | Lives alone, gym 5x/week |
| Occupation | Software engineer |
| Tech comfort | Advanced — uses spreadsheets, MyFitnessPal, Cronometer |

**Goals:**
- Log calories, protein, carbs, and fat per recipe to hit daily macro targets
- Build a library of high-protein, low-carb recipes for cutting phases
- Scale recipes for batch/meal prep (cooking 8 servings at once for the week)
- Plan meals that collectively hit weekly macro goals

**Frustrations:**
- Most recipe apps hide or omit nutritional data
- Manually calculating macros for a home recipe requires looking up every ingredient in a separate app
- When scaling a recipe (e.g., 2 servings → 10), mentally recalculating each ingredient quantity is tedious and error-prone
- No single tool combines meal planning AND macro tracking

**Typical Week:**
Sunday: Meal preps for 5 days. All meals planned to hit 180g protein/day target. Scales recipes to 5–10 servings.

**Quote:** *"I need to see exactly what I'm eating before I make it, not after."*

---

### Persona 3: Pat Nguyen — The Busy Parent

| Attribute | Detail |
|-----------|--------|
| Age | 41 |
| Location | Chicago, IL |
| Household | Married, two kids ages 8 and 11 |
| Occupation | Accountant (office, limited lunch break) |
| Tech comfort | Beginner to intermediate — uses smartphone apps, less comfortable with complex UIs |

**Goals:**
- Quickly find recipes under 30 minutes total time for weeknight dinners
- Tag and filter for "kid-friendly" recipes to minimize dinner table arguments
- Scale a recipe that serves 2 up to 4 for the whole family
- Share the week's meal plan with spouse so either can handle dinner
- Get to the grocery store efficiently with a categorized list

**Frustrations:**
- During the week there is no time to browse recipe sites — needs plan ready on Sunday
- Two picky kids reject half the dishes planned, causing last-minute scrambles
- Shopping trips take 45+ minutes without a properly organized list
- Partner doesn't know what to buy without a proper list

**Typical Week:**
Saturday: Pat and spouse plan next week's dinners together (15–20 min max). Sunday: Grocery run. Monday–Friday: Follow the plan, swap if needed.

**Quote:** *"I need a system my spouse can look at and know exactly what to buy without calling me at the store."*

---

## 4. User Stories & Acceptance Criteria

### Epic F1: User Authentication

#### US-1.1: Registration
**As** a new visitor,
**I want** to create a MealMap account with my email and password,
**So that** my recipes and meal plans are saved and private.

**Acceptance Criteria:**
- **Given** I am on `/register` and I fill in name, email, and a valid password (8+ chars, at least one number)
- **When** I click "Create Account"
- **Then** my account is created, I am logged in, and I am redirected to `/recipes`

**Given** the email is already registered,
**When** I click "Create Account",
**Then** I see "An account with this email already exists" error inline.

**Given** my password is fewer than 8 characters or has no number,
**When** I click "Create Account",
**Then** I see "Password must be at least 8 characters and include a number" inline.

#### US-1.2: Login
**As** a registered user,
**I want** to log in with my email and password,
**So that** I can access my recipes and meal plans.

**Acceptance Criteria:**
- **Given** I enter correct credentials
- **When** I click "Log In"
- **Then** I receive a JWT access token (15-min TTL), am logged in, and see `/recipes`

**Given** I enter wrong credentials,
**When** I click "Log In",
**Then** I see "Invalid email or password" without revealing which field is wrong.

#### US-1.3: Session Persistence
**As** a logged-in user,
**I want** my session to persist across browser refreshes,
**So that** I don't have to log in again every time.

**Acceptance Criteria:**
- **Given** I am logged in and close and reopen the browser
- **When** the refresh token (7-day TTL) is valid
- **Then** a new access token is obtained silently and I remain logged in

---

### Epic F2: Recipe Management

#### US-2.1: Create Recipe
**As** Jamie,
**I want** to add a new recipe with title, ingredients, and instructions,
**So that** it is saved in my personal recipe library.

**Acceptance Criteria:**
- **Given** I am on `/recipes/new`
- **When** I fill in title (required), prep time, cook time, servings, difficulty, at least one ingredient with quantity and unit, and instructions
- **Then** the recipe is saved and I am redirected to `/recipes/:id` with a success toast

**Given** I omit the title,
**When** I click "Save Recipe",
**Then** I see "Title is required" inline validation error.

**Given** I type a new ingredient name that doesn't exist,
**When** I add it to the recipe,
**Then** the ingredient is created automatically in the ingredients table.

#### US-2.2: Search and Filter Recipes
**As** Jamie,
**I want** to search my recipes by title and filter by tag, difficulty, and total time,
**So that** I can find the right recipe quickly.

**Acceptance Criteria:**
- **Given** I have 50 recipes and type "pasta" in the search box
- **When** I stop typing (debounce 300ms)
- **Then** I see only recipes whose title contains "pasta" (case-insensitive)

**Given** I filter by tag "vegetarian",
**When** the filter applies,
**Then** I only see recipes tagged "vegetarian".

**Given** I filter by max total time 30 minutes,
**When** the filter applies,
**Then** I only see recipes where prep_time_minutes + cook_time_minutes ≤ 30.

#### US-2.3: View Recipe with Scaling
**As** Morgan,
**I want** to view a recipe and change the serving count to see scaled ingredient quantities,
**So that** I can meal prep the correct amount.

**Acceptance Criteria:**
- **Given** I am on `/recipes/:id` which shows a recipe with 4 servings
- **When** I change the serving count to 8
- **Then** all ingredient quantities double (e.g., "2 cups flour" → "4 cups flour") without modifying the stored recipe

#### US-2.4: Edit Recipe
**As** a user,
**I want** to edit any field of a recipe I created,
**So that** I can update instructions or add missing ingredients.

**Acceptance Criteria:**
- **Given** I am on `/recipes/:id/edit`
- **When** I change the title and click "Save"
- **Then** the recipe is updated and I see the updated title on the detail page

#### US-2.5: Delete Recipe
**As** a user,
**I want** to delete a recipe I no longer need,
**So that** my library stays clean.

**Acceptance Criteria:**
- **Given** I click "Delete" on a recipe
- **When** I confirm the deletion prompt
- **Then** the recipe is soft-deleted (`is_deleted = true`) and no longer appears in my list

**Given** the recipe is assigned to an active meal plan entry,
**When** I attempt to delete it,
**Then** I see a warning "This recipe is used in your active meal plan" before confirming.

---

### Epic F3: Ingredient Management

#### US-3.1: Auto-suggest Ingredients
**As** a user creating a recipe,
**I want** ingredient names to auto-suggest as I type,
**So that** I use consistent ingredient names across recipes.

**Acceptance Criteria:**
- **Given** I am typing in the ingredient name field
- **When** I type "chick"
- **Then** I see suggestions "Chicken breast", "Chicken thigh", "Chickpeas" from existing ingredients

**Given** I type a name with no matches,
**Then** I can add it as a new ingredient with a category.

#### US-3.2: Ingredient Categories
**As** the system,
**I want** every ingredient to have a category (produce, dairy, meat, pantry, frozen, other),
**So that** the shopping list can be grouped by store aisle.

**Acceptance Criteria:**
- **Given** a new ingredient is auto-created during recipe save
- **Then** it defaults to category "other"
- **Given** the user explicitly creates an ingredient
- **Then** they can select the category from a dropdown

---

### Epic F4: Meal Planning

#### US-4.1: Create Meal Plan
**As** Pat,
**I want** to create a weekly meal plan with a name and date range,
**So that** I can organize what to cook for the week.

**Acceptance Criteria:**
- **Given** I click "New Meal Plan" on `/meal-plans`
- **When** I enter name "Week of March 17", start date March 17, end date March 23
- **Then** a new meal plan is created and I am taken to the calendar view

#### US-4.2: Add Recipe to Meal Plan
**As** Pat,
**I want** to assign a recipe to a specific day and meal type,
**So that** each meal slot in the calendar has a planned dish.

**Acceptance Criteria:**
- **Given** I am on the meal plan calendar for "Week of March 17"
- **When** I click the Tuesday lunch slot and select "Chicken Stir Fry"
- **Then** the recipe appears in that slot

**Given** Tuesday lunch already has a recipe,
**When** I try to add another,
**Then** I see "This slot already has a recipe. Replace it?" with confirm/cancel.

#### US-4.3: Activate Meal Plan
**As** a user,
**I want** to mark one meal plan as "active",
**So that** the shopping list is generated from the correct plan.

**Acceptance Criteria:**
- **Given** I activate "Week of March 17"
- **Then** any previously active plan is deactivated automatically
- **Then** the shopping list shows items from "Week of March 17"

#### US-4.4: Remove Entry from Meal Plan
**As** a user,
**I want** to remove a recipe from a meal plan slot,
**So that** I can adjust the plan.

**Acceptance Criteria:**
- **Given** I click the X on a meal slot
- **Then** the entry is permanently deleted and the slot is empty

---

### Epic F5: Shopping List

#### US-5.1: Generate Shopping List
**As** Jamie,
**I want** to generate a shopping list from my active meal plan,
**So that** I know exactly what to buy at the grocery store.

**Acceptance Criteria:**
- **Given** my active meal plan has entries for 5 dinners
- **When** I navigate to `/shopping-list`
- **Then** I see all ingredients aggregated by category, with quantities summed where units match

**Given** Recipe A needs "2 cups flour" and Recipe B needs "1 cup flour",
**Then** the shopping list shows "Flour: 3 cups" in the Pantry section.

**Given** Recipe A needs "200g butter" and Recipe B needs "2 tbsp butter",
**Then** units don't match, so the list shows both lines separately.

#### US-5.2: Check Off Items
**As** Pat,
**I want** to check off items as I add them to my cart,
**So that** I don't lose my place while shopping.

**Acceptance Criteria:**
- **Given** I am on `/shopping-list`
- **When** I tap/click a shopping list item
- **Then** it is visually struck through and marked as purchased (persisted in local state, not server)

---

### Epic F6: Recipe Scaling

#### US-6.1: Scale Recipe on Detail Page
**As** Morgan,
**I want** to change the serving count and see all quantities scale instantly,
**So that** I can calculate meal prep amounts without mental math.

**Acceptance Criteria:**
- **Given** a recipe has 4 servings with "1 cup olive oil"
- **When** I set servings to 2
- **Then** the quantity shows "0.5 cups olive oil"
- **When** I set servings to 12
- **Then** the quantity shows "3 cups olive oil"

---

## 5. User Flows

### Flow 1: Registration and First Recipe

```
[Landing /]
    │
    ▼
[Redirect → /login]
    │
    ├─ New user clicks "Create account"
    │       │
    │       ▼
    │  [/register — fill name, email, password]
    │       │
    │       ▼
    │  [POST /auth/register → 201]
    │       │
    │       ▼
    │  [Auto-login → store JWT in Zustand + localStorage]
    │       │
    │       ▼
    │  [Redirect → /recipes]
    │       │
    ▼       ▼
[/recipes — empty state: "No recipes yet. Add your first!"]
    │
    ├─ Click "Add Recipe"
    │       │
    │       ▼
    │  [/recipes/new — fill form]
    │       │
    │       ├─ Add ingredient: type "chick" → autosuggest → select "Chicken breast"
    │       │
    │       ├─ Add ingredient: type "Garlic cloves" → new → auto-create
    │       │
    │       ├─ Fill instructions
    │       │
    │       ▼
    │  [POST /recipes → 201]
    │       │
    │       ▼
    │  [Redirect → /recipes/:id with success toast]
    │       │
    ▼       ▼
[Recipe detail page showing full recipe]
```

### Flow 2: Weekly Meal Planning

```
[/meal-plans]
    │
    ├─ Click "New Meal Plan"
    │       │
    │       ▼
    │  [Modal: name "Week of March 17", dates March 17–23]
    │       │
    │       ▼
    │  [POST /meal-plans → 201]
    │       │
    │       ▼
    │  [/meal-plans/:id — calendar grid view]
    │       │
    │       ├─ Click "Monday Dinner" slot
    │       │       │
    │       │       ▼
    │       │  [Recipe picker modal — search "pasta"]
    │       │       │
    │       │       ▼
    │       │  [Select "Creamy Garlic Pasta"]
    │       │       │
    │       │       ▼
    │       │  [POST /meal-plans/:id/entries → 201]
    │       │       │
    │       │       ▼
    │       │  [Slot shows "Creamy Garlic Pasta"]
    │       │
    │       ├─ Repeat for remaining days
    │       │
    │       ▼
    │  [Click "Activate Plan"]
    │       │
    │       ▼
    │  [POST /meal-plans/:id/activate → 200]
    │       │
    ▼       ▼
[Plan is active — shopping list available]
```

### Flow 3: Generate Shopping List

```
[/shopping-list]
    │
    ├─ No active plan → show "Activate a meal plan first"
    │
    └─ Active plan exists
            │
            ▼
    [GET /meal-plans/:id/shopping-list → aggregated list]
            │
            ▼
    [Display grouped by category]
            │
            ├─ PRODUCE: Garlic (6 cloves), Lemon (2 whole)
            ├─ MEAT: Chicken breast (800g)
            ├─ PANTRY: Flour (3 cups), Olive oil (1.5 cups)
            └─ DAIRY: Butter (4 tbsp), Parmesan (100g)
                    │
                    ▼
    [User taps items → checkmark + strikethrough]
```

### Flow 4: Recipe Scaling (Morgan's Prep Day)

```
[/recipes/:id — Chicken Stir Fry, 4 servings]
    │
    ├─ Serving count input shows "4"
    │
    ├─ Morgan changes to "8"
    │       │
    │       ▼
    │  [All quantities × 2 instantly (client-side calculation)]
    │       │
    │       ├─ "2 tbsp soy sauce" → "4 tbsp soy sauce"
    │       ├─ "1 tsp ginger" → "2 tsp ginger"
    │       └─ "300g chicken" → "600g chicken"
    │
    └─ Morgan copies list mentally / takes screenshot
```

---

## 6. Feature Prioritization (MoSCoW)

### Must Have (v1 MVP — all 3 sprints)

| Feature | Ref | Rationale |
|---------|-----|-----------|
| Email/password auth with JWT | F1 | Gate for all other features |
| Recipe CRUD (create, read, update, soft-delete) | F2.1–F2.5 | Core value proposition |
| Ingredient management with auto-create | F2.2, F3 | Required for recipe creation |
| Recipe search and filtering by title, tag, difficulty, time | F2.6, F2.7 | Essential for library usability |
| Meal plan creation with date range | F4.1, F4.2 | Core workflow |
| Add/remove recipe entries to meal plan | F4.3, F4.6 | Required for planning |
| Single active meal plan | F4.7 | Required for shopping list |
| Shopping list generation with ingredient aggregation | F5.1, F5.2 | Key differentiator |
| Shopping list grouped by category | F5.3 | Usability requirement |
| Recipe scaling (display-only) | F6 | High value, low effort |

### Should Have (v1 stretch goals)

| Feature | Ref | Rationale |
|---------|-----|-----------|
| Nutritional info fields (calories, protein, carbs, fat) | F2.9 | Morgan persona — stored but optional to fill |
| Shopping list check-off persistence (localStorage) | F5.4 | Convenience for shopping trip |
| Ingredient auto-suggest from existing ingredients | F3.4 | Consistency, reduces duplicates |
| servings_override on meal plan entry | F4.3 | Affects shopping list accuracy |

### Could Have (v2 consideration)

| Feature | Ref | Rationale |
|---------|-----|-----------|
| Drag-and-drop meal plan calendar | F4.5 | Nice UX but complex to implement |
| Recipe image upload (vs. URL only) | F2.1 | Requires file storage (S3/Cloudinary) |
| Meal plan sharing with another user | — | Pat persona goal, requires sharing model |
| Macro targets and daily tracking | — | Morgan persona, significant scope |
| "What's in my fridge" filter | — | Jamie's waste-reduction goal |

### Won't Have (v1)

| Feature | Rationale |
|---------|-----------|
| Recipe import from URL | Scraping is complex, legally ambiguous |
| SSO / OAuth (Google, Apple) | Out of scope per SRS F1.5 |
| Mobile native apps | Web responsive is sufficient for MVP |
| Multi-language / i18n | English-only, no RTL needed |
| Push notifications | No notification infrastructure in v1 |
| Offline / PWA | Adds service worker complexity |
| Subscription / payment | MVP is free |

---

## 7. Success Metrics

| Metric | Target | Measurement Method |
|--------|--------|-------------------|
| Recipes created per active user | ≥ 10 within first 30 days | `COUNT(recipes) WHERE user_id = ? AND created_at > NOW() - 30d` |
| Meal plans created per user per week | ≥ 1 per week after day 7 | `COUNT(meal_plans) WHERE user_id = ? GROUP BY week` |
| Shopping list generation rate | ≥ 60% of users with an active plan generate a list | API call count vs. active plan count |
| Recipe search usage | ≥ 80% of recipe list page views include a filter or search | Frontend event tracking |
| Session length | ≥ 5 minutes median on planning days (Sunday) | Page view duration |
| Return rate | ≥ 50% of users return within 7 days of first recipe creation | Login events after first recipe |
| API p95 response time | < 300ms for list endpoints | Server-side timing middleware |
| Test coverage | ≥ 70% lines, ≥ 80% for recipe service and shopping list logic | Vitest coverage report |

---

## 8. Assumptions

1. **Single-tenant MVP:** All recipes are scoped to the creating user. There is no public recipe library or social sharing in v1.
2. **English-only:** The UI and all user-facing text is English. No i18n framework needed.
3. **No image upload:** Recipes accept an `image_url` string. File upload infrastructure is out of scope.
4. **Ingredients are globally shared:** All users draw from the same `ingredients` table. There is no per-user ingredient list.
5. **Shopping list is server-generated, check-off is client-side:** The API aggregates quantities; the frontend stores check-off state in component state (not persisted to DB).
6. **Units must match for aggregation:** The shopping list aggregation only sums quantities with matching units. No unit conversion (e.g., cups to ml) in v1.
7. **No concurrency conflicts:** MVP assumes single-user sessions. No real-time collaboration or optimistic locking needed.
8. **PostgreSQL availability:** The Docker Compose setup runs PostgreSQL locally. No managed DB service for development.
9. **JWT stored in memory + localStorage:** Access token in Zustand store (memory), refresh token in `localStorage` for persistence across tabs.
10. **Soft delete is permanent from user perspective:** Once deleted, a recipe is never shown to the user again, even though it remains in the database.

---

## 9. Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| Unit mismatch in shopping list aggregation leads to duplicate entries | Medium | Low | Document clearly in UI, show both lines with a note |
| Ingredient name normalization causes duplicates ("Garlic" vs "garlic cloves") | High | Medium | Case-insensitive UNIQUE constraint + display warning on near-match |
| Recipe form complexity overwhelms less tech-savvy users (Pat) | Medium | High | Progressive disclosure: basic fields visible, advanced fields collapsed |
| JWT access token expires mid-session causing silent failures | Medium | Medium | Axios interceptor transparently refreshes token on 401 |
| Shopping list is stale after modifying meal plan entries | Low | Medium | Regenerate on every visit to `/shopping-list` (no caching) |

---

*This spec was generated for MealMap v1.0 (MVP). Review against `specs/backlog.md` for sprint-level ticket breakdown.*
