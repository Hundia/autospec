# AutoSpec — SDD Project Backlog

**Version:** 1.0
**Created:** 2026-03-09
**Framework:** Using AutoSpec's own SDD methodology

---

## Sprint 0: SDD Foundation (~38 pts) — SERIAL

**Theme:** Bootstrap AutoSpec as an SDD project using its own tools
**Status:** ✅ Done

| ID | Ticket | Owner | Pts | Status | Deps | Docs |
|----|--------|-------|-----|--------|------|------|
| 0.1 | Copy 10 skills → `.claude/commands/` | DevOps | 2 | ✅ | — | — |
| 0.2 | Create `autospec/CLAUDE.md` with SDD rules + orchestrator pattern | PM | 5 | ✅ | — | — |
| 0.3 | Create `specs/` — 10 role spec files | PM | 13 | ✅ | — | — |
| 0.4 | Create `specs/backlog.md` — all 6 sprints ticketed | PM | 8 | ✅ | 0.3 | — |
| 0.5 | Update `skills/claude/sprint-run.md` + `execute-ticket.md` — Orchestrator Pattern | PM | 3 | ✅ | — | — |
| 0.6 | Create `agents/sprint-1-brief.md` through `sprint-5-brief.md` | PM | 5 | ✅ | 0.4 | — |
| 0.7 | Create `docs/methodology/10_orchestrator_agent_pattern.md` | Docs | 3 | ✅ | — | `docs/methodology/10_orchestrator_agent_pattern.md` |
| 0.8 | Create `sprints/sprint-0/summary.md` | PM | 2 | ✅ | 0.1–0.7 | `sprints/sprint-0/summary.md` |

---

## Sprint 1: Viewer Scaffold + Primitives + Dashboard (~33 pts) — after Sprint 0

**Theme:** Bootstrap React viewer with FitnessAiManager design system
**Status:** ✅ Done

| ID | Ticket | Owner | Pts | Status | Deps | Docs |
|----|--------|-------|-----|--------|------|------|
| 1.1 | Viewer scaffold: `viewer/` init, package.json, vite.config.ts, tailwind.config.js | Frontend | 5 | ✅ | 0.x done | `docs/viewer/01_architecture.md` |
| 1.2 | FitnessAiManager design tokens in Tailwind (warm palette, Inter, JetBrains Mono) | UI | 3 | ✅ | 1.1 | `docs/viewer/02_design_system.md` |
| 1.3 | Port primitives: Button, Card, Badge (extended), Input | UI | 8 | ✅ | 1.2 | `docs/viewer/03_components.md` |
| 1.4 | Layout: Sidebar, Header, Layout, App.tsx routing (7 routes) | Frontend | 5 | ✅ | 1.3 | `docs/viewer/01_architecture.md` |
| 1.5 | DashboardPage `/` — KPIs, BarChart, PieChart, sprint quick-links | Frontend | 8 | ✅ | 1.4 | `docs/viewer/04_pages.md` |
| 1.6 | DesignSystemPage `/design-system` — component gallery | UI | 5 | ✅ | 1.3 | `docs/viewer/02_design_system.md` |
| 1.7 | `docs/viewer/01_architecture.md` + `docs/viewer/02_design_system.md` | Docs | 3 | ✅ | 1.4 | `docs/viewer/` |

---

## Sprint 2: Viewer Content Pages (~32 pts) — PARALLEL with Sprint 3+4

**Theme:** Docs browser, Specs viewer, Backlog kanban
**Status:** ✅ Done

