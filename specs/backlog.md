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
| 6.4 | Create 6 agent profiles (Claude, Copilot, Gemini, Cline, Continue, Windsurf) + agent registry with lookup in `cli/src/agents/` | Backend | 5 | 🔲 | 6.2 | `docs/cli/agent_profiles.md` |
| 6.5 | Auto-detect active AI environment from process/env signals in `cli/src/utils/detect-agent.ts` | Backend | 3 | 🔲 | 6.4 | `docs/cli/orchestration.md` |
| 6.6 | State manager: track phase progress, file hashes, completion status in `cli/src/orchestration/state.ts` | Backend | 5 | 🔲 | 6.1 | `docs/cli/orchestration.md` |
| 6.7 | Phase validators: pre/post-condition checks per phase type in `cli/src/orchestration/validators.ts` | Backend | 3 | 🔲 | 6.1, 6.6 | `docs/cli/orchestration.md` |
| 6.8 | Cross-reference validator: verify backlog ↔ docs ↔ sprint summary linkage in `cli/src/orchestration/cross-ref.ts` | Backend | 3 | 🔲 | 6.6 | `docs/cli/orchestration.md` |
| 6.9 | Phase sequencing engine: resolve ordering, dependency graph, parallel-safe detection in `cli/src/orchestration/sequencer.ts` | Backend | 5 | 🔲 | 6.1, 6.6, 6.7 | `docs/cli/orchestration.md` |
| 6.10 | `autospec generate` command: wrap existing generators behind sequencer, emit agent-specific output in `cli/src/commands/generate.ts` | Backend | 3 | 🔲 | 6.4, 6.9 | `docs/cli/orchestration.md` |
| 6.11 | Update `autospec init` to resume from partial state (detect existing files, skip completed phases) | Backend | 3 | 🔲 | 6.6 | `docs/cli/orchestration.md` |
| 6.12 | Sprint 6 summary + docs + backlog update | PM | 1 | 🔲 | 6.1–6.11 | `sprints/sprint-6/summary.md` |

---

## Sprint 10: README Update + GitHub Pages Consolidation (~10 pts)

**Theme:** Make presentation/ the main GitHub Pages site with viewer/ as sub-site, update README with live links
**Status:** ✅ Done

| ID | Ticket | Owner | Pts | Status | Deps | Docs |
|----|--------|-------|-----|--------|------|------|
| 10.1 | Switch presentation/ from BrowserRouter to HashRouter | Frontend | 1 | ✅ | — | — |
| 10.2 | Update vite.config.ts base paths (presentation: `/autospec/`, viewer: `/autospec/viewer/`) | Frontend | 1 | ✅ | — | — |
| 10.3 | Rewrite `.github/workflows/pages.yml` to build both apps and combine | DevOps | 3 | ✅ | — | `docs/deployment/github_pages.md` |
| 10.4 | Add `build-presentation` job to `.github/workflows/ci.yml` | DevOps | 1 | ✅ | — | — |
| 10.5 | Update ViewerSection + Navigation in presentation/ to link to live viewer | Frontend | 2 | ✅ | 10.2 | — |
| 10.6 | Update README.md with live demo links, GitHub Pages badge, updated structure | Product | 2 | ✅ | — | — |

---

## Sprint 11: Presentation Expansion — Methodology Slides + Landing Enhancements (~58 pts)

**Theme:** Expand the 11-slide deck to 18 slides covering sprint lifecycle, orchestrator pattern, QA methodology, sprint summaries, skills/environments, viewer, and FinOps. Add 3 new landing page sections + mobile fixes.
**Status:** 🔄 In Progress

