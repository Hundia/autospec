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
**Status:** ✅ Done

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

## Sprint 16: Landing Page Upgrade — Presentation Insights (~45 pts)

**Theme:** Port presentation's strongest insights back to landing page: problem narrative, pipeline, three pillars, future vision, updated messaging.
**Status:** ✅ Done

### Agent 1: Hero & Messaging (~10 pts)

| ID | Ticket | Owner | Pts | Status | Deps |
|----|--------|-------|-----|--------|------|
| 16.1 | Update hero heading to "Make AI Think Before It Codes" + new subtitle | Frontend | 3 | ✅ | — |
| 16.2 | Update hero stats to "25+ Sprints / 263 Tickets / ~60% Cost Savings" | Frontend | 2 | ✅ | — |
| 16.3 | Add "Presentation" nav link pointing to `#/presentation` | Frontend | 2 | ✅ | — |
| 16.4 | Update callout quotes in EvolutionSection and SprintMemorySection | Frontend | 3 | ✅ | — |

### Agent 2: Pipeline & Three Pillars (~13 pts)

| ID | Ticket | Owner | Pts | Status | Deps |
|----|--------|-------|-----|--------|------|
| 16.5 | Create `PipelineSection.tsx` — 9-step pipeline in 3x3 grid | Frontend | 8 | ✅ | — |
| 16.6 | Create `ThreePillarsSection.tsx` — 3 pillar cards with artifacts | Frontend | 5 | ✅ | — |

### Agent 3: Problem Narrative (~14 pts)

| ID | Ticket | Owner | Pts | Status | Deps |
|----|--------|-------|-----|--------|------|
| 16.7 | Create `ContextPoisoningSection.tsx` — timeline + chat window | Frontend | 6 | ✅ | — |
| 16.8 | Create `BreakingPointSection.tsx` — balance beam + stat cards | Frontend | 5 | ✅ | — |
| 16.9 | Create `CostOfNoSpecsSection.tsx` — two-column comparison | Frontend | 3 | ✅ | — |

### Agent 4: Future Vision & Stats (~8 pts)

| ID | Ticket | Owner | Pts | Status | Deps |
|----|--------|-------|-----|--------|------|
| 16.10 | Create `FutureVisionSection.tsx` — planning bars + monolith comparison | Frontend | 6 | ✅ | — |
| 16.11 | Update `StatsSection.tsx` metrics to match presentation results | Frontend | 2 | ✅ | — |

### Orchestrator Post-Merge

| ID | Ticket | Owner | Pts | Status | Deps |
|----|--------|-------|-----|--------|------|
| 16.12 | Update `LandingPage.tsx` — new section order, remove BeforeAfter/SprintLifecycle | PM | 2 | ✅ | 16.1–16.11 |
| 16.13 | Build verification — `npm run build` exits 0 | QA | 1 | ✅ | 16.12 |

---

## Sprint 17: Landing Page Visual Fixes — Timeline + Provider-Agnostic (~24 pts)

**Theme:** Fix timeline bar alignment, make Orchestrator and FinOps sections provider-agnostic with interactive provider selectors.
**Status:** ✅ Done

| ID | Ticket | Owner | Pts | Status | Deps |
|----|--------|-------|-----|--------|------|
| 17.1 | Fix EvolutionSection timeline bar position — `top-[3.25rem]` → `top-[0.625rem]` so bar crosses through dot centers | Frontend | 2 | ✅ | — |
| 17.2 | Fix SprintMemorySection timeline bar position — `top-12` → `top-[0.625rem]` so bar crosses through dot centers | Frontend | 2 | ✅ | — |
| 17.3 | Rewrite OrchestratorSection with 4-provider selector (Claude, Copilot, Gemini, Local) — dynamic model names, accent colors, AnimatePresence transitions, benefits pills | Frontend | 10 | ✅ | — |
| 17.4 | Rewrite FinOpsSection with 4-provider selector — dynamic model tiers/costs, animated before/after comparison, provider-specific data | Frontend | 10 | ✅ | — |

---

## Sprint 18: Academic Paper Update + Paper Showcase Page (~52 pts)

**Theme:** Update academic paper to reflect 837+ tickets / 3 case studies / orchestrator pattern; build `/paper` showcase page; fix broken paper links.
**Status:** ✅ Done

### Phase A: Paper Content Update (13 pts)