| ID | Ticket | Owner | Pts | Status | Deps | Docs |
|----|--------|-------|-----|--------|------|------|
| 2.1 | `DocsPage` `/docs/:section/:slug` — sidebar nav, search, react-markdown renderer | Frontend | 13 | ✅ | 1.x done | `docs/viewer/04_pages.md` |
| 2.2 | `SpecsPage` `/specs/:slug` — 10-card grid, per-spec detail view | Frontend | 8 | ✅ | 1.x done | `docs/viewer/04_pages.md` |
| 2.3 | `BacklogPage` `/backlog` — KanbanBoard (5 cols), Table view toggle | Frontend | 8 | ✅ | 1.x done | `docs/viewer/04_pages.md` |
| 2.4 | Static data layer: `viewer/src/data/docs.ts`, `specs.ts`, `backlog.ts` | Frontend | 5 | ✅ | 1.1 | `docs/viewer/01_architecture.md` |
| 2.5 | Create `docs/viewer/04_pages.md` (docs + specs + backlog sections) | Docs | 3 | ✅ | 2.1–2.3 | `docs/viewer/04_pages.md` |

---

## Sprint 3: Viewer Advanced Pages (~32 pts) — PARALLEL with Sprint 2+4

**Theme:** Skills showcase, Environments matrix, Charts
**Status:** ✅ Done

| ID | Ticket | Owner | Pts | Status | Deps | Docs |
|----|--------|-------|-----|--------|------|------|
| 3.1 | `SkillsPage` `/skills/:slug` — 10 skill cards, phase diagrams, usage examples | Frontend | 8 | ✅ | 1.x done | `docs/viewer/05_advanced_pages.md` |
| 3.2 | `EnvironmentsPage` `/environments` — 6×10 compatibility matrix | Frontend | 8 | ✅ | 1.x done | `docs/viewer/05_advanced_pages.md` |
| 3.3 | Chart components: AnimatedCounter, ProgressRing | UI | 8 | ✅ | 1.x done | `docs/viewer/05_advanced_pages.md` |
| 3.4 | `environments.ts` data file (6×10 matrix: claude/cursor/copilot/windsurf/jetbrains/aider × 10 skills) | Frontend | 5 | ✅ | — | `docs/viewer/05_advanced_pages.md` |
| 3.5 | Create `docs/viewer/05_advanced_pages.md` (skills + environments + charts sections) | Docs | 3 | ✅ | 3.1–3.2 | `docs/viewer/05_advanced_pages.md` |

---

## Sprint 4: CLI + QUICKSTART Update (~26 pts) — PARALLEL with Sprint 2+3

**Theme:** CLI warm palette + QUICKSTART Section 7 rewrite
**Status:** ✅ Done

| ID | Ticket | Owner | Pts | Status | Deps | Docs |
|----|--------|-------|-----|--------|------|------|
| 4.1 | Update `cli/src/generators/viewer-prompt.generator.ts` — emit warm palette spec (FitnessAiManager primitives, no shadcn) | Backend | 8 | ✅ | — | `docs/cli/viewer_generator.md` |
| 4.2 | Update `skills/claude/` templates — generated project skills include orchestrator pattern | Backend | 5 | ✅ | — | — |
| 4.3 | QUICKSTART.md Section 7 rewrite: replace shadcn → FitnessAiManager primitives, warm palette, no dark slate | Docs | 8 | ✅ | — | QUICKSTART.md |
| 4.4 | Create `docs/cli/viewer_generator.md` | Docs | 5 | ✅ | 4.1 | `docs/cli/viewer_generator.md` |

---

## Sprint 5: Polish + Launch (~26 pts) — SERIAL last

**Theme:** Self-referential viewer, CI/CD, NPM publish
**Status:** ✅ Done

| ID | Ticket | Owner | Pts | Status | Deps | Docs |
|----|--------|-------|-----|--------|------|------|
| 5.1 | `viewer/public/docs/` — copy autospec docs (self-referential viewer) | Frontend | 5 | ✅ | 2.x done | — |
| 5.2 | GitHub Actions: `.github/workflows/ci.yml` + `pages.yml` | DevOps | 8 | ✅ | 1.x done | `docs/deployment/github_pages.md` |
| 5.3 | `npm publish --dry-run` verification + `package.json` publishConfig | DevOps | 5 | ✅ | CLI done | — |
| 5.4 | `docs/deployment/github_pages.md` | Docs | 3 | ✅ | 5.2 | `docs/deployment/github_pages.md` |
| 5.5 | Sprint 5 summary + backlog cleanup | PM | 5 | ✅ | all done | `sprints/sprint-5/summary.md` |

