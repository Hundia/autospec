# SPEC: Frontend Lead - TaskFlow

**Version:** 1.0
**Created:** 2026-01-21
**Owner:** Frontend Team

---

## 1. Architecture Overview

### Tech Stack

| Layer | Technology | Version |
|-------|------------|---------|
| Framework | React | 18.x |
| Language | TypeScript | 5.x |
| Build Tool | Vite | 5.x |
| Styling | Tailwind CSS | 3.x |
| State | Zustand | 4.x |
| Forms | React Hook Form | 7.x |
| Validation | Zod | 3.x |
| HTTP Client | Axios | 1.x |
| Routing | React Router | 6.x |
| Testing | Vitest + Testing Library | Latest |

---

## 2. Project Structure

```
web/
├── src/
│   ├── components/
│   │   ├── ui/              # Base components
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Modal.tsx
│   │   │   └── index.ts
│   │   ├── forms/
│   │   │   ├── TaskForm.tsx
│   │   │   └── LoginForm.tsx
│   │   ├── layout/
│   │   │   ├── Layout.tsx
│   │   │   ├── Header.tsx
│   │   │   └── Sidebar.tsx
│   │   └── tasks/
│   │       ├── TaskCard.tsx
│   │       ├── TaskList.tsx
│   │       └── TaskFilters.tsx
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   ├── Dashboard.tsx
│   │   └── TaskDetail.tsx
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useTasks.ts
│   │   └── useProjects.ts
│   ├── services/
│   │   ├── api.ts
│   │   ├── auth.service.ts
│   │   └── task.service.ts
│   ├── store/
│   │   ├── auth.store.ts
│   │   └── task.store.ts
│   ├── types/
│   │   └── index.ts
│   ├── utils/
│   │   ├── format.ts
│   │   └── validation.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── router.tsx
├── tests/
├── public/
├── index.html
└── package.json
```

---

## 3. Design System

### Color Palette

| Name | Light Mode | Dark Mode | Usage |
|------|------------|-----------|-------|
| Primary | #3B82F6 | #60A5FA | CTAs, links |
| Primary Hover | #2563EB | #3B82F6 | Hover states |
| Background | #FFFFFF | #111827 | Page background |
| Surface | #F9FAFB | #1F2937 | Cards, panels |
| Text | #111827 | #F9FAFB | Primary text |
| Text Secondary | #6B7280 | #9CA3AF | Secondary text |
| Border | #E5E7EB | #374151 | Borders |
| Success | #10B981 | #34D399 | Success states |
| Warning | #F59E0B | #FBBF24 | Warnings |
| Error | #EF4444 | #F87171 | Errors |

### Typography (Tailwind)

| Element | Classes |
|---------|---------|
| H1 | `text-3xl font-bold` |
| H2 | `text-2xl font-semibold` |
| H3 | `text-xl font-semibold` |
| Body | `text-base` |
| Small | `text-sm` |
| Caption | `text-xs text-gray-500` |

### Spacing

Using Tailwind's default spacing scale (4px base):
- xs: `p-1` (4px)
- sm: `p-2` (8px)
- md: `p-4` (16px)
- lg: `p-6` (24px)
- xl: `p-8` (32px)

---

## 4. Component Specifications

### Button

```tsx
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  isDisabled?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  type?: 'button' | 'submit';
  onClick?: () => void;
  children: React.ReactNode;
}
```

**Tailwind Classes:**
```tsx
const variants = {
  primary: 'bg-blue-500 hover:bg-blue-600 text-white',
  secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-900',
  outline: 'border border-gray-300 hover:bg-gray-50',
  ghost: 'hover:bg-gray-100',
  danger: 'bg-red-500 hover:bg-red-600 text-white',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
};
```

### Input

```tsx
interface InputProps {
  type?: 'text' | 'email' | 'password';
  label?: string;
  placeholder?: string;
  error?: string;
  isDisabled?: boolean;
  isRequired?: boolean;
}
```

### TaskCard

```tsx
interface TaskCardProps {
  task: Task;
  onComplete: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}
```

**Visual Design:**
```
┌──────────────────────────────────────────────────────┐
│ [☐] Task Title                          [Priority]  │
│     Due: Jan 25, 2026                               │
│     Description preview text...            [⋮ Menu] │
└──────────────────────────────────────────────────────┘
```

### Modal

```tsx
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  footer?: React.ReactNode;
}
```

---

## 5. Pages

### Login Page (`/login`)
- Email input
- Password input
- Login button
- Link to register
- Error messages

### Register Page (`/register`)
- Name input
- Email input
- Password input
- Confirm password
- Register button
- Link to login

### Dashboard Page (`/dashboard`)
- Header with user info
- Task statistics (total, completed, pending)
- Task list with filters
- Quick add button
- Filter sidebar (optional)

### Task Detail Page (`/tasks/:id`)
- Full task view
- Edit form
- Delete confirmation
- Back button

---

## 6. State Management

### Auth Store (Zustand)

```typescript
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterInput) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}
```

### Task Store (Zustand)

```typescript
interface TaskState {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  filters: TaskFilters;
  fetchTasks: () => Promise<void>;
  createTask: (data: CreateTaskInput) => Promise<void>;
  updateTask: (id: string, data: UpdateTaskInput) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  toggleComplete: (id: string) => Promise<void>;
  setFilters: (filters: Partial<TaskFilters>) => void;
}
```

---

## 7. API Integration

### API Client

```typescript
// services/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Handle token refresh or logout
    }
    return Promise.reject(error);
  }
);

export default api;
```

### Task Service

```typescript
// services/task.service.ts
export const taskService = {
  getAll: (params?: TaskFilters) =>
    api.get('/tasks', { params }),

  getById: (id: string) =>
    api.get(`/tasks/${id}`),

  create: (data: CreateTaskInput) =>
    api.post('/tasks', data),

  update: (id: string, data: UpdateTaskInput) =>
    api.patch(`/tasks/${id}`, data),

  delete: (id: string) =>
    api.delete(`/tasks/${id}`),

  toggleComplete: (id: string) =>
    api.patch(`/tasks/${id}/complete`),
};
```

---

## 8. Routing

```typescript
// router.tsx
const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
      {
        element: <ProtectedRoute />,
        children: [
          { path: 'dashboard', element: <Dashboard /> },
          { path: 'tasks/:id', element: <TaskDetail /> },
        ],
      },
    ],
  },
]);
```

---

## 9. Testing

### Component Test Example

```tsx
describe('TaskCard', () => {
  it('renders task title', () => {
    render(<TaskCard task={mockTask} {...mockHandlers} />);
    expect(screen.getByText(mockTask.title)).toBeInTheDocument();
  });

  it('calls onComplete when checkbox clicked', async () => {
    const onComplete = vi.fn();
    render(<TaskCard task={mockTask} onComplete={onComplete} {...mockHandlers} />);

    await userEvent.click(screen.getByRole('checkbox'));

    expect(onComplete).toHaveBeenCalledWith(mockTask.id);
  });
});
```

---

## 10. Accessibility

- All interactive elements keyboard accessible
- Focus indicators visible
- Color contrast >= 4.5:1
- Form labels associated with inputs
- Error messages announced to screen readers
- Loading states communicated

---

*This spec is maintained by the Frontend team. Last updated: 2026-01-21*
