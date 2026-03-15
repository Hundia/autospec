# MealMap — Frontend Lead Specification

> **Role:** Frontend Lead
> **Cross-references:** `specs/02_backend_lead.md` (API contracts), `specs/01_product_manager.md` (user stories), `specs/backlog.md` (tickets)

---

## 1. Tech Stack

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| Framework | React | 18.x | UI component model with concurrent features |
| Build tool | Vite | 5.x | Fast dev server, optimized production builds |
| Language | TypeScript | 5.x | Full type safety throughout |
| Styling | Tailwind CSS | 3.x | Utility-first CSS, no custom CSS files |
| State management | Zustand | 4.x | Lightweight global stores |
| Routing | React Router | 6.x | Nested routes, lazy loading, auth guards |
| HTTP client | Axios | 1.x | API calls with interceptors |
| Forms | react-hook-form + Zod | latest | Performant forms with schema validation |
| Notifications | react-hot-toast | 2.x | Success/error toasts |
| Icons | Lucide React | latest | Consistent icon set |

---

## 2. Project Directory Structure

```
web/
├── index.html
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
├── package.json
├── src/
│   ├── main.tsx                  # React 18 createRoot entry
│   ├── App.tsx                   # Router setup, Toaster
│   ├── router.tsx                # Route definitions with lazy loading
│   ├── api/
│   │   ├── client.ts             # Axios instance, interceptors
│   │   ├── auth.api.ts           # register, login, refresh, logout
│   │   ├── recipes.api.ts        # CRUD + list/filter
│   │   ├── ingredients.api.ts    # list, create
│   │   ├── mealPlans.api.ts      # CRUD + activate
│   │   ├── mealPlanEntries.api.ts # add, remove entries
│   │   └── shoppingList.api.ts   # generate
│   ├── stores/
│   │   ├── authStore.ts          # user, tokens, login/logout actions
│   │   ├── recipeStore.ts        # recipes list, active recipe, filters
│   │   └── mealPlanStore.ts      # plans list, active plan, entries
│   ├── types/
│   │   ├── auth.types.ts
│   │   ├── recipe.types.ts
│   │   ├── ingredient.types.ts
│   │   ├── mealPlan.types.ts
│   │   └── shoppingList.types.ts
│   ├── components/
│   │   ├── atoms/
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Textarea.tsx
│   │   │   ├── Select.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Spinner.tsx
│   │   │   └── Checkbox.tsx
│   │   ├── molecules/
│   │   │   ├── FormField.tsx         # label + input + error message
│   │   │   ├── RecipeCard.tsx        # recipe summary card
│   │   │   ├── IngredientRow.tsx     # single ingredient in form
│   │   │   ├── IngredientAutosuggest.tsx  # typeahead for ingredient names
│   │   │   ├── MealSlot.tsx          # calendar cell (day × meal type)
│   │   │   ├── TagInput.tsx          # multi-tag input with add/remove
│   │   │   ├── DifficultyBadge.tsx   # colored badge: easy/medium/hard
│   │   │   ├── NutritionPanel.tsx    # calories/protein/carbs/fat display
│   │   │   └── SearchBar.tsx         # search input with debounce
│   │   ├── organisms/
│   │   │   ├── RecipeList.tsx        # grid of RecipeCard with empty state
│   │   │   ├── RecipeForm.tsx        # full create/edit form
│   │   │   ├── RecipeFilters.tsx     # tag, difficulty, max time filters
│   │   │   ├── IngredientList.tsx    # read-only ingredient table with scaling
│   │   │   ├── MealCalendar.tsx      # 7-day × 4-meal-type grid
│   │   │   ├── ShoppingList.tsx      # grouped items with checkboxes
│   │   │   └── RecipePicker.tsx      # search modal to select recipe for slot
│   │   └── layout/
│   │       ├── AppLayout.tsx         # sidebar + main content area
│   │       ├── Sidebar.tsx           # nav links
│   │       ├── Header.tsx            # page title + user menu
│   │       └── AuthLayout.tsx        # centered card for login/register
│   ├── pages/
│   │   ├── auth/
│   │   │   ├── LoginPage.tsx
│   │   │   └── RegisterPage.tsx
│   │   ├── recipes/
│   │   │   ├── RecipeListPage.tsx
│   │   │   ├── RecipeDetailPage.tsx
│   │   │   ├── CreateRecipePage.tsx
│   │   │   └── EditRecipePage.tsx
│   │   ├── meal-plans/
│   │   │   ├── MealPlanListPage.tsx
│   │   │   └── MealPlanCalendarPage.tsx
│   │   └── shopping/
│   │       └── ShoppingListPage.tsx
│   ├── hooks/
│   │   ├── useAuth.ts            # auth state + redirect guard
│   │   ├── useRecipes.ts         # fetch + filter recipes
│   │   ├── useMealPlan.ts        # fetch plan + entries
│   │   └── useShoppingList.ts    # fetch shopping list
│   └── utils/
│       ├── scaleIngredients.ts   # scale(quantity, originalServings, targetServings)
│       ├── formatQuantity.ts     # format decimals nicely (0.5 → "½")
│       └── groupByCategory.ts    # group shopping list items by category
├── tests/
│   ├── components/
│   │   ├── RecipeCard.test.tsx
│   │   ├── IngredientRow.test.tsx
│   │   └── MealSlot.test.tsx
│   └── utils/
│       ├── scaleIngredients.test.ts
│       └── formatQuantity.test.ts
└── vitest.config.ts
```

