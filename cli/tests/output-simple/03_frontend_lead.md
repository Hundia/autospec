---
role: frontend_lead
spec_version: "1.0"
generated_by: autospec v0.2.0
model: auto
provider: claude-code
source_srs: srs-simple.md
source_hash: "sha256:7458b2f5b29602d300ec5766ab196f4f026b7aca8470f82fe507d40b7c83ea36"
generated_at: 2026-03-21T09:37:10.985Z
---

# 03 — Frontend Lead Specification: TaskFlow

## Tech Stack

| Layer | Technology | Version | Rationale |
|-------|-----------|---------|-----------|
| Framework | React | 18.x | Component model, large ecosystem, PWA-friendly |
| Language | TypeScript | 5.x | Full-stack type safety with backend |
| Build Tool | Vite | 5.x | Fast HMR, native ESM, tree-shaking, PWA plugin |
| Styling | Tailwind CSS | 3.x | Utility-first, small bundle with purge, responsive primitives |
| State Management | Zustand | 4.x | Lightweight, no boilerplate, supports persist middleware for offline |
| Server Cache | TanStack Query (React Query) | 5.x | Cache, background refetch, offline mutation queue |
| Routing | React Router | 6.x | Nested routes, loaders, auth guards |
| Forms | React Hook Form + Zod | 7.x / 3.x | Performant uncontrolled forms, schema validation shared with backend |
| PWA | vite-plugin-pwa (Workbox) | 0.17+ | Service worker generation, precaching, runtime caching |
| HTTP Client | ky | 1.x | Lightweight fetch wrapper, retry, hooks for auth header injection |
| Icons | Lucide React | 0.3+ | Tree-shakeable, consistent stroke-based icon set |
| Date Handling | date-fns | 3.x | Tree-shakeable, immutable, locale support |
| Testing | Vitest + Testing Library | 1.x / 14.x | Fast unit/integration tests aligned with Vite |

## Component Architecture

### Component Tree

<App>
├── <AuthProvider>                    # JWT context, token refresh
│   ├── <QueryClientProvider>         # TanStack Query client
│   │   ├── <RouterProvider>          # React Router 6
│   │   │   ├── <PublicLayout>        # No sidebar, centered card
│   │   │   │   ├── <LoginPage>
│   │   │   │   └── <RegisterPage>
│   │   │   ├── <AppLayout>           # Sidebar + header + main area
│   │   │   │   ├── <Sidebar>
│   │   │   │   ├── <Header>          # Search bar, user menu
│   │   │   │   └── <Outlet>          # Page content
│   │   │   │       ├── <DashboardPage>
│   │   │   │       ├── <TaskListPage>
│   │   │   │       ├── <TaskDetailPage>
│   │   │   │       ├── <CategoriesPage>
│   │   │   │       └── <SettingsPage>
│   │   │   └── <NotFoundPage>
│   │   └── <OfflineBanner>           # Shows when navigator.onLine is false
│   └── <Toaster>                     # Global toast notifications
└── <ServiceWorkerRegistration>       # SW update prompt

### Shared Primitives

All primitives live in `src/components/primitives/`. Each accepts `className` for Tailwind overrides.

