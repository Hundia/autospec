# Sprint 27 Agent Brief — Landing Page Redesign

**Sprint:** 27 — Elegant, Minimal, Inviting
**Date:** 2026-03-20
**Repo:** `/opt/FitnessAiManager/autospec/`
**Presentation app:** `/opt/FitnessAiManager/autospec/presentation/src/`

---

## Mission

Strip the AutoSpec landing page from 22 sections to 7. The new page order is:
`Navigation → Hero → ProblemSection (NEW) → ThreePillars → Pipeline → Viewer → QuickStart → Footer`

This brief contains everything an agent needs — exact file paths, current source, required changes, and forbidden actions.

---

## Critical Rules

- **Dark theme ONLY** — `bg-slate-950`, white text. Do NOT use the parchment/sage palette from the viewer.
- **Preserve conversation animation in HeroSection VERBATIM** — do not touch `CONVERSATION_LINES`, `useConversationAnimation`, timing constants, or animation logic.
- **Use existing Framer Motion patterns** — `initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}` with `delay: index * 0.1` stagger.
- **No new dependencies** — only `react`, `framer-motion`, `lucide-react` are available.
- **Update `specs/backlog.md`** ticket status: 🔲 → ✅ for completed tickets.

---

## Agent A — Ticket 27.1: Create `ProblemSection.tsx`

**File to create:** `presentation/src/components/landing/ProblemSection.tsx`

### What to build

A 2-column dark-theme section. Left = problem statement. Right = static degradation timeline.

**Timeline data** (extracted from existing `ContextPoisoningSection.tsx`):
```ts
const timelineStages = [
  { turn: 'Turn 1',   status: 'Clean',         color: 'green',  snippet: 'Use PostgreSQL with Prisma ORM' },
  { turn: 'Turn 25',  status: 'Drift',          color: 'yellow', snippet: "Actually, let's try MongoDB here..." },
  { turn: 'Turn 50',  status: 'Contradiction',  color: 'orange', snippet: "Wait, we're using Prisma right?" },
  { turn: 'Turn 100', status: 'Chaos',          color: 'red',    snippet: 'TypeError: Cannot read undefined' },
];

const colorMap = {
  green:  { dot: 'bg-green-400',  border: 'border-green-500/40',  text: 'text-green-400',  bg: 'bg-green-500/10' },
  yellow: { dot: 'bg-yellow-400', border: 'border-yellow-500/40', text: 'text-yellow-400', bg: 'bg-yellow-500/10' },
  orange: { dot: 'bg-orange-400', border: 'border-orange-500/40', text: 'text-orange-400', bg: 'bg-orange-500/10' },
  red:    { dot: 'bg-red-400',    border: 'border-red-500/40',    text: 'text-red-400',    bg: 'bg-red-500/10' },
};
```

**Symptom chips (3 items):**
- "AI rewrites already-decided architecture"
- "Decisions from Sprint 1 vanish by Sprint 3"
- "Each new agent starts from zero"

**Complete component to write:**

