# TaskFlow Frontend Architecture

**Version:** 1.0
**Last Updated:** 2026-01-29

---

## 1. Component Architecture

TaskFlow frontend follows a hierarchical component structure from atomic elements to full pages.

### Component Tree

```
    ┌─────────────────────────────────────────────────────────────────────────────────┐
    │                                   App.tsx                                        │
    │                              (Root component)                                    │
    └───────────────────────────────────┬─────────────────────────────────────────────┘
                                        │
    ┌───────────────────────────────────▼─────────────────────────────────────────────┐
    │                              RouterProvider                                      │
    │                           (React Router v6)                                      │
    └───────────────────────────────────┬─────────────────────────────────────────────┘
                                        │
              ┌─────────────────────────┼─────────────────────────────┐
              │                         │                             │
    ┌─────────▼─────────┐   ┌──────────▼──────────┐   ┌──────────────▼──────────────┐
    │    Layout.tsx     │   │    Layout.tsx       │   │       Layout.tsx            │
    │   (Public)        │   │   (Authenticated)   │   │      (Minimal)              │
    └─────────┬─────────┘   └──────────┬──────────┘   └──────────────┬──────────────┘
              │                        │                              │
    ┌─────────▼─────────┐   ┌──────────▼──────────┐   ┌──────────────▼──────────────┐
    │     Header        │   │     Header          │   │                             │
    │   (with nav)      │   │  (with user menu)   │   │      Login/Register         │
    └───────────────────┘   ├─────────────────────┤   │         Pages               │
                            │     Sidebar         │   │                             │
    ┌───────────────────┐   │  (project list)     │   └─────────────────────────────┘
    │      Home         │   ├─────────────────────┤
    │      Page         │   │    Main Content     │
    └───────────────────┘   │   ┌─────────────┐   │
                            │   │  Dashboard  │   │
                            │   │   Page      │   │
                            │   └─────────────┘   │
                            └─────────────────────┘
```

### Component Hierarchy

```
Atoms (ui/)
├── Button.tsx
├── Input.tsx
├── Badge.tsx
├── Checkbox.tsx
├── Spinner.tsx
└── Icon.tsx

Molecules (forms/, tasks/)
├── TaskCard.tsx
├── TaskForm.tsx
├── LoginForm.tsx
├── RegisterForm.tsx
├── SearchInput.tsx
└── FilterDropdown.tsx

Organisms (layout/, lists/)
├── Header.tsx
├── Sidebar.tsx
├── TaskList.tsx
├── ProjectList.tsx
├── TaskFilters.tsx
└── Modal.tsx

Templates (layout/)
├── Layout.tsx
├── AuthLayout.tsx
└── DashboardLayout.tsx

Pages (pages/)
├── Home.tsx
├── Login.tsx
├── Register.tsx
├── Dashboard.tsx
└── TaskDetail.tsx
```

---

## 2. State Management

TaskFlow uses Zustand for state management with a clear separation between global and local state.

### State Flow Diagram

```
    ┌─────────────────────────────────────────────────────────────────────────────────┐
    │                              GLOBAL STATE (Zustand)                              │
    │  ┌─────────────────────────────────────────────────────────────────────────┐    │
    │  │                           AuthStore                                      │    │
    │  │  - user: User | null                                                     │    │
    │  │  - isAuthenticated: boolean                                              │    │
    │  │  - isLoading: boolean                                                    │    │
    │  │  - login(), register(), logout(), checkAuth()                            │    │
    │  └─────────────────────────────────────────────────────────────────────────┘    │
    │                                                                                  │
    │  ┌─────────────────────────────────────────────────────────────────────────┐    │
    │  │                           TaskStore                                      │    │
    │  │  - tasks: Task[]                                                         │    │
    │  │  - isLoading: boolean                                                    │    │
    │  │  - filters: TaskFilters                                                  │    │
    │  │  - fetchTasks(), createTask(), updateTask(), deleteTask()                │    │
    │  └─────────────────────────────────────────────────────────────────────────┘    │
    │                                                                                  │
    │  ┌─────────────────────────────────────────────────────────────────────────┐    │
    │  │                         ProjectStore (v1.1)                              │    │
    │  │  - projects: Project[]                                                   │    │
    │  │  - selectedProject: string | null                                        │    │
    │  │  - fetchProjects(), createProject(), selectProject()                     │    │
    │  └─────────────────────────────────────────────────────────────────────────┘    │
    └──────────────────────────────────────┬──────────────────────────────────────────┘
                                           │
                                    Zustand hooks
                                           │
    ┌──────────────────────────────────────▼──────────────────────────────────────────┐
    │                             LOCAL STATE (React)                                  │
    │  ┌─────────────────────┐  ┌─────────────────────┐  ┌─────────────────────┐     │
    │  │   Form State        │  │   UI State          │  │   Derived State     │     │
    │  │  - useState         │  │  - isModalOpen      │  │  - useMemo          │     │
    │  │  - useForm (RHF)    │  │  - isDropdownOpen   │  │  - computed values  │     │
    │  │  - validation       │  │  - activeTab        │  │  - filtered lists   │     │
    │  └─────────────────────┘  └─────────────────────┘  └─────────────────────┘     │
    └─────────────────────────────────────────────────────────────────────────────────┘
```

