# Plan Slide

Plan and implement a new or overhauled presentation slide using the AutoDeck framework and agent team pattern.

## Usage
```
/plan-slide <slide-description>
```

## Process

### Phase 1: Content Strategy
Analyze the slide's purpose and define:
- **Key message**: What should the audience take away from this slide?
- **Narrative position**: Where does this slide sit in the presentation arc?
- **Slide type**: Select from the 13 AutoDeck slide types (see Component Reference below)
- **Visual pattern**: Static single-screen, scrollable multi-section, or interactive?
- **Supporting visuals**: Which viz components best reinforce the message?

### Phase 2: UX/Layout Architecture
Decide on the layout approach:
- **Static slide**: Single viewport, `overflow-hidden`, mount-triggered animations
- **Scrollable slide**: Multi-viewport, `overflow-y-auto`, scroll-triggered animations, set `scrollable: true` in props
- **Background**: Choose from the 12 animated backgrounds (see Component Reference)
- **Theme**: Use `dark` (default), `light`, `midnight`, `sunrise`, or a custom theme via `createTheme()`
- **Responsive**: Layout must adapt gracefully from mobile to ultrawide viewports

### Phase 3: Animation Direction
Define animation strategy:
- **Static slides**: Use `initial` + `animate` with staggered `delay` values
- **Scrollable slides**: Use `whileInView` + `viewport={{ once: true, amount: 0.3 }}`
- **No new dependencies**: Use only framer-motion + Tailwind + inline SVG
- **Performance**: Prefer animating `opacity` and `transform` only; avoid layout-triggering properties
- **Entrance choreography**: Define the order elements appear and any coordinated motion sequences

### Phase 4: Implementation (Agent Team)
Spawn parallel agents where independent:

**Agent A -- Layout & Slide Structure** (sonnet)
- Select and configure the slide type component (e.g., `<SplitSlide>`, `<GridSlide>`)
- Create the main slide file and any wrapper logic
- Wire up the slide in the presentation's slide list
- Apply background and theme props

**Agent B -- Visualization Components** (sonnet)
- Build or compose viz components (e.g., `<FlowDiagram>`, `<TerminalWindow>`, `<CodeBlock>`)
- Place each component in a dedicated subdirectory under the slide
- Ensure each viz is self-contained with its own animations and props

**Agent C -- Data & Content** (sonnet)
- Author all text content, labels, data arrays, and code snippets
- Pass content as typed props to the slide component
- Ensure content is complete and accurate before handoff

**Agent D -- Integration & QA** (sequential, after A+B+C merge)
- Run `npm run build` and fix any TypeScript or build errors
- Verify the slide renders correctly in the presentation flow
- Verify keyboard navigation (arrow keys) still works across all slides
- Verify the selected background animates without performance issues
- Confirm responsive behavior at mobile, tablet, and desktop breakpoints

### Phase 5: Quality Checklist
Before marking done, verify:
- [ ] `npm run build` exits 0 with no errors
- [ ] Slide renders correctly with chosen theme and background
- [ ] Keyboard navigation works (Left/Right arrows, Escape)
- [ ] Background animation runs smoothly (no jank or frame drops)
- [ ] Responsive layout works at 375px, 768px, and 1440px widths
- [ ] If scrollable: scroll progress indicator visible, scroll resets on slide change
- [ ] Viz components display data accurately and animate on cue
- [ ] No console errors or warnings
- [ ] Animations use the correct trigger pattern (mount vs scroll)

### Phase 6: Commit & Push
**This phase is MANDATORY -- always run it automatically after Phase 5 passes.**

1. Stage all changed files: `git add packages/autodeck/`
2. Also stage any other touched files (configs, skills, docs)
3. Commit with a descriptive message:
   ```bash
   git commit -m "feat(autodeck): <what was done>

   Co-Authored-By: Claude <noreply@anthropic.com>"
   ```
4. Push: `git push origin main`
5. Inform the user the push is complete and ready for review.

## Component Reference

### Slide Types (13)
`TitleSlide` `ContentSlide` `SplitSlide` `GridSlide` `TimelineSlide` `PipelineSlide` `CodeSlide` `DiagramSlide` `MetricsSlide` `BalanceSlide` `EraSlide` `QuoteSlide` `ClosingSlide`

### Visualization Components (15)
`TerminalWindow` `BrowserMockup` `FileTree` `FlowDiagram` `ChatWindow` `CodeBlock` `BalanceBeam` `KanbanBoard` `ArchitectureDiagram` `ProcessLoop` `Checklist` `GradientText` `AnimatedCounter` `ProgressRing` `ScrollProgressBar`

### Animated Backgrounds (12)
`particles` `grid` `circuits` `gradient` `matrix` `constellation` `waves` `hex` `aurora` `fireflies` `rain` `nebula`

### Themes
`dark` (default) | `light` | `midnight` | `sunrise` | custom via `createTheme()`

## File Structure Convention
```
packages/autodeck/src/slides/<slide-name>/
├── <SlideName>.tsx            # Main slide component
├── <Visualization1>.tsx       # Sub-components for visual elements
├── <Visualization2>.tsx
└── ...
```

## Data Structure Convention
```jsx
<SplitSlide
  background="constellation"
  theme="midnight"
  scrollable={false}
  title="Architecture Overview"
  subtitle="How the pieces fit together"
  left={<ArchitectureDiagram nodes={nodes} edges={edges} />}
  right={<ContentPanel items={items} />}
/>
```

## Design System Reference
- **Backgrounds**: Dark gradient base (`from-slate-900 via-slate-800 to-slate-900`) with animated overlays
- **Cards**: Glass morphism (`bg-white/5 backdrop-blur-md border border-white/10 rounded-xl`)
- **Text**: `GradientText` for headings; `text-white` with opacity variants (`/80`, `/60`, `/40`) for body
- **Chrome**: Terminal (3 dots red/yellow/green + dark bg) and browser (dots + URL bar + tabs) wrappers
- **Accents**: Tailwind palette -- blue, violet, emerald, cyan, amber, indigo for color-coded elements
- **Spacing**: Consistent `p-6` / `p-8` card padding; `gap-6` grid gaps
