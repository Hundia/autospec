# TaskFlow - Sprint 1 Development Execution Prompt

## Context

You are implementing Sprint 1 of TaskFlow, building on the foundation from Sprint 0. This sprint adds project management, tagging, dashboard statistics, and enhanced filtering.

---

## Prerequisites

Before starting Sprint 1:
- Sprint 0 is complete and tagged (`sprint-0-complete`)
- All Sprint 0 tests are passing
- Database has Sprint 0 migrations applied

---

## New Database Migrations

### Migration: Add Projects Table

```bash
npx prisma migrate dev --name add_projects_table
```

```prisma
// Add to schema.prisma

model Project {
  id          String    @id @default(uuid())
  userId      String    @map("user_id")
  name        String
  description String?
  color       String    @default("#3b82f6")
  isArchived  Boolean   @default(false) @map("is_archived")
  createdAt   DateTime  @default(now()) @map("created_at")
  updatedAt   DateTime  @updatedAt @map("updated_at")

  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  tasks       Task[]

  @@index([userId])
  @@index([userId, isArchived])
  @@map("projects")
}

// Update User model to add relation
model User {
  // ... existing fields
  projects     Project[]
}

// Update Task model to add projectId
model Task {
  // ... existing fields
  projectId   String?      @map("project_id")
  project     Project?     @relation(fields: [projectId], references: [id], onDelete: SetNull)

  @@index([projectId])
}
```

### Migration: Add Tags Tables

```bash
npx prisma migrate dev --name add_tags_tables
```

```prisma
model Tag {
  id        String    @id @default(uuid())
  userId    String    @map("user_id")
  name      String
  color     String    @default("#6b7280")
  createdAt DateTime  @default(now()) @map("created_at")

  user      User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  tasks     TaskTag[]

  @@unique([userId, name])
  @@index([userId])
  @@map("tags")
}

model TaskTag {
  taskId String @map("task_id")
  tagId  String @map("tag_id")

  task   Task   @relation(fields: [taskId], references: [id], onDelete: Cascade)
  tag    Tag    @relation(fields: [tagId], references: [id], onDelete: Cascade)

  @@id([taskId, tagId])
  @@index([tagId])
  @@map("task_tags")
}

// Update User model
model User {
  // ... existing fields
  tags         Tag[]
}

// Update Task model
model Task {
  // ... existing fields
  tags        TaskTag[]
}
```

---

## Project Endpoints Implementation

### POST /api/v1/projects

```typescript
// Request
{
  "name": "Website Redesign",
  "description": "Complete overhaul of company website",
  "color": "#8b5cf6"
}

// Response (201)
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Website Redesign",
    "description": "Complete overhaul of company website",
    "color": "#8b5cf6",
    "isArchived": false,
    "createdAt": "2026-01-30T00:00:00.000Z",
    "taskCount": 0
  }
}
```

### GET /api/v1/projects

```typescript
// Query params: ?includeArchived=true&page=1&limit=20

// Response (200)
{
  "success": true,
  "data": {
    "projects": [
      {
        "id": "uuid",
        "name": "Website Redesign",
        "description": "...",
        "color": "#8b5cf6",
        "isArchived": false,
        "taskCount": 12,
        "completedCount": 5,
        "progress": 42
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 5,
      "totalPages": 1
    }
  }
}
```

### PUT /api/v1/projects/:id

```typescript
// Request
{
  "name": "Website Redesign v2",
  "description": "Updated description",
  "color": "#10b981"
}

// Response (200)
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Website Redesign v2",
    ...
  }
}
```

### PATCH /api/v1/projects/:id/archive

```typescript
// Request
{
  "isArchived": true
}

// Response (200)
{
  "success": true,
  "data": {
    "id": "uuid",
    "isArchived": true,
    ...
  }
}
```

### GET /api/v1/projects/:id/tasks

```typescript
// Query params: ?status=todo&page=1&limit=20

// Response (200)
{
  "success": true,
  "data": {
    "project": {
      "id": "uuid",
      "name": "Website Redesign"
    },
    "tasks": [...],
    "pagination": {...}
  }
}
```

---

## Tag Endpoints Implementation

### POST /api/v1/tags

```typescript
// Request
{
  "name": "urgent",
  "color": "#ef4444"
}

// Response (201)
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "urgent",
    "color": "#ef4444",
    "createdAt": "2026-01-30T00:00:00.000Z",
    "taskCount": 0
  }
}
```

