# TaskFlow Core Features Flow

## Overview

This document describes the flows for TaskFlow's core features: Task CRUD, Project Management, and Tag/Filter operations.

---

## Task CRUD Operations

### Create Task Flow

```mermaid
flowchart TB
    A[User clicks 'New Task'] --> B[Open TaskModal]
    B --> C[Display empty form]
    C --> D[User fills fields]
    D --> E{Required fields valid?}
    E -->|No| F[Show validation errors]
    F --> D
    E -->|Yes| G[User clicks Create]
    G --> H[Optimistic UI update]
    H --> I[POST /api/v1/tasks]
    I --> J{API Success?}
    J -->|Yes| K[Confirm task in cache]
    J -->|No| L[Rollback optimistic update]
    L --> M[Show error toast]
    K --> N[Close modal]
    N --> O[Show success toast]
    O --> P[Task visible in list]

    style A fill:#3b82f6
    style P fill:#10b981
    style L fill:#ef4444
```

### ASCII Create Task Flow

```
CREATE TASK FLOW
════════════════

    ┌─────────────────────────────────────────────────────────────────┐
    │                         TASK FORM                                │
    ├─────────────────────────────────────────────────────────────────┤
    │                                                                  │
    │  Title*:        [_________________________________]              │
    │                                                                  │
    │  Description:   [_________________________________]              │
    │                 [_________________________________]              │
    │                                                                  │
    │  Due Date:      [__/__/____]  📅                                │
    │                                                                  │
    │  Priority:      ○ Low  ● Medium  ○ High  ○ Urgent               │
    │                                                                  │
    │  Project:       [Select project...        ▼]                    │
    │                                                                  │
    │  Tags:          [+ Add tag]  [work] [client-a]                  │
    │                                                                  │
    │                          [Cancel]  [Create Task]                │
    │                                                                  │
    └─────────────────────────────────────────────────────────────────┘

    User Flow:
    ──────────
    1. Click "New Task" button
    2. Modal opens with empty form
    3. Enter title (required)
    4. Optionally fill other fields
    5. Click "Create Task"
    6. Modal closes
    7. Task appears in list
```

### Read/View Task Flow

```mermaid
flowchart TB
    A[User on Tasks Page] --> B[View task list]
    B --> C[Click task row]
    C --> D{Action type?}
    D -->|Expand| E[Show task details inline]
    D -->|Edit| F[Open TaskModal with data]
    E --> G[View full description]
    E --> H[See all tags]
    E --> I[See project link]
    F --> J[Edit form populated]

    style A fill:#3b82f6
```

### Update Task Flow

```mermaid
flowchart TB
    A[User clicks Edit on task] --> B[Open TaskModal]
    B --> C[Populate form with task data]
    C --> D[User modifies fields]
    D --> E[User clicks Save]
    E --> F[Optimistic UI update]
    F --> G[PATCH /api/v1/tasks/:id]
    G --> H{API Success?}
    H -->|Yes| I[Confirm changes]
    H -->|No| J[Rollback changes]
    J --> K[Show error toast]
    I --> L[Close modal]
    L --> M[Show success toast]

    style A fill:#3b82f6
    style M fill:#10b981
    style J fill:#ef4444
```

### Delete Task Flow

```mermaid
flowchart TB
    A[User clicks Delete] --> B[Show confirmation dialog]
    B --> C{User confirms?}
    C -->|No| D[Close dialog]
    C -->|Yes| E[Optimistic remove from UI]
    E --> F[DELETE /api/v1/tasks/:id]
    F --> G{API Success?}
    G -->|Yes| H[Confirm deletion]
    G -->|No| I[Restore task in UI]
    I --> J[Show error toast]
    H --> K[Show success toast]

    style A fill:#ef4444
    style K fill:#10b981
```

---

## Project Management

### Create Project Flow

```mermaid
flowchart TB
    A[User clicks 'New Project'] --> B[Open ProjectModal]
    B --> C[Display form]
    C --> D[Enter project name]
    D --> E[Select color]
    E --> F[Add description optional]
    F --> G[Click Create]
    G --> H[POST /api/v1/projects]
    H --> I{Success?}
    I -->|Yes| J[Project appears in list]
    I -->|No| K[Show error]
    J --> L[Redirect to project page]

    style A fill:#3b82f6
    style L fill:#10b981
```

### ASCII Project List

```
PROJECTS VIEW
═════════════

┌─────────────────────────────────────────────────────────────────────────┐
│  Projects                                            [+ New Project]    │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌─────────────────────┐  ┌─────────────────────┐  ┌────────────────┐   │
│  │ 🔵 Client Website   │  │ 🟢 Mobile App       │  │ 🟣 Marketing   │   │
│  │                     │  │                     │  │                │   │
│  │ 8/12 tasks          │  │ 3/10 tasks          │  │ 5/5 tasks ✓    │   │
│  │ ████████░░░░ 67%    │  │ ███░░░░░░░░░ 30%    │  │ ████████████   │   │
│  │                     │  │                     │  │     100%       │   │
│  │ Due: Feb 15, 2026   │  │ Due: Mar 1, 2026    │  │ Completed!     │   │
│  └─────────────────────┘  └─────────────────────┘  └────────────────┘   │
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │ 📁 Archived Projects (2)                               [Show ▼] │    │
│  └─────────────────────────────────────────────────────────────────┘    │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### Assign Task to Project Flow

```mermaid
flowchart TB
    A[View task] --> B[Click project dropdown]
    B --> C[Select project]
    C --> D[PATCH /api/v1/tasks/:id]
    D --> E{Success?}
    E -->|Yes| F[Task shows project badge]
    F --> G[Project progress updates]
    E -->|No| H[Show error]

    style A fill:#3b82f6
    style G fill:#10b981
