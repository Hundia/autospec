# Sprint 13B Brief — Component Reworks + Wiring

**Agent:** Sonnet
**Sprint:** 13B (24 pts, 8 tickets: 13.8–13.15)
**Theme:** Rework Workflow, Roles, Environment, Orchestrator slides. Wire PresentationPage. Hebrew sync. Final QA.

---

## Ticket 13.8: Rework `WorkflowSlide.tsx` — 7-phase horizontal pipeline

**File:** `presentation/src/components/WorkflowSlide.tsx`

Current: 4-step vertical list. Replace with 7-phase pipeline.

**Desktop:** Horizontal flow with gradient connecting line. Each phase is a compact card showing:
- Phase number (01-07)
- Title
- Time estimate
- Output artifact

Since 7 phases is a lot for horizontal, use a compact card design. Show a gradient line underneath connecting all phases.

**Mobile:** Vertical stack (already works since we wrap).

Data shape (unchanged from 13A):
```typescript
steps: Array<{
  number: string;    // '01' through '07'
  title: string;
  description: string;
  time: string;
  output: string;
}>
```

Design: Blue accent. Each card is compact (smaller than current). Horizontal flow with `flex-wrap` for mobile.  Add a gradient bar across the top/bottom connecting cards. Show description as tooltip or small text. Time + output below.

```typescript
import React from 'react';
import { motion } from 'framer-motion';

interface WorkflowSlideProps {
  data: {
    title: string;
    steps: Array<{
      number: string;
      title: string;
      description: string;
      time: string;
      output: string;
    }>;
  };
  lang: 'en' | 'he';
}

export default function WorkflowSlide({ data, lang }: WorkflowSlideProps) {
  return (
    <div className="max-w-6xl mx-auto w-full">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl sm:text-5xl font-bold text-center mb-10 text-blue-400"
      >
        {data.title}
      </motion.h2>

      {/* Gradient connecting line (desktop) */}
      <div className="hidden md:block relative mb-4">
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.3, duration: 0.8, ease: 'easeOut' }}
          className="h-1 rounded-full origin-left"
          style={{
            background: 'linear-gradient(90deg, #3b82f6 0%, #8b5cf6 35%, #06b6d4 65%, #3b82f6 100%)',
          }}
        />
      </div>

      {/* 7 phases */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {data.steps.map((step, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + idx * 0.08 }}
            className="bg-white/5 border border-blue-500/20 rounded-xl p-3 flex flex-col"
          >
            <div className="text-2xl font-bold text-blue-400 mb-1">{step.number}</div>
            <h3 className="text-sm font-semibold text-white mb-1 leading-tight">{step.title}</h3>
            <p className="text-xs text-white/50 mb-2 flex-1 leading-relaxed">{step.description}</p>
            <div className="text-xs space-y-0.5 pt-2 border-t border-white/10">
              <div className="text-blue-300">⏱️ {step.time}</div>
              <div className="text-green-300">📄 {step.output}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
```

---

## Ticket 13.9: Rework `RolesSlide.tsx` — Role≠Agent + agent lanes

**File:** `presentation/src/components/RolesSlide.tsx`

Current: Simple 2x5 grid of role cards + insight. Add agent distinction section.

New data shape (from 13A):
```typescript
{
  title: string;
  description: string;  // "Roles are perspectives for WRITING specifications"
  roles: Array<{
    num: string;
    name: string;
    focus: string;
    specFile: string;  // NEW: e.g. 'specs/01_product_manager.md'
  }>;
  agentDistinction: {   // NEW section
    subtitle: string;   // "A role is a job description. An agent is the employee..."
    lanes: Array<{
      agent: string;    // 'Opus Orchestrator'
      roles: string[];  // ['Product Manager', 'Business Lead']
    }>;
  };
  insight: string;
}
```

Layout — two visual sections:

**UPPER: "10 Specification Roles"** — 2x5 grid of role cards (as before). Each card now also shows `specFile` in small monospace text. Purple accent.

**LOWER: "Agents Wear These Roles"** — 3 horizontal agent swim lanes:
- Lane 1: "Opus Orchestrator" → Product Manager, Business Lead
- Lane 2: "Sonnet Agent A" → Backend Lead, DB Architect, DevOps Lead
- Lane 3: "Sonnet Agent B" → Frontend Lead, QA Lead, UI Designer

Each lane is a horizontal bar with the agent name on the left and role badges on the right.

Between upper and lower sections, show `agentDistinction.subtitle` text.

Keep the `insight` at the very bottom.

