# TaskFlow Coding Standards

## Overview

This document defines the coding standards and conventions for the TaskFlow project. Following these standards ensures consistency, maintainability, and quality across the codebase.

---

## General Principles

### Core Values

1. **Clarity over Cleverness**: Write code that's easy to understand
2. **Consistency**: Follow established patterns
3. **Simplicity**: Prefer simple solutions
4. **Type Safety**: Leverage TypeScript fully
5. **Testability**: Write testable code

---

## Naming Conventions

### Files and Directories

| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `TaskCard.tsx` |
| Hooks | camelCase with 'use' prefix | `useTask.ts` |
| Services | camelCase with 'Service' suffix | `taskService.ts` |
| Controllers | camelCase with 'Controller' suffix | `taskController.ts` |
| Types | PascalCase | `Task.ts` |
| Utils | camelCase | `formatDate.ts` |
| Tests | Same as source + `.test` | `taskService.test.ts` |
| Constants | UPPER_SNAKE_CASE file | `PRIORITIES.ts` |

### Variables and Functions

```typescript
// Variables: camelCase
const taskList = [];
const isLoading = true;
const currentUser = getUser();

// Constants: UPPER_SNAKE_CASE
const MAX_TASKS = 100;
const API_BASE_URL = '/api/v1';
const DEFAULT_PRIORITY = 'medium';

// Functions: camelCase, verb prefix
function getTask(id: string) {}
function createTask(data: CreateTaskDto) {}
function validateEmail(email: string) {}
function formatDate(date: Date) {}

// Boolean: is/has/can/should prefix
const isValid = true;
const hasPermission = false;
const canEdit = user.role === 'admin';
const shouldRefetch = staleTime > 0;

// Event handlers: handle prefix
function handleClick() {}
function handleSubmit(data: FormData) {}
function handleTaskComplete(taskId: string) {}
```

### Types and Interfaces

```typescript
// Interfaces: PascalCase, noun
interface User {
  id: string;
  email: string;
  name: string;
}

// Types: PascalCase
type TaskStatus = 'pending' | 'in_progress' | 'completed';
type TaskPriority = 'low' | 'medium' | 'high';

// DTOs: PascalCase with Dto suffix
interface CreateTaskDto {
  title: string;
  description?: string;
}

interface UpdateTaskDto {
  title?: string;
  status?: TaskStatus;
}

// Props: PascalCase with Props suffix
interface TaskCardProps {
  task: Task;
  onEdit?: (id: string) => void;
}

// Enums: PascalCase
enum UserRole {
  User = 'user',
  Admin = 'admin',
}
```

---

## TypeScript Guidelines

### Type Annotations

```typescript
// DO: Explicit return types for public functions
function calculateTotal(items: Item[]): number {
  return items.reduce((sum, item) => sum + item.price, 0);
}

// DO: Use interfaces for objects
interface TaskFilters {
  status?: TaskStatus;
  priority?: TaskPriority;
  search?: string;
}

// DO: Use type for unions and primitives
type TaskId = string;
type Priority = 'low' | 'medium' | 'high';

// DON'T: Use `any`
function processData(data: any) {} // Bad
function processData(data: unknown) {} // Better
function processData<T extends Record<string, unknown>>(data: T) {} // Best

// DO: Narrow types properly
function handleResponse(response: ApiResponse) {
  if (response.success) {
    // response.data is typed
    return response.data;
  } else {
    // response.error is typed
    throw new Error(response.error.message);
  }
}
```

### Generics

```typescript
// DO: Use meaningful generic names
function findById<TEntity extends { id: string }>(
  items: TEntity[],
  id: string
): TEntity | undefined {
  return items.find(item => item.id === id);
}

// DO: Constrain generics when appropriate
interface Repository<T extends BaseEntity> {
  findById(id: string): Promise<T | null>;
  create(data: Omit<T, 'id' | 'createdAt'>): Promise<T>;
}
```

---

## React Guidelines

### Component Structure

```typescript
// Component file structure
import { useState, useCallback } from 'react';
import { useTask } from '@/hooks/useTask';
import { Button } from '@/components/ui/Button';
import type { Task } from '@/types';

interface TaskCardProps {
  task: Task;
  onStatusChange?: (id: string, status: TaskStatus) => void;
}

export function TaskCard({ task, onStatusChange }: TaskCardProps) {
  // 1. Hooks
  const [isExpanded, setIsExpanded] = useState(false);
  const { updateTask } = useTask();

  // 2. Callbacks
  const handleToggle = useCallback(() => {
    setIsExpanded(prev => !prev);
  }, []);

  const handleComplete = useCallback(() => {
    onStatusChange?.(task.id, 'completed');
  }, [task.id, onStatusChange]);

  // 3. Render helpers (if needed)
  const renderPriority = () => {
    // ...
  };

  // 4. Return JSX
  return (
    <div className="task-card">
      {/* ... */}
    </div>
  );
}
```

