# TaskFlow - Sprint 1 Planning Guide

## Sprint Overview

**Sprint**: 1 - Projects, Tags & Enhanced Task Management
**Duration**: 1-2 weeks
**Prerequisites**: Sprint 0 completed and tagged
**Focus**: Project organization, tagging system, and dashboard

---

## Sprint Goals

1. Implement project management (create, organize tasks by project)
2. Create tagging system for tasks
3. Build dashboard with task statistics
4. Enhance task filtering and search capabilities
5. Improve frontend UI/UX

---

## User Stories

### US-1.1: Project Management
**As a** user
**I want** to organize my tasks into projects
**So that** I can manage related work together

**Acceptance Criteria:**
- [ ] Create new project with name, description, and color
- [ ] List all user's projects
- [ ] Update project details
- [ ] Archive/unarchive projects
- [ ] Delete projects (tasks remain but become unassigned)
- [ ] Assign tasks to projects
- [ ] View tasks filtered by project

### US-1.2: Tagging System
**As a** user
**I want** to add tags to my tasks
**So that** I can categorize and find them easily

**Acceptance Criteria:**
- [ ] Create custom tags with name and color
- [ ] Add multiple tags to a task
- [ ] Remove tags from tasks
- [ ] Filter tasks by tag
- [ ] Delete tags (removes from all tasks)
- [ ] View all tasks with a specific tag

### US-1.3: Dashboard
**As a** user
**I want** to see an overview of my tasks
**So that** I can understand my workload at a glance

**Acceptance Criteria:**
- [ ] Display total tasks count
- [ ] Show tasks by status (todo, in_progress, done)
- [ ] Show overdue tasks count
- [ ] Display tasks due this week
- [ ] Show project progress (% complete)
- [ ] Recent activity feed

### US-1.4: Enhanced Filtering
**As a** user
**I want** to filter and search my tasks
**So that** I can find specific tasks quickly

**Acceptance Criteria:**
- [ ] Search tasks by title/description
- [ ] Filter by multiple statuses
- [ ] Filter by multiple priorities
- [ ] Filter by project
- [ ] Filter by tags
- [ ] Filter by due date range
- [ ] Combine multiple filters

---

## Technical Tasks

### Backend Tasks
| ID | Task | Estimate | Priority |
|----|------|----------|----------|
| BE-1.1 | Create Project model and migration | 1h | P0 |
| BE-1.2 | Create Tag model and migration | 1h | P0 |
| BE-1.3 | Create TaskTag junction table | 1h | P0 |
| BE-1.4 | Implement project CRUD endpoints | 3h | P0 |
| BE-1.5 | Implement tag CRUD endpoints | 3h | P0 |
| BE-1.6 | Add tag assignment to tasks | 2h | P0 |
| BE-1.7 | Implement dashboard statistics endpoint | 3h | P0 |
| BE-1.8 | Add advanced task filtering | 3h | P0 |
| BE-1.9 | Add full-text search for tasks | 2h | P1 |
| BE-1.10 | Write project endpoint tests | 2h | P1 |
| BE-1.11 | Write tag endpoint tests | 2h | P1 |
| BE-1.12 | Write dashboard endpoint tests | 2h | P1 |

### Frontend Tasks
| ID | Task | Estimate | Priority |
|----|------|----------|----------|
| FE-1.1 | Create project list page | 3h | P0 |
| FE-1.2 | Create project form component | 2h | P0 |
| FE-1.3 | Create tag management component | 3h | P0 |
| FE-1.4 | Add tag selector to task form | 2h | P0 |
| FE-1.5 | Build dashboard page | 4h | P0 |
| FE-1.6 | Create statistics cards component | 2h | P0 |
| FE-1.7 | Implement project progress chart | 2h | P1 |
| FE-1.8 | Add advanced filter panel | 3h | P0 |
| FE-1.9 | Implement search functionality | 2h | P1 |
| FE-1.10 | Update task list with project/tag display | 2h | P0 |
| FE-1.11 | Add color picker for projects/tags | 2h | P2 |
| FE-1.12 | Write component tests | 3h | P1 |

