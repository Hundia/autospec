# Sprint 38 Brief: Agentic SDLC × SDD Presentation

**Date:** 2026-06-10
**Theme:** New GitHub Pages sub-site presentation at `/sdlc/` — the AutoSpec deck shell with the Enterprise Agentic SDLC methodology as the story's second half
**Spec (READ FIRST):** `sdlc_sdd.md` (repo root) — the complete 22-slide design, app structure, and deployment plan

---

## Context

The repo hosts the main AutoSpec presentation app (`presentation/`, deployed at the
Pages root, route `#/presentation`) and one sub-site (`lss-presentation/`, built into
`presentation/dist/lss/` by `.github/workflows/pages.yml`).

Sprint 38 adds a second sub-site: **`sdlc-presentation/`**, deployed at
`https://hundia.github.io/autospec/sdlc/#/presentation`. It reuses the original deck's
shell, slide-transition system, EN/HE toggle, and the **scrollable slide pattern** from
slide 16 ("The Full AutoSpec Pipeline" — `scrollable: true` + `ScrollProgressBar`).

## Hard Constraints

1. **Do not modify ANY file under `presentation/`** — copy files out of it, never edit it.
2. Only shared file changed: `.github/workflows/pages.yml` (add sub-site build, mirror
   the LSS block).
3. `sdlc-presentation/vite.config.ts` → `base: '/autospec/sdlc/'`.
4. Follow `sdlc_sdd.md` §3 (structure) and §4 (slide-by-slide content) exactly.
5. Slides 12 (`sixStages`), 16 (`pipeline`), 20 (`adoption`) are `scrollable: true`.

## Key Reference Files

- `presentation/src/pages/PresentationPage.tsx` — the shell (copy + adjust slide registry)
- `presentation/src/data/slides-en.ts` — original data shapes (the new deck reuses many)
- `presentation/src/components/pipeline/PipelineSlide.tsx` + `PipelineStep.tsx` +
  `ScrollProgressBar.tsx` — the scrollable slide-16 mechanics
- `lss-presentation/` — sub-site scaffold pattern (package.json, vite, tailwind, index.html)
- `.github/workflows/pages.yml` — LSS build block to mirror

## Execution Order

1. 38.2 Scaffold `sdlc-presentation/` (copy configs from `presentation/`, fix name/base/title).
2. 38.3 Copy shell + shared components (backgrounds, ui, pipeline).
3. 38.4 Copy reused slide components verbatim (data-driven ones need no edits).
4. 38.5–38.6 Build the 7 NEW slide components per spec §4 (match the existing visual
   idiom: slate gradient, framer-motion stagger, `bg-white/5 border-white/10` cards).
5. 38.7 Write `slides-en.ts` (22 slides, content in spec §4) and `slides-he.ts`
   (faithful Hebrew translation, identical structure).
6. 38.8 Update `pages.yml`.
7. 38.9 QA: `npm install && npm run build` in `sdlc-presentation/`; verify
   `git status` shows nothing changed under `presentation/`.
8. 38.10 Write `docs/sdlc-presentation/01_overview.md` (architecture, slide map,
   deploy path) and `sprints/sprint-38/summary.md`; flip backlog 38.x tickets to ✅.

## Definition of Done

- `sdlc-presentation` builds clean (vite build, no TS errors).
- 22 slides EN + HE, three scrollable, ScrollProgressBar visible on them.
- `presentation/` diff-clean; `pages.yml` copies dist → `presentation/dist/sdlc/`.
- Backlog, docs, and sprint summary updated.
