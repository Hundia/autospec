# AutoDeck Presentation Framework -- Continue.dev Context

This file provides context for Continue.dev about the AutoDeck presentation framework. AutoDeck is a React + TypeScript component library for building animated, themed presentations with 13 slide types, 15 visualization components, 12 animated backgrounds, and 5 themes.

## Project Location

All AutoDeck source lives under `packages/autodeck/`. Slides are in `src/slides/<slide-name>/` and the main deck file is `src/deck.tsx`.

## Component Library

### Slide Types (13)

- `TitleSlide` -- Opening slide with title, subtitle, and optional background
- `ContentSlide` -- General-purpose slide with text content and optional visuals
- `SplitSlide` -- Two-panel layout with left/right content areas
- `GridSlide` -- Grid-based layout for cards, features, or comparisons
- `TimelineSlide` -- Chronological sequence of events or milestones
- `PipelineSlide` -- Linear process or workflow visualization
- `CodeSlide` -- Code display with syntax highlighting and annotations
- `DiagramSlide` -- Architecture or system diagrams
- `MetricsSlide` -- KPIs, counters, and data-driven displays
- `BalanceSlide` -- Side-by-side comparison (pros/cons, before/after)
- `EraSlide` -- Historical or evolution-focused narrative
- `QuoteSlide` -- Prominent quotation with attribution
- `ClosingSlide` -- Final slide with call-to-action or summary

### Visualization Components (15)

- `TerminalWindow` -- Fake terminal with command output
- `BrowserMockup` -- Browser chrome wrapping content
- `FileTree` -- Expandable directory/file structure
- `FlowDiagram` -- Nodes and edges for process flows
- `ChatWindow` -- Messaging-style conversation UI
- `CodeBlock` -- Syntax-highlighted code snippet
- `BalanceBeam` -- Weighted comparison visualization
- `KanbanBoard` -- Column-based task board
- `ArchitectureDiagram` -- System architecture with connected components
- `ProcessLoop` -- Circular or iterative process
- `Checklist` -- Animated checkbox list
- `GradientText` -- Text with gradient color fill
- `AnimatedCounter` -- Number that counts up/down on mount
- `ProgressRing` -- Circular progress indicator
- `ScrollProgressBar` -- Horizontal bar tracking scroll position

### Themes

| Theme | Description |
|-------|------------|
| `dark` | Dark slate gradient, white text (default) |
| `light` | Light background, dark text |
| `midnight` | Deep navy/indigo palette |
| `sunrise` | Warm amber/orange tones |
| `createTheme()` | Custom tokens: `bg`, `text`, `accent`, `muted`, `border` |

### Animated Backgrounds (12)

`particles` `grid` `circuits` `gradient` `matrix` `constellation` `waves` `hex` `aurora` `fireflies` `rain` `nebula`

## Design System

- **Cards**: `bg-white/5 backdrop-blur-md border border-white/10 rounded-xl`
- **Headings**: Use `GradientText` component
- **Body text**: `text-white` with opacity variants (`/80`, `/60`, `/40`)
- **Terminal chrome**: 3 colored dots + dark background
- **Browser chrome**: Dots + URL bar + tabs
- **Accent colors**: Tailwind palette -- blue, violet, emerald, cyan, amber, indigo
- **Spacing**: `p-6`/`p-8` card padding; `gap-6` grid gaps

## Animation Patterns

**Static slides** (default): Use framer-motion `initial` + `animate` with staggered `delay`.

```tsx
<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
```

**Scrollable slides**: Set `scrollable: true` on the slide component. Use scroll-triggered animations:

```tsx
<motion.div whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }}>
```

**Rules**:
- No new npm dependencies -- only framer-motion + Tailwind + inline SVG
- Animate only `opacity` and `transform` for performance
- Avoid layout-triggering properties

## File Structure

```
packages/autodeck/src/
├── deck.tsx                          # Main presentation file
├── slides/<slide-name>/
│   ├── <SlideName>.tsx               # Slide component
│   ├── <Visualization1>.tsx          # Viz sub-components
│   └── ...
└── components/shared/               # Reusable components
```

## Common Tasks

### Creating a new slide
1. Choose a slide type from the 13 available
2. Create `src/slides/<slide-name>/<SlideName>.tsx`
3. Add viz sub-components in the same directory
4. Wire into `deck.tsx` slide list
5. Set background and theme props

### Adding a visualization
1. Pick from 15 built-in viz components or create custom
2. Place in the target slide's directory
3. Compose into the slide's JSX with typed props

### Restyling
1. Change `theme` prop on `Presentation` wrapper (global)
2. Change `background` prop globally or per-slide
3. Use `createTheme()` for custom color tokens
4. Check text contrast against new backgrounds

### Example
```tsx
<SplitSlide
  background="constellation"
  theme="midnight"
  title="Architecture Overview"
  left={<ArchitectureDiagram nodes={nodes} edges={edges} />}
  right={<ContentPanel items={items} />}
/>
```

## Quality Checklist
- `npm run build` exits 0
- No console errors
- Keyboard navigation (Left/Right, Escape) works
- Background animations run smoothly
- Responsive at 375px, 768px, 1440px