---

## API Endpoints Summary

### Projects
```
GET    /api/v1/projects           - List all projects
POST   /api/v1/projects           - Create new project
GET    /api/v1/projects/:id       - Get project by ID
PUT    /api/v1/projects/:id       - Update project
DELETE /api/v1/projects/:id       - Delete project
PATCH  /api/v1/projects/:id/archive - Archive/unarchive project
GET    /api/v1/projects/:id/tasks - Get tasks in project
```

### Tags
```
GET    /api/v1/tags               - List all tags
POST   /api/v1/tags               - Create new tag
GET    /api/v1/tags/:id           - Get tag by ID
PUT    /api/v1/tags/:id           - Update tag
DELETE /api/v1/tags/:id           - Delete tag
GET    /api/v1/tags/:id/tasks     - Get tasks with tag
```

### Task Tag Management
```
POST   /api/v1/tasks/:id/tags     - Add tags to task
DELETE /api/v1/tasks/:id/tags/:tagId - Remove tag from task
```

### Dashboard
```
GET    /api/v1/dashboard/stats    - Get task statistics
GET    /api/v1/dashboard/activity - Get recent activity
```

### Enhanced Task Filtering
```
GET    /api/v1/tasks?
  status=todo,in_progress&
  priority=high,urgent&
  projectId=xxx&
  tagIds=xxx,yyy&
  search=keyword&
  dueBefore=2026-02-01&
  dueAfter=2026-01-01&
  page=1&
  limit=20
```

---

## Database Schema Changes

### New Tables

```prisma
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
  @@map("projects")
}

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
```

### Task Model Updates

```prisma
model Task {
  // ... existing fields
  projectId   String?      @map("project_id")

  project     Project?     @relation(fields: [projectId], references: [id], onDelete: SetNull)
  tags        TaskTag[]

  @@index([projectId])
}
```

---

## Definition of Done (DoD)

A feature is considered DONE when:

### Code Quality
- [ ] Code follows established style guide (ESLint passes)
- [ ] Code is properly formatted (Prettier passes)
- [ ] No TypeScript errors
- [ ] Code has been reviewed

### Testing
- [ ] Unit tests written and passing (>70% coverage)
- [ ] Integration tests for new API endpoints
- [ ] Manual testing completed
- [ ] Regression tests pass (Sprint 0 features still work)

### Documentation
- [ ] API endpoints documented
- [ ] Database changes documented
- [ ] Component documentation updated

### Deployment
- [ ] Code merged to main branch
- [ ] CI pipeline passes
- [ ] Migrations run successfully
- [ ] No breaking changes to existing API

---

## Dependencies & Blockers

### Dependencies
- Sprint 0 must be completed and stable
- All Sprint 0 tests passing
- Database migrations from Sprint 0 applied

### Potential Blockers
- Complex filtering queries may need optimization
- Tag/task many-to-many relationship complexity
- Dashboard aggregations performance

---

## Sprint 1 Success Criteria

At the end of Sprint 1, we should have:

1. **Working Project Management**
   - Users can create and manage projects
   - Tasks can be assigned to projects
   - Project progress is visible

2. **Functional Tagging System**
   - Users can create custom tags
   - Tasks can have multiple tags
   - Filtering by tags works

3. **Dashboard**
   - Overview of task statistics
   - Visual progress indicators
   - Quick access to important tasks

4. **Enhanced Filtering**
   - Multi-filter support
   - Search functionality
   - URL-based filter persistence

---

## Notes for Developers

- Maintain backward compatibility with Sprint 0 API
- Use database transactions for tag assignments
- Implement proper cascading deletes
- Consider pagination for large tag/project lists
- Dashboard stats should be cached where possible
