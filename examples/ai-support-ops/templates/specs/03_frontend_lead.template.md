# SPEC: Frontend Lead

**Version:** 1.0
**Created:** {{DATE}}
**Owner:** Frontend Team

---

## 1. Architecture Overview

### Frontend Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      FRONTEND ARCHITECTURE                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   ┌──────────────────────────────────────────────────────────┐  │
│   │                      Pages/Views                          │  │
│   │   ┌──────────┐  ┌──────────┐  ┌──────────┐              │  │
│   │   │   Home   │  │Dashboard │  │ Settings │  ...         │  │
│   │   └────┬─────┘  └────┬─────┘  └────┬─────┘              │  │
│   └────────┼─────────────┼─────────────┼────────────────────┘  │
│            │             │             │                        │
│   ┌────────▼─────────────▼─────────────▼────────────────────┐  │
│   │                    Components                            │  │
│   │   ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐   │  │
│   │   │  Layout │  │  Forms  │  │  Cards  │  │ Modals  │   │  │
│   │   └─────────┘  └─────────┘  └─────────┘  └─────────┘   │  │
│   └──────────────────────┬──────────────────────────────────┘  │
│                          │                                      │
│   ┌──────────────────────▼──────────────────────────────────┐  │
│   │                     Hooks & Services                     │  │
│   │   ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐   │  │
│   │   │useAuth  │  │ useAPI  │  │useStore │  │ utils   │   │  │
│   │   └─────────┘  └─────────┘  └─────────┘  └─────────┘   │  │
│   └──────────────────────┬──────────────────────────────────┘  │
│                          │                                      │
│   ┌──────────────────────▼──────────────────────────────────┐  │
│   │                    State Management                      │  │
│   │            (Zustand / Redux / Context)                   │  │
│   └──────────────────────┬──────────────────────────────────┘  │
│                          │                                      │
│   ┌──────────────────────▼──────────────────────────────────┐  │
│   │                      API Layer                           │  │
│   │              (Axios / Fetch / TanStack Query)            │  │
│   └──────────────────────────────────────────────────────────┘  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Tech Stack

| Layer | Technology | Version |
|-------|------------|---------|
| Framework | {{FRONTEND_FRAMEWORK}} | {{FRAMEWORK_VERSION}} |
| Language | TypeScript | 5.x |
| Styling | {{STYLING_SOLUTION}} | {{STYLING_VERSION}} |
| State | {{STATE_MANAGEMENT}} | {{STATE_VERSION}} |
| Routing | {{ROUTING_LIBRARY}} | {{ROUTING_VERSION}} |
| Forms | {{FORMS_LIBRARY}} | {{FORMS_VERSION}} |
| HTTP Client | {{HTTP_CLIENT}} | {{HTTP_VERSION}} |
| Testing | Vitest + Testing Library | Latest |

---

## 2. Project Structure

```
web/
├── src/
│   ├── components/           # Reusable components
│   │   ├── ui/              # Base UI components (Button, Input, Card)
│   │   ├── forms/           # Form components
│   │   ├── layout/          # Layout components (Header, Sidebar, Footer)
│   │   └── features/        # Feature-specific components
│   ├── pages/               # Page/route components
│   │   ├── Home/
│   │   │   ├── index.tsx
│   │   │   └── Home.test.tsx
│   │   ├── Dashboard/
│   │   └── Auth/
│   ├── hooks/               # Custom React hooks
│   │   ├── useAuth.ts
│   │   ├── useApi.ts
│   │   └── useLocalStorage.ts
│   ├── services/            # API and external services
│   │   ├── api.ts           # Axios instance
│   │   ├── auth.service.ts
│   │   └── {{resource}}.service.ts
│   ├── store/               # State management
│   │   ├── index.ts
│   │   ├── auth.store.ts
│   │   └── {{resource}}.store.ts
│   ├── types/               # TypeScript types
│   │   ├── index.ts
│   │   ├── api.types.ts
│   │   └── {{resource}}.types.ts
│   ├── utils/               # Utility functions
│   │   ├── format.ts
│   │   ├── validation.ts
│   │   └── constants.ts
│   ├── styles/              # Global styles
│   │   ├── globals.css
│   │   └── variables.css
│   ├── App.tsx              # Root component
│   ├── main.tsx             # Entry point
│   └── router.tsx           # Route definitions
├── tests/
│   ├── setup.ts             # Test configuration
│   └── mocks/               # Mock data and handlers
├── public/
│   └── assets/
├── index.html
├── vite.config.ts
├── tsconfig.json
└── package.json
```

---

## 3. Design System

### Color Palette

| Name | Light Mode | Dark Mode | Usage |
|------|------------|-----------|-------|
| Primary | {{PRIMARY_COLOR}} | {{PRIMARY_DARK}} | Buttons, links, focus states |
| Secondary | {{SECONDARY_COLOR}} | {{SECONDARY_DARK}} | Secondary actions |
| Background | #FFFFFF | #1A1A1A | Page background |
| Surface | #F5F5F5 | #2D2D2D | Cards, panels |
| Text Primary | #1A1A1A | #FFFFFF | Main text |
| Text Secondary | #666666 | #A0A0A0 | Secondary text |
| Success | #22C55E | #22C55E | Success states |
| Warning | #F59E0B | #F59E0B | Warning states |
| Error | #EF4444 | #EF4444 | Error states |

