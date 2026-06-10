# SDLC Presentation — Architecture & Overview

**App:** `sdlc-presentation/`
**Deploy path:** `https://hundia.github.io/autospec/sdlc/`
**Local dev:** `cd sdlc-presentation && npm run dev`
**Build:** `cd sdlc-presentation && npm run build`

---

## Architecture

The SDLC presentation is a standalone React/Vite sub-site at `sdlc-presentation/`. It is
an independent build (no cross-imports from `presentation/`) that shares visual patterns
by copying components. It deploys to GitHub Pages under the `/autospec/sdlc/` base path,
co-located inside `presentation/dist/sdlc/` at deploy time.

### Routing

Uses HashRouter so routes work under the sub-path without server configuration:

- `/#/` → LandingPage (hero with "Start Presentation" CTA)
- `/#/presentation` → PresentationPage (22 slides, EN/HE, keyboard nav)

### Key Files

```
sdlc-presentation/
  index.html                      title: "The Agentic SDLC × SDD"
  package.json                    name: "sdlc-presentation"
  vite.config.ts                  base: '/autospec/sdlc/'
  postcss.config.cjs              CommonJS PostCSS config (ESM pkg needs .cjs)
  tailwind.config.js, tsconfig.json, tsconfig.node.json
  src/
    main.tsx, index.css, App.tsx
    pages/
      LandingPage.tsx             Hero + "Start Presentation" + back link
      PresentationPage.tsx        Shell: nav, lang toggle, keyboard, scrollable
    components/
      backgrounds/BackgroundEffects.tsx   (copied from presentation/)
      ui/PresentationDropdown.tsx         (copied)
      pipeline/PipelineSlide.tsx          (copied, drives slide 16)
      pipeline/PipelineStep.tsx           (copied, added orange color)
      pipeline/ScrollProgressBar.tsx      (copied)
      pipeline/SprintSummaryVisualization.tsx (copied)
      pipeline/TerminalVisualization.tsx  (copied)
      pipeline/SpecGridVisualization.tsx  (copied)
      pipeline/DocsTreeVisualization.tsx  (copied)
      pipeline/SkillsVisualization.tsx    (copied)
      pipeline/BrowserMockup.tsx          (copied)
      pipeline/WorktreeDiagram.tsx        (copied)
      pipeline/QALoopVisualization.tsx    (copied)
      pipeline/UserReviewVisualization.tsx (copied)
      TitleSlide.tsx              (copied)
      EraTraditionalSlide.tsx     (copied)
      EraAssistantSlide.tsx       (copied)
      EraAgenticSlide.tsx         (copied)
      ContextPoisoningSlide.tsx   (copied)
      ReverseTaxSlide.tsx         (copied)
      BreakingPointSlide.tsx      (copied)
      SDDCostOfChaosSlide.tsx     (copied)
      BridgeSlide.tsx             (copied)
      SDDThreePillarsSlide.tsx    (copied)
      SprintMemorySlide.tsx       (copied)
      OrchestratorSlide.tsx       (copied)
      ClosingSlide.tsx            (copied)
      FinalTaglineSlide.tsx       (copied)
      PhilosophySlide.tsx         NEW — 5 philosophy cards + quote banner
      NotVibeCodingSlide.tsx      NEW — vibe coding vs governed system
      SixStagesSlide.tsx          NEW — SCROLLABLE 6 stages (slide-16 pattern)
      HarnessSlide.tsx            NEW — harness loop + 4 layer cards
      SdlcRolesSlide.tsx          NEW — 6 role cards + core-shift checklist
      ToolingSlide.tsx            NEW — 4 tool cards with terminal demos
      AdoptionSlide.tsx           NEW — SCROLLABLE 3 phases + ROI metrics
    data/
      slides-en.ts                22 slides, full EN content
      slides-he.ts                22 slides, faithful Hebrew translation
```

---

## Slide Map (1–22)

| # | Type | Component | Scrollable | Act |
|---|------|-----------|------------|-----|
| 1 | `title` | TitleSlide | — | 1 |
| 2 | `eraTraditional` | EraTraditionalSlide | — | 1 |
| 3 | `eraAssistant` | EraAssistantSlide | — | 1 |
| 4 | `eraAgentic` | EraAgenticSlide | — | 1 |
| 5 | `contextPoisoning` | ContextPoisoningSlide | — | 1 |
| 6 | `reverseTax` | ReverseTaxSlide | — | 1 |
| 7 | `breakingPoint` | BreakingPointSlide | — | 1 |
| 8 | `sddCostOfChaos` | SDDCostOfChaosSlide | — | 2 |
| 9 | `bridge` | BridgeSlide | — | 2 |
| 10 | `philosophy` | PhilosophySlide | — | 3 |
| 11 | `notVibeCoding` | NotVibeCodingSlide | — | 3 |
| 12 | `sixStages` | SixStagesSlide | **✓ scrollable** | 3 |
| 13 | `harness` | HarnessSlide | — | 3 |
| 14 | `sdlcRoles` | SdlcRolesSlide | — | 3 |
| 15 | `sddThreePillars` | SDDThreePillarsSlide | — | 4 |
| 16 | `pipeline` | PipelineSlide | **✓ scrollable** | 4 |
| 17 | `sprintMemorySlide` | SprintMemorySlide | — | 4 |
| 18 | `orchestrator` | OrchestratorSlide | — | 4 |
| 19 | `tooling` | ToolingSlide | — | 5 |
| 20 | `adoption` | AdoptionSlide | **✓ scrollable** | 5 |
| 21 | `closing` | ClosingSlide | — | 6 |
| 22 | `finalTagline` | FinalTaglineSlide | — | 6 |

Slides 12, 16, 20 have `scrollable: true` in both data files. The PresentationPage shell:
- Applies `h-screen overflow-y-auto` on scrollable slides (enables vertical scroll).
- Shows `ScrollProgressBar` on the right edge when scrollable.
- Space bar does NOT advance on scrollable slides (lets the user scroll instead).

---

## Reused vs New Components

**Copied verbatim from `presentation/`** (14 slide components + 9 pipeline visualizations + 3 shared):
- All Era slides, ContextPoisoning, ReverseTax, BreakingPoint, Bridge, SDDCostOfChaos,
  SDDThreePillars, SprintMemory, Orchestrator, Closing, FinalTagline, PipelineSlide,
  PipelineStep (+ orange color entry added), ScrollProgressBar, all pipeline visualizations,
  BackgroundEffects, PresentationDropdown.

**New components** (7): PhilosophySlide, NotVibeCodingSlide, SixStagesSlide, HarnessSlide,
SdlcRolesSlide, ToolingSlide, AdoptionSlide.

---

## Deploy Path

The CI/CD workflow in `.github/workflows/pages.yml` builds the app and copies
`sdlc-presentation/dist/*` into `presentation/dist/sdlc/` before the GitHub Pages
artifact upload. The resulting URL is:

```
https://hundia.github.io/autospec/sdlc/#/presentation
```

---

## How to Run Locally

```bash
cd sdlc-presentation
npm install
npm run dev       # → http://localhost:5173/autospec/sdlc/
npm run build     # production build into dist/
npm run preview   # preview the production build
```

The `base: '/autospec/sdlc/'` in vite.config.ts means all asset URLs are prefixed. Hash
routing handles the `/#/` and `/#/presentation` routes correctly at any host.
