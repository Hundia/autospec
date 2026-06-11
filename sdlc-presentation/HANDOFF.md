# HANDOFF — SDLC Presentation Sub-Site (Sprint 38)

> **Audience:** The next AI assistant (e.g., GitHub Copilot CLI) continuing this work on a local dev machine.
> **Branch:** `claude/sdlc-sdd-presentation-4cp7e4` (all work lives here; merged to `main` once mid-sprint, then continued on the same branch)
> **Live URL:** https://hundia.github.io/autospec/sdlc/#/presentation
> **Last commit at handoff:** `b1e9c12` — "feat(sdlc-presentation): combine 7-stages + pipeline into Big-5 Acts slide"

---

## 1. What This Is

A **standalone GitHub Pages presentation sub-site** at `sdlc-presentation/` that tells the story of the **Enterprise Agentic SDLC methodology** (Spec-Driven Development at enterprise scale). It is a clone of the original AutoSpec presentation shell (`presentation/`) with completely new content.

**Critical constraint:** Do NOT touch the original `presentation/` app. The sub-site is deployed *alongside* it:
- Original: `hundia.github.io/autospec/#/presentation`
- This one: `hundia.github.io/autospec/sdlc/#/presentation`

The reusable build prompt that originally generated this is at repo root: `sdlc_sdd.md`.

---

## 2. Architecture / How It Deploys

- `sdlc-presentation/` is a self-contained Vite + React + TypeScript + Tailwind + framer-motion app.
- `vite.config.ts` has `base: '/autospec/sdlc/'`.
- `.github/workflows/pages.yml` builds BOTH apps: it builds `presentation/`, then builds `sdlc-presentation/` and copies its `dist/` into `presentation/dist/sdlc/` before publishing to Pages. Merging to `main` triggers deploy.
- `postcss.config.cjs` (not `.js`) because `package.json` has `"type": "module"`.

### Key files

```
sdlc-presentation/
├── src/data/slides-en.ts          # English deck — 20 slides (source of truth for content)
├── src/data/slides-he.ts          # Hebrew mirror — same structure, must stay in sync
├── src/pages/PresentationPage.tsx # Shell: slide registry (type string → component), nav, RTL, scrollable handling
├── src/components/                # One component per slide type
│   ├── AgenticFiveActsSlide.tsx   # ★ NEWEST — the Big-5 Acts combined slide (see §4)
│   ├── SixStagesSlide.tsx         # legacy, no longer referenced by deck data (still registered)
│   ├── SprintMemorySlide.tsx      # legacy, no longer referenced by deck data (still registered)
│   └── pipeline/                  # Rich scrollable visualizations
│       ├── PipelineSlide.tsx      # legacy slide, no longer referenced by deck data
│       ├── PipelineStep.tsx
│       ├── TerminalVisualization.tsx
│       ├── SkillsVisualization.tsx
│       ├── WorktreeDiagram.tsx
│       ├── SprintSummaryVisualization.tsx
│       ├── QALoopVisualization.tsx
│       ├── UserReviewVisualization.tsx
│       ├── DocsTreeVisualization.tsx
│       ├── SpecGridVisualization.tsx
│       ├── BrowserMockup.tsx
│       └── ScrollProgressBar.tsx
```

### Conventions you MUST follow

1. **Slide data drives everything.** A slide = an object in `slides-en.ts` with a `type` field. `PresentationPage.tsx` maps `type` → component in `slideComponents`. Scrollable slides set `scrollable: true` (shell switches to `overflow-y-auto` + ScrollProgressBar).
2. **EN + HE parity.** Every content change in `slides-en.ts` must be mirrored in `slides-he.ts` (same structure, Hebrew text). RTL is handled by the shell via `dir`.
3. **Terminology: "Bolt", never "Sprint"** in all presentation content AND hardcoded strings inside visualization components (this was a past bug — all 5 pipeline viz components were renamed Sprint→Bolt).
4. **The methodology has 7 stages** (Stage 6 = "Summarization: Bolt Close", Stage 7 = "Continuous Steering"). Summarization owners: Product Owner + Dev Team Lead + QA Lead, all HITL (Human-in-the-loop).
5. **Repo workflow rules** (from CLAUDE.md): every change gets a ticket in `specs/backlog.md` (Sprint 38 section, tickets 38.1–38.12 all ✅ so far); QA = `npm run build` in `sdlc-presentation/` must pass.

---

## 3. Session History (what was done, in order)