| ID | Ticket | Owner | Pts | Status | Deps | Docs |
|----|--------|-------|-----|--------|------|------|
| 18.1 | Update paper metadata — date March 2026, abstract 837+ tickets/3 case studies, keywords | Docs | 2 | ✅ | — | `docs/ACADEMIC_PAPER.md` |
| 18.2 | Update Section 3.1 — eight-phase workflow, describe 3 new phases | Docs | 2 | ✅ | — | `docs/ACADEMIC_PAPER.md` |
| 18.3 | Add Section 3.6 — Orchestrator + Agent Pattern | Docs | 3 | ✅ | — | `docs/ACADEMIC_PAPER.md` |
| 18.4 | Add Section 3.7 — Operationalized Skills (11 slash commands) | Docs | 2 | ✅ | — | `docs/ACADEMIC_PAPER.md` |
| 18.5 | Add Section 3.8 — Viewer App (self-referential dashboard) | Docs | 2 | ✅ | — | `docs/ACADEMIC_PAPER.md` |
| 18.6 | Add Section 4.3 AutoSpec Self-Validation case study + update Combined Analysis | Docs | 2 | ✅ | 18.1-18.5 | `docs/ACADEMIC_PAPER.md` |
| 18.7 | Update Future Work, Conclusion, Contributions | Docs | 1 | ✅ | — | `docs/ACADEMIC_PAPER.md` |

### Phase B: Paper Showcase Page (31 pts)

| ID | Ticket | Owner | Pts | Status | Deps | Docs |
|----|--------|-------|-----|--------|------|------|
| 18.8 | Create `paper-content.ts` — structured data for all sections | Frontend | 3 | ✅ | — | `presentation/src/data/paper-content.ts` |
| 18.9 | Create `PaperPage.tsx` + add `/paper` route in `App.tsx` | Frontend | 2 | ✅ | 18.8 | `presentation/src/pages/PaperPage.tsx` |
| 18.10 | Create `PaperHeroSection.tsx` — emerald hero with animated counters + PDF CTA | Frontend | 5 | ✅ | 18.8 | `presentation/src/components/paper/` |
| 18.11 | Create `MethodologySection.tsx` — 8-phase pipeline grid | Frontend | 5 | ✅ | 18.8 | `presentation/src/components/paper/` |
| 18.12 | Create `RoleModelSection.tsx` — 10 role cards grid | Frontend | 3 | ✅ | 18.8 | `presentation/src/components/paper/` |
| 18.13 | Create `MultiAgentSection.tsx` — Opus→Sonnet two-tier + timeline comparison | Frontend | 4 | ✅ | 18.8 | `presentation/src/components/paper/` |
| 18.14 | Create `PaperFinOpsSection.tsx` — donut chart + cost comparison | Frontend | 3 | ✅ | 18.8 | `presentation/src/components/paper/` |
| 18.15 | Create `CaseStudiesSection.tsx` — 3 case study cards with AutoSpec glow | Frontend | 4 | ✅ | 18.8 | `presentation/src/components/paper/` |
| 18.16 | Create `ResultsConclusionSection.tsx` — stats, BibTeX, dual CTAs | Frontend | 3 | ✅ | 18.8 | `presentation/src/components/paper/` |

### Phase C: Link Fixes + PDF Asset (4 pts)

| ID | Ticket | Owner | Pts | Status | Deps | Docs |
|----|--------|-------|-----|--------|------|------|
| 18.17 | Fix Navigation.tsx Paper link `#paper` → `#/paper` | Frontend | 1 | ✅ | — | — |
| 18.18 | Fix DocumentationSection.tsx + Footer.tsx paper links → `#/paper` | Frontend | 1 | ✅ | — | — |
| 18.19 | Copy `ACADEMIC_PAPER.pdf` to `presentation/public/` | DevOps | 1 | ✅ | — | — |
| 18.20 | Update StatsSection.tsx — 29+ sprints, 837+ tickets | Frontend | 1 | ✅ | — | — |

### Phase D: QA + Close (4 pts)

| ID | Ticket | Owner | Pts | Status | Deps | Docs |
|----|--------|-------|-----|--------|------|------|
| 18.21 | Build verification — `npm run build` exits 0, all routes/links work | QA | 2 | ✅ | 18.1-18.20 | — |
| 18.22 | Backlog update + sprint summary | PM | 2 | ✅ | 18.21 | `sprints/sprint-18/summary.md` |

---

## Sprint 19: Onboarding Pivot — Template-First, Agent-Native (~50 pts)

**Theme:** Replace CLI-first onboarding with template repo + @QUICKSTART.md workflow. Redesign hero, QuickStart, and Tools sections.
**Status:** 🔄 In Progress

### Agent A: Template Repo + QUICKSTART (~18 pts)