| ID | Ticket | Owner | Pts | Status | Deps | Docs |
|----|--------|-------|-----|--------|------|------|
| 11.1 | Update `slides-en.ts`: add 7 new slide data entries (types: `sprintLifecycle`, `orchestrator`, `qaMethodology`, `sprintSummary`, `skillsEnvironments`, `viewer`, `finops`), reorder to 18-slide sequence, update results data `200+`→`263` | Frontend | 5 | ✅ | — | — |
| 11.2 | Update `slides-he.ts`: Hebrew translations for all 7 new slide entries + same 18-slide reorder | Frontend | 3 | ✅ | 11.1 | — |
| 11.3 | Create `SprintLifecycleSlide.tsx` — 5-phase cycle: Plan→Document→Execute→QA→Summarize. Emerald accent. Circular flow with animated phase nodes | Frontend | 3 | ✅ | 11.1 | — |
| 11.4 | Create `OrchestratorSlide.tsx` — Two-tier: Opus orchestrator → Sonnet agents in parallel. Indigo accent. Fan-out connector animations | Frontend | 3 | ✅ | 11.1 | — |
| 11.5 | Create `QAMethodologySlide.tsx` — Test pyramid (60% unit, 30% integration, 10% E2E) + bug fix protocol. Red/rose accent | Frontend | 3 | ✅ | 11.1 | — |
| 11.6 | Create `SprintSummarySlide.tsx` — Summary template: completed tickets, docs updated, files modified, QA results. Teal accent | Frontend | 3 | ✅ | 11.1 | — |
| 11.7 | Create `SkillsEnvironmentsSlide.tsx` — 10 slash commands + 6×10 compatibility matrix. Sky accent (avoid cyan collision) | Frontend | 3 | ✅ | 11.1 | — |
| 11.8 | Create `ViewerSlide.tsx` — Browser mockup of viewer app with live link. Green accent | Frontend | 3 | ✅ | 11.1 | — |
| 11.9 | Create `FinOpsSlide.tsx` — Donut chart: Haiku 40%, Sonnet 45%, Opus 15% + cost comparison. Amber accent | Frontend | 3 | ✅ | 11.1 | — |
| 11.10 | Update `PresentationPage.tsx` — import 7 new slide components, add to `slideComponents` map | Frontend | 2 | ✅ | 11.3–11.9 | — |
| 11.11 | Create `OrchestratorSection.tsx` for landing page — two-tier Opus→Sonnet visualization, agent briefs, parallel worktrees. Indigo/purple gradient | Frontend | 5 | ✅ | — | — |
| 11.12 | Create `QASection.tsx` for landing page — test pyramid + bug fix verification protocol + 5 QA tiers. Red/rose gradient | Frontend | 5 | ✅ | — | — |
| 11.13 | Create `SprintLifecycleSection.tsx` for landing page — animated 5-phase pipeline. Insert between SprintMemorySection and ViewerSection | Frontend | 5 | ✅ | — | — |
| 11.14 | Update `LandingPage.tsx` — import + add OrchestratorSection, SprintLifecycleSection, QASection. Update `StatsSection` numbers to current values | Frontend | 2 | ✅ | 11.11–11.13 | — |
| 11.15 | Fix mobile progress dots for 18 slides — collapse or compact bar on `sm:` breakpoint | Frontend | 3 | ✅ | 11.10 | — |
| 11.16 | Build verification + RTL QA — `npm run build`, verify 18 slides in EN + HE, keyboard nav | QA | 2 | ✅ | 11.14, 11.15 | — |
| 11.17 | Create `sprints/sprint-11/summary.md`, update backlog statistics, create `docs/presentation/slide_catalog.md` | PM | 3 | 🔲 | 11.16 | `sprints/sprint-11/summary.md`, `docs/presentation/slide_catalog.md` |

---

## Sprint 12A: Presentation Evolution Narrative (55 pts)

**Theme:** Replace single problem slide with 5-act narrative arc across 27 slides.
**Status:** ✅ Done

