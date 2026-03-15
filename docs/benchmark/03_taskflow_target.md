---
title: TaskFlow Benchmark Target
sprint: "24"
created: "2026-03-15"
---

# TaskFlow Benchmark Target

TaskFlow is the primary target project for the Sprint 24 benchmark baseline run. This document explains why TaskFlow was chosen, what output the harness expects, the minimum passing criteria, and which quality gates are skipped.

**Related sprint:** Sprint 24 — `specs/backlog.md` §Sprint 24 ticket 24.6

---

## Why TaskFlow

TaskFlow was selected as the Sprint 24 benchmark target for the following reasons:

1. **Simplest AutoSpec target.** TaskFlow is a straightforward task management application with clear, unambiguous requirements. The domain (tasks, projects, categories, users) maps directly to standard CRUD patterns that all models should recognize.

2. **Bounded scope.** Expected output is approximately 2 implementation sprints with ~54 tickets — small enough for a model to complete in a single session without hitting context limits.

3. **No viewer requirement.** TaskFlow does not include a `viewer/` directory. This cleanly exercises the conditional gate logic: viewer gates (VWR-01 through VWR-04) must be skipped, and their 10% weight must redistribute proportionally. If a model incorrectly generates a viewer spec for TaskFlow, this is a spec compliance issue, not a feature.

4. **Established ground truth.** `examples/taskflow/` contains human-authored reference specs (`specs/01–05`) and a `requirements.md`. The benchmark uses the requirements as model input and scores the generated output against the 28 quality gates — not against the reference specs directly.

5. **Reproducible.** The requirements are stable. Re-running the harness against TaskFlow at any future date produces comparable results, enabling longitudinal tracking.

---

## TaskFlow Requirements Summary

Source: `examples/taskflow/requirements.md`

**Application:** Task management for individuals and small teams.

**Key entities:** User, Task, Project, Category, Tag

**Core features:**
- User authentication (register, login, logout, password reset, 7-day session expiry)
- Task CRUD with title, description, due date, priority (low/medium/high/urgent), status (todo/in_progress/done)
- Project organization with progress tracking (% complete)
- Categories and tags for task organization with filter support
- Dashboard: tasks due today, overdue tasks, recent completions, statistics

**Tech stack (from requirements.md):**

| Component | Technology |
|-----------|------------|
| Frontend | React 18 + TypeScript |
| Backend | Node.js + Express |
| Database | PostgreSQL |
| ORM | Prisma |
| Authentication | JWT |
| Styling | Tailwind CSS |
| Testing | Vitest, Playwright |
| Deployment | Docker |

**Out of scope (v1):** Native mobile apps, third-party integrations, real-time collaboration, file attachments, recurring tasks, time tracking.

---

## What TaskFlow Does NOT Have

- **No `viewer/` directory** — viewer gates VWR-01 through VWR-04 are skipped. The scoring formula redistributes their 10% weight to the remaining 5 categories.
- **No existing docs/** — the generated output must create all documentation from scratch.
- **No prior sprint summaries** — `sprints/` directory starts empty.

If a model generates a `viewer/` directory for TaskFlow, the viewer gates will activate. This is not necessarily wrong (a model may interpret the viewer spec in QUICKSTART as required), but it should be noted in the run metadata.

---

## Expected Output File Tree

Based on `quickstart/01-generation-plan.md`, a compliant TaskFlow generation should produce:

```
taskflow/                           ← benchmark working directory
├── CLAUDE.md                       ← SDD rules, tech stack, commands
├── requirements/
│   └── project-brief.md            ← requirements input (pre-existing, not generated)
├── specs/
│   ├── 01_product_manager.md       ← PM spec: epics, features, user stories
│   ├── 02_backend_lead.md          ← API design, endpoints, auth
│   ├── 03_frontend_lead.md         ← Pages, components, routing
│   ├── 04_db_architect.md          ← Schema, ERD, migrations
│   ├── 05_qa_engineer.md           ← Test scenarios, coverage
│   ├── 06_devops_engineer.md       ← Infrastructure, CI/CD
│   ├── 07_security_engineer.md     ← Auth, RBAC, threat model
│   ├── 08_data_engineer.md         ← Data flows, analytics
│   ├── 09_product_analyst.md       ← Metrics, success criteria
│   ├── 10_ui_designer.md           ← Design system, components
│   └── backlog.md                  ← All sprints with tickets, status emojis, DoD
├── docs/
│   ├── architecture/               ← System overview, ADRs
│   ├── api/                        ← Endpoint reference
│   ├── database/                   ← Schema docs, ERD
│   ├── auth/                       ← Auth flows
│   ├── frontend/                   ← Routing, components
│   ├── testing/                    ← QA strategy
│   ├── deployment/                 ← Docker, CI/CD
│   └── design-system/              ← UI tokens, patterns
├── prompts/                        ← Sprint execution prompts (optional)
├── agents/
│   └── sprint-0-brief.md           ← Agent briefing for sprint 0
└── sprints/                        ← Sprint summaries (empty until sprints run)
```

STR-03 requires 8+ docs subdirectories. The output above provides exactly 8.

---

## Minimum Passing Criteria

A TaskFlow benchmark run is considered passing if it meets all of the following:

1. **All 6 Structure gates pass (STR-01 through STR-06)** — the complete file/directory skeleton must exist.
2. **Overall weighted score ≥ 60** — "Adequate" threshold per the scoring interpretation table.
3. **SDD-01 passes** — backlog uses status emojis (🔲, 🔄, ✅).
4. **No viewer gates evaluated** — `viewer/` must not exist (or if it does, it must pass VWR-01 and VWR-02).

A run scoring below 60 indicates the model failed to follow SDD conventions consistently, even if the file structure is present. A run failing STR-01 (missing spec files) is a hard failure regardless of other scores.

---

## Benchmark Run Context

When the harness runs against TaskFlow:

1. `examples/taskflow/` is copied to `/tmp/benchmark-{model}-{run}-{timestamp}/`
2. The copy includes `requirements.md`, `CLAUDE.md`, existing starter code (`api/`, `web/`) — but not the reference specs
3. The model receives the combined QUICKSTART prompt + the requirements and is instructed to generate the complete spec output structure
4. `scorer.sh` evaluates the generated `specs/`, `docs/`, `agents/`, and `CLAUDE.md` against all 28 gates
5. Viewer gates are skipped because `viewer/` is not present in the TaskFlow template

The reference specs in `examples/taskflow/specs/` serve as a human-quality baseline for qualitative comparison in `compare.sh` output, but are not used for automated scoring.