| ID | Ticket | Owner | Pts | Status | Deps | Docs |
|----|--------|-------|-----|--------|------|------|
| 19.1 | Create `autospec-starter/` directory with full template structure | Frontend | 3 | ✅ | — | — |
| 19.2 | Create `requirements/project-brief.md` guided template | Frontend | 2 | ✅ | — | — |
| 19.3 | Create `.autospec/config.yml` with environment options | Frontend | 2 | ✅ | — | — |
| 19.4 | Create `.cursor/rules/autospec.md` — Cursor-compatible rules | Frontend | 3 | ✅ | — | — |
| 19.5 | Create `.windsurf/rules.md` — Windsurf-compatible rules | Frontend | 2 | ✅ | — | — |
| 19.6 | Refactor `QUICKSTART.md` — add 50-line human header before AI body | Docs | 3 | ✅ | — | — |
| 19.7 | Create `autospec-starter/README.md` — 4-step quickstart guide | Docs | 3 | ✅ | — | — |

### Agent B: Landing Page Redesign (~20 pts)

| ID | Ticket | Owner | Pts | Status | Deps | Docs |
|----|--------|-------|-----|--------|------|------|
| 19.8 | Rewrite `HeroSection.tsx` — conversation animation, @QUICKSTART.md workflow | Frontend | 8 | ✅ | — | — |
| 19.9 | Update hero subtitle + CTA buttons (Template primary, GitHub secondary) | Frontend | 2 | ✅ | — | — |
| 19.10 | Rewrite `QuickStartSection.tsx` — Template / Download / CLI Tools paths | Frontend | 5 | ✅ | — | — |
| 19.11 | Move QuickStartSection to position 6 in `LandingPage.tsx` + add secondary CTA before Footer | Frontend | 2 | ✅ | — | — |
| 19.12 | Update `ToolsSection.tsx` "How It Works" for @QUICKSTART.md flow | Frontend | 3 | ✅ | — | — |

### Agent C: Example Project + Validation (~10 pts)

| ID | Ticket | Owner | Pts | Status | Deps | Docs |
|----|--------|-------|-----|--------|------|------|
| 19.13 | Create `examples/todo-app/` with sample SRS requirements | Frontend | 3 | 🔲 | 19.1 | — |
| 19.14 | Create `scripts/verify.sh` smoke test for generated output | QA | 3 | 🔲 | 19.1 | — |
| 19.15 | E2E test: Run QUICKSTART.md against example project | QA | 3 | 🔲 | 19.13 | — |
| 19.16 | Build verification — `cd presentation && npm run build` exits 0 | QA | 1 | 🔲 | 19.8 | — |

### Orchestrator Post-Merge (~2 pts)

| ID | Ticket | Owner | Pts | Status | Deps | Docs |
|----|--------|-------|-----|--------|------|------|
| 19.17 | Update `specs/backlog.md` with Sprint 19 | PM | 1 | ✅ | — | — |
| 19.18 | Playwright screenshots of redesigned landing page | QA | 1 | 🔲 | 19.16 | — |

---

## Sprint 23: MealMap Pipeline Review + Viewer Playwright Validation (~48 pts)

**Theme:** Multi-agent quality review of the entire MealMap QUICKSTART pipeline output + Playwright validation of the MealMap viewer
**Status:** ✅ Done

### Phase A: Playwright Validation

| ID | Ticket | Owner | Pts | Status | Deps |
|----|--------|-------|-----|--------|------|
| 23.1 | Playwright viewer validation — 37 tests across 6 pages, 7 screenshots | QA | 8 | ✅ | — |

### Phase B: Multi-Agent Review Team (5 parallel agents)

| ID | Ticket | Owner | Pts | Status | Deps |
|----|--------|-------|-----|--------|------|
| 23.2 | Product review — SRS + PM spec scoring (8.6/10) | PM | 5 | ✅ | — |
| 23.3 | Architecture review — backend + DB specs + code (8.6/10) | Backend | 5 | ✅ | — |
| 23.4 | Frontend/UX review — frontend spec + viewer + web (7.8/10) | Frontend | 5 | ✅ | — |
| 23.5 | QA coverage review — QA spec + test files (8.2/10) | QA | 5 | ✅ | — |
| 23.6 | Pipeline process review — briefs + QUICKSTART + GPT-5.4 findings (8.2/10) | PM | 5 | ✅ | — |

### Phase C: Synthesis

| ID | Ticket | Owner | Pts | Status | Deps |
|----|--------|-------|-----|--------|------|
| 23.7 | Synthesize main review report | PM | 5 | ✅ | 23.1-23.6 |
| 23.8 | Write process improvements backlog (10 QS-XX tickets) | PM | 3 | ✅ | 23.7 |
| 23.9 | Update backlog + sprint summary | PM | 2 | ✅ | 23.8 |

---

## Sprint 24: Cross-Model Benchmark Harness — QUICKSTART Pipeline Scoring (~58 pts)