---

## 3. Component Hierarchy

```
App
├── AuthLayout (login, register)
│   ├── LoginPage
│   │   └── FormField (atoms)
│   └── RegisterPage
│       └── FormField (atoms)
│
└── AppLayout (authenticated)
    ├── Sidebar
    │   └── NavLink × 4
    ├── Header
    └── [Page content]
        │
        ├── RecipeListPage
        │   ├── SearchBar
        │   ├── RecipeFilters
        │   │   ├── TagInput (filter by tag)
        │   │   ├── Select (difficulty)
        │   │   └── Input (max time)
        │   └── RecipeList
        │       └── RecipeCard × N
        │           ├── Badge (difficulty)
        │           └── DifficultyBadge
        │
        ├── CreateRecipePage / EditRecipePage
        │   └── RecipeForm
        │       ├── FormField × N (title, description, times, servings)
        │       ├── Select (difficulty)
        │       ├── TagInput (tags)
        │       ├── IngredientRow × N (dynamic list)
        │       │   └── IngredientAutosuggest
        │       ├── Textarea (instructions)
        │       └── NutritionPanel (optional fields)
        │
        ├── RecipeDetailPage
        │   ├── DifficultyBadge
        │   ├── Badge × N (tags)
        │   ├── [Serving scaler — number input]
        │   ├── IngredientList (read-only, scaled)
        │   └── NutritionPanel
        │
        ├── MealPlanListPage
        │   └── Card × N (meal plan summaries)
        │
        ├── MealPlanCalendarPage
        │   └── MealCalendar
        │       └── MealSlot × (days × 4)
        │           └── RecipePicker (modal on click)
        │               └── SearchBar + RecipeList
        │
        └── ShoppingListPage
            └── ShoppingList
                ├── [Category headers]
                └── Checkbox + item row × N
```

---

## 4. Routing Table