---

## Sprint 6: Multi-Agent Orchestration Engine (~38 pts)

**Theme:** Extend CLI with agent profiles, phase sequencing, and multi-agent generate command
**Status:** 🔲 Planned

| ID | Ticket | Owner | Pts | Status | Deps | Docs |
|----|--------|-------|-----|--------|------|------|
| 6.1 | Define phase type system: `foundation`, `scaffold`, `content`, `polish`, `qa` with ordering + dependency rules in `cli/src/types/phases.ts` | Backend | 2 | 🔲 | — | `docs/cli/orchestration.md` |
| 6.2 | Define agent type enum + base agent profile schema (`AgentProfile` interface) in `cli/src/types/agents.ts` | Backend | 2 | 🔲 | — | `docs/cli/orchestration.md` |
| 6.3 | Extend `.autospecrc.json` schema: add `agents`, `phases`, `orchestration` config sections to `cli/src/utils/config.ts` | Backend | 3 | 🔲 | 6.1, 6.2 | `docs/cli/orchestration.md` |
| 6.4 | Create 6 agent profiles (Claude, Copilot, Gemini, Cline, Aider, Windsurf) + agent registry with lookup in `cli/src/agents/` | Backend | 5 | 🔲 | 6.2 | `docs/cli/agent_profiles.md` |
| 6.5 | Auto-detect active AI environment from process/env signals in `cli/src/utils/detect-agent.ts` | Backend | 3 | 🔲 | 6.4 | `docs/cli/orchestration.md` |
| 6.6 | State manager: track phase progress, file hashes, completion status in `cli/src/orchestration/state.ts` | Backend | 5 | 🔲 | 6.1 | `docs/cli/orchestration.md` |
| 6.7 | Phase validators: pre/post-condition checks per phase type in `cli/src/orchestration/validators.ts` | Backend | 3 | 🔲 | 6.1, 6.6 | `docs/cli/orchestration.md` |
| 6.8 | Cross-reference validator: verify backlog ↔ docs ↔ sprint summary linkage in `cli/src/orchestration/cross-ref.ts` | Backend | 3 | 🔲 | 6.6 | `docs/cli/orchestration.md` |
| 6.9 | Phase sequencing engine: resolve ordering, dependency graph, parallel-safe detection in `cli/src/orchestration/sequencer.ts` | Backend | 5 | 🔲 | 6.1, 6.6, 6.7 | `docs/cli/orchestration.md` |
| 6.10 | `autospec generate` command: wrap existing generators behind sequencer, emit agent-specific output in `cli/src/commands/generate.ts` | Backend | 3 | 🔲 | 6.4, 6.9 | `docs/cli/orchestration.md` |
| 6.11 | Update `autospec init` to resume from partial state (detect existing files, skip completed phases) | Backend | 3 | 🔲 | 6.6 | `docs/cli/orchestration.md` |
| 6.12 | Sprint 6 summary + docs + backlog update | PM | 1 | 🔲 | 6.1–6.11 | `sprints/sprint-6/summary.md` |

---

## Bug Tracker

*(No bugs yet — Sprint 0 is initial setup)*

---

## Backlog Statistics

| Sprint | Points | Status |
|--------|--------|--------|
| Sprint 0 | 38 | ✅ Done |
| Sprint 1 | 33 | ✅ Done |
| Sprint 2 | 32 | ✅ Done |
| Sprint 3 | 32 | ✅ Done |
| Sprint 4 | 26 | ✅ Done |
| Sprint 5 | 26 | ✅ Done |
| Sprint 6 | 38 | 🔲 Planned |
| **Total** | **225** | 🔄 **IN PROGRESS** |