```tsx
import React from 'react';
import { motion } from 'framer-motion';

const timelineStages = [
  { turn: 'Turn 1',   status: 'Clean',        color: 'green',  snippet: 'Use PostgreSQL with Prisma ORM' },
  { turn: 'Turn 25',  status: 'Drift',         color: 'yellow', snippet: "Actually, let's try MongoDB here..." },
  { turn: 'Turn 50',  status: 'Contradiction', color: 'orange', snippet: "Wait, we're using Prisma right?" },
  { turn: 'Turn 100', status: 'Chaos',         color: 'red',    snippet: 'TypeError: Cannot read undefined' },
];

const colorMap: Record<string, { dot: string; border: string; text: string; bg: string }> = {
  green:  { dot: 'bg-green-400',  border: 'border-green-500/40',  text: 'text-green-400',  bg: 'bg-green-500/10' },
  yellow: { dot: 'bg-yellow-400', border: 'border-yellow-500/40', text: 'text-yellow-400', bg: 'bg-yellow-500/10' },
  orange: { dot: 'bg-orange-400', border: 'border-orange-500/40', text: 'text-orange-400', bg: 'bg-orange-500/10' },
  red:    { dot: 'bg-red-400',    border: 'border-red-500/40',    text: 'text-red-400',    bg: 'bg-red-500/10' },
};

const symptomChips = [
  'AI rewrites already-decided architecture',
  'Decisions from Sprint 1 vanish by Sprint 3',
  'Each new agent starts from zero',
];

export default function ProblemSection() {
  return (
    <section
      id="problem"
      data-testid="problem-section"
      className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-950"
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left: Problem statement */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block px-4 py-1 bg-red-500/10 border border-red-500/20 rounded-full text-sm text-red-400 mb-6">
              The Problem
            </span>

            <h2
              id="problem-heading"
              className="text-3xl sm:text-4xl font-bold text-white mb-4 leading-tight"
            >
              Long AI conversations{' '}
              <span className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                corrupt themselves
              </span>
            </h2>

            <p className="text-white/60 leading-relaxed mb-4 max-w-lg">
              By message 40, your AI is contradicting decisions it made in message 10.
            </p>

            <p className="text-white/50 leading-relaxed mb-8 max-w-lg text-sm">
              Every message adds to the context window. After enough turns, the AI forgets
              earlier decisions, contradicts itself, and drifts from your original intent.
              There is no memory. There is no continuity.
            </p>

            <div
              className="flex flex-wrap gap-3"
              role="list"
              aria-label="Symptoms of context degradation"
            >
              {symptomChips.map((chip, i) => (
                <motion.span
                  key={i}
                  role="listitem"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 0.2 + i * 0.08 }}
                  className="bg-orange-500/10 border border-orange-500/20 text-orange-300 text-sm px-3 py-1.5 rounded-lg"
                >
                  {chip}
                </motion.span>
              ))}
            </div>
          </motion.div>

          {/* Right: Degradation timeline */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            data-testid="degradation-timeline"
            aria-label="Context degradation timeline"
          >
            <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-6">
              <h3 className="text-sm font-semibold text-white/70 mb-6 uppercase tracking-wider">
                Context Degradation
              </h3>

              <div className="relative pl-8">
                {/* Vertical connector line */}
                <div
                  className="absolute left-3 top-4 bottom-4 w-px border-l-2 border-dashed border-white/10"
                  aria-hidden="true"
                />

                <div className="space-y-5">
                  {timelineStages.map((stage, index) => {
                    const colors = colorMap[stage.color];
                    return (
                      <motion.div
                        key={stage.turn}
                        initial={{ opacity: 0, x: 16 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: 0.3 + index * 0.12 }}
                        className="relative"
                        data-testid={`degradation-node-${index}`}
                      >
                        {/* Dot on the line */}
                        <div
                          className={`absolute -left-8 top-4 w-2.5 h-2.5 rounded-full ${colors.dot} ring-4 ring-slate-950`}
                          aria-hidden="true"
                        />

                        <div className={`border ${colors.border} ${colors.bg} rounded-xl p-4`}>
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className={`text-xs font-mono ${colors.text}`}>{stage.turn}</span>
                            <span className={`text-xs px-2 py-0.5 rounded-full border ${colors.border} ${colors.text} ${colors.bg}`}>
                              {stage.status}
                            </span>
                          </div>
                          <div className={`text-xs font-mono px-3 py-2 rounded-lg border ${colors.border} ${colors.bg} ${colors.text} break-words`}>
                            "{stage.snippet}"
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
```

**After writing the file, update `specs/backlog.md` ticket 27.1 status to ✅.**

---

## Agent B — Tickets 27.2 + 27.3 + 27.4: Fix Dead Anchors

### Ticket 27.2 — `Navigation.tsx`

**File:** `presentation/src/components/landing/Navigation.tsx`

**Current `navLinks` array (lines 5-12):**
```ts
const navLinks = [
  { name: 'Docs', href: '#docs', icon: BookOpen },
  { name: 'Quick Start', href: '#quickstart', icon: Zap },
  { name: 'Examples', href: '#examples', icon: Code2 },
  { name: 'Paper', href: '#/paper', icon: FileText },
  { name: 'Presentation', href: '#/presentation', icon: Play },
  { name: 'Viewer', href: './viewer/', icon: Monitor },
];
```

