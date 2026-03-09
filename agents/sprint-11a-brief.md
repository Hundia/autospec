# Sprint 11A Brief — Slide Deck Expansion

## Objective
Add 7 new methodology slides to the presentation deck, expanding from 11 to 18 slides. Update data files, create components, wire into PresentationPage, fix mobile progress dots.

## Tickets
- 11.1: Update slides-en.ts (7 new entries + reorder + stats update)
- 11.2: Update slides-he.ts (Hebrew translations + same reorder)
- 11.3: SprintLifecycleSlide.tsx
- 11.4: OrchestratorSlide.tsx
- 11.5: QAMethodologySlide.tsx
- 11.6: SprintSummarySlide.tsx
- 11.7: SkillsEnvironmentsSlide.tsx
- 11.8: ViewerSlide.tsx
- 11.9: FinOpsSlide.tsx
- 11.10: Update PresentationPage.tsx (imports + slideComponents map)
- 11.15: Fix mobile progress dots for 18 slides

## Execution Order
1. 11.1 (slides-en.ts)
2. 11.2 (slides-he.ts) + 11.3-11.9 (all components)
3. 11.10 (PresentationPage wiring)
4. 11.15 (mobile dots fix)

## File Paths
- Data: `presentation/src/data/slides-en.ts`, `presentation/src/data/slides-he.ts`
- Components: `presentation/src/components/` (flat directory, NOT in slides/ subfolder)
- Page: `presentation/src/pages/PresentationPage.tsx`

## 18-Slide Order (FINAL)
```
0: title
1: problem
2: solution
3: workflow
4: roles
5: sprintLifecycle    [NEW]
6: backlog
7: orchestrator       [NEW]
8: multiagent
9: qaMethodology      [NEW]
10: sprintSummary     [NEW]
11: skillsEnvironments [NEW]
12: viewer            [NEW]
13: finops            [NEW]
14: example
15: results           (update 200+ → 263, 16+ → 25+)
16: demo
17: closing
```

## Component Pattern (MUST FOLLOW EXACTLY)

Every slide component follows this pattern (derived from MultiAgentSlide.tsx and WorkflowSlide.tsx):

```tsx
import React from 'react';
import { motion } from 'framer-motion';

interface XxxSlideProps {
  data: {
    title: string;
    // ... slide-specific fields from data file
  };
  lang: 'en' | 'he';
}

export default function XxxSlide({ data, lang }: XxxSlideProps) {
  return (
    <div className="max-w-5xl mx-auto">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl sm:text-5xl font-bold text-center mb-4 text-COLOR-400"
      >
        {data.title}
      </motion.h2>
      {/* Content with staggered motion.div animations */}
    </div>
  );
}
```

Key conventions:
- Root: `<div className="max-w-5xl mx-auto">` or `max-w-6xl`
- Title: `motion.h2` with `initial={{ opacity: 0, y: -20 }}` animate to visible
- Cards: `bg-white/5 border border-COLOR-500/20 rounded-xl p-6`
- Staggered delays: start at 0.2s, increment by 0.1-0.15s
- Code/mono text: `font-mono text-sm text-white/80` on `bg-black/20 rounded px-3 py-2`
- Only import from `react` and `framer-motion` (and optionally `lucide-react`)

## Color Assignments (accent colors for title + borders)
| Slide | Color | Title Class |
|-------|-------|------------|
| SprintLifecycle | emerald | text-emerald-400 |
| Orchestrator | indigo | text-indigo-400 |
| QAMethodology | rose | text-rose-400 |
| SprintSummary | teal | text-teal-400 |
| SkillsEnvironments | sky | text-sky-400 |
| Viewer | green | text-green-400 |
| FinOps | amber | text-amber-400 |

## Slide Content Specifications

### SprintLifecycleSlide (emerald)
5-phase linear flow: Plan → Document → Execute → QA → Summarize
- Each phase: icon + title + 1-line description
- Show as horizontal pipeline on desktop, vertical on mobile
- Bottom callout: "Every sprint follows this cycle. Nothing ships without all 5 phases."