```typescript
import React from 'react';
import { motion } from 'framer-motion';

interface RolesSlideProps {
  data: {
    title: string;
    description: string;
    roles: Array<{
      num: string;
      name: string;
      focus: string;
      specFile?: string;
    }>;
    agentDistinction?: {
      subtitle: string;
      lanes: Array<{
        agent: string;
        roles: string[];
      }>;
    };
    insight: string;
  };
  lang: 'en' | 'he';
}

const laneColors = [
  { bg: 'bg-indigo-500/10', border: 'border-indigo-500/30', text: 'text-indigo-300', badge: 'bg-indigo-500/20 text-indigo-200' },
  { bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-300', badge: 'bg-blue-500/20 text-blue-200' },
  { bg: 'bg-violet-500/10', border: 'border-violet-500/30', text: 'text-violet-300', badge: 'bg-violet-500/20 text-violet-200' },
];

export default function RolesSlide({ data, lang }: RolesSlideProps) {
  return (
    <div className="max-w-6xl mx-auto w-full">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl sm:text-5xl font-bold text-center mb-2 text-purple-400"
      >
        {data.title}
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="text-center text-white/60 mb-6 text-sm"
      >
        {data.description}
      </motion.p>

      {/* UPPER: 2x5 role cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-6">
        {data.roles.map((role, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 + idx * 0.04 }}
            className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-lg p-2.5 text-center hover:scale-105 transition-transform"
          >
            <div className="text-purple-400 font-mono text-xs mb-0.5">{role.num}</div>
            <h3 className="text-white font-semibold text-xs mb-0.5">{role.name}</h3>
            <p className="text-white/50 text-[10px]">{role.focus}</p>
            {role.specFile && (
              <p className="text-purple-400/50 text-[9px] font-mono mt-1 truncate">{role.specFile}</p>
            )}
          </motion.div>
        ))}
      </div>

      {/* LOWER: Agent swim lanes */}
      {data.agentDistinction && (
        <>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center text-white/50 text-xs mb-4 italic"
          >
            {data.agentDistinction.subtitle}
          </motion.p>

          <div className="space-y-2 mb-4">
            {data.agentDistinction.lanes.map((lane, idx) => {
              const colors = laneColors[idx % laneColors.length];
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + idx * 0.1 }}
                  className={`flex items-center gap-3 ${colors.bg} border ${colors.border} rounded-lg px-4 py-2`}
                >
                  <div className="flex items-center gap-2 flex-shrink-0 min-w-[160px]">
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    <span className={`text-sm font-bold ${colors.text}`}>{lane.agent}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {lane.roles.map((role, ri) => (
                      <span key={ri} className={`text-xs px-2 py-0.5 rounded-full ${colors.badge}`}>
                        {role}
                      </span>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </>
      )}

      {/* Insight */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="text-center"
      >
        <p className="text-sm text-purple-300 bg-purple-500/10 border border-purple-500/30 rounded-lg px-5 py-2.5 inline-block">
          {data.insight}
        </p>
      </motion.div>
    </div>
  );
}
```

---

## Ticket 13.10: Create `EnvironmentProofSlide.tsx`

**File:** `presentation/src/components/EnvironmentProofSlide.tsx` (NEW)

Replaces SkillsEnvironmentsSlide for the `environmentProof` type key.

Data shape (from 13A):
```typescript
{
  title: string;
  environments: Array<{
    name: string;      // 'Claude Code', 'GitHub Copilot', 'Air-Gapped / Continue'
    accent: string;    // 'cyan', 'purple', 'amber'
    mockup: string;    // 'terminal', 'ide', 'local'
    commands: string[];
  }>;
  callout: string;      // 'Same CLAUDE.md. Same specs/. Same methodology.'
  bottomText: string;   // 'Works in any environment — even without internet.'
}
```

Three environment cards in a row. Each card is a "mockup":
- Terminal mockup: dark bg with monospace lines showing commands
- IDE mockup: slightly different header (3 dots like IDE window)
- Local mockup: similar to terminal but with a different icon/header

Each card colored by its accent:
- cyan → Claude Code: `border-cyan-500/30`, `text-cyan-400`
- purple → GitHub Copilot: `border-purple-500/30`, `text-purple-400`
- amber → Air-Gapped: `border-amber-500/30`, `text-amber-400`

Center callout between cards: prominent text.
Bottom: `bottomText`.