| Component | Props | Description |
|-----------|-------|-------------|
| `Button` | `variant: 'primary' \| 'secondary' \| 'ghost' \| 'danger'`, `size: 'sm' \| 'md' \| 'lg'`, `loading`, `disabled` | All interactive actions |
| `Input` | `label`, `error`, `helperText`, `type` | Text/email/password fields with floating label |
| `Select` | `label`, `options`, `error`, `placeholder` | Native select with styled wrapper |
| `TextArea` | `label`, `error`, `rows` | Multi-line input |
| `Card` | `variant: 'elevated' \| 'outlined'`, `clickable`, `padding` | Container for task cards, stats |
| `Badge` | `variant: 'priority-low' \| 'priority-medium' \| 'priority-high' \| 'status-complete' \| 'status-pending' \| 'category'`, `color` | Priority, status, category labels |
| `Modal` | `open`, `onClose`, `title`, `size: 'sm' \| 'md' \| 'lg'` | Dialogs for task create/edit, confirm delete |
| `Checkbox` | `checked`, `indeterminate`, `onChange`, `label` | Task completion toggle |
| `Skeleton` | `variant: 'text' \| 'card' \| 'circle'`, `width`, `height` | Loading placeholders |
| `EmptyState` | `icon`, `title`, `description`, `action` | Zero-data screens |
| `ErrorCard` | `title`, `message`, `onRetry` | API error display |
| `SearchInput` | `value`, `onChange`, `placeholder`, `debounceMs` | Debounced search field (300ms) |
| `Avatar` | `name`, `size` | User initials avatar |
| `ProgressBar` | `value`, `max`, `label` | Completion stats |
| `DatePicker` | `value`, `onChange`, `min`, `error` | Native date input with styled wrapper |

### Page Components

| Page | File | Description | Persona Reference |
|------|------|-------------|-------------------|
| `LoginPage` | `src/pages/LoginPage.tsx` | Email + password login form | Both Noa and Amit |
| `RegisterPage` | `src/pages/RegisterPage.tsx` | Registration with email, password, confirm password | New users (Flow 1 from 01_product_manager.md) |
| `DashboardPage` | `src/pages/DashboardPage.tsx` | Today's tasks, overdue items, completion stats | Noa's morning triage (Flow 2); Amit's daily check |
| `TaskListPage` | `src/pages/TaskListPage.tsx` | Full task list with filters and search | Both personas for search (Flow 3) |
| `TaskDetailPage` | `src/pages/TaskDetailPage.tsx` | Single task view/edit inline | Both personas |
| `CategoriesPage` | `src/pages/CategoriesPage.tsx` | CRUD for user-defined categories | Noa organizing by client; Amit by course |
| `SettingsPage` | `src/pages/SettingsPage.tsx` | Password change, account info, logout | Both personas |
| `NotFoundPage` | `src/pages/NotFoundPage.tsx` | 404 with link back to dashboard | — |

### Feature Components

| Component | Location | Description |
|-----------|----------|-------------|
| `TaskCard` | `src/components/tasks/TaskCard.tsx` | Compact task row: checkbox, title, due date badge, priority badge, category badge |
| `TaskForm` | `src/components/tasks/TaskForm.tsx` | Create/edit form in modal: title, description, due date, priority select, category select |
| `TaskFilters` | `src/components/tasks/TaskFilters.tsx` | Filter bar: category dropdown, priority dropdown, status toggle, sort select |
| `DashboardStats` | `src/components/dashboard/DashboardStats.tsx` | Three stat cards: completed today, completed this week, total completion rate |
| `TodayTasks` | `src/components/dashboard/TodayTasks.tsx` | List of tasks due today with quick-complete |
| `OverdueTasks` | `src/components/dashboard/OverdueTasks.tsx` | List of overdue tasks with urgency highlight |
| `CategoryCard` | `src/components/categories/CategoryCard.tsx` | Category name, color swatch, task count, edit/delete actions |
| `CategoryForm` | `src/components/categories/CategoryForm.tsx` | Create/edit category: name, color picker |
| `OfflineBanner` | `src/components/layout/OfflineBanner.tsx` | Persistent top banner when offline |
| `SyncIndicator` | `src/components/layout/SyncIndicator.tsx` | Shows pending sync count, syncing animation |
| `ConfirmDialog` | `src/components/shared/ConfirmDialog.tsx` | Delete confirmation modal |

## Routing

All routes use `createBrowserRouter` from React Router 6.