### Typography

| Element | Font | Size | Weight | Line Height |
|---------|------|------|--------|-------------|
| H1 | {{FONT_FAMILY}} | 2.5rem | 700 | 1.2 |
| H2 | {{FONT_FAMILY}} | 2rem | 600 | 1.25 |
| H3 | {{FONT_FAMILY}} | 1.5rem | 600 | 1.3 |
| H4 | {{FONT_FAMILY}} | 1.25rem | 600 | 1.35 |
| Body | {{FONT_FAMILY}} | 1rem | 400 | 1.5 |
| Small | {{FONT_FAMILY}} | 0.875rem | 400 | 1.5 |
| Caption | {{FONT_FAMILY}} | 0.75rem | 400 | 1.4 |

### Spacing Scale

| Token | Value | Usage |
|-------|-------|-------|
| xs | 4px | Tight spacing |
| sm | 8px | Compact elements |
| md | 16px | Default spacing |
| lg | 24px | Section spacing |
| xl | 32px | Large sections |
| 2xl | 48px | Page sections |

### Breakpoints

| Name | Width | Target |
|------|-------|--------|
| sm | 640px | Mobile landscape |
| md | 768px | Tablet |
| lg | 1024px | Desktop |
| xl | 1280px | Large desktop |
| 2xl | 1536px | Extra large |

---

## 4. Component Library

### Base Components

#### Button

```tsx
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  isDisabled?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
  onClick?: () => void;
  children: ReactNode;
}
```

**Usage:**
```tsx
<Button variant="primary" size="md" onClick={handleSubmit}>
  Save Changes
</Button>

<Button variant="outline" size="sm" leftIcon={<PlusIcon />}>
  Add Item
</Button>
```

#### Input

```tsx
interface InputProps {
  type: 'text' | 'email' | 'password' | 'number' | 'tel';
  label?: string;
  placeholder?: string;
  error?: string;
  helperText?: string;
  isDisabled?: boolean;
  isRequired?: boolean;
  leftElement?: ReactNode;
  rightElement?: ReactNode;
}
```

#### Card

```tsx
interface CardProps {
  variant: 'elevated' | 'outlined' | 'filled';
  padding: 'none' | 'sm' | 'md' | 'lg';
  children: ReactNode;
}
```

#### Modal

```tsx
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  size: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closeOnOverlayClick?: boolean;
  children: ReactNode;
  footer?: ReactNode;
}
```

### Form Components

#### Form Field Pattern

```tsx
<FormField
  name="email"
  label="Email Address"
  error={errors.email}
>
  <Input
    type="email"
    placeholder="you@example.com"
    {...register('email')}
  />
</FormField>
```

#### Form Validation (with Zod)

```tsx
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Minimum 8 characters'),
});

type FormData = z.infer<typeof schema>;

const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
  resolver: zodResolver(schema),
});
```

---

## 5. State Management

### Store Structure (Zustand Example)

```typescript
// store/auth.store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: (user, token) => set({ user, token, isAuthenticated: true }),
      logout: () => set({ user: null, token: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-storage',
    }
  )
);
```

### State Guidelines

| State Type | Where to Store | Example |
|------------|----------------|---------|
| Server State | TanStack Query / SWR | User data, task lists |
| UI State | Local state (useState) | Modal open, form values |
| Global UI | Zustand/Context | Theme, sidebar collapsed |
| Auth State | Zustand (persisted) | User, token |
| Form State | React Hook Form | Form values, validation |

---

## 6. API Integration

### API Client Setup

```typescript
// services/api.ts
import axios from 'axios';
import { useAuthStore } from '@/store/auth.store';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add auth token
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor - handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

### Service Pattern

```typescript
// services/task.service.ts
import api from './api';
import { Task, CreateTaskInput, UpdateTaskInput } from '@/types';

export const taskService = {
  getAll: async (params?: { status?: string; page?: number }) => {
    const response = await api.get<{ data: Task[]; meta: PaginationMeta }>('/tasks', { params });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get<{ data: Task }>(`/tasks/${id}`);
    return response.data.data;
  },

  create: async (data: CreateTaskInput) => {
    const response = await api.post<{ data: Task }>('/tasks', data);
    return response.data.data;
  },

  update: async (id: string, data: UpdateTaskInput) => {
    const response = await api.patch<{ data: Task }>(`/tasks/${id}`, data);
    return response.data.data;
  },

  delete: async (id: string) => {
    await api.delete(`/tasks/${id}`);
  },
};
```

### Query Hooks (TanStack Query)

```typescript
// hooks/useTasks.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { taskService } from '@/services/task.service';

export const useTasks = (params?: { status?: string }) => {
  return useQuery({
    queryKey: ['tasks', params],
    queryFn: () => taskService.getAll(params),
  });
};

