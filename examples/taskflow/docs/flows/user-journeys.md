# TaskFlow User Journeys

## Overview

This document maps complete user journeys through TaskFlow, from entry to goal completion.

## Journey 1: New User Registration and First Task

### Persona: Alex the Freelancer

**Goal:** Sign up and create first task to track client work

### Journey Map

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     NEW USER REGISTRATION JOURNEY                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  STAGE      AWARENESS     SIGNUP      ONBOARD     FIRST USE    VALUE        │
│  ─────      ─────────     ──────      ───────     ─────────    ─────        │
│                                                                              │
│  ACTIONS    Visit landing  Fill form   See dash   Create task  See task     │
│             page           Submit      Explore    Add details  in list      │
│             Read features  Confirm     UI         Set date                  │
│                                                                              │
│  THOUGHTS   "This looks    "Quick      "Clean     "Easy to     "I'm         │
│             simple"        signup"     design"    use"         organized"   │
│                                                                              │
│  EMOTIONS   😐 Curious     😊 Easy     😊 Pleased 😊 Confident 🎉 Success    │
│                                                                              │
│  PAIN       None           None        Where to   What fields  None         │
│  POINTS                                start?     are needed?               │
│                                                                              │
│  TOUCHPTS   Landing page   Register    Dashboard  Task modal   Task list    │
│             Hero section   form        Stats      Form fields  View         │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Flow Diagram

```mermaid
flowchart TB
    A[Visit taskflow.app] --> B[View Landing Page]
    B --> C[Click 'Get Started']
    C --> D[Fill Registration Form]
    D --> E{Valid Input?}
    E -->|No| F[Show Validation Errors]
    F --> D
    E -->|Yes| G[Submit Registration]
    G --> H[Account Created]
    H --> I[Redirect to Dashboard]
    I --> J[View Empty Dashboard]
    J --> K[Click 'New Task']
    K --> L[Fill Task Form]
    L --> M[Click 'Create']
    M --> N[Task Appears in List]
    N --> O[SUCCESS: First Task Created]

    style A fill:#3b82f6
    style O fill:#10b981
```

### Step-by-Step Flow

| Step | Screen | Action | System Response |
|------|--------|--------|-----------------|
| 1 | Landing | Click "Get Started" | Navigate to /register |
| 2 | Register | Enter email | Validate format |
| 3 | Register | Enter password | Show strength indicator |
| 4 | Register | Confirm password | Validate match |
| 5 | Register | Enter name | Required field |
| 6 | Register | Click "Create Account" | Submit form |
| 7 | - | - | Create user, generate JWT |
| 8 | Dashboard | Auto-redirect | Show empty dashboard |
| 9 | Dashboard | Click "New Task" | Open task modal |
| 10 | Modal | Enter task title | Required field |
| 11 | Modal | Set due date (optional) | Date picker |
| 12 | Modal | Set priority (optional) | Dropdown |
| 13 | Modal | Click "Create" | POST /api/v1/tasks |
| 14 | Tasks | See task in list | Task card appears |

---

## Journey 2: Organize Work with Projects

### Persona: Sarah the Team Lead

**Goal:** Create a project to organize client deliverables

### Journey Map

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     PROJECT ORGANIZATION JOURNEY                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  STAGE      NEED          CREATE      ASSIGN      TRACK        DELIVER      │
│  ─────      ────          ──────      ──────      ─────        ───────      │
│                                                                              │
│  ACTIONS    Have many     Create      Add tasks   View         Mark         │
│             unorganized   project     to project  progress     complete     │
│             tasks                                 bar                       │
│                                                                              │
│  THOUGHTS   "This is      "Simple     "Now it's   "I can see   "Project     │
│             chaos"        form"       grouped"    status"      done!"       │
│                                                                              │
│  EMOTIONS   😰 Stressed   😊 Easy     😌 Relief   😊 Informed  🎉 Success    │
│                                                                              │
│  PAIN       Too many      None        Existing    None         None         │
│  POINTS     loose tasks              tasks need                             │
│                                      reassign                               │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Flow Diagram

```mermaid
flowchart TB
    A[View Tasks Page] --> B[Notice disorganized tasks]
    B --> C[Navigate to Projects]
    C --> D[Click 'New Project']
    D --> E[Enter Project Name]
    E --> F[Choose Color]
    F --> G[Click 'Create']
    G --> H[Project Created]
    H --> I[Navigate to Tasks]
    I --> J[Select Task]
    J --> K[Assign to Project]
    K --> L[Repeat for other tasks]
    L --> M[View Project]
    M --> N[See Progress Bar]
    N --> O[SUCCESS: Work Organized]

    style A fill:#3b82f6
    style O fill:#10b981
```

---

## Journey 3: Daily Task Management

### Persona: Alex the Freelancer

**Goal:** Review and complete today's tasks