| Path | Component | Auth Guard | Page Title | Description |
|------|-----------|-----------|------------|-------------|
| `/login` | `LoginPage` | `PublicOnly` (redirects to `/` if authed) | "Log In — TaskFlow" | Email/password login |
| `/register` | `RegisterPage` | `PublicOnly` | "Sign Up — TaskFlow" | New account registration |
| `/` | `DashboardPage` | `RequireAuth` | "Dashboard — TaskFlow" | Today's tasks, overdue, stats |
| `/tasks` | `TaskListPage` | `RequireAuth` | "Tasks — TaskFlow" | Full task list with filters |
| `/tasks/:taskId` | `TaskDetailPage` | `RequireAuth` | "Task Detail — TaskFlow" | View/edit single task |
| `/categories` | `CategoriesPage` | `RequireAuth` | "Categories — TaskFlow" | Manage categories |
| `/settings` | `SettingsPage` | `RequireAuth` | "Settings — TaskFlow" | Account settings |
| `*` | `NotFoundPage` | None | "Not Found — TaskFlow" | 404 catch-all |

### Auth Guards

```typescript
// RequireAuth: wraps <Outlet>, checks for valid JWT in Zustand store
// If no token or token expired → redirect to /login with ?returnTo=<current_path>
// On mount, attempts silent refresh via POST /api/v1/auth/refresh (02_backend_lead.md)

// PublicOnly: wraps <Outlet>, if valid JWT exists → redirect to /

### Route Params

| Route | Param | Type | Validation |
|-------|-------|------|-----------|
| `/tasks/:taskId` | `taskId` | UUID (string) | Validated by backend; frontend shows 404 on `404` response |

## State Management

### Global Store (Zustand with `persist` middleware)

**Auth Store** — `src/stores/authStore.ts`

```typescript
interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: { id: string; email: string } | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshAccessToken: () => Promise<void>;
}

- Persisted to `localStorage` key `taskflow-auth`
- Token refresh triggered by 401 response interceptor in HTTP client
- On logout: clears store, clears React Query cache, redirects to `/login`

**Offline Store** — `src/stores/offlineStore.ts`

```typescript
interface OfflineState {
  isOnline: boolean;
  pendingMutations: OfflineMutation[];  // queued create/update/delete ops
  lastSyncedAt: string | null;
  addMutation: (mutation: OfflineMutation) => void;
  removeMutation: (id: string) => void;
  setOnline: (status: boolean) => void;
}

- Persisted to `localStorage` key `taskflow-offline`
- Mutations queued when offline, replayed via `POST /api/v1/sync/push` on reconnect (02_backend_lead.md)

### Server Cache (TanStack Query)

| Query Key | Endpoint (02_backend_lead.md) | Stale Time | Cache Time | Refetch |
|-----------|-------------------------------|-----------|------------|---------|
| `['tasks', filters]` | `GET /api/v1/tasks` | 30s | 5min | On window focus |
| `['tasks', taskId]` | `GET /api/v1/tasks/:id` | 30s | 5min | On mount |
| `['categories']` | `GET /api/v1/categories` | 60s | 10min | On window focus |
| `['dashboard']` | `GET /api/v1/dashboard` | 15s | 2min | On window focus |
| `['dashboard', 'stats']` | `GET /api/v1/dashboard/stats` | 30s | 5min | On window focus |

### Cache Invalidation Strategy

| Mutation | Invalidates | Optimistic Update |
|----------|-------------|-------------------|
| Create task | `['tasks']`, `['dashboard']` | Prepend to task list |
| Update task | `['tasks']`, `['tasks', taskId]`, `['dashboard']` | Update in-place |
| Delete task | `['tasks']`, `['dashboard']` | Remove from list |
| Toggle task status | `['tasks']`, `['tasks', taskId]`, `['dashboard']` | Toggle checkbox immediately |
| Create category | `['categories']` | Append to list |
| Update category | `['categories']` | Update in-place |
| Delete category | `['categories']`, `['tasks']` | Remove from list |

### Local Component State

These do NOT go in global stores:

- Form field values (managed by React Hook Form)
- Modal open/close state
- Current filter/sort selections on `TaskListPage` (URL search params via `useSearchParams`)
- Search query input value (debounced before triggering query)
- Sidebar collapsed state (CSS-only on mobile via Tailwind `hidden`/`block`)

## API Integration

### HTTP Client Setup

```typescript
// src/lib/api.ts
import ky from 'ky';

