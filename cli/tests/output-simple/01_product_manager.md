---
role: product_manager
spec_version: "1.0"
generated_by: autospec v0.2.0
model: auto
provider: claude-code
source_srs: srs-simple.md
source_hash: "sha256:7458b2f5b29602d300ec5766ab196f4f026b7aca8470f82fe507d40b7c83ea36"
generated_at: 2026-03-21T09:31:39.926Z
---

# 01 — Product Manager Specification: TaskFlow

## Problem Statement

Individual professionals and students lack a lightweight, fast task management tool that works offline and on mobile. Existing solutions (Todoist, Asana, Notion) are bloated with team collaboration features, slow to load, and require constant internet connectivity. Users abandon these tools because the overhead of managing the tool exceeds the overhead of managing their tasks.

TaskFlow solves this by providing a single-user, offline-capable PWA focused exclusively on personal task CRUD, categorization, and a glanceable daily dashboard — deployable as an open-source project with zero infrastructure cost.

## Target Users

### Persona 1: Noa, Freelance UX Designer

- **Age:** 29
- **Role:** Independent contractor juggling 3–5 client projects simultaneously
- **Goals:** Track deliverables across clients, never miss a deadline, quickly triage what to work on each morning
- **Pain Points:**
  - Uses Apple Notes + Google Calendar + sticky notes — tasks fall through the cracks
  - Tried Asana but it's too heavy for one person; 80% of features are team-oriented
  - Works from cafés with spotty Wi-Fi; needs the app to work offline
  - Checks tasks on her phone between meetings; current tools have poor mobile UX
- **Tech Comfort:** High — uses dev tools daily, comfortable with web apps
- **Task Volume:** Creates 5–10 tasks/day, completes 3–7, carries over the rest

### Persona 2: Amit, Computer Science Student

- **Age:** 21
- **Role:** Full-time university student with a part-time tutoring job
- **Goals:** Track assignment deadlines, separate school from personal tasks, see what's overdue at a glance
- **Pain Points:**
  - Forgets assignments because they're scattered across syllabi, LMS notifications, and group chats
  - Needs categories to separate "CS 301", "Linear Algebra", "Tutoring", and "Personal"
  - Wants something faster than Notion — just open, add task, close
  - Limited budget; won't pay for premium task apps
- **Tech Comfort:** Medium-high — uses web apps daily but won't self-host anything
- **Task Volume:** Creates 3–5 tasks/day, bulk-creates weekly assignments on Sundays

## User Stories

### Authentication

**US-01:** As Noa, I want to register with my email and password, so that my tasks are private and persistent across devices.
- **Given** I am on the registration page
- **When** I enter a valid email and a password (≥8 characters) and submit
- **Then** my account is created, I am logged in, and I see the empty dashboard

**US-02:** As Amit, I want to log in with my existing credentials, so that I can access my tasks from my laptop or phone.
- **Given** I have a registered account
- **When** I enter my email and correct password
- **Then** I am authenticated via JWT and redirected to the dashboard

**US-03:** As Noa, I want to stay logged in across browser sessions, so that I don't re-enter credentials every day.
- **Given** I have logged in previously and my JWT refresh token is valid
- **When** I open the app
- **Then** my session is silently refreshed and I land on the dashboard

### Task CRUD

**US-04:** As Noa, I want to create a task with a title, optional description, due date, and priority (low/medium/high), so that I capture work items quickly.
- **Given** I am on the dashboard or task list
- **When** I click "Add Task", fill in the title and optional fields, and submit
- **Then** the task appears in my task list within 500ms, with the correct priority badge and due date

**US-05:** As Amit, I want to edit a task's title, description, due date, or priority, so that I can update tasks as requirements change.
- **Given** I have an existing task
- **When** I click on the task, modify any field, and save
- **Then** the updated values are persisted and reflected immediately in the UI

**US-06:** As Noa, I want to mark a task as complete, so that I can track my progress and clear finished items.
- **Given** I have an incomplete task
- **When** I click the completion checkbox or button
- **Then** the task status changes to "done", it moves out of active views, and the completion count on the dashboard increments

**US-07:** As Amit, I want to delete a task, so that I can remove items that are no longer relevant.
- **Given** I have an existing task
- **When** I click delete and confirm the action
- **Then** the task is permanently removed and no longer appears in any view

### Categories

**US-08:** As Amit, I want to create custom categories (e.g., "CS 301", "Personal"), so that I can organize tasks by context.
- **Given** I am in the category management view or creating/editing a task
- **When** I create a new category with a name
- **Then** the category is available for assignment to any task

**US-09:** As Noa, I want to assign a category to a task, so that I can group tasks by client or project.
- **Given** I am creating or editing a task
- **When** I select a category from the dropdown
- **Then** the task is associated with that category and appears when filtering by it

