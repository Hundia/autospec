# Example SRS — TaskFlow (Task Management App)

> This is an example requirements document to show you the level of detail
> AutoSpec works best with. Replace this file with your own project requirements,
> or use `project-brief.md` for a guided template.

---

## Project Overview

**Name:** TaskFlow
**Description:** A task management web app for small remote teams (2–20 people) that tracks work across time zones with built-in time estimates and progress visibility.

---

## Target Users

### Primary: Team Lead / Project Manager
- Manages 3–10 team members across multiple time zones
- Needs clear visibility into who is working on what
- Frustrated by constant Slack interruptions to get status updates
- Tech comfort: Intermediate (uses Notion, Linear, or Trello today)

### Secondary: Individual Contributor
- Works on assigned tasks, wants to know what to do next
- Needs simple interface, no onboarding friction
- Tech comfort: Beginner to Intermediate

---

## Functional Requirements

### Authentication
- Email + password registration
- JWT-based auth with 15-minute access token, 7-day refresh token
- Password reset via email link
- No SSO required in v1

### Projects
- Create, rename, archive projects
- Each project has: name, description, color label, team members
- Members can be: owner, admin, or member (role-based permissions)

### Tasks
- Create tasks within a project
- Task fields: title, description (Markdown), assignee, due date, priority (low/medium/high/urgent), status
- Status workflow: Todo → In Progress → In Review → Done
- Subtasks (one level deep only)
- File attachments (images, PDFs, up to 10MB each)
- Comments thread on each task

### Dashboard
- "My Tasks" view: tasks assigned to current user, sorted by due date
- Project overview: task counts by status, overdue count
- Team activity feed: recent changes (last 24h)

### Notifications
- In-app: task assigned, comment added, status changed
- Email: daily digest (configurable on/off per user)
- No push notifications in v1

---

## Non-Functional Requirements

- **Performance:** Page load < 2 seconds, API responses < 300ms p95
- **Availability:** 99.5% uptime (allows ~3.5h downtime/month)
- **Security:** OWASP Top 10 compliance, rate limiting on auth endpoints
- **Scalability:** Must handle 500 concurrent users without degradation
- **Browser support:** Chrome 90+, Firefox 88+, Safari 14+, Edge 90+

---

## Technical Stack

| Layer | Choice | Rationale |
|-------|--------|-----------|
| Frontend | React 18 + TypeScript | Team familiarity |
| Build | Vite | Fast HMR, simple config |
| CSS | Tailwind CSS | Rapid development |
| State | Zustand | Simple, no boilerplate |
| Backend | Node.js + Express + TypeScript | Single language stack |
| ORM | Prisma | Type-safe, great migrations |
| Database | PostgreSQL 15 | Reliable, JSONB support |
| Cache | Redis | Session store, rate limiting |
| File storage | AWS S3 | Scalable, cheap |
| Hosting | Railway | Simple deploys, affordable |
| Auth | Custom JWT | Control over token lifecycle |

---

## Constraints

- **Budget:** Infrastructure under $30/month (Railway + S3 + Redis)
- **Timeline:** MVP in 8 weeks (solo developer)
- **Existing:** No existing systems to integrate with
- **Compliance:** No specific compliance requirements

---

## Out of Scope (v1)

- Mobile apps (web only)
- Real-time collaboration (no WebSockets in v1)
- Time tracking / time logging
- Gantt charts or timeline views
- Public project sharing
- Integrations (Slack, GitHub, Jira)
- Multi-language support

---

## Success Metrics

- User can create account and first project within 5 minutes
- Task creation takes < 30 seconds
- Team lead can see all project status in a single dashboard view
- Zero data loss incidents in first 3 months
