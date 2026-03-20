# Sprint 11B Brief — Landing Page Enhancements

## Objective
Add 3 new landing page sections (OrchestratorSection, QASection, SprintLifecycleSection) and update LandingPage.tsx to include them. Update StatsSection numbers.

## Tickets
- 11.11: Create OrchestratorSection.tsx
- 11.12: Create QASection.tsx
- 11.13: Create SprintLifecycleSection.tsx
- 11.14: Update LandingPage.tsx + StatsSection numbers

## File Paths
- New components: `presentation/src/components/landing/`
- LandingPage: `presentation/src/pages/LandingPage.tsx`
- StatsSection: `presentation/src/components/landing/StatsSection.tsx`

## Current LandingPage.tsx (EXACT current code)
```tsx
import React from 'react';
import Navigation from '../components/landing/Navigation';
import HeroSection from '../components/landing/HeroSection';
import ProblemSolutionSection from '../components/landing/ProblemSolutionSection';
import CompetitiveSection from '../components/landing/CompetitiveSection';
import RolesSection from '../components/landing/RolesSection';
import SprintMemorySection from '../components/landing/SprintMemorySection';
import ViewerSection from '../components/landing/ViewerSection';
import FinOpsSection from '../components/landing/FinOpsSection';
import StatsSection from '../components/landing/StatsSection';
import CaseStudiesSection from '../components/landing/CaseStudiesSection';
import QuickStartSection from '../components/landing/QuickStartSection';
import ToolsSection from '../components/landing/ToolsSection';
import DocumentationSection from '../components/landing/DocumentationSection';
import Footer from '../components/landing/Footer';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      <Navigation />
      <main>
        <HeroSection />
        <ProblemSolutionSection />
        <CompetitiveSection />
        <RolesSection />
        <SprintMemorySection />
        <ViewerSection />
        <FinOpsSection />
        <StatsSection />
        <CaseStudiesSection />
        <QuickStartSection />
        <ToolsSection />
        <DocumentationSection />
      </main>
      <Footer />
    </div>
  );
}
```

## Target LandingPage order (after 11.14)
Insert new sections in this specific location:
```
<HeroSection />
<ProblemSolutionSection />
<CompetitiveSection />
<RolesSection />
<SprintMemorySection />
<SprintLifecycleSection />     ← NEW (after SprintMemory, before Viewer)
<OrchestratorSection />        ← NEW (after SprintLifecycle, before Viewer)
<QASection />                  ← NEW (after Orchestrator, before Viewer)
<ViewerSection />
<FinOpsSection />
<StatsSection />
...rest unchanged
```

## Landing Section Pattern (MUST FOLLOW)

Every landing section follows this pattern (derived from SprintMemorySection, ViewerSection, etc.):

```tsx
import React from 'react';
import { motion } from 'framer-motion';
import { SomeIcon } from 'lucide-react';

export default function XxxSection() {
  return (
    <section id="xxx" className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1 bg-COLOR-500/10 border border-COLOR-500/20 rounded-full text-sm text-COLOR-400 mb-4">
            <Icon size={14} />
            Section Label
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Title. <span className="bg-gradient-to-r from-X-400 to-Y-400 bg-clip-text text-transparent">Highlighted Part.</span>
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto">
            Description text
          </p>
        </motion.div>

        {/* Content */}
        {/* ... cards, grids, etc with motion.div animations */}
      </div>
    </section>
  );
}
```

Key conventions:
- Section wrapper: `<section id="xxx" className="py-24 px-4 sm:px-6 lg:px-8">`
- Alternating backgrounds: some sections add `bg-slate-900/50`, others are transparent
- Container: `max-w-6xl mx-auto`
- Badge pill at top of each section
- Cards: `bg-white/5 border border-COLOR-500/20 rounded-xl p-6` or `bg-COLOR-500/10`
- Framer Motion: `whileInView` with `viewport={{ once: true }}`
- Staggered animations with delay increments

## Section Content Specifications

### OrchestratorSection (11.11) — id="orchestrator"
Color: indigo/purple gradient
Badge: "Execution Engine"

Content:
- Title: "Opus Plans. Sonnet Builds." + gradient "In Perfect Harmony."
- Description: "The two-tier orchestrator pattern separates planning from implementation..."

Layout: Two-tier visualization
- Top card (full width): "Orchestrator (Opus)" — large card showing:
  - Writes sprint briefs with full context
  - Spawns parallel agents
  - Reviews results and merges
  - Pulsing indigo dot
- Connecting arrows (CSS/borders, dashed)
- Bottom row (grid 3-col): 3 "Agent" cards showing:
  - Agent A: "Backend Sprint" — tickets in mono
  - Agent B: "Frontend Sprint" — tickets in mono
  - Agent C: "QA Sprint" — tickets in mono
  - Each with teal dot

Bottom callout bar: "Main context stays clean. Agents work in isolated worktrees. Knowledge flows up through sprint summaries."

### QASection (11.12) — id="qa"
Color: rose/red gradient
Badge: "Quality Built In"

Content:
- Title: "Every Bug Reproduced." + gradient "Every Fix Verified."
- Description: "AutoSpec's QA methodology ensures nothing ships untested..."

Layout: Two-column
- Left: Test Pyramid
  - 3 stacked horizontal bars of decreasing width
  - Bottom (widest): "Unit / API Tests — 60%" in green
  - Middle: "Integration Tests — 30%" in yellow
  - Top (narrowest): "E2E / Playwright — 10%" in red
  - Animated: bars stack up from bottom

- Right: Bug Fix Protocol
  - 3 numbered steps:
    1. "Reproduce the exact user flow" — before writing any fix
    2. "Fix the code" — targeted, minimal change
    3. "Replay the user flow" — not just the code change
  - Styled like WorkflowSlide steps

Bottom: QA decision table (compact):
| Change Type | QA Required |
|-------------|-------------|
| Bug fix | Reproduce → fix → verify |
| API change | Run API test suite |
| UI change | Playwright E2E |
| New feature | Full test suite |

### SprintLifecycleSection (11.13) — id="lifecycle"
Color: emerald/green gradient
Badge: "The Sprint Engine"

Content:
- Title: "Five Phases." + gradient "Every Sprint."
- Description: "AutoSpec enforces a complete lifecycle for every sprint..."

Layout: 5-phase horizontal pipeline (responsive: vertical on mobile)
- Phase cards in a row, connected by arrows:
  1. Plan (blue) — "PM spec drives ticket creation. Dependencies mapped."
  2. Document (purple) — "Write docs/ BEFORE code. Architecture decisions captured."
  3. Execute (amber) — "Agents implement tickets. Parallel where safe."
  4. QA (rose) — "Test pyramid. Bug fix protocol. No shortcuts."
  5. Summarize (emerald) — "Sprint summary links to docs, files, tests. Future agents read this."

Bottom callout: "This cycle repeats every sprint. Each iteration builds on the last. By Sprint 5, your AI knows more about your project than you do."

## StatsSection Update (11.14)
In `presentation/src/components/landing/StatsSection.tsx`, update the `stats` array (line 6-12):
- `'20+'` → `'25+'` for Sprints Completed
- Keep all other values as-is (263 is already correct)

## Verification
After all changes, the presentation must build: `cd presentation && npm run build`

## FORBIDDEN
- Do NOT modify any slide components (Agent A handles those)
- Do NOT modify PresentationPage.tsx (Agent A handles that)
- Do NOT modify slides-en.ts or slides-he.ts (Agent A handles those)
- Do NOT use shadcn, @radix-ui, or any external component library
- Do NOT add RTL-specific classes (the presentation wrapper handles dir attribute)
