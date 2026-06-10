---
sprint: 38
status: complete
date: 2026-06-10
theme: Agentic SDLC × SDD Presentation
---

# Sprint 38 Summary — Agentic SDLC × SDD Presentation

**Date:** 2026-06-10
**Status:** ✅ COMPLETE
**Theme:** New GitHub Pages sub-site `sdlc-presentation/` — the enterprise Agentic SDLC methodology as a 22-slide presentation.

## Overview

Sprint 38 delivered the `sdlc-presentation/` sub-site deployed at `https://hundia.github.io/autospec/sdlc/#/presentation`. The deck covers the full Enterprise Agentic SDLC: six stages, harness engineering, role transformation, SDD as the implementation layer, tooling, and adoption roadmap — in 22 slides with EN/HE language toggle. Three scrollable slides (12 — SixStages, 16 — Pipeline, 20 — Adoption) use the PipelineSlide/ScrollProgressBar pattern. Zero modifications to `presentation/`.

## Completed Tickets

| # | Ticket | Status | Docs |
|---|--------|--------|------|
| 38.2 | Scaffold `sdlc-presentation/` | ✅ | `docs/sdlc-presentation/01_overview.md` |
| 38.3 | Copy shell + shared components | ✅ | — |
| 38.4 | Copy reused slide components (14 total) | ✅ | — |
| 38.5 | NEW slides: Philosophy, NotVibeCoding, Harness, SdlcRoles, Tooling | ✅ | — |
| 38.6 | NEW scrollable slides: SixStages + Adoption | ✅ | — |
| 38.7 | slides-en.ts + slides-he.ts (22 slides each) | ✅ | — |
| 38.8 | pages.yml: SDLC build block | ✅ | — |
| 38.9 | QA: build clean, presentation/ untouched, scrollable verified | ✅ | — |
| 38.10 | docs/sdlc-presentation/01_overview.md + this summary | ✅ | `docs/sdlc-presentation/01_overview.md` |

## Files Added

- `sdlc-presentation/` — full sub-site (package.json, vite, tailwind, tsconfig, index.html, src/)
- 14 copied slide components + 9 pipeline visualizations + 3 shared components from `presentation/`
- 7 new slide components: PhilosophySlide, NotVibeCodingSlide, SixStagesSlide, HarnessSlide, SdlcRolesSlide, ToolingSlide, AdoptionSlide
- `sdlc-presentation/src/data/slides-en.ts` — 22 slides EN
- `sdlc-presentation/src/data/slides-he.ts` — 22 slides HE
- `docs/sdlc-presentation/01_overview.md`

## Files Modified

- `.github/workflows/pages.yml` — added SDLC build + copy to `presentation/dist/sdlc/`
- `specs/backlog.md` — Sprint 38 tickets flipped to ✅

## QA Results

- Build: ✅ Success (452KB JS, 38KB CSS, 3.18s)
- `git status`: only `pages.yml` modified, zero changes under `presentation/`
- Slides 12/16/20 have `scrollable: true` in both EN and HE data ✅
- 22 slides in both languages, identical structure ✅

## Key Decisions

1. `postcss.config.cjs` — package has `"type": "module"` so PostCSS config uses `.cjs` extension
2. Pipeline step 10 ("Continuous Steering") included per spec; renders without visualization widget (graceful fallback)
3. `orange` color added to PipelineStep.tsx colorMap for step 10
