# Software Requirements Specification — TodoApp

**Version:** 1.0
**Date:** 2026-03-13
**Status:** Draft

---

## 1. Project Overview

**Name:** TodoApp
**Description:** A simple todo list web app with user authentication. Users can manage personal tasks across devices with a clean, fast interface.

---

## 2. Target Users

**Individuals** who want a simple, no-frills way to track daily tasks:
- Capture todos quickly without friction
- Check off completed items
- Filter by status (all / active / completed)
- Access their list from any browser

---

## 3. Functional Requirements

### 3.1 Authentication

- Email + password registration (min 8 characters)
- Login / logout
- JWT sessions (access token: 15 min, refresh token: 7 days)
- Password reset via email link (expires 1 hour)

### 3.2 Todo Management

- **Create:** Add a todo with a title (required, max 200 chars) and optional notes
- **Read:** View all todos in a list, sorted by creation date (newest first)
- **Update:** Edit title/notes inline; toggle complete/incomplete
- **Delete:** Remove a todo permanently (with confirmation prompt)

### 3.3 Filtering and Views

- Filter bar: All | Active | Completed
- Item count: "X tasks remaining"
- "Clear completed" button removes all done todos

### 3.4 User Profile

- View/update display name and email
- Change password (requires current password)
- Delete account (purges all todos)

---

## 4. Non-Functional Requirements

- **Performance:** Page load < 2s; API responses < 200ms
- **Availability:** 99.5% uptime
- **Security:** HTTPS only, bcrypt passwords (cost 12), rate limiting (100 req/min)
- **Browser support:** Chrome 90+, Firefox 88+, Safari 14+, Edge 90+

---

## 5. Tech Stack

| Layer | Choice |
|-------|--------|
| Frontend | React 18 + TypeScript + Vite |
| State | Zustand |
| Styling | Tailwind CSS |
| Backend | Node.js + Express + TypeScript |
| Database | SQLite (via Prisma) |
| Auth | JWT (custom) |
| Hosting | Railway (free tier) |

---

## 6. Out of Scope (v1)

- Sharing todos with other users
- Labels, tags, or priority levels
- Due dates or reminders
- Mobile apps
- Drag-and-drop reordering