1. **Built the sub-site** (22 slides EN+HE) cloning the AutoSpec presentation shell; added pages.yml build step; merged to main; live.
2. **Slide 12 fixes:** added the Summarization stage (Stage 6) to the "Stages" scrollable slide before Continuous Steering; fixed huge vertical gaps (removed `min-h-screen` per-section constraints → `py-10/py-12`).
3. **Expert review round:** two simulated reviewers (methodology fidelity + narrative flow) produced 24 findings; all HIGH/MEDIUM fixed — owner chips per stage (split `owner` on `" + "` into blue pills), "6 Stages"→"7 Stages" title, stage tags on Roles slide corrected, Bolt defined on first use, tooling subtitles/descriptions added (`ToolCard` got optional `subtitle`/`description`), Sprint→Bolt renames in all pipeline viz components.
4. **LATEST — Big-5 Acts merge (commit `b1e9c12`):** Slides 12 ("The 7 Stages"), 16 ("The Agentic SDLC Pipeline"), and 17 ("Summarization: The Memory Layer") were **removed from the deck data** and replaced by ONE new cinematic scrollable slide. Deck: 22 → 20 slides.

---

## 4. The Big-5 Acts Slide (current centerpiece — newest, least battle-tested)

`type: 'agentic5Acts'`, component `src/components/AgenticFiveActsSlide.tsx`, slide #12 in the deck.

Structure: full-screen cinematic intro (act roadmap SPECIFY → ARCHITECT → BOLT → REMEMBER → STEER with ★ KEY markers) → 5 act sections (each `min-h-[85vh]`, watermark Roman numeral background, act label row, big act name, italic tagline, owner pills, bullets, output artifact chip, right-column visualization) → closing 🎬 callout.

| Act | Name | Maps to stages | Owners | Hero | Visualization |
|-----|------|----------------|--------|------|---------------|
| I | SPECIFY | 1–2 | Product Owner, Architect | no | `TerminalVisualization` |
| II | ARCHITECT | 3 | Architect, Dev Team Lead | no | `SkillsVisualization` |
| III | BOLT | 4–5 | Developer (HITL), QA Developer (HITL) | ★ | `WorktreeDiagram` |
| IV | REMEMBER | 6 | PO + Dev Lead + QA Lead (all HITL) | ★ | `SprintSummaryVisualization` |
| V | STEER | 7 | SRE / DevOps | no | inline `SteeringLoop` (defined in the same file) |

Hero acts (III, IV) get accent background tint, ring, bigger headers, "★ KEY ACT" badge. Visualization mapping is `vizMap` keyed by Roman numeral inside `AgenticFiveActsSlide.tsx`. Accent palette is `accentMap` (blue/emerald/indigo/teal/orange) — Tailwind classes must stay literal (no dynamic class names) or purge will drop them.

**Status:** `npm run build` passes; pushed to branch; **NOT yet merged to main, NOT yet visually verified in a browser by the user.**

---

## 5. Immediate Next Steps (in priority order)

1. **Visual QA the Big-5 slide locally:** `cd sdlc-presentation && npm install && npm run dev` → open `/#/presentation` → arrow to slide 12 → scroll through all 5 acts in EN and HE (check RTL layout, owner pills, watermark numerals, hero styling, the Act V SteeringLoop).
2. **Check legacy slide cleanup decision:** `SixStagesSlide`, `PipelineSlide`, `SprintMemorySlide` are now unreferenced by deck data but still imported/registered in `PresentationPage.tsx`. Either delete them + their registry entries, or keep as fallback. (User hasn't decided — ask or leave.)
3. **Merge to main** (user does this via PR) to deploy the combined slide to the live site.
4. **Backlog hygiene:** add a ticket to `specs/backlog.md` Sprint 38 for the Big-5 merge if not present (rule: backlog-first; this last change went out quickly — verify ticket exists, add ✅ entry if missing).
5. Possible follow-up the user may ask for: tighten the intro screen, mobile layout polish, or fold more of the removed Pipeline steps' detail (e.g., Spec Approval Gate, Human Review step) into the acts as sub-beats.

## 6. How to Verify Any Change

```bash
cd sdlc-presentation
npm install        # first time on a new machine
npm run build      # must pass — this is the QA gate
npm run dev        # visual check at http://localhost:5173/autospec/sdlc/
```

Push to `claude/sdlc-sdd-presentation-4cp7e4`; deploy happens only on merge to `main` via `.github/workflows/pages.yml`.

## 7. Voice & Story Rules (for any content edits)

- Tagline trinity: "The Spec is the Truth. The Harness is the Guardrail. The Human is the Judge."
- Narrative arc: Problem (eras → context poisoning → reverse-engineering tax → breaking point) → Turning point ("What if...") → Methodology (philosophy → not-vibe-coding → **Big-5 Acts** → harness → roles) → SDD implementation (three pillars → orchestrator) → Tooling & adoption → Close.
- Summarization/REMEMBER is the signature differentiator ("the memory AI was never given") — always give it hero treatment.
- Stats used (keep sourced): 38.7% of AI review comments drive real fixes (Atlassian RovoDev 2026), up-to-80% quality improvements, PwC 2026 "pioneer teams", Amplify Partners closing quote.