### Dashboard

**US-10:** As Noa, I want to see a dashboard showing today's tasks, overdue items, and completion stats, so that I can prioritize my morning in under 30 seconds.
- **Given** I am logged in and have tasks with various due dates and statuses
- **When** I open the app or navigate to the dashboard
- **Then** I see three sections: "Today" (tasks due today), "Overdue" (past-due incomplete tasks), and "Stats" (tasks completed today/this week/total)

### Search & Filter

**US-11:** As Amit, I want to filter tasks by category, priority, or status, so that I can focus on a specific subset of my tasks.
- **Given** I have tasks across multiple categories and priorities
- **When** I apply one or more filters
- **Then** the task list updates to show only matching tasks, with the active filters visible

**US-12:** As Noa, I want to search tasks by keyword in the title or description, so that I can find a specific task without scrolling.
- **Given** I have 50+ tasks
- **When** I type a search query into the search bar
- **Then** results appear within 300ms, matching against title and description text

### Offline & PWA

**US-13:** As Noa, I want the app to work offline when I'm on a train or in a café without Wi-Fi, so that I can still view, create, and edit tasks.
- **Given** I have previously loaded the app while online
- **When** I lose network connectivity
- **Then** the app loads from the service worker cache, I can perform CRUD operations, and changes sync when connectivity returns

**US-14:** As Amit, I want to install the app to my phone's home screen, so that it feels like a native app.
- **Given** I visit the app on a mobile browser
- **When** I use the browser's "Add to Home Screen" or install prompt
- **Then** the app installs as a PWA with an icon, splash screen, and standalone window

## User Flows

### Flow 1: First-Time Registration → First Task

1. User visits TaskFlow URL
2. App detects no auth token → shows login/register screen
3. User clicks "Register"
4. User enters email + password (validated: email format, password ≥8 chars)
   - **Decision:** Validation fails → show inline errors, stay on form
   - **Decision:** Validation passes → proceed
5. Backend creates account (bcrypt-hashed password), returns JWT
6. App stores JWT, redirects to empty dashboard
7. Dashboard shows "No tasks yet — create your first task" prompt
8. User clicks "Add Task"
9. Task creation form opens (modal or inline)
10. User enters title (required), optional description, due date, priority, category
11. User submits → task saved to SQLite → task appears on dashboard
12. Dashboard "Today" section updates if due date is today

### Flow 2: Morning Triage (Returning User)

1. User opens app (JWT auto-refreshed if needed)
2. Dashboard loads showing: Today's tasks (sorted by priority), Overdue items (highlighted in red/warning), Completion stats
3. User scans overdue items
   - **Decision:** Task still relevant → update due date or complete it
   - **Decision:** Task no longer relevant → delete it
4. User reviews today's tasks
5. User completes tasks throughout the day (checkbox toggle)
6. Stats update in real-time

### Flow 3: Search for a Specific Task

1. User navigates to task list view
2. User types keyword into search bar
3. Results filter in real-time (debounced, 300ms)
   - **Decision:** Found → user clicks task to view/edit
   - **Decision:** Not found → user clears search, tries filters
4. User applies category/priority/status filters
5. Combined search + filters narrow results

### Flow 4: Offline Usage

1. User opens app while online → service worker caches app shell + data
2. User goes offline (network drops)
3. User creates/edits/completes tasks → changes stored in local queue
4. Network returns → service worker syncs queued changes to backend
   - **Decision:** Sync succeeds → local queue cleared
   - **Decision:** Conflict detected → last-write-wins (single-user, no merge conflicts expected)

## MVP Scope

| Feature | In MVP (v1) | Out of MVP |
|---------|:-----------:|:----------:|
| Email/password registration & login | ✅ | |
| JWT access + refresh tokens | ✅ | |
| Task CRUD (title, description, due date, priority) | ✅ | |
| Task status toggle (incomplete ↔ complete) | ✅ | |
| User-defined categories | ✅ | |
| Assign one category per task | ✅ | |
| Dashboard: today's tasks | ✅ | |
| Dashboard: overdue items | ✅ | |
| Dashboard: completion stats (today/week/total) | ✅ | |
| Filter by category, priority, status | ✅ | |
| Full-text search on title/description | ✅ | |
| PWA manifest + service worker | ✅ | |
| Offline read (cached app shell + data) | ✅ | |
| Offline write with sync queue | ✅ | |
| Mobile-responsive layout (Tailwind CSS) | ✅ | |
| Social/OAuth login (Google, GitHub) | | ❌ |
| Team/shared task lists | | ❌ |
| File attachments on tasks | | ❌ |
| Recurring/repeating tasks | | ❌ |
| Subtasks / checklists within a task | | ❌ |
| Task comments or activity log | | ❌ |
| Calendar view | | ❌ |
| Notifications (push, email, SMS) | | ❌ |
| Multiple categories per task (tags) | | ❌ |
| Dark mode | | ❌ |
| Data export (CSV, JSON) | | ❌ |
| Third-party integrations (Slack, email) | | ❌ |
| Multi-language / i18n | | ❌ |