### Component Best Practices

```typescript
// DO: Use named exports
export function TaskCard() {}

// DO: Extract complex logic to hooks
function TaskList() {
  const { tasks, isLoading, filters, setFilters } = useTaskList();
  // ...
}

// DO: Use composition
function TaskPage() {
  return (
    <PageLayout>
      <TaskHeader />
      <TaskFilters />
      <TaskList />
      <TaskPagination />
    </PageLayout>
  );
}

// DON'T: Deeply nested conditionals
// Bad
{isLoading ? <Spinner /> : error ? <Error /> : tasks.length === 0 ? <Empty /> : <List />}

// Good
if (isLoading) return <Spinner />;
if (error) return <Error error={error} />;
if (tasks.length === 0) return <Empty />;
return <List tasks={tasks} />;
```

### Hooks Guidelines

```typescript
// Custom hook pattern
function useTask(taskId: string) {
  // Use React Query for server state
  const { data: task, isLoading, error } = useQuery({
    queryKey: ['task', taskId],
    queryFn: () => taskApi.getById(taskId),
  });

  // Mutations
  const updateMutation = useMutation({
    mutationFn: taskApi.update,
    onSuccess: () => {
      queryClient.invalidateQueries(['task', taskId]);
    },
  });

  // Return stable object
  return {
    task,
    isLoading,
    error,
    updateTask: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
  };
}
```

---

## Backend Guidelines

### Service Layer

```typescript
// Service pattern
export const taskService = {
  async createTask(userId: string, data: CreateTaskDto): Promise<Task> {
    // 1. Validate
    if (!data.title?.trim()) {
      throw new AppError('Title is required', 400);
    }

    // 2. Business logic
    const task = {
      ...data,
      userId,
      status: 'pending' as const,
    };

    // 3. Persist
    return taskRepository.create(task);
  },

  async updateTask(
    taskId: string,
    userId: string,
    data: UpdateTaskDto
  ): Promise<Task> {
    // 1. Fetch existing
    const task = await taskRepository.findById(taskId);

    // 2. Check existence
    if (!task) {
      throw new AppError('Task not found', 404);
    }

    // 3. Check authorization
    if (task.userId !== userId) {
      throw new AppError('Not authorized', 403);
    }

    // 4. Update
    return taskRepository.update(taskId, data);
  },
};
```

### Controller Layer

```typescript
// Controller pattern
export const taskController = {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user.id;
      const data = createTaskSchema.parse(req.body);

      const task = await taskService.createTask(userId, data);

      res.status(201).json({
        success: true,
        data: task,
      });
    } catch (error) {
      next(error);
    }
  },

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user.id;
      const filters = taskFiltersSchema.parse(req.query);

      const result = await taskService.getTasks(userId, filters);

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },
};
```

---

## Error Handling

### Error Classes

```typescript
// Custom error class
export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message);
    this.name = 'AppError';
  }
}

// Usage
throw new AppError('Task not found', 404, 'TASK_NOT_FOUND');
throw new AppError('Invalid email', 400, 'VALIDATION_ERROR');
```

### Error Handling Pattern

```typescript
// Async error wrapper
function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>
) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

// Error middleware
function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.code,
        message: err.message,
      },
    });
  }

  console.error(err);
  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred',
    },
  });
}
```

---

## Import Order

```typescript
// 1. Node built-ins
import path from 'path';
import fs from 'fs';

// 2. External packages
import express from 'express';
import { z } from 'zod';

// 3. Internal aliases (@/)
import { taskService } from '@/services/taskService';
import { AppError } from '@/utils/errors';

// 4. Relative imports
import { validateTask } from './validation';
import type { Task } from './types';
```

---

## Comments

```typescript
// DO: Explain WHY, not WHAT
// Bad
// Increment counter
counter++;

// Good
// Retry count for transient failures (max 3 attempts)
retryCount++;

// DO: Use JSDoc for public APIs
/**
 * Creates a new task for the specified user.
 *
 * @param userId - The ID of the user creating the task
 * @param data - The task data
 * @returns The created task
 * @throws {AppError} If validation fails or user quota exceeded
 */
async function createTask(userId: string, data: CreateTaskDto): Promise<Task> {}

// DO: Mark TODOs with context
// TODO(john): Implement pagination - needed for v1.1
// FIXME: Race condition when updating status - see issue #123
```

---

## Code Formatting

### ESLint Configuration

```javascript
// .eslintrc.js
module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'prettier',
  ],
  rules: {
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'react/prop-types': 'off',
    'react/react-in-jsx-scope': 'off',
  },
};
```

### Prettier Configuration

```json
// .prettierrc
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100,
  "arrowParens": "avoid"
}
```

---

## Related Documents

- [Project Setup](./setup.md)
- [Git Workflow](../workflows/git-workflow.md)
- [Testing Strategy](../testing/strategy.md)