export const useTask = (id: string) => {
  return useQuery({
    queryKey: ['tasks', id],
    queryFn: () => taskService.getById(id),
    enabled: !!id,
  });
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: taskService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};
```

---

## 7. Routing

### Route Structure

```typescript
// router.tsx
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
      {
        element: <ProtectedRoute />,
        children: [
          { path: 'dashboard', element: <DashboardPage /> },
          { path: 'tasks', element: <TasksPage /> },
          { path: 'tasks/:id', element: <TaskDetailPage /> },
          { path: 'settings', element: <SettingsPage /> },
        ],
      },
    ],
  },
]);
```

### Protected Route Pattern

```tsx
// components/auth/ProtectedRoute.tsx
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/auth.store';

export const ProtectedRoute = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};
```

---

## 8. Testing Strategy

### Test Structure

```
tests/
├── unit/           # Unit tests for hooks, utils
├── components/     # Component tests
├── integration/    # Full page/flow tests
└── e2e/           # End-to-end tests (Playwright)
```

### Component Testing Pattern

```tsx
// components/ui/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('shows loading state', () => {
    render(<Button isLoading>Submit</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('applies variant classes', () => {
    render(<Button variant="primary">Primary</Button>);
    expect(screen.getByRole('button')).toHaveClass('btn-primary');
  });
});
```

### Hook Testing Pattern

```tsx
// hooks/useAuth.test.ts
import { renderHook, act } from '@testing-library/react';
import { useAuth } from './useAuth';

describe('useAuth', () => {
  it('starts unauthenticated', () => {
    const { result } = renderHook(() => useAuth());
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('authenticates user on login', async () => {
    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.login('test@example.com', 'password');
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user).toBeDefined();
  });
});
```

---

## 9. Performance Guidelines

### Code Splitting

```tsx
import { lazy, Suspense } from 'react';

// Lazy load pages
const DashboardPage = lazy(() => import('@/pages/Dashboard'));
const SettingsPage = lazy(() => import('@/pages/Settings'));

// Use with Suspense
<Suspense fallback={<LoadingSpinner />}>
  <DashboardPage />
</Suspense>
```

### Memoization

```tsx
// Memoize expensive computations
const sortedTasks = useMemo(
  () => tasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
  [tasks]
);

// Memoize callbacks
const handleSubmit = useCallback(() => {
  // ...
}, [dependency]);

// Memoize components
const TaskCard = memo(({ task }: { task: Task }) => {
  // ...
});
```

### Image Optimization

```tsx
// Use responsive images
<img
  src={image.src}
  srcSet={`${image.small} 640w, ${image.medium} 1024w, ${image.large} 1920w`}
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
  loading="lazy"
  alt={image.alt}
/>
```

---

## 10. Accessibility Requirements

### WCAG 2.1 AA Compliance

| Requirement | Implementation |
|-------------|----------------|
| Keyboard Navigation | All interactive elements focusable and operable |
| Focus Indicators | Visible focus ring on all focusable elements |
| Color Contrast | Minimum 4.5:1 for normal text, 3:1 for large text |
| Alt Text | All images have descriptive alt text |
| Form Labels | All form inputs have associated labels |
| Error Messages | Errors announced to screen readers |
| Skip Links | Skip to main content link provided |

### ARIA Patterns

```tsx
// Button with loading state
<button
  aria-busy={isLoading}
  aria-disabled={isDisabled}
  aria-label="Submit form"
>
  {isLoading ? 'Submitting...' : 'Submit'}
</button>

// Modal
<div
  role="dialog"
  aria-modal="true"
  aria-labelledby="modal-title"
  aria-describedby="modal-description"
>
  <h2 id="modal-title">Confirm Delete</h2>
  <p id="modal-description">Are you sure you want to delete this item?</p>
</div>

// Alert
<div role="alert" aria-live="polite">
  {errorMessage}
</div>
```

---

## 11. Error Handling

### Error Boundary

```tsx
import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Error caught by boundary:', error, info);
    // Log to error tracking service
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || <ErrorPage error={this.state.error} />;
    }
    return this.props.children;
  }
}
```

### API Error Handling

```tsx
const { data, error, isLoading } = useTasks();

if (isLoading) return <LoadingSpinner />;
if (error) return <ErrorMessage error={error} />;
if (!data?.length) return <EmptyState />;

return <TaskList tasks={data} />;
```

---

## 12. Environment Configuration

### Environment Variables

```env
# .env.example
VITE_API_URL=http://localhost:3000/api/v1
VITE_APP_NAME={{PROJECT_NAME}}
VITE_ENVIRONMENT=development

# Feature flags
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_DARK_MODE=true
```

### Type-safe Env Access

```typescript
// config/env.ts
const env = {
  apiUrl: import.meta.env.VITE_API_URL as string,
  appName: import.meta.env.VITE_APP_NAME as string,
  environment: import.meta.env.VITE_ENVIRONMENT as 'development' | 'staging' | 'production',
  features: {
    analytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
    darkMode: import.meta.env.VITE_ENABLE_DARK_MODE === 'true',
  },
};

export default env;
```

---

*This spec is maintained by the Frontend team. Last updated: {{DATE}}*
