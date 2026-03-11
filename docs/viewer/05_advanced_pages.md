---
title: "Viewer Advanced Pages"
sprint: "3.1, 3.2, 3.3"
created: "2026-03-09"
---

# Viewer Advanced Pages

## SkillsPage `/skills/:slug`

**Sprint 3.1** | Frontend

Displays all 10 AutoSpec Claude Code skills with detail view.

### Features
- 2-column grid of skill cards
- Model badge (haiku/sonnet/opus) per skill
- Click → detail view with phases, usage, model rationale
- Navigate back to grid

### Data Source
Inline `skillsData` array in SkillsPage.tsx (static, no file reads needed)

### Skills listed
sprint-run, execute-ticket, plan-sprint, sprint-status, sprint-close,
update-backlog, create-spec, create-sprint-docs, qa-review, help

---

## EnvironmentsPage `/environments`

**Sprint 3.2** | Frontend

6×10 compatibility matrix showing which AI tools support which skills.

### Features
- Full matrix table (6 tools × 10 skills)
- ✅/⚠️/❌ compatibility indicators
- Per-tool summary cards with counts
- Color-coded tool indicators

### Data Source
`viewer/src/data/environments.ts` → `compatibilityMatrix`

### Tools covered
Claude Code, Cursor, GitHub Copilot, Windsurf, JetBrains AI, Continue

---

## Chart Components

**Sprint 3.3** | UI | `viewer/src/components/charts/`

### AnimatedCounter
Count-up animation from 0 to value over configurable duration.
Props: `value`, `label`, `prefix?`, `suffix?`, `duration?`

### ProgressRing
SVG circular progress indicator.
Props: `value`, `max`, `size?`, `strokeWidth?`, `color?`, `label?`