| ID | Ticket | Owner | Pts | Status | Docs |
|----|--------|-------|-----|--------|------|
| 12.1 | Update `slides-en.ts` — 27 entries in new order, 10 new slides, rework solution | Agent A | 5 | ✅ | — |
| 12.2 | Update `slides-he.ts` — Hebrew translations for all new entries | Agent A | 5 | ✅ | — |
| 12.3 | Create `EraTraditionalSlide.tsx` — slate-400 header, 2x2 cards, metrics bar | Agent A | 5 | ✅ | — |
| 12.4 | Create `EraAssistantSlide.tsx` — blue-400 header, tool badges, gained/unchanged cols | Agent A | 5 | ✅ | — |
| 12.5 | Create `EraAgenticSlide.tsx` — cyan-400 header, power/danger split | Agent A | 5 | ✅ | — |
| 12.6 | Create `ContextPoisoningSlide.tsx` — amber→red gradient, vertical timeline, shake | Agent A | 5 | ✅ | — |
| 12.7 | Create `ReverseTaxSlide.tsx` — red-500 header, Day 1 vs Day 60, animated counter | Agent A | 5 | ✅ | — |
| 12.8 | Create `BreakingPointSlide.tsx` — red-600 header, balance beam, stat cards | Agent A | 5 | ✅ | — |
| 12.9 | Create `BridgeSlide.tsx` — purple glow, typewriter question, staggered sub-points | Agent A | 5 | ✅ | — |
| 12.10 | Create `DocsFolderSlide.tsx` — emerald-400, file tree, growth bars, comparison | Agent A | 5 | ✅ | — |
| 12.11 | Create `ModelOptimizationSlide.tsx` — amber-400, tiers + reason field, insight | Agent A | 5 | ✅ | — |
| 12.12 | Create `BeforeAfterSlide.tsx` — red/green columns, 6-row comparison table | Agent A | 5 | ✅ | — |
| 12.13 | Create `FinalTaglineSlide.tsx` — near-black bg, word-by-word reveal | Agent A | 3 | ✅ | — |
| 12.14 | Update `PresentationPage.tsx` — import 11 new, remove problem/finops, 27 entries | Agent A | 3 | ✅ | — |
| 12.15 | Delete `ProblemSlide.tsx` — verified no orphan imports | Agent A | 2 | ✅ | — |

---

## Sprint 12: Landing Page Evolution Narrative (~14 pts)

**Theme:** Replace ProblemSolutionSection with EvolutionSection (4-era timeline), add BeforeAfterSection comparison, strengthen SprintMemorySection with reverse-engineering tax messaging.
**Status:** ✅ Done

| ID | Ticket | Owner | Pts | Status | Deps | Docs |
|----|--------|-------|-----|--------|------|------|
| 12.16 | Create `EvolutionSection.tsx` — 4-era timeline (Traditional → Code Assistant → Agentic → SDD). Horizontal desktop, vertical mobile. Color-coded cards with connecting gradient bar | Frontend | 5 | ✅ | — | — |
| 12.17 | Create `BeforeAfterSection.tsx` — two-column comparison: "Without SDD" (red) vs "With SDD" (green). 6 matched rows: Context, Documentation, Onboarding, AI Accuracy, Cost, Handoff | Frontend | 4 | ✅ | — | — |
| 12.18 | Update `LandingPage.tsx` — replace ProblemSolutionSection with EvolutionSection, add BeforeAfterSection between StatsSection and CaseStudiesSection | Frontend | 2 | ✅ | 12.16, 12.17 | — |
| 12.19 | Enhance `SprintMemorySection.tsx` — add reverse-engineering tax messaging: subtitle, "Session N" line, bottom quote | Frontend | 3 | ✅ | — | — |

---

---

## Sprint 13A: Data Layer + New Slides + Title Overhaul (~30 pts)

**Theme:** Restructure slide data to 29-slide sequence, create SDDMethodology + TicketExecution slides, overhaul TitleSlide.
**Status:** ✅ Done

