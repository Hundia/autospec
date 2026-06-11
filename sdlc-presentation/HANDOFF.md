# HANDOFF v2 — SDLC Presentation Sub-Site (Post-Merge)

> **Audience:** The next AI assistant (e.g., GitHub Copilot CLI) continuing this work on the local dev machine.
> **State at handoff:** ALL work below is **merged to `main` and pulled locally**. The working tree is the source of truth — no pending branches, no unmerged work.
> **Live URL:** https://hundia.github.io/autospec/sdlc/#/presentation (deploys from `main` via `.github/workflows/pages.yml`)
> **Supersedes:** the earlier `sdlc-presentation/HANDOFF.md` (v1) — that file describes a pre-merge state and is now stale; trust this document.

---

## 1. What This Project Is

A **standalone GitHub Pages presentation sub-site** at `sdlc-presentation/` telling the story of the **Enterprise Agentic SDLC methodology** (Spec-Driven Development at enterprise scale). It clones the original AutoSpec presentation shell with all-new content.

**Hard constraints:**
- Do NOT touch the original `presentation/` app. Both deploy together:
  - Original: `hundia.github.io/autospec/#/presentation`
  - This one: `hundia.github.io/autospec/sdlc/#/presentation`
- `vite.config.ts` base is `/autospec/sdlc/`; pages.yml builds `sdlc-presentation/` and copies `dist/` into `presentation/dist/sdlc/`.
- `postcss.config.cjs` (not `.js`) — package.json has `"type": "module"`.

## 2. Tech + Conventions (MUST follow)

- Vite + React + TypeScript + Tailwind + framer-motion.
- **Data-driven slides:** each slide is an object in `src/data/slides-en.ts` with a `type` field; `src/pages/PresentationPage.tsx` maps `type` → component via the `slideComponents` registry. Scrollable slides set `scrollable: true` (shell switches to overflow-y-auto + `ScrollProgressBar`).
- **EN + HE parity:** every content change in `slides-en.ts` MUST be mirrored in `slides-he.ts` (identical structure, Hebrew text). RTL handled by the shell via `dir`.
- **Terminology: "Bolt", never "Sprint"** — in deck data AND hardcoded strings inside `src/components/pipeline/*` visualizations.
- **Tailwind purge gotcha:** accent colors are looked up from literal-class maps (`accentMap` / `accentColors` objects). Never construct class names dynamically.
- **Repo workflow (CLAUDE.md):** track changes in `specs/backlog.md` (Sprint 38 section); QA gate = `npm run build` in `sdlc-presentation/` must pass.

## 3. Current Deck — 20 Slides

1. **title** — "The Agentic SDLC", presenter line: **"By Eli Hundia & Sharon Schwartz"** (HE: אלי חונדיה ושרון שוורץ)
2–7. Problem act: eraTraditional, eraAssistant, eraAgentic, contextPoisoning, reverseTax, breakingPoint
8–9. Turning point: sddCostOfChaos, bridge ("What if...")
10–11. philosophy (5 cards + quote), notVibeCoding
12. **agentic5Acts** ← the centerpiece (see §4)
13–14. harness, sdlcRoles
15. sddThreePillars
16. orchestrator
17. tooling (Spec-Kit, Superpowers, Jira, Confluence)
18. **adoption** ← redesigned (see §5)
19. closing ("Start Your First Bolt")
20. finalTagline

Slides 12 and 18 are `scrollable: true`.

**Legacy components still in the repo but NOT referenced by deck data:** `SixStagesSlide`, `pipeline/PipelineSlide`, `SprintMemorySlide` (still imported/registered in PresentationPage.tsx as `sixStages` / `pipeline` / `sprintMemorySlide`). Open decision: delete them + registry entries, or keep as fallback. User hasn't decided.

## 4. Slide 12 — `agentic5Acts` (component: `src/components/AgenticFiveActsSlide.tsx`)

One cinematic scrollable slide that merged three earlier slides (7-Stages, Pipeline, SprintMemory). Structure: full-screen intro with act roadmap → 5 act sections → ⚠️ Key Insight callout → 🎬 closing callout.

Latest content (user-specified stage mapping — do not drift from this):

| Act | Name | Stages | Owners | Hero | Visualization |
|-----|------|--------|--------|------|---------------|
| I | SPECIFY | 1–2 | Product Manager, Architect, **Software System Engineer** | no | `TerminalVisualization` |
| II | ARCHITECT | 3 | Architect, Dev Team Lead, **QA Team Lead (optional)** | no | `SkillsVisualization` |
| III | BOLT | 4–5 | Developer (HITL), **QA Tech Lead** | ★ | `WorktreeDiagram` |
| IV | REMEMBER | 6 | Product Manager + Dev Tech Lead + QA Tech Lead (all HITL) | ★ | `SprintSummaryVisualization` |
| V | STEER | 7 | SRE / DevOps | no | inline `SteeringLoop` (same file) |