**Theme:** Build a bash-based benchmark harness to run the AutoSpec QUICKSTART pipeline through GPT (via OpenCode CLI) and Claude (via `claude -p`) with controlled, reproducible methodology. Uses a single symmetric prompt template, multi-run variance control (n=3 minimum), graded scoring (binary + spectrum gates), and per-run metadata capture. Multi-agent orchestration deferred to Sprint 24B.
**Status:** ✅ Complete

**Confounding variables (documented, not solved in v1):** This benchmark measures model + CLI + prompt combined. Differences in output may reflect model capability, CLI file-access behavior, or context-window handling. Sprint 24B isolates these factors.

### Phase A: Harness Setup (~12 pts)

| ID | Ticket | Owner | Pts | Status | Deps | Docs |
|----|--------|-------|-----|--------|------|------|
| 24.1 | Create `benchmark/` directory skeleton: `harness.sh`, `scorer.sh`, `compare.sh`, `config/quality-gates.json`, `config/models.sh` (env var defaults), `results/.gitkeep`, `prompts/` dir, `lib/` dir, `README.md` | DevOps | 2 | ✅ | — | `docs/benchmark/01_overview.md` |
| 24.2 | Define `config/quality-gates.json` — 28 gates across 6 categories. **Structure (6):** 10 spec files exist, backlog has 2+ sprints, docs/ has 8+ sections, prompts/ exists, CLAUDE.md exists, agents/ dir exists. **Specificity (5):** no placeholders/TODOs, project-specific references, concrete examples, matching cross-refs, average spec length >100 lines (graded 0-3). **SDD Compliance (5):** status emojis, DoD per ticket (graded 0-3: 0=none, 1=exists, 2=actionable, 3=references specs), assumptions documented, CLAUDE.md has tech stack + commands, ticket descriptions reference spec sections. **Coherence (4):** entity names consistent across specs (Jaccard similarity), backend endpoints match QA test targets, DB tables match product manager entities, cross-file references resolve. **Viewer Specification (4, conditional):** only evaluated if `viewer/` dir exists — not a markdown reader, mentions viz framework, 5+ visualizations (graded 0-3), interactive components. **Technical Correctness (4):** valid markdown tables, no circular deps in backlog, consistent forward-slash paths, valid internal links. Each gate has `id`, `category`, `description`, `weight`, `check_type` (`file_exists`, `content_match`, `regex`, `line_count`, `graded`), `conditional` flag | Sonnet | 5 | ✅ | 24.1 | `docs/benchmark/02_quality_gates.md` |
| 24.3 | Create `benchmark/lib/common.sh` — shared bash functions: `log_info`, `log_error`, `log_success`, `strip_ansi` (via `sed 's/\x1b\[[0-9;]*m//g'`), `elapsed_seconds`, `write_json_field`, `prepare_quickstart()` (concatenates `quickstart/01-07` into `/tmp/QUICKSTART-combined.md`), `write_metadata()` (writes `metadata.json` with model ID, prompt SHA256, timestamp, CLI version, env vars), and `run_model()` dispatcher (switches on `$1`: `claude` → `claude -p`, `gpt` → `opencode run -m $GPT_MODEL`, `gemini` → stub with TODO). Also `DRY_RUN` mode: when `DRY_RUN=true`, `run_model()` writes `echo "mock output"` instead of invoking the actual CLI | Sonnet | 5 | ✅ | 24.1 | — |
| 24.4 | Create `docs/benchmark/01_overview.md` + `docs/benchmark/02_quality_gates.md`. Overview doc: harness architecture, `run_model()` dispatcher, confounding variables disclosure ("measures model + CLI + prompt combined"), multi-run variance methodology. Quality gates doc: 28 gate definitions, 6 categories, graded vs binary distinction, conditional viewer gates, scoring formula, coherence metric (entity Jaccard) | Sonnet | 2 | ✅ | 24.2 | `docs/benchmark/` |

### Phase B: Prompt Template (~5 pts)

| ID | Ticket | Owner | Pts | Status | Deps | Docs |
|----|--------|-------|-----|--------|------|------|
| 24.5 | Create `benchmark/prompts/baseline-template.txt` — ONE symmetric prompt template used by ALL models. Content: (1) "You are executing the AutoSpec SDD methodology", (2) "Read the QUICKSTART content below and the requirements in requirements/", (3) "Generate the complete output structure: 10 specs, backlog with 2+ sprints, docs/, agents/sprint-brief, CLAUDE.md", (4) "Follow SDD conventions: status emojis, DoD per ticket, cross-references between specs". The template includes `{{QUICKSTART_CONTENT}}` placeholder that `prepare_quickstart()` fills with the concatenated 7-part QUICKSTART at invocation time. Both Claude and GPT receive identical task instructions — only the CLI invocation wrapper differs | Sonnet | 5 | ✅ | 24.1 | `docs/benchmark/04_run_config.md` |

