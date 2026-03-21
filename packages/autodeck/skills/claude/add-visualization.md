# Add Visualization

Add a visualization component to an existing slide in the presentation.

## Usage
```
/add-visualization <description of what to visualize>
```

## Process

### Phase 1: Analysis
- Identify which existing slide should receive the visualization
- Read the slide's current component and data files to understand layout and available space
- Select the best-fit component from the built-in visualization library:
  `TerminalWindow`, `BrowserMockup`, `FileTree`, `FlowDiagram`, `ChatWindow`, `CodeBlock`, `BalanceBeam`, `KanbanBoard`, `ArchitectureDiagram`, `ProcessLoop`, `Checklist`, `GradientText`, `AnimatedCounter`, `ProgressRing`, `ScrollProgressBar`
- If no built-in component fits the need, plan a custom component following the same self-contained pattern

### Phase 2: Design
- Determine the data shape the visualization requires (props interface, content arrays, label strings)
- Choose animation pattern based on the host slide:
  - **Static slide**: Mount-triggered — use `initial` + `animate` with staggered `delay`
  - **Scrollable slide**: Scroll-triggered — use `whileInView` + `viewport={{ once: true, amount: 0.3 }}`
- Plan placement within the existing slide layout without disrupting current content
- Ensure the visualization works in both LTR (English) and RTL (Hebrew) directions

### Phase 3: Implementation
- Create or modify the visualization component under the slide's component directory
- Add any new data fields to both `slides-en.ts` and `slides-he.ts` with structural parity
- Wire the component into the slide's JSX, passing data via props
- Never add new npm dependencies — use framer-motion + Tailwind + inline SVG only
- Keep animations performant: prefer `opacity` and `transform` properties

### Phase 4: QA
- Run `npm run build` — must exit 0
- Visual check: visualization renders correctly and fits the slide layout
- Animation timing: verify the visualization animates in sequence with existing slide content
- Confirm EN/HE toggle renders the visualization correctly in both languages
- No console errors

### Phase 5: Commit & Push
Stage all changed files, commit with a descriptive message, and push to `origin/main`:
```bash
git commit -m "feat(presentation): add <visualization> to <slide>

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```