### Store Definitions

```typescript
// store/auth.store.ts
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterInput) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
  // ... implementations
}));

// store/task.store.ts
interface TaskState {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  filters: TaskFilters;
  fetchTasks: () => Promise<void>;
  createTask: (data: CreateTaskInput) => Promise<Task>;
  updateTask: (id: string, data: UpdateTaskInput) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  toggleComplete: (id: string) => Promise<void>;
  setFilters: (filters: Partial<TaskFilters>) => void;
}
```

### What Goes Where

| State Type | Where | Examples |
|------------|-------|----------|
| User session | AuthStore (global) | user, isAuthenticated |
| Entity lists | Domain stores (global) | tasks, projects |
| Filters | Domain stores (global) | status, priority, search |
| Form input | Local useState / useForm | title, description |
| UI toggles | Local useState | isModalOpen, activeTab |
| Derived data | useMemo | filteredTasks, stats |

---

## 3. Data Fetching Strategy

TaskFlow uses a service layer pattern for API calls with Axios.

### API Client Setup

```typescript
// services/api.ts
import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // Include cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired, redirect to login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

### Service Layer

```typescript
// services/task.service.ts
export const taskService = {
  getAll: (params?: TaskFilters) =>
    api.get<ApiResponse<Task[]>>('/tasks', { params }),

  getById: (id: string) =>
    api.get<ApiResponse<Task>>(`/tasks/${id}`),

  create: (data: CreateTaskInput) =>
    api.post<ApiResponse<Task>>('/tasks', data),

  update: (id: string, data: UpdateTaskInput) =>
    api.patch<ApiResponse<Task>>(`/tasks/${id}`, data),

  delete: (id: string) =>
    api.delete(`/tasks/${id}`),

  toggleComplete: (id: string) =>
    api.patch<ApiResponse<Task>>(`/tasks/${id}/complete`),
};
```

---

## 4. Routing Configuration

```typescript
// router.tsx
import { createBrowserRouter } from 'react-router-dom';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      // Public routes
      { index: true, element: <Home /> },
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },

      // Protected routes
      {
        element: <ProtectedRoute />,
        children: [
          { path: 'dashboard', element: <Dashboard /> },
          { path: 'tasks/:id', element: <TaskDetail /> },
          { path: 'projects', element: <ProjectList /> },
          { path: 'projects/:id', element: <ProjectDetail /> },
          { path: 'settings', element: <Settings /> },
        ],
      },
    ],
  },
]);
```

### Route Guards

```typescript
// components/ProtectedRoute.tsx
export const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuthStore();
  const location = useLocation();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};
```

---

## 5. Code Splitting

TaskFlow uses React lazy loading for route-based code splitting.

```typescript
// Lazy load page components
const Dashboard = lazy(() => import('./pages/Dashboard'));
const TaskDetail = lazy(() => import('./pages/TaskDetail'));
const Settings = lazy(() => import('./pages/Settings'));

// Wrap routes with Suspense
<Suspense fallback={<PageSkeleton />}>
  <RouterProvider router={router} />
</Suspense>
```

---

## 6. Asset Pipeline

### Images

- Format: WebP with PNG fallback
- Loading: Native lazy loading
- Optimization: Vite imagetools plugin

### Fonts

- Primary: Inter (headings, body)
- Monospace: JetBrains Mono (code blocks)
- Loading: Font-display: swap

### Icons

- Library: Lucide React
- Usage: Tree-shaken imports

```typescript
import { CheckCircle, Plus, Trash2 } from 'lucide-react';
```

---

## 7. Performance Targets

| Metric | Target | Tool |
|--------|--------|------|
| Largest Contentful Paint (LCP) | < 2.5s | Lighthouse |
| First Input Delay (FID) | < 100ms | Lighthouse |
| Cumulative Layout Shift (CLS) | < 0.1 | Lighthouse |
| Time to Interactive (TTI) | < 3.5s | Lighthouse |
| Bundle Size (gzipped) | < 150KB | Vite build |

---

## 8. Cross-References

- **Design System:** See `specs/03_frontend_lead.md`
- **Component Specs:** See `docs/ui-design-system/components.md` (future)
- **User Journeys:** See `docs/flows/user-journeys.md`
- **API Integration:** See `docs/api/reference.md`

---

*This document is maintained by the Frontend team. Last updated: 2026-01-29*