| Path | Component | Auth Required | Lazy | Notes |
|------|-----------|---------------|------|-------|
| `/` | Redirect | No | — | Redirects to `/recipes` if logged in, `/login` if not |
| `/login` | LoginPage | No (redirect if authed) | No | Auth layout |
| `/register` | RegisterPage | No (redirect if authed) | No | Auth layout |
| `/recipes` | RecipeListPage | Yes | Yes | List with search/filter |
| `/recipes/new` | CreateRecipePage | Yes | Yes | Full recipe form |
| `/recipes/:id` | RecipeDetailPage | Yes | Yes | Recipe + scaling |
| `/recipes/:id/edit` | EditRecipePage | Yes | Yes | Prefilled form |
| `/meal-plans` | MealPlanListPage | Yes | Yes | List + create |
| `/meal-plans/:id` | MealPlanCalendarPage | Yes | Yes | Calendar grid |
| `/shopping-list` | ShoppingListPage | Yes | Yes | Active plan list |
| `*` | NotFoundPage | No | No | 404 catch-all |

### Auth Guard Implementation

```typescript
// src/components/layout/ProtectedRoute.tsx
export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuthStore();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return <>{children}</>;
}
```

### Lazy Loading

```typescript
// src/router.tsx
const RecipeListPage = lazy(() => import('./pages/recipes/RecipeListPage'));
const CreateRecipePage = lazy(() => import('./pages/recipes/CreateRecipePage'));
const MealPlanCalendarPage = lazy(() => import('./pages/meal-plans/MealPlanCalendarPage'));
const ShoppingListPage = lazy(() => import('./pages/shopping/ShoppingListPage'));
```

---

## 5. Design System Tokens

### Color Palette

| Token Name | Hex Value | Usage |
|-----------|-----------|-------|
| `primary-50` | `#f0fdf4` | Light green background tints |
| `primary-100` | `#dcfce7` | Button hover backgrounds |
| `primary-200` | `#bbf7d0` | Borders on focus |
| `primary-500` | `#22c55e` | Primary buttons, active states |
| `primary-600` | `#16a34a` | Button hover |
| `primary-700` | `#15803d` | Button pressed |
| `amber-400` | `#fbbf24` | Warning toasts, medium difficulty |
| `amber-500` | `#f59e0b` | Tag backgrounds |
| `red-500` | `#ef4444` | Error states, hard difficulty badge |
| `red-600` | `#dc2626` | Delete button hover |
| `gray-50` | `#f9fafb` | Page background |
| `gray-100` | `#f3f4f6` | Card backgrounds |
| `gray-200` | `#e5e7eb` | Borders, dividers |
| `gray-500` | `#6b7280` | Secondary text, placeholders |
| `gray-700` | `#374151` | Primary text |
| `gray-900` | `#111827` | Headings |
| `white` | `#ffffff` | Card backgrounds, modal backgrounds |

### Tailwind Config Additions

```javascript
// tailwind.config.js
module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0fdf4',
          100: '#dcfce7',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
};
```

### Typography Scale

| Token | Class | Size | Weight | Line Height | Usage |
|-------|-------|------|--------|-------------|-------|
| Display | `text-3xl font-bold` | 30px | 700 | 36px | Page headings |
| Heading 1 | `text-2xl font-semibold` | 24px | 600 | 32px | Section headings |
| Heading 2 | `text-xl font-semibold` | 20px | 600 | 28px | Card headings |
| Heading 3 | `text-lg font-medium` | 18px | 500 | 28px | Subsection labels |
| Body | `text-sm` or `text-base` | 14–16px | 400 | 20–24px | Body text |
| Caption | `text-xs text-gray-500` | 12px | 400 | 16px | Metadata, timestamps |

### Spacing Scale (used in Tailwind)

| Scale | Value | Usage |
|-------|-------|-------|
| 1 | 4px | Tight spacing between related items |
| 2 | 8px | Icon + label gap |
| 3 | 12px | Input padding |
| 4 | 16px | Card padding, standard gap |
| 6 | 24px | Section spacing |
| 8 | 32px | Large gaps |
| 12 | 48px | Page-level spacing |
| 16 | 64px | Hero sections |

### Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `rounded` | 4px | Inputs, small elements |
| `rounded-md` | 6px | Buttons, badges |
| `rounded-lg` | 8px | Cards |
| `rounded-xl` | 12px | Modals |
| `rounded-full` | 9999px | Tags, avatars |

