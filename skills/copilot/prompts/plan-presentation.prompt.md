---
description: "Plan and implement a new or overhauled presentation slide"
mode: "agent"
---

# Plan Presentation Slide

Plan and implement a new or overhauled presentation slide using a structured agent pattern.

Slide description: {{input}}

## Phase 1: Content Strategy
- **Key message**: What should the audience remember?
- **Narrative position**: Where does this slide sit in the story arc?
- **Visual pattern**: Static single-screen, scrollable multi-section, or interactive?
- **Bilingual content**: Draft both EN and HE text

## Phase 2: UX/Layout Architecture
- **Static slide**: Single viewport, `overflow-hidden`, mount-triggered animations
- **Scrollable slide**: Multi-viewport, `overflow-y-auto`, scroll-triggered animations, needs `scrollable: true` in data
- **RTL considerations**: All layouts must work in both LTR (English) and RTL (Hebrew)
- **Responsive**: Must work on mobile viewports

## Phase 3: Animation Direction
- Static slides: Use `initial` + `animate` with staggered `delay`
- Scrollable slides: Use `whileInView` + `viewport={{ once: true, amount: 0.3 }}`
- Never add new npm dependencies — use framer-motion + Tailwind + inline SVG
- Keep animations performant: prefer `opacity` and `transform` properties

## Phase 4: Implementation
Implement these in parallel where independent:

**A — Layout & Infrastructure**: Create main slide component, wire up in `slideComponents` map

**B — Visualization Components**: Create sub-components in `src/components/<slide-name>/`

**C — Data & Content**: Update `slides-en.ts` and `slides-he.ts` with structural parity

**D — Integration & QA** (after above complete):
- Run `cd presentation && npm run build`
- Fix TypeScript/build errors
- Verify EN/HE toggle and keyboard navigation

## Phase 5: Quality Checklist
- [ ] `npm run build` exits 0
- [ ] Slide renders in English and Hebrew (RTL)
- [ ] Arrow key navigation works
- [ ] Progress dots show correct position
- [ ] If scrollable: scroll progress bar visible, scrollTop resets on slide change
- [ ] No console errors
- [ ] Mobile viewport renders acceptably

## Design System Reference
- Background: dark slate gradient (`from-slate-900 via-slate-800 to-slate-900`)
- Text: white with opacity variants
- Cards: `bg-white/5 border border-{color}-500/20 rounded-xl`

## File Structure Convention
```
presentation/src/components/<slide-name>/
├── <SlideMain>.tsx
├── <Visualization1>.tsx
└── ...
```