### OrchestratorSlide (indigo)
Two-tier hierarchy:
- Top: "Opus Orchestrator" card — writes briefs, spawns agents, reviews results
- Bottom: 2-3 "Sonnet Agent" cards — implement tickets in parallel with isolated contexts
- Show flow arrows from orchestrator to agents
- Benefits bar: "Clean main context", "Parallel execution", "Isolated worktrees"

### QAMethodologySlide (rose)
Two-column layout:
- Left: Test pyramid (3 stacked bars — E2E 10% at top, Integration 30% middle, Unit/API 60% bottom)
- Right: Bug Fix Protocol steps (1. Reproduce exact user flow, 2. Fix the code, 3. Verify by replaying user flow)
- Bottom: "Every ticket is verified before Done. No exceptions."

### SprintSummarySlide (teal)
Mock document showing sprint summary structure:
- Header with sprint name
- 4 sections: Completed Tickets (with checkmarks), Docs Updated (file links), Files Modified (mono), QA Results (pass/fail)
- Callout: "Future agents read summaries to understand what was built."

### SkillsEnvironmentsSlide (sky)
Two-column:
- Left: 5 key slash commands as pills (/plan-sprint, /sprint-run, /execute-ticket, /sprint-status, /qa-review)
- Right: Compact environment list (Claude Code: Full, Copilot: Full, Cursor: Full, Windsurf: Partial, JetBrains: Partial, Aider: Basic)
- Bottom: "Same methodology, any AI assistant."

### ViewerSlide (green)
Browser mockup (similar to landing page ViewerSection):
- Top bar with traffic light dots + URL showing `hundia.github.io/autospec/viewer`
- Content: simplified dashboard mockup (stats row + chart bars + spec list)
- Below mockup: 3 feature pills (Specs Browser, Backlog Kanban, Living Docs)
- Link text: "Try it live →"

### FinOpsSlide (amber)
Three-tier model cards:
- Haiku (40%): "Migrations, configs, CRUD" — cheapest
- Sonnet (45%): "Services, components, tests" — balanced
- Opus (15%): "Architecture, security, planning" — premium
- Bottom: Cost comparison "All-Opus: $47/sprint → FinOps: $19/sprint = ~60% savings"

## Data File Format

For slides-en.ts, each new slide needs a data object in the array. Example structure:

```typescript
{
  type: 'sprintLifecycle',
  title: 'The Sprint Lifecycle',
  // ... slide-specific fields matching the component's Props interface
},
```

For slides-he.ts, mirror the EXACT same structure with Hebrew strings. Keep technical terms (Opus, Sonnet, Haiku, E2E, API, CI/CD) in English even in Hebrew version.

## Results Slide Update
In BOTH slides-en.ts and slides-he.ts, update the `results` slide:
- `'16+'` → `'25+'` (sprints completed)
- `'200+'` → `'263'` (tickets executed)

## Mobile Progress Dots Fix (11.15)

Current code in PresentationPage.tsx (line 168-184):
```tsx
<div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
  {slides.map((_, idx) => (
    <button
      key={idx}
      onClick={() => { ... }}
      className={`h-2 rounded-full transition-all ${
        idx === currentSlide ? 'bg-blue-500 w-8' : 'bg-white/30 hover:bg-white/50 w-2'
      }`}
    />
  ))}
</div>
```

At 18 slides this overflows on mobile. Fix: on `sm:` and below, make dots smaller (w-1.5 h-1.5, gap-1) and the active dot w-4 instead of w-8. Use responsive classes.

## Verification
After all changes, run: `cd presentation && npm run build`
Must exit 0 with no TypeScript errors.

## FORBIDDEN
- Do NOT create a `slides/` subdirectory — components go in `presentation/src/components/`
- Do NOT use shadcn, @radix-ui, or any external component library
- Do NOT change existing slide components (except ResultsSlide data)
- Do NOT change the LandingPage (Agent B handles that)