### Journey Map

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     DAILY TASK MANAGEMENT JOURNEY                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  STAGE      REVIEW        PRIORITIZE   WORK        COMPLETE     END DAY     │
│  ─────      ──────        ──────────   ────        ────────     ───────     │
│                                                                              │
│  ACTIONS    Open app      Check        Start       Mark task    View        │
│             View dash     priorities   task        as done      completed   │
│             See due       Reorder      Work        Get toast    list        │
│             today         if needed                             Check stats │
│                                                                              │
│  THOUGHTS   "What's       "This one    "Let's      "One down,   "Good       │
│             due?"         first"       focus"      more to go"  progress"   │
│                                                                              │
│  EMOTIONS   😐 Focused    😊 Clear     😤 Working  🎉 Progress  😌 Satisfied │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Flow Diagram

```mermaid
flowchart TB
    A[Open TaskFlow] --> B[View Dashboard]
    B --> C[Check 'Due Today' Section]
    C --> D{Tasks Due?}
    D -->|Yes| E[Review Task List]
    D -->|No| F[Check upcoming tasks]
    E --> G[Select Priority Task]
    G --> H[Click to Expand Details]
    H --> I[Work on Task]
    I --> J[Click Checkbox]
    J --> K[Task Marked Complete]
    K --> L[See Success Toast]
    L --> M{More Tasks?}
    M -->|Yes| G
    M -->|No| N[View Completed Section]
    N --> O[Check Daily Stats]
    O --> P[SUCCESS: Day Productive]

    style A fill:#3b82f6
    style P fill:#10b981
```

---

## Journey 4: Track Overdue Tasks

### Persona: Sarah the Team Lead

**Goal:** Identify and address overdue tasks

### Flow Diagram

```mermaid
flowchart TB
    A[Open Dashboard] --> B[Notice Overdue Count]
    B --> C{Overdue > 0?}
    C -->|No| D[All caught up!]
    C -->|Yes| E[Click Overdue Section]
    E --> F[View Overdue Tasks]
    F --> G[For each task:]
    G --> H{Can complete now?}
    H -->|Yes| I[Complete Task]
    H -->|No| J[Update Due Date]
    I --> K[Task moves to Done]
    J --> L[Task removed from Overdue]
    K --> M{More overdue?}
    L --> M
    M -->|Yes| G
    M -->|No| N[SUCCESS: All Addressed]

    style A fill:#3b82f6
    style N fill:#10b981
```

---

## Journey 5: Filter and Find Tasks

### Flow Diagram

```mermaid
flowchart TB
    A[Open Tasks Page] --> B[View All Tasks]
    B --> C[Click Filter Bar]
    C --> D{Filter Type?}
    D -->|Status| E[Select Status Filter]
    D -->|Priority| F[Select Priority Filter]
    D -->|Project| G[Select Project Filter]
    D -->|Tag| H[Select Tag Filter]
    E --> I[Tasks Filtered]
    F --> I
    G --> I
    H --> I
    I --> J[View Filtered Results]
    J --> K{Found task?}
    K -->|Yes| L[Click Task]
    K -->|No| M[Adjust Filters]
    M --> C
    L --> N[View Task Details]
    N --> O[SUCCESS: Task Found]

    style A fill:#3b82f6
    style O fill:#10b981
```

---

## Edge Cases and Error Flows

### Network Error During Save

```mermaid
flowchart TB
    A[User Clicks Save] --> B[API Request]
    B --> C{Network OK?}
    C -->|Yes| D[Save Successful]
    C -->|No| E[Show Error Toast]
    E --> F[Keep Form Data]
    F --> G[Show Retry Button]
    G --> H{User Retries?}
    H -->|Yes| B
    H -->|No| I[Data in Local State]
    D --> J[Close Modal]
    I --> K[Auto-retry on Reconnect]

    style E fill:#ef4444
    style D fill:#10b981
```

### Session Expired

```mermaid
flowchart TB
    A[User Action] --> B[API Request]
    B --> C{Token Valid?}
    C -->|Yes| D[Request Succeeds]
    C -->|No| E[401 Unauthorized]
    E --> F[Try Token Refresh]
    F --> G{Refresh OK?}
    G -->|Yes| H[Retry Original Request]
    G -->|No| I[Redirect to Login]
    I --> J[Show Session Expired Message]
    J --> K[User Logs In Again]
    H --> D

    style E fill:#ef4444
    style I fill:#f59e0b
    style D fill:#10b981
```

---

## Success Metrics per Journey

| Journey | Key Metric | Target |
|---------|-----------|--------|
| Registration | Completion rate | > 80% |
| First Task | Time to first task | < 2 minutes |
| Project Organization | Tasks with projects | > 60% |
| Daily Management | Daily active return | > 50% |
| Overdue Management | Overdue resolution time | < 24 hours |
| Search/Filter | Search success rate | > 90% |