### Phase C: Baseline Capture (~14 pts)

| ID | Ticket | Owner | Pts | Status | Deps | Docs |
|----|--------|-------|-----|--------|------|------|
| 24.6 | Create `docs/benchmark/03_taskflow_target.md` + `docs/benchmark/04_run_config.md`. TaskFlow doc: why chosen (simplest: 2 sprints, ~54 tickets), expected output file tree, minimum passing criteria. Run config doc: CLI invocations for each model, env vars (`$CLAUDE_MODEL` default `claude-sonnet-4-20250514`, `$GPT_MODEL` default `github-copilot/gpt-4o` — user overrides to GPT 5.4), `$BENCHMARK_RUNS` (default 3), ANSI stripping rationale, file-access parity notes (Claude reads fs natively; GPT needs `--file` attachments or `--dir` — document verified behavior), confounding variables | Sonnet | 3 | ✅ | 24.4 | `docs/benchmark/03_taskflow_target.md`, `docs/benchmark/04_run_config.md` |
| 24.7 | Implement `harness.sh run-all` with `--runs N` flag (default `$BENCHMARK_RUNS=3`). For each run: (1) copy `examples/taskflow/` to `/tmp/benchmark-{model}-{run}-{timestamp}/`, (2) call `prepare_quickstart()` to build combined QUICKSTART, (3) substitute into `baseline-template.txt`, (4) call `run_model {model}` with the filled prompt, (5) capture stdout/stderr to `results/run-{date}/{model}/run-{N}/output.log`, (6) write `metadata.json` via `write_metadata()`. Supports `DRY_RUN=true` for testing without API calls. After all runs complete, calls `scorer.sh` on each run dir automatically | Sonnet | 8 | ✅ | 24.3, 24.5, 24.6 | — |
| 24.8 | Implement Claude-specific invocation in `run_model claude` — `claude -p "$FILLED_PROMPT" --allowedTools "Edit,Write,Read,Bash,Glob,Grep"` from the temp project dir. Verify file-writing works. Attach all quickstart pieces if `claude -p` does not read from cwd. Record token count from claude output if available | Sonnet | 3 | ✅ | 24.3, 24.5 | — |
| 24.9 | Implement GPT-specific invocation in `run_model gpt` — `opencode run -m $GPT_MODEL --dir $TEMP_DIR --file /tmp/QUICKSTART-combined.md --file $TEMP_DIR/requirements/project-brief.md "$FILLED_PROMPT"`. Attach ALL 7 quickstart parts via `--file` flags if `--dir` does not expose filesystem (verify with pre-flight check). Strip ANSI from output. Record token count if available | Sonnet | 3 | ✅ | 24.3, 24.5 | `docs/benchmark/04_run_config.md` |

### Phase D: Scorer (~10 pts)

| ID | Ticket | Owner | Pts | Status | Deps | Docs |
|----|--------|-------|-----|--------|------|------|
| 24.10 | Implement `scorer.sh` — accepts `$1` as either a harness results dir (e.g. `results/run-{date}/claude/run-1/`) OR a raw project output dir (any autospec project, e.g. `examples/mealmap/`). Auto-detects mode by presence of `output.log`. Iterates `config/quality-gates.json`, runs each check: binary gates emit PASS/FAIL, graded gates emit 0-3 score. Skips gates with `"conditional": true` when condition not met (e.g. viewer gates skipped if no `viewer/` dir). Emits per-gate results + category subtotals + weighted overall score (0-100) to `scores.json`. Category weights: Structure 20%, Specificity 20%, SDD Compliance 25%, Coherence 15%, Viewer 10% (conditional), Technical Correctness 10%. When `--aggregate` flag passed, reads all `run-N/scores.json` files and computes mean, min, max, stddev per gate and per category | Sonnet | 8 | ✅ | 24.2, 24.3 | `docs/benchmark/05_scoring.md` |
| 24.11 | Create `docs/benchmark/05_scoring.md` — scoring formula, weighted categories table, binary vs graded gate logic, conditional gate behavior, both invocation modes (harness results vs standalone), aggregate mode (mean/stddev across runs), example `scores.json` output shape, score interpretation thresholds: 90-100 excellent, 75-89 good, 60-74 adequate, <60 poor | Sonnet | 2 | ✅ | 24.10 | `docs/benchmark/05_scoring.md` |

### Phase E: Comparison + Report (~6 pts)