### GET /api/v1/tags

```typescript
// Response (200)
{
  "success": true,
  "data": {
    "tags": [
      {
        "id": "uuid",
        "name": "urgent",
        "color": "#ef4444",
        "taskCount": 5
      },
      {
        "id": "uuid",
        "name": "bug",
        "color": "#f59e0b",
        "taskCount": 3
      }
    ]
  }
}
```

### Task Tag Management

#### POST /api/v1/tasks/:id/tags

```typescript
// Request
{
  "tagIds": ["uuid1", "uuid2"]
}

// Response (200)
{
  "success": true,
  "data": {
    "id": "task-uuid",
    "title": "Fix login bug",
    "tags": [
      { "id": "uuid1", "name": "urgent", "color": "#ef4444" },
      { "id": "uuid2", "name": "bug", "color": "#f59e0b" }
    ]
  }
}
```

#### DELETE /api/v1/tasks/:taskId/tags/:tagId

```typescript
// Response (200)
{
  "success": true,
  "message": "Tag removed from task"
}
```

---

## Dashboard Endpoints Implementation

### GET /api/v1/dashboard/stats

```typescript
// Response (200)
{
  "success": true,
  "data": {
    "overview": {
      "total": 45,
      "todo": 20,
      "inProgress": 15,
      "done": 10,
      "overdue": 5
    },
    "dueThisWeek": 8,
    "completedThisWeek": 12,
    "projects": [
      {
        "id": "uuid",
        "name": "Website Redesign",
        "taskCount": 12,
        "completedCount": 5,
        "progress": 42
      }
    ],
    "priorityBreakdown": {
      "low": 10,
      "medium": 20,
      "high": 10,
      "urgent": 5
    }
  }
}
```

### GET /api/v1/dashboard/activity

```typescript
// Query params: ?limit=10

// Response (200)
{
  "success": true,
  "data": {
    "activities": [
      {
        "id": "uuid",
        "type": "task_completed",
        "taskId": "task-uuid",
        "taskTitle": "Fix login bug",
        "timestamp": "2026-01-30T10:30:00.000Z"
      },
      {
        "id": "uuid",
        "type": "task_created",
        "taskId": "task-uuid",
        "taskTitle": "Add search feature",
        "timestamp": "2026-01-30T09:15:00.000Z"
      }
    ]
  }
}
```

---

## Enhanced Task Filtering

### Updated GET /api/v1/tasks

```typescript
// Query params
interface TaskQueryParams {
  // Status filter (comma-separated for multiple)
  status?: 'todo' | 'in_progress' | 'done' | string; // "todo,in_progress"

  // Priority filter (comma-separated for multiple)
  priority?: 'low' | 'medium' | 'high' | 'urgent' | string;

  // Project filter
  projectId?: string;

  // Tag filter (comma-separated for multiple)
  tagIds?: string;

  // Search in title and description
  search?: string;

  // Date range filters
  dueBefore?: string; // ISO date
  dueAfter?: string;  // ISO date

  // Pagination
  page?: number;
  limit?: number;

  // Sorting
  sortBy?: 'createdAt' | 'dueDate' | 'priority' | 'title';
  sortOrder?: 'asc' | 'desc';
}

// Example request
GET /api/v1/tasks?status=todo,in_progress&priority=high,urgent&projectId=xxx&tagIds=tag1,tag2&search=bug&dueBefore=2026-02-01&page=1&limit=20&sortBy=dueDate&sortOrder=asc

// Response (200)
{
  "success": true,
  "data": {
    "tasks": [
      {
        "id": "uuid",
        "title": "Fix login bug",
        "description": "...",
        "status": "todo",
        "priority": "high",
        "dueDate": "2026-01-31",
        "project": {
          "id": "project-uuid",
          "name": "Website Redesign",
          "color": "#8b5cf6"
        },
        "tags": [
          { "id": "tag-uuid", "name": "bug", "color": "#f59e0b" }
        ],
        "createdAt": "...",
        "updatedAt": "..."
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 5,
      "totalPages": 1
    },
    "filters": {
      "status": ["todo", "in_progress"],
      "priority": ["high", "urgent"],
      "projectId": "xxx",
      "tagIds": ["tag1", "tag2"],
      "search": "bug"
    }
  }
}
```

---

## Validation Schemas