### Shadows

| Token | Value | Usage |
|-------|-------|-------|
| `shadow-sm` | `0 1px 2px rgba(0,0,0,0.05)` | Cards at rest |
| `shadow-md` | `0 4px 6px rgba(0,0,0,0.07)` | Hover cards, dropdowns |
| `shadow-lg` | `0 10px 15px rgba(0,0,0,0.10)` | Modals |

---

## 6. Atom Components

### Button

```typescript
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'danger' | 'ghost';
  size: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  children: React.ReactNode;
}
```

| Variant | Base Classes | Hover | Disabled |
|---------|-------------|-------|----------|
| primary | `bg-brand-500 text-white` | `bg-brand-600` | `opacity-50 cursor-not-allowed` |
| secondary | `border border-gray-200 text-gray-700 bg-white` | `bg-gray-50` | `opacity-50` |
| danger | `bg-red-500 text-white` | `bg-red-600` | `opacity-50` |
| ghost | `text-gray-600` | `bg-gray-100` | `opacity-50` |

### Input

```typescript
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
}
```

States: default (border-gray-200), focus (border-brand-500 ring-1 ring-brand-200), error (border-red-500), disabled (bg-gray-50).

### Badge

```typescript
interface BadgeProps {
  variant: 'green' | 'amber' | 'red' | 'gray' | 'blue';
  children: React.ReactNode;
}
```

Used for: difficulty labels, tags, meal types.

### Card

```typescript
interface CardProps {
  padding?: 'sm' | 'md' | 'lg';
  hoverable?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}
```

---

## 7. State Management

### authStore

```typescript
// src/stores/authStore.ts
interface AuthState {
  user: { id: string; name: string; email: string } | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;

  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  refreshAccessToken: () => Promise<void>;
}
```

**Persistence:** `refreshToken` persisted to `localStorage` via Zustand persist middleware. `accessToken` kept in memory only (security).

**On app load:** Read `refreshToken` from localStorage → call `/auth/refresh` → if success, hydrate store → navigate to app. If refresh fails → clear store → navigate to `/login`.

### recipeStore

```typescript
interface RecipeState {
  recipes: Recipe[];
  activeRecipe: RecipeWithIngredients | null;
  filters: {
    search: string;
    tag: string | null;
    difficulty: 'easy' | 'medium' | 'hard' | null;
    maxTime: number | null;
  };
  pagination: { page: number; limit: number; total: number; totalPages: number };
  isLoading: boolean;
  error: string | null;

  fetchRecipes: () => Promise<void>;
  fetchRecipeById: (id: string) => Promise<void>;
  setFilter: (key: keyof RecipeState['filters'], value: unknown) => void;
  clearFilters: () => void;
  createRecipe: (data: CreateRecipeDto) => Promise<Recipe>;
  updateRecipe: (id: string, data: UpdateRecipeDto) => Promise<Recipe>;
  deleteRecipe: (id: string) => Promise<void>;
}
```

**Local vs. global:** Filters and pagination state are global (persist between navigations). Active recipe is cleared when navigating away.

### mealPlanStore

```typescript
interface MealPlanState {
  plans: MealPlan[];
  activePlan: MealPlanWithEntries | null;
  entries: MealPlanEntry[];
  isLoading: boolean;
  error: string | null;

  fetchPlans: () => Promise<void>;
  fetchPlanWithEntries: (id: string) => Promise<void>;
  createPlan: (data: CreateMealPlanDto) => Promise<MealPlan>;
  activatePlan: (id: string) => Promise<void>;
  addEntry: (planId: string, data: CreateEntryDto) => Promise<void>;
  removeEntry: (planId: string, entryId: string) => Promise<void>;
  deletePlan: (id: string) => Promise<void>;
}
```

---

## 8. API Client Abstraction

### Axios Instance

