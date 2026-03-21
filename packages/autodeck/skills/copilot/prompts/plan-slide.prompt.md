---
description: "Plan and implement a new or overhauled presentation slide"
mode: "agent"
---

# Plan Slide

Plan and implement a new or overhauled AutoDeck presentation slide.

Slide description: {{input}}

## Phase 1: Content Strategy
- **Key message**: What should the audience take away from this slide?
- **Narrative position**: Where does this slide sit in the presentation arc?
- **Slide type**: Select from the 13 AutoDeck types: `TitleSlide`, `ContentSlide`, `SplitSlide`, `GridSlide`, `TimelineSlide`, `PipelineSlide`, `CodeSlide`, `DiagramSlide`, `MetricsSlide`, `BalanceSlide`, `EraSlide`, `QuoteSlide`, `ClosingSlide`
- **Visual pattern**: Static single-screen, scrollable multi-section, or interactive?
- **Supporting visuals**: Which viz components reinforce the message?

## Phase 2: Layout Architecture
- **Static slide**: Single viewport, `overflow-hidden`, mount-triggered animations
- **Scrollable slide**: Multi-viewport, `overflow-y-auto`, scroll-triggered animations, set `scrollable: true`
- **Background**: Choose from 12 animated backgrounds: `particles`, `grid`, `circuits`, `gradient`, `matrix`, `constellation`, `waves`, `hex`, `aurora`, `fireflies`, `rain`, `nebula`
- **Theme**: `dark` (default), `light`, `midnight`, `sunrise`, or custom via `createTheme()`
- **Responsive**: Layout must work from mobile (375px) to ultrawide viewports

## Phase 3: Animation Direction
- **Static slides**: Use `initial` + `animate` with staggered `delay` values
- **Scrollable slides**: Use `whileInView` + `viewport={{ once: true, amount: 0.3 }}`
- **No new dependencies**: Use only framer-motion + Tailwind + inline SVG
- **Performance**: Animate `opacity` and `transform` only; avoid layout-triggering properties

## Phase 4: Implementation
Create in parallel where independent:

**A -- Slide Structure**: Select and configure the slide type component, create the main slide file, wire it into the presentation's slide list, apply background and theme props.

**B -- Visualizations**: Build or compose viz components from the 15 available: `TerminalWindow`, `BrowserMockup`, `FileTree`, `FlowDiagram`, `ChatWindow`, `CodeBlock`, `BalanceBeam`, `KanbanBoard`, `ArchitectureDiagram`, `ProcessLoop`, `Checklist`, `GradientText`, `AnimatedCounter`, `ProgressRing`, `ScrollProgressBar`. Place each in a subdirectory under the slide.

**C -- Data & Content**: Author all text, labels, data arrays, and code snippets. Pass as typed props to the slide component.

**D -- Integration & QA** (after A+B+C): Run `npm run build`, fix errors, verify keyboard navigation and responsive layout.

## Phase 5: Quality Checklist
- [ ] `npm run build` exits 0
- [ ] Slide renders with chosen theme and background
- [ ] Keyboard navigation works (Left/Right arrows, Escape)
- [ ] Background animation runs smoothly
- [ ] Responsive at 375px, 768px, and 1440px
- [ ] Viz components animate correctly (mount vs scroll trigger)
- [ ] No console errors or warnings

## File Structure
```
packages/autodeck/src/slides/<slide-name>/
├── <SlideName>.tsx
├── <Visualization1>.tsx
└── ...
```

## Design System
- **Backgrounds**: Dark gradient base with animated overlays
- **Cards**: Glass morphism (`bg-white/5 backdrop-blur-md border border-white/10 rounded-xl`)
- **Text**: `GradientText` for headings; `text-white` with opacity variants for body
- **Accents**: Tailwind palette -- blue, violet, emerald, cyan, amber, indigo