const api = ky.create({
  prefixUrl: '/api/v1',
  hooks: {
    beforeRequest: [(request) => {
      const token = useAuthStore.getState().accessToken;
      if (token) request.headers.set('Authorization', `Bearer ${token}`);
    }],
    afterResponse: [async (request, options, response) => {
      if (response.status === 401) {
        // Attempt token refresh, retry original request
        await useAuthStore.getState().refreshAccessToken();
        return ky(request);
      }
    }]
  }
});

### API Service Layer

Each service maps 1:1 to backend endpoints from `02_backend_lead.md`:

**Auth Service** — `src/services/authApi.ts`

| Method | Endpoint | Request | Success | Error States |
|--------|----------|---------|---------|--------------|
| `register` | `POST /api/v1/auth/register` | `{ email, password }` | Store tokens, redirect to `/` | 409 Conflict → "Email already registered" toast |
| `login` | `POST /api/v1/auth/login` | `{ email, password }` | Store tokens, redirect to returnTo or `/` | 401 → "Invalid email or password" inline error |
| `refresh` | `POST /api/v1/auth/refresh` | `{ refreshToken }` | Update access token silently | 401 → Force logout |
| `logout` | `POST /api/v1/auth/logout` | `{ refreshToken }` | Clear store, redirect `/login` | Ignore errors, clear anyway |

**Task Service** — `src/services/taskApi.ts`

| Method | Endpoint | Loading State | Success State | Error State |
|--------|----------|--------------|---------------|-------------|
| `listTasks` | `GET /api/v1/tasks?status=&priority=&category_id=&q=&page=&limit=&sort=` | Skeleton cards (3 rows) | Render `TaskCard` list | `ErrorCard` with retry button |
| `getTask` | `GET /api/v1/tasks/:id` | Full-page skeleton | Render `TaskDetailPage` content | 404 → `NotFoundPage`; other → `ErrorCard` |
| `createTask` | `POST /api/v1/tasks` | Button shows spinner, disabled | Close modal, toast "Task created", invalidate queries | Validation → inline field errors; 500 → toast "Failed to create task" |
| `updateTask` | `PUT /api/v1/tasks/:id` | Save button spinner | Toast "Task updated", invalidate queries | Validation → inline errors; 404 → toast "Task not found" |
| `deleteTask` | `DELETE /api/v1/tasks/:id` | Confirm dialog shows spinner | Toast "Task deleted", navigate to `/tasks` | Toast "Failed to delete task" |
| `toggleStatus` | `PATCH /api/v1/tasks/:id/status` | Checkbox shows optimistic toggle | Invalidate dashboard stats | Revert checkbox, toast error |

**Category Service** — `src/services/categoryApi.ts`

| Method | Endpoint | Loading State | Success State | Error State |
|--------|----------|--------------|---------------|-------------|
| `listCategories` | `GET /api/v1/categories` | Skeleton cards | Render `CategoryCard` list | `ErrorCard` with retry |
| `createCategory` | `POST /api/v1/categories` | Button spinner | Close form, toast "Category created" | 409 → "Category name already exists" |
| `updateCategory` | `PUT /api/v1/categories/:id` | Button spinner | Toast "Category updated" | Validation → inline errors |
| `deleteCategory` | `DELETE /api/v1/categories/:id` | Confirm dialog spinner | Toast "Category deleted" | 409 if tasks assigned → toast "Remove tasks from this category first" |

**Dashboard Service** — `src/services/dashboardApi.ts`

| Method | Endpoint | Loading State | Success State | Error State |
|--------|----------|--------------|---------------|-------------|
| `getDashboard` | `GET /api/v1/dashboard` | Skeleton for each section | Render stats + task lists | `ErrorCard` per section (partial failure graceful) |
| `getStats` | `GET /api/v1/dashboard/stats` | Animated counter shows `--` | Animate to real numbers | Show `--` with retry icon |

**Sync Service** — `src/services/syncApi.ts`

