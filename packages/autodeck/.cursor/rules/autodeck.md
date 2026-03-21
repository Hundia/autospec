# AutoDeck — AI-Native Presentation Framework

## Overview

AutoDeck is a React component library for building stunning, enterprise-grade presentations with AI agents. It provides 13 slide types, 15 visualization components, 12 animated backgrounds, and a theme system.

## Quick Reference

### Creating a Presentation

```tsx
import { Presentation, TitleSlide, CodeSlide, GridSlide } from '@autodeck/core';

export default function MyDeck() {
  return (
    <Presentation theme="dark" background="particles">
      <TitleSlide title="My Product" subtitle="The future" tagline="Build smarter." />
      <CodeSlide title="Setup" terminal={{ title: 'install.sh' }} lines={[...]} />
      <GridSlide title="Features" cards={[...]} columns={3} />
    </Presentation>
  );
}
```

### 13 Slide Types

| Component | Use Case | Key Props |
|-----------|----------|-----------|
| `TitleSlide` | Opening hero | title, subtitle, tagline, presenter |
| `ContentSlide` | General content | title, subtitle, content, visualization |
| `SplitSlide` | Side-by-side comparison | left, right, splitRatio |
| `GridSlide` | Card grid layout | title, cards[], columns |
| `TimelineSlide` | Progress/degradation | title, stages[], chat? |
| `PipelineSlide` | Scrollable multi-step | steps[], scrollable=true |
| `CodeSlide` | Terminal/code display | terminal, lines[] |
| `DiagramSlide` | Flow diagrams | nodes[], edges[] |
| `MetricsSlide` | KPIs and stats | metrics[], quote? |
| `BalanceSlide` | Seesaw comparison | leftItems, rightItems, stats |
| `EraSlide` | Era/phase cards | title, characteristics[], metrics |
| `QuoteSlide` | Testimonial/callout | quote, attribution |
| `ClosingSlide` | Final CTA | title, tagline, cta |

### 15 Visualization Components

`TerminalWindow`, `BrowserMockup`, `FileTree`, `FlowDiagram`, `ChatWindow`, `CodeBlock`, `BalanceBeam`, `KanbanBoard`, `ArchitectureDiagram`, `ProcessLoop`, `Checklist`, `GradientText`, `AnimatedCounter`, `ProgressRing`, `ScrollProgressBar`

### 12 Backgrounds

`particles`, `grid`, `circuits`, `gradient`, `matrix`, `constellation`, `waves`, `hex`, `aurora`, `fireflies`, `rain`, `nebula`

### 4 Themes

`dark` (default), `light`, `midnight`, `sunrise` — or custom via `createTheme()`

## Animation Rules

- **Static slides**: `initial` + `animate` with staggered `delay`
- **Scrollable slides**: `whileInView` + `viewport={{ once: true, amount: 0.3 }}`
- Only use framer-motion + Tailwind — no additional animation dependencies
- Prefer `opacity` and `transform` for smooth 60fps animations

## Design System

- Background: `from-slate-900 via-slate-800 to-slate-900`
- Cards: `bg-white/5 border border-{color}-500/20 rounded-xl` (glass morphism)
- Gradient text: `bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent`
- Terminal chrome: red/yellow/green dots + dark bg
- Fonts: Inter (sans), JetBrains Mono (mono)

## File Structure

```
src/
├── deck.tsx              # Main presentation (Presentation + slides)
├── slides/               # Custom slide components
│   └── CustomSlide.tsx
└── components/           # Custom visualization components
```