```typescript
// src/schemas/project.schema.ts
import { z } from 'zod';

export const createProjectSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required').max(100),
    description: z.string().max(500).optional(),
    color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid color format').optional(),
  }),
});

export const updateProjectSchema = z.object({
  body: z.object({
    name: z.string().min(1).max(100).optional(),
    description: z.string().max(500).optional(),
    color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  }),
  params: z.object({
    id: z.string().uuid(),
  }),
});

// src/schemas/tag.schema.ts
export const createTagSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required').max(50),
    color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid color format').optional(),
  }),
});

export const addTagsToTaskSchema = z.object({
  body: z.object({
    tagIds: z.array(z.string().uuid()).min(1, 'At least one tag required'),
  }),
  params: z.object({
    id: z.string().uuid(),
  }),
});

// src/schemas/task.schema.ts (updated)
export const taskQuerySchema = z.object({
  query: z.object({
    status: z.string().optional(),
    priority: z.string().optional(),
    projectId: z.string().uuid().optional(),
    tagIds: z.string().optional(),
    search: z.string().optional(),
    dueBefore: z.string().datetime().optional(),
    dueAfter: z.string().datetime().optional(),
    page: z.coerce.number().int().positive().optional().default(1),
    limit: z.coerce.number().int().positive().max(100).optional().default(20),
    sortBy: z.enum(['createdAt', 'dueDate', 'priority', 'title']).optional(),
    sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
  }),
});
```

---

## Service Layer Implementation

### Dashboard Service

```typescript
// src/services/dashboard.service.ts

export class DashboardService {
  async getStats(userId: string) {
    const [overview, weekTasks, projects] = await Promise.all([
      this.getOverview(userId),
      this.getWeekTasks(userId),
      this.getProjectStats(userId),
    ]);

    return {
      overview,
      dueThisWeek: weekTasks.due,
      completedThisWeek: weekTasks.completed,
      projects,
      priorityBreakdown: overview.priorityBreakdown,
    };
  }

  private async getOverview(userId: string) {
    const stats = await prisma.task.groupBy({
      by: ['status'],
      where: { userId },
      _count: { id: true },
    });

    const overdue = await prisma.task.count({
      where: {
        userId,
        status: { not: 'done' },
        dueDate: { lt: new Date() },
      },
    });

    return {
      total: stats.reduce((sum, s) => sum + s._count.id, 0),
      todo: stats.find(s => s.status === 'todo')?._count.id ?? 0,
      inProgress: stats.find(s => s.status === 'in_progress')?._count.id ?? 0,
      done: stats.find(s => s.status === 'done')?._count.id ?? 0,
      overdue,
    };
  }

  private async getWeekTasks(userId: string) {
    const now = new Date();
    const weekStart = startOfWeek(now);
    const weekEnd = endOfWeek(now);

    const [due, completed] = await Promise.all([
      prisma.task.count({
        where: {
          userId,
          dueDate: { gte: weekStart, lte: weekEnd },
          status: { not: 'done' },
        },
      }),
      prisma.task.count({
        where: {
          userId,
          completedAt: { gte: weekStart, lte: weekEnd },
        },
      }),
    ]);

    return { due, completed };
  }

  private async getProjectStats(userId: string) {
    const projects = await prisma.project.findMany({
      where: { userId, isArchived: false },
      include: {
        _count: { select: { tasks: true } },
        tasks: {
          select: { status: true },
        },
      },
    });

    return projects.map(p => ({
      id: p.id,
      name: p.name,
      taskCount: p._count.tasks,
      completedCount: p.tasks.filter(t => t.status === 'done').length,
      progress: p._count.tasks > 0
        ? Math.round((p.tasks.filter(t => t.status === 'done').length / p._count.tasks) * 100)
        : 0,
    }));
  }
}
```

---

## Update Task Model for Tags

### Updated Task Response

When returning tasks, include project and tags:

```typescript
// src/services/task.service.ts

async findById(id: string, userId: string) {
  const task = await prisma.task.findFirst({
    where: { id, userId },
    include: {
      project: {
        select: { id: true, name: true, color: true },
      },
      tags: {
        include: {
          tag: {
            select: { id: true, name: true, color: true },
          },
        },
      },
    },
  });

  if (!task) return null;

  return {
    ...task,
    tags: task.tags.map(tt => tt.tag),
  };
}
```

---

## Frontend Components

### Project List Component