| ID | Ticket | Owner | Pts | Status | Deps | Docs |
|----|--------|-------|-----|--------|------|------|
| 24.12 | Implement `compare.sh` — accepts two scored results directories as `$1` and `$2`, renders side-by-side Markdown table: per-category scores (mean +/- stddev if aggregated), overall score, wall-clock time (mean), file count, total output lines. For the 3 most discriminating gates (largest score delta), extract and display first 10 lines of the relevant file from each model's output as qualitative samples. Writes `results/run-{date}/comparison.md` | Sonnet | 3 | ✅ | 24.10 | — |
| 24.13 | Update `benchmark/README.md` — full usage guide: prerequisites (OpenCode CLI v1.2.26+, `OPENAI_API_KEY` set), env vars (`$CLAUDE_MODEL`, `$GPT_MODEL`, `$BENCHMARK_RUNS`), quickstart (`./harness.sh run-all`), dry-run mode (`DRY_RUN=true ./harness.sh run-all`), standalone scorer (`./scorer.sh /any/autospec/dir`), aggregate scoring (`./scorer.sh --aggregate results/run-{date}/claude/`), comparison (`./compare.sh dir1 dir2`), Gemini extensibility note (`run_model gemini` stub), known confounding variables, model version pinning guidance | Sonnet | 3 | ✅ | 24.12 | `benchmark/README.md` |

### Phase F: QA + Close (~8 pts)

| ID | Ticket | Owner | Pts | Status | Deps | Docs |
|----|--------|-------|-----|--------|------|------|
| 24.14 | Pre-flight spike: verify `claude -p "list files" --allowedTools "Bash"` can write files to a temp dir AND `opencode run -m github-copilot/gpt-4o --dir /tmp/test "create a file called test.txt with hello"` can write files. Document results in `docs/benchmark/04_run_config.md`. If either fails, update `run_model()` to work around the limitation | QA | 2 | ✅ | 24.3 | `docs/benchmark/04_run_config.md` |
| 24.15 | Bash syntax check: `bash -n` on all scripts (`harness.sh`, `scorer.sh`, `compare.sh`, `lib/common.sh`). Verify `DRY_RUN=true ./harness.sh run-all` completes without errors (mock mode, no API calls) | QA | 2 | ✅ | 24.7–24.9, 24.10, 24.12 | — |
| 24.16 | Run `scorer.sh` standalone against `examples/mealmap/` — verify `scores.json` is valid JSON, all 28 gates evaluated (viewer gates conditional — should activate since mealmap has viewer/), weighted score 0-100. Then run against `examples/taskflow/` — verify viewer gates are skipped (no viewer/ dir). Verify `compare.sh` produces valid `comparison.md` from the two score files | QA | 2 | ✅ | 24.15 | — |
| 24.17 | Backlog update + sprint summary (`sprints/sprint-24/summary.md`). Include **24B decision gate**: if single-session score gap between Claude and GPT is >15 points, 24B should investigate multi-agent orchestration to close the gap. If gap <15 points, 24B pivots to testing harder projects (MealMap, E-Commerce) or prompt sensitivity | PM | 1 | ✅ | 24.14–24.16 | `sprints/sprint-24/summary.md` |

---

## Sprint 25: Presentation Live Demo Prep — MealMap + Copilot (~12 pts)

**Theme:** Prepare MealMap example as a live demo environment for the AutoSpec presentation, with full GitHub Copilot (GPT 5.4) integration and presenter tooling.
**Status:** ✅ Done

| ID | Ticket | Owner | Pts | Status | Deps | Docs |
|----|--------|-------|-----|--------|------|------|
| 25.1 | Enhance MealMap `.github/copilot-instructions.md` — GPT 5.4/5.3/5.2 model routing, 11 SDD skill prompts, handoff pattern, full tech stack reference | Frontend | 5 | ✅ | — | `examples/mealmap/.github/copilot-instructions.md` |
| 25.2 | Create `demo/DEMO-SCRIPT.md` — 5-act presenter script with timing, copilot prompts, talking points, emergency fallbacks | PM | 3 | ✅ | — | `examples/mealmap/demo/DEMO-SCRIPT.md` |
| 25.3 | Create `demo/setup-demo.sh` — pre-flight checks (Docker, deps, viewer build, key files) | DevOps | 2 | ✅ | — | `examples/mealmap/demo/setup-demo.sh` |
| 25.4 | Create `.vscode/settings.json` — demo-optimized editor settings | DevOps | 1 | ✅ | — | `examples/mealmap/.vscode/settings.json` |
| 25.5 | Verify MealMap viewer builds successfully | QA | 1 | ✅ | — | — |

---

## Sprint 26: OpenCode Skill Port for Claude Workflows (~9 pts)