```

### Archive Project Flow

```mermaid
flowchart TB
    A[Open project settings] --> B[Click 'Archive Project']
    B --> C[Confirm dialog]
    C --> D{Confirm?}
    D -->|No| E[Cancel]
    D -->|Yes| F[PATCH /api/v1/projects/:id]
    F --> G{Success?}
    G -->|Yes| H[Project moves to archived]
    G -->|No| I[Show error]
    H --> J[Tasks remain but hidden from default view]

    style A fill:#f59e0b
    style H fill:#10b981
```

---

## Filtering and Search

### Filter Tasks Flow

```mermaid
flowchart TB
    A[User on Tasks page] --> B[Click filter dropdown]
    B --> C{Filter type?}
    C -->|Status| D[Select status options]
    C -->|Priority| E[Select priority options]
    C -->|Project| F[Select project]
    C -->|Tag| G[Select tags]
    D --> H[Update URL params]
    E --> H
    F --> H
    G --> H
    H --> I[Refetch with filters]
    I --> J[Display filtered results]
    J --> K[Show active filter badges]

    style A fill:#3b82f6
    style J fill:#10b981
```

### ASCII Filter Bar

```
FILTER BAR
══════════

┌─────────────────────────────────────────────────────────────────────────┐
│                                                                          │
│  🔍 Search tasks...          │ Status ▼ │ Priority ▼ │ Project ▼ │ Tags │
│                                                                          │
│  Active filters: [In Progress ✕] [High Priority ✕] [Client Website ✕]   │
│                                                      [Clear all]         │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘

Filter Dropdowns:
─────────────────

Status:              Priority:           Project:
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│ ☑ All        │    │ ☐ Low        │    │ ☐ All        │
│ ☑ Todo       │    │ ☐ Medium     │    │ ☑ Client Web │
│ ☑ In Progress│    │ ☑ High       │    │ ☐ Mobile App │
│ ☐ Done       │    │ ☐ Urgent     │    │ ☐ Marketing  │
└──────────────┘    └──────────────┘    └──────────────┘
```

### Search Flow

```mermaid
flowchart TB
    A[User types in search] --> B[Debounce 300ms]
    B --> C{Query length > 2?}
    C -->|No| D[Show all tasks]
    C -->|Yes| E[Update URL params]
    E --> F[GET /api/v1/tasks?search=query]
    F --> G[Filter by title/description]
    G --> H[Display results]
    H --> I[Highlight matching text]

    style A fill:#3b82f6
    style I fill:#10b981
```

---

## Tag Management

### Create Tag Flow

```mermaid
flowchart TB
    A[In task form, click Add Tag] --> B[Show tag input]
    B --> C[Type tag name]
    C --> D{Tag exists?}
    D -->|Yes| E[Select existing tag]
    D -->|No| F[Show 'Create new' option]
    F --> G[User selects create]
    G --> H[POST /api/v1/tags]
    H --> I{Success?}
    I -->|Yes| J[Tag created]
    J --> K[Tag attached to task]
    E --> K

    style A fill:#3b82f6
    style K fill:#10b981
```

### ASCII Tag Selection

```
TAG SELECTOR
════════════

┌─────────────────────────────────────────┐
│  Tags:  [work ✕] [urgent ✕] [+ Add tag] │
└─────────────────────────────────────────┘
                    │
                    ▼
        ┌─────────────────────────┐
        │ 🔍 Search or create...  │
        ├─────────────────────────┤
        │ ☐ client-a              │
        │ ☐ client-b              │
        │ ☐ internal              │
        │ ☑ work (selected)       │
        │ ☑ urgent (selected)     │
        ├─────────────────────────┤
        │ + Create "meeting"      │
        └─────────────────────────┘
```

---

## Complete Task Flow (State Transition)

```mermaid
flowchart TB
    A[Task in 'Todo' state] --> B[User starts working]
    B --> C[Click 'Start' or drag to In Progress]
    C --> D[PATCH status = 'in_progress']
    D --> E[Task shows as In Progress]
    E --> F[User completes work]
    F --> G[Click checkbox or 'Complete']
    G --> H[PATCH status = 'done']
    H --> I[Set completed_at timestamp]
    I --> J[Task shows as Done]
    J --> K[Project progress updates]

    style A fill:#6b7280
    style E fill:#3b82f6
    style J fill:#10b981
```

---

## Batch Operations

### Bulk Status Update

```mermaid
flowchart TB
    A[Select multiple tasks] --> B[Checkbox appears]
    B --> C[Select tasks]
    C --> D[Bulk actions bar appears]
    D --> E{Action?}
    E -->|Complete| F[PATCH all to done]
    E -->|Delete| G[DELETE all selected]
    E -->|Move to Project| H[PATCH project_id]
    F --> I[Update UI]
    G --> I
    H --> I
    I --> J[Show success: X tasks updated]

    style A fill:#3b82f6
    style J fill:#10b981
```

---

## Error Handling

### Validation Error Flow

```mermaid
flowchart TB
    A[Submit form] --> B{Client validation}
    B -->|Pass| C[Send to API]
    B -->|Fail| D[Show field errors]
    C --> E{Server validation}
    E -->|Pass| F[Create resource]
    E -->|Fail| G[Return 400 with details]
    G --> H[Parse error response]
    H --> I[Show field-level errors]
    D --> J[User fixes errors]
    I --> J
    J --> A

    style D fill:#ef4444
    style I fill:#ef4444
    style F fill:#10b981
```