```tsx
// src/components/ProjectList.tsx
import { useQuery } from '@tanstack/react-query';
import { projectsApi } from '@/services/api';

export function ProjectList() {
  const { data, isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: () => projectsApi.list(),
  });

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="space-y-4">
      {data?.projects.map(project => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}
```

### Tag Selector Component

```tsx
// src/components/TagSelector.tsx
interface TagSelectorProps {
  selectedTags: string[];
  onTagsChange: (tagIds: string[]) => void;
}

export function TagSelector({ selectedTags, onTagsChange }: TagSelectorProps) {
  const { data: tags } = useQuery({
    queryKey: ['tags'],
    queryFn: () => tagsApi.list(),
  });

  const toggleTag = (tagId: string) => {
    if (selectedTags.includes(tagId)) {
      onTagsChange(selectedTags.filter(id => id !== tagId));
    } else {
      onTagsChange([...selectedTags, tagId]);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {tags?.map(tag => (
        <button
          key={tag.id}
          onClick={() => toggleTag(tag.id)}
          className={cn(
            'px-3 py-1 rounded-full text-sm',
            selectedTags.includes(tag.id)
              ? 'ring-2 ring-offset-2'
              : 'opacity-60'
          )}
          style={{ backgroundColor: tag.color }}
        >
          {tag.name}
        </button>
      ))}
    </div>
  );
}
```

### Dashboard Component

```tsx
// src/pages/Dashboard.tsx
export function Dashboard() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: () => dashboardApi.getStats(),
  });

  if (isLoading) return <DashboardSkeleton />;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {/* Overview Cards */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard title="Total Tasks" value={stats.overview.total} />
        <StatCard title="In Progress" value={stats.overview.inProgress} color="blue" />
        <StatCard title="Completed" value={stats.overview.done} color="green" />
        <StatCard title="Overdue" value={stats.overview.overdue} color="red" />
      </div>

      {/* Project Progress */}
      <section>
        <h2 className="text-lg font-semibold mb-4">Project Progress</h2>
        <div className="space-y-3">
          {stats.projects.map(project => (
            <ProjectProgress key={project.id} project={project} />
          ))}
        </div>
      </section>
    </div>
  );
}
```

---

## Testing Requirements

### New Test Suites

```typescript
// tests/project.test.ts
describe('Project Endpoints', () => {
  describe('POST /api/v1/projects', () => {
    it('should create a project', async () => {
      const response = await request(app)
        .post('/api/v1/projects')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Test Project', color: '#8b5cf6' });

      expect(response.status).toBe(201);
      expect(response.body.data.name).toBe('Test Project');
    });
  });

  describe('GET /api/v1/projects', () => {
    it('should list user projects with task counts', async () => {
      const response = await request(app)
        .get('/api/v1/projects')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.data.projects[0]).toHaveProperty('taskCount');
    });
  });
});

// tests/tag.test.ts
describe('Tag Endpoints', () => {
  describe('POST /api/v1/tasks/:id/tags', () => {
    it('should add tags to task', async () => {
      const response = await request(app)
        .post(`/api/v1/tasks/${taskId}/tags`)
        .set('Authorization', `Bearer ${token}`)
        .send({ tagIds: [tagId1, tagId2] });

      expect(response.status).toBe(200);
      expect(response.body.data.tags).toHaveLength(2);
    });
  });
});
```

---

## Commands Reference

```bash
# Run new migrations
cd backend
npx prisma migrate dev --name add_projects
npx prisma migrate dev --name add_tags
npx prisma generate

# Verify schema
npx prisma validate

# Open Prisma Studio to inspect data
npx prisma studio

# Run tests
npm run test
npm run test:coverage

# Run specific test file
npm run test -- project.test.ts
npm run test -- tag.test.ts
```

---

## Checklist Before Completing Sprint 1

- [ ] Project migrations applied successfully
- [ ] Tag migrations applied successfully
- [ ] All project CRUD endpoints working
- [ ] All tag CRUD endpoints working
- [ ] Task-tag assignment working
- [ ] Dashboard stats endpoint working
- [ ] Enhanced filtering working with all parameters
- [ ] Unit tests for new services
- [ ] Integration tests for new endpoints
- [ ] Frontend project management working
- [ ] Frontend tag management working
- [ ] Frontend dashboard displaying correctly
- [ ] ESLint + Prettier passing
- [ ] TypeScript compiling without errors
- [ ] All Sprint 0 tests still passing (regression)
