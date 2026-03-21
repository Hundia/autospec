# AutoDeck — AI-Native Presentation Framework

AutoDeck is a React component library for building enterprise-grade presentations with AI agents.

## Component API

```tsx
import { Presentation, TitleSlide, CodeSlide, GridSlide } from '@autodeck/core';

<Presentation theme="dark" background="particles">
  <TitleSlide title="My Product" subtitle="The future" tagline="Build smarter." />
  <CodeSlide title="Setup" terminal={{ title: 'install.sh' }} lines={[...]} />
  <GridSlide title="Features" cards={[...]} columns={3} />
</Presentation>
```

## Available Components

### Slide Types (13)
TitleSlide, ContentSlide, SplitSlide, GridSlide, TimelineSlide, PipelineSlide, CodeSlide, DiagramSlide, MetricsSlide, BalanceSlide, EraSlide, QuoteSlide, ClosingSlide

### Visualization Components (15)
TerminalWindow, BrowserMockup, FileTree, FlowDiagram, ChatWindow, CodeBlock, BalanceBeam, KanbanBoard, ArchitectureDiagram, ProcessLoop, Checklist, GradientText, AnimatedCounter, ProgressRing, ScrollProgressBar

### Backgrounds (12)
particles, grid, circuits, gradient, matrix, constellation, waves, hex, aurora, fireflies, rain, nebula

### Themes (4)
dark (default), light, midnight, sunrise — or custom via createTheme()

## Key Rules

- Static slides: use `initial` + `animate` with staggered `delay`
- Scrollable slides: use `whileInView` + `viewport={{ once: true, amount: 0.3 }}`
- Only framer-motion + Tailwind for animations — no additional deps
- Cards use glass morphism: `bg-white/5 border border-{color}-500/20 rounded-xl`
- Gradient text: `bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent`
- Fonts: Inter (sans), JetBrains Mono (mono)