## Out of Scope

The following are **explicitly excluded** from v1 and should not be designed for, even at the schema level:

1. **Team collaboration** — No shared tasks, no user invitations, no permissions model. TaskFlow is single-user by design in v1.
2. **Recurring tasks** — No repeat schedules (daily, weekly, monthly). Users must manually re-create tasks.
3. **Subtasks** — Tasks are flat; no parent-child hierarchy or checklists within a task.
4. **Notifications** — No push notifications, no email reminders, no SMS alerts. The dashboard is the sole awareness mechanism.
5. **File attachments** — No image, document, or file uploads on tasks.
6. **Calendar view** — Dashboard and list view only; no calendar grid visualization.
7. **Analytics beyond dashboard stats** — No productivity charts, streaks, or historical trend analysis.
8. **Admin panel** — No administrative backend; the user manages their own data only.
9. **API for third-party consumers** — The API serves only the TaskFlow frontend; no public API documentation or versioning strategy for external consumers.

## Acceptance Criteria

### AC-1: Authentication (see `02_backend_lead.md` for API design)

| # | Criterion | Test Method |
|---|-----------|-------------|
| AC-1.1 | Registration with valid email + password (≥8 chars) creates account and returns JWT | POST `/auth/register` → 201, response includes `accessToken` and `refreshToken` |
| AC-1.2 | Registration with duplicate email returns 409 Conflict | POST `/auth/register` with existing email → 409 |
| AC-1.3 | Registration with invalid email format returns 400 | POST `/auth/register` with "notanemail" → 400 with validation message |
| AC-1.4 | Login with correct credentials returns JWT pair | POST `/auth/login` → 200 with tokens |
| AC-1.5 | Login with wrong password returns 401 | POST `/auth/login` with wrong password → 401 |
| AC-1.6 | Expired access token is refreshed via refresh token | POST `/auth/refresh` with valid refresh token → new access token |
| AC-1.7 | Password is stored as bcrypt hash (not plaintext) | DB inspection: `users.password` starts with `$2b$` |

### AC-2: Task CRUD (see `02_backend_lead.md` for API, `03_frontend_lead.md` for UI)

| # | Criterion | Test Method |
|---|-----------|-------------|
| AC-2.1 | Create task with title only (minimum required field) succeeds | POST `/tasks` with `{ title: "Test" }` → 201 |
| AC-2.2 | Create task with all fields (title, description, due date, priority, category) succeeds | POST `/tasks` with full payload → 201, all fields persisted |
| AC-2.3 | Read single task returns all fields including timestamps | GET `/tasks/:id` → 200 with complete task object |
| AC-2.4 | Update task title persists the change | PATCH `/tasks/:id` with `{ title: "Updated" }` → 200, subsequent GET confirms |
| AC-2.5 | Delete task removes it from all queries | DELETE `/tasks/:id` → 204, subsequent GET → 404 |
| AC-2.6 | Toggle task status between "pending" and "done" | PATCH `/tasks/:id` with `{ status: "done" }` → 200 |
| AC-2.7 | Creating 10 tasks takes under 2 minutes via UI | Timed Playwright test: 10× (click add, type title, set priority, submit) < 120s |
| AC-2.8 | Priority accepts only "low", "medium", "high" | POST `/tasks` with `{ priority: "critical" }` → 400 |

### AC-3: Categories

| # | Criterion | Test Method |
|---|-----------|-------------|
| AC-3.1 | Create a category with a unique name | POST `/categories` with `{ name: "Work" }` → 201 |
| AC-3.2 | Duplicate category name returns error | POST `/categories` with existing name → 409 |
| AC-3.3 | Assign category to task during creation | POST `/tasks` with `{ categoryId: <id> }` → task linked to category |
| AC-3.4 | Change task category via update | PATCH `/tasks/:id` with new `categoryId` → updated |
| AC-3.5 | Delete category does not delete associated tasks | DELETE `/categories/:id` → tasks remain, `categoryId` set to null |

### AC-4: Dashboard