```typescript
// src/api/client.ts
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:4000/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

// Request interceptor: attach access token
apiClient.interceptors.request.use((config) => {
  const { accessToken } = useAuthStore.getState();
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// Response interceptor: handle 401 → refresh → retry
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await useAuthStore.getState().refreshAccessToken();
        return apiClient(originalRequest);
      } catch {
        useAuthStore.getState().logout();
        window.location.href = '/login';
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);
```

### Error Handling Pattern

```typescript
// src/api/recipes.api.ts
export async function fetchRecipes(query: RecipeQuery): Promise<RecipeListResponse> {
  try {
    const response = await apiClient.get<RecipeListResponse>('/recipes', { params: query });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message ?? 'Failed to fetch recipes');
    }
    throw error;
  }
}
```

---

## 9. Form Handling Pattern

### react-hook-form + Zod

```typescript
// src/components/organisms/RecipeForm.tsx (pattern)
const recipeFormSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  prepTimeMinutes: z.number({ invalid_type_error: 'Must be a number' }).int().min(0),
  cookTimeMinutes: z.number({ invalid_type_error: 'Must be a number' }).int().min(0),
  servings: z.number().int().min(1).max(50),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  // ...
});

export function RecipeForm({ defaultValues, onSubmit }: RecipeFormProps) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RecipeFormValues>({
    resolver: zodResolver(recipeFormSchema),
    defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormField label="Title" error={errors.title?.message}>
        <Input {...register('title')} error={errors.title?.message} />
      </FormField>
      {/* ... */}
      <Button type="submit" variant="primary" isLoading={isSubmitting}>
        Save Recipe
      </Button>
    </form>
  );
}
```

### Dynamic Ingredient List

The ingredient list in RecipeForm uses `useFieldArray` from react-hook-form:

```typescript
const { fields, append, remove } = useFieldArray({ control, name: 'ingredients' });
```

Each ingredient row renders `IngredientRow` with:
- `IngredientAutosuggest` for name (calls GET /ingredients?search=...)
- Input for quantity (number)
- Select for unit (cups | tbsp | tsp | oz | g | ml | whole | pinch | lb)
- Remove button

---

## 10. Key Page Behaviors

### RecipeListPage

- On mount: call `recipeStore.fetchRecipes()`
- Search: debounced 300ms → update filter → refetch
- Tag/difficulty/maxTime filter: immediate update → refetch
- Pagination: "Load more" button (append to list) vs. numbered pages (replace)
- Empty state: "No recipes found. [Add your first recipe]" link
- Loading state: skeleton cards (3 rows of 3 placeholder cards)

### RecipeDetailPage

- On mount: call `recipeStore.fetchRecipeById(id)`
- Serving scaler: local `useState<number>(recipe.servings)` — does NOT update store
- Ingredient quantities: computed via `scaleIngredients(ingredients, originalServings, targetServings)`
- Edit button: navigates to `/recipes/:id/edit`
- Delete button: shows confirmation dialog → calls `recipeStore.deleteRecipe(id)` → navigates to `/recipes`

### MealPlanCalendarPage

- Calendar grid: rows = dates in range (day of week label + date), columns = breakfast | lunch | dinner | snack
- Each `MealSlot` shows recipe title if assigned, or "+ Add" button
- Clicking an empty slot opens `RecipePicker` modal
- `RecipePicker` shows searchable recipe list; selecting a recipe calls `mealPlanStore.addEntry(...)`
- Clicking X on a filled slot calls `mealPlanStore.removeEntry(...)` after confirm

### ShoppingListPage

- On mount: fetch active meal plan (from `mealPlanStore.plans` where `isActive === true`)
- If no active plan: show "No active meal plan. [Go to Meal Plans]" empty state
- If active plan exists: call `shoppingList.api.ts getShoppingList(planId)`
- Render items grouped by category with category headers
- Check-off: local `useState<Set<string>>` of checked ingredient IDs — not persisted to server
- "Regenerate" button: refetch the shopping list

---