| ID | Ticket | Owner | Pts | Status | Deps |
|----|--------|-------|-----|--------|------|
| 13.1 | Update `slides-en.ts` — 29-slide sequence with all new/reworked data | Agent 13A | 5 | ✅ | — |
| 13.2 | Update `slides-he.ts` — Hebrew translations matching 13.1 exactly | Agent 13A | 5 | ✅ | 13.1 |
| 13.3 | Rework `TitleSlide.tsx` — animated gradient bg, glow title, word-by-word tagline, ambient dots, badge | Agent 13A | 5 | ✅ | — |
| 13.4 | Create `SDDMethodologySlide.tsx` — left/right split: principles vs implementations, SVG connector | Agent 13A | 5 | ✅ | 13.1 |
| 13.5 | Rework `SolutionSlide.tsx` — add subtitle prop below title | Agent 13A | 2 | ✅ | — |
| 13.6 | Create `TicketExecutionSlide.tsx` — 5-stage vertical pipeline with amber connectors | Agent 13A | 5 | ✅ | 13.1 |
| 13.7 | Build verification — npm run build exits 0, 29 slides in each data file | Agent 13A | 3 | ✅ | 13.1–13.6 |

---

## Sprint 13B: Component Reworks + Wiring (~24 pts)

**Theme:** Rework Workflow, Roles, Environment slides. Wire PresentationPage. Hebrew sync. Final QA.
**Status:** ✅ Done

| ID | Ticket | Owner | Pts | Status | Deps |
|----|--------|-------|-----|--------|------|
| 13.8 | Rework `WorkflowSlide.tsx` — 7-phase horizontal pipeline | Frontend | 5 | ✅ | 13.1 |
| 13.9 | Rework `RolesSlide.tsx` — role≠agent + agent swim lanes | Frontend | 5 | ✅ | 13.1 |
| 13.10 | Create `EnvironmentProofSlide.tsx` — 3 environment mockup cards | Frontend | 5 | ✅ | 13.1 |
| 13.11 | Minor rework `OrchestratorSlide.tsx` — PM role emphasis | Frontend | 2 | ✅ | 13.1 |
| 13.12 | Update `PresentationPage.tsx` — wire 3 new, remove 1 old | Frontend | 2 | ✅ | 13.4, 13.6, 13.10 |
| 13.13 | Hebrew translations verified for 13B changes | Frontend | 3 | ✅ | 13.8-13.11 |
| 13.14 | Final build + QA — 29 slides EN + HE | QA | 2 | ✅ | 13.12, 13.13 |
| 13.15 | Backlog + viewer data + sprint summary | PM | 1 | ✅ | 13.14 |

---

## Sprint 14: Presentation Fixes + SDD Deepening + Future Vision (~32 pts)

**Theme:** Fix 3 bugs, add 4 new slides (SDD Cost of Chaos, Three Pillars, Future Waterfall, Future Monolith), rework Solution slide, remove redundant SprintLifecycle slide. Final: 32 slides.
**Status:** ✅ Done

| ID | Ticket | Owner | Pts | Status | Deps |
|----|--------|-------|-----|--------|------|
| 14.1 | Fix TitleSlide nav — remove `min-h-screen`, add `pointer-events-none` to ambient dots | Frontend | 2 | ✅ | — |
| 14.2 | Add "Eli Hundia" presenter name to title slide — data + component | Frontend | 1 | ✅ | — |
| 14.3 | Fix ContextPoisoning overflow — 2x2 grid, compact cards | Frontend | 3 | ✅ | — |
| 14.4 | Update `slides-en.ts` — 32-slide sequence: +4 new, -1 removed, reworked solution | Frontend | 5 | ✅ | — |
| 14.5 | Update `slides-he.ts` — Hebrew translations matching 14.4 | Frontend | 3 | ✅ | 14.4 |
| 14.6 | Create `SDDCostOfChaosSlide.tsx` — red/green two-column comparison | Frontend | 4 | ✅ | 14.4 |
| 14.7 | Create `SDDThreePillarsSlide.tsx` — three pillar cards with artifacts | Frontend | 4 | ✅ | 14.4 |
| 14.8 | Rework `SolutionSlide.tsx` — capabilities[] replaces flow[] | Frontend | 3 | ✅ | 14.4 |
| 14.9 | Create `FutureWaterfallSlide.tsx` — time allocation bars + insight | Frontend | 4 | ✅ | 14.4 |
| 14.10 | Create `FutureMonolithSlide.tsx` — microservices vs monolith comparison | Frontend | 4 | ✅ | 14.4 |
| 14.11 | Update `PresentationPage.tsx` — wire 4 new, remove SprintLifecycle | Frontend | 2 | ✅ | 14.6-14.10 |
| 14.12 | Delete `SprintLifecycleSlide.tsx` | Frontend | 0 | ✅ | 14.11 |
| 14.13 | Build + QA — 32 slides EN+HE, nav works, no overflow | QA | 1 | ✅ | 14.12 |
| 14.14 | Backlog + sprint summary | PM | 1 | ✅ | 14.13 |