**Replace with:**
```ts
const navLinks = [
  { name: 'How It Works', href: '#how-it-works', icon: Zap },
  { name: 'Quick Start', href: '#quickstart', icon: Terminal },
  { name: 'Viewer', href: './viewer/', icon: Monitor },
  { name: 'Presentation', href: '#/presentation', icon: Play },
];
```

Also update the import line — remove `BookOpen, Code2, FileText` and add `Terminal`:
```ts
import { Menu, X, Github, Terminal, Zap, Monitor, Play } from 'lucide-react';
```

Add `focus-visible` ring to the desktop nav link `<a>` className:
```
className="px-4 py-2 text-sm text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-all flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
```

### Ticket 27.3 — `Footer.tsx`

**File:** `presentation/src/components/landing/Footer.tsx`

**Current `footerLinks` (lines 5-23):**
```ts
const footerLinks = {
  product: [
    { label: 'Documentation', href: '#docs' },
    { label: 'Interactive Viewer', href: '#viewer' },
    { label: 'FinOps Guide', href: '#finops' },
    { label: 'Changelog', href: '#' },
  ],
  resources: [
    { label: 'Getting Started', href: '#quickstart' },
    { label: 'The 10 Roles', href: '#roles' },
    { label: 'Sprint Memory', href: '#memory' },
    { label: 'Academic Paper', href: '#/paper' },
  ],
  ...
};
```

**Replace with:**
```ts
const footerLinks = {
  product: [
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Interactive Viewer', href: './viewer/' },
    { label: 'Presentation', href: '#/presentation' },
    { label: 'Changelog', href: '#' },
  ],
  resources: [
    { label: 'Getting Started', href: '#quickstart' },
    { label: 'Academic Paper', href: '#/paper' },
    { label: 'GitHub Template', href: 'https://github.com/Hundia/autospec-starter', external: true },
    { label: 'Contributing', href: 'https://github.com/Hundia/autospec', external: true },
  ],
  community: [  // keep existing community section unchanged
    { label: 'GitHub', href: 'https://github.com/Hundia/autospec', external: true },
    { label: 'Discord', href: '#', external: true },
    { label: 'Contributing', href: '#', external: true },
    { label: 'Report Issue', href: '#', external: true },
  ],
};
```

### Ticket 27.4 — `QuickStartSection.tsx`

**File:** `presentation/src/components/landing/QuickStartSection.tsx`

Find the root `<section` element and add `id="quickstart"` to it. The section currently starts with something like:
```tsx
<section className="py-24 ...">
```
Change to:
```tsx
<section id="quickstart" className="py-24 ...">
```

**After all 3 fixes, update `specs/backlog.md` tickets 27.2, 27.3, 27.4 status to ✅.**

---

## Agent C — Tickets 27.5 + 27.8: Hero + ThreePillars Copy Changes

### Ticket 27.5 — `HeroSection.tsx`

**File:** `presentation/src/components/landing/HeroSection.tsx`

**CRITICAL: Do NOT touch any of these — preserve exactly:**
- `CONVERSATION_LINES` array (lines 12-29)
- `CHAR_DELAY`, `LINE_DELAY`, `PAUSE_AFTER`, `RESET_PAUSE` constants
- `useConversationAnimation` hook (lines 38-85)
- The entire right column (terminal window JSX)
- The install command string: `'gh repo create my-project --template Hundia/autospec-starter'`

**Change 1 — Subtitle text (lines 176-179):**

Current:
```tsx
Your AI assistant generates{' '}
<span className="text-white font-medium">10 expert specifications, a sprint backlog, and living docs</span>{' '}
— from a single prompt.
```

Replace with:
```tsx
Drop in your requirements. Get a complete AI-ready project structure —{' '}
<span className="text-white font-medium">specs, backlog, and living docs</span>{' '}
— in under 5 minutes.
```

**Change 2 — Remove Social Proof block (lines 236-257):**