| # | Criterion | Test Method |
|---|-----------|-------------|
| AC-4.1 | "Today" section shows only tasks with due date = today | Create tasks with various dates, verify dashboard filter |
| AC-4.2 | "Overdue" section shows incomplete tasks with due date < today | Create past-due incomplete task, verify it appears in overdue |
| AC-4.3 | Completed tasks do not appear in "Overdue" | Complete an overdue task, verify it leaves the overdue section |
| AC-4.4 | Stats show correct counts for completed today / this week / total | Complete known number of tasks, verify stat values |
| AC-4.5 | Dashboard loads in under 1 second | Playwright performance measurement: `navigationStart` to `domContentLoaded` < 1000ms |

### AC-5: Search & Filter

| # | Criterion | Test Method |
|---|-----------|-------------|
| AC-5.1 | Full-text search matches title substrings | Search "budget" finds task titled "Q3 Budget Review" |
| AC-5.2 | Full-text search matches description substrings | Search "client" finds task with "Send to client" in description |
| AC-5.3 | Filter by single category returns only matching tasks | Apply category filter → verify all results have that category |
| AC-5.4 | Filter by priority returns only matching tasks | Filter priority=high → only high-priority tasks shown |
| AC-5.5 | Filter by status (pending/done) works correctly | Filter status=done → only completed tasks shown |
| AC-5.6 | Combined filters (category + priority) intersect correctly | Apply both → results match both criteria |
| AC-5.7 | Search results appear within 500ms | UI timing: keyup to results rendered < 500ms |

### AC-6: PWA & Offline (see `03_frontend_lead.md` for service worker strategy)

| # | Criterion | Test Method |
|---|-----------|-------------|
| AC-6.1 | App is installable (valid manifest.json) | Lighthouse PWA audit passes installability check |
| AC-6.2 | Service worker caches app shell on first load | DevTools → Application → Service Worker: registered and active |
| AC-6.3 | App loads when offline (after initial visit) | Set browser to offline mode → navigate to app → page renders |
| AC-6.4 | Tasks created offline sync when back online | Create task offline → go online → verify task exists on server |
| AC-6.5 | App works on iOS Safari (mobile) | Manual test on iOS 16+ Safari: create, complete, search tasks |
| AC-6.6 | App works on Android Chrome (mobile) | Manual test on Android Chrome: create, complete, search tasks |

## Success Metrics

| KPI | Target | Measurement Method |
|-----|--------|--------------------|
| Task creation speed | 10 tasks created in < 2 minutes via UI | Timed Playwright test (AC-2.7) |
| Page load time (dashboard) | < 1 second on 3G throttled connection | Lighthouse performance audit + Playwright timing |
| Offline reliability | App loads and is functional with 0 network requests after initial cache | Service worker test with network disabled |
| Mobile usability | 100% of acceptance criteria pass on iOS Safari + Android Chrome | Cross-browser test matrix |
| PWA score | Lighthouse PWA score ≥ 90 | Lighthouse CI audit |
| Search latency | Results appear in < 500ms after keystroke | UI performance test |
| Auth security | 0 plaintext passwords in database; JWT tokens expire correctly | Security audit script |
| Data integrity | 0 tasks lost during offline→online sync over 50 sync cycles | Automated sync stress test |
| Accessibility | WCAG 2.1 AA compliance on all pages | axe-core audit via Playwright |
| Build size | Initial JS bundle < 200KB gzipped | Vite build output analysis |

## Open Questions

| # | Question | Impact | Owner | Decision Needed By |
|---|----------|--------|-------|-------------------|
| OQ-1 | Should tasks support multiple categories (tags) or only one category? MVP assumes one; tagging changes the data model significantly. | Schema design, filter UX | Product Manager | Before backend schema finalization |
| OQ-2 | What happens to tasks when a category is deleted? Nullify the reference, or block deletion if tasks exist? | API behavior, UX messaging | Product Manager + Backend Lead | Before category API implementation |
| OQ-3 | Should the offline sync strategy use last-write-wins or queue-and-replay? Single-user reduces conflict risk, but clock skew between devices is possible. | Service worker design | Frontend Lead (see `03_frontend_lead.md`) | Before PWA implementation |
| OQ-4 | Is there a maximum number of tasks or categories per user? SQLite handles thousands fine, but UI performance may degrade with 1000+ tasks. | Pagination strategy, API design | Backend Lead + Frontend Lead | Before search/filter implementation |
| OQ-5 | Should completed tasks be archived (hidden by default) or remain in the main list with a "done" state? | Dashboard UX, query performance | Product Manager | Before dashboard implementation |
| OQ-6 | Should the app support password reset (e.g., via email link), or is that a post-MVP feature? No email service is currently in scope. | Auth flow completeness | Product Manager | Before auth implementation |
| OQ-7 | What is the data retention policy for completed tasks? Keep forever, auto-delete after 90 days, or user-controlled? | Storage, privacy | Product Manager | Before v1 launch |