---

## Sprint 15: Viewer Overhaul — Sprint Pages, Planning/Retrospective, Expert Review (~81 pts)

**Theme:** Complete viewer overhaul: generic sprint pages, collapsible sidebar, derived dashboard KPIs, expert Playwright review
**Status:** ✅ Done

### Sprint 15A: Data Layer + Generic SprintPage (~35 pts)

| ID | Ticket | Owner | Pts | Status | Deps |
|----|--------|-------|-----|--------|------|
| 15.1 | Create `viewer/src/data/sprints.ts` — types + Sprint 6 data | Frontend | 5 | ✅ | — |
| 15.2 | Create generic `SprintPage.tsx` — 4-tab data-driven page | Frontend | 8 | ✅ | 15.1 |
| 15.3 | Update `App.tsx` routing — `/sprint/:id` + `/sprints` | Frontend | 2 | ✅ | 15.2 |
| 15.4 | Backfill sprint data (S0-S5) | Frontend | 5 | ✅ | 15.1 |
| 15.5 | Backfill sprint data (S10-S14) | Frontend | 5 | ✅ | 15.1 |
| 15.6 | Sprint 6 rich planning data — dependency graph, sequence, radar | Frontend | 5 | ✅ | 15.1 |
| 15.7 | Delete `Sprint6Page.tsx` | Frontend | 0 | ✅ | 15.2, 15.6 |
| 15.8 | FlowDiagram integration — Sprint 6 planning flow | Frontend | 5 | ✅ | 15.1 |

### Sprint 15B: Sidebar + Dashboard + Skill Update (~22 pts)

| ID | Ticket | Owner | Pts | Status | Deps |
|----|--------|-------|-----|--------|------|
| 15.9 | Sidebar collapsible Sprints section — 14+ sprint links | Frontend | 5 | ✅ | 15.3 |
| 15.10 | SprintsListPage — card grid with status/progress | Frontend | 4 | ✅ | 15.3 |
| 15.11 | Dashboard derived data — KPIs from backlog.ts | Frontend | 3 | ✅ | — |
| 15.12 | Update `sprint-run.md` — Phase 1.5 + Phase 5b | PM | 3 | ✅ | — |
| 15.13 | Update `sprint-close.md` — viewer data step | PM | 2 | ✅ | — |
| 15.14 | Build + QA | QA | 2 | ✅ | 15.9-15.13 |
| 15.15 | Sprint 15 planning flow data (dogfooding) | Frontend | 3 | ✅ | 15.1 |

### Sprint 15C: Expert Review + Polish (~24 pts)

| ID | Ticket | Owner | Pts | Status | Deps |
|----|--------|-------|-----|--------|------|
| 15.16 | Playwright expert review script | QA | 5 | ✅ | 15.14 |
| 15.17 | Fix critical review findings | Frontend | 8 | ✅ | 15.16 |
| 15.18 | Fix moderate review findings | Frontend | 5 | ✅ | 15.16 |
| 15.19 | FlowDiagram polish | Frontend | 3 | ✅ | 15.8 |
| 15.20 | Final build + comprehensive QA | QA | 3 | ✅ | 15.17-15.19 |

---