**Theme:** Make the repo's Claude slash-command workflows available as OpenCode skills and project commands.
**Status:** 🔄 In Progress

| ID | Ticket | Owner | Pts | Status | Deps | Docs |
|----|--------|-------|-----|--------|------|------|
| 26.1 | Audit `skills/claude/` workflows and map them to OpenCode skill/command discovery | PM | 1 | ✅ | — | `docs/environments/terminal/opencode.md` |
| 26.2 | Create `.opencode/skills/` wrappers for the Claude workflow set | PM | 3 | ✅ | 26.1 | `docs/environments/terminal/opencode.md` |
| 26.3 | Create `.opencode/commands/` wrappers so the workflows are invokable in OpenCode | PM | 2 | ✅ | 26.2 | `docs/environments/terminal/opencode.md` |
| 26.4 | Document OpenCode setup, command usage, and caveats for AutoSpec users | Docs | 2 | ✅ | 26.2, 26.3 | `docs/environments/terminal/opencode.md` |
| 26.5 | Verify discovery paths and write Sprint 26 summary | QA | 1 | ✅ | 26.4 | `sprints/sprint-26/summary.md` |

---

## Sprint 27: Landing Page Redesign — Elegant, Minimal, Inviting (~31 pts)

**Theme:** Strip the landing page down to 7 purposeful sections, rewrite copy for clarity, and produce a fast, focused entry point that invites developers to try AutoSpec.
**Status:** 🔲 Planned

| ID | Ticket | Owner | Pts | Status | Deps | Docs |
|----|--------|-------|-----|--------|------|------|
| 27.1 | Create `ProblemSection.tsx` — 2-column section replacing ContextPoisoning/BreakingPoint/CostOfNoSpecs quartet: left col = badge + H2 "Long AI conversations corrupt themselves" + sub-line + 3 orange symptom chips; right col = 4-node static degradation timeline (Turn 1 clean → Turn 25 drift → Turn 50 contradiction → Turn 100 chaos) with dashed vertical connector, staggered fade-in animation. Add `data-testid="problem-section"`, `data-testid="degradation-timeline"`, `data-testid="degradation-node-{0-3}"` | Frontend | 5 | ✅ | — | — |
| 27.2 | Fix `Navigation.tsx` — replace dead anchors: `#docs`→`#how-it-works`, `#examples`→`#quickstart`; update navLinks to 4 items: "How It Works" (`#how-it-works`), "Quick Start" (`#quickstart`), "Viewer" (`./viewer/`), "Presentation" (`#/presentation`). Add `focus-visible` ring states on all nav links | Frontend | 1 | ✅ | — | — |
| 27.3 | Fix `Footer.tsx` — remap dead anchors: `#viewer`→`./viewer/`, `#finops`→`#/presentation`, `#roles`→`#/presentation`, `#memory`→`#/presentation`, `#docs`→`#how-it-works`. Preserve all other footer content | Frontend | 1 | ✅ | — | — |
| 27.4 | Add `id="quickstart"` to root `<section>` in `QuickStartSection.tsx` — fixes the dead anchor that has existed since Sprint 19 | Frontend | 1 | ✅ | — | — |
| 27.5 | Modify `HeroSection.tsx` — (1) replace subheadline with "Drop in your requirements. Get a complete AI-ready project structure — specs, backlog, and living docs — in under 5 minutes." (2) Remove 22-line social proof stat row (lines ~237-257). (3) Add inline text link BELOW the CTA buttons: "→ See the full presentation" pointing to `#/presentation`. Preserve conversation animation verbatim — do not change timing, copy, or phases | Frontend | 2 | ✅ | — | — |
| 27.6 | Rewrite `PipelineSection.tsx` — replace 9-step 3×3 grid with 4-phase horizontal stepper (desktop flex-row, mobile flex-col). Phases: **Foundation** (~2hrs, `specs/*.md · docs/`), **Visualize** (~5min, `viewer/`), **Build** (2–4hrs/sprint, parallel agents), **Close** (~5min, `summary.md`). Phase 3 must include "parallel agents without collisions." Add `id="how-it-works"` to root `<section>`. Add `data-testid="pipeline-section"` and `data-testid="pipeline-phase-{0-3}"`. Keep existing bottom quote callout. Add `min-w-0` guard on mobile | Frontend | 6 | ✅ | — | — |
| 27.7 | Simplify `ViewerSection.tsx` — replace 6-feature list with 3 `border-l-2` benefit blocks: (1) "One URL for your entire project" (2) "Non-technical teammates can follow along" (3) "Auto-generated from your markdown." Add `data-testid="viewer-benefits"`. Keep browser mockup and CTA unchanged | Frontend | 5 | ✅ | — | — |
| 27.8 | Update `ThreePillarsSection.tsx` copy — in "Specs as Code" pillar add: "Add AutoSpec to an existing project — your CLAUDE.md enforces conventions for every AI contributor, human or agent." Add "Sprint summaries become your audit trail for compliance reviews." Update CTA to `./viewer/` | Frontend | 1 | ✅ | — | — |
| 27.9 | Rewrite `LandingPage.tsx` — keep exactly these 8 imports: `Navigation, HeroSection, ProblemSection, ThreePillarsSection, PipelineSection, ViewerSection, QuickStartSection, Footer`. Remove all other imports. JSX order: Navigation → Hero → Problem → ThreePillars → Pipeline → Viewer → QuickStart → Footer. Remove inline secondary CTA block | Frontend | 4 | ✅ | 27.1, 27.5, 27.6, 27.7, 27.8 | — |
| 27.10 | Delete 15 unused component files from `presentation/src/components/landing/`: `EvolutionSection.tsx`, `ContextPoisoningSection.tsx`, `BreakingPointSection.tsx`, `CostOfNoSpecsSection.tsx`, `RolesSection.tsx`, `SprintMemorySection.tsx`, `OrchestratorSection.tsx`, `QASection.tsx`, `FinOpsSection.tsx`, `StatsSection.tsx`, `CompetitiveSection.tsx`, `CaseStudiesSection.tsx`, `FutureVisionSection.tsx`, `ToolsSection.tsx`, `DocumentationSection.tsx` | Frontend | 2 | ✅ | 27.9 | — |
| 27.11 | Build + QA verification — run `npm run build` in `presentation/`, assert exit 0. Verify: (a) 7 sections render; (b) `#how-it-works` and `#quickstart` nav links scroll correctly; (c) "→ See the full presentation" link present in hero; (d) 4-phase stepper renders with correct phase names; (e) at 375px viewport no horizontal overflow; (f) none of 15 deleted section names appear in DOM | QA | 2 | ✅ | 27.10 | — |
| 27.12 | Update `docs/viewer/01_architecture.md` — document 7-section landing page structure, list 15 removed components, add Sprint 27 redesign rationale | Docs | 1 | ✅ | 27.11 | `docs/viewer/01_architecture.md` |

