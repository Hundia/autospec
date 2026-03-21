# TaskFlow — Simple Task Management App

## Overview

TaskFlow is a lightweight personal task management web application. Users can create, organize, and track daily tasks with categories and due dates. The app targets individual users who want a simple, fast alternative to complex project management tools.

## Target Users

- **Individual professionals** who need to track personal work items
- **Students** managing assignments and deadlines

## Core Features

1. **Task CRUD** — Create, read, update, delete tasks with title, description, due date, and priority (low/medium/high)
2. **Categories** — Organize tasks into user-defined categories (e.g., Work, Personal, Health)
3. **Dashboard** — Overview showing today's tasks, overdue items, and completion stats
4. **Search & Filter** — Filter by category, priority, status; full-text search on title/description

## Tech Stack

- **Frontend:** React with TypeScript, Tailwind CSS
- **Backend:** Node.js with Express
- **Database:** SQLite (single-user, no multi-tenancy needed)
- **Auth:** Simple email/password (bcrypt + JWT)

## Constraints

- Single-user app (no team features in v1)
- Must work offline (PWA with service worker)
- Mobile-responsive design required
- Budget: solo developer, open source

## Success Criteria

- User can create and complete 10 tasks in under 2 minutes
- Page load under 1 second
- Works on mobile browsers (iOS Safari, Android Chrome)