Find and DELETE this entire `<motion.div>` block:
```tsx
{/* Social Proof */}
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5, delay: 0.5 }}
  className="flex flex-wrap items-center gap-6 text-sm text-white/40"
>
  <div className="flex items-center gap-2">
    <span className="text-2xl font-bold text-white">25+</span>
    <span>Sprints Completed</span>
  </div>
  <div className="w-px h-6 bg-white/20 hidden sm:block" />
  <div className="flex items-center gap-2">
    <span className="text-2xl font-bold text-white">263</span>
    <span>Tickets Executed</span>
  </div>
  <div className="w-px h-6 bg-white/20 hidden sm:block" />
  <div className="flex items-center gap-2">
    <span className="text-2xl font-bold text-white">~60%</span>
    <span>Cost Savings</span>
  </div>
</motion.div>
```

**Change 3 — Add presentation text link AFTER the CTA buttons `</motion.div>` (around line 234):**

The CTA buttons block ends with `</motion.div>`. After that closing tag, add:
```tsx
{/* Presentation link */}
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.5, delay: 0.55 }}
  className="mt-4"
  data-testid="hero-presentation-link"
>
  <a
    href="#/presentation"
    className="text-sm text-white/40 hover:text-white/70 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
  >
    → See the full presentation
  </a>
</motion.div>
```

