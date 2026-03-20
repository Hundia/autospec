---
title: "Viewer Prompt Generator"
sprint: "4.1"
created: "2026-03-09"
---

# Viewer Prompt Generator

**File:** `cli/src/generators/viewer-prompt.generator.ts`

## Purpose

Generates the LLM prompt that instructs an AI to build a React-based "project viewer" for any AutoSpec-managed project. This generator does NOT produce React code directly — it produces a prompt that, when fed to Claude/GPT, generates the viewer app.

## Design System Spec (Post-Sprint 4)

The generated prompt now specifies the **warm FitnessAiManager palette** instead of the previous dark shadcn/ui theme.

### Color Tokens Emitted
| Token | Hex | Usage |
|-------|-----|-------|
| parchment | `#f5f3ed` | Page background |
| cream | `#faf9f5` | Card surface |
| sage | `#698472` | Primary actions |
| terracotta | `#8e6a59` | Accent |
| sand | `#d8d0ba` | Borders |
| charcoal | `#1a1a1a` | Text |

### Primitive Strategy
- **Port FROM:** `/opt/FitnessAiManager/apps/web/src/design-system/components/primitives/`
- **NOT from:** shadcn/ui (forbidden)
- **Adaptations:** Remove RTL classes, Hebrew fonts → Inter/JetBrains Mono

### Recharts Colors
```javascript
const CHART_COLORS = ['#698472', '#8e6a59', '#536a5b', '#b08a79',
                       '#a08c72', '#44564a', '#d9b9a8', '#d8d0ba']
```

## Usage

The generator is called by `autospec init` and `autospec viewer build`:

```typescript
import { generateViewerPrompts } from './generators/viewer-prompt.generator.js'

const files = await generateViewerPrompts({
  projectName: 'MyApp',
  outputDir: './viewer-prompt',
  requirements: parsedReqs,
  techStack: { frontend: 'React', backend: 'Node.js' }
})
```

## Sprint History
| Sprint | Change |
|--------|--------|
| Sprint 4.1 | Replaced dark shadcn palette → warm FitnessAiManager palette |
| Initial | Dark slate theme (slate-950 background, shadcn/ui) |
