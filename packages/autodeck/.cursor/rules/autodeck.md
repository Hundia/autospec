# AutoDeck Presentation Framework

AutoDeck is a React + TypeScript component library for building animated, themed presentations. It provides 13 slide types, 15 visualization components, 12 animated backgrounds, and 5 themes.

## Slide Types (13)

| Component | Purpose |
|-----------|---------|
| `TitleSlide` | Opening slide with title, subtitle, and optional background |
| `ContentSlide` | General-purpose slide with text content and optional visuals |
| `SplitSlide` | Two-panel layout with left/right content areas |
| `GridSlide` | Grid-based layout for cards, features, or comparisons |
| `TimelineSlide` | Chronological sequence of events or milestones |
| `PipelineSlide` | Linear process or workflow visualization |
| `CodeSlide` | Code display with syntax highlighting and annotations |
| `DiagramSlide` | Architecture or system diagrams |
| `MetricsSlide` | KPIs, counters, and data-driven displays |
| `BalanceSlide` | Side-by-side comparison (pros/cons, before/after) |
| `EraSlide` | Historical or evolution-focused narrative |
| `QuoteSlide` | Prominent quotation with attribution |
| `ClosingSlide` | Final slide with call-to-action or summary |

## Visualization Components (15)

| Component | Purpose |
|-----------|---------|
| `TerminalWindow` | Fake terminal with command output |
| `BrowserMockup` | Browser chrome wrapping content |
| `FileTree` | Expandable directory/file structure |
| `FlowDiagram` | Nodes and edges for process flows |
| `ChatWindow` | Messaging-style conversation UI |
| `CodeBlock` | Syntax-highlighted code snippet |
| `BalanceBeam` | Weighted comparison visualization |
| `KanbanBoard` | Column-based task board |
| `ArchitectureDiagram` | System architecture with connected components |
| `ProcessLoop` | Circular or iterative process |
| `Checklist` | Animated checkbox list |
| `GradientText` | Text with gradient color fill |
| `AnimatedCounter` | Number that counts up/down on mount |
| `ProgressRing` | Circular progress indicator |
| `ScrollProgressBar` | Horizontal bar tracking scroll position |

## Themes (5)

| Theme | Description |
|-------|------------|
| `dark` | Dark slate gradient, white text (default) |
| `light` | Light background, dark text |
| `midnight` | Deep navy/indigo palette |
| `sunrise` | Warm amber/orange tones |
| `createTheme()` | Custom color tokens: `bg`, `text`, `accent`, `muted`, `border` |

## Animated Backgrounds (12)

`particles` `grid` `circuits` `gradient` `matrix` `constellation` `waves` `hex` `aurora` `fireflies` `rain` `nebula`

Each background renders as an animated overlay on the slide's base color. Backgrounds can be set globally on the `Presentation` wrapper or per-slide as an override.

## Design System

- **Cards**: Glass morphism -- `bg-white/5 backdrop-blur-md border border-white/10 rounded-xl`
- **Headings**: Use `GradientText` component for gradient-filled headings
- **Body text**: `text-white` with opacity variants (`/80`, `/60`, `/40`)
- **Chrome wrappers**: Terminal (3 colored dots + dark bg), Browser (dots + URL bar)
- **Accent palette**: Tailwind colors -- blue, violet, emerald, cyan, amber, indigo
- **Spacing**: `p-6` / `p-8` for card padding; `gap-6` for grid gaps

## Animation Patterns

### Static slides (default)
Mount-triggered animations using framer-motion:
```tsx
<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
```
Use staggered `delay` values to choreograph element entrance order.

### Scrollable slides
Set `scrollable: true` on the slide. Use scroll-triggered animations:
```tsx
<motion.div whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }}>
```

### Rules
- No new npm dependencies -- use only framer-motion + Tailwind + inline SVG
- Animate only `opacity` and `transform` properties for performance
- Avoid layout-triggering properties (`width`, `height`, `top`, `left`)

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

## Common Patterns

### Creating a new slide
1. Choose a slide type from the 13 available
2. Create a directory under `src/slides/<slide-name>/`
3. Create the main component file `<SlideName>.tsx`
4. Add any visualization sub-components in the same directory
5. Wire the slide into the presentation's slide list in `deck.tsx`
6. Set background and theme props

### Adding a visualization to an existing slide
1. Select from the 15 built-in viz components or create a custom one
2. Place the component file in the slide's directory
3. Import and compose it into the slide's JSX
4. Pass data via typed props

### Restyling a presentation
1. Change the `theme` prop on the `Presentation` wrapper for global changes
2. Change the `background` prop globally or per-slide
3. Use `createTheme()` for fully custom color tokens
4. Verify text contrast remains readable

### Example slide usage
```tsx
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

## Quality Checklist
- `npm run build` exits 0
- All slides render without console errors
- Keyboard navigation (Left/Right arrows, Escape) works
- Background animations run smoothly
- Responsive at 375px, 768px, and 1440px
- Viz components animate correctly (mount vs scroll trigger)