Also change the CTA buttons `<motion.div>` className from `mb-12` to `mb-6` (since we're adding the text link below instead of the stat row).

### Ticket 27.8 — `ThreePillarsSection.tsx`

**File:** `presentation/src/components/landing/ThreePillarsSection.tsx`

**Change 1 — Update `pillars[0]` (Specs as Code) description:**

Current:
```ts
description: 'Every decision lives in a .md file in specs/. Not in chat logs, not in your head — in version-controlled files that any agent can read.',
```

Replace with:
```ts
description: 'Every decision lives in a .md file in specs/. Not in chat logs, not in your head — in version-controlled files that any agent can read. Add AutoSpec to an existing project — your CLAUDE.md enforces conventions for every AI contributor, human or agent.',
```

**Change 2 — Update `pillars[1]` (Sprint Summaries) description:**

Current:
```ts
description: 'Every sprint ends with a summary: what was built, what changed, what was decided. The next agent picks up exactly where you left off.',
```

Replace with:
```ts
description: 'Every sprint ends with a summary: what was built, what changed, what was decided. The next agent picks up exactly where you left off. Sprint summaries become your audit trail for compliance reviews.',
```

**Change 3 — Add a CTA below the bottom callout quote block:**

After the closing `</motion.div>` of the bottom callout section, add:
```tsx
{/* Viewer CTA */}
<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.5, delay: 0.2 }}
  className="text-center mt-8"
>
  <a
    href="./viewer/"
    className="inline-flex items-center gap-2 px-6 py-3 bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/30 text-teal-400 font-medium rounded-lg transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
  >
    See it in action →
  </a>
</motion.div>
```

**After both changes, update `specs/backlog.md` tickets 27.5, 27.8 to ✅.**

---

## Agent D — Ticket 27.6: Rewrite `PipelineSection.tsx`

**File:** `presentation/src/components/landing/PipelineSection.tsx`

Replace the entire file content with the 4-phase horizontal stepper below.

**Keep unchanged:** The section wrapper pattern, the header pattern, and the bottom callout quote.

**The 4 phases:**
```ts
const phases = [
  {
    num: '01',
    title: 'Foundation',
    subtitle: 'Specs, docs, and skills',
    time: '~2 hours',
    output: 'specs/*.md · docs/ · .claude/commands/',
    color: 'blue',
    description: 'Write your requirements once. AI generates 10 role specs, 50+ doc files, and CLI skills — everything your agents need to stay aligned.',
  },
  {
    num: '02',
    title: 'Visualize',
    subtitle: 'Build & review the Viewer',
    time: '~5 minutes',
    output: 'viewer/ (live dashboard)',
    color: 'amber',
    description: 'Before writing a line of code, review your entire project visually. Specs, backlog, and architecture — all in one browsable interface.',
  },
  {
    num: '03',
    title: 'Build',
    subtitle: 'Execute sprints iteratively',
    time: '2–4 hours/sprint',
    output: 'Working features + docs/',
    color: 'indigo',
    description: 'Parallel agents without collisions. Each agent owns its ticket, traces back to a spec, and updates the docs when done.',
  },
  {
    num: '04',
    title: 'Close',
    subtitle: 'Summarize & repeat',
    time: '~5 minutes/sprint',
    output: 'sprints/sprint-X/summary.md',
    color: 'teal',
    description: 'Sprint close writes the summary automatically. Next session, any agent picks up with full context — no re-explaining, no drift.',
  },
];

const phaseColors: Record<string, { border: string; bg: string; text: string; connector: string }> = {
  blue:  { border: 'border-blue-500/30',  bg: 'bg-blue-500/10',  text: 'text-blue-400',  connector: 'bg-blue-500/20' },
  amber: { border: 'border-amber-500/30', bg: 'bg-amber-500/10', text: 'text-amber-400', connector: 'bg-amber-500/20' },
  indigo:{ border: 'border-indigo-500/30',bg: 'bg-indigo-500/10',text: 'text-indigo-400',connector: 'bg-indigo-500/20' },
  teal:  { border: 'border-teal-500/30',  bg: 'bg-teal-500/10',  text: 'text-teal-400',  connector: 'bg-teal-500/20' },
};
```

**Complete new file:**

```tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Clock, FileText, ArrowRight } from 'lucide-react';

const phases = [
  {
    num: '01',
    title: 'Foundation',
    subtitle: 'Specs, docs, and skills',
    time: '~2 hours',
    output: 'specs/*.md · docs/ · .claude/commands/',
    color: 'blue',
    description: 'Write your requirements once. AI generates 10 role specs, 50+ doc files, and CLI skills — everything your agents need to stay aligned.',
  },
  {
    num: '02',
    title: 'Visualize',
    subtitle: 'Build & review the Viewer',
    time: '~5 minutes',
    output: 'viewer/ (live dashboard)',
    color: 'amber',
    description: 'Before writing a line of code, review your entire project visually. Specs, backlog, and architecture — all in one browsable interface.',
  },
  {
    num: '03',
    title: 'Build',
    subtitle: 'Execute sprints iteratively',
    time: '2–4 hrs/sprint',
    output: 'Working features + docs/',
    color: 'indigo',
    description: 'Parallel agents without collisions. Each agent owns its ticket, traces back to a spec, and updates the docs when done.',
  },
  {
    num: '04',
    title: 'Close',
    subtitle: 'Summarize & repeat',
    time: '~5 min/sprint',
    output: 'sprints/sprint-X/summary.md',
    color: 'teal',
    description: 'Sprint close writes the summary automatically. Next session, any agent picks up with full context — no re-explaining, no drift.',
  },
];

const phaseColors: Record<string, { border: string; bg: string; text: string }> = {
  blue:   { border: 'border-blue-500/30',   bg: 'bg-blue-500/10',   text: 'text-blue-400' },
  amber:  { border: 'border-amber-500/30',  bg: 'bg-amber-500/10',  text: 'text-amber-400' },
  indigo: { border: 'border-indigo-500/30', bg: 'bg-indigo-500/10', text: 'text-indigo-400' },
  teal:   { border: 'border-teal-500/30',   bg: 'bg-teal-500/10',   text: 'text-teal-400' },
};

export default function PipelineSection() {
  return (
    <section
      id="how-it-works"
      data-testid="pipeline-section"
      className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-950"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-sm text-blue-400 mb-4">
            How It Works
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            From Requirements to Running Code
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto">
            Four phases. Full traceability. Every artifact version-controlled.
          </p>
        </motion.div>

        {/* Desktop: horizontal stepper */}
        <div className="hidden lg:flex items-stretch gap-3 mb-16">
          {phases.map((phase, index) => {
            const colors = phaseColors[phase.color];
            return (
              <React.Fragment key={phase.num}>
                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className={`relative flex-1 min-w-0 flex flex-col border ${colors.border} ${colors.bg} rounded-2xl p-6 overflow-hidden`}
                  data-testid={`pipeline-phase-${index}`}
                >
                  {/* Faded number watermark */}
                  <span className={`absolute -bottom-3 -right-2 text-8xl font-black opacity-[0.07] ${colors.text} select-none leading-none`}>
                    {phase.num}
                  </span>

                  {/* Phase label */}
                  <div className={`text-xs font-semibold uppercase tracking-widest ${colors.text} mb-1`}>
                    Phase {phase.num}
                  </div>

                  {/* Title */}
                  <h3 className="text-white font-bold text-lg mb-1">{phase.title}</h3>
                  <p className={`text-xs ${colors.text} mb-4`}>{phase.subtitle}</p>

                  {/* Description */}
                  <p className="text-white/55 text-xs leading-relaxed mb-4 flex-1">{phase.description}</p>

                  {/* Time */}
                  <div className={`flex items-center gap-1.5 text-xs ${colors.text} mb-3`}>
                    <Clock size={11} className="shrink-0" />
                    <span>{phase.time}</span>
                  </div>

                  {/* Output artifact */}
                  <div className={`flex items-start gap-1.5 px-3 py-2 rounded-lg border ${colors.border} ${colors.bg}`}>
                    <FileText size={11} className={`shrink-0 mt-0.5 ${colors.text}`} />
                    <code className={`text-xs font-mono ${colors.text} break-all leading-tight min-w-0`}>{phase.output}</code>
                  </div>
                </motion.div>

                {/* Connector arrow between phases */}
                {index < phases.length - 1 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                    className="flex-shrink-0 flex items-center justify-center w-6"
                    aria-hidden="true"
                  >
                    <ArrowRight size={18} className="text-white/20" />
                  </motion.div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Mobile: vertical stack */}
        <div className="flex lg:hidden flex-col gap-4 mb-16">
          {phases.map((phase, index) => {
            const colors = phaseColors[phase.color];
            return (
              <motion.div
                key={phase.num}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className={`relative border-l-4 ${colors.border} ${colors.bg} rounded-xl p-5 min-w-0`}
                data-testid={`pipeline-phase-${index}`}
              >
                <div className={`text-xs font-semibold uppercase tracking-widest ${colors.text} mb-1`}>
                  Phase {phase.num} · {phase.time}
                </div>
                <h3 className="text-white font-bold mb-1">{phase.title}</h3>
                <p className="text-white/55 text-sm leading-relaxed mb-3">{phase.description}</p>
                <div className={`flex items-start gap-1.5 px-3 py-2 rounded-lg border ${colors.border} ${colors.bg}`}>
                  <FileText size={11} className={`shrink-0 mt-0.5 ${colors.text}`} />
                  <code className={`text-xs font-mono ${colors.text} break-all leading-tight min-w-0`}>{phase.output}</code>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom callout — preserved from original */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="inline-block bg-gradient-to-br from-slate-800/60 to-slate-900/60 border border-white/10 rounded-2xl px-8 py-6 max-w-2xl">
            <p className="text-white/70 text-lg italic leading-relaxed">
              "The developer who reviews before coding ships faster than the one who codes before thinking."
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
```

**After writing the file, update `specs/backlog.md` ticket 27.6 to ✅.**

---

## Agent E — Ticket 27.7: Simplify `ViewerSection.tsx`

**File:** `presentation/src/components/landing/ViewerSection.tsx`

**Keep unchanged:**
- Section wrapper, `max-w-6xl mx-auto`, header block (badge + h2 + p)
- Right column: the entire browser mockup (lines 98-169)
- CTA section at the bottom (lines 172-195, the "Explore the Live Viewer" button + stakeholder note)

**Replace:** The entire left column `<motion.div>` (lines 71-96) with 3 benefit blocks:

```tsx
{/* Left: 3 benefit blocks */}
<motion.div
  initial={{ opacity: 0, x: -20 }}
  whileInView={{ opacity: 1, x: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.5 }}
  className="space-y-8 flex flex-col justify-center"
  data-testid="viewer-benefits"
>
  {[
    {
      heading: 'One URL for your entire project',
      body: 'Specs, sprint history, architecture diagrams, and docs — all in a single browsable interface. Bookmark it. Share it with stakeholders.',
    },
    {
      heading: 'Non-technical teammates can follow along',
      body: 'No IDE. No git. No command line. Anyone on the team can see what was decided, what was built, and what comes next.',
    },
    {
      heading: 'Auto-generated from your markdown',
      body: 'Run one command. The Viewer reads your specs/ and docs/ directories and renders everything — no configuration required.',
    },
  ].map((benefit, i) => (
    <motion.div
      key={i}
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: i * 0.12 }}
      className="border-l-2 border-cyan-500/40 pl-5"
      data-testid={`viewer-benefit-${i}`}
    >
      <h3 className="text-white font-semibold mb-1">{benefit.heading}</h3>
      <p className="text-white/55 text-sm leading-relaxed">{benefit.body}</p>
    </motion.div>
  ))}
</motion.div>
```

**Also remove the unused icon imports** (`BarChart3, Search, TrendingDown, GitBranch, Code2, Palette`) from the import line. Keep `Monitor, Users, ExternalLink`.

**After writing the file, update `specs/backlog.md` ticket 27.7 to ✅.**

---

## Agent F — Ticket 27.9: Rewrite `LandingPage.tsx`

**File:** `presentation/src/pages/LandingPage.tsx`

**Run this AFTER Agents A, B, C, D, E are all complete.**

Replace the entire file with:

```tsx
import React from 'react';
import Navigation from '../components/landing/Navigation';
import HeroSection from '../components/landing/HeroSection';
import ProblemSection from '../components/landing/ProblemSection';
import ThreePillarsSection from '../components/landing/ThreePillarsSection';
import PipelineSection from '../components/landing/PipelineSection';
import ViewerSection from '../components/landing/ViewerSection';
import QuickStartSection from '../components/landing/QuickStartSection';
import Footer from '../components/landing/Footer';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      <Navigation />
      <main>
        <HeroSection />
        <ProblemSection />
        <ThreePillarsSection />
        <PipelineSection />
        <ViewerSection />
        <QuickStartSection />
      </main>
      <Footer />
    </div>
  );
}
```

**After writing, update `specs/backlog.md` ticket 27.9 to ✅.**

---

## Agent G — Tickets 27.10 + 27.11 + 27.12: Delete, Build, Docs

**Run this AFTER Agent F is complete.**

### Ticket 27.10 — Delete 15 component files

Delete each of these files from `presentation/src/components/landing/`:

```
EvolutionSection.tsx
ContextPoisoningSection.tsx
BreakingPointSection.tsx
CostOfNoSpecsSection.tsx
RolesSection.tsx
SprintMemorySection.tsx
OrchestratorSection.tsx
QASection.tsx
FinOpsSection.tsx
StatsSection.tsx
CompetitiveSection.tsx
CaseStudiesSection.tsx
FutureVisionSection.tsx
ToolsSection.tsx
DocumentationSection.tsx
```

Use `rm` to delete each. Verify none are imported anywhere after deletion.

Update `specs/backlog.md` ticket 27.10 to ✅.

### Ticket 27.11 — Build + QA

```bash
cd /opt/FitnessAiManager/autospec/presentation && npm run build
```

Build must exit 0 with no TypeScript errors.

If build fails, fix the error before proceeding.

Update `specs/backlog.md` ticket 27.11 to ✅ if build passes.

### Ticket 27.12 — Update docs

**File:** `docs/viewer/01_architecture.md`

Read the current file, then prepend or add a section documenting:
- The landing page now has 7 sections (was 22)
- List the 7 kept sections
- Note Sprint 27 redesign date: 2026-03-20
- List the 15 deleted components

Update `specs/backlog.md` ticket 27.12 to ✅.

---

## Final Step (all agents): Git commit

After all tickets are done, from `/opt/FitnessAiManager/autospec/`:

```bash
git add -A
git commit -m "feat(landing): Sprint 27 — landing page redesign to 7 sections

- Create ProblemSection.tsx with degradation timeline
- Rewrite PipelineSection.tsx: 9 steps → 4-phase stepper
- Simplify ViewerSection.tsx: 6 features → 3 benefit blocks
- Update HeroSection.tsx: new subtitle, remove stat row, add presentation link
- Update ThreePillarsSection.tsx: OSS + audit trail copy
- Fix Navigation.tsx and Footer.tsx dead anchors
- Rewrite LandingPage.tsx: 22 imports → 8
- Delete 15 unused component files
- Update docs/viewer/01_architecture.md

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

Then push:
```bash
git push origin main
```