```typescript
import React from 'react';
import { motion } from 'framer-motion';

interface EnvironmentProofSlideProps {
  data: {
    title: string;
    environments: Array<{
      name: string;
      accent: string;
      mockup: string;
      commands: string[];
    }>;
    callout: string;
    bottomText: string;
  };
  lang: 'en' | 'he';
}

const accentMap: Record<string, { border: string; text: string; bg: string; dot: string }> = {
  cyan: { border: 'border-cyan-500/30', text: 'text-cyan-400', bg: 'bg-cyan-500/5', dot: 'bg-cyan-400' },
  purple: { border: 'border-purple-500/30', text: 'text-purple-400', bg: 'bg-purple-500/5', dot: 'bg-purple-400' },
  amber: { border: 'border-amber-500/30', text: 'text-amber-400', bg: 'bg-amber-500/5', dot: 'bg-amber-400' },
};

export default function EnvironmentProofSlide({ data, lang }: EnvironmentProofSlideProps) {
  return (
    <div className="max-w-6xl mx-auto w-full">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl sm:text-5xl font-bold text-center mb-10 text-sky-400"
      >
        {data.title}
      </motion.h2>

      {/* Three environment cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {data.environments.map((env, idx) => {
          const colors = accentMap[env.accent] || accentMap.cyan;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + idx * 0.15 }}
              className={`rounded-xl border ${colors.border} ${colors.bg} overflow-hidden`}
            >
              {/* Mockup title bar */}
              <div className="flex items-center gap-2 px-4 py-2 bg-black/30 border-b border-white/10">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400/70" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/70" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-400/70" />
                </div>
                <span className={`text-xs font-medium ${colors.text} ml-2`}>{env.name}</span>
              </div>
              {/* Mockup content */}
              <div className="p-4 font-mono text-xs space-y-1.5">
                {env.commands.map((cmd, ci) => (
                  <motion.div
                    key={ci}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + idx * 0.15 + ci * 0.1 }}
                    className="text-white/70"
                  >
                    {cmd}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Center callout */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8 }}
        className="text-center mb-4"
      >
        <p className="text-lg font-semibold text-white bg-white/5 border border-sky-500/30 rounded-xl px-6 py-4 inline-block">
          {data.callout}
        </p>
      </motion.div>

      {/* Bottom text */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="text-center text-white/50 text-sm"
      >
        {data.bottomText}
      </motion.p>
    </div>
  );
}
```

---

## Ticket 13.11: Minor rework `OrchestratorSlide.tsx`

**File:** `presentation/src/components/OrchestratorSlide.tsx`

The data now has:
- `orchestrator.name` = "Product Manager (Opus)" instead of "Opus Orchestrator"
- `orchestrator.subtitle` = "The orchestrator is an AI agent with the PM role from specs/01_product_manager.md" (NEW)
- `orchestrator.tasks` now has 4 items (added "Sequences sprints by dependency graph")

Changes to the component:
1. Display `data.orchestrator.subtitle` as smaller text below the name in the orchestrator card
2. The rest stays the same

Update the interface:
```typescript
orchestrator: {
  name: string;
  subtitle?: string;  // NEW
  tasks: string[];
};
```

Add after the orchestrator name `<h3>`:
```tsx
{data.orchestrator.subtitle && (
  <p className="text-xs text-indigo-300/70 mb-3 max-w-md mx-auto">{data.orchestrator.subtitle}</p>
)}
```

---

## Ticket 13.12: Update `PresentationPage.tsx`

**File:** `presentation/src/pages/PresentationPage.tsx`

Changes:
1. Import `EnvironmentProofSlide` from `'../components/EnvironmentProofSlide'`
2. Remove the `SkillsEnvironmentsSlide` import
3. Remove the `skillsEnvironments` key from the map
4. Change `environmentProof: SkillsEnvironmentsSlide` placeholder to `environmentProof: EnvironmentProofSlide`

The final slideComponents map should have exactly 29 entries:
```
title, eraTraditional, eraAssistant, eraAgentic, contextPoisoning, reverseTax, breakingPoint, bridge, sddMethodology, solution, docsFolder, workflow, roles, ticketExecution, sprintLifecycle, backlog, orchestrator, multiagent, qaMethodology, sprintSummary, modelOptimization, environmentProof, viewer, example, results, demo, beforeAfter, closing, finalTagline
```

No `skillsEnvironments` key.

---

## Ticket 13.13: Update `slides-he.ts` for Sprint 13B changes

**File:** `presentation/src/data/slides-he.ts`

The data shapes already match from 13.2. The components in 13B (WorkflowSlide, RolesSlide, etc.) read from the same data. No additional data changes needed — the Hebrew file was fully updated in 13.2.

**Verify:** Open `slides-he.ts` and confirm:
- Workflow has 7 steps in Hebrew
- Roles has `specFile` and `agentDistinction` with Hebrew translations
- Orchestrator has `subtitle` in Hebrew
- `environmentProof` entry exists with Hebrew translations

If any Hebrew data is missing, add it. (It should all be there from 13.2.)

---

## Ticket 13.14: Final build + QA

1. Run `cd /opt/FitnessAiManager/autospec/presentation && npm run build` — must exit 0
2. Verify exactly 29 type keys in both data files
3. Verify slideComponents map has no orphan imports
4. Verify no `skillsEnvironments` references remain

---

## Ticket 13.15: Delete `SkillsEnvironmentsSlide.tsx`

After ticket 13.12 removes the import, delete the file:
`presentation/src/components/SkillsEnvironmentsSlide.tsx`

Then re-run build to verify no broken imports.

---

## Working Directory

All files are relative to `/opt/FitnessAiManager/autospec/presentation/`.

## IMPORTANT

- Write ALL code completely — do not just describe changes
- Run `npm run build` after completing all changes
- Ensure no TypeScript errors
