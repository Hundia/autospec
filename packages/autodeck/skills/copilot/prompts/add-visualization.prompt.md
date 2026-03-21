---
description: "Add a visualization component to an existing presentation slide"
mode: "agent"
---

# Add Visualization

Add a visualization component to an existing slide in an AutoDeck presentation.

Visualization description: {{input}}

## Phase 1: Analysis
- Identify which existing slide should receive the visualization
- Read the slide's current component and layout to understand available space
- Select the best-fit component from the 15 built-in visualizations:
  `TerminalWindow`, `BrowserMockup`, `FileTree`, `FlowDiagram`, `ChatWindow`, `CodeBlock`, `BalanceBeam`, `KanbanBoard`, `ArchitectureDiagram`, `ProcessLoop`, `Checklist`, `GradientText`, `AnimatedCounter`, `ProgressRing`, `ScrollProgressBar`
- If no built-in component fits, plan a custom component following the same self-contained pattern

## Phase 2: Design
- Determine the data shape the visualization requires (props interface, arrays, labels)
- Choose animation pattern based on the host slide:
  - **Static slide**: Mount-triggered using `initial` + `animate` with staggered `delay`
  - **Scrollable slide**: Scroll-triggered using `whileInView` + `viewport={{ once: true, amount: 0.3 }}`
- Plan placement within the existing layout without disrupting current content
- Ensure the visualization works responsively across viewport sizes

## Phase 3: Implementation
- Create or modify the visualization component under the slide's component directory
- Wire the component into the slide's JSX, passing data via typed props
- Never add new npm dependencies -- use framer-motion + Tailwind + inline SVG only
- Keep animations performant: prefer `opacity` and `transform` properties

## Phase 4: Quality Checklist
- [ ] `npm run build` exits 0
- [ ] Visualization renders correctly and fits the slide layout
- [ ] Animation timing sequences properly with existing slide content
- [ ] Responsive behavior works at 375px, 768px, and 1440px
- [ ] No console errors

## Design System
- **Cards**: Glass morphism (`bg-white/5 backdrop-blur-md border border-white/10 rounded-xl`)
- **Chrome**: Terminal wrapper (3 dots + dark bg), Browser wrapper (dots + URL bar)
- **Text**: `GradientText` for headings; `text-white/80` for body
- **Accents**: Tailwind palette -- blue, violet, emerald, cyan, amber, indigo
- **Spacing**: `p-6` / `p-8` card padding; `gap-6` grid gaps

## File Structure
```
packages/autodeck/src/slides/<slide-name>/
├── <SlideName>.tsx              # Host slide (modify to include new viz)
├── <NewVisualization>.tsx       # New visualization component
└── ...
```