## 11. Recipe Scaling Utility

```typescript
// src/utils/scaleIngredients.ts
export function scaleIngredients(
  ingredients: RecipeIngredient[],
  originalServings: number,
  targetServings: number
): RecipeIngredient[] {
  const factor = targetServings / originalServings;
  return ingredients.map((ing) => ({
    ...ing,
    quantity: parseFloat((parseFloat(ing.quantity) * factor).toFixed(2)),
  }));
}

// src/utils/formatQuantity.ts
// Format 0.5 → "½", 0.25 → "¼", 0.33 → "⅓", others → decimal string
export function formatQuantity(quantity: number): string {
  const fractions: [number, string][] = [
    [0.25, '¼'], [0.33, '⅓'], [0.5, '½'], [0.67, '⅔'], [0.75, '¾'],
  ];
  const whole = Math.floor(quantity);
  const decimal = quantity - whole;
  const fraction = fractions.find(([val]) => Math.abs(decimal - val) < 0.03);
  if (fraction && whole > 0) return `${whole} ${fraction[1]}`;
  if (fraction) return fraction[1];
  if (decimal === 0) return `${whole}`;
  return quantity.toString();
}
```

---

## 12. Performance Targets

| Metric | Target | Measurement |
|--------|--------|-------------|
| LCP (Largest Contentful Paint) | < 2.5s | Lighthouse, WebVitals |
| FID (First Input Delay) | < 100ms | Lighthouse |
| CLS (Cumulative Layout Shift) | < 0.1 | Lighthouse |
| Bundle size (initial JS) | < 200KB gzipped | Vite bundle analyzer |
| Route chunk size | < 50KB each | Vite bundle analyzer |
| Time to interactive | < 3.5s on 3G | Lighthouse |

### Optimization Strategies

1. **Code splitting:** All pages are lazy-loaded via `React.lazy()` + `Suspense`
2. **Image optimization:** `loading="lazy"` on all recipe images; `width` and `height` attributes set to prevent CLS
3. **Debounced search:** 300ms debounce on recipe search input
4. **Pagination:** Default 20 recipes per page; load more on demand
5. **Memoization:** `React.memo` on `RecipeCard`, `MealSlot`, `IngredientRow`
6. **Selector optimization:** Zustand selectors with shallow equality checks

---

## 13. TypeScript Types

```typescript
// src/types/recipe.types.ts
export interface Recipe {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  servings: number;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
  imageUrl: string | null;
  caloriesPerServing: number | null;
  proteinGrams: string | null;
  carbsGrams: string | null;
  fatGrams: string | null;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RecipeIngredient {
  id: string;
  name: string;
  category: IngredientCategory;
  quantity: string;
  unit: string;
}

export interface RecipeWithIngredients extends Recipe {
  ingredients: RecipeIngredient[];
}

// src/types/mealPlan.types.ts
export interface MealPlan {
  id: string;
  userId: string;
  name: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MealPlanEntry {
  id: string;
  mealPlanId: string;
  recipeId: string;
  date: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  servingsOverride: number | null;
  recipe?: Recipe;
}

// src/types/shoppingList.types.ts
export type IngredientCategory = 'produce' | 'dairy' | 'meat' | 'pantry' | 'frozen' | 'other';

export interface ShoppingListItem {
  ingredientId: string;
  name: string;
  category: IngredientCategory;
  lines: { quantity: string; unit: string }[];
}

export interface ShoppingListResponse {
  mealPlanId: string;
  mealPlanName: string;
  items: ShoppingListItem[];
  groupedByCategory: Record<IngredientCategory, string[]>;
}
```

---

## 14. Environment Variables

```env
# .env (development)
VITE_API_URL=http://localhost:4000/api
```

```env
# .env.production
VITE_API_URL=/api
```

---

*This spec is the source of truth for all frontend implementation. API shape comes from `specs/02_backend_lead.md`. Test scenarios from `specs/05_qa_lead.md`.*