| Method | Endpoint | Loading State | Success State | Error State |
|--------|----------|--------------|---------------|-------------|
| `push` | `POST /api/v1/sync/push` | `SyncIndicator` shows spinning | Clear pending mutations, toast "Synced" | Keep mutations queued, retry in 30s |
| `pull` | `GET /api/v1/sync/pull?since=` | Silent background | Update React Query cache | Silent, retry next window focus |

## Design System

### Design Tokens

Defined in `tailwind.config.ts` `extend.colors` and `extend.spacing`:

#### Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `brand-500` | `#2563eb` | Primary buttons, active nav, links |
| `brand-600` | `#1d4ed8` | Primary button hover |
| `brand-700` | `#1e40af` | Primary button active/pressed |
| `brand-50` | `#eff6ff` | Selected row highlight, light backgrounds |
| `brand-100` | `#dbeafe` | Badge backgrounds |
| `neutral-50` | `#fafafa` | Page background |
| `neutral-100` | `#f5f5f5` | Card background, sidebar |
| `neutral-200` | `#e5e5e5` | Borders, dividers |
| `neutral-300` | `#d4d4d4` | Disabled input border |
| `neutral-500` | `#737373` | Placeholder text, secondary text |
| `neutral-700` | `#404040` | Body text |
| `neutral-900` | `#171717` | Headings, primary text |
| `success-500` | `#22c55e` | Completed status, success toast |
| `success-50` | `#f0fdf4` | Success badge background |
| `warning-500` | `#f59e0b` | Medium priority, overdue warning |
| `warning-50` | `#fffbeb` | Warning badge background |
| `danger-500` | `#ef4444` | High priority, delete actions, errors |
| `danger-50` | `#fef2f2` | Error badge background, error toast bg |
| `danger-600` | `#dc2626` | Danger button hover |

#### Priority Colors

| Priority | Badge BG | Badge Text | Border Left |
|----------|----------|-----------|-------------|
| Low | `#f0fdf4` | `#15803d` | `#22c55e` |
| Medium | `#fffbeb` | `#a16207` | `#f59e0b` |
| High | `#fef2f2` | `#b91c1c` | `#ef4444` |

#### Status Colors

| Status | Badge BG | Badge Text |
|--------|----------|-----------|
| Incomplete | `#f5f5f5` | `#737373` |
| Complete | `#f0fdf4` | `#15803d` |
| Overdue | `#fef2f2` | `#b91c1c` |

### Typography Scale

Font family: `Inter, system-ui, -apple-system, sans-serif` (loaded via Google Fonts, `font-display: swap`).

| Token | Size | Weight | Line Height | Usage |
|-------|------|--------|-------------|-------|
| `heading-xl` | `1.875rem` (30px) | 700 | 1.2 | Dashboard title |
| `heading-lg` | `1.5rem` (24px) | 700 | 1.25 | Page titles |
| `heading-md` | `1.25rem` (20px) | 600 | 1.3 | Section headers |
| `heading-sm` | `1.125rem` (18px) | 600 | 1.35 | Card titles |
| `body-lg` | `1rem` (16px) | 400 | 1.5 | Body text |
| `body-md` | `0.875rem` (14px) | 400 | 1.5 | Secondary text, descriptions |
| `body-sm` | `0.75rem` (12px) | 400 | 1.5 | Captions, timestamps |
| `label` | `0.875rem` (14px) | 500 | 1.4 | Form labels, badge text |

### Spacing Grid

Base unit: `4px`. All spacing uses multiples of `4px` via Tailwind's default scale.

| Token | Value | Usage |
|-------|-------|-------|
| `space-1` | `4px` | Inline icon gaps |
| `space-2` | `8px` | Badge padding, tight gaps |
| `space-3` | `12px` | Card internal padding (compact) |
| `space-4` | `16px` | Standard element spacing, card padding |
| `space-5` | `20px` | Section gaps |
| `space-6` | `24px` | Page padding (mobile) |
| `space-8` | `32px` | Page padding (desktop), section dividers |
| `space-10` | `40px` | Large vertical spacing |
| `space-12` | `48px` | Sidebar width collapsed |
| `space-64` | `256px` | Sidebar width expanded |

### Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `rounded-sm` | `4px` | Badges |
| `rounded-md` | `8px` | Cards, inputs, buttons |
| `rounded-lg` | `12px` | Modals |
| `rounded-full` | `9999px` | Avatars, circular icons |

### Shadows

| Token | Value | Usage |
|-------|-------|-------|
| `shadow-sm` | `0 1px 2px rgba(0,0,0,0.05)` | Cards at rest |
| `shadow-md` | `0 4px 6px -1px rgba(0,0,0,0.1)` | Cards on hover, dropdowns |
| `shadow-lg` | `0 10px 15px -3px rgba(0,0,0,0.1)` | Modals |

## Accessibility

### Target

**WCAG 2.1 Level AA** compliance.

### Color Contrast

All text/background combinations meet minimum contrast ratios:

- Normal text (< 18px): 4.5:1 minimum → `neutral-700` on `neutral-50` = 9.4:1 ✓
- Large text (≥ 18px bold): 3:1 minimum → `brand-500` on white = 4.6:1 ✓
- Interactive elements: `brand-500` on white = 4.6:1 ✓

### Keyboard Navigation

| Pattern | Keys | Behavior |
|---------|------|----------|
| Tab order | `Tab` / `Shift+Tab` | Follows visual layout: header → sidebar → main content |
| Task completion | `Space` on focused checkbox | Toggles task complete/incomplete |
| Modal | `Escape` to close; `Tab` trapped inside modal | Focus moves to first focusable element on open; returns to trigger on close |
| Buttons | `Enter` or `Space` | Activates button |
| Dropdown filters | `Enter` to open, `Arrow Up/Down` to navigate, `Enter` to select, `Escape` to close | Native `<select>` behavior |
| Search | `Ctrl+K` / `Cmd+K` | Global shortcut focuses search input |
| Task list | `Arrow Up/Down` when list focused | Navigate between task cards |
| Delete confirm | `Enter` on "Delete" button | Requires explicit confirm action; no delete on single keypress |

### ARIA Patterns

| Component | ARIA Pattern | Implementation |
|-----------|-------------|----------------|
| `Sidebar` | `role="navigation"`, `aria-label="Main navigation"` | Landmark for screen readers |
| `TaskCard` checkbox | `role="checkbox"`, `aria-checked`, `aria-label="Mark [task title] as complete"` | Accessible toggle |
| `Modal` | `role="dialog"`, `aria-modal="true"`, `aria-labelledby` pointing to title | Focus trap via `@headlessui/react` |
| `Badge` | `role="status"` for dynamic badges; static badges use no role | Priority/status communicated |
| `Toast` | `role="alert"`, `aria-live="polite"` | Announced by screen readers |
| `OfflineBanner` | `role="alert"`, `aria-live="assertive"` | Immediate announcement |
| `SearchInput` | `role="searchbox"`, `aria-label="Search tasks"` | Identified as search |
| `TaskFilters` | `aria-label="Filter tasks"` on container | Group labeled |
| `ProgressBar` | `role="progressbar"`, `aria-valuenow`, `aria-valuemin`, `aria-valuemax`, `aria-label` | Stats accessible |
| `EmptyState` | `role="status"` | Announced when list becomes empty |
| Loading states | `aria-busy="true"` on container, `aria-live="polite"` | Screen reader announces loading/loaded |
| `Skeleton` | `aria-hidden="true"` | Hidden from assistive tech; container has `aria-busy` |

### Focus Styles

All interactive elements show visible focus ring: `outline: 2px solid #2563eb; outline-offset: 2px;` via Tailwind `focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2`.

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}

## Responsive Design

### Breakpoints