---

## Sprint 24B: Multi-Agent Orchestration + Multi-Target Expansion (~TBD pts)

**Theme:** Extend Sprint 24 benchmark based on decision gate results. Two possible tracks: (A) if score gap >15pts — implement GPT 5.4→5.3/5.2 multi-agent orchestration mirroring Opus→Sonnet pattern, re-score and compare. (B) if score gap <15pts — expand to MealMap + E-Commerce targets for generalizability, add Gemini CLI runs, test prompt sensitivity.
**Status:** 🔲 Planned

> Detailed tickets drafted after Sprint 24 baseline results are reviewed. Key open questions: OpenCode sub-agent invocation API, GPT 5.3/5.2 confirmed model IDs, prompt template for agent handoff briefing, temperature pinning (0 for reproducibility vs default for realism).

---

## Sprint 28: GitHub Copilot Full Support (~18 pts)

**Theme:** Fix misleading Copilot `none` ratings in the viewer, verify prompt sync, and document Copilot invocation properly.
**Status:** ✅ Done

| ID | Ticket | Owner | Pts | Status | Docs |
|----|--------|-------|-----|--------|------|
| 28.1 | Update Copilot compatibility matrix in viewer | Frontend | 3 | ✅ | `viewer/src/data/environments.ts` |
| 28.2 | Verify `.github/prompts/` sync with `skills/copilot/prompts/` | DevOps | 5 | ✅ | `.github/copilot-instructions.md` |
| 28.3 | Update QUICKSTART.md Copilot section | PM | 5 | ✅ | `QUICKSTART.md` |
| 28.4 | Update `docs/environments/vscode/github_copilot.md` | Docs | 3 | ✅ | `docs/environments/vscode/github_copilot.md` |
| 28.5 | Rebuild viewer | DevOps | 2 | ✅ | — |

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
| Sprint 16 | 45 | ✅ Done |
| Sprint 17 | 24 | ✅ Done |
| Sprint 18 | 52 | ✅ Done |
| Sprint 19 | 50 | 🔄 In Progress |
| Sprint 23 | 48 | ✅ Done |
| Sprint 24 | 58 | ✅ Done |
| Sprint 25 | 12 | ✅ Done |
| Sprint 26 | 9 | ✅ Done |
| Sprint 27 | 31 | ✅ Done |
| Sprint 28 | 18 | ✅ Done |
| Sprint 24B | TBD | 🔲 Planned |
| **Total** | **873** | 🔄 **IN PROGRESS** |