## Sprint 16: Continue Extension + Complete Environment Skills (~37 pts)

**Theme:** Replace Aider with Continue VS Code extension, create skill files for all environments (Continue, Cursor, Windsurf, JetBrains), environment setup docs, update compatibility matrix
**Status:** ✅ Done

### Phase A: Data + Core Skills (PARALLEL)

| ID | Ticket | Owner | Pts | Status | Deps | Docs |
|----|--------|-------|-----|--------|------|------|
| 16.1 | Replace Aider→Continue in `environments.ts`, update compatibility matrix | Frontend | 3 | ✅ | — | `docs/viewer/05_advanced_pages.md` |
| 16.2 | Create `skills/continue/` — 3 rules + 10 prompts adapted from Claude skills | Backend | 8 | ✅ | — | `docs/environments/vscode/continue.md` |
| 16.3 | Create `skills/cursor/` — SDD rules + 6 skill MDC files | Backend | 5 | ✅ | — | `docs/environments/vscode/cursor.md` |

### Phase B: Remaining Skills + Docs (PARALLEL)

| ID | Ticket | Owner | Pts | Status | Deps | Docs |
|----|--------|-------|-----|--------|------|------|
| 16.4 | Create `skills/windsurf/instructions.md` + `skills/jetbrains/instructions.md` | Backend | 5 | ✅ | — | `docs/environments/vscode/windsurf.md`, `docs/environments/jetbrains/setup.md` |
| 16.5 | Create 4 environment docs: continue, cursor, windsurf, jetbrains | Docs | 8 | ✅ | — | `docs/environments/` |

### Phase C: Integration + QA (SERIAL)

| ID | Ticket | Owner | Pts | Status | Deps | Docs |
|----|--------|-------|-----|--------|------|------|
| 16.6 | Update all Aider references across codebase → Continue | Frontend | 3 | ✅ | 16.1 | — |
| 16.7 | Viewer build + QA | QA | 3 | ✅ | 16.1, 16.6 | — |
| 16.8 | Sprint 16 summary + backlog update | PM | 2 | ✅ | 16.1–16.7 | `sprints/sprint-16/summary.md` |

---

## Bug Tracker

### B.01 — Separate `/sprint-run` from `/sprint-close`

**Severity:** Enhancement (workflow)
**Reported:** 2026-03-10
**Status:** 🔲 Todo

**Problem:** Currently `/sprint-run` includes sprint closing (Phase 5-6: mark tickets ✅, write summary, create tag). This means the sprint is closed before the user has a chance to review the implemented work, test it, or request changes.

**Expected:** `/sprint-run` should stop after Phase 3 (QA) and Phase 4 (docs). The user should then review the work — test in browser, inspect code, request fixes. Only after explicit user approval should `/sprint-close` be invoked to finalize.

**Fix:**
1. Update `skills/claude/sprint-run.md` — remove Phases 5-6 (sprint close + final report). End with a "Sprint execution complete. Review the changes, then run `/sprint-close` when ready." message.
2. Update `skills/claude/sprint-close.md` — ensure it handles Phases 5-6 independently (mark ✅, write summary, tag, final report).
3. Update `.claude/commands/sprint-run.md` and `.claude/commands/sprint-close.md` symlinks if needed.

**Affected files:** `skills/claude/sprint-run.md`, `skills/claude/sprint-close.md`, `.claude/commands/sprint-run.md`, `.claude/commands/sprint-close.md`

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
| Sprint 10 | 10 | ✅ Done |
| Sprint 11 | 58 | 🔲 Planned |
| Sprint 12A | 55 | ✅ Done |
| Sprint 12B | 14 | ✅ Done |
| Sprint 13A | 30 | ✅ Done |
| Sprint 13B | 24 | ✅ Done |
| Sprint 14 | 32 | ✅ Done |
| Sprint 15 | 81 | ✅ Done |
| Sprint 16 | 37 | ✅ Done |
| **Total** | **566** | 🔄 **IN PROGRESS** |
