---
title: "Viewer Pages"
sprint: "2.1, 2.2, 2.3, 3.1, 3.2"
created: "2026-03-09"
---

# Viewer Pages

## DocsPage `/docs/:section/:slug`

**Sprint 2.1** | Frontend

Renders autospec documentation with sidebar navigation and markdown content.

### Features
- Section-grouped sidebar (methodology, viewer)
- Fuzzy search via Input component
- Markdown rendered with react-markdown + remark-gfm
- Syntax-highlighted code blocks (sand-200 bg)
- Breadcrumb navigation
- Skeleton loading state

### Data Source
`viewer/src/data/docs.ts` → `docsManifest` array
Content fetched from `./docs/:section/:slug.md` (via Vite public/ or fetch)

### Route params
- `:section` — e.g. `methodology`, `viewer`
- `:slug` — e.g. `01_philosophy`

---

## SpecsPage `/specs/:slug`

**Sprint 2.2** | Frontend

Displays the 10 role spec files as browsable cards.

### Features
- 2-column grid of spec cards
- Owner color badges per role
- Click → detail view with spec content
- Navigate back to grid

### Data Source
`viewer/src/data/specs.ts` → `specsManifest` array

---

## BacklogPage `/backlog`

**Sprint 2.3** | Frontend

Shows all tickets across 6 sprints in kanban or table view.

### Features
- Kanban board: 5 columns (Todo / In Progress / QA / Done / Blocked)
- Table view: sortable, all 34 tickets
- Toggle between views
- Total points + done points in header

### Data Source
`viewer/src/data/backlog.ts` → `backlogData` array (6 sprints, 34 tickets)

### Kanban columns
| Column | Status | Emoji |
|--------|--------|-------|
| Todo | todo | 🔲 |
| In Progress | in-progress | 🔄 |
| QA Review | qa | 🧪 |
| Done | done | ✅ |
| Blocked | blocked | ❌ |

---

## SkillsPage `/skills/:slug`

**Sprint 3.1** — See Sprint 3 agent output

---

## EnvironmentsPage `/environments`

**Sprint 3.2** — See Sprint 3 agent output