Content commitments encoded in the bullets (the user dictated these — preserve):
- **Act I:** Requirement Paper OR spec.md; project laws as **Instructions & Skills files**; PM approves before agents proceed.
- **Act II:** plan produced by **iterative conversation with a planning agent**; tasks **decoupled by design for parallel execution** by an orchestrating agent; testable components.
- **Act III:** parallel agentic execution where possible; **all code reviewed by HITL, no exception**; enforced TDD; grounded in **Specs .md files**; QA Tech Lead implements AND runs system tests from Feature Specs scenarios; **every new test added to regression** + full regression run.
- **Act IV:** development summary involves all tech leads (PM → Dev TL → QA TL); **includes the reasoning made during development** (why, alternatives, constraints).
- **Act V:** agents monitor **real-time telemetry (metrics + logs)** against spec intent; **real-time scenarios verified against Feature Requirements in Specs .md files**.
- **Key Insight callout** (amber ⚠️ box rendered before the closing callout, via optional `keyInsight: { headline, body }` in slide data): "The Key Insight: Compress, Don't Skip — the traditional linear SDLC is collapsing, not being eliminated… only the clock changes."

Component implementation notes: `vizMap` keyed by Roman numeral; `accentMap` (blue/emerald/indigo/teal/orange) with literal Tailwind classes; hero acts get tinted bg + ring + `★ KEY ACT` badge; watermark Roman numeral at ~2% opacity per section.

## 5. Slide 18 — `adoption` (component: `src/components/AdoptionSlide.tsx`)

Fully redesigned in the last session to fix huge vertical dead space and flat content:
- All `min-h-screen` / `min-h-[70vh]` removed — compact, content-driven layout.
- Gradient progress bar (emerald → blue → violet) above the cards.
- **3 phase cards** in a responsive grid (stacked mobile → `lg:grid-cols-3`). Each card: 1px colored top stripe, `PHASE NN` mono badge + timeline chip, emoji + name, italic "win headline", ✓ bullets, and a **★ milestone strip** at the bottom (the tangible proof moment).
- Phases: 🌱 **Foundation** (Weeks 1–6, milestone: first agent PR merged) / 🔗 **Expand** (Month 2–5, milestone: 80% of PRs AI-reviewed first) / 🚀 **Optimize** (Month 6+, milestone: pioneer teams ship in hours — PwC 2026).
- Compounding row between cards and metrics: `Risk ↓ ── Coverage ↑ ── Velocity ↑↑`.
- Metrics compacted into a 2×4 grid titled "What to Measure" (Velocity / Quality / Scale / People); closing Amplify Partners quote kept.
- New optional Phase fields in data: `timeline`, `win`, `milestone` (typed optional in the component, so old-shape data won't break).

## 6. Session History (chronological, all merged)

1. Built the sub-site (22 slides EN+HE) + pages.yml deploy step.
2. Added Summarization stage to the stages slide; fixed section spacing.
3. Expert review round — 24 findings fixed (owner pills, 7-stage corrections, Bolt-not-Sprint renames across all pipeline visualizations, tooling card subtitles/descriptions).
4. **Big-5 Acts merge:** slides 12+16+17 → one `agentic5Acts` cinematic slide; deck 22 → 20.
5. **Latest round:** co-presenter added; acts content rewritten per user's 7-stage spec (owners, Requirement Paper, Instructions & Skills, planning-agent conversation, HITL review mandatory, QA regression discipline, reasoning in summaries, real-time scenario verification); ⚠️ Key Insight callout added; Adoption Roadmap fully redesigned. All EN + HE.

## 7. How to Verify / Work

```bash
cd sdlc-presentation
npm install          # if new machine
npm run build        # QA gate — must pass
npm run dev          # http://localhost:5173/autospec/sdlc/ → /#/presentation
```
Slide 12 is deck position 12; slide 18 is the adoption roadmap. Test BOTH languages (globe icon top-right) — Hebrew is RTL and every layout change must be checked there.

## 8. Likely Next Steps

1. **Visual QA** of the two redesigned slides in a browser (EN + HE) — they build clean but the newest layouts haven't been human-verified: act sections, ⚠️ Key Insight box, adoption phase cards, milestone strips, RTL alignment.
2. Decide fate of the unreferenced legacy components (`SixStagesSlide`, `PipelineSlide`, `SprintMemorySlide`) — delete or keep.
3. `specs/backlog.md` hygiene: confirm Sprint 38 tickets cover the Big-5 merge + latest content round; add ✅ entries if missing (repo rule: backlog-first).
4. Whatever the user asks next — likely more polish on slide 12/18 after they present-test it.

## 9. Voice & Story Rules (for any content edit)

- Tagline trinity: "The Spec is the Truth. The Harness is the Guardrail. The Human is the Judge."
- Arc: Problem → "What if..." → Methodology (philosophy → Big-5 Acts → harness → roles) → SDD implementation → Tooling → Adoption → Close.
- REMEMBER/Summarization is the signature differentiator ("the memory AI was never given") — always hero treatment.
- Sourced stats to keep intact: 38.7% AI review comments drive real fixes (Atlassian RovoDev 2026), 73% AI projects abandoned, PwC 2026 pioneer teams, Amplify Partners closing quote.