| Name | Min Width | Tailwind Prefix | Layout Changes |
|------|-----------|----------------|----------------|
| Mobile | 0px | (default) | Single column, bottom nav, full-width cards |
| Tablet | 768px | `md:` | Sidebar appears (collapsible), 2-column dashboard |
| Desktop | 1024px | `lg:` | Sidebar expanded by default, 3-column dashboard stats |
| Wide | 1280px | `xl:` | Max content width 1200px, centered |

### Mobile-First Decisions

1. **Navigation**: On mobile (< 768px), sidebar becomes a slide-out drawer triggered by hamburger icon in header. Bottom navigation bar with 4 items: Dashboard, Tasks, Categories, Settings.
2. **Task creation**: Full-screen modal on mobile; centered modal (max-width 560px) on desktop.
3. **Dashboard layout**: Single stacked column on mobile (stats → today → overdue). Two columns on tablet (stats row → today | overdue). Three stat cards inline on desktop.
4. **Task cards**: Full width on all breakpoints. On mobile, priority shown as left border color only (no text label) to save space.
5. **Filters**: On mobile, filters collapse into a "Filter" button that opens a bottom sheet. On desktop, filters display inline as a horizontal bar.
6. **Touch targets**: All interactive elements minimum 44×44px on mobile (WCAG 2.5.5).
7. **Search**: On mobile, search icon in header expands to full-width search bar. On desktop, always visible in header.

### Layout Shift Prevention

- All images/icons have explicit `width`/`height` attributes
- Skeleton loaders match exact dimensions of loaded content
- Font loaded with `font-display: swap`; body font-size set to prevent CLS
- Task list uses fixed-height card rows (72px mobile, 64px desktop)

## Error States

### Per-Feature Error Patterns

#### Authentication

| State | UX |
|-------|-----|
| Loading | Button shows spinner, inputs disabled |
| Login error (401) | Inline red text below form: "Invalid email or password" |
| Registration conflict (409) | Inline red text below email field: "An account with this email already exists" |
| Validation errors | Per-field inline error messages below each input |
| Network error | Toast: "Unable to connect. Check your internet connection." |
| Token refresh failure | Silent redirect to `/login` with toast: "Session expired. Please log in again." |

#### Tasks

| State | UX |
|-------|-----|
| List loading | 3 `Skeleton` card rows |
| List empty | `EmptyState`: illustration, "No tasks yet", "Create your first task" button |
| List filtered empty | `EmptyState`: "No tasks match your filters", "Clear filters" link |
| List error | `ErrorCard`: "Couldn't load tasks", "Try again" button |
| Detail loading | Full-page skeleton matching layout |
| Detail 404 | `NotFoundPage` variant: "This task doesn't exist or was deleted" |
| Create/update validation | Inline per-field errors from Zod schema |
| Delete error | Toast: "Failed to delete task. Please try again." |
| Offline create | Optimistic add to list with "Pending sync" badge; queued in offline store |

#### Categories

| State | UX |
|-------|-----|
| Loading | 2 skeleton cards |
| Empty | `EmptyState`: "No categories", "Create a category to organize your tasks" |
| Error | `ErrorCard` with retry |
| Delete with tasks | Confirmation dialog warns: "X tasks use this category. They will become uncategorized." |

#### Dashboard

| State | UX |
|-------|-----|
| Loading | Skeleton for stat cards + task lists independently |
| Partial error | Each section loads independently; failed section shows `ErrorCard` while others render |
| All tasks complete | Celebratory empty state: "All caught up! 🎉" (note: emoji in UI only, not in code files) |
| No overdue | Section hidden entirely (not shown as empty) |

#### Offline

| State | UX |
|-------|-----|
| Offline detected | Yellow banner at top: "You're offline. Changes will sync when you reconnect." with `SyncIndicator` showing pending count |
| Back online | Banner turns green briefly: "Back online. Syncing..." then disappears |
| Sync conflict | Toast: "Some changes couldn't be synced. Server version kept." (server wins strategy per 02_backend_lead.md) |

## Performance

### Code Splitting

```typescript
// Route-level code splitting via React.lazy
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const TaskListPage = lazy(() => import('./pages/TaskListPage'));
const TaskDetailPage = lazy(() => import('./pages/TaskDetailPage'));
const CategoriesPage = lazy(() => import('./pages/CategoriesPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
// Auth pages bundled in main chunk (entry point)

### Lazy Loading

- All page components lazy-loaded with `React.lazy` + `Suspense` (fallback: page-level skeleton)
- Modal content (`TaskForm`, `CategoryForm`, `ConfirmDialog`) lazy-loaded on first open
- Lucide icons: individual imports only (`import { Check } from 'lucide-react'`), never full library

### Image Optimization

- No user-uploaded images in v1
- App icons: SVG for scalability, inlined in JSX
- PWA icons: pre-generated at 192px and 512px (PNG)
- Favicon: multi-size `.ico` + `180x180` apple-touch-icon

### Bundle Budget

| Chunk | Target | Includes |
|-------|--------|----------|
| Main (entry) | < 80 KB gzipped | React, Router, Zustand, Auth pages, Layout |
| Vendor | < 60 KB gzipped | TanStack Query, ky, date-fns (tree-shaken), Zod |
| Dashboard chunk | < 25 KB gzipped | DashboardPage + child components |
| Tasks chunk | < 30 KB gzipped | TaskListPage + TaskDetailPage + TaskForm |
| Categories chunk | < 15 KB gzipped | CategoriesPage + CategoryForm |
| Total initial load | < 150 KB gzipped | Main + Vendor |
| Total all chunks | < 250 KB gzipped | Everything |

### PWA & Service Worker Strategy

Per AC-6 from `01_product_manager.md`:

- **Precache**: App shell (HTML, CSS, JS chunks, fonts, icons) via Workbox `precacheAndRoute`
- **Runtime cache**: API responses cached with `StaleWhileRevalidate` strategy for `GET /api/v1/tasks` and `GET /api/v1/categories`; `NetworkFirst` for `GET /api/v1/dashboard`
- **Offline mutations**: Queued in `offlineStore` (Zustand persisted to localStorage), replayed via `POST /api/v1/sync/push` on reconnect
- **Update prompt**: When new SW detected, show non-intrusive banner: "Update available" with "Refresh" button
- **Background sync**: Register `sync` event for pending mutations when `navigator.serviceWorker` supports Background Sync API

### Additional Performance Measures

- `React.memo` on `TaskCard` (renders in lists of 50+)
- Virtualized task list via `@tanstack/react-virtual` if list exceeds 100 items
- Debounced search input (300ms) to avoid excessive API calls
- Pagination: 20 tasks per page default, infinite scroll on mobile
- Prefetch: Dashboard data prefetched on login success
- HTTP/2 server push headers for critical CSS/JS (Nginx config)

## Open Questions

| # | Question | Impact | Suggested Default |
|---|----------|--------|-------------------|
| 1 | Should task description support Markdown or remain plain text? | `TaskForm` textarea vs. rich editor; bundle size +40KB if Markdown | Plain text for v1; Markdown in v2 |
| 2 | Should categories have user-assigned colors or auto-assigned from a preset palette? | `CategoryForm` complexity; more accessible with presets | 8-color preset palette, user picks from swatches |
| 3 | Infinite scroll vs. pagination for task list on desktop? | UX preference; infinite scroll adds complexity with filters | Pagination on desktop, infinite scroll on mobile |
| 4 | Should the app support dark mode in v1? | Design system doubles; Tailwind `dark:` variants | No dark mode in v1; add in v2 |
| 5 | What is the maximum offline storage budget before warning the user? | localStorage limit ~5MB; IndexedDB for larger | Warn at 1000 pending mutations or 30 days without sync |
| 6 | Should `Ctrl+K` / `Cmd+K` open a command palette (task quick-create, navigation) or just focus search? | UX scope creep vs. power-user value | Focus search only in v1; command palette in v2 |
| 7 | Should completed tasks be hidden by default or shown with strikethrough? | Dashboard cleanliness vs. visibility; per `01_product_manager.md` Noa wants clean view | Hidden by default with "Show completed" toggle |